"use client";
import React from "react";
import { MapPin, Mail, Navigation } from "lucide-react";
import type { ContactVariantProps } from "./types";
import DynamicLeadForm from "./lead-form";
import LeafletMap from "./leaflet-map";
import { InlineText } from "../../templates/shared";

export default function DarkSplit({ contact: c, onSubmitLead, leadSubmitting, leadSuccess, leadError, language = "id", onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: ContactVariantProps) {
  const isEN = language === "en";
  const hasLeadForm = Boolean(c.show_lead_form && onSubmitLead);
  const showMap = c.show_map !== false;
  const displayAddress = c.address || "Jl. Malioboro No. 123, Yogyakarta, Indonesia";
  const displayEmail = c.email || "hello@domain.com";

  return (
    <section id="contact" className="relative overflow-hidden" style={{ padding: "var(--dt-spacing) 1.5rem", background: "color-mix(in srgb, var(--dt-bg) 98%, #000)", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, color-mix(in srgb, var(--dt-primary) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--dt-primary) 6%, transparent) 1px, transparent 1px)", backgroundSize: "20px 20px", opacity: 0.4 }} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="lg:col-span-5" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "9999px", background: "color-mix(in srgb, var(--dt-primary) 15%, transparent)", color: "var(--dt-primary)", border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)" }}>
                Tech Dark Split
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#10b981", fontSize: "0.6rem", fontWeight: 700 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                {isEN ? "System Active" : "Sistem Aktif"}
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)", fontSize: "clamp(1.25rem, 4.5cqw, 2rem)", color: "var(--dt-text)", margin: "0 0 0.75rem" } as any}>
              <InlineText section="contact" fieldKey="title" value={c.title ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            </h2>
            <InlineText section="contact" fieldKey="subtitle" value={c.subtitle || (isEN ? "Use this portal to send inquiries, reports, or collaboration discussions." : "Gunakan portal ini untuk mengirimkan pertanyaan, laporan, atau diskusi kerjasama.")} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" multiline style={{ color: "var(--dt-text-muted)", fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1.5rem" } as any} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
          </div>

          {showMap && (
            <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)", height: "11rem", position: "relative" }}>
              <LeafletMap tileStyle={c.map_tile_style} invertTiles opacity={0.6} style={{ height: "100%" }} />
              <a href={`https://maps.google.com/?q=${encodeURIComponent(c.address || "Monas, Jakarta, Indonesia")}`} target="_blank" rel="noopener noreferrer"
                style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", padding: "0.375rem 0.75rem", borderRadius: "0.5rem", background: "color-mix(in srgb, var(--dt-bg) 95%, transparent)", border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)", color: "var(--dt-text-muted)", textDecoration: "none", fontSize: "0.6rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Navigation style={{ width: 12, height: 12 }} /> Maps
              </a>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <div style={{ padding: "0.5rem", borderRadius: "0.5rem", background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPin style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-text-muted)", margin: 0 }}>{isEN ? "Physical HQ" : "Markas Fisik"}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--dt-text)", margin: "0.125rem 0 0" }}>
                  <InlineText section="contact" fieldKey="address" value={displayAddress ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <div style={{ padding: "0.5rem", borderRadius: "0.5rem", background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-text-muted)", margin: 0 }}>Email</p>
                <p style={{ fontSize: "0.8rem", color: "var(--dt-text)", margin: "0.125rem 0 0" }}>
                  <InlineText section="contact" fieldKey="email" value={displayEmail ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {hasLeadForm && (
            <div style={{ background: "color-mix(in srgb, var(--dt-primary) 4%, var(--dt-surface))", padding: "2rem", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)" }}>
              <DynamicLeadForm
                buttonText={c.button_text}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                onSubmit={onSubmitLead!}
                submitting={leadSubmitting}
                success={leadSuccess}
                error={leadError}
                language={language}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
