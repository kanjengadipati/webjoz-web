"use client";
import React from "react";
import { Award } from "lucide-react";
import { DynamicIcon } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";
import type { TemplateProps } from "../../templates/types";

export default function AboutSectionInner({ about: a }: { about: TemplateProps["content"]["about"] }) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  return (
    <section id="about" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Mengenal Kami</span>
        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", margin: 0 }}>{a.title}</h2>
        <p style={{ color: "var(--dt-text-muted)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>{a.body}</p>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: "-1rem", background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 20%, transparent), color-mix(in srgb, var(--dt-accent) 10%, transparent))`, borderRadius: "var(--dt-radius-lg)", transform: "rotate(-2deg)", opacity: 0.5 }} />
        <div style={{ position: "relative", width: "100%", height: "320px", background: `color-mix(in srgb, var(--dt-primary) 6%, var(--dt-surface))`, border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`, borderRadius: "var(--dt-radius-lg)", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", padding: "2rem", textAlign: "center", background: "linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 12%, transparent), color-mix(in srgb, var(--dt-accent) 25%, transparent))", position: "absolute", inset: 0 }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: `radial-gradient(var(--dt-primary) 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
            <div style={{ background: "var(--dt-surface)", width: "5rem", height: "5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px color-mix(in srgb, var(--dt-primary) 20%, transparent)", position: "relative", zIndex: 1 }}>
              <span style={{ color: "var(--dt-primary)" }}><DynamicIcon name={a.icon} defaultIcon={Award} className="w-8 h-8" /></span>
            </div>
            <div style={{ position: "relative", zIndex: 1, background: "color-mix(in srgb, var(--dt-surface) 50%, transparent)", backdropFilter: "blur(4px)", padding: "0.5rem 1rem", borderRadius: "2rem" }}>
              <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.9rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{a.title}</p>
            </div>
          </div>
          {a.image_url && (
            <>
              <img
                src={a.image_url}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 2 }}
                alt="About"
              />
              <PhotoCredit credit={a.image_credit} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
