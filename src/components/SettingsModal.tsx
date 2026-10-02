import React, { useState } from 'react';
import { X, Key, ShieldCheck, RefreshCw, Check, Cpu } from 'lucide-react';
import { saveApiKey, loadApiKey, loadGeminiModel, saveGeminiModel } from '../services/storage';
import { GEMINI_MODELS } from '../data/sampleExercises';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetAllData
}) => {
  const [apiKey, setApiKey] = useState<string>(() => loadApiKey());
  const [geminiModel, setGeminiModel] = useState<string>(() => loadGeminiModel());
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiKey(apiKey.trim());
    if (geminiModel.trim()) {
      saveGeminiModel(geminiModel.trim());
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#2d5a2d] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-300" />
            <h3 id="settings-title" className="text-base font-bold">
              Cài đặt & AI API Key
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Google Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              * Khóa API được lưu cục bộ trên trình duyệt của bạn (localStorage) và chỉ được dùng để gọi trực tiếp tới Google Gemini API để tạo bài tập.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Cpu className="w-4 h-4 text-emerald-700" />
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                Phiên bản Gemini Model mặc định
              </label>
            </div>
            <select
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-medium bg-white text-slate-800"
            >
              {GEMINI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.tag}) - {m.desc}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              * Model này sẽ tự động được chọn làm mặc định khi bạn tạo bài tập mới.
            </p>
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Không bắt buộc có API Key:</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Ứng dụng đã tích hợp sẵn AI engine với hàng chục bài tập dịch IELTS đa chủ đề và band điểm phong phú để bạn học tập ngay mà không cần cấu hình thêm.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn đặt lại tất cả dữ liệu bài tập về ban đầu?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi phục dữ liệu gốc</span>
            </button>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã lưu!</span>
                </>
              ) : (
                <span>Lưu cài đặt</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
