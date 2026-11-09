import 'package:flutter/material.dart';
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
