"use client";
import React from "react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CatalogVariantProps {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
}

export default function CatalogCompact({ catalog }: CatalogVariantProps) {
  if (!catalog) return null;
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  return (
    <section id="catalog" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${brandPrimary} 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: brandPrimary, background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>Koleksi Produk</span>
          <h2 style={{ fontFamily: headingFont, fontWeight: headingWeight as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: brandText, marginTop: "0.85rem", lineHeight: 1.15 }}>{catalog.title}</h2>
        </div>
        {catalog.categories?.map((cat, catIdx) => (
          <div key={catIdx} style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontFamily: headingFont, fontWeight: 700, color: brandPrimary, fontSize: "1rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `2px solid color-mix(in srgb, ${brandPrimary} 18%, transparent)` }}>{cat.name}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.5rem" }}>
              {cat.items?.map((item, itemIdx) => (
                <div key={item.id || itemIdx} style={{ display: "flex", flexDirection: "column", gap: "0.125rem", padding: "0.5rem 0.75rem", borderRadius: "var(--dt-radius)", opacity: item.is_available === false ? 0.6 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: brandText, fontFamily: headingFont }}>{item.name}</span>
                      {item.is_available === false ? (
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", padding: "0.1rem 0.35rem", borderRadius: "4px", background: "#f43f5e", color: "#fff" }}>Habis</span>
                      ) : item.badge ? (
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.15rem 0.5rem", borderRadius: "9999px", background: brandPrimary, color: "var(--dt-bg)" }}>{item.badge}</span>
                      ) : null}
                    </div>
                    {(item.price_display || item.price) && <span style={{ fontWeight: 700, fontSize: "0.8rem", color: brandPrimary, whiteSpace: "nowrap" }}>{item.price_display || item.price}</span>}
                  </div>
                  {item.description && <span style={{ fontSize: "0.8rem", color: "var(--dt-text-muted)", lineHeight: 1.4 }}>{item.description}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
