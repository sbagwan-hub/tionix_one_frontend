import React from 'react';
import { SalarySettingsData, PtSlab } from '../../types';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Copy } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProfessionalTaxProps {
  value: SalarySettingsData;
  onChange: (value: SalarySettingsData) => void;
  isEditing: boolean;
}

export function ProfessionalTax({ value, onChange, isEditing }: ProfessionalTaxProps) {
  const handleChange = (key: keyof SalarySettingsData, val: any) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const handleSlabChange = (
    gender: 'Male' | 'Female',
    index: number,
    field: keyof PtSlab,
    valStr: string
  ) => {
    const key = gender === 'Male' ? 'ptMaleSlabs' : 'ptFemaleSlabs';
    const list = [...(value[key] || [])];
    const item = { ...list[index] };

    if (field === 'month') {
      item.month = valStr;
    } else {
      const num = parseFloat(valStr) || 0;
      item[field] = num as any;
    }

    // Auto-calculate yearly amount
    if (field === 'amount' || field === 'monthAmount') {
      const normalAmt = field === 'amount' ? parseFloat(valStr) || 0 : item.amount;
      const febAmt = field === 'monthAmount' ? parseFloat(valStr) || 0 : item.monthAmount;
      item.yearlyAmount = normalAmt * 11 + (febAmt || normalAmt);
    }

    list[index] = item;
    handleChange(key, list);
  };

  const handleNilChange = (gender: 'Male' | 'Female', valStr: string) => {
    const key = gender === 'Male' ? 'ptMaleSlabs' : 'ptFemaleSlabs';
    const list = [...(value[key] || [])];
    const num = parseFloat(valStr) || 0;
    if (list.length > 0) {
      list[0] = {
        ...list[0],
        upto: num
      };
    }
    handleChange(key, list);
  };

  const handleAddSlab = (gender: 'Male' | 'Female') => {
    const key = gender === 'Male' ? 'ptMaleSlabs' : 'ptFemaleSlabs';
    const list = [...(value[key] || [])];
    const lastItem = list[list.length - 1];
    const newFrom = lastItem ? lastItem.to : 0;
    
    list.push({
      upto: newFrom,
      to: newFrom + 2000,
      amount: 100,
      month: 'February',
      monthAmount: 100,
      yearlyAmount: 1200
    });
    handleChange(key, list);
  };

  const handleRemoveSlab = (gender: 'Male' | 'Female', index: number) => {
    const key = gender === 'Male' ? 'ptMaleSlabs' : 'ptFemaleSlabs';
    const list = (value[key] || []).filter((_, idx) => idx !== index);
    handleChange(key, list);
  };

  const handleCopyMaleToFemale = () => {
    handleChange('ptFemaleSlabs', JSON.parse(JSON.stringify(value.ptMaleSlabs)));
  };

  const renderGenderSlabs = (gender: 'Male' | 'Female') => {
    const key = gender === 'Male' ? 'ptMaleSlabs' : 'ptFemaleSlabs';
    const list = value[key] || [];
    const nilLimit = list[0]?.upto || 2500;

    const monthOptions = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-primary tracking-wide uppercase">{gender} Slabs</h4>
          <div className="flex items-center gap-2">
            {gender === 'Female' && list.length === 0 && (
              <Button size="sm" variant="outline" onClick={handleCopyMaleToFemale} className="h-8 gap-1 text-xs">
                <Copy className="h-3 w-3" /> Copy from Male
              </Button>
            )}
            {isEditing && (
              <Button size="sm" variant="outline" onClick={() => handleAddSlab(gender)} className="h-8 gap-1 text-xs">
                <Plus className="h-3 w-3" /> Add Slab
              </Button>
            )}
          </div>
        </div>

        {/* Nil limit row */}
        <div className="flex items-center gap-4 bg-muted/20 p-3 rounded-lg border border-border/40 max-w-xl">
          <span className="text-xs font-semibold text-muted-foreground w-12">Upto</span>
          <div className="w-36">
            <FormInput
              type="number"
              disabled={!isEditing}
              value={nilLimit}
              onChange={(e) => handleNilChange(gender, e.target.value)}
              className="text-right font-mono"
            />
          </div>
          <span className="text-xs font-bold text-emerald-500 tracking-wider flex items-center gap-2">
            <span>=</span> <span>Nil</span>
          </span>
        </div>

        {/* Dynamic Slabs list */}
        <div className="space-y-3">
          {list.map((slab, index) => (
            <div key={index} className="flex flex-col xl:flex-row xl:items-center gap-3 p-4 rounded-xl bg-card border border-border/40 hover:border-border/80 transition-all">
              
              {/* Range block */}
              <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                <FormInput
                  label="From"
                  type="number"
                  disabled={!isEditing}
                  value={slab.upto}
                  onChange={(e) => handleSlabChange(gender, index, 'upto', e.target.value)}
                  className="text-right font-mono"
                />
                <span className="text-muted-foreground pt-5 text-xs font-bold uppercase">To</span>
                <FormInput
                  label="To"
                  type="number"
                  disabled={!isEditing}
                  value={slab.to}
                  onChange={(e) => handleSlabChange(gender, index, 'to', e.target.value)}
                  className="text-right font-mono"
                />
              </div>

              <span className="text-muted-foreground pt-5 text-sm font-bold hidden xl:inline">=</span>

              {/* Amount block */}
              <div className="flex items-center gap-2 flex-1 min-w-[320px]">
                <FormInput
                  label="Rate/Month"
                  type="number"
                  disabled={!isEditing}
                  value={slab.amount}
                  onChange={(e) => handleSlabChange(gender, index, 'amount', e.target.value)}
                  className="text-right font-mono"
                />
                
                <div className="space-y-1.5 flex-1 min-w-[110px]">
                  <Label className="text-[12px] font-semibold tracking-wider text-muted-foreground">Special Month</Label>
                  <Select
                    disabled={!isEditing}
                    value={slab.month || 'February'}
                    onValueChange={(val) => handleSlabChange(gender, index, 'month', val)}
                  >
                    <SelectTrigger className="w-full h-9 border-border/60 font-mono text-xs">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-popover z-[10000]">
                      {monthOptions.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <FormInput
                  label="Special Month Rate"
                  type="number"
                  disabled={!isEditing}
                  value={slab.monthAmount || ''}
                  onChange={(e) => handleSlabChange(gender, index, 'monthAmount', e.target.value)}
                  className="text-right font-mono"
                />
              </div>

              <span className="text-muted-foreground pt-5 text-sm font-bold hidden xl:inline">=</span>

              {/* Total block */}
              <div className="flex items-center gap-3">
                <div className="w-28">
                  <FormInput
                    label="Yearly Amount"
                    type="number"
                    disabled
                    value={slab.yearlyAmount || ''}
                    className="text-right font-mono font-bold bg-muted/40"
                  />
                </div>

                {isEditing && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 h-9 w-9 mt-5"
                    onClick={() => handleRemoveSlab(gender, index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-6 space-y-8 w-full h-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-8">
        <div>
          <h3 className="text-lg font-bold text-primary">Professional Tax Slabs Configuration</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Define dynamic tax ranges and special exception months (e.g. Maharashtra's Feb Rs. 300 contribution).
          </p>
        </div>

        {renderGenderSlabs('Male')}
        
        <div className="border-t border-border/40 my-6" />

        {renderGenderSlabs('Female')}
      </div>

    </div>
  );
}
