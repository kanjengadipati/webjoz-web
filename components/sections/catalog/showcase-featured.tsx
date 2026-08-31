"use client";
import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, isPlaceholderPrice } from "../../templates/shared";
import { AddToCartButton } from "@/components/cart";
import PhotoCredit from "../PhotoCredit";
import type { TemplateProps, DesignToken } from "../../templates/types";

/**
 * Showcase Featured — items with a non-empty `badge` field are featured.
 * Featured items rendered large above the fold (up to 2 per category).
 * Remaining items shown in standard grid below.
 * Reuses badge field: any item with badge != null/empty is "featured".
 */
export default function CatalogShowcaseFeatured({ catalog }: { catalog: TemplateProps["content"]["catalog"]; design_token?: DesignToken | null }) {
  if (!catalog) return null;
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const surface = "var(--dt-surface)";
  const text = "var(--dt-text)";
  const muted = "color-mix(in srgb, var(--dt-text) 55%, transparent)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";

  return (
    <section id="catalog" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: p, background: `color-mix(in srgb, ${p} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>
            {catalog.eyebrow ?? "Koleksi Produk"}
          </span>
          <h2 style={{ fontFamily: hFont, fontWeight: hWeight as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: text, marginTop: "0.85rem", lineHeight: 1.15 }}>
            {catalog.title}
          </h2>
          <div style={{ width: "3rem", height: "3px", background: p, borderRadius: "4px", margin: "0.75rem auto 0" }} />
        </div>

        {catalog.categories?.map((cat, ci) => {
          const featured = cat.items?.filter((it) => it.badge) ?? [];
          const rest = cat.items?.filter((it) => !it.badge) ?? [];
          return (
            <div key={ci} style={{ marginBottom: "4rem" }}>
              {/* Category label */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.75rem" }}>
                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
                <h3 style={{ fontFamily: hFont, fontWeight: 700, color: p, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{cat.name}</h3>
                <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${p} 18%, transparent)` }} />
              </div>

              {/* Featured items — large cards (up to 2) */}
              {featured.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: featured.length === 1 ? "1fr" : "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
                  {featured.slice(0, 2).map((item, fi) => {
                    const showPrice = item.price && !isPlaceholderPrice(item.price);
                    return (
                      <div
                        key={fi}
                        style={{ background: surface, border: `1.5px solid color-mix(in srgb, ${p} 20%, transparent)`, borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: `0 4px 20px color-mix(in srgb, ${p} 10%, transparent)` }}
                      >
                        {/* Featured image — taller */}
                        <div style={{ position: "relative", height: "15rem" }}>
                          {item.image_url ? (
                            <>
                              <img
                                src={item.image_url}
                                alt={item.name}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                              />
                              <div style={{ position: "absolute", bottom: 8, right: 8 }}>
                                <PhotoCredit credit={item.image_credit} />
                              </div>
                            </>
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: `color-mix(in srgb, ${p} 10%, ${bg})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ImageIcon style={{ width: "3rem", height: "3rem", color: `color-mix(in srgb, ${p} 30%, transparent)` }} />
                            </div>
                          )}
                          {/* Badge pill overlay */}
                          <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: p, color: bg, padding: "0.25rem 0.625rem", borderRadius: "9999px", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {item.badge}
                          </span>
                        </div>
                        {/* Content */}
                        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                            <h4 style={{ fontFamily: hFont, fontWeight: 700, fontSize: "1rem", color: text, margin: 0 }}>{item.name}</h4>
                            {showPrice && (
                              <span style={{ fontFamily: hFont, fontWeight: 800, fontSize: "0.9rem", color: p, flexShrink: 0 }}>{item.price}</span>
                            )}
                          </div>
                          {item.description && (
                            <p style={{ margin: 0, fontSize: "0.8rem", color: muted, lineHeight: 1.55 }}>{item.description}</p>
                          )}
                          <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
                            <AddToCartButton
                              itemId={item.id || `cat-sf-feat-${ci}-${fi}`}
                              itemName={item.name}
                              itemPrice={item.price_display || item.price || null}
                              itemPriceAmount={item.price_amount}
                              itemPriceDisplay={item.price_display || item.price}
                              category={cat.name}
                              disabled={item.is_available === false}
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all hover:brightness-110"
                              style={{ background: p, color: bg, border: "none" }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Remaining items — standard grid */}
              {rest.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
                  {rest.map((item, ii) => (
                    <MenuCatalogCard
                      key={item.id || ii}
                      itemId={item.id || `cat-sf-rest-${ci}-${ii}`}
                      itemName={item.name}
                      itemPrice={item.price}
                      itemPriceAmount={item.price_amount}
                      itemPriceDisplay={item.price_display}
                      itemDescription={item.description}
                      category={cat.name}
                      image_url={item.image_url}
                      badge={item.badge}
                      is_available={item.is_available}
                      icon={ImageIcon}
                      className="group transition-all duration-300"
                      style={{ background: bg, border: `1px solid color-mix(in srgb, ${p} 14%, transparent)`, borderRadius: "14px", overflow: "hidden" }}
                      imageClassName="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholderClassName="w-full h-40 flex items-center justify-center"
                      placeholderStyle={{ background: `color-mix(in srgb, ${p} 8%, transparent)` }}
                      placeholderIconClassName="w-10 h-10"
                      placeholderIconStyle={{ color: `color-mix(in srgb, ${p} 30%, transparent)`, opacity: 0.6 }}
                      contentClassName="p-4 flex flex-col flex-1"
                      headerClassName="flex items-start justify-between gap-2 mb-2"
                      titleClassName="font-semibold text-sm leading-tight line-clamp-2"
                      titleStyle={{ color: text, fontFamily: hFont }}
                      descriptionClassName="text-xs leading-relaxed line-clamp-3"
                      descriptionStyle={{ color: muted }}
                      priceClassName="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                      priceStyle={{ background: `color-mix(in srgb, ${p} 12%, transparent)`, color: p }}
                      buttonClassName="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all hover:brightness-110"
                      buttonStyle={{ background: p, color: bg, border: "none" }}
                    />
                  ))}
                </div>
              )}

              {/* Edge case: all items have badge — show them in featured grid only, no rest grid needed */}
            </div>
          );
        })}
      </div>
    </section>
  );
}
