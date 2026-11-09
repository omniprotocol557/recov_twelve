import 'package:flutter/material.dart';
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
