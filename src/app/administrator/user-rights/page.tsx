'use client';

import Toolbar, { Action } from '@/components/shared/toolbar';
import PermissionTable from '@/components/user-rights/permissions-table';
import UserSelection from '@/components/user-rights/user-selection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CreateNewFormIn,
} from '@/lib/api';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
  const [newFormDetails, setNewFormDetails] = useState<CreateNewFormIn>({
    form_name: '',
    category: 'master',
    prefix: '',
    last_id: '0',
    start_with: '1',
    len: '10',
    module_name: '',
    module_caption: '',
    news: false,
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    if (type === 'error') {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
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
      setOwnRecords(rightsData.user.own_records);
      setOtherRecords(rightsData.user.other_records);
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

  const addFormMutation = useMutation({
    mutationFn: api.createNewForm,
    onSuccess: () => {
      showToast('Form registered successfully');
      setIsModalOpen(false);
      setNewFormDetails({
        form_name: '',
        category: 'master',
        prefix: '',
        last_id: '0',
        start_with: '1',
        len: '10',
        module_name: '',
        module_caption: '',
        news: false,
      });
      if (selectedUser) {
        refetchRights();
      }
    },
    onError: (e: any) => {
      const errMsg = e.response?.data?.message || e.message || 'Failed to create form';
      showToast(errMsg, 'error');
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
            className="p-0"
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-popover border-border/60 animate-in fade-in zoom-in text-foreground w-full max-w-2xl overflow-hidden rounded-sm border shadow-md duration-200">
            <div className="bg-muted border-border flex items-center justify-between border-b px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Plus className="text-primary h-4 w-4" />
                Register New Form / Menu Item
              </h3>
              <Button variant="ghost" size="icon-sm" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addFormMutation.mutate(newFormDetails);
              }}
              className="space-y-4 p-6 text-sm"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="form_name">Form Name *</Label>
                  <Input
                    id="form_name"
                    type="text"
                    required
                    value={newFormDetails.form_name}
                    onChange={(e) =>
                      setNewFormDetails({ ...newFormDetails, form_name: e.target.value })
                    }
                    placeholder="e.g. sales_order"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prefix">Prefix</Label>
                  <Input
                    id="prefix"
                    type="text"
                    maxLength={5}
                    value={newFormDetails.prefix || ''}
                    onChange={(e) =>
                      setNewFormDetails({ ...newFormDetails, prefix: e.target.value })
                    }
                    placeholder="e.g. SO"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="module_name">Module Name *</Label>
                  <Input
                    id="module_name"
                    type="text"
                    required
                    value={newFormDetails.module_name || ''}
                    onChange={(e) =>
                      setNewFormDetails({ ...newFormDetails, module_name: e.target.value })
                    }
                    placeholder="e.g. Sales"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="module_caption">Module Caption</Label>
                  <Input
                    id="module_caption"
                    type="text"
                    value={newFormDetails.module_caption || ''}
                    onChange={(e) =>
                      setNewFormDetails({ ...newFormDetails, module_caption: e.target.value })
                    }
                    placeholder="e.g. Sales Management"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label>Category *</Label>
                  <Tabs
                    value={newFormDetails.category}
                    onValueChange={(val: any) =>
                      setNewFormDetails({ ...newFormDetails, category: val })
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="master">Master</TabsTrigger>
                      <TabsTrigger value="transaction">Transaction</TabsTrigger>
                      <TabsTrigger value="report">Report</TabsTrigger>
                      <TabsTrigger value="other">Other</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="start_with">Start With ID</Label>
                  <Input
                    id="start_with"
                    type="text"
                    value={newFormDetails.start_with || ''}
                    onChange={(e) =>
                      setNewFormDetails({ ...newFormDetails, start_with: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="len">Length of ID</Label>
                  <Input
                    id="len"
                    type="text"
                    value={newFormDetails.len || ''}
                    onChange={(e) => setNewFormDetails({ ...newFormDetails, len: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <Checkbox
                  id="news_form_chk"
                  checked={!!newFormDetails.news}
                  onCheckedChange={(checked) =>
                    setNewFormDetails({ ...newFormDetails, news: !!checked })
                  }
                />
                <Label htmlFor="news_form_chk" className="cursor-pointer">
                  News Form (Flag as recently added)
                </Label>
              </div>

              {/* Modal Footer */}
              <div className="border-border flex justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="success" disabled={addFormMutation.isPending}>
                  {addFormMutation.isPending ? 'Registering...' : 'Register Form'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
