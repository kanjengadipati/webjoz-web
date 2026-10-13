"use client";
import React, { useEffect, useState } from "react";
import { Play, Star, X } from "lucide-react";
import { InlineText, InlineImage } from "../../templates/shared";
import { InlineAddTile } from "../inline-add";
import { headingVars, avatarTextColor } from "../../templates/helpers";
import type { TemplateProps, DesignToken, TestimonialItem } from "../../templates/types";

interface TestimonialsVariantProps {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: unknown) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
  language?: "id" | "en";
}

type WallItem = TestimonialItem & { video_url?: string | null };

function getVideoEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) return url;
  return null;
}

function getYoutubeThumb(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function getInitials(item: WallItem): string {
  if (item.avatar_initials?.trim()) return item.avatar_initials.trim();
  const fromName = item.name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return fromName || "?";
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          strokeWidth={1.5}
          style={{
            fill: i < Math.round(rating) ? "var(--dt-primary)" : "transparent",
            color:
              i < Math.round(rating)
                ? "var(--dt-primary)"
                : "color-mix(in srgb, var(--dt-text-muted) 45%, transparent)",
          }}
        />
      ))}
    </div>
  );
}

export default function TestimonialsVideoWall({
  testimonials: t,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onAddItem,
  language = "id",
}: TestimonialsVariantProps) {
  const isEN = language === "en";
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeVideo]);

  if (!t) return null;
  const items = (t.items ?? []) as WallItem[];
  if (!items.length && !(isEditorMode && onAddItem)) return null;

  const labelWatch = isEN ? "Watch" : "Tonton";
  const labelPlay = isEN ? "Play video" : "Putar video";
  const labelClose = isEN ? "Close video" : "Tutup video";
  const labelRemove = isEN ? "Remove testimonial" : "Hapus testimoni";
  const labelAdd = isEN ? "Add Testimonial" : "Tambah Testimoni";
  const labelEmpty = isEN
    ? "No testimonials yet. Add real testimonial data."
    : "Belum ada testimoni. Tambahkan data testimoni asli.";
  const placeholderQuote = isEN
    ? "Write the customer testimonial here..."
    : "Tulis testimoni pelanggan di sini...";
  const placeholderName = isEN ? "Customer name" : "Nama Pelanggan";
  const placeholderRole = isEN ? "Position / Role" : "Jabatan / Peran";
  const placeholderAlt = isEN ? "Testimonial photo" : "Foto testimoni";

  const activeEmbed = getVideoEmbedUrl(activeVideo);
  const activeIsRaw = !!activeEmbed && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(activeEmbed);
  const activeItem = items.find((it) => (it.video_url ?? null) === activeVideo);

  return (
    <section
      id="testimonials"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          {(t.eyebrow || isEditorMode) && (
            <InlineText
              section="testimonials"
              fieldKey="eyebrow"
              value={t.eyebrow}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--dt-primary)",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          )}
          <InlineText
            section="testimonials"
            fieldKey="title"
            value={t.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h2"
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight)" as React.CSSProperties["fontWeight"],
              fontSize: "clamp(1.35rem, 4.5cqw, 2.1rem)",
              color: "var(--dt-text)",
              marginTop: t.eyebrow ? "0.5rem" : 0,
              ...headingVars,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
          {(t.subtitle || isEditorMode) && (
            <InlineText
              section="testimonials"
              fieldKey="subtitle"
              value={t.subtitle}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              style={{
                color: "var(--dt-text-muted)",
                fontSize: "0.95rem",
                marginTop: "0.5rem",
                lineHeight: 1.6,
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          )}
        </div>

        {/* UGC / video wall (CSS multi-column masonry on large screens, single column on mobile) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {items.map((item, idx) => {
            const rawVideo = item.video_url ?? null;
            const hasVideo = !!getVideoEmbedUrl(rawVideo);
            const photo = item.avatar_url ?? null;
            const rating = item.rating ?? 0;
            const initials = getInitials(item);
            const accent = item.avatar_color || "var(--dt-primary)";
            const ytThumb = getYoutubeThumb(rawVideo);
            const accentGradient = `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 55%, #000))`;

            const deleteButton = isEditorMode && onUpdateField && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const updated = items.filter((_, i) => i !== idx);
                  onUpdateField("testimonials", "items", updated);
                }}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all cursor-pointer z-30 shadow-sm border border-red-500/20"
                title={labelRemove}
                aria-label={labelRemove}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            );

            return (
              <div
                key={idx}
                className="relative group mb-4 break-inside-avoid overflow-hidden"
                style={{
                  background: "var(--dt-surface)",
                  border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                  borderRadius: "var(--dt-radius-lg)",
                  boxShadow: "0 2px 12px color-mix(in srgb, var(--dt-primary) 8%, transparent)",
                }}
              >
                {deleteButton}

                {/* Media (video thumbnail or photo) */}
                <div
                  className="relative w-full aspect-[4/5] overflow-hidden"
                  onClick={hasVideo && !isEditorMode ? () => setActiveVideo(rawVideo) : undefined}
                  style={{ cursor: hasVideo && !isEditorMode ? "zoom-in" : undefined }}
                >
                  {photo || isEditorMode ? (
                    <InlineImage
                      section="testimonials"
                      fieldKey={`items.${idx}.avatar_url`}
                      src={photo ?? ""}
                      alt={item.name || placeholderAlt}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      className="w-full h-full object-cover"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: ytThumb
                          ? `linear-gradient(color-mix(in srgb, #000 35%, transparent), color-mix(in srgb, #000 35%, transparent)), ${accentGradient}`
                          : accentGradient,
                        backgroundImage: ytThumb ? `url(${ytThumb})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      aria-hidden="true"
                    >
                      <span className="text-3xl font-black" style={{ color: avatarTextColor(accent) }}>
                        {initials}
                      </span>
                    </div>
                  )}

                  {hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span
                        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg"
                        style={{
                          background: "color-mix(in srgb, var(--dt-surface) 72%, transparent)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid color-mix(in srgb, var(--dt-primary) 40%, transparent)",
                        }}
                        title={labelPlay}
                      >
                        <Play
                          className="w-6 h-6 ml-0.5"
                          style={{ fill: "var(--dt-primary)", color: "var(--dt-primary)" }}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  )}

                  {hasVideo && (
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider pointer-events-none"
                      style={{ background: "color-mix(in srgb, var(--dt-primary) 85%, transparent)", color: "#fff" }}
                    >
                      {labelWatch}
                    </span>
                  )}

                  {rating > 0 && (
                    <span
                      className="absolute top-3 right-3 px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold pointer-events-none"
                      style={{ background: "color-mix(in srgb, #000 55%, transparent)", color: "#fff", backdropFilter: "blur(4px)" }}
                    >
                      {rating.toFixed(1)}
                      <Star className="w-3 h-3" style={{ fill: "#FBBC05", color: "#FBBC05" }} aria-hidden="true" />
                    </span>
                  )}
                </div>

                {/* Quote + identity */}
                <div className="p-4 flex flex-col gap-3">
                  <InlineText
                    section="testimonials"
                    fieldKey={`items.${idx}.quote`}
                    value={item.quote ?? ""}
                    placeholder={placeholderQuote}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="p"
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--dt-text)" }}
                    multiline
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />

                  {rating > 0 && <StarRow rating={rating} />}

                  <div
                    className="flex items-center gap-3 pt-2"
                    style={{ borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{ background: accent, color: avatarTextColor(accent) }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <InlineText
                        section="testimonials"
                        fieldKey={`items.${idx}.name`}
                        value={item.name ?? ""}
                        placeholder={placeholderName}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="p"
                        className="text-sm font-bold leading-tight"
                        style={{ color: "var(--dt-text)" }}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                      {(item.role || isEditorMode) && (
                        <InlineText
                          section="testimonials"
                          fieldKey={`items.${idx}.role`}
                          value={item.role ?? ""}
                          placeholder={placeholderRole}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          as="p"
                          className="text-xs"
                          style={{ color: "var(--dt-text-muted)" }}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isEditorMode && onAddItem && (
            <div className="mb-4 break-inside-avoid">
              <InlineAddTile
                label={labelAdd}
                variant="card"
                className="rounded-2xl min-h-[220px] w-full"
                style={{ borderRadius: "var(--dt-radius-lg)" }}
                onClick={onAddItem}
              />
            </div>
          )}
        </div>

        {isEditorMode && items.length === 0 && !onAddItem && (
          <p style={{ textAlign: "center", color: "var(--dt-text-muted)", fontSize: "0.8rem", marginTop: "2rem" }}>
            {labelEmpty}
          </p>
        )}
      </div>

      {/* Lightweight, dependency-free video lightbox */}
      {activeVideo && activeEmbed && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.82)" }}
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={labelPlay}
        >
          <button
            type="button"
            onClick={() => setActiveVideo(null)}
            aria-label={labelClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            {activeIsRaw ? (
              <video
                src={activeEmbed}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl bg-black"
              />
            ) : (
              <iframe
                src={activeEmbed}
                title={activeItem?.name || (isEN ? "Testimonial video" : "Video testimoni")}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-2xl bg-black"
                style={{ width: "min(840px, 90vw)", height: "min(473px, 60vh)", border: "none" }}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
