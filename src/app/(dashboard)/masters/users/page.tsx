'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/data-table';
import { FormHeader } from '@/components/common/form-header';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

// Sample data
const sampleUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@tionix.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager1@tionix.com',
    firstName: 'Manager',
    lastName: 'One',
    role: 'manager',
    isActive: true,
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    username: 'operator1',
    email: 'operator1@tionix.com',
    firstName: 'Operator',
    lastName: 'One',
    role: 'operator',
    isActive: true,
    createdAt: '2024-01-03',
  },
];

export default function UsersPage() {
  const columns = [
    {
      key: 'username',
      label: 'Username',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'firstName',
      label: 'First Name',
    },
    {
      key: 'lastName',
      label: 'Last Name',
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <FormHeader
        title="Users"
        description="Manage user accounts and permissions"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      <DataTable data={sampleUsers} columns={columns} className="mt-6" />
    </div>
  );
}
