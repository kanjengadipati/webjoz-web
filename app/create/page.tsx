"use client";

import React, { useEffect, useState, Suspense, useMemo } from "react";
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
import { uploadImageFile } from "@/components/file-upload";

const PENDING_KEY = "webjoz_pending_wizard_data";
const SAVE_LOCK_KEY = "webjoz_save_in_progress";

function PublicWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const token = useAuthToken();
  const authReady = useAuthReady();
  const { activeTenantId, memberships, createTenant, resolveBusinessTenant, loading: tenantLoading } = useActiveTenant();

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
    // Jika lock lama tertinggal (mis. tab ditutup saat menyimpan), jangan biarkan
    // layar loading berputar selamanya: bebaskan lock dan lanjutkan.
    if (localStorage.getItem(SAVE_LOCK_KEY)) {
      localStorage.removeItem(SAVE_LOCK_KEY);
    }
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
        let tenantId: number | null = null;
        if (resolveBusinessTenant) {
          tenantId = await resolveBusinessTenant(pending.businessName);
        } else {
          const currentId = activeTenantId ? Number(activeTenantId) : null;
          tenantId = currentId;
          if (!tenantId && memberships && memberships.length > 0) {
            tenantId = Number(memberships[0].tenant.id);
          }
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
            const created = await createTenant(pending.businessName, slug);
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
          let logoForSave =
            pending.logo_url ||
            pending.previewContent?.header?.logo_url ||
            pending.previewContent?.seo?.favicon_url;

          if (logoForSave?.startsWith("data:")) {
            try {
              const blob = await (await fetch(logoForSave)).blob();
              const ext = blob.type === "image/svg+xml" ? "svg"
                : blob.type === "image/webp" ? "webp"
                : blob.type === "image/jpeg" ? "jpg"
                : "png";
              logoForSave = await uploadImageFile(
                new File([blob], `brand-logo.${ext}`, { type: blob.type || "image/png" }),
                { maxWidth: 512, maxHeight: 512 }
              );
            } catch (e) {
              console.warn("[create] failed to upload pending logo, omitting base64", e);
              logoForSave = null;
            }
          }

          const enrichedContent = buildFullContent(
            { content: pending.previewContent, design_token: pending.previewDesignToken, logo_url: logoForSave },
            pending.businessName,
            pending.businessSubType || pending.businessType,
            pending.description || "",
            pending.whatsapp || ""
          );
          if (logoForSave && !logoForSave.startsWith("data:")) {
            if (enrichedContent.header) enrichedContent.header.logo_url = logoForSave;
            if (enrichedContent.seo) enrichedContent.seo.favicon_url = logoForSave;
          }
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
        // Clear wizard keys so a failed save doesn't loop back to /create on next login
        localStorage.removeItem(PENDING_KEY);
        localStorage.removeItem(WIZARD_RESUME_KEY);
        localStorage.removeItem("webjoz_pending_upgrade_site");
        localStorage.removeItem("webjoz_login_redirect");
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
    return <AutoSaveScreen />;
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
            onClick={() => {
              localStorage.removeItem(PENDING_KEY);
              localStorage.removeItem(WIZARD_RESUME_KEY);
              localStorage.removeItem("webjoz_pending_upgrade_site");
              localStorage.removeItem("webjoz_login_redirect");
              setAutoSaveError("");
              router.push("/create");
            }}
            className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 transition-all"
          >
            Buat Ulang Website
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(PENDING_KEY);
              localStorage.removeItem(WIZARD_RESUME_KEY);
              localStorage.removeItem("webjoz_pending_upgrade_site");
              localStorage.removeItem("webjoz_login_redirect");
              router.push("/dashboard/sites");
            }}
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
      <SiteWizard
        mode="public"
        token={token}
        authReady={authReady}
        tenantLoading={tenantLoading}
        activeTenantId={activeTenantId}
        memberships={memberships}
        createTenant={createTenant}
        resolveBusinessTenant={resolveBusinessTenant}
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

// ── AutoSaveScreen ────────────────────────────────────────────────────────────
function AutoSaveScreen() {
  const [step, setStep] = React.useState(0);
  const [progress, setProgress] = React.useState(8);

  // Step timing: step 0 starts immediately, step 1 after 1.2s, step 2 after 3.5s
  React.useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Smooth progress bar: fast to 60%, slows down, never reaches 100 until done
  React.useEffect(() => {
    const targets = [60, 80, 92];
    const target = targets[step] ?? 92;
    let raf: number;
    const tick = () => {
      setProgress((prev) => {
        const next = prev + (target - prev) * 0.06;
        if (Math.abs(next - target) < 0.3) return target;
        raf = requestAnimationFrame(tick);
        return next;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  const steps = [
    "Konten website disiapkan",
    "Menyimpan data website...",
    "Menyelesaikan proses...",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
      {/* Illustration */}
      <div className="relative mb-10 flex items-end justify-center gap-3">
        {/* Browser window */}
        <div className="relative w-44 h-32 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.07]">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
          {/* Content skeleton */}
          <div className="p-3 space-y-2">
            <div className="flex gap-2">
              <div className="w-14 h-10 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="14" height="14" rx="2" stroke="white" strokeOpacity="0.3" strokeWidth="1.2"/>
                  <path d="M1 10l4-3 3 2.5 3-4 4 4.5" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" strokeLinejoin="round"/>
                  <circle cx="5" cy="5.5" r="1.5" fill="white" fillOpacity="0.3"/>
                </svg>
              </div>
              <div className="flex-1 space-y-1.5 pt-0.5">
                <div className="h-2 rounded-full bg-white/15 w-full" />
                <div className="h-2 rounded-full bg-white/10 w-4/5" />
                <div className="h-2 rounded-full bg-white/10 w-3/5" />
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/[0.07] w-full" />
            <div className="h-2 rounded-full bg-white/[0.07] w-5/6" />
          </div>
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-skeleton-shimmer" />
        </div>

        {/* Cloud upload icon */}
        <div className="mb-2 w-14 h-14 rounded-2xl bg-[#1f1f1f] border border-white/10 shadow-xl flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M20.5 18.5A5 5 0 0018 9h-1.26A8 8 0 104 17.74" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14v8M11 17l3-3 3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Sparkles */}
        <div className="absolute -top-2 left-8 text-white/30 text-xs animate-pulse">✦</div>
        <div className="absolute top-0 right-6 text-white/20 text-[10px] animate-pulse delay-300">✦</div>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
        Menyimpan website kamu
      </h1>
      <p className="text-sm text-white/50 mb-8 text-center">
        Sebentar lagi. Kami sedang menyimpan semua perubahan.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-sm mb-6">
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps checklist */}
      <div className="w-full max-w-sm rounded-2xl bg-white/[0.04] border border-white/[0.07] overflow-hidden mb-8">
        {steps.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] last:border-0 transition-all duration-300 ${
                done ? "opacity-100" : active ? "opacity-100" : "opacity-35"
              }`}
            >
              {/* Icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                done
                  ? "bg-white"
                  : active
                  ? "border-2 border-white/60"
                  : "border-2 border-white/20"
              }`}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : active ? (
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                ) : null}
              </div>
              <span className={`text-sm ${done ? "text-white/70" : active ? "text-white font-medium" : "text-white/40"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="flex items-center gap-1.5 text-white/30 text-xs">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M7 6.5v3.5M7 4.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        Jangan tutup halaman ini.
      </div>
    </div>
  );
}
