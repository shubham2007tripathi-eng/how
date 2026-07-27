import React, { useState, useEffect } from 'react';
import { NyayaSetuLogo } from './NyayaSetuLogo';
import { Sparkles, ShieldCheck, ArrowRight, BookOpen, HeartHandshake } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
  autoDismissMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onDismiss,
  autoDismissMs = 2500,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / autoDismissMs) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        handleClose();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [autoDismissMs]);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-amber-50/90 bg-gradient-to-br from-orange-50 via-amber-50/60 to-pink-50/80 backdrop-blur-2xl transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glow Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-orange-300/30 via-amber-200/30 to-pink-300/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Glassmorphism Splash Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-2xl border border-orange-100/90 rounded-3xl p-8 sm:p-10 max-w-lg w-full flex flex-col items-center text-center shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-500">
        {/* BNS Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 text-orange-950 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
          <span>Bharatiya Nyaya Sanhita (BNS 2023) Verified</span>
        </div>

        {/* Big Justice Voice Logo Artwork */}
        <div className="relative group cursor-pointer my-2 transform transition-transform hover:scale-105 duration-300">
          <NyayaSetuLogo size="xl" showText={true} />
        </div>

        {/* Tagline & Subtext */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Justice Voice <span className="text-orange-600 font-extrabold text-base sm:text-lg">(न्याय वाणी)</span>
          </h2>
          <p className="text-sm font-extrabold text-orange-950 leading-snug">
            Connecting Citizens to Legal Justice & Know Your Rights
          </p>
          <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">
            Aapatkaalin madad, sadharan Hindi aur Hinglish mein BNS kanooni jaankari, aur FIR sahayata.
          </p>
        </div>

        {/* Smooth Loading Progress Bar */}
        <div className="w-full space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-1">
            <span className="flex items-center gap-1 text-orange-950">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> Preparing Legal AI Engine...
            </span>
            <span className="font-mono text-orange-950">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300/80">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-75 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Direct Action Button */}
        <button
          id="splash-get-started-btn"
          type="button"
          onClick={handleClose}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-black text-sm transition-all shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2 cursor-pointer group"
        >
          <span>Get Started Immediately</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Footer features summary */}
        <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-500 font-semibold pt-1 border-t border-slate-200/80 w-full">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-amber-600" /> BNS Parts 1-7
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <HeartHandshake className="w-3 h-3 text-pink-600" /> Citizen First
          </span>
        </div>
      </div>
    </div>
  );
};
