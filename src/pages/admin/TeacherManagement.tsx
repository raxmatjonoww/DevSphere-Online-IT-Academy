
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
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
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Trash2, Star, Edit } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export default function TeacherManagement() {
  const { addUser, deleteUser, users } = useAuth();
  const { teachers, lessons } = useContent();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [subjectArea, setSubjectArea] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTeacher = () => {
    setIsSubmitting(true);
    try {
      if (!username || !password || !fullName || !subjectArea) {
        setError('Пожалуйста, заполните все поля.');
        setIsSubmitting(false);
        return;
      }

      const teacherExists = teachers.some(teacher => 
        teacher.username.toLowerCase() === username.toLowerCase()
      );
      
      if (teacherExists) {
        setError('Имя пользователя уже существует.');
        setIsSubmitting(false);
        return;
      }

      addUser(username, password, 'teacher', fullName, subjectArea);
      
      // Show success toast
      toast({
        title: t('teacherCreated'),
        description: t('teacherCreatedDesc'),
      });
      
      setUsername('');
      setPassword('');
      setFullName('');
      setSubjectArea('');
      setError(null);
      setIsDialogOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    try {
      // Check if teacher has lessons
      const teacherHasLessons = lessons.some(lesson => lesson.teacherId === teacherId);
      
      if (teacherHasLessons) {
        toast({
          title: t('error'),
          description: t('cannotDeleteTeacherWithLessons'),
          variant: "destructive",
        });
        return;
      }
      
      deleteUser(teacherId);
      
      toast({
        title: t('teacherDeleted'),
        description: t('teacherDeletedDesc'),
      });
    } catch (err) {
      toast({
        title: t('error'),
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  // Filter only teachers from users
  const teachersList = teachers.filter(user => user.role === 'teacher');

  // Filter users to get students
  const students = users.filter(user => user.role === 'user');

  return (
    <Layout adminOnly>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('teacherManagement')}</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-blue hover:bg-brand-lightBlue">
                <Plus className="mr-2 h-4 w-4" />
                {t('addTeacher')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('createNewTeacher')}</DialogTitle>
                <DialogDescription>
                  {t('addNewTeacherDesc')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullName')}</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('enterFullName')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">{t('username')}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('enterUsername')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enterPassword')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subjectArea">{t('subjectArea')}</Label>
                  <Textarea
                    id="subjectArea"
                    value={subjectArea}
                    onChange={(e) => setSubjectArea(e.target.value)}
                    placeholder={t('enterSubjectArea')}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                  {t('cancel')}
                </Button>
                <Button 
                  onClick={handleCreateTeacher}
                  className="bg-brand-blue hover:bg-brand-lightBlue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('saving') : t('saveTeacherDetails')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('teachers')}</CardTitle>
            <CardDescription>
              {t('manageTeachersDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('username')}</TableHead>
                  <TableHead>{t('subjectArea')}</TableHead>
                  <TableHead>{t('rating')}</TableHead>
                  <TableHead>{t('joined')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachersList.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.fullName}</TableCell>
                    <TableCell>{teacher.username}</TableCell>
                    <TableCell>{teacher.subjectArea}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{teacher.rating || '0.0'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
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
                              {t('confirmDeleteTeacher')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="bg-red-500 hover:bg-red-700"
                            >
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {teachersList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {t('noTeachersYet')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Add Student Information Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('students')}</CardTitle>
            <CardDescription>
              {t('studentManagementDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('studentId')}</TableHead>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('phone')}</TableHead>
                  <TableHead>{t('joined')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.studentId || '-'}</TableCell>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
                    <TableCell>{student.email || '-'}</TableCell>
                    <TableCell>{student.phoneNumber || '-'}</TableCell>
                    <TableCell>{student.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {t('noStudentsYet')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
