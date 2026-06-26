'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
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
import { DeleteDialog } from '@/components/common/delete-dialog';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';

import {
  useDebitCardsList,
  useCreateDebitCard,
  useUpdateDebitCard,
  useDeleteDebitCard,
} from '../hooks/use-debit-cards';
import { useBankAccountsList } from '@/modules/bank-accounts/hooks/use-bank-accounts';
import { useMasterEmployee } from '@/modules/master-employee/hooks/useMasterEmployee';
import { debitCardSchema, DebitCardDto } from '../types';

export const DebitCardWindow: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [is_confirm_open, set_is_confirm_open] = useState(false);
  const [pending_delete_id, set_pending_delete_id] = useState<number | null>(null);

  // Queries
  const { data: records = [], isLoading: is_loading } = useDebitCardsList();
  const { data: bank_accounts = [] } = useBankAccountsList();
  const { list: employees_query } = useMasterEmployee();
  const employees = employees_query.data?.data || [];

  const create_mutation = useCreateDebitCard();
  const update_mutation = useUpdateDebitCard();
  const delete_mutation = useDeleteDebitCard();

  const form = useForm<z.input<typeof debitCardSchema>, any, DebitCardDto>({
    resolver: zodResolver(debitCardSchema),
    defaultValues: {
      fk_ban_id: '',
      card_no: '',
      holder_name: '',
      expiry_date: new Date().toISOString().split('T')[0],
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  const resetForm = () => {
    setEditingId(null);
    form.reset({
      fk_ban_id: '',
      card_no: '',
      holder_name: '',
      expiry_date: new Date().toISOString().split('T')[0],
      sync: 'N',
      sys_defined: false,
    });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (editingId) {
        await update_mutation.mutateAsync({ id: editingId, body: data });
        toast.success('Debit card updated successfully.');
      } else {
        await create_mutation.mutateAsync(data);
        toast.success('Debit card added successfully.');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save debit card.');
    }
  });

  const handleEdit = (item: WindowPanelItem) => {
    const rec = records.find((r) => String(r.pk_deb_id) === item.id);
    if (!rec || !rec.pk_deb_id) return;
    if (rec.sys_defined) {
      toast.error('System-defined debit cards cannot be edited.');
      return;
    }
    setEditingId(rec.pk_deb_id);
    form.reset({
      pk_deb_id: rec.pk_deb_id,
      fk_ban_id: String(rec.fk_ban_id),
      card_no: rec.card_no,
      holder_name: rec.holder_name,
      expiry_date: rec.expiry_date ? rec.expiry_date.split('T')[0] : '',
      sync: rec.sync,
      sys_defined: rec.sys_defined,
    });
  };

  const handleDelete = (item: WindowPanelItem) => {
    const rec = records.find((r) => String(r.pk_deb_id) === item.id);
    if (!rec || !rec.pk_deb_id) return;
    if (rec.sys_defined) {
      toast.error('System-defined debit cards cannot be deleted.');
      return;
    }
    set_pending_delete_id(rec.pk_deb_id);
    set_is_confirm_open(true);
  };

  const handle_confirm_delete = async () => {
    if (!pending_delete_id) return;
    try {
      await delete_mutation.mutateAsync(pending_delete_id);
      set_is_confirm_open(false);
      set_pending_delete_id(null);
      resetForm();
      toast.success('Debit card deleted successfully.');
    } catch {
      set_is_confirm_open(false);
    }
  };

  const is_editing = editingId !== null;
  const fk_ban_id = form.watch('fk_ban_id');
  const holder_name = form.watch('holder_name');

  const items: WindowPanelItem[] = records.map((r) => ({
    id: String(r.pk_deb_id),
    label: `${r.card_no} — ${r.holder_name}`,
  }));

  const formContent = (
    <form id="debit-card-form" onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Bank Account */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Bank Account *
        </Label>
        <div className="col-span-9">
          <Select
            value={fk_ban_id ? String(fk_ban_id) : ''}
            onValueChange={(val) => form.setValue('fk_ban_id', val, { shouldDirty: true })}
          >
            <SelectTrigger className="border-border/85 bg-background/50 h-9 text-xs">
              <SelectValue placeholder="Select Bank Account" />
            </SelectTrigger>
            <SelectContent>
              {bank_accounts.map((b) => (
                <SelectItem key={b.pk_ban_id} value={String(b.pk_ban_id)} className="text-xs">
                  {b.bank_account_name} ({b.account_no})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.fk_ban_id && (
            <p className="text-destructive mt-1 text-[10px]">
              {form.formState.errors.fk_ban_id.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Debit Card No */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Debit Card No *
        </Label>
        <div className="col-span-9">
          <FormInput
            id="debit-card-no"
            placeholder="Enter Debit Card Number"
            {...form.register('card_no')}
            className="h-9 text-xs"
          />
          {form.formState.errors.card_no && (
            <p className="text-destructive mt-1 text-[10px]">
              {form.formState.errors.card_no.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Holder's Name */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Holder's Name *
        </Label>
        <div className="col-span-9">
          <Select
            value={holder_name || ''}
            onValueChange={(val) => form.setValue('holder_name', val, { shouldDirty: true })}
          >
            <SelectTrigger className="border-border/85 bg-background/50 h-9 text-xs">
              <SelectValue placeholder="Select Holder" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((e: any) => (
                <SelectItem key={e.pk_emp_id} value={e.employee} className="text-xs">
                  {e.employee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.holder_name && (
            <p className="text-destructive mt-1 text-[10px]">
              {form.formState.errors.holder_name.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Expiry Date */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Expiry Date *
        </Label>
        <div className="col-span-9">
          <Input
            type="date"
            {...form.register('expiry_date')}
            className="border-border/60 h-9 w-full text-xs"
          />
          {form.formState.errors.expiry_date && (
            <p className="text-destructive mt-1 text-[10px]">
              {form.formState.errors.expiry_date.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </form>
  );

  return (
    <>
      <WindowPanel
        toolbarTitle="Debit Card"
        titleTabLabel="Details"
        listTabLabel="List"
        items={items}
        onAdd={resetForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        formContent={formContent}
        formId="debit-card-form"
        isSaving={create_mutation.isPending || update_mutation.isPending}
        onCancelTab1={resetForm}
        isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
        formName="Debit Card"
        isEdit={is_editing}
        className="h-85"
      />

      <DeleteDialog
        isOpen={is_confirm_open}
        onClose={() => set_is_confirm_open(false)}
        onConfirm={handle_confirm_delete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this debit card? This action cannot be undone."
        itemName={records.find((r) => r.pk_deb_id === pending_delete_id)?.card_no || ''}
        isDeleting={delete_mutation.isPending}
      />
    </>
  );
};
