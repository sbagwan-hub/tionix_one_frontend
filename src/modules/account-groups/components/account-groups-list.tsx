'use client';

import * as React from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AcctGroup } from '../types';

interface AccountGroupsListProps {
  records: AcctGroup[];
  selectedId: number | null;
  filterGroup: string;
  setFilterGroup: (val: string) => void;
  filterParent: string;
  setFilterParent: (val: string) => void;
  loadData: () => void;
  onSelectRecord: (rec: AcctGroup, index: number) => void;
  onDoubleClickRecord: (rec: AcctGroup, index: number) => void;
}

export function AccountGroupsList({
  records,
  selectedId,
  filterGroup,
  setFilterGroup,
  filterParent,
  setFilterParent,
  loadData,
  onSelectRecord,
  onDoubleClickRecord,
}: AccountGroupsListProps) {
  const filtered = records.filter((r) => {
    const nameMatch = filterGroup
      ? r.group_name.toLowerCase().includes(filterGroup.toLowerCase())
      : true;
    const parentMatch = filterParent
      ? (r.parent_name || '').toLowerCase().includes(filterParent.toLowerCase())
      : true;
    return nameMatch && parentMatch;
  });

  return (
    <div className="bg-card flex min-h-[420px] flex-col overflow-hidden rounded-md border">
      {/* Filters Area */}
      <div className="bg-muted/20 flex flex-wrap items-center gap-3 border-b p-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by group name…"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by parent name…"
            value={filterParent}
            onChange={(e) => setFilterParent(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          className="h-8 gap-1.5 text-xs font-semibold"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Apply Filters
        </Button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground border-b text-[11px] font-bold uppercase select-none">
              <th className="w-12 p-3 text-center">#</th>
              <th className="p-3">Group Name</th>
              <th className="p-3">Parent Group</th>
              <th className="w-20 p-3 text-center">D/C</th>
              <th className="w-24 p-3">Last Status</th>
              <th className="w-20 p-3 text-center">System</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted-foreground p-8 text-center">
                  No records found matching filters.
                </td>
              </tr>
            ) : (
              filtered.map((rec, i) => {
                const idx = records.indexOf(rec);
                return (
                  <tr
                    key={rec.pk_grp_id}
                    className={`hover:bg-muted/40 cursor-pointer transition-colors ${
                      rec.pk_grp_id === selectedId ? 'bg-primary/10 text-primary font-medium' : ''
                    }`}
                    onClick={() => onSelectRecord(rec, idx)}
                    onDoubleClick={() => onDoubleClickRecord(rec, idx)}
                  >
                    <td className="text-muted-foreground p-3 text-center">{i + 1}</td>
                    <td className="p-3 font-semibold">{rec.group_name}</td>
                    <td className="text-muted-foreground p-3">{rec.parent_name || '—'}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                          rec.dc === 'DR' || rec.dc === 'D'
                            ? 'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {rec.dc}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          rec.last_status === 'Added'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {rec.last_status}
                      </span>
                    </td>
                    <td className="text-muted-foreground p-3 text-center font-bold">
                      {rec.sys_defined ? '✓' : ''}
                    </td>
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
