import 'package:flutter/foundation.dart';

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
