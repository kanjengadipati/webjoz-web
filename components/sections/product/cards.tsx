"use client";
import React, { useState } from "react";
import { Utensils, Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, InlineText, CatalogMenuFilterBar, type MenuCatalogCardStyles } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { useCatalogFilter } from "../use-catalog-filter";
import { SectionHeader, pillEyebrowStyle, headerTitleStyle } from "../section-header";
import { productCategories, type ProductVariantProps } from "./types";

export default function ProductCards({
  kind, data, design_token, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
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
        className: "group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex-1",
        style: { background: "var(--dt-surface, #fff)", border: `1px solid color-mix(in srgb, ${brandPrimary} 14%, transparent)`, borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.06)" },
        image: { className: "w-full h-64 object-cover transition-transform duration-700 ease-out group-hover:scale-105" },
        placeholder: { className: "w-full h-64 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105", style: placeholderStyle, iconClassName: "w-16 h-16", iconStyle: placeholderIconStyle },
        content: { className: "p-6 space-y-3 flex flex-col flex-1" },
        header: { className: "flex items-start justify-between gap-3" },
        title: { className: "font-extrabold text-base leading-tight", style: { color: brandText, fontFamily: headingFont } },
        description: { className: "text-sm leading-relaxed", style: { color: `color-mix(in srgb, ${brandText} 65%, transparent)` } },
        price: { className: "text-sm font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 shadow-sm", style: { background: `color-mix(in srgb, ${brandPrimary} 15%, transparent)`, color: brandPrimary } },
        button: { className: "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md", style: { background: brandPrimary, color: "var(--dt-cta-text, #fff)", border: "none" } },
      }
    : {
        className: "group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
        style: { background: "var(--dt-surface, #fff)", border: `1px solid color-mix(in srgb, ${brandPrimary} 14%, transparent)`, borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.06)", minWidth: 0 },
        image: { className: "w-full aspect-[4/5] object-cover transition-transform duration-700 ease-out group-hover:scale-105" },
        placeholder: { className: "w-full aspect-[4/5] flex flex-col items-center justify-center p-4 text-center transition-transform duration-700 ease-out group-hover:scale-105", style: placeholderStyle, iconClassName: "w-16 h-16", iconStyle: placeholderIconStyle },
        content: { className: "p-5 flex flex-col flex-1 min-w-0" },
        header: { className: "flex flex-col gap-1.5 mb-2 min-w-0" },
        title: { className: "font-extrabold text-base leading-snug tracking-tight", style: { color: brandText, fontFamily: headingFont } },
        description: { className: "text-xs leading-relaxed line-clamp-2", style: { color: `color-mix(in srgb, ${brandText} 65%, transparent)` } },
        price: { className: "self-start text-xs font-extrabold px-3 py-1 rounded-full whitespace-nowrap shadow-sm", style: { background: `color-mix(in srgb, ${brandPrimary} 15%, transparent)`, color: brandPrimary } },
        badge: { className: "inline-block text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap shadow-md", style: { background: brandPrimary, color: "var(--dt-cta-text, #fff)" } },
        button: { className: "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md", style: { background: brandPrimary, color: "var(--dt-cta-text, #fff)", border: "none" } },
      };

  const eyebrowDefault = isMenu ? (isEN ? "Menu Selection" : "Pilihan Menu") : (isEN ? "Product Collection" : "Koleksi Produk");
  const searchPlaceholder = isMenu ? (isEN ? "Search menu, flavor, or tags..." : "Cari menu, rasa, atau tags...") : (isEN ? "Search products or amenities..." : "Cari produk atau fasilitas...");
  const emptyLabel = isMenu ? (isEN ? "menu item" : "menu") : (isEN ? "product" : "produk");
  const Icon = isMenu ? Utensils : ImageIcon;

  return (
    <section id={kind} style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <SectionHeader
          section={kind}
          eyebrow={data.eyebrow ?? eyebrowDefault}
          title={data.title}
          wrapperStyle={{ textAlign: "center", marginBottom: "2.5rem" }}
          eyebrowWrapperStyle={pillEyebrowStyle(brandPrimary)}
          titleStyle={headerTitleStyle(headingFont, headingWeight, brandText)}
          divider
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />

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
              {isEN ? `No ${emptyLabel} matches "${searchQuery}".` : `Tidak ada ${emptyLabel} yang cocok dengan pencarian "${searchQuery}".`}
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
                  const cardKey = item.id || `${kind}-cards-${originalCatIdx}-${originalItemIdx}`;
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
                      layout={design_token?.layout?.card_style ?? "grid"}
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
                    label={isEN ? (isMenu ? "Add Menu" : "Add Item") : (isMenu ? "Tambah Menu" : "Tambah Item")}
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
