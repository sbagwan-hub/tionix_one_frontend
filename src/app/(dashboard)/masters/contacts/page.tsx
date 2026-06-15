'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  User,
  GraduationCap,
  Heart,
  Layers,
  Building2,
  Briefcase,
  MapPin,
  Home,
} from 'lucide-react';

import { TitleWindow } from '@/modules/master-contacts/components/TitleWindow';
import { QualificationWindow } from '@/modules/master-contacts/components/QualificationWindow';
import { RelationshipWindow } from '@/modules/master-contacts/components/RelationshipWindow';
import { CategoryWindow } from '@/modules/master-contacts/components/CategoryWindow';
import { DepartmentWindow } from '@/modules/master-contacts/components/DepartmentWindow';
import { DesignationWindow } from '@/modules/master-contacts/components/DesignationWindow';
import { CityWindow } from '@/modules/master-contacts/components/CityWindow';
import { AddressWindow } from '@/modules/master-contacts/components/AddressWindow';

export default function ContactsDashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'titles',
      label: t('titles', 'Titles'),
      icon: <User className="h-4 w-4" />,
      component: TitleWindow,
    },
    {
      id: 'qualifications',
      label: t('qualification', 'Qualifications'),
      icon: <GraduationCap className="h-4 w-4" />,
      component: QualificationWindow,
    },
    {
      id: 'relationships',
      label: t('relationship', 'Relationships'),
      icon: <Heart className="h-4 w-4" />,
      component: RelationshipWindow,
    },
    {
      id: 'categories',
      label: t('productCategory', 'Categories'),
      icon: <Layers className="h-4 w-4" />,
      component: CategoryWindow,
    },
    {
      id: 'departments',
      label: t('department', 'Departments'),
      icon: <Building2 className="h-4 w-4" />,
      component: DepartmentWindow,
    },
    {
      id: 'designations',
      label: t('designation', 'Designations'),
      icon: <Briefcase className="h-4 w-4" />,
      component: DesignationWindow,
    },
    {
      id: 'cities',
      label: t('city', 'Cities'),
      icon: <MapPin className="h-4 w-4" />,
      component: CityWindow,
    },
    {
      id: 'addresses',
      label: t('address', 'Addresses'),
      icon: <Home className="h-4 w-4" />,
      component: AddressWindow,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 select-none">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/masters')}
            className="hover:bg-muted flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Masters
          </Button>
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              {t('Contacts', 'Contacts Master Configuration')}
            </h1>
            <p className="text-muted-foreground text-sm">
              Configure master details, parameters, and entities for contact records.
            </p>
          </div>
        </div>

        {/* Tabbed setup dashboard */}
        <Card className="border-border/60 bg-card/90 p-6 shadow-xl backdrop-blur-sm">
          <Tabs defaultValue="titles" className="w-full">
            <TabsList className="bg-muted/40 mb-6 grid h-auto grid-cols-2 gap-2 rounded-lg p-1 md:grid-cols-4 lg:grid-cols-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-background data-[state=active]:text-primary hover:bg-muted flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all data-[state=active]:shadow-sm"
                >
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => {
              const WindowComponent = tab.component;
              return (
                <TabsContent
                  key={tab.id}
                  value={tab.id}
                  className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
                >
                  <div className="bg-background border-border/40 rounded-lg border p-4">
                    <WindowComponent />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
