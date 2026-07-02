'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssetPartItem, ProductLookup } from '../types';

interface AssetsPartsTableProps {
  is_editing: boolean;
  parts: AssetPartItem[];
  products: ProductLookup[];
  handleAddPart: () => void;
  handleRemovePart: (index: number) => void;
  handlePartChange: (index: number, field: keyof AssetPartItem, value: any) => void;
}

export function AssetsPartsTable({
  is_editing,
  parts,
  products,
  handleAddPart,
  handleRemovePart,
  handlePartChange,
}: AssetsPartsTableProps) {
  return (
    <div className="bg-card/45 shadow-3xs space-y-2 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <span className="text-foreground text-xs font-bold">Parts / Components list</span>
        {is_editing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddPart}
            className="border-primary/30 hover:border-primary text-primary bg-primary/5 h-7 gap-1 text-[11px] font-semibold"
          >
            <Plus className="h-3 w-3" /> Add Part
          </Button>
        )}
      </div>

      <div className="bg-background/50 min-w-full overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y text-xs">
          <thead className="bg-muted/40 text-muted-foreground font-semibold">
            <tr>
              <th className="w-48 px-3 py-2 text-left">Product Code</th>
              <th className="px-3 py-2 text-left">Part Name</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="w-24 px-3 py-2 text-left">Quantity</th>
              <th className="w-20 px-3 py-2 text-left">Unit</th>
              {is_editing && <th className="w-12 px-3 py-2 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {parts.length === 0 ? (
              <tr>
                <td
                  colSpan={is_editing ? 6 : 5}
                  className="text-muted-foreground px-3 py-6 text-center"
                >
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
                          <SelectTrigger className="h-8 font-mono text-xs">
                            <SelectValue placeholder="Select Part" />
                          </SelectTrigger>
                          <SelectContent className="max-h-48 overflow-y-auto">
                            {products.map((p) => (
                              <SelectItem
                                key={p.pk_prod_id}
                                value={String(p.pk_prod_id)}
                                className="font-mono text-xs"
                              >
                                {p.prod_code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="px-1.5 font-mono">{selectedProd?.prod_code || ''}</span>
                      )}
                    </td>

                    {/* Part Name (read-only based on code selection) */}
                    <td className="p-1.5 px-3">
                      <span className="text-foreground/80 font-medium">
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
                          className="h-8 font-mono text-xs"
                        />
                      ) : (
                        <span className="px-1.5 font-mono">{part.quantity}</span>
                      )}
                    </td>

                    {/* Unit (read-only from selected product) */}
                    <td className="text-muted-foreground p-1.5 px-3 font-mono">
                      {selectedProd?.unit || ''}
                    </td>

                    {/* Action */}
                    {is_editing && (
                      <td className="p-1.5 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePart(index)}
                          className="text-destructive hover:bg-destructive/10 h-7 w-7"
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
  );
}
