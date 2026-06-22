import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { categorySchema, CategoryDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const CategoryWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('categories');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof categorySchema>, any, CategoryDto>({
    resolver: zodResolver(categorySchema),
    defaultValues: { category: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: CategoryDto) => {
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
    form.reset({ category: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const category = list.data?.find((c: CategoryDto) => c.pk_cat_id === id);
    if (category) {
      setEditingId(id);
      form.reset({
        category: category.category,
        sync: category.sync,
        sys_defined: category.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10));
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: CategoryDto) => ({
    id: String(c.pk_cat_id),
    label: c.category,
  }));

  const formContent = (
    <form id="category-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormInput
        id="category-input"
        label="Category"
        placeholder="Enter category name"
        {...form.register('category')}
      />
      {form.formState.errors.category && (
        <span className="text-destructive text-[10px]">
          {form.formState.errors.category.message}
        </span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Categories"
      titleTabLabel="Category"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="category-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      formName="Product(s)\\Category"
      isEdit={editingId !== null}
    />
  );
};
