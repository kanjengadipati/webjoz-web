"use client";
import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, InlineText, CatalogMenuFilterBar } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CatalogVariantProps {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

/**
 * Grid Dense — tighter grid, smaller cards, fits more items per row.
 * Best for catalogs with 20+ items. Cards use minmax(180px, 1fr).
 */
export default function CatalogGridDense({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: CatalogVariantProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!catalog) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const text = "var(--dt-text)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";

  const categories = catalog.categories || [];
  const query = searchQuery.trim().toLowerCase();

  const filteredCategories = categories
    .filter((cat) => activeCategory === "all" || cat.name === activeCategory)
    .map((cat, originalCatIdx) => {
      const items = (cat.items || [])
        .map((item, originalItemIdx) => ({ item, originalCatIdx, originalItemIdx }))
        .filter(({ item }) => {
          if (!query) return true;
          const nameMatch = (item.name || "").toLowerCase().includes(query);
          const descMatch = (item.description || "").toLowerCase().includes(query);
          const featureMatch = (item.features || []).some((f: string) => f.toLowerCase().includes(query));
          const badgeMatch = (item.badge || "").toLowerCase().includes(query);
          return nameMatch || descMatch || featureMatch || badgeMatch;
        });
      return { ...cat, originalCatIdx, filteredItems: items };
    })
    .filter((cat) => cat.filteredItems.length > 0);

  return (
    <section id="catalog" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <InlineText
            section="catalog"
            fieldKey="eyebrow"
            value={catalog.eyebrow ?? "Koleksi Produk"}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
            style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: p, background: `color-mix(in srgb, ${p} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}
          />
          <InlineText
            section="catalog"
            fieldKey="title"
            value={catalog.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="h2"
            style={{ fontFamily: hFont, fontWeight: hWeight as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: text, marginTop: "0.85rem", lineHeight: 1.15 }}
          />
          <div style={{ width: "3rem", height: "3px", background: p, borderRadius: "4px", margin: "0.75rem auto 0" }} />
        </div>

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
                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.875rem", alignItems: "stretch" }}>
                {cat.filteredItems.map(({ item, originalCatIdx, originalItemIdx }) => (
                  <MenuCatalogCard
                    key={item.id || `cat-dense-${originalCatIdx}-${originalItemIdx}`}
                    itemId={item.id || `cat-dense-${originalCatIdx}-${originalItemIdx}`}
                    itemName={item.name}
                    itemPrice={item.price}
                    itemPriceAmount={item.price_amount}
                    itemPriceDisplay={item.price_display}
                    itemDescription={item.description}
                    category={cat.name}
                    image_url={item.image_url}
                    image_urls={item.image_urls}
                    badge={item.badge}
                    is_available={item.is_available}
                    variant_groups={item.variant_groups}
                    features={item.features}
                    capacity={item.capacity}
                    icon={ImageIcon}
                    className="group transition-all duration-300"
                    style={{ background: bg, border: `1px solid color-mix(in srgb, ${p} 12%, transparent)`, borderRadius: "12px", overflow: "hidden" }}
                    imageClassName="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                    placeholderClassName="w-full h-36 flex items-center justify-center"
                    placeholderStyle={{ background: `color-mix(in srgb, ${p} 8%, transparent)` }}
                    placeholderIconClassName="w-9 h-9"
                    placeholderIconStyle={{ color: `color-mix(in srgb, ${p} 30%, transparent)`, opacity: 0.6 }}
                    contentClassName="p-3.5 flex flex-col flex-1"
                    headerClassName="flex items-start justify-between gap-2 mb-1.5"
                    titleClassName="font-semibold text-[13px] leading-tight line-clamp-2"
                    titleStyle={{ color: text, fontFamily: hFont }}
                    descriptionClassName="text-[11px] leading-relaxed line-clamp-2"
                    descriptionStyle={{ color: `color-mix(in srgb, ${text} 60%, transparent)` }}
                    priceClassName="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                    priceStyle={{ background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p }}
                    badgeClassName="inline-block text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    badgeStyle={{ background: p, color: bg }}
                    buttonClassName="w-full flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all duration-200 hover:brightness-110"
                    buttonStyle={{ background: p, color: bg, border: "none" }}
                    editSection="catalog"
                    pathBase={"categories." + originalCatIdx + ".items." + originalItemIdx}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
