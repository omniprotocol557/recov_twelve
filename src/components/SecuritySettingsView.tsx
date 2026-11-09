import React, { useState } from 'react';
import { Locale } from '../types/recovery';
import { SecuritySettings, EncryptedBoxMetadata } from '../types/security';
import {
  ShieldCheck,
  Lock,
  Fingerprint,
  KeyRound,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  HardDriveDownload,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';

interface SecuritySettingsViewProps {
  settings: SecuritySettings;
  onUpdateSettings: (newSettings: Partial<SecuritySettings>) => void;
  onTriggerLockNow: () => void;
  onEmergencyWipeData: () => void;
  step4Count: number;
  nightlyCount: number;
  contactsCount: number;
  locale: Locale;
}

export const SecuritySettingsView: React.FC<SecuritySettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onTriggerLockNow,
  onEmergencyWipeData,
  step4Count,
  nightlyCount,
  contactsCount,
  locale
}) => {
  const isAr = locale === 'ar';

  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  const encryptedBoxes: EncryptedBoxMetadata[] = [
    {
      name: 'step4_inventory',
      nameAr: 'دفتر جرد الخطوة الرابعة (الاستياء، الخوف، الضرر)',
      itemCount: step4Count,
      cipherAlgorithm: 'AES-256 (HiveAesCipher)',
      isEncrypted: true,
      storageTarget: 'Hive Encrypted Box / SharedPreferences Protected',
      descriptionAr: 'يحتوي على الأطراف، الأسباب، الأجزاء المتأثرة، وتحليل نصيبي بدقة تامة وبأعلى سرية.',
      descriptionEn: 'Stores resentment targets, causes, affected parts, and personal inventory columns.'
    },
    {
      name: 'nightly_reviews',
      nameAr: 'مراجعة المساء ويوميات الامتنان (الخطوة 11)',
      itemCount: nightlyCount,
      cipherAlgorithm: 'AES-256 (HiveAesCipher)',
      isEncrypted: true,
      storageTarget: 'Hive Encrypted Box / Secure KeyStore',
      descriptionAr: 'أسئلة المساء الستة من كتاب الأساسيات وقوائم الامتنان اليومي لإعادة برمجة التفكير.',
      descriptionEn: 'The 6 Big Book evening questions and daily gratitude logs for spiritual fitness.'
    },
    {
      name: 'recovery_contacts',
      nameAr: 'دليل الموجه ورفاق التعافي (شبكة المحاسبة)',
      itemCount: contactsCount,
      cipherAlgorithm: 'AES-256 (HiveAesCipher)',
      isEncrypted: true,
      storageTarget: 'FlutterSecureStorage / KeyChain Hardware',
      descriptionAr: 'أرقام هواتف المشرف ورفاق الزمالة لمناقشة أزمات واستياءات الخطوة العاشرة فوراً.',
      descriptionEn: 'Sponsor and fellowship phone numbers for immediate Step 10 crisis reach-out.'
    }
  ];

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);

    if (oldPinInput !== settings.pinCode) {
      setPinChangeError(isAr ? 'رمز المرور الحالي غير صحيح.' : 'Current PIN is incorrect.');
      return;
    }
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setPinChangeError(isAr ? 'يجب أن يتكون الرمز الجديد من 4 أرقام.' : 'New PIN must be exactly 4 digits.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeError(isAr ? 'الرمز الجديد وتأكيده غير متطابقين.' : 'New PIN and confirmation do not match.');
      return;
    }

    onUpdateSettings({ pinCode: newPinInput });
    setPinChangeSuccess(true);
    setTimeout(() => {
      setPinChangeSuccess(false);
      setIsChangingPin(false);
      setOldPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner: Absolute Privacy Commitment */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#101928] to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {isAr ? 'بروتوكول الأمان والسرية المطلقة' : 'Absolute Privacy Protocol'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isAr ? 'بدون خوادم خارجية' : 'Zero Remote Leak'}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-white mt-1">
                {isAr ? 'إعدادات قفل التطبيق والتشفير المحلي (Step 5)' : 'App Lock & Local Encryption (Step 5)'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {isAr
                  ? 'تم تصميم هذا التطبيق لضمان سرية جردك الروحي التامة: جميع بيانات الخطوة 4، مراجعات المساء، وأرقام رفاقك مشفرة محلياً بمفتاح AES-256 داخل مستودع المفاتيح الآمن في جهازك.'
                  : 'Designed for absolute anonymity: all Step 4 inventories, nightly reviews, and recovery contacts remain strictly encrypted on-device via AES-256.'}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-2 shrink-0">
            <button
              onClick={onTriggerLockNow}
              disabled={!settings.isLockEnabled}
              className={`w-full px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                settings.isLockEnabled
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isAr ? 'قفل التطبيق الآن' : 'Lock App Now'}</span>
            </button>
            <span className="text-[11px] text-slate-500 text-center hidden sm:block">
              {settings.isLockEnabled
                ? (isAr ? 'لتجربة شاشة القفل فوراً' : 'Test lock screen now')
                : (isAr ? 'قم بتفعيل القفل أولاً' : 'Enable lock first')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: App Lock & Biometrics Configuration */}
        <div className="bg-[#131A26] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isAr ? 'حماية التطبيق بالرمز والبصمة' : 'Passcode & Biometrics'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr ? 'تأمين التطبيق عند التشغيل والعودة من الخلفية' : 'Lock on app launch or resuming from background'}
              </p>
            </div>
          </div>

          {/* Toggle 1: Enable App Lock */}
          <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-white block">
                {isAr ? 'تفعيل قفل التطبيق (App Lock)' : 'Enable App Lock'}
              </span>
              <span className="text-xs text-slate-400 block">
                {isAr
                  ? 'طلب الرمز أو البصمة كلما تم فتح التطبيق أو تركه'
                  : 'Require PIN or biometrics upon opening app'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isLockEnabled}
                onChange={(e) => onUpdateSettings({ isLockEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>

          {/* Toggle 2: Biometric Authentication (Face ID / Fingerprint) */}
          <div className={`flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 transition-opacity ${!settings.isLockEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-white block">
                  {isAr ? 'المصادقة الحيوية (Face ID / Touch ID)' : 'Biometric Authentication'}
                </span>
                <span className="text-xs text-slate-400 block">
                  {isAr
                    ? 'استخدام البصمة الحيوية لتخطي كتابة الرمز يدوياً'
                    : 'Use device fingerprint/facial scan for instant unlock'}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                disabled={!settings.isLockEnabled}
                checked={settings.isBiometricsEnabled}
                onChange={(e) => onUpdateSettings({ isBiometricsEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>

          {/* Change PIN section */}
          <div className={`p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 ${!settings.isLockEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  {isAr ? 'رمز المرور المكون من 4 أرقام (PIN)' : '4-Digit PIN Passcode'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(!isChangingPin);
                  setPinChangeError(null);
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer transition-colors"
              >
                {isChangingPin ? (isAr ? 'إلغاء' : 'Cancel') : (isAr ? 'تغيير الرمز' : 'Change PIN')}
              </button>
            </div>

            {!isChangingPin ? (
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span>{isAr ? 'الرمز الحالي محمي ومُخزن محلياً' : 'Current PIN is encrypted locally'}</span>
                <span className="font-mono tracking-widest text-emerald-400">••••</span>
              </div>
            ) : (
              <form onSubmit={handleSaveNewPin} className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    {isAr ? 'الرمز الحالي *' : 'Current PIN *'}
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={oldPinInput}
                    onChange={(e) => setOldPinInput(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      {isAr ? 'الرمز الجديد (4 أرقام) *' : 'New PIN (4 digits) *'}
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      {isAr ? 'تأكيد الرمز الجديد *' : 'Confirm New PIN *'}
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {pinChangeError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{pinChangeError}</span>
                  </p>
                )}

                {pinChangeSuccess && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{isAr ? 'تم تحديث الرمز بنجاح!' : 'PIN updated successfully!'}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {isAr ? 'حفظ رمز المرور الجديد' : 'Save New PIN'}
                </button>
              </form>
            )}
          </div>

          {/* Auto-lock timer option */}
          <div className={`space-y-2 ${!settings.isLockEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'مدة القفل التلقائي عند مغادرة التطبيق' : 'Auto-Lock Timeout'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { sec: 0, labelAr: 'فوري', labelEn: 'Immediately' },
                { sec: 60, labelAr: 'بعد دقيقة', labelEn: '1 min' },
                { sec: 300, labelAr: 'بعد 5 دقائق', labelEn: '5 min' }
              ].map((item) => (
                <button
                  key={item.sec}
                  type="button"
                  onClick={() => onUpdateSettings({ autoLockDelaySeconds: item.sec })}
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                    settings.autoLockDelaySeconds === item.sec
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? item.labelAr : item.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Encrypted Local Storage Architecture */}
        <div className="bg-[#131A26] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {isAr ? 'هندسة التشفير المحلي (Local Encrypted Vault)' : 'Encrypted Local Storage Vault'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'خزائن مشفرة بنظام Hive AES-256 و FlutterSecureStorage' : 'Encrypted Hive AES-256 & SecureStorage architecture'}
                </p>
              </div>
            </div>

            {/* Boxes list */}
            <div className="space-y-3">
              {encryptedBoxes.map((box) => (
                <div
                  key={box.name}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-white">
                        {isAr ? box.nameAr : box.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                      {box.itemCount} {isAr ? 'عنصر مشفر' : 'records'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {isAr ? box.descriptionAr : box.descriptionEn}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/50">
                    <span>{box.cipherAlgorithm}</span>
                    <span className="font-mono text-emerald-400">{isAr ? 'محمي محلياً' : 'On-device only'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Zero Remote Guarantee Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px] sm:text-xs">
                <strong>{isAr ? 'مبدأ عدم الإرسال (Zero Knowledge):' : 'Zero Knowledge Assurance:'}</strong>{' '}
                {isAr
                  ? 'مفتاح التشفير يولد عشوائياً ويحفظ في معالج الأمان المادي للجهاز (Secure Enclave). لا يتصل التطبيق بأي سحابة أو خدمة خارجية.'
                  : 'Encryption key is generated on-device and stored in hardware KeyStore/Keychain. No remote database or analytics.'}
              </div>
            </div>
          </div>

          {/* Emergency Local Data Wipe */}
          <div className="pt-3 border-t border-slate-800">
            {!showWipeConfirm ? (
              <button
                type="button"
                onClick={() => setShowWipeConfirm(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'مسح أمني طارئ لكافة البيانات المشفرة' : 'Emergency Local Data Wipe'}</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2 animate-fadeIn">
                <p className="text-xs text-rose-200 font-semibold text-center">
                  {isAr
                    ? 'هل أنت متأكد؟ سيتم حذف جميع سجلات الجرد واليوميات والجهات نهائياً من الجهاز.'
                    : 'Are you sure? This permanently wipes all Step 4 records, reviews, and contacts.'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onEmergencyWipeData();
                      setShowWipeConfirm(false);
                    }}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {isAr ? 'نعم، امسح كل شيء' : 'Yes, Wipe Everything'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWipeConfirm(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
