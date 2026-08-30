"use client";
import React from "react";
import type { GalleryItem } from "@/components/templates/types";
import PhotoCredit from "../PhotoCredit";
import { InlineText } from "../../templates/shared";

interface MasonryProps {
  items: GalleryItem[];
  radius: string;
  setLightboxIndex: (i: number) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onUpdateCaption?: (idx: number, val: string) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export default function GalleryMasonry({
  items, radius, setLightboxIndex,
  isEditorMode, isSelected, onUpdateCaption,
  collapseSheetForInlineEdit, onEditingStateChange,
}: MasonryProps) {
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
            {item.video_url && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/20">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            )}
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
