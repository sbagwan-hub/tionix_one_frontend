'use client';

import * as React from 'react';
import { OrganisationDto } from '../types';
import { ContactDetailsSection } from './form-sections/ContactDetailsSection';
import { DocumentsSection } from './form-sections/DocumentsSection';
import { OrganisationInfoSection } from './form-sections/OrganisationInfoSection';
import { ContactPersonsSection } from './form-sections/ContactPersonsSection';

interface OrganisationFormProps {
  formData: OrganisationDto;
  onInputChange: (field: string, value: any) => void;
  cities: any[];
  states: any[];
  countries: any[];
  categories: any[];
  individuals?: any[]; // To resolve contact persons
  disabled?: boolean;
  isRtl?: boolean;
}

export const OrganisationForm: React.FC<OrganisationFormProps> = ({
  formData,
  onInputChange,
  cities,
  states,
  countries,
  categories,
  individuals = [],
  disabled = false,
  isRtl = false,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* ── Left/Middle Column: Organisation Profile, Categories and Address ── */}
      <div className="space-y-4 lg:col-span-2">
        <OrganisationInfoSection
          formData={formData}
          onInputChange={onInputChange}
          cities={cities}
          states={states}
          countries={countries}
          categories={categories}
          disabled={disabled}
          isRtl={isRtl}
        />

        <ContactPersonsSection formData={formData} individuals={individuals} disabled={disabled} />
      </div>

      {/* ── Right Column: Contacts, References, Documents ── */}
      <div className="space-y-4">
        {/* Phone, Email, Mobile Sub-form */}
        <ContactDetailsSection
          contacts={formData.contacts || []}
          onInputChange={onInputChange}
          disabled={disabled}
        />

        {/* Document List Sub-form */}
        <DocumentsSection
          documents={formData.documents || []}
          onInputChange={onInputChange}
          disabled={disabled}
          folderName="organisation-docs"
        />
      </div>
    </div>
  );
};
