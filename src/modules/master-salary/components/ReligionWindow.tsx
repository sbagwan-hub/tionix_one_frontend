import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterSalary } from '../hooks/useMasterSalary';
import { religionSchema, ReligionDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const ReligionWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterSalary('religions');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof religionSchema>, any, ReligionDto>({
    resolver: zodResolver(religionSchema),
    defaultValues: { religion: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: ReligionDto) => {
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
    form.reset({ religion: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const religion = list.data?.find((c: ReligionDto) => c.pk_rg_id === id);
    if (religion) {
      setEditingId(id);
      form.reset({
        religion: religion.religion,
        sync: religion.sync,
        sys_defined: religion.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10));
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: ReligionDto) => ({
    id: String(c.pk_rg_id),
    label: c.religion,
  }));

  const formContent = (
    <form id="religion-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormInput
        id="religion-input"
        label="Religion"
        placeholder="Enter religion name"
        {...form.register('religion')}
      />
      {form.formState.errors.religion && (
        <span className="text-destructive text-[10px]">
          {form.formState.errors.religion.message}
        </span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Religions"
      titleTabLabel="Religion"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="religion-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
    />
  );
};
