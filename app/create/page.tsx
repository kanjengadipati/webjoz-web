"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthToken, useAuthReady } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { useToast } from "@/components/toast-provider";
import { SiteWizard } from "@/components/site-wizard";
import { request } from "@/lib/api/client";
import { buildFullContent } from "@/lib/build-full-content";
import { decodeDesignTokenParam } from "@/lib/design-token-library";
import { WIZARD_RESUME_KEY, loadWizardSnapshot } from "@/components/site-wizard/wizard-persistence";
import { encodeSiteId } from "@/lib/sqids";

const PENDING_KEY = "webjoz_pending_wizard_data";
const SAVE_LOCK_KEY = "webjoz_save_in_progress";

function PublicWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const token = useAuthToken();
  const authReady = useAuthReady();
  const { activeTenantId, memberships, createTenant, loading: tenantLoading } = useActiveTenant();

  const isSaveAction = searchParams.get("action") === "save";
  const initialBusinessType = searchParams.get("businessType") || undefined;
  const initialBusinessSubType = searchParams.get("businessSubType") || undefined;
  const refParam = searchParams.get("ref") || searchParams.get("referral_code");

  // Design token dipilih dari galeri landing page — dipakai sebagai starting
  // point visual di wizard (seed preview + design_token hint ke backend).
  const dtParam = searchParams.get("dt");
  const initialDesignToken = useMemo(
    () => (dtParam ? decodeDesignTokenParam(dtParam) : null),
    [dtParam]
  );

  const [activeReferralCode, setActiveReferralCode] = useState<string>("");

  useEffect(() => {
    if (refParam && typeof window !== "undefined") {
      localStorage.setItem("webjoz_referral_code", refParam);
      setActiveReferralCode(refParam);
    } else if (typeof window !== "undefined") {
      const saved = localStorage.getItem("webjoz_referral_code");
      if (saved) setActiveReferralCode(saved);
    }
  }, [refParam]);

  // We track save state reactively to URL param changes
  const [pendingSave, setPendingSave] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [autoSaveError, setAutoSaveError] = useState("");
  // NOTE: intentionally NOT using useRef here — Suspense can unmount+remount the
  // component, which resets useRef to false and causes doSave() to run twice.
  // Using localStorage as a persistent lock that survives remounts.

  useEffect(() => {
    document.documentElement.classList.add("webjoz-wizard-active");
    document.body.classList.add("webjoz-wizard-active");

    return () => {
      document.documentElement.classList.remove("webjoz-wizard-active");
      document.body.classList.remove("webjoz-wizard-active");
    };
  }, []);

  // Whenever the URL changes to include ?action=save, trigger the save intent
  useEffect(() => {
    if (isSaveAction) {
      setPendingSave(true);
      setAutoSaving(true);
    }
  }, [isSaveAction]);

  // ── Auto-save after login redirect ────────────────────────────────────────
  // When user comes back from login with ?action=save, auto-save the pending
  // wizard data and redirect directly to the newly created site editor.
  useEffect(() => {
    if (!pendingSave) return;
    if (!authReady) return;
    if (!token) {
      // Auth is ready but user is not logged in — the loading screen would otherwise
      // spin forever. Check if there's still pending wizard data to save.
      const hasPendingData =
        !!localStorage.getItem(PENDING_KEY) ||
        !!localStorage.getItem("webjoz_pending_upgrade_site") ||
        !!(loadWizardSnapshot()?.businessName);

      setAutoSaving(false);
      setPendingSave(false);

      if (hasPendingData) {
        // Still have data to save — send to login so they can authenticate and come back
        localStorage.setItem("webjoz_login_redirect", "/create?action=save");
        router.replace("/login");
      } else {
        // No pending data (already saved or cleared) — just show the wizard
        router.replace("/create");
      }
      return;
    }
    // Wait for tenant to finish loading (we need activeTenantId or createTenant)
    if (tenantLoading) return;

    // Acquire a cross-render save lock BEFORE any async work.
    // localStorage survives Suspense unmount/remount; useRef does not.
    if (localStorage.getItem(SAVE_LOCK_KEY)) return;
    localStorage.setItem(SAVE_LOCK_KEY, "1");

    // Clean up the URL immediately so refresh doesn't re-trigger
    window.history.replaceState(null, "", "/create");

    let raw = localStorage.getItem(PENDING_KEY) || localStorage.getItem("webjoz_pending_upgrade_site");
    let pending: Record<string, any> | null = null;
    if (raw) {
      try {
        pending = JSON.parse(raw);
      } catch {
        /* ignore parse error */
      }
    }

    // Robust fallback: if PENDING_KEY was empty or missing, recover from wizard resume snapshot
    if (!pending || !pending.businessName) {
      const snapshot = loadWizardSnapshot();
      if (snapshot && snapshot.businessName && (snapshot.preview?.content || snapshot.chat?.description)) {
        pending = {
          businessName: snapshot.businessName,
          businessType: snapshot.chat?.businessType,
          businessSubType: snapshot.chat?.businessSubType,
          description: snapshot.chat?.description,
          whatsapp: snapshot.chat?.whatsapp,
          service_area: snapshot.chat?.serviceArea,
          mood: snapshot.chat?.mood,
          language: snapshot.chat?.siteLanguage || "id",
          templateId: snapshot.preview?.templateId,
          previewContent: snapshot.preview?.content,
          previewDesignToken: snapshot.preview?.designToken,
        };
      }
    }

    if (!pending || !pending.businessName) {
      // No pending wizard data found
      router.replace("/dashboard/sites");
      setPendingSave(false);
      setAutoSaving(false);
      return;
    }

    const doSave = async () => {
      setAutoSaving(true);
      setAutoSaveError("");
      try {
        let tenantId = activeTenantId;
        if (!tenantId && memberships && memberships.length > 0) {
          tenantId = memberships[0].tenant.id;
        }
        if (!tenantId && createTenant) {
          const slug =
            pending.businessName.toLowerCase().replace(/[^a-z0-9-]/g, "") +
            "-" +
            Math.floor(Math.random() * 1000);
          const created = await createTenant(pending.businessName + " Workspace", slug);
          if (created?.id) tenantId = created.id;
          else throw new Error("Gagal membuat workspace.");
        }
        if (!tenantId) throw new Error("Workspace tidak ditemukan.");

        const subdomain =
          pending.businessName.toLowerCase().replace(/[^a-z0-9-]/g, "") +
          "-" +
          Math.floor(Math.random() * 9000 + 1000);

        // 1. Create site entry (no AI re-generation!)
        let siteId: string;
        try {
          const createRes = await request<any>(
            "/sites",
            {
              method: "POST",
              headers: { "X-Tenant-ID": tenantId.toString() },
              body: JSON.stringify({
                name: pending.businessName,
                template_id: pending.templateId || "TEMPLATE_DYNAMIC",
                subdomain,
                language: pending.language || "id",
              }),
            },
            token
          );
          siteId = createRes.data.id;
        } catch (err: any) {
          // If existing tenant is at its site limit, auto-create a new tenant and retry
          if (err.code === "ERR_SITE_LIMIT" && createTenant) {
            const slug =
              pending.businessName.toLowerCase().replace(/[^a-z0-9-]/g, "") +
              "-" +
              Math.floor(Math.random() * 1000);
            const created = await createTenant(pending.businessName + " Workspace", slug);
            if (!created?.id) throw new Error("Gagal membuat workspace baru.");
            const subdomain2 =
              pending.businessName.toLowerCase().replace(/[^a-z0-9-]/g, "") +
              "-" +
              Math.floor(Math.random() * 9000 + 1000);
            const retryRes = await request<any>(
              "/sites",
              {
                method: "POST",
                headers: { "X-Tenant-ID": created.id.toString() },
                body: JSON.stringify({
                  name: pending.businessName,
                  template_id: pending.templateId || "TEMPLATE_DYNAMIC",
                  subdomain: subdomain2,
                  language: pending.language || "id",
                }),
              },
              token
            );
            siteId = retryRes.data.id;
            tenantId = created.id;
          } else {
            throw err;
          }
        }
        // 2. Restore the AI-generated content from localStorage (saved before login)
        // PENTING: pending.previewContent itu konten mentah dari AI/stream — bisa ada
        // field kosong. Jalankan buildFullContent dulu, sama seperti yang dipakai untuk
        // preview di wizard, supaya site yang baru dibuat tidak kosong di Editor.
        if (pending.previewContent) {
          const enrichedContent = buildFullContent(
            { content: pending.previewContent, design_token: pending.previewDesignToken },
            pending.businessName,
            pending.businessSubType || pending.businessType,
            pending.description || "",
            pending.whatsapp || ""
          );
          await request(
            `/sites/${siteId}/content`,
            {
              method: "PUT",
              headers: { "X-Tenant-ID": tenantId.toString() },
              body: JSON.stringify({
                content: enrichedContent,
                design_token: pending.previewDesignToken || {},
              }),
            },
            token
          );
        }

        localStorage.removeItem(PENDING_KEY);
        localStorage.removeItem(WIZARD_RESUME_KEY);
        localStorage.removeItem("webjoz_login_redirect");
        localStorage.removeItem(SAVE_LOCK_KEY); // release lock after successful save

        // Redirect langsung ke editor website yang baru dibuat
        router.push(`/dashboard/sites/${encodeSiteId(siteId)}`);
      } catch (err: any) {
        console.error(err);
        const msg = err.message || "Gagal menyimpan website. Silakan coba lagi.";
        pushToast(msg, "error");
        setAutoSaveError(msg);
        setAutoSaving(false);
        setPendingSave(false);
        localStorage.removeItem(SAVE_LOCK_KEY); // release lock so user can retry
      }
    };

    doSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSave, authReady, token, tenantLoading]);

  // ── Auth redirect handler (called from wizard) ────────────────────────────
  const handleNeedAuth = () => {
    pushToast("Daftar atau login dulu untuk menyimpan & edit website kamu.", "info");
    // Use window.location.replace (not router.push/replace) because Next.js App Router's
    // router.replace doesn't reliably replace native browser history entries.
    // window.location.replace() is guaranteed by the browser spec to remove /create
    // from the history stack, so pressing Back from /login returns to / (landing).
    window.location.replace(`/login?redirect=${encodeURIComponent("/create?action=save")}`);
  };

  // ── Auto-save loading screen ──────────────────────────────────────────────
  if (autoSaving) {
    return (
      <div
        className="min-h-screen text-white flex flex-col relative"
        style={{ background: "linear-gradient(160deg, #090d1f 0%, #05070f 100%)" }}
      >
        {activeReferralCode && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
            <span>✨ Mendaftar via Partner Referensi Webjoz (Kode: <span className="font-mono">{activeReferralCode}</span>)</span>
          </div>
        )}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Loader2 className="w-9 h-9 text-primary animate-spin" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border border-primary/20 animate-ping opacity-30" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-white font-semibold text-lg">Menyimpan &amp; Mempublikasikan Website...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state after failed auto-save ───────────────────────────────────
  if (autoSaveError) {
    return (
      <div
        className="min-h-screen text-white flex flex-col items-center justify-center gap-6 px-6"
        style={{ background: "linear-gradient(160deg, #090d1f 0%, #05070f 100%)" }}
      >
        <div className="text-center space-y-3 max-w-sm">
          <p className="text-4xl">😔</p>
          <p className="text-white font-bold text-lg">Gagal menyimpan website</p>
          <p className="text-slate-400 text-sm">{autoSaveError}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setAutoSaveError(""); router.push("/create"); }}
            className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 transition-all"
          >
            Buat Ulang Website
          </button>
          <button
            onClick={() => router.push("/dashboard/sites")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all"
          >
            Ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Main wizard page ──────────────────────────────────────────────────────
  return (
    <div
      className="dark fixed left-0 top-0 w-screen overflow-hidden bg-[#0d0f14] flex flex-col text-foreground"
      style={{ height: "var(--webjoz-app-height, 100dvh)" }}
    >
      {activeReferralCode && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-1.5 text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2 z-50">
          <span>✨ Mendaftar via Partner Referensi Webjoz (Kode: <span className="font-mono uppercase">{activeReferralCode}</span>)</span>
        </div>
      )}
      <SiteWizard
        mode="public"
        token={token}
        authReady={authReady}
        tenantLoading={tenantLoading}
        activeTenantId={activeTenantId}
        memberships={memberships}
        createTenant={createTenant}
        onNeedAuth={handleNeedAuth}
        initialBusinessType={initialBusinessType}
        initialBusinessSubType={initialBusinessSubType}
        initialDesignToken={initialDesignToken ?? undefined}
      />
    </div>
  );
}

export default function PublicWizardPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen text-white flex flex-col items-center justify-center gap-8"
          style={{ background: "linear-gradient(160deg, #090d1f 0%, #05070f 100%)" }}
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Loader2 className="w-9 h-9 text-primary animate-spin" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border border-primary/20 animate-ping opacity-30" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-white font-semibold text-lg">Memuat halaman...</p>
          </div>
        </div>
      }
    >
      <PublicWizardContent />
    </Suspense>
  );
}
