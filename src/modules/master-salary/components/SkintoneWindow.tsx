import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterSalary } from '../hooks/useMasterSalary';
import { skintoneSchema, SkintoneDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';
import { toast } from '@/components/modern-ui/sonner';

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
          onSuccess: () => {
            toast.success('Skintone updated successfully.');
            resetForm();
          },
          onError: (error: any) => {
            const msg = error.response?.data?.message || error.response?.data?.error?.details || error.message || 'Failed to update skintone.';
            toast.error(msg);
          },
        },
      );
    } else {
      create.mutate(data, {
        onSuccess: () => {
          toast.success('Skintone created successfully.');
          resetForm();
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || error.response?.data?.error?.details || error.message || 'Failed to create skintone.';
          toast.error(msg);
        },
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
    remove.mutate(parseInt(item.id, 10), {
      onSuccess: () => {
        toast.success('Skintone deleted successfully.');
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || error.response?.data?.error?.details || error.message || 'Failed to delete skintone.';
        toast.error(msg);
      },
    });
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
