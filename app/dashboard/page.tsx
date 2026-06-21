"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, EmptyState, SectionTitle, SkeletonBlock } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchProfile } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { SectionState } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Building2, Users, Globe, CreditCard, Activity, Megaphone, TrendingUp,
  Loader2, Calendar, Zap, Database, Server, Cpu, ChevronRight,
  BarChart3, ShieldCheck, TicketCheck, UserPlus, ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";
import type { Profile } from "@/lib/types";

interface PlatformStats {
  total_tenants: number;
  total_users: number;
  total_sites: number;
  new_tenants_7d: number;
  new_users_7d: number;
}

interface SystemHealth {
  database: string;
  cache: string;
  ai: string;
  version: string;
}

interface TenantItem {
  id: number;
  name: string;
  slug: string;
  plan: string;
  owner_id: number;
  member_count: number;
  site_count: number;
  created_at: string;
}

interface PlanItem {
  id: number;
  name: string;
  slug: string;
}

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

const DASHBOARD_CONFIG = {
  INITIAL_PAGE: 1,
  ITEMS_PER_PAGE: 24,
  TREND_WINDOW_DAYS: 7,
} as const;

function StatCard({ label, value, icon: Icon, href, color, sub }: { label: string; value: string | number; icon: any; href: string; color: string; sub?: string }) {
  return (
    <Link href={href}>
      <div className="group bg-card border border-border/60 shadow-sm rounded-3xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</span>
          <div className={`size-10 rounded-2xl bg-gradient-to-br ${color}/10 ${color}/5 flex items-center justify-center`}>
            <Icon className={`size-5 ${color}`} />
          </div>
        </div>
        <p className="text-4xl font-bold tracking-tight text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
      </div>
    </Link>
  );
}

function QuickLink({ href, label, icon: Icon, desc }: { href: string; label: string; icon: any; desc: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
      <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="size-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
    </Link>
  );
}

export default function DashboardOverviewPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId } = useActiveTenant();
  const { role } = usePermissions();
  const isAdmin = role === "superadmin" || role === "admin";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [planCount, setPlanCount] = useState<number>(0);

  // Regular user state
  const [sites, setSites] = useState<Site[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [state, setState] = useState<SectionState>(SectionState.IDLE);

  const refresh = useCallback(async (showToast = false) => {
    if (!token) return;
    setState(SectionState.LOADING);

    if (isAdmin) {
      const [profileRes, statsRes, healthRes, tenantsRes, plansRes] = await Promise.allSettled([
        fetchProfile(token),
        request<PlatformStats>("/tenants/admin/stats", {}, token),
        request<SystemHealth>("/health/system", {}, token),
        request<TenantItem[]>("/tenants/admin", {}, token),
        request<PlanItem[]>("/admin/plans", {}, token),
      ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (healthRes.status === "fulfilled") setHealth(healthRes.value.data);
      if (tenantsRes.status === "fulfilled") setTenants((tenantsRes.value.data || []).slice(0, 5));
      if (plansRes.status === "fulfilled") setPlanCount((plansRes.value.data || []).length);
    } else {
      const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const toDate = new Date().toISOString().split("T")[0];
      const tenantHeaders: Record<string, string> = activeTenantId
        ? { "X-Tenant-ID": activeTenantId.toString() }
        : {};

      const [profileRes, sitesRes, leadsRes, analyticsRes] = await Promise.allSettled([
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

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data);
      if (sitesRes.status === "fulfilled") setSites(sitesRes.value.data || []);
      if (leadsRes.status === "fulfilled") setLeads(leadsRes.value.data || []);
      if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data);
    }

    setState(SectionState.SUCCESS);
    if (showToast) pushToast("Dashboard refreshed.", "success");
  }, [pushToast, token, activeTenantId, isAdmin]);

  useEffect(() => {
    if (!token || state !== SectionState.IDLE) return;
    const timeout = window.setTimeout(() => void refresh(false), 0);
    return () => window.clearTimeout(timeout);
  }, [refresh, state, token]);

  useEffect(() => {
    if (!token) return;
    setState(SectionState.IDLE);
  }, [token, isAdmin, activeTenantId]);

  const metrics = useMemo(() => {
    const publishedSites = sites.filter((s) => s.status === "published");
    const drafts = sites.length - publishedSites.length;
    const totalViews = analytics?.total_pageviews ?? 0;
    return { totalSites: sites.length, publishedSites: publishedSites.length, drafts, totalLeads: leads.length, totalViews };
  }, [sites, leads, analytics]);

  const barData = useMemo(() => {
    const byDate = analytics?.pageviews_by_date || [];
    return byDate.slice(-DASHBOARD_CONFIG.TREND_WINDOW_DAYS);
  }, [analytics]);

  const recentActivity = useMemo(() => {
    const items: Array<{ title: string; time: string; date: Date }> = [];
    leads.forEach((l) => items.push({ title: `Lead baru: ${l.name}`, time: new Date(l.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), date: new Date(l.created_at) }));
    sites.forEach((s) => { if (s.updated_at) items.push({ title: `Website "${s.name}" diupdate`, time: new Date(s.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), date: new Date(s.updated_at) }); });
    items.sort((a, b) => b.date.getTime() - a.date.getTime());
    return items.slice(0, 5);
  }, [leads, sites]);

  if (state === SectionState.LOADING) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <SkeletonBlock className="h-40 rounded-3xl" />
        <div className="grid grid-cols-4 gap-5">
          <SkeletonBlock className="h-32 rounded-3xl" /><SkeletonBlock className="h-32 rounded-3xl" />
          <SkeletonBlock className="h-32 rounded-3xl" /><SkeletonBlock className="h-32 rounded-3xl" />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <SkeletonBlock className="h-64 rounded-3xl" /><SkeletonBlock className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <section className="bg-gradient-to-br from-primary/15 via-primary/5 to-blue-600/10 border border-primary/15 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
                <LayoutDashboard className="size-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Platform Overview
                </h2>
                <p className="text-muted-foreground mt-1">
                  {stats
                    ? `${stats.total_tenants} tenants · ${stats.total_users} users · ${stats.total_sites} sites across the platform`
                    : "Loading platform metrics..."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/tenants">
                <Button className="h-11 rounded-xl px-5 font-bold shadow-lg shadow-primary/20">
                  <Building2 className="size-4 mr-2" />All Tenants
                </Button>
              </Link>
              <Link href="/dashboard/admin/plans">
                <Button variant="secondary" className="h-11 rounded-xl px-5 font-bold bg-background text-foreground hover:bg-background/80 shadow-sm border border-border/60">
                  <CreditCard className="size-4 mr-2" />Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Tenants"
            value={stats?.total_tenants ?? 0}
            icon={Building2}
            href="/dashboard/tenants"
            color="text-blue-500"
            sub={stats ? `+${stats.new_tenants_7d} in 7 days` : undefined}
          />
          <StatCard
            label="Total Users"
            value={stats?.total_users ?? 0}
            icon={Users}
            href="/dashboard/users"
            color="text-emerald-500"
            sub={stats ? `+${stats.new_users_7d} in 7 days` : undefined}
          />
          <StatCard
            label="Total Sites"
            value={stats?.total_sites ?? 0}
            icon={Globe}
            href="/dashboard/sites"
            color="text-violet-500"
          />
          <StatCard
            label="Active Plans"
            value={planCount}
            icon={CreditCard}
            href="/dashboard/admin/plans"
            color="text-amber-500"
          />
          <StatCard
            label="New Users (7d)"
            value={stats?.new_users_7d ?? 0}
            icon={UserPlus}
            href="/dashboard/users"
            color="text-rose-500"
          />
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                Recent Tenants
              </h3>
              <Link href="/dashboard/tenants" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="size-3" />
              </Link>
            </div>
            {tenants.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-12 text-center">No tenants registered yet.</p>
            ) : (
              <div className="space-y-2">
                {tenants.map((t) => (
                  <Link key={t.id} href={`/dashboard/tenants/${t.id}`} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-muted/30 transition-all duration-200 group">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-primary/15 to-blue-600/10 flex items-center justify-center text-primary font-bold text-sm">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{t.slug}</span>
                          <span className="size-1 rounded-full bg-muted-foreground/30" />
                          <span className="inline-flex items-center rounded-full border border-border/40 px-2 py-0.5 text-[10px] font-medium capitalize">{t.plan}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Globe className="size-3" />{t.site_count}</span>
                      <span className="flex items-center gap-1.5"><Users className="size-3" />{t.member_count}</span>
                      <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 mb-4 uppercase tracking-wider text-muted-foreground/70">
                <Activity className="size-3.5 text-primary" />
                System Health
              </h3>
              <div className="space-y-2.5">
                {[{ name: "Database", status: health?.database || "unknown", icon: Database },
                  { name: "Cache", status: health?.cache || "disabled", icon: Server },
                  { name: "AI Provider", status: health?.ai || "unknown", icon: Cpu },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <svc.icon className={`size-4 ${svc.status === "ok" ? "text-green-500" : svc.status === "error" ? "text-red-500" : "text-yellow-500"}`} />
                      <span className="text-sm font-medium">{svc.name}</span>
                    </div>
                    <span className={`text-xs font-semibold ${svc.status === "ok" ? "text-green-600" : svc.status === "error" ? "text-red-500" : "text-yellow-500"}`}>
                      {svc.status === "ok" ? "Healthy" : svc.status === "error" ? "Down" : svc.status === "disabled" ? "Disabled" : "Unknown"}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/admin/health" className="block mt-3 text-xs font-medium text-primary hover:underline">View detailed status →</Link>
            </div>

            <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 mb-4 uppercase tracking-wider text-muted-foreground/70">
                <Zap className="size-3.5 text-primary" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/dashboard/tenants" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">All Tenants</Link>
                <Link href="/dashboard/admin/plans" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">Plans</Link>
                <Link href="/dashboard/admin/health" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">Health</Link>
                <Link href="/dashboard/admin/announcements" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">Announce</Link>
                <Link href="/dashboard/users" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">Users</Link>
                <Link href="/dashboard/logs" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">Audit Logs</Link>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            Platform Management
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickLink href="/dashboard/tenants" label="All Tenants" icon={Building2} desc="View & manage all tenant accounts" />
            <QuickLink href="/dashboard/admin/plans" label="Plan Management" icon={CreditCard} desc="Define & assign subscription plans" />
            <QuickLink href="/dashboard/admin/health" label="System Health" icon={Activity} desc="Database, cache & AI provider status" />
            <QuickLink href="/dashboard/admin/announcements" label="Announcements" icon={Megaphone} desc="Broadcast messages to all tenants" />
          </div>
        </section>
      </div>
    );
  }

  // Regular user view
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="bg-gradient-to-r from-primary/20 to-blue-600/20 border border-primary/20 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2 text-foreground">
              Selamat Datang{profile ? `, ${profile.name.split(" ")[0]}` : ""}
            </h2>
            <p className="text-muted-foreground font-medium text-lg">
              Kelola website, domain, dan leads Anda dari satu tempat.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/sites/new">
              <Button className="h-12 rounded-xl px-6 font-bold shadow-lg shadow-primary/20">+ Website Baru</Button>
            </Link>
            <Link href="/dashboard/sites/new?ai=true">
              <Button variant="secondary" className="h-12 rounded-xl px-6 font-bold bg-background text-foreground hover:bg-background/80 shadow-sm border border-border/60">✨ Generate AI</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Website" value={metrics.totalSites} icon={Globe} href="/dashboard/sites" color="text-violet-500" sub={`${metrics.publishedSites} published`} />
        <StatCard label="Leads" value={metrics.totalLeads} icon={Activity} href="/dashboard/leads" color="text-amber-500" sub={metrics.totalLeads > 0 ? "New prospects" : "Setup lead form"} />
        <StatCard label="Visitors" value={metrics.totalViews} icon={TrendingUp} href="/dashboard/analytics" color="text-emerald-500" sub="This week" />
        <StatCard label="Health" value="100%" icon={ShieldCheck} href="/dashboard/settings" color="text-green-500" sub="All systems normal" />
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 tracking-tight">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((act, i) => (
              <div key={i}>
                <p className="font-semibold text-foreground text-sm">{act.title}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{act.time}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground italic">Belum ada aktivitas.</p>}
          </div>
        </div>
        <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 tracking-tight">AI Insights</h3>
          <div className="space-y-3">
            {metrics.totalViews > 0
              ? <div className="bg-muted/40 border border-border/40 p-3 rounded-xl text-sm font-medium">📈 Traffic terpantau masuk minggu ini sebanyak {metrics.totalViews} kunjungan.</div>
              : <div className="bg-muted/40 border border-border/40 p-3 rounded-xl text-sm font-medium">📉 Belum ada traffic signifikan minggu ini.</div>}
            {metrics.totalLeads > 0 && <div className="bg-muted/40 border border-border/40 p-3 rounded-xl text-sm font-medium">🔥 Anda memiliki {metrics.totalLeads} prospek baru!</div>}
            {metrics.totalSites === 0 && <div className="bg-primary/10 text-primary border border-primary/20 p-3 rounded-xl text-sm font-medium">✨ Buat website pertama Anda dengan AI Builder!</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
