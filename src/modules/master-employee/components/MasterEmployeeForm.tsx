'use client';

import * as React from 'react';
import { EmployeeRecord } from '../types';
import { GeneralProfileSection } from './GeneralProfileSection';
import { WorkAccountsSection } from './WorkAccountsSection';
import { MetricsPhotoSection } from './MetricsPhotoSection';
import { FamilyRelativesSection } from './FamilyRelativesSection';
import { DemographicsSection } from './DemographicsSection';
import { PoliceStationSection } from './PoliceStationSection';
import { SecurityLoginSection } from './SecurityLoginSection';
import { ReferencesSection } from './ReferencesSection';
import { CertificatesLicensesSection } from './CertificatesLicensesSection';

interface MasterEmployeeFormProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  isEditMode: boolean;
  disabled?: boolean;
}

export const MasterEmployeeForm: React.FC<MasterEmployeeFormProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  return (
    <div className="w-full flex flex-col gap-4 pb-4 font-sans h-auto max-h-[calc(100vh-270px)] overflow-y-auto pr-1 text-[14px] [&_label]:text-[13px] [&_label]:!normal-case [&_label]:!tracking-normal [&_input]:text-[14px] [&_textarea]:text-[14px] [&_button]:text-[14px] [&_select]:text-[14px] [&_h3]:text-[15.5px] [&_h4]:text-[13.5px]">
      {/* Card 1: Profile, Work & Accounts */}
      <div className="flex flex-col gap-2 p-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:border-r xl:border-border/10 xl:pr-4 h-full">
            <GeneralProfileSection
              formData={formData}
              onInputChange={onInputChange}
              disabled={disabled}
            />
          </div>
          <div className="xl:border-r xl:border-border/10 xl:px-4 h-full">
            <WorkAccountsSection
              formData={formData}
              onInputChange={onInputChange}
              disabled={disabled}
            />
          </div>
          <div className="xl:pl-4 h-full">
            <MetricsPhotoSection
              formData={formData}
              onInputChange={onInputChange}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="border-t border-border/10 pt-4">
          <FamilyRelativesSection
            formData={formData}
            onInputChange={onInputChange}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Card 2: Demographics, Security, References & Certificates */}
      <div className="flex flex-col gap-4 p-4">
        {/* Upper Row (3 Columns) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:border-r xl:border-border/10 xl:pr-4 h-full">
            <DemographicsSection
              formData={formData}
              onInputChange={onInputChange}
              disabled={disabled}
            />
          </div>
          <div className="xl:border-r xl:border-border/10 xl:px-4 h-full">
            <PoliceStationSection
              formData={formData}
              onInputChange={onInputChange}
              disabled={disabled}
            />
          </div>
          <div className="xl:pl-4 h-full">
            <SecurityLoginSection
              formData={formData}
              onInputChange={onInputChange}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Lower Row (2 Columns) */}
        <div className="border-t border-border/10 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:border-r lg:border-border/10 lg:pr-4 h-full">
              <ReferencesSection
                formData={formData}
                onInputChange={onInputChange}
                disabled={disabled}
              />
            </div>
            <div className="lg:pl-4 h-full">
              <CertificatesLicensesSection
                formData={formData}
                onInputChange={onInputChange}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
