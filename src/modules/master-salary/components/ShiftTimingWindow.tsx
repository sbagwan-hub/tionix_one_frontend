'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/modern-ui/sonner';
import { cn } from '@/lib/utils';
import {
  Plus,
  Edit,
  Trash2,
  Undo2,
  Save,
  RotateCw,
  Printer,
  FileSpreadsheet,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Search,
} from 'lucide-react';

import Toolbar from '@/components/shared/toolbar';
import { FormInput } from '@/components/common/form-input';
import { DeleteDialog } from '@/components/common/delete-dialog';
import {
  useShiftTimingsList,
  useCreateShiftTiming,
  useUpdateShiftTiming,
  useDeleteShiftTiming,
} from '../hooks/use-shift-timings';
import { shiftTimingSchema, ShiftTimingDto } from '../types';
import { masterSalaryApi } from '../services';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';

// Pure helper function to get minutes since midnight
const toMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  return h * 60 + m;
};

// Wrap logic matches the backend
const diffMinutesWrapStrict = (startMin: number, endMin: number): number => {
  const diff = endMin - startMin;
  return diff < 0 ? diff + 1440 : diff;
};

type Mode = 'view' | 'add' | 'edit';

export const ShiftTimingWindow: React.FC = () => {
  const [mode, setMode] = useState<Mode>('view');
  const [activeTab, setActiveTab] = useState<'timing' | 'list'>('timing');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [cursor, setCursor] = useState(0);

  // Filters for the list view
  const [filterShift, setFilterShift] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const shiftInputRef = useRef<HTMLInputElement>(null);

  // TanStack Query
  const { data: recordsData, isLoading, refetch } = useShiftTimingsList({
    page,
    pageSize,
    shift: filterShift || undefined,
  });

  const createMutation = useCreateShiftTiming();
  const updateMutation = useUpdateShiftTiming();
  const deleteMutation = useDeleteShiftTiming();

  const records = recordsData?.rows || [];
  const totalRecords = recordsData?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Form setup using React Hook Form and Zod validation
  const form = useForm<z.input<typeof shiftTimingSchema>, any, ShiftTimingDto>({
    resolver: zodResolver(shiftTimingSchema),
    defaultValues: {
      shift: '',
      s_work: '08:30',
      e_work: '17:00',
      s_break: '12:30',
      e_break: '13:00',
      t_work: '8.00',
      t_break: '30.00',
      sd: true,
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  // Watch time values to perform dynamic calculations
  const watchedSWork = form.watch('s_work');
  const watchedEWork = form.watch('e_work');
  const watchedSBreak = form.watch('s_break');
  const watchedEBreak = form.watch('e_break');

  // Perform duration calculations in real time
  useEffect(() => {
    if (watchedSWork && watchedEWork && watchedSBreak && watchedEBreak) {
      const workMin = diffMinutesWrapStrict(toMinutes(watchedSWork), toMinutes(watchedEWork));
      const breakMin = diffMinutesWrapStrict(toMinutes(watchedSBreak), toMinutes(watchedEBreak));
      const netHours = (workMin - breakMin) / 60;

      // Update calculated values
      form.setValue('t_work', netHours.toFixed(2));
      form.setValue('t_break', breakMin.toFixed(2));
      
      const startHour = Number(watchedSWork.split(':')[0] || 0);
      const endHour = Number(watchedEWork.split(':')[0] || 0);
      form.setValue('sd', endHour - startHour > 0);
    }
  }, [watchedSWork, watchedEWork, watchedSBreak, watchedEBreak, form]);

  const populateForm = useCallback(
    (rec: ShiftTimingDto) => {
      setSelectedId(rec.pk_st_id ?? null);
      form.reset({
        pk_st_id: rec.pk_st_id,
        shift: rec.shift,
        s_work: rec.s_work,
        e_work: rec.e_work,
        t_work: rec.t_work,
        s_break: rec.s_break || '',
        e_break: rec.e_break || '',
        t_break: rec.t_break,
        sd: rec.sd,
        sync: rec.sync,
        sys_defined: rec.sys_defined,
        date_timestamp: rec.date_timestamp,
        fk_user_id: rec.fk_user_id,
        last_status: rec.last_status,
      });
    },
    [form]
  );

  // Sync cursor record to form in view mode
  useEffect(() => {
    if (records.length > 0 && mode === 'view' && cursor >= 0 && cursor < records.length) {
      populateForm(records[cursor]);
    }
  }, [cursor, records, mode, populateForm]);

  // Adjust cursor if records list changes
  useEffect(() => {
    if (records.length > 0 && cursor >= records.length) {
      setCursor(records.length - 1);
    }
  }, [records, cursor]);

  // CRUD handlers
  const handleAdd = () => {
    setMode('add');
    setSelectedId(null);
    form.reset({
      shift: '',
      s_work: '08:30',
      e_work: '17:00',
      s_break: '12:30',
      e_break: '13:00',
      t_work: '8.00',
      t_break: '30.00',
      sd: true,
      sync: 'N',
      sys_defined: false,
    });
    setActiveTab('timing');
    setTimeout(() => shiftInputRef.current?.focus(), 100);
  };

  const handleEdit = () => {
    if (!selectedId) return;
    const currentRecord = records.find((r) => r.pk_st_id === selectedId);
    if (currentRecord?.sys_defined) {
      toast.error('System-defined shift timings cannot be edited.');
      return;
    }
    setMode('edit');
    setActiveTab('timing');
    setTimeout(() => shiftInputRef.current?.focus(), 100);
  };

  const handleUndo = () => {
    setMode('view');
    if (records[cursor]) {
      populateForm(records[cursor]);
    }
  };

  const handleSave = form.handleSubmit(async (data) => {
    const payload = {
      ...data,
      s_work: data.s_work,
      e_work: data.e_work,
      s_break: data.s_break,
      e_break: data.e_break,
    };
    try {
      if (mode === 'add') {
        await createMutation.mutateAsync(payload);
        setMode('view');
      } else if (mode === 'edit' && selectedId) {
        await updateMutation.mutateAsync({ id: selectedId, data: payload });
        setMode('view');
      }
    } catch (err: any) {
      // Errors are handled by global axios interceptors, but backup is here
    }
  });

  const handleDelete = () => {
    if (!selectedId) return;
    const currentRecord = records.find((r) => r.pk_st_id === selectedId);
    if (currentRecord?.sys_defined) {
      toast.error('System-defined shift timings cannot be deleted.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteMutation.mutateAsync(selectedId);
      setIsConfirmOpen(false);
      setCursor(0);
      setMode('view');
    } catch (err) {
      setIsConfirmOpen(false);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Data refreshed.');
  };

  const handleExport = async () => {
    try {
      const csvData = await masterSalaryApi.shiftTimings.export({ shift: filterShift || undefined });
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shift_timings_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error('Failed to export shift timings.');
    }
  };

  // Cursor navigation
  const handleFirst = () => {
    if (records.length > 0) setCursor(0);
  };

  const handlePrior = () => {
    if (cursor > 0) setCursor(cursor - 1);
  };

  const handleNext = () => {
    if (cursor < records.length - 1) setCursor(cursor + 1);
  };

  const handleLast = () => {
    if (records.length > 0) setCursor(records.length - 1);
  };

  const handleSelectRecord = (rec: ShiftTimingDto, index: number) => {
    setCursor(index);
    populateForm(rec);
    setActiveTab('timing');
    setMode('view');
  };

  const isEditing = mode === 'add' || mode === 'edit';

  const actions = [
    {
      label: mode === 'view' ? 'Add' : 'Save',
      icon: mode === 'view' ? Plus : Save,
      variant: 'primary' as const,
      onClick: mode === 'view' ? handleAdd : handleSave,
      disabled: isLoading || (mode !== 'view' && !form.formState.isDirty),
    },
    {
      label: 'Edit',
      icon: Edit,
      variant: 'secondary' as const,
      onClick: handleEdit,
      disabled: isEditing || !selectedId || records[cursor]?.sys_defined || isLoading,
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger' as const,
      onClick: handleDelete,
      disabled: isEditing || !selectedId || records[cursor]?.sys_defined || isLoading,
    },
    {
      label: 'Cancel',
      icon: Undo2,
      variant: 'outline' as const,
      onClick: handleUndo,
      disabled: !isEditing || isLoading,
    },
  ];

  const utilities = [
    { icon: RotateCw, title: 'Refresh', onClick: handleRefresh },
    { icon: Printer, title: 'Print', onClick: () => window.print() },
    { icon: FileSpreadsheet, title: 'Export', onClick: handleExport },
    {
      icon: HelpCircle,
      title: 'Help',
      onClick: () =>
        toast.info('Define Shift Title, Work Timings, and Meal Breaks. Totals calculate automatically.'),
    },
  ];

  return (
    <div className="bg-background text-foreground flex h-full flex-col p-4 font-sans select-none overflow-hidden">
      {/* Dynamic glow decoration */}
      <div className="bg-radial from-brand/5 to-transparent pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full blur-3xl opacity-40" />

      {/* Header Toolbar */}
      <Toolbar
        title="Shift Timing"
        actions={actions}
        utilities={utilities}
      />

      {/* Tabs Menu */}
      <div className="my-2 flex border-b border-border/60">
        <button
          className={`-mb-[2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'timing'
              ? 'border-primary text-primary bg-primary/5 font-bold'
              : 'text-muted-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => setActiveTab('timing')}
        >
          Shift Timing Details
        </button>
        <button
          className={`-mb-[2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'list'
              ? 'border-primary text-primary bg-primary/5 font-bold'
              : 'text-muted-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Shift Timings List
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="min-h-0 flex-1 overflow-hidden relative">
        {activeTab === 'timing' ? (
          <div className="h-full flex flex-col justify-center items-center bg-card/30 border border-border/40 rounded-lg p-6 backdrop-blur-md">
            <form className="w-full max-w-xl flex flex-col gap-6">
              {/* Shift Title */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <Label htmlFor="shift-title" className="col-span-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Shift Title *
                </Label>
                <div className="col-span-9">
                  <FormInput
                    id="shift-title"
                    placeholder="e.g. Morning Shift"
                    disabled={!isEditing}
                    {...form.register('shift')}
                    ref={(e) => {
                      form.register('shift').ref(e);
                      (shiftInputRef as any).current = e;
                    }}
                    className="h-9 text-xs"
                  />
                  {form.formState.errors.shift && (
                    <p className="text-[10px] text-destructive mt-1 font-medium">{form.formState.errors.shift.message}</p>
                  )}
                </div>
              </div>

              {/* Work Timing */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <Label className="col-span-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Work Timing *
                </Label>
                <div className="col-span-9">
                  <div className="flex items-center gap-3">
                    <Input
                      type="time"
                      disabled={!isEditing}
                      {...form.register('s_work')}
                      className={cn(
                        "h-9 text-xs border-border/60 w-32",
                        form.formState.errors.s_work && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                      )}
                    />
                    <span className="text-xs text-muted-foreground font-medium">To *</span>
                    <Input
                      type="time"
                      disabled={!isEditing}
                      {...form.register('e_work')}
                      className={cn(
                        "h-9 text-xs border-border/60 w-32",
                        form.formState.errors.e_work && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                      )}
                    />
                    <span className="text-xs text-muted-foreground font-medium">Total *</span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="text"
                        readOnly
                        {...form.register('t_work')}
                        className="h-9 w-16 text-center text-xs bg-muted/50 border-border/40 font-mono font-bold"
                      />
                      <span className="text-[10px] text-muted-foreground font-semibold">hrs</span>
                    </div>
                  </div>
                  {form.formState.errors.s_work && (
                    <p className="text-[10px] text-destructive mt-1 font-medium">{form.formState.errors.s_work.message}</p>
                  )}
                  {form.formState.errors.e_work && (
                    <p className="text-[10px] text-destructive mt-1 font-medium">{form.formState.errors.e_work.message}</p>
                  )}
                </div>
              </div>

              {/* Meal Break */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <Label className="col-span-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Meal Break *
                </Label>
                <div className="col-span-9">
                  <div className="flex items-center gap-3">
                    <Input
                      type="time"
                      disabled={!isEditing}
                      {...form.register('s_break')}
                      className={cn(
                        "h-9 text-xs border-border/60 w-32",
                        form.formState.errors.s_break && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                      )}
                    />
                    <span className="text-xs text-muted-foreground font-medium">To *</span>
                    <Input
                      type="time"
                      disabled={!isEditing}
                      {...form.register('e_break')}
                      className={cn(
                        "h-9 text-xs border-border/60 w-32",
                        form.formState.errors.e_break && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                      )}
                    />
                    <span className="text-xs text-muted-foreground font-medium">Total *</span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="text"
                        readOnly
                        {...form.register('t_break')}
                        className="h-9 w-16 text-center text-xs bg-muted/50 border-border/40 font-mono font-bold"
                      />
                      <span className="text-[10px] text-muted-foreground font-semibold">min</span>
                    </div>
                  </div>
                  {form.formState.errors.s_break && (
                    <p className="text-[10px] text-destructive mt-1 font-medium">{form.formState.errors.s_break.message}</p>
                  )}
                  {form.formState.errors.e_break && (
                    <p className="text-[10px] text-destructive mt-1 font-medium">{form.formState.errors.e_break.message}</p>
                  )}
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full flex flex-col min-h-0 bg-card/20 border border-border/40 rounded-lg backdrop-blur-md overflow-hidden">
            {/* Filter Panel */}
            <div className="p-3 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter by shift name..."
                  value={filterShift}
                  onChange={(e) => {
                    setFilterShift(e.target.value);
                    setPage(1);
                  }}
                  className="pl-8 h-8 text-xs bg-background/60"
                />
              </div>
            </div>

            {/* Grid List Table */}
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/50 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    <th className="p-2.5 pl-4">Shift Name</th>
                    <th className="p-2.5">Work Start</th>
                    <th className="p-2.5">Work End</th>
                    <th className="p-2.5 text-center">Total Work (hrs)</th>
                    <th className="p-2.5">Break Start</th>
                    <th className="p-2.5">Break End</th>
                    <th className="p-2.5 pr-4 text-center">Total Break (min)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-muted-foreground">
                        <Clock className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                        Loading shift timings...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-muted-foreground">
                        No shift timings found.
                      </td>
                    </tr>
                  ) : (
                    records.map((rec: any, idx: number) => (
                      <tr
                        key={rec.pk_st_id}
                        onClick={() => handleSelectRecord(rec, idx)}
                        className={`hover:bg-primary/5 cursor-pointer transition-colors ${
                          selectedId === rec.pk_st_id ? 'bg-primary/10 font-medium text-primary' : ''
                        }`}
                      >
                        <td className="p-2.5 pl-4 font-semibold">{rec.shift}</td>
                        <td className="p-2.5 font-mono">{rec.s_work}</td>
                        <td className="p-2.5 font-mono">{rec.e_work}</td>
                        <td className="p-2.5 text-center font-mono font-bold">{Number(rec.t_work).toFixed(2)}</td>
                        <td className="p-2.5 font-mono">{rec.s_break || '-'}</td>
                        <td className="p-2.5 font-mono">{rec.e_break || '-'}</td>
                        <td className="p-2.5 pr-4 text-center font-mono font-bold">{Number(rec.t_break).toFixed(0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="p-2.5 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalRecords)} of {totalRecords}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    variant="outline"
                    className="h-7 w-7 p-0"
                  >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    variant="outline"
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="font-medium text-foreground px-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    variant="outline"
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    variant="outline"
                    className="h-7 w-7 p-0"
                  >
                    <ChevronsRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this shift timing? This action cannot be undone."
        itemName={records.find((r) => r.pk_st_id === selectedId)?.shift || ''}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

// Internal Button component wrapper to avoid Next.js bundling issues
function Button({
  children,
  onClick,
  disabled,
  variant = 'outline',
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'outline' | 'ghost' | 'default';
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`border border-border/60 hover:bg-muted/50 transition-all rounded-sm flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
}
