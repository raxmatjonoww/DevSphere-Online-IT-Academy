
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
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export default function UserManagement() {
  const { users, addUser, deleteUser } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = () => {
    setIsSubmitting(true);
    try {
      if (!newUsername || !newPassword) {
        setError('Пожалуйста, заполните все обязательные поля.');
        setIsSubmitting(false);
        return;
      }

      // Check if username already exists
      const usernameExists = users.some(user => 
        user.username.toLowerCase() === newUsername.toLowerCase()
      );
      
      if (usernameExists) {
        setError('Имя пользователя уже существует.');
        setIsSubmitting(false);
        return;
      }

      // Create new user with additional student information
      addUser(
        newUsername, 
        newPassword, 
        newRole, 
        fullName,
        undefined, // subjectArea (for teachers only)
        studentId,
        email,
        phoneNumber
      );
      
      // Show success toast
      toast({
        title: t('userCreated'),
        description: t('userCreatedDesc'),
      });
      
      // Reset form
      setNewUsername('');
      setNewPassword('');
      setNewRole('user');
      setFullName('');
      setStudentId('');
      setEmail('');
      setPhoneNumber('');
      setError(null);
      setIsDialogOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    try {
      deleteUser(userId);
      toast({
        title: t('userDeleted'),
        description: t('userDeletedDesc'),
      });
    } catch (err) {
      toast({
        title: t('error'),
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout adminOnly>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('userManagement')}</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-blue hover:bg-brand-lightBlue">
                <Plus className="mr-2 h-4 w-4" />
                {t('addUser')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('createNewUser')}</DialogTitle>
                <DialogDescription>
                  {t('addNewUserDesc')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">{t('username')} *</Label>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder={t('enterUsername')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')} *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('enterPassword')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">{t('role')} *</Label>
                  <select
                    id="role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="user">{t('student')}</option>
                    <option value="admin">{t('admin')}</option>
                  </select>
                </div>

                {/* Student information fields - only display if role is 'user' */}
                {newRole === 'user' && (
                  <>
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
                      <Label htmlFor="studentId">{t('studentId')}</Label>
                      <Input
                        id="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder={t('enterStudentId')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('enterEmail')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={t('enterPhoneNumber')}
                      />
                    </div>
                  </>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={() => setIsDialogOpen(false)} 
                  variant="outline"
                >
                  {t('cancel')}
                </Button>
                <Button 
                  onClick={handleCreateUser}
                  className="bg-brand-blue hover:bg-brand-lightBlue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('saving') : t('saveUser')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('users')}</CardTitle>
            <CardDescription>
              {t('manageUsersDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('username')}</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead>{t('fullName')}</TableHead>
                  <TableHead>{t('studentId')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('created')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-brand-teal text-white' : 'bg-gray-200'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.fullName || '-'}</TableCell>
                    <TableCell>{user.studentId || '-'}</TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {user.role !== 'admin' || user.id !== 'admin-1' ? (
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
                                {t('confirmDeleteUser')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-500 hover:bg-red-700"
                              >
                                {t('delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <span className="text-sm text-gray-400">{t('mainAdmin')}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
