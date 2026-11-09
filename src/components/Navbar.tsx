import React from 'react';
import { Locale, TimerDisplayMode } from '../types/recovery';
import { ShieldCheck, Code2, Globe2, Lock } from 'lucide-react';

interface NavbarProps {
  locale: Locale;
  onToggleLocale: () => void;
  timerMode: TimerDisplayMode;
  onToggleTimerMode: () => void;
  onOpenFlutterCode: () => void;
  onOpenStep10: () => void;
  currentTab: 'dashboard' | 'step4' | 'nightly' | 'contacts' | 'security';
  onSelectTab: (tab: 'dashboard' | 'step4' | 'nightly' | 'contacts' | 'security') => void;
  isLockEnabled?: boolean;
  onTriggerLockNow?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  locale,
  onToggleLocale,
  timerMode,
  onToggleTimerMode,
  onOpenFlutterCode,
  onOpenStep10,
  currentTab,
  onSelectTab,
  isLockEnabled = false,
  onTriggerLockNow
}) => {
  const isAr = locale === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left rtl:text-right cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
              <ShieldCheck className="w-5 h-5 text-emerald-100" />
            </div>
            <div className="leading-tight">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white block">
                {isAr ? 'برنامج التعافي واليقظة' : 'Spiritual Recovery App'}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium hidden sm:block">
                {isAr ? 'الخطوات: 4 · 10 · 11 ودليل الرفاق' : 'Steps 4, 10, 11 & Directory'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Tabs (Single line clean text with active states) */}
        <nav className="flex items-center gap-1 sm:gap-2.5 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'اللوحة والميزان' : 'Dashboard'}
          </button>

          <button
            onClick={() => onSelectTab('step4')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'step4'
                ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'دفتر الخطوة 4' : 'Step 4'}
          </button>

          <button
            onClick={() => onSelectTab('nightly')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'nightly'
                ? 'bg-slate-800 text-indigo-400 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'مراجعة المساء والـ 11' : 'Nightly & 11'}
          </button>

          <button
            onClick={() => onSelectTab('contacts')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'contacts'
                ? 'bg-slate-800 text-teal-400 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'دليل الرفاق والمشرف' : 'Directory Hub'}
          </button>

          <button
            onClick={() => onSelectTab('security')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'security'
                ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'الأمان والتشفير' : 'Security & Vault'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Lock Now + Flutter Code Export + Language Switcher) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {isLockEnabled && onTriggerLockNow && (
            <button
              onClick={onTriggerLockNow}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 text-xs font-medium border border-emerald-500/30 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              title={isAr ? 'قفل التطبيق الآن' : 'Lock App Now'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isAr ? 'قفل الآن' : 'Lock'}</span>
            </button>
          )}

          <button
            onClick={onOpenFlutterCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors shadow-sm"
            title={isAr ? 'مشروع الموبايل وتثبيت APK و iOS' : 'Mobile Project & Build APK / iOS'}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{isAr ? 'استخراج APK و iOS' : 'Build APK & iOS'}</span>
          </button>

          <button
            onClick={onToggleLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
