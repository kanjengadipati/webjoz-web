"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SNAP_BASE_URL, PAYPAL_ENABLED, PAYPAL_CLIENT_ID } from "@/lib/config";
import { useToast } from "@/components/toast-provider";
import { Loader2, Check, ArrowLeft, X } from "lucide-react";
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
  gateway: string;
  currency: string;
  paypal_order_id: string;
  approval_url: string;
  discount_amount: number;
}

interface PromoValidationResponse {
  valid: boolean;
  message: string;
  original_price: number;
  discount_amount: number;
  final_price: number;
  promo_label: string;
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

function loadPayPalScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).paypal) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load PayPal SDK")));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&disable-funding=credit,card`;
    script.setAttribute("data-client-id", PAYPAL_CLIENT_ID);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
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
  const [paymentGateway, setPaymentGateway] = useState<"midtrans" | "paypal">("midtrans");

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoValidation, setPromoValidation] = useState<PromoValidationResponse | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  // PayPal popup state
  const [paypalModal, setPaypalModal] = useState(false);
  const [paypalPendingOrderID, setPaypalPendingOrderID] = useState<string | null>(null);
  const paypalBtnRef = useRef<HTMLDivElement>(null);
  const paypalRenderedRef = useRef(false);

  const showGatewayChoice = PAYPAL_ENABLED && MIDTRANS_CLIENT_KEY;

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

  // Validate promo code
  const validatePromoCode = async (code: string, plan: PlanItem) => {
    if (!code.trim()) {
      setPromoValidation(null);
      setPromoError(null);
      return;
    }

    setPromoLoading(true);
    setPromoError(null);

    try {
      const currency = paymentGateway === "paypal" ? "USD" : "IDR";
      const amount = billingCycle === "yearly"
        ? (paymentGateway === "paypal" ? (plan.price_yearly_usd || (plan.price_yearly ? plan.price_yearly / 16000 : plan.price_monthly * 12 / 16000)) : (plan.price_yearly || plan.price_monthly * 12))
        : (paymentGateway === "paypal" ? (plan.price_monthly_usd || plan.price_monthly / 16000) : plan.price_monthly);

      const res = await request<PromoValidationResponse>(
        "/promos/validate",
        {
          method: "POST",
          body: JSON.stringify({
            code: code.trim(),
            plan_slug: plan.slug,
            amount: amount,
            currency: currency,
            cycle: billingCycle,
            tenant_id: activeTenant?.tenant.id,
          }),
        },
        token
      );
      
      const result = res.data;
      setPromoValidation(result);
      if (!result.valid) {
        setPromoError(result.message || "Kode promo tidak valid");
      }
    } catch (err: any) {
      setPromoError(err.message || "Gagal memvalidasi kode promo");
      setPromoValidation(null);
    } finally {
      setPromoLoading(false);
    }
  };

  // Render PayPal button inside modal
  useEffect(() => {
    if (!paypalModal || !paypalPendingOrderID || !paypalBtnRef.current) return;
    if (paypalRenderedRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        console.log("[PayPal] Loading SDK, CLIENT_ID:", PAYPAL_CLIENT_ID ? "set" : "MISSING");
        await loadPayPalScript();
        console.log("[PayPal] SDK loaded, paypal object:", !!(window as any).paypal);
        if (cancelled || !paypalBtnRef.current || !(window as any).paypal) {
          console.log("[PayPal] Aborted - cancelled:", cancelled, "ref:", !!paypalBtnRef.current, "paypal:", !!(window as any).paypal);
          return;
        }
        paypalBtnRef.current.innerHTML = "";
        const btn = (window as any).paypal.Buttons({
          style: { layout: "vertical", color: "blue", shape: "rect", label: "pay" },
          createOrder: () => {
            return Promise.resolve(paypalPendingOrderID);
          },
          onApprove: async (data: any) => {
            try {
              await request(`/payments/paypal/capture/${paypalPendingOrderID}`, {
                method: "POST",
                headers: { "X-Tenant-ID": activeTenant!.tenant.id.toString() },
              }, token!);
              setPaymentDone(true);
              setPaypalModal(false);
              router.push(`/dashboard/upgrade/success?order_id=${paypalPendingOrderID}`);
            } catch {
              pushToast(t("dashboard.upgrade.paymentFailed"), "error");
              setPaypalModal(false);
              setPaying(null);
            }
          },
          onError: () => {
            pushToast(t("dashboard.upgrade.paymentFailed"), "error");
            setPaypalModal(false);
            setPaying(null);
          },
          onCancel: () => {
            pushToast(t("dashboard.upgrade.paymentCancelled"), "info");
            setPaypalModal(false);
            setPaying(null);
          },
        }).render(paypalBtnRef.current);
        console.log("[PayPal] Buttons rendered");
        paypalRenderedRef.current = true;
      } catch (err) {
        console.error("[PayPal] Error:", err);
        if (!cancelled) {
          pushToast("Failed to load PayPal", "error");
          setPaypalModal(false);
          setPaying(null);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [paypalModal, paypalPendingOrderID, activeTenant, token, router, pushToast, t]);

  const handleSelectPlan = async (plan: PlanItem) => {
    if (plan.slug === currentPlan) return;
    if (!token || !activeTenant) {
      pushToast(t("dashboard.upgrade.pleaseLogin"), "error");
      return;
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
      if (paymentGateway === "paypal") {
        const res = await request<PaymentResponse>(
          "/payments",
          {
            method: "POST",
            headers: { "X-Tenant-ID": activeTenant.tenant.id.toString() },
            body: JSON.stringify({
              plan_id: plan.id,
              billing_cycle: billingCycle,
              callback_url: `${window.location.origin}/dashboard/upgrade/success`,
              amount: 0,
              gateway: "paypal",
              currency: "USD",
              promo_code: promoCode || undefined,
            }),
          },
          token,
        );

        const payment = res.data;
        if (!payment?.order_id) {
          pushToast(t("dashboard.upgrade.tokenFailed"), "error");
          setPaying(null);
          return;
        }

        // Open PayPal popup modal
        paypalRenderedRef.current = false;
        setPaypalPendingOrderID(payment.order_id);
        setPaypalModal(true);
      } else {
        // Midtrans flow
        if (!snapReady) {
          try {
            await loadSnapScript();
            setSnapReady(true);
          } catch {}
        }

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
              gateway: "midtrans",
              currency: "IDR",
              promo_code: promoCode || undefined,
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
          pushToast(t("dashboard.upgrade.redirecting"), "info");
          window.location.href = payment.snap_redirect_url;
        } else {
          pushToast(t("dashboard.upgrade.processFailed"), "error");
          setPaying(null);
        }
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

      {showGatewayChoice && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPaymentGateway("midtrans")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              paymentGateway === "midtrans"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            IDR — Midtrans
          </button>
          <button
            onClick={() => setPaymentGateway("paypal")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              paymentGateway === "paypal"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            USD — PayPal
          </button>
        </div>
      )}

      {/* Promo Code Input */}
      <div className="max-w-md mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Masukkan kode promo"
            className="flex-1 px-4 py-2 rounded-xl border border-border/60 bg-card/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition"
            disabled={promoLoading}
          />
          <button
            onClick={() => {
              if (plans.length > 0 && !paying) {
                const targetPlan = plans.find(p => p.slug !== "free" && p.slug !== "starter") || plans.find(p => p.slug !== "free") || plans[0];
                validatePromoCode(promoCode, targetPlan);
              }
            }}
            disabled={!promoCode.trim() || promoLoading || paying !== null}
            className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {promoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Terapkan"
            )}
          </button>
        </div>
        
        {promoValidation && promoValidation.valid && (
          <div className="mt-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">
                {promoValidation.promo_label}
              </span>
            </div>
            <p className="text-xs text-emerald-600/80 mt-1">
              Diskon {paymentGateway === "paypal" ? "$" : "Rp "}
              {promoValidation.discount_amount.toLocaleString()} — Harga akhir{" "}
              {paymentGateway === "paypal" ? "$" : "Rp "}
              {promoValidation.final_price.toLocaleString()}
            </p>
          </div>
        )}
        
        {promoError && (
          <div className="mt-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
            <p className="text-sm text-destructive">{promoError}</p>
          </div>
        )}
      </div>

      <PricingCards
        plans={plans}
        billingCycle={billingCycle}
        onCycleChange={setBillingCycle}
        currentPlanSlug={currentPlan}
        payingPlanId={paying}
        onSelectPlan={handleSelectPlan}
        currency={paymentGateway === "paypal" ? "USD" : "IDR"}
        monthlyLabel={t("dashboard.upgrade.monthly")}
        yearlyLabel={t("dashboard.upgrade.yearly")}
        currentPlanLabel={t("dashboard.upgrade.currentPlan")}
        customDomainLabel={t("dashboard.upgrade.customDomainFeature")}
        customDomainSubtext={t("dashboard.upgrade.customDomainSubtext")}
        noCustomDomainLabel={t("dashboard.upgrade.noCustomDomain")}
      />

      {/* PayPal Popup Modal */}
      {paypalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
              <h3 className="font-semibold text-lg">PayPal Checkout</h3>
              <button
                onClick={() => {
                  setPaypalModal(false);
                  setPaying(null);
                  pushToast(t("dashboard.upgrade.paymentCancelled"), "info");
                }}
                className="p-1 rounded-lg hover:bg-muted transition"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 py-8 flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Klik tombol di bawah untuk menyelesaikan pembayaran via PayPal.
              </p>
              <div ref={paypalBtnRef} className="w-full min-h-[50px]" />
              <button
                onClick={() => {
                  setPaypalModal(false);
                  setPaying(null);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
