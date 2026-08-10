"use client";
import React from "react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CtaVariantProps {
  cta: TemplateProps["content"]["cta"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
}

export default function CtaCentered({ cta: c, language = "id" }: CtaVariantProps) {
  const isEN = language === "en";
  return (
    <section style={{ padding: `var(--dt-spacing) 1.5rem`, maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", margin: 0 }}>{c.headline}</h2>
        <a href={c.button_url} className="px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base font-bold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", minWidth: "140px", justifyContent: "center", background: "var(--dt-primary)", color: "#ffffff", borderRadius: "var(--dt-radius)", textDecoration: "none", transition: "opacity 0.2s, transform 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {c.button_text || (isEN ? "Contact Us" : "Hubungi Kami")}
        </a>
      </div>
    </section>
  );
}
