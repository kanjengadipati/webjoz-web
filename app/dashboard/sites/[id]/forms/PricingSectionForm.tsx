"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import type { BaseSectionFormProps } from "./types";

export function PricingSectionForm({
  content,
  updateField,
  fieldUndoStacks,
  undoField,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
        <p className="font-semibold text-primary">💳 Section Paket Harga & Rate Card</p>
        <p className="mt-1 text-primary/80">
          Atur paket layanan, rate card kolaborasi, atau tier langganan dengan perbandingan fitur yang jelas.
        </p>
      </div>

      <div className="space-y-3">
        <SidebarField
          section="pricing"
          fieldKey="eyebrow"
          label="Eyebrow"
          value={content.pricing?.eyebrow || ""}
          onChange={(val) => updateField("pricing", "eyebrow", val)}
          placeholder={t("dashboard.sitesEditor.phPricingEyebrow")}
          undoCount={fieldUndoStacks?.["pricing.eyebrow"]?.length}
          onUndo={() => undoField?.("pricing", "eyebrow")}
        />
        <SidebarField
          section="pricing"
          fieldKey="title"
          label="Judul Section"
          value={content.pricing?.title || ""}
          onChange={(val) => updateField("pricing", "title", val)}
          placeholder={t("dashboard.sitesEditor.phPricingSectionTitle")}
          undoCount={fieldUndoStacks?.["pricing.title"]?.length}
          onUndo={() => undoField?.("pricing", "title")}
        />
        <SidebarField
          section="pricing"
          fieldKey="subtitle"
          label="Subjudul (Opsional)"
          value={content.pricing?.subtitle || ""}
          onChange={(val) => updateField("pricing", "subtitle", val)}
          placeholder={t("dashboard.sitesEditor.phPricingSubtitle")}
          undoCount={fieldUndoStacks?.["pricing.subtitle"]?.length}
          onUndo={() => undoField?.("pricing", "subtitle")}
        />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            Daftar Paket
          </label>
          <button
            type="button"
            onClick={() => {
              const plans = [
                ...(content.pricing?.plans || []),
                {
                  name: "Paket Baru",
                  price: "Rp 1.000.000",
                  period: "/proyek",
                  description: "Deskripsi paket",
                  features: ["Fitur 1", "Fitur 2"],
                  cta_text: "Pilih Paket",
                  cta_url: "#contact",
                  is_featured: false,
                  badge: null,
                },
              ];
              updateField("pricing", "plans", plans);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Paket
          </button>
        </div>

        {(content.pricing?.plans || []).map((plan: any, idx: number) => (
          <div key={idx} className="p-3.5 border border-border rounded-xl space-y-3 bg-muted/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-sidebar-foreground">
                  Paket #{idx + 1}: {plan.name || "Tanpa Nama"}
                </span>
                {plan.is_featured && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-extrabold">
                    FEATURED
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  const plans = (content.pricing?.plans || []).filter((_: any, i: number) => i !== idx);
                  updateField("pricing", "plans", plans);
                }}
                className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Hapus
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Nama Paket</label>
                <input
                  type="text"
                  value={plan.name || ""}
                  onChange={(e) => {
                    const plans = [...(content.pricing?.plans || [])];
                    plans[idx] = { ...plans[idx], name: e.target.value };
                    updateField("pricing", "plans", plans);
                  }}
                  placeholder={t("dashboard.sitesEditor.phPricingPlanName")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Badge (cth. Terpopuler)</label>
                <input
                  type="text"
                  value={plan.badge || ""}
                  onChange={(e) => {
                    const plans = [...(content.pricing?.plans || [])];
                    plans[idx] = { ...plans[idx], badge: e.target.value || null };
                    updateField("pricing", "plans", plans);
                  }}
                  placeholder={t("dashboard.sitesEditor.phPricingBadge")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Harga</label>
                <input
                  type="text"
                  value={plan.price || ""}
                  onChange={(e) => {
                    const plans = [...(content.pricing?.plans || [])];
                    plans[idx] = { ...plans[idx], price: e.target.value };
                    updateField("pricing", "plans", plans);
                  }}
                  placeholder={t("dashboard.sitesEditor.phPricingPrice")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground font-semibold text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Periode / Satuan</label>
                <input
                  type="text"
                  value={plan.period || ""}
                  onChange={(e) => {
                    const plans = [...(content.pricing?.plans || [])];
                    plans[idx] = { ...plans[idx], period: e.target.value };
                    updateField("pricing", "plans", plans);
                  }}
                  placeholder={t("dashboard.sitesEditor.phPricingPeriod")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Deskripsi Singkat</label>
              <input
                type="text"
                value={plan.description || ""}
                onChange={(e) => {
                  const plans = [...(content.pricing?.plans || [])];
                  plans[idx] = { ...plans[idx], description: e.target.value };
                  updateField("pricing", "plans", plans);
                }}
                placeholder={t("dashboard.sitesEditor.phPricingDesc")}
                className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
              />
            </div>

            {/* Features list */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-sidebar-muted-foreground block">
                Daftar Fitur / Fasilitas (1 baris per fitur)
              </label>
              <textarea
                rows={3}
                value={(plan.features || []).join("\n")}
                onChange={(e) => {
                  const lines = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                  const plans = [...(content.pricing?.plans || [])];
                  plans[idx] = { ...plans[idx], features: lines };
                  updateField("pricing", "plans", plans);
                }}
                placeholder="1 Video TikTok/Reels&#10;Termasuk Hak Cipta 3 Bulan&#10;2x Revisi Video"
                className="w-full px-2.5 py-1.5 border border-border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground resize-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Teks Tombol CTA</label>
                <input
                  type="text"
                  value={plan.cta_text || ""}
                  onChange={(e) => {
                    const plans = [...(content.pricing?.plans || [])];
                    plans[idx] = { ...plans[idx], cta_text: e.target.value };
                    updateField("pricing", "plans", plans);
                  }}
                  placeholder={t("dashboard.sitesEditor.phPricingCtaText")}
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">URL Tombol CTA</label>
                <input
                  type="text"
                  value={plan.cta_url || ""}
                  onChange={(e) => {
                    const plans = [...(content.pricing?.plans || [])];
                    plans[idx] = { ...plans[idx], cta_url: e.target.value };
                    updateField("pricing", "plans", plans);
                  }}
                  placeholder="#contact"
                  className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={!!plan.is_featured}
                onChange={(e) => {
                  const plans = [...(content.pricing?.plans || [])];
                  plans[idx] = { ...plans[idx], is_featured: e.target.checked };
                  updateField("pricing", "plans", plans);
                }}
                className="rounded text-primary focus:ring-0"
              />
              <span className="text-[11px] text-sidebar-foreground">
                Tandai sebagai paket unggulan (Highlight / Featured)
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

