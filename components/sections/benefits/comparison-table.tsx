"use client";
import React from "react";
import { ArrowRight, Check, X } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface BenefitsVariantProps {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
}

export default function BenefitsComparisonTable({ benefits: b }: BenefitsVariantProps) {
  const comp = b.comparison;
  const rows = comp?.rows || [];
  return (
    <section id="benefits" style={{ padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`, borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Perbandingan</span>
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{b.title}</h2>
          {b.subtitle && <p style={{ color: "var(--dt-text-muted)", maxWidth: "36rem", margin: "0.75rem auto 0", lineHeight: 1.6 }}>{b.subtitle}</p>}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "var(--dt-radius-lg)", overflow: "hidden", border: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
            <thead>
              <tr style={{ background: `color-mix(in srgb, var(--dt-primary) 8%, transparent)` }}>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", color: "var(--dt-text)", fontWeight: 700, fontSize: "0.85rem", borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}></th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "center", color: "var(--dt-primary)", fontWeight: 800, fontSize: "0.9rem", borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>{comp?.column_a_label || "Kami"}</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "center", color: "var(--dt-text-muted)", fontWeight: 600, fontSize: "0.85rem", borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>{comp?.column_b_label || "Lainnya"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx < rows.length - 1 ? `1px solid color-mix(in srgb, var(--dt-primary) 8%, transparent)` : "none", background: idx % 2 === 0 ? "transparent" : "color-mix(in srgb, var(--dt-primary) 3%, transparent)" }}>
                  <td style={{ padding: "0.85rem 1.25rem", color: "var(--dt-text)", fontWeight: 600, fontSize: "0.85rem" }}>{row.label}</td>
                  <td style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>
                    {row.value_a === "true" || row.value_a === "✓" ? <Check style={{ width: 18, height: 18, color: "var(--dt-primary)", margin: "0 auto" }} />
                    : row.value_a === "false" || row.value_a === "✗" ? <X style={{ width: 18, height: 18, color: "var(--dt-text-muted)", margin: "0 auto" }} />
                    : <span style={{ color: "var(--dt-primary)", fontWeight: 600, fontSize: "0.85rem" }}>{row.value_a}</span>}
                  </td>
                  <td style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>
                    {row.value_b === "true" || row.value_b === "✓" ? <Check style={{ width: 18, height: 18, color: "var(--dt-text-muted)", margin: "0 auto" }} />
                    : row.value_b === "false" || row.value_b === "✗" ? <X style={{ width: 18, height: 18, color: "#ef4444", margin: "0 auto" }} />
                    : <span style={{ color: "var(--dt-text-muted)", fontSize: "0.85rem" }}>{row.value_b}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
