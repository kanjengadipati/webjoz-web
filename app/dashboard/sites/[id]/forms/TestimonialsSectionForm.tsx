"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function TestimonialsSectionForm({
  content,
  updateField,
  fieldUndoStacks,
  undoField,
  renderFieldActions,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  const testimonials = content.testimonials;
  if (!testimonials) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span>
            {t("dashboard.sitesEditor.testimonialsEyebrow")}{" "}
            <span className="text-sidebar-subtle-foreground font-normal normal-case">
              {t("dashboard.sitesEditor.commonOptional")}
            </span>
          </span>
          {renderFieldActions?.("testimonials", "eyebrow")}
        </label>
        <input
          type="text"
          value={testimonials.eyebrow || ""}
          onChange={(e) => updateField("testimonials", "eyebrow", e.target.value)}
          placeholder={t("dashboard.sitesEditor.phTestimonialsEyebrow")}
          className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
        />
      </div>
      <SidebarField
        section="testimonials"
        fieldKey="title"
        label={t("dashboard.sitesEditor.testimonialsSectionTitle")}
        value={testimonials.title || ""}
        onChange={(val) => updateField("testimonials", "title", val)}
        placeholder={t("dashboard.sitesEditor.phTestimonialsSectionTitle")}
        undoCount={fieldUndoStacks?.["testimonials.title"]?.length}
        onUndo={() => undoField?.("testimonials", "title")}
      />
      <SidebarField
        section="testimonials"
        fieldKey="subtitle"
        label={t("dashboard.sitesEditor.testimonialsSubtitle")}
        value={testimonials.subtitle || ""}
        onChange={(val) => updateField("testimonials", "subtitle", val)}
        placeholder={t("dashboard.sitesEditor.phTestimonialsSubtitle")}
        undoCount={fieldUndoStacks?.["testimonials.subtitle"]?.length}
        onUndo={() => undoField?.("testimonials", "subtitle")}
      />
      {(testimonials.items || []).map((item: any, idx: number) => (
        <div key={idx} className="border border-border p-3 rounded-xl space-y-2.5 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-sidebar-subtle-foreground">
              {t("dashboard.sitesEditor.testimonialsItem")} #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => {
                const n = testimonials.items.filter((_: any, i: number) => i !== idx);
                updateField("testimonials", "items", n);
              }}
              className="text-red-400/70 hover:text-red-400 text-[11px] cursor-pointer"
            >
              {t("dashboard.sitesEditor.commonRemove")}
            </button>
          </div>
          <SidebarField
            section="testimonials"
            fieldKey={`items.${idx}.quote`}
            multiline
            rows={2}
            label={t("dashboard.sitesEditor.testimonialsQuote")}
            value={item.quote || ""}
            onChange={(val) => {
              const n = [...testimonials.items];
              n[idx] = { ...n[idx], quote: val };
              updateField("testimonials", "items", n);
            }}
            placeholder={t("dashboard.sitesEditor.phTestimonialsQuote")}
          />
          <div className="space-y-2">
            <div>
              <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">
                {t("dashboard.sitesEditor.testimonialsName")}
              </label>
              <input
                type="text"
                value={item.name || ""}
                onChange={(e) => {
                  const n = [...testimonials.items];
                  n[idx] = { ...n[idx], name: e.target.value };
                  updateField("testimonials", "items", n);
                }}
                placeholder={t("dashboard.sitesEditor.phTestimonialsName")}
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">
                {t("dashboard.sitesEditor.testimonialsRole")}
              </label>
              <input
                type="text"
                value={item.role || ""}
                onChange={(e) => {
                  const n = [...testimonials.items];
                  n[idx] = { ...n[idx], role: e.target.value };
                  updateField("testimonials", "items", n);
                }}
                placeholder={t("dashboard.sitesEditor.phTestimonialsRole")}
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 items-end">
            <div>
              <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">
                {t("dashboard.sitesEditor.testimonialsAvatarInitials")}
              </label>
              <input
                type="text"
                maxLength={2}
                value={item.avatar_initials || ""}
                onChange={(e) => {
                  const n = [...testimonials.items];
                  n[idx] = { ...n[idx], avatar_initials: e.target.value.toUpperCase().slice(0, 2) };
                  updateField("testimonials", "items", n);
                }}
                placeholder="BS"
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground uppercase`}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">
                {t("dashboard.sitesEditor.testimonialsAvatarColor")}
              </label>
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-md border border-border overflow-hidden flex-shrink-0">
                  <input
                    type="color"
                    value={item.avatar_color || "var(--primary)"}
                    onChange={(e) => {
                      const n = [...testimonials.items];
                      n[idx] = { ...n[idx], avatar_color: e.target.value };
                      updateField("testimonials", "items", n);
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: item.avatar_color || "var(--primary)" }} />
                </div>
                <input
                  type="text"
                  value={item.avatar_color || ""}
                  onChange={(e) => {
                    const n = [...testimonials.items];
                    n[idx] = { ...n[idx], avatar_color: e.target.value };
                    updateField("testimonials", "items", n);
                  }}
                  placeholder="var(--primary)"
                  className="flex-1 px-2.5 py-1.5 border border-border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground placeholder-sidebar-subtle-foreground"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">
                {t("dashboard.sitesEditor.testimonialsCompany")}{" "}
                <span className="text-sidebar-subtle-foreground font-normal normal-case">
                  {t("dashboard.sitesEditor.commonOptional")}
                </span>
              </label>
              <input
                type="text"
                value={item.company || ""}
                onChange={(e) => {
                  const n = [...testimonials.items];
                  n[idx] = { ...n[idx], company: e.target.value };
                  updateField("testimonials", "items", n);
                }}
                placeholder={t("dashboard.sitesEditor.phTestimonialsCompany")}
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">
                {t("dashboard.sitesEditor.testimonialsLogoUrl")}{" "}
                <span className="text-sidebar-subtle-foreground font-normal normal-case">
                  {t("dashboard.sitesEditor.testimonialsLogoUrlHint")}
                </span>
              </label>
              <input
                type="text"
                value={item.logo_url || ""}
                onChange={(e) => {
                  const n = [...testimonials.items];
                  n[idx] = { ...n[idx], logo_url: e.target.value };
                  updateField("testimonials", "items", n);
                }}
                placeholder="https://..."
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const current = testimonials.items || [];
          updateField("testimonials", "items", [
            ...current,
            {
              quote: "Pelayanan sangat memuaskan, ramah, dan hasilnya melebihi ekspektasi!",
              name: "Nama Pelanggan",
              role: "Pelanggan",
              avatar_initials: "NP",
              avatar_color: "var(--primary)",
              company: "",
              logo_url: "",
            },
          ]);
        }}
        className="w-full text-[12px] py-2 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.testimonialsAddItem")}
      </button>
    </div>
  );
}
