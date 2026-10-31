"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText } from "../../templates/shared";
import InlineMapPicker from "../contact/inline-map-picker";
import { safeHref, isExternalHref } from "@/lib/safe-url";

/**
 * Location Map — split hero with a live map driven by the contact section.
 * Reuses contact.maps_url, contact.address and contact.map_tile_style so the
 * hero and contact map can never point at different places.
 * ImageNeed: None.
 */
export default function HeroLocationMap({
  hero: h,
  contact: c,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const isEN = language === "en";
  const reduce = useReducedMotion();
  const ctaHref = safeHref(h.cta_url);
  const ext = isExternalHref(h.cta_url);
  const defaultCta = isEN ? "Contact Us" : "Hubungi Kami";
  const common = {
    section: "hero" as const,
    onUpdateField,
    isEditorMode,
    isSelected,
    collapseSheetForInlineEdit,
  };

  const showMap = c?.show_map !== false;
  const hasLocation = Boolean(c?.maps_url?.trim()) || Boolean(c?.address?.trim());
  const canRenderMap = Boolean(showMap && (c?.maps_url?.trim() || isEditorMode));
  const mapsHref = c?.maps_url?.trim()
    ? safeHref(c.maps_url, "#contact")
    : c?.address?.trim()
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`
      : "#contact";
  const mapsExt = isExternalHref(mapsHref);

  const handlePickLocation = onUpdateField
    ? (url: string, tileStyle: string) => {
        onUpdateField("contact", "maps_url", url);
        onUpdateField("contact", "map_tile_style", tileStyle);
      }
    : undefined;

  const infoItems = [
    { key: "address", icon: MapPin, value: c?.address, placeholder: isEN ? "Add address..." : "Tambah alamat..." },
    { key: "phone", icon: Phone, value: c?.phone, placeholder: isEN ? "Add phone or WhatsApp..." : "Tambah telepon / WA..." },
    { key: "email", icon: Mail, value: c?.email, placeholder: isEN ? "Add email address..." : "Tambah alamat email..." },
    { key: "opening_hours", icon: Clock, value: c?.opening_hours, placeholder: isEN ? "Add opening hours..." : "Tambah jam buka..." },
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-5 sm:px-8 md:px-12 py-16 md:py-20"
      style={{ background: "var(--dt-bg)" }}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* ── Left: copy + contact facts ──────────────────────────────── */}
        <div>
          {(h.eyebrow || isEditorMode) && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{
                background: "color-mix(in srgb, var(--dt-primary) 13%, transparent)",
                color: "var(--dt-primary)",
              }}
            >
              <MapPin className="size-3.5" aria-hidden />
              <InlineText {...common} fieldKey="eyebrow" value={h.eyebrow} placeholder={isEN ? "Short label" : "Label singkat"} as="span" />
            </motion.div>
          )}

          <InlineText
            {...common}
            fieldKey="headline"
            value={h.headline}
            as="h1"
            multiline
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight, 700)" as React.CSSProperties["fontWeight"],
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              lineHeight: 1.13,
              letterSpacing: "-0.02em",
              color: "var(--dt-text)",
              margin: 0,
            }}
          />

          <InlineText
            {...common}
            fieldKey="subheadline"
            value={h.subheadline}
            as="p"
            multiline
            style={{
              marginTop: "1rem",
              maxWidth: "34rem",
              color: "var(--dt-text-muted)",
              lineHeight: 1.7,
              fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
            }}
          />

          <div className="mt-7 space-y-3">
            {infoItems.map(({ key, icon: Icon, value, placeholder }) => {
              if (!value?.trim() && !isEditorMode) return null;
              return (
                <div key={key} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--dt-text-muted)" }}>
                  <span
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "color-mix(in srgb, var(--dt-primary) 13%, transparent)", color: "var(--dt-primary)" }}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <InlineText
                    section="contact"
                    fieldKey={key}
                    value={value || ""}
                    placeholder={placeholder}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    multiline={key === "address"}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {(h.cta_text || isEditorMode) && (
              <a
                href={ctaHref}
                {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold no-underline transition-transform hover:scale-[1.02]"
                style={{
                  background: "var(--dt-primary)",
                  color: "var(--dt-on-primary, #FFFFFF)",
                  borderRadius: "var(--dt-radius, 12px)",
                }}
              >
                <InlineText {...common} fieldKey="cta_text" value={h.cta_text || defaultCta} as="span" />
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
            )}

            {hasLocation && (
              <a
                href={mapsHref}
                {...(mapsExt ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold no-underline"
                style={{
                  color: "var(--dt-text)",
                  border: "1px solid color-mix(in srgb, var(--dt-text) 18%, transparent)",
                  borderRadius: "var(--dt-radius, 12px)",
                }}
              >
                <Navigation className="size-4" aria-hidden />
                {isEN ? "Get directions" : "Rute ke lokasi"}
              </a>
            )}
          </div>
        </div>

        {/* ── Right: live map ─────────────────────────────────────────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.1 }}
          className="relative h-[320px] w-full overflow-hidden sm:h-[400px] lg:h-[480px]"
          style={{
            borderRadius: "calc(var(--dt-radius, 12px) * 1.4)",
            border: "1px solid color-mix(in srgb, var(--dt-primary) 16%, transparent)",
            background: "color-mix(in srgb, var(--dt-primary) 6%, var(--dt-surface, var(--dt-bg)))",
            boxShadow: "0 24px 60px -24px color-mix(in srgb, var(--dt-text) 30%, transparent)",
          }}
        >
          {canRenderMap ? (
            <InlineMapPicker
              mapsUrl={c?.maps_url}
              tileStyle={c?.map_tile_style}
              style={{ height: "100%", width: "100%" }}
              isEditorMode={isEditorMode}
              onPickLocation={handlePickLocation}
              language={isEN ? "en" : "id"}
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center">
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(color-mix(in srgb, var(--dt-primary) 14%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--dt-primary) 14%, transparent) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />
              <div
                className="relative flex flex-col items-center gap-2 rounded-2xl px-5 py-4"
                style={{
                  background: "var(--dt-surface, var(--dt-bg))",
                  border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
                }}
              >
                <MapPin className="size-6" style={{ color: "var(--dt-primary)" }} aria-hidden />
                {(c?.address?.trim() || isEditorMode) && (
                  <InlineText
                    section="contact"
                    fieldKey="address"
                    value={c?.address || ""}
                    placeholder={isEN ? "Add address..." : "Tambah alamat..."}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    multiline
                    style={{ color: "var(--dt-text)", fontSize: "0.8rem", maxWidth: "16rem", textAlign: "center" }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                )}
              </div>
            </div>
          )}

          {/* Floating location chip over the map */}
          {canRenderMap && (c?.address?.trim() || isEditorMode) && (
            <div
              className="pointer-events-none absolute left-3 top-3 z-20 max-w-[75%] rounded-xl px-3 py-2 backdrop-blur-md"
              style={{
                background: "color-mix(in srgb, var(--dt-surface, #FFFFFF) 92%, transparent)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 16%, transparent)",
                boxShadow: "0 8px 20px -8px rgba(0,0,0,0.25)",
              }}
            >
              <span className="mb-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--dt-primary)" }}>
                <MapPin className="size-3" aria-hidden />
                {isEN ? "Our location" : "Lokasi kami"}
              </span>
              <InlineText
                section="contact"
                fieldKey="address"
                value={c?.address || ""}
                placeholder={isEN ? "Add address..." : "Tambah alamat..."}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                multiline
                style={{ display: "block", color: "var(--dt-text)", fontSize: "0.72rem", lineHeight: 1.4 }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
