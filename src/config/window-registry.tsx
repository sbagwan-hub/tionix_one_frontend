import React from 'react';
import { Settings } from 'lucide-react';

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
  component: React.ComponentType;
}

import { CategoryWindow } from '@/modules/master-contacts/components/CategoryWindow';
import { DepartmentWindow } from '@/modules/master-contacts/components/DepartmentWindow';
import { DesignationWindow } from '@/modules/master-contacts/components/DesignationWindow';
import { QualificationWindow } from '@/modules/master-contacts/components/QualificationWindow';
import { RelationshipWindow } from '@/modules/master-contacts/components/RelationshipWindow';
import { TitleWindow } from '@/modules/master-contacts/components/TitleWindow';

import { SkintoneWindow } from '@/modules/master-salary/components/SkintoneWindow';
import { CasteWindow } from '@/modules/master-salary/components/CasteWindow';
import { ReligionWindow } from '@/modules/master-salary/components/ReligionWindow';
import { ScheduleTypeWindow } from '@/modules/master-salary/components/ScheduleTypeWindow';

export const WINDOW_REGISTRY: Record<string, RegisteredWindow> = {
  'contacts-title': {
    id: 'contacts-title',
    title: 'Titles',
    icon: <Settings className="h-4 w-4 text-pink-500" />,
    isMinimizable: true,
    className: 'absolute top-20 left-12 w-full max-w-2xl',
    component: TitleWindow,
  },
  'contacts-qualification': {
    id: 'contacts-qualification',
    title: 'Qualifications Setup',
    icon: <Settings className="h-4 w-4 text-purple-500" />,
    isMinimizable: true,
    className: 'absolute top-24 left-16 w-full max-w-2xl',
    component: QualificationWindow,
  },
  'contacts-relationship': {
    id: 'contacts-relationship',
    title: 'Relationships',
    icon: <Settings className="h-4 w-4 text-rose-500" />,
    isMinimizable: true,
    className: 'absolute top-28 left-24 w-full max-w-2xl',
    component: RelationshipWindow,
  },
  'contacts-product-category': {
    id: 'contacts-product-category',
    title: 'Categories',
    icon: <Settings className="h-4 w-4 text-yellow-500" />,
    isMinimizable: true,
    className: 'absolute top-32 left-32 w-full max-w-2xl',
    component: CategoryWindow,
  },
  'contacts-department': {
    id: 'contacts-department',
    title: 'Departments',
    icon: <Settings className="h-4 w-4 text-indigo-500" />,
    isMinimizable: true,
    className: 'absolute top-36 left-40 w-full max-w-2xl',
    component: DepartmentWindow,
  },
  'contacts-designation': {
    id: 'contacts-designation',
    title: 'Designations',
    icon: <Settings className="h-4 w-4 text-teal-500" />,
    isMinimizable: true,
    className: 'absolute top-40 left-48 w-full max-w-2xl',
    component: DesignationWindow,
  },

  // Salary Setup Windows
  'salary-skintone': {
    id: 'salary-skintone',
    title: 'Skintones',
    icon: <Settings className="h-4 w-4 text-emerald-500" />,
    isMinimizable: true,
    className: 'absolute top-20 left-12 w-full max-w-2xl',
    component: SkintoneWindow,
  },
  'salary-caste': {
    id: 'salary-caste',
    title: 'Castes/sub-caste',
    icon: <Settings className="h-4 w-4 text-orange-500" />,
    isMinimizable: true,
    className: 'absolute top-24 left-16 w-full max-w-2xl',
    component: CasteWindow,
  },
  'salary-religion': {
    id: 'salary-religion',
    title: 'Religions',
    icon: <Settings className="h-4 w-4 text-amber-500" />,
    isMinimizable: true,
    className: 'absolute top-28 left-24 w-full max-w-2xl',
    component: ReligionWindow,
  },
  'salary-schedule-type': {
    id: 'salary-schedule-type',
    title: 'Schedule Types',
    icon: <Settings className="h-4 w-4 text-cyan-500" />,
    isMinimizable: true,
    className: 'absolute top-32 left-32 w-full max-w-2xl',
    component: ScheduleTypeWindow,
  },
};
