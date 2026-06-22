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
import { useMasterEmployee, useNextEmpCode } from '../hooks/useMasterEmployee';
import { masterEmployeeApi } from '../services';
import { EmployeeRecord } from '../types';
import { MasterEmployeeForm } from './MasterEmployeeForm';
import { MasterEmployeeList } from './MasterEmployeeList';
import { Chip } from '@/components/common/chip';
import { useFormPermission } from '@/hooks/use-form-permission';

const getDefaultForm = (): Partial<EmployeeRecord> => ({
  emp_code: '',
  employee: '',
  doj: new Date().toISOString().slice(0, 10),
  dob: '',
  gender: 'Male',
  marital_status: 'Single',
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
  fk_acct_id: 1,
  experience: '',
  ext: '',
  rtgs: '',
  s_address: '',
});

export const MasterEmployeePanel: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language || 'en';
  const isRtl = lang === 'ar';

  const permissions = useFormPermission('Employee');

  const [activeTab, setActiveTab] = React.useState('employee');
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeRecord | null>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const { list, create, update, remove } = useMasterEmployee({
    employee: search || undefined,
  });

  const nextCodeQuery = useNextEmpCode(false);

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
    if (!formData.gender) {
      toast.error('Gender is required.');
      return;
    }
    if (!formData.marital_status) {
      toast.error('Marital Status is required.');
      return;
    }
    if (!formData.doj) {
      toast.error('Joining Date is required.');
      return;
    }
    if (!formData.contacts || formData.contacts.length === 0) {
      toast.error('At least one contact detail is required.');
      return;
    }
    const hasEmptyContact = formData.contacts.some((c) => !c.detail || !c.detail.trim());
    if (hasEmptyContact) {
      toast.error('All contact details must have valid information.');
      return;
    }
    if (!formData.p_address || !formData.n_address) {
      toast.error('Both Resident and Native Addresses are required.');
      return;
    }
    if (!formData.username) {
      toast.error('Username is required.');
      return;
    }
    if (!formData.password) {
      toast.error('Password is required.');
      return;
    }
    if (!formData.answer) {
      toast.error('Security Answer is required.');
      return;
    }
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 18) {
        toast.error('Employee must be at least 18 years old.');
        return;
      }
    }
    const isBcrypt = formData.password
      ? /^\$2[ayb]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(formData.password)
      : false;
    if (
      formData.password &&
      !isBcrypt &&
      (formData.password.length < 4 || formData.password.length > 10)
    ) {
      toast.error('Password must be between 4 and 10 characters.');
      return;
    }
    if (formData.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_no)) {
      toast.error('Invalid PAN card format (e.g. ABCDE1234F).');
      return;
    }
    if (formData.aadhar && !/^[0-9]{12}$/.test(formData.aadhar)) {
      toast.error('Aadhar card must be exactly 12 digits.');
      return;
    }
    if (formData.cont_police && !/^\+?[0-9]{10,15}$/.test(formData.cont_police)) {
      toast.error('Invalid police contact number.');
      return;
    }
    if (formData.p1_contact && !/^\+?[0-9]{10,15}$/.test(formData.p1_contact)) {
      toast.error('Invalid primary reference contact number.');
      return;
    }
    if (formData.p2_contact && !/^\+?[0-9]{10,15}$/.test(formData.p2_contact)) {
      toast.error('Invalid secondary reference contact number.');
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
            handleCancel();
            setActiveTab('list');
          },
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: () => {
          handleCancel();
          setActiveTab('list');
        },
      });
    }
  };

  const handleAdd = async () => {
    setFormData(getDefaultForm());
    setIsEditMode(false);
    setIsAdding(true);
    setSelectedEmployee(null);
    setActiveTab('employee');

    try {
      const res = await nextCodeQuery.refetch();
      if (res.data) {
        setFormData((prev) => ({ ...prev, emp_code: res.data }));
      }
    } catch (err) {
      console.error('Failed to pre-fetch next employee code:', err);
    }
  };

  const handleEdit = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee from the list first');
      return;
    }
    try {
      const fullDetails = await masterEmployeeApi.get(selectedEmployee.pk_emp_id);
      setFormData({ ...fullDetails });
      setIsEditMode(true);
      setIsAdding(false);
      setActiveTab('employee');
    } catch (err) {
      toast.error('Failed to load employee details');
    }
  };

  const handleRowDoubleClick = async (emp: EmployeeRecord) => {
    setSelectedEmployee(emp);
    try {
      const fullDetails = await masterEmployeeApi.get(emp.pk_emp_id);
      setFormData({ ...fullDetails });
      setIsEditMode(false);
      setIsAdding(false);
      setActiveTab('employee');
    } catch (err) {
      toast.error('Failed to load employee details');
    }
  };

  const handleDelete = () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee to delete');
      return;
    }

    if (confirm(`Are you sure you want to delete employee "${selectedEmployee.employee}"?`)) {
      remove.mutate(selectedEmployee.pk_emp_id, {
        onSuccess: () => {
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
              disabled: isAdding || !permissions.add,
            },
            {
              icon: Edit,
              label: t('edit'),
              variant: 'secondary',
              onClick: handleEdit,
              disabled: !selectedEmployee || isAdding || !permissions.edit,
            },
            {
              icon: Trash2,
              label: t('delete'),
              variant: 'danger',
              onClick: handleDelete,
              disabled: !selectedEmployee || isAdding || !permissions.delete,
            },
            { icon: RotateCcw, label: t('cancel'), variant: 'outline', onClick: handleCancel },
            {
              icon: Save,
              label: t('save'),
              variant: 'primary',
              onClick: handleSave,
              disabled:
                !isFormValid ||
                create.isPending ||
                update.isPending ||
                (isEditMode ? !permissions.edit : !permissions.add),
            },
          ]}
          utilities={[
            { icon: RefreshCw, title: t('refresh'), onClick: () => list.refetch() },
            {
              icon: Printer,
              title: t('print'),
              onClick: () => window.print(),
              disabled: !permissions.print,
            },
            {
              icon: Download,
              title: t('export'),
              onClick: handleExport,
              disabled: !permissions.export,
            },
            {
              icon: Help,
              title: t('help'),
              onClick: () => alert('Manage employee master directory and additional credentials.'),
            },
            { icon: LogOut, title: t('exit'), onClick: () => window.history.back() },
          ]}
        />
      </div>

      <div className="border-border/60 bg-card text-card-foreground relative flex w-full flex-col rounded-sm border">
        {/* Premium Background Glows */}
        <div className="from-brand/10 pointer-events-none absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-radial to-transparent opacity-20 blur-3xl" />
        <div className="from-brand/10 pointer-events-none absolute -right-40 -bottom-40 h-[300px] w-[300px] rounded-full bg-radial to-transparent opacity-20 blur-3xl" />

        {/* Tabs + Form */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="relative z-10 flex w-full flex-col"
        >
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-6 pt-4">
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
                {isAdding && <Chip label="Adding New Employee" variant="primary" pulse />}
                {isEditMode && selectedEmployee && (
                  <Chip
                    label={`Editing Employee: ${selectedEmployee.employee}`}
                    variant="warning"
                  />
                )}
                {!isAdding && !isEditMode && <Chip label="Viewing Record" variant="neutral" />}
              </div>
            )}
          </div>

          {/* Form tab */}
          <TabsContent value="employee" className="m-0 w-full px-6 pt-4 pb-6">
            <MasterEmployeeForm
              formData={formData}
              onInputChange={handleInputChange}
              isEditMode={isEditMode}
              disabled={!isAdding && !isEditMode}
            />
          </TabsContent>

          {/* List tab */}
          <TabsContent value="list" className="m-0 w-full px-6 pt-4 pb-4">
            <MasterEmployeeList
              employees={employees}
              selectedEmployee={selectedEmployee}
              onSelectEmployee={setSelectedEmployee}
              onRowDoubleClick={handleRowDoubleClick}
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
