"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function FaqSectionForm({
  content,
  updateField,
  needsAttention,
  fieldClass,
  fieldUndoStacks,
  undoField,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  if (!content.faq) return null;

  return (
    <div className="space-y-3">
      <SidebarField
        section="faq"
        fieldKey="title"
        label={t("dashboard.sitesEditor.faqSectionTitle")}
        value={content.faq.title || ""}
        onChange={(val) => updateField("faq", "title", val)}
        needsAttention={needsAttention("faq.title")}
        inputClassName={fieldClass("faq.title", "")}
        undoCount={fieldUndoStacks?.["faq.title"]?.length}
        onUndo={() => undoField?.("faq", "title")}
      />
      {content.faq.items?.map((item: any, idx: number) => (
        <div key={idx} className="border border-border p-2.5 rounded-lg space-y-2 bg-muted/40">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.faqItem")} #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => {
                const n = content.faq.items.filter((_: any, i: number) => i !== idx);
                updateField("faq", "items", n);
              }}
              className="text-red-400 text-[11px] cursor-pointer"
            >
              {t("dashboard.sitesEditor.commonRemove")}
            </button>
          </div>
          <input
            type="text"
            value={item.question || ""}
            onChange={(e) => {
              const n = [...content.faq.items];
              n[idx].question = e.target.value;
              updateField("faq", "items", n);
            }}
            placeholder={t("dashboard.sitesEditor.faqQuestion")}
            className={fieldClass(`faq.items.${idx}.question`, SIDEBAR_FIELD_CLASS)}
          />
          <SidebarField
            section="faq"
            fieldKey={`items.${idx}.answer`}
            multiline
            rows={2}
            value={item.answer || ""}
            onChange={(val) => {
              const n = [...content.faq.items];
              n[idx].answer = val;
              updateField("faq", "items", n);
            }}
            placeholder={t("dashboard.sitesEditor.faqAnswer")}
            inputClassName={fieldClass(`faq.items.${idx}.answer`, "")}
          />
          <input
            type="text"
            value={item.category || ""}
            onChange={(e) => {
              const n = [...content.faq.items];
              n[idx] = { ...n[idx], category: e.target.value };
              updateField("faq", "items", n);
            }}
            placeholder={`${t("dashboard.sitesEditor.faqCategory")} ${t("dashboard.sitesEditor.faqCategoryHint")}`}
            className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const n = [
            ...(content.faq.items || []),
            { question: "Pertanyaan yang sering ditanya?", answer: "Jawaban pertanyaan di sini" },
          ];
          updateField("faq", "items", n);
        }}
        className="w-full text-[12px] py-1.5 border border-border rounded-lg text-sidebar-muted-foreground hover:bg-sidebar-muted flex items-center justify-center gap-1 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.faqAddItem")}
      </button>
    </div>
  );
}

