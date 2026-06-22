"use client";
import React from "react";
import { ArrowRight, Clock } from "lucide-react";
import type { TemplateProps } from "../../templates/types";

export function HeroContent({ hero: h }: { hero: TemplateProps["content"]["hero"] }) {
  return (
    <>
      <h1 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.5rem, 6cqw, var(--dt-hero-size))", lineHeight: 1.15, color: "var(--dt-text)", margin: 0 }}>
        {h.headline}
      </h1>
      <p style={{ fontSize: "clamp(0.95rem, 3.5cqw, 1.125rem)", color: "var(--dt-text-muted)", maxWidth: "36rem", lineHeight: 1.6, margin: 0 }}>
        {h.subheadline}
      </p>
      {h.opening_hours && (
        <span className="px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-semibold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--dt-surface)", borderRadius: "9999px", color: "var(--dt-primary)", border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <Clock style={{ width: 14, height: 14 }} />
          {h.opening_hours}
        </span>
      )}
      <a href={h.cta_url} className="px-4 py-2.5 md:px-8 md:py-3.5 text-xs md:text-base font-bold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", textDecoration: "none", transition: "opacity 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {h.cta_text} <ArrowRight style={{ width: 18, height: 18 }} />
      </a>
    </>
  );
}

export function HeroDecorations({ hero: h }: { hero: TemplateProps["content"]["hero"] }) {
  return (
    <>
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "45%", height: "80%", background: `radial-gradient(circle, color-mix(in srgb, var(--dt-primary) 20%, transparent), transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "35%", height: "60%", background: `radial-gradient(circle, color-mix(in srgb, var(--dt-accent) 12%, transparent), transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
      {h.image_url && (
        <img
          src={h.image_url}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, mixBlendMode: "multiply", zIndex: 1 }}
          alt="Hero"
        />
      )}
    </>
  );
}
