'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Toolbar from '@/components/shared/toolbar';
import { AssetsForm } from './assets-form';
import { AssetsList } from './assets-list';
import { DeleteDialog } from '@/components/common/delete-dialog';
import { useAssetForm } from '../hooks/use-asset-form';
import { Button } from '@/components/ui/button';

export function AssetsScreen() {
  const {
    mode,
    active_tab,
    set_active_tab,
    selected_id,
    cursor,
    asset_code,
    set_asset_code,
    status,
    set_status,
    description,
    set_description,
    fk_acct_id,
    set_fk_acct_id,
    fk_prod_id,
    set_fk_prod_id,
    exp_date,
    set_exp_date,
    condition,
    set_condition,
    parts,
    set_parts,
    additional_asset_codes_str,
    set_additional_asset_codes_str,
    is_sys_defined,
    filter_code,
    set_filter_code,
    filter_desc,
    set_filter_desc,
    is_confirm_open,
    set_is_confirm_open,
    form_input_ref,
    records,
    refetch_list,
    accounts,
    products,
    loading,
    is_editing,
    crud_actions,
    utility_actions,
    handle_select_record,
    handle_double_click_record,
    handle_confirm_delete,
    handle_first,
    handle_prior,
    handle_next,
    handle_last,
  } = useAssetForm();

  return (
    <div className="bg-background text-foreground flex h-full flex-col overflow-hidden p-2 font-sans">
      <Toolbar title="Asset" actions={crud_actions} utilities={utility_actions} />

      {/* Navigation & Tab Toggle Row */}
      <div className="my-2 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
        {/* Tab Buttons */}
        <div className="flex border-b">
          <button
            className={`mb-[-2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
              active_tab === 'details'
                ? 'border-primary text-primary bg-muted/30 font-bold'
                : 'text-foreground/80 hover:text-foreground border-transparent'
            }`}
            onClick={() => set_active_tab('details')}
          >
            Asset Details
          </button>
          <button
            className={`mb-[-2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
              active_tab === 'list'
                ? 'border-primary text-primary bg-muted/30 font-bold'
                : 'text-foreground/80 hover:text-foreground border-transparent'
            }`}
            onClick={() => {
              set_active_tab('list');
              refetch_list();
            }}
          >
            All Records List
          </button>
        </div>

        {/* Record Navigator (VB6-style First/Prior/Next/Last controls) */}
        {active_tab === 'details' && records.length > 0 && (
          <div className="flex items-center gap-1.5 bg-muted/40 border rounded-lg p-1 text-xs">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handle_first}
              disabled={cursor === 0 || is_editing}
              title="First Record"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handle_prior}
              disabled={cursor === 0 || is_editing}
              title="Prior Record"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-mono text-xxs font-semibold">
              Record: {records.length > 0 ? cursor + 1 : 0} of {records.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handle_next}
              disabled={cursor === records.length - 1 || is_editing}
              title="Next Record"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handle_last}
              disabled={cursor === records.length - 1 || is_editing}
              title="Last Record"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content Container */}
      {active_tab === 'details' ? (
        <div className="bg-card grid h-[calc(100vh-140px)] grid-cols-1 divide-y rounded-md border md:grid-cols-12 md:divide-x md:divide-y-0 md:overflow-hidden">
          {/* Main Detail Form */}
          <AssetsForm
            asset_code={asset_code}
            set_asset_code={set_asset_code}
            description={description}
            set_description={set_description}
            fk_prod_id={fk_prod_id}
            set_fk_prod_id={set_fk_prod_id}
            fk_acct_id={fk_acct_id}
            set_fk_acct_id={set_fk_acct_id}
            status={status}
            set_status={set_status}
            condition={condition}
            set_condition={set_condition}
            exp_date={exp_date}
            set_exp_date={set_exp_date}
            parts={parts}
            set_parts={set_parts}
            additional_asset_codes_str={additional_asset_codes_str}
            set_additional_asset_codes_str={set_additional_asset_codes_str}
            is_editing={is_editing}
            mode={mode}
            selected_id={selected_id}
            is_sys_defined={is_sys_defined}
            records={records}
            cursor={cursor}
            form_input_ref={form_input_ref}
            accounts={accounts}
            products={products}
          />

          {/* Quick Selection Sidebar (matches the right sidebar list in VB6 screen) */}
          <div className="flex h-full min-h-0 flex-col overflow-hidden md:col-span-4 bg-muted/10 p-3">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
              Asset Code List
            </span>
            <div className="flex-1 overflow-y-auto border rounded-lg bg-background scrollbar-thin">
              {records.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">No assets found.</div>
              ) : (
                <div className="divide-y font-mono text-xs">
                  {records.map((rec, idx) => (
                    <button
                      key={rec.pk_ast_id}
                      onClick={() => !is_editing && handle_select_record(rec, idx)}
                      disabled={is_editing}
                      className={`w-full text-left p-2.5 transition-all hover:bg-muted/40 flex items-center justify-between ${
                        selected_id === rec.pk_ast_id
                          ? 'bg-primary/10 border-l-4 border-primary text-primary font-semibold'
                          : 'text-foreground/80'
                      }`}
                    >
                      <span>{rec.asset_code}</span>
                      <span className="text-[10px] text-muted-foreground font-sans truncate max-w-[120px]">
                        {rec.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Full Records List */
        <AssetsList
          records={records}
          selected_id={selected_id}
          filter_code={filter_code}
          set_filter_code={set_filter_code}
          filter_desc={filter_desc}
          set_filter_desc={set_filter_desc}
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
        description="Are you sure you want to permanently delete this asset and all its parts? This action cannot be undone."
        itemName={asset_code}
        isDeleting={loading}
      />
    </div>
  );
}
