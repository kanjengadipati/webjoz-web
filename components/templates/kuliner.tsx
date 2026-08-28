"use client";

import React from "react";
import { Utensils, ArrowRight } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  DynamicIcon, CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, ctaHref, InlineText, InlineImage,
} from "./shared";
import GallerySection from "../sections/gallery";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import HeroSection from "../sections/hero";
import BenefitsSectionInner from "../sections/benefits";
import TestimonialsSectionInner from "../sections/testimonials";
import FaqSectionInner from "../sections/faq";
import ContactSectionInner from "../sections/contact";
import MenuSectionInner from "../sections/menu";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateKuliner: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, onUpdateField, collapseSheetForInlineEdit, onEditingStateChange,
  isEditorMode = false, arrivedSections, isPremium = false, language
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, menu, testimonials, gallery } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const baseSectionOrderKuliner: string[] = dt?.layout?.section_order ?? ["hero", "about", "menu", "benefits", "testimonials", "faq", "cta", "contact"];
  const sectionOrder = (() => {
    const order = [...baseSectionOrderKuliner];
    if (menu && !order.includes("menu")) {
      const idx = order.indexOf("benefits") >= 0 ? order.indexOf("benefits") : order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length;
      order.splice(idx, 0, "menu");
    }
    if (testimonials && !order.includes("testimonials")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "testimonials");
    }
    if (gallery && !order.includes("gallery")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "gallery");
    }
    return order;
  })();

  const sectionNodes = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(hero) => (
      <HeroSection
        hero={{ ...hero, cta_url: ctaHref(contact.phone, hero.cta_url) }}
        design_token={dt}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={activeSection === "hero"}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(about) => (
          <section className="px-5 sm:px-6 py-[var(--dt-spacing)] max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="about">
            <div className="space-y-6" style={{ textAlign: about.textAlign || "left" }}>
              <span className="text-[var(--dt-primary)] font-bold tracking-wider uppercase text-xs block">Mengenal Kami</span>
              <InlineText
                section="about"
                fieldKey="title"
                value={about.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "about"}
                as="h2"
                className="text-3xl md:text-4xl font-bold text-[var(--dt-text)] block"
                style={headingVars}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
              <InlineText
                section="about"
                fieldKey="body"
                value={about.body}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "about"}
                multiline={true}
                as="p"
                className="text-[var(--dt-text-muted)] leading-relaxed whitespace-pre-line sm:text-justify block"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </div>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[var(--dt-primary-soft-strong)] to-[var(--dt-primary-soft)] rounded-[var(--dt-radius-lg)] -rotate-2 opacity-50 shadow-inner"></div>
              <div className="w-full h-80 md:h-[400px] bg-[var(--dt-primary-soft)] border-2 border-[var(--dt-border)] rounded-[var(--dt-radius-lg)] shadow-lg relative z-10 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <DynamicIcon name={about.icon} defaultIcon={Utensils} className="w-12 h-12 text-[var(--dt-primary)] mx-auto" />
                    <p className=" italic text-[var(--dt-text)] font-semibold text-lg">{header?.brand_name || "Bisnis Kami"}</p>
                    <p className="text-[var(--dt-text-muted)] text-sm max-w-xs">{about.title}</p>
                  </div>
                </div>
                {about.image_url && (
                  <>
                    <InlineImage
                      section="about"
                      fieldKey="image_url"
                      src={about.image_url}
                      alt="About"
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={activeSection === "about"}
                      className="w-full h-full absolute inset-0 z-10"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    />
                    <div className="absolute bottom-2 right-2 z-20">
                      <PhotoCredit credit={about.image_credit} />
                    </div>
                  </>
                )}
              </div>
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
        <MemoSectionContent content={cta} render={(cta) => (
          <section className="px-6 py-16 max-w-6xl mx-auto">
            <div className="bg-[var(--dt-surface)] border border-[var(--dt-border)] p-8 md:p-16 rounded-[var(--dt-radius-lg)] text-center space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--dt-primary-soft)] to-[var(--dt-accent-soft)] opacity-40"></div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <InlineText
                  section="cta"
                  fieldKey="headline"
                  value={cta.headline}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={activeSection === "cta"}
                  as="h2"
                  className="text-3xl md:text-4xl font-bold text-[var(--dt-text)]"
                  style={headingVars}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-[var(--dt-primary)] hover:bg-[var(--dt-primary-hover)] rounded-[var(--dt-radius)] font-bold shadow-md transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]"
                    style={{ color: "var(--dt-cta-text)" }}
                  >
                    <InlineText
                      section="cta"
                      fieldKey="button_text"
                      value={cta.button_text || "Hubungi Kami"}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={activeSection === "cta"}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
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
    gallery: gallery ? (
      <MemoPreviewSectionWrapper section="gallery" label="Galeri" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ gallery, dt }} render={(data) => {
          const { gallery: g, dt: d } = data;
          return <GallerySection gallery={g} design_token={d} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "gallery"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />;
        }} />
      </MemoPreviewSectionWrapper>
    ) : null,
  } as Record<string, React.ReactNode>;

  const waPhone = contact?.phone ?? "";

  return (
    <CartProvider waPhone={waPhone} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#4F46E5"}>
    <div
      className="selection:bg-[var(--dt-primary-soft-strong)] selection:text-[var(--dt-text)] overflow-x-hidden min-h-screen"
      style={{ ...cssVars, background: "var(--dt-bg)", color: "var(--dt-text)", fontFamily: "var(--dt-body-font)", containerType: "inline-size" }}
    >
      {(() => {
        const renderedSectionOrder = filterEmptySections(sectionOrder, content, isEditorMode)
          .filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key))
          .filter((key) => !arrivedSections || arrivedSections.includes(key));
        return (
          <>
            <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
              <HeaderSection header={header} design_token={dt} sectionOrder={renderedSectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} />
            </MemoPreviewSectionWrapper>

            {renderedSectionOrder.map((key) => <div key={key} className="animate-slide-up">{sectionNodes[key] ?? null}</div>)}
          </>
        );
      })()}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} contactAddress={contact?.address} contactMapsUrl={contact?.maps_url ?? undefined} contactOpeningHours={contact?.opening_hours} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "footer"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && (
        <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={seo} render={(seoData) => (
            <SeoEditorPreview seo={seoData} />
          )} />
        </MemoPreviewSectionWrapper>
      )}
      <CartFab colorStyle={{ background: "var(--dt-primary)", color: "var(--dt-cta-text)" }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={header?.brand_name} isPremium={isPremium} floatingType={design_token?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
