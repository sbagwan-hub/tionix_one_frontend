'use client';

import * as React from 'react';
import { format, isValid } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  disabledDates?: (date: Date) => boolean;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  triggerClassName,
  disabledDates,
}: DatePickerProps) {
  const parsedDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return isValid(d) ? d : undefined;
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && onChange) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      {label && (
        <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'bg-background/50 border-input flex h-9 w-full items-center justify-between rounded-sm border px-3 text-left text-xs font-normal',
              !parsedDate && 'text-muted-foreground',
              disabled && 'cursor-not-allowed opacity-50',
              triggerClassName,
            )}
            disabled={disabled}
          >
            {parsedDate ? format(parsedDate, 'PPP') : <span>{placeholder}</span>}
            <CalendarIcon className="h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-10000 w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={parsedDate}
            onSelect={handleSelect}
            captionLayout="dropdown"
            startMonth={new Date(1900, 0)}
            endMonth={new Date(new Date().getFullYear() + 20, 11)}
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
