import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterSalary } from '../hooks/useMasterSalary';
import { salItSectionSchema, SalItSectionDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/modern-ui/sonner';

export const SalItSectionWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterSalary('salItSections');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof salItSectionSchema>, any, SalItSectionDto>({
    resolver: zodResolver(salItSectionSchema),
    defaultValues: {
      it_section: '',
      deduction: '',
      additraction: 'Addition',
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: SalItSectionDto) => {
    if (editingId) {
      update.mutate(
        { id: editingId, data },
        {
          onSuccess: () => {
            toast.success('Income Tax Section updated successfully.');
            resetForm();
          },
          onError: (error: any) => {
            const msg =
              error.response?.data?.message ||
              error.response?.data?.error?.details ||
              error.message ||
              'Failed to update Income Tax Section.';
            toast.error(msg);
          },
        },
      );
    } else {
      create.mutate(data, {
        onSuccess: () => {
          toast.success('Income Tax Section created successfully.');
          resetForm();
        },
        onError: (error: any) => {
          const msg =
            error.response?.data?.message ||
            error.response?.data?.error?.details ||
            error.message ||
            'Failed to create Income Tax Section.';
          toast.error(msg);
        },
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    form.reset({
      it_section: '',
      deduction: '',
      additraction: 'Addition',
      sync: 'N',
      sys_defined: false,
    });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const section = list.data?.find((c: SalItSectionDto) => c.pk_sec_id === id);
    if (section) {
      setEditingId(id);
      form.reset({
        it_section: section.it_section,
        deduction: section.deduction || '',
        additraction: section.additraction === 'Subtraction' ? 'Subtraction' : 'Addition',
        sync: section.sync,
        sys_defined: section.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10), {
      onSuccess: () => {
        toast.success('Income Tax Section deleted successfully.');
      },
      onError: (error: any) => {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error?.details ||
          error.message ||
          'Failed to delete Income Tax Section.';
        toast.error(msg);
      },
    });
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: SalItSectionDto) => ({
    id: String(c.pk_sec_id),
    label: c.it_section,
  }));

  const formContent = (
    <form
      id="sal-it-section-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <FormInput
        id="it-section-input"
        label="Income Tax Section *"
        placeholder="Enter Income Tax section name"
        {...form.register('it_section')}
      />
      {form.formState.errors.it_section && (
        <span className="text-destructive text-[10px]">
          {form.formState.errors.it_section.message}
        </span>
      )}

      <FormInput
        id="deduction-input"
        label="Deduction *"
        placeholder="Enter deduction amount"
        {...form.register('deduction')}
      />
      {form.formState.errors.deduction && (
        <span className="text-destructive text-[10px]">
          {form.formState.errors.deduction.message}
        </span>
      )}

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="additraction-input"
          className="text-muted-foreground text-[10px] font-semibold uppercase"
        >
          Addition / Subtraction *
        </Label>
        <Controller
          name="additraction"
          control={form.control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="additraction-input" className="h-9 w-full text-xs">
                <SelectValue placeholder="Select Addition or Subtraction" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                sideOffset={4}
                className="border-border bg-popover z-[9999] border"
              >
                <SelectItem value="Addition">Addition</SelectItem>
                <SelectItem value="Subtraction">Subtraction</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.additraction && (
          <span className="text-destructive text-[10px]">
            {form.formState.errors.additraction.message}
          </span>
        )}
      </div>
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Income Tax Sections"
      titleTabLabel="Income Tax Section Detail"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="sal-it-section-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      className="h-[360px]"
      formName="Sections of Income Tax"
      isEdit={editingId !== null}
    />
  );
};
