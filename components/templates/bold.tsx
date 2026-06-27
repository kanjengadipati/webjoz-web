"use client";

import React from "react";
import { Flame, Sparkles, Zap, Shield, Target, ArrowRight, MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, DynamicIcon, LeadForm, TestimonialsSection,
  CartProvider, CartFab, AddToCartButton, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, navCtaHref, isPlaceholderPrice,
  ContactSection,
} from "./shared";
import type { TemplateProps } from "./types";

export const TemplateBold: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, menu, catalog } = content;
  const dt = design_token ?? null;
  const sectionOrder = (() => {
    const base: string[] = ["hero", "benefits", "about", "testimonials", "cta", "faq", "contact"];
    const order = [...base];
    if (menu && !order.includes("menu")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "menu");
    if (catalog && !order.includes("catalog")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "catalog");
    return order;
  })();

  // ── Palette ──────────────────────────────────────────────────────────────
  const red = "#dc2626";
  const redDark = "#b91c1c";
  const bg = "#070504";
  const surface = "#0d0907";
  const card = "#120d0b";
  const border = "#1f1a18";
  const borderRed = "rgba(220,38,38,0.3)";
  const textMuted = "rgba(163,163,163,0.7)";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <section className="relative py-24 px-6 text-center overflow-hidden" style={{ background: `linear-gradient(180deg, rgba(220,38,38,0.08) 0%, ${bg} 60%)` }}>
            {/* Glow blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(220,38,38,0.12)" }} />
            {h.image_url && (
              <img src={h.image_url} alt={h.headline} className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-luminosity" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
            <div className="max-w-4xl mx-auto relative z-10 space-y-7">
              {h.eyebrow && (
                <span className="inline-flex items-center gap-1.5 border px-4 py-1 text-[10px] font-black uppercase tracking-widest" style={{ borderColor: borderRed, background: "rgba(220,38,38,0.08)", color: red }}>
                  <Zap className="w-3 h-3 fill-current" /> {h.eyebrow}
                </span>
              )}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white">
                {h.headline}
              </h1>
              <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light" style={{ color: textMuted }}>
                {h.subheadline}
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <a href={h.cta_url} className="inline-flex items-center gap-2 px-8 py-4 font-black text-xs uppercase tracking-widest text-white transition-all hover:brightness-110" style={{ background: red, boxShadow: `0 8px 24px rgba(220,38,38,0.3)` }}>
                  {h.cta_text} <ArrowRight className="w-4 h-4" />
                </a>
                {h.cta_secondary_text && (
                  <a href="#about" className="inline-flex items-center gap-2 px-8 py-4 font-black text-xs uppercase tracking-widest transition-all hover:border-red-600" style={{ border: `2px solid ${border}`, color: "#e5e5e5" }}>
                    {h.cta_secondary_text}
                  </a>
                )}
              </div>
              {h.badge_text && (
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(220,38,38,0.7)" }}>{h.badge_text}</p>
              )}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),

    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(a) => (
          <section id="about" className="py-16 px-6" style={{ background: surface, borderTop: `1px solid ${border}` }}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                {a.eyebrow && <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: red }}>{a.eyebrow}</span>}
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">{a.title}</h2>
                <p className="text-sm leading-relaxed font-light" style={{ color: textMuted }}>{a.body}</p>
                {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                  <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: `1px solid ${border}` }}>
                    {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-2xl font-black" style={{ color: red }}>{stat!.value}</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: textMuted }}>{stat!.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="absolute -inset-2 blur-xl opacity-20" style={{ background: red }} />
                {a.image_url
                  ? <img src={a.image_url} alt={a.title} className="relative w-full h-72 object-cover" style={{ border: `2px solid ${border}` }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  : <div className="relative w-full h-72 flex items-center justify-center" style={{ background: card, border: `2px solid ${border}` }}>
                      <Flame className="w-16 h-16 opacity-20" style={{ color: red }} />
                    </div>
                }
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),

    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(b) => (
          <section id="benefits" className="py-16 px-6" style={{ background: bg, borderTop: `2px solid ${border}`, borderBottom: `2px solid ${border}` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="space-y-2">
                {b.eyebrow && <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: red }}>{b.eyebrow}</span>}
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">{b.title}</h2>
                {b.subtitle && <p className="text-sm font-light" style={{ color: textMuted }}>{b.subtitle}</p>}
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {b.items?.map((item, idx) => (
                  <div key={idx} className="p-6 space-y-4 transition-all hover:border-red-600 group" style={{ background: card, border: `2px solid ${border}` }}>
                    <div className="w-10 h-10 flex items-center justify-center" style={{ background: "rgba(220,38,38,0.1)", border: `1px solid ${borderRed}` }}>
                      <span style={{ color: red }}>
                        <DynamicIcon name={item.icon} defaultIcon={Flame} className="w-5 h-5" />
                      </span>
                    </div>
                    {item.stat && (
                      <p className="text-3xl font-black" style={{ color: red }}>
                        {item.stat}<span className="text-sm font-bold ml-1" style={{ color: textMuted }}>{item.stat_label}</span>
                      </p>
                    )}
                    <h3 className="font-black text-sm uppercase tracking-tight text-white">{item.title}</h3>
                    <p className="text-xs leading-relaxed font-light" style={{ color: textMuted }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),

    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={testimonials}
          bgClass="py-16 px-6"
          sectionStyle={{ background: surface, borderTop: `1px solid ${border}` }}
          headingClass="text-white font-black uppercase tracking-tight text-2xl md:text-3xl"
          eyebrowClass="font-black uppercase text-[10px] tracking-widest"
          eyebrowStyle={{ color: red }}
          cardClass=""
          cardStyle={{ background: card, border: `2px solid ${border}` }}
          quoteClass="text-sm font-light leading-relaxed"
          quoteStyle={{ color: textMuted }}
          nameClass="text-sm font-black text-white uppercase"
          roleClass="text-[10px] font-bold uppercase tracking-wider"
          roleStyle={{ color: textMuted }}
        />
      </MemoPreviewSectionWrapper>
    ) : null,

    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <section id="menu" className="py-16 px-6" style={{ background: bg, borderTop: `2px solid ${borderRed}` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1.5" style={{ color: "#fff", background: red, border: `2px solid ${borderRed}` }}>Menu</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">{m.title}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${red})` }} />
                  <span className="w-2 h-2" style={{ background: red, transform: "rotate(45deg)" }} />
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, ${red}, transparent)` }} />
                </div>
              </div>
              {m.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: borderRed }} />
                    <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5" style={{ color: red, border: `2px solid ${borderRed}`, background: `${red}10` }}>{cat.name}</span>
                    <span className="flex-1 h-px" style={{ background: borderRed }} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {cat.items?.map((item, ii) => (
                      <div key={ii} className="flex gap-4 p-4 transition-all duration-300 group hover:translate-y-[-2px]" style={{ background: card, border: `2px solid ${border}`, boxShadow: `4px 4px 0 ${borderRed}` }}>
                        {item.image_url
                          ? <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover flex-shrink-0 border-2" style={{ borderColor: border }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          : <div className="w-16 h-16 flex-shrink-0 border-2 flex items-center justify-center" style={{ borderColor: border, background: `${red}10` }}><Sparkles className="w-6 h-6" style={{ color: `${red}50` }} /></div>}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between gap-2 items-start">
                            <p className="font-black text-sm uppercase text-white group-hover:text-red-300 transition-colors">{item.name}</p>
                            {!isPlaceholderPrice(item.price) && item.price && <span className="font-black text-xs shrink-0 px-2 py-0.5" style={{ color: "#fff", background: red }}>{item.price}</span>}
                          </div>
                          {item.description && <p className="text-[11px] font-light leading-relaxed" style={{ color: textMuted }}>{item.description}</p>}
                          <AddToCartButton itemId={`menu-${ci}-${ii}`} itemName={item.name} itemPrice={item.price || null} category={cat.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition-all duration-200 hover:brightness-110"
                            style={{ background: red, boxShadow: `2px 2px 0 ${borderRed}` }} />
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

    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(c) => (
          <section id="catalog" className="py-16 px-6" style={{ background: bg, borderTop: `2px solid ${borderRed}` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1.5" style={{ color: "#fff", background: red, border: `2px solid ${borderRed}` }}>Katalog</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">{c.title}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${red})` }} />
                  <span className="w-2 h-2" style={{ background: red, transform: "rotate(45deg)" }} />
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, ${red}, transparent)` }} />
                </div>
              </div>
              {c.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: borderRed }} />
                    <span className="text-xs font-black uppercase tracking-widest px-4 py-1.5" style={{ color: red, border: `2px solid ${borderRed}`, background: `${red}10` }}>{cat.name}</span>
                    <span className="flex-1 h-px" style={{ background: borderRed }} />
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {cat.items?.map((item, ii) => (
                      <div key={ii} className="space-y-3 p-4 transition-all duration-300 group hover:translate-y-[-2px]" style={{ background: card, border: `2px solid ${border}`, boxShadow: `4px 4px 0 ${borderRed}` }}>
                        {item.badge && <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5" style={{ color: "#fff", background: red }}>{item.badge}</span>}
                        {item.image_url
                          ? <img src={item.image_url} alt={item.name} className="w-full h-36 object-cover border-2" style={{ borderColor: border }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          : <div className="w-full h-36 border-2 flex items-center justify-center" style={{ borderColor: border, background: `${red}10` }}><Sparkles className="w-10 h-10" style={{ color: `${red}40` }} /></div>}
                        <p className="font-black text-sm uppercase text-white group-hover:text-red-300 transition-colors">{item.name}</p>
                        {item.description && <p className="text-[11px] font-light leading-relaxed" style={{ color: textMuted }}>{item.description}</p>}
                        {!isPlaceholderPrice(item.price) && item.price && <span className="inline-block font-black text-xs px-2 py-0.5" style={{ color: "#fff", background: red }}>{item.price}</span>}
                        <div className="pt-1">
                          <AddToCartButton itemId={`cat-${ci}-${ii}`} itemName={item.name} itemPrice={item.price || null} category={cat.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition-all duration-200 hover:brightness-110"
                            style={{ background: red, boxShadow: `2px 2px 0 ${borderRed}` }} />
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

    faq: (
      <MemoPreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={faq} render={(f) => (
          <section id="faq" className="py-16 px-6" style={{ background: surface, borderTop: `1px solid ${border}` }}>
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">{f.title}</h2>
              <div className="space-y-2">
                {f.items?.map((item, idx) => (
                  <details key={idx} className="group" style={{ background: card, border: `2px solid ${border}` }}>
                    <summary className="flex justify-between items-center p-5 cursor-pointer list-none font-black text-sm uppercase tracking-tight text-white hover:text-red-400 transition-colors">
                      {item.question}
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform shrink-0 ml-4" style={{ color: red }} />
                    </summary>
                    <p className="px-5 pb-5 text-sm font-light leading-relaxed" style={{ color: textMuted, borderTop: `1px solid ${border}` }}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),

    cta: (
      <MemoPreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={cta} render={(c) => (
          <section className="py-20 px-6 text-center relative overflow-hidden" style={{ background: red }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              {c.eyebrow && <span className="text-[10px] font-black uppercase tracking-widest block text-red-100">{c.eyebrow}</span>}
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">{c.headline}</h2>
              {c.subheadline && <p className="text-sm font-light text-red-100">{c.subheadline}</p>}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-4 font-black text-xs uppercase tracking-widest transition-all hover:opacity-90" style={{ background: "#fff", color: red }}>
                {c.button_text} <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <p className="text-[11px] font-bold text-red-200">{c.trust_signal}</p>}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),

    contact: (
      <MemoPreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ contact, onSubmitLead, leadSubmitting, leadSuccess, leadError }} render={(data) => (
          <ContactSection
            title={data.contact.title}
            address={data.contact.address}
            phone={data.contact.phone}
            email={data.contact.email}
            mapsUrl={data.contact.maps_url}
            align={data.contact.align}
            showLeadForm={data.contact.show_lead_form}
            onSubmitLead={data.onSubmitLead}
            leadSubmitting={data.leadSubmitting}
            leadSuccess={data.leadSuccess}
            leadError={data.leadError}
            wrapperClass="py-16 px-6"
            wrapperStyle={{ background: bg, borderTop: `1px solid ${border}` }}
            titleClass="text-2xl md:text-3xl font-black uppercase tracking-tight text-white"
            accentColor={red}
            textClass="text-sm font-light"
            textStyle={{ color: textMuted }}
            leadCardClass="p-6"
            leadCardStyle={{ background: card, border: `2px solid ${border}` }}
            leadTitleClass="text-sm font-black uppercase tracking-widest text-white"
            leadTitleText="Kirim Pesan"
            leadFormBtnClass="w-full font-black text-xs uppercase tracking-widest text-white hover:brightness-110 transition-all"
            leadFormBtnStyle={{ background: red }}
            leadFormInputClass="w-full px-3 py-2.5 text-sm font-light outline-none focus:ring-1 text-white placeholder-neutral-600"
            leadFormInputStyle={{ background: "#1a110e", border: `1px solid ${border}`, borderRadius: 0 }}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
  };

  return (
    <CartProvider waPhone={contact?.phone ?? ""} brandName={header?.brand_name} previewMode={isEditorMode}>
    <div style={{ background: bg, color: "#f5f5f5", fontFamily: "'Outfit', 'Inter', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Header */}
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(h) => (
          <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between gap-4" style={{ background: `${bg}f0`, borderBottom: `2px solid ${border}`, backdropFilter: "blur(8px)" }}>
            <span className="flex shrink-0 items-center gap-2 font-black uppercase tracking-tighter text-white text-lg">
              <LogoImage url={h.logo_url} icon={undefined} defaultIcon={Flame} iconClass="h-8 w-8 shrink-0" imgClass="h-8 w-8 shrink-0 rounded-full object-cover" />
              <span className="min-w-0">
                <span className="block truncate">{h.brand_name}</span>
                {h.tagline && <span className="block text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(220,38,38,0.7)" }}>{h.tagline}</span>}
              </span>
            </span>
            <NavMenu sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} linkClass="text-neutral-400 text-xs font-bold uppercase tracking-wider hover:text-red-400 transition-colors" drawerStyle={{ background: surface, borderTop: `2px solid ${border}` }} />
            <a href={navCtaHref(h.nav_cta_text)} className="px-5 py-2 font-black text-[10px] uppercase tracking-widest text-white transition-all hover:brightness-110" style={{ background: red }}>
              {h.nav_cta_text || "Hubungi Kami"}
            </a>
          </header>
        )} />
      </MemoPreviewSectionWrapper>

      {/* Sections */}
      {sectionOrder
        .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
        .filter(k => !arrivedSections || arrivedSections.includes(k))
        .map((k) => {
          const arrivedIndex = arrivedSections?.indexOf(k) ?? -1;
          const isStreaming = arrivedSections !== undefined && arrivedIndex !== -1;
          return (
            <div
              key={k}
              id={`section-${k}`}
              className={isStreaming ? "animate-slide-up" : ""}
              style={isStreaming ? {
                animationDelay: `${arrivedIndex * 60}ms`,
                opacity: 0,
                animationFillMode: "forwards",
              } : undefined}
            >
              {sectionNodes[k] ?? null}
            </div>
          );
        })}

      {/* Footer */}
      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand: header?.brand_name, copyright_text: footer?.copyright_text, tagline: footer?.tagline }} render={(f) => (
          <footer className="py-8 px-6 text-center" style={{ background: surface, borderTop: `2px solid ${border}` }}>
            <p className="font-black text-xs uppercase tracking-widest text-white mb-1">{f.brand}</p>
            {f.tagline && <p className="text-[10px] font-light mb-2" style={{ color: textMuted }}>{f.tagline}</p>}
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>{f.copyright_text || `© ${new Date().getFullYear()} ${f.brand}. All rights reserved.`}</p>
          </footer>
        )} />
      </MemoPreviewSectionWrapper>

      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      {!isEditorMode && <CartFab colorStyle={{ background: red, color: "#fff" }} />}
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
