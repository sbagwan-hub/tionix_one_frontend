import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { stateSchema, StateDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const StateWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('state');
  const { list: countryList } = useMasterContacts('countryDropdown');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof stateSchema>, any, StateDto>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      state: '',
      fk_ctry_id: undefined,
      state_code: '',
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: StateDto) => {
    if (editingId) {
      update.mutate(
        { id: editingId, data },
        {
          onSuccess: () => resetForm(),
        },
      );
    } else {
      create.mutate(data, {
        onSuccess: () => resetForm(),
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    form.reset({
      state: '',
      fk_ctry_id: undefined,
      state_code: '',
      sync: 'N',
      sys_defined: false,
    });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const stateRecord = list.data?.find(
      (s: StateDto) => s.pk_state_id !== undefined && String(s.pk_state_id) === item.id,
    );
    if (stateRecord && stateRecord.pk_state_id !== undefined) {
      setEditingId(stateRecord.pk_state_id);
      form.reset({
        pk_state_id: stateRecord.pk_state_id,
        state: stateRecord.state,
        fk_ctry_id: stateRecord.fk_ctry_id,
        state_code: stateRecord.state_code || '',
        sync: stateRecord.sync,
        sys_defined: stateRecord.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(Number(item.id));
  };

  const items: WindowPanelItem[] = (list.data || []).map((s: StateDto) => ({
    id: s.pk_state_id !== undefined ? String(s.pk_state_id) : '',
    label: `${s.state} (${s.country || 'No Country'})`,
  }));

  const formContent = (
    <form id="state-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <FormInput
          id="state-name-input"
          label="State Name"
          placeholder="Enter state name (e.g. Maharashtra)"
          {...form.register('state')}
        />
        {form.formState.errors.state && (
          <span className="text-destructive text-[10px]">
            {form.formState.errors.state.message}
          </span>
        )}
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">Country</label>
        <select
          id="state-country-select"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-sm border px-3 py-1 text-xs shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...form.register('fk_ctry_id', { valueAsNumber: true })}
        >
          <option value="">Select a country...</option>
          {(countryList.data || []).map((c: any) => (
            <option key={c.pk_ctry_id} value={c.pk_ctry_id}>
              {c.country}
            </option>
          ))}
        </select>
        {form.formState.errors.fk_ctry_id && (
          <span className="text-destructive text-[10px]">
            {form.formState.errors.fk_ctry_id.message}
          </span>
        )}
      </div>

      <div>
        <FormInput
          id="state-code-input"
          label="State Code"
          placeholder="Enter state code (e.g. MH)"
          {...form.register('state_code')}
        />
        {form.formState.errors.state_code && (
          <span className="text-destructive text-[10px]">
            {form.formState.errors.state_code.message}
          </span>
        )}
      </div>
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="States"
      titleTabLabel="State Setup"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="state-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      className="h-[350px]"
    />
  );
};
