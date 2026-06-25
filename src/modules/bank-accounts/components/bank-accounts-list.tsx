'use client';

import * as React from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const filtered = records.filter((r) => {
    const bankMatch = filter_bank
      ? r.bank_name.toLowerCase().includes(filter_bank.toLowerCase()) ||
        r.bank_account_name.toLowerCase().includes(filter_bank.toLowerCase())
      : true;
    const accountMatch = filter_account_no
      ? r.account_no.includes(filter_account_no)
      : true;
    return bankMatch && accountMatch;
  });

  return (
    <div className="bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
      {/* Filters Area */}
      <div className="bg-muted/20 flex flex-wrap items-center gap-3 border-b p-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by bank or account name…"
            value={filter_bank}
            onChange={(e) => set_filter_bank(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by account number…"
            value={filter_account_no}
            onChange={(e) => set_filter_account_no(e.target.value)}
            className="h-8 text-xs"
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

      {/* Table Area */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground border-b text-[11px] font-bold uppercase select-none">
              <th className="w-12 p-3 text-center">#</th>
              <th className="p-3">Account Name</th>
              <th className="p-3">Bank Name</th>
              <th className="p-3">Account Number</th>
              <th className="p-3">IFSC / RTGS</th>
              <th className="p-3">Type</th>
              <th className="p-3 text-right">Opening Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-muted-foreground p-8 text-center">
                  No records found matching filters.
                </td>
              </tr>
            ) : (
              filtered.map((rec, i) => {
                const idx = records.indexOf(rec);
                return (
                  <tr
                    key={rec.pk_ban_id}
                    className={`hover:bg-muted/40 cursor-pointer transition-colors ${
                      rec.pk_ban_id === selected_id
                        ? 'bg-primary/10 text-primary font-medium'
                        : ''
                    }`}
                    onClick={() => on_select_record(rec, idx)}
                    onDoubleClick={() => on_double_click_record(rec, idx)}
                  >
                    <td className="text-muted-foreground p-3 text-center">{i + 1}</td>
                    <td className="p-3 font-semibold">{rec.bank_account_name}</td>
                    <td className="p-3">{rec.bank_name}</td>
                    <td className="p-3 font-mono">{rec.account_no}</td>
                    <td className="p-3 font-mono">{rec.rtgs_neft_ifsc}</td>
                    <td className="p-3">{rec.account_type}</td>
                    <td className="p-3 text-right font-mono font-semibold">
                      {rec.opening_balance.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
