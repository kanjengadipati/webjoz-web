"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, ctaHref,
} from "./shared";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import GallerySection from "../sections/gallery";
import HeroNaturalOrganic from "../sections/hero/natural-organic";
import BenefitsSectionInner from "../sections/benefits";
import TestimonialsSectionInner from "../sections/testimonials";
import FaqSectionInner from "../sections/faq";
import ContactSectionInner from "../sections/contact";
import MenuSectionInner from "../sections/menu";
import CatalogSectionInner from "../sections/catalog";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateNatural: React.FC<TemplateProps> = ({
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
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "testimonials", "faq", "cta", "contact"];
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

  const cream = dt?.palette?.background ?? "#fcf8f2";
  const sage = dt?.palette?.primary ?? "#3d5a45";
  const brown = dt?.palette?.text ?? "#2e251b";
  const brownMuted = `color-mix(in srgb, ${brown} 60%, transparent)`;
  const border = "var(--dt-border)";
  const ctaText = "var(--dt-cta-text)";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <HeroNaturalOrganic
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
          <section className="py-[var(--dt-spacing)] px-6 border-y" id="about" style={{ background: "var(--dt-primary-soft)", borderColor: border }}>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className={a.image_url ? "grid md:grid-cols-2 gap-8 items-center" : "max-w-3xl mx-auto"}>
                <div className="space-y-4" style={{ textAlign: a.textAlign || "left" }}>
                  {a.eyebrow && <span className="text-[10px] uppercase tracking-widest font-bold   block" style={{ color: sage }}>{a.eyebrow}</span>}
                  <h2 className="text-2xl md:text-3xl font-medium leading-snug" style={{ color: brown, fontFamily: "var(--dt-heading-font)", ...headingVars }}>{a.title}</h2>
                  <p className="text-sm leading-relaxed italic font-light" style={{ color: brownMuted }}>{a.body}</p>
                </div>
                {a.image_url && (
                  <div className="relative">
                    <img src={a.image_url} alt={a.title} className="w-full h-52 object-cover rounded-[var(--dt-radius-lg)] border" style={{ borderColor: border }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="absolute bottom-1 right-2 z-10"><PhotoCredit credit={a.image_credit} /></div>
                  </div>
                )}
              </div>
              {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: border }}>
                  {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                    <div key={i} className="text-center space-y-1">
                      <p className="text-2xl font-bold" style={{ color: sage, fontFamily: "var(--dt-heading-font)" }}>{stat!.value}</p>
                      <p className="text-[10px]  " style={{ color: brownMuted }}>{stat!.label}</p>
                    </div>
                  ))}
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
          <section className="py-[var(--dt-spacing)] px-6 border-y" style={{ background: "var(--dt-primary-soft)", borderColor: border }}>
            <div className="max-w-2xl mx-auto text-center space-y-5">
              {c.eyebrow && <span className="text-[10px] uppercase tracking-widest   block" style={{ color: sage }}>{c.eyebrow}</span>}
              <h2 className="text-2xl md:text-3xl font-medium" style={{ color: brown, fontFamily: "var(--dt-heading-font)", ...headingVars }}>{c.headline}</h2>
              {c.subheadline && <p className="text-sm italic font-light" style={{ color: brownMuted }}>{c.subheadline}</p>}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-3 rounded-[var(--dt-radius)] text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90" style={{ background: sage, color: ctaText }}>
                {c.button_text} <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <p className="text-[10px]  " style={{ color: brownMuted }}>{c.trust_signal}</p>}
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
    <div style={{ ...cssVars, background: cream, color: brown, fontFamily: "var(--dt-body-font)", minHeight: "100vh", overflowX: "hidden", containerType: "inline-size" }}>
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
      <CartFab colorStyle={{ background: sage, color: ctaText }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={header?.brand_name} isPremium={isPremium} floatingType={design_token?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
