'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Eye, UploadCloud, X } from 'lucide-react';
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
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

import { getFileUrl, validateClientFile } from '../services';
import { uploadFileToMinio } from '@/lib/s3';

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
      doc_file: null,
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
    <TooltipProvider>
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

        <div className="border border-border/40 rounded-sm flex-1 min-h-[160px] max-h-[260px] overflow-y-auto overflow-x-hidden">
          <Table className="w-full table-fixed border-collapse text-left text-sm whitespace-normal">
            <TableHeader>
              <TableRow className="border-b border-border/30 bg-muted/40 text-muted-foreground font-semibold hover:bg-muted/40">
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[37%] text-left whitespace-normal">
                  Document Type
                </TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[20%] text-center whitespace-normal">
                  Attachment
                </TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[24%] text-left whitespace-normal">
                  Valid Until
                </TableHead>
                <TableHead className="py-2.5 px-3 h-auto text-muted-foreground font-semibold w-[15%] text-center whitespace-normal">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id} className="border-b border-border/10 hover:bg-muted/5">
                  <TableCell className="py-1 px-1.5 w-[37%] min-w-0 whitespace-normal">
                    <Select
                      value={license.fk_dt_id ? String(license.fk_dt_id) : 'none'}
                      onValueChange={(val) => handleDocumentTypeChange(license.id, val)}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-8 text-xs rounded-sm bg-transparent border-0 focus:bg-background focus:ring-0 w-full truncate">
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
                  </TableCell>
                  <TableCell className="py-1 px-1.5 w-[20%] min-w-0 whitespace-normal">
                    <div className="flex items-center gap-1 justify-center w-full min-w-0">
                      {license.doc_file ? (
                        <div className="flex items-center gap-1 justify-center w-full min-w-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-brand hover:bg-brand/10 rounded-sm cursor-pointer shrink-0"
                                onClick={() => {
                                  try {
                                    const newWindow = window.open();
                                    if (newWindow) {
                                      newWindow.document.write(
                                        `<iframe src="${getFileUrl(license.doc_file ?? null)}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
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
                                className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-sm cursor-pointer shrink-0"
                                onClick={() => {
                                  handleUpdateLicense(license.id, 'doc_file', null);
                                  toast.success('Document deleted successfully.');
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
                        <div className="w-full min-w-0">
                          <input
                            type="file"
                            id={`file-upload-${license.id}`}
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
                                  const url = await uploadFileToMinio(file, 'certificates', 'emp');
                                  handleUpdateLicense(license.id, 'doc_file', url);
                                  toast.success(`${file.name} uploaded successfully.`);
                                } catch (err) {
                                  toast.error('Failed to upload file to server');
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            className="h-7 text-xs px-2 rounded-sm flex items-center gap-1 cursor-pointer w-full justify-center truncate min-w-0"
                            disabled={disabled}
                            onClick={() => document.getElementById(`file-upload-${license.id}`)?.click()}
                          >
                            <UploadCloud className="h-3.5 w-3.5 shrink-0" />
                            Attach
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-1.5 w-[24%] min-w-0 whitespace-normal">
                    <DatePicker
                      value={license.valid_until ? license.valid_until.slice(0, 10) : ''}
                      onChange={(val) => handleUpdateLicense(license.id, 'valid_until', val)}
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="py-1 px-1.5 w-[15%] min-w-0 whitespace-normal">
                    <div className="flex items-center justify-center w-full">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-sm cursor-pointer shrink-0"
                            onClick={() => handleRemoveLicense(license.id)}
                            disabled={disabled}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove Row</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {licenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm bg-muted/5 h-full whitespace-normal">
                    <div className="flex items-center justify-center h-full w-full">
                      No certificates recorded. Click Add Certificate to record credentials.
                    </div>
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
