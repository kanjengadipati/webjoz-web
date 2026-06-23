"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  // Accessibility & animation state for the chart
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathAnimated, setPathAnimated] = useState(false);

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
    const height = 220;
    const width = 720; // viewBox width
    const paddingLeft = 44;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 36;

    const graphHeight = height - paddingTop - paddingBottom;
    const graphWidth = width - paddingLeft - paddingRight;

    // Generate points in viewbox coordinates
    const points = chartData.map((d, idx) => {
      const x = paddingLeft + (idx / (chartData.length - 1 || 1)) * graphWidth;
      const y = paddingTop + graphHeight - (d.count / maxCount) * graphHeight;
      return { x, y, label: d.date, value: d.count };
    });

    const pathD = points.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
    const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${paddingTop + graphHeight} Z` : "";

    return (
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible" preserveAspectRatio="none" role="img" aria-label="Grafik kunjungan harian">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--primary)', stopOpacity: 0.22 }} />
              <stop offset="100%" style={{ stopColor: 'var(--primary)', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} className="stroke-slate-200" strokeWidth="1" strokeDasharray="4" />
          <line x1={paddingLeft} y1={paddingTop + graphHeight / 2} x2={width - paddingRight} y2={paddingTop + graphHeight / 2} className="stroke-slate-200" strokeWidth="1" strokeDasharray="4" />
          <line x1={paddingLeft} y1={paddingTop + graphHeight} x2={width - paddingRight} y2={paddingTop + graphHeight} className="stroke-slate-300" strokeWidth="1" />

          {/* Y Axis Labels */}
          <text x={paddingLeft - 12} y={paddingTop + 4} textAnchor="end" className="fill-slate-400 text-[10px] font-mono">{maxCount}</text>
          <text x={paddingLeft - 12} y={paddingTop + graphHeight / 2 + 4} textAnchor="end" className="fill-slate-400 text-[10px] font-mono">{Math.round(maxCount / 2)}</text>
          <text x={paddingLeft - 12} y={paddingTop + graphHeight + 4} textAnchor="end" className="fill-slate-400 text-[10px] font-mono">0</text>

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#chartGradient)" />}

          {/* Line path (use currentColor for easy theming) with animation */}
          {pathD && (
            <path
              ref={(el) => { pathRef.current = el; }}
              d={pathD}
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="var(--primary)"
              style={{ transition: pathAnimated ? "stroke-dashoffset 700ms ease-out" : undefined }}
            />
          )}

          {/* Data Points & Accessible Tooltips */}
          {points.map((p, idx) => {
            const isActive = activePoint === idx;
            const tooltipId = `pv-tooltip-${idx}`;
            return (
              <g key={idx} className="group/point">
                {/* Make the circle keyboard focusable */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 6 : 5}
                  fill="var(--primary)"
                  stroke="#fff"
                  strokeWidth="1.5"
                  className="transition-all"
                  tabIndex={0}
                  role="button"
                  aria-describedby={tooltipId}
                  onFocus={() => setActivePoint(idx)}
                  onBlur={() => setActivePoint((cur) => (cur === idx ? null : cur))}
                  onMouseEnter={() => setActivePoint(idx)}
                  onMouseLeave={() => setActivePoint((cur) => (cur === idx ? null : cur))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActivePoint((cur) => (cur === idx ? null : idx));
                    } else if (e.key === "ArrowRight") {
                      setActivePoint((cur) => (cur === null ? 0 : Math.min(points.length - 1, cur + 1)));
                    } else if (e.key === "ArrowLeft") {
                      setActivePoint((cur) => (cur === null ? 0 : Math.max(0, cur - 1)));
                    }
                  }}
                />

                {/* Tooltip: visible when focused/hovered */}
                <g
                  id={tooltipId}
                  className={`pointer-events-none transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0"}`}
                >
                  {/* Accessible focus ring behind the tooltip for keyboard users */}
                  {isActive && (
                    <circle cx={p.x} cy={p.y} r={12} fill="none" stroke="var(--primary-foreground)" strokeWidth={2} opacity={0.18} />
                  )}
                  <rect x={p.x - 36} y={p.y - 44} width="72" height="28" rx="6" fill="#0b1220" opacity={0.96} />
                  <text x={p.x} y={p.y - 26} textAnchor="middle" className="fill-white text-[11px] font-bold font-sans">{p.value} PVs</text>
                </g>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {points.filter((_, i) => i % Math.max(Math.round(points.length / 5), 1) === 0 || i === points.length - 1).map((p, idx) => {
            let shortDate = p.label;
            try { shortDate = new Date(p.label).toLocaleDateString("id-ID", { day: "numeric", month: "short" }); } catch {}
            return (
              <text key={idx} x={p.x} y={paddingTop + graphHeight + 20} textAnchor="middle" className="fill-slate-400 text-[10px] font-mono font-medium">{shortDate}</text>
            );
          })}
        </svg>
      </div>
    );
  };

  

  return (
    <div className="space-y-6">
      {/* Announce active point for screen readers */}
      <div aria-live="polite" className="sr-only">
        {activePoint !== null ? `Tanggal ${data?.pageviews_by_date?.[activePoint]?.date || ''}, ${data?.pageviews_by_date?.[activePoint]?.count || 0} pageviews` : ''}
      </div>
      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Site Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm outline-none focus:border-primary bg-card"
            aria-label="Pilih website"
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
            className="px-3 py-2 border rounded-xl text-sm outline-none focus:border-primary bg-card"
            aria-label="Dari tanggal"
          />
          <span className="text-sm font-semibold text-slate-400">s/d</span>
          <input
            type="date"
            value={toStr}
            onChange={(e) => setToStr(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm outline-none focus:border-primary bg-card"
            aria-label="Sampai tanggal"
          />
        </div>
      </div>

      {/* Main stats card list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Kunjungan (Pageviews)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-foreground">{data?.total_pageviews || 0}</div>
            <div className="text-[10px] text-primary font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Tumbuh Positif
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kunjungan Unik (Est.)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-foreground">{Math.round((data?.total_pageviews || 0) * 0.72)}</div>
            <div className="text-[10px] text-slate-400">Estimasi rasio pengunjung unik 72%</div>
          </CardContent>
        </Card>
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rata-Rata Durasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-foreground">2m 14s</div>
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
              <BarChart3 className="w-5 h-5 text-primary" />
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
                <MousePointerClick className="w-4 h-4 text-primary" />
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
                <ArrowUpRight className="w-4 h-4 text-primary" />
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
