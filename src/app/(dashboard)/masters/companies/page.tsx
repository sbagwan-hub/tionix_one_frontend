'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/data-table';
import { FormHeader } from '@/components/common/form-header';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

// Sample data
const sampleCompanies = [
  {
    id: '1',
    name: 'Falcon Material Handling FZ LLC',
    email: 'info@falcon.com',
    phone: '+971 4 123 4567',
    city: 'Dubai',
    country: 'UAE',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Kamdhenu Commercials',
    email: 'info@kamdhenu.com',
    phone: '+91 11 234 5678',
    city: 'Mumbai',
    country: 'India',
    isActive: true,
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: 'Tionix One Operations',
    email: 'info@tionix.com',
    phone: '+1 555 123 4567',
    city: 'New York',
    country: 'USA',
    isActive: true,
    createdAt: '2024-01-03',
  },
];

export default function CompaniesPage() {
  const columns = [
    {
      key: 'name',
      label: 'Company Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'city',
      label: 'City',
    },
    {
      key: 'country',
      label: 'Country',
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
        title="Companies"
        description="Manage company information and settings"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        }
      />

      <DataTable data={sampleCompanies} columns={columns} className="mt-6" />
    </div>
  );
}
