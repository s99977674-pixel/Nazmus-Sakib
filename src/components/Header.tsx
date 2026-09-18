import React, { useRef } from 'react';
import { Moon, Sun, RotateCcw, Smartphone, Camera, Upload, RefreshCw } from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  userLogo: string | null;
  onToggleTheme: () => void;
  onReset: () => void;
  onOpenAndroidGuide: () => void;
  onUploadLogo: (dataUrl: string) => void;
  onResetLogo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  userLogo,
  onToggleTheme,
  onReset,
  onOpenAndroidGuide,
  onUploadLogo,
  onResetLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG or JPG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const activeLogoSrc = userLogo || '/logo.png';

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0 group">
            <img
              src={activeLogoSrc}
              alt="Nazmus Sakib Investment Calculator Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shadow-md ring-2 ring-emerald-500/20 object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Upload Button overlay */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
              title="Click to upload custom App Icon / Logo (PNG/JPG)"
              aria-label="Upload custom app logo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                Nazmus Sakib
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 truncate">
                Investment Calculator
              </p>
              {userLogo && (
                <button
                  onClick={onResetLogo}
                  className="text-[10px] text-slate-400 hover:text-red-500 underline flex items-center gap-0.5"
                  title="Reset to default logo"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Reset Logo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Logo Upload Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95 flex items-center gap-1.5"
            title="Upload custom logo / app icon"
            aria-label="Upload custom logo"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Change Icon</span>
          </button>

          {/* APK Guide Button */}
          <button
            id="btn-android-guide"
            onClick={onOpenAndroidGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition active:scale-95"
            title="View Android APK Build & Project details"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">APK Guide</span>
          </button>

          {/* Reset Button */}
          <button
            id="btn-header-reset"
            onClick={onReset}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition active:scale-95 flex items-center gap-1.5"
            title="Reset calculator inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition active:scale-95"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
