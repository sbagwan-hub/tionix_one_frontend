'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
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
  useChequeBooksList,
  useCreateChequeBook,
  useUpdateChequeBook,
  useDeleteChequeBook,
} from '../hooks/use-cheque-books';
import { useBankAccountsList } from '@/modules/bank-accounts/hooks/use-bank-accounts';
import { chequeBookSchema, ChequeBookDto } from '../types';

export const ChequeBookWindow: React.FC = () => {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [is_confirm_open, set_is_confirm_open] = useState(false);
  const [pending_delete_id, set_pending_delete_id] = useState<string | number | null>(null);

  // Queries
  const { data: records = [], isLoading: is_loading } = useChequeBooksList();
  const { data: bank_accounts = [] } = useBankAccountsList();

  const create_mutation = useCreateChequeBook();
  const update_mutation = useUpdateChequeBook();
  const delete_mutation = useDeleteChequeBook();

  const form = useForm<z.input<typeof chequeBookSchema>, any, ChequeBookDto>({
    resolver: zodResolver(chequeBookSchema),
    defaultValues: {
      fk_ban_id: '',
      start_no: 0,
      end_no: 0,
      total_cheques: 0,
      date_issue: new Date().toISOString().split('T')[0],
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  // Auto-calculate total cheques
  const watched_start_no = form.watch('start_no');
  const watched_end_no = form.watch('end_no');
  useEffect(() => {
    const s = Number(watched_start_no) || 0;
    const e = Number(watched_end_no) || 0;
    form.setValue('total_cheques', s > 0 && e >= s ? e - s + 1 : 0);
  }, [watched_start_no, watched_end_no, form]);

  const resetForm = () => {
    setEditingId(null);
    form.reset({
      fk_ban_id: '',
      start_no: 0,
      end_no: 0,
      total_cheques: 0,
      date_issue: new Date().toISOString().split('T')[0],
      sync: 'N',
      sys_defined: false,
    });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (editingId) {
        await update_mutation.mutateAsync({ id: editingId, body: data });
        toast.success('Cheque book updated successfully.');
      } else {
        await create_mutation.mutateAsync(data);
        toast.success('Cheque book added successfully.');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save cheque book.');
    }
  });

  const handleEdit = (item: WindowPanelItem) => {
    const rec = records.find((r) => String(r.pk_chq_id) === item.id);
    if (!rec) return;
    if (rec.sys_defined) {
      toast.error('System-defined cheque books cannot be edited.');
      return;
    }
    setEditingId(rec.pk_chq_id ?? null);
    form.reset({
      pk_chq_id: rec.pk_chq_id,
      fk_ban_id: String(rec.fk_ban_id),
      start_no: rec.start_no,
      end_no: rec.end_no,
      total_cheques: rec.total_cheques,
      date_issue: rec.date_issue ? rec.date_issue.split('T')[0] : '',
      sync: rec.sync,
      sys_defined: rec.sys_defined,
    });
  };

  const handleDelete = (item: WindowPanelItem) => {
    const rec = records.find((r) => String(r.pk_chq_id) === item.id);
    if (!rec) return;
    if (rec.sys_defined) {
      toast.error('System-defined cheque books cannot be deleted.');
      return;
    }
    set_pending_delete_id(rec.pk_chq_id ?? null);
    set_is_confirm_open(true);
  };

  const handle_confirm_delete = async () => {
    if (!pending_delete_id) return;
    try {
      await delete_mutation.mutateAsync(pending_delete_id);
      set_is_confirm_open(false);
      set_pending_delete_id(null);
      resetForm();
      toast.success('Cheque book deleted successfully.');
    } catch {
      set_is_confirm_open(false);
    }
  };

  const is_editing = editingId !== null;
  const fk_ban_id = form.watch('fk_ban_id');
  const total_cheques = form.watch('total_cheques');

  const items: WindowPanelItem[] = records.map((r) => ({
    id: String(r.pk_chq_id),
    label: `${r.start_no} – ${r.end_no} (${r.total_cheques} leaves)`,
  }));

  const formContent = (
    <form id="cheque-book-form" onSubmit={onSubmit} className="flex flex-col gap-5">
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
            <p className="text-destructive text-xxs mt-1">
              {form.formState.errors.fk_ban_id.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Starting Cheque No */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Starting Cheque No *
        </Label>
        <div className="col-span-9">
          <FormInput
            id="cheque-start-no"
            type="number"
            placeholder="Enter starting number"
            {...form.register('start_no')}
            className="h-9 text-xs"
          />
          {form.formState.errors.start_no && (
            <p className="text-destructive text-xxs mt-1">
              {form.formState.errors.start_no.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Ending Cheque No */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Ending Cheque No *
        </Label>
        <div className="col-span-9">
          <FormInput
            id="cheque-end-no"
            type="number"
            placeholder="Enter ending number"
            {...form.register('end_no')}
            className="h-9 text-xs"
          />
          {form.formState.errors.end_no && (
            <p className="text-destructive text-xxs mt-1">
              {form.formState.errors.end_no.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Total Cheques (read-only, auto-calculated) */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Total Cheques
        </Label>
        <div className="col-span-9">
          <Input
            type="number"
            readOnly
            value={Number(total_cheques ?? 0)}
            className="bg-muted/50 border-border/40 h-9 font-mono text-xs font-bold"
          />
        </div>
      </div>

      {/* Date of Issue */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Date of Issue
        </Label>
        <div className="col-span-9">
          <Input
            type="date"
            {...form.register('date_issue')}
            className="border-border/60 h-9 w-full text-xs"
          />
          {form.formState.errors.date_issue && (
            <p className="text-destructive text-xxs mt-1">
              {form.formState.errors.date_issue.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </form>
  );

  return (
    <>
      <WindowPanel
        toolbarTitle="Cheque Book"
        titleTabLabel="Cheque Book Details"
        listTabLabel="Cheque Books List"
        items={items}
        onAdd={resetForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        formContent={formContent}
        formId="cheque-book-form"
        isSaving={create_mutation.isPending || update_mutation.isPending}
        onCancelTab1={resetForm}
        isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
        formName="Cheque Book"
        isEdit={is_editing}
        className="h-100"
      />

      <DeleteDialog
        isOpen={is_confirm_open}
        onClose={() => set_is_confirm_open(false)}
        onConfirm={handle_confirm_delete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this cheque book? This action cannot be undone."
        itemName={String(records.find((r) => r.pk_chq_id === pending_delete_id)?.start_no || '')}
        isDeleting={delete_mutation.isPending}
      />
    </>
  );
};
