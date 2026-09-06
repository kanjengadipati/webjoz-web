"use client";
import React, { useCallback } from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import { genId } from "../inline-add";
import MenuClassic from "./classic";
import MenuCompact from "./compact";
import MenuCards from "./cards";
import MenuTextList from "./text-list";
import MenuCompactList from "./compact-list";
import MenuTabsByCategory from "./tabs-by-category";
import MenuAccordionByCategory from "./accordion-by-category";
import MenuBentoPhotoGrid from "./bento-photo-grid";
import MenuVisualShowcaseHero from "./visual-showcase-hero";
import MenuSidebarScrollspyPhoto from "./sidebar-scrollspy-photo";

type MenuVariantProps = {
  menu: TemplateProps["content"]["menu"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: (catIdx: number) => void;
};

const variants: Record<string, ComponentType<MenuVariantProps>> = {
  // existing
  grid: MenuClassic,
  compact: MenuCompact,
  cards: MenuCards,
  // new
  "text-list": MenuTextList,
  "compact-list": MenuCompactList,
  "tabs-by-category": MenuTabsByCategory,
  "accordion-by-category": MenuAccordionByCategory,
  "bento-photo-grid": MenuBentoPhotoGrid,
  "visual-showcase-hero": MenuVisualShowcaseHero,
  "sidebar-scrollspy-photo": MenuSidebarScrollspyPhoto,
};

export default function MenuSection({
  menu,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  menu: TemplateProps["content"]["menu"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const variant = design_token?.layout?.section_variants?.menu ?? "grid";
  const Renderer = variants[variant] ?? MenuClassic;

  const isEditor = !!isEditorMode;

  const onAddItem = useCallback(
    (catIdx: number) => {
      if (!onUpdateField) return;
      const categories = [...(menu?.categories ?? [])];
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
        image_url: null,
        is_available: true,
        tags: [],
        delivery_platforms: [],
        sort_order: items.length,
      });
      categories[catIdx] = { ...categories[catIdx], items };
      onUpdateField("menu", "categories", categories);
    },
    [menu?.categories, onUpdateField]
  );

  return (
    <>
      <Renderer
        menu={menu}
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
