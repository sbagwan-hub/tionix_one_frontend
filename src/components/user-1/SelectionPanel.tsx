'use client';
// components/SelectionPanel.tsx

import { SelectionRow } from '@/lib/api';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  rows: SelectionRow[];
  editable: boolean;
  onChange: (rows: SelectionRow[]) => void;
  label: string;
}

export default function SelectionPanel({ rows, editable, onChange, label }: Props) {
  const toggle = (idx: number) => {
    if (!editable) return;
    onChange(rows.map((r, i) => (i === idx ? { ...r, selected: !r.selected } : r)));
  };

  const selectAll = () => onChange(rows.map((r) => ({ ...r, selected: true })));
  const clearAll = () => onChange(rows.map((r) => ({ ...r, selected: false })));

  return (
    <div>
      {editable && rows?.length > 0 && (
        <div className="mb-3 flex gap-2">
          <button
            onClick={selectAll}
            className="rounded-full border border-emerald-600/40 bg-emerald-600/20 px-3 py-1 text-xs text-emerald-300 transition-colors hover:bg-emerald-600/30"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="rounded-full border border-red-600/40 bg-red-600/20 px-3 py-1 text-xs text-red-300 transition-colors hover:bg-red-600/30"
          >
            Clear All
          </button>
        </div>
      )}
      {rows?.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500 italic">No {label} configured.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {rows.map((row, idx) => (
            <label
              key={row.name}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${row.selected ? 'border-amber-500/40 bg-amber-500/10' : 'border-slate-700 bg-slate-800'} ${editable ? 'cursor-pointer hover:border-slate-500' : 'cursor-default opacity-70'} `}
            >
              <Checkbox
                checked={row.selected}
                disabled={!editable}
                onCheckedChange={() => toggle(idx)}
              />
              <span
                className={`truncate text-sm ${row.selected ? 'text-amber-200' : 'text-slate-300'}`}
              >
                {row.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
