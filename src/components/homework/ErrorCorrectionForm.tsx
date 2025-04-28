
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from '@/types';

interface ErrorCorrectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  onSuccess?: () => void;
}

export const ErrorCorrectionForm: React.FC<ErrorCorrectionFormProps> = ({ 
  isOpen, 
  onClose, 
  categoryId,
  onSuccess 
}) => {
  const { addLesson } = useContent();
  const { currentUser, users } = useAuth();
  const { t } = useLanguage();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [homeworkFileUrl, setHomeworkFileUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter only student users
  const students = users.filter(user => user.role === 'user');
  
  const handleSubmit = () => {
    try {
      if (!title || !description || !homeworkFileUrl || !videoUrl || !dueDate) {
        setError(t('allFieldsRequired'));
        return;
      }
      
      if (!currentUser || currentUser.role !== 'teacher') {
        setError(t('onlyTeachersCanAssign'));
        return;
      }

      setIsSubmitting(true);
      
      // Add the new error correction task as a lesson with specific metadata
      addLesson({
        title: `${t('errorCorrection')}: ${title}`,
        description,
        videoUrl,
        homeworkFileUrl,
        categoryId,
        teacherId: currentUser.id,
        dueDate
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setHomeworkFileUrl('');
      setVideoUrl('');
      setDueDate(undefined);
      setError(null);
      
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
          <DialogTitle>{t('createErrorCorrectionTask')}</DialogTitle>
          <DialogDescription>
            {t('errorCorrectionTaskDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">{t('taskTitle')} *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('enterTaskTitle')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('description')} *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('enterDescription')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoUrl">{t('videoUrl')} *</Label>
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="homeworkFileUrl">{t('taskMaterialUrl')} *</Label>
            <Input
              id="homeworkFileUrl"
              value={homeworkFileUrl}
              onChange={(e) => setHomeworkFileUrl(e.target.value)}
              placeholder="https://example.com/task.pdf"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">{t('dueDate')} *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : t('selectDueDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>{t('assignToStudents')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {students.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, student.id]);
                      } else {
                        setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <label htmlFor={`student-${student.id}`} className="text-sm">
                    {student.fullName || student.username}
                  </label>
                </div>
              ))}
            </div>
            {students.length === 0 && (
              <p className="text-sm text-gray-500">{t('noStudentsAvailable')}</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} className="bg-brand-blue hover:bg-brand-lightBlue" disabled={isSubmitting}>
            {isSubmitting ? t('creating') : t('createErrorTask')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
