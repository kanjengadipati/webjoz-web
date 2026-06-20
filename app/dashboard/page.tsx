"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, EmptyState, SectionTitle, SkeletonBlock } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchProfile } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { SectionState } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

const DASHBOARD_CONFIG = {
  INITIAL_PAGE: 1,
  ITEMS_PER_PAGE: 24,
  TREND_WINDOW_DAYS: 7,
} as const;

interface Site {
  id: number;
  name: string;
  status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
}

interface Lead {
  id: number;
  created_at: string;
  name: string;
  email: string;
  site_id: number;
}

interface PageViewStat {
  date: string;
  count: number;
}

interface AnalyticsData {
  total_pageviews: number;
  pageviews_by_date: PageViewStat[];
}

export default function DashboardOverviewPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId } = useActiveTenant();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [state, setState] = useState<SectionState>(SectionState.IDLE);

  const refresh = useCallback(async (showToast = false) => {
    if (!token) return;
    setState(SectionState.LOADING);

    const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const toDate = new Date().toISOString().split("T")[0];

    const tenantHeaders: Record<string, string> = activeTenantId
      ? { "X-Tenant-ID": activeTenantId.toString() }
      : {};

    const [profileResult, sitesResult, leadsResult, analyticsResult] = await Promise.allSettled([
      fetchProfile(token),
      activeTenantId
        ? request<Site[]>("/sites", { headers: tenantHeaders }, token)
        : Promise.reject(new Error("No tenant")),
      activeTenantId
        ? request<Lead[]>("/leads", { headers: tenantHeaders }, token)
        : Promise.reject(new Error("No tenant")),
      activeTenantId
        ? request<AnalyticsData>(`/analytics?from=${fromDate}&to=${toDate}`, { headers: tenantHeaders }, token)
        : Promise.reject(new Error("No tenant")),
    ]);

    if (profileResult.status === "fulfilled") setProfile(profileResult.value.data);
    if (sitesResult.status === "fulfilled") setSites(sitesResult.value.data || []);
    if (leadsResult.status === "fulfilled") setLeads(leadsResult.value.data || []);
    if (analyticsResult.status === "fulfilled") setAnalytics(analyticsResult.value.data);

    const allFailed =
      profileResult.status === "rejected" &&
      sitesResult.status === "rejected" &&
      leadsResult.status === "rejected" &&
      analyticsResult.status === "rejected";

    if (allFailed) {
      setState(SectionState.ERROR);
      const firstError = profileResult.reason;
      pushToast(firstError instanceof Error ? firstError.message : "Failed to load dashboard", "error");
    } else {
      setState(SectionState.SUCCESS);
      if (showToast) {
        pushToast("Dashboard metrics refreshed.", "success");
      }
    }
  }, [pushToast, token, activeTenantId]);

  useEffect(() => {
    if (!token || state !== SectionState.IDLE) return;
    const timeout = window.setTimeout(() => {
      void refresh(false);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [refresh, state, token]);

  // Re-fetch when tenant changes
  useEffect(() => {
    if (!token || !activeTenantId) return;
    setState(SectionState.IDLE);
  }, [activeTenantId, token]);

  const metrics = useMemo(() => {
    const publishedSites = sites.filter((s) => s.status === "published");
    const drafts = sites.length - publishedSites.length;
    const totalViews = analytics?.total_pageviews ?? 0;
    return {
      totalSites: sites.length,
      publishedSites: publishedSites.length,
      drafts,
      totalLeads: leads.length,
      totalViews,
    };
  }, [sites, leads, analytics]);

  const barData = useMemo(() => {
    const byDate = analytics?.pageviews_by_date || [];
    return byDate.slice(-DASHBOARD_CONFIG.TREND_WINDOW_DAYS);
  }, [analytics]);

  const recentActivity = useMemo(() => {
    const items: Array<{ title: string; time: string; date: Date }> = [];
    leads.forEach((l) => {
      items.push({
        title: `Lead baru: ${l.name}`,
        time: new Date(l.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
        date: new Date(l.created_at)
      });
    });
    sites.forEach((s) => {
      if (s.updated_at) {
        items.push({
          title: `Website "${s.name}" diupdate`,
          time: new Date(s.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
          date: new Date(s.updated_at)
        });
      }
    });
    items.sort((a, b) => b.date.getTime() - a.date.getTime());
    return items.slice(0, 5);
  }, [leads, sites]);

  if (state === SectionState.LOADING) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <SkeletonBlock className="h-40 rounded-3xl" />
        <div className="grid grid-cols-4 gap-5">
          <SkeletonBlock className="h-32 rounded-3xl" />
          <SkeletonBlock className="h-32 rounded-3xl" />
          <SkeletonBlock className="h-32 rounded-3xl" />
          <SkeletonBlock className="h-32 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-blue-600/20 border border-primary/20 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2 text-foreground">
              Selamat Datang Kembali{profile ? `, ${profile.name.split(" ")[0]}` : ""} 👋
            </h2>
            <p className="text-muted-foreground font-medium text-lg">
              Kelola website, domain, dan leads Anda dari satu tempat.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/sites/new">
              <Button className="h-12 rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
                + Website Baru
              </Button>
            </Link>
            <Link href="/dashboard/sites/new?ai=true">
              <Button variant="secondary" className="h-12 rounded-xl px-6 font-bold bg-background text-foreground hover:bg-background/80 shadow-sm border border-border/60">
                ✨ Generate AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card border border-border/60 shadow-sm rounded-3xl p-6 transition-all hover:border-primary/30">
          <p className="text-muted-foreground font-medium">Website</p>
          <h3 className="text-5xl font-bold mt-3 tracking-tighter text-foreground">{metrics.totalSites}</h3>
          <p className="text-emerald-500 mt-2 font-medium text-sm">{metrics.publishedSites} Published</p>
        </div>

        <div className="bg-card border border-border/60 shadow-sm rounded-3xl p-6 transition-all hover:border-primary/30">
          <p className="text-muted-foreground font-medium">Leads</p>
          <h3 className="text-5xl font-bold mt-3 tracking-tighter text-foreground">{metrics.totalLeads}</h3>
          <p className="text-amber-500 mt-2 font-medium text-sm">
            {metrics.totalLeads > 0 ? "Prospek baru masuk" : "Setup form lead"}
          </p>
        </div>

        <div className="bg-card border border-border/60 shadow-sm rounded-3xl p-6 transition-all hover:border-primary/30">
          <p className="text-muted-foreground font-medium">Visitors</p>
          <h3 className="text-5xl font-bold mt-3 tracking-tighter text-foreground">{metrics.totalViews}</h3>
          <p className="text-emerald-500 mt-2 font-medium text-sm">Minggu ini</p>
        </div>

        <div className="bg-card border border-border/60 shadow-sm rounded-3xl p-6 transition-all hover:border-primary/30">
          <p className="text-muted-foreground font-medium">Health</p>
          <h3 className="text-5xl font-bold mt-3 tracking-tighter text-foreground">100%</h3>
          <p className="text-emerald-500 mt-2 font-medium text-sm">Semua sistem normal</p>
        </div>
      </section>

      {/* Quick Action */}
      <section>
        <h3 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
          ⚡ Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/sites/new?ai=true" className="bg-muted/40 hover:bg-muted/60 p-6 rounded-2xl border border-border/60 text-left transition-all hover:border-primary/40 group">
            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">🤖 Generate Website AI</div>
          </Link>
          <Link href="/dashboard/domains" className="bg-muted/40 hover:bg-muted/60 p-6 rounded-2xl border border-border/60 text-left transition-all hover:border-primary/40 group">
            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">🌐 Connect Domain</div>
          </Link>
          <Link href="/dashboard/sites/new" className="bg-muted/40 hover:bg-muted/60 p-6 rounded-2xl border border-border/60 text-left transition-all hover:border-primary/40 group">
            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">🎨 Browse Template</div>
          </Link>
          <Link href="/dashboard/leads" className="bg-muted/40 hover:bg-muted/60 p-6 rounded-2xl border border-border/60 text-left transition-all hover:border-primary/40 group">
            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">📥 View Leads</div>
          </Link>
        </div>
      </section>

      {/* Activity + Insights */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-6 tracking-tight">Recent Activity</h3>
          <div className="space-y-5">
            {recentActivity.length > 0 ? (
              recentActivity.map((act, i) => (
                <div key={i}>
                  <p className="font-semibold text-foreground">{act.title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{act.time}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm italic">Belum ada aktivitas.</p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-6 tracking-tight">AI Insights</h3>
          <div className="space-y-4">
            {metrics.totalViews > 0 ? (
              <div className="bg-muted/40 border border-border/40 p-4 rounded-xl text-sm font-medium">
                📈 Traffic terpantau masuk minggu ini sebanyak {metrics.totalViews} kunjungan.
              </div>
            ) : (
              <div className="bg-muted/40 border border-border/40 p-4 rounded-xl text-sm font-medium">
                📉 Belum ada traffic signifikan minggu ini. Coba promosikan website Anda.
              </div>
            )}
            
            {metrics.totalLeads > 0 ? (
              <div className="bg-muted/40 border border-border/40 p-4 rounded-xl text-sm font-medium">
                🔥 Anda memiliki {metrics.totalLeads} prospek baru yang bisa difollow-up!
              </div>
            ) : null}

            {metrics.drafts > 0 ? (
              <div className="bg-muted/40 border border-border/40 p-4 rounded-xl text-sm font-medium">
                ⚠️ {metrics.drafts} website berstatus draft dan belum dipublish.
              </div>
            ) : null}

            {metrics.totalSites === 0 ? (
              <div className="bg-primary/10 text-primary border border-primary/20 p-4 rounded-xl text-sm font-medium">
                ✨ Mulai dengan membuat website pertama Anda menggunakan AI Builder!
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold tracking-tight">Website Performance</h3>
          <select className="bg-muted/50 border border-border/60 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-primary transition-colors cursor-pointer appearance-none pr-8 relative">
            <option>7 Hari Terakhir</option>
          </select>
        </div>

        {barData.length === 0 ? (
           <div className="h-72 rounded-2xl bg-gradient-to-t from-primary/5 to-transparent border border-dashed border-primary/20 flex flex-col items-center justify-center text-muted-foreground/60 gap-3">
             <div className="text-sm font-medium">Belum ada data kunjungan</div>
           </div>
        ) : (
          <div className="h-72 flex items-end justify-between gap-2 lg:gap-4 px-2">
            {barData.map(({ date, count }, index) => {
              const maxCount = Math.max(...barData.map(d => d.count), 1);
              const heightPercent = Math.max(10, (count / maxCount) * 100);
              return (
                <div key={index} className="group flex-1 flex flex-col items-center justify-end gap-3 h-full">
                  <div className="text-[11px] font-bold text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-300 translate-y-2 group-hover:translate-y-0">{count}</div>
                  <div 
                    className="w-full max-w-[48px] bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-xl transition-all duration-500 group-hover:from-primary/40 group-hover:to-primary"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <div className="text-[10px] font-semibold text-muted-foreground truncate w-full text-center">
                    {new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      
    </div>
  );
}
