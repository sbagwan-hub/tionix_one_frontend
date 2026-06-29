'use client';

import * as React from 'react';
import Toolbar from '@/components/shared/toolbar';
import { BankAccountForm } from './bank-account-form';
import { BankAccountsList } from './bank-accounts-list';
import { AccountGroupsTree } from '../../account-groups/components/account-groups-tree';
import { DeleteDialog } from '@/components/common/delete-dialog';
import { useBankAccountForm } from '../hooks/use-bank-account-form';

export function BankAccountsScreen() {
  const {
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
  } = useBankAccountForm();

  return (
    <div className="bg-background text-foreground flex h-full flex-col overflow-hidden p-4 font-sans select-none">
      <Toolbar title="Bank Account" actions={crud_actions} utilities={utility_actions} />

      {/* Tabs list toggle */}
      <div className="my-2 flex border-b">
        <button
          className={`mb-[-2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            active_tab === 'details'
              ? 'border-primary text-primary bg-muted/30 font-bold'
              : 'text-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => set_active_tab('details')}
        >
          Account Details
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

      {/* Content Container */}
      {active_tab === 'details' ? (
        <div className="bg-card grid h-[calc(100vh-140px)] grid-cols-1 divide-y rounded-md border md:grid-cols-12 md:divide-x md:divide-y-0 md:overflow-hidden">
          {/* Form Component */}
          <div className="h-full min-h-0 overflow-hidden md:col-span-7">
            <BankAccountForm
              bank_name={bank_name}
              set_bank_name={set_bank_name}
              account_no={account_no}
              set_account_no={set_account_no}
              rtgs_neft_ifsc={rtgs_neft_ifsc}
              set_rtgs_neft_ifsc={set_rtgs_neft_ifsc}
              account_type={account_type}
              set_account_type={set_account_type}
              account_code={account_code}
              set_account_code={set_account_code}
              bank_account_name={bank_account_name}
              set_bank_account_name={set_bank_account_name}
              selected_group={selected_group}
              set_selected_group={set_selected_group}
              opening_balance={opening_balance}
              set_opening_balance={set_opening_balance}
              opening_balance_sec={opening_balance_sec}
              set_opening_balance_sec={set_opening_balance_sec}
              gst_no={gst_no}
              set_gst_no={set_gst_no}
              holder_details={holder_details}
              set_holder_details={set_holder_details}
              nominee={nominee}
              set_nominee={set_nominee}
              is_editing={is_editing}
              mode={mode}
              selected_id={selected_id}
              is_sys_defined={is_sys_defined}
              records={records}
              cursor={cursor}
              form_input_ref={form_input_ref}
              individuals={individuals}
            />
          </div>

          {/* Tree Component */}
          <div className="h-full md:col-span-5">
            <AccountGroupsTree
              tree={get_bank_tree()}
              loading={is_tree_loading}
              selectedId={selected_group?.pk_grp_id ?? null}
              onSelectNode={handle_tree_select}
            />
          </div>
        </div>
      ) : (
        /* List Component */
        <BankAccountsList
          records={records}
          selected_id={selected_id}
          filter_bank={filter_bank}
          set_filter_bank={set_filter_bank}
          filter_account_no={filter_account_no}
          set_filter_account_no={set_filter_account_no}
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
        description="Are you sure you want to permanently delete this bank account? This action cannot be undone."
        itemName={bank_account_name}
        isDeleting={loading}
      />
    </div>
  );
}
