import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { modeOfContactSchema, ModeOfContactDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const ModeOfContactWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('modeOfContact');
  const { list: typeList } = useMasterContacts('mocTypesDropdown');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof modeOfContactSchema>, any, ModeOfContactDto>({
    resolver: zodResolver(modeOfContactSchema),
    defaultValues: {
      moc: '',
      fk_mt_id: undefined,
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: ModeOfContactDto) => {
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
    form.reset({
      moc: '',
      fk_mt_id: undefined,
      sync: 'N',
      sys_defined: false,
    });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const moc = list.data?.find(
      (c: ModeOfContactDto) => c.pk_moc_id !== undefined && String(c.pk_moc_id) === item.id,
    );
    if (moc && moc.pk_moc_id !== undefined) {
      setEditingId(moc.pk_moc_id);
      form.reset({
        pk_moc_id: moc.pk_moc_id,
        moc: moc.moc,
        fk_mt_id: moc.fk_mt_id,
        sync: moc.sync,
        sys_defined: moc.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(Number(item.id));
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: ModeOfContactDto) => ({
    id: c.pk_moc_id !== undefined ? String(c.pk_moc_id) : '',
    label: `${c.moc} (${c.mode || 'No Type'})`,
  }));

  const formContent = (
    <form id="moc-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <FormInput
          id="moc-name-input"
          label="Mode of Contact Name"
          placeholder="Enter mode of contact name (e.g. Personal Email)"
          {...form.register('moc')}
        />
        {form.formState.errors.moc && (
          <span className="text-destructive text-[10px]">{form.formState.errors.moc.message}</span>
        )}
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">Contact Type</label>
        <select
          id="moc-type-select"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-sm border px-3 py-1 text-xs shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...form.register('fk_mt_id', { valueAsNumber: true })}
        >
          <option value="">Select a contact type...</option>
          {(typeList.data || []).map((t: any) => (
            <option key={t.pk_mt_id} value={t.pk_mt_id}>
              {t.mode}
            </option>
          ))}
        </select>
        {form.formState.errors.fk_mt_id && (
          <span className="text-destructive text-[10px]">
            {form.formState.errors.fk_mt_id.message}
          </span>
        )}
      </div>
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Modes of Contact"
      titleTabLabel="MOC Setup"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="moc-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      formName="Mode of Contact"
      isEdit={editingId !== null}
    />
  );
};
