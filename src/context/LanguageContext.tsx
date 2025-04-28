import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ru' | 'kk' | 'uz';

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  login: {

    ru: 'Вход',

  },
  enterCredentials: {

    ru: 'Введите данные для доступа к аккаунту',

  },
  username: {

    ru: 'Имя пользователя',

  },
  password: {

    ru: 'Пароль',

  },
  enterUsername: {

    ru: 'Введите имя пользователя',

  },
  enterPassword: {
    ru: 'Введите пароль',

  },
  signIn: {

    ru: 'Войти',

  },
  noAccount: {
    ru: 'Нет аккаунта?',

  },
  registerForCourses: {
    ru: 'Пожалуйста, зарегистрируйтесь на наши курсы, чтобы получить данные для входа',

  },
  contactAcademy: {
    ru: 'Свяжитесь с нашей академией для получения информации о регистрации',

  },
  home: {

    ru: 'Главная',

  },
  myLessons: {

    ru: 'Мои уроки',

  },
  teacherPanel: {

    ru: 'Панель учителя',

  },
  adminPanel: {

    ru: 'Панель администратора',

  },
  myMaterials: {

    ru: 'Мои материалы',

  },
  checkHomework: {

    ru: 'Проверка домашних заданий',

  },
  controlPanel: {

    ru: 'Панель управления',

  },
  users: {

    ru: 'Пользователи',

  },
  teachers: {

    ru: 'Учителя',

  },
  categories: {

    ru: 'Категории',

  },
  lessons: {

    ru: 'Уроки',

  },
  logout: {

    ru: 'Выход',

  },
  academy: {
    ru: 'Академия',

  },
  allLessons: {
    ru: 'Все уроки',

  },
  backToLessons: {
    ru: 'Назад к урокам',

  },
  watch: {
    ru: 'Смотреть',
  },
  homework: {

    ru: 'Домашнее задание',

  },
  searchLessons: {

    ru: 'Поиск уроков...',

  },
  noLessonsFound: {

    ru: 'В этой категории уроков не найдено.',

  },
  subcategories: {

    ru: 'Подкатегории',

  },
  addSubcategory: {

    ru: 'Добавить подкатегорию',

  },
  parentCategory: {
    ru: 'Родительская категория',

  },
  noneRootCategory: {

    ru: 'Нет (Корневая категория)',

  },
  itAcademyLessons: {
    ru: 'Уроки ИТ Академии',

  },
  browseWatchVideos: {

    ru: 'Просматривайте и смотрите видеоуроки',

  },
  messages: {
    ru: 'Сообщения',

  },
  send: {

    ru: 'Отправить',

  },
  typeMessage: {
    ru: 'Введите сообщение...',


  },
};

const availableLanguages = [
  { code: 'ru' as Language, name: 'Русский' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string }[];
}

const defaultLanguageContext: LanguageContextType = {
  language: 'ru',
  setLanguage: () => {},
  t: () => '',
  availableLanguages: [],
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['ru'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (['ru'].includes(browserLang)) {
      return browserLang as Language;
    }
    
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, []);

  const t = (key: string): string => {
    const keyParts = key.split('.');
    const term = keyParts[keyParts.length - 1];
    
    if (translations[term]?.[language]) {
      return translations[term][language];
    }
    
    return key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      availableLanguages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
