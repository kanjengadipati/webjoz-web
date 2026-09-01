"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, ctaHref, InlineText,
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
      <HeroSection
        hero={{ ...h, cta_url: ctaHref(contact.phone, h.cta_url) }}
        design_token={dt}
        isEditorMode={isEditorMode}
        isSelected={activeSection === "hero"}
        onUpdateField={onUpdateField}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
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
                {a.eyebrow && <InlineText section="about" fieldKey="eyebrow" value={a.eyebrow} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} as="span" className="text-[10px] font-black uppercase tracking-widest block" style={{ color: red }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
                <InlineText section="about" fieldKey="title" value={a.title} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} multiline as="h2" className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight" style={headingVars} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                <InlineText section="about" fieldKey="body" value={a.body} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} multiline as="p" className="text-sm leading-relaxed font-light" style={{ color: textMuted }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                  <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: `1px solid ${border}` }}>
                    {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].map((stat, i) => {
                      const keyNum = i + 1;
                      return stat ? (
                      <div key={i} className="space-y-1">
                        <p className="text-2xl font-black" style={{ color: red }}><InlineText section="about" fieldKey={`highlight_stat_${keyNum}.value`} value={stat.value ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
                        <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: textMuted }}><InlineText section="about" fieldKey={`highlight_stat_${keyNum}.label`} value={stat.label ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
                      </div>
                      ) : null;
                    })}
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
          <BenefitsSectionInner benefits={b} design_token={dt} language={language} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "benefits"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
        )} />
      </MemoPreviewSectionWrapper>
    ),

    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSectionInner testimonials={testimonials} design_token={dt} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "testimonials"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </MemoPreviewSectionWrapper>
    ) : null,

    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <MenuSectionInner menu={m} design_token={dt} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "menu"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,

    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(c) => (
          <CatalogSectionInner catalog={c} design_token={dt} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "catalog"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
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
          <section className="py-20 px-6 text-center relative overflow-hidden" style={{ background: red }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              {c.eyebrow && <InlineText section="cta" fieldKey="eyebrow" value={c.eyebrow} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} as="span" className="text-[10px] font-black uppercase tracking-widest block" style={{ color: ctaText, opacity: 0.85 }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
              <InlineText section="cta" fieldKey="headline" value={c.headline} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} multiline as="h2" className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight" style={{ color: ctaText, ...headingVars }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
              {c.subheadline && <InlineText section="cta" fieldKey="subheadline" value={c.subheadline} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} multiline as="p" className="text-sm font-light" style={{ color: ctaText, opacity: 0.85 }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-4 font-black text-xs uppercase tracking-widest transition-all hover:opacity-90" style={{ background: "#fff", color: red }}>
                <InlineText section="cta" fieldKey="button_text" value={c.button_text} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /> <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <InlineText section="cta" fieldKey="trust_signal" value={c.trust_signal} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} multiline as="p" className="text-[11px] font-bold" style={{ color: ctaText, opacity: 0.7 }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
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
    <div style={{ ...cssVars, background: bg, color: "#f5f5f5", fontFamily: "var(--dt-body-font)", minHeight: "100vh", overflowX: "hidden", containerType: "inline-size" }}>
      {(() => {
        const renderedSectionOrder = filterEmptySections(sectionOrder, content, isEditorMode)
          .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
          .filter(k => !arrivedSections || arrivedSections.includes(k));
        return (
          <>
            {/* Header */}
            <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
              <HeaderSection header={header} design_token={dt} sectionOrder={renderedSectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "header"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            </MemoPreviewSectionWrapper>

            {/* Sections */}
            {renderedSectionOrder.map((k) => {
              const arrivedIndex = arrivedSections?.indexOf(k) ?? -1;
              const isStreaming = arrivedSections !== undefined && arrivedIndex !== -1;
              return (
                <div
                  key={k}
                  id={`section-${k}`}
                  className={isStreaming ? "animate-slide-up" : ""}
                  style={isStreaming ? { animationDelay: `${arrivedIndex * 60}ms`, animationFillMode: "both" } : undefined}
                >
                  {sectionNodes[k] ?? null}
                </div>
              );
            })}
          </>
        );
      })()}

      {/* Footer */}
      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} contactAddress={contact?.address} contactMapsUrl={contact?.maps_url ?? undefined} contactOpeningHours={contact?.opening_hours} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "footer"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </MemoPreviewSectionWrapper>

      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: red, color: ctaText }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={header?.brand_name} isPremium={isPremium} floatingType={design_token?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
