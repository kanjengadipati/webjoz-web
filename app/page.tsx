"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { LandingTemplateShowcase } from "@/components/landing-template-showcase";
import { InteractiveMockup } from "@/components/interactive-mockup";
import { useAuthToken, useAuthReady } from "@/lib/auth-store";

// ─── How it works steps ────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Chat dengan AI",
    desc: "Ceritakan bisnis Anda — nama, jenis usaha, dan area layanan. Cukup ngobrol santai seperti chatting dengan teman.",
  },
  {
    num: "02",
    title: "Pilih Jenis Usaha",
    desc: "Pilih kategori bisnis dari 4 pilihan utama. AI otomatis mencocokkan template terbaik untuk usaha Anda.",
  },
  {
    num: "03",
    title: "AI Generate",
    desc: "Konten, layout, dan desain dibuat otomatis oleh AI. Hasilnya langsung bisa dilihat dalam hitungan detik.",
  },
  {
    num: "04",
    title: "Review & Publikasikan",
    desc: "Edit per section, atur SEO, lalu publish. Website aktif di subdomain Webjoz, bisa hubungkan domain sendiri.",
  },
];

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "🤖",
    title: "Chat AI, Bukan Form",
    desc: "Tidak perlu isi form panjang. Cukup chat dengan AI, semua konten dan desain dibuat otomatis.",
  },
  {
    icon: "🔗",
    title: "Custom Domain",
    desc: "Hubungkan domain sendiri dengan panduan CNAME. Cocok untuk branding profesional perusahaan Anda.",
  },
  {
    icon: "📊",
    title: "Analytics & Leads",
    desc: "Pantau pengunjung website dan kumpulkan leads langsung dari form kontak — semuanya di satu dashboard.",
  },
  {
    icon: "✏️",
    title: "Edit Per Section",
    desc: "Tidak puas dengan bagian tertentu? Regenerate per section dengan AI, atau edit manual di editor.",
  },
  {
    icon: "📄",
    title: "Kustomisasi Penuh",
    desc: "Hero, profil, layanan, testimoni, menu, FAQ, footer, hingga SEO — semua konten bisa diedit dan disesuaikan sendiri kapan saja.",
  },
  {
    icon: "💬",
    title: "WhatsApp Terintegrasi",
    desc: "Tombol WhatsApp otomatis terpasang di setiap website. Pelanggan bisa langsung chat dalam satu klik.",
  },
  {
    icon: "🔍",
    title: "SEO Siap Pakai",
    desc: "Title, description, OG tags, JSON-LD structured data, dan sitemap — semua sudah diurus oleh AI.",
  },
  {
    icon: "🚀",
    title: "Subdomain Instan",
    desc: "Setiap website langsung aktif di subdomain Webjoz. Tidak perlu setup server atau DNS manual.",
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const token = useAuthToken();
  const authReady = useAuthReady();
  const isLoggedIn = authReady && !!token;
  const [showFloatingCta, setShowFloatingCta] = useState(false);

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
    router.push(templateId ? `/create?template=${templateId}` : "/create");
  }

  return (
    <main className="min-h-screen pb-20">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Webjoz"
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg object-contain"
              priority
            />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Webjoz
            </span>
            <Badge variant="outline" className="border-border/60 bg-card/60 text-muted-foreground tracking-wider px-1.5 py-0.5 text-[10px]">
              v1.0
            </Badge>
          </Link>

          <div className="flex items-center gap-3">
            {authReady && (
              isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
                >
                  Login
                </Link>
              )
            )}
            <Button onClick={() => startWizard()} className="rounded-full px-4 py-2 text-sm shadow-lg shadow-primary/20">
              {isLoggedIn ? "Buat Website Baru" : "Mulai Gratis"}
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
              AI Website Builder untuk Bisnis Indonesia
            </Badge>

          <h1 className="text-3xl font-bold leading-[1.1] tracking-tighter text-balance bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent sm:text-4xl md:text-6xl lg:text-7xl w-full">
            Website Bisnis<br />Siap dalam 5 Menit
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
            Chat singkat dengan AI, pilih gaya visual, dan website bisnis Anda siap dipublish.{" "}
            <strong className="text-foreground font-semibold">Tanpa coding, tanpa form panjang.</strong>
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 w-full">
            <Button
              onClick={() => startWizard()}
              size="lg"
              className="w-full sm:w-auto rounded-full px-10 py-6 text-base font-bold shadow-xl shadow-primary/20"
            >
              Buat Website Sekarang
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-sm text-muted-foreground w-full">
            <span className="flex items-center gap-1.5">
              <span className="shrink-0">✅</span> Gratis dicoba
            </span>
            <span className="text-muted-foreground/30 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <span className="shrink-0">💬</span> Chat AI, bukan form
            </span>
            <span className="text-muted-foreground/30 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <span className="shrink-0">🚀</span> Aktif dalam menit
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
              CARA KERJANYA
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Dari chat ke website dalam{" "}
              <span className="text-primary">4 langkah mudah</span>
            </h2>
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
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => startWizard()}
              size="lg"
              className="rounded-full px-8 shadow-lg shadow-primary/20"
            >
              Coba Sekarang &mdash; Gratis
            </Button>
          </div>
        </div>
      </section>

      {/* ── Key Features: Two real feature highlights ──────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              FITUR UNGGULAN
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Lebih dari sekadar{" "}
              <span className="text-primary">website biasa</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card/70 to-card/90 shadow-2xl shadow-primary/10">
              <div className="p-8 lg:p-10">
                <div className="space-y-5">
                  <Badge variant="outline" className="border-primary/20 bg-background/50 text-primary">
                    Dashboard
                  </Badge>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight lg:text-3xl">
                      Pantau & kembangkan bisnis Anda
                    </h3>
                    <p className="text-base leading-7 text-muted-foreground">
                      Dashboard lengkap dengan analytics pengunjung, manajemen leads, dan daftar website dalam satu tempat.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {["Analytics real-time", "Manajemen leads", "Daftar website"].map((tag) => (
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
                    Domain & SEO
                  </Badge>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight lg:text-3xl">
                      Domain sendiri & SEO otomatis
                    </h3>
                    <p className="text-base leading-7 text-muted-foreground">
                      Hubungkan domain custom Anda, SEO title/description, OG tags, JSON-LD, sitemap &mdash; semuanya diurus oleh AI.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {["Custom domain", "SEO otomatis", "Structured data", "Sitemap"].map((tag) => (
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
              CONTOH HASIL AI
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Website yang dihasilkan{" "}
              <span className="text-primary">untuk berbagai bisnis</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              AI memilih template dan menulis konten secara otomatis. Ini contoh hasil untuk beberapa jenis bisnis.
            </p>
          </div>

          <LandingTemplateShowcase onStart={() => startWizard()} />
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              KENAPA WEBJOZ
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Semua yang Anda butuhkan,{" "}
              <span className="text-primary">sudah tersedia</span>
            </h2>
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
                <h3 className="mb-2 font-bold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
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
                { value: "< 5 menit", label: "Waktu generate" },
                { value: "100%", label: "Online otomatis" },
                { value: "8 fitur", label: "Satu dashboard" },
                { value: "AI", label: "Powered" },
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

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-[28px] border border-border/40 bg-gradient-to-br from-background via-card/70 to-primary/5 px-8 py-12 shadow-xl shadow-primary/5">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[80px]" />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Siap buat website bisnis Anda?
              </h2>
              <p className="mx-auto max-w-xl text-base leading-8 text-muted-foreground">
                Mulai gratis sekarang. Tidak perlu kartu kredit &mdash; cukup chat singkat dengan AI dan website Anda siap.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button
                onClick={() => startWizard()}
                size="lg"
                className="rounded-full px-10 text-lg font-bold shadow-xl shadow-primary/20"
              >
                Mulai Gratis Sekarang
              </Button>
              <a
                href="https://wa.me/6282298870033?text=Halo%20Webjoz%2C%20saya%20ingin%20tahu%20lebih%20lanjut."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Konsultasi via WhatsApp
                </Button>
              </a>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Butuh custom design atau company profile?{" "}
              <a
                href="https://wa.me/6282298870033"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Hubungi tim kami
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Webjoz" width={24} height={24} className="h-6 w-6 rounded-md object-contain" />
            <span className="text-sm font-semibold text-foreground">Webjoz</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Webjoz. AI Website Builder untuk Bisnis Indonesia.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition">Login</Link>
            <a href="https://wa.me/6282298870033" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">Kontak</a>
          </div>
        </div>
      </footer>

      {/* ── Floating CTA (mobile) ──────────────────────────────────────────── */}
      <div className={`fixed bottom-4 left-4 right-4 z-40 md:hidden transition-all duration-300 transform ${showFloatingCta ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
        <Button
          onClick={() => startWizard()}
          className="w-full rounded-full py-4 text-sm font-bold shadow-2xl shadow-primary/30"
        >
          Buat Website Sekarang
        </Button>
      </div>
    </main>
  );
}


