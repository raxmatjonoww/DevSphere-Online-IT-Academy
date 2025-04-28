
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FolderTree, Search } from 'lucide-react';
import { Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface CategorySidebarProps {
  selectedCategory: string | null;
  rootCategories: Category[];
  getSubcategories: (parentId: string) => Category[];
  handleCategoryClick: (categoryId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  rootCategories,
  getSubcategories,
  handleCategoryClick,
  searchTerm,
  setSearchTerm,
}) => {
  const { t } = useLanguage();

  return (
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
            {/* All Lessons option */}
            <Button
              variant={!selectedCategory ? "secondary" : "ghost"}
              onClick={() => handleCategoryClick('')}
              className="w-full justify-start"
            >
              {t('allLessons')}
            </Button>
            
            {/* Root categories */}
            {rootCategories.map((category) => (
              <CategoryItem 
                key={category.id}
                category={category}
                selectedCategory={selectedCategory}
                getSubcategories={getSubcategories}
                handleCategoryClick={handleCategoryClick}
              />
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
  );
};

interface CategoryItemProps {
  category: Category;
  selectedCategory: string | null;
  getSubcategories: (parentId: string) => Category[];
  handleCategoryClick: (categoryId: string) => void;
  depth?: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  selectedCategory,
  getSubcategories,
  handleCategoryClick,
  depth = 0,
}) => {
  const subcategories = getSubcategories(category.id);
  const isSelected = selectedCategory === category.id;
  const hasSelectedChild = subcategories.some(
    subcat => subcat.id === selectedCategory || getSubcategories(subcat.id).some(
      subsubcat => subsubcat.id === selectedCategory
    )
  );

  // Whether to show subcategories
  const showSubcategories = isSelected || hasSelectedChild;

  return (
    <div key={category.id}>
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        onClick={() => handleCategoryClick(category.id)}
        className="w-full justify-start"
        style={{ 
          fontSize: depth === 0 ? '1rem' : depth === 1 ? '0.875rem' : '0.75rem' 
        }}
      >
        {category.name}
      </Button>
      
      {/* Show subcategories if needed */}
      {showSubcategories && subcategories.length > 0 && (
        <div className="pl-4 space-y-1 mt-1">
          {subcategories.map(subcategory => (
            <CategoryItem
              key={subcategory.id}
              category={subcategory}
              selectedCategory={selectedCategory}
              getSubcategories={getSubcategories}
              handleCategoryClick={handleCategoryClick}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
