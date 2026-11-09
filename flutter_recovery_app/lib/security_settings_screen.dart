import 'package:flutter/material.dart';
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
