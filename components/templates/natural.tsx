"use client";

import React from "react";
import { Leaf, ArrowRight, Sparkles, MapPin, Phone, Mail, Utensils, Image as ImageIcon, Star } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LeadForm, TestimonialsSection, MenuCatalogCard,
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, navCtaHref,
  ContactSection,
} from "./shared";
import type { TemplateProps } from "./types";

export const TemplateNatural: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, menu, catalog } = content;
  const dt = design_token ?? null;
  const sectionOrder = (() => {
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "testimonials", "cta", "faq", "contact"];
    const order = [...base];
    if (testimonials && !order.includes("testimonials")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "testimonials");
    if (menu && !order.includes("menu")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "menu");
    if (catalog && !order.includes("catalog")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "catalog");
    return order;
  })();

  const cream = "#fcf8f2";
  const sage = "#3d5a45";
  const sageDark = "#2c4233";
  const sageLight = "#e9f0ea";
  const brown = "#2e251b";
  const brownMuted = "#5a4e42";
  const border = "#eae1d0";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <section className="py-16 px-6 grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div className="space-y-5">
              {h.eyebrow && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border font-sans" style={{ background: sageLight, borderColor: "#a2b5a5", color: sageDark }}>
                  <Leaf className="w-3 h-3" /> {h.eyebrow}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-medium leading-tight" style={{ color: "#233527", fontFamily: "Georgia, 'Playfair Display', serif" }}>
                {h.headline}
              </h1>
              <p className="text-sm md:text-base leading-relaxed italic font-light" style={{ color: brownMuted }}>
                {h.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href={h.cta_url} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all hover:opacity-90" style={{ background: sage }}>
                  {h.cta_text} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              {h.badge_text && <p className="text-[10px] uppercase tracking-wider font-sans" style={{ color: "#8a9e8d" }}>{h.badge_text}</p>}
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-[3rem] rotate-1" style={{ background: sageLight }} />
              <div className="relative rounded-[3rem] p-6 text-center space-y-4 border shadow" style={{ background: "white", borderColor: border }}>
                {h.image_url
                  ? <img src={h.image_url} alt={h.headline} className="w-full h-52 object-cover rounded-2xl" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  : (
                    <>
                      <span className="text-4xl block">🌿</span>
                      <h3 className="italic text-lg" style={{ color: sageDark, fontFamily: "Georgia, serif" }}>"{h.headline}"</h3>
                      <p className="text-[9px] uppercase tracking-widest font-sans" style={{ color: "#aaa" }}>{header?.brand_name}</p>
                    </>
                  )}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(a) => (
          <section className="py-16 px-6 border-y" id="about" style={{ background: "#efe9df40", borderColor: border }}>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  {a.eyebrow && <span className="text-[10px] uppercase tracking-widest font-bold font-sans block" style={{ color: sage }}>{a.eyebrow}</span>}
                  <h2 className="text-2xl md:text-3xl font-medium leading-snug" style={{ color: "#233527", fontFamily: "Georgia, serif" }}>{a.title}</h2>
                  <p className="text-sm leading-relaxed italic font-light" style={{ color: brownMuted }}>{a.body}</p>
                </div>
                {a.image_url && (
                  <img src={a.image_url} alt={a.title} className="w-full h-52 object-cover rounded-2xl border" style={{ borderColor: border }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                )}
              </div>
              {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: border }}>
                  {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                    <div key={i} className="text-center space-y-1">
                      <p className="text-2xl font-bold" style={{ color: sage, fontFamily: "Georgia, serif" }}>{stat!.value}</p>
                      <p className="text-[10px] font-sans" style={{ color: brownMuted }}>{stat!.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(b) => (
          <section className="py-16 px-6" id="benefits" style={{ background: cream }}>
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                {b.eyebrow && <span className="text-[10px] uppercase tracking-widest font-bold font-sans block" style={{ color: sage }}>{b.eyebrow}</span>}
                <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#233527", fontFamily: "Georgia, serif" }}>{b.title}</h2>
                {b.subtitle && <p className="text-sm italic" style={{ color: brownMuted }}>{b.subtitle}</p>}
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {b.items?.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl border space-y-3 transition-all hover:shadow-md" style={{ background: "white", borderColor: border }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: sageLight }}>
                      <Sparkles className="w-5 h-5" style={{ color: sage }} />
                    </div>
                    {item.stat && <p className="text-xl font-bold" style={{ color: sage, fontFamily: "Georgia, serif" }}>{item.stat}</p>}
                    <h3 className="text-sm font-bold font-sans" style={{ color: brown }}>{item.title}</h3>
                    <p className="text-xs leading-relaxed italic font-light" style={{ color: brownMuted }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection testimonials={testimonials}
          headingClass="font-medium" eyebrowClass="" cardClass="" quoteClass="" nameClass="" roleClass=""
          bgClass="py-16 px-6"
          sectionStyle={{ background: "#efe9df40", borderTop: `1px solid ${border}` }}
          cardStyle={{ background: "white", border: `1px solid ${border}`, borderRadius: "16px" }}
        />
      </MemoPreviewSectionWrapper>
    ) : null,
    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(menuData) => (
          <section className="py-16 px-6 border-y" id="menu" style={{ background: cream, borderColor: border }}>
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase tracking-widest font-sans block" style={{ color: sage }}>Menu Pilihan</span>
                <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#233527", fontFamily: "Georgia, serif" }}>{menuData.title}</h2>
              </div>
              {menuData.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2 font-sans" style={{ color: sage, borderColor: border }}>{cat.name}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cat.items?.map((item, ii) => (
                      <MenuCatalogCard
                        key={ii}
                        itemId={`${cat.name}__${item.name}__${ci}_${ii}`}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        category={cat.name}
                        image_url={item.image_url}
                        icon={Utensils}
                        className="rounded-3xl border overflow-hidden flex flex-col transition-all hover:shadow-md"
                        style={{ background: "white", borderColor: border }}
                        imageClassName="w-full h-44 object-cover"
                        placeholderClassName="w-full h-44 flex items-center justify-center"
                        placeholderStyle={{ background: sageLight }}
                        placeholderIconClassName="w-10 h-10"
                        placeholderIconStyle={{ color: sage, opacity: 0.45 }}
                        contentClassName="p-5 flex-1 flex flex-col gap-2"
                        headerClassName="flex items-start justify-between gap-2"
                        titleClassName="text-sm font-bold font-sans"
                        titleStyle={{ color: brown }}
                        descriptionClassName="text-xs italic flex-1"
                        descriptionStyle={{ color: brownMuted }}
                        priceClassName="text-xs font-bold px-2 py-0.5 rounded-full font-sans whitespace-nowrap shrink-0"
                        priceStyle={{ background: sageLight, color: sageDark }}
                        buttonClassName="mt-auto flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold cursor-pointer transition-all hover:opacity-90 text-white font-sans"
                        buttonStyle={{ background: sage }}
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
    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(catalogData) => (
          <section className="py-16 px-6 border-y" id="catalog" style={{ background: cream, borderColor: border }}>
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase tracking-widest font-sans block" style={{ color: sage }}>Koleksi Pilihan</span>
                <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#233527", fontFamily: "Georgia, serif" }}>{catalogData.title}</h2>
              </div>
              {catalogData.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2 font-sans" style={{ color: sage, borderColor: border }}>{cat.name}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cat.items?.map((item, ii) => (
                      <MenuCatalogCard
                        key={ii}
                        itemId={`${cat.name}__${item.name}__${ci}_${ii}`}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        category={cat.name}
                        image_url={item.image_url}
                        badge={item.badge}
                        icon={ImageIcon}
                        className="rounded-3xl border overflow-hidden flex flex-col transition-all hover:shadow-md"
                        style={{ background: "white", borderColor: border }}
                        imageClassName="w-full h-44 object-cover"
                        placeholderClassName="w-full h-44 flex items-center justify-center"
                        placeholderStyle={{ background: sageLight }}
                        placeholderIconClassName="w-10 h-10"
                        placeholderIconStyle={{ color: sage, opacity: 0.45 }}
                        contentClassName="p-5 flex-1 flex flex-col gap-2"
                        headerClassName="flex items-start justify-between gap-2"
                        titleClassName="text-sm font-bold font-sans"
                        titleStyle={{ color: brown }}
                        descriptionClassName="text-xs italic flex-1"
                        descriptionStyle={{ color: brownMuted }}
                        priceClassName="text-sm font-bold font-sans"
                        priceStyle={{ color: sage }}
                        badgeClassName="text-[10px] font-bold px-2 py-0.5 rounded-full font-sans whitespace-nowrap shrink-0"
                        badgeStyle={{ background: sageLight, color: sageDark }}
                        buttonClassName="mt-auto flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold cursor-pointer transition-all hover:opacity-90 text-white font-sans"
                        buttonStyle={{ background: sage }}
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
        <MemoSectionContent content={faq} render={(f) => (
          <section className="py-16 px-6 max-w-3xl mx-auto space-y-8" id="faq">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-medium" style={{ color: "#233527", fontFamily: "Georgia, serif" }}>{f.title}</h2>
            </div>
            <div className="space-y-3">{f.items?.map((item, idx) => <FaqAccordion key={idx} item={item} />)}</div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    cta: (
      <MemoPreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={cta} render={(c) => (
          <section className="py-16 px-6 border-y" style={{ background: "#efe9df40", borderColor: border }}>
            <div className="max-w-2xl mx-auto text-center space-y-5">
              {c.eyebrow && <span className="text-[10px] uppercase tracking-widest font-sans block" style={{ color: sage }}>{c.eyebrow}</span>}
              <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#233527", fontFamily: "Georgia, serif" }}>{c.headline}</h2>
              {c.subheadline && <p className="text-sm italic font-light" style={{ color: brownMuted }}>{c.subheadline}</p>}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all hover:opacity-90" style={{ background: sage }}>
                {c.button_text} <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <p className="text-[10px] font-sans" style={{ color: brownMuted }}>{c.trust_signal}</p>}
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
            wrapperClass="py-16 px-6"
            wrapperStyle={{ background: cream }}
            titleClass="text-2xl font-medium"
            titleStyle={{ color: "#233527", fontFamily: "Georgia, serif" }}
            accentColor={sage}
            textClass="text-sm font-sans"
            textStyle={{ color: brownMuted }}
            leadCardClass="p-6 rounded-2xl border"
            leadCardStyle={{ background: "white", borderColor: border }}
            leadTitleClass="text-sm font-bold font-sans"
            leadTitleStyle={{ color: sageDark }}
            leadTitleText="Kirim Pesan"
            leadFormBtnClass="rounded-full text-white font-bold text-xs uppercase tracking-wider"
            leadFormBtnStyle={{ background: sage }}
            leadFormInputClass="w-full px-3 py-2.5 rounded-xl text-sm font-sans border outline-none focus:ring-1 focus:ring-[#3d5a45]"
            phoneBtnClass="rounded-full font-bold text-xs uppercase tracking-wider"
            phoneBtnStyle={{ background: sage, color: "#ffffff" }}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
  };

  return (
    <CartProvider waPhone={contact?.phone ?? ""} brandName={header?.brand_name} previewMode={isEditorMode}>
    <div style={{ background: cream, color: brown, fontFamily: "Georgia, 'Playfair Display', serif", minHeight: "100vh", overflowX: "hidden" }}>
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(h) => (
          <header className="sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 relative border-b font-sans" style={{ background: `${cream}e0`, borderColor: border }}>
            <span className="flex items-center gap-2 text-base font-bold" style={{ color: sage }}>
              <span>🌿</span>
              <span className="min-w-0">
                <span className="block truncate">{h.brand_name}</span>
                {h.tagline && <span className="block text-[10px] font-normal" style={{ color: brownMuted }}>{h.tagline}</span>}
              </span>
            </span>
            <NavMenu sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} linkClass="" drawerStyle={{ background: cream, borderTop: `1px solid ${border}` }} />
            <a href={navCtaHref(h.nav_cta_text)} className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all hover:opacity-90" style={{ background: sage }}>
              {h.nav_cta_text || "Hubungi Kami"}
            </a>
          </header>
        )} />
      </MemoPreviewSectionWrapper>

      {sectionOrder
        .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
        .filter(k => !arrivedSections || arrivedSections.includes(k))
        .map(k => <div key={k} className="animate-slide-up">{sectionNodes[k] ?? null}</div>)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand: header?.brand_name, copyright_text: footer?.copyright_text }} render={(f) => (
          <footer className="py-8 text-center border-t font-sans" style={{ background: "#f5ede0", borderColor: border }}>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: brownMuted }}>{f.copyright_text || `© ${new Date().getFullYear()} ${f.brand}. All rights reserved.`}</p>
          </footer>
        )} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      {!isEditorMode && <CartFab colorStyle={{ background: sage, color: "white" }} />}
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
