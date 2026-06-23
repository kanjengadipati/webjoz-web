"use client";

import React from "react";
import { Sparkles } from "lucide-react";

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
        onClick={() => onSelectSection?.(section)}
        className={`group relative transition-all duration-150 ${isSelected
          ? "outline outline-2 outline-primary/60 outline-offset-[-2px]"
          : "hover:outline hover:outline-1 hover:outline-slate-300/40 hover:outline-offset-[-1px]"
          }`}
      >
        <div className={`absolute -top-5 left-3 z-[80] flex items-center gap-1.5 pointer-events-none transition-all duration-150 ${
          isSelected ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
        }`}>
          <span className="bg-primary text-primary-foreground text-[9px] font-bold tracking-widest px-2 py-0.5 rounded uppercase select-none shadow-sm">
            {label}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRegenSection?.(section);
          }}
          className={`absolute top-2 right-2 z-[80] bg-slate-900/80 backdrop-blur-sm text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95 duration-150 focus:outline-none focus:ring-1 focus:ring-primary ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          Regen
        </button>
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
