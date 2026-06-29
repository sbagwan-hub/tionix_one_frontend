'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Edit, Undo2, Save, RotateCw, HelpCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Toolbar from '@/components/shared/toolbar';
import { useSalarySettings, useSaveSalarySettings } from '../hooks/use-salary-settings';
import { ProvidentFundEsicBonus } from './tabs/provident-fund-esic-bonus';
import { LabourWelfareFund } from './tabs/labour-welfare-fund';
import { TdsSlabs } from './tabs/tds-slabs';
import { ProfessionalTax } from './tabs/professional-tax';
import { TransactionAccountsOne } from './tabs/transaction-accounts-one';
import { TransactionAccountsTwo } from './tabs/transaction-accounts-two';
import { SalarySettingsData, SalarySettingsTabType } from '../types';

interface SidebarItem {
  id: SalarySettingsTabType;
  label: string;
}

export function SalarySettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SalarySettingsTabType>('pf-esic-bonus');
  const [isEditing, setIsEditing] = useState(false);

  const SIDEBAR_ITEMS: SidebarItem[] = [
    { id: 'pf-esic-bonus', label: t('salarySettings.pfEsicBonus', 'Provident Fund, ESIC And Bonus') },
    { id: 'lwf', label: t('salarySettings.lwf', 'Labour Welfare Fund') },
    { id: 'tds', label: t('salarySettings.tds', 'TDS') },
    { id: 'pt', label: t('salarySettings.pt', 'Professional Tax') },
    { id: 'accounts-one', label: t('salarySettings.accountsOne', 'Transaction Accounts I') },
    { id: 'accounts-two', label: t('salarySettings.accountsTwo', 'Transaction Accounts II') },
  ];

  // Queries & Mutations
  const { data: serverData, isLoading, refetch } = useSalarySettings();
  const saveMutation = useSaveSalarySettings();

  // Local form state
  const [formData, setFormData] = useState<SalarySettingsData | null>(null);

  // Initialize form state when server data is loaded
  useEffect(() => {
    if (serverData) {
      setFormData(JSON.parse(JSON.stringify(serverData)));
    }
  }, [serverData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUndo = () => {
    if (serverData) {
      setFormData(JSON.parse(JSON.stringify(serverData)));
    }
    setIsEditing(false);
    toast.info(t('common.undone', 'Edits undone.'));
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await saveMutation.mutateAsync(formData);
      setIsEditing(false);
      toast.success(t('common.saveSuccess', 'Salary settings updated successfully.'));
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.message || t('common.saveError', 'Failed to save settings.'));
    }
  };

  const activeItem = SIDEBAR_ITEMS.find((item) => item.id === activeTab) || SIDEBAR_ITEMS[0];

  const crudActions = isEditing
    ? ([
        {
          label: t('common.save', 'Save'),
          icon: Save,
          variant: 'primary',
          onClick: handleSave,
          disabled: saveMutation.isPending,
        },
        {
          label: t('common.cancel', 'Cancel'),
          icon: Undo2,
          variant: 'outline',
          onClick: handleUndo,
          disabled: saveMutation.isPending,
        },
      ] as const)
    : ([
        {
          label: t('common.edit', 'Edit'),
          icon: Edit,
          variant: 'secondary',
          onClick: handleEdit,
        },
      ] as const);

  const utilityActions = [
    { icon: RotateCw, title: t('common.refresh', 'Refresh'), onClick: () => { refetch(); } },
    { icon: HelpCircle, title: t('common.help', 'Help'), onClick: () => { toast.info(t('salarySettings.helpInfo', 'Configure salary rules and map ledger accounts.')); } },
    { icon: LogOut, title: t('common.exit', 'Exit'), onClick: () => { router.push('/dashboard'); } },
  ] as const;

  return (
    <div className="flex h-full flex-col bg-background text-foreground select-none">
      {/* Header Toolbar */}
      <div className="shrink-0 p-4">
        <Toolbar title={`${t('salarySettings.title', 'Salary Setting')} - ${activeItem.label}`} actions={crudActions} utilities={utilityActions} />
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-1 min-h-0 divide-x divide-border border rounded-lg bg-card overflow-hidden m-4 mt-0">
        {/* Left Sidebar Menu */}
        <aside className="w-64 shrink-0 bg-muted/20 overflow-y-auto neat-scrollbar flex flex-col p-2 pb-12 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isSelected = item.id === activeTab;
            return (
              <button
                key={item.id}
                disabled={isEditing}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-sm font-bold'
                    : 'text-foreground/75 hover:bg-muted/60 border-transparent hover:text-foreground disabled:opacity-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Right Content Panel */}
        <main className="flex-1 overflow-y-auto bg-background/50 relative flex flex-col min-w-0">
          {/* Subtle Glows */}
          <div className="absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-radial from-primary/5 to-transparent opacity-40 blur-3xl" />

          {isLoading || !formData ? (
            <div className="flex-1 flex items-center justify-center">
              <RotateCw className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex-1 relative z-10 flex flex-col">
              {activeTab === 'pf-esic-bonus' && (
                <ProvidentFundEsicBonus value={formData} onChange={setFormData} isEditing={isEditing} />
              )}
              {activeTab === 'lwf' && (
                <LabourWelfareFund value={formData} onChange={setFormData} isEditing={isEditing} />
              )}
              {activeTab === 'tds' && (
                <TdsSlabs value={formData} onChange={setFormData} isEditing={isEditing} />
              )}
              {activeTab === 'pt' && (
                <ProfessionalTax value={formData} onChange={setFormData} isEditing={isEditing} />
              )}
              {activeTab === 'accounts-one' && (
                <TransactionAccountsOne value={formData} onChange={setFormData} isEditing={isEditing} />
              )}
              {activeTab === 'accounts-two' && (
                <TransactionAccountsTwo value={formData} onChange={setFormData} isEditing={isEditing} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
