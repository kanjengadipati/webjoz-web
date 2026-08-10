"use client";
import React, { useState, useEffect } from "react";
import { NavMenu, LogoImage, navCtaHref } from "../../templates/shared";
import { Globe } from "lucide-react";
import type { HeaderVariantProps } from "./types";

export default function TransparentOverlay({
  header, sectionOrder, hiddenSections,
  navLinkClass = "", drawerStyle, language,
}: HeaderVariantProps) {
  const [scrolled, setScrolled] = useState(false);
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative transition-all duration-300"
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--dt-bg) 92%, transparent)"
          : "color-mix(in srgb, var(--dt-bg) 15%, transparent)",
        backdropFilter: scrolled ? "blur(12px)" : "blur(4px)",
        borderBottom: scrolled ? "1px solid var(--dt-border)" : "1px solid transparent",
      }}
    >
      <span className="min-w-0 text-base sm:text-lg font-bold tracking-wide flex items-center gap-2"
        style={{
          color: scrolled ? "var(--dt-text)" : "color-mix(in srgb, var(--dt-text) 70%, var(--dt-bg))",
        }}
      >
        <LogoImage
          url={header?.logo_url}
          icon={header?.icon}
          defaultIcon={Globe}
          iconClass="w-5 h-5 shrink-0 text-[var(--dt-primary)]"
          imgClass="h-8 w-auto shrink-0 object-contain"
        />
        <span className="min-w-0">
          <span className="truncate block">{header?.brand_name || "Brand Kami"}</span>
          {header?.tagline && (
            <span className="block text-[10px] font-normal text-[var(--dt-text-muted)] tracking-wide truncate">
              {header.tagline}
            </span>
          )}
        </span>
      </span>
      <NavMenu
        sectionOrder={sectionOrder}
        hiddenSections={hiddenSections}
        language={language}
        linkClass={navLinkClass || "text-[var(--dt-text)]"}
        drawerStyle={drawerStyle || { background: "var(--dt-bg)", borderTop: "1px solid var(--dt-border)" }}
      />
      {!header?.nav_cta_hidden && (
        <a
          href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
          aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
          className="min-h-11 shrink-0 px-4 py-2 rounded-[var(--dt-radius)] text-sm font-medium hover:opacity-85 transition-all shadow-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2"
          style={{
            background: scrolled ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-primary) 80%, white)",
            color: "var(--dt-primary-foreground)",
          }}
        >
          {header?.nav_cta_text || defaultCta}
        </a>
      )}
    </header>
  );
}
