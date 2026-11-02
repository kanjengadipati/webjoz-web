"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
  pointerWithin, closestCenter, type CollisionDetection,
} from "@dnd-kit/core";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { dropPosition } from "@/lib/section-order";

type ReorderCtx = {
  enabled: boolean;
  order: string[];
  activeKey: string | null;
  overKey: string | null;
  move: (source: string, target: string) => void;
};

const SectionReorderContext = createContext<ReorderCtx | null>(null);
export const useSectionReorder = () => useContext(SectionReorderContext);

const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : closestCenter(args);
};

export function SectionReorderProvider({
  enabled, order, getLabel, onMove, children,
}: {
  enabled: boolean;
  order: string[];
  getLabel: (key: string) => string;
  onMove: (source: string, target: string) => void;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);
  const reset = () => { setActiveKey(null); setOverKey(null); };

  const value = useMemo<ReorderCtx>(
    () => ({ enabled, order, activeKey, overKey, move: onMove }),
    [enabled, order, activeKey, overKey, onMove],
  );

  return (
    <SectionReorderContext.Provider value={value}>
      <DndContext
        sensors={sensors}
        collisionDetection={collision}
        autoScroll={{ threshold: { x: 0, y: 0.2 } }}
        onDragStart={(e) => setActiveKey(String(e.active.id))}
        onDragOver={(e) => setOverKey(e.over ? String(e.over.id) : null)}
        onDragEnd={(e) => {
          const source = String(e.active.id);
          const target = e.over ? String(e.over.id) : null;
          reset();
          if (target && target !== source) onMove(source, target);
        }}
        onDragCancel={reset}
      >
        {children}
        {typeof document !== "undefined" &&
          createPortal(
            <DragOverlay dropAnimation={null}>
              {activeKey ? (
                <div className="pointer-events-none inline-flex items-center gap-1.5 rounded-full border border-sky-400/70 bg-slate-950/95 px-3 py-1.5 text-[11px] font-bold text-sky-200 shadow-xl">
                  <GripVertical className="h-3 w-3" />
                  {t("dashboard.sitesEditor.moveSection")}: {getLabel(activeKey)}
                </div>
              ) : null}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </SectionReorderContext.Provider>
  );
}

export function useSectionDrop(section: string) {
  const ctx = useSectionReorder();
  const canReorder = !!ctx?.enabled && (ctx.order || []).includes(section);
  const { setNodeRef } = useDroppable({ id: section, disabled: !canReorder });
  const isSource = canReorder && ctx!.activeKey === section;
  const indicator =
    canReorder && ctx!.activeKey && ctx!.overKey === section && ctx!.activeKey !== section
      ? dropPosition(ctx!.order, ctx!.activeKey, section)
      : null;
  return { setNodeRef, canReorder, isSource, indicator };
}

export function SectionDragControls({ section }: { section: string }) {
  const ctx = useSectionReorder();
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef } = useDraggable({ id: section, disabled: !ctx?.enabled });
  if (!ctx?.enabled) return null;
  const idx = (ctx.order || []).indexOf(section);
  if (idx < 0) return null;
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const btn = "h-full inline-flex items-center justify-center px-1 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent outline-none select-none";
  return (
    <span ref={setNodeRef} className="inline-flex h-full items-center">
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        onClick={stop}
        aria-label={t("dashboard.sitesEditor.dragSection")}
        title={t("dashboard.sitesEditor.dragSection")}
        className={`${btn} cursor-grab active:cursor-grabbing touch-none pl-2`}
      >
        <GripVertical className="h-3 w-3" />
      </button>
      <button
        type="button"
        disabled={idx <= 0}
        onClick={(e) => { stop(e); ctx.move(section, ctx.order[idx - 1]); }}
        aria-label={t("dashboard.sitesEditor.moveUp")}
        className={btn}
      >
        <ChevronUp className="h-3 w-3" />
      </button>
      <button
        type="button"
        disabled={idx >= ctx.order.length - 1}
        onClick={(e) => { stop(e); ctx.move(section, ctx.order[idx + 1]); }}
        aria-label={t("dashboard.sitesEditor.moveDown")}
        className={btn}
      >
        <ChevronDown className="h-3 w-3" />
      </button>
      <span className="mx-0.5 h-3 w-px shrink-0 bg-white/15" />
    </span>
  );
}