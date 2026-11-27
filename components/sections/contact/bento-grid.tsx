"use client";
import React from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import type { ContactVariantProps } from "./types";
import DynamicLeadForm from "./lead-form";
import InlineMapPicker from "./inline-map-picker";
import { InlineText } from "../../templates/shared";
import { contactStrings } from "./contact-strings";

function mapsDirUrl(c: ContactVariantProps["contact"]): string {
  if (!c.address) return "";
  return `https://maps.google.com/?q=${encodeURIComponent(c.address)}`;
}

export default function BentoGrid({
  contact: c,
  footer,
  onSubmitLead,
  leadSubmitting,
  leadSuccess,
  leadError,
  language = "id",
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: ContactVariantProps) {
  const str = contactStrings(language);
  const hasLeadForm = c.show_lead_form !== false;
  const showMap = c.show_map !== false;
  const socialLinks = footer?.social_links ?? [];
  const hasHours = Boolean(c.opening_hours?.trim() || isEditorMode);
  const hasSocial = socialLinks.length > 0;
  const hasBlock4 = hasHours || hasSocial;

  const handlePickLocation = onUpdateField
    ? (url: string, tileStyle: string) => {
        onUpdateField("contact", "maps_url", url);
        onUpdateField("contact", "map_tile_style", tileStyle);
      }
    : undefined;

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
    <section
      id="contact"
      style={{
        padding: "var(--dt-spacing) 1.5rem",
        background: "color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))",
        borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4"
        style={{ maxWidth: "72rem", margin: "0 auto" }}
      >
        {/* Block 1: Title + Contact Info */}
        <div
          className={showMap ? "lg:col-span-5" : "lg:col-span-12"}
          style={{
            background: "var(--dt-surface)",
            padding: "1.5rem 2rem",
            borderRadius: "var(--dt-radius-lg)",
            border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {(c.eyebrow || isEditorMode) && (
              <div style={{ marginBottom: "0.75rem" }}>
                <InlineText
                  section="contact"
                  fieldKey="eyebrow"
                  value={c.eyebrow ?? ""}
                  placeholder={str.eyebrow}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  style={{
                    display: "inline-block",
                    padding: "0.2rem 0.6rem",
                    fontSize: "0.6rem",
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
            )}
            <h2
              style={
                {
                  fontFamily: "var(--dt-heading-font)",
                  fontWeight: "var(--dt-heading-weight)",
                  fontSize: "clamp(1.25rem, 4cqw, 1.75rem)",
                  color: "var(--dt-text)",
                  margin: "0 0 0.5rem",
                } as any
              }
            >
              <InlineText
                section="contact"
                fieldKey="title"
                value={c.title ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </h2>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--dt-text-muted)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              <InlineText
                section="contact"
                fieldKey="subtitle"
                value={c.subtitle ?? ""}
                placeholder={str.subtitlePlaceholder}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </p>
          </div>
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              fontSize: "0.8rem",
            }}
          >
            {(c.email || isEditorMode) && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={iconBox}>
                  <Mail style={{ width: 14, height: 14 }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--dt-text-muted)",
                      margin: 0,
                    }}
                  >
                    {str.emailLabel}
                  </p>
                  <p style={{ fontWeight: 500, color: "var(--dt-text)", margin: 0 }}>
                    <InlineText
                      section="contact"
                      fieldKey="email"
                      value={c.email ?? ""}
                      placeholder={str.emailPlaceholder}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </p>
                </div>
              </div>
            )}
            {(c.phone || isEditorMode) && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={iconBox}>
                  <Phone style={{ width: 14, height: 14 }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--dt-text-muted)",
                      margin: 0,
                    }}
                  >
                    {str.phoneLabel}
                  </p>
                  <p style={{ fontWeight: 500, color: "var(--dt-text)", margin: 0 }}>
                    <InlineText
                      section="contact"
                      fieldKey="phone"
                      value={c.phone ?? ""}
                      placeholder={str.phonePlaceholder}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Block 2: Map */}
        {showMap && (
          <div
            className="lg:col-span-7"
            style={{
              borderRadius: "var(--dt-radius-lg)",
              overflow: "hidden",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
              minHeight: "220px",
              position: "relative",
            }}
          >
            <InlineMapPicker
              mapsUrl={c.maps_url}
              tileStyle={c.map_tile_style}
              filter="grayscale(1)"
              opacity={0.8}
              style={{ minHeight: "220px" }}
              isEditorMode={isEditorMode}
              onPickLocation={handlePickLocation}
              language={language}
            />
            <div
              style={{
                position: "absolute",
                bottom: "0.75rem",
                left: "0.75rem",
                right: "0.75rem",
                background: "color-mix(in srgb, var(--dt-surface) 95%, transparent)",
                backdropFilter: "blur(8px)",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                <MapPin style={{ width: 16, height: 16, color: "var(--dt-primary)", flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--dt-text-muted)",
                      margin: 0,
                    }}
                  >
                    {str.addressLabel}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--dt-text)",
                      fontWeight: 500,
                      margin: "0.125rem 0 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <InlineText
                      section="contact"
                      fieldKey="address"
                      value={c.address ?? ""}
                      placeholder={str.addressPlaceholder}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      multiline
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </p>
                </div>
              </div>
              <a
                href={mapsDirUrl(c)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "0.375rem",
                  borderRadius: "0.5rem",
                  background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)",
                  color: "var(--dt-primary)",
                  flexShrink: 0,
                }}
              >
                <ExternalLink style={{ width: 14, height: 14 }} />
              </a>
            </div>
          </div>
        )}

        {/* Block 3: Form */}
        {hasLeadForm && (
          <div
            className={hasBlock4 ? "lg:col-span-8" : "lg:col-span-12"}
            style={{
              background: "color-mix(in srgb, var(--dt-primary) 3%, var(--dt-surface))",
              padding: "1.5rem 2rem",
              borderRadius: "var(--dt-radius-lg)",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)",
            }}
          >
            <DynamicLeadForm
              buttonText={c.button_text}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              onSubmit={onSubmitLead}
              submitting={leadSubmitting}
              success={leadSuccess}
              error={leadError}
              language={language}
            />
          </div>
        )}

        {/* Block 4: Hours + Social */}
        {hasBlock4 && (
          <div
            className={hasLeadForm ? "lg:col-span-4" : "lg:col-span-12"}
            style={{
              background: "var(--dt-surface)",
              padding: "1.5rem 2rem",
              borderRadius: "var(--dt-radius-lg)",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {hasHours && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Clock style={{ width: 14, height: 14, color: "var(--dt-text-muted)" }} />
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--dt-text-muted)",
                      }}
                    >
                      {str.hoursLabel}
                    </span>
                  </div>
                  <InlineText
                    section="contact"
                    fieldKey="opening_hours"
                    value={c.opening_hours ?? ""}
                    placeholder={str.hoursPlaceholder}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="p"
                    multiline
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--dt-text)",
                      whiteSpace: "pre-line",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </>
              )}
            </div>
            {hasSocial && (
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--dt-text-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {str.socialMediaLabel}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {socialLinks.map((s, si) => (
                    <a
                      key={`${s.platform}-${si}`}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.7rem",
                        background: "color-mix(in srgb, var(--dt-primary) 6%, transparent)",
                        color: "var(--dt-text-muted)",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      <InlineText
                        section="footer"
                        fieldKey={"social_links." + si + ".platform"}
                        value={s.platform ?? ""}
                        placeholder="Instagram"
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                        as="span"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
