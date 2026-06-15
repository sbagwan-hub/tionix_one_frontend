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
import { User, Users, Heart, Calendar, GraduationCap } from 'lucide-react';
import { IndividualDto } from '../../types';

interface PersonalInfoSectionProps {
  formData: IndividualDto;
  onInputChange: (field: string, value: any) => void;
  titles: any[];
  qualifications: any[];
  disabled?: boolean;
  isRtl?: boolean;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  onInputChange,
  titles,
  qualifications,
  disabled = false,
  isRtl = false,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          Title
        </Label>
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
              className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'}`}
            >
              <SelectValue placeholder="Select Title" />
            </SelectTrigger>
            <SelectContent>
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
        label="Surname *"
        icon={User}
        value={formData.surname}
        onChange={(e) => onInputChange('surname', e.target.value)}
        placeholder="Surname"
        className="h-9 rounded-sm"
        disabled={disabled}
      />

      {/* Postfix */}
      <FormInput
        label="Postfix (if Duplicate)"
        icon={User}
        value={formData.postfix || ''}
        onChange={(e) => onInputChange('postfix', e.target.value)}
        placeholder="Postfix"
        className="h-9 rounded-sm"
        disabled={disabled}
      />

      {/* Date of Birth */}
      <FormInput
        label="Date of Birth"
        icon={Calendar}
        type="date"
        value={formData.dob ? formData.dob.split('T')[0] : ''}
        onChange={(e) => onInputChange('dob', e.target.value)}
        className="h-9 rounded-sm"
        disabled={disabled}
      />

      {/* Qualification */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
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
              className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'}`}
            >
              <SelectValue placeholder="Select Qualification" />
            </SelectTrigger>
            <SelectContent>
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
        <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          Gender *
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
            <Users className="h-4 w-4" />
          </div>
          <Select
            value={formData.male ? 'male' : 'female'}
            onValueChange={(val) => onInputChange('male', val === 'male')}
            disabled={disabled}
          >
            <SelectTrigger
              className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'}`}
            >
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Marital Status */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          Marital Status *
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
            <Heart className="h-4 w-4" />
          </div>
          <Select
            value={formData.married ? 'married' : 'unmarried'}
            onValueChange={(val) => onInputChange('married', val === 'married')}
            disabled={disabled}
          >
            <SelectTrigger
              className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'}`}
            >
              <SelectValue placeholder="Select Marital Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="unmarried">Unmarried</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
