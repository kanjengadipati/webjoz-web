"use client";

import React, { useId, useState } from "react";
import {
  Check, ArrowRight, ChevronDown, ChevronUp, Star, Menu, X, Send,
  Sparkles, MapPin, Phone, Mail, Globe,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CartProvider, CartFab, AddToCartButton, isPlaceholderPrice } from "@/components/cart";

import type { TestimonialItem, FaqItem } from "./types";

// ─── Nav Menu ─────────────────────────────────────────────────────────────────

const NAV_SKIP = new Set(["header", "hero", "footer", "seo"]);

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
  linkClass?: string;
  activeColor?: string;
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

      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer focus:outline-none ${linkClass}`}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

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

// ─── WhatsApp Floating Button ────────────────────────────────────────────────

const WAFloatingButton: React.FC<{ phone: string; isEditorMode?: boolean }> = ({ phone, isEditorMode }) => {
  if (isEditorMode || !phone) return null;
  const digits = phone.replace(/\D/g, "");
  const waUrl = digits.startsWith("0") ? `https://wa.me/62${digits.slice(1)}` : `https://wa.me/${digits}`;
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-[150] flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      style={{ background: "#25D366" }}
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
};

// ─── Back To Top ──────────────────────────────────────────────────────────────

const BackToTop: React.FC<{ isEditorMode?: boolean }> = ({ isEditorMode }) => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (isEditorMode) return;
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isEditorMode]);
  if (isEditorMode || !visible) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Kembali ke atas"
      className="fixed bottom-24 right-6 z-[150] w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>
    </button>
  );
};

// ─── Nav CTA href helper ─────────────────────────────────────────────────────

function navCtaHref(navCtaText?: string): string {
  const lower = (navCtaText || "").toLowerCase();
  if (lower.includes("katalog") || lower.includes("produk") || lower.includes("catalog")) return "#catalog";
  if (lower.includes("menu") || lower.includes("meja") || lower.includes("pesan")) return "#menu";
  if (lower.includes("tentang") || lower.includes("about")) return "#about";
  if (lower.includes("keunggulan") || lower.includes("benefit")) return "#benefits";
  return "#contact";
}

// ─── Shared Testimonials Section ─────────────────────────────────────────────

interface TestimonialsSectionProps {
  testimonials?: { title: string; eyebrow?: string; items: TestimonialItem[] };
  headingClass?: string;
  eyebrowClass?: string;
  eyebrowStyle?: React.CSSProperties;
  cardStyle?: React.CSSProperties;
  cardClass?: string;
  quoteClass?: string;
  quoteStyle?: React.CSSProperties;
  nameClass?: string;
  roleClass?: string;
  roleStyle?: React.CSSProperties;
  bgClass?: string;
  sectionStyle?: React.CSSProperties;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials, headingClass = "text-slate-900", eyebrowClass = "text-primary",
  eyebrowStyle, quoteStyle, roleStyle,
  cardClass = "bg-white border border-slate-200", quoteClass = "text-slate-700",
  nameClass = "text-slate-900", roleClass = "text-slate-500",
  bgClass = "bg-slate-50 py-20 px-5 sm:px-6", cardStyle, sectionStyle,
}) => {
  if (!testimonials?.items?.length) return null;
  return (
    <section id="testimonials" className={bgClass} style={sectionStyle}>
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          {testimonials.eyebrow && <span className={`text-xs font-bold uppercase tracking-widest block ${eyebrowClass}`} style={eyebrowStyle || (eyebrowClass ? undefined : { color: "var(--dt-primary)", letterSpacing: "0.15em" })}>{testimonials.eyebrow}</span>}
          <h2 className={`text-3xl md:text-4xl font-bold ${headingClass}`} style={headingClass ? undefined : { fontFamily: "var(--dt-heading-font)", color: "var(--dt-text)" }}>{testimonials.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.items.map((t, idx) => (
            <div key={idx} className={`${cardClass} rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200`} style={cardStyle}>
              <div className={`text-4xl leading-none font-serif opacity-30 ${nameClass}`} style={nameClass ? undefined : { color: "var(--dt-primary)" }}>"</div>
              <p className={`text-sm leading-relaxed flex-1 ${quoteClass}`} style={quoteStyle || (quoteClass ? undefined : { color: "var(--dt-text-muted)" })}>{t.quote}</p>
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: cardStyle ? "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)" : undefined }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: t.avatar_color || "var(--primary)" }}
                >
                  {t.avatar_initials}
                </div>
                <div>
                  <p className={`text-sm font-bold leading-tight ${nameClass}`} style={nameClass ? undefined : { color: "var(--dt-text)", fontFamily: "var(--dt-heading-font)" }}>{t.name}</p>
                  <p className={`text-xs ${roleClass}`} style={roleStyle || (roleClass ? undefined : { color: "var(--dt-text-muted)" })}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Menu Catalog Card ────────────────────────────────────────────────────────

interface MenuCatalogCardProps {
  itemId: string;
  itemName: string;
  itemPrice?: string | null;
  itemDescription?: string | null;
  category: string;
  image_url?: string | null;
  badge?: string | null;
  icon: React.ElementType;
  layout?: "grid" | "compact";
  className?: string;
  style?: React.CSSProperties;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
  placeholderClassName?: string;
  placeholderStyle?: React.CSSProperties;
  placeholderIconClassName?: string;
  placeholderIconStyle?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  headerClassName?: string;
  headerStyle?: React.CSSProperties;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
  descriptionClassName?: string;
  descriptionStyle?: React.CSSProperties;
  priceClassName?: string;
  priceStyle?: React.CSSProperties;
  badgeClassName?: string;
  badgeStyle?: React.CSSProperties;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
}

function MenuCatalogCard({
  itemId, itemName, itemPrice, itemDescription, category, image_url, badge, icon,
  layout = "grid", className, style, imageClassName, imageStyle, placeholderClassName,
  placeholderStyle, placeholderIconClassName, placeholderIconStyle, contentClassName,
  contentStyle, headerClassName, headerStyle, titleClassName, titleStyle,
  descriptionClassName, descriptionStyle, priceClassName, priceStyle, badgeClassName,
  badgeStyle, buttonClassName, buttonStyle,
}: MenuCatalogCardProps) {
  const showPrice = itemPrice && !isPlaceholderPrice(itemPrice);
  const imageNode = image_url ? (
    <img src={image_url} alt={itemName} className={imageClassName} style={imageStyle} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
  ) : (
    <div className={placeholderClassName} style={placeholderStyle}>
      {React.createElement(icon, { className: placeholderIconClassName, style: placeholderIconStyle })}
    </div>
  );

  const header = (
    <div className={headerClassName} style={headerStyle}>
      <div className="min-w-0">
        {badge && <span className={badgeClassName} style={badgeStyle}>{badge}</span>}
        <h4 className={titleClassName} style={titleStyle}>{itemName}</h4>
      </div>
      {showPrice && <span className={priceClassName} style={priceStyle}>{itemPrice}</span>}
    </div>
  );

  if (layout === "compact") {
    return (
      <div className={className} style={style}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{imageNode}</div>
          <div className="min-w-0 flex-1" style={contentStyle}>
            {header}
            {itemDescription && <p className={descriptionClassName} style={descriptionStyle}>{itemDescription}</p>}
            <AddToCartButton
              itemId={itemId} itemName={itemName} itemPrice={itemPrice ?? null}
              category={category} className={buttonClassName} style={buttonStyle}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {imageNode}
      <div className={contentClassName} style={contentStyle}>
        {header}
        {itemDescription && <p className={descriptionClassName} style={descriptionStyle}>{itemDescription}</p>}
        <AddToCartButton
          itemId={itemId} itemName={itemName} itemPrice={itemPrice ?? null}
          category={category} className={buttonClassName} style={buttonStyle}
        />
      </div>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

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

// ─── Lead Form ────────────────────────────────────────────────────────────────

interface LeadFormProps {
  onSubmit: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>;
  submitting: boolean;
  success: boolean;
  error: string | null;
  buttonClass: string;
  inputClass: string;
  buttonStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, submitting, success, error, buttonClass, inputClass, buttonStyle, inputStyle }) => {
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
          type="text" required value={name} onChange={(e) => setName(e.target.value)}
          placeholder="cth. Budi Santoso" className={inputClass} style={inputStyle}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="cth. budi@email.com" className={inputClass} style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Nomor WA</label>
          <input
            type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="cth. 08123456789" className={inputClass} style={inputStyle}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Pesan Anda</label>
        <textarea
          required rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan atau pertanyaan Anda di sini..." className={inputClass} style={inputStyle}
        ></textarea>
      </div>
      <button
        type="submit" disabled={submitting}
        className={`${buttonClass} w-full min-h-11 py-3 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2`}
        style={buttonStyle}
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

// ─── Dynamic Icon Helper ──────────────────────────────────────────────────────

const DynamicIcon = ({ name, defaultIcon, className }: { name?: string; defaultIcon: any; className?: string }) => {
  if (name) {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) return <IconComponent className={className} />;
  }
  const Default = defaultIcon;
  return <Default className={className} />;
};

// ─── Logo Image with Fallback ────────────────────────────────────────────────

const LogoImage = ({ url, icon, defaultIcon, iconClass, imgClass }: {
  url?: string; icon?: string; defaultIcon: any; iconClass: string; imgClass: string;
}) => {
  const [imgError, setImgError] = useState(false);
  if (url && !imgError) {
    return <img src={url} className={imgClass} alt="Logo" onError={() => setImgError(true)} />;
  }
  return <DynamicIcon name={icon} defaultIcon={defaultIcon} className={iconClass} />;
};

// ─── SEO Editor Preview ───────────────────────────────────────────────────────

const SeoEditorPreview = ({ seo }: { seo?: { title?: string; description?: string; favicon_url?: string; og_image_url?: string } }) => (
  <section className="bg-[#0d0f14] px-5 py-8 border-t border-white/5">
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Info banner */}
      <div className="flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-[11px]" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
        <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 16v-4M12 8h.01"/></svg>
        <span className="text-indigo-300 leading-relaxed">SEO tidak tampil di halaman publik — hanya dibaca mesin pencari & saat link dibagikan.</span>
      </div>

      {/* Google search preview */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-2">Preview di Google</p>
        <div className="rounded-xl p-4 space-y-1" style={{ background: "#fff", border: "1px solid #e2e8f0" }}>
          {/* Favicon + URL bar */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-[8px] text-slate-500 font-bold">W</span>
            </div>
            <span className="text-[11px] text-slate-500 truncate">webjoz.id › bisnis</span>
          </div>
          {/* Title */}
          <p className="text-[15px] font-medium leading-snug truncate" style={{ color: "#1a0dab" }}>
            {seo?.title || <span className="text-slate-300 italic">Tambahkan SEO title...</span>}
          </p>
          {/* Description */}
          <p className="text-[12px] leading-relaxed" style={{ color: "#4d5156" }}>
            {seo?.description
              ? (seo.description.length > 160 ? seo.description.slice(0, 157) + "..." : seo.description)
              : <span className="text-slate-400 italic">Tambahkan meta description...</span>
            }
          </p>
          {/* Char counters */}
          <div className="flex gap-4 pt-1">
            <span className={`text-[10px] font-mono ${(seo?.title?.length || 0) > 60 ? "text-red-500" : "text-slate-400"}`}>
              Title: {seo?.title?.length || 0}/60
            </span>
            <span className={`text-[10px] font-mono ${(seo?.description?.length || 0) > 155 ? "text-red-500" : "text-slate-400"}`}>
              Desc: {seo?.description?.length || 0}/155
            </span>
          </div>
        </div>
      </div>

      {/* OG / WhatsApp share preview */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-2">Preview saat link dibagikan (WhatsApp / Sosmed)</p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {seo?.og_image_url
            ? <img src={seo.og_image_url} alt="OG" className="w-full h-36 object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            : <div className="w-full h-28 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                <span className="text-[11px] text-slate-600">Tidak ada OG image</span>
              </div>
          }
          <div className="px-3 py-2.5 space-y-0.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">webjoz.id</p>
            <p className="text-[12px] font-semibold text-slate-200 leading-tight truncate">{seo?.title || "–"}</p>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{seo?.description || "–"}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
);

// ─── Contact Section ───────────────────────────────────────────────────────────

interface ContactSectionProps {
  title?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  mapsUrl?: string | null;
  align?: "left" | "center" | "right" | null;
  showLeadForm?: boolean | null;
  onSubmitLead?: ((data: { name: string; email: string; phone: string; message: string }) => Promise<void>) | null;
  leadSubmitting?: boolean | null;
  leadSuccess?: boolean | null;
  leadError?: string | null;
  wrapperClass?: string;
  wrapperStyle?: React.CSSProperties;
  titleClass?: string;
  titleStyle?: React.CSSProperties;
  accentColor?: string;
  textClass?: string;
  textStyle?: React.CSSProperties;
  leadCardClass?: string;
  leadCardStyle?: React.CSSProperties;
  leadTitleClass?: string;
  leadTitleStyle?: React.CSSProperties;
  leadTitleText?: string;
  leadFormBtnClass?: string;
  leadFormBtnStyle?: React.CSSProperties;
  leadFormInputClass?: string;
  leadFormInputStyle?: React.CSSProperties;
  mapsLinkClass?: string;
  mapsLinkStyle?: React.CSSProperties;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  title, address, phone, email, mapsUrl,
  align = "center",
  showLeadForm, onSubmitLead, leadSubmitting, leadSuccess, leadError,
  wrapperClass = "py-16 px-6", wrapperStyle,
  titleClass = "text-2xl font-bold", titleStyle,
  accentColor = "currentColor",
  textClass = "text-sm", textStyle,
  leadCardClass, leadCardStyle,
  leadTitleClass, leadTitleStyle, leadTitleText = "Hubungi Kami",
  leadFormBtnClass, leadFormBtnStyle,
  leadFormInputClass, leadFormInputStyle,
  mapsLinkClass, mapsLinkStyle,
}) => {
  const hasLeadForm = Boolean(showLeadForm && onSubmitLead);
  const effectiveAlign = align || "center";
  const textAlignClass = effectiveAlign === "left" ? "text-left" : effectiveAlign === "right" ? "text-right" : "text-center";
  const alignItemsClass = effectiveAlign === "left" ? "items-start" : effectiveAlign === "right" ? "items-end" : "items-center";
  const justifyClass = effectiveAlign === "left" ? "justify-start" : effectiveAlign === "right" ? "justify-end" : "justify-center";
  const isCenter = effectiveAlign === "center";
  const containerWidthClass = hasLeadForm ? "max-w-5xl" : isCenter ? "max-w-xl" : "max-w-5xl";
  const containerMarginClass = isCenter ? "mx-auto" : effectiveAlign === "left" ? "mr-auto" : "ml-auto";
  const infoItems: { icon: React.ElementType; text?: string; href?: string }[] = [
    ...(address && address !== "area sekitar" ? [{ icon: MapPin, text: address }] : []),
    ...(phone ? [{ icon: Phone, text: phone, href: `https://wa.me/${phone.replace(/\D/g, "")}` }] : []),
    ...(email && !email.includes("brand-anda") ? [{ icon: Mail, text: email, href: `mailto:${email}` }] : []),
  ];

  return (
    <section id="contact" className={wrapperClass} style={wrapperStyle}>
      <div className={`${containerWidthClass} ${containerMarginClass} ${hasLeadForm ? "grid md:grid-cols-2 gap-10 md:gap-14" : textAlignClass}`}>
        {/* Contact info */}
        <div className={`space-y-6 ${textAlignClass} ${!hasLeadForm ? `flex flex-col ${alignItemsClass}` : ""}`}>
          <h2 className={titleClass} style={titleStyle}>{title}</h2>
          <div className="space-y-4">
            {infoItems.map(({ icon: Icon, text, href }) => {
              const content = (
                <div className={`flex gap-3 ${hasLeadForm ? "items-start" : `items-center ${justifyClass}`}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accentColor}18` }}>
                    <Icon className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <div className={hasLeadForm ? "flex-1 min-w-0 pt-1" : "min-w-0"}>
                    <p className={`${textClass} break-words`} style={textStyle}>{text}</p>
                  </div>
                </div>
              );
              if (href) {
                return <a key={text} href={href} target="_blank" rel="noopener noreferrer" className="block no-underline hover:opacity-80 transition-opacity">{content}</a>;
              }
              return <div key={text}>{content}</div>;
            })}
          </div>

          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center ${justifyClass} gap-2 text-sm font-semibold hover:underline transition-colors ${mapsLinkClass || ""}`}
              style={{ color: accentColor, ...mapsLinkStyle }}
            >
              <Globe className="w-4 h-4" />
              Buka Google Maps
            </a>
          )}
        </div>

        {/* Lead form */}
        {hasLeadForm && (
          <div className={leadCardClass || "p-7 rounded-2xl border shadow-sm"} style={leadCardStyle || { background: "white", borderColor: `${accentColor}20` }}>
            <h3 className={`text-base font-bold mb-5 ${leadTitleClass || ""}`} style={leadTitleStyle}>{leadTitleText}</h3>
            <LeadForm
              onSubmit={onSubmitLead!}
              submitting={leadSubmitting ?? false}
              success={leadSuccess ?? false}
              error={leadError ?? null}
              buttonClass={leadFormBtnClass || ""}
              buttonStyle={leadFormBtnStyle}
              inputClass={leadFormInputClass || ""}
              inputStyle={leadFormInputStyle}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export {
  NavMenu, WAFloatingButton, BackToTop, navCtaHref,
  TestimonialsSection, MenuCatalogCard, FaqAccordion,
  LeadForm, DynamicIcon, LogoImage, SeoEditorPreview,
  CartProvider, CartFab, AddToCartButton, isPlaceholderPrice,
  ContactSection,
};
export type { MenuCatalogCardProps, NavMenuProps, TestimonialsSectionProps, LeadFormProps, ContactSectionProps };
