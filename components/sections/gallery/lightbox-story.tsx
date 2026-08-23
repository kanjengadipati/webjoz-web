"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/components/templates/types";
import PhotoCredit from "../PhotoCredit";
import { InlineText } from "../../templates/shared";

interface LightboxStoryProps {
  items: GalleryItem[];
  radius: string;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onUpdateCaption?: (idx: number, val: string) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

function StoryLightbox({
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Story"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Tutup"
      >
        <X className="w-6 h-6" />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
            aria-label="Berikutnya"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <div
        className="relative w-full max-w-3xl mx-auto flex flex-col items-center px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.alt_text || item.caption || "Gallery image"}
            className="w-full max-h-[65vh] object-contain rounded-lg shadow-2xl"
          />
        )}
        {(item.caption || isEditorMode) && (
          <div className="mt-6 text-center max-w-xl">
            {isEditorMode ? (
              <InlineText
                section="gallery"
                fieldKey={`items.${current}.caption`}
                value={item.caption || ""}
                placeholder="Tambah narasi..."
                onUpdateField={(_, __, val) => onUpdateCaption?.(current, val)}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                multiline
                as="p"
                className="text-white/90 text-lg md:text-xl leading-relaxed italic"
              />
            ) : (
              <p className="text-white/90 text-lg md:text-xl leading-relaxed italic">{item.caption}</p>
            )}
          </div>
        )}
        {items.length > 1 && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-white/40 text-sm">{current + 1} / {items.length}</span>
            <div className="flex gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === current ? "bg-white w-4" : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        <PhotoCredit credit={item.image_credit} className="text-xs text-white/40 mt-3" />
      </div>
    </div>
  );
}

export default function GalleryLightboxStory({
  items, radius,
  isEditorMode, isSelected, onUpdateCaption,
  collapseSheetForInlineEdit, onEditingStateChange,
}: LightboxStoryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const ItemTag = isEditorMode ? "div" : "button";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((item, idx) => (
          <ItemTag
            key={idx}
            {...(!isEditorMode ? { type: "button" as const } : {})}
            onClick={() => !isEditorMode && setLightboxIndex(idx)}
            className="group relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 text-left cursor-pointer p-0 border-0 w-full"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {(item.caption || isEditorMode) && (
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
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
                    className="text-white text-sm font-medium leading-tight line-clamp-2"
                  />
                ) : (
                  <p className="text-white text-sm font-medium leading-tight line-clamp-2">{item.caption}</p>
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

      {lightboxIndex !== null && (
        <StoryLightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          onUpdateCaption={onUpdateCaption}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      )}
    </>
  );
}
