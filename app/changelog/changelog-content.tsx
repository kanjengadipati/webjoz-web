"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Bug,
  Zap,
  Megaphone,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type ChangeType = "feature" | "fix" | "improvement" | "announcement";

interface ChangelogEntry {
  version: string;
  date: string;
  tag?: string;
  type: ChangeType;
  title: string;
  description: string;
}

const TYPE_META: Record<
  ChangeType,
  { label: string; icon: typeof Sparkles; color: string; bg: string }
> = {
  feature: {
    label: "Fitur Baru",
    icon: Sparkles,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  fix: {
    label: "Perbaikan",
    icon: Bug,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
  },
  improvement: {
    label: "Peningkatan",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  announcement: {
    label: "Pengumuman",
    icon: Megaphone,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
  },
};

const CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.4.0",
    date: "2026-08-18",
    tag: "Terbaru",
    type: "feature",
    title: "Help Center & Pusat Bantuan",
    description:
      "Halaman bantuan baru dengan pencarian FAQ, kategori topik, dan kontak langsung via email atau WhatsApp.",
  },
  {
    version: "2.4.0",
    date: "2026-08-18",
    type: "feature",
    title: "Halaman Changelog",
    description:
      "Halaman ini sendiri — lihat semua pembaruan Webjoz di satu tempat.",
  },
  {
    version: "2.4.0",
    date: "2026-08-18",
    type: "feature",
    title: "Halaman Usage Dashboard",
    description:
      "Pantau penggunaan kuota website, AI generate, dan regenerasi section secara real-time dari dashboard.",
  },
  {
    version: "2.3.0",
    date: "2026-07-20",
    type: "feature",
    title: "Blog Manager & Blog Layouts",
    description:
      "Kelola blog langsung dari dashboard — tulis, generate dengan AI, dan publish. Pilih dari 4 layout: grid, list, featured, dan minimal.",
  },
  {
    version: "2.3.0",
    date: "2026-07-20",
    type: "improvement",
    title: "Percepatan AI Generate",
    description:
      "Optimasi prompt dan caching section mengurangi waktu generate hingga 40% lebih cepat.",
  },
  {
    version: "2.3.0",
    date: "2026-07-20",
    type: "fix",
    title: "Perbaikan Domain Connection",
    description:
      "Memperbaiki bug verifikasi DNS yang kadang gagal pada provider tertentu. CNAME propagation sekarang lebih reliable.",
  },
  {
    version: "2.2.0",
    date: "2026-06-25",
    type: "feature",
    title: "Lead Capture & Management",
    description:
      "Form kontak otomatis mengumpulkan leads dari website Anda. Lihat, balas, dan export leads langsung dari dashboard.",
  },
  {
    version: "2.2.0",
    date: "2026-06-25",
    type: "improvement",
    title: "Analytics Dashboard yang Ditingkatkan",
    description:
      "Tampilan analytics baru dengan grafik traffic harian, halaman terpopuler, dan sumber traffic yang lebih informatif.",
  },
  {
    version: "2.1.0",
    date: "2026-06-01",
    type: "feature",
    title: "Custom Domain",
    description:
      "Hubungkan domain sendiri ke website Webjoz. Panduan DNS setup otomatis dan verifikasi real-time.",
  },
  {
    version: "2.1.0",
    date: "2026-06-01",
    type: "feature",
    title: "Domain Purchase",
    description:
      "Beli domain baru langsung dari dashboard — pencarian, cek ketersediaan, dan registrasi dalam satu langkah.",
  },
  {
    version: "2.0.0",
    date: "2026-05-01",
    tag: "Major",
    type: "announcement",
    title: "Webjoz v2.0 — AI Website Builder",
    description:
      "Peluncuran besar platform Webjoz: AI website generator, 6 template premium, wizard percakapan, SEO optimization, dan payment gateway Midtrans + PayPal.",
  },
  {
    version: "2.0.0",
    date: "2026-05-01",
    type: "feature",
    title: "AI Website Wizard",
    description:
      "Deskripsikan bisnis Anda dalam percakapan — AI akan generate website lengkap dengan konten, desain, dan struktur halaman.",
  },
  {
    version: "2.0.0",
    date: "2026-05-01",
    type: "feature",
    title: "6 Template Premium",
    description:
      "Pilih dari 6 template: Bold, Produk, Jasa, Kuliner, Elegant, Natural — masing-masing dengan gaya unik dan fully customizable.",
  },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ChangelogContent() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<ChangeType | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return CHANGELOG.filter((entry) => {
      if (activeType && entry.type !== activeType) return false;
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.version.includes(q)
      );
    });
  }, [query, activeType]);

  const groupedByDate = useMemo(() => {
    const groups: { date: string; entries: ChangelogEntry[] }[] = [];
    let currentDate = "";
    for (const entry of filtered) {
      if (entry.date !== currentDate) {
        currentDate = entry.date;
        groups.push({ date: entry.date, entries: [] });
      }
      groups[groups.length - 1].entries.push(entry);
    }
    return groups;
  }, [filtered]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition mb-8 inline-block"
        >
          ← Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Megaphone className="size-3.5" />
            Changelog
          </div>
          <h1 className="text-3xl font-bold mb-2">Apa yang Baru</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Semua pembaruan, fitur baru, dan perbaikan dari Webjoz.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari pembaruan... (contoh: domain, analytics, blog)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveType(null);
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

        {/* Type filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveType(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
              !activeType
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card/40 text-muted-foreground border-border/60 hover:border-border"
            }`}
          >
            Semua
          </button>
          {(Object.keys(TYPE_META) as ChangeType[]).map((type) => {
            const meta = TYPE_META[type];
            const Icon = meta.icon;
            return (
              <button
                key={type}
                onClick={() =>
                  setActiveType(activeType === type ? null : type)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                  activeType === type
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/40 text-muted-foreground border-border/60 hover:border-border"
                }`}
              >
                <Icon className="size-3 inline-block mr-1" />
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/60" />

          {groupedByDate.map((group) => (
            <div key={group.date} className="mb-8 last:mb-0">
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center z-10">
                  <span className="text-[10px] font-bold text-primary leading-none text-center">
                    {new Date(group.date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-foreground">
                  {formatDate(group.date)}
                </h2>
              </div>

              {/* Entries */}
              <div className="space-y-3 ml-[19px] pl-8 border-l border-border/30">
                {group.entries.map((entry) => {
                  const meta = TYPE_META[entry.type];
                  const Icon = meta.icon;
                  const entryId = `${entry.version}-${entry.date}-${entry.title}`;
                  const isExpanded = expandedId === entryId;

                  return (
                    <div
                      key={entryId}
                      className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : entryId)
                        }
                        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-muted/20 transition"
                      >
                        <div
                          className={`shrink-0 mt-0.5 p-1.5 rounded-lg ${meta.bg}`}
                        >
                          <Icon className={`size-3.5 ${meta.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-muted-foreground/70">
                              v{entry.version}
                            </span>
                            {entry.tag && (
                              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                                {entry.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold mt-0.5">
                            {entry.title}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="size-4 text-muted-foreground shrink-0 mt-1" />
                        ) : (
                          <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3 ml-11">
                          {entry.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="size-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Tidak ada pembaruan untuk &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Coba kata kunci lain atau lihat semua pembaruan.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
