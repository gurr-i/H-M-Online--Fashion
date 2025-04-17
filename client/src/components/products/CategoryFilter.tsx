import React from "react";
import { useLocation } from "wouter";
import { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  parentCategory?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  parentCategory 
}) => {
  const [, setLocation] = useLocation();

  const filteredCategories = parentCategory
    ? categories.filter((category) => 
        category.parentId === categories.find((c) => c.slug === parentCategory)?.id
      )
    : categories.filter((category) => category.parentId === null);

  const handleCategoryClick = (slug: string) => {
    if (parentCategory) {
      setLocation(`/${parentCategory}/${slug}`);
    } else {
      setLocation(`/${slug}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
      {filteredCategories.map((category) => (
        <Button
          key={category.id}
          variant="ghost"
          className={`category-filter ${selectedCategory === category.slug ? 'active' : ''}`}
          onClick={() => handleCategoryClick(category.slug)}
        >
          {category.name.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
