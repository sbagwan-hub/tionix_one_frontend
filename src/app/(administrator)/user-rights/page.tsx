'use client';

import { TabItem } from '@/components/shared/dynamic-tabs';
import Toolbar from '@/components/shared/toolbar';
import PermissionTable from '@/components/user-rights/permissions-table';
import UserSelection from '@/components/user-rights/user-selection';
import {
  actionToolbar,
  moduleGroups,
  navigationToolbar,
  utilityToolbar,
} from '@/constants/permission.constants';
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

import { useCallback, useEffect, useState } from 'react';

export default function UserRightsPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [rights, setRights] = useState<UserRightsOut | null>(null);
  const [tab, setTab] = useState<
    | 'masters'
    | 'transactions'
    | 'reports'
    | 'others'
    | 'specials'
    | 'branches'
    | 'dashboards'
    | 'processes'
  >('masters');
  const [editable, setEditable] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
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

  // Load users list once
  useEffect(() => {
    api.listUsers().then(setUsers).catch(console.error);
  }, []);

  const loadRights = useCallback(
    async (user: UserListItem) => {
      if (dirty && !confirm('Discard unsaved changes?')) return;
      setLoading(true);
      setEditable(false);
      setDirty(false);
      try {
        const data = await api.getUserRights(user.pkUserId);
        setRights(data);
        setMasters(data.masters);
        setTransactions(data.transactions);
        setReports(data.reports);
        setOthers(data.others);
        setSpecials(data.specials);
        setBranches(data.branches);
        setDashboards(data.dashboards);
        setProcesses(data.processes);
        setOwnRecords(data.user.OwnRecords);
        setOtherRecords(data.user.OtherRecords);
        setSelectedUser(user);
        setTab('masters');
      } catch (e: any) {
        showToast(e.message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [dirty],
  );

  const handleSave = async () => {
    if (!selectedUser) return;
    if (!confirm(`Save rights for ${selectedUser.UserName}?`)) return;
    setSaving(true);
    try {
      await api.saveUserRights({
        user_id: selectedUser.pkUserId,
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
      showToast(`Rights saved for ${selectedUser.UserName}`);
      setEditable(false);
      setDirty(false);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditable(false);
    setDirty(false);
    if (selectedUser) loadRights(selectedUser);
  };

  return (
    <div className="bg-background text-foreground h-full font-sans">
      <div className="flex h-full flex-col py-2">
        <div>
          <Toolbar
            navigation={navigationToolbar}
            actions={actionToolbar}
            utilities={utilityToolbar}
          />
          <UserSelection
            users={users}
            selectedUser={selectedUser}
            onSelectUser={(user) => {
              setSelectedUser(user);
              if (user) loadRights(user);
            }}
            ownRecords={ownRecords}
            setOwnRecords={setOwnRecords}
            otherRecords={otherRecords}
            setOtherRecords={setOtherRecords}
            editable={editable}
          />
        </div>

        <div className="flex items-center gap-2 p-2">
          {selectedUser && !editable && (
            <button
              onClick={() => setEditable(true)}
              className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              ✎ Edit
            </button>
          )}
          {editable && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
              >
                {saving ? 'Saving…' : '✓ Save'}
              </button>
              <button
                onClick={handleCancel}
                className="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
              >
                ✕ Cancel
              </button>
            </>
          )}
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
