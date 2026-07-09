"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SNAP_BASE_URL } from "@/lib/config";
import { useToast } from "@/components/toast-provider";
import { Loader2, Check, X, ArrowLeft, Zap, Globe, Users, HardDrive, RefreshCw } from "lucide-react";
import Link from "next/link";

interface PlanItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_sites: number;
  max_ai_generates: number;
  max_ai_regens: number;
  max_members: number;
  max_custom_domain: number;
  max_storage_mb: number;
  features: string;
}

interface PaymentResponse {
  id: number;
  snap_token: string;
  snap_redirect_url: string;
  order_id: string;
  gross_amount: number;
  status: string;
}

const FEATURE_LABELS: Record<string, string> = {
  max_sites: "Jumlah Website",
  max_ai_generates: "AI Generate / bulan",
  max_ai_regens: "AI Regenerasi / bulan",
  max_members: "Anggota Tim",
  max_custom_domain: "Custom Domain",
  max_storage_mb: "Penyimpanan",
};

function formatFeatureValue(key: string, value: number): string {
  if (key === "max_storage_mb") {
    return value >= 1024 ? `${(value / 1024).toFixed(0)} GB` : `${value} MB`;
  }
  if (value === 0) return "—";
  if (value >= 1000) return "Tak terbatas";
  return value.toString();
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
  const { activeTenant, refresh: refreshTenant } = useActiveTenant();

  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<number | null>(null);
  const [snapReady, setSnapReady] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchPlans = async () => {
      try {
        const res = await request<PlanItem[]>("/plans/active", {}, token);
        setPlans(res.data || []);
      } catch (err: any) {
        pushToast(err.message || "Gagal memuat paket", "error");
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
      pushToast("Silakan login terlebih dahulu", "error");
      return;
    }
    if (plan.price_monthly <= 0) {
      pushToast("Paket Free sudah aktif", "info");
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

    setPaying(plan.id);
    try {
      const res = await request<PaymentResponse>(
        "/payments",
        {
          method: "POST",
          headers: { "X-Tenant-ID": activeTenant.tenant.id.toString() },
          body: JSON.stringify({
            plan_id: plan.id,
            callback_url: `${window.location.origin}/dashboard/upgrade/success`,
          }),
        },
        token,
      );

      const payment = res.data;
      if (!payment?.snap_token && !payment?.snap_redirect_url) {
        pushToast("Gagal mendapatkan token pembayaran", "error");
        setPaying(null);
        return;
      }

      // Use popup if Snap JS loaded successfully; otherwise fall back to redirect
      if ((window as any).snap && payment.snap_token) {
        (window as any).snap.pay(payment.snap_token, {
          onSuccess: async () => {
            pushToast("Pembayaran berhasil! Meng-upgrade paket...", "success");
            setPaymentDone(true);
            await refreshTenant();
            await new Promise((r) => setTimeout(r, 2000));
            router.push("/dashboard");
          },
          onPending: () => {
            pushToast("Menunggu pembayaran... Silakan selesaikan di halaman Midtrans.", "info");
            setPaying(null);
          },
          onError: () => {
            pushToast("Pembayaran gagal, silakan coba lagi", "error");
            setPaying(null);
          },
          onClose: () => {
            if (!paymentDone) {
              pushToast("Pembayaran dibatalkan", "info");
              setPaying(null);
            }
          },
        });
      } else if (payment.snap_redirect_url) {
        // Fallback: redirect to Midtrans hosted payment page
        pushToast("Mengarahkan ke halaman pembayaran...", "info");
        window.location.href = payment.snap_redirect_url;
      } else {
        pushToast("Gagal memproses pembayaran", "error");
        setPaying(null);
      }
    } catch (err: any) {
      pushToast(err.message || "Gagal memproses pembayaran", "error");
      setPaying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat paket...</p>
      </div>
    );
  }

  const paidPlans = plans.filter((p) => p.slug !== "free");
  const freePlan = plans.find((p) => p.slug === "free");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-primary/10 transition text-muted-foreground hover:text-primary"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upgrade Paket</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pilih paket yang sesuai dengan kebutuhan website Anda.
          </p>
        </div>
      </div>

      {paymentDone && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
          <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
            <Check className="size-6 text-emerald-400" />
          </div>
          <p className="text-lg font-bold">Pembayaran Berhasil!</p>
          <p className="text-sm text-muted-foreground">Paket Anda sedang di-upgrade. Mengalihkan ke dashboard...</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        {freePlan && (
          <div className={`rounded-2xl border p-6 space-y-5 ${currentPlan === "free" ? "border-primary/40 bg-primary/5" : "border-border/40 bg-card"}`}>
            <div className="space-y-2">
              <h3 className="text-lg font-bold capitalize">{freePlan.name}</h3>
              <p className="text-sm text-muted-foreground">{freePlan.description}</p>
            </div>
            <div>
              <span className="text-3xl font-bold">Gratis</span>
            </div>
            {currentPlan === "free" ? (
              <span className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-primary/10 text-primary border border-primary/20">
                Paket Saat Ini
              </span>
            ) : (
              <span className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-muted text-muted-foreground">
                Tidak Tersedia
              </span>
            )}
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span>{freePlan.max_sites} Website</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span>{freePlan.max_ai_generates} AI Generate / bln</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 shrink-0" />
                <span>{freePlan.max_ai_regens} Regenerasi / bln</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="size-4 text-muted-foreground/40 shrink-0" />
                <span className="text-muted-foreground/60">Tidak ada custom domain</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="size-4 text-muted-foreground/40 shrink-0" />
                <span className="text-muted-foreground/60">SEO dasar</span>
              </li>
            </ul>
          </div>
        )}

        {paidPlans.map((plan) => {
          const isCurrent = currentPlan === plan.slug;
          const isBest = plan.slug === "pro";
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 space-y-5 transition-all ${
                isCurrent
                  ? "border-primary/40 bg-primary/5"
                  : paying === plan.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-border/40 bg-card hover:border-primary/30 hover:shadow-lg"
              }`}
            >
              {isBest && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-3 py-1 bg-primary text-primary-foreground rounded-full font-extrabold uppercase tracking-wider">
                  Terpopuler
                </span>
              )}
              <div className="space-y-2">
                <h3 className="text-lg font-bold capitalize">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div>
                <span className="text-3xl font-bold">Rp {plan.price_monthly.toLocaleString("id-ID")}</span>
                <span className="text-sm text-muted-foreground"> /bln</span>
              </div>
              {isCurrent ? (
                <span className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-primary/10 text-primary border border-primary/20">
                  Paket Saat Ini
                </span>
              ) : (
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={paying !== null}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-[0_0_16px_color-mix(in_srgb,var(--primary)_40%,transparent)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {paying === plan.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Pilih " + plan.name
                  )}
                </button>
              )}
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <Globe className="size-4 text-primary shrink-0" />
                  <span>{plan.max_sites} Website</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="size-4 text-primary shrink-0" />
                  <span>{plan.max_ai_generates} AI Generate / bln</span>
                </li>
                <li className="flex items-center gap-2">
                  <RefreshCw className="size-4 text-primary shrink-0" />
                  <span>{plan.max_ai_regens} Regenerasi / bln</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="size-4 text-primary shrink-0" />
                  <span>{plan.max_custom_domain > 0 ? `${plan.max_custom_domain} Custom Domain` : "Tidak ada custom domain"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="size-4 text-primary shrink-0" />
                  <span>{plan.max_members} Anggota Tim</span>
                </li>
                <li className="flex items-center gap-2">
                  <HardDrive className="size-4 text-primary shrink-0" />
                  <span>{formatFeatureValue("max_storage_mb", plan.max_storage_mb)} Penyimpanan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-400 shrink-0" />
                  <span>SEO optimasi</span>
                </li>
              </ul>
              {plan.features && (
                <p className="text-xs text-muted-foreground/60 leading-relaxed border-t border-border/40 pt-4">
                  {plan.features}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
