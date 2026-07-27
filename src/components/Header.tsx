import React from 'react';
import { BookOpen, ShieldAlert, Sparkles, Volume2, VolumeX, Settings, Mic, Languages } from 'lucide-react';
import { NyayaSetuLogo } from './NyayaSetuLogo';

interface HeaderProps {
  onOpenKnowledgeBase: () => void;
  onOpenEmergencyGuide: () => void;
  onOpenSettings: () => void;
  onOpenSplashScreen?: () => void;
  languageMode: 'hindi' | 'english' | 'hinglish';
  setLanguageMode: (mode: 'hindi' | 'english' | 'hinglish') => void;
  isAutoVoiceEnabled: boolean;
  setIsAutoVoiceEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  speechLang: 'hi-IN' | 'en-IN';
  setSpeechLang: (lang: 'hi-IN' | 'en-IN') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenKnowledgeBase,
  onOpenEmergencyGuide,
  onOpenSettings,
  onOpenSplashScreen,
  languageMode,
  setLanguageMode,
  isAutoVoiceEnabled,
  setIsAutoVoiceEnabled,
  speechLang,
  setSpeechLang,
}) => {
  return (
    <header className="shrink-0 bg-white/85 backdrop-blur-md text-slate-900 border-b border-orange-100/90 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand logo & title */}
        <div
          id="app-header-brand"
          onClick={onOpenSplashScreen}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Click to view Justice Voice emblem logo & splash"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200/90 flex items-center justify-center p-1 shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all">
            <NyayaSetuLogo size="sm" showText={false} className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900 group-hover:text-orange-900 transition-colors">
                Justice Voice <span className="text-xs font-bold text-orange-600 font-sans">(न्याय वाणी)</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-100 to-pink-100 text-orange-950 border border-orange-200/80 shadow-2xs">
                <Sparkles className="w-3 h-3 mr-1 text-orange-600" /> BNS 2023
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Citizen Legal Assistant • Hindi (हिंदी) & English Advice
            </p>
          </div>
        </div>

        {/* Action Controls & Language Mode / Speech Recognition / Settings */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {/* 1. Chat Language Mode Selector */}
          <div
            id="lang-mode-toggle-bar"
            className="bg-gradient-to-r from-orange-50/90 to-pink-50/90 p-0.5 rounded-xl border border-orange-200/80 flex text-xs items-center shadow-2xs"
            title="Select AI Chat Conversation Language"
          >
            <span className="px-2 text-orange-950 hidden md:inline-flex items-center space-x-1 font-bold text-[11px]">
              <Languages className="w-3.5 h-3.5 text-orange-600" />
              <span>Language:</span>
            </span>
            <button
              id="lang-mode-hi-header-btn"
              type="button"
              onClick={() => {
                setLanguageMode('hindi');
                setSpeechLang('hi-IN');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                languageMode === 'hindi'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xs'
                  : 'text-slate-700 hover:text-orange-950 hover:bg-orange-100/60'
              }`}
              title="Set Chat Language to Hindi (हिंदी) - Default"
            >
              <span>हिंदी</span>
            </button>
            <button
              id="lang-mode-en-header-btn"
              type="button"
              onClick={() => {
                setLanguageMode('english');
                setSpeechLang('en-IN');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                languageMode === 'english'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xs'
                  : 'text-slate-700 hover:text-orange-950 hover:bg-orange-100/60'
              }`}
              title="Set Chat Language to English"
            >
              <span>English</span>
            </button>
            <button
              id="lang-mode-hinglish-header-btn"
              type="button"
              onClick={() => {
                setLanguageMode('hinglish');
                setSpeechLang('hi-IN');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                languageMode === 'hinglish'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xs'
                  : 'text-slate-700 hover:text-orange-950 hover:bg-orange-100/60'
              }`}
              title="Set Chat Language to Hinglish"
            >
              <span>Hinglish</span>
            </button>
          </div>

          {/* 2. Speech API Mic Recognition Language Toggle */}
          <div className="bg-orange-50/80 p-0.5 rounded-xl border border-orange-200/80 flex text-xs items-center shadow-2xs hidden xl:flex" title="Speech API Recognition Language">
            <span className="px-1.5 text-amber-900 hidden lg:inline-flex items-center space-x-1 font-bold text-[11px]">
              <Mic className="w-3 h-3 text-orange-600" />
              <span>Mic:</span>
            </span>
            <button
              id="speech-lang-hi-header-btn"
              type="button"
              onClick={() => setSpeechLang('hi-IN')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                speechLang === 'hi-IN'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/50'
              }`}
              title="Set Mic Recognition to Hindi (hi-IN)"
            >
              <span>HI</span>
            </button>
            <button
              id="speech-lang-en-header-btn"
              type="button"
              onClick={() => setSpeechLang('en-IN')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                speechLang === 'en-IN'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-orange-100/50'
              }`}
              title="Set Mic Recognition to English (en-IN)"
            >
              <span>EN</span>
            </button>
          </div>

          {/* Voice Reply Toggle */}
          <button
            id="toggle-auto-voice-btn"
            onClick={() => setIsAutoVoiceEnabled((prev) => !prev)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
              isAutoVoiceEnabled
                ? 'bg-gradient-to-r from-orange-100 to-pink-100 text-orange-950 border-pink-300 hover:opacity-90'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
            title="Toggle Voice Reply Output"
          >
            {isAutoVoiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-orange-600 animate-pulse" />
                <span className="hidden xl:inline">Voice Reply: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span className="hidden xl:inline">Voice Reply: OFF</span>
              </>
            )}
          </button>

          {/* Settings Modal Trigger Button */}
          <button
            id="open-settings-btn"
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-orange-50/80 hover:bg-orange-100/80 text-orange-900 border border-orange-200/90 text-xs font-semibold transition-all shadow-2xs"
            title="App & Speech Settings"
          >
            <Settings className="w-4 h-4 text-orange-600" />
          </button>

          {/* BNS Knowledge Base Button */}
          <button
            id="open-bns-kb-btn"
            onClick={onOpenKnowledgeBase}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-orange-950 border border-orange-200 text-xs font-bold transition-all shadow-2xs"
            title="Browse BNS Laws & Sections"
          >
            <BookOpen className="w-4 h-4 text-orange-600" />
            <span className="hidden md:inline">BNS Laws</span>
          </button>

          {/* Emergency Guide Button */}
          <button
            id="open-emergency-guide-btn"
            onClick={onOpenEmergencyGuide}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold transition-all shadow-2xs animate-pulse"
            title="Emergency Hotlines & Action Steps"
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span className="hidden md:inline">Emergency</span>
          </button>
        </div>
      </div>
    </header>
  );
};

