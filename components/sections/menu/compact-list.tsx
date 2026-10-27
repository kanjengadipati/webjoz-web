"use client";
import React, { useState } from "react";
import { Utensils } from "lucide-react";
import { MenuCatalogCard, InlineText, CatalogMenuFilterBar } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { useCatalogFilter } from "../use-catalog-filter";
import { SectionHeader, pillEyebrowStyle, headerTitleStyle, headerDividerStyle } from "../section-header";
import type { TemplateProps, DesignToken } from "../../templates/types";

/**
 * Compact List — horizontal card layout (image left, text right).
 * Reuses MenuCatalogCard with layout="compact".
 * Good for menus with many items where vertical space is precious.
 */
export default function MenuCompactList({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id" }: { menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null; onUpdateField?: (section: string, key: string, value: any) => void; isEditorMode?: boolean; isSelected?: boolean; collapseSheetForInlineEdit?: () => void; onEditingStateChange?: (isEditing: boolean) => void; onAddItem?: (catIdx: number) => void; onDeleteItem?: (catIdx: number, itemIdx: number) => void; onAddCategory?: () => void; onDeleteCategory?: (catIdx: number) => void; language?: "id" | "en"; }) {
  const isEN = language === "en";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = menu?.categories || [];
  const filteredCategories = useCatalogFilter(categories, activeCategory, searchQuery, isEditorMode);

  if (!menu) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const text = "var(--dt-text)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";

  return (
    <section id="menu" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <SectionHeader
          section="menu"
          eyebrow={menu.eyebrow ?? (isEN ? "Menu Selection" : "Pilihan Menu")}
          title={menu.title}
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
          placeholder={isEN ? "Search menu..." : "Cari menu..."}
        />

        {filteredCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", opacity: 0.75 }}>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: text }}>
              {isEN ? `No menu items match "${searchQuery}".` : `Tidak ada menu yang cocok dengan pencarian "${searchQuery}".`}
            </p>
          </div>
        ) : (
          filteredCategories.map((cat, renderedIdx) => (
            <div key={renderedIdx} style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
                <InlineText
                  section="menu"
                  fieldKey={"categories." + cat.originalCatIdx + ".name"}
                  value={cat.name ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="h3"
                  style={{ fontFamily: hFont, fontWeight: 700, color: p, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}
                />
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton
                    compact
                    onDelete={() => onDeleteCategory(cat.originalCatIdx)}
                    title={isEN ? "Delete Category" : "Hapus Kategori"}
                  />
                )}


                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {cat.filteredItems.map(({ item, originalCatIdx, originalItemIdx }) => (
                  <MenuCatalogCard
                    key={item.id || `menu-cl-${originalCatIdx}-${originalItemIdx}`}
                    layout="compact"
                    item={{
                      id: item.id || `menu-cl-${originalCatIdx}-${originalItemIdx}`,
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
                      tags: item.tags,
                      delivery_platforms: item.delivery_platforms,
                    }}
                    icon={Utensils}
                    styles={{
                      className: "transition-all duration-200 hover:shadow-md",
                      style: { background: bg, border: `1px solid color-mix(in srgb, ${p} 12%, transparent)`, borderRadius: "12px", padding: "0.875rem", overflow: "hidden" },
                      image: { className: "w-20 h-20 object-cover rounded-lg flex-shrink-0", style: { minWidth: "5rem" } },
                      placeholder: { className: "w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0", style: { background: `color-mix(in srgb, ${p} 8%, transparent)`, minWidth: "5rem" }, iconClassName: "w-7 h-7", iconStyle: { color: `color-mix(in srgb, ${p} 35%, transparent)` } },
                      content: { className: "flex flex-col flex-1 min-w-0", style: { gap: "0.25rem" } },
                      header: { className: "flex items-start justify-between gap-2" },
                      title: { className: "font-semibold text-sm leading-tight", style: { color: text, fontFamily: hFont } },
                      description: { className: "text-xs leading-relaxed line-clamp-2 max-w-xs", style: { color: `color-mix(in srgb, ${text} 60%, transparent)` } },
                      price: { className: "text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0", style: { background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p } },
                      button: { className: "mt-auto self-start flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all hover:brightness-110", style: { background: p, color: bg, border: "none" } },
                    }}
                    editSection="menu"
                    pathBase={"categories." + originalCatIdx + ".items." + originalItemIdx}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    onDelete={isEditorMode && onDeleteItem ? () => onDeleteItem(originalCatIdx, originalItemIdx) : undefined}
                  />
                ))}
              </div>
              {isEditorMode && onAddItem && (
                <div style={{ marginTop: "0.75rem" }}>
                  <InlineAddTile label={isEN ? "Add Item" : "Tambah Item"} onClick={() => onAddItem(cat.originalCatIdx)} />
                </div>
              )}
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
