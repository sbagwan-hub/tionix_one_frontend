import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { addressSchema, AddressDto, CityDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const AddressWindow: React.FC = () => {
  const { list: addressList, create, update, remove } = useMasterContacts('address');
  const { list: cityList } = useMasterContacts('city');
  const { list: organizationList } = useMasterContacts('organizationsDropdown');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof addressSchema>, any, AddressDto>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: '',
      fk_city_id: undefined,
      region: '',
      pincode: '',
      fk_cont_id: null,
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: AddressDto) => {
    if (editingId) {
      update.mutate(
        { id: editingId, data },
        {
          onSuccess: () => resetForm(),
        },
      );
    } else {
      create.mutate(data, {
        onSuccess: () => resetForm(),
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    form.reset({
      address: '',
      fk_city_id: undefined,
      region: '',
      pincode: '',
      fk_cont_id: null,
      sync: 'N',
      sys_defined: false,
    });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const id = parseInt(item.id, 10);
    const addr = addressList.data?.find((a: AddressDto) => a.pk_ca_id === id);
    if (addr) {
      setEditingId(id);
      form.reset({
        pk_ca_id: addr.pk_ca_id,
        address: addr.address,
        fk_city_id: addr.fk_city_id,
        region: addr.region || '',
        pincode: addr.pincode || '',
        fk_cont_id: addr.fk_cont_id ?? null,
        sync: addr.sync,
        sys_defined: addr.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(parseInt(item.id, 10));
  };

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = parseInt(e.target.value, 10);
    if (!isNaN(orgId)) {
      const org = (organizationList.data || []).find((o: any) => o.pk_cont_id === orgId);
      if (org) {
        form.setValue('address', org.address || '', { shouldDirty: true, shouldValidate: true });
        form.setValue('fk_city_id', org.fk_city_id || undefined, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('region', org.region || '', { shouldDirty: true, shouldValidate: true });
        form.setValue('pincode', org.pincode || '', { shouldDirty: true, shouldValidate: true });
      }
    }
  };

  const items: WindowPanelItem[] = (addressList.data || []).map((a: AddressDto) => ({
    id: String(a.pk_ca_id),
    label: `${a.address}, ${a.region || ''}`,
  }));

  const selectedCityId = useWatch({ control: form.control, name: 'fk_city_id' });
  const selectedCity = (cityList.data || []).find(
    (c: any) => c.pk_city_id === selectedCityId,
  ) as any;
  const resolvedState = selectedCity?.state || '';
  const resolvedCountry = selectedCity?.country || '';

  const formContent = (
    <form id="address-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">Organization *</label>
        <select
          id="address-organization-select"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-sm border px-3 py-1 text-xs shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...form.register('fk_cont_id', { valueAsNumber: true })}
          onChange={handleOrganizationChange}
        >
          <option value="">Select an organization...</option>
          {(organizationList.data || []).map((o: any) => (
            <option key={o.pk_cont_id} value={o.pk_cont_id}>
              {o.contact_name}
            </option>
          ))}
        </select>
        {form.formState.errors.fk_cont_id && (
          <span className="text-destructive text-[10px]">
            {form.formState.errors.fk_cont_id.message}
          </span>
        )}
      </div>

      <div>
        <FormInput
          id="address-input"
          label="Address Line *"
          placeholder="Enter street/building address"
          {...form.register('address')}
        />
        {form.formState.errors.address && (
          <span className="text-destructive text-[10px]">
            {form.formState.errors.address.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">City</label>
          <select
            id="address-city-select"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-sm border px-3 py-1 text-xs shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register('fk_city_id', { valueAsNumber: true })}
          >
            <option value="">Select a city...</option>
            {(cityList.data || []).map((c: CityDto) => (
              <option key={c.pk_city_id} value={c.pk_city_id}>
                {c.city} ({c.pk_city_id})
              </option>
            ))}
          </select>
          {form.formState.errors.fk_city_id && (
            <span className="text-destructive text-[10px]">
              {form.formState.errors.fk_city_id.message}
            </span>
          )}
        </div>
        <div>
          <FormInput
            id="address-state-input"
            label="State"
            value={resolvedState}
            disabled
            readOnly
            placeholder="Auto-resolved from City"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <FormInput
            id="address-region-input"
            label="Region / Area"
            placeholder="Enter region"
            {...form.register('region')}
          />
          {form.formState.errors.region && (
            <span className="text-destructive text-[10px]">
              {form.formState.errors.region.message}
            </span>
          )}
        </div>
        <div>
          <FormInput
            id="address-pincode-input"
            label="Pincode / ZIP"
            placeholder="ZIP code"
            {...form.register('pincode')}
          />
          {form.formState.errors.pincode && (
            <span className="text-destructive text-[10px]">
              {form.formState.errors.pincode.message}
            </span>
          )}
        </div>
        <div>
          <FormInput
            id="address-country-input"
            label="Country"
            value={resolvedCountry}
            disabled
            readOnly
            placeholder="Auto-resolved from City"
          />
        </div>
      </div>
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Addresses"
      titleTabLabel="Address Setup"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="address-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
      className="h-[380px]"
    />
  );
};
