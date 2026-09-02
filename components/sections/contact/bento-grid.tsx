"use client";
import React from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink, Globe } from "lucide-react";
import type { ContactVariantProps } from "./types";
import DynamicLeadForm from "./lead-form";
import LeafletMap from "./leaflet-map";
import { InlineText } from "../../templates/shared";

function mapsDirUrl(c: ContactVariantProps["contact"]): string {
  const addr = c.address || "Monas, Jakarta, Indonesia";
  return `https://maps.google.com/?q=${encodeURIComponent(addr)}`;
}

export default function BentoGrid({ contact: c, footer, onSubmitLead, leadSubmitting, leadSuccess, leadError, language = "id", onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: ContactVariantProps) {
  const isEN = language === "en";
  const hasLeadForm = Boolean(c.show_lead_form && onSubmitLead);
  const showMap = c.show_map !== false;
  const displayAddress = c.address || "Jl. Malioboro No. 123, Yogyakarta, Indonesia";
  const displayPhone = c.phone || "+62 812-3456-7890";
  const displayEmail = c.email || "hello@domain.com";
  const socialLinks = footer?.social_links ?? [];

  const iconBox: React.CSSProperties = {
    padding: "0.5rem",
    borderRadius: "0.5rem",
    background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
    color: "var(--dt-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <section id="contact" style={{ padding: "var(--dt-spacing) 1.5rem", background: "color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4" style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Block 1: Title + Contact Info */}
        <div className="lg:col-span-5" style={{ background: "var(--dt-surface)", padding: "1.5rem 2rem", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "9999px", background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)", marginBottom: "0.75rem" }}>
              Bento Grid
            </span>
            <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)", fontSize: "clamp(1.25rem, 4cqw, 1.75rem)", color: "var(--dt-text)", margin: "0 0 0.5rem" } as any}>
              <InlineText section="contact" fieldKey="title" value={c.title ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--dt-text-muted)", lineHeight: 1.5, margin: 0 }}>
              Portal kontak interaktif. <InlineText section="contact" fieldKey="subtitle" value={c.subtitle || (isEN ? "Send a message, see location, and access important contacts." : "Kirim pesan, lihat lokasi, dan akses kontak penting.")} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            </p>
          </div>
          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={iconBox}><Mail style={{ width: 14, height: 14 }} /></div>
              <div>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", margin: 0 }}>Email Utama</p>
                <p style={{ fontWeight: 500, color: "var(--dt-text)", margin: 0 }}><InlineText section="contact" fieldKey="email" value={displayEmail ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={iconBox}><Phone style={{ width: 14, height: 14 }} /></div>
              <div>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", margin: 0 }}>{isEN ? "Phone" : "Telepon"}</p>
                <p style={{ fontWeight: 500, color: "var(--dt-text)", margin: 0 }}><InlineText section="contact" fieldKey="phone" value={displayPhone ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
              </div>
            </div>
          </div>
        </div>

        {/* Block 2: Map */}
        {showMap && (
          <div className="lg:col-span-7" style={{ borderRadius: "var(--dt-radius-lg)", overflow: "hidden", border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)", minHeight: "220px", position: "relative" }}>
            <LeafletMap tileStyle={c.map_tile_style} filter="grayscale(1)" opacity={0.8} style={{ minHeight: "220px" }} />
            <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", right: "0.75rem", background: "color-mix(in srgb, var(--dt-surface) 95%, transparent)", backdropFilter: "blur(8px)", padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                <MapPin style={{ width: 16, height: 16, color: "var(--dt-primary)", flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", margin: 0 }}>{isEN ? "Address" : "Alamat"}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--dt-text)", fontWeight: 500, margin: "0.125rem 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <InlineText section="contact" fieldKey="address" value={displayAddress ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                  </p>
                </div>
              </div>
              <a href={mapsDirUrl(c)} target="_blank" rel="noopener noreferrer" style={{ padding: "0.375rem", borderRadius: "0.5rem", background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", color: "var(--dt-primary)", flexShrink: 0 }}>
                <ExternalLink style={{ width: 14, height: 14 }} />
              </a>
            </div>
          </div>
        )}

        {/* Block 3: Form */}
        <div className="lg:col-span-8" style={{ background: "color-mix(in srgb, var(--dt-primary) 3%, var(--dt-surface))", padding: "1.5rem 2rem", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)" }}>
          {hasLeadForm && (
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
          )}
        </div>

        {/* Block 4: Hours + Social */}
        <div className="lg:col-span-4" style={{ background: "var(--dt-surface)", padding: "1.5rem 2rem", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "1rem" }}>
              <Clock style={{ width: 14, height: 14, color: "var(--dt-text-muted)" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)" }}>{isEN ? "Operating Hours" : "Jam Operasional"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem" }}>
              {(isEN ? [
                { day: "Monday - Friday", hours: "09:00 - 17:00" },
                { day: "Saturday", hours: "09:00 - 13:00" },
                { day: "Sunday / Holiday", hours: "Closed", closed: true },
              ] : [
                { day: "Senin - Jumat", hours: "09:00 - 17:00" },
                { day: "Sabtu", hours: "09:00 - 13:00" },
                { day: "Minggu / Libur", hours: "Tutup", closed: true },
              ]).map((row) => (
                <div key={row.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: !row.closed ? "1px solid color-mix(in srgb, var(--dt-primary) 8%, transparent)" : "none", paddingBottom: row.closed ? 0 : "0.375rem" }}>
                  <span style={{ color: "var(--dt-text-muted)", fontWeight: 600 }}>{row.day}</span>
                  <span style={{ color: row.closed ? "#ef4444" : "var(--dt-text)", fontWeight: 500 }}>{row.hours}</span>
                </div>
              ))}
            </div>
          </div>
          {socialLinks.length > 0 && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)" }}>
              <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginBottom: "0.5rem" }}>{isEN ? "Social Media" : "Sosial Media"}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                {socialLinks.map((s) => (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" style={{ padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.7rem", background: "color-mix(in srgb, var(--dt-primary) 6%, transparent)", color: "var(--dt-text-muted)", textDecoration: "none", fontWeight: 500 }}>
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
