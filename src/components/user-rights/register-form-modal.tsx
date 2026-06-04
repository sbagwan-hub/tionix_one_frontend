'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GenericDialog, { DialogAction } from '@/components/common/GenericDialog';
import { Plus } from 'lucide-react';
import { CreateNewFormIn } from '@/lib/api';

interface RegisterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: CreateNewFormIn) => void;
  isPending: boolean;
}

const INITIAL_FORM_STATE: CreateNewFormIn = {
  form_name: '',
  category: 'master',
  prefix: '',
  last_id: '0',
  start_with: '1',
  len: '10',
  module_name: '',
  module_caption: '',
  news: false,
};

export default function RegisterFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: RegisterFormModalProps) {
  const [formDetails, setFormDetails] = useState<CreateNewFormIn>(INITIAL_FORM_STATE);

  // Reset form details when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormDetails(INITIAL_FORM_STATE);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formDetails);
  };

  const title = (
    <span className="flex items-center gap-2">
      <Plus className="text-primary h-4 w-4" />
      Register New Form / Menu Item
    </span>
  );

  const actions: DialogAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: onClose,
    },
    {
      label: isPending ? 'Registering...' : 'Register Form',
      variant: 'success',
      type: 'submit',
      form: 'register-form-el',
      disabled: isPending,
    },
  ];

  return (
    <GenericDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={actions}
      className="max-w-2xl"
    >
      <form id="register-form-el" onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="form_name">Form Name *</Label>
            <Input
              id="form_name"
              type="text"
              required
              value={formDetails.form_name}
              onChange={(e) => setFormDetails({ ...formDetails, form_name: e.target.value })}
              placeholder="e.g. sales_order"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prefix">Prefix</Label>
            <Input
              id="prefix"
              type="text"
              maxLength={5}
              value={formDetails.prefix || ''}
              onChange={(e) => setFormDetails({ ...formDetails, prefix: e.target.value })}
              placeholder="e.g. SO"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="module_name">Module Name *</Label>
            <Input
              id="module_name"
              type="text"
              required
              value={formDetails.module_name || ''}
              onChange={(e) => setFormDetails({ ...formDetails, module_name: e.target.value })}
              placeholder="e.g. Sales"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="module_caption">Module Caption</Label>
            <Input
              id="module_caption"
              type="text"
              value={formDetails.module_caption || ''}
              onChange={(e) => setFormDetails({ ...formDetails, module_caption: e.target.value })}
              placeholder="e.g. Sales Management"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label>Category *</Label>
            <Tabs
              value={formDetails.category}
              onValueChange={(val: any) => setFormDetails({ ...formDetails, category: val })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="master">Master</TabsTrigger>
                <TabsTrigger value="transaction">Transaction</TabsTrigger>
                <TabsTrigger value="report">Report</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="start_with">Start With ID</Label>
            <Input
              id="start_with"
              type="text"
              value={formDetails.start_with || ''}
              onChange={(e) => setFormDetails({ ...formDetails, start_with: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="len">Length of ID</Label>
            <Input
              id="len"
              type="text"
              value={formDetails.len || ''}
              onChange={(e) => setFormDetails({ ...formDetails, len: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <Checkbox
            id="news_form_chk"
            checked={!!formDetails.news}
            onCheckedChange={(checked) => setFormDetails({ ...formDetails, news: !!checked })}
          />
          <Label htmlFor="news_form_chk" className="cursor-pointer">
            News Form (Flag as recently added)
          </Label>
        </div>
      </form>
    </GenericDialog>
  );
}
