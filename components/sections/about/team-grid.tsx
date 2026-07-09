"use client";
import React from "react";
import { Users } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface AboutVariantProps {
  about: TemplateProps["content"]["about"];
  design_token?: DesignToken | null;
}

export default function AboutTeamGrid({ about: a }: AboutVariantProps) {
  const members = a.team_members || [];
  return (
    <section id="about" style={{ padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>{a.eyebrow || "Tim Kami"}</span>
        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{a.title}</h2>
        <p style={{ color: "var(--dt-text-muted)", maxWidth: "36rem", margin: "1rem auto 0", lineHeight: 1.7, whiteSpace: "pre-line" }}>{a.body}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
        {members.map((m, idx) => (
          <div key={idx} style={{ textAlign: "center", background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, borderRadius: "var(--dt-radius-lg)", padding: "2rem 1.25rem", transition: "transform 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; }}
          >
            {m.photo_url ? (
              <img src={m.photo_url} alt={m.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", margin: "0 auto 1rem" }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: `color-mix(in srgb, var(--dt-primary) 12%, var(--dt-bg))`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <Users style={{ width: 28, height: 28, color: "var(--dt-primary)" }} />
              </div>
            )}
            <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "1rem", margin: 0 }}>{m.name}</h3>
            <p style={{ color: "var(--dt-primary)", fontSize: "0.8rem", fontWeight: 600, margin: "0.25rem 0 0" }}>{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
