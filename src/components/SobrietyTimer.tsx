import React, { useState } from 'react';
import { Locale, SobrietyTime, TimerDisplayMode } from '../types/recovery';
import { Calendar, Award, RefreshCw, CheckCircle2, X } from 'lucide-react';

interface SobrietyTimerProps {
  time: SobrietyTime;
  startDate: Date;
  onUpdateStartDate: (newDate: Date) => void;
  mode: TimerDisplayMode;
  onToggleMode: () => void;
  locale: Locale;
}

export const SobrietyTimer: React.FC<SobrietyTimerProps> = ({
  time,
  startDate,
  onUpdateStartDate,
  mode,
  onToggleMode,
  locale
}) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDateStr, setTempDateStr] = useState(() => startDate.toISOString().slice(0, 10));
  const isAr = locale === 'ar';

  // Calculate day progress percentage for the circular ring (0 to 100 based on hours/minutes)
  const currentDayProgress = ((time.hours * 3600 + time.minutes * 60 + time.seconds) / 86400) * 100;
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentDayProgress / 100) * circumference;

  // Determine current milestone
  const milestones = [
    { days: 1, labelAr: '24 ساعة (يوم بيوم)', labelEn: '24 Hours (One Day at a Time)' },
    { days: 7, labelAr: 'أسبوع من اليقظة', labelEn: '1 Week of Clarity' },
    { days: 30, labelAr: 'شهر مبارك (30 يوماً)', labelEn: '1 Month Clean (30 Days)' },
    { days: 60, labelAr: 'شهران (60 يوماً)', labelEn: '2 Months (60 Days)' },
    { days: 90, labelAr: '90 يوماً (الربع الذهبي)', labelEn: '90 Days (Golden Quarter)' },
    { days: 180, labelAr: 'نصف عام (6 أشهر)', labelEn: 'Half Year (6 Months)' },
    { days: 365, labelAr: 'عام كامل من النقاء', labelEn: '1 Full Year Sane & Clean' },
  ];

  const currentMilestone = [...milestones].reverse().find(m => time.days >= m.days) || milestones[0];
  const nextMilestone = milestones.find(m => m.days > time.days);

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = new Date(tempDateStr);
    if (!isNaN(parsed.getTime())) {
      onUpdateStartDate(parsed);
      setIsEditingDate(false);
    }
  };

  const handleSetPreset = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    onUpdateStartDate(d);
    setTempDateStr(d.toISOString().slice(0, 10));
    setIsEditingDate(false);
  };

  return (
    <div className="relative bg-[#111724] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            {isAr ? 'عداد التعافي والنقاء' : 'Sobriety & Clarity Counter'}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            {isAr ? 'رحلة النقاء والحرية' : 'The Clean & Sane Journey'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingDate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors border border-slate-700/60"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'تعديل تاريخ البداية' : 'Edit Start Date'}</span>
          </button>

          <button
            onClick={onToggleMode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title={isAr ? 'تبديل شكل العداد' : 'Toggle view'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{mode === 'circular' ? (isAr ? 'خطي' : 'Linear') : (isAr ? 'دائري' : 'Circular')}</span>
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="relative z-10 py-6 flex flex-col items-center justify-center">
        {mode === 'circular' ? (
          /* Circular Timer View */
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90 transform" viewBox="0 0 240 240">
              {/* Background track circle */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                className="stroke-slate-800/70"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                className="stroke-emerald-500 transition-all duration-700 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                {time.days}
              </span>
              <span className="text-sm font-semibold text-emerald-400 mt-1">
                {isAr ? 'يوماً من النقاء' : 'Days Clean'}
              </span>

              {/* Realtime HMS ticker */}
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full font-mono text-xs sm:text-sm text-cyan-300 tabular-nums">
                <span>{String(time.hours).padStart(2, '0')}</span>
                <span className="text-slate-500">:</span>
                <span>{String(time.minutes).padStart(2, '0')}</span>
                <span className="text-slate-500">:</span>
                <span>{String(time.seconds).padStart(2, '0')}</span>
              </div>

              <span className="text-[11px] text-slate-500 mt-2 font-mono">
                {isAr ? 'اليوم الحالي يكتمل بنسبة' : 'Today is'} {Math.round(currentDayProgress)}%
              </span>
            </div>
          </div>
        ) : (
          /* Linear Timer View */
          <div className="w-full max-w-lg py-4">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center mb-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4">
                <span className="block text-2xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                  {time.days}
                </span>
                <span className="text-xs text-slate-400 font-medium">{isAr ? 'أيام' : 'Days'}</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4">
                <span className="block text-2xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                  {String(time.hours).padStart(2, '0')}
                </span>
                <span className="text-xs text-slate-400 font-medium">{isAr ? 'ساعات' : 'Hours'}</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4">
                <span className="block text-2xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                  {String(time.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs text-slate-400 font-medium">{isAr ? 'دقائق' : 'Mins'}</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4">
                <span className="block text-2xl sm:text-4xl font-extrabold text-cyan-400 font-mono tabular-nums">
                  {String(time.seconds).padStart(2, '0')}
                </span>
                <span className="text-xs text-slate-400 font-medium">{isAr ? 'ثوانٍ' : 'Secs'}</span>
              </div>
            </div>

            {/* Daily progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{isAr ? 'اكتمال ساعات اليوم الحالي' : 'Progress of current 24 hours'}</span>
                <span className="font-mono text-emerald-400 tabular-nums">{Math.round(currentDayProgress)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentDayProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Milestone Indicator */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>
              {isAr ? 'المحطة المحققة:' : 'Milestone:'}{' '}
              <strong>{isAr ? currentMilestone.labelAr : currentMilestone.labelEn}</strong>
            </span>
          </div>

          {nextMilestone && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <span>{isAr ? 'المحطة القادمة بعد:' : 'Next Milestone in:'}</span>
              <span className="font-mono text-cyan-400 font-semibold tabular-nums">
                {nextMilestone.days - time.days} {isAr ? 'يوم' : 'days'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Date Editor Modal / Popover */}
      {isEditingDate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131a26] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsEditingDate(false)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              {isAr ? 'تحديد تاريخ بداية التعافي' : 'Set Sobriety Clean Date'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isAr
                ? 'اختر اليوم الأول لنقائك، أو اختر من الإعدادات السريعة الجاهزة:'
                : 'Select the first day of your clean time or choose a quick preset:'}
            </p>

            {/* Quick Presets */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleSetPreset(1)}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 text-center"
              >
                {isAr ? 'أمس (يوم 1)' : 'Yesterday (1d)'}
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(7)}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 text-center"
              >
                {isAr ? 'منذ أسبوع' : '7 Days Ago'}
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(30)}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 text-center"
              >
                {isAr ? 'منذ 30 يوماً' : '30 Days Ago'}
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(90)}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 text-center"
              >
                {isAr ? 'منذ 90 يوماً' : '90 Days Ago'}
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(180)}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 text-center"
              >
                {isAr ? 'منذ 6 أشهر' : '6 Months Ago'}
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(365)}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 text-center"
              >
                {isAr ? 'منذ عام (سنة)' : '1 Year Ago'}
              </button>
            </div>

            <form onSubmit={handleSaveDate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {isAr ? 'أو أدخل تاريخاً محدداً:' : 'Or choose custom date:'}
                </label>
                <input
                  type="date"
                  value={tempDateStr}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setTempDateStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingDate(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'حفظ وتحديث العداد' : 'Save & Update'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
