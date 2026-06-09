import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterSalary } from '../hooks/useMasterSalary';
import { skintoneSchema, SkintoneDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const SkintoneWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterSalary('skintones');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof skintoneSchema>, any, SkintoneDto>({
    resolver: zodResolver(skintoneSchema),
    defaultValues: { colour: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: SkintoneDto) => {
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
    form.reset({ colour: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const skintone = list.data?.find((c: SkintoneDto) => c.pk_st_id === id);
    if (skintone) {
      setEditingId(id);
      form.reset({
        colour: skintone.colour,
        sync: skintone.sync,
        sys_defined: skintone.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10));
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: SkintoneDto) => ({
    id: String(c.pk_st_id),
    label: c.colour,
  }));

  const formContent = (
    <form id="skintone-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormInput
        id="colour-input"
        label="Colour"
        placeholder="Enter colour name"
        {...form.register('colour')}
      />
      {form.formState.errors.colour && (
        <span className="text-destructive text-[10px]">
          {form.formState.errors.colour.message}
        </span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Skintones"
      titleTabLabel="Skintone"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="skintone-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
    />
  );
};
