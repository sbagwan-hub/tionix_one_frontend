'use client';

import * as React from 'react';
import { OrganisationDto } from '../../types';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OrganisationInfoSectionProps {
  formData: OrganisationDto;
  onInputChange: (field: string, value: any) => void;
  cities: any[];
  states: any[];
  countries: any[];
  categories: any[];
  disabled?: boolean;
  isRtl?: boolean;
}

export const OrganisationInfoSection: React.FC<OrganisationInfoSectionProps> = ({
  formData,
  onInputChange,
  cities,
  states,
  countries,
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
    <div className="border-border/80 bg-background/50 space-y-4 rounded-sm border p-4">
      <Label className="text-muted-foreground text-xxs block font-semibold tracking-wider uppercase">
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
              <p className="text-muted-foreground text-xxs italic">No categories loaded</p>
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
                  <span className="text-foreground/90 truncate">{cat.category}</span>
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
          <Label className="text-foreground text-[11px] font-semibold tracking-wider">City</Label>
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
          <Label className="text-foreground text-[11px] font-semibold tracking-wider">State</Label>
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
  );
};
