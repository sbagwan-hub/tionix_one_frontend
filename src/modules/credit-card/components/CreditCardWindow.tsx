'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormInput } from '@/components/common/form-input';
import { DatePicker } from '@/components/common/date-picker';
import { DeleteDialog } from '@/components/common/delete-dialog';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';

import {
  useCreditCardsList,
  useCreateCreditCard,
  useUpdateDebitCard,
  useDeleteCreditCard,
  useCreditCardLookups,
} from '../hooks/use-credit-cards';
import { creditCardSchema, CreditCardDto } from '../types';

export const CreditCardWindow: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [is_confirm_open, set_is_confirm_open] = useState(false);
  const [pending_delete_id, set_pending_delete_id] = useState<number | null>(null);

  // Queries
  const { data: records = [] } = useCreditCardsList();
  const { data: lookups = { banks: [], holders: [], groups: [] } } = useCreditCardLookups();

  const create_mutation = useCreateCreditCard();
  const update_mutation = useUpdateDebitCard();
  const delete_mutation = useDeleteCreditCard();

  const form = useForm<z.input<typeof creditCardSchema>, any, CreditCardDto>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      fk_b_com_id: '' as any,
      fk_h_com_id: '' as any,
      credit_card_no: '',
      account_code: '',
      account: '',
      group_name: '',
      cgst_no: '',
      opening_balance: 0,
      credit_limit: null,
      cash_advance: null,
      expiry_date: '',
      state_from: null,
      state_to: null,
      payment_day: null,
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  const fk_b_com_id = form.watch('fk_b_com_id');
  const fk_h_com_id = form.watch('fk_h_com_id');
  const group_name = form.watch('group_name');

  const resetForm = () => {
    setEditingId(null);
    form.reset({
      fk_b_com_id: '' as any,
      fk_h_com_id: '' as any,
      credit_card_no: '',
      account_code: '',
      account: '',
      group_name: '',
      cgst_no: '',
      opening_balance: 0,
      credit_limit: null,
      cash_advance: null,
      expiry_date: '',
      state_from: null,
      state_to: null,
      payment_day: null,
      sync: 'N',
      sys_defined: false,
    });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (editingId) {
        await update_mutation.mutateAsync({ id: editingId, body: data });
        toast.success('Credit card updated successfully.');
      } else {
        await create_mutation.mutateAsync(data);
        toast.success('Credit card added successfully.');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save credit card.');
    }
  });

  const handleEdit = (item: WindowPanelItem) => {
    const rec = records.find((r) => String(r.pk_acct_id) === item.id);
    if (!rec || !rec.pk_acct_id) return;
    if (rec.sys_defined) {
      toast.error('System-defined credit cards cannot be edited.');
      return;
    }
    setEditingId(rec.pk_acct_id);
    form.reset({
      pk_acct_id: rec.pk_acct_id,
      fk_b_com_id: rec.fk_b_com_id,
      fk_h_com_id: rec.fk_h_com_id,
      credit_card_no: rec.credit_card_no,
      account_code: rec.account_code,
      account: rec.account,
      group_name: rec.group_name || '',
      cgst_no: rec.cgst_no,
      opening_balance: Number(rec.opening_balance),
      credit_limit: rec.credit_limit ? Number(rec.credit_limit) : null,
      cash_advance: rec.cash_advance ? Number(rec.cash_advance) : null,
      expiry_date: rec.expiry_date ? rec.expiry_date.split('T')[0] : '',
      state_from: rec.state_from,
      state_to: rec.state_to,
      payment_day: rec.payment_day,
      sync: rec.sync,
      sys_defined: rec.sys_defined,
    });
  };

  const handleDelete = (item: WindowPanelItem) => {
    const rec = records.find((r) => String(r.pk_acct_id) === item.id);
    if (!rec || !rec.pk_acct_id) return;
    if (rec.sys_defined) {
      toast.error('System-defined credit cards cannot be deleted.');
      return;
    }
    set_pending_delete_id(rec.pk_acct_id);
    set_is_confirm_open(true);
  };

  const handle_confirm_delete = async () => {
    if (!pending_delete_id) return;
    try {
      await delete_mutation.mutateAsync(pending_delete_id);
      set_is_confirm_open(false);
      set_pending_delete_id(null);
      resetForm();
      toast.success('Credit card deleted successfully.');
    } catch {
      set_is_confirm_open(false);
    }
  };

  const is_editing = editingId !== null;

  const items: WindowPanelItem[] = records.map((r) => ({
    id: String(r.pk_acct_id),
    label: `${r.credit_card_no?.trim() || ''} — ${r.bank_name || ''} (${r.holders_name || ''})`,
  }));

  const formContent = (
    <form id="credit-card-form" onSubmit={onSubmit} className="grid grid-cols-12 gap-x-6 gap-y-4">
      {/* Left Column */}
      <div className="col-span-6 flex flex-col gap-4">
        {/* Bank Name */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Bank Name *
          </Label>
          <div className="col-span-8">
            <Select
              value={fk_b_com_id ? String(fk_b_com_id) : ''}
              onValueChange={(val) => form.setValue('fk_b_com_id', val, { shouldDirty: true })}
            >
              <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs">
                <SelectValue placeholder="Select Bank" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="z-[9999]">
                {lookups.banks.map((b) => (
                  <SelectItem key={b.pk_cont_id} value={String(b.pk_cont_id)} className="text-xs">
                    {b.contact_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.fk_b_com_id && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.fk_b_com_id.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Holder's Name */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Holder&apos;s Name *
          </Label>
          <div className="col-span-8">
            <Select
              value={fk_h_com_id ? String(fk_h_com_id) : ''}
              onValueChange={(val) => form.setValue('fk_h_com_id', val, { shouldDirty: true })}
            >
              <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs">
                <SelectValue placeholder="Select Card Holder" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="z-[9999]">
                {lookups.holders.map((h) => (
                  <SelectItem key={h.pk_cont_id} value={String(h.pk_cont_id)} className="text-xs">
                    {h.contact_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.fk_h_com_id && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.fk_h_com_id.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Credit Card No */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Credit Card No *
          </Label>
          <div className="col-span-8">
            <FormInput
              id="credit_card_no"
              placeholder="Enter Credit Card Number"
              {...form.register('credit_card_no')}
              className="h-9 text-xs"
            />
            {form.formState.errors.credit_card_no && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.credit_card_no.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Account Code */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Account Code *
          </Label>
          <div className="col-span-8">
            <FormInput
              id="account_code"
              placeholder="Enter Account Code"
              {...form.register('account_code')}
              className="h-9 text-xs"
            />
            {form.formState.errors.account_code && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.account_code.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Credit Card Account Name */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Account Name *
          </Label>
          <div className="col-span-8">
            <FormInput
              id="account"
              placeholder="Enter Credit Card Account Name"
              {...form.register('account')}
              className="h-9 text-xs"
            />
            {form.formState.errors.account && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.account.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Account Group */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Group *
          </Label>
          <div className="col-span-8">
            <Select
              value={group_name || ''}
              onValueChange={(val) => form.setValue('group_name', val, { shouldDirty: true })}
            >
              <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs">
                <SelectValue placeholder="Select Group" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="z-[9999]">
                {lookups.groups.map((g) => (
                  <SelectItem key={g.pk_grp_id} value={g.group_name} className="text-xs">
                    {g.group_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.group_name && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.group_name.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Opening Balance */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Opening Balance
          </Label>
          <div className="col-span-8">
            <FormInput
              id="opening_balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register('opening_balance')}
              className="h-9 text-xs"
            />
            {form.formState.errors.opening_balance && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.opening_balance.message?.toString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-6 flex flex-col gap-4">
        {/* GSTIN */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            GST No. *
          </Label>
          <div className="col-span-8">
            <FormInput
              id="cgst_no"
              placeholder="GST Number"
              {...form.register('cgst_no')}
              className="h-9 text-xs"
            />
            {form.formState.errors.cgst_no && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.cgst_no.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Credit Limit */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Credit Limit
          </Label>
          <div className="col-span-8">
            <FormInput
              id="credit_limit"
              type="number"
              step="0.01"
              placeholder="Total Credit Limit"
              {...form.register('credit_limit')}
              className="h-9 text-xs"
            />
            {form.formState.errors.credit_limit && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.credit_limit.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Cash Advance */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Cash Advance
          </Label>
          <div className="col-span-8">
            <FormInput
              id="cash_advance"
              type="number"
              step="0.01"
              placeholder="Cash Advance Limit"
              {...form.register('cash_advance')}
              className="h-9 text-xs"
            />
            {form.formState.errors.cash_advance && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.cash_advance.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Expiry Date */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Expiry Date
          </Label>
          <div className="col-span-8">
            <Controller
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <DatePicker
                  value={field.value || ''}
                  onChange={(date) => field.onChange(date)}
                  placeholder="Expiry date"
                />
              )}
            />
            {form.formState.errors.expiry_date && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.expiry_date.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Statement From */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Statement From
          </Label>
          <div className="col-span-8 flex items-center gap-2">
            <FormInput
              id="state_from"
              type="number"
              min="1"
              max="31"
              placeholder="Day (1-31)"
              {...form.register('state_from')}
              className="h-9 w-28 text-xs"
            />
            <span className="text-xxs text-muted-foreground">Day of the Month</span>
            {form.formState.errors.state_from && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.state_from.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Statement To */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Statement To
          </Label>
          <div className="col-span-8 flex items-center gap-2">
            <FormInput
              id="state_to"
              type="number"
              min="0"
              max="31"
              placeholder="Day (0-31)"
              {...form.register('state_to')}
              className="h-9 w-28 text-xs"
            />
            <span className="text-xxs text-muted-foreground">Day of the Month</span>
            {form.formState.errors.state_to && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.state_to.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Payment Day */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-4 text-xs font-medium tracking-wider uppercase">
            Payment Date
          </Label>
          <div className="col-span-8 flex items-center gap-2">
            <FormInput
              id="payment_day"
              type="number"
              min="0"
              max="31"
              placeholder="Day (0-31)"
              {...form.register('payment_day')}
              className="h-9 w-28 text-xs"
            />
            <span className="text-xxs text-muted-foreground">Day of the Month</span>
            {form.formState.errors.payment_day && (
              <p className="text-destructive text-xxs mt-1">
                {form.formState.errors.payment_day.message?.toString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <WindowPanel
        toolbarTitle="Credit Card"
        titleTabLabel="Details"
        listTabLabel="List"
        items={items}
        onAdd={resetForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        formContent={formContent}
        formId="credit-card-form"
        isSaving={create_mutation.isPending || update_mutation.isPending}
        onCancelTab1={resetForm}
        isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
        formName="Credit Card"
        isEdit={is_editing}
        className="h-[520px] w-full max-w-4xl"
      />

      <DeleteDialog
        isOpen={is_confirm_open}
        onClose={() => set_is_confirm_open(false)}
        onConfirm={handle_confirm_delete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this credit card? This action cannot be undone."
        itemName={records.find((r) => r.pk_acct_id === pending_delete_id)?.credit_card_no || ''}
        isDeleting={delete_mutation.isPending}
      />
    </>
  );
};
