"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Home, HelpCircle, Sparkles, UserPlus, LogIn } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, SubtleStat } from "@/components/ui";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  stats?: Array<{ label: string; value: string; helper?: string }>;
  cardEyebrow: string;
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
  const { t } = useI18n();

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 pb-24 sm:px-6 sm:py-10 sm:pb-10 lg:px-10">
      {/* Mobile Top Bar (Logo + Language Switcher) */}
      <div className="flex items-center justify-between w-full max-w-md mx-auto mb-2 lg:hidden">
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
        <LanguageSwitcher />
      </div>

      {/* Desktop Language Switcher */}
      <div className="hidden lg:block absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      {/* Radial top glow — matches the home hero */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10 blur-3xl opacity-60" />

      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-md items-center gap-8 sm:min-h-[calc(100vh-5rem)] lg:max-w-6xl lg:grid-cols-[1fr_0.9fr]">
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
            <CardDescription>{cardEyebrow}</CardDescription>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pt-5 sm:px-6 sm:pt-6">
            {children}
            <div className="mt-5 text-sm text-muted-foreground sm:mt-6">
              {footer || <Link href="/" className="font-medium text-primary hover:opacity-80">Back to overview</Link>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Mobile First Sticky Bottom Navigation Bar ────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#08080a]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 pb-2.5">
        <div className="flex items-center justify-around">
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition text-[10px] min-w-[54px]"
          >
            <Home className="size-5" />
            <span>{t("landing.bottomNavHome")}</span>
          </Link>

          <Link
            href="/help"
            className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition text-[10px] min-w-[54px]"
          >
            <HelpCircle className="size-5" />
            <span>{t("landing.navHelp")}</span>
          </Link>

          {/* Center Elevated Action: Gen AI Spark Create */}
          <Link
            href="/?start=1"
            className="flex flex-col items-center -mt-5 group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="size-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_22px_rgba(255,255,255,0.45)] ring-4 ring-[#08080a] group-hover:scale-105 transition-all">
              <Sparkles className="size-6 text-black fill-black" />
            </div>
            <span className="text-[10px] font-bold text-white mt-0.5">{t("landing.bottomNavCreate")}</span>
          </Link>

          <Link
            href="/register"
            className={cn(
              "flex flex-col items-center gap-0.5 transition text-[10px] min-w-[54px]",
              pathname === "/register" ? "text-white font-semibold" : "text-white/60 hover:text-white"
            )}
          >
            <UserPlus className="size-5" />
            <span>Daftar</span>
          </Link>

          <Link
            href="/login"
            className={cn(
              "flex flex-col items-center gap-0.5 transition text-[10px] min-w-[54px]",
              pathname === "/login" ? "text-white font-semibold" : "text-white/60 hover:text-white"
            )}
          >
            <LogIn className="size-5" />
            <span>Login</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
