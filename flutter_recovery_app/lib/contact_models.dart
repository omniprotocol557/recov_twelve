import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';

/// أدوار جهات الاتصال في شبكة التعافي
enum ContactRole {
  sponsor, // الموجه / الكفيل
  fellow,  // زميل التعافي / رفيق الزمالة
}

extension ContactRoleExtension on ContactRole {
  String get titleAr {
    switch (this) {
      case ContactRole.sponsor:
        return 'الموجه (Sponsor)';
      case ContactRole.fellow:
        return 'زميل تعافي (Fellowship Brother)';
    }
  }

  String get titleEn {
    switch (this) {
      case ContactRole.sponsor:
        return 'Sponsor';
      case ContactRole.fellow:
        return 'Fellowship Brother';
    }
  }
}

/// نموذج جهة اتصال شبكة التعافي والمحاسبة
class DirectoryContact {
  final String id;
  final String name;
  final String phone;
  final ContactRole role;
  final int? cleanDays;
  final String? notes;
  final DateTime createdAt;

  const DirectoryContact({
    required this.id,
    required this.name,
    required this.phone,
    required this.role,
    this.cleanDays,
    this.notes,
    required this.createdAt,
  });

  bool get isSponsor => role == ContactRole.sponsor;

  DirectoryContact copyWith({
    String? id,
    String? name,
    String? phone,
    ContactRole? role,
    int? cleanDays,
    String? notes,
    DateTime? createdAt,
  }) {
    return DirectoryContact(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      cleanDays: cleanDays ?? this.cleanDays,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'phone': phone,
    'role': role.name,
    'cleanDays': cleanDays,
    'notes': notes,
    'createdAt': createdAt.toIso8601String(),
  };

  factory DirectoryContact.fromJson(Map<String, dynamic> json) {
    return DirectoryContact(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      role: json['role'] == 'sponsor' ? ContactRole.sponsor : ContactRole.fellow,
      cleanDays: json['cleanDays'] as int?,
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}

/// مدير حالة جهات الاتصال والتواصل الفوري
class ContactsNotifier extends ChangeNotifier {
  List<DirectoryContact> _contacts = [
    DirectoryContact(
      id: 'sponsor-primary',
      name: 'أحمد بن عبد الله (الموجه)',
      phone: '+966501234567',
      role: ContactRole.sponsor,
      cleanDays: 1825,
      notes: 'الموجه الأساسي لخطوات التعافي - متاح دائماً للأزمات الطارئة',
      createdAt: DateTime.now().subtract(const Duration(days: 365)),
    ),
    DirectoryContact(
      id: 'fellow-1',
      name: 'طارق المحمدي',
      phone: '+966559876543',
      role: ContactRole.fellow,
      cleanDays: 410,
      notes: 'رفيق المجموعة المسائية ومشارك قراءات كتاب الأساسيات',
      createdAt: DateTime.now().subtract(const Duration(days: 120)),
    ),
    DirectoryContact(
      id: 'fellow-2',
      name: 'سلطان الدوسري',
      phone: '+966541122334',
      role: ContactRole.fellow,
      cleanDays: 240,
      notes: 'رفيق المساندة اليومية والاتصال الصباحي',
      createdAt: DateTime.now().subtract(const Duration(days: 90)),
    ),
    DirectoryContact(
      id: 'fellow-3',
      name: 'فيصل العتيبي',
      phone: '+966567788990',
      role: ContactRole.fellow,
      cleanDays: 95,
      notes: 'شريك الصدق ومراجعة الخطوة الرابعة والعاشرة',
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
  ];

  List<DirectoryContact> get contacts => List.unmodifiable(_contacts);

  /// بطاقة الموجه المقفلة بالأعلى (The Locked Primary Sponsor)
  DirectoryContact? get primarySponsor {
    try {
      return _contacts.firstWhere((c) => c.role == ContactRole.sponsor);
    } catch (_) {
      return null;
    }
  }

  /// قائمة زملاء التعافي (Recovery Fellowship Brothers)
  List<DirectoryContact> get fellowshipBrothers {
    return _contacts.where((c) => c.role == ContactRole.fellow).toList();
  }

  /// إضافة جهة اتصال جديدة مع التحقق من ترقية الموجه
  void addContact({
    required String name,
    required String phone,
    required ContactRole role,
    int? cleanDays,
    String? notes,
  }) {
    final newContact = DirectoryContact(
      id: 'contact_\${DateTime.now().millisecondsSinceEpoch}',
      name: name.trim(),
      phone: phone.trim(),
      role: role,
      cleanDays: cleanDays,
      notes: notes?.trim(),
      createdAt: DateTime.now(),
    );

    if (role == ContactRole.sponsor) {
      // نقل الموجه القديم ليصبح زميل تعافي، ووضع الموجه الجديد بالأعلى
      _contacts = [
        newContact,
        ..._contacts.map((c) => c.role == ContactRole.sponsor
            ? c.copyWith(role: ContactRole.fellow)
            : c),
      ];
    } else {
      _contacts.add(newContact);
    }
    notifyListeners();
  }

  /// حذف جهة اتصال
  void deleteContact(String id) {
    _contacts.removeWhere((c) => c.id == id);
    notifyListeners();
  }

  /// ترقية جهة اتصال لتصبح الموجه الأساسي
  void makeSponsor(String id) {
    _contacts = _contacts.map((c) {
      if (c.id == id) {
        return c.copyWith(role: ContactRole.sponsor);
      } else if (c.role == ContactRole.sponsor) {
        return c.copyWith(role: ContactRole.fellow);
      }
      return c;
    }).toList();
    // إعادة ترتيب الموجه للأعلى
    final sponsorIndex = _contacts.indexWhere((c) => c.role == ContactRole.sponsor);
    if (sponsorIndex > 0) {
      final sponsor = _contacts.removeAt(sponsorIndex);
      _contacts.insert(0, sponsor);
    }
    notifyListeners();
  }

  /// تشغيل الاتصال الهاتفي السريع
  static Future<void> launchPhone(String phone) async {
    final cleanPhone = phone.replaceAll(RegExp(r'[^0-9+]'), '');
    final uri = Uri.parse('tel:\$cleanPhone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  /// تشغيل محادثة واتساب مع رسالة طارئة مسبقة الصياغة للخطوة 10
  static Future<void> launchWhatsApp(String phone, {String? customMessage}) async {
    final cleanPhone = phone.replaceAll(RegExp(r'[^0-9]'), '');
    final defaultMsg = Uri.encodeComponent(
      customMessage ?? 'السلام عليكم ورحمة الله، أحتاج إلى دقيقة من وقتك لمناقشة استياء أو اضطراب طارئ وفق الخطوة العاشرة.',
    );
    final uri = Uri.parse('https://wa.me/\$cleanPhone?text=\$defaultMsg');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}
