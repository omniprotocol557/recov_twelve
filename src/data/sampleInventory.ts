import { Step4Entry } from '../types/recovery';

export const SAMPLE_STEP4_ENTRIES: Step4Entry[] = [
  {
    id: 'step4-1',
    type: 'resentment',
    target: 'مديري السابق في العمل (سعد)',
    cause: 'قام بنسب مجهودي في إنجاز المشروع الكبير لنفسه أمام الإدارة وتجاهل ترقيتي.',
    affectedInstincts: ['self_esteem', 'financial_security', 'ambitions'],
    myPartDefects: ['selfish', 'fearing', 'inconsiderate'],
    myPartReflection: 'كنت متكبراً وأردت الاستحواذ على كل المديح بمفردي. عندما شعرت بالتهديد، قاطعت الاجتماعات وتحدثت عنه بسوء في ظهره بدلاً من مواجهته بنضج وأمانة.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'step4-2',
    type: 'fear',
    target: 'الخوف من المستقبل المالي والإفلاس',
    cause: 'تراكم بعض الديون القديمة والشعور بأنني لن أستطيع توفير حياة كريمة لأسرتي.',
    affectedInstincts: ['financial_security', 'emotional_security', 'ambitions'],
    myPartDefects: ['dishonest', 'fearing', 'self_seeking'],
    myPartReflection: 'عدم توكلي الحقيقي على الله، واعتمادي الكامل على ذكائي الشخصي ومحاولة السيطرة على كل شيء، مع إخفاء وضعي المالي الحقيقي عن عائلتي بدافع الكبرياء.',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: 'step4-3',
    type: 'harms',
    target: 'صديقي المقرب (فيصل)',
    cause: 'اقترضت منه مبلغاً وتأخرت في سداده وتهربت من اتصالاته ورسائله لعدة أشهر.',
    affectedInstincts: ['personal_relations', 'self_esteem'],
    myPartDefects: ['dishonest', 'selfish', 'fearing'],
    myPartReflection: 'الجبن والهروب من الحقيقة؛ فضلت راحتي المؤقتة وتجنب الإحراج على حساب أمانة الصداقة وحقه المالي.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

export const INSTINCT_LABELS = {
  ar: {
    self_esteem: 'الكبرياء / تقدير الذات',
    financial_security: 'الأمان المالي والمادي',
    emotional_security: 'الأمان العاطفي والنفسي',
    ambitions: 'الطموحات والأهداف المستقبلية',
    personal_relations: 'العلاقات الشخصية والاجتماعية',
    sex_relations: 'العلاقات الحميمية والجنسية'
  },
  en: {
    self_esteem: 'Self-Esteem / Pride',
    financial_security: 'Financial Security',
    emotional_security: 'Emotional Security',
    ambitions: 'Future Ambitions',
    personal_relations: 'Personal Relations',
    sex_relations: 'Sex Relations'
  }
};

export const DEFECT_LABELS = {
  ar: {
    selfish: 'الأنانية (التمركز حول رغباتي)',
    dishonest: 'عدم الأمانة (الكذب والمراوغة)',
    self_seeking: 'التماس المصلحة الذاتية (الاستغلال)',
    fearing: 'الخوف (الرعب من الخسارة أو الانكشاف)',
    inconsiderate: 'عدم المراعاة (القسوة والتجاهل)'
  },
  en: {
    selfish: 'Selfish (Self-centered desires)',
    dishonest: 'Dishonest (Lies & evasion)',
    self_seeking: 'Self-seeking (Manipulation)',
    fearing: 'Fearing (Panic of loss / exposure)',
    inconsiderate: 'Inconsiderate (Harshness & neglect)'
  }
};

export const INVENTORY_TYPE_LABELS = {
  ar: {
    resentment: 'الاستياءات (Resentment)',
    fear: 'المخاوف (Fear)',
    sex: 'السلوك الجنسي (Sex Conduct)',
    harms: 'الأضرار (Harms)'
  },
  en: {
    resentment: 'Resentment',
    fear: 'Fear',
    sex: 'Sex Conduct',
    harms: 'Harms'
  }
};
