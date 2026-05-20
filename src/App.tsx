/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Song, Setlist, SetlistItem } from './types';
import { INITIAL_SONGS, INITIAL_SETLISTS } from './data/initialData';
import SongList from './components/SongList';
import SongForm from './components/SongForm';
import SongModal from './components/SongModal';
import SetlistList from './components/SetlistList';
import SetlistForm from './components/SetlistForm';
import SetlistDetails from './components/SetlistDetails';
import { Music, ListMusic, Moon, Sun, Library, Info, Settings, Heart, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  isSupabaseConfigured,
  getSongsFromSupabase,
  saveSongToSupabase,
  deleteSongFromSupabase,
  getSetlistsFromSupabase,
  saveSetlistToSupabase,
  deleteSetlistFromSupabase
} from './supabase';

type ViewState = 
  | 'songs' 
  | 'song-form' 
  | 'setlists' 
  | 'setlist-details' 
  | 'setlist-form';

export default function App() {
  // Application State
  const [songs, setSongs] = useState<Song[]>([]);
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [activeView, setActiveView] = useState<ViewState>('songs');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activeSongForEdit, setActiveSongForEdit] = useState<Song | null>(null);
  const [activeSetlistId, setActiveSetlistId] = useState<string | null>(null);
  const [activeSetlistForEdit, setActiveSetlistForEdit] = useState<Setlist | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [supabaseStatus, setSupabaseStatus] = useState<'loading' | 'connected' | 'error' | 'disabled'>('loading');
  
  // Quick notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data with Supabase loading and LocalStorage syncing/fallback
  useEffect(() => {
    const storedTheme = localStorage.getItem('repertorio_theme');

    // Set theme
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    async function initData() {
      if (!isSupabaseConfigured) {
        setSupabaseStatus('disabled');
        loadFromLocalStorage();
        return;
      }

      try {
        setSupabaseStatus('loading');
        const dbSongs = await getSongsFromSupabase();
        const dbSetlists = await getSetlistsFromSupabase();

        if (dbSongs === null || dbSetlists === null) {
          setSupabaseStatus('error');
          loadFromLocalStorage();
          return;
        }

        setSupabaseStatus('connected');

        // If Supabase has zero data, seed it using user's existing local or default initial data
        if (dbSongs.length === 0 && dbSetlists.length === 0) {
          const localSongsStr = localStorage.getItem('repertorio_songs');
          const localSetlistsStr = localStorage.getItem('repertorio_setlists');
          
          const songsToSeed = localSongsStr ? JSON.parse(localSongsStr) : INITIAL_SONGS;
          const setlistsToSeed = localSetlistsStr ? JSON.parse(localSetlistsStr) : INITIAL_SETLISTS;

          setSongs(songsToSeed);
          setSetlists(setlistsToSeed);

          // Silent background seed
          for (const s of songsToSeed) {
            await saveSongToSupabase(s);
          }
          for (const sl of setlistsToSeed) {
            await saveSetlistToSupabase(sl);
          }
        } else {
          setSongs(dbSongs);
          setSetlists(dbSetlists);
        }
      } catch (err) {
        console.error('Initial sync error with Supabase:', err);
        setSupabaseStatus('error');
        loadFromLocalStorage();
      }
    }

    function loadFromLocalStorage() {
      const storedSongs = localStorage.getItem('repertorio_songs');
      const storedSetlists = localStorage.getItem('repertorio_setlists');

      if (storedSongs) {
        setSongs(JSON.parse(storedSongs));
      } else {
        setSongs(INITIAL_SONGS);
        localStorage.setItem('repertorio_songs', JSON.stringify(INITIAL_SONGS));
      }

      if (storedSetlists) {
        setSetlists(JSON.parse(storedSetlists));
      } else {
        setSetlists(INITIAL_SETLISTS);
        localStorage.setItem('repertorio_setlists', JSON.stringify(INITIAL_SETLISTS));
      }
    }

    initData();
  }, []);

  // Save changes helper
  const saveSongsState = (newSongs: Song[]) => {
    setSongs(newSongs);
    localStorage.setItem('repertorio_songs', JSON.stringify(newSongs));
  };

  const saveSetlistsState = (newSetlists: Setlist[]) => {
    setSetlists(newSetlists);
    localStorage.setItem('repertorio_setlists', JSON.stringify(newSetlists));
  };

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle Dark theme
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('repertorio_theme', 'dark');
      showToast('Modo Escuro ativado! Ideal para o púlpito.');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('repertorio_theme', 'light');
      showToast('Modo Claro ativado.');
    }
  };

  // --- SONGS CRUD HANDLERS ---
  const handleSaveSong = async (songData: Omit<Song, 'id'>) => {
    let savedSong: Song;
    if (activeSongForEdit) {
      // Editing
      savedSong = { ...activeSongForEdit, ...songData };
      const updatedSongs = songs.map((s) => 
        s.id === activeSongForEdit.id ? savedSong : s
      );
      saveSongsState(updatedSongs);
      showToast(`Música "${songData.title}" atualizada com sucesso!`);
    } else {
      // Creating new
      savedSong = {
        id: `song-${Date.now()}`,
        ...songData
      };
      saveSongsState([...songs, savedSong]);
      showToast(`Música "${songData.title}" cadastrada!`);
    }

    // Remote save to Supabase
    if (isSupabaseConfigured) {
      try {
        const success = await saveSongToSupabase(savedSong);
        if (!success) {
          showToast('Aviso: Não foi possível sincronizar no banco de dados.');
        }
      } catch (err) {
        console.error('Supabase save error:', err);
      }
    }

    setActiveSongForEdit(null);
    setActiveView('songs');
  };

  const handleDeleteSong = async (songId: string) => {
    // Find song title
    const songToDelete = songs.find((s) => s.id === songId);
    if (!songToDelete) return;

    // Filter out of songs
    const updatedSongs = songs.filter((s) => s.id !== songId);
    saveSongsState(updatedSongs);

    // Remove from existing setlists too
    const updatedSetlists = setlists.map((setlist) => ({
      ...setlist,
      items: setlist.items.filter((item) => item.songId !== songId)
    }));
    saveSetlistsState(updatedSetlists);

    showToast(`Música "${songToDelete.title}" excluída.`);

    // Remote delete from Supabase
    if (isSupabaseConfigured) {
      try {
        await deleteSongFromSupabase(songId);
        // Cascade deleting: update setlists in Supabase that used this song
        for (const setlist of updatedSetlists) {
          await saveSetlistToSupabase(setlist);
        }
      } catch (err) {
        console.error('Supabase cascade delete error:', err);
      }
    }
  };

  const handleEditSongTrigger = (song: Song) => {
    setActiveSongForEdit(song);
    setActiveView('song-form');
  };

  // --- SETLISTS CRUD HANDLERS ---
  const handleSaveSetlist = async (setlistData: Omit<Setlist, 'id'>) => {
    let savedSetlist: Setlist;
    if (activeSetlistForEdit) {
      // Editing
      savedSetlist = { ...activeSetlistForEdit, ...setlistData };
      const updatedSetlists = setlists.map((sl) => 
        sl.id === activeSetlistForEdit.id ? savedSetlist : sl
      );
      saveSetlistsState(updatedSetlists);
      showToast(`Repertório "${setlistData.name}" atualizado!`);
      // Update target active list view if it was selected
      if (activeSetlistId === activeSetlistForEdit.id) {
        setActiveView('setlist-details');
      } else {
        setActiveView('setlists');
      }
    } else {
      // Creating new
      savedSetlist = {
        id: `setlist-${Date.now()}`,
        ...setlistData
      };
      saveSetlistsState([...setlists, savedSetlist]);
      showToast(`Repertório "${setlistData.name}" criado!`);
      // Open details directly to view it
      setActiveSetlistId(savedSetlist.id);
      setActiveView('setlist-details');
    }

    // Remote save to Supabase
    if (isSupabaseConfigured) {
      try {
        const success = await saveSetlistToSupabase(savedSetlist);
        if (!success) {
          showToast('Aviso: Não foi possível sincronizar o repertório no banco.');
        }
      } catch (err) {
        console.error('Supabase setlist save error:', err);
      }
    }

    setActiveSetlistForEdit(null);
  };

  const handleDeleteSetlist = async (setlistId: string) => {
    const updatedSetlists = setlists.filter((sl) => sl.id !== setlistId);
    saveSetlistsState(updatedSetlists);
    showToast('Repertório excluído.');
    setActiveSetlistId(null);
    setActiveView('setlists');

    // Remote delete from Supabase
    if (isSupabaseConfigured) {
      try {
        await deleteSetlistFromSupabase(setlistId);
      } catch (err) {
        console.error('Supabase setlist delete error:', err);
      }
    }
  };

  const handleEditSetlistTrigger = (setlist: Setlist) => {
    setActiveSetlistForEdit(setlist);
    setActiveView('setlist-form');
  };

  // Toggle played status inside a setlist
  const handleTogglePlayed = async (setlistId: string, songId: string) => {
    let targetSetlist: Setlist | null = null;
    const updatedSetlists = setlists.map((sl) => {
      if (sl.id === setlistId) {
        targetSetlist = {
          ...sl,
          items: sl.items.map((item) => 
            item.songId === songId ? { ...item, played: !item.played } : item
          )
        };
        return targetSetlist;
      }
      return sl;
    });

    saveSetlistsState(updatedSetlists);

    // Fetch the target song name for subtle celebration
    const song = songs.find((s) => s.id === songId);
    const setlist = setlists.find((sl) => sl.id === setlistId);
    if (song && setlist) {
      const isNowPlayed = updatedSetlists
        .find((sl) => sl.id === setlistId)
        ?.items.find((item) => item.songId === songId)?.played;
      
      if (isNowPlayed) {
        showToast(`Hino "${song.title}" marcado como tocado! 🎵`);
      }
    }

    // Remote save to Supabase
    if (isSupabaseConfigured && targetSetlist) {
      try {
        await saveSetlistToSupabase(targetSetlist);
      } catch (err) {
        console.error('Supabase toggle played error:', err);
      }
    }
  };

  // Computed state for active setlist view
  const currentActiveSetlist = setlists.find((sl) => sl.id === activeSetlistId) || null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-950 font-sans text-[#1A1A1A] dark:text-slate-200 transition-colors duration-200">
      
      {/* Upper Navigation/Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-[#1A1A1A]/10 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6 flex flex-col sm:flex-row gap-4 sm:items-end justify-between">
          
          {/* Brand Logo & Name */}
          <div className="flex flex-col animate-fade-in">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 text-[#1A1A1A] dark:text-slate-400">
              Ministério de Louvor
            </span>
            <h1 className="text-3xl md:text-4xl italic font-light tracking-tight font-editorial text-[#1A1A1A] dark:text-white">
              Plena Unção
            </h1>
          </div>

          {/* Nav Links for Tablet/Desktop and theme picker */}
          <div className="flex items-center gap-6 self-start sm:self-auto">
            <nav className="flex items-center gap-6">
              <button
                onClick={() => {
                  setActiveView('songs');
                  setActiveSetlistId(null);
                }}
                className={`text-[11px] uppercase tracking-widest font-bold pb-1 transition-all cursor-pointer ${
                  activeView === 'songs' || activeView === 'song-form'
                    ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white font-extrabold'
                    : 'opacity-40 hover:opacity-100 text-[#1A1A1A] dark:text-slate-400 border-b-2 border-transparent'
                }`}
              >
                <span>Músicas</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveView('setlists');
                  setActiveSetlistId(null);
                }}
                className={`text-[11px] uppercase tracking-widest font-bold pb-1 transition-all cursor-pointer ${
                  activeView === 'setlists' || activeView === 'setlist-details' || activeView === 'setlist-form'
                    ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white font-extrabold'
                    : 'opacity-40 hover:opacity-100 text-[#1A1A1A] dark:text-slate-400 border-b-2 border-transparent'
                }`}
              >
                <span>Repertórios</span>
              </button>
            </nav>

            <div className="w-px h-4 bg-[#1A1A1A]/10 dark:bg-slate-800" />

            {/* Quick theme control */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] dark:text-slate-400 dark:hover:text-slate-200 transition-all cursor-pointer rounded-full"
              aria-label="Alternar Tema"
              title="Mudar cores (Ensaios vs. Palco)"
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView + (activeSetlistId || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >

            {/* View Switching Core Router */}
            {activeView === 'songs' && (
              <SongList
                songs={songs}
                onView={(song) => setSelectedSong(song)}
                onEdit={handleEditSongTrigger}
                onDelete={handleDeleteSong}
                onAddNew={() => {
                  setActiveSongForEdit(null);
                  setActiveView('song-form');
                }}
              />
            )}

            {activeView === 'song-form' && (
              <SongForm
                song={activeSongForEdit}
                onSave={handleSaveSong}
                onCancel={() => {
                  setActiveSongForEdit(null);
                  setActiveView('songs');
                }}
              />
            )}

            {activeView === 'setlists' && (
              <SetlistList
                setlists={setlists}
                songs={songs}
                onSelect={(sl) => {
                  setActiveSetlistId(sl.id);
                  setActiveView('setlist-details');
                }}
                onAddNew={() => {
                  setActiveSetlistForEdit(null);
                  setActiveView('setlist-form');
                }}
              />
            )}

            {activeView === 'setlist-details' && currentActiveSetlist && (
              <SetlistDetails
                setlist={currentActiveSetlist}
                songs={songs}
                onTogglePlayed={handleTogglePlayed}
                onEdit={() => handleEditSetlistTrigger(currentActiveSetlist)}
                onDelete={() => handleDeleteSetlist(currentActiveSetlist.id)}
                onViewSong={(song) => setSelectedSong(song)}
                onBack={() => {
                  setActiveSetlistId(null);
                  setActiveView('setlists');
                }}
              />
            )}

            {activeView === 'setlist-form' && (
              <SetlistForm
                setlist={activeSetlistForEdit}
                songs={songs}
                onSave={handleSaveSetlist}
                onCancel={() => {
                  setActiveSetlistForEdit(null);
                  if (activeSetlistId) {
                    setActiveView('setlist-details');
                  } else {
                    setActiveView('setlists');
                  }
                }}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigator for Mobile/Touch View (Excellent Mobile Device Simulation) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-100 dark:border-slate-800 p-2 sm:hidden backdrop-blur-md">
        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          
          <button
            onClick={() => {
              setActiveView('songs');
              setActiveSetlistId(null);
            }}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all cursor-pointer ${
              activeView === 'songs' || activeView === 'song-form'
                ? 'bg-violet-600/10 text-violet-600 dark:text-violet-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Library size={18} />
            <span className="text-[10px] mt-1 font-semibold">Músicas (Hinos)</span>
          </button>

          <button
            onClick={() => {
              setActiveView('setlists');
              setActiveSetlistId(null);
            }}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all cursor-pointer ${
              activeView === 'setlists' || activeView === 'setlist-details' || activeView === 'setlist-form'
                ? 'bg-violet-600/10 text-violet-600 dark:text-violet-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <ListMusic size={18} />
            <span className="text-[10px] mt-1 font-semibold">Repertórios</span>
          </button>

        </div>
      </div>

      {/* IMMERSIVE SONG / LYRICS READING VIEW MODAL */}
      <SongModal
        song={selectedSong}
        onClose={() => setSelectedSong(null)}
      />

      {/* Floating alert micro-toast helper */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-18 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-[#FAF9F6] dark:bg-white dark:text-[#1A1A1A] rounded-xl shadow-lg border border-[#1A1A1A]/10 max-w-xs md:max-w-md text-xs font-semibold"
            id="toast-notification"
          >
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Footer */}
      <footer className="w-full bg-[#1A1A1A] text-[#FAF9F6] dark:bg-slate-900 border-t border-[#1A1A1A]/15 py-10 mt-16 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] uppercase tracking-[0.3em] font-medium opacity-60">
          <span>Plena Unção v1.1.2</span>
          <span>Design Editorial para Louvores</span>
          <span>© 2026</span>
        </div>
      </footer>

    </div>
  );
}
