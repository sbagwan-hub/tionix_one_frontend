'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Plus,
  Edit,
  Trash2,
  Undo2,
  Save,
  RotateCw,
  Printer,
  FileSpreadsheet,
  HelpCircle,
} from 'lucide-react';

import Toolbar from '@/components/shared/toolbar';
import { DeleteDialog } from '@/components/common/delete-dialog';
import { z } from 'zod';
import { useChequeBooksList, useCreateChequeBook, useUpdateChequeBook, useDeleteChequeBook } from '../hooks/use-cheque-books';
import { useBankAccountsList } from '@/modules/bank-accounts/hooks/use-bank-accounts';
import { chequeBookSchema, ChequeBookDto } from '../types';
import { ChequeBookForm } from './ChequeBookForm';
import { ChequeBookList } from './ChequeBookList';

type Mode = 'view' | 'add' | 'edit';

export const ChequeBookWindow: React.FC = () => {
  const [mode, set_mode] = useState<Mode>('view');
  const [active_tab, set_active_tab] = useState<'details' | 'list'>('details');
  const [selected_id, set_selected_id] = useState<string | number | null>(null);
  const [cursor, set_cursor] = useState(0);

  const [page, set_page] = useState(1);
  const page_size = 15;

  const [is_confirm_open, set_is_confirm_open] = useState(false);
  const start_no_input_ref = useRef<HTMLInputElement>(null);

  // Queries
  const { data: records = [], isLoading: is_loading, refetch: refetch_list } = useChequeBooksList();
  const { data: bank_accounts = [] } = useBankAccountsList();

  const create_mutation = useCreateChequeBook();
  const update_mutation = useUpdateChequeBook();
  const delete_mutation = useDeleteChequeBook();

  const total_records = records.length;
  const total_pages = Math.ceil(total_records / page_size);
  const paginated_records = records.slice((page - 1) * page_size, page * page_size);

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

  const watched_start_no = form.watch('start_no');
  const watched_end_no = form.watch('end_no');

  // Auto calculate total cheques
  useEffect(() => {
    const s = Number(watched_start_no) || 0;
    const e = Number(watched_end_no) || 0;
    if (s > 0 && e >= s) {
      form.setValue('total_cheques', e - s + 1);
    } else {
      form.setValue('total_cheques', 0);
    }
  }, [watched_start_no, watched_end_no, form]);

  const populate_form = useCallback(
    (rec: ChequeBookDto) => {
      set_selected_id(rec.pk_chq_id ?? null);
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
    },
    [form],
  );

  useEffect(() => {
    if (records.length > 0 && mode === 'view' && cursor >= 0 && cursor < records.length) {
      populate_form(records[cursor]);
    }
  }, [cursor, records, mode, populate_form]);

  const handle_add = () => {
    set_mode('add');
    set_selected_id(null);
    form.reset({
      fk_ban_id: bank_accounts[0]?.pk_ban_id ? String(bank_accounts[0].pk_ban_id) : '',
      start_no: 0,
      end_no: 0,
      total_cheques: 0,
      date_issue: new Date().toISOString().split('T')[0],
      sync: 'N',
      sys_defined: false,
    });
    set_active_tab('details');
    setTimeout(() => start_no_input_ref.current?.focus(), 100);
  };

  const handle_edit = () => {
    if (!selected_id) return;
    const current = records.find((r) => r.pk_chq_id === selected_id);
    if (current?.sys_defined) {
      toast.error('System-defined cheque books cannot be edited.');
      return;
    }
    set_mode('edit');
    set_active_tab('details');
    setTimeout(() => start_no_input_ref.current?.focus(), 100);
  };

  const handle_undo = () => {
    set_mode('view');
    if (records[cursor]) {
      populate_form(records[cursor]);
    }
  };

  const handle_save = form.handleSubmit(async (data) => {
    const bank_acct = bank_accounts.find(b => String(b.pk_ban_id) === String(data.fk_ban_id));
    const payload = {
      ...data,
      bank_account_name: bank_acct ? bank_acct.bank_account_name : '',
    };
    try {
      if (mode === 'add') {
        await create_mutation.mutateAsync(payload);
        set_mode('view');
        toast.success('Cheque book added successfully.');
      } else if (mode === 'edit' && selected_id) {
        await update_mutation.mutateAsync({ id: selected_id, body: payload });
        set_mode('view');
        toast.success('Cheque book updated successfully.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save cheque book');
    }
  });

  const handle_delete = () => {
    if (!selected_id) return;
    const current = records.find((r) => r.pk_chq_id === selected_id);
    if (current?.sys_defined) {
      toast.error('System-defined cheque books cannot be deleted.');
      return;
    }
    set_is_confirm_open(true);
  };

  const handle_confirm_delete = async () => {
    if (!selected_id) return;
    try {
      await delete_mutation.mutateAsync(selected_id);
      set_is_confirm_open(false);
      set_cursor(0);
      set_mode('view');
      toast.success('Cheque book deleted successfully.');
    } catch (err) {
      set_is_confirm_open(false);
    }
  };

  const handle_select_record = (rec: ChequeBookDto, index: number) => {
    set_cursor(index);
    populate_form(rec);
    set_active_tab('details');
    set_mode('view');
  };

  const is_editing = mode === 'add' || mode === 'edit';

  const actions = [
    {
      label: mode === 'view' ? 'Add' : 'Save',
      icon: mode === 'view' ? Plus : Save,
      variant: 'primary' as const,
      onClick: mode === 'view' ? handle_add : handle_save,
      disabled: is_loading || (mode !== 'view' && !form.formState.isDirty),
    },
    {
      label: 'Edit',
      icon: Edit,
      variant: 'secondary' as const,
      onClick: handle_edit,
      disabled: is_editing || !selected_id || records[cursor]?.sys_defined || is_loading,
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger' as const,
      onClick: handle_delete,
      disabled: is_editing || !selected_id || records[cursor]?.sys_defined || is_loading,
    },
    {
      label: 'Cancel',
      icon: Undo2,
      variant: 'outline' as const,
      onClick: handle_undo,
      disabled: !is_editing || is_loading,
    },
  ];

  const utilities = [
    { icon: RotateCw, title: 'Refresh', onClick: () => { refetch_list(); toast.success('Data refreshed.'); } },
    { icon: Printer, title: 'Print', onClick: () => window.print() },
    {
      icon: FileSpreadsheet,
      title: 'Export',
      onClick: () => toast.info('Export coming soon.'),
    },
    {
      icon: HelpCircle,
      title: 'Help',
      onClick: () => toast.info('Configure cheque leaf sequences for bank accounts.'),
    },
  ];

  return (
    <div className="bg-background text-foreground flex h-full flex-col overflow-hidden p-4 font-sans select-none">
      <Toolbar title="Cheque Book" actions={actions} utilities={utilities} />

      {/* Tabs */}
      <div className="border-border/60 my-2 flex border-b">
        <button
          type="button"
          className={`-mb-[2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            active_tab === 'details'
              ? 'border-primary text-primary bg-primary/5 font-bold'
              : 'text-muted-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => set_active_tab('details')}
        >
          Cheque Book Details
        </button>
        <button
          type="button"
          className={`-mb-[2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            active_tab === 'list'
              ? 'border-primary text-primary bg-primary/5 font-bold'
              : 'text-muted-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => set_active_tab('list')}
        >
          Cheque Books List
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {active_tab === 'details' ? (
          <ChequeBookForm
            form={form}
            is_editing={is_editing}
            bank_accounts={bank_accounts}
            start_no_input_ref={start_no_input_ref}
          />
        ) : (
          <ChequeBookList
            is_loading={is_loading}
            paginated_records={paginated_records}
            selected_id={selected_id}
            page={page}
            set_page={set_page}
            page_size={page_size}
            total_records={total_records}
            total_pages={total_pages}
            handle_select_record={handle_select_record}
          />
        )}
      </div>

      <DeleteDialog
        isOpen={is_confirm_open}
        onClose={() => set_is_confirm_open(false)}
        onConfirm={handle_confirm_delete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this cheque book? This action cannot be undone."
        itemName={String(records.find((r) => r.pk_chq_id === selected_id)?.start_no || '')}
        isDeleting={delete_mutation.isPending}
      />
    </div>
  );
};
