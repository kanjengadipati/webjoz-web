"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";
import { clearAuthSession, setThemePreference, useAuthToken, useThemePreference } from "@/lib/auth-store";
import { API_DOCS_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";

const navItems = [
  { href: "/dashboard", label: "Overview", permission: "dashboard.view" },
  { href: "/dashboard/logs", label: "Logs", permission: "role.read" },
  { href: "/dashboard/investigate", label: "Investigate", permission: "role.read" },
  { href: "/dashboard/sessions", label: "Sessions", permission: "dashboard.view" },
  { href: "/dashboard/users", label: "Users", permission: "permission.read", groupStart: true },
  { href: "/dashboard/permissions", label: "Permissions", permission: "role.update_permissions" },
  { href: "/dashboard/settings", label: "Settings", permission: "dashboard.view" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const token = useAuthToken();
  const theme = useThemePreference();
  const { hasPermission, role: userRole, loading } = usePermissions();
  const isAuthenticated = Boolean(token);

  const filteredNavItems = navItems.filter((item) => hasPermission(item.permission) || !item.permission);
  const activeLabel = navItems.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 lg:hidden">
        <div className="flex items-center justify-around rounded-3xl border border-border/40 bg-background/80 px-4 py-3 backdrop-blur-xl shadow-2xl shadow-primary/10">
          {filteredNavItems.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 transition-all duration-300",
                  active ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                )}
              >
                <div className={cn(
                  "size-1.5 rounded-full mb-1 transition-all duration-300",
                  active ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)] scale-100" : "bg-transparent scale-0"
                )} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label.slice(0, 3)}</span>
              </Link>
            );
          })}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-primary/5"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setThemePreference(theme === "dark" ? "light" : "dark")}
          >
            <ThemeIcon mode={theme} />
          </Button>
        </div>
      </nav>

      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 pb-28 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8 lg:pb-6">
        <aside className="hidden lg:block">
          <Card className="sticky top-6 overflow-hidden border-border/40 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-4 border-b border-border/40 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6">
              <div className="flex items-start justify-between gap-3">
                <Link href="/dashboard" aria-label="Go to dashboard overview">
                  <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary tracking-widest text-[10px] hover:bg-primary/10">GoKit Console</Badge>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full border border-border/40 bg-background/40 hover:bg-primary/5"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  onClick={() => setThemePreference(theme === "dark" ? "light" : "dark")}
                >
                  <ThemeIcon mode={theme} />
                </Button>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tighter">GoKit Console</CardTitle>
                <CardDescription className="text-xs font-medium opacity-80">
                  Unified Admin Workspace
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              <div className="rounded-2xl border border-border/30 bg-background/50 p-4 shadow-inner">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted-foreground/70">Mode</div>
                  <div className={cn(
                    "size-2 rounded-full",
                    isAuthenticated ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" : "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]",
                  )} />
                </div>
                <div className="text-sm font-bold tracking-tight">
                  {isAuthenticated ? (
                    <div className="flex items-center justify-between gap-2">
                      <span>Authenticated</span>
                      <Badge variant="secondary" className="capitalize text-[9px] px-2 py-0 h-4 bg-primary/10 text-primary border-none font-bold">
                        {userRole}
                      </Badge>
                    </div>
                  ) : "Locked"}
                </div>
              </div>

              <nav className="grid gap-1">
                {filteredNavItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <div key={item.href} className={cn(item.groupStart ? "mt-3 border-t border-border/40 pt-3" : "")}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center rounded-xl border-l-2 px-4 py-3 text-sm transition-all duration-300",
                          active
                            ? "border-primary bg-primary/12 text-primary shadow-inner font-bold"
                            : "border-transparent font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                        )}
                      >
                        <span className={cn("transition-transform duration-300", active ? "translate-x-1" : "group-hover:translate-x-1")}>{item.label}</span>
                        {active && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" />
                        )}
                      </Link>
                    </div>
                  );
                })}
              </nav>

              <Separator />

              <div className="grid gap-2">
                <Button variant="secondary" className="rounded-xl" onClick={clearAuthSession} disabled={!isAuthenticated}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <header className="sticky top-0 z-20 rounded-3xl border border-border/40 bg-background/60 px-6 py-4 backdrop-blur-xl shadow-lg shadow-black/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/80">Live Workspace</div>
                </div>
                <div className="text-2xl font-bold tracking-tighter">{activeLabel}</div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="rounded-full h-9 px-5">
                    {isAuthenticated ? "Switch" : "Login"}
                  </Button>
                </Link>
                <a href={API_DOCS_URL} target="_blank" rel="noreferrer" className="hidden sm:inline-block">
                  <Button variant="default" size="sm" className="rounded-full h-9 px-5">API Docs</Button>
                </a>
              </div>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : !isAuthenticated ? (
              <Card className="border-primary/20 bg-primary/5 p-8 text-center space-y-6">
                <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold tracking-tighter text-balance">Access Locked</CardTitle>
                  <CardDescription className="text-base max-w-md mx-auto">
                    This workspace requires a valid admin token. Please sign in to unlock the security telemetry and AI tools.
                  </CardDescription>
                </div>
                <div className="pt-4">
                  <Link href="/login">
                    <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">Unlock Workspace</Button>
                  </Link>
                </div>
              </Card>
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
    return (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
