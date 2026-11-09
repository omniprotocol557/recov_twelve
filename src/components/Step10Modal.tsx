import React, { useState } from 'react';
import { Locale, AmendItem, SponsorInfo, DirectoryContact } from '../types/recovery';
import {
  X,
  HeartHandshake,
  PhoneCall,
  MessageCircle,
  CheckSquare,
  Compass,
  Plus,
  Trash2,
  CheckCircle2,
  Wind,
  User,
  Sparkles,
  ExternalLink,
  Users
} from 'lucide-react';

interface Step10ModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  amends: AmendItem[];
  onToggleAmend: (id: string) => void;
  onAddAmend: (text: string) => void;
  onDeleteAmend: (id: string) => void;
  sponsor: SponsorInfo;
  onUpdateSponsor: (sponsor: SponsorInfo) => void;
  contacts?: DirectoryContact[];
}

type TabType = 'prayer' | 'discuss' | 'amends' | 'redirect';

export const Step10Modal: React.FC<Step10ModalProps> = ({
  isOpen,
  onClose,
  locale,
  amends,
  onToggleAmend,
  onAddAmend,
  onDeleteAmend,
  sponsor,
  onUpdateSponsor,
  contacts = []
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('prayer');
  const [newAmendText, setNewAmendText] = useState('');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [editingSponsor, setEditingSponsor] = useState(false);
  const [sponsorName, setSponsorName] = useState(sponsor.name);
  const [sponsorPhone, setSponsorPhone] = useState(sponsor.phone);
  const [actionSimulated, setActionSimulated] = useState<string | null>(null);

  const isAr = locale === 'ar';

  if (!isOpen) return null;

  const handleStartBreathing = () => {
    setIsBreathing(true);
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 3;
      if (count === 0) setBreathPhase('inhale');
      else if (count === 1) setBreathPhase('hold');
      else setBreathPhase('exhale');
    }, 4000);

    setTimeout(() => {
      clearInterval(interval);
      setIsBreathing(false);
    }, 24000);
  };

  const handleAddAmendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmendText.trim()) return;
    onAddAmend(newAmendText.trim());
    setNewAmendText('');
  };

  const handleSaveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSponsor({
      ...sponsor,
      name: sponsorName,
      phone: sponsorPhone
    });
    setEditingSponsor(false);
  };

  const handleSimulateCall = () => {
    setActionSimulated(isAr ? `جاري الاتصال بالمشرف (${sponsor.name})...` : `Calling sponsor (${sponsor.name})...`);
    setTimeout(() => setActionSimulated(null), 3500);
  };

  const handleSimulateMessage = () => {
    const defaultMsg = isAr
      ? `مرحباً ${sponsor.name}، أحتاج لدقائق لمناقشة استياء أو خوف طرأ عليّ الآن تطبيقاً للخطوة العاشرة (ص 84)...`
      : `Hi ${sponsor.name}, I need a few minutes to discuss a resentment/fear that cropped up (Step 10, page 84)...`;

    const encoded = encodeURIComponent(defaultMsg);
    const whatsappUrl = `https://wa.me/${sponsor.phone.replace(/[^0-9]/g, '')}?text=${encoded}`;
    
    // Attempt to open or show toast
    try {
      window.open(whatsappUrl, '_blank');
    } catch {
      // Ignored
    }
    setActionSimulated(isAr ? 'تم تجهيز رسالة الخطوة العاشرة للموجه' : 'Prepared Step 10 message for sponsor');
    setTimeout(() => setActionSimulated(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-[#0f1523] border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-200">
        {/* Top Handle / Drag bar for mobile */}
        <div className="w-12 h-1.5 bg-slate-700/60 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{isAr ? 'أداة الخطوة العاشرة الفورية' : 'Step 10 Instant Action Tool'}</span>
                <span className="text-[11px] font-normal text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                  {isAr ? 'الكتاب الكبير ص 84' : 'Big Book p. 84'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'الاستجابة الفورية عند ظهور الاستياء، الخوف، أو عدم الأمانة'
                  : 'Immediate protocol when resentment, dishonesty, or fear crops up'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Tabs: Prayer, Discuss, Amends, Redirect */}
        <div className="flex items-center border-b border-slate-800 bg-[#0c101a] px-2 sm:px-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('prayer')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'prayer'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{isAr ? '1. الصلاة والتسليم' : '1. Prayer'}</span>
          </button>

          <button
            onClick={() => setActiveTab('discuss')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'discuss'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>{isAr ? '2. المناقشة الفورية' : '2. Discuss'}</span>
          </button>

          <button
            onClick={() => setActiveTab('amends')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'amends'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>
              {isAr ? '3. التعويض السريع' : '3. Amends'}
              {amends.filter(a => !a.completed).length > 0 && (
                <span className="ml-1.5 rtl:mr-1.5 rtl:ml-0 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-bold">
                  {amends.filter(a => !a.completed).length}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('redirect')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'redirect'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{isAr ? '4. إعادة التوجيه' : '4. Redirect'}</span>
          </button>
        </div>

        {/* Notification Toast for simulated actions */}
        {actionSimulated && (
          <div className="bg-emerald-500/90 text-slate-950 font-semibold text-xs py-2 px-4 text-center">
            {actionSimulated}
          </div>
        )}

        {/* Tab Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: PRAYER */}
          {activeTab === 'prayer' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  {isAr ? 'الكتاب الكبير - صفحة 84' : 'Big Book Page 84'}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr
                    ? '«عندما تظهر هذه الأمور (الاستياء، الخوف، الأنانية)، نطلب من الله فوراً أن يزيلها عنا»'
                    : '"When these crop up, we ask God at once to remove them."'}
                </p>
              </div>

              {/* The Prayer Card */}
              <div className="relative bg-gradient-to-b from-[#141d2d] to-[#0f1624] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <HeartHandshake className="w-6 h-6" />
                </div>

                <span className="text-xs text-emerald-300 font-semibold block mb-2">
                  {isAr ? 'دعاء إزالة الاستياء والخوف الفوري' : 'Resentment & Fear Removal Prayer'}
                </span>

                <div className="font-amiri text-xl sm:text-2xl md:text-3xl leading-relaxed sm:leading-loose text-white font-bold tracking-wide py-2">
                  {isAr ? (
                    '«اللهم أزل هذا الاستياء والخوف مني، وامنحني القدرة على رؤية هذا الشخص أو الموقف بعين التسامح والفهم»'
                  ) : (
                    '"Lord, remove this resentment and fear from me, and grant me the ability to see this person or situation with forgiveness and understanding."'
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {isAr
                      ? 'خذ نفساً عميقاً، كرر الدعاء بقلبك، وسلّم النتيجة كلياً'
                      : 'Take a slow, deep breath, repeat the prayer, and surrender the outcome'}
                  </span>
                </div>
              </div>

              {/* Breathing / Calming Assistant */}
              <div className="bg-[#121927] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isBreathing ? 'bg-cyan-500/20 text-cyan-300 scale-110' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isAr ? 'تمرين التنفس لتهدئة الجهاز العصبي' : '4-4-4 Calming Breath Pacer'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isBreathing
                        ? (breathPhase === 'inhale'
                            ? (isAr ? 'شهيق عميق بهدوء...' : 'Inhale slowly...')
                            : breathPhase === 'hold'
                            ? (isAr ? 'احبس النفس وتأمل السكينة...' : 'Hold gently...')
                            : (isAr ? 'زفير بطيء وتفريغ للتوتر...' : 'Exhale tension completely...'))
                        : (isAr ? 'يهدئ استجابة الهرب والقتال فوراً' : 'Calms fight-or-flight trigger response')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStartBreathing}
                  disabled={isBreathing}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-semibold text-white transition-colors"
                >
                  {isBreathing
                    ? (isAr ? 'جاري التمرين...' : 'Pacing...')
                    : (isAr ? 'بدء التنفس (30 ثانية)' : 'Start 30s Reset')}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DISCUSS */}
          {activeTab === 'discuss' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  {isAr ? 'الكتاب الكبير - صفحة 84' : 'Big Book Page 84'}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {isAr ? '«ونناقشها مع شخص ما على الفور»' : '"We discuss them with someone immediately"'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr
                    ? 'الاستياء عندما يُكتم يتحول إلى سم يمهد للانتكاسة. اتصل بمشرفك أو رفيق تعافي موثوق دون تأجيل.'
                    : 'Resentment kept in secret brews poison leading to relapse. Talk to your sponsor immediately.'}
                </p>
              </div>

              {/* Sponsor Contact Card */}
              <div className="bg-[#131b2a] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sponsor.name}</h4>
                      <span className="text-xs text-slate-400 font-mono">{sponsor.phone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingSponsor(!editingSponsor)}
                    className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    {editingSponsor ? (isAr ? 'إلغاء' : 'Cancel') : (isAr ? 'تعديل البيانات' : 'Edit')}
                  </button>
                </div>

                {editingSponsor ? (
                  <form onSubmit={handleSaveSponsor} className="mt-4 space-y-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        {isAr ? 'اسم المشرف / الموجه:' : 'Sponsor Name:'}
                      </label>
                      <input
                        type="text"
                        value={sponsorName}
                        onChange={(e) => setSponsorName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        {isAr ? 'رقم الهاتف / واتساب:' : 'Phone / WhatsApp:'}
                      </label>
                      <input
                        type="tel"
                        value={sponsorPhone}
                        onChange={(e) => setSponsorPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                    >
                      {isAr ? 'حفظ البيانات' : 'Save Contact'}
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={handleSimulateCall}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/40 transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{isAr ? 'اتصال فوري بالمشرف' : 'Call Sponsor Now'}</span>
                    </button>

                    <button
                      onClick={handleSimulateMessage}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{isAr ? 'رسالة تفريغ (واتساب)' : 'Send Step 10 Message'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Pre-Call Checklist / Inventory Prompts */}
              <div className="bg-[#0c111c] border border-slate-800/80 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'عناصر سريعة لتجهيزها قبل المكالمة:' : 'Quick Prep for the Discussion:'}</span>
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>{isAr ? 'ما هو الحدث الذي أثار استيائي أو خوفي بالتحديد؟' : 'What exact trigger sparked this resentment or fear?'}</li>
                  <li>{isAr ? 'ما هو دور كبريائي، أو أنانيتي، أو عدم أمانتي في الموقف؟' : 'Where was my pride, selfishness, or dishonesty at play?'}</li>
                  <li>{isAr ? 'هل أبحث عن حل روحي، أم أحاول إثبات أنني على حق؟' : 'Am I seeking a spiritual solution or just trying to be right?'}</li>
                </ul>
              </div>

              {/* Fellowship Brothers Quick Reach if Sponsor is busy */}
              {contacts.filter((c) => c.role === 'fellow').length > 0 && (
                <div className="bg-[#111726] border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-bold text-slate-300 block mb-2">
                    {isAr ? 'أو تواصل مع أحد رفاق التعافي فوراً (إذا كان المشرف مشغولاً):' : 'Or reach out to a fellowship brother immediately:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {contacts.filter((c) => c.role === 'fellow').slice(0, 2).map((fellow) => (
                      <div key={fellow.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-semibold text-slate-200">{fellow.name}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              try { window.location.href = `tel:${fellow.phone}`; } catch {}
                              setActionSimulated(isAr ? `جاري الاتصال بـ ${fellow.name}...` : `Calling ${fellow.name}...`);
                              setTimeout(() => setActionSimulated(null), 3000);
                            }}
                            className="p-1 rounded bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40"
                            title={isAr ? 'اتصال' : 'Call'}
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const url = `https://wa.me/${fellow.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isAr ? 'أخي، أحتاج لدقائق للمشاركة لكسر استياء/خوف (خطوة 10)...' : 'Fellow, I need a quick Step 10 share...')}`;
                              try { window.open(url, '_blank'); } catch {}
                              setActionSimulated(isAr ? `فتح واتساب مع ${fellow.name}` : `Opening chat with ${fellow.name}`);
                              setTimeout(() => setActionSimulated(null), 3000);
                            }}
                            className="p-1 rounded bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/40"
                            title={isAr ? 'واتساب' : 'WhatsApp'}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AMENDS */}
          {activeTab === 'amends' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  {isAr ? 'الكتاب الكبير - صفحة 84' : 'Big Book Page 84'}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {isAr ? '«ونقوم بالتعويض السريع إذا كنا قد أذينا أحداً»' : '"And make amends quickly if we have harmed anyone"'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr
                    ? 'عدم ترك الأخطاء تتراكم. اعتذر فوراً عن كلمة جافة، صحح مبالغة، أو أصلح ما أفسدته اليوم قبل الغروب.'
                    : 'Clean your side of the street instantly. Apologize for snap reactions or fix mistruths today.'}
                </p>
              </div>

              {/* Add New Amend Task */}
              <form onSubmit={handleAddAmendSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    isAr
                      ? 'أضف تعويضاً مطلوباً (مثلاً: اعتذار لزميل، تصحيح كلام)...'
                      : 'Add an immediate amend (e.g. apologize for snapping, fix a lie)...'
                  }
                  value={newAmendText}
                  onChange={(e) => setNewAmendText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shrink-0 shadow-md shadow-emerald-950/40"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة' : 'Add'}</span>
                </button>
              </form>

              {/* Checklist */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {amends.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    {isAr ? 'لا توجد تعويضات معلقة. طرف شارعك نظيف اليوم!' : 'No pending amends. Your side of the street is clean today!'}
                  </div>
                ) : (
                  amends.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                        item.completed
                          ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                          : 'bg-[#131b2a] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => onToggleAmend(item.id)}
                        className="flex items-start gap-3 flex-1 text-left rtl:text-right cursor-pointer"
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 bg-slate-900 text-transparent hover:border-emerald-400'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs sm:text-sm font-medium ${
                            item.completed ? 'line-through text-slate-500' : 'text-slate-100'
                          }`}>
                            {item.actionRequired}
                          </p>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {item.completed
                              ? (isAr ? 'تم إنجاز التعويض وتطهير الضمير' : 'Amends made & cleared')
                              : (isAr ? 'مطلوب إنجازه اليوم' : 'Due today')}
                          </span>
                        </div>
                      </button>

                      <button
                        onClick={() => onDeleteAmend(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                        title={isAr ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REDIRECT */}
          {activeTab === 'redirect' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                  {isAr ? 'الكتاب الكبير - صفحة 84' : 'Big Book Page 84'}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {isAr
                    ? '«ثم نوجه أفكارنا بحزم نحو شخص يمكننا مساعدته. الحب والتسامح هما شريعتنا»'
                    : '"Then we resolutely turn our thoughts to someone we can help. Love and tolerance is our code."'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr
                    ? 'أسرع دواء لكسر الاستياء والتمركز المرضي حول الذات هو بذل النفع لغيرك دون انتظار مقابل.'
                    : 'The quickest cure for resentment and selfish obsession is immediate altruism and service.'}
                </p>
              </div>

              {/* Service Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                    {isAr ? '1. تفقد رفيقاً في البدايات' : '1. Check on a Newcomer'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr
                      ? 'أرسل رسالة دعم أو اتصل بعضو جديد يسعى للتعافي. أخبره أنك فخور بخطواته.'
                      : 'Send a message of support to a fellow in early recovery. Remind them they are not alone.'}
                  </p>
                </div>

                <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2.5">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                    {isAr ? '2. خدمة منزلية صامتة' : '2. Quiet Family Service'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr
                      ? 'قدم مساعدة لأهلك أو شريكك في مهمة دون أن يطلبوا، ودون أن تبحث عن ثناء.'
                      : 'Do a chore or give genuine help to family without being asked or seeking credit.'}
                  </p>
                </div>

                <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                    {isAr ? '3. الدعاء لمن استأت منه' : '3. Pray for the Resented'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr
                      ? 'ادعُ بصدق للشخص الذي أغضبك بالخير والصحة والبركة؛ هذه الوصفة تذيب مرارة القلب.'
                      : 'Pray for the wellbeing and peace of the person you resent; it dismantles inner bitterness.'}
                  </p>
                </div>

                <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                    {isAr ? '4. حضور اجتماع تعافي' : '4. Attend a Meeting'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr
                      ? 'احضر اجتماعاً اليوم واستمع بنية التعلم وتقديم كلمة طيبة لمن يحتاجها.'
                      : 'Join a meeting today with an open heart to listen and share hope with others.'}
                  </p>
                </div>
              </div>

              {/* Final Big Book Affirmation */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/20 text-center">
                <p className="text-xs sm:text-sm text-emerald-200 font-semibold">
                  {isAr
                    ? '«الحب والتسامح هما شريعتنا؛ عندما نضع أيدينا في أيدي الآخرين ننجو جميعاً»'
                    : '"Love and tolerance is our code; as we extend our hands to others, we all heal together."'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-[#0b0f17] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            {isAr ? 'صيانة اليقظة اليومية · خطوة 10' : 'Daily Spiritual Maintenance · Step 10'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            {isAr ? 'إغلاق الأداة' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
