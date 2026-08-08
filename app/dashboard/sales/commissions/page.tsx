"use client";

import { useEffect, useState } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { fetchMyCommissions, Commission, CommissionSummary } from "@/lib/api/commissions";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { DollarSign, Clock, AlertCircle, Loader2, ArrowLeft, ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function MyCommissionsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { hasPermission, role, loading: permLoading } = usePermissions();

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary>({ total_earned: 0, total_pending: 0, total_voided: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const canReadOwn = hasPermission("commission:read_own") || role === "superadmin" || role === "admin" || role === "sales";

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetchMyCommissions(token, params);
      setCommissions(res.data?.commissions || []);
      setSummary(res.data?.summary || { total_earned: 0, total_pending: 0, total_voided: 0 });
      setTotal((res.meta?.total as number) || 0);
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat data komisi", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && canReadOwn) {
      loadData();
    }
  }, [token, page, canReadOwn]);

  if (permLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat data komisi...</p>
      </div>
    );
  }

  if (!canReadOwn) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4 text-center">
        <ShieldAlert className="size-12 text-destructive/60" />
        <h2 className="text-xl font-bold">Akses Dibatasi</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Anda belum memiliki akses ke halaman komisi. Hubungi admin untuk mengaktifkan akses sales.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/sales" className="p-2 rounded-xl hover:bg-muted/50 transition">
          <ArrowLeft className="size-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="size-6 text-emerald-500" />
            Dashboard Komisi Saya
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan komisi penjualan dari tenant referensi Anda.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/40 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Total Komisi
              <DollarSign className="size-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              Rp {summary.total_earned.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Total akumulasi komisi</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Pending Payout
              <Clock className="size-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              Rp {summary.total_pending.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Menunggu proses pencairan</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Dibatalkan (Voided)
              <AlertCircle className="size-4 text-destructive/60" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              Rp {summary.total_voided.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Transaksi dibatalkan / refund</p>
          </CardContent>
        </Card>
      </div>

      {/* Commissions Table */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-lg font-bold tracking-tight">
            Riwayat Komisi ({total})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {commissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <DollarSign className="size-10 opacity-30" />
              <p className="text-sm">Belum ada komisi tercatat.</p>
              <p className="text-xs opacity-75">Bagikan kode referral Anda untuk mulai mendapatkan komisi.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4 text-center">Tenant ID</th>
                    <th className="px-6 py-4 text-right">Gross Amount</th>
                    <th className="px-6 py-4 text-center">Rate</th>
                    <th className="px-6 py-4 text-right">Komisi</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold">
                        {c.order_id}
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-muted-foreground">
                        #{c.tenant_id}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        Rp {c.gross_amount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center text-xs">
                        {(c.rate * 100).toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        Rp {c.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          c.status === "pending"
                            ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                            : "border-destructive/30 text-destructive bg-destructive/10"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/20">
              <span className="text-xs text-muted-foreground">
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="size-4" />
                  Sebelumnya
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-1"
                >
                  Selanjutnya
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
