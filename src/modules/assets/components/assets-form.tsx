'use client';

import * as React from 'react';
import { Eye, PlusCircle, Settings2, Plus, Trash2, Calendar, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/common/form-input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Asset, AssetPartItem, AccountLookup, ProductLookup } from '../types';

interface AssetsFormProps {
  asset_code: string;
  set_asset_code: (val: string) => void;
  description: string;
  set_description: (val: string) => void;
  fk_prod_id: number | null;
  set_fk_prod_id: (val: number | null) => void;
  fk_acct_id: number | null;
  set_fk_acct_id: (val: number | null) => void;
  status: boolean;
  set_status: (val: boolean) => void;
  condition: string;
  set_condition: (val: string) => void;
  exp_date: string;
  set_exp_date: (val: string) => void;
  parts: AssetPartItem[];
  set_parts: (val: AssetPartItem[]) => void;
  additional_asset_codes_str: string;
  set_additional_asset_codes_str: (val: string) => void;

  is_editing: boolean;
  mode: 'view' | 'add' | 'edit';
  selected_id: number | string | null;
  is_sys_defined: boolean;
  records: Asset[];
  cursor: number;
  form_input_ref: React.RefObject<HTMLInputElement | null>;
  accounts: AccountLookup[];
  products: ProductLookup[];
}

export function AssetsForm({
  asset_code,
  set_asset_code,
  description,
  set_description,
  fk_prod_id,
  set_fk_prod_id,
  fk_acct_id,
  set_fk_acct_id,
  status,
  set_status,
  condition,
  set_condition,
  exp_date,
  set_exp_date,
  parts,
  set_parts,
  additional_asset_codes_str,
  set_additional_asset_codes_str,
  is_editing,
  mode,
  selected_id,
  is_sys_defined,
  records,
  cursor,
  form_input_ref,
  accounts,
  products,
}: AssetsFormProps) {
  // Sync product selection with description if description is empty when selecting main product
  const handleProductChange = (valStr: string) => {
    const prodId = parseInt(valStr, 10);
    set_fk_prod_id(prodId);
    const selectedProd = products.find((p) => p.pk_prod_id === prodId);
    if (selectedProd && !description) {
      set_description(selectedProd.prod_name);
    }
  };

  const handleAddPart = () => {
    set_parts([
      ...parts,
      {
        fk_prod_id: products[0]?.pk_prod_id || 0,
        description: '',
        quantity: 1,
      },
    ]);
  };

  const handleRemovePart = (index: number) => {
    set_parts(parts.filter((_, i) => i !== index));
  };

  const handlePartChange = (index: number, field: keyof AssetPartItem, value: any) => {
    const updated = [...parts];
    const currentPart = updated[index];
    if (currentPart) {
      updated[index] = { ...currentPart, [field]: value };
      set_parts(updated);
    }
  };

  const conditionOptions = ['Good', 'Fair', 'Poor', 'Damaged'];

  return (
    <div className="from-card to-card/70 scrollbar-thumb-muted-foreground/15 relative flex h-full min-h-0 w-full scrollbar-thin scrollbar-track-transparent flex-col overflow-y-auto bg-linear-to-b p-5 transition-all duration-300 md:col-span-8">
      {/* Dynamic Status Badges */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-foreground text-xxs font-bold tracking-widest uppercase">
          Asset Information
        </span>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium shadow-2xs transition-all duration-300 ${
            !is_editing
              ? 'border-blue-500/10 bg-blue-500/5 text-blue-600 dark:text-blue-400'
              : mode === 'add'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }`}
        >
          {!is_editing ? (
            <>
              <Eye className="h-3 w-3" />
              <span>Read-Only Mode</span>
            </>
          ) : mode === 'add' ? (
            <>
              <PlusCircle className="h-3 w-3 animate-pulse" />
              <span>Add Mode</span>
            </>
          ) : (
            <>
              <Settings2 className="h-3 w-3" />
              <span>Edit Mode</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 pr-1 pb-16">
        {/* Row 1: Asset Code & Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormInput
              ref={form_input_ref}
              label={
                <span>Asset Code {is_editing && <span className="text-destructive">*</span>}</span>
              }
              value={asset_code}
              onChange={(e) => set_asset_code(e.target.value)}
              disabled={!is_editing || mode === 'edit'}
              placeholder="Enter Asset Code"
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">Status</Label>
            <div className="flex h-9 items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === true}
                  onChange={() => set_status(true)}
                  disabled={!is_editing}
                  className="accent-primary"
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === false}
                  onChange={() => set_status(false)}
                  disabled={!is_editing}
                  className="accent-primary"
                />
                <span>Inactive</span>
              </label>
            </div>
          </div>
        </div>

        {/* Row 2: Asset Description & Asset Account */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FormInput
              label={
                <span>Asset Description {is_editing && <span className="text-destructive">*</span>}</span>
              }
              value={description}
              onChange={(e) => set_description(e.target.value)}
              disabled={!is_editing}
              placeholder="Enter Asset Description"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Asset Account {is_editing && <span className="text-destructive">*</span>}
            </Label>
            {is_editing ? (
              <Select
                value={fk_acct_id ? String(fk_acct_id) : undefined}
                onValueChange={(val) => set_fk_acct_id(parseInt(val, 10))}
              >
                <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="max-h-60 overflow-y-auto">
                  {accounts.map((acct) => (
                    <SelectItem key={acct.pk_acct_id} value={String(acct.pk_acct_id)} className="text-xs">
                      {acct.account} ({acct.acct_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={accounts.find((a) => a.pk_acct_id === fk_acct_id)?.account || ''}
                disabled
                className="h-9 text-xs"
              />
            )}
          </div>
        </div>

        {/* Row 3: Product Selection (Main Asset Product) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Product Code {is_editing && <span className="text-destructive">*</span>}
            </Label>
            {is_editing ? (
              <Select
                value={fk_prod_id ? String(fk_prod_id) : undefined}
                onValueChange={handleProductChange}
              >
                <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs font-mono">
                  <SelectValue placeholder="Select Product Code" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="max-h-60 overflow-y-auto">
                  {products.map((prod) => (
                    <SelectItem key={prod.pk_prod_id} value={String(prod.pk_prod_id)} className="text-xs font-mono">
                      {prod.prod_code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={products.find((p) => p.pk_prod_id === fk_prod_id)?.prod_code || ''}
                disabled
                className="h-9 text-xs font-mono"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Product Name {is_editing && <span className="text-destructive">*</span>}
            </Label>
            {is_editing ? (
              <Select
                value={fk_prod_id ? String(fk_prod_id) : undefined}
                onValueChange={handleProductChange}
              >
                <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs">
                  <SelectValue placeholder="Select Product Name" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="max-h-60 overflow-y-auto">
                  {products.map((prod) => (
                    <SelectItem key={prod.pk_prod_id} value={String(prod.pk_prod_id)} className="text-xs">
                      {prod.prod_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={products.find((p) => p.pk_prod_id === fk_prod_id)?.prod_name || ''}
                disabled
                className="h-9 text-xs"
              />
            )}
          </div>
        </div>

        {/* Row 4: Expiry Date & Condition */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">Expiry Date</Label>
            <div className="relative">
              <Input
                type="date"
                value={exp_date}
                onChange={(e) => set_exp_date(e.target.value)}
                disabled={!is_editing}
                className="h-9 text-xs pr-8"
              />
              <Calendar className="absolute top-2.5 right-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">Condition</Label>
            {is_editing ? (
              <Select value={condition} onValueChange={set_condition}>
                <SelectTrigger className="border-border/85 bg-background/50 h-9 w-full text-xs">
                  <SelectValue placeholder="Select Condition" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {conditionOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={condition} disabled className="h-9 text-xs" />
            )}
          </div>
        </div>

        {/* Additional Asset Codes (only in Add Mode) */}
        {is_editing && mode === 'add' && (
          <div className="space-y-1.5 bg-muted/30 border rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xxs font-bold text-muted-foreground uppercase">
              <FileText className="h-3.5 w-3.5" />
              <span>Bulk Create Clones (Optional)</span>
            </div>
            <FormInput
              label="Additional Asset Codes"
              value={additional_asset_codes_str}
              onChange={(e) => set_additional_asset_codes_str(e.target.value)}
              placeholder="Comma-separated codes (e.g. AST002, AST003)"
              className="h-9 text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground leading-normal">
              Enter extra codes separated by commas to duplicate this asset definition and all its parts in one click.
            </p>
          </div>
        )}

        {/* Parts / Component Table */}
        <div className="space-y-2 border rounded-xl p-4 bg-card/45 shadow-3xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Parts / Components list</span>
            {is_editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPart}
                className="h-7 gap-1 text-[11px] font-semibold border-primary/30 hover:border-primary text-primary bg-primary/5"
              >
                <Plus className="h-3 w-3" /> Add Part
              </Button>
            )}
          </div>

          <div className="overflow-x-auto min-w-full rounded-lg border bg-background/50">
            <table className="min-w-full divide-y text-xs">
              <thead className="bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left w-48">Product Code</th>
                  <th className="px-3 py-2 text-left">Part Name</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left w-24">Quantity</th>
                  <th className="px-3 py-2 text-left w-20">Unit</th>
                  {is_editing && <th className="px-3 py-2 text-center w-12">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {parts.length === 0 ? (
                  <tr>
                    <td colSpan={is_editing ? 6 : 5} className="px-3 py-6 text-center text-muted-foreground">
                      No parts or components defined. Click "Add Part" to add one.
                    </td>
                  </tr>
                ) : (
                  parts.map((part, index) => {
                    const selectedProd = products.find((p) => p.pk_prod_id === part.fk_prod_id);
                    return (
                      <tr key={index} className="hover:bg-muted/20">
                        {/* Product Code */}
                        <td className="p-1.5">
                          {is_editing ? (
                            <Select
                              value={String(part.fk_prod_id)}
                              onValueChange={(val) =>
                                handlePartChange(index, 'fk_prod_id', parseInt(val, 10))
                              }
                            >
                              <SelectTrigger className="h-8 text-xs font-mono">
                                <SelectValue placeholder="Select Part" />
                              </SelectTrigger>
                              <SelectContent className="max-h-48 overflow-y-auto">
                                {products.map((p) => (
                                  <SelectItem key={p.pk_prod_id} value={String(p.pk_prod_id)} className="text-xs font-mono">
                                    {p.prod_code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="font-mono px-1.5">{selectedProd?.prod_code || ''}</span>
                          )}
                        </td>

                        {/* Part Name (read-only based on code selection) */}
                        <td className="p-1.5 px-3">
                          <span className="font-medium text-foreground/80">
                            {selectedProd?.prod_name || ''}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="p-1.5">
                          {is_editing ? (
                            <Input
                              value={part.description}
                              onChange={(e) => handlePartChange(index, 'description', e.target.value)}
                              placeholder="Enter Description"
                              className="h-8 text-xs"
                            />
                          ) : (
                            <span className="px-1.5">{part.description}</span>
                          )}
                        </td>

                        {/* Quantity */}
                        <td className="p-1.5">
                          {is_editing ? (
                            <Input
                              type="number"
                              min={0.01}
                              step={0.01}
                              value={part.quantity}
                              onChange={(e) =>
                                handlePartChange(index, 'quantity', parseFloat(e.target.value) || 0)
                              }
                              className="h-8 text-xs font-mono"
                            />
                          ) : (
                            <span className="font-mono px-1.5">{part.quantity}</span>
                          )}
                        </td>

                        {/* Unit (read-only from selected product) */}
                        <td className="p-1.5 px-3 text-muted-foreground font-mono">
                          {selectedProd?.unit || ''}
                        </td>

                        {/* Action */}
                        {is_editing && (
                          <td className="p-1.5 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemovePart(index)}
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
