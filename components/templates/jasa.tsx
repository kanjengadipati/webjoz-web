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
import type { TemplateProps } from "./types";

export const TemplateJasa: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, catalog, gallery } = content;
  const dt = design_token ?? null;
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
          <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 bg-gradient-to-tr from-slate-50 via-slate-100/50 to-indigo-50/30 overflow-hidden">
            {hero.image_url && (
              <img
                src={hero.image_url}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
                alt="Hero"
              />
            )}
            <div className="max-w-4xl text-center space-y-6 relative z-10">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                {hero.headline}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {hero.subheadline}
              </p>
              <div className="pt-4">
                <a
                  href={hero.cta_url}
                  className="min-h-11 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-slate-50"
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
          <section className="px-6 py-24 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="about">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-100 rounded-2xl opacity-40 shadow-inner"></div>
              <div className="w-full h-80 md:h-[400px] bg-white border border-slate-200 rounded-2xl shadow-md relative z-10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 shadow-sm border border-indigo-100">
                      <DynamicIcon name={about.icon} defaultIcon={Shield} className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-slate-900 text-xl">{header?.brand_name || "Bisnis Kami"}</p>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed">{about.title}</p>
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
              <span className="text-indigo-600 font-extrabold tracking-wider uppercase text-xs">Profil</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">{about.title}</h2>
              <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line">{about.body}</p>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(benefits) => (
          <section className="bg-indigo-950 text-indigo-100 px-6 py-24" id="benefits">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-3">
                <span className="text-indigo-400 font-extrabold tracking-wider uppercase text-xs">Mengapa Kami</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{benefits.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.items?.map((item, idx) => (
                  <div key={idx} className="bg-indigo-900/30 border border-indigo-900/50 hover:border-indigo-400 p-8 rounded-2xl transition-all duration-300 group">
                    {item.stat ? (
                      <div className="mb-4 sm:mb-6">
                        <p className="text-3xl font-black tracking-tight text-white">{item.stat}</p>
                        {item.stat_label && <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">{item.stat_label}</p>}
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-indigo-500/20 transition-all">
                        <DynamicIcon name={item.icon} defaultIcon={Zap} className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-indigo-200/70 text-sm leading-relaxed">{item.description}</p>
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
          <section className="px-6 py-24 bg-white border-y border-slate-200" id="catalog">
            <div className="max-w-6xl mx-auto space-y-14">
              <div className="text-center space-y-3">
                {catalogData.eyebrow && <span className="text-indigo-600 font-extrabold tracking-wider uppercase text-xs">{catalogData.eyebrow}</span>}
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">{catalogData.title}</h2>
                {catalogData.subtitle && <p className="text-slate-600 max-w-2xl mx-auto">{catalogData.subtitle}</p>}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="w-6 h-0.5 rounded-full" style={{ background: "#4f46e5" }} />
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4f46e5", opacity: 0.6 }} />
                  <span className="w-6 h-0.5 rounded-full" style={{ background: "#4f46e5" }} />
                </div>
              </div>
              {catalogData.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
                    <span className="text-xs font-extrabold uppercase tracking-wider px-4 py-1 rounded-full" style={{ color: "#4f46e5", background: "#eef2ff", border: "1px solid #e0e7ff" }}>{cat.name}</span>
                    <span className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
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
                        className="group bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        imageClassName="w-full h-40 object-cover rounded-xl border border-slate-200 transition-transform duration-500 group-hover:scale-105"
                        imageStyle={{ borderRadius: "12px" }}
                        placeholderClassName="w-full h-40 rounded-xl border border-indigo-100 bg-indigo-50 flex items-center justify-center"
                        placeholderIconClassName="w-10 h-10 text-indigo-500"
                        contentClassName="space-y-3"
                        headerClassName="flex items-start justify-between gap-3"
                        titleClassName="font-extrabold text-slate-900 text-base leading-snug"
                        descriptionClassName="text-sm text-slate-600 leading-relaxed"
                        priceClassName="font-bold text-indigo-600 text-sm whitespace-nowrap"
                        badgeClassName="inline-block mb-2 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full"
                        buttonClassName="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
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
          <section className="px-6 py-24 max-w-4xl mx-auto space-y-16" id="faq">
            <div className="text-center space-y-2">
              <span className="text-indigo-600 font-extrabold tracking-wider uppercase text-xs">Solusi Pertanyaan</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{faq.title}</h2>
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
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 md:p-16 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-lg">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{cta.headline}</h2>
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-white hover:bg-slate-50 text-indigo-800 rounded-xl font-bold shadow-md transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
                  >
                    {cta.button_text}
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
            onSubmitLead={data.onSubmitLead}
            leadSubmitting={data.leadSubmitting}
            leadSuccess={data.leadSuccess}
            leadError={data.leadError}
            wrapperClass="px-6 py-24 border-t border-slate-200"
            wrapperStyle={{ background: "#f1f5f9" }}
            titleClass="text-3xl font-extrabold text-slate-900 tracking-tight"
            accentColor="#4f46e5"
            textClass="text-slate-600"
            mapsLinkClass="text-indigo-600 hover:text-indigo-800 font-bold"
            leadCardClass="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
            leadTitleClass="text-lg font-bold text-slate-900"
            leadTitleText="Kirim Pertanyaan Anda"
            leadFormBtnClass="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
            leadFormInputClass="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none text-sm transition-all"
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={testimonials}
          headingClass="text-slate-900 font-extrabold tracking-tight"
          eyebrowClass="text-indigo-600"
          cardClass="bg-white border border-slate-200"
          quoteClass="text-slate-600"
          nameClass="text-slate-900"
          roleClass="text-slate-500"
          bgClass="bg-slate-100 border-y border-slate-200 py-24 px-6"
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
    <div className="bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden min-h-screen">
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, icon: header?.icon, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(headerData) => (
          <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-50/80 border-b border-slate-200/80 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative">
            <span className="min-w-0 text-base sm:text-lg font-extrabold text-indigo-950 tracking-wider flex items-center gap-2">
              <LogoImage
                url={headerData.logo_url}
                icon={headerData.icon}
                defaultIcon={Globe}
                iconClass="w-5 h-5 shrink-0 text-indigo-600"
                imgClass="h-8 w-auto shrink-0 object-contain"
              />
              <span className="min-w-0">
                <span className="truncate block">{headerData.brand_name || "Brand Kami"}</span>
                {headerData.tagline && <span className="block text-[10px] font-normal text-indigo-400 tracking-wide truncate">{headerData.tagline}</span>}
              </span>
            </span>
            <NavMenu
              sectionOrder={sectionOrder}
              hiddenSections={dt?.layout?.hidden_sections}
              linkClass="text-slate-700"
              drawerStyle={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}
            />
            <a href={navCtaHref(headerData.nav_cta_text)} aria-label={`Hubungi ${headerData.brand_name || "brand ini"}`} className="min-h-11 shrink-0 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-slate-50">
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
            <footer className="bg-slate-900 text-slate-400 text-center py-10 text-xs border-t border-slate-200 space-y-1">
              <p className="text-sm font-bold text-slate-200">{displayBrand}</p>
              <p className="text-slate-505" style={{ color: "var(--slate-500, #94a3b8)" }}>{displayTagline}</p>
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
      <CartFab colorStyle={{ background: "#4f46e5", color: "white" }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
