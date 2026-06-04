'use client';

import React, { useState, useEffect } from 'react';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GenericDialog, { DialogAction } from '@/components/common/generic-dialog';
import { Plus } from 'lucide-react';
import { CreateNewFormIn } from '../types';
import AdaptiveTabs from '@/components/common/adaptive-tabs';

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
          <FormInput
            id="form_name"
            label="Form Name *"
            type="text"
            required
            value={formDetails.form_name}
            onChange={(e) => setFormDetails({ ...formDetails, form_name: e.target.value })}
            placeholder="e.g. sales_order"
          />

          <FormInput
            id="prefix"
            label="Prefix"
            type="text"
            maxLength={5}
            value={formDetails.prefix || ''}
            onChange={(e) => setFormDetails({ ...formDetails, prefix: e.target.value })}
            placeholder="e.g. SO"
          />

          <FormInput
            id="module_name"
            label="Module Name *"
            type="text"
            required
            value={formDetails.module_name || ''}
            onChange={(e) => setFormDetails({ ...formDetails, module_name: e.target.value })}
            placeholder="e.g. Sales"
          />

          <FormInput
            id="module_caption"
            label="Module Caption"
            type="text"
            value={formDetails.module_caption || ''}
            onChange={(e) => setFormDetails({ ...formDetails, module_caption: e.target.value })}
            placeholder="e.g. Sales Management"
          />

          <div className="col-span-2 space-y-1.5">
            <AdaptiveTabs
              label="Category"
              required
              value={formDetails.category}
              onValueChange={(val: any) => setFormDetails({ ...formDetails, category: val })}
              options={[
                { label: 'Master', value: 'master' },
                { label: 'Transaction', value: 'transaction' },
                { label: 'Report', value: 'report' },
                { label: 'Other', value: 'other' },
              ]}
            />
          </div>

          <FormInput
            id="start_with"
            label="Start With ID"
            type="text"
            value={formDetails.start_with || ''}
            onChange={(e) => setFormDetails({ ...formDetails, start_with: e.target.value })}
          />

          <FormInput
            id="len"
            label="Length of ID"
            type="text"
            value={formDetails.len || ''}
            onChange={(e) => setFormDetails({ ...formDetails, len: e.target.value })}
          />
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
