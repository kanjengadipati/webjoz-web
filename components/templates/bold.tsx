"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  DynamicIcon, LeadForm, TestimonialsSection,
  CartProvider, CartFab, AddToCartButton, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, ctaHref, isPlaceholderPrice,
  ContactSection, BenefitsSection,
} from "./shared";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import GallerySection from "../sections/gallery";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import HeroNeoBrutalist from "../sections/hero/neo-brutalist";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateBold: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections, isPremium = false, language,
  onUpdateField, collapseSheetForInlineEdit, onEditingStateChange
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, menu, catalog, gallery } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const sectionOrder = (() => {
    const base: string[] = dt?.layout?.section_order ?? ["hero", "benefits", "about", "testimonials", "cta", "faq", "contact"];
    const order = [...base];
    const afterHero = (s: string) => {
      const heroIdx = order.indexOf("hero");
      order.splice(heroIdx >= 0 ? heroIdx + 1 : 1, 0, s);
    };
    if (menu    && !order.includes("menu"))    afterHero("menu");
    if (catalog && !order.includes("catalog")) afterHero("catalog");
    if (gallery && !order.includes("gallery")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "gallery");
    return order;
  })();

  // ── Palette ──────────────────────────────────────────────────────────────
  const red = dt?.palette?.primary ?? "#dc2626";
  const bg = "#070504";
  const surface = "#0d0907";
  const card = "#120d0b";
  const border = "#1f1a18";
  const borderRed = `color-mix(in srgb, ${red} 30%, transparent)`;
  const textMuted = "color-mix(in srgb, var(--dt-text) 75%, var(--dt-bg))";
  const ctaText = "var(--dt-cta-text)";

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
          <section id="about" className="py-16 px-6" style={{ background: surface, borderTop: `1px solid ${border}` }}>
            <div className={`max-w-5xl mx-auto ${a.image_url ? "grid md:grid-cols-2 gap-12 items-center" : "max-w-3xl mx-auto"}`}>
              <div className="space-y-5" style={{ textAlign: a.textAlign || "left" }}>
                {a.eyebrow && <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: red }}>{a.eyebrow}</span>}
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight" style={headingVars}>{a.title}</h2>
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
              {a.image_url && (
                <div className="relative">
                  <div className="absolute -inset-2 blur-xl opacity-20" style={{ background: red }} />
                  <div className="relative">
                    <img src={a.image_url} alt={a.title} className="relative w-full h-72 object-cover" style={{ border: `2px solid ${border}` }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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
          <BenefitsSection
            benefits={b}
            wrapperClass="py-16 px-6"
            wrapperStyle={{ background: bg, borderTop: `2px solid ${border}`, borderBottom: `2px solid ${border}` }}
            eyebrowClass="text-[10px] font-black uppercase tracking-widest block"
            eyebrowStyle={{ color: red }}
            titleClass="text-2xl md:text-3xl font-black uppercase tracking-tight text-white"
            subtitleClass="text-sm font-light"
            subtitleStyle={{ color: textMuted }}
            cardClass="p-6 space-y-4 transition-all hover:border-red-600 group"
            cardStyle={{ background: card, border: `2px solid ${border}` }}
            iconContainerClass="w-10 h-10 flex items-center justify-center"
            iconContainerStyle={{ background: `color-mix(in srgb, ${red} 10%, transparent)`, border: `1px solid ${borderRed}` }}
            iconClass="w-5 h-5"
            statClass="text-3xl font-black"
            statStyle={{ color: red }}
            statLabelClass="text-sm font-bold ml-1"
            statLabelStyle={{ color: textMuted }}
            cardTitleClass="font-black text-sm uppercase tracking-tight text-white"
            cardDescClass="text-xs leading-relaxed font-light"
            cardDescStyle={{ color: textMuted }}
            accentColor={red}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),

    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={testimonials}
          designVariant="neobrutalist"
          wrapperClass="py-16 px-6"
          wrapperStyle={{ background: surface, borderTop: `1px solid ${border}` }}
          titleClass="text-white font-black uppercase tracking-tight"
          eyebrowClass="font-black uppercase text-[10px] tracking-widest"
          eyebrowStyle={{ color: red }}
          cardClass=""
          cardStyle={{ background: card, border: `3px solid ${border}`, color: "#fff" }}
          quoteClass="text-sm font-bold leading-relaxed text-white"
          nameClass="text-sm font-black text-white uppercase"
          roleClass="text-[10px] font-bold uppercase tracking-wider"
          roleStyle={{ color: textMuted }}
          accentColor={red}
        />
      </MemoPreviewSectionWrapper>
    ) : null,

    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <section id="menu" className="py-16 px-6" style={{ background: bg, borderTop: `2px solid ${borderRed}` }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1.5" style={{ color: ctaText, background: red, border: `2px solid ${borderRed}` }}>Menu</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white" style={headingVars}>{m.title}</h2>
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
                          ? <><img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover flex-shrink-0 border-2" style={{ borderColor: border }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /><PhotoCredit credit={item.image_credit} /></>
                          : <div className="w-16 h-16 flex-shrink-0 border-2 flex items-center justify-center" style={{ borderColor: border, background: `${red}10` }}><SparkleIcon className="w-9 h-9" /></div>}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between gap-2 items-start">
                            <p className="font-black text-sm uppercase text-white group-hover:text-[var(--dt-accent)] transition-colors">{item.name}</p>
                            {!isPlaceholderPrice(item.price) && item.price && <span className="font-black text-xs shrink-0 px-2 py-0.5" style={{ color: ctaText, background: red }}>{item.price}</span>}
                          </div>
                          {item.description && <p className="text-[11px] font-light leading-relaxed" style={{ color: textMuted }}>{item.description}</p>}
                          <AddToCartButton itemId={`menu-${ci}-${ii}`} itemName={item.name} itemPrice={item.price || null} category={cat.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-200 hover:brightness-110"
                            style={{ background: red, color: ctaText, boxShadow: `2px 2px 0 ${borderRed}` }} />
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
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1.5" style={{ color: ctaText, background: red, border: `2px solid ${borderRed}` }}>Katalog</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white" style={headingVars}>{c.title}</h2>
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
                        {item.badge && <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5" style={{ color: ctaText, background: red }}>{item.badge}</span>}
                        {item.image_url
                          ? <div className="relative"><img src={item.image_url} alt={item.name} className="w-full h-36 object-cover border-2" style={{ borderColor: border }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /><div className="absolute bottom-1 right-2 z-10"><PhotoCredit credit={item.image_credit} /></div></div>
                          : <div className="w-full h-36 border-2 flex items-center justify-center" style={{ borderColor: border, background: `${red}10` }}><SparkleIcon className="w-10 h-10" /></div>}
                        <p className="font-black text-sm uppercase text-white group-hover:text-[var(--dt-accent)] transition-colors">{item.name}</p>
                        {item.description && <p className="text-[11px] font-light leading-relaxed" style={{ color: textMuted }}>{item.description}</p>}
                        {!isPlaceholderPrice(item.price) && item.price && <span className="inline-block font-black text-xs px-2 py-0.5" style={{ color: ctaText, background: red }}>{item.price}</span>}
                        <div className="pt-1">
                          <AddToCartButton itemId={`cat-${ci}-${ii}`} itemName={item.name} itemPrice={item.price || null} category={cat.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-200 hover:brightness-110"
                            style={{ background: red, color: ctaText, boxShadow: `2px 2px 0 ${borderRed}` }} />
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
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white" style={headingVars}>{f.title}</h2>
              <div className="space-y-3">
                {f.items?.map((item, idx) => (
                  <FaqAccordion
                    key={idx}
                    item={item}
                    isDark={true}
                    variant="card"
                    index={idx}
                    onUpdateItem={(index, field, value) => {
                      const nextItems = [...(f.items || [])];
                      nextItems[index] = { ...nextItems[index], [field]: value };
                      onUpdateField?.("faq", "items", nextItems);
                    }}
                    section="faq"
                    isEditorMode={isEditorMode}
                    isSelected={activeSection === "faq"}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
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
              {c.eyebrow && <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: ctaText, opacity: 0.85 }}>{c.eyebrow}</span>}
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight" style={{ color: ctaText, ...headingVars }}>{c.headline}</h2>
              {c.subheadline && <p className="text-sm font-light" style={{ color: ctaText, opacity: 0.85 }}>{c.subheadline}</p>}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-4 font-black text-xs uppercase tracking-widest transition-all hover:opacity-90" style={{ background: "#fff", color: red }}>
                {c.button_text} <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <p className="text-[11px] font-bold" style={{ color: ctaText, opacity: 0.7 }}>{c.trust_signal}</p>}
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
            wrapperClass="py-16 px-6"
            wrapperStyle={{ background: bg, borderTop: `1px solid ${border}` }}
            titleClass="text-2xl md:text-3xl font-black uppercase tracking-tight text-white"
            accentColor={red}
            textClass="text-sm font-light"
            textStyle={{ color: textMuted }}
            leadCardClass="p-6"
            leadCardStyle={{ background: card, border: `2px solid ${border}` }}
            leadTitleClass="text-sm font-black uppercase tracking-widest text-white"
            leadTitleText={language === 'en' ? 'Send Message' : 'Kirim Pesan'}
            leadFormBtnClass="w-full font-black text-xs uppercase tracking-widest text-white hover:brightness-110 transition-all"
            leadFormBtnStyle={{ background: red }}
            leadFormInputClass="w-full px-3 py-2.5 text-sm font-light outline-none focus:ring-1 text-white placeholder-neutral-600"
            leadFormInputStyle={{ background: "#1a110e", border: `1px solid ${border}`, borderRadius: 0 }}
            formPosition={data.contact.form_position ?? "right"}
            language={language}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    gallery: gallery ? (
      <MemoPreviewSectionWrapper section="gallery" label="Galeri" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ gallery, dt }} render={(data) => {
          const { gallery: g, dt: d } = data;
          return <GallerySection gallery={g} design_token={d} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "gallery"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />;
        }} />
      </MemoPreviewSectionWrapper>
    ) : null,
  };

  return (
    <CartProvider waPhone={contact?.phone ?? ""} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#4F46E5"} primaryFg={dt?.palette?.primary ? undefined : "#ffffff"}>
    <div style={{ ...cssVars, background: bg, color: "#f5f5f5", fontFamily: "var(--dt-body-font)", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Header */}
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <HeaderSection header={header} design_token={dt} sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} />
      </MemoPreviewSectionWrapper>

      {/* Sections */}
      {filterEmptySections(sectionOrder, content, isEditorMode)
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
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "footer"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </MemoPreviewSectionWrapper>

      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: red, color: ctaText }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={header?.brand_name} isPremium={isPremium} floatingType={design_token?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
