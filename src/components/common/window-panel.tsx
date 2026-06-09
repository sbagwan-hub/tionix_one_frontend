'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Plus, Save, Pencil, Trash2, X, List, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/common/form-input';
import Toolbar from '@/components/shared/toolbar';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface WindowPanelItem {
  id: string;
  label: string;
}

export interface WindowPanelProps {
  /** Title shown in the Toolbar */
  toolbarTitle?: string;
  /** Label for the Title tab */
  titleTabLabel?: string;
  /** Label for the List tab */
  listTabLabel?: string;
  /** Controlled title/input value */
  value?: string;
  /** Callback when the title input changes */
  onValueChange?: (value: string) => void;
  /** Placeholder for the title input */
  placeholder?: string;
  /** List of items to display in the List tab */
  items?: WindowPanelItem[];
  /** Called when the Save button in the Title tab is clicked */
  onSave?: (value: string) => void;
  /** Called when the Add button in the toolbar is clicked */
  onAdd?: () => void;
  /** Called when an item's edit button is clicked */
  onEdit?: (item: WindowPanelItem) => void;
  /** Called when an item's delete button is clicked */
  onDelete?: (item: WindowPanelItem) => void;
  /** Extra className names for the outer wrapper */
  className?: string;
  /** Custom form content for the title tab */
  formContent?: React.ReactNode;
  /** HTML id of the form, used to link the Save button */
  formId?: string;
  /** Disable the save button (useful when submitting) */
  isSaving?: boolean;
  /** Called when Cancel is clicked on Tab 1 */
  onCancelTab1?: () => void;
  /** Disable the save button explicitly */
  isSaveDisabled?: boolean;
}

// ─────────────────────────────────────────────────────────
// Sub-component: Redesigned List Item Row
// ─────────────────────────────────────────────────────────

interface ListItemRowProps {
  item: WindowPanelItem;
  isSelected: boolean;
  isEven: boolean;
  onClick: () => void;
}

function ListItemRow({ item, isSelected, isEven, onClick }: ListItemRowProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group border-border/30 flex h-8 cursor-pointer items-center justify-between gap-2 border-b px-3 transition-colors',
        !isSelected && isEven && 'bg-muted/10',
        !isSelected && !isEven && 'bg-transparent',
        'hover:bg-muted/40',
        isSelected &&
          'border-b-blue-500/20 bg-blue-500/10 font-medium text-blue-600 dark:text-blue-400',
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={cn(
            'h-1.5 w-1.5 shrink-0 rounded-full',
            isSelected ? 'bg-blue-500' : 'group-hover:bg-foreground/30 bg-transparent',
          )}
        />
        <span
          className={cn(
            'truncate text-xs tracking-tight',
            isSelected ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-foreground',
          )}
        >
          {item.label}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Component: WindowPanel
// ─────────────────────────────────────────────────────────

export const WindowPanel = React.forwardRef<HTMLDivElement, WindowPanelProps>(
  (
    {
      toolbarTitle = 'Panel',
      titleTabLabel = 'Title',
      listTabLabel = 'List',
      value = '',
      onValueChange,
      placeholder = 'Enter title…',
      items = [],
      onSave,
      onAdd,
      onEdit,
      onDelete,
      className,
      formContent,
      formId,
      isSaving,
      onCancelTab1,
      isSaveDisabled,
    },
    ref,
  ) => {
    const [activeTab, setActiveTab] = React.useState<string>('title');
    const [internalValue, setInternalValue] = React.useState(value);
    const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

    // Sync external value changes
    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onValueChange?.(e.target.value);
    };

    const handleSave = () => {
      onSave?.(internalValue);
    };

    const handleTab2AddClick = () => {
      onAdd?.();
      setActiveTab('title');
    };

    const handleTab2EditClick = () => {
      const item = items.find((i) => i.id === selectedItemId);
      if (item) {
        onEdit?.(item);
        setActiveTab('title');
      }
    };

    const handleTab2DeleteClick = () => {
      const item = items.find((i) => i.id === selectedItemId);
      if (item) {
        onDelete?.(item);
        setSelectedItemId(null);
      }
    };

    const handleTab1CancelClick = () => {
      if (onCancelTab1) {
        onCancelTab1();
      } else {
        setInternalValue('');
      }
    };

    // The toolbar array structure matches your configuration, changing context per active tab
    const toolbarActions: any[] =
      activeTab === 'title'
        ? [
            {
              label: isSaving ? 'Saving...' : 'Add',
              icon: Save,
              type: formId ? 'submit' : 'button',
              form: formId,
              onClick: formId ? undefined : handleSave,
              disabled: isSaving || isSaveDisabled || (!formId && !internalValue.trim()),
              variant: 'primary',
            },
            {
              label: 'Cancel',
              icon: X,
              onClick: handleTab1CancelClick,
              variant: 'outline',
            },
          ]
        : [
            {
              label: 'Add',
              icon: Plus,
              onClick: handleTab2AddClick,
              variant: 'outline',
            },
            {
              label: 'Edit',
              icon: Pencil,
              onClick: handleTab2EditClick,
              disabled: !selectedItemId,
              variant: 'outline',
            },
            {
              label: 'Delete',
              icon: Trash2,
              onClick: handleTab2DeleteClick,
              disabled: !selectedItemId,
              variant: 'danger',
            },
            {
              label: 'Cancel',
              icon: X,
              onClick: () => setSelectedItemId(null),
              disabled: !selectedItemId,
              variant: 'outline',
            },
          ];

    return (
      <div ref={ref} className={cn('flex h-[300px] flex-col gap-1', className)}>
        {/* Toolbar remains completely unchanged layout/styling wise */}
        <Toolbar
          title={toolbarTitle}
          actions={toolbarActions}
          className="border-foreground/15 bg-card mb-0 shrink-0 rounded-sm"
        />

        {/* ── Redesigned Interior Area ── */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="border-border/60 bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border shadow-sm dark:bg-zinc-900/10"
        >
          {/* Segmented Sub-Header Selection instead of full width matrix grids */}
          <div className="bg-muted/20 border-border/40 flex h-12 shrink-0 items-center justify-between border-b px-2">
            <TabsList className="bg-primary/15 flex h-auto w-auto items-center gap-1 rounded-none p-0">
              <TabsTrigger
                value="title"
                className={cn(
                  'text-foreground flex h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-transparent px-2.5 text-[11px] font-medium tracking-tight transition-all',
                  'hover:text-foreground data-[state=active]:border-border/50 data-[state=active]:text-background data-[state=active]:bg-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900',
                )}
              >
                <FileText className="h-3 w-3 shrink-0 opacity-70" />
                {titleTabLabel}
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className={cn(
                  'text-foreground flex h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-transparent px-2.5 text-[11px] font-medium tracking-tight transition-all',
                  'hover:text-foreground data-[state=active]:border-border/50 data-[state=active]:text-background data-[state=active]:bg-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900',
                )}
              >
                <List className="h-3 w-3 shrink-0 opacity-70" />
                {listTabLabel}
                {items.length > 0 && (
                  <span className="bg-muted text-foreground border-border/40 ml-1 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded border px-1 font-mono text-[9px]">
                    {items.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── Redesigned Title Tab Area ── */}
          <TabsContent
            value="title"
            className="mt-0 flex-1 overflow-y-auto bg-white/50 p-6 data-[state=inactive]:hidden dark:bg-zinc-950/20"
          >
            <div className="w-full max-w-full">
              {formContent ? (
                formContent
              ) : (
                <FormInput
                  id="window-panel-title-input"
                  label={titleTabLabel}
                  value={internalValue}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className="bg-background border-border/60 rounded-sm shadow-none"
                />
              )}
            </div>
          </TabsContent>

          {/* ── Redesigned List Tab Area ── */}
          <TabsContent
            value="list"
            className="mt-0 flex-1 overflow-y-auto bg-white/50 data-[state=inactive]:hidden dark:bg-zinc-950/20"
          >
            {items?.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
                <p className="text-foreground text-xs font-semibold">No structural entries</p>
                <p className="text-foreground text-[11px]">
                  Click Add on the editor window to configure one.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {items?.map((item, index) => (
                  <ListItemRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItemId === item.id}
                    isEven={index % 2 === 0}
                    onClick={() => setSelectedItemId(item.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  },
);

WindowPanel.displayName = 'WindowPanel';

export default WindowPanel;
