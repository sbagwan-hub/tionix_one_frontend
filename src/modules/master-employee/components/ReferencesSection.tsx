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
import { useMasterContacts } from '@/modules/master-contacts/hooks/useMasterContacts';
import { EmployeeRecord } from '../types';
import { useWindowStore } from '@/stores/window-store';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const ReferencesSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  const designationsQuery = useMasterContacts('designations');
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand border-b border-border/20 pb-1.5">
        Reference Persons (Personalities Know Employee)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Reference */}
        <div className="border border-border/15 bg-muted/5 p-3 rounded-sm flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/10 pb-1">
            Primary Reference Info
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Name"
              value={formData.personality1 || ''}
              onChange={(e) => onInputChange('personality1', e.target.value)}
              placeholder="Name"
              className="h-9 text-sm rounded-sm"
              disabled={disabled}
            />
            <FormInput
              label="Contact No."
              value={formData.p1_contact || ''}
              onChange={(e) => onInputChange('p1_contact', e.target.value)}
              placeholder="Phone"
              className="h-9 text-sm rounded-sm"
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Designation
            </Label>
            <div className="flex gap-1.5">
              <div className="flex-1 min-w-0">
                <Select
                  value={formData.fk_p1_des_id ? String(formData.fk_p1_des_id) : 'none'}
                  onValueChange={(val) => onInputChange('fk_p1_des_id', val === 'none' ? null : parseInt(val, 10))}
                  disabled={disabled}
                >
                  <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                    <SelectValue placeholder="Select" />
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
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-sm shrink-0"
                disabled={disabled}
                onClick={() => openWindow('contacts-designation')}
                type="button"
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <FormInput
            label="Address"
            value={formData.p1_address || ''}
            onChange={(e) => onInputChange('p1_address', e.target.value)}
            placeholder="Address"
            className="h-9 text-sm rounded-sm"
            disabled={disabled}
          />
        </div>

        {/* Secondary Reference */}
        <div className="border border-border/15 bg-muted/5 p-3 rounded-sm flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/10 pb-1">
            Secondary Reference Info
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Name"
              value={formData.personality2 || ''}
              onChange={(e) => onInputChange('personality2', e.target.value)}
              placeholder="Name"
              className="h-9 text-sm rounded-sm"
              disabled={disabled}
            />
            <FormInput
              label="Contact No."
              value={formData.p2_contact || ''}
              onChange={(e) => onInputChange('p2_contact', e.target.value)}
              placeholder="Phone"
              className="h-9 text-sm rounded-sm"
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Designation
            </Label>
            <div className="flex gap-1.5">
              <div className="flex-1 min-w-0">
                <Select
                  value={formData.fk_p2_des_id ? String(formData.fk_p2_des_id) : 'none'}
                  onValueChange={(val) => onInputChange('fk_p2_des_id', val === 'none' ? null : parseInt(val, 10))}
                  disabled={disabled}
                >
                  <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                    <SelectValue placeholder="Select" />
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
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-sm shrink-0"
                disabled={disabled}
                onClick={() => openWindow('contacts-designation')}
                type="button"
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <FormInput
            label="Address"
            value={formData.p2_address || ''}
            onChange={(e) => onInputChange('p2_address', e.target.value)}
            placeholder="Address"
            className="h-9 text-sm rounded-sm"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
