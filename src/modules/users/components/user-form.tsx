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
import { User as UserIcon, Lock, Mail, Phone, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { EmployeeLookup, EmailConfigLookup, SecurityQuestionLookup } from '../types';

interface UserFormProps {
  formData: {
    username: string;
    password?: string;
    answer?: string;
    fk_emp_id: number | null;
    fk_ec_id: number | null;
    mobile?: string;
  };
  onInputChange: (field: string, value: any) => void;
  isEditMode: boolean;
  employees: EmployeeLookup[];
  emailConfigs: EmailConfigLookup[];
  securityQuestions: SecurityQuestionLookup[];
  selectedQuestion: string;
  onQuestionChange: (value: string) => void;
  t: (key: string) => string;
  isRtl: boolean;
  disabled?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  formData,
  onInputChange,
  isEditMode,
  employees,
  emailConfigs,
  securityQuestions,
  selectedQuestion,
  onQuestionChange,
  t,
  isRtl,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
      {/* Username */}
      <FormInput
        label={t('username')}
        icon={UserIcon}
        value={formData.username}
        onChange={(e) => onInputChange('username', e.target.value)}
        placeholder={t('usernamePlaceholder')}
        className="h-9 rounded-sm"
        disabled={disabled}
      />

      {/* Password */}
      <div className="relative">
        <FormInput
          label={t('password')}
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          value={formData.password || ''}
          onChange={(e) => onInputChange('password', e.target.value)}
          placeholder={
            isEditMode ? 'Leave blank to keep current password' : t('passwordPlaceholder')
          }
          className="h-9 rounded-sm"
          disabled={disabled}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword((v) => !v)}
          className={`text-muted-foreground hover:text-foreground absolute z-20 cursor-pointer transition-colors ${
            isRtl ? 'left-3' : 'right-3'
          } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
          style={{ top: 'calc(50% + 8px)', transform: 'translateY(-50%)' }}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Security Question */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          {t('question')}
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
            <HelpCircle className="h-4 w-4" />
          </div>
          <Select value={selectedQuestion} onValueChange={onQuestionChange} disabled={disabled}>
            <SelectTrigger
              className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${
                isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'
              }`}
            >
              <SelectValue placeholder="Select a security question" />
            </SelectTrigger>
            <SelectContent>
              {securityQuestions.map((sq) => (
                <SelectItem key={sq.pk_question_id} value={sq.questions}>
                  {sq.questions}
                </SelectItem>
              ))}
              {securityQuestions.length === 0 && (
                <SelectItem value="What is your favorite food?">
                  What is your favorite food?
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Answer */}
      <FormInput
        label={t('answer')}
        icon={HelpCircle}
        value={formData.answer || ''}
        onChange={(e) => onInputChange('answer', e.target.value)}
        placeholder={t('answerPlaceholder')}
        className="h-9 rounded-sm"
        disabled={disabled}
      />

      {/* Linked Employee */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          {t('employee')}
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
            <UserIcon className="h-4 w-4" />
          </div>
          <Select
            value={formData.fk_emp_id ? String(formData.fk_emp_id) : 'none'}
            onValueChange={(val) =>
              onInputChange('fk_emp_id', val === 'none' ? null : parseInt(val, 10))
            }
            disabled={disabled}
          >
            <SelectTrigger
              className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${
                isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'
              }`}
            >
              <SelectValue placeholder={t('employeePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None / Unlinked</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.pk_emp_id} value={String(emp.pk_emp_id)}>
                  {emp.contact_name} ({emp.emp_code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          {t('email')}
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
            <Mail className="h-4 w-4" />
          </div>
          <Select
            value={formData.fk_ec_id ? String(formData.fk_ec_id) : 'none'}
            onValueChange={(val) =>
              onInputChange('fk_ec_id', val === 'none' ? null : parseInt(val, 10))
            }
            disabled={disabled}
          >
            <SelectTrigger
              className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${
                isRtl ? 'pr-9 pl-8' : 'pr-8 pl-9'
              }`}
            >
              <SelectValue placeholder={t('emailPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None / Unconfigured</SelectItem>
              {emailConfigs.map((ec) => (
                <SelectItem key={ec.pk_ec_id} value={String(ec.pk_ec_id)}>
                  {ec.from_email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile */}
      <FormInput
        label={t('mobile')}
        icon={Phone}
        value={formData.mobile || ''}
        onChange={(e) => onInputChange('mobile', e.target.value)}
        placeholder={t('mobilePlaceholder')}
        className="h-9 rounded-sm"
        disabled={disabled}
      />
    </div>
  );
};
