'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/data-table';
import { FormHeader } from '@/components/common/form-header';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

// Sample data
const sampleOperators = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@falcon.com',
    phone: '+971 50 123 4567',
    licenseNumber: 'OP-2024-001',
    certifications: ['Forklift', 'Crane'],
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Raj Kumar',
    email: 'raj.kumar@kamdhenu.com',
    phone: '+91 98 765 4321',
    licenseNumber: 'OP-2024-002',
    certifications: ['Forklift', 'Heavy Equipment'],
    isActive: true,
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@tionix.com',
    phone: '+1 555 987 6543',
    licenseNumber: 'OP-2024-003',
    certifications: ['Crane', 'Safety'],
    isActive: false,
    createdAt: '2024-01-03',
  },
];

export default function OperatorsPage() {
  const columns = [
    {
      key: 'name',
      label: 'Operator Name',
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
      key: 'licenseNumber',
      label: 'License Number',
    },
    {
      key: 'certifications',
      label: 'Certifications',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.map((cert, index) => (
            <span key={index} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
              {cert}
            </span>
          ))}
        </div>
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
        title="Operators"
        description="Manage operator profiles and assignments"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Operator
          </Button>
        }
      />

      <DataTable data={sampleOperators} columns={columns} className="mt-6" />
    </div>
  );
}
