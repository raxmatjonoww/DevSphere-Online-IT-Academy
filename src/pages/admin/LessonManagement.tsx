
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FileDown, Pencil, Plus, Trash2, Video } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { Textarea } from '@/components/ui/textarea';
import { Lesson } from '@/types';

export default function LessonManagement() {
  const { t } = useLanguage();
  const { 
    lessons, 
    categories,
    addLesson, 
    updateLesson, 
    deleteLesson, 
    getCategoryById 
  } = useContent();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [homeworkFileUrl, setHomeworkFileUrl] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddLesson = () => {
    try {
      if (!title || !videoUrl || !categoryId) {
        setError('Обязательно название, URL-адрес видео и категория.');
        return;
      }

      const newLesson: Omit<Lesson, 'id' | 'createdAt'> = {
        title,
        description,
        videoUrl,
        homeworkFileUrl: homeworkFileUrl || undefined,
        categoryId
      };
      
      addLesson(newLesson);
      
      // Reset form and close dialog
      resetForm();
      setIsAddDialogOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEditLesson = () => {
    try {
      if (!currentLessonId || !title || !videoUrl || !categoryId) {
        setError('Обязательно название, URL-адрес видео и категория.');
        return;
      }

      updateLesson(currentLessonId, {
        title,
        description,
        videoUrl,
        homeworkFileUrl: homeworkFileUrl || undefined,
        categoryId
      });
      
      // Reset form and close dialog
      resetForm();
      setIsEditDialogOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    try {
      deleteLesson(lessonId);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setHomeworkFileUrl('');
    setCategoryId('');
    setCurrentLessonId(null);
    setError(null);
  };

  const openEditDialog = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLessonId(lessonId);
      setTitle(lesson.title);
      setDescription(lesson.description);
      setVideoUrl(lesson.videoUrl);
      setHomeworkFileUrl(lesson.homeworkFileUrl || '');
      setCategoryId(lesson.categoryId);
      setIsEditDialogOpen(true);
    }
  };

  // Get category path for display (e.g., "Programming > Python")
  const getCategoryPath = (categoryId: string | null): string => {
    if (!categoryId) return '-';
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '-';
    
    let path = category.name;
    let currentCatId = category.parentId;
    
    // Traverse up the category hierarchy
    while (currentCatId) {
      const parentCat = categories.find(c => c.id === currentCatId);
      if (!parentCat) break;
      
      path = `${parentCat.name} > ${path}`;
      currentCatId = parentCat.parentId;
    }
    
    return path;
  };

  return (
    <Layout adminOnly>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('lessons')}</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-blue hover:bg-brand-lightBlue">
                <Plus className="mr-2 h-4 w-4" />
                {t('lessons')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Создать новый урок</DialogTitle>
                <DialogDescription>
                Добавить новый видеоурок с дополнительным домашним заданием
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="title">Название урока *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите название урока"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введите описание урока"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video">URL-адрес видео *</Label>
                  <Input
                    id="video"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Введите URL-адрес видео"
                    required
                  />
                  <p className="text-xs text-gray-500">
                  Введите прямую ссылку на видеофайл или URL-адрес потоковой передачи видео.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="homework">URL-адрес файла с домашним заданием (необязательно)</Label>
                  <Input
                    id="homework"
                    value={homeworkFileUrl}
                    onChange={(e) => setHomeworkFileUrl(e.target.value)}
                    placeholder="Введите URL-адрес файла с домашним заданием"
                  />
                  <p className="text-xs text-gray-500">
                  Введите прямую ссылку на файл с домашним заданием для скачивания (PDF, ZIP и т. д.)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">{t('categories')} *</Label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {getCategoryPath(category.id)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsAddDialogOpen(false)} variant="outline">
                Отмена
                </Button>
                <Button onClick={handleAddLesson} className="bg-brand-blue hover:bg-brand-lightBlue">
                Создать урок
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Редактировать урок</DialogTitle>
                <DialogDescription>
                Обновить выбранный урок
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Название урока *</Label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Описание</Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-video">URL-адрес видео *</Label>
                  <Input
                    id="edit-video"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-homework">URL-адрес файла с домашним заданием (необязательно)</Label>
                  <Input
                    id="edit-homework"
                    value={homeworkFileUrl}
                    onChange={(e) => setHomeworkFileUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category">{t('categories')} *</Label>
                  <select
                    id="edit-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Выберите категориюy</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {getCategoryPath(category.id)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsEditDialogOpen(false)} variant="outline">
                Отмена
                </Button>
                <Button onClick={handleEditLesson} className="bg-brand-blue hover:bg-brand-lightBlue">
                Обновление урока
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('lessons')}</CardTitle>
            <CardDescription>
            Управляйте видеоуроками и соответствующими домашними заданиями
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>{t('categories')}</TableHead>
                  <TableHead>Ресурсы</TableHead>
                  <TableHead>Созданный</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>{getCategoryPath(lesson.categoryId)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                          <Video size={12} className="mr-1" />
                          <span>Видео</span>
                        </div>
                        
                        {lesson.homeworkFileUrl && (
                          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                            <FileDown size={12} className="mr-1" />
                            <span>{t('homework')}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{lesson.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => openEditDialog(lesson.id)}
                      >
                        <Pencil size={16} />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
                            <AlertDialogDescription>
                            Вы уверены, что хотите удалить урок "{lesson.title}"? 
                            Это действие не может быть отменено.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="bg-red-500 hover:bg-red-700"
                            >
                             Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
