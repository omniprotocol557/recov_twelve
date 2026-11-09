import 'package:flutter/foundation.dart';

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
