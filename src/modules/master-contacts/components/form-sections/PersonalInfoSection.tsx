'use client';

import * as React from 'react';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Users, Heart, Calendar, GraduationCap, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { IndividualDto } from '../../types';

interface PersonalInfoSectionProps {
  formData: IndividualDto;
  onInputChange: (field: string, value: any) => void;
  titles: any[];
  qualifications: any[];
  genders: any[];
  maritalStatuses: any[];
  individuals: any[];
  disabled?: boolean;
  isRtl?: boolean;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  onInputChange,
  titles,
  qualifications,
  genders,
  maritalStatuses,
  individuals,
  disabled = false,
  isRtl = false,
}) => {
  const spouseOptions = React.useMemo(() => {
    return (individuals || []).filter((ind) => ind.pk_ind_id !== formData.pk_ind_id);
  }, [individuals, formData.pk_ind_id]);
  return (
    <div className="border-border/80 bg-background/50 space-y-4 rounded-sm border p-4">
      <Label className="text-muted-foreground text-xxs block font-semibold tracking-wider uppercase">
        Personal Information
      </Label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">Title</Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <User className="h-4 w-4" />
            </div>
            <Select
              value={formData.fk_tit_id ? String(formData.fk_tit_id) : 'none'}
              onValueChange={(val) =>
                onInputChange('fk_tit_id', val === 'none' ? null : parseInt(val, 10))
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
              >
                <SelectValue placeholder="Select Title" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="none">None</SelectItem>
                {titles.map((t) => (
                  <SelectItem key={t.pk_tit_id} value={String(t.pk_tit_id)}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* First Name */}
        <FormInput
          label="First Name *"
          icon={User}
          value={formData.first_name}
          onChange={(e) => onInputChange('first_name', e.target.value)}
          placeholder="First Name"
          className="h-9 rounded-sm"
          disabled={disabled}
        />

        {/* Middle Name */}
        <FormInput
          label="Middle Name"
          icon={User}
          value={formData.middle_name || ''}
          onChange={(e) => onInputChange('middle_name', e.target.value)}
          placeholder="Middle Name"
          className="h-9 rounded-sm"
          disabled={disabled}
        />

        {/* Surname */}
        <FormInput
          label={'Surname *'}
          icon={User}
          value={formData.surname}
          onChange={(e) => onInputChange('surname', e.target.value)}
          placeholder="Surname"
          className="h-9 rounded-sm"
          disabled={disabled}
        />

        {/* Postfix */}
        <FormInput
          label={'Postfix (if Duplicate)'}
          icon={User}
          value={formData.postfix || ''}
          onChange={(e) => onInputChange('postfix', e.target.value)}
          placeholder="Postfix"
          className="h-9 rounded-sm"
          disabled={disabled}
        />

        {/* Date of Birth */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">
            Date of Birth
          </Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <Calendar className="h-4 w-4" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  className={`border-border bg-background/50 hover:bg-accent hover:text-accent-foreground focus:bg-background flex h-9 w-full cursor-pointer items-center justify-between rounded-sm border text-xs transition-all ${isRtl ? 'pr-9 pl-3 text-right' : 'pr-3 pl-9 text-left'} ${!formData.dob ? 'text-muted-foreground' : ''}`}
                >
                  <span>
                    {formData.dob ? format(new Date(formData.dob), 'PPP') : 'Pick Date of Birth'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={formData.dob ? new Date(formData.dob) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const today = new Date();
                      let age = today.getFullYear() - date.getFullYear();
                      const m = today.getMonth() - date.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                        age--;
                      }
                      if (age < 18) {
                        toast.error('Individual must be at least 18 years old.');
                        onInputChange('dob', null);
                        return;
                      }
                    }
                    onInputChange('dob', date ? format(date, 'yyyy-MM-dd') : null);
                  }}
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Qualification */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">
            Qualification
          </Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <GraduationCap className="h-4 w-4" />
            </div>
            <Select
              value={formData.fk_qual_id ? String(formData.fk_qual_id) : 'none'}
              onValueChange={(val) =>
                onInputChange('fk_qual_id', val === 'none' ? null : parseInt(val, 10))
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
              >
                <SelectValue placeholder="Select Qualification" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="none">None</SelectItem>
                {qualifications.map((q) => (
                  <SelectItem key={q.pk_qua_id} value={String(q.pk_qua_id)}>
                    {q.qualification}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">
            Gender *
          </Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <Users className="h-4 w-4" />
            </div>
            <Select
              value={formData.gender || 'male'}
              onValueChange={(val) => onInputChange('gender', val)}
              disabled={disabled}
            >
              <SelectTrigger
                className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
              >
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                {genders.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Marital Status */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">
            Marital Status *
          </Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <Heart className="h-4 w-4" />
            </div>
            <Select
              value={formData.marital_status || 'single'}
              onValueChange={(val) => onInputChange('marital_status', val)}
              disabled={disabled}
            >
              <SelectTrigger
                className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
              >
                <SelectValue placeholder="Select Marital Status" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                {maritalStatuses.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Spouse */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">Spouse</Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <User className="h-4 w-4" />
            </div>
            <Select
              value={formData.fk_spo_id ? String(formData.fk_spo_id) : 'none'}
              onValueChange={(val) =>
                onInputChange('fk_spo_id', val === 'none' ? null : Number(val))
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
              >
                <SelectValue placeholder="Select Spouse" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="none">None</SelectItem>
                {spouseOptions.map((ind) => {
                  const fullName = `${ind.first_name} ${ind.middle_name || ''} ${ind.surname}`
                    .trim()
                    .replace(/\s+/g, ' ');
                  return (
                    <SelectItem key={ind.pk_ind_id} value={String(ind.pk_ind_id)}>
                      {fullName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
