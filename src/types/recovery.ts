export type Locale = 'ar' | 'en';

export type TimerDisplayMode = 'circular' | 'linear';

export interface SobrietyTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
}

export interface Quote {
  id: string;
  quoteAr: string;
  quoteEn: string;
  authorAr: string;
  authorEn: string;
  sourceAr: string;
  sourceEn: string;
  theme: 'denial' | 'shame' | 'spiritual' | 'surrender' | 'healing';
}

export interface SpiritualMetrics {
  peaceOfMind: number; // 0 to 100
  honestyWithSelf: number; // 0 to 100
  surrenderWillingness: number; // 0 to 100
  serviceConnection: number; // 0 to 100
}

export interface AmendItem {
  id: string;
  person: string;
  wrongCommitted: string;
  actionRequired: string;
  completed: boolean;
  createdAt: string;
}

export interface SponsorInfo {
  name: string;
  phone: string;
  relationship: string;
}

export type ContactRole = 'sponsor' | 'fellow';

export interface DirectoryContact {
  id: string;
  name: string;
  phone: string;
  role: ContactRole;
  cleanTime?: string;
  notes?: string;
  createdAt: string;
}

export type InventoryType = 'resentment' | 'fear' | 'sex' | 'harms';

export type AffectedInstinct =
  | 'self_esteem'
  | 'financial_security'
  | 'emotional_security'
  | 'ambitions'
  | 'personal_relations'
  | 'sex_relations';

export type MyPartDefect =
  | 'selfish'
  | 'dishonest'
  | 'self_seeking'
  | 'fearing'
  | 'inconsiderate';

export interface Step4Entry {
  id: string;
  type: InventoryType;
  target: string; // Column 1: Who or what (الطرف أو الموقف)
  cause: string; // Column 2: Exact cause (السبب المباشر)
  affectedInstincts: AffectedInstinct[]; // Column 3: Affects My (ما يمسه في غرائزي)
  myPartDefects: MyPartDefect[]; // Column 4: My Part checklists (الأنانية، الكذب، الخوف، إلخ)
  myPartReflection: string; // Column 4: Reflection text area (تحليل دوري الصادق)
  createdAt: string;
}

export interface NightlyReviewEntry {
  id: string;
  date: string;
  // Big Book Page 86 Questions:
  wasResentfulDishonestAfraidJealous: boolean;
  resentmentNotes: string;
  oweApology: boolean;
  apologyNotes: string;
  keptSecretToDiscuss: boolean;
  secretNotes: string;
  wereKindAndLoving: boolean;
  thinkingOfSelfMostOfTime: boolean;
  whatCouldWeDoBetter: string;
  // Step 11 Gratitude & Meditation:
  gratitudeItems: string[];
  meditationReflection: string;
  overallPeaceScore: number; // 0 - 100
}
