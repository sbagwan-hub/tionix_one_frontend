'use client';

import * as React from 'react';
import { useState } from 'react';
import { Folder } from 'lucide-react';
import { TreeNode } from '../types';

interface TreeNodeRowProps {
  node: TreeNode;
  depth: number;
  ancestorsIsLast: boolean[];
  selectedId: number | null;
  onSelect: (node: TreeNode) => void;
}

export function TreeNodeRow({
  node,
  depth,
  ancestorsIsLast,
  selectedId,
  onSelect,
}: TreeNodeRowProps) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isLast = ancestorsIsLast[depth];

  return (
    <div className="select-none">
      <div
        className={`relative mx-1.5 flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 transition-colors ${
          selectedId === node.pk_grp_id
            ? 'bg-primary/15 text-primary font-medium'
            : 'hover:bg-muted text-foreground'
        }`}
        style={{ paddingLeft: `${depth * 16 + 20}px` }}
        onClick={() => {
          onSelect(node);
          if (hasChildren) setOpen((p) => !p);
        }}
      >
        {/* Render parent ancestor vertical dotted lines */}
        {Array.from({ length: depth }).map((_, i) => {
          if (!ancestorsIsLast[i]) {
            return (
              <span
                key={i}
                className="border-foreground/30 absolute top-0 bottom-0 w-[1px] border-l border-dotted"
                style={{ left: `${i * 16 + 8}px` }}
                aria-hidden="true"
              />
            );
          }
          return null;
        })}

        {/* Current node branch vertical line */}
        {depth >= 0 && (
          <span
            className={`border-foreground/40 absolute top-0 w-[1px] border-l border-dotted ${
              isLast ? 'h-1/2' : 'h-full'
            }`}
            style={{ left: `${depth * 16 + 8}px` }}
            aria-hidden="true"
          />
        )}

        {/* Current node branch horizontal tick line */}
        {depth >= 0 && (
          <span
            className="border-foreground/40 absolute top-1/2 h-[1px] w-[12px] border-t border-dotted"
            style={{ left: `${depth * 16 + 8}px` }}
            aria-hidden="true"
          />
        )}

        <Folder
          className={`h-4 w-4 shrink-0 ${selectedId === node.pk_grp_id ? 'text-primary' : 'text-muted-foreground'}`}
        />
        <span className="truncate text-xs">{node.group_name}</span>
        {node.sys_defined && (
          <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-amber-700 uppercase select-none dark:bg-amber-950 dark:text-amber-300">
            sys
          </span>
        )}
      </div>
      {open && hasChildren && (
        <div className="mt-0.5">
          {node.children.map((c, index) => (
            <TreeNodeRow
              key={c.pk_grp_id}
              node={c}
              depth={depth + 1}
              ancestorsIsLast={[...ancestorsIsLast, index === node.children.length - 1]}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
