'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  RefreshCw,
  Printer,
  Download,
  HelpCircle as Help,
  LogOut,
  Info,
} from 'lucide-react';
import Toolbar from '@/components/shared/toolbar';
import { toast } from 'sonner';
import { useMasterEmployee } from '../hooks/useMasterEmployee';
import { EmployeeRecord } from '../types';
import { MasterEmployeeForm } from './MasterEmployeeForm';
import { MasterEmployeeList } from './MasterEmployeeList';

const getDefaultForm = (): Partial<EmployeeRecord> => ({
  emp_code: '',
  employee: '',
  doj: new Date().toISOString().slice(0, 10),
  dob: '',
  male: true,
  married: false,
  p_address: '',
  n_address: '',
  account_no: '',
  pf_no: '',
  esic_no: '',
  pan_no: '',
  blood_grp: 'O+',
  wp: 'Head Office',
  aadhar: '',
  username: '',
  password: '',
  question: 'What is your favorite food?',
  answer: '',
  messaging: true,
  geolocation: true,
  type: 'Office Staff',
  att_type: true,
  police: '',
  add_police: '',
  cont_police: '',
  personality1: '',
  p1_address: '',
  p1_contact: '',
  personality2: '',
  p2_address: '',
  p2_contact: '',
  sb: true,
  last_status: 'Active',
  contacts: [],
  relatives: [],
  licenses: [],

  // New fields
  photo: null,
  height: undefined,
  weight: undefined,
  fk_qual_id: null,
  fk_dep_id: null,
  fk_deg_id: null,
  fk_bnk_id: null,
  fk_st_id: null,
  fk_rg_id: null,
  fk_cs_id: null,
  fk_w1_emp_id: null,
  fk_w2_emp_id: null,
  fk_r_emp_id: null,
  fk_p1_des_id: null,
  fk_p2_des_id: null,
  fk_acct_id: null,
  experience: '',
  ext: '',
  rtgs: '',
  s_address: '',
});

export const MasterEmployeePanel: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language || 'en';
  const isRtl = lang === 'ar';

  const [activeTab, setActiveTab] = React.useState('employee');
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeRecord | null>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const { list, create, update, remove } = useMasterEmployee({
    employee: search || undefined,
  });

  const employees = list.data?.data || [];
  const isLoading = list.isLoading;

  const [formData, setFormData] = React.useState<Partial<EmployeeRecord>>(getDefaultForm);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData(getDefaultForm());
    setIsEditMode(false);
    setIsAdding(false);
    setSelectedEmployee(null);
  };

  const handleSave = () => {
    if (!formData.emp_code) {
      toast.error('Employee Code is required.');
      return;
    }
    if (!formData.employee) {
      toast.error('Employee Name is required.');
      return;
    }
    if (!formData.p_address || !formData.n_address) {
      toast.error('Both Resident and Native Addresses are required.');
      return;
    }
    if (!formData.username || !formData.password || !formData.answer) {
      toast.error('Login credentials (Username, Password, Answer) are required.');
      return;
    }

    const payload = {
      ...formData,
      last_status: formData.last_status || 'Active',
    } as Omit<EmployeeRecord, 'pk_emp_id'>;

    if (isEditMode && selectedEmployee) {
      update.mutate(
        { id: selectedEmployee.pk_emp_id, data: payload },
        {
          onSuccess: () => {
            toast.success('Employee updated successfully!');
            handleCancel();
            setActiveTab('list');
          },
          onError: (err) => {
            toast.error(err.message || 'Failed to update employee');
          },
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: () => {
          toast.success('Employee created successfully!');
          handleCancel();
          setActiveTab('list');
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to create employee');
        },
      });
    }
  };

  const handleAdd = () => {
    setFormData(getDefaultForm());
    setIsEditMode(false);
    setIsAdding(true);
    setSelectedEmployee(null);
    setActiveTab('employee');
  };

  const handleEdit = () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee from the list first');
      return;
    }
    setFormData({ ...selectedEmployee });
    setIsEditMode(true);
    setIsAdding(false);
    setActiveTab('employee');
  };

  const handleDelete = () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee to delete');
      return;
    }

    if (confirm(`Are you sure you want to delete employee "${selectedEmployee.employee}"?`)) {
      remove.mutate(selectedEmployee.pk_emp_id, {
        onSuccess: () => {
          toast.success('Employee deleted successfully!');
          setSelectedEmployee(null);
        },
      });
    }
  };

  const handleExport = () => {
    // Basic CSV exporter
    if (employees.length === 0) {
      toast.info('No data to export.');
      return;
    }
    const headers = ['emp_code', 'employee', 'doj', 'p_address', 'last_status'];
    const csvContent = [
      headers.join(','),
      ...employees.map((row: any) =>
        headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success('Export completed successfully!');
  };

  const isFormValid = !!formData.emp_code && !!formData.employee && !!formData.username;

  return (
    <div
      className="flex w-full flex-col items-stretch justify-start gap-3 select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Action Toolbar */}
      <div className="w-full">
        <Toolbar
          title="Employees"
          actions={[
            {
              icon: Plus,
              label: t('add'),
              variant: 'primary',
              onClick: handleAdd,
              disabled: isAdding,
            },
            {
              icon: Edit,
              label: t('edit'),
              variant: 'secondary',
              onClick: handleEdit,
              disabled: !selectedEmployee || isAdding,
            },
            {
              icon: Trash2,
              label: t('delete'),
              variant: 'danger',
              onClick: handleDelete,
              disabled: !selectedEmployee || isAdding,
            },
            { icon: RotateCcw, label: t('cancel'), variant: 'outline', onClick: handleCancel },
            {
              icon: Save,
              label: t('save'),
              variant: 'primary',
              onClick: handleSave,
              disabled: !isFormValid || create.isPending || update.isPending,
            },
          ]}
          utilities={[
            { icon: RefreshCw, title: t('refresh'), onClick: () => list.refetch() },
            { icon: Printer, title: t('print'), onClick: () => window.print() },
            { icon: Download, title: t('export'), onClick: handleExport },
            {
              icon: Help,
              title: t('help'),
              onClick: () => alert('Manage employee master directory and additional credentials.'),
            },
            { icon: LogOut, title: t('exit'), onClick: () => window.history.back() },
          ]}
        />
      </div>

      <div className="border-border/60 bg-card text-card-foreground relative flex w-full flex-col rounded-sm border shadow-md">
        {/* Premium Background Glows */}
        <div className="absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-radial from-brand/10 to-transparent opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 h-[300px] w-[300px] rounded-full bg-radial from-brand/10 to-transparent opacity-20 blur-3xl pointer-events-none" />

        {/* Tabs + Form */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10 flex flex-col w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 pt-4 shrink-0">
            <TabsList className="h-8 rounded-sm p-0.5">
              <TabsTrigger value="employee" className="h-full rounded-[2px] px-5 text-xs">
                Employee Setup
              </TabsTrigger>
              <TabsTrigger value="list" className="h-full rounded-[2px] px-5 text-xs">
                Employee List
              </TabsTrigger>
            </TabsList>

            {/* Visual Mode Indicator */}
            {activeTab === 'employee' && (
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {isAdding && (
                  <span className="bg-primary/10 text-primary border-primary/20 animate-pulse rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                    Adding New Employee
                  </span>
                )}
                {isEditMode && selectedEmployee && (
                  <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-yellow-500 uppercase">
                    Editing Employee:{' '}
                    <span className="text-foreground font-semibold">{selectedEmployee.employee}</span>
                  </span>
                )}
                {!isAdding && !isEditMode && (
                  <span className="bg-muted text-muted-foreground border-border/50 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                    Viewing Record
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Form tab */}
          <TabsContent value="employee" className="m-0 px-6 pt-4 pb-6 w-full">
            <div className="mb-4 shrink-0">
              {isAdding ? (
                <div className="flex items-center gap-3 rounded-sm border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <div>
                    <span className="font-semibold">Create Mode:</span> Fill in the employee master parameters. Click <span className="font-semibold">Save</span> in the toolbar to commit.
                  </div>
                </div>
              ) : isEditMode && selectedEmployee ? (
                <div className="flex items-center gap-3 rounded-sm border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-600 dark:text-amber-400">
                  <Edit className="h-4 w-4 animate-pulse text-amber-500" />
                  <div>
                    <span className="font-semibold">Editing Mode:</span> Modifying details for {selectedEmployee.employee}. Click <span className="font-semibold">Save</span> to submit, or <span className="font-semibold">Cancel</span> to discard.
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-sm border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs text-blue-600 dark:text-blue-400">
                  <Info className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="font-semibold">Read Only Mode:</span> Form is currently read-only. Select an employee and click <span className="font-semibold">Edit</span> or click <span className="font-semibold">Add</span> to register a new employee.
                  </div>
                </div>
              )}
            </div>

            <MasterEmployeeForm
              formData={formData}
              onInputChange={handleInputChange}
              isEditMode={isEditMode}
              disabled={!isAdding && !isEditMode}
            />
          </TabsContent>

          {/* List tab */}
          <TabsContent value="list" className="m-0 px-6 pt-4 pb-4 w-full">
            <MasterEmployeeList
              employees={employees}
              selectedEmployee={selectedEmployee}
              onSelectEmployee={setSelectedEmployee}
              search={search}
              onSearchChange={setSearch}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
