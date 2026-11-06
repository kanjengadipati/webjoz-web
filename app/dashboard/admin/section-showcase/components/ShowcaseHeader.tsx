"use client";

import React from "react";
import { SparkleIcon } from "@/components/sparkle-icon";
import {
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  AlertTriangle,
  Sliders,
  Palette,
} from "lucide-react";
import { SHOWCASE_PRESETS } from "../mock-data";

export interface ShowcaseHeaderProps {
  selectedSection: string;
  activePresetId: string;
  onSelectPreset: (id: string) => void;
  currentThemeMode: "light" | "dark";
  onToggleThemeMode: (mode: "light" | "dark") => void;
  viewport: "desktop" | "tablet" | "mobile";
  onSelectViewport: (v: "desktop" | "tablet" | "mobile") => void;
  displayMode: "all" | "single";
  onToggleDisplayMode: (mode: "all" | "single") => void;
  heroZeroState: boolean;
  onToggleHeroZeroState: () => void;
  cardStyle: "standard" | "horizontal" | "minimal" | "overlay" | "magazine";
  onChangeCardStyle: (style: "standard" | "horizontal" | "minimal" | "overlay" | "magazine") => void;
  availableVariantsCount: number;
}

export function ShowcaseHeader({
  selectedSection,
  activePresetId,
  onSelectPreset,
  currentThemeMode,
  onToggleThemeMode,
  viewport,
  onSelectViewport,
  displayMode,
  onToggleDisplayMode,
  heroZeroState,
  onToggleHeroZeroState,
  cardStyle,
  onChangeCardStyle,
  availableVariantsCount,
}: ShowcaseHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border/80 px-4 lg:px-6 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <SparkleIcon className="size-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight">Section Showcase</h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground border border-border/60">
                Visual Lab
              </span>
            </div>
          </div>
        </div>

        {/* Right: Consolidated Toolbars */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-lg border border-border/60">
            <Palette className="size-3.5 text-muted-foreground" />
            <select
              value={activePresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-transparent text-xs font-medium text-foreground focus:outline-hidden cursor-pointer"
            >
              {SHOWCASE_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-popover text-popover-foreground">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Card Style Selector (for Catalog & Menu) */}
          {(selectedSection === "catalog" || selectedSection === "menu") && (
            <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-lg border border-border/60">
              <Sliders className="size-3.5 text-muted-foreground" />
              <select
                value={cardStyle}
                onChange={(e) => onChangeCardStyle(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-hidden cursor-pointer"
              >
                <option value="standard" className="bg-popover text-popover-foreground">Card: Standard</option>
                <option value="horizontal" className="bg-popover text-popover-foreground">Card: Horizontal</option>
                <option value="minimal" className="bg-popover text-popover-foreground">Card: Minimal</option>
                <option value="overlay" className="bg-popover text-popover-foreground">Card: Overlay</option>
                <option value="magazine" className="bg-popover text-popover-foreground">Card: Magazine</option>
              </select>
            </div>
          )}

          {/* Theme Mode Toggle */}
          <div className="flex items-center bg-muted/40 p-0.5 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => onToggleThemeMode("light")}
              className={`p-1 rounded-md transition-all cursor-pointer ${
                currentThemeMode === "light"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Light Mode"
            >
              <Sun className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onToggleThemeMode("dark")}
              className={`p-1 rounded-md transition-all cursor-pointer ${
                currentThemeMode === "dark"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Dark Mode"
            >
              <Moon className="size-3.5" />
            </button>
          </div>

          {/* Viewport Width Toggle */}
          <div className="flex items-center bg-muted/40 p-0.5 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => onSelectViewport("desktop")}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all cursor-pointer ${
                viewport === "desktop"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Desktop 100%"
            >
              <Monitor className="size-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectViewport("tablet")}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all cursor-pointer ${
                viewport === "tablet"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Tablet 768px"
            >
              <Tablet className="size-3.5" />
              <span className="hidden md:inline">768px</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectViewport("mobile")}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all cursor-pointer ${
                viewport === "mobile"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Mobile 390px"
            >
              <Smartphone className="size-3.5" />
              <span className="hidden md:inline">390px</span>
            </button>
          </div>

          {/* Zero-state Toggle (hero only) */}
          {selectedSection === "hero" && (
            <button
              type="button"
              onClick={onToggleHeroZeroState}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                heroZeroState
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 font-semibold"
                  : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground"
              }`}
              title="Preview dengan data kosong"
            >
              <AlertTriangle className="size-3" />
              <span>Zero-state</span>
            </button>
          )}

          {/* Display Mode: All vs Single */}
          <div className="flex items-center bg-muted/40 p-0.5 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => onToggleDisplayMode("all")}
              className={`px-2 py-1 text-xs rounded-md transition-all cursor-pointer ${
                displayMode === "all"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua ({availableVariantsCount})
            </button>
            <button
              type="button"
              onClick={() => onToggleDisplayMode("single")}
              className={`px-2 py-1 text-xs rounded-md transition-all cursor-pointer ${
                displayMode === "single"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Fokus
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

