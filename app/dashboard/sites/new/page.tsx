"use client";

import { Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { Button, Card } from "@/components/ui";
import { SiteWizard } from "@/components/site-wizard";

export default function NewSiteWizardPage() {
  const router = useRouter();
  const token  = useAuthToken();
  const { activeTenantId, loading: tenantLoading } = useActiveTenant();

  if (tenantLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Menghubungkan ke workspace...</p>
      </div>
    );
  }

  if (!activeTenantId) {
    return (
      <Card className="max-w-md mx-auto p-6 text-center border-dashed">
        <Building2 className="w-12 h-12 text-primary mx-auto mb-4 opacity-70" />
        <h2 className="text-lg font-bold mb-2">Harap Buat Workspace Terlebih Dahulu</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Anda perlu memiliki setidaknya satu workspace bisnis aktif untuk membuat website.
        </p>
        <Button onClick={() => router.push("/dashboard/sites")} className="rounded-xl">
          Kembali ke Dashboard
        </Button>
      </Card>
    );
  }

  return (
    <div className="py-4 text-white">
      <SiteWizard
        mode="dashboard"
        token={token}
        activeTenantId={activeTenantId}
      />
    </div>
  );
}
