import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { RelationshipDto, relationshipSchema } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const RelationshipWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('relationships');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof relationshipSchema>, any, RelationshipDto>({
    resolver: zodResolver(relationshipSchema),
    defaultValues: { relationship: '', sync: 'N', sys_defined: false },
    mode: 'onChange',
  });

  const onSubmit = (data: RelationshipDto) => {
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
    form.reset({ relationship: '', sync: 'N', sys_defined: false });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const relationship = list.data?.find((c: RelationshipDto) => c.pk_rel_id === id);
    if (relationship) {
      setEditingId(id);
      form.reset({
        relationship: relationship.relationship,
        sync: relationship.sync,
        sys_defined: relationship.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10));
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: RelationshipDto) => ({
    id: String(c.pk_rel_id),
    label: c.relationship,
  }));

  const formContent = (
    <form
      id="relationship-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <FormInput
        id="relationship-input"
        label="Relationship"
        placeholder="Enter relationship name"
        {...form.register('relationship')}
      />
      {form.formState.errors.relationship && (
        <span className="text-destructive text-[10px]">
          {form.formState.errors.relationship.message}
        </span>
      )}
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Relationships"
      titleTabLabel="Relationship"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="relationship-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
    />
  );
};
