"use client";

import { useState, useEffect, useCallback } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/components/toast-provider";
import {
  ShieldAlert, Type, Palette, Layers, LayoutGrid,
  Eye, EyeOff, Trash2, Plus, RotateCcw, Search,
  Lock, Unlock, ChevronDown, Sun, Moon, Check,
  SlidersHorizontal,
} from "lucide-react";
import {
  Card, CardContent, Button, Badge, Input, Separator,
} from "@/components/ui";
import {
  TYPOGRAPHY_PAIRINGS, COLOR_PATTERNS, INDUSTRY_PRESETS,
  type TypographyPairing, type ColorPattern, type IndustryPreset,
  loadDesignAssetsConfig, saveDesignAssetsConfig, resetDesignAssetsConfig,
  loadConfig, updateCache,
  REQUIRED_SECTIONS_DEFAULT,
} from "@/lib/design-assets-config";
import { useAuthToken } from "@/lib/auth-store";
import { scoreDesignToken, scoreBadgeClass } from "@/lib/design-token-score";
import { SECTION_META, BODY_SECTION_KEYS, OPTIONAL_SECTION_KEYS } from "@/app/dashboard/sites/[id]/editor-utils";
import { loadGoogleFont } from "@/components/templates/helpers";

const GOOGLE_FONTS_WHITELIST = [
  "Inter", "Roboto", "Open Sans", "Montserrat", "Lato",
  "Poppins", "Outfit", "Plus Jakarta Sans", "Work Sans", "DM Sans",
  "Playfair Display", "Merriweather", "Lora", "PT Serif",
  "Cinzel", "Cormorant Garamond", "Arvo",
  "Oswald", "Bebas Neue", "Space Grotesk",
  "Fraunces", "Bricolage Grotesque", "Sora", "Urbanist",
  "Schibsted Grotesk", "JetBrains Mono",
];

// All sections superadmin can manage (excludes seo — not a visual section)
const MANAGEABLE_SECTIONS = ["header", ...BODY_SECTION_KEYS, "footer"];

type Tab = "sections" | "pairings" | "patterns" | "presets";

// ─── Colour swatch strip ──────────────────────────────────────────────────────
function PaletteStrip({ palette }: { palette: ColorPattern["palette"] }) {
  return (
    <div className="flex gap-1.5">
      {(["primary", "accent", "background", "surface", "text"] as const).map((k) => (
        <div
          key={k}
          className="size-5 rounded-full border border-white/20 shadow-sm shrink-0"
          style={{ background: palette[k] }}
          title={`${k}: ${palette[k]}`}
        />
      ))}
    </div>
  );
}

// ─── Hidden / visible badge ───────────────────────────────────────────────────
function VisibilityBadge({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive gap-1 font-semibold">
      <EyeOff className="size-2.5" /> Disembunyikan
    </Badge>
  ) : (
    <Badge variant="outline" className="text-[10px] border-green-500/40 text-green-500 gap-1 font-semibold">
      <Eye className="size-2.5" /> Aktif
    </Badge>
  );
}

// ─── Sections Tab ─────────────────────────────────────────────────────────────
function SectionsTab({
  hiddenSections, requiredSections,
  onToggleHide, onToggleRequired, onReset,
}: {
  hiddenSections: Set<string>;
  requiredSections: Set<string>;
  onToggleHide: (key: string, hide: boolean) => void;
  onToggleRequired: (key: string, required: boolean) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Kelola section mana yang tersedia di editor website. Section yang disembunyikan tidak muncul di sidebar editor pengguna.
        </p>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5 shrink-0">
          <RotateCcw className="size-3.5" /> Reset Default
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {MANAGEABLE_SECTIONS.map((key) => {
          const meta = SECTION_META[key];
          const isHidden = hiddenSections.has(key);
          const isRequired = requiredSections.has(key);
          const isOptional = OPTIONAL_SECTION_KEYS.includes(key);
          const Icon = meta?.icon;

          return (
            <Card key={key} className={`border transition-all ${isHidden ? "opacity-50 border-border/30" : "border-border/50 hover:border-border/80"}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="size-4 text-muted-foreground shrink-0" />}
                    <div>
                      <p className="font-semibold text-sm">{meta?.label ?? key}</p>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase">{key}</p>
                    </div>
                  </div>
                  <VisibilityBadge hidden={isHidden} />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {isOptional && (
                    <Badge variant="secondary" className="text-[9px] h-4 px-1.5 font-semibold">Opsional</Badge>
                  )}
                  {isRequired && (
                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-amber-500/40 text-amber-500 font-semibold gap-0.5">
                      <Lock className="size-2" /> Wajib
                    </Badge>
                  )}
                </div>

                <Separator className="bg-border/30" />

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isHidden ? "default" : "outline"}
                    className="flex-1 h-7 text-[11px] font-semibold gap-1"
                    disabled={isRequired && !isHidden}
                    onClick={() => onToggleHide(key, !isHidden)}
                  >
                    {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                  </Button>
                  <Button
                    size="sm"
                    variant={isRequired ? "secondary" : "outline"}
                    className="flex-1 h-7 text-[11px] font-semibold gap-1"
                    onClick={() => onToggleRequired(key, !isRequired)}
                    title={isRequired ? "Lepas wajib (bisa disembunyikan)" : "Jadikan wajib (tidak bisa disembunyikan)"}
                  >
                    {isRequired ? <><Unlock className="size-3" /> Lepas Wajib</> : <><Lock className="size-3" /> Wajibkan</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── New Pairing Form ─────────────────────────────────────────────────────────
const EMPTY_PAIRING: Omit<TypographyPairing, "id"> = {
  name: "", description: "",
  heading_font: "Inter", body_font: "Inter",
  heading_weight: "700", heading_size_hero: "3rem",
};

function AddPairingForm({ onAdd, onCancel }: { onAdd: (p: TypographyPairing) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...EMPTY_PAIRING });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.heading_font || !form.body_font) return;
    onAdd({ ...form, id: `custom-${Date.now()}`, is_custom: true });
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">Tambah Pasangan Font Baru</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Nama</label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="cth. Startup Bold" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Deskripsi</label>
            <Input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Singkat, 1 kalimat" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Font Heading</label>
            <select value={form.heading_font} onChange={(e) => set("heading_font", e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {GOOGLE_FONTS_WHITELIST.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Font Body</label>
            <select value={form.body_font} onChange={(e) => set("body_font", e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {GOOGLE_FONTS_WHITELIST.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Ketebalan</label>
            <select value={form.heading_weight} onChange={(e) => set("heading_weight", e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {["300","400","500","600","700","800","900"].map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Ukuran Hero</label>
            <select value={form.heading_size_hero} onChange={(e) => set("heading_size_hero", e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {["2rem","2.5rem","3rem","3.5rem","4rem"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">Batal</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!form.name.trim()} className="h-7 text-xs gap-1"><Check className="size-3" /> Simpan</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Typography Pairings Tab ──────────────────────────────────────────────────
function PairingsTab({
  hiddenPairings, customPairings, onToggleHide, onAdd, onDelete,
}: {
  hiddenPairings: Set<string>;
  customPairings: TypographyPairing[];
  onToggleHide: (id: string, hide: boolean) => void;
  onAdd: (p: TypographyPairing) => void;
  onDelete: (id: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const allPairings = [...TYPOGRAPHY_PAIRINGS, ...customPairings];
  const filtered = allPairings.filter((p) =>
    search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.heading_font.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    allPairings.forEach((p) => loadGoogleFont(p.heading_font, p.body_font));
  }, [customPairings.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Cari pasangan font..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5 shrink-0 h-9">
          <Plus className="size-3.5" /> Tambah
        </Button>
      </div>

      {showAdd && (
        <AddPairingForm onAdd={(p) => { onAdd(p); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((pairing) => {
          const isHidden = hiddenPairings.has(pairing.id);
          return (
            <Card key={pairing.id} className={`overflow-hidden transition-all flex flex-col ${isHidden ? "opacity-50 border-border/20" : "border-border/40 hover:border-border/70"}`}>
              {/* Preview strip */}
              <div className="h-20 bg-zinc-950 flex flex-col justify-center px-4 border-b border-white/5">
                <p style={{ fontFamily: `'${pairing.heading_font}', sans-serif`, fontWeight: pairing.heading_weight, fontStyle: pairing.heading_style ?? "normal", textTransform: (pairing.heading_transform ?? "none") as any, letterSpacing: pairing.heading_tracking ?? "normal", fontSize: "16px", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                  {pairing.name}
                </p>
                <p style={{ fontFamily: `'${pairing.body_font}', sans-serif`, fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0, marginTop: 4 }}>
                  {pairing.heading_font} / {pairing.body_font}
                </p>
              </div>

              <CardContent className="p-3 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{pairing.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{pairing.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    <VisibilityBadge hidden={isHidden} />
                    {pairing.is_custom && <Badge variant="secondary" className="text-[9px] h-4 px-1.5">Custom</Badge>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-auto">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{pairing.heading_weight}w</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{pairing.heading_size_hero}</span>
                  {pairing.heading_transform && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{pairing.heading_transform}</span>}
                </div>

                <Separator className="bg-border/30" />

                <div className="flex gap-1.5">
                  <Button size="sm" variant={isHidden ? "default" : "outline"} className="flex-1 h-7 text-[11px] gap-1" onClick={() => onToggleHide(pairing.id, !isHidden)}>
                    {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                  </Button>
                  {pairing.is_custom && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(pairing.id)}>
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">Tidak ada pasangan font yang cocok.</div>
      )}
    </div>
  );
}

// ─── New Pattern Form ─────────────────────────────────────────────────────────
const EMPTY_PATTERN_PALETTE = { primary: "#4F46E5", accent: "#7C3AED", background: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A" };

function AddPatternForm({ onAdd, onCancel }: { onAdd: (p: ColorPattern) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [palette, setPalette] = useState({ ...EMPTY_PATTERN_PALETTE });
  const setPaletteKey = (k: string, v: string) => setPalette((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ id: `custom-${Date.now()}`, name, description, palette, theme_mode: themeMode, is_custom: true });
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">Tambah Palet Warna Baru</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Nama</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Laut Biru" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Deskripsi</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Singkat, 1 kalimat" className="h-8 text-xs" />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-5">
          {(["primary","accent","background","surface","text"] as const).map((k) => (
            <div key={k} className="space-y-1">
              <label className="text-[9px] font-semibold uppercase text-muted-foreground block capitalize">{k}</label>
              <div className="flex items-center gap-1.5">
                <div className="relative size-6 rounded border border-border overflow-hidden shrink-0">
                  <input type="color" value={palette[k]} onChange={(e) => setPaletteKey(k, e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  <div className="w-full h-full" style={{ backgroundColor: palette[k] }} />
                </div>
                <Input value={palette[k]} onChange={(e) => setPaletteKey(k, e.target.value)} className="h-6 text-[10px] font-mono px-1.5 min-w-0" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Mode</label>
          <button type="button" onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")} className="flex items-center gap-1.5 px-2 py-1 rounded border border-border/50 text-xs font-medium">
            {themeMode === "light" ? <><Sun className="size-3" /> Terang</> : <><Moon className="size-3" /> Gelap</>}
          </button>
        </div>
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">Batal</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!name.trim()} className="h-7 text-xs gap-1"><Check className="size-3" /> Simpan</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Color Patterns Tab ───────────────────────────────────────────────────────
function PatternsTab({
  hiddenPatterns, customPatterns, onToggleHide, onAdd, onDelete,
}: {
  hiddenPatterns: Set<string>;
  customPatterns: ColorPattern[];
  onToggleHide: (id: string, hide: boolean) => void;
  onAdd: (p: ColorPattern) => void;
  onDelete: (id: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const allPatterns = [...COLOR_PATTERNS, ...customPatterns];
  const filtered = allPatterns.filter((p) =>
    search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Cari palet warna..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5 shrink-0 h-9">
          <Plus className="size-3.5" /> Tambah
        </Button>
      </div>

      {showAdd && <AddPatternForm onAdd={(p) => { onAdd(p); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((pattern) => {
          const isHidden = hiddenPatterns.has(pattern.id);
          const mockDt = { palette: pattern.palette };
          const { total: score } = scoreDesignToken(mockDt);
          return (
            <Card key={pattern.id} className={`overflow-hidden transition-all flex flex-col ${isHidden ? "opacity-50 border-border/20" : "border-border/40 hover:border-border/70"}`}>
              {/* Colour strip */}
              <div className="h-20 relative flex items-end p-3 border-b border-border/30"
                style={{ background: `linear-gradient(135deg, ${pattern.palette.background}, ${pattern.palette.surface})` }}>
                <div className="flex gap-1.5 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm border border-white/5">
                  <PaletteStrip palette={pattern.palette} />
                </div>
                <div className="absolute top-2 right-2">
                  {pattern.theme_mode === "dark" ? <Moon className="size-3.5 text-white/50" /> : <Sun className="size-3.5 text-black/40" />}
                </div>
              </div>

              <CardContent className="p-3 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{pattern.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{pattern.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    <VisibilityBadge hidden={isHidden} />
                    {pattern.is_custom && <Badge variant="secondary" className="text-[9px] h-4 px-1.5">Custom</Badge>}
                  </div>
                </div>

                <Badge variant="outline" className={`self-start text-[10px] font-mono font-bold border ${scoreBadgeClass(score)}`}>
                  Score: {score}
                </Badge>

                <Separator className="bg-border/30" />

                <div className="flex gap-1.5">
                  <Button size="sm" variant={isHidden ? "default" : "outline"} className="flex-1 h-7 text-[11px] gap-1" onClick={() => onToggleHide(pattern.id, !isHidden)}>
                    {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                  </Button>
                  {pattern.is_custom && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(pattern.id)}>
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">Tidak ada palet yang cocok.</div>
      )}
    </div>
  );
}

// ─── New Preset Form ──────────────────────────────────────────────────────────
function AddPresetForm({
  onAdd, onCancel,
  enabledPairingIds, enabledPatternIds,
}: {
  onAdd: (p: IndustryPreset) => void;
  onCancel: () => void;
  enabledPairingIds: string[];
  enabledPatternIds: string[];
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("💼");
  const [pairingId, setPairingId] = useState(enabledPairingIds[0] ?? "");
  const [patternId, setPatternId] = useState(enabledPatternIds[0] ?? "");

  const handleSubmit = () => {
    if (!name.trim() || !pairingId || !patternId) return;
    onAdd({ id: `custom-${Date.now()}`, name, description, icon, pairing_id: pairingId, pattern_id: patternId, is_custom: true });
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">Tambah Paket Tampilan Baru</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Nama</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Apotek Modern" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Deskripsi</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Singkat, 1 kalimat" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Ikon Emoji</label>
            <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🏥" className="h-8 text-xs" maxLength={4} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Pasangan Font</label>
            <select value={pairingId} onChange={(e) => setPairingId(e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {enabledPairingIds.map((id) => {
                const p = TYPOGRAPHY_PAIRINGS.find((t) => t.id === id);
                return <option key={id} value={id}>{p?.name ?? id}</option>;
              })}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Palet Warna</label>
            <select value={patternId} onChange={(e) => setPatternId(e.target.value)} className="w-full h-8 px-2 text-xs border border-border/50 rounded-md bg-background">
              {enabledPatternIds.map((id) => {
                const p = COLOR_PATTERNS.find((c) => c.id === id);
                return <option key={id} value={id}>{p?.name ?? id}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel} className="h-7 text-xs">Batal</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!name.trim()} className="h-7 text-xs gap-1"><Check className="size-3" /> Simpan</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Industry Presets Tab ─────────────────────────────────────────────────────
function PresetsTab({
  hiddenPresets, customPresets, hiddenPairings, hiddenPatterns, customPairings, customPatterns,
  onToggleHide, onAdd, onDelete,
}: {
  hiddenPresets: Set<string>;
  customPresets: IndustryPreset[];
  hiddenPairings: Set<string>;
  hiddenPatterns: Set<string>;
  customPairings: TypographyPairing[];
  customPatterns: ColorPattern[];
  onToggleHide: (id: string, hide: boolean) => void;
  onAdd: (p: IndustryPreset) => void;
  onDelete: (id: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const allPresets = [...INDUSTRY_PRESETS, ...customPresets];
  const allPairings = [...TYPOGRAPHY_PAIRINGS, ...customPairings];
  const allPatterns = [...COLOR_PATTERNS, ...customPatterns];
  const filtered = allPresets.filter((p) =>
    search === "" || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const enabledPairingIds = allPairings.filter((p) => !hiddenPairings.has(p.id)).map((p) => p.id);
  const enabledPatternIds = allPatterns.filter((p) => !hiddenPatterns.has(p.id)).map((p) => p.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input placeholder="Cari paket tampilan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5 shrink-0 h-9">
          <Plus className="size-3.5" /> Tambah
        </Button>
      </div>

      {showAdd && (
        <AddPresetForm
          onAdd={(p) => { onAdd(p); setShowAdd(false); }}
          onCancel={() => setShowAdd(false)}
          enabledPairingIds={enabledPairingIds}
          enabledPatternIds={enabledPatternIds}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((preset) => {
          const isHidden = hiddenPresets.has(preset.id);
          const pairing = allPairings.find((p) => p.id === preset.pairing_id);
          const pattern = allPatterns.find((p) => p.id === preset.pattern_id);

          return (
            <Card key={preset.id} className={`overflow-hidden transition-all flex flex-col ${isHidden ? "opacity-50 border-border/20" : "border-border/40 hover:border-border/70"}`}>
              {/* Strip */}
              <div className="h-20 relative flex flex-col justify-end p-3 border-b border-border/30"
                style={{ background: pattern ? `linear-gradient(135deg, ${pattern.palette.background}, ${pattern.palette.surface})` : "var(--muted)" }}>
                {pattern && (
                  <div className="flex gap-1.5 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm border border-white/5 w-fit">
                    <PaletteStrip palette={pattern.palette} />
                  </div>
                )}
                <span className="absolute top-2 right-2 text-xl">{preset.icon}</span>
              </div>

              <CardContent className="p-3 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{preset.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{preset.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    <VisibilityBadge hidden={isHidden} />
                    {preset.is_custom && <Badge variant="secondary" className="text-[9px] h-4 px-1.5">Custom</Badge>}
                  </div>
                </div>

                {pairing && (
                  <div className="text-[10px] text-muted-foreground bg-muted/30 px-2 py-1 rounded-md space-y-0.5">
                    <p style={{ fontFamily: `'${pairing.heading_font}', sans-serif`, fontWeight: pairing.heading_weight, fontSize: "11px", color: "var(--foreground)" }}>
                      {pairing.heading_font}
                    </p>
                    <p style={{ fontFamily: `'${pairing.body_font}', sans-serif`, fontSize: "10px" }}>{pairing.body_font}</p>
                  </div>
                )}

                <Separator className="bg-border/30" />

                <div className="flex gap-1.5">
                  <Button size="sm" variant={isHidden ? "default" : "outline"} className="flex-1 h-7 text-[11px] gap-1" onClick={() => onToggleHide(preset.id, !isHidden)}>
                    {isHidden ? <><Eye className="size-3" /> Tampilkan</> : <><EyeOff className="size-3" /> Sembunyikan</>}
                  </Button>
                  {preset.is_custom && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(preset.id)}>
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">Tidak ada paket yang cocok.</div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DesignAssetsPage() {
  const { role: userRole } = usePermissions();
  const { pushToast } = useToast();
  const authToken = useAuthToken();
  const isSuperAdmin = userRole === "superadmin";
  const [saving, setSaving] = useState(false);

  // Local config state (mirrors API / localStorage)
  const [hiddenPairings, setHiddenPairings] = useState<Set<string>>(new Set());
  const [hiddenPatterns, setHiddenPatterns] = useState<Set<string>>(new Set());
  const [hiddenPresets, setHiddenPresets] = useState<Set<string>>(new Set());
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [requiredSections, setRequiredSections] = useState<Set<string>>(new Set(REQUIRED_SECTIONS_DEFAULT));
  const [customPairings, setCustomPairings] = useState<TypographyPairing[]>([]);
  const [customPatterns, setCustomPatterns] = useState<ColorPattern[]>([]);
  const [customPresets, setCustomPresets] = useState<IndustryPreset[]>([]);
  const [tab, setTab] = useState<Tab>("sections");
  const [loading, setLoading] = useState(true);

  // Load config from API (falls back to localStorage) on mount
  useEffect(() => {
    if (!isSuperAdmin) return;
    setLoading(true);
    loadDesignAssetsConfig(authToken).then((cfg) => {
      setHiddenPairings(new Set(cfg.hidden_pairings));
      setHiddenPatterns(new Set(cfg.hidden_patterns));
      setHiddenPresets(new Set(cfg.hidden_presets));
      setHiddenSections(new Set(cfg.hidden_sections));
      setRequiredSections(new Set(cfg.required_sections));
      setCustomPairings(cfg.custom_pairings ?? []);
      setCustomPatterns(cfg.custom_patterns ?? []);
      setCustomPresets(cfg.custom_presets ?? []);
    }).finally(() => setLoading(false));
  }, [isSuperAdmin, authToken]);

  const syncAndPersist = useCallback(async (updater: (prev: ReturnType<typeof loadConfig>) => ReturnType<typeof loadConfig>) => {
    const next = updater(loadConfig());
    // Update in-memory cache + localStorage mirror immediately (optimistic)
    updateCache(next);
    setHiddenPairings(new Set(next.hidden_pairings));
    setHiddenPatterns(new Set(next.hidden_patterns));
    setHiddenPresets(new Set(next.hidden_presets));
    setHiddenSections(new Set(next.hidden_sections));
    setRequiredSections(new Set(next.required_sections));
    setCustomPairings(next.custom_pairings ?? []);
    setCustomPatterns(next.custom_patterns ?? []);
    setCustomPresets(next.custom_presets ?? []);
    // Persist to API in background
    if (authToken) {
      setSaving(true);
      try {
        await saveDesignAssetsConfig(next, authToken);
      } catch {
        pushToast("Gagal menyimpan ke server. Perubahan tersimpan lokal.", "error");
      } finally {
        setSaving(false);
      }
    }
  }, [authToken, pushToast]);

  if (!isSuperAdmin) {    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground gap-4 animate-in fade-in duration-300">
        <ShieldAlert className="size-16 text-destructive opacity-80" />
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-foreground">Akses Ditolak</h2>
          <p className="text-sm max-w-sm">Halaman ini hanya dapat diakses oleh akun dengan peran <span className="font-semibold text-primary">Superadmin</span>.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3 text-muted-foreground animate-in fade-in duration-300">
        <SlidersHorizontal className="size-8 animate-pulse text-primary" />
        <p className="text-sm font-medium">Memuat konfigurasi design assets...</p>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: "sections", label: "Sections", icon: LayoutGrid, count: MANAGEABLE_SECTIONS.length - hiddenSections.size },
    { id: "pairings", label: "Tipografi", icon: Type, count: TYPOGRAPHY_PAIRINGS.length + customPairings.length - hiddenPairings.size },
    { id: "patterns", label: "Palet Warna", icon: Palette, count: COLOR_PATTERNS.length + customPatterns.length - hiddenPatterns.size },
    { id: "presets", label: "Paket Tampilan", icon: Layers, count: INDUSTRY_PRESETS.length + customPresets.length - hiddenPresets.size },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-foreground">
            <SlidersHorizontal className="size-6 text-primary" />
            Design Assets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola section, tipografi, palet warna, dan paket tampilan yang tersedia di editor website.
          {saving && <span className="text-[10px] text-muted-foreground animate-pulse font-medium">Menyimpan...</span>}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 shrink-0"
          onClick={async () => {
            if (!window.confirm("Reset semua pengaturan Design Assets ke default?")) return;
            setSaving(true);
            try {
              const cfg = authToken
                ? await resetDesignAssetsConfig(authToken)
                : (() => { updateCache({ hidden_pairings: [], hidden_patterns: [], hidden_presets: [], hidden_sections: [], required_sections: REQUIRED_SECTIONS_DEFAULT, custom_pairings: [], custom_patterns: [], custom_presets: [] }); return loadConfig(); })();
              setHiddenPairings(new Set(cfg.hidden_pairings));
              setHiddenPatterns(new Set(cfg.hidden_patterns));
              setHiddenPresets(new Set(cfg.hidden_presets));
              setHiddenSections(new Set(cfg.hidden_sections));
              setRequiredSections(new Set(cfg.required_sections));
              setCustomPairings(cfg.custom_pairings ?? []);
              setCustomPatterns(cfg.custom_patterns ?? []);
              setCustomPresets(cfg.custom_presets ?? []);
              pushToast("Semua pengaturan Design Assets direset ke default.", "success");
            } catch {
              pushToast("Gagal reset ke server.", "error");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
        >
          <RotateCcw className={`size-3.5 ${saving ? "animate-spin" : ""}`} /> Reset Semua
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-border/40 pb-px gap-1">
        {TABS.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 flex items-center gap-2 ${
              tab === id
                ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === id ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "sections" && (
        <SectionsTab
          hiddenSections={hiddenSections}
          requiredSections={requiredSections}
          onToggleHide={(key, hide) => {
            if (hide && requiredSections.has(key)) {
              pushToast(`Section "${key}" wajib aktif dan tidak bisa disembunyikan.`, "error");
              return;
            }
            syncAndPersist((cfg) => {
              const s = new Set(cfg.hidden_sections);
              hide ? s.add(key) : s.delete(key);
              return { ...cfg, hidden_sections: Array.from(s) };
            });
            pushToast(hide ? `Section "${key}" disembunyikan.` : `Section "${key}" ditampilkan.`, "success");
          }}
          onToggleRequired={(key, required) => {
            syncAndPersist((cfg) => {
              const s = new Set(cfg.required_sections);
              required ? s.add(key) : s.delete(key);
              // If making required, also un-hide it
              const h = new Set(cfg.hidden_sections);
              if (required) h.delete(key);
              return { ...cfg, required_sections: Array.from(s), hidden_sections: Array.from(h) };
            });
            pushToast(required ? `Section "${key}" dijadikan wajib.` : `Section "${key}" bisa disembunyikan.`, "success");
          }}
          onReset={() => {
            syncAndPersist((cfg) => ({ ...cfg, hidden_sections: [], required_sections: REQUIRED_SECTIONS_DEFAULT }));
            pushToast("Pengaturan sections direset.", "success");
          }}
        />
      )}

      {tab === "pairings" && (
        <PairingsTab
          hiddenPairings={hiddenPairings}
          customPairings={customPairings}
          onToggleHide={(id, hide) => {
            syncAndPersist((cfg) => {
              const s = new Set(cfg.hidden_pairings);
              hide ? s.add(id) : s.delete(id);
              return { ...cfg, hidden_pairings: Array.from(s) };
            });
            pushToast(hide ? "Pasangan font disembunyikan." : "Pasangan font ditampilkan.", "success");
          }}
          onAdd={(p) => {
            syncAndPersist((cfg) => ({ ...cfg, custom_pairings: [...(cfg.custom_pairings ?? []), p] }));
            pushToast(`Pasangan font "${p.name}" ditambahkan.`, "success");
          }}
          onDelete={(id) => {
            if (!window.confirm("Hapus pasangan font custom ini?")) return;
            syncAndPersist((cfg) => ({ ...cfg, custom_pairings: (cfg.custom_pairings ?? []).filter((p) => p.id !== id) }));
            pushToast("Pasangan font dihapus.", "success");
          }}
        />
      )}

      {tab === "patterns" && (
        <PatternsTab
          hiddenPatterns={hiddenPatterns}
          customPatterns={customPatterns}
          onToggleHide={(id, hide) => {
            syncAndPersist((cfg) => {
              const s = new Set(cfg.hidden_patterns);
              hide ? s.add(id) : s.delete(id);
              return { ...cfg, hidden_patterns: Array.from(s) };
            });
            pushToast(hide ? "Palet disembunyikan." : "Palet ditampilkan.", "success");
          }}
          onAdd={(p) => {
            syncAndPersist((cfg) => ({ ...cfg, custom_patterns: [...(cfg.custom_patterns ?? []), p] }));
            pushToast(`Palet "${p.name}" ditambahkan.`, "success");
          }}
          onDelete={(id) => {
            if (!window.confirm("Hapus palet custom ini?")) return;
            syncAndPersist((cfg) => ({ ...cfg, custom_patterns: (cfg.custom_patterns ?? []).filter((p) => p.id !== id) }));
            pushToast("Palet dihapus.", "success");
          }}
        />
      )}

      {tab === "presets" && (
        <PresetsTab
          hiddenPresets={hiddenPresets}
          customPresets={customPresets}
          hiddenPairings={hiddenPairings}
          hiddenPatterns={hiddenPatterns}
          customPairings={customPairings}
          customPatterns={customPatterns}
          onToggleHide={(id, hide) => {
            syncAndPersist((cfg) => {
              const s = new Set(cfg.hidden_presets);
              hide ? s.add(id) : s.delete(id);
              return { ...cfg, hidden_presets: Array.from(s) };
            });
            pushToast(hide ? "Paket tampilan disembunyikan." : "Paket tampilan ditampilkan.", "success");
          }}
          onAdd={(p) => {
            syncAndPersist((cfg) => ({ ...cfg, custom_presets: [...(cfg.custom_presets ?? []), p] }));
            pushToast(`Paket "${p.name}" ditambahkan.`, "success");
          }}
          onDelete={(id) => {
            if (!window.confirm("Hapus paket tampilan custom ini?")) return;
            syncAndPersist((cfg) => ({ ...cfg, custom_presets: (cfg.custom_presets ?? []).filter((p) => p.id !== id) }));
            pushToast("Paket tampilan dihapus.", "success");
          }}
        />
      )}
    </div>
  );
}
