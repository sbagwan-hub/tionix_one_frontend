'use client';

import * as React from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TanStackTable } from '@/components/common/tanstack-table';
import { ColumnDef } from '@tanstack/react-table';
import { CreditCard } from '../types';

interface CreditCardListProps {
  records: CreditCard[];
  selected_id: number | null;
  filter_card: string;
  set_filter_card: (val: string) => void;
  filter_holder: string;
  set_filter_holder: (val: string) => void;
  load_data: () => void;
  on_select_record: (rec: CreditCard, index: number) => void;
  on_double_click_record: (rec: CreditCard, index: number) => void;
}

export function CreditCardList({
  records,
  selected_id,
  filter_card,
  set_filter_card,
  filter_holder,
  set_filter_holder,
  load_data,
  on_select_record,
  on_double_click_record,
}: CreditCardListProps) {
  const filtered = React.useMemo(() => {
    return records.filter((r) => {
      const cardMatch = filter_card
        ? (r.credit_card_no || '').toLowerCase().includes(filter_card.toLowerCase()) ||
          (r.bank_name || '').toLowerCase().includes(filter_card.toLowerCase()) ||
          (r.account_code || '').toLowerCase().includes(filter_card.toLowerCase()) ||
          (r.account || '').toLowerCase().includes(filter_card.toLowerCase())
        : true;
      const holderMatch = filter_holder
        ? (r.holders_name || '').toLowerCase().includes(filter_holder.toLowerCase())
        : true;
      return cardMatch && holderMatch;
    });
  }, [records, filter_card, filter_holder]);

  const columns = React.useMemo<ColumnDef<CreditCard, any>[]>(
    () => [
      {
        id: 'index',
        header: '#',
        cell: (info) => (
          <span className="text-muted-foreground font-mono">{info.row.index + 1}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'account_code',
        header: 'Code',
        cell: (info) => <span className="font-mono font-medium">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'account',
        header: 'Account Name',
        cell: (info) => <span className="font-semibold">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'credit_card_no',
        header: 'Card No',
        cell: (info) => <span className="font-mono">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'bank_name',
        header: 'Bank',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'holders_name',
        header: 'Holder',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'cgst_no',
        header: 'GSTIN',
        cell: (info) => <span className="font-mono">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'group_name',
        header: 'Group',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'opening_balance',
        header: () => <div className="text-right">Opening Bal.</div>,
        cell: (info) => (
          <div className="text-right font-mono font-semibold">
            {Number(info.getValue() || 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        ),
      },
      {
        accessorKey: 'credit_limit',
        header: () => <div className="text-right">Credit Limit</div>,
        cell: (info) => (
          <div className="text-right font-mono">
            {info.getValue() != null
              ? Number(info.getValue()).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '-'}
          </div>
        ),
      },
      {
        accessorKey: 'expiry_date',
        header: 'Expiry',
        cell: (info) => {
          const val = info.getValue();
          return <span className="font-mono">{val ? val.split('T')[0] : '-'}</span>;
        },
      },
    ],
    [],
  );

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {/* Filters */}
      <div className="bg-card/25 flex flex-wrap items-center gap-3 rounded-lg border p-3 shadow-2xs">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by card no, bank or account…"
            value={filter_card}
            onChange={(e) => set_filter_card(e.target.value)}
            className="bg-background/80 h-8 text-xs"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by holder name…"
            value={filter_holder}
            onChange={(e) => set_filter_holder(e.target.value)}
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
        selectedRowId={selected_id}
        getRowId={(row) => row.pk_acct_id!}
        onRowClick={on_select_record}
        onRowDoubleClick={on_double_click_record}
      />
    </div>
  );
}
