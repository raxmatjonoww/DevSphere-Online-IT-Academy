import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

// Mock admin user with secure credentials
const ADMIN_USER: User = {
  id: 'admin-1',
  username: 'academy_admin',
  // In a real app, this would be hashed and not stored directly
  password: 'Dev$Market_Sphere@2025!',
  role: 'admin',
  createdAt: new Date(),
};

// Initial teacher
const TEACHER_USER: User = {
  id: 'teacher-1',
  username: 'teacher1',
  password: 'teacher123',
  role: 'teacher',
  createdAt: new Date(),
  fullName: 'John Smith',
  rating: 4.8,
  subjectArea: 'Programming',
};

// Initial student
const STUDENT_USER: User = {
  id: 'student-1',
  username: 'student1',
  password: 'student123',
  role: 'user',
  createdAt: new Date(),
  fullName: 'Alex Johnson',
  studentId: 'ST12345',
  email: 'alex@example.com',
  phoneNumber: '+1-234-567-8901',
};

// Mock data for users
const INITIAL_USERS: User[] = [
  ADMIN_USER,
  TEACHER_USER,
  STUDENT_USER,
  // Other users will be created by the admin
];

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (
    username: string, 
    password: string, 
    role: UserRole, 
    fullName?: string, 
    subjectArea?: string,
    studentId?: string,
    email?: string,
    phoneNumber?: string
  ) => User;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  isAdmin: boolean;
  isTeacher: boolean;
  isAuthenticated: boolean;
  getUserById: (id: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth необходимо использовать внутри AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Check for existing session on load
  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const isAuthenticated = currentUser !== null;

  const login = (username: string, password: string): boolean => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const addUser = (
    username: string, 
    password: string, 
    role: UserRole, 
    fullName?: string, 
    subjectArea?: string,
    studentId?: string,
    email?: string,
    phoneNumber?: string
  ): User => {
    if (!isAdmin) {
      throw new Error('Добавлять пользователей могут только администраторы.');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      password,
      role,
      createdAt: new Date(),
      fullName,
      subjectArea: role === 'teacher' ? subjectArea : undefined,
      rating: role === 'teacher' ? 0 : undefined,
      studentId: role === 'user' ? studentId : undefined,
      email: role === 'user' ? email : undefined,
      phoneNumber: role === 'user' ? phoneNumber : undefined,
    };
    
    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    if (!isAdmin && currentUser?.id !== userId) {
      throw new Error('У вас нет разрешения на обновление этого пользователя');
    }

    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));

    // If updating current user, update the session
    if (currentUser?.id === userId) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (userId: string) => {
    if (!isAdmin) {
      throw new Error('Удалять пользователей могут только администраторы.');
    }
    
    if (userId === ADMIN_USER.id) {
      throw new Error('Невозможно удалить учетную запись главного администратора.');
    }
    
    setUsers(users.filter((user) => user.id !== userId));
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const value = {
    currentUser,
    users,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    isAdmin,
    isTeacher,
    isAuthenticated,
    getUserById,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
