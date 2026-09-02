"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Loader2, Check, X, ArrowLeft, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/components/toast-provider";
import { loadPendingUpgradeDraft, clearPendingUpgradeDraft, PendingUpgradeSiteDraft } from "@/components/site-wizard/wizard-persistence";
import { buildFullContent } from "@/lib/build-full-content";
import { encodeSiteId } from "@/lib/sqids";

interface Transaction {
  id: number;
  order_id: string;
  gross_amount: number;
  status: string;
  plan_id: number;
  payment_method: string;
  transaction_time: string;
  settlement_time: string;
}

const SETTLEMENT_STATUSES = new Set(["settlement", "capture"]);

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenant, refresh: refreshTenant } = useActiveTenant();
  const { t, locale } = useI18n();

  const orderId = searchParams.get("order_id");

  const [tx, setTx] = useState<Transaction | null>(null);
  const [settled, setSettled] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [pendingDraft, setPendingDraft] = useState<PendingUpgradeSiteDraft | null>(null);
  const [isSavingSite, setIsSavingSite] = useState(false);
  const settledRef = useRef(false);
  const tenantRef = useRef(activeTenant);
  tenantRef.current = activeTenant;

  useEffect(() => {
    const draft = loadPendingUpgradeDraft();
    if (draft && draft.businessName) {
      setPendingDraft(draft);
    }
  }, []);

  const handleSavePendingSite = async () => {
    if (!token || !activeTenant || !pendingDraft) return;
    try {
      setIsSavingSite(true);
      const subdomain =
        pendingDraft.businessName.toLowerCase().replace(/[^a-z0-9-]/g, "") +
        "-" +
        Math.floor(Math.random() * 9000 + 1000);

      // 1. Create site in active tenant
      const siteRes = await request<any>(
        "/sites",
        {
          method: "POST",
          headers: { "X-Tenant-ID": activeTenant.tenant.id.toString() },
          body: JSON.stringify({
            name: pendingDraft.businessName,
            template_id: pendingDraft.templateId || "TEMPLATE_DYNAMIC",
            subdomain,
          }),
        },
        token
      );

      const siteId = siteRes.data.id;

      // 2. Save enriched content
      if (pendingDraft.previewContent) {
        const enriched = buildFullContent(
          { content: pendingDraft.previewContent, design_token: pendingDraft.previewDesignToken },
          pendingDraft.businessName,
          pendingDraft.businessSubType || pendingDraft.businessType,
          pendingDraft.description || "",
          pendingDraft.whatsapp || ""
        );

        await request(
          `/sites/${siteId}/content`,
          {
            method: "PUT",
            headers: { "X-Tenant-ID": activeTenant.tenant.id.toString() },
            body: JSON.stringify({
              content: enriched,
              design_token: pendingDraft.previewDesignToken || {},
            }),
          },
          token
        );
      }

      // 3. Clear draft and navigate to editor
      clearPendingUpgradeDraft();
      pushToast("Website berhasil disimpan ke paket Pro Anda!", "success");
      router.push(`/dashboard/sites/${encodeSiteId(siteId)}`);
    } catch (err: any) {
      pushToast(err.message || "Gagal menyimpan website otomatis. Silakan coba lagi.", "error");
      setIsSavingSite(false);
    }
  };

  // Poll transaction until settlement
  useEffect(() => {
    if (!token || !orderId) return;
    let cancelled = false;

    const poll = async () => {
      for (let i = 0; i < 30; i++) {
        if (cancelled) return;
        try {
          const res = await request<Transaction>(`/payments/order/${orderId}`, {}, token);
          if (SETTLEMENT_STATUSES.has(res.data.status)) {
            if (!cancelled) {
              setTx(res.data);
              setSettled(true);
              settledRef.current = true;
            }
            return;
          }
        } catch {
          // not found yet — keep polling
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (!cancelled) setError(t("dashboard.upgradeSuccess.confirmTimeout"));
    };

    poll();
    return () => { cancelled = true; };
  }, [token, orderId, t]);

  // Once settled, poll tenant until plan changes
  useEffect(() => {
    if (!settled || !refreshTenant) return;
    let cancelled = false;

    const pollTenant = async () => {
      for (let i = 0; i < 10; i++) {
        if (cancelled) return;
        await refreshTenant();
        // read from ref, which tracks the latest render
        if (tenantRef.current?.tenant?.plan !== "free") {
          if (!cancelled) setConfirmed(true);
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (!cancelled) setConfirmed(true);
    };

    // small delay to let notification propagate
    const timer = setTimeout(pollTenant, 1000);
    return () => { cancelled = true; clearTimeout(timer); };
    // activeTenant not in deps — we use ref to re-read latest value inside the loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled, refreshTenant]);

  const isPending = !settled && !error;

  return (
    <div className="max-w-lg mx-auto space-y-6 pt-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="size-4" /> {t("dashboard.upgradeSuccess.backToDashboard")}
      </Link>

      <div className="bg-card border border-border/60 rounded-3xl p-8 text-center space-y-6 shadow-sm">
        <div className="flex justify-center">
          {isPending ? (
            <div className="size-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Loader2 className="size-8 text-amber-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <X className="size-8 text-red-400" />
            </div>
          ) : (
            <div className="size-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="size-8 text-emerald-400" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h1 className={`text-2xl font-bold tracking-tight ${isPending ? "text-amber-400" : error ? "text-red-400" : "text-emerald-400"}`}>
            {isPending ? t("dashboard.upgradeSuccess.pendingTitle") : error ? t("dashboard.upgradeSuccess.errorTitle") : t("dashboard.upgradeSuccess.successTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isPending
              ? t("dashboard.upgradeSuccess.pendingDesc")
              : error
                ? error
                : t("dashboard.upgradeSuccess.successDesc")}
          </p>
        </div>

        {tx && settled && (
          <div className="bg-muted/40 border border-border rounded-2xl p-5 space-y-3 text-left">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("dashboard.upgradeSuccess.txDetails")}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("dashboard.upgradeSuccess.orderIdLabel")}</span>
                <span className="font-mono text-xs text-foreground">{tx.order_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("dashboard.upgradeSuccess.totalLabel")}</span>
                <span className="font-bold text-foreground">Rp {tx.gross_amount.toLocaleString("id-ID")}</span>
              </div>
              {tx.payment_method && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("dashboard.upgradeSuccess.methodLabel")}</span>
                  <span className="text-foreground capitalize">{tx.payment_method.replace(/_/g, " ")}</span>
                </div>
              )}
              {tx.transaction_time && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("dashboard.upgradeSuccess.timeLabel")}</span>
                  <span className="text-foreground">
                    {new Date(tx.transaction_time).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                      day: "numeric", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {settled && (
          <div className="flex flex-col gap-3">
            {pendingDraft && (
              <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent p-5 text-left space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Website "{pendingDraft.businessName}" Siap Disimpan!
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Website yang Anda buat di wizard tadi siap disimpan ke paket Pro Anda yang baru. Klik tombol di bawah untuk langsung membuka Editor.
                </p>
                <Button
                  onClick={handleSavePendingSite}
                  disabled={isSavingSite}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold shadow-lg shadow-amber-500/25 transition-all text-sm"
                >
                  {isSavingSite ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan Website...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-1.5 fill-black" /> Simpan & Buka di Editor &rarr;
                    </>
                  )}
                </Button>
              </div>
            )}

            <Link
              href="/dashboard"
              onClick={(e) => {
                e.preventDefault();
                // Hard navigation to force tenant store re-fetch
                window.location.href = "/dashboard";
              }}
            >
              <Button variant={pendingDraft ? "secondary" : "default"} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                <Zap className="size-4 mr-2" /> {t("dashboard.upgradeSuccess.goToDashboard")}
              </Button>
            </Link>
            <Link href="/dashboard/upgrade">
              <Button variant="secondary" className="w-full h-12 rounded-xl font-bold bg-background text-foreground hover:bg-background/80 border border-border/60">
                {t("dashboard.upgradeSuccess.viewOtherPlans")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
