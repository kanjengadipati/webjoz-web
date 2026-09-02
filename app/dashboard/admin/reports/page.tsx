"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2, TrendingUp, TrendingDown, DollarSign, CreditCard, RefreshCw, Users, BarChart2, ArrowUpRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { request } from "@/lib/api/client";
import { useAuthToken } from "@/lib/auth-store";
import { useToast } from "@/components/toast-provider";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ReportSummary {
  total_revenue_idr: number;
  total_revenue_usd: number;
  total_transactions: number;
  successful_transactions: number;
  refunded_transactions: number;
  pending_transactions: number;
  mrr_idr: number;
  mrr_growth_pct: number;
  month_transactions: number;
  month_revenue_idr: number;
  today_revenue_idr: number;
  today_transactions: number;
  arpu_idr: number;
  avg_tx_value_idr: number;
}

interface DailyRevenue {
  date: string;
  revenue_idr: number;
  revenue_usd: number;
  tx_count: number;
}

interface MonthlyRevenue {
  month: string;
  revenue_idr: number;
  revenue_usd: number;
  tx_count: number;
  new_paying_tenants: number;
}

interface GatewaySplit {
  gateway: string;
  revenue_idr: number;
  revenue_usd: number;
  tx_count: number;
  share_pct: number;
}

interface PlanSplit {
  plan_slug: string;
  revenue_idr: number;
  tx_count: number;
  share_pct: number;
}

interface TopTenant {
  tenant_id: number;
  tenant_name: string;
  plan: string;
  revenue_idr: number;
  tx_count: number;
}

interface StatusBreakdown {
  status: string;
  count: number;
}

interface RevenueReport {
  summary: ReportSummary;
  daily_last_30_days: DailyRevenue[];
  monthly_last_12_months: MonthlyRevenue[];
  gateway_split: GatewaySplit[];
  plan_split: PlanSplit[];
  top_tenants: TopTenant[];
  status_breakdown: StatusBreakdown[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtIDR(n: number) {
  if (n >= 1_000_000_000) return "Rp " + (n / 1_000_000_000).toFixed(1) + "M";
  if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(1) + "jt";
  if (n >= 1_000) return "Rp " + (n / 1_000).toFixed(0) + "rb";
  return "Rp " + n.toLocaleString("id-ID");
}

function fmtIDRFull(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function fmtDate(iso: string) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  } catch { return iso; }
}

function fmtMonth(ym: string) {
  try {
    const d = new Date(ym + "-01T00:00:00");
    return d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
  } catch { return ym; }
}

const STATUS_COLOR: Record<string, string> = {
  settlement: "#10b981",
  success:    "#10b981",
  pending:    "#f59e0b",
  failed:     "#ef4444",
  expired:    "#f97316",
  refund:     "#3b82f6",
  deny:       "#ef4444",
  cancel:     "#6b7280",
};

const PLAN_COLOR: Record<string, string> = {
  free:       "#6b7280",
  pro:        "#8b5cf6",
  enterprise: "#f59e0b",
  domain:     "#3b82f6",
};

// ── Primitive chart components ────────────────────────────────────────────────

/**
 * BarChart — SVG bar chart, no external deps.
 * bars: array of { label, value, tooltip? }
 * color: tailwind-compatible hex or CSS color
 */
function BarChart({
  bars,
  color = "#8b5cf6",
  height = 120,
  showLabels = false,
}: {
  bars: { label: string; value: number; tooltip?: string }[];
  color?: string;
  height?: number;
  showLabels?: boolean;
}) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${bars.length * 18} ${height + (showLabels ? 20 : 0)}`}
        className="w-full"
        style={{ height: height + (showLabels ? 24 : 0) }}
        preserveAspectRatio="none"
      >
        {bars.map((b, i) => {
          const barH = Math.max((b.value / max) * height * 0.9, b.value > 0 ? 2 : 0);
          const x = i * 18 + 2;
          const y = height - barH;
          const isHov = hovered === i;
          return (
            <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <rect
                x={x} y={y} width={14} height={barH}
                rx={2}
                fill={color}
                opacity={isHov ? 1 : 0.75}
                style={{ transition: "opacity 0.15s" }}
              />
              {isHov && (
                <foreignObject x={Math.min(x - 20, bars.length * 18 - 70)} y={Math.max(y - 28, 0)} width={72} height={24}>
                  <div className="bg-popover text-popover-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded shadow whitespace-nowrap border border-border/60">
                    {b.tooltip ?? fmtIDR(b.value)}
                  </div>
                </foreignObject>
              )}
              {showLabels && (
                <text x={x + 7} y={height + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">
                  {b.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** SparkLine — thin SVG line chart for trend display */
function SparkLine({
  values,
  color = "#8b5cf6",
  height = 40,
}: {
  values: number[];
  color?: string;
  height?: number;
}) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 100;
  const step = w / (values.length - 1);
  const pts = values
    .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

/** DonutSegment — single segment of a donut chart */
function DonutChart({ segments }: { segments: { label: string; pct: number; color: string }[] }) {
  const r = 36;
  const cx = 48;
  const cy = 48;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const [hov, setHov] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-6">
      <svg width={96} height={96} viewBox="0 0 96 96" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth={20} />
        {segments.map((seg, i) => {
          const dash = (seg.pct / 100) * circ;
          const gap = circ - dash;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={hov === i ? 22 : 18}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              style={{ transition: "stroke-width 0.15s", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            />
          );
          offset += dash;
          return el;
        })}
        {hov !== null && (
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#f9fafb">
            {segments[hov].pct.toFixed(0)}%
          </text>
        )}
      </svg>
      <div className="space-y-1.5 flex-1 min-w-0">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
            <span className="truncate text-muted-foreground">{s.label}</span>
            <span className="ml-auto font-semibold tabular-nums shrink-0">{s.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Summary card ──────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  trend,
  trendLabel,
  icon: Icon,
  accent = "violet",
  sparkValues,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ElementType;
  accent?: "violet" | "emerald" | "amber" | "sky" | "rose";
  sparkValues?: number[];
}) {
  const accentMap = {
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", spark: "#8b5cf6" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", spark: "#10b981" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", spark: "#f59e0b" },
    sky: { bg: "bg-sky-500/10", text: "text-sky-400", spark: "#3b82f6" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400", spark: "#f43f5e" },
  };
  const a = accentMap[accent];
  const trendUp = (trend ?? 0) >= 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 flex flex-col gap-3 hover:border-border transition-colors">
      <div className="flex items-center justify-between">
        <div className={cn("size-9 rounded-xl flex items-center justify-center", a.bg)}>
          <Icon className={cn("size-4", a.text)} />
        </div>
        {trend !== undefined && (
          <div className={cn("flex items-center gap-1 text-xs font-semibold",
            trendUp ? "text-emerald-400" : "text-rose-400")}>
            {trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-0.5 tabular-nums">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        {trendLabel && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{trendLabel}</p>
        )}
      </div>
      {sparkValues && sparkValues.length > 1 && (
        <SparkLine values={sparkValues} color={a.spark} height={32} />
      )}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-4">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminReportsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const [report, setReport] = useState<RevenueReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchReport = useCallback(async (isRefresh = false) => {
    if (!token) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await request<RevenueReport>("/payments/admin/report", {}, token);
      setReport(res.data);
      setLastUpdated(new Date());
    } catch (e: any) {
      pushToast(e.message ?? "Gagal memuat laporan", "error");
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  // Derived chart data
  const dailyBars = useMemo(() =>
    (report?.daily_last_30_days ?? []).map((d) => ({
      label: fmtDate(d.date),
      value: d.revenue_idr,
      tooltip: fmtIDRFull(d.revenue_idr) + " · " + d.tx_count + " tx",
    })), [report]);

  const monthlyBars = useMemo(() =>
    (report?.monthly_last_12_months ?? []).map((m) => ({
      label: fmtMonth(m.month),
      value: m.revenue_idr,
      tooltip: fmtIDRFull(m.revenue_idr) + " · " + m.tx_count + " tx",
    })), [report]);

  const sparkDaily = useMemo(() =>
    (report?.daily_last_30_days ?? []).map((d) => d.revenue_idr), [report]);

  const gatewaySegments = useMemo(() =>
    (report?.gateway_split ?? []).map((g) => ({
      label: g.gateway + " · " + fmtIDR(g.revenue_idr),
      pct: g.share_pct,
      color: g.gateway === "midtrans" ? "#8b5cf6" : "#3b82f6",
    })), [report]);

  const planSegments = useMemo(() =>
    (report?.plan_split ?? []).map((p) => ({
      label: p.plan_slug + " · " + fmtIDR(p.revenue_idr),
      pct: p.share_pct,
      color: PLAN_COLOR[p.plan_slug] ?? "#6b7280",
    })), [report]);

  const statusTotal = useMemo(() =>
    (report?.status_breakdown ?? []).reduce((s, x) => s + x.count, 0) || 1, [report]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 gap-2 text-muted-foreground text-sm">
        <Loader2 className="size-4 animate-spin" /> Memuat laporan...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-80 gap-2 text-muted-foreground text-sm">
        <AlertCircle className="size-4" /> Data laporan tidak tersedia.
      </div>
    );
  }

  const s = report.summary;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue Report</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString("id-ID")}` : ""}
          </p>
        </div>
        <button
          onClick={() => fetchReport(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-card/60 text-sm font-semibold hover:bg-muted transition disabled:opacity-50"
        >
          <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Summary cards — row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="MRR (Bulan Ini)"
          value={fmtIDR(s.mrr_idr)}
          trend={s.mrr_growth_pct}
          trendLabel="vs bulan lalu"
          icon={TrendingUp}
          accent="violet"
          sparkValues={sparkDaily}
        />
        <StatCard
          label="Total Revenue"
          value={fmtIDR(s.total_revenue_idr)}
          sub={s.total_revenue_usd > 0 ? `+ $${s.total_revenue_usd.toFixed(0)} USD` : undefined}
          icon={DollarSign}
          accent="emerald"
        />
        <StatCard
          label="Hari Ini"
          value={fmtIDR(s.today_revenue_idr)}
          sub={`${s.today_transactions} transaksi`}
          icon={ArrowUpRight}
          accent="sky"
        />
        <StatCard
          label="ARPU (Bulan Ini)"
          value={fmtIDR(s.arpu_idr)}
          sub={`Avg Tx: ${fmtIDR(s.avg_tx_value_idr)}`}
          icon={Users}
          accent="amber"
        />
      </div>

      {/* Summary cards — row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Transaksi", value: s.total_transactions.toLocaleString(), icon: CreditCard, accent: "violet" as const },
          { label: "Berhasil", value: s.successful_transactions.toLocaleString(), icon: TrendingUp, accent: "emerald" as const },
          { label: "Pending", value: s.pending_transactions.toLocaleString(), icon: BarChart2, accent: "amber" as const },
          { label: "Refund", value: s.refunded_transactions.toLocaleString(), icon: TrendingDown, accent: "rose" as const },
        ].map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} accent={c.accent} />
        ))}
      </div>

      {/* Daily revenue chart */}
      <Section title="Pendapatan Harian — 30 Hari Terakhir">
        {dailyBars.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Belum ada data.</p>
        ) : (
          <>
            <BarChart bars={dailyBars} color="#8b5cf6" height={120} showLabels={false} />
            {/* x-axis labels — show only first, mid, last */}
            <div className="flex justify-between text-[10px] text-muted-foreground px-0.5 mt-1">
              <span>{dailyBars[0]?.label}</span>
              <span>{dailyBars[Math.floor(dailyBars.length / 2)]?.label}</span>
              <span>{dailyBars[dailyBars.length - 1]?.label}</span>
            </div>
          </>
        )}
      </Section>

      {/* Monthly revenue chart */}
      <Section title="Pendapatan Bulanan — 12 Bulan Terakhir">
        {monthlyBars.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Belum ada data.</p>
        ) : (
          <div className="space-y-2">
            <BarChart bars={monthlyBars} color="#10b981" height={140} showLabels={true} />
            {/* Monthly table underneath */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    {["Bulan", "Revenue IDR", "Revenue USD", "Transaksi", "Tenant Baru"].map((h) => (
                      <th key={h} className="text-left px-3 py-2 text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...report.monthly_last_12_months].reverse().map((m) => (
                    <tr key={m.month} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-3 py-2 font-medium">{m.month}</td>
                      <td className="px-3 py-2 tabular-nums font-semibold">{fmtIDRFull(m.revenue_idr)}</td>
                      <td className="px-3 py-2 tabular-nums text-muted-foreground">
                        {m.revenue_usd > 0 ? "$" + m.revenue_usd.toFixed(2) : "—"}
                      </td>
                      <td className="px-3 py-2 tabular-nums">{m.tx_count}</td>
                      <td className="px-3 py-2 tabular-nums">{m.new_paying_tenants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>

      {/* Split row: gateway + plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Gateway Split">
          {gatewaySegments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Belum ada data.</p>
          ) : (
            <DonutChart segments={gatewaySegments} />
          )}
          {report.gateway_split.length > 0 && (
            <div className="space-y-2 mt-2">
              {report.gateway_split.map((g) => (
                <div key={g.gateway} className="flex items-center justify-between text-xs">
                  <span className="capitalize font-medium">{g.gateway}</span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{g.tx_count} tx</span>
                    <span className="font-semibold text-foreground tabular-nums">{fmtIDRFull(g.revenue_idr)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Revenue per Plan">
          {planSegments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Belum ada data.</p>
          ) : (
            <DonutChart segments={planSegments} />
          )}
          {report.plan_split.length > 0 && (
            <div className="space-y-2 mt-2">
              {report.plan_split.map((p) => (
                <div key={p.plan_slug} className="flex items-center justify-between text-xs">
                  <span className="capitalize font-medium">{p.plan_slug}</span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{p.tx_count} tx</span>
                    <span className="font-semibold text-foreground tabular-nums">{fmtIDRFull(p.revenue_idr)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Status breakdown */}
      <Section title="Status Breakdown (All-Time)">
        <div className="space-y-2">
          {report.status_breakdown.map((s) => {
            const pct = (s.count / statusTotal) * 100;
            return (
              <div key={s.status} className="flex items-center gap-3 text-sm">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ background: STATUS_COLOR[s.status] ?? "#6b7280" }}
                />
                <span className="capitalize w-24 shrink-0 text-muted-foreground">{s.status}</span>
                <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: STATUS_COLOR[s.status] ?? "#6b7280" }}
                  />
                </div>
                <span className="tabular-nums text-xs text-muted-foreground w-16 text-right shrink-0">
                  {s.count.toLocaleString()} ({pct.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Top tenants */}
      <Section title="Top 10 Tenant by Revenue">
        {report.top_tenants.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Belum ada data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  {["#", "Tenant", "Plan", "Revenue IDR", "Transaksi"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.top_tenants.map((t, i) => {
                  const maxRev = report.top_tenants[0].revenue_idr || 1;
                  const barW = (t.revenue_idr / maxRev) * 100;
                  return (
                    <tr key={t.tenant_id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-3 py-2.5 text-muted-foreground font-mono text-xs">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium truncate max-w-[160px]">{t.tenant_name}</div>
                        <div className="text-[10px] text-muted-foreground">ID #{t.tenant_id}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                          style={{
                            background: (PLAN_COLOR[t.plan] ?? "#6b7280") + "25",
                            color: PLAN_COLOR[t.plan] ?? "#6b7280",
                          }}
                        >
                          {t.plan}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-semibold tabular-nums">{fmtIDRFull(t.revenue_idr)}</div>
                        <div className="mt-1 h-1.5 rounded-full bg-muted/30 w-32">
                          <div
                            className="h-full rounded-full bg-violet-500 transition-all duration-500"
                            style={{ width: `${barW}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{t.tx_count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

    </div>
  );
}
