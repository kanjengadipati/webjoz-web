"use client";

import React from "react";
import { Cpu, Zap, ArrowRight, MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, DynamicIcon, LeadForm, TestimonialsSection,
  CartProvider, CartFab, AddToCartButton, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, navCtaHref, ctaHref, isPlaceholderPrice,
  ContactSection, BenefitsSection,
} from "./shared";
import { buildCssVars, loadGoogleFont, headingVars } from "./helpers";
import GallerySection from "../sections/gallery";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateFuturistic: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, menu, catalog, gallery } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);
  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);
  const sectionOrder = (() => {
    const base: string[] = ["hero", "catalog", "benefits", "about", "testimonials", "faq", "cta", "contact"];
    const order = [...base];
    if (menu && !order.includes("menu")) order.splice(order.indexOf("benefits") >= 0 ? order.indexOf("benefits") : order.length, 0, "menu");
    if (gallery && !order.includes("gallery")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "gallery");
    return order;
  })();

  const cyan = "#00d4ff";
  const blue = "var(--dt-primary)";
  const bg = "#060d1a";
  const surface = "#0a1530";
  const card = "rgba(255,255,255,0.04)";
  const border = "rgba(0,212,255,0.12)";
  const glow = "rgba(0,212,255,0.08)";
  const textMuted = "rgba(150,190,230,0.5)";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <section className="relative py-[var(--dt-spacing)] px-6 text-center overflow-hidden" style={{ background: h.background_color || `linear-gradient(180deg, ${bg} 0%, ${surface} 50%, ${bg} 100%)` }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${cyan}11 1px, transparent 1px), linear-gradient(90deg, ${cyan}11 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[150px] pointer-events-none" style={{ background: `linear-gradient(90deg, ${cyan}11, ${blue}22)` }} />
            {h.image_url && (
              <img src={h.image_url} alt={h.headline} className="absolute inset-0 w-full h-full object-cover opacity-[0.04] mix-blend-screen" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
            <div className="max-w-4xl mx-auto relative z-10 space-y-7">
              {h.eyebrow && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ background: `linear-gradient(90deg, ${cyan}11, ${blue}11)`, border: `1px solid ${cyan}33`, color: cyan }}>
                  <Cpu className="w-3 h-3" /> {h.eyebrow}
                </span>
              )}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight leading-none text-white" style={headingVars}>
                {h.headline}
              </h1>
              <p className="text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto" style={{ color: textMuted }}>
                {h.subheadline}
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <a href={ctaHref(contact.phone, h.cta_url)} className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:brightness-110" style={{ background: `linear-gradient(135deg, ${blue}, ${cyan})`, boxShadow: `0 0 30px ${cyan}33`, borderRadius: "var(--dt-radius)" }}>
                  {h.cta_text} <ArrowRight className="w-4 h-4" />
                </a>
                {h.cta_secondary_text && (
                  <a href="#about" className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all" style={{ border: `1px solid ${cyan}55`, color: cyan, borderRadius: "var(--dt-radius)" }}>
                    {h.cta_secondary_text}
                  </a>
                )}
              </div>
              {h.badge_text && (
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: `${cyan}aa` }}>{h.badge_text}</p>
              )}
            </div>
            <PhotoCredit credit={hero.image_credit} className="absolute bottom-2 right-2 text-[10px] text-white/50 z-10" />
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),

    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(a) => (
          <section id="about" className="py-[var(--dt-spacing)] px-6" style={{ background: surface, borderTop: `1px solid ${border}` }}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                {a.eyebrow && <span className="text-[10px] font-semibold uppercase tracking-widest block" style={{ color: cyan }}>{a.eyebrow}</span>}
                <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white leading-tight" style={headingVars}>{a.title}</h2>
                <p className="text-sm font-light leading-relaxed" style={{ color: textMuted }}>{a.body}</p>
                {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                  <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: `1px solid ${border}` }}>
                    {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-2xl font-light" style={{ color: cyan }}>{stat!.value}</p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: textMuted }}>{stat!.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="absolute -inset-2 blur-xl opacity-20" style={{ background: `linear-gradient(135deg, ${cyan}, ${blue})` }} />
                {a.image_url
                  ? <><img src={a.image_url} alt={a.title} className="relative w-full h-72 object-cover" style={{ border: `1px solid ${border}`, borderRadius: "var(--dt-radius)" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /><PhotoCredit credit={a.image_credit} /></>
                  : <div className="relative w-full h-72 flex items-center justify-center" style={{ background: card, border: `1px solid ${border}`, borderRadius: "var(--dt-radius)", backdropFilter: "blur(8px)" }}>
                      <Cpu className="w-16 h-16 opacity-20" style={{ color: cyan }} />
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
          <BenefitsSection
            benefits={b}
            wrapperClass="py-[var(--dt-spacing)] px-6"
            wrapperStyle={{ background: bg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}
            eyebrowClass="text-[10px] font-semibold uppercase tracking-widest block"
            eyebrowStyle={{ color: cyan }}
            titleClass="text-2xl md:text-3xl font-light tracking-tight text-white"
            subtitleClass="text-sm font-light"
            subtitleStyle={{ color: textMuted }}
            cardClass="p-6 space-y-4 transition-all duration-300 hover:translate-y-[-4px]"
            cardStyle={{ background: card, border: `1px solid ${border}`, borderRadius: "var(--dt-radius)", backdropFilter: "blur(8px)", boxShadow: `0 8px 32px rgba(0,0,0,0.3)` }}
            iconContainerClass="w-10 h-10 flex items-center justify-center"
            iconContainerStyle={{ background: `${cyan}11`, border: `1px solid ${cyan}22`, borderRadius: "var(--dt-radius)" }}
            iconClass="w-5 h-5"
            statClass="text-3xl font-light"
            statStyle={{ color: cyan }}
            statLabelClass="text-sm font-semibold ml-1"
            statLabelStyle={{ color: textMuted }}
            cardTitleClass="font-semibold text-sm tracking-tight text-white"
            cardDescClass="text-xs font-light leading-relaxed"
            cardDescStyle={{ color: textMuted }}
            accentColor={cyan}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),

    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={testimonials}
          wrapperClass="py-[var(--dt-spacing)] px-6"
          wrapperStyle={{ background: surface, borderTop: `1px solid ${border}` }}
          titleClass="text-white font-light tracking-tight"
          eyebrowClass="font-semibold uppercase text-[10px] tracking-widest"
          eyebrowStyle={{ color: cyan }}
          cardClass=""
          cardStyle={{ background: card, border: `1px solid ${border}`, borderRadius: "var(--dt-radius)", backdropFilter: "blur(8px)" }}
          quoteClass="text-sm font-light leading-relaxed"
          quoteStyle={{ color: textMuted }}
          nameClass="text-sm font-semibold text-white"
          roleClass="text-[10px] font-semibold uppercase tracking-wider"
          roleStyle={{ color: textMuted }}
          accentColor={cyan}
        />
      </MemoPreviewSectionWrapper>
    ) : null,

    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <section id="menu" className="py-[var(--dt-spacing)] px-6" style={{ background: bg, borderTop: `1px solid ${border}` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5" style={{ color: cyan, background: `${cyan}10`, borderRadius: "var(--dt-radius)", border: `1px solid ${glow}` }}>Menu</span>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white" style={headingVars}>{m.title}</h2>
                <div className="h-px w-20 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${cyan}, transparent)` }} />
              </div>
              {m.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${glow})` }} />
                    <span className="text-xs font-semibold uppercase tracking-widest px-4 py-1" style={{ color: cyan, background: `${cyan}08`, borderRadius: "var(--dt-radius)", border: `1px solid ${glow}` }}>{cat.name}</span>
                    <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${glow}, transparent)` }} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {cat.items?.map((item, ii) => (
                      <div key={ii} className="flex gap-4 p-4 transition-all duration-300 group hover:translate-y-[-2px]" style={{ background: card, border: `1px solid ${border}`, borderRadius: "var(--dt-radius)", backdropFilter: "blur(12px)", boxShadow: `0 4px 24px rgba(0,0,0,0.2)` }}>
                        {item.image_url
                          ? <><img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover flex-shrink-0 ring-1 ring-white/10 group-hover:ring-cyan-400/30 transition-all" style={{ borderRadius: "var(--dt-radius)" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /><PhotoCredit credit={item.image_credit} /></>
                          : <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center" style={{ background: `${cyan}10`, borderRadius: "var(--dt-radius)" }}><Zap className="w-6 h-6" style={{ color: `${cyan}50` }} /></div>}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between gap-2 items-start">
                            <p className="font-semibold text-sm text-white group-hover:text-cyan-200 transition-colors">{item.name}</p>
                            {!isPlaceholderPrice(item.price) && item.price && <span className="text-xs font-semibold shrink-0 px-2 py-0.5 rounded-[var(--dt-radius)]" style={{ color: "#fff", background: `linear-gradient(135deg, ${blue}, ${cyan})` }}>{item.price}</span>}
                          </div>
                          {item.description && <p className="text-[11px] font-light leading-relaxed" style={{ color: textMuted }}>{item.description}</p>}
                          <AddToCartButton itemId={`menu-${ci}-${ii}`} itemName={item.name} itemPrice={item.price || null} category={cat.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${blue}, ${cyan})`, borderRadius: "var(--dt-radius)" }} />
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
          <section id="catalog" className="py-[var(--dt-spacing)] px-6" style={{ background: bg, borderTop: `1px solid ${border}` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5" style={{ color: cyan, background: `${cyan}10`, borderRadius: "var(--dt-radius)", border: `1px solid ${glow}` }}>Katalog</span>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white" style={headingVars}>{c.title}</h2>
                <div className="h-px w-20 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${cyan}, transparent)` }} />
              </div>
              {c.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${glow})` }} />
                    <span className="text-xs font-semibold uppercase tracking-widest px-4 py-1" style={{ color: cyan, background: `${cyan}08`, borderRadius: "var(--dt-radius)", border: `1px solid ${glow}` }}>{cat.name}</span>
                    <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${glow}, transparent)` }} />
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {cat.items?.map((item, ii) => (
                      <div key={ii} className="space-y-3 p-4 transition-all duration-300 group hover:translate-y-[-3px]" style={{ background: card, border: `1px solid ${border}`, borderRadius: "var(--dt-radius)", backdropFilter: "blur(12px)", boxShadow: `0 4px 24px rgba(0,0,0,0.2)` }}>
                        {item.badge && <span className="inline-block text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5" style={{ color: "#fff", background: `linear-gradient(135deg, ${blue}, ${cyan})`, borderRadius: "var(--dt-radius)" }}>{item.badge}</span>}
                        {item.image_url
                          ? <><img src={item.image_url} alt={item.name} className="w-full h-36 object-cover ring-1 ring-white/10 group-hover:ring-cyan-400/30 transition-all" style={{ borderRadius: "var(--dt-radius)" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /><PhotoCredit credit={item.image_credit} /></>
                          : <div className="w-full h-36 flex items-center justify-center" style={{ background: `${cyan}08`, borderRadius: "var(--dt-radius)" }}><Cpu className="w-10 h-10" style={{ color: `${cyan}30` }} /></div>}
                        <p className="font-semibold text-sm text-white group-hover:text-cyan-200 transition-colors">{item.name}</p>
                        {item.description && <p className="text-[11px] font-light leading-relaxed" style={{ color: textMuted }}>{item.description}</p>}
                        {!isPlaceholderPrice(item.price) && item.price && <span className="inline-block text-xs font-semibold px-2 py-0.5" style={{ color: "#fff", background: `linear-gradient(135deg, ${blue}, ${cyan})`, borderRadius: "var(--dt-radius)" }}>{item.price}</span>}
                        <div className="pt-1">
                          <AddToCartButton itemId={`cat-${ci}-${ii}`} itemName={item.name} itemPrice={item.price || null} category={cat.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${blue}, ${cyan})`, borderRadius: "var(--dt-radius)" }} />
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
          <section id="faq" className="py-[var(--dt-spacing)] px-6" style={{ background: surface, borderTop: `1px solid ${border}` }}>
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white" style={headingVars}>{f.title}</h2>
              <div className="space-y-2">
                {f.items?.map((item, idx) => (
                  <details key={idx} className="group" style={{ background: card, border: `1px solid ${border}`, borderRadius: "var(--dt-radius)", backdropFilter: "blur(8px)" }}>
                    <summary className="flex justify-between items-center p-5 cursor-pointer list-none font-semibold text-sm text-white hover:opacity-80 transition-opacity">
                      {item.question}
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform shrink-0 ml-4" style={{ color: cyan }} />
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
          <section className="py-[var(--dt-spacing)] px-6 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${blue}22, ${cyan}11)`, borderTop: `1px solid ${border}` }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: `linear-gradient(${cyan} 1px, transparent 1px), linear-gradient(90deg, ${cyan} 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              {c.eyebrow && <span className="text-[10px] font-semibold uppercase tracking-widest block" style={{ color: cyan }}>{c.eyebrow}</span>}
              <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white leading-tight" style={headingVars}>{c.headline}</h2>
              {c.subheadline && <p className="text-sm font-light" style={{ color: textMuted }}>{c.subheadline}</p>}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:brightness-110" style={{ background: `linear-gradient(135deg, ${blue}, ${cyan})`, boxShadow: `0 0 30px ${cyan}33`, borderRadius: "var(--dt-radius)" }}>
                {c.button_text} <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <p className="text-[11px] font-semibold" style={{ color: `${cyan}aa` }}>{c.trust_signal}</p>}
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
            showMap={data.contact.show_map}
            mapTileStyle={data.contact.map_tile_style}
            onSubmitLead={data.onSubmitLead}
            leadSubmitting={data.leadSubmitting}
            leadSuccess={data.leadSuccess}
            leadError={data.leadError}
            wrapperClass="py-[var(--dt-spacing)] px-6"
            wrapperStyle={{ background: bg, borderTop: `1px solid ${border}` }}
            titleClass="text-2xl md:text-3xl font-light tracking-tight text-white"
            accentColor={cyan}
            textClass="text-sm font-light"
            textStyle={{ color: textMuted }}
            leadCardClass="p-6"
            leadCardStyle={{ background: card, border: `1px solid ${border}`, borderRadius: "var(--dt-radius)", backdropFilter: "blur(8px)" }}
            leadTitleClass="text-sm font-semibold tracking-wider text-white"
            leadTitleText="Kirim Pesan"
            leadFormBtnClass="w-full font-semibold text-xs uppercase tracking-widest text-white transition-all hover:brightness-110"
            leadFormBtnStyle={{ background: `linear-gradient(135deg, ${blue}, ${cyan})`, borderRadius: "var(--dt-radius)" }}
            leadFormInputClass="w-full px-3 py-2.5 text-sm font-light outline-none focus:ring-1 text-white placeholder-neutral-500"
            leadFormInputStyle={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: "var(--dt-radius)" }}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    gallery: gallery ? (
      <MemoPreviewSectionWrapper section="gallery" label="Galeri" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ gallery, dt }} render={(data) => {
          const { gallery: g, dt: d } = data;
          return <GallerySection gallery={g} design_token={d} />;
        }} />
      </MemoPreviewSectionWrapper>
    ) : null,
  };

  return (
    <CartProvider waPhone={contact?.phone ?? ""} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#4F46E5"} primaryFg={dt?.palette?.primary ? undefined : "#ffffff"}>
    <div style={{ ...cssVars, background: bg, color: "#e0f0ff", fontFamily: "var(--dt-body-font)", minHeight: "100vh", overflowX: "hidden" }}>
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(h) => (
          <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between gap-4" style={{ background: `${bg}e0`, borderBottom: `1px solid ${border}`, backdropFilter: "blur(16px)" }}>
            <span className="flex shrink-0 items-center gap-2 font-light tracking-tight text-white text-lg">
              <LogoImage url={h.logo_url} icon={undefined} defaultIcon={Cpu} iconClass="h-8 w-8 shrink-0" imgClass="h-8 w-8 shrink-0 rounded-full object-cover" />
              <span className="min-w-0">
                <span className="block truncate">{h.brand_name}</span>
                {h.tagline && <span className="block text-[9px] font-semibold uppercase tracking-widest" style={{ color: cyan }}>{h.tagline}</span>}
              </span>
            </span>
            <NavMenu sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} linkClass="text-neutral-400 text-xs font-medium uppercase tracking-wider hover:text-cyan-300 transition-colors" drawerStyle={{ background: surface, borderTop: `1px solid ${border}` }} />
            <a href={navCtaHref(h.nav_cta_text)} className="px-5 py-2 font-semibold text-[10px] uppercase tracking-widest text-white transition-all hover:brightness-110" style={{ background: `linear-gradient(135deg, ${blue}, ${cyan})`, borderRadius: "var(--dt-radius)" }}>
              {h.nav_cta_text || "Hubungi Kami"}
            </a>
          </header>
        )} />
      </MemoPreviewSectionWrapper>

      {sectionOrder
        .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
        .filter(k => !arrivedSections || arrivedSections.includes(k))
        .map(k => <div key={k} className="animate-slide-up">{sectionNodes[k] ?? null}</div>)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand: header?.brand_name, copyright_text: footer?.copyright_text, tagline: footer?.tagline }} render={(f) => (
          <footer className="py-8 px-6 text-center" style={{ background: surface, borderTop: `1px solid ${border}` }}>
            <p className="font-semibold text-xs uppercase tracking-widest text-white mb-1">{f.brand}</p>
            {f.tagline && <p className="text-[10px] font-light" style={{ color: textMuted }}>{f.tagline}</p>}
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: textMuted }}>{f.copyright_text || `© ${new Date().getFullYear()} ${f.brand}. All rights reserved.`}</p>
          </footer>
        )} />
      </MemoPreviewSectionWrapper>

      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: `linear-gradient(135deg, ${blue}, ${cyan})`, color: "#fff" }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
