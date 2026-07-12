"use client";

import React, { useState } from "react";
import { CheckCircle, Lock, Search, Star } from "lucide-react";
import { AiFieldButton } from "@/components/menu-catalog-form";
import FileUpload from "@/components/file-upload";
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
}

export function KeywordsInput({
  keywords, onChange, aiLoading, onAiGenerate, isPremium, onUpgradeRequired,
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
        {onAiGenerate && (
          <AiFieldButton
            loading={!!aiLoading}
            onGenerate={onAiGenerate}
            title="AI: generate keywords"
            onUpgradeRequired={onUpgradeRequired}
            isPremium={isPremium}
          />
        )}
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
// Live SERP + OG card — updates in real-time as user types.

interface SeoPreviewProps {
  seo: any;
  subdomain?: string;
}

export function SeoPreview({ seo, subdomain = "namabisnis.webjoz.com" }: SeoPreviewProps) {
  const title    = seo?.title       || "";
  const desc     = seo?.description || "";
  const ogImage  = seo?.og_image_url || "";
  const ogType   = (seo?.og_type    || "website").toUpperCase();
  const titleLen = title.length;
  const descLen  = desc.length;

  return (
    <div className="space-y-4">
      {/* Google SERP */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Preview di Google</p>
        <div className="rounded-2xl border border-white/10 bg-[#202124] px-4 py-3.5 space-y-1 font-mono">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-4 h-4 rounded-sm bg-slate-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">W</span>
            <span>{subdomain} › bisnis</span>
          </div>
          <p className={`text-[15px] font-semibold leading-snug ${title ? "text-[#8ab4f8]" : "text-slate-600 italic"}`}>
            {title || "Judul SEO belum diisi"}
          </p>
          <p className={`text-[12px] leading-relaxed line-clamp-2 ${desc ? "text-[#bdc1c6]" : "text-slate-600 italic"}`}>
            {desc || "Deskripsi SEO belum diisi"}
          </p>
          <div className="flex gap-3 pt-1">
            <span className={`text-[10px] font-mono ${titleLen > 60 ? "text-red-400" : "text-slate-500"}`}>Title: {titleLen}/60</span>
            <span className={`text-[10px] font-mono ${descLen > 155 ? "text-red-400" : "text-slate-500"}`}>Desc: {descLen}/155</span>
          </div>
        </div>
      </div>

      {/* OG / Social share card */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Preview saat link dibagikan (WhatsApp / Sosmed)</p>
        <div className="rounded-2xl border border-white/10 bg-[#1a1d26] overflow-hidden">
          <div className="w-full aspect-[1200/630] bg-[#111318] relative overflow-hidden">
            {ogImage ? (
              <img src={ogImage} alt="OG preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[11px] text-slate-600 italic">OG Image belum diatur</p>
              </div>
            )}
          </div>
          <div className="px-3.5 py-2.5 space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{ogType}</p>
            <p className={`text-[13px] font-semibold leading-snug ${title ? "text-slate-100" : "text-slate-600 italic"}`}>
              {title || "Judul SEO belum diisi"}
            </p>
            <p className={`text-[11px] leading-relaxed line-clamp-2 ${desc ? "text-slate-400" : "text-slate-600 italic"}`}>
              {desc || "Deskripsi SEO belum diisi"}
            </p>
          </div>
        </div>
      </div>
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
}

export function SeoForm({
  seo, updateField, isPremium, onUpgradeRequired, aiLoadingField, onAiText, subdomain,
}: SeoFormProps) {
  const titleLen = (seo?.title?.length || 0);
  const descLen  = (seo?.description?.length || 0);

  const fieldBase = "w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600";

  return (
    <div className="space-y-5">

      {/* Live previews */}
      <SeoPreview seo={seo} subdomain={subdomain} />

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
      ) : (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-amber-500/10">
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">SEO Booster (Pro)</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded">Premium</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-amber-500/10">
            <div className="px-3 py-2.5 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Tanpa SEO Booster</p>
              <div className="bg-[#1a1d26] rounded border border-white/5 p-2 space-y-1">
                <p className="text-[11px] font-semibold text-slate-300 leading-tight">{seo?.title || "Nama Bisnis — Layanan"}</p>
                <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{seo?.description || "Deskripsi singkat bisnis dan layanan."}</p>
                <p className="text-[9px] text-slate-600">"namabisnis.webjoz.com"</p>
              </div>
            </div>
            <div className="px-3 py-2.5 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Dengan SEO Booster</p>
              <div className="bg-[#1a1d26] rounded border border-emerald-500/20 p-2 space-y-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-2.5 h-2.5 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
                  ))}
                  <span className="text-[9px] text-slate-400 ml-0.5">4.0</span>
                  <span className="text-[9px] text-slate-600">(128 ulasan)</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-200 leading-tight">{seo?.title || "Nama Bisnis — Layanan"}</p>
                <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{seo?.description || "Deskripsi singkat bisnis dan layanan."}</p>
                <div className="flex items-center gap-1.5 text-[9px] text-emerald-400">
                  <span>👍 Rp50.000–Rp200.000</span>
                  <span className="text-slate-600">•</span>
                  <span>🕐 Buka</span>
                </div>
                <p className="text-[9px] text-slate-600">"namabisnis.webjoz.com"</p>
              </div>
            </div>
          </div>
          <button
            type="button" onClick={() => onUpgradeRequired?.()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[12px] font-semibold transition-all border-t border-amber-500/10"
          >
            <Lock className="w-3.5 h-3.5" />
            Upgrade untuk aktifkan SEO Booster
          </button>
        </div>
      )}

      {/* Meta Title */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>Meta Title</span>
          {onAiText && (
            <AiFieldButton
              loading={aiLoadingField === "seo.title"}
              onGenerate={() => onAiText("title", "Buat SEO title yang mengandung nama bisnis, lokasi, dan layanan utama. Maks 60 karakter.", "Meta Title")}
              title="AI: generate SEO title" isPremium={isPremium} onUpgradeRequired={onUpgradeRequired}
            />
          )}
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
          {onAiText && (
            <AiFieldButton
              loading={aiLoadingField === "seo.description"}
              onGenerate={() => onAiText("description", "Buat meta description yang menarik klik di Google. Maks 155 karakter, sertakan nama bisnis dan value proposition.", "Meta Description")}
              title="AI: generate meta description" isPremium={isPremium} onUpgradeRequired={onUpgradeRequired}
            />
          )}
        </label>
        <textarea rows={3} value={seo?.description || ""} onChange={(e) => updateField("seo", "description", e.target.value)} className={`${fieldBase} resize-none`} placeholder="cth. Dapatkan bahan bangunan terlengkap dan terpercaya di Surabaya. Harga grosir, pengiriman cepat." />
        <div className="flex justify-end">
          <span className={`text-[10px] font-mono ${descLen > 155 ? "text-red-500" : "text-slate-500"}`}>{descLen}/155</span>
        </div>
      </div>

      {/* Keywords */}
      <KeywordsInput
        keywords={seo?.keywords || []}
        onChange={(kws) => updateField("seo", "keywords", kws)}
        aiLoading={aiLoadingField === "seo.keywords"}
        onAiGenerate={onAiText ? () => onAiText("keywords", "Generate 3-8 keyword SEO yang relevan untuk bisnis ini, fokus pada produk, layanan, dan lokasi.", "Keywords SEO") : undefined}
        isPremium={isPremium} onUpgradeRequired={onUpgradeRequired}
      />

      {/* Favicon + OG Image */}
      <FileUpload label="Favicon" value={seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
      <FileUpload label="OG Image (1200×630)" value={seo?.og_image_url || ""} onChange={(val) => updateField("seo", "og_image_url", val)} placeholder="https://..." maxWidth={1200} maxHeight={630} quality={0.85} />

      {/* OG Type */}
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>OG Type</span>
          {onAiText && (
            <AiFieldButton loading={aiLoadingField === "seo.og_type"} onGenerate={() => onAiText("og_type", "Pilih og_type yang paling sesuai: website, article, product, profile.", "OG Type")} title="AI: suggest OG type" isPremium={isPremium} onUpgradeRequired={onUpgradeRequired} />
          )}
        </label>
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
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          <span>Twitter Card</span>
          {onAiText && (
            <AiFieldButton loading={aiLoadingField === "seo.twitter_card"} onGenerate={() => onAiText("twitter_card", "Pilih Twitter card: summary_large_image untuk kebanyakan bisnis.", "Twitter Card")} title="AI: suggest Twitter card" isPremium={isPremium} onUpgradeRequired={onUpgradeRequired} />
          )}
        </label>
        <select value={seo?.twitter_card || "summary_large_image"} onChange={(e) => updateField("seo", "twitter_card", e.target.value)} className={fieldBase}>
          <option value="summary_large_image">summary_large_image</option>
          <option value="summary">summary</option>
          <option value="app">app</option>
          <option value="player">player</option>
        </select>
      </div>

      {/* Robots */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Robots</label>
        <select value={seo?.robots || "index, follow"} onChange={(e) => updateField("seo", "robots", e.target.value)} className={fieldBase}>
          <option value="index, follow">index, follow</option>
          <option value="noindex, follow">noindex, follow</option>
          <option value="index, nofollow">index, nofollow</option>
          <option value="noindex, nofollow">noindex, nofollow</option>
        </select>
      </div>

      {/* OG Locale */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">OG Locale</label>
        <input type="text" value={seo?.og_locale || "id_ID"} onChange={(e) => updateField("seo", "og_locale", e.target.value)} className={fieldBase} placeholder="id_ID" />
      </div>

      {/* OG Site Name */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">OG Site Name</label>
        <input type="text" value={seo?.og_site_name || ""} onChange={(e) => updateField("seo", "og_site_name", e.target.value)} className={fieldBase} placeholder="Nama bisnis" />
      </div>

      {/* Canonical Path */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Canonical Path</label>
        <input type="text" value={seo?.canonical_path || "/"} onChange={(e) => updateField("seo", "canonical_path", e.target.value)} className={fieldBase} placeholder="/" />
      </div>

    </div>
  );
}
