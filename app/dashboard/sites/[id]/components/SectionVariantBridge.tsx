"use client";

/**
 * SectionVariantBridge
 *
 * Adapter yang menghubungkan data section variant dari SECTION_VARIANT_OPTIONS
 * ke komponen VariantPicker dari webjoz-ui.
 *
 * Komponen ini menggantikan SectionVariantVisualPicker.
 */

import React, { useMemo } from "react";
import { CustomSelect, type CustomSelectOption } from "webjoz-ui";
import { SECTION_VARIANT_OPTIONS, getVariantGroupLabel } from "@/components/sections/variant-registry";
import { getHeroStyle } from "@/components/sections/hero/meta";
import { VariantWireframe } from "./SectionVariantWireframe";
import { useI18n } from "@/lib/i18n/context";

interface SectionVariantBridgeProps {
  sectionKey: string;
  designToken: any;
  updateSectionVariant: (section: string, value: string) => void;
  getEnabledVariants: (section: string, variants: string[]) => string[];
  t: (key: string, fallback?: string) => string;
}

export function SectionVariantBridge({
  sectionKey,
  designToken,
  updateSectionVariant,
  getEnabledVariants,
  t,
}: SectionVariantBridgeProps) {
  const { locale } = useI18n();

  const allVars = SECTION_VARIANT_OPTIONS[sectionKey] || [];

  const enabledOpts = useMemo(() => {
    if (!SECTION_VARIANT_OPTIONS[sectionKey]) return [];
    const enabledValues = getEnabledVariants(sectionKey, allVars.map((o) => o.value));
    return allVars.filter((opt) => enabledValues.includes(opt.value));
  }, [allVars, getEnabledVariants, sectionKey]);

  // Derive current variant value
  const currentVal =
    (sectionKey === "hero"
      ? (getHeroStyle(designToken) || enabledOpts[0]?.value)
      : designToken?.layout?.section_variants?.[sectionKey]) || enabledOpts[0]?.value;

  // Hide if no variants or only one option
  if (!SECTION_VARIANT_OPTIONS[sectionKey] || enabledOpts.length <= 1) {
    return null;
  }

  // Map to VariantOption[] for VariantPicker
  const options: CustomSelectOption[] = enabledOpts.map((opt) => {
    const groupLabel = opt.group ? getVariantGroupLabel(opt.group, locale) : undefined;
    const label = opt.labelKey
      ? t(`dashboard.sitesEditor.${opt.labelKey}`, opt.label)
      : opt.label;
    const description = opt.descriptionKey
      ? t(`dashboard.sitesEditor.${opt.descriptionKey}`, opt.description)
      : opt.description;

    return {
      value: opt.value,
      label,
      group: groupLabel,
      description,
      preview: (
        <VariantWireframe section={sectionKey} variant={opt.value} />
      ),
    };
  });

  return (
    <CustomSelect
      variant="visual"
      value={currentVal}
      onChange={(val) => updateSectionVariant(sectionKey, val)}
      options={options}
      allLabel={t("dashboard.sitesEditor.allVariants", "Semua")}
      hintText={t("dashboard.sitesEditor.variantPickerHint", "Klik varian untuk pratinjau langsung di kanvas.")}
      doneLabel={t("dashboard.sitesEditor.variantPickerDone", "Selesai")}
      className="mb-2.5"
    />
  );
}

export default SectionVariantBridge;
