'use client';

import Toolbar from '@/components/shared/toolbar';
import PermissionTable from '@/components/user-rights/permissions-table';
import UserSelection from '@/components/user-rights/user-selection';
import {
  actionToolbar,
  moduleGroups,
  navigationToolbar,
  utilityToolbar,
} from '@/constants/permission.constants';

import { useState } from 'react';

export default function UserRights() {
  const [activeTab, setActiveTab] = useState('Masters');
  const [accessScope, setAccessScope] = useState('all');

  const tabs = ['Masters', 'Transactions', 'Reports', 'Others'];
  return (
    <div className="bg-background text-foreground h-full font-sans">
      <div className="flex h-full flex-col py-2">
        <div className="">
          <div className="">
            <Toolbar
              navigation={navigationToolbar}
              actions={actionToolbar}
              utilities={utilityToolbar}
            />
          </div>
          <UserSelection accessScope={accessScope} setAccessScope={setAccessScope} />
        </div>

        <div className="h-[calc(100vh-310px)] overflow-y-auto">
          <PermissionTable
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            modules={moduleGroups}
          />
        </div>
      </div>
    </div>
  );
}
