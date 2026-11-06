"use client";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import { genId } from "../inline-add";

const MenuClassic = dynamic(() => import("./classic"));
const MenuCompact = dynamic(() => import("./compact"));
const MenuCards = dynamic(() => import("./cards"));
const MenuTextList = dynamic(() => import("./text-list"));
const MenuCompactList = dynamic(() => import("./compact-list"));
const MenuTabsByCategory = dynamic(() => import("./tabs-by-category"));
const MenuAccordionByCategory = dynamic(() => import("./accordion-by-category"));
const MenuBentoPhotoGrid = dynamic(() => import("./bento-photo-grid"));
const MenuVisualShowcaseHero = dynamic(() => import("./visual-showcase-hero"));
const MenuSidebarScrollspyPhoto = dynamic(() => import("./sidebar-scrollspy-photo"));
const MenuHorizontalSwipeCarousel = dynamic(() => import("./horizontal-swipe-carousel"));
const MenuMasonryFlow = dynamic(() => import("./masonry-flow"));

type MenuVariantProps = {
  menu: TemplateProps["content"]["menu"];
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
  "horizontal-swipe-carousel": MenuHorizontalSwipeCarousel,
  "masonry-flow": MenuMasonryFlow,
};

export default function MenuSection({
  menu,
  design_token,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
}: {
  menu: TemplateProps["content"]["menu"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: "id" | "en";
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
      const itemNumber = items.length + 1;
      items.push({
        id: genId(),
        name: `Item ${itemNumber}`,
        description: "Deskripsi item",
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

  const onDeleteItem = useCallback(
    (catIdx: number, itemIdx: number) => {
      if (!onUpdateField) return;
      const categories = [...(menu?.categories ?? [])];
      if (!categories[catIdx]) return;
      const items = (categories[catIdx].items ?? []).filter((_, i) => i !== itemIdx);
      categories[catIdx] = { ...categories[catIdx], items };
      onUpdateField("menu", "categories", categories);
    },
    [menu?.categories, onUpdateField]
  );

  const onAddCategory = useCallback(() => {
    if (!onUpdateField) return;
    const categories = [...(menu?.categories ?? [])];
    const number = categories.length + 1;
    categories.push({
      id: genId(),
      name: language === "en" ? `Category ${number}` : `Kategori ${number}`,
      items: [],
      sort_order: categories.length,
    });
    onUpdateField("menu", "categories", categories);
  }, [menu?.categories, language, onUpdateField]);

  const onDeleteCategory = useCallback(
    (catIdx: number) => {
      if (!onUpdateField) return;
      const categories = (menu?.categories ?? []).filter((_, i) => i !== catIdx);
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
        onDeleteItem={isEditor ? onDeleteItem : undefined}
        onAddCategory={isEditor ? onAddCategory : undefined}
        onDeleteCategory={isEditor ? onDeleteCategory : undefined}
        language={language}
      />
    </>
  );
}
