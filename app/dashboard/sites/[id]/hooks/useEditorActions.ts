import { useState, useCallback } from "react";
import {
  type ColorPattern,
  type IndustryPreset,
  type TypographyPairing,
  getEnabledTypographyPairings,
  getEnabledColorPatterns,
} from "@/lib/design-assets-config";
import { getTemplateDefaultDesignToken } from "@/lib/template-defaults";
import { BODY_SECTION_KEYS, getOrderedSections } from "../editor-utils";
import { getHiddenSections } from "@/lib/design-assets-config";
import { SECTION_VARIANT_OPTIONS } from "@/components/sections/variant-registry";

// Backward-compat re-export
export { SECTION_VARIANT_OPTIONS };

export interface EditorActionsState {
  globalUndo: any[];
}

export interface EditorActionsActions {
  updateField: (section: string, key: string, val: any) => void;
  updateDesignTokenField: (group: "palette" | "typography" | "layout", key: string, value: any) => void;
  updateDesignTokenLayout: (key: string, value: any) => void;
  updateSectionVariant: (section: string, value: string) => void;
  handleColorChange: (colorKey: string, value: string) => void;
  handleTemplateChange: (templateId: string, customDesignToken?: any) => void;
  handleReorderSection: (source: string, target: string) => void;
  toggleSectionVisibility: (key: string) => void;
  applyTypographyBatch: (fields: Record<string, any>) => void;
  applyColorPattern: (pattern: ColorPattern) => void;
  applyIndustryPreset: (preset: IndustryPreset) => void;
  pushGlobalUndo: () => void;
  handleGlobalUndo: () => void;
}

export function useEditorActions(
  siteDetails: any,
  designToken: any,
  content: any,
  setContent: React.Dispatch<React.SetStateAction<any>>,
  setDesignToken: React.Dispatch<React.SetStateAction<any>>,
  setSiteDetails: React.Dispatch<React.SetStateAction<any>>,
): EditorActionsState & EditorActionsActions {
  const [globalUndo, setGlobalUndo] = useState<any[]>([]);

  // ── undo helpers ─────────────────────────────────────────────────────────────
  const pushGlobalUndo = useCallback(() => {
    if (!designToken) return;
    setGlobalUndo((prev) => [JSON.parse(JSON.stringify(designToken)), ...prev].slice(0, 3));
  }, [designToken]);

  const handleGlobalUndo = useCallback(() => {
    setGlobalUndo((prev) => {
      if (!prev.length) return prev;
      const [latest, ...rest] = prev;
      setDesignToken(latest);
      return rest;
    });
  }, [setDesignToken]);

  // ── content field update ─────────────────────────────────────────────────────
  const updateField = useCallback((section: string, key: string, val: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [key]: val },
    }));
  }, [setContent]);

  // ── design token updates ─────────────────────────────────────────────────────
  /**
   * Update a single field inside a design token group (palette | typography | layout).
   * If the current template is a static preset, switches to TEMPLATE_DYNAMIC first
   * and seeds defaults so existing tokens aren't lost.
   */
  const updateDesignTokenField = useCallback((
    group: "palette" | "typography" | "layout",
    key: string,
    value: any,
  ) => {
    pushGlobalUndo();
    setDesignToken((prev: any) => {
      let next = { ...(prev || {}) };

      if (siteDetails?.template_id !== "TEMPLATE_DYNAMIC") {
        const defaults = getTemplateDefaultDesignToken(siteDetails.template_id);
        next = {
          ...defaults,
          ...next,
          palette: { ...defaults.palette, ...(next.palette || {}) },
          typography: { ...defaults.typography, ...(next.typography || {}) },
          layout: { ...defaults.layout, ...(next.layout || {}) },
        };
        setSiteDetails((prev: any) => ({ ...prev, template_id: "TEMPLATE_DYNAMIC" }));
      }

      next[group] = { ...(next[group] || {}), [key]: value };
      return next;
    });
  }, [pushGlobalUndo, siteDetails, setDesignToken, setSiteDetails]);

  /** Convenience wrapper for layout-only updates (used by SectionForms) */
  const updateDesignTokenLayout = useCallback((key: string, value: any) => {
    updateDesignTokenField("layout", key, value);
  }, [updateDesignTokenField]);

  const updateSectionVariant = useCallback((section: string, value: string) => {
    pushGlobalUndo();
    setDesignToken((prev: any) => {
      const next = prev ? JSON.parse(JSON.stringify(prev)) : {};
      next.layout = {
        ...(next.layout || {}),
        section_variants: { ...(next.layout?.section_variants || {}), [section]: value },
      };
      if (siteDetails?.template_id !== "TEMPLATE_DYNAMIC") {
        const defaults = getTemplateDefaultDesignToken(siteDetails.template_id);
        Object.assign(next, defaults, next);
        next.palette = { ...defaults.palette, ...(next.palette || {}) };
        next.typography = { ...defaults.typography, ...(next.typography || {}) };
        next.layout = { ...defaults.layout, ...next.layout };
        setSiteDetails((prev: any) => ({ ...prev, template_id: "TEMPLATE_DYNAMIC" }));
      }
      return next;
    });
  }, [pushGlobalUndo, siteDetails, setDesignToken, setSiteDetails]);

  const handleColorChange = useCallback((colorKey: string, value: string) => {
    updateDesignTokenField("palette", colorKey, value);
  }, [updateDesignTokenField]);

  // ── template change ──────────────────────────────────────────────────────────
  const handleTemplateChange = useCallback((templateId: string, customDesignToken?: any) => {
    if (!siteDetails) return;
    if (templateId === siteDetails.template_id && !customDesignToken) return;

    setSiteDetails((prev: any) => ({ ...prev, template_id: templateId }));

    if (customDesignToken) {
      setDesignToken(customDesignToken);
    } else if (templateId !== "TEMPLATE_DYNAMIC") {
      setDesignToken(getTemplateDefaultDesignToken(templateId));
    }
  }, [siteDetails, setSiteDetails, setDesignToken]);

  // ── section reorder ──────────────────────────────────────────────────────────
  const handleReorderSection = useCallback((source: string, target: string) => {
    if (
      source === target ||
      !BODY_SECTION_KEYS.includes(source) ||
      !BODY_SECTION_KEYS.includes(target)
    ) return;

    const currentOrder = getOrderedSections(designToken, content, getHiddenSections())
      .filter((key) => BODY_SECTION_KEYS.includes(key));

    const nextOrder = [...currentOrder];
    const from = nextOrder.indexOf(source);
    const to = nextOrder.indexOf(target);
    if (from < 0 || to < 0) return;
    nextOrder.splice(from, 1);
    nextOrder.splice(to, 0, source);

    setDesignToken((prev: any) => ({
      ...(prev || {}),
      layout: { ...(prev?.layout || {}), section_order: nextOrder },
    }));
  }, [designToken, content, setDesignToken]);

  // ── section visibility ────────────────────────────────────────────────────────
  const toggleSectionVisibility = useCallback((key: string) => {
    if (["header", "footer", "seo"].includes(key)) return;
    setDesignToken((prev: any) => {
      const current: string[] = prev?.layout?.hidden_sections ?? [];
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return {
        ...(prev || {}),
        layout: { ...(prev?.layout || {}), hidden_sections: next },
      };
    });
  }, [setDesignToken]);

  // ── design asset batch appliers ───────────────────────────────────────────────
  const applyTypographyBatch = useCallback((fields: Record<string, any>) => {
    pushGlobalUndo();
    setDesignToken((prev: any) => ({
      ...(prev || {}),
      typography: { ...(prev?.typography || {}), ...fields },
    }));
  }, [pushGlobalUndo, setDesignToken]);

  const applyColorPattern = useCallback((pattern: ColorPattern) => {
    pushGlobalUndo();
    setDesignToken((prev: any) => {
      const next = { ...(prev || {}) };
      next.palette = { ...(next.palette || {}), ...pattern.palette };
      if (pattern.theme_mode) next.theme_mode = pattern.theme_mode;
      return next;
    });
  }, [pushGlobalUndo, setDesignToken]);

  const applyIndustryPreset = useCallback((preset: IndustryPreset) => {
    const pairing = getEnabledTypographyPairings().find((p) => p.id === preset.pairing_id);
    const pattern = getEnabledColorPatterns().find((p) => p.id === preset.pattern_id);
    if (!pairing || !pattern) return;
    pushGlobalUndo();
    setDesignToken((prev: any) => {
      const next = { ...(prev || {}) };
      next.palette = { ...(next.palette || {}), ...pattern.palette };
      if (pattern.theme_mode) next.theme_mode = pattern.theme_mode;
      next.typography = {
        ...(next.typography || {}),
        heading_font: pairing.heading_font,
        body_font: pairing.body_font,
        heading_weight: pairing.heading_weight,
        heading_size_hero: pairing.heading_size_hero,
        heading_style: pairing.heading_style ?? "normal",
        heading_transform: pairing.heading_transform ?? "none",
        heading_tracking: pairing.heading_tracking ?? "normal",
      };
      return next;
    });
  }, [pushGlobalUndo, setDesignToken]);

  return {
    globalUndo,
    updateField,
    updateDesignTokenField,
    updateDesignTokenLayout,
    updateSectionVariant,
    handleColorChange,
    handleTemplateChange,
    handleReorderSection,
    toggleSectionVisibility,
    applyTypographyBatch,
    applyColorPattern,
    applyIndustryPreset,
    pushGlobalUndo,
    handleGlobalUndo,
  };
}
