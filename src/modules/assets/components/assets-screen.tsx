'use client';

import * as React from 'react';
import { ShieldAlert } from 'lucide-react';
import Toolbar from '@/components/shared/toolbar';
import { AssetsForm } from './assets-form';
import { AssetsList } from './assets-list';
import { DeleteDialog } from '@/components/common/delete-dialog';
import { useAssetForm } from '../hooks/use-asset-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chip } from '@/components/common/chip';

export function AssetsScreen() {
  const {
    mode,
    active_tab,
    set_active_tab,
    selected_id,
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
    permissions,
  } = useAssetForm();

  return (
    <div className="mt-2 flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden">
      <Toolbar title="Asset Master" actions={crud_actions} utilities={utility_actions} />

      <div className="border-border/60 bg-card text-card-foreground relative mt-4 flex w-full flex-col overflow-hidden rounded-sm border">
        <Tabs
          value={active_tab}
          onValueChange={(val) => {
            set_active_tab(val as 'details' | 'list');
            if (val === 'list') refetch_list();
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="border-border/80 bg-muted/15 flex items-center justify-between border-b p-2">
            <TabsList className="bg-muted h-9 rounded-md p-0.5">
              <TabsTrigger
                value="details"
                className="data-[state=active]:text-primary h-full rounded-sm px-5 text-xs font-semibold"
              >
                Asset Details
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:text-primary h-full rounded-sm px-5 text-xs font-semibold"
              >
                List
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {loading && <Chip label="Saving..." variant="primary" pulse />}
              {mode === 'add' && !loading && (
                <Chip label="Adding New Asset" variant="primary" pulse />
              )}
              {mode === 'edit' && !loading && (
                <Chip label={`Editing: ${asset_code}`} variant="primary" pulse />
              )}
              {mode === 'view' && selected_id && (
                <Chip label={`Viewing: ${asset_code}`} variant="neutral" />
              )}
            </div>
          </div>

          <TabsContent value="details" className="m-0 flex-1 overflow-hidden p-0">
            <div className="bg-card grid h-full w-full grid-cols-1 divide-y rounded-md md:grid-cols-12 md:divide-x md:divide-y-0 md:overflow-hidden">
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
                cursor={0}
                form_input_ref={form_input_ref}
                accounts={accounts}
                products={products}
              />

              {/* Quick Selection Sidebar */}
              <div className="bg-muted/10 flex h-full min-h-0 flex-col overflow-hidden border-l p-3 md:col-span-4">
                <span className="text-xxs text-muted-foreground mb-2 font-bold tracking-wider uppercase">
                  Asset Code List
                </span>
                <div className="bg-background flex-1 scrollbar-thin overflow-y-auto rounded-lg border">
                  {records.length === 0 ? (
                    <div className="text-muted-foreground p-4 text-center text-xs">
                      No assets found.
                    </div>
                  ) : (
                    <div className="divide-y font-mono text-xs">
                      {records.map((rec, idx) => (
                        <button
                          key={rec.pk_ast_id}
                          onClick={() => !is_editing && handle_select_record(rec, idx)}
                          disabled={is_editing}
                          className={`hover:bg-muted/40 flex w-full items-center justify-between p-2.5 text-left transition-all ${
                            selected_id === rec.pk_ast_id
                              ? 'bg-primary/10 border-primary text-primary border-l-4 font-semibold'
                              : 'text-foreground/80'
                          }`}
                        >
                          <span>{rec.asset_code}</span>
                          <span className="text-muted-foreground text-xxs max-w-[120px] truncate font-sans">
                            {rec.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="m-0 flex-1 overflow-y-auto p-6">
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
          </TabsContent>
        </Tabs>
      </div>

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
