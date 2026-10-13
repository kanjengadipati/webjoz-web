"use client";
import React, { useState } from "react";
import { Utensils } from "lucide-react";
import {
  MenuCatalogCard,
  InlineText,
} from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { ProductQuickView, toQuickViewItem } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

type MenuVariantProps = {
  menu: TemplateProps["content"]["menu"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: unknown) => void;
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

export default function MenuMasonryFlow({
  menu,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onAddItem,
  onDeleteItem,
  onAddCategory,
  onDeleteCategory,
  language = "id",
}: MenuVariantProps) {
  const isEN = language === "en";
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);

  if (!menu) return null;

  const { eyebrow, title, subtitle, categories } = menu;
  const qvCategory = quickView ? categories?.[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  const brandBg = "var(--dt-bg)";
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const dtRadius = "var(--dt-radius)";

  return (
    <section
      id="menu"
      className="py-16 px-4 md:px-8 max-w-7xl mx-auto"
      style={{
        backgroundColor: brandBg,
        color: brandText,
        fontFamily: "var(--dt-body-font, sans-serif)",
        paddingTop: "var(--dt-spacing)",
        paddingBottom: "var(--dt-spacing)",
      }}
    >
      {/* Header */}
      <div className="mb-16 text-center max-w-2xl mx-auto">
        {(eyebrow || isEditorMode) && (
          <InlineText
            section="menu"
            fieldKey="eyebrow"
            value={eyebrow ?? (isEN ? "Menu Selection" : "Pilihan Menu")}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
            className="text-xs uppercase tracking-widest font-semibold block mb-2"
            style={{ color: brandPrimary, fontFamily: headingFont }}
          />
        )}
        <InlineText
          section="menu"
          fieldKey="title"
          value={title}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
          as="h2"
          className="text-3xl md:text-4xl font-normal tracking-tight mb-4"
          style={{
            color: brandText,
            fontFamily: headingFont,
            fontWeight: headingWeight as React.CSSProperties["fontWeight"],
          }}
        />
        {(subtitle || isEditorMode) && (
          <InlineText
            section="menu"
            fieldKey="subtitle"
            value={subtitle}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="p"
            className="text-base font-light leading-relaxed"
            style={{ color: "var(--dt-text-muted)" }}
          />
        )}
      </div>

      {/* Categories */}
      <div className="space-y-24">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-8">
            <div
              className="border-b pb-3 flex items-center gap-2"
              style={{ borderColor: "var(--dt-border)" }}
            >
              <InlineText
                section="menu"
                fieldKey={"categories." + catIdx + ".name"}
                value={category.name ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="h3"
                className="text-sm uppercase tracking-widest font-semibold"
                style={{ fontFamily: headingFont, color: brandPrimary }}
              />
              {isEditorMode && onDeleteCategory && (
                <InlineDeleteButton
                  compact
                  onDelete={() => onDeleteCategory(catIdx)}
                  title={isEN ? "Delete Category" : "Hapus Kategori"}
                />
              )}
            </div>

            {/* Vertical CSS Masonry Columns */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 [column-fill:_balance]">
              {category.items?.map((item, index) => (
                <div
                  key={item.id || `menu-mf-${catIdx}-${index}`}
                  className="break-inside-avoid mb-6 flex flex-col group relative overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: "var(--dt-border)",
                    backgroundColor: "var(--dt-surface)",
                    borderRadius: dtRadius,
                    border: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                  }}
                >
                  <MenuCatalogCard
                    layout="grid"
                    itemId={item.id || `menu-mf-${catIdx}-${index}`}
                    itemName={item.name}
                    itemPrice={item.price}
                    itemPriceAmount={item.price_amount}
                    itemPriceDisplay={item.price_display}
                    itemPromoPriceAmount={item.promo_price_amount}
                    itemPromoPriceDisplay={item.promo_price_display}
                    discountLabel={item.discount_label}
                    itemDescription={item.description}
                    category={category.name}
                    image_url={item.image_url}
                    image_urls={item.image_urls}
                    image_credit={item.image_credit}
                    badge={item.badge}
                    is_available={item.is_available}
                    variant_groups={item.variant_groups}
                    icon={Utensils}
                    className="h-full transition-all duration-300 group-hover:shadow-lg"
                    style={{
                      background: "var(--dt-surface)",
                      border: "none",
                      borderRadius: dtRadius,
                      overflow: "hidden",
                    }}
                    imageClassName="w-full aspect-auto object-cover"
                    placeholderClassName="w-full aspect-[4/3] flex items-center justify-center"
                    placeholderStyle={{
                      background: `color-mix(in srgb, ${brandPrimary} 8%, transparent)`,
                    }}
                    placeholderIconClassName="w-10 h-10"
                    placeholderIconStyle={{
                      color: `color-mix(in srgb, ${brandPrimary} 35%, transparent)`,
                    }}
                    contentClassName="flex flex-col gap-2 p-4"
                    titleClassName="font-semibold text-base leading-tight"
                    titleStyle={{ color: brandText, fontFamily: headingFont }}
                    descriptionClassName="text-sm leading-relaxed"
                    descriptionStyle={{
                      color: `color-mix(in srgb, ${brandText} 70%, transparent)`,
                    }}
                    priceClassName="text-sm font-bold px-2 py-0.5 rounded-full self-start"
                    priceStyle={{
                      background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                      color: brandPrimary,
                    }}
                    buttonClassName="mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-all hover:brightness-110"
                    buttonStyle={{ background: brandPrimary, color: brandBg, border: "none" }}
                    editSection="menu"
                    pathBase={"categories." + catIdx + ".items." + index}
                  />
                  {isEditorMode && onDeleteItem && (
                    <InlineDeleteButton
                      compact
                      className="absolute top-2 right-2 z-40"
                      onDelete={() => onDeleteItem(catIdx, index)}
                      title={isEN ? "Delete Item" : "Hapus Item"}
                    />
                  )}
                  <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => setQuickView({ catIdx, itemIdx: index })}
                  />
                </div>
              ))}
              {isEditorMode && onAddItem && (
                <InlineAddTile
                  label={isEN ? "Add Menu Item" : "Tambah Menu"}
                  variant="card"
                  className="break-inside-avoid mb-6 min-h-[240px] w-full"
                  style={{ borderRadius: dtRadius }}
                  onClick={() => onAddItem(catIdx)}
                />
              )}
            </div>
          </div>
        ))}
        {isEditorMode && onAddCategory && (
          <div className="pt-8">
            <CategoryAddButton
              onAdd={onAddCategory}
              isEN={isEN}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
          </div>
        )}
      </div>

      {quickView && qvItem && (
        <ProductQuickView
          item={toQuickViewItem(qvItem, qvCategory?.name)}
          open={!!quickView}
          onClose={() => setQuickView(null)}
          editSection="menu"
          pathBase={`categories.${quickView.catIdx}.items.${quickView.itemIdx}`}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      )}
    </section>
  );
}
