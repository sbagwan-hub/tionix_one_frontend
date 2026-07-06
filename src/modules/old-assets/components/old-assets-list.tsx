'use client';

import * as React from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TanStackTable } from '@/components/common/tanstack-table';
import { ColumnDef } from '@tanstack/react-table';
import { OldAsset } from '../types';

interface OldAssetsListProps {
  records: OldAsset[];
  selected_id: number | string | null;
  filter_code: string;
  set_filter_code: (val: string) => void;
  filter_desc: string;
  set_filter_desc: (val: string) => void;
  load_data: () => void;
  on_select_record: (rec: OldAsset, index: number) => void;
  on_double_click_record: (rec: OldAsset, index: number) => void;
}

export function OldAssetsList({
  records,
  selected_id,
  filter_code,
  set_filter_code,
  filter_desc,
  set_filter_desc,
  load_data,
  on_select_record,
  on_double_click_record,
}: OldAssetsListProps) {
  const filtered = React.useMemo(() => {
    return records.filter((r) => {
      const codeMatch = filter_code
        ? r.asset_code.toLowerCase().includes(filter_code.toLowerCase()) ||
          r.prod_code.toLowerCase().includes(filter_code.toLowerCase())
        : true;
      const descMatch = filter_desc
        ? r.description.toLowerCase().includes(filter_desc.toLowerCase()) ||
          r.prod_name.toLowerCase().includes(filter_desc.toLowerCase()) ||
          (r.a_account || '').toLowerCase().includes(filter_desc.toLowerCase())
        : true;
      return codeMatch && descMatch;
    });
  }, [records, filter_code, filter_desc]);

  const columns = React.useMemo<ColumnDef<OldAsset, any>[]>(
    () => [
      {
        id: 'index',
        header: '#',
        cell: (info: any) => (
          <span className="text-muted-foreground font-mono">{info.row.index + 1}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'asset_code',
        header: 'Asset Code',
        cell: (info: any) => <span className="font-mono font-medium">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info: any) => <span className="font-semibold">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'prod_code',
        header: 'Product Code',
        cell: (info: any) => <span className="font-mono">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'prod_name',
        header: 'Product Name',
        cell: (info: any) => info.getValue() || '-',
      },
      {
        accessorKey: 'a_account',
        header: 'Asset Account',
        cell: (info: any) => info.getValue() || '-',
      },
      {
        accessorKey: 'pur_date',
        header: 'Purchase Date',
        cell: (info: any) => <span className="font-mono">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'pur_rate',
        header: 'Purchase Rate',
        cell: (info: any) => <span className="font-mono">{info.getValue() || '0.00'}</span>,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: (info: any) => info.getValue() || '-',
      },
      {
        accessorKey: 'condition',
        header: 'Condition',
        cell: (info: any) => (
          <span
            className={`rounded px-1.5 py-0.5 text-2xs font-semibold ${
              info.getValue() === 'Good'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                : info.getValue() === 'Fair'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
            }`}
          >
            {info.getValue() || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info: any) => (
          <span
            className={`rounded px-1.5 py-0.5 text-2xs font-semibold ${
              info.getValue()
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {info.getValue() ? 'Active' : 'Inactive'}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {/* Filters Area */}
      <div className="bg-card/25 flex flex-wrap items-center gap-3 rounded-lg border p-3 shadow-2xs">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by Asset or Product Code…"
            value={filter_code}
            onChange={(e) => set_filter_code(e.target.value)}
            className="bg-background/80 h-8 text-xs"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by description, name, or account…"
            value={filter_desc}
            onChange={(e) => set_filter_desc(e.target.value)}
            className="bg-background/80 h-8 text-xs"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={load_data}
          className="h-8 gap-1.5 text-xs font-semibold"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Apply Filters
        </Button>
      </div>

      {/* TanStack Table */}
      <TanStackTable
        columns={columns}
        data={filtered}
        selectedRowId={selected_id ?? undefined}
        getRowId={(row) => row.pk_ast_id}
        onRowClick={on_select_record}
        onRowDoubleClick={on_double_click_record}
      />
    </div>
  );
}
