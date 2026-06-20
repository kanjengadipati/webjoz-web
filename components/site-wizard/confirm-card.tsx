"use client";

import React from "react";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { BUSINESS_TYPES, SUB_TYPES } from "./constants";
import type { ChatStage, PreviewState } from "./types";

interface ConfirmCardProps {
  businessName: string;
  businessType: string;
  businessSubType: string;
  whatsapp: string;
  serviceArea: string;
  draftName: string;
  draftWA: string;
  draftServiceArea: string;
  editingField: string | null;
  previewState: PreviewState;
  hasUnsavedEdits: boolean;
  isLoading: boolean;
  onSetDraftName: (v: string) => void;
  onSetDraftWA: (v: string) => void;
  onSetDraftServiceArea: (v: string) => void;
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
const chipActive = { background: "rgba(124,58,237,0.15)", borderColor: "#7c3aed", color: "#c4b5fd" };
const editBtn = { color: "#7c3aed", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" };

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
    props.onSetWhatsapp(digits ? (digits.startsWith("0") ? "62" + digits.slice(1) : digits) : "");
    props.onSetHasUnsavedEdits(true);
  }
  if (field === "service_area") {
    props.onSetServiceArea(props.draftServiceArea.trim());
    props.onSetHasUnsavedEdits(true);
  }
  props.onSetEditingField(null);
}

function InlineEditInput({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0">
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel(); }}
        className="flex-1 min-w-0 bg-transparent border-b text-[12px] text-slate-200 outline-none py-0.5"
        style={{ borderColor: "#7c3aed" }}
      />
      <button onClick={onSave} className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: "#7c3aed", color: "#fff" }}>✓</button>
      <button onClick={onCancel} className="text-[10px] text-slate-500 shrink-0">✕</button>
    </div>
  );
}

export function ConfirmCard(props: ConfirmCardProps) {
  const { editingField, businessType, businessSubType } = props;
  const showGenerate = props.previewState !== "result" || props.hasUnsavedEdits;

  return (
    <div className="flex gap-2.5 justify-start animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>Hampir jadi — cek dan lengkapi</p>
        </div>

        {/* NAMA */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-t" style={rowBorder}>
          <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">Nama</span>
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
              <button type="button" onClick={() => { props.onSetDraftName(props.businessName); props.onSetEditingField("name"); }} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>Ubah</button>
            </>
          )}
        </div>

        {/* JENIS */}
        <div className="px-3 py-1.5 border-t" style={rowBorder}>
          {editingField === "type" ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">Jenis Bisnis</span>
                <button onClick={() => props.onSetEditingField(null)} className="text-[10px] text-slate-500">✕ tutup</button>
              </div>
              <div className="flex flex-wrap gap-1">
                {BUSINESS_TYPES.map(t => (
                  <button key={t.value} type="button" onClick={() => { props.onSetBusinessType(t.value); props.onSetBusinessSubType(""); props.onSetDescription(""); props.onSetHasUnsavedEdits(true); }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all"
                    style={businessType === t.value ? chipActive : chipDefault}>
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
              {businessType && SUB_TYPES[businessType] && (
                <div className="flex flex-wrap gap-1">
                  {SUB_TYPES[businessType].map(st => (
                    <button key={st.value} type="button" onClick={() => {
                      const nextSubType = st.value === businessSubType ? "" : st.value;
                      props.onSetBusinessSubType(nextSubType);
                      props.onSetDescription("");
                      props.onSetHasUnsavedEdits(true);
                    }}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all"
                      style={businessSubType === st.value ? { background: "rgba(52,211,153,0.15)", borderColor: "#34d399", color: "#34d399" } : chipDefault}>
                      {st.emoji} {st.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">Jenis</span>
              <span className="text-[12px] text-white flex-1 truncate">
                {(() => {
                  const typeEmoji = BUSINESS_TYPES.find(t => t.value === businessType)?.emoji ?? "";
                  const subEmoji = businessSubType ? (SUB_TYPES[businessType]?.find(s => s.value === businessSubType)?.emoji ?? "") : "";
                  const label = [businessType, businessSubType].filter(Boolean).join(" › ");
                  return <>{typeEmoji && <span className="mr-1">{subEmoji || typeEmoji}</span>}{label}</>;
                })()}
              </span>
              <button type="button" onClick={() => props.onSetEditingField("type")} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>Ubah</button>
            </div>
          )}
        </div>

        {/* WA */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-t" style={rowBorder}>
          <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">WA</span>
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
                {props.draftWA ? "Ubah" : "Isi"}
              </button>
            </>
          )}
        </div>

        {/* JANGKAUAN */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-t" style={rowBorder}>
          <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">Jangkauan</span>
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
                {props.draftServiceArea ? "Ubah" : "Isi"}
              </button>
            </>
          )}
        </div>

        {/* Generate button */}
        {showGenerate && (
          <div className="px-3 py-2.5 border-t" style={rowBorder}>
            <button
              onClick={props.onGenerate}
              disabled={!!editingField || props.isLoading}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
              style={{ background: props.hasUnsavedEdits ? "linear-gradient(135deg, #059669, #047857)" : "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: props.hasUnsavedEdits ? "0 4px 16px rgba(5,150,105,0.3)" : "0 4px 16px rgba(124,58,237,0.3)" }}
            >
              <Wand2 className="w-4 h-4" />
              {editingField ? "Selesai edit dulu ↑"
                : props.isLoading ? "Sedang dibuat..."
                : props.hasUnsavedEdits ? "Terapkan & Generate Ulang →"
                : "Generate Website →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
