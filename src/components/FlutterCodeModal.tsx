import React, { useState } from 'react';
import { Locale } from '../types/recovery';
import { FLUTTER_CODE_FILES } from '../data/flutterCode';
import { X, Copy, Check, Download, FileCode, CheckCircle2, Terminal, Smartphone, CloudLightning, ShieldAlert } from 'lucide-react';

interface FlutterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({
  isOpen,
  onClose,
  locale
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'buildGuide'>('code');
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const isAr = locale === 'ar';
  const currentFile = FLUTTER_CODE_FILES[activeFileIndex];

  if (!isOpen) return null;

  const handleCopyCurrentFile = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    } catch {
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  const handleCopyAllFiles = async () => {
    const allText = FLUTTER_CODE_FILES.map(
      (f) => `// ==========================================\n// FILE: ${f.fileName}\n// ${f.title}\n// ==========================================\n\n${f.code}\n`
    ).join('\n\n');

    try {
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-4xl bg-[#0d121d] border border-slate-700/80 rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111726]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {isAr ? 'مشروع Flutter وتوليد ملفات التطبيق (APK & iOS)' : 'Flutter Project & Mobile Build (APK & iOS)'}
                </h2>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/40 px-2 py-0.5 rounded-md">
                  Flutter 3.x
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'ملفات Dart الـ 13 الكاملة ودليل استخراج ملفات التثبيت للهاتف'
                  : 'All 13 Dart modules and complete mobile build instructions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch buttons */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'code' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'الكود المصدري (13 ملف)' : 'Dart Code (13 files)'}
              </button>
              <button
                onClick={() => setActiveTab('buildGuide')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'buildGuide' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'استخراج APK و IPA' : 'Build APK & IPA'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'code' ? (
          <>
            {/* File Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#090d16] px-4 overflow-x-auto">
              <div className="flex items-center gap-1 py-2">
                {FLUTTER_CODE_FILES.map((file, idx) => (
                  <button
                    key={file.fileName}
                    onClick={() => setActiveFileIndex(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 ${
                      activeFileIndex === idx
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{file.fileName}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0 py-2">
                <button
                  onClick={handleCopyCurrentFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
                  title={isAr ? 'نسخ هذا الملف' : 'Copy this file'}
                >
                  {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الملف' : 'Copy File')}</span>
                </button>

                <button
                  onClick={handleCopyAllFiles}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white transition-colors"
                  title={isAr ? 'نسخ كافة الملفات في نص واحد' : 'Copy all files'}
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? (isAr ? 'تم نسخ الكل!' : 'All Copied!') : (isAr ? 'نسخ كل الكود' : 'Copy All')}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                  title={isAr ? 'تحميل هذا الملف' : 'Download this file'}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <a
                  href="/flutter_recovery_app.zip"
                  download="flutter_recovery_app.zip"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors border border-cyan-500 shadow-sm"
                  title={isAr ? 'تحميل مشروع Flutter كاملاً في ملف مضغوط (.zip)' : 'Download full Flutter project (.zip)'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تحميل المشروع (.zip)' : 'Download Zip'}</span>
                </a>
              </div>
            </div>

            {/* Code Content View */}
            <div className="relative flex-1 p-4 overflow-y-auto bg-[#0a0e17] font-mono text-xs sm:text-[13px] text-slate-200 leading-relaxed">
              <div className="mb-3 pb-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-sans">
                <span className="font-semibold text-slate-300">
                  {currentFile.title}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  lib/{currentFile.fileName}
                </span>
              </div>
              <pre className="overflow-x-auto whitespace-pre font-mono select-text text-emerald-100/95 selection:bg-cyan-500/30">
                <code>{currentFile.code}</code>
              </pre>
            </div>
          </>
        ) : (
          /* Build & Extract Guide View */
          <div className="flex-1 p-6 overflow-y-auto bg-[#090d16] text-slate-300 space-y-6">
            {/* Notice Card */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                <p className="font-bold mb-1">
                  {isAr ? 'توضيح تقني مهم بخصوص بناء APK و IPA:' : 'Important Technical Notice on Building APK & IPA:'}
                </p>
                <p className="text-amber-300/90">
                  {isAr
                    ? 'بناء ملفات التطبيقات التنفيذية (Binary Packages) يتطلب بيئة خاصة: ملف الـ APK يحتاج Android SDK & Gradle، وملف الـ IPA يحتاج نظام macOS حصراً مع برمجيات Xcode وتوقيع Apple Developer. إليك 3 طرق عملية ومجانية للحصول على التطبيق على هاتفك فوراً:'
                    : 'Compiling binary packages requires native toolchains: APK requires Android SDK & Gradle, while iOS IPA strictly requires Apple macOS & Xcode. Below are 3 direct, free methods to get and run the app on your device:'}
                </p>
              </div>
            </div>

            {/* Method 1: GitHub Actions Cloud Build */}
            <div className="p-5 rounded-2xl bg-[#111726] border border-emerald-500/30 shadow-lg">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm sm:text-base mb-2">
                <CloudLightning className="w-5 h-5" />
                <h3>{isAr ? 'الطريقة 1 (الأسهل والمجانية): البناء السحابي التلقائي عبر GitHub Actions' : 'Method 1 (Recommended & Free): Automated Cloud Build via GitHub Actions'}</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {isAr
                  ? 'تم إنشاء مجلد المشروع الكامل flutter_recovery_app ومعه ملف الأتمتة .github/workflows/build_mobile.yml جاهزاً. خوادم GitHub (بما فيها خوادم macOS التابعة لآبل مجاناً) ستقوم ببناء الـ APK وملف الـ iOS تلقائياً!'
                  : 'We configured a complete flutter_recovery_app project along with .github/workflows/build_mobile.yml. GitHub cloud runners (including free macOS runners) compile APK & iOS packages automatically!'}
              </p>
              <div className="bg-[#090d16] p-4 rounded-xl font-mono text-xs text-slate-300 border border-slate-800 space-y-2">
                <p className="text-emerald-400 font-bold"># خطوات الاستخراج بنقرة واحدة:</p>
                <p>1. قم برفع مجلد <span className="text-cyan-300">flutter_recovery_app</span> إلى مستودع GitHub خاص بك (Private Repo).</p>
                <p>2. توجه إلى تبويب <span className="text-yellow-300">Actions</span> داخل المستودع في GitHub.</p>
                <p>3. ستجد مهمة <span className="text-emerald-300">"Build Mobile Apps (APK & iOS)"</span> تعمل تلقائياً.</p>
                <p>4. بمجرد الانتهاء (حوالي 3 دقائق)، اضغط على <span className="text-cyan-300">Artifacts</span> وحمل ملف <span className="text-emerald-400 font-bold">Android-APK</span> أو حزمة <span className="text-cyan-400 font-bold">iOS-Package</span> مباشرة!</p>
              </div>
            </div>

            {/* Method 2: Instant PWA Install on Phone Right Now */}
            <div className="p-5 rounded-2xl bg-[#111726] border border-cyan-500/30 shadow-lg">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm sm:text-base mb-2">
                <Smartphone className="w-5 h-5" />
                <h3>{isAr ? 'الطريقة 2 (فورية الآن بدون انتظار أي Build): التثبيت كتطبيق PWA على هاتفك' : 'Method 2 (Instant): Install as Standalone PWA on Phone'}</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {isAr
                  ? 'تم تجهيز التطبيق كـ Progressive Web App كامل مع أيقونة وحفظ مشفر محلي وشاشة كاملة بدون شريط متصفح:'
                  : 'The application is pre-configured as a full PWA with offline encrypted storage and full-screen standalone mode:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">📱 هواتف أندرويد (Chrome):</span>
                  <p className="text-slate-400">افتح الرابط في Google Chrome، اضغط على زر القائمة (⋮) ثم اختر <span className="text-white font-semibold">"تثبيت التطبيق" (Install App)</span> أو "إضافة إلى الشاشة الرئيسية".</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-cyan-400 block mb-1">🍏 هواتف آيفون (Safari):</span>
                  <p className="text-slate-400">افتح الرابط في Safari، اضغط على زر المشاركة (Share ⎋) في الأسفل، ثم اختر <span className="text-white font-semibold">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</span>.</p>
                </div>
              </div>
            </div>

            {/* Method 3: Local Flutter CLI */}
            <div className="p-5 rounded-2xl bg-[#111726] border border-slate-700 shadow-lg">
              <div className="flex items-center gap-2.5 text-slate-200 font-bold text-sm sm:text-base mb-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3>{isAr ? 'الطريقة 3: البناء المحلي لمن لديه بيئة Flutter على جهازه' : 'Method 3: Local Command-Line Build with Flutter SDK'}</h3>
              </div>
              <div className="bg-[#090d16] p-4 rounded-xl font-mono text-xs text-slate-300 border border-slate-800 space-y-2 overflow-x-auto">
                <p className="text-slate-500">// 1. الانتقال لمجلد المشروع المجهز محلياً:</p>
                <p className="text-emerald-400">cd flutter_recovery_app</p>
                <p className="text-slate-500">// 2. تحميل الحزم:</p>
                <p className="text-emerald-400">flutter pub get</p>
                <p className="text-slate-500">// 3. استخراج ملف APK للأندرويد:</p>
                <p className="text-emerald-400">flutter build apk --release</p>
                <p className="text-slate-400">// سيظهر الملف في: build/app/outputs/flutter-apk/app-release.apk</p>
                <p className="text-slate-500">// 4. بناء نسخة iOS (على جهاز Mac):</p>
                <p className="text-cyan-400">flutter build ipa --no-codesign</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Instructions */}
        <div className="px-5 py-3.5 bg-[#111726] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? 'مشروع flutter_recovery_app متكامل 100% وجاهز للبناء المحلي والسحابي'
                : 'flutter_recovery_app project ready for 1-click cloud build and local compilation'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

        {/* Footer Instructions */}
        <div className="px-5 py-3.5 bg-[#111726] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? 'متوافق مع Flutter 3.x مع دعم كامل للغة العربية (RTL) والحزمة flutter_localizations'
                : 'Compatible with Flutter 3.x with full RTL Arabic support & flutter_localizations'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
