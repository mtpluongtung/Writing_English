import React from 'react';
import { 
  Volume2, 
  RotateCcw, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  Copy, 
  Check, 
  Sparkles, 
  Info,
  Lightbulb,
  CornerDownLeft
} from 'lucide-react';
import type { ExerciseItem } from '../types';
import { speakEnglish } from '../utils/speech';
import { evaluateTokens } from '../utils/tokenMatcher';

interface RightAnswerCardProps {
  exercise: ExerciseItem;
  band: number;
  userAnswer: string;
  setUserAnswer: (val: string) => void;
  onCompleteExercise: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onReset: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  hintTokenIndex: number | null;
  onTriggerHint: () => void;
  onInsertHint: (word: string) => void;
  onCursorChange?: (cursorPos: number) => void;
}

export const RightAnswerCard: React.FC<RightAnswerCardProps> = ({
  exercise,
  band,
  userAnswer,
  setUserAnswer,
  onCompleteExercise,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onReset,
  textareaRef,
  hintTokenIndex,
  onTriggerHint,
  onInsertHint,
  onCursorChange
}) => {
  const [copied, setCopied] = React.useState(false);

  const evaluatedTokens = evaluateTokens(exercise.tokens, userAnswer, false, hintTokenIndex);
  const errorTokens = evaluatedTokens.filter(t => t.status === 'error');
  const hasErrors = errorTokens.length > 0;
  const completedTokensCount = evaluatedTokens.filter(t => t.status === 'completed').length;

  // Active hinted token
  const hintedToken = (hintTokenIndex !== null && hintTokenIndex >= 0 && hintTokenIndex < evaluatedTokens.length)
    ? evaluatedTokens[hintTokenIndex]
    : null;

  // Find meaning from exercise hints if available
  const hintVocab = hintedToken
    ? exercise.vocabHints?.find(v => 
        v.word.toLowerCase().includes(hintedToken.cleanTarget.toLowerCase()) || 
        hintedToken.cleanTarget.toLowerCase().includes(v.word.toLowerCase())
      )
    : null;

  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isShaking, setIsShaking] = React.useState<boolean>(false);

  // Clear submit error whenever question changes
  React.useEffect(() => {
    setSubmitError(null);
  }, [exercise.id]);

  // Validate entire translation before completing
  const handleAttemptComplete = () => {
    if (exercise.isCompleted) {
      if (hasNext) {
        onNext();
      } else {
        onCompleteExercise();
      }
      return;
    }

    // Evaluate all tokens
    const currentTokens = evaluateTokens(exercise.tokens, userAnswer, false, null);
    const uncompleted = currentTokens.filter(t => t.status !== 'completed');
    const errored = currentTokens.filter(t => t.status === 'error');

    if (uncompleted.length > 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 700);

      if (errored.length > 0) {
        const firstErr = errored[0];
        if (errored.length === 1) {
          setSubmitError(`Từ thứ ${firstErr.index + 1} ("${firstErr.cleanTarget}") đang bị sai chính tả! Hãy sửa lại trước khi bấm hoàn thành.`);
        } else {
          setSubmitError(`Có ${errored.length} từ đang bị sai chính tả (đầu tiên là từ thứ ${firstErr.index + 1}: "${firstErr.cleanTarget}"). Hãy sửa lại các từ báo đỏ!`);
        }
      } else {
        const firstMissing = uncompleted[0];
        setSubmitError(`Bạn chưa dịch xong toàn bộ câu (còn thiếu ${uncompleted.length} từ, từ tiếp theo cần dịch là "${firstMissing.cleanTarget}").`);
      }

      onTriggerHint();

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }

    setSubmitError(null);
    onCompleteExercise();
  };

  // Handle keypress inside textarea (Ctrl+Space for hint, Tab to auto-fill hint, Enter submits)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Ctrl + Space: Trigger word hint
    if ((e.ctrlKey || e.metaKey) && (e.code === 'Space' || e.key === ' ')) {
      e.preventDefault();
      onTriggerHint();
      return;
    }

    // 2. Tab: Auto-insert hinted word if active
    if (e.key === 'Tab' && hintedToken) {
      e.preventDefault();
      onInsertHint(hintedToken.cleanTarget);
      return;
    }

    // 3. Enter: Submit / Complete (validates first!)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAttemptComplete();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exercise.englishAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (onCursorChange) {
      onCursorChange(target.selectionStart);
    }
  };

  // Global Enter shortcut listener when reading feedback or outside textarea
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'textarea' && activeTag !== 'input') {
          e.preventDefault();
          handleAttemptComplete();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [exercise.isCompleted, hasNext, userAnswer]);

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100/80 p-7 sm:p-8 lg:p-9 xl:p-10 flex flex-col justify-between h-full min-h-[660px]">
      <div>
        {/* Status Notification Banner at Top */}
        <div className="mb-4">
          {submitError ? (
            <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-3.5 flex items-center justify-between gap-2 shadow-xs animate-shake">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-900">
                <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">✕</span>
                <span>{submitError}</span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-red-700 bg-white px-2.5 py-0.5 rounded border border-red-300 flex-shrink-0">
                Chưa thể hoàn thành
              </span>
            </div>
          ) : exercise.isCompleted ? (
            <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Bạn đã hoàn thành bài này — bấm câu bất kỳ ở bên trái để ôn lại.</span>
              </div>
              <button
                onClick={onReset}
                className="text-xs sm:text-sm text-emerald-800 hover:text-emerald-950 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-100/80 transition-colors flex items-center gap-1 flex-shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại câu này</span>
              </button>
            </div>
          ) : hasErrors ? (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-3.5 flex items-center justify-between gap-2 animate-pulse-subtle">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-800">
                <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">✕</span>
                <span>Từ bạn vừa dịch bị sai ký tự (đang báo chữ X đỏ bên trái). Hãy kiểm tra và sửa lại!</span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-red-600 bg-white px-2.5 py-0.5 rounded border border-red-200 flex-shrink-0">
                {errorTokens.length} lỗi
              </span>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Gõ bản dịch của bạn hoặc bấm phím <kbd className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border text-amber-900 shadow-2xs">Ctrl + Space</kbd> để xem gợi ý.</span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded border border-slate-200 flex-shrink-0">
                Nhấn Enter để nộp
              </span>
            </div>
          )}
        </div>

        {/* Textarea Header: "BÀI DỊCH CỦA EM:" + Word count */}
        <div className="flex items-center justify-between mb-2.5">
          <label 
            htmlFor="user-translation-input"
            className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500"
          >
            BÀI DỊCH CỦA EM:
          </label>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <span className="text-slate-500">
              {completedTokensCount}/{evaluatedTokens.length} từ đã mở
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-black ${
              completedTokensCount === evaluatedTokens.length 
                ? 'bg-emerald-600 text-white' 
                : hasErrors 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-emerald-100 text-emerald-800'
            }`}>
              {Math.round((completedTokensCount / evaluatedTokens.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Floating Ctrl+Space Hint Banner */}
        {hintedToken && (
          <div className="mb-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-1 px-2 bg-amber-200 text-amber-950 rounded-lg font-black text-xs flex items-center gap-1 shadow-2xs">
                <Lightbulb className="w-3.5 h-3.5 text-amber-700 fill-amber-500" />
                Gợi ý từ đang nhập:
              </span>
              <span className="font-mono font-black text-sm text-amber-950 bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-xs">
                {hintedToken.cleanTarget}
              </span>
              {hintVocab && (
                <span className="text-xs text-amber-900 font-semibold italic">
                  — Nghĩa: {hintVocab.meaning}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onInsertHint(hintedToken.cleanTarget)}
              className="text-xs font-bold bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white px-3.5 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 select-none"
            >
              <span>Chèn từ này</span>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono font-normal">Tab</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Submit Error Alert Callout Banner */}
        {submitError && (
          <div className="mb-3.5 p-3.5 bg-red-50 border-2 border-red-500 rounded-2xl flex items-center justify-between gap-3 shadow-md animate-shake">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-red-900">
              <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">✕</span>
              <span>{submitError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="text-xs bg-red-200 hover:bg-red-300 active:bg-red-400 text-red-950 font-bold px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
            >
              Đã hiểu
            </button>
          </div>
        )}

        {/* Translation Textarea */}
        <div className="relative mb-5">
          <textarea
            id="user-translation-input"
            ref={textareaRef}
            rows={5}
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              if (submitError) setSubmitError(null);
            }}
            onKeyDown={handleKeyDown}
            onSelect={handleTextareaSelect}
            onClick={handleTextareaSelect}
            onKeyUp={handleTextareaSelect}
            placeholder="Gõ bản dịch của bạn tại đây... (Bấm Ctrl + Space để mở gợi ý từ đang nhập)"
            className={`w-full text-slate-800 text-base sm:text-lg leading-relaxed p-5 min-h-[170px] rounded-2xl border-2 ${
              submitError 
                ? 'border-red-500 ring-4 ring-red-200 bg-red-50/20' 
                : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100/50'
            } ${isShaking ? 'animate-shake' : ''} outline-none transition-all resize-y font-medium shadow-inner placeholder:text-slate-400`}
          />
        </div>

        {/* Feedback / Model Answer Container (Always visible or shows on completion/demand) */}
        {exercise.isCompleted && (
          <div className="mb-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 text-slate-800 animate-fadeIn shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-emerald-200/60">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Chính xác! Câu trả lời hoàn chỉnh (Band {band.toFixed(1)}):</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => speakEnglish(exercise.englishAnswer)}
                  title="Nghe phát âm chuẩn tiếng Anh"
                  className="p-1.5 rounded-lg text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  title="Sao chép câu trả lời"
                  className="p-1.5 rounded-lg text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Complete Model English Answer */}
            <p className="text-slate-800 font-bold text-sm sm:text-base leading-relaxed text-justify mb-3">
              {exercise.englishAnswer}
            </p>

            {/* Band Alternative Answers */}
            {exercise.alternativeAnswers && exercise.alternativeAnswers.length > 0 && (
              <div className="mt-3 pt-3 border-t border-emerald-200/60 space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-emerald-900 tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  So sánh các mức Band điểm:
                </span>
                {exercise.alternativeAnswers.map((alt, idx) => (
                  <div key={idx} className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-emerald-800">
                        Band {alt.band.toFixed(1)} Version:
                      </span>
                      <span className="text-[10px] text-slate-500 italic">{alt.highlight}</span>
                    </div>
                    <p className="text-slate-700 italic">"{alt.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Navigation Buttons */}
      <div className="border-t border-slate-100 pt-5 mt-2 flex flex-wrap items-center justify-between gap-3">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all
            ${hasPrev 
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95' 
              : 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
            }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Câu trước</span>
        </button>

        {/* Complete / Check Answer (Prominent Green Button) */}
        <button
          onClick={handleAttemptComplete}
          className="flex-1 max-w-sm flex items-center justify-center gap-2 bg-[#2d5a2d] hover:bg-[#254b25] active:bg-[#1e3c1e] text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 select-none"
        >
          {exercise.isCompleted ? (
            <>
              <span>{hasNext ? 'CÂU TIẾP THEO (ENTER)' : 'HOÀN THÀNH BỘ ĐỀ (ENTER)'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </>
          ) : (
            <>
              <span>HOÀN THÀNH BÀI TẬP (ENTER)</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all
            ${hasNext 
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95' 
              : 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
            }`}
        >
          <span>Câu tiếp</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
