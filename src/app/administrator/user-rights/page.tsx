'use client';

import Toolbar, { Action } from '@/components/shared/toolbar';
import PermissionTable from '@/modules/user-right/components/permissions-table';
import UserSelection from '@/modules/user-right/components/user-selection';
import RegisterFormModal from '@/modules/user-right/components/register-form-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BranchRow,
  DashboardRow,
  FormOtherRow,
  FormReportRow,
  FormRightRow,
  ProcessRow,
  SpecialRow,
  UserListItem,
  UserRightsOut,
} from '@/modules/user-right/types';
import {
  useUsersList,
  useUserRights,
  useSaveUserRights,
  useCreateForm,
} from '@/modules/user-right/hooks/use-user-rights';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Edit3,
  Save,
  X,
  RefreshCw,
  Printer,
  FileOutput,
  HelpCircle,
  LogOut,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

export default function UserRightsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [tab, setTab] = useState<'masters' | 'transactions' | 'reports' | 'others'>('masters');
  const [editable, setEditable] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [masters, setMasters] = useState<FormRightRow[]>([]);
  const [transactions, setTransactions] = useState<FormRightRow[]>([]);
  const [reports, setReports] = useState<FormReportRow[]>([]);
  const [others, setOthers] = useState<FormOtherRow[]>([]);
  const [specials, setSpecials] = useState<SpecialRow[]>([]);
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [dashboards, setDashboards] = useState<DashboardRow[]>([]);
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [ownRecords, setOwnRecords] = useState(false);
  const [otherRecords, setOtherRecords] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    if (type === 'error') {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  };

  const mark = useCallback(() => setDirty(true), []);

  // Load users list
  const { data: usersData } = useUsersList();
  const users = usersData || [];

  // Load user rights
  const {
    data: rightsData,
    isFetching: loading,
    refetch: refetchRights,
  } = useUserRights(selectedUser?.pk_user_id);

  const syncRightsToState = useCallback((data: UserRightsOut) => {
    setMasters(JSON.parse(JSON.stringify(data.masters)));
    setTransactions(JSON.parse(JSON.stringify(data.transactions)));
    setReports(JSON.parse(JSON.stringify(data.reports)));
    setOthers(JSON.parse(JSON.stringify(data.others)));
    setSpecials(JSON.parse(JSON.stringify(data.specials)));
    setBranches(JSON.parse(JSON.stringify(data.branches)));
    setDashboards(JSON.parse(JSON.stringify(data.dashboards)));
    setProcesses(JSON.parse(JSON.stringify(data.processes)));
    setOwnRecords(data.user.own_records);
    setOtherRecords(data.user.other_records);
    setDirty(false);
  }, []);

  // Sync loaded rights to local states
  useEffect(() => {
    if (rightsData) {
      syncRightsToState(rightsData);
    }
  }, [rightsData, syncRightsToState]);

  // Save mutation
  const saveMutation = useSaveUserRights(
    () => {
      showToast(`Rights saved for ${selectedUser?.username}`);
      setEditable(false);
      setDirty(false);
      queryClient.invalidateQueries({ queryKey: ['userRights', selectedUser?.pk_user_id] });
    },
    (e: any) => {
      showToast(e.message || 'Failed to save rights', 'error');
    },
  );

  const addFormMutation = useCreateForm(
    () => {
      showToast('Form registered successfully');
      setIsModalOpen(false);
      if (selectedUser) {
        refetchRights();
      }
    },
    (e: any) => {
      const errMsg = e.response?.data?.message || e.message || 'Failed to create form';
      showToast(errMsg, 'error');
    },
  );

  const handleSave = async () => {
    if (!selectedUser) return;
    saveMutation.mutate({
      user_id: selectedUser.pk_user_id,
      operator_id: 1, // adjust as needed
      own_records: ownRecords,
      other_records: otherRecords,
      masters,
      transactions,
      reports,
      others,
      specials,
      branches,
      dashboards,
      processes,
    });
  };

  const handleCancel = () => {
    setEditable(false);
    setDirty(false);
    if (rightsData) {
      syncRightsToState(rightsData);
    }
  };

  const handleSelectUser = (user: UserListItem | null) => {
    setSelectedUser(user);
    setEditable(false);
    setTab('masters');
  };

  const dynamicActions: Action[] = editable
    ? [
        {
          label: saveMutation.isPending ? 'Saving…' : 'Save',
          icon: Save,
          variant: 'success',
          onClick: handleSave,
          disabled: saveMutation.isPending,
        },
        {
          label: 'Cancel',
          icon: X,
          variant: 'danger',
          onClick: handleCancel,
        },
      ]
    : [
        {
          label: 'Add New',
          icon: Plus,
          variant: 'primary',
          onClick: () => {
            setIsModalOpen(true);
          },
        },
        {
          label: 'Edit',
          icon: Edit3,
          variant: 'primary',
          onClick: () => setEditable(true),
          disabled: !selectedUser,
        },
        {
          label: 'Refresh',
          icon: RefreshCw,
          variant: 'secondary',
          onClick: () => {
            if (selectedUser) {
              refetchRights();
              showToast('Permissions reloaded');
            }
          },
          disabled: !selectedUser,
        },
      ];

  const dynamicUtilities: Action[] = [
    {
      icon: Printer,
      title: 'Print',
      onClick: () => window.print(),
    },
    {
      icon: FileOutput,
      title: 'Export',
      onClick: () => {
        showToast('Export function not implemented', 'error');
      },
    },
    {
      icon: HelpCircle,
      title: 'Help',
      onClick: () =>
        alert(
          'Use this screen to manage user roles and granular permissions across various sections.',
        ),
    },
    {
      icon: LogOut,
      title: 'Exit',
      onClick: () => router.push('/'),
    },
  ];

  return (
    <div className="bg-background text-foreground h-full font-sans">
      <div className="flex h-full flex-col py-2">
        <div>
          <Toolbar
            // navigation={dynamicNavigation}
            actions={dynamicActions}
            utilities={dynamicUtilities}
          />
          <UserSelection
            users={users}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
            ownRecords={ownRecords}
            setOwnRecords={setOwnRecords}
            otherRecords={otherRecords}
            setOtherRecords={setOtherRecords}
            editable={editable}
          />
        </div>

        <div className="h-[calc(100vh-270px)] overflow-y-auto">
          <PermissionTable
            activeTab={tab}
            setActiveTab={setTab as any}
            editable={editable}
            markDirty={mark}
            masters={masters}
            setMasters={setMasters}
            transactions={transactions}
            setTransactions={setTransactions}
            reports={reports}
            setReports={setReports}
            others={others}
            setOthers={setOthers}
            specials={specials}
            setSpecials={setSpecials}
            branches={branches}
            setBranches={setBranches}
            dashboards={dashboards}
            setDashboards={setDashboards}
            processes={processes}
            setProcesses={setProcesses}
            loading={loading}
            className="p-0"
          />
        </div>
      </div>

      <RegisterFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(details) => addFormMutation.mutate(details)}
        isPending={addFormMutation.isPending}
      />
    </div>
  );
}
