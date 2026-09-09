"use client";
import React, { useCallback } from "react";
import { Plus, Trash2, Check, ChevronLeft, ChevronRight, Camera, Link2, Loader2, X, ExternalLink } from "lucide-react";
import type { WorksItem, DesignToken } from "@/components/templates/types";
import { InlineText, InlineImage } from "../../templates/shared";
import { useGalleryUpload } from "../gallery/shared";
import { SparkleIcon } from "@/components/sparkle-icon";

export interface WorksVariantProps {
  works: {
    title: string;
    eyebrow?: string;
    subtitle?: string;
    layout?: string;
    items: WorksItem[];
  };
  design_token?: DesignToken | null;
  sectionStyle?: React.CSSProperties;
  onUpdateField?: (section: string, key: string, value: unknown) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onReplaceImage?: (idx: number, url: string) => void;
  onRemoveItem?: (idx: number) => void;
  onMoveItem?: (idx: number, dir: -1 | 1) => void;
  onAddItem?: (url: string) => void;
  language?: "id" | "en";
}

export function getRadius(designToken?: DesignToken | null): string {
  const map: Record<string, string> = { sharp: "0px", soft: "8px", rounded: "16px" };
  return map[designToken?.layout?.corner_radius ?? "rounded"] || "16px";
}

export interface WorksRackProps {
  items: WorksItem[];
  radius: string;
  isEditorMode?: boolean;
  isSelected?: boolean;
  isEN?: boolean;
  onUpdateItem: (idx: number, key: string, val: unknown) => void;
  onReplaceImage?: (idx: number, url: string) => void;
  onRemoveItem?: (idx: number) => void;
  onMoveItem?: (idx: number, dir: -1 | 1) => void;
  onAddItem?: (url: string) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export function WorksSectionHeader({
  works,
  design_token,
  isEditorMode,
  isSelected,
  onUpdateField,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onAddItem,
  language,
}: Pick<
  WorksVariantProps,
  "works" | "design_token" | "isEditorMode" | "isSelected" | "onUpdateField" | "collapseSheetForInlineEdit" | "onEditingStateChange" | "onAddItem" | "language"
>) {
  const isEN = language === "en";
  return (
    <div className="text-center space-y-2">
      {(works.eyebrow || isEditorMode) && (
        <span
          className="text-xs font-bold uppercase tracking-widest block"
          style={{ color: design_token?.palette?.primary || "var(--dt-primary, #b45309)" }}
        >
          {isEditorMode ? (
            <InlineText
              section="works"
              fieldKey="eyebrow"
              value={works.eyebrow || ""}
              placeholder={isEN ? "Add eyebrow..." : "Tambah label..."}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          ) : works.eyebrow}
        </span>
      )}
      <h2
        className="text-3xl md:text-4xl font-bold"
        style={{ fontFamily: "var(--dt-heading-font)", color: "var(--dt-text)" }}
      >
        {isEditorMode ? (
          <InlineText
            section="works"
            fieldKey="title"
            value={works.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
          />
        ) : works.title}
      </h2>
      {(works.subtitle || isEditorMode) && (
        <p
          className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-4"
          style={{ color: "var(--dt-text-muted)" }}
        >
          {isEditorMode ? (
            <InlineText
              section="works"
              fieldKey="subtitle"
              value={works.subtitle || ""}
              placeholder={isEN ? "Add short description..." : "Tambah deskripsi singkat..."}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              multiline
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          ) : works.subtitle}
        </p>
      )}
      {isEditorMode && onAddItem && (
        <div className="pt-1">
          <WorksAddButton onAdd={onAddItem} collapseSheetForInlineEdit={collapseSheetForInlineEdit} isEN={isEN} />
        </div>
      )}
    </div>
  );
}

export function WorksTileOverlay({
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
            title="Hapus proyek"
            aria-label="Hapus proyek"
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

export function WorksAddTile({
  onAdd,
  collapseSheetForInlineEdit,
  style,
  isEN,
}: {
  onAdd?: (url: string) => void;
  collapseSheetForInlineEdit?: () => void;
  style?: React.CSSProperties;
  isEN?: boolean;
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

  const label = isEN ? "Add project image" : "Tambah gambar proyek";

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

      <span
        className="text-xs font-bold tracking-wide"
        style={{ color: "var(--dt-text, currentColor)" }}
      >
        {label}
      </span>

      {showUrlInput && (
        <div
          className="flex items-center gap-1.5 p-1 bg-slate-900/95 border border-white/20 rounded-full shadow-2xl backdrop-blur-md max-w-[92%] w-64 sm:w-72 pointer-events-auto absolute"
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
      )}

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => { stop(e); random(); }}
          onPointerDown={stop}
          onTouchStart={stop}
          title={isEN ? "Random image (Unsplash)" : "Foto acak (Unsplash)"}
          aria-label={isEN ? "Random image" : "Foto acak"}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-amber-600 hover:bg-slate-200 shadow-sm transition-colors active:scale-95 cursor-pointer"
        >
          <SparkleIcon className="w-4 h-4 text-amber-500" />
        </button>
        <button
          type="button"
          onClick={(e) => { stop(e); openUrlInput(); }}
          onPointerDown={stop}
          onTouchStart={stop}
          title={isEN ? "Enter image URL" : "Masukkan URL foto"}
          aria-label={isEN ? "Enter image URL" : "Masukkan URL foto"}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm transition-colors active:scale-95 cursor-pointer"
        >
          <Link2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function WorksAddButton({
  onAdd,
  collapseSheetForInlineEdit,
  isEN,
}: {
  onAdd?: (url: string) => void;
  collapseSheetForInlineEdit?: () => void;
  isEN?: boolean;
}) {
  const {
    stop,
    openPicker,
    fileInputRef,
    uploading,
    handleFile,
    openUrlInput,
    submitUrl,
    cancelUrl,
    showUrlInput,
    urlInput,
    setUrlInput,
    urlInputRef,
    random,
  } = useGalleryUpload({
    onUrl: (url) => onAdd?.(url),
    collapseSheetForInlineEdit,
  });

  const label = isEN ? "Add project" : "Tambah Proyek";

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={(e) => { stop(e); openPicker(); }}
        onPointerDown={stop}
        onTouchStart={stop}
        disabled={uploading}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        style={{
          background: "color-mix(in srgb, var(--dt-primary, #6366f1) 10%, transparent)",
          color: "var(--dt-primary, #6366f1)",
          border: "1px solid color-mix(in srgb, var(--dt-primary, #6366f1) 30%, transparent)",
        }}
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
        {label}
      </button>
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFile} className="hidden" />
      {showUrlInput && (
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/95 border border-white/20 rounded-full shadow-2xl backdrop-blur-md max-w-[92%] w-64 sm:w-72 pointer-events-auto">
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
      )}
      <div className="flex items-center gap-1.5 mt-2 justify-center">
        <button
          type="button"
          onClick={(e) => { stop(e); random(); }}
          onPointerDown={stop}
          onTouchStart={stop}
          title={isEN ? "Random image (Unsplash)" : "Foto acak (Unsplash)"}
          aria-label={isEN ? "Random image" : "Foto acak"}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-amber-600 hover:bg-slate-300 shadow-sm transition-colors active:scale-95 cursor-pointer"
        >
          <SparkleIcon className="w-3.5 h-3.5 text-amber-500" />
        </button>
        <button
          type="button"
          onClick={(e) => { stop(e); openUrlInput(); }}
          onPointerDown={stop}
          onTouchStart={stop}
          title={isEN ? "Enter image URL" : "Masukkan URL foto"}
          aria-label={isEN ? "Enter image URL" : "Masukkan URL foto"}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 shadow-sm transition-colors active:scale-95 cursor-pointer"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function WorksCard({
  item,
  idx,
  total,
  radius,
  featured,
  isEditorMode,
  isSelected,
  isEN,
  onUpdateItem,
  onReplaceImage,
  onRemoveItem,
  onMoveItem,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  item: WorksItem;
  idx: number;
  total: number;
  radius: string;
  featured?: boolean;
  isEditorMode?: boolean;
  isSelected?: boolean;
  isEN?: boolean;
  onUpdateItem: (idx: number, key: string, val: unknown) => void;
  onReplaceImage?: (idx: number, url: string) => void;
  onRemoveItem?: (idx: number) => void;
  onMoveItem?: (idx: number, dir: -1 | 1) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const upd = useCallback(
    (key: string) => (_: string, __: string, val: unknown) => onUpdateItem(idx, key, val),
    [idx, onUpdateItem]
  );

  const metaBits = [item.category, item.year, item.client].filter(Boolean);
  const viewLabel = isEN ? "View Project" : "Lihat Proyek";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden bg-[var(--dt-surface, #f8fafc)] border border-[var(--dt-border)] shadow-sm hover:shadow-lg transition-all duration-300 ${featured ? "lg:flex-row" : ""}`}
      style={{ borderRadius: radius }}
    >
      <div
        className={`relative overflow-hidden bg-cover bg-center shrink-0 ${featured ? "w-full lg:w-1/2" : "w-full"}`}
        style={{ aspectRatio: featured ? "16 / 10" : "4 / 3", background: "var(--dt-surface, #f1f5f9)" }}
      >
        {item.image_url ? (
          isEditorMode ? (
            <InlineImage
              section="works"
              fieldKey={`items.${idx}.image_url`}
              src={item.image_url}
              alt={item.alt_text || item.title}
              onUpdateField={upd("image_url")}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt={item.alt_text || item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-[var(--dt-primary-soft, #f8fafc)]">
            <Camera className="w-10 h-10" />
          </div>
        )}
        {isEditorMode && (
          <WorksTileOverlay
            idx={idx}
            total={total}
            isSelected={isSelected}
            onReplace={onReplaceImage}
            onRemove={onRemoveItem}
            onMove={onMoveItem}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
        )}
        {item.year && (
          <span
            className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[11px] font-bold rounded-full text-white bg-black/55 backdrop-blur-sm"
          >
            {item.year}
          </span>
        )}
      </div>

      <div className={`flex flex-col gap-3 p-5 md:p-6 flex-1 ${featured ? "lg:justify-center" : ""}`}>
        {item.category && (
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--dt-primary)" }}>
            {item.category}
          </span>
        )}
        <h3 className="text-lg md:text-xl font-bold leading-snug" style={{ color: "var(--dt-text)", fontFamily: "var(--dt-heading-font)" }}>
          <InlineText
            section="works"
            fieldKey={`items.${idx}.title`}
            value={item.title}
            placeholder={isEN ? "Project title..." : "Judul proyek..."}
            onUpdateField={upd("title")}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
          />
        </h3>
        {isEditorMode && (item.category || true) && (
          <span className="block text-xs">
            <InlineText
              section="works"
              fieldKey={`items.${idx}.category`}
              value={item.category || ""}
              placeholder={isEN ? "Category (e.g. Branding)..." : "Kategori (mis. Branding)..."}
              onUpdateField={upd("category")}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="text-[11px] font-bold uppercase tracking-widest text-[var(--dt-primary)]"
            />
          </span>
        )}
        {metaBits.length > 1 && !isEditorMode && (
          <p className="text-xs text-[var(--dt-text-muted)] flex flex-wrap gap-x-2 gap-y-1">
            {metaBits.map((bit, i) => (
              <React.Fragment key={i}>
                <span>{bit}</span>
                {i < metaBits.length - 1 && <span aria-hidden>•</span>}
              </React.Fragment>
            ))}
          </p>
        )}
        {isEditorMode && (
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--dt-text-muted)]">
            <InlineText
              section="works"
              fieldKey={`items.${idx}.year`}
              value={item.year || ""}
              placeholder={isEN ? "Year..." : "Tahun..."}
              onUpdateField={upd("year")}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
            <InlineText
              section="works"
              fieldKey={`items.${idx}.client`}
              value={item.client || ""}
              placeholder={isEN ? "Client..." : "Klien..."}
              onUpdateField={upd("client")}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          </p>
        )}
        {(item.description || isEditorMode) && (
          <p className="text-sm leading-relaxed text-[var(--dt-text-muted)]">
            {isEditorMode ? (
              <InlineText
                section="works"
                fieldKey={`items.${idx}.description`}
                value={item.description || ""}
                placeholder={isEN ? "Describe this project..." : "Deskripsikan proyek ini..."}
                onUpdateField={upd("description")}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                multiline
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : item.description}
          </p>
        )}
        {isEditorMode ? (
          <span className="text-xs font-semibold" style={{ color: "var(--dt-primary)" }}>
            <InlineText
              section="works"
              fieldKey={`items.${idx}.project_url`}
              value={item.project_url || ""}
              placeholder={isEN ? "Project link (URL)..." : "Link proyek (URL)..."}
              onUpdateField={upd("project_url")}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          </span>
        ) : item.project_url ? (
          <a
            href={item.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold w-fit hover:underline"
            style={{ color: "var(--dt-primary)" }}
          >
            <ExternalLink className="w-4 h-4" />
            {viewLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}