import React, { useState } from 'react';
import { Quote, Locale } from '../types/recovery';
import { Quote as QuoteIcon, ChevronRight, ChevronLeft, Shuffle, Copy, Check, Sparkles } from 'lucide-react';

interface DrEmadQuotesCardProps {
  quotes: Quote[];
  locale: Locale;
}

export const DrEmadQuotesCard: React.FC<DrEmadQuotesCardProps> = ({ quotes, locale }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const isAr = locale === 'ar';
  const currentQuote = quotes[currentIndex] || quotes[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
    setShowReflection(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    setShowReflection(false);
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentIndex(randomIndex);
    setShowReflection(false);
  };

  const handleCopy = async () => {
    const textToCopy = isAr
      ? `"${currentQuote.quoteAr}"\n— ${currentQuote.authorAr} (${currentQuote.sourceAr})`
      : `"${currentQuote.quoteEn}"\n— ${currentQuote.authorEn} (${currentQuote.sourceEn})`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Reflection questions linked to quote themes
  const reflectionQuestions = {
    denial: isAr
      ? 'ما هي الحقيقة المؤلمة التي أحاول تفادي الاعتراف بها اليوم؟ هل أكذب على نفسي في أي شأن؟'
      : 'What uncomfortable truth am I avoiding facing today? Am I deceiving myself about anything?',
    shame: isAr
      ? 'هل أحكم على نفسي بقسوة كأنني الخطأ؟ كيف يمكنني اليوم أن أمنح ذاتي رحمة وتسامحاً؟'
      : 'Am I judging myself harshly as if I am the mistake? How can I grant myself compassion and grace today?',
    healing: isAr
      ? 'ما هو الألم أو المشاعر التي أحتاج للجلوس معها الآن دون محاولة تخديرها بأي وسيلة؟'
      : 'What raw emotion do I need to sit with right now without escaping into numbing behavior?',
    surrender: isAr
      ? 'ما هي المعركة أو الموقف الذي أرهقني اليوم وأحتاج لتسليمه لله كلياً؟'
      : 'What struggle exhausted me today that I need to surrender completely to a Higher Power?',
    spiritual: isAr
      ? 'كيف يمكنني سد جوعي الروحي اليوم بالاتصال الحقيقي بدلاً من السلوكيات المؤقتة؟'
      : 'How can I satisfy my spiritual hunger today through authentic connection rather than temporary escapes?',
  };

  return (
    <div className="relative bg-[#131a26] border border-cyan-500/20 rounded-2xl p-5 sm:p-7 shadow-lg">
      {/* Subtle quote accent glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <QuoteIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'تأملات د. عماد رشاد عثمان' : 'Dr. Emad Rashad Series'}</span>
              <span className="text-[11px] font-normal text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/40">
                {isAr ? currentQuote.sourceAr : currentQuote.sourceEn}
              </span>
            </h3>
            <span className="text-xs text-slate-400">
              {isAr ? 'جرعة الوعي والتعافي اليومية' : 'Daily Awareness & Recovery Insight'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleShuffle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title={isAr ? 'اقتباس عشوائي' : 'Random Quote'}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
            title={isAr ? 'نسخ الاقتباس' : 'Copy Quote'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isAr ? 'السابق' : 'Previous'}
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isAr ? 'التالي' : 'Next'}
          >
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quote Body */}
      <div className="py-5">
        <blockquote className="font-amiri text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose text-slate-100 italic">
          «{isAr ? currentQuote.quoteAr : currentQuote.quoteEn}»
        </blockquote>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              {isAr ? currentQuote.authorAr : currentQuote.authorEn}
            </span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? `كتاب: ${currentQuote.sourceAr}` : `Book: ${currentQuote.sourceEn}`}</span>
          </div>

          <button
            onClick={() => setShowReflection(!showReflection)}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {showReflection
                ? (isAr ? 'إخفاء سؤال التأمل' : 'Hide Reflection')
                : (isAr ? 'سؤال التأمل الذاتي' : 'Self-Reflection Prompt')}
            </span>
          </button>
        </div>

        {/* Reflection Box */}
        {showReflection && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="font-bold block text-cyan-400 mb-1">
              {isAr ? 'سؤال للمراجعة الشخصية وفحص الضمير:' : 'Prompt for Personal Inventory & Honesty:'}
            </span>
            <p className="leading-relaxed">
              {reflectionQuestions[currentQuote.theme]}
            </p>
          </div>
        )}
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {quotes.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => {
              setCurrentIndex(idx);
              setShowReflection(false);
            }}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-cyan-400' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
            }`}
            aria-label={`Quote ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
