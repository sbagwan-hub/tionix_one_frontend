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
import { Chip } from '@/components/common/chip';
import { useMasterContacts } from '@/modules/master-contacts/hooks/useMasterContacts';
import { useOrganisation } from '@/modules/master-contacts/hooks/use-organisation';
import { useIndividual } from '@/modules/master-contacts/hooks/use-individual';
import { OrganisationForm } from '@/modules/master-contacts/components/OrganisationForm';
import { OrganisationList } from '@/modules/master-contacts/components/OrganisationList';
import { OrganisationDto, OrganisationRecord } from '@/modules/master-contacts/types';

export default function OrganisationContactsPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = React.useState('organisation');
  const [selectedOrg, setSelectedOrg] = React.useState<OrganisationRecord | null>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(15);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  // TanStack Query Hooks for Organisations
  const {
    list: orgList,
    create: createOrg,
    update: updateOrg,
    remove: removeOrg,
  } = useOrganisation({ page, limit: pageSize, search });

  // Fetch all individuals to resolve contact persons dynamically
  const { list: allIndividualsList } = useIndividual({ page: 1, limit: 1000 });
  const individuals = allIndividualsList.data?.data || [];

  // TanStack Query Hooks for Dropdown Lookups
  const { list: cityList } = useMasterContacts('city');
  const { list: stateList } = useMasterContacts('state');
  const { list: countryList } = useMasterContacts('countryDropdown');
  const { list: categoriesList } = useMasterContacts('categories');

  const cities = cityList.data || [];
  const states = stateList.data || [];
  const countries = countryList.data || [];
  const categories = categoriesList.data || [];

  const [formData, setFormData] = React.useState<OrganisationDto>({
    pk_cont_id: undefined,
    contact_name: '',
    postfix: '',
    address: '',
    fk_city_id: null,
    region: '',
    pincode: '',
    fk_state_id: null,
    fk_ctry_id: null,
    categoryIds: [],
    contacts: [],
    documents: [],
  });

  const handleSelectOrganisation = (org: OrganisationRecord) => {
    if (selectedOrg && selectedOrg.pk_cont_id === org.pk_cont_id) {
      handleCancel();
    } else {
      setSelectedOrg(org);
      setFormData(org);
      setIsEditMode(false);
      setIsAdding(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setSelectedOrg(null);
    setFormData({
      pk_cont_id: undefined,
      contact_name: '',
      postfix: '',
      address: '',
      fk_city_id: null,
      region: '',
      pincode: '',
      fk_state_id: null,
      fk_ctry_id: null,
      categoryIds: [],
      contacts: [],
      documents: [],
    });
    setIsEditMode(false);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      pk_cont_id: undefined,
      contact_name: '',
      postfix: '',
      address: '',
      fk_city_id: null,
      region: '',
      pincode: '',
      fk_state_id: null,
      fk_ctry_id: null,
      categoryIds: [],
      contacts: [],
      documents: [],
    });
    setIsAdding(true);
    setIsEditMode(false);
    setSelectedOrg(null);
    setActiveTab('organisation');
  };

  const handleEdit = () => {
    if (!selectedOrg) {
      toast.error('Please select an organisation record first.');
      return;
    }
    setIsEditMode(true);
    setIsAdding(false);
    setActiveTab('organisation');
  };

  const handleSave = () => {
    if (!formData.contact_name.trim()) {
      toast.error('Organisation Name is required.');
      return;
    }

    const sanitizePayload = (data: OrganisationDto) => {
      return {
        ...data,
        fk_city_id: data.fk_city_id ? Number(data.fk_city_id) : null,
        fk_state_id: data.fk_state_id ? Number(data.fk_state_id) : null,
        fk_ctry_id: data.fk_ctry_id ? Number(data.fk_ctry_id) : null,
      };
    };

    if (isAdding) {
      const { pk_cont_id, ...rest } = formData;
      const payload = sanitizePayload(rest as any);
      createOrg.mutate(payload as any, {
        onSuccess: () => {
          setSelectedOrg(null);
          handleCancel();
          toast.success('Organisation added successfully.');
        },
      });
    } else if (isEditMode && selectedOrg) {
      const payload = sanitizePayload(formData);
      updateOrg.mutate(
        { id: String(selectedOrg.pk_cont_id), data: payload as any },
        {
          onSuccess: () => {
            setSelectedOrg(null);
            handleCancel();
            toast.success('Organisation updated successfully.');
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!selectedOrg) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedOrg) return;
    removeOrg.mutate(String(selectedOrg.pk_cont_id), {
      onSuccess: () => {
        setSelectedOrg(null);
        handleCancel();
        setActiveTab('list');
        toast.success('Organisation deleted successfully.');
      },
    });
  };

  const organisationActions = [
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
      disabled: !selectedOrg || isAdding || isEditMode,
    },
    {
      icon: Trash2,
      label: 'Delete',
      variant: 'danger',
      onClick: handleDelete,
      disabled: !selectedOrg || isAdding || isEditMode,
    },
    { icon: RotateCcw, label: 'Cancel', variant: 'outline', onClick: handleCancel },
    {
      icon: Save,
      label: 'Save',
      variant: 'primary',
      onClick: handleSave,
      disabled: !isAdding && !isEditMode,
    },
  ] as const;

  const organisationUtilities = [
    { icon: RefreshCw, title: 'Refr.', onClick: () => orgList.refetch() },
    { icon: Printer, title: 'Print', onClick: () => window.print() },
    { icon: Download, title: 'Exp.', onClick: () => {} },
    {
      icon: Help,
      title: 'Help',
      onClick: () => alert('Organisation Contacts Master Configuration'),
    },
    { icon: LogOut, title: 'Exit', onClick: () => router.push('/masters/contacts') },
  ];

  return (
    <div className="mt-2 flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden select-none">
      {/* Action Toolbar */}
      <Toolbar
        title="Organisation Master"
        actions={organisationActions}
        utilities={organisationUtilities}
      />

      <div className="border-border/60 bg-card text-card-foreground relative mt-4 flex w-full flex-col overflow-hidden rounded-sm border">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="border-border/80 bg-muted/15 flex items-center justify-between border-b p-2">
            <TabsList className="bg-muted h-9 rounded-md p-0.5">
              <TabsTrigger
                value="organisation"
                className="data-[state=active]:text-primary h-full rounded-sm px-5 text-xs font-semibold"
              >
                Organisation
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:text-primary h-full rounded-sm px-5 text-xs font-semibold"
              >
                List
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              {(createOrg.isPending || updateOrg.isPending) && (
                <Chip label="Saving..." variant="primary" pulse />
              )}
              {isAdding && !(createOrg.isPending || updateOrg.isPending) && (
                <Chip label="Adding New Organisation" variant="primary" pulse />
              )}
              {isEditMode && selectedOrg && !(createOrg.isPending || updateOrg.isPending) && (
                <Chip label={`Editing: ${selectedOrg.contact_name}`} variant="primary" pulse />
              )}
              {!isAdding && !isEditMode && selectedOrg && (
                <Chip label={`Viewing: ${selectedOrg.contact_name}`} variant="neutral" />
              )}
            </div>
          </div>

          <TabsContent value="organisation" className="m-0 flex-1 overflow-y-auto p-6">
            <OrganisationForm
              formData={formData}
              onInputChange={handleInputChange}
              cities={cities}
              states={states}
              countries={countries}
              categories={categories}
              individuals={individuals}
              disabled={!isAdding && !isEditMode}
            />
          </TabsContent>

          <TabsContent value="list" className="m-0 flex-1 overflow-y-auto p-6">
            <OrganisationList
              organisations={orgList.data?.data || []}
              totalRecords={orgList.data?.meta?.total || 0}
              currentPage={page}
              onPageChange={setPage}
              pageSize={pageSize}
              selectedOrganisation={selectedOrg}
              onSelectOrganisation={handleSelectOrganisation}
              onDoubleClickOrganisation={(org) => {
                setSelectedOrg(org);
                setFormData(org);
                setIsEditMode(false);
                setIsAdding(false);
                setActiveTab('organisation');
              }}
              search={search}
              onSearchChange={setSearch}
              isLoading={orgList.isLoading}
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
        description="Are you sure you want to permanently delete this organisation contact? This action cannot be undone."
        itemName={selectedOrg ? selectedOrg.contact_name : ''}
        isDeleting={removeOrg.isPending}
      />
    </div>
  );
}
