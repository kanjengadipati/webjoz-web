"use client";
import React, { useCallback } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import { genId } from "../inline-add";
import { useEditorChromeEnabled } from "../editor-chrome-context";

import { resolveVariant } from "../variant-meta";
import { CATALOG_VARIANTS } from "./variants";

export type CatalogVariantProps = {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: (catIdx: number) => void;
  onDeleteItem?: (catIdx: number, itemIdx: number) => void;
  onAddCategory?: () => void;
  onDeleteCategory?: (catIdx: number) => void;
  language?: "id" | "en";
};

export default function CatalogSection({
  catalog,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
}: {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: "id" | "en";
}) {
  const variant = design_token?.layout?.section_variants?.catalog ?? "grid";
  const Renderer = resolveVariant<CatalogVariantProps>(CATALOG_VARIANTS, variant, "grid");

  const chromeEnabled = useEditorChromeEnabled();
  const isEditor = !!isEditorMode && chromeEnabled;

  const onAddItem = useCallback(
    (catIdx: number) => {
      if (!onUpdateField) return;
      const categories = [...(catalog?.categories ?? [])];
      if (!categories[catIdx]) return;
      const items = [...(categories[catIdx].items ?? [])];
      const itemNumber = items.length + 1;
      const isEN = language === "en";
      const existingFeatures = items.find((it) => it.features && it.features.length > 0)?.features;
      const defaultFeatures = existingFeatures && existingFeatures.length > 0
        ? existingFeatures.map((_, i) => (isEN ? `Feature ${i + 1}` : `Fitur ${i + 1}`))
        : isEN
          ? ["Key Feature 1", "Key Feature 2", "Official Warranty"]
          : ["Fitur Unggulan 1", "Fitur Unggulan 2", "Garansi Resmi"];

      items.push({
        id: genId(),
        name: `Item ${itemNumber}`,
        description: isEN ? "Item description" : "Deskripsi item",
        price: "",
        price_display: "",
        price_amount: null,
        promo_price: "",
        promo_price_display: "",
        promo_price_amount: null,
        discount_label: null,
        badge: null,
        image_url: null,
        is_available: true,
        features: defaultFeatures,
        capacity: null,
        sort_order: items.length,
      });
      categories[catIdx] = { ...categories[catIdx], items };
      onUpdateField("catalog", "categories", categories);
    },
    [catalog?.categories, onUpdateField, language]
  );

  const onDeleteItem = useCallback(
    (catIdx: number, itemIdx: number) => {
      if (!onUpdateField) return;
      const categories = [...(catalog?.categories ?? [])];
      if (!categories[catIdx]) return;
      const items = (categories[catIdx].items ?? []).filter((_, i) => i !== itemIdx);
      categories[catIdx] = { ...categories[catIdx], items };
      onUpdateField("catalog", "categories", categories);
    },
    [catalog?.categories, onUpdateField]
  );

  const onAddCategory = useCallback(() => {
    if (!onUpdateField) return;
    const categories = [...(catalog?.categories ?? [])];
    const number = categories.length + 1;
    categories.push({
      id: genId(),
      name: language === "en" ? `Category ${number}` : `Kategori ${number}`,
      items: [],
      sort_order: categories.length,
    });
    onUpdateField("catalog", "categories", categories);
  }, [catalog?.categories, language, onUpdateField]);

  const onDeleteCategory = useCallback(
    (catIdx: number) => {
      if (!onUpdateField) return;
      const categories = (catalog?.categories ?? []).filter((_, i) => i !== catIdx);
      onUpdateField("catalog", "categories", categories);
    },
    [catalog?.categories, onUpdateField]
  );

  return (
    <>
      <Renderer
        catalog={catalog}
        design_token={design_token}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
        onAddItem={isEditor ? onAddItem : undefined}
        onDeleteItem={isEditor ? onDeleteItem : undefined}
        onAddCategory={isEditor ? onAddCategory : undefined}
        onDeleteCategory={isEditor ? onDeleteCategory : undefined}
        language={language}
      />
    </>
  );
}
