"use client";
import React from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { PricingVariantProps } from "./index";

export default function PricingCards({
  pricing,
  design_token,
  language,
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: PricingVariantProps) {
  if (!pricing?.plans?.length) return null;
  const brandPrimary = "var(--dt-primary)";
  const brandBg = "var(--dt-bg)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const isEN = language === "en";

  const handleUpdatePlan = (index: number, field: string, value: any) => {
    const next = [...(pricing.plans || [])];
    next[index] = { ...next[index], [field]: value };
    onUpdateField?.("pricing", "plans", next);
  };

  const handleUpdatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    const next = [...(pricing.plans || [])];
    const feats = [...(next[planIndex].features || [])];
    feats[featureIndex] = value;
    next[planIndex] = { ...next[planIndex], features: feats };
    onUpdateField?.("pricing", "plans", next);
  };

  return (
    <section
      id="pricing"
      style={{
        padding: "var(--dt-spacing) 1.5rem",
        background: `color-mix(in srgb, ${brandPrimary} 3%, ${brandBg})`,
        borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          {(pricing.eyebrow || isEditorMode) && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: brandPrimary,
                background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`,
                padding: "0.4rem 0.9rem",
                borderRadius: "9999px",
                marginBottom: "0.5rem",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isEditorMode ? (
                <InlineText
                  section="pricing"
                  fieldKey="eyebrow"
                  value={pricing.eyebrow || ""}
                  placeholder="Eyebrow..."
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : (
                pricing.eyebrow
              )}
            </span>
          )}
          <h2
            style={{
              fontFamily: headingFont,
              fontWeight: headingWeight as any,
              fontSize: "clamp(1.75rem, 4.5cqw, 2.5rem)",
              color: brandText,
              marginTop: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            {isEditorMode ? (
              <InlineText
                section="pricing"
                fieldKey="title"
                value={pricing.title || ""}
                placeholder="Judul Paket..."
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : (
              pricing.title || (isEN ? "Pricing Plans" : "Pilihan Paket")
            )}
          </h2>
          {(pricing.subtitle || isEditorMode) && (
            <p
              style={{
                color: `color-mix(in srgb, ${brandText} 70%, transparent)`,
                fontSize: "1rem",
                maxWidth: "38rem",
                margin: "0.5rem auto 0",
                lineHeight: 1.5,
              }}
            >
              {isEditorMode ? (
                <InlineText
                  section="pricing"
                  fieldKey="subtitle"
                  value={pricing.subtitle || ""}
                  placeholder="Subjudul..."
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : (
                pricing.subtitle
              )}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {pricing.plans.map((plan, idx) => {
            const isFeatured = plan.is_featured ?? idx === 1;
            return (
              <div
                key={idx}
                className={`relative flex flex-col p-6 lg:p-8 rounded-3xl transition-all duration-300 ${
                  isFeatured ? "md:-translate-y-2 shadow-xl ring-2" : "hover:-translate-y-1 shadow-md"
                }`}
                style={{
                  background: isFeatured ? "var(--dt-surface)" : "var(--dt-surface)",
                  borderColor: isFeatured ? brandPrimary : `color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
                  borderWidth: isFeatured ? "2px" : "1px",
                  boxShadow: isFeatured
                    ? `0 20px 40px color-mix(in srgb, ${brandPrimary} 18%, transparent)`
                    : "0 4px 20px rgba(0,0,0,0.04)",
                  borderStyle: "solid",
                }}
              >
                {/* Popular Badge */}
                {(plan.badge || isFeatured || isEditorMode) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm"
                      style={{
                        background: brandPrimary,
                        color: brandBg,
                      }}
                    >
                      {isEditorMode ? (
                        <InlineText
                          section="pricing"
                          fieldKey={`plans.${idx}.badge`}
                          value={plan.badge || (isFeatured ? (isEN ? "Most Popular" : "Paling Populer") : "")}
                          placeholder="Badge..."
                          onUpdateField={(_, __, val) => handleUpdatePlan(idx, "badge", val)}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="span"
                        />
                      ) : (
                        plan.badge || (isEN ? "Most Popular" : "Paling Populer")
                      )}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    style={{
                      fontFamily: headingFont,
                      fontWeight: 800,
                      fontSize: "1.35rem",
                      color: brandText,
                    }}
                  >
                    {isEditorMode ? (
                      <InlineText
                        section="pricing"
                        fieldKey={`plans.${idx}.name`}
                        value={plan.name}
                        onUpdateField={(_, __, val) => handleUpdatePlan(idx, "name", val)}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                        as="span"
                      />
                    ) : (
                      plan.name
                    )}
                  </h3>
                  {(plan.description || isEditorMode) && (
                    <p
                      style={{
                        color: `color-mix(in srgb, ${brandText} 65%, transparent)`,
                        fontSize: "0.875rem",
                        marginTop: "0.35rem",
                        minHeight: "2.5rem",
                      }}
                    >
                      {isEditorMode ? (
                        <InlineText
                          section="pricing"
                          fieldKey={`plans.${idx}.description`}
                          value={plan.description || ""}
                          placeholder="Deskripsi paket..."
                          onUpdateField={(_, __, val) => handleUpdatePlan(idx, "description", val)}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="span"
                        />
                      ) : (
                        plan.description
                      )}
                    </p>
                  )}
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span
                    style={{
                      fontFamily: headingFont,
                      fontWeight: 900,
                      fontSize: "clamp(1.75rem, 4cqw, 2.35rem)",
                      color: brandPrimary,
                      lineHeight: 1,
                    }}
                  >
                    {isEditorMode ? (
                      <InlineText
                        section="pricing"
                        fieldKey={`plans.${idx}.price`}
                        value={plan.price}
                        onUpdateField={(_, __, val) => handleUpdatePlan(idx, "price", val)}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                        as="span"
                      />
                    ) : (
                      plan.price
                    )}
                  </span>
                  {(plan.period || isEditorMode) && (
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: `color-mix(in srgb, ${brandText} 60%, transparent)`,
                      }}
                    >
                      {isEditorMode ? (
                        <InlineText
                          section="pricing"
                          fieldKey={`plans.${idx}.period`}
                          value={plan.period || ""}
                          placeholder="/bln"
                          onUpdateField={(_, __, val) => handleUpdatePlan(idx, "period", val)}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="span"
                        />
                      ) : (
                        plan.period
                      )}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div className="flex-1 space-y-3 mb-8">
                  {plan.features?.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-sm">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: `color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
                          color: brandPrimary,
                        }}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span style={{ color: `color-mix(in srgb, ${brandText} 85%, transparent)` }}>
                        {isEditorMode ? (
                          <InlineText
                            section="pricing"
                            fieldKey={`plans.${idx}.features.${fIdx}`}
                            value={feature}
                            onUpdateField={(_, __, val) => handleUpdatePlanFeature(idx, fIdx, val)}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                            onEditingStateChange={onEditingStateChange}
                            as="span"
                          />
                        ) : (
                          feature
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <a
                  href={!isEditorMode ? (plan.cta_url || "#contact") : undefined}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm transition-all duration-200 hover:brightness-110 hover:shadow-lg cursor-pointer"
                  style={{
                    background: isFeatured
                      ? brandPrimary
                      : `color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                    color: isFeatured ? brandBg : brandPrimary,
                    border: isFeatured ? "none" : `1px solid color-mix(in srgb, ${brandPrimary} 25%, transparent)`,
                  }}
                >
                  {isEditorMode ? (
                    <InlineText
                      section="pricing"
                      fieldKey={`plans.${idx}.cta_text`}
                      value={plan.cta_text || (isEN ? "Choose Plan" : "Pilih Paket")}
                      onUpdateField={(_, __, val) => handleUpdatePlan(idx, "cta_text", val)}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                      as="span"
                    />
                  ) : (
                    <span>{plan.cta_text || (isEN ? "Choose Plan" : "Pilih Paket")}</span>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
