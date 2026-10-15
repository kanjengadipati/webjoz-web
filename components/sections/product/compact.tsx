"use client";
import React, { useState } from "react";
import { InlineText, ProductQuickView, toQuickViewItem } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { SectionHeader, pillEyebrowStyle, headerTitleStyle } from "../section-header";
import { productCategories, type ProductVariantProps } from "./types";

export default function ProductCompact({
  kind, data, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
  onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id",
}: ProductVariantProps) {
  const isEN = language === "en";
  const isMenu = kind === "menu";
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);
  if (!data) return null;
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const cats = productCategories(data);
  const eyebrowDefault = isMenu ? "Pilihan Menu" : "";
  const qvCategory = quickView ? cats[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  return (
    <section id={kind} style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${brandPrimary} 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <SectionHeader
          section={kind}
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
                <InlineText section={kind} fieldKey={"categories." + catIdx + ".name"} value={cat.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="h3" style={{ fontFamily: headingFont, fontWeight: 700, color: brandPrimary, fontSize: "1rem" }} />
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton
                    compact
                    onDelete={() => onDeleteCategory(catIdx)}
                    title={isEN ? "Delete Category" : "Hapus Kategori"}
                  />
                )}
              </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.5rem" }}>
              {cat.items?.map((item, itemIdx) => (
                <div key={item.id || itemIdx} className={isMenu ? "relative group cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--dt-primary)_6%,transparent)]" : "group cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--dt-primary)_6%,transparent)]"} onClick={() => setQuickView({ catIdx, itemIdx })} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "0.125rem", padding: "0.5rem 0.75rem", borderRadius: "var(--dt-radius)", opacity: item.is_available === false ? 0.6 : 1 }}>
                  {isMenu && isEditorMode && onDeleteItem && (
                    <InlineDeleteButton
                      compact
                      onDelete={() => onDeleteItem(catIdx, itemIdx)}
                      className="absolute top-1.5 right-1.5"
                    />
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", paddingRight: isEditorMode && onDeleteItem ? (isMenu ? "1.5rem" : "2rem") : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: isMenu ? "0.375rem" : "0.5rem" }}>
                      <InlineText section={kind} fieldKey={"categories." + catIdx + ".items." + itemIdx + ".name"} value={item.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontWeight: 600, fontSize: "0.9rem", color: brandText, fontFamily: headingFont }} />
                      {item.is_available === false ? (
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", padding: "0.1rem 0.35rem", borderRadius: "4px", background: "#f43f5e", color: "#fff" }}>Habis</span>
                      ) : !isMenu && item.badge ? (
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.15rem 0.5rem", borderRadius: "9999px", background: brandPrimary, color: "var(--dt-bg)" }}><InlineText section={kind} fieldKey={"categories." + catIdx + ".items." + itemIdx + ".badge"} value={item.badge ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" /></span>
                      ) : null}
                    </div>
                    {(item.price_display || item.price) && <InlineText section={kind} fieldKey={"categories." + catIdx + ".items." + itemIdx + ".price"} value={item.price_display || item.price || ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontWeight: 700, fontSize: "0.8rem", color: brandPrimary, whiteSpace: "nowrap" }} />}
                  </div>
                  {item.description && <InlineText section={kind} fieldKey={"categories." + catIdx + ".items." + itemIdx + ".description"} value={item.description ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" multiline style={{ fontSize: "0.8rem", color: "var(--dt-text-muted)", lineHeight: 1.4 }} />}
                  {!isMenu && item.capacity != null && item.capacity > 0 && (
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: brandPrimary, marginTop: "0.15rem" }}>
                      s/d <InlineText section={kind} fieldKey={"categories." + catIdx + ".items." + itemIdx + ".capacity"} value={item.capacity != null ? String(item.capacity) : ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" /> tamu
                    </span>
                  )}
                  {!isMenu && item.features && item.features.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.25rem" }}>
                      {item.features.map((f, fi) => (
                        <span key={fi} style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem", borderRadius: "4px", background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`, color: brandPrimary }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setQuickView({ catIdx, itemIdx }); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="self-start mt-1 text-[0.68rem] font-bold uppercase tracking-wider underline underline-offset-2 transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                    style={{ color: brandPrimary, background: "none", border: "none", padding: 0 }}
                  >
                    {isEN ? "View detail" : "Lihat Detail"}
                  </button>
                  {!isMenu && isEditorMode && onDeleteItem && (
                    <InlineDeleteButton onDelete={() => onDeleteItem(catIdx, itemIdx)} className="absolute top-2 right-1 z-30" />
                  )}
                </div>
              ))}
              {isEditorMode && onAddItem && (
                <InlineAddTile
                  label="Tambah Item"
                  variant="card"
                  className="rounded-xl min-h-[140px]"
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
          editSection={kind}
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
