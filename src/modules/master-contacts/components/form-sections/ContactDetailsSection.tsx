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

interface ContactDetailsSectionProps {
  disabled?: boolean;
}

export const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
  disabled = false,
}) => {
  const [details, setDetails] = React.useState<any[]>([
    { type: 'Phone', detail: '', dept: '' },
    { type: 'Email', detail: '', dept: '' },
  ]);

  const addDetailRow = () => {
    setDetails((prev) => [...prev, { type: 'Phone', detail: '', dept: '' }]);
  };

  const removeDetailRow = (index: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDetailRow = (index: number, field: string, value: string) => {
    setDetails((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="border-border/80 bg-background/50 space-y-2.5 rounded-sm border p-3.5">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          Phone, Email, Mobile details
        </Label>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={addDetailRow}
          disabled={disabled}
          className="text-primary hover:bg-primary/15 h-6 w-6"
        >
          <Plus className="h-4.5 w-4.5" />
        </Button>
      </div>
      <div className="max-h-40 space-y-2 overflow-y-auto">
        {details.map((d, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={d.type}
              onValueChange={(val) => updateDetailRow(index, 'type', val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background h-8 w-20 text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Detail"
              value={d.detail}
              onChange={(e) => updateDetailRow(index, 'detail', e.target.value)}
              disabled={disabled}
              className="bg-background h-8 flex-1 text-[11px]"
            />
            <Input
              placeholder="Dept"
              value={d.dept}
              onChange={(e) => updateDetailRow(index, 'dept', e.target.value)}
              disabled={disabled}
              className="bg-background h-8 w-16 text-[11px]"
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
        ))}
      </div>
    </div>
  );
};
