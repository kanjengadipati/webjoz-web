"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function PartnersSectionForm({
  content,
  updateField,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
        <p className="font-semibold text-primary">🤝 Section Mitra & Klien</p>
        <p className="mt-1 text-primary/80">
          Tampilkan logo atau nama brand yang pernah bekerja sama, klien utama, atau media yang meliput.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Eyebrow</label>
          <input
            type="text"
            value={content.partners?.eyebrow || ""}
            onChange={(e) => updateField("partners", "eyebrow", e.target.value)}
            placeholder={t("dashboard.sitesEditor.phPartnersEyebrow")}
            className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground`}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Judul Section</label>
          <input
            type="text"
            value={content.partners?.title || ""}
            onChange={(e) => updateField("partners", "title", e.target.value)}
            placeholder={t("dashboard.sitesEditor.phPartnersSectionTitle")}
            className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground`}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Subjudul (Opsional)</label>
          <input
            type="text"
            value={content.partners?.subtitle || ""}
            onChange={(e) => updateField("partners", "subtitle", e.target.value)}
            placeholder={t("dashboard.sitesEditor.phPartnersSubtitle")}
            className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground`}
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Daftar Mitra / Brand</label>
          <button
            type="button"
            onClick={() => {
              const items = [
                ...(content.partners?.items || []),
                { name: "Nama Brand", category: "", url: null, logo_url: null },
              ];
              updateField("partners", "items", items);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Mitra
          </button>
        </div>

        {(content.partners?.items || []).map((partner: any, idx: number) => (
          <div key={idx} className="p-3 border border-border rounded-xl space-y-2 bg-muted/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-sidebar-subtle-foreground">Mitra #{idx + 1}</span>
              <button
                type="button"
                onClick={() => {
                  const items = (content.partners?.items || []).filter((_: any, i: number) => i !== idx);
                  updateField("partners", "items", items);
                }}
                className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Hapus
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Nama Brand / Mitra</label>
                <input
                  type="text"
                  value={partner.name || ""}
                  onChange={(e) => {
                    const items = [...(content.partners?.items || [])];
                    items[idx] = { ...items[idx], name: e.target.value };
                    updateField("partners", "items", items);
                  }}
                  placeholder={t("dashboard.sitesEditor.phPartnersBrandName")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Kategori / Industri</label>
                <input
                  type="text"
                  value={partner.category || ""}
                  onChange={(e) => {
                    const items = [...(content.partners?.items || [])];
                    items[idx] = { ...items[idx], category: e.target.value };
                    updateField("partners", "items", items);
                  }}
                  placeholder={t("dashboard.sitesEditor.phPartnersCategory")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Tautan Website (Opsional)</label>
              <input
                type="text"
                value={partner.url || ""}
                onChange={(e) => {
                  const items = [...(content.partners?.items || [])];
                  items[idx] = { ...items[idx], url: e.target.value || null };
                  updateField("partners", "items", items);
                }}
                placeholder="https://example.com"
                className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

