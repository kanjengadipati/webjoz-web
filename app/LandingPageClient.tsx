"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Button, Card } from "@/components/ui";
import { Check, Loader2 } from "lucide-react";
import { LandingTemplateShowcase } from "@/components/landing-template-showcase";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PricingCards } from "@/components/pricing-cards";
import { TEMPLATE_PREFILL_MAP } from "@/lib/landing-showcase-data";
import { InteractiveMockup } from "@/components/interactive-mockup";
import { useI18n } from "@/lib/i18n/context";
import { useAuthToken, useAuthReady } from "@/lib/auth-store";
import { API_BASE_URL } from "@/lib/config";

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

  function startWizard(templateId?: string) {
    if (!templateId) { router.push("/create"); return; }
    const prefill = TEMPLATE_PREFILL_MAP[templateId];
    if (!prefill) { router.push("/create"); return; }
    router.push(`/create?businessType=${encodeURIComponent(prefill.businessType)}&businessSubType=${encodeURIComponent(prefill.businessSubType)}`);
  }

  return (
    <main className="min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Webjoz",
            "url": "https://webjoz.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://webjoz.com/create?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
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
            "url": "https://webjoz.com",
            "logo": "https://webjoz.com/logo2.png",
            "description": "Platform AI Website Builder untuk bisnis Indonesia. Buat website profesional dalam 5 menit tanpa coding.",
            "areaServed": "Indonesia",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "availableLanguage": "Indonesian",
              "url": "https://wa.me/6285111221044"
            },
            "sameAs": [
              "https://webjoz.com"
            ]
          }),
        }}
      />
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo2.png"
              alt="Webjoz"
              width={120}
              height={72}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="hidden sm:block text-sm font-semibold tracking-tight text-foreground">
              Webjoz
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            {authReady && (
              isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="hidden sm:block rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
                >
                  {t("landing.navDashboard")}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
                >
                  {t("landing.navLogin")}
                </Link>
              )
            )}
            <Button onClick={() => startWizard()} className="rounded-full px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm shadow-lg shadow-primary/20">
              {isLoggedIn ? t("landing.navCreateNew") : t("landing.navStartFree")}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-10 flex items-center justify-center lg:min-h-[calc(100dvh-64px)] lg:py-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10 blur-3xl opacity-50" />

        <div className="mx-auto max-w-7xl w-full grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary shadow-lg shadow-primary/5 px-4 py-2 animate-pulse w-fit"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
              {t("landing.badge")}
            </Badge>

          <h1 className="text-3xl font-bold leading-[1.1] tracking-tighter text-balance bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent sm:text-4xl md:text-6xl lg:text-7xl w-full">
            <span dangerouslySetInnerHTML={{ __html: t("landing.heroTitle") }} />
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
            {t("landing.heroSubtitle")}{" "}
            <strong className="text-foreground font-semibold">{t("landing.heroSubtitleBold")}</strong>
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 w-full">
            <Button
              onClick={() => startWizard()}
              size="lg"
              className="w-full sm:w-auto rounded-full px-10 py-6 text-base font-bold shadow-xl shadow-primary/20"
            >
              {t("landing.ctaPrimary")}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-sm text-muted-foreground w-full">
            <span className="flex items-center gap-1.5">
              <span className="shrink-0">✅</span> {t("landing.tryFree")}
            </span>
            <span className="text-muted-foreground/30 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <span className="shrink-0">💬</span> {t("landing.chatNotForm")}
            </span>
            <span className="text-muted-foreground/30 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <span className="shrink-0">🚀</span> {t("landing.activeInMinutes")}
            </span>
          </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 flex items-center justify-center">
            <InteractiveMockup />
          </div>
        </div>
      </section>

      {/* ── How It Works (Pleco-style numbered cards) ──────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {t("landing.howItWorksSubtitle")}
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              dangerouslySetInnerHTML={{ __html: t("landing.howItWorksTitle") }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group relative rounded-2xl border border-border/50 bg-card/60 p-6 transition hover:border-primary/20 hover:bg-card/80"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {step.num}
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{t(`landing.${step.titleKey}`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`landing.${step.descKey}`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => startWizard()}
              size="lg"
              className="rounded-full px-8 shadow-lg shadow-primary/20"
            >
              {t("landing.howItWorksCta")}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Key Features: Two real feature highlights ──────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {t("landing.featuresEyebrow")}
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              dangerouslySetInnerHTML={{ __html: t("landing.featuresTitle") }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card/70 to-card/90 shadow-2xl shadow-primary/10">
              <div className="p-8 lg:p-10">
                <div className="space-y-5">
                  <Badge variant="outline" className="border-primary/20 bg-background/50 text-primary">
                    {t("landing.dashboardBadge")}
                  </Badge>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight lg:text-3xl">
                      {t("landing.dashboardTitle")}
                    </h3>
                    <p className="text-base leading-7 text-muted-foreground">
                      {t("landing.dashboardDesc")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {translations.landing.dashboardTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card/70 to-card/90 shadow-2xl shadow-primary/10">
              <div className="p-8 lg:p-10">
                <div className="space-y-5">
                  <Badge variant="outline" className="border-primary/20 bg-background/50 text-primary">
                    {t("landing.domainBadge")}
                  </Badge>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight lg:text-3xl">
                      {t("landing.domainTitle")}
                    </h3>
                    <p className="text-base leading-7 text-muted-foreground">
                      {t("landing.domainDesc")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {translations.landing.domainTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
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
      <section id="templates" className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {t("landing.templatesEyebrow")}
            </p>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              dangerouslySetInnerHTML={{ __html: t("landing.templatesTitle") }}
            />
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              {t("landing.templatesDesc")}
            </p>
          </div>

          <LandingTemplateShowcase onStart={(templateId) => startWizard(templateId)} />
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
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
                className="rounded-2xl border border-border/50 bg-card/60 p-6 transition hover:border-primary/20 hover:bg-card"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-bold text-foreground">{t(`landing.${f.titleKey}`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`landing.${f.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner (Pleco-style) ──────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <Card className="border-border/60 bg-gradient-to-br from-background via-card/85 to-primary/5 px-6 py-8 shadow-lg shadow-primary/5 lg:px-8 lg:py-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: t("landing.statsValue1"), label: t("landing.statsLabel1") },
                { value: t("landing.statsValue2"), label: t("landing.statsLabel2") },
                { value: t("landing.statsValue3"), label: t("landing.statsLabel3") },
                { value: t("landing.statsValue4"), label: t("landing.statsLabel4") },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.pricingTitle")}</h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              {t("landing.pricingSubtitle")}
            </p>

            {/* Pricing Cards */}
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
              priceFreeLabel={t("landing.priceFree")}
              priceFreePeriodLabel={t("landing.priceFreePeriod")}
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-[28px] border border-border/40 bg-gradient-to-br from-background via-card/70 to-primary/5 px-8 py-12 shadow-xl shadow-primary/5">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[80px]" />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
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
                className="rounded-full px-10 text-lg font-bold shadow-xl shadow-primary/20"
              >
                {t("landing.ctaBannerCta")}
              </Button>
              <a
                href="https://wa.me/6285111221044?text=Halo%20Webjoz%2C%20saya%20ingin%20tahu%20lebih%20lanjut."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  {t("landing.ctaBannerWhatsapp")}
                </Button>
              </a>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              {t("landing.ctaBannerHelper")}{" "}
              <a
                href="https://wa.me/6285111221044"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                {t("landing.ctaBannerContact")}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/logo2.png" alt="Webjoz" width={80} height={48} className="h-6 w-auto object-contain" />
              <span className="text-sm font-semibold text-foreground">Webjoz</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t("landing.footerCopyright", undefined, { year: String(new Date().getFullYear()) })}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/login" className="hover:text-foreground transition">{t("landing.footerLogin")}</Link>
              <Link href="/contact" className="hover:text-foreground transition">{t("common.contact")}</Link>
            </div>
          </div>
          <div className="border-t border-border/30 pt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground transition">{t("landing.footerPrivacy")}</Link>
            <Link href="/terms" className="hover:text-foreground transition">{t("landing.footerTerms")}</Link>
            <Link href="/refund-policy" className="hover:text-foreground transition">{t("landing.footerRefund")}</Link>
            <Link href="/contact" className="hover:text-foreground transition">{t("landing.footerContact")}</Link>
          </div>
        </div>
      </footer>

      {/* ── Floating CTA (mobile) ──────────────────────────────────────────── */}
      <div className={`fixed bottom-4 left-4 right-4 z-40 md:hidden transition-all duration-300 transform ${showFloatingCta ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
        <div className="flex items-center justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <Button
          onClick={() => startWizard()}
          className="w-full rounded-full py-4 text-sm font-bold shadow-2xl shadow-primary/30"
        >
          {t("landing.ctaFloating")}
        </Button>
      </div>
    </main>
  );
}
