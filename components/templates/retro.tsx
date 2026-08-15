"use client";

import React from "react";
import { Music, Zap, ArrowRight } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  DynamicIcon, LeadForm, SharedTestimonialsSection,
  CartProvider, CartFab, AddToCartButton, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, ctaHref, isPlaceholderPrice,
  SharedContactSection, SharedBenefitsSection,
} from "./shared";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import GallerySection from "../sections/gallery";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import HeroNeoBrutalist from "../sections/hero/neo-brutalist";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateRetro: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections, isPremium = false, language
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, menu, catalog, gallery } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);
  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);
  const sectionOrder = (() => {
    const base: string[] = ["hero", "about", "testimonials", "benefits", "faq", "cta", "contact"];
    const order = [...base];
    if (menu && !order.includes("menu")) order.splice(order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length, 0, "menu");
    if (catalog && !order.includes("catalog")) order.splice(order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length, 0, "catalog");
    if (gallery && !order.includes("gallery")) order.splice(order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length, 0, "gallery");
    return order;
  })();

  const pink = "var(--dt-primary)";
  const cyan = "#05d9e8";
  const bg = "#120826";
  const surface = "#1a0a30";
  const card = "#241040";
  const border = "rgba(255,42,109,0.15)";
  const cyanGlow = "rgba(5,217,232,0.15)";
  const textMuted = "color-mix(in srgb, var(--dt-text) 75%, var(--dt-bg))";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <HeroNeoBrutalist
            hero={{ ...h, cta_url: ctaHref(contact.phone, h.cta_url) }}
            design_token={dt}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "hero"}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),

    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(a) => (
          <section id="about" className="py-[var(--dt-spacing)] px-6" style={{ background: surface, borderTop: `1px solid ${border}` }}>
            <div className={`max-w-5xl mx-auto ${a.image_url ? "grid md:grid-cols-2 gap-12 items-center" : "max-w-3xl mx-auto"}`}>
              <div className="space-y-5" style={{ textAlign: a.textAlign || "left" }}>
                {a.eyebrow && <span className="text-[10px] font-bold uppercase tracking-[0.2em] block" style={{ color: cyan }}>{a.eyebrow}</span>}
                <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight" style={headingVars}>{a.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{a.body}</p>
                {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                  <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: `1px solid ${border}` }}>
                    {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-2xl font-black" style={{ color: pink }}>{stat!.value}</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: textMuted }}>{stat!.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {a.image_url && (
                <div className="relative">
                  <div className="absolute -inset-2 blur-2xl opacity-20" style={{ background: `linear-gradient(135deg, ${pink}, ${cyan})` }} />
                  <div className="relative">
                    <img src={a.image_url} alt={a.title} className="relative w-full h-72 object-cover rounded-[var(--dt-radius)]" style={{ border: `1px solid ${border}` }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="absolute bottom-1 right-2 z-10">
                      <PhotoCredit credit={a.image_credit} />
                    </div>
                  </div>
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
          <SharedBenefitsSection
            benefits={b}
            wrapperClass="py-[var(--dt-spacing)] px-6"
            wrapperStyle={{ background: bg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}
            eyebrowClass="text-[10px] font-bold uppercase tracking-[0.2em] block"
            eyebrowStyle={{ color: cyan }}
            titleClass="text-2xl md:text-3xl font-black tracking-tight text-white"
            subtitleClass="text-sm"
            subtitleStyle={{ color: textMuted }}
            cardClass="p-6 space-y-4 rounded-[var(--dt-radius)] transition-all duration-300 hover:scale-[1.02]"
            cardStyle={{ background: card, border: `1px solid ${border}`, boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }}
            iconContainerClass="w-10 h-10 flex items-center justify-center rounded-[var(--dt-radius)]"
            iconContainerStyle={{ background: `${pink}15`, border: `1px solid ${pink}33` }}
            iconClass="w-5 h-5"
            statClass="text-3xl font-black"
            statStyle={{ color: cyan }}
            statLabelClass="text-sm font-bold ml-1"
            statLabelStyle={{ color: textMuted }}
            cardTitleClass="font-black text-sm uppercase tracking-tight text-white"
            cardDescClass="text-xs leading-relaxed"
            cardDescStyle={{ color: textMuted }}
            accentColor={pink}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),

    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <SharedTestimonialsSection
          testimonials={testimonials}
          designVariant="neobrutalist"
          wrapperClass="py-[var(--dt-spacing)] px-6"
          wrapperStyle={{ background: surface, borderTop: `1px solid ${border}` }}
          titleClass="text-white font-black tracking-tight"
          eyebrowClass="font-bold uppercase text-[10px] tracking-[0.2em]"
          eyebrowStyle={{ color: cyan }}
          cardClass=""
          cardStyle={{ background: card, border: `3px solid ${border}`, color: "#fff" }}
          quoteClass="text-sm font-bold text-white leading-relaxed"
          nameClass="text-sm font-black text-white uppercase"
          roleClass="text-[10px] font-bold uppercase tracking-wider"
          roleStyle={{ color: textMuted }}
          accentColor={pink}
        />
      </MemoPreviewSectionWrapper>
    ) : null,

    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <section id="menu" className="py-[var(--dt-spacing)] px-6" style={{ background: bg, borderTop: `2px solid ${cyanGlow}` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full" style={{ color: pink, background: `${pink}15`, border: `1px solid ${pink}30` }}>Menu</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white" style={headingVars}>{m.title}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${cyan})` }} />
                  <span className="w-2 h-2 rotate-45" style={{ background: pink }} />
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, ${cyan}, transparent)` }} />
                </div>
              </div>
              {m.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${cyanGlow})` }} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full" style={{ color: cyan, background: `${cyan}10`, border: `1px solid ${cyanGlow}` }}>{cat.name}</span>
                    <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${cyanGlow}, transparent)` }} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {cat.items?.map((item, ii) => (
                      <div key={ii} className="flex gap-4 p-4 rounded-[var(--dt-radius)] transition-all duration-300 group hover:translate-y-[-2px]" style={{ background: card, border: `1px solid ${border}`, boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }}>
                        {item.image_url
                          ? <><img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-[var(--dt-radius)] flex-shrink-0 ring-1 ring-white/10 group-hover:ring-pink-400/30 transition-all" onError={(e) => { e.currentTarget.style.display = 'none'; }} /><PhotoCredit credit={item.image_credit} /></>
                          : <div className="w-16 h-16 rounded-[var(--dt-radius)] flex-shrink-0 flex items-center justify-center ring-1 ring-white/10" style={{ background: `${pink}10` }}><Music className="w-6 h-6" style={{ color: pink }} /></div>}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between gap-2 items-start">
                            <p className="font-black text-sm uppercase text-white group-hover:text-pink-200 transition-colors">{item.name}</p>
                            {!isPlaceholderPrice(item.price) && item.price && <span className="font-black text-xs shrink-0 px-2 py-0.5 rounded-full" style={{ color: "#fff", background: `linear-gradient(135deg, ${pink}, #b91c6b)` }}>{item.price}</span>}
                          </div>
                          {item.description && <p className="text-[11px] leading-relaxed" style={{ color: textMuted }}>{item.description}</p>}
                          <AddToCartButton itemId={`menu-${ci}-${ii}`} itemName={item.name} itemPrice={item.price || null} category={cat.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-[var(--dt-radius)] transition-all duration-200 hover:brightness-110 hover:shadow-lg"
                            style={{ background: `linear-gradient(90deg, ${pink}, #b91c6b)` }} />
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
          <section id="catalog" className="py-[var(--dt-spacing)] px-6" style={{ background: bg, borderTop: `2px solid ${cyanGlow}` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full" style={{ color: pink, background: `${pink}15`, border: `1px solid ${pink}30` }}>Katalog</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white" style={headingVars}>{c.title}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${cyan})` }} />
                  <span className="w-2 h-2 rotate-45" style={{ background: pink }} />
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, ${cyan}, transparent)` }} />
                </div>
              </div>
              {c.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${cyanGlow})` }} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full" style={{ color: cyan, background: `${cyan}10`, border: `1px solid ${cyanGlow}` }}>{cat.name}</span>
                    <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${cyanGlow}, transparent)` }} />
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {cat.items?.map((item, ii) => (
                      <div key={ii} className="space-y-3 p-4 rounded-[var(--dt-radius)] transition-all duration-300 group hover:translate-y-[-3px]" style={{ background: card, border: `1px solid ${border}`, boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }}>
                        {item.badge && <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ color: "#fff", background: `linear-gradient(135deg, ${pink}, #b91c6b)` }}>{item.badge}</span>}
                        {item.image_url
                          ? <div className="relative"><img src={item.image_url} alt={item.name} className="w-full h-36 object-cover rounded-[var(--dt-radius)] ring-1 ring-white/10 group-hover:ring-pink-400/30 transition-all" onError={(e) => { e.currentTarget.style.display = 'none'; }} /><div className="absolute bottom-1 right-2 z-10"><PhotoCredit credit={item.image_credit} /></div></div>
                          : <div className="w-full h-36 rounded-[var(--dt-radius)] flex items-center justify-center" style={{ background: `${pink}10` }}><Music className="w-10 h-10" style={{ color: `${pink}40` }} /></div>}
                        <p className="font-black text-sm uppercase text-white group-hover:text-pink-200 transition-colors">{item.name}</p>
                        {item.description && <p className="text-[11px] leading-relaxed" style={{ color: textMuted }}>{item.description}</p>}
                        {!isPlaceholderPrice(item.price) && item.price && <p className="font-black text-xs inline-block px-2 py-0.5 rounded-full" style={{ color: "#fff", background: `linear-gradient(135deg, ${pink}, #b91c6b)` }}>{item.price}</p>}
                        <div className="pt-1">
                          <AddToCartButton itemId={`cat-${ci}-${ii}`} itemName={item.name} itemPrice={item.price || null} category={cat.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-[var(--dt-radius)] transition-all duration-200 hover:brightness-110 hover:shadow-lg"
                            style={{ background: `linear-gradient(90deg, ${pink}, #b91c6b)` }} />
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
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white" style={headingVars}>{f.title}</h2>
              <div className="space-y-3">
                {f.items?.map((item, idx) => (
                  <FaqAccordion key={idx} item={item} isDark={true} variant="card" index={idx} />
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
          <section className="py-[var(--dt-spacing)] px-6 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${pink}22, ${cyan}11)`, borderTop: `1px solid ${border}` }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#fff_4px,#fff_5px)]" />
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              {c.eyebrow && <span className="text-[10px] font-bold uppercase tracking-[0.2em] block" style={{ color: cyan }}>{c.eyebrow}</span>}
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight" style={headingVars}>{c.headline}</h2>
              {c.subheadline && <p className="text-sm" style={{ color: textMuted }}>{c.subheadline}</p>}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white rounded-[var(--dt-radius)] transition-all hover:brightness-110" style={{ background: `linear-gradient(90deg, ${pink}, #b91c6b)`, boxShadow: `0 0 24px ${pink}44` }}>
                {c.button_text} <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <p className="text-[11px] font-bold" style={{ color: `${cyan}aa` }}>{c.trust_signal}</p>}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),

    contact: (
      <MemoPreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ contact, onSubmitLead, leadSubmitting, leadSuccess, leadError }} render={(data) => (
          <SharedContactSection
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
            titleClass="text-2xl md:text-3xl font-black tracking-tight text-white"
            accentColor={pink}
            textClass="text-sm"
            textStyle={{ color: textMuted }}
            leadCardClass="p-6 rounded-[var(--dt-radius)]"
            leadCardStyle={{ background: card, border: `1px solid ${border}` }}
            leadTitleClass="text-sm font-black uppercase tracking-widest text-white"
            leadTitleText={language === 'en' ? 'Send Message' : 'Kirim Pesan'}
            leadFormBtnClass="w-full font-bold text-xs uppercase tracking-widest text-white rounded-[var(--dt-radius)] transition-all hover:brightness-110"
            leadFormBtnStyle={{ background: `linear-gradient(90deg, ${pink}, #b91c6b)` }}
            leadFormInputClass="w-full px-3 py-2.5 text-sm outline-none focus:ring-1 text-white placeholder-neutral-500 rounded-[var(--dt-radius)]"
            leadFormInputStyle={{ background: "#1a0d2e", border: `1px solid ${border}` }}
            formPosition={data.contact.form_position ?? "left"}
            language={language}
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
    <div style={{ ...cssVars, background: bg, color: "#e0d6ff", fontFamily: "var(--dt-body-font)", minHeight: "100vh", overflowX: "hidden" }}>
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <HeaderSection header={header} design_token={dt} sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} />
      </MemoPreviewSectionWrapper>

      {filterEmptySections(sectionOrder, content, isEditorMode)
        .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
        .filter(k => !arrivedSections || arrivedSections.includes(k))
        .map(k => <div key={k} className="animate-slide-up">{sectionNodes[k] ?? null}</div>)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} />
      </MemoPreviewSectionWrapper>

      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: `linear-gradient(135deg, ${pink}, #b91c6b)`, color: "#fff" }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={header?.brand_name} isPremium={isPremium} floatingType={design_token?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
