import React from 'react';
import { SalarySettingsData, TdsSlab } from '../../types';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TdsSlabsProps {
  value: SalarySettingsData;
  onChange: (value: SalarySettingsData) => void;
  isEditing: boolean;
}

export function TdsSlabs({ value, onChange, isEditing }: TdsSlabsProps) {
  const handleChange = (key: keyof SalarySettingsData, val: any) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const handleSlabChange = (index: number, field: keyof TdsSlab, valStr: string) => {
    const num = parseFloat(valStr) || 0;
    const updatedSlabs = [...value.tdsSlabs];
    updatedSlabs[index] = {
      ...updatedSlabs[index],
      [field]: num
    };
    handleChange('tdsSlabs', updatedSlabs);
  };

  const handleAddSlab = () => {
    const lastSlab = value.tdsSlabs[value.tdsSlabs.length - 1];
    const newFrom = lastSlab ? lastSlab.to : 0;
    const updatedSlabs = [
      ...value.tdsSlabs,
      { upto: newFrom, to: newFrom + 200000, fixed: 0, percent: 10 }
    ];
    handleChange('tdsSlabs', updatedSlabs);
  };

  const handleRemoveSlab = (index: number) => {
    const updatedSlabs = value.tdsSlabs.filter((_, idx) => idx !== index);
    handleChange('tdsSlabs', updatedSlabs);
  };

  // Upto limit of the first slab defines the "Nil" slab threshold
  const nilLimit = value.tdsSlabs[0]?.upto || 200000;

  const handleNilLimitChange = (valStr: string) => {
    const num = parseFloat(valStr) || 0;
    const updatedSlabs = [...value.tdsSlabs];
    if (updatedSlabs.length > 0) {
      updatedSlabs[0] = {
        ...updatedSlabs[0],
        upto: num
      };
    }
    handleChange('tdsSlabs', updatedSlabs);
  };

  return (
    <div className="flex flex-col p-6 space-y-6 w-full h-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">TDS (Income Tax) Slabs Configuration</h3>

        <div className="flex flex-col space-y-4 w-full">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Income Tax Slabs for</Label>
            <Select
              disabled={!isEditing}
              value={value.tdsTaxSlabsFor}
              onValueChange={(val) => handleChange('tdsTaxSlabsFor', val)}
            >
              <SelectTrigger className="w-full h-9 border-border/60">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover z-[10000]">
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Senior Citizens">Senior Citizens</SelectItem>
                <SelectItem value="Super Senior Citizens">Super Senior Citizens</SelectItem>
                <SelectItem value="Women">Women</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nil Slab Card */}
        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg max-w-xl border border-border/40">
          <div className="text-sm font-semibold text-foreground w-20">Upto</div>
          <div className="w-44">
            <FormInput
              type="number"
              disabled={!isEditing}
              value={nilLimit}
              onChange={(e) => handleNilLimitChange(e.target.value)}
              className="text-right font-mono"
            />
          </div>
          <div className="text-sm font-bold text-emerald-500 uppercase tracking-wide">= NIL (Zero Tax)</div>
        </div>

        {/* Dynamic Slabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between w-full">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tax Rate Structure</Label>
            {isEditing && (
              <Button size="sm" variant="outline" onClick={handleAddSlab} className="h-8 gap-1 text-xs">
                <Plus className="h-3 w-3" /> Add Slab Row
              </Button>
            )}
          </div>

          <div className="space-y-3 w-full">
            {value.tdsSlabs.map((slab, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-card border border-border/40 hover:border-border/80 transition-colors">
                
                <div className="flex items-center gap-2 flex-1">
                  <FormInput
                    label="From"
                    type="number"
                    disabled={!isEditing}
                    value={slab.upto}
                    onChange={(e) => handleSlabChange(index, 'upto', e.target.value)}
                    className="text-right font-mono"
                  />
                  <span className="text-muted-foreground pt-5 text-xs font-bold uppercase">To</span>
                  <FormInput
                    label="To"
                    type="number"
                    disabled={!isEditing}
                    value={slab.to}
                    onChange={(e) => handleSlabChange(index, 'to', e.target.value)}
                    className="text-right font-mono"
                  />
                </div>

                <span className="text-muted-foreground pt-5 text-xs font-bold sm:inline hidden">=</span>

                <div className="flex items-center gap-2 flex-1">
                  <FormInput
                    label="Fixed Tax Amount"
                    type="number"
                    disabled={!isEditing}
                    value={slab.fixed}
                    onChange={(e) => handleSlabChange(index, 'fixed', e.target.value)}
                    className="text-right font-mono"
                  />
                  <span className="text-muted-foreground pt-5 text-xs font-bold uppercase">+</span>
                  <FormInput
                    label="Rate (%)"
                    type="number"
                    disabled={!isEditing}
                    value={slab.percent}
                    onChange={(e) => handleSlabChange(index, 'percent', e.target.value)}
                    className="text-right font-mono"
                  />
                </div>

                {isEditing && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 self-end sm:self-center h-9 w-9 mt-4 sm:mt-0"
                    onClick={() => handleRemoveSlab(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cess on TDS at Bottom */}
        <div className="pt-2 border-t border-border/40 w-full">
          <FormInput
            label="Cess on TDS (%)"
            type="number"
            disabled={!isEditing}
            value={value.tdsCessRate}
            onChange={(e) => handleChange('tdsCessRate', parseFloat(e.target.value) || 0)}
            className="w-full"
          />
        </div>

      </div>
    </div>
  );
}
