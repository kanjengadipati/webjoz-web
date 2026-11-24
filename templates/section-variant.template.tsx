"use client";
// TEMPLATE — salin file ini ke components/sections/<section>/<variant-name>.tsx
// dan gunakan typed dictionary localization dari components/sections/<section>/<section>-strings.ts
import React from "react";
import { InlineText } from "@/components/templates/shared";
// import { sectionStrings } from "./<section>-strings";

interface LocalStrings {
  titlePlaceholder: string;
  emptyState: string;
}

const ID: LocalStrings = {
  titlePlaceholder: "Judul...",
  emptyState: "Belum ada konten",
};

const EN: LocalStrings = {
  titlePlaceholder: "Title...",
  emptyState: "No content yet",
};

function localStrings(language?: "id" | "en"): LocalStrings {
  return (language ?? "id") === "en" ? EN : ID;
}

export default function SectionVariantTemplate(props: any) {
  const isEditorMode = !!props?.isEditorMode;
  const isSelected = !!props?.isSelected;
  const onUpdateField = props?.onUpdateField;
  const collapseSheetForInlineEdit = props?.collapseSheetForInlineEdit;
  const onEditingStateChange = props?.onEditingStateChange;

  // 1) Standar localization: typed dictionary (L.*), BUKAN inline `isEN ? ... : ...`.
  const L = localStrings(props?.language ?? (props?.isEN ? "en" : "id"));

  const value = props?.title ?? "";

  return (
    <section>
      {(value || isEditorMode) && (
        <InlineText
          section={props?.section ?? "section"}
          fieldKey="title"
          value={value}
          placeholder={L.titlePlaceholder}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
          as="span"
        />
      )}
      {!value && isEditorMode && <p className="text-sm opacity-60">{L.emptyState}</p>}
    </section>
  );
}
