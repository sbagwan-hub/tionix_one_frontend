'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  User,
  GraduationCap,
  Heart,
  Layers,
  Building2,
  Briefcase,
  MapPin,
  Home,
  Map,
  Locate,
  Settings2,
} from 'lucide-react';

import { TitleWindow } from '@/modules/master-contacts/components/TitleWindow';
import { QualificationWindow } from '@/modules/master-contacts/components/QualificationWindow';
import { RelationshipWindow } from '@/modules/master-contacts/components/RelationshipWindow';
import { CategoryWindow } from '@/modules/master-contacts/components/CategoryWindow';
import { DepartmentWindow } from '@/modules/master-contacts/components/DepartmentWindow';
import { DesignationWindow } from '@/modules/master-contacts/components/DesignationWindow';
import { CityWindow } from '@/modules/master-contacts/components/CityWindow';
import { AddressWindow } from '@/modules/master-contacts/components/AddressWindow';
import { StateWindow } from '@/modules/master-contacts/components/StateWindow';
import { RegionWindow } from '@/modules/master-contacts/components/RegionWindow';

export default function ContactsDashboardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState('titles');

  const tabs = [
    { id: 'titles', label: t('titles', 'Titles'), icon: User, component: TitleWindow },
    {
      id: 'qualifications',
      label: t('qualification', 'Qualifications'),
      icon: GraduationCap,
      component: QualificationWindow,
    },
    {
      id: 'relationships',
      label: t('relationship', 'Relationships'),
      icon: Heart,
      component: RelationshipWindow,
    },
    {
      id: 'categories',
      label: t('productCategory', 'Categories'),
      icon: Layers,
      component: CategoryWindow,
    },
    {
      id: 'departments',
      label: t('department', 'Departments'),
      icon: Building2,
      component: DepartmentWindow,
    },
    {
      id: 'designations',
      label: t('designation', 'Designations'),
      icon: Briefcase,
      component: DesignationWindow,
    },
    { id: 'cities', label: t('city', 'Cities'), icon: MapPin, component: CityWindow },
    { id: 'states', label: t('state', 'States'), icon: Map, component: StateWindow },
    { id: 'regions', label: t('region', 'Regions'), icon: Locate, component: RegionWindow },
    { id: 'addresses', label: t('address', 'Addresses'), icon: Home, component: AddressWindow },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const WindowComponent = currentTab.component;

  return (
    <div className="bg-muted/20 selection:bg-primary/10 min-h-screen antialiased">
      <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Modern Split View Grid */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Navigation Control Column */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:col-span-3">
            <Card className="border-border/50 bg-card/70 border p-2.5 shadow-sm backdrop-blur-md">
              <nav className="space-y-0.5" aria-label="Configuration settings tabs">
                <div className="flex items-center gap-2 px-3 pt-2 pb-3">
                  <Settings2 className="text-muted-foreground/80 h-3.5 w-3.5" />
                  <p className="text-muted-foreground/90 text-[10px] font-bold tracking-wider uppercase">
                    Configurations
                  </p>
                </div>

                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'group focus-visible:ring-primary/20 relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all duration-200 outline-none focus-visible:ring-2',
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground/90 hover:bg-muted/80 hover:text-foreground',
                      )}
                    >
                      {/* Active Side Left Stripe Indicator */}
                      <span
                        className={cn(
                          'bg-primary absolute top-2.5 bottom-2.5 left-0 w-0.5 rounded-r-full opacity-0 transition-all duration-200',
                          isActive && 'opacity-100',
                        )}
                      />

                      <TabIcon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground/60 group-hover:text-muted-foreground',
                        )}
                      />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          {/* Dynamic Sandboxed Master Component Viewport Canvas */}
          <main className="bg-card overflow-hidden transition-all duration-300 lg:col-span-9">
            <WindowComponent />
          </main>
        </div>
      </div>
    </div>
  );
}
