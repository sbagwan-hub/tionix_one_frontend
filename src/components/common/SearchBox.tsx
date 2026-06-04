'use client';

import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
      <Search className="text-muted-foreground absolute left-2.5 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-background border-input pr-8 pl-9"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground absolute right-2.5 rounded-full p-0.5 outline-hidden"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Clear</span>
        </button>
      )}
    </div>
  );
}
