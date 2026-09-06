"use client";
import React from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { PricingVariantProps } from "./index";

export default function PricingSingleTierHighlight({
  pricing,
  language,
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: PricingVariantProps) {
  if (!pricing?.plans?.length) return null;
  const isEN = language === "en";
  const plan = pricing.plans.find((p) => p.is_featured) ?? pricing.plans[0];
  const planIdx = pricing.plans.indexOf(plan);

  const handleUpdatePlan = (field: string, value: any) => {
    const next = [...pricing.plans];
    next[planIdx] = { ...next[planIdx], [field]: value };
    onUpdateField?.("pricing", "plans", next);
  };

  const handleUpdateFeature = (featureIdx: number, value: string) => {
    const feats = [...(plan.features || [])];
    feats[featureIdx] = value;
    handleUpdatePlan("features", feats);
  };

  return (
    <section
      id="pricing"
      style={{
        padding: "var(--dt-spacing) 1.5rem",
        background: "var(--dt-bg)",
      }}
    >
      <div style={{ maxWidth: "36rem", margin: "0 auto", textAlign: "center" }}>
        {(pricing.eyebrow || isEditorMode) && (
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.18em", color: "var(--dt-primary)", marginBottom: "0.75rem",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isEditorMode ? (
              <InlineText
                section="pricing" fieldKey="eyebrow" value={pricing.eyebrow || ""}
                placeholder={isEN ? "Eyebrow..." : "Label..."}
                onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : pricing.eyebrow}
          </span>
        )}

        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.75rem, 4.5cqw, 2.5rem)", color: "var(--dt-text)", marginBottom: "2rem" }}>
          {isEditorMode ? (
            <InlineText
              section="pricing" fieldKey="title" value={pricing.title || ""}
              placeholder={isEN ? "Pricing Title..." : "Judul Paket..."}
              onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
              as="span"
            />
          ) : (pricing.title || (isEN ? "Simple, Straightforward Pricing" : "Harga Simpel & Transparan"))}
        </h2>

        <div
          style={{
            background: "var(--dt-surface)",
            border: "2px solid var(--dt-primary)",
            borderRadius: "var(--dt-radius-lg)",
            padding: "2.5rem 2rem",
            boxShadow: "0 24px 48px color-mix(in srgb, var(--dt-primary) 20%, transparent)",
          }}
        >
          {(plan.badge || isEditorMode) && (
            <span
              style={{
                display: "inline-block", background: "var(--dt-primary)", color: "var(--dt-bg)",
                fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
                padding: "0.35rem 0.9rem", borderRadius: "9999px", marginBottom: "1.25rem",
              }}
            >
              {isEditorMode ? (
                <InlineText
                  section="pricing" fieldKey={`plans.${planIdx}.badge`}
                  value={plan.badge || (isEN ? "Most Popular" : "Paling Populer")}
                  placeholder={isEN ? "Badge..." : "Badge..."}
                  onUpdateField={(_, __, val) => handleUpdatePlan("badge", val)}
                  isEditorMode={isEditorMode} isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : (plan.badge || (isEN ? "Most Popular" : "Paling Populer"))}
            </span>
          )}

          <div style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "1.15rem", color: "var(--dt-text)", marginBottom: "0.5rem" }}>
            {isEditorMode ? (
              <InlineText
                section="pricing" fieldKey={`plans.${planIdx}.name`} value={plan.name}
                onUpdateField={(_, __, val) => handleUpdatePlan("name", val)}
                isEditorMode={isEditorMode} isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : plan.name}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.35rem", margin: "1rem 0" }}>
            <span style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 900, fontSize: "3rem", color: "var(--dt-primary)" }}>
              {isEditorMode ? (
                <InlineText
                  section="pricing" fieldKey={`plans.${planIdx}.price`} value={plan.price}
                  onUpdateField={(_, __, val) => handleUpdatePlan("price", val)}
                  isEditorMode={isEditorMode} isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : plan.price}
            </span>
            {plan.period && (
              <span style={{ color: "color-mix(in srgb, var(--dt-text) 60%, transparent)", fontSize: "1rem" }}>
                {isEditorMode ? (
                  <InlineText
                    section="pricing" fieldKey={`plans.${planIdx}.period`} value={plan.period || ""}
                    placeholder="/bln"
                    onUpdateField={(_, __, val) => handleUpdatePlan("period", val)}
                    isEditorMode={isEditorMode} isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                ) : plan.period}
              </span>
            )}
          </div>

          {(plan.description || isEditorMode) && (
            <p style={{ color: "color-mix(in srgb, var(--dt-text) 70%, transparent)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              {isEditorMode ? (
                <InlineText
                  section="pricing" fieldKey={`plans.${planIdx}.description`} value={plan.description || ""}
                  placeholder={isEN ? "Plan description..." : "Deskripsi paket..."}
                  onUpdateField={(_, __, val) => handleUpdatePlan("description", val)}
                  isEditorMode={isEditorMode} isSelected={isSelected} multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : plan.description}
            </p>
          )}

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", textAlign: "left" }}>
            {(plan.features || []).map((feat, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", padding: "0.5rem 0", color: "var(--dt-text)", fontSize: "0.9rem" }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--dt-primary)", marginTop: "0.15rem" }} />
                {isEditorMode ? (
                  <InlineText
                    section="pricing" fieldKey={`plans.${planIdx}.features.${idx}`} value={feat}
                    onUpdateField={(_, __, val) => handleUpdateFeature(idx, val)}
                    isEditorMode={isEditorMode} isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                ) : feat}
              </li>
            ))}
          </ul>

          <a
            href={!isEditorMode ? (plan.cta_url || "#contact") : undefined}
            className="inline-flex items-center justify-center gap-2 w-full font-bold uppercase tracking-wide transition-all hover:brightness-110"
            style={{ background: "var(--dt-primary)", color: "var(--dt-bg)", padding: "0.9rem 1.5rem", borderRadius: "var(--dt-radius)", fontSize: "0.85rem" }}
          >
            {isEditorMode ? (
              <InlineText
                section="pricing" fieldKey={`plans.${planIdx}.cta_text`} value={plan.cta_text || (isEN ? "Get Started" : "Mulai Sekarang")}
                placeholder={isEN ? "Button text..." : "Teks tombol..."}
                onUpdateField={(_, __, val) => handleUpdatePlan("cta_text", val)}
                isEditorMode={isEditorMode} isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : (plan.cta_text || (isEN ? "Get Started" : "Mulai Sekarang"))}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}