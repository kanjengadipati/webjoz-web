"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem, TemplateProps, DesignToken } from "../../templates/types";

interface FaqVariantProps {
  faq: TemplateProps["content"]["faq"];
  design_token?: DesignToken | null;
}

function DynamicFaqItem({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`, borderRadius: "var(--dt-radius)", overflow: "hidden" }}>
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        style={{ width: "100%", padding: "0.85rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", cursor: "pointer", color: "var(--dt-text)", fontWeight: 600, textAlign: "left", gap: "1rem" }}>
        <span style={{ fontSize: "0.875rem", flex: 1 }}>{item.question}</span>
        <ChevronDown style={{ width: 14, height: 14, flexShrink: 0, color: "var(--dt-text-muted)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.28s ease" }} />
      </button>
      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: "0 1rem 1rem", fontSize: "0.85rem", lineHeight: 1.7, color: "var(--dt-text-muted)", borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqSidebarCategory({ faq }: FaqVariantProps) {
  const items = faq.items || [];
  const categories = [...new Set(items.map(i => i.category).filter(Boolean))] as string[];
  const [activeCat, setActiveCat] = useState(categories[0] || "");

  const filtered = activeCat ? items.filter(i => i.category === activeCat) : items;

  return (
    <section id="faq" style={{ padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Pertanyaan Umum</span>
        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{faq.title}</h2>
      </div>
      {categories.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              style={{ padding: "0.4rem 1rem", borderRadius: "2rem", fontSize: "0.8rem", fontWeight: 600, border: `1px solid ${activeCat === cat ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-primary) 20%, transparent)"}`, background: activeCat === cat ? "var(--dt-primary)" : "transparent", color: activeCat === cat ? "var(--dt-cta-text, #fff)" : "var(--dt-text)", cursor: "pointer", transition: "all 0.2s" }}>
              {cat}
            </button>
          ))}
        </div>
      )}
      <div style={{ maxWidth: "48rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.map((item, idx) => <DynamicFaqItem key={idx} item={item} />)}
      </div>
    </section>
  );
}
