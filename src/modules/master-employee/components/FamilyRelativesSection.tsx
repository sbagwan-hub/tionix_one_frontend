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
import { Plus, Trash2, Paperclip } from 'lucide-react';
import { useMasterContacts } from '@/modules/master-contacts/hooks/useMasterContacts';
import { EmployeeRecord, RelativeDetail } from '../types';
import { useWindowStore } from '@/stores/window-store';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { DatePicker } from '@/components/common/date-picker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const qualificationsQuery = useMasterContacts('qualifications');
  const openWindow = useWindowStore((state) => state.openWindow);
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
    <TooltipProvider>
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
          <Table className="w-full border-collapse text-left text-sm table-fixed">
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/40 text-muted-foreground font-semibold hover:bg-muted/40">
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[13%]">Relative Name</TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[13%]">Relationship</TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[13%]">Marital Status</TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[14%]">Date of Birth</TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[13%]">Qualification</TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[13%]">Occupation</TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[14%]">Edu. Allowance</TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold text-center w-[7%]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatives.map((relative) => {
                const relationshipName =
                  (relationshipsQuery.list.data || []).find(
                    (r: any) => String(r.pk_rel_id) === String(relative.relationship),
                  )?.relationship || '';

                const qualificationName =
                  (qualificationsQuery.list.data || []).find(
                    (q: any) => String(q.pk_qua_id) === String(relative.qualification),
                  )?.qualification || '';

                return (
                  <TableRow key={relative.id} className="border-b border-border/10 hover:bg-muted/5">
                    <TableCell className="py-1 px-1.5 w-[13%]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            value={relative.relative_name}
                            onChange={(e) => handleUpdateRelative(relative.id, 'relative_name', e.target.value)}
                            className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background w-full truncate"
                            placeholder="Name"
                            disabled={disabled}
                          />
                        </TooltipTrigger>
                        {relative.relative_name && (
                          <TooltipContent>{relative.relative_name}</TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-1 px-1.5 w-[13%]">
                      <div className="flex gap-1 items-center">
                        <div className="flex-1 min-w-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full">
                                <Select
                                  value={relative.relationship ? String(relative.relationship) : 'none'}
                                  onValueChange={(val) => handleUpdateRelative(relative.id, 'relationship', val === 'none' ? '' : val)}
                                  disabled={disabled}
                                >
                                  <SelectTrigger className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background w-full">
                                    <SelectValue placeholder="Relationship" />
                                  </SelectTrigger>
                                  <SelectContent position="popper">
                                    <SelectItem value="none">None</SelectItem>
                                    {(relationshipsQuery.list.data || []).map((r: any) => (
                                      <SelectItem key={r.pk_rel_id} value={String(r.pk_rel_id)}>
                                        {r.relationship}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TooltipTrigger>
                            {relationshipName && (
                              <TooltipContent>{relationshipName}</TooltipContent>
                            )}
                          </Tooltip>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-sm shrink-0 border-0 bg-transparent hover:bg-muted"
                          disabled={disabled}
                          onClick={() => openWindow('contacts-relationship')}
                          type="button"
                        >
                          <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-1.5 w-[13%]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full">
                            <Select
                              value={relative.marital_status}
                              onValueChange={(val) => handleUpdateRelative(relative.id, 'marital_status', val)}
                              disabled={disabled}
                            >
                              <SelectTrigger className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Unmarried">Unmarried</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        {relative.marital_status && (
                          <TooltipContent>{relative.marital_status}</TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-1 px-1.5 w-[14%]">
                      <DatePicker
                        value={relative.dob ? relative.dob.slice(0, 10) : ''}
                        onChange={(val) => handleUpdateRelative(relative.id, 'dob', val)}
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell className="py-1 px-1.5 w-[13%]">
                      <div className="flex gap-1 items-center">
                        <div className="flex-1 min-w-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full">
                                <Select
                                  value={relative.qualification ? String(relative.qualification) : 'none'}
                                  onValueChange={(val) => handleUpdateRelative(relative.id, 'qualification', val === 'none' ? '' : val)}
                                  disabled={disabled}
                                >
                                  <SelectTrigger className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background w-full">
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
                            </TooltipTrigger>
                            {qualificationName && (
                              <TooltipContent>{qualificationName}</TooltipContent>
                            )}
                          </Tooltip>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-sm shrink-0 border-0 bg-transparent hover:bg-muted"
                          disabled={disabled}
                          onClick={() => openWindow('contacts-qualification')}
                          type="button"
                        >
                          <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-1.5 w-[13%]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            value={relative.occupation || ''}
                            onChange={(e) => handleUpdateRelative(relative.id, 'occupation', e.target.value)}
                            className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background w-full truncate"
                            placeholder="Occupation"
                            disabled={disabled}
                          />
                        </TooltipTrigger>
                        {relative.occupation && (
                          <TooltipContent>{relative.occupation}</TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-1 px-1.5 w-[14%]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            value={relative.school_allowance || ''}
                            onChange={(e) => handleUpdateRelative(relative.id, 'school_allowance', e.target.value)}
                            className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background w-full truncate"
                            placeholder="School / College / University Name"
                            disabled={disabled}
                          />
                        </TooltipTrigger>
                        {relative.school_allowance && (
                          <TooltipContent>{relative.school_allowance}</TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-1 px-1.5 text-center w-[7%]">
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
                    </TableCell>
                  </TableRow>
                );
              })}
              {relatives.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm bg-muted/5 h-full">
                    No family members added. Click Add Relative to build the list.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};
