"use client";
import React, { useState, useEffect, useRef } from "react";
import { NavMenu, LogoImage, navCtaHref, InlineText } from "../../templates/shared";
import { Globe } from "lucide-react";
import type { HeaderVariantProps } from "./types";

const DARK_HEROES = new Set(["full-bleed", "image-carousel"]);
const SPLIT_HEROES = new Set(["split", "split-editorial"]);

export default function TransparentOverlay({
  header,
  sectionOrder,
  hiddenSections,
  navLinkClass = "",
  drawerStyle,
  extraLinks,
  language,
  design_token,
  onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
}: HeaderVariantProps) {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";

  useEffect(() => {
    const checkScroll = () => {
      if (typeof window !== "undefined") {
        setScrolled(window.scrollY > 40);
      }
    };
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });

    let io: IntersectionObserver | null = null;
    const el = sentinelRef.current;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            setScrolled(true);
          } else if (entry.isIntersecting) {
            setScrolled(window.scrollY > 40);
          }
        },
        { threshold: 0 }
      );
      io.observe(el);
    }

    const editorScroll = document.getElementById("preview-scroll-container");
    const onEditorScroll = () => {
      if (editorScroll) setScrolled(editorScroll.scrollTop > 40);
    };
    if (editorScroll) {
      editorScroll.addEventListener("scroll", onEditorScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", checkScroll);
      editorScroll?.removeEventListener("scroll", onEditorScroll);
      io?.disconnect();
    };
  }, []);

  const top = !scrolled;
  // Hero gelap (foto full-bleed / carousel / tema dark) => teks putih di atas hero.
  // Hero terang => teks tetap gelap agar terbaca, tanpa scrim & tanpa invert logo.
  const heroVariant = (design_token?.layout?.section_variants?.hero as string | undefined) || design_token?.layout?.hero_style || "centered";
  const lightOnHero = top && (DARK_HEROES.has(heroVariant) || design_token?.theme_mode === "dark");
  const isSplitHero = SPLIT_HEROES.has(heroVariant);
  const H = 88; // tinggi header saat di atas hero (px)
  const Hs = 60; // tinggi header setelah scroll (px)
  const ease = "320ms cubic-bezier(0.22, 1, 0.36, 1)";
  const textColor = lightOnHero ? "#fff" : "var(--dt-text)";

  // Kapsul kaca hanya diaktifkan pada split hero di posisi top agar teks navigasi
  // yang melintasi kolom foto tetap kontras & tidak samar. Pada hero varian lain tetap standar.
  const navPillStyle: React.CSSProperties | undefined =
    isSplitHero && top
      ? {
          background: lightOnHero
            ? "rgba(255, 255, 255, 0.14)"
            : "color-mix(in srgb, var(--dt-bg) 82%, transparent)",
          backdropFilter: "blur(14px) saturate(1.4)",
          WebkitBackdropFilter: "blur(14px) saturate(1.4)",
          border: lightOnHero
            ? "1px solid rgba(255, 255, 255, 0.22)"
            : "1px solid color-mix(in srgb, var(--dt-border) 60%, transparent)",
          boxShadow: lightOnHero
            ? "0 4px 16px rgba(0, 0, 0, 0.2)"
            : "0 2px 12px -2px rgba(0, 0, 0, 0.08)",
          borderRadius: "9999px",
          padding: "3px 6px",
          transition: `all ${ease}`,
        }
      : isSplitHero
        ? {
            background: "transparent",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            border: "1px solid transparent",
            boxShadow: "none",
            borderRadius: "9999px",
            padding: "3px 6px",
            transition: `all ${ease}`,
          }
        : undefined;

  return (
    <>
      {/* sentinel: 1px, 80px di bawah posisi awal header */}
      <div aria-hidden className="relative h-0 w-full pointer-events-none">
        <div ref={sentinelRef} className="absolute left-0 top-20 h-px w-px" />
      </div>
      {/* Outer: fixed di public/preview (ala webarq.com), sticky di editor canvas */}
      <div
        className={`${isEditorMode ? "sticky top-0" : "fixed top-0 left-0 right-0"} z-50 pointer-events-none`}
        style={{ height: H, marginBottom: -H }}
      >
    <header
      className="pointer-events-auto relative px-4 sm:px-8 flex items-center justify-between gap-4"
      style={{
        height: top ? H : Hs,
        transition: `height ${ease}, background-color ${ease}, box-shadow ${ease}, backdrop-filter ${ease}`,
        background: top
          ? lightOnHero
            ? "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 100%)"
            : "transparent"
          : "color-mix(in srgb, var(--dt-bg) 74%, transparent)",
        backdropFilter: top ? "none" : "blur(16px) saturate(1.5)",
        WebkitBackdropFilter: top ? "none" : "blur(16px) saturate(1.5)",
        boxShadow: top ? "none" : "0 1px 0 var(--dt-border), 0 8px 24px -12px rgba(0,0,0,0.18)",
        color: textColor,
      }}
    >
      <div
        className="min-w-0 text-base sm:text-lg font-bold tracking-wide flex items-center gap-2.5"
        style={{ color: textColor, transition: `color ${ease}` }}
      >
        <LogoImage
          url={lightOnHero && header?.logo_url_light ? header.logo_url_light : header?.logo_url}
          icon={header?.icon}
          defaultIcon={Globe}
          iconClass={`w-5 h-5 shrink-0 ${lightOnHero ? "text-white" : "text-[var(--dt-primary)]"}`}
          imgClass={`w-auto shrink-0 object-contain transition-all duration-300 ${top ? "h-9" : "h-7"} ${lightOnHero && !header?.logo_url_light ? "brightness-0 invert" : ""}`}
          section="header"
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        />
        <div className="min-w-0 flex flex-col justify-center">
          <InlineText
            section="header"
            fieldKey="brand_name"
            value={header?.brand_name || "Brand Kami"}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
            className="truncate block leading-tight"
          />
          {(header?.tagline || isEditorMode) && (
            <InlineText
              section="header"
              fieldKey="tagline"
              value={header.tagline}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="block text-[11px] font-normal tracking-wide truncate leading-tight mt-0.5"
              style={{ color: lightOnHero ? "rgba(255,255,255,0.85)" : "var(--dt-text-muted)" }}
            />
          )}
        </div>
      </div>
      <NavMenu
        sectionOrder={sectionOrder}
        hiddenSections={hiddenSections}
        extraLinks={extraLinks}
        language={language}
        linkClass={navLinkClass || (lightOnHero ? "text-white/90 hover:text-white" : "text-[var(--dt-text)]")}
        containerStyle={navPillStyle}
        drawerStyle={
          drawerStyle || {
            background: "var(--dt-bg)",
            color: "var(--dt-text)",
            borderTop: "1px solid var(--dt-border)",
          }
        }
        nav_labels={header?.nav_labels}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />
      {!header?.nav_cta_hidden && (
        <a
          href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
          aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
          className="min-h-11 shrink-0 px-4 py-2 rounded-[var(--dt-radius)] text-sm font-medium hover:opacity-85 transition-all shadow-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2"
          style={{
            background: lightOnHero ? "rgba(255,255,255,0.14)" : "var(--dt-primary)",
            color: lightOnHero ? "#fff" : "var(--dt-primary-foreground)",
            border: lightOnHero ? "1px solid rgba(255,255,255,0.45)" : "1px solid transparent",
            backdropFilter: lightOnHero ? "blur(8px)" : undefined,
            transition: `background-color ${ease}, color ${ease}, border-color ${ease}`,
          }}
        >
          <InlineText
            section="header"
            fieldKey="nav_cta_text"
            value={header?.nav_cta_text || defaultCta}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
          />
        </a>
      )}
    </header>
      </div>
    </>
  );
}
