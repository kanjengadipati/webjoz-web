"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, ctaHref,
} from "./shared";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import GallerySection from "../sections/gallery";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import HeroSection from "../sections/hero";
import BenefitsSectionInner from "../sections/benefits";
import TestimonialsSectionInner from "../sections/testimonials";
import FaqSectionInner from "../sections/faq";
import ContactSectionInner from "../sections/contact";
import MenuSectionInner from "../sections/menu";
import CatalogSectionInner from "../sections/catalog";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateRetro: React.FC<TemplateProps> = ({
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
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "testimonials", "benefits", "faq", "cta", "contact"];
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
      <HeroSection
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
          <BenefitsSectionInner benefits={b} design_token={dt} language={language} />
        )} />
      </MemoPreviewSectionWrapper>
    ),

    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSectionInner testimonials={testimonials} design_token={dt} />
      </MemoPreviewSectionWrapper>
    ) : null,

    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <MenuSectionInner menu={m} design_token={dt} />
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,

    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(c) => (
          <CatalogSectionInner catalog={c} design_token={dt} />
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,

    faq: (
      <MemoPreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={faq} render={(f) => (
          <FaqSectionInner
            faq={f}
            design_token={dt}
            language={language}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "faq"}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
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
          <ContactSectionInner
            contact={data.contact}
            design_token={dt}
            onSubmitLead={data.onSubmitLead}
            leadSubmitting={data.leadSubmitting}
            leadSuccess={data.leadSuccess}
            leadError={data.leadError}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "contact"}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
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
    <div style={{ ...cssVars, background: bg, color: "#e0d6ff", fontFamily: "var(--dt-body-font)", minHeight: "100vh", overflowX: "hidden", containerType: "inline-size" }}>
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <HeaderSection header={header} design_token={dt} sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} />
      </MemoPreviewSectionWrapper>

      {filterEmptySections(sectionOrder, content, isEditorMode)
        .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
        .filter(k => !arrivedSections || arrivedSections.includes(k))
        .map(k => <div key={k} className="animate-slide-up">{sectionNodes[k] ?? null}</div>)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} contactAddress={contact?.address} contactMapsUrl={contact?.maps_url ?? undefined} contactOpeningHours={contact?.opening_hours} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "footer"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </MemoPreviewSectionWrapper>

      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: `linear-gradient(135deg, ${pink}, #b91c6b)`, color: "#fff" }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={header?.brand_name} isPremium={isPremium} floatingType={design_token?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
