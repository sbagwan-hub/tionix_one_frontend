'use client';

import * as React from 'react';
import { IndividualDto } from '../types';
import { PersonalInfoSection } from './form-sections/PersonalInfoSection';
import { WorkInfoSection } from './form-sections/WorkInfoSection';
import { AddressSection } from './form-sections/AddressSection';
import { CategoriesSection } from './form-sections/CategoriesSection';
import { PhotoSection } from './form-sections/PhotoSection';
import { ContactDetailsSection } from './form-sections/ContactDetailsSection';

interface IndividualFormProps {
  formData: IndividualDto;
  onInputChange: (field: string, value: any) => void;
  titles: any[];
  qualifications: any[];
  departments: any[];
  designations: any[];
  organizations: any[];
  cities: any[];
  states: any[];
  countries: any[];
  genders: any[];
  maritalStatuses: any[];
  individuals: any[];
  categories: any[];
  disabled?: boolean;
  isRtl?: boolean;
}

export const IndividualForm: React.FC<IndividualFormProps> = ({
  formData,
  onInputChange,
  titles,
  qualifications,
  departments,
  designations,
  organizations,
  cities,
  states,
  countries,
  genders,
  maritalStatuses,
  individuals,
  categories,
  disabled = false,
  isRtl = false,
}) => {
  const toggleCategory = (catId: number) => {
    const current = formData.categoryIds || [];
    const updated = current.includes(catId)
      ? current.filter((id) => id !== catId)
      : [...current, catId];
    onInputChange('categoryIds', updated);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* ── Left Column: Personal, Work, and Address Details ── */}
      <div className="space-y-4 lg:col-span-2">
        <PersonalInfoSection
          formData={formData}
          onInputChange={onInputChange}
          titles={titles}
          qualifications={qualifications}
          genders={genders}
          maritalStatuses={maritalStatuses}
          individuals={individuals}
          disabled={disabled}
          isRtl={isRtl}
        />
        <WorkInfoSection
          formData={formData}
          onInputChange={onInputChange}
          organizations={organizations}
          departments={departments}
          designations={designations}
          disabled={disabled}
          isRtl={isRtl}
        />
        <AddressSection
          formData={formData}
          onInputChange={onInputChange}
          cities={cities}
          states={states}
          countries={countries}
          disabled={disabled}
          isRtl={isRtl}
        />
      </div>

      {/* ── Right Column: Categories Checkbox list, Photograph, Detail Sub-tables ── */}
      <div className="space-y-4">
        <CategoriesSection
          categories={categories}
          selectedCategories={formData.categoryIds || []}
          toggleCategory={toggleCategory}
          disabled={disabled}
        />
        <PhotoSection photo={formData.photo} onInputChange={onInputChange} disabled={disabled} />
        <ContactDetailsSection
          contacts={formData.contacts || []}
          onInputChange={onInputChange}
          disabled={disabled}
          defaultDepartment={
            departments.find((d: any) => d.pk_dep_id === formData.fk_dep_id)?.department || ''
          }
        />
      </div>
    </div>
  );
};
