"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AddToCartButton, isPlaceholderPrice } from "@/components/cart";
import type { TemplateProps, DesignToken } from "../../templates/types";

/**
 * Accordion by Category — each category is a collapsible accordion panel.
 * First category open by default. Compact and space-efficient.
 * Uses plain item rows (no full MenuCatalogCard) to keep it clean.
 */
export default function MenuAccordionByCategory({ menu }: { menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null }) {
  if (!menu) return null;
  const [openIdx, setOpenIdx] = useState<number>(0);
  const p = "var(--dt-primary)";
  const bg = "var(--dt-bg)";
  const surface = "var(--dt-surface)";
  const text = "var(--dt-text)";
  const muted = "color-mix(in srgb, var(--dt-text) 55%, transparent)";
  const hFont = "var(--dt-heading-font)";
  const hWeight = "var(--dt-heading-weight)";

  return (
    <section id="menu" style={{ padding: "var(--dt-spacing) 1.5rem", background: `color-mix(in srgb, ${p} 4%, ${bg})`, borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
      <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: p, background: `color-mix(in srgb, ${p} 10%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>
            {menu.eyebrow ?? "Pilihan Menu"}
          </span>
          <h2 style={{ fontFamily: hFont, fontWeight: hWeight as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: text, marginTop: "0.85rem", lineHeight: 1.15 }}>
            {menu.title}
          </h2>
          <div style={{ width: "3rem", height: "3px", background: p, borderRadius: "4px", margin: "0.75rem auto 0" }} />
        </div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {menu.categories?.map((cat, ci) => {
            const isOpen = openIdx === ci;
            return (
              <div
                key={ci}
                style={{
                  border: `1.5px solid ${isOpen ? p : `color-mix(in srgb, ${p} 18%, transparent)`}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                  background: surface,
                }}
              >
                {/* Accordion header */}
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : ci)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 1.25rem",
                    background: isOpen ? `color-mix(in srgb, ${p} 6%, ${surface})` : "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  <span style={{ fontFamily: hFont, fontWeight: 700, fontSize: "0.9rem", color: isOpen ? p : text }}>
                    {cat.name}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.65rem", color: muted, fontWeight: 500 }}>{cat.items?.length ?? 0} item</span>
                    <ChevronDown
                      style={{
                        width: 16, height: 16, color: p,
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    />
                  </span>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid color-mix(in srgb, ${p} 12%, transparent)` }}>
                    {cat.items?.map((item, ii) => {
                      const showPrice = item.price && !isPlaceholderPrice(item.price);
                      return (
                        <div
                          key={ii}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                            padding: "0.875rem 1.25rem",
                            borderBottom: ii < (cat.items?.length ?? 0) - 1
                              ? `1px solid color-mix(in srgb, ${p} 7%, transparent)`
                              : "none",
                          }}
                        >
                          {/* Item image thumbnail */}
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                              style={{ width: "3.5rem", height: "3.5rem", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                            />
                          )}
                          {/* Text */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "baseline" }}>
                              <span style={{ fontFamily: hFont, fontWeight: 600, fontSize: "0.875rem", color: text }}>
                                {item.name}
                              </span>
                              {showPrice && (
                                <span style={{ fontWeight: 700, fontSize: "0.8rem", color: p, flexShrink: 0 }}>
                                  {item.price}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p style={{ margin: "0.25rem 0 0.5rem", fontSize: "0.75rem", color: muted, lineHeight: 1.5 }}>
                                {item.description}
                              </p>
                            )}
                            <AddToCartButton
                              itemId={`menu-acc-${ci}-${ii}`}
                              itemName={item.name}
                              itemPrice={item.price ?? null}
                              category={cat.name}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                              style={{ background: `color-mix(in srgb, ${p} 10%, transparent)`, color: p, border: `1px solid color-mix(in srgb, ${p} 25%, transparent)` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
