
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/context/LanguageContext';
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
import { 
  Pencil, 
  Plus, 
  Trash2, 
  FolderPlus, 
  FolderTree 
} from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { Textarea } from '@/components/ui/textarea';

export default function CategoryManagement() {
  const { t } = useLanguage();
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    getCategoryById 
  } = useContent();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [subcategoryParentId, setSubcategoryParentId] = useState<string>('');
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = () => {
    try {
      if (!name) {
        setError('Название категории обязательно');
        return;
      }

      addCategory(name, description, parentId);
      
      // Reset form
      resetForm();
      setIsAddDialogOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddSubcategory = () => {
    try {
      if (!name) {
        setError('Название категории обязательно');
        return;
      }

      addCategory(name, description, subcategoryParentId);
      
      // Reset form
      resetForm();
      setIsSubcategoryDialogOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEditCategory = () => {
    try {
      if (!currentCategoryId || !name) {
        setError('Название категории обязательно');
        return;
      }

      updateCategory(currentCategoryId, {
        name,
        description,
        parentId: parentId || null,
      });
      
      // Reset form
      resetForm();
      setIsEditDialogOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    try {
      deleteCategory(categoryId);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setParentId(undefined);
    setSubcategoryParentId('');
    setCurrentCategoryId(null);
    setError(null);
  };

  const openEditDialog = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    if (category) {
      setCurrentCategoryId(categoryId);
      setName(category.name);
      setDescription(category.description);
      setParentId(category.parentId || undefined);
      setIsEditDialogOpen(true);
    }
  };

  const openSubcategoryDialog = (parentCategoryId: string) => {
    setSubcategoryParentId(parentCategoryId);
    setIsSubcategoryDialogOpen(true);
  };

  // Get all categories for parent selection
  const allCategories = categories;

  // Get parent name for display
  const getParentName = (parentId: string | null | undefined) => {
    if (!parentId) return '-';
    const parent = getCategoryById(parentId);
    return parent ? parent.name : '-';
  };

  // Get category path for display (e.g., "Programming > Python")
  const getCategoryPath = (categoryId: string | null): string => {
    if (!categoryId) return '-';
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '-';
    
    let path = category.name;
    let currentCatId = category.parentId;
    
    // Traverse up the category hierarchy
    while (currentCatId) {
      const parentCat = categories.find(c => c.id === currentCatId);
      if (!parentCat) break;
      
      path = `${parentCat.name} > ${path}`;
      currentCatId = parentCat.parentId;
    }
    
    return path;
  };

  return (
    <Layout adminOnly>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('categories')}</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-blue hover:bg-brand-lightBlue">
                <Plus className="mr-2 h-4 w-4" />
                {t('categories')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Создать новую категорию</DialogTitle>
                <DialogDescription>
                Добавьте новую категорию, чтобы организовать ваши уроки
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">{t('categories')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter category description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parent">{t('parentCategory')}</Label>
                  <select
                    id="parent"
                    value={parentId || ''}
                    onChange={(e) => setParentId(e.target.value || undefined)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">{t('noneRootCategory')}</option>
                    {allCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {getCategoryPath(category.id)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsAddDialogOpen(false)} variant="outline">
                Отмена
                </Button>
                <Button onClick={handleAddCategory} className="bg-brand-blue hover:bg-brand-lightBlue">
                Создать категорию
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Subcategory Dialog */}
          <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('addSubcategory')}</DialogTitle>
                <DialogDescription>
                Добавить подкатегорию в {getCategoryById(subcategoryParentId)?.name || ''}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="subcategory-name">{t('categories')}</Label>
                  <Input
                    id="subcategory-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter subcategory name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subcategory-description">Description</Label>
                  <Textarea
                    id="subcategory-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter subcategory description"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsSubcategoryDialogOpen(false)} variant="outline">
                Отмена
                </Button>
                <Button onClick={handleAddSubcategory} className="bg-brand-blue hover:bg-brand-lightBlue">
                Добавить подкатегорию
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Редактировать категорию</DialogTitle>
                <DialogDescription>
                Обновить выбранную категорию
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="edit-name">{t('categories')}</Label>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-parent">{t('parentCategory')}</Label>
                  <select
                    id="edit-parent"
                    value={parentId || ''}
                    onChange={(e) => setParentId(e.target.value || undefined)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">{t('noneRootCategory')}</option>
                    {allCategories
                      .filter(category => category.id !== currentCategoryId)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {getCategoryPath(category.id)}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsEditDialogOpen(false)} variant="outline">
                Отмена
                </Button>
                <Button onClick={handleEditCategory} className="bg-brand-blue hover:bg-brand-lightBlue">
                Обновить категорию
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('categories')}</CardTitle>
            <CardDescription>
            Управляйте категориями курсов и организуйте свой контент
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('categories')}</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>{t('parentCategory')}</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{getParentName(category.parentId)}</TableCell>
                    <TableCell>{category.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-green-500 hover:text-green-700 hover:bg-green-50"
                        onClick={() => openSubcategoryDialog(category.id)}
                        title="Добавить подкатегорию"
                      >
                        <FolderPlus size={16} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => openEditDialog(category.id)}
                        title="Изменить категорию"
                      >
                        <Pencil size={16} />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Удалить категорию"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
                            <AlertDialogDescription>
                            Вы уверены, что хотите удалить категорию? "{category.name}"?
                            Это действие не может быть отменено. Все уроки в этой категории должны быть сначала перемещены или удалены.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCategory(category.id)}
                              className="bg-red-500 hover:bg-red-700"
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
