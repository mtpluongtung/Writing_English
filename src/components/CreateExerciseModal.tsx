import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Key, 
  Loader2, 
  CheckCircle2
} from 'lucide-react';
import { PRESET_TOPICS, BAND_OPTIONS } from '../data/sampleExercises';
import type { GenerationOptions, ExerciseSet } from '../types';
import { createNewExerciseSet } from '../services/aiGenerator';
import { saveApiKey, loadApiKey } from '../services/storage';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newSet: ExerciseSet) => void;
}

export const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('Technology');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [selectedBand, setSelectedBand] = useState<number>(8.0);
  const [sentenceCount, setSentenceCount] = useState<number>(3);
  const [useGemini, setUseGemini] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => loadApiKey());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const apiKeyInputRef = React.useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Strict validation: if user selected Gemini, they MUST provide an API Key!
    if (useGemini && !apiKey.trim()) {
      setErrorMsg('Bạn đang chọn động cơ "Google Gemini API" nhưng chưa nhập API Key. Vui lòng dán API Key (AIzaSy...) bên dưới, hoặc chọn "⚡ AI Tức thì (Built-in)" để tạo bài ngay không cần Key.');
      setTimeout(() => {
        apiKeyInputRef.current?.focus();
      }, 50);
      return;
    }

    setIsLoading(true);

    try {
      if (useGemini && apiKey.trim()) {
        saveApiKey(apiKey.trim());
      }

      const preset = PRESET_TOPICS.find(p => p.id === selectedTopic);

      const options: GenerationOptions = {
        topic: selectedTopic,
        topicVi: preset?.nameVi || selectedTopic,
        band: selectedBand,
        sentenceCount: sentenceCount,
        customTopic: customTopic.trim() ? customTopic.trim() : undefined,
        useGeminiApiKey: useGemini,
        apiKey: useGemini ? apiKey.trim() : undefined
      };

      const newSet = await createNewExerciseSet(options);
      onCreated(newSet);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Có lỗi xảy ra khi tạo bài tập. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden text-slate-800 transition-all max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#2d5a2d] to-[#1e3c1e] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base sm:text-lg font-black tracking-wide">
                Tạo bài tập dịch câu với AI
              </h2>
              <p className="text-xs text-emerald-100/80">
                AI sẽ tạo bộ câu hỏi theo chủ đề và mục tiêu Band điểm IELTS của bạn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* 1. CHỦ ĐỀ (Topic) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              1. CHỦ ĐỀ LUYỆN TẬP
            </label>
            
            {/* Preset Topic Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {PRESET_TOPICS.map((topic) => {
                const isSelected = selectedTopic === topic.id && !customTopic;
                return (
                  <button
                    type="button"
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setCustomTopic('');
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between h-16
                      ${isSelected 
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-md scale-102' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                  >
                    <span className="truncate">{topic.nameVi}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {topic.nameEn.split('&')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Topic Input */}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Hoặc tự nhập chủ đề tùy ý (VD: Trí tuệ nhân tạo trong y tế, Nông nghiệp sạch...)"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* 2. BAND ĐIỂM (Band Score) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                2. BAND ĐIỂM MỤC TIÊU
              </label>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Band {selectedBand.toFixed(1)}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-2">
              {BAND_OPTIONS.map((band) => {
                const isSelected = selectedBand === band.value;
                return (
                  <button
                    type="button"
                    key={band.value}
                    onClick={() => setSelectedBand(band.value)}
                    className={`py-2 rounded-xl text-xs font-black transition-all border
                      ${isSelected 
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm scale-105' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                  >
                    {band.value}
                  </button>
                );
              })}
            </div>

            {/* Band Description */}
            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
              * Đặc điểm Band {selectedBand}: {BAND_OPTIONS.find(b => b.value === selectedBand)?.desc}
            </p>
          </div>

          {/* 3. SỐ LƯỢNG CÂU (Sentence Count) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              3. SỐ LƯỢNG CÂU HỎI
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 3, label: '3 câu', sub: 'Khởi động 5 phút' },
                { count: 5, label: '5 câu', sub: 'Tiêu chuẩn 10 phút' },
                { count: 10, label: '10 câu', sub: 'Chuyên sâu 20 phút' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.count}
                  onClick={() => setSentenceCount(item.count)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center
                    ${sentenceCount === item.count 
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <div>{item.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. CHỌN ĐỘNG CƠ AI (AI Mode) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-black text-slate-700 uppercase">
                  Động cơ AI sinh đề
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setUseGemini(false)}
                className={`p-3 rounded-xl border text-xs text-left transition-all
                  ${!useGemini 
                    ? 'bg-white border-emerald-600 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20' 
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
              >
                <div className="font-extrabold flex items-center justify-between">
                  <span>⚡ AI Tức thì (Built-in)</span>
                  {!useGemini && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Nhanh chóng, chuẩn đề, không cần API Key.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUseGemini(true);
                  setTimeout(() => apiKeyInputRef.current?.focus(), 80);
                }}
                className={`p-3 rounded-xl border text-xs text-left transition-all
                  ${useGemini 
                    ? 'bg-white border-emerald-600 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20' 
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
              >
                <div className="font-extrabold flex items-center justify-between">
                  <span>✨ Google Gemini API</span>
                  {useGemini ? (
                    apiKey.trim() ? (
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-1.5 py-0.5 rounded">
                        ✓ Đã có Key
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-1.5 py-0.5 rounded">
                        ⚠️ Cần nhập Key
                      </span>
                    )
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sinh đề trực tiếp theo yêu cầu độc nhất từ Gemini 2.5 Flash.
                </p>
              </button>
            </div>

            {useGemini && (
              <div className="mt-2.5 p-3 bg-white rounded-xl border border-emerald-200 shadow-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Google Gemini API Key:
                  </label>
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold underline"
                  >
                    Lấy API Key miễn phí ↗
                  </a>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    ref={apiKeyInputRef}
                    type="password"
                    placeholder="Dán API Key của bạn (AIzaSy...)"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  * API Key được lưu trực tiếp trên trình duyệt của bạn (localStorage). Nếu bạn chưa có Key, vui lòng chọn <strong>"⚡ AI Tức thì (Built-in)"</strong> ở trên để làm bài 10 câu chất lượng cao ngay lập tức.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2d5a2d] hover:bg-[#234923] active:bg-[#1b3a1b] text-white font-black text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 select-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>AI đang soạn đề bài tập & từ vựng...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>TẠO BÀI TẬP VÀ BẮT ĐẦU LÀM</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
