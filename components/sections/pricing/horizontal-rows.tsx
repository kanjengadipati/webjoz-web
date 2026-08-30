"use client";
import React from "react";
import { Check, ArrowRight, Star } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { PricingVariantProps } from "./index";

export default function PricingHorizontalRows({
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
        background: brandBg,
      }}
    >
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
                marginBottom: "0.5rem",
              }}
            >
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
              pricing.title || (isEN ? "Pricing & Packages" : "Pilihan Paket & Harga")
            )}
          </h2>
          {(pricing.subtitle || isEditorMode) && (
            <p
              style={{
                color: `color-mix(in srgb, ${brandText} 70%, transparent)`,
                fontSize: "0.95rem",
                maxWidth: "36rem",
                margin: "0.5rem auto 0",
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

        <div className="space-y-4 md:space-y-6">
          {pricing.plans.map((plan, idx) => {
            const isFeatured = plan.is_featured ?? idx === 1;
            return (
              <div
                key={idx}
                className="group p-6 md:p-8 rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
                style={{
                  background: isFeatured
                    ? `color-mix(in srgb, ${brandPrimary} 6%, var(--dt-surface))`
                    : "var(--dt-surface)",
                  border: isFeatured
                    ? `2px solid ${brandPrimary}`
                    : `1px solid color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
                  boxShadow: isFeatured
                    ? `0 12px 30px color-mix(in srgb, ${brandPrimary} 12%, transparent)`
                    : "0 2px 10px rgba(0,0,0,0.02)",
                }}
              >
                {/* Left side: Info & Features */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3
                      style={{
                        fontFamily: headingFont,
                        fontWeight: 800,
                        fontSize: "1.25rem",
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
                    {(plan.badge || isFeatured || isEditorMode) && (
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                        style={{
                          background: brandPrimary,
                          color: brandBg,
                        }}
                      >
                        {isEditorMode ? (
                          <InlineText
                            section="pricing"
                            fieldKey={`plans.${idx}.badge`}
                            value={plan.badge || (isFeatured ? (isEN ? "Featured" : "Pilihan Utama") : "")}
                            placeholder="Badge..."
                            onUpdateField={(_, __, val) => handleUpdatePlan(idx, "badge", val)}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                            onEditingStateChange={onEditingStateChange}
                            as="span"
                          />
                        ) : (
                          plan.badge || (isEN ? "Featured" : "Pilihan Utama")
                        )}
                      </span>
                    )}
                  </div>
                  {(plan.description || isEditorMode) && (
                    <p style={{ color: `color-mix(in srgb, ${brandText} 65%, transparent)`, fontSize: "0.875rem" }}>
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
                  {plan.features?.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
                      {plan.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-1.5 text-xs">
                          <Check className="w-3.5 h-3.5 shrink-0" style={{ color: brandPrimary }} />
                          <span style={{ color: `color-mix(in srgb, ${brandText} 80%, transparent)` }}>
                            {isEditorMode ? (
                              <InlineText
                                section="pricing"
                                fieldKey={`plans.${idx}.features.${fi}`}
                                value={f}
                                onUpdateField={(_, __, val) => handleUpdatePlanFeature(idx, fi, val)}
                                isEditorMode={isEditorMode}
                                isSelected={isSelected}
                                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                                onEditingStateChange={onEditingStateChange}
                                as="span"
                              />
                            ) : (
                              f
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side: Price & CTA */}
                <div className="flex sm:flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                  <div className="text-left md:text-right">
                    <div
                      style={{
                        fontFamily: headingFont,
                        fontWeight: 900,
                        fontSize: "1.75rem",
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
                    </div>
                    {(plan.period || isEditorMode) && (
                      <span style={{ fontSize: "0.75rem", color: `color-mix(in srgb, ${brandText} 60%, transparent)` }}>
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

                  <a
                    href={!isEditorMode ? (plan.cta_url || "#contact") : undefined}
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs transition-all duration-200 hover:brightness-110 cursor-pointer"
                    style={{
                      background: isFeatured ? brandPrimary : `color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                      color: isFeatured ? brandBg : brandPrimary,
                      border: isFeatured ? "none" : `1px solid color-mix(in srgb, ${brandPrimary} 25%, transparent)`,
                    }}
                  >
                    {isEditorMode ? (
                      <InlineText
                        section="pricing"
                        fieldKey={`plans.${idx}.cta_text`}
                        value={plan.cta_text || (isEN ? "Select" : "Pilih")}
                        onUpdateField={(_, __, val) => handleUpdatePlan(idx, "cta_text", val)}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                        as="span"
                      />
                    ) : (
                      <span>{plan.cta_text || (isEN ? "Select" : "Pilih")}</span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
