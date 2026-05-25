'use client';
// components/PermissionGrid.tsx
// Renders an editable permission table for Masters / Transactions / Reports / Others

import { FormOtherRow, FormReportRow, FormRightRow } from '@/lib/api';
import { Checkbox } from '@/components/ui/checkbox';

type Column = {
  key: string;
  label: string;
};

const MASTER_COLS: Column[] = [
  { key: 'r_add', label: 'Add' },
  { key: 'r_edit', label: 'Edit' },
  { key: 'r_delete', label: 'Delete' },
  { key: 'r_view', label: 'View' },
  { key: 'r_print', label: 'Print' },
  { key: 'r_export', label: 'Export' },
];

const TRAN_COLS: Column[] = [...MASTER_COLS, { key: 'r_authorize', label: 'Auth' }];

const REPORT_COLS: Column[] = [
  { key: 'r_view', label: 'View' },
  { key: 'r_print', label: 'Print' },
  { key: 'r_export', label: 'Export' },
];

const OTHER_COLS: Column[] = [{ key: 'r_rights', label: 'Rights' }];

export type GridRow = FormRightRow | FormReportRow | FormOtherRow;

interface Props {
  rows: GridRow[];
  type: 'master' | 'transaction' | 'report' | 'other';
  editable: boolean;
  onChange: (updated: GridRow[]) => void;
}

function colsFor(type: Props['type']) {
  if (type === 'master') return MASTER_COLS;
  if (type === 'transaction') return TRAN_COLS;
  if (type === 'report') return REPORT_COLS;
  return OTHER_COLS;
}

// Using radix-based Checkbox (supports indeterminate) for tri-state

export default function PermissionGrid({ rows, type, editable, onChange }: Props) {
  const cols = colsFor(type);

  const update = (idx: number, col: string, val: boolean | null) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, [col]: val } : r));
    onChange(next);
  };

  // Group by module_caption for visual separation
  const grouped: { caption: string; items: { row: GridRow; idx: number }[] }[] = [];
  rows.forEach((row, idx) => {
    const cap = (row as any).module_caption || 'General';
    let g = grouped.find((g) => g.caption === cap);
    if (!g) {
      g = { caption: cap, items: [] };
      grouped.push(g);
    }
    g.items.push({ row, idx });
  });

  return (
    <div className="overflow-auto">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="sticky top-0 z-10">
            <th className="w-64 border-b border-slate-600 bg-slate-800 px-3 py-2 text-left font-medium text-slate-300">
              Form
            </th>
            {cols.map((c) => (
              <th
                key={c.key}
                className="w-14 border-b border-slate-600 bg-slate-800 px-2 py-2 text-center font-medium text-slate-300"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grouped.map((g) => (
            <>
              <tr key={`hdr-${g.caption}`}>
                <td
                  colSpan={cols.length + 1}
                  className="border-b border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold tracking-widest text-amber-400 uppercase"
                >
                  {g.caption}
                </td>
              </tr>
              {g.items.map(({ row, idx }) => (
                <tr
                  key={idx}
                  className="group border-b border-slate-700/40 transition-colors hover:bg-slate-700/40"
                >
                  <td className="max-w-xs truncate px-3 py-1.5 text-slate-200 group-hover:text-white">
                    {row.form_name}
                  </td>
                  {cols.map((c) => (
                    <td key={c.key} className="px-2 py-1.5 text-center">
                      <Checkbox
                        checked={
                          (row as any)[c.key] === null ? 'indeterminate' : !!(row as any)[c.key]
                        }
                        disabled={!editable}
                        onCheckedChange={(val) => {
                          const v: boolean | null = val === 'indeterminate' ? null : !!val;
                          update(idx, c.key, v);
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="py-10 text-center text-slate-500 italic">No forms in this category.</p>
      )}
    </div>
  );
}
