"use client";
import React from "react";
import { Utensils, Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, InlineText, type MenuCatalogCardStyles } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { SectionHeader } from "../section-header";
import { productCategories, type ProductVariantProps } from "./types";

export default function ProductMasonryFlow({
  kind, data, design_token, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
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
  const dtRadius = "var(--dt-radius, 20px)";

  const MASONRY_ASPECTS = [
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[2/3]",
    "aspect-[16/11]",
    "aspect-[3/4]",
  ];

  const getMasonryCardStyles = (index: number): MenuCatalogCardStyles => {
    const aspect = MASONRY_ASPECTS[index % MASONRY_ASPECTS.length];
    return {
      className: "h-full transition-all duration-300 flex flex-col",
      style: { background: "var(--dt-surface)", border: "none", overflow: "hidden" },
      image: { className: `w-full ${aspect} object-cover transition-transform duration-500 group-hover:scale-105` },
      placeholder: {
        className: `w-full ${aspect} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`,
        style: { background: `color-mix(in srgb, ${brandPrimary} 8%, transparent)` },
        iconClassName: "w-10 h-10",
        iconStyle: { color: `color-mix(in srgb, ${brandPrimary} 35%, transparent)` },
      },
      content: { className: "flex flex-col gap-2 p-4 flex-grow" },
      header: { className: "flex flex-col gap-1.5 mb-1" },
      title: { className: "font-bold text-base leading-tight", style: { color: brandText, fontFamily: headingFont } },
      description: { className: "text-xs leading-relaxed line-clamp-3", style: { color: `color-mix(in srgb, ${brandText} 70%, transparent)` } },
      price: { className: "text-xs font-bold px-2.5 py-1 rounded-full self-start", style: { background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`, color: brandPrimary } },
      badge: { className: "inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap", style: { background: brandPrimary, color: "var(--dt-cta-text, #fff)" } },
      button: { className: "mt-auto w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl transition-all hover:brightness-110 shadow-sm cursor-pointer", style: { background: brandPrimary, color: "var(--dt-cta-text, #fff)", border: "none" } },
    };
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
      <SectionHeader
        section={kind}
        eyebrow={(data.eyebrow || isEditorMode) ? (data.eyebrow ?? eyebrowDefault) : undefined}
        title={data.title}
        subtitle={(data.subtitle || isEditorMode) ? (data.subtitle ?? "") : undefined}
        wrapperClassName="mb-16 text-center max-w-2xl mx-auto"
        eyebrowClassName="text-xs uppercase tracking-widest font-semibold block mb-2"
        eyebrowStyle={{ color: brandPrimary, fontFamily: headingFont }}
        titleClassName="text-3xl md:text-4xl font-normal tracking-tight mb-4"
        titleStyle={{
          color: brandText,
          fontFamily: headingFont,
          fontWeight: headingWeight as React.CSSProperties["fontWeight"],
        }}
        subtitleClassName="text-base font-light leading-relaxed"
        subtitleStyle={{ color: "var(--dt-text-muted)" }}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />

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
                    className="break-inside-avoid mb-6 flex flex-col group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      borderColor: "var(--dt-border)",
                      backgroundColor: "var(--dt-surface)",
                      borderRadius: dtRadius,
                      border: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    }}
                  >
                    <MenuCatalogCard
                      layout={design_token?.layout?.card_style ?? "grid"}
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
                      styles={getMasonryCardStyles(index)}
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
