"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronRight, HelpCircle, MessageCircle, Mail, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
  tags?: string[];
}

interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: "getting-started",
    title: "Memulai",
    icon: "🚀",
    items: [
      {
        q: "Apa itu Webjoz?",
        a: "Webjoz adalah platform AI website builder yang membantu Anda membuat website bisnis profesional dalam hitungan menit. Cukup deskripsikan bisnis Anda, pilih template, dan AI kami akan membuatkan website lengkap untuk Anda — tanpa perlu coding.",
      },
      {
        q: "Bagaimana cara membuat website pertama?",
        a: 'Klik "+ Website Baru" di dashboard, lalu ikuti wizard percakapan. Deskripsikan bisnis Anda (jenis usaha, produk/jasa, target pelanggan), pilih template yang sesuai, dan AI akan menggenerate website Anda. Anda bisa langsung publish atau edit terlebih dahulu.',
      },
      {
        q: "Apakah saya perlu bisa coding?",
        a: "Tidak sama sekali. Webjoz dirancang untuk non-technical users. Semua proses pembuatan website dilakukan melalui wizard visual dan AI. Anda cukup menyediakan informasi bisnis Anda.",
      },
      {
        q: "Berapa lama waktu yang dibutuhkan untuk membuat website?",
        a: "Biasanya 3-10 menit tergantung kompleksitas bisnis Anda. AI kami akan generate konten, struktur halaman, dan desain secara otomatis. Anda bisa langsung publish atau melakukan customisasi lebih lanjut.",
      },
    ],
  },
  {
    id: "features",
    title: "Fitur",
    icon: "✨",
    items: [
      {
        q: "Fitur apa saja yang tersedia?",
        a: "Webjoz menyediakan: AI website generator, custom domain, SEO optimization, product catalog, blog, lead capture form, analytics, testimonial collection, dan integrasi WhatsApp. Semua fitur ini sudah termasuk dalam paket Anda.",
      },
      {
        q: "Bisakah saya menggunakan domain sendiri?",
        a: "Ya! Anda bisa menghubungkan custom domain yang sudah Anda miliki, atau membeli domain baru langsung dari dashboard Webjoz. Kami mendukung domain .com, .co.id, .id, dan banyak TLD lainnya.",
      },
      {
        q: "Apakah website saya SEO-friendly?",
        a: "Ya. Setiap website yang dibuat dengan Webjoz sudah dioptimasi untuk SEO — termasuk meta tags, structured data, sitemap, dan responsive design. Anda juga bisa mengatur title, description, dan keywords untuk setiap halaman.",
      },
      {
        q: "Bagaimana cara kerja lead capture?",
        a: "Website Anda akan memiliki form kontak yang otomatis mengumpulkan nama, email, telepon, dan pesan dari pengunjung. Semua leads tersimpan di dashboard dan bisa Anda kelola, balas, atau export.",
      },
      {
        q: "Apakah ada analytics bawaan?",
        a: "Ya. Dashboard analytics menunjukkan total pageviews, traffic per hari, halaman terpopuler, dan sumber traffic. Data ini di-update secara real-time.",
      },
    ],
  },
  {
    id: "plans",
    title: "Paket & Harga",
    icon: "💰",
    items: [
      {
        q: "Paket apa saja yang tersedia?",
        a: "Kami menyediakan paket Free dan Pro. Paket Free memberikan 1 website dengan AI generate terbatas. Paket Pro memberikan lebih banyak website, AI generate unlimited, custom domain, dan fitur premium lainnya.",
      },
      {
        q: "Bagaimana cara upgrade paket?",
        a: 'Klik "Upgrade Paket" di sidebar dashboard, pilih paket yang sesuai, lalu lakukan pembayaran. Kami menerima pembayaran via Midtrans (transfer bank, e-wallet, kartu kredit) dan PayPal.',
      },
      {
        q: "Apakah ada free trial?",
        a: "Paket Free tersedia tanpa batas waktu. Anda bisa mencoba fitur dasar dan membuat 1 website. Jika ingin fitur lengkap, Anda bisa upgrade ke Pro kapan saja.",
      },
      {
        q: "Bagaimana cara menambah kuota AI generate?",
        a: "Kuota AI generate di-reset setiap awal bulan. Jika kuota Anda habis sebelum akhir bulan, Anda bisa upgrade ke paket dengan kuota lebih besar, atau menunggu reset bulanan.",
      },
    ],
  },
  {
    id: "domains",
    title: "Domain",
    icon: "🌐",
    items: [
      {
        q: "Bagaimana cara menghubungkan custom domain?",
        a: 'Buka halaman Website → pilih website → tab "Domain". Masukkan domain Anda, lalu ikuti instruksi DNS setup (tambahkan CNAME record atau A record). DNS akan terverifikasi dalam beberapa menit.',
      },
      {
        q: "Berapa lama verifikasi domain?",
        a: "Biasanya 5-30 menit tergantung provider DNS Anda. Jika lebih lama dari 1 jam, pastikan DNS record sudah benar dan tunggu propagation (bisa hingga 48 jam di kasus ekstrem).",
      },
      {
        q: "Bisakah saya membeli domain dari Webjoz?",
        a: "Ya! Kami menyediakan pencarian dan pembelian domain langsung dari dashboard. Harga domain bervariasi tergantung TLD — mulai dari Rp 100rb/tahun untuk .com.",
      },
    ],
  },
  {
    id: "billing",
    title: "Pembayaran",
    icon: "💳",
    items: [
      {
        q: "Metode pembayaran apa yang diterima?",
        a: "Kami menerima: Transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, DANA, ShopeePay), Kartu Kredit/Debit, dan PayPal untuk pembayaran internasional.",
      },
      {
        q: "Apakah ada refund?",
        a: "Ya, kami menyediakan refund sesuai kebijakan kami. Silakan baca halaman Kebijakan Refund untuk detail lengkap. Umumnya refund diproses dalam 3-7 hari kerja.",
      },
      {
        q: "Bagaimana cara melihat riwayat pembayaran?",
        a: 'Buka Dashboard → Upgrade Paket. Di sana Anda bisa melihat paket aktif Anda. Riwayat transaksi lengkap bisa dilihat di bagian "Billing" di pengaturan.',
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: "🔧",
    items: [
      {
        q: "Website saya tidak muncul di Google, kenapa?",
        a: "Butuh waktu 1-7 hari bagi Google untuk mengindex website baru. Pastikan: (1) Website sudah dipublish, (2) Custom domain sudah terhubung (jika menggunakan), (3) Submit sitemap di Google Search Console.",
      },
      {
        q: "Form kontak tidak mengirim email, bagaimana?",
        a: "Leads dari form kontak tersimpan di dashboard (Website → Leads), bukan dikirim via email. Anda bisa memantau leads langsung di dashboard atau mengaktifkan notifikasi WhatsApp.",
      },
      {
        q: "Website saya lambat, bagaimana cara mengatasinya?",
        a: "Website Webjoz di-host di infrastruktur global kami. Jika lambat, kemungkinan: (1) Gambar terlalu besar — gunakan kompresi, (2) Cache browser — coba hard refresh, (3) CDN propagation — tunggu beberapa jam.",
      },
      {
        q: "Saya lupa password, bagaimana?",
        a: 'Klik "Lupa Password" di halaman login, masukkan email terdaftar, dan ikuti instruksi reset password yang dikirim ke email Anda.',
      },
    ],
  },
];

export default function HelpCenterPage() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q && !activeCategory) return FAQ_DATA;
    return FAQ_DATA.filter((cat) => {
      if (activeCategory && cat.id !== activeCategory) return false;
      if (!q) return true;
      return cat.items.some(
        (item) =>
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    });
  }, [query, activeCategory]);

  const totalResults = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition mb-8 inline-block">
          ← Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <HelpCircle className="size-3.5" />
            Pusat Bantuan
          </div>
          <h1 className="text-3xl font-bold mb-2">Ada yang bisa kami bantu?</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Cari jawaban atas pertanyaan umum atau jelajahi kategori di bawah.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari pertanyaan... (contoh: custom domain, pembayaran, SEO)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveCategory(null);
            }}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border/60 bg-card/40 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition border",
              !activeCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card/40 text-muted-foreground border-border/60 hover:border-border",
            )}
          >
            Semua
          </button>
          {FAQ_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition border",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/40 text-muted-foreground border-border/60 hover:border-border",
              )}
            >
              {cat.icon} {cat.title}
            </button>
          ))}
        </div>

        {/* Results count */}
        {query && (
          <p className="text-xs text-muted-foreground mb-4">
            {totalResults} hasil untuk &ldquo;{query}&rdquo;
          </p>
        )}

        {/* FAQ Items */}
        <div className="space-y-8">
          {filteredCategories.map((cat) => (
            <div key={cat.id}>
              <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                <span>{cat.icon}</span>
                {cat.title}
              </h2>
              <div className="space-y-2">
                {cat.items.map((item) => {
                  const id = `${cat.id}-${item.q}`;
                  const isOpen = openId === id;
                  return (
                    <div
                      key={id}
                      className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenId(isOpen ? null : id)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-muted/20 transition"
                      >
                        <span className="text-sm font-semibold">{item.q}</span>
                        {isOpen ? (
                          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <Search className="size-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Coba kata kunci lain atau hubungi kami langsung.</p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 rounded-2xl border border-border/60 bg-card/40 p-6 text-center">
          <h3 className="text-base font-bold mb-1">Masih belum ketemu jawabannya?</h3>
          <p className="text-sm text-muted-foreground mb-4">Tim support kami siap membantu Anda.</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="mailto:giwanganstudio@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            >
              <Mail className="size-3.5" />
              Email Kami
            </a>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Webjoz%2C%20saya%20butuh%20bantuan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:opacity-90 transition"
            >
              <MessageCircle className="size-3.5" />
              WhatsApp
              <ExternalLink className="size-3 opacity-50" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
