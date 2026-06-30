import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { regionSchema, RegionDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const RegionWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('region');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof regionSchema>, any, RegionDto>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      region: '',
      rate1: 0,
      rate2: 0,
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: RegionDto) => {
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
      region: '',
      rate1: 0,
      rate2: 0,
      sync: 'N',
      sys_defined: false,
    });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const regionRecord = list.data?.find(
      (r: RegionDto) => r.pk_reg_id !== undefined && String(r.pk_reg_id) === item.id,
    );
    if (regionRecord && regionRecord.pk_reg_id !== undefined) {
      setEditingId(regionRecord.pk_reg_id);
      form.reset({
        pk_reg_id: regionRecord.pk_reg_id,
        region: regionRecord.region,
        rate1: Number(regionRecord.rate1),
        rate2: Number(regionRecord.rate2),
        sync: regionRecord.sync,
        sys_defined: regionRecord.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(Number(item.id));
  };

  const items: WindowPanelItem[] = (list.data || []).map((r: RegionDto) => ({
    id: r.pk_reg_id !== undefined ? String(r.pk_reg_id) : '',
    label: `${r.region} (${r.pk_reg_id})`,
  }));

  const formContent = (
    <form id="region-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <FormInput
          id="region-name-input"
          label="Area/Region/Shipping Location"
          placeholder="Enter location name"
          {...form.register('region')}
        />
        {form.formState.errors.region && (
          <span className="text-destructive text-xxs">{form.formState.errors.region.message}</span>
        )}
      </div>

      <div>
        <FormInput
          id="region-rate1-input"
          label="Trip Rate"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...form.register('rate1', { valueAsNumber: true })}
        />
        {form.formState.errors.rate1 && (
          <span className="text-destructive text-xxs">{form.formState.errors.rate1.message}</span>
        )}
      </div>

      <div>
        <FormInput
          id="region-rate2-input"
          label="Extra Charges (Trip)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...form.register('rate2', { valueAsNumber: true })}
        />
        {form.formState.errors.rate2 && (
          <span className="text-destructive text-xxs">{form.formState.errors.rate2.message}</span>
        )}
      </div>
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Area\Region\Shipping Location"
      titleTabLabel="Location"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="region-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      className="h-[340px]"
      formName="Area\\Region\\Shipping Location"
      isEdit={editingId !== null}
    />
  );
};
