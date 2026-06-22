"use client";
import React from "react";
import { Utensils } from "lucide-react";
import { MenuCatalogCard } from "../../templates/shared";
import type { TemplateProps } from "../../templates/types";

export default function MenuSectionInner({ menu }: { menu: TemplateProps["content"]["menu"] }) {
  if (!menu) return null;
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  return (
    <section id="menu" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--dt-primary)", background: `color-mix(in srgb, var(--dt-primary) 8%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>Pilihan Menu</span>
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: "var(--dt-text)", marginTop: "0.85rem", lineHeight: 1.15 }}>{menu.title}</h2>
        </div>
        {menu.categories?.map((cat, catIdx) => (
          <div key={catIdx} style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
              <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, var(--dt-primary) 16%, transparent)` }} />
              <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-primary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{cat.name}</h3>
              <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, var(--dt-primary) 16%, transparent)` }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {cat.items?.map((item, itemIdx) => (
                <MenuCatalogCard
                  key={itemIdx}
                  itemId={`${cat.name}__${item.name}__${catIdx}_${itemIdx}`}
                  itemName={item.name}
                  itemPrice={item.price}
                  itemDescription={item.description}
                  category={cat.name}
                  image_url={item.image_url}
                  icon={Utensils}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
