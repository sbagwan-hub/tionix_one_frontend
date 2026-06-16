import { SearchBox } from '@/components/common/search-box';
import { Pagination } from '@/components/common/pagination';
import { Filter } from 'lucide-react';
import { IndividualRecord } from '../types';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import React from 'react';

interface IndividualListProps {
  individuals: IndividualRecord[];
  selectedIndividual: IndividualRecord | null;
  onSelectIndividual: (ind: IndividualRecord) => void;
  search: string;
  onSearchChange: (val: string) => void;
  isLoading: boolean;
  t: (key: string) => string;
  totalRecords: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

export const IndividualList: React.FC<IndividualListProps> = ({
  individuals,
  selectedIndividual,
  onSelectIndividual,
  search,
  onSearchChange,
  isLoading,
  t,
  totalRecords,
  currentPage,
  onPageChange,
  pageSize,
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const pageData = individuals;

  return (
    <div className="space-y-4">
      {/* Search Filter Toolbar */}
      <div className="flex items-center gap-2">
        <SearchBox
          placeholder="Search by Individual name or code..."
          value={search}
          onChange={(val) => {
            onSearchChange(val);
            onPageChange(1);
          }}
          className="max-w-sm flex-1"
        />
        <Button variant="outline" size="sm" className="h-9 cursor-pointer gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </Button>
      </div>

      {/* Grid Table Container */}
      <div className="border-border/80 bg-card overflow-hidden rounded-sm border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-foreground text-xs font-semibold">
              <TableHead className="px-4 py-2.5">Account Code</TableHead>
              <TableHead className="px-4 py-2.5">Client Id</TableHead>
              <TableHead className="px-4 py-2.5">Individual</TableHead>
              <TableHead className="px-4 py-2.5">Postfix</TableHead>
              <TableHead className="px-4 py-2.5">Qualification</TableHead>
              <TableHead className="px-4 py-2.5">Department</TableHead>
              <TableHead className="px-4 py-2.5">Date of Birth</TableHead>
              <TableHead className="px-4 py-2.5">Gender</TableHead>
              <TableHead className="px-4 py-2.5">Marital Status</TableHead>
              <TableHead className="px-4 py-2.5">Organization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {pageData.map((row) => {
              const fullName = `${row.title_name ? row.title_name + ' ' : ''}${row.first_name} ${row.middle_name ? row.middle_name + ' ' : ''}${row.surname}`;
              const genderStr =
                typeof row.gender === 'boolean'
                  ? row.gender
                    ? 'male'
                    : 'female'
                  : String(row.gender || '');
              const maritalStatusStr =
                typeof row.marital_status === 'boolean'
                  ? row.marital_status
                    ? 'married'
                    : 'single'
                  : String(row.marital_status || '');
              return (
                <TableRow
                  key={row.pk_ind_id}
                  onClick={() => onSelectIndividual(row)}
                  className={`hover:bg-muted/30 cursor-pointer transition-colors ${
                    selectedIndividual?.pk_ind_id === row.pk_ind_id
                      ? 'bg-primary/10 border-l-primary border-l-2 font-semibold'
                      : ''
                  }`}
                >
                  <TableCell className="px-4 py-2 font-mono">{row.pk_ind_id}</TableCell>
                  <TableCell className="px-4 py-2 font-mono">{row.fk_com_id}</TableCell>
                  <TableCell className="px-4 py-2">{fullName}</TableCell>
                  <TableCell className="px-4 py-2">{row.postfix || '-'}</TableCell>
                  <TableCell className="px-4 py-2">{row.qualification_name || '-'}</TableCell>
                  <TableCell className="px-4 py-2">{row.department_name || '-'}</TableCell>
                  <TableCell className="px-4 py-2">
                    {row.dob ? new Date(row.dob).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {genderStr ? genderStr.charAt(0).toUpperCase() + genderStr.slice(1) : '-'}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {maritalStatusStr
                      ? maritalStatusStr.charAt(0).toUpperCase() + maritalStatusStr.slice(1)
                      : '-'}
                  </TableCell>
                  <TableCell className="px-4 py-2">{row.organisation_name || '-'}</TableCell>
                </TableRow>
              );
            })}
            {pageData.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-muted-foreground h-40 text-center">
                  {isLoading ? 'Loading...' : 'No records found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Footer Pagination */}
        <div className="border-border/80 bg-muted/20 border-t px-4 py-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};
