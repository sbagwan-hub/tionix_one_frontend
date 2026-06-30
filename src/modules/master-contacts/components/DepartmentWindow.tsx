import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { departmentSchema, DepartmentDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const DepartmentWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('departments');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof departmentSchema>, any, DepartmentDto>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { department: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: DepartmentDto) => {
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
    form.reset({ department: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const department = list.data?.find((c: DepartmentDto) => c.pk_dep_id === id);
    if (department) {
      setEditingId(id);
      form.reset({
        department: department.department,
        sync: department.sync,
        sys_defined: department.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10));
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: DepartmentDto) => ({
    id: String(c.pk_dep_id),
    label: c.department,
  }));

  const formContent = (
    <form
      id="department-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <FormInput
        id="department-input"
        label="Department"
        placeholder="Enter department name"
        {...form.register('department')}
      />
      {form.formState.errors.department && (
        <span className="text-destructive text-xxs">
          {form.formState.errors.department.message}
        </span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Departments"
      titleTabLabel="Department"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="department-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      formName="Department"
      isEdit={editingId !== null}
    />
  );
};
