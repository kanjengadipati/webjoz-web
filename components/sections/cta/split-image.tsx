"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CtaVariantProps {
  cta: TemplateProps["content"]["cta"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
}

export default function CtaSplitImage({ cta: c, language = "id" }: CtaVariantProps) {
  const isEN = language === "en";
  return (
    <section style={{ padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: "var(--dt-radius-lg)", overflow: "hidden", border: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
        <div style={{ padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1rem", background: `linear-gradient(135deg, var(--dt-primary), color-mix(in srgb, var(--dt-accent) 70%, var(--dt-primary)))` }}>
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-cta-text)", margin: 0 }}>{c.headline}</h2>
          {c.subheadline && <p style={{ fontSize: "0.9rem", color: "color-mix(in srgb, var(--dt-cta-text) 80%, transparent)", lineHeight: 1.5, margin: 0 }}>{c.subheadline}</p>}
          <a href={c.button_url} className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold" style={{ alignSelf: "flex-start", background: "var(--dt-cta-btn-bg, #ffffff)", color: "var(--dt-cta-btn-text, #1e293b)", borderRadius: "var(--dt-radius)", textDecoration: "none", transition: "opacity 0.2s, transform 0.15s", boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.92"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {c.button_text || (isEN ? "Contact Us" : "Hubungi Kami")} <ArrowRight style={{ width: 16, height: 16, flexShrink: 0 }} />
          </a>
          {c.trust_signal && <p style={{ fontSize: "0.75rem", color: "color-mix(in srgb, var(--dt-cta-text) 60%, transparent)", margin: 0 }}>{c.trust_signal}</p>}
        </div>
        <div style={{ position: "relative", minHeight: "280px", background: `color-mix(in srgb, var(--dt-primary) 6%, var(--dt-surface))` }}>
          {c.image_url ? (
            <img src={c.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `color-mix(in srgb, var(--dt-primary) 6%, var(--dt-surface))` }}>
              <div style={{ width: 64, height: 64, borderRadius: "var(--dt-radius)", background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight style={{ width: 24, height: 24, color: "var(--dt-primary)" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
