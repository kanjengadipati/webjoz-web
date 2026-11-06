"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import FileUpload from "@/components/file-upload";
import { CollapsibleGroup, AiImageButton, SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function AboutSectionForm({
  content,
  updateField,
  needsAttention,
  fieldClass,
  fieldUndoStacks,
  undoField,
  renderFieldActions,
  businessType,
  handleAiImage,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  if (!content.about) return null;

  return (
    <div className="space-y-3">
      {/* About Image */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span>{t("dashboard.sitesEditor.aboutImage")}</span>
          <AiImageButton
            businessType={businessType}
            onSelect={(url) => {
              if (handleAiImage) {
                handleAiImage("about", "image_url", url);
              } else {
                updateField("about", "image_url", url);
              }
            }}
          />
        </label>
        <FileUpload
          label=""
          value={content.about.image_url || ""}
          onChange={(val) => updateField("about", "image_url", val)}
          placeholder="https://..."
          maxWidth={1000}
          maxHeight={1000}
          quality={0.8}
        />
      </div>

      {/* Text Align */}
      <div className="space-y-1">
        <label className="text-[10px] text-sidebar-subtle-foreground uppercase">
          {t("dashboard.sitesEditor.commonTextAlign")}
        </label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => updateField("about", "textAlign", align === "left" ? undefined : align)}
              className={`flex-1 px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                (content.about.textAlign || "left") === align
                  ? "bg-primary/20 border-primary/60 text-primary"
                  : "border-border text-sidebar-muted-foreground hover:border-border"
              }`}
            >
              {t(`dashboard.sitesEditor.common${align.charAt(0).toUpperCase() + align.slice(1)}` as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Eyebrow */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span>
            {t("dashboard.sitesEditor.commonEyebrow")}{" "}
            <span className="text-sidebar-subtle-foreground font-normal normal-case">
              {t("dashboard.sitesEditor.commonOptional")}
            </span>
          </span>
          {renderFieldActions?.("about", "eyebrow")}
        </label>
        <input
          type="text"
          value={content.about?.eyebrow || ""}
          onChange={(e) => updateField("about", "eyebrow", e.target.value)}
          placeholder={t("dashboard.sitesEditor.phAboutEyebrow")}
          className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
        />
      </div>

      {/* Title */}
      <SidebarField
        section="about"
        fieldKey="title"
        label={t("dashboard.sitesEditor.commonTitle")}
        value={content.about.title || ""}
        onChange={(val) => updateField("about", "title", val)}
        needsAttention={needsAttention("about.title")}
        inputClassName={fieldClass("about.title", "")}
        undoCount={fieldUndoStacks?.["about.title"]?.length}
        onUndo={() => undoField?.("about", "title")}
      />

      {/* Body */}
      <SidebarField
        section="about"
        fieldKey="body"
        multiline
        rows={3}
        label={t("dashboard.sitesEditor.commonDescription")}
        value={content.about.body || ""}
        onChange={(val) => updateField("about", "body", val)}
        needsAttention={needsAttention("about.body")}
        inputClassName={fieldClass("about.body", "")}
        undoCount={fieldUndoStacks?.["about.body"]?.length}
        onUndo={() => undoField?.("about", "body")}
      />

      {/* Highlight Stats */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground block">
          {t("dashboard.sitesEditor.aboutStatHighlight")}
        </label>
        {[1, 2, 3].map((n) => {
          const statKey = `highlight_stat_${n}` as "highlight_stat_1" | "highlight_stat_2" | "highlight_stat_3";
          const stat = (content.about as any)[statKey] as { value?: string; label?: string } | undefined;
          return (
            <div key={n} className="border border-border rounded-md p-2 space-y-1.5 bg-muted/30">
              <span className="text-[10px] text-sidebar-subtle-foreground uppercase font-bold">
                {t("dashboard.sitesEditor.aboutStat")} {n}
              </span>
              <div className="flex gap-2">
                <div className="flex-1 space-y-0.5">
                  <label className="text-[10px] text-sidebar-subtle-foreground">
                    {t("dashboard.sitesEditor.aboutStatValue")}
                  </label>
                  <input
                    type="text"
                    value={stat?.value || ""}
                    onChange={(e) => updateField("about", statKey, { ...(stat || {}), value: e.target.value })}
                    placeholder={t("dashboard.sitesEditor.phStatValue")}
                    className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                  />
                </div>
                <div className="flex-1 space-y-0.5">
                  <label className="text-[10px] text-sidebar-subtle-foreground">
                    {t("dashboard.sitesEditor.aboutStatLabel")}
                  </label>
                  <input
                    type="text"
                    value={stat?.label || ""}
                    onChange={(e) => updateField("about", statKey, { ...(stat || {}), label: e.target.value })}
                    placeholder={t("dashboard.sitesEditor.phStatLabel")}
                    className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link CV / Resume */}
      <div className="space-y-2 p-2.5 rounded-lg border border-border bg-muted/20">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground block">
          📄 Link CV / Resume (Portofolio)
        </label>
        <div className="space-y-1">
          <label className="text-[10px] text-sidebar-muted-foreground block">URL File CV (Google Drive, Dropbox, dll)</label>
          <input
            type="text"
            value={content.about?.cv_url || ""}
            onChange={(e) => updateField("about", "cv_url", e.target.value)}
            placeholder="https://drive.google.com/..."
            className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-sidebar-muted-foreground block">Teks Tombol (Default: Unduh CV / Resume)</label>
          <input
            type="text"
            value={content.about?.cv_label || ""}
            onChange={(e) => updateField("about", "cv_label", e.target.value)}
            placeholder="Unduh CV / Resume"
            className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
          />
        </div>
      </div>

      {/* Milestones */}
      <CollapsibleGroup label={t("dashboard.sitesEditor.aboutMilestones")} defaultOpen={false}>
        {((content.about?.milestones as any[]) || []).map((m: any, idx: number) => (
          <div key={idx} className="border border-border rounded-md p-2 space-y-1.5 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-sidebar-subtle-foreground uppercase font-bold">
                {t("dashboard.sitesEditor.aboutMilestone")} {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  const arr = [...(content.about?.milestones || [])];
                  arr.splice(idx, 1);
                  updateField("about", "milestones", arr);
                }}
                className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer"
              >
                {t("dashboard.sitesEditor.commonRemove")}
              </button>
            </div>
            <input
              type="text"
              value={m.year || ""}
              onChange={(e) => {
                const arr = [...(content.about?.milestones || [])];
                arr[idx] = { ...arr[idx], year: e.target.value };
                updateField("about", "milestones", arr);
              }}
              placeholder={t("dashboard.sitesEditor.aboutMilestoneYear")}
              className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
            />
            <input
              type="text"
              value={m.title || ""}
              onChange={(e) => {
                const arr = [...(content.about?.milestones || [])];
                arr[idx] = { ...arr[idx], title: e.target.value };
                updateField("about", "milestones", arr);
              }}
              placeholder={t("dashboard.sitesEditor.aboutMilestoneTitle")}
              className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
            />
            <textarea
              rows={1}
              value={m.description || ""}
              onChange={(e) => {
                const arr = [...(content.about?.milestones || [])];
                arr[idx] = { ...arr[idx], description: e.target.value };
                updateField("about", "milestones", arr);
              }}
              placeholder={t("dashboard.sitesEditor.aboutMilestoneDesc")}
              className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground resize-none"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            updateField("about", "milestones", [
              ...(content.about?.milestones || []),
              { year: new Date().getFullYear().toString(), title: "Milestone Baru", description: "" },
            ])
          }
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary/80 hover:text-primary cursor-pointer"
        >
          <Plus className="w-3 h-3" /> {t("dashboard.sitesEditor.aboutAddMilestone")}
        </button>
      </CollapsibleGroup>

      {/* Team Members */}
      <CollapsibleGroup label={t("dashboard.sitesEditor.aboutTeamMembers")} defaultOpen={false}>
        {((content.about?.team_members as any[]) || []).map((m: any, idx: number) => (
          <div key={idx} className="border border-border rounded-md p-2 space-y-1.5 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-sidebar-subtle-foreground uppercase font-bold">
                {t("dashboard.sitesEditor.aboutTeamMember")} {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  const arr = [...(content.about?.team_members || [])];
                  arr.splice(idx, 1);
                  updateField("about", "team_members", arr);
                }}
                className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer"
              >
                {t("dashboard.sitesEditor.commonRemove")}
              </button>
            </div>
            <input
              type="text"
              value={m.name || ""}
              onChange={(e) => {
                const arr = [...(content.about?.team_members || [])];
                arr[idx] = { ...arr[idx], name: e.target.value };
                updateField("about", "team_members", arr);
              }}
              placeholder={t("dashboard.sitesEditor.commonName")}
              className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
            />
            <input
              type="text"
              value={m.role || ""}
              onChange={(e) => {
                const arr = [...(content.about?.team_members || [])];
                arr[idx] = { ...arr[idx], role: e.target.value };
                updateField("about", "team_members", arr);
              }}
              placeholder={t("dashboard.sitesEditor.commonRole")}
              className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
            />
            <FileUpload
              label={t("dashboard.sitesEditor.commonPhoto")}
              value={m.photo_url || ""}
              onChange={(val) => {
                const arr = [...(content.about?.team_members || [])];
                arr[idx] = { ...arr[idx], photo_url: val };
                updateField("about", "team_members", arr);
              }}
              placeholder="https://..."
              maxWidth={400}
              maxHeight={400}
              quality={0.85}
              previewSize="sm"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            updateField("about", "team_members", [
              ...(content.about?.team_members || []),
              { name: "Nama Anggota", role: "Jabatan", photo_url: "" },
            ])
          }
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary/80 hover:text-primary cursor-pointer"
        >
          <Plus className="w-3 h-3" /> {t("dashboard.sitesEditor.aboutAddTeamMember")}
        </button>
      </CollapsibleGroup>
    </div>
  );
}

