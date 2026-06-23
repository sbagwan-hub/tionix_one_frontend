import { SearchBox } from '@/components/common/search-box';
import { Pagination } from '@/components/common/pagination';
import { Filter } from 'lucide-react';
import { OrganisationRecord } from '../types';
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

interface OrganisationListProps {
  organisations: OrganisationRecord[];
  selectedOrganisation: OrganisationRecord | null;
  onSelectOrganisation: (org: OrganisationRecord) => void;
  onDoubleClickOrganisation?: (org: OrganisationRecord) => void;
  search: string;
  onSearchChange: (val: string) => void;
  isLoading: boolean;
  t: (key: string) => string;
  totalRecords: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

export const OrganisationList: React.FC<OrganisationListProps> = ({
  organisations,
  selectedOrganisation,
  onSelectOrganisation,
  onDoubleClickOrganisation,
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

  return (
    <div className="space-y-4">
      {/* Search Filter Toolbar */}
      <div className="flex items-center gap-2">
        <SearchBox
          placeholder="Search by Organisation name or postfix..."
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
              <TableHead className="px-4 py-2.5">Code</TableHead>
              <TableHead className="px-4 py-2.5">Organisation Name</TableHead>
              <TableHead className="px-4 py-2.5">Postfix</TableHead>
              <TableHead className="px-4 py-2.5">Address</TableHead>
              <TableHead className="px-4 py-2.5">City</TableHead>
              <TableHead className="px-4 py-2.5">Region</TableHead>
              <TableHead className="px-4 py-2.5">Pincode</TableHead>
              <TableHead className="px-4 py-2.5">State</TableHead>
              <TableHead className="px-4 py-2.5">Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {organisations.map((row) => (
              <TableRow
                key={row.pk_cont_id}
                onClick={() => onSelectOrganisation(row)}
                onDoubleClick={() => onDoubleClickOrganisation?.(row)}
                className={`cursor-pointer transition-colors ${
                  selectedOrganisation?.pk_cont_id === row.pk_cont_id
                    ? 'bg-primary/10 hover:bg-primary/10 border-l-primary text-primary border-l-2'
                    : 'hover:bg-muted/30'
                }`}
              >
                <TableCell className="px-4 py-2 font-mono">{row.pk_cont_id}</TableCell>
                <TableCell className="px-4 py-2 font-medium">{row.contact_name}</TableCell>
                <TableCell className="px-4 py-2">{row.postfix || '-'}</TableCell>
                <TableCell className="max-w-[150px] truncate px-4 py-2" title={row.address || ''}>
                  {row.address || '-'}
                </TableCell>
                <TableCell className="px-4 py-2">{row.city_name || '-'}</TableCell>
                <TableCell className="px-4 py-2">{row.region || '-'}</TableCell>
                <TableCell className="px-4 py-2 font-mono">{row.pincode || '-'}</TableCell>
                <TableCell className="px-4 py-2">{row.state_name || '-'}</TableCell>
                <TableCell className="px-4 py-2">{row.country_name || '-'}</TableCell>
              </TableRow>
            ))}
            {organisations.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-muted-foreground h-40 text-center">
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
