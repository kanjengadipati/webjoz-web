"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Loader2,
  RotateCcw, X, Link as LinkIcon, Image as ImageIcon, Layers,
  SlidersHorizontal, Check, Sparkles
} from "lucide-react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import FileUpload, { uploadImageFile } from "@/components/file-upload";
import { useI18n } from "@/lib/i18n/context";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── nanoid (inline, tiny — avoids extra dep) ────────────────────────────────────────────
const NANOID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function nanoid(size = 10): string {
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) id += NANOID_CHARS[bytes[i] % NANOID_CHARS.length];
  return id;
}

/** Ensure item has id and sort_order, patching in-place */
export function ensureItemId(item: any, idx: number): any {
  if (!item.id || !item.sort_order) {
    return { ...item, id: item.id || nanoid(), sort_order: item.sort_order ?? idx };
  }
  return item;
}

/** Ensure category has id and sort_order */
export function ensureCatId(cat: any, idx: number): any {
  const items = (cat.items ?? []).map((it: any, i: number) => ensureItemId(it, i));
  if (!cat.id || cat.sort_order == null) {
    return { ...cat, id: cat.id || nanoid(), sort_order: cat.sort_order ?? idx, items };
  }
  return { ...cat, items };
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const EMOJI_GROUPS = [
  { name: "dashboard.sitesKatalog.emojiPopular", fallbackName: "Populer & Bisnis", emojis: ["✨", "🔥", "✅", "⭐", "📍", "📦", "💬", "📞", "⏰", "🚀", "💯", "💡", "📢"] },
  { name: "dashboard.sitesKatalog.emojiFood", fallbackName: "Makanan & Minuman", emojis: ["🍕", "🍔", "🍟", "🌭", "🍳", "🍜", "🍣", "🍱", "🧁", "🎂", "🍎", "☕", "🥤", "🍺"] },
  { name: "dashboard.sitesKatalog.emojiServices", fallbackName: "Jasa, Belanja & Produk", emojis: ["🛠️", "🧹", "💈", "💇", "💅", "🧼", "🔑", "🚗", "🏠", "🏢", "🏷️", "🎁", "🛍️", "👕", "👟", "👜", "⌚", "💻", "📱"] },
  { name: "dashboard.sitesKatalog.emojiSymbols", fallbackName: "Simbol & Panah", emojis: ["✔️", "❌", "➕", "➖", "➜", "➔", "⚡", "✦", "❖", "💚", "❤️", "💙", "👍"] },
];

export const MCF_INPUT_BASE =
  "w-full px-3.5 py-2 border border-border/80 focus:border-primary/60 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground placeholder:text-muted-foreground/60 transition-all shadow-2xs";

export const MCF_INPUT_LABEL = "text-[10.5px] uppercase tracking-wider font-bold text-muted-foreground block mb-1";

/** Strip AI-generated literal "null" strings */
export const normStr = (v: any): string => {
  if (v === null || v === undefined) return "";
  return String(v).replace(/\bnull\b/gi, "").replace(/^[,\s]+|[,\s]+$/g, "").trim();
};

// ─── AI Field Button ──────────────────────────────────────────────────────────

export interface AiFieldButtonProps {
  onGenerate: () => Promise<void>;
  onUpgradeRequired?: () => void;
  loading: boolean;
  title?: string;
  isPremium?: boolean;
}

export function AiFieldButton({
  onGenerate, onUpgradeRequired, loading, title = "Generate dengan AI",
}: AiFieldButtonProps) {
  const handleClick = async () => {
    try { await onGenerate(); }
    catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") {
        onUpgradeRequired?.();
      }
    }
  };
  return (
    <button
      type="button" onClick={handleClick} disabled={loading} title={title}
      className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-primary/15 text-primary hover:bg-primary/30 hover:text-primary transition-all disabled:opacity-40 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
    >
      {loading
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : <SparkleGenAI className="w-[18px] h-[18px]" />}
    </button>
  );
}

// ─── AI Prompt Modal ──────────────────────────────────────────────────────────

export interface AiPromptModalProps {
  label: string;
  imageUrl?: string;
  suggestions?: string[];
  onConfirm: (instructions: string) => void;
  onCancel: () => void;
}

export function AiPromptModal({
  label, imageUrl, suggestions = [], onConfirm, onCancel,
}: AiPromptModalProps) {
  const [input, setInput] = useState("");
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <SparkleGenAI className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-foreground leading-tight">
              Instruksi AI — {label}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Tambahkan instruksi khusus atau langsung klik Generate.
            </p>
          </div>
        </div>

        {/* Text input */}
        <input
          autoFocus type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter")  { onConfirm(input.trim()); }
            if (e.key === "Escape") { onCancel(); }
          }}
          placeholder='cth. "buat lebih kasual dan ramah"'
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all shadow-2xs"
        />

        {/* Image chip — only when item has a photo */}
        {imageUrl && (
          <button
            type="button"
            onClick={() => setInput("Tulis deskripsi berdasarkan foto produk ini")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/30 bg-primary/10 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer text-left"
          >
            <span className="text-base leading-none">📸</span>
            <span>Tulis deskripsi dari foto produk</span>
            <span className="ml-auto shrink-0 w-10 h-6 rounded overflow-hidden border border-border">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            </span>
          </button>
        )}

        {/* Quick suggestion chips */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestions.slice(0, 3).map((chip) => (
              <button
                key={chip} type="button" onClick={() => setInput(chip)}
                className="px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-border text-[13px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          >
            Batal
          </button>
          <button type="button" onClick={() => onConfirm(input.trim())}
            className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <SparkleGenAI className="h-4 w-4" /> Generate
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MenuCatalogForm ──────────────────────────────────────────────────────────

export interface MenuCatalogFormProps {
  sectionKey: "menu" | "catalog";
  sectionTitle: string;
  itemLabel: string;
  hasPrice: boolean;
  hasBadge: boolean;
  data: any;
  updateField: (section: string, key: string, val: any) => void;
  onAiDescription?: (catIdx: number, itemIdx: number, itemName: string, catName: string, imageUrl?: string) => Promise<void>;
  aiLoadingDesc?: string | null;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
  fieldUndoStacks?: Record<string, string[]>;
  undoField?: (section: string, key: string) => void;
  mode?: "page" | "sidebar";
}

export function MenuCatalogForm({
  sectionKey, sectionTitle, itemLabel, hasPrice, hasBadge,
  data, updateField, onAiDescription, aiLoadingDesc, isPremium, onUpgradeRequired,
  fieldUndoStacks, undoField, mode = "sidebar",
}: MenuCatalogFormProps) {
  const { t } = useI18n();
  const [expandedCat, setExpandedCat] = useState<number | null>(0);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<{ catIdx: number; itemIdx: number } | null>(null);

  const isPageMode = mode === "page";
  const categories: any[] = data?.categories ?? [];
  const updateCategories = (next: any[]) => updateField(sectionKey, "categories", next);

  const addCategory = () => {
    const defaultName = t("dashboard.sitesKatalog.defaultCategory", `Kategori ${categories.length + 1}`, { number: String(categories.length + 1) });
    const next = [...categories, { id: nanoid(), name: defaultName, items: [], sort_order: categories.length }];
    updateCategories(next);
    setExpandedCat(next.length - 1);
  };

  const removeCategory = (catIdx: number) => {
    if (isPageMode) {
      if (typeof window !== "undefined" && !window.confirm(t("dashboard.sitesKatalog.deleteCategoryConfirm", "Hapus kategori ini beserta seluruh isinya?"))) {
        return;
      }
    }
    updateCategories(categories.filter((_: any, i: number) => i !== catIdx));
    setExpandedCat(null);
  };

  const updateCategoryName = (catIdx: number, name: string) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], name };
    updateCategories(next);
  };

  const addItem = (catIdx: number) => {
    const next = [...categories];
    const existingItems = next[catIdx].items ?? [];
    const newItem: any = {
      id: nanoid(),
      name: "",
      description: "",
      price: "",
      price_display: "",
      price_amount: null,
      image_url: null,
      is_available: true,
      sort_order: existingItems.length,
    };
    if (hasBadge) newItem.badge = null;
    if (sectionKey === "menu") { newItem.tags = []; newItem.delivery_platforms = []; }
    else { newItem.capacity = null; newItem.features = []; }
    next[catIdx] = { ...next[catIdx], items: [...existingItems, newItem] };
    updateCategories(next);
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], items: next[catIdx].items.filter((_: any, i: number) => i !== itemIdx) };
    updateCategories(next);
  };

  const updateItem = (catIdx: number, itemIdx: number, field: string, value: any) => {
    const next = [...categories];
    const items = [...(next[catIdx].items ?? [])];
    items[itemIdx] = { ...items[itemIdx], [field]: value };
    next[catIdx] = { ...next[catIdx], items };
    updateCategories(next);
  };

  const renderFieldActions = (key: string) => {
    const fieldPath = `${sectionKey}.${key}`;
    const stack = fieldUndoStacks?.[fieldPath] || [];
    if (stack.length === 0) return null;
    return (
      <button
        type="button"
        onClick={() => undoField?.(sectionKey, key)}
        className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer focus:outline-none"
        title={`Undo (${stack.length} steps)`}
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    );
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  /** Drag end for items inside a category */
  const handleItemDragEnd = useCallback((catIdx: number, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const next = [...categories];
    const items = next[catIdx].items ?? [];
    const oldIdx = items.findIndex((i: any) => i.id === active.id);
    const newIdx = items.findIndex((i: any) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const reordered = arrayMove(items, oldIdx, newIdx).map((it: any, i: number) => ({ ...it, sort_order: i }));
    next[catIdx] = { ...next[catIdx], items: reordered };
    updateCategories(next);
  }, [categories, updateCategories]);

  /** Drag end for categories */
  const handleCatDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = categories.findIndex((c: any) => c.id === active.id);
    const newIdx = categories.findIndex((c: any) => c.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const reordered = arrayMove(categories, oldIdx, newIdx).map((c: any, i: number) => ({ ...c, sort_order: i }));
    updateCategories(reordered);
    setExpandedCat((prev) => {
      if (prev === null) return null;
      if (prev === oldIdx) return newIdx;
      return prev;
    });
  }, [categories, updateCategories]);

  return (
    <div className={isPageMode ? "space-y-6" : "space-y-4"}>
      {/* Section header fields */}
      <div className={`rounded-3xl border border-border/80 bg-card ${isPageMode ? "p-5 sm:p-6 shadow-sm" : "p-4 space-y-3 shadow-2xs"}`}>
        <div className={`flex items-center justify-between gap-3 ${isPageMode ? "pb-4 border-b border-border/60 mb-5" : "pb-2.5 border-b border-border/50"}`}>
          <div className="flex items-center gap-2.5">
            {isPageMode && (
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            )}
            <div>
              <span className={`font-bold text-foreground ${isPageMode ? "text-sm block" : "text-[11px] uppercase tracking-wider"}`}>
                {t("dashboard.sitesKatalog.labelSectionTitle", "Pengaturan Bagian")}
              </span>
              {isPageMode && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("dashboard.sitesKatalog.sectionSettingsSubtitle", "Atur judul, subjudul, dan teks pengantar katalog di website")}
                </p>
              )}
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-primary shrink-0 whitespace-nowrap">
            {sectionKey === "menu" ? t("dashboard.sitesKatalog.chipMenu", "Menu") : t("dashboard.sitesKatalog.chipCatalog", "Katalog")} · {t("dashboard.sitesKatalog.chipCategoryCount", `${categories.length} kategori`, { count: String(categories.length) })}
          </div>
        </div>

        <div className={isPageMode ? "grid gap-4 sm:grid-cols-3" : "space-y-3"}>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className={MCF_INPUT_LABEL}>{t("dashboard.sitesKatalog.labelSectionTitle", "Judul Section")}</label>
              {renderFieldActions("title")}
            </div>
            <input
              type="text"
              value={data?.title ?? ""}
              onChange={(e) => updateField(sectionKey, "title", e.target.value)}
              placeholder={`cth. ${sectionTitle}`}
              className={MCF_INPUT_BASE}
            />
          </div>

          <div className={isPageMode ? "space-y-1" : "grid gap-3 sm:grid-cols-2"}>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={MCF_INPUT_LABEL}>
                  {t("dashboard.sitesKatalog.labelEyebrow", "Eyebrow")} <span className="text-muted-foreground/60 font-normal normal-case">({t("dashboard.sitesKatalog.optional", "opsional")})</span>
                </label>
                {renderFieldActions("eyebrow")}
              </div>
              <input
                type="text"
                value={data?.eyebrow ?? ""}
                onChange={(e) => updateField(sectionKey, "eyebrow", e.target.value)}
                placeholder={`cth. Pilihan ${sectionTitle}`}
                className={MCF_INPUT_BASE}
              />
            </div>

            {!isPageMode && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className={MCF_INPUT_LABEL}>
                    {t("dashboard.sitesKatalog.labelSubtitle", "Subtitle")} <span className="text-muted-foreground/60 font-normal normal-case">({t("dashboard.sitesKatalog.optional", "opsional")})</span>
                  </label>
                  {renderFieldActions("subtitle")}
                </div>
                <input
                  type="text"
                  value={data?.subtitle ?? ""}
                  onChange={(e) => updateField(sectionKey, "subtitle", e.target.value)}
                  placeholder="cth. Nikmati berbagai pilihan menu terbaik kami"
                  className={MCF_INPUT_BASE}
                />
              </div>
            )}
          </div>

          {isPageMode && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={MCF_INPUT_LABEL}>
                  {t("dashboard.sitesKatalog.labelSubtitle", "Subtitle")} <span className="text-muted-foreground/60 font-normal normal-case">({t("dashboard.sitesKatalog.optional", "opsional")})</span>
                </label>
                {renderFieldActions("subtitle")}
              </div>
              <input
                type="text"
                value={data?.subtitle ?? ""}
                onChange={(e) => updateField(sectionKey, "subtitle", e.target.value)}
                placeholder="cth. Nikmati berbagai pilihan menu terbaik kami"
                className={MCF_INPUT_BASE}
              />
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className={`rounded-3xl border border-dashed border-primary/20 bg-primary/5 text-center ${isPageMode ? "p-10" : "p-6"}`}>
          <p className="text-sm font-semibold text-foreground">{t("dashboard.sitesKatalog.emptyCategoriesTitle", "Belum ada kategori")}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {t("dashboard.sitesKatalog.emptyCategoriesDesc", `Tambahkan kategori agar ${itemLabel} bisa ditampilkan lebih rapi di website.`)}
          </p>
        </div>
      )}

      {/* Categories — DnD sortable */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCatDragEnd}>
        <SortableContext items={categories.map((c: any) => c.id ?? c.name)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {categories.map((cat: any, catIdx: number) => {
              const enrichedCat = ensureCatId(cat, catIdx);
              const catId = enrichedCat.id;
              const itemCount = cat.items?.length ?? 0;
              return (
                <SortableCategoryRow
                  key={catId}
                  catId={catId}
                  cat={enrichedCat}
                  catIdx={catIdx}
                  itemCount={itemCount}
                  expandedCat={expandedCat}
                  setExpandedCat={setExpandedCat}
                  removeCategory={removeCategory}
                  updateCategoryName={updateCategoryName}
                  items={enrichedCat.items ?? []}
                  itemLabel={itemLabel}
                  sectionKey={sectionKey}
                  hasPrice={hasPrice}
                  hasBadge={hasBadge}
                  updateItem={updateItem}
                  removeItem={removeItem}
                  addItem={addItem}
                  onAiDescription={onAiDescription}
                  aiLoadingDesc={aiLoadingDesc}
                  isPremium={isPremium}
                  onUpgradeRequired={onUpgradeRequired}
                  activeEmojiPicker={activeEmojiPicker}
                  setActiveEmojiPicker={setActiveEmojiPicker}
                  sensors={sensors}
                  handleItemDragEnd={handleItemDragEnd}
                  mode={mode}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={addCategory}
        className={`w-full border rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
          isPageMode
            ? "py-3.5 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold shadow-2xs"
            : "py-2.5 border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground text-[12px] shadow-2xs"
        }`}
      >
        <Plus className="w-4 h-4" /> {t("dashboard.sitesKatalog.addCategory", "Tambah Kategori")}
      </button>
    </div>
  );
}

// ─── SortableCategoryRow ────────────────────────────────────────────────────────────

function SortableCategoryRow({
  catId, cat, catIdx, itemCount, expandedCat, setExpandedCat,
  removeCategory, updateCategoryName,
  items, itemLabel, sectionKey, hasPrice, hasBadge,
  updateItem, removeItem, addItem,
  onAiDescription, aiLoadingDesc, isPremium, onUpgradeRequired,
  activeEmojiPicker, setActiveEmojiPicker,
  sensors, handleItemDragEnd, mode,
}: any) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: catId });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const isPageMode = mode === "page";
  const isOpen = expandedCat === catIdx;

  return (
    <div ref={setNodeRef} style={style} className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xs">
      {/* Category header */}
      <div className={`flex items-center gap-2.5 px-4 py-3 bg-muted/20 border-b border-border/60 ${isOpen ? "bg-muted/30" : ""}`}>
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground p-1 transition-colors rounded-lg hover:bg-muted"
          aria-label="Geser kategori"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={cat.name ?? ""}
          onChange={(e) => updateCategoryName(catIdx, e.target.value)}
          placeholder={t("dashboard.sitesKatalog.categoryNamePlaceholder", "Nama kategori")}
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-foreground outline-none placeholder:text-muted-foreground/60"
        />
        <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/50 shrink-0">
          {itemCount} {itemLabel}
        </span>
        <button
          type="button"
          onClick={() => setExpandedCat(isOpen ? null : catIdx)}
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted cursor-pointer transition-colors"
          aria-label={isOpen ? "Tutup kategori" : "Buka kategori"}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => removeCategory(catIdx)}
          className="text-red-500/60 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer transition-colors"
          aria-label="Hapus kategori"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className={`space-y-4 ${isPageMode ? "p-5" : "p-3.5"}`}>
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5 text-center text-xs text-muted-foreground">
              {t("dashboard.sitesKatalog.emptyItemsDesc", `Belum ada ${itemLabel}. Klik tombol di bawah untuk menambah.`)}
            </div>
          )}

          {/* Items — DnD sortable */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(ev) => handleItemDragEnd(catIdx, ev)}>
            <SortableContext items={items.map((i: any) => i.id ?? i.name)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3.5">
                {items.map((item: any, itemIdx: number) => (
                  <SortableItemRow
                    key={item.id ?? itemIdx}
                    item={item}
                    itemIdx={itemIdx}
                    catIdx={catIdx}
                    itemLabel={itemLabel}
                    sectionKey={sectionKey}
                    hasPrice={hasPrice}
                    hasBadge={hasBadge}
                    updateItem={updateItem}
                    removeItem={removeItem}
                    onAiDescription={onAiDescription}
                    aiLoadingDesc={aiLoadingDesc}
                    isPremium={isPremium}
                    onUpgradeRequired={onUpgradeRequired}
                    catName={cat.name}
                    activeEmojiPicker={activeEmojiPicker}
                    setActiveEmojiPicker={setActiveEmojiPicker}
                    mode={mode}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            type="button"
            onClick={() => addItem(catIdx)}
            className="w-full text-xs font-bold py-2.5 border border-dashed border-primary/30 rounded-2xl text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/50 flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.addItem", `Tambah ${itemLabel}`)}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SortableItemRow ───────────────────────────────────────────────────────────────

function SortableItemRow({
  item, itemIdx, catIdx, itemLabel, sectionKey, hasPrice, hasBadge,
  updateItem, removeItem, onAiDescription, aiLoadingDesc, isPremium,
  onUpgradeRequired, catName, activeEmojiPicker, setActiveEmojiPicker, mode,
}: any) {
  const { t } = useI18n();
  const itemSortId = item.id ?? item.name ?? String(itemIdx);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: itemSortId });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isAvailable = item.is_available !== false;
  const tags: string[] = item.tags ?? [];
  const deliveryPlatforms: { name: string; url: string }[] = item.delivery_platforms ?? [];
  const isPageMode = mode === "page";

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-border/80 bg-muted/15 p-4 space-y-3.5 shadow-2xs">
      {/* Item header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-muted"
            aria-label="Geser item"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-bold text-foreground">
            {item.name ? item.name : `${itemLabel} #${itemIdx + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* is_available toggle */}
          <button
            type="button"
            onClick={() => updateItem(catIdx, itemIdx, "is_available", !isAvailable)}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
              isAvailable
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                : "border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20"
            }`}
            title={isAvailable ? t("dashboard.sitesKatalog.markOutOfStock", "Klik untuk tandai Habis") : t("dashboard.sitesKatalog.markAvailable", "Klik untuk tandai Tersedia")}
          >
            {isAvailable ? `✓ ${t("dashboard.sitesKatalog.available", "Tersedia")}` : `✗ ${t("dashboard.sitesKatalog.outOfStock", "Habis")}`}
          </button>
          <button
            type="button"
            onClick={() => removeItem(catIdx, itemIdx)}
            className="text-red-500/60 hover:text-red-500 cursor-pointer p-1 rounded hover:bg-red-500/10 transition-colors"
            aria-label={`Hapus ${itemLabel}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Item Body */}
      <div className="space-y-3.5">
        <ItemPhotoGalleryEditor
          imageUrl={item.image_url ?? ""}
          imageUrls={item.image_urls ?? []}
          onUpdatePrimary={(url) => updateItem(catIdx, itemIdx, "image_url", url || null)}
          onUpdateGallery={(urls) => updateItem(catIdx, itemIdx, "image_urls", urls.length > 0 ? urls : null)}
          mode={mode}
        />

        <div className="space-y-3">
          {/* Name */}
          <div className="space-y-1">
            <label className={MCF_INPUT_LABEL}>
              {t("dashboard.sitesKatalog.itemName", `Nama ${itemLabel}`)}
            </label>
            <input
              type="text"
              value={item.name ?? ""}
              onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)}
              placeholder={`cth. Nama ${itemLabel}`}
              className={MCF_INPUT_BASE}
            />
          </div>

          {/* Price */}
          {hasPrice && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className={MCF_INPUT_LABEL}>
                  {t("dashboard.sitesKatalog.priceDisplay", "Label Harga")} <span className="font-normal normal-case text-muted-foreground/60">({t("dashboard.sitesKatalog.display", "tampilan")})</span>
                </label>
                <input
                  type="text"
                  value={item.price_display ?? item.price ?? ""}
                  onChange={(e) => {
                    updateItem(catIdx, itemIdx, "price_display", e.target.value);
                    updateItem(catIdx, itemIdx, "price", e.target.value);
                  }}
                  placeholder={t("dashboard.sitesKatalog.priceDisplayPlaceholder", "cth. Rp 25.000 atau $5.99")}
                  className={MCF_INPUT_BASE}
                />
              </div>
              <div className="space-y-1">
                <label className={MCF_INPUT_LABEL}>
                  {t("dashboard.sitesKatalog.priceAmount", "Nominal")}
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={item.price_amount ?? ""}
                  onChange={(e) => updateItem(catIdx, itemIdx, "price_amount", e.target.value === "" ? null : Number(e.target.value))}
                  placeholder={t("dashboard.sitesKatalog.priceAmountPlaceholder", "cth. 25000")}
                  className={`${MCF_INPUT_BASE} [appearance:textfield]`}
                />
              </div>
            </div>
          )}

          {/* Badge (catalog only) */}
          {hasBadge && (
            <div className="space-y-1">
              <label className={MCF_INPUT_LABEL}>
                Badge <span className="font-normal normal-case text-muted-foreground/60">({t("dashboard.sitesKatalog.badgeHelp", "cth. Best Seller, Promo, Baru")})</span>
              </label>
              <input
                type="text"
                value={normStr(item.badge)}
                onChange={(e) => updateItem(catIdx, itemIdx, "badge", normStr(e.target.value) || null)}
                placeholder={t("dashboard.sitesKatalog.badgePlaceholder", "cth. Best Seller, Baru, Promo")}
                className={MCF_INPUT_BASE}
              />
            </div>
          )}

          {/* Capacity (catalog only) */}
          {sectionKey === "catalog" && (
            <div className="space-y-1">
              <label className={MCF_INPUT_LABEL}>
                {t("dashboard.sitesKatalog.capacity", "Kapasitas")} <span className="font-normal normal-case text-muted-foreground/60">({t("dashboard.sitesKatalog.capacityHelp", "opsional — jml tamu / unit")})</span>
              </label>
              <input
                type="number"
                min={1}
                value={item.capacity ?? ""}
                onChange={(e) => updateItem(catIdx, itemIdx, "capacity", e.target.value === "" ? null : Number(e.target.value))}
                placeholder={t("dashboard.sitesKatalog.capacityPlaceholder", "cth. 2, 4, 6")}
                className={`${MCF_INPUT_BASE} [appearance:textfield]`}
              />
            </div>
          )}

          {/* Features (catalog only) */}
          {sectionKey === "catalog" && (
            <div className="space-y-1">
              <label className={MCF_INPUT_LABEL}>
                {t("dashboard.sitesKatalog.features", "Fitur / Fasilitas")} <span className="font-normal normal-case text-muted-foreground/60">(misal: AC, WiFi, Sarapan)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {(item.features ?? []).map((f: string, fi: number) => (
                  <span key={fi} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/15 text-primary border border-primary/20">
                    {f}
                    <button type="button" onClick={() => {
                      const next = (item.features ?? []).filter((_: string, i: number) => i !== fi);
                      updateItem(catIdx, itemIdx, "features", next);
                    }} className="hover:opacity-70 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder={t("dashboard.sitesKatalog.featuresPlaceholder", "Ketik fitur lalu Enter")}
                className={`${MCF_INPUT_BASE} text-xs`}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim().replace(/,$/, "");
                    if (val) {
                      const next = [...(item.features ?? []), val];
                      updateItem(catIdx, itemIdx, "features", next);
                    }
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          )}

          {/* Tags (menu only) */}
          {sectionKey === "menu" && (
            <div className="space-y-1">
              <label className={MCF_INPUT_LABEL}>
                Tags <span className="font-normal normal-case text-muted-foreground/60">(misal: Pedas, Vegetarian, Signature)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map((tag: string, ti: number) => (
                  <span key={ti} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/15 text-primary border border-primary/20">
                    {tag}
                    <button type="button" onClick={() => {
                      const next = tags.filter((_: string, i: number) => i !== ti);
                      updateItem(catIdx, itemIdx, "tags", next);
                    }} className="hover:opacity-70 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder={t("dashboard.sitesKatalog.tagsPlaceholder", "Ketik tag lalu Enter")}
                className={`${MCF_INPUT_BASE} text-xs`}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newTag = e.currentTarget.value.trim().replace(/,$/, "");
                    if (newTag && !tags.includes(newTag)) {
                      updateItem(catIdx, itemIdx, "tags", [...tags, newTag]);
                    }
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          )}

          {/* Delivery Platforms (menu only) */}
          {sectionKey === "menu" && (
            <div className="space-y-1.5">
              <label className={MCF_INPUT_LABEL}>
                {t("dashboard.sitesKatalog.deliveryPlatforms", "Platform Delivery")} <span className="font-normal normal-case text-muted-foreground/60">(GrabFood, GoFood, dll.)</span>
              </label>
              <div className="space-y-1.5">
                {deliveryPlatforms.map((dp: { name: string; url: string }, di: number) => (
                  <div key={di} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={dp.name}
                      onChange={(e) => {
                        const next = [...deliveryPlatforms];
                        next[di] = { ...next[di], name: e.target.value };
                        updateItem(catIdx, itemIdx, "delivery_platforms", next);
                      }}
                      placeholder={t("dashboard.sitesKatalog.platformNamePlaceholder", "Nama (cth. GrabFood)")}
                      className={`${MCF_INPUT_BASE} flex-1 text-xs`}
                    />
                    <input
                      type="url"
                      value={dp.url}
                      onChange={(e) => {
                        const next = [...deliveryPlatforms];
                        next[di] = { ...next[di], url: e.target.value };
                        updateItem(catIdx, itemIdx, "delivery_platforms", next);
                      }}
                      placeholder="https://grab.com/..."
                      className={`${MCF_INPUT_BASE} flex-1 text-xs`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = deliveryPlatforms.filter((_: any, i: number) => i !== di);
                        updateItem(catIdx, itemIdx, "delivery_platforms", next);
                      }}
                      className="text-red-500/60 hover:text-red-500 cursor-pointer p-1 rounded hover:bg-red-500/10 transition-colors"
                      aria-label="Hapus platform"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => updateItem(catIdx, itemIdx, "delivery_platforms", [...deliveryPlatforms, { name: "", url: "" }])}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer transition-colors pt-0.5"
              >
                <LinkIcon className="w-3 h-3" /> {t("dashboard.sitesKatalog.addDeliveryPlatform", "Tambah Platform Delivery")}
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className={MCF_INPUT_LABEL}>{t("dashboard.sitesKatalog.description", "Deskripsi")}</label>
            {onAiDescription && (
              <AiFieldButton
                loading={aiLoadingDesc === `${catIdx}_${itemIdx}`}
                onGenerate={() => onAiDescription(catIdx, itemIdx, item.name || "", catName || "", item.image_url || undefined)}
                title="AI: generate deskripsi"
                onUpgradeRequired={onUpgradeRequired} isPremium={isPremium}
              />
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1.5 bg-muted/40 border border-border/80 border-b-0 rounded-t-xl px-2.5 py-1.5 text-xs flex-wrap">
            <button
              type="button"
              onClick={() => { const cur = item.description ?? ""; updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n• " : "• ")); }}
              className="px-2 py-1 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold cursor-pointer border border-border/70 transition-colors shadow-2xs flex items-center gap-1"
              title="Tambah List Bulat"
            >
              <span>•</span> List
            </button>
            <button
              type="button"
              onClick={() => { const cur = item.description ?? ""; updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n1. " : "1. ")); }}
              className="px-2 py-1 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold cursor-pointer border border-border/70 transition-colors shadow-2xs flex items-center gap-1"
              title="Tambah List Angka"
            >
              1. List
            </button>
            <div className="w-px h-3.5 bg-border mx-0.5" />

            {/* Emoji picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveEmojiPicker(activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx ? null : { catIdx, itemIdx })}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer border transition-colors shadow-2xs flex items-center gap-1 ${
                  activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-card hover:bg-muted border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                😀 Emoji & Simbol
              </button>
              {activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx && (
                <div className="absolute left-0 bottom-full mb-1.5 z-[100] w-64 rounded-2xl border border-border bg-card p-3 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-1.5 select-none">
                    <span className="text-[10.5px] font-bold text-foreground uppercase tracking-wide">Pilih Emoji & Simbol</span>
                    <button type="button" onClick={() => setActiveEmojiPicker(null)} className="text-muted-foreground hover:text-foreground text-[11px] font-bold cursor-pointer">Tutup</button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-3 pr-1 text-left custom-scrollbar">
                    {EMOJI_GROUPS.map((group) => (
                      <div key={group.name} className="space-y-1">
                        <div className="text-[9.5px] font-bold text-muted-foreground select-none">
                          {t(group.name, group.fallbackName)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {group.emojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                updateItem(catIdx, itemIdx, "description", (item.description ?? "") + emoji);
                                setActiveEmojiPicker(null);
                              }}
                              className="text-base hover:scale-125 transition-transform cursor-pointer rounded p-1 hover:bg-muted/60 flex items-center justify-center"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <textarea
            value={item.description ?? ""}
            rows={3}
            onChange={(e) => updateItem(catIdx, itemIdx, "description", e.target.value)}
            placeholder={t("dashboard.sitesKatalog.descriptionPlaceholder", `Jelaskan keunggulan dan spesifikasi ${itemLabel} ini...`)}
            className="w-full px-3.5 py-2.5 border border-border/80 focus:border-primary/60 rounded-b-xl text-[13px] outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground placeholder:text-muted-foreground/60 transition-all resize-y shadow-2xs"
          />
        </div>

        {/* Variant Groups */}
        <VariantGroupEditor
          groups={item.variant_groups ?? []}
          onChange={(groups) => updateItem(catIdx, itemIdx, "variant_groups", groups.length ? groups : null)}
          mode={mode}
        />
      </div>
    </div>
  );
}

// ─── VariantGroupEditor ─────────────────────────────────────────────────────────

export interface VGGroup {
  id: string;
  name: string;
  type: "single" | "multiple";
  required: boolean;
  options: VGOption[];
}
export interface VGOption {
  id: string;
  name: string;
  price_delta?: number | null;
  price_display?: string | null;
}

export function makeGroup(): VGGroup {
  return {
    id: nanoid(),
    name: "",
    type: "single",
    required: false,
    options: [{ id: nanoid(), name: "", price_delta: null, price_display: null }],
  };
}

export function VariantGroupEditor({
  groups, onChange, mode = "sidebar",
}: {
  groups: VGGroup[];
  onChange: (groups: VGGroup[]) => void;
  mode?: "page" | "sidebar";
}) {
  const { t } = useI18n();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  function updateGroup(gid: string, patch: Partial<VGGroup>) {
    onChange(groups.map((g) => (g.id === gid ? { ...g, ...patch } : g)));
  }
  function removeGroup(gid: string) {
    onChange(groups.filter((g) => g.id !== gid));
  }
  function addOption(gid: string) {
    const g = groups.find((g) => g.id === gid);
    if (!g) return;
    updateGroup(gid, { options: [...g.options, { id: nanoid(), name: "", price_delta: null, price_display: null }] });
  }
  function updateOption(gid: string, oid: string, patch: Partial<VGOption>) {
    const g = groups.find((g) => g.id === gid);
    if (!g) return;
    updateGroup(gid, { options: g.options.map((o) => (o.id === oid ? { ...o, ...patch } : o)) });
  }
  function removeOption(gid: string, oid: string) {
    const g = groups.find((g) => g.id === gid);
    if (!g) return;
    updateGroup(gid, { options: g.options.filter((o) => o.id !== oid) });
  }

  return (
    <div className="mt-3 border-t border-border/50 pt-3 space-y-2.5">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
            {t("dashboard.sitesKatalog.variantsTitle", "Varian & Opsi Tambahan")}
          </span>
          {mode === "page" && (
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
              {t("dashboard.sitesKatalog.variantsSubtitle", "Kustomisasi pilihan produk seperti Ukuran, Topping, atau Opsi Tambahan.")}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => { const g = makeGroup(); onChange([...groups, g]); setExpandedGroup(g.id); }}
          className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20 transition-all cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.variantsAddGroup", "Tambah Grup")}
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-[11px] text-muted-foreground/80 italic p-3 rounded-2xl bg-muted/20 border border-border/40">
          {t("dashboard.sitesKatalog.variantsNoGroups", "Belum ada varian atau opsi tambahan untuk produk ini.")}
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {groups.map((group) => {
          const isOpen = expandedGroup === group.id;
          return (
            <div key={group.id} className="rounded-2xl border border-border/80 bg-muted/20 overflow-hidden shadow-2xs">
              {/* Group header */}
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer select-none bg-muted/30 hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedGroup(isOpen ? null : group.id)}
              >
                <Layers className="w-4 h-4 text-primary shrink-0" />
                <span className="flex-1 text-[12px] font-bold text-foreground truncate">
                  {group.name || <span className="text-muted-foreground italic">{t("dashboard.sitesKatalog.variantsGroupNamePlaceholder", "Grup baru")}</span>}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/50 shrink-0">
                  {group.type === "multiple" ? t("dashboard.sitesKatalog.variantsTypeMultiple", "Pilih Banyak") : t("dashboard.sitesKatalog.variantsTypeSingle", "Pilih 1")}
                </span>
                {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeGroup(group.id); }}
                  className="text-red-500/60 hover:text-red-500 cursor-pointer p-1 rounded hover:bg-red-500/10 transition-colors shrink-0"
                  aria-label="Hapus grup"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {isOpen && (
                <div className="p-3.5 flex flex-col gap-3 border-t border-border/60 bg-card">
                  {/* Group name + type + required */}
                  <div className="space-y-1">
                    <label className={MCF_INPUT_LABEL}>{t("dashboard.sitesKatalog.variantsGroupName", "Nama Grup Varian")}</label>
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                      placeholder={t("dashboard.sitesKatalog.variantsGroupNamePlaceholder", "cth. Ukuran, Topping, Level Pedas")}
                      className={MCF_INPUT_BASE}
                    />
                  </div>
                  <div className="flex items-center gap-4 flex-wrap pt-1">
                    <label className="flex items-center gap-2 text-[11px] font-semibold text-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={group.type === "multiple"}
                        onChange={(e) => updateGroup(group.id, { type: e.target.checked ? "multiple" : "single" })}
                        className="w-3.5 h-3.5 accent-primary rounded cursor-pointer"
                      />
                      {t("dashboard.sitesKatalog.variantsTypeMultiple", "Pilih Banyak (Checkbox)")}
                    </label>
                    <label className="flex items-center gap-2 text-[11px] font-semibold text-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={group.required}
                        onChange={(e) => updateGroup(group.id, { required: e.target.checked })}
                        className="w-3.5 h-3.5 accent-primary rounded cursor-pointer"
                      />
                      {t("dashboard.sitesKatalog.variantsRequired", "Wajib Dipilih")}
                    </label>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("dashboard.sitesKatalog.variantsOptionsTitle", "Daftar Pilihan / Opsi")}
                    </span>
                    <div className="space-y-2">
                      {group.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt.name}
                            onChange={(e) => updateOption(group.id, opt.id, { name: e.target.value })}
                            placeholder={t("dashboard.sitesKatalog.variantsOptionNamePlaceholder", "cth. Regular, Large, Ekstra")}
                            className={`${MCF_INPUT_BASE} flex-1 text-xs`}
                          />
                          <input
                            type="number"
                            value={opt.price_delta ?? ""}
                            onChange={(e) => {
                              const delta = e.target.value === "" ? null : Number(e.target.value);
                              const display = delta != null && delta !== 0 ? (delta > 0 ? `+${delta.toLocaleString()}` : `${delta.toLocaleString()}`) : null;
                              updateOption(group.id, opt.id, { price_delta: delta, price_display: display });
                            }}
                            placeholder="+Rp"
                            className={`${MCF_INPUT_BASE} w-24 shrink-0 text-xs`}
                            title={t("dashboard.sitesKatalog.variantsOptionDelta", "Tambahan harga")}
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(group.id, opt.id)}
                            disabled={group.options.length <= 1}
                            className="text-red-500/60 hover:text-red-500 disabled:opacity-30 cursor-pointer p-1 rounded hover:bg-red-500/10 transition-colors shrink-0"
                            aria-label="Hapus opsi"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addOption(group.id)}
                      className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.variantsAddOption", "Tambah Pilihan")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ItemPhotoGalleryEditor ─────────────────────────────────────────────────────

export function ItemPhotoGalleryEditor({
  imageUrl,
  imageUrls = [],
  onUpdatePrimary,
  onUpdateGallery,
  mode = "sidebar",
}: {
  imageUrl: string;
  imageUrls?: string[];
  onUpdatePrimary: (url: string) => void;
  onUpdateGallery: (urls: string[]) => void;
  mode?: "page" | "sidebar";
}) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeUrls = imageUrls || [];
  const extraImages = safeUrls.filter((u) => u && u !== imageUrl);

  const handleUploadExtra = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImageFile(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.8 });
      if (url) {
        if (!imageUrl) {
          onUpdatePrimary(url);
        } else {
          onUpdateGallery([...extraImages, url]);
        }
      }
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah foto.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSetPrimary = (targetUrl: string) => {
    const nextExtra = [imageUrl, ...extraImages].filter((u) => u && u !== targetUrl);
    onUpdatePrimary(targetUrl);
    onUpdateGallery(nextExtra);
  };

  const handleRemoveExtra = (targetUrl: string) => {
    onUpdateGallery(extraImages.filter((u) => u !== targetUrl));
  };

  return (
    <div className="space-y-3">
      <FileUpload
        label={t("dashboard.sitesKatalog.photoPrimary", "Foto Utama")}
        value={imageUrl}
        onChange={onUpdatePrimary}
        placeholder="https://..."
        maxWidth={800}
        maxHeight={600}
        quality={0.8}
        previewSize="sm"
      />

      {/* Multi-Photo Manager Accordion */}
      <div className="rounded-2xl border border-border/80 bg-muted/20 overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>{t("dashboard.sitesKatalog.photoGalleryCount", `Galeri Foto (${1 + extraImages.length})`, { count: String(1 + extraImages.length) })}</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {isOpen && (
          <div className="p-3.5 border-t border-border/60 space-y-3 bg-card">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t("dashboard.sitesKatalog.photoGalleryHelp", "Unggah foto tambahan dari sudut berbeda atau variasi produk.")}
            </p>

            {/* Thumbnail grid */}
            <div className="flex flex-wrap gap-2.5">
              {/* Primary badge thumbnail */}
              {imageUrl && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-primary group shadow-xs">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-primary text-[9px] font-black text-primary-foreground text-center py-0.5 uppercase">
                    {t("dashboard.sitesKatalog.photoSetPrimary", "Utama")}
                  </span>
                </div>
              )}

              {/* Extra images */}
              {extraImages.map((url, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border group shadow-xs">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity p-1">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(url)}
                      className="text-[9px] font-bold text-white bg-primary px-1.5 py-0.5 rounded cursor-pointer hover:bg-primary/90"
                    >
                      {t("dashboard.sitesKatalog.photoSetPrimary", "Utama")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveExtra(url)}
                      className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add photo button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadExtra}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-all cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span className="text-[10px] font-bold">{t("dashboard.sitesKatalog.photoAdd", "Foto")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
