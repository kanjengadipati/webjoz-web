"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { MIDTRANS_CLIENT_KEY, PAYPAL_ENABLED, PAYPAL_CLIENT_ID } from "@/lib/config";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";
import { Crown, Sparkles, Check, Loader2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import PaymentModal from "@/components/payment-modal";
import { PlanItem } from "@/components/pricing-cards";
import Link from "next/link";

interface WizardUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessName: string;
  onUpgradeSuccess: () => Promise<void>;
}

export function WizardUpgradeModal({
  open,
  onOpenChange,
  businessName,
  onUpgradeSuccess,
}: WizardUpgradeModalProps) {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const { activeTenant, refresh: refreshTenant } = useActiveTenant();

  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [paymentGateway, setPaymentGateway] = useState<"midtrans" | "paypal">("midtrans");
  
  // Checkout & Payment Modal state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSnapModal, setShowSnapModal] = useState(false);
  const [snapToken, setSnapToken] = useState("");
  const [isCompletingSave, setIsCompletingSave] = useState(false);

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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !token || !activeTenant) return;

    try {
      setIsProcessing(true);
      const currency = paymentGateway === "paypal" ? "USD" : "IDR";
      const callbackUrl = `${window.location.origin}/dashboard/upgrade/success?from=wizard`;

      const res = await request<any>(
        "/payments",
        {
          method: "POST",
          headers: { "X-Tenant-ID": activeTenant.tenant.id.toString() },
          body: JSON.stringify({
            plan_id: selectedPlan.id,
            billing_cycle: billingCycle,
            gateway: paymentGateway,
            currency,
            callback_url: callbackUrl,
          }),
        },
        token
      );

      if (res.data?.snap_token) {
        setSnapToken(res.data.snap_token);
        setShowSnapModal(true);
      } else if (res.data?.approval_url) {
        // PayPal redirect fallback
        window.location.href = res.data.approval_url;
      } else {
        throw new Error("Gagal menginisialisasi pembayaran.");
      }
    } catch (err: any) {
      pushToast(err.message || "Gagal memproses pembayaran.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setShowSnapModal(false);
    setIsCompletingSave(true);
    try {
      pushToast("Pembayaran berhasil! Mengaktifkan akun...", "success");
      // Refresh tenant plan so permission checks pass
      if (refreshTenant) {
        await refreshTenant();
      }
      // Delay a moment to allow DB write propagation
      await new Promise((r) => setTimeout(r, 1200));
      // Save the website directly into editor
      await onUpgradeSuccess();
      onOpenChange(false);
    } catch (err: any) {
      pushToast(err.message || "Gagal menyimpan website otomatis. Anda dapat menyimpannya dari dashboard.", "error");
      setIsCompletingSave(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title={
          <div className="flex items-center gap-2 text-amber-400">
            <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>Batas Website Tercapai</span>
          </div>
        }
        footer={
          <div className="flex items-center justify-between w-full pt-2 border-t border-white/10">
            <Link
              href="/dashboard/upgrade?from=wizard"
              onClick={() => onOpenChange(false)}
              className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
            >
              Lihat halaman paket lengkap <ArrowRight className="w-3 h-3" />
            </Link>
            <Button
              onClick={handleCheckout}
              disabled={isProcessing || isCompletingSave || loadingPlans || !selectedPlan}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold shadow-lg shadow-amber-500/20"
            >
              {isCompletingSave ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan Website...
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-1.5 fill-black" /> Upgrade & Simpan Website
                </>
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-1 text-slate-200">
          <p className="text-xs sm:text-sm text-slate-300">
            Website <strong className="text-white">"{businessName || "Bisnis Anda"}"</strong> siap disimpan! 
            Upgrade paket Anda untuk membuka kuota website tambahan, custom domain, dan fitur AI tanpa batas.
          </p>

          {/* Billing cycle toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-white/[0.06] p-1 rounded-xl border border-white/10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  billingCycle === "yearly"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tahunan
                <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                  Hemat 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan highlights card */}
          {loadingPlans ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : selectedPlan ? (
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-white/[0.03] to-transparent p-4 sm:p-5 relative overflow-hidden shadow-xl">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-base text-white">{selectedPlan.name}</h4>
                    <span className="bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                      Rekomendasi
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-extrabold text-amber-400">
                    {formatPrice(
                      billingCycle === "yearly"
                        ? selectedPlan.price_yearly || selectedPlan.price_monthly * 12 * 0.8
                        : selectedPlan.price_monthly
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {billingCycle === "yearly" ? "/ tahun" : "/ bulan"}
                  </span>
                </div>
              </div>

              {/* Feature list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hingga <strong>{selectedPlan.max_sites || 5} Website</strong> Aktif</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Koneksi <strong>Custom Domain (.com/.id)</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Regenerasi & Desain <strong>Tanpa Batas</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bebas Watermark & Branding Webjoz</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Payment gateway selection */}
          {PAYPAL_ENABLED && (
            <div className="flex items-center justify-between text-xs px-1 text-slate-400">
              <span>Metode Pembayaran:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentGateway("midtrans")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                    paymentGateway === "midtrans"
                      ? "border-primary bg-primary/20 text-white"
                      : "border-white/10 text-slate-400"
                  }`}
                >
                  QRIS / Transfer (Midtrans)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentGateway("paypal")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                    paymentGateway === "paypal"
                      ? "border-primary bg-primary/20 text-white"
                      : "border-white/10 text-slate-400"
                  }`}
                >
                  PayPal (USD)
                </button>
              </div>
            </div>
          )}

          {/* Security guarantee */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Pembayaran aman & bergaransi. Website otomatis aktif seketika.</span>
          </div>
        </div>
      </Dialog>

      {/* Midtrans Snap Modal */}
      {showSnapModal && snapToken && (
        <PaymentModal
          snapToken={snapToken}
          clientKey={MIDTRANS_CLIENT_KEY}
          onClose={() => setShowSnapModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
