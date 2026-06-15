import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterSalary } from '../hooks/useMasterSalary';
import { casteSchema, CasteDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';
import { toast } from '@/components/modern-ui/sonner';

export const CasteWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterSalary('castes');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof casteSchema>, any, CasteDto>({
    resolver: zodResolver(casteSchema),
    defaultValues: { caste: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: CasteDto) => {
    if (editingId) {
      update.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            toast.success('Caste updated successfully.');
            resetForm();
          },
          onError: (error: any) => {
            const msg = error.response?.data?.message || error.response?.data?.error?.details || error.message || 'Failed to update caste.';
            toast.error(msg);
          },
        },
      );
    } else {
      create.mutate(data, {
        onSuccess: () => {
          toast.success('Caste created successfully.');
          resetForm();
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || error.response?.data?.error?.details || error.message || 'Failed to create caste.';
          toast.error(msg);
        },
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    form.reset({ caste: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const caste = list.data?.find((c: CasteDto) => c.pk_cs_id === id);
    if (caste) {
      setEditingId(id);
      form.reset({
        caste: caste.caste,
        sync: caste.sync,
        sys_defined: caste.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10), {
      onSuccess: () => {
        toast.success('Caste deleted successfully.');
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || error.response?.data?.error?.details || error.message || 'Failed to delete caste.';
        toast.error(msg);
      },
    });
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: CasteDto) => ({
    id: String(c.pk_cs_id),
    label: c.caste,
  }));

  const formContent = (
    <form id="caste-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormInput
        id="caste-input"
        label="Caste"
        placeholder="Enter caste name"
        {...form.register('caste')}
      />
      {form.formState.errors.caste && (
        <span className="text-destructive text-[10px]">
          {form.formState.errors.caste.message}
        </span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Castes/sub-castes"
      titleTabLabel="Caste/sub-caste"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="caste-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
    />
  );
};
