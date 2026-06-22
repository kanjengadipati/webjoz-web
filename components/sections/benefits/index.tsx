"use client";
import React from "react";
import { Star } from "lucide-react";
import { DynamicIcon } from "../../templates/shared";
import type { TemplateProps } from "../../templates/types";

export default function BenefitsSectionInner({ benefits: b }: { benefits: TemplateProps["content"]["benefits"] }) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  return (
    <section id="benefits" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 5%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Keunggulan</span>
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{b.title}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {b.items?.map((item, idx) => (
            <div key={idx} style={{ background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`, borderRadius: "var(--dt-radius-lg)", padding: "2rem", display: "flex", flexDirection: "column", gap: "0.875rem", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px color-mix(in srgb, var(--dt-primary) 15%, transparent)`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              {item.stat ? (
                <div>
                  <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "2rem", color: "var(--dt-primary)", margin: 0 }}>{item.stat}</p>
                  {item.stat_label && <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)" }}>{item.stat_label}</p>}
                </div>
              ) : (
                <div style={{ width: 44, height: 44, background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`, borderRadius: "var(--dt-radius)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "var(--dt-primary)", display: "contents" }}><DynamicIcon name={item.icon} defaultIcon={Star} className="w-5 h-5" /></span>
                </div>
              )}
              <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "1.05rem", margin: 0 }}>{item.title}</h3>
              <p style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
