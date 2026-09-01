"use client";
import React from "react";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { PricingVariantProps } from "./index";

export default function PricingComparisonTable({
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

  // Collect all unique features across plans, tracking the first plan that owns each.
  const featureRefs: { feature: string; planIdx: number; featureIdx: number }[] = [];
  const seenFeatures = new Set<string>();
  (pricing.plans || []).forEach((plan, planIdx) => {
    (plan.features || []).forEach((feature, featureIdx) => {
      if (!seenFeatures.has(feature)) {
        seenFeatures.add(feature);
        featureRefs.push({ feature, planIdx, featureIdx });
      }
    });
  });

  return (
    <section
      id="pricing"
      style={{
        padding: "var(--dt-spacing) 1.5rem",
        background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`,
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
              pricing.title || (isEN ? "Compare Plans" : "Perbandingan Paket")
            )}
          </h2>
          {(pricing.subtitle || isEditorMode) && (
            <p
              style={{
                color: `color-mix(in srgb, ${brandText} 70%, transparent)`,
                fontSize: "0.95rem",
                maxWidth: "38rem",
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

        {/* Comparison Table for Tablet/Desktop */}
        <div
          className="overflow-x-auto rounded-3xl"
          style={{
            background: "var(--dt-surface)",
            border: `1px solid color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-6 text-sm font-semibold w-1/3" style={{ color: `color-mix(in srgb, ${brandText} 60%, transparent)` }}>
                  {isEN ? "Features" : "Fitur & Fasilitas"}
                </th>
                {pricing.plans.map((plan, idx) => {
                  const isFeatured = plan.is_featured ?? idx === 1;
                  return (
                    <th
                      key={idx}
                      className="p-6 text-center"
                      style={{
                        background: isFeatured
                          ? `color-mix(in srgb, ${brandPrimary} 8%, transparent)`
                          : "transparent",
                      }}
                    >
                      {(plan.badge || isEditorMode) && (
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2"
                          style={{ background: brandPrimary, color: brandBg }}
                        >
                          {isEditorMode ? (
                            <InlineText
                              section="pricing"
                              fieldKey={`plans.${idx}.badge`}
                              value={plan.badge || ""}
                              placeholder="Badge..."
                              onUpdateField={(_, __, val) => handleUpdatePlan(idx, "badge", val)}
                              isEditorMode={isEditorMode}
                              isSelected={isSelected}
                              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                              onEditingStateChange={onEditingStateChange}
                              as="span"
                            />
                          ) : (
                            plan.badge
                          )}
                        </span>
                      )}
                      <div
                        style={{
                          fontFamily: headingFont,
                          fontWeight: 800,
                          fontSize: "1.2rem",
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
                      </div>
                      <div
                        style={{
                          fontFamily: headingFont,
                          fontWeight: 900,
                          fontSize: "1.5rem",
                          color: brandPrimary,
                          marginTop: "0.25rem",
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
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {featureRefs.map(({ feature, planIdx, featureIdx }, fIdx) => (
                <tr key={fIdx} className="hover:bg-white/[0.02] transition-colors">
                  <td
                    className="p-4 px-6 text-sm font-medium"
                    style={{ color: `color-mix(in srgb, ${brandText} 85%, transparent)` }}
                  >
                    {isEditorMode ? (
                      <InlineText
                        section="pricing"
                        fieldKey={`plans.${planIdx}.features.${featureIdx}`}
                        value={feature}
                        onUpdateField={(_, __, val) => handleUpdatePlanFeature(planIdx, featureIdx, val)}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                        as="span"
                      />
                    ) : (
                      feature
                    )}
                  </td>
                  {pricing.plans.map((plan, pIdx) => {
                    const hasFeature = plan.features?.includes(feature);
                    const isFeatured = plan.is_featured ?? pIdx === 1;
                    return (
                      <td
                        key={pIdx}
                        className="p-4 text-center"
                        style={{
                          background: isFeatured
                            ? `color-mix(in srgb, ${brandPrimary} 6%, transparent)`
                            : "transparent",
                        }}
                      >
                        {hasFeature ? (
                          <div
                            className="w-6 h-6 rounded-full mx-auto flex items-center justify-center"
                            style={{
                              background: `color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
                              color: brandPrimary,
                            }}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center opacity-30">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-6" />
                {pricing.plans.map((plan, pIdx) => {
                  const isFeatured = plan.is_featured ?? pIdx === 1;
                  return (
                    <td
                      key={pIdx}
                      className="p-6 text-center"
                      style={{
                        background: isFeatured
                          ? `color-mix(in srgb, ${brandPrimary} 8%, transparent)`
                          : "transparent",
                      }}
                    >
                      <a
                        href={!isEditorMode ? (plan.cta_url || "#contact") : undefined}
                        className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-xs transition-all duration-200 hover:brightness-110 cursor-pointer w-full"
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
                            fieldKey={`plans.${pIdx}.cta_text`}
                            value={plan.cta_text || (isEN ? "Choose" : "Pilih")}
                            onUpdateField={(_, __, val) => handleUpdatePlan(pIdx, "cta_text", val)}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                            onEditingStateChange={onEditingStateChange}
                            as="span"
                          />
                        ) : (
                          <span>{plan.cta_text || (isEN ? "Choose" : "Pilih")}</span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
