
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { FileDown, Star, FileUp, CheckCircle } from 'lucide-react';
import { Lesson, User, HomeworkSubmission } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { HomeworkSubmissionForm } from '@/components/HomeworkSubmissionForm';
import { useContent } from '@/context/ContentContext';
import { HomeworkGradingForm } from '@/components/homework/HomeworkGradingForm';

interface VideoPlayerProps {
  lesson: Lesson;
  onBack: () => void;
  getTeacherInfo: (teacherId?: string) => User | null | undefined;
  currentUser: User | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  lesson,
  onBack,
  getTeacherInfo,
  currentUser,
}) => {
  const { t } = useLanguage();
  const { getSubmissionsByLesson } = useContent();
  const [selectedSubmission, setSelectedSubmission] = useState<HomeworkSubmission | null>(null);
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  
  // Get YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const teacher = getTeacherInfo(lesson.teacherId);
  
  // Get submissions for this lesson if user is a teacher
  const submissions = currentUser?.role === 'teacher' ? getSubmissionsByLesson(lesson.id) : [];
  
  // Format submission date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };
  
  const handleOpenGrading = (submission: HomeworkSubmission) => {
    setSelectedSubmission(submission);
    setIsGradingOpen(true);
  };
  
  const handleCloseGrading = () => {
    setIsGradingOpen(false);
    setSelectedSubmission(null);
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-2"
      >
        {t('backToLessons')}
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{lesson.title}</CardTitle>
          <CardDescription>
            {lesson.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black rounded-md overflow-hidden">
            {/* YouTube video player */}
            {getYouTubeVideoId(lesson.videoUrl) ? (
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(lesson.videoUrl)}`}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-white text-center">
                <p>Формат видео не поддерживается или недействительный URL</p>
              </div>
            )}
          </div>
          
          {/* Teacher information */}
          {teacher && (
            <div className="mt-4 flex items-center">
              <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-bold mr-3">
                {teacher.fullName?.charAt(0) || 'T'}
              </div>
              <div>
                <div className="font-medium">
                  {teacher.fullName || t('teacher')}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                  {teacher.rating || '0.0'} • {teacher.subjectArea || t('instructor')}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          {lesson.homeworkFileUrl && (
            <Button 
              className="bg-brand-teal hover:bg-brand-blue"
              onClick={() => window.open(lesson.homeworkFileUrl, '_blank')}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {t('downloadHomework')}
            </Button>
          )}
          
          {/* Homework submission form for students */}
          {lesson.homeworkFileUrl && currentUser && currentUser.role === 'user' && (
            <div className="w-full mt-2">
              <h3 className="text-lg font-medium mb-2">{t('homeworkSubmission')}</h3>
              <HomeworkSubmissionForm lesson={lesson} />
            </div>
          )}
          
          {/* Homework submissions list for teachers */}
          {currentUser?.role === 'teacher' && submissions.length > 0 && (
            <div className="w-full mt-4">
              <h3 className="text-lg font-medium mb-2">{t('studentSubmissions')}</h3>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('student')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('submissionDate')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('status')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((submission) => {
                        const student = getTeacherInfo(submission.userId);
                        return (
                          <tr key={submission.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student?.fullName || student?.username || submission.userId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatDate(submission.submissionDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {submission.status === 'graded' ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {t('graded')} ({submission.grade}/100)
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  {t('pendingReview')}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <div className="flex justify-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => window.open(submission.fileUrl, '_blank')}
                                >
                                  <FileUp className="h-4 w-4 mr-1" />
                                  {t('view')}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  className={submission.status === 'pending' ? 'bg-brand-blue hover:bg-brand-lightBlue' : 'bg-brand-teal hover:bg-brand-teal/90'}
                                  onClick={() => handleOpenGrading(submission)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  {submission.status === 'pending' ? t('grade') : t('update')}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      
      {/* Homework Grading Dialog */}
      {selectedSubmission && (
        <HomeworkGradingForm
          submission={selectedSubmission}
          isOpen={isGradingOpen}
          onClose={handleCloseGrading}
          onSuccess={handleCloseGrading}
        />
      )}
    </div>
  );
};
