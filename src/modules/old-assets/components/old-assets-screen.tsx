'use client';

import * as React from 'react';
import Toolbar from '@/components/shared/toolbar';
import { OldAssetsForm } from './old-assets-form';
import { OldAssetsList } from './old-assets-list';
import { DeleteDialog } from '@/components/common/delete-dialog';
import { useOldAssetForm } from '../hooks/use-old-asset-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chip } from '@/components/common/chip';

export function OldAssetsScreen() {
  const {
    mode,
    active_tab,
    set_active_tab,
    selected_id,
    asset_code,
    set_asset_code,
    description,
    set_description,
    fk_acct_id,
    set_fk_acct_id,
    fk_s_acct_id,
    set_fk_s_acct_id,
    fk_prod_id,
    set_fk_prod_id,
    status,
    set_status,
    pur_date,
    set_pur_date,
    pur_rate,
    set_pur_rate,
    invoice_no,
    set_invoice_no,
    serial_no,
    set_serial_no,
    fk_loc_id,
    set_fk_loc_id,
    fk_cat_id,
    set_fk_cat_id,
    p_size,
    set_p_size,
    fk_brd_id,
    set_fk_brd_id,
    cat_no,
    set_cat_no,
    exp_date,
    set_exp_date,
    cur_value,
    set_cur_value,
    usage,
    set_usage,
    condition,
    set_condition,
    c_location,
    set_c_location,
    c_person,
    set_c_person,
    c_details,
    set_c_details,
    c_address,
    set_c_address,
    issued_date,
    set_issued_date,
    remarks,
    set_remarks,
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
    suppliers,
    products,
    brands,
    categories,
    locations,
    loading,
    is_editing,
    crud_actions,
    utility_actions,
    handle_select_record,
    handle_double_click_record,
    handle_confirm_delete,
  } = useOldAssetForm();

  return (
    <div className="mt-2 flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden">
      <Toolbar title="Old Asset Master" actions={crud_actions} utilities={utility_actions} />

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
                Old Asset Details
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
                <Chip label="Adding New Old Asset" variant="primary" pulse />
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
            <div className="bg-card flex h-full w-full rounded-md overflow-hidden">
              <OldAssetsForm
                asset_code={asset_code}
                set_asset_code={set_asset_code}
                description={description}
                set_description={set_description}
                fk_acct_id={fk_acct_id}
                set_fk_acct_id={set_fk_acct_id}
                fk_s_acct_id={fk_s_acct_id}
                set_fk_s_acct_id={set_fk_s_acct_id}
                fk_prod_id={fk_prod_id}
                set_fk_prod_id={set_fk_prod_id}
                status={status}
                set_status={set_status}
                pur_date={pur_date}
                set_pur_date={set_pur_date}
                pur_rate={pur_rate}
                set_pur_rate={set_pur_rate}
                invoice_no={invoice_no}
                set_invoice_no={set_invoice_no}
                serial_no={serial_no}
                set_serial_no={set_serial_no}
                fk_loc_id={fk_loc_id}
                set_fk_loc_id={set_fk_loc_id}
                fk_cat_id={fk_cat_id}
                set_fk_cat_id={set_fk_cat_id}
                p_size={p_size}
                set_p_size={set_p_size}
                fk_brd_id={fk_brd_id}
                set_fk_brd_id={set_fk_brd_id}
                cat_no={cat_no}
                set_cat_no={set_cat_no}
                exp_date={exp_date}
                set_exp_date={set_exp_date}
                cur_value={cur_value}
                set_cur_value={set_cur_value}
                usage={usage}
                set_usage={set_usage}
                condition={condition}
                set_condition={set_condition}
                c_location={c_location}
                set_c_location={set_c_location}
                c_person={c_person}
                set_c_person={set_c_person}
                c_details={c_details}
                set_c_details={set_c_details}
                c_address={c_address}
                set_c_address={set_c_address}
                issued_date={issued_date}
                set_issued_date={set_issued_date}
                remarks={remarks}
                set_remarks={set_remarks}
                is_editing={is_editing}
                mode={mode}
                form_input_ref={form_input_ref}
                accounts={accounts}
                suppliers={suppliers}
                products={products}
                brands={brands}
                categories={categories}
                locations={locations}
              />
            </div>
          </TabsContent>

          <TabsContent value="list" className="m-0 flex-1 overflow-y-auto p-6">
            <OldAssetsList
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
        description="Are you sure you want to permanently delete this old asset? This action cannot be undone."
        itemName={asset_code}
        isDeleting={loading}
      />
    </div>
  );
}
