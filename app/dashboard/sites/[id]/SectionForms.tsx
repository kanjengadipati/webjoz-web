import React, { useState } from "react";
import { AiFieldButton, EMOJI_GROUPS, MCF_INPUT_BASE as inputBase_mcf, MCF_INPUT_LABEL as inputLabel_mcf, normStr, MenuCatalogForm } from "@/components/menu-catalog-form";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, RefreshCw, Loader2, Star, Zap, Shield, Award, Heart, CheckCircle, Clock, Globe, Users, TrendingUp, Leaf, Flame, Lightbulb, Target, Truck, ThumbsUp, Lock, Phone, Mail, MapPin, Camera, Utensils, Coffee, ShoppingBag, Wrench, Stethoscope, BookOpen, Home, Building2, Briefcase, Search, Check, RotateCcw } from "lucide-react";
import { SparkleIcon, SparkleGenAI } from "@/components/sparkle-icon";
import FileUpload from "@/components/file-upload";
import LocationPicker from "@/components/location-picker";
import { GoogleSnippetPreview } from "@/components/google-snippet-preview";
import { isPlaceholderValue, AI_SUGGESTIONS } from "./editor-utils";
import { request } from "@/lib/api/client";
import { getEnabledMapTiles } from "@/lib/design-assets-config";
import { SocialPlatformSelect, SOCIAL_PLATFORMS, SocialIcon } from "@/components/sections/social-platforms";
import { useToast } from "@/components/toast-provider";

const ALL_MAP_TILES = [
  { key: "default", label: "OSM" },
  { key: "cyclosm", label: "CyclOSM" },
  { key: "light", label: "Terang" },
  { key: "dark", label: "Gelap" },
  { key: "esri", label: "Esri" },
  { key: "satelit", label: "Satelit" },
];

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
  designToken?: any;
  updateDesignTokenLayout?: (key: string, value: any) => void;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
  onAiSuccess?: () => void;
  subdomain?: string;
  fieldUndoStacks?: Record<string, string[]>;
  undoField?: (section: string, key: string) => void;
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
        <SelectedIcon className="w-4 h-4 text-primary shrink-0" />
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
                className={`flex items-center justify-center p-2 rounded transition-all hover:bg-primary/20 ${value === name ? "bg-primary/30 ring-1 ring-primary" : ""}`}
              >
                <Icon className={`w-4 h-4 ${value === name ? "text-primary" : "text-slate-400"}`} />
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

// ─── Collapsible Group ──────────────────────────────────────────────────────────
function CollapsibleGroup({ label, defaultOpen = false, children }: { label: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-md bg-white/[0.02]">
      <button type="button" onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full px-3 py-2 text-[11px] uppercase tracking-wide font-semibold text-slate-400 cursor-pointer">
        <span>{label}</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  );
}

// ─── Keywords Input ────────────────────────────────────────────────────────────
interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  aiLoading?: boolean;
  onAiGenerate?: () => Promise<void>;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
  renderFieldActions?: (section: string, key: string, aiButton?: React.ReactNode) => React.ReactNode;
}

function KeywordsInput({ keywords, onChange, aiLoading, onAiGenerate, isPremium, onUpgradeRequired, renderFieldActions }: KeywordsInputProps) {
  const [input, setInput] = useState("");

  const addKeyword = (kw: string) => {
    const trimmed = kw.trim().toLowerCase();
    if (!trimmed || keywords.includes(trimmed)) return;
    onChange([...keywords, trimmed]);
  };

  const removeKeyword = (idx: number) => {
    onChange(keywords.filter((_, i) => i !== idx));
  };

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
          renderFieldActions("seo", "keywords", onAiGenerate && (
            <AiFieldButton
              loading={!!aiLoading}
              onGenerate={onAiGenerate}
              title="AI: generate keywords"
              onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
            />
          ))
        ) : onAiGenerate ? (
          <AiFieldButton
            loading={!!aiLoading}
            onGenerate={onAiGenerate}
            title="AI: generate keywords"
            onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
          />
        ) : null}
      </label>
      <div className="flex flex-wrap gap-1.5 min-h-[32px] px-2 py-1.5 border rounded-md bg-transparent">
        {keywords.map((kw, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: "rgba(99,102,241,0.15)", color: "rgb(165, 180, 252)" }}
          >
            {kw}
            <button
              type="button"
              onClick={() => removeKeyword(idx)}
              className="hover:text-red-400 cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={keywords.length === 0 ? "Ketik keyword lalu Enter..." : "Tambah keyword..."}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-[12px] text-slate-200 placeholder-slate-600"
        />
      </div>
    </div>
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
  const res = await request<any>("/ai/regenerate-section", {
    method: "POST",
    body: JSON.stringify({
      site_id: siteId,
      section,
      instructions: `Fokus hanya pada field "${fieldKey}": ${prompt}. Jaga field lain tetap sama.`,
      tenant_id: activeTenantId,
    }),
  }, token);
  if (res.status !== "success") {
    throw new Error(res.message || "AI gagal memproses.");
  }
  if (!res.data?.section) return null;
  const updated = res.data.section;
  // Return the specific field value from the updated section
  return updated[fieldKey] ?? null;
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
                ? "bg-primary text-primary-foreground font-bold"
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
                ? "bg-primary text-primary-foreground font-bold"
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
              className={fieldClass(path, "w-full pl-6 pr-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")}
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
            className={fieldClass(path, "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")}
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
  designToken,
  updateDesignTokenLayout,
  isPremium = false,
  onUpgradeRequired,
  onAiSuccess,
  subdomain,
  fieldUndoStacks,
  undoField,
}: SectionFormsProps) {
  const { pushToast } = useToast();
  const renderFieldActions = (section: string, key: string, aiButton?: React.ReactNode) => {
    const fieldPath = `${section}.${key}`;
    const stack = fieldUndoStacks?.[fieldPath] || [];
    if (stack.length === 0 && !aiButton) return null;
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        {stack.length > 0 && (
          <button
            type="button"
            onClick={() => undoField?.(section, key)}
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
  const [aiLoadingField, setAiLoadingField] = React.useState<string | null>(null);
  const [aiLoadingDesc, setAiLoadingDesc] = React.useState<string | null>(null);
  const [resolvingMaps, setResolvingMaps] = React.useState(false);
  const [resolveError, setResolveError] = React.useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = React.useState(false);

  const [fieldPromptModal, setFieldPromptModal] = React.useState<{
    section: string;
    fieldKey: string;
    label: string;
    imageUrl?: string;
    resolve: (val: string | null) => void;
  } | null>(null);
  const [fieldPromptInput, setFieldPromptInput] = React.useState("");

  // ─── GSC state (self-contained) ─────────────────────────────────────────────────
  const [gscInput, setGscInput]   = React.useState("");
  const [gscSaving, setGscSaving] = React.useState(false);
  const [gscSaved, setGscSaved]   = React.useState(false);

  // Fetch current GSC code when the SEO tab is opened
  React.useEffect(() => {
    if (activeTab !== "seo" || !token || !activeTenantId || !siteId) return;
    const tenantHeaders = { "X-Tenant-ID": String(activeTenantId) };
    request<any>(`/sites/${siteId}/content`, { headers: tenantHeaders }, String(token))
      .then((res) => {
        const code = res.data?.tracking_codes?.gsc_verification ?? "";
        setGscInput(code);
      })
      .catch(() => { /* non-critical */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleGscSave = async () => {
    if (!token || !activeTenantId || !siteId) return;
    setGscSaving(true);
    setGscSaved(false);
    const tenantHeaders = { "X-Tenant-ID": String(activeTenantId) };
    try {
      // Fetch existing codes first so we don’t wipe GA4 / Meta Pixel
      let existingCodes: Record<string, string> = {};
      try {
        const res = await request<any>(`/sites/${siteId}/content`, { headers: tenantHeaders }, String(token));
        existingCodes = res.data?.tracking_codes ?? {};
      } catch { /* fall back to empty */ }
      await request(`/sites/${siteId}/tracking-codes`, {
        method: "PATCH",
        headers: tenantHeaders,
        body: JSON.stringify({ tracking_codes: { ...existingCodes, gsc_verification: gscInput.trim() } }),
      }, String(token));
      setGscSaved(true);
      pushToast?.("Kode GSC berhasil disimpan", "success");
      setTimeout(() => setGscSaved(false), 3000);
    } catch (err: any) {
      pushToast?.(err.message || "Gagal menyimpan kode GSC", "error");
    } finally {
      setGscSaving(false);
    }
  };

  // Auto-initialize floating_button default when user opens the floating tab
  React.useEffect(() => {
    if (activeTab === "floating" && designToken?.layout?.floating_button === undefined) {
      updateDesignTokenLayout?.("floating_button", "whatsapp");
    }
  }, [activeTab]);
  const businessType = content?.header?.brand_name ? "" : "";
  // Extract business type from seo title or brand context as best-effort
  const bType = content?.seo?.title?.split("-")?.[1]?.trim() || content?.contact?.address || "";

  const handleAiText = async (section: string, fieldKey: string, prompt: string, label: string) => {
    if (!token || !activeTenantId || !siteId) return;

    const customPrompt = await new Promise<string | null>((resolve) => {
      setFieldPromptInput("");
      setFieldPromptModal({ section, fieldKey, label, resolve });
    });
    if (customPrompt === null) return;

    const loadKey = `${section}.${fieldKey}`;
    setAiLoadingField(loadKey);
    try {
      const fullPrompt = customPrompt.trim()
        ? `${prompt} dengan instruksi khusus tambahan: "${customPrompt}"`
        : prompt;
      const result = await generateFieldText(String(token), activeTenantId, siteId, section, fieldKey, content, fullPrompt);
      if (result) {
        updateField(section, fieldKey, result);
        onAiSuccess?.();
      }
    } catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") {
        onUpgradeRequired?.();
      } else {
        pushToast?.(err.message || "AI gagal meregenerasi teks field ini.", "error");
      }
      throw err;
    } finally {
      setAiLoadingField(null);
    }
  };

  const handleAiItemDescription = async (catIdx: number, itemIdx: number, itemName: string, catName: string, imageUrl?: string) => {
    if (!token || !activeTenantId || !siteId) return;

    const customPrompt = await new Promise<string | null>((resolve) => {
      setFieldPromptInput("");
      setFieldPromptModal({
        section: activeTab,
        fieldKey: `categories.${catIdx}.items.${itemIdx}.description`,
        label: `Deskripsi: ${itemName}`,
        imageUrl: imageUrl || undefined,
        resolve,
      });
    });
    if (customPrompt === null) return;

    const loadKey = `${catIdx}_${itemIdx}`;
    setAiLoadingDesc(loadKey);
    try {
      const imageContext = imageUrl ? ` Gambar item tersedia di: ${imageUrl} — gunakan URL ini sebagai konteks visual untuk menulis deskripsi yang akurat dan menggugah selera.` : "";
      const instructions = `Fokus hanya pada deskripsi item "${itemName}" di kategori "${catName}" (index kategori=${catIdx}, index item=${itemIdx}). Buat deskripsi yang menarik dan informatif, 1-3 kalimat. Jaga field lain tetap sama.${imageContext}${customPrompt.trim() ? ` Instruksi tambahan: "${customPrompt}"` : ""}`;
      const res = await request<any>("/ai/regenerate-section", {
        method: "POST",
        body: JSON.stringify({
          site_id: siteId,
          section: activeTab,
          instructions,
          tenant_id: activeTenantId,
          image_url: imageUrl || undefined,
        }),
      }, String(token));
      if (res.status === "success" && res.data?.section) {
        const updated = res.data.section;
        const cats = updated?.categories ?? [];
        const targetCat = cats[catIdx];
        if (targetCat) {
          const targetItems = targetCat.items ?? [];
          const targetItem = targetItems[itemIdx];
          if (targetItem?.description) {
            updateField(activeTab, "categories", cats);
            onAiSuccess?.();
          }
        }
      }
    } catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") {
        onUpgradeRequired?.();
      } else {
        pushToast?.(err.message || "AI gagal meregenerasi deskripsi item.", "error");
      }
      throw err;
    } finally {
      setAiLoadingDesc(null);
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
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Nama Brand {needsAttention("header.brand_name") && <span className="text-amber-300">⚠️</span>}</span>
              {renderFieldActions("header", "brand_name")}
            </label>
            <input 
              id="field-header.brand_name"
              type="text" 
              value={content.header?.brand_name || ""} 
              onChange={(e) => updateField("header", "brand_name", e.target.value)} 
              className={fieldClass("header.brand_name", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
            <span className="text-[12px] font-medium text-slate-200">Tampilkan Tombol Navigasi</span>
            <input 
              type="checkbox" 
              checked={!(content.header as any)?.nav_cta_hidden} 
              onChange={(e) => updateField("header", "nav_cta_hidden", !e.target.checked)} 
              className="w-4 h-4 accent-primary cursor-pointer" 
            />
          </div>

          {!(content.header as any)?.nav_cta_hidden && (
            <>
              <div className="space-y-1">
                <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                  <span>Teks Tombol Nav {needsAttention("header.nav_cta_text") && <span className="text-amber-300">⚠️</span>}</span>
                  {renderFieldActions("header", "nav_cta_text")}
                </label>
                <input
                  id="field-header.nav_cta_text"
                  type="text"
                  value={content.header?.nav_cta_text || ""}
                  onChange={(e) => updateField("header", "nav_cta_text", e.target.value)}
                  placeholder="cth. Hubungi Kami"
                  className={fieldClass("header.nav_cta_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Link ke Section</label>
                <select
                  value={(content.header as any)?.nav_cta_href || ""}
                  onChange={(e) => updateField("header", "nav_cta_href", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-slate-900 text-slate-300"
                >
                  <option value="">— Otomatis dari teks —</option>
                  <option value="#hero">Hero (Atas)</option>
                  <option value="#about">Tentang Kami</option>
                  <option value="#benefits">Keunggulan</option>
                  <option value="#catalog">Katalog / Produk</option>
                  <option value="#menu">Menu</option>
                  <option value="#gallery">Galeri</option>
                  <option value="#testimonials">Testimoni</option>
                  <option value="#faq">FAQ</option>
                  <option value="#contact">Kontak</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  Biarkan kosong untuk mendeteksi section otomatis berdasarkan teks tombol.
                </p>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Tagline <span className="text-slate-600 font-normal normal-case">(opsional)</span></label>
            <input
              type="text"
              value={content.header?.tagline || ""}
              onChange={(e) => updateField("header", "tagline", e.target.value)}
              placeholder="cth. Cita Rasa Nusantara"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
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
            <input id="field-header.icon" type="text" value={content.header?.icon || ""} onChange={(e) => updateField("header", "icon", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent" placeholder="cth. Utensils" />
          </div>

          {/* Nav Menu Items */}
          <div className="pt-2 space-y-2">
            <div>
              <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Menu Navigasi</label>
              <p className="text-[10px] text-slate-500 mt-0.5">Atur item yang tampil di navbar</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {([
                ["about", "Tentang"],
                ["benefits", "Keunggulan"],
                ["menu", "Menu"],
                ["catalog", "Katalog"],
                ["gallery", "Galeri"],
                ["testimonials", "Testimoni"],
                ["faq", "FAQ"],
                ["cta", "Promo"],
                ["contact", "Kontak"],
                ["blog", "Blog"],
              ] as const).map(([key, label]) => {
                const hidden = designToken?.layout?.nav_hidden_sections?.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      const current: string[] = designToken?.layout?.nav_hidden_sections ?? [];
                      const next = hidden
                        ? current.filter((s: string) => s !== key)
                        : [...current, key];
                      updateDesignTokenLayout?.("nav_hidden_sections", next);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                      hidden
                        ? "border-white/5 bg-white/[0.03] text-slate-600 line-through"
                        : "border-primary/20 bg-primary/10 text-primary"
                    }`}
                  >
                    {hidden ? "🙈" : "👁️"}
                    {label}
                  </button>
                );
              })}
            </div>
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
          {/* Eyebrow label (semua template, opsional) */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Eyebrow / Label Badge <span className="text-slate-600 font-normal normal-case">(opsional)</span></span>
              {renderFieldActions("hero", "eyebrow")}
            </label>
            <input
              id="field-hero.eyebrow"
              type="text"
              value={content.hero?.eyebrow || ""}
              onChange={(e) => updateField("hero", "eyebrow", e.target.value)}
              placeholder="cth. Tersedia Sekarang"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
            <p className="text-[10px] text-slate-600 leading-relaxed">Label kecil di atas headline (dipakai oleh beberapa template).</p>
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Headline {needsAttention("hero.headline") && <span className="text-amber-300">⚠️</span>}
              </span>
              {renderFieldActions("hero", "headline", (
                <AiFieldButton
                  loading={aiLoadingField === "hero.headline"}
                  onGenerate={() => handleAiText("hero", "headline", "Buat headline yang kuat dan memikat, max 10 kata", "Headline")}
                  title="AI: generate headline"
                  onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
                />
              ))}
            </label>
            <input 
              id="field-hero.headline"
              type="text" 
              value={content.hero.headline || ""} 
              onChange={(e) => updateField("hero", "headline", e.target.value)} 
              className={fieldClass("hero.headline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Matra / Tagline</span>
              {renderFieldActions("hero", "matra")}
            </label>
            <input
              id="field-hero.matra"
              type="text"
              value={content.hero?.matra || ""}
              onChange={(e) => updateField("hero", "matra", e.target.value)}
              placeholder="cth. Cita Rasa Jogja · Sejak 2010"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
            <p className="text-[10px] text-slate-600 leading-relaxed">Slogan singkat yang muncul di antara headline and subheadline dengan garis dekoratif.</p>
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Subheadline {needsAttention("hero.subheadline") && <span className="text-amber-300">⚠️</span>}
              </span>
              {renderFieldActions("hero", "subheadline", (
                <AiFieldButton
                  loading={aiLoadingField === "hero.subheadline"}
                  onGenerate={() => handleAiText("hero", "subheadline", "Buat subheadline yang jelas menyampaikan value proposition, max 25 kata", "Subheadline")}
                  title="AI: generate subheadline"
                  onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
                />
              ))}
            </label>
            <textarea 
              id="field-hero.subheadline"
              rows={2} 
              value={content.hero.subheadline || ""} 
              onChange={(e) => updateField("hero", "subheadline", e.target.value)} 
              className={fieldClass("hero.subheadline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 resize-none bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Teks Tombol CTA {needsAttention("hero.cta_text") && <span className="text-amber-300">⚠️</span>}</span>
              {renderFieldActions("hero", "cta_text")}
            </label>
            <input 
              id="field-hero.cta_text"
              type="text" 
              value={content.hero.cta_text || ""} 
              onChange={(e) => updateField("hero", "cta_text", e.target.value)} 
              className={fieldClass("hero.cta_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
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
          {/* Secondary CTA (optional, used by Futuristic and some templates) */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Teks Tombol CTA Kedua <span className="text-slate-600 font-normal normal-case">(opsional)</span></span>
              {renderFieldActions("hero", "cta_secondary_text")}
            </label>
            <input
              id="field-hero.cta_secondary_text"
              type="text"
              value={content.hero?.cta_secondary_text || ""}
              onChange={(e) => updateField("hero", "cta_secondary_text", e.target.value)}
              placeholder="cth. Pelajari Lebih Lanjut"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
            <p className="text-[10px] text-slate-600 leading-relaxed">Tombol kedua di samping tombol utama (dipakai oleh beberapa template).</p>
          </div>
          {/* Secondary CTA URL */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>URL Tombol CTA Kedua <span className="text-slate-600 font-normal normal-case">(opsional)</span></span>
              {renderFieldActions("hero", "cta_secondary_url")}
            </label>
            <input
              id="field-hero.cta_secondary_url"
              type="text"
              value={content.hero?.cta_secondary_url || ""}
              onChange={(e) => updateField("hero", "cta_secondary_url", e.target.value)}
              placeholder="cth. #about atau https://..."
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
            <p className="text-[10px] text-slate-600 leading-relaxed">Link tujuan tombol CTA kedua (section anchor, URL, atau WhatsApp).</p>
          </div>
          {/* Badge text (small text below CTA, used by Futuristic template) */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Teks Badge Bawah CTA <span className="text-slate-600 font-normal normal-case">(opsional)</span></span>
              {renderFieldActions("hero", "badge_text")}
            </label>
            <input
              id="field-hero.badge_text"
              type="text"
              value={content.hero?.badge_text || ""}
              onChange={(e) => updateField("hero", "badge_text", e.target.value)}
              placeholder="cth. Buka 7 Hari · Jam 07.00–22.00"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
            <p className="text-[10px] text-slate-600 leading-relaxed">Teks kecil yang muncul di bawah tombol CTA (jam buka, info singkat, dll).</p>
          </div>
          {/* Opening hours (used by Bold template) */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Jam Buka <span className="text-slate-600 font-normal normal-case">(opsional)</span></span>
              {renderFieldActions("hero", "opening_hours")}
            </label>
            <input
              id="field-hero.opening_hours"
              type="text"
              value={content.hero?.opening_hours || ""}
              onChange={(e) => updateField("hero", "opening_hours", e.target.value)}
              placeholder="cth. Buka Setiap Hari 07.00 – 22.00"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
          </div>
        </div>
      )}

      {/* HERO BACKGROUND COLOR */}
      {activeTab === "hero" && (
        <div className="space-y-1 mt-2">
          <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
            Warna Latar Hero
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-md border border-white/15 overflow-hidden flex-shrink-0">
              <input
                type="color"
                value={content.hero.background_color || "#FAF7F2"}
                onChange={(e) => updateField("hero", "background_color", e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: content.hero.background_color || "#FAF7F2" }} />
            </div>
            <input
              type="text"
              value={content.hero.background_color || ""}
              onChange={(e) => updateField("hero", "background_color", e.target.value)}
              className="flex-1 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60"
              placeholder="Kosongkan untuk pakai warna global"
            />
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed">Biarkan kosong untuk menggunakan warna latar global.</p>
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
            <label className="text-[10px] text-slate-500 uppercase">Perataan Teks</label>
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => updateField("about", "textAlign", align === "left" ? undefined : align)}
                  className={`flex-1 px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                    (content.about.textAlign || "left") === align
                      ? "bg-primary/20 border-primary/60 text-primary"
                      : "border-white/10 text-slate-400 hover:border-white/30"
                  }`}
                >
                  {align === "left" ? "Kiri" : align === "center" ? "Tengah" : "Kanan"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Eyebrow <span className="text-slate-600 font-normal normal-case">(opsional)</span></span>
              {renderFieldActions("about", "eyebrow")}
            </label>
            <input
              type="text"
              value={content.about?.eyebrow || ""}
              onChange={(e) => updateField("about", "eyebrow", e.target.value)}
              placeholder="cth. Tentang Kami"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Judul {needsAttention("about.title") && <span className="text-amber-300">⚠️</span>}
              </span>
              {renderFieldActions("about", "title", (
                <AiFieldButton
                  loading={aiLoadingField === "about.title"}
                  onGenerate={() => handleAiText("about", "title", "Buat judul section tentang yang menarik dan relevan dengan bisnis", "Judul Tentang")}
                  title="AI: generate judul"
                  onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
                />
              ))}
            </label>
            <input 
              id="field-about.title"
              type="text" 
              value={content.about.title || ""} 
              onChange={(e) => updateField("about", "title", e.target.value)} 
              className={fieldClass("about.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Deskripsi {needsAttention("about.body") && <span className="text-amber-300">⚠️</span>}
              </span>
              {renderFieldActions("about", "body", (
                <AiFieldButton
                  loading={aiLoadingField === "about.body"}
                  onGenerate={() => handleAiText("about", "body", "Tulis paragraf tentang bisnis ini yang hangat, spesifik, dan manusiawi. 2-4 kalimat.", "Deskripsi")}
                  title="AI: generate deskripsi"
                  onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
                />
              ))}
            </label>
            <textarea 
              id="field-about.body"
              rows={3} 
              value={content.about.body || ""} 
              onChange={(e) => updateField("about", "body", e.target.value)} 
              className={fieldClass("about.body", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 resize-none bg-transparent")} 
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
                        className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-slate-200"
                      />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <label className="text-[10px] text-slate-500">Label</label>
                      <input
                        type="text"
                        value={stat?.label || ""}
                        onChange={(e) => updateField("about", statKey, { ...(stat || {}), label: e.target.value })}
                        placeholder="cth. Pelanggan Puas"
                        className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Milestones */}
          <CollapsibleGroup label="Milestones / Timeline" defaultOpen={false}>
            {((content.about?.milestones as any[]) || []).map((m: any, idx: number) => (
              <div key={idx} className="border border-white/10 rounded-md p-2 space-y-1.5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Milestone {idx + 1}</span>
                  <button type="button" onClick={() => {
                    const arr = [...(content.about?.milestones || [])];
                    arr.splice(idx, 1);
                    updateField("about", "milestones", arr);
                  }} className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer">Hapus</button>
                </div>
                <input type="text" value={m.year || ""} onChange={(e) => { const arr = [...(content.about?.milestones || [])]; arr[idx] = { ...arr[idx], year: e.target.value }; updateField("about", "milestones", arr); }} placeholder="Tahun (cth. 2020)" className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-slate-200" />
                <input type="text" value={m.title || ""} onChange={(e) => { const arr = [...(content.about?.milestones || [])]; arr[idx] = { ...arr[idx], title: e.target.value }; updateField("about", "milestones", arr); }} placeholder="Judul milestone" className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-slate-200" />
                <textarea rows={1} value={m.description || ""} onChange={(e) => { const arr = [...(content.about?.milestones || [])]; arr[idx] = { ...arr[idx], description: e.target.value }; updateField("about", "milestones", arr); }} placeholder="Deskripsi (opsional)" className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-slate-200 resize-none" />
              </div>
            ))}
            <button type="button" onClick={() => updateField("about", "milestones", [...(content.about?.milestones || []), { year: "", title: "", description: "" }])} className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary/80 hover:text-primary cursor-pointer"><Plus className="w-3 h-3" /> Tambah Milestone</button>
          </CollapsibleGroup>
          {/* Team Members */}
          <CollapsibleGroup label="Anggota Tim" defaultOpen={false}>
            {((content.about?.team_members as any[]) || []).map((m: any, idx: number) => (
              <div key={idx} className="border border-white/10 rounded-md p-2 space-y-1.5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Anggota {idx + 1}</span>
                  <button type="button" onClick={() => {
                    const arr = [...(content.about?.team_members || [])];
                    arr.splice(idx, 1);
                    updateField("about", "team_members", arr);
                  }} className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer">Hapus</button>
                </div>
                <input type="text" value={m.name || ""} onChange={(e) => { const arr = [...(content.about?.team_members || [])]; arr[idx] = { ...arr[idx], name: e.target.value }; updateField("about", "team_members", arr); }} placeholder="Nama" className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-slate-200" />
                <input type="text" value={m.role || ""} onChange={(e) => { const arr = [...(content.about?.team_members || [])]; arr[idx] = { ...arr[idx], role: e.target.value }; updateField("about", "team_members", arr); }} placeholder="Jabatan" className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-slate-200" />
                <FileUpload label="Foto" value={m.photo_url || ""} onChange={(val) => { const arr = [...(content.about?.team_members || [])]; arr[idx] = { ...arr[idx], photo_url: val }; updateField("about", "team_members", arr); }} placeholder="https://..." maxWidth={400} maxHeight={400} quality={0.85} />
              </div>
            ))}
            <button type="button" onClick={() => updateField("about", "team_members", [...(content.about?.team_members || []), { name: "", role: "", photo_url: "" }])} className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary/80 hover:text-primary cursor-pointer"><Plus className="w-3 h-3" /> Tambah Anggota</button>
          </CollapsibleGroup>
        </div>
      )}

      {/* BENEFITS FORM */}
      {activeTab === "benefits" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Eyebrow <span className="text-slate-600 font-normal normal-case">(opsional)</span></label>
            <input
              type="text"
              value={content.benefits?.eyebrow || ""}
              onChange={(e) => updateField("benefits", "eyebrow", e.target.value)}
              placeholder="cth. Kenapa Pilih Kami"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Judul Section {needsAttention("benefits.title") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-benefits.title"
              type="text" 
              value={content.benefits.title || ""} 
              onChange={(e) => updateField("benefits", "title", e.target.value)} 
              className={fieldClass("benefits.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Subtitle <span className="text-slate-600 font-normal normal-case">(opsional)</span></label>
            <input
              type="text"
              value={content.benefits?.subtitle || ""}
              onChange={(e) => updateField("benefits", "subtitle", e.target.value)}
              placeholder="cth. Berbagai alasan mengapa pelanggan mempercayai kami"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase">Perataan Teks</label>
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => updateField("benefits", "textAlign", align === "center" ? undefined : align)}
                  className={`flex-1 px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                    (content.benefits.textAlign || "center") === align
                      ? "bg-primary/20 border-primary/60 text-primary"
                      : "border-white/10 text-slate-400 hover:border-white/30"
                  }`}
                >
                  {align === "left" ? "Kiri" : align === "center" ? "Tengah" : "Kanan"}
                </button>
              ))}
            </div>
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
                className={fieldClass(`benefits.items.${idx}.title`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-primary/60")} 
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
                className={fieldClass(`benefits.items.${idx}.description`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-primary/60 resize-none")} 
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
                    className="w-full px-2 py-1 border border-white/10 rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-slate-200"
                  />
                </div>
                <div className="flex-1 space-y-0.5">
                  <label className="text-[10px] text-slate-500 uppercase">Keterangan Stat</label>
                  <input
                    type="text"
                    value={item.stat_label || ""}
                    onChange={(e) => { const n = [...content.benefits.items]; n[idx].stat_label = e.target.value; updateField("benefits", "items", n); }}
                    placeholder="Proyek Selesai"
                    className="w-full px-2 py-1 border border-white/10 rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-slate-200"
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
          {/* Comparison table */}
          <CollapsibleGroup label="Tabel Perbandingan" defaultOpen={false}>
            {(content.benefits?.comparison?.column_a_label !== undefined) || false ? null : null}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] text-slate-500 uppercase">Label Kolom A (Kami)</label>
                <input type="text" value={content.benefits?.comparison?.column_a_label || ""} onChange={(e) => updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), column_a_label: e.target.value })} placeholder="cth. Bersama Kami" className="w-full px-2 py-1 border border-white/10 rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-slate-200" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] text-slate-500 uppercase">Label Kolom B (Lainnya)</label>
                <input type="text" value={content.benefits?.comparison?.column_b_label || ""} onChange={(e) => updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), column_b_label: e.target.value })} placeholder="cth. Kompetitor" className="w-full px-2 py-1 border border-white/10 rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-slate-200" />
              </div>
            </div>
            {((content.benefits?.comparison?.rows as any[]) || []).map((row: any, idx: number) => (
              <div key={idx} className="border border-white/10 rounded-md p-2 space-y-1.5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Baris {idx + 1}</span>
                  <button type="button" onClick={() => { const arr = [...(content.benefits?.comparison?.rows || [])]; arr.splice(idx, 1); updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer">Hapus</button>
                </div>
                <input type="text" value={row.label || ""} onChange={(e) => { const arr = [...(content.benefits?.comparison?.rows || [])]; arr[idx] = { ...arr[idx], label: e.target.value }; updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} placeholder="Label (cth. Harga)" className="w-full px-2 py-1 border border-white/10 rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-slate-200" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={row.value_a || ""} onChange={(e) => { const arr = [...(content.benefits?.comparison?.rows || [])]; arr[idx] = { ...arr[idx], value_a: e.target.value }; updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} placeholder="Nilai A" className="w-full px-2 py-1 border border-white/10 rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-slate-200" />
                  <input type="text" value={row.value_b || ""} onChange={(e) => { const arr = [...(content.benefits?.comparison?.rows || [])]; arr[idx] = { ...arr[idx], value_b: e.target.value }; updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} placeholder="Nilai B" className="w-full px-2 py-1 border border-white/10 rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-slate-200" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => { const arr = [...(content.benefits?.comparison?.rows || []), { label: "", value_a: "✓", value_b: "✗" }]; updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary/80 hover:text-primary cursor-pointer"><Plus className="w-3 h-3" /> Tambah Baris</button>
          </CollapsibleGroup>
        </div>
      )}

      {/* FAQ FORM */}
      {activeTab === "faq" && content?.faq && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Judul Section {needsAttention("faq.title") && <span className="text-amber-300">⚠️</span>}</span>
              {renderFieldActions("faq", "title")}
            </label>
            <input 
              type="text" 
              value={content.faq.title || ""} 
              onChange={(e) => updateField("faq", "title", e.target.value)} 
              className={fieldClass("faq.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60")} 
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
                className={fieldClass(`faq.items.${idx}.question`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-primary/60")} 
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
                className={fieldClass(`faq.items.${idx}.answer`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-primary/60 resize-none")} 
              />
              <input 
                type="text" 
                value={item.category || ""} 
                onChange={(e) => { 
                  const n = [...content.faq.items]; 
                  n[idx] = { ...n[idx], category: e.target.value }; 
                  updateField("faq", "items", n); 
                }} 
                placeholder="Kategori (opsional, untuk variant sidebar-category)" 
                className="w-full px-2 py-1 border border-white/10 rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-slate-200" 
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
                onGenerate={() => handleAiText("cta", "headline", "Buat headline CTA yang kuat, action-oriented, dan menutup keraguan pembeli", "Headline CTA")}
                title="AI: generate headline"
                onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
              />
            </label>
            <input 
              id="field-cta.headline"
              type="text" 
              value={content.cta.headline || ""} 
              onChange={(e) => updateField("cta", "headline", e.target.value)} 
              className={fieldClass("cta.headline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Eyebrow <span className="text-slate-600 font-normal normal-case">(opsional)</span></label>
            <input
              type="text"
              value={content.cta?.eyebrow || ""}
              onChange={(e) => updateField("cta", "eyebrow", e.target.value)}
              placeholder="cth. Mulai Sekarang"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Subheadline <span className="text-slate-600 font-normal normal-case">(opsional)</span></label>
            <input
              type="text"
              value={content.cta?.subheadline || ""}
              onChange={(e) => updateField("cta", "subheadline", e.target.value)}
              placeholder="cth. Dapatkan penawaran spesial sebelum kehabisan!"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Trust Signal <span className="text-slate-600 font-normal normal-case">(opsional)</span></label>
            <input
              type="text"
              value={content.cta?.trust_signal || ""}
              onChange={(e) => updateField("cta", "trust_signal", e.target.value)}
              placeholder="cth. ✅ Lebih dari 500 pelanggan puas"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Gambar CTA <span className="text-slate-600 font-normal normal-case">(opsional, untuk variant split-image)</span></label>
            <FileUpload label="" value={content.cta?.image_url || ""} onChange={(val) => updateField("cta", "image_url", val)} placeholder="https://..." maxWidth={800} maxHeight={800} quality={0.85} />
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
              className={fieldClass("cta.button_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
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
                        ? "bg-primary text-primary-foreground"
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
              className={fieldClass("contact.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
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
              className={fieldClass("contact.address", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Nomor WhatsApp <span className="text-slate-600 normal-case font-normal">(opsional)</span> {needsAttention("contact.phone") && <span className="text-amber-300">⚠️</span>}
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
              className={fieldClass("contact.phone", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
            />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Jika kosong, pesanan dari keranjang masuk ke <strong className="text-slate-400">Kotak Masuk Pesan</strong> di dashboard.
            </p>
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
              className={fieldClass("contact.email", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
            <span className="text-[12px] font-medium text-slate-200">Formulir Kontak</span>
            <input 
              type="checkbox" 
              checked={content.contact.show_lead_form !== false} 
              onChange={(e) => updateField("contact", "show_lead_form", e.target.checked)} 
              className="w-4 h-4 accent-primary cursor-pointer" 
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
            <span className="text-[12px] font-medium text-slate-200">Peta Lokasi</span>
            <input 
              type="checkbox" 
              checked={content.contact.show_map !== false} 
              onChange={(e) => updateField("contact", "show_map", e.target.checked)} 
              className="w-4 h-4 accent-primary cursor-pointer" 
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
            <span className="text-[12px] font-medium text-slate-200">Gaya Peta</span>
            <div className="flex gap-1">
              {getEnabledMapTiles(ALL_MAP_TILES.map(o => o.key)).map((key) => {
                const opt = ALL_MAP_TILES.find(o => o.key === key)!;
                return (
                <button
                  key={opt.key}
                  onClick={() => updateField("contact", "map_tile_style", opt.key)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    (content.contact.map_tile_style || "default") === opt.key
                      ? "bg-primary/20 text-primary"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Link Google Maps <span className="text-slate-600 normal-case font-normal">(opsional)</span>
            </label>
            <div className="flex gap-2">
              <input
                id="field-contact.maps_url"
                type="url"
                value={content.contact.maps_url || ""}
                onChange={(e) => { updateField("contact", "maps_url", e.target.value); setResolveError(null); }}
                placeholder="https://www.google.com/maps/embed?pb=... atau share link Google Maps"
                className="flex-1 w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowLocationPicker(true)}
                className="shrink-0 px-3 py-1.5 rounded-md text-[12px] font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                title="Pilih lokasi di peta"
              >
                Pilih Lokasi
              </button>
            </div>

            {/* Form position layout selector */}
            <div className="space-y-1 pt-2">
              <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500">
                Tata Letak Form Kontak
              </label>
              <div className="flex flex-wrap gap-1">
                {([
                  { value: "right", label: "Info kiri, form kanan" },
                  { value: "left", label: "Form kiri, info kanan" },
                  { value: "stack", label: "Vertikal (form di bawah)" },
                ] as const).map((opt) => {
                  const active = (content.contact.form_position || "right") === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField("contact", "form_position", opt.value)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "border border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                "Info kiri, form kanan" cocok untuk hero dengan ruang luas. "Vertikal" cocok untuk mobile. Khusus template Natural biasanya default vertikal.
              </p>
            </div>
            <div className="flex gap-2 mt-1.5">
              <button
                type="button"
                onClick={async () => {
                  const url = content.contact.maps_url?.trim();
                  if (!url || !/goo\.gl|maps\.app\.goo/.test(url)) return;
                  setResolvingMaps(true);
                  try {
                    const res = await request<{ embed_url: string; final_url: string; google_maps_url: string }>(
                      `/ai/public/resolve-maps-url?url=${encodeURIComponent(url)}`,
                      undefined,
                      token ?? undefined
                    );
                    if (res.data?.google_maps_url) {
                      updateField("contact", "maps_url", res.data.google_maps_url);
                    }
                  } catch {
                    setResolveError("Gagal meresolve link. Coba salin link embed manual.");
                  } finally {
                    setResolvingMaps(false);
                  }
                }}
                disabled={resolvingMaps || !/goo\.gl|maps\.app\.goo/.test(content.contact.maps_url || "")}
                className="shrink-0 px-3 py-1.5 rounded-md text-[12px] font-medium border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {resolvingMaps ? "..." : "Resolve"}
              </button>
            </div>
            {content.contact.maps_url && !/\/maps\/embed\?pb=|openstreetmap\.org\/export/.test(content.contact.maps_url) && !/@?(-?\d+\.\d+),(-?\d+\.\d+)/.test(content.contact.maps_url) && (
              <p className="text-[10px] text-amber-400 leading-relaxed">
                Link ini tidak bisa ditampilkan sebagai peta interaktif. Klik "Pilih Lokasi" atau gunakan link embed Google Maps.
              </p>
            )}
            {resolveError && (
              <p className="text-[10px] text-red-400 leading-relaxed">{resolveError}</p>
            )}
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Klik "Pilih Lokasi" untuk menandai lokasi di peta, atau tempel link embed / share Google Maps.
            </p>

            <LocationPicker
              open={showLocationPicker}
              onClose={() => setShowLocationPicker(false)}
              currentUrl={content.contact.maps_url}
              onSave={(url) => updateField("contact", "maps_url", url)}
            />
          </div>
        </div>
      )}

      {/* FOOTER FORM */}
      {activeTab === "footer" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Tagline</label>
            <input 
              id="field-footer.tagline"
              type="text" 
              value={content.footer?.tagline || ""} 
              onChange={(e) => updateField("footer", "tagline", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Copyright</label>
            <input 
              id="field-footer.copyright_text"
              type="text" 
              value={content.footer?.copyright_text || ""} 
              onChange={(e) => updateField("footer", "copyright_text", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Media Sosial</label>
            {(content.footer?.social_links || []).map((link: any, idx: number) => {
              const isCustom = link.platform && !SOCIAL_PLATFORMS[link.platform];
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 w-8 justify-center">
                    {link.platform && SOCIAL_PLATFORMS[link.platform] ? (
                      <SocialIcon platform={link.platform} className="shrink-0" size={18} />
                    ) : (
                      <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-1.5">
                    {isCustom ? (
                      <input
                        type="text"
                        value={link.platform || ""}
                        onChange={(e) => {
                          const n = [...(content.footer?.social_links || [])];
                          n[idx] = { ...n[idx], platform: e.target.value };
                          updateField("footer", "social_links", n);
                        }}
                        placeholder="Nama platform"
                        className="w-1/3 px-2 py-1.5 border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent"
                      />
                    ) : (
                      <SocialPlatformSelect
                        value={link.platform || ""}
                        onChange={(v) => {
                          const n = [...(content.footer?.social_links || [])];
                          n[idx] = { ...n[idx], platform: v === "__custom__" ? "" : v };
                          updateField("footer", "social_links", n);
                        }}
                        className="w-1/3 px-2 py-1.5 border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent"
                      />
                    )}
                    <input
                      type="text"
                      value={link.url || ""}
                      onChange={(e) => {
                        const n = [...(content.footer?.social_links || [])];
                        n[idx] = { ...n[idx], url: e.target.value };
                        updateField("footer", "social_links", n);
                      }}
                      placeholder="URL (e.g. https://instagram.com/...)"
                      className="flex-1 px-2 py-1.5 border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const n = content.footer?.social_links?.filter((_: any, i: number) => i !== idx) || [];
                      updateField("footer", "social_links", n);
                    }}
                    className="text-red-400 hover:text-red-300 text-xs shrink-0"
                  >
                    Hapus
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                const n = [...(content.footer?.social_links || []), { platform: "", url: "" }];
                updateField("footer", "social_links", n);
              }}
              className="w-full text-center py-1.5 text-[11px] font-semibold text-primary border border-dashed border-white/20 rounded-md hover:border-primary/60 transition-colors"
            >
              + Tambah Media Sosial
            </button>
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

          {/* Meta Title + Char Count */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Meta Title {needsAttention("seo.title") && <span className="text-amber-300">⚠️</span>}
              </span>
              {isPremium && (
                <AiFieldButton
                  loading={aiLoadingField === "seo.title"}
                  onGenerate={() => handleAiText("seo", "title", "Buat SEO title yang mengandung nama bisnis, lokasi, dan layanan utama. Maks 60 karakter.", "Meta Title")}
                  title="AI: generate SEO title"
                  onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
                />
              )}
            </label>
            <input 
              id="field-seo.title"
              type="text" 
              value={content.seo?.title || ""} 
              onChange={(e) => updateField("seo", "title", e.target.value)} 
              className={fieldClass("seo.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")} 
            />
            <div className="flex justify-end">
              <span className={`text-[10px] font-mono ${(content.seo?.title?.length || 0) > 60 ? "text-red-500" : "text-slate-500"}`}>
                {(content.seo?.title?.length || 0)}/60
              </span>
            </div>
          </div>

          {/* Meta Description + Char Count */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Meta Description {needsAttention("seo.description") && <span className="text-amber-300">⚠️</span>}
              </span>
              {isPremium && (
                <AiFieldButton
                  loading={aiLoadingField === "seo.description"}
                  onGenerate={() => handleAiText("seo", "description", "Buat meta description yang menarik klik di Google. Maks 155 karakter, sertakan nama bisnis dan value proposition.", "Meta Description")}
                  title="AI: generate meta description"
                  onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
                />
              )}
            </label>
            <textarea 
              id="field-seo.description"
              rows={3} 
              value={content.seo?.description || ""} 
              onChange={(e) => updateField("seo", "description", e.target.value)} 
              className={fieldClass("seo.description", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 resize-none bg-transparent")} 
            />
            <div className="flex justify-end">
              <span className={`text-[10px] font-mono ${(content.seo?.description?.length || 0) > 155 ? "text-red-500" : "text-slate-500"}`}>
                {(content.seo?.description?.length || 0)}/155
              </span>
            </div>
          </div>

          {/* Keywords Tags */}
          <KeywordsInput
            keywords={content.seo?.keywords || []}
            onChange={(keywords) => updateField("seo", "keywords", keywords)}
            aiLoading={aiLoadingField === "seo.keywords"}
            onAiGenerate={isPremium ? () => handleAiText("seo", "keywords", "Generate 3-8 keyword SEO yang relevan untuk bisnis ini, fokus pada produk, layanan, dan lokasi.", "Keywords SEO") : undefined}
            onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
          />

          {/* Favicon + OG Image row */}
          <FileUpload label="Favicon" value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
          <FileUpload label="OG Image" value={content.seo?.og_image_url || ""} onChange={(val) => updateField("seo", "og_image_url", val)} placeholder="https://..." maxWidth={1200} maxHeight={630} quality={0.85} />

          {/* ── Social Share Preview ── */}
          {(() => {
            const ogTitle = content.seo?.title || "";
            const ogDesc  = content.seo?.description || "";
            const ogImg   = content.seo?.og_image_url || "";
            const ogDomain = subdomain ? `${subdomain}.webjoz.com` : "namabisnis.webjoz.com";
            return (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Preview Saat Link Dibagikan</p>

                {/* WhatsApp / iMessage style */}
                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1a1d26]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border-b border-white/5">
                    <span className="text-[10px] font-bold text-emerald-400">💬 WhatsApp / iMessage</span>
                  </div>
                  <div className="flex gap-0 overflow-hidden">
                    {/* image thumbnail */}
                    <div className="w-20 h-20 shrink-0 bg-[#111318] relative overflow-hidden">
                      {ogImg ? (
                        <img src={ogImg} alt="OG" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[18px] opacity-20">🖼️</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 px-3 py-2 space-y-0.5 min-w-0">
                      <p className="text-[10px] text-slate-500 truncate">{ogDomain}</p>
                      <p className={`text-[12px] font-semibold leading-tight line-clamp-2 ${ogTitle ? "text-slate-100" : "text-slate-600 italic"}`}>
                        {ogTitle || "Judul belum diisi"}
                      </p>
                      <p className={`text-[10px] leading-tight line-clamp-2 ${ogDesc ? "text-slate-400" : "text-slate-600 italic"}`}>
                        {ogDesc || "Deskripsi belum diisi"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Facebook style */}
                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1a1d26]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border-b border-white/5">
                    <span className="text-[10px] font-bold text-blue-400">👍 Facebook / LinkedIn</span>
                  </div>
                  <div className="w-full aspect-[1.91/1] bg-[#111318] relative overflow-hidden">
                    {ogImg ? (
                      <img src={ogImg} alt="OG" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <span className="text-[28px] opacity-20">🖼️</span>
                        <p className="text-[10px] text-slate-600 italic">OG Image belum diatur (1200×630 px)</p>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2 space-y-0.5 bg-[#232630]">
                    <p className="text-[9px] uppercase tracking-widest text-slate-500">{ogDomain}</p>
                    <p className={`text-[12px] font-bold leading-snug line-clamp-2 ${ogTitle ? "text-slate-100" : "text-slate-600 italic"}`}>
                      {ogTitle || "Judul belum diisi"}
                    </p>
                    <p className={`text-[10px] leading-snug line-clamp-2 ${ogDesc ? "text-slate-400" : "text-slate-600 italic"}`}>
                      {ogDesc || "Deskripsi belum diisi"}
                    </p>
                  </div>
                </div>

                {/* Twitter/X style */}
                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1a1d26]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border-b border-white/5">
                    <span className="text-[10px] font-bold text-slate-300">𝕏 Twitter / X</span>
                  </div>
                  <div className="relative">
                    <div className="w-full aspect-[2/1] bg-[#111318] relative overflow-hidden">
                      {ogImg ? (
                        <img src={ogImg} alt="OG" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[28px] opacity-20">🖼️</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-black/60 backdrop-blur-sm">
                      <p className={`text-[11px] font-semibold leading-tight truncate ${ogTitle ? "text-white" : "text-slate-500 italic"}`}>
                        {ogTitle || "Judul belum diisi"}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">{ogDomain}</p>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-600 text-center">Preview otomatis diperbarui saat Anda mengisi Meta Title, Deskripsi, &amp; OG Image.</p>
              </div>
            );
          })()}

          {/* OG Type Dropdown */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>OG Type</span>
              <AiFieldButton
                loading={aiLoadingField === "seo.og_type"}
                onGenerate={() => handleAiText("seo", "og_type", "Pilih og_type yang paling sesuai: website, article, product, profile.", "OG Type")}
                title="AI: suggest OG type"
                onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
              />
            </label>
            <select
              value={content.seo?.og_type || "website"}
              onChange={(e) => updateField("seo", "og_type", e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200"
            >
              <option value="website">Website</option>
              <option value="article">Article</option>
              <option value="product">Product</option>
              <option value="profile">Profile</option>
              <option value="business.business">Business</option>
            </select>
          </div>

          {/* Twitter Card Dropdown */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Twitter Card</span>
              <AiFieldButton
                loading={aiLoadingField === "seo.twitter_card"}
                onGenerate={() => handleAiText("seo", "twitter_card", "Pilih Twitter card: summary_large_image untuk kebanyakan bisnis.", "Twitter Card")}
                title="AI: suggest Twitter card"
                onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
              />
            </label>
            <select
              value={content.seo?.twitter_card || "summary_large_image"}
              onChange={(e) => updateField("seo", "twitter_card", e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200"
            >
              <option value="summary_large_image">summary_large_image</option>
              <option value="summary">summary</option>
              <option value="app">app</option>
              <option value="player">player</option>
            </select>
          </div>

          {/* Robots Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Robots</label>
            <select
              value={content.seo?.robots || "index, follow"}
              onChange={(e) => updateField("seo", "robots", e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200"
            >
              <option value="index, follow">index, follow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </div>

          {/* OG Locale */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">OG Locale</label>
            <input
              type="text"
              value={content.seo?.og_locale || "id_ID"}
              onChange={(e) => updateField("seo", "og_locale", e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent"
              placeholder="id_ID"
            />
          </div>

          {/* OG Site Name */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">OG Site Name</label>
            <input
              type="text"
              value={content.seo?.og_site_name || ""}
              onChange={(e) => updateField("seo", "og_site_name", e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent"
              placeholder="Nama bisnis"
            />
          </div>

          {/* Canonical Path */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Canonical Path</label>
            <input
              type="text"
              value={content.seo?.canonical_path || "/"}
              onChange={(e) => updateField("seo", "canonical_path", e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200"
              placeholder="/"
            />
          </div>

          {/* Custom Robots.txt (Pro) */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                Custom Robots.txt
                {!isPremium && <span className="text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/30">Pro</span>}
              </span>
            </label>
            {isPremium ? (
              <textarea
                rows={5}
                value={content.seo?.custom_robots_txt || ""}
                onChange={(e) => updateField("seo", "custom_robots_txt", e.target.value)}
                className="w-full px-2.5 py-1.5 border rounded-md text-[11px] font-mono outline-none focus:border-primary/60 bg-transparent text-slate-200 resize-none"
                placeholder={"User-agent: *\nAllow: /\n\nSitemap: https://namabisnis.webjoz.com/sitemap.xml"}
              />
            ) : (
              <div
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-3 text-[11px] text-slate-500 cursor-pointer hover:border-amber-500/30 transition-colors"
                onClick={() => onUpgradeRequired?.()}
              >
                <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                  <Lock className="w-3 h-3" />
                  Kustomisasi robots.txt untuk situs Anda
                </div>
                <p>Kontrol halaman mana yang di-index Google, blok AI crawler, dan atur sitemap rules.</p>
              </div>
            )}
          </div>

          {/* ── SEO Booster Upsell Card ── */}
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
            const siteTitle = content.seo?.title || "Nama Bisnis — Layanan";
            const siteDesc = content.seo?.description || "Deskripsi singkat bisnis dan layanan yang ditawarkan.";
            const siteName = siteTitle.split(/[-—|]/)[0].trim() || content.header?.brand_name || "Nama Bisnis";
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
      )}

      {/* TESTIMONIALS FORM */}
      {activeTab === "testimonials" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Eyebrow <span className="text-slate-600 font-normal normal-case">(opsional)</span></span>
              {renderFieldActions("testimonials", "eyebrow")}
            </label>
            <input
              type="text"
              value={content.testimonials?.eyebrow || ""}
              onChange={(e) => updateField("testimonials", "eyebrow", e.target.value)}
              placeholder="cth. Testimoni"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Judul Section</span>
              {renderFieldActions("testimonials", "title")}
            </label>
            <input
              type="text"
              value={content.testimonials?.title || ""}
              onChange={(e) => updateField("testimonials", "title", e.target.value)}
              placeholder="cth. Cerita dari Pelanggan Kami"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Subtitle <span className="text-slate-600 font-normal normal-case">(opsional)</span></span>
              {renderFieldActions("testimonials", "subtitle")}
            </label>
            <input
              type="text"
              value={content.testimonials?.subtitle || ""}
              onChange={(e) => updateField("testimonials", "subtitle", e.target.value)}
              placeholder="cth. Ulasan dari pelanggan setia kami"
              className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-300 placeholder-slate-600"
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
                  className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600 resize-none"
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
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
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
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
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
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600 uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Warna Avatar</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-md border border-white/15 overflow-hidden flex-shrink-0">
                      <input
                        type="color"
                        value={item.avatar_color || "var(--primary)"}
                        onChange={(e) => {
                          const n = [...content.testimonials.items];
                          n[idx] = { ...n[idx], avatar_color: e.target.value };
                          updateField("testimonials", "items", n);
                        }}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div className="w-full h-full" style={{ backgroundColor: item.avatar_color || "var(--primary)" }} />
                    </div>
                    <input
                      type="text"
                      value={item.avatar_color || ""}
                      onChange={(e) => {
                        const n = [...content.testimonials.items];
                        n[idx] = { ...n[idx], avatar_color: e.target.value };
                        updateField("testimonials", "items", n);
                      }}
                      placeholder="var(--primary)"
                      className="flex-1 px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
                    />
                  </div>
                </div>
              </div>
              {/* Company + Logo URL */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Perusahaan <span className="text-slate-600 font-normal normal-case">(opsional)</span></label>
                  <input
                    type="text"
                    value={item.company || ""}
                    onChange={(e) => {
                      const n = [...content.testimonials.items];
                      n[idx] = { ...n[idx], company: e.target.value };
                      updateField("testimonials", "items", n);
                    }}
                    placeholder="cth. PT Maju Jaya"
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Logo URL <span className="text-slate-600 font-normal normal-case">(opsional, untuk variant logo-wall)</span></label>
                  <input
                    type="text"
                    value={item.logo_url || ""}
                    onChange={(e) => {
                      const n = [...content.testimonials.items];
                      n[idx] = { ...n[idx], logo_url: e.target.value };
                      updateField("testimonials", "items", n);
                    }}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
                  />
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
                { quote: "", name: "", role: "", avatar_initials: "", avatar_color: "var(--primary)", company: "", logo_url: "" }
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
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary mb-1">
            <p className="font-semibold text-primary">📋 Section Menu</p>
            <p className="mt-1 text-primary/80">
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
            onAiDescription={handleAiItemDescription}
            aiLoadingDesc={aiLoadingDesc}
            onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
            fieldUndoStacks={fieldUndoStacks}
            undoField={undoField}
          />
        </>
      )}

      {/* GALLERY FORM */}
      {activeTab === "gallery" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary mb-1">
            <p className="font-semibold text-primary">📸 Section Galeri Foto</p>
            <p className="mt-1 text-primary/80">
              Tambahkan foto-foto untuk galeri. Atur tata letak, caption, dan teks alternatif.
            </p>
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Judul Galeri {needsAttention("gallery.title") && <span className="text-amber-300">⚠️</span>}</span>
              {renderFieldActions("gallery", "title")}
            </label>
            <input
              id="field-gallery.title"
              type="text" value={content.gallery?.title || ""}
              onChange={(e) => updateField("gallery", "title", e.target.value)}
              className={fieldClass("gallery.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent")}
              placeholder="Galeri Kami"
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              <span>Eyebrow</span>
              {renderFieldActions("gallery", "eyebrow")}
            </label>
            <input
              id="field-gallery.eyebrow"
              type="text" value={content.gallery?.eyebrow || ""}
              onChange={(e) => updateField("gallery", "eyebrow", e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent"
              placeholder="DOKUMENTASI"
            />
          </div>

          {/* Layout Picker */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Tata Letak</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "grid", label: "Grid", desc: "Kotak seragam" },
                { value: "masonry", label: "Masonry", desc: "Tinggi bervariasi" },
                { value: "carousel", label: "Carousel", desc: "Slide bergilir" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("gallery", "layout", opt.value)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    (content.gallery?.layout || "grid") === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <div className="text-[11px] font-semibold">{opt.label}</div>
                  <div className="text-[9px] opacity-60">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Carousel config (only when carousel selected) */}
          {(content.gallery?.layout || "grid") === "carousel" && (
            <div className="space-y-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pengaturan Carousel</span>
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Kecepatan Putar (ms)</label>
                <input
                  type="number" min={1000} max={15000} step={500}
                  value={content.gallery?.autoplay_speed ?? 4000}
                  onChange={(e) => updateField("gallery", "autoplay_speed", parseInt(e.target.value) || 4000)}
                  className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.gallery?.show_dots ?? true}
                  onChange={(e) => updateField("gallery", "show_dots", e.target.checked)}
                  className="rounded border-white/20"
                />
                <span className="text-[11px] font-medium text-slate-400">Tampilkan indikator titik</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.gallery?.show_arrows ?? true}
                  onChange={(e) => updateField("gallery", "show_arrows", e.target.checked)}
                  className="rounded border-white/20"
                />
                <span className="text-[11px] font-medium text-slate-400">Tampilkan tombol navigasi</span>
              </label>
            </div>
          )}

          {/* Gallery Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Foto ({content.gallery?.items?.length || 0})</span>
              <button
                type="button"
                onClick={() => {
                  const next = [...(content.gallery?.items || []), { image_url: "", caption: "", alt_text: "" }];
                  updateField("gallery", "items", next);
                }}
                className="text-[12px] py-1.5 px-3 border border-dashed border-white/10 rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Foto
              </button>
            </div>
            {(content.gallery?.items || []).map((item: any, idx: number) => (
              <div key={idx} className="mb-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Foto #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (content.gallery?.items || []).filter((_: any, i: number) => i !== idx);
                      updateField("gallery", "items", next);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">URL Gambar</label>
                  <div className="flex gap-2">
                    <input
                      id={`field-gallery.items.${idx}.image_url`}
                      type="text" value={item.image_url || ""}
                      onChange={(e) => {
                        const next = [...(content.gallery?.items || [])];
                        next[idx] = { ...next[idx], image_url: e.target.value };
                        updateField("gallery", "items", next);
                      }}
                      className="flex-1 px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent font-mono"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  {item.image_url && (
                    <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Caption</label>
                  <input
                    type="text" value={item.caption || ""}
                    onChange={(e) => {
                      const next = [...(content.gallery?.items || [])];
                      next[idx] = { ...next[idx], caption: e.target.value };
                      updateField("gallery", "items", next);
                    }}
                    className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent"
                    placeholder="Suasana nyaman di dalam"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Teks Alt</label>
                  <input
                    type="text" value={item.alt_text || ""}
                    onChange={(e) => {
                      const next = [...(content.gallery?.items || [])];
                      next[idx] = { ...next[idx], alt_text: e.target.value };
                      updateField("gallery", "items", next);
                    }}
                    className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent"
                    placeholder="Deskripsi singkat gambar"
                  />
                </div>
              </div>
            ))}
            {(!content.gallery?.items || content.gallery.items.length === 0) && (
              <button
                type="button"
                onClick={() => updateField("gallery", "items", [{ image_url: "", caption: "", alt_text: "" }])}
                className="w-full text-[12px] py-2 border border-dashed border-white/10 rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Foto Pertama
              </button>
            )}
          </div>
        </div>
      )}

      {/* CATALOG FORM */}
      {activeTab === "catalog" && (
        <>
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary mb-1">
            <p className="font-semibold text-primary">🛍️ Section Katalog Produk</p>
            <p className="mt-1 text-primary/80">
              Tambah kategori dan produk di sini. Setiap produk bisa dilengkapi foto, nama, deskripsi, harga, dan badge (cth: Best Seller, Baru, Promo — item dengan badge otomatis dijadikan unggulan di tampilan showcase).
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
            onAiDescription={handleAiItemDescription}
            aiLoadingDesc={aiLoadingDesc}
            onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
            fieldUndoStacks={fieldUndoStacks}
            undoField={undoField}
          />
        </>
      )}

      {/* ── FLOATING BUTTON FORM ── */}
      {activeTab === "floating" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
            <p className="font-semibold text-primary">💬 Tombol Aksi Mengambang</p>
            <p className="mt-1 text-primary/80">Tombol yang selalu terlihat di pojok kanan bawah halaman website.</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tipe Tombol</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "none",         label: "Tidak Ada",   icon: "🚫", desc: "Tidak tampil tombol" },
                { value: "whatsapp",     label: "WhatsApp",    icon: "💬", desc: "Tombol WA sederhana" },
                { value: "chat_bubble",  label: "Chat Bubble", icon: "✨",    desc: "Widget chat interaktif" },
                { value: "contact_link", label: "Link Kontak", icon: "📋", desc: "Scroll ke section Kontak" },
              ] as const).map((opt) => {
                const current = designToken?.layout?.floating_button ?? "whatsapp";
                const isActive = current === opt.value;
                const isProGated = opt.value === "chat_bubble" && !isPremium;
                return (
                  <button key={opt.value} type="button"
                    onClick={() => {
                      if (isProGated) { onUpgradeRequired?.(); return; }
                      updateDesignTokenLayout?.("floating_button", opt.value);
                    }}
                    className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${isActive ? "border-primary bg-primary/15 ring-1 ring-primary" : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"} ${isProGated ? "opacity-60" : ""}`}
                  >
                    <span className="text-lg block mb-1">{opt.icon}</span>
                    <p className="text-[11px] font-bold text-slate-200 leading-tight">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{opt.desc}</p>
                    {opt.value === "chat_bubble" && <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">PRO</span>}
                    {isActive && <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_currentColor]" />}
                  </button>
                );
              })}
            </div>
            {!isPremium && (
              <p className="text-[10px] text-amber-400/80 leading-relaxed">✨ Chat Bubble tersedia untuk plan <strong className="text-amber-400">Pro</strong>.</p>
            )}
          </div>
          {(designToken?.layout?.floating_button === "whatsapp" || designToken?.layout?.floating_button === "chat_bubble" || !designToken?.layout?.floating_button) && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                Nomor WhatsApp <span className="text-red-400">*</span>
              </label>
              <input type="text" inputMode="tel" value={content?.contact?.phone || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField("contact", "phone", val);
                  const digits = val.replace(/\D/g, "");
                  if (digits) {
                    const fmt = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
                    if (/wa\.me|whatsapp\.com/i.test(content?.hero?.cta_url || "")) updateField("hero", "cta_url", `https://wa.me/${fmt}`);
                    if (/wa\.me|whatsapp\.com/i.test(content?.cta?.button_url || "")) updateField("cta", "button_url", `https://wa.me/${fmt}`);
                  }
                }}
                placeholder="cth. 628123456789 atau 08123456789"
                className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
              />
              {!content?.contact?.phone && <p className="text-[10px] text-red-400/80 mt-1">Nomor WA wajib diisi agar tombol berfungsi.</p>}
              <p className="text-[10px] text-slate-600">Nomor ini juga dipakai di tombol WA lain di seluruh halaman.</p>
            </div>
          )}
          {designToken?.layout?.floating_button !== "none" && (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[11px] text-slate-400 leading-relaxed">
              {(designToken?.layout?.floating_button === "whatsapp" || !designToken?.layout?.floating_button) && "Tombol hijau WhatsApp tampil di pojok kanan bawah. Klik langsung membuka WA."}
              {designToken?.layout?.floating_button === "chat_bubble" && (isPremium ? "Widget chat WA interaktif. Pengunjung bisa ketik pesan sebelum diarahkan ke WA." : "Aktifkan plan Pro untuk Chat Bubble.")}
              {designToken?.layout?.floating_button === "contact_link" && "Tombol scroll ke section Kontak. Tidak membutuhkan nomor WA."}
            </div>
          )}
        </div>
      )}

      {/* ── AI Prompt Modal ── */}
      {fieldPromptModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => { fieldPromptModal.resolve(null); setFieldPromptModal(null); }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111318] shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <SparkleGenAI className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-slate-100 leading-tight">
                  Instruksi AI — {fieldPromptModal.label}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tambahkan instruksi khusus atau langsung klik Generate.
                </p>
              </div>
            </div>

            {/* Text input */}
            <input
              autoFocus
              type="text"
              value={fieldPromptInput}
              onChange={(e) => setFieldPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { fieldPromptModal.resolve(fieldPromptInput.trim()); setFieldPromptModal(null); }
                if (e.key === "Escape") { fieldPromptModal.resolve(null); setFieldPromptModal(null); }
              }}
              placeholder='cth. "buat lebih kasual dan ramah"'
              className="w-full px-4 py-3 border border-white/10 bg-[#05070b] text-slate-100 rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 placeholder:text-slate-600 transition-all"
            />

            {/* Image chip — shown only when item has a photo */}
            {fieldPromptModal.imageUrl && (
              <button
                type="button"
                onClick={() => setFieldPromptInput("Tulis deskripsi berdasarkan foto produk ini")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/30 bg-primary/10 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer text-left"
              >
                <span className="text-base leading-none">📸</span>
                <span>Tulis deskripsi dari foto produk</span>
                <span className="ml-auto shrink-0 w-10 h-6 rounded overflow-hidden border border-white/10">
                  <img src={fieldPromptModal.imageUrl} alt="" className="w-full h-full object-cover" />
                </span>
              </button>
            )}

            {/* Quick suggestions */}
            {(AI_SUGGESTIONS[fieldPromptModal.section as keyof typeof AI_SUGGESTIONS] ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(AI_SUGGESTIONS[fieldPromptModal.section as keyof typeof AI_SUGGESTIONS] ?? []).slice(0, 3).map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setFieldPromptInput(chip)}
                    className="px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { fieldPromptModal.resolve(null); setFieldPromptModal(null); }}
                className="flex-1 h-10 rounded-xl border border-white/10 text-[13px] font-semibold text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => { fieldPromptModal.resolve(fieldPromptInput.trim()); setFieldPromptModal(null); }}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <SparkleGenAI className="h-4 w-4" />
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
