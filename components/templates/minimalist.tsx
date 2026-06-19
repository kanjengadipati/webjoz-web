"use client";

import React from "react";
import { ArrowRight, MapPin, Phone, Mail, ChevronDown, Utensils, Image as ImageIcon } from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage, LeadForm, TestimonialsSection, MenuCatalogCard,
  CartProvider, CartFab, WAFloatingButton, BackToTop,
  SeoEditorPreview, navCtaHref,
  ContactSection,
} from "./shared";
import type { TemplateProps } from "./types";

export const TemplateMinimalist: React.FC<TemplateProps> = ({
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

  const bg = "#FAFAFA";
  const surface = "#FFFFFF";
  const zinc900 = "#18181B";
  const zinc500 = "#71717A";
  const zinc200 = "#E4E4E7";
  const zinc100 = "#F4F4F5";

  const sectionNodes: Record<string, React.ReactNode> = {
    hero: (
      <MemoPreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={hero} render={(h) => (
          <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto space-y-8">
            {h.eyebrow && <span className="text-xs font-semibold tracking-widest uppercase block" style={{ color: zinc500 }}>{h.eyebrow}</span>}
            <h1 className="text-4xl md:text-7xl font-light tracking-tight leading-none" style={{ color: zinc900 }}>
              {h.headline}
            </h1>
            <div className="w-12 h-px" style={{ background: zinc900 }} />
            <p className="text-sm md:text-base font-light leading-relaxed max-w-2xl" style={{ color: zinc500 }}>{h.subheadline}</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a href={h.cta_url} className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-70" style={{ background: zinc900, color: "#fff" }}>
                {h.cta_text} <ArrowRight className="w-4 h-4" />
              </a>
              {h.cta_secondary_text && (
                <a href="#about" className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-widest border transition-all hover:opacity-70" style={{ borderColor: zinc900, color: zinc900 }}>
                  {h.cta_secondary_text}
                </a>
              )}
            </div>
            {h.image_url && (
              <div className="pt-8">
                <img src={h.image_url} alt={h.headline} className="w-full max-h-[480px] object-cover" style={{ filter: "grayscale(15%)" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            )}
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    about: (
      <MemoPreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={about} render={(a) => (
          <section id="about" className="py-16 px-6 md:px-12 border-y" style={{ background: zinc100, borderColor: zinc200 }}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                {a.eyebrow && <span className="text-[10px] font-semibold uppercase tracking-widest block" style={{ color: zinc500 }}>{a.eyebrow}</span>}
                <h2 className="text-2xl md:text-3xl font-light tracking-tight" style={{ color: zinc900 }}>{a.title}</h2>
                <p className="text-sm font-light leading-relaxed" style={{ color: zinc500 }}>{a.body}</p>
                {(a.highlight_stat_1 || a.highlight_stat_2 || a.highlight_stat_3) && (
                  <div className="grid grid-cols-3 gap-6 pt-4 border-t" style={{ borderColor: zinc200 }}>
                    {[a.highlight_stat_1, a.highlight_stat_2, a.highlight_stat_3].filter(Boolean).map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-2xl font-light" style={{ color: zinc900 }}>{stat!.value}</p>
                        <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: zinc500 }}>{stat!.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {a.image_url && (
                <img src={a.image_url} alt={a.title} className="w-full h-72 object-cover" style={{ filter: "grayscale(10%)" }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              )}
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    benefits: (
      <MemoPreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={benefits} render={(b) => (
          <section id="benefits" className="py-16 px-6 md:px-12" style={{ background: surface }}>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="space-y-3">
                {b.eyebrow && <span className="text-[10px] font-semibold uppercase tracking-widest block" style={{ color: zinc500 }}>{b.eyebrow}</span>}
                <h2 className="text-2xl md:text-3xl font-light tracking-tight" style={{ color: zinc900 }}>{b.title}</h2>
                {b.subtitle && <p className="text-sm font-light" style={{ color: zinc500 }}>{b.subtitle}</p>}
              </div>
              <div className="grid md:grid-cols-3 gap-0 border-l border-t" style={{ borderColor: zinc200 }}>
                {b.items?.map((item, idx) => (
                  <div key={idx} className="p-8 border-r border-b space-y-4 hover:bg-zinc-50 transition-colors" style={{ borderColor: zinc200 }}>
                    <span className="text-[10px] font-mono font-semibold" style={{ color: zinc500 }}>0{idx + 1}</span>
                    <h3 className="text-base font-medium" style={{ color: zinc900 }}>{item.title}</h3>
                    <p className="text-xs font-light leading-relaxed" style={{ color: zinc500 }}>{item.description}</p>
                    {item.stat && <div className="pt-2"><span className="text-xl font-light" style={{ color: zinc900 }}>{item.stat}</span><span className="text-[10px] font-mono ml-1.5" style={{ color: zinc500 }}>{item.stat_label}</span></div>}
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
        <TestimonialsSection
          testimonials={testimonials}
          bgClass="py-16 px-6 md:px-12"
          sectionStyle={{ background: zinc100, borderTop: `1px solid ${zinc200}`, borderBottom: `1px solid ${zinc200}` }}
          headingClass="text-2xl md:text-3xl font-light tracking-tight"
          eyebrowClass="text-[10px] font-semibold uppercase tracking-widest"
          cardClass="border"
          cardStyle={{ background: surface, borderColor: zinc200 }}
          quoteClass="text-sm font-light leading-relaxed"
          nameClass="text-sm font-medium"
          roleClass="text-xs font-light"
        />
      </MemoPreviewSectionWrapper>
    ) : null,
    menu: menu ? (
      <MemoPreviewSectionWrapper section="menu" label="Menu" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={menu} render={(m) => (
          <section id="menu" className="py-16 px-6 md:px-12 border-y" style={{ background: surface, borderColor: zinc200 }}>
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: zinc500 }}>Menu</p>
                <h2 className="text-2xl font-light tracking-tight" style={{ color: zinc900 }}>{m.title}</h2>
              </div>
              {m.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest border-b pb-2" style={{ color: zinc500, borderColor: zinc200 }}>{cat.name}</h3>
                  <div className="divide-y" style={{ borderColor: zinc200 }}>
                    {cat.items?.map((item, ii) => (
                      <MenuCatalogCard
                        key={ii}
                        itemId={`menu-${ci}-${ii}`}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        category={cat.name}
                        image_url={item.image_url}
                        icon={Utensils}
                        layout="compact"
                        className="py-4 flex items-center justify-between gap-4 group"
                        imageClassName="w-16 h-16 object-cover flex-shrink-0"
                        placeholderClassName="w-16 h-16 flex items-center justify-center flex-shrink-0"
                        placeholderStyle={{ background: zinc100 }}
                        placeholderIconClassName="w-6 h-6"
                        placeholderIconStyle={{ color: zinc500 }}
                        contentClassName="min-w-0 flex-1"
                        headerClassName="flex items-start justify-between gap-4"
                        titleClassName="text-sm font-medium"
                        titleStyle={{ color: zinc900 }}
                        descriptionClassName="text-xs font-light mt-0.5"
                        descriptionStyle={{ color: zinc500 }}
                        priceClassName="text-sm font-light whitespace-nowrap"
                        priceStyle={{ color: zinc900 }}
                        buttonClassName="flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-medium uppercase tracking-wider transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-900"
                        buttonStyle={{ borderColor: zinc200, color: zinc500 }}
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
        <MemoSectionContent content={catalog} render={(c) => (
          <section id="catalog" className="py-16 px-6 md:px-12 border-y" style={{ background: surface, borderColor: zinc200 }}>
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: zinc500 }}>Katalog</p>
                <h2 className="text-2xl font-light tracking-tight" style={{ color: zinc900 }}>{c.title}</h2>
              </div>
              {c.categories?.map((cat, ci) => (
                <div key={ci} className="space-y-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest border-b pb-2" style={{ color: zinc500, borderColor: zinc200 }}>{cat.name}</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px" style={{ background: zinc200 }}>
                    {cat.items?.map((item, ii) => (
                      <MenuCatalogCard
                        key={ii}
                        itemId={`cat-${ci}-${ii}`}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        category={cat.name}
                        image_url={item.image_url}
                        badge={item.badge}
                        icon={ImageIcon}
                        className="p-6 space-y-3 hover:bg-zinc-50 transition-colors group"
                        style={{ background: surface }}
                        imageClassName="w-full h-44 object-cover"
                        placeholderClassName="w-full h-44 flex items-center justify-center"
                        placeholderStyle={{ background: zinc100 }}
                        placeholderIconClassName="w-10 h-10"
                        placeholderIconStyle={{ color: zinc500 }}
                        contentClassName="space-y-3"
                        headerClassName="flex items-start justify-between gap-2"
                        titleClassName="text-sm font-medium"
                        titleStyle={{ color: zinc900 }}
                        descriptionClassName="text-xs font-light"
                        descriptionStyle={{ color: zinc500 }}
                        priceClassName="text-sm font-light"
                        priceStyle={{ color: zinc900 }}
                        badgeClassName="text-[9px] font-semibold uppercase tracking-widest"
                        badgeStyle={{ color: zinc500 }}
                        buttonClassName="flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-medium uppercase tracking-wider transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-900"
                        buttonStyle={{ borderColor: zinc200, color: zinc500 }}
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
          <section id="faq" className="py-16 px-6 md:px-12" style={{ background: zinc100 }}>
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-2xl font-light tracking-tight" style={{ color: zinc900 }}>{f.title}</h2>
              <div className="divide-y" style={{ borderColor: zinc200 }}>
                {f.items?.map((item, idx) => (
                  <details key={idx} className="py-5 group">
                    <summary className="text-sm font-medium cursor-pointer list-none flex justify-between items-center" style={{ color: zinc900 }}>
                      {item.question}
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" style={{ color: zinc500 }} />
                    </summary>
                    <p className="mt-4 text-sm font-light leading-relaxed" style={{ color: zinc500 }}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    cta: (
      <MemoPreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={cta} render={(c) => (
          <section className="py-20 px-6 md:px-12" style={{ background: zinc900 }}>
            <div className="max-w-5xl mx-auto space-y-6">
              {c.eyebrow && <span className="text-[10px] font-semibold uppercase tracking-widest block" style={{ color: zinc500 }}>{c.eyebrow}</span>}
              <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-tight max-w-2xl" style={{ color: "#F4F4F5" }}>{c.headline}</h2>
              {c.subheadline && <p className="text-sm font-light max-w-xl" style={{ color: zinc500 }}>{c.subheadline}</p>}
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <a href={c.button_url} className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-80" style={{ background: "#F4F4F5", color: zinc900 }}>
                  {c.button_text} <ArrowRight className="w-4 h-4" />
                </a>
                {c.trust_signal && <span className="text-[11px] font-light self-center" style={{ color: zinc500 }}>{c.trust_signal}</span>}
              </div>
            </div>
          </section>
        )} />
      </MemoPreviewSectionWrapper>
    ),
    contact: (
      <MemoPreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={contact} render={(c) => (
          <ContactSection
            title={c.title}
            address={c.address}
            phone={c.phone}
            email={c.email}
            mapsUrl={c.maps_url}
            showLeadForm={c.show_lead_form}
            onSubmitLead={onSubmitLead}
            leadSubmitting={leadSubmitting}
            leadSuccess={leadSuccess}
            leadError={leadError}
            wrapperClass="py-16 px-6 md:px-12 border-t"
            wrapperStyle={{ background: surface, borderColor: zinc200 }}
            titleClass="text-2xl font-light tracking-tight"
            titleStyle={{ color: zinc900 }}
            accentColor={zinc500}
            textClass="text-sm font-light"
            textStyle={{ color: zinc500 }}
            leadCardClass=""
            leadCardStyle={{}}
            leadTitleText=""
            leadFormBtnClass="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-widest"
            leadFormInputClass="w-full border border-zinc-200 p-3 text-sm font-light focus:outline-none focus:ring-1 focus:ring-zinc-400 bg-white"
            phoneBtnClass="font-semibold text-sm rounded-sm"
            phoneBtnStyle={{ background: "#18181b", color: "#ffffff" }}
          />
        )} />
      </MemoPreviewSectionWrapper>
    ),
  };

  return (
    <CartProvider waPhone={contact?.phone ?? ""} brandName={header?.brand_name} previewMode={isEditorMode}>
    <div style={{ background: bg, color: zinc900, fontFamily: "'Inter', 'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Header */}
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand_name: header?.brand_name, nav_cta_text: header?.nav_cta_text, logo_url: header?.logo_url, tagline: header?.tagline, _hidden: dt?.layout?.hidden_sections }} render={(h) => (
          <header className="sticky top-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between gap-4 relative border-b" style={{ background: `${surface}F0`, borderColor: zinc200, backdropFilter: "blur(8px)" }}>
            <span className="flex shrink-0 items-center gap-3 text-sm font-medium tracking-widest uppercase" style={{ color: zinc900 }}>
              <LogoImage url={h.logo_url} icon={undefined} defaultIcon={ImageIcon} iconClass="h-8 w-8 shrink-0" imgClass="h-8 w-8 shrink-0 rounded-full object-cover" />
              <span className="min-w-0">
                <span className="block truncate">{h.brand_name}</span>
                {h.tagline && <span className="block text-[9px] font-light uppercase tracking-widest" style={{ color: zinc500 }}>{h.tagline}</span>}
              </span>
            </span>
            <NavMenu sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} linkClass="text-zinc-600 text-xs tracking-widest uppercase font-medium" drawerStyle={{ background: surface, borderTop: `1px solid ${zinc200}` }} />
            <a href={navCtaHref(h.nav_cta_text)} className="px-4 py-2 border text-[10px] font-semibold uppercase tracking-widest transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-900" style={{ borderColor: zinc900, color: zinc900 }}>
              {h.nav_cta_text || "Hubungi"}
            </a>
          </header>
        )} />
      </MemoPreviewSectionWrapper>

      {sectionOrder
        .filter(k => !(dt?.layout?.hidden_sections ?? []).includes(k))
        .filter(k => !arrivedSections || arrivedSections.includes(k))
        .map(k => <div key={k} className="animate-slide-up">{sectionNodes[k] ?? null}</div>)}

      {/* Footer */}
      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ brand: header?.brand_name, copyright_text: footer?.copyright_text }} render={(f) => (
          <footer className="py-8 px-6 md:px-12 border-t flex items-center justify-between" style={{ background: bg, borderColor: zinc200 }}>
            <p className="text-[10px] font-light uppercase tracking-widest" style={{ color: zinc500 }}>{f.copyright_text || `© ${new Date().getFullYear()} ${f.brand}`}</p>
            <span className="text-[9px] font-mono" style={{ color: zinc500 }}>Made with care</span>
          </footer>
        )} />
      </MemoPreviewSectionWrapper>
      {isEditorMode && <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}><MemoSectionContent content={seo} render={(s) => <SeoEditorPreview seo={s} />} /></MemoPreviewSectionWrapper>}
      {!isEditorMode && <CartFab colorStyle={{ background: zinc900, color: "#fff" }} />}
      <WAFloatingButton phone={contact?.phone} isEditorMode={isEditorMode} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
    </CartProvider>
  );
};
