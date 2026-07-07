"use client";
import React, { useState } from "react";
import { Utensils } from "lucide-react";
import { MenuCatalogCard } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

/**
 * Tabs by Category — each category becomes a clickable tab.
 * Best for menus with 3+ categories where scrolling per-category is too long.
 */
export default function MenuTabsByCategory({ menu }: { menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null }) {
  if (!menu) return null;
  const [activeIdx, setActiveIdx] = useState(0);
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const surface = "var(--dt-surface)";
  const text = "var(--dt-text)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";
  const cats = menu.categories ?? [];
  const active = cats[activeIdx];

  return (
    <section id="menu" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: p, background: `color-mix(in srgb, ${p} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>
            {menu.eyebrow ?? "Pilihan Menu"}
          </span>
          <h2 style={{ fontFamily: hFont, fontWeight: hWeight as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: text, marginTop: "0.85rem", lineHeight: 1.15 }}>
            {menu.title}
          </h2>
          <div style={{ width: "3rem", height: "3px", background: p, borderRadius: "4px", margin: "0.75rem auto 0" }} />
        </div>

        {/* Tab bar */}
        <div style={{
          display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center",
          marginBottom: "2rem",
        }}>
          {cats.map((cat, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "9999px",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? p : `color-mix(in srgb, ${p} 8%, ${surface})`,
                  color: isActive ? bg : `color-mix(in srgb, ${text} 70%, transparent)`,
                  border: isActive ? `1.5px solid ${p}` : `1.5px solid color-mix(in srgb, ${p} 20%, transparent)`,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Active category items */}
        {active && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {active.items?.map((item, ii) => (
              <MenuCatalogCard
                key={ii}
                itemId={`menu-tab-${activeIdx}-${ii}`}
                itemName={item.name}
                itemPrice={item.price}
                itemDescription={item.description}
                category={active.name}
                image_url={item.image_url}
                icon={Utensils}
                className="group transition-all duration-300"
                style={{ background: bg, border: `1px solid color-mix(in srgb, ${p} 14%, transparent)`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                imageClassName="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                placeholderClassName="w-full h-52 flex items-center justify-center"
                placeholderStyle={{ background: `color-mix(in srgb, ${p} 8%, transparent)` }}
                placeholderIconClassName="w-12 h-12"
                placeholderIconStyle={{ color: `color-mix(in srgb, ${p} 30%, transparent)`, opacity: 0.6 }}
                contentClassName="p-5 space-y-3 flex flex-col flex-1"
                headerClassName="flex items-start justify-between gap-3"
                titleClassName="font-bold text-sm leading-tight"
                titleStyle={{ color: text, fontFamily: hFont }}
                descriptionClassName="text-xs leading-relaxed flex-1"
                descriptionStyle={{ color: `color-mix(in srgb, ${text} 60%, transparent)` }}
                priceClassName="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
                priceStyle={{ background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p }}
                buttonClassName="mt-auto w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 hover:brightness-110"
                buttonStyle={{ background: p, color: bg, border: "none" }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
