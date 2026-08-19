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
  Trash2, 
  Eye, 
  Search, 
  ShieldAlert, 
  RefreshCw, 
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Loader2,
  Sparkles,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
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
import { useI18n } from "@/lib/i18n/context";

interface AestheticCritique {
  verdict?: string;
  strengths?: string[];
  improvements?: string[];
  hierarchy?: number;
  color_harmony?: number;
  whitespace?: number;
  overall?: number;
  screenshot_url?: string;
}

interface SeedEntry {
  id: number;
  source_template_id?: string;
  source_name?: string;
  business_type: string;
  mood: string;
  design_token: any;
  score: number;
  score_breakdown?: { label: string; score: number; max: number }[];
  aesthetic_score?: number | null;
  aesthetic_critique?: AestheticCritique | null;
  aesthetic_critiqued_at?: string | null;
  created_at: string;
}

type Tab = "components" | "seeds";
type SortOrder = "newest" | "oldest" | "score_asc" | "score_desc" | "aesthetic_asc" | "aesthetic_desc";
type ScoreFilter = "all" | "excellent" | "good" | "weak";
type AestheticFilter = "all" | "reviewed" | "unreviewed" | "high" | "mid" | "low";

import { scoreDesignToken, scoreBadgeClass } from "@/lib/design-token-score";

export default function TemplateGalleryPage() {
  const [tab, setTab] = useState<Tab>("components");
  const [seeds, setSeeds] = useState<SeedEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMood, setSelectedMood] = useState("all");
  const [selectedBusinessType, setSelectedBusinessType] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [aestheticFilter, setAestheticFilter] = useState<AestheticFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkCritiquing, setBulkCritiquing] = useState(false);
  const [critiquingId, setCritiquingId] = useState<number | null>(null);
  const [viewCritique, setViewCritique] = useState<SeedEntry | null>(null);
  const authToken = useAuthToken();
  const { role: userRole } = usePermissions();
  const { pushToast } = useToast();
  const { t } = useI18n();

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
      pushToast(t("dashboard.adminTemplates.seedLoadFailed"), "error");
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
    if (!window.confirm(t("dashboard.adminTemplates.backfillConfirm"))) {
      return;
    }
    try {
      await request("/ai/templates/backfill-scores", { method: "POST" }, authToken);
      pushToast(t("dashboard.adminTemplates.backfillDone"), "success");
      fetchSeeds();
    } catch (e) {
      pushToast(t("dashboard.adminTemplates.backfillFailed") + ": " + (e as any).message, "error");
    }
  };

  const handleBulkAestheticCritique = async () => {
    if (bulkCritiquing) return;
    if (!window.confirm(t("dashboard.adminTemplates.bulkAestheticConfirm"))) return;
    setBulkCritiquing(true);
    try {
      const res = await request<any>(
        "/ai/templates/backfill-aesthetic-critique?limit=50",
        { method: "POST" },
        authToken,
        true,
        0,
        600_000
      );
      const r = res.data;
      const rateLimitNote = r.stopped
        ? " — " + t("dashboard.adminTemplates.bulkAestheticRateLimit", undefined, { sec: String(r.retry_after_seconds ?? "") })
        : "";
      pushToast(
        t("dashboard.adminTemplates.bulkAestheticDone", undefined, {
          processed: String(r.processed ?? 0),
          critiqued: String(r.critiqued ?? 0),
          failed: String(r.failed ?? 0),
          pending: String(r.pending ?? 0),
        }) + rateLimitNote,
        (r.failed ?? 0) > 0 ? "error" : "success"
      );
      fetchSeeds();
    } catch (e) {
      const msg = e instanceof ApiError || e instanceof Error ? e.message : "";
      pushToast(`${t("dashboard.adminTemplates.bulkAestheticFailed")}${msg ? ": " + msg : ""}`, "error");
    } finally {
      setBulkCritiquing(false);
    }
  };

  const handleDeleteSeed = async (id: number) => {
    if (!window.confirm(t("dashboard.adminTemplates.seedDeleteConfirm"))) {
      return;
    }
    try {
      await request(`/ai/templates/${id}`, { method: "DELETE" }, authToken);
      setSeeds((prev) => prev.filter((s) => s.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      pushToast(t("dashboard.adminTemplates.seedDeleted"), "success");
    } catch (e) {
      pushToast(t("dashboard.adminTemplates.seedDeleteFailed") + ": " + (e as any).message, "error");
    }
  };

  const handleCritique = async (seed: SeedEntry) => {
    if (critiquingId !== null) return;
    setCritiquingId(seed.id);
    try {
      await request(
        `/ai/templates/${seed.id}/critique`,
        { method: "POST", body: JSON.stringify({}) },
        authToken,
        true,
        0,
        180_000
      );
      pushToast(t("dashboard.adminTemplates.critiqueDone"), "success");
      fetchSeeds();
    } catch (e) {
      const msg = e instanceof ApiError || e instanceof Error ? e.message : "";
      pushToast(`${t("dashboard.adminTemplates.critiqueFailed")}${msg ? ": " + msg : ""}`, "error");
    } finally {
      setCritiquingId(null);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!window.confirm(t("dashboard.adminTemplates.bulkDeleteConfirm", undefined, { count: String(ids.length) }))) {
      return;
    }
    setBulkDeleting(true);
    const results = await Promise.allSettled(
      ids.map((id) => request(`/ai/templates/${id}`, { method: "DELETE" }, authToken))
    );
    const failedIds: number[] = [];
    results.forEach((r, i) => {
      if (r.status === "rejected") failedIds.push(ids[i]);
    });
    const succeededIds = new Set(ids.filter((id) => !failedIds.includes(id)));
    setSeeds((prev) => prev.filter((s) => !succeededIds.has(s.id)));
    setSelectedIds(new Set(failedIds));
    setBulkDeleting(false);
    if (failedIds.length === 0) {
      pushToast(t("dashboard.adminTemplates.bulkDeleted", undefined, { count: String(succeededIds.size) }), "success");
    } else {
      pushToast(
        t("dashboard.adminTemplates.bulkDeletePartialFail", undefined, {
          ok: String(succeededIds.size),
          fail: String(failedIds.length),
        }),
        "error"
      );
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground gap-4 animate-in fade-in duration-300">
        <ShieldAlert className="size-16 text-destructive opacity-80" />
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-foreground">{t("dashboard.adminTemplates.accessDenied")}</h2>
          <p className="text-sm max-w-sm">
            {t("dashboard.adminTemplates.superadminOnly")} <span className="font-semibold text-primary">{t("dashboard.adminTemplates.superadmin")}</span>.
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

  // Resolve score once per seed up front so filtering, sorting, and rendering agree
  const seedsScored = seeds.map((seed) => ({
    seed,
    score: seed.score ?? scoreDesignToken(seed.design_token).total,
    aesthetic: seed.aesthetic_score ?? null,
  }));

  const scoreFilterOptions: { value: ScoreFilter; labelKey: string; className: string }[] = [
    { value: "all", labelKey: "dashboard.adminTemplates.scoreFilterAll", className: "" },
    { value: "excellent", labelKey: "dashboard.adminTemplates.scoreFilterExcellent", className: "text-green-500" },
    { value: "good", labelKey: "dashboard.adminTemplates.scoreFilterGood", className: "text-yellow-500" },
    { value: "weak", labelKey: "dashboard.adminTemplates.scoreFilterWeak", className: "text-orange-500" },
  ];

  const scoreCounts: Record<ScoreFilter, number> = {
    all: seedsScored.length,
    excellent: seedsScored.filter(({ score }) => score >= 80).length,
    good: seedsScored.filter(({ score }) => score >= 60 && score < 80).length,
    weak: seedsScored.filter(({ score }) => score < 60).length,
  };

  const aestheticFilterOptions: { value: AestheticFilter; labelKey: string; className: string }[] = [
    { value: "all", labelKey: "dashboard.adminTemplates.aestheticFilterAll", className: "" },
    { value: "reviewed", labelKey: "dashboard.adminTemplates.aestheticFilterReviewed", className: "text-green-500" },
    { value: "unreviewed", labelKey: "dashboard.adminTemplates.aestheticFilterUnreviewed", className: "text-orange-500" },
    { value: "high", labelKey: "dashboard.adminTemplates.aestheticFilterHigh", className: "text-green-500" },
    { value: "mid", labelKey: "dashboard.adminTemplates.aestheticFilterMid", className: "text-yellow-500" },
    { value: "low", labelKey: "dashboard.adminTemplates.aestheticFilterLow", className: "text-red-500" },
  ];

  const aestheticCounts: Record<AestheticFilter, number> = {
    all: seedsScored.length,
    reviewed: seedsScored.filter(({ aesthetic }) => aesthetic != null).length,
    unreviewed: seedsScored.filter(({ aesthetic }) => aesthetic == null).length,
    high: seedsScored.filter(({ aesthetic }) => aesthetic != null && aesthetic >= 80).length,
    mid: seedsScored.filter(({ aesthetic }) => aesthetic != null && aesthetic >= 70 && aesthetic < 80).length,
    low: seedsScored.filter(({ aesthetic }) => aesthetic != null && aesthetic < 70).length,
  };

  // Filter seeds based on search + business type + mood + score bucket + aesthetic bucket
  const filteredSeeds = seedsScored
    .filter(({ seed, score, aesthetic }) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = q === "" ||
        seed.business_type.toLowerCase().includes(q) ||
        seed.mood.toLowerCase().includes(q) ||
        (seed.source_template_id && seed.source_template_id.toLowerCase().includes(q)) ||
        String(seed.id).includes(q);
      const matchesBT = selectedBusinessType === "all" || seed.business_type === selectedBusinessType;
      const matchesMood = selectedMood === "all" || seed.mood === selectedMood;
      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "excellent" && score >= 80) ||
        (scoreFilter === "good" && score >= 60 && score < 80) ||
        (scoreFilter === "weak" && score < 60);
      const matchesAesthetic =
        aestheticFilter === "all" ||
        (aestheticFilter === "reviewed" && aesthetic != null) ||
        (aestheticFilter === "unreviewed" && aesthetic == null) ||
        (aestheticFilter === "high" && aesthetic != null && aesthetic >= 80) ||
        (aestheticFilter === "mid" && aesthetic != null && aesthetic >= 70 && aesthetic < 80) ||
        (aestheticFilter === "low" && aesthetic != null && aesthetic < 70);
      return matchesSearch && matchesBT && matchesMood && matchesScore && matchesAesthetic;
    })
    .sort((a, b) => {
      if (sortOrder === "score_asc") return a.score - b.score;
      if (sortOrder === "score_desc") return b.score - a.score;
      if (sortOrder === "aesthetic_desc") return (b.aesthetic ?? -1) - (a.aesthetic ?? -1);
      if (sortOrder === "aesthetic_asc") return (a.aesthetic ?? -1) - (b.aesthetic ?? -1);
      const at = new Date(a.seed.created_at).getTime();
      const bt = new Date(b.seed.created_at).getTime();
      return sortOrder === "oldest" ? at - bt : bt - at;
    })
    .map(({ seed }) => seed);

  // Get unique categories for template components filter
  const categories = ["all", ...Array.from(new Set(TEMPLATE_REGISTRY.map((t) => t.category)))];

  return (
    <div className="space-y-5">
      {/* ── Header Bar: Tabs & Action Buttons ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
        {/* Segmented Tab Switcher */}
        <div className="inline-flex p-1 bg-muted/40 border border-border/40 rounded-xl gap-1 shrink-0">
          <button 
            onClick={() => { setTab("components"); setSearchQuery(""); setSelectedCategory("all"); }} 
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              tab === "components" 
                ? "bg-background text-foreground shadow-xs font-bold" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            }`}
          >
            <Layers className="size-3.5" />
            <span>{t("dashboard.adminTemplates.tabComponents")}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted/80 text-muted-foreground font-mono">
              {TEMPLATE_REGISTRY.length}
            </span>
          </button>
          <button 
            onClick={() => { setTab("seeds"); setSearchQuery(""); setSelectedBusinessType("all"); setSelectedMood("all"); setScoreFilter("all"); setAestheticFilter("all"); }} 
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              tab === "seeds" 
                ? "bg-background text-foreground shadow-xs font-bold" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            }`}
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>{t("dashboard.adminTemplates.tabSeeds")}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted/80 text-muted-foreground font-mono">
              {loading ? "..." : seeds.length}
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        {tab === "seeds" && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleBulkAestheticCritique}
              disabled={bulkCritiquing}
              size="sm"
              variant="outline"
              className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 h-8 text-xs font-medium"
            >
              {bulkCritiquing ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
              <span>{t("dashboard.adminTemplates.bulkAesthetic")}</span>
            </Button>
            <Button onClick={handleBackfill} size="sm" variant="outline" className="gap-1.5 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 h-8 text-xs font-medium">
              <Loader2 className="size-3" />
              <span>{t("dashboard.adminTemplates.backfillScores")}</span>
            </Button>
            <Button onClick={fetchSeeds} disabled={loading} size="sm" variant="ghost" className="gap-1.5 h-8 text-xs font-medium text-muted-foreground hover:text-foreground">
              <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
              <span>{t("dashboard.adminTemplates.refreshSeeds")}</span>
            </Button>
          </div>
        )}
      </div>

      {/* ── Search & Filter Controls Panel ── */}
      <div className="rounded-xl border border-border/40 bg-card/40 p-3.5 space-y-3 shadow-xs">
        {/* Row 1: Search & Dropdown Filters */}
        <div className="flex flex-col md:flex-row gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input 
              placeholder={tab === "components" ? t("dashboard.adminTemplates.searchComponentsPlaceholder") : t("dashboard.adminTemplates.searchSeedsPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 pr-8 h-9 text-xs w-full bg-background/80 border-border/40 rounded-lg"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                aria-label="Clear search"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {tab === "components" && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 px-3 text-xs font-medium rounded-lg border border-border/40 bg-background/80 text-foreground outline-none focus:border-primary/60 cursor-pointer"
              >
                <option value="all">{t("dashboard.adminTemplates.allCategories")}</option>
                {categories.filter(c => c !== "all").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}

            {tab === "seeds" && (
              <>
                {businessTypes.length > 1 && (
                  <select
                    value={selectedBusinessType}
                    onChange={(e) => setSelectedBusinessType(e.target.value)}
                    className="h-9 px-3 text-xs font-medium rounded-lg border border-border/40 bg-background/80 text-foreground outline-none focus:border-primary/60 cursor-pointer"
                  >
                    <option value="all">{t("dashboard.adminTemplates.allBusinessTypes")}</option>
                    {businessTypes.filter(b => b !== "all").map((bt) => (
                      <option key={bt} value={bt} className="capitalize">{bt}</option>
                    ))}
                  </select>
                )}

                {moods.length > 1 && (
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="h-9 px-3 text-xs font-medium rounded-lg border border-border/40 bg-background/80 text-foreground outline-none focus:border-primary/60 cursor-pointer capitalize"
                  >
                    <option value="all">{t("dashboard.adminTemplates.allMoods")}</option>
                    {moods.filter(m => m !== "all").map((m) => (
                      <option key={m} value={m} className="capitalize">{m}</option>
                    ))}
                  </select>
                )}

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="h-9 px-3 text-xs font-medium rounded-lg border border-border/40 bg-background/80 text-foreground outline-none focus:border-primary/60 cursor-pointer"
                >
                  <option value="newest">{t("dashboard.adminTemplates.sortNewest")}</option>
                  <option value="oldest">{t("dashboard.adminTemplates.sortOldest")}</option>
                  <option value="score_desc">{t("dashboard.adminTemplates.sortScoreDesc")}</option>
                  <option value="score_asc">{t("dashboard.adminTemplates.sortScoreAsc")}</option>
                  <option value="aesthetic_desc">{t("dashboard.adminTemplates.sortAestheticDesc")}</option>
                  <option value="aesthetic_asc">{t("dashboard.adminTemplates.sortAestheticAsc")}</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Row 2: Faceted Filter Chips (Only for seeds tab) */}
        {tab === "seeds" && (
          <div className="pt-2.5 border-t border-border/30 flex flex-col xl:flex-row xl:items-center gap-3">
            {/* Rule-based Quality Score Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground/80 shrink-0 flex items-center gap-1">
                <SlidersHorizontal className="size-3 text-muted-foreground" />
                {t("dashboard.adminTemplates.ruleScoreLabel")}:
              </span>
              <div className="inline-flex p-0.5 bg-muted/40 border border-border/40 rounded-lg gap-0.5">
                {scoreFilterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setScoreFilter(opt.value)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      scoreFilter === opt.value
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : `${opt.className || "text-muted-foreground"} hover:text-foreground hover:bg-background/40`
                    }`}
                  >
                    <span>{t(opt.labelKey)}</span>
                    <span className="text-[10px] opacity-60 font-mono">
                      ({scoreCounts[opt.value]})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Aesthetic Critique Score Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground/80 shrink-0 flex items-center gap-1">
                <Sparkles className="size-3 text-primary" />
                {t("dashboard.adminTemplates.aestheticCritiqueLabel")}:
              </span>
              <div className="inline-flex p-0.5 bg-muted/40 border border-border/40 rounded-lg gap-0.5">
                {aestheticFilterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAestheticFilter(opt.value)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      aestheticFilter === opt.value
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : `${opt.className || "text-muted-foreground"} hover:text-foreground hover:bg-background/40`
                    }`}
                  >
                    <span>{t(opt.labelKey)}</span>
                    <span className="text-[10px] opacity-60 font-mono">
                      ({aestheticCounts[opt.value]})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Status Summary & Bulk Selection Toolbar ── */}
      {tab === "seeds" && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 min-h-[32px]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
            <span>{t("dashboard.adminTemplates.entriesCount", undefined, { shown: String(filteredSeeds.length), total: String(seeds.length) })}</span>
            {filteredSeeds.length > 0 && selectedIds.size === 0 && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set(filteredSeeds.map((s) => s.id)))}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  {t("dashboard.adminTemplates.selectAllFiltered", undefined, { count: String(filteredSeeds.length) })}
                </button>
              </>
            )}
          </div>

          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-1 px-2.5 bg-primary/10 border border-primary/20 rounded-lg animate-in fade-in zoom-in-95 duration-200">
              <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5">
                {t("dashboard.adminTemplates.selectedCount", undefined, { count: String(selectedIds.size) })}
              </Badge>
              {selectedIds.size < filteredSeeds.length && (
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set(filteredSeeds.map((s) => s.id)))}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  {t("dashboard.adminTemplates.selectAllFiltered", undefined, { count: String(filteredSeeds.length) })}
                </button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-6.5 text-xs px-2 hover:bg-primary/20 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedIds(new Set())}
              >
                {t("dashboard.adminTemplates.clearSelection")}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={bulkDeleting}
                className="h-6.5 text-xs px-2.5 gap-1.5 cursor-pointer shadow-xs"
                onClick={handleBulkDelete}
              >
                {bulkDeleting ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                {t("dashboard.adminTemplates.deleteSelected")}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Content Panes ── */}
      {tab === "components" && (
        filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 bg-muted/10 border border-border/30 rounded-2xl">
            <Layers className="size-10 opacity-30 animate-pulse" />
            <p className="text-sm font-medium">{t("dashboard.adminTemplates.noTemplateMatch")}</p>
            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>{t("dashboard.adminTemplates.resetFilter")}</Button>
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
                      <div className="flex gap-1.5 p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-border/50">
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
                            {t("dashboard.adminTemplates.score")}: {score}
                          </Badge>
                          <span className="text-[9px] text-muted-foreground uppercase font-semibold tracking-wider">{t("dashboard.adminTemplates.defaultSeed")}</span>
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
                          <span>{t("dashboard.adminTemplates.heading")}:</span>
                          <span className="text-foreground font-medium truncate max-w-40" style={{ fontFamily: typo.heading_font }}>
                            {typo.heading_font} ({typo.heading_weight || t("dashboard.adminTemplates.normal")})
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>{t("dashboard.adminTemplates.bodyFont")}:</span>
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
                          <span>{t("dashboard.adminTemplates.designQuality")}</span>
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
                        {t("dashboard.adminTemplates.previewFullscreen")}
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
            <p className="text-sm font-medium">{t("dashboard.adminTemplates.loginRequired")}</p>
            <Button size="sm" onClick={() => window.location.replace("/login")}>{t("dashboard.adminTemplates.loginSession")}</Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">{t("dashboard.adminTemplates.loadingSeeds")}</p>
          </div>
        ) : forbidden ? (
          <div className="text-center py-20 text-muted-foreground bg-muted/10 border border-border/30 rounded-2xl space-y-3">
            <ShieldAlert className="size-10 mx-auto text-destructive opacity-80" />
            <p className="text-sm font-semibold text-foreground">{t("dashboard.adminTemplates.superadminOnlyManage")}</p>
            <p className="text-xs max-w-xs mx-auto">{t("dashboard.adminTemplates.insufficientAccess")}</p>
          </div>
        ) : filteredSeeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 bg-muted/10 border border-border/30 rounded-2xl">
            <SparkleIcon className="size-10 opacity-30 animate-pulse" />
            <p className="text-sm font-medium">{seeds.length === 0 ? t("dashboard.adminTemplates.noSeedsInDb") : t("dashboard.adminTemplates.noSeedsMatch")}</p>
            {seeds.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedBusinessType("all"); setSelectedMood("all"); setScoreFilter("all"); setAestheticFilter("all"); }}>{t("dashboard.adminTemplates.resetSearch")}</Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t("dashboard.adminTemplates.entriesCount", undefined, { shown: String(filteredSeeds.length), total: String(seeds.length) })}</span>
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

                const isSelected = selectedIds.has(seed.id);

                return (
                  <Card key={seed.id} className={`overflow-hidden border-border/40 hover:border-border/80 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-[520px] relative ${isSelected ? "ring-2 ring-primary/60 border-primary/40" : ""}`}>
                    {/* Top Color Strip */}
                    <div className="h-28 relative flex items-end p-4 border-b border-border/30" style={{ background: pal ? `linear-gradient(135deg, ${pal.background || "#111"}, ${pal.surface || "#222"})` : "var(--muted)" }}>
                      <label className="absolute top-2 left-2 flex items-center justify-center size-6 rounded-md bg-black/40 backdrop-blur-md border border-border cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(seed.id)}
                          className="size-3.5 cursor-pointer accent-primary"
                        />
                      </label>
                      {pal && (
                        <div className="flex gap-1.5 p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-border/50">
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
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-border/50">
                          <Palette className="size-4 text-white/60" />
                          <span className="text-[10px] text-white/50 font-semibold">{t("dashboard.adminTemplates.noPalette")}</span>
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
                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">#{seed.id} · {seed.business_type} {seed.source_template_id && <span>· {t("dashboard.adminTemplates.base")}: <span className="font-bold">{seed.source_template_id}</span></span>}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge variant="outline" className={`font-mono font-bold text-[10px] border shrink-0 ${scoreColorClass}`}>
                              {t("dashboard.adminTemplates.score")}: {score}
                            </Badge>
                            {seed.aesthetic_score != null && (
                              <>
                                <Badge variant="outline" className={`font-mono font-bold text-[10px] border shrink-0 ${
                                  seed.aesthetic_score >= 80
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : seed.aesthetic_score >= 70
                                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                      : "bg-red-500/10 text-red-500 border-red-500/20"
                                }`}>
                                  {t("dashboard.adminTemplates.aestheticScore")}: {seed.aesthetic_score}
                                </Badge>
                                {seed.aesthetic_score < 70 && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-red-500">
                                    {t("dashboard.adminTemplates.needsReview")}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
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
                          <span>{t("dashboard.adminTemplates.heading")}:</span>
                          <span className="text-foreground font-medium truncate max-w-40" style={{ fontFamily: typo.heading_font }}>
                            {typo.heading_font} ({typo.heading_weight || t("dashboard.adminTemplates.normal")})
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>{t("dashboard.adminTemplates.body")}:</span>
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

                      {/* AI Critique result */}
                      {seed.aesthetic_critique && (
                        <div className="space-y-2 rounded-lg border border-border/20 bg-muted/20 p-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                              {t("dashboard.adminTemplates.critiqueTitle")}
                            </span>
                            {seed.aesthetic_critique.screenshot_url && (
                              <a
                                href={seed.aesthetic_critique.screenshot_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] text-primary underline shrink-0"
                              >
                                {t("dashboard.adminTemplates.critiqueScreenshot")}
                              </a>
                            )}
                          </div>
                          {seed.aesthetic_critique.verdict && (
                            <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-3">
                              {seed.aesthetic_critique.verdict}
                            </p>
                          )}
                          <button
                            onClick={() => setViewCritique(seed)}
                            className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline shrink-0"
                          >
                            {t("dashboard.adminTemplates.critiqueViewDetails")}
                            <ChevronRight className="size-3" />
                          </button>
                        </div>
                      )}

                      {/* Date + Actions */}
                      <div className="flex items-center justify-between gap-2 mt-auto pt-1 border-t border-border/20">
                        <span className="text-[10px] text-muted-foreground/60">
                          {new Date(seed.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            onClick={() => handleCritique(seed)}
                            disabled={critiquingId !== null}
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 text-[10px] bg-background hover:bg-muted/40 font-semibold gap-1 disabled:opacity-50"
                            title={t("dashboard.adminTemplates.critique")}
                          >
                            {critiquingId === seed.id
                              ? <Loader2 className="size-3 animate-spin" />
                              : <Sparkles className="size-3" />}
                            {critiquingId === seed.id
                              ? t("dashboard.adminTemplates.critiqueRunning")
                              : t("dashboard.adminTemplates.critique")}
                          </Button>
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
                            {t("dashboard.adminTemplates.view")}
                          </Button>
                          <Button 
                            onClick={() => handleDeleteSeed(seed.id)} 
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2.5 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold gap-1"
                          >
                            <Trash2 className="size-3" />
                            {t("dashboard.adminTemplates.delete")}
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

      {viewCritique?.aesthetic_critique && (
        <CritiqueDetailModal
          seed={viewCritique}
          onClose={() => setViewCritique(null)}
        />
      )}
    </div>
  );
}

function CritiqueDetailModal({ seed, onClose }: { seed: SeedEntry; onClose: () => void }) {
  const { t } = useI18n();
  const c = seed.aesthetic_critique!;

  const dims: { key: string; label: string; value?: number }[] = [
    { key: "overall", label: "Overall", value: c.overall },
    { key: "hierarchy", label: "Hierarchy", value: c.hierarchy },
    { key: "color_harmony", label: "Color Harmony", value: c.color_harmony },
    { key: "whitespace", label: "Whitespace", value: c.whitespace },
  ].filter((d) => typeof d.value === "number");

  const dimColor = (v: number) =>
    v >= 8 ? "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20"
      : v >= 5 ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20"
        : "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative mx-auto my-8 w-[min(44rem,100%)] rounded-2xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border/60 bg-background/95 backdrop-blur px-6 py-4 rounded-t-2xl">
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight truncate">
              {t("dashboard.adminTemplates.critiqueDetailsTitle")}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {seed.source_name || seed.source_template_id || `#${seed.id}`}
              {seed.aesthetic_score != null && (
                <span className="ml-2 font-mono font-bold">
                  {t("dashboard.adminTemplates.aestheticScore")}: {seed.aesthetic_score}
                </span>
              )}
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {c.screenshot_url && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t("dashboard.adminTemplates.critiqueScreenshotTitle")}
                </span>
                <a
                  href={c.screenshot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline shrink-0"
                >
                  {t("dashboard.adminTemplates.critiqueOpenScreenshot")}
                  <ExternalLink className="size-3" />
                </a>
              </div>
              <a href={c.screenshot_url} target="_blank" rel="noopener noreferrer" className="block">
                <img
                  src={c.screenshot_url}
                  alt="AI critique screenshot"
                  className="w-full rounded-lg border border-border/40 bg-zinc-900"
                  loading="lazy"
                />
              </a>
            </div>
          )}

          {dims.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("dashboard.adminTemplates.critiqueDimensions")}
              </span>
              <div className="flex flex-wrap gap-2">
                {dims.map((d) => (
                  <span
                    key={d.key}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono font-bold ${dimColor(d.value!)}`}
                  >
                    {d.label}: {d.value}/10
                  </span>
                ))}
              </div>
            </div>
          )}

          {c.verdict && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("dashboard.adminTemplates.critiqueVerdict")}
              </span>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                {c.verdict}
              </p>
            </div>
          )}

          {c.strengths && c.strengths.length > 0 && (
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-500">
                <CheckCircle2 className="size-3" />
                {t("dashboard.adminTemplates.critiqueStrengths")}
              </span>
              <ul className="space-y-1.5">
                {c.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-green-500" />
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {c.improvements && c.improvements.length > 0 && (
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-destructive">
                <AlertTriangle className="size-3" />
                {t("dashboard.adminTemplates.critiqueImprovements")}
              </span>
              <ul className="space-y-1.5">
                {c.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-red-500" />
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border/60 px-6 py-4">
          <Button size="sm" variant="outline" onClick={onClose}>
            {t("dashboard.adminTemplates.critiqueClose")}
          </Button>
        </div>
      </div>
    </div>
  );
}