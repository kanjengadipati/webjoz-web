"use client";
import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard } from "../../templates/shared";
import type { TemplateProps } from "../../templates/types";

export default function CatalogSectionInner({ catalog }: { catalog: TemplateProps["content"]["catalog"] }) {
  if (!catalog) return null;
  const brandBg = "var(--dt-bg)";
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  return (
    <section id="catalog" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: brandPrimary, background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>Koleksi Produk</span>
          <h2 style={{ fontFamily: headingFont, fontWeight: headingWeight as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: brandText, marginTop: "0.85rem", lineHeight: 1.15 }}>{catalog.title}</h2>
          <div style={{ width: "3rem", height: "3px", background: brandPrimary, borderRadius: "4px", margin: "0.75rem auto 0" }} />
        </div>
        {catalog.categories?.map((cat, catIdx) => (
          <div key={catIdx} style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
              <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${brandPrimary} 18%, transparent)` }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: brandPrimary, flexShrink: 0 }} />
              <h3 style={{ fontFamily: headingFont, fontWeight: 700, color: brandPrimary, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{cat.name}</h3>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: brandPrimary, flexShrink: 0 }} />
              <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${brandPrimary} 18%, transparent)` }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
              {cat.items?.map((item, itemIdx) => (
                <MenuCatalogCard
                  key={itemIdx}
                  itemId={`${cat.name}__${item.name}__${catIdx}_${itemIdx}`}
                  itemName={item.name}
                  itemPrice={item.price}
                  itemDescription={item.description}
                  category={cat.name}
                  image_url={item.image_url}
                  badge={item.badge}
                  icon={ImageIcon}
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
                  badgeClassName="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                  badgeStyle={{ background: brandPrimary, color: brandBg }}
                  buttonClassName="mt-auto w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md"
                  buttonStyle={{ background: brandPrimary, color: brandBg, border: "none" }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
