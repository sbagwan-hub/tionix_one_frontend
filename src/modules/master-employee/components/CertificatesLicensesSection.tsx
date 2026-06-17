'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { EmployeeRecord, LicenseDetail } from '../types';
import { useDocumentTypes } from '../hooks/useMasterEmployee';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/common/date-picker';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const CertificatesLicensesSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  const licenses = formData.licenses || [];
  const { data: documentTypes = [] } = useDocumentTypes();

  const handleAddLicense = () => {
    const newLicense: LicenseDetail = {
      id: Date.now().toString(),
      certificate_name: '',
      fk_dt_id: undefined,
      valid_until: '',
    };
    onInputChange('licenses', [...licenses, newLicense]);
  };

  const handleUpdateLicense = (id: string, field: string, value: any) => {
    const updated = licenses.map((l) => (l.id === id ? { ...l, [field]: value } : l));
    onInputChange('licenses', updated);
  };

  const handleRemoveLicense = (id: string) => {
    const filtered = licenses.filter((l) => l.id !== id);
    onInputChange('licenses', filtered);
  };

  const handleDocumentTypeChange = (id: string, valStr: string) => {
    const selected = documentTypes.find((d) => String(d.fk_dt_id) === valStr);
    const updated = licenses.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          fk_dt_id: selected ? selected.fk_dt_id : undefined,
          certificate_name: selected ? selected.doc_file : '',
        };
      }
      return l;
    });
    onInputChange('licenses', updated);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between border-b border-border/10 pb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand">
          Certificates / Licenses Produced
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs rounded-sm px-3 gap-1.5"
          onClick={handleAddLicense}
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      <div className="border border-border/40 rounded-sm flex-1 min-h-[160px] max-h-[260px] overflow-y-auto">
        <table className="w-full border-collapse text-left text-sm min-w-0">
          <thead>
            <tr className="border-b border-border/30 bg-muted/40 text-muted-foreground font-semibold">
              <th className="py-2.5 px-3">Certificate / License Description</th>
              <th className="py-2.5 px-3 w-40">Valid Until</th>
              <th className="py-2.5 px-3 text-center w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => (
              <tr key={license.id} className="border-b border-border/10 hover:bg-muted/5">
                <td className="py-1 px-1.5">
                  <Select
                    value={license.fk_dt_id ? String(license.fk_dt_id) : 'none'}
                    onValueChange={(val) => handleDocumentTypeChange(license.id, val)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background focus:ring-0 w-full">
                      <SelectValue placeholder="Select Document Type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="none">Select Document Type</SelectItem>
                      {documentTypes.map((d) => (
                        <SelectItem key={d.fk_dt_id} value={String(d.fk_dt_id)}>
                          {d.doc_file}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-1 px-1.5">
                  <DatePicker
                    value={license.valid_until ? license.valid_until.slice(0, 10) : ''}
                    onChange={(val) => handleUpdateLicense(license.id, 'valid_until', val)}
                    disabled={disabled}
                  />
                </td>
                <td className="py-1 px-1.5 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive rounded-sm"
                    onClick={() => handleRemoveLicense(license.id)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {licenses.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-8 text-muted-foreground text-sm bg-muted/5 h-full">
                  <div className="flex items-center justify-center h-full w-full">
                    No certificates recorded. Click Add Certificate to record credentials.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
