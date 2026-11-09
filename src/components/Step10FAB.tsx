import React from 'react';
import { Zap } from 'lucide-react';
import { Locale } from '../types/recovery';

interface Step10FABProps {
  onClick: () => void;
  locale: Locale;
}

export const Step10FAB: React.FC<Step10FABProps> = ({ onClick, locale }) => {
  const isAr = locale === 'ar';

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Outer pulsing ring for emergency recovery awareness */}
      <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-60 pointer-events-none" />

      <button
        onClick={onClick}
        className="relative group flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-full shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={isAr ? 'الخطوة العاشرة الفورية (ص 84)' : 'Step 10 Instant Action (Page 84)'}
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-white fill-white" />
        </div>
        <div className="text-right rtl:text-right ltr:text-left">
          <span className="block text-xs font-bold leading-none tracking-wide">
            {isAr ? 'الخطوة 10 الفورية' : 'Step 10 Instant'}
          </span>
          <span className="block text-[10px] text-emerald-100/90 font-medium leading-tight mt-0.5">
            {isAr ? 'إجراءات ص 84 السريعة' : 'Page 84 Quick Actions'}
          </span>
        </div>
      </button>
    </div>
  );
};
