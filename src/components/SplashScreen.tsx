import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  userLogo?: string | null;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, userLogo }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash screen for 1100ms then trigger fade-out
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 400); // allow CSS fade transition
    }, 1100);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const activeLogo = userLogo || '/logo.png';

  return (
    <div
      onClick={() => {
        setFadeOut(true);
        setTimeout(onFinish, 200);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white select-none transition-opacity duration-400 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top spacing */}
      <div />

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-5">
          <img
            src={activeLogo}
            alt="Nazmus Sakib Investment Calculator"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl shadow-2xl ring-4 ring-emerald-500/30 object-cover animate-pulse"
          />
          <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
          Nazmus Sakib
        </h1>
        <p className="text-sm font-semibold text-emerald-400 tracking-wide uppercase">
          Investment Calculator
        </p>
        <span className="mt-3 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-mono">
          Compound Daily Profit Engine
        </span>
      </div>

      {/* Bottom Footer & Loading Indicator */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] text-slate-400 font-medium">Initializing Calculator...</span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">
          v1.0.0 • com.nazmussakib.investmentcalculator
        </p>
      </div>
    </div>
  );
};
