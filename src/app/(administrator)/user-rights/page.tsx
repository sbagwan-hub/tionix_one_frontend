'use client';

import { TabItem } from '@/components/shared/dynamic-tabs';
import Toolbar, { Action } from '@/components/shared/toolbar';
import PermissionTable from '@/components/user-rights/permissions-table';
import UserSelection from '@/components/user-rights/user-selection';
import {
  api,
  BranchRow,
  DashboardRow,
  FormOtherRow,
  FormReportRow,
  FormRightRow,
  ProcessRow,
  SpecialRow,
  UserListItem,
  UserRightsOut,
} from '@/lib/api';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit3,
  Save,
  X,
  RefreshCw,
  Printer,
  FileOutput,
  HelpCircle,
  LogOut,
} from 'lucide-react';

export default function UserRightsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [tab, setTab] = useState<'masters' | 'transactions' | 'reports' | 'others'>('masters');
  const [editable, setEditable] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

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

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const mark = () => setDirty(true);

  // Load users list
  const { data: usersData } = useQuery<UserListItem[]>({
    queryKey: ['users'],
    queryFn: api.listUsers,
  });
  const users = usersData || [];

  // Load user rights
  const {
    data: rightsData,
    isFetching: loading,
    refetch: refetchRights,
  } = useQuery<UserRightsOut>({
    queryKey: ['userRights', selectedUser?.pk_user_id],
    queryFn: () => api.getUserRights(selectedUser!.pk_user_id),
    enabled: !!selectedUser,
  });

  // Sync loaded rights to local states
  useEffect(() => {
    if (rightsData) {
      setMasters(rightsData.masters);
      setTransactions(rightsData.transactions);
      setReports(rightsData.reports);
      setOthers(rightsData.others);
      setSpecials(rightsData.specials);
      setBranches(rightsData.branches);
      setDashboards(rightsData.dashboards);
      setProcesses(rightsData.processes);
      setOwnRecords(rightsData.user.OwnRecords);
      setOtherRecords(rightsData.user.OtherRecords);
      setDirty(false);
    }
  }, [rightsData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: api.saveUserRights,
    onSuccess: () => {
      showToast(`Rights saved for ${selectedUser?.username}`);
      setEditable(false);
      setDirty(false);
      queryClient.invalidateQueries({ queryKey: ['userRights', selectedUser?.pk_user_id] });
    },
    onError: (e: any) => {
      showToast(e.message || 'Failed to save rights', 'error');
    },
  });

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
    if (selectedUser) {
      refetchRights();
    }
  };

  const handleSelectUser = (user: UserListItem | null) => {
    setSelectedUser(user);
    setEditable(false);
    setTab('masters');
  };

  // Toolbar Navigation Indexing
  const currentIndex = selectedUser
    ? users.findIndex((u) => u.pk_user_id === selectedUser.pk_user_id)
    : -1;

  const handleFirst = () => {
    if (users.length > 0) handleSelectUser(users[0]);
  };
  const handlePrevious = () => {
    if (currentIndex > 0) handleSelectUser(users[currentIndex - 1]);
  };
  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < users.length - 1)
      handleSelectUser(users[currentIndex + 1]);
  };
  const handleLast = () => {
    if (users.length > 0) handleSelectUser(users[users.length - 1]);
  };

  const dynamicNavigation: Action[] = [
    {
      icon: ChevronsLeft,
      title: 'First',
      onClick: handleFirst,
      disabled: users.length === 0 || currentIndex === 0,
    },
    {
      icon: ChevronLeft,
      title: 'Previous',
      onClick: handlePrevious,
      disabled: currentIndex <= 0,
    },
    {
      icon: ChevronRight,
      title: 'Next',
      onClick: handleNext,
      disabled: currentIndex === -1 || currentIndex === users.length - 1,
    },
    {
      icon: ChevronsRight,
      title: 'Last',
      onClick: handleLast,
      disabled: users.length === 0 || currentIndex === users.length - 1,
    },
  ];

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
            navigation={dynamicNavigation}
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

        <div className="h-[calc(100vh-310px)] overflow-y-auto">
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
            className="p-4"
          />
        </div>
      </div>
    </div>
  );
}
