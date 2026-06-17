'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useMasterContacts } from '../../hooks/useMasterContacts';

interface ContactDetailsSectionProps {
  contacts: any[];
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
  defaultDepartment?: string;
}

export const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
  contacts,
  onInputChange,
  disabled = false,
  defaultDepartment = '',
}) => {
  const { list: mocList } = useMasterContacts('modeOfContact');
  const mocs = mocList.data || [];

  // Sync contact list departments with the selected department from WorkInfoSection
  React.useEffect(() => {
    const needsUpdate = contacts.some((c) => c.department !== defaultDepartment);
    if (needsUpdate) {
      const updated = contacts.map((c) => ({ ...c, department: defaultDepartment }));
      onInputChange('contacts', updated);
    }
  }, [defaultDepartment, contacts, onInputChange]);

  const addDetailRow = () => {
    const defaultMocId = mocs[0]?.pk_moc_id;
    onInputChange('contacts', [
      ...contacts,
      { fk_moc_id: defaultMocId, contact: '', ext: '', department: defaultDepartment },
    ]);
  };

  const removeDetailRow = (index: number) => {
    onInputChange(
      'contacts',
      contacts.filter((_, i) => i !== index),
    );
  };

  const updateDetailRow = (index: number, field: string, value: any) => {
    const updated = contacts.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onInputChange('contacts', updated);
  };

  return (
    <div className="border-border/80 bg-background/50 space-y-2.5 rounded-sm border p-3.5">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase">
          Contact Details (Phone, Email, Mobile, etc.)
        </Label>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={addDetailRow}
          disabled={disabled || mocList.isLoading}
          className="text-primary hover:bg-primary/15 h-6 w-6"
        >
          <Plus className="h-4.5 w-4.5" />
        </Button>
      </div>
      <div className="max-h-40 space-y-2 overflow-y-auto">
        {contacts.length === 0 ? (
          <p className="text-muted-foreground py-2 text-center text-xs italic">
            No contact details added. Click + to add.
          </p>
        ) : (
          contacts.map((d, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                key={`${mocs.length}-${d.fk_moc_id || 'none'}`}
                value={d.fk_moc_id ? String(d.fk_moc_id) : undefined}
                onValueChange={(val) => updateDetailRow(index, 'fk_moc_id', Number(val))}
                disabled={disabled}
              >
                <SelectTrigger className="bg-background h-8 w-28 text-[11px]">
                  <SelectValue placeholder="Select Mode">
                    {d.fk_moc_id ? mocs.find((m) => m.pk_moc_id === d.fk_moc_id)?.moc : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position="popper">
                  {mocs.map((m) => (
                    <SelectItem key={m.pk_moc_id} value={String(m.pk_moc_id)}>
                      {m.moc} - {m.mode || ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Contact Detail (e.g. +123...)"
                value={d.contact || ''}
                onChange={(e) => updateDetailRow(index, 'contact', e.target.value)}
                disabled={disabled}
                className="bg-background h-8 flex-1 text-[11px]"
              />
              <Input
                placeholder="Ext"
                value={d.ext || ''}
                onChange={(e) => updateDetailRow(index, 'ext', e.target.value)}
                disabled={disabled}
                className="bg-background h-8 w-14 text-[11px]"
              />
              <Input
                placeholder="Dept"
                value={defaultDepartment}
                disabled={true}
                className="bg-background h-8 w-16 text-[11px] opacity-80"
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => removeDetailRow(index)}
                disabled={disabled}
                className="text-destructive hover:bg-destructive/10 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
