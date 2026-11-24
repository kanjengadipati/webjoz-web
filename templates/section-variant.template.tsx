"use client";
// TEMPLATE — salin file ini ke components/sections/<section>/<variant-name>.tsx
// lalu sesuaikan. Jangan hapus pola localization di bawah.
import React from "react";
import { InlineText } from "@/components/templates/shared";

export default function SectionVariantTemplate(props: any) {
  const isEditorMode = !!props?.isEditorMode;
  const isSelected = !!props?.isSelected;
  const onUpdateField = props?.onUpdateField;
  const collapseSheetForInlineEdit = props?.collapseSheetForInlineEdit;
  const onEditingStateChange = props?.onEditingStateChange;

  // 1) Selalu turunkan bahasa dari props (jangan hardcode satu bahasa).
  const isEN = props?.language === "en" || !!props?.isEN;

  // 2) Semua teks UI statis (placeholder, label, empty-state) WAJIB dua bahasa.
  const L = isEN
    ? { placeholder: "Add title...", empty: "No content yet" }
    : { placeholder: "Tambah judul...", empty: "Belum ada konten" };

  const value = props?.title ?? "";

  return (
    <section>
      {(value || isEditorMode) && (
        <InlineText
          section={props?.section ?? "section"}
          fieldKey="title"
          value={value}
          placeholder={L.placeholder}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
          as="span"
        />
      )}
      {!value && isEditorMode && <p className="text-sm opacity-60">{L.empty}</p>}
    </section>
  );
}