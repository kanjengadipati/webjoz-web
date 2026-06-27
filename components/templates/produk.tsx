"use client";

import React from "react";
import { Globe, ArrowRight, Check, MapPin, Phone, Mail, Image as ImageIcon, Utensils, Star, Sparkles } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, DynamicIcon, LeadForm, TestimonialsSection,
  MenuCatalogCard, CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, navCtaHref,
  ContactSection,
} from "./shared";
import type { TemplateProps } from "./types";

export const TemplateProduk: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, catalog, testimonials } = content;
  const dt = design_token ?? null;
  const baseSectionOrderProduk: string[] = dt?.layout?.section_order ?? ["hero", "benefits", "catalog", "testimonials", "cta", "about", "faq", "contact"];
  const sectionOrder = (() => {
    const order = [...baseSectionOrderProduk];
    if (catalog && !order.includes("catalog")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("about") >= 0 ? order.indexOf("about") : order.length;
      order.splice(idx, 0, "catalog");
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
          <section className="relative min-h-[90vh] flex items-center justify-center px-5 sm:px-6 py-20 overflow-hidden bg-slate-950">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/20 rounded-full filter blur-[80px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full filter blur-[100px] opacity-50 pointer-events-none" />
            {hero.image_url && (
              <img
                src={hero.image_url}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
                alt="Hero"
              />
            )}
            <div className="max-w-4xl text-center space-y-8 relative z-10">
              <h1 className="text-2xl sm:text-4xl md:text-7xl font-extrabold tracking-tight leading-tight md:leading-none text-white">
                {hero.headline}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {hero.subheadline}
              </p>
              <div className="pt-4">
                <a
                  href={hero.cta_url}
                  className="min-h-11 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-105 text-slate-950 rounded-full font-bold shadow-lg hover:shadow-cyan-500/30 transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
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
          <section className="px-6 py-28 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="about">
            <div className="space-y-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 font-extrabold tracking-wider uppercase text-xs">Misi Kami</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{about.title}</h2>
              <p className="text-slate-300 leading-relaxed sm:text-justify whitespace-pre-line">{about.body}</p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500 to-teal-500 rounded-3xl opacity-10 filter blur-xl"></div>
              <div className="w-full h-80 md:h-[400px] bg-slate-900/50 border border-slate-800 rounded-3xl shadow-xl relative z-10 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-cyan-950 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <DynamicIcon name={about.icon} defaultIcon={Globe} className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-white text-xl">Inovasi Global</p>
                    <p className="text-slate-300 text-sm max-w-xs leading-relaxed">
                      Kami membangun produk berkualitas tinggi dengan riset mendalam demi memberikan pengalaman terbaik.
                    </p>
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
          <section className="bg-slate-900/30 border-y border-slate-900 px-6 py-28" id="benefits">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-3">
                <span className="text-cyan-400 font-extrabold tracking-wider uppercase text-xs">Teknologi</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{benefits.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.items?.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-cyan-500 p-8 rounded-3xl transition-all duration-300 group">
                    <div className="w-12 h-12 bg-cyan-950 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 border border-cyan-800/40">
                      <DynamicIcon name={item.icon} defaultIcon={Check} className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
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
          <section className="px-6 py-28 max-w-4xl mx-auto space-y-16" id="faq">
            <div className="text-center space-y-2">
              <span className="text-cyan-400 font-extrabold tracking-wider uppercase text-xs">Pusat Bantuan</span>
              <h2 className="text-3xl font-extrabold tracking-tight">{faq.title}</h2>
            </div>
            <div className="space-y-4">
              {faq.items?.map((item, idx) => (
                <FaqAccordion key={idx} item={item} isDark={true} />
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
            <div className="relative bg-slate-900 border border-slate-800 p-8 md:p-16 rounded-3xl text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-cyan-500/5 rounded-full filter blur-[50px] md:blur-[100px]"></div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{cta.headline}</h2>
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:brightness-110 text-slate-950 rounded-full font-bold shadow-lg transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    {cta.button_text}
                    <ArrowRight className="w-4 h-4 text-slate-950" />
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
            wrapperClass="px-6 py-28 border-t border-slate-900"
            wrapperStyle={{ background: "#0f172a" }}
            titleClass="text-3xl font-extrabold tracking-tight text-white"
            accentColor="#22d3ee"
            textClass="text-slate-300"
            mapsLinkClass="text-cyan-400 hover:text-cyan-300 font-bold"
            leadCardClass="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm"
            leadTitleClass="text-lg font-bold text-white"
            leadTitleText="Hubungi Kami Langsung"
            leadFormBtnClass="bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 rounded-xl"
            leadFormInputClass="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl outline-none text-sm text-slate-100 transition-all"
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={testimonials}
          headingClass="text-white font-extrabold tracking-tight"
          eyebrowClass="text-cyan-400"
          cardClass="bg-slate-900 border border-slate-800"
          quoteClass="text-slate-300"
          nameClass="text-white"
          roleClass="text-slate-500"
          bgClass="bg-slate-950 border-y border-slate-800 py-24 px-6"
        />
      </MemoPreviewSectionWrapper>
    ) : null,
    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(catalogData) => (
          <section className="relative px-5 sm:px-6 py-24 border-y border-slate-800 overflow-hidden" id="catalog" style={{ background: "linear-gradient(180deg, #0f172a, #0f172a, rgba(15,23,42,0.9))", backgroundImage: "radial-gradient(circle at top right, rgba(34,211,238,0.16), transparent 35%), radial-gradient(circle at bottom left, rgba(20,184,166,0.12), transparent 30%)" }}>
            <div className="max-w-7xl mx-auto space-y-12 relative">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Koleksi Produk</span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">{catalogData.title}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.5))" }} />
                  <span className="w-2 h-2 rotate-45" style={{ background: "#06b6d4", boxShadow: "0 0 8px rgba(34,211,238,0.5)" }} />
                  <span className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.5), transparent)" }} />
                </div>
              </div>
              {catalogData.categories?.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.3))" }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#06b6d4", boxShadow: "0 0 6px rgba(34,211,238,0.6)" }} />
                    <h3 className="px-4 py-2 rounded-full text-sm font-black uppercase tracking-[0.18em] whitespace-nowrap" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22d3ee" }}>{cat.name}</h3>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#06b6d4", boxShadow: "0 0 6px rgba(34,211,238,0.6)" }} />
                    <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.3), transparent)" }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                          badge={item.badge}
                          icon={ImageIcon}
                          className="group rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:translate-y-[-3px]"
                          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.8)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
                          imageClassName="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                          placeholderClassName="w-full h-56 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                          placeholderStyle={{ background: "linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8))" }}
                          placeholderIconClassName="w-12 h-12"
                          placeholderIconStyle={{ color: "rgba(34,211,238,0.25)" }}
                          contentClassName="p-5 space-y-3 flex flex-col flex-1"
                          headerClassName="flex items-start justify-between gap-3"
                          titleClassName="font-bold text-white text-sm leading-tight group-hover:text-cyan-200 transition-colors"
                          descriptionClassName="text-sm leading-relaxed flex-1"
                          descriptionStyle={{ color: "rgba(148,163,184,0.8)" }}
                          priceClassName="text-cyan-300 font-black text-sm whitespace-nowrap"
                          badgeClassName="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap"
                          badgeStyle={{ color: "#0f172a", background: "#22d3ee", border: "1px solid rgba(34,211,238,0.5)" }}
                          buttonClassName="mt-auto w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-1"
                          buttonStyle={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "#0f172a", boxShadow: "0 2px 10px rgba(34,211,238,0.2)" }}
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
    <div className="bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden min-h-screen">
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, icon: header?.icon, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(headerData) => (
          <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative">
            <span className="min-w-0 text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 tracking-wider flex items-center gap-2">
              <LogoImage
                url={headerData.logo_url}
                icon={headerData.icon}
                defaultIcon={Utensils}
                iconClass="w-5 h-5 shrink-0 text-cyan-400 fill-cyan-400/20"
                imgClass="h-8 w-auto shrink-0 object-contain"
              />
              <span className="min-w-0">
                <span className="truncate block">{headerData.brand_name || "Brand Kami"}</span>
                {headerData.tagline && <span className="block text-[10px] font-normal text-cyan-400/60 tracking-wide truncate">{headerData.tagline}</span>}
              </span>
            </span>
            <NavMenu
              sectionOrder={sectionOrder}
              hiddenSections={dt?.layout?.hidden_sections}
              linkClass="text-slate-300"
              drawerStyle={{ background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.08)" }}
            />
            <a href={navCtaHref(headerData.nav_cta_text)} aria-label={`Hubungi ${headerData.brand_name || "brand ini"}`} className="min-h-11 shrink-0 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 rounded-full text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)] inline-flex items-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950">
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
          const displayBrand = footerData.brand_name || footerData.brand_name_fallback || "Bisnis Produk Kami";
          const displayTagline = footerData.tagline || "Kualitas produk terbaik untuk memenuhi kenyamanan Anda";
          return (
            <footer className="bg-slate-950 text-slate-650 text-center py-10 text-xs border-t border-slate-900 space-y-1">
              <p className="text-sm font-bold text-slate-400">{displayBrand}</p>
              <p className="text-slate-650">{displayTagline}</p>
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
      {!isEditorMode && <CartFab colorStyle={{ background: "#06b6d4", color: "#0f172a" }} />}
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
