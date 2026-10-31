"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import type { HeroVariantProps } from "./types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, InlineImage } from "../../templates/shared";
import { safeHref, isExternalHref } from "@/lib/safe-url";

/**
 * Proof Bar — headline tegas + baris angka pencapaian dan jam buka.
 * ImageNeed: None. Cocok: jasa profesional, bengkel, klinik, kontraktor.
 */
export default function HeroProofBar({
  hero: h,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const isEN = language === "en";
  const common = {
    section: "hero" as const,
    onUpdateField,
    isEditorMode,
    isSelected,
    collapseSheetForInlineEdit,
  };
  const ctaHref = safeHref(h.cta_url);
  const ext = isExternalHref(h.cta_url);

  // Parsing identik dengan personal-billboard: stats → fallback badge_text "v|l,v|l".
  const rawStats = h.badge_text?.includes("|")
    ? h.badge_text.split(",").map((s) => {
        const [val, label] = s.split("|");
        return { value: val?.trim() ?? "", label: label?.trim() ?? "" };
      })
    : null;

  const statSource = h.stats && h.stats.length > 0 ? h.stats : rawStats;
  const stats = statSource
    ? statSource.map((s, i) => ({
        value: s?.value?.trim() && s.value !== "—" ? s.value : rawStats?.[i]?.value ?? "—",
        label: s?.label?.trim() ? s.label : rawStats?.[i]?.label ?? "",
      }))
    : [];

  const hasStats = rawStats !== null || (Array.isArray(h.stats) && h.stats.length > 0);
  const showStats = hasStats || Boolean(isEditorMode);
  // Keep a placeholder row editable in the editor when no stats exist yet.
  const displayStats = (stats.length > 0 ? stats : isEditorMode ? [{ value: "", label: "" }] : []).slice(0, 4);
  const hasImage = Boolean(h.image_url) || Boolean(isEditorMode);

  return (
    <section id="hero" style={{ background: h.background_color || "var(--dt-bg)", overflow: "hidden" }}>
      <div className="mx-auto px-6 py-16 lg:py-28" style={{ maxWidth: "1100px" }}>
        <div
          className={
            hasImage
              ? "flex flex-col gap-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14"
              : "flex flex-col"
          }
        >
          <div>
            {(h.eyebrow || isEditorMode) && (
              <InlineText
                {...common}
                fieldKey="eyebrow"
                value={h.eyebrow}
                placeholder={isEN ? "Short label" : "Label singkat"}
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--dt-primary)",
                  marginBottom: "1rem",
                }}
              />
            )}
            <InlineText
              {...common}
              fieldKey="headline"
              value={h.headline}
              as="h1"
              multiline
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              style={{
                fontFamily: "var(--dt-heading-font)",
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                lineHeight: 1.08,
                margin: 0,
                color: "var(--dt-text)",
              }}
            />
            <InlineText
              {...common}
              fieldKey="subheadline"
              value={h.subheadline}
              as="p"
              multiline
              style={{
                marginTop: "1.25rem",
                color: "var(--dt-text-muted)",
                lineHeight: 1.65,
                maxWidth: "52ch",
              }}
            />
            {(h.cta_text || isEditorMode) && (
              <a
                href={ctaHref}
                {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 font-semibold"
                style={{
                  background: "var(--dt-primary)",
                  color: "var(--dt-on-primary, #fff)",
                  borderRadius: "var(--dt-radius, 12px)",
                }}
              >
                <InlineText {...common} fieldKey="cta_text" value={h.cta_text} />
                <ArrowRight size={18} aria-hidden />
              </a>
            )}
          </div>

          {hasImage && (
            <div
              style={{
                position: "relative",
                aspectRatio: "4 / 3",
                overflow: "hidden",
                borderRadius: "var(--dt-radius-lg, var(--dt-radius, 16px))",
                background: "color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface, var(--dt-bg)))",
              }}
            >
              <InlineImage
                {...common}
                fieldKey="image_url"
                src={h.image_url}
                alt={h.headline || (isEN ? "Hero image" : "Gambar hero")}
                className="h-full w-full object-cover"
              />
              <PhotoCredit
                credit={h.image_credit}
              src={h.image_url}
                language={language}
                section="hero"
                fieldKey="image_credit.name"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                className="absolute bottom-2 right-3"
              />
            </div>
          )}
        </div>

        {showStats && (
          <dl
            className="mt-12 grid grid-cols-2 gap-6 border-t pt-8 lg:grid-cols-4"
            style={{ borderColor: "color-mix(in srgb, var(--dt-text) 14%, transparent)" }}
          >
            {displayStats.map((s, i) => (
              <div key={i}>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: "var(--dt-heading-font)",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    lineHeight: 1.1,
                    color: "var(--dt-primary)",
                  }}
                >
                  <InlineText
                    {...common}
                    fieldKey={`stats.${i}.value`}
                    value={s.value}
                    placeholder={isEN ? "Value" : "Nilai"}
                    as="span"
                  />
                </dd>
                <dt style={{ marginTop: "0.35rem", color: "var(--dt-text-muted)", fontSize: "0.9rem" }}>
                  <InlineText
                    {...common}
                    fieldKey={`stats.${i}.label`}
                    value={s.label}
                    placeholder={isEN ? "Label" : "Label"}
                    as="span"
                  />
                </dt>
              </div>
            ))}
          </dl>
        )}

        {(h.opening_hours || isEditorMode) && (
          <InlineText
            {...common}
            fieldKey="opening_hours"
            value={h.opening_hours}
            as="p"
            placeholder={isEN ? "Opening hours" : "Jam buka"}
            style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--dt-text-muted)" }}
          />
        )}
      </div>
    </section>
  );
}
