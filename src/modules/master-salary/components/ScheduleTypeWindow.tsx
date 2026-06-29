import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterSalary } from '../hooks/useMasterSalary';
import { scheduleTypeSchema, ScheduleTypeDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';
import { toast } from '@/components/modern-ui/sonner';

export const ScheduleTypeWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterSalary('scheduleTypes');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof scheduleTypeSchema>, any, ScheduleTypeDto>({
    resolver: zodResolver(scheduleTypeSchema),
    defaultValues: { type: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: ScheduleTypeDto) => {
    if (editingId) {
      update.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            toast.success('Schedule type updated successfully.');
            resetForm();
          },
          onError: (error: any) => {
            const msg =
              error.response?.data?.message ||
              error.response?.data?.error?.details ||
              error.message ||
              'Failed to update schedule type.';
            toast.error(msg);
          },
        },
      );
    } else {
      create.mutate(data, {
        onSuccess: () => {
          toast.success('Schedule type created successfully.');
          resetForm();
        },
        onError: (error: any) => {
          const msg =
            error.response?.data?.message ||
            error.response?.data?.error?.details ||
            error.message ||
            'Failed to create schedule type.';
          toast.error(msg);
        },
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    form.reset({ type: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const scheduleType = list.data?.find((c: ScheduleTypeDto) => c.pk_st_id === id);
    if (scheduleType) {
      setEditingId(id);
      form.reset({
        type: scheduleType.type,
        sync: scheduleType.sync,
        sys_defined: scheduleType.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10), {
      onSuccess: () => {
        toast.success('Schedule type deleted successfully.');
      },
      onError: (error: any) => {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error?.details ||
          error.message ||
          'Failed to delete schedule type.';
        toast.error(msg);
      },
    });
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: ScheduleTypeDto) => ({
    id: String(c.pk_st_id),
    label: c.type,
  }));

  const formContent = (
    <form
      id="schedule-type-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <FormInput
        id="schedule-type-input"
        label="Schedule Type"
        placeholder="Enter schedule type name"
        {...form.register('type')}
      />
      {form.formState.errors.type && (
        <span className="text-destructive text-[10px]">{form.formState.errors.type.message}</span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Schedule Types"
      titleTabLabel="Schedule Type"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="schedule-type-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      formName="Schedule Type"
      isEdit={editingId !== null}
    />
  );
};
