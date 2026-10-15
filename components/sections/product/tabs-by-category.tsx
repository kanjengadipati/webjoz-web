"use client";
import React, { useState } from "react";
import { Utensils, Image as ImageIcon, X } from "lucide-react";
import { MenuCatalogCard, InlineText, type MenuCatalogCardStyles } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { SectionHeader, pillEyebrowStyle, headerTitleStyle, headerDividerStyle } from "../section-header";
import { productCategories, type ProductVariantProps } from "./types";

/**
 * Tabs by Category — each category becomes a clickable tab.
 * Best for menus/catalogs with 3+ categories where scrolling per-category is too long.
 */
export default function ProductTabsByCategory({
  kind, data, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
  onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id",
}: ProductVariantProps) {
  const isEN = language === "en";
  const isMenu = kind === "menu";
  const [activeIdx, setActiveIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  if (!data) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const surface = "var(--dt-surface)";
  const text = "var(--dt-text)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";
  const cats = productCategories(data);
  const safeActiveIdx = cats.length > 0 ? Math.min(activeIdx, cats.length - 1) : 0;
  const active = cats[safeActiveIdx];
  const query = searchQuery.trim().toLowerCase();

  const activeItems = (active?.items || [])
    .map((item, originalItemIdx) => ({ item, originalItemIdx }))
    .filter(({ item }) => {
      if (!query) return true;
      const nameMatch = (item.name || "").toLowerCase().includes(query);
      const descMatch = (item.description || "").toLowerCase().includes(query);
      if (isMenu) {
        const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(query));
        return nameMatch || descMatch || tagMatch;
      }
      const featureMatch = (item.features || []).some((f) => f.toLowerCase().includes(query));
      const badgeMatch = (item.badge || "").toLowerCase().includes(query);
      return nameMatch || descMatch || featureMatch || badgeMatch;
    });

  const itemKeyPrefix = isMenu ? "menu-tab" : "cat-tab";
  const eyebrowDefault = isMenu ? "Pilihan Menu" : "Koleksi Produk";
  const searchPlaceholder = isMenu ? "Cari menu di kategori ini..." : "Cari produk di kategori ini...";
  const emptySearchLabel = isMenu ? "menu" : "produk";
  const emptyAddLabel = isMenu ? "Tambah Menu" : "Tambah Item";
  const Icon = isMenu ? Utensils : ImageIcon;

  const cardStyles: MenuCatalogCardStyles = {
    className: "group transition-all duration-300",
    style: { background: bg, border: `1px solid color-mix(in srgb, ${p} 14%, transparent)`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    image: { className: `w-full ${isMenu ? "h-52" : "h-48"} object-cover transition-transform duration-500 group-hover:scale-105` },
    placeholder: { className: `w-full ${isMenu ? "h-52" : "h-48"} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`, style: { background: `color-mix(in srgb, ${p} 8%, transparent)` }, iconClassName: "w-12 h-12", iconStyle: { color: `color-mix(in srgb, ${p} 30%, transparent)`, opacity: 0.6 } },
    content: { className: isMenu ? "p-5 space-y-3 flex flex-col flex-1" : "p-5 flex flex-col flex-1" },
    header: { className: "flex items-start justify-between gap-3" },
    title: { className: isMenu ? "font-bold text-sm leading-tight" : "font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem]", style: { color: text, fontFamily: hFont } },
    description: { className: isMenu ? "text-xs leading-relaxed flex-1" : "text-xs leading-relaxed line-clamp-3 min-h-[3.75rem]", style: { color: `color-mix(in srgb, ${text} 60%, transparent)` } },
    price: { className: isMenu ? "text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0" : "self-start text-xs font-bold px-2.5 py-1 rounded-full", style: { background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p } },
    ...(isMenu ? {} : { badge: { className: "inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap", style: { background: p, color: bg } } }),
    button: { className: `w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md ${isMenu ? "mt-auto" : ""}`, style: { background: p, color: isMenu ? "var(--dt-cta-text, #fff)" : bg, border: "none" } },
  };

  return (
    <section id={kind} style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
        <SectionHeader
          section={kind}
          eyebrow={data.eyebrow ?? eyebrowDefault}
          title={data.title}
          wrapperStyle={{ textAlign: "center", marginBottom: "2rem" }}
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
            placeholder={searchPlaceholder}
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
              <span key={i} className="relative inline-flex items-center">
                <button
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
                  <InlineText section={kind} fieldKey={"categories." + i + ".name"} value={cat.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontSize: "0.78rem", fontWeight: isActive ? 700 : 500, color: isActive ? "var(--dt-cta-text, #fff)" : `color-mix(in srgb, ${text} 70%, transparent)`, whiteSpace: "nowrap" as const }} />
                </button>
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton
                    compact
                    className="absolute -top-1.5 -right-1.5 z-40"
                    onDelete={() => onDeleteCategory(i)}
                    title={isEN ? "Delete Category" : "Hapus Kategori"}
                  />
                )}
                </span>
            );
          })}
        </div>

        {isEditorMode && onAddCategory && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
            <CategoryAddButton onAdd={onAddCategory} isEN={isEN} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
          </div>
        )}

        {/* Active category items */}
        {active && (
          activeItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", opacity: 0.85 }}>
              <p style={{ fontWeight: 600, fontSize: "1rem", color: text }}>
                {searchQuery ? `Tidak ada ${emptySearchLabel} yang cocok dengan pencarian "${searchQuery}".` : "Belum ada item di kategori ini."}
              </p>
              {isEditorMode && onAddItem && (
                <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
                  <InlineAddTile
                    label={emptyAddLabel}
                    variant="card"
                    className="rounded-2xl max-w-xs"
                    onClick={() => onAddItem(safeActiveIdx)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMenu ? 260 : 220}px, 1fr))`, gap: "1.25rem", ...(isMenu ? {} : { alignItems: "stretch" }) }}>
              {activeItems.map(({ item, originalItemIdx }) => (
                <MenuCatalogCard
                  key={item.id || `${itemKeyPrefix}-${safeActiveIdx}-${originalItemIdx}`}
                  item={{
                    id: item.id || `${itemKeyPrefix}-${safeActiveIdx}-${originalItemIdx}`,
                    name: item.name,
                    price: item.price,
                    priceAmount: item.price_amount,
                    priceDisplay: item.price_display,
                    promoPriceAmount: item.promo_price_amount,
                    promoPriceDisplay: item.promo_price_display,
                    discountLabel: item.discount_label,
                    description: item.description,
                    category: active.name,
                    image_url: item.image_url,
                    image_urls: item.image_urls,
                    is_available: item.is_available,
                    variant_groups: item.variant_groups,
                    ...(isMenu
                      ? { tags: item.tags, delivery_platforms: item.delivery_platforms }
                      : { badge: item.badge, features: item.features, capacity: item.capacity }),
                  }}
                  icon={Icon}
                  styles={cardStyles}
                  editSection={kind}
                  pathBase={"categories." + safeActiveIdx + ".items." + originalItemIdx}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  onDelete={isEditorMode && onDeleteItem ? () => onDeleteItem(safeActiveIdx, originalItemIdx) : undefined}
                />
              ))}
              {isEditorMode && onAddItem && (
                <InlineAddTile
                  label="Tambah Item"
                  variant="card"
                  className="rounded-2xl"
                  onClick={() => onAddItem(safeActiveIdx)}
                />
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}
