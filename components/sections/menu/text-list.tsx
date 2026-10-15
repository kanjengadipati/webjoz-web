"use client";
import React, { useState } from "react";
import { InlineText, isPlaceholderPrice, AddToCartButton, CatalogMenuFilterBar, ProductQuickView, toQuickViewItem } from "../../templates/shared";
import { minVariantPriceAmount } from "../../templates/helpers";
import { formatPriceWithAmount } from "@/lib/utils";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { useCatalogFilter } from "../use-catalog-filter";
import { SectionHeader, pillEyebrowStyle, headerTitleStyle, headerDividerStyle } from "../section-header";
import type { TemplateProps, DesignToken } from "../../templates/types";

/**
 * Text List — traditional restaurant menu style.
 * Dotted leader between item name and price.
 * Great for fine dining, cafes, and text-only menus.
 */
export default function MenuTextList({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id" }: { menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null; onUpdateField?: (section: string, key: string, value: any) => void; isEditorMode?: boolean; isSelected?: boolean; collapseSheetForInlineEdit?: () => void; onEditingStateChange?: (isEditing: boolean) => void; onAddItem?: (catIdx: number) => void; onDeleteItem?: (catIdx: number, itemIdx: number) => void; onAddCategory?: () => void; onDeleteCategory?: (catIdx: number) => void; language?: "id" | "en"; }) {
  const isEN = language === "en";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);

  const categories = menu?.categories || [];
  const filteredCategories = useCatalogFilter(categories, activeCategory, searchQuery, isEditorMode);

  if (!menu) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const text = "var(--dt-text)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";
  const muted = `color-mix(in srgb, ${text} 65%, transparent)`;

  const qvCategory = quickView && categories[quickView.catIdx] ? categories[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  return (
    <section id="menu" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
        {/* Header */}
        <SectionHeader
          section="menu"
          eyebrow={menu.eyebrow ?? "Daftar Menu"}
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
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton
                    compact
                    onDelete={() => onDeleteCategory(cat.originalCatIdx)}
                    title={isEN ? "Delete Category" : "Hapus Kategori"}
                  />
                )}


                <span style={{ flex: 1, height: "1px", background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
              </div>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {cat.filteredItems.map(({ item, originalCatIdx, originalItemIdx }) => {
                  const displayPrice = item.price_display || item.price;
                  const showPrice = (displayPrice && !isPlaceholderPrice(displayPrice)) || Boolean(isEditorMode);
                  const hasPromo = typeof item.promo_price_amount === "number" && item.promo_price_amount > 0 &&
                    (typeof item.price_amount !== "number" || item.price_amount <= 0 || item.promo_price_amount < item.price_amount);
                  const effectiveBaseAmount = hasPromo ? item.promo_price_amount : item.price_amount;
                  const minVariantAmount = minVariantPriceAmount(effectiveBaseAmount, item.variant_groups);
                  const fromLabel = isEN ? "From" : "Mulai dari";
                  let fromPriceDisplay: string | null = null;
                  if (minVariantAmount != null) {
                    const baseTemplate = (hasPromo && item.promo_price_display) ? item.promo_price_display : displayPrice;
                    const alreadyHasFrom = (baseTemplate || "").toLowerCase().includes(fromLabel.toLowerCase());
                    const template = alreadyHasFrom ? baseTemplate : `${fromLabel} ${baseTemplate ?? ""}`;
                    fromPriceDisplay = formatPriceWithAmount(minVariantAmount, template);
                  }
                  const priceValue = isEditorMode ? (displayPrice ?? "") : (fromPriceDisplay ?? displayPrice ?? "");
                  const promoBaseDisplay = item.promo_price_display
                    || (hasPromo && typeof item.promo_price_amount === "number" ? formatPriceWithAmount(item.promo_price_amount, displayPrice) : displayPrice)
                    || "";
                  const promoPriceValue = isEditorMode ? promoBaseDisplay : (fromPriceDisplay ?? promoBaseDisplay);
                  return (
                    <div key={item.id || `menu-tl-${originalCatIdx}-${originalItemIdx}`} className="relative group cursor-pointer" onClick={() => setQuickView({ catIdx: originalCatIdx, itemIdx: originalItemIdx })} style={{
                      padding: "0.875rem 0",
                      paddingRight: isEditorMode && onDeleteItem ? "2rem" : 0,
                      borderBottom: `1px solid color-mix(in srgb, ${p} 8%, transparent)`,
                    }}>
                      {isEditorMode && onDeleteItem && (
                        <InlineDeleteButton
                          compact
                          onDelete={() => onDeleteItem(originalCatIdx, originalItemIdx)}
                          className="absolute top-2.5 right-0"
                        />
                      )}
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
                          hasPromo ? (
                            <span style={{ display: "inline-flex", alignItems: "baseline", gap: "0.35rem", flexShrink: 0 }}>
                              <InlineText section="menu" fieldKey={"categories." + originalCatIdx + ".items." + originalItemIdx + ".discount_label"} value={item.discount_label || "Promo"} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `color-mix(in srgb, ${p} 16%, transparent)`, color: p }} />
                              <InlineText section="menu" fieldKey={"categories." + originalCatIdx + ".items." + originalItemIdx + ".promo_price_display"} value={promoPriceValue} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontFamily: hFont, fontWeight: 700, fontSize: "0.875rem", color: p }} />
                              <span className="line-through opacity-45" style={{ fontSize: "0.75rem", color: muted }}>{displayPrice}</span>
                            </span>
                          ) : (
                            <InlineText section="menu" fieldKey={"categories." + originalCatIdx + ".items." + originalItemIdx + ".price"} value={priceValue} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontFamily: hFont, fontWeight: 700, fontSize: "0.875rem", color: p, flexShrink: 0 }} />
                          )
                        )}
                      </div>
                      {/* Description */}
                      {item.description && (
                        <InlineText section="menu" fieldKey={"categories." + originalCatIdx + ".items." + originalItemIdx + ".description"} value={item.description ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="p" multiline style={{ margin: "0.3rem 0 0.6rem", fontSize: "0.78rem", color: muted, lineHeight: 1.55 }} />
                      )}
                      {/* Tags & Platforms */}
                      {(item.tags?.length || isEditorMode) && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {(item.tags ?? []).map((tag: string, ti: number) => (
                            <InlineText
                              key={ti}
                              section="menu"
                              fieldKey={"categories." + originalCatIdx + ".items." + originalItemIdx + ".tags." + ti}
                              value={tag ?? ""}
                              onUpdateField={onUpdateField}
                              isEditorMode={isEditorMode}
                              isSelected={isSelected}
                              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                              onEditingStateChange={onEditingStateChange}
                              as="span"
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                              style={{ background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p }}
                            />
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
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all hover:brightness-110"
                              style={{ borderColor: `color-mix(in srgb, ${p} 25%, transparent)`, background: `color-mix(in srgb, ${p} 8%, transparent)`, color: p }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <InlineText
                                section="menu"
                                fieldKey={"categories." + originalCatIdx + ".items." + originalItemIdx + ".delivery_platforms." + di + ".name"}
                                value={dp.name ?? ""}
                                placeholder="Order Online"
                                onUpdateField={onUpdateField}
                                isEditorMode={isEditorMode}
                                isSelected={isSelected}
                                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                                onEditingStateChange={onEditingStateChange}
                                as="span"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                      {/* Add to cart */}
                      <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
                        <AddToCartButton
                          itemId={item.id || `menu-tl-${originalCatIdx}-${originalItemIdx}`}
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
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                          style={{ background: `color-mix(in srgb, ${p} 10%, transparent)`, color: p, border: `1px solid color-mix(in srgb, ${p} 25%, transparent)` }}
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setQuickView({ catIdx: originalCatIdx, itemIdx: originalItemIdx }); }}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="text-[11px] font-semibold underline underline-offset-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                          style={{ color: p, background: "none", border: "none", padding: 0 }}
                        >
                          {isEN ? "View detail" : "Lihat Detail"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {isEditorMode && onAddItem && (
                <div style={{ marginTop: "0.75rem" }}>
                  <InlineAddTile label="Tambah Item" onClick={() => onAddItem(cat.originalCatIdx)} />
                </div>
              )}
            </div>
          ))
        )}
      {isEditorMode && onAddCategory && (
        <CategoryAddButton onAdd={onAddCategory} isEN={isEN} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
      )}
      {quickView && qvItem && (
        <ProductQuickView
          open
          onClose={() => setQuickView(null)}
          item={toQuickViewItem(qvItem, qvCategory?.name)}
          editSection="menu"
          pathBase={`categories.${quickView.catIdx}.items.${quickView.itemIdx}`}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      )}
      </div>
    </section>
  );
}
