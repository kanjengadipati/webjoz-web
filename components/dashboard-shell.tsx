"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";
import { clearAuthSession, setThemePreference, useAuthToken, useThemePreference } from "@/lib/auth-store";
import { API_DOCS_URL } from "@/lib/config";
import { fetchProfile } from "@/lib/api";
import { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", adminOnly: false },
  { href: "/dashboard/logs", label: "Logs", adminOnly: true },
  { href: "/dashboard/investigate", label: "Investigate", adminOnly: true },
  { href: "/dashboard/sessions", label: "Sessions", adminOnly: false },
  { href: "/dashboard/users", label: "Users", adminOnly: true },
  { href: "/dashboard/settings", label: "Settings", adminOnly: false },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const token = useAuthToken();
  const theme = useThemePreference();
  const [profile, setProfile] = useState<Profile | null>(null);
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (token) {
      fetchProfile(token)
        .then((res) => setProfile(res.data || null))
        .catch(() => setProfile(null));
    } else {
      setProfile(null);
    }
  }, [token]);

  const userRole = profile?.role || "user";
  const filteredNavItems = navItems.filter((item) => !item.adminOnly || userRole === "admin");
  const activeLabel = navItems.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <Card className="sticky top-6 overflow-hidden border-border/40 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-4 border-b border-border/40 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6">
              <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary tracking-widest text-[10px]">GoKit Dashboard</Badge>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tighter">SecureKit</CardTitle>
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
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative rounded-xl px-4 py-3 text-sm transition-all duration-300",
                        active
                          ? "bg-primary !text-white shadow-lg shadow-primary/20 font-bold"
                          : "font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary",
                      )}
                    >
                      {item.label}
                      {active && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary-foreground shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <Separator />

              <div className="grid gap-2">
                <Button variant="outline" className="rounded-xl border-border/40 hover:bg-primary/5" onClick={() => setThemePreference(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
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
                <a href={API_DOCS_URL} target="_blank" rel="noreferrer">
                  <Button variant="default" size="sm" className="rounded-full h-9 px-5">API Docs</Button>
                </a>
              </div>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {!isAuthenticated ? (
              <Card className="border-primary/20 bg-primary/5 p-8 text-center space-y-6">
                <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold tracking-tighter">Access Locked</CardTitle>
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
