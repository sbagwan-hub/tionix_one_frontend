'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SelectDropDownProps = {
  label: string;
  value?: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange?: (value: string) => void;
  width?: string;
  className?: string;
  selectContentClassName?: string;
};

export function SelectDropDown({
  label,
  value,
  placeholder,
  options,
  onChange,
  width,
  className,
  selectContentClassName,
}: SelectDropDownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const update = () => setWrapperWidth(wrapperRef.current?.offsetWidth ?? 0);

    update();

    const observer = new ResizeObserver(update);
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'bg-accent border-border flex cursor-pointer items-center gap-1 rounded-md border px-2 py-0.5',
        className,
      )}
    >
      <span className="text-muted-foreground text-[11px] font-medium">{label}:</span>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            'text-foreground h-5 cursor-pointer border-0 bg-transparent p-0 text-xs shadow-none hover:ring-0 focus:ring-0',
            width ?? 'min-w-24',
          )}
        >
          <SelectValue
            placeholder={placeholder ?? options.find((o) => o.value === value)?.label ?? 'Select'}
            className="cursor-pointer ring-0"
          />
        </SelectTrigger>

        <SelectContent
          position="popper"
          side="top"
          sideOffset={4}
          align="end"
          style={{
            width: wrapperWidth,
            minWidth: wrapperWidth,
          }}
          className={cn(
            'border-border bg-popover rounded-sm border p-0 shadow-md ring-0',
            selectContentClassName,
          )}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer px-2.5 py-2.5 text-xs"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
