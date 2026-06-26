"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { getTemplate, TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { TEMPLATE_DEFAULT_DESIGN_TOKENS } from "@/lib/template-defaults";
import { MOCK_CONTENT } from "@/lib/mock-content";
import { request, ApiError } from "@/lib/api/client";
import { useAuthToken } from "@/lib/auth-store";
import type { DesignToken } from "@/components/templates/types";

function luminance(hex: string): number {
  const c = hex.replace("#", "");
  if (c.length < 6) return 0;
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(c1: string, c2: string): number {
  const l1 = luminance(c1), l2 = luminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function scoreDesignToken(dt: any): { total: number; parts: { label: string; score: number; max: number }[] } {
  const parts: { label: string; score: number; max: number }[] = [];
  const pal = dt?.palette || {}, typo = dt?.typography || {}, layout = dt?.layout || {};

  const bg = pal.background || "#FFFFFF", text = pal.text || "#000000";
  const cr = contrastRatio(text, bg);
  let acc = Math.min(40, Math.round((cr / 21) * 40));
  const primary = pal.primary || "";
  if (primary && text) { const bcr = contrastRatio(primary, text); if (bcr >= 3) acc = Math.min(40, acc + 5); }
  parts.push({ label: "Aksesibilitas", score: acc, max: 40 });

  let complete = 0;
  for (const k of ["primary", "accent", "background", "surface", "text"]) if (pal[k]) complete++;
  for (const k of ["heading_font", "body_font", "heading_weight", "heading_size_hero"]) if (typo[k]) complete++;
  for (const k of ["section_spacing", "corner_radius"]) if (layout[k]) complete++;
  if (["compact", "normal", "relaxed"].includes(layout.section_spacing)) complete++;
  if (["sharp", "soft", "rounded"].includes(layout.corner_radius)) complete++;
  parts.push({ label: "Kelengkapan", score: Math.min(30, Math.round(complete / 13 * 30)), max: 30 });

  let pq = 0;
  if (pal.primary && pal.accent && pal.primary !== pal.accent) pq += 5;
  if (pal.primary && pal.background && pal.primary !== pal.background) pq += 3;
  if (pal.surface && pal.background && pal.surface !== pal.background) pq += 4;
  if (pal.accent && pal.background && pal.accent !== pal.background) pq += 3;
  const gray = (h: string) => { const hh = h.replace("#",""); if (hh.length<6) return true; const r=parseInt(hh[0]+hh[1],16), g=parseInt(hh[2]+hh[3],16), b=parseInt(hh[4]+hh[5],16); return Math.max(Math.abs(r-g),Math.abs(r-b),Math.abs(g-b))<30; };
  if (primary && pal.accent && !gray(primary) && !gray(pal.accent)) pq += 3;
  if (text && bg) { const bl=luminance(bg), tl=luminance(text); if ((bl>0.5&&tl<0.5)||(bl<0.5&&tl>0.5)) pq += 2; }
  parts.push({ label: "Palet", score: Math.min(20, pq), max: 20 });

  let rd = 0;
  if (typo.heading_font && !["inherit","sans-serif"].includes(typo.heading_font.toLowerCase())) rd += 3;
  if (typo.body_font && !["inherit","serif"].includes(typo.body_font.toLowerCase())) rd += 2;
  if (["300","400","500","600","700","800","900"].includes(typo.heading_weight)) { const w=+typo.heading_weight; rd += w>=700?3: w>=600?2:1; }
  if (typo.heading_size_hero && !typo.heading_size_hero.startsWith("xs") && !typo.heading_size_hero.startsWith("sm")) rd += 2;
  if (typo.heading_font && typo.body_font && typo.heading_font.toLowerCase() !== typo.body_font.toLowerCase()) rd += 1;
  parts.push({ label: "Tipografi", score: Math.min(10, rd), max: 10 });

  return { total: parts.reduce((s, p) => s + p.score, 0), parts };
}

export default function TemplatePreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;
  const seedId = searchParams?.get("seed_id");
  const tpl = getTemplate(id);
  const [authToken] = useAuthToken();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!seedId || !authToken) return;
    if (!window.confirm("Hapus design token seed ini?")) return;
    setDeleting(true);
    try {
      await request(`/ai/templates/${seedId}`, { method: "DELETE" }, authToken);
      localStorage.removeItem("preview_seed_dt");
      router.push("/template-gallery");
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 403) {
        alert("Hanya superadmin yang bisa menghapus design token.");
      } else {
        alert("Gagal menghapus");
      }
      setDeleting(false);
    }
  };

  const dtParam = searchParams?.get("dt");
  const [ready, setReady] = useState(false);
  const [seedDt, setSeedDt] = useState<DesignToken | null>(null);

  useEffect(() => {
    if (dtParam) {
      try { setSeedDt(JSON.parse(atob(dtParam))); setReady(true); return; } catch {}
    }
    const raw = localStorage.getItem("preview_seed_dt");
    if (raw) {
      try { setSeedDt(JSON.parse(raw)); } catch {}
    }
    setReady(true);
  }, [dtParam]);

  const dt = useMemo(() => {
    if (seedDt) return seedDt;
    return (TEMPLATE_DEFAULT_DESIGN_TOKENS[id as keyof typeof TEMPLATE_DEFAULT_DESIGN_TOKENS] ?? null) as DesignToken | null;
  }, [id, seedDt]);

  if (!tpl) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-8">
        <h1 className="text-2xl font-bold">Template tidak ditemukan</h1>
        <p className="text-zinc-500 mt-2">ID: {id}</p>
        <a href="/template-gallery" className="text-blue-400 underline text-sm mt-4 inline-block">Kembali ke gallery</a>
        <div className="mt-4 space-y-1">
          <p className="text-sm text-zinc-500">Template yang tersedia:</p>
          {TEMPLATE_REGISTRY.map((t) => (
            <a key={t.id} href={`/template-gallery/preview/${t.id}`} className="block text-sm text-zinc-400 hover:text-white">{t.id} — {t.name}</a>
          ))}
        </div>
      </main>
    );
  }

  const Comp = tpl.component;
  const dtInfo = seedDt ?? TEMPLATE_DEFAULT_DESIGN_TOKENS[id as keyof typeof TEMPLATE_DEFAULT_DESIGN_TOKENS];

  if (!ready) {
    return <main className="min-h-screen bg-zinc-950" />;
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-4 py-2 flex items-center gap-4 overflow-x-auto">
        <a href="/template-gallery" className="text-xs text-zinc-500 hover:text-white shrink-0">&larr; Gallery</a>
        <span className="text-xs font-mono text-zinc-600 shrink-0">|</span>
        <span className="text-sm font-bold shrink-0">{tpl.name}</span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">{tpl.id}</span>
        <span className="text-xs text-zinc-500 shrink-0">{tpl.category}</span>
        {(() => {
          const s = scoreDesignToken(dt);
          const c = s.total >= 80 ? "text-green-400" : s.total >= 60 ? "text-yellow-400" : s.total >= 40 ? "text-orange-400" : "text-red-400";
          return <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${c}`} style={{background:"rgba(255,255,255,0.05)"}}>{s.total}</span>;
        })()}
        {seedId && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">seed #{seedId}</span>}
        {seedId && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="shrink-0 px-3 py-1 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-40"
          >
            {deleting ? "..." : "Hapus"}
          </button>
        )}
        <div className="flex-1" />
      </div>

      <Comp
        content={MOCK_CONTENT as any}
        design_token={dt}
        isEditorMode={false}
        onSubmitLead={async () => {}}
        leadSubmitting={false}
        leadSuccess={false}
        leadError={null}
        activeSection={undefined}
        onSelectSection={() => {}}
        onRegenSection={() => {}}
        arrivedSections={undefined}
      />

      {dtInfo && (
        <div className="max-w-5xl mx-auto p-6 border-t border-zinc-800 mt-8 space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Design Token</h2>
          {(() => {
            const s = scoreDesignToken(dt);
            return (
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-lg font-bold font-mono ${s.total >= 80 ? "text-green-400" : s.total >= 60 ? "text-yellow-400" : s.total >= 40 ? "text-orange-400" : "text-red-400"}`}>{s.total}</span>
                <div className="flex gap-3 text-[11px] text-zinc-500">
                  {s.parts.map((p) => {
                    const pc = p.score >= p.max * 0.8 ? "text-green-400" : p.score >= p.max * 0.5 ? "text-yellow-400" : "text-red-400";
                    return <span key={p.label} title={p.label}>{p.label}: <span className={`font-mono ${pc}`}>{p.score}/{p.max}</span></span>;
                  })}
                </div>
              </div>
            );
          })()}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-500">Palette</h3>
              <div className="space-y-1.5">
                {(dtInfo as any).palette && Object.entries((dtInfo as any).palette).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded border border-white/10 shrink-0" style={{ background: val as string }} />
                    <span className="text-zinc-500 w-20">{key}</span>
                    <span className="text-zinc-300 font-mono">{val as string}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-500">Typography</h3>
              <div className="space-y-1 text-xs">
                <p className="text-zinc-500">Heading: <span className="text-zinc-300" style={{ fontFamily: (dtInfo as any).typography?.heading_font }}>{(dtInfo as any).typography?.heading_font}</span></p>
                <p className="text-zinc-500">Body: <span className="text-zinc-300" style={{ fontFamily: (dtInfo as any).typography?.body_font }}>{(dtInfo as any).typography?.body_font}</span></p>
                <p className="text-zinc-500">Weight: <span className="text-zinc-300">{(dtInfo as any).typography?.heading_weight}</span></p>
                <p className="text-zinc-500">Hero size: <span className="text-zinc-300">{(dtInfo as any).typography?.heading_size_hero}</span></p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-500">Layout</h3>
              <div className="space-y-1 text-xs">
                {(dtInfo as any).layout && Object.entries((dtInfo as any).layout).map(([key, val]) => (
                  <p key={key} className="text-zinc-500">{key}: <span className="text-zinc-300">{Array.isArray(val) ? (val as any[]).join(", ") : String(val)}</span></p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
