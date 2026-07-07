"use client";

import React, { useId, useState, useEffect, useRef } from "react";
import { headingVars } from "./helpers";
import {
  Check, ArrowRight, ChevronDown, ChevronUp, Star, Menu, X, Send,
  Sparkles, MapPin, Phone, Mail, Globe,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CartProvider, CartFab, AddToCartButton, isPlaceholderPrice } from "@/components/cart";

import type { TestimonialItem, FaqItem, ImageCredit, BenefitItem } from "./types";
import PhotoCredit from "../sections/PhotoCredit";

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
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{loading ? "Mengirim..." : "Kirim Pesanan"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.15s_ease]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${alt}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer z-10"
        aria-label="Tutup preview"
      >
        <X className="w-5 h-5" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl shadow-2xl animate-[scaleIn_0.15s_ease]"
        style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}
      />
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.93) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}

// ─── Nav Menu ─────────────────────────────────────────────────────────────────

const NAV_SKIP = new Set(["header", "hero", "footer", "seo"]);

const NAV_LABELS: Record<string, string> = {
  about:    "Tentang",
  benefits: "Keunggulan",
  menu:     "Menu",
  catalog:  "Katalog",
  gallery:  "Galeri",
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
  const [drawerTop, setDrawerTop] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);

  const navItems = sectionOrder
    .filter(k => !NAV_SKIP.has(k) && !hiddenSections.includes(k) && NAV_LABELS[k])
    .map(k => ({ key: k, label: NAV_LABELS[k] }));

  if (navItems.length === 0) return null;

  const handleToggle = () => {
    if (!open && btnRef.current) {
      // Find the nearest header/nav ancestor to get its bottom position.
      // Using fixed positioning avoids iOS Safari's known bug where absolute
      // children of sticky+backdrop-filter parents are clipped.
      const header = btnRef.current.closest("header") ?? btnRef.current.closest("nav") ?? btnRef.current;
      const rect = header.getBoundingClientRect();
      setDrawerTop(rect.bottom);
    }
    setOpen(v => !v);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, key: string) => {
    setOpen(false);
    const doc = e.currentTarget.ownerDocument || document;
    const el = doc.getElementById(key);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
        {navItems.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={(e) => handleClick(e, key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-70 cursor-pointer focus:outline-none ${linkClass}`}
          >
            {label}
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
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={(e) => handleClick(e, key)}
                className={`w-full text-left px-5 py-3 text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer focus:outline-none ${linkClass}`}
              >
                {label}
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
}> = ({ phone, isEditorMode, brandName = "Customer Support", isPremium = false }) => {
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

  if (!hasWa) return null;

  // ── Simple floating WA button (for regular/free users) ─────────────────────
  if (!isPremium) {
    return (
      <a
        href={isEditorMode ? "#" : waUrl}
        target={isEditorMode ? undefined : "_blank"}
        rel="noopener noreferrer"
        onClick={isEditorMode ? (e) => e.preventDefault() : undefined}
        aria-label="Chat via WhatsApp"
        className="fixed bottom-6 right-6 z-[150] flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        style={{ background: "#25D366" }}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
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
                <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs border border-white/25">
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
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
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
            {testimonials.eyebrow && <span className={eyebrowClasses} style={eyebrowStyle}>{testimonials.eyebrow}</span>}
            {testimonials.title && <h2 className={titleClasses} style={{ ...titleStyle, ...headingVars }}>{testimonials.title}</h2>}
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
                  <p className={`text-sm font-bold text-black leading-relaxed flex-1 ${quoteClass}`} style={quoteStyle}>
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t-2 border-black">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ background: t.avatar_color || accentColor }}
                    >
                      {t.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-black text-black leading-tight ${nameClass}`} style={nameStyle}>{t.name}</p>
                      {t.role && <p className={`text-xs font-bold text-stone-600 ${roleClass}`} style={roleStyle}>{t.role}</p>}
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
                  <p className={`text-sm leading-relaxed flex-1 italic font-light ${quoteClass}`} style={quoteStyle}>
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-stone-200/50">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                      style={{ background: t.avatar_color || accentColor, opacity: 0.85 }}
                    >
                      {t.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold leading-tight ${nameClass}`} style={nameStyle}>{t.name}</p>
                      {t.role && <p className={`text-[10px] text-stone-400 ${roleClass}`} style={roleStyle}>{t.role}</p>}
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
                  <p className={`text-sm leading-relaxed flex-1 font-serif italic ${quoteClass}`} style={quoteStyle}>
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: "color-mix(in srgb, var(--dt-border) 20%, transparent)" }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-inner"
                      style={{ background: `linear-gradient(135deg, ${t.avatar_color || accentColor}, color-mix(in srgb, ${t.avatar_color || accentColor} 70%, black))` }}
                    >
                      {t.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold tracking-wide ${nameClass}`} style={nameStyle}>{t.name}</p>
                      {t.role && <p className={`text-xs italic ${roleClass}`} style={roleStyle}>{t.role}</p>}
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
                  <p className={`text-sm leading-relaxed flex-1 font-light tracking-wide ${quoteClass}`} style={quoteStyle}>
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 border border-cyan-400/30"
                      style={{
                        background: `radial-gradient(circle, ${t.avatar_color || accentColor} 0%, rgba(0,0,0,0.4) 100%)`,
                        boxShadow: `0 0 10px ${t.avatar_color || accentColor}33`,
                      }}
                    >
                      {t.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold text-white tracking-wide ${nameClass}`} style={nameStyle}>{t.name}</p>
                      {t.role && <p className={`text-xs text-slate-400 tracking-wider ${roleClass}`} style={roleStyle}>{t.role}</p>}
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
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 border border-white/20"
                        style={{ background: t.avatar_color || accentColor }}
                      >
                        {t.avatar_initials}
                      </div>
                      {/* Contact Info */}
                      <div className="min-w-0 leading-tight">
                        <h4 className="text-xs font-bold truncate">{t.name}</h4>
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
                        {t.quote}
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
                <p className={quoteClasses} style={quoteStyle}>{t.quote}</p>
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: `1px solid color-mix(in srgb, ${accentColor} 15%, transparent)` }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: t.avatar_color || accentColor }}
                  >
                    {t.avatar_initials}
                  </div>
                  <div className="min-w-0">
                    <p className={nameClasses} style={nameStyle}>{t.name}</p>
                    {t.role && <p className={roleClasses} style={roleStyle}>{t.role}</p>}
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
  itemDescription?: string | null;
  category: string;
  image_url?: string | null;
  image_credit?: ImageCredit | null;
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
  itemId, itemName, itemPrice, itemDescription, category, image_url, image_credit, badge, icon,
  layout = "grid", className, style, imageClassName, imageStyle, placeholderClassName,
  placeholderStyle, placeholderIconClassName, placeholderIconStyle, contentClassName,
  contentStyle, headerClassName, headerStyle, titleClassName, titleStyle,
  descriptionClassName, descriptionStyle, priceClassName, priceStyle, badgeClassName,
  badgeStyle, buttonClassName, buttonStyle,
}: MenuCatalogCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const showPrice = itemPrice && !isPlaceholderPrice(itemPrice);

  const imageNode = image_url ? (
    <div className="relative">
      <img
        src={image_url}
        alt={itemName}
        className={imageClassName}
        style={{ ...imageStyle, cursor: "zoom-in" }}
        onClick={() => setLightboxOpen(true)}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      {image_credit?.name && (
        <div className="absolute bottom-1 right-2 z-10">
          <PhotoCredit credit={image_credit} />
        </div>
      )}
      {lightboxOpen && (
        <ImageLightbox src={image_url} alt={itemName} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  ) : (
    <div className={placeholderClassName} style={placeholderStyle}>
      {React.createElement(icon, { className: placeholderIconClassName, style: placeholderIconStyle })}
    </div>
  );

  const header = (
    <div className={headerClassName} style={headerStyle}>
      <div className="min-w-0 flex-1">
        {/* Fixed-height badge zone — reserves space even when badge is absent */}
        <div className="min-h-[1.375rem] mb-1">
          {badge && <span className={badgeClassName} style={badgeStyle}>{badge}</span>}
        </div>
        <h4 className={titleClassName} style={titleStyle}>{itemName}</h4>
      </div>
      {showPrice && <span className={priceClassName} style={priceStyle}>{itemPrice}</span>}
    </div>
  );

  const isLong = itemDescription && itemDescription.length > 90;
  const displayDescription = isLong && !isExpanded 
    ? itemDescription.replace(/\n+/g, " ").substring(0, 80).trim() + "..." 
    : itemDescription;

  const descriptionElement = itemDescription && (
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
  );

  if (layout === "compact") {
    return (
      <div className={className} style={style}>
        <div className="flex items-start gap-4 h-full">
          <div className="flex-shrink-0">{imageNode}</div>
          <div className="min-w-0 flex-1 flex flex-col h-full" style={contentStyle}>
            {header}
            {descriptionElement}
            <div className="mt-auto pt-2">
              <AddToCartButton
                itemId={itemId} itemName={itemName} itemPrice={itemPrice ?? null}
                category={category} className={buttonClassName} style={buttonStyle}
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
        <div className="mt-auto pt-3">
          <AddToCartButton
            itemId={itemId} itemName={itemName} itemPrice={itemPrice ?? null}
            category={category} className={buttonClassName} style={buttonStyle}
          />
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

const FaqAccordion: React.FC<{
  item: FaqItem;
  isDark?: boolean;
  variant?: "card" | "minimal" | "numbered";
  index?: number;
}> = ({ item, isDark = false, variant = "card", index = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reactId = useId();
  const answerId = `faq-answer-${reactId}`;
  const num = String(index + 1).padStart(2, "0");

  // ── Numbered variant ────────────────────────────────────────────────────────
  if (variant === "numbered") {
    return (
      <div className={`border-b transition-colors duration-200 ${isDark ? "border-slate-700/50" : "border-stone-200"}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={answerId}
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
            {item.question}
          </span>
          <ChevronDown
            className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-all duration-300 ease-in-out ${isOpen ? "rotate-180" : ""} ${isDark
              ? isOpen ? "text-cyan-400" : "text-slate-500"
              : isOpen ? "text-[var(--dt-primary,#4F46E5)]" : "text-stone-400"
            }`}
          />
        </button>
        <div
          id={answerId}
          style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}
        >
          <div className="overflow-hidden">
            <p className={`pl-8 pb-5 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-stone-500"}`}>
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Minimal variant ─────────────────────────────────────────────────────────
  if (variant === "minimal") {
    return (
      <div className={`border-b transition-colors duration-200 ${isDark ? "border-slate-700/50" : "border-stone-200"}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={answerId}
          className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none"
        >
          <span className={`font-medium text-sm md:text-base flex-1 transition-colors duration-200 ${isDark
            ? isOpen ? "text-white" : "text-slate-300"
            : isOpen ? "text-stone-900" : "text-stone-700"
          }`}>
            {item.question}
          </span>
          <ChevronDown
            className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? "rotate-180" : ""} ${isDark
              ? isOpen ? "text-white" : "text-slate-500"
              : isOpen ? "text-stone-900" : "text-stone-400"
            }`}
          />
        </button>
        <div
          id={answerId}
          style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}
        >
          <div className="overflow-hidden">
            <p className={`pb-5 text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-stone-500"}`}>
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Card variant (default) ──────────────────────────────────────────────────
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${isDark
        ? `border-slate-700/60 ${isOpen ? "bg-slate-900/70" : "bg-slate-900/30 hover:bg-slate-900/50"}`
        : `border-[#E8DDD0] ${isOpen ? "bg-white shadow-sm" : "bg-[#FAF7F2]/60 hover:bg-white/80"}`
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current"
      >
        <span className={`font-semibold text-sm md:text-base flex-1 transition-colors duration-200 ${isDark
          ? isOpen ? "text-white" : "text-slate-200"
          : isOpen ? "text-amber-950" : "text-amber-900"
        }`}>
          {item.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"} ${isDark
            ? isOpen ? "text-cyan-400" : "text-slate-400"
            : isOpen ? "text-amber-700" : "text-amber-500/70"
          }`}
        />
      </button>
      <div
        id={answerId}
        style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}
      >
        <div className="overflow-hidden">
          <div className={`px-5 pb-5 pt-1 text-sm leading-relaxed border-t ${isDark
            ? "text-slate-300 border-slate-700/40"
            : "text-[#6D5D50] border-[#E8DDD0]/60"
          }`}>
            {item.answer}
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

const SeoEditorPreview = ({ seo }: { seo?: { title?: string; description?: string; favicon_url?: string; og_image_url?: string; keywords?: string[]; og_type?: string; twitter_card?: string; robots?: string; canonical_path?: string } }) => (
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

function toEmbedUrl(url: string): string | null {
  if (/\/maps\/embed\?pb=/.test(url)) return url;

  const coordMatch = url.match(/@?(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    const [, lat, lng] = coordMatch;
    const latF = parseFloat(lat);
    const lngF = parseFloat(lng);
    if (isNaN(latF) || isNaN(lngF)) return null;
    const minLat = (latF - 0.005).toFixed(6);
    const maxLat = (latF + 0.005).toFixed(6);
    const minLng = (lngF - 0.005).toFixed(6);
    const maxLng = (lngF + 0.005).toFixed(6);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng},${minLat},${maxLng},${maxLat}&layer=mapnik&marker=${lat},${lng}`;
  }

  return null;
}

// ─── Contact Section ───────────────────────────────────────────────────────────

const TILE_STYLES: Record<string, { url: string; label: string }> = {
  default: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", label: "OSM" },
  cyclosm: { url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png", label: "CyclOSM" },
  light:   { url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", label: "Terang" },
  dark:    { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", label: "Gelap" },
  esri:    { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", label: "Esri Street" },
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
      setTimeout(() => map.invalidateSize(), 200);
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); } };
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
}

const ContactSection: React.FC<ContactSectionProps> = ({
  title, address, phone, email,
  align = "center",
  showLeadForm, showMap, mapTileStyle, onSubmitLead, leadSubmitting, leadSuccess, leadError,
  wrapperClass = "py-16 px-6", wrapperStyle,
  titleClass = "text-2xl font-bold", titleStyle,
  accentColor = "currentColor",
  textClass = "text-sm", textStyle,
  leadCardClass, leadCardStyle,
  leadTitleClass, leadTitleStyle, leadTitleText = "Hubungi Kami",
  leadFormBtnClass, leadFormBtnStyle,
  leadFormInputClass, leadFormInputStyle,
}) => {
  const hasLeadForm = Boolean(showLeadForm && onSubmitLead);
  const effectiveAlign = align || "center";
  const textAlignClass = effectiveAlign === "left" ? "text-left" : effectiveAlign === "right" ? "text-right" : "text-center";
  const alignItemsClass = effectiveAlign === "left" ? "items-start" : effectiveAlign === "right" ? "items-end" : "items-center";
  const justifyClass = effectiveAlign === "left" ? "justify-start" : effectiveAlign === "right" ? "justify-end" : "justify-center";
  const isCenter = effectiveAlign === "center";
  const containerWidthClass = hasLeadForm ? "max-w-5xl" : isCenter ? "max-w-xl" : "max-w-5xl";
  const containerMarginClass = isCenter ? "mx-auto" : effectiveAlign === "left" ? "mr-auto" : "ml-auto";

  // Always show map with detected location or Jakarta fallback
  const [mapCoords, setMapCoords] = useState({ lat: -6.2088, lng: 106.8456 });
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000, enableHighAccuracy: false },
      );
    }
  }, []);

  // Only show contact rows that have real data — never show placeholder text on the live preview.
  const infoItems: { icon: React.ElementType; text: string; href?: string }[] = [
    ...(address ? [{ icon: MapPin, text: address }] : []),
    ...(phone ? [{ icon: Phone, text: phone, href: `https://wa.me/${phone.replace(/\D/g, "")}` }] : []),
    ...(email ? [{ icon: Mail, text: email, href: `mailto:${email}` }] : []),
  ];


  return (
    <section id="contact" className={wrapperClass} style={wrapperStyle}>
      <div className={`${containerWidthClass} ${containerMarginClass} ${hasLeadForm ? "grid md:grid-cols-2 gap-10 md:gap-14" : textAlignClass}`}>
        {/* Contact info */}
        <div className={`space-y-6 ${textAlignClass} ${!hasLeadForm ? `flex flex-col ${alignItemsClass}` : ""}`}>
          <h2 className={titleClass} style={{ ...titleStyle, ...headingVars }}>{title}</h2>
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

          {showMap !== false && (
            <div className={`space-y-2 mt-2 w-full self-stretch flex flex-col ${alignItemsClass}`}>
              <div className="rounded-xl overflow-hidden border w-full" style={{ borderColor: `${accentColor}20` }}>
                <MapEmbed lat={mapCoords.lat} lng={mapCoords.lng} tileStyle={mapTileStyle} />
              </div>
              <a href={`https://www.google.com/maps/place/@${mapCoords.lat},${mapCoords.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-medium hover:underline" style={{ color: accentColor }}>
                <Globe className="w-3.5 h-3.5" />
                Buka di Google Maps
              </a>
            </div>
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
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
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
            {b.eyebrow && <span className={eyebrowClass} style={headerAlign}>{b.eyebrow}</span>}
            {b.title && <h2 className={titleClass} style={{ ...titleStyle, ...headingVars, ...alignStyle }}>{b.title}</h2>}
            {b.subtitle && <p className={subtitleClass} style={{ ...subtitleStyle, ...alignStyle }}>{b.subtitle}</p>}
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

export {
  NavMenu, WAFloatingButton, BackToTop, navCtaHref, ctaHref,
  TestimonialsSection, MenuCatalogCard, FaqAccordion,
  LeadForm, DynamicIcon, LogoImage, SeoEditorPreview,
  CartProvider, CartFab, AddToCartButton, isPlaceholderPrice,
  ContactSection, BenefitsSection,
};
export type { MenuCatalogCardProps, NavMenuProps, TestimonialsSectionProps, LeadFormProps, ContactSectionProps, BenefitsSectionProps };
