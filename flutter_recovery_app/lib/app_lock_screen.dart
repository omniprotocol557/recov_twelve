import 'package:flutter/material.dart';
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
                        ? const Color(0xFF10B981).withOpacity(0.2)
                        : _isError
                            ? const Color(0xFFEF4444).withOpacity(0.2)
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
