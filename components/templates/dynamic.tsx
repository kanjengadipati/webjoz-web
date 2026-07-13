"use client";

import React from "react";
import { MemoPreviewSectionWrapper, MemoSectionContent } from "./editor";
import {
  WAFloatingButton, BackToTop, SeoEditorPreview, CartFab,
  CartProvider,
} from "./shared";
import { BlogPostsSection } from "./blog-section";

import { buildCssVars, loadGoogleFont, filterEmptySections } from "./helpers";
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
import GallerySection from "../sections/gallery";
import HeaderSection from "../sections/header";
import FooterSection from "../sections/footer";

// Phase 3: Dual-schema support — normalize flat content to sections[] format
// Phase 4: Layout engine defaults
const ENGINE_ORDER: Record<string, string[]> = {
  default: ["hero", "about", "benefits", "gallery", "cta", "faq", "contact"],
  storytelling: ["hero", "about", "testimonials", "gallery", "faq", "cta", "contact"],
  showcase: ["hero", "benefits", "catalog", "menu", "gallery", "testimonials", "cta", "contact"],
  minimal: ["hero", "contact"],
};

function normalizeContent(content: TemplateProps["content"], dt: DesignToken | null): ContentSection[] {
  if (content.sections && content.sections.length > 0) {
    return content.sections;
  }

  const engine = dt?.layout?.engine || "default";
  const baseOrder: string[] = dt?.layout?.section_order ?? ENGINE_ORDER[engine] ?? ENGINE_ORDER.default;
  const extras = (["menu", "catalog", "testimonials", "gallery", "blog"] as const).filter(
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
  activeSection, onSelectSection, onRegenSection, isEditorMode = false, arrivedSections, isPremium = false
}) => {
  const dt = design_token ?? null;
  const { header, footer, seo } = content;
  const cssVars = buildCssVars(dt);

  const rawSections = normalizeContent(content, dt);
  const resolvedSections = React.useMemo(() => {
    const order = rawSections.map((s) => s.type);
    const filteredOrder = filterEmptySections(order, content, isEditorMode);
    return rawSections.filter((s) => filteredOrder.includes(s.type));
  }, [rawSections, content, isEditorMode]);
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
      gallery: "Galeri", blog: "Blog",
    };
    const label = labelMap[key] || key;

    switch (key) {
      case "hero": {
        const h = sec.data as TemplateProps["content"]["hero"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ hero: h, dt }} render={(data) => {
              const { hero: hh, dt: dd } = data;
              return <HeroSection hero={hh} design_token={dt} />;
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
              return <AboutSectionInner about={aa} design_token={dt} />;
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
              return <BenefitsSectionInner benefits={bb} design_token={dt} />;
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
              return <FaqSectionInner faq={ff} design_token={dt} />;
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
              return <CtaSectionInner cta={cc} design_token={dt} />;
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
              return <ContactSectionInner contact={cc} design_token={dt} onSubmitLead={osl} leadSubmitting={ls} leadSuccess={lsc} leadError={le} />;
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
              return <TestimonialsSectionInner testimonials={tt} design_token={dt} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "menu": {
        const m = sec.data as TemplateProps["content"]["menu"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ menu: m, dt }} render={(data) => {
              const { menu: mm } = data;
              return <MenuSectionInner menu={mm} design_token={dt} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "catalog": {
        const c = sec.data as TemplateProps["content"]["catalog"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ catalog: c, dt }} render={(data) => {
              const { catalog: cc } = data;
              return <CatalogSectionInner catalog={cc} design_token={dt} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "gallery": {
        const g = sec.data as TemplateProps["content"]["gallery"];
        return (
          <MemoPreviewSectionWrapper key={key} section={key} label={label} activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
            <MemoSectionContent content={{ gallery: g, dt }} render={(data) => {
              const { gallery: gg } = data;
              return <GallerySection gallery={gg} design_token={dt} />;
            }} />
          </MemoPreviewSectionWrapper>
        );
      }
      case "blog": {
        const b = sec.data as TemplateProps["content"]["blog"];
        return (
          <BlogPostsSection posts={b?.posts ?? []} layout={content.blog_layout} />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div style={rootStyle}>
      <MemoPreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <HeaderSection header={header} design_token={dt} sectionOrder={sectionOrder} hiddenSections={dt?.layout?.hidden_sections} />
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
                opacity: 0,
                animationFillMode: "forwards",
              } : undefined}
            >
              {renderSectionFromContent(sec)}
            </div>
          );
        })}

      <MemoPreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <FooterSection footer={footer ?? {}} design_token={dt} brand_name={header?.brand_name} hasBlog={!!(content.blog?.posts?.length)} />
      </MemoPreviewSectionWrapper>

      {isEditorMode && (
        <MemoPreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <MemoSectionContent content={{ seo, dt }} render={(data) => {
            const { seo: s } = data;
            return <SeoEditorPreview seo={s} />;
          }} />
        </MemoPreviewSectionWrapper>
      )}
      <CartFab />
      <WAFloatingButton phone={content?.contact?.phone} isEditorMode={isEditorMode} onSubmitLead={onSubmitLead} brandName={content?.header?.brand_name} isPremium={isPremium} floatingType={dt?.layout?.floating_button} />
      <BackToTop isEditorMode={isEditorMode} />
    </div>
  );
};

export function TemplateDynamicWithCart(props: TemplateProps & { previewMode?: boolean }) {
  const waPhone = props.content?.contact?.phone ?? "";
  const brandName = props.content?.header?.brand_name;
  const { onSubmitLead } = props;
  return (
    <CartProvider waPhone={waPhone} brandName={brandName} previewMode={props.previewMode} onSubmitLead={onSubmitLead} primaryColor={props.design_token?.palette?.primary ?? "#4F46E5"}>
      <TemplateDynamic {...props} />
    </CartProvider>
  );
}
