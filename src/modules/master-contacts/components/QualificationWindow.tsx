import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { QualificationDto, qualificationSchema } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const QualificationWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('qualifications');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof qualificationSchema>, any, QualificationDto>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: { qualification: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: QualificationDto) => {
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
    form.reset({ qualification: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const qualification = list.data?.find((c: QualificationDto) => c.pk_qua_id === id);
    if (qualification) {
      setEditingId(id);
      form.reset({
        qualification: qualification.qualification,
        sync: qualification.sync,
        sys_defined: qualification.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10));
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: QualificationDto) => ({
    id: String(c.pk_qua_id),
    label: c.qualification,
  }));

  const formContent = (
    <form
      id="qualification-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <FormInput
        id="qualification-input"
        label="Qualification"
        placeholder="Enter qualification name"
        {...form.register('qualification')}
      />
      {form.formState.errors.qualification && (
        <span className="text-destructive text-[10px]">
          {form.formState.errors.qualification.message}
        </span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Qualifications"
      titleTabLabel="Qualification"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="qualification-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
    />
  );
};
