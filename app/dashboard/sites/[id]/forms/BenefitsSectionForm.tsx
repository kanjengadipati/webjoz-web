"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import { CollapsibleGroup, IconPicker, SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function BenefitsSectionForm({
  content,
  updateField,
  needsAttention,
  fieldClass,
  fieldUndoStacks,
  undoField,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  if (!content.benefits) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.benefitsEyebrow")}{" "}
          <span className="text-sidebar-subtle-foreground font-normal normal-case">
            {t("dashboard.sitesEditor.commonOptional")}
          </span>
        </label>
        <input
          type="text"
          value={content.benefits?.eyebrow || ""}
          onChange={(e) => updateField("benefits", "eyebrow", e.target.value)}
          placeholder={t("dashboard.sitesEditor.phWhyChooseUs")}
          className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
        />
      </div>
      <SidebarField
        section="benefits"
        fieldKey="title"
        label={t("dashboard.sitesEditor.benefitsSectionTitle")}
        value={content.benefits.title || ""}
        onChange={(val) => updateField("benefits", "title", val)}
        needsAttention={needsAttention("benefits.title")}
        inputClassName={fieldClass("benefits.title", "")}
        undoCount={fieldUndoStacks?.["benefits.title"]?.length}
        onUndo={() => undoField?.("benefits", "title")}
      />
      <SidebarField
        section="benefits"
        fieldKey="subtitle"
        label={t("dashboard.sitesEditor.benefitsSubtitle")}
        value={content.benefits?.subtitle || ""}
        onChange={(val) => updateField("benefits", "subtitle", val)}
        placeholder={t("dashboard.sitesEditor.phBenefitsSubtitle")}
        undoCount={fieldUndoStacks?.["benefits.subtitle"]?.length}
        onUndo={() => undoField?.("benefits", "subtitle")}
      />
      <div className="space-y-1">
        <label className="text-[10px] text-sidebar-subtle-foreground uppercase">
          {t("dashboard.sitesEditor.commonTextAlign")}
        </label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => updateField("benefits", "textAlign", align === "center" ? undefined : align)}
              className={`flex-1 px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                (content.benefits.textAlign || "center") === align
                  ? "bg-primary/20 border-primary/60 text-primary"
                  : "border-border text-sidebar-muted-foreground hover:border-border"
              }`}
            >
              {t(`dashboard.sitesEditor.common${align.charAt(0).toUpperCase() + align.slice(1)}` as any)}
            </button>
          ))}
        </div>
      </div>
      {content.benefits.items?.map((item: any, idx: number) => (
        <div key={idx} className="border border-border p-2.5 rounded-lg space-y-2 bg-muted/40">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-sidebar-muted-foreground">#{idx + 1}</span>
            <button
              type="button"
              onClick={() => {
                const n = content.benefits.items.filter((_: any, i: number) => i !== idx);
                updateField("benefits", "items", n);
              }}
              className="text-red-400 text-[11px] cursor-pointer"
            >
              {t("dashboard.sitesEditor.commonRemove")}
            </button>
          </div>
          <input
            type="text"
            value={item.title || ""}
            onChange={(e) => {
              const n = [...content.benefits.items];
              n[idx].title = e.target.value;
              updateField("benefits", "items", n);
            }}
            placeholder={t("dashboard.sitesEditor.benefitsItemTitle")}
            className={fieldClass(`benefits.items.${idx}.title`, SIDEBAR_FIELD_CLASS)}
          />
          <SidebarField
            section="benefits"
            fieldKey={`items.${idx}.description`}
            multiline
            rows={2}
            value={item.description || ""}
            onChange={(val) => {
              const n = [...content.benefits.items];
              n[idx].description = val;
              updateField("benefits", "items", n);
            }}
            placeholder={t("dashboard.sitesEditor.benefitsItemDesc")}
            inputClassName={fieldClass(`benefits.items.${idx}.description`, "")}
          />
          <div className="space-y-1.5">
            <label className="text-[10px] text-sidebar-subtle-foreground uppercase">
              {t("dashboard.sitesEditor.commonIcon")}
            </label>
            <IconPicker
              value={item.icon || ""}
              onChange={(name) => {
                const n = [...content.benefits.items];
                n[idx].icon = name;
                updateField("benefits", "items", n);
              }}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 space-y-0.5">
              <label className="text-[10px] text-sidebar-subtle-foreground uppercase">
                {t("dashboard.sitesEditor.commonStat")}
              </label>
              <input
                type="text"
                value={item.stat || ""}
                onChange={(e) => {
                  const n = [...content.benefits.items];
                  n[idx].stat = e.target.value;
                  updateField("benefits", "items", n);
                }}
                placeholder={t("dashboard.sitesEditor.phStatValue")}
                className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
              />
            </div>
            <div className="flex-1 space-y-0.5">
              <label className="text-[10px] text-sidebar-subtle-foreground uppercase">
                {t("dashboard.sitesEditor.benefitsStatLabel")}
              </label>
              <input
                type="text"
                value={item.stat_label || ""}
                onChange={(e) => {
                  const n = [...content.benefits.items];
                  n[idx].stat_label = e.target.value;
                  updateField("benefits", "items", n);
                }}
                placeholder={t("dashboard.sitesEditor.phBenefitsStat")}
                className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const n = [
            ...(content.benefits.items || []),
            { title: "Manfaat Baru", description: "Deskripsi manfaat ini" },
          ];
          updateField("benefits", "items", n);
        }}
        className="w-full text-[12px] py-1.5 border border-border rounded-lg text-sidebar-muted-foreground hover:bg-sidebar-muted flex items-center justify-center gap-1 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.benefitsAddItem")}
      </button>

      {/* Comparison table */}
      <CollapsibleGroup label={t("dashboard.sitesEditor.benefitsComparisonTable")} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <label className="text-[10px] text-sidebar-subtle-foreground uppercase">
              {t("dashboard.sitesEditor.benefitsComparisonColA")}
            </label>
            <input
              type="text"
              value={content.benefits?.comparison?.column_a_label || ""}
              onChange={(e) =>
                updateField("benefits", "comparison", {
                  ...(content.benefits?.comparison || {}),
                  column_a_label: e.target.value,
                })
              }
              placeholder={t("dashboard.sitesEditor.phBenefitsColA")}
              className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
            />
          </div>
          <div className="space-y-0.5">
            <label className="text-[10px] text-sidebar-subtle-foreground uppercase">
              {t("dashboard.sitesEditor.benefitsComparisonColB")}
            </label>
            <input
              type="text"
              value={content.benefits?.comparison?.column_b_label || ""}
              onChange={(e) =>
                updateField("benefits", "comparison", {
                  ...(content.benefits?.comparison || {}),
                  column_b_label: e.target.value,
                })
              }
              placeholder={t("dashboard.sitesEditor.phBenefitsColB")}
              className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
            />
          </div>
        </div>
        {((content.benefits?.comparison?.rows as any[]) || []).map((row: any, idx: number) => (
          <div key={idx} className="border border-border rounded-md p-2 space-y-1.5 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-sidebar-subtle-foreground uppercase font-bold">
                {t("dashboard.sitesEditor.benefitsComparisonRow")} {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  const arr = [...(content.benefits?.comparison?.rows || [])];
                  arr.splice(idx, 1);
                  updateField("benefits", "comparison", {
                    ...(content.benefits?.comparison || {}),
                    rows: arr,
                  });
                }}
                className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer"
              >
                {t("dashboard.sitesEditor.commonRemove")}
              </button>
            </div>
            <input
              type="text"
              value={row.label || ""}
              onChange={(e) => {
                const arr = [...(content.benefits?.comparison?.rows || [])];
                arr[idx] = { ...arr[idx], label: e.target.value };
                updateField("benefits", "comparison", {
                  ...(content.benefits?.comparison || {}),
                  rows: arr,
                });
              }}
              placeholder={t("dashboard.sitesEditor.phComparisonLabel")}
              className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={row.value_a || ""}
                onChange={(e) => {
                  const arr = [...(content.benefits?.comparison?.rows || [])];
                  arr[idx] = { ...arr[idx], value_a: e.target.value };
                  updateField("benefits", "comparison", {
                    ...(content.benefits?.comparison || {}),
                    rows: arr,
                  });
                }}
                placeholder={t("dashboard.sitesEditor.phValueA")}
                className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
              />
              <input
                type="text"
                value={row.value_b || ""}
                onChange={(e) => {
                  const arr = [...(content.benefits?.comparison?.rows || [])];
                  arr[idx] = { ...arr[idx], value_b: e.target.value };
                  updateField("benefits", "comparison", {
                    ...(content.benefits?.comparison || {}),
                    rows: arr,
                  });
                }}
                placeholder={t("dashboard.sitesEditor.phValueB")}
                className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const arr = [
              ...(content.benefits?.comparison?.rows || []),
              { label: "", value_a: "✓", value_b: "✗" },
            ];
            updateField("benefits", "comparison", {
              ...(content.benefits?.comparison || {}),
              rows: arr,
            });
          }}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary/80 hover:text-primary cursor-pointer"
        >
          <Plus className="w-3 h-3" /> {t("dashboard.sitesEditor.benefitsAddRow")}
        </button>
      </CollapsibleGroup>
    </div>
  );
}

