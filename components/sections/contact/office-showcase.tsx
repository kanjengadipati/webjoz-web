"use client";
import React from "react";
import { Phone, Mail, MapPin, Clock, ArrowRight, Building2 } from "lucide-react";
import { InlineText, InlineImage } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";
import type { ContactVariantProps } from "./types";
import { contactStrings } from "./contact-strings";

const DEFAULT_OFFICE_PHOTO =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";

export default function ContactOfficeShowcase({
  contact: c,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
}: ContactVariantProps) {
  const L = contactStrings((language?.toLowerCase().startsWith("en") ? "en" : "id"));
  const alignVal = c.align || "left";
  const textAlignStyle: React.CSSProperties["textAlign"] =
    alignVal === "center" ? "center" : alignVal === "right" ? "right" : "left";

  const mapHref =
    c.maps_url ||
    (c.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`
      : "");

  return (
    <section
      id="contact"
      style={{
        padding: "var(--dt-spacing) 1.5rem",
        background: "color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))",
        borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
      }}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        style={{ maxWidth: "72rem", margin: "0 auto" }}
      >
        {/* Left Column: Office / Location Photo */}
        <div className="lg:col-span-6">
          <div
            className="relative w-full overflow-hidden shadow-md"
            style={{
              aspectRatio: "16 / 10",
              minHeight: "280px",
              borderRadius: "var(--dt-radius-lg)",
              background: "color-mix(in srgb, var(--dt-primary) 8%, var(--dt-surface))",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
            }}
          >
            <InlineImage
              section="contact"
              fieldKey="image_url"
              src={c.image_url || DEFAULT_OFFICE_PHOTO}
              alt={L.officePhotoAlt}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              className="w-full h-full object-cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
            {c.image_credit && (
              <div style={{ position: "absolute", bottom: 6, right: 10, zIndex: 20 }}>
                <PhotoCredit
                  credit={c.image_credit}
                  section="contact"
                  fieldKey="image_credit.name"
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact Details & Location CTA */}
        <div
          className="lg:col-span-6 flex flex-col"
          style={{
            textAlign: textAlignStyle,
            alignItems:
              alignVal === "center"
                ? "center"
                : alignVal === "right"
                  ? "flex-end"
                  : "flex-start",
          }}
        >
          <div className="mb-3">
            <InlineText
              section="contact"
              fieldKey="eyebrow"
              value={c.eyebrow || L.eyebrow}
              placeholder={L.eyebrow}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "9999px",
                background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                color: "var(--dt-primary)",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>

          <div className="w-full">
            <InlineText
              section="contact"
              fieldKey="title"
              value={c.title}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="h2"
              multiline
              style={{
                fontFamily: "var(--dt-heading-font)",
                fontWeight: "var(--dt-heading-weight)" as any,
                fontSize: "clamp(1.35rem, 4.5cqw, 2.15rem)",
                color: "var(--dt-text)",
                margin: "0 0 0.75rem 0",
                display: "block",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>

          {(c.subtitle || isEditorMode) && (
            <InlineText
              section="contact"
              fieldKey="subtitle"
              value={c.subtitle ?? ""}
              placeholder={L.subtitlePlaceholder}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              multiline
              style={{
                color: "var(--dt-text-muted)",
                fontSize: "0.925rem",
                lineHeight: 1.65,
                margin: "0 0 1.5rem 0",
                maxWidth: "34rem",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          )}

          {/* Contact Info List */}
          <div className="w-full flex flex-col gap-3.5 mb-6" style={{ textAlign: "left" }}>
            {(c.phone || isEditorMode) && (
              <div className="flex items-start gap-3">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                    color: "var(--dt-primary)",
                  }}
                >
                  <Phone className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider m-0"
                    style={{ color: "var(--dt-text-muted)" }}
                  >
                    {L.phoneLabel}
                  </p>
                  <InlineText
                    section="contact"
                    fieldKey="phone"
                    value={c.phone ?? ""}
                    placeholder={L.phonePlaceholder}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="p"
                    style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--dt-text)", margin: "0.1rem 0 0" }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </div>
              </div>
            )}

            {(c.email || isEditorMode) && (
              <div className="flex items-start gap-3">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                    color: "var(--dt-primary)",
                  }}
                >
                  <Mail className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider m-0"
                    style={{ color: "var(--dt-text-muted)" }}
                  >
                    {L.emailLabel}
                  </p>
                  <InlineText
                    section="contact"
                    fieldKey="email"
                    value={c.email ?? ""}
                    placeholder={L.emailPlaceholder}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="p"
                    style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--dt-text)", margin: "0.1rem 0 0" }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </div>
              </div>
            )}

            {(c.address || isEditorMode) && (
              <div className="flex items-start gap-3">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                    color: "var(--dt-primary)",
                  }}
                >
                  <MapPin className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider m-0"
                    style={{ color: "var(--dt-text-muted)" }}
                  >
                    {L.addressLabel}
                  </p>
                  <InlineText
                    section="contact"
                    fieldKey="address"
                    value={c.address ?? ""}
                    placeholder={L.addressPlaceholder}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="p"
                    multiline
                    style={{ fontSize: "0.9rem", color: "var(--dt-text)", margin: "0.1rem 0 0", lineHeight: 1.5 }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </div>
              </div>
            )}

            {(c.opening_hours || isEditorMode) && (
              <div className="flex items-start gap-3">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                    color: "var(--dt-primary)",
                  }}
                >
                  <Clock className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider m-0"
                    style={{ color: "var(--dt-text-muted)" }}
                  >
                    {L.hoursLabel}
                  </p>
                  <InlineText
                    section="contact"
                    fieldKey="opening_hours"
                    value={c.opening_hours ?? ""}
                    placeholder={L.hoursPlaceholder}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="p"
                    style={{ fontSize: "0.9rem", color: "var(--dt-text)", margin: "0.1rem 0 0" }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </div>
              </div>
            )}
          </div>

          {mapHref && (
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "var(--dt-primary)",
                color: "var(--dt-cta-text, #fff)",
                borderRadius: "var(--dt-radius)",
              }}
            >
              <span>{L.viewLocation}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
