'use client';

import * as React from 'react';
import {
  Search,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WorkTimingListTabProps {
  onSelect: (record: any) => void;
  filterShift: string;
  setFilterShift: (val: string) => void;
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
  pageSize: number;
  recordsData: any;
  isLoading: boolean;
  selectedId: number | null;
  employees: any[];
}

export const WorkTimingListTab: React.FC<WorkTimingListTabProps> = ({
  onSelect,
  filterShift,
  setFilterShift,
  page,
  setPage,
  pageSize,
  recordsData,
  isLoading,
  selectedId,
  employees = [],
}) => {
  const records = recordsData?.rows || [];
  const totalRecords = recordsData?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const formatDate = (dateStr?: string | Date | null) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '-';
    }
  };

  const getEmployeeName = (empId: number) => {
    const emp = employees.find((e) => e.pk_emp_id === empId);
    return emp ? emp.employee : `ID: ${empId}`;
  };

  const getEmployeeCode = (empId: number) => {
    const emp = employees.find((e) => e.pk_emp_id === empId);
    return emp ? emp.emp_code : '-';
  };

  return (
    <div className="bg-card/25 border-border/40 flex h-full min-h-0 flex-col overflow-hidden rounded-lg border backdrop-blur-md">
      {/* Search Header */}
      <div className="border-border/40 bg-muted/20 flex items-center gap-3 border-b p-3">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
          <Input
            placeholder="Filter by shift or type..."
            value={filterShift}
            onChange={(e) => {
              setFilterShift(e.target.value);
              setPage(1);
            }}
            className="bg-background/60 border-border/60 focus-visible:ring-primary/40 h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-muted/40 border-border/40 text-muted-foreground border-b text-[9px] font-bold tracking-wider uppercase">
              <th className="p-2.5 pl-4">Emp Code</th>
              <th className="p-2.5">Employee Name</th>
              <th className="p-2.5">Shift</th>
              <th className="p-2.5">Type</th>
              <th className="p-2.5 text-center">Work hours</th>
              <th className="p-2.5 text-center">Break min</th>
              <th className="p-2.5">Start Date</th>
              <th className="p-2.5 pr-4">End Date</th>
            </tr>
          </thead>
          <tbody className="divide-border/25 divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-muted-foreground p-8 text-center">
                  <Loader2 className="text-primary mx-auto mb-2 h-5 w-5 animate-spin" />
                  Loading work timings...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-muted-foreground p-8 text-center">
                  No work timing records found.
                </td>
              </tr>
            ) : (
              records.map((rec: any) => (
                <tr
                  key={rec.pk_wt_id}
                  onClick={() => onSelect(rec)}
                  className={`hover:bg-primary/5 cursor-pointer transition-colors ${
                    selectedId === rec.pk_wt_id ? 'bg-primary/10 text-primary font-medium' : ''
                  }`}
                >
                  <td className="text-muted-foreground p-2.5 pl-4 font-mono">
                    {getEmployeeCode(rec.fk_emp_id)}
                  </td>
                  <td className="text-foreground p-2.5 font-semibold">
                    {getEmployeeName(rec.fk_emp_id)}
                  </td>
                  <td className="text-foreground p-2.5">{rec.shift}</td>
                  <td className="text-muted-foreground p-2.5">{rec.type}</td>
                  <td className="text-foreground p-2.5 text-center font-mono font-bold">
                    {Number(rec.t_work).toFixed(2)}
                  </td>
                  <td className="text-muted-foreground p-2.5 text-center font-mono">
                    {Number(rec.t_break).toFixed(0)}
                  </td>
                  <td className="text-muted-foreground p-2.5 font-mono">{formatDate(rec.tsd)}</td>
                  <td className="text-muted-foreground p-2.5 pr-4 font-mono">
                    {formatDate(rec.ted)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="border-border/40 bg-muted/20 text-muted-foreground flex items-center justify-between border-t p-2.5 text-xs">
          <span>
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalRecords)} of{' '}
            {totalRecords}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="border-border/60 hover:bg-muted/50 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border transition-all disabled:opacity-50"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="border-border/60 hover:bg-muted/50 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border transition-all disabled:opacity-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-foreground px-2 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="border-border/60 hover:bg-muted/50 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border transition-all disabled:opacity-50"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="border-border/60 hover:bg-muted/50 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border transition-all disabled:opacity-50"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
