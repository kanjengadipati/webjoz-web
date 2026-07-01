"use client";

import React from "react";
import { Leaf, ArrowRight, Sparkles, MapPin, Phone, Mail, Utensils, Image as ImageIcon, Star } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, LeadForm, TestimonialsSection, MenuCatalogCard,
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, navCtaHref,
  ContactSection, BenefitsSection,
} from "./shared";
import GallerySection from "../sections/gallery";
import { buildCssVars, loadGoogleFont, headingVars } from "./helpers";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateNatural: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, menu, catalog, gallery } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const sectionOrder = (() => {
    const base: string[] = ["hero", "about", "benefits", "testimonials", "faq", "cta", "contact"];
    const order = [...base];
    if (menu && !order.includes("menu")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "menu");
    if (catalog && !order.includes("catalog")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "catalog");
    if (gallery && !order.includes("gallery")) order.splice(order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.length, 0, "gallery");
    return order;
  })();

  const cream = dt?.palette?.background ?? "#fcf8f2";
  const sage = dt?.palette?.primary ?? "#3d5a45";
  const sageDark = `color-mix(in srgb, ${sage} 85%, black)`;
  const sageLight = `color-mix(in srgb, ${sage} 12%, ${cream})`;
  const brown = dt?.palette?.text ?? "#2e251b";
  const brownMuted = `color-mix(in srgb, ${brown} 60%, transparent)`;
  const border = "var(--dt-border)";
  const surface = "var(--dt-surface)";
  const ctaText = "var(--dt-cta-text)";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <section className="py-[var(--dt-spacing)] px-6 grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto" style={h.background_color ? { background: h.background_color } : undefined}>
            <div className="space-y-5">
              {h.eyebrow && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border  " style={{ background: sageLight, borderColor: border, color: sageDark }}>
                  <Leaf className="w-3 h-3" /> {h.eyebrow}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-medium leading-tight" style={{ color: brown, fontFamily: "var(--dt-heading-font)", ...headingVars }}>
                {h.headline}
              </h1>
              <p className="text-sm md:text-base leading-relaxed italic font-light" style={{ color: brownMuted }}>
                {h.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href={h.cta_url} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--dt-radius)] text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90" style={{ background: sage, color: ctaText }}>
                  {h.cta_text} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              {h.badge_text && <p className="text-[10px] uppercase tracking-wider  " style={{ color: brownMuted }}>{h.badge_text}</p>}
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-[var(--dt-radius-lg)] rotate-1" style={{ background: sageLight }} />
              <div className="relative rounded-[var(--dt-radius-lg)] p-6 text-center space-y-4 border shadow" style={{ background: surface, borderColor: border }}>
                {h.image_url
                  ? <><img src={h.image_url} alt={h.headline} className="w-full h-52 object-cover rounded-[var(--dt-radius-lg)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} /><PhotoCredit credit={h.image_credit} /></>
                  : (
                    <>
                      <span className="text-4xl block">🌿</span>
                      <h3 className="italic text-lg" style={{ color: sageDark, fontFamily: "var(--dt-heading-font)" }}>"{h.headline}"</h3>
                      <p className="text-[9px] uppercase tracking-widest  " style={{ color: brownMuted }}>{header?.brand_name}</p>
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
          <section className="py-[var(--dt-spacing)] px-6 border-y" id="about" style={{ background: "var(--dt-primary-soft)", borderColor: border }}>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  {a.eyebrow && <span className="text-[10px] uppercase tracking-widest font-bold   block" style={{ color: sage }}>{a.eyebrow}</span>}
                  <h2 className="text-2xl md:text-3xl font-medium leading-snug" style={{ color: brown, fontFamily: "var(--dt-heading-font)", ...headingVars }}>{a.title}</h2>
                  <p className="text-sm leading-relaxed italic font-light" style={{ color: brownMuted }}>{a.body}</p>
                </div>
                {a.image_url && (
                  <img src={a.image_url} alt={a.title} className="w-full h-52 object-cover rounded-[var(--dt-radius-lg)] border" style={{ borderColor: border }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                )}
                {a.image_url && <PhotoCredit credit={a.image_credit} />}
              </div>
              {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: border }}>
                  {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                    <div key={i} className="text-center space-y-1">
                      <p className="text-2xl font-bold" style={{ color: sage, fontFamily: "var(--dt-heading-font)" }}>{stat!.value}</p>
                      <p className="text-[10px]  " style={{ color: brownMuted }}>{stat!.label}</p>
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
          <BenefitsSection
            benefits={b}
            wrapperClass="py-[var(--dt-spacing)] px-6"
            wrapperStyle={{ background: cream }}
            eyebrowClass="text-[10px] uppercase tracking-widest font-bold block"
            eyebrowStyle={{ color: sage }}
            titleClass="text-2xl md:text-3xl font-medium"
            titleStyle={{ color: brown, fontFamily: "var(--dt-heading-font)" }}
            subtitleClass="text-sm italic"
            subtitleStyle={{ color: brownMuted }}
            cardClass="p-6 rounded-[var(--dt-radius-lg)] border space-y-3 transition-all hover:shadow-md"
            cardStyle={{ background: surface, borderColor: border }}
            iconContainerClass="w-10 h-10 rounded-full flex items-center justify-center"
            iconContainerStyle={{ background: sageLight }}
            iconClass="w-5 h-5"
            statClass="text-xl font-bold"
            statStyle={{ color: sage, fontFamily: "var(--dt-heading-font)" }}
            cardTitleClass="text-sm font-bold"
            cardTitleStyle={{ color: brown }}
            cardDescClass="text-xs leading-relaxed italic font-light"
            cardDescStyle={{ color: brownMuted }}
            accentColor={sage}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection testimonials={testimonials}
          wrapperClass="py-[var(--dt-spacing)] px-6"
          wrapperStyle={{ background: "var(--dt-primary-soft)", borderTop: `1px solid ${border}` }}
          titleClass="font-medium"
          titleStyle={{ color: brown, fontFamily: "var(--dt-heading-font)" }}
          eyebrowClass=""
          eyebrowStyle={{ color: sage }}
          cardClass=""
          cardStyle={{ background: surface, border: `1px solid ${border}`, borderRadius: "var(--dt-radius-lg)" }}
          quoteClass=""
          quoteStyle={{ color: brownMuted }}
          nameClass=""
          nameStyle={{ color: brown }}
          roleClass=""
          roleStyle={{ color: brownMuted }}
          accentColor={sage}
        />
      </MemoPreviewSectionWrapper>
    ) : null,
    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(menuData) => (
          <section className="py-[var(--dt-spacing)] px-6 border-y" id="menu" style={{ background: cream, borderColor: border }}>
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase tracking-widest   block" style={{ color: sage }}>Menu Pilihan</span>
                <h2 className="text-2xl md:text-3xl font-medium" style={{ color: brown, fontFamily: "var(--dt-heading-font)", ...headingVars }}>{menuData.title}</h2>
              </div>
              {menuData.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2  " style={{ color: sage, borderColor: border }}>{cat.name}</h3>
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
                        image_credit={item.image_credit}
                        icon={Utensils}
                        className="rounded-[var(--dt-radius-lg)] border overflow-hidden flex flex-col transition-all hover:shadow-md"
                        style={{ background: surface, borderColor: border }}
                        imageClassName="w-full h-44 object-cover"
                        placeholderClassName="w-full h-44 flex items-center justify-center"
                        placeholderStyle={{ background: sageLight }}
                        placeholderIconClassName="w-10 h-10"
                        placeholderIconStyle={{ color: sage, opacity: 0.45 }}
                        contentClassName="p-5 flex-1 flex flex-col gap-2"
                        headerClassName="flex items-start justify-between gap-2"
                        titleClassName="text-sm font-bold  "
                        titleStyle={{ color: brown }}
                        descriptionClassName="text-xs italic flex-1"
                        descriptionStyle={{ color: brownMuted }}
                        priceClassName="text-xs font-bold px-2 py-0.5 rounded-full   whitespace-nowrap shrink-0"
                        priceStyle={{ background: sageLight, color: sageDark }}
                        buttonClassName="mt-auto flex items-center justify-center gap-1.5 py-2 px-3 rounded-[var(--dt-radius)] text-xs font-bold cursor-pointer transition-all hover:opacity-90  "
                        buttonStyle={{ background: sage, color: ctaText }}
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
          <section className="py-[var(--dt-spacing)] px-6 border-y" id="catalog" style={{ background: cream, borderColor: border }}>
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase tracking-widest   block" style={{ color: sage }}>Koleksi Pilihan</span>
                <h2 className="text-2xl md:text-3xl font-medium" style={{ color: brown, fontFamily: "var(--dt-heading-font)", ...headingVars }}>{catalogData.title}</h2>
              </div>
              {catalogData.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2  " style={{ color: sage, borderColor: border }}>{cat.name}</h3>
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
                        image_credit={item.image_credit}
                        badge={item.badge}
                        icon={ImageIcon}
                        className="rounded-[var(--dt-radius-lg)] border overflow-hidden flex flex-col transition-all hover:shadow-md"
                        style={{ background: surface, borderColor: border }}
                        imageClassName="w-full h-44 object-cover"
                        placeholderClassName="w-full h-44 flex items-center justify-center"
                        placeholderStyle={{ background: sageLight }}
                        placeholderIconClassName="w-10 h-10"
                        placeholderIconStyle={{ color: sage, opacity: 0.45 }}
                        contentClassName="p-5 flex-1 flex flex-col gap-2"
                        headerClassName="flex items-start justify-between gap-2"
                        titleClassName="text-sm font-bold  "
                        titleStyle={{ color: brown }}
                        descriptionClassName="text-xs italic flex-1"
                        descriptionStyle={{ color: brownMuted }}
                        priceClassName="text-sm font-bold  "
                        priceStyle={{ color: sage }}
                        badgeClassName="text-[10px] font-bold px-2 py-0.5 rounded-full   whitespace-nowrap shrink-0"
                        badgeStyle={{ background: sageLight, color: sageDark }}
                        buttonClassName="mt-auto flex items-center justify-center gap-1.5 py-2 px-3 rounded-[var(--dt-radius)] text-xs font-bold cursor-pointer transition-all hover:opacity-90  "
                        buttonStyle={{ background: sage, color: ctaText }}
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
          <section className="py-[var(--dt-spacing)] px-6 max-w-3xl mx-auto space-y-8" id="faq">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-medium" style={{ color: brown, fontFamily: "var(--dt-heading-font)", ...headingVars }}>{f.title}</h2>
            </div>
            <div className="space-y-3">{f.items?.map((item, idx) => <FaqAccordion key={idx} item={item} />)}</div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    cta: (
      <MemoPreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={cta} render={(c) => (
          <section className="py-[var(--dt-spacing)] px-6 border-y" style={{ background: "var(--dt-primary-soft)", borderColor: border }}>
            <div className="max-w-2xl mx-auto text-center space-y-5">
              {c.eyebrow && <span className="text-[10px] uppercase tracking-widest   block" style={{ color: sage }}>{c.eyebrow}</span>}
              <h2 className="text-2xl md:text-3xl font-medium" style={{ color: brown, fontFamily: "var(--dt-heading-font)", ...headingVars }}>{c.headline}</h2>
              {c.subheadline && <p className="text-sm italic font-light" style={{ color: brownMuted }}>{c.subheadline}</p>}
              <a href={c.button_url} className="inline-flex items-center gap-2 px-8 py-3 rounded-[var(--dt-radius)] text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90" style={{ background: sage, color: ctaText }}>
                {c.button_text} <ArrowRight className="w-4 h-4" />
              </a>
              {c.trust_signal && <p className="text-[10px]  " style={{ color: brownMuted }}>{c.trust_signal}</p>}
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
            wrapperClass="py-[var(--dt-spacing)] px-6"
            wrapperStyle={{ background: cream }}
            titleClass="text-2xl font-medium"
            titleStyle={{ color: brown, fontFamily: "var(--dt-heading-font)" }}
            accentColor={sage}
            textClass="text-sm  "
            textStyle={{ color: brownMuted }}
            leadCardClass="p-6 rounded-[var(--dt-radius-lg)] border"
            leadCardStyle={{ background: surface, borderColor: border }}
            leadTitleClass="text-sm font-bold  "
            leadTitleStyle={{ color: sageDark }}
            leadTitleText="Kirim Pesan"
            leadFormBtnClass="rounded-[var(--dt-radius)] font-bold text-xs uppercase tracking-wider"
            leadFormBtnStyle={{ background: sage, color: ctaText }}
            leadFormInputClass="w-full px-3 py-2.5 rounded-[var(--dt-radius)] text-sm   border outline-none focus:ring-1"
            leadFormInputStyle={{ borderColor: border }}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    gallery: gallery ? (
      <MemoPreviewSectionWrapper section="gallery" label="Galeri" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ gallery, dt }} render={(data) => {
          const { gallery: g, dt: d } = data;
          return <GallerySection gallery={g} design_token={d} />;
        }} />
      </MemoPreviewSectionWrapper>
    ) : null,
  };

  return (
    <CartProvider waPhone={contact?.phone ?? ""} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#4F46E5"} primaryFg={dt?.palette?.primary ? undefined : "#ffffff"}>
    <div style={{ ...cssVars, background: cream, color: brown, fontFamily: "var(--dt-body-font)", minHeight: "100vh", overflowX: "hidden" }}>
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(h) => (
          <header className="sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 relative border-b  " style={{ background: `color-mix(in srgb, ${cream} 88%, transparent)`, borderColor: border }}>
            <span className="flex shrink-0 items-center gap-2 text-base font-bold" style={{ color: sage }}>
              <LogoImage url={h.logo_url} icon={undefined} defaultIcon={Leaf} iconClass="h-8 w-8 shrink-0" imgClass="h-8 w-8 shrink-0 rounded-full object-cover" />
              <span className="min-w-0">
                <span className="block truncate">{h.brand_name}</span>
                {h.tagline && <span className="block text-[10px] font-normal" style={{ color: brownMuted }}>{h.tagline}</span>}
              </span>
            </span>
            <NavMenu sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} linkClass="" drawerStyle={{ background: cream, borderTop: `1px solid ${border}` }} />
            <a href={navCtaHref(h.nav_cta_text)} className="px-5 py-2 rounded-[var(--dt-radius)] text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90" style={{ background: sage, color: ctaText }}>
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
          <footer className="py-8 text-center border-t  " style={{ background: "var(--dt-primary-soft)", borderColor: border }}>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: brownMuted }}>{f.copyright_text || `© ${new Date().getFullYear()} ${f.brand}. All rights reserved.`}</p>
          </footer>
        )} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: sage, color: ctaText }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
