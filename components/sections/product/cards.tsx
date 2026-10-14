"use client";
import React, { useState } from "react";
import { Utensils, Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, InlineText, CatalogMenuFilterBar, type MenuCatalogCardStyles } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { useCatalogFilter } from "../use-catalog-filter";
import { productCategories, type ProductVariantProps } from "./types";

export default function ProductCards({
  kind, data, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
  onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id",
}: ProductVariantProps) {
  const isEN = language === "en";
  const isMenu = kind === "menu";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = productCategories(data);
  const filteredCategories = useCatalogFilter(categories, activeCategory, searchQuery, isEditorMode);

  if (!data) return null;
  const brandBg = "var(--dt-bg)";
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const placeholderStyle = { background: `color-mix(in srgb, ${brandPrimary} 8%, transparent)` };
  const placeholderIconStyle = { color: `color-mix(in srgb, ${brandPrimary} 30%, transparent)`, opacity: 0.6 };

  const cardStyles: MenuCatalogCardStyles = isMenu
    ? {
        className: "group transition-all duration-300 flex-1",
        style: { background: brandBg, border: `1px solid color-mix(in srgb, ${brandPrimary} 14%, transparent)`, borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
        image: { className: "w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" },
        placeholder: { className: "w-full h-64 flex items-center justify-center transition-transform duration-500 group-hover:scale-105", style: placeholderStyle, iconClassName: "w-16 h-16", iconStyle: placeholderIconStyle },
        content: { className: "p-6 space-y-3 flex flex-col flex-1" },
        header: { className: "flex items-start justify-between gap-3" },
        title: { className: "font-bold text-base leading-tight", style: { color: brandText, fontFamily: headingFont } },
        description: { className: "text-sm leading-relaxed", style: { color: `color-mix(in srgb, ${brandText} 60%, transparent)` } },
        price: { className: "text-sm font-bold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0", style: { background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`, color: brandPrimary } },
        button: { className: "w-full flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md", style: { background: brandPrimary, color: "var(--dt-cta-text, #fff)", border: "none" } },
      }
    : {
        className: "group transition-all duration-300",
        style: { background: brandBg, border: `1px solid color-mix(in srgb, ${brandPrimary} 14%, transparent)`, borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", minWidth: 0 },
        image: { className: "w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105" },
        placeholder: { className: "w-full aspect-[4/5] flex items-center justify-center transition-transform duration-500 group-hover:scale-105", style: placeholderStyle, iconClassName: "w-16 h-16", iconStyle: placeholderIconStyle },
        content: { className: "p-4 flex flex-col flex-1 min-w-0" },
        header: { className: "flex flex-col gap-1.5 mb-2 min-w-0" },
        title: { className: "font-bold text-base leading-tight", style: { color: brandText, fontFamily: headingFont } },
        description: { className: "text-sm leading-relaxed line-clamp-2", style: { color: `color-mix(in srgb, ${brandText} 60%, transparent)` } },
        price: { className: "self-start text-sm font-bold px-3 py-1.5 rounded-full", style: { background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`, color: brandPrimary } },
        badge: { className: "inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap", style: { background: brandPrimary, color: brandBg } },
        button: { className: "w-full flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md", style: { background: brandPrimary, color: brandBg, border: "none" } },
      };

  const eyebrowDefault = isMenu ? "Pilihan Menu" : "Koleksi Produk";
  const searchPlaceholder = isMenu ? "Cari menu, rasa, atau tags..." : "Cari produk atau fasilitas...";
  const emptyLabel = isMenu ? "menu" : "produk";
  const Icon = isMenu ? Utensils : ImageIcon;

  return (
    <section id={kind} style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: brandPrimary, background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>
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
          />
          </span>
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
            style={{ fontFamily: headingFont, fontWeight: headingWeight as React.CSSProperties["fontWeight"], fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: brandText, marginTop: "0.85rem", lineHeight: 1.15 }}
          />
          <div style={{ width: "3rem", height: "3px", background: brandPrimary, borderRadius: "4px", margin: "0.75rem auto 0" }} />
        </div>

        {/* Realtime Search & Category Filter */}
        <CatalogMenuFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder={searchPlaceholder}
        />

        {filteredCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", opacity: 0.75 }}>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: brandText }}>
              Tidak ada {emptyLabel} yang cocok dengan pencarian &quot;{searchQuery}&quot;.
            </p>
          </div>
        ) : (
          filteredCategories.map((cat, renderedIdx) => (
            <div key={renderedIdx} style={{ marginBottom: "4rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <InlineText
                  section={kind}
                  fieldKey={"categories." + cat.originalCatIdx + ".name"}
                  value={cat.name ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="h3"
                  style={{ fontFamily: headingFont, fontWeight: 700, color: brandPrimary, fontSize: "1.1rem" }}
                />
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton
                    compact
                    onDelete={() => onDeleteCategory(cat.originalCatIdx)}
                    title={isEN ? "Delete Category" : "Hapus Kategori"}
                  />
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMenu ? 320 : 280}px, 1fr))`, gap: "1.5rem", ...(isMenu ? { alignItems: "stretch" } : {}) }}>
                {cat.filteredItems.map(({ item, originalCatIdx, originalItemIdx }) => {
                  const cardKey = item.id || `${cat.name}__${item.name}__${originalCatIdx}_${originalItemIdx}`;
                  const cardEl = (
                    <MenuCatalogCard
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
                        category: cat.name,
                        image_url: item.image_url,
                        image_urls: item.image_urls,
                        is_available: item.is_available,
                        variant_groups: item.variant_groups,
                        ...(isMenu
                          ? { tags: item.tags, delivery_platforms: item.delivery_platforms }
                          : { badge: item.badge, features: item.features, maxFeatures: 2, capacity: item.capacity }),
                      }}
                      icon={Icon}
                      styles={cardStyles}
                      editSection={kind}
                      pathBase={"categories." + originalCatIdx + ".items." + originalItemIdx}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                      onDelete={isEditorMode && onDeleteItem ? () => onDeleteItem(originalCatIdx, originalItemIdx) : undefined}
                    />
                  );
                  return isMenu
                    ? <div key={cardKey} className="flex flex-col h-full">{cardEl}</div>
                    : <React.Fragment key={cardKey}>{cardEl}</React.Fragment>;
                })}
                {isEditorMode && onAddItem && (
                  <InlineAddTile
                    label="Tambah Item"
                    variant="card"
                    className="rounded-3xl"
                    onClick={() => onAddItem(cat.originalCatIdx)}
                  />
                )}
              </div>
            </div>
          ))
        )}
        {isEditorMode && onAddCategory && (
          <CategoryAddButton onAdd={onAddCategory} isEN={isEN} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
        )}
      </div>
    </section>
  );
}
