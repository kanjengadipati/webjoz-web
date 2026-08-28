"use client";

import React from "react";
import { Shield, ArrowRight } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  DynamicIcon,
  CartProvider, CartFab,
  WAFloatingButton, BackToTop, ctaHref, SeoEditorPreview,
  InlineText, InlineImage,
} from "./shared";
import BenefitsSectionInner from "../sections/benefits";
import TestimonialsSectionInner from "../sections/testimonials";
import FaqSectionInner from "../sections/faq";
import ContactSectionInner from "../sections/contact";
import MenuSectionInner from "../sections/menu";
import CatalogSectionInner from "../sections/catalog";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import GallerySection from "../sections/gallery";
import HeroSection from "../sections/hero";
import { BlogPostsSection } from "./blog-section";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateJasa: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, onUpdateField, collapseSheetForInlineEdit, onEditingStateChange,
  isEditorMode = false, arrivedSections, isPremium = false, language
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, menu, catalog, gallery, blog, blog_layout } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const sectionOrder = (() => {
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "testimonials", "faq", "cta", "contact"];
    const order = [...base];
    // catalog and menu are special-case sections (toko online / kuliner).
    // If they have content but weren't in section_order, inject them right
    // after hero so they lead the page — not buried after benefits.
    const afterHero = (s: string) => {
      const heroIdx = order.indexOf("hero");
      order.splice(heroIdx >= 0 ? heroIdx + 1 : 1, 0, s);
    };
    if (menu && !order.includes("menu")) afterHero("menu");
    if (catalog && !order.includes("catalog")) afterHero("catalog");
    if (testimonials && !order.includes("testimonials")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "testimonials");
    }
    if (gallery && !order.includes("gallery")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "gallery");
    }
    if (blog && blog.posts?.length && !order.includes("blog")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "blog");
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
          <section className="px-6 py-[var(--dt-spacing)] max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="about">
            <div className="relative">
              <div className="absolute -inset-4 bg-[var(--dt-primary-soft-strong)] rounded-[var(--dt-radius-lg)] opacity-40 shadow-inner"></div>
              <div className="w-full h-80 md:h-[400px] bg-[var(--dt-surface)] border border-[var(--dt-border)] rounded-[var(--dt-radius-lg)] shadow-md relative z-10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-[var(--dt-primary-soft)] rounded-full flex items-center justify-center mx-auto text-[var(--dt-primary)] shadow-sm border border-[var(--dt-border)]">
                      <DynamicIcon name={about.icon} defaultIcon={Shield} className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-[var(--dt-text)] text-xl">{header?.brand_name || "Bisnis Kami"}</p>
                    <p className="text-[var(--dt-text-muted)] text-sm max-w-xs leading-relaxed">{about.title}</p>
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
                      className="w-full h-full object-cover absolute inset-0 z-10"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    />
                    <div className="absolute bottom-2 right-2 z-20">
                      <PhotoCredit credit={about.image_credit} />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-6" style={{ textAlign: about.textAlign || "left" }}>
              <span className="text-[var(--dt-primary)] font-extrabold tracking-wider uppercase text-xs block">Profil</span>
              <InlineText
                section="about"
                fieldKey="title"
                value={about.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "about"}
                as="h2"
                className="text-3xl md:text-4xl font-extrabold text-[var(--dt-text)] tracking-tight"
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
                className="text-[var(--dt-text-muted)] leading-relaxed text-justify whitespace-pre-line"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
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
        <MemoSectionContent content={cta} render={(cta) => (
          <section className="px-6 py-16 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-[var(--dt-primary)] to-[var(--dt-primary-hover)] text-[var(--dt-cta-text)] p-8 md:p-16 rounded-[var(--dt-radius-lg)] text-center space-y-6 relative overflow-hidden shadow-lg">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <InlineText
                  section="cta"
                  fieldKey="headline"
                  value={cta.headline}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={activeSection === "cta"}
                  as="h2"
                  className="text-3xl md:text-4xl font-bold text-[var(--dt-cta-text)] tracking-tight"
                  style={headingVars}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-[var(--dt-primary)] hover:bg-[var(--dt-primary-hover)] rounded-[var(--dt-radius)] font-bold shadow-md transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]" style={{ color: "var(--dt-cta-text)" }}
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
    gallery: gallery ? (
      <MemoPreviewSectionWrapper section="gallery" label="Galeri" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ gallery, dt }} render={(data) => {
          const { gallery: g, dt: d } = data;
          return <GallerySection gallery={g} design_token={d} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "gallery"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />;
        }} />
      </MemoPreviewSectionWrapper>
    ) : null,
    blog: (blog?.posts?.length ?? 0) > 0 ? (
      <BlogPostsSection posts={blog!.posts!} layout={blog_layout} />
    ) : null,
  } as Record<string, React.ReactNode>;

  return (
    <CartProvider waPhone={contact?.phone ?? ""} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#4F46E5"} primaryFg={dt?.palette?.primary ? undefined : "#ffffff"}>
    <div
      className="selection:bg-[var(--dt-primary-soft-strong)] selection:text-[var(--dt-text)] overflow-x-hidden min-h-screen"
      style={{ ...cssVars, background: "var(--dt-bg)", color: "var(--dt-text)", fontFamily: "var(--dt-body-font)", containerType: "inline-size" }}
    >
      {/* Header */}
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
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} hasBlog={!!(blog?.posts?.length)} contactAddress={contact?.address} contactMapsUrl={contact?.maps_url ?? undefined} contactOpeningHours={contact?.opening_hours} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "footer"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
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
