'use client';

import * as React from 'react';
import { OrganisationDto } from '../types';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import {
  MapPin,
  Globe,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  Search,
  Loader2,
} from 'lucide-react';
import { ContactDetailsSection } from './form-sections/ContactDetailsSection';
import { DocumentsSection } from './form-sections/DocumentsSection';
import { useIndividual } from '../hooks/use-individual';
import { toast } from 'sonner';

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
  const toggleCategory = (catId: number) => {
    const current = formData.categoryIds || [];
    const updated = current.includes(catId)
      ? current.filter((id) => id !== catId)
      : [...current, catId];
    onInputChange('categoryIds', updated);
  };

  const [indSearch, setIndSearch] = React.useState('');
  const { update: updateIndividual } = useIndividual();

  // Filter individuals who belong to this organisation
  const contactPersons = React.useMemo(() => {
    if (!formData.pk_cont_id) return [];
    return individuals.filter((ind: any) => Number(ind.fk_org_id) === Number(formData.pk_cont_id));
  }, [individuals, formData.pk_cont_id]);

  const filteredIndividuals = React.useMemo(() => {
    const list = individuals.filter((ind: any) => {
      const isAssociatedWithThisOrg =
        formData.pk_cont_id && Number(ind.fk_org_id) === Number(formData.pk_cont_id);
      const hasNoOrg = !ind.fk_org_id;
      return isAssociatedWithThisOrg || hasNoOrg;
    });

    if (!indSearch) return list;
    return list.filter((ind: any) => {
      const fullName =
        `${ind.first_name || ''} ${ind.middle_name || ''} ${ind.surname || ''}`.toLowerCase();
      return fullName.includes(indSearch.toLowerCase());
    });
  }, [individuals, indSearch, formData.pk_cont_id]);

  const handleToggleAssociation = async (ind: any, isChecked: boolean) => {
    if (!formData.pk_cont_id) {
      toast.error('Please save the organisation first before associating contact persons.');
      return;
    }
    try {
      const orgId = isChecked ? Number(formData.pk_cont_id) : null;
      await updateIndividual.mutateAsync({
        id: String(ind.pk_ind_id),
        data: { fk_org_id: orgId },
      });
    } catch (e: any) {
      toast.error(`Failed to update association: ${e.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* ── Left/Middle Column: Organisation Profile, Categories and Address ── */}
      <div className="space-y-4 lg:col-span-2">
        {/* General Details Panel */}
        <div className="border-border/80 bg-background/50 space-y-4 rounded-sm border p-4">
          <Label className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase">
            Organisation Profile
          </Label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <FormInput
                label="Name *"
                value={formData.contact_name || ''}
                onChange={(e) => onInputChange('contact_name', e.target.value)}
                placeholder="Organisation Name"
                className="h-9 rounded-sm"
                disabled={disabled}
              />
            </div>
            <div>
              <FormInput
                label="Postfix (if Duplicate)"
                value={formData.postfix || ''}
                onChange={(e) => onInputChange('postfix', e.target.value)}
                placeholder="Postfix"
                className="h-9 rounded-sm"
                disabled={disabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Category checklist */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <Label className="text-foreground text-[11px] font-semibold tracking-wider">
                Category
              </Label>
              <div className="border-border/80 bg-background/60 h-[150px] space-y-2 overflow-y-auto rounded-sm border p-2.5">
                {categories.length === 0 ? (
                  <p className="text-muted-foreground text-[10px] italic">No categories loaded</p>
                ) : (
                  categories.map((cat) => (
                    <label
                      key={cat.pk_cat_id}
                      className="hover:bg-muted/40 flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-[11px] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(formData.categoryIds || []).includes(cat.pk_cat_id)}
                        onChange={() => toggleCategory(cat.pk_cat_id)}
                        disabled={disabled}
                        className="text-primary border-input focus:ring-primary h-3.5 w-3.5 rounded"
                      />
                      <span className="text-foreground/90 truncate select-none">
                        {cat.category}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Address textarea */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label className="text-foreground text-[11px] font-semibold tracking-wider">
                Address
              </Label>
              <Textarea
                disabled={disabled}
                value={formData.address || ''}
                onChange={(e) => onInputChange('address', e.target.value)}
                placeholder="Physical address"
                className="bg-background/50 focus:bg-background h-[150px] min-h-[150px] resize-none rounded-sm text-xs transition-all"
              />
            </div>
          </div>

          {/* Location details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* City */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-foreground text-[11px] font-semibold tracking-wider">
                City
              </Label>
              <div className="relative">
                <div className="text-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                </div>
                <Select
                  value={formData.fk_city_id ? String(formData.fk_city_id) : 'none'}
                  onValueChange={(val) => {
                    const cityId = val === 'none' ? null : parseInt(val, 10);
                    onInputChange('fk_city_id', cityId);
                    if (cityId) {
                      const selectedCity = cities.find((c) => c.pk_city_id === cityId);
                      if (selectedCity) {
                        if (selectedCity.fk_state_id) {
                          onInputChange('fk_state_id', selectedCity.fk_state_id);
                        }
                        if (selectedCity.fk_ctry_id) {
                          onInputChange('fk_ctry_id', selectedCity.fk_ctry_id);
                        }
                      }
                    }
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger
                    className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
                  >
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="none">None</SelectItem>
                    {cities.map((c) => (
                      <SelectItem key={c.pk_city_id} value={String(c.pk_city_id)}>
                        {c.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* State */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-foreground text-[11px] font-semibold tracking-wider">
                State
              </Label>
              <div className="relative">
                <div className="text-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                </div>
                <Select
                  value={formData.fk_state_id ? String(formData.fk_state_id) : 'none'}
                  onValueChange={(val) =>
                    onInputChange('fk_state_id', val === 'none' ? null : parseInt(val, 10))
                  }
                  disabled={disabled}
                >
                  <SelectTrigger
                    className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
                  >
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="none">None</SelectItem>
                    {states.map((s) => (
                      <SelectItem key={s.pk_state_id} value={String(s.pk_state_id)}>
                        {s.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Region / Pincode */}
            <div className="flex flex-col gap-1.5">
              <FormInput
                label="Region"
                value={formData.region || ''}
                onChange={(e) => onInputChange('region', e.target.value)}
                placeholder="Region"
                className="h-9 rounded-sm"
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FormInput
                label="Pincode"
                value={formData.pincode || ''}
                onChange={(e) => onInputChange('pincode', e.target.value)}
                placeholder="Pincode"
                className="h-9 rounded-sm"
                disabled={disabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-foreground text-[11px] font-semibold tracking-wider">
                Country
              </Label>
              <div className="relative">
                <div className="text-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
                  <Globe className="text-muted-foreground h-4 w-4" />
                </div>
                <Select
                  value={formData.fk_ctry_id ? String(formData.fk_ctry_id) : 'none'}
                  onValueChange={(val) =>
                    onInputChange('fk_ctry_id', val === 'none' ? null : parseInt(val, 10))
                  }
                  disabled={disabled}
                >
                  <SelectTrigger
                    className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
                  >
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="none">None</SelectItem>
                    {countries.map((c) => (
                      <SelectItem key={c.pk_ctry_id} value={String(c.pk_ctry_id)}>
                        {c.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Person(s) Table */}
        <div className="border-border/80 bg-background/50 space-y-3 rounded-sm border p-4">
          <div className="flex items-center justify-between gap-4">
            <Label className="text-muted-foreground block text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase">
              Contact Person(s) ({contactPersons.length})
            </Label>
            <div className="relative w-48">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search individuals..."
                value={indSearch}
                onChange={(e) => setIndSearch(e.target.value)}
                disabled={disabled}
                className="border-input bg-background/50 placeholder:text-muted-foreground focus-visible:ring-ring h-7 w-full rounded-sm border pr-3 pl-8 text-[11px] focus-visible:ring-1 focus-visible:outline-none"
              />
            </div>
          </div>

          <div className="border-border/80 bg-background/40 max-h-[220px] overflow-y-auto rounded-sm border">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-muted/80 text-muted-foreground sticky top-0 z-10 border-b font-semibold">
                <tr>
                  <th className="w-12 px-3 py-2 text-center">Sel</th>
                  <th className="px-3 py-2">Contact Person(s)</th>
                  <th className="px-3 py-2">Department</th>
                  <th className="px-3 py-2">Designation</th>
                  <th className="px-3 py-2">Phone / Mobile</th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {filteredIndividuals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-muted-foreground py-4 text-center italic">
                      No individuals found.
                    </td>
                  </tr>
                ) : (
                  filteredIndividuals.map((ind: any) => {
                    const isAssociated = Number(ind.fk_org_id) === Number(formData.pk_cont_id);
                    const isUpdating =
                      updateIndividual.isPending &&
                      updateIndividual.variables?.id === String(ind.pk_ind_id);
                    return (
                      <tr
                        key={ind.pk_ind_id}
                        className={`hover:bg-muted/20 ${isAssociated ? 'bg-primary/5' : ''}`}
                      >
                        <td className="px-3 py-2 text-center">
                          {isUpdating ? (
                            <Loader2 className="text-primary mx-auto h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <input
                              type="checkbox"
                              checked={isAssociated}
                              disabled={disabled || !formData.pk_cont_id}
                              onChange={(e) => handleToggleAssociation(ind, e.target.checked)}
                              className="text-primary border-input focus:ring-primary h-3.5 w-3.5 cursor-pointer rounded disabled:cursor-not-allowed"
                            />
                          )}
                        </td>
                        <td className="px-3 py-2 font-medium">
                          {`${ind.first_name || ''} ${ind.surname || ''}`}
                        </td>
                        <td className="px-3 py-2">{ind.department_name || '-'}</td>
                        <td className="px-3 py-2">{ind.designation_name || '-'}</td>
                        <td className="px-3 py-2">{ind.contacts?.[0]?.contact || '-'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {!formData.pk_cont_id && (
            <p className="text-[10px] font-medium text-amber-500">
              * Please save the organisation first to enable contact person association.
            </p>
          )}
        </div>
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
