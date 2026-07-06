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
import { OldAsset } from '../types';
import { useFormPermission } from '@/hooks/use-form-permission';
import {
  useOldAssetsList,
  useOldAssetDetail,
  useCreateOldAsset,
  useUpdateOldAsset,
  useDeleteOldAsset,
  useAccountLookups,
  useSupplierLookups,
  useProductLookups,
  useBrandLookups,
  useCategoryLookups,
  useLocationLookups,
} from './use-old-assets';

type Mode = 'view' | 'add' | 'edit';

export function useOldAssetForm() {
  const permissions = useFormPermission('Old Asset');
  const [mode, set_mode] = useState<Mode>('view');
  const [active_tab, set_active_tab] = useState<'details' | 'list'>('details');
  const [selected_id, set_selected_id] = useState<number | string | null>(null);
  const [cursor, set_cursor] = useState(0);

  // Form states matching DB columns exactly (snake_case)
  const [asset_code, set_asset_code] = useState('');
  const [description, set_description] = useState('');
  const [fk_acct_id, set_fk_acct_id] = useState<number | null>(null);
  const [fk_s_acct_id, set_fk_s_acct_id] = useState<number | null>(null);
  const [fk_prod_id, set_fk_prod_id] = useState<number | null>(null);
  const [status, set_status] = useState(true);
  const [pur_date, set_pur_date] = useState('');
  const [pur_rate, set_pur_rate] = useState<number | ''>('');
  const [invoice_no, set_invoice_no] = useState('');
  const [serial_no, set_serial_no] = useState('');
  const [fk_loc_id, set_fk_loc_id] = useState<number | null>(null);
  const [fk_cat_id, set_fk_cat_id] = useState<number | null>(null);
  const [p_size, set_p_size] = useState('');
  const [fk_brd_id, set_fk_brd_id] = useState<number | null>(null);
  const [cat_no, set_cat_no] = useState('');
  const [exp_date, set_exp_date] = useState('');
  const [cur_value, set_cur_value] = useState<number | ''>('');
  const [usage, set_usage] = useState('');
  const [condition, set_condition] = useState('Good');
  const [c_location, set_c_location] = useState('');
  const [c_person, set_c_person] = useState('');
  const [c_details, set_c_details] = useState('');
  const [c_address, set_c_address] = useState('');
  const [issued_date, set_issued_date] = useState('');
  const [remarks, set_remarks] = useState('');

  // Filters
  const [filter_code, set_filter_code] = useState('');
  const [filter_desc, set_filter_desc] = useState('');
  const [is_confirm_open, set_is_confirm_open] = useState(false);

  const form_input_ref = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const {
    data: listData,
    isLoading: is_list_loading,
    refetch: refetch_list,
  } = useOldAssetsList({
    ...(filter_code ? { asset_code: filter_code } : {}),
    ...(filter_desc ? { description: filter_desc } : {}),
  });

  const records = listData?.items || [];

  const { data: activeDetail, isLoading: is_detail_loading } = useOldAssetDetail(selected_id);
  const { data: accounts = [] } = useAccountLookups();
  const { data: suppliers = [] } = useSupplierLookups();
  const { data: products = [] } = useProductLookups();
  const { data: brands = [] } = useBrandLookups();
  const { data: categories = [] } = useCategoryLookups();
  const { data: locations = [] } = useLocationLookups();

  const create_mutation = useCreateOldAsset();
  const update_mutation = useUpdateOldAsset();
  const delete_mutation = useDeleteOldAsset();

  const loading =
    is_list_loading ||
    is_detail_loading ||
    create_mutation.isPending ||
    update_mutation.isPending ||
    delete_mutation.isPending;

  // Auto-adjust cursor if it goes out of bounds when records list changes
  useEffect(() => {
    if (records.length > 0 && cursor >= records.length) {
      set_cursor(records.length - 1);
    }
  }, [records, cursor]);

  const populate_form = useCallback((rec: OldAsset) => {
    set_asset_code(rec.asset_code);
    set_description(rec.description);
    set_fk_acct_id(rec.fk_acct_id);
    set_fk_s_acct_id(rec.fk_s_acct_id);
    set_fk_prod_id(rec.fk_prod_id);
    set_status(rec.status);
    set_pur_date(rec.pur_date || '');
    set_pur_rate(rec.pur_rate !== null && rec.pur_rate !== undefined ? Number(rec.pur_rate) : '');
    set_invoice_no(rec.invoice_no || '');
    set_serial_no(rec.serial_no || '');
    set_fk_loc_id(rec.fk_loc_id);
    set_fk_cat_id(rec.fk_cat_id);
    set_p_size(rec.p_size || '');
    set_fk_brd_id(rec.fk_brd_id);
    set_cat_no(rec.cat_no || '');
    set_exp_date(rec.exp_date || '');
    set_cur_value(rec.cur_value !== null && rec.cur_value !== undefined ? Number(rec.cur_value) : '');
    set_usage(rec.usage || '');
    set_condition(rec.condition || 'Good');
    set_c_location(rec.c_location || '');
    set_c_person(rec.c_person || '');
    set_c_details(rec.c_details || '');
    set_c_address(rec.c_address || '');
    set_issued_date(rec.issued_date || '');
    set_remarks(rec.remarks || '');
    set_selected_id(rec.pk_ast_id);
  }, []);

  const clear_form = useCallback(() => {
    set_asset_code('');
    set_description('');
    set_fk_acct_id(null);
    set_fk_s_acct_id(null);
    set_fk_prod_id(null);
    set_status(true);
    set_pur_date('');
    set_pur_rate('');
    set_invoice_no('');
    set_serial_no('');
    set_fk_loc_id(null);
    set_fk_cat_id(null);
    set_p_size('');
    set_fk_brd_id(null);
    set_cat_no('');
    set_exp_date('');
    set_cur_value('');
    set_usage('');
    set_condition('Good');
    set_c_location('');
    set_c_person('');
    set_c_details('');
    set_c_address('');
    set_issued_date('');
    set_remarks('');
    set_selected_id(null);
  }, []);

  // Update form if details query fetches new details for the selected record
  useEffect(() => {
    if (activeDetail && selected_id && mode === 'view') {
      populate_form(activeDetail);
    }
  }, [activeDetail, selected_id, mode, populate_form]);

  const handle_add = () => {
    clear_form();
    set_mode('add');
    set_active_tab('details');
    setTimeout(() => form_input_ref.current?.focus(), 80);
  };

  const handle_edit = () => {
    if (!selected_id) {
      toast.info('Select a record first, then edit.');
      return;
    }
    set_mode('edit');
    set_active_tab('details');
    setTimeout(() => form_input_ref.current?.focus(), 80);
  };

  const handle_cancel = () => {
    set_mode('view');
    if (selected_id) {
      const active = records.find((r) => r.pk_ast_id === selected_id);
      if (active) populate_form(active);
    } else {
      clear_form();
    }
  };

  const handle_save = async () => {
    if (!asset_code.trim()) {
      toast.error('Asset code is required.');
      return;
    }
    if (!description.trim()) {
      toast.error('Description is required.');
      return;
    }
    if (!fk_acct_id) {
      toast.error('Asset account is required.');
      return;
    }
    if (!fk_prod_id) {
      toast.error('Product is required.');
      return;
    }
    if (!pur_date) {
      toast.error('Purchase date is required.');
      return;
    }
    if (pur_rate === '') {
      toast.error('Purchase rate is required.');
      return;
    }
    if (!fk_loc_id) {
      toast.error('Location is required.');
      return;
    }

    try {
      if (mode === 'add') {
        const payload = {
          asset_code,
          description,
          fk_acct_id,
          fk_s_acct_id: fk_s_acct_id || null,
          fk_prod_id,
          status,
          pur_date,
          pur_rate: Number(pur_rate),
          invoice_no,
          serial_no,
          fk_loc_id,
          fk_cat_id: fk_cat_id || null,
          p_size,
          fk_brd_id: fk_brd_id || null,
          cat_no,
          exp_date: exp_date || null,
          cur_value: cur_value !== '' ? Number(cur_value) : null,
          usage,
          condition,
          c_location,
          c_person,
          c_details,
          c_address,
          issued_date: issued_date || null,
          remarks,
        };

        const result = await create_mutation.mutateAsync(payload);
        toast.success(`Old Asset '${result.asset_code}' created successfully.`);
        set_selected_id(result.pk_ast_id);
        set_mode('view');
      } else if (mode === 'edit' && selected_id) {
        const payload = {
          asset_code,
          description,
          fk_acct_id,
          fk_s_acct_id: fk_s_acct_id || null,
          fk_prod_id,
          status,
          pur_date,
          pur_rate: Number(pur_rate),
          invoice_no,
          serial_no,
          fk_loc_id,
          fk_cat_id: fk_cat_id || null,
          p_size,
          fk_brd_id: fk_brd_id || null,
          cat_no,
          exp_date: exp_date || null,
          cur_value: cur_value !== '' ? Number(cur_value) : null,
          usage,
          condition,
          c_location,
          c_person,
          c_details,
          c_address,
          issued_date: issued_date || null,
          remarks,
        };

        const result = await update_mutation.mutateAsync({
          id: selected_id,
          body: payload,
        });
        toast.success(`Old Asset '${result.asset_code}' updated successfully.`);
        set_mode('view');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error occurred while saving asset.');
    }
  };

  const handle_delete = () => {
    if (!selected_id) {
      toast.info('Select a record first to delete.');
      return;
    }
    set_is_confirm_open(true);
  };

  const handle_confirm_delete = async () => {
    if (!selected_id) return;
    try {
      await delete_mutation.mutateAsync(selected_id);
      toast.success('Old Asset deleted successfully.');
      set_is_confirm_open(false);
      clear_form();

      if (records.length > 1) {
        const nextIndex = Math.max(0, cursor - 1);
        const nextRec = records[nextIndex];
        if (nextRec) {
          set_selected_id(nextRec.pk_ast_id);
          set_cursor(nextIndex);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete asset.');
      set_is_confirm_open(false);
    }
  };

  const navigate = useCallback(
    (index: number) => {
      if (records.length === 0) return;
      const safeIndex = Math.max(0, Math.min(records.length - 1, index));
      set_cursor(safeIndex);
      const target = records[safeIndex];
      if (target) {
        set_selected_id(target.pk_ast_id);
        if (mode !== 'view') set_mode('view');
      }
    },
    [records, mode],
  );

  const handle_first = () => navigate(0);
  const handle_prior = () => navigate(cursor - 1);
  const handle_next = () => navigate(cursor + 1);
  const handle_last = () => navigate(records.length - 1);

  const handle_select_record = (rec: OldAsset, index: number) => {
    set_selected_id(rec.pk_ast_id);
    set_cursor(index);
  };

  const handle_double_click_record = (rec: OldAsset, index: number) => {
    set_selected_id(rec.pk_ast_id);
    set_cursor(index);
    set_active_tab('details');
  };

  const crud_actions = [
    {
      label: mode === 'add' || mode === 'edit' ? 'Save' : 'Add New',
      icon: mode === 'add' || mode === 'edit' ? Save : Plus,
      onClick: mode === 'add' || mode === 'edit' ? handle_save : handle_add,
      variant: 'primary' as const,
      disabled:
        loading ||
        (mode === 'view' ? !permissions.add : (mode === 'add' ? !permissions.add : !permissions.edit)),
    },
    {
      label: mode === 'add' || mode === 'edit' ? 'Cancel' : 'Edit',
      icon: mode === 'add' || mode === 'edit' ? Undo2 : Edit,
      onClick: mode === 'add' || mode === 'edit' ? handle_cancel : handle_edit,
      variant: 'secondary' as const,
      disabled: loading || (mode === 'view' && (!selected_id || !permissions.edit)),
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handle_delete,
      variant: 'danger' as const,
      disabled: loading || mode === 'add' || !selected_id || !permissions.delete,
    },
  ];

  const utility_actions = [
    {
      title: 'Refresh',
      icon: RotateCw,
      onClick: () => {
        refetch_list();
        toast.success('Data refreshed.');
      },
      variant: 'icon' as const,
    },
    {
      title: 'Print',
      icon: Printer,
      onClick: () => toast.info('Print feature not implemented yet.'),
      variant: 'icon' as const,
    },
    {
      title: 'Export',
      icon: FileSpreadsheet,
      onClick: () => toast.info('Export feature not implemented yet.'),
      variant: 'icon' as const,
    },
    {
      title: 'Help',
      icon: HelpCircle,
      onClick: () => toast.info('ERP Old Asset module help documentation.'),
      variant: 'icon' as const,
    },
  ];

  return {
    mode,
    active_tab,
    set_active_tab,
    selected_id,
    cursor,
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
    is_editing: mode !== 'view',
    crud_actions,
    utility_actions,
    handle_select_record,
    handle_double_click_record,
    handle_confirm_delete,
    handle_first,
    handle_prior,
    handle_next,
    handle_last,
    permissions,
  };
}
