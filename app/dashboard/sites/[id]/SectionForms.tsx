import React, { useState } from "react";
import { SidebarField, setSidebarAiRewrite } from "@/components/sidebar-field";
import { HeaderSectionForm } from "./forms/HeaderSectionForm";
import { ContactSectionForm } from "./forms/ContactSectionForm";
import { SEOSectionForm } from "./forms/SEOSectionForm";
import { AboutSectionForm } from "./forms/AboutSectionForm";
import { BenefitsSectionForm } from "./forms/BenefitsSectionForm";
import { FaqSectionForm } from "./forms/FaqSectionForm";
import { CtaSectionForm } from "./forms/CtaSectionForm";
import { FooterSectionForm } from "./forms/FooterSectionForm";
import { TestimonialsSectionForm } from "./forms/TestimonialsSectionForm";
import { GallerySectionForm } from "./forms/GallerySectionForm";
import { WorksSectionForm } from "./forms/WorksSectionForm";
import { StatsSectionForm } from "./forms/StatsSectionForm";
import { SkillsSectionForm } from "./forms/SkillsSectionForm";
import { PartnersSectionForm } from "./forms/PartnersSectionForm";
import { PricingSectionForm } from "./forms/PricingSectionForm";
import { FloatingSectionForm } from "./forms/FloatingSectionForm";
import { PreloaderSectionForm } from "./forms/PreloaderSectionForm";
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
  const [fieldPromptModal, setFieldPromptModal] = React.useState<{
    section: string;
    fieldKey: string;
    label: string;
    imageUrl?: string;
    resolve: (val: string | null) => void;
  } | null>(null);
  const [fieldPromptInput, setFieldPromptInput] = React.useState("");


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
      {/* HEADER FORM */}
      {activeTab === "header" && (
        <HeaderSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          renderFieldActions={renderFieldActions}
          designToken={designToken}
          updateDesignTokenLayout={updateDesignTokenLayout}
        />
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

          {/* Link CV / Resume (opsional, untuk portofolio) */}
          <div className="space-y-2 p-2.5 rounded-lg border border-border bg-muted/20">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground block">
              📄 Link CV / Resume (Portofolio)
            </label>
            <div className="space-y-1">
              <label className="text-[10px] text-sidebar-muted-foreground block">URL File CV (Google Drive, Dropbox, dll)</label>
              <input
                id="field-hero.cv_url"
                type="text"
                value={content.hero?.cv_url || ""}
                onChange={(e) => updateField("hero", "cv_url", e.target.value)}
                placeholder="https://drive.google.com/..."
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-sidebar-muted-foreground block">Teks Tombol (Default: Unduh CV)</label>
              <input
                id="field-hero.cv_label"
                type="text"
                value={content.hero?.cv_label || ""}
                onChange={(e) => updateField("hero", "cv_label", e.target.value)}
                placeholder="Unduh CV"
                className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
              />
            </div>
          </div>
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
        <AboutSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
          renderFieldActions={renderFieldActions}
          businessType={bType}
          handleAiImage={handleAiImage}
        />
      )}

      {/* BENEFITS FORM */}
      {activeTab === "benefits" && (
        <BenefitsSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
        />
      )}

      {/* FAQ FORM */}
      {activeTab === "faq" && (
        <FaqSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
        />
      )}

      {/* CTA FORM */}
      {activeTab === "cta" && (
        <CtaSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
        />
      )}

      {/* CONTACT FORM */}
      {activeTab === "contact" && (
        <ContactSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
          token={token}
        />
      )}

      {/* FOOTER FORM */}
      {activeTab === "footer" && (
        <FooterSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
        />
      )}

      {/* SEO FORM */}
      {activeTab === "seo" && (
        <SEOSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
          token={token}
          activeTenantId={activeTenantId}
          siteId={siteId}
          isPremium={isPremium}
          onUpgradeRequired={onUpgradeRequired}
          subdomain={subdomain}
          aiLoadingField={aiLoadingField}
          handleAiText={handleAiText}
          renderFieldActions={renderFieldActions}
        />
      )}

      {/* TESTIMONIALS FORM */}
      {activeTab === "testimonials" && (
        <TestimonialsSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
          renderFieldActions={renderFieldActions}
        />
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
        <GallerySectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
          renderFieldActions={renderFieldActions}
        />
      )}

      {/* WORKS FORM */}
      {activeTab === "works" && (
        <WorksSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
          renderFieldActions={renderFieldActions}
        />
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
        <StatsSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
        />
      )}

      {/* SKILLS FORM */}
      {activeTab === "skills" && (
        <SkillsSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
        />
      )}

      {/* PARTNERS FORM */}
      {activeTab === "partners" && (
        <PartnersSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
        />
      )}

      {/* PRICING FORM */}
      {activeTab === "pricing" && (
        <PricingSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          fieldUndoStacks={fieldUndoStacks}
          undoField={undoField}
        />
      )}

      {/* ── FLOATING BUTTON FORM ── */}
      {activeTab === "floating" && (
        <FloatingSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          designToken={designToken}
          updateDesignTokenLayout={updateDesignTokenLayout}
          isPremium={isPremium}
          onUpgradeRequired={onUpgradeRequired}
        />
      )}

      {/* ── PRELOADER SETTINGS FORM ── */}
      {activeTab === "preloader" && (
        <PreloaderSectionForm
          content={content}
          updateField={updateField}
          needsAttention={needsAttention}
          fieldClass={fieldClass}
          designToken={designToken}
        />
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

