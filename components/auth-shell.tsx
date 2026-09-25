"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Home, LogIn, UserPlus, KeyRound, ArrowLeft } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, SubtleStat } from "@/components/ui";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthReady, useAuthToken } from "@/lib/auth-store";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  stats?: Array<{ label: string; value: string; helper?: string }>;
  cardEyebrow?: string;
  cardTitle: string;
  cardDescription: string;
  children: ReactNode;
  footer?: ReactNode;
};

// Landing-page style navbar — shared on desktop across all auth pages.
function LandingHeader() {
  const router = useRouter();
  const { t } = useI18n();
  const authReady = useAuthReady();
  const token = useAuthToken();
  const isLoggedIn = authReady && !!token;

  return (
    <header className="hidden lg:block sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo2.png"
            alt="Webjoz"
            width={120}
            height={72}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Center Nav Links (same as landing page) */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="/#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("landing.navHowItWorks")}
          </a>
          <a
            href="/#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("landing.navFeatures")}
          </a>
          <a
            href="/#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("landing.navPricing")}
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle showAccent />
          <LanguageSwitcher />

          <Link
            href="/help"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1"
            title={t("landing.navHelp")}
          >
            <svg className="size-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span className="hidden xs:inline">{t("landing.navHelp")}</span>
          </Link>

          {authReady && (
            isLoggedIn ? (
              <Link
                href="/dashboard"
                className="hidden sm:inline-block text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                {t("landing.navDashboard")}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                {t("landing.navLogin")}
              </Link>
            )
          )}
          <div className="hidden sm:block">
            <Button
              onClick={() => router.push("/create")}
              className="inline-flex rounded-xl bg-primary text-primary-foreground font-semibold px-4 py-2 text-xs sm:px-5 sm:py-2 text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              {isLoggedIn ? t("landing.navCreateNew") : t("landing.navStartFree")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AuthShell({
  badge,
  title,
  description,
  stats = [],
  cardEyebrow,
  cardTitle,
  cardDescription,
  children,
  footer,
}: AuthShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale } = useI18n();
  const isEn = locale === "en";

  return (
    <main className="relative min-h-[100dvh] flex flex-col bg-background">
      {/* Landing-style navbar (desktop only; mobile uses top bar + bottom nav below) */}
      <LandingHeader />

      <div className="flex-1 flex flex-col justify-between px-4 py-4 pb-20 sm:px-6 sm:py-8 sm:pb-8 lg:px-10">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto pb-3 mb-2 border-b border-border/60 lg:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              aria-label={isEn ? "Go back" : "Kembali"}
              className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
              <ArrowLeft className="size-4" />
            </button>
            <Link href="/" className="flex items-center">
              <Image
                src="/logo2.png"
                alt="Webjoz logo"
                width={100}
                height={60}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/help"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-1 py-1"
              title={t("landing.navHelp")}
            >
              <svg className="size-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              <span>{t("landing.navHelp")}</span>
            </Link>
            <div className="h-3 w-px bg-border/60" />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Center Main Content */}
        <div className="flex-1 flex flex-col justify-center my-auto w-full max-w-md mx-auto lg:max-w-6xl lg:grid lg:grid-cols-[1fr_0.9fr] lg:gap-8 lg:items-center">
          <div className="hidden space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 lg:block">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="w-fit px-4 py-1.5 border-primary/20 bg-primary/5 text-primary tracking-widest"
              >
                {badge}
              </Badge>
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tighter text-balance text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {description}
            </p>

            {stats.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {stats.map((item) => (
                  <SubtleStat key={`${item.label}-${item.value}`} label={item.label} value={item.value} helper={item.helper} />
                ))}
              </div>
            ) : null}
          </div>

          <Card className="bg-card/90 backdrop-blur shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 border-border/70 overflow-hidden">
            <CardHeader className="border-b border-border/60 bg-background px-5 py-5 sm:px-6">
              {cardEyebrow && <CardDescription className="text-xs uppercase tracking-wider font-semibold text-primary/80 mb-0.5">{cardEyebrow}</CardDescription>}
              <CardTitle>{cardTitle}</CardTitle>
              <CardDescription>{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pt-5 sm:px-6 sm:pt-6">
              {children}
              <div className="mt-5 text-sm text-muted-foreground sm:mt-6">
                {footer || <Link href="/" className="font-medium text-primary hover:opacity-80">{isEn ? "← Back to Home" : "← Kembali ke Beranda"}</Link>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Mobile Bottom Navigation Bar — theme-aware ─────────────────────── */}
        <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-background/95 backdrop-blur-2xl border-t border-border px-3 py-2 pb-3">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 transition-all text-[11px] font-medium py-1 px-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Home className="size-4.5" />
              <span>{t("landing.bottomNavHome")}</span>
            </Link>

            <Link
              href="/login"
              className={cn(
                "flex flex-col items-center gap-1 transition-all text-[11px] font-medium py-1 px-3 rounded-xl",
                pathname === "/login"
                  ? "text-primary font-bold bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <LogIn className="size-4.5" />
              <span>{isEn ? "Login" : "Masuk"}</span>
            </Link>

            <Link
              href="/register"
              className={cn(
                "flex flex-col items-center gap-1 transition-all text-[11px] font-medium py-1 px-3 rounded-xl",
                pathname === "/register"
                  ? "text-primary font-bold bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <UserPlus className="size-4.5" />
              <span>{isEn ? "Sign Up" : "Daftar"}</span>
            </Link>

            <Link
              href="/forgot-password"
              className={cn(
                "flex flex-col items-center gap-1 transition-all text-[11px] font-medium py-1 px-2 rounded-xl",
                pathname === "/forgot-password"
                  ? "text-primary font-bold bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <KeyRound className="size-4.5" />
              <span>{isEn ? "Forgot Pwd" : "Lupa Sandi"}</span>
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}