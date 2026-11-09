import 'dart:convert';
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
