import React, { useState, useCallback } from "react";
import type { DesignToken } from "@/components/templates/types";
import { GallerySectionHeader, Lightbox, getRadius } from "./shared";
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

  if (!gallery.items || gallery.items.length === 0) {
    return null;
  }

  const headerProps = {
    gallery,
    design_token: dt,
    isEditorMode,
    isSelected,
    onUpdateField,
    collapseSheetForInlineEdit,
    onEditingStateChange,
  };

  const variantProps = {
    items: gallery.items,
    radius,
    setLightboxIndex,
    isEditorMode,
    isSelected,
    onUpdateCaption,
    collapseSheetForInlineEdit,
    onEditingStateChange,
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

        {variant === "carousel" ? (
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
        />
      )}
    </section>
  );
}
