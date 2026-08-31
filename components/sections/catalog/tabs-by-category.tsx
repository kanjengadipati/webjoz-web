"use client";
import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

/**
 * Tabs by Category — category tabs, shows one category at a time.
 * Best for catalogs with 3+ distinct categories.
 */
export default function CatalogTabsByCategory({ catalog }: { catalog: TemplateProps["content"]["catalog"]; design_token?: DesignToken | null }) {
  if (!catalog) return null;
  const [activeIdx, setActiveIdx] = useState(0);
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const surface = "var(--dt-surface)";
  const text = "var(--dt-text)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";
  const cats = catalog.categories ?? [];
  const active = cats[activeIdx];

  return (
    <section id="catalog" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: p, background: `color-mix(in srgb, ${p} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>
            {catalog.eyebrow ?? "Koleksi Produk"}
          </span>
          <h2 style={{ fontFamily: hFont, fontWeight: hWeight as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: text, marginTop: "0.85rem", lineHeight: 1.15 }}>
            {catalog.title}
          </h2>
          <div style={{ width: "3rem", height: "3px", background: p, borderRadius: "4px", margin: "0.75rem auto 0" }} />
        </div>

        {/* Tab bar — smooth horizontal scroll on mobile, centered on desktop */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar justify-start sm:justify-center"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
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

        {active && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem", alignItems: "stretch" }}>
            {active.items?.map((item, ii) => (
              <MenuCatalogCard
                key={item.id || ii}
                itemId={item.id || `cat-tab-${activeIdx}-${ii}`}
                itemName={item.name}
                itemPrice={item.price}
                itemPriceAmount={item.price_amount}
                itemPriceDisplay={item.price_display}
                itemDescription={item.description}
                category={active.name}
                image_url={item.image_url}
                image_urls={item.image_urls}
                badge={item.badge}
                is_available={item.is_available}
                variant_groups={item.variant_groups}
                features={item.features}
                capacity={item.capacity}
                icon={ImageIcon}
                className="group transition-all duration-300"
                style={{ background: bg, border: `1px solid color-mix(in srgb, ${p} 14%, transparent)`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                imageClassName="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                placeholderClassName="w-full h-48 flex items-center justify-center"
                placeholderStyle={{ background: `color-mix(in srgb, ${p} 8%, transparent)` }}
                placeholderIconClassName="w-12 h-12"
                placeholderIconStyle={{ color: `color-mix(in srgb, ${p} 30%, transparent)`, opacity: 0.6 }}
                contentClassName="p-5 flex flex-col flex-1"
                headerClassName="flex items-start justify-between gap-3 mb-2"
                titleClassName="font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem]"
                titleStyle={{ color: text, fontFamily: hFont }}
                descriptionClassName="text-xs leading-relaxed line-clamp-3 min-h-[3.75rem]"
                descriptionStyle={{ color: `color-mix(in srgb, ${text} 60%, transparent)` }}
                priceClassName="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
                priceStyle={{ background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p }}
                badgeClassName="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                badgeStyle={{ background: p, color: bg }}
                buttonClassName="w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all hover:brightness-110"
                buttonStyle={{ background: p, color: bg, border: "none" }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
