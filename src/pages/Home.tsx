
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FolderTree, Users, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { categories, lessons } = useContent();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-blue">
          Добро пожаловать в DevSphere Online IT Academy
          </h1>
          <p className="text-xl text-gray-600 mt-2">
          Ваш путь к совершенству в сфере ИТ начинается здесь
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-3xl mx-auto">
            <Card className="mb-6 border-l-4 border-l-brand-teal">
              <CardHeader>
                <CardTitle>Войдите, чтобы получить доступ к урокам</CardTitle>
                <CardDescription>
                Пожалуйста, войдите в свою учетную запись, чтобы просмотреть материалы курса
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                DevMarket | DevSphere Academy предоставляет высококачественное ИТ-образование
                с курсами по программированию, веб-разработке и многому другому.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/login')} className="bg-brand-teal hover:bg-brand-blue">
                Войти
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-brand-teal" />
                  Управление пользователями
                </CardTitle>
                <CardDescription>
                Управляйте пользователями вашей академии
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{useAuth().users.length}</p>
                <p>Всего счетов</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/admin/users')} variant="outline">
                Управление пользователями
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FolderTree className="h-6 w-6 text-brand-orange" />
                  Категории
                </CardTitle>
                <CardDescription>
                Организуйте содержание вашего курса
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{categories.length}</p>
                <p>Всего категорий</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/admin/categories')} variant="outline">
                Управление категориями
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-brand-lightBlue" />
                  Видео уроки
                </CardTitle>
                <CardDescription>
                Создавайте и управляйте своим образовательным контентом
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{lessons.length}</p>
                <p>Всего уроков</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/admin/lessons')} variant="outline">
                Управлять уроками
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-brand-teal" />
                  Мое обучение
                </CardTitle>
                <CardDescription>
                Получите доступ к своим курсам и учебным материалам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                Добро пожаловать в IT-академию DevSphere Online! Просмотрите наш каталог
                ИТ-курсов и начните обучение уже сегодня.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/lessons')} className="bg-brand-teal hover:bg-brand-blue">
                Просмотреть уроки
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
