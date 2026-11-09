import React, { useState } from 'react';
import {
  Step4Entry,
  InventoryType,
  AffectedInstinct,
  MyPartDefect,
  Locale
} from '../types/recovery';
import {
  INSTINCT_LABELS,
  DEFECT_LABELS,
  INVENTORY_TYPE_LABELS
} from '../data/sampleInventory';
import {
  Plus,
  Trash2,
  Filter,
  Search,
  BookOpen,
  Lock,
  AlertCircle,
  CheckCircle2,
  X,
  FileSpreadsheet,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';

interface Step4InventoryProps {
  entries: Step4Entry[];
  onAddEntry: (entry: Omit<Step4Entry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (id: string) => void;
  locale: Locale;
}

export const Step4Inventory: React.FC<Step4InventoryProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  locale
}) => {
  const isAr = locale === 'ar';

  const [activeFilter, setActiveFilter] = useState<'all' | InventoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for adding an entry
  const [formType, setFormType] = useState<InventoryType>('resentment');
  const [target, setTarget] = useState('');
  const [cause, setCause] = useState('');
  const [affectedInstincts, setAffectedInstincts] = useState<AffectedInstinct[]>([]);
  const [myPartDefects, setMyPartDefects] = useState<MyPartDefect[]>([]);
  const [myPartReflection, setMyPartReflection] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const instinctOptions: AffectedInstinct[] = [
    'self_esteem',
    'financial_security',
    'emotional_security',
    'ambitions',
    'personal_relations',
    'sex_relations'
  ];

  const defectOptions: MyPartDefect[] = [
    'selfish',
    'dishonest',
    'self_seeking',
    'fearing',
    'inconsiderate'
  ];

  const toggleInstinct = (item: AffectedInstinct) => {
    setAffectedInstincts((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    if (errors.affectedInstincts) {
      setErrors((prev) => ({ ...prev, affectedInstincts: '' }));
    }
  };

  const toggleDefect = (item: MyPartDefect) => {
    setMyPartDefects((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
    if (errors.myPartDefects) {
      setErrors((prev) => ({ ...prev, myPartDefects: '' }));
    }
  };

  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!target.trim()) {
      newErrors.target = isAr
        ? 'يرجى تحديد الطرف أو الشخص أو المؤسسة (العمود 1)'
        : 'Target/Person is required (Column 1)';
    }

    if (!cause.trim() || cause.trim().length < 5) {
      newErrors.cause = isAr
        ? 'يرجى كتابة السبب المباشر بالتفصيل (العمود 2 - 5 أحرف على الأقل)'
        : 'Exact cause is required (Column 2 - at least 5 chars)';
    }

    if (affectedInstincts.length === 0) {
      newErrors.affectedInstincts = isAr
        ? 'اختر على الأقل جزءاً واحداً من الغرائز المتأثرة (العمود 3)'
        : 'Select at least one affected instinct (Column 3)';
    }

    if (myPartDefects.length === 0) {
      newErrors.myPartDefects = isAr
        ? 'حدد على الأقل عيباً واحداً في دورك الشخصي (العمود 4)'
        : 'Select at least one defect in your part (Column 4)';
    }

    if (!myPartReflection.trim() || myPartReflection.trim().length < 10) {
      newErrors.myPartReflection = isAr
        ? 'التحليل الذاتي مطلوب بصدق وأمانة (العمود 4 - 10 أحرف على الأقل)'
        : 'Self-reflection is required (Column 4 - at least 10 chars)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit valid entry
    onAddEntry({
      type: formType,
      target: target.trim(),
      cause: cause.trim(),
      affectedInstincts,
      myPartDefects,
      myPartReflection: myPartReflection.trim()
    });

    // Reset Form
    setTarget('');
    setCause('');
    setAffectedInstincts([]);
    setMyPartDefects([]);
    setMyPartReflection('');
    setErrors({});
    setIsModalOpen(false);
  };

  // Filtered entries
  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = activeFilter === 'all' || entry.type === activeFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      entry.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.myPartReflection.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Step 4 Educational Banner (Big Book p. 64) */}
      <div className="bg-[#121826] border border-cyan-500/20 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                  {isAr ? 'الخطوة الرابعة · فحص الضمير الدقيق وبلا خوف' : 'Step 4 · Searching & Fearless Moral Inventory'}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  {isAr ? 'الكتاب الكبير ص 64 - 71' : 'Big Book pp. 64-71'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {isAr ? 'سجل الأعمدة الأربعة الرقمي لفحص الضمير' : 'The 4-Column Digital Inventory Ledger'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {isAr
                  ? '«مثل التاجر الذي يقوم بجرد دقيق للبضائع التالفة في مخزنه، نحن نفحص حياتنا بأمانة لنحدد أسباب استياءاتنا ومخاوفنا ودور أنانيتنا فيها دون إلقاء اللوم على الآخرين»'
                  : '"We searched out the flaws in our make-up which caused our failure. Being convinced that self, manifested in various ways, was what had defeated us, we considered its common manifestations."'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة سجل جديد (الأعمدة الأربعة)' : 'Add New Inventory Entry'}</span>
          </button>
        </div>

        {/* Confidentiality Reminder */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {isAr
              ? 'ملاحظة سرية: هذه السجلات مخزنة محلياً بالكامل على متصفحك لمراجعتها مع مشرفك في الخطوة الخامسة.'
              : 'Privacy Note: All records are stored 100% locally on your device for review with your sponsor in Step 5.'}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({entries.length})
          </button>
          <button
            onClick={() => setActiveFilter('resentment')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'resentment'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'الاستياءات' : 'Resentments'} ({entries.filter(e => e.type === 'resentment').length})
          </button>
          <button
            onClick={() => setActiveFilter('fear')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'fear'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'المخاوف' : 'Fears'} ({entries.filter(e => e.type === 'fear').length})
          </button>
          <button
            onClick={() => setActiveFilter('sex')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'sex'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'السلوك الجنسي' : 'Sex Conduct'} ({entries.filter(e => e.type === 'sex').length})
          </button>
          <button
            onClick={() => setActiveFilter('harms')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'harms'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'الأضرار' : 'Harms'} ({entries.filter(e => e.type === 'harms').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-slate-400" />
          <input
            type="text"
            placeholder={isAr ? 'بحث في السجلات أو الأشخاص...' : 'Search targets, causes...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Ledger Cards Grid */}
      {filteredEntries.length === 0 ? (
        <div className="bg-[#101624] border border-slate-800 rounded-2xl p-10 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-300">
            {isAr ? 'لا توجد سجلات مطابقة في هذا القسم' : 'No matching entries found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {isAr
              ? 'ابدأ بكتابة أول سجل لفحص الضمير عبر النقر على زر "إضافة سجل جديد" بالأعلى.'
              : 'Begin by creating your first 4-column inventory record using the button above.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
          >
            {isAr ? 'كتابة سجل الآن' : 'Create Entry Now'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#111726] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all space-y-4"
            >
              {/* Card Header: Type Badge, Date, Delete Action */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    entry.type === 'resentment'
                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                      : entry.type === 'fear'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                      : entry.type === 'sex'
                      ? 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                      : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50'
                  }`}>
                    {INVENTORY_TYPE_LABELS[locale][entry.type]}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(entry.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  title={isAr ? 'حذف هذا السجل' : 'Delete entry'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* The 4-Column Framework Breakdown Inside the Card */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* Column 1: Target / الطرف أو الموقف */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">1</span>
                    <span>{isAr ? 'الطرف / الموقف (Target)' : 'Target / Person'}</span>
                  </span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">{entry.target}</p>
                </div>

                {/* Column 2: The Cause / السبب المباشر */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col md:col-span-1">
                  <span className="text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">2</span>
                    <span>{isAr ? 'السبب المباشر (The Cause)' : 'The Cause'}</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed mt-0.5">{entry.cause}</p>
                </div>

                {/* Column 3: Affects My / ما يمسه في الغرائز */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">3</span>
                    <span>{isAr ? 'ما يمسه في غرائزي (Affects)' : 'Affects My'}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {entry.affectedInstincts.map((instinct) => (
                      <span
                        key={instinct}
                        className="text-[10px] bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                      >
                        {INSTINCT_LABELS[locale][instinct]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Column 4: My Part / دوري الصادق وهو الأهم */}
                <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-xl p-3.5 flex flex-col md:col-span-1">
                  <span className="text-[11px] font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-900 text-emerald-300 flex items-center justify-center text-[10px]">4</span>
                    <span>{isAr ? 'دوري أنا - الأهم (My Part)' : 'My Part (Crucial)'}</span>
                  </span>
                  {/* Defects badges */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.myPartDefects.map((defect) => (
                      <span
                        key={defect}
                        className="text-[10px] font-semibold bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-700/40"
                      >
                        {DEFECT_LABELS[locale][defect]}
                      </span>
                    ))}
                  </div>
                  {/* Reflection note */}
                  <p className="text-emerald-100/90 text-xs leading-relaxed italic border-t border-emerald-900/40 pt-1.5">
                    «{entry.myPartReflection}»
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Add Entry" Modal Form (Strict 4-Column Framework of the Big Book) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0f1523] border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-[#121828] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{isAr ? 'إضافة سجل فحص ضمير جديد' : 'New Step 4 Inventory Record'}</span>
                    <span className="text-[11px] font-normal text-cyan-400 bg-cyan-950/80 border border-cyan-800/40 px-2 py-0.5 rounded-md">
                      {isAr ? 'إطار الأعمدة الأربعة' : '4-Column Framework'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isAr
                      ? 'نموذج الخطوة الرابعة الصارم وفق توجيهات ص 64-71 من الكتاب الكبير'
                      : 'Strict Big Book framework: Target, Cause, Affects My, and My Part'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleValidateAndSubmit} className="p-5 sm:p-7 overflow-y-auto space-y-6">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {isAr ? 'نوع السجل في الخطوة الرابعة:' : 'Inventory Category Type:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['resentment', 'fear', 'sex', 'harms'] as InventoryType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setFormType(t)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        formType === t
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {INVENTORY_TYPE_LABELS[locale][t]}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLUMN 1: Target / الطرف المتسبب */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>{isAr ? 'العمود 1: من أو ما هو الطرف المتسبب في الاضطراب؟' : 'Column 1 (Target): Who or what I am resentful/fearful at'}</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {isAr ? 'شخص، مؤسسة، جهة، أو مبدأ' : 'Person, institution, or principle'}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: مديري في العمل، والدي، الخوف من الفقر، صديق قديم...' : 'e.g. My boss, father, fear of poverty, old friend...'}
                  value={target}
                  onChange={(e) => {
                    setTarget(e.target.value);
                    if (errors.target) setErrors({ ...errors, target: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-900 border rounded-xl text-sm text-white focus:outline-none placeholder:text-slate-500 ${
                    errors.target ? 'border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-emerald-500'
                  }`}
                />
                {errors.target && (
                  <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.target}</span>
                  </p>
                )}
              </div>

              {/* COLUMN 2: The Cause / السبب المباشر */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>{isAr ? 'العمود 2: ما هو السبب المباشر بالتفصيل؟ (The Cause)' : 'Column 2 (The Cause): The exact cause of the disturbance'}</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {isAr ? 'ما الذي فعلوه أو ما حدث بالضبط؟' : 'What did they do?'}
                  </span>
                </div>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'اذكر الواقعة المحددة والسبب الصريح دون تبرير أو تهويل...' : 'Describe the exact incident or cause honestly...'}
                  value={cause}
                  onChange={(e) => {
                    setCause(e.target.value);
                    if (errors.cause) setErrors({ ...errors, cause: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-900 border rounded-xl text-sm text-white focus:outline-none placeholder:text-slate-500 ${
                    errors.cause ? 'border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-emerald-500'
                  }`}
                />
                {errors.cause && (
                  <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.cause}</span>
                  </p>
                )}
              </div>

              {/* COLUMN 3: Affects My / ما يمسه في الغرائز */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>{isAr ? 'العمود 3: ما يمسه هذا الاضطراب في غرائزي (Affects My)' : 'Column 3 (Affects My): Parts of self affected'}</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {isAr ? 'حدد كافة الجوانب المتضررة' : 'Select all that apply'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2.5">
                  {isAr
                    ? 'أي رغبة غريزية شعرت بالتهديد أو الإهانة حين حدث هذا؟'
                    : 'Which basic instinct felt hurt, threatened, or defied?'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {instinctOptions.map((item) => {
                    const isSelected = affectedInstincts.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleInstinct(item)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-left rtl:text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600 bg-slate-800'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                        </div>
                        <span>{INSTINCT_LABELS[locale][item]}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.affectedInstincts && (
                  <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.affectedInstincts}</span>
                  </p>
                )}
              </div>

              {/* COLUMN 4: My Part (Crucial) / دوري الشخصي الصادق */}
              <div className="p-5 rounded-2xl bg-[#090d16] border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold">4</span>
                    <span>{isAr ? 'العمود 4 (الأهم): أين هو دوري الشخصي؟ (My Part)' : 'Column 4 (Crucial): Where was my own part?'}</span>
                  </label>
                  <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    {isAr ? 'مفتاح الشفاء الحقيقي' : 'The Key to Freedom'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr
                    ? 'يقول الكتاب الكبير: «نضع تصرفات الآخرين جانباً كلياً، ونبحث بصرامة عن أخطائنا نحن. أين كنا أنانيين، أو غير أمناء، أو مدفوعين بمصالحنا وخوفنا؟»'
                    : '"Putting out of our minds the wrongs others had done, we resolutely looked for our own mistakes. Where had we been selfish, dishonest, self-seeking and frightened?"'}
                </p>

                {/* Checklist for My Part Defects */}
                <div>
                  <span className="block text-xs font-semibold text-slate-200 mb-2">
                    {isAr ? 'أين سقطت في العيوب التالية في هذا الموقف؟' : 'Which defects were active in my conduct?'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {defectOptions.map((item) => {
                      const isSelected = myPartDefects.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleDefect(item)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-left rtl:text-right transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600 bg-slate-800'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                          </div>
                          <span>{DEFECT_LABELS[locale][item]}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.myPartDefects && (
                    <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.myPartDefects}</span>
                    </p>
                  )}
                </div>

                {/* Reflection Text Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    {isAr
                      ? 'التحليل الذاتي الصادق: كيف وضعت نفسي في هذا المأزق؟ وما هو خطئي أنا بالتحديد؟'
                      : 'Honest self-reflection: How did I set the ball rolling? What was my exact mistake?'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      isAr
                        ? 'اكتب تحليلك الصادق لدورك (مثلاً: أردت السيطرة، أو كذبت لتجنب اللوم، أو توقعت من الآخرين تلبية رغباتي كأمر مسلم به)...'
                        : 'Write your honest reflection (e.g., I wanted control, lied to escape blame, or held unrealistic expectations)...'
                    }
                    value={myPartReflection}
                    onChange={(e) => {
                      setMyPartReflection(e.target.value);
                      if (errors.myPartReflection) setErrors({ ...errors, myPartReflection: '' });
                    }}
                    className={`w-full px-4 py-2.5 bg-slate-900 border rounded-xl text-sm text-white focus:outline-none placeholder:text-slate-500 ${
                      errors.myPartReflection ? 'border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {errors.myPartReflection && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.myPartReflection}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'حفظ السجل في دفتر الخطوة الرابعة' : 'Save to Step 4 Ledger'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
