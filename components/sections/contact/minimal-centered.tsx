"use client";
import React from "react";
import { Mail, Phone } from "lucide-react";
import type { ContactVariantProps } from "./types";
import DynamicLeadForm from "./lead-form";

export default function MinimalCentered({ contact: c, onSubmitLead, leadSubmitting, leadSuccess, leadError }: ContactVariantProps) {
  const hasLeadForm = Boolean(c.show_lead_form && onSubmitLead);
  const displayPhone = c.phone || "+62 812-3456-7890";
  const displayEmail = c.email || "hello@domain.com";

  return (
    <section id="contact" style={{ padding: "var(--dt-spacing) 1.5rem", background: "color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" }}>
      <div style={{ maxWidth: "32rem", margin: "0 auto", textAlign: "center" }}>
        <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "9999px", background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)", marginBottom: "1rem" }}>
          Hubungi Kami
        </span>
        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)", fontSize: "clamp(1.25rem, 4.5cqw, 2rem)", color: "var(--dt-text)", margin: "0 0 0.5rem" } as any}>
          {c.title}
        </h2>
        <p style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", maxWidth: "24rem", margin: "0 auto 2rem", lineHeight: 1.6 }}>
          Punya pertanyaan, ide kolaborasi, atau hanya ingin menyapa? Kami akan segera membalasnya.
        </p>

        {hasLeadForm && (
          <div style={{ textAlign: "left", background: "var(--dt-surface)", padding: "2rem", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)" }}>
            <DynamicLeadForm onSubmit={onSubmitLead!} submitting={leadSubmitting} success={leadSuccess} error={leadError} />
          </div>
        )}

        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)", display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.75rem", color: "var(--dt-text-muted)" }}>
          <span><Mail style={{ width: 12, height: 12, display: "inline", marginRight: "0.25rem", verticalAlign: "middle" }} /> {displayEmail}</span>
          <span><Phone style={{ width: 12, height: 12, display: "inline", marginRight: "0.25rem", verticalAlign: "middle" }} /> {displayPhone}</span>
        </div>
      </div>
    </section>
  );
}
