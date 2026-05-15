"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";
import { BookOpenIcon, LockIcon, MoonIcon, SunIcon } from "@/components/icons";
import { clearAuthSession, useAuthReady, useAuthToken } from "@/lib/auth-store";
import { API_DOCS_URL, ENV_NAME } from "@/lib/config";
import { DASHBOARD_NAVIGATION } from "@/lib/navigation";
import { MOTION } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/components/toast-provider";
import { logoutCurrentSession, refreshAccessToken } from "@/lib/api";

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authReady = useAuthReady();
  const token = useAuthToken();
  const { theme, accent, isMonochrome, toggleAccent, toggleTheme } = useTheme();
  const { pushToast } = useToast();
  const { hasPermission, role: userRole, loading } = usePermissions();
  const [restoringSession, setRestoringSession] = useState(false);
  const triedCookieRefresh = useRef(false);
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!authReady || token || restoringSession || triedCookieRefresh.current) return;

    let cancelled = false;
    triedCookieRefresh.current = true;
    setRestoringSession(true);
    refreshAccessToken()
      .catch(() => {
        if (!cancelled) {
          clearAuthSession();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRestoringSession(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authReady, restoringSession, token]);

  async function handleLogout() {
    if (!token) {
      clearAuthSession();
      router.push("/login");
      return;
    }

    try {
      await logoutCurrentSession(token);
    } catch {
      pushToast("Signed out locally. The server session may still need review.", "info");
    } finally {
      clearAuthSession();
      router.push("/login");
    }
  }

  const filteredNavItems = DASHBOARD_NAVIGATION.filter((item) => hasPermission(item.permission) || !item.permission);
  const activeLabel = DASHBOARD_NAVIGATION.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 lg:hidden">
        <div className="flex items-center justify-around rounded-3xl border border-border/70 bg-card/95 px-4 py-3 backdrop-blur-xl shadow-xl shadow-slate-900/10 dark:bg-background/80 dark:shadow-primary/10">
          {filteredNavItems.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 p-2",
                  MOTION.standard,
                  active ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                )}
              >
                <div className={cn(
                  "size-1.5 rounded-full mb-1",
                  MOTION.standard,
                  active ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)] scale-100" : "bg-transparent scale-0"
                )} aria-hidden="true" />
                <span className="text-[9px] font-bold leading-none">{item.label}</span>
              </Link>
            );
          })}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/5"
            aria-label={isMonochrome ? "Switch to blue accent" : "Switch to monochrome accent"}
            aria-pressed={!isMonochrome}
            onClick={toggleAccent}
          >
            <div className={cn(
              "size-3.5 rounded-full border-2",
              MOTION.slow,
              accent === "monochrome" ? "bg-slate-500 border-slate-300" : "bg-indigo-500 border-indigo-300"
            )} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/5"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
          >
            <ThemeIcon mode={theme} />
          </Button>
        </div>
      </nav>

      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 pb-28 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8 lg:pb-6">
        <aside className="hidden lg:block">
          <Card className="sticky top-6 overflow-hidden border-border/40 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-4 border-b border-border/40 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Pleco logo"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                    priority
                  />
                  <CardTitle className="text-2xl font-bold tracking-tighter">Pleco Console</CardTitle>
                </div>
                <CardDescription className="text-xs font-medium opacity-80">
                  {ENV_NAME} Admin Workspace
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              <div className="rounded-2xl border border-border/30 bg-background/50 p-4 shadow-inner">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="text-xs font-medium text-muted-foreground/70">Mode</div>
                  <div className={cn(
                    "size-2 rounded-full",
                    isAuthenticated ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" : "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]",
                  )} aria-hidden="true" />
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
                        aria-current={active ? "page" : undefined}
                      >
                        <span className={cn(MOTION.transform, active ? "translate-x-1" : "group-hover:translate-x-1")}>{item.label}</span>
                        {active && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" aria-hidden="true" />
                        )}
                      </Link>
                    </div>
                  );
                })}
              </nav>

              <Separator />

              <div className="grid gap-3">
                <div className="rounded-2xl border border-border/40 bg-background/40 p-3">
                  <div className="mb-3 text-xs font-medium text-muted-foreground/70">Appearance</div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-full border border-border/40 bg-background/40 hover:bg-primary/5"
                      aria-label={isMonochrome ? "Switch to blue accent" : "Switch to monochrome accent"}
                      aria-pressed={!isMonochrome}
                      onClick={toggleAccent}
                    >
                      <div className={cn(
                        "size-4 rounded-full border-2",
                        MOTION.slow,
                        accent === "monochrome" ? "bg-slate-500 border-slate-300" : "bg-indigo-500 border-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                      )} aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-full border border-border/40 bg-background/40 hover:bg-primary/5"
                      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                      aria-pressed={theme === "dark"}
                      onClick={toggleTheme}
                    >
                      <ThemeIcon mode={theme} />
                    </Button>
                  </div>
                </div>
                {isAuthenticated && (
                  <Button variant="secondary" className="rounded-xl" onClick={() => void handleLogout()}>
                    Logout
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <header className="sticky top-0 z-20 rounded-3xl border border-border/80 bg-card/90 px-6 py-4 backdrop-blur-xl shadow-lg shadow-slate-900/10 dark:border-border/40 dark:bg-background/60 dark:shadow-black/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                  <div className="text-xs font-medium text-primary/80">Workspace</div>
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
                  <Button variant="ghost" size="sm" className="rounded-full h-9 px-5 text-muted-foreground hover:text-primary transition-colors">
                    <BookOpenIcon size="sm" className="mr-2 size-3.5" />
                    API Docs
                  </Button>
                </a>
              </div>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {!authReady || loading || restoringSession ? (
              <div className="flex items-center justify-center h-64">
                <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : !isAuthenticated ? (
              <Card className="border-primary/20 bg-primary/5 p-8 text-center space-y-6">
                <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <LockIcon size="lg" />
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
    return <SunIcon size="sm" />;
  }

  return <MoonIcon size="sm" />;
}
