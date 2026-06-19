"use client";

import React from "react";
import { Utensils, Clock, ArrowRight, MapPin, Phone, Mail, Globe, Star, Send, Sparkles } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, DynamicIcon, LeadForm, TestimonialsSection,
  MenuCatalogCard, CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, navCtaHref,
  ContactSection,
} from "./shared";
import type { TemplateProps } from "./types";

export const TemplateKuliner: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, menu, testimonials } = content;
  const dt = design_token ?? null;
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
    return order;
  })();

  const sectionNodes = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(hero) => (
          <section className="relative min-h-[85vh] flex items-center justify-center text-center px-5 sm:px-6 py-20 bg-gradient-to-b from-amber-50/50 to-[#FAF7F2] overflow-hidden">
            {hero.image_url && (
              <img
                src={hero.image_url}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="Hero"
              />
            )}
            <div className="max-w-4xl relative z-10 space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-serif text-amber-955 leading-tight">
                {hero.headline}
              </h1>
              <p className="text-lg md:text-xl text-[#6D5D50] max-w-2xl mx-auto leading-relaxed">
                {hero.subheadline}
              </p>
              {hero.opening_hours && (
                <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm">
                  <Clock className="w-4 h-4 text-amber-700" />
                  {hero.opening_hours}
                </p>
              )}
              <div className="pt-4">
                <a
                  href={hero.cta_url}
                  className="min-h-11 px-8 py-4 bg-amber-800 hover:bg-amber-900 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 focus:ring-offset-[#FAF7F2]"
                >
                  {hero.cta_text}
                  <ArrowRight className="w-5 h-5" />
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
          <section className="px-5 sm:px-6 py-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="about">
            <div className="space-y-6">
              <span className="text-amber-800 font-bold tracking-wider uppercase text-xs block">Mengenal Kami</span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-955">{about.title}</h2>
              <p className="text-[#6D5D50] leading-relaxed whitespace-pre-line sm:text-justify">{about.body}</p>
            </div>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-200 to-amber-100 rounded-3xl -rotate-2 opacity-50 shadow-inner"></div>
              <div className="w-full h-80 md:h-[400px] bg-amber-100/80 border-2 border-amber-200/50 rounded-3xl shadow-lg relative z-10 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <DynamicIcon name={about.icon} defaultIcon={Utensils} className="w-12 h-12 text-amber-700 mx-auto" />
                    <p className="font-serif italic text-amber-900 font-semibold text-lg">{header?.brand_name || "Bisnis Kami"}</p>
                    <p className="text-amber-700/85 text-sm max-w-xs">{about.title}</p>
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
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(benefits) => (
          <section className="bg-amber-900/5 px-5 sm:px-6 py-20 border-y border-[#EADFCB]" id="benefits">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="text-amber-800 font-bold tracking-wider uppercase text-xs">Keunggulan</span>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-955">{benefits.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.items?.map((item, idx) => (
                  <div key={idx} className="bg-white border border-[#EADFCB] hover:border-amber-400 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                      <DynamicIcon name={item.icon} defaultIcon={Star} className="w-6 h-6 fill-amber-500 stroke-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-955 mb-3">{item.title}</h3>
                    <p className="text-[#6D5D50] text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    faq: (
      <MemoPreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={faq} render={(faq) => (
          <section className="px-6 py-20 max-w-4xl mx-auto space-y-12" id="faq">
            <div className="text-center space-y-2">
              <span className="text-amber-800 font-bold tracking-wider uppercase text-xs">Pertanyaan</span>
              <h2 className="text-3xl font-bold font-serif text-amber-955">{faq.title}</h2>
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
            <div className="bg-[#FAF7F2] border border-[#EADFCB] p-8 md:p-16 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-50 to-orange-50 opacity-40"></div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-955">{cta.headline}</h2>
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-amber-800 hover:bg-amber-900 text-white rounded-full font-bold shadow-md transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 focus:ring-offset-[#FAF7F2]"
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
            showLeadForm={data.contact.show_lead_form}
            onSubmitLead={data.onSubmitLead}
            leadSubmitting={data.leadSubmitting}
            leadSuccess={data.leadSuccess}
            leadError={data.leadError}
            wrapperClass="px-6 py-20 border-t border-[#EADFCB]"
            wrapperStyle={{ background: "#F4EEE0" }}
            titleClass="text-3xl font-bold font-serif text-amber-955"
            accentColor="#b45309"
            textClass="text-amber-900"
            mapsLinkClass="text-amber-800 underline hover:text-amber-955 font-medium"
            leadCardClass="bg-white p-8 rounded-3xl border border-[#EADFCB] shadow-sm"
            leadTitleClass="text-lg font-bold font-serif text-amber-955"
            leadTitleText="Hubungi Kami / Reservasi"
            leadFormBtnClass="bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow-sm hover:shadow"
            leadFormInputClass="w-full px-4 py-2.5 bg-amber-50/50 border border-[#EADFCB] focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl outline-none text-sm transition-all"
            phoneBtnClass="rounded-xl font-bold text-sm"
            phoneBtnStyle={{ background: "#b45309", color: "#ffffff" }}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={testimonials}
          headingClass="text-amber-955 font-serif"
          eyebrowClass="text-amber-800"
          cardClass="bg-white border border-[#EADFCB]"
          quoteClass="text-[#6D5D50]"
          nameClass="text-amber-955"
          roleClass="text-amber-700/60"
          bgClass="bg-[#F4EEE0] border-y border-[#EADFCB] py-20 px-5 sm:px-6"
        />
      </MemoPreviewSectionWrapper>
    ) : null,
    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(menuData) => (
          <section className="relative px-5 sm:px-6 py-24 bg-gradient-to-b from-white via-white to-amber-50/70 border-y border-[#EADFCB] overflow-hidden" id="menu">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-100/70 blur-3xl pointer-events-none" />
            <div className="max-w-6xl mx-auto space-y-10 relative">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-amber-800">Pilihan Menu</span>
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-amber-950 max-w-3xl mx-auto leading-tight">{menuData.title}</h2>
              </div>
              {menuData.categories?.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-amber-200/70" />
                    <h3 className="px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm font-bold font-serif whitespace-nowrap">{cat.name}</h3>
                    <span className="h-px flex-1 bg-amber-200/70" />
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
                          icon={Utensils}
                          className="group rounded-[1.75rem] overflow-hidden bg-white border border-amber-100 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300"
                          imageClassName="w-full h-52 object-cover"
                          placeholderClassName="w-full h-52 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center"
                          placeholderIconClassName="w-12 h-12 text-amber-300"
                          contentClassName="p-5 space-y-3 flex flex-col flex-1"
                          headerClassName="flex items-start justify-between gap-3"
                          titleClassName="font-serif font-bold text-amber-950 text-base leading-tight"
                          descriptionClassName="text-amber-900/65 text-sm leading-relaxed flex-1"
                          priceClassName="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
                          buttonClassName="mt-auto w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-1"
                          buttonStyle={{ background: "#92400e", color: "#fff" }}
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
  } as Record<string, React.ReactNode>;

  const waPhone = contact?.phone ?? "";

  return (
    <CartProvider waPhone={waPhone} brandName={header?.brand_name} previewMode={isEditorMode}>
    <div className="bg-[#FAF7F2] text-[#2C2620] font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden min-h-screen">
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, icon: header?.icon, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(headerData) => (
          <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF7F2]/80 border-b border-[#EADFCB] px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative">
            <span className="min-w-0 text-lg sm:text-xl font-bold font-serif text-amber-955 tracking-wide flex items-center gap-2">
              <LogoImage
                url={headerData.logo_url}
                icon={headerData.icon}
                defaultIcon={Utensils}
                iconClass="w-5 h-5 shrink-0 text-amber-700"
                imgClass="h-8 w-auto shrink-0 object-contain"
              />
              <span className="min-w-0">
                <span className="truncate block">{headerData.brand_name || "Brand Kami"}</span>
                {headerData.tagline && <span className="block text-[10px] font-normal text-amber-700/70 tracking-wide truncate">{headerData.tagline}</span>}
              </span>
            </span>
            <NavMenu
              sectionOrder={sectionOrder}
              hiddenSections={dt?.layout?.hidden_sections}
              linkClass="text-amber-900"
              drawerStyle={{ background: "#FAF7F2", borderTop: "1px solid #EADFCB" }}
            />
            <a href={navCtaHref(headerData.nav_cta_text)} aria-label={`Hubungi ${headerData.brand_name || "brand ini"}`} className="min-h-11 shrink-0 px-4 py-2 bg-amber-800 text-white rounded-full text-sm font-medium hover:bg-amber-900 transition-all shadow-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 focus:ring-offset-[#FAF7F2]">
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
          const displayBrand = footerData.brand_name || footerData.brand_name_fallback || "Bisnis Kuliner Kami";
          const displayTagline = footerData.tagline || "Cita rasa autentik untuk kebersamaan keluarga Anda";
          return (
            <footer className="bg-amber-955 text-amber-100/70 text-center py-10 text-xs border-t border-amber-900/30 space-y-1">
              <p className="text-sm font-bold text-amber-100">{displayBrand}</p>
              <p className="text-amber-100/50">{displayTagline}</p>
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
      {!isEditorMode && <CartFab colorStyle={{ background: "#92400e", color: "#fff" }} />}
      {!isEditorMode && <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} />}
      {!isEditorMode && <BackToTop isEditorMode={isEditorMode} />}
    </div>
    </CartProvider>
  );
};
