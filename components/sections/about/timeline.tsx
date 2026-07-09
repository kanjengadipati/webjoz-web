"use client";
import React from "react";
import { Calendar } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface AboutVariantProps {
  about: TemplateProps["content"]["about"];
  design_token?: DesignToken | null;
}

export default function AboutTimeline({ about: a }: AboutVariantProps) {
  const milestones = a.milestones || [];
  return (
    <section id="about" style={{ padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>{a.eyebrow || "Perjalanan Kami"}</span>
        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{a.title}</h2>
        <p style={{ color: "var(--dt-text-muted)", maxWidth: "36rem", margin: "1rem auto 0", lineHeight: 1.7, whiteSpace: "pre-line" }}>{a.body}</p>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: "2px", height: "100%", background: `linear-gradient(to bottom, var(--dt-primary), color-mix(in srgb, var(--dt-accent) 60%, transparent))`, opacity: 0.3 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {milestones.map((m, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexDirection: idx % 2 === 0 ? "row" : "row-reverse" }}>
              <div style={{ flex: 1, textAlign: idx % 2 === 0 ? "right" : "left" }}>
                <div style={{ display: "inline-block", background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`, borderRadius: "var(--dt-radius-lg)", padding: "1.25rem", textAlign: "left", maxWidth: "24rem" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-primary)" }}>{m.year}</span>
                  <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.95rem", margin: "0.35rem 0 0" }}>{m.title}</h3>
                  {m.description && <p style={{ color: "var(--dt-text-muted)", fontSize: "0.8rem", lineHeight: 1.5, margin: "0.35rem 0 0" }}>{m.description}</p>}
                </div>
              </div>
              <div style={{ position: "relative", zIndex: 1, width: 36, height: 36, borderRadius: "50%", background: "var(--dt-surface)", border: `2px solid var(--dt-primary)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Calendar style={{ width: 14, height: 14, color: "var(--dt-primary)" }} />
              </div>
              <div style={{ flex: 1 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
