"use client";

import React from "react";
import type { DesignToken } from "@/components/templates/types";
import { MOCK_SHOWCASE_DATA, getShowcaseHero } from "../mock-data";

// Section Components
import HeroSection from "@/components/sections/hero";
import AboutSectionInner from "@/components/sections/about";
import BenefitsSectionInner from "@/components/sections/benefits";
import FaqSectionInner from "@/components/sections/faq";
import CtaSectionInner from "@/components/sections/cta";
import ContactSectionInner from "@/components/sections/contact";
import MenuSectionInner from "@/components/sections/menu";
import CatalogSectionInner from "@/components/sections/catalog";
import TestimonialsSectionInner from "@/components/sections/testimonials";
import GallerySection from "@/components/sections/gallery";
import WorksSection from "@/components/sections/works";
import StatsSectionInner from "@/components/sections/stats";
import PartnersSectionInner from "@/components/sections/partners";
import PricingSectionInner from "@/components/sections/pricing";
import HeaderSection from "@/components/sections/header";
import FooterSection from "@/components/sections/footer";
import { BlogPostsSection } from "@/components/templates/blog-section";

export interface SectionRendererProps {
  sectionKey: string;
  variantKey: string;
  designToken: DesignToken;
  zeroState?: boolean;
}

export function SectionRenderer({
  sectionKey,
  variantKey,
  designToken,
  zeroState = false,
}: SectionRendererProps) {
  const d = MOCK_SHOWCASE_DATA;

  switch (sectionKey) {
    case "hero":
      return (
        <HeroSection
          hero={(zeroState ? {} : getShowcaseHero(variantKey)) as any}
          contact={(zeroState ? undefined : d.contact) as any}
          onSubmitLead={() => Promise.resolve()}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "header":
      return (
        <HeaderSection
          header={d.header as any}
          design_token={designToken}
          sectionOrder={["hero", "about", "benefits", "catalog", "menu", "works", "pricing", "contact"]}
          language="id"
        />
      );

    case "about":
      return (
        <AboutSectionInner
          about={d.about as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "benefits":
      return (
        <BenefitsSectionInner
          benefits={d.benefits as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "menu":
      return (
        <MenuSectionInner
          menu={d.menu as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "catalog":
      return (
        <CatalogSectionInner
          catalog={d.catalog as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "works":
      return (
        <WorksSection
          works={d.works as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "gallery":
      return (
        <GallerySection
          gallery={d.gallery as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "stats":
      return (
        <StatsSectionInner
          stats={d.stats as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "testimonials":
      return (
        <TestimonialsSectionInner
          testimonials={d.testimonials as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "partners":
      return (
        <PartnersSectionInner
          partners={d.partners as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "pricing":
      return (
        <PricingSectionInner
          pricing={d.pricing as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "faq":
      return (
        <FaqSectionInner
          faq={d.faq as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "cta":
      return (
        <CtaSectionInner
          cta={d.cta as any}
          design_token={designToken}
          isEditorMode={false}
        />
      );

    case "contact":
      return (
        <ContactSectionInner
          contact={d.contact as any}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      );

    case "footer":
      return (
        <FooterSection
          footer={d.footer as any}
          design_token={designToken}
          language="id"
        />
      );

    case "blog":
      return (
        <BlogPostsSection
          posts={d.blog.posts as any}
          layout={variantKey as any}
        />
      );

    default:
      return (
        <div className="p-8 text-center text-sm text-muted-foreground">
          Section renderer belum terdaftar untuk: <code>{sectionKey}</code>
        </div>
      );
  }
}
