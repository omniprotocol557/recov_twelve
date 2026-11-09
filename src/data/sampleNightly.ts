import { NightlyReviewEntry } from '../types/recovery';

export const SAMPLE_NIGHTLY_REVIEWS: NightlyReviewEntry[] = [
  {
    id: 'nightly-1',
    date: new Date(Date.now() - 86400000).toISOString(),
    wasResentfulDishonestAfraidJealous: false,
    resentmentNotes: '',
    oweApology: true,
    apologyNotes: 'اعتذار لأخي الصغير عن التسرع في نهره مساءً.',
    keptSecretToDiscuss: false,
    secretNotes: '',
    wereKindAndLoving: true,
    thinkingOfSelfMostOfTime: false,
    whatCouldWeDoBetter: 'الإنصات أكثر قبل إبداء الرأي، وعدم الانشغال بالهاتف وقت الجلسة العائلية.',
    gratitudeItems: [
      'الاستيقاظ بكامل الوعي والسكينة دون صداع أو ندم الأمس',
      'مكالمة هاتفية دافئة مع زميل في التعافي',
      'فرصة العمل والإنجاز بصدق اليوم'
    ],
    meditationReflection: 'شعرت بتسليم حقيقي حين صليت صلاة الصباح طالباً التوجيه، وابتعدت عن القلق بشأن المستقبل.',
    overallPeaceScore: 85
  }
];

export const STEP_11_BIG_BOOK_EXCERPT = {
  quoteAr: 'عند الاستيقاظ نفكر في الأربع والعشرين ساعة المقبلة. نفكر في خططنا لهذا اليوم. قبل أن نبدأ، نطلب من الله أن يوجه تفكيرنا، وخاصة أن يخلصه من الشفقة على الذات، والدوافع غير الأمينة أو الأنانية.',
  quoteEn: 'On awakening let us think about the twenty-four hours ahead. We consider our plans for the day. Before we begin, we ask God to direct our thinking, especially asking that it be divorced from self-pity, dishonest or self-seeking motives.',
  sourceAr: 'الكتاب الكبير (صفحة 86)',
  sourceEn: 'Alcoholics Anonymous Big Book (Page 86)'
};

export const STEP_11_PRAYER = {
  ar: '«اللهم وجه أفكاري اليوم، وطهرها من الشفقة على الذات، ومن عدم الأمانة، ومن السعي الأناني وراء مصلحتي. وامنحني الإلهام والتوجيه لما ينبغي أن أقوم به، وما هو الإجراء الصائب التالي»',
  en: '"God, direct my thinking today, especially that it be divorced from self-pity, dishonest or self-seeking motives. Grant me inspiration and intuitive guidance on what the next right action should be."'
};
