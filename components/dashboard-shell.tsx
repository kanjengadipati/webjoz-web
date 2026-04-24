"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";
import { clearAuthSession, setThemePreference, useAuthToken, useThemePreference } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/logs", label: "Logs" },
  { href: "/dashboard/investigate", label: "Investigate" },
  { href: "/dashboard/sessions", label: "Sessions" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const token = useAuthToken();
  const theme = useThemePreference();
  const isAuthenticated = Boolean(token);
  const activeLabel = navItems.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <Card className="sticky top-6 overflow-hidden">
            <CardHeader className="space-y-4 border-b border-border/70 bg-gradient-to-br from-primary/14 via-background to-background p-6">
              <Badge variant="secondary" className="w-fit">Go API Starterkit</Badge>
              <div className="space-y-2">
                <CardTitle className="text-2xl">GoKit Dashboard</CardTitle>
                <CardDescription className="text-sm leading-7">
                Auth, sessions, audit logs, and AI-assisted investigation in one admin workspace.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-4">
              <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Mode</div>
                    <div className="mt-1 text-base font-semibold">
                      {isAuthenticated ? "Authenticated" : "Locked"}
                    </div>
                  </div>
                  <div className={cn(
                    "size-2.5 rounded-full",
                    isAuthenticated ? "bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.55)]" : "bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.45)]",
                  )} />
                </div>
                <div className="mt-2 text-sm leading-6 text-muted-foreground">
                  {isAuthenticated ? "API-backed pages are ready." : "Sign in to unlock live data."}
                </div>
              </div>

              <nav className="grid gap-1.5">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-2xl px-3 py-3 text-sm transition-colors",
                        active
                          ? "bg-primary !text-white shadow-sm font-semibold"
                          : "font-medium text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <Separator />

              <div className="grid gap-2">
                <Button variant="outline" onClick={() => setThemePreference(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                </Button>
                <Button variant="secondary" onClick={clearAuthSession} disabled={!isAuthenticated}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <header className="sticky top-0 z-10 rounded-3xl border border-border/80 bg-background/80 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Live Demo</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">{activeLabel}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Product-style admin views powered by your Go auth backend.
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/login"><Button variant="outline" size="sm">{isAuthenticated ? "Switch Account" : "Login"}</Button></Link>
                <a href="http://localhost:8080/docs" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">API Docs</Button>
                </a>
              </div>
            </div>
          </header>

          {!isAuthenticated ? (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle>Admin access required</CardTitle>
                <CardDescription>
                  Login first to unlock the live dashboard. The pages are wired to your Go backend and expect a valid access token in local storage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button>Go to Login</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
