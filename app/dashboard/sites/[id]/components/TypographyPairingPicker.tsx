"use client";

import React, { useState, useEffect } from "react";
import {
  type TypographyPairing,
  getEnabledTypographyPairings,
} from "@/lib/design-assets-config";
import { loadGoogleFont } from "@/components/templates/helpers";
import FontPicker from "./FontPicker";

interface Props {
  designToken: any;
  aiDesignToken?: any;
  designTokenScore?: number;
  onApply: (pairing: TypographyPairing) => void;
  onFieldChange?: (field: string, subfield: string, value: string) => void;
  onRestoreAi?: () => void;
}

export default function TypographyPairingPicker({
  designToken,
  aiDesignToken,
  designTokenScore,
  onApply,
  onFieldChange,
  onRestoreAi,
}: Props) {
  const [showManual, setShowManual] = useState(false);
  const pairings = getEnabledTypographyPairings();

  useEffect(() => {
    pairings.forEach((p) => loadGoogleFont(p.heading_font, p.body_font));
  }, []);

  const currentHeading = designToken?.typography?.heading_font || "Inter";
  const currentBody = designToken?.typography?.body_font || "Inter";
  const aiTypography = aiDesignToken?.typography || designToken?.typography || {};
  const aiHeading = aiTypography.heading_font || "Inter";
  const aiBody = aiTypography.body_font || "Inter";
  const activePairing = pairings.find(
    (p) => p.heading_font === currentHeading && p.body_font === currentBody
  );
  const hasAiRecommendation =
    designToken?.typography?.heading_font && (designTokenScore ?? 0) >= 65;
  const isAiActive =
    aiTypography.heading_font === currentHeading &&
    aiTypography.body_font === currentBody;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Gaya Tipografi
      </p>

      {hasAiRecommendation && (
        <button
          type="button"
          onClick={onRestoreAi}
          className={`w-full p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
            isAiActive
              ? "border-amber-400 bg-amber-400/10 ring-1 ring-amber-400"
              : "border-dashed border-amber-400/50 bg-amber-400/5 hover:bg-amber-400/10"
          }`}
        >
          <p className="text-[10px] font-bold text-amber-300 mb-1 truncate flex items-center gap-1">
            <span>✨</span> Rekomendasi AI
          </p>
          <div className="space-y-0.5 pointer-events-none">
            <p
              style={{
                fontFamily: `'${aiHeading}', sans-serif`,
                fontWeight: aiTypography.heading_weight ?? "700",
                fontStyle: aiTypography.heading_style ?? "normal",
                textTransform: (aiTypography.heading_transform ?? "none") as any,
                letterSpacing: aiTypography.heading_tracking ?? "normal",
                fontSize: "13px",
                lineHeight: 1.2,
                color: "rgba(252,211,77,0.9)",
                margin: 0,
              }}
            >
              Heading
            </p>
            <p
              style={{
                fontFamily: `'${aiBody}', sans-serif`,
                fontSize: "10px",
                color: "rgba(252,211,77,0.5)",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Teks deskripsi bisnis Anda...
            </p>
          </div>
        </button>
      )}

      {hasAiRecommendation && (
        <p className="text-[10px] font-medium text-slate-400 text-center">
          — atau pilih pasangan font favorit Anda —
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {pairings.map((pairing) => {
          const isActive = activePairing?.id === pairing.id;
          return (
            <button
              key={pairing.id}
              type="button"
              onClick={() => onApply(pairing)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
              }`}
            >
              <p className="text-[10px] font-bold text-slate-200 mb-1 truncate">{pairing.name}</p>
              <div className="space-y-0.5 pointer-events-none">
                <p
                  style={{
                    fontFamily: `'${pairing.heading_font}', sans-serif`,
                    fontWeight: pairing.heading_weight,
                    fontStyle: pairing.heading_style ?? "normal",
                    textTransform: (pairing.heading_transform ?? "none") as any,
                    letterSpacing: pairing.heading_tracking ?? "normal",
                    fontSize: "13px",
                    lineHeight: 1.2,
                    color: "rgba(255,255,255,0.9)",
                    margin: 0,
                  }}
                >
                  Heading
                </p>
                <p
                  style={{
                    fontFamily: `'${pairing.body_font}', sans-serif`,
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.45)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  Teks deskripsi bisnis Anda...
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowManual((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
      >
        <span>{showManual ? "▾" : "▸"}</span>
        Fine-tune manual
      </button>

      {showManual && (
        <div className="space-y-2 pl-3 border-l border-white/10">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Font Heading
            </label>
            <FontPicker
              value={currentHeading}
              onChange={(v) => onFieldChange?.("typography", "heading_font", v)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Font Body
            </label>
            <FontPicker
              value={currentBody}
              onChange={(v) => onFieldChange?.("typography", "body_font", v)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Ketebalan Heading
            </label>
            <select
              value={designToken?.typography?.heading_weight || "700"}
              onChange={(e) => onFieldChange?.("typography", "heading_weight", e.target.value)}
              className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60"
            >
              <option value="400" className="bg-[#111318]">Regular (400)</option>
              <option value="500" className="bg-[#111318]">Medium (500)</option>
              <option value="600" className="bg-[#111318]">Semi-Bold (600)</option>
              <option value="700" className="bg-[#111318]">Bold (700)</option>
              <option value="800" className="bg-[#111318]">Extra-Bold (800)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Ukuran Hero Title
            </label>
            <select
              value={designToken?.typography?.heading_size_hero || "3rem"}
              onChange={(e) => onFieldChange?.("typography", "heading_size_hero", e.target.value)}
              className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60"
            >
              <option value="2rem" className="bg-[#111318]">Kecil (2rem)</option>
              <option value="2.5rem" className="bg-[#111318]">Sedang (2.5rem)</option>
              <option value="3rem" className="bg-[#111318]">Besar (3rem)</option>
              <option value="3.5rem" className="bg-[#111318]">Sangat Besar (3.5rem)</option>
              <option value="4rem" className="bg-[#111318]">Maksimal (4rem)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
