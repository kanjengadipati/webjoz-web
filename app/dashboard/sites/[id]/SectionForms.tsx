import React, { useState } from "react";
import { SidebarField, setSidebarAiRewrite } from "@/components/sidebar-field";
import { AiFieldButton, EMOJI_GROUPS, MCF_INPUT_BASE as inputBase_mcf, MCF_INPUT_LABEL as inputLabel_mcf, normStr, MenuCatalogForm } from "@/components/menu-catalog-form";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, RefreshCw, Loader2, Star, Zap, Shield, Award, Heart, CheckCircle, Clock, Globe, Users, TrendingUp, Leaf, Flame, Lightbulb, Target, Truck, ThumbsUp, Lock, Phone, Mail, MapPin, Camera, Utensils, Coffee, ShoppingBag, Wrench, Stethoscope, BookOpen, Home, Building2, Briefcase, Search, Check, RotateCcw, BarChart2, Eye, EyeOff, X, CreditCard } from "lucide-react";
import { SparkleIcon, SparkleGenAI } from "@/components/sparkle-icon";
import FileUpload from "@/components/file-upload";
import { SIDEBAR_FIELD_CLASS, SIDEBAR_FIELD_CLASS_ICON } from "@/lib/editor-field-class";
import LocationPicker from "@/components/location-picker";
import LocationMapPreview from "@/components/location-map-preview";
import { GoogleSnippetPreview } from "@/components/google-snippet-preview";
import { isPlaceholderValue, getAiSuggestions } from "./editor-utils";
import { getHeroStyle, getHeroImageNeed, getHeroMinImages } from "@/components/sections/hero/meta";
import { setHeroSlide, removeHeroSlide, addHeroSlide, countDistinctHeroImages, writeHeroPatch, setPrimaryHeroImage, setHeroCaption, toggleHeroSlideHidden, moveHeroSlide } from "@/components/sections/hero/images";
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { request } from "@/lib/api/client";
import { tenantHost } from "@/lib/site-config";
import { getEnabledMapTiles } from "@/lib/design-assets-config";
import { SocialPlatformSelect, SOCIAL_PLATFORMS, SocialIcon } from "@/components/sections/social-platforms";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";
import { PAYMENT_METHOD_ORDER, paymentBlockTitle, paymentMethodDefaultLabel, paymentMethodDetailPlaceholder, paymentMethodImageField, paymentMethodTypeLabel } from "@/lib/payment-methods";
import { Switch, CustomSelect, SiteLoadingScreen, resolvePreloaderConfig } from "webjoz-ui";

const ALL_MAP_TILES = [
  { key: "default", label: "OSM" },
  { key: "cyclosm", label: "CyclOSM" },
  { key: "light", label: "Terang" },
  { key: "dark", label: "Gelap" },
  { key: "esri", label: "Esri" },
  { key: "satelit", label: "Satelit" },
];

const MAP_TILE_I18N_KEYS: Record<string, string> = {
  light: "dashboard.sitesEditor.mapTileLight",
  dark: "dashboard.sitesEditor.mapTileDark",
  satelit: "dashboard.sitesEditor.mapTileSatellite",
};

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
  language?: string;
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
        className="flex items-center gap-2 px-2 py-1.5 border border-border rounded text-[11px] text-sidebar-foreground hover:bg-sidebar-muted transition-all w-full"
      >
        <SelectedIcon className="w-4 h-4 text-primary shrink-0" />
        <span className="flex-1 text-left truncate">{value || "Pilih icon"}</span>
        <ChevronDown className="w-3 h-3 text-sidebar-subtle-foreground shrink-0" />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[#1a1d26] border border-border rounded-lg p-2 shadow-xl">
          <div className="grid grid-cols-6 gap-1">
            {ICON_OPTIONS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setOpen(false); }}
                className={`flex items-center justify-center p-2 rounded transition-all hover:bg-primary/20 ${value === name ? "bg-primary/30 ring-1 ring-primary" : ""}`}
              >
                <Icon className={`w-4 h-4 ${value === name ? "text-primary" : "text-sidebar-muted-foreground"}`} />
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
    <div className="border border-border rounded-md bg-muted/30">
      <button type="button" onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full px-3 py-2 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground cursor-pointer">
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
  const { t } = useI18n();
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
      <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
        <span>{t("dashboard.sitesEditor.seoKeywordsLabel")}</span>
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
          placeholder={keywords.length === 0 ? t("dashboard.sitesEditor.seoKeywordsPlaceholderEmpty") : t("dashboard.sitesEditor.seoKeywordsPlaceholderMore")}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-[12px] text-sidebar-foreground placeholder-sidebar-subtle-foreground"
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
  const { t } = useI18n();
  const pool = getUnsplashPool(businessType);
  const handleClick = () => {
    const randomUrl = pool[Math.floor(Math.random() * pool.length)];
    onSelect(randomUrl);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      title={t("dashboard.sitesEditor.unsplashRandomPhoto")}
      className="flex items-center gap-1 px-2 h-7 rounded-md bg-sidebar-muted text-sidebar-foreground hover:bg-sidebar-border hover:text-sidebar-foreground text-[10px] font-semibold transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400 border border-border"
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
  suggestedHash?: string;
}

function LinkTypeInput({
  urlValue,
  updateUrl,
  needsAttention,
  fieldClass,
  path,
  label,
  defaultWaNumber,
  suggestedHash,
}: LinkTypeInputProps) {
  const { t, locale } = useI18n();
  const isEN = locale === "en";
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
      updateUrl(suggestedHash || "#contact");
    }
  };

  const anchorPresets = [
    { label: isEN ? "Catalog" : "Katalog", hash: "#catalog" },
    { label: "Menu", hash: "#menu" },
    { label: isEN ? "Contact" : "Kontak", hash: "#contact" },
    { label: isEN ? "About" : "Tentang", hash: "#about" },
    { label: isEN ? "Services" : "Layanan", hash: "#services" },
  ];

  return (
    <div className="space-y-2 pt-2 border-t border-border/50 mt-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {isEN ? "Button Action Type" : "Tipe Aksi Tombol"}
        </label>
        <div className="flex p-0.5 rounded bg-muted/50 border border-border/50">
          <button
            type="button"
            onClick={() => handleTypeChange("whatsapp")}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition cursor-pointer ${
              linkType === "whatsapp"
                ? "bg-primary text-primary-foreground font-bold"
                : "text-sidebar-muted-foreground hover:text-sidebar-foreground"
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
                : "text-sidebar-muted-foreground hover:text-sidebar-foreground"
            }`}
          >
            {isEN ? "Custom Link" : "Link Kustom"}
          </button>
        </div>
      </div>

      {linkType === "whatsapp" ? (
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            {isEN ? "WhatsApp Number" : "Nomor WhatsApp"} {needsAttention && <span className="text-amber-300">⚠️</span>}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-xs text-sidebar-subtle-foreground font-semibold select-none">+</span>
            <input
              id={`field-${path}`}
              type="text"
              inputMode="tel"
              value={waInput}
              onChange={(e) => handleWaChange(e.target.value)}
              placeholder="628123456789"
              className={fieldClass(path, SIDEBAR_FIELD_CLASS_ICON)}

            />
          </div>
          <p className="text-[10px] text-sidebar-subtle-foreground leading-normal">
            {isEN
              ? "Enter phone number with country code (e.g. 628123456789 or +1...)."
              : "Masukkan nomor dengan kode negara (cth. 628123456789 atau 08123456789)."}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            {label} {needsAttention && <span className="text-amber-300">⚠️</span>}
          </label>
          <input
            id={`field-${path}`}
            type="text"
            value={urlValue}
            onChange={(e) => updateUrl(e.target.value)}
            className={fieldClass(path, SIDEBAR_FIELD_CLASS)}
            placeholder={isEN ? "#catalog, #contact, or https://..." : "#catalog, #contact, atau https://..."}
          />
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <span className="text-[10px] text-sidebar-subtle-foreground mr-0.5">
              {isEN ? "Quick anchors:" : "Pintasan section:"}
            </span>
            {anchorPresets.map((preset) => (
              <button
                key={preset.hash}
                type="button"
                onClick={() => updateUrl(preset.hash)}
                className={`px-1.5 py-0.5 text-[10px] rounded transition cursor-pointer ${
                  urlValue === preset.hash
                    ? "bg-primary/20 text-primary font-bold border border-primary/40 shadow-xs"
                    : "bg-muted/40 hover:bg-muted text-sidebar-muted-foreground hover:text-sidebar-foreground border border-border/40"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HeroSlideRow — sortable drag row untuk sidebar carousel ─────────────────
function HeroSlideRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-1.5 ${isDragging ? "opacity-60 z-10" : ""}`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={t("dashboard.sitesEditor.dragSection")}
        className="mt-3 p-1.5 -m-1.5 cursor-grab active:cursor-grabbing touch-none shrink-0 text-sidebar-subtle-foreground hover:text-sidebar-foreground transition-colors"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      {children}
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
  language,
  fieldUndoStacks,
  undoField,
}: SectionFormsProps) {
  const { pushToast } = useToast();
  const { t, locale } = useI18n();
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
            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-sidebar-muted text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground transition-all cursor-pointer focus:outline-none"
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
  const [testPreloaderKey, setTestPreloaderKey] = React.useState<number | null>(null);

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

  // Register global AI rewrite handler for SidebarField inputs
  React.useEffect(() => {
    if (!token || !activeTenantId || !siteId) {
      setSidebarAiRewrite(null);
      return;
    }

    setSidebarAiRewrite(async (section: string, fieldKey: string, currentValue: string) => {
      try {
        const currentVariant = designToken?.layout?.section_variants?.[section];
        const res = await request<any>(
          "/ai/regenerate-section",
          {
            method: "POST",
            body: JSON.stringify({
              site_id: siteId,
              section,
              instructions: `Fokus tulis ulang hanya untuk field "${fieldKey}" agar lebih menarik, alami, dan profesional. Teks saat ini: "${currentValue}". Pertahankan panjang kalimat yang proporsional dan makna bisnisnya. Jaga field lain tetap sama persis.`,
              tenant_id: activeTenantId,
              section_variant: currentVariant || "",
            }),
          },
          String(token)
        );

        if (res.status !== "success") {
          throw new Error(res.message || t("dashboard.sitesEditor.aiProcessFailed") || "AI gagal memproses.");
        }

        const updated = res.data?.section !== undefined ? res.data.section : res.data;
        if (!updated) {
          throw new Error("Tidak ada hasil dari AI.");
        }

        const keys = fieldKey.split(".");
        let result: any = updated;
        for (const k of keys) {
          if (result == null) break;
          result = result[k];
        }

        if (typeof result !== "string" || !result.trim()) {
          throw new Error("Field tidak ditemukan dalam hasil AI.");
        }

        onAiSuccess?.();
        return result;
      } catch (err: any) {
        if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") {
          onUpgradeRequired?.();
          throw new Error(t("dashboard.sitesEditor.upgradeRegenTitle") || "Batas AI tercapai. Silakan upgrade paket.");
        }
        throw err;
      }
    });

    return () => {
      setSidebarAiRewrite(null);
    };
  }, [token, activeTenantId, siteId, designToken, onAiSuccess, onUpgradeRequired, t]);

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
      pushToast?.(t("dashboard.sitesEditor.seoGscSaveSuccess"), "success");
      setTimeout(() => setGscSaved(false), 3000);
    } catch (err: any) {
      pushToast?.(err.message || t("dashboard.sitesEditor.seoGscSaveFailed"), "error");
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
  const heroStyle = getHeroStyle(designToken);
  const heroShowsImage = !heroStyle || !["tech-saas","booking-form","location-map"].includes(heroStyle);
  const heroNeedsImage = heroShowsImage;
  const heroIsVideo = heroStyle === "video-bg";
  const [heroImagesOpen, setHeroImagesOpen] = useState<boolean | null>(null);
  const [heroImageOpenIdx, setHeroImageOpenIdx] = useState<number | null>(null);

  // DnD sensors untuk hero slide reorder — harus di level komponen (Rules of Hooks)
  const heroSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const heroSlideId = (idx: number) => `hero-slide-${idx}`;

  /** Kalkulasi heroImageOpenIdx baru setelah slide dipindah dari `from` ke `to`. */
  const remapOpenIdx = (o: number | null, from: number, to: number): number | null => {
    if (o === null) return o;
    if (o === from) return to;
    if (from < to && o > from && o <= to) return o - 1;
    if (from > to && o >= to && o < from) return o + 1;
    return o;
  };
  // Optional hero fields are only relevant to a subset of variants.
  // When the selected variant is unknown, keep everything visible (safe fallback).
  const showIfVariant = (variants: string[]) =>
    !heroStyle || variants.includes(heroStyle);
  const HERO_EYEBROW_VARIANTS = ["arch-portrait","bento-grid","chronology-badge","floating-card","image-carousel","minimalist-elegant","neo-brutalist","personal-billboard","portrait-showcase","profile-cutout","proof-bar","split-editorial","tech-saas","video-bg","work-preview-strip","booking-form","location-map"];
  const HERO_OPENING_HOURS_VARIANTS = ["centered","minimal","split","carousel-split","full-bleed","image-carousel","natural-organic","proof-bar","video-bg","booking-form"];
  const HERO_BADGE_VARIANTS = ["arch-portrait","bento-grid","image-carousel","carousel-split","carousel-filmstrip","minimalist-elegant","neo-brutalist","profile-cutout","tech-saas"];
  const HERO_SECONDARY_VARIANTS = ["bento-grid","carousel-filmstrip","carousel-split","chronology-badge","full-bleed","image-carousel","minimalist-elegant","natural-organic","neo-brutalist","personal-billboard","portrait-showcase","profile-cutout","split-editorial","tech-saas","video-bg","work-preview-strip","booking-form"];
  const HERO_STATS_VARIANTS = ["bento-grid","chronology-badge","personal-billboard","portrait-showcase","proof-bar","split-editorial","work-preview-strip"];
  const HERO_IMAGES_ARRAY_VARIANTS = ["image-carousel","carousel-split","carousel-filmstrip","collage-mosaic"];
  const HERO_DASHBOARD_WIDGET_VARIANTS = ["tech-saas"];

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

  const renderPaymentShippingForm = () => {
    type PayMethod = { type?: string; label?: string; detail?: string; image?: string };
    const payments = content.payments ?? {};
    const methods: PayMethod[] = Array.isArray(payments.methods) ? payments.methods : [];
    const setMethods = (next: PayMethod[]) => updateField("payments", "methods", next);
    const updateMethod = (idx: number, key: string, val: string) => {
      const next = methods.map((m, i) => {
        if (i !== idx) return m;
        const updated = { ...m, [key]: val };
        if (key === "type" && !updated.label?.trim()) updated.label = paymentMethodDefaultLabel(t, val);
        return updated;
      });
      setMethods(next);
    };
    const renderMethodField = (method: PayMethod, idx: number) => {
      const img = paymentMethodImageField(t, method.type);
      if (img) {
        return (
          <FileUpload
            label={img.label}
            value={method.image ?? ""}
            onChange={(val) => updateMethod(idx, "image", val)}
            placeholder={img.placeholder}
            maxWidth={800}
            maxHeight={800}
            quality={0.85}
            previewSize="sm"
            objectFit="contain"
          />
        );
      }
      return (
        <input
          type="text"
          value={method.detail ?? ""}
          onChange={(e) => updateMethod(idx, "detail", e.target.value)}
          placeholder={paymentMethodDetailPlaceholder(t, method.type)}
          className="w-full px-2 py-1.5 border border-border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground placeholder-sidebar-subtle-foreground"
        />
      );
    };
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          <p className="font-semibold text-sidebar-foreground">
            {t("dashboard.sitesKatalog.paymentTitle", "Metode Pembayaran & Pengiriman")}
          </p>
          <p className="mt-1">
            {t("dashboard.sitesKatalog.paymentSubtitle", "Tampilkan info pembayaran dan pengiriman di keranjang pesanan pengunjung. Belum perlu integrasi payment gateway — cukup info rekening/QRIS statis.")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <div className="min-w-0 space-y-0.5">
            <p className="text-[11px] font-semibold text-sidebar-foreground">
              {t("dashboard.sitesKatalog.paymentsVisibleLabel", "Tampilkan blok pembayaran & pengiriman")}
            </p>
            <p className="text-[10.5px] leading-relaxed text-muted-foreground">
              {t("dashboard.sitesKatalog.paymentsVisibleHint", "Matikan untuk menyembunyikan info ini dari keranjang dan footer")}
            </p>
          </div>
          <Switch
            size="sm"
            checked={payments.show !== false}
            onCheckedChange={(checked) => updateField("payments", "show", checked)}
            className="shrink-0"
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            <CreditCard className="w-3 h-3" />
            {t("dashboard.sitesKatalog.paymentTitleLabel", "Judul Header")}
          </label>
          <input
            type="text"
            value={payments.title ?? paymentBlockTitle(t)}
            onChange={(e) => updateField("payments", "title", e.target.value)}
            className={SIDEBAR_FIELD_CLASS}
          />
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesKatalog.methodsTitle", "Metode Pembayaran")}
            </label>
          </div>
          {methods.map((method, idx) => (
            <div key={idx} className="rounded-md border border-border bg-muted/20 p-2 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <CustomSelect
                  value={method.type ?? "transfer"}
                  onChange={(val) => updateMethod(idx, "type", val)}
                  size="sm"
                  triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
                  options={PAYMENT_METHOD_ORDER.map((type) => ({
                    value: type,
                    label: paymentMethodTypeLabel(t, type),
                  }))}
                />
                <button
                  type="button"
                  onClick={() => setMethods(methods.filter((_, i) => i !== idx))}
                  className="p-1.5 rounded-md border border-border text-sidebar-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-colors shrink-0"
                  title={t("dashboard.sitesKatalog.methodRemove", "Hapus metode")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={method.label ?? ""}
                onChange={(e) => updateMethod(idx, "label", e.target.value)}
                placeholder={t("dashboard.sitesKatalog.methodLabelPlaceholder", "Nama metode (cth. Transfer Bank BCA)")}
                className="w-full px-2 py-1.5 border border-border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground placeholder-sidebar-subtle-foreground"
              />
              {renderMethodField(method, idx)}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setMethods([...methods, { type: "transfer", label: "", detail: "" }])}
            className="w-full text-center py-1.5 text-[11px] font-semibold text-primary border border-dashed border-border rounded-md hover:border-primary/60 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
            {t("dashboard.sitesKatalog.methodAdd", "Tambah Metode")}
          </button>
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            <Truck className="w-3 h-3" />
            {t("dashboard.sitesKatalog.shippingTitle", "Info Pengiriman")}
          </label>
          <textarea
            rows={2}
            value={payments.shipping_note ?? ""}
            onChange={(e) => updateField("payments", "shipping_note", e.target.value)}
            placeholder={t("dashboard.sitesKatalog.shippingNotePlaceholder", "cth. Ongkir menyesuaikan lokasi. Estimasi 1–3 hari kerja.")}
            className={`${SIDEBAR_FIELD_CLASS} resize-none placeholder-sidebar-subtle-foreground`}
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            <RotateCcw className="w-3 h-3" />
            {t("dashboard.sitesKatalog.returnPolicy", "Kebijakan Retur")}
          </label>
          <textarea
            rows={2}
            value={payments.return_policy ?? ""}
            onChange={(e) => updateField("payments", "return_policy", e.target.value)}
            placeholder={t("dashboard.sitesKatalog.returnPolicyPlaceholder", "cth. Barang dapat dikembalikan/ditukar dalam 7 hari. Hubungi kami lewat WhatsApp.")}
            className={`${SIDEBAR_FIELD_CLASS} resize-none placeholder-sidebar-subtle-foreground`}
          />
        </div>

        <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
          {t("dashboard.sitesKatalog.paymentHint", "Perubahan tersimpan otomatis. Informasi ini hanya ditampilkan sebagai catatan — pembayaran dikonfirmasi manual lewat WhatsApp.")}
        </p>
      </div>
    );
  };

  return (
    <>
      {/* HEADER FORM */}
      {activeTab === "header" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.headerBrandName")} {needsAttention("header.brand_name") && <span className="text-amber-300">⚠️</span>}</span>
              {renderFieldActions("header", "brand_name")}
            </label>
            <input
              id="field-header.brand_name"
              type="text"
              value={content.header?.brand_name || ""}
              onChange={(e) => updateField("header", "brand_name", e.target.value)}
              className={fieldClass("header.brand_name", SIDEBAR_FIELD_CLASS)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5">
            <span className="text-[12px] font-medium text-sidebar-foreground">{t("dashboard.sitesEditor.headerShowNavButton")}</span>
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
                <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                  <span>{t("dashboard.sitesEditor.headerNavButtonText")} {needsAttention("header.nav_cta_text") && <span className="text-amber-300">⚠️</span>}</span>
                  {renderFieldActions("header", "nav_cta_text")}
                </label>
                <input
                  id="field-header.nav_cta_text"
                  type="text"
                  value={content.header?.nav_cta_text || ""}
                  onChange={(e) => updateField("header", "nav_cta_text", e.target.value)}
                  placeholder={t("dashboard.sitesEditor.phNavCta")}
                  className={fieldClass("header.nav_cta_text", `${SIDEBAR_FIELD_CLASS} text-sidebar-foreground placeholder-sidebar-subtle-foreground`)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.headerNavButtonLink")}</label>
                <CustomSelect
                  value={(content.header as any)?.nav_cta_href || ""}
                  onChange={(val) => updateField("header", "nav_cta_href", val)}
                  size="sm"
                  triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
                  placeholder={t("dashboard.sitesEditor.headerNavButtonLinkAuto")}
                  options={[
                    { value: "", label: t("dashboard.sitesEditor.headerNavButtonLinkAuto") },
                    { value: "#hero", label: t("dashboard.sitesEditor.headerNavLinkHero") },
                    { value: "#about", label: t("dashboard.sitesEditor.headerNavLinkAbout") },
                    { value: "#benefits", label: t("dashboard.sitesEditor.headerNavLinkBenefits") },
                    { value: "#catalog", label: t("dashboard.sitesEditor.headerNavLinkCatalog") },
                    { value: "#menu", label: t("dashboard.sitesEditor.headerNavLinkMenu") },
                    { value: "#works", label: t("dashboard.sitesEditor.headerNavLinkWorks") },
                    { value: "#gallery", label: t("dashboard.sitesEditor.headerNavLinkGallery") },
                    { value: "#testimonials", label: t("dashboard.sitesEditor.headerNavLinkTestimonials") },
                    { value: "#faq", label: t("dashboard.sitesEditor.headerNavLinkFaq") },
                    { value: "#contact", label: t("dashboard.sitesEditor.headerNavLinkContact") },
                  ]}
                />
                <p className="text-[10px] text-sidebar-subtle-foreground mt-0.5 leading-snug">
                  {t("dashboard.sitesEditor.headerNavButtonLinkHint")}
                </p>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.headerTagline")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.headerTaglineOptional")}</span></label>
            <input
              type="text"
              value={content.header?.tagline || ""}
              onChange={(e) => updateField("header", "tagline", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phTagline")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.headerLogoUrl")}</label>
            <FileUpload label="" value={content.header?.logo_url || ""} onChange={(val) => updateField("header", "logo_url", val)} placeholder="https://..." maxWidth={400} maxHeight={400} quality={0.85} previewSize="sm" objectFit="contain" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.headerLogoLight")}</label>
            <p className="text-[11px] text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.headerLogoLightHint")}</p>
            <FileUpload label="" value={content.header?.logo_url_light || ""} onChange={(val) => updateField("header", "logo_url_light", val)} placeholder="https://..." maxWidth={400} maxHeight={400} quality={0.85} previewSize="sm" objectFit="contain" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.headerFavicon")}</label>
            <FileUpload label="" value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} previewSize="icon" objectFit="contain" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.headerIconName")}</label>
            <input id="field-header.icon" type="text" value={content.header?.icon || ""} onChange={(e) => updateField("header", "icon", e.target.value)} className={SIDEBAR_FIELD_CLASS} placeholder={t("dashboard.sitesEditor.phIconName")} />
          </div>

          {/* Nav Menu Items */}
          <div className="pt-2 space-y-2">
            <div>
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.headerNavMenu")}</label>
              <p className="text-[10px] text-sidebar-subtle-foreground mt-0.5">{t("dashboard.sitesEditor.headerNavMenuHint")}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {([
                ["about", t("dashboard.sitesEditor.headerNavSectionAbout")],
                ["benefits", t("dashboard.sitesEditor.headerNavSectionBenefits")],
                ["menu", t("dashboard.sitesEditor.headerNavSectionMenu")],
                ["catalog", t("dashboard.sitesEditor.headerNavSectionCatalog")],
                ["works", t("dashboard.sitesEditor.headerNavSectionWorks")],
                ["gallery", t("dashboard.sitesEditor.headerNavSectionGallery")],
                ["testimonials", t("dashboard.sitesEditor.headerNavSectionTestimonials")],
                ["faq", t("dashboard.sitesEditor.headerNavSectionFaq")],
                ["cta", t("dashboard.sitesEditor.headerNavSectionPromo")],
                ["contact", t("dashboard.sitesEditor.headerNavSectionContact")],
                ["blog", t("dashboard.sitesEditor.headerNavSectionBlog")],
              ] as const)
                .filter(([key]) => {
                  if (key === "menu") return Boolean((content as any)?.menu?.categories?.length);
                  if (key === "catalog") return Boolean((content as any)?.catalog?.categories?.length) && !(content as any)?.works?.items?.length;
                  if (key === "works") return Boolean((content as any)?.works?.items?.length);
                  if (key === "gallery") return Boolean((content as any)?.gallery?.items?.length);
                  if (key === "blog") return Boolean((content as any)?.blog?.posts?.length);
                  return true;
                })
                .map(([key, label]) => {
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
                        ? "border-border/50 bg-muted/40 text-sidebar-subtle-foreground line-through"
                        : "border-primary/20 bg-primary/10 text-primary"
                    }`}
                  >
                    {hidden ? "🙈" : "👁️"}
                    {(content.header as any)?.nav_labels?.[key] || label}
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
          {heroNeedsImage && (
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span className="flex items-center gap-1">
                {heroStyle && HERO_IMAGES_ARRAY_VARIANTS.includes(heroStyle)
                  ? (t("dashboard.sitesEditor.heroCarouselMainSlide"))
                  : t("dashboard.sitesEditor.heroImageLabel")} {needsAttention("hero.image_url") && <span className="text-amber-300">⚠️</span>}
              </span>
              <AiImageButton businessType={bType} onSelect={(url) => {
                const p = setPrimaryHeroImage(content.hero ?? {}, url);
                updateField("hero", "image_url", p.image_url);
                updateField("hero", "image_credit", p.image_credit);
                if (p.images) updateField("hero", "images", p.images);
                if (p.image_credits) updateField("hero", "image_credits", p.image_credits);
              }}
 />
            </label>
            <FileUpload label="" value={content.hero.image_url || ""} onChange={(val) => {
              const p = setPrimaryHeroImage(content.hero ?? {}, val);
              updateField("hero", "image_url", p.image_url);
              updateField("hero", "image_credit", p.image_credit);
              if (p.images) updateField("hero", "images", p.images);
              if (p.image_credits) updateField("hero", "image_credits", p.image_credits);
            }} placeholder="https://..." maxWidth={1600} maxHeight={1200} quality={0.8} previewSize="lg" />
          </div>
          )}
          {/* Gambar carousel / kolase (hero.images) */}
          {showIfVariant(HERO_IMAGES_ARRAY_VARIANTS) && (() => {
            const hero = content.hero ?? {};
            // Rows efektif: fallback ke image_url jika images kosong (data lama)
            const rows: string[] = Array.isArray(hero.images) && hero.images.length
              ? hero.images
              : hero.image_url ? [hero.image_url] : [];
            const filledCount = rows.filter(Boolean).length;
            const distinctCount = countDistinctHeroImages(hero);
            // Minimum untuk varian ini — dari meta.ts (dijaga check:hero agar sync dengan API)
            const minImages = getHeroMinImages(heroStyle) || 1;
            const showDistinctBadge = distinctCount < minImages;

            const handleHeroSlideDragEnd = (e: DragEndEvent) => {
              const { active, over } = e;
              if (!over || active.id === over.id || !updateField) return;
              const from = rows.findIndex((_, i) => heroSlideId(i) === active.id);
              const to = rows.findIndex((_, i) => heroSlideId(i) === over.id);
              if (from < 0 || to < 0) return;
              writeHeroPatch(updateField, moveHeroSlide(hero, from, to));
              setHeroImageOpenIdx((o) => remapOpenIdx(o, from, to));
            };

            return (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setHeroImagesOpen(!heroImagesOpen)}
                className="flex w-full items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  {t("dashboard.sitesEditor.heroCarouselImages")}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-sidebar-muted text-sidebar-muted-foreground text-[10px] font-medium">
                    {filledCount} {t("dashboard.sitesEditor.heroCarouselImagesCount")}
                  </span>
                  {showDistinctBadge && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 text-[10px] font-semibold">
                      {distinctCount}/{minImages} min
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-2">
                  {heroImagesOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </span>
              </button>

              {heroImagesOpen ? (
                <>
                  <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
                    {t("dashboard.sitesEditor.heroSlidesHint")}
                  </p>
                  <DndContext sensors={heroSensors} collisionDetection={closestCenter} onDragEnd={handleHeroSlideDragEnd}>
                    <SortableContext items={rows.map((_, i) => heroSlideId(i))} strategy={verticalListSortingStrategy}>
                      <div className="space-y-1.5">
                        {rows.map((url: string, idx: number) => {
                          const isExpanded = heroImageOpenIdx === idx;
                          const isHidden = !!(hero.image_hidden?.[idx]);
                          const hasImage = !!url;
                          const creditName = Array.isArray(hero.image_credits) ? (hero.image_credits[idx] as any)?.name : null;
                          const rowLabel = idx === 0
                            ? `#1 · ${t("dashboard.sitesEditor.heroCarouselPrimary")}`
                            : `#${idx + 1}`;
                          const rowSub = creditName
                            ? t("dashboard.sitesEditor.heroPhotoBy", undefined, { name: creditName })
                            : (hasImage ? "" : (t("dashboard.sitesEditor.heroCarouselNoImage")));
                          return (
                            <HeroSlideRow key={heroSlideId(idx)} id={heroSlideId(idx)}>
                              <div className={`flex-1 rounded-xl border transition-colors ${isExpanded ? "border-primary/40 bg-primary/5" : "border-border bg-background"}`}>
                                {/* Row header */}
                                <div className="flex items-center gap-2 px-3 py-2.5">
                                  {/* Thumbnail mini */}
                                  {hasImage ? (
                                    <div className="w-8 h-8 rounded-md border border-border overflow-hidden shrink-0">
                                      <img src={url} alt="" className={`w-full h-full object-cover ${isHidden ? "opacity-40" : ""}`} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-md border border-dashed border-border bg-muted/40 shrink-0 flex items-center justify-center">
                                      <Camera className="h-3 w-3 text-sidebar-subtle-foreground" />
                                    </div>
                                  )}
                                  {/* Name + sub-label */}
                                  <div className="flex-1 min-w-0">
                                    <span className={`block text-[11px] font-semibold truncate ${isHidden ? "line-through text-sidebar-subtle-foreground" : "text-sidebar-foreground"}`}>
                                      {rowLabel}
                                      {isHidden && (
                                        <span className="ml-1.5 text-[9px] font-normal normal-case text-sidebar-subtle-foreground">
                                          {t("dashboard.sitesEditor.hidden")}
                                        </span>
                                      )}
                                    </span>
                                    {rowSub && (
                                      <span className="block text-[10px] text-sidebar-subtle-foreground truncate">{rowSub}</span>
                                    )}
                                  </div>
                                  {/* Status badge */}
                                  <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    hasImage
                                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                  }`}>
                                    {hasImage
                                      ? <><Check className="h-2.5 w-2.5" />{t("dashboard.sitesEditor.heroSlotSet")}</>
                                      : <><X className="h-2.5 w-2.5" />{t("dashboard.sitesEditor.heroSlotEmpty")}</>
                                    }
                                  </span>
                                  {/* Eye toggle */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!hasImage) return;
                                      writeHeroPatch(updateField, toggleHeroSlideHidden(hero, idx));
                                    }}
                                    title={isHidden ? (t("dashboard.sitesEditor.heroCarouselShowSlide")) : (t("dashboard.sitesEditor.heroCarouselHideSlide"))}
                                    className="h-7 w-7 flex items-center justify-center rounded-md text-sidebar-muted-foreground hover:bg-sidebar-muted transition-colors shrink-0"
                                  >
                                    {isHidden ? <EyeOff className="h-3.5 w-3.5 text-sidebar-subtle-foreground" /> : <Eye className="h-3.5 w-3.5" />}
                                  </button>
                                  {/* Up/Down buttons (keyboard/mobile alternative) */}
                                  <div className="flex flex-col gap-0.5 shrink-0">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => {
                                        writeHeroPatch(updateField, moveHeroSlide(hero, idx, idx - 1));
                                        setHeroImageOpenIdx((o) => remapOpenIdx(o, idx, idx - 1));
                                      }}
                                      title={t("dashboard.sitesEditor.moveUp")}
                                      aria-label={t("dashboard.sitesEditor.moveUp")}
                                      className="h-6 w-6 flex items-center justify-center rounded text-sidebar-subtle-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted disabled:opacity-20 transition-colors"
                                    >
                                      <ChevronUp className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === rows.length - 1}
                                      onClick={() => {
                                        writeHeroPatch(updateField, moveHeroSlide(hero, idx, idx + 1));
                                        setHeroImageOpenIdx((o) => remapOpenIdx(o, idx, idx + 1));
                                      }}
                                      title={t("dashboard.sitesEditor.moveDown")}
                                      aria-label={t("dashboard.sitesEditor.moveDown")}
                                      className="h-6 w-6 flex items-center justify-center rounded text-sidebar-subtle-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted disabled:opacity-20 transition-colors"
                                    >
                                      <ChevronDown className="h-3 w-3" />
                                    </button>
                                  </div>
                                  {/* Chevron expand */}
                                  <button
                                    type="button"
                                    onClick={() => setHeroImageOpenIdx(isExpanded ? null : idx)}
                                    className={`h-7 w-7 flex items-center justify-center rounded-full border transition-colors shrink-0 ${isExpanded ? "border-primary text-primary bg-primary/10" : "border-border text-sidebar-muted-foreground hover:bg-sidebar-muted"}`}
                                  >
                                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                  </button>
                                  {/* Delete */}
                                  <button
                                    type="button"
                                    disabled={rows.length <= 1}
                                    onClick={() => {
                                      const p = removeHeroSlide(hero, idx);
                                      writeHeroPatch(updateField, p);
                                      if (heroImageOpenIdx === idx) setHeroImageOpenIdx(null);
                                      else if (heroImageOpenIdx !== null && heroImageOpenIdx > idx) setHeroImageOpenIdx(heroImageOpenIdx - 1);
                                    }}
                                    title={t("dashboard.sitesEditor.heroCarouselRemove")}
                                    className="h-7 w-7 flex items-center justify-center rounded-md text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-colors shrink-0"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                {/* Expanded body */}
                                {isExpanded && (
                                  <div className="px-3 pb-3 space-y-2 border-t border-border/50">
                                    <div className="pt-2">
                                      <FileUpload
                                        label=""
                                        value={url || ""}
                                        onChange={(val) => {
                                          writeHeroPatch(updateField, setHeroSlide(hero, idx, val));
                                        }}
                                        placeholder="https://..."
                                        maxWidth={1600}
                                        maxHeight={1200}
                                        quality={0.8}
                                        previewSize="md"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      value={(Array.isArray(hero.image_captions) ? hero.image_captions[idx] : "") || ""}
                                      onChange={(e) => {
                                        writeHeroPatch(updateField, setHeroCaption(hero, idx, e.target.value));
                                      }}
                                      placeholder={t("dashboard.sitesEditor.phHeroCaption")}
                                      className={`${SIDEBAR_FIELD_CLASS} text-[11px]`}
                                    />
                                  </div>
                                )}
                              </div>
                            </HeroSlideRow>
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                  <button
                    type="button"
                    disabled={rows.length >= 8}
                    onClick={() => {
                      if (!updateField) return;
                      const p = addHeroSlide(hero, "");
                      writeHeroPatch(updateField, p);
                      setHeroImageOpenIdx(rows.length);
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-2.5 text-[11px] font-semibold text-sidebar-muted-foreground hover:bg-sidebar-muted disabled:opacity-40 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("dashboard.sitesEditor.heroAddImage")}
                  </button>
                </>
              ) : null}
            </div>
            );
          })()}
          {/* Video background (hero varian video-bg) — URL langsung, bukan upload */}
          {heroIsVideo && (
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.heroVideoUrlLabel")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
              {renderFieldActions("hero", "video_url")}
            </label>
            <input
              id="field-hero.video_url"
              type="url"
              value={content.hero?.video_url || ""}
              onChange={(e) => updateField("hero", "video_url", e.target.value)}
              placeholder="https://.../video.mp4"
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
            <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
              {t("dashboard.sitesEditor.heroVideoUrlHint")}
            </p>
          </div>
          )}
          {/* Eyebrow label (opsional, dipakai oleh beberapa varian) */}
          {showIfVariant(HERO_EYEBROW_VARIANTS) && (
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.heroEyebrow")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
              {renderFieldActions("hero", "eyebrow")}
            </label>
            <input
              id="field-hero.eyebrow"
              type="text"
              value={content.hero?.eyebrow || ""}
              onChange={(e) => updateField("hero", "eyebrow", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phEyebrowAvailable")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
            <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">{t("dashboard.sitesEditor.heroEyebrowHint")}</p>
          </div>
          )}
          <SidebarField
            section="hero"
            fieldKey="headline"
            label={t("dashboard.sitesEditor.heroHeadline")}
            value={content.hero.headline || ""}
            onChange={(val) => updateField("hero", "headline", val)}
            needsAttention={needsAttention("hero.headline")}
            inputClassName={fieldClass("hero.headline", "")}
            undoCount={fieldUndoStacks?.["hero.headline"]?.length}
            onUndo={() => undoField?.("hero", "headline")}
          />
          <SidebarField
            section="hero"
            fieldKey="subheadline"
            multiline
            rows={2}
            label={t("dashboard.sitesEditor.heroSubheadline")}
            value={content.hero.subheadline || ""}
            onChange={(val) => updateField("hero", "subheadline", val)}
            needsAttention={needsAttention("hero.subheadline")}
            inputClassName={fieldClass("hero.subheadline", "")}
            undoCount={fieldUndoStacks?.["hero.subheadline"]?.length}
            onUndo={() => undoField?.("hero", "subheadline")}
          />
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.heroCtaText")} {needsAttention("hero.cta_text") && <span className="text-amber-300">⚠️</span>}</span>
              {renderFieldActions("hero", "cta_text")}
            </label>
            <input
              id="field-hero.cta_text"
              type="text"
              value={content.hero.cta_text || ""}
              onChange={(e) => updateField("hero", "cta_text", e.target.value)}
              className={fieldClass("hero.cta_text", SIDEBAR_FIELD_CLASS)}

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
            label={t("dashboard.sitesEditor.heroCtaLink")}
            defaultWaNumber={content.contact?.phone}
            suggestedHash={content.catalog ? "#catalog" : content.menu ? "#menu" : "#contact"}
          />
          {/* Secondary CTA (opsional, dipakai oleh beberapa varian) */}
          {showIfVariant(HERO_SECONDARY_VARIANTS) && (
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.heroCtaSecondaryText")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
              {renderFieldActions("hero", "cta_secondary_text")}
            </label>
            <input
              id="field-hero.cta_secondary_text"
              type="text"
              value={content.hero?.cta_secondary_text || ""}
              onChange={(e) => updateField("hero", "cta_secondary_text", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phLearnMore")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
            <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">{t("dashboard.sitesEditor.heroCtaSecondaryHint")}</p>
          </div>
          )}
          {/* Secondary CTA URL */}
          {showIfVariant(HERO_SECONDARY_VARIANTS) && (
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.heroCtaSecondaryUrl")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
              {renderFieldActions("hero", "cta_secondary_url")}
            </label>
            <input
              id="field-hero.cta_secondary_url"
              type="text"
              value={content.hero?.cta_secondary_url || ""}
              onChange={(e) => updateField("hero", "cta_secondary_url", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phSecondaryCta")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
            <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">{t("dashboard.sitesEditor.heroCtaSecondaryUrlHint")}</p>
          </div>
          )}
          {/* Badge text (opsional, dipakai oleh beberapa varian) */}
          {showIfVariant(HERO_BADGE_VARIANTS) && (
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.heroBadgeText")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
              {renderFieldActions("hero", "badge_text")}
            </label>
            <input
              id="field-hero.badge_text"
              type="text"
              value={content.hero?.badge_text || ""}
              onChange={(e) => updateField("hero", "badge_text", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phBadgeText")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
            <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">Teks kecil yang muncul di bawah tombol CTA (jam buka, info singkat, dll).</p>
          </div>
          )}
          {/* Opening hours (opsional, dipakai oleh beberapa varian) */}
          {showIfVariant(HERO_OPENING_HOURS_VARIANTS) && (
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.heroOpeningHours")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
              {renderFieldActions("hero", "opening_hours")}
            </label>
            <input
              id="field-hero.opening_hours"
              type="text"
              value={content.hero?.opening_hours || ""}
              onChange={(e) => updateField("hero", "opening_hours", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phOpeningHours")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
          </div>
          )}
          {/* Accessory — info bisnis di hero (see HERO_ACCESSORY_PLAN.md) */}
          <HeroAccessoryEditor
            accessory={content.hero?.accessory || null}
            onChange={(acc) => updateField("hero", "accessory", acc)}

          />

          {/* Hero stats — baris angka di varian tertentu */}
          {showIfVariant(HERO_STATS_VARIANTS) && (
          <HeroStatsEditor
            stats={content.hero?.stats || null}
            onChange={(stats) => updateField("hero", "stats", stats)}

          />
          )}

          {/* Dashboard Widget — preview widget untuk hero tech-saas */}
          {showIfVariant(HERO_DASHBOARD_WIDGET_VARIANTS) && (
          <HeroDashboardWidgetEditor
            widget={content.hero?.dashboard_widget || null}
            onChange={(dw) => updateField("hero", "dashboard_widget", dw)}

          />
          )}
        </div>
      )}

      {/* HERO BACKGROUND COLOR */}
      {activeTab === "hero" && (
        <div className="space-y-1 mt-2">
          <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            {t("dashboard.sitesEditor.heroBgColor")}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-md border border-border overflow-hidden flex-shrink-0">
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
              className="flex-1 px-2.5 py-1.5 border border-border bg-sidebar-input text-sidebar-foreground rounded-md text-[13px] outline-none focus:border-primary/60"
              placeholder={t("dashboard.sitesEditor.phHeroBgColor")}
            />
          </div>
          <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">{t("dashboard.sitesEditor.heroBgColorHint")}</p>
        </div>
      )}

      {/* ABOUT FORM */}
      {activeTab === "about" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.aboutImage")}</span>
              <AiImageButton businessType={bType} onSelect={(url) => handleAiImage("about", "image_url", url)}
 />
            </label>
            <FileUpload label="" value={content.about.image_url || ""} onChange={(val) => updateField("about", "image_url", val)} placeholder="https://..." maxWidth={1000} maxHeight={1000} quality={0.8} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-sidebar-subtle-foreground uppercase">{t("dashboard.sitesEditor.commonTextAlign")}</label>
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => updateField("about", "textAlign", align === "left" ? undefined : align)}
                  className={`flex-1 px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                    (content.about.textAlign || "left") === align
                      ? "bg-primary/20 border-primary/60 text-primary"
                      : "border-border text-sidebar-muted-foreground hover:border-border"
                  }`}
                >
                  {t(`dashboard.sitesEditor.common${align.charAt(0).toUpperCase() + align.slice(1)}` as any)}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.commonEyebrow")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
              {renderFieldActions("about", "eyebrow")}
            </label>
            <input
              type="text"
              value={content.about?.eyebrow || ""}
              onChange={(e) => updateField("about", "eyebrow", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phAboutEyebrow")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
          </div>
          <SidebarField
            section="about"
            fieldKey="title"
            label={t("dashboard.sitesEditor.commonTitle")}
            value={content.about.title || ""}
            onChange={(val) => updateField("about", "title", val)}
            needsAttention={needsAttention("about.title")}
            inputClassName={fieldClass("about.title", "")}
            undoCount={fieldUndoStacks?.["about.title"]?.length}
            onUndo={() => undoField?.("about", "title")}
          />
          <SidebarField
            section="about"
            fieldKey="body"
            multiline
            rows={3}
            label={t("dashboard.sitesEditor.commonDescription")}
            value={content.about.body || ""}
            onChange={(val) => updateField("about", "body", val)}
            needsAttention={needsAttention("about.body")}
            inputClassName={fieldClass("about.body", "")}
            undoCount={fieldUndoStacks?.["about.body"]?.length}
            onUndo={() => undoField?.("about", "body")}
          />
          {/* Highlight Stats */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground block">{t("dashboard.sitesEditor.aboutStatHighlight")}</label>
            {[1, 2, 3].map((n) => {
              const statKey = `highlight_stat_${n}` as "highlight_stat_1" | "highlight_stat_2" | "highlight_stat_3";
              const stat = (content.about as any)[statKey] as { value?: string; label?: string } | undefined;
              return (
                <div key={n} className="border border-border rounded-md p-2 space-y-1.5 bg-muted/30">
                  <span className="text-[10px] text-sidebar-subtle-foreground uppercase font-bold">{t("dashboard.sitesEditor.aboutStat")} {n}</span>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-0.5">
                      <label className="text-[10px] text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.aboutStatValue")}</label>
                      <input
                        type="text"
                        value={stat?.value || ""}
                        onChange={(e) => updateField("about", statKey, { ...(stat || {}), value: e.target.value })}
                        placeholder={t("dashboard.sitesEditor.phStatValue")}
                        className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                      />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <label className="text-[10px] text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.aboutStatLabel")}</label>
                      <input
                        type="text"
                        value={stat?.label || ""}
                        onChange={(e) => updateField("about", statKey, { ...(stat || {}), label: e.target.value })}
                        placeholder={t("dashboard.sitesEditor.phStatLabel")}
                        className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Milestones */}
          <CollapsibleGroup label={t("dashboard.sitesEditor.aboutMilestones")} defaultOpen={false}>
            {((content.about?.milestones as any[]) || []).map((m: any, idx: number) => (
              <div key={idx} className="border border-border rounded-md p-2 space-y-1.5 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-sidebar-subtle-foreground uppercase font-bold">{t("dashboard.sitesEditor.aboutMilestone")} {idx + 1}</span>
                  <button type="button" onClick={() => {
                    const arr = [...(content.about?.milestones || [])];
                    arr.splice(idx, 1);
                    updateField("about", "milestones", arr);
                  }} className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer">{t("dashboard.sitesEditor.commonRemove")}</button>
                </div>
                <input type="text" value={m.year || ""} onChange={(e) => { const arr = [...(content.about?.milestones || [])]; arr[idx] = { ...arr[idx], year: e.target.value }; updateField("about", "milestones", arr); }} placeholder={t("dashboard.sitesEditor.aboutMilestoneYear")} className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground" />
                <input type="text" value={m.title || ""} onChange={(e) => { const arr = [...(content.about?.milestones || [])]; arr[idx] = { ...arr[idx], title: e.target.value }; updateField("about", "milestones", arr); }} placeholder={t("dashboard.sitesEditor.aboutMilestoneTitle")} className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground" />
                <textarea rows={1} value={m.description || ""} onChange={(e) => { const arr = [...(content.about?.milestones || [])]; arr[idx] = { ...arr[idx], description: e.target.value }; updateField("about", "milestones", arr); }} placeholder={t("dashboard.sitesEditor.aboutMilestoneDesc")} className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground resize-none" />
              </div>
            ))}
            <button type="button" onClick={() => updateField("about", "milestones", [...(content.about?.milestones || []), { year: new Date().getFullYear().toString(), title: "Milestone Baru", description: "" }])} className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary/80 hover:text-primary cursor-pointer"><Plus className="w-3 h-3" /> {t("dashboard.sitesEditor.aboutAddMilestone")}</button>
          </CollapsibleGroup>
          {/* Team Members */}
          <CollapsibleGroup label={t("dashboard.sitesEditor.aboutTeamMembers")} defaultOpen={false}>
            {((content.about?.team_members as any[]) || []).map((m: any, idx: number) => (
              <div key={idx} className="border border-border rounded-md p-2 space-y-1.5 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-sidebar-subtle-foreground uppercase font-bold">{t("dashboard.sitesEditor.aboutTeamMember")} {idx + 1}</span>
                  <button type="button" onClick={() => {
                    const arr = [...(content.about?.team_members || [])];
                    arr.splice(idx, 1);
                    updateField("about", "team_members", arr);
                  }} className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer">{t("dashboard.sitesEditor.commonRemove")}</button>
                </div>
                <input type="text" value={m.name || ""} onChange={(e) => { const arr = [...(content.about?.team_members || [])]; arr[idx] = { ...arr[idx], name: e.target.value }; updateField("about", "team_members", arr); }} placeholder={t("dashboard.sitesEditor.commonName")} className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground" />
                <input type="text" value={m.role || ""} onChange={(e) => { const arr = [...(content.about?.team_members || [])]; arr[idx] = { ...arr[idx], role: e.target.value }; updateField("about", "team_members", arr); }} placeholder={t("dashboard.sitesEditor.commonRole")} className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground" />
                <FileUpload label={t("dashboard.sitesEditor.commonPhoto")} value={m.photo_url || ""} onChange={(val) => { const arr = [...(content.about?.team_members || [])]; arr[idx] = { ...arr[idx], photo_url: val }; updateField("about", "team_members", arr); }} placeholder="https://..." maxWidth={400} maxHeight={400} quality={0.85} previewSize="sm" />
              </div>
            ))}
            <button type="button" onClick={() => updateField("about", "team_members", [...(content.about?.team_members || []), { name: "Nama Anggota", role: "Jabatan", photo_url: "" }])} className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary/80 hover:text-primary cursor-pointer"><Plus className="w-3 h-3" /> {t("dashboard.sitesEditor.aboutAddTeamMember")}</button>
          </CollapsibleGroup>
        </div>
      )}

      {/* BENEFITS FORM */}
      {activeTab === "benefits" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.benefitsEyebrow")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></label>
            <input
              type="text"
              value={content.benefits?.eyebrow || ""}
              onChange={(e) => updateField("benefits", "eyebrow", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phWhyChooseUs")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
          </div>
          <SidebarField
            section="benefits"
            fieldKey="title"
            label={t("dashboard.sitesEditor.benefitsSectionTitle")}
            value={content.benefits.title || ""}
            onChange={(val) => updateField("benefits", "title", val)}
            needsAttention={needsAttention("benefits.title")}
            inputClassName={fieldClass("benefits.title", "")}
            undoCount={fieldUndoStacks?.["benefits.title"]?.length}
            onUndo={() => undoField?.("benefits", "title")}
          />
          <SidebarField
            section="benefits"
            fieldKey="subtitle"
            label={t("dashboard.sitesEditor.benefitsSubtitle")}
            value={content.benefits?.subtitle || ""}
            onChange={(val) => updateField("benefits", "subtitle", val)}
            placeholder={t("dashboard.sitesEditor.phBenefitsSubtitle")}
            undoCount={fieldUndoStacks?.["benefits.subtitle"]?.length}
            onUndo={() => undoField?.("benefits", "subtitle")}
          />
          <div className="space-y-1">
            <label className="text-[10px] text-sidebar-subtle-foreground uppercase">{t("dashboard.sitesEditor.commonTextAlign")}</label>
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => updateField("benefits", "textAlign", align === "center" ? undefined : align)}
                  className={`flex-1 px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                    (content.benefits.textAlign || "center") === align
                      ? "bg-primary/20 border-primary/60 text-primary"
                      : "border-border text-sidebar-muted-foreground hover:border-border"
                  }`}
                >
                  {t(`dashboard.sitesEditor.common${align.charAt(0).toUpperCase() + align.slice(1)}` as any)}
                </button>
              ))}
            </div>
          </div>
          {content.benefits.items?.map((item: any, idx: number) => (
            <div key={idx} className="border border-border p-2.5 rounded-lg space-y-2 bg-muted/40">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-sidebar-muted-foreground">#{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const n = content.benefits.items.filter((_: any, i: number) => i !== idx);
                    updateField("benefits", "items", n);
                  }}
                  className="text-red-400 text-[11px]"
                >
                  {t("dashboard.sitesEditor.commonRemove")}
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
                placeholder={t("dashboard.sitesEditor.benefitsItemTitle")}
                className={fieldClass(`benefits.items.${idx}.title`, SIDEBAR_FIELD_CLASS)}
              />
              <SidebarField
                section="benefits"
                fieldKey={`items.${idx}.description`}
                multiline
                rows={2}
                value={item.description || ""}
                onChange={(val) => {
                  const n = [...content.benefits.items];
                  n[idx].description = val;
                  updateField("benefits", "items", n);
                }}
                placeholder={t("dashboard.sitesEditor.benefitsItemDesc")}
                inputClassName={fieldClass(`benefits.items.${idx}.description`, "")}
              />
              {/* Icon + Stat row */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-sidebar-subtle-foreground uppercase">{t("dashboard.sitesEditor.commonIcon")}</label>
                <IconPicker
                  value={item.icon || ""}
                  onChange={(name) => { const n = [...content.benefits.items]; n[idx].icon = name; updateField("benefits", "items", n); }}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-0.5">
                  <label className="text-[10px] text-sidebar-subtle-foreground uppercase">{t("dashboard.sitesEditor.commonStat")}</label>
                  <input
                    type="text"
                    value={item.stat || ""}
                    onChange={(e) => { const n = [...content.benefits.items]; n[idx].stat = e.target.value; updateField("benefits", "items", n); }}
                    placeholder={t("dashboard.sitesEditor.phStatValue")}
                    className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                  />
                </div>
                <div className="flex-1 space-y-0.5">
                  <label className="text-[10px] text-sidebar-subtle-foreground uppercase">{t("dashboard.sitesEditor.benefitsStatLabel")}</label>
                  <input
                    type="text"
                    value={item.stat_label || ""}
                    onChange={(e) => { const n = [...content.benefits.items]; n[idx].stat_label = e.target.value; updateField("benefits", "items", n); }}
                    placeholder={t("dashboard.sitesEditor.phBenefitsStat")}
                    className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const n = [...(content.benefits.items || []), { title: "Manfaat Baru", description: "Deskripsi manfaat ini" }];
              updateField("benefits", "items", n);
            }}
            className="w-full text-[12px] py-1.5 border border-border rounded-lg text-sidebar-muted-foreground hover:bg-sidebar-muted flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.benefitsAddItem")}
          </button>
          {/* Comparison table */}
          <CollapsibleGroup label={t("dashboard.sitesEditor.benefitsComparisonTable")} defaultOpen={false}>
            {(content.benefits?.comparison?.column_a_label !== undefined) || false ? null : null}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] text-sidebar-subtle-foreground uppercase">{t("dashboard.sitesEditor.benefitsComparisonColA")}</label>
                <input type="text" value={content.benefits?.comparison?.column_a_label || ""} onChange={(e) => updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), column_a_label: e.target.value })} placeholder={t("dashboard.sitesEditor.phBenefitsColA")} className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] text-sidebar-subtle-foreground uppercase">{t("dashboard.sitesEditor.benefitsComparisonColB")}</label>
                <input type="text" value={content.benefits?.comparison?.column_b_label || ""} onChange={(e) => updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), column_b_label: e.target.value })} placeholder={t("dashboard.sitesEditor.phBenefitsColB")} className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground" />
              </div>
            </div>
            {((content.benefits?.comparison?.rows as any[]) || []).map((row: any, idx: number) => (
              <div key={idx} className="border border-border rounded-md p-2 space-y-1.5 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-sidebar-subtle-foreground uppercase font-bold">{t("dashboard.sitesEditor.benefitsComparisonRow")} {idx + 1}</span>
                  <button type="button" onClick={() => { const arr = [...(content.benefits?.comparison?.rows || [])]; arr.splice(idx, 1); updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer">{t("dashboard.sitesEditor.commonRemove")}</button>
                </div>
                <input type="text" value={row.label || ""} onChange={(e) => { const arr = [...(content.benefits?.comparison?.rows || [])]; arr[idx] = { ...arr[idx], label: e.target.value }; updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} placeholder={t("dashboard.sitesEditor.phComparisonLabel")} className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={row.value_a || ""} onChange={(e) => { const arr = [...(content.benefits?.comparison?.rows || [])]; arr[idx] = { ...arr[idx], value_a: e.target.value }; updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} placeholder={t("dashboard.sitesEditor.phValueA")} className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground" />
                  <input type="text" value={row.value_b || ""} onChange={(e) => { const arr = [...(content.benefits?.comparison?.rows || [])]; arr[idx] = { ...arr[idx], value_b: e.target.value }; updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} placeholder={t("dashboard.sitesEditor.phValueB")} className="w-full px-2 py-1 border border-border rounded text-[11px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => { const arr = [...(content.benefits?.comparison?.rows || []), { label: "", value_a: "✓", value_b: "✗" }]; updateField("benefits", "comparison", { ...(content.benefits?.comparison || {}), rows: arr }); }} className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary/80 hover:text-primary cursor-pointer"><Plus className="w-3 h-3" /> {t("dashboard.sitesEditor.benefitsAddRow")}</button>
          </CollapsibleGroup>
        </div>
      )}

      {/* FAQ FORM */}
      {activeTab === "faq" && content?.faq && (
        <div className="space-y-3">
          <SidebarField
            section="faq"
            fieldKey="title"
            label={t("dashboard.sitesEditor.faqSectionTitle")}
            value={content.faq.title || ""}
            onChange={(val) => updateField("faq", "title", val)}
            needsAttention={needsAttention("faq.title")}
            inputClassName={fieldClass("faq.title", "")}
            undoCount={fieldUndoStacks?.["faq.title"]?.length}
            onUndo={() => undoField?.("faq", "title")}
          />
          {content.faq.items?.map((item: any, idx: number) => (
            <div key={idx} className="border border-border p-2.5 rounded-lg space-y-2 bg-muted/40">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.faqItem")} #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const n = content.faq.items.filter((_: any, i: number) => i !== idx);
                    updateField("faq", "items", n);
                  }}
                  className="text-red-400 text-[11px]"
                >
                  {t("dashboard.sitesEditor.commonRemove")}
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
                placeholder={t("dashboard.sitesEditor.faqQuestion")}
                className={fieldClass(`faq.items.${idx}.question`, SIDEBAR_FIELD_CLASS)}
              />
              <SidebarField
                section="faq"
                fieldKey={`items.${idx}.answer`}
                multiline
                rows={2}
                value={item.answer || ""}
                onChange={(val) => {
                  const n = [...content.faq.items];
                  n[idx].answer = val;
                  updateField("faq", "items", n);
                }}
                placeholder={t("dashboard.sitesEditor.faqAnswer")}
                inputClassName={fieldClass(`faq.items.${idx}.answer`, "")}
              />
              <input
                type="text"
                value={item.category || ""}
                onChange={(e) => {
                  const n = [...content.faq.items];
                  n[idx] = { ...n[idx], category: e.target.value };
                  updateField("faq", "items", n);
                }}
                placeholder={`${t("dashboard.sitesEditor.faqCategory")} ${t("dashboard.sitesEditor.faqCategoryHint")}`}
                className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const n = [...(content.faq.items || []), { question: "Pertanyaan yang sering ditanya?", answer: "Jawaban pertanyaan di sini" }];
              updateField("faq", "items", n);
            }}
            className="w-full text-[12px] py-1.5 border border-border rounded-lg text-sidebar-muted-foreground hover:bg-sidebar-muted flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.faqAddItem")}
          </button>
        </div>
      )}

      {/* CTA FORM */}
      {activeTab === "cta" && (
        <div className="space-y-3">
          <SidebarField
            section="cta"
            fieldKey="headline"
            label={t("dashboard.sitesEditor.ctaHeadline")}
            value={content.cta.headline || ""}
            onChange={(val) => updateField("cta", "headline", val)}
            needsAttention={needsAttention("cta.headline")}
            inputClassName={fieldClass("cta.headline", "")}
            undoCount={fieldUndoStacks?.["cta.headline"]?.length}
            onUndo={() => undoField?.("cta", "headline")}
          />
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.ctaEyebrow")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></label>
            <input
              type="text"
              value={content.cta?.eyebrow || ""}
              onChange={(e) => updateField("cta", "eyebrow", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phCtaEyebrow")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.ctaSubheadline")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></label>
            <input
              type="text"
              value={content.cta?.subheadline || ""}
              onChange={(e) => updateField("cta", "subheadline", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phCtaSubheadline")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.ctaTrustSignal")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></label>
            <input
              type="text"
              value={content.cta?.trust_signal || ""}
              onChange={(e) => updateField("cta", "trust_signal", e.target.value)}
              placeholder={t("dashboard.sitesEditor.phCtaTrustSignal")}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.ctaImage")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}, {t("dashboard.sitesEditor.ctaImageSplitVariant")}</span></label>
            <FileUpload label="" value={content.cta?.image_url || ""} onChange={(val) => updateField("cta", "image_url", val)} placeholder="https://..." maxWidth={800} maxHeight={800} quality={0.85} />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.ctaButtonText")} {needsAttention("cta.button_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input
              id="field-cta.button_text"
              type="text"
              value={content.cta.button_text || ""}
              onChange={(e) => updateField("cta", "button_text", e.target.value)}
              className={fieldClass("cta.button_text", SIDEBAR_FIELD_CLASS)}
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
            label={t("dashboard.sitesEditor.ctaButtonLink")}
            defaultWaNumber={content.contact?.phone}
            suggestedHash={content.catalog ? "#catalog" : content.menu ? "#menu" : "#contact"}
          />
        </div>
      )}

      {/* CONTACT FORM */}
      {activeTab === "contact" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.contactContentAlign")}</label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-muted/40 p-1">
              {[
                { value: "left", label: t("dashboard.sitesEditor.commonLeft") },
                { value: "center", label: t("dashboard.sitesEditor.commonCenter") },
                { value: "right", label: t("dashboard.sitesEditor.commonRight") },
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
                        : "text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <SidebarField
            section="contact"
            fieldKey="title"
            label={t("dashboard.sitesEditor.contactTitle")}
            needsAttention={needsAttention("contact.title")}
            value={content.contact.title || ""}
            onChange={(val) => updateField("contact", "title", val)}
            undoCount={fieldUndoStacks?.["contact.title"]?.length}
            onUndo={() => undoField?.("contact", "title")}
          />
          <SidebarField
            section="contact"
            fieldKey="address"
            label={`${t("dashboard.sitesEditor.contactAddress")} (${t("dashboard.sitesEditor.commonOptional")})`}
            value={content.contact.address || ""}
            onChange={(val) => updateField("contact", "address", val)}
            undoCount={fieldUndoStacks?.["contact.address"]?.length}
            onUndo={() => undoField?.("contact", "address")}
          />
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.contactPhone")} <span className="text-sidebar-subtle-foreground normal-case font-normal">{t("dashboard.sitesEditor.commonOptional")}</span> {needsAttention("contact.phone") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input
              id="field-contact.phone"
              type="text"
              value={content.contact.phone || ""}
              onChange={(e) => {
                const val = e.target.value;
                updateField("contact", "phone", val);
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
              className={fieldClass("contact.phone", SIDEBAR_FIELD_CLASS)}
            />
            <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
              {t("dashboard.sitesEditor.contactPhoneHint")}
            </p>
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.contactEmail")} <span className="text-sidebar-subtle-foreground normal-case font-normal">{t("dashboard.sitesEditor.commonOptional")}</span>
            </label>
            <input
              id="field-contact.email"
              type="email"
              value={content.contact.email || ""}
              onChange={(e) => updateField("contact", "email", e.target.value)}
              className={fieldClass("contact.email", SIDEBAR_FIELD_CLASS)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5">
            <span className="text-[12px] font-medium text-sidebar-foreground">{t("dashboard.sitesEditor.contactShowForm")}</span>
            <input
              type="checkbox"
              checked={content.contact.show_lead_form !== false}
              onChange={(e) => updateField("contact", "show_lead_form", e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5">
            <span className="text-[12px] font-medium text-sidebar-foreground">{t("dashboard.sitesEditor.contactShowMap")}</span>
            <input
              type="checkbox"
              checked={content.contact.show_map !== false}
              onChange={(e) => updateField("contact", "show_map", e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5">
            <span className="text-[12px] font-medium text-sidebar-foreground">{t("dashboard.sitesEditor.contactShowWhatsAppCard")}</span>
            <input
              type="checkbox"
              checked={content.contact.show_whatsapp_card !== false}
              onChange={(e) => updateField("contact", "show_whatsapp_card", e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-medium text-sidebar-foreground">
                {t("dashboard.sitesEditor.mapStyleLabel")}
              </span>
              <span className="text-[10px] text-sidebar-subtle-foreground truncate">
                {getEnabledMapTiles(ALL_MAP_TILES.map(o => o.key)).length} {t("dashboard.sitesEditor.optionsCount")}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {getEnabledMapTiles(ALL_MAP_TILES.map(o => o.key)).map((key) => {
                const opt = ALL_MAP_TILES.find(o => o.key === key)!;
                const active = (content.contact.map_tile_style || "default") === opt.key;
                return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => updateField("contact", "map_tile_style", opt.key)}
                  aria-pressed={active}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                  }`}
                >
                  {MAP_TILE_I18N_KEYS[opt.key] ? t(MAP_TILE_I18N_KEYS[opt.key]) : opt.label}
                </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              Link Google Maps <span className="text-sidebar-subtle-foreground normal-case font-normal">(opsional)</span>
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
                title={t("dashboard.sitesEditor.pickLocation")}
              >
                {t("dashboard.sitesEditor.pickLocation")}
              </button>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">
                {t("dashboard.sitesEditor.mapPreviewLabel")}
              </label>
              <LocationMapPreview
                url={content.contact.maps_url}
                tileStyle={content.contact.map_tile_style}
                emptyLabel={t("dashboard.sitesEditor.mapPreviewEmpty")}
                clickLabel={t("dashboard.sitesEditor.mapPreviewEditAria")}
                onClick={() => setShowLocationPicker(true)}
              />
            </div>

            {/* Form position layout selector */}
            <div className="space-y-1 pt-2">
              <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">
                {t("dashboard.sitesEditor.contactFormLayout")}
              </label>
              <div className="flex flex-wrap gap-1">
                {([
                  { value: "right", label: t("dashboard.sitesEditor.contactFormLayoutInfoLeft") },
                  { value: "left", label: t("dashboard.sitesEditor.contactFormLayoutFormLeft") },
                  { value: "stack", label: t("dashboard.sitesEditor.contactFormLayoutStack") },
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
                          : "border border-border text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
                {t("dashboard.sitesEditor.contactFormLayoutHint")}
              </p>
            </div>
            {/* Map layout selector */}
            <div className="space-y-1 pt-2">
              <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">
                {t("dashboard.sitesEditor.contactMapLayout")}
              </label>
              <div className="flex flex-wrap gap-1">
                {([
                  { value: "inline", label: t("dashboard.sitesEditor.contactMapLayoutInline") },
                  { value: "full", label: t("dashboard.sitesEditor.contactMapLayoutFull") },
                ] as const).map((opt) => {
                  const active = (content.contact.map_layout || "inline") === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField("contact", "map_layout", opt.value)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
                {t("dashboard.sitesEditor.contactMapLayoutHint")}
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
                    setResolveError(t("dashboard.sitesEditor.contactResolveError"));
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
                {t("dashboard.sitesEditor.contactInvalidMapLink")}
              </p>
            )}
            {resolveError && (
              <p className="text-[10px] text-red-400 leading-relaxed">{resolveError}</p>
            )}
            <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
              {t("dashboard.sitesEditor.contactMapsLinkHint")}
            </p>

            <LocationPicker
              open={showLocationPicker}
              onClose={() => setShowLocationPicker(false)}
              currentUrl={content.contact.maps_url}
              tileStyle={content.contact.map_tile_style}
              onSave={(url, tileStyle) => {
                updateField("contact", "maps_url", url);
                updateField("contact", "map_tile_style", tileStyle);
              }}
            />
          </div>
        </div>
      )}

      {/* FOOTER FORM */}
      {activeTab === "footer" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.footerTagline")}</label>
            <input
              id="field-footer.tagline"
              type="text"
              value={content.footer?.tagline || ""}
              onChange={(e) => updateField("footer", "tagline", e.target.value)}
              className={SIDEBAR_FIELD_CLASS}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.footerCopyright")}</label>
            <input
              id="field-footer.copyright_text"
              type="text"
              value={content.footer?.copyright_text || ""}
              onChange={(e) => updateField("footer", "copyright_text", e.target.value)}
              className={SIDEBAR_FIELD_CLASS}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.footerSocialLinks")}</label>
            {(content.footer?.social_links || []).map((link: any, idx: number) => {
              const isCustom = link.platform && !SOCIAL_PLATFORMS[link.platform];
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 w-8 justify-center">
                    {link.platform && SOCIAL_PLATFORMS[link.platform] ? (
                      <SocialIcon platform={link.platform} className="shrink-0" size={18} />
                    ) : (
                      <Globe className="w-4 h-4 text-sidebar-subtle-foreground shrink-0" />
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
                        placeholder={t("dashboard.sitesEditor.footerSocialPlatformName")}
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
                      placeholder={t("dashboard.sitesEditor.phSocialUrl")}
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
                    {t("dashboard.sitesEditor.commonRemove")}
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                const n = [...(content.footer?.social_links || []), { platform: "Instagram", url: "https://instagram.com/" }];
                updateField("footer", "social_links", n);
              }}
              className="w-full text-center py-1.5 text-[11px] font-semibold text-primary border border-dashed border-border rounded-md hover:border-primary/60 transition-colors"
            >
              {t("dashboard.sitesEditor.footerAddSocialLink")}
            </button>
          </div>
        </div>
      )}

      {/* SEO FORM */}
      {activeTab === "seo" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-[12px] leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">{t("dashboard.sitesEditor.seoNotPublicTitle")}</p>
            <p className="mt-1 text-muted-foreground">
              {t("dashboard.sitesEditor.seoNotPublicDesc")}
            </p>
          </div>

          {/* Meta Title + Char Count */}
          <div className="space-y-1">
            <SidebarField
              section="seo"
              fieldKey="title"
              label={t("dashboard.sitesEditor.seoMetaTitleLabel")}
              value={content.seo?.title || ""}
              onChange={(val) => updateField("seo", "title", val)}
              needsAttention={needsAttention("seo.title")}
              inputClassName={fieldClass("seo.title", "")}
              undoCount={fieldUndoStacks?.["seo.title"]?.length}
              onUndo={() => undoField?.("seo", "title")}
            />
            <div className="flex justify-end">
              <span className={`text-[10px] font-mono ${(content.seo?.title?.length || 0) > 60 ? "text-red-500" : "text-sidebar-subtle-foreground"}`}>
                {(content.seo?.title?.length || 0)}/60
              </span>
            </div>
          </div>

          {/* Meta Description + Char Count */}
          <div className="space-y-1">
            <SidebarField
              section="seo"
              fieldKey="description"
              multiline
              rows={3}
              label={t("dashboard.sitesEditor.seoMetaDescLabel")}
              value={content.seo?.description || ""}
              onChange={(val) => updateField("seo", "description", val)}
              needsAttention={needsAttention("seo.description")}
              inputClassName={fieldClass("seo.description", "")}
              undoCount={fieldUndoStacks?.["seo.description"]?.length}
              onUndo={() => undoField?.("seo", "description")}
            />
            <div className="flex justify-end">
              <span className={`text-[10px] font-mono ${(content.seo?.description?.length || 0) > 155 ? "text-red-500" : "text-sidebar-subtle-foreground"}`}>
                {(content.seo?.description?.length || 0)}/155
              </span>
            </div>
          </div>

          {/* Keywords Tags */}
          <KeywordsInput
            keywords={content.seo?.keywords || []}
            onChange={(keywords) => updateField("seo", "keywords", keywords)}
            aiLoading={aiLoadingField === "seo.keywords"}
            onAiGenerate={isPremium ? () => handleAiText("seo", "keywords", t("dashboard.sitesEditor.seoAiKeywordsPrompt"), t("dashboard.sitesEditor.seoKeywordsLabel")) : undefined}
            onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
          />

          {/* Favicon + OG Image row */}
          <FileUpload label={t("dashboard.sitesEditor.seoFaviconLabel")} value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} previewSize="icon" objectFit="contain" />
          <FileUpload label={t("dashboard.sitesEditor.seoOgImageLabel")} value={content.seo?.og_image_url || ""} onChange={(val) => updateField("seo", "og_image_url", val)} placeholder="https://..." maxWidth={1200} maxHeight={630} quality={0.85} previewSize="lg" />

          {/* ── Social Share Preview ── */}
          {(() => {
            const ogTitle = content.seo?.title || "";
            const ogDesc  = content.seo?.description || "";
            const ogImg   = content.seo?.og_image_url || "";
            const ogDomain = subdomain ? tenantHost(subdomain) : "namabisnis.webjoz.com";
            return (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.seoSharePreviewTitle")}</p>

                {/* WhatsApp / iMessage style */}
                <div className="rounded-xl overflow-hidden border border-border bg-[#1a1d26]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sidebar-muted border-b border-border/50">
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
                      <p className="text-[10px] text-sidebar-subtle-foreground truncate">{ogDomain}</p>
                      <p className={`text-[12px] font-semibold leading-tight line-clamp-2 ${ogTitle ? "text-sidebar-foreground" : "text-sidebar-subtle-foreground italic"}`}>
                        {ogTitle || t("dashboard.sitesEditor.seoSharePlaceholderTitle")}
                      </p>
                      <p className={`text-[10px] leading-tight line-clamp-2 ${ogDesc ? "text-sidebar-muted-foreground" : "text-sidebar-subtle-foreground italic"}`}>
                        {ogDesc || t("dashboard.sitesEditor.seoSharePlaceholderDesc")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Facebook style */}
                <div className="rounded-xl overflow-hidden border border-border bg-[#1a1d26]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sidebar-muted border-b border-border/50">
                    <span className="text-[10px] font-bold text-blue-400">👍 Facebook / LinkedIn</span>
                  </div>
                  <div className="w-full aspect-[1.91/1] bg-[#111318] relative overflow-hidden">
                    {ogImg ? (
                      <img src={ogImg} alt="OG" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <span className="text-[28px] opacity-20">🖼️</span>
                        <p className="text-[10px] text-sidebar-subtle-foreground italic">{t("dashboard.sitesEditor.seoShareOgNotSet")}</p>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2 space-y-0.5 bg-[#232630]">
                    <p className="text-[9px] uppercase tracking-widest text-sidebar-subtle-foreground truncate">{ogDomain}</p>
                    <p className={`text-[12px] font-bold leading-snug line-clamp-2 ${ogTitle ? "text-sidebar-foreground" : "text-sidebar-subtle-foreground italic"}`}>
                      {ogTitle || t("dashboard.sitesEditor.seoSharePlaceholderTitle")}
                    </p>
                    <p className={`text-[10px] leading-snug line-clamp-2 ${ogDesc ? "text-sidebar-muted-foreground" : "text-sidebar-subtle-foreground italic"}`}>
                      {ogDesc || t("dashboard.sitesEditor.seoSharePlaceholderDesc")}
                    </p>
                  </div>
                </div>

                {/* Twitter/X style */}
                <div className="rounded-xl overflow-hidden border border-border bg-[#1a1d26]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sidebar-muted border-b border-border/50">
                    <span className="text-[10px] font-bold text-sidebar-foreground">𝕏 Twitter / X</span>
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
                      <p className={`text-[11px] font-semibold leading-tight truncate ${ogTitle ? "text-white" : "text-sidebar-subtle-foreground italic"}`}>
                        {ogTitle || t("dashboard.sitesEditor.seoSharePlaceholderTitle")}
                      </p>
                      <p className="text-[9px] text-sidebar-muted-foreground truncate">{ogDomain}</p>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-sidebar-subtle-foreground text-center">{t("dashboard.sitesEditor.seoShareAutoUpdate")}</p>
              </div>
            );
          })()}

          {/* OG Type Dropdown */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.seoOgTypeLabel")}</span>
              <AiFieldButton
                loading={aiLoadingField === "seo.og_type"}
                onGenerate={() => handleAiText("seo", "og_type", t("dashboard.sitesEditor.seoAiOgTypePrompt"), "OG Type")}
                title={t("dashboard.sitesEditor.seoAiOgTypeBtn")}
                onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
              />
            </label>
            <CustomSelect
              value={content.seo?.og_type || "website"}
              onChange={(val) => updateField("seo", "og_type", val)}
              size="sm"
              triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
              options={[
                { value: "website", label: t("dashboard.sitesEditor.seoOgTypeWebsite") },
                { value: "article", label: t("dashboard.sitesEditor.seoOgTypeArticle") },
                { value: "product", label: t("dashboard.sitesEditor.seoOgTypeProduct") },
                { value: "profile", label: t("dashboard.sitesEditor.seoOgTypeProfile") },
                { value: "business", label: t("dashboard.sitesEditor.seoOgTypeBusiness") },
              ]}
            />
          </div>

          {/* Twitter Card Dropdown */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.seoTwitterCardLabel")}</span>
              <AiFieldButton
                loading={aiLoadingField === "seo.twitter_card"}
                onGenerate={() => handleAiText("seo", "twitter_card", t("dashboard.sitesEditor.seoAiTwitterCardPrompt"), "Twitter Card")}
                title={t("dashboard.sitesEditor.seoAiTwitterCardBtn")}
                onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
              />
            </label>
            <CustomSelect
              value={content.seo?.twitter_card || "summary_large_image"}
              onChange={(val) => updateField("seo", "twitter_card", val)}
              size="sm"
              triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
              options={[
                { value: "summary_large_image", label: "summary_large_image" },
                { value: "summary", label: "summary" },
                { value: "app", label: "app" },
                { value: "player", label: "player" },
              ]}
            />
          </div>

          {/* Robots Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.seoRobotsLabel")}</label>
            <CustomSelect
              value={content.seo?.robots || "index, follow"}
              onChange={(val) => updateField("seo", "robots", val)}
              size="sm"
              triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
              options={[
                { value: "index, follow", label: t("dashboard.sitesEditor.seoRobotsIndexFollow") },
                { value: "noindex, follow", label: t("dashboard.sitesEditor.seoRobotsNoindexFollow") },
                { value: "index, nofollow", label: t("dashboard.sitesEditor.seoRobotsIndexNofollow") },
                { value: "noindex, nofollow", label: t("dashboard.sitesEditor.seoRobotsNoindexNofollow") },
              ]}
            />
          </div>

          {/* OG Locale */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.seoOgLocaleLabel")}</label>
            <input
              type="text"
              value={content.seo?.og_locale || "id_ID"}
              onChange={(e) => updateField("seo", "og_locale", e.target.value)}
              className={SIDEBAR_FIELD_CLASS}
              placeholder="id_ID"
            />
          </div>

          {/* OG Site Name */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.seoOgSiteNameLabel")}</label>
            <input
              type="text"
              value={content.seo?.og_site_name || ""}
              onChange={(e) => updateField("seo", "og_site_name", e.target.value)}
              className={SIDEBAR_FIELD_CLASS}
              placeholder={t("dashboard.sitesEditor.seoOgSiteNamePlaceholder")}
            />
          </div>

          {/* Canonical Path */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.seoCanonicalPathLabel")}</label>
            <input
              type="text"
              value={content.seo?.canonical_path || "/"}
              onChange={(e) => updateField("seo", "canonical_path", e.target.value)}
              className={`${SIDEBAR_FIELD_CLASS} text-sidebar-foreground`}
              placeholder="/"
            />
          </div>

          {/* Custom Robots.txt (Pro) */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span className="flex items-center gap-1.5">
                {t("dashboard.sitesEditor.seoRobotsTxtTitle")}
                {!isPremium && <span className="text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/30">Pro</span>}
              </span>
            </label>
            {isPremium ? (
              <textarea
                rows={5}
                value={content.seo?.custom_robots_txt || ""}
                onChange={(e) => updateField("seo", "custom_robots_txt", e.target.value)}
                className="w-full px-2.5 py-1.5 border rounded-md text-[11px] font-mono outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground resize-none"
                placeholder={`User-agent: *\nAllow: /\n\nSitemap: https://${subdomain ? tenantHost(subdomain) : "namabisnis.webjoz.com"}/sitemap.xml`}
              />
            ) : (
              <div
                className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-[11px] text-sidebar-subtle-foreground cursor-pointer hover:border-amber-500/30 transition-colors"
                onClick={() => onUpgradeRequired?.()}
              >
                <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                  <Lock className="w-3 h-3" />
                  {t("dashboard.sitesEditor.seoRobotsTxtLockedTitle")}
                </div>
                <p>{t("dashboard.sitesEditor.seoRobotsTxtLockedDesc")}</p>
              </div>
            )}
          </div>

          {/* ── SEO Booster Upsell Card ── */}
          {isPremium ? (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-[12px] leading-relaxed">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                {t("dashboard.sitesEditor.seoBoosterActiveTitle")}
              </div>
              <p className="mt-1 text-muted-foreground">
                {t("dashboard.sitesEditor.seoBoosterActiveDesc")}
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
              isOpen: true,
            };

            return (
              <div className="rounded-2xl border border-amber-500/20 bg-black/60 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Search className="w-4 h-4 text-amber-400" />
                    <span>{t("dashboard.sitesEditor.seoBoosterProTitle")}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
                    Premium
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 p-5">
                  <div>
                    <p className="text-xs font-bold text-sidebar-subtle-foreground mb-2">{t("dashboard.sitesEditor.seoBoosterWithout")}</p>
                    <div className="opacity-60 grayscale-[30%]">
                      <GoogleSnippetPreview variant="plain" business={demoBusiness} />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                      ✨ Rich Result
                    </div>
                    <p className="text-xs font-bold text-primary mb-2">{t("dashboard.sitesEditor.seoBoosterWith")}</p>
                    <GoogleSnippetPreview variant="rich" business={demoBusiness} />
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <p className="text-xs text-amber-200/70 text-center mb-2">
                    {t("dashboard.sitesEditor.seoBoosterCompetitor")}
                  </p>
                  <button
                    type="button"
                    onClick={() => onUpgradeRequired?.()}
                    className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {t("dashboard.sitesEditor.seoBoosterUpgradeBtn")}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ── Google Search Console ── */}
          <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
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
                    <p className="text-[13px] font-bold text-sidebar-foreground">{t("dashboard.sitesEditor.seoGscTitle")}</p>
                    <p className="text-[11px] text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.seoGscSubtitle")}</p>
                  </div>
                </div>
                {!isPremium && (
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Pro</span>
                )}
              </div>

              {/* How-to steps */}
              <div className="rounded-lg bg-muted/40 border border-border/50 px-3 py-2.5 space-y-1.5 text-[11px] text-sidebar-muted-foreground">
                <p className="font-semibold text-sidebar-foreground">{t("dashboard.sitesEditor.seoGscHowToTitle")}</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>{t("dashboard.sitesEditor.seoGscStep1")} (<a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Search Console</a>)</li>
                  <li>{t("dashboard.sitesEditor.seoGscStep2")}</li>
                  <li>{t("dashboard.sitesEditor.seoGscStep3")}</li>
                  <li>{t("dashboard.sitesEditor.seoGscStep4")}</li>
                  <li>{t("dashboard.sitesEditor.seoGscStep5")}</li>
                </ol>
              </div>

              {/* Meta tag preview */}
              {gscInput.trim() && (
                <div className="rounded-md bg-background border border-border/50 px-3 py-2 font-mono text-[10px] text-sidebar-muted-foreground break-all">
                  {'<meta name="google-site-verification" content="'}<span className="text-emerald-400">{gscInput.trim()}</span>{'" />'}
                </div>
              )}

              {/* Input + save button */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gscInput}
                  onChange={(e) => setGscInput(e.target.value)}
                  placeholder={t("dashboard.sitesEditor.seoGscPlaceholder")}
                  className="flex-1 px-2.5 py-1.5 border border-border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground placeholder-sidebar-subtle-foreground"
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
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {t("dashboard.sitesEditor.seoGscSaving")}</>
                  ) : gscSaved ? (
                    <><Check className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.seoGscSaved")}</>
                  ) : (
                    t("dashboard.sitesEditor.seoGscSaveBtn")
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
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.testimonialsEyebrow")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
              {renderFieldActions("testimonials", "eyebrow")}
            </label>
            <input type="text" value={content.testimonials?.eyebrow || ""} onChange={(e) => updateField("testimonials", "eyebrow", e.target.value)} placeholder={t("dashboard.sitesEditor.phTestimonialsEyebrow")} className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`} />
          </div>
          <SidebarField
            section="testimonials"
            fieldKey="title"
            label={t("dashboard.sitesEditor.testimonialsSectionTitle")}
            value={content.testimonials?.title || ""}
            onChange={(val) => updateField("testimonials", "title", val)}
            placeholder={t("dashboard.sitesEditor.phTestimonialsSectionTitle")}
            undoCount={fieldUndoStacks?.["testimonials.title"]?.length}
            onUndo={() => undoField?.("testimonials", "title")}
          />
          <SidebarField
            section="testimonials"
            fieldKey="subtitle"
            label={t("dashboard.sitesEditor.testimonialsSubtitle")}
            value={content.testimonials?.subtitle || ""}
            onChange={(val) => updateField("testimonials", "subtitle", val)}
            placeholder={t("dashboard.sitesEditor.phTestimonialsSubtitle")}
            undoCount={fieldUndoStacks?.["testimonials.subtitle"]?.length}
            onUndo={() => undoField?.("testimonials", "subtitle")}
          />
          {(content.testimonials?.items || []).map((item: any, idx: number) => (
            <div key={idx} className="border border-border p-3 rounded-xl space-y-2.5 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.testimonialsItem")} #{idx + 1}</span>
                <button type="button" onClick={() => { const n = content.testimonials.items.filter((_: any, i: number) => i !== idx); updateField("testimonials", "items", n); }} className="text-red-400/70 hover:text-red-400 text-[11px] cursor-pointer">{t("dashboard.sitesEditor.commonRemove")}</button>
              </div>
              <SidebarField
                section="testimonials"
                fieldKey={`items.${idx}.quote`}
                multiline
                rows={2}
                label={t("dashboard.sitesEditor.testimonialsQuote")}
                value={item.quote || ""}
                onChange={(val) => {
                  const n = [...content.testimonials.items];
                  n[idx] = { ...n[idx], quote: val };
                  updateField("testimonials", "items", n);
                }}
                placeholder={t("dashboard.sitesEditor.phTestimonialsQuote")}
              />
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">{t("dashboard.sitesEditor.testimonialsName")}</label>
                  <input type="text" value={item.name || ""} onChange={(e) => { const n = [...content.testimonials.items]; n[idx] = { ...n[idx], name: e.target.value }; updateField("testimonials", "items", n); }} placeholder={t("dashboard.sitesEditor.phTestimonialsName")} className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">{t("dashboard.sitesEditor.testimonialsRole")}</label>
                  <input type="text" value={item.role || ""} onChange={(e) => { const n = [...content.testimonials.items]; n[idx] = { ...n[idx], role: e.target.value }; updateField("testimonials", "items", n); }} placeholder={t("dashboard.sitesEditor.phTestimonialsRole")} className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">{t("dashboard.sitesEditor.testimonialsAvatarInitials")}</label>
                  <input type="text" maxLength={2} value={item.avatar_initials || ""} onChange={(e) => { const n = [...content.testimonials.items]; n[idx] = { ...n[idx], avatar_initials: e.target.value.toUpperCase().slice(0, 2) }; updateField("testimonials", "items", n); }} placeholder="BS" className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground uppercase`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">{t("dashboard.sitesEditor.testimonialsAvatarColor")}</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-md border border-border overflow-hidden flex-shrink-0">
                      <input type="color" value={item.avatar_color || "var(--primary)"} onChange={(e) => { const n = [...content.testimonials.items]; n[idx] = { ...n[idx], avatar_color: e.target.value }; updateField("testimonials", "items", n); }} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                      <div className="w-full h-full" style={{ backgroundColor: item.avatar_color || "var(--primary)" }} />
                    </div>
                    <input type="text" value={item.avatar_color || ""} onChange={(e) => { const n = [...content.testimonials.items]; n[idx] = { ...n[idx], avatar_color: e.target.value }; updateField("testimonials", "items", n); }} placeholder="var(--primary)" className="flex-1 px-2.5 py-1.5 border border-border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground placeholder-sidebar-subtle-foreground" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">{t("dashboard.sitesEditor.testimonialsCompany")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></label>
                  <input type="text" value={item.company || ""} onChange={(e) => { const n = [...content.testimonials.items]; n[idx] = { ...n[idx], company: e.target.value }; updateField("testimonials", "items", n); }} placeholder={t("dashboard.sitesEditor.phTestimonialsCompany")} className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground block mb-1">{t("dashboard.sitesEditor.testimonialsLogoUrl")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.testimonialsLogoUrlHint")}</span></label>
                  <input type="text" value={item.logo_url || ""} onChange={(e) => { const n = [...content.testimonials.items]; n[idx] = { ...n[idx], logo_url: e.target.value }; updateField("testimonials", "items", n); }} placeholder="https://..." className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => { const current = content.testimonials?.items || []; updateField("testimonials", "items", [...current, { quote: "Pelayanan sangat memuaskan, ramah, dan hasilnya melebihi ekspektasi!", name: "Nama Pelanggan", role: "Pelanggan", avatar_initials: "NP", avatar_color: "var(--primary)", company: "", logo_url: "" }]); }} className="w-full text-[12px] py-2 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.testimonialsAddItem")}
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
            sectionTitle={t("dashboard.sitesKatalog.sectionTitleMenu")}
            itemLabel={t("dashboard.sitesKatalog.itemLabelMenu")}
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

          <div className="pt-2 mt-2 border-t border-border">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground mb-2">
              {t("dashboard.sitesKatalog.paymentTitle", "Metode Pembayaran & Pengiriman")}
            </p>
            {renderPaymentShippingForm()}
          </div>
        </>
      )}

      {/* GALLERY FORM */}
      {activeTab === "gallery" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary mb-1">
            <p className="font-semibold text-primary">📸 {t("dashboard.sitesEditor.gallerySectionBanner")}</p>
            <p className="mt-1 text-primary/80">{t("dashboard.sitesEditor.gallerySectionBannerDesc2")}</p>
          </div>
          <SidebarField
            section="gallery"
            fieldKey="title"
            label={t("dashboard.sitesEditor.galleryTitle")}
            value={content.gallery?.title || ""}
            onChange={(val) => updateField("gallery", "title", val)}
            needsAttention={needsAttention("gallery.title")}
            inputClassName={fieldClass("gallery.title", "")}
            placeholder={t("dashboard.sitesEditor.phGalleryTitle")}
            undoCount={fieldUndoStacks?.["gallery.title"]?.length}
            onUndo={() => undoField?.("gallery", "title")}
          />
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.galleryEyebrow")}</span>
              {renderFieldActions("gallery", "eyebrow")}
            </label>
            <input
              id="field-gallery.eyebrow"
              type="text" value={content.gallery?.eyebrow || ""}
              onChange={(e) => updateField("gallery", "eyebrow", e.target.value)}
              className={SIDEBAR_FIELD_CLASS}
              placeholder={t("dashboard.sitesEditor.phGalleryEyebrow")}
            />
          </div>

          {/* Layout Picker */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.galleryLayout")}</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "grid",     label: t("dashboard.sitesEditor.galleryLayoutGrid"),     desc: t("dashboard.sitesEditor.galleryLayoutGridDesc") },
                { value: "masonry",  label: t("dashboard.sitesEditor.galleryLayoutMasonry"),  desc: t("dashboard.sitesEditor.galleryLayoutMasonryDesc") },
                { value: "carousel", label: t("dashboard.sitesEditor.galleryLayoutCarousel"), desc: t("dashboard.sitesEditor.galleryLayoutCarouselDesc") },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("gallery", "layout", opt.value)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    (content.gallery?.layout || "grid") === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-sidebar-muted-foreground hover:border-border"
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
            <div className="space-y-3 p-3 rounded-xl border border-border/50 bg-muted/30">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.galleryCarouselSettingsLabel")}</span>
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.galleryAutoplaySpeed")}</label>
                <input
                  type="number" min={1000} max={15000} step={500}
                  value={content.gallery?.autoplay_speed ?? 4000}
                  onChange={(e) => updateField("gallery", "autoplay_speed", parseInt(e.target.value) || 4000)}
                  className={SIDEBAR_FIELD_CLASS}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.gallery?.show_dots ?? true}
                  onChange={(e) => updateField("gallery", "show_dots", e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-[11px] font-medium text-sidebar-muted-foreground">{t("dashboard.sitesEditor.galleryShowDots")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.gallery?.show_arrows ?? true}
                  onChange={(e) => updateField("gallery", "show_arrows", e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-[11px] font-medium text-sidebar-muted-foreground">{t("dashboard.sitesEditor.galleryShowArrows")}</span>
              </label>
            </div>
          )}

          {/* Gallery Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.galleryItems")} ({content.gallery?.items?.length || 0})</span>
              <button
                type="button"
                onClick={() => {
                  const next = [...(content.gallery?.items || []), { image_url: "", caption: "", alt_text: "" }];
                  updateField("gallery", "items", next);
                }}
                className="text-[12px] py-1.5 px-3 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.galleryAddItem")}
              </button>
            </div>
            {(content.gallery?.items || []).map((item: any, idx: number) => (
              <div key={idx} className="mb-3 p-4 rounded-xl border border-border/50 bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-sidebar-subtle-foreground font-medium">{t("dashboard.sitesEditor.galleryItem")} #{idx + 1}</span>
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
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.commonImageUrl")}</label>
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
                    <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.commonCaption")}</label>
                  <input
                    type="text" value={item.caption || ""}
                    onChange={(e) => {
                      const next = [...(content.gallery?.items || [])];
                      next[idx] = { ...next[idx], caption: e.target.value };
                      updateField("gallery", "items", next);
                    }}
                    className={SIDEBAR_FIELD_CLASS}
                    placeholder={t("dashboard.sitesEditor.phGalleryCaption")}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.commonAltText")}</label>
                  <input
                    type="text" value={item.alt_text || ""}
                    onChange={(e) => {
                      const next = [...(content.gallery?.items || [])];
                      next[idx] = { ...next[idx], alt_text: e.target.value };
                      updateField("gallery", "items", next);
                    }}
                    className={SIDEBAR_FIELD_CLASS}
                    placeholder={t("dashboard.sitesEditor.phGalleryAltText")}
                  />
                </div>
              </div>
            ))}
            {(!content.gallery?.items || content.gallery.items.length === 0) && (
              <button
                type="button"
                onClick={() => updateField("gallery", "items", [{ image_url: "", caption: "", alt_text: "" }])}
                className="w-full text-[12px] py-2 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.galleryAddFirst")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* WORKS FORM */}
      {activeTab === "works" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary mb-1">
            <p className="font-semibold text-primary">💼 {t("dashboard.sitesEditor.worksSectionBanner")}</p>
            <p className="mt-1 text-primary/80">{t("dashboard.sitesEditor.worksSectionBannerDesc")}</p>
          </div>
          <SidebarField
            section="works"
            fieldKey="title"
            label={t("dashboard.sitesEditor.worksTitle")}
            value={content.works?.title || ""}
            onChange={(val) => updateField("works", "title", val)}
            needsAttention={needsAttention("works.title")}
            inputClassName={fieldClass("works.title", "")}
            placeholder={t("dashboard.sitesEditor.phWorksTitle")}
            undoCount={fieldUndoStacks?.["works.title"]?.length}
            onUndo={() => undoField?.("works", "title")}
          />
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              <span>{t("dashboard.sitesEditor.worksEyebrow")}</span>
              {renderFieldActions("works", "eyebrow")}
            </label>
            <input id="field-works.eyebrow" type="text" value={content.works?.eyebrow || ""} onChange={(e) => updateField("works", "eyebrow", e.target.value)} className={SIDEBAR_FIELD_CLASS} placeholder="PORTFOLIO" />
          </div>
          <SidebarField
            section="works"
            fieldKey="subtitle"
            multiline
            rows={2}
            label={t("dashboard.sitesEditor.worksSubtitle")}
            value={content.works?.subtitle || ""}
            onChange={(val) => updateField("works", "subtitle", val)}
            placeholder={t("dashboard.sitesEditor.phWorksSubtitle")}
          />
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.worksLayout")}</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "grid", label: t("dashboard.sitesEditor.worksLayoutGrid"), desc: t("dashboard.sitesEditor.worksLayoutGridDesc") },
                { value: "masonry", label: t("dashboard.sitesEditor.worksLayoutMasonry"), desc: t("dashboard.sitesEditor.worksLayoutMasonryDesc") },
                { value: "featured-grid", label: t("dashboard.sitesEditor.worksLayoutFeaturedGrid"), desc: t("dashboard.sitesEditor.worksLayoutFeaturedGridDesc") },
                { value: "showcase-featured", label: t("dashboard.sitesEditor.worksLayoutShowcase"), desc: t("dashboard.sitesEditor.worksLayoutShowcaseDesc") },
              ] as const).map((opt) => (
                <button key={opt.value} type="button" onClick={() => updateField("works", "layout", opt.value)} className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${ (content.works?.layout || "grid") === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border text-sidebar-muted-foreground hover:border-border" }`}>
                  <div className="text-[11px] font-semibold">{opt.label}</div>
                  <div className="text-[9px] opacity-60">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.worksItems")} ({content.works?.items?.length || 0})</span>
              <button type="button" onClick={() => { const existingWorks = content.works?.items || []; const next = [...existingWorks, { title: `Proyek ${existingWorks.length + 1}`, category: "", year: new Date().getFullYear().toString(), client: "", description: "Deskripsi proyek ini", image_url: "", project_url: "", alt_text: "" }]; updateField("works", "items", next); }} className="text-[12px] py-1.5 px-3 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center gap-1.5 cursor-pointer transition-colors">
                <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.worksAddItem")}
              </button>
            </div>
            {(content.works?.items || []).map((item: any, idx: number) => (
              <div key={idx} className="mb-3 p-4 rounded-xl border border-border/50 bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-sidebar-subtle-foreground font-medium">{t("dashboard.sitesEditor.worksItem")} #{idx + 1}</span>
                  <button type="button" onClick={() => { const next = (content.works?.items || []).filter((_: any, i: number) => i !== idx); updateField("works", "items", next); }} className="text-red-400 hover:text-red-300 transition-colors p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.worksItemTitle")}</label>
                  <input type="text" value={item.title || ""} onChange={(e) => { const next = [...(content.works?.items || [])]; next[idx] = { ...next[idx], title: e.target.value }; updateField("works", "items", next); }} className={SIDEBAR_FIELD_CLASS} placeholder={t("dashboard.sitesEditor.phWorksItemTitle")} />
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.commonCategory")}</label>
                    <input list="works-category-suggestions" value={item.category || ""} onChange={(e) => { const next = [...(content.works?.items || [])]; next[idx] = { ...next[idx], category: e.target.value }; updateField("works", "items", next); }} className={SIDEBAR_FIELD_CLASS} placeholder="Branding" />
                    <datalist id="works-category-suggestions"><option value="Branding" /><option value="Photography" /><option value="Design" /><option value="Video" /><option value="Consulting" /><option value="Portfolio" /><option value="Freelance" /><option value="Agency" /><option value="Studio" /></datalist>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.commonYear")}</label>
                    <input type="text" value={item.year || ""} onChange={(e) => { const next = [...(content.works?.items || [])]; next[idx] = { ...next[idx], year: e.target.value }; updateField("works", "items", next); }} className={SIDEBAR_FIELD_CLASS} placeholder="2025" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.commonClientLabel")}</label>
                    <input type="text" value={item.client || ""} onChange={(e) => { const next = [...(content.works?.items || [])]; next[idx] = { ...next[idx], client: e.target.value }; updateField("works", "items", next); }} className={SIDEBAR_FIELD_CLASS} placeholder={t("dashboard.sitesEditor.phWorksClient")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.commonProjectLink")}</label>
                    <input type="text" value={item.project_url || ""} onChange={(e) => { const next = [...(content.works?.items || [])]; next[idx] = { ...next[idx], project_url: e.target.value }; updateField("works", "items", next); }} className={`${SIDEBAR_FIELD_CLASS} font-mono`} placeholder="https://..." />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.worksDescription")}</label>
                  <textarea rows={2} value={item.description || ""} onChange={(e) => { const next = [...(content.works?.items || [])]; next[idx] = { ...next[idx], description: e.target.value }; updateField("works", "items", next); }} className={`${SIDEBAR_FIELD_CLASS} resize-none`} placeholder={t("dashboard.sitesEditor.phWorksDescription")} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.commonImageUrl")}</label>
                  <div className="flex gap-2">
                    <input type="text" value={item.image_url || ""} onChange={(e) => { const next = [...(content.works?.items || [])]; next[idx] = { ...next[idx], image_url: e.target.value }; updateField("works", "items", next); }} className="flex-1 px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent font-mono" placeholder="https://images.unsplash.com/..." />
                  </div>
                  {item.image_url && (<div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-border"><img src={item.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div>)}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">{t("dashboard.sitesEditor.commonAltText")}</label>
                  <input type="text" value={item.alt_text || ""} onChange={(e) => { const next = [...(content.works?.items || [])]; next[idx] = { ...next[idx], alt_text: e.target.value }; updateField("works", "items", next); }} className={SIDEBAR_FIELD_CLASS} placeholder={t("dashboard.sitesEditor.phWorksAltText")} />
                </div>
              </div>
            ))}
            {(!content.works?.items || content.works.items.length === 0) && (
              <button type="button" onClick={() => updateField("works", "items", [{ title: "", category: "", year: "", client: "", description: "", image_url: "", project_url: "", alt_text: "" }])} className="w-full text-[12px] py-2 border border-dashed border-border rounded-xl text-sidebar-subtle-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesEditor.worksAddFirst")}
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
            sectionTitle={t("dashboard.sitesKatalog.sectionTitleCatalog")}
            itemLabel={t("dashboard.sitesKatalog.itemLabelCatalog")}
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

          <div className="pt-2 mt-2 border-t border-border">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground mb-2">
              {t("dashboard.sitesKatalog.paymentTitle", "Metode Pembayaran & Pengiriman")}
            </p>
            {renderPaymentShippingForm()}
          </div>
        </>
      )}

      {/* STATS FORM */}
      {activeTab === "stats" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
            <p className="font-semibold text-primary">📈 Section Statistik & Pencapaian</p>
            <p className="mt-1 text-primary/80">
              Tampilkan angka pencapaian, jumlah subscriber, kepuasan klien, atau metrik kunci untuk membangun kredibilitas instan.
            </p>
          </div>

          <div className="space-y-3">
            <SidebarField
              section="stats"
              fieldKey="eyebrow"
              label="Eyebrow (Label Atas)"
              value={content.stats?.eyebrow || ""}
              onChange={(val) => updateField("stats", "eyebrow", val)}
              placeholder={t("dashboard.sitesEditor.phStatsEyebrow")}
              undoCount={fieldUndoStacks?.["stats.eyebrow"]?.length}
              onUndo={() => undoField?.("stats", "eyebrow")}
            />
            <SidebarField
              section="stats"
              fieldKey="title"
              label="Judul Section"
              value={content.stats?.title || ""}
              onChange={(val) => updateField("stats", "title", val)}
              placeholder={t("dashboard.sitesEditor.phStatsSectionTitle")}
              undoCount={fieldUndoStacks?.["stats.title"]?.length}
              onUndo={() => undoField?.("stats", "title")}
            />
            <SidebarField
              section="stats"
              fieldKey="subtitle"
              label="Subjudul (Opsional)"
              value={content.stats?.subtitle || ""}
              onChange={(val) => updateField("stats", "subtitle", val)}
              placeholder={t("dashboard.sitesEditor.phStatsSubtitle")}
              undoCount={fieldUndoStacks?.["stats.subtitle"]?.length}
              onUndo={() => undoField?.("stats", "subtitle")}
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Daftar Angka / Metrik</label>
              <button
                type="button"
                onClick={() => {
                  const items = [...(content.stats?.items || []), { value: "100+", label: "Metrik Baru", description: "", icon: "TrendingUp" }];
                  updateField("stats", "items", items);
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Metrik
              </button>
            </div>

            {(content.stats?.items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-3 border border-border rounded-xl space-y-2.5 bg-muted/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-sidebar-subtle-foreground">Metrik #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const items = (content.stats?.items || []).filter((_: any, i: number) => i !== idx);
                      updateField("stats", "items", items);
                    }}
                    className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Angka / Value</label>
                    <input
                      type="text"
                      value={item.value || ""}
                      onChange={(e) => {
                        const items = [...(content.stats?.items || [])];
                        items[idx] = { ...items[idx], value: e.target.value };
                        updateField("stats", "items", items);
                      }}
                      placeholder={t("dashboard.sitesEditor.phStatsValue")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Label</label>
                    <input
                      type="text"
                      value={item.label || ""}
                      onChange={(e) => {
                        const items = [...(content.stats?.items || [])];
                        items[idx] = { ...items[idx], label: e.target.value };
                        updateField("stats", "items", items);
                      }}
                      placeholder={t("dashboard.sitesEditor.phStatsLabel")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Ikon</label>
                    <IconPicker
                      value={item.icon || "TrendingUp"}
                      onChange={(iconName) => {
                        const items = [...(content.stats?.items || [])];
                        items[idx] = { ...items[idx], icon: iconName };
                        updateField("stats", "items", items);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Keterangan (Opsional)</label>
                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) => {
                        const items = [...(content.stats?.items || [])];
                        items[idx] = { ...items[idx], description: e.target.value };
                        updateField("stats", "items", items);
                      }}
                      placeholder={t("dashboard.sitesEditor.phStatsDescription")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARTNERS FORM */}
      {activeTab === "partners" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
            <p className="font-semibold text-primary">🤝 Section Mitra & Klien</p>
            <p className="mt-1 text-primary/80">
              Tampilkan logo atau nama brand yang pernah bekerja sama, klien utama, atau media yang meliput.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Eyebrow</label>
              <input
                type="text"
                value={content.partners?.eyebrow || ""}
                onChange={(e) => updateField("partners", "eyebrow", e.target.value)}
                placeholder={t("dashboard.sitesEditor.phPartnersEyebrow")}
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Judul Section</label>
              <input
                type="text"
                value={content.partners?.title || ""}
                onChange={(e) => updateField("partners", "title", e.target.value)}
                placeholder={t("dashboard.sitesEditor.phPartnersSectionTitle")}
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Subjudul (Opsional)</label>
              <input
                type="text"
                value={content.partners?.subtitle || ""}
                onChange={(e) => updateField("partners", "subtitle", e.target.value)}
                placeholder={t("dashboard.sitesEditor.phPartnersSubtitle")}
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground`}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Daftar Mitra / Brand</label>
              <button
                type="button"
                onClick={() => {
                  const items = [...(content.partners?.items || []), { name: "Nama Brand", category: "", url: null, logo_url: null }];
                  updateField("partners", "items", items);
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Mitra
              </button>
            </div>

            {(content.partners?.items || []).map((partner: any, idx: number) => (
              <div key={idx} className="p-3 border border-border rounded-xl space-y-2 bg-muted/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-sidebar-subtle-foreground">Mitra #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const items = (content.partners?.items || []).filter((_: any, i: number) => i !== idx);
                      updateField("partners", "items", items);
                    }}
                    className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Nama Brand / Mitra</label>
                    <input
                      type="text"
                      value={partner.name || ""}
                      onChange={(e) => {
                        const items = [...(content.partners?.items || [])];
                        items[idx] = { ...items[idx], name: e.target.value };
                        updateField("partners", "items", items);
                      }}
                      placeholder={t("dashboard.sitesEditor.phPartnersBrandName")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Kategori / Industri</label>
                    <input
                      type="text"
                      value={partner.category || ""}
                      onChange={(e) => {
                        const items = [...(content.partners?.items || [])];
                        items[idx] = { ...items[idx], category: e.target.value };
                        updateField("partners", "items", items);
                      }}
                      placeholder={t("dashboard.sitesEditor.phPartnersCategory")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Tautan Website (Opsional)</label>
                  <input
                    type="text"
                    value={partner.url || ""}
                    onChange={(e) => {
                      const items = [...(content.partners?.items || [])];
                      items[idx] = { ...items[idx], url: e.target.value || null };
                      updateField("partners", "items", items);
                    }}
                    placeholder="https://example.com"
                    className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRICING FORM */}
      {activeTab === "pricing" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
            <p className="font-semibold text-primary">💳 Section Paket Harga & Rate Card</p>
            <p className="mt-1 text-primary/80">
              Atur paket layanan, rate card kolaborasi, atau tier langganan dengan perbandingan fitur yang jelas.
            </p>
          </div>

          <div className="space-y-3">
            <SidebarField
              section="pricing"
              fieldKey="eyebrow"
              label="Eyebrow"
              value={content.pricing?.eyebrow || ""}
              onChange={(val) => updateField("pricing", "eyebrow", val)}
              placeholder={t("dashboard.sitesEditor.phPricingEyebrow")}
              undoCount={fieldUndoStacks?.["pricing.eyebrow"]?.length}
              onUndo={() => undoField?.("pricing", "eyebrow")}
            />
            <SidebarField
              section="pricing"
              fieldKey="title"
              label="Judul Section"
              value={content.pricing?.title || ""}
              onChange={(val) => updateField("pricing", "title", val)}
              placeholder={t("dashboard.sitesEditor.phPricingSectionTitle")}
              undoCount={fieldUndoStacks?.["pricing.title"]?.length}
              onUndo={() => undoField?.("pricing", "title")}
            />
            <SidebarField
              section="pricing"
              fieldKey="subtitle"
              label="Subjudul (Opsional)"
              value={content.pricing?.subtitle || ""}
              onChange={(val) => updateField("pricing", "subtitle", val)}
              placeholder={t("dashboard.sitesEditor.phPricingSubtitle")}
              undoCount={fieldUndoStacks?.["pricing.subtitle"]?.length}
              onUndo={() => undoField?.("pricing", "subtitle")}
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">Daftar Paket</label>
              <button
                type="button"
                onClick={() => {
                  const plans = [...(content.pricing?.plans || []), {
                    name: "Paket Baru",
                    price: "Rp 1.000.000",
                    period: "/proyek",
                    description: "Deskripsi paket",
                    features: ["Fitur 1", "Fitur 2"],
                    cta_text: "Pilih Paket",
                    cta_url: "#contact",
                    is_featured: false,
                    badge: null,
                  }];
                  updateField("pricing", "plans", plans);
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Paket
              </button>
            </div>

            {(content.pricing?.plans || []).map((plan: any, idx: number) => (
              <div key={idx} className="p-3.5 border border-border rounded-xl space-y-3 bg-muted/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-sidebar-foreground">Paket #{idx + 1}: {plan.name || "Tanpa Nama"}</span>
                    {plan.is_featured && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-extrabold">FEATURED</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const plans = (content.pricing?.plans || []).filter((_: any, i: number) => i !== idx);
                      updateField("pricing", "plans", plans);
                    }}
                    className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Nama Paket</label>
                    <input
                      type="text"
                      value={plan.name || ""}
                      onChange={(e) => {
                        const plans = [...(content.pricing?.plans || [])];
                        plans[idx] = { ...plans[idx], name: e.target.value };
                        updateField("pricing", "plans", plans);
                      }}
                      placeholder={t("dashboard.sitesEditor.phPricingPlanName")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Badge (cth. Terpopuler)</label>
                    <input
                      type="text"
                      value={plan.badge || ""}
                      onChange={(e) => {
                        const plans = [...(content.pricing?.plans || [])];
                        plans[idx] = { ...plans[idx], badge: e.target.value || null };
                        updateField("pricing", "plans", plans);
                      }}
                      placeholder={t("dashboard.sitesEditor.phPricingBadge")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Harga</label>
                    <input
                      type="text"
                      value={plan.price || ""}
                      onChange={(e) => {
                        const plans = [...(content.pricing?.plans || [])];
                        plans[idx] = { ...plans[idx], price: e.target.value };
                        updateField("pricing", "plans", plans);
                      }}
                      placeholder={t("dashboard.sitesEditor.phPricingPrice")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground font-semibold text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Periode / Satuan</label>
                    <input
                      type="text"
                      value={plan.period || ""}
                      onChange={(e) => {
                        const plans = [...(content.pricing?.plans || [])];
                        plans[idx] = { ...plans[idx], period: e.target.value };
                        updateField("pricing", "plans", plans);
                      }}
                      placeholder={t("dashboard.sitesEditor.phPricingPeriod")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Deskripsi Singkat</label>
                  <input
                    type="text"
                    value={plan.description || ""}
                    onChange={(e) => {
                      const plans = [...(content.pricing?.plans || [])];
                      plans[idx] = { ...plans[idx], description: e.target.value };
                      updateField("pricing", "plans", plans);
                    }}
                    placeholder={t("dashboard.sitesEditor.phPricingDesc")}
                    className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                  />
                </div>

                {/* Features list */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-sidebar-muted-foreground block">Daftar Fitur / Fasilitas (1 baris per fitur)</label>
                  <textarea
                    rows={3}
                    value={(plan.features || []).join("\n")}
                    onChange={(e) => {
                      const lines = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                      const plans = [...(content.pricing?.plans || [])];
                      plans[idx] = { ...plans[idx], features: lines };
                      updateField("pricing", "plans", plans);
                    }}
                    placeholder="1 Video TikTok/Reels&#10;Termasuk Hak Cipta 3 Bulan&#10;2x Revisi Video"
                    className="w-full px-2.5 py-1.5 border border-border rounded-md text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground resize-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">Teks Tombol CTA</label>
                    <input
                      type="text"
                      value={plan.cta_text || ""}
                      onChange={(e) => {
                        const plans = [...(content.pricing?.plans || [])];
                        plans[idx] = { ...plans[idx], cta_text: e.target.value };
                        updateField("pricing", "plans", plans);
                      }}
                      placeholder={t("dashboard.sitesEditor.phPricingCtaText")}
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-sidebar-muted-foreground mb-0.5 block">URL Tombol CTA</label>
                    <input
                      type="text"
                      value={plan.cta_url || ""}
                      onChange={(e) => {
                        const plans = [...(content.pricing?.plans || [])];
                        plans[idx] = { ...plans[idx], cta_url: e.target.value };
                        updateField("pricing", "plans", plans);
                      }}
                      placeholder="#contact"
                      className="w-full px-2 py-1 border border-border rounded text-[12px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={!!plan.is_featured}
                    onChange={(e) => {
                      const plans = [...(content.pricing?.plans || [])];
                      plans[idx] = { ...plans[idx], is_featured: e.target.checked };
                      updateField("pricing", "plans", plans);
                    }}
                    className="rounded text-primary focus:ring-0"
                  />
                  <span className="text-[11px] text-sidebar-foreground">Tandai sebagai paket unggulan (Highlight / Featured)</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FLOATING BUTTON FORM ── */}
      {activeTab === "floating" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
            <p className="font-semibold text-primary">💬 {t("dashboard.sitesEditor.floatingSectionBanner")}</p>
            <p className="mt-1 text-primary/80">{t("dashboard.sitesEditor.floatingSectionBannerDesc")}</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.floatingButtonType")}</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "none",          labelKey: "floatingNone",          icon: "🚫", descKey: "floatingNoneDesc" },
                { value: "whatsapp",      labelKey: "floatingWhatsApp",      icon: "💬", descKey: "floatingWhatsAppDesc" },
                { value: "whatsapp_pill", labelKey: "floatingWhatsAppPill",  icon: "🟢", descKey: "floatingWhatsAppPillDesc" },
                { value: "chat_bubble",   labelKey: "floatingChatBubble",    icon: "✨", descKey: "floatingChatBubbleDesc" },
                { value: "contact_link",  labelKey: "floatingContactLink",   icon: "📋", descKey: "floatingContactLinkDesc" },
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
                    className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${isActive ? "border-primary bg-primary/15 ring-1 ring-primary" : "border-border bg-muted/40 hover:border-border hover:bg-muted/70"} ${isProGated ? "opacity-60" : ""}`}
                  >
                    <span className="text-lg block mb-1">{opt.icon}</span>
                    <p className="text-[11px] font-bold text-sidebar-foreground leading-tight">{t(`dashboard.sitesEditor.${opt.labelKey}`)}</p>
                    <p className="text-[10px] text-sidebar-subtle-foreground mt-0.5 leading-tight">{t(`dashboard.sitesEditor.${opt.descKey}`)}</p>
                    {opt.value === "chat_bubble" && <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">PRO</span>}
                    {isActive && <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
            {!isPremium && (
              <p className="text-[10px] text-amber-400/80 leading-relaxed">✨ {t("dashboard.sitesEditor.floatingProHint")}</p>
            )}
          </div>
          {(designToken?.layout?.floating_button === "whatsapp" || designToken?.layout?.floating_button === "whatsapp_pill" || designToken?.layout?.floating_button === "chat_bubble" || !designToken?.layout?.floating_button) && (
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
                {t("dashboard.sitesEditor.floatingWhatsAppNumber")} <span className="text-red-400">*</span>
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
                placeholder={t("dashboard.sitesEditor.phFloatingWaNumber")}
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
              />
              {!content?.contact?.phone && <p className="text-[10px] text-red-400/80 mt-1">{t("dashboard.sitesEditor.floatingWhatsAppNumberRequired")}</p>}
              <p className="text-[10px] text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.floatingWhatsAppNumberHint")}</p>
            </div>
          )}
          {designToken?.layout?.floating_button !== "none" && (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-[11px] text-sidebar-muted-foreground leading-relaxed">
              {(designToken?.layout?.floating_button === "whatsapp" || !designToken?.layout?.floating_button) && t("dashboard.sitesEditor.floatingWhatsAppDescLong")}
              {designToken?.layout?.floating_button === "whatsapp_pill" && t("dashboard.sitesEditor.floatingWhatsAppPillDescLong")}
              {designToken?.layout?.floating_button === "chat_bubble" && (isPremium ? t("dashboard.sitesEditor.floatingChatBubbleDescLong") : t("dashboard.sitesEditor.floatingChatBubbleProRequired"))}
              {designToken?.layout?.floating_button === "contact_link" && t("dashboard.sitesEditor.floatingContactLinkDescLong")}
            </div>
          )}
        </div>
      )}

      {/* ── PRELOADER SETTINGS FORM ── */}
      {activeTab === "preloader" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-3.5 text-[12px] leading-relaxed text-primary">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <p className="font-bold text-primary">
                {t("dashboard.sitesEditor.preloaderSectionBanner")}
              </p>
            </div>
            <p className="mt-1 text-sidebar-muted-foreground text-[11px] leading-relaxed">
              {t("dashboard.sitesEditor.preloaderSectionBannerDesc")}
            </p>
          </div>

          {/* Test Preview Button */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-sidebar-muted/40">
            <div>
              <p className="text-[11px] font-bold text-sidebar-foreground">
                {t("dashboard.sitesEditor.preloaderTestTitle")}
              </p>
              <p className="text-[10px] text-sidebar-subtle-foreground mt-0.5">
                {t("dashboard.sitesEditor.preloaderTestDesc")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTestPreloaderKey(Date.now())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t("dashboard.sitesEditor.preloaderTestBtn")}</span>
            </button>
          </div>

          {/* 1. Custom Text / Brand Override */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.preloaderBrandText")}
            </label>
            <input
              type="text"
              value={content?.preloader?.brand_name || ""}
              onChange={(e) => updateField("preloader", "brand_name", e.target.value)}
              placeholder={t("dashboard.sitesEditor.preloaderBrandAuto", undefined, { value: content?.header?.brand_name || t("dashboard.sitesEditor.preloaderBrandFallback") })}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
            <p className="text-[10px] text-sidebar-subtle-foreground">
              {t("dashboard.sitesEditor.preloaderBrandHint")}
            </p>
          </div>

          {/* 2. Custom Tagline / Message */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.preloaderTagline")}
            </label>
            <input
              type="text"
              value={content?.preloader?.tagline || ""}
              onChange={(e) => updateField("preloader", "tagline", e.target.value)}
              placeholder={t("dashboard.sitesEditor.preloaderTaglineAuto", undefined, { value: content?.header?.tagline || t("dashboard.sitesEditor.preloaderTaglineFallback") })}
              className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
            />
            <p className="text-[10px] text-sidebar-subtle-foreground">
              {t("dashboard.sitesEditor.preloaderTaglineHint")}
            </p>
          </div>

          {/* 3. Icon / Logo Selection */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.preloaderIconLogo")}
            </label>

            {/* Icon Picker */}
            <div className="space-y-1">
              <span className="text-[10px] font-medium text-sidebar-subtle-foreground">
                {t("dashboard.sitesEditor.preloaderChooseIcon")}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <IconPicker
                    value={content?.preloader?.icon || ""}
                    onChange={(iconName) => updateField("preloader", "icon", iconName)}
                  />
                </div>
                {content?.preloader?.icon && (
                  <button
                    type="button"
                    onClick={() => updateField("preloader", "icon", "")}
                    className="p-1.5 text-xs text-red-400 hover:bg-red-400/10 rounded transition cursor-pointer"
                    title={t("dashboard.sitesEditor.preloaderClearIcon")}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Custom Logo Image Upload */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-medium text-sidebar-subtle-foreground">
                {t("dashboard.sitesEditor.preloaderOrUploadLogo")}
              </span>
              <FileUpload
                label=""
                value={content?.preloader?.logo_url || ""}
                onChange={(val) => updateField("preloader", "logo_url", val)}
                placeholder="https://..."
                maxWidth={400}
                maxHeight={400}
                quality={0.9}
              />
              <p className="text-[10px] text-sidebar-subtle-foreground">
                {t("dashboard.sitesEditor.preloaderLogoHint")}
              </p>
            </div>
          </div>

          {/* 4. Display Duration */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.preloaderDurationLabel")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 800, label: "Cepat", desc: "0.8 detik" },
                { val: 1200, label: "Standar", desc: "1.2 detik (Default)" },
                { val: 1800, label: "Santai", desc: "1.8 detik" },
              ].map((opt) => {
                const currentDuration = content?.preloader?.duration_ms || 1200;
                const active = currentDuration === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => updateField("preloader", "duration_ms", opt.val)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      active
                        ? "border-primary bg-primary/15 text-primary font-bold ring-1 ring-primary"
                        : "border-border bg-muted/30 text-sidebar-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    <p className="text-[11px]">{opt.label}</p>
                    <p className="text-[9px] opacity-75 mt-0.5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── AI Prompt Modal ── */}
      {fieldPromptModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => { fieldPromptModal.resolve(null); setFieldPromptModal(null); }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-sidebar text-sidebar-foreground shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <SparkleGenAI className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-sidebar-foreground leading-tight">
                  {t("dashboard.sitesEditor.fieldAiTitle", undefined, { label: fieldPromptModal.label })}
                </h3>
                <p className="text-[11px] text-sidebar-muted-foreground mt-0.5">
                  {t("dashboard.sitesEditor.fieldAiDesc")}
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
              placeholder={t("dashboard.sitesEditor.fieldAiPlaceholder")}
              className="w-full px-4 py-3 border border-border bg-sidebar-input text-sidebar-foreground rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 placeholder:text-sidebar-subtle-foreground transition-all"
            />

            {/* Image chip — shown only when item has a photo */}
            {fieldPromptModal.imageUrl && (
              <button
                type="button"
                onClick={() => setFieldPromptInput(t("dashboard.sitesEditor.fieldAiImagePrompt"))}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/30 bg-primary/10 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer text-left"
              >
                <span className="text-base leading-none">📸</span>
                <span>{t("dashboard.sitesEditor.fieldAiImageChip")}</span>
                <span className="ml-auto shrink-0 w-10 h-6 rounded overflow-hidden border border-border">
                  <img src={fieldPromptModal.imageUrl} alt="" className="w-full h-full object-cover" />
                </span>
              </button>
            )}

            {/* Quick suggestions */}
            {getAiSuggestions(locale, fieldPromptModal.section).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {getAiSuggestions(locale, fieldPromptModal.section).slice(0, 3).map((chip) => (
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
                className="flex-1 h-10 rounded-xl border border-border text-[13px] font-semibold text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground transition-all cursor-pointer"
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

      {/* ── Test Preview Overlay for Preloader ── */}
      {testPreloaderKey !== null && (
        <div className="fixed inset-0 z-[99999]">
          <SiteLoadingScreen
            key={testPreloaderKey}
            visual={resolvePreloaderConfig(designToken, content?.header, content?.preloader)}
            onComplete={() => setTestPreloaderKey(null)}
          />
          <button
            type="button"
            onClick={() => setTestPreloaderKey(null)}
            className="fixed top-4 right-4 z-[100000] px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs border border-white/20 transition-all cursor-pointer shadow-lg backdrop-blur"
          >
            Tutup Preview ✕
          </button>
        </div>
      )}
    </>
  );
}

const HERO_ACCESSORY_TYPES: ReadonlyArray<{ value: string; labelKey: string; label: string }> = [
  { value: "price",          labelKey: "heroAccessoryPrice",         label: "Harga (toko online/produk)" },
  { value: "availability",   labelKey: "heroAccessoryAvailability",  label: "Ketersediaan (jasa/service)" },
  { value: "skill_tags",     labelKey: "heroAccessorySkillTags",     label: "Keahlian (portfolio/kreator)" },
  { value: "rating",         labelKey: "heroAccessoryRating",        label: "Rating (undangan/acara)" },
  { value: "menu_highlight", labelKey: "heroAccessoryMenuHighlight", label: "Menu Unggulan (kuliner)" },
];

function HeroStatsEditor({
  stats,
  onChange,
}: {
  stats?: Array<{ value: string; label: string }> | null;
  onChange: (stats: Array<{ value: string; label: string }>) => void;
}) {
  const { t } = useI18n();
  const items = Array.isArray(stats) ? stats : [];
  const inputClass = `${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`;
  const setItem = (i: number, patch: { value?: string; label?: string }) =>
    onChange(items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const addItem = () => onChange([...items, { value: "100+", label: "Klien" }]);
  return (
    <div className="space-y-2 rounded-lg border border-border/60 p-2.5 bg-sidebar-muted/50">
      <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
        <span>{t("dashboard.sitesEditor.heroStatHighlight")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
      </label>
      <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">{t("dashboard.sitesEditor.heroStatHighlightHint")}</p>
      {items.length === 0 && (
        <p className="text-[10px] text-sidebar-subtle-foreground italic">{t("dashboard.sitesEditor.heroStatHighlightEmpty")}</p>
      )}
      {items.map((s, i) => (
        <div key={i} className="flex gap-1.5 items-center">
          <input
            type="text"
            value={s.value || ""}
            onChange={(e) => setItem(i, { value: e.target.value })}
            placeholder={t("dashboard.sitesEditor.phHeroStatValue")}
            aria-label={`${t("dashboard.sitesEditor.commonValue")} ${i + 1}`}
            className={`${inputClass} w-1/3`}
          />
          <input
            type="text"
            value={s.label || ""}
            onChange={(e) => setItem(i, { label: e.target.value })}
            placeholder={t("dashboard.sitesEditor.phHeroStatLabel")}
            aria-label={`${t("dashboard.sitesEditor.commonLabel")} ${i + 1}`}
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="px-2 py-1.5 rounded-md text-sidebar-subtle-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title={t("dashboard.sitesEditor.commonRemove")}
            aria-label={`${t("dashboard.sitesEditor.commonRemove")} ${i + 1}`}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        disabled={items.length >= 4}
        className="w-full px-2 py-1.5 rounded-md text-xs font-semibold border border-dashed border-border text-sidebar-muted-foreground hover:text-sidebar-foreground hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + {t("dashboard.sitesEditor.heroStatAddItem")}
      </button>
    </div>
  );
}

function HeroAccessoryEditor({
  accessory,
  onChange,
}: {
  accessory: { type?: string; label?: string; value?: string; tags?: string[] } | null;
  onChange: (acc: { type?: string; label?: string; value?: string; tags?: string[] } | null) => void;
}) {
  const { t } = useI18n();
  const acc = accessory && accessory.type ? accessory : null;
  const tagsString = acc && Array.isArray(acc.tags) ? acc.tags.join(", ") : "";
  const set = (patch: Record<string, unknown>) => onChange({ type: acc?.type ?? "", ...acc, ...patch });
  const hasText = acc?.type === "price" || acc?.type === "availability" || acc?.type === "rating";
  const hasTags = acc?.type === "skill_tags" || acc?.type === "menu_highlight";
  const inputClass = `${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`;
  return (
    <div className="space-y-2 rounded-lg border border-border/60 p-2.5 bg-sidebar-muted/50">
      <div className="space-y-1">
        <label className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          <span>{t("dashboard.sitesEditor.heroAccessoryLabel")} <span className="text-sidebar-subtle-foreground font-normal normal-case">{t("dashboard.sitesEditor.commonOptional")}</span></span>
        </label>
        <CustomSelect
          value={acc?.type || ""}
          onChange={(val) => onChange(val ? { type: val } : null)}
          size="sm"
          triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
          placeholder={t("dashboard.sitesEditor.phAccessoryNone")}
          options={[
            { value: "", label: t("dashboard.sitesEditor.phAccessoryNone") },
            ...HERO_ACCESSORY_TYPES.map((o) => ({ value: o.value, label: t(`dashboard.sitesEditor.${o.labelKey}`) })),
          ]}
        />
        <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">{t("dashboard.sitesEditor.heroAccessoryHint")}</p>
      </div>
      {hasText && (
        <>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.commonLabel")}</label>
            <input type="text" value={acc?.label || ""} onChange={(e) => set({ label: e.target.value })} placeholder={acc?.type === "price" ? t("dashboard.sitesEditor.phAccessoryLabel") : t("dashboard.sitesEditor.phAccessoryLabelAvailFor")} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.commonValue")}</label>
            <input type="text" value={acc?.value || ""} onChange={(e) => set({ value: e.target.value })} placeholder={acc?.type === "price" ? t("dashboard.sitesEditor.phAccessoryValue") : t("dashboard.sitesEditor.phAccessoryValueConsultation")} className={inputClass} />
          </div>
        </>
      )}
      {hasTags && (
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">{t("dashboard.sitesEditor.heroAccessoryTagsLabel")}</label>
          <input
            type="text"
            value={tagsString}
            onChange={(e) => set({ tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
            placeholder={t("dashboard.sitesEditor.phAccessorySkills")}
            className={inputClass}
          />
        </div>
      )}
    </div>
  );
}

function HeroDashboardWidgetEditor({
  widget,
  onChange,
}: {
  widget: any;
  onChange: (widget: any) => void;
}) {
  const isHidden = widget?.hidden === true;
  const setField = (key: string, val: any) => {
    onChange({
      ...widget,
      [key]: val,
    });
  };

  const inputClass = `${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`;

  return (
    <div className="space-y-3 rounded-xl border border-border/70 p-3 bg-sidebar-muted/50">
      {/* Header with Hide/Show switch */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-sidebar-foreground">
            Widget Dashboard Hero
          </span>
        </div>
        <button
          type="button"
          onClick={() => setField("hidden", !isHidden)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            isHidden
              ? "border-sidebar-border bg-sidebar-muted text-sidebar-muted-foreground hover:text-sidebar-foreground"
              : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
          }`}
          title={isHidden ? "Tampilkan widget" : "Sembunyikan widget"}
        >
          {isHidden ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Tersembunyi</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Tampil</span>
            </>
          )}
        </button>
      </div>

      {!isHidden && (
        <div className="space-y-3 pt-2 border-t border-border/40">
          <p className="text-[11px] text-sidebar-muted-foreground leading-relaxed">
            Sesuaikan nama tab dan metrik dashboard ilustrasi hero. Teks juga bisa diklik dan diedit langsung di kanvas.
          </p>

          {/* Tab labels */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">
              Nama Tab (Analytics, Deploy, Monitor)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-sidebar-subtle-foreground mb-1 block">Tab 1</span>
                <input
                  type="text"
                  value={widget?.tab_analytics_label ?? "Analytics"}
                  onChange={(e) => setField("tab_analytics_label", e.target.value)}
                  className={inputClass}
                  placeholder="Analytics"
                />
              </div>
              <div>
                <span className="text-[10px] text-sidebar-subtle-foreground mb-1 block">Tab 2</span>
                <input
                  type="text"
                  value={widget?.tab_deploy_label ?? "Deploy"}
                  onChange={(e) => setField("tab_deploy_label", e.target.value)}
                  className={inputClass}
                  placeholder="Deploy"
                />
              </div>
              <div>
                <span className="text-[10px] text-sidebar-subtle-foreground mb-1 block">Tab 3</span>
                <input
                  type="text"
                  value={widget?.tab_monitor_label ?? "Monitor"}
                  onChange={(e) => setField("tab_monitor_label", e.target.value)}
                  className={inputClass}
                  placeholder="Monitor"
                />
              </div>
            </div>
          </div>

          {/* Metrik Monitor */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">
              Metrik Tab Monitor (Nilai & Label)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <input
                  type="text"
                  value={widget?.monitor_uptime_value ?? "99.9%"}
                  onChange={(e) => setField("monitor_uptime_value", e.target.value)}
                  className={inputClass}
                  placeholder="99.9%"
                />
                <input
                  type="text"
                  value={widget?.monitor_uptime_label ?? "Uptime"}
                  onChange={(e) => setField("monitor_uptime_label", e.target.value)}
                  className={inputClass}
                  placeholder="Uptime"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  value={widget?.monitor_latency_value ?? "12ms"}
                  onChange={(e) => setField("monitor_latency_value", e.target.value)}
                  className={inputClass}
                  placeholder="12ms"
                />
                <input
                  type="text"
                  value={widget?.monitor_latency_label ?? "Latency"}
                  onChange={(e) => setField("monitor_latency_label", e.target.value)}
                  className={inputClass}
                  placeholder="Latency"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  value={widget?.monitor_errors_value ?? "0"}
                  onChange={(e) => setField("monitor_errors_value", e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
                <input
                  type="text"
                  value={widget?.monitor_errors_label ?? "Errors"}
                  onChange={(e) => setField("monitor_errors_label", e.target.value)}
                  className={inputClass}
                  placeholder="Errors"
                />
              </div>
            </div>
          </div>

          {/* Langkah Deploy */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">
              Langkah Tab Deploy
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={widget?.deploy_step_1 ?? "Build"}
                onChange={(e) => setField("deploy_step_1", e.target.value)}
                className={inputClass}
                placeholder="Build"
              />
              <input
                type="text"
                value={widget?.deploy_step_2 ?? "Test"}
                onChange={(e) => setField("deploy_step_2", e.target.value)}
                className={inputClass}
                placeholder="Test"
              />
              <input
                type="text"
                value={widget?.deploy_step_3 ?? "Deploy"}
                onChange={(e) => setField("deploy_step_3", e.target.value)}
                className={inputClass}
                placeholder="Deploy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

