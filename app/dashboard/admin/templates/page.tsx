"use client";

import { useState, useEffect } from "react";
import { TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { TEMPLATE_DEFAULT_DESIGN_TOKENS } from "@/lib/template-defaults";
import { request, ApiError } from "@/lib/api/client";
import { useAuthToken } from "@/lib/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/components/toast-provider";
import { 
  Palette, 
  Layers, 
  Sparkles, 
  Trash2, 
  Eye, 
  Search, 
  ShieldAlert, 
  RefreshCw, 
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Loader2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Button,
  Badge,
  Input,
  Separator
} from "@/components/ui";

interface SeedEntry {
  id: number;
  source_template_id?: string;
  source_name?: string;
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

  const bg = pal.background || "";
  const text = pal.text || "";
  const primary = pal.primary || "";
  const accent = pal.accent || "";
  const surface = pal.surface || "";

  const cr = bg && text ? contrastRatio(text, bg) : 0;

  // ── Accessibility (40 pts) — matches Go backend ──
  let acc = 0;
  if (text && bg) {
    if (cr >= 12) acc = 40;
    else if (cr >= 7) acc = 30 + Math.round(((cr - 7) / 5) * 10);
    else if (cr >= 4.5) acc = 20 + Math.round(((cr - 4.5) / 2.5) * 10);
    else acc = Math.round((cr / 4.5) * 20);
  }
  // bonus: primary button text contrast (WCAG AA → 4.5:1)
  if (primary && text && contrastRatio(primary, text) >= 4.5) acc += 5;
  // bonus: text-on-surface contrast (ensures content legible on cards/sections)
  if (text && surface && contrastRatio(text, surface) >= 4.5) acc += 5;
  // bonus: primary-vs-background button visibility (WCAG non-text AA → 3:1)
  if (primary && bg && contrastRatio(primary, bg) >= 3) acc += 5;
  if (acc > 40) acc = 40;
  parts.push({ label: "Aksesibilitas", score: acc, max: 40 });

  // ── Completeness (30 pts) — matches Go backend ──
  let complete = 0;
  const paletteKeys = ["primary", "accent", "background", "surface", "text"];
  const typoKeys = ["heading_font", "body_font", "heading_weight", "heading_size_hero"];
  const layoutKeys = ["section_spacing", "corner_radius"];
  for (const k of paletteKeys) if (pal[k]) complete++;
  for (const k of typoKeys) if (typo[k]) complete++;
  for (const k of layoutKeys) if (layout[k]) complete++;
  if (["compact", "normal", "relaxed"].includes(layout.section_spacing)) complete++;
  if (["sharp", "soft", "rounded"].includes(layout.corner_radius)) complete++;
  const totalFields = paletteKeys.length + typoKeys.length + layoutKeys.length + 2;
  const compScore = Math.min(30, Math.round((complete / totalFields) * 30));
  parts.push({ label: "Kelengkapan", score: compScore, max: 30 });

  // ── Palette quality (20 pts) — matches Go backend ──
  let pq = 0;
  if (primary && accent && primary !== accent) pq += 5;
  if (primary && bg && primary !== bg) pq += 3;
  if (surface && bg && surface !== bg) pq += 4;
  if (accent && bg && accent !== bg) pq += 3;
  // hue diversity: not both gray
  if (primary && accent) {
    if (!isGrayish(primary) || !isGrayish(accent)) pq += 3;
  }
  // tone contrast: light bg → dark text or dark bg → light text
  if (text && bg) {
    const bgLum = luminance(bg), textLum = luminance(text);
    if ((bgLum > 0.5 && textLum < 0.5) || (bgLum < 0.5 && textLum > 0.5)) pq += 2;
  }
  parts.push({ label: "Palet", score: Math.min(20, pq), max: 20 });

  // ── Typography (10 pts) — matches Go backend ──
  let rd = 0;
  const hf = typo.heading_font || "";
  const bf = typo.body_font || "";
  const hw = typo.heading_weight || "";
  const hs = typo.heading_size_hero || "";
  if (hf && !["inherit", "sans-serif"].includes(hf.toLowerCase())) rd += 3;
  if (bf && !["inherit", "serif"].includes(bf.toLowerCase())) rd += 2;
  if (["300", "400", "500", "600", "700", "800", "900"].includes(hw)) {
    const w = parseInt(hw, 10);
    rd += w >= 700 ? 3 : w >= 600 ? 2 : 1;
  }
  if (hs && !hs.startsWith("xs") && !hs.startsWith("sm")) rd += 2;
  if (hf && bf && hf.toLowerCase() !== bf.toLowerCase()) rd += 1;
  parts.push({ label: "Tipografi", score: Math.min(10, rd), max: 10 });

  const total = parts.reduce((s, p) => s + p.score, 0);
  return { total, parts };
}

function isGrayish(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length < 6) return true;
  const r = parseInt(h[0] + h[1], 16);
  const g = parseInt(h[2] + h[3], 16);
  const b = parseInt(h[4] + h[5], 16);
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
  return maxDiff < 30;
}

export default function TemplateGalleryPage() {
  const [tab, setTab] = useState<Tab>("components");
  const [seeds, setSeeds] = useState<SeedEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMood, setSelectedMood] = useState("all");
  const [selectedBusinessType, setSelectedBusinessType] = useState("all");
  const authToken = useAuthToken();
  const { role: userRole } = usePermissions();
  const { pushToast } = useToast();

  const isSuperAdmin = userRole === "superadmin";

  const fetchSeeds = async () => {
    setLoading(true);
    setForbidden(false);
    try {
      const res = await request<{ items: SeedEntry[] }>("/ai/templates?limit=2000", {}, authToken);
      setSeeds(res.data.items);
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 403) {
        setForbidden(true);
      }
      setSeeds([]);
      pushToast("Gagal mengambil data design token seeds", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "seeds" && isSuperAdmin && authToken) {
      fetchSeeds();
    }
  }, [tab, isSuperAdmin, authToken]);

  const handleBackfill = async () => {
    if (!window.confirm("Backfill scores untuk semua template_library rows yang score=0?")) {
      return;
    }
    try {
      await request("/ai/templates/backfill-scores", { method: "POST" }, authToken);
      pushToast("Backfill selesai — scores sudah diperbarui", "success");
      fetchSeeds();
    } catch (e) {
      pushToast("Gagal backfill: " + (e as any).message, "error");
    }
  };

  const handleDeleteSeed = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus design token seed ini secara permanen?")) {
      return;
    }
    try {
      await request(`/ai/templates/${id}`, { method: "DELETE" }, authToken);
      setSeeds((prev) => prev.filter((s) => s.id !== id));
      pushToast("Design token seed berhasil dihapus", "success");
    } catch (e) {
      pushToast("Gagal menghapus seed: " + (e as any).message, "error");
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground gap-4 animate-in fade-in duration-300">
        <ShieldAlert className="size-16 text-destructive opacity-80" />
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-foreground">Akses Ditolak</h2>
          <p className="text-sm max-w-sm">
            Halaman ini hanya dapat diakses oleh akun dengan peran <span className="font-semibold text-primary">Superadmin</span>.
          </p>
        </div>
      </div>
    );
  }

  // Filter templates list based on search/category
  const filteredTemplates = TEMPLATE_REGISTRY.filter((tpl) => {
    const matchesSearch = searchQuery === "" || 
                          tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Derive unique filter values from seeds
  const businessTypes = ["all", ...Array.from(new Set(seeds.map((s) => s.business_type)))].sort((a, b) => a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b));
  const moods = ["all", ...Array.from(new Set(seeds.map((s) => s.mood)))].sort((a, b) => a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b));

  // Filter seeds based on search + business type + mood
  const filteredSeeds = seeds.filter((seed) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = q === "" ||
      seed.business_type.toLowerCase().includes(q) ||
      seed.mood.toLowerCase().includes(q) ||
      (seed.source_template_id && seed.source_template_id.toLowerCase().includes(q)) ||
      String(seed.id).includes(q);
    const matchesBT = selectedBusinessType === "all" || seed.business_type === selectedBusinessType;
    const matchesMood = selectedMood === "all" || seed.mood === selectedMood;
    return matchesSearch && matchesBT && matchesMood;
  });

  // Get unique categories for template components filter
  const categories = ["all", ...Array.from(new Set(TEMPLATE_REGISTRY.map((t) => t.category)))];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-foreground">
            <Palette className="size-6 text-primary" />
            Template Gallery
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review template bawaan sistem dan design token seeds hasil inkubasi generator AI.
          </p>
        </div>
        {tab === "seeds" && (
          <div className="flex items-center gap-2">
            <Button onClick={handleBackfill} size="sm" variant="outline" className="gap-2 border-amber-500/30 text-amber-600 hover:bg-amber-500/10">
              <Loader2 className="size-3.5" />
              Backfill Scores
            </Button>
            <Button onClick={fetchSeeds} disabled={loading} size="sm" variant="outline" className="gap-2">
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Seeds
            </Button>
          </div>
        )}
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex items-center justify-between border-b border-border/40 pb-px">
        <div className="flex gap-1.5">
          <button 
            onClick={() => { setTab("components"); setSearchQuery(""); setSelectedCategory("all"); }} 
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 flex items-center gap-2 ${
              tab === "components" 
                ? "border-primary text-primary font-bold bg-primary/5 rounded-t-lg" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-4" />
            Komponen Template ({TEMPLATE_REGISTRY.length})
          </button>
          <button 
            onClick={() => { setTab("seeds"); setSearchQuery(""); setSelectedBusinessType("all"); setSelectedMood("all"); }} 
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 flex items-center gap-2 ${
              tab === "seeds" 
                ? "border-primary text-primary font-bold bg-primary/5 rounded-t-lg" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="size-4" />
            Design Token Seeds ({loading ? "..." : seeds.length})
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder={tab === "components" ? "Cari nama, ID, atau deskripsi template..." : "Cari tipe bisnis, mood, atau ID seed..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full bg-background border-border/40"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
          
          {tab === "components" && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 text-xs font-medium rounded-lg border border-border/40 bg-background text-foreground outline-none focus:border-primary/60 cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {categories.filter(c => c !== "all").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          {tab === "seeds" && businessTypes.length > 1 && (
            <select
              value={selectedBusinessType}
              onChange={(e) => setSelectedBusinessType(e.target.value)}
              className="h-10 px-3 text-xs font-medium rounded-lg border border-border/40 bg-background text-foreground outline-none focus:border-primary/60 cursor-pointer"
            >
              <option value="all">Semua Tipe Bisnis</option>
              {businessTypes.filter(b => b !== "all").map((bt) => (
                <option key={bt} value={bt} className="capitalize">{bt}</option>
              ))}
            </select>
          )}

          {tab === "seeds" && moods.length > 1 && (
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="h-10 px-3 text-xs font-medium rounded-lg border border-border/40 bg-background text-foreground outline-none focus:border-primary/60 cursor-pointer capitalize"
            >
              <option value="all">Semua Mood</option>
              {moods.filter(m => m !== "all").map((m) => (
                <option key={m} value={m} className="capitalize">{m}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Content Panes ── */}
      {tab === "components" && (
        filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 bg-muted/10 border border-border/30 rounded-2xl">
            <Layers className="size-10 opacity-30 animate-pulse" />
            <p className="text-sm font-medium">Tidak ada template yang cocok dengan pencarian Anda.</p>
            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>Reset Filter</Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((tpl) => {
              const dt = TEMPLATE_DEFAULT_DESIGN_TOKENS[tpl.id as keyof typeof TEMPLATE_DEFAULT_DESIGN_TOKENS];
              const pal = dt?.palette;
              const typo = dt?.typography;
              const layout = dt?.layout;
              const { total: score, parts: scoreParts } = scoreDesignToken(dt);
              const scoreColorClass = score >= 80 
                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                : score >= 60 
                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" 
                  : score >= 40 
                    ? "bg-orange-500/10 text-orange-500 border-orange-500/20" 
                    : "bg-red-500/10 text-red-500 border-red-500/20";

              return (
                <Card key={tpl.id} className="overflow-hidden border-border/40 hover:border-border/80 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-[520px]">
                  {/* Top Color Strip */}
                  <div className="h-28 relative flex items-end p-4 border-b border-border/30" style={{ background: pal ? `linear-gradient(135deg, ${pal.background || "#111"}, ${pal.surface || "#222"})` : "var(--muted)" }}>
                    {pal && (
                      <div className="flex gap-1.5 p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/5">
                        {[pal.primary, pal.accent, pal.background, pal.surface, pal.text].filter(Boolean).map((c, i) => (
                          <div 
                            key={i} 
                            className="size-6 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-110" 
                            style={{ background: c }} 
                            title={c} 
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="font-bold text-base text-foreground leading-snug">{tpl.name}</h3>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{tpl.id}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Badge variant="outline" className={`font-mono font-bold border ${scoreColorClass}`}>
                            Score: {score}
                          </Badge>
                          <span className="text-[9px] text-muted-foreground uppercase font-semibold tracking-wider">Default Seed</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1.5">
                        <Badge variant="secondary" className="capitalize text-[10px] h-5 py-0 px-2 rounded-md bg-muted text-muted-foreground border-none font-semibold">
                          {tpl.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] h-5 py-0 px-2 rounded-md border-border/40 text-muted-foreground font-semibold">
                          {tpl.previewType}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>

                    <Separator className="bg-border/30" />

                    {/* Palette details */}
                    {pal && (
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono bg-muted/20 p-2 rounded-lg border border-border/20">
                        {Object.entries(pal).slice(0, 4).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-1.5 truncate">
                            <span className="size-2.5 rounded-sm shrink-0 border border-border/20" style={{ background: val as string }} />
                            <span className="text-muted-foreground text-[10px] capitalize w-11">{key}</span>
                            <span className="text-foreground text-[10px] font-semibold">{val as string}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Typography Details */}
                    {typo && (
                      <div className="text-[11px] text-muted-foreground bg-muted/20 p-2 rounded-lg border border-border/20 space-y-0.5 font-sans">
                        <p className="flex justify-between">
                          <span>Heading:</span>
                          <span className="text-foreground font-medium truncate max-w-40" style={{ fontFamily: typo.heading_font }}>
                            {typo.heading_font} ({typo.heading_weight || "Normal"})
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Body Font:</span>
                          <span className="text-foreground font-medium truncate max-w-40" style={{ fontFamily: typo.body_font }}>
                            {typo.body_font}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Score Breakdown Bar */}
                    {scoreParts.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                          <span>Kualitas Desain</span>
                          <span>{scoreParts.map(p => `${p.label.slice(0, 2)} ${p.score}/${p.max}`).join(" | ")}</span>
                        </div>
                      </div>
                    )}

                    {/* Action button */}
                    <a
                      href={`/template-gallery/preview/${tpl.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full mt-auto"
                    >
                      <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5 bg-background hover:bg-muted/40">
                        <Eye className="size-3.5" />
                        Pratinjau Fullscreen
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      )}

      {tab === "seeds" && (
        !authToken ? (
          <div className="text-center py-20 text-muted-foreground bg-muted/10 border border-border/30 rounded-2xl space-y-3">
            <ShieldAlert className="size-10 mx-auto text-amber-500 opacity-80" />
            <p className="text-sm font-medium">Sesi login diperlukan untuk melihat design token seeds.</p>
            <Button size="sm" onClick={() => window.location.replace("/login")}>Login Sesi</Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Memuat design token seeds dari API...</p>
          </div>
        ) : forbidden ? (
          <div className="text-center py-20 text-muted-foreground bg-muted/10 border border-border/30 rounded-2xl space-y-3">
            <ShieldAlert className="size-10 mx-auto text-destructive opacity-80" />
            <p className="text-sm font-semibold text-foreground">Hanya Superadmin yang Bisa Mengelola Design Token Seeds.</p>
            <p className="text-xs max-w-xs mx-auto">Peran akun Anda saat ini tidak memiliki hak akses administratif yang cukup.</p>
          </div>
        ) : filteredSeeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 bg-muted/10 border border-border/30 rounded-2xl">
            <Sparkles className="size-10 opacity-30 animate-pulse" />
            <p className="text-sm font-medium">{seeds.length === 0 ? "Tidak ada design token seeds di database." : "Tidak ada seeds yang cocok dengan kata kunci."}</p>
            {seeds.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedBusinessType("all"); setSelectedMood("all"); }}>Reset Pencarian</Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{filteredSeeds.length} dari {seeds.length} entries di template_library</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredSeeds.map((seed) => {
                const dt = seed.design_token;
                const pal = dt?.palette;
                const typo = dt?.typography;
                const layout = dt?.layout;
                const score = seed.score ?? scoreDesignToken(dt).total;
                const scoreParts = seed.score_breakdown ?? scoreDesignToken(dt).parts;
                const scoreColorClass = score >= 80 
                  ? "bg-green-500/10 text-green-500 border-green-500/20" 
                  : score >= 60 
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" 
                    : score >= 40 
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/20" 
                      : "bg-red-500/10 text-red-500 border-red-500/20";

                return (
                  <Card key={seed.id} className="overflow-hidden border-border/40 hover:border-border/80 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-[520px]">
                    {/* Top Color Strip */}
                    <div className="h-28 relative flex items-end p-4 border-b border-border/30" style={{ background: pal ? `linear-gradient(135deg, ${pal.background || "#111"}, ${pal.surface || "#222"})` : "var(--muted)" }}>
                      {pal && (
                        <div className="flex gap-1.5 p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/5">
                          {[pal.primary, pal.accent, pal.background, pal.surface, pal.text].filter(Boolean).map((c, i) => (
                            <div 
                              key={i} 
                              className="size-6 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-110" 
                              style={{ background: c }} 
                              title={c} 
                            />
                          ))}
                        </div>
                      )}
                      {!pal && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/5">
                          <Palette className="size-4 text-white/60" />
                          <span className="text-[10px] text-white/50 font-semibold">No Palette</span>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3 overflow-y-auto">
                      {/* Header */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base text-foreground leading-snug truncate capitalize">{seed.source_name || seed.business_type}</h3>
                              <Badge variant="secondary" className="text-[10px] font-semibold bg-primary/10 text-primary border-none rounded capitalize shrink-0">
                                {seed.mood}
                              </Badge>
                            </div>
                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">#{seed.id} · {seed.business_type} {seed.source_template_id && <span>· Base: <span className="font-bold">{seed.source_template_id}</span></span>}</p>
                          </div>
                          <Badge variant="outline" className={`font-mono font-bold text-[10px] border shrink-0 ${scoreColorClass}`}>
                            Score: {score}
                          </Badge>
                        </div>
                      </div>

                      <Separator className="bg-border/30" />

                      {/* Palette details */}
                      {pal && (
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono bg-muted/20 p-2 rounded-lg border border-border/20">
                          {Object.entries(pal).slice(0, 4).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-1.5 truncate">
                              <span className="size-2.5 rounded-sm shrink-0 border border-border/20" style={{ background: val as string }} />
                              <span className="text-muted-foreground text-[10px] capitalize w-11">{key}</span>
                              <span className="text-foreground text-[10px] font-semibold">{val as string}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Typography Details */}
                      {typo && (
                        <div className="text-[11px] text-muted-foreground bg-muted/20 p-2 rounded-lg border border-border/20 space-y-0.5 font-sans">
                          <p className="flex justify-between">
                            <span>Heading:</span>
                            <span className="text-foreground font-medium truncate max-w-40" style={{ fontFamily: typo.heading_font }}>
                              {typo.heading_font} ({typo.heading_weight || "Normal"})
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span>Body:</span>
                            <span className="text-foreground font-medium truncate max-w-40" style={{ fontFamily: typo.body_font }}>
                              {typo.body_font}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Score Breakdown */}
                      {scoreParts.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] text-muted-foreground">
                            {scoreParts.map((p) => {
                              const pc = p.score >= p.max * 0.8 ? "text-green-500" : p.score >= p.max * 0.5 ? "text-yellow-500" : "text-red-500";
                              return (
                                <span key={p.label} title={p.label} className="font-semibold">
                                  {p.label}: <span className={`font-mono font-bold ${pc}`}>{p.score}/{p.max}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Layout info */}
                      {layout && (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(layout).filter(([k]) => k !== "section_order").slice(0, 3).map(([key, val]) => (
                            <span key={key} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800/30 text-muted-foreground font-mono">{key}: {String(val)}</span>
                          ))}
                        </div>
                      )}

                      {/* Date + Actions */}
                      <div className="flex items-center justify-between gap-2 mt-auto pt-1 border-t border-border/20">
                        <span className="text-[10px] text-muted-foreground/60">
                          {new Date(seed.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            onClick={() => {
                              const key = "preview_seed_dt";
                              localStorage.setItem(key, JSON.stringify(seed.design_token));
                              const dtb64 = btoa(JSON.stringify(seed.design_token));
                              window.open(`/template-gallery/preview/TEMPLATE_DYNAMIC?seed_id=${seed.id}&dt=${dtb64}`, "_blank");
                            }}
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 text-[10px] bg-background hover:bg-muted/40 font-semibold gap-1"
                          >
                            <Eye className="size-3" />
                            Lihat
                          </Button>
                          <Button 
                            onClick={() => handleDeleteSeed(seed.id)} 
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2.5 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold gap-1"
                          >
                            <Trash2 className="size-3" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}