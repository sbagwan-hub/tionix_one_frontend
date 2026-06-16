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

    // Helper to format text labels and colorize asterisks dynamically
    const renderLabelContent = (node: React.ReactNode) => {
      if (typeof node === 'string' && node.includes('*')) {
        const parts = node.split(/(\*)/);
        return parts.map((part, i) =>
          part === '*' ? (
            <span key={i} className="text-destructive ml-0.5 font-medium" aria-hidden="true">
              *
            </span>
          ) : (
            part
          ),
        );
      }
      return node;
    };

    return (
      <div className={cn('flex w-full flex-col gap-1.5', containerClassName)}>
        {/* Label block */}
        {label && (
          <Label
            htmlFor={inputId}
            className="text-foreground text-[12px] font-semibold tracking-wider"
          >
            {renderLabelContent(label)}
          </Label>
        )}

        {/* Input area element with layered wrapper */}
        <div className="relative w-full">
          {Icon && (
            <div className="text-muted-foreground/70 pointer-events-none absolute top-1/2 left-0 z-10 flex -translate-y-1/2 items-center px-3">
              <Icon className="h-4 w-4" />
            </div>
          )}

          <Input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'bg-background border-border/80 focus-visible:ring-primary focus-visible:border-primary h-9 rounded-lg text-xs font-medium transition-all focus-visible:ring-1 focus-visible:outline-none',
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
          <span className="text-destructive animate-in fade-in text-[12px] font-medium tracking-tight duration-200">
            {error}
          </span>
        )}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;
