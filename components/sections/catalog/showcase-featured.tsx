"use client";
import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, InlineText, InlineImage, isPlaceholderPrice } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { SectionHeader, pillEyebrowStyle, headerTitleStyle, headerDividerStyle } from "../section-header";
import { AddToCartButton } from "@/components/cart";
import PhotoCredit from "../PhotoCredit";
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
 * Showcase Featured — items with a non-empty `badge` field are featured.
 * Featured items rendered large above the fold (up to 2 per category).
 * Remaining items shown in standard grid below.
 * Reuses badge field: any item with badge != null/empty is "featured".
 */
export default function CatalogShowcaseFeatured({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id"}: CatalogVariantProps) {
  const isEN = language === "en";
  if (!catalog) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const surface = "var(--dt-surface)";
  const text = "var(--dt-text)";
  const muted = "color-mix(in srgb, var(--dt-text) 55%, transparent)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";

  return (
    <section id="catalog" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
        <SectionHeader
          section="catalog"
          eyebrow={catalog.eyebrow ?? "Koleksi Produk"}
          title={catalog.title}
          wrapperStyle={{ textAlign: "center", marginBottom: "3rem" }}
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

        {catalog.categories?.map((cat, ci) => {
          // Track original indices while filtering, so we can write to the right path
          const featuredWithIdx = (cat.items ?? [])
            .map((it, idx) => ({ item: it, originalIdx: idx }))
            .filter(({ item }) => item.badge);
          const rest = cat.items?.filter((it) => !it.badge) ?? [];
          return (
            <div key={ci} style={{ marginBottom: "4rem" }}>
              {/* Category label */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.75rem" }}>
                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
                <InlineText section="catalog" fieldKey={"categories." + ci + ".name"} value={cat.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="h3" style={{ fontFamily: hFont, fontWeight: 700, color: p, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }} />
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton
                    compact
                    onDelete={() => onDeleteCategory(ci)}
                    title={isEN ? "Delete Category" : "Hapus Kategori"}
                  />
                )}


                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
              </div>

              {/* Featured items — large cards (up to 2) */}
              {featuredWithIdx.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: featuredWithIdx.length === 1 ? "1fr" : "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
                  {featuredWithIdx.slice(0, 2).map(({ item, originalIdx: itemIdx }) => {
                    const showPrice = item.price && !isPlaceholderPrice(item.price);
                    return (
                      <div
                        key={itemIdx}
                        style={{ position: "relative", background: surface, border: `1.5px solid color-mix(in srgb, ${p} 20%, transparent)`, borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: `0 4px 20px color-mix(in srgb, ${p} 10%, transparent)` }}
                      >
                        {/* Featured image — taller */}
                        <div style={{ position: "relative", height: "15rem" }}>
                          <InlineImage
                            section="catalog"
                            fieldKey={"categories." + ci + ".items." + itemIdx + ".image_url"}
                            src={item.image_url}
                            alt={item.name}
                            onUpdateField={onUpdateField}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                            className="w-full h-full object-cover"
                            style={{ position: "absolute", inset: 0 }}
                          />
                          {item.image_credit && (
                            <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 5 }}>
                              <PhotoCredit credit={item.image_credit} />
                            </div>
                          )}
                          {/* Badge pill overlay */}
                          <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: p, color: bg, padding: "0.25rem 0.625rem", borderRadius: "9999px", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            <InlineText section="catalog" fieldKey={"categories." + ci + ".items." + itemIdx + ".badge"} value={item.badge ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
                          </span>
                        </div>
                        {/* Content */}
                        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                            <InlineText section="catalog" fieldKey={"categories." + ci + ".items." + itemIdx + ".name"} value={item.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="h4" style={{ fontFamily: hFont, fontWeight: 700, fontSize: "1rem", color: text, margin: 0 }} />
                            {showPrice && (
                              <InlineText section="catalog" fieldKey={"categories." + ci + ".items." + itemIdx + ".price"} value={item.price ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontFamily: hFont, fontWeight: 800, fontSize: "0.9rem", color: p, flexShrink: 0 }} />
                            )}
                          </div>
                          {item.description && (
                            <InlineText section="catalog" fieldKey={"categories." + ci + ".items." + itemIdx + ".description"} value={item.description ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="p" multiline style={{ margin: 0, fontSize: "0.8rem", color: muted, lineHeight: 1.55 }} />
                          )}
                          {item.capacity != null && item.capacity > 0 && (
                            <div style={{ marginTop: "0.25rem" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "9999px", background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "0.75rem", height: "0.75rem" }}><circle cx="9" cy="7" r="2"/><path d="M3 21v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="7" r="2"/><path d="M21 21v-1a5 5 0 0 0-3-4.6"/></svg>
                                s/d <InlineText section="catalog" fieldKey={"categories." + ci + ".items." + itemIdx + ".capacity"} value={item.capacity != null ? String(item.capacity) : ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" /> tamu
                              </span>
                            </div>
                          )}
                          {item.features && item.features.length > 0 && (
                            <ul style={{ margin: "0.25rem 0 0 0", padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                              {item.features.map((f: string, feaIdx: number) => (
                                <li key={feaIdx} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", fontWeight: 500, padding: "0.15rem 0.45rem", borderRadius: "9999px", background: `color-mix(in srgb, ${p} 10%, transparent)`, color: p }}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "0.65rem", height: "0.65rem" }}><polyline points="20 6 9 17 4 12"/></svg>
                                  {f}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
                            <AddToCartButton
                              itemId={item.id || `cat-sf-feat-${ci}-${itemIdx}`}
                              itemName={item.name}
                              itemPrice={item.price_display || item.price || null}
                              itemPriceAmount={item.price_amount}
                              itemPriceDisplay={item.price_display || item.price}
                              itemPromoPriceAmount={item.promo_price_amount}
                              itemPromoPriceDisplay={item.promo_price_display}
                              discountLabel={item.discount_label}
                              category={cat.name}
                              variant_groups={item.variant_groups}
                              disabled={item.is_available === false}
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all hover:brightness-110"
                              style={{ background: p, color: bg, border: "none" }}
                            />
                          </div>
                          {isEditorMode && onDeleteItem && (
                            <InlineDeleteButton onDelete={() => onDeleteItem(ci, itemIdx)} className="absolute top-2.5 right-2.5 z-40" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Remaining items — standard grid */}
              {(() => {
                const restWithIdx = (cat.items ?? [])
                  .map((it, idx) => ({ item: it, originalIdx: idx }))
                  .filter(({ item }) => !item.badge);
                return restWithIdx.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
                    {restWithIdx.map(({ item, originalIdx: itemIdx }) => (
                      <MenuCatalogCard
                        key={item.id || itemIdx}
                        item={{
                          id: item.id || `cat-sf-rest-${ci}-${itemIdx}`,
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
                          style: { background: bg, border: `1px solid color-mix(in srgb, ${p} 14%, transparent)`, borderRadius: "14px", overflow: "hidden" },
                          image: { className: "w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105" },
                          placeholder: { className: "w-full h-40 flex items-center justify-center", style: { background: `color-mix(in srgb, ${p} 8%, transparent)` }, iconClassName: "w-10 h-10", iconStyle: { color: `color-mix(in srgb, ${p} 30%, transparent)`, opacity: 0.6 } },
                          content: { className: "p-4 flex flex-col flex-1 min-w-0" },
                          header: { className: "flex flex-col gap-1.5 mb-2 min-w-0" },
                          title: { className: "font-semibold text-sm leading-tight line-clamp-2", style: { color: text, fontFamily: hFont } },
                          description: { className: "text-xs leading-relaxed line-clamp-3", style: { color: muted } },
                          price: { className: "self-start text-xs font-bold px-2 py-0.5 rounded-full", style: { background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p } },
                          button: { className: "w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all hover:brightness-110", style: { background: p, color: bg, border: "none" } },
                        }}
                        editSection="catalog"
                        pathBase={"categories." + ci + ".items." + itemIdx}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                        onDelete={isEditorMode && onDeleteItem ? () => onDeleteItem(ci, itemIdx) : undefined}
                      />
                    ))}
                  </div>
                );
              })()}

              {isEditorMode && onAddItem && (
                <div style={{ marginTop: "1rem" }}>
                  <InlineAddTile label="Tambah Item" onClick={() => onAddItem(ci)} />
                </div>
              )}

              {/* Edge case: all items have badge — show them in featured grid only, no rest grid needed */}
            </div>
          );
        })}
      {isEditorMode && onAddCategory && (
        <CategoryAddButton onAdd={onAddCategory} isEN={isEN} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
      )}
      </div>
    </section>
  );
}
