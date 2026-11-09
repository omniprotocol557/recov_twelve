import React from 'react';
import { SpiritualMetrics, Locale } from '../types/recovery';
import { Activity, ShieldAlert, CheckCircle, Sparkles, RefreshCcw } from 'lucide-react';

interface SpiritualMeterProps {
  metrics: SpiritualMetrics;
  onUpdateMetrics: (newMetrics: Partial<SpiritualMetrics>) => void;
  onResetDefaults: () => void;
  locale: Locale;
}

export const SpiritualMeter: React.FC<SpiritualMeterProps> = ({
  metrics,
  onUpdateMetrics,
  onResetDefaults,
  locale
}) => {
  const isAr = locale === 'ar';

  const averageScore = Math.round(
    (metrics.peaceOfMind + metrics.honestyWithSelf + metrics.surrenderWillingness + metrics.serviceConnection) / 4
  );

  let statusConfig = {
    titleAr: 'حصانة ولياقة روحية ممتازة',
    titleEn: 'Optimal Spiritual Fitness',
    descAr: 'أنت في حالة سلام واتصال قوي. استمر في اليقظة ومساعدة الآخرين.',
    descEn: 'You are in a peaceful, connected state. Continue daily vigilance and helping others.',
    badgeColor: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30',
    barColor: 'from-emerald-500 to-teal-400',
    icon: CheckCircle
  };

  if (averageScore < 50) {
    statusConfig = {
      titleAr: 'منطقة الجفاف والانكشاف الروحي (خطر الانتكاسة)',
      titleEn: 'Spiritual Drought Alert (Relapse Risk)',
      descAr: 'تحذير الصفحة 84: توقف فوراً، اتصل بمشرفك، وصلي لإزالة الاستياء والأنانية.',
      descEn: 'Page 84 Warning: Pause immediately, call your sponsor, and pray to remove resentment.',
      badgeColor: 'text-rose-400 bg-rose-950/50 border-rose-500/30',
      barColor: 'from-rose-500 to-amber-500',
      icon: ShieldAlert
    };
  } else if (averageScore < 75) {
    statusConfig = {
      titleAr: 'لياقة روحية متوسطة - يلزم الانتباه',
      titleEn: 'Moderate Spiritual Condition - Stay Alert',
      descAr: 'هناك تسرب في الطاقة أو استياء خفي. راجع فحص الضمير اليومي.',
      descEn: 'Minor leak or unaddressed resentment. Review your daily inventory.',
      badgeColor: 'text-amber-400 bg-amber-950/50 border-amber-500/30',
      barColor: 'from-amber-500 to-emerald-500',
      icon: Activity
    };
  }

  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-[#111724] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              {isAr ? 'الميزان الروحي اليومي' : 'Daily Spiritual Fitness Meter'}
            </span>
            <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
              {isAr ? 'ص 84 - 85' : 'Pages 84-85'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            {isAr ? 'مقياس اللياقة الروحية والاستقامة' : 'Spiritual Fitness & Alignment'}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right rtl:text-right ltr:text-left">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              {averageScore}%
            </span>
            <span className="block text-[11px] text-slate-400">
              {isAr ? 'اللياقة الإجمالية' : 'Overall Fitness'}
            </span>
          </div>
          <button
            onClick={onResetDefaults}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            title={isAr ? 'إعادة ضبط القيم' : 'Reset Values'}
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="my-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
        <StatusIcon className={`w-5 h-5 shrink-0 mt-0.5 ${averageScore < 50 ? 'text-rose-400' : averageScore < 75 ? 'text-amber-400' : 'text-emerald-400'}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">
              {isAr ? statusConfig.titleAr : statusConfig.titleEn}
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            {isAr ? statusConfig.descAr : statusConfig.descEn}
          </p>
        </div>
      </div>

      {/* Interactive Metric Sliders */}
      <div className="space-y-4 pt-2">
        {/* Metric 1: Serenity & Peace */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{isAr ? '1. السكينة والسلام الداخلي' : '1. Serenity & Peace of Mind'}</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold tabular-nums">
              {metrics.peaceOfMind}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={metrics.peaceOfMind}
            onChange={(e) => onUpdateMetrics({ peaceOfMind: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>{isAr ? 'اضطراب / قلق شديد' : 'High Anxiety / Chaos'}</span>
            <span>{isAr ? 'سكينة عميقة' : 'Deep Serenity'}</span>
          </div>
        </div>

        {/* Metric 2: Honesty with Self */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{isAr ? '2. الصدق مع الذات ونبذ الإنكار' : '2. Rigorous Honesty with Self'}</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold tabular-nums">
              {metrics.honestyWithSelf}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={metrics.honestyWithSelf}
            onChange={(e) => onUpdateMetrics({ honestyWithSelf: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>{isAr ? 'إنكار وتبرير' : 'Denial & Justifications'}</span>
            <span>{isAr ? 'صدق كامل وشفافية' : 'Full Transparency'}</span>
          </div>
        </div>

        {/* Metric 3: Surrender & Willingness */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{isAr ? '3. الاستعداد والتسليم (نزع السيطرة)' : '3. Willingness & Surrender'}</span>
            </span>
            <span className="font-mono text-teal-400 font-bold tabular-nums">
              {metrics.surrenderWillingness}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={metrics.surrenderWillingness}
            onChange={(e) => onUpdateMetrics({ surrenderWillingness: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>{isAr ? 'عناد وتحكم ذاتي' : 'Self-Will Run Riot'}</span>
            <span>{isAr ? 'تسليم تام لله' : 'Surrender to Higher Power'}</span>
          </div>
        </div>

        {/* Metric 4: Service & Connection */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{isAr ? '4. الخدمة والاتصال بزملاء التعافي' : '4. Service & Fellowship Connection'}</span>
            </span>
            <span className="font-mono text-blue-400 font-bold tabular-nums">
              {metrics.serviceConnection}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={metrics.serviceConnection}
            onChange={(e) => onUpdateMetrics({ serviceConnection: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>{isAr ? 'عزلة وانطواء' : 'Isolation & Self-Focus'}</span>
            <span>{isAr ? 'مساعدة وخدمة حقيقية' : 'Active Service to Others'}</span>
          </div>
        </div>
      </div>

      {/* Quote reminder from Big Book Page 84 */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {isAr
              ? '«نحن لسنا معافين نهائياً، بل نملك مهلة يومية مشروطة بصيانة لياقتنا الروحية»'
              : '"We are not cured of alcoholism. What we really have is a daily reprieve contingent on spiritual fitness."'}
          </span>
        </span>
      </div>
    </div>
  );
};
