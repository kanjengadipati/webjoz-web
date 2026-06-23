"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthToken, useAuthReady } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { useToast } from "@/components/toast-provider";
import { SiteWizard } from "@/components/site-wizard";
import { request } from "@/lib/api/client";
import { buildFullContent } from "@/lib/build-full-content";

const PENDING_KEY = "webjoz_pending_wizard_data";

function PublicWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const token = useAuthToken();
  const authReady = useAuthReady();
  const { activeTenantId, memberships, createTenant, loading: tenantLoading } = useActiveTenant();

  const isSaveAction = searchParams.get("action") === "save";

  // We track save state reactively to URL param changes
  const [pendingSave, setPendingSave] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [autoSaveError, setAutoSaveError] = useState("");

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
    if (!token) return;
    // Wait for tenant to finish loading (we need activeTenantId or createTenant)
    if (tenantLoading) return;

    // Clean up the URL immediately so refresh doesn't re-trigger
    window.history.replaceState(null, "", "/create");

    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) {
      // No pending wizard data (e.g. magic link opened in different browser/device).
      router.replace("/dashboard/sites");
      setPendingSave(false);
      setAutoSaving(false);
      return;
    }

    let pending: Record<string, any>;
    try {
      pending = JSON.parse(raw);
    } catch {
      router.replace("/dashboard/sites");
      setPendingSave(false);
      setAutoSaving(false);
      return;
    }

    if (!pending.businessName || !pending.businessType) {
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
        const createRes = await request<any>(
          "/sites",
          {
            method: "POST",
            headers: { "X-Tenant-ID": tenantId.toString() },
            body: JSON.stringify({
              name: pending.businessName,
              template_id: pending.templateId || "TEMPLATE_DYNAMIC",
              subdomain,
            }),
          },
          token
        );
        if (createRes.status !== "success") throw new Error(createRes.message);
        const siteId = createRes.data.id;

        // 2. Restore the AI-generated content from localStorage (saved before login)
        // PENTING: pending.previewContent itu konten mentah dari AI/stream — bisa ada
        // field kosong. Jalankan buildFullContent dulu, sama seperti yang dipakai untuk
        // preview di wizard, supaya site yang baru dibuat tidak kosong di Editor.
        if (pending.previewContent) {
          const enrichedContent = buildFullContent(
            { content: pending.previewContent },
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
        localStorage.removeItem("webjoz_login_redirect");

        // Redirect langsung ke editor website yang baru dibuat
        router.push(`/dashboard/sites/${siteId}`);
      } catch (err: any) {
        console.error(err);
        const msg = err.message || "Gagal menyimpan website. Silakan coba lagi.";
        pushToast(msg, "error");
        setAutoSaveError(msg);
        setAutoSaving(false);
        setPendingSave(false);
      }
    };

    doSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSave, authReady, token, tenantLoading]);

  // ── Auth redirect handler (called from wizard) ────────────────────────────
  const handleNeedAuth = () => {
    pushToast("Daftar atau login dulu untuk menyimpan & edit website kamu.", "info");
    router.push("/login?redirect=/create?action=save");
  };

  // ── Auto-save loading screen ──────────────────────────────────────────────
  if (autoSaving) {
    return (
      <div
        className="min-h-screen text-white flex flex-col items-center justify-center gap-8"
        style={{ background: "linear-gradient(160deg, #090d1f 0%, #05070f 100%)" }}
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Loader2 className="w-9 h-9 text-indigo-400 animate-spin" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border border-indigo-500/20 animate-ping opacity-30" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-white font-semibold text-lg">Menyimpan &amp; Mempublikasikan Website...</p>
          <p className="text-slate-400 text-sm">Sebentar ya, kami sedang merakit website kamu ✨</p>
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
      className="fixed left-0 top-0 w-screen overflow-hidden bg-[#0d0f14]"
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
        onNeedAuth={handleNeedAuth}
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
            <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Loader2 className="w-9 h-9 text-indigo-400 animate-spin" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border border-indigo-500/20 animate-ping opacity-30" />
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
