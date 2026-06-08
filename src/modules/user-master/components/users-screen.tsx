'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, RotateCw, Search, User as UserIcon } from 'lucide-react';
import Toolbar from '@/components/shared/toolbar';
import { UserForm } from './user-form';
import { User, UserCreateInput, UserUpdateInput } from '../types';
import { DeleteDialog } from '@/components/common/delete-dialog';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/use-users';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Mode = 'view' | 'add' | 'edit';

export function UsersScreen() {
  const [mode, setMode] = useState<Mode>('view');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [formData, setFormData] = useState<UserCreateInput | UserUpdateInput>({});

  // ── Queries & Mutations ──────────────────────────────────────────────────────
  const { data: users = [], isLoading, refetch } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const loading = isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile?.includes(searchQuery) ||
      user.pk_user_id.toString().includes(searchQuery),
  );

  // ── Populate form from record ───────────────────────────────────────────────
  const populateForm = useCallback(
    (user: User) => {
      setFormData({
        username: user.username,
        password: '',
        answer: user.answer || '',
        security_question: user.security_question || '',
        sal: user.sal || '',
        sys_defined: user.sys_defined,
        fk_user_id: user.fk_user_id,
        last_status: user.last_status,
        fk_ec_id: user.fk_ec_id,
        own_records: user.own_records,
        other_records: user.other_records,
        mobile: user.mobile,
        fk_emp_id: user.fk_emp_id,
      });
      setSelectedId(user.pk_user_id);
    },
    [],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAdd = () => {
    setFormData({ username: '', password: '', answer: '', security_question: '' });
    setSelectedId(null);
    setMode('add');
  };

  const handleEdit = (user: User) => {
    populateForm(user);
    setMode('edit');
  };

  const handleDelete = (user: User) => {
    setSelectedId(user.pk_user_id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      await deleteMutation.mutateAsync(selectedId);
      setIsConfirmOpen(false);
      setSelectedId(null);
      setMode('view');
    }
  };

  const handleSubmit = async () => {
    try {
      if (mode === 'add') {
        await createMutation.mutateAsync(formData as UserCreateInput);
      } else if (mode === 'edit' && selectedId) {
        await updateMutation.mutateAsync({ id: selectedId, input: formData as UserUpdateInput });
      }
      setMode('view');
      setFormData({});
      setSelectedId(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCancel = () => {
    setMode('view');
    setFormData({});
    setSelectedId(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  // ── Toolbar Actions ─────────────────────────────────────────────────────────
  const toolbarActions = [
    {
      icon: Plus,
      label: 'Add',
      onClick: handleAdd,
      disabled: mode !== 'view' || loading,
    },
    {
      icon: Edit,
      label: 'Edit',
      onClick: () => {
        if (selectedId) {
          const user = users.find((u) => u.pk_user_id === selectedId);
          if (user) handleEdit(user);
        }
      },
      disabled: mode !== 'view' || !selectedId || loading,
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: () => {
        if (selectedId) {
          const user = users.find((u) => u.pk_user_id === selectedId);
          if (user) handleDelete(user);
        }
      },
      disabled: mode !== 'view' || !selectedId || loading,
    },
    {
      icon: RotateCw,
      label: 'Refresh',
      onClick: handleRefresh,
      disabled: loading,
    },
  ];

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-border/60 bg-card/50 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserIcon className="text-primary h-6 w-6" />
            <div>
              <h1 className="text-foreground text-lg font-semibold">User Master</h1>
              <p className="text-muted-foreground text-xs">Manage system users</p>
            </div>
          </div>
          <Toolbar actions={toolbarActions} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Users List */}
        <div className="flex flex-1 flex-col border-r border-border/60">
          {/* Search Bar */}
          <div className="border-border/60 bg-card/30 border-b px-6 py-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by username, mobile, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border/80 bg-background/40 focus:bg-background shadow-3xs focus-visible:ring-primary/40 h-9 w-full rounded-md border pl-10 pr-4 text-xs transition-all duration-200 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-muted/30 sticky top-0">
                <TableRow>
                  <TableHead className="text-foreground/80 text-[11px] font-semibold tracking-wide uppercase">
                    ID
                  </TableHead>
                  <TableHead className="text-foreground/80 text-[11px] font-semibold tracking-wide uppercase">
                    Username
                  </TableHead>
                  <TableHead className="text-foreground/80 text-[11px] font-semibold tracking-wide uppercase">
                    Mobile
                  </TableHead>
                  <TableHead className="text-foreground/80 text-[11px] font-semibold tracking-wide uppercase">
                    System
                  </TableHead>
                  <TableHead className="text-foreground/80 text-[11px] font-semibold tracking-wide uppercase">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground text-xs">Loading users...</div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground text-xs">No users found</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.pk_user_id}
                      className={`cursor-pointer transition-colors hover:bg-muted/30 ${
                        selectedId === user.pk_user_id ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => {
                        if (mode === 'view') {
                          setSelectedId(user.pk_user_id);
                          populateForm(user);
                        }
                      }}
                    >
                      <TableCell className="text-foreground/70 text-xs">{user.pk_user_id}</TableCell>
                      <TableCell className="text-foreground text-xs font-medium">{user.username}</TableCell>
                      <TableCell className="text-foreground/70 text-xs">{user.mobile || '-'}</TableCell>
                      <TableCell className="text-foreground/70 text-xs">
                        {user.sys_defined ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className="text-foreground/70 text-xs">{user.last_status || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* User Form */}
        <div className="w-[400px] border-l border-border/60 overflow-visible">
          <UserForm
            mode={mode}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={loading}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}
