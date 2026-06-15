'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { EmployeeRecord, LicenseDetail } from '../types';

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

  const handleAddLicense = () => {
    const newLicense: LicenseDetail = {
      id: Date.now().toString(),
      certificate_name: '',
      has_original: true,
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

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between border-b border-border/10 pb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand">
          Certificates / Licenses Produced in Original
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
              <th className="py-2.5 px-3 w-32">Original</th>
              <th className="py-2.5 px-3 w-40">Valid Until</th>
              <th className="py-2.5 px-3 text-center w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => (
              <tr key={license.id} className="border-b border-border/10 hover:bg-muted/5">
                <td className="py-1 px-1.5">
                  <Input
                    value={license.certificate_name}
                    onChange={(e) => handleUpdateLicense(license.id, 'certificate_name', e.target.value)}
                    className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background"
                    placeholder="e.g. Degree certificate, passport, visa"
                    disabled={disabled}
                  />
                </td>
                <td className="py-1 px-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <Checkbox
                      checked={license.has_original}
                      onCheckedChange={(val) => handleUpdateLicense(license.id, 'has_original', !!val)}
                      disabled={disabled}
                    />
                    Yes
                  </label>
                </td>
                <td className="py-1 px-1.5">
                  <Input
                    type="date"
                    value={license.valid_until ? license.valid_until.slice(0, 10) : ''}
                    onChange={(e) => handleUpdateLicense(license.id, 'valid_until', e.target.value)}
                    className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background"
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
                <td colSpan={4} className="text-center py-8 text-muted-foreground text-sm bg-muted/5 h-full">
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
