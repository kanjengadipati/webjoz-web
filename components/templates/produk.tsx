"use client";

import React from "react";
import { Globe, ArrowRight } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  DynamicIcon, CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, ctaHref, InlineText, InlineImage,
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
import { BlogPostsSection } from "./blog-section";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateProduk: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, onUpdateField, collapseSheetForInlineEdit, onEditingStateChange,
  isEditorMode = false, arrivedSections, isPremium = false, language
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, menu, catalog, testimonials, gallery, blog, blog_layout } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const sectionOrder = (() => {
    const base: string[] = dt?.layout?.section_order ?? ["hero", "catalog", "about", "benefits", "testimonials", "faq", "cta", "contact"];
    const order = [...base];
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
            <div className="space-y-6" style={{ textAlign: about.textAlign || "left" }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--dt-primary)] to-[var(--dt-accent)] font-extrabold tracking-wider uppercase text-xs block">Misi Kami</span>
              <InlineText
                section="about"
                fieldKey="title"
                value={about.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "about"}
                as="h2"
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
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
                className="text-slate-300 leading-relaxed sm:text-justify whitespace-pre-line"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--dt-primary)] to-[var(--dt-accent)] rounded-[var(--dt-radius-lg)] opacity-10 filter blur-xl"></div>
              <div className="w-full h-80 md:h-[400px] bg-slate-900/50 border border-slate-800 rounded-[var(--dt-radius-lg)] shadow-xl relative z-10 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-[var(--dt-radius)] flex items-center justify-center mx-auto border" style={{ background: "color-mix(in srgb, var(--dt-primary) 15%, #0f172a)", color: "var(--dt-primary)", borderColor: "color-mix(in srgb, var(--dt-primary) 40%, transparent)", boxShadow: "0 0 15px color-mix(in srgb, var(--dt-primary) 15%, transparent)" }}>
                      <DynamicIcon name={about.icon} defaultIcon={Globe} className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-white text-xl">Inovasi Global</p>
                    <p className="text-slate-300 text-sm max-w-xs leading-relaxed">
                      Kami membangun produk berkualitas tinggi dengan riset mendalam demi memberikan pengalaman terbaik.
                    </p>
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
            <div className="relative bg-slate-900 border border-slate-800 p-8 md:p-16 rounded-[var(--dt-radius-lg)] text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[200px] rounded-full filter blur-[50px] md:blur-[100px]" style={{ background: "color-mix(in srgb, var(--dt-primary) 5%, transparent)" }}></div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <InlineText
                  section="cta"
                  fieldKey="headline"
                  value={cta.headline}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={activeSection === "cta"}
                  as="h2"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-white"
                  style={headingVars}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-gradient-to-r from-[var(--dt-primary)] to-[var(--dt-accent)] hover:brightness-110 rounded-full font-bold shadow-lg transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-slate-900"
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
    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(c) => (
          <CatalogSectionInner catalog={c} design_token={dt} />
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
    blog: (blog?.posts?.length ?? 0) > 0 ? (
      <BlogPostsSection posts={blog!.posts!} layout={blog_layout} />
    ) : null,
  } as Record<string, React.ReactNode>;

  const waPhone = contact?.phone ?? "";

  return (
    <CartProvider waPhone={waPhone} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#0e7490"} primaryFg="#ffffff">
    <div className="bg-slate-950 text-slate-100 overflow-x-hidden min-h-screen" style={{ ...cssVars, fontFamily: "var(--dt-body-font)", containerType: "inline-size" }}>
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <HeaderSection header={header} design_token={dt} sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} />
      </MemoPreviewSectionWrapper>

      {filterEmptySections(sectionOrder, content, isEditorMode)
        .filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key))
        .filter((key) => !arrivedSections || arrivedSections.includes(key))
        .map((key) => <div key={key} className="animate-slide-up">{sectionNodes[key] ?? null}</div>)}

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
