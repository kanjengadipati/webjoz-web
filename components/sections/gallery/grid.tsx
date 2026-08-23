"use client";
import React from "react";
import type { GalleryItem } from "@/components/templates/types";
import PhotoCredit from "../PhotoCredit";
import { InlineText } from "../../templates/shared";

interface GridProps {
  items: GalleryItem[];
  radius: string;
  setLightboxIndex: (i: number) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onUpdateCaption?: (idx: number, val: string) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export default function GalleryGrid({
  items, radius, setLightboxIndex,
  isEditorMode, isSelected, onUpdateCaption,
  collapseSheetForInlineEdit, onEditingStateChange,
}: GridProps) {
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
