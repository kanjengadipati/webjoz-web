"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, ctaHref, InlineText,
} from "./shared";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import GallerySection from "../sections/gallery";
import HeroSection from "../sections/hero";
import BenefitsSectionInner from "../sections/benefits";
import TestimonialsSectionInner from "../sections/testimonials";
import FaqSectionInner from "../sections/faq";
import ContactSectionInner from "../sections/contact";
import MenuSectionInner from "../sections/menu";
import CatalogSectionInner from "../sections/catalog";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateElegant: React.FC<TemplateProps> = ({
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
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "testimonials", "cta", "faq", "contact"];
    const order = [...base];
    // catalog and menu are special-case sections (toko online / kuliner).
    // If they have content but weren't in section_order, inject them right
    // after hero so they lead the page — not buried after benefits.
    const afterHero = (s: string) => {
      const heroIdx = order.indexOf("hero");
      order.splice(heroIdx >= 0 ? heroIdx + 1 : 1, 0, s);
    };
    if (menu    && !order.includes("menu"))    afterHero("menu");
    if (catalog && !order.includes("catalog")) afterHero("catalog");
    if (testimonials && !order.includes("testimonials")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "testimonials");
    if (gallery     && !order.includes("gallery"))     order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "gallery");
    return order;
  })();

  const gold = dt?.palette?.primary ?? "#c9a84c";
  const goldLight = dt?.palette?.accent ?? "#f0d080";
  const darkBg = "#0a0a0a";
  const darkSurface = "#0f0f0f";
  const darkCard = "#141414";
  const textMuted = `color-mix(in srgb, var(--dt-text) 75%, var(--dt-bg))`;
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
          <section className="py-20 px-6 border-y" id="about" style={{ background: darkSurface, borderColor: `${gold}15` }}>
            <div className={`max-w-5xl mx-auto ${a.image_url ? "grid md:grid-cols-2 gap-12 items-center" : "max-w-3xl mx-auto"}`}>
              <div className="space-y-5" style={{ textAlign: a.textAlign || "left" }}>
                {a.eyebrow && <InlineText section="about" fieldKey="eyebrow" value={a.eyebrow} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} as="span" className="text-[10px] uppercase tracking-widest font-bold   block" style={{ color: gold }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
                <InlineText section="about" fieldKey="title" value={a.title} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} multiline as="h2" className="text-2xl md:text-3xl font-bold leading-snug" style={{ color: "#f5e6c0", fontFamily: "var(--dt-heading-font)", ...headingVars }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                <InlineText section="about" fieldKey="body" value={a.body} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} multiline as="p" className="text-sm leading-relaxed font-light  " style={{ color: "rgba(245,230,192,0.55)" }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: `${gold}20` }}>
                    {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].map((stat, i) => {
                      const keyNum = i + 1;
                      return stat ? (
                      <div key={i}>
                        <p className="text-xl font-bold" style={{ color: gold, fontFamily: "var(--dt-heading-font)" }}><InlineText section="about" fieldKey={`highlight_stat_${keyNum}.value`} value={stat.value ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
                        <p className="text-[10px]   mt-1" style={{ color: "rgba(245,230,192,0.4)" }}><InlineText section="about" fieldKey={`highlight_stat_${keyNum}.label`} value={stat.label ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /></p>
                      </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              {a.image_url && (
                <div className="relative">
                  <div className="absolute inset-0 rounded blur-xl opacity-20" style={{ background: gold }} />
                  <div className="relative rounded border p-8 text-center space-y-3" style={{ background: darkCard, borderColor: `${gold}25` }}>
                    <div className="relative">
                      <img src={a.image_url} alt={a.title} className="w-full h-52 object-cover rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      <div className="absolute bottom-1 right-2 z-10">
                        <PhotoCredit credit={a.image_credit} />
                      </div>
                    </div>
                    <p className="text-sm font-bold  " style={{ color: goldLight }}>{header?.brand_name}</p>
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
          <section className="py-20 px-6 border-y" style={{ background: darkSurface, borderColor: `${gold}15` }}>
            <div className="max-w-2xl mx-auto text-center space-y-5">
              {c.eyebrow && <InlineText section="cta" fieldKey="eyebrow" value={c.eyebrow} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} as="span" className="text-[10px] uppercase tracking-widest   block" style={{ color: gold }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
              <InlineText section="cta" fieldKey="headline" value={c.headline} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} multiline as="h2" className="text-2xl md:text-3xl font-bold" style={{ color: "#f5e6c0", fontFamily: "var(--dt-heading-font)", ...headingVars }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
              {c.subheadline && <InlineText section="cta" fieldKey="subheadline" value={c.subheadline} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} multiline as="p" className="text-sm font-light  " style={{ color: "rgba(245,230,192,0.55)" }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:brightness-110" style={{ background: gold, color: ctaText }}>
                <InlineText section="cta" fieldKey="button_text" value={c.button_text} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /> <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <InlineText section="cta" fieldKey="trust_signal" value={c.trust_signal} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} multiline as="p" className="text-[10px]  " style={{ color: textMuted }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
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
    <div style={{ ...cssVars, background: darkBg, color: "#f5e6c0", fontFamily: "var(--dt-body-font)", minHeight: "100vh", overflowX: "hidden", containerType: "inline-size" }}>
      <div className="py-2 text-center text-[10px] uppercase tracking-widest  " style={{ background: "#0d0c08", borderBottom: `1px solid ${gold}20`, color: gold }}>
        {header?.tagline || "Layanan Eksklusif · Kualitas Premium · Kepuasan Terjamin"}
      </div>

      {(() => {
        const renderedSectionOrder = filterEmptySections(sectionOrder, content, isEditorMode)
          .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
          .filter(k => !arrivedSections || arrivedSections.includes(k));
        return (
          <>
            <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
              <HeaderSection header={header} design_token={dt} sectionOrder={renderedSectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "header"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            </MemoPreviewSectionWrapper>

            {renderedSectionOrder.map((k) => {
              const arrivedIndex = arrivedSections?.indexOf(k) ?? -1;
              const isStreaming = arrivedSections !== undefined && arrivedIndex !== -1;
              return (
                <div
                  key={k}
                  id={`section-${k}`}
                  className={isStreaming ? "animate-slide-up" : ""}
                  style={isStreaming ? {
                    animationDelay: `${arrivedIndex * 60}ms`,
                    animationFillMode: "both",
                  } : undefined}
                >
                  {sectionNodes[k] ?? null}
                </div>
              );
            })}
          </>
        );
      })()}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} contactAddress={contact?.address} contactMapsUrl={contact?.maps_url ?? undefined} contactOpeningHours={contact?.opening_hours} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "footer"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: gold, color: ctaText }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={header?.brand_name} isPremium={isPremium} floatingType={design_token?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
