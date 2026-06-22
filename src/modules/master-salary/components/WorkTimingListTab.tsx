'use client';

import * as React from 'react';
import { Search, Clock, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
    <div className="h-full flex flex-col min-h-0 bg-card/25 border border-border/40 rounded-lg backdrop-blur-md overflow-hidden">
      {/* Search Header */}
      <div className="p-3 border-b border-border/40 bg-muted/20 flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter by shift or type..."
            value={filterShift}
            onChange={(e) => {
              setFilterShift(e.target.value);
              setPage(1);
            }}
            className="pl-8 h-8 text-xs bg-background/60 border-border/60 focus-visible:ring-primary/40"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 border-b border-border/40 text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
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
          <tbody className="divide-y divide-border/25">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center p-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                  Loading work timings...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-8 text-muted-foreground">
                  No work timing records found.
                </td>
              </tr>
            ) : (
              records.map((rec: any) => (
                <tr
                  key={rec.pk_wt_id}
                  onClick={() => onSelect(rec)}
                  className={`hover:bg-primary/5 cursor-pointer transition-colors ${
                    selectedId === rec.pk_wt_id ? 'bg-primary/10 font-medium text-primary' : ''
                  }`}
                >
                  <td className="p-2.5 pl-4 font-mono text-muted-foreground">{getEmployeeCode(rec.fk_emp_id)}</td>
                  <td className="p-2.5 font-semibold text-foreground">{getEmployeeName(rec.fk_emp_id)}</td>
                  <td className="p-2.5 text-foreground">{rec.shift}</td>
                  <td className="p-2.5 text-muted-foreground">{rec.type}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-foreground">
                    {Number(rec.t_work).toFixed(2)}
                  </td>
                  <td className="p-2.5 text-center font-mono text-muted-foreground">
                    {Number(rec.t_break).toFixed(0)}
                  </td>
                  <td className="p-2.5 font-mono text-muted-foreground">{formatDate(rec.tsd)}</td>
                  <td className="p-2.5 pr-4 font-mono text-muted-foreground">{formatDate(rec.ted)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-2.5 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalRecords)} of {totalRecords}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="h-7 w-7 border border-border/60 hover:bg-muted/50 rounded-sm flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="h-7 w-7 border border-border/60 hover:bg-muted/50 rounded-sm flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-semibold text-foreground px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="h-7 w-7 border border-border/60 hover:bg-muted/50 rounded-sm flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="h-7 w-7 border border-border/60 hover:bg-muted/50 rounded-sm flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
