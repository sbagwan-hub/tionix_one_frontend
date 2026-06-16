'use client';

import * as React from 'react';
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
import { useMasterContacts } from '@/modules/master-contacts/hooks/useMasterContacts';
import { EmployeeRecord, RelativeDetail } from '../types';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const FamilyRelativesSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  const relationshipsQuery = useMasterContacts('relationships');
  const relatives = formData.relatives || [];

  const handleAddRelative = () => {
    const newRelative: RelativeDetail = {
      id: Date.now().toString(),
      relative_name: '',
      relationship: '',
      marital_status: 'Unmarried',
      dob: '',
      qualification: '',
      occupation: '',
      school_allowance: '',
    };
    onInputChange('relatives', [...relatives, newRelative]);
  };

  const handleUpdateRelative = (id: string, field: string, value: string) => {
    const updated = relatives.map((r) => (r.id === id ? { ...r, [field]: value } : r));
    onInputChange('relatives', updated);
  };

  const handleRemoveRelative = (id: string) => {
    const filtered = relatives.filter((r) => r.id !== id);
    onInputChange('relatives', filtered);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border/10 pb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand">
          Family & Relatives details (Educational Allowance)
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs rounded-sm px-3 gap-1.5"
          onClick={handleAddRelative}
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          Add Relative
        </Button>
      </div>

      <div className="border border-border/40 rounded-sm overflow-y-auto max-h-[260px]">
        <table className="w-full border-collapse text-left text-sm min-w-0">
          <thead>
            <tr className="border-b border-border/30 bg-muted/40 text-muted-foreground font-semibold">
              <th className="py-2.5 px-3">Relative Name</th>
              <th className="py-2.5 px-3 w-36">Relationship</th>
              <th className="py-2.5 px-3 w-32">Marital Status</th>
              <th className="py-2.5 px-3 w-40">Date of Birth</th>
              <th className="py-2.5 px-3 w-32">Qualification</th>
              <th className="py-2.5 px-3 w-32">Occupation</th>
              <th className="py-2.5 px-3">School\ College\ University (Allowance)</th>
              <th className="py-2.5 px-3 text-center w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {relatives.map((relative) => (
              <tr key={relative.id} className="border-b border-border/10 hover:bg-muted/5">
                <td className="py-1 px-1.5">
                  <Input
                    value={relative.relative_name}
                    onChange={(e) => handleUpdateRelative(relative.id, 'relative_name', e.target.value)}
                    className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background"
                    placeholder="Name"
                    disabled={disabled}
                  />
                </td>
                <td className="py-1 px-1.5">
                  <Select
                    value={relative.relationship}
                    onValueChange={(val) => handleUpdateRelative(relative.id, 'relationship', val)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background w-full">
                      <SelectValue placeholder="Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {(relationshipsQuery.list.data || []).map((r: any) => (
                        <SelectItem key={r.pk_rel_id} value={String(r.pk_rel_id)}>
                          {r.relationship}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-1 px-1.5">
                  <Select
                    value={relative.marital_status}
                    onValueChange={(val) => handleUpdateRelative(relative.id, 'marital_status', val)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Unmarried">Unmarried</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-1 px-1.5">
                  <Input
                    type="date"
                    value={relative.dob ? relative.dob.slice(0, 10) : ''}
                    onChange={(e) => handleUpdateRelative(relative.id, 'dob', e.target.value)}
                    className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background"
                    disabled={disabled}
                  />
                </td>
                <td className="py-1 px-1.5">
                  <Input
                    value={relative.qualification || ''}
                    onChange={(e) => handleUpdateRelative(relative.id, 'qualification', e.target.value)}
                    className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background"
                    placeholder="Qualification"
                    disabled={disabled}
                  />
                </td>
                <td className="py-1 px-1.5">
                  <Input
                    value={relative.occupation || ''}
                    onChange={(e) => handleUpdateRelative(relative.id, 'occupation', e.target.value)}
                    className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background"
                    placeholder="Occupation"
                    disabled={disabled}
                  />
                </td>
                <td className="py-1 px-1.5">
                  <Input
                    value={relative.school_allowance || ''}
                    onChange={(e) => handleUpdateRelative(relative.id, 'school_allowance', e.target.value)}
                    className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background"
                    placeholder="School / College / University Name"
                    disabled={disabled}
                  />
                </td>
                <td className="py-1 px-1.5 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive rounded-sm"
                    onClick={() => handleRemoveRelative(relative.id)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {relatives.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-muted-foreground text-sm bg-muted/5 h-full">
                  No family members added. Click Add Relative to build the list.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
