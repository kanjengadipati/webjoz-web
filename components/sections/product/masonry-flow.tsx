"use client";
import React from "react";
import { Utensils, Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, InlineText, type MenuCatalogCardStyles } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { productCategories, type ProductVariantProps } from "./types";

export default function ProductMasonryFlow({
  kind, data, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
  onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id",
}: ProductVariantProps) {
  const isEN = language === "en";
  const isMenu = kind === "menu";

  if (!data) return null;
  const categories = productCategories(data);

  const brandBg = "var(--dt-bg)";
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const dtRadius = "var(--dt-radius)";

  const cardStyles: MenuCatalogCardStyles = {
    className: "h-full transition-all duration-300 group-hover:shadow-lg",
    style: { background: "var(--dt-surface)", border: "none", borderRadius: dtRadius, overflow: "hidden" },
    image: { className: "w-full aspect-auto object-cover" },
    placeholder: { className: "w-full aspect-[4/3] flex items-center justify-center", style: { background: `color-mix(in srgb, ${brandPrimary} 8%, transparent)` }, iconClassName: "w-10 h-10", iconStyle: { color: `color-mix(in srgb, ${brandPrimary} 35%, transparent)` } },
    content: { className: "flex flex-col gap-2 p-4" },
    title: { className: "font-semibold text-base leading-tight", style: { color: brandText, fontFamily: headingFont } },
    description: { className: "text-sm leading-relaxed", style: { color: `color-mix(in srgb, ${brandText} 70%, transparent)` } },
    price: { className: "text-sm font-bold px-2 py-0.5 rounded-full self-start", style: { background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`, color: brandPrimary } },
    button: { className: "mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-all hover:brightness-110", style: { background: brandPrimary, color: brandBg, border: "none" } },
  };

  const eyebrowDefault = isMenu ? "Pilihan Menu" : "Koleksi Produk";
  const Icon = isMenu ? Utensils : ImageIcon;

  return (
    <section
      id={kind}
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
        {(data.eyebrow || isEditorMode) && (
          <InlineText
            section={kind}
            fieldKey="eyebrow"
            value={data.eyebrow ?? eyebrowDefault}
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
          section={kind}
          fieldKey="title"
          value={data.title}
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
        {(data.subtitle || isEditorMode) && (
          <InlineText
            section={kind}
            fieldKey="subtitle"
            value={data.subtitle}
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
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-8">
            <div
              className="border-b pb-3 flex items-center gap-2"
              style={{ borderColor: "var(--dt-border)" }}
            >
              <InlineText
                section={kind}
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
              {category.items?.map((item, index) => {
                const cardKey = item.id || `${kind}-mf-${catIdx}-${index}`;
                return (
                  <div
                    key={cardKey}
                    className="break-inside-avoid mb-6 flex flex-col group relative overflow-hidden"
                    style={{
                      borderColor: "var(--dt-border)",
                      backgroundColor: "var(--dt-surface)",
                      borderRadius: dtRadius,
                      border: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                    }}
                  >
                    <MenuCatalogCard
                      layout="grid"
                      item={{
                        id: cardKey,
                        name: item.name,
                        price: item.price,
                        priceAmount: item.price_amount,
                        priceDisplay: item.price_display,
                        promoPriceAmount: item.promo_price_amount,
                        promoPriceDisplay: item.promo_price_display,
                        discountLabel: item.discount_label,
                        description: item.description,
                        category: category.name,
                        image_url: item.image_url,
                        image_urls: item.image_urls,
                        image_credit: item.image_credit,
                        is_available: item.is_available,
                        variant_groups: item.variant_groups,
                        ...(isMenu
                          ? { tags: item.tags, delivery_platforms: item.delivery_platforms }
                          : { badge: item.badge, features: item.features, maxFeatures: 2, capacity: item.capacity }),
                      }}
                      icon={Icon}
                      styles={cardStyles}
                      editSection={kind}
                      pathBase={"categories." + catIdx + ".items." + index}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                      onDelete={isEditorMode && onDeleteItem ? () => onDeleteItem(catIdx, index) : undefined}
                    />
                  </div>
                );
              })}
              {isEditorMode && onAddItem && (
                <InlineAddTile
                  label={isEN ? (isMenu ? "Add Menu Item" : "Add Product") : (isMenu ? "Tambah Menu" : "Tambah Produk")}
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
    </section>
  );
}
