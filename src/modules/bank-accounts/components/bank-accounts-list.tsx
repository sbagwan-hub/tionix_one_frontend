'use client';

import * as React from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TanStackTable } from '@/components/common/tanstack-table';
import { ColumnDef } from '@tanstack/react-table';
import { BankAccount } from '../types';

interface BankAccountsListProps {
  records: BankAccount[];
  selected_id: number | string | null;
  filter_bank: string;
  set_filter_bank: (val: string) => void;
  filter_account_no: string;
  set_filter_account_no: (val: string) => void;
  load_data: () => void;
  on_select_record: (rec: BankAccount, index: number) => void;
  on_double_click_record: (rec: BankAccount, index: number) => void;
}

export function BankAccountsList({
  records,
  selected_id,
  filter_bank,
  set_filter_bank,
  filter_account_no,
  set_filter_account_no,
  load_data,
  on_select_record,
  on_double_click_record,
}: BankAccountsListProps) {
  const filtered = React.useMemo(() => {
    return records.filter((r) => {
      const bankMatch = filter_bank
        ? r.bank_name.toLowerCase().includes(filter_bank.toLowerCase()) ||
          r.bank_account_name.toLowerCase().includes(filter_bank.toLowerCase()) ||
          r.account_code.toLowerCase().includes(filter_bank.toLowerCase()) ||
          (r.holder_details?.[0]?.client_id || '').toLowerCase().includes(filter_bank.toLowerCase())
        : true;
      const accountMatch = filter_account_no ? r.account_no.includes(filter_account_no) : true;
      return bankMatch && accountMatch;
    });
  }, [records, filter_bank, filter_account_no]);

  const columns = React.useMemo<ColumnDef<BankAccount, any>[]>(
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
        accessorKey: 'bank_account_name',
        header: 'Account Name',
        cell: (info) => <span className="font-semibold">{info.getValue() || '-'}</span>,
      },
      {
        id: 'customer_id',
        header: 'Customer ID',
        accessorFn: (row) => row.holder_details?.[0]?.client_id || '',
        cell: (info) => <span className="font-mono">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'gst_no',
        header: 'GSTIN',
        cell: (info) => <span className="font-mono">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'bank_name',
        header: 'Bank Name',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'account_no',
        header: 'Account Number',
        cell: (info) => <span className="font-mono">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'rtgs_neft_ifsc',
        header: 'IFSC / RTGS',
        cell: (info) => <span className="font-mono">{info.getValue() || '-'}</span>,
      },
      {
        accessorKey: 'account_type',
        header: 'Type',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'opening_balance',
        header: () => <div className="text-right">Opening Balance</div>,
        cell: (info) => (
          <div className="text-right font-mono font-semibold">
            {Number(info.getValue() || 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
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
            placeholder="Filter by bank or account name…"
            value={filter_bank}
            onChange={(e) => set_filter_bank(e.target.value)}
            className="bg-background/80 h-8 text-xs"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by account number…"
            value={filter_account_no}
            onChange={(e) => set_filter_account_no(e.target.value)}
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
        getRowId={(row) => row.pk_ban_id}
        onRowClick={on_select_record}
        onRowDoubleClick={on_double_click_record}
      />
    </div>
  );
}
