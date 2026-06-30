'use client';

import * as React from 'react';
import {
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { UserRecord } from '../types';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserListProps {
  users: UserRecord[];
  selectedUser: UserRecord | null;
  onSelectUser: (user: UserRecord) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onFilter: () => void;
  isLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  t: (key: string) => string;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  selectedUser,
  onSelectUser,
  search,
  onSearchChange,
  onFilter,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
  t,
}) => {
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div>
      {/* Search filter */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background/50 placeholder:text-foreground focus-visible:border-brand h-9 w-full pl-9"
          />
        </div>
        <Button variant="outline" onClick={onFilter} size="sm" className="h-9 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" />
          Filter
        </Button>
      </div>

      {/* List Data Grid */}
      <div className="border-border/60 overflow-hidden rounded-sm border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 text-foreground font-semibold">
              <TableHead className="px-4 py-2.5">Username</TableHead>
              <TableHead className="px-4 py-2.5">Email</TableHead>
              <TableHead className="px-4 py-2.5">Mobile</TableHead>
              <TableHead className="px-4 py-2.5">Employee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.pk_user_id}
                onClick={() => onSelectUser(row)}
                className={`hover:bg-muted/30 cursor-pointer transition-colors ${
                  selectedUser?.pk_user_id === row.pk_user_id
                    ? 'bg-brand/10 text-foreground border-l-brand border-l-2 font-semibold'
                    : 'text-foreground'
                }`}
              >
                <TableCell className="px-4 py-2">{row.username}</TableCell>
                <TableCell className="px-4 py-2">{row.email || '-'}</TableCell>
                <TableCell className="px-4 py-2">{row.mobile || '-'}</TableCell>
                <TableCell className="px-4 py-2">{row.employee || '-'}</TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-foreground h-40 text-center">
                  {isLoading ? (
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin opacity-20" />
                  ) : (
                    'No users found.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination controls */}
        <div className="border-border/60 bg-muted/20 flex items-center justify-between border-t px-4 py-2.5">
          <span className="text-foreground text-xxs">Total: {total} records</span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(1)}
              disabled={!canGoPrev}
              className="h-7 w-7 cursor-pointer transition-all"
              title={t('first')}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(page - 1)}
              disabled={!canGoPrev}
              className="h-7 w-7 cursor-pointer transition-all"
              title={t('prior')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-foreground text-xxs px-2 font-semibold">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(page + 1)}
              disabled={!canGoNext}
              className="h-7 w-7 cursor-pointer transition-all"
              title={t('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(totalPages)}
              disabled={!canGoNext}
              className="h-7 w-7 cursor-pointer transition-all"
              title={t('last')}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
