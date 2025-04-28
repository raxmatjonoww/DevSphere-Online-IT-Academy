
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { Lesson, HomeworkSubmission } from '@/types';
import { FileDown, CheckCheck, Clock, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomeworkReview() {
  const { currentUser, users, getUserById } = useAuth();
  const { 
    lessons, 
    submissions, 
    getSubmissionsByLesson, 
    updateSubmission 
  } = useContent();
  const { t } = useLanguage();
  
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<HomeworkSubmission | null>(null);
  const [grade, setGrade] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  if (!currentUser || currentUser.role !== 'teacher') {
    return <Layout><div className="container mx-auto text-center py-12">Access denied</div></Layout>;
  }

  // Get lessons created by this teacher
  const teacherLessons = lessons.filter(lesson => lesson.teacherId === currentUser.id);

  // Get submissions for each lesson
  const allSubmissions = teacherLessons.flatMap(lesson => 
    getSubmissionsByLesson(lesson.id)
  );

  // Filter by status
  const pendingSubmissions = allSubmissions.filter(sub => sub.status === 'pending');
  const gradedSubmissions = allSubmissions.filter(sub => sub.status === 'graded');
  
  // Get display submissions based on active tab
  const displaySubmissions = activeTab === 'pending' ? pendingSubmissions : gradedSubmissions;

  // Function to get lesson details
  const getLessonDetails = (lessonId: string): Lesson | undefined => {
    return lessons.find(lesson => lesson.id === lessonId);
  };

  // Function to get student name
  const getStudentName = (userId: string): string => {
    const user = getUserById(userId);
    return user?.fullName || user?.username || 'Неизвестный студент';
  };

  // Handle opening the review dialog
  const handleOpenReview = (submission: HomeworkSubmission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || '');
    setFeedback(submission.feedback || '');
    setIsReviewDialogOpen(true);
  };

  // Handle submission grading
  const handleGradeSubmission = () => {
    if (!selectedSubmission) return;
    
    if (grade === '' || Number.isNaN(Number(grade)) || Number(grade) < 0 || Number(grade) > 100) {
      alert('Пожалуйста, введите действительную оценку от 0 до 100');
      return;
    }

    updateSubmission(selectedSubmission.id, {
      grade: Number(grade),
      feedback,
      status: 'graded'
    });
    
    setIsReviewDialogOpen(false);
    setSelectedSubmission(null);
  };

  return (
    <Layout requireAuth>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('homeworkReview')}</h1>
          <p className="text-gray-600">{t('reviewStudentSubmissions')}</p>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending" className="relative">
              {t('pendingReview')}
              {pendingSubmissions.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingSubmissions.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="graded">{t('gradedSubmissions')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t('pendingSubmissions')}</CardTitle>
                <CardDescription>
                  {t('studentsWaitingFeedback')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderSubmissionsTable(displaySubmissions)}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="graded" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t('gradedWork')}</CardTitle>
                <CardDescription>
                  {t('previouslyGradedWork')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderSubmissionsTable(displaySubmissions)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Review Dialog */}
        {selectedSubmission && (
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{t('reviewHomework')}</DialogTitle>
                <DialogDescription>
                  {getLessonDetails(selectedSubmission.lessonId)?.title} - {getStudentName(selectedSubmission.userId)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{t('submittedWork')}:</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedSubmission.submissionDate).toLocaleDateString()} {new Date(selectedSubmission.submissionDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(selectedSubmission.fileUrl, '_blank')}
                    className="gap-2"
                  >
                    <FileDown size={16} />
                    {t('download')}
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">{t('grade')} (0-100)</Label>
                    <Input
                      id="grade"
                      type="number"
                      min="0"
                      max="100"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0-100"
                    />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="feedback">{t('feedback')}</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={t('provideFeedback')}
                      rows={5}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button 
                  className="bg-brand-blue hover:bg-brand-lightBlue" 
                  onClick={handleGradeSubmission}
                >
                  {activeTab === 'graded' ? t('updateGrade') : t('submitGrade')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );

  function renderSubmissionsTable(submissions: HomeworkSubmission[]) {
    if (submissions.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {activeTab === 'pending' ? t('noSubmissionsPending') : t('noGradedSubmissionsYet')}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('student')}</TableHead>
            <TableHead>{t('lesson')}</TableHead>
            <TableHead>{t('submitted')}</TableHead>
            {activeTab === 'graded' && <TableHead>{t('grade')}</TableHead>}
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => {
            const lesson = getLessonDetails(submission.lessonId);
            return (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{getStudentName(submission.userId)}</TableCell>
                <TableCell>{lesson?.title || 'Unknown Lesson'}</TableCell>
                <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
                
                {activeTab === 'graded' && (
                  <TableCell>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 mr-1" />
                      {submission.grade}/100
                    </div>
                  </TableCell>
                )}
                
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(submission.fileUrl, '_blank')}
                    >
                      <FileDown size={14} className="mr-1" />
                      {t('view')}
                    </Button>
                    
                    <Button
                      size="sm"
                      className={activeTab === 'pending' ? 'bg-brand-blue hover:bg-brand-lightBlue' : 'bg-brand-teal hover:bg-brand-teal/90'}
                      onClick={() => handleOpenReview(submission)}
                    >
                      {activeTab === 'pending' ? (
                        <><Clock size={14} className="mr-1" /> {t('grade')}</>
                      ) : (
                        <><CheckCheck size={14} className="mr-1" /> {t('update')}</>
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
