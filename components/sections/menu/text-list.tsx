"use client";
import React from "react";
import { AddToCartButton, isPlaceholderPrice } from "@/components/cart";
import { InlineText } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

/**
 * Text List — fine dining / premium menu style.
 * No images. Category headers as section dividers.
 * Item name left, dotted leader, price right.
 * AddToCartButton preserved per spec requirement.
 */
export default function MenuTextList({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: { menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null; onUpdateField?: (section: string, key: string, value: any) => void; isEditorMode?: boolean; isSelected?: boolean; collapseSheetForInlineEdit?: () => void; onEditingStateChange?: (isEditing: boolean) => void }) {
  if (!menu) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const text = "var(--dt-text)";
  const muted = "color-mix(in srgb, var(--dt-text) 55%, transparent)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";

  return (
    <section id="menu" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 3%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 10%, transparent)` }}>
      <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          {menu.eyebrow && (
            <InlineText
              section="menu"
              fieldKey="eyebrow"
              value={menu.eyebrow}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              style={{ display: "inline-block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: p, marginBottom: "0.75rem" }}
            />
          )}
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
            style={{ fontFamily: hFont, fontWeight: hWeight as any, fontSize: "clamp(1.5rem, 4cqw, 2.25rem)", color: text, margin: 0, lineHeight: 1.15 }}
          />
          {menu.subtitle && (
            <InlineText
              section="menu"
              fieldKey="subtitle"
              value={menu.subtitle}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="p"
              style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: muted, lineHeight: 1.6 }}
            />
          )}
          <div style={{ width: "2rem", height: "1px", background: p, margin: "1.25rem auto 0", opacity: 0.5 }} />
        </div>

        {menu.categories?.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: "2.5rem" }}>
            {/* Category divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <span style={{ flex: 1, height: "1px", background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
              <InlineText section="menu" fieldKey={"categories." + ci + ".name"} value={cat.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="h3" style={{
                fontFamily: hFont, fontWeight: 600, fontSize: "0.7rem",
                textTransform: "uppercase", letterSpacing: "0.2em",
                color: p, margin: 0, whiteSpace: "nowrap",
              }} />
              <span style={{ flex: 1, height: "1px", background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {cat.items?.map((item, ii) => {
                const showPrice = item.price && !isPlaceholderPrice(item.price);
                return (
                  <div key={ii} style={{
                    padding: "0.875rem 0",
                    borderBottom: `1px solid color-mix(in srgb, ${p} 8%, transparent)`,
                  }}>
                    {/* Name + dotted leader + price row */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                      <InlineText section="menu" fieldKey={"categories." + ci + ".items." + ii + ".name"} value={item.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontFamily: hFont, fontWeight: 600, fontSize: "0.9rem", color: text, flexShrink: 0 }} />
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
                        <InlineText section="menu" fieldKey={"categories." + ci + ".items." + ii + ".price"} value={item.price_display || item.price || ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" style={{ fontFamily: hFont, fontWeight: 700, fontSize: "0.875rem", color: p, flexShrink: 0 }} />
                      )}
                    </div>
                    {/* Description */}
                    {item.description && (
                      <InlineText section="menu" fieldKey={"categories." + ci + ".items." + ii + ".description"} value={item.description ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="p" multiline style={{ margin: "0.3rem 0 0.6rem", fontSize: "0.78rem", color: muted, lineHeight: 1.55 }} />
                    )}
                    {/* Add to cart — compact inline */}
                    <div style={{ marginTop: "0.4rem" }}>
                      <AddToCartButton
                        itemId={item.id || `menu-tl-${ci}-${ii}`}
                        itemName={item.name}
                        itemPrice={item.price_display || item.price || null}
                        itemPriceAmount={item.price_amount}
                        itemPriceDisplay={item.price_display || item.price}
                        category={cat.name}
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
        ))}
      </div>
    </section>
  );
}
