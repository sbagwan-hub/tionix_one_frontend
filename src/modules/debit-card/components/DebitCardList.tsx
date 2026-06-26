'use client';

import * as React from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DebitCardDto } from '../types';

interface DebitCardListProps {
  is_loading: boolean;
  paginated_records: DebitCardDto[];
  selected_id: number | null;
  filter_card: string;
  set_filter_card: (val: string) => void;
  page: number;
  set_page: (page: number | ((p: number) => number)) => void;
  page_size: number;
  total_records: number;
  total_pages: number;
  handle_select_record: (rec: DebitCardDto, index: number) => void;
}

export const DebitCardList: React.FC<DebitCardListProps> = ({
  is_loading,
  paginated_records,
  selected_id,
  filter_card,
  set_filter_card,
  page,
  set_page,
  page_size,
  total_records,
  total_pages,
  handle_select_record,
}) => {
  return (
    <div className="bg-card/20 border-border/40 flex h-full min-h-0 flex-col overflow-hidden rounded-lg border backdrop-blur-md">
      {/* Filter Panel */}
      <div className="border-border/40 bg-muted/30 flex items-center gap-3 border-b p-3">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
          <Input
            placeholder="Filter by card no..."
            value={filter_card}
            onChange={(e) => {
              set_filter_card(e.target.value);
              set_page(1);
            }}
            className="bg-background/60 h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* List Table */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-muted/50 border-border/50 text-muted-foreground border-b text-[10px] font-bold tracking-wider uppercase">
              <th className="p-2.5 pl-4">Bank Account</th>
              <th className="p-2.5">Debit Card No</th>
              <th className="p-2.5">Holder's Name</th>
              <th className="p-2.5 pr-4">Expiry Date</th>
            </tr>
          </thead>
          <tbody className="divide-border/30 divide-y">
            {is_loading ? (
              <tr>
                <td colSpan={4} className="text-muted-foreground p-8 text-center">
                  Loading debit cards...
                </td>
              </tr>
            ) : paginated_records.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-muted-foreground p-8 text-center">
                  No debit cards found.
                </td>
              </tr>
            ) : (
              paginated_records.map((rec, idx) => (
                <tr
                  key={rec.pk_deb_id}
                  onClick={() => handle_select_record(rec, (page - 1) * page_size + idx)}
                  className={`hover:bg-primary/5 cursor-pointer transition-colors ${
                    selected_id === rec.pk_deb_id ? 'bg-primary/10 text-primary font-medium' : ''
                  }`}
                >
                  <td className="p-2.5 pl-4 font-semibold">{rec.bank_account_name || 'Bank Account'}</td>
                  <td className="p-2.5 font-mono">{rec.card_no}</td>
                  <td className="p-2.5">{rec.holder_name}</td>
                  <td className="p-2.5 pr-4 font-mono">{rec.expiry_date?.split('T')[0]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total_pages > 1 && (
        <div className="border-border/40 bg-muted/20 text-muted-foreground flex items-center justify-between border-t p-2.5 text-xs">
          <span>
            Showing {(page - 1) * page_size + 1} - {Math.min(page * page_size, total_records)} of {total_records}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => set_page(1)}
              disabled={page === 1}
              className="border-border/60 hover:bg-muted/50 flex h-7 w-7 items-center justify-center rounded-sm border transition-all disabled:opacity-50"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => set_page((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="border-border/60 hover:bg-muted/50 flex h-7 w-7 items-center justify-center rounded-sm border transition-all disabled:opacity-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-foreground px-2 font-medium">
              Page {page} of {total_pages}
            </span>
            <button
              onClick={() => set_page((p) => Math.min(p + 1, total_pages))}
              disabled={page === total_pages}
              className="border-border/60 hover:bg-muted/50 flex h-7 w-7 items-center justify-center rounded-sm border transition-all disabled:opacity-50"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => set_page(total_pages)}
              disabled={page === total_pages}
              className="border-border/60 hover:bg-muted/50 flex h-7 w-7 items-center justify-center rounded-sm border transition-all disabled:opacity-50"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
