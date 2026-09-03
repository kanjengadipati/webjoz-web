"use client";

import React from "react";
import { SparkleGenAI } from "@/components/sparkle-icon";

export const PreviewSectionWrapper: React.FC<{
  section: string;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  onRegenSection?: (section: string) => void;
  isEditorMode?: boolean;
  children: React.ReactNode;
  label: string;
}> = ({
  section, activeSection, onSelectSection, onRegenSection, isEditorMode = false, children, label
}) => {
    if (!isEditorMode) {
      return <>{children}</>;
    }

    const isSelected = activeSection === section;

    return (
      <div
        id={`section-preview-${section}`}
        onClick={(e) => {
          // Do NOT activate section selection when the user clicked inside a
          // contentEditable inline-edit element — that would open the mobile
          // bottom drawer and overlap the editing surface.
          const target = e.target as HTMLElement;
          if (target.closest('[contenteditable="true"]')) return;
          onSelectSection?.(section);
        }}
        className={`group relative transition-all duration-150 ${isSelected
          ? "outline outline-2 outline-primary/60 outline-offset-[-2px]"
          : "hover:outline hover:outline-1 hover:outline-slate-300/40 hover:outline-offset-[-1px]"
          }`}
      >
        {/* Section Header Controls (Top Right — safe from left sidebar & handle strip) */}
        <div className={`absolute top-2 right-2 z-20 flex items-center gap-1.5 transition-all duration-150 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>
          <span className="bg-slate-900/85 backdrop-blur-sm text-slate-200 border border-white/10 text-[9px] font-bold tracking-widest px-2 py-0.5 rounded uppercase select-none shadow-sm pointer-events-none">
            {label}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRegenSection?.(section);
            }}
            className="bg-slate-900/85 backdrop-blur-sm text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95 duration-150 focus:outline-none focus:ring-1 focus:ring-primary group/regen shadow-sm"
          >
            <SparkleGenAI className="w-3.5 h-3.5" />
            Regen
          </button>
        </div>
        {children}
      </div>
    );
  };

export const MemoPreviewSectionWrapper = React.memo(PreviewSectionWrapper);

interface MemoSectionContentProps<T> {
  content: T;
  render: (data: T) => React.ReactNode;
}

const MemoSectionContentInner = <T,>({ content, render }: MemoSectionContentProps<T>) => {
  return <>{render(content)}</>;
};

export const MemoSectionContent = React.memo(
  MemoSectionContentInner,
  (prevProps, nextProps) => {
    const a = prevProps.content as any;
    const b = nextProps.content as any;
    if (a === b) return true;
    if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (a[key] !== b[key]) return false;
    }
    return true;
  }
) as <T>(props: MemoSectionContentProps<T>) => React.ReactElement;
