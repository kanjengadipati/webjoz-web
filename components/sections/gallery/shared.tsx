"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play, Camera, Sparkles, Link2, Loader2, Plus, Trash2, Check } from "lucide-react";
import type { GalleryItem, DesignToken } from "@/components/templates/types";
import PhotoCredit from "../PhotoCredit";
import { InlineText, DEFAULT_IMAGE_POOL } from "../../templates/shared";
import { uploadImageFile } from "@/components/file-upload";
import { SparkleIcon } from "@/components/sparkle-icon";

export interface GalleryVariantProps {
  gallery: {
    title: string;
    eyebrow?: string;
    items: GalleryItem[];
    layout?: string;
    autoplay_speed?: number;
    show_dots?: boolean;
    show_arrows?: boolean;
  };
  design_token?: DesignToken | null;
  sectionStyle?: React.CSSProperties;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onReplaceImage?: (idx: number, url: string) => void;
  onRemoveItem?: (idx: number) => void;
  onMoveItem?: (idx: number, dir: -1 | 1) => void;
  onAddItem?: (url: string) => void;
}

export function useGalleryUpload({
  onUrl,
  collapseSheetForInlineEdit,
}: {
  onUrl: (url: string) => void;
  collapseSheetForInlineEdit?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const urlInputRef = useRef<HTMLInputElement>(null);

  const stop = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const openPicker = useCallback(() => {
    collapseSheetForInlineEdit?.();
    fileInputRef.current?.click();
  }, [collapseSheetForInlineEdit]);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        setUploading(true);
        const url = await uploadImageFile(file);
        onUrl(url);
      } catch (err) {
        console.error("Upload gallery image error:", err);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [onUrl]
  );

  const random = useCallback(() => {
    collapseSheetForInlineEdit?.();
    const chosen = DEFAULT_IMAGE_POOL[Math.floor(Math.random() * DEFAULT_IMAGE_POOL.length)];
    onUrl(chosen);
  }, [collapseSheetForInlineEdit, onUrl]);

  const openUrlInput = useCallback((currentUrl?: string) => {
    collapseSheetForInlineEdit?.();
    setUrlInput(currentUrl || "");
    setShowUrlInput(true);
    setTimeout(() => {
      urlInputRef.current?.focus();
      urlInputRef.current?.select();
    }, 50);
  }, [collapseSheetForInlineEdit]);

  const submitUrl = useCallback(() => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onUrl(trimmed);
      setUrlInput("");
      setShowUrlInput(false);
    }
  }, [urlInput, onUrl]);

  const cancelUrl = useCallback(() => {
    setUrlInput("");
    setShowUrlInput(false);
  }, []);

  return {
    fileInputRef,
    uploading,
    stop,
    openPicker,
    handleFile,
    random,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput,
    urlInputRef,
    openUrlInput,
    submitUrl,
    cancelUrl,
  };
}

export function GalleryTileOverlay({
  idx,
  total,
  isSelected,
  onReplace,
  onRemove,
  onMove,
  collapseSheetForInlineEdit,
}: {
  idx: number;
  total: number;
  isSelected?: boolean;
  onReplace?: (idx: number, url: string) => void;
  onRemove?: (idx: number) => void;
  onMove?: (idx: number, dir: -1 | 1) => void;
  collapseSheetForInlineEdit?: () => void;
}) {
  const {
    fileInputRef,
    uploading,
    stop,
    openPicker,
    handleFile,
    random,
    showUrlInput,
    urlInput,
    setUrlInput,
    urlInputRef,
    openUrlInput,
    submitUrl,
    cancelUrl,
  } = useGalleryUpload({
    onUrl: (url) => onReplace?.(idx, url),
    collapseSheetForInlineEdit,
  });

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-opacity duration-200 ${
        isSelected || showUrlInput ? "opacity-100 pointer-events-auto" : ""
      } pointer-coarse:opacity-100 pointer-coarse:pointer-events-auto`}
      onClick={stop}
      onPointerDown={stop}
      onTouchStart={stop}
    >
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFile} className="hidden" />

      {showUrlInput ? (
        <div
          className="flex items-center gap-1.5 p-1 bg-slate-900/95 border border-white/20 rounded-full shadow-2xl backdrop-blur-md max-w-[92%] w-64 sm:w-72 pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
          onClick={stop}
          onPointerDown={stop}
          onTouchStart={stop}
        >
          <div className="pl-2 text-slate-400 shrink-0">
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
                submitUrl();
              } else if (e.key === "Escape") {
                e.preventDefault();
                cancelUrl();
              }
            }}
            placeholder="https://... (URL foto)"
            className="flex-1 bg-transparent text-white text-xs px-1 py-1 focus:outline-none placeholder:text-slate-400 min-w-0"
            autoFocus
          />
          <button
            type="button"
            onClick={(e) => { stop(e); submitUrl(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Simpan URL"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 transition-colors active:scale-95 cursor-pointer shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => { stop(e); cancelUrl(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Batal"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white shrink-0 transition-colors active:scale-95 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 max-w-[92%]">
          <button
            type="button"
            onClick={(e) => { stop(e); openPicker(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            disabled={uploading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-semibold shadow-xl border border-white/20 hover:bg-slate-950 active:scale-95 transition-all cursor-pointer disabled:opacity-50 backdrop-blur-sm"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Camera className="w-3.5 h-3.5 text-white" />}
            <span>Ganti Foto</span>
          </button>
          <button
            type="button"
            onClick={(e) => { stop(e); random(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Ganti foto acak (Unsplash)"
            aria-label="Ganti foto acak"
            className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900/90 text-amber-300 hover:text-amber-200 shadow-xl border border-white/20 hover:bg-slate-950 active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
          >
            <SparkleIcon className="w-3.5 h-3.5 text-amber-300" />
          </button>
          <button
            type="button"
            onClick={(e) => { stop(e); openUrlInput(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Masukkan URL foto"
            aria-label="Masukkan URL foto"
            className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900/90 text-white/90 hover:text-white shadow-xl border border-white/20 hover:bg-slate-950 active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {(onRemove || onMove) && total > 1 && (
        <div className="flex items-center gap-1.5 p-1 bg-black/50 rounded-full backdrop-blur-sm">
          <button
            type="button"
            disabled={idx === 0}
            onClick={(e) => { stop(e); onMove?.(idx, -1); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Geser ke kiri"
            aria-label="Geser ke kiri"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-30"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => { stop(e); onRemove?.(idx); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Hapus foto"
            aria-label="Hapus foto"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/80 text-white hover:bg-rose-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            disabled={idx === total - 1}
            onClick={(e) => { stop(e); onMove?.(idx, 1); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Geser ke kanan"
            aria-label="Geser ke kanan"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-30"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function GalleryAddTile({
  onAdd,
  collapseSheetForInlineEdit,
  style,
}: {
  onAdd?: (url: string) => void;
  collapseSheetForInlineEdit?: () => void;
  style?: React.CSSProperties;
}) {
  const {
    fileInputRef,
    uploading,
    stop,
    openPicker,
    handleFile,
    random,
    showUrlInput,
    urlInput,
    setUrlInput,
    urlInputRef,
    openUrlInput,
    submitUrl,
    cancelUrl,
  } = useGalleryUpload({
    onUrl: (url) => onAdd?.(url),
    collapseSheetForInlineEdit,
  });

  return (
    <div
      className="group flex flex-col items-center justify-center gap-3 border-2 border-dashed transition-all duration-200 cursor-pointer p-5 select-none hover:shadow-md min-h-[180px]"
      style={{
        borderColor: "color-mix(in srgb, var(--dt-primary, #6366f1) 45%, rgba(100, 116, 139, 0.4))",
        background: "color-mix(in srgb, var(--dt-primary, #6366f1) 6%, rgba(100, 116, 139, 0.04))",
        ...style,
      }}
      onClick={(e) => { stop(e); openPicker(); }}
      onPointerDown={stop}
      onTouchStart={stop}
    >
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFile} className="hidden" />

      {/* Prominent Plus Icon Circle */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-200 group-hover:scale-110 shadow-sm"
        style={{
          background: "color-mix(in srgb, var(--dt-primary, #6366f1) 18%, rgba(100, 116, 139, 0.12))",
          color: "var(--dt-primary, #6366f1)",
          border: "1px solid color-mix(in srgb, var(--dt-primary, #6366f1) 30%, transparent)",
        }}
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Plus className="w-6 h-6 stroke-[2.5]" />
        )}
      </div>

      {/* Label */}
      <span
        className="text-xs font-bold tracking-wide"
        style={{ color: "var(--dt-text, currentColor)" }}
      >
        Tambah Foto
      </span>

      {/* Quick Action Chips or URL input */}
      {showUrlInput ? (
        <div
          className="flex items-center gap-1.5 p-1 bg-slate-900/95 border border-white/20 rounded-full shadow-2xl backdrop-blur-md max-w-[95%] w-64 pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
          onClick={stop}
          onPointerDown={stop}
          onTouchStart={stop}
        >
          <div className="pl-2 text-slate-400 shrink-0">
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
                submitUrl();
              } else if (e.key === "Escape") {
                e.preventDefault();
                cancelUrl();
              }
            }}
            placeholder="https://... (URL foto)"
            className="flex-1 bg-transparent text-white text-xs px-1 py-1 focus:outline-none placeholder:text-slate-400 min-w-0"
            autoFocus
          />
          <button
            type="button"
            onClick={(e) => { stop(e); submitUrl(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Simpan URL"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 transition-colors active:scale-95 cursor-pointer shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => { stop(e); cancelUrl(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Batal"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white shrink-0 transition-colors active:scale-95 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={(e) => { stop(e); openPicker(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            style={{
              background: "color-mix(in srgb, var(--dt-text, currentColor) 10%, rgba(100, 116, 139, 0.08))",
              color: "var(--dt-text, currentColor)",
              border: "1px solid color-mix(in srgb, var(--dt-text, currentColor) 18%, transparent)",
            }}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Unggah</span>
          </button>
          <button
            type="button"
            onClick={(e) => { stop(e); openUrlInput(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Masukkan URL foto"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            style={{
              background: "color-mix(in srgb, var(--dt-text, currentColor) 10%, rgba(100, 116, 139, 0.08))",
              color: "var(--dt-text, currentColor)",
              border: "1px solid color-mix(in srgb, var(--dt-text, currentColor) 18%, transparent)",
            }}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>URL</span>
          </button>
          <button
            type="button"
            onClick={(e) => { stop(e); random(); }}
            onPointerDown={stop}
            onTouchStart={stop}
            title="Foto acak (Unsplash)"
            className="flex items-center justify-center w-7 h-6 rounded-full text-amber-500 dark:text-amber-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            style={{
              background: "color-mix(in srgb, var(--dt-text, currentColor) 10%, rgba(100, 116, 139, 0.08))",
              border: "1px solid color-mix(in srgb, var(--dt-text, currentColor) 18%, transparent)",
            }}
          >
            <SparkleIcon className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          </button>
        </div>
      )}
    </div>
  );
}

export function GalleryAddButton({
  onAdd,
  collapseSheetForInlineEdit,
}: {
  onAdd?: (url: string) => void;
  collapseSheetForInlineEdit?: () => void;
}) {
  const {
    fileInputRef,
    uploading,
    stop,
    openPicker,
    handleFile,
    showUrlInput,
    urlInput,
    setUrlInput,
    urlInputRef,
    openUrlInput,
    submitUrl,
    cancelUrl,
  } = useGalleryUpload({
    onUrl: (url) => onAdd?.(url),
    collapseSheetForInlineEdit,
  });

  if (showUrlInput) {
    return (
      <div
        className="inline-flex items-center gap-1.5 p-1 bg-slate-900/95 border border-white/20 rounded-full shadow-2xl backdrop-blur-md max-w-[92%] w-64 pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={stop}
        onPointerDown={stop}
        onTouchStart={stop}
      >
        <div className="pl-2 text-slate-400 shrink-0">
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
              submitUrl();
            } else if (e.key === "Escape") {
              e.preventDefault();
              cancelUrl();
            }
          }}
          placeholder="https://... (URL foto)"
          className="flex-1 bg-transparent text-white text-xs px-1 py-1 focus:outline-none placeholder:text-slate-400 min-w-0"
          autoFocus
        />
        <button
          type="button"
          onClick={(e) => { stop(e); submitUrl(); }}
          onPointerDown={stop}
          onTouchStart={stop}
          title="Simpan URL"
          className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 transition-colors active:scale-95 cursor-pointer shadow-sm"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => { stop(e); cancelUrl(); }}
          onPointerDown={stop}
          onTouchStart={stop}
          title="Batal"
          className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white shrink-0 transition-colors active:scale-95 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border-2 border-dashed text-xs font-bold transition-all cursor-pointer px-3.5 py-1.5 shadow-2xs hover:scale-105 active:scale-95"
      style={{
        borderColor: "color-mix(in srgb, var(--dt-primary, #6366f1) 45%, rgba(100, 116, 139, 0.35))",
        background: "color-mix(in srgb, var(--dt-primary, #6366f1) 8%, transparent)",
        color: "var(--dt-primary, currentColor)",
      }}
      onClick={(e) => { stop(e); openPicker(); }}
      onPointerDown={stop}
      onTouchStart={stop}
    >
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFile} className="hidden" />
      {uploading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4 stroke-[2.5]" />
      )}
      <span>Tambah Foto</span>
      <span
        className="w-px h-3.5"
        style={{ background: "color-mix(in srgb, var(--dt-primary, currentColor) 25%, transparent)" }}
      />
      <button
        type="button"
        onClick={(e) => { stop(e); openUrlInput(); }}
        onPointerDown={stop}
        onTouchStart={stop}
        title="Masukkan URL foto"
        aria-label="Masukkan URL foto"
        className="hover:opacity-80 transition-opacity cursor-pointer"
        style={{ color: "var(--dt-primary, currentColor)" }}
      >
        <Link2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function getRadius(designToken?: DesignToken | null): string {
  const map: Record<string, string> = { sharp: "0px", soft: "8px", rounded: "16px" };
  return map[designToken?.layout?.corner_radius ?? "rounded"] || "16px";
}

export function GallerySectionHeader({
  gallery,
  design_token,
  isEditorMode,
  isSelected,
  onUpdateField,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onAddItem,
}: Pick<
  GalleryVariantProps,
  "gallery" | "design_token" | "isEditorMode" | "isSelected" | "onUpdateField" | "collapseSheetForInlineEdit" | "onEditingStateChange" | "onAddItem"
>) {
  return (
    <div className="text-center space-y-2">
      {(gallery.eyebrow || isEditorMode) && (
        <span
          className="text-xs font-bold uppercase tracking-widest block"
          style={{ color: design_token?.palette?.primary || "var(--dt-primary, #b45309)" }}
        >
          {isEditorMode ? (
            <InlineText
              section="gallery"
              fieldKey="eyebrow"
              value={gallery.eyebrow || ""}
              placeholder="Tambah eyebrow..."
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          ) : gallery.eyebrow}
        </span>
      )}
      <h2
        className="text-3xl md:text-4xl font-bold"
        style={{ fontFamily: "var(--dt-heading-font)", color: "var(--dt-text)" }}
      >
        {isEditorMode ? (
          <InlineText
            section="gallery"
            fieldKey="title"
            value={gallery.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
          />
        ) : gallery.title}
      </h2>
      {isEditorMode && onAddItem && (
        <div className="pt-1">
          <GalleryAddButton onAdd={onAddItem} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
        </div>
      )}
    </div>
  );
}

export function Lightbox({
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Preview gambar"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
        aria-label="Tutup"
      >
        <X className="w-6 h-6" />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer z-10"
            aria-label="Berikutnya"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <div
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.video_url ? (() => {
          const embedUrl = getVideoEmbedUrl(item.video_url);
          const isRaw = embedUrl && /\.(mp4|webm|ogg|mov)/i.test(embedUrl);
          if (!embedUrl) return null;
          if (isRaw) {
            return (
              <video
                src={embedUrl}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] rounded-lg shadow-2xl bg-black"
                style={{ minWidth: "min(640px, 90vw)", minHeight: "min(360px, 50vh)" }}
              />
            );
          }
          return (
            <iframe
              src={embedUrl}
              title={item.caption || "Video"}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-2xl bg-black"
              style={{ width: "min(840px, 90vw)", height: "min(473px, 60vh)", border: "none" }}
            />
          );
        })() : item.image_url ? (
          <img
            src={item.image_url}
            alt={item.alt_text || item.caption || "Gallery image"}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
          />
        ) : null}
        {(item.caption || isEditorMode) && (
          <p className="mt-3 text-white/80 text-sm text-center max-w-lg">
            {isEditorMode ? (
              <InlineText
                section="gallery"
                fieldKey={`items.${current}.caption`}
                value={item.caption ?? ""}
                placeholder="Tambah caption..."
                onUpdateField={(_, __, val) => onUpdateCaption?.(current, val)}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            ) : (
              item.caption
            )}
          </p>
        )}
        {items.length > 1 && (
          <p className="mt-2 text-white/50 text-xs">{current + 1} / {items.length}</p>
        )}
        <PhotoCredit credit={item.image_credit} className="text-xs text-white/50 mt-2" />
      </div>
    </div>
  );
}

export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|youtube\.com\/shorts\/)?([\w-]{11})$/);
  const ytFull = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  if (ytFull) return `https://www.youtube.com/embed/${ytFull[1]}?autoplay=1&rel=0`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) return url;
  return null;
}

export { Play };
