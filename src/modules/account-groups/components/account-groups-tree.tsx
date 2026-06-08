'use client';

import * as React from 'react';
import { Loader2, FolderTree } from 'lucide-react';
import { TreeNode } from '../types';
import { TreeNodeRow } from './tree-node-row';

interface AccountGroupsTreeProps {
  tree: TreeNode[];
  loading: boolean;
  selectedId: number | null;
  onSelectNode: (node: TreeNode) => void;
}

export function AccountGroupsTree({
  tree,
  loading,
  selectedId,
  onSelectNode,
}: AccountGroupsTreeProps) {
  return (
    <div className="border-border/50 bg-card/30 relative flex flex-col rounded-xl border shadow-sm backdrop-blur-sm md:col-span-7 md:h-full md:min-h-0">
      {/* Scrollable Tree Area */}
      <div className="scrollbar-thumb-muted-foreground/10 min-h-0 flex-1 scrollbar-thin scrollbar-track-transparent overflow-y-auto p-3">
        {loading && tree.length === 0 ? (
          /* Loading State */
          <div className="animate-in fade-in flex h-48 flex-col items-center justify-center gap-3 text-center transition-all duration-200">
            <div className="bg-primary/5 rounded-full p-2.5">
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
            </div>
            <div className="space-y-0.5">
              <p className="text-foreground text-[13px] font-medium">Loading structure</p>
              <p className="text-muted-foreground text-xs">Building hierarchy tree...</p>
            </div>
          </div>
        ) : tree.length === 0 ? (
          /* Empty State */
          <div className="animate-in fade-in flex h-48 flex-col items-center justify-center gap-3 text-center transition-all duration-200">
            <div className="bg-muted/50 text-muted-foreground/60 rounded-full p-2.5">
              <FolderTree className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-foreground text-[13px] font-medium">No groups found</p>
              <p className="text-muted-foreground text-xs">
                Get started by creating your first hierarchy root.
              </p>
            </div>
          </div>
        ) : (
          /* Tree Renderer List */
          <div className="flex flex-col gap-0.5">
            {tree.map((root, index) => (
              <TreeNodeRow
                key={root.pk_grp_id}
                node={root}
                depth={0}
                ancestorsIsLast={[index === tree.length - 1]}
                selectedId={selectedId}
                onSelect={onSelectNode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
