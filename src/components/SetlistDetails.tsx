import React, { useState } from 'react';
import { Setlist, Song } from '../types';
import {
  Calendar,
  CheckCircle2,
  Share2,
  Trash2,
  Edit,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  ChevronRight,
  Music,
  Share,
  Printer
} from 'lucide-react';
import { motion } from 'motion/react';

interface SetlistDetailsProps {
  setlist: Setlist;
  songs: Song[];
  onTogglePlayed: (setlistId: string, songId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewSong: (song: Song) => void;
  onBack: () => void;
}

export default function SetlistDetails({
  setlist,
  songs,
  onTogglePlayed,
  onEdit,
  onDelete,
  onViewSong,
  onBack
}: SetlistDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Format date helper: e.g. "Quarta-feira, 24/05/2026"
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      const config: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };
      const formatted = dateObj.toLocaleDateString('pt-BR', config);
      // Capitalize first letter
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return dateStr;
    }
  };

  // Check how many are played
  const totalSongs = setlist.items?.length || 0;
  const playedSongs = setlist.items?.filter((item) => item.played).length || 0;
  const progressPercent = totalSongs > 0 ? Math.round((playedSongs / totalSongs) * 100) : 0;

  // Generate beautiful WhatsApp message for copying
  const handleCopyWarpLink = () => {
    let msg = `*🎵 REPERTÓRIO: ${setlist.name.toUpperCase()}*\n`;
    msg += `*📅 Data:* ${formatDate(setlist.date)}\n\n`;
    msg += `------------------------------------\n`;
    
    setlist.items.forEach((item, index) => {
      const s = songs.find((song) => song.id === item.songId);
      if (s) {
        msg += `${index + 1}. *${s.title}* (${s.artist}) - *Tom: ${s.key}*\n`;
        if (s.link) msg += `   🔗 Link: ${s.link}\n`;
        msg += `\n`;
      }
    });

    msg += `_Gerado via Repertório de Louvor_ 🕊️`;

    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/40 dark:bg-slate-900/35 rounded-sm border border-[#1A1A1A]/10 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in" id="setlist-details-dashboard">
      {/* Upper Navigation & Stats Banner */}
      <div className="p-6 md:p-8 bg-[#F5F4EF] dark:bg-slate-900/50 border-b border-[#1A1A1A]/10 dark:border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors mb-5 pb-1 cursor-pointer"
          id="detail-back-btn"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Repertórios</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#8C7E6A] dark:text-slate-400 mb-2">
              <Calendar size={13} />
              <span>{formatDate(setlist.date)}</span>
            </div>
            <h2 className="text-3xl font-light font-editorial italic text-[#1A1A1A] dark:text-white">
              {setlist.name}
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyWarpLink}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-full transition-all cursor-pointer border ${
                copied
                  ? 'bg-[#E3ECD5] text-[#4d662b] border-[#c1d6a7] dark:bg-emerald-950/20'
                  : 'bg-[#1A1A1A] dark:bg-white hover:opacity-90 text-[#FAF9F6] dark:text-slate-950 border-transparent shadow-xs'
              }`}
              id="btn-copy-share"
              title="Copiar para o WhatsApp"
            >
              {copied ? <Check size={12} /> : <Share2 size={12} />}
              <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold bg-[#F0EFEC] hover:bg-[#FAF9F6]/85 text-[#1A1A1A] dark:bg-slate-800 dark:text-slate-200 rounded-full transition-all cursor-pointer border border-[#1A1A1A]/05"
              id="btn-edit-setlist"
            >
              <Edit size={12} />
              <span>Editar</span>
            </button>

            {showConfirmDelete ? (
              <div className="flex items-center gap-1.5 animate-fade-in bg-red-50 dark:bg-red-955/20 px-2.5 py-1 rounded-full border border-red-200/40">
                <span className="text-[9px] uppercase tracking-wider font-bold text-red-700 dark:text-red-400">Excluir?</span>
                <button
                  onClick={onDelete}
                  className="px-3 py-1 text-[9px] uppercase tracking-widest font-bold bg-red-650 text-white rounded-full hover:opacity-95"
                >
                  Sim
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1 text-[9px] uppercase tracking-widest font-bold bg-stone-200 dark:bg-slate-800 text-[#1A1A1A] dark:text-slate-300 rounded-full hover:opacity-95"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold bg-red-50 dark:bg-red-955/20 hover:bg-red-100 text-red-650 dark:text-red-400 rounded-full transition-all cursor-pointer border border-transparent"
                id="btn-delete-setlist"
              >
                <Trash2 size={12} />
                <span>Excluir</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Progress indicator */}
        <div className="mt-6 pt-5 border-t border-[#1A1A1A]/05 dark:border-slate-800/50">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 dark:text-slate-400 mb-2.5">
            <span>Progresso do Culto</span>
            <span className="font-mono text-xs">{playedSongs} de {totalSongs} hinos tocados ({progressPercent}%)</span>
          </div>
          <div className="w-full h-1.5 bg-[#FAF9F6]/90 dark:bg-slate-850 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-[#1A1A1A] dark:bg-white rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Songs listing */}
      <div className="p-6 md:p-8" id="setlist-songs-table">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/55 dark:text-slate-400 mb-4">
          Programação de Músicas
        </h3>

        {(!setlist.items || setlist.items.length === 0) ? (
          <div className="text-center py-12 text-slate-450">
            <Music className="mx-auto mb-2 opacity-30" size={32} />
            <p className="text-sm font-medium">Este repertório não possui músicas cadastradas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {setlist.items.map((item, index) => {
              const s = songs.find((song) => song.id === item.songId);
              if (!s) return null;
              return (
                <div
                  key={item.songId}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4.5 rounded-sm border transition-all duration-150 ${
                    item.played
                      ? 'bg-[#F5F4EF]/35 dark:bg-slate-950/10 border-[#1A1A1A]/05 opacity-40'
                      : 'bg-white/50 dark:bg-slate-900 border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20 hover:bg-white dark:border-slate-800/80 dark:hover:border-slate-705'
                  }`}
                  id={`setlist-song-card-${s.id}`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Tick box */}
                    <button
                      onClick={() => onTogglePlayed(setlist.id, item.songId)}
                      className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-sm flex items-center justify-center border transition-all cursor-pointer ${
                        item.played
                          ? 'bg-[#1A1A1A] dark:bg-white border-[#1A1A1A] dark:border-white text-white dark:text-slate-950'
                          : 'border-[#1A1A1A]/20 dark:border-slate-700 hover:border-[#1A1A1A] bg-white dark:bg-slate-800'
                      }`}
                      id={`toggle-played-btn-${item.songId}`}
                      title={item.played ? "Marcar como não tocada" : "Marcar como tocada"}
                    >
                      {item.played && <CheckCircle2 size={15} className="text-white dark:text-slate-950 fill-current" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#1A1A1A]/30 dark:text-slate-550">
                          #{index + 1}
                        </span>
                        <h4 className={`text-base font-bold font-sans truncate ${
                          item.played
                            ? 'text-[#1A1A1A]/40 dark:text-slate-550 line-through'
                            : 'text-[#1A1A1A] dark:text-slate-100'
                        }`}>
                          {s.title}
                        </h4>
                      </div>

                      <p className="text-xs text-[#1A1A1A]/50 dark:text-slate-400 mt-1">
                        {s.artist} • <span className="font-mono font-bold text-[#1A1A1A] bg-[#F0EFEC] dark:bg-slate-800 dark:text-slate-350 px-1.5 py-0.5 rounded-sm text-[10px]">Tom: {s.key}</span>
                      </p>
                    </div>
                  </div>

                  {/* Buttons for links and sheet reader */}
                  <div className="flex items-center gap-2.5 mt-4 sm:mt-0 ml-10 sm:ml-0">
                    <button
                      onClick={() => onViewSong(s)}
                      className="flex items-center gap-1.5 px-4.5 py-2 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] bg-[#FAF9F6] border border-[#1A1A1A]/10 rounded-full hover:bg-[#F0EFEC] transition-all cursor-pointer"
                      id={`view-lyrics-${s.id}`}
                    >
                      <BookOpen size={12} />
                      <span>Ver Letra</span>
                    </button>

                    {s.link && (
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-black/5 rounded-full transition-colors"
                        title="Ouvir na mídia"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
