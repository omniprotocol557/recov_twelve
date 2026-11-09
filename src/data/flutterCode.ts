export const FLUTTER_CODE_FILES = [
  {
    fileName: 'main.dart',
    title: 'نقطة الدخول وشريط التنقل السفلي والدرج الجانبي (Native Mobile Shell & Navigation)',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:path_provider/path_provider.dart';
import 'package:hive_flutter/hive_flutter.dart';

// Module 1: Dashboard, Spiritual Meter & Step 10
import 'dashboard_screen.dart';
import 'spiritual_state.dart';
import 'step10_sheet.dart';

// Module 2: Step 4 Inventory Digital Journal
import 'step4_inventory_screen.dart';

// Module 3: Daily Review & Step 11 Gratitude Space
import 'step11_nightly_review_screen.dart';

// Module 4: Sponsor & Fellowship Directory
import 'contacts_directory_screen.dart';
import 'contact_models.dart';

// Module 5: Security, Biometrics & Encrypted Vault
import 'security_service.dart';
import 'app_lock_screen.dart';
import 'security_settings_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. ضبط إعدادات النظام للهواتف الذكية (iOS & Android)
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      statusBarBrightness: Brightness.dark,
      systemNavigationBarColor: Color(0xFF101726),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // تثبيت اتجاه الشاشة عمودياً لتجربة استخدام سهلة باليد الواحدة
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // 2. تهيئة مسار التخزين المشفر في مجلدات الهاتف المحلية (Offline Local Storage)
  try {
    final appDocDir = await getApplicationDocumentsDirectory();
    await Hive.initFlutter(appDocDir.path);
  } catch (_) {
    await Hive.initFlutter();
  }

  // 3. تهيئة الخزينة المشفرة بمفتاح AES-256 (محلي 100% بدون أي خوادم)
  final storageService = SecureStorageService();
  await storageService.initializeVault();

  runApp(const SpiritualRecoveryApp());
}

class SpiritualRecoveryApp extends StatefulWidget {
  const SpiritualRecoveryApp({super.key});

  static _SpiritualRecoveryAppState of(BuildContext context) =>
      context.findAncestorStateOfType<_SpiritualRecoveryAppState>()!;

  @override
  State<SpiritualRecoveryApp> createState() => _SpiritualRecoveryAppState();
}

class _SpiritualRecoveryAppState extends State<SpiritualRecoveryApp> {
  // اللغة الافتراضية: العربية (RTL) مع إمكانية التبديل للإنجليزية
  Locale _currentLocale = const Locale('ar');

  late final RecoveryStateNotifier _recoveryNotifier;
  late final ContactsNotifier _contactsNotifier;
  late final SecurityNotifier _securityNotifier;
  late final SecureStorageService _storageService;

  @override
  void initState() {
    super.initState();
    _storageService = SecureStorageService();
    _recoveryNotifier = RecoveryStateNotifier();
    _contactsNotifier = ContactsNotifier();
    _securityNotifier = SecurityNotifier();
  }

  @override
  void dispose() {
    _recoveryNotifier.dispose();
    _contactsNotifier.dispose();
    _securityNotifier.dispose();
    super.dispose();
  }

  void toggleLocale() {
    HapticFeedback.lightImpact();
    setState(() {
      _currentLocale = _currentLocale.languageCode == 'ar'
          ? const Locale('en')
          : const Locale('ar');
    });
  }

  Locale get currentLocale => _currentLocale;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'التعافي واليقظة اليومية',
      debugShowCheckedModeBanner: false,
      locale: _currentLocale,
      supportedLocales: const [
        Locale('ar'),
        Locale('en'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B0F17),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF10B981), // Emerald 500
          secondary: Color(0xFF06B6D4), // Cyan 500
          surface: Color(0xFF131A26),
          surfaceContainerHighest: Color(0xFF1E293B),
          onPrimary: Colors.white,
          onSurface: Color(0xFFF1F5F9),
        ),
        fontFamily: _currentLocale.languageCode == 'ar' ? 'Cairo' : 'sans-serif',
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF101726),
          elevation: 0,
          scrolledUnderElevation: 0,
          centerTitle: false,
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: Color(0xFF101726),
          selectedItemColor: Color(0xFF10B981),
          unselectedItemColor: Color(0xFF64748B),
          type: BottomNavigationBarType.fixed,
          elevation: 8,
        ),
      ),
      home: MainNavigationShell(
        recoveryNotifier: _recoveryNotifier,
        contactsNotifier: _contactsNotifier,
        securityNotifier: _securityNotifier,
        storageService: _storageService,
      ),
    );
  }
}

/// الهيكل الرئيسي للموبايل: شريط التنقل السفلي + القائمة الجانبية + زر الخطوة 10 العائم
class MainNavigationShell extends StatefulWidget {
  final RecoveryStateNotifier recoveryNotifier;
  final ContactsNotifier contactsNotifier;
  final SecurityNotifier securityNotifier;
  final SecureStorageService storageService;

  const MainNavigationShell({
    super.key,
    required this.recoveryNotifier,
    required this.contactsNotifier,
    required this.securityNotifier,
    required this.storageService,
  });

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  void _openStep10InstantModal(BuildContext context) {
    HapticFeedback.mediumImpact();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Step10BottomSheet(notifier: widget.recoveryNotifier),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    // الصفحات الخمس المحسنة لشاشات الهواتف
    final List<Widget> pages = [
      // 1. اللوحة والميزان وعداد التعافي (بدون AppBar إضافي مكرر)
      DashboardScreen(
        notifier: widget.recoveryNotifier,
        showAppBar: false,
      ),

      // 2. دفتر جرد الخطوة الرابعة ذو الـ 4 أعمدة
      const Step4InventoryScreen(),

      // 3. مراجعة المساء والخطوة 11 (الامتنان والتأمل)
      const Step11NightlyReviewScreen(),

      // 4. دليل الموجه ورفاق التعافي
      ContactsDirectoryScreen(
        contactsNotifier: widget.contactsNotifier,
        isAr: isAr,
      ),

      // 5. الأمان، المصادقة الحيوية والخزينة المشفرة محلياً
      SecuritySettingsScreen(
        securityNotifier: widget.securityNotifier,
        storageService: widget.storageService,
        isAr: isAr,
      ),
    ];

    return Directionality(
      textDirection: isAr ? TextDirection.rtl : TextDirection.ltr,
      child: Stack(
        children: [
          Scaffold(
            key: _scaffoldKey,
            backgroundColor: const Color(0xFF0B0F17),
            // القائمة الجانبية للهاتف (Mobile Side Drawer)
            drawer: _buildMobileDrawer(context, isAr),
            appBar: AppBar(
              backgroundColor: const Color(0xFF101726),
              elevation: 0,
              leading: IconButton(
                icon: const Icon(Icons.menu_rounded, color: Color(0xFF10B981)),
                tooltip: isAr ? 'القائمة الجانبية' : 'Menu Drawer',
                onPressed: () => _scaffoldKey.currentState?.openDrawer(),
              ),
              title: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF10B981), Color(0xFF06B6D4)],
                      ),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.shield_rounded, color: Colors.white, size: 18),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          isAr ? 'برنامج التعافي' : 'Recovery App',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        Text(
                          _getTabSubtitle(_currentIndex, isAr),
                          style: const TextStyle(
                            color: Color(0xFF10B981),
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              actions: [
                // زر القفل الفوري للموبايل
                AnimatedBuilder(
                  animation: widget.securityNotifier,
                  builder: (context, _) {
                    if (!widget.securityNotifier.isLockEnabled) return const SizedBox.shrink();
                    return IconButton(
                      icon: const Icon(Icons.lock_outline_rounded, color: Color(0xFF10B981), size: 22),
                      tooltip: isAr ? 'قفل التطبيق الآن' : 'Lock Now',
                      onPressed: () {
                        HapticFeedback.heavyImpact();
                        widget.securityNotifier.lockNow();
                      },
                    );
                  },
                ),
                // زر تبديل اللغة السريع
                IconButton(
                  icon: const Icon(Icons.language_rounded, color: Color(0xFF94A3B8), size: 22),
                  tooltip: isAr ? 'English' : 'العربية',
                  onPressed: () {
                    SpiritualRecoveryApp.of(context).toggleLocale();
                  },
                ),
              ],
            ),

            // الحفاظ على حالة التمرير والبيانات عبر IndexedStack
            body: IndexedStack(
              index: _currentIndex,
              children: pages,
            ),

            // زر الخطوة العاشرة الفورية العائم المهيأ للإبهام (Step 10 Floating Action Button)
            floatingActionButton: FloatingActionButton.extended(
              onPressed: () => _openStep10InstantModal(context),
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              elevation: 8,
              icon: const Icon(Icons.bolt_rounded, size: 22),
              label: Text(
                isAr ? 'الخطوة 10 الفورية' : 'Step 10 Instant',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
            ),
            floatingActionButtonLocation: FloatingActionButtonLocation.miniEndFloat,

            // شريط التنقل السفلي المريح للمس بالأصبع الواحد (Mobile Bottom Navigation Bar)
            bottomNavigationBar: Container(
              decoration: const BoxDecoration(
                color: Color(0xFF101726),
                border: Border(
                  top: BorderSide(color: Color(0xFF1E293B), width: 1),
                ),
              ),
              child: SafeArea(
                top: false,
                child: BottomNavigationBar(
                  currentIndex: _currentIndex,
                  onTap: (index) {
                    HapticFeedback.lightImpact();
                    setState(() => _currentIndex = index);
                  },
                  backgroundColor: const Color(0xFF101726),
                  selectedItemColor: const Color(0xFF10B981),
                  unselectedItemColor: const Color(0xFF64748B),
                  selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                  unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal, fontSize: 10),
                  type: BottomNavigationBarType.fixed,
                  elevation: 0,
                  items: [
                    BottomNavigationBarItem(
                      icon: const Icon(Icons.speed_rounded),
                      activeIcon: const Icon(Icons.speed_rounded, color: Color(0xFF10B981)),
                      label: isAr ? 'اللوحة' : 'Dashboard',
                    ),
                    BottomNavigationBarItem(
                      icon: const Icon(Icons.menu_book_rounded),
                      activeIcon: const Icon(Icons.menu_book_rounded, color: Color(0xFF10B981)),
                      label: isAr ? 'الخطوة 4' : 'Step 4',
                    ),
                    BottomNavigationBarItem(
                      icon: const Icon(Icons.nightlight_round),
                      activeIcon: const Icon(Icons.nightlight_round, color: Color(0xFF10B981)),
                      label: isAr ? 'المساء' : 'Nightly',
                    ),
                    BottomNavigationBarItem(
                      icon: const Icon(Icons.groups_rounded),
                      activeIcon: const Icon(Icons.groups_rounded, color: Color(0xFF10B981)),
                      label: isAr ? 'الرفاق' : 'Directory',
                    ),
                    BottomNavigationBarItem(
                      icon: const Icon(Icons.shield_outlined),
                      activeIcon: const Icon(Icons.shield_rounded, color: Color(0xFF10B981)),
                      label: isAr ? 'الأمان' : 'Security',
                    ),
                  ],
                ),
              ),
            ),
          ),

          // شاشة القفل التلقائي عند قفل التطبيق أو الرجوع من الخلفية (Step 5)
          AnimatedBuilder(
            animation: widget.securityNotifier,
            builder: (context, _) {
              if (widget.securityNotifier.isLocked && widget.securityNotifier.isLockEnabled) {
                return AppLockScreen(
                  securityNotifier: widget.securityNotifier,
                  isAr: isAr,
                );
              }
              return const SizedBox.shrink();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMobileDrawer(BuildContext context, bool isAr) {
    final sponsor = widget.contactsNotifier.primarySponsor;

    return Drawer(
      backgroundColor: const Color(0xFF0F172A),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // رأس القائمة الجانبية مع شارة التعافي
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF064E3B), Color(0xFF0F172A)],
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: const Color(0xFF10B981).withValues(alpha: 0.2),
                  child: const Icon(Icons.shield_rounded, color: Color(0xFF10B981), size: 30),
                ),
                const SizedBox(height: 10),
                Text(
                  isAr ? 'برنامج الـ 12 خطوة واليقظة' : '12-Step Spiritual Program',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 4),
                Text(
                  isAr ? 'بياناتك مشفرة محلياً 100% على هذا الهاتف' : '100% Offline & Encrypted On-Device',
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                ),
              ],
            ),
          ),

          // روابط التنقل السريع
          ListTile(
            leading: const Icon(Icons.speed_rounded, color: Color(0xFF10B981)),
            title: Text(isAr ? 'اللوحة والميزان الروحي' : 'Dashboard & Spiritual Meter'),
            selected: _currentIndex == 0,
            onTap: () {
              Navigator.pop(context);
              setState(() => _currentIndex = 0);
            },
          ),
          ListTile(
            leading: const Icon(Icons.menu_book_rounded, color: Color(0xFF06B6D4)),
            title: Text(isAr ? 'دفتر جرد الخطوة الرابعة' : 'Step 4 Digital Ledger'),
            selected: _currentIndex == 1,
            onTap: () {
              Navigator.pop(context);
              setState(() => _currentIndex = 1);
            },
          ),
          ListTile(
            leading: const Icon(Icons.nightlight_round, color: Color(0xFF818CF8)),
            title: Text(isAr ? 'مراجعة المساء والامتنان (الخطوة 11)' : 'Nightly Review & Step 11'),
            selected: _currentIndex == 2,
            onTap: () {
              Navigator.pop(context);
              setState(() => _currentIndex = 2);
            },
          ),
          ListTile(
            leading: const Icon(Icons.groups_rounded, color: Color(0xFF2DD4BF)),
            title: Text(isAr ? 'دليل الرفاق والموجه' : 'Sponsor & Fellowship Directory'),
            selected: _currentIndex == 3,
            onTap: () {
              Navigator.pop(context);
              setState(() => _currentIndex = 3);
            },
          ),
          ListTile(
            leading: const Icon(Icons.shield_outlined, color: Color(0xFF10B981)),
            title: Text(isAr ? 'إعدادات الأمان والبصمة والخزينة' : 'Security & Encrypted Vault'),
            selected: _currentIndex == 4,
            onTap: () {
              Navigator.pop(context);
              setState(() => _currentIndex = 4);
            },
          ),
          const Divider(color: Color(0xFF1E293B)),

          // إجراءات الموبايل الطارئة
          if (sponsor != null) ...[
            ListTile(
              leading: const Icon(Icons.phone_in_talk_rounded, color: Color(0xFF10B981)),
              title: Text(isAr ? 'اتصال طارئ بالموجه (\${sponsor.name})' : 'Call Sponsor (\${sponsor.name})'),
              onTap: () {
                Navigator.pop(context);
                ContactsNotifier.launchPhone(sponsor.phone);
              },
            ),
          ],
          ListTile(
            leading: const Icon(Icons.bolt_rounded, color: Color(0xFFF59E0B)),
            title: Text(isAr ? 'أداة الخطوة العاشرة الفورية (ص 84)' : 'Step 10 Instant Tool'),
            onTap: () {
              Navigator.pop(context);
              _openStep10InstantModal(context);
            },
          ),
        ],
      ),
    );
  }

  String _getTabSubtitle(int index, bool isAr) {
    switch (index) {
      case 0:
        return isAr ? 'الميزان الروحي والعداد' : 'Spiritual Meter & Timer';
      case 1:
        return isAr ? 'دفتر جرد الخطوة 4' : 'Step 4 Ledger';
      case 2:
        return isAr ? 'مراجعة المساء والامتنان' : 'Nightly Review';
      case 3:
        return isAr ? 'دليل الموجه والرفاق' : 'Sponsor & Directory';
      case 4:
        return isAr ? 'الخزينة المشفرة (AES-256)' : 'On-Device Vault';
      default:
        return '';
    }
  }
}
`
  },
  {
    fileName: 'spiritual_state.dart',
    title: 'إدارة الحالة المحلية (State Management)',
    code: `import 'dart:async';
import 'package:flutter/foundation.dart';

class SobrietyTime {
  final int days;
  final int hours;
  final int minutes;
  final int seconds;

  const SobrietyTime({
    required this.days,
    required this.hours,
    required this.minutes,
    required this.seconds,
  });
}

class QuoteModel {
  final String textAr;
  final String textEn;
  final String author;
  final String book;

  const QuoteModel({
    required this.textAr,
    required this.textEn,
    required this.author,
    required this.book,
  });
}

class AmendTask {
  final String id;
  final String description;
  bool isCompleted;

  AmendTask({
    required this.id,
    required this.description,
    this.isCompleted = false,
  });
}

class RecoveryStateNotifier extends ChangeNotifier {
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 42, hours: 8));
  bool _isCircularTimer = true;
  Timer? _ticker;

  int _quoteIndex = 0;
  final List<QuoteModel> _quotes = [
    const QuoteModel(
      textAr: 'التعافي ليس توقفاً عن السلوك الإدماني فحسب، بل هو إعادة بناء للإنسان الذي سحقته الصدمات، واسترداد للحياة الحقيقية التي سُرقت في العتمة.',
      textEn: 'Recovery is not merely stopping addictive behavior; it is rebuilding the human crushed by trauma, reclaiming authentic life stolen in darkness.',
      author: 'د. عماد رشاد عثمان',
      book: 'ممتلئ بالخواء',
    ),
    const QuoteModel(
      textAr: 'الخزي السام يهمس في أذنك دائماً: "أنت الخطأ"، بينما الشعور بالذنب الصحي يقول: "لقد ارتكبت خطأ". التعافي يبدأ عندما تفصل هويتك عن خطيئتك.',
      textEn: 'Toxic shame whispers: "You are the mistake", while healthy guilt says: "You made a mistake". Recovery begins when you decouple identity from error.',
      author: 'د. عماد رشاد عثمان',
      book: 'أبي الذي أكره',
    ),
    const QuoteModel(
      textAr: 'الإنكار هو الحارس الشخصي للإدمان؛ كلما ازددت صدقاً مع نفسك ولو كلفك ذلك ألماً مؤقتاً، كلما تهاوت حصون الانتكاسة.',
      textEn: 'Denial is the bodyguard of addiction; as you cultivate fearless honesty with yourself, the fortresses of relapse crumble.',
      author: 'د. عماد رشاد عثمان',
      book: 'سلسلة التعافي من الإدمان',
    ),
  ];

  // Spiritual Meter values (0 to 100)
  double _serenity = 80;
  double _honesty = 85;
  double _surrender = 75;
  double _service = 70;

  // Step 10 Amends checklist
  final List<AmendTask> _amends = [
    AmendTask(id: '1', description: 'اعتذار مباشر لزميل العمل عن الانفعال الصباحي'),
    AmendTask(id: '2', description: 'تصحيح المبالغة في تقرير المشروع'),
  ];

  RecoveryStateNotifier() {
    _startTimer();
  }

  DateTime get startDate => _startDate;
  bool get isCircularTimer => _isCircularTimer;
  QuoteModel get currentQuote => _quotes[_quoteIndex];
  double get serenity => _serenity;
  double get honesty => _honesty;
  double get surrender => _surrender;
  double get service => _service;
  List<AmendTask> get amends => List.unmodifiable(_amends);

  double get spiritualFitnessScore =>
      (_serenity + _honesty + _surrender + _service) / 4;

  void _startTimer() {
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      notifyListeners();
    });
  }

  SobrietyTime get elapsedTime {
    final now = DateTime.now();
    final difference = now.difference(_startDate);
    final days = difference.inDays;
    final hours = difference.inHours % 24;
    final minutes = difference.inMinutes % 60;
    final seconds = difference.inSeconds % 60;
    return SobrietyTime(days: days, hours: hours, minutes: minutes, seconds: seconds);
  }

  void toggleTimerMode() {
    _isCircularTimer = !_isCircularTimer;
    notifyListeners();
  }

  void nextQuote() {
    _quoteIndex = (_quoteIndex + 1) % _quotes.length;
    notifyListeners();
  }

  void setStartDate(DateTime date) {
    _startDate = date;
    notifyListeners();
  }

  void updateMetrics({double? serenity, double? honesty, double? surrender, double? service}) {
    if (serenity != null) _serenity = serenity;
    if (honesty != null) _honesty = honesty;
    if (surrender != null) _surrender = surrender;
    if (service != null) _service = service;
    notifyListeners();
  }

  void toggleAmend(String id) {
    final task = _amends.firstWhere((item) => item.id == id);
    task.isCompleted = !task.isCompleted;
    notifyListeners();
  }

  void addAmend(String description) {
    if (description.trim().isEmpty) return;
    _amends.add(AmendTask(id: DateTime.now().millisecondsSinceEpoch.toString(), description: description));
    notifyListeners();
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }
}
`
  },
  {
    fileName: 'dashboard_screen.dart',
    title: 'شاشة لوحة التحكم والميزان الروحي للموبايل (Mobile-Optimized Dashboard)',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'spiritual_state.dart';
import 'step10_sheet.dart';
import 'main.dart';

class DashboardScreen extends StatefulWidget {
  final RecoveryStateNotifier? notifier;
  final bool showAppBar;

  const DashboardScreen({
    super.key,
    this.notifier,
    this.showAppBar = true,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late final RecoveryStateNotifier _notifier;
  bool _isLocalNotifier = false;

  @override
  void initState() {
    super.initState();
    if (widget.notifier != null) {
      _notifier = widget.notifier!;
      _isLocalNotifier = false;
    } else {
      _notifier = RecoveryStateNotifier();
      _isLocalNotifier = true;
    }
  }

  @override
  void dispose() {
    if (_isLocalNotifier) {
      _notifier.dispose();
    }
    super.dispose();
  }

  void _openStep10Sheet() {
    HapticFeedback.mediumImpact();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Step10BottomSheet(notifier: _notifier),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return ListenableBuilder(
      listenable: _notifier,
      builder: (context, _) {
        final time = _notifier.elapsedTime;
        final quote = _notifier.currentQuote;
        final score = _notifier.spiritualFitnessScore;

        Widget content = SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. عداد التعافي المطور للموبايل (دائري أو خطي بحجم متجاوب)
              _buildMobileTimerCard(context, time, isAr),
              const SizedBox(height: 14),

              // 2. ميزان اللياقة الروحية اليومي (ص 84) بأشرطة لمسية مريحة للإبهام
              _buildSpiritualMeterCard(context, score, isAr),
              const SizedBox(height: 14),

              // 3. صندوق تأملات د. عماد رشاد عثمان الداعم للسحب بالإصبع (Swipe)
              _buildSwipeableQuoteBox(context, quote, isAr),

              // مساحة أمان سفلية لعدم حجب المحتوى بواسطة شريط التنقل وزر الخطوة 10
              const SizedBox(height: 100),
            ],
          ),
        );

        if (!widget.showAppBar) {
          return content;
        }

        return Scaffold(
          backgroundColor: const Color(0xFF0B0F17),
          appBar: AppBar(
            title: Text(
              isAr ? 'ميزان التعافي الروحي' : 'Spiritual Recovery Meter',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            actions: [
              IconButton(
                tooltip: isAr ? 'تبديل شكل العداد' : 'Toggle timer view',
                icon: Icon(_notifier.isCircularTimer ? Icons.linear_scale : Icons.timelapse),
                onPressed: () {
                  HapticFeedback.selectionClick();
                  _notifier.toggleTimerMode();
                },
              ),
              IconButton(
                tooltip: isAr ? 'تغيير اللغة' : 'Change Language',
                icon: const Icon(Icons.language),
                onPressed: () => SpiritualRecoveryApp.of(context).toggleLocale(),
              ),
            ],
          ),
          body: content,
          floatingActionButton: FloatingActionButton.extended(
            onPressed: _openStep10Sheet,
            backgroundColor: const Color(0xFF10B981),
            foregroundColor: Colors.white,
            elevation: 8,
            icon: const Icon(Icons.bolt_rounded, size: 22),
            label: Text(
              isAr ? 'الخطوة 10 الفورية (ص 84)' : 'Step 10 Instant',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        );
      },
    );
  }

  Widget _buildMobileTimerCard(BuildContext context, SobrietyTime time, bool isAr) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.timelapse_rounded, size: 16, color: Color(0xFF10B981)),
                  const SizedBox(width: 6),
                  Text(
                    isAr ? 'مدة النقاء واليقظة اليومية' : 'Sober Time & Clarity',
                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Row(
                children: [
                  InkWell(
                    borderRadius: BorderRadius.circular(8),
                    onTap: () {
                      HapticFeedback.selectionClick();
                      _notifier.toggleTimerMode();
                    },
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                      child: Icon(
                        _notifier.isCircularTimer ? Icons.linear_scale_rounded : Icons.timelapse_rounded,
                        size: 18,
                        color: const Color(0xFF06B6D4),
                      ),
                    ),
                  ),
                  const SizedBox(width: 4),
                  InkWell(
                    borderRadius: BorderRadius.circular(8),
                    onTap: _pickStartDate,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: Row(
                        children: [
                          const Icon(Icons.edit_calendar_rounded, size: 14, color: Color(0xFF10B981)),
                          const SizedBox(width: 4),
                          Text(
                            isAr ? 'تعديل' : 'Edit',
                            style: const TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_notifier.isCircularTimer)
            _buildResponsiveCircularTimer(context, time, isAr)
          else
            _buildResponsiveLinearTimer(time, isAr),
        ],
      ),
    );
  }

  Widget _buildResponsiveCircularTimer(BuildContext context, SobrietyTime time, bool isAr) {
    final screenWidth = MediaQuery.of(context).size.width;
    // حجم متجاوب لا يتجاوز شاشات الموبايل الصغيرة
    final diameter = (screenWidth * 0.44).clamp(150.0, 190.0);

    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: diameter,
              height: diameter,
              child: CircularProgressIndicator(
                value: (time.hours * 3600 + time.minutes * 60 + time.seconds) / 86400,
                strokeWidth: 9,
                backgroundColor: const Color(0xFF1E293B),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
              ),
            ),
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '\${time.days}',
                  style: TextStyle(
                    fontSize: diameter * 0.26,
                    fontWeight: FontWeight.bold,
                    height: 1.0,
                    color: Colors.white,
                  ),
                ),
                Text(
                  isAr ? 'يوماً مباركاً' : 'Days Clean',
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 14),
        // بطاقات الساعات والدقائق والثواني للموبايل
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _timePill('\${time.hours}', isAr ? 'ساعة' : 'Hrs'),
            const SizedBox(width: 8),
            _timePill('\${time.minutes}', isAr ? 'دقيقة' : 'Mins'),
            const SizedBox(width: 8),
            _timePill('\${time.seconds}', isAr ? 'ثانية' : 'Secs'),
          ],
        ),
      ],
    );
  }

  Widget _timePill(String value, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value.padLeft(2, '0'),
            style: const TextStyle(
              fontFamily: 'monospace',
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: Color(0xFF38BDF8),
            ),
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
          ),
        ],
      ),
    );
  }

  Widget _buildResponsiveLinearTimer(SobrietyTime time, bool isAr) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _timeSegment('\${time.days}', isAr ? 'أيام' : 'Days'),
            _timeSegment('\${time.hours}', isAr ? 'ساعات' : 'Hours'),
            _timeSegment('\${time.minutes}', isAr ? 'دقائق' : 'Mins'),
            _timeSegment('\${time.seconds}', isAr ? 'ثوانٍ' : 'Secs'),
          ],
        ),
        const SizedBox(height: 14),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: (time.hours * 60 + time.minutes) / 1440,
            minHeight: 8,
            backgroundColor: const Color(0xFF1E293B),
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
          ),
        ),
      ],
    );
  }

  Widget _timeSegment(String value, String label) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
      ],
    );
  }

  Widget _buildSpiritualMeterCard(BuildContext context, double score, bool isAr) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.speed_rounded, size: 18, color: Color(0xFF10B981)),
                  const SizedBox(width: 8),
                  Text(
                    isAr ? 'ميزان اللياقة الروحية اليومي' : 'Spiritual Fitness Meter',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: (score >= 70 ? const Color(0xFF10B981) : const Color(0xFFF59E0B)).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: (score >= 70 ? const Color(0xFF10B981) : const Color(0xFFF59E0B)).withValues(alpha: 0.4),
                  ),
                ),
                child: Text(
                  '\${score.toInt()}%',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: score >= 70 ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            isAr
                ? 'وفق الصفحة 84: سلامتنا مشروطة بصيانة لياقتنا الروحية اليومية'
                : 'Page 84: A daily reprieve contingent on spiritual fitness',
            style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
          ),
          const SizedBox(height: 14),
          _metricSlider(isAr ? 'السكينة والسلام الداخلي' : 'Serenity', _notifier.serenity, (v) => _notifier.updateMetrics(serenity: v)),
          _metricSlider(isAr ? 'الصدق مع الذات' : 'Honesty', _notifier.honesty, (v) => _notifier.updateMetrics(honesty: v)),
          _metricSlider(isAr ? 'الاستعداد والتسليم' : 'Surrender', _notifier.surrender, (v) => _notifier.updateMetrics(surrender: v)),
          _metricSlider(isAr ? 'عطاء الخدمة والصلة' : 'Service', _notifier.service, (v) => _notifier.updateMetrics(service: v)),
        ],
      ),
    );
  }

  Widget _metricSlider(String label, double value, ValueChanged<double> onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFFCBD5E1))),
              Text('\${value.toInt()}%', style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
            ],
          ),
          SliderTheme(
            data: SliderTheme.of(context).copyWith(
              thumbColor: const Color(0xFF10B981),
              activeTrackColor: const Color(0xFF10B981),
              inactiveTrackColor: const Color(0xFF1E293B),
              trackHeight: 4,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 7),
            ),
            child: Slider(
              value: value,
              min: 0,
              max: 100,
              onChanged: onChanged,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSwipeableQuoteBox(BuildContext context, QuoteModel quote, bool isAr) {
    return GestureDetector(
      onHorizontalDragEnd: (details) {
        if (details.primaryVelocity != null && details.primaryVelocity!.abs() > 100) {
          HapticFeedback.selectionClick();
          _notifier.nextQuote();
        }
      },
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: const Color(0xFF131A26),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: const Color(0xFF0284C7).withValues(alpha: 0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.format_quote_rounded, color: Color(0xFF38BDF8), size: 20),
                    const SizedBox(width: 8),
                    Text(
                      isAr ? 'تأملات د. عماد رشاد عثمان' : 'Dr. Emad Rashad Series',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF38BDF8)),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.refresh_rounded, size: 18, color: Color(0xFF94A3B8)),
                  onPressed: () {
                    HapticFeedback.selectionClick();
                    _notifier.nextQuote();
                  },
                  tooltip: isAr ? 'حكمة أخرى' : 'Next Quote',
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              isAr ? quote.textAr : quote.textEn,
              style: const TextStyle(fontSize: 13, height: 1.6, color: Color(0xFFE2E8F0)),
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '— \${quote.author} (\${quote.book})',
                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontStyle: FontStyle.italic),
                ),
                Text(
                  isAr ? 'اسحب للمزيد ←' : 'Swipe for next →',
                  style: const TextStyle(fontSize: 10, color: Color(0xFF475569)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickStartDate() async {
    HapticFeedback.lightImpact();
    final picked = await showDatePicker(
      context: context,
      initialDate: _notifier.startDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: Color(0xFF10B981),
              surface: Color(0xFF131A26),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      _notifier.setStartDate(picked);
    }
  }
}
`
  },
  {
    fileName: 'step10_sheet.dart',
    title: 'أداة الخطوة العاشرة الفورية (Step 10 Instant Tool Modal)',
    code: `import 'package:flutter/material.dart';
import 'spiritual_state.dart';

class Step10BottomSheet extends StatelessWidget {
  final RecoveryStateNotifier notifier;

  const Step10BottomSheet({super.key, required this.notifier});

  @override
  Widget build(BuildContext context) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return DefaultTabController(
      length: 4,
      child: Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: Color(0xFF101622),
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Drag handle
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFF334155),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isAr ? 'الخطوة العاشرة الفورية' : 'Step 10 Instant Action',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        isAr ? 'الكتاب الكبير - صفحة 84' : 'Big Book - Page 84 Protocol',
                        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            // 4 Tabs: Prayer, Discuss, Amends, Redirect
            TabBar(
              isScrollable: false,
              indicatorColor: const Color(0xFF10B981),
              labelColor: const Color(0xFF10B981),
              unselectedLabelColor: const Color(0xFF94A3B8),
              tabs: [
                Tab(
                  icon: const Icon(Icons.volunteer_activism_outlined, size: 20),
                  text: isAr ? 'الصلاة' : 'Prayer',
                ),
                Tab(
                  icon: const Icon(Icons.chat_bubble_outline, size: 20),
                  text: isAr ? 'المناقشة' : 'Discuss',
                ),
                Tab(
                  icon: const Icon(Icons.checklist_rounded, size: 20),
                  text: isAr ? 'التعويض' : 'Amends',
                ),
                Tab(
                  icon: const Icon(Icons.repeat_rounded, size: 20),
                  text: isAr ? 'التوجيه' : 'Redirect',
                ),
              ],
            ),
            const Divider(color: Color(0xFF1E293B), height: 1),
            // Tab Views
            Expanded(
              child: TabBarView(
                children: [
                  _buildPrayerTab(context, isAr),
                  _buildDiscussTab(context, isAr),
                  _buildAmendsTab(context, isAr),
                  _buildRedirectTab(context, isAr),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 1. Prayer Tab: Resentment & Fear removal prayer
  Widget _buildPrayerTab(BuildContext context, bool isAr) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF131A26),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
            ),
            child: Column(
              children: [
                const Icon(Icons.wb_sunny_outlined, color: Color(0xFF10B981), size: 36),
                const SizedBox(height: 16),
                Text(
                  isAr ? 'صلاة إزالة الاستياء والخوف' : 'Resentment & Fear Removal Prayer',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 12),
                Text(
                  isAr
                      ? '«اللهم أزل هذا الاستياء والخوف مني، وامنحني القدرة على رؤية هذا الشخص أو الموقف بعين التسامح والفهم»'
                      : '"Lord, remove this resentment and fear from me, and grant me the ability to see this person or situation with forgiveness and understanding."',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16, height: 1.8, color: Color(0xFFF1F5F9)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Text(
            isAr
                ? 'توجيه ص 84: "عندما تظهر هذه الأمور، نطلب من الله فوراً أن يزيلها عنا."'
                : 'Page 84: "When these crop up, we ask God at once to remove them."',
            style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  // 2. Discuss Tab: Calling/messaging Sponsor
  Widget _buildDiscussTab(BuildContext context, bool isAr) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            isAr ? 'المناقشة الفورية مع المشرف / الموجه' : 'Discuss Immediately With Sponsor',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 8),
          Text(
            isAr
                ? '"ونناقشها مع شخص ما على الفور" — لا تدع الفكرة أو الاستياء يختمر بمفردك.'
                : '"We discuss them with someone immediately" — Never let resentment stew alone.',
            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            icon: const Icon(Icons.phone_in_talk),
            label: Text(isAr ? 'اتصال فوري بالموجه (Sponsor)' : 'Call Sponsor Now'),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(isAr ? 'جاري الاتصال بالموجه...' : 'Simulating call to sponsor...')),
              );
            },
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              foregroundColor: const Color(0xFF38BDF8),
              side: const Color(0xFF0284C7),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            icon: const Icon(Icons.message),
            label: Text(isAr ? 'إرسال رسالة تفريغ / واتساب' : 'Send Message / WhatsApp'),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(isAr ? 'فتح المحادثة الفورية...' : 'Opening quick message...')),
              );
            },
          ),
        ],
      ),
    );
  }

  // 3. Amends Tab: Immediate action checklist
  Widget _buildAmendsTab(BuildContext context, bool isAr) {
    final controller = TextEditingController();

    return StatefulBuilder(
      builder: (context, setState) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                isAr ? 'قائمة التعويض السريع' : 'Immediate Amends Checklist',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 6),
              Text(
                isAr
                    ? '"ونقوم بالتعويض السريع إذا كنا قد أذينا أحداً"'
                    : '"And make amends quickly if we have harmed anyone"',
                style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: controller,
                      decoration: InputDecoration(
                        hintText: isAr ? 'أضف تصحيحاً أو اعتذاراً مطلوباً...' : 'Add required amend...',
                        filled: true,
                        fillColor: const Color(0xFF1E293B),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    style: IconButton.filled(backgroundColor: const Color(0xFF10B981)),
                    icon: const Icon(Icons.add),
                    onPressed: () {
                      if (controller.text.isNotEmpty) {
                        notifier.addAmend(controller.text);
                        controller.clear();
                        setState(() {});
                      }
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView.separated(
                  itemCount: notifier.amends.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final item = notifier.amends[index];
                    return CheckboxListTile(
                      tileColor: const Color(0xFF131A26),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      activeColor: const Color(0xFF10B981),
                      title: Text(
                        item.description,
                        style: TextStyle(
                          decoration: item.isCompleted ? TextDecoration.lineThrough : null,
                          color: item.isCompleted ? const Color(0xFF64748B) : Colors.white,
                        ),
                      ),
                      value: item.isCompleted,
                      onChanged: (_) {
                        notifier.toggleAmend(item.id);
                        setState(() {});
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // 4. Redirect Tab: Guiding thought redirection
  Widget _buildRedirectTab(BuildContext context, bool isAr) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131A26),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.directions_rounded, color: Color(0xFF38BDF8)),
                    SizedBox(width: 8),
                    Text(
                      'إعادة توجيه الطاقة الذهنية',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  isAr
                      ? '«ثم نوجه أفكارنا بحزم نحو شخص يمكننا مساعدته. الحب والتسامح هما شريعتنا.»'
                      : '"Then we resolutely turn our thoughts to someone we can help. Love and tolerance is our code."',
                  style: const TextStyle(fontSize: 15, height: 1.6, color: Color(0xFFE2E8F0)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Text(
            isAr ? 'أفكار فورية للخدمة وكسر التمركز حول الذات:' : 'Immediate service thoughts to break self-centeredness:',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 12),
          _bulletAction(isAr ? 'أرسل رسالة تشجيع لزميل في بداية طريق التعافي.' : 'Send an encouraging message to a fellow newcomer.'),
          _bulletAction(isAr ? 'قم بمساعدة فرد من عائلتك في مهمة دون انتظار شكر.' : 'Help a family member with a task without expecting thanks.'),
          _bulletAction(isAr ? 'استحضر 3 نعم حقيقية في حياتك اليوم واشكر الله عليها.' : 'Recall 3 genuine blessings today and express gratitude.'),
        ],
      ),
    );
  }

  Widget _bulletAction(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.check_circle_outline, size: 18, color: Color(0xFF10B981)),
          const SizedBox(width: 8),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 13, height: 1.5, color: Color(0xFFCBD5E1)))),
        ],
      ),
    );
  }
}
`
  },
  {
    fileName: 'step4_models.dart',
    title: 'نماذج وبيانات الخطوة الرابعة (Step 4 Models & State)',
    code: `import 'package:flutter/foundation.dart';

enum InventoryCategory {
  resentment,
  fear,
  sex,
  harms,
}

enum AffectedInstinct {
  selfEsteem,
  financialSecurity,
  emotionalSecurity,
  ambitions,
  personalRelations,
  sexRelations,
}

enum MyPartDefect {
  selfish,
  dishonest,
  selfSeeking,
  fearing,
  inconsiderate,
}

class InventoryItem {
  final String id;
  final InventoryCategory category;
  final String target; // Column 1: الطرف أو الموقف
  final String cause; // Column 2: السبب المباشر
  final List<AffectedInstinct> affectedInstincts; // Column 3: ما يمسه في الغرائز
  final List<MyPartDefect> myPartDefects; // Column 4: عيوب دوري
  final String reflection; // Column 4: التحليل الذاتي الصادق
  final DateTime createdAt;

  InventoryItem({
    required this.id,
    required this.category,
    required this.target,
    required this.cause,
    required this.affectedInstincts,
    required this.myPartDefects,
    required this.reflection,
    required this.createdAt,
  });
}

class Step4StateNotifier extends ChangeNotifier {
  InventoryCategory? _selectedCategory;
  String _searchQuery = '';

  final List<InventoryItem> _items = [
    InventoryItem(
      id: '1',
      category: InventoryCategory.resentment,
      target: 'مديري السابق في العمل (سعد)',
      cause: 'نسب مجهودي في إنجاز المشروع الكبير لنفسه أمام الإدارة وتجاهل ترقيتي.',
      affectedInstincts: [
        AffectedInstinct.selfEsteem,
        AffectedInstinct.financialSecurity,
        AffectedInstinct.ambitions,
      ],
      myPartDefects: [
        MyPartDefect.selfish,
        MyPartDefect.fearing,
        MyPartDefect.inconsiderate,
      ],
      reflection: 'كنت متكبراً وأردت الاستحواذ على كل المديح بمفردي. عندما شعرت بالتهديد، تحدثت عنه بسوء في ظهره بدلاً من مواجهته بنضج وأمانة.',
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
    InventoryItem(
      id: '2',
      category: InventoryCategory.fear,
      target: 'الخوف من المستقبل المالي والإفلاس',
      cause: 'تراكم بعض الديون القديمة والشعور بأنني لن أستطيع تأمين حياة كريمة لأسرتي.',
      affectedInstincts: [
        AffectedInstinct.financialSecurity,
        AffectedInstinct.emotionalSecurity,
        AffectedInstinct.ambitions,
      ],
      myPartDefects: [
        MyPartDefect.dishonest,
        MyPartDefect.fearing,
        MyPartDefect.selfSeeking,
      ],
      reflection: 'عدم توكلي الحقيقي على الله، واعتمادي الكامل على ذكائي ومحاولة السيطرة على كل شيء مع إخفاء وضعي المالي الحقيقي بدافع الكبرياء.',
      createdAt: DateTime.now().subtract(const Duration(days: 6)),
    ),
  ];

  InventoryCategory? get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;

  List<InventoryItem> get filteredItems {
    return _items.where((item) {
      final matchesCategory = _selectedCategory == null || item.category == _selectedCategory;
      final query = _searchQuery.trim().toLowerCase();
      final matchesQuery = query.isEmpty ||
          item.target.toLowerCase().contains(query) ||
          item.cause.toLowerCase().contains(query) ||
          item.reflection.toLowerCase().contains(query);
      return matchesCategory && matchesQuery;
    }).toList();
  }

  void setCategoryFilter(InventoryCategory? category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void addItem(InventoryItem item) {
    _items.insert(0, item);
    notifyListeners();
  }

  void deleteItem(String id) {
    _items.removeWhere((item) => item.id == id);
    notifyListeners();
  }
}
`
  },
  {
    fileName: 'step4_inventory_screen.dart',
    title: 'شاشة سجل الخطوة الرابعة وإدخال الأعمدة الأربعة (Step 4 Screen)',
    code: `import 'package:flutter/material.dart';
import 'step4_models.dart';

class Step4InventoryScreen extends StatefulWidget {
  const Step4InventoryScreen({super.key});

  @override
  State<Step4InventoryScreen> createState() => _Step4InventoryScreenState();
}

class _Step4InventoryScreenState extends State<Step4InventoryScreen> {
  late final Step4StateNotifier _notifier;

  @override
  void initState() {
    super.initState();
    _notifier = Step4StateNotifier();
  }

  @override
  void dispose() {
    _notifier.dispose();
    super.dispose();
  }

  void _openAddEntryDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Step4AddEntrySheet(notifier: _notifier),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return ListenableBuilder(
      listenable: _notifier,
      builder: (context, _) {
        final items = _notifier.filteredItems;

        return Scaffold(
          appBar: AppBar(
            title: Text(
              isAr ? 'سجل فحص الضمير (الخطوة 4)' : 'Step 4 Moral Inventory Ledger',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ),
          body: Column(
            children: [
              // 1. شريط البحث والتصنيفات
              _buildFilterHeader(isAr),

              // 2. قائمة البطاقات بنظام الأعمدة الأربعة
              Expanded(
                child: items.isEmpty
                    ? _buildEmptyState(isAr)
                    : ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        itemCount: items.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          return _buildInventoryCard(items[index], isAr);
                        },
                      ),
              ),
            ],
          ),
          // زر إضافة سجل جديد
          floatingActionButton: FloatingActionButton.extended(
            onPressed: _openAddEntryDialog,
            backgroundColor: const Color(0xFF10B981),
            foregroundColor: Colors.white,
            icon: const Icon(Icons.add),
            label: Text(
              isAr ? 'إضافة سجل (الأعمدة الأربعة)' : 'Add 4-Column Entry',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        );
      },
    );
  }

  Widget _buildFilterHeader(bool isAr) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: const Color(0xFF0F172A),
      child: Column(
        children: [
          TextField(
            onChanged: _notifier.setSearchQuery,
            decoration: InputDecoration(
              hintText: isAr ? 'بحث في السجلات أو الأشخاص...' : 'Search targets, causes...',
              prefixIcon: const Icon(Icons.search, size: 20, color: Color(0xFF94A3B8)),
              filled: true,
              fillColor: const Color(0xFF1E293B),
              contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 8),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _filterChip(null, isAr ? 'الكل' : 'All'),
                _filterChip(InventoryCategory.resentment, isAr ? 'الاستياءات' : 'Resentment'),
                _filterChip(InventoryCategory.fear, isAr ? 'المخاوف' : 'Fear'),
                _filterChip(InventoryCategory.sex, isAr ? 'السلوك الجنسي' : 'Sex Conduct'),
                _filterChip(InventoryCategory.harms, isAr ? 'الأضرار' : 'Harms'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _filterChip(InventoryCategory? category, String label) {
    final isSelected = _notifier.selectedCategory == category;
    return Padding(
      padding: const EdgeInsets.only(left: 6, right: 6),
      child: ChoiceChip(
        label: Text(label),
        selected: isSelected,
        selectedColor: const Color(0xFF10B981),
        backgroundColor: const Color(0xFF1E293B),
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : const Color(0xFF94A3B8),
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        onSelected: (_) => _notifier.setCategoryFilter(category),
      ),
    );
  }

  Widget _buildInventoryCard(InventoryItem item, bool isAr) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // شريط معلومات السجل
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _categoryName(item.category, isAr),
                  style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFF64748B)),
                onPressed: () => _notifier.deleteItem(item.id),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // العمود 1: الطرف أو الموقف
          Text(
            isAr ? '1. الطرف / الموقف: \${item.target}' : '1. Target: \${item.target}',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
          ),
          const SizedBox(height: 4),

          // العمود 2: السبب
          Text(
            isAr ? '2. السبب: \${item.cause}' : '2. Cause: \${item.cause}',
            style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13, height: 1.4),
          ),
          const SizedBox(height: 10),

          // العمود 3: الغرائز المتأثرة
          Wrap(
            spacing: 6,
            runSpacing: 4,
            children: item.affectedInstincts.map((instinct) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: const Color(0xFF334155)),
                ),
                child: Text(
                  _instinctName(instinct, isAr),
                  style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 10),

          // العمود 4: دوري الشخصي (الأهم)
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFF10B981).withOpacity(0.2)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.psychology, size: 16, color: Color(0xFF10B981)),
                    const SizedBox(width: 6),
                    Text(
                      isAr ? 'دوري أنا (العمود الرابع - الأهم):' : 'My Part (Crucial):',
                      style: const TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  '«\${item.reflection}»',
                  style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 12, height: 1.5, fontStyle: FontStyle.italic),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(bool isAr) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.menu_book, size: 48, color: Color(0xFF475569)),
          const SizedBox(height: 12),
          Text(
            isAr ? 'لا توجد سجلات مطابقة' : 'No inventory entries found',
            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 15),
          ),
        ],
      ),
    );
  }

  String _categoryName(InventoryCategory cat, bool isAr) {
    switch (cat) {
      case InventoryCategory.resentment:
        return isAr ? 'استياء' : 'Resentment';
      case InventoryCategory.fear:
        return isAr ? 'خوف' : 'Fear';
      case InventoryCategory.sex:
        return isAr ? 'سلوك جنسي' : 'Sex Conduct';
      case InventoryCategory.harms:
        return isAr ? 'أضرار' : 'Harms';
    }
  }

  String _instinctName(AffectedInstinct instinct, bool isAr) {
    switch (instinct) {
      case AffectedInstinct.selfEsteem:
        return isAr ? 'الكبرياء/تقدير الذات' : 'Self-esteem';
      case AffectedInstinct.financialSecurity:
        return isAr ? 'الأمان المالي' : 'Security (Financial)';
      case AffectedInstinct.emotionalSecurity:
        return isAr ? 'الأمان العاطفي' : 'Security (Emotional)';
      case AffectedInstinct.ambitions:
        return isAr ? 'الطموحات' : 'Ambitions';
      case AffectedInstinct.personalRelations:
        return isAr ? 'العلاقات الشخصية' : 'Personal Relations';
      case AffectedInstinct.sexRelations:
        return isAr ? 'العلاقات الحميمية' : 'Sex Relations';
    }
  }
}

// ---------------------------------------------------------------------------
// Bottom Sheet Form for Adding a New 4-Column Entry (With Validation)
// ---------------------------------------------------------------------------
class Step4AddEntrySheet extends StatefulWidget {
  final Step4StateNotifier notifier;

  const Step4AddEntrySheet({super.key, required this.notifier});

  @override
  State<Step4AddEntrySheet> createState() => _Step4AddEntrySheetState();
}

class _Step4AddEntrySheetState extends State<Step4AddEntrySheet> {
  final _formKey = GlobalKey<FormState>();
  final _targetController = TextEditingController();
  final _causeController = TextEditingController();
  final _reflectionController = TextEditingController();

  InventoryCategory _selectedCategory = InventoryCategory.resentment;
  final Set<AffectedInstinct> _selectedInstincts = {};
  final Set<MyPartDefect> _selectedDefects = {};

  String? _instinctError;
  String? _defectError;

  @override
  void dispose() {
    _targetController.dispose();
    _causeController.dispose();
    _reflectionController.dispose();
    super.dispose();
  }

  void _saveEntry(bool isAr) {
    setState(() {
      _instinctError = _selectedInstincts.isEmpty
          ? (isAr ? 'اختر جزءاً واحداً على الأقل من الغرائز' : 'Select at least one instinct')
          : null;
      _defectError = _selectedDefects.isEmpty
          ? (isAr ? 'حدد عيباً واحداً على الأقل في دورك' : 'Select at least one defect')
          : null;
    });

    if (_formKey.currentState!.validate() &&
        _selectedInstincts.isNotEmpty &&
        _selectedDefects.isNotEmpty) {
      final newItem = InventoryItem(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        category: _selectedCategory,
        target: _targetController.text.trim(),
        cause: _causeController.text.trim(),
        affectedInstincts: _selectedInstincts.toList(),
        myPartDefects: _selectedDefects.toList(),
        reflection: _reflectionController.text.trim(),
        createdAt: DateTime.now(),
      );

      widget.notifier.addItem(newItem);
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(
        color: Color(0xFF0F1523),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            // مقبض السحب
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFF334155),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // شريط العنوان
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    isAr ? 'إضافة سجل في دفتر الخطوة 4' : 'New Step 4 Record',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            const Divider(color: Color(0xFF1E293B), height: 1),
            // حقول النموذج الأربعة
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // نوع السجل
                    Text(
                      isAr ? 'نوع السجل:' : 'Category:',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: InventoryCategory.values.map((cat) {
                        return ChoiceChip(
                          label: Text(_categoryLabel(cat, isAr)),
                          selected: _selectedCategory == cat,
                          selectedColor: const Color(0xFF10B981),
                          onSelected: (_) => setState(() => _selectedCategory = cat),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),

                    // العمود 1: الطرف أو الموقف
                    TextFormField(
                      controller: _targetController,
                      decoration: InputDecoration(
                        labelText: isAr ? 'العمود 1: الطرف أو الموقف (Target)' : 'Column 1: Target',
                        hintText: isAr ? 'الشخص، المؤسسة، أو الموقف...' : 'Person, institution...',
                        filled: true,
                        fillColor: const Color(0xFF131A26),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      validator: (v) => (v == null || v.trim().isEmpty)
                          ? (isAr ? 'يرجى إدخال الطرف أو الموقف' : 'Target is required')
                          : null,
                    ),
                    const SizedBox(height: 16),

                    // العمود 2: السبب المباشر
                    TextFormField(
                      controller: _causeController,
                      maxLines: 2,
                      decoration: InputDecoration(
                        labelText: isAr ? 'العمود 2: ما هو السبب المباشر؟ (The Cause)' : 'Column 2: The Cause',
                        hintText: isAr ? 'ما الذي فعلوه بالتحديد دون تبرير...' : 'What happened exactly...',
                        filled: true,
                        fillColor: const Color(0xFF131A26),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      validator: (v) => (v == null || v.trim().length < 5)
                          ? (isAr ? 'يرجى كتابة السبب بالتفصيل (5 أحرف على الأقل)' : 'Cause is required')
                          : null,
                    ),
                    const SizedBox(height: 16),

                    // العمود 3: الغرائز المتأثرة
                    Text(
                      isAr ? 'العمود 3: ما يمسه في غرائزي (Affects My):' : 'Column 3: Affects My:',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: AffectedInstinct.values.map((instinct) {
                        final isSel = _selectedInstincts.contains(instinct);
                        return FilterChip(
                          label: Text(_instinctLabel(instinct, isAr)),
                          selected: isSel,
                          selectedColor: const Color(0xFF0284C7),
                          onSelected: (val) {
                            setState(() {
                              if (val) {
                                _selectedInstincts.add(instinct);
                              } else {
                                _selectedInstincts.remove(instinct);
                              }
                            });
                          },
                        );
                      }).toList(),
                    ),
                    if (_instinctError != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(_instinctError!, style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
                      ),
                    const SizedBox(height: 16),

                    // العمود 4: دوري الشخصي (عيوب + تحليل)
                    Text(
                      isAr ? 'العمود 4 (الأهم): دوري أنا - أين أخطأت؟ (My Part):' : 'Column 4: My Part (Crucial):',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF10B981)),
                    ),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: MyPartDefect.values.map((defect) {
                        final isSel = _selectedDefects.contains(defect);
                        return FilterChip(
                          label: Text(_defectLabel(defect, isAr)),
                          selected: isSel,
                          selectedColor: const Color(0xFF10B981),
                          onSelected: (val) {
                            setState(() {
                              if (val) {
                                _selectedDefects.add(defect);
                              } else {
                                _selectedDefects.remove(defect);
                              }
                            });
                          },
                        );
                      }).toList(),
                    ),
                    if (_defectError != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(_defectError!, style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
                      ),
                    const SizedBox(height: 10),

                    TextFormField(
                      controller: _reflectionController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        labelText: isAr ? 'التحليل الذاتي الصادق لدوري الشخصي:' : 'Honest Reflection on My Part:',
                        hintText: isAr ? 'أين كانت أنانيتي أو عدم أمانتي أو خوفي؟...' : 'Where was I selfish, dishonest, or fearful?...',
                        filled: true,
                        fillColor: const Color(0xFF131A26),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      validator: (v) => (v == null || v.trim().length < 10)
                          ? (isAr ? 'التحليل الذاتي مطلوب بصدق (10 أحرف على الأقل)' : 'Reflection is required (min 10 chars)')
                          : null,
                    ),
                    const SizedBox(height: 24),

                    // زر الحفظ
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () => _saveEntry(isAr),
                      child: Text(
                        isAr ? 'حفظ السجل في دفتر فحص الضمير' : 'Save to Step 4 Ledger',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _categoryLabel(InventoryCategory cat, bool isAr) {
    switch (cat) {
      case InventoryCategory.resentment:
        return isAr ? 'استياء' : 'Resentment';
      case InventoryCategory.fear:
        return isAr ? 'خوف' : 'Fear';
      case InventoryCategory.sex:
        return isAr ? 'سلوك جنسي' : 'Sex';
      case InventoryCategory.harms:
        return isAr ? 'أضرار' : 'Harms';
    }
  }

  String _instinctLabel(AffectedInstinct i, bool isAr) {
    switch (i) {
      case AffectedInstinct.selfEsteem:
        return isAr ? 'الكبرياء/الذات' : 'Self-esteem';
      case AffectedInstinct.financialSecurity:
        return isAr ? 'الأمان المالي' : 'Financial';
      case AffectedInstinct.emotionalSecurity:
        return isAr ? 'الأمان العاطفي' : 'Emotional';
      case AffectedInstinct.ambitions:
        return isAr ? 'الطموحات' : 'Ambitions';
      case AffectedInstinct.personalRelations:
        return isAr ? 'العلاقات الشخصية' : 'Personal';
      case AffectedInstinct.sexRelations:
        return isAr ? 'العلاقات الحميمية' : 'Sex';
    }
  }

  String _defectLabel(MyPartDefect d, bool isAr) {
    switch (d) {
      case MyPartDefect.selfish:
        return isAr ? 'الأنانية' : 'Selfish';
      case MyPartDefect.dishonest:
        return isAr ? 'عدم الأمانة' : 'Dishonest';
      case MyPartDefect.selfSeeking:
        return isAr ? 'التماس المصلحة' : 'Self-seeking';
      case MyPartDefect.fearing:
        return isAr ? 'الخوف' : 'Fearing';
      case MyPartDefect.inconsiderate:
        return isAr ? 'عدم المراعاة' : 'Inconsiderate';
    }
  }
}
`
  },
  {
    fileName: 'step11_models.dart',
    title: 'نماذج مراجعة المساء والخطوة 11 (Step 11 & Nightly Models)',
    code: `import 'package:flutter/foundation.dart';

class NightlyReview {
  final String id;
  final DateTime date;
  // الأسئلة الستة من الصفحة 86 من الكتاب الكبير
  final bool wasResentful;
  final String resentmentNotes;
  final bool oweApology;
  final String apologyNotes;
  final bool keptSecret;
  final String secretNotes;
  final bool wereKindAndLoving;
  final bool thinkingOfSelf;
  final String whatCouldWeDoBetter;
  final List<String> gratitudeItems;
  final int peaceScore;

  NightlyReview({
    required this.id,
    required this.date,
    required this.wasResentful,
    required this.resentmentNotes,
    required this.oweApology,
    required this.apologyNotes,
    required this.keptSecret,
    required this.secretNotes,
    required this.wereKindAndLoving,
    required this.thinkingOfSelf,
    required this.whatCouldWeDoBetter,
    required this.gratitudeItems,
    required this.peaceScore,
  });
}

class Step11StateNotifier extends ChangeNotifier {
  final List<NightlyReview> _history = [
    NightlyReview(
      id: '1',
      date: DateTime.now().subtract(const Duration(days: 1)),
      wasResentful: false,
      resentmentNotes: '',
      oweApology: true,
      apologyNotes: 'اعتذار للأسرة عن التسرع في التعبير مساءً.',
      keptSecret: false,
      secretNotes: '',
      wereKindAndLoving: true,
      thinkingOfSelf: false,
      whatCouldWeDoBetter: 'الإنصات أكثر قبل إبداء الرأي.',
      gratitudeItems: [
        'الاستيقاظ بوعي صافٍ دون ندم',
        'مكالمة هادفة مع زميل في التعافي',
      ],
      peaceScore: 85,
    ),
  ];

  final List<String> _currentGratitudeItems = [
    'الاستيقاظ بنقاء وسكينة لليوم',
    'وجود مشرف صادق يدعمني',
  ];

  List<NightlyReview> get history => List.unmodifiable(_history);
  List<String> get currentGratitudeItems => List.unmodifiable(_currentGratitudeItems);

  void addGratitudeItem(String item) {
    if (item.trim().isEmpty) return;
    _currentGratitudeItems.add(item.trim());
    notifyListeners();
  }

  void removeGratitudeItem(int index) {
    _currentGratitudeItems.removeAt(index);
    notifyListeners();
  }

  void saveReview(NightlyReview review) {
    _history.insert(0, review);
    notifyListeners();
  }

  void deleteReview(String id) {
    _history.removeWhere((r) => r.id == id);
    notifyListeners();
  }
}
`
  },
  {
    fileName: 'step11_nightly_review_screen.dart',
    title: 'شاشة مراجعة المساء والخطوة 11 (Step 11 & Nightly Review Screen)',
    code: `import 'dart:async';
import 'package:flutter/material.dart';
import 'step11_models.dart';

class Step11NightlyReviewScreen extends StatefulWidget {
  const Step11NightlyReviewScreen({super.key});

  @override
  State<Step11NightlyReviewScreen> createState() => _Step11NightlyReviewScreenState();
}

class _Step11NightlyReviewScreenState extends State<Step11NightlyReviewScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  late final Step11StateNotifier _notifier;

  // Question Form States (Big Book Page 86)
  bool _wasResentful = false;
  final _resentmentController = TextEditingController();
  bool _oweApology = false;
  final _apologyController = TextEditingController();
  bool _keptSecret = false;
  final _secretController = TextEditingController();
  bool _wereKind = true;
  bool _thinkingOfSelf = false;
  final _betterController = TextEditingController();

  // Gratitude input
  final _gratitudeController = TextEditingController();

  // 1-Minute Meditation Timer
  Timer? _meditationTimer;
  int _meditationSeconds = 60;
  bool _isMeditating = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _notifier = Step11StateNotifier();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _notifier.dispose();
    _resentmentController.dispose();
    _apologyController.dispose();
    _secretController.dispose();
    _betterController.dispose();
    _gratitudeController.dispose();
    _meditationTimer?.cancel();
    super.dispose();
  }

  int _calculatePeaceScore() {
    int score = 100;
    if (_wasResentful) score -= 25;
    if (_oweApology) score -= 20;
    if (_keptSecret) score -= 20;
    if (!_wereKind) score -= 20;
    if (_thinkingOfSelf) score -= 15;
    return score.clamp(10, 100);
  }

  void _saveReview(bool isAr) {
    final score = _calculatePeaceScore();
    final review = NightlyReview(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      date: DateTime.now(),
      wasResentful: _wasResentful,
      resentmentNotes: _resentmentController.text.trim(),
      oweApology: _oweApology,
      apologyNotes: _apologyController.text.trim(),
      keptSecret: _keptSecret,
      secretNotes: _secretController.text.trim(),
      wereKindAndLoving: _wereKind,
      thinkingOfSelf: _thinkingOfSelf,
      whatCouldWeDoBetter: _betterController.text.trim(),
      gratitudeItems: _notifier.currentGratitudeItems,
      peaceScore: score,
    );

    _notifier.saveReview(review);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(isAr ? 'تم حفظ مراجعة الليلة بنجاح!' : 'Nightly Review saved!'),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }

  void _startMeditationTimer() {
    setState(() {
      _isMeditating = true;
      _meditationSeconds = 60;
    });

    _meditationTimer?.cancel();
    _meditationTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_meditationSeconds > 1) {
        setState(() => _meditationSeconds--);
      } else {
        timer.cancel();
        setState(() {
          _isMeditating = false;
          _meditationSeconds = 60;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('اكتملت دقيقة التأمل والسكينة')),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return Scaffold(
      appBar: AppBar(
        title: Text(
          isAr ? 'مراجعة المساء والخطوة 11' : 'Nightly Review & Step 11',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF10B981),
          labelColor: const Color(0xFF10B981),
          unselectedLabelColor: const Color(0xFF94A3B8),
          tabs: [
            Tab(text: isAr ? 'مراجعة المساء (ص 86)' : 'Nightly Review'),
            Tab(text: isAr ? 'الخطوة 11 (الامتنان)' : 'Step 11 Gratitude'),
            Tab(text: isAr ? 'السجل السابق' : 'History'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildNightlyReviewTab(isAr),
          _buildStep11Tab(isAr),
          _buildHistoryTab(isAr),
        ],
      ),
    );
  }

  // 1. تبويب مراجعة المساء (الأسئلة الستة)
  Widget _buildNightlyReviewTab(bool isAr) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // كارت التوجيه
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131A26),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      isAr ? 'فحص الضمير المسائي (ص 86)' : 'Evening Review (p. 86)',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    Text(
                      '\${_calculatePeaceScore()}%',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF10B981),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  isAr
                    ? '«عندما نأوي إلى فراشنا ليلاً، نراجع يومنا بشكل بنّاء دون الانزلاق إلى لوم الذات أو القلق»'
                    : '"When we retire at night, we constructively review our day without self-reproach."',
                  style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // السؤال 1: الاستياء والخوف
          _buildYesNoTile(
            question: isAr ? '1. هل كنا مستائين، غير مخلصين، خائفين، أو غيورين؟' : '1. Were we resentful, dishonest, afraid, or jealous?',
            value: _wasResentful,
            onChanged: (v) => setState(() => _wasResentful = v),
            isAr: isAr,
            noteController: _wasResentful ? _resentmentController : null,
            noteHint: isAr ? 'حدد الاستياء أو الخوف المكتوم...' : 'Detail the resentment or fear...',
          ),
          const SizedBox(height: 12),

          // السؤال 2: الاعتذار
          _buildYesNoTile(
            question: isAr ? '2. هل ندين باعتذار لأحد؟' : '2. Do we owe an apology?',
            value: _oweApology,
            onChanged: (v) => setState(() => _oweApology = v),
            isAr: isAr,
            noteController: _oweApology ? _apologyController : null,
            noteHint: isAr ? 'لمن تدين بالاعتذار، وما هو التصحيح؟' : 'Who and what apology is owed?',
          ),
          const SizedBox(height: 12),

          // السؤال 3: شيء مكتوم
          _buildYesNoTile(
            question: isAr ? '3. هل احتفظنا بشيء لأنفسنا كان يجب مناقشته فوراً؟' : '3. Have we kept something to ourselves which should be discussed at once?',
            value: _keptSecret,
            onChanged: (v) => setState(() => _keptSecret = v),
            isAr: isAr,
            noteController: _keptSecret ? _secretController : null,
            noteHint: isAr ? 'ما هو الأمر الذي يحتاج لمصارحة؟' : 'What needs discussion?',
          ),
          const SizedBox(height: 12),

          // السؤال 4: المحبة والطيبة
          _buildYesNoTile(
            question: isAr ? '4. هل كنا طيبين ومحبين مع الجميع؟' : '4. Were we kind and loving toward all?',
            value: _wereKind,
            onChanged: (v) => setState(() => _wereKind = v),
            isAr: isAr,
          ),
          const SizedBox(height: 12),

          // السؤال 5: التفكير في النفس
          _buildYesNoTile(
            question: isAr ? '5. هل كنا نفكر في أنفسنا معظم الوقت؟' : '5. Were we thinking of ourselves most of the time?',
            value: _thinkingOfSelf,
            onChanged: (v) => setState(() => _thinkingOfSelf = v),
            isAr: isAr,
          ),
          const SizedBox(height: 12),

          // السؤال 6: ما الذي كان بإمكاننا فعله أفضل؟
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131A26),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isAr ? '6. ما الذي كان بإمكاننا فعله بشكل أفضل؟' : '6. What could we have done better?',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _betterController,
                  maxLines: 2,
                  decoration: InputDecoration(
                    hintText: isAr ? 'خلاصة هادئة وبناءة لدروس اليوم...' : 'Constructive takeaways for tomorrow...',
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // زر حفظ مراجعة المساء
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            icon: const Icon(Icons.save),
            label: Text(
              isAr ? 'حفظ مراجعة الليلة (ص 86)' : 'Save Nightly Review',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            onPressed: () => _saveReview(isAr),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildYesNoTile({
    required String question,
    required bool value,
    required ValueChanged<bool> onChanged,
    required bool isAr,
    TextEditingController? noteController,
    String? noteHint,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  question,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                ),
              ),
              Row(
                children: [
                  ChoiceChip(
                    label: Text(isAr ? 'نعم' : 'Yes'),
                    selected: value,
                    selectedColor: const Color(0xFF10B981),
                    onSelected: (_) => onChanged(true),
                  ),
                  const SizedBox(width: 6),
                  ChoiceChip(
                    label: Text(isAr ? 'لا' : 'No'),
                    selected: !value,
                    selectedColor: const Color(0xFF334155),
                    onSelected: (_) => onChanged(false),
                  ),
                ],
              ),
            ],
          ),
          if (noteController != null) ...[
            const SizedBox(height: 8),
            TextField(
              controller: noteController,
              decoration: InputDecoration(
                hintText: noteHint,
                filled: true,
                fillColor: const Color(0xFF0F172A),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
            ),
          ],
        ],
      ),
    );
  }

  // 2. تبويب الخطوة 11 (الامتنان والتأمل)
  Widget _buildStep11Tab(bool isAr) {
    return ListenableBuilder(
      listenable: _notifier,
      builder: (context, _) {
        final items = _notifier.currentGratitudeItems;

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // كارت دعاء ص 86
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF131A26),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.wb_sunny_outlined, color: Color(0xFF10B981), size: 32),
                    const SizedBox(height: 10),
                    Text(
                      isAr ? 'توجيه الفكر الصباحي (ص 86)' : 'Step 11 Morning Meditation',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      isAr
                        ? '«اللهم وجه أفكاري اليوم، وطهرها من الشفقة على الذات، ومن عدم الأمانة، ومن السعي الأناني وراء مصلحتي الشخصية»'
                        : '"God, direct my thinking today; especially divorce it from self-pity, dishonesty, or self-seeking motives."',
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 13, height: 1.6, color: Color(0xFFCBD5E1)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // قسم الامتنان: ما الذي أنا ممتن له اليوم؟
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF131A26),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.favorite, color: Colors.redAccent, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          isAr ? 'ما الذي أنا ممتن له اليوم؟' : 'What am I grateful for today?',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _gratitudeController,
                            decoration: InputDecoration(
                              hintText: isAr ? 'أضف نعمة ممتن لها اليوم...' : 'Add a blessing...',
                              filled: true,
                              fillColor: const Color(0xFF0F172A),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filled(
                          style: IconButton.filled(backgroundColor: const Color(0xFF10B981)),
                          icon: const Icon(Icons.add),
                          onPressed: () {
                            _notifier.addGratitudeItem(_gratitudeController.text);
                            _gratitudeController.clear();
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: items.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 6),
                      itemBuilder: (context, idx) {
                        return ListTile(
                          tileColor: const Color(0xFF0F172A),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          leading: const Icon(Icons.check_circle, size: 18, color: Color(0xFF10B981)),
                          title: Text(items[idx], style: const TextStyle(fontSize: 13)),
                          trailing: IconButton(
                            icon: const Icon(Icons.close, size: 16, color: Color(0xFF64748B)),
                            onPressed: () => _notifier.removeGratitudeItem(idx),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // دقيقة التأمل والصمت
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF131A26),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF0284C7).withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isAr ? 'دقيقة الصمت والإنصات الداخلي' : '1-Minute Silent Listening',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        Text(
                          isAr ? 'الصمت لطلب الإلهام والإرشاد الصائب' : 'Quiet mind to seek right inspiration',
                          style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Text(
                          '\$_meditationSeconds s',
                          style: const TextStyle(fontFamily: 'monospace', fontSize: 16, color: Color(0xFF38BDF8)),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filled(
                          style: IconButton.filled(backgroundColor: const Color(0xFF0284C7)),
                          icon: Icon(_isMeditating ? Icons.hourglass_bottom : Icons.play_arrow),
                          onPressed: _isMeditating ? null : _startMeditationTimer,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // 3. تبويب السجل السابق
  Widget _buildHistoryTab(bool isAr) {
    return ListenableBuilder(
      listenable: _notifier,
      builder: (context, _) {
        final history = _notifier.history;

        if (history.isEmpty) {
          return Center(
            child: Text(
              isAr ? 'لا توجد مراجعات مسائية محفوظة' : 'No saved nightly reviews',
              style: const TextStyle(color: Color(0xFF64748B)),
            ),
          );
        }

        return ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: history.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, idx) {
            final item = history[idx];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF131A26),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF1E293B)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '\${item.date.year}/\${item.date.month}/\${item.date.day}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        '\${item.peaceScore}%',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  if (item.oweApology && item.apologyNotes.isNotEmpty)
                    Text(
                      isAr ? 'الاعتذار: \${item.apologyNotes}' : 'Apology: \${item.apologyNotes}',
                      style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 12),
                    ),
                  if (item.whatCouldWeDoBetter.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      isAr ? 'الأفضل غداً: \${item.whatCouldWeDoBetter}' : 'Better tomorrow: \${item.whatCouldWeDoBetter}',
                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }
}
`
  },
  {
    fileName: 'contact_models.dart',
    title: 'نماذج بيانات دليل الرفاق والموجه (Directory Models & State)',
    code: `import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';

/// أدوار جهات الاتصال في شبكة التعافي
enum ContactRole {
  sponsor, // الموجه / الكفيل
  fellow,  // زميل التعافي / رفيق الزمالة
}

extension ContactRoleExtension on ContactRole {
  String get titleAr {
    switch (this) {
      case ContactRole.sponsor:
        return 'الموجه (Sponsor)';
      case ContactRole.fellow:
        return 'زميل تعافي (Fellowship Brother)';
    }
  }

  String get titleEn {
    switch (this) {
      case ContactRole.sponsor:
        return 'Sponsor';
      case ContactRole.fellow:
        return 'Fellowship Brother';
    }
  }
}

/// نموذج جهة اتصال شبكة التعافي والمحاسبة
class DirectoryContact {
  final String id;
  final String name;
  final String phone;
  final ContactRole role;
  final int? cleanDays;
  final String? notes;
  final DateTime createdAt;

  const DirectoryContact({
    required this.id,
    required this.name,
    required this.phone,
    required this.role,
    this.cleanDays,
    this.notes,
    required this.createdAt,
  });

  bool get isSponsor => role == ContactRole.sponsor;

  DirectoryContact copyWith({
    String? id,
    String? name,
    String? phone,
    ContactRole? role,
    int? cleanDays,
    String? notes,
    DateTime? createdAt,
  }) {
    return DirectoryContact(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      cleanDays: cleanDays ?? this.cleanDays,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'phone': phone,
    'role': role.name,
    'cleanDays': cleanDays,
    'notes': notes,
    'createdAt': createdAt.toIso8601String(),
  };

  factory DirectoryContact.fromJson(Map<String, dynamic> json) {
    return DirectoryContact(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      role: json['role'] == 'sponsor' ? ContactRole.sponsor : ContactRole.fellow,
      cleanDays: json['cleanDays'] as int?,
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}

/// مدير حالة جهات الاتصال والتواصل الفوري
class ContactsNotifier extends ChangeNotifier {
  List<DirectoryContact> _contacts = [
    DirectoryContact(
      id: 'sponsor-primary',
      name: 'أحمد بن عبد الله (الموجه)',
      phone: '+966501234567',
      role: ContactRole.sponsor,
      cleanDays: 1825,
      notes: 'الموجه الأساسي لخطوات التعافي - متاح دائماً للأزمات الطارئة',
      createdAt: DateTime.now().subtract(const Duration(days: 365)),
    ),
    DirectoryContact(
      id: 'fellow-1',
      name: 'طارق المحمدي',
      phone: '+966559876543',
      role: ContactRole.fellow,
      cleanDays: 410,
      notes: 'رفيق المجموعة المسائية ومشارك قراءات كتاب الأساسيات',
      createdAt: DateTime.now().subtract(const Duration(days: 120)),
    ),
    DirectoryContact(
      id: 'fellow-2',
      name: 'سلطان الدوسري',
      phone: '+966541122334',
      role: ContactRole.fellow,
      cleanDays: 240,
      notes: 'رفيق المساندة اليومية والاتصال الصباحي',
      createdAt: DateTime.now().subtract(const Duration(days: 90)),
    ),
    DirectoryContact(
      id: 'fellow-3',
      name: 'فيصل العتيبي',
      phone: '+966567788990',
      role: ContactRole.fellow,
      cleanDays: 95,
      notes: 'شريك الصدق ومراجعة الخطوة الرابعة والعاشرة',
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
  ];

  List<DirectoryContact> get contacts => List.unmodifiable(_contacts);

  /// بطاقة الموجه المقفلة بالأعلى (The Locked Primary Sponsor)
  DirectoryContact? get primarySponsor {
    try {
      return _contacts.firstWhere((c) => c.role == ContactRole.sponsor);
    } catch (_) {
      return null;
    }
  }

  /// قائمة زملاء التعافي (Recovery Fellowship Brothers)
  List<DirectoryContact> get fellowshipBrothers {
    return _contacts.where((c) => c.role == ContactRole.fellow).toList();
  }

  /// إضافة جهة اتصال جديدة مع التحقق من ترقية الموجه
  void addContact({
    required String name,
    required String phone,
    required ContactRole role,
    int? cleanDays,
    String? notes,
  }) {
    final newContact = DirectoryContact(
      id: 'contact_\${DateTime.now().millisecondsSinceEpoch}',
      name: name.trim(),
      phone: phone.trim(),
      role: role,
      cleanDays: cleanDays,
      notes: notes?.trim(),
      createdAt: DateTime.now(),
    );

    if (role == ContactRole.sponsor) {
      // نقل الموجه القديم ليصبح زميل تعافي، ووضع الموجه الجديد بالأعلى
      _contacts = [
        newContact,
        ..._contacts.map((c) => c.role == ContactRole.sponsor
            ? c.copyWith(role: ContactRole.fellow)
            : c),
      ];
    } else {
      _contacts.add(newContact);
    }
    notifyListeners();
  }

  /// حذف جهة اتصال
  void deleteContact(String id) {
    _contacts.removeWhere((c) => c.id == id);
    notifyListeners();
  }

  /// ترقية جهة اتصال لتصبح الموجه الأساسي
  void makeSponsor(String id) {
    _contacts = _contacts.map((c) {
      if (c.id == id) {
        return c.copyWith(role: ContactRole.sponsor);
      } else if (c.role == ContactRole.sponsor) {
        return c.copyWith(role: ContactRole.fellow);
      }
      return c;
    }).toList();
    // إعادة ترتيب الموجه للأعلى
    final sponsorIndex = _contacts.indexWhere((c) => c.role == ContactRole.sponsor);
    if (sponsorIndex > 0) {
      final sponsor = _contacts.removeAt(sponsorIndex);
      _contacts.insert(0, sponsor);
    }
    notifyListeners();
  }

  /// تشغيل الاتصال الهاتفي السريع
  static Future<void> launchPhone(String phone) async {
    final cleanPhone = phone.replaceAll(RegExp(r'[^0-9+]'), '');
    final uri = Uri.parse('tel:\$cleanPhone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  /// تشغيل محادثة واتساب مع رسالة طارئة مسبقة الصياغة للخطوة 10
  static Future<void> launchWhatsApp(String phone, {String? customMessage}) async {
    final cleanPhone = phone.replaceAll(RegExp(r'[^0-9]'), '');
    final defaultMsg = Uri.encodeComponent(
      customMessage ?? 'السلام عليكم ورحمة الله، أحتاج إلى دقيقة من وقتك لمناقشة استياء أو اضطراب طارئ وفق الخطوة العاشرة.',
    );
    final uri = Uri.parse('https://wa.me/\$cleanPhone?text=\$defaultMsg');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}
`
  },
  {
    fileName: 'contacts_directory_screen.dart',
    title: 'واجهة دليل الموجه ورفاق التعافي (Contacts Directory Screen)',
    code: `import 'package:flutter/material.dart';
import 'contact_models.dart';

class ContactsDirectoryScreen extends StatefulWidget {
  final ContactsNotifier contactsNotifier;
  final bool isAr;

  const ContactsDirectoryScreen({
    super.key,
    required this.contactsNotifier,
    this.isAr = true,
  });

  @override
  State<ContactsDirectoryScreen> createState() => _ContactsDirectoryScreenState();
}

class _ContactsDirectoryScreenState extends State<ContactsDirectoryScreen> {
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final isAr = widget.isAr;
    final primarySponsor = widget.contactsNotifier.primarySponsor;
    final fellows = widget.contactsNotifier.fellowshipBrothers.where((c) {
      if (_searchQuery.isEmpty) return true;
      return c.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          c.phone.contains(_searchQuery);
    }).toList();

    return Directionality(
      textDirection: isAr ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: const Color(0xFF0B0F17),
        appBar: AppBar(
          backgroundColor: const Color(0xFF101726),
          elevation: 0,
          title: Text(
            isAr ? 'دليل الرفاق والموجه (شبكة المحاسبة)' : 'Fellowship & Sponsor Directory',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.person_add_rounded, color: Color(0xFF10B981)),
              tooltip: isAr ? 'إضافة جهة اتصال' : 'Add Contact',
              onPressed: () => _showAddContactDialog(context),
            ),
          ],
        ),
        body: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          children: [
            // شريط البحث والفرز
            _buildSearchBar(isAr),
            const SizedBox(height: 20),

            // بطاقة الموجه المقفلة بالأعلى (The Locked Prominent Sponsor Card)
            if (primarySponsor != null) ...[
              _buildSectionHeader(
                title: isAr ? 'الموجه الروحي (الكفيل المعتمد)' : 'Primary Recovery Sponsor',
                subtitle: isAr ? 'جهة الاتصال الأساسية والمقفلة بالأعلى لمناقشة أزمات الخطوة العاشرة' : 'Locked top card for emergency Step 10 discussions',
                icon: Icons.verified_user_rounded,
                accentColor: const Color(0xFF10B981),
              ),
              const SizedBox(height: 10),
              _buildSponsorCard(primarySponsor, isAr),
              const SizedBox(height: 28),
            ],

            // قائمة زملاء التعافي (Recovery Fellowship Brothers)
            _buildSectionHeader(
              title: isAr ? 'زملاء التعافي (رفاق الطريق)' : 'Fellowship Brothers',
              subtitle: isAr ? 'شبكة المساندة اليومية والمساءلة الروحية (\${fellows.length})' : 'Daily accountability circle (\${fellows.length})',
              icon: Icons.group_rounded,
              accentColor: const Color(0xFF06B6D4),
            ),
            const SizedBox(height: 12),

            if (fellows.isEmpty)
              _buildEmptyFellowsState(isAr)
            else
              ...fellows.map((fellow) => _buildFellowCard(fellow, isAr)),
          ],
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () => _showAddContactDialog(context),
          backgroundColor: const Color(0xFF10B981),
          foregroundColor: Colors.white,
          icon: const Icon(Icons.add_rounded),
          label: Text(
            isAr ? 'إضافة رفيق جديد' : 'Add Recovery Contact',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }

  Widget _buildSearchBar(bool isAr) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: TextField(
        onChanged: (val) => setState(() => _searchQuery = val),
        style: const TextStyle(color: Colors.white, fontSize: 14),
        decoration: InputDecoration(
          hintText: isAr ? 'البحث بالاسم أو رقم الهاتف...' : 'Search by name or phone...',
          hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
          prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF64748B)),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
    );
  }

  Widget _buildSectionHeader({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: accentColor.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: accentColor.withValues(alpha: 0.3)),
          ),
          child: Icon(icon, color: accentColor, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSponsorCard(DirectoryContact sponsor, bool isAr) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF131F2E),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.4), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF10B981).withValues(alpha: 0.08),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: const Color(0xFF10B981).withValues(alpha: 0.2),
                child: const Icon(Icons.shield_rounded, color: Color(0xFF10B981), size: 30),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            sponsor.name,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.4)),
                          ),
                          child: Text(
                            isAr ? 'الموجه الأول' : 'Lead Sponsor',
                            style: const TextStyle(
                              color: Color(0xFF34D399),
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      sponsor.phone,
                      style: const TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 14,
                        fontFamily: 'monospace',
                      ),
                    ),
                    if (sponsor.cleanDays != null) ...[
                      const SizedBox(height: 6),
                      Text(
                        isAr ? 'مدة التعافي: \${(sponsor.cleanDays! / 365).toStringAsFixed(1)} سنة (\${sponsor.cleanDays} يوم)' : 'Clean Time: \${sponsor.cleanDays} days',
                        style: const TextStyle(
                          color: Color(0xFF06B6D4),
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
          if (sponsor.notes != null && sponsor.notes!.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF0B1320),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                sponsor.notes!,
                style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 12),
              ),
            ),
          ],
          const SizedBox(height: 16),
          // Quick Action Buttons (Call & WhatsApp)
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => ContactsNotifier.launchPhone(sponsor.phone),
                  icon: const Icon(Icons.phone_in_talk_rounded, size: 18),
                  label: Text(
                    isAr ? 'اتصال مباشر' : 'Call Sponsor',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => ContactsNotifier.launchWhatsApp(
                    sponsor.phone,
                    customMessage: isAr
                        ? 'السلام عليكم أخي الموجه، أحتاج إلى دقيقة من وقتك لمناقشة استياء أو اضطراب طارئ وفق الخطوة العاشرة.'
                        : 'Hi sponsor, I need a brief moment to discuss a Step 10 disturbance or resentment.',
                  ),
                  icon: const Icon(Icons.chat_bubble_rounded, size: 18),
                  label: Text(
                    isAr ? 'واتساب طارئ' : 'WhatsApp',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF059669),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFellowCard(DirectoryContact fellow, bool isAr) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: const Color(0xFF06B6D4).withValues(alpha: 0.15),
            child: const Icon(Icons.person_rounded, color: Color(0xFF06B6D4), size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  fellow.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  fellow.phone,
                  style: const TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 13,
                    fontFamily: 'monospace',
                  ),
                ),
                if (fellow.cleanDays != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    isAr ? 'التعافي: \${fellow.cleanDays} يوم' : 'Clean: \${fellow.cleanDays} d',
                    style: const TextStyle(
                      color: Color(0xFF10B981),
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ],
            ),
          ),
          // Action Buttons
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                onPressed: () => ContactsNotifier.launchPhone(fellow.phone),
                icon: const Icon(Icons.phone_rounded, color: Color(0xFF10B981), size: 20),
                tooltip: isAr ? 'اتصال' : 'Call',
                style: IconButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981).withValues(alpha: 0.1),
                ),
              ),
              const SizedBox(width: 6),
              IconButton(
                onPressed: () => ContactsNotifier.launchWhatsApp(fellow.phone),
                icon: const Icon(Icons.chat_rounded, color: Color(0xFF06B6D4), size: 20),
                tooltip: isAr ? 'محادثة' : 'Message',
                style: IconButton.styleFrom(
                  backgroundColor: const Color(0xFF06B6D4).withValues(alpha: 0.1),
                ),
              ),
              const SizedBox(width: 6),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert_rounded, color: Color(0xFF64748B), size: 20),
                color: const Color(0xFF1E293B),
                onSelected: (val) {
                  if (val == 'promote') {
                    widget.contactsNotifier.makeSponsor(fellow.id);
                  } else if (val == 'delete') {
                    widget.contactsNotifier.deleteContact(fellow.id);
                  }
                },
                itemBuilder: (ctx) => [
                  PopupMenuItem(
                    value: 'promote',
                    child: Text(
                      isAr ? 'ترقية ليصبح الموجه (Sponsor)' : 'Promote to Sponsor',
                      style: const TextStyle(color: Color(0xFF10B981), fontSize: 13),
                    ),
                  ),
                  PopupMenuItem(
                    value: 'delete',
                    child: Text(
                      isAr ? 'حذف من الدليل' : 'Delete',
                      style: const TextStyle(color: Color(0xFFEF4444), fontSize: 13),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyFellowsState(bool isAr) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Center(
        child: Column(
          children: [
            const Icon(Icons.group_outlined, color: Color(0xFF64748B), size: 40),
            const SizedBox(height: 10),
            Text(
              isAr ? 'لا يوجد رفاق مسجلون حالياً' : 'No fellowship contacts added yet',
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddContactDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final cleanDaysCtrl = TextEditingController();
    final notesCtrl = TextEditingController();
    ContactRole selectedRole = ContactRole.fellow;
    final formKey = GlobalKey<FormState>();
    final isAr = widget.isAr;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => Directionality(
          textDirection: isAr ? TextDirection.rtl : TextDirection.ltr,
          child: AlertDialog(
            backgroundColor: const Color(0xFF131A26),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: Text(
              isAr ? 'إضافة جهة اتصال في شبكة التعافي' : 'Add Recovery Contact',
              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18),
            ),
            content: SingleChildScrollView(
              child: Form(
                key: formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Role Selector
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0B0F17),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF1E293B)),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<ContactRole>(
                          value: selectedRole,
                          isExpanded: true,
                          dropdownColor: const Color(0xFF1E293B),
                          items: [
                            DropdownMenuItem(
                              value: ContactRole.sponsor,
                              child: Text(
                                isAr ? 'الموجه الرئيسي (Sponsor)' : 'Primary Sponsor',
                                style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold),
                              ),
                            ),
                            DropdownMenuItem(
                              value: ContactRole.fellow,
                              child: Text(
                                isAr ? 'زميل تعافي (Fellowship Brother)' : 'Fellowship Brother',
                                style: const TextStyle(color: Color(0xFF06B6D4)),
                              ),
                            ),
                          ],
                          onChanged: (val) {
                            if (val != null) {
                              setDialogState(() => selectedRole = val);
                            }
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    // Name Field
                    TextFormField(
                      controller: nameCtrl,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        labelText: isAr ? 'الاسم *' : 'Name *',
                        labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                        filled: true,
                        fillColor: const Color(0xFF0B0F17),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      ),
                      validator: (val) => (val == null || val.trim().isEmpty)
                          ? (isAr ? 'الرجاء إدخال الاسم' : 'Please enter name')
                          : null,
                    ),
                    const SizedBox(height: 14),
                    // Phone Field
                    TextFormField(
                      controller: phoneCtrl,
                      keyboardType: TextInputType.phone,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        labelText: isAr ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *',
                        labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                        hintText: '+9665xxxxxxxx',
                        hintStyle: const TextStyle(color: Color(0xFF475569)),
                        filled: true,
                        fillColor: const Color(0xFF0B0F17),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      ),
                      validator: (val) => (val == null || val.trim().isEmpty)
                          ? (isAr ? 'الرجاء إدخال رقم الهاتف' : 'Please enter phone')
                          : null,
                    ),
                    const SizedBox(height: 14),
                    // Clean Days Field
                    TextFormField(
                      controller: cleanDaysCtrl,
                      keyboardType: TextInputType.number,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        labelText: isAr ? 'أيام التعافي (اختياري)' : 'Clean Days (optional)',
                        labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                        filled: true,
                        fillColor: const Color(0xFF0B0F17),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 14),
                    // Notes Field
                    TextFormField(
                      controller: notesCtrl,
                      maxLines: 2,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        labelText: isAr ? 'ملاحظات وتذكيرات' : 'Notes & Reminders',
                        labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                        filled: true,
                        fillColor: const Color(0xFF0B0F17),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: Text(isAr ? 'إلغاء' : 'Cancel', style: const TextStyle(color: Color(0xFF94A3B8))),
              ),
              ElevatedButton(
                onPressed: () {
                  if (formKey.currentState?.validate() ?? false) {
                    final cleanDays = int.tryParse(cleanDaysCtrl.text.trim());
                    widget.contactsNotifier.addContact(
                      name: nameCtrl.text,
                      phone: phoneCtrl.text,
                      role: selectedRole,
                      cleanDays: cleanDays,
                      notes: notesCtrl.text.isNotEmpty ? notesCtrl.text : null,
                    );
                    Navigator.pop(ctx);
                    setState(() {});
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(isAr ? 'حفظ' : 'Save'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    fileName: 'security_service.dart',
    title: 'خدمة التشفير المحلي والمصادقة الحيوية (Security & Vault Service)',
    code: `import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:local_auth/local_auth.dart';

/// خدمة التخزين المحلي المشفر بمفتاح AES-256
class SecureStorageService {
  static final SecureStorageService _instance = SecureStorageService._internal();
  factory SecureStorageService() => _instance;
  SecureStorageService._internal();

  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  static const String _vaultKeyName = 'recovery_aes_256_key';
  List<int>? _encryptionCipherKey;

  /// تهيئة بيئة التخزين المشفرة وإنشاء مفتاح AES-256 فريد داخل معالج الأمان بالجهاز
  Future<void> initializeVault() async {
    await Hive.initFlutter();

    // استرجاع مفتاح التشفير من مستودع المفاتيح الآمن أو توليده محلياً
    String? storedKeyBase64 = await _secureStorage.read(key: _vaultKeyName);
    if (storedKeyBase64 == null) {
      // توليد مفتاح عشوائي مشفر بحجم 32 بايت (256-bit)
      final newKey = Hive.generateSecureKey();
      await _secureStorage.write(
        key: _vaultKeyName,
        value: base64UrlEncode(newKey),
      );
      _encryptionCipherKey = newKey;
    } else {
      _encryptionCipherKey = base64Url.decode(storedKeyBase64);
    }

    // فتح الخزائن المشفرة للخطوات الثلاث
    await _openEncryptedBoxes();
  }

  /// فتح الصناديق المشفرة
  Future<void> _openEncryptedBoxes() async {
    if (_encryptionCipherKey == null) return;
    final cipher = HiveAesCipher(_encryptionCipherKey!);

    // صندوق سجل الخطوة الرابعة (Step 4 Inventory)
    if (!Hive.isBoxOpen('step4_inventory')) {
      await Hive.openBox('step4_inventory', encryptionCipher: cipher);
    }

    // صندوق مراجعة المساء والامتنان (Step 11 Nightly Reviews)
    if (!Hive.isBoxOpen('nightly_reviews')) {
      await Hive.openBox('nightly_reviews', encryptionCipher: cipher);
    }

    // صندوق دليل الرفاق والموجه (Recovery Contacts Directory)
    if (!Hive.isBoxOpen('recovery_contacts')) {
      await Hive.openBox('recovery_contacts', encryptionCipher: cipher);
    }
  }

  /// الحصول على صندوق مشفر بالاسم
  Box getBox(String boxName) {
    return Hive.box(boxName);
  }

  /// مسح أمني طارئ لجميع البيانات والمفاتيح من الجهاز (Emergency Local Wipe)
  Future<void> emergencyWipeAllData() async {
    try {
      if (Hive.isBoxOpen('step4_inventory')) await Hive.box('step4_inventory').clear();
      if (Hive.isBoxOpen('nightly_reviews')) await Hive.box('nightly_reviews').clear();
      if (Hive.isBoxOpen('recovery_contacts')) await Hive.box('recovery_contacts').clear();
      await _secureStorage.deleteAll();
      await initializeVault();
    } catch (e) {
      debugPrint('Error wiping encrypted vault: \$e');
    }
  }
}

/// مدير حالة الأمان والقفل ومراقبة دورة حياة التطبيق (App Lifecycle & Lock State)
class SecurityNotifier extends ChangeNotifier with WidgetsBindingObserver {
  final LocalAuthentication _localAuth = LocalAuthentication();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  static const String _prefLockEnabled = 'app_lock_enabled';
  static const String _prefBiometricsEnabled = 'app_biometrics_enabled';
  static const String _prefPinCode = 'app_pin_code';
  static const String _prefAutoLockDelaySec = 'app_autolock_delay_sec';

  bool _isLocked = false;
  bool _isLockEnabled = false;
  bool _isBiometricsEnabled = true;
  String _pinCode = '1234';
  int _autoLockDelaySec = 0; // 0 = فوري عند الخروج
  DateTime? _lastPausedTime;

  bool get isLocked => _isLocked;
  bool get isLockEnabled => _isLockEnabled;
  bool get isBiometricsEnabled => _isBiometricsEnabled;
  String get pinCode => _pinCode;
  int get autoLockDelaySec => _autoLockDelaySec;

  SecurityNotifier() {
    WidgetsBinding.instance.addObserver(this);
    _loadSettings();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  Future<void> _loadSettings() async {
    final lockEnabledStr = await _secureStorage.read(key: _prefLockEnabled);
    final bioEnabledStr = await _secureStorage.read(key: _prefBiometricsEnabled);
    final savedPin = await _secureStorage.read(key: _prefPinCode);
    final delayStr = await _secureStorage.read(key: _prefAutoLockDelaySec);

    _isLockEnabled = lockEnabledStr == 'true';
    _isBiometricsEnabled = bioEnabledStr != 'false';
    _pinCode = savedPin ?? '1234';
    _autoLockDelaySec = int.tryParse(delayStr ?? '0') ?? 0;

    // إذا كان القفل مفعلاً، يتم إغلاق التطبيق فور بدء التشغيل
    if (_isLockEnabled) {
      _isLocked = true;
    }
    notifyListeners();
  }

  /// مراقبة دورة حياة التطبيق للقفل التلقائي عند الرجوع من الخلفية
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (!_isLockEnabled) return;

    if (state == AppLifecycleState.paused) {
      _lastPausedTime = DateTime.now();
    } else if (state == AppLifecycleState.resumed) {
      if (_lastPausedTime != null) {
        final elapsed = DateTime.now().difference(_lastPausedTime!).inSeconds;
        if (elapsed >= _autoLockDelaySec) {
          _isLocked = true;
          notifyListeners();
        }
      } else {
        _isLocked = true;
        notifyListeners();
      }
    }
  }

  /// تفعيل أو تعطيل قفل التطبيق
  Future<void> toggleLock(bool enable) async {
    _isLockEnabled = enable;
    await _secureStorage.write(key: _prefLockEnabled, value: enable ? 'true' : 'false');
    if (!enable) {
      _isLocked = false;
    }
    notifyListeners();
  }

  /// تفعيل أو تعطيل المصادقة الحيوية
  Future<void> toggleBiometrics(bool enable) async {
    _isBiometricsEnabled = enable;
    await _secureStorage.write(key: _prefBiometricsEnabled, value: enable ? 'true' : 'false');
    notifyListeners();
  }

  /// تغيير رمز المرور المكون من 4 أرقام
  Future<bool> changePin({required String oldPin, required String newPin}) async {
    if (oldPin != _pinCode) return false;
    if (newPin.length != 4 || int.tryParse(newPin) == null) return false;

    _pinCode = newPin;
    await _secureStorage.write(key: _prefPinCode, value: newPin);
    notifyListeners();
    return true;
  }

  /// ضبط مهلة القفل التلقائي
  Future<void> setAutoLockDelay(int seconds) async {
    _autoLockDelaySec = seconds;
    await _secureStorage.write(key: _prefAutoLockDelaySec, value: seconds.toString());
    notifyListeners();
  }

  /// قفل التطبيق يدوياً الآن
  void lockNow() {
    if (_isLockEnabled) {
      _isLocked = true;
      notifyListeners();
    }
  }

  /// التحقق من رمز المرور وفتح القفل
  bool unlockWithPin(String enteredPin) {
    if (enteredPin == _pinCode) {
      _isLocked = false;
      notifyListeners();
      return true;
    }
    return false;
  }

  /// المصادقة عبر البصمة الحيوية (Face ID / Fingerprint)
  Future<bool> authenticateWithBiometrics({required String localizedReason}) async {
    if (!_isBiometricsEnabled) return false;

    try {
      final bool canAuthenticateWithBiometrics = await _localAuth.canCheckBiometrics;
      final bool canAuthenticate = canAuthenticateWithBiometrics || await _localAuth.isDeviceSupported();

      if (!canAuthenticate) return false;

      final bool didAuthenticate = await _localAuth.authenticate(
        localizedReason: localizedReason,
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true,
          useErrorDialogs: true,
        ),
      );

      if (didAuthenticate) {
        _isLocked = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      debugPrint('Biometric authentication error: \$e');
    }
    return false;
  }
}
`
  },
  {
    fileName: 'app_lock_screen.dart',
    title: 'واجهة قفل التطبيق ولوحة الأرقام (App Lock & Keypad UI)',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'security_service.dart';

class AppLockScreen extends StatefulWidget {
  final SecurityNotifier securityNotifier;
  final bool isAr;

  const AppLockScreen({
    super.key,
    required this.securityNotifier,
    this.isAr = true,
  });

  @override
  State<AppLockScreen> createState() => _AppLockScreenState();
}

class _AppLockScreenState extends State<AppLockScreen> with SingleTickerProviderStateMixin {
  String _enteredPin = '';
  bool _isError = false;
  bool _isSuccess = false;
  late AnimationController _shakeController;
  late Animation<double> _shakeAnimation;

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    _shakeAnimation = Tween<double>(begin: 0.0, end: 12.0)
        .chain(CurveTween(curve: Curves.elasticIn))
        .animate(_shakeController);

    // محاولة المصادقة الحيوية التلقائية عند فتح الشاشة إذا كانت مفعلة
    if (widget.securityNotifier.isBiometricsEnabled) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _triggerBiometricAuth();
      });
    }
  }

  @override
  void dispose() {
    _shakeController.dispose();
    super.dispose();
  }

  Future<void> _triggerBiometricAuth() async {
    final reason = widget.isAr
        ? 'يرجى تأكيد هويتك الحيوية لفتح سجلات التعافي المشفرة'
        : 'Please verify biometrics to unlock encrypted recovery records';
    await widget.securityNotifier.authenticateWithBiometrics(localizedReason: reason);
  }

  void _onDigitPressed(String digit) {
    if (_enteredPin.length >= 4 || _isSuccess) return;

    HapticFeedback.lightImpact();
    setState(() {
      _enteredPin += digit;
      _isError = false;
    });

    if (_enteredPin.length == 4) {
      final success = widget.securityNotifier.unlockWithPin(_enteredPin);
      if (success) {
        HapticFeedback.mediumImpact();
        setState(() => _isSuccess = true);
      } else {
        HapticFeedback.heavyImpact();
        setState(() => _isError = true);
        _shakeController.forward(from: 0.0).then((_) {
          setState(() {
            _enteredPin = '';
            _isError = false;
          });
        });
      }
    }
  }

  void _onDeletePressed() {
    if (_enteredPin.isNotEmpty && !_isSuccess) {
      HapticFeedback.selectionClick();
      setState(() {
        _enteredPin = _enteredPin.substring(0, _enteredPin.length - 1);
        _isError = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isAr = widget.isAr;

    return Directionality(
      textDirection: isAr ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: const Color(0xFF070B11),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(),

                // أيقونة القفل المتحركة
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: _isSuccess
                        ? const Color(0xFF10B981).withValues(alpha: 0.2)
                        : _isError
                            ? const Color(0xFFEF4444).withValues(alpha: 0.2)
                            : const Color(0xFF131A26),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: _isSuccess
                          ? const Color(0xFF10B981)
                          : _isError
                              ? const Color(0xFFEF4444)
                              : const Color(0xFF1E293B),
                      width: 2,
                    ),
                  ),
                  child: Icon(
                    _isSuccess
                        ? Icons.lock_open_rounded
                        : Icons.lock_rounded,
                    color: _isSuccess
                        ? const Color(0xFF10B981)
                        : const Color(0xFF10B981),
                    size: 40,
                  ),
                ),
                const SizedBox(height: 20),

                // العنوان الفرعي
                Text(
                  isAr ? 'تطبيق التعافي مقفل' : 'Recovery Vault Locked',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  isAr
                      ? 'أدخل رمز المرور المكون من 4 أرقام أو استخدم المصادقة الحيوية'
                      : 'Enter 4-digit PIN or authenticate via Biometrics',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 32),

                // مؤشرات الرمز المكونة من 4 دوائر
                AnimatedBuilder(
                  animation: _shakeAnimation,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(_isError ? _shakeAnimation.value : 0, 0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(4, (index) {
                          final isFilled = _enteredPin.length > index;
                          return Container(
                            margin: const EdgeInsets.symmetric(horizontal: 10),
                            width: 16,
                            height: 16,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: _isSuccess
                                  ? const Color(0xFF10B981)
                                  : _isError
                                      ? const Color(0xFFEF4444)
                                      : isFilled
                                          ? const Color(0xFF10B981)
                                          : const Color(0xFF1E293B),
                              border: Border.all(
                                color: isFilled
                                    ? const Color(0xFF10B981)
                                    : const Color(0xFF334155),
                                width: 2,
                              ),
                            ),
                          );
                        }),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 48),

                // لوحة المفاتيح الرقمية (Keypad)
                ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 320),
                  child: Column(
                    children: [
                      _buildKeypadRow(['1', '2', '3']),
                      const SizedBox(height: 16),
                      _buildKeypadRow(['4', '5', '6']),
                      const SizedBox(height: 16),
                      _buildKeypadRow(['7', '8', '9']),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          // زر البصمة الحيوية
                          _buildActionButton(
                            icon: Icons.fingerprint_rounded,
                            color: const Color(0xFF06B6D4),
                            onTap: widget.securityNotifier.isBiometricsEnabled
                                ? _triggerBiometricAuth
                                : null,
                          ),
                          // الرقم 0
                          _buildDigitButton('0'),
                          // زر الحذف
                          _buildActionButton(
                            icon: Icons.backspace_outlined,
                            color: const Color(0xFF94A3B8),
                            onTap: _onDeletePressed,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const Spacer(),

                // شارة الخصوصية والتشفير المحلي
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.shield_outlined, color: Color(0xFF10B981), size: 16),
                    const SizedBox(width: 8),
                    Text(
                      isAr
                          ? 'تشفير AES-256 محلي · 0 بايت تخرج من الجهاز'
                          : 'AES-256 On-Device Vault · Zero Remote Transmission',
                      style: const TextStyle(
                        color: Color(0xFF64748B),
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildKeypadRow(List<String> digits) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: digits.map((d) => _buildDigitButton(d)).toList(),
    );
  }

  Widget _buildDigitButton(String digit) {
    return InkWell(
      onTap: () => _onDigitPressed(digit),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: 72,
        height: 72,
        decoration: BoxDecoration(
          color: const Color(0xFF131A26),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFF1E293B)),
        ),
        alignment: Alignment.center,
        child: Text(
          digit,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 26,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required Color color,
    required VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: 72,
        height: 72,
        decoration: BoxDecoration(
          color: const Color(0xFF131A26),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFF1E293B)),
        ),
        alignment: Alignment.center,
        child: Icon(icon, color: onTap != null ? color : const Color(0xFF475569), size: 28),
      ),
    );
  }
}
`
  },
  {
    fileName: 'security_settings_screen.dart',
    title: 'واجهة إعدادات الأمان والخزينة المشفرة (Security & Vault Settings)',
    code: `import 'package:flutter/material.dart';
import 'security_service.dart';

class SecuritySettingsScreen extends StatelessWidget {
  final SecurityNotifier securityNotifier;
  final SecureStorageService storageService;
  final bool isAr;

  const SecuritySettingsScreen({
    super.key,
    required this.securityNotifier,
    required this.storageService,
    this.isAr = true,
  });

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: isAr ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: const Color(0xFF0B0F17),
        appBar: AppBar(
          backgroundColor: const Color(0xFF101726),
          elevation: 0,
          title: Text(
            isAr ? 'الأمان والتشفير المحلي (الخطوة 5)' : 'Security & Encrypted Vault (Step 5)',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          ),
        ),
        body: AnimatedBuilder(
          animation: securityNotifier,
          builder: (context, _) {
            return ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
              children: [
                // بنر السرية المطلقة
                _buildPrivacyHeader(isAr),
                const SizedBox(height: 24),

                // قسم قفل التطبيق والبصمة
                _buildSectionHeader(
                  title: isAr ? 'إعدادات قفل التطبيق' : 'App Lock Configuration',
                  icon: Icons.lock_outline_rounded,
                  color: const Color(0xFF10B981),
                ),
                const SizedBox(height: 12),

                // مفتاح تفعيل قفل التطبيق
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF131A26),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: Column(
                    children: [
                      SwitchListTile(
                        value: securityNotifier.isLockEnabled,
                        activeColor: const Color(0xFF10B981),
                        title: Text(
                          isAr ? 'تفعيل قفل التطبيق (App Lock)' : 'Enable App Lock',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          isAr
                              ? 'طلب رمز المرور أو البصمة الحيوية عند كل فتح للتطبيق'
                              : 'Require PIN or Biometrics each time the app is opened',
                          style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                        ),
                        onChanged: (val) => securityNotifier.toggleLock(val),
                      ),
                      if (securityNotifier.isLockEnabled) ...[
                        const Divider(color: Color(0xFF1E293B), height: 1),
                        SwitchListTile(
                          value: securityNotifier.isBiometricsEnabled,
                          activeColor: const Color(0xFF06B6D4),
                          title: Text(
                            isAr ? 'المصادقة الحيوية (Face ID / البصمة)' : 'Biometric Authentication',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            isAr
                                ? 'استخدام مستشعر الجهاز لفتح القفل فورياً'
                                : 'Use device sensor for instantaneous unlock',
                            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                          ),
                          onChanged: (val) => securityNotifier.toggleBiometrics(val),
                        ),
                        const Divider(color: Color(0xFF1E293B), height: 1),
                        ListTile(
                          leading: const Icon(Icons.pin_rounded, color: Color(0xFF10B981)),
                          title: Text(
                            isAr ? 'تغيير رمز المرور (PIN)' : 'Change PIN Passcode',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            isAr ? 'الرمز الحالي: ••••' : 'Current PIN: ••••',
                            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF64748B), size: 16),
                          onTap: () => _showChangePinDialog(context, isAr),
                        ),
                        const Divider(color: Color(0xFF1E293B), height: 1),
                        ListTile(
                          leading: const Icon(Icons.timer_outlined, color: Color(0xFF06B6D4)),
                          title: Text(
                            isAr ? 'مهلة القفل التلقائي عند الخروج' : 'Auto-Lock Timeout',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            securityNotifier.autoLockDelaySec == 0
                                ? (isAr ? 'فوري عند مغادرة التطبيق' : 'Immediately upon leaving')
                                : '\${securityNotifier.autoLockDelaySec ~/ 60} \${isAr ? "دقيقة" : "minutes"}',
                            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                          ),
                          trailing: DropdownButton<int>(
                            value: securityNotifier.autoLockDelaySec,
                            dropdownColor: const Color(0xFF1E293B),
                            underline: const SizedBox(),
                            items: [
                              DropdownMenuItem(value: 0, child: Text(isAr ? 'فوري' : 'Immediate')),
                              DropdownMenuItem(value: 60, child: Text(isAr ? '1 دقيقة' : '1 min')),
                              DropdownMenuItem(value: 300, child: Text(isAr ? '5 دقائق' : '5 min')),
                            ],
                            onChanged: (val) {
                              if (val != null) securityNotifier.setAutoLockDelay(val);
                            },
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // قسم الخزينة المشفرة محلياً (Encrypted Local Storage Vault)
                _buildSectionHeader(
                  title: isAr ? 'الخزينة المشفرة محلياً (AES-256)' : 'Local Encrypted Vault',
                  icon: Icons.inventory_2_outlined,
                  color: const Color(0xFF06B6D4),
                ),
                const SizedBox(height: 12),
                _buildEncryptedBoxCard(
                  nameAr: 'دفتر جرد الخطوة الرابعة (Step 4)',
                  nameEn: 'Step 4 Inventory Ledger',
                  descAr: 'أطراف الاستياء، الأسباب، الأجزاء المتأثرة، وتحليل نصيبي بدقة تامة.',
                  descEn: 'Resentments, fears, affected self, and personal inventory analysis.',
                  boxKey: 'step4_inventory',
                  isAr: isAr,
                ),
                const SizedBox(height: 10),
                _buildEncryptedBoxCard(
                  nameAr: 'مراجعة المساء والامتنان (Step 11)',
                  nameEn: 'Nightly Review & Gratitude (Step 11)',
                  descAr: 'أسئلة المساء الستة من كتاب الأساسيات وقوائم الامتنان اليومي.',
                  descEn: 'The 6 Big Book evening questions and daily positive gratitude reflections.',
                  boxKey: 'nightly_reviews',
                  isAr: isAr,
                ),
                const SizedBox(height: 10),
                _buildEncryptedBoxCard(
                  nameAr: 'دليل الموجه ورفاق التعافي (Directory)',
                  nameEn: 'Sponsor & Fellowship Directory',
                  descAr: 'أرقام هواتف المشرف والرفاق للتواصل والاتصال الفوري وقت الأزمات.',
                  descEn: 'Contact numbers for urgent Step 10 crisis and accountability reach-out.',
                  boxKey: 'recovery_contacts',
                  isAr: isAr,
                ),
                const SizedBox(height: 28),

                // زر قفل التطبيق فورياً للتجربة
                if (securityNotifier.isLockEnabled) ...[
                  ElevatedButton.icon(
                    onPressed: () {
                      securityNotifier.lockNow();
                      Navigator.of(context).pop();
                    },
                    icon: const Icon(Icons.lock_rounded),
                    label: Text(isAr ? 'قفل التطبيق الآن واختبار الشاشة' : 'Lock App Now & Test Screen'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                  const SizedBox(height: 14),
                ],

                // زر مسح أمني طارئ
                OutlinedButton.icon(
                  onPressed: () => _confirmEmergencyWipe(context, isAr),
                  icon: const Icon(Icons.delete_forever_rounded, color: Color(0xFFEF4444)),
                  label: Text(
                    isAr ? 'مسح أمني طارئ لكافة البيانات المشفرة' : 'Emergency Local Data Wipe',
                    style: const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFEF4444), width: 1.2),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildPrivacyHeader(bool isAr) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF101928),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.shield_rounded, color: Color(0xFF10B981), size: 28),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isAr ? 'خصوصية مطلقة (Zero Knowledge Vault)' : 'Absolute Privacy (Zero Knowledge)',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 4),
                Text(
                  isAr
                      ? 'جميع سجلات الخطوة الرابعة ومراجعات المساء ودليل الرفاق مشفرة محلياً بمفتاح AES-256 داخل مستودع المفاتيح الآمن في جهازك. لا تخرج أي بيانات خارج الجهاز.'
                      : 'All Step 4 inventories, nightly diaries, and contacts are encrypted on-device via AES-256 in your secure keystore.',
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12, height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader({required String title, required IconData icon, required Color color}) {
    return Row(
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
        ),
      ],
    );
  }

  Widget _buildEncryptedBoxCard({
    required String nameAr,
    required String nameEn,
    required String descAr,
    required String descEn,
    required String boxKey,
    required bool isAr,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                isAr ? nameAr : nameEn,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'AES-256',
                  style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            isAr ? descAr : descEn,
            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
          ),
        ],
      ),
    );
  }

  void _showChangePinDialog(BuildContext context, bool isAr) {
    final oldPinCtrl = TextEditingController();
    final newPinCtrl = TextEditingController();
    final confirmPinCtrl = TextEditingController();
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (ctx) => Directionality(
        textDirection: isAr ? TextDirection.rtl : TextDirection.ltr,
        child: AlertDialog(
          backgroundColor: const Color(0xFF131A26),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            isAr ? 'تغيير رمز المرور المكون من 4 أرقام' : 'Change 4-Digit PIN',
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          content: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: oldPinCtrl,
                  obscureText: true,
                  keyboardType: TextInputType.number,
                  maxLength: 4,
                  style: const TextStyle(color: Colors.white, letterSpacing: 8, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    labelText: isAr ? 'الرمز الحالي *' : 'Current PIN *',
                    labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                    filled: true,
                    fillColor: const Color(0xFF0B0F17),
                  ),
                  validator: (val) => val == null || val.length != 4
                      ? (isAr ? 'أدخل 4 أرقام' : 'Enter 4 digits')
                      : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: newPinCtrl,
                  obscureText: true,
                  keyboardType: TextInputType.number,
                  maxLength: 4,
                  style: const TextStyle(color: Colors.white, letterSpacing: 8, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    labelText: isAr ? 'الرمز الجديد (4 أرقام) *' : 'New PIN (4 digits) *',
                    labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                    filled: true,
                    fillColor: const Color(0xFF0B0F17),
                  ),
                  validator: (val) => val == null || val.length != 4
                      ? (isAr ? 'أدخل 4 أرقام' : 'Enter 4 digits')
                      : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: confirmPinCtrl,
                  obscureText: true,
                  keyboardType: TextInputType.number,
                  maxLength: 4,
                  style: const TextStyle(color: Colors.white, letterSpacing: 8, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                  decoration: InputDecoration(
                    labelText: isAr ? 'تأكيد الرمز الجديد *' : 'Confirm New PIN *',
                    labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                    filled: true,
                    fillColor: const Color(0xFF0B0F17),
                  ),
                  validator: (val) {
                    if (val != newPinCtrl.text) {
                      return isAr ? 'الرمزان غير متطابقين' : 'PINs do not match';
                    }
                    return null;
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text(isAr ? 'إلغاء' : 'Cancel', style: const TextStyle(color: Color(0xFF94A3B8))),
            ),
            ElevatedButton(
              onPressed: () async {
                if (formKey.currentState?.validate() ?? false) {
                  final success = await securityNotifier.changePin(
                    oldPin: oldPinCtrl.text,
                    newPin: newPinCtrl.text,
                  );
                  if (success) {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(isAr ? 'تم تحديث رمز المرور بنجاح!' : 'PIN updated successfully!'),
                        backgroundColor: const Color(0xFF10B981),
                      ),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(isAr ? 'الرمز الحالي غير صحيح' : 'Current PIN is incorrect'),
                        backgroundColor: const Color(0xFFEF4444),
                      ),
                    );
                  }
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
              child: Text(isAr ? 'حفظ الرمز' : 'Save PIN'),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmEmergencyWipe(BuildContext context, bool isAr) {
    showDialog(
      context: context,
      builder: (ctx) => Directionality(
        textDirection: isAr ? TextDirection.rtl : TextDirection.ltr,
        child: AlertDialog(
          backgroundColor: const Color(0xFF131A26),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            isAr ? 'تأكيد المسح الأمني الطارئ' : 'Confirm Emergency Wipe',
            style: const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold),
          ),
          content: Text(
            isAr
                ? 'تحذير: سيتم حذف جميع الخزائن المشفرة (الخطوة 4، مراجعات المساء، دليل الرفاق) نهائياً من هذا الجهاز ولا يمكن استرجاعها.'
                : 'Warning: This will permanently delete all encrypted boxes (Step 4, nightly reviews, contacts) from this device.',
            style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text(isAr ? 'إلغاء' : 'Cancel', style: const TextStyle(color: Color(0xFF94A3B8))),
            ),
            ElevatedButton(
              onPressed: () async {
                await storageService.emergencyWipeAllData();
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(isAr ? 'تم مسح كافة البيانات المشفرة بأمان' : 'Encrypted vault wiped cleanly'),
                    backgroundColor: const Color(0xFFEF4444),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444)),
              child: Text(isAr ? 'نعم، امسح كل شيء' : 'Yes, Wipe Everything'),
            ),
          ],
        ),
      ),
    );
  }
}
`
  }
];


