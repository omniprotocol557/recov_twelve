/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Locale, TimerDisplayMode, SobrietyTime, SpiritualMetrics, AmendItem, SponsorInfo, Step4Entry, NightlyReviewEntry, DirectoryContact } from './types/recovery';
import { SecuritySettings } from './types/security';
import { DR_EMAD_QUOTES, BIG_BOOK_PAGE_84_EXCERPT } from './data/quotes';
import { SAMPLE_STEP4_ENTRIES } from './data/sampleInventory';
import { SAMPLE_NIGHTLY_REVIEWS } from './data/sampleNightly';
import { SAMPLE_CONTACTS } from './data/sampleContacts';
import { Navbar } from './components/Navbar';
import { SobrietyTimer } from './components/SobrietyTimer';
import { SpiritualMeter } from './components/SpiritualMeter';
import { DrEmadQuotesCard } from './components/DrEmadQuotesCard';
import { Step4Inventory } from './components/Step4Inventory';
import { NightlyReviewStep11 } from './components/NightlyReviewStep11';
import { ContactsDirectory } from './components/ContactsDirectory';
import { SecuritySettingsView } from './components/SecuritySettingsView';
import { AppLockScreen } from './components/AppLockScreen';
import { Step10FAB } from './components/Step10FAB';
import { Step10Modal } from './components/Step10Modal';
import { FlutterCodeModal } from './components/FlutterCodeModal';
import { BookOpen, ShieldCheck, Heart, Sparkles, AlertCircle, ArrowUpRight, Users, Lock, Gauge } from 'lucide-react';

const INITIAL_METRICS: SpiritualMetrics = {
  peaceOfMind: 82,
  honestyWithSelf: 90,
  surrenderWillingness: 78,
  serviceConnection: 70
};

const INITIAL_AMENDS: AmendItem[] = [
  {
    id: 'amend-1',
    person: 'زميل العمل',
    wrongCommitted: 'انفعال حاد في الاجتماع الصباحي',
    actionRequired: 'تقديم اعتذار صريح عن النبرة الجافة وتوضيح الاحترام',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'amend-2',
    person: 'الأسرة',
    wrongCommitted: 'تضخيم عذر التأخير للهروب من المسؤولية',
    actionRequired: 'الاعتراف بالحقيقة وتصحيح العذر بنزاهة تامة',
    completed: true,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_SPONSOR: SponsorInfo = {
  name: 'أحمد (المشرف / Sponsor)',
  phone: '+966501234567',
  relationship: 'مشرف الخطوات والموجه الروحي'
};

const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
  isLockEnabled: false,
  isBiometricsEnabled: true,
  pinCode: '1234',
  autoLockDelaySeconds: 0,
  lastActiveTimestamp: Date.now()
};

export default function App() {
  // Locale State (Default Arabic as requested)
  const [locale, setLocale] = useState<Locale>('ar');

  // Sobriety Start Date (Default 42 days ago for rich demonstration)
  const [startDate, setStartDate] = useState<Date>(() => {
    const saved = localStorage.getItem('recovery_start_date');
    if (saved) {
      const parsed = new Date(saved);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 42);
    defaultDate.setHours(defaultDate.getHours() - 7);
    return defaultDate;
  });

  // Timer display mode (circular or linear)
  const [timerMode, setTimerMode] = useState<TimerDisplayMode>('circular');

  // Real-time Sobriety Clock
  const [time, setTime] = useState<SobrietyTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalHours: 0
  });

  // Spiritual Metrics State
  const [metrics, setMetrics] = useState<SpiritualMetrics>(() => {
    const saved = localStorage.getItem('recovery_spiritual_metrics');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_METRICS;
  });

  // Step 10 Amends checklist
  const [amends, setAmends] = useState<AmendItem[]>(() => {
    const saved = localStorage.getItem('recovery_amends');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_AMENDS;
  });

  // Sponsor Info
  const [sponsor, setSponsor] = useState<SponsorInfo>(() => {
    const saved = localStorage.getItem('recovery_sponsor');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_SPONSOR;
  });

  // Active Tab: 'dashboard' | 'step4' | 'nightly' | 'contacts' | 'security'
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'step4' | 'nightly' | 'contacts' | 'security'>('dashboard');

  // Security & App Lock State (Step 5)
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('recovery_security_settings');
    if (saved) {
      try {
        return { ...INITIAL_SECURITY_SETTINGS, ...JSON.parse(saved) };
      } catch {
        // Fallback
      }
    }
    return INITIAL_SECURITY_SETTINGS;
  });

  const [isAppLocked, setIsAppLocked] = useState<boolean>(false);

  // Directory Contacts (Sponsor & Fellowship Brothers)
  const [contacts, setContacts] = useState<DirectoryContact[]>(() => {
    const saved = localStorage.getItem('recovery_contacts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return SAMPLE_CONTACTS;
  });

  // Step 4 Inventory Entries
  const [step4Entries, setStep4Entries] = useState<Step4Entry[]>(() => {
    const saved = localStorage.getItem('recovery_step4_entries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return SAMPLE_STEP4_ENTRIES;
  });

  // Nightly Review Entries
  const [nightlyReviews, setNightlyReviews] = useState<NightlyReviewEntry[]>(() => {
    const saved = localStorage.getItem('recovery_nightly_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return SAMPLE_NIGHTLY_REVIEWS;
  });

  // Modals
  const [isStep10Open, setIsStep10Open] = useState(false);
  const [isFlutterCodeOpen, setIsFlutterCodeOpen] = useState(false);

  // Sync RTL / LTR document direction with locale
  useEffect(() => {
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  // Sobriety live ticking ticker
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - startDate.getTime());
      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const totalHours = Math.floor(totalSeconds / 3600);

      setTime({ days, hours, minutes, seconds, totalHours });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('recovery_start_date', startDate.toISOString());
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem('recovery_spiritual_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('recovery_amends', JSON.stringify(amends));
  }, [amends]);

  useEffect(() => {
    localStorage.setItem('recovery_sponsor', JSON.stringify(sponsor));
  }, [sponsor]);

  useEffect(() => {
    localStorage.setItem('recovery_step4_entries', JSON.stringify(step4Entries));
  }, [step4Entries]);

  useEffect(() => {
    localStorage.setItem('recovery_nightly_reviews', JSON.stringify(nightlyReviews));
  }, [nightlyReviews]);

  useEffect(() => {
    localStorage.setItem('recovery_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('recovery_security_settings', JSON.stringify(securitySettings));
  }, [securitySettings]);

  // Background / Foreground lifecycle auto-lock detection (Step 5)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setSecuritySettings((prev) => ({
          ...prev,
          lastActiveTimestamp: Date.now()
        }));
      } else if (document.visibilityState === 'visible') {
        if (securitySettings.isLockEnabled) {
          const elapsedSec = (Date.now() - securitySettings.lastActiveTimestamp) / 1000;
          if (elapsedSec >= securitySettings.autoLockDelaySeconds) {
            setIsAppLocked(true);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [securitySettings]);

  // Handlers
  const handleUpdateSecuritySettings = (newSettings: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleTriggerLockNow = () => {
    if (securitySettings.isLockEnabled) {
      setIsAppLocked(true);
    }
  };

  const handleEmergencyWipeData = () => {
    setStep4Entries([]);
    setNightlyReviews([]);
    setAmends([]);
    localStorage.removeItem('recovery_step4_entries');
    localStorage.removeItem('recovery_nightly_reviews');
    localStorage.removeItem('recovery_amends');
  };
  const handleToggleLocale = () => {
    setLocale((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleToggleTimerMode = () => {
    setTimerMode((prev) => (prev === 'circular' ? 'linear' : 'circular'));
  };

  const handleUpdateStartDate = (newDate: Date) => {
    setStartDate(newDate);
  };

  const handleUpdateMetrics = (partial: Partial<SpiritualMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...partial }));
  };

  const handleResetMetrics = () => {
    setMetrics(INITIAL_METRICS);
  };

  const handleToggleAmend = (id: string) => {
    setAmends((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddAmend = (text: string) => {
    const newItem: AmendItem = {
      id: `amend-${Date.now()}`,
      person: locale === 'ar' ? 'عام' : 'General',
      wrongCommitted: text,
      actionRequired: text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setAmends((prev) => [newItem, ...prev]);
  };

  const handleDeleteAmend = (id: string) => {
    setAmends((prev) => prev.filter((item) => item.id !== id));
  };

  // Step 4 Handlers
  const handleAddStep4Entry = (entryData: Omit<Step4Entry, 'id' | 'createdAt'>) => {
    const newEntry: Step4Entry = {
      ...entryData,
      id: `step4-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setStep4Entries((prev) => [newEntry, ...prev]);
  };

  const handleDeleteStep4Entry = (id: string) => {
    setStep4Entries((prev) => prev.filter((e) => e.id !== id));
  };

  // Nightly Review Handlers
  const handleSaveNightlyReview = (reviewData: Omit<NightlyReviewEntry, 'id' | 'date'>) => {
    const newReview: NightlyReviewEntry = {
      ...reviewData,
      id: `nightly-${Date.now()}`,
      date: new Date().toISOString()
    };
    setNightlyReviews((prev) => [newReview, ...prev]);
  };

  const handleDeleteNightlyReview = (id: string) => {
    setNightlyReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Contacts Directory Handlers
  const handleAddContact = (contactData: Omit<DirectoryContact, 'id' | 'createdAt'>) => {
    const newContact: DirectoryContact = {
      ...contactData,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (contactData.role === 'sponsor') {
      // Reassign old sponsor to fellow if exists, and keep new sponsor at the top
      setContacts((prev) => [
        newContact,
        ...prev.map((c) => (c.role === 'sponsor' ? { ...c, role: 'fellow' as const } : c))
      ]);
      setSponsor({
        name: newContact.name,
        phone: newContact.phone,
        relationship: isAr ? 'الموجه الرئيسي (Sponsor)' : 'Primary Recovery Sponsor'
      });
    } else {
      setContacts((prev) => [...prev, newContact]);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-cairo selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Contract Navigation */}
      <Navbar
        locale={locale}
        onToggleLocale={handleToggleLocale}
        timerMode={timerMode}
        onToggleTimerMode={handleToggleTimerMode}
        onOpenFlutterCode={() => setIsFlutterCodeOpen(true)}
        onOpenStep10={() => setIsStep10Open(true)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isLockEnabled={securitySettings.isLockEnabled}
        onTriggerLockNow={handleTriggerLockNow}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 sm:pb-8">
        {currentTab === 'security' ? (
          /* Step 5: App Security, Biometrics & Encrypted Vault */
          <SecuritySettingsView
            settings={securitySettings}
            onUpdateSettings={handleUpdateSecuritySettings}
            onTriggerLockNow={handleTriggerLockNow}
            onEmergencyWipeData={handleEmergencyWipeData}
            step4Count={step4Entries.length}
            nightlyCount={nightlyReviews.length}
            contactsCount={contacts.length}
            locale={locale}
          />
        ) : currentTab === 'contacts' ? (
          /* Step 4: Sponsor and Fellowship Directory */
          <ContactsDirectory
            contacts={contacts}
            onAddContact={handleAddContact}
            onDeleteContact={handleDeleteContact}
            locale={locale}
          />
        ) : currentTab === 'nightly' ? (
          /* Step 3: Nightly Review & Step 11 Space */
          <NightlyReviewStep11
            reviews={nightlyReviews}
            onSaveReview={handleSaveNightlyReview}
            onDeleteReview={handleDeleteNightlyReview}
            locale={locale}
          />
        ) : currentTab === 'step4' ? (
          /* Step 2: Step 4 Inventory Digital Journal View */
          <Step4Inventory
            entries={step4Entries}
            onAddEntry={handleAddStep4Entry}
            onDeleteEntry={handleDeleteStep4Entry}
            locale={locale}
          />
        ) : (
          /* Step 1: Dashboard & Step 10 View */
          <>
            {/* Editorial Sub-banner / Big Book Page 84-86 Principle */}
            <div className="bg-gradient-to-r from-emerald-950/30 via-[#101726] to-cyan-950/30 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400">
                      {isAr ? 'قاعدة التعافي اليومية (الكتاب الكبير ص 84 - 86)' : 'Golden Recovery Rule (Big Book pp. 84-86)'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {isAr ? BIG_BOOK_PAGE_84_EXCERPT.quoteAr : BIG_BOOK_PAGE_84_EXCERPT.quoteEn}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() => setCurrentTab('step4')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold whitespace-nowrap transition-colors shadow-sm cursor-pointer"
                >
                  <span>{isAr ? 'دفتر الخطوة 4' : 'Step 4 Ledger'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCurrentTab('nightly')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-500/30 text-xs font-semibold whitespace-nowrap transition-colors shadow-sm cursor-pointer"
                >
                  <span>{isAr ? 'مراجعة المساء والخطوة 11' : 'Nightly & Step 11'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2-Column Grid Split: Left = Sobriety Timer & Dr. Emad Quotes; Right = Spiritual Meter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Column 1: Sobriety Timer & Quotes (7 Cols on desktop) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Sobriety Timer (Circular or Linear) */}
                <SobrietyTimer
                  time={time}
                  startDate={startDate}
                  onUpdateStartDate={handleUpdateStartDate}
                  mode={timerMode}
                  onToggleMode={handleToggleTimerMode}
                  locale={locale}
                />

                {/* 2. Dr. Emad Rashad Osman Daily Recovery Box */}
                <DrEmadQuotesCard quotes={DR_EMAD_QUOTES} locale={locale} />
              </div>

              {/* Column 2: Spiritual Fitness Meter (5 Cols on desktop) */}
              <div className="lg:col-span-5 space-y-6">
                <SpiritualMeter
                  metrics={metrics}
                  onUpdateMetrics={handleUpdateMetrics}
                  onResetDefaults={handleResetMetrics}
                  locale={locale}
                />

                {/* Step 10 Quick Action Callout Card */}
                <div className="bg-[#101625] border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {isAr ? 'هل تشعر باستياء أو خوف الآن؟' : 'Feeling resentment or fear right now?'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {isAr
                      ? 'لا تدع الفكرة تسيطر عليك. اضغط على الزر العائم في الأسفل لتطبيق الخطوة العاشرة الفورية (صلاة إزالة الاستياء، الاتصال بالموجه، التعويض السريع، وإعادة التوجيه).'
                      : 'Do not let the obsession brew. Tap the floating action button below to trigger the Page 84 instant protocol.'}
                  </p>
                  <button
                    onClick={() => setIsStep10Open(true)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-emerald-950/40 cursor-pointer"
                  >
                    {isAr ? 'فتح أداة الخطوة العاشرة الفورية' : 'Open Step 10 Instant Tool'}
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Pillars of Page 84 Infographic / Education Strip */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-center mb-5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isAr ? 'أركان الخطوة العاشرة الفورية الأربعة' : 'The 4 Pillars of Step 10 Daily Reprieve'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#111724] border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">
                    {isAr ? '1. الصلاة الفورية' : '1. Instant Prayer'}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr
                      ? 'طلب التدخل الإلهي لنزع الاستياء والخوف فور لحظة ولادتهما في الذهن.'
                      : 'Asking God immediately to remove fear, selfishness, and resentment.'}
                  </p>
                </div>

                <div className="bg-[#111724] border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-bold text-cyan-400 block mb-1">
                    {isAr ? '2. المناقشة دون تأخير' : '2. Discuss at Once'}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr
                      ? 'تفريغ الفكرة مع المشرف أو رفيق تعافي لكسر العزلة وسحر الإنكار.'
                      : 'Talking it through with a sponsor to break isolation and secret rationalization.'}
                  </p>
                </div>

                <div className="bg-[#111724] border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-bold text-teal-400 block mb-1">
                    {isAr ? '3. التعويض السريع' : '3. Immediate Amends'}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr
                      ? 'تنظيف طرف شارعك بالاعتذار وتصحيح الخطأ فوراً قبل أن يتجذر في النفس.'
                      : 'Sweeping your side of the street instantly before shame or guilt festers.'}
                  </p>
                </div>

                <div className="bg-[#111724] border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-bold text-amber-400 block mb-1">
                    {isAr ? '4. إعادة التوجيه للخدمة' : '4. Resolute Redirection'}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr
                      ? 'توجيه الفكر والطاقة نحو شخص نساعده، فالحب والتسامح هما شريعتنا.'
                      : 'Turning thoughts resolutely toward who we can help; love is our code.'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-800/80 bg-[#090d15] text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            {isAr
              ? 'ميزان التعافي واليقظة اليومية · برنامج الـ 12 خطوة ود. عماد رشاد عثمان'
              : 'Spiritual Recovery Meter · 12-Step Program & Dr. Emad Rashad Series'}
          </span>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsFlutterCodeOpen(true)}
              className="hover:text-cyan-400 transition-colors text-slate-400"
            >
              {isAr ? 'استعراض كود Flutter' : 'Flutter Source Code'}
            </button>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'يوم بيوم فقط' : 'Just for Today'}</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Mirroring Flutter BottomNavigationBar) */}
      <nav
        dir={isAr ? 'rtl' : 'ltr'}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#101726]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around text-[10px]"
      >
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>{isAr ? 'اللوحة' : 'Dashboard'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('step4')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'step4' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isAr ? 'الخطوة 4' : 'Step 4'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('nightly')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'nightly' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAr ? 'المساء والـ 11' : 'Nightly'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('contacts')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'contacts' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isAr ? 'الرفاق' : 'Directory'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('security')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'security' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isAr ? 'الأمان' : 'Security'}</span>
        </button>
      </nav>

      {/* Step 10 Floating Action Button (FAB) on Bottom Right */}
      <Step10FAB onClick={() => setIsStep10Open(true)} locale={locale} />

      {/* Step 10 Bottom Sheet Dialog */}
      <Step10Modal
        isOpen={isStep10Open}
        onClose={() => setIsStep10Open(false)}
        locale={locale}
        amends={amends}
        onToggleAmend={handleToggleAmend}
        onAddAmend={handleAddAmend}
        onDeleteAmend={handleDeleteAmend}
        sponsor={sponsor}
        onUpdateSponsor={setSponsor}
        contacts={contacts}
      />

      {/* Flutter Code Explorer Modal */}
      <FlutterCodeModal
        isOpen={isFlutterCodeOpen}
        onClose={() => setIsFlutterCodeOpen(false)}
        locale={locale}
      />

      {/* App Lock Screen Overlay (Step 5) */}
      <AppLockScreen
        isOpen={isAppLocked && securitySettings.isLockEnabled}
        onUnlock={() => setIsAppLocked(false)}
        correctPin={securitySettings.pinCode}
        isBiometricsEnabled={securitySettings.isBiometricsEnabled}
        locale={locale}
      />
    </div>
  );
}
