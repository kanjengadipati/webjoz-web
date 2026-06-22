"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import type { TemplateProps } from "../../templates/types";

export default function CtaSectionInner({ cta: c }: { cta: TemplateProps["content"]["cta"] }) {
  return (
    <section style={{ padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
      <div className="px-4 py-8 md:px-8 md:py-16" style={{ background: `linear-gradient(135deg, var(--dt-primary), color-mix(in srgb, var(--dt-accent) 80%, var(--dt-primary)))`, borderRadius: "var(--dt-radius-lg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "50%", height: "150%", background: "rgba(255,255,255,0.06)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "36rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-cta-text)", margin: 0 }}>{c.headline}</h2>
          <a href={c.button_url} className="px-6 py-2.5 md:px-10 md:py-3.5 text-xs md:text-base font-bold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--dt-cta-btn-bg)", color: "var(--dt-cta-btn-text)", borderRadius: "var(--dt-radius)", textDecoration: "none", transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {c.button_text} <ArrowRight style={{ width: 16, height: 16 }} />
          </a>
        </div>
      </div>
    </section>
  );
}
