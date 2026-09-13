"use client";

import React, { useState } from "react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import {
  SECTION_VARIANT_OPTIONS,
  getVariantLabel,
  getVariantDescription,
} from "@/components/sections/variant-registry";
import {
  LayoutList,
  Layers,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  Eye,
  Sliders,
} from "lucide-react";
import SectionVariantVisualPicker from "./SectionVariantVisualPicker";
import { SECTION_META } from "../editor-utils";

interface PageLayoutHubProps {
  content: any;
  designToken: any;
  isDynamic: boolean;
  updateSectionVariant: (section: string, value: string) => void;
  getEnabledVariants: (section: string, variants: string[]) => string[];
  onSelectSection?: (section: string) => void;
  t: any;
}

export default function PageLayoutHub({
  content,
  designToken,
  isDynamic,
  updateSectionVariant,
  getEnabledVariants,
  onSelectSection,
  t,
}: PageLayoutHubProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  if (!isDynamic) return null;

  // Determine sections present in current site content
  const activeSections = Object.keys(SECTION_VARIANT_OPTIONS).filter((secKey) => {
    if (secKey === "header" || secKey === "footer" || secKey === "hero") return true;
    return Boolean(content?.[secKey]);
  });

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-primary" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
            {t("dashboard.sitesEditor.pageLayoutVariants") || "Tata Letak Varian Seksi"}
          </p>
        </div>
        <span className="text-[10px] font-medium text-slate-400">
          {activeSections.length} {t("dashboard.sitesEditor.activeSectionsCount") || "seksi aktif"}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        {t("dashboard.sitesEditor.pageLayoutVariantsDesc") || "Sesuaikan gaya tampilan tiap bagian halaman situs Anda secara terpusat."}
      </p>

      {/* Accordion list of sections */}
      <div className="space-y-1.5">
        {activeSections.map((secKey) => {
          const variants = SECTION_VARIANT_OPTIONS[secKey] || [];
          const enabledVars = variants.filter((opt) =>
            getEnabledVariants(secKey, variants.map((o) => o.value)).includes(opt.value)
          );
          if (enabledVars.length === 0) return null;

          const currentVal =
            (secKey === "hero"
              ? (designToken?.layout?.section_variants?.hero || designToken?.layout?.hero_style)
              : designToken?.layout?.section_variants?.[secKey]) || enabledVars[0].value;

          const currentOpt = enabledVars.find((v) => v.value === currentVal);
          const currentLabel =
            (t && currentOpt?.labelKey ? t(`dashboard.sitesEditor.${currentOpt.labelKey}`) : "") ||
            currentOpt?.label ||
            currentVal;
          const isExpanded = activeAccordion === secKey;

          return (
            <div
              key={secKey}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "border-primary/40 bg-slate-900/90 shadow-sm"
                  : "border-white/5 bg-[#0b0f19]/70 hover:border-white/15 hover:bg-[#111728]/60"
              }`}
            >
              {/* Row Header */}
              <div
                onClick={() => setActiveAccordion(isExpanded ? null : secKey)}
                className="flex items-center justify-between p-2.5 cursor-pointer select-none gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-[12px] font-bold text-slate-200 truncate">
                    {SECTION_META[secKey]?.label || secKey}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25">
                    {currentLabel}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-2.5 pt-0 border-t border-white/5">
                  <div className="pt-2">
                    <SectionVariantVisualPicker
                      sectionKey={secKey}
                      isDynamic={isDynamic}
                      designToken={designToken}
                      updateSectionVariant={updateSectionVariant}
                      getEnabledVariants={getEnabledVariants}
                      t={t}
                    />

                    {onSelectSection && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSection(secKey);
                        }}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-primary transition font-medium cursor-pointer"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        <span>{t("dashboard.sitesEditor.editSectionContent") || "Edit konten teks seksi ini"}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
