"use client";
import React from "react";
import { Globe, MapPin, Phone, Mail } from "lucide-react";
import type { TemplateProps } from "../../templates/types";
import DynamicLeadForm from "./lead-form";

export default function ContactSectionInner({ contact: c, onSubmitLead, leadSubmitting, leadSuccess, leadError }: { contact: TemplateProps["content"]["contact"]; onSubmitLead?: TemplateProps["onSubmitLead"]; leadSubmitting?: boolean; leadSuccess?: boolean; leadError?: string | null }) {
  const hasLeadForm = Boolean(c.show_lead_form && onSubmitLead);
  const align = c.align || "center";
  const textAlign = align === "left" ? "left" : align === "right" ? "right" : "center";
  const alignItems = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
  const justifyContent = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;

  return (
    <section id="contact" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
      <div className={hasLeadForm ? "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" : ""} style={{ maxWidth: hasLeadForm ? "72rem" : "36rem", margin: "0 auto", textAlign }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: hasLeadForm ? "flex-start" : alignItems }}>
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.25rem, 4.5cqw, 2rem)", color: "var(--dt-text)", margin: 0 }}>{c.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              ...(c.address ? [{ icon: MapPin, text: c.address } as const] : []),
              ...(c.phone ? [{ icon: Phone, text: c.phone, href: `https://wa.me/${c.phone.replace(/\D/g, "")}` } as const] : []),
              ...(c.email ? [{ icon: Mail, text: c.email, href: `mailto:${c.email}` } as const] : []),
            ].map((item) => {
              const { icon: Icon, text, href } = item;
              const content = (
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: hasLeadForm ? "flex-start" : justifyContent, gap: "0.75rem" }}>
                  <Icon style={{ width: 18, height: 18, color: "var(--dt-primary)", marginTop: 2, flexShrink: 0 }} />
                  <span style={{ color: "var(--dt-text-muted)", fontSize: "0.9rem" }}>{text}</span>
                </div>
              );
              if (href) {
                return <a key={text} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{content}</a>;
              }
              return <div key={text}>{content}</div>;
            })}
          </div>
          {c.maps_url && (
            <a href={c.maps_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent, gap: "0.375rem", color: "var(--dt-primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
              <Globe style={{ width: 15, height: 15 }} /> Buka Google Maps
            </a>
          )}
        </div>
        {hasLeadForm && (
          <div style={{ background: "var(--dt-surface)", padding: "2rem", borderRadius: "var(--dt-radius-lg)", border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", marginBottom: "1.5rem", marginTop: 0 }}>Hubungi Kami</h3>
            <DynamicLeadForm onSubmit={onSubmitLead!} submitting={leadSubmitting} success={leadSuccess} error={leadError} />
          </div>
        )}
      </div>
    </section>
  );
}
