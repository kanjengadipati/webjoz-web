"use client";
import React, { useState } from "react";
import { Utensils } from "lucide-react";
import { MenuCatalogCard, InlineText, CatalogMenuFilterBar } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { useCatalogFilter } from "../use-catalog-filter";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface MenuVariantProps {
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
}

export default function MenuClassic({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id"}: MenuVariantProps) {
  const isEN = language === "en";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = menu?.categories || [];
  const filteredCategories = useCatalogFilter(categories, activeCategory, searchQuery, isEditorMode);

  if (!menu) return null;
  const brandBg = "var(--dt-bg)";
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;

  return (
    <section id="menu" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: brandPrimary, background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>
          <InlineText
            section="menu"
            fieldKey="eyebrow"
            value={menu.eyebrow ?? "Pilihan Menu"}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
          />
          </span>
          <InlineText
            section="menu"
            fieldKey="title"
            value={menu.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="h2"
            style={{ fontFamily: headingFont, fontWeight: headingWeight as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: brandText, marginTop: "0.85rem", lineHeight: 1.15 }}
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
          placeholder="Cari menu..."
        />

        {filteredCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", opacity: 0.75 }}>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: brandText }}>
              Tidak ada menu yang cocok dengan pencarian "{searchQuery}".
            </p>
          </div>
        ) : (
          filteredCategories.map((cat, renderedIdx) => (
            <div key={renderedIdx} style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${brandPrimary} 18%, transparent)` }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: brandPrimary, flexShrink: 0 }} />
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
                  style={{ fontFamily: headingFont, fontWeight: 700, color: brandPrimary, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}
                />
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton
                    compact
                    onDelete={() => onDeleteCategory(cat.originalCatIdx)}
                    title={isEN ? "Delete Category" : "Hapus Kategori"}
                  />
                )}


                <span style={{ width: 6, height: 6, borderRadius: "50%", background: brandPrimary, flexShrink: 0 }} />
                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${brandPrimary} 18%, transparent)` }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                {cat.filteredItems.map(({ item, originalCatIdx, originalItemIdx }) => (
                  <MenuCatalogCard
                    key={item.id || `${cat.name}__${item.name}__${originalCatIdx}_${originalItemIdx}`}
                    item={{
                      id: item.id || `${cat.name}__${item.name}__${originalCatIdx}_${originalItemIdx}`,
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
                      className: "group transition-all duration-300",
                      style: { background: brandBg, border: `1px solid color-mix(in srgb, ${brandPrimary} 14%, transparent)`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
                      image: { className: "w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105" },
                      placeholder: { className: "w-full h-52 flex items-center justify-center transition-transform duration-500 group-hover:scale-105", style: { background: `color-mix(in srgb, ${brandPrimary} 8%, transparent)` }, iconClassName: "w-12 h-12", iconStyle: { color: `color-mix(in srgb, ${brandPrimary} 30%, transparent)`, opacity: 0.6 } },
                      content: { className: "p-5 space-y-3 flex flex-col flex-1" },
                      header: { className: "flex items-start justify-between gap-3" },
                      title: { className: "font-bold text-sm leading-tight", style: { color: brandText, fontFamily: headingFont } },
                      description: { className: "text-xs leading-relaxed flex-1", style: { color: `color-mix(in srgb, ${brandText} 60%, transparent)` } },
                      price: { className: "text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0", style: { background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`, color: brandPrimary } },
                      button: { className: "mt-auto w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md", style: { background: brandPrimary, color: "var(--dt-cta-text, #fff)", border: "none" } },
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
                {isEditorMode && onAddItem && (
                  <InlineAddTile
                    label="Tambah Item"
                    variant="card"
                    className="rounded-2xl"
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
