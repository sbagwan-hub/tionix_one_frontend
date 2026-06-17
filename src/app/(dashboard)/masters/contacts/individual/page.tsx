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
  Eye,
} from 'lucide-react';
import Toolbar from '@/components/shared/toolbar';
import { DeleteDialog } from '@/components/common/delete-dialog';
import { Chip } from '@/components/common/chip';
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
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(15);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  // TanStack Query Hooks for Individual Contacts
  const {
    list: indList,
    create: createInd,
    update: updateInd,
    remove: removeInd,
  } = useIndividual({ page, limit: pageSize, search });

  const { list: allIndividualsList } = useIndividual({ page: 1, limit: 1000 });
  const individuals = allIndividualsList.data?.data || [];

  // TanStack Query Hooks for Dropdown Lookups
  const { list: titlesList } = useMasterContacts('titles');
  const { list: qualList } = useMasterContacts('qualifications');
  const { list: depList } = useMasterContacts('departments');
  const { list: degList } = useMasterContacts('designations');
  const { list: cityList } = useMasterContacts('city');
  const { list: stateList } = useMasterContacts('state');
  const { list: countryList } = useMasterContacts('countryDropdown');
  const { list: orgList } = useMasterContacts('organizationsDropdown');
  const { list: gendersList } = useMasterContacts('genders');
  const { list: maritalStatusesList } = useMasterContacts('maritalStatuses');

  const titles = titlesList.data || [];
  const qualifications = qualList.data || [];
  const departments = depList.data || [];
  const designations = degList.data || [];
  const cities = cityList.data || [];
  const states = stateList.data || [];
  const countries = countryList.data || [];
  const organizations = orgList.data || [];
  const genders = gendersList.data || [];
  const maritalStatuses = maritalStatusesList.data || [];

  const [formData, setFormData] = React.useState<IndividualDto>({
    pk_ind_id: undefined,
    fk_com_id: '',
    fk_tit_id: null,
    first_name: '',
    middle_name: '',
    surname: '',
    dob: null,
    photo: null,
    fk_qual_id: null,
    gender: 'male',
    marital_status: 'single',
    fk_org_id: null,
    fk_dep_id: null,
    fk_deg_id: null,
    fk_spo_id: null,
    anniversary: null,
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
    if (selectedInd && selectedInd.pk_ind_id === ind.pk_ind_id) {
      handleCancel();
    } else {
      setSelectedInd(ind);
      setFormData(ind);
      setIsEditMode(false);
      setIsAdding(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setSelectedInd(null);
    setFormData({
      pk_ind_id: undefined,
      fk_com_id: '',
      fk_tit_id: null,
      first_name: '',
      middle_name: '',
      surname: '',
      dob: null,
      photo: null,
      fk_qual_id: null,
      gender: 'male',
      marital_status: 'single',
      fk_org_id: null,
      fk_dep_id: null,
      fk_deg_id: null,
      fk_spo_id: null,
      anniversary: null,
      ext: '',
      address: '',
      fk_city_id: null,
      region: '',
      pincode: '',
      fk_state_id: null,
      fk_ctry_id: null,
      postfix: '',
    });
    setIsEditMode(false);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      pk_ind_id: undefined,
      fk_com_id: '',
      fk_tit_id: null,
      first_name: '',
      middle_name: '',
      surname: '',
      dob: null,
      photo: null,
      fk_qual_id: null,
      gender: 'male',
      marital_status: 'single',
      fk_org_id: null,
      fk_dep_id: null,
      fk_deg_id: null,
      fk_spo_id: null,
      anniversary: null,
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

  const handleView = () => {
    if (!selectedInd) {
      toast.error('Please select an individual record first.');
      return;
    }
    setIsEditMode(false);
    setIsAdding(false);
    setActiveTab('individual');
  };

  const handleEdit = () => {
    if (!selectedInd) {
      toast.error('Please select an individual record first.');
      return;
    }
    setIsEditMode(true);
    setIsAdding(false);
    setActiveTab('individual');
  };
  const handleSave = () => {
    if (!formData.first_name.trim() || !formData.surname.trim()) {
      toast.error('First Name and Surname are required fields.');
      return;
    }

    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        toast.error('Individual must be at least 18 years old.');
        return;
      }
    }

    const sanitizePayload = (data: IndividualDto) => {
      return {
        ...data,
        fk_com_id: data.fk_com_id ? Number(data.fk_com_id) : undefined,
        fk_tit_id: data.fk_tit_id ? Number(data.fk_tit_id) : null,
        fk_qual_id: data.fk_qual_id ? Number(data.fk_qual_id) : null,
        fk_org_id: data.fk_org_id ? Number(data.fk_org_id) : null,
        fk_dep_id: data.fk_dep_id ? Number(data.fk_dep_id) : null,
        fk_deg_id: data.fk_deg_id ? Number(data.fk_deg_id) : null,
        fk_spo_id: data.fk_spo_id ? Number(data.fk_spo_id) : null,
        fk_city_id: data.fk_city_id ? Number(data.fk_city_id) : null,
        fk_state_id: data.fk_state_id ? Number(data.fk_state_id) : null,
        fk_ctry_id: data.fk_ctry_id ? Number(data.fk_ctry_id) : null,
      };
    };

    if (isAdding) {
      const { pk_ind_id, ...rest } = formData;
      const payload = sanitizePayload(rest as any);
      createInd.mutate(payload as any, {
        onSuccess: () => {
          setSelectedInd(null);
          handleCancel();
        },
      });
    } else if (isEditMode && selectedInd) {
      const payload = sanitizePayload(formData);
      updateInd.mutate(
        { id: String(selectedInd.pk_ind_id), data: payload as any },
        {
          onSuccess: () => {
            setSelectedInd(null);
            handleCancel();
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
    removeInd.mutate(String(selectedInd.pk_ind_id), {
      onSuccess: () => {
        setSelectedInd(null);
        handleCancel();
        setActiveTab('list');
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
      label: 'Delete',
      variant: 'danger',
      onClick: handleDelete,
      disabled: !selectedInd || isAdding || isEditMode,
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
    <div className="mt-2 flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden select-none">
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
          <div className="border-border/80 bg-muted/15 flex items-center justify-between border-b p-2">
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
            <div className="flex items-center gap-2">
              {(createInd.isPending || updateInd.isPending) && (
                <Chip label="Saving..." variant="primary" pulse />
              )}
              {isAdding && !(createInd.isPending || updateInd.isPending) && (
                <Chip label="Adding New Contact" variant="primary" pulse />
              )}
              {isEditMode && selectedInd && !(createInd.isPending || updateInd.isPending) && (
                <Chip
                  label={`Editing: ${selectedInd.first_name} ${selectedInd.surname}`}
                  variant="primary"
                  pulse
                />
              )}
              {!isAdding && !isEditMode && selectedInd && (
                <Chip
                  label={`Viewing: ${selectedInd.first_name} ${selectedInd.surname}`}
                  variant="neutral"
                />
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
              genders={genders}
              maritalStatuses={maritalStatuses}
              individuals={individuals}
              disabled={!isAdding && !isEditMode}
            />
          </TabsContent>

          <TabsContent value="list" className="m-0 flex-1 overflow-y-auto p-6">
            <IndividualList
              individuals={indList.data?.data || []}
              totalRecords={indList.data?.meta?.total || 0}
              currentPage={page}
              onPageChange={setPage}
              pageSize={pageSize}
              selectedIndividual={selectedInd}
              onSelectIndividual={handleSelectIndividual}
              onDoubleClickIndividual={(ind) => {
                setSelectedInd(ind);
                setFormData(ind);
                setIsEditMode(false);
                setIsAdding(false);
                setActiveTab('individual');
              }}
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
