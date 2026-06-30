'use client';

import * as React from 'react';
import { OrganisationDto } from '../../types';
import { Label } from '@/components/ui/label';
import { Search, Loader2 } from 'lucide-react';
import { useIndividual } from '../../hooks/use-individual';
import { toast } from 'sonner';

interface ContactPersonsSectionProps {
  formData: OrganisationDto;
  individuals: any[];
  disabled?: boolean;
}

export const ContactPersonsSection: React.FC<ContactPersonsSectionProps> = ({
  formData,
  individuals = [],
  disabled = false,
}) => {
  const [indSearch, setIndSearch] = React.useState('');
  const { update: updateIndividual } = useIndividual();

  // Filter individuals who belong to this organisation
  const contactPersons = React.useMemo(() => {
    if (!formData.pk_cont_id) return [];
    return individuals.filter((ind: any) => Number(ind.fk_org_id) === Number(formData.pk_cont_id));
  }, [individuals, formData.pk_cont_id]);

  const filteredIndividuals = React.useMemo(() => {
    const list = individuals.filter((ind: any) => {
      const isAssociatedWithThisOrg =
        formData.pk_cont_id && Number(ind.fk_org_id) === Number(formData.pk_cont_id);
      const hasNoOrg = !ind.fk_org_id;
      return isAssociatedWithThisOrg || hasNoOrg;
    });

    if (!indSearch) return list;
    return list.filter((ind: any) => {
      const fullName =
        `${ind.first_name || ''} ${ind.middle_name || ''} ${ind.surname || ''}`.toLowerCase();
      return fullName.includes(indSearch.toLowerCase());
    });
  }, [individuals, indSearch, formData.pk_cont_id]);

  const handleToggleAssociation = async (ind: any, isChecked: boolean) => {
    if (!formData.pk_cont_id) {
      toast.error('Please save the organisation first before associating contact persons.');
      return;
    }
    try {
      const orgId = isChecked ? Number(formData.pk_cont_id) : null;
      await updateIndividual.mutateAsync({
        id: String(ind.pk_ind_id),
        data: { fk_org_id: orgId },
      });
    } catch (e: any) {
      toast.error(`Failed to update association: ${e.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="border-border/80 bg-background/50 space-y-3 rounded-sm border p-4">
      <div className="flex items-center justify-between gap-4">
        <Label className="text-muted-foreground text-xxs block font-semibold tracking-wider whitespace-nowrap uppercase">
          Contact Person(s) ({contactPersons.length})
        </Label>
        <div className="relative w-48">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search individuals..."
            value={indSearch}
            onChange={(e) => setIndSearch(e.target.value)}
            disabled={disabled}
            className="border-input bg-background/50 placeholder:text-muted-foreground focus-visible:ring-ring h-7 w-full rounded-sm border pr-3 pl-8 text-[11px] focus-visible:ring-1 focus-visible:outline-none"
          />
        </div>
      </div>

      <div className="border-border/80 bg-background/40 max-h-[220px] overflow-y-auto rounded-sm border">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-muted/80 text-muted-foreground sticky top-0 z-10 border-b font-semibold">
            <tr>
              <th className="w-12 px-3 py-2 text-center">Sel</th>
              <th className="px-3 py-2">Contact Person(s)</th>
              <th className="px-3 py-2">Department</th>
              <th className="px-3 py-2">Designation</th>
              <th className="px-3 py-2">Phone / Mobile</th>
            </tr>
          </thead>
          <tbody className="divide-border/60 divide-y">
            {filteredIndividuals.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted-foreground py-4 text-center italic">
                  No individuals found.
                </td>
              </tr>
            ) : (
              filteredIndividuals.map((ind: any) => {
                const isAssociated = Number(ind.fk_org_id) === Number(formData.pk_cont_id);
                const isUpdating =
                  updateIndividual.isPending &&
                  updateIndividual.variables?.id === String(ind.pk_ind_id);
                return (
                  <tr
                    key={ind.pk_ind_id}
                    className={`hover:bg-muted/20 ${isAssociated ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-3 py-2 text-center">
                      {isUpdating ? (
                        <Loader2 className="text-primary mx-auto h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <input
                          type="checkbox"
                          checked={isAssociated}
                          disabled={disabled || !formData.pk_cont_id}
                          onChange={(e) => handleToggleAssociation(ind, e.target.checked)}
                          className="text-primary border-input focus:ring-primary h-3.5 w-3.5 cursor-pointer rounded disabled:cursor-not-allowed"
                        />
                      )}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {`${ind.first_name || ''} ${ind.surname || ''}`}
                    </td>
                    <td className="px-3 py-2">{ind.department_name || '-'}</td>
                    <td className="px-3 py-2">{ind.designation_name || '-'}</td>
                    <td className="px-3 py-2">{ind.contacts?.[0]?.contact || '-'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {!formData.pk_cont_id && (
        <p className="text-xxs font-medium text-amber-500">
          * Please save the organisation first to enable contact person association.
        </p>
      )}
    </div>
  );
};
