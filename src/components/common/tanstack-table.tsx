'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Database, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TanStackTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  selectedRowId?: number | string | null;
  getRowId?: (row: T) => number | string;
  rowClassName?: string | ((row: T, index: number) => string);
  className?: string;
}

export function TanStackTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found matching filters.',
  onRowClick,
  onRowDoubleClick,
  selectedRowId,
  getRowId,
  rowClassName,
  className,
}: TanStackTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className={cn(
        'bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border',
        className,
      )}
    >
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-muted/40 text-muted-foreground border-b text-[11px] font-bold uppercase select-none"
              >
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const sortState = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'p-3 font-bold transition-colors select-none',
                        isSortable && 'hover:bg-muted/65 hover:text-foreground cursor-pointer',
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ width: header.column.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1">
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {isSortable && (
                            <span className="text-muted-foreground/50 shrink-0">
                              {sortState === 'asc' ? (
                                <ArrowUp className="text-primary h-3 w-3" />
                              ) : sortState === 'desc' ? (
                                <ArrowDown className="text-primary h-3 w-3" />
                              ) : (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="text-primary h-6 w-6 animate-spin" />
                    <span className="text-muted-foreground text-xs font-semibold">
                      Loading data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Database className="text-muted-foreground/60 h-7 w-7" />
                    <span className="text-muted-foreground text-xs font-semibold">
                      {emptyMessage}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rowIndex) => {
                const item = row.original;
                const rowId = getRowId ? getRowId(item) : rowIndex;
                const isSelected =
                  selectedRowId !== undefined && selectedRowId !== null && selectedRowId === rowId;

                return (
                  <tr
                    key={row.id}
                    className={cn(
                      'cursor-pointer transition-colors',
                      isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/40',
                      typeof rowClassName === 'function'
                        ? rowClassName(item, rowIndex)
                        : rowClassName,
                    )}
                    onClick={() => onRowClick && onRowClick(item, rowIndex)}
                    onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(item, rowIndex)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
