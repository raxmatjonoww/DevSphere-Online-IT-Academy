
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';

const HomeworkPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { lessons, getSubmissionsByUser } = useContent();
  const { t } = useLanguage();
  
  // Get all submissions for the current user
  const userSubmissions = currentUser ? getSubmissionsByUser(currentUser.id) : [];
  
  // Get lessons with homework that the user has not submitted yet
  const lessonsWithPendingHomework = lessons.filter(lesson => 
    lesson.homeworkFileUrl && 
    !userSubmissions.some(submission => submission.lessonId === lesson.id)
  );
  
  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('myHomework')}</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Pending Homework Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('pendingHomework')}</CardTitle>
              <CardDescription>{t('homeworkPendingDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {lessonsWithPendingHomework.length > 0 ? (
                <div className="space-y-4">
                  {lessonsWithPendingHomework.map(lesson => (
                    <Card key={lesson.id} className="bg-gray-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                        <div className="flex">
                          <a 
                            href={`/lessons?lessonId=${lesson.id}`}
                            className="text-brand-blue hover:text-brand-lightBlue font-medium text-sm"
                          >
                            {t('goToLesson')} →
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">{t('noHomeworkPending')}</p>
              )}
            </CardContent>
          </Card>
          
          {/* Submitted Homework Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('submittedHomework')}</CardTitle>
              <CardDescription>{t('submittedHomeworkDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {userSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {userSubmissions.map(submission => {
                    // Find the associated lesson
                    const lesson = lessons.find(l => l.id === submission.lessonId);
                    if (!lesson) return null;
                    
                    return (
                      <Card key={submission.id} className="bg-gray-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600">
                                {t('submitted')}: {new Date(submission.submissionDate).toLocaleDateString()}
                              </p>
                              {submission.status === 'graded' ? (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {t('graded')}: {submission.grade}/100
                                  </span>
                                  {submission.feedback && (
                                    <p className="mt-2 text-sm border-l-2 border-gray-300 pl-3 italic">
                                      "{submission.feedback}"
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {t('awaitingFeedback')}
                                </span>
                              )}
                            </div>
                            <div>
                              <a 
                                href={submission.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-brand-blue hover:text-brand-lightBlue font-medium text-sm"
                              >
                                {t('viewSubmission')}
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">{t('noSubmittedHomework')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HomeworkPage;
