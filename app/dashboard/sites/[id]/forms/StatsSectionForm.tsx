"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import { IconPicker } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function StatsSectionForm({
  content,
  updateField,
  fieldUndoStacks,
  undoField,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
        <p className="font-semibold text-primary">📈 Section Statistik & Pencapaian</p>
        <p className="mt-1 text-primary/80">
          Tampilkan angka pencapaian, jumlah subscriber, kepuasan klien, atau metrik kunci untuk membangun kredibilitas instan.
        </p>
      </div>

      <div className="space-y-3">
        <SidebarField
          section="stats"
          fieldKey="eyebrow"
          label="Eyebrow (Label Atas)"
          value={content.stats?.eyebrow || ""}
          onChange={(val) => updateField("stats", "eyebrow", val)}
          placeholder={t("dashboard.sitesEditor.phStatsEyebrow")}
          undoCount={fieldUndoStacks?.["stats.eyebrow"]?.length}
          onUndo={() => undoField?.("stats", "eyebrow")}
        />
        <SidebarField
          section="stats"
          fieldKey="title"
          label="Judul Section"
          value={content.stats?.title || ""}
          onChange={(val) => updateField("stats", "title", val)}
          placeholder={t("dashboard.sitesEditor.phStatsSectionTitle")}
          undoCount={fieldUndoStacks?.["stats.title"]?.length}
          onUndo={() => undoField?.("stats", "title")}
        />
        <SidebarField
          section="stats"
          fieldKey="subtitle"
          label="Subjudul (Opsional)"
          value={content.stats?.subtitle || ""}
          onChange={(val) => updateField("stats", "subtitle", val)}
          placeholder={t("dashboard.sitesEditor.phStatsSubtitle")}
          undoCount={fieldUndoStacks?.["stats.subtitle"]?.length}
          onUndo={() => undoField?.("stats", "subtitle")}
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            Daftar Angka / Metrik
          </label>
          <button
            type="button"
            onClick={() => {
              const items = [
                ...(content.stats?.items || []),
                { value: "100+", label: "Metrik Baru", description: "", icon: "TrendingUp" },
              ];
              updateField("stats", "items", items);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Metrik
          </button>
        </div>

        {(content.stats?.items || []).map((item: any, idx: number) => (
          <div key={idx} className="p-3 border border-border rounded-xl space-y-2.5 bg-muted/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-sidebar-subtle-foreground">Metrik #{idx + 1}</span>
              <button
                type="button"
                onClick={() => {
                  const items = (content.stats?.items || []).filter((_: any, i: number) => i !== idx);
                  updateField("stats", "items", items);
                }}
                className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Hapus
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Angka / Value</label>
                <input
                  type="text"
                  value={item.value || ""}
                  onChange={(e) => {
                    const items = [...(content.stats?.items || [])];
                    items[idx] = { ...items[idx], value: e.target.value };
                    updateField("stats", "items", items);
                  }}
                  placeholder={t("dashboard.sitesEditor.phStatsValue")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Label</label>
                <input
                  type="text"
                  value={item.label || ""}
                  onChange={(e) => {
                    const items = [...(content.stats?.items || [])];
                    items[idx] = { ...items[idx], label: e.target.value };
                    updateField("stats", "items", items);
                  }}
                  placeholder={t("dashboard.sitesEditor.phStatsLabel")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Ikon</label>
                <IconPicker
                  value={item.icon || "TrendingUp"}
                  onChange={(iconName) => {
                    const items = [...(content.stats?.items || [])];
                    items[idx] = { ...items[idx], icon: iconName };
                    updateField("stats", "items", items);
                  }}
                />
              </div>
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Keterangan (Opsional)</label>
                <input
                  type="text"
                  value={item.description || ""}
                  onChange={(e) => {
                    const items = [...(content.stats?.items || [])];
                    items[idx] = { ...items[idx], description: e.target.value };
                    updateField("stats", "items", items);
                  }}
                  placeholder={t("dashboard.sitesEditor.phStatsDescription")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

