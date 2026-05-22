interface PermissionTabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function PermissionTabs({ tabs, activeTab, setActiveTab }: PermissionTabsProps) {
  return (
    <div className="border-border bg-muted/50 dark:bg-muted/20 flex flex-wrap gap-2 border-b px-4 pt-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`-mb-px rounded-t-sm border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
            activeTab === tab
              ? 'border-primary bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground border-transparent'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
