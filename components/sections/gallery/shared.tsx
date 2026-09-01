"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { GalleryItem, DesignToken } from "@/components/templates/types";
import PhotoCredit from "../PhotoCredit";
import { InlineText } from "../../templates/shared";

export interface GalleryVariantProps {
  gallery: {
    title: string;
    eyebrow?: string;
    items: GalleryItem[];
    layout?: string;
    autoplay_speed?: number;
    show_dots?: boolean;
    show_arrows?: boolean;
  };
  design_token?: DesignToken | null;
  sectionStyle?: React.CSSProperties;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export function getRadius(designToken?: DesignToken | null): string {
  const map: Record<string, string> = { sharp: "0px", soft: "8px", rounded: "16px" };
  return map[designToken?.layout?.corner_radius ?? "rounded"] || "16px";
}

export function GallerySectionHeader({
  gallery,
  design_token,
  isEditorMode,
  isSelected,
  onUpdateField,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: Pick<GalleryVariantProps, "gallery" | "design_token" | "isEditorMode" | "isSelected" | "onUpdateField" | "collapseSheetForInlineEdit" | "onEditingStateChange">) {
  return (
    <div className="text-center space-y-2">
      {(gallery.eyebrow || isEditorMode) && (
        <span
          className="text-xs font-bold uppercase tracking-widest block"
          style={{ color: design_token?.palette?.primary || "var(--dt-primary, #b45309)" }}
        >
          {isEditorMode ? (
            <InlineText
              section="gallery"
              fieldKey="eyebrow"
              value={gallery.eyebrow || ""}
              placeholder="Tambah eyebrow..."
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          ) : gallery.eyebrow}
        </span>
      )}
      <h2
        className="text-3xl md:text-4xl font-bold"
        style={{ fontFamily: "var(--dt-heading-font)", color: "var(--dt-text)" }}
      >
        {isEditorMode ? (
          <InlineText
            section="gallery"
            fieldKey="title"
            value={gallery.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
          />
        ) : gallery.title}
      </h2>
    </div>
  );
}

export function Lightbox({
  items,
  index,
  onClose,
  isEditorMode,
  isSelected,
  onUpdateCaption,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onUpdateCaption?: (idx: number, val: string) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent((i) => (i > 0 ? i - 1 : items.length - 1)), [items.length]);
  const next = useCallback(() => setCurrent((i) => (i < items.length - 1 ? i + 1 : 0)), [items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const item = items[current];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Preview gambar"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
        aria-label="Tutup"
      >
        <X className="w-6 h-6" />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            aria-label="Berikutnya"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <div
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.video_url ? (() => {
          const embedUrl = getVideoEmbedUrl(item.video_url);
          const isRaw = embedUrl && /\.(mp4|webm|ogg|mov)/i.test(embedUrl);
          if (!embedUrl) return null;
          if (isRaw) {
            return (
              <video
                src={embedUrl}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] rounded-lg shadow-2xl bg-black"
                style={{ minWidth: "min(640px, 90vw)", minHeight: "min(360px, 50vh)" }}
              />
            );
          }
          return (
            <iframe
              src={embedUrl}
              title={item.caption || "Video"}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-2xl bg-black"
              style={{ width: "min(840px, 90vw)", height: "min(473px, 60vh)", border: "none" }}
            />
          );
        })() : item.image_url ? (
          <img
            src={item.image_url}
            alt={item.alt_text || item.caption || "Gallery image"}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
          />
        ) : null}
        {(item.caption || isEditorMode) && (
          <p className="mt-3 text-white/80 text-sm text-center max-w-lg">
            {isEditorMode ? (
              <InlineText
                section="gallery"
                fieldKey={`items.${current}.caption`}
                value={item.caption ?? ""}
                placeholder="Tambah caption..."
                onUpdateField={(_, __, val) => onUpdateCaption?.(current, val)}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            ) : (
              item.caption
            )}
          </p>
        )}
        {items.length > 1 && (
          <p className="mt-2 text-white/50 text-xs">{current + 1} / {items.length}</p>
        )}
        <PhotoCredit credit={item.image_credit} className="text-xs text-white/50 mt-2" />
      </div>
    </div>
  );
}

export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|youtube\.com\/shorts\/)?([\w-]{11})$/);
  const ytFull = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  if (ytFull) return `https://www.youtube.com/embed/${ytFull[1]}?autoplay=1&rel=0`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) return url;
  return null;
}

export { Play };
