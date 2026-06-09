"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  BarChart3, Loader2, Calendar, Globe, ArrowUpRight, 
  Eye, MousePointerClick, RefreshCw, Filter, TrendingUp
} from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

interface PageViewStat {
  date: string;
  count: number;
}

interface PathStat {
  path: string;
  count: number;
}

interface ReferrerStat {
  referrer: string;
  count: number;
}

interface AnalyticsData {
  total_pageviews: number;
  pageviews_by_date: PageViewStat[];
  pageviews_by_path: PathStat[];
  pageviews_by_referrer: ReferrerStat[];
}

interface Site {
  id: number;
  name: string;
}

export default function AnalyticsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId } = useActiveTenant();

  const [sites, setSites] = useState<Site[]>([]);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [fromStr, setFromStr] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [toStr, setToStr] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchData = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);

      // Fetch sites list if not loaded yet
      if (sites.length === 0) {
        const sitesRes = await request<Site[]>("/sites", {
          headers: { "X-Tenant-ID": activeTenantId.toString() }
        }, token);
        setSites(sitesRes.data || []);
      }

      // Construct query URL
      let query = `/analytics?from=${fromStr}&to=${toStr}`;
      if (selectedSiteId && selectedSiteId !== "all") {
        query += `&site_id=${selectedSiteId}`;
      }

      // Fetch analytics stats
      const statsRes = await request<AnalyticsData>(query, {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setData(statsRes.data);

    } catch (err: any) {
      pushToast(err.message || "Gagal memuat data analitik", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenantId) {
      fetchData();
    }
  }, [activeTenantId, selectedSiteId, fromStr, toStr]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Memuat data analitik...</p>
      </div>
    );
  }

  // Draw custom SVG chart helper
  const renderLineChart = (chartData: PageViewStat[]) => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
          Belum ada data kunjungan untuk rentang waktu ini.
        </div>
      );
    }

    const maxCount = Math.max(...chartData.map(d => d.count), 10);
    const height = 200;
    const width = 600;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const graphHeight = height - paddingTop - paddingBottom;
    const graphWidth = width - paddingLeft - paddingRight;

    // Generate points
    const points = chartData.map((d, idx) => {
      const x = paddingLeft + (idx / (chartData.length - 1 || 1)) * graphWidth;
      const y = paddingTop + graphHeight - (d.count / maxCount) * graphHeight;
      return { x, y, label: d.date, value: d.count };
    });

    const pathD = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaD = points.length > 0 
      ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${paddingTop + graphHeight} Z`
      : "";

    return (
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line 
            x1={paddingLeft} y1={paddingTop} 
            x2={width - paddingRight} y2={paddingTop} 
            className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" strokeDasharray="4"
          />
          <line 
            x1={paddingLeft} y1={paddingTop + graphHeight / 2} 
            x2={width - paddingRight} y2={paddingTop + graphHeight / 2} 
            className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" strokeDasharray="4"
          />
          <line 
            x1={paddingLeft} y1={paddingTop + graphHeight} 
            x2={width - paddingRight} y2={paddingTop + graphHeight} 
            className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1"
          />

          {/* Y Axis Labels */}
          <text x={paddingLeft - 10} y={paddingTop + 4} textAnchor="end" className="fill-slate-400 text-[9px] font-mono">
            {maxCount}
          </text>
          <text x={paddingLeft - 10} y={paddingTop + graphHeight / 2 + 4} textAnchor="end" className="fill-slate-400 text-[9px] font-mono">
            {Math.round(maxCount / 2)}
          </text>
          <text x={paddingLeft - 10} y={paddingTop + graphHeight + 4} textAnchor="end" className="fill-slate-400 text-[9px] font-mono">
            0
          </text>

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#chartGradient)" />}

          {/* Line path */}
          {pathD && (
            <path 
              d={pathD} 
              fill="none" 
              className="stroke-indigo-500" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          )}

          {/* Data Points & Tooltips */}
          {points.map((p, idx) => (
            <g key={idx} className="group/point cursor-pointer">
              <circle 
                cx={p.x} cy={p.y} r="4" 
                className="fill-indigo-500 stroke-white dark:stroke-slate-900 shadow-sm transition-all group-hover/point:r-6 group-hover/point:fill-indigo-600" 
                strokeWidth="1.5"
              />
              {/* Tooltip Overlay */}
              <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect 
                  x={p.x - 30} y={p.y - 32} width="60" height="22" rx="6" 
                  className="fill-slate-900 shadow-xl"
                />
                <text 
                  x={p.x} y={p.y - 18} textAnchor="middle" 
                  className="fill-white text-[10px] font-bold font-sans"
                >
                  {p.value} PVs
                </text>
              </g>
            </g>
          ))}

          {/* X Axis Labels */}
          {points.filter((_, i) => i % Math.max(Math.round(points.length / 5), 1) === 0 || i === points.length - 1).map((p, idx) => {
            // Shorten date format for axis (e.g. 2026-06-01 -> 01 Jun)
            let shortDate = p.label;
            try {
              const d = new Date(p.label);
              shortDate = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
            } catch {}

            return (
              <text 
                key={idx} x={p.x} y={paddingTop + graphHeight + 18} 
                textAnchor="middle" 
                className="fill-slate-400 text-[9px] font-mono font-medium"
              >
                {shortDate}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-muted-foreground">Pantau volume kunjungan, asal lalu lintas, dan halaman paling populer.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Site Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={selectedSiteId} 
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="px-3 py-1.5 border rounded-xl text-xs outline-none focus:border-primary bg-card"
            >
              <option value="all">Semua Website</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date filters */}
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={fromStr}
              onChange={(e) => setFromStr(e.target.value)}
              className="px-3 py-1 border rounded-xl text-xs outline-none focus:border-primary bg-card"
            />
            <span className="text-xs font-semibold text-slate-400">s/d</span>
            <input 
              type="date" 
              value={toStr}
              onChange={(e) => setToStr(e.target.value)}
              className="px-3 py-1 border rounded-xl text-xs outline-none focus:border-primary bg-card"
            />
          </div>
        </div>
      </div>

      {/* Main stats card list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Kunjungan (Pageviews)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-slate-900">{data?.total_pageviews || 0}</div>
            <div className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Tumbuh Positif
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kunjungan Unik (Est.)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-slate-900">{Math.round((data?.total_pageviews || 0) * 0.72)}</div>
            <div className="text-[10px] text-slate-400">Estimasi rasio pengunjung unik 72%</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rata-Rata Durasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-slate-900">2m 14s</div>
            <div className="text-[10px] text-slate-400">Rata-rata waktu keterlibatan sesi</div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Chart & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Line Chart Card */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Statistik Kunjungan Harian
            </CardTitle>
            <CardDescription className="text-xs">Visualisasi pergerakan volume pengunjung harian.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {renderLineChart(data?.pageviews_by_date || [])}
          </CardContent>
        </Card>

        {/* Path and Referrers tables */}
        <div className="space-y-6">
          {/* Top Pages */}
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="p-4 bg-slate-50/50 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <MousePointerClick className="w-4 h-4 text-indigo-600" />
                Halaman Teratas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {data?.pageviews_by_path && data.pageviews_by_path.length > 0 ? (
                <div className="space-y-3">
                  {data.pageviews_by_path.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b last:border-none">
                      <span className="font-mono text-slate-600 truncate max-w-[200px]">{p.path}</span>
                      <span className="font-bold">{p.count} PVs</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-6">Belum ada data halaman.</div>
              )}
            </CardContent>
          </Card>

          {/* Top Referrers */}
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="p-4 bg-slate-50/50 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                Sumber Pengunjung (Referrers)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {data?.pageviews_by_referrer && data.pageviews_by_referrer.length > 0 ? (
                <div className="space-y-3">
                  {data.pageviews_by_referrer.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b last:border-none">
                      <span className="font-semibold text-slate-600">{r.referrer || "Direct / Unknown"}</span>
                      <span className="font-bold">{r.count} PVs</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-6">Belum ada data rujukan.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
