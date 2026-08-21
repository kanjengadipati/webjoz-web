"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { Globe, Sparkles, Palette, Wand2 } from "lucide-react";

export interface UsageData {
  sites: number;
  generates: number;
  sectionRegens: number;
  designRegens: number;
}

export interface UsageLimits {
  maxSites: number;
  maxGenerates: number;
  maxSectionRegens: number;
  maxDesignRegens: number;
}

interface UsageMeterProps {
  usage: UsageData;
  limits: UsageLimits;
  compact?: boolean;
  className?: string;
  siteCount?: number;
}

function unlimited(max: number) {
  return max <= 0;
}

function percent(used: number, max: number) {
  if (unlimited(max)) return 100;
  return Math.min((used / max) * 100, 100);
}

function remainingText(used: number, max: number, unlimitedLabel: string) {
  if (unlimited(max)) return unlimitedLabel;
  const r = Math.max(max - used, 0);
  return String(r);
}

const METERS = [
  { key: "sites", icon: Globe, color: "bg-primary", textColor: "text-primary" } as const,
  { key: "generates", icon: Sparkles, color: "bg-amber-500", textColor: "text-amber-500" } as const,
  { key: "sectionRegens", icon: Wand2, color: "bg-violet-500", textColor: "text-violet-500" } as const,
  { key: "designRegens", icon: Palette, color: "bg-cyan-500", textColor: "text-cyan-500" } as const,
] as const;

const LABEL_KEYS = {
  sites: "dashboard.meterWebsites",
  generates: "dashboard.meterAiGenerate",
  sectionRegens: "dashboard.meterSectionRegen",
  designRegens: "dashboard.meterDesignRegen",
} as const;

const LIMIT_KEYS = {
  sites: "maxSites",
  generates: "maxGenerates",
  sectionRegens: "maxSectionRegens",
  designRegens: "maxDesignRegens",
} as const;

const USAGE_KEYS = {
  sites: "sites",
  generates: "generates",
  sectionRegens: "sectionRegens",
  designRegens: "designRegens",
} as const;

export function UsageMeter({ usage, limits, compact = false, className, siteCount }: UsageMeterProps) {
  const { t } = useI18n();
  const items = METERS.map((m) => {
    const used = m.key === "sites" ? (siteCount ?? usage.sites) : usage[m.key];
    const max = limits[LIMIT_KEYS[m.key]];
    const pct = percent(used, max);
    const isUnlimited = unlimited(max);
    const isNearLimit = !isUnlimited && pct >= 80;
    const isAtLimit = !isUnlimited && pct >= 100;

    return {
      ...m,
      used,
      max,
      pct,
      isUnlimited,
      isNearLimit,
      isAtLimit,
      label: t(LABEL_KEYS[m.key]),
      limitText: isUnlimited ? "∞" : String(max),
      remaining: remainingText(used, max, t("dashboard.unlimited")),
    };
  });

  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((item) => (
          <div key={item.key}>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-muted-foreground">{item.label}</span>
              <span className={cn("font-semibold tabular-nums", item.isAtLimit && "text-destructive")}>
                {item.used} / {item.limitText}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", item.color)}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className={cn(
              "bg-card rounded-3xl border border-border/60 p-5 shadow-sm transition-all",
              item.isAtLimit && "border-destructive/40 bg-destructive/5",
              item.isNearLimit && !item.isAtLimit && "border-amber-500/40 bg-amber-500/5",
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon className={cn("size-4", item.textColor)} />
                <span className="text-sm font-semibold text-muted-foreground">{item.label}</span>
              </div>
              {item.isAtLimit && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                  {t("dashboard.limitReached")}
                </span>
              )}
              {item.isNearLimit && !item.isAtLimit && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {t("dashboard.nearLimit")}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className={cn("text-2xl font-bold tabular-nums", item.isAtLimit && "text-destructive")}>
                {item.used}
              </span>
              <span className="text-sm text-muted-foreground font-medium">/ {item.limitText}</span>
            </div>
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden mb-2">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  item.color,
                  item.isAtLimit && "animate-pulse",
                )}
                style={{ width: `${item.pct}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {item.isUnlimited
                ? t("dashboard.unlimitedUsage")
                : t("dashboard.remaining", undefined, { count: item.remaining })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
