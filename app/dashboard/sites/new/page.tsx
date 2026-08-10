"use client";

import { Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { SiteWizard } from "@/components/site-wizard";
import { useI18n } from "@/lib/i18n/context";

export default function NewSiteWizardPage() {
  const router = useRouter();
  const token  = useAuthToken();
  const { activeTenantId, loading: tenantLoading } = useActiveTenant();
  const { t } = useI18n();

  if (tenantLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 bg-[#0d0f14]">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-slate-500">{t("dashboard.sitesNew.connecting")}</p>
      </div>
    );
  }

  if (!activeTenantId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#0d0f14] px-6 text-center">
        <Building2 className="w-12 h-12 text-primary/60 mx-auto" />
        <h2 className="text-lg font-bold text-white">{t("dashboard.sitesNew.noWorkspaceTitle")}</h2>
        <p className="text-xs text-slate-500 max-w-xs">
          {t("dashboard.sitesNew.noWorkspaceDesc")}
        </p>
        <button
          onClick={() => router.push("/dashboard/sites")}
          className="mt-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-colors"
        >
          {t("dashboard.sitesNew.backToDashboard")}
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
