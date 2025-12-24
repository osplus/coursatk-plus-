
export interface Subject {
  id: string;
  name: string;
  image: string;
  category?: string;
  lessonsCount?: number;
  progress?: number;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  subjectId: string;
  rating: number;
  specialty: string;
}

export interface Course {
  id: string;
  title: string;
  teacherId: string;
  thumbnail: string;
  lectureCount: number;
  duration: string;
}

export interface LecturePart {
  title: string;
  videoUrl: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  duration: string;
  isCompleted: boolean;
  description: string;
  thumbnail: string;
  pdfUrl?: string;
  examId?: string;
  parts?: LecturePart[]; // قائمة أجزاء المحاضرة
}

export interface Question {
  id: string;
  examId: string;
  text: string;
  image?: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  lectureId?: string;
  passingScore: number;
}
