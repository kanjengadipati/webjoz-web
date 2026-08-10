"use client";

import React from "react";
import { Utensils, Clock, ArrowRight, MapPin, Phone, Mail, Star, Send } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  DynamicIcon, LeadForm, TestimonialsSection,
  MenuCatalogCard, CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, ctaHref,
  ContactSection, BenefitsSection, InlineText, InlineImage,
} from "./shared";
import GallerySection from "../sections/gallery";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
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
          <section className="relative min-h-[85vh] flex items-center justify-center text-center px-5 sm:px-6 py-[var(--dt-spacing)] bg-gradient-to-b from-[var(--dt-primary-soft)] to-[var(--dt-bg)] overflow-hidden" style={hero.background_color ? { background: hero.background_color } : undefined}>
            {hero.image_url && (
              <InlineImage
                section="hero"
                fieldKey="image_url"
                src={hero.image_url}
                alt="Hero"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "hero"}
                className="absolute inset-0 w-full h-full opacity-50"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              />
            )}
            <div className="max-w-4xl relative z-10 space-y-6">
              <InlineText
                section="hero"
                fieldKey="headline"
                value={hero.headline}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "hero"}
                as="h1"
                className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[var(--dt-text)] leading-tight block"
                style={headingVars}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
              <InlineText
                section="hero"
                fieldKey="subheadline"
                value={hero.subheadline}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "hero"}
                as="p"
                className="text-lg md:text-xl text-[var(--dt-text-muted)] max-w-2xl mx-auto leading-relaxed block"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
              {hero.opening_hours && (
                <p className="inline-flex items-center gap-2 rounded-full border border-[var(--dt-border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--dt-text)] shadow-sm">
                  <Clock className="w-4 h-4 text-[var(--dt-primary)]" />
                  {hero.opening_hours}
                </p>
              )}
              <div className="pt-4">
                <a
                  href={ctaHref(contact.phone, hero.cta_url)}
                  className="min-h-11 px-8 py-4 bg-[var(--dt-primary)] hover:bg-[var(--dt-primary-hover)] rounded-[var(--dt-radius)] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]"
                  style={{ color: "var(--dt-cta-text)" }}
                >
                  <InlineText
                    section="hero"
                    fieldKey="cta_text"
                    value={hero.cta_text}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={activeSection === "hero"}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                  <ArrowRight className="w-5 h-5 flex-shrink-0" />
                </a>
              </div>
            </div>
            <PhotoCredit credit={hero.image_credit} className="absolute bottom-2 right-2 text-[10px] text-white/50 z-10" />
          </section>
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
        <MemoSectionContent content={benefits} render={(benefits) => (
          <BenefitsSection
            benefits={benefits}
            wrapperClass="bg-[var(--dt-primary-soft)] px-5 sm:px-6 py-[var(--dt-spacing)] border-y border-[var(--dt-border)]"
            eyebrowClass="text-[var(--dt-primary)] font-bold tracking-wider uppercase text-xs"
            titleClass="text-3xl md:text-4xl font-bold text-[var(--dt-text)]"
            cardClass="bg-[var(--dt-surface)] border border-[var(--dt-border)] hover:border-[var(--dt-primary)] p-8 rounded-[var(--dt-radius-lg)] shadow-sm hover:shadow-md transition-all duration-300 group"
            iconContainerClass="w-12 h-12 bg-[var(--dt-primary-soft-strong)] text-[var(--dt-primary)] rounded-[var(--dt-radius)] flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform"
            iconClass="w-6 h-6"
            cardTitleClass="text-xl font-bold text-[var(--dt-text)] mb-3"
            cardDescClass="text-[var(--dt-text-muted)] text-sm leading-relaxed"
            accentColor="var(--dt-primary)"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "benefits"}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    faq: (
      <MemoPreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={faq} render={(faq) => (
          <section className="px-6 py-[var(--dt-spacing)] max-w-4xl mx-auto space-y-12" id="faq">
            <div className="text-center space-y-2">
              <span className="text-[var(--dt-primary)] font-bold tracking-wider uppercase text-xs">Pertanyaan</span>
              <InlineText
                section="faq"
                fieldKey="title"
                value={faq.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "faq"}
                as="h2"
                className="text-3xl font-bold text-[var(--dt-text)]"
                style={headingVars}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </div>
            <div className="space-y-4">
              {faq.items?.map((item, idx) => (
                <FaqAccordion key={idx} item={item} />
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
            titleClass="text-3xl font-bold text-[var(--dt-text)]"
            accentColor={dt?.palette?.primary ?? "#b45309"}
            textClass="text-[var(--dt-text-muted)]"
            leadCardClass="bg-[var(--dt-surface)] p-8 rounded-[var(--dt-radius-lg)] border border-[var(--dt-border)] shadow-sm"
            leadTitleClass="text-lg font-bold text-[var(--dt-text)]"
            leadTitleText={language === 'en' ? 'Contact Us / Reservation' : 'Hubungi Kami / Reservasi'}
            leadFormBtnClass="bg-[var(--dt-primary)] hover:bg-[var(--dt-primary-hover)] text-[var(--dt-cta-text)] rounded-[var(--dt-radius)] shadow-sm hover:shadow"
            leadFormInputClass="w-full px-4 py-2.5 bg-[var(--dt-primary-soft)] border border-[var(--dt-border)] focus:border-[var(--dt-primary)] focus:ring-1 focus:ring-[var(--dt-primary)] rounded-[var(--dt-radius)] outline-none text-sm transition-all"
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
        <TestimonialsSection
          testimonials={testimonials}
          wrapperClass="bg-[var(--dt-primary-soft)] border-y border-[var(--dt-border)] py-[var(--dt-spacing)] px-5 sm:px-6"
          titleClass="text-[var(--dt-text)]"
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
    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(menuData) => (
          <section className="relative px-5 sm:px-6 py-[var(--dt-spacing)] bg-gradient-to-b from-[var(--dt-surface)] via-[var(--dt-surface)] to-[var(--dt-primary-soft)] border-y border-[var(--dt-border)] overflow-hidden" id="menu">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[var(--dt-primary-soft)] blur-3xl pointer-events-none" />
            <div className="max-w-6xl mx-auto space-y-10 relative">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--dt-border)] bg-[var(--dt-primary-soft)] px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-[var(--dt-primary)]">Pilihan Menu</span>
                <InlineText
                  section="menu"
                  fieldKey="title"
                  value={menuData.title}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={activeSection === "menu"}
                  as="h2"
                  className="text-3xl md:text-5xl font-bold text-[var(--dt-text)] max-w-3xl mx-auto leading-tight"
                  style={headingVars}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>
              {menuData.categories?.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-[var(--dt-border)]" />
                    <h3 className="px-4 py-2 rounded-full bg-[var(--dt-primary-soft)] border border-[var(--dt-border)] text-[var(--dt-text)] text-sm font-bold  whitespace-nowrap">{cat.name}</h3>
                    <span className="h-px flex-1 bg-[var(--dt-border)]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.items?.map((item, itemIdx) => {
                      const itemId = `${cat.name}__${item.name}__${catIdx}_${itemIdx}`;
                      return (
                        <MenuCatalogCard
                          key={itemIdx}
                          itemId={itemId}
                          itemName={item.name}
                          itemPrice={item.price}
                          itemDescription={item.description}
                          category={cat.name}
                          image_url={item.image_url}
                          image_credit={item.image_credit}
                          icon={Utensils}
                          className="group rounded-[var(--dt-radius-lg)] overflow-hidden bg-[var(--dt-surface)] border border-[var(--dt-border)] shadow-sm hover:shadow-lg hover:border-[var(--dt-primary)] transition-all duration-300"
                          imageClassName="w-full h-52 object-cover"
                          placeholderClassName="w-full h-52 bg-gradient-to-br from-[var(--dt-primary-soft-strong)] to-[var(--dt-primary-soft)] flex items-center justify-center"
                          placeholderIconClassName="w-12 h-12 text-[var(--dt-primary-soft-strong)]"
                          contentClassName="p-5 space-y-3 flex flex-col flex-1"
                          headerClassName="flex items-start justify-between gap-3"
                          titleClassName=" font-bold text-[var(--dt-text)] text-base leading-tight"
                          descriptionClassName="text-[var(--dt-text-muted)] text-sm leading-relaxed flex-1"
                          priceClassName="text-xs font-bold text-[var(--dt-primary)] bg-[var(--dt-primary-soft)] border border-[var(--dt-border)] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
                          buttonClassName="mt-auto w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-[var(--dt-radius)] text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-1"
                          buttonStyle={{ background: "var(--dt-primary)", color: "var(--dt-cta-text)" }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,
    gallery: gallery ? (
      <MemoPreviewSectionWrapper section="gallery" label="Galeri" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ gallery, dt }} render={(data) => {
          const { gallery: g, dt: d } = data;
          return <GallerySection gallery={g} design_token={d} />;
        }} />
      </MemoPreviewSectionWrapper>
    ) : null,
  } as Record<string, React.ReactNode>;

  const waPhone = contact?.phone ?? "";

  return (
    <CartProvider waPhone={waPhone} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#4F46E5"}>
    <div
      className="selection:bg-[var(--dt-primary-soft-strong)] selection:text-[var(--dt-text)] overflow-x-hidden min-h-screen"
      style={{ ...cssVars, background: "var(--dt-bg)", color: "var(--dt-text)", fontFamily: "var(--dt-body-font)" }}
    >
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <HeaderSection header={header} design_token={dt} sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} />
      </MemoPreviewSectionWrapper>

      {filterEmptySections(sectionOrder, content, isEditorMode)
        .filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key))
        .filter((key) => !arrivedSections || arrivedSections.includes(key))
        .map((key) => <div key={key} className="animate-slide-up">{sectionNodes[key] ?? null}</div>)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} />
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
