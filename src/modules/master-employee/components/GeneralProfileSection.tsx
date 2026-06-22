'use client';

import * as React from 'react';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Paperclip, Sparkles, UploadCloud, X, Eye } from 'lucide-react';
import { useMasterContacts } from '@/modules/master-contacts/hooks/useMasterContacts';
import { useNextEmpCode } from '../hooks/useMasterEmployee';
import { toast } from 'sonner';
import { EmployeeRecord } from '../types';
import { useWindowStore } from '@/stores/window-store';
import { DatePicker } from '@/components/common/date-picker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getFileUrl, validateClientFile, masterEmployeeApi } from '../services';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const GeneralProfileSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  const qualificationsQuery = useMasterContacts('qualifications');
  const departmentsQuery = useMasterContacts('departments');
  const designationsQuery = useMasterContacts('designations');
  const openWindow = useWindowStore((state) => state.openWindow);

  const nextCodeQuery = useNextEmpCode(false);

  const maxDob = React.useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  }, []);

  const handleGenerateCode = async () => {
    try {
      const res = await nextCodeQuery.refetch();
      if (res.data) {
        onInputChange('emp_code', res.data);
        toast.success(`Generated code: ${res.data}`);
      }
    } catch (err) {
      toast.error('Failed to generate code');
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand border-b border-border/20 pb-1.5">
        General Profile
      </h3>
      <div className="flex flex-col gap-3.5 flex-1 justify-between">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1 col-span-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Emp Code *
            </Label>
            <div className="relative flex items-center w-full">
              <Input
                value={formData.emp_code || ''}
                onChange={(e) => onInputChange('emp_code', e.target.value)}
                placeholder="e.g. EMP001"
                className="h-9 pr-9 text-sm rounded-sm w-full bg-background/50"
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1.5 h-6 w-6 rounded-sm text-brand hover:bg-brand/10 disabled:opacity-50"
                disabled={disabled}
                onClick={handleGenerateCode}
                title="Auto-generate Code"
              >
                <Sparkles className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Full Name *
            </Label>
            <Input
              value={formData.employee || ''}
              onChange={(e) => onInputChange('employee', e.target.value)}
              placeholder="Enter full name"
              className="h-9 text-sm rounded-sm"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="Date of Birth"
            value={formData.dob ? formData.dob.slice(0, 10) : ''}
            onChange={(val) => onInputChange('dob', val)}
            disabled={disabled}
            disabledDates={(date) => {
              const eighteenYearsAgo = new Date();
              eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
              eighteenYearsAgo.setHours(23, 59, 59, 999);
              return date > eighteenYearsAgo;
            }}
          />
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Qualification
            </Label>
            <div className="flex gap-1.5">
              <div className="flex-1 min-w-0">
                <Select
                  value={formData.fk_qual_id ? String(formData.fk_qual_id) : 'none'}
                  onValueChange={(val) => onInputChange('fk_qual_id', val === 'none' ? null : parseInt(val, 10))}
                  disabled={disabled}
                >
                  <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="none">None</SelectItem>
                    {(qualificationsQuery.list.data || []).map((q: any) => (
                      <SelectItem key={q.pk_qua_id} value={String(q.pk_qua_id)}>
                        {q.qualification}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <TooltipProvider>
                  {formData.cv_copy ? (
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-brand hover:bg-brand/10 rounded-sm cursor-pointer shrink-0"
                            onClick={() => {
                              try {
                                const newWindow = window.open();
                                if (newWindow) {
                                  newWindow.document.write(
                                    `<iframe src="${getFileUrl(formData.cv_copy ?? null)}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                                  );
                                }
                              } catch (e) {
                                toast.error('Failed to open document preview.');
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Document</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-sm cursor-pointer shrink-0"
                            onClick={() => {
                              onInputChange('cv_copy', '');
                              toast.success('Qualification document removed.');
                            }}
                            disabled={disabled}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Document</TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="qualification-upload-input"
                        className="hidden"
                        disabled={disabled}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const validation = validateClientFile(file);
                            if (!validation.valid) {
                              toast.error(validation.error || 'Invalid file');
                              return;
                            }

                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              try {
                                const result = await masterEmployeeApi.uploadFile(
                                  reader.result as string,
                                  file.name,
                                  'emp'
                                );
                                onInputChange('cv_copy', result.url);
                                toast.success(`${file.name} uploaded successfully.`);
                              } catch (err) {
                                toast.error('Failed to upload qualification document');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-sm flex items-center justify-center cursor-pointer"
                            disabled={disabled}
                            onClick={() => document.getElementById('qualification-upload-input')?.click()}
                          >
                            <UploadCloud className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Attach Document</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Gender *
            </Label>
            <Select
              value={formData.gender || 'Male'}
              onValueChange={(val) => onInputChange('gender', val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="LGBT">LGBT</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Marital Status *
            </Label>
            <Select
              value={formData.marital_status || 'Single'}
              onValueChange={(val) => {
                onInputChange('marital_status', val);
                if (!['Married', 'Engaged', 'Livein'].includes(val)) {
                  onInputChange('anni', null);
                }
              }}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
                <SelectItem value="Separated">Separated</SelectItem>
                <SelectItem value="Engaged">Engaged</SelectItem>
                <SelectItem value="Livein">Livein</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="Anniversary"
            value={formData.anni ? formData.anni.slice(0, 10) : ''}
            onChange={(val) => onInputChange('anni', val)}
            disabled={disabled || !['Married', 'Engaged', 'Livein'].includes(formData.marital_status || '')}
          />
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Job Responsibilities
            </Label>
            <Select
              value={formData.ext || 'none'}
              onValueChange={(val) => onInputChange('ext', val === 'none' ? '' : val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Select Responsibility" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Operator">Operator</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Department
            </Label>
            <Select
              value={formData.fk_dep_id ? String(formData.fk_dep_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_dep_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="none">None</SelectItem>
                {(departmentsQuery.list.data || []).map((d: any) => (
                  <SelectItem key={d.pk_dep_id} value={String(d.pk_dep_id)}>
                    {d.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Designation
            </Label>
            <Select
              value={formData.fk_deg_id ? String(formData.fk_deg_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_deg_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="none">None</SelectItem>
                {(designationsQuery.list.data || []).map((dg: any) => (
                  <SelectItem key={dg.pk_des_id} value={String(dg.pk_des_id)}>
                    {dg.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Address Containers stretch cleanly to fill Column 1 height */}
        <div className="flex flex-col gap-3 flex-1 min-h-[160px]">
          <div className="flex flex-col gap-1 flex-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Resident Address *
            </Label>
            <textarea
              value={formData.p_address || ''}
              onChange={(e) => onInputChange('p_address', e.target.value)}
              placeholder="Enter Resident Address"
              className="w-full flex-1 min-h-[60px] bg-background/50 text-sm rounded-sm resize-none border border-input px-3 py-1.5 transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled}
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Native Address *
            </Label>
            <textarea
              value={formData.n_address || ''}
              onChange={(e) => onInputChange('n_address', e.target.value)}
              placeholder="Enter Native Address"
              className="w-full flex-1 min-h-[60px] bg-background/50 text-sm rounded-sm resize-none border border-input px-3 py-1.5 transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
