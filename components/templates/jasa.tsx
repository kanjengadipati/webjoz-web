"use client";

import React from "react";
import { Shield, ArrowRight } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  DynamicIcon, LeadForm, TestimonialsSection, MenuCatalogCard,
  CartProvider, CartFab,
  WAFloatingButton, BackToTop, ctaHref, FaqAccordion, SeoEditorPreview,
  ContactSection, BenefitsSection, InlineText, InlineImage,
} from "./shared";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import GallerySection from "../sections/gallery";
import HeroSplitEditorial from "../sections/hero/split-editorial";
import { BlogPostsSection } from "./blog-section";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateJasa: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, onUpdateField, collapseSheetForInlineEdit, onEditingStateChange,
  isEditorMode = false, arrivedSections, isPremium = false, language
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, catalog, gallery, blog, blog_layout } = content;
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
          <HeroSplitEditorial
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
        <MemoSectionContent content={benefits} render={(benefits) => (
          <BenefitsSection
            benefits={benefits}
            wrapperClass="px-6 py-[var(--dt-spacing)]"
            wrapperStyle={{ background: "var(--dt-primary-dark)", color: "var(--dt-on-dark-muted)" }}
            eyebrowClass="font-extrabold tracking-wider uppercase text-xs"
            eyebrowStyle={{ color: "var(--dt-on-dark-accent)" }}
            titleClass="text-3xl md:text-4xl font-bold tracking-tight"
            titleStyle={{ color: "var(--dt-on-dark)" }}
            cardClass="border hover:border-[var(--dt-on-dark-accent)] p-8 rounded-[var(--dt-radius-lg)] transition-all duration-300 group"
            cardStyle={{ background: "var(--dt-primary-dark-soft)", borderColor: "var(--dt-primary-dark-border)" }}
            iconContainerClass="w-10 h-10 sm:w-12 sm:h-12 rounded-[var(--dt-radius)] flex items-center justify-center mb-4 sm:mb-6 group-hover:brightness-125 transition-all"
            iconContainerStyle={{ background: "var(--dt-primary-dark-soft)", color: "var(--dt-on-dark-accent)" }}
            iconClass="w-5 h-5 sm:w-6 sm:h-6"
            statClass="text-3xl font-black tracking-tight"
            statStyle={{ color: "var(--dt-on-dark)" }}
            statLabelClass="text-xs font-semibold uppercase tracking-wider"
            statLabelStyle={{ color: "var(--dt-on-dark-accent)" }}
            cardTitleClass="text-xl font-bold mb-3"
            cardTitleStyle={{ color: "var(--dt-on-dark)" }}
            cardDescClass="text-sm leading-relaxed"
            cardDescStyle={{ color: "var(--dt-on-dark-muted)" }}
            accentColor="var(--dt-on-dark-accent)"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "benefits"}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(catalogData) => (
          <section className="px-6 py-[var(--dt-spacing)] bg-[var(--dt-surface)] border-y border-[var(--dt-border)]" id="catalog">
            <div className="max-w-6xl mx-auto space-y-14">
              <div className="text-center space-y-3">
                {catalogData.eyebrow && <span className="text-[var(--dt-primary)] font-extrabold tracking-wider uppercase text-xs block">{catalogData.eyebrow}</span>}
                <InlineText
                  section="catalog"
                  fieldKey="title"
                  value={catalogData.title}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={activeSection === "catalog"}
                  as="h2"
                  className="text-3xl md:text-4xl font-extrabold text-[var(--dt-text)] tracking-tight"
                  style={headingVars}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
                {catalogData.subtitle && <p className="text-[var(--dt-text-muted)] max-w-2xl mx-auto">{catalogData.subtitle}</p>}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="w-6 h-0.5 rounded-full" style={{ background: "var(--dt-primary)" }} />
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--dt-primary)", opacity: 0.6 }} />
                  <span className="w-6 h-0.5 rounded-full" style={{ background: "var(--dt-primary)" }} />
                </div>
              </div>
              {catalogData.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: "var(--dt-border)" }} />
                    <span className="text-xs font-extrabold uppercase tracking-wider px-4 py-1 rounded-full" style={{ color: "var(--dt-primary)", background: "var(--dt-primary-soft-strong)", border: "1px solid var(--dt-border)" }}>{cat.name}</span>
                    <span className="flex-1 h-px" style={{ background: "var(--dt-border)" }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.items?.map((item, ii) => (
                      <MenuCatalogCard
                        key={ii}
                        itemId={`catalog-${ci}-${ii}`}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        category={cat.name}
                        image_url={item.image_url}
                        image_credit={item.image_credit}
                        badge={item.badge}
                        icon={SparkleIcon}
                        className="group bg-[var(--dt-primary-soft)] border border-[var(--dt-border)] rounded-[var(--dt-radius-lg)] p-5 space-y-4 shadow-sm hover:border-[var(--dt-primary)] hover:shadow-md transition-all"
                        imageClassName="w-full h-40 object-cover rounded-[var(--dt-radius)] border border-[var(--dt-border)]"
                        imageStyle={{ borderRadius: "var(--dt-radius)" }}
                        placeholderClassName="w-full h-40 rounded-[var(--dt-radius)] border border-[var(--dt-border)] bg-[var(--dt-primary-soft-strong)] flex items-center justify-center"
                        placeholderIconClassName="w-10 h-10 text-[var(--dt-primary)]"
                        contentClassName="space-y-3"
                        headerClassName="flex items-start justify-between gap-3"
                        titleClassName="font-extrabold text-[var(--dt-text)] text-base leading-snug"
                        descriptionClassName="text-sm text-[var(--dt-text-muted)] leading-relaxed"
                        priceClassName="font-bold text-[var(--dt-primary)] text-sm whitespace-nowrap"
                        badgeClassName="inline-block mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--dt-primary)] bg-[var(--dt-primary-soft-strong)] px-2 py-0.5 rounded-full"
                        buttonClassName="inline-flex items-center justify-center gap-2 rounded-[var(--dt-radius)] bg-[var(--dt-primary)] px-4 py-2 text-xs font-bold text-[var(--dt-cta-text)] hover:bg-[var(--dt-primary-hover)] transition-all"
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
        <MemoSectionContent content={faq} render={(faq) => (
          <section className="px-6 py-[var(--dt-spacing)] max-w-4xl mx-auto space-y-16" id="faq">
            <div className="text-center space-y-2">
              <span className="text-[var(--dt-primary)] font-extrabold tracking-wider uppercase text-xs block">{language === 'en' ? 'Questions' : 'Solusi Pertanyaan'}</span>
              <InlineText
                section="faq"
                fieldKey="title"
                value={faq.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "faq"}
                as="h2"
                className="text-3xl font-extrabold text-[var(--dt-text)] tracking-tight"
                style={headingVars}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </div>
            <div className="space-y-4">
              {faq.items?.map((item, idx) => (
                <FaqAccordion
                  key={idx}
                  item={item}
                  variant="numbered"
                  index={idx}
                  onUpdateItem={(index, field, value) => {
                    const nextItems = [...(faq.items || [])];
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
          </section>
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
            wrapperClass="px-6 py-[var(--dt-spacing)] border-t border-[var(--dt-border)]"
            wrapperStyle={{ background: "var(--dt-primary-soft)" }}
            titleClass="text-3xl font-extrabold text-[var(--dt-text)] tracking-tight"
            accentColor={dt?.palette?.primary ?? "#4f46e5"}
            textClass="text-[var(--dt-text-muted)]"
            leadCardClass="bg-[var(--dt-surface)] p-8 rounded-[var(--dt-radius-lg)] border border-[var(--dt-border)] shadow-sm"
            leadTitleClass="text-lg font-bold text-[var(--dt-text)]"
            leadTitleText={language === 'en' ? 'Send Your Inquiry' : 'Kirim Pertanyaan Anda'}
            leadFormBtnClass="bg-[var(--dt-primary)] hover:bg-[var(--dt-primary-hover)] text-[var(--dt-cta-text)] rounded-[var(--dt-radius)] shadow-sm"
            leadFormInputClass="w-full px-4 py-2.5 bg-[var(--dt-primary-soft)] border border-[var(--dt-border)] focus:border-[var(--dt-primary)] focus:ring-1 focus:ring-[var(--dt-primary)] rounded-[var(--dt-radius)] outline-none text-sm transition-all"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "contact"}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            formPosition={data.contact.form_position ?? "right"}
            language={language}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={testimonials}
          wrapperClass="bg-[var(--dt-primary-soft)] border-y border-[var(--dt-border)] py-[var(--dt-spacing)] px-6"
          titleClass="text-[var(--dt-text)] font-extrabold tracking-tight"
          eyebrowClass="text-[var(--dt-primary)]"
          cardClass="bg-[var(--dt-surface)] border border-[var(--dt-border)]"
          quoteClass="text-[var(--dt-text-muted)]"
          nameClass="text-[var(--dt-text)]"
          roleClass="text-[var(--dt-text-muted)]"
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={activeSection === "testimonials"}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
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
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <HeaderSection header={header} design_token={dt} sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} />
      </MemoPreviewSectionWrapper>

      {filterEmptySections(sectionOrder, content, isEditorMode)
        .filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key))
        .filter((key) => !arrivedSections || arrivedSections.includes(key))
        .map((key) => <div key={key} className="animate-slide-up">{sectionNodes[key] ?? null}</div>)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} hasBlog={!!(blog?.posts?.length)} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "footer"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
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
