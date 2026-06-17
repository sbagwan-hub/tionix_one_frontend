'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CategoryItem {
  pk_cat_id: number;
  category: string;
}

interface CategoriesSectionProps {
  categories: CategoryItem[];
  selectedCategories: number[];
  toggleCategory: (catId: number) => void;
  disabled?: boolean;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  disabled = false,
}) => {
  return (
    <div className="border-border/80 bg-background/50 space-y-2.5 rounded-sm border p-3">
      <Label className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase">
        Select Categories
      </Label>
      <div className="grid grid-cols-2 gap-2 pr-1">
        {categories.length === 0 ? (
          <p className="text-muted-foreground col-span-2 py-1 text-xs italic">
            No categories found
          </p>
        ) : (
          categories.map((cat) => (
            <div key={cat.pk_cat_id} className="flex items-center gap-2">
              <Checkbox
                id={String(cat.pk_cat_id)}
                disabled={disabled}
                checked={selectedCategories.includes(cat.pk_cat_id)}
                onCheckedChange={() => toggleCategory(cat.pk_cat_id)}
                className="mr-2"
              />
              <Label htmlFor={String(cat.pk_cat_id)} className="cursor-pointer truncate text-xs">
                {cat.category}
              </Label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
