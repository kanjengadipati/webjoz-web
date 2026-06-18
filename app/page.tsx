"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LandingTemplateShowcase } from "@/components/landing-template-showcase";

// ─── How it works steps ────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Ceritakan Bisnis Anda",
    desc: "Chat singkat dengan AI — nama bisnis, jenis usaha, dan area layanan. Kurang dari 2 menit.",
    icon: "💬",
  },
  {
    num: "02",
    title: "Pilih Mood Visual",
    desc: "Pilih nuansa yang cocok: modern, elegan, playful, atau natural. AI sesuaikan desain otomatis.",
    icon: "🎨",
  },
  {
    num: "03",
    title: "AI Generate Website",
    desc: "Konten, layout, warna, dan template dipilihkan otomatis oleh AI berdasarkan bisnis Anda.",
    icon: "⚡",
  },
  {
    num: "04",
    title: "Luncurkan Sekarang",
    desc: "Review, kustomisasi seperlunya, lalu publish. Website aktif di subdomain Anda dalam hitungan menit.",
    icon: "🚀",
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

  function startWizard(templateId?: string) {
    if (templateId) {
      router.push(`/create?template=${templateId}`);
    } else {
      router.push("/create");
    }
  }

  return (
    <main className="min-h-screen">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Webjoz"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain"
              priority
            />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Webjoz
            </span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
            >
              Masuk
            </Link>
            <button
              onClick={() => startWizard()}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
            >
              Mulai Gratis ⚡
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-32 lg:pt-28">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -right-40 top-32 h-[400px] w-[500px] rounded-full bg-indigo-500/8 blur-[100px]" />
          <div className="absolute -left-20 top-48 h-[300px] w-[400px] rounded-full bg-cyan-500/6 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              AI Website Builder untuk Bisnis Indonesia
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tighter text-balance sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent">
              Website Bisnis
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Siap dalam 5 Menit
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Chat singkat dengan AI, pilih gaya visual, dan website bisnis Anda siap dipublish.{" "}
            <strong className="text-foreground font-semibold">Tanpa coding, tanpa form panjang.</strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => startWizard()}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-indigo-500/35 active:scale-95"
            >
              Buat Website Sekarang ⚡
            </button>
            <a
              href="#templates"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-4 text-base font-semibold text-foreground backdrop-blur transition hover:bg-card hover:border-border/80"
            >
              Lihat Template →
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-muted-foreground">
            ✅ Gratis dicoba &nbsp;·&nbsp; 💬 Chat AI, bukan form &nbsp;·&nbsp; 🚀 Aktif dalam menit
          </p>
        </div>

        {/* Hero mockup */}
        <div className="mx-auto mt-16 max-w-4xl">
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
                  <span className="text-[9px] font-semibold text-emerald-400">✓ Preview siap di kanan →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              CARA KERJANYA
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Dari chat ke website dalam{" "}
              <span className="text-primary">4 langkah</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="absolute top-12 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

            <div className="grid gap-8 md:grid-cols-4 md:gap-6">
              {STEPS.map((step, i) => (
                <div key={step.num} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                  {/* Number circle */}
                  <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-card shadow-xl shadow-primary/5">
                    <div className="text-3xl">{step.icon}</div>
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA under steps */}
          <div className="mt-16 text-center">
            <button
              onClick={() => startWizard()}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500 active:scale-95"
            >
              Coba Sekarang — Gratis ⚡
            </button>
          </div>
        </div>
      </section>

      {/* ── Template Showcase ───────────────────────────────────────────────── */}
      <section id="templates" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              CONTOH HASIL AI
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Website yang dihasilkan{" "}
              <span className="text-primary">untuk berbagai bisnis</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              AI memilih template dan menulis konten secara otomatis. Ini contoh hasil untuk beberapa jenis bisnis.
            </p>
          </div>

          <LandingTemplateShowcase onStart={() => startWizard()} />
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
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
                className="rounded-[1.5rem] border border-border/50 bg-card/60 p-6 transition hover:border-primary/20 hover:bg-card"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-bold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ───────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card/70 to-card/90 p-8 shadow-2xl shadow-primary/8 lg:p-12">
          <div className="grid gap-8 text-center md:grid-cols-3">
            {[
              { value: "< 5 menit", label: "Waktu generate website" },
              { value: "3 template", label: "Siap pakai & teruji konversi" },
              { value: "100%", label: "Self-serve, tanpa coding" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold tracking-tighter text-primary lg:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-background via-card/80 to-primary/5 px-8 py-16 shadow-2xl shadow-primary/5">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[80px]" />
            </div>

            <h2 className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Siap buat website bisnis Anda?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
              Mulai gratis sekarang. Tidak perlu kartu kredit — cukup chat singkat dengan AI dan website Anda siap.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => startWizard()}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-indigo-500/35 active:scale-95"
              >
                Mulai Gratis Sekarang ⚡
              </button>
              <a
                href="https://wa.me/6282298870033?text=Halo%20Webjoz%2C%20saya%20ingin%20tahu%20lebih%20lanjut."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-8 py-4 text-base font-semibold text-foreground backdrop-blur transition hover:bg-card"
              >
                💬 Konsultasi via WhatsApp
              </a>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
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
            © {new Date().getFullYear()} Webjoz. AI Website Builder untuk Bisnis Indonesia.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition">Masuk</Link>
            <a href="https://wa.me/6282298870033" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">Kontak</a>
          </div>
        </div>
      </footer>

      {/* ── Persistent floating CTA (mobile) ──────────────────────────────── */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <button
          onClick={() => startWizard()}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-4 text-sm font-bold text-white shadow-2xl shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
        >
          Buat Website Sekarang ⚡
        </button>
      </div>

    </main>
  );
}
