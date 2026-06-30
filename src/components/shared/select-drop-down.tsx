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
        'bg-background hover:bg-muted/50 border-border/80 flex h-8 cursor-pointer items-center gap-2 rounded-md border px-3 transition-colors',
        className,
      )}
    >
      {/* Clean label styling with comfortable spacing */}
      <span className="text-muted-foreground shrink-0 text-xs font-medium tracking-tight">
        {label}
      </span>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            'text-foreground h-full cursor-pointer gap-1.5 border-0 bg-transparent p-0 text-xs font-medium shadow-none hover:ring-0 focus:ring-0',
            width ?? 'min-w-[90px]',
          )}
        >
          <SelectValue
            placeholder={placeholder ?? options.find((o) => o.value === value)?.label ?? 'Select'}
            className="cursor-pointer ring-0"
          />
        </SelectTrigger>

        <SelectContent
          position="popper"
          side="bottom"
          sideOffset={4}
          align="end"
          style={{
            width: wrapperWidth,
            minWidth: wrapperWidth,
          }}
          className={cn(
            'border-border bg-popover rounded-md border p-1 ring-0',
            selectContentClassName,
          )}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer rounded-sm px-2 py-1.5 text-xs font-medium tracking-tight transition-colors"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
