"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuthToken, useAuthReady } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { useToast } from "@/components/toast-provider";
import { SiteWizard } from "@/components/site-wizard";
import { request } from "@/lib/api/client";

const PENDING_KEY = "webjoz_pending_wizard_data";

export default function PublicWizardPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const token = useAuthToken();
  const authReady = useAuthReady();
  const { activeTenantId, memberships, createTenant, loading: tenantLoading } = useActiveTenant();

  // Show loading screen immediately if returning from login with ?action=save
  const [autoSaving, setAutoSaving] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") !== "save") return false;
    return !!localStorage.getItem(PENDING_KEY);
  });

  // ── Auto-save after login redirect ────────────────────────────────────────
  // When user comes back from login with ?action=save, auto-save the pending
  // wizard data and redirect directly to the newly created site editor.
  useEffect(() => {
    if (!authReady || tenantLoading) return;
    if (!token) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("action") !== "save") return;

    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;

    let pending: Record<string, any>;
    try {
      pending = JSON.parse(raw);
    } catch {
      return;
    }

    if (!pending.businessName || !pending.businessType) return;

    // Remove query param so page doesn't loop on refresh
    router.replace("/create", { scroll: false });

    const doSave = async () => {
      setAutoSaving(true);
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
              template_id: "TEMPLATE_DYNAMIC",
              subdomain,
            }),
          },
          token
        );
        if (createRes.status !== "success") throw new Error(createRes.message);
        const siteId = createRes.data.id;

        // 2. Restore the AI-generated content from localStorage (saved before login)
        if (pending.previewContent) {
          await request(
            `/sites/${siteId}/content`,
            {
              method: "PUT",
              headers: { "X-Tenant-ID": tenantId.toString() },
              body: JSON.stringify({
                content: pending.previewContent,
                design_token: pending.previewDesignToken || {},
              }),
            },
            token
          );
        }

        localStorage.removeItem(PENDING_KEY);

        // Redirect langsung ke editor website yang baru dibuat
        router.push(`/dashboard/sites/${siteId}`);
      } catch (err: any) {
        console.error(err);
        pushToast(err.message || "Gagal menyimpan website. Silakan coba lagi.", "error");
        setAutoSaving(false);
      }
    };

    doSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, token, tenantLoading]);

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
          <p className="text-white font-semibold text-lg">Menyimpan & Mempublikasikan Website...</p>
          <p className="text-slate-400 text-sm">Sebentar ya, kami sedang merakit website kamu ✨</p>
        </div>
      </div>
    );
  }

  // ── Main wizard page ──────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ background: "linear-gradient(160deg, #090d1f 0%, #05070f 100%)" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Giwangan Studio"
              width={28}
              height={28}
              className="rounded-lg object-contain"
            />
            <span className="text-xs font-semibold tracking-widest text-slate-300 uppercase">
              Giwangan Studio
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs text-white/50 hover:text-white transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* ── Wizard ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-stretch py-6">
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
    </div>
  );
}
