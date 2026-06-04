'use client';

import React from 'react';
import { Download, FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ExportButton({
  onExport,
  isLoading = false,
  disabled = false,
  className = '',
}: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || isLoading}
          className={`h-8 gap-1.5 text-xs font-semibold ${className}`}
        >
          <Download className="h-3.5 w-3.5" />
          {isLoading ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => onExport('pdf')}
          className="flex cursor-pointer items-center gap-2"
        >
          <FileText className="h-4 w-4 text-red-500" />
          <span>Export to PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onExport('excel')}
          className="flex cursor-pointer items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
          <span>Export to Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onExport('csv')}
          className="flex cursor-pointer items-center gap-2"
        >
          <FileDown className="h-4 w-4 text-blue-500" />
          <span>Export to CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
