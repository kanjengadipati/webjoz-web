"use client";
import React from "react";
import { Utensils, ExternalLink } from "lucide-react";
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

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  vegetarian: { bg: "#dcfce7", text: "#166534" },
  vegan: { bg: "#d1fae5", text: "#065f46" },
  halal: { bg: "#dbeafe", text: "#1e40af" },
  pedas: { bg: "#fee2e2", text: "#991b1b" },
  spicy: { bg: "#fee2e2", text: "#991b1b" },
  "bebas gluten": { bg: "#fef9c3", text: "#854d0e" },
  "gluten free": { bg: "#fef9c3", text: "#854d0e" },
  "best seller": { bg: "#fef3c7", text: "#92400e" },
};

function getTagStyle(tag: string) {
  const key = tag.toLowerCase();
  return TAG_COLORS[key] || { bg: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", text: "var(--dt-primary)" };
}

const PLATFORM_ICONS: Record<string, string> = {
  grabfood: "🟢",
  gofood: "🔴",
  shopeefood: "🟠",
  tokopedia: "🟢",
  shopee: "🟠",
};

function getPlatformIcon(name: string) {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return PLATFORM_ICONS[key] || "📦";
}

export default function MenuCards({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: MenuVariantProps) {
  if (!menu) return null;
  const brandBg = "var(--dt-bg)";
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  return (
    <section id="menu" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
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
          <div key={catIdx} style={{ marginBottom: "4rem" }}>
            <h3 style={{ fontFamily: headingFont, fontWeight: 700, color: brandPrimary, fontSize: "1.1rem", marginBottom: "1.5rem", textAlign: "center" }}>{cat.name}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2rem" }}>
              {cat.items?.map((item, itemIdx) => (
                <div key={item.id || itemIdx} className="flex flex-col">
                  <MenuCatalogCard
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
                    descriptionClassName="text-sm leading-relaxed flex-1"
                    descriptionStyle={{ color: `color-mix(in srgb, ${brandText} 60%, transparent)` }}
                    priceClassName="text-sm font-bold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                    priceStyle={{ background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`, color: brandPrimary }}
                    buttonClassName="mt-auto w-full flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md"
                    buttonStyle={{ background: brandPrimary, color: brandBg, border: "none" }}
                  />
                  {/* Tags: dietary / category labels */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                      {item.tags.map((tag, ti) => {
                        const { bg, text } = getTagStyle(tag);
                        return (
                          <span key={ti} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: bg, color: text }}>
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {/* Delivery platforms */}
                  {item.delivery_platforms && item.delivery_platforms.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 px-1">
                      {item.delivery_platforms.map((platform, pi) => (
                        <a
                          key={pi}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors hover:opacity-80"
                          style={{ borderColor: `color-mix(in srgb, ${brandPrimary} 20%, transparent)`, color: brandText, background: brandBg }}
                        >
                          <span>{getPlatformIcon(platform.name)}</span>
                          <span>{platform.name}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
