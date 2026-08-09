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
import {
  fetchAllBonuses,
  fetchBonusRules,
  updateBonusRule,
  SalesBonus,
  BonusRule,
} from "@/lib/api/bonuses";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import {
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Users,
  Settings,
  Percent,
  Award,
  Gift,
  Target,
  Save,
} from "lucide-react";

export default function AdminCommissionsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { hasPermission, role, loading: permLoading } = usePermissions();

  const [activeTab, setActiveTab] = useState<"commissions" | "bonuses">("commissions");

  // Commissions state
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Bonuses state
  const [bonuses, setBonuses] = useState<SalesBonus[]>([]);
  const [bonusPage, setBonusPage] = useState(1);
  const [bonusTotal, setBonusTotal] = useState(0);

  // Commission config state
  const [config, setConfig] = useState<CommissionConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [tier1RateInput, setTier1RateInput] = useState("");
  const [tier2RateInput, setTier2RateInput] = useState("");

  // Bonus rules state
  const [bonusRules, setBonusRules] = useState<BonusRule[]>([]);
  const [savingRuleId, setSavingRuleId] = useState<number | null>(null);
  const [editedAmounts, setEditedAmounts] = useState<Record<number, string>>({});

  const limit = 10;
  const isSuperAdmin = role === "superadmin";
  const canReadAll = hasPermission("commission:read_all") || role === "superadmin" || role === "admin";

  const loadCommissions = async () => {
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

  const loadBonuses = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams({
        page: bonusPage.toString(),
        limit: limit.toString(),
      });
      const res = await fetchAllBonuses(token, params);
      setBonuses(res.data || []);
      setBonusTotal((res.meta?.total as number) || 0);
    } catch {
      // ignore
    }
  };

  const loadConfig = async () => {
    if (!token) return;
    try {
      const res = await getCommissionConfig(token);
      setConfig(res.data);
      setTier1RateInput(res.data.tier1_rate_percent.toFixed(0));
      setTier2RateInput(res.data.tier2_rate_percent.toFixed(0));
    } catch {
      // ignore
    }
  };

  const loadRules = async () => {
    if (!token) return;
    try {
      const res = await fetchBonusRules(token);
      setBonusRules(res.data || []);
      const initialMap: Record<number, string> = {};
      (res.data || []).forEach((r) => {
        initialMap[r.id] = r.amount.toString();
      });
      setEditedAmounts(initialMap);
    } catch {
      // ignore
    }
  };

  const handleSaveConfig = async () => {
    if (!token) return;
    const t1 = parseFloat(tier1RateInput);
    const t2 = parseFloat(tier2RateInput);
    if (isNaN(t1) || t1 < 0 || t1 > 100) {
      pushToast("Persentase Tier 1 harus antara 0 dan 100", "error");
      return;
    }
    if (isNaN(t2) || t2 < 0 || t2 > 100) {
      pushToast("Persentase Tier 2 harus antara 0 dan 100", "error");
      return;
    }
    try {
      setConfigLoading(true);
      const res = await updateCommissionConfig(token, t1, t2, config?.tier_threshold_months);
      setConfig(res.data);
      setTier1RateInput(res.data.tier1_rate_percent.toFixed(0));
      setTier2RateInput(res.data.tier2_rate_percent.toFixed(0));
      pushToast(
        `Komisi berhasil diperbarui: Tier 1 ${res.data.tier1_rate_percent.toFixed(0)}% · Tier 2 ${res.data.tier2_rate_percent.toFixed(0)}%`,
        "success",
      );
    } catch (err: any) {
      pushToast(err.message || "Gagal memperbarui komisi", "error");
    } finally {
      setConfigLoading(false);
    }
  };

  const handleSaveRuleAmount = async (ruleId: number) => {
    if (!token) return;
    const val = parseFloat(editedAmounts[ruleId]);
    if (isNaN(val) || val <= 0) {
      pushToast("Nominal bonus harus berupa angka positif", "error");
      return;
    }
    try {
      setSavingRuleId(ruleId);
      await updateBonusRule(token, ruleId, { amount: val });
      pushToast("Aturan bonus berhasil diperbarui", "success");
      loadRules();
    } catch (err: any) {
      pushToast(err.message || "Gagal memperbarui aturan bonus", "error");
    } finally {
      setSavingRuleId(null);
    }
  };

  useEffect(() => {
    if (token && canReadAll) {
      loadCommissions();
      loadBonuses();
      loadConfig();
      loadRules();
    }
  }, [token, page, bonusPage, canReadAll]);

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
  const totalBonusPages = Math.ceil(bonusTotal / limit) || 1;
  const totalCommissionAmount = commissions.reduce((sum, c) => sum + (c.status === "pending" ? c.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <DollarSign className="size-5 text-emerald-500" />
            Manajemen Komisi & Bonus Sales (Admin)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pengaturan persentase komisi, skema bonus onboarding & milestone, dan seluruh transaksi sales partner.
          </p>
        </div>
      </div>

      {/* ── Commission Rate Settings ─────────────────────────────────────── */}
      <Card className="border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/20 pb-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Settings className="size-4 text-emerald-500" />
              Pengaturan Rate Komisi Sales
            </CardTitle>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background px-3 py-1 rounded-full border border-border/50">
              <span>Skema Aktif:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Tier 1 {config ? `${config.tier1_rate_percent.toFixed(0)}%` : "20%"} · Tier 2{" "}
                {config ? `${config.tier2_rate_percent.toFixed(0)}%` : "10%"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Skema Komisi Bertingkat
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {config ? `${config.tier1_rate_percent.toFixed(0)}%` : "20%"}
                </span>
                <span className="text-xs text-muted-foreground">
                  tier 1 selama {config?.tier_threshold_months ?? 12} bulan pertama
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-500/80 tracking-tight">
                  {config ? `${config.tier2_rate_percent.toFixed(0)}%` : "10%"}
                </span>
                <span className="text-xs text-muted-foreground">
                  tier 2 setelahnya (berlaku seterusnya)
                </span>
              </div>
            </div>

            {isSuperAdmin ? (
              <div className="space-y-3 md:text-right">
                <div className="flex flex-col gap-2">
                  <div className="space-y-1">
                    <label htmlFor="commission-tier1-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Tier 1 — {config?.tier_threshold_months ?? 12} bulan pertama (%)
                    </label>
                    <div className="flex items-center gap-2 md:justify-end">
                      <div className="relative">
                        <input
                          id="commission-tier1-input"
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={tier1RateInput}
                          onChange={(e) => setTier1RateInput(e.target.value.replace(/^0+(?=\d)/, ""))}
                          className="h-10 w-28 rounded-xl border border-input bg-background pl-3 pr-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                          placeholder="20"
                        />
                        <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="commission-tier2-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Tier 2 — setelahnya (%)
                    </label>
                    <div className="flex items-center gap-2 md:justify-end">
                      <div className="relative">
                        <input
                          id="commission-tier2-input"
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={tier2RateInput}
                          onChange={(e) => setTier2RateInput(e.target.value.replace(/^0+(?=\d)/, ""))}
                          className="h-10 w-28 rounded-xl border border-input bg-background pl-3 pr-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                          placeholder="10"
                        />
                        <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveConfig}
                    disabled={configLoading}
                    className="h-10 px-4 font-semibold gap-2"
                    size="sm"
                  >
                    {configLoading && <Loader2 className="size-3.5 animate-spin" />}
                    Simpan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground bg-muted/40 rounded-xl p-3 border border-border/30">
                Hanya <span className="font-semibold text-foreground">Superadmin</span> yang dapat mengedit skema komisi.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Bonus Rules Administration ────────────────────────────────────── */}
      <Card className="border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/20 pb-4 bg-muted/20">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Award className="size-4 text-amber-500" />
            Pengaturan Aturan Bonus (Onboarding & Milestone)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bonusRules.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-border/60 bg-card p-4 flex flex-col justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold capitalize px-2 py-0.5 rounded-md bg-muted">
                      {rule.type === "onboarding" ? (
                        <Gift className="size-3 text-emerald-500" />
                      ) : (
                        <Target className="size-3 text-amber-500" />
                      )}
                      {rule.type}
                    </span>
                    {rule.tier && (
                      <span className="text-[11px] font-bold font-mono text-muted-foreground">
                        Tier {rule.tier}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {rule.type === "onboarding" ? (
                      "Bonus flat per tenant baru pertama kali bayar."
                    ) : (
                      `Capai ${rule.threshold} tenant baru teraktivasi dalam 1 bulan.`
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                    Nominal Bonus (Rp)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      disabled={!isSuperAdmin}
                      value={editedAmounts[rule.id] ?? rule.amount.toString()}
                      onChange={(e) =>
                        setEditedAmounts({
                          ...editedAmounts,
                          [rule.id]: e.target.value.replace(/^0+(?=\d)/, ""),
                        })
                      }
                      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition disabled:opacity-60"
                    />
                    {isSuperAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={savingRuleId === rule.id}
                        onClick={() => handleSaveRuleAmount(rule.id)}
                        className="h-9 px-2.5 shrink-0"
                      >
                        {savingRuleId === rule.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Save className="size-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Tabs: Commissions vs Bonuses ─────────────────────────────────── */}
      <div className="flex border-b border-border/40 gap-2">
        <button
          onClick={() => setActiveTab("commissions")}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "commissions"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <DollarSign className="size-4" />
          Komisi Recurring ({total})
        </button>
        <button
          onClick={() => setActiveTab("bonuses")}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "bonuses"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="size-4" />
          Semua Bonus Sales ({bonusTotal})
        </button>
      </div>

      {/* ── Commission List Table ────────────────────────────────────────── */}
      {activeTab === "commissions" && (
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
                          <span className="inline-flex flex-col items-center leading-tight">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">Tier {c.tier}</span>
                            <span className="text-[11px] text-muted-foreground">{(c.rate * 100).toFixed(0)}%</span>
                          </span>
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
      )}

      {/* ── Bonus List Table ─────────────────────────────────────────────── */}
      {activeTab === "bonuses" && (
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="border-b border-border/20 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold tracking-tight">
              Semua Bonus Sales ({bonusTotal})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {bonuses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Award className="size-10 opacity-30" />
                <p className="text-sm">Belum ada bonus tercatat di sistem</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Sales User ID</th>
                      <th className="px-6 py-4">Jenis Bonus</th>
                      <th className="px-6 py-4 text-center">Detail / Periode</th>
                      <th className="px-6 py-4 text-right">Nominal Bonus</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonuses.map((b) => (
                      <tr key={b.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                          {new Date(b.created_at).toLocaleDateString("id-ID", {
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
                            User #{b.sales_user_id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {b.type === "onboarding" ? (
                              <Gift className="size-4 text-emerald-500" />
                            ) : (
                              <Target className="size-4 text-amber-500" />
                            )}
                            <span className="font-semibold capitalize">{b.type} Bonus</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-xs font-mono text-muted-foreground">
                          {b.type === "onboarding"
                            ? `Tenant #${b.tenant_id}`
                            : `Periode ${b.period} (Tier ${b.tier})`}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-amber-600 dark:text-amber-400">
                          Rp {b.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                            b.status === "pending"
                              ? "border-amber-500/30 text-amber-600 bg-amber-500/10"
                              : b.status === "paid"
                              ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                              : "border-destructive/30 text-destructive bg-destructive/10"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalBonusPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/20">
                <span className="text-xs text-muted-foreground">
                  Halaman {bonusPage} dari {totalBonusPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={bonusPage <= 1}
                    onClick={() => setBonusPage((p) => p - 1)}
                    className="gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    Sebelumnya
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={bonusPage >= totalBonusPages}
                    onClick={() => setBonusPage((p) => p + 1)}
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
      )}
    </div>
  );
}
