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
import { cn } from '@/lib/utils';

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
  className,
}: PaginationProps) {
  const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRecords || 0);
  const totalPagesCount = totalPages || 1;

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-between gap-3 py-1.5 sm:flex-row',
        className,
      )}
    >
      {/* Left side: Range Statistics */}
      <div className="text-muted-foreground text-xs font-medium tracking-tight">
        {totalRecords !== undefined ? (
          <span>
            Showing <span className="text-foreground font-semibold">{startItem}</span>–
            <span className="text-foreground font-semibold">{endItem}</span> of{' '}
            <span className="text-foreground font-semibold">{totalRecords}</span>
          </span>
        ) : (
          <span>
            Page <span className="text-foreground font-semibold">{currentPage}</span> of{' '}
            <span className="text-foreground font-semibold">{totalPagesCount}</span>
          </span>
        )}
      </div>

      {/* Right side: Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium tracking-tight">
              Rows per page
            </span>
            <Select value={String(pageSize)} onValueChange={(val) => onPageSizeChange(Number(val))}>
              <SelectTrigger className="h-7 w-[64px] rounded-sm px-2 text-xs shadow-none">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="rounded-xs text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Navigation Button Block */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
            <span className="sr-only">First page</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="sr-only">Previous page</span>
          </Button>

          <span className="text-foreground min-w-[48px] px-1 text-center text-xs font-medium tracking-tight">
            {currentPage} / {totalPagesCount}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPagesCount}
          >
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="sr-only">Next page</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-sm"
            onClick={() => onPageChange(totalPagesCount)}
            disabled={currentPage >= totalPagesCount}
          >
            <ChevronsRight className="h-3.5 w-3.5" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
