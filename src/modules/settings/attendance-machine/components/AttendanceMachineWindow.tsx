'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormInput } from '@/components/common/form-input';
import { DeleteDialog } from '@/components/common/delete-dialog';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';

import {
  useAttendanceMachinesList,
  useCreateAttendanceMachine,
  useUpdateAttendanceMachine,
  useDeleteAttendanceMachine,
} from '../hooks/use-attendance-machines';
import { attendanceMachineSchema, AttendanceMachineDto } from '../types';

export const AttendanceMachineWindow: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [is_confirm_open, set_is_confirm_open] = useState(false);
  const [pending_delete_id, set_pending_delete_id] = useState<number | null>(null);

  // Queries
  const { data: records = [] } = useAttendanceMachinesList();

  const create_mutation = useCreateAttendanceMachine();
  const update_mutation = useUpdateAttendanceMachine();
  const delete_mutation = useDeleteAttendanceMachine();

  const form = useForm<z.input<typeof attendanceMachineSchema>, any, AttendanceMachineDto>({
    resolver: zodResolver(attendanceMachineSchema),
    defaultValues: {
      code: '',
      ip: '',
      port: 4370,
      in_out: 'In Time',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  const in_out = form.watch('in_out');
  const is_sys_defined = form.watch('sys_defined');

  const resetForm = () => {
    setEditingId(null);
    setIsViewOnly(false);
    form.reset({
      code: '',
      ip: '',
      port: 4370,
      in_out: 'In Time',
      sys_defined: false,
    });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (editingId) {
        await update_mutation.mutateAsync({ id: editingId, body: data });
        toast.success('Attendance machine updated successfully.');
      } else {
        await create_mutation.mutateAsync(data);
        toast.success('Attendance machine added successfully.');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save attendance machine.');
    }
  });

  const handleEdit = (item: WindowPanelItem) => {
    const rec = records.find((r) => String(r.pk_sb_id) === item.id);
    if (!rec || !rec.pk_sb_id) return;
    if (rec.sys_defined) {
      toast.error('System-defined attendance machines cannot be edited.');
      return;
    }
    setEditingId(rec.pk_sb_id);
    setIsViewOnly(false);
    form.reset({
      pk_sb_id: rec.pk_sb_id,
      code: rec.code,
      ip: rec.ip,
      port: rec.port,
      in_out: rec.in_out,
      sys_defined: rec.sys_defined,
    });
  };

  const handleDoubleClick = (item: WindowPanelItem) => {
    const rec = records.find((r) => String(r.pk_sb_id) === item.id);
    if (!rec || !rec.pk_sb_id) return;
    setEditingId(rec.pk_sb_id);
    setIsViewOnly(true);
    form.reset({
      pk_sb_id: rec.pk_sb_id,
      code: rec.code,
      ip: rec.ip,
      port: rec.port,
      in_out: rec.in_out,
      sys_defined: rec.sys_defined,
    });
  };

  const handleDelete = (item: WindowPanelItem) => {
    const rec = records.find((r) => String(r.pk_sb_id) === item.id);
    if (!rec || !rec.pk_sb_id) return;
    if (rec.sys_defined) {
      toast.error('System-defined attendance machines cannot be deleted.');
      return;
    }
    set_pending_delete_id(rec.pk_sb_id);
    set_is_confirm_open(true);
  };

  const handle_confirm_delete = async () => {
    if (!pending_delete_id) return;
    try {
      await delete_mutation.mutateAsync(pending_delete_id);
      set_is_confirm_open(false);
      set_pending_delete_id(null);
      resetForm();
      toast.success('Attendance machine deleted successfully.');
    } catch {
      set_is_confirm_open(false);
    }
  };

  const is_editing = editingId !== null;

  const items: WindowPanelItem[] = records.map((r) => ({
    id: String(r.pk_sb_id),
    label: `${r.code?.trim() || ''} (${r.ip}:${r.port}) — ${r.in_out}`,
  }));

  const formContent = (
    <form id="attendance-machine-form" onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Machine Code */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Machine Code *
        </Label>
        <div className="col-span-9">
          <FormInput
            id="code"
            placeholder="Enter Machine Code"
            {...form.register('code')}
            className="h-9 text-xs"
            disabled={isViewOnly || is_sys_defined}
          />
          {form.formState.errors.code && (
            <p className="text-destructive text-xxs mt-1">
              {form.formState.errors.code.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Internet Protocol (IP) Address */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Internet Protocol (IP) Address *
        </Label>
        <div className="col-span-9">
          <FormInput
            id="ip"
            placeholder="Enter IP Address"
            {...form.register('ip')}
            className="h-9 text-xs"
            disabled={isViewOnly || is_sys_defined}
          />
          {form.formState.errors.ip && (
            <p className="text-destructive text-xxs mt-1">
              {form.formState.errors.ip.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* User Datagram Protocol (UDP) Port */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          User Datagram Protocol (UDP) Port *
        </Label>
        <div className="col-span-9">
          <FormInput
            id="port"
            type="number"
            placeholder="Enter UDP Port (e.g. 4370)"
            {...form.register('port')}
            className="h-9 text-xs"
            disabled={isViewOnly || is_sys_defined}
          />
          {form.formState.errors.port && (
            <p className="text-destructive text-xxs mt-1">
              {form.formState.errors.port.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Machine Type */}
      <div className="grid grid-cols-12 items-center gap-4">
        <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
          Machine Type *
        </Label>
        <div className="col-span-9">
          <Select
            disabled={isViewOnly || is_sys_defined}
            value={in_out || ''}
            onValueChange={(val) => form.setValue('in_out', val, { shouldDirty: true })}
          >
            <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs">
              <SelectValue placeholder="Select Machine Type" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4} className="z-10000">
              <SelectItem value="In Time" className="text-xs">In Time</SelectItem>
              <SelectItem value="Out Time" className="text-xs">Out Time</SelectItem>
              <SelectItem value="In & Out Time" className="text-xs">In & Out Time</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.in_out && (
            <p className="text-destructive text-xxs mt-1">
              {form.formState.errors.in_out.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </form>
  );

  return (
    <>
      <WindowPanel
        toolbarTitle="Biometric Attendance Machines"
        titleTabLabel="Details"
        listTabLabel="List"
        items={items}
        onAdd={resetForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDoubleClick={handleDoubleClick}
        formContent={formContent}
        formId="attendance-machine-form"
        isSaving={create_mutation.isPending || update_mutation.isPending}
        onCancelTab1={resetForm}
        isSaveDisabled={!form.formState.isDirty || !form.formState.isValid || isViewOnly || is_sys_defined}
        formName="Biometric Attendance Machines"
        isEdit={is_editing && !isViewOnly}
        className="h-85"
      />

      <DeleteDialog
        isOpen={is_confirm_open}
        onClose={() => set_is_confirm_open(false)}
        onConfirm={handle_confirm_delete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this biometric attendance machine? This action cannot be undone."
        itemName={records.find((r) => r.pk_sb_id === pending_delete_id)?.code || ''}
        isDeleting={delete_mutation.isPending}
      />
    </>
  );
};
