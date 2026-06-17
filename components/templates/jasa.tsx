"use client";

import React from "react";
import { Shield, Globe, Zap, MapPin, Phone, Mail, ArrowRight, Send, Star, Sparkles } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, DynamicIcon, LeadForm, TestimonialsSection,
  WAFloatingButton, BackToTop, navCtaHref, FaqAccordion, SeoEditorPreview,
} from "./shared";
import type { TemplateProps } from "./types";

export const TemplateJasa: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials } = content;
  const dt = design_token ?? null;
  const sectionOrder = (() => {
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "testimonials", "faq", "cta", "contact"];
    const order = [...base];
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
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-955 tracking-tight">{about.title}</h2>
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
        <MemoSectionContent content={{ contact, onSubmitLead, leadSubmitting, leadSuccess, leadError, brand_name: header?.brand_name }} render={(data) => (
          <section className="px-6 py-24 bg-slate-100 border-t border-slate-200" id="contact">
            <div className={`max-w-6xl mx-auto ${data.contact.show_lead_form && data.onSubmitLead ? "grid grid-cols-1 lg:grid-cols-2 gap-16" : "max-w-xl mx-auto text-center"}`}>
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{data.contact.title}</h2>
                <div className="space-y-4 text-slate-600">
                  {data.contact.address && data.contact.address !== "area sekitar" && (
                    <div className="flex items-start justify-center gap-3">
                      <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <p>{data.contact.address}</p>
                    </div>
                  )}
                  {data.contact.phone && (
                    <div className="flex items-center justify-center gap-3">
                      <Phone className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <p>{data.contact.phone}</p>
                    </div>
                  )}
                  {data.contact.email && !data.contact.email.includes("brand-anda") && (
                    <div className="flex items-center justify-center gap-3">
                      <Mail className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <p>{data.contact.email}</p>
                    </div>
                  )}
                </div>
                {data.contact.maps_url && (
                  <div className="pt-4">
                    <a
                      href={data.contact.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1.5"
                    >
                      <Globe className="w-4 h-4" />
                      Buka Peta Lokasi
                    </a>
                  </div>
                )}
              </div>
              {data.contact.show_lead_form && data.onSubmitLead && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Kirim Pertanyaan Anda</h3>
                  <LeadForm
                    onSubmit={data.onSubmitLead}
                    submitting={data.leadSubmitting}
                    success={data.leadSuccess}
                    error={data.leadError}
                    buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
                    inputClass="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none text-sm transition-all"
                  />
                </div>
              )}
            </div>
          </section>
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
  } as Record<string, React.ReactNode>;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden min-h-screen">
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, icon: header?.icon, tagline: header?.tagline }} render={(headerData) => (
          <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-50/80 border-b border-slate-200/80 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative">
            <span className="min-w-0 text-base sm:text-lg font-extrabold text-indigo-955 tracking-wider flex items-center gap-2">
              <LogoImage
                url={headerData.logo_url}
                icon={headerData.icon}
                defaultIcon={Globe}
                iconClass="w-5 h-5 text-indigo-600"
                imgClass="h-8 w-auto object-contain"
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

      {sectionOrder.filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key)).map((key) => <React.Fragment key={key}>{sectionNodes[key] ?? null}</React.Fragment>)}

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
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
  );
};
