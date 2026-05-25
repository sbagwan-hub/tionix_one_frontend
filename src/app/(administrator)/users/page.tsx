'use client';
// app/user-rights/page.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  api,
  FormOtherRow,
  FormReportRow,
  FormRightRow,
  SelectionRow,
  SpecialFlags,
  UserListItem,
  UserRightsOut,
} from '@/lib/api';
import PermissionGrid from '@/components/user-1/PermissionGrid';
import SpecialFlagsPanel from '@/components/user-1/SpecialFlagsPanel';
import SelectionPanel from '@/components/user-1/SelectionPanel';

// ── Operator id (replace with real auth session in production) ────────────────
const OPERATOR_ID = 'admin';

type Tab =
  | 'masters'
  | 'transactions'
  | 'reports'
  | 'others'
  | 'specials'
  | 'units'
  | 'dashboards'
  | 'processes';

const TABS: { id: Tab; label: string }[] = [
  { id: 'masters', label: 'Masters' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'reports', label: 'Reports' },
  { id: 'others', label: 'Others' },
  { id: 'specials', label: 'Special Flags' },
  { id: 'units', label: 'Units / Branch' },
  { id: 'dashboards', label: 'Dashboard' },
  { id: 'processes', label: 'Processes' },
];

export default function UserRightsPage() {
  // ── state ──────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [rights, setRights] = useState<UserRightsOut | null>(null);
  const [tab, setTab] = useState<Tab>('masters');
  const [editable, setEditable] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');

  // local grid state (mutable while editing)
  const [masters, setMasters] = useState<FormRightRow[]>([]);
  const [transactions, setTransactions] = useState<FormRightRow[]>([]);
  const [reports, setReports] = useState<FormReportRow[]>([]);
  const [others, setOthers] = useState<FormOtherRow[]>([]);
  const [specials, setSpecials] = useState<SpecialFlags | null>(null);
  const [ownRecords, setOwnRecords] = useState(false);
  const [otherRecords, setOtherRecords] = useState(false);
  const [units, setUnits] = useState<SelectionRow[]>([]);
  const [dashboards, setDashboards] = useState<SelectionRow[]>([]);
  const [processes, setProcesses] = useState<SelectionRow[]>([]);

  // ── initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    api.listUsers().then(setUsers).catch(console.error);
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── load rights when user is selected ────────────────────────────────────
  const loadRights = useCallback(
    async (user: UserListItem) => {
      if (dirty && !confirm('Discard unsaved changes?')) return;
      setLoading(true);
      setEditable(false);
      setDirty(false);
      try {
        const data = await api.getUserRights(user.pk_user_id);
        setRights(data);
        setMasters(data.masters);
        setTransactions(data.transactions);
        setReports(data.reports);
        setOthers(data.others);
        setSpecials(data.specials);
        setOwnRecords(data.user.own_records);
        setOtherRecords(data.user.other_records);
        setUnits(data.units);
        setDashboards(data.dashboards);
        setProcesses(data.processes);
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

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedUser || !specials) return;
    if (!confirm(`Save rights for ${selectedUser.user_name}?`)) return;
    setSaving(true);
    try {
      await api.saveUserRights({
        user_id: selectedUser.pk_user_id,
        operator_id: OPERATOR_ID,
        own_records: ownRecords,
        other_records: otherRecords,
        masters: masters.map((r) => ({
          form_name: r.form_name,
          r_add: r.r_add,
          r_edit: r.r_edit,
          r_delete: r.r_delete,
          r_view: r.r_view,
          r_print: r.r_print,
          r_export: r.r_export,
        })),
        transactions: transactions.map((r) => ({
          form_name: r.form_name,
          r_add: r.r_add,
          r_edit: r.r_edit,
          r_delete: r.r_delete,
          r_view: r.r_view,
          r_print: r.r_print,
          r_export: r.r_export,
          r_authorize: r.r_authorize ?? null,
        })),
        reports: reports.map((r) => ({
          form_name: r.form_name,
          r_view: r.r_view,
          r_print: r.r_print,
          r_export: r.r_export,
        })),
        others: others.map((r) => ({ form_name: r.form_name, r_rights: r.r_rights })),
        specials,
        units,
        dashboards,
        processes,
      });
      showToast(`Rights saved for ${selectedUser.user_name}`);
      setEditable(false);
      setDirty(false);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => setEditable(true);

  const handleNew = () => {
    if (dirty && !confirm('Discard unsaved changes?')) return;
    setSelectedUser(null);
    setRights(null);
    setEditable(false);
    setDirty(false);
  };

  const filteredUsers = users.filter((u) =>
    u.user_name.toLowerCase().includes(search.toLowerCase()),
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-foreground flex min-h-screen font-mono">
      {/* ── Left sidebar: user list ── */}
      <aside className="border-border bg-sidebar flex w-64 shrink-0 flex-col border-r">
        <div className="border-border border-b p-4">
          <h1 className="text-lg font-bold tracking-tight text-amber-400">User Rights</h1>
          <p className="mt-0.5 text-xs text-slate-500">Access Control Manager</p>
        </div>

        <div className="border-border border-b p-3">
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {filteredUsers.map((u) => (
            <button
              key={u.pk_user_id}
              onClick={() => loadRights(u)}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                selectedUser?.pk_user_id === u.pk_user_id
                  ? 'border-r-2 border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold">
                {u.user_name[0]?.toUpperCase()}
              </span>
              <span className="truncate">{u.user_name}</span>
            </button>
          ))}
          {filteredUsers.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-600">No users found</p>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Toolbar */}
        <div className="border-border bg-card flex items-center gap-3 border-b px-6 py-3">
          <button
            onClick={handleNew}
            className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-xs text-slate-200 transition-colors hover:bg-slate-600"
          >
            ＋ New
          </button>
          {selectedUser && !editable && (
            <button
              onClick={handleEdit}
              className="rounded-lg border border-blue-600/40 bg-blue-600/20 px-3 py-1.5 text-xs text-blue-300 transition-colors hover:bg-blue-600/30"
            >
              ✎ Edit
            </button>
          )}
          {editable && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg border border-emerald-600/40 bg-emerald-600/20 px-3 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-600/30 disabled:opacity-50"
            >
              {saving ? 'Saving…' : '✓ Save'}
            </button>
          )}
          {editable && (
            <button
              onClick={() => {
                setEditable(false);
                setDirty(false);
                if (selectedUser) loadRights(selectedUser);
              }}
              className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:bg-slate-600"
            >
              ✕ Cancel
            </button>
          )}

          {selectedUser && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-500">Editing:</span>
              <span className="text-sm font-semibold text-amber-300">{selectedUser.user_name}</span>
              {editable && (
                <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                  EDIT MODE
                </span>
              )}
              {!editable && rights && (
                <span className="rounded-full border border-slate-600 bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
                  VIEW
                </span>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <div className="animate-pulse text-sm text-amber-400">Loading rights…</div>
          </div>
        )}

        {!loading && !selectedUser && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl opacity-20">🔐</div>
              <p className="text-slate-500">
                Select a user from the sidebar to manage their rights.
              </p>
            </div>
          </div>
        )}

        {!loading && selectedUser && rights && (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Tab bar */}
            <div className="border-border bg-card flex gap-1 overflow-x-auto border-b px-6 py-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-xs transition-colors ${
                    tab === t.id
                      ? 'border border-amber-500/40 bg-amber-500/20 text-amber-300'
                      : 'border border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto p-6">
              {tab === 'masters' && (
                <PermissionGrid
                  rows={masters}
                  type="master"
                  editable={editable}
                  onChange={(rows) => {
                    setMasters(rows as FormRightRow[]);
                    setDirty(true);
                  }}
                />
              )}
              {tab === 'transactions' && (
                <PermissionGrid
                  rows={transactions}
                  type="transaction"
                  editable={editable}
                  onChange={(rows) => {
                    setTransactions(rows as FormRightRow[]);
                    setDirty(true);
                  }}
                />
              )}
              {tab === 'reports' && (
                <PermissionGrid
                  rows={reports}
                  type="report"
                  editable={editable}
                  onChange={(rows) => {
                    setReports(rows as FormReportRow[]);
                    setDirty(true);
                  }}
                />
              )}
              {tab === 'others' && (
                <PermissionGrid
                  rows={others}
                  type="other"
                  editable={editable}
                  onChange={(rows) => {
                    setOthers(rows as FormOtherRow[]);
                    setDirty(true);
                  }}
                />
              )}
              {tab === 'specials' && specials && (
                <SpecialFlagsPanel
                  flags={specials}
                  editable={editable}
                  onChange={(f) => {
                    setSpecials(f);
                    setDirty(true);
                  }}
                  ownRecords={ownRecords}
                  otherRecords={otherRecords}
                  onOwnRecordsChange={(v) => {
                    setOwnRecords(v);
                    setDirty(true);
                  }}
                  onOtherRecordsChange={(v) => {
                    setOtherRecords(v);
                    setDirty(true);
                  }}
                />
              )}
              {tab === 'units' && (
                <SelectionPanel
                  rows={units}
                  editable={editable}
                  label="units"
                  onChange={(rows) => {
                    setUnits(rows);
                    setDirty(true);
                  }}
                />
              )}
              {tab === 'dashboards' && (
                <SelectionPanel
                  rows={dashboards}
                  editable={editable}
                  label="dashboards"
                  onChange={(rows) => {
                    setDashboards(rows);
                    setDirty(true);
                  }}
                />
              )}
              {tab === 'processes' && (
                <SelectionPanel
                  rows={processes}
                  editable={editable}
                  label="processes"
                  onChange={(rows) => {
                    setProcesses(rows);
                    setDirty(true);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 bottom-6 z-50 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl ${
            toast.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-900/90 text-emerald-200'
              : 'border-red-500/40 bg-red-900/90 text-red-200'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
