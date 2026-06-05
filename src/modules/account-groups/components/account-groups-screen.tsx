'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
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
import { AcctGroup, TreeNode } from '../types';
import { AccountGroupForm } from './account-group-form';
import { AccountGroupsTree } from './account-groups-tree';
import { AccountGroupsList } from './account-groups-list';
import { DeleteDialog } from '@/components/common/delete-dialog';
import {
  useAccountGroupsList,
  useAccountGroupsTree,
  useAccountGroupsParents,
  useCreateAccountGroup,
  useUpdateAccountGroup,
  useDeleteAccountGroup,
} from '../hooks/use-account-groups';

type Mode = 'view' | 'add' | 'edit';

export function AccountGroupsScreen() {
  const [mode, setMode] = useState<Mode>('view');
  const [activeTab, setActiveTab] = useState<'group' | 'list'>('group');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [cursor, setCursor] = useState(0);

  const [groupName, setGroupName] = useState('');
  const [selectedParent, setSelectedParent] = useState<AcctGroup | null>(null);
  const [isSysDefined, setIsSysDefined] = useState(false);

  const [filterGroup, setFilterGroup] = useState('');
  const [filterParent, setFilterParent] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const groupInputRef = useRef<HTMLInputElement>(null);

  // ── Queries & Mutations ──────────────────────────────────────────────────────
  const {
    data: records = [],
    isLoading: isListLoading,
    refetch: refetchList,
  } = useAccountGroupsList({
    ...(filterGroup ? { group_name: filterGroup } : {}),
    ...(filterParent ? { parent_name: filterParent } : {}),
  });

  const {
    data: tree = [],
    isLoading: isTreeLoading,
    refetch: refetchTree,
  } = useAccountGroupsTree();
  const {
    data: parents = [],
    isLoading: isParentsLoading,
    refetch: refetchParents,
  } = useAccountGroupsParents();

  const createMutation = useCreateAccountGroup();
  const updateMutation = useUpdateAccountGroup();
  const deleteMutation = useDeleteAccountGroup();

  const loading =
    isListLoading ||
    isTreeLoading ||
    isParentsLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // Auto-adjust cursor if it goes out of bounds when records list changes
  useEffect(() => {
    if (records.length > 0 && cursor >= records.length) {
      setCursor(records.length - 1);
    }
  }, [records, cursor]);

  // ── Populate form from record ───────────────────────────────────────────────

  const populateForm = useCallback(
    (rec: AcctGroup) => {
      setGroupName(rec.group_name);
      setIsSysDefined(rec.sys_defined);
      setSelectedId(rec.pk_grp_id);

      // Find and set the parent node
      if (rec.fk_prt_id) {
        const foundParent =
          records.find((r) => r.pk_grp_id === rec.fk_prt_id) ||
          parents.find((r) => r.pk_grp_id === rec.fk_prt_id);
        if (foundParent) {
          setSelectedParent(foundParent);
        } else if (rec.parent_name) {
          setSelectedParent({
            pk_grp_id: rec.fk_prt_id,
            group_name: rec.parent_name,
          } as AcctGroup);
        } else {
          setSelectedParent(null);
        }
      } else {
        setSelectedParent(null);
      }
    },
    [records, parents],
  );

  useEffect(() => {
    if (records.length > 0 && mode === 'view') {
      populateForm(records[cursor]);
    }
  }, [cursor, records, mode, populateForm]);

  const handleAdd = () => {
    const parentForNew = selectedId
      ? records.find((r) => r.pk_grp_id === selectedId) ||
        parents.find((r) => r.pk_grp_id === selectedId) ||
        ({ pk_grp_id: selectedId, group_name: groupName } as AcctGroup)
      : null;

    setGroupName('');
    setSelectedParent(parentForNew);
    setSelectedId(null);
    setIsSysDefined(false);
    setMode('add');
    setActiveTab('group');
    setTimeout(() => groupInputRef.current?.focus(), 80);
  };

  const handleEdit = () => {
    if (!selectedId) {
      toast.info('Select a record first, then edit.');
      return;
    }
    if (isSysDefined) {
      toast.error('System-defined records cannot be edited.');
      return;
    }
    setMode('edit');
    setActiveTab('group');
    setTimeout(() => groupInputRef.current?.focus(), 80);
  };

  const handleUndo = () => {
    if (records[cursor]) populateForm(records[cursor]);
    setMode('view');
  };

  const handleSave = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a Group name.');
      groupInputRef.current?.focus();
      return;
    }
    if (!selectedParent) {
      toast.error('Please select a Parent Group.');
      return;
    }
    try {
      if (mode === 'add') {
        await createMutation.mutateAsync({
          group_name: groupName.trim(),
          fk_prt_id: selectedParent.pk_grp_id,
          grouping: selectedParent.grouping ?? 0,
          prefix: selectedParent.prefix ?? '',
          dc: selectedParent.dc ?? 'DR',
          fk_user_id: '1',
        });
        toast.success(`"${groupName.trim()}" saved.`);
      } else if (mode === 'edit' && selectedId) {
        await updateMutation.mutateAsync({
          id: selectedId,
          body: {
            group_name: groupName.trim(),
            fk_prt_id: selectedParent.pk_grp_id,
            fk_user_id: '1',
          },
        });
        toast.success(`"${groupName.trim()}" updated.`);
      }
      setMode('view');
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Failed to save record';
      toast.error(msg);
    }
  };

  const handleDelete = () => {
    if (!selectedId) {
      toast.info('Select a record first, then delete.');
      return;
    }
    if (isSysDefined) {
      toast.error('Cannot delete system-defined records.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteMutation.mutateAsync(selectedId);
      toast.success(`"${groupName}" deleted.`);
      setCursor(0);
      setMode('view');
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Failed to delete record';
      toast.error(msg);
    }
  };

  const handleRefresh = async () => {
    setFilterGroup('');
    setFilterParent('');
    refetchList();
    refetchTree();
    refetchParents();
    toast.success('Data refreshed.');
  };

  const handleTreeSelect = (node: TreeNode) => {
    const found = records.findIndex((r) => r.pk_grp_id === node.pk_grp_id);
    if (found >= 0) {
      setCursor(found);
      setMode('view');
    } else {
      populateForm({ ...node, parent_name: node.parent_name ?? '' });
      setMode('view');
    }
  };

  const getSelectedNodeDepth = () => {
    if (!selectedId) return 0;
    let depth = 0;
    let currentId = selectedId;
    const visited = new Set<number>();
    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const node =
        records.find((r) => r.pk_grp_id === currentId) ||
        parents.find((r) => r.pk_grp_id === currentId);
      if (node && node.fk_prt_id && node.fk_prt_id !== currentId) {
        depth++;
        currentId = node.fk_prt_id;
      } else {
        break;
      }
    }
    return depth;
  };

  const isEditing = mode === 'add' || mode === 'edit';
  const canNav = !isEditing && records.length > 0;

  const crudActions = [
    {
      label: mode === 'edit' ? 'Save' : 'Add',
      icon: mode === 'edit' ? Save : Plus,
      variant: 'success',
      onClick: mode === 'view' ? handleAdd : handleSave,
      disabled:
        loading ||
        (mode === 'view' && getSelectedNodeDepth() >= 4) ||
        (mode !== 'view' && groupName.trim().length <= 2),
    },
    {
      label: 'Edit',
      icon: Edit,
      variant: 'primary',
      onClick: handleEdit,
      disabled: isEditing || !selectedId || isSysDefined || loading,
    },
    {
      label: 'Del',
      icon: Trash2,
      variant: 'danger',
      onClick: handleDelete,
      disabled: isEditing || !selectedId || isSysDefined || loading,
    },
    {
      label: 'Undo',
      icon: Undo2,
      variant: 'secondary',
      onClick: handleUndo,
      disabled: !isEditing || loading,
    },
  ] as const;

  const utilityActions = [
    { icon: RotateCw, title: 'Refresh', onClick: handleRefresh },
    { icon: Printer, title: 'Print', onClick: () => window.print() },
    {
      icon: FileSpreadsheet,
      title: 'Export',
      onClick: () => {
        toast.info('Export coming soon.');
      },
    },
    {
      icon: HelpCircle,
      title: 'Help',
      onClick: () => {
        toast.info('Select a parent in the tree on the right and edit attributes.');
      },
    },
  ] as const;

  const handleSelectRecord = (rec: AcctGroup, index: number) => {
    setCursor(index);
    populateForm(rec);
    setActiveTab('group');
    setMode('view');
  };

  const handleDoubleClickRecord = (rec: AcctGroup, index: number) => {
    setCursor(index);
    populateForm(rec);
    setActiveTab('group');
    handleEdit();
  };

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-background text-foreground flex h-full flex-col p-4 font-sans select-none">
      {/* Form Header */}
      <div className="mb-4 flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Account Group</h1>
          <p className="text-foreground mt-0.5 text-xs">
            Manage your account group hierarchy tree and classification rules
          </p>
        </div>
        {records.length > 0 && (
          <div className="bg-muted text-foreground rounded border px-2 py-1 text-xs font-semibold">
            Record: {cursor + 1} of {records.length}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <Toolbar actions={crudActions} utilities={utilityActions} />

      {/* Tabs list toggle */}
      <div className="my-2 flex border-b">
        <button
          className={`-mb-[2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'group'
              ? 'border-primary text-primary bg-muted/30 font-bold'
              : 'text-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => setActiveTab('group')}
        >
          Hierarchy Detail
        </button>
        <button
          className={`-mb-[2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'list'
              ? 'border-primary text-primary bg-muted/30 font-bold'
              : 'text-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => {
            setActiveTab('list');
            if (records.length === 0) refetchList();
          }}
        >
          All Records List
        </button>
      </div>

      {/* Content Container */}
      {activeTab === 'group' ? (
        <div className="bg-card grid min-h-[420px] grid-cols-1 divide-y overflow-hidden rounded-md border md:grid-cols-12 md:divide-x md:divide-y-0">
          {/* Form Component */}
          <AccountGroupForm
            groupName={groupName}
            setGroupName={setGroupName}
            selectedParent={selectedParent}
            setSelectedParent={setSelectedParent}
            parents={parents}
            isEditing={isEditing}
            mode={mode}
            selectedId={selectedId}
            isSysDefined={isSysDefined}
            records={records}
            cursor={cursor}
            groupInputRef={groupInputRef}
          />

          {/* Tree Component */}
          <AccountGroupsTree
            tree={tree}
            loading={loading}
            selectedId={mode === 'add' ? (selectedParent?.pk_grp_id ?? null) : selectedId}
            onSelectNode={handleTreeSelect}
          />
        </div>
      ) : (
        /* List Component */
        <AccountGroupsList
          records={records}
          selectedId={selectedId}
          filterGroup={filterGroup}
          setFilterGroup={setFilterGroup}
          filterParent={filterParent}
          setFilterParent={setFilterParent}
          loadData={refetchList}
          onSelectRecord={handleSelectRecord}
          onDoubleClickRecord={handleDoubleClickRecord}
        />
      )}

      {/* Status bar */}
      <div className="text-foreground mt-4 flex items-center gap-2 border-t pt-3 text-[11px] select-none">
        <span
          className={`h-2 w-2 rounded-full ${
            loading ? 'bg-primary animate-pulse' : isEditing ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
        />
        <span>
          {loading
            ? 'Processing data…'
            : isEditing
              ? `${mode === 'add' ? 'Adding' : 'Editing'} record`
              : 'Ready'}
        </span>
        {selectedId && !loading && (
          <>
            <span className="text-foreground/30">|</span>
            <span>
              Active Selection: <strong>{groupName}</strong>
            </span>
          </>
        )}
        <span className="ml-auto font-medium">Total: {records.length} records</span>
      </div>

      <DeleteDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this account group? This action cannot be undone."
        itemName={groupName}
        isDeleting={loading}
      />
    </div>
  );
}
