'use client';

import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { FormInput } from '@/components/common/form-input';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  debounceMs?: number;
}

export function SearchBox({
  placeholder = 'Search...',
  value = '',
  onChange,
  className = '',
  debounceMs = 300,
}: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    onChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onChange]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <FormInput
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={Search}
        containerClassName="w-full"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 z-20 -translate-y-1/2 rounded-full p-0.5 outline-hidden"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Clear</span>
        </button>
      )}
    </div>
  );
}
