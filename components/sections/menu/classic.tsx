"use client";
import React from "react";
import { Utensils } from "lucide-react";
import { MenuCatalogCard, InlineText } from "../../templates/shared";
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

export default function MenuClassic({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: MenuVariantProps) {
  if (!menu) return null;
  const brandBg = "var(--dt-bg)";
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  return (
    <section id="menu" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: brandPrimary, background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>Pilihan Menu</span>
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
        {menu.categories?.map((cat, catIdx) => (
          <div key={catIdx} style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
              <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${brandPrimary} 18%, transparent)` }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: brandPrimary, flexShrink: 0 }} />
              <InlineText section="menu" fieldKey={"categories." + catIdx + ".name"} value={cat.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="h3" style={{ fontFamily: headingFont, fontWeight: 700, color: brandPrimary, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: brandPrimary, flexShrink: 0 }} />
              <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${brandPrimary} 18%, transparent)` }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {cat.items?.map((item, itemIdx) => (
                <MenuCatalogCard
                  key={item.id || itemIdx}
                  itemId={item.id || `${cat.name}__${item.name}__${catIdx}_${itemIdx}`}
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
                  icon={Utensils}
                  className="group transition-all duration-300"
                  style={{ background: brandBg, border: `1px solid color-mix(in srgb, ${brandPrimary} 14%, transparent)`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                  imageClassName="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                  placeholderClassName="w-full h-52 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                  placeholderStyle={{ background: `color-mix(in srgb, ${brandPrimary} 8%, transparent)` }}
                  placeholderIconClassName="w-12 h-12"
                  placeholderIconStyle={{ color: `color-mix(in srgb, ${brandPrimary} 30%, transparent)`, opacity: 0.6 }}
                  contentClassName="p-5 space-y-3 flex flex-col flex-1"
                  headerClassName="flex items-start justify-between gap-3"
                  titleClassName="font-bold text-sm leading-tight"
                  titleStyle={{ color: brandText, fontFamily: headingFont }}
                  descriptionClassName="text-xs leading-relaxed flex-1"
                  descriptionStyle={{ color: `color-mix(in srgb, ${brandText} 60%, transparent)` }}
                  priceClassName="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
                  priceStyle={{ background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`, color: brandPrimary }}
                  buttonClassName="mt-auto w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md"
                  buttonStyle={{ background: brandPrimary, color: brandBg, border: "none" }}
                  editSection="menu"
                  pathBase={"categories." + catIdx + ".items." + itemIdx}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
