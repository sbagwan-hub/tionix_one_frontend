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
import { Asset, AssetPartItem, AccountLookup, ProductLookup } from '../types';
import {
  useAssetsList,
  useAssetDetail,
  useCreateAsset,
  useUpdateAsset,
  useDeleteAsset,
  useAccountLookups,
  useProductLookups,
} from './use-assets';

type Mode = 'view' | 'add' | 'edit';

export function useAssetForm() {
  const [mode, set_mode] = useState<Mode>('view');
  const [active_tab, set_active_tab] = useState<'details' | 'list'>('details');
  const [selected_id, set_selected_id] = useState<number | string | null>(null);
  const [cursor, set_cursor] = useState(0);

  // Form states
  const [asset_code, set_asset_code] = useState('');
  const [status, set_status] = useState(true);
  const [description, set_description] = useState('');
  const [fk_acct_id, set_fk_acct_id] = useState<number | null>(null);
  const [fk_prod_id, set_fk_prod_id] = useState<number | null>(null);
  const [exp_date, set_exp_date] = useState('');
  const [condition, set_condition] = useState('Good');
  const [parts, set_parts] = useState<AssetPartItem[]>([]);
  const [additional_asset_codes_str, set_additional_asset_codes_str] = useState('');
  const [is_sys_defined, set_is_sys_defined] = useState(false);

  const [filter_code, set_filter_code] = useState('');
  const [filter_desc, set_filter_desc] = useState('');
  const [is_confirm_open, set_is_confirm_open] = useState(false);

  const form_input_ref = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const {
    data: listData,
    isLoading: is_list_loading,
    refetch: refetch_list,
  } = useAssetsList({
    ...(filter_code ? { asset_code: filter_code } : {}),
    ...(filter_desc ? { description: filter_desc } : {}),
  });

  const records = listData?.items || [];

  const { data: activeDetail, isLoading: is_detail_loading } = useAssetDetail(selected_id);
  const { data: accounts = [] } = useAccountLookups();
  const { data: products = [] } = useProductLookups();

  const create_mutation = useCreateAsset();
  const update_mutation = useUpdateAsset();
  const delete_mutation = useDeleteAsset();

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

  const populate_form = useCallback((rec: Asset) => {
    set_asset_code(rec.asset_code);
    set_status(rec.status);
    set_description(rec.description);
    set_fk_acct_id(rec.fk_acct_id);
    set_fk_prod_id(rec.fk_prod_id);
    set_exp_date(rec.exp_date || '');
    set_condition(rec.condition);
    set_is_sys_defined(rec.sys_defined ?? false);
    set_selected_id(rec.pk_ast_id);
    set_additional_asset_codes_str('');
    set_parts(rec.parts || []);
  }, []);

  const clear_form = useCallback(() => {
    set_asset_code('');
    set_status(true);
    set_description('');
    set_fk_acct_id(null);
    set_fk_prod_id(null);
    set_exp_date('');
    set_condition('Good');
    set_is_sys_defined(false);
    set_selected_id(null);
    set_parts([]);
    set_additional_asset_codes_str('');
  }, []);

  // Update form if details query fetches new details for the selected record
  useEffect(() => {
    if (activeDetail && selected_id && mode === 'view') {
      populate_form(activeDetail);
    }
  }, [activeDetail, selected_id, mode, populate_form]);

  // Initial population of form if records exist
  useEffect(() => {
    if (records.length > 0 && !selected_id && mode === 'view') {
      const first = records[0];
      if (first) {
        set_selected_id(first.pk_ast_id);
        set_cursor(0);
      }
    }
  }, [records, selected_id, mode]);

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
    if (is_sys_defined) {
      toast.error('System-defined records cannot be edited.');
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
      toast.error('Asset description is required.');
      return;
    }
    if (!fk_acct_id) {
      toast.error('Asset account is required.');
      return;
    }
    if (!fk_prod_id) {
      toast.error('Asset product is required.');
      return;
    }

    const additional_asset_codes = additional_asset_codes_str
      ? additional_asset_codes_str
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const formattedParts = parts.map((p) => ({
      pk_part_id: p.pk_part_id,
      fk_prod_id: p.fk_prod_id,
      description: p.description,
      quantity: typeof p.quantity === 'string' ? parseFloat(p.quantity) : p.quantity,
    }));

    try {
      if (mode === 'add') {
        const payload = {
          asset_code,
          fk_acct_id,
          fk_prod_id,
          description,
          status,
          condition,
          exp_date: exp_date || undefined,
          parts: formattedParts,
          additional_asset_codes,
        };

        const result = await create_mutation.mutateAsync(payload);
        toast.success(`Asset '${result.asset_code}' created successfully.`);
        set_selected_id(result.pk_ast_id);
        set_mode('view');
      } else if (mode === 'edit' && selected_id) {
        const payload = {
          asset_code,
          fk_acct_id,
          fk_prod_id,
          description,
          status,
          condition,
          exp_date: exp_date || null,
          parts: formattedParts,
        };

        const result = await update_mutation.mutateAsync({
          id: selected_id,
          body: payload,
        });
        toast.success(`Asset '${result.asset_code}' updated successfully.`);
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
    if (is_sys_defined) {
      toast.error('System-defined assets cannot be deleted.');
      return;
    }
    set_is_confirm_open(true);
  };

  const handle_confirm_delete = async () => {
    if (!selected_id) return;
    try {
      await delete_mutation.mutateAsync(selected_id);
      toast.success('Asset deleted successfully.');
      set_is_confirm_open(false);
      clear_form();

      // Adjust cursor / selection
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

  const handle_select_record = (rec: Asset, index: number) => {
    set_selected_id(rec.pk_ast_id);
    set_cursor(index);
  };

  const handle_double_click_record = (rec: Asset, index: number) => {
    set_selected_id(rec.pk_ast_id);
    set_cursor(index);
    set_active_tab('details');
  };

  // Build the list of toolbar actions compliant with standardized toolbar interface
  const crud_actions = [
    {
      label: mode === 'add' || mode === 'edit' ? 'Save' : 'Add New',
      icon: mode === 'add' || mode === 'edit' ? Save : Plus,
      onClick: mode === 'add' || mode === 'edit' ? handle_save : handle_add,
      variant: 'primary' as const,
      disabled: loading,
    },
    {
      label: mode === 'add' || mode === 'edit' ? 'Cancel' : 'Edit',
      icon: mode === 'add' || mode === 'edit' ? Undo2 : Edit,
      onClick: mode === 'add' || mode === 'edit' ? handle_cancel : handle_edit,
      variant: 'secondary' as const,
      disabled: loading || (mode === 'view' && !selected_id) || is_sys_defined,
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handle_delete,
      variant: 'danger' as const,
      disabled: loading || mode === 'add' || !selected_id || is_sys_defined,
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
      onClick: () => toast.info('ERP Asset module help documentation.'),
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
  };
}
