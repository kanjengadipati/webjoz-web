"use client";
import React from "react";
import { Check, X } from "lucide-react";
import { InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import { benefitsStrings } from "./benefits-strings";
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
  const L = benefitsStrings(language);
  const comp = b?.comparison;
  const rows = comp?.rows ?? [];
  const showTable = rows.length > 0 || isEditorMode;

  const handleDeleteRow = (indexToDelete: number) => {
    if (!onUpdateField) return;
    const newRows = rows.filter((_, i) => i !== indexToDelete);
    onUpdateField("benefits", "comparison.rows", newRows);
  };

  return (
    <section
      id="benefits"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          {(b?.eyebrow || isEditorMode) && (
            <div className="mb-2">
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--dt-primary)",
                }}
              >
                <InlineText
                  section="benefits"
                  fieldKey="eyebrow"
                  value={b.eyebrow || L.eyebrowComparison}
                  placeholder={L.eyebrowComparison}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </span>
            </div>
          )}
          <h2
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight)" as any,
              fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)",
              color: "var(--dt-text)",
              margin: 0,
            }}
          >
            <InlineText
              section="benefits"
              fieldKey="title"
              value={b.title || L.titleComparison}
              placeholder={L.titleComparison}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </h2>
          {(b?.subtitle || isEditorMode) && (
            <p
              style={{
                color: "var(--dt-text-muted)",
                maxWidth: "36rem",
                margin: "0.75rem auto 0",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              <InlineText
                section="benefits"
                fieldKey="subtitle"
                value={b.subtitle}
                placeholder={L.subtitleComparison}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                multiline
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </p>
          )}
        </div>

        {/* Table Container */}
        {showTable && (
          <div
            className="overflow-x-auto shadow-sm"
            style={{
              background: "var(--dt-surface)",
              borderRadius: "var(--dt-radius-lg)",
              border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}>
              <thead>
                <tr style={{ background: `color-mix(in srgb, var(--dt-primary) 6%, var(--dt-surface))` }}>
                  {/* Feature Label */}
                  <th
                    style={{
                      padding: "1.1rem 1.25rem",
                      textAlign: "left",
                      color: "var(--dt-text)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      width: "48%",
                      borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 14%, transparent)`,
                    }}
                  >
                    <InlineText
                      section="benefits"
                      fieldKey="comparison.feature_label"
                      value={comp?.feature_label || L.featureLabel}
                      placeholder={L.featureLabel}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </th>

                  {/* Column A - Kami (Highlighted) */}
                  <th
                    style={{
                      padding: "1.1rem 1.25rem",
                      textAlign: "center",
                      color: "var(--dt-primary)",
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      width: "24%",
                      background: `color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
                      borderBottom: `2px solid var(--dt-primary)`,
                      borderLeft: `1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                      borderRight: `1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] tracking-widest uppercase font-extrabold px-2 py-0.5 rounded-full bg-[var(--dt-primary)] text-white shadow-xs">
                        {L.recommendedBadge}
                      </span>
                      <InlineText
                        section="benefits"
                        fieldKey="comparison.column_a_label"
                        value={comp?.column_a_label || L.columnUs}
                        placeholder={L.columnUs}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    </div>
                  </th>

                  {/* Column B - Others */}
                  <th
                    style={{
                      padding: "1.1rem 1.25rem",
                      textAlign: "center",
                      color: "var(--dt-text-muted)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      width: "24%",
                      borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 14%, transparent)`,
                    }}
                  >
                    <InlineText
                      section="benefits"
                      fieldKey="comparison.column_b_label"
                      value={comp?.column_b_label || L.columnOthers}
                      placeholder={L.columnOthers}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </th>

                  {/* Actions Header for Editor Mode */}
                  {isEditorMode && (
                    <th
                      style={{
                        padding: "1.1rem 0.75rem",
                        textAlign: "center",
                        width: "4%",
                        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 14%, transparent)`,
                      }}
                    />
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="group transition-colors"
                    style={{
                      borderBottom:
                        idx < rows.length - 1
                          ? `1px solid color-mix(in srgb, var(--dt-primary) 8%, transparent)`
                          : "none",
                      background:
                        idx % 2 === 0
                          ? "transparent"
                          : `color-mix(in srgb, var(--dt-primary) 2%, transparent)`,
                    }}
                  >
                    {/* Feature Name */}
                    <td style={{ padding: "0.95rem 1.25rem", color: "var(--dt-text)", fontWeight: 600, fontSize: "0.875rem" }}>
                      <InlineText
                        section="benefits"
                        fieldKey={`comparison.rows.${idx}.label`}
                        value={row.label ?? ""}
                        placeholder={L.comparisonRowLabel}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        style={{ color: "var(--dt-text)", fontWeight: 600, fontSize: "0.875rem" }}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    </td>

                    {/* Column A Value (Highlighted Column) */}
                    <td
                      style={{
                        padding: "0.95rem 1.25rem",
                        textAlign: "center",
                        background: `color-mix(in srgb, var(--dt-primary) 6%, transparent)`,
                        borderLeft: `1px solid color-mix(in srgb, var(--dt-primary) 14%, transparent)`,
                        borderRight: `1px solid color-mix(in srgb, var(--dt-primary) 14%, transparent)`,
                      }}
                    >
                      {row.value_a === "true" || row.value_a === "✓" ? (
                        <span
                          onClick={isEditorMode ? () => onUpdateField?.("benefits", `comparison.rows.${idx}.value_a`, "✗") : undefined}
                          style={{ cursor: isEditorMode ? "pointer" : "default", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          title={isEditorMode ? L.toggleValueTitle : undefined}
                          className="w-7 h-7 rounded-full bg-[color-mix(in_srgb,var(--dt-primary)_15%,transparent)] mx-auto"
                        >
                          <Check style={{ width: 16, height: 16, color: "var(--dt-primary)", strokeWidth: 3 }} />
                        </span>
                      ) : row.value_a === "false" || row.value_a === "✗" ? (
                        <span
                          onClick={isEditorMode ? () => onUpdateField?.("benefits", `comparison.rows.${idx}.value_a`, "✓") : undefined}
                          style={{ cursor: isEditorMode ? "pointer" : "default", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          title={isEditorMode ? L.toggleValueTitle : undefined}
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto"
                        >
                          <X style={{ width: 16, height: 16, color: "var(--dt-text-muted)", strokeWidth: 2.5 }} />
                        </span>
                      ) : (
                        <InlineText
                          section="benefits"
                          fieldKey={`comparison.rows.${idx}.value_a`}
                          value={row.value_a ?? ""}
                          placeholder="✓"
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          as="span"
                          style={{ color: "var(--dt-primary)", fontWeight: 700, fontSize: "0.875rem" }}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                        />
                      )}
                    </td>

                    {/* Column B Value */}
                    <td style={{ padding: "0.95rem 1.25rem", textAlign: "center" }}>
                      {row.value_b === "true" || row.value_b === "✓" ? (
                        <span
                          onClick={isEditorMode ? () => onUpdateField?.("benefits", `comparison.rows.${idx}.value_b`, "✗") : undefined}
                          style={{ cursor: isEditorMode ? "pointer" : "default", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          title={isEditorMode ? L.toggleValueTitle : undefined}
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto"
                        >
                          <Check style={{ width: 16, height: 16, color: "var(--dt-text-muted)", strokeWidth: 2 }} />
                        </span>
                      ) : row.value_b === "false" || row.value_b === "✗" ? (
                        <span
                          onClick={isEditorMode ? () => onUpdateField?.("benefits", `comparison.rows.${idx}.value_b`, "✓") : undefined}
                          style={{ cursor: isEditorMode ? "pointer" : "default", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          title={isEditorMode ? L.toggleValueTitle : undefined}
                          className="w-7 h-7 rounded-full bg-rose-50 dark:bg-rose-950/40 mx-auto"
                        >
                          <X style={{ width: 16, height: 16, color: "#f43f5e", strokeWidth: 2.5 }} />
                        </span>
                      ) : (
                        <InlineText
                          section="benefits"
                          fieldKey={`comparison.rows.${idx}.value_b`}
                          value={row.value_b ?? ""}
                          placeholder="✗"
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          as="span"
                          style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem" }}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                        />
                      )}
                    </td>

                    {/* Row Delete Button for Editor Mode */}
                    {isEditorMode && (
                      <td style={{ padding: "0.5rem 0.5rem", textAlign: "center" }}>
                        <InlineDeleteButton
                          compact
                          onDelete={() => handleDeleteRow(idx)}
                          title={L.deleteRowTitle}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!showTable && (
          <p style={{ textAlign: "center", color: "var(--dt-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            {L.noComparisonRows}
          </p>
        )}

        {isEditorMode && onAddItem && (
          <div style={{ marginTop: "1.25rem" }}>
            <InlineAddTile
              label={L.addComparisonRow}
              onClick={onAddItem}
              style={{ borderRadius: "var(--dt-radius)" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
