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
import { BankAccount, HolderDetail } from '../types';
import { BankAccountForm } from './bank-account-form';
import { BankAccountsList } from './bank-accounts-list';
import { AccountGroupsTree } from '../../account-groups/components/account-groups-tree';
import { TreeNode, AcctGroup } from '../../account-groups/types';
import { DeleteDialog } from '@/components/common/delete-dialog';
import {
  useBankAccountsList,
  useCreateBankAccount,
  useUpdateBankAccount,
  useDeleteBankAccount,
} from '../hooks/use-bank-accounts';
import { useAccountGroupsTree } from '../../account-groups/hooks/use-account-groups';
import { useMasterEmployee } from '../../master-employee/hooks/useMasterEmployee';

type Mode = 'view' | 'add' | 'edit';

export function BankAccountsScreen() {
  const [mode, setMode] = useState<Mode>('view');
  const [activeTab, setActiveTab] = useState<'details' | 'list'>('details');
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [cursor, setCursor] = useState(0);

  // Form states
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [rtgsNeftIfsc, setRtgsNeftIfsc] = useState('');
  const [accountType, setAccountType] = useState('Current Account');
  const [accountCode, setAccountCode] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<AcctGroup | null>(null);
  const [openingBalance, setOpeningBalance] = useState(0.0);
  const [openingBalanceSec, setOpeningBalanceSec] = useState(0.0);
  const [gstNo, setGstNo] = useState('');
  const [nominee, setNominee] = useState('');
  const [isSysDefined, setIsSysDefined] = useState(false);
  const [holderDetails, setHolderDetails] = useState<HolderDetail[]>([
    { id: '1', name: '', client_id: '' },
    { id: '2', name: '', client_id: '' },
    { id: '3', name: '', client_id: '' },
    { id: '4', name: '', client_id: '' },
  ]);

  const [filterBank, setFilterBank] = useState('');
  const [filterAccountNo, setFilterAccountNo] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const formInputRef = useRef<HTMLInputElement>(null);

  // ── Queries & Mutations ──────────────────────────────────────────────────────
  const {
    data: records = [],
    isLoading: isListLoading,
    refetch: refetchList,
  } = useBankAccountsList({
    ...(filterBank ? { bank_name: filterBank } : {}),
    ...(filterAccountNo ? { account_no: filterAccountNo } : {}),
  });

  const {
    data: accountGroupsTree = [],
    isLoading: isTreeLoading,
  } = useAccountGroupsTree();

  const { list: employeeQuery } = useMasterEmployee();
  const employees = employeeQuery.data?.data || [
    { pk_emp_id: 1, employee: 'Ramesh P' },
    { pk_emp_id: 2, employee: 'Suresh K' },
    { pk_emp_id: 3, employee: 'Samiksha' },
    { pk_emp_id: 4, employee: 'Amit P' },
  ];

  const createMutation = useCreateBankAccount();
  const updateMutation = useUpdateBankAccount();
  const deleteMutation = useDeleteBankAccount();

  const loading =
    isListLoading ||
    isTreeLoading ||
    employeeQuery.isLoading ||
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
  const populateForm = useCallback((rec: BankAccount) => {
    setBankName(rec.bank_name);
    setAccountNo(rec.account_no);
    setRtgsNeftIfsc(rec.rtgs_neft_ifsc);
    setAccountType(rec.account_type);
    setAccountCode(rec.account_code);
    setBankAccountName(rec.bank_account_name);
    setOpeningBalance(rec.opening_balance);
    setOpeningBalanceSec(rec.opening_balance_sec);
    setGstNo(rec.gst_no);
    setNominee(rec.nominee);
    setIsSysDefined(rec.sys_defined ?? false);
    setSelectedId(rec.pk_bank_acct_id);

    // Parse / pad holder details to always have 4 elements
    const paddedHolders = [...rec.holder_details];
    while (paddedHolders.length < 4) {
      paddedHolders.push({
        id: String(paddedHolders.length + 1),
        name: '',
        client_id: '',
      });
    }
    setHolderDetails(paddedHolders);

    // Group lookup
    if (rec.fk_grp_id) {
      setSelectedGroup({
        pk_grp_id: rec.fk_grp_id,
        group_name: rec.group_name || 'Bank',
      } as AcctGroup);
    } else {
      setSelectedGroup(null);
    }
  }, []);

  useEffect(() => {
    if (records.length > 0 && mode === 'view') {
      populateForm(records[cursor]);
    }
  }, [cursor, records, mode, populateForm]);

  const handleAdd = () => {
    setBankName('');
    setAccountNo('');
    setRtgsNeftIfsc('');
    setAccountType('Current Account');
    setAccountCode('');
    setBankAccountName('');
    setOpeningBalance(0.0);
    setOpeningBalanceSec(0.0);
    setGstNo('');
    setNominee('');
    setIsSysDefined(false);
    setSelectedId(null);
    setSelectedGroup(null);
    setHolderDetails([
      { id: '1', name: '', client_id: '' },
      { id: '2', name: '', client_id: '' },
      { id: '3', name: '', client_id: '' },
      { id: '4', name: '', client_id: '' },
    ]);
    setMode('add');
    setActiveTab('details');
    setTimeout(() => formInputRef.current?.focus(), 80);
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
    setActiveTab('details');
    setTimeout(() => formInputRef.current?.focus(), 80);
  };

  const handleUndo = () => {
    if (records[cursor]) populateForm(records[cursor]);
    setMode('view');
  };

  const handleSave = async () => {
    if (!bankName) {
      toast.error('Please select a Bank Name.');
      return;
    }
    if (!accountNo.trim()) {
      toast.error('Please enter an Account Number.');
      return;
    }
    if (!accountCode.trim()) {
      toast.error('Please enter an Account Code.');
      return;
    }
    if (!bankAccountName.trim()) {
      toast.error('Please enter a Bank Account Name.');
      return;
    }
    if (!selectedGroup) {
      toast.error('Please select a Group from the tree.');
      return;
    }
    if (!gstNo.trim()) {
      toast.error('Please enter a GST Number.');
      return;
    }

    const filteredHolders = holderDetails.filter((h) => h.name.trim() || h.client_id.trim());

    const body = {
      bank_name: bankName,
      account_no: accountNo.trim(),
      rtgs_neft_ifsc: rtgsNeftIfsc.trim(),
      account_type: accountType,
      account_code: accountCode.trim(),
      bank_account_name: bankAccountName.trim(),
      fk_grp_id: selectedGroup.pk_grp_id,
      opening_balance: openingBalance,
      opening_balance_sec: openingBalanceSec,
      gst_no: gstNo.trim(),
      holder_details: filteredHolders,
      nominee: nominee.trim(),
    };

    try {
      if (mode === 'add') {
        await createMutation.mutateAsync(body);
        toast.success(`"${bankAccountName.trim()}" saved.`);
      } else if (mode === 'edit' && selectedId) {
        await updateMutation.mutateAsync({
          id: selectedId,
          body,
        });
        toast.success(`"${bankAccountName.trim()}" updated.`);
      }
      setMode('view');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save record');
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
      toast.success(`"${bankAccountName}" deleted.`);
      setCursor(0);
      setMode('view');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete record');
    }
  };

  const handleRefresh = async () => {
    setFilterBank('');
    setFilterAccountNo('');
    refetchList();
    toast.success('Data refreshed.');
  };

  const handleTreeSelect = (node: TreeNode) => {
    if (mode === 'add' || mode === 'edit') {
      setSelectedGroup(node);
      toast.success(`Assigned Group to "${node.group_name}"`);
    } else {
      // Find bank accounts linked to this group
      const idx = records.findIndex((r) => r.fk_grp_id === node.pk_grp_id);
      if (idx !== -1) {
        setCursor(idx);
        populateForm(records[idx]);
      } else {
        setSelectedGroup(node);
      }
    }
  };

  // Build/Mock the "Bank" tree structure
  const getBankTree = (): TreeNode[] => {
    // Try to find the "Bank" node in the loaded tree
    const findBankNode = (nodes: TreeNode[]): TreeNode | null => {
      for (const n of nodes) {
        if (n.group_name.toLowerCase() === 'bank') return n;
        if (n.children) {
          const found = findBankNode(n.children);
          if (found) return found;
        }
      }
      return null;
    };

    const realBankNode = findBankNode(accountGroupsTree);
    if (realBankNode) {
      return [realBankNode];
    }

    // Fallback Mock Structure
    return [
      {
        pk_grp_id: 30,
        group_name: 'Bank',
        fk_prt_id: 0,
        fk_main_id: 30,
        fk_sub_id: 30,
        grouping: 5,
        prefix: '+',
        dc: 'DR',
        sync: 'N',
        sys_defined: true,
        date_time_stamp: '',
        fk_user_id: '1',
        last_status: 'Added',
        children: [
          {
            pk_grp_id: 31,
            group_name: 'Secured Loan',
            fk_prt_id: 30,
            fk_main_id: 30,
            fk_sub_id: 31,
            grouping: 5,
            prefix: '+',
            dc: 'DR',
            sync: 'N',
            sys_defined: false,
            date_time_stamp: '',
            fk_user_id: '1',
            last_status: 'Added',
            children: [],
          },
          {
            pk_grp_id: 32,
            group_name: 'Fixed Deposit',
            fk_prt_id: 30,
            fk_main_id: 30,
            fk_sub_id: 32,
            grouping: 5,
            prefix: '+',
            dc: 'DR',
            sync: 'N',
            sys_defined: false,
            date_time_stamp: '',
            fk_user_id: '1',
            last_status: 'Added',
            children: [],
          },
          {
            pk_grp_id: 33,
            group_name: 'Bank OD A/C',
            fk_prt_id: 30,
            fk_main_id: 30,
            fk_sub_id: 33,
            grouping: 5,
            prefix: '+',
            dc: 'DR',
            sync: 'N',
            sys_defined: false,
            date_time_stamp: '',
            fk_user_id: '1',
            last_status: 'Added',
            children: [],
          },
          {
            pk_grp_id: 34,
            group_name: 'BD Limits',
            fk_prt_id: 30,
            fk_main_id: 30,
            fk_sub_id: 34,
            grouping: 5,
            prefix: '+',
            dc: 'DR',
            sync: 'N',
            sys_defined: false,
            date_time_stamp: '',
            fk_user_id: '1',
            last_status: 'Added',
            children: [],
          },
        ],
      },
    ];
  };

  const isEditing = mode === 'add' || mode === 'edit';

  const crudActions = [
    {
      label: mode === 'edit' ? 'Save' : 'Add',
      icon: mode === 'edit' ? Save : Plus,
      variant: 'primary',
      onClick: mode === 'view' ? handleAdd : handleSave,
      disabled: loading,
    },
    {
      label: 'Edit',
      icon: Edit,
      variant: 'secondary',
      onClick: handleEdit,
      disabled: isEditing || !selectedId || isSysDefined || loading,
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      onClick: handleDelete,
      disabled: isEditing || !selectedId || isSysDefined || loading,
    },
    {
      label: 'Cancel',
      icon: Undo2,
      variant: 'outline',
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
        toast.info('Select a group in the tree on the right and fill bank details.');
      },
    },
  ] as const;

  const handleSelectRecord = (rec: BankAccount, index: number) => {
    setCursor(index);
    populateForm(rec);
    setActiveTab('details');
    setMode('view');
  };

  const handleDoubleClickRecord = (rec: BankAccount, index: number) => {
    setCursor(index);
    populateForm(rec);
    setActiveTab('details');
    handleEdit();
  };

  return (
    <div className="bg-background text-foreground flex h-full flex-col p-4 font-sans select-none">
      <Toolbar title="Bank Account" actions={crudActions} utilities={utilityActions} />

      {/* Tabs list toggle */}
      <div className="my-2 flex border-b">
        <button
          className={`-mb-[2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'details'
              ? 'border-primary text-primary bg-muted/30 font-bold'
              : 'text-foreground hover:text-foreground border-transparent'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Account Details
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
      {activeTab === 'details' ? (
        <div className="bg-card grid min-h-0 flex-1 grid-cols-1 divide-y overflow-y-auto rounded-md border md:grid-cols-12 md:divide-x md:divide-y-0 md:overflow-hidden">
          {/* Form Component */}
          <BankAccountForm
            bankName={bankName}
            setBankName={setBankName}
            accountNo={accountNo}
            setAccountNo={setAccountNo}
            rtgsNeftIfsc={rtgsNeftIfsc}
            setRtgsNeftIfsc={setRtgsNeftIfsc}
            accountType={accountType}
            setAccountType={setAccountType}
            accountCode={accountCode}
            setAccountCode={setAccountCode}
            bankAccountName={bankAccountName}
            setBankAccountName={setBankAccountName}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            openingBalance={openingBalance}
            setOpeningBalance={setOpeningBalance}
            openingBalanceSec={openingBalanceSec}
            setOpeningBalanceSec={setOpeningBalanceSec}
            gstNo={gstNo}
            setGstNo={setGstNo}
            holderDetails={holderDetails}
            setHolderDetails={setHolderDetails}
            nominee={nominee}
            setNominee={setNominee}
            isEditing={isEditing}
            mode={mode}
            selectedId={selectedId}
            isSysDefined={isSysDefined}
            records={records}
            cursor={cursor}
            formInputRef={formInputRef}
            employees={employees}
          />

          {/* Tree Component */}
          <div className="md:col-span-5 h-full">
            <AccountGroupsTree
              tree={getBankTree()}
              loading={isTreeLoading}
              selectedId={selectedGroup?.pk_grp_id ?? null}
              onSelectNode={handleTreeSelect}
            />
          </div>
        </div>
      ) : (
        /* List Component */
        <BankAccountsList
          records={records}
          selectedId={selectedId}
          filterBank={filterBank}
          setFilterBank={setFilterBank}
          filterAccountNo={filterAccountNo}
          setFilterAccountNo={setFilterAccountNo}
          loadData={refetchList}
          onSelectRecord={handleSelectRecord}
          onDoubleClickRecord={handleDoubleClickRecord}
        />
      )}

      <DeleteDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this bank account? This action cannot be undone."
        itemName={bankAccountName}
        isDeleting={loading}
      />
    </div>
  );
}
