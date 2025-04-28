
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Play, Star } from 'lucide-react';
import { Lesson, User } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface LessonListProps {
  lessons: Lesson[];
  getCategoryPath: (categoryId: string | null) => string;
  handlePlay: (lesson: Lesson) => void;
  getTeacherInfo: (teacherId?: string) => User | null | undefined;
}

export const LessonList: React.FC<LessonListProps> = ({
  lessons,
  getCategoryPath,
  handlePlay,
  getTeacherInfo,
}) => {
  const { t } = useLanguage();

  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>{t('noLessonsFound')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          getCategoryPath={getCategoryPath}
          handlePlay={handlePlay}
          getTeacherInfo={getTeacherInfo}
        />
      ))}
    </div>
  );
};

interface LessonCardProps {
  lesson: Lesson;
  getCategoryPath: (categoryId: string | null) => string;
  handlePlay: (lesson: Lesson) => void;
  getTeacherInfo: (teacherId?: string) => User | null | undefined;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  getCategoryPath,
  handlePlay,
  getTeacherInfo,
}) => {
  const { t } = useLanguage();
  const teacher = getTeacherInfo(lesson.teacherId);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{lesson.title}</CardTitle>
        <CardDescription>
          {getCategoryPath(lesson.categoryId)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2">{lesson.description}</p>
        
        {/* Teacher info */}
        {teacher && (
          <div className="mt-3 flex items-center text-sm">
            <span className="text-gray-500 mr-2">{t('teacher')}:</span>
            <span className="font-medium flex items-center">
              {teacher.fullName}
              {teacher.rating && (
                <span className="ml-2 flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                  {teacher.rating}
                </span>
              )}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          className="bg-brand-blue hover:bg-brand-lightBlue"
          onClick={() => handlePlay(lesson)}
        >
          <Play className="mr-2 h-4 w-4" />
          {t('watch')}
        </Button>
        
        {lesson.homeworkFileUrl && (
          <Button 
            variant="outline"
            onClick={() => window.open(lesson.homeworkFileUrl, '_blank')}
          >
            <FileDown className="mr-2 h-4 w-4" />
            {t('homework')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
