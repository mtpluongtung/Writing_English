import React, { useState } from 'react';
import { 
  Volume2, 
  Lightbulb, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  BookMarked, 
  Layers, 
  Eye, 
  EyeOff
} from 'lucide-react';
import type { ExerciseItem } from '../types';
import { speakVietnamese } from '../utils/speech';
import { evaluateTokens } from '../utils/tokenMatcher';

interface LeftPromptCardProps {
  exercise: ExerciseItem;
  topic: string;
  band: number;
  allExercises: ExerciseItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onTokenClick: (tokenWord: string) => void;
  userText: string;
  hintTokenIndex: number | null;
  cursorPos?: number;
  generatorType?: 'gemini' | 'builtin';
  aiModel?: string;
}

export const LeftPromptCard: React.FC<LeftPromptCardProps> = ({
  exercise,
  topic,
  band,
  allExercises,
  currentIndex,
  onSelectIndex,
  onTokenClick,
  userText,
  hintTokenIndex,
  cursorPos,
  generatorType,
  aiModel
}) => {
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);

  // Evaluate tokens against user's real-time input and cursor
  const evaluatedTokens = evaluateTokens(exercise.tokens, userText, showAll, hintTokenIndex, cursorPos);

  const completedCount = evaluatedTokens.filter(t => t.status === 'completed').length;
  const hasErrors = evaluatedTokens.some(t => t.status === 'error');

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100/80 p-7 sm:p-8 lg:p-9 xl:p-10 flex flex-col justify-between h-full min-h-[660px]">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              ĐỀ BÀI
            </span>
            <span className="bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full border border-slate-200">
              {topic}
            </span>
            {generatorType === 'gemini' ? (
              <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs font-mono">
                ✨ {aiModel || 'gemini-2.0-flash'}
              </span>
            ) : (
              <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                ⚡ Đề Chuẩn IELTS
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speakVietnamese(exercise.vietnameseText)}
              title="Nghe đọc tiếng Việt"
              className="p-1.5 rounded-full text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <span className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full shadow-sm">
              Band {band.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Direction Tag */}
        <div className="mb-3">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200/60 inline-flex items-center gap-1.5">
            <span>TIẾNG VIỆT</span>
            <span className="text-emerald-500 font-bold">➔</span>
            <span>ENGLISH</span>
          </span>
        </div>

        {/* Vietnamese Source Text */}
        <div className="mb-6">
          <p className="text-slate-800 font-bold text-lg sm:text-xl lg:text-[22px] leading-relaxed text-justify">
            {exercise.vietnameseText}
          </p>
        </div>

        {/* Word Bank / Tokens Section */}
        <div className="mb-5 bg-slate-50/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wide">
              <span>CÂU MẪU - NHỚ ĐÚNG ĐỂ MỞ TỪ:</span>
            </div>

            {/* "Hiện tất cả" toggle button matching user screenshot */}
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline transition-colors select-none"
            >
              {showAll ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showAll ? 'Ẩn gợi ý' : '@ Hiện tất cả'}</span>
            </button>
          </div>

          {/* Tokens Grid */}
          <div className="flex flex-wrap gap-2.5 max-h-64 overflow-y-auto pr-1 py-1">
            {evaluatedTokens.map((token) => {
              const isError = token.status === 'error';
              const isCompleted = token.status === 'completed';
              const isActive = token.status === 'active';
              const isHintRevealed = Boolean(token.isHintRevealed);

              // Styles matching screenshot & user requests
              let pillStyle = 'border border-slate-200/90 bg-white text-slate-400 hover:border-slate-300';

              if (isHintRevealed) {
                // Highlighted when Ctrl + Space is triggered
                pillStyle = 'border-2 border-amber-500 bg-amber-100/90 text-amber-950 font-black shadow-md ring-4 ring-amber-300/80 scale-105 animate-pulse-subtle';
              } else if (isError) {
                // Red error style matching image 2: border-red-400, bg-red-50, text-red-700
                pillStyle = 'border-2 border-red-400 bg-red-50 text-red-700 shadow-xs ring-2 ring-red-200/60 animate-shake';
              } else if (isCompleted) {
                // Green completed style
                pillStyle = 'border border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold shadow-2xs';
              } else if (isActive) {
                // Single active token style: warm tan/amber border and background
                pillStyle = 'border-2 border-amber-400 bg-amber-50 text-amber-950 font-bold ring-4 ring-amber-200/80 shadow-md scale-105 transition-transform';
              }

              return (
                <button
                  key={`${token.rawTarget}-${token.index}`}
                  onClick={() => onTokenClick(token.cleanTarget)}
                  title={
                    isHintRevealed 
                      ? `Gợi ý (Ctrl+Space): ${token.cleanTarget}` 
                      : isError 
                        ? `Từ này đang sai ký tự, hãy kiểm tra lại!` 
                        : isActive 
                          ? `Đang nhập từ này (Bấm Ctrl+Space để xem gợi ý)` 
                          : `Bấm để chèn từ "${token.cleanTarget}"`
                  }
                  className={`text-xs sm:text-sm px-3.5 py-1.5 rounded-full font-mono font-medium transition-all duration-150 flex items-center gap-1 select-none ${pillStyle}`}
                >
                  <span className={`text-[10px] sm:text-xs font-black ${
                    isHintRevealed
                      ? 'text-amber-700'
                      : isError 
                        ? 'text-red-500' 
                        : isCompleted 
                          ? 'text-emerald-500' 
                          : isActive 
                            ? 'text-amber-600'
                            : 'text-slate-400'
                  }`}>
                    {isHintRevealed ? '💡' : '@'}
                  </span>

                  {/* Character by character rendering */}
                  <span className="flex items-center tracking-wider">
                    {token.leadingPunct && <span>{token.leadingPunct}</span>}
                    {token.chars.map((charObj, cIdx) => (
                      <span
                        key={cIdx}
                        className={
                          charObj.isError 
                            ? 'text-red-600 font-black text-sm sm:text-base leading-none bg-red-100/90 px-0.5 rounded' 
                            : charObj.isMasked 
                              ? 'text-slate-400 font-black' 
                              : ''
                        }
                      >
                        {charObj.char}
                      </span>
                    ))}
                    {token.trailingPunct && <span className="font-sans">{token.trailingPunct}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick status line & hint tip */}
          <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-200/60 gap-2">
            <span>
              Tiến độ: <strong className="text-emerald-700 font-black">{completedCount}</strong>/{evaluatedTokens.length} từ đã mở
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100/80 text-amber-900 px-2 py-0.5 rounded-md font-semibold text-[11px] border border-amber-200">
                Phím tắt: <kbd className="font-mono font-bold bg-white px-1 rounded shadow-2xs">Ctrl + Space</kbd> để mở gợi ý từ đang nhập
              </span>
              {hasErrors && (
                <span className="text-red-600 font-bold flex items-center gap-1">
                  ⚠️ Có từ sai ký tự (báo chữ X đỏ)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hint Dropdown Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>{showHints ? 'Ẩn gợi ý từ vựng & ngữ pháp' : '💡 Xem gợi ý từ vựng & ngữ pháp'}</span>
            {showHints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showHints && (
            <div className="mt-3 bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-3 text-xs text-slate-800 animate-fadeIn">
              {exercise.vocabHints && exercise.vocabHints.length > 0 && (
                <div>
                  <div className="font-extrabold text-amber-950 mb-1.5 flex items-center gap-1">
                    <BookMarked className="w-3.5 h-3.5 text-amber-700" />
                    <span>Từ vựng & Collocations then chốt:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {exercise.vocabHints.map((v, i) => (
                      <div key={i} className="bg-white/80 p-2 rounded-lg border border-amber-100">
                        <span className="font-bold text-emerald-800">{v.word}</span>
                        {v.type && <span className="text-[10px] text-slate-500 ml-1">({v.type})</span>}
                        <p className="text-slate-600 text-[11px] mt-0.5">{v.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {exercise.grammarNotes && exercise.grammarNotes.length > 0 && (
                <div>
                  <div className="font-extrabold text-amber-950 mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    <span>Cấu trúc ngữ pháp trọng tâm:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {exercise.grammarNotes.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Other sentences navigation list ("CÁC CÂU TRONG BÀI TẬP") */}
      <div className="border-t border-slate-100 pt-4 mt-2">
        <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>CÁC CÂU TRONG BÀI TẬP</span>
          <span className="text-slate-500">{currentIndex + 1} / {allExercises.length}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {allExercises.map((ex, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={ex.id}
                onClick={() => onSelectIndex(idx)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5
                  ${isCurrent 
                    ? 'bg-emerald-800 text-white shadow-sm' 
                    : ex.isCompleted 
                      ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <span>Câu {idx + 1}</span>
                {ex.isCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
