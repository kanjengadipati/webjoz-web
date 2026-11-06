"use client";

import React from "react";
import { SECTION_VARIANT_OPTIONS } from "@/components/sections/variant-registry";

export interface SectionConfigItem {
  id: string;
  name: string;
  icon?: string;
}

export interface ShowcaseSidebarProps {
  sections: SectionConfigItem[];
  selectedSection: string;
  onSelectSection: (id: string) => void;
  hiddenVariants: Record<string, string[]>;
}

export function ShowcaseSidebar({
  sections,
  selectedSection,
  onSelectSection,
  hiddenVariants,
}: ShowcaseSidebarProps) {
  return (
    <aside className="w-full lg:w-60 shrink-0 space-y-3 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
      <div className="bg-card border border-border/80 rounded-xl p-2.5 shadow-xs space-y-1">
        <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pilih Section</span>
          <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
            {sections.length}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-0.5 pt-1">
          {sections.map((sec) => {
            const count = (SECTION_VARIANT_OPTIONS[sec.id] ?? []).length;
            const hiddenCount = (hiddenVariants[sec.id] ?? []).length;
            const isActive = selectedSection === sec.id;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSection(sec.id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span className="truncate">{sec.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {hiddenCount > 0 && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                        isActive
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-destructive/15 text-destructive"
                      }`}
                      title={`${hiddenCount} varian disembunyikan`}
                    >
                      -{hiddenCount}
                    </span>
                  )}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

