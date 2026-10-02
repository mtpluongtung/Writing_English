import React from 'react';
import { Award, RotateCcw, Sparkles } from 'lucide-react';
import type { ExerciseSet } from '../types';
import confetti from 'canvas-confetti';

interface ExerciseSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  set: ExerciseSet;
  onRestart: () => void;
  onCreateNew: () => void;
}

export const ExerciseSummaryModal: React.FC<ExerciseSummaryModalProps> = ({
  isOpen,
  onClose,
  set,
  onRestart,
  onCreateNew
}) => {
  if (!isOpen) return null;

  const totalQuestions = set.items.length;
  const completedQuestions = set.items.filter(i => i.isCompleted).length;
  
  // Trigger celebratory confetti and listen to Enter key
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onClose();
        onCreateNew();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onCreateNew]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden text-slate-800 text-center"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-8 bg-gradient-to-b from-emerald-50 to-white">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-200">
            <Award className="w-8 h-8 text-emerald-700" />
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-1">
            Tuyệt vời! Hoàn thành bài tập
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Bạn đã hoàn thành toàn bộ các câu dịch trong chủ đề <span className="font-bold text-emerald-800">{set.topicVi || set.topic}</span> (Band {set.band.toFixed(1)})
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 grid grid-cols-2 gap-3 text-left">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Số câu hoàn thành</div>
              <div className="text-lg font-black text-emerald-800">{completedQuestions} / {totalQuestions} câu</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Mục tiêu Band</div>
              <div className="text-lg font-black text-emerald-800">Band {set.band.toFixed(1)}</div>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                onClose();
                onCreateNew();
              }}
              className="w-full bg-[#2d5a2d] hover:bg-[#234923] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Tạo chủ đề & bài tập mới với AI (Enter)</span>
            </button>

            <button
              onClick={() => {
                onRestart();
                onClose();
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ôn tập lại các câu vừa làm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
