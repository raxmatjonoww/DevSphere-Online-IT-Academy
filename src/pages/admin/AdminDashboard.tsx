
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, FolderTree, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { users } = useAuth();
  const { categories, lessons } = useContent();

  return (
    <Layout adminOnly>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <p className="text-gray-600">
          Управляйте платформой IT Academy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-teal" />
                Пользователи
              </CardTitle>
              <CardDescription>Управление учетными записями пользователей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{users.length}</p>
                <p className="text-sm">Всего зарегистрированных пользователей</p>
                <Button 
                  onClick={() => navigate('/admin/users')}
                  className="w-full mt-4 bg-brand-teal hover:bg-brand-blue"
                >
                  Управление пользователями
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-brand-orange" />
                Категории
              </CardTitle>
              <CardDescription>Организуйте свой контент</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{categories.length}</p>
                <p className="text-sm">Всего категорий</p>
                <Button 
                  onClick={() => navigate('/admin/categories')}
                  className="w-full mt-4 bg-brand-orange hover:bg-brand-blue"
                >
                  Управление категориями
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-brand-lightBlue" />
                Уроки
              </CardTitle>
              <CardDescription>Образовательный контент</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{lessons.length}</p>
                <p className="text-sm">Всего видеоуроков</p>
                <Button 
                  onClick={() => navigate('/admin/lessons')}
                  className="w-full mt-4 bg-brand-lightBlue hover:bg-brand-blue"
                >
                  Управлять уроками
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Общие административные задачи</CardTitle>
              <CardDescription>
              Общие административные задачи
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/users')}
                className="flex items-center justify-center gap-2 h-12"
              >
                <Users size={16} />
                <span>Добавить нового пользователя</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/categories')}
                className="flex items-center justify-center gap-2 h-12"
              >
                <FolderTree size={16} />
                <span>Создать категорию</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/lessons')}
                className="flex items-center justify-center gap-2 h-12"
              >
                <Video size={16} />
                <span>Загрузить урок</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
