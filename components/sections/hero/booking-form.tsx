"use client";
import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Clock, Phone, Send, Sparkles } from "lucide-react";
import type { HeroVariantProps } from "./types";
import { InlineText } from "../../templates/shared";
import { safeHref, isExternalHref } from "@/lib/safe-url";

/**
 * Booking Form — split hero with an inline booking / lead form.
 * Reuses the existing lead submission props and contact data. No image needed.
 */
export default function HeroBookingForm({
  hero: h,
  contact: c,
  onSubmitLead,
  leadSubmitting = false,
  leadSuccess = false,
  leadError = null,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: HeroVariantProps) {
  const isEN = language === "en";
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const canSubmit = Boolean(onSubmitLead) || Boolean(isEditorMode);
  const defaultCta = isEN ? "Book Now" : "Pesan Sekarang";
  const formTitle = c?.form_title || (isEN ? "Send a Booking" : "Kirim Pesanan");
  const common = {
    section: "hero" as const,
    onUpdateField,
    isEditorMode,
    isSelected,
    collapseSheetForInlineEdit,
  };
  const hasSecondary = Boolean(h.cta_secondary_text?.trim() && h.cta_secondary_url?.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!onSubmitLead) {
      // Editor preview: keep the form interactive without side effects.
      return;
    }
    void onSubmitLead({ name, email, phone, message }).catch(() => {});
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 0.85rem",
    borderRadius: "calc(var(--dt-radius, 12px) * 0.8)",
    border: "1px solid color-mix(in srgb, var(--dt-primary) 22%, transparent)",
    background: "color-mix(in srgb, var(--dt-bg) 82%, #FFFFFF)",
    color: "var(--dt-text)",
    fontSize: "0.875rem",
    outline: "none",
  };
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5";
  const labelStyle: React.CSSProperties = {
    color: "var(--dt-text-muted)",
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-5 sm:px-8 md:px-12 py-16 md:py-24"
      style={{ background: "color-mix(in srgb, var(--dt-primary) 6%, var(--dt-bg))" }}
    >
      {/* Decorative accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--dt-primary)" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ── Left: message + quick facts ─────────────────────────────── */}
        <div>
          {(h.eyebrow || isEditorMode) && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{
                background: "color-mix(in srgb, var(--dt-primary) 14%, transparent)",
                color: "var(--dt-primary)",
              }}
            >
              <Sparkles className="size-3.5" aria-hidden />
              <InlineText {...common} fieldKey="eyebrow" value={h.eyebrow} placeholder={isEN ? "Short label" : "Label singkat"} as="span" />
            </motion.div>
          )}

          <InlineText
            {...common}
            fieldKey="headline"
            value={h.headline}
            as="h1"
            multiline
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight, 700)" as React.CSSProperties["fontWeight"],
              fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: "var(--dt-text)",
              margin: 0,
            }}
          />

          <InlineText
            {...common}
            fieldKey="subheadline"
            value={h.subheadline}
            as="p"
            multiline
            style={{
              marginTop: "1rem",
              maxWidth: "34rem",
              color: "var(--dt-text-muted)",
              lineHeight: 1.7,
              fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
            }}
          />

          {/* Quick facts from contact data */}
          <div className="mt-7 space-y-3 text-sm" style={{ color: "var(--dt-text-muted)" }}>
            {Boolean(c?.phone?.trim() || isEditorMode) && (
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "color-mix(in srgb, var(--dt-primary) 13%, transparent)", color: "var(--dt-primary)" }}
                >
                  <Phone className="size-4" aria-hidden />
                </span>
                <InlineText
                  section="contact"
                  fieldKey="phone"
                  value={c?.phone || ""}
                  placeholder={isEN ? "Add phone or WhatsApp..." : "Tambah telepon / WA..."}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>
            )}
            {Boolean(c?.opening_hours?.trim() || isEditorMode) && (
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "color-mix(in srgb, var(--dt-primary) 13%, transparent)", color: "var(--dt-primary)" }}
                >
                  <Clock className="size-4" aria-hidden />
                </span>
                <InlineText
                  section="contact"
                  fieldKey="opening_hours"
                  value={c?.opening_hours || ""}
                  placeholder={isEN ? "Add opening hours..." : "Tambah jam buka..."}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>
            )}
          </div>

          {hasSecondary && (
            <a
              href={safeHref(h.cta_secondary_url, "#contact")}
              {...(isExternalHref(h.cta_secondary_url) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
              style={{ color: "var(--dt-primary)" }}
            >
              <InlineText {...common} fieldKey="cta_secondary_text" value={h.cta_secondary_text} as="span" />
            </a>
          )}
        </div>

        {/* ── Right: inline form ──────────────────────────────────────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.1 }}
          className="w-full p-6 sm:p-8"
          style={{
            background: "var(--dt-surface, var(--dt-bg))",
            color: "var(--dt-text)",
            borderRadius: "calc(var(--dt-radius, 12px) * 1.4)",
            boxShadow: "0 24px 60px -18px color-mix(in srgb, var(--dt-text) 30%, transparent)",
            border: "1px solid color-mix(in srgb, var(--dt-primary) 14%, transparent)",
          }}
        >
          <InlineText
            section="contact"
            fieldKey="form_title"
            value={formTitle}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h2"
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--dt-text)",
              margin: "0 0 1.15rem",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />

          {leadSuccess ? (
            <div className="py-8 text-center">
              <div
                className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full"
                style={{ background: "color-mix(in srgb, #22c55e 16%, transparent)", color: "#16a34a" }}
              >
                <Check className="size-6" aria-hidden />
              </div>
              <p className="text-base font-bold" style={{ color: "var(--dt-text)" }}>
                {isEN ? "Booking received!" : "Pesanan diterima!"}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--dt-text-muted)" }}>
                {isEN
                  ? "Thank you. Our team will confirm your booking shortly."
                  : "Terima kasih. Tim kami akan segera mengonfirmasi pesanan Anda."}
              </p>
            </div>
          ) : canSubmit ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {leadError && (
                <div
                  className="rounded-lg px-3 py-2 text-xs"
                  style={{ background: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#b91c1c" }}
                >
                  {leadError}
                </div>
              )}

              <div>
                <label className={labelClass} style={labelStyle} htmlFor="hero-booking-name">
                  {isEN ? "Full Name" : "Nama Lengkap"}
                </label>
                <input
                  id="hero-booking-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEN ? "e.g. John Smith" : "cth. Budi Santoso"}
                  style={inputStyle}
                />
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} style={labelStyle} htmlFor="hero-booking-phone">
                    {isEN ? "WhatsApp Number" : "Nomor WA"}
                  </label>
                  <input
                    id="hero-booking-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isEN ? "+62 812..." : "cth. 08123456789"}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle} htmlFor="hero-booking-email">
                    Email
                  </label>
                  <input
                    id="hero-booking-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEN ? "john@email.com" : "budi@email.com"}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} style={labelStyle} htmlFor="hero-booking-message">
                  {isEN ? "What do you need?" : "Kebutuhan Anda"}
                </label>
                <textarea
                  id="hero-booking-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isEN ? "Preferred date, service, or question..." : "Tanggal, layanan, atau pertanyaan..."}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={leadSubmitting}
                className="mt-1 flex w-full items-center justify-center gap-2 py-3 text-sm font-bold transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "var(--dt-primary)",
                  color: "var(--dt-on-primary, #FFFFFF)",
                  borderRadius: "calc(var(--dt-radius, 12px) * 0.9)",
                }}
              >
                {leadSubmitting ? (
                  <span>{isEN ? "Sending..." : "Mengirim..."}</span>
                ) : (
                  <>
                    <InlineText
                      {...common}
                      fieldKey="cta_text"
                      value={h.cta_text || defaultCta}
                      as="span"
                      onEditingStateChange={onEditingStateChange}
                    />
                    <Send className="size-4" aria-hidden />
                  </>
                )}
              </button>
            </form>
          ) : (
            <a
              href={safeHref(h.cta_url, "#contact")}
              {...(isExternalHref(h.cta_url) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold no-underline"
              style={{
                background: "var(--dt-primary)",
                color: "var(--dt-on-primary, #FFFFFF)",
                borderRadius: "calc(var(--dt-radius, 12px) * 0.9)",
              }}
            >
              <InlineText {...common} fieldKey="cta_text" value={h.cta_text || defaultCta} as="span" />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
