"use client";

import React from "react";
import { Sparkles, ArrowRight, MapPin, Phone, Mail, ChevronDown, Utensils, Image as ImageIcon } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, LeadForm, TestimonialsSection, MenuCatalogCard,
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, navCtaHref,
  ContactSection,
} from "./shared";
import { buildCssVars, loadGoogleFont } from "./helpers";
import GallerySection from "../sections/gallery";
import type { TemplateProps } from "./types";

export const TemplateColorful: React.FC<TemplateProps> = ({
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
    const base: string[] = ["hero", "about", "menu", "catalog", "testimonials", "benefits", "faq", "cta", "contact"];
    const order = [...base];
    if (gallery && !order.includes("gallery")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "gallery");
    }
    return order;
  })();

  const yellow = dt?.palette?.primary ?? "#FFE135";
  const pink = dt?.palette?.accent ?? "#FF3CAC";
  const black = "#0D0D0D";
  const bg = "#FFFBEB";
  const surface = "#FFFFFF";
  const ctaText = "var(--dt-cta-text)";

  const shadowBlock = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const shadowBlockHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <section className="py-14 px-6 max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-center" style={h.background_color ? { background: h.background_color } : undefined}>
            <div className="md:col-span-7 space-y-5">
              {h.eyebrow && (
                <span className="inline-flex items-center gap-1.5 border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-wider" style={{ boxShadow: "2px 2px 0px #000", background: `color-mix(in srgb, ${yellow} 35%, white)`, color: black }}>
                  <Sparkles className="w-3 h-3" /> {h.eyebrow}
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tight" style={{ color: black }}>
                {h.headline}
              </h1>
              <p className="text-sm font-bold leading-relaxed" style={{ color: "#3D2B00" }}>{h.subheadline}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href={h.cta_url}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 border-2 border-black font-black text-xs uppercase tracking-wider transition-all ${shadowBlock} ${shadowBlockHover}`}
                  style={{ background: yellow, color: ctaText }}>
                  {h.cta_text} <ArrowRight className="w-4 h-4 stroke-[3]" />
                </a>
                {h.cta_secondary_text && (
                  <a href="#contact"
                    className={`inline-flex items-center gap-2 px-6 py-3.5 border-2 border-black font-black text-xs uppercase tracking-wider transition-all bg-white ${shadowBlock} ${shadowBlockHover}`}
                    style={{ color: black }}>
                    {h.cta_secondary_text}
                  </a>
                )}
              </div>
              {h.badge_text && <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: pink }}>{h.badge_text}</p>}
            </div>
            <div className="md:col-span-5 relative">
              <div className="absolute inset-0 rounded-2xl rotate-2 border-2 border-black" style={{ background: pink }} />
              <div className={`relative bg-white border-4 border-black rounded-2xl p-5 space-y-4 ${shadowBlock}`}>
                {h.image_url
                  ? <img src={h.image_url} alt={h.headline} className="w-full h-48 object-cover rounded-xl border-2 border-black" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  : (
                    <div className="w-full h-48 rounded-xl border-2 border-black flex items-center justify-center" style={{ background: yellow }}>
                      <span className="text-5xl">🎯</span>
                    </div>
                  )}
                <div className="border-t-2 border-black pt-3 text-center">
                  <p className="font-black text-sm uppercase">{header?.brand_name}</p>
                </div>
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(a) => (
          <section id="about" className="py-14 px-6 border-y-4 border-black" style={{ background: "#E8F5E9" }}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                {a.eyebrow && <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2 py-1" style={{ background: black, color: yellow }}>{a.eyebrow}</span>}
                <h2 className="text-2xl md:text-3xl font-black uppercase leading-snug" style={{ color: black }}>{a.title}</h2>
                <p className="text-sm font-semibold leading-relaxed" style={{ color: "#2D4A1E" }}>{a.body}</p>
                {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                  <div className="grid grid-cols-3 gap-3 pt-3">
                    {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                      <div key={i} className={`border-2 border-black p-3 text-center ${shadowBlock}`} style={{ background: i === 0 ? yellow : i === 1 ? pink : "#B2EBF2" }}>
                        <p className="text-xl font-black" style={{ color: black }}>{stat!.value}</p>
                        <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: black }}>{stat!.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {a.image_url && (
                <div className="relative">
                  <div className="absolute inset-0 border-2 border-black rounded-xl rotate-2" style={{ background: yellow }} />
                  <img src={a.image_url} alt={a.title} className="relative w-full h-60 object-cover rounded-xl border-4 border-black" style={{ boxShadow: "5px 5px 0 #000" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
              )}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(b) => (
          <section id="benefits" className="py-14 px-6" style={{ background: bg }}>
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                {b.eyebrow && <span className="inline-block border-2 border-black text-[10px] font-black uppercase px-2.5 py-1" style={{ boxShadow: "2px 2px 0 #000", background: yellow, color: ctaText }}>{b.eyebrow}</span>}
                <h2 className="text-2xl md:text-3xl font-black uppercase" style={{ color: black }}>{b.title}</h2>
                {b.subtitle && <p className="text-sm font-bold" style={{ color: "#5D4037" }}>{b.subtitle}</p>}
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {b.items?.map((item, idx) => {
                  const colors = [yellow, "#FFB3C1", "#B3E5FC", "#C8E6C9", "#E1BEE7", "#FFE0B2"];
                  return (
                    <div key={idx} className={`border-2 border-black p-5 space-y-3 transition-all ${shadowBlock} ${shadowBlockHover}`} style={{ background: colors[idx % colors.length] }}>
                      <div className="w-9 h-9 border-2 border-black flex items-center justify-center font-black text-lg" style={{ background: black, color: yellow }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <h3 className="font-black text-sm uppercase" style={{ color: black }}>{item.title}</h3>
                      <p className="text-[11px] font-semibold leading-relaxed" style={{ color: "#333" }}>{item.description}</p>
                      {item.stat && <div className="border-t-2 border-black pt-2"><span className="text-xl font-black" style={{ color: black }}>{item.stat}</span><span className="text-[9px] font-black uppercase ml-1">{item.stat_label}</span></div>}
                    </div>
                  );
                })}
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
          bgClass="py-14 px-6 border-y-4 border-black"
          sectionStyle={{ background: "#FFF9C4" }}
          headingClass="font-black uppercase text-2xl md:text-3xl"
          eyebrowClass="font-black uppercase text-xs"
          cardClass="border-2 border-black"
          cardStyle={{ background: surface, boxShadow: "4px 4px 0px #000" }}
          quoteClass="text-sm font-semibold"
          nameClass="text-sm font-black uppercase"
          roleClass="text-xs font-bold"
        />
      </MemoPreviewSectionWrapper>
    ) : null,
    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <section id="menu" className="py-14 px-6 border-y-4 border-black" style={{ background: "#FCE4EC" }}>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center space-y-3">
                <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1" style={{ background: black, color: yellow }}>Menu</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-center" style={{ color: black }}>{m.title}</h2>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2" style={{ background: black }} />
                  <span className="w-2 h-2" style={{ background: black }} />
                  <span className="w-2 h-2" style={{ background: black }} />
                </div>
              </div>
              {m.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 border-t-4" style={{ borderColor: black }} />
                    <span className="font-black uppercase text-sm px-3 py-1" style={{ color: black, background: yellow }}>{cat.name}</span>
                    <span className="flex-1 border-t-4" style={{ borderColor: black }} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
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
                        className={`group border-2 border-black p-4 flex gap-3 transition-all duration-200 ${shadowBlock} ${shadowBlockHover}`}
                        style={{ background: surface }}
                        imageClassName="w-20 h-20 object-cover border-2 border-black flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                        placeholderClassName="w-20 h-20 border-2 border-black flex items-center justify-center flex-shrink-0"
                        placeholderStyle={{ background: yellow }}
                        placeholderIconClassName="w-8 h-8"
                        placeholderIconStyle={{ color: black }}
                        contentClassName="flex-1 min-w-0"
                        headerClassName="flex justify-between items-start gap-2"
                        titleClassName="font-black text-sm uppercase"
                        titleStyle={{ color: black }}
                        descriptionClassName="text-[11px] font-semibold mt-1 leading-relaxed"
                        descriptionStyle={{ color: "#555" }}
                        priceClassName="font-black text-xs px-2 py-0.5 whitespace-nowrap"
                        priceStyle={{ color: yellow, background: black }}
                        buttonClassName={`mt-2 flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-[10px] font-black uppercase transition-all ${shadowBlock} ${shadowBlockHover}`}
                        buttonStyle={{ background: yellow, color: ctaText }}
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
          <section id="catalog" className="py-14 px-6 border-y-4 border-black" style={{ background: "#E3F2FD" }}>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center space-y-3">
                <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1" style={{ background: black, color: yellow }}>Katalog</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-center" style={{ color: black }}>{c.title}</h2>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2" style={{ background: black }} />
                  <span className="w-2 h-2" style={{ background: black }} />
                  <span className="w-2 h-2" style={{ background: black }} />
                </div>
              </div>
              {c.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 border-t-4" style={{ borderColor: black }} />
                    <span className="font-black uppercase text-sm px-3 py-1" style={{ color: black, background: yellow }}>{cat.name}</span>
                    <span className="flex-1 border-t-4" style={{ borderColor: black }} />
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                        className={`group border-2 border-black p-4 space-y-2 transition-all duration-200 ${shadowBlock} ${shadowBlockHover}`}
                        style={{ background: surface }}
                        imageClassName="w-full h-40 object-cover border-2 border-black group-hover:scale-[1.02] transition-transform duration-300"
                        placeholderClassName="w-full h-40 border-2 border-black flex items-center justify-center"
                        placeholderStyle={{ background: yellow }}
                        placeholderIconClassName="w-10 h-10"
                        placeholderIconStyle={{ color: black }}
                        contentClassName="space-y-2"
                        headerClassName="flex items-start justify-between gap-2"
                        titleClassName="font-black text-sm uppercase"
                        titleStyle={{ color: black }}
                        descriptionClassName="text-[11px] font-semibold leading-relaxed"
                        descriptionStyle={{ color: "#555" }}
                        priceClassName="font-black text-xs"
                        priceStyle={{ color: pink }}
                        badgeClassName="inline-block bg-black text-yellow-300 text-[9px] font-black uppercase px-2 py-0.5"
                        buttonClassName={`w-full flex items-center justify-center gap-1.5 py-2 border-2 border-black text-[10px] font-black uppercase transition-all ${shadowBlock} ${shadowBlockHover}`}
                        buttonStyle={{ background: yellow, color: ctaText }}
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
          <section id="faq" className="py-14 px-6" style={{ background: "#F3E5F5" }}>
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-black uppercase text-center border-b-4 border-black pb-4" style={{ color: black }}>{f.title}</h2>
              <div className="space-y-4">
                {f.items?.map((item, idx) => (
                  <details key={idx} className={`border-2 border-black p-4 group ${shadowBlock}`} style={{ background: surface }}>
                    <summary className="font-black text-sm uppercase cursor-pointer list-none flex justify-between items-center">
                      {item.question}
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform stroke-[3]" />
                    </summary>
                    <p className="mt-3 text-sm font-semibold leading-relaxed border-t-2 border-black pt-3" style={{ color: "#444" }}>{item.answer}</p>
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
          <section className="py-16 px-6 border-y-4 border-black text-center" style={{ background: black }}>
            <div className="max-w-2xl mx-auto space-y-6">
              {c.eyebrow && <span className="inline-block border-2 border-yellow-300 text-yellow-300 text-[10px] font-black uppercase px-2.5 py-1">{c.eyebrow}</span>}
              <h2 className="text-2xl md:text-4xl font-black uppercase leading-tight" style={{ color: yellow }}>{c.headline}</h2>
              {c.subheadline && <p className="text-sm font-bold" style={{ color: "#ccc" }}>{c.subheadline}</p>}
              <a href={c.button_url} className={`inline-flex items-center gap-2 px-8 py-4 border-4 font-black text-sm uppercase tracking-wider transition-all ${shadowBlock} hover:translate-y-0.5`} style={{ borderColor: yellow, background: yellow, color: ctaText }}>
                {c.button_text} <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
              {c.trust_signal && <p className="text-[11px] font-bold" style={{ color: "#999" }}>{c.trust_signal}</p>}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    contact: (
      <MemoPreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={contact} render={(c) => (
          <ContactSection
            title={c.title}
            address={c.address}
            phone={c.phone}
            email={c.email}
            mapsUrl={c.maps_url}
            align={c.align}
            showLeadForm={c.show_lead_form}
            showMap={c.show_map}
            onSubmitLead={onSubmitLead}
            leadSubmitting={leadSubmitting}
            leadSuccess={leadSuccess}
            leadError={leadError}
            wrapperClass="py-14 px-6"
            wrapperStyle={{ background: bg }}
            titleClass="text-2xl font-black uppercase"
            titleStyle={{ color: black }}
            accentColor={pink}
            textClass="text-sm font-semibold"
            textStyle={{ color: "#333" }}
            leadCardClass={`border-2 border-black p-6 ${shadowBlock}`}
            leadCardStyle={{ background: surface }}
            leadTitleText=""
            leadFormBtnClass="border-2 border-black font-black uppercase text-sm"
            leadFormBtnStyle={{ background: yellow, color: ctaText }}
            leadFormInputClass="w-full border-2 border-black p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] bg-white"
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
    <div style={{ ...cssVars, background: bg, color: black, fontFamily: "'Outfit', 'Inter', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Header */}
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(h) => (
          <header className="sticky top-0 z-50 border-b-4 border-black px-6 py-3 flex items-center justify-between gap-4 relative" style={{ background: yellow }}>
            <span className="flex shrink-0 items-center gap-2 font-black text-base uppercase tracking-tight" style={{ color: ctaText }}>
              <LogoImage url={h.logo_url} icon={undefined} defaultIcon={Sparkles} iconClass="h-8 w-8 shrink-0" imgClass="h-8 w-8 shrink-0 border-2 border-black object-cover" />
              <span className="min-w-0">
                <span className="block truncate">{h.brand_name}</span>
                {h.tagline && <span className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: "#5D4037" }}>{h.tagline}</span>}
              </span>
            </span>
            <NavMenu sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} linkClass="font-black uppercase text-sm text-black" drawerStyle={{ background: yellow, borderTop: "4px solid #000" }} />
            <a href={navCtaHref(h.nav_cta_text)} className="px-4 py-2 border-2 border-black font-black text-xs uppercase tracking-wider transition-all" style={{ background: black, color: yellow, boxShadow: "2px 2px 0 rgba(0,0,0,0.3)" }}>
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

      {/* Footer */}
      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand: header?.brand_name, copyright_text: footer?.copyright_text, social_links: footer?.social_links }} render={(f) => (
          <footer className="py-8 text-center border-t-4 border-black" style={{ background: black }}>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: yellow }}>{f.copyright_text || `© ${new Date().getFullYear()} ${f.brand}. All rights reserved.`}</p>
          </footer>
        )} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: pink, color: ctaText }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
