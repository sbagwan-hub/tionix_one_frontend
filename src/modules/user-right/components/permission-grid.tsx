'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export const COL_LABELS: Record<string, string> = {
  add: 'Add',
  edit: 'Edit',
  delete: 'Delete',
  view: 'View',
  print: 'Print',
  export: 'Export',
  rights: 'Active Rights',
};

interface PermissionGridProps<T extends Record<string, any>> {
  rows: T[];
  setRows: (rows: T[]) => void;
  cols: readonly (keyof T & string)[];
  colLabels: Record<string, string>;
  hasAuth?: boolean;
  isReport?: boolean;
  editable: boolean;
  markDirty: () => void;
  emptyText: string;
}

function PermissionGridInner<T extends Record<string, any>>({
  rows,
  setRows,
  cols,
  colLabels,
  hasAuth = false,
  isReport = false,
  editable,
  markDirty,
  emptyText,
}: PermissionGridProps<T>) {
  const getGroups = React.useCallback((data: T[]) => {
    const grps: { cap: string; items: { r: T; idx: number }[] }[] = [];
    data?.forEach((r, i) => {
      const cap = r.module_caption || r.module_name || 'General';
      let g = grps.find((g) => g.cap === cap);
      if (!g) {
        g = { cap, items: [] };
        grps.push(g);
      }
      g.items.push({ r, idx: i });
    });
    return grps;
  }, []);

  const groups = React.useMemo(() => getGroups(rows), [rows, getGroups]);

  const handleToggle = (idx: number, col: keyof T & string, checked: boolean) => {
    setRows(rows.map((row, i) => (i === idx ? { ...row, [col]: checked } : row)));
    markDirty();
  };

  return (
    <div className="w-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        [data-slot="table-container"] {
          overflow: visible !important;
        }
      `,
        }}
      />
      <Table className="min-w-full border-separate border-spacing-0 text-left">
        <TableHeader>
          <TableRow className="border-border bg-muted/50 dark:bg-muted/20 border-b">
            <TableHead className="bg-card text-muted-foreground sticky top-0 z-10 w-2/5 p-3 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              {isReport ? 'Report Form Title' : 'Form Title / Functional Module'}
            </TableHead>
            {cols.map((col) => (
              <TableHead
                key={col}
                className="bg-card text-muted-foreground sticky top-0 z-10 p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase"
              >
                {colLabels[col] || col}
              </TableHead>
            ))}
            {hasAuth && (
              <TableHead className="bg-card text-muted-foreground sticky top-0 z-10 p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                Auth
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-border divide-y">
          {groups.map((group) => (
            <React.Fragment key={group.cap}>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                <TableCell
                  colSpan={cols.length + (hasAuth ? 2 : 1)}
                  className="bg-muted/20 text-primary px-3 py-1.5 text-[11px] font-bold tracking-tight uppercase dark:text-blue-400"
                >
                  {group.cap}
                </TableCell>
              </TableRow>

              {/* Child Form Rows with Structural Tree Spacing */}
              {group.items.map(({ r, idx }) => (
                <TableRow
                  key={idx}
                  className="border-border/40 hover:bg-muted/40 border-b transition-colors"
                >
                  <TableCell className="text-foreground relative max-w-[280px] py-2 text-xs font-medium">
                    <div className="flex items-center pl-4">
                      <span
                        className="bg-foreground/20 before:bg-foreground/20 absolute top-0 bottom-0 left-3 w-[1px] before:absolute before:top-1/2 before:left-0 before:h-[1px] before:w-2 before:content-['']"
                        aria-hidden="true"
                      />
                      <span className="truncate pl-2 select-none" title={r.form_name}>
                        {r.form_name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Core Access Controls Matrices */}
                  {cols.map((col) => (
                    <TableCell key={col} className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={Boolean(r[col])}
                          disabled={!editable}
                          className="border-foreground data-[state=checked]:border-primary mr-2"
                          onCheckedChange={(checked) => {
                            handleToggle(idx, col, checked === true);
                          }}
                        />
                      </div>
                    </TableCell>
                  ))}

                  {hasAuth && (
                    <TableCell className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={Boolean((r as any).authorize)}
                          disabled={!editable}
                          className="border-muted-foreground data-[state=checked]:border-primary"
                          onCheckedChange={(checked) => {
                            handleToggle(idx, 'authorize' as any, checked === true);
                          }}
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {rows?.length === 0 && (
        <p className="text-muted-foreground py-12 text-center text-sm italic">{emptyText}</p>
      )}
    </div>
  );
}

export const PermissionGrid = React.memo(PermissionGridInner) as <T extends Record<string, any>>(
  props: PermissionGridProps<T>,
) => React.ReactElement;

export default PermissionGrid;
