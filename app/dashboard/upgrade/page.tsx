"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SNAP_BASE_URL } from "@/lib/config";
import { useToast } from "@/components/toast-provider";
import { Loader2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PricingCards, PlanItem } from "@/components/pricing-cards";
import { useI18n } from "@/lib/i18n/context";



interface PaymentResponse {
  id: number;
  snap_token: string;
  snap_redirect_url: string;
  order_id: string;
  gross_amount: number;
  status: string;
}

function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).snap) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `${MIDTRANS_SNAP_BASE_URL}/snap/snap.js`;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap"));
    document.body.appendChild(script);
  });
}

export default function UpgradePage() {
  const token = useAuthToken();
  const router = useRouter();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const { activeTenant } = useActiveTenant();

  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<number | null>(null);
  const [snapReady, setSnapReady] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    if (!token) return;
    const fetchPlans = async () => {
      try {
        const res = await request<PlanItem[]>("/plans/active", {}, token);
        setPlans(res.data || []);
      } catch (err: any) {
        pushToast(err.message || t("dashboard.upgrade.loadPlansFailed"), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [token]);

  useEffect(() => {
    if (!MIDTRANS_CLIENT_KEY) return;
    loadSnapScript()
      .then(() => setSnapReady(true))
      .catch(() => {});
  }, []);

  const currentPlan = activeTenant?.tenant.plan || "free";

  const handleSelectPlan = async (plan: PlanItem) => {
    if (plan.slug === currentPlan) return;
    if (!token || !activeTenant) {
      pushToast(t("dashboard.upgrade.pleaseLogin"), "error");
      return;
    }
    if (plan.price_monthly <= 0) {
      pushToast(t("dashboard.upgrade.freeActive"), "info");
      return;
    }
    // Try to pre-load Snap JS; if it fails we'll fall back to redirect
    if (!snapReady) {
      try {
        await loadSnapScript();
        setSnapReady(true);
      } catch {
        // Snap JS blocked (e.g. CSP) — will redirect instead
      }
    }

    const isYearly = billingCycle === "yearly";
    const targetAmount = isYearly
      ? plan.promo_price_yearly > 0
        ? plan.promo_price_yearly
        : plan.price_yearly > 0
          ? plan.price_yearly
          : plan.price_monthly * 12
      : plan.promo_price_monthly > 0 && plan.promo_duration_months > 0
        ? plan.promo_price_monthly
        : plan.price_monthly;

    setPaying(plan.id);
    try {
      const res = await request<PaymentResponse>(
        "/payments",
        {
          method: "POST",
          headers: { "X-Tenant-ID": activeTenant.tenant.id.toString() },
          body: JSON.stringify({
            plan_id: plan.id,
            billing_cycle: billingCycle,
            callback_url: `${window.location.origin}/dashboard/upgrade/success`,
            amount: targetAmount,
          }),
        },
        token,
      );

      const payment = res.data;
      if (!payment?.snap_token && !payment?.snap_redirect_url) {
        pushToast(t("dashboard.upgrade.tokenFailed"), "error");
        setPaying(null);
        return;
      }

      // Use popup if Snap JS loaded successfully; otherwise fall back to redirect
      if ((window as any).snap && payment.snap_token) {
        (window as any).snap.pay(payment.snap_token, {
          onSuccess: async () => {
            setPaymentDone(true);
            router.push(`/dashboard/upgrade/success?order_id=${payment.order_id}`);
          },
          onPending: () => {
            pushToast(t("dashboard.upgrade.waitingPayment"), "info");
            setPaying(null);
          },
          onError: () => {
            pushToast(t("dashboard.upgrade.paymentFailed"), "error");
            setPaying(null);
          },
          onClose: () => {
            if (!paymentDone) {
              pushToast(t("dashboard.upgrade.paymentCancelled"), "info");
              setPaying(null);
            }
          },
        });
      } else if (payment.snap_redirect_url) {
        // Fallback: redirect to Midtrans hosted payment page
        pushToast(t("dashboard.upgrade.redirecting"), "info");
        window.location.href = payment.snap_redirect_url;
      } else {
        pushToast(t("dashboard.upgrade.processFailed"), "error");
        setPaying(null);
      }
    } catch (err: any) {
      pushToast(err.message || t("dashboard.upgrade.processFailed"), "error");
      setPaying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">{t("dashboard.upgrade.loadingPlans")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-primary/10 transition text-muted-foreground hover:text-primary"
          aria-label={t("dashboard.upgrade.backToDashboard")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.upgrade.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("dashboard.upgrade.subtitle")}
          </p>
        </div>
      </div>

      {paymentDone && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
          <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
            <Check className="size-6 text-emerald-400" />
          </div>
          <p className="text-lg font-bold">{t("dashboard.upgrade.paymentSuccess")}</p>
          <p className="text-sm text-muted-foreground">{t("dashboard.upgrade.upgradingDesc")}</p>
        </div>
      )}

      <PricingCards
        plans={plans}
        billingCycle={billingCycle}
        onCycleChange={setBillingCycle}
        currentPlanSlug={currentPlan}
        payingPlanId={paying}
        onSelectPlan={handleSelectPlan}
        monthlyLabel={t("dashboard.upgrade.monthly")}
        yearlyLabel={t("dashboard.upgrade.yearly")}
        currentPlanLabel={t("dashboard.upgrade.currentPlan")}
      />
    </div>
  );
}

