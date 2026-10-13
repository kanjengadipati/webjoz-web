"use client";
import React, { useState, useEffect } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/components/templates/types";
import PhotoCredit from "../PhotoCredit";
import { InlineText } from "../../templates/shared";
import type { GalleryVariantProps } from "./shared";
import {
  GallerySectionHeader,
  GalleryTileOverlay,
  GalleryAddTile,
  Lightbox,
  getRadius,
  getVideoEmbedUrl,
} from "./shared";

type VideoGridStrings = {
  playVideo: string;
  close: string;
  videoDialog: string;
  imageAlt: string;
};

type GalleryVideoGridProps = Omit<GalleryVariantProps, "gallery"> & {
  gallery?: GalleryVariantProps["gallery"];
  items?: GalleryItem[];
  radius?: string;
  setLightboxIndex?: (i: number) => void;
  onUpdateCaption?: (idx: number, val: string) => void;
  onUpdateCredit?: (idx: number, val: string) => void;
  language?: "id" | "en";
  isEN?: boolean;
};

const RAW_VIDEO_RE = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

function VideoModal({
  items,
  index,
  onClose,
  isEditorMode,
  isSelected,
  onUpdateCaption,
  onUpdateCredit,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  strings,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onUpdateCaption?: (idx: number, val: string) => void;
  onUpdateCredit?: (idx: number, val: string) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  strings: VideoGridStrings;
}) {
  const [current, setCurrent] = useState(index);

  const videoIndices = items
    .map((it, i) => (it.video_url ? i : -1))
    .filter((i) => i >= 0);
  const pos = videoIndices.indexOf(current);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const goTo = (dir: -1 | 1) => {
    if (videoIndices.length < 2 || pos < 0) return;
    const next = (pos + dir + videoIndices.length) % videoIndices.length;
    setCurrent(videoIndices[next]);
  };

  const item = items[current];
  const rawUrl = item?.video_url ?? "";
  const embedUrl = rawUrl ? getVideoEmbedUrl(rawUrl) : null;
  const isRaw = embedUrl ? RAW_VIDEO_RE.test(embedUrl) : false;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={strings.videoDialog}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
        aria-label={strings.close}
      >
        <X className="w-6 h-6" />
      </button>

      {videoIndices.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            aria-label={strings.close}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            aria-label={strings.close}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <div
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isRaw ? (
          <video
            src={embedUrl ?? rawUrl}
            controls
            autoPlay
            className="max-w-full max-h-[75vh] rounded-lg shadow-2xl bg-black"
            style={{ minWidth: "min(640px, 90vw)", minHeight: "min(360px, 50vh)" }}
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={item?.caption || strings.videoDialog}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-2xl bg-black"
            style={{ width: "min(840px, 90vw)", height: "min(473px, 60vh)", border: "none" }}
          />
        ) : (
          <video
            src={rawUrl}
            controls
            autoPlay
            className="max-w-full max-h-[75vh] rounded-lg shadow-2xl bg-black"
            style={{ minWidth: "min(640px, 90vw)", minHeight: "min(360px, 50vh)" }}
          />
        )}

        {(item?.caption || isEditorMode) && (
          <p className="mt-3 text-white/80 text-sm text-center max-w-lg">
            {isEditorMode ? (
              <InlineText
                section="gallery"
                fieldKey={`items.${current}.caption`}
                value={item?.caption ?? ""}
                placeholder="Tambah caption..."
                onUpdateField={(_, __, val) => onUpdateCaption?.(current, val)}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            ) : (
              item?.caption
            )}
          </p>
        )}

        <PhotoCredit
          credit={item?.image_credit}
          className="text-xs text-white/50 mt-2"
          section="gallery"
          fieldKey={`items.${current}.image_credit.name`}
          onUpdateField={(_, __, val) => onUpdateCredit?.(current, val)}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        />
      </div>
    </div>
  );
}

export default function GalleryVideoGrid(props: GalleryVideoGridProps) {
  const {
    gallery,
    design_token,
    isEditorMode,
    isSelected,
    onUpdateField,
    collapseSheetForInlineEdit,
    onEditingStateChange,
    onReplaceImage,
    onRemoveItem,
    onMoveItem,
    onAddItem,
    radius: radiusProp,
    setLightboxIndex,
    onUpdateCaption: onUpdateCaptionProp,
    onUpdateCredit: onUpdateCreditProp,
  } = props;

  const [videoIndex, setVideoIndex] = useState<number | null>(null);
  const [internalLightbox, setInternalLightbox] = useState<number | null>(null);

  const isEN = props.isEN ?? props.language === "en";
  const strings: VideoGridStrings = {
    playVideo: isEN ? "Play video" : "Putar video",
    close: isEN ? "Close" : "Tutup",
    videoDialog: isEN ? "Video player" : "Pemutar video",
    imageAlt: isEN ? "Gallery image" : "Gambar galeri",
  };

  const galleryData = gallery ?? { title: "", items: [] };
  const items = props.items ?? galleryData.items ?? [];
  const radius = radiusProp ?? getRadius(design_token);

  const onUpdateCaption =
    onUpdateCaptionProp ??
    ((idx: number, val: string) => {
      const next = [...items];
      if (!next[idx]) return;
      next[idx] = { ...next[idx], caption: val };
      onUpdateField?.("gallery", "items", next);
    });

  const onUpdateCredit =
    onUpdateCreditProp ??
    ((idx: number, val: string) => {
      const next = [...items];
      const cur = next[idx];
      if (!cur) return;
      next[idx] = {
        ...cur,
        image_credit: cur.image_credit
          ? { ...cur.image_credit, name: val }
          : { name: val, url: "" },
      };
      onUpdateField?.("gallery", "items", next);
    });

  const replaceImage =
    onReplaceImage ??
    ((idx: number, url: string) => {
      const next = [...items];
      if (!next[idx]) return;
      next[idx] = { ...next[idx], image_url: url, video_url: undefined };
      onUpdateField?.("gallery", "items", next);
    });

  const removeItem =
    onRemoveItem ??
    ((idx: number) => {
      const next = [...items];
      next.splice(idx, 1);
      onUpdateField?.("gallery", "items", next);
    });

  const moveItem =
    onMoveItem ??
    ((idx: number, dir: -1 | 1) => {
      const next = [...items];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return;
      [next[idx], next[j]] = [next[j], next[idx]];
      onUpdateField?.("gallery", "items", next);
    });

  const addItem =
    onAddItem ??
    ((url: string) => {
      onUpdateField?.("gallery", "items", [...items, { image_url: url, caption: "" }]);
    });

  const handleOpen = (idx: number) => {
    if (isEditorMode) return;
    const item = items[idx];
    if (item?.video_url) {
      setVideoIndex(idx);
      return;
    }
    if (setLightboxIndex) setLightboxIndex(idx);
    else setInternalLightbox(idx);
  };

  if (items.length === 0 && !isEditorMode) return null;

  const ItemTag = isEditorMode ? "div" : "button";
  const hasGallery = !!gallery;

  return (
    <>
      {hasGallery && (
        <div className="space-y-8 md:space-y-10">
          <GallerySectionHeader
            gallery={galleryData}
            design_token={design_token}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            onUpdateField={onUpdateField}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            onAddItem={isEditorMode ? addItem : undefined}
          />
        </div>
      )}

      {isEditorMode && items.length === 0 ? (
        <div className="max-w-md mx-auto">
          <GalleryAddTile
            onAdd={addItem}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            style={{ borderRadius: radius, aspectRatio: "4 / 3" }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map((item, idx) => {
            const hasVideo = !!item.video_url;
            return (
              <ItemTag
                key={idx}
                {...(!isEditorMode ? { type: "button" as const } : {})}
                onClick={() => handleOpen(idx)}
                aria-label={hasVideo ? strings.playVideo : item.caption || strings.imageAlt}
                className="group relative overflow-hidden bg-cover bg-center shadow-sm hover:shadow-lg transition-all duration-300 text-left cursor-pointer p-0 border-0 w-full"
                style={{ borderRadius: radius, aspectRatio: "4 / 3", background: "var(--dt-surface, #f1f5f9)" }}
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.alt_text || item.caption || strings.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/25 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: "color-mix(in srgb, var(--dt-primary, #000) 65%, rgba(0,0,0,0.55))" }}
                    >
                      <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                    </span>
                  </div>
                )}

                {(item.caption || isEditorMode) && (
                  <div className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent ${isEditorMode ? "opacity-100 z-30 pointer-events-auto" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`}>
                    {isEditorMode ? (
                      <InlineText
                        section="gallery"
                        fieldKey={`items.${idx}.caption`}
                        value={item.caption || ""}
                        placeholder="Tambah caption..."
                        onUpdateField={(_, __, val) => onUpdateCaption(idx, val)}
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

                {(item.image_credit?.name || isEditorMode) && (
                  <div className="absolute bottom-1 right-2 z-10">
                    <PhotoCredit
                      credit={item.image_credit}
                      className="text-[10px] text-white/60"
                      section="gallery"
                      fieldKey={`items.${idx}.image_credit.name`}
                      onUpdateField={(_, __, val) => onUpdateCredit(idx, val)}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    />
                  </div>
                )}

                {isEditorMode && (
                  <GalleryTileOverlay
                    idx={idx}
                    total={items.length}
                    isSelected={isSelected}
                    onReplace={replaceImage}
                    onRemove={removeItem}
                    onMove={moveItem}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  />
                )}
              </ItemTag>
            );
          })}

          {isEditorMode && (
            <GalleryAddTile
              onAdd={addItem}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              style={{ borderRadius: radius, aspectRatio: "4 / 3" }}
            />
          )}
        </div>
      )}

      {videoIndex !== null && (
        <VideoModal
          items={items}
          index={videoIndex}
          onClose={() => setVideoIndex(null)}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          onUpdateCaption={onUpdateCaption}
          onUpdateCredit={onUpdateCredit}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
          strings={strings}
        />
      )}

      {!setLightboxIndex && internalLightbox !== null && (
        <Lightbox
          items={items}
          index={internalLightbox}
          onClose={() => setInternalLightbox(null)}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          onUpdateCaption={onUpdateCaption}
          onUpdateCredit={onUpdateCredit}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      )}
    </>
  );
}
