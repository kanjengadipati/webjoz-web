"use client";

import { Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { SiteWizard } from "@/components/site-wizard";

export default function NewSiteWizardPage() {
  const router = useRouter();
  const token  = useAuthToken();
  const { activeTenantId, loading: tenantLoading } = useActiveTenant();

  if (tenantLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 bg-[#0d0f14]">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-slate-500">Menghubungkan ke workspace...</p>
      </div>
    );
  }

  if (!activeTenantId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#0d0f14] px-6 text-center">
        <Building2 className="w-12 h-12 text-primary/60 mx-auto" />
        <h2 className="text-lg font-bold text-white">Harap Buat Workspace Terlebih Dahulu</h2>
        <p className="text-xs text-slate-500 max-w-xs">
          Anda perlu memiliki setidaknya satu workspace bisnis aktif untuk membuat website.
        </p>
        <button
          onClick={() => router.push("/dashboard/sites")}
          className="mt-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <SiteWizard
      mode="dashboard"
      token={token}
      activeTenantId={activeTenantId}
    />
  );
}
