import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Trash2, Edit, Video, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { Lesson } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ChatButton } from '@/components/chat/ChatButton';

export default function TeacherLessonManagement() {
  const { currentUser } = useAuth();
  const { 
    addLesson, 
    updateLesson, 
    deleteLesson, 
    lessons, 
    categories,
    submissions,
    students
  } = useContent();
  const { t } = useLanguage();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [homeworkUrl, setHomeworkUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser || currentUser.role !== 'teacher') {
    return <Layout><div className="container mx-auto text-center py-12">Доступ запрещен</div></Layout>;
  }

  // Get lessons created by this teacher
  const teacherLessons = lessons.filter(lesson => lesson.teacherId === currentUser.id);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setVideoUrl('');
    setHomeworkUrl('');
    setIsEditMode(false);
    setEditingLesson(null);
    setError(null);
  };

  const handleOpenDialog = (lesson?: Lesson) => {
    resetForm();
    
    if (lesson) {
      setIsEditMode(true);
      setEditingLesson(lesson);
      setTitle(lesson.title);
      setDescription(lesson.description);
      setCategoryId(lesson.categoryId);
      setVideoUrl(lesson.videoUrl);
      setHomeworkUrl(lesson.homeworkFileUrl || '');
    }
    
    setIsDialogOpen(true);
  };

  const validateForm = () => {
    if (!title || !description || !categoryId || !videoUrl) {
      setError('Пожалуйста, заполните все обязательные поля');
      return false;
    }
    
    // Simple YouTube URL validation
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      setError('Введите действительный URL-адрес видео YouTube.');
      return false;
    }
    
    return true;
  };

  const handleSaveLesson = () => {
    if (!validateForm()) return;
    
    try {
      if (isEditMode && editingLesson) {
        updateLesson(editingLesson.id, {
          title,
          description,
          categoryId,
          videoUrl,
          homeworkFileUrl: homeworkUrl || undefined,
        });
      } else {
        addLesson({
          title,
          description,
          categoryId,
          videoUrl,
          homeworkFileUrl: homeworkUrl || undefined,
          teacherId: currentUser.id,
        });
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    try {
      // Check if there are submissions for this lesson
      const hasSubmissions = submissions.some(sub => sub.lessonId === lessonId);
      if (hasSubmissions) {
        alert('Невозможно удалить этот урок, так как с ним связаны работы учащихся.');
        return;
      }

      deleteLesson(lessonId);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <Layout requireAuth>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('myLessonMaterials')}</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) resetForm();
            setIsDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-brand-blue hover:bg-brand-lightBlue">
                <Plus className="mr-2 h-4 w-4" />
                {t('addLesson')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? t('editLesson') : t('createNewLesson')}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? t('updateLessonContent')
                    : t('addNewLessonDesc')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="title">{t('lessonTitle')} *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('enterLessonTitle')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('description')} *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('enterLessonDescription')}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">{t('category')} *</Label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">{t('selectCategory')}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">{t('youtubeVideoUrl')} *</Label>
                  <Input
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500">
                    {t('enterYoutubeVideoUrlDesc')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="homeworkUrl">{t('homeworkFileUrl')}</Label>
                  <Input
                    id="homeworkUrl"
                    value={homeworkUrl}
                    onChange={(e) => setHomeworkUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                  />
                  <p className="text-xs text-gray-500">
                    {t('enterHomeworkFileUrlDesc')}
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                  {t('cancel')}
                </Button>
                <Button 
                  type="submit" 
                  className="bg-brand-blue hover:bg-brand-lightBlue"
                  disabled={isSubmitting}
                  onClick={handleSaveLesson}
                >
                  {isSubmitting ? t('saving') : (isEditMode ? t('updateLesson') : t('createLesson'))}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('myMaterials')}</CardTitle>
            <CardDescription>
              {t('manageLessonsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teacherLessons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Video className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>{t('noLessonsYet')}</p>
                <Button 
                  className="mt-4 bg-brand-blue hover:bg-brand-lightBlue"
                  onClick={() => handleOpenDialog()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('createFirstLesson')}
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('title')}</TableHead>
                    <TableHead>{t('category')}</TableHead>
                    <TableHead>{t('hasHomework')}</TableHead>
                    <TableHead>{t('created')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherLessons.map((lesson) => {
                    const category = categories.find(cat => cat.id === lesson.categoryId);
                    return (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.title}</TableCell>
                        <TableCell>{category?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          {lesson.homeworkFileUrl ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FileText className="mr-1 h-3 w-3" />
                              {t('yes')}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">{t('no')}</span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(lesson.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(lesson)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit size={16} />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('confirmDeletion')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('confirmDeleteLesson')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="bg-red-500 hover:bg-red-700"
                                >
                                  {t('delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{t('students')}</h2>
          <div className="grid gap-4">
            {students?.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{student.fullName}</CardTitle>
                    <ChatButton 
                      receiverName={student.fullName || student.username}
                      receiverId={student.id}
                    />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
