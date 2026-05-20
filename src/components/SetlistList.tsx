import React from 'react';
import { Setlist, Song } from '../types';
import { Calendar, Plus, ChevronRight, Music, Clock, CheckCircle2, ListMusic } from 'lucide-react';

interface SetlistListProps {
  setlists: Setlist[];
  songs: Song[];
  onSelect: (setlist: Setlist) => void;
  onAddNew: () => void;
}

export default function SetlistList({ setlists, songs, onSelect, onAddNew }: SetlistListProps) {
  
  // Format date helper: e.g. "Dom, 24 Mai" or similar
  const formatCompactDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) {
        return { day: '??', month: 'OUT', weekday: 'D' };
      }
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' });
      const monthLabel = dateObj.toLocaleDateString('pt-BR', { month: 'short' });
      
      return {
        day: Number(day),
        month: monthLabel.replace('.', ''),
        weekday: weekday.replace('.', '').toUpperCase()
      };
    } catch {
      return { day: '?', month: '?', weekday: '?' };
    }
  };

  // Sort setlists by date descending so upcoming/recent services are on top
  const sortedSetlists = [...setlists].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-fade-in" id="setlists-list-wrapper">
      {/* Search & Actions ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/40 p-5 md:p-6 rounded-sm border border-[#1A1A1A]/10 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-light font-editorial italic text-[#1A1A1A] dark:text-white">
            Programação de Repertórios
          </h2>
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 text-[#1A1A1A] dark:text-slate-400 mt-0.5">
            {setlists.length} {setlists.length === 1 ? 'repertório planejado' : 'repertórios planejados'} para os cultos
          </p>
        </div>
        
        <button
          onClick={onAddNew}
          className="bg-[#1A1A1A] dark:bg-white text-[#FAF9F6] dark:text-[#1A1A1A] hover:opacity-90 px-6 py-3 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          id="add-setlist-main"
        >
          <Plus size={14} />
          <span>Criar Repertório</span>
        </button>
      </div>

      {/* List */}
      {sortedSetlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-[#1A1A1A]/15 dark:border-slate-800 rounded-sm bg-white/20 dark:bg-slate-900/15 text-center text-slate-400">
          <ListMusic className="w-10 h-10 opacity-20 mb-3" />
          <p className="font-editorial italic text-xl text-[#1A1A1A]/70 dark:text-slate-300">Nenhum repertório criado</p>
          <p className="text-xs max-w-sm mt-1">Crie seu primeiro repertório para organizar as canções selecionadas para o próximo ensaio ou culto.</p>
        </div>
      ) : (
        <div className="space-y-4" id="setlists-cards-container">
          {sortedSetlists.map((setlist) => {
            const dateInfo = formatCompactDate(setlist.date);
            const total = setlist.items?.length || 0;
            const completed = setlist.items?.filter((item) => item.played).length || 0;
            const isCompleted = total > 0 && completed === total;

            return (
              <div
                key={setlist.id}
                onClick={() => onSelect(setlist)}
                className="group flex flex-col sm:flex-row items-stretch bg-white/40 dark:bg-slate-900/35 border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 dark:border-slate-800/80 dark:hover:border-slate-700/85 hover:bg-white dark:hover:bg-slate-900 rounded-sm overflow-hidden transition-all duration-200 cursor-pointer"
                id={`setlist-card-${setlist.id}`}
              >
                
                {/* Visual Calendar Icon Tab on the Left side */}
                <div className="flex-shrink-0 flex sm:flex-col items-center justify-center gap-2 sm:gap-1.5 px-4 py-4 sm:py-0 bg-[#F5F4EF] dark:bg-slate-950/20 group-hover:bg-[#FAF9F6] dark:group-hover:bg-slate-900 border-b sm:border-b-0 sm:border-r border-[#1A1A1A]/05 dark:border-slate-850 w-full sm:w-24 text-center transition-colors">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#1A1A1A]/40 dark:text-slate-500 font-mono">
                    {dateInfo.weekday}
                  </span>
                  <span className="text-3xl font-light font-editorial text-[#1A1A1A] dark:text-slate-100 leading-none">
                    {dateInfo.day}
                  </span>
                  <span className="text-[10px] tracking-widest font-bold uppercase text-[#8C7E6A] dark:text-slate-400">
                    {dateInfo.month}
                  </span>
                </div>

                {/* Main description and songs preview */}
                <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-bold font-sans text-[#1A1A1A] dark:text-slate-100 group-hover:text-[#8C7E6A] transition-colors truncate pr-2">
                        {setlist.name}
                      </h3>
                      
                      {/* Compact Progress bubble */}
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-[#E3ECD5] text-[#4d662b] dark:bg-emerald-950/25 dark:text-emerald-400'
                          : 'bg-[#F0EFEC] text-[#1A1A1A]/60 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {isCompleted ? (
                          <>
                            <CheckCircle2 size={10} className="fill-current" />
                            <span>Concluído</span>
                          </>
                        ) : (
                          <>
                            <Clock size={10} />
                            <span>{completed}/{total} tocadas</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Miniature setlist index overview */}
                    <div className="mt-4">
                      {total === 0 ? (
                        <p className="text-xs text-[#1A1A1A]/40 italic font-editorial">Nenhum hino planejado neste repertório</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {setlist.items.map((item, idx) => {
                            const s = songs.find((song) => song.id === item.songId);
                            if (!s) return null;
                            return (
                              <span
                                key={item.songId}
                                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-sm border bg-[#FAF9F6] dark:bg-slate-900 border-[#1A1A1A]/10 dark:border-slate-800 text-[#1A1A1A] dark:text-slate-300 ${
                                  item.played ? 'opacity-35 line-through' : ''
                                }`}
                              >
                                <span className="font-mono text-[9px] font-bold text-[#1A1A1A]/40">{idx + 1}</span>
                                <span className="truncate max-w-[110px] sm:max-w-[140px] font-medium">{s.title}</span>
                                <span className="font-mono text-[9px] bg-black/5 dark:bg-slate-805 px-1 rounded text-[#1A1A1A] dark:text-slate-400 font-bold">{s.key}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#1A1A1A]/05 dark:border-slate-850/30 pt-4 mt-5 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 dark:text-slate-400">
                    <span className="flex items-center gap-0.5">
                      {total === 1 ? '1 Música programada' : `${total} Músicas programadas`}
                    </span>
                    
                    <span className="flex items-center gap-0.5 text-[#8C7E6A] dark:text-slate-300 group-hover:translate-x-1 transition-transform">
                      <span>Ver Programação</span>
                      <ChevronRight size={12} className="mt-0.5" />
                    </span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
