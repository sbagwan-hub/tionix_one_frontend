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
  disabledDates?: (date: Date) => boolean;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Pick a date',
  disabled = false,
  className,
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
    <div className={cn('flex flex-col gap-1 w-full', className)}>
      {label && (
        <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'h-9 text-left font-normal rounded-sm w-full bg-background/50 border border-input text-xs px-3 flex items-center justify-between',
              !parsedDate && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
          >
            {parsedDate ? format(parsedDate, 'PPP') : <span>{placeholder}</span>}
            <CalendarIcon className="h-3.5 w-3.5 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
