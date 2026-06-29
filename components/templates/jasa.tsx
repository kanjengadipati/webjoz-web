"use client";

import React from "react";
import { Shield, Globe, Zap, MapPin, Phone, Mail, ArrowRight, Send, Star, Sparkles } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, DynamicIcon, LeadForm, TestimonialsSection, MenuCatalogCard,
  CartProvider, CartFab,
  WAFloatingButton, BackToTop, navCtaHref, FaqAccordion, SeoEditorPreview,
  ContactSection,
} from "./shared";
import GallerySection from "../sections/gallery";
import { buildCssVars, loadGoogleFont } from "./helpers";
import type { TemplateProps } from "./types";

export const TemplateJasa: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, catalog, gallery } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const sectionOrder = (() => {
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "testimonials", "faq", "cta", "contact"];
    const order = [...base];
    if (testimonials && !order.includes("testimonials")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "testimonials");
    }
    if (catalog && !order.includes("catalog")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "catalog");
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
          <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 bg-gradient-to-tr from-[var(--dt-bg)] via-[var(--dt-bg)] to-[var(--dt-primary-soft)] overflow-hidden" style={hero.background_color ? { background: hero.background_color } : undefined}>
            {hero.image_url && (
              <img
                src={hero.image_url}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
                alt="Hero"
              />
            )}
            <div className="max-w-4xl text-center space-y-6 relative z-10">
              <h1 className="text-4xl md:text-6xl font-black text-[var(--dt-text)] tracking-tight leading-tight">
                {hero.headline}
              </h1>
              <p className="text-lg md:text-xl text-[var(--dt-text-muted)] max-w-2xl mx-auto leading-relaxed">
                {hero.subheadline}
              </p>
              <div className="pt-4">
                <a
                  href={hero.cta_url}
                  className="min-h-11 px-8 py-4 bg-[var(--dt-primary)] hover:bg-[var(--dt-primary-hover)] rounded-[var(--dt-radius)] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]"
                  style={{ color: "var(--dt-cta-text)" }}
                >
                  {hero.cta_text}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
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
                  <img
                    src={about.image_url}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-cover absolute inset-0 z-10"
                    alt="About"
                  />
                )}
              </div>
            </div>
            <div className="space-y-6">
              <span className="text-[var(--dt-primary)] font-extrabold tracking-wider uppercase text-xs">Profil</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--dt-text)] tracking-tight">{about.title}</h2>
              <p className="text-[var(--dt-text-muted)] leading-relaxed text-justify whitespace-pre-line">{about.body}</p>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(benefits) => (
          <section className="px-6 py-[var(--dt-spacing)]" id="benefits" style={{ background: "var(--dt-primary-dark)", color: "var(--dt-on-dark-muted)" }}>
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-3">
                <span className="font-extrabold tracking-wider uppercase text-xs" style={{ color: "var(--dt-on-dark-accent)" }}>Mengapa Kami</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--dt-on-dark)" }}>{benefits.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.items?.map((item, idx) => (
                  <div key={idx} className="border hover:border-[var(--dt-on-dark-accent)] p-8 rounded-[var(--dt-radius-lg)] transition-all duration-300 group" style={{ background: "var(--dt-primary-dark-soft)", borderColor: "var(--dt-primary-dark-border)" }}>
                    {item.stat ? (
                      <div className="mb-4 sm:mb-6">
                        <p className="text-3xl font-black tracking-tight" style={{ color: "var(--dt-on-dark)" }}>{item.stat}</p>
                        {item.stat_label && <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--dt-on-dark-accent)" }}>{item.stat_label}</p>}
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[var(--dt-radius)] flex items-center justify-center mb-4 sm:mb-6 group-hover:brightness-125 transition-all" style={{ background: "var(--dt-primary-dark-soft)", color: "var(--dt-on-dark-accent)" }}>
                        <DynamicIcon name={item.icon} defaultIcon={Zap} className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3" style={{ color: "var(--dt-on-dark)" }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--dt-on-dark-muted)" }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(catalogData) => (
          <section className="px-6 py-[var(--dt-spacing)] bg-[var(--dt-surface)] border-y border-[var(--dt-border)]" id="catalog">
            <div className="max-w-6xl mx-auto space-y-14">
              <div className="text-center space-y-3">
                {catalogData.eyebrow && <span className="text-[var(--dt-primary)] font-extrabold tracking-wider uppercase text-xs">{catalogData.eyebrow}</span>}
                <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--dt-text)] tracking-tight">{catalogData.title}</h2>
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
                        badge={item.badge}
                        icon={Sparkles}
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
              <span className="text-[var(--dt-primary)] font-extrabold tracking-wider uppercase text-xs">Solusi Pertanyaan</span>
              <h2 className="text-3xl font-extrabold text-[var(--dt-text)] tracking-tight">{faq.title}</h2>
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
            <div className="bg-gradient-to-r from-[var(--dt-primary)] to-[var(--dt-primary-hover)] text-[var(--dt-cta-text)] p-8 md:p-16 rounded-[var(--dt-radius-lg)] text-center space-y-6 relative overflow-hidden shadow-lg">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--dt-cta-text)] tracking-tight">{cta.headline}</h2>
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-[var(--dt-primary)] hover:bg-[var(--dt-primary-hover)] rounded-[var(--dt-radius)] font-bold shadow-md transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]" style={{ color: "var(--dt-cta-text)" }}
                  >
                    {cta.button_text || "Hubungi Kami"}
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
            onSubmitLead={data.onSubmitLead}
            leadSubmitting={data.leadSubmitting}
            leadSuccess={data.leadSuccess}
            leadError={data.leadError}
            wrapperClass="px-6 py-[var(--dt-spacing)] border-t border-[var(--dt-border)]"
            wrapperStyle={{ background: "var(--dt-primary-soft)" }}
            titleClass="text-3xl font-extrabold text-[var(--dt-text)] tracking-tight"
            accentColor={dt?.palette?.primary ?? "#4f46e5"}
            textClass="text-[var(--dt-text-muted)]"
            mapsLinkClass="text-[var(--dt-primary)] hover:text-[var(--dt-text)] font-bold"
            leadCardClass="bg-[var(--dt-surface)] p-8 rounded-[var(--dt-radius-lg)] border border-[var(--dt-border)] shadow-sm"
            leadTitleClass="text-lg font-bold text-[var(--dt-text)]"
            leadTitleText="Kirim Pertanyaan Anda"
            leadFormBtnClass="bg-[var(--dt-primary)] hover:bg-[var(--dt-primary-hover)] text-[var(--dt-cta-text)] rounded-[var(--dt-radius)] shadow-sm"
            leadFormInputClass="w-full px-4 py-2.5 bg-[var(--dt-primary-soft)] border border-[var(--dt-border)] focus:border-[var(--dt-primary)] focus:ring-1 focus:ring-[var(--dt-primary)] rounded-[var(--dt-radius)] outline-none text-sm transition-all"
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={testimonials}
          headingClass="text-[var(--dt-text)] font-extrabold tracking-tight"
          eyebrowClass="text-[var(--dt-primary)]"
          cardClass="bg-[var(--dt-surface)] border border-[var(--dt-border)]"
          quoteClass="text-[var(--dt-text-muted)]"
          nameClass="text-[var(--dt-text)]"
          roleClass="text-[var(--dt-text-muted)]"
          bgClass="bg-[var(--dt-primary-soft)] border-y border-[var(--dt-border)] py-[var(--dt-spacing)] px-6"
        />
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

  return (
    <CartProvider waPhone={contact?.phone ?? ""} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#4F46E5"} primaryFg={dt?.palette?.primary ? undefined : "#ffffff"}>
    <div
      className="font-sans selection:bg-[var(--dt-primary-soft-strong)] selection:text-[var(--dt-text)] overflow-x-hidden min-h-screen"
      style={{ ...cssVars, background: "var(--dt-bg)", color: "var(--dt-text)", fontFamily: "var(--dt-body-font)" }}
    >
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, icon: header?.icon, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(headerData) => (
          <header
            className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative"
            style={{ background: "color-mix(in srgb, var(--dt-bg) 80%, transparent)", borderColor: "var(--dt-border)" }}
          >
            <span className="min-w-0 text-base sm:text-lg font-extrabold text-[var(--dt-text)] tracking-wider flex items-center gap-2">
              <LogoImage
                url={headerData.logo_url}
                icon={headerData.icon}
                defaultIcon={Globe}
                iconClass="w-5 h-5 shrink-0 text-[var(--dt-primary)]"
                imgClass="h-8 w-auto shrink-0 object-contain"
              />
              <span className="min-w-0">
                <span className="truncate block">{headerData.brand_name || "Brand Kami"}</span>
                {headerData.tagline && <span className="block text-[10px] font-normal text-[var(--dt-text-muted)] tracking-wide truncate">{headerData.tagline}</span>}
              </span>
            </span>
            <NavMenu
              sectionOrder={sectionOrder}
              hiddenSections={dt?.layout?.hidden_sections}
              linkClass="text-[var(--dt-text)]"
              drawerStyle={{ background: "var(--dt-bg)", borderTop: "1px solid var(--dt-border)" }}
            />
            <a href={navCtaHref(headerData.nav_cta_text)} aria-label={`Hubungi ${headerData.brand_name || "brand ini"}`} className="min-h-11 shrink-0 px-5 py-2.5 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-xs font-semibold hover:bg-[var(--dt-primary-hover)] transition-all shadow-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]" style={{ color: "var(--dt-cta-text)" }}>
              {headerData.nav_cta_text || "Hubungi Kami"}
            </a>
          </header>
        )} />
      </MemoPreviewSectionWrapper>

      {sectionOrder
        .filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key))
        .filter((key) => !arrivedSections || arrivedSections.includes(key))
        .map((key) => <div key={key} className="animate-slide-up">{sectionNodes[key] ?? null}</div>)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: footer?.brand_name, tagline: footer?.tagline, copyright_text: footer?.copyright_text, brand_name_fallback: header?.brand_name }} render={(footerData) => {
          const displayBrand = footerData.brand_name || footerData.brand_name_fallback || "Layanan Bisnis Kami";
          const displayTagline = footerData.tagline || "Solusi profesional dan terpercaya untuk bisnis Anda";
          return (
            <footer className="text-center py-10 text-xs space-y-1" style={{ background: "var(--dt-primary-dark)", color: "var(--dt-on-dark-muted)" }}>
              <p className="text-sm font-bold" style={{ color: "var(--dt-on-dark)" }}>{displayBrand}</p>
              <p>{displayTagline}</p>
              <p>{footerData.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}</p>
            </footer>
          );
        }} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && (
        <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={seo} render={(seoData) => (
            <SeoEditorPreview seo={seoData} />
          )} />
        </MemoPreviewSectionWrapper>
      )}
      <CartFab colorStyle={{ background: "var(--dt-primary)", color: "var(--dt-cta-text)" }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
