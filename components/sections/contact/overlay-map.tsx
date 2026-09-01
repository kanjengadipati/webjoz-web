"use client";
import React from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import type { ContactVariantProps } from "./types";
import DynamicLeadForm from "./lead-form";
import LeafletMap from "./leaflet-map";
import { InlineText } from "../../templates/shared";

function mapsDirUrl(c: ContactVariantProps["contact"]): string {
  const addr = c.address || "Monas, Jakarta, Indonesia";
  return `https://maps.google.com/?q=${encodeURIComponent(addr)}`;
}

export default function OverlayMap({ contact: c, onSubmitLead, leadSubmitting, leadSuccess, leadError, language = "id", onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: ContactVariantProps) {
  const isEN = language === "en";
  const hasLeadForm = Boolean(c.show_lead_form && onSubmitLead);
  const showMap = c.show_map !== false;
  const displayAddress = c.address || "Jl. Malioboro No. 123, Yogyakarta, Indonesia";
  const displayPhone = c.phone || "+62 812-3456-7890";
  const displayEmail = c.email || "hello@domain.com";

  return (
    <section id="contact" className="relative w-full overflow-hidden" style={{ minHeight: "580px", background: "color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))", borderRadius: "var(--dt-radius-lg)", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" }}>
      {showMap && (
        <div className="absolute inset-0 w-full h-full z-0">
          <LeafletMap tileStyle={c.map_tile_style} filter="grayscale(1)" opacity={0.7} style={{ height: "100%" }} />
        </div>
      )}

      <div className="absolute top-4 left-4 z-10" style={{ display: "none" }}>
        <div className="flex items-center gap-2" style={{ background: "var(--dt-surface)", padding: "0.5rem 1rem", borderRadius: "0.75rem", border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)" }}>
          <MapPin style={{ width: 16, height: 16, color: "var(--dt-primary)" }} />
          <div>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--dt-text)", margin: 0 }}>{isEN ? "Location" : "Lokasi"}</p>
            <p style={{ fontSize: "0.7rem", color: "var(--dt-text-muted)", margin: 0 }}>
              <InlineText section="contact" fieldKey="address" value={displayAddress ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", minHeight: "580px", padding: "1.5rem" }}>
        {hasLeadForm && (
          <div style={{ width: "100%", maxWidth: "420px", background: "color-mix(in srgb, var(--dt-surface) 92%, transparent)", backdropFilter: "blur(12px)", padding: "1.5rem 2rem", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" }}>
            <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "9999px", background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)", marginBottom: "0.75rem" }}>
              {isEN ? "Overlay Map" : "Peta Overlay"}
            </span>
            <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)", fontSize: "1.25rem", color: "var(--dt-text)", margin: "0 0 0.25rem" } as any}>
              <InlineText section="contact" fieldKey="title" value={c.title ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            </h2>
            <InlineText section="contact" fieldKey="subtitle" value={c.subtitle || (isEN ? "Need a quote or partnership info? Fill in the form, the map shows our office location." : "Butuh penawaran atau info kerja sama? Isi formulir di bawah, peta di latar menunjukkan lokasi kantor kami.")} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" multiline style={{ fontSize: "0.75rem", color: "var(--dt-text-muted)", marginBottom: "1.25rem", lineHeight: 1.5 } as any} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            <DynamicLeadForm onSubmit={onSubmitLead!} submitting={leadSubmitting} success={leadSuccess} error={leadError} language={language} />
            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.7rem", color: "var(--dt-text-muted)" }}>
              <div>
                <p style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: "0.1em", margin: "0 0 0.125rem", color: "var(--dt-text-muted)" }}>{isEN ? "Phone" : "Telepon"}</p>
                <p style={{ margin: 0 }}><InlineText section="contact" fieldKey="phone" value={displayPhone ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
              </div>
              <div>
                <p style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: "0.1em", margin: "0 0 0.125rem", color: "var(--dt-text-muted)" }}>Email</p>
                <p style={{ margin: 0 }}><InlineText section="contact" fieldKey="email" value={displayEmail ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
              </div>
            </div>
            <a href={mapsDirUrl(c)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--dt-primary)", textDecoration: "none", fontSize: "0.7rem", fontWeight: 600, marginTop: "0.75rem" }}>
              <Navigation style={{ width: 12, height: 12 }} /> {isEN ? "Open Navigation" : "Buka Navigasi"} <ExternalLink style={{ width: 10, height: 10 }} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
