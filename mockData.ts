
import { Subject, Teacher, Course, Lecture } from './types';

export interface EnhancedSubject extends Subject {
  category: string;
  lessonsCount: number;
  progress: number;
  isNew?: boolean;
}

/** 
 * 🛠️ مساعد الوقت (لتبسيط الاختيارات)
 * ---------------------------------
 */

// 1. لتحديد الساعة "اليوم" (مثلاً الساعة 7 مساءً نكتب 19)
const todayAt = (hour: number) => {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

// 2. لتحديد عدد أيام من الآن (مثلاً بعد 30 يوم)
const afterDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

/** 
 * 🎫 لوحة تحكم الأكواد (سهلة التعديل)
 * ---------------------------------
 */
export const VALID_CODES = [
  { 
    code: '1111111', 
    studentName: 'أحمد علي', 
    expiryDate: afterDays(5), // صالح لمدة 5 يوم من الآن
    section: 'علمي علوم' 
  },
  { 
    code: '222', 
    studentName: 'سارة محمد', 
    expiryDate: todayAt(21), // ينتهي اليوم الساعة 9 مساءً (21 بنظام 24 ساعة)
    section: 'أدبي' 
  },
  { 
    code: '7', 
    studentName: 'تجربة الساعة 7', 
    expiryDate: todayAt(19), // ينتهي اليوم الساعة 7 مساءً (19 بنظام 24 ساعة)
    section: 'تجريبي' 
  },
];

/** 
 * 📚 المواد الدراسية
 */
export const subjects: EnhancedSubject[] = [
  { id: '1', name: 'العلوم', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400', category: 'العلمية', lessonsCount: 8, progress: 65 },
  { id: '2', name: 'الرياضيات', image: 'https://images.unsplash.com/photo-1509228468518-180dd48a5791?auto=format&fit=crop&q=80&w=400', category: 'العلمية', lessonsCount: 12, progress: 30, isNew: true },
  { id: '3', name: 'التاريخ', image: 'https://images.unsplash.com/photo-1461360228754-6e81c478c882?auto=format&fit=crop&q=80&w=400', category: 'الأدبية', lessonsCount: 15, progress: 85 },
  { id: '4', name: 'اللغة العربية', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400', category: 'الأدبية', lessonsCount: 20, progress: 10 },
]; 

/** 
 * 👨‍🏫 المدرسين
 */
export const teachers: Teacher[] = [
  { 
    id: 't1', 
    name: 'أ. محمد أحمد', 
    avatar: 'https://i.pravatar.cc/150?u=t1', 
    subjectId: '1', 
    rating: 4.8, 
    specialty: 'خبير الكيمياء' 
  },
  { 
    id: 't2', 
    name: 'أ. محمود حمدي', 
    avatar: 'https://i.pravatar.cc/150?u=t2', 
    subjectId: '1', 
    rating: 4.9, 
    specialty: 'خبير الفيزياء' 
  },
];

/** 
 * 🎓 الكورسات
 */
export const courses: Course[] = [
  { id: 'c1', title: 'أساسيات الكيمياء', teacherId: 't1', thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400', lectureCount: 1, duration: '15 ساعة' },
];

/** 
 * 🎬 المحاضرات
 */
export const lectures: Lecture[] = [
  { 
    id: 'l1', 
    courseId: 'c1', 
    title: 'المحاضرة الأولى: مقدمة', 
    videoUrl: 'https://www.youtube.com/watch?v=a8BN5ho9oik', 
    duration: '45:00', 
    isCompleted: true,
    description: 'شرح أساسيات المادة.',
    thumbnail: 'https://images.unsplash.com/photo-1603126010305-2f560a3d5e7e?auto=format&fit=crop&q=80&w=400'
  },
];
