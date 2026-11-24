"use client";
import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { InlineText, InlineImage, ProductQuickView, toQuickViewItem } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { AddToCartButton } from "@/components/cart";
import { SectionHeader, pillEyebrowStyle, headerTitleStyle } from "../section-header";
import { productCategories, type ProductVariantProps } from "./types";
import { KIND_CONFIG, useProductKind } from "./kind-config";

export default function ProductCompact({
  section, kind: _kind, data, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
  onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id",
}: ProductVariantProps) {
  const isEN = language === "en";
  const kind = useProductKind();
  const isMenu = kind === "menu";
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);
  if (!data) return null;
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const cats = productCategories(data);
  const eyebrowDefault = isMenu ? (isEN ? "Menu Selection" : "Pilihan Menu") : (isEN ? "Product Collection" : "Koleksi Produk");
  const qvCategory = quickView ? cats[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  return (
    <section id={section} style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${brandPrimary} 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <SectionHeader
          section={section}
          eyebrow={data.eyebrow ?? eyebrowDefault}
          title={data.title}
          wrapperStyle={{ textAlign: "center", marginBottom: "2.5rem" }}
          eyebrowStyle={pillEyebrowStyle(brandPrimary)}
          titleStyle={headerTitleStyle(headingFont, headingWeight, brandText)}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
        {cats.map((cat, catIdx) => (
          <div key={catIdx} style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `2px solid color-mix(in srgb, ${brandPrimary} 18%, transparent)` }}>
              <InlineText section={section} fieldKey={"categories." + catIdx + ".name"} value={cat.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="h3" style={{ fontFamily: headingFont, fontWeight: 700, color: brandPrimary, fontSize: "1rem" }} />
              {isEditorMode && onDeleteCategory && (
                <InlineDeleteButton
                  compact
                  onDelete={() => onDeleteCategory(catIdx)}
                  title={isEN ? "Delete Category" : "Hapus Kategori"}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.items?.map((item, itemIdx) => {
                const isAvailable = item.is_available !== false;
                return (
                  <div
                    key={item.id || itemIdx}
                    className="group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border cursor-pointer hover:shadow-md"
                    onClick={() => setQuickView({ catIdx, itemIdx })}
                    style={{
                      background: "var(--dt-surface, #fff)",
                      borderColor: `color-mix(in srgb, ${brandPrimary} 14%, transparent)`,
                      opacity: isAvailable ? 1 : 0.65,
                    }}
                  >
                    {/* Compact Thumbnail (if image exists or in editor mode) */}
                    {(item.image_url || isEditorMode) && (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden relative bg-neutral-100 dark:bg-neutral-800">
                        <InlineImage
                          section={section}
                          fieldKey={"categories." + catIdx + ".items." + itemIdx + ".image_url"}
                          src={item.image_url}
                          alt={item.name}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          className="w-full h-full object-cover"
                          fallbackIcon={<ImageIcon className="w-5 h-5 text-neutral-400" />}
                        />
                      </div>
                    )}

                    {/* Middle Info Column */}
                    <div className="flex flex-col flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <InlineText
                          section={section}
                          fieldKey={"categories." + catIdx + ".items." + itemIdx + ".name"}
                          value={item.name ?? ""}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="span"
                          className="font-semibold text-sm leading-tight truncate max-w-full"
                          style={{ color: brandText, fontFamily: headingFont }}
                        />
                        {!isMenu && item.badge && (
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full whitespace-nowrap"
                            style={{ background: `color-mix(in srgb, ${brandPrimary} 15%, transparent)`, color: brandPrimary }}
                          >
                            <InlineText section={section} fieldKey={"categories." + catIdx + ".items." + itemIdx + ".badge"} value={item.badge ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
                          </span>
                        )}
                      </div>

                      {/* 1. Kurangi deskripsi (line-clamp-1) */}
                      {(item.description || isEditorMode) && (
                        <InlineText
                          section={section}
                          fieldKey={"categories." + catIdx + ".items." + itemIdx + ".description"}
                          value={item.description ?? ""}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="p"
                          className="text-xs line-clamp-1 mt-0.5 leading-snug"
                          style={{ color: "var(--dt-text-muted)" }}
                        />
                      )}

                      {/* Price display */}
                      {(item.price_display || item.price || isEditorMode) && (
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <InlineText
                            section={section}
                            fieldKey={"categories." + catIdx + ".items." + itemIdx + ".price"}
                            value={item.price_display || item.price || ""}
                            onUpdateField={onUpdateField}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                            onEditingStateChange={onEditingStateChange}
                            as="span"
                            className="font-bold text-xs sm:text-sm whitespace-nowrap"
                            style={{ color: brandPrimary }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Right Action Column: 2. Tampilkan stok & 3. Tombol lebih kecil */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Stock badge */}
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          backgroundColor: isAvailable
                            ? "color-mix(in srgb, #10b981 12%, transparent)"
                            : "color-mix(in srgb, #f43f5e 12%, transparent)",
                          color: isAvailable ? "#059669" : "#e11d48",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: isAvailable ? "#10b981" : "#f43f5e" }} />
                        {isAvailable ? (isEN ? "In Stock" : "Tersedia") : (isEN ? "Sold Out" : "Habis")}
                      </span>

                      {/* Smaller compact button */}
                      <AddToCartButton
                        itemId={item.id || `${section}-compact-${catIdx}-${itemIdx}`}
                        itemName={item.name ?? ""}
                        itemPrice={item.price_display || item.price || null}
                        itemPriceAmount={item.price_amount}
                        itemPriceDisplay={item.price_display || item.price}
                        itemPromoPriceAmount={item.promo_price_amount}
                        itemPromoPriceDisplay={item.promo_price_display}
                        discountLabel={item.discount_label}
                        itemDescription={item.description}
                        category={cat.name ?? ""}
                        variant_groups={item.variant_groups}
                        disabled={!isAvailable}
                        className="py-1 px-3 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 hover:brightness-110 shadow-xs"
                        style={{ background: brandPrimary, color: "var(--dt-primary-foreground)", border: "none" }}
                      />
                    </div>

                    {isEditorMode && onDeleteItem && (
                      <InlineDeleteButton
                        compact
                        onDelete={() => onDeleteItem(catIdx, itemIdx)}
                        className="absolute -top-1.5 -right-1.5 z-30"
                      />
                    )}
                  </div>
                );
              })}
              {isEditorMode && onAddItem && (
                <InlineAddTile
                  label={isEN ? (isMenu ? "Add Menu" : "Add Item") : (isMenu ? "Tambah Menu" : "Tambah Item")}
                  variant="card"
                  className="rounded-xl min-h-[90px]"
                  onClick={() => onAddItem(catIdx)}
                />
              )}
            </div>
          </div>
        ))}
        {isEditorMode && onAddCategory && (
          <CategoryAddButton onAdd={onAddCategory} isEN={isEN} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
        )}
        {quickView && qvItem && (
          <ProductQuickView
            open
            onClose={() => setQuickView(null)}
            item={toQuickViewItem(qvItem, qvCategory?.name)}
            editSection={section}
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
