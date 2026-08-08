"use client";

import { useEffect, useState } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { fetchMyReferralCode, regenerateMyReferralCode } from "@/lib/api/referral";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { Share2, Copy, RefreshCw, Loader2, Check, ShieldAlert, Award, DollarSign } from "lucide-react";
import Link from "next/link";

export default function SalesReferralPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { hasPermission, role, loading: permLoading } = usePermissions();

  const [referralCode, setReferralCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const canManage = hasPermission("sales:manage-referral") || role === "superadmin" || role === "admin" || role === "sales";

  const loadReferralCode = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetchMyReferralCode(token);
      setReferralCode(res.data?.referral_code || "");
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat kode referral", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && canManage) {
      loadReferralCode();
    }
  }, [token, canManage]);

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    pushToast("Kode referral berhasil disalin", "success");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareableUrl = typeof window !== "undefined" && referralCode
    ? `${window.location.origin}/create?ref=${referralCode}`
    : "";

  const handleCopyLink = () => {
    if (!shareableUrl) return;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    pushToast("Link referral berhasil disalin", "success");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!token) return;
    try {
      setRegenerating(true);
      const res = await regenerateMyReferralCode(token);
      setReferralCode(res.data?.referral_code || "");
      pushToast("Kode referral baru berhasil dibuat!", "success");
      setConfirmOpen(false);
    } catch (err: any) {
      pushToast(err.message || "Gagal membuat ulang kode referral", "error");
    } finally {
      setRegenerating(false);
    }
  };

  if (permLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat data referral...</p>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4 text-center">
        <ShieldAlert className="size-12 text-destructive/60" />
        <h2 className="text-xl font-bold">Akses Dibatasi</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Halaman ini khusus untuk Sales Partner & Admin Webjoz. Silakan hubungi admin jika Anda tim sales.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Share2 className="size-6 text-primary" />
            Kode Referral Partner
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bagikan kode atau link referral Anda kepada klien untuk mendapatkan komisi dari setiap transaksi berbayar.
          </p>
        </div>
        <Link href="/dashboard/sales/commissions">
          <Button variant="outline" className="gap-2">
            <DollarSign className="size-4 text-emerald-500" />
            Lihat Komisi Saya
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: Main Referral Code */}
        <Card className="border-border/40 bg-card shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Kode Referral Anda
            </CardTitle>
            <CardDescription>
              Gunakan kode ini saat pendaftaran website/tenant baru.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
              <span className="font-mono text-2xl font-bold tracking-wider text-primary">
                {referralCode || "—"}
              </span>
              <Button size="sm" variant="outline" onClick={handleCopyCode} className="gap-1.5 cursor-pointer">
                {copiedCode ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                {copiedCode ? "Tersalin" : "Salin Kode"}
              </Button>
            </div>

            <div className="pt-2 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground">
              <span>Ingin memperbarui kode?</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <RefreshCw className="size-3" />
                Buat Ulang Kode
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Shareable Link */}
        <Card className="border-border/40 bg-card shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Share2 className="size-5 text-primary" />
              Link Referral Pendaftaran
            </CardTitle>
            <CardDescription>
              Klien yang mendaftar melalui link ini akan otomatis terhubung ke akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-xl border border-border/40 bg-muted/30 text-xs font-mono break-all text-muted-foreground flex items-center justify-between gap-2">
              <span className="truncate">{shareableUrl}</span>
              <Button size="sm" variant="secondary" onClick={handleCopyLink} className="shrink-0 gap-1.5 cursor-pointer">
                {copiedLink ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                {copiedLink ? "Tersalin" : "Salin Link"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              💡 <strong>Tips:</strong> Cantumkan link ini di proposal, WhatsApp message, atau bio media sosial Anda.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Program Info Card */}
      <Card className="border-emerald-500/20 bg-emerald-500/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <DollarSign className="size-4" />
          Ketentuan Komisi Sales Partner
        </div>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
          <li>Komisi sebesar <strong>20%</strong> dari nilai transaksi berbayar yang diselesaikan oleh tenant referensi Anda.</li>
          <li>Komisi berlaku <strong>recurring</strong> untuk setiap perpanjangan langganan bulanan maupun tahunan.</li>
          <li>Setiap tenant yang mendaftar dengan kode Anda otomatis menambahkan Anda sebagai anggota role <em>Editor</em> di workspace tenant tersebut.</li>
        </ul>
      </Card>

      {/* Confirm Dialog for Regenerate */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Buat Ulang Kode Referral">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Apakah Anda yakin ingin membuat kode referral baru? Kode lama (<strong className="font-mono">{referralCode}</strong>) tidak akan berlaku lagi untuk pendaftaran baru.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleRegenerate} disabled={regenerating} className="gap-2">
              {regenerating && <Loader2 className="size-4 animate-spin" />}
              {regenerating ? "Memproses..." : "Ya, Buat Kode Baru"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
