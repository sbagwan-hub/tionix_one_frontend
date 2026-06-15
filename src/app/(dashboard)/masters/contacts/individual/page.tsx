'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Save,
  RefreshCw,
  Printer,
  Download,
  HelpCircle as Help,
  LogOut,
} from 'lucide-react';
import Toolbar from '@/components/shared/toolbar';
import { DeleteDialog } from '@/components/common/delete-dialog';
import { useMasterContacts } from '@/modules/master-contacts/hooks/useMasterContacts';
import { useIndividual } from '@/modules/master-contacts/hooks/use-individual';
import { IndividualForm } from '@/modules/master-contacts/components/IndividualForm';
import { IndividualList } from '@/modules/master-contacts/components/IndividualList';
import { IndividualDto, IndividualRecord } from '@/modules/master-contacts/types';

export default function IndividualContactsPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = React.useState('individual');
  const [selectedInd, setSelectedInd] = React.useState<IndividualRecord | null>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  // TanStack Query Hooks for Individual Contacts
  const {
    list: indList,
    create: createInd,
    update: updateInd,
    remove: removeInd,
  } = useIndividual();

  // TanStack Query Hooks for Dropdown Lookups
  const { list: titlesList } = useMasterContacts('titles');
  const { list: qualList } = useMasterContacts('qualifications');
  const { list: depList } = useMasterContacts('departments');
  const { list: degList } = useMasterContacts('designations');
  const { list: cityList } = useMasterContacts('city');
  const { list: stateList } = useMasterContacts('state');
  const { list: countryList } = useMasterContacts('countryDropdown');
  const { list: orgList } = useMasterContacts('organizationsDropdown');

  const titles = titlesList.data || [];
  const qualifications = qualList.data || [];
  const departments = depList.data || [];
  const designations = degList.data || [];
  const cities = cityList.data || [];
  const states = stateList.data || [];
  const countries = countryList.data || [];
  const organizations = orgList.data || [];

  const [formData, setFormData] = React.useState<IndividualDto>({
    pk_ind_id: '',
    fk_com_id: '',
    fk_tit_id: null,
    first_name: '',
    middle_name: '',
    surname: '',
    dob: null,
    photo: null,
    fk_qual_id: null,
    male: true,
    married: false,
    fk_org_id: null,
    fk_dep_id: null,
    fk_deg_id: null,
    fk_spo_id: null,
    anni: null,
    ext: '',
    address: '',
    fk_city_id: null,
    region: '',
    pincode: '',
    fk_state_id: null,
    fk_ctry_id: null,
    postfix: '',
  });

  const handleSelectIndividual = (ind: IndividualRecord) => {
    setSelectedInd(ind);
    setFormData(ind);
    setActiveTab('individual');
    setIsEditMode(false);
    setIsAdding(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (selectedInd) {
      setFormData(selectedInd);
    } else {
      setFormData({
        pk_ind_id: '',
        fk_com_id: '',
        fk_tit_id: null,
        first_name: '',
        middle_name: '',
        surname: '',
        dob: null,
        photo: null,
        fk_qual_id: null,
        male: true,
        married: false,
        fk_org_id: null,
        fk_dep_id: null,
        fk_deg_id: null,
        fk_spo_id: null,
        anni: null,
        ext: '',
        address: '',
        fk_city_id: null,
        region: '',
        pincode: '',
        fk_state_id: null,
        fk_ctry_id: null,
        postfix: '',
      });
    }
    setIsEditMode(false);
    setIsAdding(false);
  };

  const handleAdd = () => {
    // Generate a temporary 12 character code or leave it blank for database generation
    const tempId = `I${String(Date.now()).substring(2, 13)}`;
    setFormData({
      pk_ind_id: tempId,
      fk_com_id: 'C001',
      fk_tit_id: null,
      first_name: '',
      middle_name: '',
      surname: '',
      dob: null,
      photo: null,
      fk_qual_id: null,
      male: true,
      married: false,
      fk_org_id: null,
      fk_dep_id: null,
      fk_deg_id: null,
      fk_spo_id: null,
      anni: null,
      ext: '',
      address: '',
      fk_city_id: null,
      region: '',
      pincode: '',
      fk_state_id: null,
      fk_ctry_id: null,
      postfix: '',
    });
    setIsAdding(true);
    setIsEditMode(false);
    setSelectedInd(null);
    setActiveTab('individual');
  };

  const handleEdit = () => {
    if (!selectedInd) {
      toast.error('Please select an individual record first.');
      return;
    }
    setIsEditMode(true);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!formData.first_name.trim() || !formData.surname.trim()) {
      toast.error('First Name and Surname are required fields.');
      return;
    }

    if (isAdding) {
      createInd.mutate(formData, {
        onSuccess: (data) => {
          toast.success('Individual contact created successfully!');
          handleSelectIndividual(data);
        },
        onError: () => {
          toast.error('Failed to create individual contact.');
        },
      });
    } else if (isEditMode && selectedInd) {
      updateInd.mutate(
        { id: selectedInd.pk_ind_id, data: formData },
        {
          onSuccess: (data) => {
            toast.success('Individual contact updated successfully!');
            handleSelectIndividual(data);
          },
          onError: () => {
            toast.error('Failed to update individual contact.');
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!selectedInd) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedInd) return;
    removeInd.mutate(selectedInd.pk_ind_id, {
      onSuccess: () => {
        toast.success('Individual contact deleted successfully.');
        setSelectedInd(null);
        handleCancel();
        setActiveTab('list');
      },
      onError: () => {
        toast.error('Failed to delete individual contact.');
      },
    });
  };

  const individualActions = [
    {
      icon: Plus,
      label: 'Add',
      variant: 'primary',
      onClick: handleAdd,
      disabled: isAdding || isEditMode,
    },
    {
      icon: Edit,
      label: 'Edit',
      variant: 'secondary',
      onClick: handleEdit,
      disabled: !selectedInd || isAdding || isEditMode,
    },
    {
      icon: Trash2,
      label: 'Del',
      variant: 'danger',
      onClick: handleDelete,
      disabled: !selectedInd || isAdding || isEditMode,
    },
    { icon: RotateCcw, label: 'Undo', variant: 'outline', onClick: handleCancel },
    {
      icon: Save,
      label: 'Save',
      variant: 'primary',
      onClick: handleSave,
      disabled: !isAdding && !isEditMode,
    },
  ] as const;

  const individualUtilities = [
    { icon: RefreshCw, title: 'Refr.', onClick: () => indList.refetch() },
    { icon: Printer, title: 'Print', onClick: () => window.print() },
    { icon: Download, title: 'Exp.', onClick: () => {} },
    {
      icon: Help,
      title: 'Help',
      onClick: () => alert('Individual Contacts Master Configuration'),
    },
    { icon: LogOut, title: 'Exit', onClick: () => router.push('/masters/contacts') },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden p-4 select-none">
      {/* Action Toolbar */}
      <Toolbar
        title="Individual Contact"
        actions={individualActions}
        utilities={individualUtilities}
      />

      <div className="border-border/60 bg-card text-card-foreground relative flex w-full flex-col overflow-hidden rounded-sm border">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="border-border/80 bg-muted/15 flex items-center justify-between border-b px-6 pt-3">
            <TabsList className="bg-muted h-9 rounded-md p-0.5">
              <TabsTrigger
                value="individual"
                className="data-[state=active]:text-primary h-full rounded-sm px-5 text-xs font-semibold"
              >
                Individual
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:text-primary h-full rounded-sm px-5 text-xs font-semibold"
              >
                List
              </TabsTrigger>
            </TabsList>
            <div className="text-xs font-semibold">
              {isAdding && (
                <span className="animate-pulse text-emerald-500">Adding New Contact</span>
              )}
              {isEditMode && selectedInd && (
                <span className="text-amber-500">
                  Editing: {selectedInd.first_name} {selectedInd.surname}
                </span>
              )}
              {!isAdding && !isEditMode && selectedInd && (
                <span className="text-foreground">
                  Viewing: {selectedInd.first_name} {selectedInd.surname}
                </span>
              )}
            </div>
          </div>

          <TabsContent value="individual" className="m-0 flex-1 overflow-y-auto p-6">
            <IndividualForm
              formData={formData}
              onInputChange={handleInputChange}
              titles={titles}
              qualifications={qualifications}
              departments={departments}
              designations={designations}
              organizations={organizations}
              cities={cities}
              states={states}
              countries={countries}
              disabled={!isAdding && !isEditMode}
            />
          </TabsContent>

          <TabsContent value="list" className="m-0 flex-1 overflow-y-auto p-6">
            <IndividualList
              individuals={indList.data || []}
              selectedIndividual={selectedInd}
              onSelectIndividual={handleSelectIndividual}
              search={search}
              onSearchChange={setSearch}
              isLoading={indList.isLoading}
              t={t}
            />
          </TabsContent>
        </Tabs>
      </div>

      <DeleteDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this individual contact? This action cannot be undone."
        itemName={selectedInd ? `${selectedInd.first_name} ${selectedInd.surname}` : ''}
        isDeleting={removeInd.isPending}
      />
    </div>
  );
}
