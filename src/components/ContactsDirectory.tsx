import React, { useState } from 'react';
import { DirectoryContact, ContactRole, Locale } from '../types/recovery';
import {
  Users,
  ShieldAlert,
  PhoneCall,
  MessageCircle,
  UserCheck,
  Plus,
  Trash2,
  Lock,
  Search,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  PhoneForwarded,
  Award
} from 'lucide-react';

interface ContactsDirectoryProps {
  contacts: DirectoryContact[];
  onAddContact: (contact: Omit<DirectoryContact, 'id' | 'createdAt'>) => void;
  onDeleteContact: (id: string) => void;
  onUpdateContact?: (contact: DirectoryContact) => void;
  locale: Locale;
}

export const ContactsDirectory: React.FC<ContactsDirectoryProps> = ({
  contacts,
  onAddContact,
  onDeleteContact,
  locale
}) => {
  const isAr = locale === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<ContactRole>('fellow');
  const [cleanTime, setCleanTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter contacts
  const sponsorContact = contacts.find((c) => c.role === 'sponsor') || contacts[0];
  const fellowshipBrothers = contacts
    .filter((c) => c.id !== sponsorContact?.id)
    .filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    });

  // Action Triggers: Phone Call
  const handleTriggerCall = (contact: DirectoryContact) => {
    const cleanPhone = contact.phone.replace(/[^0-9+]/g, '');
    setToastMessage(
      isAr
        ? `جاري بدء الاتصال بـ ${contact.name} (${cleanPhone})...`
        : `Calling ${contact.name} (${cleanPhone})...`
    );
    try {
      window.location.href = `tel:${cleanPhone}`;
    } catch {
      // Ignored
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Action Triggers: WhatsApp Message with Step 10 Recovery context
  const handleTriggerWhatsApp = (contact: DirectoryContact) => {
    const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
    const defaultMsg = isAr
      ? `السلام عليكم أخي ${contact.name}، أحتاج لدقائق لمشاركتك ومناقشة وضع روحي/استياء تطبيقاً للخطوة العاشرة (ص 84)...`
      : `Hi ${contact.name}, I need a few minutes to connect regarding a Step 10 check-in (Page 84)...`;

    const encoded = encodeURIComponent(defaultMsg);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

    setToastMessage(
      isAr
        ? `تم تجهيز رسالة الخطوة العاشرة لـ ${contact.name}`
        : `Opening WhatsApp chat with ${contact.name}...`
    );

    try {
      window.open(whatsappUrl, '_blank');
    } catch {
      // Ignored
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Form Validation & Submit
  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = isAr ? 'يرجى إدخال اسم جهة الاتصال' : 'Name is required';
    }

    if (!phone.trim() || phone.trim().length < 6) {
      newErrors.phone = isAr ? 'يرجى إدخال رقم هاتف صحيح' : 'Valid phone number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddContact({
      name: name.trim(),
      phone: phone.trim(),
      role,
      cleanTime: cleanTime.trim() || undefined,
      notes: notes.trim() || undefined
    });

    // Reset Form
    setName('');
    setPhone('');
    setRole('fellow');
    setCleanTime('');
    setNotes('');
    setErrors({});
    setIsModalOpen(false);

    setToastMessage(isAr ? 'تمت إضافة جهة الاتصال بنجاح إلى دليلك!' : 'Contact added successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="bg-[#121826] border border-cyan-500/20 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  {isAr ? 'دليل المساءلة والاتصال الروحي' : 'Connection & Accountability Hub'}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  {isAr ? 'شبكة الأمان ضد الانتكاسة' : 'Relapse Safety Network'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {isAr ? 'دليل المشرف ورفاق التعافي' : 'Sponsor & Fellowship Directory'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {isAr
                  ? '«العزلة هي أرض المعركة الخاسرة للإدمان. حافظ على خط اتصال مباشر مع مشرفك ورفاقك لكسر الإنكار وتطبيق الخطوتين العاشرة والحادية عشرة فوراً»'
                  : '"Isolation is where addiction thrives. Keep a live lifeline with your sponsor and fellowship brothers to shatter denial in minutes."'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة جهة اتصال جديدة' : 'Add New Contact'}</span>
          </button>
        </div>
      </div>

      {/* Action Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/90 text-slate-950 text-xs sm:text-sm font-bold text-center rounded-xl shadow-lg transition-all animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* 1. TOP HIGHLIGHTED & LOCKED SPONSOR CARD */}
      {sponsorContact && (
        <div className="relative bg-gradient-to-b from-[#14232c] via-[#101b24] to-[#0c141c] border-2 border-emerald-500/50 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-emerald-950/40">
          <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold text-emerald-300">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>{isAr ? 'الموجه الرئيسي المثبت (Sponsor)' : 'Locked Primary Sponsor'}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-2">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-950/60 shrink-0">
                <UserCheck className="w-7 h-7 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {sponsorContact.name}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-mono text-cyan-400 mt-0.5">
                  {sponsorContact.phone}
                </p>

                {sponsorContact.cleanTime && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/40 mt-1.5">
                    <Award className="w-3 h-3 text-emerald-400" />
                    <span>{sponsorContact.cleanTime}</span>
                  </span>
                )}

                {sponsorContact.notes && (
                  <p className="text-xs text-slate-400 mt-2 max-w-lg leading-relaxed">
                    {sponsorContact.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Quick-action buttons for Sponsor */}
            <div className="flex items-center gap-2.5 pt-2 sm:pt-0 self-stretch sm:self-auto">
              <button
                onClick={() => handleTriggerCall(sponsorContact)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isAr ? 'اتصال فوري' : 'Call Sponsor'}</span>
              </button>

              <button
                onClick={() => handleTriggerWhatsApp(sponsorContact)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'واتساب (ص 84)' : 'WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. RECOVERY FELLOWSHIP BROTHERS SECTION */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              {isAr ? 'زملاء ورفاق التعافي (Fellowship Brothers)' : 'Recovery Fellowship Brothers'}
            </h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
              {fellowshipBrothers.length}
            </span>
          </div>

          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-slate-400" />
            <input
              type="text"
              placeholder={isAr ? 'بحث في أسماء الرفاق...' : 'Search brothers...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {fellowshipBrothers.length === 0 ? (
          <div className="bg-[#101625] border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
            {isAr
              ? 'لا يوجد زملاء مضافون يطابقون البحث. انقر على "إضافة جهة اتصال جديدة" لإضافة رفقاء الدرب.'
              : 'No matching fellowship brothers found. Click "Add New Contact" to expand your support network.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fellowshipBrothers.map((contact) => (
              <div
                key={contact.id}
                className="bg-[#111726] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between gap-3 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                      {contact.name.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{contact.name}</h4>
                      <p className="text-xs font-mono text-slate-400">{contact.phone}</p>
                      {contact.cleanTime && (
                        <span className="text-[10px] text-cyan-300 block mt-0.5">
                          {contact.cleanTime}
                        </span>
                      )}
                      {contact.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {contact.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    className="p-1 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title={isAr ? 'حذف جهة الاتصال' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Contact Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleTriggerCall(contact)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{isAr ? 'اتصال' : 'Call'}</span>
                  </button>

                  <button
                    onClick={() => handleTriggerWhatsApp(contact)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. ADD NEW CONTACT DIALOG / FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0f1523] border border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-[#121828] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isAr ? 'إضافة جهة اتصال جديدة' : 'Add Recovery Contact'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'مشرف أو زميل في زمالة التعافي' : 'Sponsor or fellowship brother'}
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

            {/* Form */}
            <form onSubmit={handleValidateAndSubmit} className="p-5 sm:p-6 space-y-4">
              {/* Role Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isAr ? 'صفة جهة الاتصال:' : 'Role:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('sponsor')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      role === 'sponsor'
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isAr ? 'الموجه (Sponsor)' : 'Sponsor'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('fellow')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      role === 'fellow'
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isAr ? 'زميل تعافي (Fellow Brother)' : 'Fellowship Brother'}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'الاسم الكامل:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: أبو فهد، خالد المنصور...' : 'e.g. John Doe, Khalid...'}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white focus:outline-none placeholder:text-slate-500 ${
                    errors.name ? 'border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-emerald-500'
                  }`}
                />
                {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'رقم الهاتف (مع الرمز الدولي للواتساب):' : 'Phone Number (with country code):'}
                </label>
                <input
                  type="tel"
                  placeholder="+966501234567"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white focus:outline-none placeholder:text-slate-500 ${
                    errors.phone ? 'border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-emerald-500'
                  }`}
                />
                {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Clean Time (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'مدة النقاء والتعافي (اختياري):' : 'Clean Time (Optional):'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: سنتان، 6 أشهر، 5 سنوات...' : 'e.g. 2 years, 6 months...'}
                  value={cleanTime}
                  onChange={(e) => setCleanTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isAr ? 'ملاحظات (اختياري):' : 'Notes (Optional):'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'مثال: نلتقي كل ثلاثاء، رفيق مشاركة الخطوات...' : 'Optional notes...'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50"
                >
                  {isAr ? 'حفظ جهة الاتصال' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
