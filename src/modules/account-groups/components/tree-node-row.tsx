'use client';

import * as React from 'react';
import { useState } from 'react';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';
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
  const isSelected = selectedId === node.pk_grp_id;

  return (
    <div className="w-full select-none">
      {/* Row Wrapper */}
      <div
        className={`group relative mx-1.5 flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-all duration-150 ease-in-out ${
          isSelected
            ? 'bg-primary/10 text-primary font-medium shadow-sm'
            : 'text-foreground hover:bg-muted/60 hover:text-foreground'
        }`}
        style={{ paddingLeft: `${depth * 20 + 24}px` }}
        onClick={() => {
          onSelect(node);
          if (hasChildren) setOpen((p) => !p);
        }}
      >
        {/* --- TREE LINES GRAPHICS --- */}

        {/* Render parent ancestor vertical connecting lines */}
        {Array.from({ length: depth }).map((_, i) => {
          if (!ancestorsIsLast[i]) {
            return (
              <span
                key={i}
                className="border-foreground/80 group-hover:border-foreground/90 pointer-events-none absolute top-0 bottom-0 w-[1px] border-l border-dashed transition-colors"
                style={{ left: `${i * 20 + 14}px` }}
                aria-hidden="true"
              />
            );
          }
          return null;
        })}

        {/* Current node branch vertical line */}
        {depth >= 0 && (
          <span
            className={`border-foreground/80 group-hover:border-foreground/90 pointer-events-none absolute top-0 w-[1px] border-l border-dashed transition-colors ${
              isLast ? 'h-1/2' : 'h-full'
            }`}
            style={{ left: `${depth * 20 + 14}px` }}
            aria-hidden="true"
          />
        )}

        {/* Current node branch horizontal tick line */}
        {depth >= 0 && (
          <span
            className="border-foreground/80 group-hover:border-foreground/90 pointer-events-none absolute top-1/2 h-[1px] w-[12px] -translate-y-1/2 border-t border-dashed transition-colors"
            style={{ left: `${depth * 20 + 14}px` }}
            aria-hidden="true"
          />
        )}

        {/* --- INTERACTIVE ELEMENTS & ICONS --- */}

        {/* Inline Chevron (Rotates beautifully if there are children) */}
        <div className="z-10 flex h-4 w-4 items-center justify-center">
          {hasChildren && (
            <ChevronRight
              className={`text-foreground/60 group-hover:text-foreground h-3 w-3 shrink-0 transition-transform duration-200 ease-out ${
                open ? 'rotate-90' : ''
              }`}
            />
          )}
        </div>

        {/* Dynamic Folder Icon */}
        <div className="z-10">
          {open && hasChildren ? (
            <FolderOpen className={`h-4 w-4 shrink-0 transition-colors duration-150`} />
          ) : (
            <Folder
              className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
                isSelected ? 'text-primary' : 'text-foreground/70 group-hover:text-foreground'
              }`}
            />
          )}
        </div>

        {/* Node Label */}
        <span className="z-10 truncate text-[13px] tracking-wide transition-colors">
          {node.group_name}
        </span>
      </div>

      {/* --- CHILDREN RENDERER --- */}
      {open && hasChildren && (
        <div className="animate-in fade-in slide-in-from-top-1 mt-[1px] duration-150 ease-out">
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
