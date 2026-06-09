import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { designationSchema, DesignationDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const DesignationWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('designations');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof designationSchema>, any, DesignationDto>({
    resolver: zodResolver(designationSchema),
    defaultValues: { designation: '', se: false, sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: DesignationDto) => {
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
    form.reset({ designation: '', se: false, sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const designation = list.data?.find((c: DesignationDto) => c.pk_des_id === id);
    if (designation) {
      setEditingId(id);
      form.reset({
        designation: designation.designation,
        se: designation.se,
        sync: designation.sync,
        sys_defined: designation.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10));
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: DesignationDto) => ({
    id: String(c.pk_des_id),
    label: c.designation,
  }));

  const formContent = (
    <form
      id="designation-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <FormInput
          id="designation-input"
          label="Designation"
          placeholder="Enter designation name"
          {...form.register('designation')}
        />
        {form.formState.errors.designation && (
          <span className="text-destructive text-[10px]">
            {form.formState.errors.designation.message}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center space-x-2">
        <Controller
          control={form.control}
          name="se"
          render={({ field }: any) => (
            <Checkbox id="designation-se" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="designation-se" className="cursor-pointer text-xs font-medium">
          Sales Executive (SE)
        </Label>
      </div>
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Designations"
      titleTabLabel="Designation"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="designation-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
    />
  );
};
