import 'package:flutter/material.dart';
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
