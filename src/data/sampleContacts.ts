import { DirectoryContact } from '../types/recovery';

export const SAMPLE_CONTACTS: DirectoryContact[] = [
  {
    id: 'sponsor-primary',
    name: 'أحمد بن عبد الله (الموجه الروحي - Sponsor)',
    phone: '+966501234567',
    role: 'sponsor',
    cleanTime: '7 سنوات من التعافي',
    notes: 'موجهي الروحي الذي أراجع معه الخطوات وفحص الضمير اليومي ص 84 وص 86.',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'fellow-1',
    name: 'خالد المنصور',
    phone: '+966552345678',
    role: 'fellow',
    cleanTime: 'سنتان من اليقظة',
    notes: 'رفيق درب مخلص نحضر معاً اجتماعات التعافي الأسبوعية.',
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
  },
  {
    id: 'fellow-2',
    name: 'عمر السبيعي',
    phone: '+966563456789',
    role: 'fellow',
    cleanTime: '9 أشهر نقاء',
    notes: 'نتشارك الاتصال الصباحي اليومي لتعزيز المساءلة واليقظة.',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'fellow-3',
    name: 'طارق الهاشمي',
    phone: '+966544567890',
    role: 'fellow',
    cleanTime: 'عام ونصف',
    notes: 'زميل موثوق لكسر العزلة عند التعرض لمشاعر ضاغطة.',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];
