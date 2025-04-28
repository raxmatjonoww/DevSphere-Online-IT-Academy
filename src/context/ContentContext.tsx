
import React, { createContext, useContext, useState } from 'react';
import { User, Category, Lesson, HomeworkSubmission, ChatMessage, UserRole } from '@/types';

interface ContentContextType {
  lessons: Lesson[];
  categories: Category[];
  submissions: HomeworkSubmission[];
  users: User[];
  teachers: User[];
  students: User[];
  messages: ChatMessage[];
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  getMessagesByUser: (userId: string) => ChatMessage[];
  // Add missing functions
  addSubmission: (submission: HomeworkSubmission) => void;
  updateSubmission: (id: string, updates: Partial<HomeworkSubmission>) => void;
  getSubmissionsByUser: (userId: string) => HomeworkSubmission[];
  getSubmissionsByLesson: (lessonId: string) => HomeworkSubmission[];
  addLesson: (lesson: Lesson) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getTeacherById: (id: string) => User | undefined;
  getLessonsByCategory: (categoryId: string) => Lesson[];
  getRootCategories: () => Category[];
  getSubcategories: (parentId: string) => Category[];
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "Введение в React",
      description: "Изучите основы React",
      videoUrl: "https://example.com/video1",
      categoryId: "1",
      createdAt: new Date(),
      teacherId: "teacher1",
      dueDate: new Date(),
    },
    {
      id: "2",
      title: "Расширенные концепции React",
      description: "Изучите расширенные шаблоны React",
      videoUrl: "https://youtu.be/YVkUvmDQ3HY",
      categoryId: "1",
      createdAt: new Date(),
      teacherId: "teacher2",
      dueDate: new Date(),
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Веб-разработка",
      description: "Курсы веб-разработки",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Разработка мобильных приложений",
      description: "Курсы разработки мобильных приложений",
      createdAt: new Date(),
    },
  ]);

  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);

  const [users] = useState<User[]>([
    {
      id: "1",
      username: "student1",
      password: "password",
      role: "user",
      createdAt: new Date(),
    },
    {
      id: "2",
      username: "teacher1",
      password: "password",
      role: "teacher",
      createdAt: new Date(),
    },
    {
      id: "3",
      username: "admin",
      password: "password",
      role: "admin",
      createdAt: new Date(),
    },
  ]);

  const teachers = users.filter(user => user.role === 'teacher');
  const students = users.filter(user => user.role === 'user');

  // Message functions
  const sendMessage = (senderId: string, receiverId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getMessagesByUser = (userId: string) => {
    return messages.filter(msg => 
      msg.senderId === userId || msg.receiverId === userId
    );
  };

  // Submission functions
  const addSubmission = (submission: HomeworkSubmission) => {
    setSubmissions(prev => [...prev, submission]);
  };

  const updateSubmission = (id: string, updates: Partial<HomeworkSubmission>) => {
    setSubmissions(prev => prev.map(submission => 
      submission.id === id ? { ...submission, ...updates } : submission
    ));
  };

  const getSubmissionsByUser = (userId: string) => {
    return submissions.filter(submission => submission.userId === userId);
  };

  const getSubmissionsByLesson = (lessonId: string) => {
    return submissions.filter(submission => submission.lessonId === lessonId);
  };

  // Lesson functions
  const addLesson = (lesson: Lesson) => {
    setLessons(prev => [...prev, lesson]);
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === id ? { ...lesson, ...updates } : lesson
    ));
  };

  const deleteLesson = (id: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== id));
  };

  const getLessonsByCategory = (categoryId: string) => {
    return lessons.filter(lesson => lesson.categoryId === categoryId);
  };

  // Category functions
  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  const getRootCategories = () => {
    return categories.filter(category => !category.parentId);
  };

  const getSubcategories = (parentId: string) => {
    return categories.filter(category => category.parentId === parentId);
  };

  // Teacher functions
  const getTeacherById = (id: string) => {
    return teachers.find(teacher => teacher.id === id);
  };

  return (
    <ContentContext.Provider value={{
      lessons,
      categories,
      submissions,
      users,
      teachers,
      students,
      messages,
      sendMessage,
      getMessagesByUser,
      addSubmission,
      updateSubmission,
      getSubmissionsByUser,
      getSubmissionsByLesson,
      addLesson,
      updateLesson,
      deleteLesson,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategoryById,
      getTeacherById,
      getLessonsByCategory,
      getRootCategories,
      getSubcategories,
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent должен использоваться внутри ContentProvider');
  }
  return context;
};
