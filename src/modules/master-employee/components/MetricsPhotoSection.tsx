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
import { getFileUrl, validateClientFile, masterEmployeeApi } from '../services';
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
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand border-b border-border/20 pb-1.5">
        Metrics & Photograph
      </h3>

      <div className="flex flex-col gap-3.5 flex-1">
        {/* Photo Upload Area - expands to take complete remaining space */}
        <div className="flex flex-col items-center justify-center border border-dashed border-border/60 bg-muted/5 rounded-sm p-4 flex-1 min-h-[160px] relative">
          <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider absolute top-3 left-3">
            Employee Photo
          </Label>
          <div className="flex flex-col items-center justify-center gap-3.5 w-full h-full">
            <div className="w-24 h-24 rounded-full border border-border/80 bg-background flex items-center justify-center overflow-hidden shadow-inner">
              {formData.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getFileUrl(formData.photo)}
                  alt="Employee"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground text-xs uppercase font-bold text-center p-2">
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

                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      try {
                        const result = await masterEmployeeApi.uploadFile(
                          reader.result as string,
                          file.name,
                          'emp'
                        );
                        onInputChange('photo', result.url);
                        toast.success('Photo uploaded successfully');
                      } catch (error) {
                        toast.error('Failed to upload photo to server');
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs rounded-sm px-3"
                disabled={disabled}
                onClick={() => document.getElementById('photo-upload-input-metrics-ref-v2')?.click()}
              >
                Select
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-destructive rounded-sm px-2.5"
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
            className="h-9 text-sm rounded-sm"
            disabled={disabled}
            maxLength={12}
          />
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Workplace
            </Label>
            <Select
              value={formData.wp || 'Head Office'}
              onValueChange={(val) => onInputChange('wp', val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
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
            className="h-9 text-sm rounded-sm"
            disabled={disabled}
          />
          <FormInput
            label="Weight (kg)"
            type="number"
            value={formData.weight || ''}
            onChange={(e) => onInputChange('weight', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="kg"
            className="h-9 text-sm rounded-sm"
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Blood Group
            </Label>
            <Select
              value={formData.blood_grp || 'none'}
              onValueChange={(val) => onInputChange('blood_grp', val === 'none' ? '' : val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
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
