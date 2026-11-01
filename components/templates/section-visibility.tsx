"use client";

import React, { createContext, useContext, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

type VisibilityCtx = {
  enabled: boolean;      // false saat pendingDiff aktif
  hideable: string[];    // section yang boleh disembunyikan (BODY_SECTION_KEYS)
  hidden: string[];      // design_token.layout.hidden_sections
  toggle: (key: string) => void;
};

const SectionVisibilityContext = createContext<VisibilityCtx | null>(null);

export function SectionVisibilityProvider({
  enabled,
  hideable,
  hidden,
  onToggle,
  children,
}: {
  enabled: boolean;
  hideable: string[];
  hidden: string[];
  onToggle: (key: string) => void;
  children: React.ReactNode;
}) {
  const value = useMemo<VisibilityCtx>(
    () => ({ enabled, hideable, hidden, toggle: onToggle }),
    [enabled, hideable, hidden, onToggle],
  );
  return (
    <SectionVisibilityContext.Provider value={value}>
      {children}
    </SectionVisibilityContext.Provider>
  );
}

/** Dipakai pembungkus section. Aman di luar provider (hideable=false, isHidden=false). */
export function useSectionVisibility(section: string) {
  const ctx = useContext(SectionVisibilityContext);
  const hideable = !!ctx?.enabled && ctx.hideable.includes(section);
  const isHidden = !!ctx && ctx.hideable.includes(section) && ctx.hidden.includes(section);
  return { hideable, isHidden, toggle: () => ctx?.toggle(section) };
}

/** Segmen tombol mata di dalam pill label section. */
export function SectionVisibilityButton({ section }: { section: string }) {
  const { isHidden, toggle } = useSectionVisibility(section);
  const { t } = useI18n();
  const label = isHidden
    ? (t("dashboard.sitesEditor.showSection") || "Tampilkan section")
    : (t("dashboard.sitesEditor.hideSection") || "Sembunyikan section");
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggle(); }}
        aria-label={label}
        aria-pressed={isHidden}
        title={label}
        className={`h-full inline-flex items-center justify-center px-1.5 outline-none select-none hover:bg-white/5 ${
          isHidden ? "text-rose-300 hover:text-rose-200" : "text-slate-300 hover:text-white"
        }`}
      >
        {isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </button>
      <span className="mx-0.5 h-3 w-px shrink-0 bg-white/15" />
    </>
  );
}

/** Keterangan di atas section tersembunyi (hanya di editor). */
export function HiddenSectionNotice({
  section,
  className = "",
}: {
  section: string;
  className?: string;
}) {
  const { toggle } = useSectionVisibility(section);
  const { t } = useI18n();
  return (
    <div
      data-section-ui
      className={`pointer-events-auto absolute left-1/2 z-[72] flex -translate-x-1/2 items-center gap-2 rounded-full border border-rose-400/50 bg-slate-950/95 px-3 py-1.5 text-[11px] font-semibold text-rose-200 shadow-xl ${className}`}
    >
      <EyeOff className="h-3 w-3 shrink-0" />
      <span>
        {t("dashboard.sitesEditor.hiddenOnSite") ||
          "Disembunyikan, tidak tampil di situs"}
      </span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggle(); }}
        className="rounded-full bg-sky-500/90 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-sky-500"
      >
        {t("dashboard.sitesEditor.show") || "Tampilkan"}
      </button>
    </div>
  );
}
