"use client";

import React, { useId, useState } from "react";
import {
  Utensils, Calendar, Clock, MapPin, Phone, Mail, Check,
  ArrowRight, Sparkles, Award, Shield, Zap, ChevronDown,
  ChevronUp, Star, HelpCircle, Send, Globe, MessageSquare,
  Image as ImageIcon, Plus, Minus, ShoppingCart, Menu, X
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CartProvider, CartFab, AddToCartButton, isPlaceholderPrice } from "@/components/cart";
// ─── Nav Menu ─────────────────────────────────────────────────────────────────

// Sections that should NOT appear in nav
const NAV_SKIP = new Set(["header", "hero", "footer", "seo"]);

// Human-readable labels for nav items
const NAV_LABELS: Record<string, string> = {
  about:    "Tentang",
  benefits: "Keunggulan",
  menu:     "Menu",
  catalog:  "Katalog",
  faq:      "FAQ",
  cta:      "Promo",
  contact:  "Kontak",
};

interface NavMenuProps {
  sectionOrder: string[];
  hiddenSections?: string[];
  /** Tailwind text colour class for links, e.g. "text-amber-900" */
  linkClass?: string;
  /** Tailwind/CSS active indicator colour */
  activeColor?: string;
  /** Inline style for the mobile drawer bg */
  drawerStyle?: React.CSSProperties;
}

const NavMenu: React.FC<NavMenuProps> = ({
  sectionOrder,
  hiddenSections = [],
  linkClass = "text-slate-700",
  drawerStyle,
}) => {
  const [open, setOpen] = useState(false);

  const navItems = sectionOrder
    .filter(k => !NAV_SKIP.has(k) && !hiddenSections.includes(k) && NAV_LABELS[k])
    .map(k => ({ key: k, label: NAV_LABELS[k] }));

  if (navItems.length === 0) return null;

  const handleClick = (key: string) => {
    setOpen(false);
    const el = document.getElementById(key);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Desktop nav — hidden on small screens */}
      <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
        {navItems.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleClick(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-70 cursor-pointer focus:outline-none ${linkClass}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer focus:outline-none ${linkClass}`}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden absolute top-full left-0 right-0 z-[60] shadow-lg py-2"
          style={drawerStyle ?? { background: "rgba(255,255,255,0.97)", borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleClick(key)}
              className={`w-full text-left px-5 py-3 text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer focus:outline-none ${linkClass}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

interface BenefitItem {
  title: string;
  description: string;
  icon?: string;
  stat?: string;
  stat_label?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  image_url?: string | null;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface CatalogItem {
  name: string;
  description?: string;
  price?: string;
  badge?: string | null;
  image_url?: string | null;
}

interface CatalogCategory {
  name: string;
  items: CatalogItem[];
}

export interface DesignToken {
  palette?: {
    primary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
  };
  typography?: {
    heading_font?: string;
    body_font?: string;
    heading_weight?: string;
    heading_size_hero?: string;
  };
  layout?: {
    hero_style?: "full-bleed" | "split" | "centered" | "minimal";
    section_spacing?: "compact" | "normal" | "relaxed";
    corner_radius?: "sharp" | "soft" | "rounded";
    section_order?: string[];
    hidden_sections?: string[];
  };
  mood?: string;
}

export interface TemplateProps {
  content: {
    header: {
      brand_name: string;
      nav_cta_text: string;
      icon?: string;
      logo_url?: string;
      tagline?: string;
    };
    hero: {
      headline: string;
      subheadline: string;
      cta_text: string;
      cta_url: string;
      image_url?: string;
      badge_text?: string;
      opening_hours?: string;
      launch_label?: string;
    };
    about: {
      title: string;
      body: string;
      image_url?: string | null;
      icon?: string;
    };
    benefits: {
      title: string;
      items: BenefitItem[];
    };
    faq: {
      title: string;
      items: FaqItem[];
    };
    cta: {
      headline: string;
      button_text: string;
      button_url: string;
    };
    contact: {
      title: string;
      address: string;
      phone: string;
      email: string;
      maps_url?: string | null;
      show_lead_form?: boolean;
    };
    footer?: {
      brand_name?: string;
      tagline?: string;
      copyright_text?: string;
      social_links?: Array<{ platform: string; url: string }>;
    };
    menu?: {
      title: string;
      categories: MenuCategory[];
    };
    catalog?: {
      title: string;
      categories: CatalogCategory[];
    };
    seo?: {
      title?: string;
      description?: string;
      favicon_url?: string;
      og_image_url?: string;
    };
  };
  design_token?: DesignToken | null;
  onSubmitLead?: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>;
  leadSubmitting?: boolean;
  leadSuccess?: boolean;
  leadError?: string | null;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  onRegenSection?: (section: string) => void;
  isEditorMode?: boolean;
}

// ==========================================
// Preview Section Wrapper (Editor Mode)
// ==========================================
export const PreviewSectionWrapper: React.FC<{
  section: string;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  onRegenSection?: (section: string) => void;
  isEditorMode?: boolean;
  children: React.ReactNode;
  label: string;
}> = ({
  section,
  activeSection,
  onSelectSection,
  onRegenSection,
  isEditorMode = false,
  children,
  label
}) => {
    if (!isEditorMode) {
      return <>{children}</>;
    }

    const isSelected = activeSection === section;

    return (
      <div
        id={`section-preview-${section}`}
        onClick={() => onSelectSection?.(section)}
        className={`group relative transition-all duration-150 ${isSelected
          ? "outline outline-2 outline-violet-500/60 outline-offset-[-2px]"
          : "hover:outline hover:outline-1 hover:outline-slate-300/40 hover:outline-offset-[-1px]"
          }`}
      >
        {/* Label Badge — floats above the top edge, not overlapping content */}
        <div className={`absolute -top-5 left-3 z-[80] flex items-center gap-1.5 pointer-events-none transition-all duration-150 ${
          isSelected ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
        }`}>
          <span className="bg-violet-600 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded uppercase select-none shadow-sm">
            {label}
          </span>
        </div>

        {/* AI Regen button — small, top-right, subtle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRegenSection?.(section);
          }}
          className={`absolute top-2 right-2 z-[80] bg-slate-900/80 backdrop-blur-sm text-violet-300 border border-violet-500/30 hover:bg-violet-600 hover:text-white hover:border-violet-500 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95 duration-150 focus:outline-none focus:ring-1 focus:ring-violet-500 ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          Regen
        </button>

        {children}
      </div>
    );
  };

const MemoPreviewSectionWrapper = React.memo(PreviewSectionWrapper);

interface MemoSectionContentProps<T> {
  content: T;
  render: (data: T) => React.ReactNode;
}

const MemoSectionContent = React.memo(
  <T,>({ content, render }: MemoSectionContentProps<T>) => {
    return <>{render(content)}</>;
  },
  (prevProps, nextProps) => {
    const a = prevProps.content as any;
    const b = nextProps.content as any;
    if (a === b) return true;
    if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (a[key] !== b[key]) return false;
    }
    return true;
  }
) as <T>(props: MemoSectionContentProps<T>) => React.ReactElement;

// Memoized Section Content to prevent template re-renders on single field changes



// ==========================================
// Dynamic Icon Helper
// ==========================================
export const DynamicIcon = ({ name, defaultIcon, className }: { name?: string; defaultIcon: any; className?: string }) => {
  if (name) {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) return <IconComponent className={className} />;
  }
  const Default = defaultIcon;
  return <Default className={className} />;
};

const SeoEditorPreview = ({ seo }: { seo?: TemplateProps["content"]["seo"] }) => (
  <section className="bg-white text-slate-700 px-6 py-10 border-t border-slate-200">
    <div className="max-w-5xl mx-auto space-y-3 text-xs leading-relaxed">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-cyan-950">
        <p className="font-bold">SEO tidak muncul sebagai section di website publik.</p>
        <p className="mt-1 text-cyan-900/80">
          Ini adalah metadata untuk mesin pencari dan preview saat link dibagikan, bukan konten visual halaman.
        </p>
      </div>
      <p><span className="font-semibold text-slate-950">Title:</span> {seo?.title || "Belum ada SEO title"}</p>
      <p><span className="font-semibold text-slate-950">Desc:</span> {seo?.description || "Belum ada meta description"}</p>
    </div>
  </section>
);

// ==========================================
// Logo Image with Fallback
// ==========================================
const LogoImage = ({ url, icon, defaultIcon, iconClass, imgClass }: {
  url?: string;
  icon?: string;
  defaultIcon: any;
  iconClass: string;
  imgClass: string;
}) => {
  const [imgError, setImgError] = useState(false);
  if (url && !imgError) {
    return (
      <img
        src={url}
        className={imgClass}
        alt="Logo"
        onError={() => setImgError(true)}
      />
    );
  }
  return <DynamicIcon name={icon} defaultIcon={defaultIcon} className={iconClass} />;
};

// ==========================================
// lead Form Component (Reusable)
// ==========================================
const LeadForm: React.FC<{
  onSubmit: NonNullable<TemplateProps["onSubmitLead"]>;
  submitting: boolean;
  success: boolean;
  error: string | null;
  buttonClass: string;
  inputClass: string;
}> = ({ onSubmit, submitting, success, error, buttonClass, inputClass }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, message });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-green-50/50 border border-green-200/50 rounded-2xl text-center backdrop-blur-sm animate-fade-in">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Check className="w-6 h-6 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Pesan Terkirim!</h3>
        <p className="text-green-700 text-sm max-w-sm">
          Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="cth. Budi Santoso"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cth. budi@email.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Nomor WA</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="cth. 08123456789"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Pesan Anda</label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan atau pertanyaan Anda di sini..."
          className={inputClass}
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className={`${buttonClass} w-full min-h-11 py-3 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2`}
      >
        {submitting ? "Mengirim..." : (
          <>
            Kirim Pesan
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

// ==========================================
// 1. TEMPLATE_KULINER01 (Cafe / Restaurant)
// ==========================================
export const TemplateKuliner: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, menu } = content;
  const dt = design_token ?? null;
  const baseSectionOrderKuliner: string[] = dt?.layout?.section_order ?? ["hero", "about", "menu", "benefits", "faq", "cta", "contact"];
  const sectionOrder = (menu && !baseSectionOrderKuliner.includes("menu"))
    ? (() => {
        const order = [...baseSectionOrderKuliner];
        const idx = order.indexOf("benefits") >= 0 ? order.indexOf("benefits") : order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length;
        order.splice(idx, 0, "menu");
        return order;
      })()
    : baseSectionOrderKuliner;

  const sectionNodes = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(hero) => (
          <section className="relative min-h-[85vh] flex items-center justify-center text-center px-5 sm:px-6 py-20 bg-gradient-to-b from-amber-50/50 to-[#FAF7F2] overflow-hidden">
            {hero.image_url && (
              <img
                src={hero.image_url}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply"
                alt="Hero"
              />
            )}
            <div className="max-w-4xl relative z-10 space-y-6">

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-serif text-amber-955 leading-tight">
                {hero.headline}
              </h1>

              <p className="text-lg md:text-xl text-[#6D5D50] max-w-2xl mx-auto leading-relaxed">
                {hero.subheadline}
              </p>
              {hero.opening_hours && (
                <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm">
                  <Clock className="w-4 h-4 text-amber-700" />
                  {hero.opening_hours}
                </p>
              )}
              <div className="pt-4">
                <a
                  href={hero.cta_url}
                  className="min-h-11 px-8 py-4 bg-amber-800 hover:bg-amber-900 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 focus:ring-offset-[#FAF7F2]"
                >
                  {hero.cta_text}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(about) => (
          <section className="px-5 sm:px-6 py-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="about">
            <div className="space-y-6">
              <span className="text-amber-800 font-bold tracking-wider uppercase text-xs block">Mengenal Kami</span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-955">{about.title}</h2>
              <p className="text-[#6D5D50] leading-relaxed whitespace-pre-line sm:text-justify">{about.body}</p>
            </div>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-200 to-amber-100 rounded-3xl -rotate-2 opacity-50 shadow-inner"></div>
              <div className="w-full h-80 md:h-[400px] bg-amber-100/80 border-2 border-amber-200/50 rounded-3xl shadow-lg relative z-10 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <DynamicIcon name={about.icon} defaultIcon={Utensils} className="w-12 h-12 text-amber-700 mx-auto" />
                    <p className="font-serif italic text-amber-900 font-semibold text-lg">{header?.brand_name || "Bisnis Kami"}</p>
                    <p className="text-amber-700/85 text-sm max-w-xs">{about.title}</p>
                  </div>
                </div>
                {about.image_url && (
                  <img
                    src={about.image_url}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-cover absolute inset-0 z-10"
                    alt="About"
                  />
                )}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(benefits) => (
          <section className="bg-amber-900/5 px-5 sm:px-6 py-20 border-y border-[#EADFCB]" id="benefits">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="text-amber-800 font-bold tracking-wider uppercase text-xs">Keunggulan</span>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-955">{benefits.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.items?.map((item, idx) => (
                  <div key={idx} className="bg-white border border-[#EADFCB] hover:border-amber-400 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                      <DynamicIcon name={item.icon} defaultIcon={Star} className="w-6 h-6 fill-amber-500 stroke-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-955 mb-3">{item.title}</h3>
                    <p className="text-[#6D5D50] text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    faq: (
      <MemoPreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={faq} render={(faq) => (
          <section className="px-6 py-20 max-w-4xl mx-auto space-y-12" id="faq">
            <div className="text-center space-y-2">
              <span className="text-amber-800 font-bold tracking-wider uppercase text-xs">Pertanyaan</span>
              <h2 className="text-3xl font-bold font-serif text-amber-955">{faq.title}</h2>
            </div>
            <div className="space-y-4">
              {faq.items?.map((item, idx) => (
                <FaqAccordion key={idx} item={item} />
              ))}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    cta: (
      <MemoPreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={cta} render={(cta) => (
          <section className="px-6 py-16 max-w-6xl mx-auto">
            <div className="bg-[#FAF7F2] border border-[#EADFCB] p-8 md:p-16 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-50 to-orange-50 opacity-40"></div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-955">{cta.headline}</h2>
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-amber-800 hover:bg-amber-900 text-white rounded-full font-bold shadow-md transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 focus:ring-offset-[#FAF7F2]"
                  >
                    {cta.button_text}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    contact: (
      <MemoPreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ contact, onSubmitLead, leadSubmitting, leadSuccess, leadError, brand_name: header?.brand_name }} render={(data) => (
          <section className="px-6 py-20 bg-[#F4EEE0] border-t border-[#EADFCB]" id="contact">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold font-serif text-amber-955">{data.contact.title}</h2>
                <div className="space-y-4 text-amber-900">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                    <p>{data.contact.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-amber-700 flex-shrink-0" />
                    <p>{data.contact.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-amber-700 flex-shrink-0" />
                    <p>{data.contact.email}</p>
                  </div>
                </div>
                {data.contact.maps_url && (
                  <div className="pt-4">
                    <a
                      href={data.contact.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-800 underline hover:text-amber-955 inline-flex items-center gap-1.5 font-medium"
                    >
                      <Globe className="w-4 h-4" />
                      Buka Google Maps
                    </a>
                  </div>
                )}
              </div>
              {data.contact.show_lead_form && data.onSubmitLead && (
                <div className="bg-white p-8 rounded-3xl border border-[#EADFCB] shadow-sm">
                  <h3 className="text-lg font-bold font-serif text-amber-955 mb-6">Hubungi Kami / Reservasi</h3>
                  <LeadForm
                    onSubmit={data.onSubmitLead}
                    submitting={data.leadSubmitting}
                    success={data.leadSuccess}
                    error={data.leadError}
                    buttonClass="bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow-sm hover:shadow"
                    inputClass="w-full px-4 py-2.5 bg-amber-50/50 border border-[#EADFCB] focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl outline-none text-sm transition-all"
                  />
                </div>
              )}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(menuData) => (
          <section className="px-5 sm:px-6 py-20 bg-white border-y border-[#EADFCB]" id="menu">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2">
                <span className="text-amber-800 font-bold tracking-wider uppercase text-xs">Pilihan Kami</span>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-955">{menuData.title}</h2>
              </div>
              {menuData.categories?.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-6">
                  <h3 className="text-lg font-bold font-serif text-amber-900 border-b border-[#EADFCB] pb-2">{cat.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cat.items?.map((item, itemIdx) => {
                      const itemId = `${cat.name}__${item.name}__${catIdx}_${itemIdx}`;
                      return (
                        <div key={itemIdx} className="group bg-[#FAF7F2] border border-[#EADFCB] rounded-2xl overflow-hidden hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-44 object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          ) : (
                            <div className="w-full h-44 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                              <Utensils className="w-10 h-10 text-amber-300" />
                            </div>
                          )}
                          <div className="p-4 space-y-2 flex-1 flex flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-amber-955 text-sm leading-tight">{item.name}</h4>
                              {item.price && !isPlaceholderPrice(item.price) && (
                                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{item.price}</span>
                              )}
                            </div>
                            {item.description && <p className="text-[#6D5D50] text-xs leading-relaxed flex-1">{item.description}</p>}
                            <AddToCartButton
                              itemId={itemId}
                              itemName={item.name}
                              itemPrice={item.price}
                              category={cat.name}
                              className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-1"
                              style={{ background: "#92400e", color: "#fff" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,
  } as Record<string, React.ReactNode>;

  const waPhone = contact?.phone ?? "";

  return (
    <CartProvider waPhone={waPhone} brandName={header?.brand_name} previewMode={isEditorMode}>
    <div className="bg-[#FAF7F2] text-[#2C2620] font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden min-h-screen">
      {/* Navbar mock */}
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, icon: header?.icon, tagline: header?.tagline }} render={(headerData) => (
          <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF7F2]/80 border-b border-[#EADFCB] px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative">
            <span className="min-w-0 text-lg sm:text-xl font-bold font-serif text-amber-955 tracking-wide flex items-center gap-2">
              <LogoImage
                url={headerData.logo_url}
                icon={headerData.icon}
                defaultIcon={Utensils}
                iconClass="w-5 h-5 text-amber-700"
                imgClass="h-8 w-auto object-contain"
              />
              <span className="min-w-0">
                <span className="truncate block">{headerData.brand_name || "Brand Kami"}</span>
                {headerData.tagline && <span className="block text-[10px] font-normal text-amber-700/70 tracking-wide truncate">{headerData.tagline}</span>}
              </span>
            </span>
            <NavMenu
              sectionOrder={sectionOrder}
              hiddenSections={dt?.layout?.hidden_sections}
              linkClass="text-amber-900"
              drawerStyle={{ background: "#FAF7F2", borderTop: "1px solid #EADFCB" }}
            />
            <a href="#contact" aria-label={`Hubungi ${headerData.brand_name || "brand ini"}`} className="min-h-11 shrink-0 px-4 py-2 bg-amber-800 text-white rounded-full text-sm font-medium hover:bg-amber-900 transition-all shadow-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 focus:ring-offset-[#FAF7F2]">
              {headerData.nav_cta_text || "Hubungi Kami"}
            </a>
          </header>
        )} />
      </MemoPreviewSectionWrapper>

      {/* Dynamic Section Order */}
      {sectionOrder.filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key)).map((key) => sectionNodes[key] ?? null)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: footer?.brand_name, tagline: footer?.tagline, copyright_text: footer?.copyright_text, brand_name_fallback: header?.brand_name }} render={(footerData) => {
          const displayBrand = footerData.brand_name || footerData.brand_name_fallback || "Bisnis Kuliner Kami";
          const displayTagline = footerData.tagline || "Cita rasa autentik untuk kebersamaan keluarga Anda";
          return (
            <footer className="bg-amber-955 text-amber-100/70 text-center py-10 text-xs border-t border-amber-900/30 space-y-1">
              <p className="text-sm font-bold text-amber-100">{displayBrand}</p>
              <p className="text-amber-100/50">{displayTagline}</p>
              <p>{footerData.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}</p>
            </footer>
          );
        }} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && (
        <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={seo} render={(seoData) => (
            <SeoEditorPreview seo={seoData} />
          )} />
        </MemoPreviewSectionWrapper>
      )}
      {/* Floating cart button */}
      {!isEditorMode && <CartFab colorStyle={{ background: "#92400e", color: "#fff" }} />}
    </div>
    </CartProvider>
  );
};

// ==========================================
// 2. TEMPLATE_JASA02 (Agency / Consultant)
// ==========================================
export const TemplateJasa: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo } = content;
  const dt = design_token ?? null;
  const sectionOrder = dt?.layout?.section_order ?? ["hero", "about", "benefits", "faq", "cta", "contact"];

  const sectionNodes = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(hero) => (
          <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 bg-gradient-to-tr from-slate-50 via-slate-100/50 to-indigo-50/30 overflow-hidden">
            {hero.image_url && (
              <img
                src={hero.image_url}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-luminosity"
                alt="Hero"
              />
            )}
            <div className="max-w-4xl text-center space-y-6 relative z-10">

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                {hero.headline}
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {hero.subheadline}
              </p>
              <div className="pt-4">
                <a
                  href={hero.cta_url}
                  className="min-h-11 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                  {hero.cta_text}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(about) => (
          <section className="px-6 py-24 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="about">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-100 rounded-2xl opacity-40 shadow-inner"></div>
              <div className="w-full h-80 md:h-[400px] bg-white border border-slate-200 rounded-2xl shadow-md relative z-10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 shadow-sm border border-indigo-100">
                      <DynamicIcon name={about.icon} defaultIcon={Shield} className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-slate-900 text-xl">{header?.brand_name || "Bisnis Kami"}</p>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed">{about.title}</p>
                  </div>
                </div>
                {about.image_url && (
                  <img
                    src={about.image_url}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-cover absolute inset-0 z-10"
                    alt="About"
                  />
                )}
              </div>
            </div>
            <div className="space-y-6">
              <span className="text-indigo-600 font-extrabold tracking-wider uppercase text-xs">Profil</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-955 tracking-tight">{about.title}</h2>
              <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line">{about.body}</p>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(benefits) => (
          <section className="bg-indigo-950 text-indigo-100 px-6 py-24" id="benefits">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-3">
                <span className="text-indigo-400 font-extrabold tracking-wider uppercase text-xs">Mengapa Kami</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{benefits.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.items?.map((item, idx) => (
                  <div key={idx} className="bg-indigo-900/30 border border-indigo-900/50 hover:border-indigo-400 p-8 rounded-2xl transition-all duration-300 group">
                    {item.stat ? (
                      <div className="mb-4 sm:mb-6">
                        <p className="text-3xl font-black tracking-tight text-white">{item.stat}</p>
                        {item.stat_label && <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">{item.stat_label}</p>}
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-indigo-500/20 transition-all">
                        <DynamicIcon name={item.icon} defaultIcon={Zap} className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-indigo-200/70 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    faq: (
      <MemoPreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={faq} render={(faq) => (
          <section className="px-6 py-24 max-w-4xl mx-auto space-y-16" id="faq">
            <div className="text-center space-y-2">
              <span className="text-indigo-600 font-extrabold tracking-wider uppercase text-xs">Solusi Pertanyaan</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{faq.title}</h2>
            </div>
            <div className="space-y-4">
              {faq.items?.map((item, idx) => (
                <FaqAccordion key={idx} item={item} />
              ))}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    cta: (
      <MemoPreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={cta} render={(cta) => (
          <section className="px-6 py-16 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 md:p-16 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-lg">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{cta.headline}</h2>
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-white hover:bg-slate-50 text-indigo-800 rounded-xl font-bold shadow-md transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
                  >
                    {cta.button_text}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    contact: (
      <MemoPreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ contact, onSubmitLead, leadSubmitting, leadSuccess, leadError, brand_name: header?.brand_name }} render={(data) => (
          <section className="px-6 py-24 bg-slate-100 border-t border-slate-200" id="contact">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{data.contact.title}</h2>
                <div className="space-y-4 text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <p>{data.contact.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <p>{data.contact.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <p>{data.contact.email}</p>
                  </div>
                </div>
                {data.contact.maps_url && (
                  <div className="pt-4">
                    <a
                      href={data.contact.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1.5"
                    >
                      <Globe className="w-4 h-4" />
                      Buka Peta Lokasi
                    </a>
                  </div>
                )}
              </div>
              {data.contact.show_lead_form && data.onSubmitLead && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Kirim Pertanyaan Anda</h3>
                  <LeadForm
                    onSubmit={data.onSubmitLead}
                    submitting={data.leadSubmitting}
                    success={data.leadSuccess}
                    error={data.leadError}
                    buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
                    inputClass="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none text-sm transition-all"
                  />
                </div>
              )}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
  } as Record<string, React.ReactNode>;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden min-h-screen">
      {/* Navbar mock */}
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, icon: header?.icon, tagline: header?.tagline }} render={(headerData) => (
          <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-50/80 border-b border-slate-200/80 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative">
            <span className="min-w-0 text-base sm:text-lg font-extrabold text-indigo-955 tracking-wider flex items-center gap-2">
              <LogoImage
                url={headerData.logo_url}
                icon={headerData.icon}
                defaultIcon={Globe}
                iconClass="w-5 h-5 text-indigo-600"
                imgClass="h-8 w-auto object-contain"
              />
              <span className="min-w-0">
                <span className="truncate block">{headerData.brand_name || "Brand Kami"}</span>
                {headerData.tagline && <span className="block text-[10px] font-normal text-indigo-400 tracking-wide truncate">{headerData.tagline}</span>}
              </span>
            </span>
            <NavMenu
              sectionOrder={sectionOrder}
              hiddenSections={dt?.layout?.hidden_sections}
              linkClass="text-slate-700"
              drawerStyle={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}
            />
            <a href="#contact" aria-label={`Hubungi ${headerData.brand_name || "brand ini"}`} className="min-h-11 shrink-0 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-slate-50">
              {headerData.nav_cta_text || "Hubungi Kami"}
            </a>
          </header>
        )} />
      </MemoPreviewSectionWrapper>

      {/* Dynamic Section Order */}
      {sectionOrder.filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key)).map((key) => sectionNodes[key] ?? null)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: footer?.brand_name, tagline: footer?.tagline, copyright_text: footer?.copyright_text, brand_name_fallback: header?.brand_name }} render={(footerData) => {
          const displayBrand = footerData.brand_name || footerData.brand_name_fallback || "Layanan Bisnis Kami";
          const displayTagline = footerData.tagline || "Solusi profesional dan terpercaya untuk bisnis Anda";
          return (
            <footer className="bg-slate-900 text-slate-400 text-center py-10 text-xs border-t border-slate-200 space-y-1">
              <p className="text-sm font-bold text-slate-200">{displayBrand}</p>
              <p className="text-slate-505" style={{ color: "var(--slate-500, #94a3b8)" }}>{displayTagline}</p>
              <p>{footerData.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}</p>
            </footer>
          );
        }} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && (
        <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={seo} render={(seoData) => (
            <SeoEditorPreview seo={seoData} />
          )} />
        </MemoPreviewSectionWrapper>
      )}
    </div>
  );
};

// 3. TEMPLATE_PRODUK03 (Brand / Product)
// =========================================
export const TemplateProduk: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, catalog } = content;
  const dt = design_token ?? null;
  const baseSectionOrderProduk: string[] = dt?.layout?.section_order ?? ["hero", "benefits", "catalog", "cta", "about", "faq", "contact"];
  const sectionOrder = (catalog && !baseSectionOrderProduk.includes("catalog"))
    ? (() => {
        const order = [...baseSectionOrderProduk];
        const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("about") >= 0 ? order.indexOf("about") : order.length;
        order.splice(idx, 0, "catalog");
        return order;
      })()
    : baseSectionOrderProduk;

  const sectionNodes = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(hero) => (
          <section className="relative min-h-[90vh] flex items-center justify-center px-5 sm:px-6 py-20 overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full filter blur-[60px] md:blur-[120px] opacity-70"></div>
            {hero.image_url && <div className="absolute inset-0 bg-slate-955/80 z-0" />}
            {hero.image_url && (
              <img
                src={hero.image_url}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay z-0"
                alt="Hero"
              />
            )}
            <div className="max-w-4xl text-center space-y-8 relative z-10">

              <h1 className="text-2xl sm:text-4xl md:text-7xl font-extrabold tracking-tight leading-tight md:leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">
                {hero.headline}
              </h1>

              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {hero.subheadline}
              </p>
              <div className="pt-4">
                <a
                  href={hero.cta_url}
                  className="min-h-11 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-105 text-slate-955 rounded-full font-bold shadow-lg hover:shadow-cyan-500/25 transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-955"
                >
                  {hero.cta_text}
                  <ArrowRight className="w-4 h-4 text-slate-955" />
                </a>
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(about) => (
          <section className="px-6 py-28 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="about">
            <div className="space-y-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 font-extrabold tracking-wider uppercase text-xs">Misi Kami</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{about.title}</h2>
              <p className="text-slate-300 leading-relaxed sm:text-justify whitespace-pre-line">{about.body}</p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500 to-teal-500 rounded-3xl opacity-10 filter blur-xl"></div>
              <div className="w-full h-80 md:h-[400px] bg-slate-900/50 border border-slate-800 rounded-3xl shadow-xl relative z-10 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-cyan-950 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <DynamicIcon name={about.icon} defaultIcon={Globe} className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-white text-xl">Inovasi Global</p>
                    <p className="text-slate-300 text-sm max-w-xs leading-relaxed">
                      Kami membangun produk berkualitas tinggi dengan riset mendalam demi memberikan pengalaman terbaik.
                    </p>
                  </div>
                </div>
                {about.image_url && (
                  <img
                    src={about.image_url}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-cover absolute inset-0 z-10"
                    alt="About"
                  />
                )}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(benefits) => (
          <section className="bg-slate-900/30 border-y border-slate-900 px-6 py-28" id="benefits">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-3">
                <span className="text-cyan-400 font-extrabold tracking-wider uppercase text-xs">Teknologi</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{benefits.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.items?.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-cyan-500 p-8 rounded-3xl transition-all duration-300 group">
                    <div className="w-12 h-12 bg-cyan-950 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 border border-cyan-800/40">
                      <DynamicIcon name={item.icon} defaultIcon={Check} className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    faq: (
      <MemoPreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={faq} render={(faq) => (
          <section className="px-6 py-28 max-w-4xl mx-auto space-y-16" id="faq">
            <div className="text-center space-y-2">
              <span className="text-cyan-400 font-extrabold tracking-wider uppercase text-xs">Pusat Bantuan</span>
              <h2 className="text-3xl font-extrabold tracking-tight">{faq.title}</h2>
            </div>
            <div className="space-y-4">
              {faq.items?.map((item, idx) => (
                <FaqAccordion key={idx} item={item} isDark={true} />
              ))}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    cta: (
      <MemoPreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={cta} render={(cta) => (
          <section className="px-6 py-16 max-w-6xl mx-auto">
            <div className="relative bg-slate-900 border border-slate-800 p-8 md:p-16 rounded-3xl text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-cyan-500/5 rounded-full filter blur-[50px] md:blur-[100px]"></div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{cta.headline}</h2>
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:brightness-110 text-slate-955 rounded-full font-bold shadow-lg transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    {cta.button_text}
                    <ArrowRight className="w-4 h-4 text-slate-955" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    contact: (
      <MemoPreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ contact, onSubmitLead, leadSubmitting, leadSuccess, leadError }} render={(data) => (
          <section className="px-6 py-28 bg-slate-955 border-t border-slate-900" id="contact">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold tracking-tight">{data.contact.title}</h2>
                <div className="space-y-4 text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <p>{data.contact.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <p>{data.contact.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <p>{data.contact.email}</p>
                  </div>
                </div>
                {data.contact.maps_url && (
                  <div className="pt-4">
                    <a
                      href={data.contact.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1.5"
                    >
                      <Globe className="w-4 h-4" />
                      Buka Lokasi Kantor
                    </a>
                  </div>
                )}
              </div>
              {data.contact.show_lead_form && data.onSubmitLead && (
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-6">Hubungi Kami Langsung</h3>
                  <LeadForm
                    onSubmit={data.onSubmitLead}
                    submitting={data.leadSubmitting}
                    success={data.leadSuccess}
                    error={data.leadError}
                    buttonClass="bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-955 rounded-xl"
                    inputClass="w-full px-4 py-2.5 bg-slate-955/50 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl outline-none text-sm text-slate-100 transition-all"
                  />
                </div>
              )}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(catalogData) => (
          <section className="px-5 sm:px-6 py-24 border-y border-slate-800 bg-slate-900/20" id="catalog">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-2">
                <span className="text-cyan-400 font-extrabold tracking-wider uppercase text-xs">Koleksi</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{catalogData.title}</h2>
              </div>
              {catalogData.categories?.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-6">
                  <h3 className="text-base font-bold text-cyan-400 border-b border-slate-800 pb-2 uppercase tracking-wide">{cat.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {cat.items?.map((item, itemIdx) => {
                      const itemId = `${cat.name}__${item.name}__${catIdx}_${itemIdx}`;
                      return (
                        <div key={itemIdx} className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-44 object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          ) : (
                            <div className="w-full h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                              <ImageIcon className="w-10 h-10 text-slate-700" />
                            </div>
                          )}
                          <div className="p-4 space-y-2 flex-1 flex flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-white text-sm leading-tight">{item.name}</h4>
                              {item.badge && (
                                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{item.badge}</span>
                              )}
                            </div>
                            {item.description && <p className="text-slate-400 text-xs leading-relaxed flex-1">{item.description}</p>}
                            {item.price && !isPlaceholderPrice(item.price) && (
                              <p className="text-cyan-400 font-bold text-sm">{item.price}</p>
                            )}
                            <AddToCartButton
                              itemId={itemId}
                              itemName={item.name}
                              itemPrice={item.price}
                              category={cat.name}
                              className="mt-1 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 focus:ring-offset-slate-900"
                              style={{ background: "#06b6d4", color: "#0f172a" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,
  } as Record<string, React.ReactNode>;

  const waPhone = contact?.phone ?? "";

  return (
    <CartProvider waPhone={waPhone} brandName={header?.brand_name} previewMode={isEditorMode}>
    <div className="bg-slate-955 text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden min-h-screen">
      {/* Navbar mock */}
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, icon: header?.icon, tagline: header?.tagline }} render={(headerData) => (
          <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-955/80 border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative">
            <span className="min-w-0 text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 tracking-wider flex items-center gap-2">
              <LogoImage
                url={headerData.logo_url}
                icon={headerData.icon}
                defaultIcon={Zap}
                iconClass="w-5 h-5 text-cyan-400 fill-cyan-400/20"
                imgClass="h-8 w-auto object-contain"
              />
              <span className="min-w-0">
                <span className="truncate block">{headerData.brand_name || "Brand Kami"}</span>
                {headerData.tagline && <span className="block text-[10px] font-normal text-cyan-400/60 tracking-wide truncate">{headerData.tagline}</span>}
              </span>
            </span>
            <NavMenu
              sectionOrder={sectionOrder}
              hiddenSections={dt?.layout?.hidden_sections}
              linkClass="text-slate-300"
              drawerStyle={{ background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.08)" }}
            />
            <a href="#contact" aria-label={`Hubungi ${headerData.brand_name || "brand ini"}`} className="min-h-11 shrink-0 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-955 rounded-full text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)] inline-flex items-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950">
              {headerData.nav_cta_text || "Hubungi Kami"}
            </a>
          </header>
        )} />
      </MemoPreviewSectionWrapper>

      {/* Dynamic Section Order */}
      {sectionOrder.filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key)).map((key) => sectionNodes[key] ?? null)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: footer?.brand_name, tagline: footer?.tagline, copyright_text: footer?.copyright_text, brand_name_fallback: header?.brand_name }} render={(footerData) => {
          const displayBrand = footerData.brand_name || footerData.brand_name_fallback || "Bisnis Produk Kami";
          const displayTagline = footerData.tagline || "Kualitas produk terbaik untuk memenuhi kenyamanan Anda";
          return (
            <footer className="bg-slate-955 text-slate-650 text-center py-10 text-xs border-t border-slate-900 space-y-1">
              <p className="text-sm font-bold text-slate-400">{displayBrand}</p>
              <p className="text-slate-650">{displayTagline}</p>
              <p>{footerData.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}</p>
            </footer>
          );
        }} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && (
        <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={seo} render={(seoData) => (
            <SeoEditorPreview seo={seoData} />
          )} />
        </MemoPreviewSectionWrapper>
      )}
      {/* Floating cart button */}
      {!isEditorMode && <CartFab colorStyle={{ background: "#06b6d4", color: "#0f172a" }} />}
    </div>
    </CartProvider>
  );
};

// ==========================================================
// FAQ Accordion Helper Component
// ==========================================
const FaqAccordion: React.FC<{ item: FaqItem; isDark?: boolean }> = ({ item, isDark = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reactId = useId();
  const answerId = `faq-answer-${reactId}`;

  return (
    <div
      className={`border rounded-2xl transition-all overflow-hidden ${isDark
        ? "border-slate-800 bg-slate-900/40 hover:bg-slate-900/60"
        : "border-[#EADFCB] bg-[#FAF7F2]/40 hover:bg-white"
        }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="w-full px-6 py-4 flex items-center justify-between gap-4 font-bold text-left cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-current"
      >
        <span className={isDark ? "text-white text-sm md:text-base" : "text-amber-950 text-sm md:text-base"}>
          {item.question}
        </span>
        {isOpen ? (
          <ChevronUp className={`w-5 h-5 flex-shrink-0 ${isDark ? "text-cyan-400" : "text-amber-800"}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 flex-shrink-0 ${isDark ? "text-slate-500" : "text-amber-600"}`} />
        )}
      </button>
      {isOpen && (
        <div id={answerId} className={`px-6 pb-5 pt-1 text-sm leading-relaxed border-t ${isDark
          ? "text-slate-300 border-slate-800 bg-slate-950/20"
          : "text-[#6D5D50] border-[#EADFCB]/50 bg-amber-50/10"
          }`}>
          {item.answer}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. TEMPLATE_DYNAMIC - CSS Variable Engine
// ==========================================

// Helper: build CSS variables string from a design token
function buildCssVars(dt: DesignToken | null | undefined): Record<string, string> {
  const p = dt?.palette;
  const ty = dt?.typography;
  const la = dt?.layout;

  const spacingMap: Record<string, string> = {
    compact: "4rem",
    normal: "5rem",
    relaxed: "7rem",
  };
  const radiusMap: Record<string, string> = {
    sharp: "0px",
    soft: "8px",
    rounded: "20px",
  };

  const bg = p?.background ?? "#F8F9FF";

  const isDarkColor = (hex: string) => {
    const clean = (hex || "").replace("#", "").trim();
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    }
    if (clean.length === 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    }
    return false;
  };

  const isDarkBg = isDarkColor(bg);
  let surfaceVal = p?.surface ?? (isDarkBg ? "#1F2937" : "#FFFFFF");
  if (surfaceVal.toLowerCase() === bg.toLowerCase()) {
    surfaceVal = isDarkBg
      ? "color-mix(in srgb, var(--dt-bg) 92%, white)"
      : "color-mix(in srgb, var(--dt-bg) 96%, black)";
  }
  const borderVal = isDarkBg
    ? "color-mix(in srgb, var(--dt-bg) 85%, white)"
    : "color-mix(in srgb, var(--dt-bg) 88%, black)";

  const primaryColor = p?.primary ?? "#4F46E5";
  const isPrimaryDark = isDarkColor(primaryColor);
  const primaryFg = isPrimaryDark ? "#ffffff" : "#1e293b";
  const ctaText = isPrimaryDark ? "#ffffff" : "#1e293b";
  const ctaBtnBg = isPrimaryDark ? "#ffffff" : "#1e293b";
  const ctaBtnText = isPrimaryDark ? "var(--dt-primary)" : "#ffffff";

  return {
    "--dt-primary": primaryColor,
    "--dt-primary-foreground": primaryFg,
    "--dt-cta-text": ctaText,
    "--dt-cta-btn-bg": ctaBtnBg,
    "--dt-cta-btn-text": ctaBtnText,
    "--dt-accent": p?.accent ?? "#7C3AED",
    "--dt-bg": bg,
    "--dt-surface": surfaceVal,
    "--dt-border": borderVal,
    "--dt-text": p?.text ?? "#1e293b",
    "--dt-text-muted": "color-mix(in srgb, var(--dt-text) 55%, transparent)",
    "--dt-heading-font": `'${ty?.heading_font ?? "Inter"}', sans-serif`,
    "--dt-body-font": `'${ty?.body_font ?? "Inter"}', sans-serif`,
    "--dt-heading-weight": ty?.heading_weight ?? "700",
    "--dt-hero-size": ty?.heading_size_hero ?? "3rem",
    "--dt-spacing": spacingMap[la?.section_spacing ?? "normal"] ?? "5rem",
    "--dt-radius": radiusMap[la?.corner_radius ?? "soft"] ?? "8px",
    "--dt-radius-lg": la?.corner_radius === "sharp" ? "0px" : la?.corner_radius === "rounded" ? "32px" : "16px",
  };
}

function loadGoogleFont(headingFont?: string, bodyFont?: string) {
  if (typeof document === "undefined") return;
  const fonts = [headingFont, bodyFont].filter(Boolean);
  if (!fonts.length) return;
  const famStr = fonts.map((f) => f!.replace(/ /g, "+")).join("&family=");
  const id = `dt-font-${famStr}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${famStr}:wght@400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

const DynamicFaqAccordion: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reactId = useId();
  const answerId = `dtfaq-answer-${reactId}`;
  return (
    <div className="dt-faq-item" style={{ border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)", borderRadius: "var(--dt-radius)", overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={answerId}
        style={{ width: "100%", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", cursor: "pointer", fontFamily: "var(--dt-body-font)", color: "var(--dt-text)", fontWeight: 600, textAlign: "left", gap: "1rem" }}
      >
        <span style={{ fontSize: "0.9rem" }}>{item.question}</span>
        {isOpen ? <ChevronUp style={{ width: 18, height: 18, flexShrink: 0, color: "var(--dt-primary)" }} /> : <ChevronDown style={{ width: 18, height: 18, flexShrink: 0, opacity: 0.4 }} />}
      </button>
      {isOpen && (
        <div id={answerId} style={{ padding: "0 1.5rem 1.25rem", fontSize: "0.875rem", lineHeight: 1.7, color: "var(--dt-text-muted)", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)", background: "color-mix(in srgb, var(--dt-primary) 3%, transparent)" }}>
          {item.answer}
        </div>
      )}
    </div>
  );
};

const DynamicLeadForm: React.FC<{
  onSubmit: NonNullable<TemplateProps["onSubmitLead"]>;
  submitting: boolean;
  success: boolean;
  error: string | null;
}> = ({ onSubmit, submitting, success, error }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.625rem 1rem", border: "1px solid color-mix(in srgb, var(--dt-primary) 25%, #e2e8f0)",
    borderRadius: "var(--dt-radius)", outline: "none", fontSize: "0.875rem",
    background: "color-mix(in srgb, var(--dt-primary) 3%, var(--dt-surface))",
    color: "var(--dt-text)", fontFamily: "var(--dt-body-font)"
  };

  if (success) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", textAlign: "center", background: "color-mix(in srgb, var(--dt-primary) 5%, var(--dt-surface))", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)" }}>
        <div style={{ width: 48, height: 48, background: "color-mix(in srgb, var(--dt-primary) 15%, transparent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <Check style={{ width: 24, height: 24, color: "var(--dt-primary)" }} />
        </div>
        <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, color: "var(--dt-text)", marginBottom: "0.5rem" }}>Pesan Terkirim!</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--dt-text-muted)" }}>Terima kasih. Tim kami akan segera merespons.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, email, phone, message }); }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {error && <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", borderRadius: "var(--dt-radius)", color: "#991b1b", fontSize: "0.875rem" }}>{error}</div>}
      <div>
        <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginBottom: "0.375rem" }}>Nama Lengkap</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="cth. Budi Santoso" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginBottom: "0.375rem" }}>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="email@domain.com" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginBottom: "0.375rem" }}>Nomor WA</label>
          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="08xx" />
        </div>
      </div>
      <div>
        <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginBottom: "0.375rem" }}>Pesan</label>
        <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} style={{ ...inputStyle, resize: "none" }} placeholder="Tulis pesan atau pertanyaan Anda..." />
      </div>
      <button
        type="submit"
        disabled={submitting}
        style={{ padding: "0.75rem 1.5rem", background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", fontWeight: 700, fontFamily: "var(--dt-body-font)", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "opacity 0.2s", border: "none" }}
      >
        {submitting ? "Mengirim..." : <><Send style={{ width: 16, height: 16 }} /> Kirim Pesan</>}
      </button>
    </form>
  );
};

export const TemplateDynamic: React.FC<TemplateProps> = ({
  content, design_token,
  onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false
}) => {
  const dt = design_token ?? null;
  const { header, hero, about, benefits, faq, cta, contact, footer, seo } = content;
  const cssVars = buildCssVars(dt);
  const heroStyle = dt?.layout?.hero_style ?? "centered";

  // Build section order: start from design token, then append any content sections
  // that exist but weren't listed (menu, catalog) so they're never silently dropped.
  const baseSectionOrder: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "cta", "faq", "contact"];
  const extraSections = (["menu", "catalog"] as const).filter(
    (key) => content[key] && !baseSectionOrder.includes(key)
  );
  // Insert extras right before "cta" if present, otherwise before "faq", otherwise at end
  const sectionOrder = (() => {
    if (extraSections.length === 0) return baseSectionOrder;
    const order = [...baseSectionOrder];
    const insertBefore = order.indexOf("cta") >= 0 ? "cta" : order.indexOf("faq") >= 0 ? "faq" : null;
    if (insertBefore) {
      const idx = order.indexOf(insertBefore);
      order.splice(idx, 0, ...extraSections);
    } else {
      order.push(...extraSections);
    }
    return order;
  })();

  // Load Google Fonts
  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  // Style injection as inline CSS custom properties with Container Query support
  const rootStyle: any = {
    ...cssVars,
    fontFamily: "var(--dt-body-font)",
    background: "var(--dt-bg)",
    color: "var(--dt-text)",
    minHeight: "100vh",
    overflowX: "hidden",
    containerType: "inline-size",
  };

  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" }  // Section renderers
  const renderSection = (key: string) => {
    switch (key) {
      case "hero": return (
        <MemoPreviewSectionWrapper key="hero" section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ hero, dt }} render={(data) => {
            const { hero: h, dt: d } = data;
            const hStyle = d?.layout?.hero_style ?? "centered";
            return (
              <section style={{ position: "relative", minHeight: hStyle === "minimal" ? "60vh" : "85vh", display: "flex", alignItems: "center", justifyContent: hStyle === "split" ? "flex-start" : "center", padding: "5rem 1.5rem", background: hStyle === "full-bleed" ? `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 12%, var(--dt-bg)), var(--dt-bg))` : "var(--dt-bg)", overflow: "hidden" }}>
                {/* Decorative blob */}
                <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "45%", height: "80%", background: `radial-gradient(circle, color-mix(in srgb, var(--dt-primary) 20%, transparent), transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "35%", height: "60%", background: `radial-gradient(circle, color-mix(in srgb, var(--dt-accent) 12%, transparent), transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
                {h.image_url && (
                  <img
                    src={h.image_url}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, mixBlendMode: "multiply", zIndex: 1 }}
                    alt="Hero"
                  />
                )}
                <div style={{ maxWidth: hStyle === "split" ? "560px" : "800px", textAlign: hStyle === "split" ? "left" : "center", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: hStyle === "split" ? "flex-start" : "center" }}>

                  <h1 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.5rem, 6cqw, var(--dt-hero-size))", lineHeight: 1.15, color: "var(--dt-text)", margin: 0 }}>
                    {h.headline}
                  </h1>
                  <p style={{ fontSize: "clamp(0.95rem, 3.5cqw, 1.125rem)", color: "var(--dt-text-muted)", maxWidth: "36rem", lineHeight: 1.6, margin: 0 }}>
                    {h.subheadline}
                  </p>
                  {h.opening_hours && (
                    <span className="px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-semibold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--dt-surface)", borderRadius: "9999px", color: "var(--dt-primary)", border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                      <Clock style={{ width: 14, height: 14 }} />
                      {h.opening_hours}
                    </span>
                  )}
                  <a href={h.cta_url} className="px-4 py-2.5 md:px-8 md:py-3.5 text-xs md:text-base font-bold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", textDecoration: "none", transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    {h.cta_text} <ArrowRight style={{ width: 18, height: 18 }} />
                  </a>
                </div>
              </section>
            );
          }} />
        </MemoPreviewSectionWrapper>
      );

      case "about": return (
        <MemoPreviewSectionWrapper key="about" section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ about, dt }} render={(data) => {
            const { about: a } = data;
            return (
              <section id="about" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Mengenal Kami</span>
                  <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", margin: 0 }}>{a.title}</h2>
                  <p style={{ color: "var(--dt-text-muted)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>{a.body}</p>
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", inset: "-1rem", background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 20%, transparent), color-mix(in srgb, var(--dt-accent) 10%, transparent))`, borderRadius: "var(--dt-radius-lg)", transform: "rotate(-2deg)", opacity: 0.5 }} />
                  <div style={{ position: "relative", width: "100%", height: "320px", background: `color-mix(in srgb, var(--dt-primary) 6%, var(--dt-surface))`, border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`, borderRadius: "var(--dt-radius-lg)", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", padding: "2rem", textAlign: "center", background: "linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 12%, transparent), color-mix(in srgb, var(--dt-accent) 25%, transparent))", position: "absolute", inset: 0 }}>
                      <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: `radial-gradient(var(--dt-primary) 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
                      <div style={{ background: "var(--dt-surface)", width: "5rem", height: "5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px color-mix(in srgb, var(--dt-primary) 20%, transparent)", position: "relative", zIndex: 1 }}>
                        <span style={{ color: "var(--dt-primary)" }}><DynamicIcon name={a.icon} defaultIcon={Award} className="w-8 h-8" /></span>
                      </div>
                      <div style={{ position: "relative", zIndex: 1, background: "color-mix(in srgb, var(--dt-surface) 50%, transparent)", backdropFilter: "blur(4px)", padding: "0.5rem 1rem", borderRadius: "2rem" }}>
                        <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.9rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{a.title}</p>
                      </div>
                    </div>
                    {a.image_url && (
                      <img
                        src={a.image_url}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 2 }}
                        alt="About"
                      />
                    )}
                  </div>
                </div>
              </section>
            );
          }} />
        </MemoPreviewSectionWrapper>
      );

      case "benefits": return (
        <MemoPreviewSectionWrapper key="benefits" section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ benefits, dt }} render={(data) => {
            const { benefits: b } = data;
            return (
              <section id="benefits" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 5%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
                <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
                  <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Keunggulan</span>
                    <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{b.title}</h2>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
                    {b.items?.map((item, idx) => (
                      <div key={idx} style={{ background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`, borderRadius: "var(--dt-radius-lg)", padding: "2rem", display: "flex", flexDirection: "column", gap: "0.875rem", transition: "box-shadow 0.2s, transform 0.2s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px color-mix(in srgb, var(--dt-primary) 15%, transparent)`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                      >
                        {item.stat ? (
                          <div>
                            <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "2rem", color: "var(--dt-primary)", margin: 0 }}>{item.stat}</p>
                            {item.stat_label && <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)" }}>{item.stat_label}</p>}
                          </div>
                        ) : (
                          <div style={{ width: 44, height: 44, background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`, borderRadius: "var(--dt-radius)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ color: "var(--dt-primary)", display: "contents" }}><DynamicIcon name={item.icon} defaultIcon={Star} className="w-5 h-5" /></span>
                          </div>
                        )}
                        <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "1.05rem", margin: 0 }}>{item.title}</h3>
                        <p style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }} />
        </MemoPreviewSectionWrapper>
      );

      case "faq": return (
        <MemoPreviewSectionWrapper key="faq" section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ faq, dt }} render={(data) => {
            const { faq: f } = data;
            return (
              <section id="faq" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, maxWidth: "52rem", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Pertanyaan Umum</span>
                  <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{f.title}</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {f.items?.map((item, idx) => <DynamicFaqAccordion key={idx} item={item} />)}
                </div>
              </section>
            );
          }} />
        </MemoPreviewSectionWrapper>
      );

      case "cta": return (
        <MemoPreviewSectionWrapper key="cta" section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ cta, dt }} render={(data) => {
            const { cta: c } = data;
            return (
              <section style={{ padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
                <div className="px-4 py-8 md:px-8 md:py-16" style={{ background: `linear-gradient(135deg, var(--dt-primary), color-mix(in srgb, var(--dt-accent) 80%, var(--dt-primary)))`, borderRadius: "var(--dt-radius-lg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "50%", height: "150%", background: "rgba(255,255,255,0.06)", borderRadius: "50%", pointerEvents: "none" }} />
                  <div style={{ position: "relative", zIndex: 1, maxWidth: "36rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
                    <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-cta-text)", margin: 0 }}>{c.headline}</h2>
                    <a href={c.button_url} className="px-6 py-2.5 md:px-10 md:py-3.5 text-xs md:text-base font-bold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--dt-cta-btn-bg)", color: "var(--dt-cta-btn-text)", borderRadius: "var(--dt-radius)", textDecoration: "none", transition: "opacity 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      {c.button_text} <ArrowRight style={{ width: 16, height: 16 }} />
                    </a>
                  </div>
                </div>
              </section>
            );
          }} />
        </MemoPreviewSectionWrapper>
      );

      case "contact": return (
        <MemoPreviewSectionWrapper key="contact" section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ contact, onSubmitLead, leadSubmitting, leadSuccess, leadError, dt }} render={(data) => {
            const { contact: c, onSubmitLead: osl, leadSubmitting: ls, leadSuccess: lsc, leadError: le } = data;
            return (
              <section id="contact" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" style={{ maxWidth: "72rem", margin: "0 auto" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.25rem, 4.5cqw, 2rem)", color: "var(--dt-text)", margin: 0 }}>{c.title}</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                      {[
                        { icon: MapPin, text: c.address },
                        { icon: Phone, text: c.phone },
                        { icon: Mail, text: c.email },
                      ].map(({ icon: Icon, text }) => text && (
                        <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                          <Icon style={{ width: 18, height: 18, color: "var(--dt-primary)", marginTop: 2, flexShrink: 0 }} />
                          <span style={{ color: "var(--dt-text-muted)", fontSize: "0.9rem" }}>{text}</span>
                        </div>
                      ))}
                    </div>
                    {c.maps_url && (
                      <a href={c.maps_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--dt-primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
                        <Globe style={{ width: 15, height: 15 }} /> Buka Google Maps
                      </a>
                    )}
                  </div>
                  {c.show_lead_form && osl && (
                    <div style={{ background: "var(--dt-surface)", padding: "2rem", borderRadius: "var(--dt-radius-lg)", border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                      <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", marginBottom: "1.5rem", marginTop: 0 }}>Hubungi Kami</h3>
                      <DynamicLeadForm onSubmit={osl} submitting={ls} success={lsc} error={le} />
                    </div>
                  )}
                </div>
              </section>
            );
          }} />
        </MemoPreviewSectionWrapper>
      );

      default: return null;
    }
  };

  const sectionNodes = {
    hero: renderSection("hero"),
    about: renderSection("about"),
    benefits: renderSection("benefits"),
    faq: renderSection("faq"),
    cta: renderSection("cta"),
    contact: renderSection("contact"),
    menu: content.menu ? (
      <MemoPreviewSectionWrapper key="menu" section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={content.menu} render={(menuData) => (
          <section id="menu" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
            <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Pilihan Kami</span>
                <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{menuData.title}</h2>
              </div>
              {menuData.categories?.map((cat, catIdx) => (
                <div key={catIdx} style={{ marginBottom: "3rem" }}>
                  <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-primary)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`, paddingBottom: "0.625rem", marginBottom: "1.5rem" }}>{cat.name}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
                    {cat.items?.map((item, itemIdx) => (
                      <div key={itemIdx} style={{ background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, borderRadius: "var(--dt-radius-lg)", overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px color-mix(in srgb, var(--dt-primary) 12%, transparent)`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                      >
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "11rem", objectFit: "cover", display: "block" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                          <div style={{ width: "100%", height: "11rem", background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface)), color-mix(in srgb, var(--dt-accent) 8%, var(--dt-surface)))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Utensils style={{ width: 36, height: 36, color: "var(--dt-primary)", opacity: 0.3 }} />
                          </div>
                        )}
                        <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                            <h4 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.9rem", margin: 0 }}>{item.name}</h4>
                            {item.price && !isPlaceholderPrice(item.price) && <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--dt-primary)", background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`, padding: "0.2rem 0.625rem", borderRadius: "9999px", whiteSpace: "nowrap", flexShrink: 0 }}>{item.price}</span>}
                          </div>
                          {item.description && <p style={{ color: "var(--dt-text-muted)", fontSize: "0.8rem", lineHeight: 1.5, margin: 0, flex: 1 }}>{item.description}</p>}
                          <AddToCartButton
                            itemId={`${cat.name}__${item.name}__${catIdx}_${itemIdx}`}
                            itemName={item.name}
                            itemPrice={item.price}
                            category={cat.name}
                            className="flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-opacity hover:opacity-80 active:scale-95 focus:outline-none"
                            style={{ marginTop: "0.625rem", padding: "0.5rem 0.875rem", background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", border: "none", fontFamily: "var(--dt-body-font)" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,
    catalog: content.catalog ? (
      <MemoPreviewSectionWrapper key="catalog" section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={content.catalog} render={(catalogData) => (
          <section id="catalog" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
            <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>Produk Kami</span>
                <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>{catalogData.title}</h2>
              </div>
              {catalogData.categories?.map((cat, catIdx) => (
                <div key={catIdx} style={{ marginBottom: "3rem" }}>
                  <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-primary)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`, paddingBottom: "0.625rem", marginBottom: "1.5rem" }}>{cat.name}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem" }}>
                    {cat.items?.map((item, itemIdx) => (
                      <div key={itemIdx} style={{ background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, borderRadius: "var(--dt-radius-lg)", overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px color-mix(in srgb, var(--dt-primary) 15%, transparent)`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                      >
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "11rem", objectFit: "cover", display: "block" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                          <div style={{ width: "100%", height: "11rem", background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface)), color-mix(in srgb, var(--dt-accent) 8%, var(--dt-surface)))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ImageIcon style={{ width: 36, height: 36, color: "var(--dt-primary)", opacity: 0.3 }} />
                          </div>
                        )}
                        <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.375rem", flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                            <h4 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.875rem", margin: 0 }}>{item.name}</h4>
                            {item.badge && <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--dt-primary)", background: `color-mix(in srgb, var(--dt-primary) 12%, transparent)`, border: `1px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)`, padding: "0.15rem 0.5rem", borderRadius: "9999px", whiteSpace: "nowrap", flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.badge}</span>}
                          </div>
                          {item.description && <p style={{ color: "var(--dt-text-muted)", fontSize: "0.78rem", lineHeight: 1.5, margin: 0, flex: 1 }}>{item.description}</p>}
                          {item.price && !isPlaceholderPrice(item.price) && <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-primary)", fontSize: "0.9rem", margin: 0 }}>{item.price}</p>}
                          <AddToCartButton
                            itemId={`${cat.name}__${item.name}__${catIdx}_${itemIdx}`}
                            itemName={item.name}
                            itemPrice={item.price}
                            category={cat.name}
                            className="flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-opacity hover:opacity-80 active:scale-95 focus:outline-none"
                            style={{ marginTop: "0.375rem", padding: "0.5rem 0.875rem", background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", border: "none", fontFamily: "var(--dt-body-font)" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,
  } as Record<string, React.ReactNode>;

  return (
    <div style={rootStyle}>
      {/* Header */}
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ header, dt }} render={(data) => {
          const { header: h } = data;
          return (
            <header className="sticky top-0 z-50 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-2 md:gap-4 relative" style={{ background: `color-mix(in srgb, var(--dt-bg) 85%, transparent)`, borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)` }}>
              <span className="flex items-center gap-1.5 md:gap-2 min-w-0 text-sm md:text-lg font-bold" style={{ display: "flex", alignItems: "center", fontFamily: "var(--dt-heading-font)", color: "var(--dt-text)" }}>
                <LogoImage url={h?.logo_url} icon={h?.icon} defaultIcon={Globe} iconClass="" imgClass="h-8 w-auto object-contain" />
                <span style={{ overflow: "hidden" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{h?.brand_name || "Brand Kami"}</span>
                  {h?.tagline && <span style={{ display: "block", fontSize: "0.65rem", fontFamily: "var(--dt-body-font)", color: "var(--dt-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.tagline}</span>}
                </span>
              </span>
              <NavMenu
                sectionOrder={sectionOrder}
                hiddenSections={dt?.layout?.hidden_sections}
                linkClass=""
                drawerStyle={{ background: "var(--dt-surface, #fff)", borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)` }}
              />
              <a href="#contact" className="px-3 py-1.5 md:px-5 md:py-2 text-[11px] md:text-sm font-semibold flex-shrink-0 transition-opacity hover:opacity-85" style={{ background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {h?.nav_cta_text || "Hubungi Kami"}
              </a>
            </header>
          );
        }} />
      </MemoPreviewSectionWrapper>

      {/* Dynamic Section Order */}
      {sectionOrder.filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key)).map((key) => sectionNodes[key] ?? null)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ footer, brand_name_fallback: header?.brand_name, dt }} render={(data) => {
          const { footer: f, brand_name_fallback: bFallback } = data;
          const displayBrand = f?.brand_name || bFallback || "Bisnis Kami";
          const displayTagline = f?.tagline || "Memberikan layanan dan produk terbaik untuk memenuhi kebutuhan Anda";
          return (
            <footer style={{
              background: "color-mix(in srgb, var(--dt-bg) 95%, var(--dt-text))",
              color: "var(--dt-text-muted)",
              textAlign: "center",
              padding: "2.5rem 1.5rem",
              borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
              fontSize: "0.8rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem"
            }}>
              <p style={{ fontWeight: 700, color: "var(--dt-text)", margin: 0 }}>{displayBrand}</p>
              <p style={{ color: "var(--dt-text-muted)", margin: 0, opacity: 0.85 }}>{displayTagline}</p>
              <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.7 }}>
                {f?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}
              </p>
            </footer>
          );
        }} />
      </MemoPreviewSectionWrapper>

      {isEditorMode && (
        <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ seo, dt }} render={(data) => {
            const { seo: s } = data;
            return <SeoEditorPreview seo={s} />;
          }} />
        </MemoPreviewSectionWrapper>
      )}
      {/* Floating cart button — uses design token primary color */}
      {!isEditorMode && <CartFab />}
    </div>
  );
};

export function TemplateDynamicWithCart(props: TemplateProps & { previewMode?: boolean }) {
  const waPhone = props.content?.contact?.phone ?? "";
  const brandName = props.content?.header?.brand_name;
  return (
    <CartProvider waPhone={waPhone} brandName={brandName} previewMode={props.previewMode}>
      <TemplateDynamic {...props} />
    </CartProvider>
  );
}
