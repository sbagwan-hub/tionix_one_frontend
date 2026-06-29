'use client';

import * as React from 'react';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmployeeRecord } from '../types';
import { DatePicker } from '@/components/common/date-picker';
import { getFileUrl, validateClientFile } from '../services';
import { uploadFileToMinio } from '@/lib/s3';
import { toast } from 'sonner';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const MetricsPhotoSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  return (
    <div className="flex h-full flex-col gap-4">
      <h3 className="text-brand border-border/20 border-b pb-1.5 text-sm font-bold tracking-wider uppercase">
        Metrics & Photograph
      </h3>

      <div className="flex flex-1 flex-col gap-3.5">
        {/* Photo Upload Area - expands to take complete remaining space */}
        <div className="border-border/60 bg-muted/5 relative flex min-h-[160px] flex-1 flex-col items-center justify-center rounded-sm border border-dashed p-4">
          <Label className="text-muted-foreground absolute top-3 left-3 text-xs font-semibold tracking-wider uppercase">
            Employee Photo
          </Label>
          <div className="flex h-full w-full flex-col items-center justify-center gap-3.5">
            <div className="border-border/80 bg-background flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border shadow-inner">
              {formData.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getFileUrl(formData.photo)}
                  alt="Employee"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground p-2 text-center text-xs font-bold uppercase">
                  No Photo
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                id="photo-upload-input-metrics-ref-v2"
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const validation = validateClientFile(file);
                    if (!validation.valid) {
                      toast.error(validation.error || 'Invalid file');
                      return;
                    }

                    try {
                      const url = await uploadFileToMinio(file, 'employee', 'emp');
                      onInputChange('photo', url);
                      toast.success('Photo uploaded successfully');
                    } catch (error) {
                      toast.error('Failed to upload photo to server');
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-sm px-3 text-xs"
                disabled={disabled}
                onClick={() =>
                  document.getElementById('photo-upload-input-metrics-ref-v2')?.click()
                }
              >
                Select
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive h-8 rounded-sm px-2.5 text-xs"
                disabled={disabled || !formData.photo}
                onClick={() => onInputChange('photo', null)}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Aadhar Card No."
            value={formData.aadhar || ''}
            onChange={(e) => onInputChange('aadhar', e.target.value)}
            placeholder="Aadhar No."
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
            maxLength={12}
          />
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Workplace
            </Label>
            <Select
              value={formData.wp || 'Head Office'}
              onValueChange={(val) => onInputChange('wp', val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 w-full rounded-sm text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="Head Office">Head Office</SelectItem>
                <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                <SelectItem value="Site Office">Site Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Height (cm)"
            type="number"
            value={formData.height || ''}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              onInputChange('height', val ? parseInt(val, 10) : null);
            }}
            placeholder="cm"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
          />
          <FormInput
            label="Weight (kg)"
            type="number"
            value={formData.weight || ''}
            onChange={(e) =>
              onInputChange('weight', e.target.value ? parseFloat(e.target.value) : null)
            }
            placeholder="kg"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Blood Group
            </Label>
            <Select
              value={formData.blood_grp || 'none'}
              onValueChange={(val) => onInputChange('blood_grp', val === 'none' ? '' : val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 w-full rounded-sm text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DatePicker
            label="Leaving Date"
            value={formData.dol ? formData.dol.slice(0, 10) : ''}
            onChange={(val) => onInputChange('dol', val)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
