import 'dart:async';
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
