import React from 'react';
import { Settings, Activity, Plus, FileText, Download } from 'lucide-react';
import { Action } from '@/components/shared/toolbar';

// Define the shape of a registered window
export interface RegisteredWindow {
  id: string;
  title: string;
  icon: React.ReactNode;
  isMinimizable?: boolean;
  isMaximizable?: boolean;
  isDraggable?: boolean;
  className?: string;
  toolbarTitle?: string;
  toolbarActions?: readonly Action[];
  toolbarUtilities?: readonly Action[];
  component: React.ComponentType;
}

// -------------------------------------------------------------
// 1. Define Child Content Components
// -------------------------------------------------------------

const SystemConfigContent: React.FC = () => (
  <p className="text-sm text-neutral-600 dark:text-neutral-400">
    This window embeds the Toolbar automatically through props! Drag this window or click on it to
    bring it to the top.
  </p>
);

const SystemLogsContent: React.FC = () => (
  <div className="space-y-2">
    <p className="text-sm text-neutral-600 dark:text-neutral-400">
      This is a second, overlapping window. Click here to focus and place it in front of the System
      Configuration window.
    </p>
    <div className="rounded border border-neutral-200 bg-neutral-50 p-2 font-mono text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
      [SYSTEM] 17:49:05 - Window manager initialized.
      <br />
      [SYSTEM] 17:49:08 - Central store registered.
    </div>
  </div>
);

const QualificationContent: React.FC = () => (
  <div className="space-y-3">
    <p className="text-xs text-neutral-500">Configure academic degrees and certifications.</p>
    <ul className="divide-y divide-neutral-100 text-sm dark:divide-neutral-800">
      <li className="flex justify-between py-2">
        <span>Bachelor of Science</span>{' '}
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
          B.Sc
        </span>
      </li>
      <li className="flex justify-between py-2">
        <span>Master of Business Admin</span>{' '}
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
          MBA
        </span>
      </li>
      <li className="flex justify-between py-2">
        <span>Doctor of Philosophy</span>{' '}
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
          Ph.D
        </span>
      </li>
    </ul>
  </div>
);

const RelationshipContent: React.FC = () => (
  <div className="space-y-3">
    <p className="text-xs text-neutral-500">Manage family relationships and next-of-kin records.</p>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="rounded border border-neutral-200 bg-neutral-50 p-2 text-center font-semibold dark:border-neutral-800 dark:bg-neutral-900">
        Spouse
      </div>
      <div className="rounded border border-neutral-200 bg-neutral-50 p-2 text-center font-semibold dark:border-neutral-800 dark:bg-neutral-900">
        Child
      </div>
      <div className="rounded border border-neutral-200 bg-neutral-50 p-2 text-center font-semibold dark:border-neutral-800 dark:bg-neutral-900">
        Parent
      </div>
      <div className="rounded border border-neutral-200 bg-neutral-50 p-2 text-center font-semibold dark:border-neutral-800 dark:bg-neutral-900">
        Sibling
      </div>
    </div>
  </div>
);

const ProductCategoryContent: React.FC = () => (
  <div className="space-y-3">
    <p className="text-xs text-neutral-500">Configure catalog categorization layers.</p>
    <ul className="divide-y divide-neutral-100 text-sm dark:divide-neutral-800">
      <li className="flex justify-between py-2">
        <span>Enterprise Software</span> <span className="text-xs text-blue-500">Active</span>
      </li>
      <li className="flex justify-between py-2">
        <span>Computing Hardware</span> <span className="text-xs text-blue-500">Active</span>
      </li>
      <li className="flex justify-between py-2">
        <span>Professional Services</span> <span className="text-xs text-blue-500">Active</span>
      </li>
    </ul>
  </div>
);

const DepartmentContent: React.FC = () => (
  <div className="space-y-3">
    <p className="text-xs text-neutral-500">Establish company department anchors.</p>
    <div className="space-y-1">
      <div className="rounded border border-indigo-100 bg-indigo-50/50 p-2 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-300">
        Engineering
      </div>
      <div className="rounded border border-neutral-200 bg-neutral-50 p-2 text-xs font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        Human Resources
      </div>
      <div className="rounded border border-neutral-200 bg-neutral-50 p-2 text-xs font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        Finance & Accounting
      </div>
    </div>
  </div>
);

const DesignationContent: React.FC = () => (
  <div className="space-y-3">
    <p className="text-xs text-neutral-500">Define employee roles and operational designations.</p>
    <ul className="divide-y divide-neutral-100 text-sm dark:divide-neutral-800">
      <li className="flex justify-between py-2">
        <span>Lead Product Engineer</span> <span className="text-xs text-neutral-400">L3</span>
      </li>
      <li className="flex justify-between py-2">
        <span>Senior Consultant</span> <span className="text-xs text-neutral-400">L2</span>
      </li>
      <li className="flex justify-between py-2">
        <span>Operations Coordinator</span> <span className="text-xs text-neutral-400">L1</span>
      </li>
    </ul>
  </div>
);

// -------------------------------------------------------------
// 2. Define Shared Props Config
// -------------------------------------------------------------

const toolbarActions = [
  { label: 'New', icon: Plus, onClick: () => console.log('New clicked') },
  { label: 'Report', icon: FileText, onClick: () => console.log('Report clicked') },
];

const toolbarUtilities = [
  { title: 'Export PDF', icon: Download, onClick: () => console.log('Export clicked') },
];

// -------------------------------------------------------------
// 3. Central Window Configuration Map
// -------------------------------------------------------------

export const WINDOW_REGISTRY: Record<string, RegisteredWindow> = {
  'system-config': {
    id: 'system-config',
    title: 'System Configuration',
    icon: <Settings className="h-4 w-4 text-blue-500" />,
    isMinimizable: true,
    isMaximizable: true,
    toolbarTitle: 'Settings Manager',
    toolbarActions,
    toolbarUtilities,
    className: 'absolute top-20 left-10 w-full max-w-md',
    component: SystemConfigContent,
  },
  'system-logs': {
    id: 'system-logs',
    title: 'System Logs',
    icon: <Activity className="h-4 w-4 text-emerald-500" />,
    isMinimizable: true,
    className: 'absolute top-36 left-48 w-full max-w-md',
    component: SystemLogsContent,
  },
  'contacts-qualification': {
    id: 'contacts-qualification',
    title: 'Qualifications Setup',
    icon: <Settings className="h-4 w-4 text-purple-500" />,
    isMinimizable: true,
    className: 'absolute top-24 left-16 w-full max-w-md',
    component: QualificationContent,
  },
  'contacts-relationship': {
    id: 'contacts-relationship',
    title: 'Relationships',
    icon: <Settings className="h-4 w-4 text-rose-500" />,
    isMinimizable: true,
    className: 'absolute top-28 left-24 w-full max-w-md',
    component: RelationshipContent,
  },
  'contacts-product-category': {
    id: 'contacts-product-category',
    title: 'Product Categories',
    icon: <Settings className="h-4 w-4 text-yellow-500" />,
    isMinimizable: true,
    className: 'absolute top-32 left-32 w-full max-w-md',
    component: ProductCategoryContent,
  },
  'contacts-department': {
    id: 'contacts-department',
    title: 'Departments',
    icon: <Settings className="h-4 w-4 text-indigo-500" />,
    isMinimizable: true,
    className: 'absolute top-36 left-40 w-full max-w-md',
    component: DepartmentContent,
  },
  'contacts-designation': {
    id: 'contacts-designation',
    title: 'Designations',
    icon: <Settings className="h-4 w-4 text-teal-500" />,
    isMinimizable: true,
    className: 'absolute top-40 left-48 w-full max-w-md',
    component: DesignationContent,
  },
};
