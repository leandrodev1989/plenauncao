import React, { useState } from 'react';
import { Song } from '../types';
import { X, ExternalLink, Type, Music, Play, Youtube, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SongModalProps {
  song: Song | null;
  onClose: () => void;
}

export default function SongModal({ song, onClose }: SongModalProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl' | '2xl'>('lg');

  if (!song) return null;

  const fontStyle = {
    sm: 'text-sm leading-relaxed font-editorial',
    base: 'text-base leading-relaxed font-editorial',
    lg: 'text-lg md:text-xl leading-relaxed font-editorial',
    xl: 'text-xl md:text-2xl leading-relaxed font-editorial',
    '2xl': 'text-2xl md:text-3xl leading-relaxed font-editorial italic',
  }[fontSize];

  // Simple attempt to detect YouTube vs Spotify for beautiful icon representations
  const isYoutube = song.link?.toLowerCase().includes('youtube.com') || song.link?.toLowerCase().includes('youtu.be');

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs cursor-pointer" 
        id="song-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-[#FAF9F6] dark:bg-slate-900 rounded-sm shadow-2xl overflow-hidden border border-[#1A1A1A]/10 dark:border-slate-800 cursor-default"
          id="song-modal-container"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[#1A1A1A]/10 dark:border-slate-800 bg-[#F5F4EF] dark:bg-slate-900/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-bold bg-[#1A1A1A] text-[#FAF9F6] dark:bg-white dark:text-slate-950 rounded-sm">
                  Tom: {song.key}
                </span>
                {song.link && (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Mídia ativa
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-light font-editorial italic text-[#1A1A1A] dark:text-white">
                {song.title}
              </h3>
              <p className="text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 dark:text-slate-400 mt-1">
                {song.artist}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/15 text-[#1A1A1A] dark:bg-white/5 dark:hover:bg-white/15 dark:text-white border border-[#1A1A1A]/10 dark:border-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Fechar"
              id="song-modal-close-btn"
            >
              <X size={12} stopPropagation="true" />
              <span>Fechar</span>
            </button>
          </div>

          {/* Controls Bar for font sizes & Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FAF9F6] dark:bg-slate-900 border-b border-[#1A1A1A]/10 dark:border-slate-850 text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/60 dark:text-slate-400">
            {/* Font Size Selector */}
            <div className="flex items-center gap-2">
              <Type size={12} className="text-[#1A1A1A]/40" />
              <span>Tamanho da letra:</span>
              <div className="flex bg-[#F0EFEC] dark:bg-slate-800 rounded-sm p-0.5 border border-[#1A1A1A]/05">
                {(['sm', 'base', 'lg', 'xl', '2xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-1 rounded-sm text-[9px] font-bold uppercase transition-all ${
                      fontSize === sz
                        ? 'bg-[#1A1A1A] text-[#FAF9F6] dark:bg-white dark:text-slate-950 shadow-sm'
                        : 'hover:bg-[#FAF9F6] text-[#1A1A1A]/60 dark:hover:bg-slate-700'
                    }`}
                  >
                    {sz === 'base' ? 'md' : sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {song.link ? (
              <a
                href={song.link}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] text-[#FAF9F6] dark:bg-white dark:text-slate-950 text-[10px] uppercase tracking-widest font-bold rounded-full transition-colors"
              >
                {isYoutube ? (
                  <Youtube size={12} className="text-red-500 fill-current" />
                ) : (
                  <Play size={10} className="fill-current" />
                )}
                <span>Ouvir Hino</span>
                <ExternalLink size={10} />
              </a>
            ) : (
              <span className="flex items-center gap-1 text-[#1A1A1A]/30 dark:text-slate-500 italic">
                <AlertCircle size={11} />
                Link não configurado
              </span>
            )}
          </div>

          {/* Lyrics Box */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#FAF9F6] dark:bg-slate-950/20">
            <div className="max-w-xl mx-auto text-center" id="lyrics-render-box">
              {song.lyrics ? (
                song.lyrics.split('\n').map((line, idx) => {
                  const trimmed = line.trim();
                  // Check if this is a chord line or structure label line
                  const isStructureLabel = trimmed.startsWith('[') && trimmed.endsWith(']');
                  
                  if (isStructureLabel) {
                    return (
                      <div
                        key={idx}
                        className="my-5 font-editorial tracking-widest text-xs text-[#8C7E6A] dark:text-slate-400 italic opacity-80 select-none before:content-['—_'] after:content-['_—'] font-semibold"
                      >
                        {trimmed.substring(1, trimmed.length - 1)}
                      </div>
                    );
                  }

                  if (trimmed === '') {
                    return <div key={idx} className="h-4" />;
                  }

                  return (
                    <p
                      key={idx}
                      className={`${fontStyle} text-[#1A1A1A]/85 dark:text-slate-200 transition-all duration-150 py-0.5`}
                    >
                      {line}
                    </p>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Music className="mx-auto mb-3 opacity-20" size={40} />
                  <p className="font-editorial italic text-lg text-[#1A1A1A]/60">Nenhuma letra cadastrada para esta música.</p>
                  <p className="text-xs mt-1">Abra o formulário de edição para inserir a letra completa de ensaio.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer view indicator */}
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[10px] uppercase tracking-[0.15em] font-medium text-[#1A1A1A]/50 dark:text-slate-400 bg-[#F5F4EF] dark:bg-slate-900 border-t border-[#1A1A1A]/10 dark:border-slate-800">
            <span>Modo Leitura — Plena Unção Digital</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-[9px] uppercase tracking-widest font-bold bg-[#1A1A1A] hover:bg-[#1A1A1A]/95 text-white dark:bg-white dark:text-slate-950 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Fechar Leitura
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
