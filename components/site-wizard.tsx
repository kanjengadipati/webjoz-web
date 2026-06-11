"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/client";
import { suggestSubdomains } from "@/lib/api/ai";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Globe,
  Laptop,
  Loader2,
  Settings,
  ShieldAlert,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { suggestTemplate } from "@/lib/template-registry";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface WizardDraftState {
  businessName: string;
  businessType: string;
  description: string;
  location: string;
  phone: string;
  sellingPoints: string[];
  addressType: "subdomain" | "custom";
  subdomain: string;
  customDomain: string;
  templateId: string;
  ageGroup?: string;
  tone?: string;
  motives?: string[];
  mood?: string;
  layoutStyle?: string;
  tagline?: string;
  story?: string;
  proof?: string;
}

export interface SiteWizardProps {
  /** Runtime mode. "public" can resume after auth; "dashboard" uses the active workspace directly. */
  mode: "public" | "dashboard";
  token: string | null;
  /** Whether auth store has finished loading (needed for public pending-resume logic) */
  authReady?: boolean;
  /** Whether the active tenant store is loading data */
  tenantLoading?: boolean;
  activeTenantId: number | string | null;
  memberships?: { tenant: { id: number | string } }[];
  /** Required in public mode to create a default workspace on first launch */
  createTenant?: (name: string, slug: string) => Promise<{ id: number | string } | null>;
  /** Called in public mode when user tries to launch without a token */
  onNeedAuth?: () => void;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DRAFT_KEY = "webjoz_wizard_draft";
const PENDING_KEY = "webjoz_pending_wizard_data";

const AI_LOADING_STEPS = [
  "Menganalisis profil bisnis Anda...",
  "Merumuskan headline copywriting yang memikat...",
  "Menyusun deskripsi layanan secara terstruktur...",
  "Merumuskan Pertanyaan Umum (FAQ) pelanggan...",
  "Mengatur optimasi tag metadata SEO...",
  "Membuat halaman web & layout visual...",
  "Mempublikasikan website ke domain pilihan...",
];

const BUSINESS_TYPES = [
  { value: "Kuliner", label: "Kuliner" },
  { value: "Toko/UMKM", label: "Toko/UMKM" },
  { value: "Online Shop", label: "Online shop" },
  { value: "Jasa", label: "Jasa" },
  { value: "Industri", label: "Industri" },
  { value: "Organisasi", label: "Organisasi" },
  { value: "Lainnya", label: "Lainnya" },
];

const AGE_OPTIONS = ["Remaja (15-24)", "Dewasa muda (25-35)", "Dewasa (35-50)", "Semua usia"];
const TONE_OPTIONS = ["Santai & akrab", "Profesional & formal", "Inspiratif & motivasi", "Lugas & to the point"];
const MOTIVE_OPTIONS = ["Harga terjangkau", "Kualitas premium", "Lokasi dekat/mudah", "Rekomendasi teman", "Ada yang unik/beda"];
const LAYOUT_OPTIONS = ["Minimalis & ruang lega", "Penuh informasi", "Foto & visual dominan", "Storytelling dari atas ke bawah"];
const USP_OPTIONS = [
  "Buatan sendiri/homemade",
  "Bahan lokal pilihan",
  "Pengalaman 5+ tahun",
  "Harga paling terjangkau",
  "Layanan cepat & responsif",
  "Bersertifikasi/terlisensi",
  "Antar ke lokasi",
  "Bisa custom/pesanan khusus",
];

const MOOD_OPTIONS = [
  {
    value: "Hangat & earthy",
    title: "Hangat & earthy",
    desc: "Coklat, terra cotta, hijau natural",
    colors: ["#D85A30", "#BA7517", "#639922"],
  },
  {
    value: "Bersih & modern",
    title: "Bersih & modern",
    desc: "Putih, abu, biru korporat",
    colors: ["#378ADD", "#888780", "#B4B2A9"],
  },
  {
    value: "Bold & vibrant",
    title: "Bold & vibrant",
    desc: "Merah muda, ungu, kuning cerah",
    colors: ["#D4537E", "#7F77DD", "#EF9F27"],
  },
  {
    value: "Gelap & premium",
    title: "Gelap & premium",
    desc: "Hitam, teal aksen, emas",
    colors: ["#2C2C2A", "#5DCAA5", "#FAC775"],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function SiteWizard({
  mode,
  token,
  authReady,
  tenantLoading,
  activeTenantId,
  memberships,
  createTenant,
  onNeedAuth,
}: SiteWizardProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const isDark = true;

  // ── Wizard state ────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Kuliner");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [sellingPoints, setSellingPoints] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState("");
  const [tone, setTone] = useState("");
  const [motives, setMotives] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [layoutStyle, setLayoutStyle] = useState("");
  const [story, setStory] = useState("");
  const [tagline, setTagline] = useState("");
  const [proof, setProof] = useState("");

  // Address
  const [addressType, setAddressType] = useState<"subdomain" | "custom">("subdomain");
  const [subdomain, setSubdomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [isSubdomainManuallyEdited, setIsSubdomainManuallyEdited] = useState(false);

  // Template
  const [templateId, setTemplateId] = useState("TEMPLATE_KULINER01");

  // Result
  const [generatedSite, setGeneratedSite] = useState<{ id: string; subdomain: string; customDomain: string } | null>(null);

  // AI subdomain suggestions
  const [subdomainSuggestions, setSubdomainSuggestions] = useState<string[]>([]);
  const [suggestingSubdomains, setSuggestingSubdomains] = useState(false);
  const suggestDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AI loading rotator
  const [aiStepIdx, setAiStepIdx] = useState(0);

  // ── Initialisation: localStorage draft + URL params ─────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (mode === "public") {
      // Restore draft
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        try {
          const d: Partial<WizardDraftState> = JSON.parse(raw);
          if (d.businessName) setBusinessName(d.businessName);
          if (d.businessType) setBusinessType(d.businessType);
          if (d.description) setDescription(d.description);
          if (d.location) setLocation(d.location);
          if (d.phone) setPhone(d.phone);
          if (d.sellingPoints) setSellingPoints(d.sellingPoints);
          if (d.addressType) setAddressType(d.addressType);
          if (d.subdomain) { setSubdomain(d.subdomain); setIsSubdomainManuallyEdited(true); }
          if (d.customDomain) setCustomDomain(d.customDomain);
          if (d.templateId) setTemplateId(d.templateId);
          if (d.ageGroup) setAgeGroup(d.ageGroup);
          if (d.tone) setTone(d.tone);
          if (d.motives) setMotives(d.motives);
          if (d.mood) setMood(d.mood);
          if (d.layoutStyle) setLayoutStyle(d.layoutStyle);
          if (d.story) setStory(d.story);
          if (d.tagline) setTagline(d.tagline);
          if (d.proof) setProof(d.proof);
        } catch { }
      }
    }

    if (mode === "dashboard") {
      // Pre-fill from query params
      const p = new URLSearchParams(window.location.search);
      if (p.get("name")) setBusinessName(p.get("name")!);
      if (p.get("product")) setDescription(p.get("product")!);
      if (p.get("phone")) setPhone(p.get("phone")!);
      if (p.get("city")) setLocation(p.get("city")!);
      const type = p.get("type");
      if (type) {
        setBusinessType(type);
        if (!p.get("template")) {
          setTemplateId(suggestTemplate(type).id);
        }
      }
      if (p.get("template")) setTemplateId(p.get("template")!);
      const points: string[] = [];
      if (p.get("market")) points.push(`Target pasar: ${p.get("market")}`);
      if (p.get("problem")) points.push(`Masalah customer: ${p.get("problem")}`);
      if (p.get("advantages")) points.push(`Keunggulan: ${p.get("advantages")}`);
      if (points.length > 0) setSellingPoints(points);
      if (p.get("market")) setAgeGroup(p.get("market")!);
      if (p.get("tone")) setTone(p.get("tone")!);
    }

    // Both modes: ?template= param jumps to step 2
    const templateParam = new URLSearchParams(window.location.search).get("template");
    if (templateParam) {
      setTemplateId(templateParam);
      setStep(4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ── Save draft to localStorage (public mode) ─────────────────────────────
  useEffect(() => {
    if (mode !== "public" || typeof window === "undefined") return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      businessName, businessType, description, location, phone, sellingPoints,
      addressType, subdomain, customDomain, templateId,
      ageGroup, tone, motives, mood, layoutStyle, story, tagline, proof,
    }));
  }, [mode, businessName, businessType, description, location, phone, sellingPoints,
    addressType, subdomain, customDomain, templateId,
    ageGroup, tone, motives, mood, layoutStyle, story, tagline, proof]);

  // ── Pending-resume after login (public mode) ─────────────────────────────
  useEffect(() => {
    if (mode !== "public" || !authReady) return;
    if (token && tenantLoading) return; // Wait until tenant store has loaded memberships and tenantId
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;
    try {
      const d: WizardDraftState = JSON.parse(raw);
      setBusinessName(d.businessName || "");
      setBusinessType(d.businessType || "Kuliner");
      setDescription(d.description || "");
      setLocation(d.location || "");
      setPhone(d.phone || "");
      setSellingPoints(d.sellingPoints || []);
      setAddressType(d.addressType || "subdomain");
      setSubdomain(d.subdomain || "");
      setCustomDomain(d.customDomain || "");
      setTemplateId(d.templateId || "TEMPLATE_KULINER01");
      setAgeGroup(d.ageGroup || "");
      setTone(d.tone || "");
      setMotives(d.motives || []);
      setMood(d.mood || "");
      setLayoutStyle(d.layoutStyle || "");
      setStory(d.story || "");
      setTagline(d.tagline || "");
      setProof(d.proof || "");

      setStep(4); // Return to final review/generate step
      if (token) {
        pushToast("Autentikasi berhasil! Draf website Anda telah dipulihkan.", "success");
      }
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, token, mode, tenantLoading]);

  // ── Auto-fill subdomain from business name ───────────────────────────────
  useEffect(() => {
    if (!isSubdomainManuallyEdited && businessName) {
      setSubdomain(businessName.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    }
  }, [businessName, isSubdomainManuallyEdited]);

  // ── AI subdomain suggestions ─────────────────────────────────────────────
  useEffect(() => {
    if (!businessName.trim()) { setSubdomainSuggestions([]); return; }
    if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current);
    suggestDebounceRef.current = setTimeout(async () => {
      try {
        setSuggestingSubdomains(true);
        const res = await suggestSubdomains(businessName);
        if (res.status === "success" && res.data?.suggestions) {
          setSubdomainSuggestions(res.data.suggestions);
        }
      } catch {
        // Ignore suggestion errors
      } finally {
        setSuggestingSubdomains(false);
      }
    }, 600);
    return () => { if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current); };
  }, [businessName]);

  // ── AI loading step rotator ──────────────────────────────────────────────
  useEffect(() => {
    if (step !== 5) return;
    const interval = setInterval(() => {
      setAiStepIdx((prev) => (prev < AI_LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, [step]);

  // ── Core launch function (accepts data directly to avoid stale-state issues) ─
  const launchWithData = useCallback(async (data: WizardDraftState, authToken: string) => {
    try {
      setStep(5);
      setLoading(true);
      setError("");
      setAiStepIdx(0);

      let tenantId: number | string | null = activeTenantId;

      // Public mode: create default workspace if needed
      if (mode === "public" && (!tenantId || !memberships?.some((m) => m.tenant.id === tenantId))) {
        if (!createTenant) throw new Error("createTenant callback diperlukan di public mode.");
        const profileRes = await request<{ id: string }>("/auth/profile", {}, authToken);
        const slugSuggestion =
          profileRes.status === "success" && profileRes.data?.id
            ? `workspace-${profileRes.data.id}`
            : "workspace-default";
        const newTenant = await createTenant("Workspace Utama", slugSuggestion);
        if (newTenant?.id) tenantId = newTenant.id;
        else throw new Error("Gagal membuat workspace bisnis.");
      }

      if (!tenantId) throw new Error("Workspace tidak ditemukan. Harap refresh halaman.");

      const cleanSubdomain =
        (data.subdomain || data.businessName).toLowerCase().replace(/[^a-z0-9-]/g, "") || "situs";
      const enrichedDescription = [
        `Nama usaha / brand: ${data.businessName}.`,
        `Produk atau layanan utama: ${data.description}.`,
        `Kategori bisnis: ${data.businessType}.`,
        data.story ? `Cerita bisnis: ${data.story}.` : "",
        data.ageGroup ? `Target pelanggan: ${data.ageGroup}.` : "",
        data.tone ? `Tone komunikasi: ${data.tone}.` : "",
        data.motives?.length ? `Alasan pelanggan datang: ${data.motives.join(", ")}.` : "",
        data.mood ? `Nuansa visual: ${data.mood}.` : "",
        data.layoutStyle ? `Preferensi layout: ${data.layoutStyle}.` : "",
        data.tagline ? `Tagline pilihan user: ${data.tagline}.` : "",
        data.proof ? `Social proof: ${data.proof}.` : "",
      ].filter(Boolean).join("\n");
      const enrichedSellingPoints = [
        ...data.sellingPoints,
        ...(data.motives || []).map((item) => `Motivasi pelanggan: ${item}`),
        ...(data.mood ? [`Nuansa visual: ${data.mood}`] : []),
        ...(data.layoutStyle ? [`Layout: ${data.layoutStyle}`] : []),
        ...(data.tagline ? [`Tagline: ${data.tagline}`] : []),
        ...(data.proof ? [`Bukti sosial: ${data.proof}`] : []),
      ];

      // 1. Generate site with AI
      const genRes = await request<any>("/ai/generate-site", {
        method: "POST",
        body: JSON.stringify({
          business_name: data.businessName,
          business_type: data.businessType,
          description: enrichedDescription,
          location: data.location,
          phone: data.phone,
          selling_points:
            enrichedSellingPoints.length > 0
              ? enrichedSellingPoints
              : [`Lokasi di ${data.location}`, `WhatsApp: ${data.phone}`],
          template_id: data.templateId,
          language: "id",
          tenant_id: tenantId,
          mood: data.mood,
        }),
      }, authToken);

      if (genRes.status !== "success" || !genRes.data) {
        throw new Error(genRes.message || "Gagal membuat konten website.");
      }

      const siteId: string = genRes.data.id;

      // 2. Patch subdomain + auto-suggested template
      await request(`/sites/${siteId}`, {
        method: "PATCH",
        headers: { "X-Tenant-ID": tenantId.toString() },
        body: JSON.stringify({ name: data.businessName, template_id: data.templateId, subdomain: cleanSubdomain }),
      }, authToken);

      // 3. Save custom domain if entered
      if (data.addressType === "custom" && data.customDomain.trim()) {
        await request<any>("/domains", {
          method: "POST",
          headers: { "X-Tenant-ID": tenantId.toString() },
          body: JSON.stringify({ site_id: siteId, domain: data.customDomain.toLowerCase().trim() }),
        }, authToken);
      }

      // 4. Publish
      await request(`/sites/${siteId}/publish`, {
        method: "POST",
        headers: { "X-Tenant-ID": tenantId.toString() },
      }, authToken);

      // 5. Cleanup localStorage (public)
      if (mode === "public") {
        localStorage.removeItem(DRAFT_KEY);
        localStorage.removeItem(PENDING_KEY);
      }

      setGeneratedSite({
        id: siteId,
        subdomain: cleanSubdomain,
        customDomain: data.addressType === "custom" ? data.customDomain.trim() : "",
      });
      setStep(6);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat meluncurkan website.");
      setStep(4);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTenantId, memberships, createTenant, mode]);

  const handleLaunch = async () => {
    if (!token) {
      if (mode === "public" && onNeedAuth) {
        localStorage.setItem(PENDING_KEY, JSON.stringify({
          businessName, businessType, description, location, phone, sellingPoints,
          addressType, subdomain, customDomain, templateId,
          ageGroup, tone, motives, mood, layoutStyle, tagline, proof,
          story,
        }));
        onNeedAuth();
      }
      return;
    }
    await launchWithData({
      businessName, businessType, description, location, phone, sellingPoints,
      addressType, subdomain, customDomain, templateId,
      ageGroup, tone, motives, mood, layoutStyle, tagline, proof,
      story,
    }, token);
  };

  const toggleArrayValue = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };
  const chooseBusinessType = (value: string) => {
    setBusinessType(value);
    setTemplateId(suggestTemplate(value).id);
  };

  // ── Derived style helpers ────────────────────────────────────────────────
  const inputClass = isDark
    ? "w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition"
    : "w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/20 transition bg-background";
  const labelClass = isDark
    ? "text-xs font-bold uppercase tracking-wider text-slate-400"
    : "text-xs font-semibold text-slate-500";
  const mutedClass = isDark ? "text-slate-400" : "text-muted-foreground";
  const dividerClass = isDark ? "border-white/5" : "border-border/30";
  const cardShell = "bg-white/5 dark:bg-black/5 backdrop-blur-lg border border-white/10 dark:border-white/5 rounded-2xl p-6 sm:p-8";
  const primaryBtn = "rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-5 text-sm font-bold shadow-lg transition";
  const chipBase = "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-[13px] transition-colors";
  const chipClass = (selected: boolean) =>
    selected
      ? "border-[#1D9E75] bg-[#E1F5EE] text-[#085041]"
      : isDark
        ? "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]"
        : "border-border bg-background text-muted-foreground hover:bg-muted";
  const moodCardClass = (selected: boolean) =>
    selected
      ? "border-[#534AB7] bg-[#EEEDFE] text-slate-950"
      : isDark
        ? "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.07]"
        : "border-border bg-background text-foreground hover:bg-muted";
  const successSubdomain =
    generatedSite?.subdomain ||
    subdomain ||
    businessName.toLowerCase().replace(/[^a-z0-9-]/g, "") ||
    "website-kamu";
  const successUrl = `${successSubdomain}.webjoz.com`;

  // Convenience: card section header for dashboard mode
  const DashboardCardHeader = ({ step: s, title, desc }: { step: number; title: string; desc: string }) =>
    mode === "public" && !isDark ? (
      <div className="px-6 py-5 border-b border-border/30">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary font-extrabold">{s}</span>
          <span>{title}</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </div>
    ) : null;

  const cardInner = isDark ? "" : "px-6 py-5 space-y-5";

  // ── Stepper HUD ──────────────────────────────────────────────────────────
  const StepperHUD = () => (
    <div className="bg-white/5 dark:bg-black/5 backdrop-blur-lg border border-white/10 dark:border-white/5 rounded-xl p-4 flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {['Bisnis', 'Persona', 'Nuansa', 'Keunggulan'].map((label, idx) => {
          const s = idx + 1;
          const done = s < step;
          const active = s === step;
          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${done
                  ? "bg-[#1D9E75] text-[#E1F5EE]"
                  : active
                    ? isDark ? "bg-white text-slate-950" : "bg-slate-950 text-white"
                    : isDark ? "border border-white/10 bg-white/[0.03] text-slate-500" : "border bg-muted text-muted-foreground"}
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : s}
                </span>
                <span className={`text-[13px] ${active ? isDark ? "text-white font-semibold" : "text-foreground font-semibold" : mutedClass}`}
                >
                  {label}
                </span>
              </div>
              {s < 4 && (
                <span className={`h-px w-5 ${done ? "bg-[#1D9E75]" : isDark ? "bg-white/10" : "bg-border"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={"max-w-4xl mx-auto p-6 sm:p-8 bg-white/5 dark:bg-black/5 backdrop-blur-lg border border-white/10 dark:border-white/5 rounded-3xl shadow-xl animate-fade-in"}>
      {step < 5 && <StepperHUD />}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 1 — Profil Bisnis
      ══════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="space-y-6">
          {isDark && (
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Buat Website Bisnis Anda</h1>
              <p className="text-sm text-slate-400">
                Isi profil bisnis Anda di bawah ini. AI akan menyusun copywriting profesional secara otomatis.
              </p>
            </div>
          )}

          <div className={cardShell}>
            <DashboardCardHeader
              step={1}
              title="Ceritakan Bisnis Kamu"
              desc="Semakin detail, semakin unik website yang dihasilkan AI."
            />
            <div className={isDark ? "space-y-5" : cardInner}>
              <div className="space-y-2">
                <label className={labelClass}>Nama Bisnis <span className="text-red-400">*</span></label>
                <input
                  type="text" required value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="contoh: Warung Kopi Pak Dhe"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Kategori</label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => chooseBusinessType(value)}
                      className={`${chipBase} ${chipClass(businessType === value)}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className={labelClass}>Kota/Daerah <span className="text-red-400">*</span></label>
                  <input
                    type="text" required value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="contoh: Yogyakarta, Bantul, Sleman"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Nomor WhatsApp <span className="text-red-400">*</span></label>
                  <input
                    type="tel" required value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="contoh: 081234567890"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Produk atau layanan utama <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="contoh: kopi arabika, croissant, pastry homemade"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Cerita singkat bisnis ini</label>
                <textarea
                  rows={3}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Berdiri sejak kapan, kenapa dibuat, ada cerita unik?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className={`pt-4 flex justify-between items-center border-t ${dividerClass}`}>
                {mode === "dashboard" ? (
                  <Button
                    type="button"
                    onClick={() => router.push("/dashboard/sites")}
                    variant="ghost"
                    className="rounded-full px-6 text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Batal
                  </Button>
                ) : (
                  <div />
                )}
                <Button
                  onClick={() => setStep(2)}
                  disabled={!businessName.trim() || !description.trim() || !location.trim() || !phone.trim()}
                  className={primaryBtn}
                >
                  Lanjut
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 2 — Persona
      ══════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="space-y-6">
          {isDark && (
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Siapa Pelanggan Utama Kamu?</h1>
              <p className="text-sm text-slate-400">
                AI akan menyesuaikan tone dan bahasa website ke persona ini.
              </p>
            </div>
          )}

          <div className={cardShell}>
            <DashboardCardHeader
              step={2}
              title="Persona Pelanggan"
              desc="Pilih rekomendasi yang paling dekat dengan target pembeli atau calon klien Anda."
            />
            <div className={isDark ? "space-y-6" : cardInner}>
              <div className="space-y-2">
                <label className={labelClass}>Rentang usia</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_OPTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => setAgeGroup(item)} className={`${chipBase} ${chipClass(ageGroup === item)}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Gaya komunikasi yang mereka suka</label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => setTone(item)} className={`${chipBase} ${chipClass(tone === item)}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Mereka biasanya datang karena...</label>
                <div className="flex flex-wrap gap-2">
                  {MOTIVE_OPTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => toggleArrayValue(item, motives, setMotives)} className={`${chipBase} ${chipClass(motives.includes(item))}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`pt-4 flex justify-between border-t ${dividerClass}`}>
                <Button onClick={() => setStep(1)} variant="ghost" className={isDark ? "rounded-full px-6 text-slate-400 hover:text-white" : "rounded-xl"}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
                </Button>
                <Button onClick={() => setStep(3)} className={primaryBtn}>
                  Lanjut <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 3 — Nuansa
      ══════════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="space-y-6">
          {isDark && (
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Pilih Nuansa Visual</h1>
              <p className="text-sm text-slate-400">AI akan gunakan ini sebagai panduan palette dan karakter desain.</p>
            </div>
          )}
          <div className={cardShell}>
            <DashboardCardHeader step={3} title="Nuansa Visual" desc="Pilih rasa visual dan struktur halaman yang kamu bayangkan." />
            <div className={isDark ? "space-y-6" : cardInner}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOOD_OPTIONS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMood(item.value)}
                    className={`text-left rounded-xl border p-4 transition-colors ${moodCardClass(mood === item.value)}`}
                  >
                    <span className="mb-3 flex gap-1.5">
                      {item.colors.map((color) => <span key={color} className="h-4 w-4 rounded-full" style={{ background: color }} />)}
                    </span>
                    <span className="block text-[13px] font-semibold">{item.title}</span>
                    <span className={`block text-xs ${mood === item.value ? "text-slate-600" : mutedClass}`}>{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Layout yang kamu bayangkan</label>
                <div className="flex flex-wrap gap-2">
                  {LAYOUT_OPTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => setLayoutStyle(item)} className={`${chipBase} ${chipClass(layoutStyle === item)}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`pt-4 flex justify-between border-t ${dividerClass}`}>
                <Button onClick={() => setStep(2)} variant="ghost" className={isDark ? "rounded-full px-6 text-slate-400 hover:text-white" : "rounded-xl"}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
                </Button>
                <Button onClick={() => setStep(4)} className={primaryBtn}>
                  Lanjut <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 4 — Keunggulan + Domain
      ══════════════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div className="space-y-6">
          {isDark && (
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Apa yang Bikin Kamu Beda?</h1>
              <p className="text-sm text-slate-400">Pilih semua yang relevan. Ini akan jadi copy utama website kamu.</p>
            </div>
          )}

          <div className={cardShell}>
            <DashboardCardHeader
              step={4}
              title="Keunggulan & Publish"
              desc="Lengkapi pembeda bisnis, alamat website, lalu biarkan AI merakit halaman."
            />
            <div className={isDark ? "space-y-6" : cardInner}>
              <div className="space-y-2">
                <label className={labelClass}>Keunggulan bisnis</label>
                <div className="flex flex-wrap gap-2">
                  {USP_OPTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => toggleArrayValue(item, sellingPoints, setSellingPoints)} className={`${chipBase} ${chipClass(sellingPoints.includes(item))}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={labelClass}>Satu kalimat terbaik untuk mendeskripsikan bisnis ini</label>
                  <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder='contoh: "Kopi Jogja paling cozy yang buka sampai tengah malam"' className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Testimonial atau angka yang bisa dipamerkan</label>
                  <input value={proof} onChange={(e) => setProof(e.target.value)} placeholder='contoh: "500+ pelanggan puas", "Rating 4.9 di Google Maps"' className={inputClass} />
                </div>
              </div>

              <div className="space-y-3">
                <label className={labelClass}>Alamat website</label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setAddressType("subdomain")} className={`${chipBase} ${chipClass(addressType === "subdomain")}`}>Subdomain gratis</button>
                  <button type="button" onClick={() => setAddressType("custom")} className={`${chipBase} ${chipClass(addressType === "custom")}`}>Domain sendiri</button>
                </div>
                {addressType === "subdomain" ? (
                  <div>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => { setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setIsSubdomainManuallyEdited(true); }}
                        placeholder="nama-bisnis-anda"
                        className={`flex-1 px-4 py-3 rounded-l-xl text-sm focus:outline-none transition ${isDark ? "bg-white/[0.05] border border-white/10 text-white placeholder-white/25 focus:border-indigo-500/70" : "border rounded-none rounded-l-xl focus:border-primary/70 bg-background"}`}
                      />
                      <span className={`px-4 py-3 border-y border-r rounded-r-xl text-xs font-semibold ${isDark ? "border-white/10 bg-white/[0.02] text-slate-400" : "border-border bg-muted text-muted-foreground"}`}>
                        .webjoz.com
                      </span>
                    </div>
                    {businessName && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`text-[10px] font-semibold flex items-center gap-1.5 ${mutedClass}`}>
                          <Wand2 className="w-3 h-3 text-indigo-400" /> Saran:
                        </span>
                        {suggestingSubdomains ? <Loader2 className="w-3 h-3 animate-spin" /> : subdomainSuggestions.map((s) => (
                          <button key={s} type="button" onClick={() => { setSubdomain(s); setIsSubdomainManuallyEdited(true); }} className={`text-[11px] px-3 py-1 rounded-full border ${chipClass(subdomain === s)}`}>{s}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="contoh: warungnyonya.com" className={inputClass} />
                )}
              </div>

              <div className={`rounded-xl border p-4 flex items-start gap-3 ${isDark ? "border-indigo-500/20 bg-indigo-500/[0.05]" : "border-indigo-200 bg-indigo-50"}`}>
                <CreditCard className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className={`text-[11px] leading-relaxed ${isDark ? "text-slate-400" : "text-indigo-700"}`}>
                  Free trial aktif 2 minggu. Setelah itu perpanjangan Rp 249.000 / 1 tahun.
                </p>
              </div>

              {error && (
                <div className={`rounded-xl border p-4 flex items-start gap-3 ${isDark ? "border-red-500/20 bg-red-500/[0.08] text-red-400" : "border-red-200 bg-red-50 text-red-600"
                  }`}>
                  <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs leading-relaxed">{error}</span>
                </div>
              )}

              <div className={`pt-4 flex justify-between items-center border-t ${dividerClass}`}>
                <Button
                  onClick={() => setStep(3)}
                  variant="ghost"
                  className={isDark ? "rounded-full px-6 text-slate-400 hover:text-white" : "rounded-xl"}
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Kembali
                </Button>
                <Button onClick={handleLaunch} disabled={loading || (addressType === "subdomain" ? !subdomain : !customDomain)} className={primaryBtn}>
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Mempersiapkan...</>
                  ) : token ? (
                    <>Generate website <Sparkles className="w-4 h-4" /></>
                  ) : (
                    <>Daftar & Generate website <Sparkles className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 5 — AI Loading
      ══════════════════════════════════════════════════════════════════ */}
      {step === 5 && (
        <div className={isDark
          ? "bg-white/[0.02] border border-white/5 shadow-2xl rounded-[2.5rem] p-12 sm:p-16 text-center space-y-6"
          : "border border-border/40 shadow-xl rounded-2xl py-20 flex flex-col items-center justify-center text-center space-y-6"
        }>
          <div className="relative size-20 mx-auto">
            <div className={`absolute inset-0 rounded-full border-2 animate-[ping_3s_infinite] ${isDark ? "border-indigo-500/20" : "border-primary/20"}`} />
            <div className={`absolute inset-2 rounded-full border-2 animate-pulse ${isDark ? "border-indigo-500/40" : "border-primary/40"}`} />
            <div className={`absolute inset-4 rounded-full border-t-2 animate-spin ${isDark ? "border-indigo-400" : "border-primary"}`} />
          </div>
          <div className="space-y-3 max-w-sm mx-auto pt-2">
            <h2 className={`text-xl font-bold tracking-tight animate-pulse ${isDark ? "text-indigo-400" : "text-primary"}`}>
              AI Menulis Copywriting...
            </h2>
            <p className={`text-sm font-semibold min-h-6 ${mutedClass}`}>
              {AI_LOADING_STEPS[aiStepIdx]}
            </p>
            <p className={`text-[10px] leading-relaxed pt-2 ${mutedClass}`}>
              Jangan tutup halaman ini. Pembuatan website biasanya memakan waktu sekitar 15–30 detik.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 6 — Success
      ══════════════════════════════════════════════════════════════════ */}
      {step === 6 && (
        <div className={isDark ? "animate-in zoom-in-95 duration-300 max-w-lg mx-auto" : "max-w-lg mx-auto"}>
          <div className={isDark
            ? "bg-white/[0.03] border border-white/5 shadow-2xl backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 text-center space-y-6"
            : "border border-border/40 shadow-xl rounded-2xl p-8 sm:p-12 text-center space-y-6"
          }>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner border ${isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-green-100 text-green-600 border-green-200"
              }`}>
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h1 className={`text-2xl font-extrabold ${isDark ? "text-white" : ""}`}>Website Anda Resmi Aktif!</h1>
              <p className={`text-xs leading-relaxed ${mutedClass}`}>
                Selamat! AI berhasil merakit copywriting profesional dan meluncurkan website Anda.
              </p>
            </div>

            <div className="p-4 rounded-2xl space-y-1 bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500">Alamat Publik Situs</span>
              <a
                href={`https://${successUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="text-sm font-bold flex flex-wrap items-center justify-center gap-1.5 text-[#534AB7] hover:text-[#3f3798] hover:underline break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#534AB7]/40 rounded-md"
              >
                <span>{successUrl}</span>
                <Globe className="w-4 h-4 flex-shrink-0 text-[#534AB7]" />
              </a>
            </div>

            {generatedSite?.customDomain && (
              <div className={`p-4 rounded-2xl text-left space-y-2 ${isDark ? "bg-orange-500/[0.03] border border-orange-500/15" : "bg-orange-50 border border-orange-200"
                }`}>
                <h4 className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? "text-orange-400" : "text-orange-700"}`}>
                  <Settings className="w-3.5 h-3.5" /> Pending Pengaturan CNAME DNS
                </h4>
                <p className={`text-[10px] leading-relaxed ${isDark ? "text-slate-400" : "text-orange-700"}`}>
                  Situs Anda akan terhubung ke <strong>{generatedSite.customDomain}</strong>.
                  Arahkan CNAME ke <strong>sites.webjoz.com</strong>.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => router.push(`/dashboard/sites/${generatedSite?.id}`)}
                className={isDark
                  ? "rounded-full bg-indigo-600 hover:bg-indigo-500 py-6 text-sm font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                  : "rounded-xl w-full gap-1.5"
                }
              >
                <Laptop className="w-4 h-4" />
                Masuk ke Editor Website
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className={`text-[11px] text-center ${mutedClass}`}>
                Tampilan dipilihkan otomatis oleh AI. Tidak cocok? Klik <strong>Ganti Tampilan</strong> di editor kapan saja.
              </p>
              <Button
                onClick={() => router.push("/dashboard/sites")}
                variant="outline"
                className={isDark ? "rounded-full border-white/10 hover:bg-white/5 text-slate-300" : "rounded-xl w-full"}
              >
                Kembali ke Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
