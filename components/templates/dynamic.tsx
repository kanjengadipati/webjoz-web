"use client";

import React from "react";
import {
  Globe,
} from "lucide-react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  NavMenu, LogoImage,
  WAFloatingButton, BackToTop, SeoEditorPreview, navCtaHref, CartFab,
  CartProvider,
} from "./shared";

import { buildCssVars, loadGoogleFont } from "./helpers";
import type { TemplateProps, DesignToken, ContentSection } from "./types";

// Section components (Phase 1 extraction)
import HeroSection from "../sections/hero";
import AboutSectionInner from "../sections/about";
import BenefitsSectionInner from "../sections/benefits";
import FaqSectionInner from "../sections/faq";
import CtaSectionInner from "../sections/cta";
import ContactSectionInner from "../sections/contact";
import MenuSectionInner from "../sections/menu";
import CatalogSectionInner from "../sections/catalog";
import TestimonialsSectionInner from "../sections/testimonials";

// Phase 3: Dual-schema support — normalize flat content to sections[] format
// Phase 4: Layout engine defaults
const ENGINE_ORDER: Record<string, string[]> = {
  default: ["hero", "about", "benefits", "cta", "faq", "contact"],
  storytelling: ["hero", "about", "testimonials", "faq", "cta", "contact"],
  showcase: ["hero", "benefits", "catalog", "menu", "testimonials", "cta", "contact"],
  minimal: ["hero", "contact"],
};

function normalizeContent(content: TemplateProps["content"], dt: DesignToken | null): ContentSection[] {
  if (content.sections && content.sections.length > 0) {
    return content.sections;
  }

  const engine = dt?.layout?.engine || "default";
  const baseOrder: string[] = dt?.layout?.section_order ?? ENGINE_ORDER[engine] ?? ENGINE_ORDER.default;
  const extras = (["menu", "catalog", "testimonials"] as const).filter(
    (key) => content[key] && !baseOrder.includes(key)
  );
  const order = (() => {
    if (extras.length === 0) return baseOrder;
    const o = [...baseOrder];
    const insertBefore = o.indexOf("cta") >= 0 ? o.indexOf("cta") : o.indexOf("faq") >= 0 ? o.indexOf("faq") : -1;
    if (insertBefore >= 0) { o.splice(insertBefore, 0, ...extras); } else { o.push(...extras); }
    return o;
  })();

  return order
    .filter((key) => content[key as keyof typeof content])
    .map((key) => ({ type: key, data: content[key as keyof typeof content] as Record<string, any> }));
}

// ─── TemplateDynamic ────────────────────────────────────────────────────────

export const TemplateDynamic: React.FC<TemplateProps> = ({
  content, design_token,
  onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections
}) => {
  const dt = design_token ?? null;
  const { header, footer, seo } = content;
  const cssVars = buildCssVars(dt);

  const resolvedSections = normalizeContent(content, dt);
  const sectionOrder = resolvedSections.map((s) => s.type);

  React.useEffect(() => {
    loadGoogleFont(dt?.typography?.heading_font, dt?.typography?.body_font);
  }, [dt?.typography?.heading_font, dt?.typography?.body_font]);

  const rootStyle: any = {
    ...cssVars,
    fontFamily: "var(--dt-body-font)",
    background: "var(--dt-bg)",
    color: "var(--dt-text)",
    minHeight: "100vh",
    overflowX: "hidden",
    containerType: "inline-size",
  };

  const renderSectionFromContent = (sec: ContentSection) => {
    const key = sec.type;
    const labelMap: Record<string, string> = {
      hero: "Hero", about: "Tentang", benefits: "Keunggulan",
      faq: "FAQ", cta: "CTA", contact: "Kontak",
      testimonials: "Testimoni", menu: "Menu", catalog: "Katalog",
    };
    const label = labelMap[key] || key;

    switch (key) {
      case "hero": {
        const h = sec.data as TemplateProps["content"]["hero"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ hero: h, dt }} render={(data) => {
              const { hero: hh, dt: dd } = data;
              return <HeroSection hero={hh} design_token={dd} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "about": {
        const a = sec.data as TemplateProps["content"]["about"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ about: a, dt }} render={(data) => {
              const { about: aa } = data;
              return <AboutSectionInner about={aa} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "benefits": {
        const b = sec.data as TemplateProps["content"]["benefits"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ benefits: b, dt }} render={(data) => {
              const { benefits: bb } = data;
              return <BenefitsSectionInner benefits={bb} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "faq": {
        const f = sec.data as TemplateProps["content"]["faq"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ faq: f, dt }} render={(data) => {
              const { faq: ff } = data;
              return <FaqSectionInner faq={ff} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "cta": {
        const c = sec.data as TemplateProps["content"]["cta"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ cta: c, dt }} render={(data) => {
              const { cta: cc } = data;
              return <CtaSectionInner cta={cc} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "contact": {
        const c = sec.data as TemplateProps["content"]["contact"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ contact: c, onSubmitLead, leadSubmitting, leadSuccess, leadError, dt }} render={(data) => {
              const { contact: cc, onSubmitLead: osl, leadSubmitting: ls, leadSuccess: lsc, leadError: le } = data;
              return <ContactSectionInner contact={cc} onSubmitLead={osl} leadSubmitting={ls} leadSuccess={lsc} leadError={le} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "testimonials": {
        const t = sec.data as TemplateProps["content"]["testimonials"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ testimonials: t, dt }} render={(data) => {
              const { testimonials: tt } = data;
              return <TestimonialsSectionInner testimonials={tt} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "menu": {
        const m = sec.data as TemplateProps["content"]["menu"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={m} render={(menuData) => (
              <MenuSectionInner menu={menuData} />
            )} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "catalog": {
        const c = sec.data as TemplateProps["content"]["catalog"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={c} render={(catalogData) => (
              <CatalogSectionInner catalog={catalogData} />
            )} />
          </MemoPreviewSectionWrapper>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div style={rootStyle}>
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ header, dt }} render={(data) => {
          const { header: h } = data;
          return (
            <header className="sticky top-0 z-50 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-2 md:gap-4 relative" style={{ background: `color-mix(in srgb, var(--dt-bg) 85%, transparent)`, borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)` }}>
              <span className="flex items-center gap-1.5 md:gap-2 min-w-0 text-sm md:text-lg font-bold" style={{ display: "flex", alignItems: "center", fontFamily: "var(--dt-heading-font)", color: "var(--dt-text)" }}>
                <LogoImage url={h?.logo_url} icon={h?.icon} defaultIcon={Globe} iconClass="shrink-0" imgClass="h-8 w-auto shrink-0 object-contain" />
                <span style={{ overflow: "hidden" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{h?.brand_name || "Brand Kami"}</span>
                  {h?.tagline && <span style={{ display: "block", fontSize: "0.65rem", fontFamily: "var(--dt-body-font)", color: "var(--dt-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.tagline}</span>}
                </span>
              </span>
              <NavMenu
                sectionOrder={sectionOrder}
                hiddenSections={dt?.layout?.hidden_sections}
                linkClass=""
                drawerStyle={{ background: "var(--dt-surface, #fff)", borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)` }}
              />
              <a href={navCtaHref(h?.nav_cta_text)} className="px-3 py-1.5 md:px-5 md:py-2 text-[11px] md:text-sm font-semibold flex-shrink-0 transition-opacity hover:opacity-85" style={{ background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {h?.nav_cta_text || "Hubungi Kami"}
              </a>
            </header>
          );
        }} />
      </MemoPreviewSectionWrapper>

      {resolvedSections
        .filter((sec) => !(dt?.layout?.hidden_sections ?? []).includes(sec.type))
        .filter((sec) => !arrivedSections || arrivedSections.includes(sec.type))
        .map((sec) => {
          const arrivedIndex = arrivedSections?.indexOf(sec.type) ?? -1;
          const isStreaming = arrivedSections !== undefined && arrivedIndex !== -1;
          return (
            <div
              key={sec.type}
              className={isStreaming ? "animate-slide-up" : ""}
              style={isStreaming ? {
                animationDelay: `${arrivedIndex * 60}ms`,
              } : undefined}
            >
              {renderSectionFromContent(sec)}
            </div>
          );
        })}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <MemoSectionContent content={{ footer, brand_name_fallback: header?.brand_name, dt }} render={(data) => {
          const { footer: f, brand_name_fallback: bFallback } = data;
          const displayBrand = f?.brand_name || bFallback || "Bisnis Kami";
          const displayTagline = f?.tagline || "Memberikan layanan dan produk terbaik untuk memenuhi kebutuhan Anda";
          return (
            <footer style={{
              background: "color-mix(in srgb, var(--dt-bg) 95%, var(--dt-text))",
              color: "var(--dt-text-muted)",
              textAlign: "center",
              padding: "2.5rem 1.5rem",
              borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
              fontSize: "0.8rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem"
            }}>
              <p style={{ fontWeight: 700, color: "var(--dt-text)", margin: 0 }}>{displayBrand}</p>
              <p style={{ color: "var(--dt-text-muted)", margin: 0, opacity: 0.85 }}>{displayTagline}</p>
              <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.7 }}>
                {f?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}
              </p>
            </footer>
          );
        }} />
      </MemoPreviewSectionWrapper>

      {isEditorMode && (
        <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ seo, dt }} render={(data) => {
            const { seo: s } = data;
            return <SeoEditorPreview seo={s} />;
          }} />
        </MemoPreviewSectionWrapper>
      )}
      {!isEditorMode && <CartFab />}
      <WAFloatingButton phone={content?.contact?.phone} isEditorMode={isEditorMode} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
  );
};

export function TemplateDynamicWithCart(props: TemplateProps & { previewMode?: boolean }) {
  const waPhone = props.content?.contact?.phone ?? "";
  const brandName = props.content?.header?.brand_name;
  return (
    <CartProvider waPhone={waPhone} brandName={brandName} previewMode={props.previewMode}>
      <TemplateDynamic {...props} />
    </CartProvider>
  );
}
