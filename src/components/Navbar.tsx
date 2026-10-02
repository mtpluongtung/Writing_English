import React from 'react';
import { 
  Sparkles, 
  Settings, 
  RotateCcw, 
  ChevronLeft, 
  Check, 
  BookOpen
} from 'lucide-react';
import type { ExerciseSet } from '../types';

interface NavbarProps {
  currentSet: ExerciseSet;
  currentIndex: number;
  totalItems: number;
  completedCount: number;
  onSelectIndex: (index: number) => void;
  onResetCurrent: () => void;
  onOpenCreateModal: () => void;
  onOpenSettingsModal: () => void;
  allSets: ExerciseSet[];
  onSelectSet: (set: ExerciseSet) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSet,
  currentIndex,
  totalItems,
  onSelectIndex,
  onResetCurrent,
  onOpenCreateModal,
  onOpenSettingsModal,
  allSets,
  onSelectSet
}) => {
  const [showTopicMenu, setShowTopicMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#354834]/95 backdrop-blur-md border-b border-emerald-950/40 text-white px-4 lg:px-8 py-2.5 shadow-md">
      <div className="max-w-[1850px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 group cursor-pointer select-none">
            <span className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
              <ChevronLeft className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider font-sans uppercase text-white drop-shadow-sm">
                  DỊCH CÂU
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-200/80 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  THE IELTS DICTIONARY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Progress Dots Navigation */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/25 rounded-full border border-white/10 shadow-inner">
          {currentSet.items.map((item, idx) => {
            const isCurrent = idx === currentIndex;
            const isDone = item.isCompleted;

            return (
              <button
                key={item.id}
                onClick={() => onSelectIndex(idx)}
                title={`Câu ${idx + 1}: ${item.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}`}
                className={`relative transition-all duration-200 flex items-center justify-center rounded-full text-[10px] font-bold
                  ${isCurrent 
                    ? 'w-7 h-5 bg-white text-emerald-900 shadow-sm scale-110' 
                    : isDone 
                      ? 'w-3 h-3 bg-emerald-400 hover:scale-125' 
                      : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
                  }`}
              >
                {isCurrent && <span>{idx + 1}</span>}
                {!isCurrent && isDone && (
                  <Check className="w-2 h-2 text-emerald-950 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Tools & Badges */}
        <div className="flex items-center gap-2.5">
          
          {/* Topic Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTopicMenu(!showTopicMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>{currentSet.topicVi || currentSet.topic}</span>
              <span className="text-[11px] text-emerald-200">▾</span>
            </button>

            {showTopicMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/15 p-2 z-50 text-left">
                <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Bộ bài tập có sẵn ({allSets.length})
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {allSets.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectSet(s);
                        setShowTopicMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors
                        ${s.id === currentSet.id 
                          ? 'bg-emerald-600 text-white font-bold' 
                          : 'hover:bg-white/10 text-slate-200'}`}
                    >
                      <span className="truncate">{s.title || s.topic}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-emerald-300">
                        Band {s.band}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Current Answer */}
          <button
            onClick={onResetCurrent}
            title="Đặt lại bản dịch câu này"
            className="flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Question Counter Badge */}
          <div className="bg-emerald-950/70 border border-emerald-700/60 px-3 py-1 rounded-lg text-xs font-bold text-emerald-100 shadow-inner">
            Câu {currentIndex + 1}/{totalItems}
          </div>

          {/* Create Exercise Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-amber-950 fill-amber-300 animate-pulse" />
            <span>Tạo bài tập mới</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            title="Cài đặt & API Key"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
