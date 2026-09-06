"use client";
import React from "react";
import { InlineText } from "../../templates/shared";
import DynamicLeadForm from "../contact/lead-form";
import type { CtaVariantProps } from "./index";

export default function CtaInlineLeadForm({
  cta,
  language,
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onSubmitLead,
  leadSubmitting,
  leadSuccess,
  leadError,
}: CtaVariantProps) {
  if (!cta) return null;
  const isEN = language === "en";

  return (
    <section
      id="cta"
      style={{
        padding: "var(--dt-spacing) 1.5rem",
        background: "color-mix(in srgb, var(--dt-primary) 6%, var(--dt-bg))",
      }}
    >
      <div className="grid md:grid-cols-2 gap-10 items-center" style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <div>
          {(cta.eyebrow || isEditorMode) && (
            <span
              style={{
                display: "inline-block", fontSize: "0.75rem", fontWeight: 800,
                textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--dt-primary)", marginBottom: "0.75rem",
              }}
            >
              {isEditorMode ? (
                <InlineText
                  section="cta" fieldKey="eyebrow" value={cta.eyebrow || ""}
                  onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : cta.eyebrow}
            </span>
          )}
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.75rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginBottom: "0.75rem" }}>
            {isEditorMode ? (
              <InlineText
                section="cta" fieldKey="headline" value={cta.headline}
                onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} multiline
                collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : cta.headline}
          </h2>
          {(cta.subheadline || isEditorMode) && (
            <p style={{ color: "color-mix(in srgb, var(--dt-text) 70%, transparent)", fontSize: "1rem", marginBottom: "1rem" }}>
              {isEditorMode ? (
                <InlineText
                  section="cta" fieldKey="subheadline" value={cta.subheadline || ""}
                  onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : cta.subheadline}
            </p>
          )}
          {(cta.trust_signal || isEditorMode) && (
            <p style={{ color: "color-mix(in srgb, var(--dt-text) 55%, transparent)", fontSize: "0.8rem" }}>
              {isEditorMode ? (
                <InlineText
                  section="cta" fieldKey="trust_signal" value={cta.trust_signal || ""}
                  onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : cta.trust_signal}
            </p>
          )}
        </div>

        <div style={{ background: "var(--dt-surface)", borderRadius: "var(--dt-radius-lg)", padding: "2rem", boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}>
          <DynamicLeadForm
            buttonText={cta.button_text}
            sectionKey="cta"
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
      </div>
    </section>
  );
}