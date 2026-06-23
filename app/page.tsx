"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { LandingTemplateShowcase } from "@/components/landing-template-showcase";

// ─── How it works steps ────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Ceritakan Bisnis Anda",
    desc: "Chat singkat dengan AI — nama bisnis, jenis usaha, dan area layanan. Kurang dari 2 menit.",
  },
  {
    num: "02",
    title: "Pilih Mood Visual",
    desc: "Pilih nuansa yang cocok: modern, elegan, playful, atau natural. AI sesuaikan desain otomatis.",
  },
  {
    num: "03",
    title: "AI Generate Website",
    desc: "Konten, layout, warna, dan template dipilihkan otomatis oleh AI berdasarkan bisnis Anda.",
  },
  {
    num: "04",
    title: "Luncurkan Sekarang",
    desc: "Review, kustomisasi seperlunya, lalu publish. Website aktif di subdomain Anda dalam hitungan menit.",
  },
];

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "🤖",
    title: "Chat, Bukan Form",
    desc: "Tidak perlu isi form panjang. Cukup chat singkat dengan AI dan semua konten dibuat otomatis.",
  },
  {
    icon: "🎨",
    title: "Template Auto-Match",
    desc: "AI memilih dan menyesuaikan template berdasarkan jenis bisnis dan mood yang Anda pilih.",
  },
  {
    icon: "🌐",
    title: "Subdomain Langsung Aktif",
    desc: "Setiap website aktif di subdomain Webjoz dalam detik. Hubungkan domain sendiri kapan saja.",
  },
  {
    icon: "📱",
    title: "Mobile-First & Siap Iklan",
    desc: "Setiap template dioptimalkan untuk tampil sempurna di mobile dan siap dipakai untuk kampanye iklan.",
  },
  {
    icon: "✏️",
    title: "Edit Setelah Generate",
    desc: "Tidak puas dengan bagian tertentu? Regenerate per section atau edit langsung di dashboard.",
  },
  {
    icon: "💬",
    title: "WhatsApp CTA Otomatis",
    desc: "Tombol WhatsApp langsung terintegrasi dengan nomor bisnis Anda di setiap template.",
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
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
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
            >
              Masuk
            </Link>
            <Button onClick={() => startWizard()} className="rounded-full px-4 py-2 text-sm shadow-lg shadow-primary/20">
              Mulai Gratis
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

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          <div className="relative rounded-[2rem] border border-border/60 bg-card/40 p-1.5 shadow-[0_40px_120px_rgba(0,0,0,0.2)] backdrop-blur-sm ring-1 ring-white/5">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                <div className="h-3 w-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 rounded-full bg-muted/60 px-4 py-1.5 text-center text-xs text-muted-foreground">
                webjoz.com/create
              </div>
            </div>
            <div className="grid min-h-[280px] gap-0 md:grid-cols-2 sm:min-h-[320px] overflow-hidden rounded-b-[1.8rem]">
              {/* Chat panel */}
              <div className="flex flex-col gap-3 p-5 border-r border-border/30">
                <div className="flex flex-col gap-2.5">
                  {/* AI bubble */}
                  <div className="flex gap-2 items-end">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] shrink-0">✨</div>
                    <div className="rounded-2xl rounded-bl-sm bg-card border border-border/50 px-3 py-2 text-xs text-foreground max-w-[80%]">
                      Halo! Apa nama bisnis Anda?
                    </div>
                  </div>
                  {/* User bubble */}
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-sm bg-primary/15 border border-primary/20 px-3 py-2 text-xs text-foreground max-w-[75%]">
                      Toko Kopi Nusantara
                    </div>
                  </div>
                  {/* AI bubble */}
                  <div className="flex gap-2 items-end">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] shrink-0">✨</div>
                    <div className="rounded-2xl rounded-bl-sm bg-card border border-border/50 px-3 py-2 text-xs text-foreground max-w-[80%]">
                      Nama yang keren! 👍 Sekarang, pilih jenis bisnis Anda:
                    </div>
                  </div>
                  {/* Type chips */}
                  <div className="flex flex-wrap gap-1.5 ml-8">
                    {["Kuliner", "Jasa", "Produk"].map((t, i) => (
                      <div key={t} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold border ${i === 0 ? "bg-primary/15 border-primary/30 text-primary" : "bg-card border-border/50 text-muted-foreground"}`}>{t}</div>
                    ))}
                  </div>
                  {/* Progress */}
                  <div className="mt-1 ml-8">
                    <div className="h-1 rounded-full bg-muted overflow-hidden w-32">
                      <div className="h-1 w-1/3 rounded-full bg-primary" />
                    </div>
                    <p className="mt-1 text-[9px] text-muted-foreground">Langkah 2 dari 5</p>
                  </div>
                </div>
              </div>

              {/* Preview panel */}
              <div className="relative hidden md:block bg-muted/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_50%)]" />
                <div className="absolute left-4 top-4 right-4 h-8 rounded-xl bg-primary/10 border border-primary/20" />
                <div className="absolute left-4 top-16 right-4 h-3 rounded-full bg-foreground/15" />
                <div className="absolute left-4 top-22 right-12 h-3 rounded-full bg-foreground/8" />
                <div className="absolute left-4 top-28 w-20 h-3 rounded-full bg-foreground/8" />
                <div className="absolute left-4 top-36 right-4 grid grid-cols-2 gap-2">
                  <div className="h-14 rounded-xl bg-primary/8 border border-primary/15" />
                  <div className="h-14 rounded-xl bg-foreground/5 border border-border/30" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center px-3">
                  <span className="text-[9px] font-semibold text-emerald-400">✓ Preview siap di kanan &rarr;</span>
                </div>
              </div>
            </div>
          </div>
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
              <span className="text-primary">4 langkah</span>
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

      {/* ── Key Feature: AI Investigator style ──────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card/70 to-card/90 shadow-2xl shadow-primary/10">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-8 lg:p-12 xl:p-14">
                <div className="max-w-2xl space-y-7">
                  <Badge variant="outline" className="border-primary/20 bg-background/50 text-primary">
                    Key Feature
                  </Badge>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold tracking-tighter text-balance lg:text-5xl">
                      <span className="text-primary">AI</span> yang paham bisnis Indonesia.
                    </h2>
                    <p className="text-base leading-8 text-muted-foreground lg:text-lg">
                      Bukan template kaku. AI Webjoz mendengar cerita bisnis Anda, menyesuaikan konten dan desain &mdash; bukan sekadar ganti-ganti warna.
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <SpotlightStat title="Obrolan alami" text="Cukup chat seperti ngobrol dengan teman. AI menggali kebutuhan bisnis Anda." featured />
                    <SpotlightStat title="Desain cerdas" text="Template, font, dan warna dipilih berdasarkan industri dan preferensi visual Anda." />
                    <SpotlightStat title="Langsung online" text="Setelah review, website Anda aktif di subdomain Webjoz dalam hitungan menit." />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/60 px-4 py-4">
                      <Badge className="border-rose-500/20 bg-rose-500/10 text-rose-500 shrink-0">Detected</Badge>
                      <div className="text-sm font-medium">Pelanggan potensial meninggalkan website karena loading lambat dan tidak mobile-friendly.</div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/60 px-4 py-4">
                      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 shrink-0">Recommended</Badge>
                      <div className="text-sm font-medium">Website Webjoz ringan, mobile-first, dan siap diindex Google. Pelanggan tidak akan kabur lagi.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex flex-col justify-center p-8 lg:p-12 xl:p-14 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="rounded-xl border border-border/30 bg-card/60 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-medium text-foreground">AI Mempersiapkan Website Anda...</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {["Menganalisis jenis bisnis", "Memilih template terbaik", "Menulis konten relevan", "Menyiapkan preview"].map((step, i) => (
                      <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[8px] text-primary">{i + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
                { value: "3 template", label: "Siap pakai" },
                { value: "100%", label: "Self-serve" },
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
            <Link href="/login" className="hover:text-foreground transition">Masuk</Link>
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
