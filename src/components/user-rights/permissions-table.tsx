import React from 'react';
import ModuleRow, { ModuleRowData } from './module-row';
import PermissionTabs from './permission-tabs';
import { cn } from '@/lib/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export interface ModuleGroup {
  group: string;
  rows: ModuleRowData[];
}

interface PermissionTableProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  modules?: ModuleGroup[];
  className?: string;
}

export default function PermissionTable({
  tabs,
  activeTab,
  setActiveTab,
  modules = [],
  className,
}: PermissionTableProps) {
  return (
    <div
      className={cn(
        'border-border bg-card dark:border-input/70 dark:bg-card flex h-full max-h-full min-h-0 flex-col overflow-hidden rounded-sm border shadow-sm',
        className,
      )}
    >
      <PermissionTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
        <Table className="min-w-full border-separate border-spacing-0 text-left">
          <TableHeader>
            <TableRow className="border-border bg-muted/50 dark:bg-muted/20 border-b">
              <TableHead className="text-muted-foreground w-2/5 p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
                Form Title / Functional Module
              </TableHead>

              <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                Add
              </TableHead>

              <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                Edit
              </TableHead>

              <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                Delete
              </TableHead>

              <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                View
              </TableHead>

              <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                Print
              </TableHead>

              <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                Export
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-border divide-y">
            {modules.map((group) => (
              <React.Fragment key={group.group}>
                {/* Group Header */}
                <TableRow className="bg-brand-muted/20 dark:bg-brand-muted/30">
                  <TableCell
                    colSpan={7}
                    className="text-brand px-4 py-2.5 text-xs font-semibold tracking-wide uppercase"
                  >
                    {group.group}
                  </TableCell>
                </TableRow>

                {/* Rows */}
                {group.rows.map((row) => (
                  <ModuleRow key={row.id} row={row} />
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
