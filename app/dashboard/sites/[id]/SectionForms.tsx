import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Sparkles, RefreshCw, Loader2, Star, Zap, Shield, Award, Heart, CheckCircle, Clock, Globe, Users, TrendingUp, Leaf, Flame, Lightbulb, Target, Truck, ThumbsUp, Lock, Phone, Mail, MapPin, Camera, Utensils, Coffee, ShoppingBag, Wrench, Stethoscope, BookOpen, Home, Building2, Briefcase } from "lucide-react";
import FileUpload from "@/components/file-upload";
import { isPlaceholderValue } from "./editor-utils";
import { request } from "@/lib/api/client";

export interface SectionFormsProps {
  activeTab: string;
  content: any;
  updateField: (section: string, key: string, val: any) => void;
  needsAttention: (path: string) => boolean;
  fieldClass: (path: string, base: string) => string;
  // For inline AI field generation
  token?: string | null;
  activeTenantId?: number | string | null;
  siteId?: number | null;
}

// ─── Icon Picker ──────────────────────────────────────────────────────────────
const ICON_OPTIONS: Array<{ name: string; icon: React.ComponentType<any> }> = [
  { name: "Star", icon: Star }, { name: "Zap", icon: Zap }, { name: "Shield", icon: Shield },
  { name: "Award", icon: Award }, { name: "Heart", icon: Heart }, { name: "CheckCircle", icon: CheckCircle },
  { name: "Clock", icon: Clock }, { name: "Globe", icon: Globe }, { name: "Users", icon: Users },
  { name: "TrendingUp", icon: TrendingUp }, { name: "Leaf", icon: Leaf }, { name: "Flame", icon: Flame },
  { name: "Lightbulb", icon: Lightbulb }, { name: "Target", icon: Target }, { name: "Truck", icon: Truck },
  { name: "ThumbsUp", icon: ThumbsUp }, { name: "Lock", icon: Lock }, { name: "Phone", icon: Phone },
  { name: "Mail", icon: Mail }, { name: "MapPin", icon: MapPin }, { name: "Camera", icon: Camera },
  { name: "Utensils", icon: Utensils }, { name: "Coffee", icon: Coffee }, { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Wrench", icon: Wrench }, { name: "Stethoscope", icon: Stethoscope }, { name: "BookOpen", icon: BookOpen },
  { name: "Home", icon: Home }, { name: "Building2", icon: Building2 }, { name: "Briefcase", icon: Briefcase },
];

function IconPicker({ value, onChange }: { value?: string; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = ICON_OPTIONS.find(o => o.name === value);
  const SelectedIcon = selected?.icon ?? Star;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-2 py-1.5 border border-white/10 rounded text-[11px] text-slate-300 hover:bg-white/5 transition-all w-full"
      >
        <SelectedIcon className="w-4 h-4 text-violet-400 shrink-0" />
        <span className="flex-1 text-left truncate">{value || "Pilih icon"}</span>
        <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[#1a1d26] border border-white/10 rounded-lg p-2 shadow-xl">
          <div className="grid grid-cols-6 gap-1">
            {ICON_OPTIONS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setOpen(false); }}
                className={`flex items-center justify-center p-2 rounded transition-all hover:bg-violet-500/20 ${value === name ? "bg-violet-500/30 ring-1 ring-violet-400" : ""}`}
              >
                <Icon className={`w-4 h-4 ${value === name ? "text-violet-300" : "text-slate-400"}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Unsplash image pool (mirrors the API backend pool) ───────────────────────
const UNSPLASH_POOLS: Record<string, string[]> = {
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&auto=format&fit=crop&q=80",
  ],
  cafe: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&auto=format&fit=crop&q=80",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80",
  ],
  retail: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&auto=format&fit=crop&q=80",
  ],
  service: [
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80",
  ],
  health: [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80",
  ],
  beauty: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&auto=format&fit=crop&q=80",
  ],
  travel: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80",
  ],
  education: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
  ],
  realestate: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
  ],
  business: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80",
  ],
};

function getUnsplashPool(businessType: string): string[] {
  const lower = (businessType || "").toLowerCase();
  if (["kuliner", "makanan", "restoran", "warung", "food"].some(k => lower.includes(k))) return UNSPLASH_POOLS.food;
  if (["cafe", "kafe", "kopi", "coffee"].some(k => lower.includes(k))) return UNSPLASH_POOLS.cafe;
  if (["fashion", "pakaian", "baju", "clothing"].some(k => lower.includes(k))) return UNSPLASH_POOLS.fashion;
  if (["toko", "retail", "produk", "umkm", "online"].some(k => lower.includes(k))) return UNSPLASH_POOLS.retail;
  if (["klinik", "dokter", "kesehatan", "health"].some(k => lower.includes(k))) return UNSPLASH_POOLS.health;
  if (["salon", "kecantikan", "barber", "beauty"].some(k => lower.includes(k))) return UNSPLASH_POOLS.beauty;
  if (["travel", "hotel", "wisata", "tourism"].some(k => lower.includes(k))) return UNSPLASH_POOLS.travel;
  if (["edukasi", "sekolah", "kursus", "education"].some(k => lower.includes(k))) return UNSPLASH_POOLS.education;
  if (["properti", "rumah", "bangunan", "realestate"].some(k => lower.includes(k))) return UNSPLASH_POOLS.realestate;
  if (["jasa", "service", "konsultan"].some(k => lower.includes(k))) return UNSPLASH_POOLS.service;
  return UNSPLASH_POOLS.business;
}

// ─── AI Field Button ──────────────────────────────────────────────────────────
interface AiFieldButtonProps {
  onGenerate: () => Promise<void>;
  loading: boolean;
  title?: string;
}

function AiFieldButton({ onGenerate, loading, title = "Generate dengan AI" }: AiFieldButtonProps) {
  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={loading}
      title={title}
      className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-violet-500/15 text-violet-400 hover:bg-violet-500/30 hover:text-violet-200 transition-all disabled:opacity-40 cursor-pointer focus:outline-none focus:ring-1 focus:ring-violet-400"
    >
      {loading
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : <Sparkles className="w-3 h-3" />
      }
    </button>
  );
}

// ─── AI Image Button ──────────────────────────────────────────────────────────
interface AiImageButtonProps {
  businessType: string;
  onSelect: (url: string) => void;
}

function AiImageButton({ businessType, onSelect }: AiImageButtonProps) {
  const pool = getUnsplashPool(businessType);
  const handleClick = () => {
    const randomUrl = pool[Math.floor(Math.random() * pool.length)];
    onSelect(randomUrl);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      title="Pilih foto acak dari Unsplash"
      className="flex items-center gap-1 px-2 h-7 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-[10px] font-semibold transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400 border border-white/10"
    >
      <RefreshCw className="w-3 h-3" />
      Random foto
    </button>
  );
}

// ─── Inline AI text generation via regenerate-section ─────────────────────────
// Calls the section regenerate endpoint but only applies the specific field
async function generateFieldText(
  token: string,
  activeTenantId: number | string,
  siteId: number,
  section: string,
  fieldKey: string,
  currentContent: any,
  prompt: string
): Promise<string | null> {
  try {
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
    const updated = res.data.section;
    // Return the specific field value from the updated section
    return updated[fieldKey] ?? null;
  } catch {
    return null;
  }
}

export interface SectionFormsProps {
  activeTab: string;
  content: any;
  updateField: (section: string, key: string, val: any) => void;
  needsAttention: (path: string) => boolean;
  fieldClass: (path: string, base: string) => string;
}

interface LinkTypeInputProps {
  urlValue: string;
  updateUrl: (val: string) => void;
  needsAttention: boolean;
  fieldClass: (path: string, base: string) => string;
  path: string;
  label: string;
  defaultWaNumber?: string;
}

function LinkTypeInput({
  urlValue,
  updateUrl,
  needsAttention,
  fieldClass,
  path,
  label,
  defaultWaNumber,
}: LinkTypeInputProps) {
  const isWa = /wa\.me|whatsapp\.com|whatsapp:\/\//i.test(urlValue);
  const [linkType, setLinkType] = React.useState<"whatsapp" | "custom">(isWa ? "whatsapp" : "custom");

  // Keep state in sync with external value
  React.useEffect(() => {
    const isCurrentlyWa = /wa\.me|whatsapp\.com|whatsapp:\/\//i.test(urlValue);
    if (isCurrentlyWa && linkType !== "whatsapp") {
      setLinkType("whatsapp");
    } else if (!isCurrentlyWa && linkType === "whatsapp" && urlValue !== "") {
      setLinkType("custom");
    }
  }, [urlValue]);

  // Extract WA number
  const getWaNumber = (url: string): string => {
    if (!url) return "";
    const cleaned = url.replace(/\s+/g, "");
    const match = cleaned.match(/(?:wa\.me\/|phone=)([0-9]+)/i);
    return match ? match[1] : "";
  };

  const [waInput, setWaInput] = React.useState(() => {
    if (isWa) {
      return getWaNumber(urlValue);
    }
    if (defaultWaNumber) {
      return defaultWaNumber.replace(/\D/g, "");
    }
    return "";
  });

  React.useEffect(() => {
    if (isWa) {
      setWaInput(getWaNumber(urlValue));
    } else if (defaultWaNumber && !urlValue) {
      setWaInput(defaultWaNumber.replace(/\D/g, ""));
    }
  }, [urlValue, isWa, defaultWaNumber]);

  const handleWaChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "");
    setWaInput(digitsOnly);
    
    let formattedDigits = digitsOnly;
    if (formattedDigits.startsWith("0")) {
      formattedDigits = "62" + formattedDigits.slice(1);
    }
    
    if (formattedDigits) {
      updateUrl(`https://wa.me/${formattedDigits}`);
    } else {
      updateUrl("");
    }
  };

  const handleTypeChange = (type: "whatsapp" | "custom") => {
    setLinkType(type);
    if (type === "whatsapp") {
      let digits = waInput;
      if (!digits && defaultWaNumber) {
        digits = defaultWaNumber.replace(/\D/g, "");
        setWaInput(digits);
      }
      
      let formattedDigits = digits;
      if (formattedDigits.startsWith("0")) {
        formattedDigits = "62" + formattedDigits.slice(1);
      }
      updateUrl(formattedDigits ? `https://wa.me/${formattedDigits}` : "https://wa.me/");
    } else {
      updateUrl("#contact");
    }
  };

  return (
    <div className="space-y-2 pt-2 border-t border-white/5 mt-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          Tipe Aksi Tombol
        </label>
        <div className="flex p-0.5 rounded bg-white/[0.04] border border-white/5">
          <button
            type="button"
            onClick={() => handleTypeChange("whatsapp")}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition cursor-pointer ${
              linkType === "whatsapp"
                ? "bg-violet-600 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("custom")}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition cursor-pointer ${
              linkType === "custom"
                ? "bg-violet-600 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Link Kustom
          </button>
        </div>
      </div>

      {linkType === "whatsapp" ? (
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
            Nomor WhatsApp {needsAttention && <span className="text-amber-300">⚠️</span>}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-xs text-slate-500 font-semibold select-none">+</span>
            <input
              id={`field-${path}`}
              type="text"
              inputMode="tel"
              value={waInput}
              onChange={(e) => handleWaChange(e.target.value)}
              placeholder="628123456789"
              className={fieldClass(path, "w-full pl-6 pr-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")}
            />
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Masukkan nomor dengan kode negara (cth. 628123456789 atau 08123456789).
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
            {label} {needsAttention && <span className="text-amber-300">⚠️</span>}
          </label>
          <input
            id={`field-${path}`}
            type="text"
            value={urlValue}
            onChange={(e) => updateUrl(e.target.value)}
            className={fieldClass(path, "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")}
            placeholder="#contact atau https://..."
          />
        </div>
      )}
    </div>
  );
}

export default function SectionForms({
  activeTab,
  content,
  updateField,
  needsAttention,
  fieldClass,
  token,
  activeTenantId,
  siteId,
}: SectionFormsProps) {
  const [aiLoadingField, setAiLoadingField] = React.useState<string | null>(null);
  const businessType = content?.header?.brand_name ? "" : "";
  // Extract business type from seo title or brand context as best-effort
  const bType = content?.seo?.title?.split("-")?.[1]?.trim() || content?.contact?.address || "";

  const handleAiText = async (section: string, fieldKey: string, prompt: string) => {
    if (!token || !activeTenantId || !siteId) return;
    const loadKey = `${section}.${fieldKey}`;
    setAiLoadingField(loadKey);
    try {
      const result = await generateFieldText(String(token), activeTenantId, siteId, section, fieldKey, content, prompt);
      if (result) updateField(section, fieldKey, result);
    } finally {
      setAiLoadingField(null);
    }
  };

  const handleAiImage = (section: string, fieldKey: string, url: string) => {
    updateField(section, fieldKey, url);
  };

  return (
    <>
      {/* HEADER FORM */}
      {activeTab === "header" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Nama Brand {needsAttention("header.brand_name") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-header.brand_name"
              type="text" 
              value={content.header?.brand_name || ""} 
              onChange={(e) => updateField("header", "brand_name", e.target.value)} 
              className={fieldClass("header.brand_name", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Teks Tombol Nav {needsAttention("header.nav_cta_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-header.nav_cta_text"
              type="text" 
              value={content.header?.nav_cta_text || ""} 
              onChange={(e) => updateField("header", "nav_cta_text", e.target.value)} 
              className={fieldClass("header.nav_cta_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Logo URL</label>
            <FileUpload label="" value={content.header?.logo_url || ""} onChange={(val) => updateField("header", "logo_url", val)} placeholder="https://..." maxWidth={400} maxHeight={400} quality={0.85} />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Favicon</label>
            <FileUpload label="" value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Nama Ikon</label>
            <input id="field-header.icon" type="text" value={content.header?.icon || ""} onChange={(e) => updateField("header", "icon", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent" placeholder="cth. Utensils" />
          </div>
        </div>
      )}

      {/* HERO FORM */}
      {activeTab === "hero" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Gambar Hero {needsAttention("hero.image_url") && <span className="text-amber-300">⚠️</span>}
              </span>
              <AiImageButton businessType={bType} onSelect={(url) => handleAiImage("hero", "image_url", url)} />
            </label>
            <FileUpload label="" value={content.hero.image_url || ""} onChange={(val) => updateField("hero", "image_url", val)} placeholder="https://..." maxWidth={1600} maxHeight={1200} quality={0.8} />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Headline {needsAttention("hero.headline") && <span className="text-amber-300">⚠️</span>}
              </span>
              <AiFieldButton
                loading={aiLoadingField === "hero.headline"}
                onGenerate={() => handleAiText("hero", "headline", "Buat headline yang kuat dan memikat, max 10 kata")}
                title="AI: generate headline"
              />
            </label>
            <input 
              id="field-hero.headline"
              type="text" 
              value={content.hero.headline || ""} 
              onChange={(e) => updateField("hero", "headline", e.target.value)} 
              className={fieldClass("hero.headline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 block">
              Matra / Tagline
            </label>
            <input
              id="field-hero.matra"
              type="text"
              value={content.hero?.matra || ""}
              onChange={(e) => updateField("hero", "matra", e.target.value)}
              placeholder="cth. Cita Rasa Jogja · Sejak 2010"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent text-slate-300 placeholder-slate-600"
            />
            <p className="text-[10px] text-slate-600 leading-relaxed">Slogan singkat yang muncul di antara headline dan subheadline dengan garis dekoratif.</p>
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Subheadline {needsAttention("hero.subheadline") && <span className="text-amber-300">⚠️</span>}
              </span>
              <AiFieldButton
                loading={aiLoadingField === "hero.subheadline"}
                onGenerate={() => handleAiText("hero", "subheadline", "Buat subheadline yang jelas menyampaikan value proposition, max 25 kata")}
                title="AI: generate subheadline"
              />
            </label>
            <textarea 
              id="field-hero.subheadline"
              rows={2} 
              value={content.hero.subheadline || ""} 
              onChange={(e) => updateField("hero", "subheadline", e.target.value)} 
              className={fieldClass("hero.subheadline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Teks Tombol CTA {needsAttention("hero.cta_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-hero.cta_text"
              type="text" 
              value={content.hero.cta_text || ""} 
              onChange={(e) => updateField("hero", "cta_text", e.target.value)} 
              className={fieldClass("hero.cta_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <LinkTypeInput 
            urlValue={content.hero.cta_url || ""}
            updateUrl={(val) => {
              updateField("hero", "cta_url", val);
              const waNumber = val.replace(/\s+/g, "").match(/(?:wa\.me\/|phone=)([0-9]+)/i)?.[1] || "";
              if (waNumber && (!content.contact?.phone || isPlaceholderValue(content.contact.phone, "phone"))) {
                updateField("contact", "phone", "0" + waNumber.slice(2));
              }
            }}
            needsAttention={needsAttention("hero.cta_url")}
            fieldClass={fieldClass}
            path="hero.cta_url"
            label="Link Tombol CTA"
            defaultWaNumber={content.contact?.phone}
          />
        </div>
      )}

      {/* ABOUT FORM */}
      {activeTab === "about" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Gambar Tentang</span>
              <AiImageButton businessType={bType} onSelect={(url) => handleAiImage("about", "image_url", url)} />
            </label>
            <FileUpload label="" value={content.about.image_url || ""} onChange={(val) => updateField("about", "image_url", val)} placeholder="https://..." maxWidth={1000} maxHeight={1000} quality={0.8} />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Judul {needsAttention("about.title") && <span className="text-amber-300">⚠️</span>}
              </span>
              <AiFieldButton
                loading={aiLoadingField === "about.title"}
                onGenerate={() => handleAiText("about", "title", "Buat judul section tentang yang menarik dan relevan dengan bisnis")}
                title="AI: generate judul"
              />
            </label>
            <input 
              id="field-about.title"
              type="text" 
              value={content.about.title || ""} 
              onChange={(e) => updateField("about", "title", e.target.value)} 
              className={fieldClass("about.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Deskripsi {needsAttention("about.body") && <span className="text-amber-300">⚠️</span>}
              </span>
              <AiFieldButton
                loading={aiLoadingField === "about.body"}
                onGenerate={() => handleAiText("about", "body", "Tulis paragraf tentang bisnis ini yang hangat, spesifik, dan manusiawi. 2-4 kalimat.")}
                title="AI: generate deskripsi"
              />
            </label>
            <textarea 
              id="field-about.body"
              rows={3} 
              value={content.about.body || ""} 
              onChange={(e) => updateField("about", "body", e.target.value)} 
              className={fieldClass("about.body", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none bg-transparent")} 
            />
          </div>
          {/* Highlight Stats */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 block">Statistik Highlight</label>
            {[1, 2, 3].map((n) => {
              const statKey = `highlight_stat_${n}` as "highlight_stat_1" | "highlight_stat_2" | "highlight_stat_3";
              const stat = (content.about as any)[statKey] as { value?: string; label?: string } | undefined;
              return (
                <div key={n} className="border border-white/10 rounded-md p-2 space-y-1.5 bg-white/[0.02]">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Stat {n}</span>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-0.5">
                      <label className="text-[10px] text-slate-500">Nilai</label>
                      <input
                        type="text"
                        value={stat?.value || ""}
                        onChange={(e) => updateField("about", statKey, { ...(stat || {}), value: e.target.value })}
                        placeholder="cth. 500+"
                        className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-violet-400 bg-transparent text-slate-200"
                      />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <label className="text-[10px] text-slate-500">Label</label>
                      <input
                        type="text"
                        value={stat?.label || ""}
                        onChange={(e) => updateField("about", statKey, { ...(stat || {}), label: e.target.value })}
                        placeholder="cth. Pelanggan Puas"
                        className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-violet-400 bg-transparent text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BENEFITS FORM */}
      {activeTab === "benefits" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Judul Section {needsAttention("benefits.title") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-benefits.title"
              type="text" 
              value={content.benefits.title || ""} 
              onChange={(e) => updateField("benefits", "title", e.target.value)} 
              className={fieldClass("benefits.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          {content.benefits.items?.map((item: any, idx: number) => (
            <div key={idx} className="border border-white/10 p-2.5 rounded-lg space-y-2 bg-white/[0.03]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">#{idx + 1}</span>
                <button 
                  type="button"
                  onClick={() => { 
                    const n = content.benefits.items.filter((_: any, i: number) => i !== idx); 
                    updateField("benefits", "items", n); 
                  }} 
                  className="text-red-400 text-[11px]"
                >
                  Hapus
                </button>
              </div>
              <input 
                type="text" 
                value={item.title || ""} 
                onChange={(e) => { 
                  const n = [...content.benefits.items]; 
                  n[idx].title = e.target.value; 
                  updateField("benefits", "items", n); 
                }} 
                placeholder="Judul" 
                className={fieldClass(`benefits.items.${idx}.title`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400")} 
              />
              <textarea 
                rows={2} 
                value={item.description || ""} 
                onChange={(e) => { 
                  const n = [...content.benefits.items]; 
                  n[idx].description = e.target.value; 
                  updateField("benefits", "items", n); 
                }} 
                placeholder="Deskripsi" 
                className={fieldClass(`benefits.items.${idx}.description`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400 resize-none")} 
              />
              {/* Icon + Stat row */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase">Icon</label>
                <IconPicker
                  value={item.icon || ""}
                  onChange={(name) => { const n = [...content.benefits.items]; n[idx].icon = name; updateField("benefits", "items", n); }}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-0.5">
                  <label className="text-[10px] text-slate-500 uppercase">Stat</label>
                  <input
                    type="text"
                    value={item.stat || ""}
                    onChange={(e) => { const n = [...content.benefits.items]; n[idx].stat = e.target.value; updateField("benefits", "items", n); }}
                    placeholder="50+"
                    className="w-full px-2 py-1 border border-white/10 rounded text-[11px] outline-none focus:border-violet-400 bg-transparent text-slate-200"
                  />
                </div>
                <div className="flex-1 space-y-0.5">
                  <label className="text-[10px] text-slate-500 uppercase">Keterangan Stat</label>
                  <input
                    type="text"
                    value={item.stat_label || ""}
                    onChange={(e) => { const n = [...content.benefits.items]; n[idx].stat_label = e.target.value; updateField("benefits", "items", n); }}
                    placeholder="Proyek Selesai"
                    className="w-full px-2 py-1 border border-white/10 rounded text-[11px] outline-none focus:border-violet-400 bg-transparent text-slate-200"
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            type="button"
            onClick={() => { 
              const n = [...(content.benefits.items || []), { title: "", description: "" }]; 
              updateField("benefits", "items", n); 
            }} 
            className="w-full text-[12px] py-1.5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah
          </button>
        </div>
      )}

      {/* FAQ FORM */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Judul Section {needsAttention("faq.title") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.faq.title || ""} 
              onChange={(e) => updateField("faq", "title", e.target.value)} 
              className={fieldClass("faq.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          {content.faq.items?.map((item: any, idx: number) => (
            <div key={idx} className="border border-white/10 p-2.5 rounded-lg space-y-2 bg-white/[0.03]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">FAQ #{idx + 1}</span>
                <button 
                  type="button"
                  onClick={() => { 
                    const n = content.faq.items.filter((_: any, i: number) => i !== idx); 
                    updateField("faq", "items", n); 
                  }} 
                  className="text-red-400 text-[11px]"
                >
                  Hapus
                </button>
              </div>
              <input 
                type="text" 
                value={item.question || ""} 
                onChange={(e) => { 
                  const n = [...content.faq.items]; 
                  n[idx].question = e.target.value; 
                  updateField("faq", "items", n); 
                }} 
                placeholder="Pertanyaan" 
                className={fieldClass(`faq.items.${idx}.question`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400")} 
              />
              <textarea 
                rows={2} 
                value={item.answer || ""} 
                onChange={(e) => { 
                  const n = [...content.faq.items]; 
                  n[idx].answer = e.target.value; 
                  updateField("faq", "items", n); 
                }} 
                placeholder="Jawaban" 
                className={fieldClass(`faq.items.${idx}.answer`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400 resize-none")} 
              />
            </div>
          ))}
          <button 
            type="button"
            onClick={() => { 
              const n = [...(content.faq.items || []), { question: "", answer: "" }]; 
              updateField("faq", "items", n); 
            }} 
            className="w-full text-[12px] py-1.5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah FAQ
          </button>
        </div>
      )}

      {/* CTA FORM */}
      {activeTab === "cta" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Headline CTA {needsAttention("cta.headline") && <span className="text-amber-300">⚠️</span>}
              </span>
              <AiFieldButton
                loading={aiLoadingField === "cta.headline"}
                onGenerate={() => handleAiText("cta", "headline", "Buat headline CTA yang kuat, action-oriented, dan menutup keraguan pembeli")}
                title="AI: generate headline CTA"
              />
            </label>
            <input 
              id="field-cta.headline"
              type="text" 
              value={content.cta.headline || ""} 
              onChange={(e) => updateField("cta", "headline", e.target.value)} 
              className={fieldClass("cta.headline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Teks Tombol {needsAttention("cta.button_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-cta.button_text"
              type="text" 
              value={content.cta.button_text || ""} 
              onChange={(e) => updateField("cta", "button_text", e.target.value)} 
              className={fieldClass("cta.button_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <LinkTypeInput 
            urlValue={content.cta.button_url || ""}
            updateUrl={(val) => {
              updateField("cta", "button_url", val);
              const waNumber = val.replace(/\s+/g, "").match(/(?:wa\.me\/|phone=)([0-9]+)/i)?.[1] || "";
              if (waNumber && (!content.contact?.phone || isPlaceholderValue(content.contact.phone, "phone"))) {
                updateField("contact", "phone", "0" + waNumber.slice(2));
              }
            }}
            needsAttention={needsAttention("cta.button_url")}
            fieldClass={fieldClass}
            path="cta.button_url"
            label="Link Tombol"
            defaultWaNumber={content.contact?.phone}
          />
        </div>
      )}

      {/* CONTACT FORM */}
      {activeTab === "contact" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Rata Konten</label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
              {[
                { value: "left", label: "Kiri" },
                { value: "center", label: "Tengah" },
                { value: "right", label: "Kanan" },
              ].map((option) => {
                const active = (content.contact.align || "center") === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("contact", "align", option.value)}
                    className={`rounded-md px-2 py-1.5 text-[11px] font-semibold transition ${
                      active
                        ? "bg-violet-600 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Judul {needsAttention("contact.title") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-contact.title"
              type="text" 
              value={content.contact.title || ""} 
              onChange={(e) => updateField("contact", "title", e.target.value)} 
              className={fieldClass("contact.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Alamat <span className="text-slate-600 normal-case font-normal">(opsional)</span>
            </label>
            <input 
              id="field-contact.address"
              type="text" 
              value={content.contact.address || ""} 
              onChange={(e) => updateField("contact", "address", e.target.value)} 
              className={fieldClass("contact.address", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Nomor WhatsApp {needsAttention("contact.phone") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-contact.phone"
              type="text" 
              value={content.contact.phone || ""} 
              onChange={(e) => {
                const val = e.target.value;
                updateField("contact", "phone", val);
                
                // Keep Hero/CTA buttons in sync if they are currently set as WhatsApp links
                const digits = val.replace(/\D/g, "");
                if (digits) {
                  let formattedDigits = digits;
                  if (formattedDigits.startsWith("0")) {
                    formattedDigits = "62" + formattedDigits.slice(1);
                  }
                  
                  if (/wa\.me|whatsapp\.com/i.test(content.hero?.cta_url || "")) {
                    updateField("hero", "cta_url", `https://wa.me/${formattedDigits}`);
                  }
                  if (/wa\.me|whatsapp\.com/i.test(content.cta?.button_url || "")) {
                    updateField("cta", "button_url", `https://wa.me/${formattedDigits}`);
                  }
                }
              }} 
              className={fieldClass("contact.phone", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Email <span className="text-slate-600 normal-case font-normal">(opsional)</span>
            </label>
            <input 
              id="field-contact.email"
              type="email" 
              value={content.contact.email || ""} 
              onChange={(e) => updateField("contact", "email", e.target.value)} 
              className={fieldClass("contact.email", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
            <span className="text-[12px] font-medium text-slate-200">Formulir Kontak</span>
            <input 
              type="checkbox" 
              checked={content.contact.show_lead_form !== false} 
              onChange={(e) => updateField("contact", "show_lead_form", e.target.checked)} 
              className="w-4 h-4 accent-violet-600 cursor-pointer" 
            />
          </div>
        </div>
      )}

      {/* FOOTER FORM */}
      {activeTab === "footer" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Nama Brand</label>
            <input 
              id="field-footer.brand_name"
              type="text" 
              value={content.footer?.brand_name || ""} 
              onChange={(e) => updateField("footer", "brand_name", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Tagline</label>
            <input 
              id="field-footer.tagline"
              type="text" 
              value={content.footer?.tagline || ""} 
              onChange={(e) => updateField("footer", "tagline", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Copyright</label>
            <input 
              id="field-footer.copyright_text"
              type="text" 
              value={content.footer?.copyright_text || ""} 
              onChange={(e) => updateField("footer", "copyright_text", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent" 
            />
          </div>
        </div>
      )}

      {/* SEO FORM */}
      {activeTab === "seo" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2.5 text-[12px] leading-relaxed text-cyan-100">
            <p className="font-semibold text-cyan-50">SEO tidak tampil sebagai section di halaman publik.</p>
            <p className="mt-1 text-cyan-100/80">
              Data ini dipakai mesin pencari dan preview saat link dibagikan, seperti judul Google, deskripsi, favicon, dan gambar share.
            </p>
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Meta Title {needsAttention("seo.title") && <span className="text-amber-300">⚠️</span>}
              </span>
              <AiFieldButton
                loading={aiLoadingField === "seo.title"}
                onGenerate={() => handleAiText("seo", "title", "Buat SEO title yang mengandung nama bisnis, lokasi, dan layanan utama. Maks 60 karakter.")}
                title="AI: generate SEO title"
              />
            </label>
            <input 
              id="field-seo.title"
              type="text" 
              value={content.seo?.title || ""} 
              onChange={(e) => updateField("seo", "title", e.target.value)} 
              className={fieldClass("seo.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Meta Description {needsAttention("seo.description") && <span className="text-amber-300">⚠️</span>}
              </span>
              <AiFieldButton
                loading={aiLoadingField === "seo.description"}
                onGenerate={() => handleAiText("seo", "description", "Buat meta description yang menarik klik di Google. Maks 155 karakter, sertakan nama bisnis dan value proposition.")}
                title="AI: generate meta description"
              />
            </label>
            <textarea 
              id="field-seo.description"
              rows={3} 
              value={content.seo?.description || ""} 
              onChange={(e) => updateField("seo", "description", e.target.value)} 
              className={fieldClass("seo.description", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none bg-transparent")} 
            />
          </div>
          <FileUpload label="Favicon" value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
          <FileUpload label="OG Image" value={content.seo?.og_image_url || ""} onChange={(val) => updateField("seo", "og_image_url", val)} placeholder="https://..." maxWidth={1200} maxHeight={630} quality={0.85} />
        </div>
      )}

      {/* TESTIMONIALS FORM */}
      {activeTab === "testimonials" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Judul Section</label>
            <input
              type="text"
              value={content.testimonials?.title || ""}
              onChange={(e) => updateField("testimonials", "title", e.target.value)}
              placeholder="cth. Cerita dari Pelanggan Kami"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent text-slate-200 placeholder-slate-600"
            />
          </div>
          {(content.testimonials?.items || []).map((item: any, idx: number) => (
            <div key={idx} className="border border-white/10 p-3 rounded-xl space-y-2.5 bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500">Testimoni #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const n = content.testimonials.items.filter((_: any, i: number) => i !== idx);
                    updateField("testimonials", "items", n);
                  }}
                  className="text-red-400/70 hover:text-red-400 text-[11px] cursor-pointer"
                >
                  Hapus
                </button>
              </div>
              {/* Quote */}
              <div>
                <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Kutipan</label>
                <textarea
                  rows={2}
                  value={item.quote || ""}
                  onChange={(e) => {
                    const n = [...content.testimonials.items];
                    n[idx] = { ...n[idx], quote: e.target.value };
                    updateField("testimonials", "items", n);
                  }}
                  placeholder="Tulis kutipan spesifik dan believable..."
                  className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent text-slate-200 placeholder-slate-600 resize-none"
                />
              </div>
              {/* Name + Role row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Nama</label>
                  <input
                    type="text"
                    value={item.name || ""}
                    onChange={(e) => {
                      const n = [...content.testimonials.items];
                      n[idx] = { ...n[idx], name: e.target.value };
                      updateField("testimonials", "items", n);
                    }}
                    placeholder="cth. Budi Santoso"
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent text-slate-200 placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Profesi / Konteks</label>
                  <input
                    type="text"
                    value={item.role || ""}
                    onChange={(e) => {
                      const n = [...content.testimonials.items];
                      n[idx] = { ...n[idx], role: e.target.value };
                      updateField("testimonials", "items", n);
                    }}
                    placeholder="cth. Pelanggan tetap"
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent text-slate-200 placeholder-slate-600"
                  />
                </div>
              </div>
              {/* Avatar initials + color row */}
              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Inisial Avatar</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={item.avatar_initials || ""}
                    onChange={(e) => {
                      const n = [...content.testimonials.items];
                      n[idx] = { ...n[idx], avatar_initials: e.target.value.toUpperCase().slice(0, 2) };
                      updateField("testimonials", "items", n);
                    }}
                    placeholder="BS"
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent text-slate-200 placeholder-slate-600 uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Warna Avatar</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-md border border-white/15 overflow-hidden flex-shrink-0">
                      <input
                        type="color"
                        value={item.avatar_color || "#7c3aed"}
                        onChange={(e) => {
                          const n = [...content.testimonials.items];
                          n[idx] = { ...n[idx], avatar_color: e.target.value };
                          updateField("testimonials", "items", n);
                        }}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div className="w-full h-full" style={{ backgroundColor: item.avatar_color || "#7c3aed" }} />
                    </div>
                    <input
                      type="text"
                      value={item.avatar_color || ""}
                      onChange={(e) => {
                        const n = [...content.testimonials.items];
                        n[idx] = { ...n[idx], avatar_color: e.target.value };
                        updateField("testimonials", "items", n);
                      }}
                      placeholder="#7c3aed"
                      className="flex-1 px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent text-slate-200 placeholder-slate-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const current = content.testimonials?.items || [];
              updateField("testimonials", "items", [
                ...current,
                { quote: "", name: "", role: "", avatar_initials: "", avatar_color: "#7c3aed" }
              ]);
            }}
            className="w-full text-[12px] py-2 border border-dashed border-white/10 rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Testimoni
          </button>
        </div>
      )}

      {/* MENU FORM */}
      {activeTab === "menu" && (
        <>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2.5 text-[12px] leading-relaxed text-violet-200 mb-1">
            <p className="font-semibold text-violet-100">📋 Section Menu</p>
            <p className="mt-1 text-violet-200/80">
              Tambah kategori dan item di sini. Setiap item bisa dilengkapi foto, nama, deskripsi, dan harga.
              Pengunjung website bisa klik <strong>+ Tambah</strong> untuk memasukkan ke keranjang dan pesan via WhatsApp.
            </p>
          </div>
          <MenuCatalogForm
            sectionKey="menu"
            sectionTitle="Menu"
            itemLabel="item menu"
            hasPrice
            hasBadge={false}
            data={content.menu}
            updateField={updateField}
          />
        </>
      )}

      {/* CATALOG FORM */}
      {activeTab === "catalog" && (
        <>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2.5 text-[12px] leading-relaxed text-violet-200 mb-1">
            <p className="font-semibold text-violet-100">🛍️ Section Katalog Produk</p>
            <p className="mt-1 text-violet-200/80">
              Tambah kategori dan produk di sini. Setiap produk bisa dilengkapi foto, nama, deskripsi, harga, dan badge (cth: Best Seller).
              Pengunjung website bisa klik <strong>+ Tambah</strong> untuk memasukkan ke keranjang dan pesan via WhatsApp.
            </p>
          </div>
          <MenuCatalogForm
            sectionKey="catalog"
            sectionTitle="Katalog Produk"
            itemLabel="produk"
            hasPrice
            hasBadge
            data={content.catalog}
            updateField={updateField}
          />
        </>
      )}
    </>
  );
}

// ─── Shared Menu / Catalog Editor ───────────────────────────────────────────
interface MenuCatalogFormProps {
  sectionKey: "menu" | "catalog";
  sectionTitle: string;
  itemLabel: string;
  hasPrice: boolean;
  hasBadge: boolean;
  data: any;
  updateField: (section: string, key: string, val: any) => void;
}

function MenuCatalogForm({ sectionKey, sectionTitle, itemLabel, hasPrice, hasBadge, data, updateField }: MenuCatalogFormProps) {
  const [expandedCat, setExpandedCat] = React.useState<number | null>(0);

  const categories: any[] = data?.categories ?? [];

  const updateCategories = (next: any[]) => updateField(sectionKey, "categories", next);

  const addCategory = () => {
    const next = [...categories, { name: `Kategori ${categories.length + 1}`, items: [] }];
    updateCategories(next);
    setExpandedCat(next.length - 1);
  };

  const removeCategory = (catIdx: number) => {
    updateCategories(categories.filter((_, i) => i !== catIdx));
    setExpandedCat(null);
  };

  const updateCategoryName = (catIdx: number, name: string) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], name };
    updateCategories(next);
  };

  const addItem = (catIdx: number) => {
    const next = [...categories];
    const newItem: any = { name: "", description: "", price: "", image_url: null };
    if (hasBadge) newItem.badge = null;
    next[catIdx] = { ...next[catIdx], items: [...(next[catIdx].items ?? []), newItem] };
    updateCategories(next);
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], items: next[catIdx].items.filter((_: any, i: number) => i !== itemIdx) };
    updateCategories(next);
  };

  const updateItem = (catIdx: number, itemIdx: number, field: string, value: any) => {
    const next = [...categories];
    const items = [...(next[catIdx].items ?? [])];
    items[itemIdx] = { ...items[itemIdx], [field]: value };
    next[catIdx] = { ...next[catIdx], items };
    updateCategories(next);
  };

  const inputBase = "w-full px-3 py-2 border border-white/10 rounded-xl text-[13px] outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 bg-white/[0.03] text-slate-100 placeholder-slate-500";
  const inputLabel = "text-[10px] uppercase tracking-wide font-bold text-slate-500 block mb-1";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-white/[0.02] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <label className={inputLabel}>Judul Section</label>
            <input
              type="text"
              value={data?.title ?? ""}
              onChange={(e) => updateField(sectionKey, "title", e.target.value)}
              placeholder={`cth. Menu ${sectionTitle}`}
              className={`${inputBase} bg-white/[0.04]`}
            />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-semibold text-violet-200">
            {sectionKey === "menu" ? "Kuliner" : "Produk"} · {categories.length} kategori
          </div>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-violet-500/20 bg-violet-500/5 p-6 text-center">
          <p className="text-sm font-semibold text-slate-200">Belum ada kategori</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Tambahkan kategori agar {itemLabel} bisa ditampilkan lebih rapi di website.</p>
        </div>
      )}

      {categories.map((cat: any, catIdx: number) => {
        const itemCount = cat.items?.length ?? 0;

        return (
          <div key={catIdx} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="flex items-center gap-2 bg-gradient-to-r from-white/[0.045] to-white/[0.015] px-3 py-2.5 border-b border-white/10">
              <GripVertical className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <input
                type="text"
                value={cat.name ?? ""}
                onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                placeholder="Nama kategori"
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-100 outline-none placeholder-slate-600"
              />
              <span className="text-[10px] text-slate-500 flex-shrink-0">{itemCount} item</span>
              <button
                type="button"
                onClick={() => setExpandedCat(expandedCat === catIdx ? null : catIdx)}
                className="text-slate-500 hover:text-slate-200 p-1 cursor-pointer"
              >
                {expandedCat === catIdx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => removeCategory(catIdx)}
                className="text-red-500/60 hover:text-red-400 p-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {expandedCat === catIdx && (
              <div className="p-3 space-y-3">
                {(cat.items ?? []).length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-xs text-slate-500">
                    Belum ada {itemLabel}. Klik tombol di bawah untuk menambah.
                  </div>
                )}

                {(cat.items ?? []).map((item: any, itemIdx: number) => (
                  <div key={itemIdx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wide font-bold text-slate-500">{itemLabel} #{itemIdx + 1}</span>
                      <button type="button" onClick={() => removeItem(catIdx, itemIdx)} className="text-red-500/60 hover:text-red-400 cursor-pointer p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[180px_1fr]">
                      <FileUpload
                        label="Foto"
                        value={item.image_url ?? ""}
                        onChange={(val) => updateItem(catIdx, itemIdx, "image_url", val || null)}
                        placeholder="https://..."
                        maxWidth={800}
                        maxHeight={600}
                        quality={0.8}
                      />

                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className={inputLabel}>Nama</label>
                            <input
                              type="text"
                              value={item.name ?? ""}
                              onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)}
                              placeholder={`Nama ${itemLabel}`}
                              className={inputBase}
                            />
                          </div>

                          {hasPrice && (
                            <div>
                              <label className={inputLabel}>Harga</label>
                              <input
                                type="text"
                                value={item.price ?? ""}
                                onChange={(e) => updateItem(catIdx, itemIdx, "price", e.target.value)}
                                placeholder="cth. Rp 25.000"
                                className={inputBase}
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className={inputLabel}>Deskripsi</label>
                          <textarea
                            rows={2}
                            value={item.description ?? ""}
                            onChange={(e) => updateItem(catIdx, itemIdx, "description", e.target.value)}
                            placeholder="Deskripsi singkat..."
                            className={`${inputBase} resize-none`}
                          />
                        </div>

                        {hasBadge && (
                          <div>
                            <label className={inputLabel}>Badge</label>
                            <input
                              type="text"
                              value={item.badge ?? ""}
                              onChange={(e) => updateItem(catIdx, itemIdx, "badge", e.target.value || null)}
                              placeholder="cth. Best Seller"
                              className={inputBase}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addItem(catIdx)}
                  className="w-full text-[12px] py-2 border border-dashed border-violet-500/20 rounded-xl text-violet-200/80 hover:bg-violet-500/10 hover:border-violet-500/40 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah {itemLabel}
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addCategory}
        className="w-full text-[12px] py-2.5 border border-white/10 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Tambah Kategori
      </button>
    </div>
  );
}
