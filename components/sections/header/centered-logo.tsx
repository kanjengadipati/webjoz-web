"use client";
import React from "react";
import { NavMenu, LogoImage, navCtaHref } from "../../templates/shared";
import { Globe } from "lucide-react";
import type { HeaderVariantProps } from "./types";

export default function CenteredLogo({
  header, sectionOrder, hiddenSections,
  navLinkClass = "", drawerStyle, extraLinks, language,
}: HeaderVariantProps) {
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-col items-center gap-2 relative"
      style={{
        background: "color-mix(in srgb, var(--dt-bg) 85%, transparent)",
        borderBottom: "1px solid var(--dt-border)",
      }}
    >
      <div className="flex items-center justify-between w-full">
        <span className="flex items-center gap-2 text-lg font-bold text-[var(--dt-text)] tracking-wide">
          <LogoImage
            url={header?.logo_url}
            icon={header?.icon}
            defaultIcon={Globe}
            iconClass="w-6 h-6 shrink-0 text-[var(--dt-primary)]"
            imgClass="h-9 w-auto shrink-0 object-contain"
          />
          <span className="truncate">{header?.brand_name || "Brand Kami"}</span>
        </span>
        {!header?.nav_cta_hidden && (
          <a
            href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
            aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
            className="shrink-0 px-4 py-2 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-xs font-medium hover:opacity-85 transition-all shadow-sm inline-flex items-center sm:hidden"
            style={{ color: "var(--dt-primary-foreground)" }}
          >
            {header?.nav_cta_text || defaultCta}
          </a>
        )}
      </div>
      <div className="flex items-center justify-between w-full gap-4">
        <NavMenu
          sectionOrder={sectionOrder}
          hiddenSections={hiddenSections}
          extraLinks={extraLinks}
          language={language}
          linkClass={navLinkClass || "text-[var(--dt-text-muted)] text-sm"}
          drawerStyle={drawerStyle || { background: "var(--dt-bg)", borderTop: "1px solid var(--dt-border)" }}
        />
        {!header?.nav_cta_hidden && (
          <a
            href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
            aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
            className="hidden sm:inline-flex shrink-0 px-5 py-2 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-xs font-semibold hover:opacity-85 transition-all shadow-sm items-center"
            style={{ color: "var(--dt-primary-foreground)" }}
          >
            {header?.nav_cta_text || defaultCta}
          </a>
        )}
      </div>
      {header?.tagline && (
        <p className="text-[11px] text-[var(--dt-text-muted)] text-center w-full -mt-1">
          {header.tagline}
        </p>
      )}
    </header>
  );
}
