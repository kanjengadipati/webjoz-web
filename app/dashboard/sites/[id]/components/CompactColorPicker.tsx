"use client";

import React, { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Copy, Check } from "lucide-react";

const COLOR_KEYS = [
  { key: "primary", fallback: "#4F46E5", labelKey: "primaryColor", shortKey: "primaryShort" },
  { key: "accent", fallback: "#7C3AED", labelKey: "accentColor", shortKey: "accentShort" },
  { key: "background", fallback: "#FAF7F2", labelKey: "backgroundColor", shortKey: "backgroundShort" },
  { key: "surface", fallback: "#FFFFFF", labelKey: "surfaceColor", shortKey: "surfaceShort" },
  { key: "text", fallback: "#2C2C2A", labelKey: "textColor", shortKey: "textShort" },
] as const;

interface Props {
  palette: Record<string, string | undefined> | undefined;
  onChange: (key: string, value: string) => void;
}

export default function CompactColorPicker({ palette, onChange }: Props) {
  const { t } = useI18n();
  const [activeKey, setActiveKey] = useState<string>("primary");
  const [copied, setCopied] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const activeConfig = COLOR_KEYS.find((c) => c.key === activeKey) || COLOR_KEYS[0];
  const activeColorValue = palette?.[activeConfig.key] || activeConfig.fallback;

  const handleCopy = () => {
    if (!activeColorValue) return;
    navigator.clipboard.writeText(activeColorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.manualFineTune") || "Fine-tune Manual"}
        </label>
        <span className="text-[10px] text-sidebar-subtle-foreground">
          5 {t("dashboard.sitesEditor.colorPalette") || "Warna"}
        </span>
      </div>

      {/* 5 Swatches in 1 Row */}
      <div className="grid grid-cols-5 gap-1.5 p-1.5 rounded-xl border border-border bg-sidebar-muted/40">
        {COLOR_KEYS.map((item) => {
          const colorVal = palette?.[item.key] || item.fallback;
          const isSelected = activeKey === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveKey(item.key);
                if (isSelected && colorInputRef.current) {
                  colorInputRef.current.click();
                }
              }}
              title={`${t(`dashboard.sitesEditor.${item.labelKey}` as any)} (${colorVal})`}
              className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? "bg-sidebar shadow-xs ring-2 ring-primary ring-offset-1 ring-offset-sidebar"
                  : "hover:bg-sidebar-muted/80 opacity-85 hover:opacity-100"
              }`}
            >
              <div
                className="w-full aspect-square rounded-md border border-black/10 dark:border-white/10 shadow-2xs relative overflow-hidden"
                style={{ backgroundColor: colorVal }}
              />
              <span
                className={`text-[9px] font-bold truncate max-w-full leading-none ${
                  isSelected ? "text-primary" : "text-sidebar-muted-foreground"
                }`}
              >
                {t(`dashboard.sitesEditor.${item.shortKey}` as any)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Color Detail Editor */}
      <div className="flex items-center gap-2 p-2 rounded-xl border border-border bg-sidebar-muted/30">
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
          <p className="text-[10px] font-semibold text-sidebar-foreground truncate leading-tight">
            {t(`dashboard.sitesEditor.${activeConfig.labelKey}` as any)}
          </p>
          <input
            type="text"
            value={activeColorValue}
            onChange={(e) => onChange(activeConfig.key, e.target.value)}
            className="w-full text-[12px] font-mono uppercase bg-transparent text-sidebar-foreground outline-none border-0 p-0 focus:ring-0 cursor-text"
            placeholder="#000000"
            maxLength={7}
          />
        </div>

        <button
          type="button"
          onClick={handleCopy}
          title="Salin Kode HEX"
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
  );
}
