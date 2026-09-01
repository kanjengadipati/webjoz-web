"use client";
import React, { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { MenuCatalogCard, InlineText } from "../../templates/shared";
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
 * Tabs by Category — category tabs, shows one category at a time.
 * Best for catalogs with 3+ distinct categories.
 */
export default function CatalogTabsByCategory({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: CatalogVariantProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  if (!catalog) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const surface = "var(--dt-surface)";
  const text = "var(--dt-text)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";
  const cats = catalog.categories ?? [];
  const active = cats[activeIdx];
  const query = searchQuery.trim().toLowerCase();

  const activeItems = (active?.items || [])
    .map((item, originalItemIdx) => ({ item, originalItemIdx }))
    .filter(({ item }) => {
      if (!query) return true;
      const nameMatch = (item.name || "").toLowerCase().includes(query);
      const descMatch = (item.description || "").toLowerCase().includes(query);
      const featureMatch = (item.features || []).some((f: string) => f.toLowerCase().includes(query));
      const badgeMatch = (item.badge || "").toLowerCase().includes(query);
      return nameMatch || descMatch || featureMatch || badgeMatch;
    });

  return (
    <section id="catalog" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
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

        {/* Search bar */}
        <div className="w-full max-w-md mx-auto mb-6 relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none opacity-60" style={{ color: text }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk di kategori ini..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm outline-none transition-all shadow-2xs"
            style={{
              background: `color-mix(in srgb, ${bg} 92%, ${text} 8%)`,
              color: text,
              border: `1px solid color-mix(in srgb, ${text} 15%, transparent)`,
              borderRadius: "9999px",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 p-1 rounded-full opacity-60 hover:opacity-100 cursor-pointer"
              aria-label="Hapus pencarian"
              style={{ color: text }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tab bar — smooth horizontal scroll on mobile, centered on desktop */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar justify-start sm:justify-center"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {cats.map((cat, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "9999px",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? p : `color-mix(in srgb, ${p} 8%, ${surface})`,
                  color: isActive ? "var(--dt-cta-text, #fff)" : `color-mix(in srgb, ${text} 70%, transparent)`,
                  border: isActive ? `1.5px solid ${p}` : `1.5px solid color-mix(in srgb, ${p} 20%, transparent)`,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                }}
              >
                <InlineText section="catalog" fieldKey={"categories." + i + ".name"} value={cat.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontSize: "0.78rem", fontWeight: isActive ? 700 : 500, color: isActive ? "var(--dt-cta-text, #fff)" : `color-mix(in srgb, ${text} 70%, transparent)`, whiteSpace: "nowrap" as const }} />
              </button>
            );
          })}
        </div>

        {active && (
          activeItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", opacity: 0.75 }}>
              <p style={{ fontWeight: 600, fontSize: "1rem", color: text }}>
                Tidak ada produk yang cocok dengan pencarian "{searchQuery}".
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem", alignItems: "stretch" }}>
              {activeItems.map(({ item, originalItemIdx }) => (
                <MenuCatalogCard
                  key={item.id || `cat-tab-${activeIdx}-${originalItemIdx}`}
                  itemId={item.id || `cat-tab-${activeIdx}-${originalItemIdx}`}
                  itemName={item.name}
                  itemPrice={item.price}
                  itemPriceAmount={item.price_amount}
                  itemPriceDisplay={item.price_display}
                  itemDescription={item.description}
                  category={active.name}
                  image_url={item.image_url}
                  image_urls={item.image_urls}
                  badge={item.badge}
                  is_available={item.is_available}
                  variant_groups={item.variant_groups}
                  features={item.features}
                  capacity={item.capacity}
                  icon={ImageIcon}
                  className="group transition-all duration-300"
                  style={{ background: bg, border: `1px solid color-mix(in srgb, ${p} 14%, transparent)`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                  imageClassName="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  placeholderClassName="w-full h-48 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                  placeholderStyle={{ background: `color-mix(in srgb, ${p} 8%, transparent)` }}
                  placeholderIconClassName="w-12 h-12"
                  placeholderIconStyle={{ color: `color-mix(in srgb, ${p} 30%, transparent)`, opacity: 0.6 }}
                  contentClassName="p-5 flex flex-col flex-1"
                  headerClassName="flex items-start justify-between gap-3 mb-2"
                  titleClassName="font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem]"
                  titleStyle={{ color: text, fontFamily: hFont }}
                  descriptionClassName="text-xs leading-relaxed line-clamp-3 min-h-[3.75rem]"
                  descriptionStyle={{ color: `color-mix(in srgb, ${text} 60%, transparent)` }}
                  priceClassName="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
                  priceStyle={{ background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p }}
                  badgeClassName="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                  badgeStyle={{ background: p, color: bg }}
                  buttonClassName="w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md"
                  buttonStyle={{ background: p, color: bg, border: "none" }}
                  editSection="catalog"
                  pathBase={"categories." + activeIdx + ".items." + originalItemIdx}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}
