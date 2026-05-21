'use client';

import React, { useState } from 'react';
import { Shield, Users, CheckSquare, Square, Save, RotateCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

// --- Domain Type Architecture ---
type PermissionKey = 'read' | 'write' | 'update' | 'delete' | 'edit' | 'authorize';

interface PermissionRow {
  id: string;
  moduleNameKey: string;
  permissions: Record<PermissionKey, boolean>;
}

interface TabData {
  value: string;
  label: string;
  rows: PermissionRow[];
}

// --- Semantic Column Definition Matrix ---
const PERMISSION_COLUMNS: { key: PermissionKey; label: string }[] = [
  { key: 'read', label: 'permissionRead' },
  { key: 'write', label: 'permissionWrite' },
  { key: 'update', label: 'permissionUpdate' },
  { key: 'edit', label: 'permissionEdit' },
  { key: 'delete', label: 'permissionDelete' },
  { key: 'authorize', label: 'permissionAuthorize' },
];

// --- Mock Functional Seed Data ---
const MOCK_USERS = [
  { id: 'usr_1', name: 'SUPERVISOR', roleKey: 'roleAdministrator' },
  { id: 'usr_2', name: 'J_SMITH', roleKey: 'roleAccountant' },
  { id: 'usr_3', name: 'A_KHAN', roleKey: 'roleDataEntryOperator' },
];

const INITIAL_MATRIX_STATE: Record<string, PermissionRow[]> = {
  transaction: [
    {
      id: 'tx_1',
      moduleNameKey: 'moduleSalesInvoiceVoucher',
      permissions: {
        read: true,
        write: true,
        update: true,
        edit: true,
        delete: false,
        authorize: false,
      },
    },
    {
      id: 'tx_2',
      moduleNameKey: 'modulePurchaseOrderReceipt',
      permissions: {
        read: true,
        write: true,
        update: false,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
    {
      id: 'tx_3',
      moduleNameKey: 'moduleJournalVoucherPostings',
      permissions: {
        read: true,
        write: false,
        update: false,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
    {
      id: 'tx_4',
      moduleNameKey: 'moduleMaterialGatePassEntry',
      permissions: {
        read: true,
        write: true,
        update: true,
        edit: true,
        delete: true,
        authorize: false,
      },
    },
  ],
  master: [
    {
      id: 'ms_1',
      moduleNameKey: 'moduleCustomerMasterProfile',
      permissions: {
        read: true,
        write: true,
        update: false,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
    {
      id: 'ms_2',
      moduleNameKey: 'moduleVendorLedgerConfiguration',
      permissions: {
        read: true,
        write: true,
        update: true,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
    {
      id: 'ms_3',
      moduleNameKey: 'moduleInventoryItemSKUs',
      permissions: {
        read: true,
        write: true,
        update: true,
        edit: true,
        delete: false,
        authorize: true,
      },
    },
  ],
  reports: [
    {
      id: 'rp_1',
      moduleNameKey: 'moduleTrialBalanceMatrix',
      permissions: {
        read: true,
        write: false,
        update: false,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
    {
      id: 'rp_2',
      moduleNameKey: 'moduleProfitLossAccountStatement',
      permissions: {
        read: false,
        write: false,
        update: false,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
    {
      id: 'rp_3',
      moduleNameKey: 'moduleTaxationAuditSummaryLog',
      permissions: {
        read: false,
        write: false,
        update: false,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
  ],
  utilities: [
    {
      id: 'ut_1',
      moduleNameKey: 'moduleDatabaseBackupOperations',
      permissions: {
        read: false,
        write: false,
        update: false,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
    {
      id: 'ut_2',
      moduleNameKey: 'moduleSystemActivityAuditTrailTracker',
      permissions: {
        read: true,
        write: false,
        update: false,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
  ],
};

export default function PermissionMatrixUi() {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState<string>('usr_1');
  const [activeTab, setActiveTab] = useState<string>('transaction');
  const [matrix, setMatrix] = useState<Record<string, PermissionRow[]>>(INITIAL_MATRIX_STATE);

  // Toggle individual cellular check switches safely
  const handleToggleCell = (tabKey: string, rowId: string, permissionKey: PermissionKey) => {
    setMatrix((prev) => ({
      ...prev,
      [tabKey]: prev[tabKey].map((row) =>
        row.id === rowId
          ? {
              ...row,
              permissions: {
                ...row.permissions,
                [permissionKey]: !row.permissions[permissionKey],
              },
            }
          : row,
      ),
    }));
  };

  // Bulk column execution logic (Toggle entire columns for quick entries)
  const handleToggleColumn = (tabKey: string, permissionKey: PermissionKey) => {
    const targetingRows = matrix[tabKey];
    const allChecked = targetingRows.every((r) => r.permissions[permissionKey]);

    setMatrix((prev) => ({
      ...prev,
      [tabKey]: prev[tabKey].map((row) => ({
        ...row,
        permissions: {
          ...row.permissions,
          [permissionKey]: !allChecked,
        },
      })),
    }));
  };

  const handleSaveConfig = () => {
    console.log(
      'Pushing access delta mutations payload directly to authorization engine secure layer...',
      matrix,
    );
  };

  const handleReset = () => {
    setMatrix(INITIAL_MATRIX_STATE);
  };

  return (
    <div className="bg-card border-border mx-auto w-full max-w-6xl space-y-4 rounded-xl border p-5 shadow-xs">
      {/* SECTION HEADER BLOCK */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <div className="text-foreground flex items-center gap-2 text-sm font-bold">
            <Shield className="text-brand h-4 w-4" />
            <span>{t('securityMatrixTitle')}</span>
          </div>
          <p className="text-muted-foreground text-[11px]">{t('securityMatrixDescription')}</p>
        </div>

        {/* Global Action Footers tucked right */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="h-8 gap-1 text-xs">
            <RotateCcw className="h-3 w-3" /> {t('resetChanges')}
          </Button>
          <Button
            size="sm"
            onClick={handleSaveConfig}
            className="bg-brand hover:bg-brand/90 h-8 gap-1 text-xs text-white"
          >
            <Save className="h-3 w-3" /> {t('savePermissions')}
          </Button>
        </div>
      </div>

      {/* TARGET IDENTIFICATION CONTROL */}
      <div className="bg-accent/60 border-border flex max-w-md items-center gap-3 rounded-lg border p-3">
        <Users className="text-muted-foreground h-4 w-4 shrink-0" />
        <div className="flex-1 space-y-1">
          <label className="text-muted-foreground text-xxs font-bold tracking-wider uppercase">
            {t('targetActivePrincipal')}
          </label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="bg-card border-border focus:ring-brand text-foreground h-7 w-full rounded-md text-xs shadow-none focus:ring-1">
              <SelectValue placeholder={t('identifyTargetedOperationalIdentity')} />
            </SelectTrigger>
            <SelectContent className="text-xs">
              {MOCK_USERS.map((usr) => (
                <SelectItem key={usr.id} value={usr.id}>
                  {usr.name} — <span className="opacity-60">{t(usr.roleKey)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MATRIX PERMISSION CONTAINER */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-3">
        <TabsList className="bg-accent border-border flex w-full justify-start overflow-x-auto rounded-lg border p-0.5 sm:w-auto">
          <TabsTrigger
            value="transaction"
            className="data-[state=active]:bg-card data-[state=active]:text-brand rounded-md px-4 py-1 text-xs font-medium data-[state=active]:shadow-xs"
          >
            {t('transactionsTab')}
          </TabsTrigger>
          <TabsTrigger
            value="master"
            className="data-[state=active]:bg-card data-[state=active]:text-brand rounded-md px-4 py-1 text-xs font-medium data-[state=active]:shadow-xs"
          >
            {t('masterRecordsTab')}
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-card data-[state=active]:text-brand rounded-md px-4 py-1 text-xs font-medium data-[state=active]:shadow-xs"
          >
            {t('analyticalReportsTab')}
          </TabsTrigger>
          <TabsTrigger
            value="utilities"
            className="data-[state=active]:bg-card data-[state=active]:text-brand rounded-md px-4 py-1 text-xs font-medium data-[state=active]:shadow-xs"
          >
            {t('systemUtilitiesTab')}
          </TabsTrigger>
        </TabsList>

        {/* COMPACT PERMISSION GRID DYNAMICS */}
        {Object.keys(INITIAL_MATRIX_STATE).map((tabKey) => (
          <TabsContent
            key={tabKey}
            value={tabKey}
            className="border-border bg-card overflow-hidden rounded-lg border outline-none"
          >
            <Table>
              <TableHeader className="bg-accent/40">
                <TableRow className="border-border border-b hover:bg-transparent">
                  <TableHead className="text-foreground w-75 py-2 text-xs font-semibold">
                    {t('applicationTargetModuleMapping')}
                  </TableHead>

                  {/* Dynamic Column Trigger Headers */}
                  {PERMISSION_COLUMNS.map((col) => {
                    const columnRows = matrix[tabKey] || [];
                    const isAllChecked =
                      columnRows.length > 0 && columnRows.every((r) => r.permissions[col.key]);

                    return (
                      <TableHead
                        key={col.key}
                        className="text-foreground py-2 text-center text-xs font-semibold"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{t(col.label)}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleColumn(tabKey, col.key)}
                            className="text-brand font-mono text-[9px] tracking-tighter uppercase opacity-70 transition-opacity hover:underline hover:opacity-100"
                            title={t('toggleAllPermissions', {
                              permission: t(col.label),
                            })}
                          >
                            {isAllChecked ? t('clearAll') : t('setAll')}
                          </button>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>

              <TableBody>
                {matrix[tabKey]?.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border/60 hover:bg-accent/20 border-b transition-colors"
                  >
                    <TableCell className="text-foreground max-w-75 truncate py-2 font-medium">
                      {t(row.moduleNameKey)}
                    </TableCell>

                    {/* Functional Checkbox Actions */}
                    {PERMISSION_COLUMNS.map((col) => (
                      <TableCell key={col.key} className="py-2 text-center">
                        <div className="inline-flex items-center justify-center">
                          <Checkbox
                            checked={row.permissions[col.key]}
                            onCheckedChange={() => handleToggleCell(tabKey, row.id, col.key)}
                            className="border-muted-foreground/40 data-[state=checked]:bg-brand data-[state=checked]:border-brand h-4 w-4 rounded-md shadow-none transition-all"
                          />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
