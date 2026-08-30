"use client";

import React, { useRef, useEffect, useState } from "react";
import { TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { TEMPLATE_DEFAULT_DESIGN_TOKENS } from "@/lib/template-defaults";
import { SHOWCASE_ITEMS, TEMPLATE_PREFILL_MAP } from "@/lib/landing-showcase-data";
import { fetchDesignTokenLibrary, type DesignTokenLibraryItem } from "@/lib/design-token-library";
import { scoreDesignToken } from "@/lib/design-token-score";
import { useI18n } from "@/lib/i18n/context";
import type { DesignToken } from "@/lib/template-registry";

const DYNAMIC_SHOWCASE_TOKEN: DesignToken = {
  palette: {
    primary: "#7C3AED",
    accent: "#A78BFA",
    background: "#0F0A1E",
    surface: "#1A1330",
    text: "#F5F3FF",
  },
  typography: {
    heading_font: "Inter",
    body_font: "Inter",
    heading_weight: "700",
    heading_size_hero: "3rem",
  },
  layout: {
    hero_style: "centered",
    corner_radius: "soft",
    section_spacing: "normal",
    section_order: ["hero", "benefits", "about", "testimonials", "cta", "faq", "contact"],
  },
  mood: "professional",
};

function getDesignToken(templateId: string): DesignToken {
  if (templateId === "TEMPLATE_DYNAMIC") return DYNAMIC_SHOWCASE_TOKEN;
  return (TEMPLATE_DEFAULT_DESIGN_TOKENS[templateId] || TEMPLATE_DEFAULT_DESIGN_TOKENS.TEMPLATE_DYNAMIC)!;
}

function TemplatePreview({
  templateId,
  content,
  designToken,
  scaleBase = 1280,
  scrollable = false,
}: {
  templateId: string;
  content: any;
  designToken: DesignToken;
  scaleBase?: number;
  scrollable?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const [innerHeight, setInnerHeight] = useState(0);
  const TemplateComponent = TEMPLATE_REGISTRY.find((t) => t.id === templateId)?.component;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !TemplateComponent) return;
    const update = () => {
      const s = el.offsetWidth / scaleBase;
      setScale(s);
      // Scrollable mode: container height = tinggi layout asli × scale, supaya
      // area scroll tepat setinggi tampilan yang ter-skalakan (bukan tinggi layout
      // yang belum di-scale = ribuan px dengan ruang kosong besar di bawah).
      if (scrollable && innerRef.current) setInnerHeight(innerRef.current.offsetHeight);
    };
    const obs = new ResizeObserver(update);
    obs.observe(el);
    update();
    return () => obs.disconnect();
  }, [TemplateComponent, scaleBase, scrollable]);

  if (!TemplateComponent) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-white ${scrollable ? "overflow-visible" : "h-full overflow-hidden"}`}
      style={scrollable ? { height: Math.round(innerHeight * scale) } : undefined}
    >
      <div
        ref={innerRef}
        style={{
          width: scaleBase,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <TemplateComponent content={content} design_token={designToken} isEditorMode={false} />
      </div>
    </div>
  );
}

/* ── Gallery item ───────────────────────────────────────────────────────── */
type ShowcaseItem = (typeof SHOWCASE_ITEMS)[number];
type GalleryItem = DesignTokenLibraryItem & { sample: ShowcaseItem };

// Kurasi statis: selalu tampilkan 18 SHOWCARE_ITEMS (konten + template + nama
// bisnis bervariasi), lalu warnai preview tiap kartu dengan design token dari
// library. Token dan kartu diurutkan berdasarkan skor estetika AI (null di
// akhir) supaya kartu paling bagus tampil di depan; tie-break memakai skor
// desain. Bila API kosong, pakai default token template masing-masing.
function buildCuratedGalleryItems(tokens: DesignTokenLibraryItem[]): GalleryItem[] {
  const byAesthetic = (a: DesignTokenLibraryItem, b: DesignTokenLibraryItem) =>
    (b.aesthetic_score ?? -1) - (a.aesthetic_score ?? -1) ||
    (b.score ?? 0) - (a.score ?? 0);
  const ordered = [...tokens].sort(byAesthetic);
  const items = SHOWCASE_ITEMS.map((s, i) => {
    const preferred = TEMPLATE_PREFILL_MAP[s.templateId]?.businessSubType || s.businessType;
    const token =
      ordered.find((t) => t.business_type?.toLowerCase() === preferred.toLowerCase()) ||
      ordered[i % Math.max(ordered.length, 1)];
    const dt = token?.design_token || getDesignToken(s.templateId);
    return {
      id: i + 1,
      source_template_id: s.templateId,
      business_type: preferred,
      mood: dt.mood ?? "",
      design_token: dt,
      score: scoreDesignToken(dt).total,
      aesthetic_score: token?.aesthetic_score ?? null,
      created_at: token?.created_at ?? "",
      sample: s,
    };
  });
  return items.sort(byAesthetic);
}

function galleryScore(item: GalleryItem): number {
  return item.score ?? scoreDesignToken(item.design_token).total;
}

// Badge kategori: untuk sample template khusus (bukan AI dynamic) tampilkan
// kategori template-nya, untuk AI dynamic tampilkan jenis bisnis aslinya.
function badgeLabel(item: GalleryItem): string {
  if (item.sample.templateId === "TEMPLATE_DYNAMIC") return item.business_type;
  return TEMPLATE_REGISTRY.find((t) => t.id === item.sample.templateId)?.category || item.business_type;
}

/* ── Preview Modal ──────────────────────────────────────────────────────── */
function PreviewModal({
  item,
  onClose,
  onStart,
  t,
}: {
  item: GalleryItem;
  onClose: () => void;
  onStart: (item: GalleryItem) => void;
  t: (key: string, fallback?: string) => string;
}) {
  const templateDef = TEMPLATE_REGISTRY.find((td) => td.id === item.sample.templateId);
  const token = item.design_token;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ animation: "backdropIn 0.2s ease both" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 flex flex-col lg:flex-row w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden border border-white/15 bg-[#0d0e12] shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
        style={{ animation: "modalIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* ── Preview area (scrollable) ── */}
        <div className="flex-1 overflow-y-auto bg-white min-h-[320px] lg:min-h-0 relative">
          <TemplatePreview
            templateId={item.sample.templateId}
            content={item.sample.content}
            designToken={token}
            scaleBase={1280}
            scrollable
          />
        </div>

        {/* ── Sidebar info ── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col p-6 gap-5 border-t lg:border-t-0 lg:border-l border-white/10">
          {/* Header */}
          <div>
            {templateDef?.category && (
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                {templateDef.category}
              </span>
            )}
            <h3 className="text-lg font-bold text-white mt-1 leading-snug">
              {item.sample.businessName}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {item.business_type} · {item.mood}
            </p>
          </div>

          {/* Tags */}
          {templateDef?.tags && templateDef.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {templateDef.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-[11px] bg-white/[0.06] border border-white/10 text-slate-300 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Features */}
          <div className="space-y-2">
            {[
              "Desain profesional siap pakai",
              "SEO teroptimasi",
              "Mobile responsive",
              "Domain sendiri",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {f}
              </div>
            ))}
          </div>

          <div className="flex-1" />

          {/* CTA */}
          <div className="space-y-2">
            <button
              onClick={() => { onStart(item); onClose(); }}
              className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm py-3 transition-all active:scale-95 shadow-[0_4px_20px_rgba(251,191,36,0.3)]"
            >
              {t("landing.showcaseCreate", "Buat Website Ini")} →
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-white/10 bg-muted/50 hover:bg-white/[0.08] text-slate-400 hover:text-white font-medium text-sm py-2.5 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export function LandingTemplateShowcase({ onStart }: { onStart: (item: GalleryItem) => void }) {
  const { t } = useI18n();
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Fetch pool besar, API sudah mengurutkan aesthetic_score DESC → ambil
    // 30 terbaiknya untuk mewarnai kartu. Selama pool belum terisi oleh bulk
    // critique, sisanya diisi token ber-score tinggi sebagai fallback.
    fetchDesignTokenLibrary(100).then((raw) => {
      if (cancelled) return;
      setItems(buildCuratedGalleryItems(raw.length > 30 ? raw.slice(0, 30) : raw));
    });
    return () => { cancelled = true; };
  }, []);

  function ShowcaseCard({
    item,
    height = "h-48",
    showLabel = true,
  }: {
    item: GalleryItem;
    height?: string;
    showLabel?: boolean;
  }) {
    return (
      <div
        className="group relative rounded-2xl border border-white/10 bg-[#111318] overflow-hidden transition-all duration-300 hover:border-border hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-0.5 cursor-pointer"
        onClick={() => setSelected(item)}
      >
        {/* Eye icon on hover */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-border">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-[10px] font-semibold text-white">Lihat Preview</span>
          </div>
        </div>

        {/* Template preview */}
        <div className={`relative ${height} overflow-hidden bg-white`}>
          <TemplatePreview
            templateId={item.sample.templateId}
            content={item.sample.content}
            designToken={item.design_token}
          />
          {/* Category badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="text-[10px] font-semibold bg-black/60 backdrop-blur-sm text-white/80 border border-border px-2 py-0.5 rounded-full">
              {badgeLabel(item)}
            </span>
          </div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#111318] to-transparent pointer-events-none" />
        </div>

        {/* Info bar */}
        {showLabel && (
          <div className="px-3.5 py-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate leading-tight">
                {item.sample.businessName}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {item.business_type}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onStart(item); }}
              className="shrink-0 rounded-full bg-white text-black px-3.5 py-1.5 text-[11px] font-bold transition-all hover:bg-slate-100 active:scale-95"
            >
              {t("landing.showcaseCreate")}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse" aria-hidden>
        <div className="sm:col-span-2 lg:col-span-1 rounded-2xl bg-muted/50 border border-white/10 h-72 sm:h-80 lg:h-[340px]" />
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-muted/50 border border-white/10 h-36 sm:h-40" />
          ))}
        </div>
      </div>
    );
  }

  const featured = items[0];
  const secondary = items.slice(1, 5);
  const rest = items.slice(5);

  return (
    <>
      <div className="space-y-4">
        {/* ── Hero gallery: 1 large + 2×2 small ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured card */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col">
            <div
              className="group relative rounded-2xl border border-white/10 bg-[#111318] overflow-hidden transition-all duration-300 hover:border-border hover:shadow-2xl hover:shadow-black/50 cursor-pointer flex-1"
              onClick={() => setSelected(featured)}
            >
              {/* Eye icon */}
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-border">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className="text-[10px] font-semibold text-white">Lihat Preview</span>
                </div>
              </div>

              <div className="relative h-72 sm:h-80 lg:h-[340px] overflow-hidden bg-white">
                <TemplatePreview
                  templateId={featured.sample.templateId}
                  content={featured.sample.content}
                  designToken={featured.design_token}
                />
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="text-[10px] font-semibold bg-black/60 backdrop-blur-sm text-white/80 border border-border px-2 py-0.5 rounded-full">
                    {badgeLabel(featured)}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#111318] to-transparent pointer-events-none" />
              </div>
              <div className="px-4 py-3.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-base font-bold text-white truncate">{featured.sample.businessName}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {featured.business_type}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onStart(featured); }}
                  className="shrink-0 rounded-full bg-white text-black px-4 py-1.5 text-xs font-bold transition-all hover:bg-slate-100 active:scale-95"
                >
                  {t("landing.showcaseCreate")}
                </button>
              </div>
            </div>
          </div>

          {/* 2×2 smaller cards */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            {secondary.map((item) => (
              <ShowcaseCard key={item.id} item={item} height="h-36 sm:h-40" />
            ))}
          </div>
        </div>

        {/* ── Extra cards revealed by Load More ── */}
        {rest.length > 0 && (
          <div
            className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: showAll ? `${rest.length * 220}px` : "0px",
              opacity: showAll ? 1 : 0,
              transform: showAll ? "translateY(0)" : "translateY(12px)",
            }}
          >
            {rest.map((item) => (
              <ShowcaseCard key={item.id} item={item} height="h-32 sm:h-36" />
            ))}
          </div>
        )}

        {/* ── Load More CTA ── */}
        {!showAll && rest.length > 0 && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-white/10 bg-muted/50 hover:bg-white/[0.08] hover:border-border px-5 py-2.5 rounded-full group"
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                className="transition-transform group-hover:translate-y-0.5"
              >
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t("landing.templatesViewMore", "Lihat lebih banyak contoh website")}
              <span className="text-amber-400">+{rest.length}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Preview Modal ── */}
      {selected && (
        <PreviewModal
          item={selected}
          onClose={() => setSelected(null)}
          onStart={onStart}
          t={t}
        />
      )}
    </>
  );
}
