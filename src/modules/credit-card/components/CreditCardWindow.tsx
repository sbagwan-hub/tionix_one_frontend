'use client';

import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
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
import { AccountGroupsTree } from '@/modules/account-groups/components/account-groups-tree';
import { extractAxiosErrorMessage } from '@/lib/axios';

import {
  useCreditCardsList,
  useCreateCreditCard,
  useUpdateDebitCard,
  useDeleteCreditCard,
  useCreditCardLookups,
} from '../hooks/use-credit-cards';
import { useAccountGroupsTree } from '@/modules/account-groups/hooks/use-account-groups';
import { CreditCard } from '../types';
import { CreditCardForm } from './CreditCardForm';
import { CreditCardList } from './CreditCardList';

type Mode = 'view' | 'add' | 'edit';

export const CreditCardWindow: React.FC = () => {
  const [mode, set_mode] = useState<Mode>('view');
  const [active_tab, set_active_tab] = useState<'details' | 'list'>('details');
  const [selected_id, set_selected_id] = useState<number | null>(null);
  const [cursor, set_cursor] = useState(0);

  // Form states
  const [fk_b_com_id, set_fk_b_com_id] = useState<number | string>('');
  const [fk_h_com_id, set_fk_h_com_id] = useState<number | string>('');
  const [credit_card_no, set_credit_card_no] = useState('');
  const [account_code, set_account_code] = useState('');
  const [account, set_account] = useState('');
  const [group_name, set_group_name] = useState('');
  const [cgst_no, set_cgst_no] = useState('');
  const [opening_balance, set_opening_balance] = useState(0);
  const [credit_limit, set_credit_limit] = useState<number | null>(null);
  const [cash_advance, set_cash_advance] = useState<number | null>(null);
  const [expiry_date, set_expiry_date] = useState('');
  const [state_from, set_state_from] = useState<number | null>(null);
  const [state_to, set_state_to] = useState<number | null>(null);
  const [payment_day, set_payment_day] = useState<number | null>(null);
  const [is_sys_defined, set_is_sys_defined] = useState(false);

  const [filter_card, set_filter_card] = useState('');
  const [filter_holder, set_filter_holder] = useState('');
  const [is_confirm_open, set_is_confirm_open] = useState(false);

  // Queries & Mutations
  const {
    data: records = [],
    isLoading: is_list_loading,
    refetch: refetch_list,
  } = useCreditCardsList();
  const { data: lookups = { banks: [], holders: [], groups: [] } } = useCreditCardLookups();
  const { data: account_groups_tree = [], isLoading: is_tree_loading } = useAccountGroupsTree();

  const create_mutation = useCreateCreditCard();
  const update_mutation = useUpdateDebitCard();
  const delete_mutation = useDeleteCreditCard();

  const loading =
    is_list_loading ||
    create_mutation.isPending ||
    update_mutation.isPending ||
    delete_mutation.isPending;

  // Adjust cursor when records change
  useEffect(() => {
    if (records.length > 0 && cursor >= records.length) {
      set_cursor(records.length - 1);
    }
  }, [records, cursor]);

  // Populate form from a record
  const clear_form = () => {
    set_fk_b_com_id('');
    set_fk_h_com_id('');
    set_credit_card_no('');
    set_account_code('');
    set_account('');
    set_group_name('');
    set_cgst_no('');
    set_opening_balance(0);
    set_credit_limit(null);
    set_cash_advance(null);
    set_expiry_date('');
    set_state_from(null);
    set_state_to(null);
    set_payment_day(null);
    set_is_sys_defined(false);
    set_selected_id(null);
  };

  const populate_form = useCallback((rec: CreditCard) => {
    set_fk_b_com_id(rec.fk_b_com_id);
    set_fk_h_com_id(rec.fk_h_com_id);
    set_credit_card_no(rec.credit_card_no);
    set_account_code(rec.account_code);
    set_account(rec.account);
    set_group_name(rec.group_name || '');
    set_cgst_no(rec.cgst_no);
    set_opening_balance(Number(rec.opening_balance));
    set_credit_limit(rec.credit_limit ? Number(rec.credit_limit) : null);
    set_cash_advance(rec.cash_advance ? Number(rec.cash_advance) : null);
    set_expiry_date(rec.expiry_date ? rec.expiry_date.split('T')[0] : '');
    set_state_from(rec.state_from ?? null);
    set_state_to(rec.state_to ?? null);
    set_payment_day(rec.payment_day ?? null);
    set_is_sys_defined(rec.sys_defined ?? false);
    set_selected_id(rec.pk_acct_id ?? null);
  }, []);

  // Auto-populate in view mode only when a specific record is selected
  useEffect(() => {
    if (records.length > 0 && mode === 'view' && selected_id !== null) {
      const rec = records.find((r) => r.pk_acct_id === selected_id);
      if (rec) {
        populate_form(rec);
      }
    }
  }, [records, mode, selected_id, populate_form]);

  const handle_add = () => {
    clear_form();
    set_mode('add');
    set_active_tab('details');
  };

  const handle_edit = () => {
    if (!selected_id) {
      toast.info('Select a record first, then edit.');
      return;
    }
    if (is_sys_defined) {
      toast.error('System-defined records cannot be edited.');
      return;
    }
    set_mode('edit');
    set_active_tab('details');
  };

  const handle_undo = () => {
    if (selected_id !== null) {
      const rec = records.find((r) => r.pk_acct_id === selected_id);
      if (rec) populate_form(rec);
    } else {
      clear_form();
    }
    set_mode('view');
  };

  const handle_save = async () => {
    if (!fk_b_com_id) {
      toast.error('Please select a Bank Name.');
      return;
    }
    if (!fk_h_com_id) {
      toast.error("Please select Holder's Name.");
      return;
    }
    if (!credit_card_no.trim()) {
      toast.error('Please enter Credit Card No.');
      return;
    }
    if (!account_code.trim()) {
      toast.error('Please enter Account Code.');
      return;
    }
    if (!account.trim()) {
      toast.error('Please enter Account Name.');
      return;
    }
    if (!group_name) {
      toast.error('Please select a Group from tree.');
      return;
    }
    if (!cgst_no.trim()) {
      toast.error('Please enter GST Number.');
      return;
    }

    const body = {
      fk_b_com_id: Number(fk_b_com_id),
      fk_h_com_id: Number(fk_h_com_id),
      credit_card_no: credit_card_no.trim(),
      account_code: account_code.trim(),
      account: account.trim(),
      group_name,
      cgst_no: cgst_no.trim(),
      opening_balance,
      credit_limit,
      cash_advance,
      expiry_date: expiry_date ? new Date(expiry_date).toISOString() : null,
      state_from,
      state_to,
      payment_day,
    };

    try {
      if (mode === 'add') {
        await create_mutation.mutateAsync(body);
        toast.success(`"${account.trim()}" saved.`);
      } else if (mode === 'edit' && selected_id) {
        await update_mutation.mutateAsync({ id: selected_id, body });
        toast.success(`"${account.trim()}" updated.`);
      }
      set_mode('view');
    } catch (e: any) {
      toast.error(extractAxiosErrorMessage(e));
    }
  };

  const handle_delete = () => {
    if (!selected_id) {
      toast.info('Select a record first, then delete.');
      return;
    }
    if (is_sys_defined) {
      toast.error('Cannot delete system-defined records.');
      return;
    }
    set_is_confirm_open(true);
  };

  const handle_confirm_delete = async () => {
    if (!selected_id) return;
    try {
      await delete_mutation.mutateAsync(selected_id);
      toast.success(`"${account}" deleted.`);
      set_cursor(0);
      set_mode('view');
    } catch (e: any) {
      toast.error(extractAxiosErrorMessage(e));
    }
  };

  const handle_refresh = () => {
    set_filter_card('');
    set_filter_holder('');
    refetch_list();
    toast.success('Data refreshed.');
  };

  const handle_tree_select = (node: any) => {
    if (mode === 'add' || mode === 'edit') {
      set_group_name(node.group_name);
      toast.success(`Group set to "${node.group_name}"`);
    }
  };

  const handle_select_record = (rec: CreditCard, index: number) => {
    set_cursor(index);
    populate_form(rec);
    set_mode('view');
  };

  const handle_double_click_record = (rec: CreditCard, index: number) => {
    set_cursor(index);
    populate_form(rec);
    set_active_tab('details');
    set_mode('view');
  };

  const is_editing = mode === 'add' || mode === 'edit';

  const crud_actions = [
    {
      label: mode === 'edit' ? 'Save' : 'Add',
      icon: mode === 'edit' ? Save : Plus,
      variant: 'primary',
      onClick: mode === 'view' ? handle_add : handle_save,
      disabled: loading,
    },
    {
      label: 'Edit',
      icon: Edit,
      variant: 'secondary',
      onClick: handle_edit,
      disabled: is_editing || !selected_id || is_sys_defined || loading,
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      onClick: handle_delete,
      disabled: is_editing || !selected_id || is_sys_defined || loading,
    },
    {
      label: 'Cancel',
      icon: Undo2,
      variant: 'outline',
      onClick: handle_undo,
      disabled: !is_editing || loading,
    },
  ] as const;

  const utility_actions = [
    { icon: RotateCw, title: 'Refresh', onClick: handle_refresh },
    { icon: Printer, title: 'Print', onClick: () => window.print() },
    {
      icon: FileSpreadsheet,
      title: 'Export',
      onClick: () => {
        toast.info('Export coming soon.');
      },
    },
    {
      icon: HelpCircle,
      title: 'Help',
      onClick: () => {
        toast.info('Select a group in the tree on the right and fill credit card details.');
      },
    },
  ] as const;

  return (
    <div className="bg-background text-foreground flex h-full flex-col overflow-hidden font-sans">
      <Toolbar title="Credit Card" actions={crud_actions} utilities={utility_actions} />

      {/* Tabs */}
      <div className="my-2 flex border-b">
        <button
          className={`mb-[-2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            active_tab === 'details'
              ? 'border-primary text-primary bg-muted/30 font-bold'
              : 'text-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => set_active_tab('details')}
        >
          Card Details
        </button>
        <button
          className={`mb-[-2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            active_tab === 'list'
              ? 'border-primary text-primary bg-muted/30 font-bold'
              : 'text-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => {
            set_active_tab('list');
            if (records.length === 0) refetch_list();
          }}
        >
          All Records List
        </button>
      </div>

      {/* Content */}
      {active_tab === 'details' ? (
        <div className="bg-card grid h-[calc(100vh-140px)] grid-cols-1 divide-y rounded-md border md:grid-cols-12 md:divide-x md:divide-y-0 md:overflow-hidden">
          {/* Form – col-span-7 with internal scroll */}
          <CreditCardForm
            fk_b_com_id={fk_b_com_id}
            set_fk_b_com_id={set_fk_b_com_id}
            fk_h_com_id={fk_h_com_id}
            set_fk_h_com_id={set_fk_h_com_id}
            credit_card_no={credit_card_no}
            set_credit_card_no={set_credit_card_no}
            account_code={account_code}
            set_account_code={set_account_code}
            account={account}
            set_account={set_account}
            group_name={group_name}
            opening_balance={opening_balance}
            set_opening_balance={set_opening_balance}
            cgst_no={cgst_no}
            set_cgst_no={set_cgst_no}
            credit_limit={credit_limit}
            set_credit_limit={set_credit_limit}
            cash_advance={cash_advance}
            set_cash_advance={set_cash_advance}
            expiry_date={expiry_date}
            set_expiry_date={set_expiry_date}
            state_from={state_from}
            set_state_from={set_state_from}
            state_to={state_to}
            set_state_to={set_state_to}
            payment_day={payment_day}
            set_payment_day={set_payment_day}
            is_editing={is_editing}
            mode={mode}
            lookups={lookups}
          />

          {/* Tree – col-span-5 */}
          <div className="flex h-full min-h-0 flex-col overflow-hidden md:col-span-5">
            <AccountGroupsTree
              tree={account_groups_tree}
              loading={is_tree_loading}
              selectedId={
                lookups.groups.find((g) => g.group_name === group_name)?.pk_grp_id ?? null
              }
              onSelectNode={handle_tree_select}
            />
          </div>
        </div>
      ) : (
        <CreditCardList
          records={records}
          selected_id={selected_id}
          filter_card={filter_card}
          set_filter_card={set_filter_card}
          filter_holder={filter_holder}
          set_filter_holder={set_filter_holder}
          load_data={refetch_list}
          on_select_record={handle_select_record}
          on_double_click_record={handle_double_click_record}
        />
      )}

      <DeleteDialog
        isOpen={is_confirm_open}
        onClose={() => set_is_confirm_open(false)}
        onConfirm={handle_confirm_delete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this credit card? This action cannot be undone."
        itemName={account}
        isDeleting={loading}
      />
    </div>
  );
};
