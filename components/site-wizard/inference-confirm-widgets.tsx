"use client";

import React, { useState, useEffect } from "react";
import { Tag, ChevronDown } from "lucide-react";
import { CustomSelect } from "webjoz-ui";
import { SUB_TYPE_ICONS } from "./icons-map";
import { generateDescriptionFromBusinessName } from "./helpers";

const INFERENCE_CHIP_LIMIT = 5;

interface InferenceConfirmWidgetProps {
  isLocked: boolean;
  orderedSubTypes: { value: string; label: string; emoji: string }[];
  selectedSubType: string;
  categoryLabel?: string;
  onConfirmWithSubType: (subType: string) => void;
  onUnlockChips?: () => void;
  onChangeCategory: () => void;
  t: (key: string, fallback?: string) => string;
}

export function InferenceConfirmWidget({
  isLocked,
  orderedSubTypes,
  selectedSubType,
  categoryLabel,
  onConfirmWithSubType,
  onUnlockChips,
  onChangeCategory,
  t,
}: InferenceConfirmWidgetProps) {
  // Chips start collapsed — only selected chip shown until user taps "Pilih jenis lain"
  const [showOthers, setShowOthers] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [pending, setPending] = useState(selectedSubType);

  const selectedChip = orderedSubTypes.find((s) => s.value === selectedSubType);
  const otherChips = orderedSubTypes.filter((s) => s.value !== selectedSubType);

  const visibleOtherChips = showAll
    ? otherChips
    : otherChips.slice(0, INFERENCE_CHIP_LIMIT - 1);
  const hiddenCount = otherChips.length - (INFERENCE_CHIP_LIMIT - 1);

  const handleShowOthers = () => {
    setShowOthers(true);
    onUnlockChips?.();
  };

  const renderChip = (st: { value: string; label: string; emoji: string }, locked: boolean) => {
    const isSelected = pending === st.value;
    const SubIcon = SUB_TYPE_ICONS[st.value] ?? Tag;
    const labelText = t(`dashboard.wizard.subtypes.${st.value}`, st.label);
    return (
      <button
        key={st.value}
        type="button"
        title={labelText}
        onClick={() => {
          if (!locked) setPending(st.value);
        }}
        disabled={locked}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 active:scale-95 cursor-pointer max-w-full ${
          isSelected
            ? `border-primary/60 bg-primary/20 text-white ring-1 ring-primary/30 ${locked ? "opacity-80" : ""}`
            : `text-slate-300 border-white/[0.08] bg-white/[0.04] ${locked ? "opacity-35 cursor-default" : "hover:border-white/20 hover:text-white hover:bg-white/[0.08]"}`
        }`}
      >
        <SubIcon className={`w-3 h-3 shrink-0 ${isSelected ? "text-primary" : "text-slate-400"}`} />
        <span className="text-left">{labelText}</span>
        {isSelected && <span className="text-primary text-[10px] shrink-0">✓</span>}
      </button>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-2">
      {/* Category breadcrumb */}
      {categoryLabel && selectedChip && (
        <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
          <span>{categoryLabel}</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-400">
            {t(`dashboard.wizard.subtypes.${selectedChip.value}`, selectedChip.label)}
          </span>
        </div>
      )}

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5">
        {/* Always show selected chip */}
        {selectedChip && renderChip(selectedChip, isLocked)}

        {/* Other chips — only visible after user taps "Pilih jenis lain" and not locked */}
        {showOthers && !isLocked && visibleOtherChips.map((st) => renderChip(st, isLocked))}

        {showOthers && !isLocked && !showAll && hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <ChevronDown className="w-3 h-3" />
            +{hiddenCount} lainnya
          </button>
        )}
      </div>

      {/* Action links */}
      {!isLocked && (
        <div className="flex items-center gap-3">
          {/* Change sub-type within same category */}
          {!showOthers && (
            <button
              type="button"
              onClick={handleShowOthers}
              className="text-[10px] text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors px-0.5"
            >
              {t("dashboard.wizard.changeSubType", "Pilih jenis lain")}
            </button>
          )}
          {/* Change category entirely — always visible when not locked */}
          <button
            type="button"
            onClick={onChangeCategory}
            className="text-[10px] text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors px-0.5"
          >
            {t("dashboard.wizard.btnChangeCategory", "Ganti kategori")}
          </button>
        </div>
      )}
      {pending && (
        <button
          type="button"
          onClick={() => onConfirmWithSubType(pending)}
          disabled={isLocked}
          className={`mt-2 w-full py-2 rounded-xl text-xs font-bold transition-all ${
            isLocked
              ? "bg-white/10 text-slate-500 cursor-not-allowed"
              : "bg-white text-slate-900 hover:bg-slate-100 cursor-pointer shadow-md"
          }`}
        >
          {t("dashboard.wizard.btnContinue", "Ya, lanjut")}
        </button>
      )}
    </div>
  );
}

interface InferenceConfirmCardProps {
  chat: any;
  taxonomyV2: any;
  wizardLang: string;
  uiLang: string;
  onConfirm: (subType: string) => void;
  onChangeCategory: () => void;
  t: (key: string, fallback?: string) => string;
}

export function InferenceConfirmCard({
  chat,
  taxonomyV2,
  wizardLang,
  uiLang,
  onConfirm,
  onChangeCategory,
  t,
}: InferenceConfirmCardProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draftName, setDraftName] = useState(chat.businessName || "");
  const [draftArea, setDraftArea] = useState(chat.serviceArea || "");
  const [draftIndustry, setDraftIndustry] = useState(chat.industryId || chat.businessSubType || "");
  const isLocked = chat.chatStage === "language" || chat.chatStage === "mood" || chat.chatStage === "brand-logo" || chat.chatStage === "done";
  const [draftBidang, setDraftBidang] = useState<string>("");

  // Once the wizard moves past the confirmation card, close any open editor.
  useEffect(() => {
    if (isLocked) setEditing(null);
  }, [isLocked]);

  const effectiveBidangId =
    draftBidang ||
    (taxonomyV2
      ? taxonomyV2.groups.find((g: any) => g.industries.some((i: any) => i.id === chat.industryId))?.id ?? ""
      : "");
  const bidangLabel = (() => {
    if (taxonomyV2 && effectiveBidangId) {
      const g = taxonomyV2.groups.find((gr: any) => gr.id === effectiveBidangId);
      if (g) return uiLang === "en" ? g.label_en || g.label : g.label_id || g.label;
    }
    if (taxonomyV2 && chat.archetype) {
      const g = taxonomyV2.groups.find((gr: any) => gr.industries.some((i: any) => i.id === chat.industryId));
      if (g) return uiLang === "en" ? g.label_en || g.label : g.label_id || g.label;
    }
    return chat.businessType || "-";
  })();

  const specLabel = (() => {
    if (taxonomyV2 && chat.industryId) {
      const ind = taxonomyV2.groups.flatMap((g: any) => g.industries).find((i: any) => i.id === chat.industryId);
      if (ind) return uiLang === "en" ? ind.label_en || ind.label : ind.label_id || ind.label;
    }
    return chat.businessSubType || "-";
  })();

  const handleContinue = () => {
    const oldName = chat.businessName || "";
    const newName = draftName.trim();
    if (newName && newName !== oldName) {
      chat.setBusinessName(newName);
      // Keep refined description in sync with the new name (best-effort replace).
      const cur = chat.descriptionRef?.current || chat.description || "";
      if (cur && oldName) {
        const updated = cur.split(oldName).join(newName);
        chat.descriptionRef.current = updated;
        chat.setDescription(updated);
      }
    }
    const oldArea = chat.serviceArea || "";
    const newArea = draftArea.trim();
    if (newArea && newArea !== oldArea) {
      chat.setServiceArea(newArea);
      // Keep refined description in sync with the new location (best-effort replace).
      const cur = chat.descriptionRef?.current || chat.description || "";
      if (cur && oldArea) {
        const updated = cur.split(oldArea).join(newArea);
        chat.descriptionRef.current = updated;
        chat.setDescription(updated);
      }
    }
    if (draftIndustry === "__other__") {
      chat.setIndustryId("");
      chat.industryIdRef.current = "";
      // industryCustom already set via input
    } else if (draftIndustry && draftIndustry !== chat.industryId) {
      if (draftIndustry.includes(".")) {
        chat.setIndustryId(draftIndustry);
        chat.industryIdRef.current = draftIndustry;
        if (taxonomyV2) {
          const ind = taxonomyV2.groups.flatMap((g: any) => g.industries).find((i: any) => i.id === draftIndustry);
          if (ind) {
            chat.setArchetype(ind.archetype);
            chat.archetypeRef.current = ind.archetype;
            const newLabel = wizardLang === "en" ? ind.label_en || ind.label : ind.label_id || ind.label;
            // 2.3: jangan timpa description yang ditulis pengguna
            if (chat.descriptionSource !== "user") {
              const refreshed = generateDescriptionFromBusinessName(
                chat.businessName || "",
                { subType: newLabel },
                wizardLang === "en" ? "en" : "id"
              );
              if (refreshed) {
                chat.descriptionRef.current = refreshed;
                chat.setDescription(refreshed);
              }
            }
          }
        }
      } else {
        chat.setBusinessSubType(draftIndustry);
        // 2.3: jangan timpa description yang ditulis pengguna
        if (chat.descriptionSource !== "user") {
          const refreshed = generateDescriptionFromBusinessName(
            chat.businessName || "",
            { subType: draftIndustry },
            wizardLang === "en" ? "en" : "id"
          );
          if (refreshed) {
            chat.descriptionRef.current = refreshed;
            chat.setDescription(refreshed);
          }
        }
      }
    }
    const newSubType =
      draftIndustry && draftIndustry !== "__other__" && !draftIndustry.includes(".") ? draftIndustry : "";
    onConfirm(newSubType);
  };

  const Row = ({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) => (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-white/[0.06] last:border-0">
      <span className="text-[11px] text-slate-500 shrink-0">{label}</span>
      <button
        type="button"
        onClick={onEdit}
        disabled={isLocked}
        className={`text-[11px] text-right truncate max-w-[60%] ${
          isLocked ? "text-slate-500 cursor-default" : "text-slate-200 hover:text-white cursor-pointer"
        }`}
      >
        {value || "—"} {isLocked ? "" : "✎"}
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 space-y-1">
        <Row
          label={t("dashboard.wizard.cardName", "Nama usaha")}
          value={editing === "name" ? draftName : chat.businessName || "-"}
          onEdit={() => setEditing("name")}
        />
        {editing === "name" && (
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={() => {
              if (draftName.trim()) chat.setBusinessName(draftName.trim());
              setEditing(null);
            }}
            className="w-full px-2 py-1 rounded-lg text-xs bg-white/[0.06] text-white border border-white/10"
          />
        )}
        <Row
          label={t("dashboard.wizard.cardBidang", "Bidang")}
          value={bidangLabel}
          onEdit={() => setEditing("bidang")}
        />
        {editing === "bidang" && taxonomyV2 && (
          <CustomSelect
            value={
              draftBidang ||
              (taxonomyV2.groups.find((g: any) => g.industries.some((i: any) => i.id === chat.industryId))?.id ?? "")
            }
            onChange={(val) => {
              setDraftBidang(val);
              const group = taxonomyV2?.groups.find((g: any) => g.id === val);
              const first = group?.industries?.[0]?.id;
              setDraftIndustry(first || "");
              setEditing(null);
            }}
            options={taxonomyV2.groups.map((g: any) => ({
              value: g.id,
              label: uiLang === "en" ? g.label_en || g.label : g.label_id || g.label,
            }))}
            size="sm"
            triggerClassName="border-white/10 bg-black/20 text-slate-200"
          />
        )}
        <Row
          label={t("dashboard.wizard.cardSpec", "Spesialisasi")}
          value={specLabel}
          onEdit={() => setEditing("spec")}
        />
        {editing === "spec" && taxonomyV2 && (
          <>
            <CustomSelect
              value={draftIndustry || "__other__"}
              onChange={(val) => {
                setDraftIndustry(val);
                setEditing(null);
              }}
              options={[
                ...taxonomyV2.groups
                  .filter((g: any) => !draftBidang || g.id === draftBidang)
                  .flatMap((g: any) => g.industries)
                  .filter((i: any) => (!draftBidang && chat.archetype ? i.archetype === chat.archetype : true))
                  .map((i: any) => ({
                    value: i.id,
                    label: uiLang === "en" ? i.label_en || i.label : i.label_id || i.label,
                  })),
                { value: "__other__", label: t("dashboard.wizard.otherIndustry", "Lainnya (ketik spesialisasi)...") },
              ]}
              size="sm"
              triggerClassName="border-white/10 bg-black/20 text-slate-200"
            />
            {draftIndustry === "__other__" && (
              <input
                autoFocus
                value={chat.industryCustom || ""}
                onChange={(e) => chat.setIndustryCustom(e.target.value)}
                placeholder={t("dashboard.wizard.otherIndustry", "Lainnya (ketik spesialisasi)...")}
                className="w-full mt-1 px-2 py-1 rounded-lg text-xs bg-white/[0.06] text-white border border-white/10"
              />
            )}
          </>
        )}
        <Row
          label={t("dashboard.wizard.cardLocation", "Lokasi")}
          value={editing === "area" ? draftArea : chat.serviceArea || "-"}
          onEdit={() => setEditing("area")}
        />
        {editing === "area" && (
          <input
            autoFocus
            value={draftArea}
            onChange={(e) => setDraftArea(e.target.value)}
            onBlur={() => {
              if (draftArea.trim()) chat.setServiceArea(draftArea.trim());
              setEditing(null);
            }}
            className="w-full px-2 py-1 rounded-lg text-xs bg-white/[0.06] text-white border border-white/10"
          />
        )}
      </div>
      <button
        type="button"
        onClick={handleContinue}
        disabled={isLocked}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
          isLocked
            ? "bg-white/10 text-slate-500 cursor-not-allowed shadow-none"
            : "bg-white text-slate-900 hover:bg-slate-100 cursor-pointer shadow-lg"
        }`}
      >
        {t("dashboard.wizard.btnContinue", "Ya, lanjut")}
      </button>
    </div>
  );
}

