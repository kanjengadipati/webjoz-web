"use client";
/**
 * Hero section shared primitives.
 *
 * Tujuan: hilangkan duplikasi safeHref/isExternalHref/InlineText/InlineImage/PhotoCredit
 * yang tersebar di setiap varian hero. Varian baru cukup impor dari sini.
 *
 * Skala heading:
 *   HERO_HEADING_SIZE.lg — judul utama sebagian besar varian
 *   HERO_HEADING_SIZE.md — layout padat / sempit (bento, booking, dll.)
 *
 * Migrasi bertahap: mulai dari varian sederhana, bandingkan tampilan sebelum/sesudah,
 * lalu migrasi sisanya per PR. Varian yang belum dimigrasi tetap valid.
 */
import React from "react";
import { ArrowRight } from "lucide-react";
import { InlineText, InlineImage } from "../../templates/shared";
import type { ImageCredit } from "../../templates/types";
import PhotoCredit from "../PhotoCredit";
import { safeHref, isExternalHref } from "@/lib/safe-url";

// Re-export untuk varian yang impor dari primitives saja
export { safeHref, isExternalHref };

// ─── Skala heading ────────────────────────────────────────────────────────────

/**
 * Dua ukuran heading standar hero. Gunakan `lg` untuk layout lebar/full-page,
 * `md` untuk layout padat (bento, booking-form, dll.).
 *
 * Semua nilai mengacu `--dt-hero-size` agar desainer bisa override per-situs
 * via design token tanpa menyentuh komponen.
 *
 * Catatan: varian dengan judul sengaja besar (personal-billboard clamp(3rem,9vw,6.5rem))
 * atau sengaja kecil (floating-card, location-map) TIDAK menggunakan skala ini —
 * ukuran mereka disengaja dan diputuskan per-varian.
 */
export const HERO_HEADING_SIZE = {
  /** Judul utama — sebagian besar varian standar */
  lg: "clamp(2.25rem, 5.5vw, var(--dt-hero-size, 4rem))",
  /** Layout padat / kolom sempit */
  md: "clamp(2rem, 5vw, var(--dt-hero-size, 3.5rem))",
} as const;

// ─── Props bersama ────────────────────────────────────────────────────────────

/** Props editing inline yang diteruskan ke InlineText */
interface InlineEditProps {
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

// ─── HeroCta ─────────────────────────────────────────────────────────────────

export interface HeroCtaProps extends InlineEditProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** URL tombol/link; akan di-sanitasi oleh safeHref. */
  href?: string | null;
  /** Label teks; dibungkus InlineText agar bisa diedit inline. */
  label?: string | null;
  /** fieldKey untuk InlineText, mis. "cta_text" atau "cta_secondary_text". */
  fieldKey?: string;
  /** section untuk InlineText. Default: "hero". */
  section?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Ikon yang ditampilkan di kanan teks. Default: <ArrowRight />. Pass `null` untuk tidak ada ikon. */
  icon?: React.ReactNode | null;
  /** ukuran ikon ArrowRight default. Default: 14. */
  iconSize?: number;
}

/**
 * Tombol/link CTA hero dengan sanitasi URL, target _blank otomatis,
 * dan label inline-editable.
 *
 * Pola yang digantikan:
 * ```tsx
 * <a href={safeHref(h.cta_url, "#contact")}
 *    target={isExternalHref(h.cta_url) ? "_blank" : undefined}
 *    rel={isExternalHref(h.cta_url) ? "noopener noreferrer" : undefined}
 *    style={...}>
 *   <InlineText section="hero" fieldKey="cta_text" value={h.cta_text} ... />
 *   <ArrowRight />
 * </a>
 * ```
 */
export function HeroCta({
  href,
  label,
  fieldKey = "cta_text",
  section = "hero",
  className,
  style,
  icon,
  iconSize = 14,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  ...anchorProps
}: HeroCtaProps) {
  const safe = safeHref(href, "#contact");
  const external = isExternalHref(safe);
  // icon === null artinya tidak ada ikon; icon === undefined artinya default ArrowRight
  const iconNode = icon === null ? null : icon ?? <ArrowRight style={{ width: iconSize, height: iconSize, flexShrink: 0 }} />;

  return (
    <a
      href={safe}
      className={className}
      style={style}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...anchorProps}
    >
      <InlineText
        section={section}
        fieldKey={fieldKey}
        value={label}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        as="span"
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />
      {iconNode}
    </a>
  );
}

// ─── HeroImage ───────────────────────────────────────────────────────────────

export interface HeroImageProps extends InlineEditProps {
  src?: string | null;
  alt?: string;
  /** fieldKey untuk InlineImage. Default: "image_url". */
  fieldKey?: string;
  /** section untuk InlineImage. Default: "hero". */
  section?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Aktifkan mode background (opacity overlay editor di pojok). */
  isBackground?: boolean;
  compact?: boolean;
  fallbackIcon?: React.ReactNode;
  /** Kredit foto — diteruskan ke PhotoCredit. */
  credit?: ImageCredit | null;
  /** fieldKey untuk inline edit nama fotografer. Default: "image_credit.name". */
  creditFieldKey?: string;
  /** Bahasa untuk label PhotoCredit ("id" | "en"). */
  language?: string;
  /** Posisi overlay credit. Default: "bottom-right". */
  creditPosition?: React.CSSProperties;
}

/**
 * Gambar hero inline-editable + kredit foto opsional.
 *
 * Pola yang digantikan:
 * ```tsx
 * <InlineImage section="hero" fieldKey="image_url" src={h.image_url} ... />
 * <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 20 }}>
 *   <PhotoCredit credit={h.image_credit} src={h.image_url} ... />
 * </div>
 * ```
 *
 * Gunakan `creditPosition` untuk mengubah posisi overlay kredit bila layout
 * membutuhkan penempatan berbeda dari default (bottom: 8, right: 8).
 */
export function HeroImage({
  src,
  alt = "",
  fieldKey = "image_url",
  section = "hero",
  className,
  style,
  isBackground = false,
  compact,
  fallbackIcon,
  credit,
  creditFieldKey = "image_credit.name",
  language,
  creditPosition,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
}: HeroImageProps) {
  const defaultCreditPos: React.CSSProperties = { position: "absolute", bottom: 8, right: 8, zIndex: 20 };

  return (
    <>
      <InlineImage
        section={section}
        fieldKey={fieldKey}
        src={src}
        alt={alt}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        className={className}
        style={style}
        isBackground={isBackground}
        compact={compact}
        fallbackIcon={fallbackIcon}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      />
      {(credit || src) && (
        <div style={creditPosition ?? defaultCreditPos}>
          <PhotoCredit
            credit={credit ?? null}
            src={src}
            language={language}
            section={section}
            fieldKey={creditFieldKey}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
        </div>
      )}
    </>
  );
}
