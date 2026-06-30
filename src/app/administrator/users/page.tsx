'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
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
import {
  useUsersList,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useEmployeesLookup,
  useEmailConfigsLookup,
  useSecurityQuestionsLookup,
} from '@/modules/users/hooks/use-users';
import { UserRecord } from '@/modules/users/types';
import { usersApi } from '@/modules/users/services';
import { UserForm } from '@/modules/users/components/user-form';
import { UserList } from '@/modules/users/components/user-list';
import { DeleteDialog } from '@/components/common/delete-dialog';

export default function AdministratorUsersPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language || 'en';
  const isRtl = lang === 'ar';

  const userRights = useAuthStore((state) => state.userRights);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const [activeTab, setActiveTab] = React.useState('user');
  const [selectedUser, setSelectedUser] = React.useState<UserRecord | null>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  // Pagination & Filtering state
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const pageSize = 50;

  // TanStack Query Hooks
  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useUsersList({
    username: search || undefined,
    page,
    pageSize,
  });

  const users = usersData?.data || [];
  const total = usersData?.total || 0;

  const { data: employees = [] } = useEmployeesLookup();
  const { data: emailConfigs = [] } = useEmailConfigsLookup();
  const { data: securityQuestions = [] } = useSecurityQuestionsLookup();
  const [selectedQuestion, setSelectedQuestion] = React.useState<string>('');

  React.useEffect(() => {
    if (securityQuestions.length > 0 && !selectedQuestion) {
      setSelectedQuestion(securityQuestions[0].questions);
    }
  }, [securityQuestions, selectedQuestion]);

  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    answer: '',
    fk_emp_id: null as number | null,
    fk_ec_id: null as number | null,
    mobile: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      username: '',
      password: '',
      answer: '',
      fk_emp_id: null,
      fk_ec_id: null,
      mobile: '',
    });
    setIsEditMode(false);
    setIsAdding(false);
    setSelectedUser(null);
  };

  // Mutations
  const createUserMutation = useCreateUser(
    () => {
      toast.success(t('userSaved'));
      handleCancel();
      setActiveTab('list');
    },
    (error) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error?.details ||
        'Failed to create user';
      toast.error(msg);
    },
  );

  const updateUserMutation = useUpdateUser(
    () => {
      toast.success(t('userSaved'));
      handleCancel();
      setActiveTab('list');
    },
    (error) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error?.details ||
        'Failed to update user';
      toast.error(msg);
    },
  );

  const deleteUserMutation = useDeleteUser(
    () => {
      toast.success('User deleted successfully!');
      setSelectedUser(null);
    },
    (error) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error?.details ||
        'Failed to delete user';
      toast.error(msg);
    },
  );

  const handleSave = () => {
    if (!formData.username.trim()) {
      toast.error(`${t('requiredField')}: ${t('username')}`);
      return;
    }

    if (!isEditMode && !formData.password) {
      toast.error(`${t('requiredField')}: ${t('password')}`);
      return;
    }

    if (!selectedQuestion) {
      toast.error(`${t('requiredField')}: ${t('question')}`);
      return;
    }

    if (!formData.answer || !formData.answer.trim()) {
      toast.error(`${t('requiredField')}: ${t('answer')}`);
      return;
    }

    const matchedQuestion = securityQuestions.find((sq) => sq.questions === selectedQuestion);
    const payload: any = {
      username: formData.username,
      fk_emp_id: formData.fk_emp_id,
      fk_ec_id: formData.fk_ec_id,
      answer: formData.answer || null,
      mobile: formData.mobile || null,
      security_question: selectedQuestion || null,
      security_question_id: matchedQuestion ? matchedQuestion.pk_question_id : null,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    if (isEditMode && selectedUser) {
      updateUserMutation.mutate({ id: selectedUser.pk_user_id, payload });
    } else {
      createUserMutation.mutate(payload);
    }
  };

  const handleAdd = () => {
    setFormData({
      username: '',
      password: '',
      answer: '',
      fk_emp_id: null,
      fk_ec_id: null,
      mobile: '',
    });
    setSelectedQuestion(securityQuestions[0]?.questions || '');
    setIsEditMode(false);
    setIsAdding(true);
    setSelectedUser(null);
    setActiveTab('user');
  };

  const handleEdit = () => {
    if (!selectedUser) {
      toast.error('Please select a user from the list tab first');
      return;
    }
    setFormData({
      username: selectedUser.username,
      password: '',
      answer: selectedUser.answer || '',
      fk_emp_id: selectedUser.fk_emp_id,
      fk_ec_id: selectedUser.fk_ec_id,
      mobile: selectedUser.mobile || '',
    });
    setSelectedQuestion(selectedUser.security_question || securityQuestions[0]?.questions || '');
    setIsEditMode(true);
    setIsAdding(false);
    setActiveTab('user');
  };

  const handleDelete = () => {
    if (!selectedUser) {
      toast.error('Please select a user to delete');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.pk_user_id);
  };

  const handleExport = async () => {
    try {
      const rows = await usersApi.exportUsers(search ? { username: search } : undefined);
      if (rows.length === 0) {
        toast.info('No data to export.');
        return;
      }
      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(','),
        ...rows.map((row: any) =>
          headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','),
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
      toast.success('Export completed successfully!');
    } catch (e: any) {
      toast.error('Failed to export data');
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  const isMutating =
    createUserMutation.isPending || updateUserMutation.isPending || deleteUserMutation.isPending;

  const isFormValid = formData.username.trim() !== '' && (isEditMode || formData.password !== '');

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Action Toolbar ── */}
      <div className="mt-2 w-full">
        <Toolbar
          title={t('user')}
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
              disabled: !selectedUser || isAdding,
            },
            {
              icon: Trash2,
              label: t('delete'),
              variant: 'danger',
              onClick: handleDelete,
              disabled: !selectedUser || isAdding,
            },
            { icon: RotateCcw, label: t('cancel'), variant: 'outline', onClick: handleCancel },
            {
              icon: isMutating ? RefreshCw : Save,
              label: t('save'),
              variant: 'primary',
              onClick: handleSave,
              disabled: !isFormValid || isMutating || usersLoading,
            },
          ]}
          utilities={[
            { icon: RefreshCw, title: t('refresh'), onClick: () => refetchUsers() },
            { icon: Printer, title: t('print'), onClick: () => window.print() },
            { icon: Download, title: t('export'), onClick: handleExport },
            {
              icon: Help,
              title: t('help'),
              onClick: () => alert('Manage user accounts and details.'),
            },
            { icon: LogOut, title: t('exit'), onClick: () => router.push('/administrator') },
          ]}
        />
      </div>

      <div className="border-border/60 bg-card text-card-foreground relative flex w-full flex-col overflow-hidden rounded-sm border">
        {/* ── Tabs + Form ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 pt-4">
            <TabsList className="h-8 rounded-sm p-0.5">
              <TabsTrigger value="user" className="h-full rounded-[2px] px-5 text-xs">
                {t('User')}
              </TabsTrigger>
              <TabsTrigger value="list" className="h-full rounded-[2px] px-5 text-xs">
                {t('userList')}
              </TabsTrigger>
            </TabsList>

            {/* Visual Mode Indicator */}
            {activeTab === 'user' && (
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {isAdding && (
                  <span className="bg-primary/10 text-primary border-primary/20 text-xxs animate-pulse rounded-full border px-2.5 py-0.5 font-mono tracking-wider uppercase">
                    Adding New User
                  </span>
                )}
                {isEditMode && selectedUser && (
                  <span className="text-xxs rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 font-mono tracking-wider text-yellow-500 uppercase">
                    Editing User:{' '}
                    <span className="text-foreground font-semibold">{selectedUser.username}</span>
                  </span>
                )}
                {!isAdding && !isEditMode && (
                  <span className="bg-muted text-muted-foreground border-border/50 text-xxs rounded-full border px-2.5 py-0.5 font-mono tracking-wider uppercase">
                    Viewing Form
                  </span>
                )}
              </div>
            )}
          </div>

          {/* User Form Tab */}
          <TabsContent value="user" className="m-0 px-6 pt-5 pb-6">
            {/* Action/Mode Status Banner */}
            <div className="mb-4">
              {isMutating ? (
                <div className="bg-primary/5 border-primary/20 text-primary flex items-center gap-3 rounded-sm border px-4 py-3 text-xs">
                  <RefreshCw className="text-primary h-4 w-4 animate-spin" />
                  <div>
                    <span className="font-semibold">Processing Request...</span> Please wait while
                    we update the database.
                  </div>
                </div>
              ) : isAdding ? (
                <div className="flex items-center gap-3 rounded-sm border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <div>
                    <span className="font-semibold">Adding New User:</span> Fill in the details
                    below. All fields with * are required. Click{' '}
                    <span className="font-semibold">Save</span> in the toolbar to apply.
                  </div>
                </div>
              ) : isEditMode && selectedUser ? (
                <div className="flex items-center gap-3 rounded-sm border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-600 dark:text-amber-400">
                  <Edit className="h-4 w-4 animate-pulse text-amber-500" />
                  <div>
                    <span className="font-semibold">Editing User ({selectedUser.username}):</span>{' '}
                    You can modify the user settings or change the password. Click{' '}
                    <span className="font-semibold">Save</span> to submit changes, or{' '}
                    <span className="font-semibold">Cancel</span> to discard.
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-sm border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs text-blue-600 dark:text-blue-400">
                  <Info className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="font-semibold">View Mode:</span> Selected user form is
                    currently read-only. Click <span className="font-semibold">Add</span> to create
                    a new user or select a user from the list and click{' '}
                    <span className="font-semibold">Edit</span>.
                  </div>
                </div>
              )}
            </div>

            <UserForm
              formData={formData}
              onInputChange={handleInputChange}
              isEditMode={isEditMode}
              employees={employees}
              emailConfigs={emailConfigs}
              securityQuestions={securityQuestions}
              selectedQuestion={selectedQuestion}
              onQuestionChange={setSelectedQuestion}
              t={t}
              isRtl={isRtl}
              disabled={!isAdding && !isEditMode}
            />
          </TabsContent>

          {/* User List Tab */}
          <TabsContent value="list" className="m-0 px-6 pt-4 pb-4">
            <UserList
              users={users}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              search={search}
              onSearchChange={setSearch}
              onFilter={() => refetchUsers()}
              isLoading={usersLoading}
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
              t={t}
            />
          </TabsContent>
        </Tabs>

        {/* ── Footer ── */}
        <div className="border-border/30 relative z-10 border-t px-6 py-2.5 text-center">
          <p className="text-muted-foreground/40 text-[9px] leading-relaxed">
            Authorized access only. All connection attempts, sessions, and activity logs are tracked
            for security audits.
          </p>
        </div>
      </div>

      <DeleteDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this user account? This action cannot be undone."
        itemName={selectedUser ? selectedUser.username : ''}
        isDeleting={deleteUserMutation.isPending}
      />
    </div>
  );
}
