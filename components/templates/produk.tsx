"use client";

import React from "react";
import { Globe, ArrowRight, Image as ImageIcon } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  DynamicIcon, LeadForm, TestimonialsSection,
  MenuCatalogCard, CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, FaqAccordion, ctaHref,
  ContactSection, BenefitsSection, InlineText, InlineImage,
} from "./shared";
import { buildCssVars, loadGoogleFont, headingVars, filterEmptySections } from "./helpers";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";
import GallerySection from "../sections/gallery";
import HeroBentoGrid from "../sections/hero/bento-grid";
import { BlogPostsSection } from "./blog-section";
import PhotoCredit from "../sections/PhotoCredit";
import type { TemplateProps } from "./types";

export const TemplateProduk: React.FC<TemplateProps> = ({
  content, design_token, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, onUpdateField, collapseSheetForInlineEdit, onEditingStateChange,
  isEditorMode = false, arrivedSections, isPremium = false, language
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo, catalog, testimonials, gallery, blog, blog_layout } = content;
  const dt = design_token ?? null;
  const cssVars = buildCssVars(dt);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const sectionOrder = (() => {
    const base: string[] = dt?.layout?.section_order ?? ["hero", "catalog", "about", "benefits", "testimonials", "faq", "cta", "contact"];
    const order = [...base];
    if (gallery && !order.includes("gallery")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "gallery");
    }
    if (blog && blog.posts?.length && !order.includes("blog")) {
      const idx = order.indexOf("cta") >= 0 ? order.indexOf("cta") : order.indexOf("faq") >= 0 ? order.indexOf("faq") : order.length;
      order.splice(idx, 0, "blog");
    }
    return order;
  })();

  const sectionNodes = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(hero) => (
          <HeroBentoGrid
            hero={{ ...hero, cta_url: ctaHref(contact.phone, hero.cta_url) }}
            design_token={dt}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "hero"}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(about) => (
          <section className="px-6 py-[var(--dt-spacing)] max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="about">
            <div className="space-y-6" style={{ textAlign: about.textAlign || "left" }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--dt-primary)] to-[var(--dt-accent)] font-extrabold tracking-wider uppercase text-xs block">Misi Kami</span>
              <InlineText
                section="about"
                fieldKey="title"
                value={about.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "about"}
                as="h2"
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
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
                className="text-slate-300 leading-relaxed sm:text-justify whitespace-pre-line"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--dt-primary)] to-[var(--dt-accent)] rounded-[var(--dt-radius-lg)] opacity-10 filter blur-xl"></div>
              <div className="w-full h-80 md:h-[400px] bg-slate-900/50 border border-slate-800 rounded-[var(--dt-radius-lg)] shadow-xl relative z-10 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-[var(--dt-radius)] flex items-center justify-center mx-auto border" style={{ background: "color-mix(in srgb, var(--dt-primary) 15%, #0f172a)", color: "var(--dt-primary)", borderColor: "color-mix(in srgb, var(--dt-primary) 40%, transparent)", boxShadow: "0 0 15px color-mix(in srgb, var(--dt-primary) 15%, transparent)" }}>
                      <DynamicIcon name={about.icon} defaultIcon={Globe} className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-white text-xl">Inovasi Global</p>
                    <p className="text-slate-300 text-sm max-w-xs leading-relaxed">
                      Kami membangun produk berkualitas tinggi dengan riset mendalam demi memberikan pengalaman terbaik.
                    </p>
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
                      className="w-full h-full object-cover absolute inset-0 z-10"
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
            wrapperClass="bg-slate-900/30 border-y border-slate-900 px-6 py-[var(--dt-spacing)]"
            eyebrowClass="font-extrabold tracking-wider uppercase text-xs"
            eyebrowStyle={{ color: "var(--dt-primary)" }}
            titleClass="text-3xl md:text-4xl font-bold tracking-tight text-white"
            cardClass="bg-slate-900 border border-slate-800 hover:border-[var(--dt-primary)] p-8 rounded-[var(--dt-radius-lg)] transition-all duration-300 group"
            iconContainerClass="w-12 h-12 rounded-[var(--dt-radius)] flex items-center justify-center mb-6 border"
            iconContainerStyle={{ background: "color-mix(in srgb, var(--dt-primary) 15%, #0f172a)", color: "var(--dt-primary)", borderColor: "color-mix(in srgb, var(--dt-primary) 30%, transparent)" }}
            iconClass="w-5 h-5"
            cardTitleClass="text-xl font-bold text-white mb-3"
            cardDescClass="text-slate-300 text-sm leading-relaxed"
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
          <section className="px-6 py-[var(--dt-spacing)] max-w-4xl mx-auto space-y-16" id="faq">
            <div className="text-center space-y-2">
              <span className="font-extrabold tracking-wider uppercase text-xs text-[var(--dt-primary)] block">Pusat Bantuan</span>
              <InlineText
                section="faq"
                fieldKey="title"
                value={faq.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={activeSection === "faq"}
                as="h2"
                className="text-3xl font-extrabold tracking-tight"
                style={headingVars}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </div>
            <div className="space-y-4">
              {faq.items?.map((item, idx) => (
                <FaqAccordion
                  key={idx}
                  item={item}
                  isDark={true}
                  onUpdateItem={(index, field, value) => {
                    const nextItems = [...(faq.items || [])];
                    nextItems[index] = { ...nextItems[index], [field]: value };
                    onUpdateField?.("faq", "items", nextItems);
                  }}
                  section="faq"
                  isEditorMode={isEditorMode}
                  isSelected={activeSection === "faq"}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
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
            <div className="relative bg-slate-900 border border-slate-800 p-8 md:p-16 rounded-[var(--dt-radius-lg)] text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[200px] rounded-full filter blur-[50px] md:blur-[100px]" style={{ background: "color-mix(in srgb, var(--dt-primary) 5%, transparent)" }}></div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <InlineText
                  section="cta"
                  fieldKey="headline"
                  value={cta.headline}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={activeSection === "cta"}
                  as="h2"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-white"
                  style={headingVars}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
                <div className="pt-4">
                  <a
                    href={cta.button_url}
                    className="min-h-11 px-8 py-4 bg-gradient-to-r from-[var(--dt-primary)] to-[var(--dt-accent)] hover:brightness-110 rounded-full font-bold shadow-lg transition-all inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-slate-900"
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
            wrapperClass="px-6 py-[var(--dt-spacing)] border-t border-slate-900"
            wrapperStyle={{ background: "#0f172a" }}
            titleClass="text-3xl font-extrabold tracking-tight text-white"
            accentColor={dt?.palette?.primary ?? "#22d3ee"}
            textClass="text-slate-300"
            leadCardClass="bg-slate-900 p-8 rounded-[var(--dt-radius-lg)] border border-slate-800 shadow-xl backdrop-blur-sm"
            leadTitleClass="text-lg font-bold text-white"
            leadTitleText={language === 'en' ? 'Contact Us Directly' : 'Hubungi Kami Langsung'}
            leadFormBtnClass="bg-gradient-to-r from-[var(--dt-primary)] to-[var(--dt-accent)] text-[var(--dt-cta-text)] rounded-[var(--dt-radius)]"
            leadFormInputClass="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-[var(--dt-primary)] focus:ring-1 focus:ring-[var(--dt-primary)] rounded-[var(--dt-radius)] outline-none text-sm text-slate-100 transition-all"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={activeSection === "contact"}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            formPosition={data.contact.form_position ?? "right"}
            language={language}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
    testimonials: testimonials ? (
      <MemoPreviewSectionWrapper section="testimonials" label="Testimoni" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <TestimonialsSection
          testimonials={testimonials}
          wrapperClass="bg-slate-950 border-y border-slate-800 py-[var(--dt-spacing)] px-6"
          titleClass="text-white font-extrabold tracking-tight"
          eyebrowClass="text-[var(--dt-primary)]"
          cardClass="bg-slate-900 border border-slate-800"
          quoteClass="text-slate-300"
          nameClass="text-white"
          roleClass="text-slate-500"
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={activeSection === "testimonials"}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      </MemoPreviewSectionWrapper>
    ) : null,
    catalog: catalog ? (
      <MemoPreviewSectionWrapper section="catalog" label="Katalog" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={catalog} render={(catalogData) => (
          <section className="relative px-5 sm:px-6 py-[var(--dt-spacing)] border-y border-slate-800 overflow-hidden" id="catalog" style={{ background: "linear-gradient(180deg, #0f172a, #0f172a, rgba(15,23,42,0.9))", backgroundImage: "radial-gradient(circle at top right, color-mix(in srgb, var(--dt-primary) 15%, transparent), transparent 35%), radial-gradient(circle at bottom left, color-mix(in srgb, var(--dt-accent) 12%, transparent), transparent 30%)" }}>
            <div className="max-w-7xl mx-auto space-y-12 relative">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em]" style={{ borderColor: "color-mix(in srgb, var(--dt-primary) 30%, transparent)", background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", color: "var(--dt-primary)" }}>Koleksi Produk</span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight" style={headingVars}>{catalogData.title}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, color-mix(in srgb, var(--dt-primary) 50%, transparent))` }} />
                  <span className="w-2 h-2 rotate-45" style={{ background: "var(--dt-primary)", boxShadow: "0 0 8px color-mix(in srgb, var(--dt-primary) 50%, transparent)" }} />
                  <span className="h-px w-12" style={{ background: `linear-gradient(90deg, color-mix(in srgb, var(--dt-primary) 50%, transparent), transparent)` }} />
                </div>
              </div>
              {catalogData.categories?.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, color-mix(in srgb, var(--dt-primary) 30%, transparent))` }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--dt-primary)", boxShadow: "0 0 6px color-mix(in srgb, var(--dt-primary) 60%, transparent)" }} />
                    <h3 className="px-4 py-2 rounded-full text-sm font-black uppercase tracking-[0.18em] whitespace-nowrap" style={{ background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)", color: "var(--dt-primary)" }}>{cat.name}</h3>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--dt-primary)", boxShadow: "0 0 6px color-mix(in srgb, var(--dt-primary) 60%, transparent)" }} />
                    <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, color-mix(in srgb, var(--dt-primary) 30%, transparent), transparent)` }} />
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
                          image_credit={item.image_credit}
                          badge={item.badge}
                          icon={ImageIcon}
                          className="group rounded-[var(--dt-radius-lg)] overflow-hidden transition-all duration-300 hover:shadow-xl"
                          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.8)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
                          imageClassName="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                          placeholderClassName="w-full h-56 flex items-center justify-center"
                          placeholderStyle={{ background: "linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8))" }}
                          placeholderIconClassName="w-12 h-12"
                          placeholderIconStyle={{ color: "color-mix(in srgb, var(--dt-primary) 25%, transparent)" }}
                          contentClassName="p-5 space-y-3 flex flex-col flex-1"
                          headerClassName="flex items-start justify-between gap-3"
                          titleClassName="font-bold text-white text-sm leading-tight group-hover:text-[var(--dt-primary)] transition-colors"
                          descriptionClassName="text-sm leading-relaxed flex-1"
                          descriptionStyle={{ color: "rgba(148,163,184,0.8)" }}
                          priceClassName="font-black text-sm whitespace-nowrap"
                          priceStyle={{ color: "var(--dt-primary)" }}
                          badgeClassName="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap"
                          badgeStyle={{ color: "var(--dt-cta-text)", background: "var(--dt-primary)" }}
                          buttonClassName="mt-auto w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-[var(--dt-radius)] text-xs font-black transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-1"
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
          return <GallerySection gallery={g} design_token={d} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "gallery"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />;
        }} />
      </MemoPreviewSectionWrapper>
    ) : null,
    blog: (blog?.posts?.length ?? 0) > 0 ? (
      <BlogPostsSection posts={blog!.posts!} layout={blog_layout} />
    ) : null,
  } as Record<string, React.ReactNode>;

  const waPhone = contact?.phone ?? "";

  return (
    <CartProvider waPhone={waPhone} brandName={header?.brand_name} previewMode={isEditorMode} onSubmitLead={onSubmitLead} primaryColor={dt?.palette?.primary ?? "#0e7490"} primaryFg="#ffffff">
    <div className="bg-slate-950 text-slate-100 overflow-x-hidden min-h-screen" style={{ ...cssVars, fontFamily: "var(--dt-body-font)", containerType: "inline-size" }}>
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <HeaderSection header={header} design_token={dt} sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} language={language} />
      </MemoPreviewSectionWrapper>

      {filterEmptySections(sectionOrder, content, isEditorMode)
        .filter((key) => !(dt?.layout?.hidden_sections ?? []).includes(key))
        .filter((key) => !arrivedSections || arrivedSections.includes(key))
        .map((key) => <div key={key} className="animate-slide-up">{sectionNodes[key] ?? null}</div>)}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} hasBlog={!!(blog?.posts?.length)} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={activeSection === "footer"} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
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
