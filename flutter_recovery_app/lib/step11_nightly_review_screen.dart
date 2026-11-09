import 'dart:async';
import 'package:flutter/material.dart';
import 'step11_models.dart';

class Step11NightlyReviewScreen extends StatefulWidget {
  const Step11NightlyReviewScreen({super.key});

  @override
  State<Step11NightlyReviewScreen> createState() => _Step11NightlyReviewScreenState();
}

class _Step11NightlyReviewScreenState extends State<Step11NightlyReviewScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  late final Step11StateNotifier _notifier;

  // Question Form States (Big Book Page 86)
  bool _wasResentful = false;
  final _resentmentController = TextEditingController();
  bool _oweApology = false;
  final _apologyController = TextEditingController();
  bool _keptSecret = false;
  final _secretController = TextEditingController();
  bool _wereKind = true;
  bool _thinkingOfSelf = false;
  final _betterController = TextEditingController();

  // Gratitude input
  final _gratitudeController = TextEditingController();

  // 1-Minute Meditation Timer
  Timer? _meditationTimer;
  int _meditationSeconds = 60;
  bool _isMeditating = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _notifier = Step11StateNotifier();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _notifier.dispose();
    _resentmentController.dispose();
    _apologyController.dispose();
    _secretController.dispose();
    _betterController.dispose();
    _gratitudeController.dispose();
    _meditationTimer?.cancel();
    super.dispose();
  }

  int _calculatePeaceScore() {
    int score = 100;
    if (_wasResentful) score -= 25;
    if (_oweApology) score -= 20;
    if (_keptSecret) score -= 20;
    if (!_wereKind) score -= 20;
    if (_thinkingOfSelf) score -= 15;
    return score.clamp(10, 100);
  }

  void _saveReview(bool isAr) {
    final score = _calculatePeaceScore();
    final review = NightlyReview(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      date: DateTime.now(),
      wasResentful: _wasResentful,
      resentmentNotes: _resentmentController.text.trim(),
      oweApology: _oweApology,
      apologyNotes: _apologyController.text.trim(),
      keptSecret: _keptSecret,
      secretNotes: _secretController.text.trim(),
      wereKindAndLoving: _wereKind,
      thinkingOfSelf: _thinkingOfSelf,
      whatCouldWeDoBetter: _betterController.text.trim(),
      gratitudeItems: _notifier.currentGratitudeItems,
      peaceScore: score,
    );

    _notifier.saveReview(review);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(isAr ? 'تم حفظ مراجعة الليلة بنجاح!' : 'Nightly Review saved!'),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }

  void _startMeditationTimer() {
    setState(() {
      _isMeditating = true;
      _meditationSeconds = 60;
    });

    _meditationTimer?.cancel();
    _meditationTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_meditationSeconds > 1) {
        setState(() => _meditationSeconds--);
      } else {
        timer.cancel();
        setState(() {
          _isMeditating = false;
          _meditationSeconds = 60;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('اكتملت دقيقة التأمل والسكينة')),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return Scaffold(
      appBar: AppBar(
        title: Text(
          isAr ? 'مراجعة المساء والخطوة 11' : 'Nightly Review & Step 11',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF10B981),
          labelColor: const Color(0xFF10B981),
          unselectedLabelColor: const Color(0xFF94A3B8),
          tabs: [
            Tab(text: isAr ? 'مراجعة المساء (ص 86)' : 'Nightly Review'),
            Tab(text: isAr ? 'الخطوة 11 (الامتنان)' : 'Step 11 Gratitude'),
            Tab(text: isAr ? 'السجل السابق' : 'History'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildNightlyReviewTab(isAr),
          _buildStep11Tab(isAr),
          _buildHistoryTab(isAr),
        ],
      ),
    );
  }

  // 1. تبويب مراجعة المساء (الأسئلة الستة)
  Widget _buildNightlyReviewTab(bool isAr) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // كارت التوجيه
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131A26),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      isAr ? 'فحص الضمير المسائي (ص 86)' : 'Evening Review (p. 86)',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    Text(
                      '\${_calculatePeaceScore()}%',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF10B981),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  isAr
                    ? '«عندما نأوي إلى فراشنا ليلاً، نراجع يومنا بشكل بنّاء دون الانزلاق إلى لوم الذات أو القلق»'
                    : '"When we retire at night, we constructively review our day without self-reproach."',
                  style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // السؤال 1: الاستياء والخوف
          _buildYesNoTile(
            question: isAr ? '1. هل كنا مستائين، غير مخلصين، خائفين، أو غيورين؟' : '1. Were we resentful, dishonest, afraid, or jealous?',
            value: _wasResentful,
            onChanged: (v) => setState(() => _wasResentful = v),
            isAr: isAr,
            noteController: _wasResentful ? _resentmentController : null,
            noteHint: isAr ? 'حدد الاستياء أو الخوف المكتوم...' : 'Detail the resentment or fear...',
          ),
          const SizedBox(height: 12),

          // السؤال 2: الاعتذار
          _buildYesNoTile(
            question: isAr ? '2. هل ندين باعتذار لأحد؟' : '2. Do we owe an apology?',
            value: _oweApology,
            onChanged: (v) => setState(() => _oweApology = v),
            isAr: isAr,
            noteController: _oweApology ? _apologyController : null,
            noteHint: isAr ? 'لمن تدين بالاعتذار، وما هو التصحيح؟' : 'Who and what apology is owed?',
          ),
          const SizedBox(height: 12),

          // السؤال 3: شيء مكتوم
          _buildYesNoTile(
            question: isAr ? '3. هل احتفظنا بشيء لأنفسنا كان يجب مناقشته فوراً؟' : '3. Have we kept something to ourselves which should be discussed at once?',
            value: _keptSecret,
            onChanged: (v) => setState(() => _keptSecret = v),
            isAr: isAr,
            noteController: _keptSecret ? _secretController : null,
            noteHint: isAr ? 'ما هو الأمر الذي يحتاج لمصارحة؟' : 'What needs discussion?',
          ),
          const SizedBox(height: 12),

          // السؤال 4: المحبة والطيبة
          _buildYesNoTile(
            question: isAr ? '4. هل كنا طيبين ومحبين مع الجميع؟' : '4. Were we kind and loving toward all?',
            value: _wereKind,
            onChanged: (v) => setState(() => _wereKind = v),
            isAr: isAr,
          ),
          const SizedBox(height: 12),

          // السؤال 5: التفكير في النفس
          _buildYesNoTile(
            question: isAr ? '5. هل كنا نفكر في أنفسنا معظم الوقت؟' : '5. Were we thinking of ourselves most of the time?',
            value: _thinkingOfSelf,
            onChanged: (v) => setState(() => _thinkingOfSelf = v),
            isAr: isAr,
          ),
          const SizedBox(height: 12),

          // السؤال 6: ما الذي كان بإمكاننا فعله أفضل؟
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131A26),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isAr ? '6. ما الذي كان بإمكاننا فعله بشكل أفضل؟' : '6. What could we have done better?',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _betterController,
                  maxLines: 2,
                  decoration: InputDecoration(
                    hintText: isAr ? 'خلاصة هادئة وبناءة لدروس اليوم...' : 'Constructive takeaways for tomorrow...',
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // زر حفظ مراجعة المساء
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            icon: const Icon(Icons.save),
            label: Text(
              isAr ? 'حفظ مراجعة الليلة (ص 86)' : 'Save Nightly Review',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            onPressed: () => _saveReview(isAr),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildYesNoTile({
    required String question,
    required bool value,
    required ValueChanged<bool> onChanged,
    required bool isAr,
    TextEditingController? noteController,
    String? noteHint,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  question,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                ),
              ),
              Row(
                children: [
                  ChoiceChip(
                    label: Text(isAr ? 'نعم' : 'Yes'),
                    selected: value,
                    selectedColor: const Color(0xFF10B981),
                    onSelected: (_) => onChanged(true),
                  ),
                  const SizedBox(width: 6),
                  ChoiceChip(
                    label: Text(isAr ? 'لا' : 'No'),
                    selected: !value,
                    selectedColor: const Color(0xFF334155),
                    onSelected: (_) => onChanged(false),
                  ),
                ],
              ),
            ],
          ),
          if (noteController != null) ...[
            const SizedBox(height: 8),
            TextField(
              controller: noteController,
              decoration: InputDecoration(
                hintText: noteHint,
                filled: true,
                fillColor: const Color(0xFF0F172A),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
            ),
          ],
        ],
      ),
    );
  }

  // 2. تبويب الخطوة 11 (الامتنان والتأمل)
  Widget _buildStep11Tab(bool isAr) {
    return ListenableBuilder(
      listenable: _notifier,
      builder: (context, _) {
        final items = _notifier.currentGratitudeItems;

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // كارت دعاء ص 86
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF131A26),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.wb_sunny_outlined, color: Color(0xFF10B981), size: 32),
                    const SizedBox(height: 10),
                    Text(
                      isAr ? 'توجيه الفكر الصباحي (ص 86)' : 'Step 11 Morning Meditation',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      isAr
                        ? '«اللهم وجه أفكاري اليوم، وطهرها من الشفقة على الذات، ومن عدم الأمانة، ومن السعي الأناني وراء مصلحتي الشخصية»'
                        : '"God, direct my thinking today; especially divorce it from self-pity, dishonesty, or self-seeking motives."',
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 13, height: 1.6, color: Color(0xFFCBD5E1)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // قسم الامتنان: ما الذي أنا ممتن له اليوم؟
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF131A26),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.favorite, color: Colors.redAccent, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          isAr ? 'ما الذي أنا ممتن له اليوم؟' : 'What am I grateful for today?',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _gratitudeController,
                            decoration: InputDecoration(
                              hintText: isAr ? 'أضف نعمة ممتن لها اليوم...' : 'Add a blessing...',
                              filled: true,
                              fillColor: const Color(0xFF0F172A),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filled(
                          style: IconButton.filled(backgroundColor: const Color(0xFF10B981)),
                          icon: const Icon(Icons.add),
                          onPressed: () {
                            _notifier.addGratitudeItem(_gratitudeController.text);
                            _gratitudeController.clear();
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: items.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 6),
                      itemBuilder: (context, idx) {
                        return ListTile(
                          tileColor: const Color(0xFF0F172A),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          leading: const Icon(Icons.check_circle, size: 18, color: Color(0xFF10B981)),
                          title: Text(items[idx], style: const TextStyle(fontSize: 13)),
                          trailing: IconButton(
                            icon: const Icon(Icons.close, size: 16, color: Color(0xFF64748B)),
                            onPressed: () => _notifier.removeGratitudeItem(idx),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // دقيقة التأمل والصمت
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF131A26),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF0284C7).withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isAr ? 'دقيقة الصمت والإنصات الداخلي' : '1-Minute Silent Listening',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        Text(
                          isAr ? 'الصمت لطلب الإلهام والإرشاد الصائب' : 'Quiet mind to seek right inspiration',
                          style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Text(
                          '\$_meditationSeconds s',
                          style: const TextStyle(fontFamily: 'monospace', fontSize: 16, color: Color(0xFF38BDF8)),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filled(
                          style: IconButton.filled(backgroundColor: const Color(0xFF0284C7)),
                          icon: Icon(_isMeditating ? Icons.hourglass_bottom : Icons.play_arrow),
                          onPressed: _isMeditating ? null : _startMeditationTimer,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // 3. تبويب السجل السابق
  Widget _buildHistoryTab(bool isAr) {
    return ListenableBuilder(
      listenable: _notifier,
      builder: (context, _) {
        final history = _notifier.history;

        if (history.isEmpty) {
          return Center(
            child: Text(
              isAr ? 'لا توجد مراجعات مسائية محفوظة' : 'No saved nightly reviews',
              style: const TextStyle(color: Color(0xFF64748B)),
            ),
          );
        }

        return ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: history.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, idx) {
            final item = history[idx];
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '\${item.date.year}/\${item.date.month}/\${item.date.day}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        '\${item.peaceScore}%',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  if (item.oweApology && item.apologyNotes.isNotEmpty)
                    Text(
                      isAr ? 'الاعتذار: \${item.apologyNotes}' : 'Apology: \${item.apologyNotes}',
                      style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 12),
                    ),
                  if (item.whatCouldWeDoBetter.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      isAr ? 'الأفضل غداً: \${item.whatCouldWeDoBetter}' : 'Better tomorrow: \${item.whatCouldWeDoBetter}',
                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }
}
