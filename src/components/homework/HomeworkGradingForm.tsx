
import React, { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HomeworkSubmission } from '@/types';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HomeworkGradingFormProps {
  submission: HomeworkSubmission;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const HomeworkGradingForm: React.FC<HomeworkGradingFormProps> = ({ 
  submission, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { updateSubmission } = useContent();
  const { getUserById } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [grade, setGrade] = useState<number | undefined>(submission.grade);
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const student = getUserById(submission.userId);
  
  const handleSubmit = () => {
    try {
      if (grade === undefined || grade < 0 || grade > 100) {
        setError(t('invalidGrade'));
        return;
      }

      setIsSubmitting(true);
      
      updateSubmission(submission.id, {
        grade,
        feedback,
        status: 'graded'
      });
      
      toast({
        title: t('homeworkGraded'),
        description: t('homeworkGradedSuccess')
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('gradeHomework')}</DialogTitle>
          <DialogDescription>
            {t('gradeHomeworkDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">{t('submissionDetails')}</h3>
            <p><strong>{t('student')}:</strong> {student?.fullName || student?.username}</p>
            <p><strong>{t('submittedOn')}:</strong> {new Date(submission.submissionDate).toLocaleDateString()}</p>
            <p>
              <strong>{t('homeworkLink')}:</strong>
              <a 
                href={submission.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 ml-1 hover:underline"
              >
                {t('viewSubmission')}
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grade">{t('grade')} (0-100) *</Label>
            <Input
              id="grade"
              type="number"
              min="0"
              max="100"
              value={grade || ''}
              onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
              placeholder="0-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">{t('feedback')}</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t('enterFeedback')}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} className="bg-brand-teal hover:bg-brand-blue" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('saving')}
              </span>
            ) : (
              <span className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('submitGrade')}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
