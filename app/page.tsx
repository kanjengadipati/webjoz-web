import Link from "next/link";
import Image from "next/image";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, SubtleStat } from "@/components/ui";
import { AIPreview } from "@/components/ai-preview";
import { API_DOCS_URL } from "@/lib/config";

import { HealthPing } from "@/components/health-ping";

const categories = [
  {
    title: "Identity & Access",
    description: "Robust authentication foundation with modern standards.",
    features: [
      "Passwordless Sign-In (WhatsApp & Email OTP codes)",
      "Frictionless Magic Links for instant onboarding",
      "Social Login (Google, Facebook, Apple) out-of-the-box",
      "JWT Auth with Access & Refresh token rotation",
      "Advanced Session Control & Revocation",
    ]
  },
  {
    title: "Security & Governance",
    description: "Enterprise-grade control and transparency.",
    features: [
      "Granular RBAC with real-time permission toggles",
      "Detailed Audit Logs with IP and User Agent metadata",
      "Device-level Session Control with instant revocation",
      "Automated Rate Limiting and brute-force safeguards",
      "Comprehensive Security Headers and CORS controls",
    ]
  },
  {
    title: "AI Intelligence",
    description: "Next-gen security analysis powered by LLMs.",
    features: [
      "AI-powered Audit Log Investigator for narrative summaries",
      "Deep anomaly clustering and brute-force pattern recognition",
      "Seamless multi-provider support (Gemini, OpenAI, Ollama)",
      "Interactive dashboard for manual and auto review options",
      "Persistent case history archive for compliance & security audits",
    ]
  },
  {
    title: "Cloud Native Flow",
    description: "Developer-first infrastructure and DX.",
    features: [
      "Ultra-fast Go backend architecture built with Gin & GORM",
      "Multi-database compatibility (PostgreSQL, MySQL, SQLite)",
      "Redis integration for high-speed caching & rate-limit state",
      "Multi-container Docker Compose config with Nginx proxy setup",
      "Live interactive OpenAPI 3.0 (Swagger) endpoint testing docs",
    ]
  }
];

const INSTALLATION_URL = "https://github.com/pleco-dev/pleco-api/blob/master/INSTALLATION.md";

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      <HealthPing />
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 lg:px-10 lg:pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10 blur-3xl opacity-50" />

        <div className="mx-auto max-w-7xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex justify-center mb-6">
            <a href="https://github.com/kanjengadipati/go-api-starterkit" target="_blank" rel="noopener noreferrer" className="inline-block">
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-primary shadow-lg shadow-primary/5 backdrop-blur transition-colors hover:bg-primary/10 sm:flex-nowrap sm:gap-3">
                <Image
                  src="/logo.png"
                  alt="Pleco logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                  priority
                />
                <div className="text-sm font-semibold tracking-[0.2em] text-foreground/90 uppercase">Pleco Console</div>
                <Badge variant="outline" className="border-primary/20 bg-background/60 text-primary tracking-widest">
                  v1.0
                </Badge>
              </div>
            </a>
          </div>

          <div className="flex justify-center">
            <Link href="/login">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 shadow-md backdrop-blur transition-all hover:bg-emerald-500/25 cursor-pointer">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>New Feature: Passwordless OTP & Magic Links Live</span>
              </div>
            </Link>
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tighter text-balance bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent sm:text-5xl md:text-7xl lg:text-8xl">
            Ship auth.<br />Focus on your product.
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            Production-ready auth featuring passwordless sign-ins, audit visibility, AI-powered investigation, and an operator dashboard your team can use on day one.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-10 py-6 text-base font-bold shadow-xl shadow-primary/20">
                Explore Dashboard
              </Button>
            </Link>
            <a href={API_DOCS_URL} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm" className="rounded-full px-5 text-sm font-semibold text-muted-foreground hover:text-primary">
                View API Docs
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* AI Spotlight */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card/70 to-card/90 shadow-2xl shadow-primary/10">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 lg:p-12 xl:p-14">
              <div className="max-w-2xl space-y-7">
                <Badge variant="outline" className="border-primary/20 bg-background/50 text-primary">
                  Key Feature
                </Badge>
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tighter text-balance lg:text-5xl">
                    AI Investigator turns raw audit trails into an answer.
                  </h2>
                  <p className="text-base leading-8 text-muted-foreground lg:text-lg">
                    Instead of handing operators a wall of logs, Pleco Console clusters suspicious activity, drafts a readable timeline,
                    and surfaces next actions in seconds.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <SpotlightStat title="Readable summary" text="Condenses noisy auth events into a narrative your team can act on." />
                  <SpotlightStat featured title="Signal detection" text="Flags brute-force bursts, odd session changes, and unusual patterns before they disappear into the feed." />
                  <SpotlightStat title="Saved cases" text="Keeps investigation history available for follow-up and audit review." />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/60 px-4 py-4">
                    <Badge className="border-rose-500/20 bg-rose-500/10 text-rose-500">Detected</Badge>
                    <div className="text-sm font-medium">Multiple failed logins clustered from one IP across several accounts.</div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/60 px-4 py-4">
                    <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">Recommended</Badge>
                    <div className="text-sm font-medium">Review active sessions, revoke risky refresh tokens, and confirm operator activity.</div>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/dashboard/investigate">
                    <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">Try AI Investigation</Button>
                  </Link>
                </div>
              </div>
            </div>
            <AIPreview />
          </div>
        </Card>
      </section>

      {/* Feature Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-8 md:grid-cols-2">
          {categories.map((cat, idx) => (
            <Card key={idx} className="group overflow-hidden border-border/40 hover:border-primary/30">
              <CardHeader className="bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    0{idx + 1}
                  </div>
                  <CardTitle className="text-2xl font-bold">{cat.title}</CardTitle>
                </div>
                <CardDescription className="text-base">{cat.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {cat.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 group/item">
                      <div className="mt-2 size-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                      <span className="text-sm text-muted-foreground/90 group-hover/item:text-foreground transition-colors">{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <a href={API_DOCS_URL} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary transition-opacity hover:opacity-80">
                    See more
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats / Quick Summary */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <Card className="border-border/60 bg-gradient-to-br from-background via-card/85 to-primary/5 px-6 py-8 shadow-lg shadow-primary/5 lg:px-8 lg:py-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SubtleStat label="Auth Endpoints" value="15+" helper="Register, login, sessions, recovery" />
            <SubtleStat label="Admin Modules" value="6" helper="Users, roles, permissions, audit, AI" />
            <SubtleStat label="Security" value="Hardened" helper="Rate-limited with secure headers" />
            <SubtleStat label="Stack" value="Modern" helper="Go, Next.js, SQL, Docker" />
          </div>
        </Card>
      </section>

      {/* Tech Stack Callout */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <div className="space-y-8 rounded-[28px] border border-border/40 bg-gradient-to-br from-background via-card/70 to-primary/5 px-8 py-12 shadow-xl shadow-primary/5">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter">Start building in minutes.</h2>
            <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground">
              Install Pleco API, connect it to your backend, and give your team a production-ready auth layer with audit visibility from day one.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 grayscale opacity-50 transition-all duration-500 hover:grayscale-0 hover:opacity-100">
            {["Go", "Gin", "GORM", "PostgreSQL/MySQL", "Next.js", "Tailwind", "Docker"].map(t => (
              <span key={t} className="text-xl font-bold tracking-tighter">{t}</span>
            ))}
          </div>
          <div className="flex justify-center">
            <a href={INSTALLATION_URL} target="_blank" rel="noreferrer">
              <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                Start Building
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function SpotlightStat({ title, text, featured = false }: { title: string; text: string; featured?: boolean }) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 text-left transition-colors",
        featured
          ? "border-primary/30 bg-primary/10 shadow-lg shadow-primary/10"
          : "border-border/40 bg-background/55",
      ].join(" ")}
    >
      <div className={featured ? "text-sm font-semibold tracking-tight text-foreground" : "text-sm font-semibold tracking-tight"}>
        {title}
      </div>
      <div className={featured ? "mt-2 text-sm leading-6 text-foreground/80" : "mt-2 text-sm leading-6 text-muted-foreground"}>
        {text}
      </div>
    </div>
  );
}
