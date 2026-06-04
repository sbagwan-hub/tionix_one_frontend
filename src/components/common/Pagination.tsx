'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
}: PaginationProps) {
  const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRecords || 0);

  return (
    <div
      className={`flex flex-col items-center justify-between gap-4 py-4 sm:flex-row ${className}`}
    >
      <div className="text-muted-foreground text-xs font-medium tracking-wide">
        {totalRecords !== undefined ? (
          <span>
            Showing <strong className="text-foreground">{startItem}</strong> to{' '}
            <strong className="text-foreground">{endItem}</strong> of{' '}
            <strong className="text-foreground">{totalRecords}</strong> results
          </span>
        ) : (
          <span>
            Page <strong className="text-foreground">{currentPage}</strong> of{' '}
            <strong className="text-foreground">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(val) => onPageSizeChange(Number(val))}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <span className="text-foreground/80 mx-2 text-xs font-semibold">
            {currentPage} / {totalPages || 1}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
