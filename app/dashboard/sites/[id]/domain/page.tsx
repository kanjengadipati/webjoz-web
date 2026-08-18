"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import {
  Loader2, Save, Globe, Copy, Check, ChevronRight,
  AlertCircle, CheckCircle2, Info, ExternalLink,
} from "lucide-react";
import { SiteSubNav } from "@/components/site-sub-nav";
import { useI18n } from "@/lib/i18n/context";

const CNAME_TARGET = "webjoz.com";

export default function CustomDomainPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId } = useActiveTenant();
  const { pushToast } = useToast();
  const { t } = useI18n();

  const siteId = Number(id);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };

  const [customDomain, setCustomDomain] = useState("");
  const [savedDomain, setSavedDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    if (!token || !activeTenantId) return;
    (async () => {
      try {
        const res = await request<any>(`/sites/${siteId}`, { headers: tenantHeaders }, token);
        const site = res.data;
        setSubdomain(site?.subdomain ?? "");
        const domain = site?.custom_domain ?? "";
        setCustomDomain(domain);
        setSavedDomain(domain);
      } catch (err: any) {
        pushToast(err.message || "Gagal memuat data domain", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [siteId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await request(`/sites/${siteId}`, {
        method: "PATCH",
        headers: tenantHeaders,
        body: JSON.stringify({ custom_domain: customDomain.trim().toLowerCase() }),
      }, token);
      setSavedDomain(customDomain.trim().toLowerCase());
      pushToast("Custom domain berhasil disimpan!", "success");
    } catch (err: any) {
      pushToast(err.message || "Gagal menyimpan domain", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValid = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(customDomain.trim());
  const hasChange = customDomain.trim().toLowerCase() !== savedDomain;

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

      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Custom Domain
        </h2>
        <p className="text-sm text-muted-foreground">
          Hubungkan domain pribadi Anda (mis. <span className="font-mono text-foreground/80">toko.namadomain.com</span>) ke website ini.
        </p>
      </div>

      {/* Step 1 — Input Domain */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center">1</span>
            Masukkan Domain Anda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="contoh: toko.namadomain.com"
              value={customDomain}
              onChange={e => setCustomDomain(e.target.value.toLowerCase())}
              className="font-mono text-sm"
            />
            <Button
              onClick={handleSave}
              disabled={saving || !isValid || !hasChange}
              className="shrink-0"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan
            </Button>
          </div>
          {customDomain && !isValid && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Format domain tidak valid
            </p>
          )}
          {savedDomain && (
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Domain tersimpan: <span className="font-mono">{savedDomain}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Step 2 — DNS Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center">2</span>
            Konfigurasi DNS di Registrar Domain Anda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Login ke panel DNS registrar Anda (Niagahoster, Rumahweb, Cloudflare, GoDaddy, dll) dan tambahkan record berikut:
          </p>

          {/* DNS Table */}
          <div className="rounded-xl overflow-hidden border border-white/[0.08]">
            <div className="grid grid-cols-3 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Tipe</span>
              <span>Name / Host</span>
              <span>Value / Target</span>
            </div>
            <div className="grid grid-cols-3 px-4 py-3.5 border-t border-white/[0.05] items-center gap-2">
              <span className="text-sm font-mono font-bold text-primary">CNAME</span>
              <span className="text-sm font-mono text-foreground/80">
                {savedDomain ? savedDomain.split(".")[0] : "subdomain-anda"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-foreground/80 truncate">{CNAME_TARGET}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(CNAME_TARGET)}
                  className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-all shrink-0"
                  title="Salin"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-blue-500/[0.08] border border-blue-500/20 rounded-xl p-3.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300/90 leading-relaxed">
              Perubahan DNS biasanya membutuhkan waktu <strong>5–30 menit</strong>, tapi bisa sampai 48 jam tergantung TTL registrar Anda.
              Setelah tersambung, website Anda akan dapat diakses lewat domain kustom tersebut.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 3 — Verify */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center">3</span>
            Cek & Verifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {savedDomain ? (
            <>
              <p className="text-sm text-muted-foreground">
                Setelah DNS tersebar, cek apakah domain sudah aktif:
              </p>
              <a
                href={`https://${savedDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono text-primary hover:underline"
              >
                https://{savedDomain}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Simpan domain Anda terlebih dahulu di langkah 1, lalu atur DNS sesuai langkah 2.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
