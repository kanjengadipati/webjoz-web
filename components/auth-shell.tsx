"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Home, LogIn, UserPlus, KeyRound } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, SubtleStat } from "@/components/ui";
import { LanguageSwitcher } from "@/components/language-switcher";
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
  const { t, locale } = useI18n();
  const isEn = locale === "en";

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 pb-20 sm:px-6 sm:py-10 sm:pb-10 lg:px-10">
      {/* Mobile Top Bar Header with Separator Line */}
      <div className="flex items-center justify-between w-full max-w-md mx-auto pb-3.5 mb-6 border-b border-white/10 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo2.png"
            alt="Webjoz logo"
            width={100}
            height={60}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-2.5">
          <Link
            href="/help"
            className="inline-flex items-center gap-1 text-xs font-medium text-white/70 hover:text-white transition-colors px-1 py-1"
            title={t("landing.navHelp")}
          >
            <svg className="size-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span>{t("landing.navHelp")}</span>
          </Link>
          <div className="h-3 w-px bg-white/15" />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Desktop Top Actions (Bantuan + Language Switcher) */}
      <div className="hidden lg:flex items-center gap-3 absolute top-6 right-6 z-10">
        <Link
          href="/help"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors px-2 py-1"
          title={t("landing.navHelp")}
        >
          <svg className="size-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          <span>{t("landing.navHelp")}</span>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Radial top glow — matches the home hero */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10 blur-3xl opacity-60" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-md items-center gap-8 sm:min-h-[calc(100vh-5rem)] lg:max-w-6xl lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 lg:block">
          {/* Badge — same pulsing primary style as home hero */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo2.png"
              alt="Webjoz logo"
              width={120}
              height={72}
              className="h-9 w-auto object-contain"
              priority
            />
            <Badge
              variant="outline"
              className="w-fit px-4 py-1.5 border-primary/20 bg-primary/5 text-primary tracking-widest animate-pulse"
            >
              {badge}
            </Badge>
          </div>

          {/* Title — gradient clip-text, heavy weight, tight tracking, original sizes */}
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tighter text-balance bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent sm:text-5xl lg:text-6xl">
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

        <Card className="bg-card/90 backdrop-blur shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 border-border/70">
          <CardHeader className="border-b border-border/60 bg-gradient-to-br from-background via-background to-primary/8 px-5 py-5 sm:px-6">
            {cardEyebrow && <CardDescription className="text-xs uppercase tracking-wider font-semibold text-primary/80 mb-0.5">{cardEyebrow}</CardDescription>}
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pt-5 sm:px-6 sm:pt-6">
            {children}
            <div className="hidden sm:block mt-5 text-sm text-muted-foreground sm:mt-6">
              {footer || <Link href="/" className="font-medium text-primary hover:opacity-80">{isEn ? "← Back to Home" : "← Kembali ke Beranda"}</Link>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Mobile Sticky Bottom Navigation Bar (Beranda di paling kiri) ────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#08080a]/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2 pb-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Beranda (Paling Kiri) */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 transition-all text-[11px] font-medium py-1 px-3 rounded-xl text-white/55 hover:text-white hover:bg-white/5"
          >
            <Home className="size-4.5" />
            <span>{t("landing.bottomNavHome")}</span>
          </Link>

          {/* 2. Masuk / Login */}
          <Link
            href="/login"
            className={cn(
              "flex flex-col items-center gap-1 transition-all text-[11px] font-medium py-1 px-3 rounded-xl",
              pathname === "/login"
                ? "text-white font-bold bg-white/10 shadow-inner"
                : "text-white/55 hover:text-white hover:bg-white/5"
            )}
          >
            <LogIn className="size-4.5" />
            <span>{isEn ? "Login" : "Masuk"}</span>
          </Link>

          {/* 3. Daftar */}
          <Link
            href="/register"
            className={cn(
              "flex flex-col items-center gap-1 transition-all text-[11px] font-medium py-1 px-3 rounded-xl",
              pathname === "/register"
                ? "text-white font-bold bg-white/10 shadow-inner"
                : "text-white/55 hover:text-white hover:bg-white/5"
            )}
          >
            <UserPlus className="size-4.5" />
            <span>{isEn ? "Sign Up" : "Daftar"}</span>
          </Link>

          {/* 4. Lupa Password */}
          <Link
            href="/forgot-password"
            className={cn(
              "flex flex-col items-center gap-1 transition-all text-[11px] font-medium py-1 px-2 rounded-xl",
              pathname === "/forgot-password"
                ? "text-white font-bold bg-white/10 shadow-inner"
                : "text-white/55 hover:text-white hover:bg-white/5"
            )}
          >
            <KeyRound className="size-4.5" />
            <span>{isEn ? "Forgot Pwd" : "Lupa Sandi"}</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
