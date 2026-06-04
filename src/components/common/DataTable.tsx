'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  rowClassName?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No results found.',
  onRowClick,
  rowClassName = '',
  className = '',
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'border-border/40 bg-card w-full overflow-x-auto rounded-lg border shadow-sm',
        className,
      )}
    >
      <Table className="min-w-full table-auto">
        <TableHeader className="bg-muted/30">
          <TableRow className="border-border/30 border-b">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  'text-foreground/80 h-10 py-3 text-xs font-bold tracking-wide select-none',
                  col.className,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="text-primary h-6 w-6 animate-spin" />
                  <span className="text-muted-foreground text-xs font-semibold">
                    Loading data...
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Database className="text-muted-foreground/60 h-7 w-7" />
                  <span className="text-muted-foreground text-xs font-semibold">
                    {emptyMessage}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
                className={cn(
                  'border-border/20 hover:bg-muted/10 border-b transition-colors',
                  { 'cursor-pointer': !!onRowClick },
                  rowClassName,
                )}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn('text-foreground/90 py-3.5 text-xs font-medium', col.className)}
                  >
                    {col.render ? col.render(row, rowIndex) : (row as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
