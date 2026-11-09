import 'package:flutter/material.dart';
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
