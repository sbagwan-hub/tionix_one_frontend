'use client';

import * as React from 'react';
import { Circle } from 'lucide-react';
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
    <div className="max-h-[450px] overflow-y-auto p-3 md:col-span-7">
      {loading && tree.length === 0 ? (
        <div className="text-muted-foreground flex h-48 flex-col items-center justify-center gap-2 text-xs">
          <Circle className="text-primary h-4 w-4 animate-spin" />
          Loading hierarchy tree…
        </div>
      ) : tree.length === 0 ? (
        <div className="text-muted-foreground flex h-48 flex-col items-center justify-center text-xs">
          No groups found.
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {tree.map((root, index) => (
            <TreeNodeRow
              key={root.pk_grp_id}
              node={root}
              depth={0}
              selectedId={selectedId}
              onSelect={onSelectNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
