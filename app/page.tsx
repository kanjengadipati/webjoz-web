"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Template showcase data ───────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "TEMPLATE_JASA02",
    name: "Elevate One",
    category: "Jasa & Konsultan",
    desc: "Template bergaya SaaS premium untuk bisnis jasa, konsultan, dan agency. Trust-first dengan CTA yang kuat.",
    accent: "#38bdf8",
    preview: "service",
  },
  {
    id: "TEMPLATE_PRODUK03",
    name: "Forge Flow",
    category: "Produk & Katalog",
    desc: "Landing page produk bergaya launch page modern. Grid rapi, CTA langsung, cocok untuk retail & UMKM.",
    accent: "#818cf8",
    preview: "catalog",
  },
  {
    id: "TEMPLATE_KULINER01",
    name: "Vista Prime",
    category: "Kuliner & Brand",
    desc: "Template hangat dengan storytelling premium. Ideal untuk kuliner, lifestyle, beauty, dan brand visual.",
    accent: "#fb923c",
    preview: "brand",
    light: true,
  },
];

// ─── How it works steps ────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Isi Profil Bisnis",
    desc: "Masukkan nama, jenis usaha, produk, dan nomor WhatsApp. Hanya sekitar 60 detik.",
    icon: "✏️",
  },
  {
    num: "02",
    title: "Pilih Template Visual",
    desc: "Pilih dari 3 template yang sudah dioptimalkan untuk konversi. Cocok otomatis dengan jenis bisnis Anda.",
    icon: "🎨",
  },
  {
    num: "03",
    title: "AI Tulis Kontennya",
    desc: "AI kami menulis headline, deskripsi layanan, dan CTA secara otomatis dari data bisnis Anda.",
    icon: "⚡",
  },
  {
    num: "04",
    title: "Luncurkan Website",
    desc: "Preview, kustomisasi seperlunya, lalu publish. Website aktif di subdomain Anda dalam hitungan menit.",
    icon: "🚀",
  },
];

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Copywriting Instan",
    desc: "Tidak perlu jago nulis. AI membaca profil bisnis Anda dan menghasilkan konten yang menjual secara otomatis.",
  },
  {
    icon: "🌐",
    title: "Subdomain Langsung Aktif",
    desc: "Setiap website aktif di subdomain Giwangan Studio dalam detik. Hubungkan domain sendiri kapan saja.",
  },
  {
    icon: "📊",
    title: "Dashboard Lengkap",
    desc: "Kelola konten, pantau leads, lihat analitik, dan hubungkan domain kustom — semuanya dalam satu tempat.",
  },
  {
    icon: "📱",
    title: "Mobile-First & Siap Iklan",
    desc: "Setiap template dioptimalkan untuk tampil sempurna di mobile dan siap dipakai untuk kampanye iklan.",
  },
  {
    icon: "🔒",
    title: "Aman & Terstruktur",
    desc: "Autentikasi modern, isolasi data per tenant, dan infrastruktur yang sudah production-ready.",
  },
  {
    icon: "💬",
    title: "WhatsApp CTA Otomatis",
    desc: "Setiap template sudah dilengkapi tombol WhatsApp yang terintegrasi dengan nomor bisnis Anda.",
  },
];

// ─── Template mini preview ─────────────────────────────────────────────────────

function TemplateMiniPreview({ type, light }: { type: string; light?: boolean }) {
  if (type === "service") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[#07111f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_32%)]" />
        <div className="absolute left-5 top-5 h-8 w-24 rounded-full border border-cyan-300/30 bg-cyan-300/10" />
        <div className="absolute left-5 top-18 h-24 w-[56%] rounded-[1.2rem] border border-white/10 bg-white/6" />
        <div className="absolute right-5 top-18 grid w-[28%] gap-2">
          <div className="h-10 rounded-xl border border-white/10 bg-white/6" />
          <div className="h-10 rounded-xl border border-white/10 bg-white/6" />
          <div className="h-10 rounded-xl border border-white/10 bg-white/6" />
        </div>
        <div className="absolute left-5 bottom-5 h-3 w-28 rounded-full bg-white/70" />
        <div className="absolute left-5 bottom-10 h-3 w-36 rounded-full bg-white/25" />
      </div>
    );
  }
  if (type === "catalog") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[#0d1117]">
        <div className="absolute inset-y-0 left-0 w-[42%] bg-[linear-gradient(180deg,#38bdf8,#2563eb)]" />
        <div className="absolute right-5 top-5 h-4 w-24 rounded-full bg-white/80" />
        <div className="absolute right-5 top-14 h-5 w-32 rounded-full bg-white/85" />
        <div className="absolute right-5 top-26 h-3 w-36 rounded-full bg-white/35" />
        <div className="absolute right-5 top-34 grid w-[44%] gap-2">
          <div className="h-9 rounded-xl bg-white/10" />
          <div className="h-9 rounded-xl bg-white/10" />
          <div className="h-9 rounded-xl bg-white/10" />
        </div>
      </div>
    );
  }
  // brand / kuliner
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f8efe7]">
      <div className="absolute inset-x-6 top-5 h-12 rounded-full bg-white/80" />
      <div className="absolute left-6 top-22 h-16 w-[calc(100%-48px)] rounded-[1.4rem] bg-[linear-gradient(135deg,#f3d8c0,#e6a27a)]" />
      <div className="absolute left-6 top-[10rem] h-3 w-24 rounded-full bg-[#8f3d22]" />
      <div className="absolute left-6 top-[12rem] h-3 w-32 rounded-full bg-[#8f3d22]/35" />
      <div className="absolute bottom-5 left-6 right-6 grid grid-cols-2 gap-2">
        <div className="h-12 rounded-[1rem] border border-[#ead5c4] bg-white/90" />
        <div className="h-12 rounded-[1rem] border border-[#ead5c4] bg-white/90" />
      </div>
    </div>
  );
}

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
              alt="Giwangan Studio"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain"
              priority
            />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Giwangan Studio
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
            Isi profil bisnis, pilih template, dan AI akan menulis konten serta menyusun website Anda secara otomatis.{" "}
            <strong className="text-foreground font-semibold">Tanpa coding, tanpa tunggu tim.</strong>
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
            ✅ Gratis dicoba &nbsp;·&nbsp; 🚀 Aktif dalam menit &nbsp;·&nbsp; 📱 Mobile-first & siap iklan
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
                giwanganstudio.com/dashboard/sites/new
              </div>
            </div>
            <div className="grid min-h-[280px] gap-4 p-6 md:grid-cols-2 lg:grid-cols-3 sm:min-h-[320px]">
              {/* Wizard step preview */}
              <div className="col-span-1 flex flex-col gap-3 lg:col-span-1">
                <div className="rounded-2xl border border-primary/20 bg-primary/8 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Langkah 1 — Profil Bisnis</p>
                  <div className="space-y-2">
                    <div className="h-8 rounded-lg bg-background/60 border border-border/40 px-3 flex items-center">
                      <span className="text-xs text-muted-foreground">Nama Bisnis...</span>
                    </div>
                    <div className="h-8 rounded-lg bg-background/60 border border-border/40 px-3 flex items-center">
                      <span className="text-xs text-muted-foreground">Jenis Usaha...</span>
                    </div>
                    <div className="h-16 rounded-lg bg-background/60 border border-border/40 p-3">
                      <span className="text-xs text-muted-foreground">Produk/Layanan Anda...</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Progress</p>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-2 w-1/4 rounded-full bg-primary" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Step 1 of 4</p>
                </div>
              </div>

              {/* AI generation preview */}
              <div className="col-span-1 flex flex-col gap-3 lg:col-span-2">
                <div className="rounded-2xl border border-border/40 bg-card/60 p-4 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">⚡</div>
                    <p className="text-xs font-semibold text-foreground">AI sedang menulis konten...</p>
                    <div className="ml-auto flex gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded-full bg-foreground/10" />
                    <div className="h-3 w-full rounded-full bg-foreground/6" />
                    <div className="h-3 w-5/6 rounded-full bg-foreground/6" />
                    <div className="h-3 w-4/6 rounded-full bg-foreground/6" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="h-20 rounded-xl bg-primary/8 border border-primary/15" />
                    <div className="h-20 rounded-xl bg-foreground/5 border border-border/40" />
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3">
                  <p className="text-xs font-semibold text-emerald-400">✓ Konten siap! Website Anda aktif di subdomain</p>
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
              Dari bisnis ke website dalam{" "}
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
              TEMPLATE SIAP PAKAI
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Pilih yang paling pas{" "}
              <span className="text-primary">untuk bisnis Anda</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              Semua template sudah dioptimalkan untuk konversi, mobile-first, dan siap dipakai untuk kampanye iklan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 shadow-lg transition hover:border-primary/30 hover:shadow-primary/10 hover:shadow-xl"
              >
                {/* Preview */}
                <div className="relative h-56 overflow-hidden rounded-t-[1.8rem]">
                  <TemplateMiniPreview type={tpl.preview} light={tpl.light} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div
                    className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur"
                    style={{ color: tpl.accent }}
                  >
                    {tpl.category}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-xl font-bold text-foreground">{tpl.name}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{tpl.desc}</p>
                  <button
                    onClick={() => startWizard(tpl.id)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-400 transition hover:bg-indigo-600 hover:text-white hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600"
                  >
                    Buat dengan template ini ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => startWizard()}
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition"
            >
              Tidak yakin? Pilih template di wizard →
            </button>
          </div>
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              KENAPA GIWANGAN STUDIO
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
              Mulai gratis sekarang. Tidak perlu kartu kredit, tidak perlu coding — cukup ceritakan bisnis Anda.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => startWizard()}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-indigo-500/35 active:scale-95"
              >
                Mulai Gratis Sekarang ⚡
              </button>
              <a
                href="https://wa.me/6282298870033?text=Halo%20Giwangan%20Studio%2C%20saya%20ingin%20tahu%20lebih%20lanjut."
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
            <Image src="/logo.png" alt="Giwangan Studio" width={24} height={24} className="h-6 w-6 rounded-md object-contain" />
            <span className="text-sm font-semibold text-foreground">Giwangan Studio</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Giwangan Studio. AI Website Builder untuk Bisnis Indonesia.
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
