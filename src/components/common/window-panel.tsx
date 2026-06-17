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
        'group border-border/20 flex h-9 cursor-pointer items-center justify-between gap-2 border-b px-3 transition-all duration-200',
        !isSelected && isEven && 'bg-muted/5',
        !isSelected && !isEven && 'bg-transparent',
        'hover:bg-muted/20 hover:pl-5',
        isSelected &&
          'border-b-primary/20 bg-primary/5 dark:bg-primary/10 text-primary border-l-primary border-l-2 pl-5 font-medium',
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className={cn(
            'h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200',
            isSelected ? 'bg-primary scale-125' : 'group-hover:bg-foreground/30 bg-transparent',
          )}
        />
        <span
          className={cn(
            'truncate text-xs tracking-tight transition-colors duration-200',
            isSelected
              ? 'text-primary font-semibold'
              : 'text-foreground/80 group-hover:text-foreground',
          )}
        >
          {item.label}
        </span>
      </div>

      {/* Subtle chevron arrow on the right side */}
      <div
        className={cn(
          'text-muted-foreground/30 opacity-0 transition-all duration-200 group-hover:opacity-100',
          isSelected && 'text-primary/70 opacity-100',
        )}
      >
        <svg
          className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
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
          className="border-foreground/15 bg-card mb-0 shrink-0"
        />

        {/* ── Redesigned Interior Area ── */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-card border-border/60 flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border shadow-md dark:bg-zinc-900/5"
        >
          {/* Modernized Inline-Segmented Sub-Header Navigation */}
          <div className="border-border/30 bg-muted/15 border-b p-1">
            <div className="relative w-[40%]">
              <TabsList className="border-border/10 relative flex h-auto w-full list-none rounded-sm border bg-slate-100 p-1 select-none dark:bg-zinc-900/60">
                <TabsTrigger
                  value="title"
                  className="z-30 flex h-6 flex-auto cursor-pointer items-center justify-center gap-2 rounded-sm border-0 bg-inherit px-0 py-1.5 text-center text-xs font-medium text-slate-600 transition-all ease-in-out outline-none select-none data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-900 dark:text-zinc-400 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-100"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span>{titleTabLabel}</span>
                </TabsTrigger>

                <TabsTrigger
                  value="list"
                  className="z-30 flex h-6 flex-auto cursor-pointer items-center justify-center gap-2 rounded-sm border-0 bg-inherit px-0 py-1.5 text-center text-xs font-medium text-slate-600 transition-all ease-in-out outline-none select-none data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-900 dark:text-zinc-400 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-100"
                >
                  <List className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span>{listTabLabel}</span>
                  {items.length > 0 && (
                    <span className="bg-primary/10 text-primary border-primary/10 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border px-1 font-mono text-[9px] font-bold">
                      {items.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Redesigned Title Form Area Content Layer */}
          <TabsContent
            value="title"
            className={cn(
              'bg-card mt-0 flex-1 overflow-y-auto p-4 transition-all focus-visible:ring-0 focus-visible:outline-none',
            )}
          >
            <div className="w-full">
              {formContent ? (
                formContent
              ) : (
                <FormInput
                  id="window-panel-title-input"
                  label={titleTabLabel}
                  value={internalValue}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className="bg-background border-border/80 focus-visible:ring-primary rounded-md"
                />
              )}
            </div>
          </TabsContent>

          {/* Redesigned Directory Directory List Content Area */}
          <TabsContent
            value="list"
            className="bg-card mt-0 flex-1 overflow-y-auto focus-visible:ring-0 focus-visible:outline-none"
          >
            {items?.length === 0 ? (
              <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 p-6 text-center select-none">
                <div className="bg-muted border-border/40 rounded-full border p-3">
                  <List className="text-muted-foreground/60 h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-foreground/90 text-sm font-semibold">No structural entries</p>
                  <p className="text-muted-foreground mx-auto max-w-xs text-xs leading-normal">
                    Click &quot;Add New&quot; or toggle the editor task block above to configure
                    your system master rules parameters.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Table Column Visual Anchor Header */}
                <div className="bg-muted/40 border-border/40 text-muted-foreground/90 flex h-8 items-center justify-between border-b px-4 text-[10px] font-bold tracking-wider uppercase">
                  <span>Configuration Record Identifier</span>
                  <span className="text-right">Action Target</span>
                </div>

                {/* Interactive Data List Rows Stack */}
                <div className="divide-border/10 flex flex-col divide-y">
                  {items.map((item, index) => (
                    <ListItemRow
                      key={item.id}
                      item={item}
                      isSelected={selectedItemId === item.id}
                      isEven={index % 2 === 0}
                      onClick={() => setSelectedItemId(item.id)}
                    />
                  ))}
                </div>
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
