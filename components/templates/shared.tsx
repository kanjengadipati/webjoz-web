"use client";

import React, { useId, useState, useEffect, useRef } from "react";
import { headingVars, avatarTextColor } from "./helpers";
import {
  Check, ArrowRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Star, Menu, X, Send,
  MapPin, Phone, Mail, Globe, Pencil, Upload, Loader2,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CartProvider, CartFab, AddToCartButton, isPlaceholderPrice } from "@/components/cart";
import { uploadImageFile } from "@/components/file-upload";

import type { TestimonialItem, FaqItem, ImageCredit, BenefitItem } from "./types";
import PhotoCredit from "../sections/PhotoCredit";
import { useI18n } from "@/lib/i18n/context";

// Global variable to store editorSiteId (only used in dashboard editor)
let EDITOR_SITE_ID: number | null = null;
export function setEditorSiteId(id: number | null) {
  EDITOR_SITE_ID = id;
}

export function isPlaceholderPhone(phone: string | null | undefined): boolean {
  if (!phone) return true;
  const digits = phone.replace(/\D/g, "");
  return digits === "6281234567890" || digits === "081234567890" || digits === "81234567890";
}

export function isPlaceholderMap(url: string | null | undefined): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  return lower === "https://maps.google.com" || lower === "https://maps.google.com/" || lower === "https://google.com/maps" || lower === "https://maps.apple.com";
}

// ─── WA Lead Modal ────────────────────────────────────────────────────────────

function WaLeadModal({ onSubmitLead, onClose }: {
  onSubmitLead: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmitLead({ name: name.trim(), email: "", phone: phone.trim(), message: notes.trim() || `Pesan dari ${name}` });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal mengirim pesan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm mx-4 p-6 rounded-2xl shadow-2xl"
        style={{ background: "var(--dt-bg, #fff)", color: "var(--dt-text, #1e293b)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Hubungi Kami"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-sm">Hubungi Kami</span>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:opacity-70 cursor-pointer" aria-label="Tutup"><X className="w-4 h-4" /></button>
        </div>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wide mb-1 opacity-75">Nama *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" maxLength={100}
              className="w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all focus:ring-1"
              style={{ background: "color-mix(in srgb, var(--dt-bg, #fff) 97%, var(--dt-text, #1e293b) 3%)", borderColor: "color-mix(in srgb, var(--dt-text, #1e293b) 15%, transparent)", color: "var(--dt-text, #1e293b)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wide mb-1 opacity-75">No. WhatsApp *</label>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08123456789" maxLength={20}
              className="w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all focus:ring-1"
              style={{ background: "color-mix(in srgb, var(--dt-bg, #fff) 97%, var(--dt-text, #1e293b) 3%)", borderColor: "color-mix(in srgb, var(--dt-text, #1e293b) 15%, transparent)", color: "var(--dt-text, #1e293b)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wide mb-1 opacity-75">Pesan</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tulis pesan Anda..." rows={3} maxLength={500}
              className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none transition-all focus:ring-1"
              style={{ background: "color-mix(in srgb, var(--dt-bg, #fff) 97%, var(--dt-text, #1e293b) 3%)", borderColor: "color-mix(in srgb, var(--dt-text, #1e293b) 15%, transparent)", color: "var(--dt-text, #1e293b)" }}
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full min-h-10 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "var(--dt-primary, #4F46E5)", color: "var(--dt-cta-text, #fff)" }}
          >
            {loading ? <span className="w-4 h-4 border-2 border-border border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{loading ? "Mengirim..." : "Kirim Pesanan"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────

function ImageLightbox({
  src,
  images,
  initialIndex = 0,
  alt,
  onClose,
}: {
  src?: string;
  images?: string[];
  initialIndex?: number;
  alt: string;
  onClose: () => void;
}) {
  const allImages = images && images.length > 0 ? images : src ? [src] : [];
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 && initialIndex < allImages.length ? initialIndex : 0
  );

  const prev = () => {
    setCurrentIndex((idx) => (idx === 0 ? allImages.length - 1 : idx - 1));
  };
  const next = () => {
    setCurrentIndex((idx) => (idx === allImages.length - 1 ? 0 : idx + 1));
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && allImages.length > 1) prev();
      if (e.key === "ArrowRight" && allImages.length > 1) next();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, allImages.length]);

  if (allImages.length === 0) return null;
  const currentSrc = allImages[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-[fadeIn_0.15s_ease]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${alt}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer z-20"
        aria-label="Tutup preview"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev / Next buttons */}
      {allImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer z-20"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer z-20"
            aria-label="Foto selanjutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div
        className="relative flex flex-col items-center max-w-[92vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentSrc}
          src={currentSrc}
          alt={`${alt} (${currentIndex + 1}/${allImages.length})`}
          className="max-w-[92vw] max-h-[80vh] object-contain rounded-xl shadow-2xl animate-[scaleIn_0.15s_ease]"
          style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}
        />

        {/* Counter & Thumbnails */}
        {allImages.length > 1 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-white/75 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10">
              {currentIndex + 1} / {allImages.length}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[80vw] py-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                    i === currentIndex
                      ? "border-primary scale-105 shadow-md"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.93) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}

// ─── Nav Menu ─────────────────────────────────────────────────────────────────

const NAV_SKIP = new Set(["header", "hero", "footer", "seo", "cta"]);

const NAV_LABELS_ID: Record<string, string> = {
  about: "Tentang",
  benefits: "Keunggulan",
  menu: "Menu",
  catalog: "Katalog",
  gallery: "Galeri",
  testimonials: "Testimoni",
  blog: "Blog",
  faq: "FAQ",
  cta: "Promo",
  contact: "Kontak",
};

const NAV_LABELS_EN: Record<string, string> = {
  about: "About",
  benefits: "Why Us",
  menu: "Menu",
  catalog: "Catalog",
  gallery: "Gallery",
  testimonials: "Testimonials",
  blog: "Blog",
  faq: "FAQ",
  cta: "Promo",
  contact: "Contact",
};

interface NavMenuProps {
  sectionOrder: string[];
  hiddenSections?: string[];
  linkClass?: string;
  activeColor?: string;
  drawerStyle?: React.CSSProperties;
  extraLinks?: { label: string; href: string }[];
  language?: "id" | "en";
}

const NavMenu: React.FC<NavMenuProps> = ({
  sectionOrder,
  hiddenSections = [],
  linkClass = "text-slate-700",
  drawerStyle,
  extraLinks = [],
  language = "id",
}) => {
  const [open, setOpen] = useState(false);
  const [drawerTop, setDrawerTop] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);

  const navLabels = language === "en" ? NAV_LABELS_EN : NAV_LABELS_ID;

  const navItems = [
    ...sectionOrder
      .filter(k => !NAV_SKIP.has(k) && !hiddenSections.includes(k) && navLabels[k])
      .map(k => ({ key: k, label: navLabels[k], href: k === "blog" ? "__blog__" : "" })),
    ...extraLinks.map(l => ({ key: l.href, label: l.label, href: l.href }))
  ];

  if (navItems.length === 0) return null;

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const header = btnRef.current.closest("header") ?? btnRef.current.closest("nav") ?? btnRef.current;
      const rect = header.getBoundingClientRect();
      setDrawerTop(rect.bottom);
    }
    setOpen(v => !v);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, item: { key: string; label: string; href: string }) => {
    if (item.href === "__blog__") {
      // Editor mode: siteId is set via setEditorSiteId() → use /preview/[id]/blog
      if (EDITOR_SITE_ID) {
        window.location.href = `/preview/${EDITOR_SITE_ID}/blog`;
        return;
      }

      // Resolve the blog index URL relative to the current site path.
      const parts = window.location.pathname.split("/").filter(Boolean);

      // Path-based local dev: /s/[subdomain] → /s/[subdomain]/blog
      if (parts[0] === "s" && parts[1]) {
        window.location.href = `/${parts[0]}/${parts[1]}/blog`;
        return;
      }

      // Production rewrite: /site/[subdomain] → /site/[subdomain]/blog
      if (parts[0] === "site" && parts[1]) {
        window.location.href = `/${parts[0]}/${parts[1]}/blog`;
        return;
      }

      // Preview mode: /preview/[id] → /preview/[id]/blog
      if (parts[0] === "preview" && parts[1]) {
        window.location.href = `/preview/${parts[1]}/blog`;
        return;
      }

      // Custom domain: relative /blog works on same domain
      window.location.href = "/blog";
      return;
    }
    if (item.href) {
      window.location.href = item.href;
      return;
    }
    setOpen(false);
    const isBlogPage = typeof window !== "undefined" && /\/blog($|\/)/.test(window.location.pathname);
    if (isBlogPage) {
      const parts = window.location.pathname.split("/").filter(Boolean);
      let homeUrl = "/";
      if (parts[0] === "s" && parts[1]) {
        homeUrl = `/${parts[0]}/${parts[1]}`;
      } else if (parts[0] === "site" && parts[1]) {
        homeUrl = `/${parts[0]}/${parts[1]}`;
      } else if (parts[0] === "preview" && parts[1]) {
        homeUrl = `/preview/${parts[1]}`;
      }
      window.location.href = `${homeUrl}#${item.key}`;
      return;
    }
    const doc = e.currentTarget.ownerDocument || document;
    let el = doc.getElementById(`section-${item.key}`);
    if (!el) {
      el = doc.getElementById(item.key);
    }
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={(e) => handleClick(e, item)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-70 cursor-pointer focus:outline-none ${linkClass}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer focus:outline-none ${linkClass}`}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <>
          {/* Backdrop — tap outside to close */}
          <div
            className="md:hidden fixed inset-0 z-[59]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer — fixed so iOS sticky/backdrop-filter clipping is avoided */}
          <div
            className="md:hidden fixed left-0 right-0 z-[60] shadow-lg py-2"
            style={{ top: drawerTop, ...(drawerStyle ?? { background: "rgba(255,255,255,0.97)", borderTop: "1px solid rgba(0,0,0,0.08)" }) }}
          >
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={(e) => handleClick(e, item)}
                className={`w-full text-left px-5 py-3 text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer focus:outline-none ${linkClass}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
};

// ─── WhatsApp Floating Button ────────────────────────────────────────────────

const WAFloatingButton: React.FC<{
  phone: string;
  isEditorMode?: boolean;
  onSubmitLead?: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>;
  brandName?: string;
  /** true = premium chat widget; false = simple floating WA button */
  isPremium?: boolean;
  /**
   * Explicit floating button type. Takes precedence over isPremium.
   * "whatsapp"     → simple WA button
   * "chat_bubble"  → premium chat widget (only if isPremium=true)
   * "contact_link" → scroll to #contact
   * "none"         → hidden
   */
  floatingType?: "none" | "whatsapp" | "chat_bubble" | "contact_link";
}> = ({ phone, isEditorMode, brandName = "Customer Support", isPremium = false, floatingType }) => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Stop typing indicator after 1.2s
  useEffect(() => {
    if (isWidgetOpen) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isWidgetOpen]);

  const digits = phone ? phone.replace(/\D/g, "") : "";
  const hasWa = digits.length >= 8 && !isPlaceholderPhone(phone);
  const waUrl = hasWa ? (digits.startsWith("0") ? `https://wa.me/62${digits.slice(1)}` : `https://wa.me/${digits}`) : "#";

  // Resolve effective type — default to whatsapp
  const effectiveType = floatingType ?? (isPremium ? "chat_bubble" : "whatsapp");

  if (effectiveType === "none") return null;

  // ── Contact Link button — no phone required ───────────────────────────────
  if (effectiveType === "contact_link") {
    return (
      <a
        href={isEditorMode ? "#" : "#contact"}
        onClick={isEditorMode ? (e) => e.preventDefault() : undefined}
        aria-label="Hubungi Kami"
        className="fixed right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none"
        style={{ bottom: "var(--floating-bottom-desktop, var(--floating-bottom-mobile, 6rem))", background: "var(--dt-primary, #4F46E5)", color: "var(--dt-primary-foreground, #fff)" }}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </a>
    );
  }

  if (!hasWa) {
    // Show disabled WA button — visible but not clickable until phone is set
    if (effectiveType === "whatsapp" || effectiveType === "chat_bubble") {
      return (
        <div
          aria-label="Chat via WhatsApp (nomor belum diisi)"
          title="Isi nomor WhatsApp di editor untuk mengaktifkan tombol ini"
          className="fixed right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full cursor-not-allowed select-none"
          style={{ bottom: "var(--floating-bottom-desktop, var(--floating-bottom-mobile, 6rem))", background: "#25D366", opacity: 0.35, filter: "grayscale(30%)" }}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      );
    }
    return null;
  }

  // ── Simple floating WA button (whatsapp type or free users) ─────────────────
  if (effectiveType !== "chat_bubble") {
    return (
      <a
        href={isEditorMode ? "#" : waUrl}
        target={isEditorMode ? undefined : "_blank"}
        rel="noopener noreferrer"
        onClick={isEditorMode ? (e) => e.preventDefault() : undefined}
        aria-label="Chat via WhatsApp"
        className="fixed right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        style={{ bottom: "var(--floating-bottom-desktop, var(--floating-bottom-mobile, 6rem))", background: "#25D366" }}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    );
  }

  // ── Premium interactive chat widget ────────────────────────────────────────
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditorMode) return;
    const finalMsg = userMessage.trim();
    if (!finalMsg) return;
    const encodedText = encodeURIComponent(finalMsg);
    window.open(`${waUrl}?text=${encodedText}`, "_blank", "noopener,noreferrer");
    setUserMessage("");
    setIsWidgetOpen(false);
  };

  return (
    <>
      <div className="fixed right-6 z-40 flex flex-col items-end" style={{ bottom: "var(--floating-bottom-desktop, var(--floating-bottom-mobile, 6rem))" }}>
        {/* Chat Window Panel */}
        {isWidgetOpen && (
          <div
            className="mb-4 w-[340px] max-w-[90vw] rounded-2xl overflow-hidden shadow-2xl border border-stone-200/80 bg-[#f0f2f5] animate-[widgetSlideUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forward]"
            style={{
              fontFamily: "var(--dt-body-font), sans-serif",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            }}
          >
            {/* Header */}
            <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs border border-border">
                  {brandName.substring(0, 2).toUpperCase()}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#075E54] animate-pulse" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-tight">{brandName}</h4>
                  <span className="text-[11px] text-white/80">Online • Balas dalam sekejap</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWidgetOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body (WA Patterned Background) */}
            <div
              className="h-60 p-4 overflow-y-auto flex flex-col gap-3 relative"
              style={{
                backgroundImage: `radial-gradient(#e5ddd5 20%, transparent 20%), radial-gradient(#e5ddd5 20%, transparent 20%)`,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
                backgroundColor: "#efeae2",
              }}
            >
              {isTyping ? (
                <div className="self-start bg-white py-2.5 px-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                </div>
              ) : (
                <div className="self-start bg-white py-2.5 px-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-xs text-stone-800 leading-relaxed animate-[widgetMessageIn_0.2s_ease-out_forwards]">
                  <p className="font-semibold text-[10px] text-[#075E54] mb-0.5">{brandName}</p>
                  Halo! Ada yang bisa kami bantu hari ini? Silakan ketik pesan Anda di bawah untuk mulai berkonsultasi secara langsung via WhatsApp. 😊
                </div>
              )}
            </div>

            {/* Footer Input Area */}
            <form onSubmit={handleSendMessage} className="bg-white p-3 flex items-center gap-2 border-t border-stone-200">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ketik pesan di sini..."
                disabled={isEditorMode}
                className="flex-1 px-4 py-2 text-xs bg-stone-100 rounded-full outline-none focus:bg-stone-50 border border-stone-200 focus:border-[#075E54]/40 transition-colors"
              />
              <button
                type="submit"
                disabled={!userMessage.trim() || isEditorMode}
                className="w-8 h-8 rounded-full bg-[#075E54] hover:bg-[#128C7E] active:scale-95 transition-all text-white flex items-center justify-center disabled:opacity-50 disabled:scale-100 cursor-pointer"
                aria-label="Kirim Pesan"
              >
                <Send className="w-3.5 h-3.5 fill-white stroke-none translate-x-[1px]" />
              </button>
            </form>
          </div>
        )}

        {/* Trigger Floating Action Button */}
        <button
          type="button"
          onClick={() => setIsWidgetOpen(!isWidgetOpen)}
          aria-label="Chat via WhatsApp"
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-[0_6px_24px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 cursor-pointer"
          style={{ background: "#25D366" }}
        >
          {isWidgetOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
        </button>
      </div>

      {/* Animation Styles Injection */}
      <style>{`
        @keyframes widgetSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes widgetMessageIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
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
      className="fixed right-6 z-[150] w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
      style={{ bottom: "var(--floating-bottom-desktop, var(--floating-bottom-mobile, 6rem))" }}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
    </button>
  );
};

// ─── Nav CTA href helper ─────────────────────────────────────────────────────

function navCtaHref(navCtaText?: string, customHref?: string): string {
  let hash: string;

  if (customHref && customHref.trim()) {
    // Use the explicit override — ensure it starts with # or is a full URL
    const h = customHref.trim();
    hash = h.startsWith("#") || h.startsWith("http") || h.startsWith("/") ? h : `#${h}`;
  } else {
    // Infer section from button text
    const lower = (navCtaText || "").toLowerCase();
    hash = "#contact";
    if (lower.includes("katalog") || lower.includes("produk") || lower.includes("catalog")) hash = "#catalog";
    else if (lower.includes("menu") || lower.includes("meja") || lower.includes("pesan")) hash = "#menu";
    else if (lower.includes("tentang") || lower.includes("about")) hash = "#about";
    else if (lower.includes("keunggulan") || lower.includes("benefit")) hash = "#benefits";
    else if (lower.includes("galeri") || lower.includes("gallery")) hash = "#gallery";
    else if (lower.includes("testimoni") || lower.includes("review")) hash = "#testimonials";
    else if (lower.includes("faq")) hash = "#faq";
  }

  // If already a full URL, return as-is (no blog-page rebase needed)
  if (hash.startsWith("http") || hash.startsWith("/s/") || hash.startsWith("/site/")) return hash;

  const isBlogPage = typeof window !== "undefined" && /\/blog($|\/)/.test(window.location.pathname);
  if (isBlogPage) {
    const parts = window.location.pathname.split("/").filter(Boolean);
    let homeUrl = "/";
    if (parts[0] === "s" && parts[1]) {
      homeUrl = `/${parts[0]}/${parts[1]}`;
    } else if (parts[0] === "site" && parts[1]) {
      homeUrl = `/${parts[0]}/${parts[1]}`;
    } else if (parts[0] === "preview" && parts[1]) {
      homeUrl = `/preview/${parts[1]}`;
    }
    return `${homeUrl}${hash}`;
  }
  return hash;
}

// ─── Hero CTA href helper — WhatsApp jika ada phone, fallback ke cta_url ────
// NOTE: Section-scroll hashes (#catalog, #menu, etc.) are preserved even when
// a phone number is present — the WhatsApp override only applies when the
// original target is #contact or an explicit contact-style destination.

function ctaHref(phone?: string | null, fallbackUrl?: string): string {
  const url = fallbackUrl || "#contact";
  // If the URL is a section-scroll anchor (not #contact), preserve it as-is
  const isSectionHash = url.startsWith("#") && url !== "#contact";
  if (phone && !isSectionHash) {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned) return `https://wa.me/${cleaned}`;
  }
  return url;
}

// ─── Shared Testimonials Section ─────────────────────────────────────────────

interface TestimonialsSectionProps {
  testimonials?: { title: string; eyebrow?: string; items: TestimonialItem[]; variant?: string };
  variant?: "grid" | "compact" | "carousel";
  designVariant?: "standard" | "neobrutalist" | "minimal" | "elegant" | "glassmorphic" | "chat";
  wrapperClass?: string;
  wrapperStyle?: React.CSSProperties;
  eyebrowClass?: string;
  eyebrowStyle?: React.CSSProperties;
  titleClass?: string;
  titleStyle?: React.CSSProperties;
  cardClass?: string;
  cardStyle?: React.CSSProperties;
  quoteClass?: string;
  quoteStyle?: React.CSSProperties;
  nameClass?: string;
  nameStyle?: React.CSSProperties;
  roleClass?: string;
  roleStyle?: React.CSSProperties;
  accentColor?: string;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

const SharedTestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  variant = "grid",
  designVariant = "standard",
  wrapperClass = "",
  wrapperStyle,
  eyebrowClass = "",
  eyebrowStyle,
  titleClass = "",
  titleStyle,
  cardClass = "",
  cardStyle,
  quoteClass = "",
  quoteStyle,
  nameClass = "",
  nameStyle,
  roleClass = "",
  roleStyle,
  accentColor = "var(--dt-primary)",
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}) => {
  if (!testimonials?.items?.length) return null;

  const resolvedDesignVariant = testimonials?.variant || designVariant || "standard";

  const wrapperClasses = `py-20 px-5 sm:px-6 ${wrapperClass}`;
  const gridClass = variant === "compact" ? "grid grid-cols-1 md:grid-cols-2 gap-4" :
    variant === "carousel" ? "flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4" :
      "grid grid-cols-1 md:grid-cols-3 gap-6";
  const eyebrowClasses = `text-xs font-bold uppercase tracking-widest block ${eyebrowClass}`;
  const titleClasses = `text-3xl md:text-4xl font-bold ${titleClass}`;

  return (
    <section id="testimonials" className={wrapperClasses} style={wrapperStyle}>
      <div className="max-w-6xl mx-auto space-y-12">
        {(testimonials.eyebrow || testimonials.title) && (
          <div className="text-center space-y-2">
            {testimonials.eyebrow && (
              <InlineText
                section="testimonials"
                fieldKey="eyebrow"
                value={testimonials.eyebrow}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                className={eyebrowClasses}
                style={eyebrowStyle}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            )}
            {testimonials.title && (
              <InlineText
                section="testimonials"
                fieldKey="title"
                value={testimonials.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="h2"
                className={titleClasses}
                style={{ ...titleStyle, ...headingVars }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            )}
          </div>
        )}
        <div className={gridClass}>
          {testimonials.items.map((t, idx) => {
            // ─── 1. NEOBRUTALIST VARIANT ───
            if (resolvedDesignVariant === "neobrutalist") {
              return (
                <div
                  key={idx}
                  className={`border-3 border-black p-6 flex flex-col gap-4 bg-white transition-transform hover:-translate-y-1 ${cardClass}`}
                  style={{
                    boxShadow: "4px 4px 0px 0px #000000",
                    borderRadius: "12px",
                    ...cardStyle,
                  }}
                >
                  <span className="text-4xl font-black text-black leading-none -mb-3 opacity-20 font-mono select-none">“</span>
                  <InlineText section="testimonials" fieldKey={`items.${idx}.quote`} value={t.quote ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-sm font-bold text-black leading-relaxed flex-1 ${quoteClass}`} style={quoteStyle} multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                  <div className="flex items-center gap-3 pt-3 border-t-2 border-black">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: t.avatar_color || accentColor, color: avatarTextColor(t.avatar_color || accentColor) }}
                    >
                      {t.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <InlineText section="testimonials" fieldKey={`items.${idx}.name`} value={t.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-sm font-black text-black leading-tight ${nameClass}`} style={nameStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                      {t.role && <InlineText section="testimonials" fieldKey={`items.${idx}.role`} value={t.role ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-xs font-bold text-stone-600 ${roleClass}`} style={roleStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
                    </div>
                  </div>
                </div>
              );
            }

            // ─── 2. MINIMAL VARIANT ───
            if (resolvedDesignVariant === "minimal") {
              return (
                <div
                  key={idx}
                  className={`p-6 flex flex-col gap-4 bg-transparent border-0 shadow-none ${cardClass}`}
                  style={cardStyle}
                >
                  <span className="text-5xl font-serif leading-none -mb-4 opacity-30 select-none" style={{ color: accentColor }}>“</span>
                  <InlineText section="testimonials" fieldKey={`items.${idx}.quote`} value={t.quote ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-sm leading-relaxed flex-1 italic font-light ${quoteClass}`} style={quoteStyle} multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                  <div className="flex items-center gap-3 pt-4 border-t border-stone-200/50">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: t.avatar_color || accentColor, color: avatarTextColor(t.avatar_color || accentColor), opacity: 0.85 }}
                    >
                      {t.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <InlineText section="testimonials" fieldKey={`items.${idx}.name`} value={t.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-xs font-bold leading-tight ${nameClass}`} style={nameStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                      {t.role && <InlineText section="testimonials" fieldKey={`items.${idx}.role`} value={t.role ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-[10px] text-stone-400 ${roleClass}`} style={roleStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
                    </div>
                  </div>
                </div>
              );
            }

            // ─── 3. ELEGANT VARIANT ───
            if (resolvedDesignVariant === "elegant") {
              return (
                <div
                  key={idx}
                  className={`p-7 flex flex-col gap-5 bg-gradient-to-b from-white/50 to-white/10 backdrop-blur-sm border transition-all hover:shadow-lg hover:border-[var(--dt-primary)]/40 ${cardClass}`}
                  style={{
                    borderRadius: "16px",
                    borderColor: "color-mix(in srgb, var(--dt-border) 40%, transparent)",
                    boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.03)",
                    ...cardStyle,
                  }}
                >
                  <span className="text-4xl font-serif text-[var(--dt-primary)] leading-none -mb-4 opacity-40 select-none">“</span>
                  <InlineText section="testimonials" fieldKey={`items.${idx}.quote`} value={t.quote ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-sm leading-relaxed flex-1 font-serif italic ${quoteClass}`} style={quoteStyle} multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                  <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: "color-mix(in srgb, var(--dt-border) 20%, transparent)" }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-inner"
                      style={{ background: `linear-gradient(135deg, ${t.avatar_color || accentColor}, color-mix(in srgb, ${t.avatar_color || accentColor} 70%, black))`, color: avatarTextColor(t.avatar_color || accentColor) }}
                    >
                      {t.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <InlineText section="testimonials" fieldKey={`items.${idx}.name`} value={t.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-sm font-semibold tracking-wide ${nameClass}`} style={nameStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                      {t.role && <InlineText section="testimonials" fieldKey={`items.${idx}.role`} value={t.role ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-xs italic ${roleClass}`} style={roleStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
                    </div>
                  </div>
                </div>
              );
            }

            // ─── 4. GLASSMORPHIC VARIANT ───
            if (resolvedDesignVariant === "glassmorphic") {
              return (
                <div
                  key={idx}
                  className={`p-6 flex flex-col gap-4 bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] ${cardClass}`}
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
                    ...cardStyle,
                  }}
                >
                  <span className="text-5xl font-mono text-cyan-400 leading-none -mb-5 opacity-40 select-none">“</span>
                  <InlineText section="testimonials" fieldKey={`items.${idx}.quote`} value={t.quote ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-sm leading-relaxed flex-1 font-light tracking-wide ${quoteClass}`} style={quoteStyle} multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border border-cyan-400/30"
                      style={{
                        background: `radial-gradient(circle, ${t.avatar_color || accentColor} 0%, rgba(0,0,0,0.4) 100%)`,
                        color: avatarTextColor(t.avatar_color || accentColor),
                        boxShadow: `0 0 10px ${t.avatar_color || accentColor}33`,
                      }}
                    >
                      {t.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <InlineText section="testimonials" fieldKey={`items.${idx}.name`} value={t.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-sm font-semibold text-white tracking-wide ${nameClass}`} style={nameStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                      {t.role && <InlineText section="testimonials" fieldKey={`items.${idx}.role`} value={t.role ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={`text-xs text-slate-400 tracking-wider ${roleClass}`} style={roleStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
                    </div>
                  </div>
                </div>
              );
            }

            // ─── 5. CHAT / WHATSAPP VARIANT ───
            if (resolvedDesignVariant === "chat") {
              return (
                <div
                  key={idx}
                  className={`w-full max-w-[360px] mx-auto bg-[#efeae2] border border-[#d1d7db] shadow-md rounded-[24px] overflow-hidden flex flex-col relative select-none font-sans ${cardClass}`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23c1b8aa' fill-opacity='0.15'%3E%3Cpath d='M10 20c2 0 3-1 3-3s-1-3-3-3-3 1-3 3 1 3 3 3zm0-4c1 0 1 .5 1 1s0 1-1 1-1-.5-1-1 0-1 1-1zm32 30c0-1.5 1-2.5 2.5-2.5S47 34.5 47 36s-1 2.5-2.5 2.5-2.5-1-2.5-2.5zm4 0c0-.5-.5-1-1.5-1s-1.5.5-1.5 1 .5 1 1.5 1 1.5-.5 1.5-1zM58 8c1.5 0 2.5 1 2.5 2.5S59.5 13 58 13s-2.5-1-2.5-2.5S56.5 8 58 8zm0 3c.5 0 1-.5 1-1s-.5-1-1-1-1 .5-1 1 .5 1 1 1z' fill='%23000'/%3E%3C/g%3E%3C/svg%3E")`,
                    ...cardStyle,
                  }}
                >
                  {/* WhatsApp Header */}
                  <div className="bg-[#075e54] text-white py-3 px-4 flex items-center justify-between gap-2 shadow-sm shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Back Arrow */}
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-border"
                        style={{ background: t.avatar_color || accentColor, color: avatarTextColor(t.avatar_color || accentColor) }}
                      >
                        {t.avatar_initials}
                      </div>
                      {/* Contact Info */}
                      <div className="min-w-0 leading-tight">
                        <h4 className="text-xs font-bold truncate"><InlineText section="testimonials" fieldKey={`items.${idx}.name`} value={t.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></h4>
                        <span className="text-[10px] text-emerald-100 opacity-90 block">Online</span>
                      </div>
                    </div>
                    {/* Header Icons */}
                    <div className="flex items-center gap-3 text-white/90">
                      {/* Video Camera Icon */}
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 shrink-0">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                      {/* Phone Icon */}
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 shrink-0">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      {/* More Vert Icon */}
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 shrink-0">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto min-h-[220px]">
                    {/* Date Divider */}
                    <div className="mx-auto bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-gray-500 font-semibold tracking-wide shadow-sm">
                      HARI INI
                    </div>

                    {/* Left Message Bubble (Business Prompt) */}
                    <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%] self-start relative border border-gray-200/50 flex flex-col gap-1">
                      <p className="text-[11px] leading-normal font-normal">
                        Halo Kak {t.name}, bagaimana kesan Kakak setelah menggunakan layanan kami? Kami sangat menghargai feedback Kakak! 😊
                      </p>
                      <span className="text-[8px] text-gray-400 self-end mt-0.5 leading-none">11:20 AM</span>
                    </div>

                    {/* Right Message Bubble (Client Testimonial) */}
                    <div className="bg-[#d9fdd3] text-gray-800 rounded-2xl rounded-tr-none p-3 shadow-sm max-w-[85%] self-end relative border border-[#c1e8ba]/40 flex flex-col gap-1">
                      <p className={`text-[11px] leading-normal font-normal ${quoteClass}`} style={quoteStyle}>
                        <InlineText section="testimonials" fieldKey={`items.${idx}.quote`} value={t.quote ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                      </p>
                      <div className="flex items-center gap-1 self-end mt-0.5 leading-none">
                        <span className="text-[8px] text-gray-500">11:22 AM</span>
                        {/* WhatsApp Blue Double Checkmark */}
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#34b7f1] shrink-0">
                          <path d="M0.5 12l5 5 11-11-1.5-1.5-9.5 9.5-3.5-3.5-1.5 1.5zm6.5 5l1.5 1.5 11-11-1.5-1.5-9.5 9.5-1.5-1.5zm11.5-7.5l-1.5-1.5-6 6 1.5 1.5 6-6z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Input Mock */}
                  <div className="p-2 bg-transparent flex items-center gap-1.5 shrink-0">
                    <div className="flex-1 bg-white rounded-full py-1.5 px-3 flex items-center gap-2 shadow-sm border border-gray-200/50 min-w-0">
                      {/* Smiley Emoji */}
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-gray-400 stroke-2 shrink-0">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
                      {/* Input Placeholder */}
                      <span className="text-[10px] text-gray-400 flex-1 truncate">Ketik pesan...</span>
                      {/* Attachment Icon */}
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-gray-400 stroke-2 rotate-45 shrink-0">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                      </svg>
                      {/* Camera Icon */}
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-gray-400 stroke-2 shrink-0">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                    </div>
                    {/* Microphone Circle Button */}
                    <div className="w-7 h-7 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            }

            // ─── 6. STANDARD CARD (Default) ───
            const cardClasses = `rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow ${cardClass}`;
            const quoteClasses = `text-sm leading-relaxed flex-1 ${quoteClass}`;
            const nameClasses = `text-sm font-bold leading-tight ${nameClass}`;
            const roleClasses = `text-xs ${roleClass}`;

            return (
              <div key={idx} className={cardClasses} style={cardStyle}>
                <InlineText section="testimonials" fieldKey={`items.${idx}.quote`} value={t.quote ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={quoteClasses} style={quoteStyle} multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: `1px solid color-mix(in srgb, ${accentColor} 15%, transparent)` }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: t.avatar_color || accentColor, color: avatarTextColor(t.avatar_color || accentColor) }}
                  >
                    {t.avatar_initials}
                  </div>
                  <div className="min-w-0">
                    <InlineText section="testimonials" fieldKey={`items.${idx}.name`} value={t.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={nameClasses} style={nameStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                    {t.role && <InlineText section="testimonials" fieldKey={`items.${idx}.role`} value={t.role ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={roleClasses} style={roleStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
                  </div>
                </div>
              </div>
            );
          })}
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
  itemPriceAmount?: number | null;
  itemPriceDisplay?: string | null;
  itemDescription?: string | null;
  category: string;
  image_url?: string | null;
  image_urls?: string[] | null;
  image_credit?: ImageCredit | null;
  badge?: string | null;
  is_available?: boolean;
  variant_groups?: import("./types").ItemVariantGroup[] | null;
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
  features?: string[] | null;
  capacity?: number | null;
  tags?: string[] | null;
  delivery_platforms?: { name: string; url: string }[] | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  editSection?: string;
  pathBase?: string;
}

function MenuCatalogCard({
  itemId, itemName, itemPrice, itemPriceAmount, itemPriceDisplay,
  itemDescription, category, image_url, image_urls, image_credit, badge, is_available = true, variant_groups, icon,
  layout = "grid", className, style, imageClassName, imageStyle, placeholderClassName,
  placeholderStyle, placeholderIconClassName, placeholderIconStyle, contentClassName,
  contentStyle, headerClassName, headerStyle, titleClassName, titleStyle,
  descriptionClassName, descriptionStyle, priceClassName, priceStyle, badgeClassName,
  badgeStyle, buttonClassName, buttonStyle, features, capacity, tags, delivery_platforms,
  onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, editSection, pathBase,
}: MenuCatalogCardProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const displayPrice = itemPriceDisplay || itemPrice;
  const showPrice = displayPrice && !isPlaceholderPrice(displayPrice);
  const isOutOfStock = is_available === false;

  const handleTriggerUpload = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    collapseSheetForInlineEdit?.();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateField || !editSection || !pathBase) return;

    try {
      setUploadingImage(true);
      const secureUrl = await uploadImageFile(file);
      onUpdateField(editSection, `${pathBase}.image_url`, secureUrl);
    } catch (err: any) {
      console.error("Upload catalog/menu item image error:", err);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const allImages = Array.from(
    new Set([image_url, ...(image_urls || [])].filter((x): x is string => Boolean(x && typeof x === "string" && x.trim() !== "")))
  );
  const currentImg = allImages[activeImgIdx] || allImages[0] || image_url;

  const imageNode = currentImg ? (
    <div className="relative overflow-hidden group/img">
      <img
        src={currentImg}
        alt={itemName}
        className={`${imageClassName || ""} ${isOutOfStock ? "opacity-60 grayscale-[30%]" : ""}`}
        style={{ ...imageStyle, cursor: isOutOfStock ? "default" : "zoom-in" }}
        onClick={() => { if (!isOutOfStock) setLightboxOpen(true); }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      {/* Multi-image indicators/bullets */}
      {allImages.length > 1 && (
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full pointer-events-auto">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIdx(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === activeImgIdx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Foto ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-[9px] font-bold text-white/90 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
            {allImages.length} Foto
          </span>
        </div>
      )}
      {image_credit?.name && (
        <div className="absolute bottom-1 right-2 z-10">
          <PhotoCredit credit={image_credit} />
        </div>
      )}

      {/* Inline photo upload overlay in editor mode */}
      {isEditorMode && onUpdateField && editSection && pathBase && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleTriggerUpload}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            disabled={uploadingImage}
            className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[11px] font-semibold shadow-lg border border-white/20 hover:bg-slate-950 active:scale-95 transition-all cursor-pointer disabled:opacity-50 group-hover/img:opacity-100 opacity-90 backdrop-blur-sm"
          >
            {uploadingImage ? (
              <Loader2 className="w-3 h-3 animate-spin text-white" />
            ) : (
              <Upload className="w-3 h-3 text-white" />
            )}
            <span>{uploadingImage ? t("dashboard.sitesEditor.uploadingPhoto") : t("dashboard.sitesEditor.changePhoto")}</span>
          </button>
        </>
      )}

      {lightboxOpen && !isOutOfStock && (
        <ImageLightbox
          images={allImages}
          initialIndex={activeImgIdx}
          alt={itemName}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  ) : (
    <div
      className={`${placeholderClassName || "w-full h-44 flex flex-col items-center justify-center relative overflow-hidden"} ${isOutOfStock ? "opacity-60 grayscale-[30%]" : ""}`}
      style={{
        background: placeholderStyle?.background || `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 14%, var(--dt-surface)) 0%, color-mix(in srgb, var(--dt-surface) 96%, transparent) 100%)`,
        ...placeholderStyle,
      }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-muted/50 shadow-sm">
        {React.createElement(icon, {
          className: placeholderIconClassName || "w-6 h-6",
          style: placeholderIconStyle || { color: "var(--dt-primary)", opacity: 0.9 }
        })}
      </div>
      {category && (
        <span className="mt-2 text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: "var(--dt-text)" }}>
          {category}
        </span>
      )}

      {/* Inline photo upload button on placeholder in editor mode */}
      {isEditorMode && onUpdateField && editSection && pathBase && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleTriggerUpload}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            disabled={uploadingImage}
            className="mt-2.5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {uploadingImage ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{uploadingImage ? t("dashboard.sitesEditor.uploadingPhoto") : t("dashboard.sitesEditor.addPhoto")}</span>
          </button>
        </>
      )}
    </div>
  );

  const header = (
    <div className={headerClassName} style={headerStyle}>
      <div className="min-w-0 flex-1">
        {/* Fixed-height badge zone */}
        <div className="min-h-[1.375rem] mb-1 flex items-center gap-1.5 flex-wrap">
          {isOutOfStock ? (
            <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap bg-rose-500 text-white shadow-sm">
              Habis
            </span>
          ) : badge ? (
            <span className={badgeClassName} style={badgeStyle}>{badge}</span>
          ) : null}
        </div>
        <InlineText section={editSection ?? ""} fieldKey={pathBase ? pathBase + ".name" : ""} value={itemName ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="h4" className={titleClassName} style={titleStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </div>
      {showPrice && <InlineText section={editSection ?? ""} fieldKey={pathBase ? pathBase + ".price" : ""} value={displayPrice ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" className={priceClassName} style={priceStyle} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
    </div>
  );

  const isLong = itemDescription && itemDescription.length > 90;
  const displayDescription = isLong && !isExpanded
    ? itemDescription.replace(/\n+/g, " ").substring(0, 80).trim() + "..."
    : itemDescription;

  const descriptionElement = itemDescription && (
    (editSection && pathBase && isEditorMode) ? (
      <InlineText section={editSection} fieldKey={pathBase + ".description"} value={itemDescription ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" className={descriptionClassName} style={{ ...descriptionStyle, whiteSpace: "pre-wrap" }} multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
    ) : (
      <p className={descriptionClassName} style={{ ...descriptionStyle, whiteSpace: "pre-wrap" }}>
        {displayDescription}
        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 text-[11px] font-semibold underline text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 transition-colors inline-block focus:outline-none cursor-pointer"
          >
            {isExpanded ? "Sembunyikan" : "Selengkapnya"}
          </button>
        )}
      </p>
    )
  );

  const tagsAndPlatforms = (
    <>
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag, ti) => (
            <span
              key={ti}
              className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{ background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {delivery_platforms && delivery_platforms.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {delivery_platforms.map((dp, di) => (
            <a
              key={di}
              href={dp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all hover:brightness-110"
              style={{
                borderColor: "color-mix(in srgb, var(--dt-primary) 25%, transparent)",
                background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)",
                color: "var(--dt-primary)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{dp.name || "Order Online"}</span>
            </a>
          ))}
        </div>
      )}
    </>
  );

  if (layout === "compact") {
    return (
      <div className={className} style={style}>
        <div className="flex items-start gap-4 h-full">
          <div className="flex-shrink-0">{imageNode}</div>
          <div className="min-w-0 flex-1 flex flex-col h-full" style={contentStyle}>
            {header}
            {descriptionElement}
            {tagsAndPlatforms}
            <div className="mt-auto pt-2">
              <AddToCartButton
                itemId={itemId}
                itemName={itemName}
                itemPrice={displayPrice ?? null}
                itemPriceAmount={itemPriceAmount}
                itemPriceDisplay={displayPrice}
                category={category}
                variant_groups={variant_groups}
                className={buttonClassName}
                style={buttonStyle}
                disabled={isOutOfStock}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className || ""} flex flex-col h-full`} style={style}>
      {imageNode}
      <div className={`${contentClassName || ""} flex-grow flex flex-col`} style={contentStyle}>
        {header}
        {descriptionElement}
        {capacity != null && capacity > 0 && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3 h-3"><circle cx="9" cy="7" r="2"/><path d="M3 21v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="7" r="2"/><path d="M21 21v-1a5 5 0 0 0-3-4.6"/></svg>
              s/d {capacity} tamu
            </span>
          </div>
        )}
        {features && features.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {features.map((f, fi) => (
              <li key={fi} className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", color: "var(--dt-primary)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                {f}
              </li>
            ))}
          </ul>
        )}
        {tagsAndPlatforms}
        <div className="mt-auto pt-3">
          <AddToCartButton
            itemId={itemId}
            itemName={itemName}
            itemPrice={displayPrice ?? null}
            itemPriceAmount={itemPriceAmount}
            itemPriceDisplay={displayPrice}
            category={category}
            variant_groups={variant_groups}
            className={buttonClassName}
            style={buttonStyle}
            disabled={isOutOfStock}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Catalog / Menu Filter Bar ────────────────────────────────────────────────

interface CatalogMenuFilterBarProps {
  categories?: Array<{ name?: string; items?: any[] }> | null;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

function CatalogMenuFilterBar({
  categories = [],
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  placeholder = "Cari menu atau produk...",
  className,
  style,
}: CatalogMenuFilterBarProps) {
  const safeCategories = categories || [];
  const totalAllItems = safeCategories.reduce((acc, cat) => acc + (cat?.items?.length ?? 0), 0);

  // If there are no items, don't show the filter bar
  if (totalAllItems === 0) return null;

  return (
    <div className={`w-full max-w-2xl mx-auto mb-10 space-y-3.5 ${className || ""}`} style={style}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none opacity-60" style={{ color: "var(--dt-text)" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm outline-none transition-all shadow-xs"
          style={{
            background: "color-mix(in srgb, var(--dt-bg) 94%, var(--dt-text) 6%)",
            color: "var(--dt-text)",
            border: "1px solid color-mix(in srgb, var(--dt-text) 16%, transparent)",
            borderRadius: "var(--dt-radius, 1rem)",
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 p-1 rounded-full opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
            aria-label="Hapus pencarian"
            style={{ color: "var(--dt-text)" }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      {safeCategories.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 justify-start sm:justify-center">
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            style={{
              background: activeCategory === "all" ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-text) 6%, transparent)",
              color: activeCategory === "all" ? "var(--dt-cta-text, #fff)" : "var(--dt-text)",
              border: `1px solid ${activeCategory === "all" ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-text) 12%, transparent)"}`,
            }}
          >
            Semua ({totalAllItems})
          </button>
          {safeCategories.map((cat, idx) => {
            const catName = cat?.name || `Kategori ${idx + 1}`;
            const isCatActive = activeCategory === catName;
            const count = cat?.items?.length ?? 0;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectCategory(catName)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                style={{
                  background: isCatActive ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-text) 6%, transparent)",
                  color: isCatActive ? "var(--dt-cta-text, #fff)" : "var(--dt-text)",
                  border: `1px solid ${isCatActive ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-text) 12%, transparent)"}`,
                }}
              >
                {catName} ({count})
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

const FaqAccordion: React.FC<{
  item: FaqItem;
  isDark?: boolean;
  variant?: "card" | "minimal" | "numbered";
  index?: number;
  onUpdateItem?: (index: number, field: string, value: string) => void;
  section?: string;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}> = ({ item, isDark = false, variant = "card", index = 0, onUpdateItem, section, isEditorMode = false, isSelected = false, collapseSheetForInlineEdit, onEditingStateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reactId = useId();
  const answerId = `faq-answer-${reactId}`;
  const num = String(index + 1).padStart(2, "0");

  const handleUpdate = (field: string, value: string) => {
    onUpdateItem?.(index, field, value);
  };

  // ── Numbered variant ────────────────────────────────────────────────────────
  if (variant === "numbered") {
    const HeaderNumered = isEditorMode ? "div" : "button";
    return (
      <div className={`border-b transition-colors duration-200 ${isDark ? "border-slate-700/50" : "border-stone-200"}`}>
        <HeaderNumered
          {...(isEditorMode
            ? { role: "button", tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen); } }
            : { type: "button" as const, "aria-expanded": isOpen, "aria-controls": answerId }
          )}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-5 flex items-start gap-4 text-left cursor-pointer select-none focus:outline-none"
        >
          <span className={`text-xs font-bold tabular-nums pt-0.5 flex-shrink-0 transition-colors duration-200 ${isDark
            ? isOpen ? "text-cyan-400" : "text-slate-500"
            : isOpen ? "text-[var(--dt-primary,#4F46E5)]" : "text-stone-400"
            }`} style={{ fontVariantNumeric: "tabular-nums" }}>
            {num}
          </span>
          <span className={`flex-1 font-semibold text-sm md:text-base leading-snug transition-colors duration-200 ${isDark
            ? isOpen ? "text-white" : "text-slate-200"
            : isOpen ? "text-stone-900" : "text-stone-700"
            }`}>
            {isEditorMode ? (
              <InlineText
                section={section || "faq"}
                fieldKey={`items.${index}.question`}
                value={item.question}
                onUpdateField={(_, __, val) => handleUpdate("question", val)}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : item.question}
          </span>
          <ChevronDown
            className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out ${isOpen ? "rotate-180" : ""} ${isDark
              ? isOpen ? "text-cyan-400" : "text-slate-500"
              : isOpen ? "text-[var(--dt-primary,#4F46E5)]" : "text-stone-400"
              }`}
          />
        </HeaderNumered>
        <div
          id={answerId}
          style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}
        >
          <div className="overflow-hidden">
            <div className={`pl-8 pb-5 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-stone-500"}`}>
              {isEditorMode ? (
                <InlineText
                  section={section || "faq"}
                  fieldKey={`items.${index}.answer`}
                  value={item.answer}
                  onUpdateField={(_, __, val) => handleUpdate("answer", val)}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  multiline
                  as="div"
                />
              ) : item.answer}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Minimal variant ─────────────────────────────────────────────────────────
  if (variant === "minimal") {
    const HeaderMinimal = isEditorMode ? "div" : "button";
    return (
      <div className={`border-b transition-colors duration-200 ${isDark ? "border-slate-700/50" : "border-stone-200"}`}>
        <HeaderMinimal
          {...(isEditorMode
            ? { role: "button", tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen); } }
            : { type: "button" as const, "aria-expanded": isOpen, "aria-controls": answerId }
          )}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none"
        >
          <span className={`font-medium text-sm md:text-base flex-1 transition-colors duration-200 ${isDark
            ? isOpen ? "text-white" : "text-slate-300"
            : isOpen ? "text-stone-900" : "text-stone-700"
            }`}>
            {isEditorMode ? (
              <InlineText
                section={section || "faq"}
                fieldKey={`items.${index}.question`}
                value={item.question}
                onUpdateField={(_, __, val) => handleUpdate("question", val)}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : item.question}
          </span>
          <ChevronDown
            className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? "rotate-180" : ""} ${isDark
              ? isOpen ? "text-white" : "text-slate-500"
              : isOpen ? "text-stone-900" : "text-stone-400"
              }`}
          />
        </HeaderMinimal>
        <div
          id={answerId}
          style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}
        >
          <div className="overflow-hidden">
            <div className={`pb-5 text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-stone-500"}`}>
              {isEditorMode ? (
                <InlineText
                  section={section || "faq"}
                  fieldKey={`items.${index}.answer`}
                  value={item.answer}
                  onUpdateField={(_, __, val) => handleUpdate("answer", val)}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  multiline
                  as="div"
                />
              ) : item.answer}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Card variant (default) ──────────────────────────────────────────────────
  const HeaderCard = isEditorMode ? "div" : "button";
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${isDark
        ? `border-slate-700/60 ${isOpen ? "bg-slate-900/70" : "bg-slate-900/30 hover:bg-slate-900/50"}`
        : `border-[#E8DDD0] ${isOpen ? "bg-white shadow-sm" : "bg-[#FAF7F2]/60 hover:bg-white/80"}`
        }`}
    >
      <HeaderCard
        {...(isEditorMode
          ? { role: "button", tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen); } }
          : { type: "button" as const, "aria-expanded": isOpen, "aria-controls": answerId }
        )}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current"
      >
        <span className={`font-semibold text-sm md:text-base flex-1 transition-colors duration-200 ${isDark
          ? isOpen ? "text-white" : "text-slate-200"
          : isOpen ? "text-amber-950" : "text-amber-900"
          }`}>
          {isEditorMode ? (
            <InlineText
              section={section || "faq"}
              fieldKey={`items.${index}.question`}
              value={item.question}
              onUpdateField={(_, __, val) => handleUpdate("question", val)}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          ) : item.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"} ${isDark
            ? isOpen ? "text-cyan-400" : "text-slate-400"
            : isOpen ? "text-amber-700" : "text-amber-500/70"
            }`}
        />
      </HeaderCard>
      <div
        id={answerId}
        style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}
      >
        <div className="overflow-hidden">
          <div className={`px-5 pb-5 pt-1 text-sm leading-relaxed border-t ${isDark
            ? "text-slate-300 border-slate-700/40"
            : "text-[#6D5D50] border-[#E8DDD0]/60"
            }`}>
            {isEditorMode ? (
              <InlineText
                section={section || "faq"}
                fieldKey={`items.${index}.answer`}
                value={item.answer}
                onUpdateField={(_, __, val) => handleUpdate("answer", val)}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                multiline
                as="div"
              />
            ) : item.answer}
          </div>
        </div>
      </div>
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
  language?: "id" | "en";
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, submitting, success, error, buttonClass, inputClass, buttonStyle, inputStyle, language = "id" }) => {
  const isEN = language === "en";
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
        <h3 className="text-xl font-bold text-green-900 mb-2">{isEN ? "Message Sent!" : "Pesan Terkirim!"}</h3>
        <p className="text-green-700 text-sm max-w-sm">
          {isEN ? "Thank you for reaching out. Our team will respond shortly." : "Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda."}
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
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{isEN ? "Full Name" : "Nama Lengkap"}</label>
        <input
          type="text" required value={name} onChange={(e) => setName(e.target.value)}
          placeholder={isEN ? "e.g. John Smith" : "cth. Budi Santoso"} className={inputClass} style={inputStyle}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{isEN ? "Email Address" : "Email"}</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={isEN ? "e.g. john@email.com" : "cth. budi@email.com"} className={inputClass} style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{isEN ? "WhatsApp Number" : "Nomor WA"}</label>
          <input
            type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder={isEN ? "+1 234..." : "cth. 08123456789"} className={inputClass} style={inputStyle}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{isEN ? "Message" : "Pesan Anda"}</label>
        <textarea
          required rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder={isEN ? "Write your message or inquiry here..." : "Tulis pesan atau pertanyaan Anda di sini..."} className={inputClass} style={inputStyle}
        ></textarea>
      </div>
      <button
        type="submit" disabled={submitting}
        className={`${buttonClass} w-full min-h-11 py-3 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2`}
        style={buttonStyle}
      >
        {submitting ? (isEN ? "Sending..." : "Mengirim...") : (
          <>
            {isEN ? "Send Message" : "Kirim Pesan"}
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

// ─── Dynamic Icon Helper ──────────────────────────────────────────────────────

const toPascalCase = (s: string) =>
  s.replace(/(^\w|-\w)/g, (c) => c.replace("-", "").toUpperCase());

const DynamicIcon = ({ name, defaultIcon, className }: { name?: string; defaultIcon: any; className?: string }) => {
  if (name) {
    // Try exact match first (PascalCase from AI), then try PascalCase-converted (kebab-case / lowercase from AI)
    const IconComponent = (LucideIcons as any)[name] ?? (LucideIcons as any)[toPascalCase(name)];
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

const SeoEditorPreview = ({ seo }: { seo?: { title?: string; description?: string; favicon_url?: string; og_image_url?: string; keywords?: string[]; og_type?: string; twitter_card?: string; robots?: string; canonical_path?: string } }) => (
  <section className="bg-background px-5 py-8 border-t border-white/5">
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Info banner */}
      <div className="flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-[11px]" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
        <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 16v-4M12 8h.01" /></svg>
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
            <p className="text-[10px] uppercase tracking-widest text-slate-500">{seo?.og_type || "website"}</p>
            <p className="text-[12px] font-semibold text-slate-200 leading-tight truncate">{seo?.title || "–"}</p>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{seo?.description || "–"}</p>
          </div>
        </div>
      </div>

      {/* Keywords Preview */}
      {(seo?.keywords?.length || 0) > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-2">Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {(seo?.keywords || []).map((kw, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "rgba(99,102,241,0.15)", color: "rgb(165, 180, 252)" }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  </section>
);

function parseGoogleMapsCoords(url?: string | null): { lat: number; lng: number } | null {
  if (!url) return null;
  const m = url.match(/@?(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

// ─── Contact Section ───────────────────────────────────────────────────────────

const TILE_STYLES: Record<string, { url: string; label: string }> = {
  default: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", label: "OSM" },
  cyclosm: { url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png", label: "CyclOSM" },
  light: { url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", label: "Terang" },
  dark: { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", label: "Gelap" },
  esri: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", label: "Esri Street" },
  satelit: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", label: "Satelit" },
};

function MapEmbed({ lat, lng, tileStyle }: { lat: number; lng: number; tileStyle?: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const mapRef = useRef<any>(null);
  const tileRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current || initRef.current) return;
    initRef.current = true;
    let sizeTimer: ReturnType<typeof setTimeout> | null = null;
    import("leaflet").then((L) => {
      import("leaflet/dist/leaflet.css");
      if (!ref.current) return;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      const map = L.map(ref.current, { zoomControl: false, scrollWheelZoom: false }).setView([lat, lng], 15);
      mapRef.current = map;
      const info = TILE_STYLES[tileStyle || "default"] || TILE_STYLES.default;
      tileRef.current = L.tileLayer(info.url, { attribution: "" }).addTo(map);
      L.marker([lat, lng]).addTo(map);
      sizeTimer = setTimeout(() => { if (mapRef.current) map.invalidateSize(); }, 200);
    });
    return () => {
      if (sizeTimer !== null) clearTimeout(sizeTimer);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; initRef.current = false; }
    };
  }, [lat, lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileRef.current) return;
    import("leaflet").then((L) => {
      map.removeLayer(tileRef.current);
      const info = TILE_STYLES[tileStyle || "default"] || TILE_STYLES.default;
      tileRef.current = L.tileLayer(info.url, { attribution: "" }).addTo(map);
    });
  }, [tileStyle]);

  return <div ref={ref} className="w-full h-[220px] rounded-xl overflow-hidden" />;
}

interface ContactSectionProps {
  title?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  mapsUrl?: string | null;
  align?: "left" | "center" | "right" | null;
  showLeadForm?: boolean | null;
  showMap?: boolean | null;
  mapTileStyle?: string | null;
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
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: "id" | "en";
  formPosition?: "right" | "left" | "stack" | null;
  mapLayout?: "inline" | "full" | null;
}

const SharedContactSection: React.FC<ContactSectionProps> = ({
  title, address, phone, email, mapsUrl,
  align = "center",
  showLeadForm, showMap, mapTileStyle, onSubmitLead, leadSubmitting, leadSuccess, leadError,
  wrapperClass = "py-16 px-6", wrapperStyle,
  titleClass = "text-2xl font-bold", titleStyle,
  accentColor = "currentColor",
  textClass = "text-sm", textStyle,
  leadCardClass, leadCardStyle,
  leadTitleClass, leadTitleStyle, leadTitleText,
  leadFormBtnClass, leadFormBtnStyle,
  leadFormInputClass, leadFormInputStyle,
  onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
  language = "id",
  formPosition = "right",
  mapLayout = "inline",
}) => {
  const isEN = language === "en";
  const effectiveLeadTitleText = leadTitleText ?? (isEN ? "Contact Us" : "Hubungi Kami");
  const hasLeadForm = Boolean(showLeadForm && onSubmitLead);
  const effectiveAlign = align || "center";
  const isCenter = effectiveAlign === "center";
  const isStacked = formPosition === "stack";
  const showForm = hasLeadForm;
  const formOnRight = formPosition === "right";

  // Use mapsUrl coords as initial, fall back to geolocation or Jakarta
  const urlCoords = parseGoogleMapsCoords(mapsUrl);
  const [mapCoords, setMapCoords] = useState(urlCoords || { lat: -6.2088, lng: 106.8456 });
  useEffect(() => {
    if (urlCoords) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => { },
        { timeout: 5000, enableHighAccuracy: false },
      );
    }
  }, []);

  // Dummy fallbacks — real data replaces when user fills via editor
  const displayAddress = address || "Alamat Anda";
  const displayPhone = phone || "08xx-xxxx-xxxx";
  const displayEmail = email || "email@anda.com";

  const infoItems: { icon: React.ElementType; text?: string; fieldKey?: string; href?: string }[] = [
    { icon: MapPin, text: displayAddress, fieldKey: "address" },
    { icon: Phone, text: displayPhone, fieldKey: "phone", href: `https://wa.me/${displayPhone.replace(/\D/g, "")}` },
    { icon: Mail, text: displayEmail, fieldKey: "email", href: `mailto:${displayEmail}` },
  ];

  const isMapFull = mapLayout === "full";

  const MapBlock = (
    <div className={`space-y-2 w-full ${isMapFull ? "max-w-none" : ""}`}>
      <div className={`overflow-hidden border w-full ${isMapFull ? "h-72 md:h-80 rounded-none" : "rounded-xl"}`} style={{ borderColor: `${accentColor}20` }}>
        <MapEmbed lat={mapCoords.lat} lng={mapCoords.lng} tileStyle={mapTileStyle} />
      </div>
      <a href={`https://www.google.com/maps/place/@${mapCoords.lat},${mapCoords.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-medium hover:underline" style={{ color: accentColor }}>
        <Globe className="w-3.5 h-3.5" />
        Buka di Google Maps
      </a>
    </div>
  );

  return (
    <section id="contact" className={wrapperClass} style={wrapperStyle}>
      <div className={`mx-auto ${showForm && !isStacked ? "max-w-5xl flex flex-col md:flex-row md:gap-10" : "max-w-3xl"} ${!showForm ? "text-center items-center" : ""}`}>
        {/* Contact info */}
        <div className={`space-y-6 ${!showForm ? "mx-auto" : ""} ${showForm && !isStacked ? "md:w-1/2" : ""}`}>
          {title && (
            <h2 className={`mx-auto ${!showForm ? "max-w-xl" : ""} ${titleClass}`} style={{ ...titleStyle, ...headingVars }}>
              {title}
            </h2>
          )}
          <div className="space-y-4">
            {infoItems.map(({ icon: Icon, text, fieldKey, href }) => {
              const inner = (
                <div className="inline-flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accentColor}18` }}>
                    <Icon className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <div className="min-w-0">
                    {fieldKey ? (
                      <InlineText
                        section="contact"
                        fieldKey={fieldKey}
                        value={text}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="p"
                        className={`${textClass} break-words`}
                        style={textStyle}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    ) : (
                      <p className={`${textClass} break-words`} style={textStyle}>{text}</p>
                    )}
                  </div>
                </div>
              );
              if (href && !isEditorMode) {
                return <a key={text} href={href} target="_blank" rel="noopener noreferrer" className="block no-underline hover:opacity-80 transition-opacity">{inner}</a>;
              }
              return <div key={text}>{inner}</div>;
            })}
          </div>

          {!isMapFull && showMap !== false && MapBlock}
        </div>

        {/* Lead form */}
        {showForm && (
          <div className={`space-y-6 ${showForm && !isStacked ? "md:w-1/2" : ""} ${isStacked ? "mt-10" : ""}`}>
            <div className={leadCardClass || "p-7 rounded-2xl border shadow-sm"} style={leadCardStyle || { background: "white", borderColor: `${accentColor}20` }}>
              <h3 className={`text-base font-bold mb-5 ${leadTitleClass || ""}`} style={leadTitleStyle}>{effectiveLeadTitleText}</h3>
              <LeadForm
                onSubmit={onSubmitLead!}
                submitting={leadSubmitting ?? false}
                success={leadSuccess ?? false}
                error={leadError ?? null}
                buttonClass={leadFormBtnClass || ""}
                buttonStyle={leadFormBtnStyle}
                inputClass={leadFormInputClass || ""}
                inputStyle={leadFormInputStyle}
                language={language}
              />
            </div>
          </div>
        )}
      </div>

      {/* Full-width map below content */}
      {isMapFull && showMap !== false && (
        <div className="mt-10 max-w-none">
          {MapBlock}
        </div>
      )}
    </section>
  );
};

// ─── Benefits (Keunggulan) Section ─────────────────────────────────────────────

interface BenefitsSectionProps {
  benefits: {
    title: string;
    items: BenefitItem[];
    eyebrow?: string;
    subtitle?: string;
    textAlign?: "left" | "center" | "right";
  };
  variant?: "grid" | "stats" | "alternating" | "compact";
  wrapperClass?: string;
  wrapperStyle?: React.CSSProperties;
  eyebrowClass?: string;
  eyebrowStyle?: React.CSSProperties;
  titleClass?: string;
  titleStyle?: React.CSSProperties;
  subtitleClass?: string;
  subtitleStyle?: React.CSSProperties;
  cardClass?: string;
  cardStyle?: React.CSSProperties;
  iconContainerClass?: string;
  iconContainerStyle?: React.CSSProperties;
  iconClass?: string;
  iconStyle?: React.CSSProperties;
  statClass?: string;
  statStyle?: React.CSSProperties;
  statLabelClass?: string;
  statLabelStyle?: React.CSSProperties;
  cardTitleClass?: string;
  cardTitleStyle?: React.CSSProperties;
  cardDescClass?: string;
  cardDescStyle?: React.CSSProperties;
  accentColor?: string;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

const SharedBenefitsSection: React.FC<BenefitsSectionProps> = ({
  benefits: b,
  variant = "grid",
  wrapperClass = "py-[var(--dt-spacing)] px-6",
  wrapperStyle,
  eyebrowClass = "text-[10px] font-bold uppercase tracking-widest block",
  eyebrowStyle,
  titleClass = "text-2xl md:text-3xl font-bold",
  titleStyle,
  subtitleClass = "text-sm",
  subtitleStyle,
  cardClass = "",
  cardStyle,
  iconContainerClass = "w-10 h-10 rounded flex items-center justify-center",
  iconContainerStyle,
  iconClass = "w-5 h-5",
  iconStyle,
  statClass = "text-2xl font-bold leading-none",
  statStyle,
  statLabelClass = "text-[10px] font-semibold uppercase tracking-wider",
  statLabelStyle,
  cardTitleClass = "text-sm font-bold",
  cardTitleStyle,
  cardDescClass = "text-xs leading-relaxed",
  cardDescStyle,
  accentColor = "var(--dt-primary)",
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}) => {
  const containerClass = variant === "compact" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" :
    variant === "stats" ? "grid grid-cols-1 md:grid-cols-3 gap-6" :
      variant === "alternating" ? "grid grid-cols-1 md:grid-cols-2 gap-6" :
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8";

  const statAccent = { color: accentColor };
  const alignStyle = b.textAlign ? { textAlign: b.textAlign as React.CSSProperties['textAlign'] } : { textAlign: "center" as React.CSSProperties['textAlign'] };
  const headerAlign = { ...eyebrowStyle, ...alignStyle };
  const cardAlign = { ...cardStyle, ...alignStyle };

  return (
    <section id="benefits" className={wrapperClass} style={{ ...wrapperStyle, ...alignStyle }}>
      <div className="max-w-6xl mx-auto space-y-10 md:space-y-12">
        {(b.eyebrow || b.title || b.subtitle) && (
          <div className="space-y-2">
            {b.eyebrow && (
              <InlineText
                section="benefits"
                fieldKey="eyebrow"
                value={b.eyebrow}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                className={eyebrowClass}
                style={headerAlign}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            )}
            {b.title && (
              <InlineText
                section="benefits"
                fieldKey="title"
                value={b.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="h2"
                className={titleClass}
                style={{ ...titleStyle, ...headingVars, ...alignStyle }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            )}
            {b.subtitle && (
              <InlineText
                section="benefits"
                fieldKey="subtitle"
                value={b.subtitle}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="p"
                className={subtitleClass}
                style={{ ...subtitleStyle, ...alignStyle }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            )}
          </div>
        )}
        <div className={containerClass}>
          {b.items?.map((item, idx) => {
            if (variant === "stats" && item.stat) {
              return (
                <div key={idx} className={cardClass || "p-6 space-y-3"} style={{ ...cardStyle, ...cardAlign }}>
                  <p className={statClass} style={{ ...statStyle, ...statAccent }}>{item.stat}</p>
                  {item.stat_label && <p className={statLabelClass} style={statLabelStyle}>{item.stat_label}</p>}
                  <div className={iconContainerClass} style={{ ...iconContainerStyle, color: accentColor }}>
                    <DynamicIcon name={item.icon} defaultIcon={Star} className={iconClass} />
                  </div>
                  <h3 className={cardTitleClass} style={cardTitleStyle}>{item.title}</h3>
                  <p className={cardDescClass} style={cardDescStyle}>{item.description}</p>
                </div>
              );
            }
            if (variant === "alternating" && idx % 2 === 1 && item.stat) {
              return (
                <div key={idx} className={`${cardClass || ""} flex flex-col justify-center text-center`} style={{ ...cardStyle, ...cardAlign }}>
                  <p className={statClass} style={{ ...statStyle, ...statAccent }}>{item.stat}</p>
                  {item.stat_label && <p className={statLabelClass} style={statLabelStyle}>{item.stat_label}</p>}
                  <h3 className={cardTitleClass} style={cardTitleStyle}>{item.title}</h3>
                </div>
              );
            }
            return (
              <div key={idx} className={cardClass || "p-5 md:p-6 space-y-3"} style={{ ...cardStyle, ...cardAlign }}>
                {item.stat ? (
                  <div className="space-y-1">
                    <p className={statClass} style={{ ...statStyle, ...statAccent }}>{item.stat}</p>
                    {item.stat_label && <p className={statLabelClass} style={statLabelStyle}>{item.stat_label}</p>}
                  </div>
                ) : (
                  <div className={iconContainerClass} style={{ ...iconContainerStyle, color: accentColor }}>
                    <DynamicIcon name={item.icon} defaultIcon={Star} className={iconClass} />
                  </div>
                )}
                {variant === "compact" ? (
                  <>
                    <h3 className={cardTitleClass} style={cardTitleStyle}>{item.title}</h3>
                    <p className={cardDescClass} style={cardDescStyle}>{item.description}</p>
                  </>
                ) : (
                  <>
                    <h3 className={cardTitleClass} style={cardTitleStyle}>{item.title}</h3>
                    <p className={cardDescClass} style={cardDescStyle}>{item.description}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Inline Edit Primitive Components ──────────────────────────────────────────

export interface InlineTextProps {
  section: string;
  fieldKey: string;
  value?: string | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  as?: React.ElementType;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

export function InlineText({
  section,
  fieldKey,
  value,
  onUpdateField,
  isEditorMode,
  isSelected,
  multiline = false,
  className = "",
  style,
  id,
  as: Component = "span",
  collapseSheetForInlineEdit,
  onEditingStateChange,
  placeholder,
  children,
}: InlineTextProps) {
  const { t } = useI18n();
  const elementRef = useRef<HTMLElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const initialText = value ?? (typeof children === "string" ? children : "") ?? placeholder ?? "";

  // Keep DOM in sync when value changes from outside (e.g. undo, AI regen)
  useEffect(() => {
    if (elementRef.current && !isFocused) {
      elementRef.current.innerText = value ?? (typeof children === "string" ? children : "") ?? placeholder ?? "";
    }
  }, [value, children, placeholder, isFocused]);

  const Comp = (Component || "span") as React.ElementType;

  if (!isEditorMode || !onUpdateField) {
    return <Comp id={id} className={className} style={style}>{children ?? value ?? placeholder}</Comp>;
  }

  const handleFocus = () => {
    setIsFocused(true);
    collapseSheetForInlineEdit?.();
    onEditingStateChange?.(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsFocused(false);
    onEditingStateChange?.(false);
    const newText = e.currentTarget.innerText.trim();
    if (newText !== (value || "").trim()) {
      onUpdateField(section, fieldKey, newText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (elementRef.current) {
        elementRef.current.innerText = value ?? (typeof children === "string" ? children : "") ?? placeholder ?? "";
      }
      e.currentTarget.blur();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const parentInteractive = (e.target as HTMLElement)?.closest("a, button");
    if (parentInteractive) {
      e.preventDefault();
      elementRef.current?.focus();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <Comp
      id={id}
      ref={elementRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none transition-all cursor-text select-text ${
        isFocused
          ? "ring-1 ring-primary/70 rounded-[2px]"
          : "hover:outline-dashed hover:outline-1 hover:outline-primary/50 hover:bg-primary/[0.03] rounded-[2px]"
      } ${className}`}
      style={style}
      title={t("dashboard.sitesEditor.inlineClickToEdit")}
    >
      {initialText}
    </Comp>
  );
}

export interface InlineImageProps {
  section: string;
  fieldKey: string;
  src?: string | null;
  alt?: string;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  className?: string;
  style?: React.CSSProperties;
  collapseSheetForInlineEdit?: () => void;
}

export function InlineImage({
  section,
  fieldKey,
  src,
  alt = "",
  onUpdateField,
  isEditorMode,
  isSelected,
  className = "",
  style,
  collapseSheetForInlineEdit,
}: InlineImageProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!isEditorMode || !onUpdateField) {
    if (!src) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  const handleTriggerUpload = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    collapseSheetForInlineEdit?.();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const secureUrl = await uploadImageFile(file);
      onUpdateField(section, fieldKey, secureUrl);
    } catch (err: any) {
      console.error("Upload image error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className={`relative group/inline-img overflow-hidden ${className}`}
      style={style}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 bg-muted/40 text-muted-foreground border-2 border-dashed border-border rounded-xl">
          <Upload className="w-6 h-6 mb-1 opacity-50" />
          <span className="text-[11px] font-medium opacity-75">{t("dashboard.sitesEditor.addPhoto")}</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <button
        type="button"
        onClick={handleTriggerUpload}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        disabled={uploading}
        className={`absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold shadow-xl border border-white/20 hover:bg-slate-950 active:scale-95 transition-all cursor-pointer disabled:opacity-50 ${
          isSelected ? "opacity-100" : "max-md:opacity-100 opacity-0 group-hover/inline-img:opacity-100"
        } backdrop-blur-sm`}
      >
        {uploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
        ) : (
          <Upload className="w-3.5 h-3.5 text-white" />
        )}
        <span>{uploading ? t("dashboard.sitesEditor.uploadingPhoto") : (src ? t("dashboard.sitesEditor.changePhoto") : t("dashboard.sitesEditor.addPhoto"))}</span>
      </button>
    </div>
  );
}

export {
  NavMenu, WAFloatingButton, BackToTop, navCtaHref, ctaHref,
  SharedTestimonialsSection,
  SharedTestimonialsSection as TestimonialsSection,
  MenuCatalogCard, CatalogMenuFilterBar, FaqAccordion,
  LeadForm, DynamicIcon, LogoImage, SeoEditorPreview,
  CartProvider, CartFab, AddToCartButton, isPlaceholderPrice,
  SharedContactSection,
  SharedContactSection as ContactSection,
  SharedBenefitsSection,
  SharedBenefitsSection as BenefitsSection,
};
export type { MenuCatalogCardProps, CatalogMenuFilterBarProps, NavMenuProps, TestimonialsSectionProps, LeadFormProps, ContactSectionProps, BenefitsSectionProps };
