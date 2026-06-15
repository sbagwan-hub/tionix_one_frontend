'use client';

import * as React from 'react';
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
import { MapPin, Globe } from 'lucide-react';
import { IndividualDto } from '../../types';

interface AddressSectionProps {
  formData: IndividualDto;
  onInputChange: (field: string, value: any) => void;
  cities: any[];
  states: any[];
  countries: any[];
  disabled?: boolean;
  isRtl?: boolean;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  formData,
  onInputChange,
  cities,
  states,
  countries,
  disabled = false,
  isRtl = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Resident Address */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-foreground text-[10px] font-semibold tracking-wider">
          Resident Address
        </Label>
        <Textarea
          disabled={disabled}
          value={formData.address || ''}
          onChange={(e) => onInputChange('address', e.target.value)}
          placeholder="Resident Address"
          className="bg-background/50 focus:bg-background min-h-16 resize-none rounded-sm text-xs transition-all"
        />
      </div>

      {/* Location Dropdowns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* City */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[10px] font-semibold tracking-wider">City</Label>
          <div className="relative">
            <div className="text-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <MapPin className="h-4 w-4" />
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
          <Label className="text-foreground text-[10px] font-semibold tracking-wider">State</Label>
          <div className="relative">
            <div className="text-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <MapPin className="h-4 w-4" />
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
        <div className="grid grid-cols-2 gap-2">
          <FormInput
            label="Region"
            value={formData.region || ''}
            onChange={(e) => onInputChange('region', e.target.value)}
            placeholder="Region"
            className="h-9 rounded-sm"
            disabled={disabled}
          />
          <FormInput
            label="Pincode"
            value={formData.pincode || ''}
            onChange={(e) => onInputChange('pincode', e.target.value)}
            placeholder="Pincode"
            className="h-9 rounded-sm"
            disabled={disabled}
          />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[10px] font-semibold tracking-wider">
            Country
          </Label>
          <div className="relative">
            <div className="text-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <Globe className="h-4 w-4" />
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
