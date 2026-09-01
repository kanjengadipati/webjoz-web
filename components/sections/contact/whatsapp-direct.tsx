"use client";
import React from "react";
import { MessageCircle, Phone, Mail, MapPin, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import type { ContactVariantProps } from "./types";
import { InlineText } from "../../templates/shared";
import DynamicLeadForm from "./lead-form";

function formatWhatsAppUrl(phone?: string, businessName?: string): string {
  if (!phone) return "#";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const normalized = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
  const message = encodeURIComponent(`Halo, saya ingin konsultasi dan tanya informasi lebih lanjut mengenai layanan Anda.`);
  return `https://wa.me/${normalized}?text=${message}`;
}

export default function WhatsAppDirect({
  contact: c,
  onSubmitLead,
  leadSubmitting,
  leadSuccess,
  leadError,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
}: ContactVariantProps) {
  const isEN = language === "en";
  const hasPhone = Boolean(c.phone && c.phone.trim());
  const hasEmail = Boolean(c.email && c.email.trim());
  const hasAddress = Boolean(c.address && c.address.trim());
  const hasLeadForm = Boolean(c.show_lead_form && onSubmitLead);
  const waUrl = formatWhatsAppUrl(c.phone);

  return (
    <section
      id="contact"
      style={{
        padding: "var(--dt-spacing) 1.5rem",
        background: `linear-gradient(180deg, color-mix(in srgb, var(--dt-primary) 6%, var(--dt-bg)) 0%, color-mix(in srgb, var(--dt-surface) 90%, var(--dt-bg)) 100%)`,
        borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
      }}
    >
      <div style={{ maxWidth: "68rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            {isEN ? "Fast Response via WhatsApp" : "Respon Cepat via WhatsApp"}
          </div>

          <InlineText
            section="contact"
            fieldKey="title"
            value={c.title || (isEN ? "Get in Touch Directly" : "Konsultasi & Pesan Langsung")}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h2"
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight)" as any,
              fontSize: "clamp(1.5rem, 4.5cqw, 2.35rem)",
              color: "var(--dt-text)",
              margin: "0 0 0.75rem",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
          <InlineText section="contact" fieldKey="subtitle" value={c.subtitle || (isEN ? "Chat with our team directly on WhatsApp for instant assistance, orders, and inquiries." : "Hubungi tim kami langsung melalui WhatsApp untuk konsultasi cepat, pemesanan, dan informasi lengkap.")} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="p" multiline style={{ color: "var(--dt-text-muted)", fontSize: "0.95rem", maxWidth: "34rem", margin: "0 auto", lineHeight: 1.6 } as any} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
        </div>

        {/* Main Grid: WhatsApp Hero Card + Optional Secondary Form/Info */}
        <div className={`grid grid-cols-1 ${hasLeadForm ? "lg:grid-cols-12" : "max-w-xl mx-auto"} gap-6 items-stretch`}>
          {/* WhatsApp Direct Action Card */}
          <div
            className={hasLeadForm ? "lg:col-span-7" : "w-full"}
            style={{
              background: "var(--dt-surface)",
              borderRadius: "var(--dt-radius-lg)",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
            }}
          >
            {/* Top green accent bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "#25D366" }} />

            <div className="space-y-6">
              {/* WhatsApp icon + header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.2)]">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "1.2rem", margin: 0 }}>
                    <InlineText section="contact" fieldKey="whatsapp_card_title" value={c.whatsapp_card_title || "WhatsApp Official"} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#25D366]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                    <span className="font-semibold">{isEN ? "Online & Ready to Help" : "Online & Siap Membantu"}</span>
                  </div>
                </div>
              </div>

              {/* Chat snippet preview */}
              <div
                className="p-4 rounded-xl space-y-1.5"
                style={{
                  background: "color-mix(in srgb, var(--dt-bg) 60%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isEN ? "Default Inquiry Message" : "Pesan Otomatis Siap Kirim:"}
                </span>
                <p className="text-xs italic text-slate-200 leading-relaxed">
                  &ldquo;Halo, saya ingin konsultasi dan tanya informasi lebih lanjut mengenai layanan Anda.&rdquo;
                </p>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: "var(--dt-text-muted)" }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>{isEN ? "Quick Reply" : "Balasan Cepat"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>{isEN ? "100% Free Inquiry" : "Konsultasi Gratis"}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="mt-8">
              {hasPhone ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-white text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_24px_rgba(37,211,102,0.35)]"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                  <span>{isEN ? "Chat via WhatsApp Now" : "Hubungi via WhatsApp Sekarang"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <div className="text-center p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 text-xs text-amber-300">
                  {isEN ? "Add phone number in Site Editor to activate WhatsApp button" : "Masukkan nomor WhatsApp di Site Editor untuk mengaktifkan tombol ini"}
                </div>
              )}
            </div>
          </div>

          {/* Secondary Details: Form or Direct Details */}
          {hasLeadForm ? (
            <div
              className="lg:col-span-5"
              style={{
                background: "var(--dt-surface)",
                borderRadius: "var(--dt-radius-lg)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                padding: "2rem",
              }}
            >
              <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "1.1rem", marginBottom: "1rem" }}>
                <InlineText section="contact" fieldKey="secondary_form_title" value={c.secondary_form_title || (isEN ? "Or Send Message" : "Atau Kirim Pesan")} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
              </h3>
              <DynamicLeadForm
                onSubmit={onSubmitLead!}
                submitting={leadSubmitting}
                success={leadSuccess}
                error={leadError}
                language={language}
              />
            </div>
          ) : (
            (hasAddress || hasEmail || hasPhone) && (
              <div
                className="w-full mt-4 p-4 rounded-xl flex flex-wrap items-center justify-center gap-6 text-xs"
                style={{
                  background: "var(--dt-surface)",
                  border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)",
                  color: "var(--dt-text-muted)",
                }}
              >
                {hasPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span><InlineText section="contact" fieldKey="phone" value={c.phone ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></span>
                  </div>
                )}
                {hasEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span><InlineText section="contact" fieldKey="email" value={c.email ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></span>
                  </div>
                )}
                {hasAddress && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span><InlineText section="contact" fieldKey="address" value={c.address ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" multiline collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></span>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
