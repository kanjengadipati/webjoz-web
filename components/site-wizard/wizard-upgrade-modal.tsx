"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n/context";
import { Crown, Check, Loader2, ArrowRight, ShieldCheck, Zap, X } from "lucide-react";
import { PlanItem } from "@/components/pricing-cards";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WizardUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessName: string;
  onUpgradeSuccess?: () => Promise<void>;
}

export function WizardUpgradeModal({
  open,
  onOpenChange,
  businessName,
}: WizardUpgradeModalProps) {
  const token = useAuthToken();
  const router = useRouter();
  const { t, locale } = useI18n();

  const isEn = locale === "en";

  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    if (!open || !token) return;
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const res = await request<PlanItem[]>("/plans/active", {}, token);
        const list = res.data || [];
        setPlans(list);
        // Default select the first paid plan (usually Pro)
        const paid = list.find((p) => p.slug !== "free" && p.slug !== "starter") || list.find((p) => p.slug !== "free");
        if (paid) setSelectedPlanId(paid.id);
      } catch {
        // ignore
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, [open, token]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans.find((p) => p.slug !== "free");

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(isEn ? "en-US" : "id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRedirectToUpgrade = () => {
    onOpenChange(false);
    const planSlug = selectedPlan?.slug || "pro";
    router.push(`/dashboard/upgrade?from=wizard&plan=${encodeURIComponent(planSlug)}&billing=${billingCycle}`);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => onOpenChange(false)}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-amber-500/30 bg-slate-950 text-slate-100 shadow-2xl shadow-amber-500/10 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={isEn ? "Close modal" : "Tutup modal"}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="space-y-2 pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              {t(
                "dashboard.wizardUpgrade.badge",
                isEn ? "Website Quota Limit Reached" : "Batas Kuota Website Tercapai"
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
            {t(
              "dashboard.wizardUpgrade.title",
              isEn ? "Website Ready to Save! 🎉" : "Website Siap Disimpan! 🎉"
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isEn ? (
              <>
                Website <strong className="text-amber-300 font-semibold">"{businessName || "Your Business"}"</strong> is ready! Upgrade to the <strong className="text-white font-semibold">Pro</strong> plan to save this website, connect your custom domain, and unlock unlimited AI features.
              </>
            ) : (
              <>
                Website <strong className="text-amber-300 font-semibold">"{businessName || "Bisnis Anda"}"</strong> telah berhasil dibuat. Upgrade ke paket <strong className="text-white font-semibold">Pro</strong> untuk menyimpan website ini, menghubungkan domain kustom, dan menikmati fitur AI tanpa batas.
              </>
            )}
          </p>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="flex justify-center pt-1">
          <div className="inline-flex p-1 rounded-2xl bg-white/[0.06] border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t("dashboard.wizardUpgrade.cycleMonthly", isEn ? "Monthly" : "Bulanan")}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{t("dashboard.wizardUpgrade.cycleYearly", isEn ? "Yearly" : "Tahunan")}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wide ${
                  billingCycle === "yearly"
                    ? "bg-slate-950/20 text-slate-950"
                    : "bg-amber-400/20 text-amber-300"
                }`}
              >
                {t("dashboard.wizardUpgrade.savePercent", isEn ? "Save 20%" : "Hemat 20%")}
              </span>
            </button>
          </div>
        </div>

        {/* Plan Highlight Card */}
        {loadingPlans ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
            <span className="text-xs text-slate-400">
              {t(
                "dashboard.wizardUpgrade.loadingPlans",
                isEn ? "Loading plan details..." : "Memuat rincian paket..."
              )}
            </span>
          </div>
        ) : selectedPlan ? (
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-amber-500/[0.03] to-white/[0.02] p-4 sm:p-5 relative overflow-hidden shadow-lg space-y-4">
            {/* Card top */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{selectedPlan.name}</h3>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                    {t(
                      "dashboard.wizardUpgrade.recommended",
                      isEn ? "Recommended" : "Rekomendasi"
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedPlan.description}</p>
              </div>
              <div className="sm:text-right">
                <div className="text-2xl font-black text-amber-400 tracking-tight leading-none">
                  {formatPrice(
                    billingCycle === "yearly"
                      ? selectedPlan.price_yearly || selectedPlan.price_monthly * 12 * 0.8
                      : selectedPlan.price_monthly
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {billingCycle === "yearly"
                    ? isEn
                      ? "/ year (approx. IDR 124k/mo)"
                      : "/ tahun (setara Rp 124rb/bln)"
                    : isEn
                    ? "/ month"
                    : "/ bulan"}
                </span>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>
                  {isEn ? (
                    <>Up to <strong className="text-white">{selectedPlan.max_sites || 5} Active Websites</strong></>
                  ) : (
                    <>Hingga <strong className="text-white">{selectedPlan.max_sites || 5} Website</strong> Aktif</>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>
                  {isEn ? (
                    <>Connect <strong className="text-white">Custom Domain</strong></>
                  ) : (
                    <>Koneksi <strong className="text-white">Custom Domain</strong></>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>
                  {isEn ? (
                    <>Unlimited <strong className="text-white">AI Generation</strong></>
                  ) : (
                    <>AI Generator <strong className="text-white">Tanpa Batas</strong></>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>
                  {isEn ? (
                    <>Remove Watermark & Branding</>
                  ) : (
                    <>Bebas Watermark & Branding</>
                  )}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Action Button & Navigation */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleRedirectToUpgrade}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 active:scale-[0.99] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>
              {t(
                "dashboard.wizardUpgrade.btnUpgradeAndSave",
                isEn ? "Upgrade & Save Website Now" : "Upgrade & Simpan Website Sekarang"
              )}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Bottom Links & Trust */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <Link
              href="/dashboard/upgrade?from=wizard"
              onClick={() => onOpenChange(false)}
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>
                {t(
                  "dashboard.wizardUpgrade.linkAllPlans",
                  isEn ? "View all plans" : "Lihat semua paket"
                )}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                {t(
                  "dashboard.wizardUpgrade.securityGuarantee",
                  isEn ? "Secure & guaranteed payment" : "Pembayaran aman & bergaransi"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
