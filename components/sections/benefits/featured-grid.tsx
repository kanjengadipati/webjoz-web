"use client";
import React from "react";
import { Star } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
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

export default function BenefitsFeaturedGrid({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
  onAddItem,
}: BenefitsVariantProps) {
  const isEN = language === "en";
  const items = b?.items ?? [];
  const [featured, ...rest] = items;

  const handleDeleteItem = (indexToDelete: number) => {
    if (!onUpdateField) return;
    const newItems = items.filter((_, i) => i !== indexToDelete);
    onUpdateField("benefits", "items", newItems);
  };

  return (
    <section
      id="benefits"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 3.5%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section header */}
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
                  value={b.eyebrow || (isEN ? "Benefits" : "Keunggulan")}
                  placeholder={isEN ? "Benefits" : "Keunggulan"}
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
              value={b.title}
              placeholder={isEN ? "Featured Benefits" : "Keunggulan Unggulan"}
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
                placeholder={isEN ? "Highlights that matter" : "Fokus utama keunggulan layanan kami"}
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

        {/* Featured card (first item) — full width */}
        {featured && (
          <div
            className="group relative transition-all"
            style={{
              marginBottom: "1.5rem",
              background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 16%, var(--dt-surface)) 0%, var(--dt-surface) 60%)`,
              border: `1px solid color-mix(in srgb, var(--dt-primary) 28%, transparent)`,
              borderRadius: "var(--dt-radius-lg)",
              padding: "2.25rem 2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = `0 16px 48px color-mix(in srgb, var(--dt-primary) 20%, transparent)`;
              el.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "none";
              el.style.transform = "none";
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, var(--dt-primary), color-mix(in srgb, var(--dt-primary) 40%, transparent))`,
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              {/* Featured badge */}
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#fff",
                  background: "var(--dt-primary)",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "var(--dt-radius)",
                }}
              >
                {isEN ? "Primary Feature" : "Keunggulan Utama"}
              </span>

              {featured.stat || isEditorMode ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                  <span style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "1.75rem", color: "var(--dt-primary)" }}>
                    <InlineText
                      section="benefits"
                      fieldKey="items.0.stat"
                      value={featured.stat ?? ""}
                      placeholder="10x"
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </span>
                  {(featured.stat_label || isEditorMode) && (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--dt-text-muted)" }}>
                      <InlineText
                        section="benefits"
                        fieldKey="items.0.stat_label"
                        value={featured.stat_label ?? ""}
                        placeholder={isEN ? "Metric" : "Metrik"}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    </span>
                  )}
                </div>
              ) : null}
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  background: `color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(--dt-primary) 28%, transparent)`,
                  borderRadius: "var(--dt-radius)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                  <DynamicIcon name={featured.icon} defaultIcon={Star} className="w-6 h-6" />
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <InlineText
                  section="benefits"
                  fieldKey="items.0.title"
                  value={featured.title ?? ""}
                  placeholder={isEN ? "Title..." : "Judul..."}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="h3"
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 700,
                    fontSize: "clamp(1.2rem, 3cqw, 1.6rem)",
                    color: "var(--dt-text)",
                    margin: "0 0 0.5rem 0",
                    lineHeight: 1.25,
                  }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
                <InlineText
                  section="benefits"
                  fieldKey="items.0.description"
                  value={featured.description ?? ""}
                  placeholder={isEN ? "Description..." : "Deskripsi..."}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="p"
                  style={{
                    color: "var(--dt-text-muted)",
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    margin: 0,
                    maxWidth: "52rem",
                  }}
                  multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>
            </div>

            {/* Inline Delete Button for Editor Mode */}
            {isEditorMode && (
              <div className="absolute top-3 right-3">
                <InlineDeleteButton
                  compact
                  onDelete={() => handleDeleteItem(0)}
                  title={isEN ? "Delete benefit" : "Hapus keunggulan"}
                />
              </div>
            )}
          </div>
        )}

        {/* Rest of the items — equal-height grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {rest.map((item, idx) => {
            const realIdx = idx + 1;
            return (
              <div
                key={realIdx}
                className="group relative flex flex-col justify-between transition-all"
                style={{
                  background: "var(--dt-surface)",
                  border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`,
                  borderRadius: "var(--dt-radius-lg)",
                  padding: "1.75rem",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 8px 24px color-mix(in srgb, var(--dt-primary) 14%, transparent)`;
                  el.style.transform = "translateY(-3px)";
                  el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 32%, transparent)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                  el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 15%, transparent)`;
                }}
              >
                <div className="flex flex-col gap-3.5">
                  {item.stat || isEditorMode ? (
                    <div>
                      <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "1.85rem", color: "var(--dt-primary)", margin: 0, lineHeight: 1.1 }}>
                        <InlineText
                          section="benefits"
                          fieldKey={"items." + realIdx + ".stat"}
                          value={item.stat ?? ""}
                          placeholder="24/7"
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          as="span"
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                        />
                      </p>
                      {(item.stat_label || isEditorMode) && (
                        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--dt-text-muted)", marginTop: "0.2rem" }}>
                          <InlineText
                            section="benefits"
                            fieldKey={"items." + realIdx + ".stat_label"}
                            value={item.stat_label ?? ""}
                            placeholder={isEN ? "Metric" : "Metrik"}
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
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                        borderRadius: "var(--dt-radius)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                        <DynamicIcon name={item.icon} defaultIcon={Star} className="w-5 h-5" />
                      </span>
                    </div>
                  )}

                  <InlineText
                    section="benefits"
                    fieldKey={"items." + realIdx + ".title"}
                    value={item.title ?? ""}
                    placeholder={isEN ? "Title..." : "Judul..."}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="h3"
                    style={{
                      fontFamily: "var(--dt-heading-font)",
                      fontWeight: 700,
                      color: "var(--dt-text)",
                      fontSize: "1.05rem",
                      margin: 0,
                      lineHeight: 1.35,
                    }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />

                  <InlineText
                    section="benefits"
                    fieldKey={"items." + realIdx + ".description"}
                    value={item.description ?? ""}
                    placeholder={isEN ? "Description..." : "Deskripsi..."}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="p"
                    style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}
                    multiline
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </div>

                {/* Inline Delete Button for Editor Mode */}
                {isEditorMode && (
                  <div className="absolute top-3 right-3">
                    <InlineDeleteButton
                      compact
                      onDelete={() => handleDeleteItem(realIdx)}
                      title={isEN ? "Delete benefit" : "Hapus keunggulan"}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {isEditorMode && onAddItem && (
            <div className="h-full">
              <InlineAddTile
                label={isEN ? "Add benefit" : "Tambah Keunggulan"}
                onClick={onAddItem}
                style={{ height: "100%", minHeight: "10rem", borderRadius: "var(--dt-radius-lg)" }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
