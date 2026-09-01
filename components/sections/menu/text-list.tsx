"use client";
import React, { useState } from "react";
import { InlineText, isPlaceholderPrice, AddToCartButton, CatalogMenuFilterBar } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

/**
 * Text List — traditional restaurant menu style.
 * Dotted leader between item name and price.
 * Great for fine dining, cafes, and text-only menus.
 */
export default function MenuTextList({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: { menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null; onUpdateField?: (section: string, key: string, value: any) => void; isEditorMode?: boolean; isSelected?: boolean; collapseSheetForInlineEdit?: () => void; onEditingStateChange?: (isEditing: boolean) => void }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!menu) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const text = "var(--dt-text)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";
  const muted = `color-mix(in srgb, ${text} 65%, transparent)`;

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
    <section id="menu" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <InlineText
            section="menu"
            fieldKey="eyebrow"
            value={menu.eyebrow ?? "Daftar Menu"}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
            style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: p, background: `color-mix(in srgb, ${p} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}
          />
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
          placeholder="Cari menu..."
        />

        {filteredCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", opacity: 0.75 }}>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: text }}>
              Tidak ada menu yang cocok dengan pencarian "{searchQuery}".
            </p>
          </div>
        ) : (
          filteredCategories.map((cat, renderedIdx) => (
            <div key={renderedIdx} style={{ marginBottom: "3rem" }}>
              {/* Category divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
                <span style={{ flex: 1, height: "1px", background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
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
                <span style={{ flex: 1, height: "1px", background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
              </div>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {cat.filteredItems.map(({ item, originalCatIdx, originalItemIdx }) => {
                  const showPrice = item.price && !isPlaceholderPrice(item.price);
                  return (
                    <div key={item.id || `menu-tl-${originalCatIdx}-${originalItemIdx}`} style={{
                      padding: "0.875rem 0",
                      borderBottom: `1px solid color-mix(in srgb, ${p} 8%, transparent)`,
                    }}>
                      {/* Name + dotted leader + price row */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                        <InlineText section="menu" fieldKey={"categories." + originalCatIdx + ".items." + originalItemIdx + ".name"} value={item.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontFamily: hFont, fontWeight: 600, fontSize: "0.9rem", color: text, flexShrink: 0 }} />
                        {/* Dotted leader */}
                        <span style={{
                          flex: 1,
                          borderBottom: `1px dotted color-mix(in srgb, ${text} 25%, transparent)`,
                          marginBottom: "0.2em",
                          minWidth: "1rem",
                        }} />
                        {item.is_available === false && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500 text-white">
                            Habis
                          </span>
                        )}
                        {showPrice && (
                          <InlineText section="menu" fieldKey={"categories." + originalCatIdx + ".items." + originalItemIdx + ".price"} value={item.price_display || item.price || ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontFamily: hFont, fontWeight: 700, fontSize: "0.875rem", color: p, flexShrink: 0 }} />
                        )}
                      </div>
                      {/* Description */}
                      {item.description && (
                        <InlineText section="menu" fieldKey={"categories." + originalCatIdx + ".items." + originalItemIdx + ".description"} value={item.description ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="p" multiline style={{ margin: "0.3rem 0 0.6rem", fontSize: "0.78rem", color: muted, lineHeight: 1.55 }} />
                      )}
                      {/* Tags & Platforms */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {item.tags.map((tag: string, ti: number) => (
                            <span key={ti} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.delivery_platforms && item.delivery_platforms.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {item.delivery_platforms.map((dp: { name: string; url: string }, di: number) => (
                            <a
                              key={di}
                              href={dp.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all hover:brightness-110"
                              style={{ borderColor: `color-mix(in srgb, ${p} 25%, transparent)`, background: `color-mix(in srgb, ${p} 8%, transparent)`, color: p }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span>{dp.name || "Order Online"}</span>
                            </a>
                          ))}
                        </div>
                      )}
                      {/* Add to cart */}
                      <div style={{ marginTop: "0.4rem" }}>
                        <AddToCartButton
                          itemId={item.id || `menu-tl-${originalCatIdx}-${originalItemIdx}`}
                          itemName={item.name}
                          itemPrice={item.price_display || item.price || null}
                          itemPriceAmount={item.price_amount}
                          itemPriceDisplay={item.price_display || item.price}
                          category={cat.name}
                          variant_groups={item.variant_groups}
                          disabled={item.is_available === false}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                          style={{ background: `color-mix(in srgb, ${p} 10%, transparent)`, color: p, border: `1px solid color-mix(in srgb, ${p} 25%, transparent)` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
