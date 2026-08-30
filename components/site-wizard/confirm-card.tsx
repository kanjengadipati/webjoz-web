"use client";

import React from "react";
import { Wand2, Loader2, Building2, Calendar, Palette, ShoppingBag, UtensilsCrossed, Tag, Sparkles } from "lucide-react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { BUSINESS_TYPES, SUB_TYPES } from "./constants";
import type { ChatStage, PreviewState } from "./types";
import { useI18n } from "@/lib/i18n/context";

interface ConfirmCardProps {
  businessName: string;
  businessType: string;
  businessSubType: string;
  whatsapp: string;
  serviceArea: string;
  draftName: string;
  draftWA: string;
  draftServiceArea: string;
  siteLanguage?: "id" | "en";
  editingField: string | null;
  previewState: PreviewState;
  hasUnsavedEdits: boolean;
  isLoading: boolean;
  onSetDraftName: (v: string) => void;
  onSetDraftWA: (v: string) => void;
  onSetDraftServiceArea: (v: string) => void;
  onSetSiteLanguage?: (lang: "id" | "en") => void;
  onSetEditingField: (v: string | null) => void;
  onSetBusinessType: (v: string) => void;
  onSetBusinessSubType: (v: string) => void;
  onSetBusinessName: (v: string) => void;
  onSetWhatsapp: (v: string) => void;
  onSetServiceArea: (v: string) => void;
  onSetHasUnsavedEdits: (v: boolean) => void;
  onSetDescription: (v: string) => void;
  onGenerate: () => void;
}

const rowBorder = { borderColor: "rgba(255,255,255,0.06)" };
const chipDefault = { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#64748b" };
const chipActive = { background: "color-mix(in srgb, var(--primary) 15%, transparent)", borderColor: "var(--primary)", color: "var(--primary)" };
const editBtn = { color: "var(--primary)", background: "color-mix(in srgb, var(--primary) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)" };

function saveField(
  field: string,
  props: ConfirmCardProps
) {
  if (field === "name" && props.draftName.trim()) {
    props.onSetBusinessName(props.draftName.trim());
    props.onSetHasUnsavedEdits(true);
  }
  if (field === "wa") {
    const digits = props.draftWA.replace(/\D/g, "");
    const normalized = digits ? (digits.startsWith("62") ? "+" + digits : digits.startsWith("0") ? "+62" + digits.slice(1) : "+62" + digits) : "";
    props.onSetWhatsapp(normalized);
    props.onSetHasUnsavedEdits(true);
  }
  if (field === "service_area") {
    props.onSetServiceArea(props.draftServiceArea.trim());
    props.onSetHasUnsavedEdits(true);
  }
  props.onSetEditingField(null);
}

function InlineEditInput({ value, onChange, onSave, onCancel }: { value: string; onChange: (v: string) => void; onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center gap-1 flex-1">
      <input
        autoFocus
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel(); }}
        className="flex-1 bg-transparent text-[12px] text-white outline-none border-b border-primary/50 py-0.5"
      />
      <button type="button" onClick={onSave} className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">✓</button>
      <button type="button" onClick={onCancel} className="text-[10px] text-slate-500 px-1">✕</button>
    </div>
  );
}

export function ConfirmCard(props: ConfirmCardProps) {
  const { t } = useI18n();
  const { editingField, businessType, businessSubType } = props;
  const showGenerate = props.previewState !== "result" || props.hasUnsavedEdits;

  return (
    <div className="flex gap-2.5 justify-start animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 text-primary-foreground">
        <SparkleGenAI className="w-[18px] h-[18px]" />
      </div>
      <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{t("dashboard.wizard.confirmCardTitle", "Hampir jadi — cek dan lengkapi")}</p>
        </div>

        {/* NAMA */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-t" style={rowBorder}>
          <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">{t("dashboard.wizard.confirmCardLabelName", "Nama")}</span>
          {editingField === "name" ? (
            <InlineEditInput
              value={props.draftName}
              onChange={props.onSetDraftName}
              onSave={() => saveField("name", props)}
              onCancel={() => props.onSetEditingField(null)}
            />
          ) : (
            <>
              <span className="text-[12px] font-semibold text-white flex-1 truncate">{props.draftName || props.businessName}</span>
              <button type="button" onClick={() => { props.onSetDraftName(props.businessName); props.onSetEditingField("name"); }} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>{t("dashboard.wizard.confirmCardBtnChange", "Ubah")}</button>
            </>
          )}
        </div>

        {/* JENIS */}
        <div className="px-3 py-1.5 border-t" style={rowBorder}>
          {editingField === "type" ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">{t("dashboard.wizard.confirmCardLabelTypeHeader", "Jenis Bisnis")}</span>
                <button onClick={() => props.onSetEditingField(null)} className="text-[10px] text-slate-500">{t("dashboard.wizard.confirmCardBtnClose", "✕ tutup")}</button>
              </div>
              <div className="flex flex-wrap gap-1">
                {BUSINESS_TYPES.map(bt => {
                  const categoryKeyMap: Record<string, { label: string; desc: string }> = {
                    "Kuliner": { label: "kuliner", desc: "kulinerDesc" },
                    "Toko": { label: "tokoUmkm", desc: "tokoUmkmDesc" },
                    "Toko & UMKM": { label: "tokoUmkm", desc: "tokoUmkmDesc" },
                    "Layanan & Reservasi": { label: "jasaBooking", desc: "jasaBookingDesc" },
                    "Jasa & Booking": { label: "jasaBooking", desc: "jasaBookingDesc" },
                    "Kreatif & Profesional": { label: "portofolioKreator", desc: "portofolioKreatorDesc" },
                    "Portofolio & Kreator": { label: "portofolioKreator", desc: "portofolioKreatorDesc" },
                    "Company Profile": { label: "company", desc: "companyDesc" },
                    "Company": { label: "company", desc: "companyDesc" },
                  };
                  const categoryIconMap: Record<string, React.ReactNode> = {
                    "Kuliner": <UtensilsCrossed className="w-3 h-3" />,
                    "Toko": <ShoppingBag className="w-3 h-3" />,
                    "Toko & UMKM": <ShoppingBag className="w-3 h-3" />,
                    "Layanan & Reservasi": <Calendar className="w-3 h-3" />,
                    "Jasa & Booking": <Calendar className="w-3 h-3" />,
                    "Kreatif & Profesional": <Palette className="w-3 h-3" />,
                    "Portofolio & Kreator": <Palette className="w-3 h-3" />,
                    "Company Profile": <Building2 className="w-3 h-3" />,
                    "Company": <Building2 className="w-3 h-3" />,
                  };
                  const keys = categoryKeyMap[bt.value];
                  const translatedLabel = keys ? t(`dashboard.wizard.categories.${keys.label}`, bt.label) : bt.label;
                  return (
                    <button key={bt.value} type="button" onClick={() => { props.onSetBusinessType(bt.value); props.onSetBusinessSubType(""); props.onSetDescription(""); props.onSetHasUnsavedEdits(true); }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all"
                      style={businessType === bt.value ? chipActive : chipDefault}>
                      {categoryIconMap[bt.value] || <Sparkles className="w-3 h-3" />}
                      <span>{translatedLabel}</span>
                    </button>
                  );
                })}
              </div>
              {businessType && SUB_TYPES[businessType] && (
                <div className="flex flex-wrap gap-1">
                  {SUB_TYPES[businessType].map(st => {
                    const isSubSelected = businessSubType === st.value;
                    const labelText = t(`dashboard.wizard.subtypes.${st.value}`, st.label);
                    return (
                      <button key={st.value} type="button" onClick={() => {
                        const nextSubType = isSubSelected ? "" : st.value;
                        props.onSetBusinessSubType(nextSubType);
                        props.onSetDescription("");
                        props.onSetHasUnsavedEdits(true);
                      }}
                        title={labelText}
                        className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all duration-200 max-w-full"
                        style={isSubSelected ? { background: "rgba(52,211,153,0.15)", borderColor: "#34d399", color: "#34d399" } : chipDefault}>
                        <Tag className="w-2.5 h-2.5 shrink-0" />
                        <span className={`transition-all duration-200 text-left ${isSubSelected ? "max-w-none" : "max-w-[125px] sm:max-w-[150px] truncate hover:max-w-none"}`}>
                          {labelText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">{t("dashboard.wizard.confirmCardLabelType", "Jenis")}</span>
              <span className="text-[12px] text-white flex-1 truncate">
                {(() => {
                  const categoryKeyMap: Record<string, string> = {
                    "Kuliner": "kuliner",
                    "Toko": "tokoUmkm",
                    "Toko & UMKM": "tokoUmkm",
                    "Layanan & Reservasi": "jasaBooking",
                    "Jasa & Booking": "jasaBooking",
                    "Kreatif & Profesional": "portofolioKreator",
                    "Portofolio & Kreator": "portofolioKreator",
                    "Company Profile": "company",
                    "Company": "company",
                  };
                  const typeKey = categoryKeyMap[businessType];
                  const translatedType = typeKey ? t(`dashboard.wizard.categories.${typeKey}`, businessType) : businessType;
                  const translatedSubType = businessSubType ? t(`dashboard.wizard.subtypes.${businessSubType}`, businessSubType) : "";
                  const label = [translatedType, translatedSubType].filter(Boolean).join(" › ");
                  return <span>{label}</span>;
                })()}
              </span>
              <button type="button" onClick={() => props.onSetEditingField("type")} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>{t("dashboard.wizard.confirmCardBtnChange", "Ubah")}</button>
            </div>
          )}
        </div>

        {/* WA */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-t" style={rowBorder}>
          <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">{t("dashboard.wizard.confirmCardLabelWA", "WA")}</span>
          {editingField === "wa" ? (
            <InlineEditInput
              value={props.draftWA}
              onChange={props.onSetDraftWA}
              onSave={() => saveField("wa", props)}
              onCancel={() => props.onSetEditingField(null)}
            />
          ) : (
            <>
              <span className="text-[12px] text-slate-300 flex-1 truncate">{props.draftWA || <span className="text-slate-600 italic">—</span>}</span>
              <button type="button" onClick={() => { props.onSetDraftWA(props.whatsapp); props.onSetEditingField("wa"); }}
                className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={props.draftWA ? editBtn : { color: "#0ea5e9", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)" }}>
                {props.draftWA ? t("dashboard.wizard.confirmCardBtnChange", "Ubah") : t("dashboard.wizard.confirmCardBtnFill", "Isi")}
              </button>
            </>
          )}
        </div>

        {/* JANGKAUAN */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-t" style={rowBorder}>
          <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">{t("dashboard.wizard.confirmCardLabelArea", "Jangkauan")}</span>
          {editingField === "service_area" ? (
            <InlineEditInput
              value={props.draftServiceArea}
              onChange={props.onSetDraftServiceArea}
              onSave={() => saveField("service_area", props)}
              onCancel={() => props.onSetEditingField(null)}
            />
          ) : (
            <>
              <span className="text-[12px] text-slate-300 flex-1 truncate">{props.draftServiceArea || <span className="text-slate-600 italic">—</span>}</span>
              <button type="button" onClick={() => { props.onSetDraftServiceArea(props.serviceArea); props.onSetEditingField("service_area"); }}
                className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={props.draftServiceArea ? editBtn : { color: "#0ea5e9", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)" }}>
                {props.draftServiceArea ? t("dashboard.wizard.confirmCardBtnChange", "Ubah") : t("dashboard.wizard.confirmCardBtnFill", "Isi")}
              </button>
            </>
          )}
        </div>

        {/* BAHASA SITUS */}
        {props.onSetSiteLanguage && (
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-t" style={rowBorder}>
            <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-20">{t("dashboard.wizard.confirmCardLabelLang", "Bahasa Situs")}</span>
            <div className="flex items-center gap-1 bg-[#1e293b]/60 p-0.5 rounded-lg border border-slate-700/40">
              <button
                type="button"
                onClick={() => { props.onSetSiteLanguage?.("id"); props.onSetHasUnsavedEdits(true); }}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all ${props.siteLanguage === "id" || !props.siteLanguage ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
              >
                🇮🇩 Indonesia
              </button>
              <button
                type="button"
                onClick={() => { props.onSetSiteLanguage?.("en"); props.onSetHasUnsavedEdits(true); }}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all ${props.siteLanguage === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        )}

        {/* Generate button */}
        {showGenerate && (
          <div className="px-3 py-2.5 border-t" style={rowBorder}>
            <button
              onClick={props.onGenerate}
              disabled={!!editingField || props.isLoading}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
              style={{ background: props.hasUnsavedEdits ? "linear-gradient(135deg, #059669, #047857)" : "var(--primary)", boxShadow: props.hasUnsavedEdits ? "0 4px 16px rgba(5,150,105,0.3)" : "none", color: props.hasUnsavedEdits ? "#fff" : "var(--primary-foreground)" }}
            >
              <Wand2 className="w-4 h-4" />
              {editingField ? t("dashboard.wizard.confirmCardBtnFinishEdit", "Selesai edit dulu ↑")
                : props.isLoading ? t("dashboard.wizard.confirmCardBtnGenerating", "Sedang dibuat...")
                : props.hasUnsavedEdits ? t("dashboard.wizard.confirmCardBtnGenerateRedo", "Terapkan & Generate Ulang →")
                : t("dashboard.wizard.confirmCardBtnGenerate", "Generate Website →")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
