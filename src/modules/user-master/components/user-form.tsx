'use client';

import * as React from 'react';
import { User, UserRound, Shield, Lock, Phone, Settings2, PlusCircle, Eye, HelpCircle, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCreateInput, UserUpdateInput } from '../types';

interface UserFormProps {
  mode: 'view' | 'add' | 'edit';
  formData: UserCreateInput | UserUpdateInput;
  setFormData: (data: UserCreateInput | UserUpdateInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({
  mode,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isLoading = false,
}: UserFormProps) {
  const isEditing = mode === 'add' || mode === 'edit';
  const isPasswordRequired = mode === 'add';

  const salutationOptions = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Miss'];

  const employeeOptions = [
    { id: '1', name: 'Employee 1' },
    { id: '2', name: 'Employee 2' },
    { id: '3', name: 'Employee 3' },
    { id: '4', name: 'Employee 4' },
    { id: '5', name: 'Employee 5' },
  ];

  const securityQuestions = [
    'What is your pet\'s name?',
    'What is your mother\'s maiden name?',
    'What was the name of your first school?',
    'What city were you born in?',
    'What is your favorite color?',
    'What is the name of your first pet?',
    'What is your favorite movie?',
    'What is your favorite food?',
  ];

  const handleChange = (field: keyof UserCreateInput, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="from-card to-card/70 border-border/60 shadow-foreground/[0.02] relative flex h-full min-h-0 flex-col rounded-xl border bg-gradient-to-b p-6 shadow-md transition-all duration-300 z-10">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-foreground text-[10px] font-bold tracking-widest uppercase">
          User Form
        </span>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium shadow-2xs transition-all duration-300 select-none ${
            mode === 'view'
              ? 'border-blue-500/10 bg-blue-500/5 text-blue-600 dark:text-blue-400'
              : mode === 'add'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }`}
        >
          {mode === 'view' ? (
            <>
              <Eye className="h-3 w-3" />
              <span>View Mode</span>
            </>
          ) : mode === 'add' ? (
            <>
              <PlusCircle className="h-3 w-3 animate-pulse" />
              <span>Add Mode</span>
            </>
          ) : (
            <>
              <Settings2 className="h-3 w-3" />
              <span>Edit Mode</span>
            </>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Salutation */}
        <div className="space-y-1.5">
          <Label
            htmlFor="sal"
            className="text-foreground/80 flex items-center gap-1 text-xs font-semibold tracking-wide"
          >
            <User className="h-3 w-3" />
            Salutation
          </Label>
          <Select
            value={formData.sal || ''}
            onValueChange={(value) => handleChange('sal', value)}
            disabled={!isEditing}
          >
            <SelectTrigger className="border-border/80 bg-background/40 focus:bg-background shadow-3xs focus-visible:ring-primary/40 disabled:bg-muted/30 h-9.5 text-xs transition-all duration-200 focus-visible:ring-1 disabled:opacity-65">
              <SelectValue placeholder="Select salutation" />
            </SelectTrigger>
            <SelectContent>
              {salutationOptions.map((sal) => (
                <SelectItem key={sal} value={sal} className="text-xs">
                  {sal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <Label
            htmlFor="username"
            className="text-foreground/80 flex items-center gap-1 text-xs font-semibold tracking-wide"
          >
            <UserRound className="h-3 w-3" />
            Username {isEditing && <span className="text-destructive font-bold">*</span>}
          </Label>
          <Input
            id="username"
            value={formData.username || ''}
            onChange={(e) => handleChange('username', e.target.value)}
            disabled={!isEditing}
            maxLength={15}
            placeholder="Enter username (max 15 chars)"
            autoComplete="off"
            className="border-border/80 bg-background/40 focus:bg-background shadow-3xs focus-visible:ring-primary/40 disabled:bg-muted/30 h-9.5 text-xs transition-all duration-200 focus-visible:ring-1 disabled:opacity-65"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-foreground/80 flex items-center gap-1 text-xs font-semibold tracking-wide"
          >
            <Lock className="h-3 w-3" />
            Password {isPasswordRequired && <span className="text-destructive font-bold">*</span>}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            disabled={!isEditing}
            maxLength={10}
            placeholder={isPasswordRequired ? 'Enter password (max 10 chars)' : 'Leave blank to keep current'}
            autoComplete="new-password"
            className="border-border/80 bg-background/40 focus:bg-background shadow-3xs focus-visible:ring-primary/40 disabled:bg-muted/30 h-9.5 text-xs transition-all duration-200 focus-visible:ring-1 disabled:opacity-65"
          />
        </div>

        {/* Mobile */}
        <div className="space-y-1.5">
          <Label
            htmlFor="mobile"
            className="text-foreground/80 flex items-center gap-1 text-xs font-semibold tracking-wide"
          >
            <Phone className="h-3 w-3" />
            Mobile
          </Label>
          <Input
            id="mobile"
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            disabled={!isEditing}
            maxLength={20}
            placeholder="Enter mobile number"
            autoComplete="tel"
            className="border-border/80 bg-background/40 focus:bg-background shadow-3xs focus-visible:ring-primary/40 disabled:bg-muted/30 h-9.5 text-xs transition-all duration-200 focus-visible:ring-1 disabled:opacity-65"
          />
        </div>

        {/* Employee */}
        <div className="space-y-1.5">
          <Label
            htmlFor="fk_emp_id"
            className="text-foreground/80 flex items-center gap-1 text-xs font-semibold tracking-wide"
          >
            <Building2 className="h-3 w-3" />
            Employee
          </Label>
          <Select
            value={formData.fk_emp_id || ''}
            onValueChange={(value) => handleChange('fk_emp_id', value)}
            disabled={!isEditing}
          >
            <SelectTrigger className="border-border/80 bg-background/40 focus:bg-background shadow-3xs focus-visible:ring-primary/40 disabled:bg-muted/30 h-9.5 text-xs transition-all duration-200 focus-visible:ring-1 disabled:opacity-65">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employeeOptions.map((emp) => (
                <SelectItem key={emp.id} value={emp.id} className="text-xs">
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Security Question */}
        <div className="space-y-1.5">
          <Label
            htmlFor="security_question"
            className="text-foreground/80 flex items-center gap-1 text-xs font-semibold tracking-wide"
          >
            <HelpCircle className="h-3 w-3" />
            Security Question {isEditing && <span className="text-destructive font-bold">*</span>}
          </Label>
          <Select
            value={formData.security_question || ''}
            onValueChange={(value) => handleChange('security_question', value)}
            disabled={!isEditing}
          >
            <SelectTrigger className="border-border/80 bg-background/40 focus:bg-background shadow-3xs focus-visible:ring-primary/40 disabled:bg-muted/30 h-9.5 text-xs transition-all duration-200 focus-visible:ring-1 disabled:opacity-65">
              <SelectValue placeholder="Select security question" />
            </SelectTrigger>
            <SelectContent>
              {securityQuestions.map((question) => (
                <SelectItem key={question} value={question} className="text-xs">
                  {question}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Security Answer */}
        <div className="space-y-1.5">
          <Label
            htmlFor="answer"
            className="text-foreground/80 flex items-center gap-1 text-xs font-semibold tracking-wide"
          >
            <Shield className="h-3 w-3" />
            Security Answer {isEditing && <span className="text-destructive font-bold">*</span>}
          </Label>
          <Input
            id="answer"
            value={formData.answer || ''}
            onChange={(e) => handleChange('answer', e.target.value)}
            disabled={!isEditing}
            maxLength={50}
            placeholder="Enter security answer"
            autoComplete="off"
            className="border-border/80 bg-background/40 focus:bg-background shadow-3xs focus-visible:ring-primary/40 disabled:bg-muted/30 h-9.5 text-xs transition-all duration-200 focus-visible:ring-1 disabled:opacity-65"
          />
        </div>

        {/* Checkboxes */}
        {isEditing && (
          <div className="border-border/60 bg-muted/10 mt-4 flex flex-col gap-3 rounded-lg border p-4">
            <div className="border-border/40 flex items-center gap-1.5 border-b pb-2">
              <Settings2 className="text-foreground/60 h-3.5 w-3.5" />
              <span className="text-foreground text-[10px] font-bold tracking-wider uppercase">
                Permissions
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sys_defined"
                checked={formData.sys_defined || false}
                onCheckedChange={(checked) => handleChange('sys_defined', checked)}
                disabled={!isEditing}
              />
              <Label
                htmlFor="sys_defined"
                className="text-foreground/80 cursor-pointer text-xs font-medium"
              >
                System Defined
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="own_records"
                checked={formData.own_records || false}
                onCheckedChange={(checked) => handleChange('own_records', checked)}
                disabled={!isEditing}
              />
              <Label
                htmlFor="own_records"
                className="text-foreground/80 cursor-pointer text-xs font-medium"
              >
                Own Records
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="other_records"
                checked={formData.other_records || false}
                onCheckedChange={(checked) => handleChange('other_records', checked)}
                disabled={!isEditing}
              />
              <Label
                htmlFor="other_records"
                className="text-foreground/80 cursor-pointer text-xs font-medium"
              >
                Other Records
              </Label>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 h-9 rounded-md px-4 py-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : mode === 'add' ? 'Create User' : 'Update User'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="bg-muted hover:bg-muted/80 text-muted-foreground h-9 rounded-md px-4 py-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
