"use client";
import React from "react";
import { Mail, Phone } from "lucide-react";
import type { ContactVariantProps } from "./types";
import DynamicLeadForm from "./lead-form";
import { InlineText } from "../../templates/shared";

export default function MinimalCentered({
  contact: c,
  onSubmitLead,
  leadSubmitting,
  leadSuccess,
  leadError,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
}: ContactVariantProps) {
  const isEN = language === "en";
  const hasLeadForm = Boolean(c.show_lead_form && onSubmitLead);
  const displayPhone = c.phone || "+62 812-3456-7890";
  const displayEmail = c.email || "hello@domain.com";

  return (
    <section id="contact" style={{ padding: "var(--dt-spacing) 1.5rem", background: "color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" }}>
      <div style={{ maxWidth: "32rem", margin: "0 auto", textAlign: "center" }}>
        <InlineText
          section="contact"
          fieldKey="eyebrow"
          value={c.eyebrow || (isEN ? "Contact Us" : "Hubungi Kami")}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          as="span"
          style={{ display: "inline-block", padding: "0.25rem 0.75rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "9999px", background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)", marginBottom: "1rem" }}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
        <InlineText
          section="contact"
          fieldKey="title"
          value={c.title ?? ""}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          as="h2"
          style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)", fontSize: "clamp(1.25rem, 4.5cqw, 2rem)", color: "var(--dt-text)", margin: "0 0 0.5rem" } as any}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
        <InlineText section="contact" fieldKey="subtitle" value={c.subtitle || (isEN ? "Have a question, idea, or just want to say hello? We'll get back to you shortly." : "Punya pertanyaan, ide kolaborasi, atau hanya ingin menyapa? Kami akan segera membalasnya.")} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" multiline style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", maxWidth: "24rem", margin: "0 auto 2rem", lineHeight: 1.6 } as any} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />

        {hasLeadForm && (
          <div style={{ textAlign: "left", background: "var(--dt-surface)", padding: "2rem", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)" }}>
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

        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)", display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.75rem", color: "var(--dt-text-muted)" }}>
          <span><Mail style={{ width: 12, height: 12, display: "inline", marginRight: "0.25rem", verticalAlign: "middle" }} /> <InlineText section="contact" fieldKey="email" value={displayEmail ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></span>
          <span><Phone style={{ width: 12, height: 12, display: "inline", marginRight: "0.25rem", verticalAlign: "middle" }} /> <InlineText section="contact" fieldKey="phone" value={displayPhone ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></span>
        </div>
      </div>
    </section>
  );
}
