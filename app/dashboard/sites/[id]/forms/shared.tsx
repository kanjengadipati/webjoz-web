"use client";

import React, { useState } from "react";
import {
  ChevronDown, ChevronUp, RefreshCw, Star, Zap, Shield, Award, Heart, CheckCircle,
  Clock, Globe, Users, TrendingUp, Leaf, Flame, Lightbulb, Target, Truck,
  ThumbsUp, Lock, Phone, Mail, MapPin, Camera, Utensils, Coffee, ShoppingBag,
  Wrench, Stethoscope, BookOpen, Home, Building2, Briefcase,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
export { SIDEBAR_FIELD_CLASS, SIDEBAR_FIELD_CLASS_ICON } from "@/lib/editor-field-class";
import { SIDEBAR_FIELD_CLASS, SIDEBAR_FIELD_CLASS_ICON } from "@/lib/editor-field-class";

export interface LinkTypeInputProps {
  urlValue: string;
  updateUrl: (val: string) => void;
  needsAttention: boolean;
  fieldClass: (path: string, base: string) => string;
  path: string;
  label: string;
  defaultWaNumber?: string;
  suggestedHash?: string;
}

export function LinkTypeInput({
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

  React.useEffect(() => {
    const isCurrentlyWa = /wa\.me|whatsapp\.com|whatsapp:\/\//i.test(urlValue);
    if (isCurrentlyWa && linkType !== "whatsapp") {
      setLinkType("whatsapp");
    } else if (!isCurrentlyWa && linkType === "whatsapp" && urlValue !== "") {
      setLinkType("custom");
    }
  }, [urlValue, linkType]);

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

export function CollapsibleGroup({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-md bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-3 py-2 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground cursor-pointer"
      >
        <span>{label}</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  );
}

export const ICON_OPTIONS: Array<{ name: string; icon: React.ComponentType<any> }> = [
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

export function IconPicker({ value, onChange }: { value?: string; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = ICON_OPTIONS.find((o) => o.name === value);
  const SelectedIcon = selected?.icon ?? Star;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 border border-border rounded text-[11px] text-sidebar-foreground hover:bg-sidebar-muted transition-all w-full cursor-pointer"
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
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                className={`flex items-center justify-center p-2 rounded transition-all hover:bg-primary/20 cursor-pointer ${
                  value === name ? "bg-primary/30 ring-1 ring-primary" : ""
                }`}
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

const DEFAULT_UNSPLASH_POOL = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80",
];

export function AiImageButton({
  onSelect,
}: {
  businessType?: string;
  onSelect: (url: string) => void;
}) {
  const { t } = useI18n();
  const handleClick = () => {
    const randomUrl = DEFAULT_UNSPLASH_POOL[Math.floor(Math.random() * DEFAULT_UNSPLASH_POOL.length)];
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
