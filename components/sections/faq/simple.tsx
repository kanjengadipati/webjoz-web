"use client";
import React from "react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface FaqVariantProps {
  faq: TemplateProps["content"]["faq"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
}

export default function FaqSimple({ faq, language = "id" }: FaqVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  const isEN = language === "en";
  return (
    <section id="faq" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, maxWidth: "52rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>{isEN ? "FAQ" : "Pertanyaan Umum"}</span>
        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{faq.title}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {faq.items?.map((item, idx) => (
          <div key={idx} style={{ padding: "1.25rem 0", borderBottom: idx < (faq.items?.length ?? 0) - 1 ? "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" : "none" }}>
            <h3 style={{ fontFamily: "var(--dt-body-font)", color: "var(--dt-text)", fontWeight: 600, fontSize: "0.95rem", margin: 0, marginBottom: "0.4rem" }}>{item.question}</h3>
            <p style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
