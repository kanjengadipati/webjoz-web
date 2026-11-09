"use client";

import React, { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Copy, Check, Palette, Sparkles, SlidersHorizontal, ChevronDown, Trash2, X } from "lucide-react";
import { Button } from "webjoz-ui";

const COLOR_KEYS = [
  { key: "primary", fallback: "#4F46E5", labelKey: "primaryColor", shortKey: "primaryShort" },
  { key: "accent", fallback: "#7C3AED", labelKey: "accentColor", shortKey: "accentShort" },
  { key: "background", fallback: "#FAF7F2", labelKey: "backgroundColor", shortKey: "backgroundShort" },
  { key: "surface", fallback: "#FFFFFF", labelKey: "surfaceColor", shortKey: "surfaceShort" },
  { key: "text", fallback: "#2C2C2A", labelKey: "textColor", shortKey: "textShort" },
] as const;

const POPULAR_ACCENTS = [
  { hex: "#E85D2A", name: "Warm Orange" },
  { hex: "#2563EB", name: "Royal Blue" },
  { hex: "#059669", name: "Emerald Green" },
  { hex: "#7C3AED", name: "Vibrant Purple" },
  { hex: "#18181B", name: "Deep Slate" },
];

interface Props {
  palette: Record<string, string | undefined> | undefined;
  onChange: (key: string, value: string) => void;
  onReset?: () => void;
}

export default function CompactColorPicker({ palette, onChange, onReset }: Props) {
  const { t } = useI18n();
  const [showEditor, setShowEditor] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("primary");
  const [copied, setCopied] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const activeConfig = COLOR_KEYS.find((c) => c.key === activeKey) || COLOR_KEYS[0];
  const activeColorValue = palette?.[activeConfig.key] || activeConfig.fallback;
  const primaryColor = palette?.primary || "#4F46E5";

  const handleCopy = () => {
    if (!activeColorValue) return;
    navigator.clipboard.writeText(activeColorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-2">
      {/* ── Brand Color Button (Theme Panel Style) ────────────────────── */}
      <button
        type="button"
        onClick={() => setShowEditor((prev) => !prev)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed border-border bg-sidebar hover:bg-sidebar-muted/50 transition-all cursor-pointer text-sidebar-foreground"
      >
        <span className="flex items-center gap-2 text-xs font-semibold">
          <Palette className="h-4 w-4 text-sidebar-foreground shrink-0" />
          {t("dashboard.sitesEditor.brandColorButton", "Warna brand saya")}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-sidebar-muted-foreground transition-transform duration-200 ${
            showEditor ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dedicated Card for Brand Color (Always visible underneath) ── */}
      <div className="w-full p-3 rounded-xl border border-border bg-sidebar text-left space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-bold text-sidebar-foreground truncate">
              {t("dashboard.sitesEditor.myBrandColorTitle", "Warna Brand Saya")}
            </span>
            <span className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
              Active
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowEditor((v) => !v)}
            className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
          >
            {showEditor ? t("dashboard.sitesEditor.closeCustomEditor", "Tutup") : t("dashboard.sitesEditor.edit", "Ubah")}
          </button>
        </div>

        {/* 5 Swatches preview */}
        <div className="grid grid-cols-5 gap-1.5 p-1 rounded-lg border border-border bg-sidebar-muted/40">
          {COLOR_KEYS.map((item) => {
            const colorVal = palette?.[item.key] || item.fallback;
            const isSelected = activeKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveKey(item.key);
                  if (!showEditor) setShowEditor(true);
                }}
                title={`${t(`dashboard.sitesEditor.${item.labelKey}` as any)} (${colorVal})`}
                className={`flex flex-col items-center gap-1 p-1 rounded-md transition-all cursor-pointer ${
                  isSelected && showEditor
                    ? "bg-sidebar shadow-xs ring-2 ring-primary ring-offset-1 ring-offset-sidebar"
                    : "hover:bg-sidebar-muted/80 opacity-90 hover:opacity-100"
                }`}
              >
                <div
                  className="w-full aspect-square rounded-md border border-border/60 shadow-2xs relative overflow-hidden"
                  style={{ backgroundColor: colorVal }}
                />
                <span
                  className={`text-[8.5px] font-bold truncate max-w-full leading-none ${
                    isSelected && showEditor ? "text-primary" : "text-sidebar-muted-foreground"
                  }`}
                >
                  {t(`dashboard.sitesEditor.${item.shortKey}` as any)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Primary Hex Row */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-3.5 h-3.5 rounded-full border border-border shrink-0 shadow-2xs"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="font-mono text-[11px] text-sidebar-foreground uppercase font-semibold">
              {primaryColor}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(primaryColor);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="text-[10px] text-sidebar-muted-foreground hover:text-sidebar-foreground cursor-pointer flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* ── Sub-Editor (Expandable when clicked) ───────────────────────── */}
      {showEditor && (
        <div className="p-3.5 rounded-xl border border-border bg-sidebar space-y-3.5 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <span className="text-xs font-bold text-sidebar-foreground">
              {t("dashboard.sitesEditor.customizeColorButton", "Sesuaikan Warna Brand")}
            </span>
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="p-1 rounded-md text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted transition-colors cursor-pointer"
              title={t("dashboard.sitesEditor.closeCustomEditor", "Tutup")}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Primary Colors */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-sidebar-muted-foreground uppercase tracking-wide block">
              {t("dashboard.sitesEditor.popularAccentsLabel", "Warna Populer")}
            </span>
            <div className="flex items-center gap-2">
              {POPULAR_ACCENTS.map((color) => {
                const isSelected = primaryColor.toLowerCase() === color.hex.toLowerCase();
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => onChange("primary", color.hex)}
                    className={`w-7 h-7 rounded-xl transition-all cursor-pointer relative flex items-center justify-center ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-sidebar scale-110 shadow-xs"
                        : "hover:scale-105 border border-border/70"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot Detail Editor */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-sidebar-muted-foreground uppercase tracking-wide block">
              {t("dashboard.sitesEditor.colorPalette", "Palet Warna (5 Warna)")}
            </span>

            <div className="flex items-center gap-2.5 p-2 rounded-xl border border-border bg-sidebar-muted/30">
              <div className="relative w-8 h-8 rounded-lg border border-border overflow-hidden flex-shrink-0 shadow-2xs">
                <input
                  ref={colorInputRef}
                  type="color"
                  value={activeColorValue}
                  onChange={(e) => onChange(activeConfig.key, e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: activeColorValue }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-sidebar-foreground truncate leading-tight mb-0.5">
                  {t(`dashboard.sitesEditor.${activeConfig.labelKey}` as any)}
                </p>
                <input
                  type="text"
                  value={activeColorValue}
                  onChange={(e) => onChange(activeConfig.key, e.target.value)}
                  className="w-full text-xs font-mono uppercase bg-transparent text-sidebar-foreground outline-hidden border-0 p-0 focus:ring-0 cursor-text"
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>

              <button
                type="button"
                onClick={handleCopy}
                title={copied ? t("dashboard.sitesEditor.copiedHex") : t("dashboard.sitesEditor.copyHex")}
                aria-label={t("dashboard.sitesEditor.copyHex")}
                className="p-1.5 rounded-md hover:bg-sidebar-muted text-sidebar-muted-foreground hover:text-sidebar-foreground transition cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowEditor(false)}
            className="w-full text-xs font-semibold border-border hover:bg-sidebar-muted text-sidebar-foreground cursor-pointer"
          >
            {t("common.done", "Selesai")}
          </Button>
        </div>
      )}
    </div>
  );
}
