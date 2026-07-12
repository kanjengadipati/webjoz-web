"use client";

import React, { useState } from "react";
import { CheckCircle, Lock, Search, Star, Loader2, Check, RotateCcw } from "lucide-react";
import { AiFieldButton } from "@/components/menu-catalog-form";
import FileUpload from "@/components/file-upload";
import { GoogleSnippetPreview } from "@/components/google-snippet-preview";
import { request } from "@/lib/api/client";

// ─── generateFieldText ────────────────────────────────────────────────────────
// Calls AI regenerate-section and plucks back the specific field value.

export async function generateFieldText(
  token: string,
  activeTenantId: number | string,
  siteId: number,
  section: string,
  fieldKey: string,
  currentContent: any,
  prompt: string,
): Promise<string | null> {
  const res = await request<any>("/ai/regenerate-section", {
    method: "POST",
    body: JSON.stringify({
      site_id: siteId,
      section,
      instructions: `Fokus hanya pada field "${fieldKey}": ${prompt}. Jaga field lain tetap sama.`,
      tenant_id: activeTenantId,
    }),
  }, token);
  if (res.status !== "success" || !res.data?.section) return null;
  return res.data.section[fieldKey] ?? null;
}

// ─── KeywordsInput ────────────────────────────────────────────────────────────

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  aiLoading?: boolean;
  onAiGenerate?: () => Promise<void>;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
  renderFieldActions?: (key: string, aiButton?: React.ReactNode) => React.ReactNode;
}

export function KeywordsInput({
  keywords, onChange, aiLoading, onAiGenerate, isPremium, onUpgradeRequired, renderFieldActions,
}: KeywordsInputProps) {
  const [input, setInput] = useState("");

  const addKeyword = (kw: string) => {
    const trimmed = kw.trim().toLowerCase();
    if (!trimmed || keywords.includes(trimmed)) return;
    onChange([...keywords, trimmed]);
  };

  const removeKeyword = (idx: number) => onChange(keywords.filter((_, i) => i !== idx));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(input);
      setInput("");
    }
  };

  return (
    <div className="space-y-1">
      <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
        <span>Keywords</span>
        {renderFieldActions ? (
          renderFieldActions("keywords", onAiGenerate && (
            <AiFieldButton
              loading={!!aiLoading}
              onGenerate={onAiGenerate}
              title="AI: generate keywords"
              onUpgradeRequired={onUpgradeRequired}
              isPremium={isPremium}
            />
          ))
        ) : onAiGenerate ? (
          <AiFieldButton
            loading={!!aiLoading}
            onGenerate={onAiGenerate}
            title="AI: generate keywords"
            onUpgradeRequired={onUpgradeRequired}
            isPremium={isPremium}
          />
        ) : null}
      </label>
      <div className="flex flex-wrap gap-1.5 min-h-[32px] px-2 py-1.5 border border-white/10 rounded-md bg-transparent">
        {keywords.map((kw, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: "rgba(99,102,241,0.15)", color: "rgb(165,180,252)" }}
          >
            {kw}
            <button type="button" onClick={() => removeKeyword(idx)} className="hover:text-red-400 cursor-pointer">×</button>
          </span>
        ))}
        <input
          type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={keywords.length === 0 ? "Ketik keyword lalu Enter..." : "Tambah keyword..."}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-[12px] text-slate-200 placeholder-slate-600"
        />
      </div>
    </div>
  );
}

// ─── SeoForm ──────────────────────────────────────────────────────────────────

// ─── SeoPreview ───────────────────────────────────────────────────────────────
// Tabbed preview: Google SERP | Social share — updates live as user types.

type PreviewTab = "google" | "social";

interface SeoPreviewProps {
  seo: any;
  subdomain?: string;
}

export function SeoPreview({ seo, subdomain = "namabisnis.webjoz.com" }: SeoPreviewProps) {
  const [tab, setTab] = useState<PreviewTab>("google");

  const title    = seo?.title       || "";
  const desc     = seo?.description || "";
  const ogImage  = seo?.og_image_url || "";
  const titleLen = title.length;
  const descLen  = desc.length;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#161920] overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-white/8">
        <button
          type="button"
          onClick={() => setTab("google")}
          className={`flex-1 py-2.5 text-[11px] font-bold tracking-wide transition-colors ${
            tab === "google"
              ? "bg-white/5 text-slate-100 border-b-2 border-[#8ab4f8]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          🔍 Google
        </button>
        <button
          type="button"
          onClick={() => setTab("social")}
          className={`flex-1 py-2.5 text-[11px] font-bold tracking-wide transition-colors ${
            tab === "social"
              ? "bg-white/5 text-slate-100 border-b-2 border-emerald-400"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          📣 WA / FB / X
        </button>
      </div>

      {/* Google SERP tab */}
      {tab === "google" && (
        <div className="p-4 space-y-3">
          <div className="rounded-xl border border-white/8 bg-[#202124] px-4 py-3.5 space-y-1" style={{ fontFamily: "arial, sans-serif" }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">W</span>
              <div className="leading-tight">
                <p className="text-[11px] text-slate-300 font-medium">webjoz.com</p>
                <p className="text-[10px] text-slate-500">{subdomain} › bisnis</p>
              </div>
            </div>
            <p className={`text-[16px] font-medium leading-snug hover:underline cursor-pointer ${
              title ? "text-[#8ab4f8]" : "text-slate-600 italic"
            }`}>
              {title || "Judul SEO belum diisi"}
            </p>
            <p className={`text-[13px] leading-relaxed line-clamp-2 ${
              desc ? "text-[#bdc1c6]" : "text-slate-600 italic"
            }`}>
              {desc || "Deskripsi SEO belum diisi"}
            </p>
          </div>
          {/* Char counters */}
          <div className="flex gap-4 px-1">
            <span className={`text-[10px] font-mono ${
              titleLen > 60 ? "text-red-400" : "text-slate-500"
            }`}>Title: {titleLen}/60 {titleLen > 60 ? "⚠️" : ""}</span>
            <span className={`text-[10px] font-mono ${
              descLen > 155 ? "text-red-400" : "text-slate-500"
            }`}>Desc: {descLen}/155 {descLen > 155 ? "⚠️" : ""}</span>
          </div>
        </div>
      )}

      {/* Social share tab */}
      {tab === "social" && (
        <div className="p-4 space-y-3">
          {/* WhatsApp / iMessage */}
          <div className="rounded-xl overflow-hidden border border-white/8 bg-[#1a1d26]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border-b border-white/5">
              <span className="text-[10px] font-bold text-emerald-400">💬 WhatsApp / iMessage</span>
            </div>
            <div className="flex overflow-hidden">
              <div className="w-[72px] h-[72px] shrink-0 bg-[#111318] relative overflow-hidden">
                {ogImage ? (
                  <img src={ogImage} alt="OG" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl opacity-20">🖼️</span>
                  </div>
                )}
              </div>
              <div className="flex-1 px-3 py-2 space-y-0.5 min-w-0">
                <p className="text-[9px] text-slate-500 truncate uppercase tracking-wide">{subdomain}</p>
                <p className={`text-[12px] font-semibold leading-snug line-clamp-2 ${
                  title ? "text-slate-100" : "text-slate-600 italic"
                }`}>{title || "Judul belum diisi"}</p>
                <p className={`text-[10px] line-clamp-2 leading-tight ${
                  desc ? "text-slate-400" : "text-slate-600 italic"
                }`}>{desc || "Deskripsi belum diisi"}</p>
              </div>
            </div>
          </div>

          {/* Facebook / LinkedIn */}
          <div className="rounded-xl overflow-hidden border border-white/8 bg-[#1a1d26]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border-b border-white/5">
              <span className="text-[10px] font-bold text-blue-400">👍 Facebook / LinkedIn</span>
            </div>
            <div className="w-full aspect-[1.91/1] bg-[#111318] relative overflow-hidden">
              {ogImage ? (
                <img src={ogImage} alt="OG" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                  <span className="text-3xl opacity-20">🖼️</span>
                  <p className="text-[10px] text-slate-600 italic">Upload OG Image (1200×630)</p>
                </div>
              )}
            </div>
            <div className="px-3 py-2 space-y-0.5 bg-[#232630]">
              <p className="text-[9px] uppercase tracking-widest text-slate-500">{subdomain}</p>
              <p className={`text-[12px] font-bold leading-snug line-clamp-2 ${
                title ? "text-slate-100" : "text-slate-600 italic"
              }`}>{title || "Judul belum diisi"}</p>
              <p className={`text-[10px] line-clamp-2 leading-snug ${
                desc ? "text-slate-400" : "text-slate-600 italic"
              }`}>{desc || "Deskripsi belum diisi"}</p>
            </div>
          </div>

          {/* Twitter / X */}
          <div className="rounded-xl overflow-hidden border border-white/8 bg-[#1a1d26]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-300">𝕏 Twitter / X</span>
            </div>
            <div className="relative">
              <div className="w-full aspect-[2/1] bg-[#111318] relative overflow-hidden">
                {ogImage ? (
                  <img src={ogImage} alt="OG" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl opacity-20">🖼️</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-black/65 backdrop-blur-sm">
                <p className={`text-[12px] font-semibold leading-tight truncate ${
                  title ? "text-white" : "text-slate-500 italic"
                }`}>{title || "Judul belum diisi"}</p>
                <p className="text-[10px] text-slate-400 truncate">{subdomain}</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-600 text-center">Preview diperbarui otomatis saat Anda mengisi Title, Deskripsi, &amp; OG Image.</p>
        </div>
      )}
    </div>
  );
}

export interface SeoFormProps {
  seo: any;
  /** updateField("seo", key, value) */
  updateField: (section: string, key: string, val: any) => void;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
  /** AI loading state keyed by "seo.<field>" */
  aiLoadingField?: string | null;
  /** Called to trigger AI text for a field */
  onAiText?: (fieldKey: string, prompt: string, label: string) => Promise<void>;
  /** Subdomain shown in SERP preview, e.g. "toko-saya.webjoz.com" */
  subdomain?: string;
  /** Google Search Console verification code (from tracking_codes.gsc_verification) */
  gscVerification?: string;
  /** Called when user saves the GSC verification code */
  onGscSave?: (code: string) => Promise<void>;
  fieldUndoStacks?: Record<string, string[]>;
  undoField?: (section: string, key: string) => void;
}

export function SeoForm({
  seo, updateField, isPremium, onUpgradeRequired, aiLoadingField, onAiText, subdomain,
  gscVerification, onGscSave, fieldUndoStacks, undoField,
}: SeoFormProps) {
  const titleLen = (seo?.title?.length || 0);
  const descLen  = (seo?.description?.length || 0);
  const [gscInput, setGscInput]     = useState(gscVerification || "");
  const [gscSaving, setGscSaving]   = useState(false);
  const [gscSaved, setGscSaved]     = useState(false);

  // Keep local input in sync when prop changes (e.g. after fetch)
  React.useEffect(() => { setGscInput(gscVerification || ""); }, [gscVerification]);

  const handleGscSave = async () => {
    if (!onGscSave) return;
    setGscSaving(true);
    setGscSaved(false);
    try {
      await onGscSave(gscInput.trim());
      setGscSaved(true);
      setTimeout(() => setGscSaved(false), 3000);
    } finally {
      setGscSaving(false);
    }
  };

  const fieldBase = "w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600";

  const renderFieldActions = (key: string, aiButton?: React.ReactNode) => {
    const fieldPath = `seo.${key}`;
    const stack = fieldUndoStacks?.[fieldPath] || [];
    if (stack.length === 0 && !aiButton) return null;
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        {stack.length > 0 && (
          <button
            type="button"
            onClick={() => undoField?.("seo", key)}
            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer focus:outline-none"
            title={`Undo perubahan field ini (${stack.length} kali)`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
        {aiButton}
      </div>
    );
  };

  return (
    <div className="space-y-5">

      {/* Info banner */}
      <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2.5 text-[12px] leading-relaxed text-cyan-100">
        <p className="font-semibold text-cyan-50">SEO tidak tampil di halaman publik — hanya dibaca mesin pencari &amp; saat link dibagikan.</p>
      </div>

      {/* SEO Booster upsell / active card */}
      {isPremium ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-[12px] leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            SEO Booster Aktif
          </div>
          <p className="mt-1 text-emerald-200/80">
            Structured data rich snippet otomatis dipasang di situs Anda. Google akan menampilkan rating, harga, dan informasi bisnis langsung di hasil pencarian.
          </p>
        </div>
      ) : (() => {
        const siteTitle = seo?.title || "Nama Bisnis — Layanan";
        const siteDesc = seo?.description || "Deskripsi singkat bisnis dan layanan.";
        const siteName = siteTitle.split(/[-—|]/)[0].trim() || "Nama Bisnis";
        const cleanSubdomain = subdomain || "namabisnis";

        const demoBusiness = {
          name: siteName,
          subdomain: cleanSubdomain,
          title: siteTitle,
          description: siteDesc,
          rating: "4.8",
          reviewCount: "128",
          priceRange: "Rp50.000–Rp200.000",
          status: "Buka",
        };

        return (
          <div className="rounded-2xl border border-amber-500/20 bg-black/60 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Search className="w-4 h-4 text-amber-400" />
                <span>SEO BOOSTER (PRO)</span>
              </div>
              <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
                Premium
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-5">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2">TANPA SEO BOOSTER</p>
                <div className="opacity-60 grayscale-[30%]">
                  <GoogleSnippetPreview variant="plain" business={demoBusiness} />
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                  ✨ Rich Result
                </div>
                <p className="text-xs font-bold text-emerald-400 mb-2">DENGAN SEO BOOSTER</p>
                <GoogleSnippetPreview variant="rich" business={demoBusiness} />
              </div>
            </div>

            <div className="px-5 pb-5">
              <p className="text-xs text-amber-200/70 text-center mb-2">
                Kompetitor Anda mungkin sudah tampil seperti contoh kanan di pencarian Google.
              </p>
              <button
                type="button"
                onClick={() => onUpgradeRequired?.()}
                className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                🔓 Upgrade ke Pro — Tampil Lebih Menonjol di Google
              </button>
            </div>
          </div>
        );
      })()}

      {/* Meta Title */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>Meta Title</span>
          {renderFieldActions("title", onAiText && (
            <AiFieldButton
              loading={aiLoadingField === "seo.title"}
              onGenerate={() => onAiText("title", "Buat SEO title yang mengandung nama bisnis, lokasi, dan layanan utama. Maks 60 karakter.", "Meta Title")}
              title="AI: generate SEO title" isPremium={isPremium} onUpgradeRequired={onUpgradeRequired}
            />
          ))}
        </label>
        <input type="text" value={seo?.title || ""} onChange={(e) => updateField("seo", "title", e.target.value)} className={fieldBase} placeholder="cth. Toko Bangunan Maju — Bahan Bangunan Berkualitas di Surabaya" />
        <div className="flex justify-end">
          <span className={`text-[10px] font-mono ${titleLen > 60 ? "text-red-500" : "text-slate-500"}`}>{titleLen}/60</span>
        </div>
      </div>

      {/* Meta Description */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>Meta Description</span>
          {renderFieldActions("description", onAiText && (
            <AiFieldButton
              loading={aiLoadingField === "seo.description"}
              onGenerate={() => onAiText("description", "Buat meta description yang menarik klik di Google. Maks 155 karakter, sertakan nama bisnis dan value proposition.", "Meta Description")}
              title="AI: generate meta description" isPremium={isPremium} onUpgradeRequired={onUpgradeRequired}
            />
          ))}
        </label>
        <textarea rows={3} value={seo?.description || ""} onChange={(e) => updateField("seo", "description", e.target.value)} className={`${fieldBase} resize-none`} placeholder="cth. Dapatkan bahan bangunan terlengkap dan terpercaya di Surabaya. Harga grosir, pengiriman cepat." />
        <div className="flex justify-end">
          <span className={`text-[10px] font-mono ${descLen > 155 ? "text-red-500" : "text-slate-500"}`}>{descLen}/155</span>
        </div>
      </div>

      {/* Keywords */}
      <div className="space-y-1">
        <KeywordsInput
          keywords={seo?.keywords || []}
          onChange={(kws) => updateField("seo", "keywords", kws)}
          aiLoading={aiLoadingField === "seo.keywords"}
          onAiGenerate={onAiText ? () => onAiText("keywords", "Generate 3-8 keyword SEO yang relevan untuk bisnis ini, fokus pada produk, layanan, dan lokasi.", "Keywords SEO") : undefined}
          isPremium={isPremium} onUpgradeRequired={onUpgradeRequired}
          renderFieldActions={renderFieldActions}
        />
      </div>

      {/* Favicon + OG Image */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>Favicon</span>
          {renderFieldActions("favicon_url")}
        </label>
        <FileUpload label="Favicon" value={seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
      </div>

      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>OG Image (1200×630)</span>
          {renderFieldActions("og_image_url")}
        </label>
        <FileUpload label="OG Image (1200×630)" value={seo?.og_image_url || ""} onChange={(val) => updateField("seo", "og_image_url", val)} placeholder="https://..." maxWidth={1200} maxHeight={630} quality={0.85} />
      </div>

      {/* OG Type */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">OG Type</label>
        <select value={seo?.og_type || "website"} onChange={(e) => updateField("seo", "og_type", e.target.value)} className={fieldBase}>
          <option value="website">website</option>
          <option value="article">article</option>
          <option value="product">product</option>
          <option value="profile">profile</option>
          <option value="business.business">business.business</option>
        </select>
      </div>

      {/* Twitter Card */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Twitter Card</label>
        <select value={seo?.twitter_card || "summary_large_image"} onChange={(e) => updateField("seo", "twitter_card", e.target.value)} className={fieldBase}>
          <option value="summary_large_image">summary_large_image</option>
          <option value="summary">summary</option>
          <option value="app">app</option>
          <option value="player">player</option>
        </select>
      </div>

      {/* Robots */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>Robots</span>
          {renderFieldActions("robots")}
        </label>
        <select value={seo?.robots || "index, follow"} onChange={(e) => updateField("seo", "robots", e.target.value)} className={fieldBase}>
          <option value="index, follow">index, follow</option>
          <option value="noindex, follow">noindex, follow</option>
          <option value="index, nofollow">index, nofollow</option>
          <option value="noindex, nofollow">noindex, nofollow</option>
        </select>
      </div>

      {/* OG Locale */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>OG Locale</span>
          {renderFieldActions("og_locale")}
        </label>
        <input type="text" value={seo?.og_locale || "id_ID"} onChange={(e) => updateField("seo", "og_locale", e.target.value)} className={fieldBase} placeholder="id_ID" />
      </div>

      {/* OG Site Name */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>OG Site Name</span>
          {renderFieldActions("og_site_name")}
        </label>
        <input type="text" value={seo?.og_site_name || ""} onChange={(e) => updateField("seo", "og_site_name", e.target.value)} className={fieldBase} placeholder="Nama bisnis" />
      </div>

      {/* Canonical Path */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>Canonical Path</span>
          {renderFieldActions("canonical_path")}
        </label>
        <input type="text" value={seo?.canonical_path || "/"} onChange={(e) => updateField("seo", "canonical_path", e.target.value)} className={fieldBase} placeholder="/" />
      </div>

      {/* ── Live Preview ── */}
      <SeoPreview seo={seo} subdomain={subdomain} />

      {/* ── Google Search Console ── */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-100">Google Search Console</p>
                <p className="text-[11px] text-slate-500">Verifikasi kepemilikan domain Anda di GSC</p>
              </div>
            </div>
            {!isPremium && (
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Pro</span>
            )}
          </div>

          {/* How-to steps */}
          <div className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2.5 space-y-1.5 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300">Cara mendapatkan kode verifikasi:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Buka <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Search Console</a></li>
              <li>Klik <strong className="text-slate-200">Tambah properti</strong> → pilih <strong className="text-slate-200">Awalan URL</strong></li>
              <li>Masukkan URL website Anda, lalu pilih metode <strong className="text-slate-200">Tag HTML</strong></li>
              <li>Salin nilai <code className="bg-white/5 px-1 rounded text-slate-300">content</code> dari meta tag yang diberikan</li>
              <li>Tempel di field di bawah, lalu klik Simpan &amp; Verifikasi</li>
            </ol>
          </div>

          {/* Meta tag preview */}
          {gscInput.trim() && (
            <div className="rounded-md bg-[#0d0f14] border border-white/5 px-3 py-2 font-mono text-[10px] text-slate-400 break-all">
              {'<meta name="google-site-verification" content="'}<span className="text-emerald-400">{gscInput.trim()}</span>{'" />'}
            </div>
          )}

          {/* Input + save button */}
          <div className="flex gap-2">
            <input
              type="text"
              value={gscInput}
              onChange={(e) => setGscInput(e.target.value)}
              placeholder="Tempel kode verifikasi di sini..."
              className="flex-1 px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
            />
            <button
              type="button"
              onClick={() => {
                if (!isPremium) { onUpgradeRequired?.(); return; }
                handleGscSave();
              }}
              disabled={gscSaving || !gscInput.trim()}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {gscSaving ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...</>
              ) : gscSaved ? (
                <><Check className="w-3.5 h-3.5" /> Tersimpan</>
              ) : (
                "Simpan & Verifikasi"
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
