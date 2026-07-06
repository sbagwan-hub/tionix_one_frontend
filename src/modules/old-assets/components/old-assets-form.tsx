'use client';

import * as React from 'react';
import { Eye, PlusCircle, Settings2, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/common/form-input';
import { Chip } from '@/components/common/chip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormSelect from '@/components/common/form-select';
import { AccountLookup, SupplierLookup, ProductLookup, BrandLookup, CategoryLookup, LocationLookup } from '../types';

interface OldAssetsFormProps {
  asset_code: string;
  set_asset_code: (val: string) => void;
  description: string;
  set_description: (val: string) => void;
  fk_acct_id: number | null;
  set_fk_acct_id: (val: number | null) => void;
  fk_s_acct_id: number | null;
  set_fk_s_acct_id: (val: number | null) => void;
  fk_prod_id: number | null;
  set_fk_prod_id: (val: number | null) => void;
  status: boolean;
  set_status: (val: boolean) => void;
  pur_date: string;
  set_pur_date: (val: string) => void;
  pur_rate: number | '';
  set_pur_rate: (val: number | '') => void;
  invoice_no: string;
  set_invoice_no: (val: string) => void;
  serial_no: string;
  set_serial_no: (val: string) => void;
  fk_loc_id: number | null;
  set_fk_loc_id: (val: number | null) => void;
  fk_cat_id: number | null;
  set_fk_cat_id: (val: number | null) => void;
  p_size: string;
  set_p_size: (val: string) => void;
  fk_brd_id: number | null;
  set_fk_brd_id: (val: number | null) => void;
  cat_no: string;
  set_cat_no: (val: string) => void;
  exp_date: string;
  set_exp_date: (val: string) => void;
  cur_value: number | '';
  set_cur_value: (val: number | '') => void;
  usage: string;
  set_usage: (val: string) => void;
  condition: string;
  set_condition: (val: string) => void;
  c_location: string;
  set_c_location: (val: string) => void;
  c_person: string;
  set_c_person: (val: string) => void;
  c_details: string;
  set_c_details: (val: string) => void;
  c_address: string;
  set_c_address: (val: string) => void;
  issued_date: string;
  set_issued_date: (val: string) => void;
  remarks: string;
  set_remarks: (val: string) => void;

  is_editing: boolean;
  mode: 'view' | 'add' | 'edit';
  form_input_ref: React.RefObject<HTMLInputElement | null>;
  accounts: AccountLookup[];
  suppliers: SupplierLookup[];
  products: ProductLookup[];
  brands: BrandLookup[];
  categories: CategoryLookup[];
  locations: LocationLookup[];
}

export function OldAssetsForm({
  asset_code,
  set_asset_code,
  description,
  set_description,
  fk_acct_id,
  set_fk_acct_id,
  fk_s_acct_id,
  set_fk_s_acct_id,
  fk_prod_id,
  set_fk_prod_id,
  status,
  set_status,
  pur_date,
  set_pur_date,
  pur_rate,
  set_pur_rate,
  invoice_no,
  set_invoice_no,
  serial_no,
  set_serial_no,
  fk_loc_id,
  set_fk_loc_id,
  fk_cat_id,
  set_fk_cat_id,
  p_size,
  set_p_size,
  fk_brd_id,
  set_fk_brd_id,
  cat_no,
  set_cat_no,
  exp_date,
  set_exp_date,
  cur_value,
  set_cur_value,
  usage,
  set_usage,
  condition,
  set_condition,
  c_location,
  set_c_location,
  c_person,
  set_c_person,
  c_details,
  set_c_details,
  c_address,
  set_c_address,
  issued_date,
  set_issued_date,
  remarks,
  set_remarks,
  is_editing,
  mode,
  form_input_ref,
  accounts,
  suppliers,
  products,
  brands,
  categories,
  locations,
}: OldAssetsFormProps) {
  const handleProductChange = (valStr: string) => {
    const prodId = parseInt(valStr, 10);
    set_fk_prod_id(prodId);
    const selectedProd = products.find((p) => p.pk_prod_id === prodId);
    if (selectedProd && !description) {
      set_description(selectedProd.prod_name);
    }
  };

  const usageOptions = ['In Use', 'Transferred', 'Written Off', 'Sold', 'Scrapped'];
  const conditionOptions = ['Good', 'Fair', 'Poor', 'Damaged'];

  return (
    <div className="from-card to-card/70 scrollbar-thumb-muted-foreground/15 relative flex h-full min-h-0 w-full scrollbar-thin scrollbar-track-transparent flex-col overflow-y-auto bg-linear-to-b p-5 transition-all duration-300">
      {/* Header status chips */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-foreground text-xxs font-bold tracking-widest uppercase">
          Old Asset Details
        </span>

        {!is_editing ? (
          <Chip label="Read-Only Mode" variant="neutral" icon={Eye} />
        ) : mode === 'add' ? (
          <Chip label="Add Mode" variant="primary" icon={PlusCircle} pulse />
        ) : (
          <Chip label="Edit Mode" variant="primary" icon={Settings2} pulse />
        )}
      </div>

      <div className="space-y-6 pr-1 pb-16">
        {/* Main 2-column layout matching VB6 top portion */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <FormInput
              ref={form_input_ref}
              label={<span>Asset Code {is_editing && <span className="text-destructive">*</span>}</span>}
              value={asset_code}
              onChange={(e) => set_asset_code(e.target.value)}
              disabled={!is_editing || mode === 'edit'}
              placeholder="Enter Asset Code"
              className="h-9 font-mono text-xs"
            />

            <FormInput
              label={<span>Asset Description {is_editing && <span className="text-destructive">*</span>}</span>}
              value={description}
              onChange={(e) => set_description(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Asset Description"
              className="h-9 text-xs"
            />

            <div className="space-y-1.5">
              {is_editing ? (
                <FormSelect
                  label={<span>Product Code {is_editing && <span className="text-destructive">*</span>}</span>}
                  value={fk_prod_id ? String(fk_prod_id) : undefined}
                  onValueChange={handleProductChange}
                  placeholder="Select Product Code"
                  className="border-border/85 h-9 w-full font-mono text-xs"
                  options={products.map((prod) => ({
                    value: String(prod.pk_prod_id),
                    label: prod.prod_code,
                  }))}
                />
              ) : (
                <>
                  <Label className="text-foreground/80 text-xs font-semibold">Product Code</Label>
                  <Input
                    value={products.find((p) => p.pk_prod_id === fk_prod_id)?.prod_code || ''}
                    disabled
                    className="h-9 font-mono text-xs"
                  />
                </>
              )}
            </div>

            <div className="space-y-1.5">
              {is_editing ? (
                <FormSelect
                  label={<span>Product {is_editing && <span className="text-destructive">*</span>}</span>}
                  value={fk_prod_id ? String(fk_prod_id) : undefined}
                  onValueChange={handleProductChange}
                  placeholder="Select Product Name"
                  className="border-border/85 h-9 w-full text-xs"
                  options={products.map((prod) => ({
                    value: String(prod.pk_prod_id),
                    label: prod.prod_name,
                  }))}
                />
              ) : (
                <>
                  <Label className="text-foreground/80 text-xs font-semibold">Product</Label>
                  <Input
                    value={products.find((p) => p.pk_prod_id === fk_prod_id)?.prod_name || ''}
                    disabled
                    className="h-9 text-xs"
                  />
                </>
              )}
            </div>

            <div className="space-y-1.5">
              {is_editing ? (
                <FormSelect
                  label={<span>Asset Account {is_editing && <span className="text-destructive">*</span>}</span>}
                  value={fk_acct_id ? String(fk_acct_id) : undefined}
                  onValueChange={(val) => set_fk_acct_id(parseInt(val, 10))}
                  placeholder="Select Account"
                  className="border-border/85 h-9 w-full text-xs"
                  options={accounts.map((acct) => ({
                    value: String(acct.pk_acct_id),
                    label: `${acct.account} (${acct.acct_code})`,
                  }))}
                />
              ) : (
                <>
                  <Label className="text-foreground/80 text-xs font-semibold">Asset Account</Label>
                  <Input
                    value={accounts.find((a) => a.pk_acct_id === fk_acct_id)?.account || ''}
                    disabled
                    className="h-9 text-xs"
                  />
                </>
              )}
            </div>

            <div className="space-y-1.5">
              {is_editing ? (
                <FormSelect
                  label={<span>Supplier</span>}
                  value={fk_s_acct_id ? String(fk_s_acct_id) : undefined}
                  onValueChange={(val) => set_fk_s_acct_id(val ? parseInt(val, 10) : null)}
                  placeholder="Select Supplier"
                  className="border-border/85 h-9 w-full text-xs"
                  options={suppliers.map((acct) => ({
                    value: String(acct.pk_acct_id),
                    label: `${acct.account} (${acct.acct_code})`,
                  }))}
                />
              ) : (
                <>
                  <Label className="text-foreground/80 text-xs font-semibold">Supplier</Label>
                  <Input
                    value={suppliers.find((a) => a.pk_acct_id === fk_s_acct_id)?.account || ''}
                    disabled
                    className="h-9 text-xs"
                  />
                </>
              )}
            </div>

            <FormInput
              label="Invoice No."
              value={invoice_no}
              onChange={(e) => set_invoice_no(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Invoice No."
              className="h-9 text-xs font-mono"
            />

            <div className="space-y-1.5">
              <Label className="text-foreground/80 text-xs font-semibold">
                Purchase Date {is_editing && <span className="text-destructive">*</span>}
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  value={pur_date}
                  onChange={(e) => set_pur_date(e.target.value)}
                  disabled={!is_editing}
                  className="h-9 pr-8 text-xs font-mono"
                />
                <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-4 w-4" />
              </div>
            </div>

            <FormInput
              label={<span>Purchase Rate {is_editing && <span className="text-destructive">*</span>}</span>}
              type="number"
              value={pur_rate}
              onChange={(e) => set_pur_rate(e.target.value === '' ? '' : parseFloat(e.target.value))}
              disabled={!is_editing}
              placeholder="0.00"
              className="h-9 text-xs"
            />

            <FormInput
              label="Serial No."
              value={serial_no}
              onChange={(e) => set_serial_no(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Serial No."
              className="h-9 text-xs font-mono"
            />

            <div className="space-y-1.5">
              {is_editing ? (
                <FormSelect
                  label="Current Status"
                  value={usage}
                  onValueChange={set_usage}
                  placeholder="Select Current Status"
                  className="border-border/85 h-9 w-full text-xs"
                  options={usageOptions.map((opt) => ({
                    value: opt,
                    label: opt,
                  }))}
                />
              ) : (
                <>
                  <Label className="text-foreground/80 text-xs font-semibold">Current Status</Label>
                  <Input value={usage} disabled className="h-9 text-xs" />
                </>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground/80 text-xs font-semibold">Remarks</Label>
              <textarea
                value={remarks}
                onChange={(e) => set_remarks(e.target.value)}
                disabled={!is_editing}
                placeholder="Enter Remarks"
                rows={2}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-foreground/80 text-xs font-semibold">Status</Label>
              <RadioGroup
                value={status ? 'active' : 'inactive'}
                onValueChange={(val) => set_status(val === 'active')}
                disabled={!is_editing}
                className="flex h-9 items-center gap-4 text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="active" id="status-active" />
                  <Label htmlFor="status-active" className="text-foreground/80 cursor-pointer text-xs font-normal">
                    Active
                  </Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="inactive" id="status-inactive" />
                  <Label htmlFor="status-inactive" className="text-foreground/80 cursor-pointer text-xs font-normal">
                    Inactive
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              {is_editing ? (
                <FormSelect
                  label="Category"
                  value={fk_cat_id ? String(fk_cat_id) : undefined}
                  onValueChange={(val) => set_fk_cat_id(val ? parseInt(val, 10) : null)}
                  placeholder="Select Category"
                  className="border-border/85 h-9 w-full text-xs"
                  options={categories.map((cat) => ({
                    value: String(cat.pk_p_cat_id),
                    label: cat.p_category,
                  }))}
                />
              ) : (
                <>
                  <Label className="text-foreground/80 text-xs font-semibold">Category</Label>
                  <Input
                    value={categories.find((c) => c.pk_p_cat_id === fk_cat_id)?.p_category || ''}
                    disabled
                    className="h-9 text-xs"
                  />
                </>
              )}
            </div>

            <FormInput
              label="Size"
              value={p_size}
              onChange={(e) => set_p_size(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Size"
              className="h-9 text-xs"
            />

            <div className="space-y-1.5">
              {is_editing ? (
                <FormSelect
                  label="Make (Brand)"
                  value={fk_brd_id ? String(fk_brd_id) : undefined}
                  onValueChange={(val) => set_fk_brd_id(val ? parseInt(val, 10) : null)}
                  placeholder="Select Brand"
                  className="border-border/85 h-9 w-full text-xs"
                  options={brands.map((brd) => ({
                    value: String(brd.pk_brd_id),
                    label: brd.brand,
                  }))}
                />
              ) : (
                <>
                  <Label className="text-foreground/80 text-xs font-semibold">Make (Brand)</Label>
                  <Input
                    value={brands.find((b) => b.pk_brd_id === fk_brd_id)?.brand || ''}
                    disabled
                    className="h-9 text-xs"
                  />
                </>
              )}
            </div>

            <FormInput
              label="Catalog No."
              value={cat_no}
              onChange={(e) => set_cat_no(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Catalog No."
              className="h-9 text-xs font-mono"
            />

            <div className="space-y-1.5">
              <Label className="text-foreground/80 text-xs font-semibold">Expiry Date</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={exp_date}
                  onChange={(e) => set_exp_date(e.target.value)}
                  disabled={!is_editing}
                  className="h-9 pr-8 text-xs font-mono"
                />
                <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-4 w-4" />
              </div>
            </div>

            <FormInput
              label="Current Value"
              type="number"
              value={cur_value}
              onChange={(e) => set_cur_value(e.target.value === '' ? '' : parseFloat(e.target.value))}
              disabled={!is_editing}
              placeholder="0.00"
              className="h-9 text-xs"
            />

            <div className="space-y-1.5">
              {is_editing ? (
                <FormSelect
                  label={<span>Installed Location {is_editing && <span className="text-destructive">*</span>}</span>}
                  value={fk_loc_id ? String(fk_loc_id) : undefined}
                  onValueChange={(val) => set_fk_loc_id(parseInt(val, 10))}
                  placeholder="Select Installed Location"
                  className="border-border/85 h-9 w-full text-xs"
                  options={locations.map((loc) => ({
                    value: String(loc.pk_loc_id),
                    label: loc.location,
                  }))}
                />
              ) : (
                <>
                  <Label className="text-foreground/80 text-xs font-semibold">Installed Location</Label>
                  <Input
                    value={locations.find((l) => l.pk_loc_id === fk_loc_id)?.location || ''}
                    disabled
                    className="h-9 text-xs"
                  />
                </>
              )}
            </div>

            <div className="space-y-1.5">
              {is_editing ? (
                <FormSelect
                  label="Condition"
                  value={condition}
                  onValueChange={set_condition}
                  placeholder="Select Condition"
                  className="border-border/85 h-9 w-full text-xs"
                  options={conditionOptions.map((opt) => ({
                    value: opt,
                    label: opt,
                  }))}
                />
              ) : (
                <>
                  <Label className="text-foreground/80 text-xs font-semibold">Condition</Label>
                  <Input value={condition} disabled className="h-9 text-xs" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION ("Asset is installed outside the premises") */}
        <div className="border-t pt-4 mt-6 space-y-4">
          <h3 className="text-sm font-bold tracking-tight text-foreground underline decoration-primary underline-offset-4">
            Asset is installed outside the premises
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Portion of Custody */}
            <div className="space-y-4">
              <FormInput
                label="Current Location"
                value={c_location}
                onChange={(e) => set_c_location(e.target.value)}
                disabled={!is_editing}
                placeholder="Enter Current Location"
                className="h-9 text-xs"
              />

              <FormInput
                label="Contact Person"
                value={c_person}
                onChange={(e) => set_c_person(e.target.value)}
                disabled={!is_editing}
                placeholder="Enter Contact Person"
                className="h-9 text-xs"
              />

              <FormInput
                label="Contact Details"
                value={c_details}
                onChange={(e) => set_c_details(e.target.value)}
                disabled={!is_editing}
                placeholder="Enter Contact Details"
                className="h-9 text-xs font-mono"
              />
            </div>

            {/* Right Portion of Custody */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-foreground/80 text-xs font-semibold">Issued Date</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={issued_date}
                    onChange={(e) => set_issued_date(e.target.value)}
                    disabled={!is_editing}
                    className="h-9 pr-8 text-xs font-mono"
                  />
                  <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-4 w-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground/80 text-xs font-semibold">Current Address</Label>
                <textarea
                  value={c_address}
                  onChange={(e) => set_c_address(e.target.value)}
                  disabled={!is_editing}
                  placeholder="Enter Current Address"
                  rows={3}
                  className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
