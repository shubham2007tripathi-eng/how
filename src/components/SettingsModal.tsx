import React from 'react';
import { X, Settings, Mic, Volume2, VolumeX, Languages, Check, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speechLang: 'hi-IN' | 'en-IN';
  setSpeechLang: (lang: 'hi-IN' | 'en-IN') => void;
  languageMode: 'hindi' | 'english' | 'hinglish';
  setLanguageMode: (mode: 'hindi' | 'english' | 'hinglish') => void;
  isAutoVoiceEnabled: boolean;
  setIsAutoVoiceEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  speechLang,
  setSpeechLang,
  languageMode,
  setLanguageMode,
  isAutoVoiceEnabled,
  setIsAutoVoiceEnabled,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/90 text-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-400/40 text-pink-900">
              <Settings className="w-5 h-5 text-pink-700" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">App & Voice Settings</h2>
              <p className="text-xs text-slate-600 font-medium">Configure speech recognition & response mode</p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-200/80 transition-colors"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* 1. Speech API Voice Recognition Language Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-bold text-pink-900">
                <Mic className="w-4 h-4 text-pink-600" />
                <span>Microphone Speech Recognition Language</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                Speech API
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Select the language engine for microphone input. Changing this improves voice-to-text accuracy for Devanagari Hindi or English/Hinglish queries.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Hindi hi-IN */}
              <button
                type="button"
                id="speech-lang-hi-btn"
                onClick={() => setSpeechLang('hi-IN')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  speechLang === 'hi-IN'
                    ? 'bg-pink-100/90 border-pink-300 text-pink-950 ring-2 ring-pink-300/30 shadow-xs'
                    : 'bg-slate-50/90 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm font-extrabold flex items-center gap-1.5 text-slate-900">
                    <Globe className="w-3.5 h-3.5 text-pink-700" /> Hindi (हिंदी)
                  </span>
                  {speechLang === 'hi-IN' && (
                    <Check className="w-4 h-4 text-pink-700 shrink-0 font-bold" />
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-mono font-bold">hi-IN</span>
                <span className="text-[10px] text-pink-900 font-semibold mt-1">
                  Devanagari script & spoken Hindi
                </span>
              </button>

              {/* English en-IN */}
              <button
                type="button"
                id="speech-lang-en-btn"
                onClick={() => setSpeechLang('en-IN')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  speechLang === 'en-IN'
                    ? 'bg-pink-100/90 border-pink-300 text-pink-950 ring-2 ring-pink-300/30 shadow-xs'
                    : 'bg-slate-50/90 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm font-extrabold flex items-center gap-1.5 text-slate-900">
                    <Globe className="w-3.5 h-3.5 text-pink-700" /> English / Hinglish
                  </span>
                  {speechLang === 'en-IN' && (
                    <Check className="w-4 h-4 text-pink-700 shrink-0 font-bold" />
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-mono font-bold">en-IN</span>
                <span className="text-[10px] text-pink-900 font-semibold mt-1">
                  Roman script & English/Hinglish
                </span>
              </button>
            </div>
          </div>

          <hr className="border-slate-200/80" />

          {/* 2. AI Response Language Mode */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-bold text-orange-950">
                <Languages className="w-4 h-4 text-orange-600" />
                <span>AI Legal Assistant Response Language</span>
              </label>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Choose how Justice Voice responds to your legal questions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                id="mode-hindi-btn"
                onClick={() => {
                  setLanguageMode('hindi');
                  setSpeechLang('hi-IN');
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  languageMode === 'hindi'
                    ? 'bg-gradient-to-r from-orange-100 to-pink-100 border-orange-400 text-orange-950 ring-2 ring-orange-400/30 shadow-xs font-bold'
                    : 'bg-slate-50/90 border-slate-200 text-slate-800 hover:bg-orange-50/50'
                }`}
              >
                <div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                    <span>Hindi (हिंदी)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-200 text-orange-950 font-bold">Default</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium">संपूर्ण संवाद शुद्ध हिंदी में</div>
                </div>
                {languageMode === 'hindi' && <Check className="w-4 h-4 text-orange-700 font-bold shrink-0 ml-1" />}
              </button>

              <button
                type="button"
                id="mode-english-btn"
                onClick={() => {
                  setLanguageMode('english');
                  setSpeechLang('en-IN');
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  languageMode === 'english'
                    ? 'bg-gradient-to-r from-orange-100 to-pink-100 border-orange-400 text-orange-950 ring-2 ring-orange-400/30 shadow-xs font-bold'
                    : 'bg-slate-50/90 border-slate-200 text-slate-800 hover:bg-orange-50/50'
                }`}
              >
                <div>
                  <div className="text-sm font-extrabold text-slate-900">English</div>
                  <div className="text-[10px] text-slate-600 font-medium">Entire chat in English</div>
                </div>
                {languageMode === 'english' && <Check className="w-4 h-4 text-orange-700 font-bold shrink-0 ml-1" />}
              </button>

              <button
                type="button"
                id="mode-hinglish-btn"
                onClick={() => {
                  setLanguageMode('hinglish');
                  setSpeechLang('hi-IN');
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  languageMode === 'hinglish'
                    ? 'bg-gradient-to-r from-orange-100 to-pink-100 border-orange-400 text-orange-950 ring-2 ring-orange-400/30 shadow-xs font-bold'
                    : 'bg-slate-50/90 border-slate-200 text-slate-800 hover:bg-orange-50/50'
                }`}
              >
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Hinglish</div>
                  <div className="text-[10px] text-slate-600 font-medium">Spoken Hindi in Roman script</div>
                </div>
                {languageMode === 'hinglish' && <Check className="w-4 h-4 text-orange-700 font-bold shrink-0 ml-1" />}
              </button>
            </div>
          </div>

          <hr className="border-slate-200/80" />

          {/* 3. Text-To-Speech (Voice Output) Readout */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90">
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                {isAutoVoiceEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span>Auto Voice Readout (TTS)</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Automatically read out AI responses using speech synthesis.
              </p>
            </div>
            <button
              type="button"
              id="toggle-tts-settings-btn"
              onClick={() => setIsAutoVoiceEnabled((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAutoVoiceEnabled ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAutoVoiceEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex justify-end">
          <button
            type="button"
            id="save-settings-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-amber-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
