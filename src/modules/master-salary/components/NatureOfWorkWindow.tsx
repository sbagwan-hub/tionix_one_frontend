import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterSalary } from '../hooks/useMasterSalary';
import { natureOfWorkSchema, NatureOfWorkDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';
import { toast } from '@/components/modern-ui/sonner';

export const NatureOfWorkWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterSalary('natureOfWorks');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof natureOfWorkSchema>, any, NatureOfWorkDto>({
    resolver: zodResolver(natureOfWorkSchema),
    defaultValues: { nature_of_work: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: NatureOfWorkDto) => {
    if (editingId) {
      update.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            toast.success('Nature of work updated successfully.');
            resetForm();
          },
          onError: (error: any) => {
            const msg = error.response?.data?.message || error.response?.data?.error?.details || error.message || 'Failed to update nature of work.';
            toast.error(msg);
          },
        },
      );
    } else {
      create.mutate(data, {
        onSuccess: () => {
          toast.success('Nature of work created successfully.');
          resetForm();
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || error.response?.data?.error?.details || error.message || 'Failed to create nature of work.';
          toast.error(msg);
        },
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    form.reset({ nature_of_work: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const record = list.data?.find((c: NatureOfWorkDto) => c.pk_nw_id === id);
    if (record) {
      setEditingId(id);
      form.reset({
        nature_of_work: record.nature_of_work,
        sync: record.sync,
        sys_defined: record.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10), {
      onSuccess: () => {
        toast.success('Nature of work deleted successfully.');
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || error.response?.data?.error?.details || error.message || 'Failed to delete nature of work.';
        toast.error(msg);
      },
    });
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: NatureOfWorkDto) => ({
    id: String(c.pk_nw_id),
    label: c.nature_of_work,
  }));

  const formContent = (
    <form id="nature-of-work-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormInput
        id="nature-of-work-input"
        label="Nature of Work"
        placeholder="Enter nature of work"
        {...form.register('nature_of_work')}
      />
      {form.formState.errors.nature_of_work && (
        <span className="text-destructive text-[10px]">
          {form.formState.errors.nature_of_work.message}
        </span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Nature of Work"
      titleTabLabel="Nature of Work"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="nature-of-work-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      formName="Nature of Work"
      isEdit={editingId !== null}
    />
  );
};
