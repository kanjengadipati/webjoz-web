"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/components/templates/types";
import PhotoCredit from "../PhotoCredit";
import { InlineText } from "../../templates/shared";

interface CarouselProps {
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
}

export default function GalleryCarousel({
  items, radius, setLightboxIndex,
  autoplaySpeed, showDots, showArrows,
  isEditorMode, isSelected, onUpdateCaption,
  collapseSheetForInlineEdit, onEditingStateChange,
}: CarouselProps) {
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
