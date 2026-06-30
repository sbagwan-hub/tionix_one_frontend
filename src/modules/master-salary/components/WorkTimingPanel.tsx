'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/modern-ui/sonner';
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
} from 'lucide-react';

import Toolbar from '@/components/shared/toolbar';
import { DeleteDialog } from '@/components/common/delete-dialog';
import { useMasterEmployee } from '../../master-employee/hooks/useMasterEmployee';
import { useMasterContacts } from '../../master-contacts/hooks/useMasterContacts';
import { useShiftTimingsList } from '../hooks/use-shift-timings';
import {
  useWorkTimingsList,
  useCreateWorkTiming,
  useUpdateWorkTimingGroup,
  useDeleteWorkTimingGroup,
} from '../hooks/use-work-timings';
import { salWorkTimingSchema } from '../types';
import { masterSalaryApi } from '../services';
import { EmployeeChecklist } from './EmployeeChecklist';
import { WorkTimingForm } from './WorkTimingForm';
import { WorkTimingListTab } from './WorkTimingListTab';

type Mode = 'view' | 'add' | 'edit';

const extractDate = (val?: string | Date | null): string => {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0] || '';
};

const extractTime = (val?: string | Date | null): string => {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

const combineDateAndTime = (dateStr: string, timeStr?: string | null): string | null => {
  if (!dateStr || !timeStr) return null;
  const cleanTime = timeStr.includes('T') ? extractTime(timeStr) : timeStr;
  return `${dateStr}T${cleanTime}:00.000Z`;
};

export const WorkTimingPanel: React.FC = () => {
  const [mode, setMode] = useState<Mode>('view');
  const [activeTab, setActiveTab] = useState<'timing' | 'list'>('timing');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedEmpIds, setSelectedEmpIds] = useState<number[]>([]);
  const [cursor, setCursor] = useState(0);

  // Filters for list
  const [filterShift, setFilterShift] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Queries
  const { list: employeesList } = useMasterEmployee({ pageSize: 1000 });
  const employeesData = employeesList.data;
  const isEmpLoading = employeesList.isLoading;
  const { list: deptsList } = useMasterContacts('departments');
  const { list: desgsList } = useMasterContacts('designations');
  const { list: agenciesList } = useMasterContacts('organizationsDropdown');
  const { data: shiftsData } = useShiftTimingsList({ pageSize: 200 });

  const {
    data: recordsData,
    isLoading: isRecordsLoading,
    refetch,
  } = useWorkTimingsList({
    page,
    page_size: pageSize,
    shift: filterShift || undefined,
  });

  const createMutation = useCreateWorkTiming();
  const updateMutation = useUpdateWorkTimingGroup();
  const deleteMutation = useDeleteWorkTimingGroup();

  const records = recordsData?.rows || [];
  const employees = employeesData?.data || [];
  const departments = deptsList.data || [];
  const designations = desgsList.data || [];
  const agencies = agenciesList.data || [];
  const shifts = shiftsData?.rows || [];

  // Form Setup
  const form = useForm<any>({
    resolver: zodResolver(salWorkTimingSchema),
    defaultValues: {
      shift: '',
      fk_st_id: null,
      type: 'Permanent Shift',
      fk_cont_id: 'none',
      tsd: extractDate(new Date()),
      ted: '',
      s_work: '',
      e_work: '',
      t_work: '',
      s_break: '',
      e_break: '',
      t_break: '',
      ot: 0,
      break_ot: 0,
      e_overtime: '',
      management: false,
    },
    mode: 'onChange',
  });

  const loadGroupEmployees = async (groupId: string) => {
    try {
      const rows = await masterSalaryApi.workTimings.listByGroup(groupId);
      setSelectedEmpIds(rows.map((r: any) => r.fk_emp_id));
    } catch {
      toast.error('Failed to load group employees.');
    }
  };

  const populateForm = useCallback(
    async (rec: any) => {
      setSelectedId(rec.pk_wt_id);
      setSelectedGroupId(rec.group_id);
      form.reset({
        pk_wt_id: rec.pk_wt_id,
        shift: rec.shift,
        fk_st_id: rec.fk_st_id,
        type: rec.type || 'Permanent Shift',
        fk_cont_id: rec.fk_cont_id || 'none',
        tsd: extractDate(rec.tsd),
        ted: rec.ted ? extractDate(rec.ted) : '',
        s_work: extractTime(rec.s_work),
        e_work: extractTime(rec.e_work),
        t_work: Number(rec.t_work).toFixed(2),
        s_break: extractTime(rec.s_break),
        e_break: extractTime(rec.e_break),
        t_break: Number(rec.t_break).toFixed(2),
        ot: rec.ot || 0,
        break_ot: rec.break_ot || 0,
        e_overtime: rec.e_overtime ? extractTime(rec.e_overtime) : '',
        management: rec.management,
      });

      if (rec.group_id) {
        await loadGroupEmployees(rec.group_id);
      } else {
        setSelectedEmpIds([rec.fk_emp_id]);
      }
    },
    [form],
  );

  // Sync cursor record in view mode
  useEffect(() => {
    if (records.length > 0 && mode === 'view' && cursor >= 0 && cursor < records.length) {
      populateForm(records[cursor]);
    }
  }, [cursor, records, mode, populateForm]);

  // Dynamically select the first shift returned by backend as the default selection when shifts load
  useEffect(() => {
    if (shifts.length > 0 && mode === 'add' && !form.getValues('shift')) {
      const defaultShift = shifts[0];
      form.reset({
        ...form.getValues(),
        shift: defaultShift.shift,
        fk_st_id: defaultShift.pk_st_id,
        s_work: defaultShift.s_work,
        e_work: defaultShift.e_work,
        t_work: Number(defaultShift.t_work || 0).toFixed(2),
        s_break: defaultShift.s_break,
        e_break: defaultShift.e_break,
        t_break: Number(defaultShift.t_break || 0).toFixed(2),
      });
    }
  }, [shifts, mode, form]);

  // CRUD actions
  const handleAdd = () => {
    setMode('add');
    setSelectedId(null);
    setSelectedGroupId(null);
    setSelectedEmpIds([]);
    const defaultShift = shifts.length > 0 ? shifts[0] : null;
    form.reset({
      shift: defaultShift ? defaultShift.shift : '',
      fk_st_id: defaultShift ? defaultShift.pk_st_id : null,
      type: 'Permanent Shift',
      fk_cont_id: 'none',
      tsd: extractDate(new Date()),
      ted: '',
      s_work: defaultShift ? defaultShift.s_work : '',
      e_work: defaultShift ? defaultShift.e_work : '',
      t_work: defaultShift ? Number(defaultShift.t_work || 0).toFixed(2) : '',
      s_break: defaultShift ? defaultShift.s_break : '',
      e_break: defaultShift ? defaultShift.e_break : '',
      t_break: defaultShift ? Number(defaultShift.t_break || 0).toFixed(2) : '',
      ot: 0,
      break_ot: 0,
      e_overtime: '',
      management: false,
    });
    setActiveTab('timing');
  };

  const handleEdit = () => {
    if (!selectedId) return;
    setMode('edit');
    setActiveTab('timing');
  };

  const handleUndo = () => {
    setMode('view');
    if (records[cursor]) {
      populateForm(records[cursor]);
    }
  };

  const handleSave = form.handleSubmit(async (data) => {
    if (selectedEmpIds.length === 0) {
      toast.error('Select at least one employee in the checklist.');
      return;
    }

    const payload = {
      shift: data.shift,
      fk_st_id: data.fk_st_id ? Number(data.fk_st_id) : null,
      type: data.type || 'Permanent Shift',
      fk_cont_id: data.fk_cont_id === 'none' ? null : data.fk_cont_id,
      tsd: data.tsd,
      ted: data.ted || null,
      s_work: combineDateAndTime(data.tsd, data.s_work),
      e_work: combineDateAndTime(data.tsd, data.e_work),
      t_work: Number(data.t_work),
      s_break: combineDateAndTime(data.tsd, data.s_break),
      e_break: combineDateAndTime(data.tsd, data.e_break),
      t_break: Number(data.t_break),
      ot: data.ot ? Number(data.ot) : null,
      break_ot: data.break_ot ? Number(data.break_ot) : null,
      e_overtime: data.e_overtime ? combineDateAndTime(data.tsd, data.e_overtime) : null,
      management: data.management,
      fk_emp_ids: selectedEmpIds,
    };

    try {
      if (mode === 'add') {
        await createMutation.mutateAsync(payload);
        toast.success('Work timings assigned successfully.');
        setMode('view');
        refetch();
      } else if (mode === 'edit' && selectedGroupId) {
        await updateMutation.mutateAsync({ groupId: selectedGroupId, data: payload });
        toast.success('Work timings updated successfully.');
        setMode('view');
        refetch();
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error?.details ||
        err.message ||
        'Operation failed.';
      toast.error(msg);
    }
  });

  const handleDelete = () => {
    if (!selectedGroupId) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGroupId) return;
    try {
      await deleteMutation.mutateAsync(selectedGroupId);
      toast.success('Work timings group deleted successfully.');
      setIsConfirmOpen(false);
      setCursor(0);
      setMode('view');
      refetch();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error?.details ||
        err.message ||
        'Deletion failed.';
      toast.error(msg);
      setIsConfirmOpen(false);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Data refreshed.');
  };

  const handleSelectRecord = (rec: any) => {
    const idx = records.findIndex((r: any) => r.pk_wt_id === rec.pk_wt_id);
    if (idx !== -1) {
      setCursor(idx);
    }
    populateForm(rec);
    setActiveTab('timing');
    setMode('view');
  };

  // Toolbar Actions definitions
  const isEditing = mode === 'add' || mode === 'edit';

  const actions = [
    {
      label: mode === 'view' ? 'Add' : 'Save',
      icon: mode === 'view' ? Plus : Save,
      variant: 'primary' as const,
      onClick: mode === 'view' ? handleAdd : handleSave,
      disabled:
        isRecordsLoading ||
        (mode !== 'view' && !form.formState.isDirty && selectedEmpIds.length === 0),
    },
    {
      label: 'Edit',
      icon: Edit,
      variant: 'secondary' as const,
      onClick: handleEdit,
      disabled: isEditing || !selectedId || isRecordsLoading,
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger' as const,
      onClick: handleDelete,
      disabled: isEditing || !selectedGroupId || isRecordsLoading,
    },
    {
      label: 'Cancel',
      icon: Undo2,
      variant: 'outline' as const,
      onClick: handleUndo,
      disabled: !isEditing || isRecordsLoading,
    },
  ];

  const utilities = [
    { icon: RotateCw, title: 'Refresh', onClick: handleRefresh },
    { icon: Printer, title: 'Print', onClick: () => window.print() },
    {
      icon: FileSpreadsheet,
      title: 'Export',
      onClick: () => toast.info('Export functionality ready.'),
    },
    {
      icon: HelpCircle,
      title: 'Help',
      onClick: () =>
        toast.info('Select a Shift and assign Work Timings to multiple employees at once.'),
    },
  ];

  return (
    <div className="bg-background text-foreground relative flex h-full flex-col overflow-hidden font-sans select-none">
      {/* Background glow radial */}
      <div className="from-brand/5 pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-radial to-transparent opacity-40 blur-3xl" />

      {/* Toolbar header */}
      <Toolbar title="Work Timing of Employees" actions={actions} utilities={utilities} />

      {/* Top Nav Tabs */}
      <div className="border-border/60 my-2 flex shrink-0 border-b">
        <button
          className={`-mb-[2px] cursor-pointer border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'timing'
              ? 'border-primary text-primary bg-primary/5 font-bold'
              : 'text-muted-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => setActiveTab('timing')}
        >
          Work Timing Setup
        </button>
        <button
          className={`-mb-[2px] cursor-pointer border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'list'
              ? 'border-primary text-primary bg-primary/5 font-bold'
              : 'text-muted-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Timing Assignments List
        </button>
      </div>

      {/* Center content panel */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {activeTab === 'timing' ? (
          <div className="flex h-full flex-col gap-4 md:flex-row">
            {/* Left side form */}
            <div className="h-full min-h-0 flex-1 overflow-hidden">
              <WorkTimingForm
                form={form}
                isEditing={isEditing}
                shifts={shifts}
                manpowerAgencies={agencies}
              />
            </div>

            {/* Right side checklist */}
            <div className="h-full min-h-0 w-full overflow-hidden md:w-[48%]">
              <EmployeeChecklist
                selectedEmpIds={selectedEmpIds}
                onSelectedEmpIdsChange={setSelectedEmpIds}
                isEditing={isEditing}
                employees={employees}
                departments={departments}
                designations={designations}
                isLoading={isEmpLoading}
              />
            </div>
          </div>
        ) : (
          <WorkTimingListTab
            onSelect={handleSelectRecord}
            filterShift={filterShift}
            setFilterShift={setFilterShift}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            recordsData={recordsData}
            isLoading={isRecordsLoading}
            selectedId={selectedId}
            employees={employees}
          />
        )}
      </div>

      <DeleteDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Bulk Deletion"
        description="Are you sure you want to permanently delete work timing assignments for this entire group? This will remove timings for all employees in this group."
        itemName={`Group ID: ${selectedGroupId}`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
