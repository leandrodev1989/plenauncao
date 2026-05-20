import React, { useState, useEffect } from 'react';
import { Song, Setlist, SetlistItem } from '../types';
import { Save, Search, Plus, Trash2, ArrowUp, ArrowDown, Calendar, ArrowLeft, Info, Music } from 'lucide-react';

interface SetlistFormProps {
  setlist: Setlist | null;
  songs: Song[];
  onSave: (setlistData: Omit<Setlist, 'id'>) => void;
  onCancel: () => void;
}

export default function SetlistForm({ setlist, songs, onSave, onCancel }: SetlistFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedItems, setSelectedItems] = useState<SetlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (setlist) {
      setName(setlist.name);
      setDate(setlist.date);
      setSelectedItems(setlist.items || []);
    } else {
      setName('');
      // Set default date to today in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setSelectedItems([]);
    }
    setErrors({});
  }, [setlist]);

  const toggleSong = (songId: string) => {
    const isSelected = selectedItems.some((item) => item.songId === songId);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((item) => item.songId !== songId));
    } else {
      setSelectedItems([...selectedItems, { songId, played: false }]);
    }
  };

  const removeSong = (songId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.songId !== songId));
  };

  const moveSong = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedItems.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...selectedItems];
    
    // Swap items
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setSelectedItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'O nome do culto é obrigatório.';
    if (!date) newErrors.date = 'A data do culto é obrigatória.';
    if (selectedItems.length === 0) newErrors.songs = 'Por favor, selecione pelo menos uma música para o repertório.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      date,
      items: selectedItems
    });
  };

  // Filter songs by search input
  const filteredSongs = songs.filter((song) => {
    const query = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.key.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden" id="setlist-form-wrapper">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg md:text-xl font-display font-semibold text-slate-800 dark:text-slate-100">
              {setlist ? 'Editar Repertório' : 'Criar Novo Repertório'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure a data, o nome do culto e organize a ordem dos hinos
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-6" id="setlist-setup-form">
        {/* Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Service Name */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nome do Culto *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Culto de Avivamento, Domingo à Noite, Santa Ceia"
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100/50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border ${
                errors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-800 focus:ring-violet-500/10 focus:border-violet-500'
              } rounded-xl text-sm transition-all focus:outline-none focus:ring-4`}
              id="setlist-name-input"
            />
            {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
          </div>

          {/* Service Date */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Data do Culto *
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100/50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border ${
                  errors.date ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-800 focus:ring-violet-500/10 focus:border-violet-500'
                } rounded-xl text-sm transition-all focus:outline-none focus:ring-4`}
                id="setlist-date-input"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 pointer-events-none" size={16} />
            </div>
            {errors.date && <p className="text-[11px] text-red-500 font-medium">{errors.date}</p>}
          </div>
        </div>

        {/* Selected Songs / Search Selection split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* LEFT: Selected Songs list (Reorder & Remove) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Hinos Selecionados ({selectedItems.length})
              </h3>
              {selectedItems.length > 1 && (
                <span className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-950/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ArrowUp size={11} /> Use as setas para ordenar no culto!
                </span>
              )}
            </div>

            {errors.songs && (
              <p className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30 rounded-xl">
                {errors.songs}
              </p>
            )}

            {selectedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20 text-center text-slate-400 dark:text-slate-500 min-h-[180px]">
                <Music className="w-8 h-8 opacity-20 mb-2" />
                <p className="font-medium text-sm">Nhum hino adicionado ainda</p>
                <p className="text-xs max-w-xs mt-1">Busque e selecione músicas na lista ao lado para compor seu repertório</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1" id="selected-songs-order-list">
                {selectedItems.map((item, index) => {
                  const s = songs.find((song) => song.id === item.songId);
                  if (!s) return null;

                  return (
                    <div
                      key={item.songId}
                      className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-xl transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Numerical Badge */}
                        <span className="flex-shrink-0 flex items-center justify-center w-6.5 h-6.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded-lg text-xs font-mono font-bold">
                          {index + 1}
                        </span>
                        
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate pr-2">
                            {s.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {s.artist} • <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold">Tom: {s.key}</span>
                          </p>
                        </div>
                      </div>

                      {/* Controls inside list */}
                      <div className="flex items-center gap-1.5 ml-2">
                        {/* Order Controls */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveSong(index, 'up')}
                          className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors ${
                            index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title="Mover para cima"
                        >
                          <ArrowUp size={14} />
                        </button>
                        
                        <button
                          type="button"
                          disabled={index === selectedItems.length - 1}
                          onClick={() => moveSong(index, 'down')}
                          className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors ${
                            index === selectedItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title="Mover para baixo"
                        >
                          <ArrowDown size={14} />
                        </button>

                        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeSong(item.songId)}
                          className="p-1.5 rounded-lg border border-red-100 dark:border-red-950/30 bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Search and select songs from Library */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Buscar Músicas
            </h3>

            {/* Micro search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por hino ou cantor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100/50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>

            {/* Song Grid picker */}
            <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1" id="song-picker-panel">
              {filteredSongs.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Nenhuma música encontrada
                </div>
              ) : (
                filteredSongs.map((song) => {
                  const isSelected = selectedItems.some((item) => item.songId === song.id);

                  return (
                    <button
                      type="button"
                      key={song.id}
                      onClick={() => toggleSong(song.id)}
                      className={`w-full flex items-center justify-between p-2.5 text-left rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900 text-violet-900 dark:text-violet-100 ring-2 ring-violet-500/10'
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold truncate">
                          {song.title}
                        </p>
                        <p className="text-[10px] text-slate-550 dark:text-slate-400 truncate mt-0.5">
                          {song.artist} • <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">{song.key}</span>
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <span className="flex items-center justify-center w-5 h-5 bg-violet-600 text-white rounded-full">
                            <Plus size={12} className="rotate-45" />
                          </span>
                        ) : (
                          <span className="flex items-center justify-center w-5 h-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-violet-100 hover:text-violet-700 rounded-full transition-colors">
                            <Plus size={12} />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl transition-all"
            id="setlist-form-cancel"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 hover:shadow-lg dark:hover:shadow-violet-950/25 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            id="setlist-form-submit"
          >
            <Save size={16} />
            <span>{setlist ? 'Salvar Alterações' : 'Criar Repertório'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
