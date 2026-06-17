import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';
import Toolbar, { Action } from '@/components/shared/toolbar';
import { useWindowStore } from '@/stores/window-store';
import Image from 'next/image';
import { LOCAL_IMAGE } from '@/constants/images.constant';

export interface WindowProps {
  /** Unique identifier for the window to track state globally */
  id: string;
  /** The title of the window, displayed in the title bar */
  title: string;
  /** Optional icon to display before the title */
  icon?: React.ReactNode;
  /** Callback triggered when the close button is clicked */
  onClose?: () => void;
  /** Callback triggered when the minimize state changes */
  onMinimizeChange?: (isMinimized: boolean) => void;
  /** Callback triggered when the maximize state changes */
  onMaximizeChange?: (isMaximized: boolean) => void;
  /** Whether the window can be collapsed by clicking the minimize button */
  isMinimizable?: boolean;
  /** Whether the window can be expanded to fullscreen */
  isMaximizable?: boolean;
  /** Whether the window is draggable */
  isDraggable?: boolean;
  /** Additional action elements/buttons to show in the header */
  actions?: React.ReactNode;
  /** Custom classes for the outer window container */
  className?: string;
  /** Custom classes for the header/title bar */
  headerClassName?: string;
  /** Custom classes for the window body/content area */
  bodyClassName?: string;
  /** Inner content of the window */
  children?: React.ReactNode;

  // Toolbar Combo Props
  /** Optional Toolbar title */
  toolbarTitle?: string;
  /** Optional Navigation actions for the toolbar */
  toolbarNavigation?: readonly Action[];
  /** Optional Main actions for the toolbar */
  toolbarActions?: readonly Action[];
  /** Optional Utilities actions for the toolbar */
  toolbarUtilities?: readonly Action[];
  /** Optional pagination current record */
  toolbarCurrentRecord?: number;
  /** Optional pagination total records */
  toolbarTotalRecords?: number;
  /** Custom class for the embedded toolbar */
  toolbarClassName?: string;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  onClose,
  onMinimizeChange,
  onMaximizeChange,
  isMinimizable = false,
  isMaximizable = false,
  isDraggable = true,
  actions,
  className,
  headerClassName,
  bodyClassName,
  children,

  // Toolbar Combo Props
  toolbarTitle,
  toolbarNavigation,
  toolbarActions,
  toolbarUtilities,
  toolbarCurrentRecord,
  toolbarTotalRecords,
  toolbarClassName,
}) => {
  // Retrieve store states
  const winState = useWindowStore((state) => state.windows[id]);
  const setMinimized = useWindowStore((state) => state.setMinimized);
  const setMaximized = useWindowStore((state) => state.setMaximized);
  const focusWindow = useWindowStore((state) => state.focusWindow);

  const isMinimized = winState?.isMinimized ?? false;
  const isMaximized = winState?.isMaximized ?? false;
  const zIndex = winState?.zIndex ?? 50;

  // Hydration guard to prevent SSR snapshot loops
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Dragging State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const bringToFront = () => {
    focusWindow(id);
  };

  if (!mounted) return null;

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMinimizable) return;
    const nextState = !isMinimized;
    setMinimized(id, nextState);
    if (onMinimizeChange) {
      onMinimizeChange(nextState);
    }
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMinimized) {
      setMinimized(id, false);
      if (onMinimizeChange) {
        onMinimizeChange(false);
      }
      return;
    }
    if (!isMaximizable) return;
    const nextState = !isMaximized;
    setMaximized(id, nextState);
    if (nextState) {
      setPosition({ x: 0, y: 0 }); // Reset position when maximizing
    }
    if (onMaximizeChange) {
      onMaximizeChange(nextState);
    }
  };

  const handleHeaderDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }
    if (isMinimized) {
      setMinimized(id, false);
      if (onMinimizeChange) {
        onMinimizeChange(false);
      }
    } else if (isMaximizable) {
      handleMaximize(e);
    }
  };

  // Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    bringToFront();
    if (!isDraggable || isMaximized) return;

    // Ignore drags started on buttons, inputs, links, or custom actions
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }

    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: position.x, y: position.y };

    const header = e.currentTarget;
    header.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    setPosition({
      x: initialPos.current.x + deltaX,
      y: initialPos.current.y + deltaY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    const header = e.currentTarget;
    header.releasePointerCapture(e.pointerId);
  };

  // Check if we should render a toolbar
  const hasToolbar =
    toolbarTitle !== undefined ||
    (toolbarNavigation && toolbarNavigation.length > 0) ||
    (toolbarActions && toolbarActions.length > 0) ||
    (toolbarUtilities && toolbarUtilities.length > 0);

  return (
    <div
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: zIndex,
      }}
      onMouseDown={bringToFront}
      onTouchStart={bringToFront}
      className={cn(
        // High contrast container with premium glassmorphism and shadow depth
        'border-border/80 bg-card/98 pointer-events-auto relative flex flex-col overflow-hidden rounded-xl border shadow-[0_20px_50px_rgba(0,0,0,0.22)] ring-1 ring-black/10 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/98 dark:shadow-[0_30px_70px_rgba(0,0,0,0.55)] dark:ring-white/10',
        dragging
          ? 'scale-[1.002] cursor-grabbing shadow-[0_30px_70px_rgba(0,0,0,0.3)] select-none'
          : 'transition-all duration-200 hover:shadow-[0_24px_55px_rgba(0,0,0,0.28)]',
        // Maximize states
        isMaximized
          ? 'fixed inset-0 z-50 h-screen w-screen !transform-none rounded-none'
          : 'relative max-h-[85vh] w-full max-w-md',
        className,
      )}
    >
      {/* Title Bar / Header */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleHeaderDoubleClick}
        className={cn(
          'border-border/60 bg-muted flex items-center justify-between border-b px-4 py-2.5 select-none dark:bg-zinc-900/90',
          isDraggable && !isMaximized ? 'cursor-grab' : '',
          headerClassName,
        )}
      >
        {/* Title and Info on the Left */}
        <div className="flex min-w-0 items-center space-x-1.5 rtl:space-x-reverse">
          <div className="flex shrink-0 items-center">
            <Image
              src={LOCAL_IMAGE.APP_LOGO_TRANSPARENT}
              alt="Tionix_Logo"
              className="h-5.5 w-auto object-contain"
            />
          </div>
          <span className="bg-border/60 h-3.5 w-px shrink-0" />
          <span className="text-foreground truncate text-sm font-semibold tracking-tight">
            {title}
          </span>
        </div>

        {/* Control Actions / Windows on the Right */}
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          {actions && (
            <div className="mr-2 flex items-center space-x-2 rtl:mr-0 rtl:ml-2">{actions}</div>
          )}

          {isMinimizable && !isMinimized && (
            <button
              onClick={handleMinimize}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-all duration-200 hover:bg-amber-600 hover:text-white focus:outline-none dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-600"
              title="Minimize"
            >
              <Minus className="h-3 w-3 stroke-[2.5]" />
            </button>
          )}

          {(isMaximizable || isMinimized) && (
            <button
              onClick={handleMaximize}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-all duration-200 hover:bg-emerald-600 hover:text-white focus:outline-none dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-600"
              title={isMinimized ? 'Restore' : isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized || isMinimized ? (
                <Minimize2 className="h-3 w-3 stroke-[2.5]" />
              ) : (
                <Maximize2 className="h-3 w-3 stroke-[2.5]" />
              )}
            </button>
          )}

          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-all duration-200 hover:bg-rose-600 hover:text-white focus:outline-none dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-600"
              title="Close"
            >
              <X className="h-3 w-3 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Window Body / Content */}
      <div
        className={cn(
          'flex flex-grow flex-col transition-all duration-300 ease-in-out',
          isMinimized ? 'pointer-events-none h-0 overflow-hidden opacity-0' : 'h-auto opacity-100',
          bodyClassName,
        )}
      >
        {/* Render Toolbar if props are provided */}
        {hasToolbar && !isMinimized && (
          <div className={cn('shrink-0 px-4 pt-4', toolbarClassName)}>
            <Toolbar
              title={toolbarTitle}
              navigation={toolbarNavigation}
              actions={toolbarActions}
              utilities={toolbarUtilities}
              currentRecord={toolbarCurrentRecord}
              totalRecords={toolbarTotalRecords}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 shadow-none">{children}</div>
      </div>
    </div>
  );
};

export default Window;
