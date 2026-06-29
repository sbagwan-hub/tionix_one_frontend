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
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

  const watchedShift = form.watch('shift');
  const watchedTsd = form.watch('tsd');
  const queryClient = useQueryClient();

  // Query to fetch all employee timings assigned to the selected date (tsd)
  const { data: assignedOnDateData } = useQuery({
    queryKey: ['assignedWorkTimingsOnDate', watchedTsd],
    queryFn: () =>
      watchedTsd
        ? masterSalaryApi.workTimings.list({ tsd_from: watchedTsd, tsd_to: watchedTsd, page_size: 1000 })
        : Promise.resolve({ rows: [], total: 0, page: 1, page_size: 1000 }),
    enabled: !!watchedTsd && mode !== 'view',
  });

  const assignedEmpIdsOnDate = React.useMemo(() => {
    if (!assignedOnDateData?.rows) return [];
    return assignedOnDateData.rows.map((r: any) => r.fk_emp_id);
  }, [assignedOnDateData]);

  // Queries
  const { list: employeesList } = useMasterEmployee({ pageSize: 1000 });
  const employeesData = employeesList.data;
  const isEmpLoading = employeesList.isLoading;
  const { list: deptsList } = useMasterContacts('departments');
  const { list: desgsList } = useMasterContacts('designations');
  const { list: agenciesList } = useMasterContacts('organizationsDropdown');
  const { data: shiftsData } = useShiftTimingsList({ pageSize: 200 });

  const { data: recordsData, isLoading: isRecordsLoading, refetch } = useWorkTimingsList({
    page,
    page_size: pageSize,
    shift: filterShift || undefined,
  });

  const createMutation = useCreateWorkTiming();
  const updateMutation = useUpdateWorkTimingGroup();
  const deleteMutation = useDeleteWorkTimingGroup();

  const records = recordsData?.rows || [];
  const currentShift = watchedShift || (mode === 'view' && records[cursor]?.shift) || '';
  const employees = employeesData?.data || [];

  const displayEmployees = React.useMemo(() => {
    if (watchedTsd && mode !== 'view') {
      return employees.filter((emp: any) => {
        const isAssignedOnDate = assignedEmpIdsOnDate.includes(emp.pk_emp_id);
        const isCurrentlySelected = selectedEmpIds.includes(emp.pk_emp_id);
        if (isAssignedOnDate && !isCurrentlySelected) {
          return false;
        }
        return true;
      });
    }
    return employees;
  }, [employees, mode, watchedTsd, assignedEmpIdsOnDate, selectedEmpIds]);

  const departments = deptsList.data || [];
  const designations = desgsList.data || [];
  const agencies = agenciesList.data || [];
  const shifts = shiftsData?.rows || [];



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

  const handleShiftSelect = async (shiftName: string) => {
    setSelectedEmpIds([]);
  };

  // CRUD actions
  const handleAdd = () => {
    setMode('add');
    setSelectedId(null);
    setSelectedGroupId(null);
    setSelectedEmpIds([]);
    form.reset({
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
        queryClient.invalidateQueries({ queryKey: ['assignedWorkTimingsOnDate'] });
        toast.success('Work timings assigned successfully.');
        setMode('view');
        refetch();
      } else if (mode === 'edit' && selectedGroupId) {
        await updateMutation.mutateAsync({ groupId: selectedGroupId, data: payload });
        queryClient.invalidateQueries({ queryKey: ['assignedWorkTimingsOnDate'] });
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
      queryClient.invalidateQueries({ queryKey: ['assignedWorkTimingsOnDate'] });
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
          className={`-mb-[2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${activeTab === 'timing'
            ? 'border-primary text-primary bg-primary/5 font-bold'
            : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          onClick={() => setActiveTab('timing')}
        >
          Work Timing Setup
        </button>
        <button
          className={`-mb-[2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${activeTab === 'list'
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
                onShiftChange={handleShiftSelect}
              />
            </div>

            {/* Right side checklist */}
            <div className="w-full md:w-[48%] min-h-0 h-full overflow-hidden">
              {currentShift ? (
                <EmployeeChecklist
                  selectedEmpIds={selectedEmpIds}
                  onSelectedEmpIdsChange={setSelectedEmpIds}
                  isEditing={isEditing}
                  employees={displayEmployees}
                  assignedEmpIds={null}
                  departments={departments}
                  designations={designations}
                  isLoading={isEmpLoading}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-card/25 border border-border/40 rounded-lg backdrop-blur-md p-6 text-center text-muted-foreground">
                  <div className="rounded-full bg-primary/5 p-4 mb-3 border border-primary/10">
                    <HelpCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">No Shift Selected</h3>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Please select a Shift Name in the form to load and display the employee checklist.
                  </p>
                </div>
              )}
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
