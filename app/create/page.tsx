"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuthToken, useAuthReady } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { useToast } from "@/components/toast-provider";
import { SiteWizard } from "@/components/site-wizard";

const PENDING_KEY = "giwangan_pending_wizard_data";

export default function PublicWizardPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const token     = useAuthToken();
  const authReady = useAuthReady();
  const { activeTenantId, memberships, createTenant, loading: tenantLoading } = useActiveTenant();

  const handleNeedAuth = () => {
    pushToast("Harap daftar atau login terlebih dahulu untuk menyimpan website.", "info");
    router.push("/login?redirect=/create");
  };

  return (
    <div
      className="min-h-screen text-white pb-24"
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
      <div className="pt-10">
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
