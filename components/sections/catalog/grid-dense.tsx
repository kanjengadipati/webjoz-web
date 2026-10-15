"use client";
import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, InlineText, CatalogMenuFilterBar } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { useCatalogFilter } from "../use-catalog-filter";
import { SectionHeader, pillEyebrowStyle, headerTitleStyle, headerDividerStyle } from "../section-header";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CatalogVariantProps {
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
}

/**
 * Grid Dense — tighter grid, smaller cards, fits more items per row.
 * Best for catalogs with 20+ items. Cards use minmax(180px, 1fr).
 */
export default function CatalogGridDense({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id"}: CatalogVariantProps) {
  const isEN = language === "en";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = catalog?.categories || [];
  const filteredCategories = useCatalogFilter(categories, activeCategory, searchQuery, isEditorMode);

  if (!catalog) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const text = "var(--dt-text)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";

  return (
    <section id="catalog" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <SectionHeader
          section="catalog"
          eyebrow={catalog.eyebrow ?? ""}
          title={catalog.title}
          wrapperStyle={{ textAlign: "center", marginBottom: "2.5rem" }}
          eyebrowStyle={pillEyebrowStyle(p)}
          titleStyle={headerTitleStyle(hFont, hWeight, text)}
          divider
          dividerStyle={headerDividerStyle(p)}
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
          placeholder="Cari produk..."
        />

        {filteredCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", opacity: 0.75 }}>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: text }}>
              Tidak ada produk yang cocok dengan pencarian "{searchQuery}".
            </p>
          </div>
        ) : (
          filteredCategories.map((cat, renderedIdx) => (
            <div key={renderedIdx} style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
                <InlineText section="catalog" fieldKey={"categories." + cat.originalCatIdx + ".name"} value={cat.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="h3" style={{ fontFamily: hFont, fontWeight: 700, color: p, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }} />
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton
                    compact
                    onDelete={() => onDeleteCategory(cat.originalCatIdx)}
                    title={isEN ? "Delete Category" : "Hapus Kategori"}
                  />
                )}


                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
              </div>
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {cat.filteredItems.map(({ item, originalCatIdx, originalItemIdx }) => (
                  <MenuCatalogCard
                    key={item.id || `cat-dense-${originalCatIdx}-${originalItemIdx}`}
                    item={{
                      id: item.id || `cat-dense-${originalCatIdx}-${originalItemIdx}`,
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
                      badge: item.badge,
                      is_available: item.is_available,
                      variant_groups: item.variant_groups,
                      features: item.features,
                      capacity: item.capacity,
                    }}
                    icon={ImageIcon}
                    styles={{
                      className: "group transition-all duration-300",
                      style: { background: bg, border: `1px solid color-mix(in srgb, ${p} 12%, transparent)`, borderRadius: "12px", overflow: "hidden" },
                      image: { className: "w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105" },
                      placeholder: { className: "w-full h-36 flex items-center justify-center", style: { background: `color-mix(in srgb, ${p} 8%, transparent)` }, iconClassName: "w-9 h-9", iconStyle: { color: `color-mix(in srgb, ${p} 30%, transparent)`, opacity: 0.6 } },
                      content: { className: "p-3.5 flex flex-col flex-1 min-w-0" },
                      header: { className: "flex flex-col gap-1 mb-1.5 min-w-0" },
                      title: { className: "font-semibold text-[13px] leading-tight line-clamp-2", style: { color: text, fontFamily: hFont } },
                      description: { className: "text-[11px] leading-relaxed line-clamp-2", style: { color: `color-mix(in srgb, ${text} 60%, transparent)` } },
                      price: { className: "self-start text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p } },
                      badge: { className: "inline-block text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full", style: { background: p, color: bg } },
                      button: { className: "w-full flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all duration-200 hover:brightness-110", style: { background: p, color: bg, border: "none" } },
                    }}
                    editSection="catalog"
                    pathBase={"categories." + originalCatIdx + ".items." + originalItemIdx}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    onDelete={isEditorMode && onDeleteItem ? () => onDeleteItem(originalCatIdx, originalItemIdx) : undefined}
                  />
                ))}
                {isEditorMode && onAddItem && (
                  <InlineAddTile
                    label="Tambah Item"
                    variant="card"
                    className="rounded-xl"
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
