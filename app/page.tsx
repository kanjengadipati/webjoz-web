import Link from "next/link";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, SubtleStat, SectionTitle } from "@/components/ui";
import { AIPreview } from "@/components/ai-preview";
import { API_DOCS_URL } from "@/lib/config";

const categories = [
  {
    title: "Identity & Access",
    description: "Robust authentication foundation with modern standards.",
    features: [
      "JWT Auth with Access & Refresh token rotation",
      "Social Login (Google, Facebook, Apple)",
      "Advanced Session Management & Revocation",
      "Email Verification & Password Recovery flows",
      "Secure Profile & Password Management"
    ]
  },
  {
    title: "Security & Governance",
    description: "Enterprise-grade control and transparency.",
    features: [
      "Granular RBAC with Permission-based checks",
      "Detailed Audit Trail for all sensitive actions",
      "Built-in Rate Limiting & Security Headers",
      "Admin Dashboard for User & Role management",
      "Request-scoped Structured Logging"
    ]
  },
  {
    title: "AI Intelligence",
    description: "Next-gen security analysis powered by LLMs.",
    features: [
      "AI-powered Audit Log Investigator",
      "Anomaly Detection & Pattern Recognition",
      "Multi-provider support (Gemini, OpenAI, Ollama)",
      "Saved Investigation & Incident History",
      "Context-aware Security Recommendations"
    ]
  },
  {
    title: "Cloud Native Flow",
    description: "Developer-first infrastructure and DX.",
    features: [
      "Modular Go backend with Gin & GORM",
      "Docker-compose setup (Postgres, Redis, Nginx)",
      "OpenAPI 3.0 (Swagger) interactive documentation",
      "Automated DB Migrations & Seed data",
      "Ready for K8s, Render, or Vercel deployment"
    ]
  }
];

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:px-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10 blur-3xl opacity-50" />

        <div className="mx-auto max-w-7xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex justify-center mb-6">
            <a href="https://github.com/kanjengadipati/go-api-starterkit" target="_blank" rel="noopener noreferrer" className="inline-block">
              <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary tracking-widest animate-pulse hover:bg-primary/10 transition-colors cursor-pointer">
                Pleco Console v1.0
              </Badge>
            </a>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent leading-[1.1]">
            Ship auth.<br />Focus on your product.
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            A production-ready foundation with JWT, Social Login, RBAC, Audit Trails, and an AI-powered Investigator.
            Designed for Pleco Go backends and polished Next.js dashboards.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 py-6 text-base font-bold shadow-xl shadow-primary/20">
                Explore Dashboard
              </Button>
            </Link>
            <a href={API_DOCS_URL} target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base font-bold">
                View API Docs
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats / Quick Summary */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SubtleStat label="Auth Endpoints" value="15+" helper="Register, Login, Social, Sessions, Recovery" />
          <SubtleStat label="Admin Modules" value="6" helper="Users, Roles, Permissions, Audit, AI" />
          <SubtleStat label="Security" value="Hardened" helper="Rate-limited, CSP, HSTS, Secure Headers" />
          <SubtleStat label="Stack" value="Modern" helper="Go 1.23, Next.js 16, Tailwind 4, Postgres" />
        </div>
      </section>

      {/* Preview Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <Card className="bg-gradient-to-br from-card/80 via-card/50 to-primary/5 border-primary/20 overflow-hidden shadow-2xl shadow-primary/5">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12 space-y-6">
              <SectionTitle
                eyebrow="Admin Intelligence"
                title="AI Audit Investigator"
              />
              <p className="text-muted-foreground leading-relaxed">
                The investigator turns thousands of audit rows into a readable summary.
                Identify suspicious login clusters, brute-force patterns, or unauthorized access attempts in seconds.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/50">
                  <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">Detected</Badge>
                  <div className="text-sm font-medium">Multiple failed logins from 192.168.1.1</div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/50">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Resolved</Badge>
                  <div className="text-sm font-medium">IP address blocked automatically by rate limiter</div>
                </div>
              </div>
              <div className="pt-6">
                <Link href="/dashboard/investigate">
                  <Button variant="outline" className="rounded-full">Try AI Investigation</Button>
                </Link>
              </div>
            </div>
            <AIPreview />
          </div>
        </Card>
      </section>

      {/* Tech Stack Callout */}
      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-8">Modern Stack. Modular Design.</h2>
        <div className="flex flex-wrap justify-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {["Go", "Gin", "GORM", "PostgreSQL", "Next.js", "Tailwind", "Docker"].map(t => (
            <span key={t} className="text-xl font-bold tracking-tighter">{t}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
