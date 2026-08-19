"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LayoutGrid, Home, Bell, Globe, Link2, Inbox, BarChart2, Settings, CreditCard, Activity, Megaphone, Building2, ChevronLeft, ChevronDown, Plus, Palette, Users, DollarSign, Share2, Percent, Menu, X } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";
import { MoonIcon, SunIcon } from "@/components/icons";
import { clearAuthSession, useAuthReady, useAuthToken, useStoredEmail } from "@/lib/auth-store";
import { ENV_NAME } from "@/lib/config";
import { DASHBOARD_NAVIGATION } from "@/lib/navigation";
import { MOTION } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { useUnreadNotifications } from "@/hooks/use-unread-notifications";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/components/toast-provider";
import { logoutCurrentSession } from "@/lib/api";
import { useActiveTenant } from "@/lib/tenant-store";
import { useI18n } from "@/lib/i18n/context";

const NAV_LABEL_KEYS: Record<string, string> = {
  overview: "dashboard.nav.overview",
  notifications: "dashboard.nav.notifications",
  plans: "dashboard.nav.plans",
  promos: "dashboard.nav.promos",
  health: "dashboard.nav.health",
  announcements: "dashboard.nav.announcements",
  "admin-commissions": "dashboard.nav.commissions",
  tenants: "dashboard.nav.tenants",
  templates: "dashboard.nav.templates",
  "design-assets": "dashboard.nav.designAssets",
  metrics: "dashboard.nav.metrics",
  sites: "dashboard.nav.sites",
  domains: "dashboard.nav.domains",
  leads: "dashboard.nav.leads",
  analytics: "dashboard.nav.analytics",
  "sales-referral": "dashboard.nav.salesReferral",
  "sales-commissions": "dashboard.nav.salesCommissions",
  team: "dashboard.nav.team",
  upgrade: "dashboard.nav.upgrade",
  settings: "dashboard.nav.settings",
};

const NAV_SECTION_KEYS: Record<string, string> = {
  Dashboard: "dashboard.nav.sectionDashboard",
  "Website Builder": "dashboard.nav.sectionWebsiteBuilder",
  "Sales & Referral": "dashboard.nav.sectionSalesReferral",
  Sistem: "dashboard.nav.sectionSystem",
};

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authReady = useAuthReady();
  const token = useAuthToken();
  const storedEmail = useStoredEmail();
  const { t, locale, setLocale } = useI18n();
  const { theme, accent, isMonochrome, toggleAccent, toggleTheme } = useTheme();
  const { pushToast } = useToast();
  const { hasPermission, role: userRole, profile, loading } = usePermissions();
  const { unreadCount } = useUnreadNotifications();
  const { activeTenant } = useActiveTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = Boolean(token);

  const userDisplayName = profile?.name 
    || (profile?.email ? profile.email.split("@")[0] : "") 
    || (storedEmail ? storedEmail.split("@")[0] : "") 
    || (locale === "id" ? "Pengguna" : "User");
  const userInitial = (userDisplayName.slice(0, 1) || "U").toUpperCase();

  useEffect(() => {
    if (!authReady || token) return;
    clearAuthSession();

    // Preserve wizard prefill parameters before redirecting to login
    if (typeof window !== "undefined" && window.location.pathname.includes("/dashboard/sites/new") && window.location.search) {
      localStorage.setItem("webjoz_wizard_prefill", window.location.search);
    }

    window.location.replace("/login");
  }, [authReady, token]);

  // Restore prefill session after successful authentication
  useEffect(() => {
    if (!authReady || !token) return;
    if (typeof window === "undefined") return;

    const prefill = localStorage.getItem("webjoz_wizard_prefill");
    if (prefill) {
      localStorage.removeItem("webjoz_wizard_prefill");
      router.push(`/dashboard/sites/new${prefill}`);
    }
  }, [authReady, token, router]);

  async function handleLogout() {
    if (!token) {
      clearAuthSession();
      router.push("/login");
      return;
    }

    try {
      await logoutCurrentSession(token);
    } catch {
      pushToast(t("dashboard.signedOutLocally"), "info");
    } finally {
      clearAuthSession();
      router.push("/login");
    }
  }

  if (!authReady || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4 animate-in fade-in duration-500">
        <div className="relative size-12">
          {/* Outer glowing halo */}
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse" />
          {/* Ring track */}
          <div className="absolute inset-1 rounded-full border-3 border-primary/10" />
          {/* Spinner */}
          <div className="absolute inset-1 rounded-full border-3 border-transparent border-t-primary animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/85 animate-pulse">
            {t("dashboard.authenticating")}
          </p>
        </div>
      </div>
    );
  }

  const isAdmin = userRole === "superadmin" || userRole === "admin";
  const isSuperAdmin = userRole === "superadmin";
  const isPremiumPlan = activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";
  const filteredNavItems = DASHBOARD_NAVIGATION.filter((item) => {
    if ("superAdminOnly" in item && item.superAdminOnly && !isSuperAdmin) return false;
    if ("adminOnly" in item && item.adminOnly && !isAdmin) return false;
    if (!item.permission) return true;
    if (isAdmin) return true;
    return hasPermission(item.permission);
  });
  const activeNavItem = DASHBOARD_NAVIGATION.find((item) => item.href === pathname);
  const activeLabel = pathname === "/dashboard/sites/new"
    ? t("dashboard.createWebsite")
    : activeNavItem
      ? t(NAV_LABEL_KEYS[activeNavItem.id] ?? "", activeNavItem.label)
      : t("common.dashboard");

  const pathParts = pathname.split("/").filter(Boolean);
  const isEditPage = pathname.startsWith("/dashboard/sites/") && pathname !== "/dashboard/sites/new" && pathParts.length <= 3;
  const isNewSitePage = pathname === "/dashboard/sites/new";
  const isFullscreenWorkspace = isEditPage || isNewSitePage;

  const NAV_ICON_MAP: Record<string, React.ElementType> = {
    layout: LayoutDashboard,
    bell: Bell,
    globe: Globe,
    link: Link2,
    inbox: Inbox,
    chart: BarChart2,
    settings: Settings,
    "credit-card": CreditCard,
    activity: Activity,
    megaphone: Megaphone,
    building: Building2,
    palette: Palette,
    users: Users,
    dollar: DollarSign,
    share: Share2,
    percent: Percent,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Bottom Navigation (Full-width sticky bottom, Icon-Only) */}
      {!isFullscreenWorkspace && (
        <nav className="fixed bottom-0 inset-x-0 z-60 lg:hidden bg-card/95 dark:bg-background/90 backdrop-blur-2xl border-t border-border/60 py-2 pb-3 shadow-2xl shadow-black/20" aria-label={t("dashboard.mainNav")}>
          <div className="flex items-center justify-around max-w-lg mx-auto px-2">
            {/* Tab 1: Home (Overview) */}
            {(() => {
              const item = filteredNavItems.find(i => i.id === "overview");
              if (!item) return null;
              const active = pathname === item.href;
              return (
                <Link key="overview" href={item.href} aria-label="Beranda" aria-current={active ? "page" : undefined}
                  className={cn("relative flex items-center justify-center h-10 w-12 rounded-2xl transition-all duration-200",
                    active ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}>
                  <Home className={cn("size-5 transition-transform duration-200", active ? "stroke-[2.25] scale-110" : "stroke-[1.75]")} aria-hidden="true" />
                </Link>
              );
            })()}

            {/* Tab 2: Sites */}
            {(() => {
              const item = filteredNavItems.find(i => i.id === "sites");
              if (!item) return null;
              const active = pathname === item.href;
              const Icon = NAV_ICON_MAP[item.icon] ?? LayoutDashboard;
              return (
                <Link key="sites" href={item.href} aria-label={t(NAV_LABEL_KEYS[item.id] ?? "", item.label)} aria-current={active ? "page" : undefined}
                  className={cn("relative flex items-center justify-center h-10 w-12 rounded-2xl transition-all duration-200",
                    active ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}>
                  <Icon className={cn("size-5 transition-transform duration-200", active ? "stroke-[2.25] scale-110" : "stroke-[1.75]")} aria-hidden="true" />
                </Link>
              );
            })()}

            {/* Center Elevated Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? "Tutup Menu" : "Menu & Fitur"}
              aria-expanded={mobileMenuOpen}
              className="relative flex flex-col items-center -mt-5 group cursor-pointer active:scale-95 transition-transform"
            >
              <div className={cn(
                "size-12 rounded-full flex items-center justify-center ring-4 ring-card dark:ring-background transition-all duration-200 group-hover:scale-105",
                mobileMenuOpen
                  ? "bg-primary text-primary-foreground shadow-[0_0_22px_rgba(0,0,0,0.40)] scale-105"
                  : "bg-primary text-primary-foreground shadow-[0_4px_20px_rgba(0,0,0,0.30)]"
              )}>
                {mobileMenuOpen
                  ? <ChevronDown className="size-6 stroke-[2] transition-transform duration-200" />
                  : <LayoutGrid className="size-6 stroke-[1.75] transition-transform duration-200" />
                }
              </div>
            </button>

            {/* Tab 3: Leads */}
            {(() => {
              const item = filteredNavItems.find(i => i.id === "leads");
              if (!item) return null;
              const active = pathname === item.href;
              const Icon = NAV_ICON_MAP[item.icon] ?? LayoutDashboard;
              return (
                <Link key="leads" href={item.href} aria-label={t(NAV_LABEL_KEYS[item.id] ?? "", item.label)} aria-current={active ? "page" : undefined}
                  className={cn("relative flex items-center justify-center h-10 w-12 rounded-2xl transition-all duration-200",
                    active ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}>
                  <Icon className={cn("size-5 transition-transform duration-200", active ? "stroke-[2.25] scale-110" : "stroke-[1.75]")} aria-hidden="true" />
                </Link>
              );
            })()}

            {/* Tab 4: Notifications */}
            {(() => {
              const item = filteredNavItems.find(i => i.id === "notifications");
              if (!item) return null;
              const active = pathname === item.href;
              const Icon = NAV_ICON_MAP[item.icon] ?? LayoutDashboard;
              const showBadge = unreadCount > 0;
              return (
                <Link key="notifications" href={item.href} aria-label="Notifikasi" aria-current={active ? "page" : undefined}
                  className={cn("relative flex items-center justify-center h-10 w-12 rounded-2xl transition-all duration-200",
                    active ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}>
                  <div className="relative flex items-center justify-center">
                    <Icon className={cn("size-5 transition-transform duration-200", active ? "stroke-[2.25] scale-110" : "stroke-[1.75]")} aria-hidden="true" />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold leading-none shadow-md">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })()}
          </div>
        </nav>
      )}

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sheet Panel */}
          <div className="relative z-10 w-full max-h-[85vh] overflow-y-auto bg-background border-t border-border/50 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">

            {/* ── Header ── */}
            <div className="relative overflow-hidden rounded-t-3xl px-5 pt-5 pb-6 border-b border-border/40">
              {/* Subtle monochrome gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent dark:from-white/[0.03]" />

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="size-12 rounded-2xl bg-muted border border-border/60 flex items-center justify-center text-foreground font-bold text-lg shadow-sm">
                      {userInitial}
                    </div>
                    {/* Online dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-background shadow" />
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-bold text-[15px] text-foreground leading-tight">{userDisplayName}</p>
                    {/* Plan badge — monochrome */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted border border-border/60 text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                      {(activeTenant?.tenant?.plan || "free").charAt(0).toUpperCase() + (activeTenant?.tenant?.plan || "free").slice(1)} Plan
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="size-8 rounded-full bg-muted/60 border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Rest of content with padding */}
            <div className="px-5 pb-8 pt-4 space-y-5">

            {/* Navigation Groups */}
            <div className="space-y-4">
              {Array.from(new Set(filteredNavItems.map(item => item.section))).map((sectionName) => {
                const sectionItems = filteredNavItems.filter(item => item.section === sectionName);
                if (sectionItems.length === 0) return null;

                return (
                  <div key={sectionName} className="space-y-1.5">
                    <h4 className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground/70 px-1">
                      {t(NAV_SECTION_KEYS[sectionName] ?? "", sectionName)}
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {sectionItems.map((item) => {
                        const active = pathname === item.href;
                        const Icon = NAV_ICON_MAP[item.icon] ?? LayoutDashboard;
                        const label = t(NAV_LABEL_KEYS[item.id] ?? "", item.label);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border",
                              active
                                ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
                                : "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            )}
                          >
                            <Icon className="size-4 shrink-0" />
                            <span className="truncate">{label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Settings & Appearance Dock */}
            <div className="pt-2 border-t border-border/40 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/60 p-2 shadow-inner">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-xl border border-border/40 bg-card/60 hover:bg-primary/10 transition-all cursor-pointer"
                    aria-label={isMonochrome ? t("dashboard.switchAccentBlue") : t("dashboard.switchAccentMonochrome")}
                    aria-pressed={!isMonochrome}
                    onClick={toggleAccent}
                  >
                    <div className={cn(
                      "size-4 rounded-full border-2",
                      MOTION.slow,
                      accent === "monochrome" ? "bg-slate-500 border-slate-300" : "bg-primary border-primary/80 shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
                    )} aria-hidden="true" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-xl border border-border/40 bg-card/60 hover:bg-primary/10 transition-all cursor-pointer"
                    aria-label={theme === "dark" ? t("dashboard.switchLight") : t("dashboard.switchDark")}
                    aria-pressed={theme === "dark"}
                    onClick={toggleTheme}
                  >
                    <ThemeIcon mode={theme} />
                  </Button>
                </div>

                <div className="h-6 w-px bg-border/50 mx-1 shrink-0" aria-hidden="true" />

                <div className="inline-flex items-center rounded-full border border-border/60 bg-card/60 p-0.5 text-[11px] font-semibold shadow-inner">
                  {(["id", "en"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      aria-label={`Switch language to ${code === "id" ? "Bahasa Indonesia" : "English"}`}
                      aria-pressed={locale === code}
                      onClick={() => setLocale(code)}
                      className={cn(
                        "rounded-full px-3 py-1 transition-all cursor-pointer font-bold",
                        locale === code
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {code === "id" ? "ID" : "EN"}
                    </button>
                  ))}
                </div>
              </div>

              {isAuthenticated && (
                <Button variant="secondary" className="w-full rounded-xl text-xs font-semibold" onClick={() => void handleLogout()}>
                  {t("dashboard.logout")}
                </Button>
              )}
            </div>
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "mx-auto grid min-h-screen",
        isFullscreenWorkspace 
          ? "max-w-none w-full grid-cols-1 p-0 gap-0" 
          : "max-w-7xl gap-6 px-4 py-6 pb-28 lg:px-8 lg:pb-6 lg:grid-cols-[290px_minmax(0,1fr)]"
      )}>
        {!isFullscreenWorkspace && (
          <aside className="hidden lg:block">
            <Card className="sticky top-6 overflow-hidden border-border/40 shadow-xl shadow-primary/5">
              <CardHeader className="space-y-4 border-b border-border/40 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo2.png"
                      alt="Webjoz logo"
                      width={120}
                      height={72}
                      className="h-8 w-auto object-contain"
                      priority
                    />
                    <CardTitle className="text-2xl font-bold tracking-tighter">{t("dashboard.consoleTitle")}</CardTitle>
                  </div>
                  <CardDescription className="text-xs font-medium opacity-80">
                    {t("dashboard.adminWorkspace")}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                <div className="rounded-2xl border border-border/30 bg-background/50 p-4 shadow-inner">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="text-xs font-medium text-muted-foreground/70">{t("dashboard.mode")}</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-border/40 bg-muted/60 px-2.5 py-0.5 text-[11px] font-bold text-foreground capitalize">{activeTenant?.tenant.plan || "free"}</span>
                      {activeTenant?.tenant.plan === "free" && (
                        <Link href="/dashboard/upgrade" className="text-[9px] px-1.5 py-0.5 bg-primary text-primary-foreground rounded font-extrabold uppercase tracking-wider leading-none hover:opacity-80 transition-opacity">
                          {t("dashboard.upgradeLabel")}
                        </Link>
                      )}
                      <div className={cn(
                        "size-2 rounded-full",
                        isAuthenticated ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" : "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]",
                      )} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-sm font-bold tracking-tight">
                    {isAuthenticated ? (
                      <div className="flex items-center justify-between gap-2">
                        <span>{t("dashboard.authenticated")}</span>
                        <Badge variant="secondary" className="capitalize text-[9px] px-2 py-0 h-4 bg-primary/10 text-primary border-none font-bold">
                          {userRole}
                        </Badge>
                      </div>
                    ) : t("dashboard.locked")}
                  </div>
                </div>

                <nav className="space-y-5">
                  {Array.from(new Set(filteredNavItems.map(item => item.section))).map((sectionName) => {
                    const sectionItems = filteredNavItems.filter(item => item.section === sectionName);
                    if (sectionItems.length === 0) return null;

                    return (
                      <div key={sectionName} className="space-y-2">
                        <h3 className="px-4 text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/40">
                          {t(NAV_SECTION_KEYS[sectionName] ?? "", sectionName)}
                        </h3>
                        <div className="grid gap-1">
                          {sectionItems.map((item) => {
                            const active = pathname === item.href;
                            const showBadge = item.id === "notifications" && unreadCount > 0;
                            const label = t(NAV_LABEL_KEYS[item.id] ?? "", item.label);
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  "group relative flex items-center rounded-xl border-l-2 px-4 py-2.5 text-sm transition-all duration-300",
                                  active
                                    ? "border-primary bg-primary/12 text-primary shadow-inner font-bold"
                                    : "border-transparent font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                                )}
                                aria-current={active ? "page" : undefined}
                              >
                                <span className={cn(MOTION.transform, active ? "translate-x-1" : "group-hover:translate-x-1")}>
                                  {label}
                                </span>
                  {(item as any).premium && !isPremiumPlan && (
                                  <span className="ml-auto text-[8px] px-1.5 py-0.5 bg-primary text-primary-foreground rounded font-extrabold uppercase tracking-wider leading-none">
                                    {t("dashboard.pro")}
                                  </span>
                                )}
                                {showBadge && (
                                  <span className="ml-auto mr-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold leading-none">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                  </span>
                                )}
                                {active && !showBadge && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" aria-hidden="true" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </nav>

                <Separator />

                <div className="grid gap-3">
                  {/* Minimalist Control Dock (Idea 2) */}
                  <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 p-2 shadow-inner">
                    {/* Left: Accent & Theme toggles */}
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-xl border border-border/40 bg-card/60 hover:bg-primary/10 transition-all cursor-pointer"
                        aria-label={isMonochrome ? t("dashboard.switchAccentBlue") : t("dashboard.switchAccentMonochrome")}
                        aria-pressed={!isMonochrome}
                        onClick={toggleAccent}
                      >
                        <div className={cn(
                          "size-4 rounded-full border-2",
                          MOTION.slow,
                          accent === "monochrome" ? "bg-slate-500 border-slate-300" : "bg-primary border-primary/80 shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
                        )} aria-hidden="true" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-xl border border-border/40 bg-card/60 hover:bg-primary/10 transition-all cursor-pointer"
                        aria-label={theme === "dark" ? t("dashboard.switchLight") : t("dashboard.switchDark")}
                        aria-pressed={theme === "dark"}
                        onClick={toggleTheme}
                      >
                        <ThemeIcon mode={theme} />
                      </Button>
                    </div>

                    {/* Divider */}
                    <div className="h-6 w-px bg-border/50 mx-1 shrink-0" aria-hidden="true" />

                    {/* Right: Language Pill */}
                    <div className="inline-flex items-center rounded-full border border-border/60 bg-card/60 p-0.5 text-[11px] font-semibold shadow-inner">
                      {(["id", "en"] as const).map((code) => (
                        <button
                          key={code}
                          type="button"
                          aria-label={`Switch language to ${code === "id" ? "Bahasa Indonesia" : "English"}`}
                          aria-pressed={locale === code}
                          onClick={() => setLocale(code)}
                          className={cn(
                            "rounded-full px-3 py-1 transition-all cursor-pointer font-bold",
                            locale === code
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {code === "id" ? "ID" : "EN"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isAuthenticated && (
                    <Button variant="secondary" className="rounded-xl" onClick={() => void handleLogout()}>
                      {t("dashboard.logout")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        )}

        <div className="flex min-w-0 flex-col gap-6">
          {!isFullscreenWorkspace && (
            <header className="sticky top-0 z-20 rounded-3xl border border-border/80 bg-card/90 px-6 py-4 backdrop-blur-xl shadow-lg shadow-slate-900/10 dark:border-border/40 dark:bg-background/60 dark:shadow-black/5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
                    {pathname === "/dashboard/sites/new" && (
                      <Link
                        href="/dashboard/sites"
                        className="inline-flex items-center justify-center p-1.5 rounded-xl hover:bg-primary/10 transition text-muted-foreground hover:text-primary"
                        aria-label={t("dashboard.backToWebsites")}
                      >
                        <ChevronLeft className="size-6" />
                      </Link>
                    )}
                    <span>{activeLabel}</span>
                  </div>
                  {(pathname === "/dashboard" || pathname === "/dashboard/sites" || pathname === "/dashboard/domains" || pathname === "/dashboard/leads" || pathname === "/dashboard/analytics" || pathname === "/dashboard/settings" || pathname === "/dashboard/admin/templates") && (
                    <p className="text-xs text-muted-foreground">
                      {pathname === "/dashboard" && t("dashboard.subDashboard")}
                      {pathname === "/dashboard/sites" && t("dashboard.subSites")}
                      {pathname === "/dashboard/domains" && t("dashboard.subDomains")}
                      {pathname === "/dashboard/leads" && t("dashboard.subLeads")}
                      {pathname === "/dashboard/analytics" && t("dashboard.subAnalytics")}
                      {pathname === "/dashboard/settings" && t("dashboard.subSettings")}
                      {pathname === "/dashboard/admin/templates" && t("dashboard.adminTemplates.subtitle")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {pathname === "/dashboard/sites" && (
                    <Link href="/dashboard/sites/new">
                      <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:brightness-110 active:scale-98 transition-all px-4 py-2.5 rounded-full font-medium text-[13.5px] cursor-pointer shadow-lg shadow-primary/30">
                        <Plus className="w-4 h-4" /> {t("dashboard.newWebsiteAi")}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </header>
          )}

          <div className={cn(
            "animate-in fade-in slide-in-from-bottom-2 duration-500",
            isFullscreenWorkspace && "h-full"
          )}>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 gap-4">
                <div className="relative size-12 animate-in zoom-in duration-300">
                  {/* Outer glowing halo */}
                  <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse" />
                  {/* Ring track */}
                  <div className="absolute inset-1 rounded-full border-3 border-primary/10" />
                  {/* Spinner */}
                  <div className="absolute inset-1 rounded-full border-3 border-transparent border-t-primary animate-spin" />
                </div>
                <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/85 animate-pulse">
                    {t("dashboard.loadingConsole")}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground/60 tracking-wider">
                    {t("dashboard.preparingWorkspace")}
                  </p>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeIcon({ mode }: { mode: string }) {
  if (mode === "dark") {
    return <SunIcon size="sm" />;
  }

  return <MoonIcon size="sm" />;
}
