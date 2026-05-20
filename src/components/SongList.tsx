import React, { useState } from 'react';
import { Song } from '../types';
import { Search, Music, Plus, Edit2, Trash2, SlidersHorizontal, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  onView: (song: Song) => void;
  onEdit: (song: Song) => void;
  onDelete: (songId: string) => void;
  onAddNew: () => void;
}

export default function SongList({ songs, onView, onEdit, onDelete, onAddNew }: SongListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeyFilter, setSelectedKeyFilter] = useState<string>('todos');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Gather unique keys from current songs for quick filter
  const uniqueKeys = ['todos', ...Array.from(new Set(songs.map((s) => s.key))).sort()];

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesKey = selectedKeyFilter === 'todos' || song.key === selectedKeyFilter;

    return matchesSearch && matchesKey;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="song-list-container">
      {/* Search and Filters Hub */}
      <div className="bg-white/50 dark:bg-slate-900/40 p-5 md:p-6 rounded-sm border border-[#1A1A1A]/10 dark:border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Detailed Search input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por título ou artista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F0EFEC] dark:bg-slate-950/60 border-none text-sm rounded-sm focus:ring-1 focus:ring-[#1A1A1A]/20 placeholder:italic text-[#1A1A1A] dark:text-slate-100 transition-all focus:outline-none"
              id="song-search-input"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 dark:text-slate-550" size={15} />
          </div>

          <div className="flex items-center gap-3">
            {/* Clear Filters helper */}
            {(searchQuery || selectedKeyFilter !== 'todos') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedKeyFilter('todos');
                }}
                className="px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 dark:text-slate-400 hover:text-[#1A1A1A] hover:bg-black/5 dark:hover:bg-slate-800 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={11} className="animate-spin-once" />
                <span>Limpar</span>
              </button>
            )}

            {/* Quick action: Add Song */}
            <button
              onClick={onAddNew}
              className="bg-[#1A1A1A] dark:bg-white text-[#FAF9F6] dark:text-[#1A1A1A] hover:opacity-90 px-6 py-3 text-[10px] uppercase tracking-widest font-bold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              id="add-song-main"
            >
              <Plus size={14} />
              <span>Adicionar Música</span>
            </button>
          </div>
        </div>

        {/* Filter by tone bar */}
        {uniqueKeys.length > 2 && (
          <div className="flex items-center gap-3 pt-3 border-t border-[#1A1A1A]/05 dark:border-slate-850/60 overflow-x-auto no-scrollbar py-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/50 dark:text-slate-400 flex items-center gap-1 flex-shrink-0">
              <SlidersHorizontal size={11} />
              Filtrar por Tom:
            </span>
            <div className="flex gap-1.5">
              {uniqueKeys.map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedKeyFilter(k)}
                  className={`px-3 py-1 rounded-sm text-[11px] font-medium transition-all select-none cursor-pointer ${
                    selectedKeyFilter === k
                      ? 'bg-[#1A1A1A] text-[#FAF9F6] dark:bg-white dark:text-slate-950 font-bold'
                      : 'bg-[#F0EFEC] hover:bg-[#FAF9F6]/80 text-[#1A1A1A]/70 dark:bg-slate-850 dark:text-slate-400 border border-transparent'
                  }`}
                >
                  {k === 'todos' ? 'Todos os Tons' : k}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid listing */}
      {filteredSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-[#1A1A1A]/10 dark:border-slate-800 rounded-sm bg-white/20 dark:bg-slate-900/15 text-center text-slate-400">
          <Music className="w-10 h-10 opacity-20 mb-3" />
          <p className="font-editorial italic text-xl text-[#1A1A1A]/70 dark:text-slate-300">Nenhum hino encontrado</p>
          <p className="text-xs max-w-sm mt-1">Refine seus filtros ou cadastre novas canções no banco de hinos do ministério.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="songs-cards-grid">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className="group flex flex-col justify-between p-5 bg-white/40 dark:bg-slate-900/35 border border-[#1A1A1A]/10 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900 rounded-sm transition-all duration-200"
              id={`song-card-${song.id}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold font-sans text-[#1A1A1A] dark:text-slate-100 truncate pr-1">
                      {song.title}
                    </h3>
                    <p className="text-xs text-[#1A1A1A]/50 dark:text-slate-400 truncate mt-0.5 font-sans">
                      {song.artist}
                    </p>
                  </div>

                  {/* Key Indicator */}
                  <span className="flex-shrink-0 px-2.5 py-1 text-[11px] font-mono font-bold bg-[#F3F2EE] dark:bg-slate-800 text-[#1A1A1A] dark:text-slate-300 rounded-sm">
                    {song.key}
                  </span>
                </div>

                {/* Lyrics snippet preview */}
                {song.lyrics && (
                  <p className="text-xs text-[#1A1A1A]/60 dark:text-slate-500 mt-3 line-clamp-2 italic font-editorial border-l border-[#1A1A1A]/20 dark:border-slate-700 pl-2.5">
                    {song.lyrics.replace(/\[.*?\]/g, '').substring(0, 95)}...
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-[#1A1A1A]/05 dark:border-slate-850/50 pt-4 mt-5">
                {/* External link preview if exists */}
                {song.link ? (
                  <a
                    href={song.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#8C7E6A] dark:text-slate-400 hover:opacity-80"
                    title="Link de Demonstração (Ensaio)"
                  >
                    <ExternalLink size={11} />
                    <span>Mídia</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-[#1A1A1A]/30 dark:text-slate-550 italic">Sem link</span>
                )}

                {/* Action set */}
                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onView(song)}
                    className="p-2 text-[#1A1A1A] hover:bg-black/5 dark:text-slate-300 dark:hover:bg-slate-800 rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                    title="Visualizar Letra"
                  >
                    <BookOpen size={13} />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Ver Letra</span>
                  </button>

                  <button
                    onClick={() => onEdit(song)}
                    className="p-2 text-[#1A1A1A]/65 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-black/5 dark:hover:bg-slate-800 rounded-sm transition-colors cursor-pointer"
                    title="Editar"
                    id={`edit-song-${song.id}`}
                  >
                    <Edit2 size={13} />
                  </button>

                  {confirmDeleteId === song.id ? (
                    <div className="flex items-center gap-1.5 animate-fade-in bg-red-50 dark:bg-red-955/20 px-1.5 py-0.5 rounded-sm border border-red-200/40">
                      <button
                        onClick={() => {
                          onDelete(song.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-0.5 text-[9px] tracking-wide font-bold uppercase bg-red-650 text-white rounded-sm hover:opacity-95"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-0.5 text-[9px] tracking-wide font-bold uppercase bg-stone-200 dark:bg-slate-800 text-[#1A1A1A] dark:text-slate-300 rounded-sm hover:opacity-95"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(song.id)}
                      className="p-2 text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-955/35 rounded-sm transition-colors cursor-pointer"
                      title="Excluir"
                      id={`delete-song-${song.id}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
