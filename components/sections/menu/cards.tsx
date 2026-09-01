"use client";
import React, { useState } from "react";
import { Utensils } from "lucide-react";
import { MenuCatalogCard, InlineText, CatalogMenuFilterBar } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface MenuVariantProps {
  menu: TemplateProps["content"]["menu"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export default function MenuCards({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: MenuVariantProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!menu) return null;
  const brandBg = "var(--dt-bg)";
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";

  const categories = menu.categories || [];
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
          const tagMatch = (item.tags || []).some((t: string) => t.toLowerCase().includes(query));
          return nameMatch || descMatch || tagMatch;
        });
      return { ...cat, originalCatIdx, filteredItems: items };
    })
    .filter((cat) => cat.filteredItems.length > 0);

  return (
    <section id="menu" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: brandPrimary, background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>
            {menu.eyebrow || "Pilihan Menu"}
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
          placeholder="Cari menu, rasa, atau tags..."
        />

        {filteredCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", opacity: 0.75 }}>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: brandText }}>
              Tidak ada menu yang cocok dengan pencarian "{searchQuery}".
            </p>
          </div>
        ) : (
          filteredCategories.map((cat, renderedIdx) => (
            <div key={renderedIdx} style={{ marginBottom: "4rem" }}>
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
                style={{ fontFamily: headingFont, fontWeight: 700, color: brandPrimary, fontSize: "1.1rem", marginBottom: "1.5rem", textAlign: "center" }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2rem" }}>
                {cat.filteredItems.map(({ item, originalCatIdx, originalItemIdx }) => (
                  <div key={item.id || `${cat.name}__${item.name}__${originalCatIdx}_${originalItemIdx}`} className="flex flex-col">
                    <MenuCatalogCard
                      itemId={item.id || `${cat.name}__${item.name}__${originalCatIdx}_${originalItemIdx}`}
                      itemName={item.name}
                      itemPrice={item.price}
                      itemPriceAmount={item.price_amount}
                      itemPriceDisplay={item.price_display}
                      itemDescription={item.description}
                      category={cat.name}
                      image_url={item.image_url}
                      image_urls={item.image_urls}
                      is_available={item.is_available}
                      variant_groups={item.variant_groups}
                      tags={item.tags}
                      delivery_platforms={item.delivery_platforms}
                      icon={Utensils}
                      className="group transition-all duration-300 flex-1"
                      style={{ background: brandBg, border: `1px solid color-mix(in srgb, ${brandPrimary} 14%, transparent)`, borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                      imageClassName="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholderClassName="w-full h-64 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                      placeholderStyle={{ background: `color-mix(in srgb, ${brandPrimary} 8%, transparent)` }}
                      placeholderIconClassName="w-16 h-16"
                      placeholderIconStyle={{ color: `color-mix(in srgb, ${brandPrimary} 30%, transparent)`, opacity: 0.6 }}
                      contentClassName="p-6 space-y-3 flex flex-col flex-1"
                      headerClassName="flex items-start justify-between gap-3"
                      titleClassName="font-bold text-base leading-tight"
                      titleStyle={{ color: brandText, fontFamily: headingFont }}
                      descriptionClassName="text-sm leading-relaxed"
                      descriptionStyle={{ color: `color-mix(in srgb, ${brandText} 60%, transparent)` }}
                      priceClassName="text-sm font-bold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                      priceStyle={{ background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`, color: brandPrimary }}
                      buttonClassName="w-full flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md"
                      buttonStyle={{ background: brandPrimary, color: "var(--dt-cta-text, #fff)", border: "none" }}
                      editSection="menu"
                      pathBase={"categories." + originalCatIdx + ".items." + originalItemIdx}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
