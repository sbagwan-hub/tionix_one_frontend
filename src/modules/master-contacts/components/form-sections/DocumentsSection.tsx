'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Upload, Eye, RefreshCw } from 'lucide-react';
import { DatePicker } from '@/components/common/date-picker';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentsSectionProps {
  documents: any[];
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  onInputChange,
  disabled = false,
}) => {
  const fileInputRefs = React.useRef<{ [key: number]: HTMLInputElement | null }>({});

  const addDocumentRow = () => {
    onInputChange('documents', [...documents, { doc_name: '', file_path: '', valid_until: '' }]);
  };

  const removeDocumentRow = (index: number) => {
    onInputChange(
      'documents',
      documents.filter((_, i) => i !== index),
    );
  };

  const updateDocumentRow = (index: number, field: string, value: any) => {
    const updated = documents.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onInputChange('documents', updated);
  };

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateDocumentRow(index, 'file_path', file.name);
    }
  };

  const handleViewFile = (filePath: string) => {
    if (filePath) {
      alert(`Opening document: ${filePath}`);
    }
  };

  return (
    <div className="border-border/80 bg-background/50 flex h-auto flex-col space-y-2.5 rounded-sm border p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase">
          Documents Produced / Uploads
        </span>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={addDocumentRow}
          disabled={disabled}
          className="text-primary hover:bg-primary/15 h-6 w-6"
        >
          <Plus className="h-4.5 w-4.5" />
        </Button>
      </div>

      <div className="space-y-2">
        {documents.length === 0 ? (
          <p className="text-muted-foreground py-2 text-center text-xs italic">
            No documents recorded. Click + to add.
          </p>
        ) : (
          documents.map((d, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="file"
                ref={(el) => {
                  fileInputRefs.current[index] = el;
                }}
                onChange={(e) => handleFileChange(index, e)}
                style={{ display: 'none' }}
                disabled={disabled}
              />

              {/* Title input */}
              <Input
                placeholder="Doc Description (e.g. Passport)"
                value={d.doc_name || ''}
                onChange={(e) => updateDocumentRow(index, 'doc_name', e.target.value)}
                disabled={disabled}
                className="bg-background h-8 min-w-0 flex-1 text-[11px]"
              />

              {/* View Button */}
              {d.file_path && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewFile(d.file_path)}
                      className="text-primary hover:bg-primary/10 h-8 w-8 shrink-0 rounded-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-[10px]">
                    View: {d.file_path}
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Upload/Change Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    disabled={disabled}
                    className="border-input bg-background text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 shrink-0 rounded-sm"
                  >
                    {d.file_path ? (
                      <RefreshCw className="h-4 w-4" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-[10px]">
                  {d.file_path ? 'Replace File' : 'Upload File'}
                </TooltipContent>
              </Tooltip>

              {/* Validity Datepicker */}
              <div className="w-36 shrink-0">
                <DatePicker
                  value={d.valid_until ? d.valid_until.slice(0, 10) : ''}
                  onChange={(val) => updateDocumentRow(index, 'valid_until', val)}
                  disabled={disabled}
                  placeholder="Valid Until"
                  triggerClassName="h-8 bg-background"
                />
              </div>

              {/* Trash/Delete Action */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeDocumentRow(index)}
                    disabled={disabled}
                    className="text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0 rounded-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-[10px]">Delete Row</TooltipContent>
              </Tooltip>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
