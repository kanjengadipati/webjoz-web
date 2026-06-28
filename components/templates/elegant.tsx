"use client";

import React from "react";
import { Award, Star, MapPin, Phone, Mail, ArrowRight, Globe, Utensils, Image as ImageIcon, Sparkles, Leaf } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, DynamicIcon, LeadForm, TestimonialsSection,
  MenuCatalogCard, CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, navCtaHref,
  ContactSection,
} from "./shared";
import { buildCssVars, loadGoogleFont } from "./helpers";
import GallerySection from "../sections/gallery";
import type { TemplateProps } from "./types";

export const TemplateElegant: React.FC<TemplateProps> = ({
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
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "testimonials", "cta", "faq", "contact"];
    const order = [...base];
    if (testimonials && !order.includes("testimonials")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "testimonials");
    if (menu && !order.includes("menu")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "menu");
    if (catalog && !order.includes("catalog")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "catalog");
    if (gallery && !order.includes("gallery")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "gallery");
    return order;
  })();

  const gold = dt?.palette?.primary ?? "#c9a84c";
  const goldLight = dt?.palette?.accent ?? "#f0d080";
  const darkBg = "#0a0a0a";
  const darkSurface = "#0f0f0f";
  const darkCard = "#141414";
  const textMuted = `color-mix(in srgb, ${gold} 55%, transparent)`;
  const ctaText = "var(--dt-cta-text)";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <section className="relative py-24 px-6 text-center overflow-hidden" style={{ background: h.background_color || `linear-gradient(180deg, #0d0c08 0%, ${darkBg} 100%)` }}>
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] pointer-events-none" style={{ background: gold }} />
            <div className="max-w-4xl mx-auto relative z-10 space-y-7">
              {h.eyebrow && (
                <span className="inline-flex items-center gap-1.5 border px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest font-sans" style={{ borderColor: `${gold}30`, background: `${gold}08`, color: gold }}>
                  <Award className="w-3 h-3" /> {h.eyebrow}
                </span>
              )}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight" style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}>
                {h.headline}
              </h1>
              <p className="text-sm md:text-base leading-relaxed max-w-xl mx-auto font-light" style={{ color: "rgba(245,230,192,0.6)", fontFamily: "sans-serif" }}>
                {h.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a href={h.cta_url} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:brightness-110" style={{ background: gold, color: ctaText }}>
                  {h.cta_text} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              {h.badge_text && (
                <p className="text-[10px] uppercase tracking-widest" style={{ color: textMuted }}>{h.badge_text}</p>
              )}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(a) => (
          <section className="py-20 px-6 border-y" id="about" style={{ background: darkSurface, borderColor: `${gold}15` }}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                {a.eyebrow && <span className="text-[10px] uppercase tracking-widest font-bold font-sans block" style={{ color: gold }}>{a.eyebrow}</span>}
                <h2 className="text-2xl md:text-3xl font-bold leading-snug" style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}>{a.title}</h2>
                <p className="text-sm leading-relaxed font-light font-sans" style={{ color: "rgba(245,230,192,0.55)" }}>{a.body}</p>
                {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: `${gold}20` }}>
                    {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                      <div key={i}>
                        <p className="text-xl font-bold" style={{ color: gold, fontFamily: "Georgia, serif" }}>{stat!.value}</p>
                        <p className="text-[10px] font-sans mt-1" style={{ color: "rgba(245,230,192,0.4)" }}>{stat!.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-0 rounded blur-xl opacity-20" style={{ background: gold }} />
                <div className="relative rounded border p-8 text-center space-y-3" style={{ background: darkCard, borderColor: `${gold}25` }}>
                  {a.image_url
                    ? <img src={a.image_url} alt={a.title} className="w-full h-52 object-cover rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    : <Award className="w-12 h-12 mx-auto" style={{ color: gold }} />}
                  <p className="text-sm font-bold font-sans" style={{ color: goldLight }}>{header?.brand_name}</p>
                </div>
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(b) => (
          <section className="py-20 px-6" id="benefits" style={{ background: darkBg }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-2">
                {b.eyebrow && <span className="text-[10px] uppercase tracking-widest font-bold font-sans block" style={{ color: gold }}>{b.eyebrow}</span>}
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}>{b.title}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {b.items?.map((item, idx) => (
                  <div key={idx} className="p-6 rounded border space-y-3 transition-all hover:brightness-110" style={{ background: darkCard, borderColor: `${gold}20` }}>
                    <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: `${gold}15` }}>
                      <span style={{ color: gold }}>
                        <DynamicIcon name={item.icon} defaultIcon={Star} className="w-5 h-5" />
                      </span>
                    </div>
                    {item.stat && <p className="text-2xl font-bold" style={{ color: gold, fontFamily: "Georgia, serif" }}>{item.stat}<span className="text-sm ml-1" style={{ color: textMuted }}>{item.stat_label}</span></p>}
                    <h3 className="text-sm font-bold font-sans" style={{ color: "#f5e6c0" }}>{item.title}</h3>
                    <p className="text-xs leading-relaxed font-light font-sans" style={{ color: "rgba(245,230,192,0.45)" }}>{item.description}</p>
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
          headingClass=""
          eyebrowClass=""
          cardClass=""
          quoteClass=""
          nameClass=""
          roleClass=""
          bgClass="py-20 px-6"
          sectionStyle={{ background: darkSurface, borderTop: `1px solid ${gold}15` }}
          cardStyle={{ background: darkCard, border: `1px solid ${gold}20`, borderRadius: "8px" }}
        />
      </MemoPreviewSectionWrapper>
    ) : null,
    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <section id="menu" className="py-20 px-6 border-y overflow-hidden" style={{ background: `linear-gradient(180deg, ${darkSurface}, ${darkBg})`, borderColor: `${gold}15` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase tracking-[0.28em] font-sans block" style={{ color: gold }}>Menu Pilihan</span>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}>{m.title}</h2>
                <div style={{ width: "3rem", height: "2px", background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: "0 auto" }} />
              </div>
              {m.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: `${gold}20` }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: gold }} />
                    <h3 className="text-xs uppercase tracking-[0.22em] font-sans" style={{ color: gold }}>{cat.name}</h3>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: gold }} />
                    <span className="flex-1 h-px" style={{ background: `${gold}20` }} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {cat.items?.map((item, ii) => (
                      <MenuCatalogCard
                        key={ii}
                        itemId={`menu-${ci}-${ii}`}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        category={cat.name}
                        image_url={item.image_url}
                        icon={Utensils}
                        className="group transition-all duration-300 hover:translate-y-[-2px]"
                        style={{ background: darkCard, border: `1px solid ${gold}15`, borderRadius: "16px", padding: "1rem", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
                        imageClassName="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                        imageStyle={{ borderRadius: "12px" }}
                        placeholderStyle={{ height: "10rem", borderRadius: "12px", background: `${gold}0d`, display: "flex", alignItems: "center", justifyContent: "center" }}
                        placeholderIconStyle={{ width: 34, height: 34, color: gold, opacity: 0.65 }}
                        contentStyle={{ padding: "1rem 0.25rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}
                        headerStyle={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}
                        titleStyle={{ color: "#f5e6c0", fontFamily: "Georgia, serif", fontSize: "0.95rem", margin: 0, lineHeight: 1.35 }}
                        descriptionStyle={{ color: textMuted, fontSize: "0.75rem", lineHeight: 1.5, margin: 0, flex: 1 }}
                        priceStyle={{ color: gold, fontFamily: "Georgia, serif", fontSize: "0.85rem", fontWeight: 700 }}
                        buttonStyle={{ padding: "0.55rem 1rem", background: gold, color: ctaText, borderRadius: "999px", border: "none", fontFamily: "sans-serif", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
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
    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(c) => (
          <section id="catalog" className="py-20 px-6 border-y overflow-hidden" style={{ background: `linear-gradient(180deg, ${darkSurface}, ${darkBg})`, borderColor: `${gold}15` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase tracking-[0.28em] font-sans block" style={{ color: gold }}>Koleksi Eksklusif</span>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}>{c.title}</h2>
                <div style={{ width: "3rem", height: "2px", background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: "0 auto" }} />
              </div>
              {c.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: `${gold}20` }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: gold }} />
                    <h3 className="text-xs uppercase tracking-[0.22em] font-sans" style={{ color: gold }}>{cat.name}</h3>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: gold }} />
                    <span className="flex-1 h-px" style={{ background: `${gold}20` }} />
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {cat.items?.map((item, ii) => (
                      <MenuCatalogCard
                        key={ii}
                        itemId={`cat-${ci}-${ii}`}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        category={cat.name}
                        image_url={item.image_url}
                        badge={item.badge}
                        icon={ImageIcon}
                        className="group transition-all duration-300 hover:translate-y-[-2px]"
                        style={{ background: darkCard, border: `1px solid ${gold}15`, borderRadius: "16px", padding: "1rem", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
                        imageClassName="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                        imageStyle={{ borderRadius: "12px" }}
                        placeholderStyle={{ height: "11rem", borderRadius: "12px", background: `${gold}0d`, display: "flex", alignItems: "center", justifyContent: "center" }}
                        placeholderIconStyle={{ width: 34, height: 34, color: gold, opacity: 0.65 }}
                        contentStyle={{ padding: "1rem 0.25rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}
                        headerStyle={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}
                        titleStyle={{ color: "#f5e6c0", fontFamily: "Georgia, serif", fontSize: "0.95rem", margin: 0, lineHeight: 1.35 }}
                        descriptionStyle={{ color: textMuted, fontSize: "0.75rem", lineHeight: 1.5, margin: 0, flex: 1 }}
                        priceStyle={{ color: gold, fontFamily: "Georgia, serif", fontSize: "0.9rem", fontWeight: 700 }}
                        badgeStyle={{ color: ctaText, background: gold, borderRadius: "999px", padding: "0.2rem 0.6rem", fontFamily: "sans-serif", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}
                        buttonStyle={{ padding: "0.55rem 1rem", background: gold, color: ctaText, borderRadius: "999px", border: "none", fontFamily: "sans-serif", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
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
    faq: (
      <MemoPreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={faq} render={(f) => (
          <section className="py-20 px-6 max-w-3xl mx-auto space-y-10" id="faq">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold" style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}>{f.title}</h2>
            </div>
            <div className="space-y-3">
              {f.items?.map((item, idx) => <FaqAccordion key={idx} item={item} isDark={true} />)}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    cta: (
      <MemoPreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={cta} render={(c) => (
          <section className="py-20 px-6 border-y" style={{ background: darkSurface, borderColor: `${gold}15` }}>
            <div className="max-w-2xl mx-auto text-center space-y-5">
              {c.eyebrow && <span className="text-[10px] uppercase tracking-widest font-sans block" style={{ color: gold }}>{c.eyebrow}</span>}
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}>{c.headline}</h2>
              {c.subheadline && <p className="text-sm font-light font-sans" style={{ color: "rgba(245,230,192,0.55)" }}>{c.subheadline}</p>}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:brightness-110" style={{ background: gold, color: ctaText }}>
                {c.button_text} <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <p className="text-[10px] font-sans" style={{ color: textMuted }}>{c.trust_signal}</p>}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    contact: (
      <MemoPreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ contact, onSubmitLead, leadSubmitting, leadSuccess, leadError }} render={(data) => (
          <ContactSection
            title={data.contact.title || "Hubungi Kami"}
            address={data.contact.address}
            phone={data.contact.phone}
            email={data.contact.email}
            showLeadForm={data.contact.show_lead_form}
            align={data.contact.align}
            onSubmitLead={data.onSubmitLead}
            leadSubmitting={data.leadSubmitting}
            leadSuccess={data.leadSuccess}
            leadError={data.leadError}
            wrapperClass="py-24 px-6"
            wrapperStyle={{ background: darkBg }}
            titleClass="text-2xl md:text-3xl font-bold"
            titleStyle={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}
            accentColor={gold}
            textClass="text-sm"
            textStyle={{ color: "rgba(245,230,192,0.6)" }}
            mapsUrl={data.contact.maps_url}
            leadCardClass="mt-8 p-8 rounded"
            leadCardStyle={{ background: darkCard, border: `1px solid ${gold}20` }}
            leadTitleClass="text-sm font-bold font-sans text-center uppercase tracking-widest"
            leadTitleStyle={{ color: gold }}
            leadTitleText="Kirim Pesan"
            leadFormBtnClass="w-full font-bold text-[11px] uppercase tracking-widest hover:brightness-110 transition-all"
            leadFormBtnStyle={{ background: gold }}
            leadFormInputClass="w-full px-3 py-2.5 text-sm font-sans outline-none focus:ring-1 bg-[#1a1a17] border border-amber-500/20 text-amber-100 placeholder-neutral-600"
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
    <div style={{ ...cssVars, background: darkBg, color: "#f5e6c0", fontFamily: "Georgia, serif", minHeight: "100vh", overflowX: "hidden" }}>
      <div className="py-2 text-center text-[10px] uppercase tracking-widest font-sans" style={{ background: "#0d0c08", borderBottom: `1px solid ${gold}20`, color: gold }}>
        {header?.tagline || "Layanan Eksklusif · Kualitas Premium · Kepuasan Terjamin"}
      </div>

      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, _hidden: dt?.layout?.hidden_sections }} render={(h) => (
          <header className="sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 relative" style={{ background: `${darkBg}cc`, borderBottom: `1px solid ${gold}15` }}>
            <span className="text-base font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: gold }}>
              <LogoImage url={h.logo_url} icon={undefined} defaultIcon={Globe} iconClass="shrink-0" imgClass="h-8 w-auto shrink-0 object-contain" />
              {h.brand_name}
            </span>
            <NavMenu sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} linkClass="" drawerStyle={{ background: darkCard, borderTop: `1px solid ${gold}20` }} />
            <a href={navCtaHref(h.nav_cta_text)} className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:brightness-110 font-sans" style={{ background: gold, color: ctaText }}>
              {h.nav_cta_text || "Hubungi Kami"}
            </a>
          </header>
        )} />
      </MemoPreviewSectionWrapper>

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

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ tagline: footer?.tagline, copyright_text: footer?.copyright_text, brand: header?.brand_name }} render={(f) => (
          <footer className="py-10 text-center font-sans border-t" style={{ background: "#070707", borderColor: `${gold}15` }}>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: `${gold}40` }}>{f.copyright_text || `© ${new Date().getFullYear()} ${f.brand}. All rights reserved.`}</p>
          </footer>
        )} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: gold, color: ctaText }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
