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
            <div className="flex items-center justify-between text-[11px] mb-1 gap-2">
              <span className="text-muted-foreground truncate">{item.label}</span>
              <span className={cn("font-semibold tabular-nums shrink-0", item.isAtLimit && "text-destructive")}>
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
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className={cn(
              "bg-card rounded-3xl border border-border/60 p-5 shadow-sm transition-all flex flex-col justify-between",
              item.isAtLimit && "border-rose-500/40 bg-rose-500/5 ring-1 ring-rose-500/20",
              item.isNearLimit && !item.isAtLimit && "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20",
            )}
          >
            <div>
              {/* Card Header: Icon + Title on Left, Badge on Right */}
              <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="size-6 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                    <Icon className={cn("size-3.5", item.textColor)} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {item.label}
                  </span>
                </div>

                {item.isAtLimit && (
                  <span className="shrink-0 whitespace-nowrap text-[9px] font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full shadow-2xs">
                    {t("dashboard.limitReached", "Limit")}
                  </span>
                )}
                {item.isNearLimit && !item.isAtLimit && (
                  <span className="shrink-0 whitespace-nowrap text-[9px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full shadow-2xs">
                    {t("dashboard.nearLimit", "Near Limit")}
                  </span>
                )}
              </div>

              {/* Card Numbers */}
              <div className="flex items-baseline gap-1.5 mb-2.5">
                <span className={cn("text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight", item.isAtLimit ? "text-rose-500" : "text-foreground")}>
                  {item.used}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground font-semibold">/ {item.limitText}</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 rounded-full bg-muted/50 overflow-hidden mb-2.5">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    item.color,
                    item.isAtLimit && "bg-rose-500",
                  )}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>

            {/* Bottom Remaining Text */}
            <p className="text-[11px] font-medium text-muted-foreground">
              {item.isUnlimited
                ? t("dashboard.unlimitedUsage", "Pemakaian tanpa batas")
                : t("dashboard.remaining", undefined, { count: item.remaining })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
