"use client";

import React from "react";
import { Button, Card } from "@/components/ui";
import { Check, Loader2, X } from "lucide-react";
import { BillingCycleSwitcher, BillingCycle } from "@/components/billing-cycle-switcher";

export interface PlanItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  promo_price_monthly: number;
  promo_price_yearly: number;
  promo_duration_months: number;
  promo_label: string;
  max_sites: number;
  max_ai_generates: number;
  max_section_regens: number;
  max_design_regens: number;
  max_members: number;
  max_custom_domain: number;
  features: string;
}

interface PricingCardsProps {
  plans: PlanItem[];
  loading?: boolean;
  billingCycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
  currentPlanSlug?: string;
  payingPlanId?: number | null;
  onSelectPlan: (plan: PlanItem) => void;
  // Labels override (optional for i18n)
  monthlyLabel?: string;
  yearlyLabel?: string;
  saveBadgeLabel?: string;
  saveText?: string;
  popularBadgeLabel?: string;
  priceFreeLabel?: string;
  priceFreePeriodLabel?: string;
  currentPlanLabel?: string;
  freePlanButtonLabel?: string;
}

export function PricingCards({
  plans,
  loading = false,
  billingCycle,
  onCycleChange,
  currentPlanSlug,
  payingPlanId = null,
  onSelectPlan,
  monthlyLabel = "Bulanan",
  yearlyLabel = "Tahunan",
  saveBadgeLabel = "Hemat ~16%",
  saveText,
  popularBadgeLabel = "Terpopuler",
  priceFreeLabel = "Gratis",
  priceFreePeriodLabel = "Selamanya",
  currentPlanLabel = "Paket Saat Ini",
  freePlanButtonLabel = priceFreeLabel,
}: PricingCardsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Billing Cycle Switcher */}
      <BillingCycleSwitcher
        billingCycle={billingCycle}
        onCycleChange={onCycleChange}
        monthlyLabel={monthlyLabel}
        yearlyLabel={yearlyLabel}
        saveBadgeLabel={saveBadgeLabel}
        showSaveText={true}
        saveText={saveText}
      />

      {/* Pricing Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isFree = plan.slug === "free";
          const isPro = plan.slug === "pro";
          const isCurrent = currentPlanSlug === plan.slug;
          const isYearly = billingCycle === "yearly";

          // --- Price calculation ---
          const normalYearly = plan.price_yearly > 0 ? plan.price_yearly : plan.price_monthly * 12;
          const effectiveYearly = plan.promo_price_yearly > 0 ? plan.promo_price_yearly : normalYearly;
          const effectiveMonthly =
            plan.promo_price_monthly > 0 && plan.promo_duration_months > 0
              ? plan.promo_price_monthly
              : plan.price_monthly;
          const monthlyEquivalent = Math.round(effectiveYearly / 12);
          const yearlySavings = plan.price_monthly * 12 - effectiveYearly;

          // --- Feature list from API fields ---
          const featureList = [
            plan.max_sites > 0 && `${plan.max_sites} Website`,
            plan.max_ai_generates > 0 && `AI Generate ${plan.max_ai_generates}x/bulan`,
            plan.max_section_regens > 0 && `AI Regenerasi ${plan.max_section_regens}x/bulan`,
            plan.max_design_regens > 0 && `AI Design ${plan.max_design_regens}x/bulan`,
            plan.max_custom_domain > 0
              ? `${plan.max_custom_domain} Custom Domain`
              : "Tidak ada custom domain",
            "SEO Booster",
            !isFree && "Subdomain .webjoz.app",
            isFree && "Hosting & SSL gratis",
          ].filter(Boolean) as string[];

          return (
            <Card
              key={plan.id}
              className={`px-6 py-8 text-center shadow-lg relative flex flex-col justify-between transition-all ${
                isCurrent
                  ? "border-emerald-500/50 ring-2 ring-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/10"
                  : isPro
                  ? "border-primary ring-1 ring-primary/30 bg-gradient-to-br from-primary/10 via-card to-primary/5 shadow-primary/20 overflow-hidden md:scale-[1.03] md:z-10"
                  : "border-border/60 bg-card/60 shadow-primary/5"
              }`}
            >
              {isPro && !isCurrent && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                  {popularBadgeLabel}
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                  Aktif
                </div>
              )}

              <div>
                <div
                  className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                    isPro ? "text-muted-foreground" : "text-primary"
                  }`}
                >
                  {plan.name}
                </div>

                {/* Price display */}
                {isFree ? (
                  <>
                    <div className="text-4xl font-bold text-foreground mb-1">{priceFreeLabel}</div>
                    <p className="text-sm text-muted-foreground mb-6">{priceFreePeriodLabel}</p>
                  </>
                ) : isYearly ? (
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-foreground mb-1">
                      Rp {(effectiveYearly / 1000).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                      <span className="text-lg font-semibold">.000</span>
                    </div>
                    {plan.promo_price_yearly > 0 && (
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground line-through">
                          Rp {normalYearly.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-semibold uppercase">
                          {plan.promo_label || "Promo"}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      / tahun ·{" "}
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Setara Rp {monthlyEquivalent.toLocaleString("id-ID")}/bln
                      </span>
                    </p>
                    {yearlySavings > 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        🎉 Hemat Rp {yearlySavings.toLocaleString("id-ID")}/tahun
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-foreground mb-1">
                      Rp {(effectiveMonthly / 1000).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                      <span className="text-lg font-semibold">.000</span>
                    </div>
                    {plan.promo_price_monthly > 0 && plan.promo_duration_months > 0 && (
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground line-through">
                          Rp {plan.price_monthly.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-semibold uppercase">
                          {plan.promo_label || `Promo ${plan.promo_duration_months} bln`}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      / bulan · Rp {normalYearly.toLocaleString("id-ID")}/tahun
                    </p>
                  </div>
                )}

                <ul className="space-y-2.5 text-sm text-left mb-8">
                  {featureList.map((item) => {
                    const isNegative = item.startsWith("Tidak ada");
                    return (
                      <li key={item} className="flex items-start gap-2">
                        {isNegative ? (
                          <X className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                        ) : (
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        )}
                        <span className={isNegative ? "text-muted-foreground/60" : ""}>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {isCurrent ? (
                <span className="block w-full py-2.5 rounded-full text-sm font-semibold text-center bg-primary/10 text-primary border border-primary/20">
                  {currentPlanLabel}
                </span>
              ) : (
                <Button
                  onClick={() => onSelectPlan(plan)}
                  disabled={payingPlanId !== null}
                  className="w-full rounded-full font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {payingPlanId === plan.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : isFree ? (
                    freePlanButtonLabel
                  ) : (
                    `Pilih ${plan.name} (${isYearly ? yearlyLabel : monthlyLabel})`
                  )}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
