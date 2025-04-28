
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
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
import { FileDown, FolderTree, Play, Search, Star } from 'lucide-react';
import { Lesson, Category } from '@/types';
import { HomeworkSubmissionForm } from '@/components/HomeworkSubmissionForm';
import { ChatButton } from '@/components/chat/ChatButton';

export default function LessonsPage() {
  const { t } = useLanguage();
  const { categories, lessons, getSubcategories, getRootCategories, getLessonsByCategory, teachers, getTeacherById } = useContent();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const rootCategories = getRootCategories();
  const subcategories = selectedCategory ? getSubcategories(selectedCategory) : [];
  
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getFilteredLessons = () => {
    if (!selectedCategory) {
      return lessons;
    }

    let filteredLessons = getLessonsByCategory(selectedCategory);
    
    const getAllSubcategoryIds = (categoryId: string): string[] => {
      const directSubcats = getSubcategories(categoryId);
      let allSubcatIds: string[] = directSubcats.map(cat => cat.id);
      
      for (const subcat of directSubcats) {
        allSubcatIds = [...allSubcatIds, ...getAllSubcategoryIds(subcat.id)];
      }
      
      return allSubcatIds;
    };
    
    const allSubcategoryIds = getAllSubcategoryIds(selectedCategory);
    
    if (allSubcategoryIds.length > 0) {
      for (const subcatId of allSubcategoryIds) {
        filteredLessons = [...filteredLessons, ...getLessonsByCategory(subcatId)];
      }
    }
    
    return filteredLessons;
  };

  let filteredLessons = getFilteredLessons();

  if (searchTerm.trim()) {
    const term = searchTerm.trim().toLowerCase();
    filteredLessons = filteredLessons.filter(lesson => 
      lesson.title.toLowerCase().includes(term) || 
      lesson.description.toLowerCase().includes(term)
    );
  }

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
    setCurrentLesson(null);
  };

  const handlePlay = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const getCategoryPath = (categoryId: string | null): string => {
    if (!categoryId) return t('allLessons');
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '';
    
    let path = category.name;
    let currentCatId = category.parentId;
    
    while (currentCatId) {
      const parentCat = categories.find(c => c.id === currentCatId);
      if (!parentCat) break;
      
      path = `${parentCat.name} > ${path}`;
      currentCatId = parentCat.parentId;
    }
    
    return path;
  };

  const getTeacherInfo = (teacherId?: string) => {
    if (!teacherId) return null;
    return getTeacherById(teacherId);
  };

  return (
    <Layout requireAuth>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('itAcademyLessons')}</h1>
          <p className="text-gray-600">{t('browseWatchVideos')}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  {t('categories')}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className="space-y-1 mb-4">
                  <Button
                    variant={!selectedCategory ? "secondary" : "ghost"}
                    onClick={() => setSelectedCategory(null)}
                    className="w-full justify-start"
                  >
                    {t('allLessons')}
                  </Button>
                  
                  {rootCategories.map((category) => (
                    <div key={category.id}>
                      <Button
                        variant={selectedCategory === category.id ? "secondary" : "ghost"}
                        onClick={() => handleCategoryClick(category.id)}
                        className="w-full justify-start"
                      >
                        {category.name}
                      </Button>
                      
                      {(selectedCategory === category.id || getSubcategories(category.id).some(
                        subcat => subcat.id === selectedCategory || getSubcategories(subcat.id).some(
                          subsubcat => subsubcat.id === selectedCategory
                        )
                      )) && (
                        <div className="pl-4 space-y-1 mt-1">
                          {getSubcategories(category.id).map(subcategory => (
                            <div key={subcategory.id}>
                              <Button
                                variant={selectedCategory === subcategory.id ? "secondary" : "ghost"}
                                onClick={() => handleCategoryClick(subcategory.id)}
                                className="w-full justify-start text-sm"
                              >
                                {subcategory.name}
                              </Button>
                              
                              {(selectedCategory === subcategory.id || 
                                getSubcategories(subcategory.id).some(subsubcat => subsubcat.id === selectedCategory)) && (
                                <div className="pl-4 space-y-1 mt-1">
                                  {getSubcategories(subcategory.id).map(subsubcategory => (
                                    <Button
                                      key={subsubcategory.id}
                                      variant={selectedCategory === subsubcategory.id ? "secondary" : "ghost"}
                                      onClick={() => handleCategoryClick(subsubcategory.id)}
                                      className="w-full justify-start text-xs"
                                    >
                                      {subsubcategory.name}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t('searchLessons')}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            {currentLesson ? (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentLesson(null)}
                  className="mb-2"
                >
                  {t('backToLessons')}
                </Button>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{currentLesson.title}</CardTitle>
                    <CardDescription>
                      {currentLesson.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-black rounded-md overflow-hidden">
                      {getYouTubeVideoId(currentLesson.videoUrl) ? (
                        <iframe 
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentLesson.videoUrl)}`}
                          title={currentLesson.title}
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
                    
                    {currentLesson?.teacherId && (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-bold mr-3">
                            {getTeacherInfo(currentLesson.teacherId)?.fullName?.charAt(0) || 'T'}
                          </div>
                          <div>
                            <div className="font-medium">
                              {getTeacherInfo(currentLesson.teacherId)?.fullName || t('teacher')}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 mr-1" />
                              {getTeacherInfo(currentLesson.teacherId)?.rating || '0.0'} • {getTeacherInfo(currentLesson.teacherId)?.subjectArea || t('instructor')}
                            </div>
                          </div>
                        </div>
                        <ChatButton 
                          receiverName={getTeacherInfo(currentLesson.teacherId)?.fullName || t('teacher')}
                          receiverId={currentLesson.teacherId}
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-4">
                    {currentLesson.homeworkFileUrl && (
                      <Button 
                        className="bg-brand-teal hover:bg-brand-blue"
                        onClick={() => window.open(currentLesson.homeworkFileUrl, '_blank')}
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        {t('downloadHomework')}
                      </Button>
                    )}
                    
                    {currentLesson.homeworkFileUrl && currentUser && (
                      <div className="w-full mt-2">
                        <h3 className="text-lg font-medium mb-2">{t('homeworkSubmission')}</h3>
                        <HomeworkSubmissionForm lesson={currentLesson} />
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {getCategoryPath(selectedCategory)}
                </h2>
                
                {filteredLessons.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p>{t('noLessonsFound')}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLessons.map((lesson) => (
                      <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>{lesson.title}</CardTitle>
                          <CardDescription>
                            {getCategoryPath(lesson.categoryId)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="line-clamp-2">{lesson.description}</p>
                          
                          {lesson.teacherId && (
                            <div className="mt-3 flex items-center text-sm">
                              <span className="text-gray-500 mr-2">{t('teacher')}:</span>
                              <span className="font-medium flex items-center">
                                {getTeacherInfo(lesson.teacherId)?.fullName}
                                {getTeacherInfo(lesson.teacherId)?.rating && (
                                  <span className="ml-2 flex items-center">
                                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                    {getTeacherInfo(lesson.teacherId)?.rating}
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
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
