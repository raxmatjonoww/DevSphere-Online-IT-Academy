export type UserRole = 'admin' | 'user' | 'teacher';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  fullName?: string;
  rating?: number;
  subjectArea?: string;
  studentId?: string;
  email?: string;
  phoneNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string | null;
  createdAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  homeworkFileUrl?: string;
  categoryId: string;
  createdAt: Date;
  teacherId?: string;
  dueDate?: Date;
}

export interface HomeworkSubmission {
  id: string;
  lessonId: string;
  userId: string;
  fileUrl: string;
  submissionDate: Date;
  status: 'pending' | 'graded';
  grade?: number;
  feedback?: string;
}

export interface TeacherRating {
  teacherId: string;
  userId: string;
  rating: number;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}
