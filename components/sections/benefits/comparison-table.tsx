"use client";
import React from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { InlineText } from "../../templates/shared";
import { InlineAddTile } from "../inline-add";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface BenefitsVariantProps {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
  language?: "id" | "en";
}

export default function BenefitsComparisonTable({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onAddItem,
  language = "id",
}: BenefitsVariantProps) {
  const comp = b.comparison;
  // Only real comparison rows — never fabricate claims, and never derive rows from
  // benefits.items (those are a different data shape and would write to a
  // non-existent comparison.rows.* path).
  const rows = comp?.rows ?? [];
  const showTable = rows.length > 0 || isEditorMode;

  return (
    <section id="benefits" style={{ padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`, borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          {(b.eyebrow || isEditorMode) && (
            <InlineText
              section="benefits"
              fieldKey="eyebrow"
              value={b.eyebrow ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)", marginBottom: "0.25rem" }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          )}
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>
            <InlineText
              section="benefits"
              fieldKey="title"
              value={b.title}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </h2>
          {(b.subtitle || isEditorMode) && (
            <p style={{ color: "var(--dt-text-muted)", maxWidth: "36rem", margin: "0.75rem auto 0", lineHeight: 1.6 }}>
              <InlineText
                section="benefits"
                fieldKey="subtitle"
                value={b.subtitle}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </p>
          )}
        </div>
        {showTable && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "var(--dt-radius-lg)", overflow: "hidden", border: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
            <thead>
              <tr style={{ background: `color-mix(in srgb, var(--dt-primary) 8%, transparent)` }}>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", color: "var(--dt-text)", fontWeight: 700, fontSize: "0.85rem", borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>Fitur / Keunggulan</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "center", color: "var(--dt-primary)", fontWeight: 800, fontSize: "0.9rem", borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
                  <InlineText
                    section="benefits"
                    fieldKey="comparison.column_a_label"
                    value={comp?.column_a_label || "Kami"}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "center", color: "var(--dt-text-muted)", fontWeight: 600, fontSize: "0.85rem", borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
                  <InlineText
                    section="benefits"
                    fieldKey="comparison.column_b_label"
                    value={comp?.column_b_label || "Lainnya"}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx < rows.length - 1 ? `1px solid color-mix(in srgb, var(--dt-primary) 8%, transparent)` : "none", background: idx % 2 === 0 ? "transparent" : "color-mix(in srgb, var(--dt-primary) 3%, transparent)" }}>
                  <td style={{ padding: "0.85rem 1.25rem", color: "var(--dt-text)", fontWeight: 600, fontSize: "0.85rem" }}>
                    <InlineText
                      section="benefits"
                      fieldKey={`comparison.rows.${idx}.label`}
                      value={row.label ?? ""}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      style={{ color: "var(--dt-text)", fontWeight: 600, fontSize: "0.85rem" }}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </td>
                  <td style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>
                    {row.value_a === "true" || row.value_a === "✓" ? (
                      <span
                        onClick={isEditorMode ? () => onUpdateField?.("benefits", `comparison.rows.${idx}.value_a`, "✗") : undefined}
                        style={{ cursor: isEditorMode ? "pointer" : "default", display: "inline-block" }}
                        title={isEditorMode ? "Klik untuk ganti nilai" : undefined}
                      >
                        <Check style={{ width: 18, height: 18, color: "var(--dt-primary)", margin: "0 auto" }} />
                      </span>
                    ) : row.value_a === "false" || row.value_a === "✗" ? (
                      <span
                        onClick={isEditorMode ? () => onUpdateField?.("benefits", `comparison.rows.${idx}.value_a`, "✓") : undefined}
                        style={{ cursor: isEditorMode ? "pointer" : "default", display: "inline-block" }}
                        title={isEditorMode ? "Klik untuk ganti nilai" : undefined}
                      >
                        <X style={{ width: 18, height: 18, color: "var(--dt-text-muted)", margin: "0 auto" }} />
                      </span>
                    ) : (
                      <InlineText
                        section="benefits"
                        fieldKey={`comparison.rows.${idx}.value_a`}
                        value={row.value_a ?? ""}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        style={{ color: "var(--dt-primary)", fontWeight: 600, fontSize: "0.85rem" }}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    )}
                  </td>
                  <td style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>
                    {row.value_b === "true" || row.value_b === "✓" ? (
                      <span
                        onClick={isEditorMode ? () => onUpdateField?.("benefits", `comparison.rows.${idx}.value_b`, "✗") : undefined}
                        style={{ cursor: isEditorMode ? "pointer" : "default", display: "inline-block" }}
                        title={isEditorMode ? "Klik untuk ganti nilai" : undefined}
                      >
                        <Check style={{ width: 18, height: 18, color: "var(--dt-text-muted)", margin: "0 auto" }} />
                      </span>
                    ) : row.value_b === "false" || row.value_b === "✗" ? (
                      <span
                        onClick={isEditorMode ? () => onUpdateField?.("benefits", `comparison.rows.${idx}.value_b`, "✓") : undefined}
                        style={{ cursor: isEditorMode ? "pointer" : "default", display: "inline-block" }}
                        title={isEditorMode ? "Klik untuk ganti nilai" : undefined}
                      >
                        <X style={{ width: 18, height: 18, color: "#ef4444", margin: "0 auto" }} />
                      </span>
                    ) : (
                      <InlineText
                        section="benefits"
                        fieldKey={`comparison.rows.${idx}.value_b`}
                        value={row.value_b ?? ""}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        style={{ color: "var(--dt-text-muted)", fontSize: "0.85rem" }}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        {!showTable && (
          <p style={{ textAlign: "center", color: "var(--dt-text-muted)", fontSize: "0.85rem", margin: 0 }}>
            {language === "en" ? "No comparison rows yet." : "Belum ada baris perbandingan."}
          </p>
        )}
        {isEditorMode && onAddItem && (
          <div style={{ marginTop: "1.25rem" }}>
            <InlineAddTile label="Tambah Baris Perbandingan" onClick={onAddItem} style={{ borderRadius: "var(--dt-radius)" }} />
          </div>
        )}
      </div>
    </section>
  );
}
