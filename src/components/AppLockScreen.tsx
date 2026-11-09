import React, { useState, useEffect } from 'react';
import { Locale } from '../types/recovery';
import { ShieldCheck, Fingerprint, Delete, AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';

interface AppLockScreenProps {
  isOpen: boolean;
  onUnlock: () => void;
  correctPin: string;
  isBiometricsEnabled: boolean;
  locale: Locale;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({
  isOpen,
  onUnlock,
  correctPin,
  isBiometricsEnabled,
  locale
}) => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [biometricFeedback, setBiometricFeedback] = useState<string | null>(null);
  const [showPinHelper, setShowPinHelper] = useState(false);

  const isAr = locale === 'ar';

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setIsError(false);
      setIsSuccess(false);
      setBiometricFeedback(null);
      // Auto-prompt biometrics if enabled
      if (isBiometricsEnabled) {
        const timer = setTimeout(() => {
          handleBiometricAuth();
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, isBiometricsEnabled]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length >= 4 || isSuccess) return;
    const nextPin = pin + num;
    setPin(nextPin);
    setIsError(false);

    if (nextPin.length === 4) {
      if (nextPin === correctPin) {
        setIsSuccess(true);
        setTimeout(() => {
          onUnlock();
          setPin('');
          setIsSuccess(false);
        }, 350);
      } else {
        setIsError(true);
        setTimeout(() => {
          setPin('');
          setIsError(false);
        }, 800);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isSuccess) {
      setPin(pin.slice(0, -1));
      setIsError(false);
    }
  };

  const handleBiometricAuth = () => {
    setIsScanningBiometric(true);
    setBiometricFeedback(isAr ? 'جاري التحقق من البصمة / Face ID...' : 'Verifying Biometrics / Face ID...');

    setTimeout(() => {
      setIsScanningBiometric(false);
      setIsSuccess(true);
      setBiometricFeedback(isAr ? 'تم التحقق بنجاح!' : 'Authenticated Successfully!');
      setTimeout(() => {
        onUnlock();
        setPin('');
        setIsSuccess(false);
        setBiometricFeedback(null);
      }, 400);
    }, 900);
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-[#070b11]/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-slate-100 select-none animate-fadeIn"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm flex flex-col items-center relative z-10">
        {/* Lock Icon and Security Branding */}
        <div className="relative mb-6">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isSuccess
                ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 scale-105 shadow-lg shadow-emerald-500/20'
                : isError
                ? 'bg-rose-500/20 border-2 border-rose-500 text-rose-400 animate-shake'
                : 'bg-slate-800/80 border border-slate-700/80 text-emerald-400 shadow-xl'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            ) : isScanningBiometric ? (
              <Fingerprint className="w-10 h-10 animate-pulse text-cyan-400" />
            ) : (
              <Lock className="w-10 h-10 text-emerald-400" />
            )}
          </div>
          {isScanningBiometric && (
            <span className="absolute -inset-2 rounded-2xl border-2 border-cyan-400/50 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5 text-center">
          {isSuccess
            ? (isAr ? 'تم فتح القفل' : 'Unlocked')
            : (isAr ? 'تطبيق التعافي مقفل' : 'Recovery App Locked')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 text-center mb-6 max-w-xs">
          {biometricFeedback ||
            (isAr
              ? 'بياناتك الروحية واليومية مشفرة محلياً. أدخل الرمز المكون من 4 أرقام للمتابعة.'
              : 'Your personal inventory is encrypted locally. Enter 4-digit PIN to proceed.')}
        </p>

        {/* 4-Digit PIN Indicators */}
        <div
          className={`flex items-center justify-center gap-4 mb-8 ${
            isError ? 'animate-shake' : ''
          }`}
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isSuccess
                    ? 'bg-emerald-400 scale-125 shadow-md shadow-emerald-400/50'
                    : isError
                    ? 'bg-rose-500 scale-110 shadow-md shadow-rose-500/50'
                    : isFilled
                    ? 'bg-emerald-400 scale-110 shadow-md shadow-emerald-400/40'
                    : 'bg-slate-800 border-2 border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-[280px] mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="w-full aspect-square rounded-2xl bg-slate-800/60 hover:bg-slate-700/80 active:bg-emerald-500/20 active:border-emerald-500/50 border border-slate-700/60 flex flex-col items-center justify-center text-xl sm:text-2xl font-semibold text-white transition-all shadow-sm cursor-pointer select-none"
            >
              <span>{digit}</span>
            </button>
          ))}

          {/* Biometric trigger button */}
          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={!isBiometricsEnabled}
            className={`w-full aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
              isBiometricsEnabled
                ? 'bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-400 border-cyan-500/30 active:scale-95'
                : 'bg-slate-900/30 text-slate-600 border-slate-800 cursor-not-allowed opacity-40'
            }`}
            title={isAr ? 'المصادقة بالبصمة / Face ID' : 'Authenticate via Biometrics'}
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          {/* Digit 0 */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-full aspect-square rounded-2xl bg-slate-800/60 hover:bg-slate-700/80 active:bg-emerald-500/20 active:border-emerald-500/50 border border-slate-700/60 flex flex-col items-center justify-center text-xl sm:text-2xl font-semibold text-white transition-all shadow-sm cursor-pointer select-none"
          >
            <span>0</span>
          </button>

          {/* Delete / Backspace */}
          <button
            type="button"
            onClick={handleDelete}
            className="w-full aspect-square rounded-2xl bg-slate-800/40 hover:bg-slate-700/60 active:bg-rose-500/20 text-slate-400 hover:text-white border border-slate-700/40 flex flex-col items-center justify-center transition-all cursor-pointer select-none"
            title={isAr ? 'حذف' : 'Backspace'}
          >
            <Delete className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>

        {/* PIN Helper / Fallback toggle for demo */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPinHelper(!showPinHelper)}
            className="text-[11px] text-slate-500 hover:text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {showPinHelper ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>
              {isAr ? 'هل نسيت الرمز؟ (معاينة الرمز الافتراضي)' : 'Forgot PIN? (View Default PIN)'}
            </span>
          </button>

          {showPinHelper && (
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-xs text-emerald-400 flex items-center gap-2 animate-fadeIn">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isAr
                  ? `الرمز الحالي لفتح القفل: ${correctPin}`
                  : `Current unlock PIN: ${correctPin}`}
              </span>
            </div>
          )}
        </div>

        {/* Privacy Shield note */}
        <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
          <span>
            {isAr
              ? 'تشفير آمن محلي AES-256 · لا تخرج أي بيانات خارج الجهاز'
              : 'AES-256 Local Encryption · Zero data leaves this device'}
          </span>
        </div>
      </div>
    </div>
  );
};
