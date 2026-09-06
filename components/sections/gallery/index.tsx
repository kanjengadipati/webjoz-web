import React, { useState, useCallback } from "react";
import type { DesignToken, GalleryItem } from "@/components/templates/types";
import { GallerySectionHeader, Lightbox, getRadius, GalleryAddTile } from "./shared";
import type { GalleryVariantProps } from "./shared";
import GalleryGrid from "./grid";
import GalleryMasonry from "./masonry";
import GalleryCarousel from "./carousel";
import GalleryLightboxStory from "./lightbox-story";

export default function GallerySection({
  gallery,
  design_token,
  sectionStyle,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: GalleryVariantProps) {
  const dt = design_token;
  const radius = getRadius(dt);

  const variant =
    dt?.layout?.section_variants?.gallery || gallery.layout || "grid";

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const autoplaySpeed = (gallery.autoplay_speed ?? 4000);
  const showDots = gallery.show_dots ?? true;
  const showArrows = gallery.show_arrows ?? true;

  const onUpdateCaption = useCallback(
    (idx: number, val: string) => {
      const items = [...(gallery.items || [])];
      items[idx] = { ...items[idx], caption: val };
      onUpdateField?.("gallery", "items", items);
    },
    [gallery.items, onUpdateField]
  );

  const onUpdateItems = useCallback(
    (items: GalleryItem[]) => {
      onUpdateField?.("gallery", "items", items);
    },
    [onUpdateField]
  );

  const onReplaceImage = useCallback(
    (idx: number, url: string) => {
      const items = [...(gallery.items || [])];
      if (!items[idx]) return;
      items[idx] = { ...items[idx], image_url: url, video_url: undefined };
      onUpdateItems(items);
    },
    [gallery.items, onUpdateItems]
  );

  const onRemoveItem = useCallback(
    (idx: number) => {
      const items = [...(gallery.items || [])];
      items.splice(idx, 1);
      onUpdateItems(items);
    },
    [gallery.items, onUpdateItems]
  );

  const onMoveItem = useCallback(
    (idx: number, dir: -1 | 1) => {
      const items = [...(gallery.items || [])];
      const j = idx + dir;
      if (j < 0 || j >= items.length) return;
      [items[idx], items[j]] = [items[j], items[idx]];
      onUpdateItems(items);
    },
    [gallery.items, onUpdateItems]
  );

  const onAddItem = useCallback(
    (url: string) => {
      onUpdateItems([...(gallery.items || []), { image_url: url, caption: "" }]);
    },
    [gallery.items, onUpdateItems]
  );

  if ((!gallery.items || gallery.items.length === 0) && !isEditorMode) {
    return null;
  }

  const isEmpty = !gallery.items || gallery.items.length === 0;

  const headerProps = {
    gallery,
    design_token: dt,
    isEditorMode,
    isSelected,
    onUpdateField,
    collapseSheetForInlineEdit,
    onEditingStateChange,
    onAddItem:
      isEditorMode && (isEmpty || variant === "carousel" || variant === "lightbox-story")
        ? onAddItem
        : undefined,
  };

  const variantProps = {
    items: gallery.items || [],
    radius,
    setLightboxIndex,
    isEditorMode,
    isSelected,
    onUpdateCaption,
    collapseSheetForInlineEdit,
    onEditingStateChange,
    onReplaceImage,
    onRemoveItem,
    onMoveItem,
    onAddItem,
  };

  return (
    <section
      id="gallery"
      className="py-16 md:py-24 px-4 md:px-8"
      style={{
        ...sectionStyle,
        backgroundColor: "var(--dt-bg)",
        color: "var(--dt-text)",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-10 md:space-y-14">
        <GallerySectionHeader {...headerProps} />

        {isEditorMode && isEmpty ? (
          <div className="max-w-md mx-auto">
            <GalleryAddTile
              onAdd={onAddItem}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              style={{ borderRadius: radius, aspectRatio: "4 / 3" }}
            />
          </div>
        ) : variant === "carousel" ? (
          <GalleryCarousel
            {...variantProps}
            autoplaySpeed={autoplaySpeed}
            showDots={showDots}
            showArrows={showArrows}
          />
        ) : variant === "masonry" ? (
          <GalleryMasonry {...variantProps} />
        ) : variant === "lightbox-story" ? (
          <GalleryLightboxStory
            items={gallery.items}
            radius={radius}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            onUpdateCaption={onUpdateCaption}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            onReplaceImage={onReplaceImage}
            onRemoveItem={onRemoveItem}
            onMoveItem={onMoveItem}
          />
        ) : (
          <GalleryGrid {...variantProps} />
        )}
      </div>

      {lightboxIndex !== null && variant !== "lightbox-story" && (
        <Lightbox
          items={gallery.items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          onUpdateCaption={onUpdateCaption}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      )}
    </section>
  );
}
