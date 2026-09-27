"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import type { GalleryVariantProps } from "./shared";
import { GallerySectionHeader, useGalleryUpload, GalleryAddTile, getRadius } from "./shared";

interface BeforeAfterItem {
  before_url?: string | null;
  after_url?: string | null;
  caption?: string | null;
}

type Props = Omit<GalleryVariantProps, "gallery"> & {
  gallery: GalleryVariantProps["gallery"] & {
    before_after_items?: BeforeAfterItem[];
  };
};

function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  caption,
  radius,
  isEditorMode,
  onReplaceBefore,
  onReplaceAfter,
  collapseSheetForInlineEdit,
}: {
  beforeUrl: string;
  afterUrl: string;
  caption?: string | null;
  radius: string;
  isEditorMode?: boolean;
  onReplaceBefore?: (url: string) => void;
  onReplaceAfter?: (url: string) => void;
  collapseSheetForInlineEdit?: () => void;
}) {
  const [position, setPosition] = useState(50); // percentage 0-100
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updatePosition(e.clientX);
    const onTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updatePosition]);

  const beforeUpload = useGalleryUpload({
    onUrl: (url) => onReplaceBefore?.(url),
    collapseSheetForInlineEdit,
  });
  const afterUpload = useGalleryUpload({
    onUrl: (url) => onReplaceAfter?.(url),
    collapseSheetForInlineEdit,
  });

  const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='800' height='500' fill='%23333'/%3E%3C/svg%3E";

  return (
    <div style={{ position: "relative" }}>
      {/* Slider container */}
      <div
        ref={containerRef}
        onTouchStart={(e) => {
          setDragging(true);
          updatePosition(e.touches[0].clientX);
        }}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: radius,
          aspectRatio: "16 / 9",
          cursor: dragging ? "ew-resize" : "col-resize",
          userSelect: "none",
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* AFTER image (full width, behind) */}
        <img
          src={afterUrl || placeholder}
          alt="After"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />

        {/* BEFORE image (clipped to left side) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            width: `${position}%`,
          }}
        >
          <img
            src={beforeUrl || placeholder}
            alt="Before"
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: `${10000 / position}%`, // compensate for clip-width
              maxWidth: "none",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Before label */}
        <span
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            backdropFilter: "blur(4px)",
            pointerEvents: "none",
          }}
        >
          Before
        </span>

        {/* After label */}
        <span
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: `color-mix(in srgb, var(--dt-primary) 80%, rgba(0,0,0,0.4))`,
            color: "#fff",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            backdropFilter: "blur(4px)",
            pointerEvents: "none",
          }}
        >
          After
        </span>

        {/* Divider line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${position}%`,
            width: "3px",
            background: "rgba(255,255,255,0.9)",
            transform: "translateX(-50%)",
            boxShadow: "0 0 8px rgba(0,0,0,0.4)",
            pointerEvents: "none",
          }}
        />

        {/* Drag handle */}
        <div
          onMouseDown={onMouseDown}
          style={{
            position: "absolute",
            top: "50%",
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "ew-resize",
            zIndex: 10,
            transition: dragging ? "none" : "transform 0.1s",
          }}
        >
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
            <path d="M5 6H1M1 6L4 3M1 6L4 9" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 6H19M19 6L16 3M19 6L16 9" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="10" y1="1" x2="10" y2="11" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Editor controls */}
      {isEditorMode && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={beforeUpload.openPicker}
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "0.3rem 0.8rem",
              border: `1px solid color-mix(in srgb, var(--dt-primary) 30%, transparent)`,
              borderRadius: "999px",
              background: `color-mix(in srgb, var(--dt-primary) 8%, var(--dt-bg))`,
              color: "var(--dt-text)",
              cursor: "pointer",
            }}
          >
            Ganti Before
          </button>
          <button
            onClick={afterUpload.openPicker}
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "0.3rem 0.8rem",
              border: `1px solid color-mix(in srgb, var(--dt-primary) 30%, transparent)`,
              borderRadius: "999px",
              background: `color-mix(in srgb, var(--dt-primary) 8%, var(--dt-bg))`,
              color: "var(--dt-text)",
              cursor: "pointer",
            }}
          >
            Ganti After
          </button>
        </div>
      )}

      {caption && (
        <p
          style={{
            textAlign: "center",
            marginTop: "0.75rem",
            fontSize: "0.8rem",
            color: "var(--dt-text-muted)",
            fontStyle: "italic",
          }}
        >
          {caption}
        </p>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={beforeUpload.fileInputRef}
        accept="image/*"
        onChange={beforeUpload.handleFile}
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={afterUpload.fileInputRef}
        accept="image/*"
        onChange={afterUpload.handleFile}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default function GalleryBeforeAfterSlider({
  gallery,
  design_token,
  sectionStyle,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: Props) {
  const radius = getRadius(design_token);

  // Derive before_after_items from gallery.items (pair adjacent items) or explicit field
  const rawItems = gallery.items ?? [];
  const pairs: BeforeAfterItem[] = [];
  if ((gallery as any).before_after_items?.length) {
    pairs.push(...(gallery as any).before_after_items);
  } else {
    // Pair adjacent images: [0,1] → pair1, [2,3] → pair2, etc.
    for (let i = 0; i + 1 < rawItems.length; i += 2) {
      pairs.push({
        before_url: rawItems[i]?.image_url ?? undefined,
        after_url: rawItems[i + 1]?.image_url ?? undefined,
        caption: rawItems[i]?.caption || rawItems[i + 1]?.caption || undefined,
      });
    }
    // If odd number, add last as solo
    if (rawItems.length % 2 === 1 && rawItems.length > 0) {
      const last = rawItems[rawItems.length - 1];
      pairs.push({
        before_url: last.image_url ?? undefined,
        after_url: last.image_url ?? undefined,
        caption: last.caption ?? undefined,
      });
    }
  }

  const onAddPair = useCallback(() => {
    const newItems = [
      ...(gallery.items ?? []),
      { image_url: "", caption: "Before" },
      { image_url: "", caption: "After" },
    ];
    onUpdateField?.("gallery", "items", newItems);
  }, [gallery.items, onUpdateField]);

  const headerProps = {
    gallery,
    design_token,
    isEditorMode,
    isSelected,
    onUpdateField,
    collapseSheetForInlineEdit,
    onEditingStateChange,
    onAddItem: isEditorMode ? onAddPair : undefined,
  };

  const isEmpty = pairs.length === 0;

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
      <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
        <GallerySectionHeader {...headerProps} />

        {isEditorMode && isEmpty ? (
          <div className="max-w-md mx-auto">
            <GalleryAddTile
              onAdd={onAddPair}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              style={{ borderRadius: radius, aspectRatio: "16 / 9" }}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {pairs.map((pair, idx) => (
              <BeforeAfterSlider
                key={idx}
                beforeUrl={pair.before_url ?? ""}
                afterUrl={pair.after_url ?? ""}
                caption={pair.caption}
                radius={radius}
                isEditorMode={isEditorMode}
                onReplaceBefore={(url) => {
                  const items = [...(gallery.items ?? [])];
                  const itemIdx = idx * 2;
                  if (items[itemIdx]) items[itemIdx] = { ...items[itemIdx], image_url: url };
                  onUpdateField?.("gallery", "items", items);
                }}
                onReplaceAfter={(url) => {
                  const items = [...(gallery.items ?? [])];
                  const itemIdx = idx * 2 + 1;
                  if (items[itemIdx]) items[itemIdx] = { ...items[itemIdx], image_url: url };
                  onUpdateField?.("gallery", "items", items);
                }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              />
            ))}
          </div>
        )}

        {isEditorMode && !isEmpty && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GalleryAddTile
              onAdd={onAddPair}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              style={{ borderRadius: radius, aspectRatio: "4/1", maxWidth: "20rem" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
