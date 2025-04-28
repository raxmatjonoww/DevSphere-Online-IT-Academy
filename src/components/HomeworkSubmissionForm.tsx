
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import { Lesson } from '@/types';

interface HomeworkSubmissionFormProps {
  lesson: Lesson;
}

export const HomeworkSubmissionForm: React.FC<HomeworkSubmissionFormProps> = ({ lesson }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { addSubmission } = useContent();
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: t('error'),
        description: t('pleaseSelectFile'),
        variant: 'destructive',
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: t('error'),
        description: t('mustBeLoggedIn'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would upload the file to a server here
      // For now, we'll simulate a successful upload
      const fileUrl = URL.createObjectURL(file);
      
      // Add the submission to our context
      addSubmission({
        id: `submission-${Date.now()}`,
        userId: currentUser.id,
        lessonId: lesson.id,
        fileUrl,
        submissionDate: new Date(),
        status: 'pending',
        grade: null,
        feedback: null,
      });

      toast({
        title: t('success'),
        description: t('homeworkSubmitted'),
      });

      // Reset the form
      setFile(null);
      const fileInput = document.getElementById('homework-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: t('error'),
        description: t('submissionFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="homework-file">{t('selectHomeworkFile')}</Label>
            <Input
              id="homework-file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.zip"
            />
            <p className="text-xs text-gray-500">
              {t('acceptedFileFormats')}: PDF, DOC, DOCX, ZIP
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={!file || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? t('submitting') : t('submitHomework')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HomeworkSubmissionForm;
