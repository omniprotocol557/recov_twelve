import React, { useState } from 'react';
import { Locale, NightlyReviewEntry } from '../types/recovery';
import { STEP_11_BIG_BOOK_EXCERPT, STEP_11_PRAYER } from '../data/sampleNightly';
import {
  Moon,
  Sun,
  Heart,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  History,
  Save,
  Plus,
  Trash2,
  Wind,
  Compass,
  Check
} from 'lucide-react';

interface NightlyReviewStep11Props {
  reviews: NightlyReviewEntry[];
  onSaveReview: (review: Omit<NightlyReviewEntry, 'id' | 'date'>) => void;
  onDeleteReview: (id: string) => void;
  locale: Locale;
}

export const NightlyReviewStep11: React.FC<NightlyReviewStep11Props> = ({
  reviews,
  onSaveReview,
  onDeleteReview,
  locale
}) => {
  const isAr = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'nightly' | 'step11' | 'history'>('nightly');

  // Form State for Nightly Review
  const [wasResentful, setWasResentful] = useState(false);
  const [resentmentNotes, setResentmentNotes] = useState('');
  const [oweApology, setOweApology] = useState(false);
  const [apologyNotes, setApologyNotes] = useState('');
  const [keptSecret, setKeptSecret] = useState(false);
  const [secretNotes, setSecretNotes] = useState('');
  const [wereKind, setWereKind] = useState(true);
  const [thinkingOfSelf, setThinkingOfSelf] = useState(false);
  const [whatCouldWeDoBetter, setWhatCouldWeDoBetter] = useState('');

  // Step 11 Gratitude & Reflection State
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([
    isAr ? 'الاستيقاظ بوعي نقي وصافٍ دون ندم أو ذنب' : 'Waking up clean with clarity and peace',
    isAr ? 'وجود رفاق مخلصين على درب التعافي' : 'Fellows who understand the journey'
  ]);
  const [newGratitudeText, setNewGratitudeText] = useState('');
  const [meditationReflection, setMeditationReflection] = useState('');

  // Meditation timer state
  const [meditationSeconds, setMeditationSeconds] = useState(60);
  const [isMeditationActive, setIsMeditationActive] = useState(false);

  // Success Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle Gratitude Add
  const handleAddGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGratitudeText.trim()) return;
    setGratitudeItems([...gratitudeItems, newGratitudeText.trim()]);
    setNewGratitudeText('');
  };

  const handleRemoveGratitude = (index: number) => {
    setGratitudeItems(gratitudeItems.filter((_, i) => i !== index));
  };

  // Meditation Timer
  const handleStartMeditation = () => {
    setIsMeditationActive(true);
    setMeditationSeconds(60);
    const interval = setInterval(() => {
      setMeditationSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsMeditationActive(false);
          setToastMessage(isAr ? 'تم الانتهاء من دقيقة التأمل والسكينة!' : '1-Minute Meditation Completed!');
          setTimeout(() => setToastMessage(null), 3000);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Calculate Evening Peace Score based on answers
  const calculateScore = () => {
    let score = 100;
    if (wasResentful) score -= 25;
    if (oweApology) score -= 20;
    if (keptSecret) score -= 20;
    if (!wereKind) score -= 20;
    if (thinkingOfSelf) score -= 15;
    return Math.max(10, score);
  };

  // Submit Nightly Review
  const handleSaveNightlyReview = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateScore();

    onSaveReview({
      wasResentfulDishonestAfraidJealous: wasResentful,
      resentmentNotes,
      oweApology,
      apologyNotes,
      keptSecretToDiscuss: keptSecret,
      secretNotes,
      wereKindAndLoving: wereKind,
      thinkingOfSelfMostOfTime: thinkingOfSelf,
      whatCouldWeDoBetter,
      gratitudeItems,
      meditationReflection,
      overallPeaceScore: score
    });

    setToastMessage(isAr ? 'تم حفظ مراجعة الليلة بنجاح في سجلك اليومي!' : 'Nightly Review saved successfully!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner (Big Book p. 86) */}
      <div className="bg-[#121826] border border-cyan-500/20 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                  {isAr ? 'مراجعة المساء والخطوة 11 · اليقظة والتأمل اليومي' : 'Nightly Review & Step 11 · Daily Reflection'}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  {isAr ? 'الكتاب الكبير ص 86 - 90' : 'Big Book pp. 86-90'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {isAr ? 'فحص الضمير المسائي وفضاء الامتنان والتأمل' : 'Nightly Examination & Step 11 Meditation Space'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {isAr
                  ? '«عندما نأوي إلى فراشنا ليلاً، نراجع يومنا بشكل بنّاء دون الانزلاق إلى لوم الذات أو القلق؛ هل كنا مستائين؟ هل ندين باعتذار؟ وعند الاستيقاظ نطلب توجيه أفكارنا»'
                  : '"When we retire at night, we constructively review our day. Were we resentful, dishonest, afraid or jealous? Do we owe an apology? On awakening, we ask God to direct our thinking."'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('nightly')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'nightly'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>{isAr ? 'مراجعة المساء (الأسئلة الستة ص 86)' : 'Nightly Review (6 Questions)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('step11')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'step11'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>{isAr ? 'الخطوة 11: الامتنان والتأمل' : 'Step 11: Gratitude & Meditation'}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{isAr ? 'سجل المراجعات السابقة' : 'Review History'} ({reviews.length})</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/90 text-slate-950 text-xs sm:text-sm font-bold text-center rounded-xl shadow-lg transition-all animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* TAB 1: NIGHTLY REVIEW (The 6 Big Book Page 86 Questions) */}
      {activeTab === 'nightly' && (
        <form onSubmit={handleSaveNightlyReview} className="space-y-5">
          <div className="bg-[#101625] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{isAr ? 'أسئلة فحص الضمير المسائي البنّاء' : 'Constructive Evening Inventory Questions'}</span>
                  <span className="text-[11px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800/40">
                    ص 86
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr
                    ? 'فحص صادق دون لوم الذات أو الانزلاق إلى جلد النفس؛ الهدف هو معرفة الحقيقة والتحسن غداً.'
                    : 'Be ruthlessly honest without self-condemnation; the goal is spiritual clarity for tomorrow.'}
                </p>
              </div>

              <div className="text-right rtl:text-right ltr:text-left">
                <span className="text-xs text-slate-400 block">{isAr ? 'مستوى السكينة المتوقع:' : 'Estimated Peace:'}</span>
                <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {calculateScore()}%
                </span>
              </div>
            </div>

            {/* Question 1: Resentment, dishonesty, fear, jealousy */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center text-xs font-bold">1</span>
                  <span>{isAr ? 'هل كنا مستائين، غير مخلصين/صادقين، خائفين، أو غيورين؟' : 'Were we resentful, dishonest, afraid, or jealous?'}</span>
                </span>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setWasResentful(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      !wasResentful ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isAr ? 'لا (سليم)' : 'No (Clear)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWasResentful(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      wasResentful ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isAr ? 'نعم (حدث)' : 'Yes (Occurred)'}
                  </button>
                </div>
              </div>

              {wasResentful && (
                <textarea
                  rows={2}
                  placeholder={isAr ? 'حدد ما حدث بصدق: ما هو الاستياء أو الخوف؟' : 'Briefly detail the resentment, fear, or dishonesty...'}
                  value={resentmentNotes}
                  onChange={(e) => setResentmentNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090d16] border border-rose-500/40 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              )}
            </div>

            {/* Question 2: Do we owe an apology? */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center text-xs font-bold">2</span>
                  <span>{isAr ? 'هل ندين باعتذار أو تعويض لأحد عن تصرف اليوم؟' : 'Do we owe an apology to anyone?'}</span>
                </span>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setOweApology(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      !oweApology ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isAr ? 'لا (لا يوجد)' : 'No (None)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOweApology(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      oweApology ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isAr ? 'نعم (أدين باعتذار)' : 'Yes (Owe Apology)'}
                  </button>
                </div>
              </div>

              {oweApology && (
                <textarea
                  rows={2}
                  placeholder={isAr ? 'لمن تدين بالاعتذار؟ وما هو التصحيح المطلوب غداً صباحاً؟' : 'Who do you owe an apology to, and what amend is needed?'}
                  value={apologyNotes}
                  onChange={(e) => setApologyNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090d16] border border-amber-500/40 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              )}
            </div>

            {/* Question 3: Kept secret to discuss */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center text-xs font-bold">3</span>
                  <span>{isAr ? 'هل كتمنا شيئاً لأنفسنا كان يجب مناقشته فوراً مع شخص آخر؟' : 'Have we kept something to ourselves which should be discussed at once?'}</span>
                </span>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setKeptSecret(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      !keptSecret ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isAr ? 'لا (كل شيء شفاف)' : 'No (Transparent)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setKeptSecret(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      keptSecret ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isAr ? 'نعم (أمر مكتوم)' : 'Yes (Secret kept)'}
                  </button>
                </div>
              </div>

              {keptSecret && (
                <textarea
                  rows={2}
                  placeholder={isAr ? 'اكتب الموضوع الذي يحتاج للمصارحة مع المشرف أو رفيق التعافي...' : 'What needs to be brought to light with your sponsor?...'}
                  value={secretNotes}
                  onChange={(e) => setSecretNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090d16] border border-purple-500/40 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              )}
            </div>

            {/* Question 4: Were we kind and loving toward all? */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center text-xs font-bold">4</span>
                <span>{isAr ? 'هل كنا طيبين ومحبين مع الجميع دون استثناء؟' : 'Were we kind and loving toward all?'}</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setWereKind(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    wereKind ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAr ? 'نعم (محبة وسلام)' : 'Yes (Loving)'}
                </button>
                <button
                  type="button"
                  onClick={() => setWereKind(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    !wereKind ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAr ? 'لا (قصور)' : 'No (Fell short)'}
                </button>
              </div>
            </div>

            {/* Question 5: Were we thinking of ourselves most of the time? */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center text-xs font-bold">5</span>
                <span>{isAr ? 'هل كنا نفكر في أنفسنا معظم الوقت (التمركز حول الذات)؟' : 'Were we thinking of ourselves most of the time?'}</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setThinkingOfSelf(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    !thinkingOfSelf ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAr ? 'لا (كان هناك بذل وعطاء)' : 'No (Gave to others)'}
                </button>
                <button
                  type="button"
                  onClick={() => setThinkingOfSelf(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    thinkingOfSelf ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAr ? 'نعم (تمركز أناني)' : 'Yes (Self-centered)'}
                </button>
              </div>
            </div>

            {/* Question 6: What could we have done better? */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center text-xs font-bold">6</span>
                <span>{isAr ? 'ما الذي كان بإمكاننا فعله بشكل أفضل اليوم؟ (التحسن المستمر)' : 'What could we have done better?'}</span>
              </label>
              <textarea
                rows={3}
                placeholder={
                  isAr
                    ? 'اكتب خلاصة هادئة وبناءة لدروس اليوم لتطبيقها غداً بكل لطف مع نفسك...'
                    : 'Write a constructive takeaway for tomorrow with self-compassion...'
                }
                value={whatCouldWeDoBetter}
                onChange={(e) => setWhatCouldWeDoBetter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {isAr ? 'تُحفظ الإجابات محلياً لمراجعتها في بداية صباح الغد' : 'Logged locally for tomorrow morning\'s meditation'}
              </span>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-950/60 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ مراجعة الليلة (ص 86)' : 'Save Nightly Review'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: STEP 11 GRATITUDE & MEDITATION SPACE */}
      {activeTab === 'step11' && (
        <div className="space-y-6">
          {/* Step 11 Guidance Excerpt */}
          <div className="bg-[#101726] border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'الخطوة الحادية عشرة: توجيه الفكر الصباحي' : 'Step 11: Morning Meditation & Direction'}
                </h3>
                <span className="text-xs text-emerald-400">
                  {isAr ? STEP_11_BIG_BOOK_EXCERPT.sourceAr : STEP_11_BIG_BOOK_EXCERPT.sourceEn}
                </span>
              </div>
            </div>

            <p className="font-amiri text-lg sm:text-xl text-emerald-100 leading-relaxed italic border-r-2 rtl:border-r-2 ltr:border-l-2 border-emerald-500/60 pr-3 rtl:pr-3 ltr:pl-3">
              «{isAr ? STEP_11_BIG_BOOK_EXCERPT.quoteAr : STEP_11_BIG_BOOK_EXCERPT.quoteEn}»
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 block mb-1">
                {isAr ? 'دعاء ص 86 لتطهير الفكر:' : 'Page 86 Morning Prayer:'}
              </span>
              <p className="leading-relaxed">
                {isAr ? STEP_11_PRAYER.ar : STEP_11_PRAYER.en}
              </p>
            </div>
          </div>

          {/* Gratitude Journal Section */}
          <div className="bg-[#111724] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-rose-400" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isAr ? 'ما الذي أنا ممتن له اليوم؟' : 'What am I grateful for today?'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isAr
                      ? 'الامتنان يعيد برمجة الدماغ العاطفي بعيداً عن التمركز المرضي حول الذات ونقص الرضا.'
                      : 'Gratitude rewires the brain away from self-pity and entitlement.'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {gratitudeItems.length} {isAr ? 'نِعَم مسجلة' : 'Blessings'}
              </span>
            </div>

            {/* Add Gratitude input */}
            <form onSubmit={handleAddGratitude} className="flex gap-2">
              <input
                type="text"
                placeholder={isAr ? 'اكتب نعمة أو حدثاً إيجابياً شعرت بالامتنان لأجله اليوم...' : 'Write something you are genuinely grateful for today...'}
                value={newGratitudeText}
                onChange={(e) => setNewGratitudeText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </button>
            </form>

            {/* Gratitude List Items */}
            <div className="space-y-2">
              {gratitudeItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGratitude(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* 1-Minute Calming Meditation Timer */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c101c] p-4 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isMeditationActive ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-white">
                    {isAr ? 'دقيقة الصمت والإنصات الداخلي (الخطوة 11)' : '1-Minute Silent Listening (Step 11)'}
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    {isMeditationActive
                      ? (isAr ? 'صمت تام... استمع لصوت الإرشاد الإلهي الهادئ' : 'Be still... listen for intuitive guidance')
                      : (isAr ? 'التأمل هو الصمت والإنصات، بينما الدعاء هو الطلب' : 'Meditation is listening, prayer is asking')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
                  {meditationSeconds}s
                </span>
                <button
                  type="button"
                  onClick={handleStartMeditation}
                  disabled={isMeditationActive}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isMeditationActive ? (isAr ? 'جاري التأمل...' : 'Meditating...') : (isAr ? 'بدء الدقيقة' : 'Start 1-Min')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAVED REVIEW HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-[#101625] border border-slate-800 rounded-2xl p-10 text-center">
              <Moon className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-300">
                {isAr ? 'لا توجد مراجعات مسائية مسجلة حتى الآن' : 'No nightly reviews recorded yet'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isAr
                  ? 'قم بإجراء مراجعة الليلة من تبويب "مراجعة المساء" لحفظ أول سجل فحص ضمير يومي.'
                  : 'Complete your nightly review in the first tab to log your spiritual state.'}
              </p>
            </div>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {new Date(r.date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                      {isAr ? 'سكينة الليلة:' : 'Peace:'} {r.overallPeaceScore}%
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteReview(r.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                    title={isAr ? 'حذف هذا السجل' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 block mb-1 font-semibold">
                      {isAr ? 'الاعتذارات والتصحيح:' : 'Apologies & Amends:'}
                    </span>
                    <p className="text-slate-200">
                      {r.oweApology
                        ? (r.apologyNotes || (isAr ? 'دين باعتذار مطلوب غداً' : 'Apology due tomorrow'))
                        : (isAr ? 'لا توجد اعتذارات معلقة اليوم' : 'No apologies pending')}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-400 block mb-1 font-semibold">
                      {isAr ? 'ما الذي نفعله أفضل غداً؟' : 'Doing Better Tomorrow:'}
                    </span>
                    <p className="text-slate-200">
                      {r.whatCouldWeDoBetter || (isAr ? 'الحفاظ على نفس وتيرة اليقظة والسكينة' : 'Maintain clarity and vigilance')}
                    </p>
                  </div>
                </div>

                {r.gratitudeItems && r.gratitudeItems.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="font-semibold text-rose-300">{isAr ? 'نِعَم ممتن لها:' : 'Grateful for:'}</span>
                    {r.gratitudeItems.map((g, i) => (
                      <span key={i} className="bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 text-slate-300">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
