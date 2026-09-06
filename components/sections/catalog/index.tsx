"use client";
import React, { useCallback } from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import { genId } from "../inline-add";
import CatalogClassic from "./classic";
import CatalogCompact from "./compact";
import CatalogCards from "./cards";
import CatalogGridDense from "./grid-dense";
import CatalogShowcaseFeatured from "./showcase-featured";
import CatalogTabsByCategory from "./tabs-by-category";
import CatalogEditorialGrid from "./editorial-grid";
import CatalogMasonryFlow from "./masonry-flow";
import CatalogInstagramSquareGrid from "./instagram-square-grid";
import CatalogSplitHeroCatalog from "./split-hero-catalog";
import CatalogNeoBrutalistMatrix from "./neo-brutalist-matrix";
import CatalogHorizontalSwipeCarousel from "./horizontal-swipe-carousel";

type CatalogVariantProps = {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: (catIdx: number) => void;
};

const variants: Record<string, ComponentType<CatalogVariantProps>> = {
  // existing
  grid: CatalogClassic,
  compact: CatalogCompact,
  cards: CatalogCards,
  // new
  "grid-dense": CatalogGridDense,
  "showcase-featured": CatalogShowcaseFeatured,
  "tabs-by-category": CatalogTabsByCategory,
  "editorial-grid": CatalogEditorialGrid,
  "masonry-flow": CatalogMasonryFlow,
  "instagram-square-grid": CatalogInstagramSquareGrid,
  "split-hero-catalog": CatalogSplitHeroCatalog,
  "neo-brutalist-matrix": CatalogNeoBrutalistMatrix,
  "horizontal-swipe-carousel": CatalogHorizontalSwipeCarousel,
};

export default function CatalogSection({
  catalog,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const variant = design_token?.layout?.section_variants?.catalog ?? "grid";
  const Renderer = variants[variant] ?? CatalogClassic;

  const isEditor = !!isEditorMode;

  const onAddItem = useCallback(
    (catIdx: number) => {
      if (!onUpdateField) return;
      const categories = [...(catalog?.categories ?? [])];
      if (!categories[catIdx]) return;
      const items = [...(categories[catIdx].items ?? [])];
      items.push({
        id: genId(),
        name: "",
        description: "",
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
        features: [],
        capacity: null,
        sort_order: items.length,
      });
      categories[catIdx] = { ...categories[catIdx], items };
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
      />
    </>
  );
}
