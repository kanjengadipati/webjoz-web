"use client";

import React, { useId, useState } from "react";
import {
  Utensils, Image as ImageIcon, Star, Award, Globe,
  ArrowRight, Clock, Send, Check, ChevronUp, ChevronDown,
  MapPin, Phone, Mail, Sparkles,
} from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, DynamicIcon, TestimonialsSection, MenuCatalogCard,
  WAFloatingButton, BackToTop, SeoEditorPreview, navCtaHref, CartFab,
  CartProvider,
} from "./shared";
import { buildCssVars, loadGoogleFont } from "./helpers";
import type { TemplateProps, FaqItem, DesignToken } from "./types";

// ─── Dynamic FAQ Accordion ──────────────────────────────────────────────────

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

// ─── Dynamic Lead Form ──────────────────────────────────────────────────────

const DynamicLeadForm: React.FC<{
  onSubmit: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>;
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

// ─── TemplateDynamic ────────────────────────────────────────────────────────

export const TemplateDynamic: React.FC<TemplateProps> = ({
  content, design_token,
  onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false
}) => {
  const dt = design_token ?? null;
  const { header, hero, about, benefits, faq, cta, contact, footer, seo } = content;
  const cssVars = buildCssVars(dt);
  const heroStyle = dt?.layout?.hero_style ?? "centered";

  const baseSectionOrder: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "cta", "faq", "contact"];
  const extraSections = (["menu", "catalog", "testimonials"] as const).filter(
    (key) => content[key] && !baseSectionOrder.includes(key)
  );
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

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const rootStyle: any = {
    ...cssVars,
    fontFamily: "var(--dt-body-font)",
    background: "var(--dt-bg)",
    color: "var(--dt-text)",
    minHeight: "100vh",
    overflowX: "hidden",
    containerType: "inline-size",
  };

  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" };

  const renderSection = (key: string) => {
    switch (key) {
      case "hero": return (
        <MemoPreviewSectionWrapper key="hero" section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ hero, dt }} render={(data) => {
            const { hero: h, dt: d } = data;
            return (
              <section style={{ position: "relative", minHeight: heroStyle === "minimal" ? "60vh" : "85vh", display: "flex", alignItems: "center", justifyContent: heroStyle === "split" ? "flex-start" : "center", padding: "5rem 1.5rem", background: heroStyle === "full-bleed" ? `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 12%, var(--dt-bg)), var(--dt-bg))` : "var(--dt-bg)", overflow: "hidden" }}>
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
                <div style={{ maxWidth: heroStyle === "split" ? "560px" : "800px", textAlign: heroStyle === "split" ? "left" : "center", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: heroStyle === "split" ? "flex-start" : "center" }}>
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
    testimonials: content.testimonials ? (
      <MemoPreviewSectionWrapper key="testimonials" section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={content.testimonials}
          headingClass=""
          eyebrowClass=""
          cardClass=""
          quoteClass=""
          nameClass=""
          roleClass=""
          bgClass="py-20 px-5 sm:px-6"
          sectionStyle={{ background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}
          cardStyle={{ background: "var(--dt-surface)", border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)", borderRadius: "var(--dt-radius-lg)" }}
        />
      </MemoPreviewSectionWrapper>
    ) : null,
    menu: content.menu ? (
      <MemoPreviewSectionWrapper key="menu" section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={content.menu} render={(menuData) => (
          <section id="menu" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}>
            <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--dt-primary)", background: `color-mix(in srgb, var(--dt-primary) 8%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>Pilihan Menu</span>
                <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: "var(--dt-text)", marginTop: "0.85rem", lineHeight: 1.15 }}>{menuData.title}</h2>
              </div>
              {menuData.categories?.map((cat, catIdx) => (
                <div key={catIdx} style={{ marginBottom: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
                    <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, var(--dt-primary) 16%, transparent)` }} />
                    <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-primary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{cat.name}</h3>
                    <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, var(--dt-primary) 16%, transparent)` }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                    {cat.items?.map((item, itemIdx) => (
                      <MenuCatalogCard
                        key={itemIdx}
                        itemId={`${cat.name}__${item.name}__${catIdx}_${itemIdx}`}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        category={cat.name}
                        image_url={item.image_url}
                        icon={Utensils}
                        className="transition-all duration-300"
                        style={{ background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, borderRadius: "var(--dt-radius-lg)", overflow: "hidden", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}
                        imageStyle={{ width: "100%", height: "12rem", objectFit: "cover", display: "block" }}
                        placeholderStyle={{ width: "100%", height: "12rem", background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface)), color-mix(in srgb, var(--dt-accent) 8%, var(--dt-surface)))`, display: "flex", alignItems: "center", justifyContent: "center" }}
                        placeholderIconStyle={{ width: 40, height: 40, color: "var(--dt-primary)", opacity: 0.28 }}
                        contentStyle={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}
                        headerStyle={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}
                        titleStyle={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.95rem", margin: 0, lineHeight: 1.35 }}
                        descriptionStyle={{ color: "var(--dt-text-muted)", fontSize: "0.82rem", lineHeight: 1.55, margin: 0, flex: 1 }}
                        priceStyle={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--dt-primary)", background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`, padding: "0.25rem 0.65rem", borderRadius: "9999px", whiteSpace: "nowrap", flexShrink: 0 }}
                        buttonStyle={{ marginTop: "0.625rem", padding: "0.625rem 0.875rem", background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", border: "none", fontFamily: "var(--dt-body-font)", fontWeight: 800, fontSize: "0.75rem" }}
                      />
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--dt-primary)", background: `color-mix(in srgb, var(--dt-primary) 8%, transparent)`, padding: "0.45rem 0.85rem", borderRadius: "9999px" }}>Koleksi Produk</span>
                <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.5rem, 5cqw, 2.5rem)", color: "var(--dt-text)", marginTop: "0.85rem", lineHeight: 1.15 }}>{catalogData.title}</h2>
              </div>
              {catalogData.categories?.map((cat, catIdx) => (
                <div key={catIdx} style={{ marginBottom: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
                    <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, var(--dt-primary) 16%, transparent)` }} />
                    <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-primary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{cat.name}</h3>
                    <span style={{ flex: 1, height: 1, background: `color-mix(in srgb, var(--dt-primary) 16%, transparent)` }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
                    {cat.items?.map((item, itemIdx) => (
                      <MenuCatalogCard
                        key={itemIdx}
                        itemId={`${cat.name}__${item.name}__${catIdx}_${itemIdx}`}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        category={cat.name}
                        image_url={item.image_url}
                        badge={item.badge}
                        icon={ImageIcon}
                        className="transition-all duration-300"
                        style={{ background: "var(--dt-surface)", border: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`, borderRadius: "var(--dt-radius-lg)", overflow: "hidden", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}
                        imageStyle={{ width: "100%", height: "12rem", objectFit: "cover", display: "block" }}
                        placeholderStyle={{ width: "100%", height: "12rem", background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface)), color-mix(in srgb, var(--dt-accent) 8%, var(--dt-surface)))`, display: "flex", alignItems: "center", justifyContent: "center" }}
                        placeholderIconStyle={{ width: 40, height: 40, color: "var(--dt-primary)", opacity: 0.28 }}
                        contentStyle={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}
                        headerStyle={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}
                        titleStyle={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", fontSize: "0.9rem", margin: 0, lineHeight: 1.35 }}
                        descriptionStyle={{ color: "var(--dt-text-muted)", fontSize: "0.8rem", lineHeight: 1.55, margin: 0, flex: 1 }}
                        priceStyle={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, color: "var(--dt-primary)", fontSize: "0.9rem", margin: 0 }}
                        badgeStyle={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--dt-primary)", background: `color-mix(in srgb, var(--dt-primary) 12%, transparent)`, border: `1px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)`, padding: "0.15rem 0.5rem", borderRadius: "9999px", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.05em" }}
                        buttonStyle={{ marginTop: "0.375rem", padding: "0.625rem 0.875rem", background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", border: "none", fontFamily: "var(--dt-body-font)", fontWeight: 800, fontSize: "0.75rem" }}
                      />
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
              <a href={navCtaHref(h?.nav_cta_text)} className="px-3 py-1.5 md:px-5 md:py-2 text-[11px] md:text-sm font-semibold flex-shrink-0 transition-opacity hover:opacity-85" style={{ background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {h?.nav_cta_text || "Hubungi Kami"}
              </a>
            </header>
          );
        }} />
      </MemoPreviewSectionWrapper>

      {sectionOrder.filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key)).map((key) => <React.Fragment key={key}>{sectionNodes[key] ?? null}</React.Fragment>)}

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
      {!isEditorMode && <CartFab />}
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} />
      <BackToTop isEditorMode={isEditorMode} />
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
