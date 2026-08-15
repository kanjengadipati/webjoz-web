"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem, DesignToken, GalleryLayout } from "@/components/templates/types";
import PhotoCredit from "../PhotoCredit";
import { InlineText } from "../../templates/shared";

interface GallerySectionProps {
  gallery?: {
    title: string;
    eyebrow?: string;
    items: GalleryItem[];
    layout?: GalleryLayout;
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

function Lightbox({ items, index, onClose }: { items: GalleryItem[]; index: number; onClose: () => void }) {
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
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.alt_text || item.caption || "Gallery image"}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
          />
        )}
        {item.caption && (
          <p className="mt-3 text-white/80 text-sm text-center max-w-lg">{item.caption}</p>
        )}
        {items.length > 1 && (
          <p className="mt-2 text-white/50 text-xs">{current + 1} / {items.length}</p>
        )}
        <PhotoCredit credit={item.image_credit} className="text-xs text-white/50 mt-2" />
      </div>
    </div>
  );
}

function Carousel({
  items,
  radius,
  setLightboxIndex,
  autoplaySpeed,
  showDots,
  showArrows,
  isEditorMode,
  isSelected,
  onUpdateCaption,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  items: GalleryItem[];
  radius: string;
  setLightboxIndex: (i: number) => void;
  autoplaySpeed: number;
  showDots: boolean;
  showArrows: boolean;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onUpdateCaption?: (idx: number, val: string) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (isEditorMode) return;
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % items.length);
    }, autoplaySpeed);
  }, [items.length, autoplaySpeed, isEditorMode]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer]);

  const prev = () => { setCurrent((i) => (i > 0 ? i - 1 : items.length - 1)); startTimer(); };
  const next = () => { setCurrent((i) => (i + 1) % items.length); startTimer(); };

  if (items.length === 0) return null;

  const ItemTag = isEditorMode ? "div" : "button";

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl" style={{ borderRadius: radius }}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, idx) => (
          <ItemTag
            key={idx}
            {...(!isEditorMode ? { type: "button" as const } : {})}
            onClick={() => setLightboxIndex(idx)}
            className="min-w-full aspect-video relative cursor-pointer p-0 border-0 text-left"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.alt_text || item.caption || "Gallery image"}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            )}
            {(item.caption || isEditorMode) && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                {isEditorMode ? (
                  <InlineText
                    section="gallery"
                    fieldKey={`items.${idx}.caption`}
                    value={item.caption || ""}
                    placeholder="Tambah caption..."
                    onUpdateField={(_, __, val) => onUpdateCaption?.(idx, val)}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    as="div"
                    className="text-white text-sm font-medium"
                  />
                ) : (
                  <p className="text-white text-sm font-medium">{item.caption}</p>
                )}
              </div>
            )}
            {item.image_credit?.name && (
              <div className="absolute bottom-1 right-2 z-10">
                <PhotoCredit credit={item.image_credit} className="text-[10px] text-white/60" />
              </div>
            )}
          </ItemTag>
        ))}
      </div>

      {showArrows && items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            aria-label="Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {showDots && items.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => { e.stopPropagation(); setCurrent(idx); startTimer(); }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === current ? "bg-white w-5" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Grid({
  items,
  radius,
  setLightboxIndex,
  isEditorMode,
  isSelected,
  onUpdateCaption,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  items: GalleryItem[];
  radius: string;
  setLightboxIndex: (i: number) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onUpdateCaption?: (idx: number, val: string) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const ItemTag = isEditorMode ? "div" : "button";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {items.map((item, idx) => (
        <ItemTag
          key={idx}
          {...(!isEditorMode ? { type: "button" as const } : {})}
          onClick={() => setLightboxIndex(idx)}
          className="group relative overflow-hidden bg-cover bg-center shadow-sm hover:shadow-lg transition-all duration-300 text-left cursor-pointer p-0 border-0 w-full"
          style={{ borderRadius: radius, aspectRatio: "4 / 3" }}
        >
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.alt_text || item.caption || "Gallery image"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          {(item.caption || isEditorMode) && (
            <div className={`absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent ${isEditorMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`}>
              {isEditorMode ? (
                <InlineText
                  section="gallery"
                  fieldKey={`items.${idx}.caption`}
                  value={item.caption || ""}
                  placeholder="Tambah caption..."
                  onUpdateField={(_, __, val) => onUpdateCaption?.(idx, val)}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="div"
                  className="text-white text-sm font-medium leading-tight"
                />
              ) : (
                <p className="text-white text-sm font-medium leading-tight">{item.caption}</p>
              )}
            </div>
          )}
          {item.image_credit?.name && (
            <div className="absolute bottom-1 right-2 z-10">
              <PhotoCredit credit={item.image_credit} className="text-[10px] text-white/60" />
            </div>
          )}
        </ItemTag>
      ))}
    </div>
  );
}

function Masonry({
  items,
  radius,
  setLightboxIndex,
  isEditorMode,
  isSelected,
  onUpdateCaption,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  items: GalleryItem[];
  radius: string;
  setLightboxIndex: (i: number) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onUpdateCaption?: (idx: number, val: string) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const col1 = items.filter((_, i) => i % 3 === 0);
  const col2 = items.filter((_, i) => i % 3 === 1);
  const col3 = items.filter((_, i) => i % 3 === 2);
  const heights = [280, 360, 320, 400, 260, 380, 300, 340, 420];

  const ItemTag = isEditorMode ? "div" : "button";

  const MasonryCol = ({ colItems, startIdx }: { colItems: GalleryItem[]; startIdx: number }) => (
    <div className="flex flex-col gap-4 md:gap-6">
      {colItems.map((item, idx) => {
        const itemIdx = startIdx + idx * 3;
        return (
          <ItemTag
            key={idx}
            {...(!isEditorMode ? { type: "button" as const } : {})}
            onClick={() => setLightboxIndex(itemIdx)}
            className="group relative overflow-hidden bg-cover bg-center shadow-sm hover:shadow-lg transition-all duration-300 text-left cursor-pointer p-0 border-0 w-full"
            style={{ borderRadius: radius, height: heights[(startIdx / 3 + idx) % heights.length] }}
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.alt_text || item.caption || "Gallery image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            {(item.caption || isEditorMode) && (
              <div className={`absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent ${isEditorMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`}>
                {isEditorMode ? (
                  <InlineText
                    section="gallery"
                    fieldKey={`items.${itemIdx}.caption`}
                    value={item.caption || ""}
                    placeholder="Tambah caption..."
                    onUpdateField={(_, __, val) => onUpdateCaption?.(itemIdx, val)}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    as="div"
                    className="text-white text-sm font-medium leading-tight"
                  />
                ) : (
                  <p className="text-white text-sm font-medium leading-tight">{item.caption}</p>
                )}
              </div>
            )}
            {item.image_credit?.name && (
              <div className="absolute bottom-1 right-2 z-10">
                <PhotoCredit credit={item.image_credit} className="text-[10px] text-white/60" />
              </div>
            )}
          </ItemTag>
        );
      })}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <MasonryCol colItems={col1} startIdx={0} />
      <MasonryCol colItems={col2} startIdx={1} />
      <MasonryCol colItems={col3} startIdx={2} />
    </div>
  );
}

const GalleryClassic: React.FC<GallerySectionProps> = ({
  gallery, design_token, sectionStyle,
  onUpdateField, isEditorMode = false, isSelected = false,
  collapseSheetForInlineEdit, onEditingStateChange,
}) => {
  // In editor mode, suppress lightbox so clicking the image doesn't open a
  // fullscreen overlay that traps the user inside the editor preview.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!gallery?.items?.length) return null;

  const radiusMap: Record<string, string> = {
    sharp: "0px",
    soft: "8px",
    rounded: "16px",
  };
  const radius = radiusMap[design_token?.layout?.corner_radius ?? "rounded"] || "16px";
  const layout = design_token?.layout?.section_variants?.gallery ?? gallery.layout ?? "grid";
  const autoplaySpeed = gallery.autoplay_speed ?? 4000;
  const showDots = gallery.show_dots ?? true;
  const showArrows = gallery.show_arrows ?? true;

  const handleLightbox = (i: number) => {
    if (!isEditorMode) setLightboxIndex(i);
  };

  const handleUpdateCaption = (idx: number, newCaption: string) => {
    const nextItems = [...(gallery.items || [])];
    nextItems[idx] = { ...nextItems[idx], caption: newCaption };
    onUpdateField?.("gallery", "items", nextItems);
  };

  return (
    <section id="gallery" className="px-5 sm:px-6 py-16 md:py-20 max-w-6xl mx-auto" style={sectionStyle}>
      <div className="space-y-10">
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

        {layout === "carousel" ? (
          <Carousel
            items={gallery.items}
            radius={radius}
            setLightboxIndex={handleLightbox}
            autoplaySpeed={autoplaySpeed}
            showDots={showDots}
            showArrows={showArrows}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            onUpdateCaption={handleUpdateCaption}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        ) : layout === "masonry" ? (
          <Masonry
            items={gallery.items}
            radius={radius}
            setLightboxIndex={handleLightbox}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            onUpdateCaption={handleUpdateCaption}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        ) : (
          <Grid
            items={gallery.items}
            radius={radius}
            setLightboxIndex={handleLightbox}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            onUpdateCaption={handleUpdateCaption}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox items={gallery.items} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </section>
  );
};

export default GalleryClassic;
