'use client';

import * as React from 'react';
import { Info, Eye, PlusCircle, Settings2, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/common/form-input';
import { DatePicker } from '@/components/common/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCardLookups } from '../services';

interface CreditCardFormProps {
  fk_b_com_id: number | string;
  set_fk_b_com_id: (val: number | string) => void;
  fk_h_com_id: number | string;
  set_fk_h_com_id: (val: number | string) => void;
  credit_card_no: string;
  set_credit_card_no: (val: string) => void;
  account_code: string;
  set_account_code: (val: string) => void;
  account: string;
  set_account: (val: string) => void;
  group_name: string;
  opening_balance: number;
  set_opening_balance: (val: number) => void;
  cgst_no: string;
  set_cgst_no: (val: string) => void;
  credit_limit: number | null;
  set_credit_limit: (val: number | null) => void;
  cash_advance: number | null;
  set_cash_advance: (val: number | null) => void;
  expiry_date: string;
  set_expiry_date: (val: string) => void;
  state_from: number | null;
  set_state_from: (val: number | null) => void;
  state_to: number | null;
  set_state_to: (val: number | null) => void;
  payment_day: number | null;
  set_payment_day: (val: number | null) => void;
  is_editing: boolean;
  mode: 'view' | 'add' | 'edit';
  lookups: CreditCardLookups;
}

export function CreditCardForm({
  fk_b_com_id,
  set_fk_b_com_id,
  fk_h_com_id,
  set_fk_h_com_id,
  credit_card_no,
  set_credit_card_no,
  account_code,
  set_account_code,
  account,
  set_account,
  group_name,
  opening_balance,
  set_opening_balance,
  cgst_no,
  set_cgst_no,
  credit_limit,
  set_credit_limit,
  cash_advance,
  set_cash_advance,
  expiry_date,
  set_expiry_date,
  state_from,
  set_state_from,
  state_to,
  set_state_to,
  payment_day,
  set_payment_day,
  is_editing,
  mode,
  lookups,
}: CreditCardFormProps) {
  return (
    <div className="from-card to-card/70 scrollbar-thumb-muted-foreground/15 relative flex h-full min-h-0 w-full scrollbar-thin scrollbar-track-transparent flex-col overflow-y-auto bg-linear-to-b p-5 transition-all duration-300 md:col-span-7">
      {/* Dynamic Status Badges */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-foreground text-xxs font-bold tracking-widest uppercase">
          Credit Card Form
        </span>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium shadow-2xs transition-all duration-300 select-none ${
            !is_editing
              ? 'border-blue-500/10 bg-blue-500/5 text-blue-600 dark:text-blue-400'
              : mode === 'add'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }`}
        >
          {!is_editing ? (
            <>
              <Eye className="h-3 w-3" />
              <span>Read-Only Mode</span>
            </>
          ) : mode === 'add' ? (
            <>
              <PlusCircle className="h-3 w-3 animate-pulse" />
              <span>Add Mode</span>
            </>
          ) : (
            <>
              <Settings2 className="h-3 w-3" />
              <span>Edit Mode</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3.5 pr-1 pb-32">
        {/* Row 1: Bank Name & Holder's Name */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Bank Name {is_editing && <span className="text-destructive">*</span>}
            </Label>
            {is_editing ? (
              <Select
                value={fk_b_com_id ? String(fk_b_com_id) : undefined}
                onValueChange={(val) => set_fk_b_com_id(val)}
              >
                <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs">
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {lookups.banks.map((b) => (
                    <SelectItem key={b.pk_cont_id} value={String(b.pk_cont_id)} className="text-xs">
                      {b.contact_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={
                  lookups.banks.find((b) => String(b.pk_cont_id) === String(fk_b_com_id))
                    ?.contact_name || ''
                }
                disabled
                className="h-9 text-xs"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Holder&apos;s Name {is_editing && <span className="text-destructive">*</span>}
            </Label>
            {is_editing ? (
              <Select
                value={fk_h_com_id ? String(fk_h_com_id) : undefined}
                onValueChange={(val) => set_fk_h_com_id(val)}
              >
                <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs">
                  <SelectValue placeholder="Select Card Holder" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {lookups.holders.map((h) => (
                    <SelectItem key={h.pk_cont_id} value={String(h.pk_cont_id)} className="text-xs">
                      {h.contact_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={
                  lookups.holders.find((h) => String(h.pk_cont_id) === String(fk_h_com_id))
                    ?.contact_name || ''
                }
                disabled
                className="h-9 text-xs"
              />
            )}
          </div>
        </div>

        {/* Row 2: Credit Card No & Account Code */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormInput
              label={
                <span>
                  Credit Card No {is_editing && <span className="text-destructive">*</span>}
                </span>
              }
              value={credit_card_no}
              onChange={(e) => set_credit_card_no(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Credit Card Number"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <FormInput
              label={
                <span>
                  Account Code {is_editing && <span className="text-destructive">*</span>}
                </span>
              }
              value={account_code}
              onChange={(e) => set_account_code(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Account Code"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 3: Account Name & Group */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormInput
              label={
                <span>
                  Account Name {is_editing && <span className="text-destructive">*</span>}
                </span>
              }
              value={account}
              onChange={(e) => set_account(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Credit Card Account Name"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <FormInput
              label={<span>Group {is_editing && <span className="text-destructive">*</span>}</span>}
              icon={FolderOpen}
              value={group_name}
              disabled
              placeholder={is_editing ? 'Select a group from tree on right...' : 'Root Context'}
              className="bg-muted/30 text-foreground h-9 cursor-not-allowed text-xs font-medium"
            />
          </div>
        </div>

        {/* Row 4: GST No. & Opening Balance */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormInput
              label={
                <span>GST No. {is_editing && <span className="text-destructive">*</span>}</span>
              }
              value={cgst_no}
              onChange={(e) => set_cgst_no(e.target.value.toUpperCase())}
              disabled={!is_editing}
              placeholder="Enter GST Number"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <FormInput
              label="Opening Balance"
              type="number"
              step="0.01"
              value={opening_balance || ''}
              onChange={(e) => set_opening_balance(parseFloat(e.target.value) || 0)}
              disabled={!is_editing}
              placeholder="0.00"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 5: Credit Limit & Cash Advance */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormInput
              label="Total Credit Limit"
              type="number"
              step="0.01"
              value={credit_limit ?? ''}
              onChange={(e) => set_credit_limit(e.target.value ? parseFloat(e.target.value) : null)}
              disabled={!is_editing}
              placeholder="0.00"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <FormInput
              label="Cash Advance"
              type="number"
              step="0.01"
              value={cash_advance ?? ''}
              onChange={(e) => set_cash_advance(e.target.value ? parseFloat(e.target.value) : null)}
              disabled={!is_editing}
              placeholder="0.00"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 6: Expiry Date & Statement From */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">Expiry Date</Label>
            {is_editing ? (
              <DatePicker
                value={expiry_date}
                onChange={(date) => set_expiry_date(date)}
                placeholder="Select expiry date"
              />
            ) : (
              <Input value={expiry_date || ''} disabled className="h-9 text-xs" />
            )}
          </div>

          <div className="space-y-1.5">
            <FormInput
              label="Statement From (Day)"
              type="number"
              min="1"
              max="31"
              value={state_from ?? ''}
              onChange={(e) => set_state_from(e.target.value ? parseInt(e.target.value) : null)}
              disabled={!is_editing}
              placeholder="1-31"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 7: Statement To & Payment Day */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormInput
              label="Statement To (Day)"
              type="number"
              min="0"
              max="31"
              value={state_to ?? ''}
              onChange={(e) => set_state_to(e.target.value ? parseInt(e.target.value) : null)}
              disabled={!is_editing}
              placeholder="0-31"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <FormInput
              label="Payment Date (Day)"
              type="number"
              min="0"
              max="31"
              value={payment_day ?? ''}
              onChange={(e) => set_payment_day(e.target.value ? parseInt(e.target.value) : null)}
              disabled={!is_editing}
              placeholder="0-31"
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {is_editing && !group_name && (
        <div className="bg-muted/20 border-border/30 text-foreground/90 mt-4 flex items-start gap-2 rounded-md border p-2 text-[11px] leading-normal">
          <Info className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Please select an Account Group from the hierarchy tree on the right to place this credit
            card account.
          </span>
        </div>
      )}
    </div>
  );
}
