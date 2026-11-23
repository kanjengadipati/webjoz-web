"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Tag,
  ChevronDown,
  Check,
  Store,
  Shirt,
  Briefcase,
  Star,
  MapPin,
  Pencil,
  ArrowRight,
} from "lucide-react";
import { CustomSelect, SparkleGenAI, Button } from "webjoz-ui";
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
        <Button
          type="button"
          onClick={() => onConfirmWithSubType(pending)}
          disabled={isLocked}
          className={`mt-2 w-full py-2 h-auto rounded-xl text-xs font-bold transition-all ${
            isLocked
              ? "bg-white/10 text-slate-500 cursor-not-allowed"
              : "bg-white text-slate-900 hover:bg-slate-100 cursor-pointer shadow-md"
          }`}
        >
          {t("dashboard.wizard.btnContinue", "Ya, lanjut")}
        </Button>
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
  const [draftDesc, setDraftDesc] = useState(chat.descriptionRef?.current || chat.description || "");
  const isLocked =
    chat.chatStage === "language" ||
    chat.chatStage === "mood" ||
    chat.chatStage === "brand-logo" ||
    chat.chatStage === "done";
  const [draftBidang, setDraftBidang] = useState<string>("");

  const isEN = uiLang === "en";

  // Once the wizard moves past the confirmation card, close any open editor.
  useEffect(() => {
    if (isLocked) setEditing(null);
  }, [isLocked]);

  // Keep draftDesc in sync if chat.description gets populated by AI
  useEffect(() => {
    const cur = chat.descriptionRef?.current || chat.description || "";
    if (cur && !draftDesc) {
      setDraftDesc(cur);
    }
  }, [chat.description, draftDesc]);

  const effectiveBidangId =
    draftBidang ||
    (taxonomyV2
      ? taxonomyV2.groups.find((g: any) => g.industries.some((i: any) => i.id === chat.industryId))?.id ?? ""
      : "");
  const bidangLabel = (() => {
    if (taxonomyV2 && effectiveBidangId) {
      const g = taxonomyV2.groups.find((gr: any) => gr.id === effectiveBidangId);
      if (g) return isEN ? g.label_en || g.label : g.label_id || g.label;
    }
    if (taxonomyV2 && chat.archetype) {
      const g = taxonomyV2.groups.find((gr: any) => gr.industries.some((i: any) => i.id === chat.industryId));
      if (g) return isEN ? g.label_en || g.label : g.label_id || g.label;
    }
    return chat.businessType || "-";
  })();

  const specLabel = (() => {
    if (taxonomyV2 && chat.industryId) {
      const ind = taxonomyV2.groups.flatMap((g: any) => g.industries).find((i: any) => i.id === chat.industryId);
      if (ind) return isEN ? ind.label_en || ind.label : ind.label_id || ind.label;
    }
    return chat.businessSubType || "-";
  })();

  const FieldIcon =
    effectiveBidangId === "fashion" ||
    specLabel.toLowerCase().includes("fashion") ||
    specLabel.toLowerCase().includes("baju") ||
    specLabel.toLowerCase().includes("pakaian")
      ? Shirt
      : Briefcase;

  const handleContinue = useCallback(() => {
    const oldName = chat.businessName || "";
    const newName = draftName.trim();
    if (newName && newName !== oldName) {
      chat.setBusinessName(newName);
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
      const cur = chat.descriptionRef?.current || chat.description || "";
      if (cur && oldArea) {
        const updated = cur.split(oldArea).join(newArea);
        chat.descriptionRef.current = updated;
        chat.setDescription(updated);
      }
    }
    const oldDesc = chat.descriptionRef?.current || chat.description || "";
    const newDesc = draftDesc.trim();
    if (newDesc && newDesc !== oldDesc) {
      chat.setDescription(newDesc);
      if (chat.descriptionRef) chat.descriptionRef.current = newDesc;
      if (chat.setDescriptionSource) chat.setDescriptionSource("user");
    }
    if (draftIndustry === "__other__") {
      chat.setIndustryId("");
      chat.industryIdRef.current = "";
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
            if (chat.descriptionSource !== "user" && !newDesc) {
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
        if (chat.descriptionSource !== "user" && !newDesc) {
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
  }, [chat, draftName, draftArea, draftDesc, draftIndustry, draftBidang, taxonomyV2, wizardLang, onConfirm]);

  // Press Enter (when not editing a field) to confirm
  useEffect(() => {
    if (isLocked) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && editing === null) {
        e.preventDefault();
        handleContinue();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isLocked, editing, handleContinue]);

  const hasDescription = Boolean(draftDesc || chat.description);
  const isEditingAll = editing === "all";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 w-full max-w-lg mx-auto">
      <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-5 sm:p-6 shadow-2xl relative overflow-hidden">

        {/* Header: large circle icon + title inline */}
        <div className="flex items-center gap-3 mb-5">
          <div className="shrink-0 w-11 h-11 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center">
            <Check className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">
              {t("dashboard.wizard.profileLooksGreat")}
            </h3>
            <p className="text-xs text-slate-400 leading-snug mt-0.5">
              {t("dashboard.wizard.capturedInfo")}
            </p>
          </div>
        </div>

        {/* Captured Items List */}
        <div className="space-y-0">
          {/* 1. Business Name */}
          <div className="flex items-center justify-between gap-3 py-3 px-1">
            <div className="flex items-center gap-3 min-w-0">
              <Store className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-300">
                {t("dashboard.wizard.cardName")}
              </span>
            </div>
            {!isEditingAll && (
              <button
                type="button"
                onClick={() => !isLocked && setEditing(editing === "name" ? null : "name")}
                disabled={isLocked}
                className={`text-sm text-right font-bold truncate max-w-[55%] transition-colors ${
                  isLocked ? "text-slate-300 cursor-default" : "text-white hover:text-primary cursor-pointer"
                }`}
                title={editing === "name" ? (isEN ? "Close" : "Tutup") : (isEN ? "Click to edit" : "Klik untuk ubah")}
              >
                {draftName || chat.businessName || "—"}
              </button>
            )}
          </div>
          {(editing === "name" || isEditingAll) && (
            <div className="pb-2 px-1 pl-9">
              <input
                autoFocus={editing === "name"}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={() => {
                  if (draftName.trim()) chat.setBusinessName(draftName.trim());
                  if (editing === "name") setEditing(null);
                }}
                placeholder={t("dashboard.wizard.namePlaceholder")}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white/[0.06] text-white border border-white/10 focus:border-white/30 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* 2. Field (Bidang) */}
          <div className="flex items-center justify-between gap-3 py-3 px-1">
            <div className="flex items-center gap-3 min-w-0">
              <FieldIcon className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-300">
                {t("dashboard.wizard.cardBidang")}
              </span>
            </div>
            {!isEditingAll && (
              <button
                type="button"
                onClick={() => !isLocked && setEditing(editing === "bidang" ? null : "bidang")}
                disabled={isLocked}
                className={`text-sm text-right font-bold truncate max-w-[55%] transition-colors ${
                  isLocked ? "text-slate-300 cursor-default" : "text-white hover:text-primary cursor-pointer"
                }`}
                title={editing === "bidang" ? (isEN ? "Close" : "Tutup") : (isEN ? "Click to edit" : "Klik untuk ubah")}
              >
                {bidangLabel || "—"}
              </button>
            )}
          </div>
          {(editing === "bidang" || isEditingAll) && taxonomyV2 && (
            <div className="pb-2 px-1 pl-9">
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
                  if (editing === "bidang") setEditing(null);
                }}
                options={taxonomyV2.groups.map((g: any) => ({
                  value: g.id,
                  label: isEN ? g.label_en || g.label : g.label_id || g.label,
                }))}
                size="sm"
                triggerClassName="border-white/10 bg-white/[0.06] text-white rounded-xl"
              />
            </div>
          )}

          {/* 3. Specialty (Spesialisasi) */}
          <div className="flex items-center justify-between gap-3 py-3 px-1">
            <div className="flex items-center gap-3 min-w-0">
              <Star className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-300">
                {t("dashboard.wizard.cardSpec")}
              </span>
            </div>
            {!isEditingAll && (
              <button
                type="button"
                onClick={() => !isLocked && setEditing(editing === "spec" ? null : "spec")}
                disabled={isLocked}
                className={`text-sm text-right font-bold truncate max-w-[55%] transition-colors ${
                  isLocked ? "text-slate-300 cursor-default" : "text-white hover:text-primary cursor-pointer"
                }`}
                title={editing === "spec" ? (isEN ? "Close" : "Tutup") : (isEN ? "Click to edit" : "Klik untuk ubah")}
              >
                {specLabel || "—"}
              </button>
            )}
          </div>
          {(editing === "spec" || isEditingAll) && taxonomyV2 && (
            <div className="pb-2 px-1 pl-9 space-y-1.5">
              <CustomSelect
                value={draftIndustry || "__other__"}
                onChange={(val) => {
                  setDraftIndustry(val);
                  if (editing === "spec") setEditing(null);
                }}
                options={[
                  ...taxonomyV2.groups
                    .filter((g: any) => !draftBidang || g.id === draftBidang)
                    .flatMap((g: any) => g.industries)
                    .filter((i: any) => (!draftBidang && chat.archetype ? i.archetype === chat.archetype : true))
                    .map((i: any) => ({
                      value: i.id,
                      label: isEN ? i.label_en || i.label : i.label_id || i.label,
                    })),
                  { value: "__other__", label: t("dashboard.wizard.otherIndustry", "Lainnya (ketik spesialisasi)...") },
                ]}
                size="sm"
                triggerClassName="border-white/10 bg-white/[0.06] text-white rounded-xl"
              />
              {draftIndustry === "__other__" && (
                <input
                  autoFocus={editing === "spec"}
                  value={chat.industryCustom || ""}
                  onChange={(e) => chat.setIndustryCustom(e.target.value)}
                  placeholder={t("dashboard.wizard.otherIndustry")}
                  className="w-full px-3 py-1.5 rounded-xl text-xs bg-white/[0.06] text-white border border-white/10 focus:border-white/30 focus:outline-none transition-colors"
                />
              )}
            </div>
          )}

          {/* 4. Location */}
          <div className="flex items-center justify-between gap-3 py-3 px-1">
            <div className="flex items-center gap-3 min-w-0">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-300">
                {t("dashboard.wizard.cardLocation")}
              </span>
            </div>
            {!isEditingAll && (
              <button
                type="button"
                onClick={() => !isLocked && setEditing(editing === "area" ? null : "area")}
                disabled={isLocked}
                className={`text-sm text-right font-bold truncate max-w-[55%] transition-colors ${
                  isLocked ? "text-slate-300 cursor-default" : "text-white hover:text-primary cursor-pointer"
                }`}
                title={editing === "area" ? (isEN ? "Close" : "Tutup") : (isEN ? "Click to edit" : "Klik untuk ubah")}
              >
                {draftArea || chat.serviceArea || "—"}
              </button>
            )}
          </div>
          {(editing === "area" || isEditingAll) && (
            <div className="pb-2 px-1 pl-9">
              <input
                autoFocus={editing === "area"}
                value={draftArea}
                onChange={(e) => setDraftArea(e.target.value)}
                onBlur={() => {
                  if (draftArea.trim()) chat.setServiceArea(draftArea.trim());
                  if (editing === "area") setEditing(null);
                }}
                placeholder={t("dashboard.wizard.locationPlaceholder")}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white/[0.06] text-white border border-white/10 focus:border-white/30 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* 5. Description — AI Highlight Box */}
          {(hasDescription || isEditingAll || editing === "desc") && (
            <div className="mt-2 rounded-2xl bg-white/[0.05] p-3.5">
              {/* Header: SparkleGenAI icon + label + edit button */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <SparkleGenAI className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {t("dashboard.wizard.cardDesc")}
                  </span>
                </div>
                {!isLocked && !isEditingAll && (
                  <button
                    type="button"
                    onClick={() => setEditing(editing === "desc" ? null : "desc")}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Pencil className="w-3 h-3" />
                    {editing === "desc"
                      ? t("dashboard.wizard.btnDone")
                      : t("dashboard.wizard.btnEdit")}
                  </button>
                )}
              </div>
              {editing === "desc" || isEditingAll ? (
                <textarea
                  autoFocus={editing === "desc"}
                  rows={3}
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  placeholder={
                    isEN
                      ? t("dashboard.wizard.descPlaceholder", "Brief description of your business...")
                      : t("dashboard.wizard.descPlaceholder", "Deskripsi singkat tentang bisnismu...")
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/[0.06] text-white border border-white/10 focus:border-white/30 focus:outline-none transition-colors resize-none leading-relaxed"
                />
              ) : (
                <p className="text-sm text-slate-300 leading-relaxed break-words">
                  {draftDesc || chat.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditing(editing ? null : "all")}
            disabled={isLocked}
            className={`px-5 py-3 h-auto rounded-full text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
              isLocked
                ? "border-white/10 text-slate-500 cursor-not-allowed opacity-50"
                : isEditingAll
                ? "border-white/30 bg-white/10 text-white hover:bg-white/15 cursor-pointer"
                : "border-white/20 bg-transparent text-slate-200 hover:text-white hover:border-white/40 hover:bg-white/5 active:scale-95 cursor-pointer"
            }`}
          >
            {isEditingAll ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            <span>
              {isEditingAll
                ? t("dashboard.wizard.btnDone")
                : t("dashboard.wizard.btnEdit")}
            </span>
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={isLocked}
            className={`flex-1 py-3 px-6 h-auto rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
              isLocked
                ? "bg-white/10 text-slate-500 cursor-not-allowed shadow-none"
                : "bg-white text-slate-900 hover:bg-slate-100 active:scale-95 cursor-pointer"
            }`}
          >
            <span>{t("dashboard.wizard.btnContinue")}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
