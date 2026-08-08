"use client";

import { useEffect, useState } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import {
  fetchAllCommissions,
  getCommissionConfig,
  updateCommissionConfig,
  Commission,
  CommissionConfig,
} from "@/lib/api/commissions";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { DollarSign, Loader2, ChevronLeft, ChevronRight, ShieldAlert, Users, Settings, Percent } from "lucide-react";

export default function AdminCommissionsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { hasPermission, role, loading: permLoading } = usePermissions();

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Commission config state
  const [config, setConfig] = useState<CommissionConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [rateInput, setRateInput] = useState("");
  const isSuperAdmin = role === "superadmin";

  const canReadAll = hasPermission("commission:read_all") || role === "superadmin" || role === "admin";

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetchAllCommissions(token, params);
      setCommissions(res.data || []);
      setTotal((res.meta?.total as number) || 0);
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat semua komisi", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    if (!token) return;
    try {
      const res = await getCommissionConfig(token);
      setConfig(res.data);
      setRateInput(res.data.rate_percent.toFixed(0));
    } catch {
      // ignore — config panel will show default
    }
  };

  const handleSaveConfig = async () => {
    if (!token) return;
    const pct = parseFloat(rateInput);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      pushToast("Persentase harus antara 0 dan 100", "error");
      return;
    }
    try {
      setConfigLoading(true);
      const res = await updateCommissionConfig(token, pct);
      setConfig(res.data);
      setRateInput(res.data.rate_percent.toFixed(0));
      pushToast(`Komisi berhasil diperbarui menjadi ${res.data.rate_percent.toFixed(0)}%`, "success");
    } catch (err: any) {
      pushToast(err.message || "Gagal memperbarui komisi", "error");
    } finally {
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    if (token && canReadAll) {
      loadData();
      loadConfig();
    }
  }, [token, page, canReadAll]);

  if (permLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat data komisi admin...</p>
      </div>
    );
  }

  if (!canReadAll) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4 text-center">
        <ShieldAlert className="size-12 text-destructive/60" />
        <h2 className="text-xl font-bold">Akses Dibatasi</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Halaman ini khusus untuk Admin yang memiliki akses permission `commission:read_all`.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit) || 1;
  const totalCommissionAmount = commissions.reduce((sum, c) => sum + (c.status === "pending" ? c.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <DollarSign className="size-5 text-emerald-500" />
            Manajemen Semua Komisi (Admin)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daftar komisi sales partner di seluruh platform.
          </p>
        </div>
      </div>

      {/* ── Commission Rate Settings ─────────────────────────────────────── */}
      <Card className={`border-border/40 shadow-sm ${!isSuperAdmin ? "opacity-70" : ""}`}>
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Settings className="size-4 text-primary/70" />
            Pengaturan Persentase Komisi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Rate Komisi Saat Ini
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl border border-input bg-muted/40 px-4 h-10 text-2xl font-bold text-emerald-600 dark:text-emerald-400 min-w-[80px]">
                  {config ? `${config.rate_percent.toFixed(0)}%` : `${(0.20 * 100).toFixed(0)}%`}
                </div>
                <span className="text-xs text-muted-foreground">dari setiap pembayaran tenant</span>
              </div>
            </div>

            {isSuperAdmin ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="commission-rate-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Ubah Rate (%)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      id="commission-rate-input"
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={rateInput}
                      onChange={(e) => setRateInput(e.target.value.replace(/^0+(?=\d)/, ""))}
                      className="h-10 w-28 rounded-xl border border-input bg-background px-3 pr-7 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      placeholder="20"
                    />
                    <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                  <Button
                    onClick={handleSaveConfig}
                    disabled={configLoading}
                    className="h-10 gap-2"
                    size="sm"
                  >
                    {configLoading && <Loader2 className="size-3.5 animate-spin" />}
                    Simpan
                  </Button>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mt-1 max-w-sm">
                  ⚠️ Perubahan rate hanya berlaku untuk transaksi <strong>baru</strong>. Komisi yang sudah tercatat tetap menggunakan rate saat transaksi terjadi.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                Hanya <span className="font-semibold text-primary">Superadmin</span> yang dapat mengubah persentase komisi.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Commission List ──────────────────────────────────────────────── */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold tracking-tight">
            Semua Transaksi Komisi ({total})
          </CardTitle>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            Pending di Halaman Ini: Rp {totalCommissionAmount.toLocaleString("id-ID")}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {commissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <DollarSign className="size-10 opacity-30" />
              <p className="text-sm">Belum ada komisi tercatat di sistem</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Sales User ID</th>
                    <th className="px-6 py-4">Tenant ID</th>
                    <th className="px-6 py-4">Order ID</th>
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
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold bg-muted/50 px-2.5 py-1 rounded-md">
                          <Users className="size-3 text-muted-foreground" />
                          User #{c.sales_user_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        Tenant #{c.tenant_id}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold">
                        {c.order_id}
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
