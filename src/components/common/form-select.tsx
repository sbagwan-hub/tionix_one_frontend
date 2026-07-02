'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: FormSelectOption[];
  disabled?: boolean;
  error?: string;
  id?: string;
  className?: string;
  containerClassName?: string;
}

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      label,
      value,
      onValueChange,
      placeholder,
      options = [],
      disabled,
      error,
      id,
      className,
      containerClassName,
    },
    ref,
  ) => {
    const triggerId = id ?? 'form-select-trigger';

    return (
      <div className={cn('flex w-full flex-col gap-1.5', containerClassName)}>
        {/* Label block */}
        {label && (
          <Label
            htmlFor={triggerId}
            className="text-foreground text-[12px] font-semibold tracking-wider"
          >
            {label}
          </Label>
        )}

        {/* Select Wrapper */}
        <div className="relative w-full">
          <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
              ref={ref}
              id={triggerId}
              className={cn(
                'border-border/80 focus:ring-primary focus:border-primary bg-background/50 h-9 w-full rounded-lg text-xs font-medium transition-all focus:ring-1 focus:outline-none',
                error &&
                  'border-destructive focus:border-destructive focus:ring-destructive/30 bg-destructive/5 dark:bg-destructive/10',
                className,
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent
              position="popper"
              sideOffset={4}
              className="z-10000 max-h-60 overflow-y-auto"
            >
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer text-xs"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error notification block */}
        {error && (
          <span className="text-destructive animate-in fade-in text-[12px] font-medium tracking-tight duration-200">
            {error}
          </span>
        )}
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
