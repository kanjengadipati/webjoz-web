"use client";

import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Camera, Link2, Check, X, Loader2 } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { uploadImageFile } from "@/components/file-upload";

// ─── Global AI Rewrite Singleton ─────────────────────────────────────────────
// Set by the dashboard editor (page.tsx) so InlineText doesn't need to receive
// token/siteId as props through every intermediate component.

type GlobalAiRewriteFn = (
  section: string,
  fieldKey: string,
  currentValue: string,
) => Promise<string>;

let _globalAiRewrite: GlobalAiRewriteFn | null = null;

/** Register (or unregister) the AI rewrite handler from the editor page. */
export function setInlineAiRewrite(fn: GlobalAiRewriteFn | null) {
  _globalAiRewrite = fn;
}

// ─── InlineText ──────────────────────────────────────────────────────────────

/** Threshold: show AI button if text has at least this many words. */
const AI_MIN_WORDS = 4;

function cleanAiText(raw: string): string {
  let cleaned = raw.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

export interface InlineTextProps {
  section: string;
  fieldKey: string;
  value?: string | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  as?: React.ElementType;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  placeholder?: string;
  children?: React.ReactNode;
  /**
   * Callback AI rewrite. Jika disediakan dan field cukup panjang (multiline
   * atau ≥ AI_MIN_WORDS kata), SparkleIcon akan muncul di pojok kanan atas.
   * Parent bertanggung jawab atas token/siteId — cukup return string hasil.
   * Throw error jika gagal, InlineText akan handle toast-nya sendiri.
   */
  onAiRewrite?: (currentValue: string) => Promise<string>;
}

export function InlineText({
  section,
  fieldKey,
  value,
  onUpdateField,
  isEditorMode,
  isSelected,
  multiline = false,
  className = "",
  style,
  id,
  as: Component = "span",
  collapseSheetForInlineEdit,
  onEditingStateChange,
  placeholder,
  children,
  onAiRewrite,
}: InlineTextProps) {
  const { t } = useI18n();
  const elementRef = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLElement | null>(null);
  const isInteractingWithAiButtonRef = useRef(false);
  const [isFocused, setIsFocused] = useState(false);
  const [aiWriting, setAiWriting] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const hasValue =
    (value !== undefined && value !== null && value !== "") ||
    (typeof children === "string" && children !== "");
  const currentDisplay = hasValue
    ? value ?? (typeof children === "string" ? children : "")
    : placeholder ?? "";

  // Resolve AI rewrite fn: prop takes priority, then global singleton
  const resolvedOnAiRewrite = onAiRewrite ?? (
    _globalAiRewrite
      ? (currentValue: string) => _globalAiRewrite!(section, fieldKey, currentValue)
      : undefined
  );

  // Show AI button when: editor mode, ai rewrite available, field is multiline OR has enough words
  const wordCount = (currentDisplay || "").trim().split(/\s+/).filter(Boolean).length;
  const showAiButton = !!(isEditorMode && onUpdateField && resolvedOnAiRewrite && (multiline || wordCount >= AI_MIN_WORDS));

  // Keep DOM in sync when value changes from outside (e.g. undo, AI regen)
  useEffect(() => {
    if (elementRef.current && !isFocused) {
      elementRef.current.innerText = currentDisplay;
    }
  }, [currentDisplay, isFocused]);

  // Auto-clear AI error after 3s
  useEffect(() => {
    if (!aiError) return;
    const t = setTimeout(() => setAiError(null), 3000);
    return () => clearTimeout(t);
  }, [aiError]);

  const Comp = (Component || "span") as React.ElementType;

  if (!isEditorMode || !onUpdateField) {
    return (
      <Comp id={id} className={className} style={style}>
        {children ?? value ?? placeholder}
      </Comp>
    );
  }

  const handleFocus = () => {
    setIsFocused(true);
    collapseSheetForInlineEdit?.();
    onEditingStateChange?.(true);
    if (!hasValue && placeholder && elementRef.current) {
      elementRef.current.innerText = "";
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    // If user is currently touching or clicking the AI rewrite button, don't dismiss
    if (isInteractingWithAiButtonRef.current) {
      return;
    }
    setIsFocused(false);
    onEditingStateChange?.(false);
    const newText = e.currentTarget.innerText.trim();
    if (newText === "") {
      if (hasValue) {
        onUpdateField(section, fieldKey, "");
      }
      if (placeholder && elementRef.current) {
        elementRef.current.innerText = placeholder;
      }
    } else if (newText !== (value || "").trim()) {
      onUpdateField(section, fieldKey, newText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (elementRef.current) {
        elementRef.current.innerText = currentDisplay;
      }
      e.currentTarget.blur();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const parentInteractive = (e.target as HTMLElement)?.closest("a, button");
    if (parentInteractive && !(e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      elementRef.current?.focus();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    e.stopPropagation();
    // On mobile touch, ensure the editable element focuses immediately
    if (!isFocused && elementRef.current) {
      elementRef.current.focus();
    }
  };

  const handleAiRewrite = async (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!resolvedOnAiRewrite || aiWriting) return;
    isInteractingWithAiButtonRef.current = false;
    // Grab current DOM text (may be more up-to-date than `value` prop)
    const liveText = elementRef.current?.innerText?.trim() || value || "";
    setAiWriting(true);
    setAiError(null);
    try {
      let result = await resolvedOnAiRewrite(liveText);
      if (typeof result === "string" && result.trim()) {
        result = cleanAiText(result);
        onUpdateField(section, fieldKey, result);
        // Sync DOM immediately
        if (elementRef.current) {
          elementRef.current.innerText = result;
        }
      }
    } catch (err: any) {
      setAiError(err?.message || "AI gagal menulis ulang teks.");
    } finally {
      setAiWriting(false);
      isInteractingWithAiButtonRef.current = false;
    }
  };

  const isShowingPlaceholder = !hasValue && !!placeholder && !isFocused;
  // Icon AI baru muncul saat user klik/fokus ke input text (atau saat AI sedang menulis)
  const showAiBadge = showAiButton && (isFocused || aiWriting);

  const editableEl = (
    <Comp
      id={id}
      ref={elementRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none transition-all cursor-text select-text ${
        isFocused
          ? "ring-1 ring-primary/70 rounded-[2px]"
          : "hover:outline-dashed hover:outline-1 hover:outline-primary/50 hover:bg-primary/[0.03] rounded-[2px]"
      } ${isShowingPlaceholder ? "opacity-50 italic" : ""} ${showAiButton ? "" : ""} ${className}`}
      style={{
        ...style,
        ...(!currentDisplay
          ? {
              minWidth: "1.5rem",
              minHeight: "1.25em",
              display: style?.display || (multiline ? "block" : "inline-block"),
            }
          : {}),
      }}
      title={t("dashboard.sitesEditor.inlineClickToEdit")}
    >
      {currentDisplay}
    </Comp>
  );

  // If no AI button needed, render as before
  if (!showAiButton) return editableEl;

  // With AI button: wrap in relative container so we can position the icon
  return (
    <span
      ref={wrapperRef}
      className={`relative ${multiline ? "block" : "inline-block"} max-w-full`}
    >
      {editableEl}

      {/* AI Sparkle Button — top-right corner, only appears when user clicks/focuses text */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          isInteractingWithAiButtonRef.current = true;
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          isInteractingWithAiButtonRef.current = true;
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          isInteractingWithAiButtonRef.current = true;
        }}
        onClick={handleAiRewrite}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAiRewrite(e);
        }}
        disabled={aiWriting}
        aria-label="Tulis ulang dengan AI"
        title={aiWriting ? "AI sedang menulis..." : "Tulis ulang dengan AI"}
        className={`absolute -top-3 -right-3 sm:-top-2.5 sm:-right-2.5 z-30 flex items-center justify-center w-7 h-7 sm:w-5 sm:h-5 rounded-full shadow-md border border-amber-400/70 transition-all duration-150 cursor-pointer
          before:absolute before:-inset-2 before:content-['']
          ${showAiBadge ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
          ${aiWriting
            ? "bg-amber-500 text-white cursor-wait"
            : "bg-slate-900/90 hover:bg-amber-500 text-amber-400 hover:text-white hover:border-amber-500 hover:scale-110 active:scale-95"}
        `}
      >
        {aiWriting
          ? <Loader2 className="w-3.5 h-3.5 sm:w-3 sm:h-3 animate-spin" />
          : <SparkleIcon className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
        }
      </button>

      {/* Error tooltip */}
      {aiError && (
        <div className="absolute -bottom-6 right-0 max-w-[85vw] sm:max-w-xs z-40 text-[10px] text-red-400 bg-slate-900/95 px-2 py-0.5 rounded shadow-lg whitespace-normal border border-red-500/30 pointer-events-none">
          {aiError}
        </div>
      )}
    </span>
  );
}

// ─── InlineImage ─────────────────────────────────────────────────────────────

export interface InlineImageProps {
  section: string;
  fieldKey: string;
  src?: string | null;
  alt?: string;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  className?: string;
  style?: React.CSSProperties;
  collapseSheetForInlineEdit?: () => void;
  compact?: boolean;
  fallbackIcon?: React.ReactNode;
  isBackground?: boolean;
  overlayPosition?: "center" | "top-right" | "bottom-right" | "bottom-left" | "top-left";
}

export const DEFAULT_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80",
];

export function InlineImage({
  section,
  fieldKey,
  src,
  alt = "",
  onUpdateField,
  isEditorMode,
  isSelected,
  className = "",
  style,
  collapseSheetForInlineEdit,
  compact,
  fallbackIcon,
  isBackground = false,
  overlayPosition: explicitOverlayPosition,
}: InlineImageProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const urlInputRef = useRef<HTMLInputElement>(null);
  // Touch device: tap to reveal overlay, auto-dismiss after 2.5s
  const [isTouched, setIsTouched] = useState(false);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const overlayPos = explicitOverlayPosition ?? (isBackground ? "top-right" : "center");
  const positionClasses = {
    center: "items-center justify-center p-4",
    "top-right": "items-start justify-end p-4 sm:p-6",
    "bottom-right": "items-end justify-end p-4 sm:p-6",
    "bottom-left": "items-end justify-start p-4 sm:p-6",
    "top-left": "items-start justify-start p-4 sm:p-6",
  }[overlayPos];

  const backdropClass = isBackground
    ? "bg-transparent pointer-events-none"
    : "bg-black/40 backdrop-blur-[1.5px]";

  const pointerEventsClass = isBackground
    ? "pointer-events-none"
    : isSelected || showUrlInput || isTouched
      ? "pointer-events-auto"
      : "group-hover/inline-img:pointer-events-auto";

  const handleTouchReveal = (e: React.TouchEvent) => {
    if (showUrlInput) return;
    e.stopPropagation();
    if (isTouched) {
      setIsTouched(false);
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    } else {
      setIsTouched(true);
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      touchTimerRef.current = setTimeout(() => setIsTouched(false), 2500);
    }
  };

  const isCompact =
    compact ??
    (fieldKey.toLowerCase().includes("logo") ||
      fieldKey.toLowerCase().includes("avatar") ||
      fieldKey.toLowerCase().includes("icon"));

  if (!isEditorMode || !onUpdateField) {
    if (!src) return null;
    const resolvedPosition =
      style?.objectPosition || (section === "hero" ? "center 20%" : undefined);
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          ...(resolvedPosition ? { objectPosition: resolvedPosition } : {}),
        }}
      />
    );
  }

  const handleTriggerUpload = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    collapseSheetForInlineEdit?.();
    fileInputRef.current?.click();
  };

  const handleRandomPhoto = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    collapseSheetForInlineEdit?.();
    const currentSrc = src || "";
    const available = DEFAULT_IMAGE_POOL.filter((u) => u !== currentSrc);
    const chosen =
      available[Math.floor(Math.random() * available.length)] ||
      DEFAULT_IMAGE_POOL[0];
    onUpdateField(section, fieldKey, chosen);
  };

  const handleOpenUrlInput = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    collapseSheetForInlineEdit?.();
    setUrlInput(src || "");
    setShowUrlInput(true);
    setTimeout(() => {
      urlInputRef.current?.focus();
      urlInputRef.current?.select();
    }, 50);
  };

  const handleSaveUrl = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const trimmed = urlInput.trim();
    if (trimmed) {
      onUpdateField(section, fieldKey, trimmed);
    }
    setShowUrlInput(false);
  };

  const handleCancelUrl = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setShowUrlInput(false);
    setUrlInput("");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const secureUrl = await uploadImageFile(file);
      onUpdateField(section, fieldKey, secureUrl);
    } catch (err: any) {
      console.error("Upload image error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={handleTouchReveal}
      className={`relative group/inline-img overflow-hidden ${className}`}
      style={style}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`w-full h-full ${isCompact ? "object-contain" : "object-cover"}`}
          style={{
            objectFit: style?.objectFit,
            objectPosition:
              style?.objectPosition ||
              (section === "hero" ? "center 20%" : undefined),
          }}
        />
      ) : isCompact ? (
        <div
          onClick={handleTriggerUpload}
          title={t("dashboard.sitesEditor.addPhoto")}
          className="w-full h-full min-h-[32px] flex items-center justify-center cursor-pointer group/compact-ph"
        >
          {fallbackIcon ? (
            <div className="relative flex items-center justify-center">
              {fallbackIcon}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-opacity ${
                  isTouched
                    ? "opacity-100"
                    : "opacity-0 group-hover/inline-img:opacity-100"
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-muted/40 border border-dashed border-border flex items-center justify-center text-primary">
              <Camera className="w-4 h-4" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleTriggerUpload}
          className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 bg-muted/40 text-muted-foreground border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/60 transition-colors"
        >
          <Camera className="w-6 h-6 mb-1 opacity-60 text-primary" />
          <span className="text-[11px] font-semibold text-foreground">
            {t("dashboard.sitesEditor.addPhoto")}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 mb-2">
            Klik untuk unggah
          </span>
          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleRandomPhoto}
              title="Foto acak (Unsplash)"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-background/80 hover:bg-background border border-border shadow-xs text-amber-500 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <SparkleIcon className="w-3 h-3 text-amber-500" />
              <span>Acak</span>
            </button>
            <button
              type="button"
              onClick={handleOpenUrlInput}
              title="Masukkan tautan URL foto"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-background/80 hover:bg-background border border-border shadow-xs text-foreground transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Link2 className="w-3 h-3 text-muted-foreground" />
              <span>URL</span>
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Hover overlay or URL input – position/backdrop driven by isBackground/overlayPosition */}
      {(src || showUrlInput) && (
        <div
          className={`absolute inset-0 ${isBackground ? "z-[100]" : "z-30"} flex ${positionClasses} ${backdropClass} transition-all duration-200 pointer-events-none ${
            isBackground
              ? "opacity-100 pointer-events-none"
              : isSelected || showUrlInput || isTouched
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 group-hover/inline-img:opacity-100 group-hover/inline-img:pointer-events-auto"
          }`}
        >
          {showUrlInput ? (
            <div
              className="flex items-center gap-1.5 p-1 bg-slate-900/95 border border-white/20 rounded-full shadow-2xl backdrop-blur-md max-w-[92%] w-72 sm:w-80 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 z-10 relative"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="pl-2.5 text-slate-400 shrink-0">
                <Link2 className="w-3.5 h-3.5" />
              </div>
              <input
                ref={urlInputRef}
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveUrl();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    handleCancelUrl();
                  }
                }}
                placeholder="https://... (URL gambar)"
                className="flex-1 bg-transparent text-white text-xs px-1 py-1 focus:outline-none placeholder:text-slate-400 min-w-0"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveUrl}
                title="Simpan URL"
                className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 transition-colors active:scale-95 cursor-pointer shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCancelUrl}
                title="Batal"
                className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white shrink-0 transition-colors active:scale-95 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : isCompact ? (
            <div className="flex items-center justify-center p-0.5 pointer-events-auto relative z-10">
              <button
                type="button"
                onClick={handleTriggerUpload}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                disabled={uploading}
                title={
                  src
                    ? t("dashboard.sitesEditor.changePhoto")
                    : t("dashboard.sitesEditor.addPhoto")
                }
                className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900/90 text-white shadow-xl border border-white/20 hover:bg-slate-950 hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 backdrop-blur-md"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 p-1 max-w-[90%] pointer-events-auto relative z-10">
              {/* Main Change Photo Button */}
              <button
                type="button"
                onClick={handleTriggerUpload}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                disabled={uploading}
                title={t("dashboard.sitesEditor.changePhoto")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-xl border border-white/20 hover:bg-slate-950 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 backdrop-blur-md"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white" />
                )}
                <span className="whitespace-nowrap">
                  {uploading
                    ? t("dashboard.sitesEditor.uploadingPhoto")
                    : src
                      ? t("dashboard.sitesEditor.changePhoto")
                      : t("dashboard.sitesEditor.addPhoto")}
                </span>
              </button>

              {/* Quick Random Photo Button with Webjoz SparkleIcon */}
              <button
                type="button"
                onClick={handleRandomPhoto}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                disabled={uploading}
                title="Ganti foto acak (Unsplash)"
                className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900/90 text-amber-300 hover:text-amber-200 shadow-xl border border-white/20 hover:bg-slate-950 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 backdrop-blur-md"
              >
                <SparkleIcon className="w-3.5 h-3.5 text-amber-300" />
              </button>

              {/* Quick URL Input Button */}
              <button
                type="button"
                onClick={handleOpenUrlInput}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                disabled={uploading}
                title="Masukkan Link URL Foto"
                className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900/90 text-white/90 hover:text-white shadow-xl border border-white/20 hover:bg-slate-950 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 backdrop-blur-md"
              >
                <Link2 className="w-3.5 h-3.5 text-slate-300" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
