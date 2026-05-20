import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { Music, Save, RotateCcw, Youtube, HelpCircle, Check, ArrowLeft, Info } from 'lucide-react';

interface SongFormProps {
  song: Song | null;
  onSave: (songData: Omit<Song, 'id'>) => void;
  onCancel: () => void;
}

const COMMON_KEYS = [
  'C', 'C#', 'D', 'Db', 'D#', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'Ab', 'A', 'Bb', 'B',
  'Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'
];

export default function SongForm({ song, onSave, onCancel }: SongFormProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [key, setKey] = useState('C');
  const [lyrics, setLyrics] = useState('');
  const [link, setLink] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtist(song.artist);
      setKey(song.key);
      setLyrics(song.lyrics);
      setLink(song.link || '');
    } else {
      setTitle('');
      setArtist('');
      setKey('C');
      setLyrics('');
      setLink('');
    }
    setErrors({});
  }, [song]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'O nome da música é obrigatório.';
    if (!artist.trim()) newErrors.artist = 'O cantor(a) ou banda é obrigatório.';
    if (!key.trim()) newErrors.key = 'O tom da música é obrigatório.';

    if (link.trim() && !link.match(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/)) {
      newErrors.link = 'Por favor, insira um link válido (YouTube ou Spotify).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of form or focus
      return;
    }

    onSave({
      title: title.trim(),
      artist: artist.trim(),
      key,
      lyrics: lyrics.trim(),
      link: link.trim()
    });
  };

  return (
    <div className="bg-white/40 dark:bg-slate-900/35 rounded-sm border border-[#1A1A1A]/10 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in" id="song-form-wrapper">
      <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 dark:border-slate-800 p-6 bg-[#F5F4EF] dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 text-[#1A1A1A]/40 hover:text-[#1A1A1A] dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-slate-800 rounded-sm transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-light font-editorial italic text-[#1A1A1A] dark:text-white">
              {song ? 'Editar Hino' : 'Adicionar Novo Hino'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 text-[#1A1A1A] dark:text-slate-400 mt-0.5">
              {song ? 'Atualize as informações do hino' : 'Registre uma nova música na partitura digital'}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 dark:text-slate-300 bg-[#FAF9F6] dark:bg-slate-800 border border-[#1A1A1A]/05 px-2.5 py-1 rounded-sm">
          <Info size={11} className="text-[#8C7E6A]" />
          * Obrigatórios
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6" id="song-entry-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 dark:text-slate-400">
              Nome do Hino *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Porque Ele Vive, Todavia Me Alegrarei"
              className={`w-full px-4 py-3 bg-[#F0EFEC] dark:bg-slate-950/60 border-none text-sm rounded-sm placeholder:italic text-[#1A1A1A] dark:text-slate-100 transition-all focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]/25`}
              id="song-title-input"
            />
            {errors.title && <p className="text-[11px] text-red-550 font-medium">{errors.title}</p>}
          </div>

          {/* Artist */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 dark:text-slate-400">
              Cantor(a), Banda ou Autor *
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="ex: Harpa Cristã, Samuel Messias"
              className={`w-full px-4 py-3 bg-[#F0EFEC] dark:bg-slate-950/60 border-none text-sm rounded-sm placeholder:italic text-[#1A1A1A] dark:text-slate-100 transition-all focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]/25`}
              id="song-artist-input"
            />
            {errors.artist && <p className="text-[11px] text-red-550 font-medium">{errors.artist}</p>}
          </div>
        </div>

        {/* Tone Selection (Common Keys Grid) */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-end">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 dark:text-slate-400">
              Tom Principal *
            </label>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C7E6A] dark:text-slate-300 bg-[#FAF9F6] dark:bg-slate-800 px-2 py-0.5 rounded-sm border border-[#1A1A1A]/05">
              Tom Selecionado: {key}
            </span>
          </div>
          
          <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-12 gap-1.5 p-3.5 bg-[#FAF9F6] dark:bg-slate-950/20 rounded-sm border border-[#1A1A1A]/05 dark:border-slate-850">
            {COMMON_KEYS.map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setKey(k)}
                className={`py-2 px-1 rounded-sm text-xs font-mono font-bold transition-all select-none cursor-pointer ${
                  key === k
                    ? 'bg-[#1A1A1A] text-[#FAF9F6] dark:bg-white dark:text-slate-950 font-extrabold shadow-xs'
                    : 'bg-white dark:bg-slate-900 hover:bg-black/5 text-[#1A1A1A]/70 dark:text-slate-300 border border-[#1A1A1A]/10 dark:border-slate-800'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Simple write-in chord key backup */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-[#1A1A1A]/50 dark:text-slate-400 italic font-editorial">Personalizado:</span>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="ex: F#m"
              className="max-w-[70px] text-center px-2 py-0.5 border border-[#1A1A1A]/20 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-sm text-xs font-mono text-[#1A1A1A] dark:text-slate-300 uppercase focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
        </div>

        {/* YouTube / Spotify Link */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 dark:text-slate-400">
              Link de Demonstração (YouTube ou Spotify)
            </label>
            <span className="text-[10px] text-[#1a1a1abe] dark:text-slate-500 flex items-center gap-1 font-editorial italic">
              <Youtube size={12} className="text-red-500" />
              Vídeo ou áudio de exemplo
            </span>
          </div>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`w-full px-4 py-3 bg-[#F0EFEC] dark:bg-slate-950/60 border-none text-sm rounded-sm placeholder:italic text-[#1A1A1A] dark:text-slate-100 transition-all focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]/25`}
            id="song-link-input"
          />
          {errors.link && <p className="text-[11px] text-red-550 font-medium">{errors.link}</p>}
        </div>

        {/* Complete Lyrics */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 dark:text-slate-400">
              Letra Completa do Hino
            </label>
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A]/40 dark:text-slate-500">
              Colchetes criam marcadores (ex: <code className="bg-[#FAF9F6] dark:bg-slate-800 px-1 py-0.5 font-mono">[Coro]</code>)
            </span>
          </div>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="[Introdução]&#10;G C G D&#10;&#10;[Verso 1]&#10;Deus enviou Seu Filho amado...&#10;&#10;[Coro]&#10;Porque Ele vive, posso crer no amanhã..."
            rows={10}
            className="w-full px-4 py-3 bg-[#F0EFEC] dark:bg-slate-950/60 border-none text-sm font-mono rounded-sm text-[#1A1A1A] dark:text-slate-100 transition-all focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]/25"
            id="song-lyrics-input"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-[#1A1A1A]/10 dark:border-slate-850">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-black/5 dark:text-slate-350 dark:hover:bg-slate-850 border border-transparent rounded-full transition-all"
            id="song-form-cancel-btn"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-[#1A1A1A] dark:bg-white text-[#FAF9F6] dark:text-[#1A1A1A] hover:opacity-90 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            id="song-form-submit-btn"
          >
            <Save size={13} />
            <span>{song ? 'Salvar Hino' : 'Adicionar ao Repertório'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
