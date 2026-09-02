"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { Loader2, Save, Code } from "lucide-react";
import { SiteSubNav } from "@/components/site-sub-nav";
import { useI18n } from "@/lib/i18n/context";
import { decodeSiteId } from "@/lib/sqids";

export default function IntegrationsPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId } = useActiveTenant();
  const { pushToast } = useToast();
  const { t } = useI18n();

  const siteId = decodeSiteId(id as string);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };
  const [ga4Id, setGa4Id] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token || !activeTenantId) return;
    (async () => {
      try {
        const res = await request<{ content?: { tracking_codes?: Record<string, string> } }>(`/sites/${siteId}/content`, { headers: tenantHeaders }, token);
        const codes = (res.data as any)?.tracking_codes || res.data?.content?.tracking_codes || {};
        setGa4Id((codes as any).ga4_id || "");
        setMetaPixelId((codes as any).meta_pixel_id || "");
      } catch (err: any) {
        pushToast(err.message || t("dashboard.sitesIntegrations.loadFailed"), "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [siteId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await request(`/sites/${siteId}/tracking-codes`, {
        method: "PATCH",
        headers: tenantHeaders,
        body: JSON.stringify({
          tracking_codes: {
            ga4_id: ga4Id,
            meta_pixel_id: metaPixelId,
          },
        }),
      }, token);
      pushToast(t("dashboard.sitesIntegrations.saved"), "success");
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sitesIntegrations.saveFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <SiteSubNav siteId={siteId} />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Google Analytics 4
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="G-XXXXXXXXXX"
            value={ga4Id}
            onChange={e => setGa4Id(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t("dashboard.sitesIntegrations.ga4Desc")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Meta Pixel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="1234567890123456"
            value={metaPixelId}
            onChange={e => setMetaPixelId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t("dashboard.sitesIntegrations.metaPixelDesc")}
          </p>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {t("dashboard.sitesIntegrations.save")}
      </Button>
    </div>
  );
}
