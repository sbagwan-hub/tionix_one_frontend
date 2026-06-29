import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { titleSchema, TitleDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const TitleWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('titles');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof titleSchema>, any, TitleDto>({
    resolver: zodResolver(titleSchema),
    defaultValues: { title: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: TitleDto) => {
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
    form.reset({ title: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const title = list.data?.find((c: TitleDto) => c.pk_tit_id === id);
    if (title) {
      setEditingId(id);
      form.reset({
        title: title.title,
        sync: title.sync,
        sys_defined: title.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10));
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: TitleDto) => ({
    id: String(c.pk_tit_id),
    label: c.title,
  }));

  const formContent = (
    <form id="title-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormInput
        id="title-input"
        label="Title"
        placeholder="Enter title name"
        {...form.register('title')}
      />
      {form.formState.errors.title && (
        <span className="text-destructive text-xxs">{form.formState.errors.title.message}</span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Titles"
      titleTabLabel="Title"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="title-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      formName="Title"
      isEdit={editingId !== null}
    />
  );
};
