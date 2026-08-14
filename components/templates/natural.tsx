"use client";

import React from "react";
import { ArrowRight, Utensils, Image as ImageIcon } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  LeadForm, TestimonialsSection, MenuCatalogCard,
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, ctaHref,
  ContactSection, BenefitsSection,
} from "./shared";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import GallerySection from "../sections/gallery";
import HeroNaturalOrganic from "../sections/hero/natural-organic";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateNatural: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections, isPremium = false, language
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, menu, catalog, gallery } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const sectionOrder = (() => {
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "benefits", "testimonials", "faq", "cta", "contact"];
    const order = [...base];
    const afterHero = (s: string) => {
      const heroIdx = order.indexOf("hero");
      order.splice(heroIdx >= 0 ? heroIdx + 1 : 1, 0, s);
    };
    if (menu    && !order.includes("menu"))    afterHero("menu");
    if (catalog && !order.includes("catalog")) afterHero("catalog");
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
          <HeroNaturalOrganic
            hero={{ ...h, cta_url: ctaHref(contact.phone, h.cta_url) }}
            design_token={dt}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "hero"}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(a) => (
          <section className="py-[var(--dt-spacing)] px-6 border-y" id="about" style={{ background: "var(--dt-primary-soft)", borderColor: border }}>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className={a.image_url ? "grid md:grid-cols-2 gap-8 items-center" : "max-w-3xl mx-auto"}>
                <div className="space-y-4" style={{ textAlign: a.textAlign || "left" }}>
                  {a.eyebrow && <span className="text-[10px] uppercase tracking-widest font-bold   block" style={{ color: sage }}>{a.eyebrow}</span>}
                  <h2 className="text-2xl md:text-3xl font-medium leading-snug" style={{ color: brown, fontFamily: "var(--dt-heading-font)", ...headingVars }}>{a.title}</h2>
                  <p className="text-sm leading-relaxed italic font-light" style={{ color: brownMuted }}>{a.body}</p>
                </div>
                {a.image_url && (
                  <div className="relative">
                    <img src={a.image_url} alt={a.title} className="w-full h-52 object-cover rounded-[var(--dt-radius-lg)] border" style={{ borderColor: border }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="absolute bottom-1 right-2 z-10"><PhotoCredit credit={a.image_credit} /></div>
                  </div>
                )}
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
          designVariant="minimal"
          wrapperClass="py-[var(--dt-spacing)] px-6"
          wrapperStyle={{ background: "var(--dt-primary-soft)", borderTop: `1px solid ${border}` }}
          titleClass="font-medium"
          titleStyle={{ color: brown, fontFamily: "var(--dt-heading-font)" }}
          eyebrowClass=""
          eyebrowStyle={{ color: sage }}
          cardClass=""
          cardStyle={{ background: "transparent" }}
          quoteClass="italic font-light"
          quoteStyle={{ color: brownMuted }}
          nameClass="text-sm font-semibold text-stone-800"
          roleClass="text-xs font-light text-stone-500"
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
            <div className="divide-y divide-stone-200">{f.items?.map((item, idx) => <FaqAccordion key={idx} item={item} variant="minimal" index={idx} />)}</div>
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
            leadTitleText={language === 'en' ? 'Send Message' : 'Kirim Pesan'}
            leadFormBtnClass="rounded-[var(--dt-radius)] font-bold text-xs uppercase tracking-wider"
            leadFormBtnStyle={{ background: sage, color: ctaText }}
            leadFormInputClass="w-full px-3 py-2.5 rounded-[var(--dt-radius)] text-sm   border outline-none focus:ring-1"
            leadFormInputStyle={{ borderColor: border }}
            language={language}
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
        <HeaderSection header={header} design_token={dt} sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} />
      </MemoPreviewSectionWrapper>

      {filterEmptySections(sectionOrder, content, isEditorMode)
        .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
        .filter(k => !arrivedSections || arrivedSections.includes(k))
        .map(k => <div key={k} className="animate-slide-up">{sectionNodes[k] ?? null}</div>)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: sage, color: ctaText }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={header?.brand_name} isPremium={isPremium} floatingType={design_token?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
