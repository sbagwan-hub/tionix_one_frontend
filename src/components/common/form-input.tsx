'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  icon?: React.ElementType;
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon: Icon, className, id, disabled, containerClassName, ...props }, ref) => {
    const inputId = id ?? 'form-input';

    return (
      <div className={cn('flex w-full flex-col gap-1.5', containerClassName)}>
        {/* Label block */}
        {label && (
          <Label
            htmlFor={inputId}
            className="text-muted-foreground block text-xs font-medium tracking-tight select-none"
          >
            {label}
          </Label>
        )}

        {/* Input area element with layered wrapper */}
        <div className="relative w-full">
          {Icon && (
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-0 z-10 flex -translate-y-1/2 items-center px-3">
              <Icon className="h-4 w-4" />
            </div>
          )}

          <Input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'bg-background/50 border-border h-8 rounded-md text-xs font-medium shadow-none transition-all outline-none',
              'focus:bg-background focus:ring-ring focus:border-ring focus:ring-1',
              Icon ? 'pr-3 pl-9' : 'px-3',
              error &&
                'border-destructive focus:border-destructive focus:ring-destructive/30 bg-destructive/5 dark:bg-destructive/10',
              className,
            )}
            {...props}
          />
        </div>

        {/* Error notification node */}
        {error && (
          <span className="text-destructive animate-in fade-in text-[10px] font-medium tracking-tight duration-200">
            {error}
          </span>
        )}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
