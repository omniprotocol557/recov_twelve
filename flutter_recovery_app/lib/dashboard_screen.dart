import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'spiritual_state.dart';
import 'step10_sheet.dart';
import 'main.dart';

class DashboardScreen extends StatefulWidget {
  final RecoveryStateNotifier? notifier;
  final bool showAppBar;

  const DashboardScreen({
    super.key,
    this.notifier,
    this.showAppBar = true,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late final RecoveryStateNotifier _notifier;
  bool _isLocalNotifier = false;

  @override
  void initState() {
    super.initState();
    if (widget.notifier != null) {
      _notifier = widget.notifier!;
      _isLocalNotifier = false;
    } else {
      _notifier = RecoveryStateNotifier();
      _isLocalNotifier = true;
    }
  }

  @override
  void dispose() {
    if (_isLocalNotifier) {
      _notifier.dispose();
    }
    super.dispose();
  }

  void _openStep10Sheet() {
    HapticFeedback.mediumImpact();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Step10BottomSheet(notifier: _notifier),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return ListenableBuilder(
      listenable: _notifier,
      builder: (context, _) {
        final time = _notifier.elapsedTime;
        final quote = _notifier.currentQuote;
        final score = _notifier.spiritualFitnessScore;

        Widget content = SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. عداد التعافي المطور للموبايل (دائري أو خطي بحجم متجاوب)
              _buildMobileTimerCard(context, time, isAr),
              const SizedBox(height: 14),

              // 2. ميزان اللياقة الروحية اليومي (ص 84) بأشرطة لمسية مريحة للإبهام
              _buildSpiritualMeterCard(context, score, isAr),
              const SizedBox(height: 14),

              // 3. صندوق تأملات د. عماد رشاد عثمان الداعم للسحب بالإصبع (Swipe)
              _buildSwipeableQuoteBox(context, quote, isAr),

              // مساحة أمان سفلية لعدم حجب المحتوى بواسطة شريط التنقل وزر الخطوة 10
              const SizedBox(height: 100),
            ],
          ),
        );

        if (!widget.showAppBar) {
          return content;
        }

        return Scaffold(
          backgroundColor: const Color(0xFF0B0F17),
          appBar: AppBar(
            title: Text(
              isAr ? 'ميزان التعافي الروحي' : 'Spiritual Recovery Meter',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            actions: [
              IconButton(
                tooltip: isAr ? 'تبديل شكل العداد' : 'Toggle timer view',
                icon: Icon(_notifier.isCircularTimer ? Icons.linear_scale : Icons.timelapse),
                onPressed: () {
                  HapticFeedback.selectionClick();
                  _notifier.toggleTimerMode();
                },
              ),
              IconButton(
                tooltip: isAr ? 'تغيير اللغة' : 'Change Language',
                icon: const Icon(Icons.language),
                onPressed: () => SpiritualRecoveryApp.of(context).toggleLocale(),
              ),
            ],
          ),
          body: content,
          floatingActionButton: FloatingActionButton.extended(
            onPressed: _openStep10Sheet,
            backgroundColor: const Color(0xFF10B981),
            foregroundColor: Colors.white,
            elevation: 8,
            icon: const Icon(Icons.bolt_rounded, size: 22),
            label: Text(
              isAr ? 'الخطوة 10 الفورية (ص 84)' : 'Step 10 Instant',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        );
      },
    );
  }

  Widget _buildMobileTimerCard(BuildContext context, SobrietyTime time, bool isAr) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.timelapse_rounded, size: 16, color: Color(0xFF10B981)),
                  const SizedBox(width: 6),
                  Text(
                    isAr ? 'مدة النقاء واليقظة اليومية' : 'Sober Time & Clarity',
                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Row(
                children: [
                  InkWell(
                    borderRadius: BorderRadius.circular(8),
                    onTap: () {
                      HapticFeedback.selectionClick();
                      _notifier.toggleTimerMode();
                    },
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                      child: Icon(
                        _notifier.isCircularTimer ? Icons.linear_scale_rounded : Icons.timelapse_rounded,
                        size: 18,
                        color: const Color(0xFF06B6D4),
                      ),
                    ),
                  ),
                  const SizedBox(width: 4),
                  InkWell(
                    borderRadius: BorderRadius.circular(8),
                    onTap: _pickStartDate,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: Row(
                        children: [
                          const Icon(Icons.edit_calendar_rounded, size: 14, color: Color(0xFF10B981)),
                          const SizedBox(width: 4),
                          Text(
                            isAr ? 'تعديل' : 'Edit',
                            style: const TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_notifier.isCircularTimer)
            _buildResponsiveCircularTimer(context, time, isAr)
          else
            _buildResponsiveLinearTimer(time, isAr),
        ],
      ),
    );
  }

  Widget _buildResponsiveCircularTimer(BuildContext context, SobrietyTime time, bool isAr) {
    final screenWidth = MediaQuery.of(context).size.width;
    // حجم متجاوب لا يتجاوز شاشات الموبايل الصغيرة
    final diameter = (screenWidth * 0.44).clamp(150.0, 190.0);

    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: diameter,
              height: diameter,
              child: CircularProgressIndicator(
                value: (time.hours * 3600 + time.minutes * 60 + time.seconds) / 86400,
                strokeWidth: 9,
                backgroundColor: const Color(0xFF1E293B),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
              ),
            ),
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '\${time.days}',
                  style: TextStyle(
                    fontSize: diameter * 0.26,
                    fontWeight: FontWeight.bold,
                    height: 1.0,
                    color: Colors.white,
                  ),
                ),
                Text(
                  isAr ? 'يوماً مباركاً' : 'Days Clean',
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 14),
        // بطاقات الساعات والدقائق والثواني للموبايل
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _timePill('\${time.hours}', isAr ? 'ساعة' : 'Hrs'),
            const SizedBox(width: 8),
            _timePill('\${time.minutes}', isAr ? 'دقيقة' : 'Mins'),
            const SizedBox(width: 8),
            _timePill('\${time.seconds}', isAr ? 'ثانية' : 'Secs'),
          ],
        ),
      ],
    );
  }

  Widget _timePill(String value, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value.padLeft(2, '0'),
            style: const TextStyle(
              fontFamily: 'monospace',
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: Color(0xFF38BDF8),
            ),
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
          ),
        ],
      ),
    );
  }

  Widget _buildResponsiveLinearTimer(SobrietyTime time, bool isAr) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _timeSegment('\${time.days}', isAr ? 'أيام' : 'Days'),
            _timeSegment('\${time.hours}', isAr ? 'ساعات' : 'Hours'),
            _timeSegment('\${time.minutes}', isAr ? 'دقائق' : 'Mins'),
            _timeSegment('\${time.seconds}', isAr ? 'ثوانٍ' : 'Secs'),
          ],
        ),
        const SizedBox(height: 14),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: (time.hours * 60 + time.minutes) / 1440,
            minHeight: 8,
            backgroundColor: const Color(0xFF1E293B),
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
          ),
        ),
      ],
    );
  }

  Widget _timeSegment(String value, String label) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
      ],
    );
  }

  Widget _buildSpiritualMeterCard(BuildContext context, double score, bool isAr) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF131A26),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.speed_rounded, size: 18, color: Color(0xFF10B981)),
                  const SizedBox(width: 8),
                  Text(
                    isAr ? 'ميزان اللياقة الروحية اليومي' : 'Spiritual Fitness Meter',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: (score >= 70 ? const Color(0xFF10B981) : const Color(0xFFF59E0B)).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: (score >= 70 ? const Color(0xFF10B981) : const Color(0xFFF59E0B)).withOpacity(0.4),
                  ),
                ),
                child: Text(
                  '\${score.toInt()}%',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: score >= 70 ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            isAr
                ? 'وفق الصفحة 84: سلامتنا مشروطة بصيانة لياقتنا الروحية اليومية'
                : 'Page 84: A daily reprieve contingent on spiritual fitness',
            style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
          ),
          const SizedBox(height: 14),
          _metricSlider(isAr ? 'السكينة والسلام الداخلي' : 'Serenity', _notifier.serenity, (v) => _notifier.updateMetrics(serenity: v)),
          _metricSlider(isAr ? 'الصدق مع الذات' : 'Honesty', _notifier.honesty, (v) => _notifier.updateMetrics(honesty: v)),
          _metricSlider(isAr ? 'الاستعداد والتسليم' : 'Surrender', _notifier.surrender, (v) => _notifier.updateMetrics(surrender: v)),
          _metricSlider(isAr ? 'عطاء الخدمة والصلة' : 'Service', _notifier.service, (v) => _notifier.updateMetrics(service: v)),
        ],
      ),
    );
  }

  Widget _metricSlider(String label, double value, ValueChanged<double> onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFFCBD5E1))),
              Text('\${value.toInt()}%', style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
            ],
          ),
          SliderTheme(
            data: SliderTheme.of(context).copyWith(
              thumbColor: const Color(0xFF10B981),
              activeTrackColor: const Color(0xFF10B981),
              inactiveTrackColor: const Color(0xFF1E293B),
              trackHeight: 4,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 7),
            ),
            child: Slider(
              value: value,
              min: 0,
              max: 100,
              onChanged: onChanged,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSwipeableQuoteBox(BuildContext context, QuoteModel quote, bool isAr) {
    return GestureDetector(
      onHorizontalDragEnd: (details) {
        if (details.primaryVelocity != null && details.primaryVelocity!.abs() > 100) {
          HapticFeedback.selectionClick();
          _notifier.nextQuote();
        }
      },
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: const Color(0xFF131A26),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: const Color(0xFF0284C7).withOpacity(0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.format_quote_rounded, color: Color(0xFF38BDF8), size: 20),
                    const SizedBox(width: 8),
                    Text(
                      isAr ? 'تأملات د. عماد رشاد عثمان' : 'Dr. Emad Rashad Series',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF38BDF8)),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.refresh_rounded, size: 18, color: Color(0xFF94A3B8)),
                  onPressed: () {
                    HapticFeedback.selectionClick();
                    _notifier.nextQuote();
                  },
                  tooltip: isAr ? 'حكمة أخرى' : 'Next Quote',
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              isAr ? quote.textAr : quote.textEn,
              style: const TextStyle(fontSize: 13, height: 1.6, color: Color(0xFFE2E8F0)),
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '— \${quote.author} (\${quote.book})',
                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontStyle: FontStyle.italic),
                ),
                Text(
                  isAr ? 'اسحب للمزيد ←' : 'Swipe for next →',
                  style: const TextStyle(fontSize: 10, color: Color(0xFF475569)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickStartDate() async {
    HapticFeedback.lightImpact();
    final picked = await showDatePicker(
      context: context,
      initialDate: _notifier.startDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: Color(0xFF10B981),
              surface: Color(0xFF131A26),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      _notifier.setStartDate(picked);
    }
  }
}
