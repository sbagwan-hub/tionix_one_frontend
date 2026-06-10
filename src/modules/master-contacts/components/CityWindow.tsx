import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterContacts } from '../hooks/useMasterContacts';
import { citySchema, CityDto } from '../types';
import WindowPanel, { WindowPanelItem } from '@/components/common/window-panel';
import { FormInput } from '@/components/common/form-input';

export const CityWindow: React.FC = () => {
  const { list, create, update, remove } = useMasterContacts('city');
  const { list: countryList } = useMasterContacts('countryDropdown');
  const { list: stateList } = useMasterContacts('stateDropdown');
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.input<typeof citySchema>, any, CityDto>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      city: '',
      fk_state_id: undefined,
      fk_ctry_id: 217, // default to India
      std_code: '',
      sync: 'N',
      sys_defined: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: CityDto) => {
    if (editingId) {
      update.mutate(
        { id: editingId as any, data },
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
      city: '',
      fk_state_id: undefined,
      fk_ctry_id: 217,
      std_code: '',
      sync: 'N',
      sys_defined: false,
    });
  };

  const handleEdit = (item: WindowPanelItem) => {
    const city = list.data?.find(
      (c: CityDto) => c.pk_city_id !== undefined && String(c.pk_city_id) === item.id,
    );
    if (city && city.pk_city_id !== undefined) {
      setEditingId(city.pk_city_id);
      form.reset({
        pk_city_id: city.pk_city_id,
        city: city.city,
        fk_state_id: city.fk_state_id ?? undefined,
        fk_ctry_id: city.fk_ctry_id ?? 217,
        std_code: city.std_code || '',
        sync: city.sync,
        sys_defined: city.sys_defined,
      });
    }
  };

  const handleDelete = (item: WindowPanelItem) => {
    remove.mutate(Number(item.id) as any);
  };

  const items: WindowPanelItem[] = (list.data || []).map((c: CityDto) => ({
    id: c.pk_city_id !== undefined ? String(c.pk_city_id) : '',
    label: `${c.city} (${c.pk_city_id})`,
  }));

  const formContent = (
    <form id="city-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <FormInput
            id="city-name-input"
            label="City Name"
            placeholder="Enter city name"
            {...form.register('city')}
          />
          {form.formState.errors.city && (
            <span className="text-destructive text-[10px]">
              {form.formState.errors.city.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">Country</label>
          <select
            id="city-country-select"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-sm border px-3 py-1 text-xs shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register('fk_ctry_id', { valueAsNumber: true })}
          >
            <option value="">Select a country...</option>
            {(countryList.data || []).map((c: any) => (
              <option key={c.pk_ctry_id} value={c.pk_ctry_id}>
                {c.country}
              </option>
            ))}
          </select>
          {form.formState.errors.fk_ctry_id && (
            <span className="text-destructive text-[10px]">
              {form.formState.errors.fk_ctry_id.message}
            </span>
          )}
        </div>
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">State</label>
          <select
            id="city-state-select"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-sm border px-3 py-1 text-xs shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register('fk_state_id', { valueAsNumber: true })}
          >
            <option value="">Select a state...</option>
            {(stateList.data || []).map((s: any) => (
              <option key={s.pk_state_id} value={s.pk_state_id}>
                {s.state}
              </option>
            ))}
          </select>
          {form.formState.errors.fk_state_id && (
            <span className="text-destructive text-[10px]">
              {form.formState.errors.fk_state_id.message}
            </span>
          )}
        </div>
        <div>
          <FormInput
            id="city-std-input"
            label="STD Code"
            placeholder="e.g. 022"
            {...form.register('std_code')}
          />
          {form.formState.errors.std_code && (
            <span className="text-destructive text-[10px]">
              {form.formState.errors.std_code.message}
            </span>
          )}
        </div>
      </div>
    </form>
  );

  return (
    <WindowPanel
      toolbarTitle="Cities"
      titleTabLabel="City Setup"
      items={items}
      onAdd={resetForm}
      onEdit={handleEdit}
      onDelete={handleDelete}
      formContent={formContent}
      formId="city-form"
      isSaving={create.isPending || update.isPending}
      onCancelTab1={resetForm}
      isSaveDisabled={!form.formState.isDirty || !form.formState.isValid}
    />
  );
};
