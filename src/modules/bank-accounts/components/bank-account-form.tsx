'use client';

import * as React from 'react';
import { Info, Eye, PlusCircle, Settings2, FolderOpen, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/common/form-input';
import FormSelect from '@/components/common/form-select';
import { AcctGroup } from '../../account-groups/types';
import { BankAccount, HolderDetail } from '../types';

interface BankAccountFormProps {
  bank_name: string;
  set_bank_name: (val: string) => void;
  account_no: string;
  set_account_no: (val: string) => void;
  rtgs_neft_ifsc: string;
  set_rtgs_neft_ifsc: (val: string) => void;
  account_type: string;
  set_account_type: (val: string) => void;
  account_code: string;
  set_account_code: (val: string) => void;
  bank_account_name: string;
  set_bank_account_name: (val: string) => void;
  selected_group: AcctGroup | null;
  set_selected_group: (val: AcctGroup | null) => void;
  opening_balance: number;
  set_opening_balance: (val: number) => void;
  opening_balance_sec: number;
  set_opening_balance_sec: (val: number) => void;
  gst_no: string;
  set_gst_no: (val: string) => void;
  holder_details: HolderDetail[];
  set_holder_details: (val: HolderDetail[]) => void;
  nominee: string;
  set_nominee: (val: string) => void;

  is_editing: boolean;
  mode: 'view' | 'add' | 'edit';
  selected_id: number | string | null;
  is_sys_defined: boolean;
  records: BankAccount[];
  cursor: number;
  form_input_ref: React.RefObject<HTMLInputElement | null>;
  individuals: Array<{ pk_cont_id: number; contact_name: string }>;
  organizations: Array<{ pk_cont_id: number; contact_name: string }>;
}

export function BankAccountForm({
  bank_name,
  set_bank_name,
  account_no,
  set_account_no,
  rtgs_neft_ifsc,
  set_rtgs_neft_ifsc,
  account_type,
  set_account_type,
  account_code,
  set_account_code,
  bank_account_name,
  set_bank_account_name,
  selected_group,
  set_selected_group,
  opening_balance,
  set_opening_balance,
  opening_balance_sec,
  set_opening_balance_sec,
  gst_no,
  set_gst_no,
  holder_details,
  set_holder_details,
  nominee,
  set_nominee,

  is_editing,
  mode,
  selected_id,
  is_sys_defined,
  records,
  cursor,
  form_input_ref,
  individuals,
  organizations,
}: BankAccountFormProps) {
  console.log('BankAccountForm individuals:', individuals);
  const handleHolderChange = (index: number, field: keyof HolderDetail, value: string) => {
    const updated = [...holder_details];
    updated[index] = { ...updated[index], [field]: value };
    set_holder_details(updated);
  };

  const accountTypeOptions = ['Current Account', 'Savings Account', 'Cash Credit', 'Overdraft'];

  return (
    <div className="from-card to-card/70 scrollbar-thumb-muted-foreground/15 relative flex h-full min-h-0 w-full scrollbar-thin scrollbar-track-transparent flex-col overflow-y-auto bg-linear-to-b p-5 transition-all duration-300 md:col-span-7">
      {/* Dynamic Status Badges */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-foreground text-xxs font-bold tracking-widest uppercase">
          Bank Account Form
        </span>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium shadow-2xs transition-all duration-300 ${
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

      <div className="space-y-3.5 pr-1 pb-16">
        {/* Row 1: Bank Name & Account No. */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            {is_editing ? (
              <FormSelect
                label={
                  <span>Bank Name {is_editing && <span className="text-destructive">*</span>}</span>
                }
                value={bank_name || undefined}
                onValueChange={set_bank_name}
                placeholder="Select Bank"
                className="border-border/85 h-9 w-full text-xs"
                options={organizations.map((org) => ({
                  value: org.contact_name,
                  label: org.contact_name,
                }))}
              />
            ) : (
              <>
                <Label className="text-foreground/80 text-xs font-semibold">Bank Name</Label>
                <Input value={bank_name} disabled className="h-9 text-xs" />
              </>
            )}
          </div>

          <div className="space-y-1.5">
            <FormInput
              ref={form_input_ref}
              label={
                <span>Account No. {is_editing && <span className="text-destructive">*</span>}</span>
              }
              value={account_no}
              onChange={(e) => set_account_no(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Account Number"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 2: RTGS/NEFT/IFSC & Account Type */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormInput
              label="RTGS/NEFT/IFSC"
              value={rtgs_neft_ifsc}
              onChange={(e) => set_rtgs_neft_ifsc(e.target.value.toUpperCase())}
              disabled={!is_editing}
              placeholder="e.g. SBIN0001234"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            {is_editing ? (
              <FormSelect
                label={
                  <span>
                    Account Type {is_editing && <span className="text-destructive">*</span>}
                  </span>
                }
                value={account_type || undefined}
                onValueChange={set_account_type}
                placeholder="Select Account Type"
                className="border-border/85 h-9 w-full text-xs"
                options={accountTypeOptions.map((t) => ({
                  value: t,
                  label: t,
                }))}
              />
            ) : (
              <>
                <Label className="text-foreground/80 text-xs font-semibold">Account Type</Label>
                <Input value={account_type} disabled className="h-9 text-xs" />
              </>
            )}
          </div>
        </div>

        {/* Row 3: Account Code & Bank Account Name */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
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

          <div className="space-y-1.5">
            <FormInput
              label={
                <span>
                  Bank Account {is_editing && <span className="text-destructive">*</span>}
                </span>
              }
              value={bank_account_name}
              onChange={(e) => set_bank_account_name(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Bank Account Display Name"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 4: Group & GST No. */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormInput
              label={<span>Group {is_editing && <span className="text-destructive">*</span>}</span>}
              icon={FolderOpen}
              value={selected_group ? selected_group.group_name : ''}
              disabled
              placeholder={is_editing ? 'Select a group from tree on right...' : 'Root Context'}
              className="bg-muted/30 text-foreground h-9 cursor-not-allowed text-xs font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <FormInput
              label={
                <span>GST No. {is_editing && <span className="text-destructive">*</span>}</span>
              }
              value={gst_no}
              onChange={(e) => set_gst_no(e.target.value.toUpperCase())}
              disabled={!is_editing}
              placeholder="Enter GST Number"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 5: Opening Balances */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
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

          <div className="space-y-1.5">
            <FormInput
              label="Opening Balance (Secondary Currency)"
              type="number"
              step="0.01"
              value={opening_balance_sec || ''}
              onChange={(e) => set_opening_balance_sec(parseFloat(e.target.value) || 0)}
              disabled={!is_editing}
              placeholder="0.00"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Holder Details Grid (Rows 1 to 4) */}
        <div className="border-border/60 bg-muted/10 space-y-3 rounded-lg border p-4">
          <span className="text-foreground/80 block text-xs font-bold tracking-wider uppercase">
            Holder Details
          </span>
          <div className="space-y-2.5">
            {holder_details.map((holder, idx) => (
              <div key={holder.id} className="grid grid-cols-12 items-center gap-3.5">
                <span className="text-muted-foreground col-span-1 text-center text-xs font-semibold">
                  {idx + 1}
                </span>

                <div className="col-span-6">
                  {is_editing ? (
                    <FormSelect
                      value={holder.name || undefined}
                      onValueChange={(val) => handleHolderChange(idx, 'name', val)}
                      placeholder="Select Holder Name"
                      className="h-8.5 w-full text-xs"
                      options={individuals.map((ind) => ({
                        value: ind.contact_name,
                        label: ind.contact_name,
                      }))}
                    />
                  ) : (
                    <Input value={holder.name} disabled className="h-8.5 text-xs" />
                  )}
                </div>

                <div className="col-span-5">
                  <FormInput
                    value={holder.client_id}
                    onChange={(e) => handleHolderChange(idx, 'client_id', e.target.value)}
                    disabled={!is_editing}
                    placeholder="Customer ID"
                    className="h-8.5 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nominee Field */}
        <FormInput
          label="Nominee"
          value={nominee}
          onChange={(e) => set_nominee(e.target.value)}
          disabled={!is_editing}
          placeholder="Enter Nominee Name"
          className="h-9 text-xs"
        />
      </div>

      {is_editing && !selected_group && (
        <div className="bg-muted/20 border-border/30 text-foreground/90 mt-4 flex items-start gap-2 rounded-md border p-2 text-[11px] leading-normal">
          <Info className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {`Please select an Account Group from the hierarchy tree on the right to place this bank account.`}
          </span>
        </div>
      )}
    </div>
  );
}
