"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, ctaHref, InlineText,
} from "./shared";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import GallerySection from "../sections/gallery";
import PhotoCredit from "../sections/PhotoCredit";
import BenefitsSectionInner from "../sections/benefits";
import TestimonialsSectionInner from "../sections/testimonials";
import FaqSectionInner from "../sections/faq";
import ContactSectionInner from "../sections/contact";
import MenuSectionInner from "../sections/menu";
import CatalogSectionInner from "../sections/catalog";
import type { TemplateProps } from "./types";

export const TemplateColorful: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections, isPremium = false, language,
  onUpdateField, collapseSheetForInlineEdit, onEditingStateChange
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, testimonials, menu, catalog, gallery } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const sectionOrder = (() => {
    const base: string[] = dt?.layout?.section_order ?? ["hero", "about", "menu", "catalog", "testimonials", "benefits", "faq", "cta", "contact"];
    const order = [...base];
    if (menu    && !order.includes("menu"))    order.splice(order.indexOf("hero") >= 0 ? order.indexOf("hero") + 1 : 1, 0, "menu");
    if (catalog && !order.includes("catalog")) order.splice(order.indexOf("hero") >= 0 ? order.indexOf("hero") + 1 : 1, 0, "catalog");
    if (gallery && !order.includes("gallery")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "gallery");
    }
    return order;
  })();

  const yellow = dt?.palette?.primary ?? "#FFE135";
  const pink = dt?.palette?.accent ?? "#FF3CAC";
  const black = "#0D0D0D";
  const bg = "#FFFBEB";
  const ctaText = "var(--dt-cta-text)";

  const shadowBlock = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const shadowBlockHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <section className="py-14 px-6 max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-center" style={h.background_color ? { background: h.background_color } : undefined}>
            <div className="md:col-span-7 space-y-5">
              {h.eyebrow && (
                <span className="inline-flex items-center gap-1.5 border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-wider" style={{ boxShadow: "2px 2px 0px #000", background: `color-mix(in srgb, ${yellow} 35%, white)`, color: black }}>
                  <SparkleIcon className="w-[18px] h-[18px]" /> <InlineText section="hero" fieldKey="eyebrow" value={h.eyebrow} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "hero"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                </span>
              )}
              <InlineText section="hero" fieldKey="headline" value={h.headline} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "hero"} multiline as="h1" className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tight" style={{ color: black, ...headingVars }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
              <InlineText section="hero" fieldKey="subheadline" value={h.subheadline} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "hero"} multiline as="p" className="text-sm font-bold leading-relaxed" style={{ color: "#3D2B00" }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
              <div className="flex flex-wrap gap-3 pt-2">
                <a href={ctaHref(contact.phone, h.cta_url)}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 border-2 border-black font-black text-xs uppercase tracking-wider transition-all ${shadowBlock} ${shadowBlockHover}`}
                  style={{ background: yellow, color: ctaText }}>
                  <InlineText section="hero" fieldKey="cta_text" value={h.cta_text} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "hero"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /> <ArrowRight className="w-4 h-4 stroke-[3]" />
                </a>
                {h.cta_secondary_text && (
                  <a href="#contact"
                    className={`inline-flex items-center gap-2 px-6 py-3.5 border-2 border-black font-black text-xs uppercase tracking-wider transition-all bg-white ${shadowBlock} ${shadowBlockHover}`}
                    style={{ color: black }}>
                    <InlineText section="hero" fieldKey="cta_secondary_text" value={h.cta_secondary_text} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "hero"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                  </a>
                )}
              </div>
              {h.badge_text && <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: pink }}>{h.badge_text}</p>}
            </div>
            <div className="md:col-span-5 relative">
              <div className="absolute inset-0 rounded-2xl rotate-2 border-2 border-black" style={{ background: pink }} />
              <div className={`relative bg-white border-4 border-black rounded-2xl p-5 space-y-4 ${shadowBlock}`}>
                {h.image_url
                  ? <div className="relative"><img src={h.image_url} alt={h.headline} className="w-full h-48 object-cover rounded-xl border-2 border-black" onError={(e) => { e.currentTarget.style.display = 'none'; }} /><div className="absolute bottom-1 right-2 z-10"><PhotoCredit credit={h.image_credit} /></div></div>
                  : (
                    <div className="w-full h-48 rounded-xl border-2 border-black flex items-center justify-center" style={{ background: yellow }}>
                      <span className="text-5xl">🎯</span>
                    </div>
                  )}
                <div className="border-t-2 border-black pt-3 text-center">
                  <p className="font-black text-sm uppercase">{header?.brand_name}</p>
                </div>
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(a) => (
          <section id="about" className="py-14 px-6 border-y-4 border-black" style={{ background: "#E8F5E9" }}>
            <div className={`max-w-5xl mx-auto ${a.image_url ? "grid md:grid-cols-2 gap-10 items-center" : "max-w-3xl mx-auto"}`}>
              <div className="space-y-4" style={{ textAlign: a.textAlign || "left" }}>
                {a.eyebrow && <InlineText section="about" fieldKey="eyebrow" value={a.eyebrow} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} as="span" className="inline-block text-[10px] font-black uppercase tracking-widest px-2 py-1" style={{ background: black, color: yellow }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
                <InlineText section="about" fieldKey="title" value={a.title} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} multiline as="h2" className="text-2xl md:text-3xl font-black uppercase leading-snug" style={{ color: black, ...headingVars }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                <InlineText section="about" fieldKey="body" value={a.body} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "about"} multiline as="p" className="text-sm font-semibold leading-relaxed" style={{ color: "#2D4A1E" }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
                {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                  <div className="grid grid-cols-3 gap-3 pt-3">
                    {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                      <div key={i} className={`border-2 border-black p-3 text-center ${shadowBlock}`} style={{ background: i === 0 ? yellow : i === 1 ? pink : "#B2EBF2" }}>
                        <p className="text-xl font-black" style={{ color: black }}>{stat!.value}</p>
                        <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: black }}>{stat!.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {a.image_url && (
                <div className="relative">
                  <div className="absolute inset-0 border-2 border-black rounded-xl rotate-2" style={{ background: yellow }} />
                  <img src={a.image_url} alt={a.title} className="relative w-full h-60 object-cover rounded-xl border-4 border-black" style={{ boxShadow: "5px 5px 0 #000" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className="absolute bottom-1 right-2 z-10"><PhotoCredit credit={a.image_credit} /></div>
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
          <BenefitsSectionInner benefits={b} design_token={dt} language={language} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "benefits"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSectionInner testimonials={testimonials} design_token={dt} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "testimonials"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </MemoPreviewSectionWrapper>
    ) : null,
    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <MenuSectionInner menu={m} design_token={dt} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "menu"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,
    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(c) => (
          <CatalogSectionInner catalog={c} design_token={dt} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "catalog"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
        )} />
      </MemoPreviewSectionWrapper>
    ) : null,
    faq: (
      <MemoPreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={faq} render={(f) => (
          <FaqSectionInner
            faq={f}
            design_token={dt}
            language={language}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "faq"}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    cta: (
      <MemoPreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={cta} render={(c) => (
          <section className="py-16 px-6 border-y-4 border-black text-center" style={{ background: black }}>
            <div className="max-w-2xl mx-auto space-y-6">
              {c.eyebrow && <InlineText section="cta" fieldKey="eyebrow" value={c.eyebrow} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} as="span" className="inline-block border-2 border-yellow-300 text-yellow-300 text-[10px] font-black uppercase px-2.5 py-1" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
              <InlineText section="cta" fieldKey="headline" value={c.headline} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} multiline as="h2" className="text-2xl md:text-4xl font-black uppercase leading-tight" style={{ color: yellow, ...headingVars }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
              {c.subheadline && <InlineText section="cta" fieldKey="subheadline" value={c.subheadline} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} multiline as="p" className="text-sm font-bold" style={{ color: "#ccc" }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
              <a href={c.button_url} className={`inline-flex items-center gap-2 px-8 py-4 border-4 font-black text-sm uppercase tracking-wider transition-all ${shadowBlock} hover:translate-y-0.5`} style={{ borderColor: yellow, background: yellow, color: ctaText }}>
                <InlineText section="cta" fieldKey="button_text" value={c.button_text} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} /> <ArrowRight className="w-4 h-4 stroke-[3]" />
              </a>
              {c.trust_signal && <InlineText section="cta" fieldKey="trust_signal" value={c.trust_signal} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "cta"} multiline as="p" className="text-[11px] font-bold" style={{ color: "#999" }} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    contact: (
      <MemoPreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={contact} render={(c) => (
          <ContactSectionInner
            contact={c}
            design_token={dt}
            onSubmitLead={onSubmitLead}
            leadSubmitting={leadSubmitting}
            leadSuccess={leadSuccess}
            leadError={leadError}
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
    gallery: gallery ? (
      <MemoPreviewSectionWrapper section="gallery" label="Galeri" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ gallery, dt }} render={(data) => {
          const { gallery: g, dt: d } = data;
          return <GallerySection gallery={g} design_token={d} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "gallery"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />;
        }} />
      </MemoPreviewSectionWrapper>
    ) : null,
  };

  return (
    <CartProvider waPhone={contact?.phone ?? ""} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#4F46E5"} primaryFg={dt?.palette?.primary ? undefined : "#ffffff"}>
    <div style={{ ...cssVars, background: bg, color: "var(--dt-text)", fontFamily: "var(--dt-body-font)", minHeight: "100vh", overflowX: "hidden", containerType: "inline-size" }}>
      {(() => {
        const renderedSectionOrder = filterEmptySections(sectionOrder, content, isEditorMode)
          .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
          .filter(k => !arrivedSections || arrivedSections.includes(k));
        return (
          <>
            <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
              <HeaderSection header={header} design_token={dt} sectionOrder={renderedSectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "header"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
            </MemoPreviewSectionWrapper>

            {renderedSectionOrder.map((k) => {
              const arrivedIndex = arrivedSections?.indexOf(k) ?? -1;
              const isStreaming = arrivedSections !== undefined && arrivedIndex !== -1;
              return (
                <div
                  key={k}
                  id={`section-${k}`}
                  className={isStreaming ? "animate-slide-up" : ""}
                  style={isStreaming ? {
                    animationDelay: `${arrivedIndex * 60}ms`,
                    animationFillMode: "both",
                  } : undefined}
                >
                  {sectionNodes[k] ?? null}
                </div>
              );
            })}
          </>
        );
      })()}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} contactAddress={contact?.address} contactMapsUrl={contact?.maps_url ?? undefined} contactOpeningHours={contact?.opening_hours} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "footer"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      <CartFab colorStyle={{ background: pink, color: ctaText }} />
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={header?.brand_name} isPremium={isPremium} floatingType={design_token?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
