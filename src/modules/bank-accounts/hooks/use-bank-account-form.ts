'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
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
import { BankAccount, HolderDetail } from '../types';
import { TreeNode, AcctGroup } from '../../account-groups/types';
import {
  useBankAccountsList,
  useCreateBankAccount,
  useUpdateBankAccount,
  useDeleteBankAccount,
  useIndividualLookups,
  useOrganizationLookups,
} from './use-bank-accounts';
import { useAccountGroupsTree } from '../../account-groups/hooks/use-account-groups';

type Mode = 'view' | 'add' | 'edit';

export function useBankAccountForm() {
  const [mode, set_mode] = useState<Mode>('view');
  const [active_tab, set_active_tab] = useState<'details' | 'list'>('details');
  const [selected_id, set_selected_id] = useState<number | string | null>(null);
  const [cursor, set_cursor] = useState(0);

  // Form states
  const [bank_name, set_bank_name] = useState('');
  const [account_no, set_account_no] = useState('');
  const [rtgs_neft_ifsc, set_rtgs_neft_ifsc] = useState('');
  const [account_type, set_account_type] = useState('Current Account');
  const [account_code, set_account_code] = useState('');
  const [bank_account_name, set_bank_account_name] = useState('');
  const [selected_group, set_selected_group] = useState<AcctGroup | null>(null);
  const [opening_balance, set_opening_balance] = useState(0.0);
  const [opening_balance_sec, set_opening_balance_sec] = useState(0.0);
  const [gst_no, set_gst_no] = useState('');
  const [nominee, set_nominee] = useState('');
  const [is_sys_defined, set_is_sys_defined] = useState(false);
  const [holder_details, set_holder_details] = useState<HolderDetail[]>([
    { id: '1', name: '', client_id: '' },
    { id: '2', name: '', client_id: '' },
    { id: '3', name: '', client_id: '' },
    { id: '4', name: '', client_id: '' },
  ]);

  const [filter_bank, set_filter_bank] = useState('');
  const [filter_account_no, set_filter_account_no] = useState('');
  const [is_confirm_open, set_is_confirm_open] = useState(false);

  const form_input_ref = useRef<HTMLInputElement>(null);

  // ── Queries & Mutations ──────────────────────────────────────────────────────
  const {
    data: records = [],
    isLoading: is_list_loading,
    refetch: refetch_list,
  } = useBankAccountsList({
    ...(filter_bank ? { bank_name: filter_bank } : {}),
    ...(filter_account_no ? { account_no: filter_account_no } : {}),
  });

  const { data: account_groups_tree = [], isLoading: is_tree_loading } = useAccountGroupsTree();

  const { data: individuals = [], isLoading: is_individuals_loading } = useIndividualLookups();
  const { data: organizations = [], isLoading: is_orgs_loading } = useOrganizationLookups();

  const create_mutation = useCreateBankAccount();
  const update_mutation = useUpdateBankAccount();
  const delete_mutation = useDeleteBankAccount();

  const loading =
    is_list_loading ||
    is_tree_loading ||
    is_individuals_loading ||
    is_orgs_loading ||
    create_mutation.isPending ||
    update_mutation.isPending ||
    delete_mutation.isPending;

  // Auto-adjust cursor if it goes out of bounds when records list changes
  useEffect(() => {
    if (records.length > 0 && cursor >= records.length) {
      set_cursor(records.length - 1);
    }
  }, [records, cursor]);

  // ── Populate form from record ───────────────────────────────────────────────
  const populate_form = useCallback((rec: BankAccount) => {
    set_bank_name(rec.bank_name);
    set_account_no(rec.account_no);
    set_rtgs_neft_ifsc(rec.rtgs_neft_ifsc);
    set_account_type(rec.account_type);
    set_account_code(rec.account_code);
    set_bank_account_name(rec.bank_account_name);
    set_opening_balance(rec.opening_balance);
    set_opening_balance_sec(rec.opening_balance_sec);
    set_gst_no(rec.gst_no);
    set_nominee(rec.nominee);
    set_is_sys_defined(rec.sys_defined ?? false);
    set_selected_id(rec.pk_ban_id);

    // Parse / pad holder details to always have 4 elements
    const padded_holders = [...rec.holder_details];
    while (padded_holders.length < 4) {
      padded_holders.push({
        id: String(padded_holders.length + 1),
        name: '',
        client_id: '',
      });
    }
    set_holder_details(padded_holders);

    // Group lookup
    if (rec.fk_grp_id) {
      set_selected_group({
        pk_grp_id: rec.fk_grp_id,
        group_name: rec.group_name || 'Bank',
      } as AcctGroup);
    } else {
      set_selected_group(null);
    }
  }, []);

  useEffect(() => {
    if (records.length > 0 && mode === 'view') {
      populate_form(records[cursor]);
    }
  }, [cursor, records, mode, populate_form]);

  const handle_add = () => {
    set_bank_name('');
    set_account_no('');
    set_rtgs_neft_ifsc('');
    set_account_type('Current Account');
    set_account_code('');
    set_bank_account_name('');
    set_opening_balance(0.0);
    set_opening_balance_sec(0.0);
    set_gst_no('');
    set_nominee('');
    set_is_sys_defined(false);
    set_selected_id(null);
    set_selected_group(null);
    set_holder_details([
      { id: '1', name: '', client_id: '' },
      { id: '2', name: '', client_id: '' },
      { id: '3', name: '', client_id: '' },
      { id: '4', name: '', client_id: '' },
    ]);
    set_mode('add');
    set_active_tab('details');
    setTimeout(() => form_input_ref.current?.focus(), 80);
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
    setTimeout(() => form_input_ref.current?.focus(), 80);
  };

  const handle_undo = () => {
    if (records[cursor]) populate_form(records[cursor]);
    set_mode('view');
  };

  const handle_save = async () => {
    if (!bank_name) {
      toast.error('Please select a Bank Name.');
      return;
    }
    if (!account_no.trim()) {
      toast.error('Please enter an Account Number.');
      return;
    }
    if (!account_code.trim()) {
      toast.error('Please enter an Account Code.');
      return;
    }
    if (!bank_account_name.trim()) {
      toast.error('Please enter a Bank Account Name.');
      return;
    }
    if (!selected_group) {
      toast.error('Please select a Group from the tree.');
      return;
    }
    if (!gst_no.trim()) {
      toast.error('Please enter a GST Number.');
      return;
    }

    const filtered_holders = holder_details.filter((h) => h.name.trim() || h.client_id.trim());

    const body = {
      bank_name: bank_name,
      account_no: account_no.trim(),
      rtgs_neft_ifsc: rtgs_neft_ifsc.trim(),
      account_type: account_type,
      account_code: account_code.trim(),
      bank_account_name: bank_account_name.trim(),
      fk_grp_id: selected_group.pk_grp_id,
      opening_balance: opening_balance,
      opening_balance_sec: opening_balance_sec,
      gst_no: gst_no.trim(),
      holder_details: filtered_holders,
      nominee: nominee.trim(),
    };

    try {
      if (mode === 'add') {
        await create_mutation.mutateAsync(body);
        toast.success(`"${bank_account_name.trim()}" saved.`);
      } else if (mode === 'edit' && selected_id) {
        await update_mutation.mutateAsync({
          id: selected_id,
          body,
        });
        toast.success(`"${bank_account_name.trim()}" updated.`);
      }
      set_mode('view');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save record');
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
      toast.success(`"${bank_account_name}" deleted.`);
      set_cursor(0);
      set_mode('view');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete record');
    }
  };

  const handle_refresh = async () => {
    set_filter_bank('');
    set_filter_account_no('');
    refetch_list();
    toast.success('Data refreshed.');
  };

  const handle_tree_select = (node: TreeNode) => {
    if (mode === 'add' || mode === 'edit') {
      set_selected_group(node);
      toast.success(`Assigned Group to "${node.group_name}"`);
    } else {
      // Find bank accounts linked to this group
      const idx = records.findIndex((r) => r.fk_grp_id === node.pk_grp_id);
      if (idx !== -1) {
        set_cursor(idx);
        populate_form(records[idx]);
      } else {
        set_selected_group(node);
      }
    }
  };

  const handle_select_record = (rec: BankAccount, index: number) => {
    set_cursor(index);
    populate_form(rec);
    set_active_tab('details');
    set_mode('view');
  };

  const handle_double_click_record = (rec: BankAccount, index: number) => {
    set_cursor(index);
    populate_form(rec);
    set_active_tab('details');
    handle_edit();
  };

  // Build/Mock the "Bank" tree structure
  const get_bank_tree = (): TreeNode[] => {
    const findBankNode = (nodes: TreeNode[]): TreeNode | null => {
      for (const n of nodes) {
        if (n.group_name.toLowerCase() === 'bank') return n;
        if (n.children) {
          const found = findBankNode(n.children);
          if (found) return found;
        }
      }
      return null;
    };

    const realBankNode = findBankNode(account_groups_tree);
    if (realBankNode) {
      return [realBankNode];
    }

    return [
      {
        pk_grp_id: 30,
        group_name: 'Bank',
        fk_prt_id: 0,
        fk_main_id: 30,
        fk_sub_id: 30,
        grouping: 5,
        prefix: '+',
        dc: 'DR',
        sync: 'N',
        sys_defined: true,
        date_time_stamp: '',
        fk_user_id: '1',
        last_status: 'Added',
        children: [
          {
            pk_grp_id: 31,
            group_name: 'Secured Loan',
            fk_prt_id: 30,
            fk_main_id: 30,
            fk_sub_id: 31,
            grouping: 5,
            prefix: '+',
            dc: 'DR',
            sync: 'N',
            sys_defined: false,
            date_time_stamp: '',
            fk_user_id: '1',
            last_status: 'Added',
            children: [],
          },
          {
            pk_grp_id: 32,
            group_name: 'Fixed Deposit',
            fk_prt_id: 30,
            fk_main_id: 30,
            fk_sub_id: 32,
            grouping: 5,
            prefix: '+',
            dc: 'DR',
            sync: 'N',
            sys_defined: false,
            date_time_stamp: '',
            fk_user_id: '1',
            last_status: 'Added',
            children: [],
          },
          {
            pk_grp_id: 33,
            group_name: 'Bank OD A/C',
            fk_prt_id: 30,
            fk_main_id: 30,
            fk_sub_id: 33,
            grouping: 5,
            prefix: '+',
            dc: 'DR',
            sync: 'N',
            sys_defined: false,
            date_time_stamp: '',
            fk_user_id: '1',
            last_status: 'Added',
            children: [],
          },
          {
            pk_grp_id: 34,
            group_name: 'BD Limits',
            fk_prt_id: 30,
            fk_main_id: 30,
            fk_sub_id: 34,
            grouping: 5,
            prefix: '+',
            dc: 'DR',
            sync: 'N',
            sys_defined: false,
            date_time_stamp: '',
            fk_user_id: '1',
            last_status: 'Added',
            children: [],
          },
        ],
      },
    ];
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
        toast.info('Select a group in the tree on the right and fill bank details.');
      },
    },
  ] as const;

  return {
    mode,
    active_tab,
    set_active_tab,
    selected_id,
    cursor,
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
    nominee,
    set_nominee,
    is_sys_defined,
    holder_details,
    set_holder_details,
    filter_bank,
    set_filter_bank,
    filter_account_no,
    set_filter_account_no,
    is_confirm_open,
    set_is_confirm_open,
    form_input_ref,
    records,
    refetch_list,
    individuals,
    organizations,
    account_groups_tree,
    is_tree_loading,
    loading,
    get_bank_tree,

    is_editing,
    crud_actions,
    utility_actions,
    handle_tree_select,
    handle_select_record,
    handle_double_click_record,
    handle_confirm_delete,
  };
}
