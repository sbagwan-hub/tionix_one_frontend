'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CategoriesSectionProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
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
      <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
        S Friend, Business, Associate, Relative
      </Label>
      <div className="grid min-h-[180px] grid-cols-2 gap-2 overflow-y-auto pr-1">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-2">
            <Checkbox
              id={cat}
              disabled={disabled}
              checked={selectedCategories.includes(cat)}
              onCheckedChange={() => toggleCategory(cat)}
              className="mr-2"
            />
            <Label htmlFor={cat} className="cursor-pointer truncate text-xs">
              {cat}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
