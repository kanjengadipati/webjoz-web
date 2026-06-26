"use client";

import { useState, useEffect } from "react";
import { TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { TEMPLATE_DEFAULT_DESIGN_TOKENS } from "@/lib/template-defaults";
import { request, ApiError } from "@/lib/api/client";
import { useAuthToken } from "@/lib/auth-store";

interface SeedEntry {
  id: number;
  source_template_id?: string;
  business_type: string;
  mood: string;
  design_token: any;
  score: number;
  score_breakdown?: { label: string; score: number; max: number }[];
  created_at: string;
}

type Tab = "components" | "seeds";

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
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function scoreDesignToken(dt: any): { total: number; parts: { label: string; score: number; max: number }[] } {
  const parts: { label: string; score: number; max: number }[] = [];
  const pal = dt?.palette || {};
  const typo = dt?.typography || {};
  const layout = dt?.layout || {};

  // Contrast (40 pts)
  const bg = pal.background || "#FFFFFF";
  const text = pal.text || "#000000";
  const cr = contrastRatio(text, bg);
  const contrastScore = Math.min(40, Math.round((cr / 21) * 40));
  parts.push({ label: "Kontras", score: contrastScore, max: 40 });

  // Completeness (30 pts)
  let complete = 0;
  const paletteKeys = ["primary", "accent", "background", "surface", "text"];
  const typoKeys = ["heading_font", "body_font", "heading_weight", "heading_size_hero"];
  const layoutKeys = ["section_spacing", "corner_radius"];
  for (const k of paletteKeys) if (pal[k]) complete++;
  for (const k of typoKeys) if (typo[k]) complete++;
  for (const k of layoutKeys) if (layout[k]) complete++;
  const completenessScore = Math.round((complete / (paletteKeys.length + typoKeys.length + layoutKeys.length)) * 30);
  parts.push({ label: "Lengkap", score: completenessScore, max: 30 });

  // Palette quality (20 pts)
  let pq = 0;
  if (pal.primary && pal.accent && pal.primary !== pal.accent) pq += 6;
  if (pal.primary && pal.background && pal.primary !== pal.background) pq += 4;
  if (pal.surface && pal.background && pal.surface !== pal.background) pq += 4;
  const bgIsDark = luminance(bg) < 0.5;
  const expectedText = bgIsDark ? "#FFFFFF" : "#000000";
  if (text.toLowerCase() !== expectedText.toLowerCase() && cr >= 4.5) pq += 6;
  parts.push({ label: "Palet", score: Math.min(20, pq), max: 20 });

  // Readability (10 pts)
  let rd = 0;
  if (typo.heading_font && typo.heading_font !== "inherit") rd += 3;
  if (typo.body_font && typo.body_font !== "inherit") rd += 2;
  if (typo.heading_weight && ["300", "400", "500", "600", "700", "800", "900"].includes(typo.heading_weight)) rd += 2;
  if (typo.heading_size_hero && !typo.heading_size_hero.startsWith("xs")) rd += 3;
  parts.push({ label: "Tipografi", score: Math.min(10, rd), max: 10 });

  const total = parts.reduce((s, p) => s + p.score, 0);
  return { total, parts };
}

export default function TemplateGalleryPage() {
  const [tab, setTab] = useState<Tab>("components");
  const [seeds, setSeeds] = useState<SeedEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [authToken] = useAuthToken();

  const fetchSeeds = async () => {
    setLoading(true);
    setForbidden(false);
    try {
      const res = await request<{ items: SeedEntry[] }>("/ai/templates?limit=100", {}, authToken);
      setSeeds(res.data.items);
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 403) {
        setForbidden(true);
      }
      setSeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "seeds") fetchSeeds();
  }, [tab]);

  const handleDeleteSeed = async (id: number) => {
    try {
      await request(`/ai/templates/${id}`, { method: "DELETE" }, authToken);
      setSeeds((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert("Gagal menghapus: " + (e as any).message);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Gallery</h1>
          <p className="text-zinc-400 text-sm mt-1">Review semua template dan design token. Hapus yang tidak sesuai.</p>
        </div>

        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          <button onClick={() => setTab("components")} className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${tab === "components" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Components ({TEMPLATE_REGISTRY.length})</button>
          <button onClick={() => setTab("seeds")} className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${tab === "seeds" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Design Token Seeds ({seeds.length})</button>
        </div>

        {tab === "components" && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {TEMPLATE_REGISTRY.map((tpl) => {
              const dt = TEMPLATE_DEFAULT_DESIGN_TOKENS[tpl.id];
              const pal = dt?.palette;
              const typo = dt?.typography;
              const layout = dt?.layout;
              return (
                <div key={tpl.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-zinc-700 transition-colors">
                  <div className="h-32 relative flex items-end p-4" style={{ background: pal ? `linear-gradient(135deg, ${pal.background || "#111"}, ${pal.surface || "#222"})` : "#1a1a2e" }}>
                    {pal && (
                      <div className="flex gap-1.5">
                        {[pal.primary, pal.accent, pal.background, pal.surface, pal.text].filter(Boolean).map((c, i) => (
                          <div key={i} className="w-7 h-7 rounded-full border border-white/10" style={{ background: c }} title={c} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base">{tpl.name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">{tpl.id}</span>
                        {(() => {
                          const s = scoreDesignToken(dt);
                          const c = s.total >= 80 ? "text-green-400" : s.total >= 60 ? "text-yellow-400" : s.total >= 40 ? "text-orange-400" : "text-red-400";
                          return <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${c}`} style={{ background: "rgba(255,255,255,0.05)" }}>{s.total}</span>;
                        })()}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{tpl.category} &middot; {tpl.previewType}</p>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{tpl.description}</p>
                    {pal && (
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        {Object.entries(pal).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: val as string }} />
                            <span className="text-zinc-500">{key}</span>
                            <span className="text-zinc-400 ml-auto">{val as string}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {typo && (
                      <div className="text-[11px] text-zinc-500 space-y-0.5">
                        <p>Heading: <span className="text-zinc-300">{typo.heading_font} ({typo.heading_weight})</span></p>
                        <p>Body: <span className="text-zinc-300">{typo.body_font}</span></p>
                        {typo.heading_size_hero && <p>Hero size: <span className="text-zinc-300">{typo.heading_size_hero}</span></p>}
                      </div>
                    )}
                    {layout && (
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(layout).filter(([k]) => k !== "section_order").map(([key, val]) => (
                          <span key={key} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">{key}: {String(val)}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {tpl.tags?.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-500">#{tag}</span>
                      ))}
                    </div>
                    {(() => {
                      const s = scoreDesignToken(dt);
                      return s.parts.length > 0 && (
                        <div className="flex gap-2 text-[10px] text-zinc-600">
                          {s.parts.map((p) => (
                            <span key={p.label} title={p.label}>{p.label.slice(0, 2)}{p.score}/{p.max}</span>
                          ))}
                        </div>
                      );
                    })()}
                    <a
                      href={`/template-gallery/preview/${tpl.id}`}
                      target="_blank"
                      className="inline-block w-full text-center py-2 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300"
                    >
                      Lihat Preview
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "seeds" && (
          <div>
            {!authToken ? (
              <div className="text-center py-12 text-zinc-500">
                <p className="text-lg">Login diperlukan untuk melihat design token seeds.</p>
                <a href="/login" className="text-blue-400 underline text-sm mt-2 inline-block">Login</a>
              </div>
            ) : loading ? (
              <div className="text-center py-12 text-zinc-500">Memuat...</div>
            ) : forbidden ? (
              <div className="text-center py-12 text-zinc-500">
                <p className="text-lg">Hanya superadmin yang bisa mengelola design token seeds.</p>
                <p className="text-sm mt-1">Login dengan akun superadmin untuk akses.</p>
              </div>
            ) : seeds.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <p>Tidak ada design token seeds.</p>
                <button onClick={fetchSeeds} className="text-blue-400 underline text-sm mt-2">Refresh</button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-zinc-500">{seeds.length} entries di template_library</p>
                  {seeds.map((seed) => {
                  const dt = seed.design_token;
                  const pal = dt?.palette;
                  const typo = dt?.typography;
                  const layout = dt?.layout;
                  const score = seed.score ?? scoreDesignToken(dt).total;
                  const scoreParts = seed.score_breakdown ?? scoreDesignToken(dt).parts;
                  const scoreColor = score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : score >= 40 ? "text-orange-400" : "text-red-400";
                  return (
                    <div key={seed.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3 hover:border-zinc-700 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-500">#{seed.id}</span>
                          <span className="text-sm font-semibold">{seed.business_type}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>{seed.mood}</span>
                          {seed.source_template_id && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{seed.source_template_id}</span>}
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${scoreColor}`} style={{ background: "rgba(255,255,255,0.05)" }}>{score}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500">{new Date(seed.created_at).toLocaleDateString()}</p>
                          <div className="flex gap-2 text-[10px] text-zinc-600">
                            {scoreParts.map((p) => (
                              <span key={p.label} title={p.label}>{p.label.slice(0, 2)}{p.score}/{p.max}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              const key = "preview_seed_dt";
                              localStorage.setItem(key, JSON.stringify(seed.design_token));
                              const dtb64 = btoa(JSON.stringify(seed.design_token));
                              window.open(`/template-gallery/preview/TEMPLATE_DYNAMIC?seed_id=${seed.id}&dt=${dtb64}`, "_blank");
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            Preview
                          </button>
                          <button onClick={() => handleDeleteSeed(seed.id)} className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors">
                            Hapus
                          </button>
                        </div>
                      </div>
                      {pal && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(pal).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-1.5 text-[11px] font-mono">
                              <span className="w-4 h-4 rounded" style={{ background: val as string }} />
                              <span className="text-zinc-400">{key}</span>
                              <span className="text-zinc-500">{val as string}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {typo && (
                        <div className="text-[11px] text-zinc-500">
                          {typo.heading_font && <span className="mr-4">Heading: <span className="text-zinc-300">{typo.heading_font}</span></span>}
                          {typo.body_font && <span>Body: <span className="text-zinc-300">{typo.body_font}</span></span>}
                        </div>
                      )}
                      {layout && (
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(layout).map(([key, val]) => (
                            <span key={key} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">{key}: {Array.isArray(val) ? val.slice(0, 3).join(", ") + (val.length > 3 ? "..." : "") : String(val)}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
