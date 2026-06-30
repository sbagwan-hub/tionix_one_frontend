'use client';

import * as React from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const filtered = records.filter((r) => {
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

  return (
    <div className="bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
      {/* Filters */}
      <div className="bg-muted/20 flex flex-wrap items-center gap-3 border-b p-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by card no, bank or account…"
            value={filter_card}
            onChange={(e) => set_filter_card(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Filter by holder name…"
            value={filter_holder}
            onChange={(e) => set_filter_holder(e.target.value)}
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

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground border-b text-[11px] font-bold uppercase select-none">
              <th className="w-12 p-3 text-center">#</th>
              <th className="p-3">Code</th>
              <th className="p-3">Account Name</th>
              <th className="p-3">Card No</th>
              <th className="p-3">Bank</th>
              <th className="p-3">Holder</th>
              <th className="p-3">GSTIN</th>
              <th className="p-3">Group</th>
              <th className="p-3 text-right">Opening Bal.</th>
              <th className="p-3 text-right">Credit Limit</th>
              <th className="p-3">Expiry</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-muted-foreground p-8 text-center">
                  No records found matching filters.
                </td>
              </tr>
            ) : (
              filtered.map((rec, i) => {
                const idx = records.indexOf(rec);
                return (
                  <tr
                    key={rec.pk_acct_id}
                    className={`cursor-pointer transition-colors ${
                      rec.pk_acct_id === selected_id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted/40'
                    }`}
                    onClick={() => on_select_record(rec, idx)}
                    onDoubleClick={() => on_double_click_record(rec, idx)}
                  >
                    <td className="text-muted-foreground p-3 text-center">{i + 1}</td>
                    <td className="p-3 font-mono font-medium">{rec.account_code}</td>
                    <td className="p-3 font-semibold">{rec.account}</td>
                    <td className="p-3 font-mono">{rec.credit_card_no}</td>
                    <td className="p-3">{rec.bank_name || '-'}</td>
                    <td className="p-3">{rec.holders_name || '-'}</td>
                    <td className="p-3 font-mono">{rec.cgst_no || '-'}</td>
                    <td className="p-3">{rec.group_name || '-'}</td>
                    <td className="p-3 text-right font-mono font-semibold">
                      {Number(rec.opening_balance).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {rec.credit_limit != null
                        ? Number(rec.credit_limit).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : '-'}
                    </td>
                    <td className="p-3 font-mono">
                      {rec.expiry_date ? rec.expiry_date.split('T')[0] : '-'}
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
