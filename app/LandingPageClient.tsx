"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Badge, Button, Card } from "@/components/ui";
import { Check, Loader2, Zap, ArrowRight, Home, LayoutGrid, Tag, UserCircle } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PricingCards } from "@/components/pricing-cards";
import { prefillForLibraryBusinessType, encodeDesignTokenParam, type DesignTokenLibraryItem } from "@/lib/design-token-library";
import { SparkleIcon } from "@/components/sparkle-icon";
import { useI18n } from "@/lib/i18n/context";
import { useAuthToken, useAuthReady } from "@/lib/auth-store";
import { API_BASE_URL } from "@/lib/config";
import { getWhatsAppUrl } from "@/lib/site-config";

const LandingTemplateShowcase = dynamic(
  () =>
    import("@/components/landing-template-showcase").then(
      (m) => m.LandingTemplateShowcase
    ),
  { ssr: false, loading: () => <ShowcaseSkeleton /> }
);

const InteractiveMockup = dynamic(
  () =>
    import("@/components/interactive-mockup").then((m) => m.InteractiveMockup),
  { ssr: false, loading: () => <MockupSkeleton /> }
);

function MockupSkeleton() {
  return (
    <div className="w-full rounded-[2rem] border border-white/10 bg-card/50 p-1.5 animate-pulse" aria-hidden>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
        <div className="flex gap-1.5">
          {["bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]"].map((c) => (
            <div key={c} className={`h-2.5 w-2.5 rounded-full ${c} opacity-80`} />
          ))}
        </div>
        <div className="flex-1 rounded-full bg-muted/40 h-7" />
      </div>
      <div className="grid md:grid-cols-[1fr_1.1fr] min-h-[260px] md:min-h-[480px]">
        <div className="bg-background/20 min-h-[260px] md:min-h-[480px]" />
        <div className="hidden md:block bg-[#0c0c0e]" />
      </div>
    </div>
  );
}

function ShowcaseSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse" aria-hidden>
      <div className="sm:col-span-2 lg:col-span-1 rounded-2xl bg-white/[0.04] border border-white/10 h-72 sm:h-80 lg:h-[340px]" />
      <div className="sm:col-span-2 grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/10 h-36 sm:h-40" />
        ))}
      </div>
    </div>
  );
}

// ─── How it works steps ────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    titleKey: "step1Title",
    descKey: "step1Desc",
  },
  {
    num: "02",
    titleKey: "step2Title",
    descKey: "step2Desc",
  },
  {
    num: "03",
    titleKey: "step3Title",
    descKey: "step3Desc",
  },
  {
    num: "04",
    titleKey: "step4Title",
    descKey: "step4Desc",
  },
];

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "🤖",
    titleKey: "featureChatTitle",
    descKey: "featureChatDesc",
  },
  {
    icon: "🔗",
    titleKey: "featureDomainTitle",
    descKey: "featureDomainDesc",
  },
  {
    icon: "📊",
    titleKey: "featureAnalyticsTitle",
    descKey: "featureAnalyticsDesc",
  },
  {
    icon: "✏️",
    titleKey: "featureEditTitle",
    descKey: "featureEditDesc",
  },
  {
    icon: "📄",
    titleKey: "featureCustomTitle",
    descKey: "featureCustomDesc",
  },
  {
    icon: "💬",
    titleKey: "featureWaTitle",
    descKey: "featureWaDesc",
  },
  {
    icon: "🔍",
    titleKey: "featureSeoTitle",
    descKey: "featureSeoDesc",
  },
  {
    icon: "🚀",
    titleKey: "featureSubTitle",
    descKey: "featureSubDesc",
  },
  {
    icon: "📦",
    titleKey: "featureCatalogTitle",
    descKey: "featureCatalogDesc",
  },
  {
    icon: "🍽️",
    titleKey: "featureMenuTitle",
    descKey: "featureMenuDesc",
  },
];

// ─── Plan data type ───────────────────────────────────────────────────────────

interface PlanItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  promo_price_monthly: number;
  promo_price_yearly: number;
  promo_duration_months: number;
  promo_label: string;
  max_sites: number;
  max_ai_generates: number;
  max_section_regens: number;
  max_design_regens: number;
  max_members: number;
  max_custom_domain: number;
  features: string;
  active: boolean;
  price_monthly_usd: number;
  price_yearly_usd: number;
  promo_price_monthly_usd: number;
  promo_price_yearly_usd: number;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LandingPageClient() {
  const router = useRouter();
  const token = useAuthToken();
  const authReady = useAuthReady();
  const { t, translations } = useI18n();
  const isLoggedIn = authReady && !!token;
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/plans/public`)
      .then((res) => res.json())
      .then((body) => {
        if (body?.status === "success" && Array.isArray(body?.data)) {
          setPlans(body.data);
        }
      })
      .catch(() => {/* keep empty, will use fallback labels */})
      .finally(() => setPlansLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling past the main hero action button (approx 400px)
      if (window.scrollY > 400) {
        setShowFloatingCta(true);
      } else {
        setShowFloatingCta(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function startWizard(item?: DesignTokenLibraryItem) {
    if (!item) { router.push("/create"); return; }
    const prefill = prefillForLibraryBusinessType(item.business_type);
    const dtParam = encodeDesignTokenParam(item.design_token);
    const params = new URLSearchParams();
    if (prefill.businessType) params.set("businessType", prefill.businessType);
    if (prefill.businessSubType) params.set("businessSubType", prefill.businessSubType);
    if (dtParam) params.set("dt", dtParam);
    router.push(`/create?${params.toString()}`);
  }

  return (
    <main className="min-h-screen pb-20 bg-[#080808] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Webjoz",
            "url": "https://www.webjoz.com"
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Webjoz",
            "url": "https://www.webjoz.com",
            "logo": "https://www.webjoz.com/logo2.png",
            "description": "Platform AI Website Builder untuk bisnis Indonesia. Buat website profesional dalam 5 menit tanpa coding.",
            "areaServed": "Indonesia",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "availableLanguage": "Indonesian",
              "url": getWhatsAppUrl()
            },
            "sameAs": [
              "https://www.webjoz.com"
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Webjoz",
            "operatingSystem": "Web",
            "applicationCategory": "BusinessApplication",
            "description": "AI website builder untuk UMKM dan bisnis Indonesia. Buat website profesional dalam 5 menit tanpa coding.",
            "url": "https://www.webjoz.com",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "IDR",
              "description": "Mulai gratis, upgrade kapan saja"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "120",
              "bestRating": "5"
            }
          }),
        }}
      />
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/80 backdrop-blur-xl">
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

          {/* ── Desktop Center Nav Links (Clean & Simple) ── */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {t("landing.navHowItWorks")}
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {t("landing.navFeatures")}
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {t("landing.navPricing")}
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />

            {/* Pusat Bantuan Header Link (Visible on Mobile & Desktop) */}
            <Link
              href="/help"
              className="inline-flex items-center gap-1 text-xs font-medium text-white/70 hover:text-white transition-colors px-1.5 py-1"
              title={t("landing.navHelp")}
            >
              <svg className="size-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              <span className="hidden xs:inline">{t("landing.navHelp")}</span>
            </Link>

            {authReady && (
              isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-block text-xs font-medium text-white/70 hover:text-white transition-colors px-2 py-1"
                >
                  {t("landing.navDashboard")}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-block text-xs font-medium text-white/70 hover:text-white transition-colors px-2 py-1"
                >
                  {t("landing.navLogin")}
                </Link>
              )
            )}
            <Button onClick={() => startWizard()} className="inline-flex rounded-xl bg-white text-black font-semibold px-4 py-2 text-xs sm:px-5 sm:py-2 text-sm shadow-md hover:bg-slate-200 transition-all cursor-pointer">
              {isLoggedIn ? t("landing.navCreateNew") : t("landing.navStartFree")}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-3 pb-8 sm:pt-6 sm:pb-12 sm:px-6 lg:px-10 flex flex-col items-center justify-center lg:min-h-[calc(100dvh-64px)] lg:py-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl w-full grid gap-4 sm:gap-8 lg:gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Top pill badge */}
            {/* PR Test Banner */}
            <div className="sm:inline-block w-full bg-amber-500/10 border border-amber-500/20 rounded-xl px-6 py-3 mb-6 text-center text-sm text-amber-300">
              <span className="font-medium">⚠️ PR Test Mode</span>
              <span className="ml-2">This is a test page for PRD validation — features may be limited.</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/90 shadow-sm">
              <SparkleIcon className="w-3.5 h-3.5 text-white" />
              <span>{t("landing.badge")}</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-black leading-[1.1] tracking-tight w-full text-foreground">
              <span dangerouslySetInnerHTML={{ __html: t("landing.heroTitle") }} />
            </h1>

            {/* Subtitle */}
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg max-w-xl">
              <span dangerouslySetInnerHTML={{ __html: t("landing.heroSubtitle") }} />
            </p>

            {/* Primary CTA Button */}
            <div className="flex flex-col items-center lg:items-start gap-2.5 w-full pt-0.5 sm:pt-1">
              <Button
                onClick={() => startWizard()}
                size="lg"
                className="w-auto rounded-full bg-white text-black font-extrabold px-7 py-5 sm:px-9 sm:py-6 text-base sm:text-lg shadow-[0_10px_35px_rgba(255,255,255,0.18)] hover:bg-slate-200 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 sm:gap-3 group"
              >
                <SparkleIcon className="size-4 sm:size-4.5 text-black" />
                <span>{t("landing.ctaPrimary")}</span>
                <ArrowRight className="size-4 sm:size-4.5 text-black group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Mobile View: Clean Inline Highlights (Non-Card) */}
            <div className="flex sm:hidden items-center justify-center flex-wrap gap-x-2.5 gap-y-1.5 py-1.5 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[11px] text-white/80">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <Zap className="size-3 text-white shrink-0" />
                <span>{t("landing.tryFree")}</span>
              </div>
              <span className="text-white/25">•</span>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <SparkleIcon className="size-3 text-white shrink-0" />
                <span>{t("landing.chatNotForm")}</span>
              </div>
              <span className="text-white/25">•</span>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <Zap className="size-3 text-white shrink-0" />
                <span>{t("landing.activeInMinutes")}</span>
              </div>
            </div>


            {/* Desktop View: 3-Feature Highlights Cards */}
            <div className="hidden sm:grid grid-cols-3 gap-3 w-full max-w-xl pt-2">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-left">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Zap className="size-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{t("landing.tryFree")}</div>
                  <div className="text-[10px] text-white/50 truncate">{translations.landing.featureFreeCard || "Tanpa daftar di awal"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-left">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <SparkleIcon className="size-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{t("landing.chatNotForm")}</div>
                  <div className="text-[10px] text-white/50 truncate">{translations.landing.featureChatEasy || "Tinggal ketik santai"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-left">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Zap className="size-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{t("landing.activeInMinutes")}</div>
                  <div className="text-[10px] text-white/50 truncate">{translations.landing.featureLiveInstant || "Preview instan & live"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Mockup */}
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 flex flex-col items-center justify-center w-full -mt-2 sm:mt-0">
            <InteractiveMockup />
          </div>
        </div>
      </section>

      {/* ── How It Works (Pleco-style numbered cards) ──────────────────────── */}
      <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-10 max-w-6xl mx-auto scroll-mt-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {t("landing.howItWorksSubtitle")}
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              dangerouslySetInnerHTML={{ __html: t("landing.howItWorksTitle") }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group relative rounded-2xl border border-white/10 bg-[#111318] p-6 transition-all duration-300 hover:border-amber-500/40 hover:bg-[#151720]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-sm font-bold font-mono text-amber-400 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-colors">
                  {step.num}
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">{t(`landing.${step.titleKey}`)}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{t(`landing.${step.descKey}`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => startWizard()}
              size="lg"
              className="rounded-full bg-white text-black font-bold px-8 hover:bg-slate-200 transition-all cursor-pointer"
            >
              {t("landing.howItWorksCta")}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Key Features: Two real feature highlights ──────────────────────── */}
      <section id="features" className="px-4 py-16 sm:px-6 lg:px-10 max-w-6xl mx-auto scroll-mt-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {t("landing.featuresEyebrow")}
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              dangerouslySetInnerHTML={{ __html: t("landing.featuresTitle") }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden border-white/10 bg-[#111318] shadow-2xl">
              <div className="p-8 lg:p-10">
                <div className="space-y-5">
                  <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 font-semibold">
                    {t("landing.dashboardBadge")}
                  </Badge>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight lg:text-3xl text-foreground">
                      {t("landing.dashboardTitle")}
                    </h3>
                    <p className="text-base leading-7 text-muted-foreground">
                      {t("landing.dashboardDesc")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {translations.landing.dashboardTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-white/10 bg-[#111318] shadow-2xl">
              <div className="p-8 lg:p-10">
                <div className="space-y-5">
                  <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 font-semibold">
                    {t("landing.domainBadge")}
                  </Badge>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight lg:text-3xl text-foreground">
                      {t("landing.domainTitle")}
                    </h3>
                    <p className="text-base leading-7 text-muted-foreground">
                      {t("landing.domainDesc")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {translations.landing.domainTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Template Showcase ───────────────────────────────────────────────── */}
      <section id="templates" className="px-4 py-16 sm:px-6 lg:px-10 max-w-6xl mx-auto">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {t("landing.templatesEyebrow")}
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              dangerouslySetInnerHTML={{ __html: t("landing.templatesTitle") }}
            />
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              {t("landing.templatesDesc")}
            </p>
          </div>

          <LandingTemplateShowcase onStart={(item) => startWizard(item)} />
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 max-w-6xl mx-auto">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {t("landing.whyEyebrow")}
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              dangerouslySetInnerHTML={{ __html: t("landing.whyTitle") }}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-[#111318] p-6 transition-all hover:border-white/20 hover:bg-[#151720]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">{t(`landing.${f.titleKey}`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`landing.${f.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner (Pleco-style) ──────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 max-w-5xl mx-auto">
        <div className="mx-auto max-w-5xl">
          <Card className="border-white/10 bg-[#111318] px-6 py-8 shadow-xl lg:px-8 lg:py-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: t("landing.statsValue1"), label: t("landing.statsLabel1") },
                { value: t("landing.statsValue2"), label: t("landing.statsLabel2") },
                { value: t("landing.statsValue3"), label: t("landing.statsLabel3") },
                { value: t("landing.statsValue4"), label: t("landing.statsLabel4") },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold tracking-tight text-white lg:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-4 py-16 sm:px-6 lg:px-10 max-w-5xl mx-auto scroll-mt-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("landing.pricingTitle")}</h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              {t("landing.pricingSubtitle")}
            </p>

            <PricingCards
              plans={plans}
              loading={plansLoading}
              billingCycle={billingCycle}
              onCycleChange={setBillingCycle}
              onSelectPlan={(plan) => {
                if (plan.slug === "free") {
                  startWizard();
                } else {
                  router.push("/dashboard/upgrade");
                }
              }}
              monthlyLabel={t("landing.monthly")}
              yearlyLabel={t("landing.yearly")}
              saveBadgeLabel={t("landing.saveBadge")}
              saveText={t("landing.saveText")}
              popularBadgeLabel={t("landing.popularBadge")}
              activeBadgeLabel={t("landing.activeBadge")}
              priceFreeLabel={t("landing.priceFree")}
              priceFreePeriodLabel={t("landing.priceFreePeriod")}
              freePlanButtonLabel={t("landing.startFree")}
              choosePlanLabel={t("landing.choosePlan")}
              promoLabel={t("landing.promo")}
              perYearLabel={t("landing.perYear")}
              monthlyEqLabel={t("landing.monthlyEq")}
              yearlySavingsLabel={t("landing.yearlySavings")}
              perMonthLabel={t("landing.perMonth")}
              perYearShortLabel={t("landing.perYear2")}
              websiteCountLabel={t("landing.websiteCount")}
              aiGenerateLabel={t("landing.aiGenerate")}
              aiRegenLabel={t("landing.aiRegen")}
              aiDesignLabel={t("landing.aiDesign")}
              noCustomDomainLabel={t("landing.noCustomDomain")}
              customDomainLabel={t("landing.customDomainFeature")}
              customDomainSubtext={t("landing.customDomainSubtext")}
              seoLabel={t("landing.seoBooster")}
              subdomainLabel={t("landing.subdomainFeature")}
              hostingLabel={t("landing.hostingFeature")}
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 max-w-4xl mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#14161f] via-[#111318] to-[#0d0e12] px-8 py-12 shadow-2xl">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[90px]" />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {t("landing.ctaBannerTitle")}
              </h2>
              <p className="mx-auto max-w-xl text-base leading-8 text-muted-foreground">
                {t("landing.ctaBannerDesc")}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button
                onClick={() => startWizard()}
                size="lg"
                className="rounded-full bg-white text-black font-bold px-10 py-6 text-base shadow-xl hover:bg-slate-200 transition-all cursor-pointer"
              >
                {t("landing.ctaBannerCta")}
              </Button>
              <a
                href={getWhatsAppUrl("Halo Webjoz, saya ingin tahu lebih lanjut.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="rounded-full border-white/15 bg-white/[0.04] text-slate-200 font-semibold px-8 py-6 text-base hover:border-white/30">
                  {t("landing.ctaBannerWhatsapp")}
                </Button>
              </a>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              {t("landing.ctaBannerHelper")}{" "}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline-offset-4 hover:underline font-semibold"
              >
                {t("landing.ctaBannerContact")}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8 bg-[#080808]">
        <div className="mx-auto max-w-6xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/logo2.png" alt="Webjoz" width={80} height={48} className="h-6 w-auto object-contain" />
              <span className="text-sm font-semibold text-white">Webjoz</span>
            </div>
            <p className="text-xs text-slate-400 text-center">
              {t("landing.footerCopyright", undefined, { year: String(new Date().getFullYear()) })}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <Link href="/blog" className="hover:text-white transition">{t("landing.footerBlog")}</Link>
              <Link href="/login" className="hover:text-white transition">{t("landing.footerLogin")}</Link>
              <Link href="/contact" className="hover:text-white transition">{t("common.contact")}</Link>
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
            <Link href="/help" className="hover:text-white transition">{t("landing.footerHelp")}</Link>
            <Link href="/changelog" className="hover:text-white transition">{t("landing.footerChangelog")}</Link>
            <Link href="/privacy-policy" className="hover:text-white transition">{t("landing.footerPrivacy")}</Link>
            <Link href="/terms" className="hover:text-white transition">{t("landing.footerTerms")}</Link>
            <Link href="/refund-policy" className="hover:text-white transition">{t("landing.footerRefund")}</Link>
            <Link href="/contact" className="hover:text-white transition">{t("landing.footerContact")}</Link>
          </div>
        </div>
      </footer>

      {/* ── Sticky Mobile Bottom Navigation Bar ────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#08080a]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 pb-2.5">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-white font-semibold text-[10px] min-w-[54px]">
            <Home className="size-5 text-white" />
            <span>{t("landing.bottomNavHome")}</span>
          </Link>
          <a href="#features" className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition text-[10px] min-w-[54px]">
            <Zap className="size-5 text-white/60" />
            <span>{t("landing.bottomNavFeatures")}</span>
          </a>

          {/* Center Elevated Action: Gen AI Spark Create */}
          <button
            type="button"
            onClick={() => startWizard()}
            className="flex flex-col items-center -mt-5 group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="size-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_22px_rgba(255,255,255,0.45)] ring-4 ring-[#08080a] group-hover:scale-105 transition-all">
              <SparkleIcon className="size-6 text-black fill-black" />
            </div>
            <span className="text-[10px] font-bold text-white mt-0.5">{t("landing.bottomNavCreate")}</span>
          </button>

          <a href="#pricing" className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition text-[10px] min-w-[54px]">
            <Tag className="size-5 text-white/60" />
            <span>{t("landing.bottomNavPricing")}</span>
          </a>
          <Link href={isLoggedIn ? "/dashboard" : "/login"} className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition text-[10px] min-w-[54px]">
            <UserCircle className="size-5 text-white/60" />
            <span>{t("landing.bottomNavAccount")}</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
