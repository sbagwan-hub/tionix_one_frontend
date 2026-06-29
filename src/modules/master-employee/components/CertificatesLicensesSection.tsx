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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
      <div className="flex h-full flex-col gap-4">
        <div className="border-border/10 flex items-center justify-between border-b pb-2">
          <h4 className="text-brand text-sm font-bold tracking-wider uppercase">
            Certificates / Licenses Produced
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-sm px-3 text-xs"
            onClick={handleAddLicense}
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
            Add Certificate
          </Button>
        </div>

        <div className="border-border/40 max-h-[260px] min-h-[160px] flex-1 overflow-x-hidden overflow-y-auto rounded-sm border">
          <Table className="w-full table-fixed border-collapse text-left text-sm whitespace-normal">
            <TableHeader>
              <TableRow className="border-border/30 bg-muted/40 text-muted-foreground hover:bg-muted/40 border-b font-semibold">
                <TableHead className="text-muted-foreground h-auto w-[37%] px-3 py-2.5 text-left font-semibold whitespace-normal">
                  Document Type
                </TableHead>
                <TableHead className="text-muted-foreground h-auto w-[20%] px-3 py-2.5 text-center font-semibold whitespace-normal">
                  Attachment
                </TableHead>
                <TableHead className="text-muted-foreground h-auto w-[24%] px-3 py-2.5 text-left font-semibold whitespace-normal">
                  Valid Until
                </TableHead>
                <TableHead className="text-muted-foreground h-auto w-[15%] px-3 py-2.5 text-center font-semibold whitespace-normal">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id} className="border-border/10 hover:bg-muted/5 border-b">
                  <TableCell className="w-[37%] min-w-0 px-1.5 py-1 whitespace-normal">
                    <Select
                      value={license.fk_dt_id ? String(license.fk_dt_id) : 'none'}
                      onValueChange={(val) => handleDocumentTypeChange(license.id, val)}
                      disabled={disabled}
                    >
                      <SelectTrigger className="focus:bg-background h-8 w-full truncate rounded-sm border-0 bg-transparent text-xs focus:ring-0">
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
                  <TableCell className="w-[20%] min-w-0 px-1.5 py-1 whitespace-normal">
                    <div className="flex w-full min-w-0 items-center justify-center gap-1">
                      {license.doc_file ? (
                        <div className="flex w-full min-w-0 items-center justify-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-brand hover:bg-brand/10 h-7 w-7 shrink-0 cursor-pointer rounded-sm"
                                onClick={() => {
                                  try {
                                    const newWindow = window.open();
                                    if (newWindow) {
                                      newWindow.document.write(
                                        `<iframe src="${getFileUrl(license.doc_file ?? null)}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`,
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
                                className="text-destructive hover:bg-destructive/10 h-7 w-7 shrink-0 cursor-pointer rounded-sm"
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
                            className="flex h-7 w-full min-w-0 cursor-pointer items-center justify-center gap-1 truncate rounded-sm px-2 text-xs"
                            disabled={disabled}
                            onClick={() =>
                              document.getElementById(`file-upload-${license.id}`)?.click()
                            }
                          >
                            <UploadCloud className="h-3.5 w-3.5 shrink-0" />
                            Attach
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[24%] min-w-0 px-1.5 py-1 whitespace-normal">
                    <DatePicker
                      value={license.valid_until ? license.valid_until.slice(0, 10) : ''}
                      onChange={(val) => handleUpdateLicense(license.id, 'valid_until', val)}
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="w-[15%] min-w-0 px-1.5 py-1 whitespace-normal">
                    <div className="flex w-full items-center justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0 cursor-pointer rounded-sm"
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
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground bg-muted/5 h-full py-8 text-center text-sm whitespace-normal"
                  >
                    <div className="flex h-full w-full items-center justify-center">
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
