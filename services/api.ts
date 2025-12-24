
import { CONFIG } from '../config';
import { Subject, Teacher, Course, Lecture, Exam, Question } from '../types';

async function supabaseRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': CONFIG.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      // معالجة الأخطاء حسب كود الحالة
      if (response.status === 401 || response.status === 403) {
        throw new Error('عفواً، لا تملك صلاحية الوصول لهذه البيانات. تأكد من تفعيل الكود الخاص بك.');
      }
      if (response.status === 404) {
        throw new Error('عفواً، المحتوى الذي تبحث عنه غير موجود حالياً.');
      }
      if (response.status >= 500) {
        throw new Error('هناك مشكلة في سيرفر المنصة حالياً، يرجى المحاولة بعد قليل.');
      }
      
      const errorData = await response.json().catch(() => ({ message: 'خطأ غير معروف' }));
      throw new Error(errorData.message || 'حدث خطأ غير متوقع');
    }
    
    if (response.status === 204) return [] as any;
    return await response.json();
  } catch (error: any) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('تعذر الاتصال بالسيرفر، يرجى التأكد من اتصال الإنترنت الخاص بك.');
    }
    throw error;
  }
}

export const API = {
  verifyCode: async (code: string) => {
    try {
      const data = await supabaseRequest<any[]>(`/activation_codes?code=eq.${code.trim()}&select=*`);
      if (data && data.length > 0) {
        const entry = data[0];
        const expiryDate = new Date(entry.expiry_date);
        if (entry.expiry_date && expiryDate < new Date()) {
          return { success: false, message: 'انتهت صلاحية هذا الكود، يرجى الحصول على كود جديد.' };
        }
        return { 
          success: true, 
          student: { 
            name: entry.student_name, 
            code: entry.code, 
            section: entry.section, 
            expiryDate: entry.expiry_date 
          } 
        };
      }
      return { success: false, message: 'هذا الكود غير صحيح، يرجى التأكد من كتابة الـ 7 أرقام بشكل سليم.' };
    } catch (err: any) { 
      return { success: false, message: err.message || 'خطأ في التحقق من الكود' }; 
    }
  },

  getStudentStatus: async (code: string) => {
    try {
      const data = await supabaseRequest<any[]>(`/activation_codes?code=eq.${code}&select=*`);
      if (!data || data.length === 0) return { exists: false };
      return { exists: true, expiryDate: data[0].expiry_date };
    } catch {
      return { exists: true }; 
    }
  },

  getSubjects: async (): Promise<Subject[]> => {
    return await supabaseRequest<Subject[]>('/subjects?select=*&order=id.asc');
  },

  getTeachers: async (subjectId: string): Promise<Teacher[]> => {
    return await supabaseRequest<Teacher[]>(`/teachers?subject_id=eq.${subjectId}&select=*`);
  },

  getCourses: async (teacherId: string): Promise<Course[]> => {
    return await supabaseRequest<Course[]>(`/courses?teacher_id=eq.${teacherId}&select=*`);
  },

  getLectures: async (courseId: string): Promise<Lecture[]> => {
    return await supabaseRequest<Lecture[]>(`/lectures?course_id=eq.${courseId}&select=*&order=id.asc`);
  },

  getRecentLectures: async (limit: number = 5): Promise<Lecture[]> => {
    return await supabaseRequest<Lecture[]>(`/lectures?select=*&order=id.desc&limit=${limit}`);
  },

  getLectureById: async (id: string): Promise<Lecture | null> => {
    const data = await supabaseRequest<Lecture[]>(`/lectures?id=eq.${id}&select=*`);
    return data && data.length > 0 ? data[0] : null;
  },

  getExam: async (examId: string): Promise<Exam | null> => {
    const data = await supabaseRequest<Exam[]>(`/exams?id=eq.${examId}&select=*`);
    return data && data.length > 0 ? data[0] : null;
  },

  getQuestions: async (examId: string): Promise<Question[]> => {
    const data = await supabaseRequest<any[]>(`/questions?exam_id=eq.${examId}&select=*&order=id.asc`);
    return data.map(q => ({
      id: q.id, examId: q.exam_id, text: q.text, image: q.image_url,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      correctAnswer: q.correct_answer
    }));
  }
};
