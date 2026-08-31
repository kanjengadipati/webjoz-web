"use client";

import React, { useState, useCallback } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Loader2, RotateCcw, X, Link as LinkIcon } from "lucide-react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import FileUpload from "@/components/file-upload";
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
function nanoid(size = 10): string {
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) id += NANOID_CHARS[bytes[i] % NANOID_CHARS.length];
  return id;
}

/** Ensure item has id and sort_order, patching in-place */
function ensureItemId(item: any, idx: number): any {
  if (!item.id || !item.sort_order) {
    return { ...item, id: item.id || nanoid(), sort_order: item.sort_order ?? idx };
  }
  return item;
}

/** Ensure category has id and sort_order */
function ensureCatId(cat: any, idx: number): any {
  const items = (cat.items ?? []).map((it: any, i: number) => ensureItemId(it, i));
  if (!cat.id || cat.sort_order == null) {
    return { ...cat, id: cat.id || nanoid(), sort_order: cat.sort_order ?? idx, items };
  }
  return { ...cat, items };
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const EMOJI_GROUPS = [
  { name: "Populer & Bisnis",       emojis: ["✨", "🔥", "✅", "⭐", "📍", "📦", "💬", "📞", "⏰", "🚀", "💯", "💡", "📢"] },
  { name: "Makanan & Minuman",      emojis: ["🍕", "🍔", "🍟", "🌭", "🍳", "🍜", "🍣", "🍱", "🧁", "🎂", "🍎", "☕", "🥤", "🍺"] },
  { name: "Jasa, Belanja & Produk", emojis: ["🛠️", "🧹", "💈", "💇", "💅", "🧼", "🔑", "🚗", "🏠", "🏢", "🏷️", "🎁", "🛍️", "👕", "👟", "👜", "⌚", "💻", "📱"] },
  { name: "Simbol & Panah",         emojis: ["✔️", "❌", "➕", "➖", "➜", "➔", "⚡", "✦", "❖", "💚", "❤️", "💙", "👍"] },
];

export const MCF_INPUT_BASE =
  "w-full px-3 py-2 border border-white/10 rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 bg-muted/40 text-slate-100 placeholder-slate-500";

export const MCF_INPUT_LABEL = "text-[10px] uppercase tracking-wide font-bold text-slate-500 block mb-1";

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
// Matches the editor's fieldPromptModal exactly — image chip + suggestion chips.

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
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111318] shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <SparkleGenAI className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-slate-100 leading-tight">
              Instruksi AI — {label}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
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
          className="w-full px-4 py-3 border border-white/10 bg-[#05070b] text-slate-100 rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 placeholder:text-slate-600 transition-all"
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
            <span className="ml-auto shrink-0 w-10 h-6 rounded overflow-hidden border border-white/10">
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
            className="flex-1 h-10 rounded-xl border border-white/10 text-[13px] font-semibold text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button type="button" onClick={() => onConfirm(input.trim())}
            className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
}

export function MenuCatalogForm({
  sectionKey, sectionTitle, itemLabel, hasPrice, hasBadge,
  data, updateField, onAiDescription, aiLoadingDesc, isPremium, onUpgradeRequired,
  fieldUndoStacks, undoField,
}: MenuCatalogFormProps) {
  const [expandedCat, setExpandedCat] = useState<number | null>(0);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<{ catIdx: number; itemIdx: number } | null>(null);

  const categories: any[] = data?.categories ?? [];
  const updateCategories = (next: any[]) => updateField(sectionKey, "categories", next);

  const addCategory = () => {
    const next = [...categories, { id: nanoid(), name: `Kategori ${categories.length + 1}`, items: [], sort_order: categories.length }];
    updateCategories(next);
    setExpandedCat(next.length - 1);
  };

  const removeCategory = (catIdx: number) => {
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
        className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer focus:outline-none"
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
    // Adjust expanded index
    setExpandedCat((prev) => {
      if (prev === null) return null;
      if (prev === oldIdx) return newIdx;
      return prev;
    });
  }, [categories, updateCategories]);

  return (
    <div className="space-y-4">
      {/* Section header fields */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-white/[0.02] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <label className={MCF_INPUT_LABEL}>Judul Section</label>
              {renderFieldActions("title")}
            </div>
            <input type="text" value={data?.title ?? ""} onChange={(e) => updateField(sectionKey, "title", e.target.value)} placeholder={`cth. Menu ${sectionTitle}`} className={`${MCF_INPUT_BASE} bg-muted/50`} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={MCF_INPUT_LABEL}>Eyebrow <span className="text-slate-500 font-normal normal-case">(opsional)</span></label>
              {renderFieldActions("eyebrow")}
            </div>
            <input type="text" value={data?.eyebrow ?? ""} onChange={(e) => updateField(sectionKey, "eyebrow", e.target.value)} placeholder={`cth. Pilihan ${sectionTitle}`} className={MCF_INPUT_BASE} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={MCF_INPUT_LABEL}>Subtitle <span className="text-slate-500 font-normal normal-case">(opsional)</span></label>
              {renderFieldActions("subtitle")}
            </div>
            <input type="text" value={data?.subtitle ?? ""} onChange={(e) => updateField(sectionKey, "subtitle", e.target.value)} placeholder="cth. Nikmati berbagai pilihan menu terbaik kami" className={MCF_INPUT_BASE} />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold text-primary">
            {sectionKey === "menu" ? "Kuliner" : "Produk"} · {categories.length} kategori
          </div>
        </div>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-sm font-semibold text-slate-200">Belum ada kategori</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Tambahkan kategori agar {itemLabel} bisa ditampilkan lebih rapi di website.</p>
        </div>
      )}

      {/* Categories — DnD sortable */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCatDragEnd}>
        <SortableContext items={categories.map((c: any) => c.id ?? c.name)} strategy={verticalListSortingStrategy}>
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
              />
            );
          })}
        </SortableContext>
      </DndContext>

      <button type="button" onClick={addCategory}
        className="w-full text-[12px] py-2.5 border border-white/10 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Tambah Kategori
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
  sensors, handleItemDragEnd,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: catId });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      {/* Category header */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-white/[0.045] to-white/[0.015] px-3 py-2.5 border-b border-white/10">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing touch-none text-slate-600 hover:text-slate-300 p-0.5 transition-colors"
          aria-label="Geser kategori"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <input
          type="text" value={cat.name ?? ""} onChange={(e) => updateCategoryName(catIdx, e.target.value)}
          placeholder="Nama kategori"
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-100 outline-none placeholder-slate-600"
        />
        <span className="text-[10px] text-slate-500 flex-shrink-0">{itemCount} item</span>
        <button type="button" onClick={() => setExpandedCat(expandedCat === catIdx ? null : catIdx)} className="text-slate-500 hover:text-slate-200 p-1 cursor-pointer">
          {expandedCat === catIdx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <button type="button" onClick={() => removeCategory(catIdx)} className="text-red-500/60 hover:text-red-400 p-1 cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {expandedCat === catIdx && (
        <div className="p-3 space-y-3">
          {items.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/10 bg-muted/30 p-4 text-center text-xs text-slate-500">
              Belum ada {itemLabel}. Klik tombol di bawah untuk menambah.
            </div>
          )}

          {/* Items — DnD sortable */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(ev) => handleItemDragEnd(catIdx, ev)}>
            <SortableContext items={items.map((i: any) => i.id ?? i.name)} strategy={verticalListSortingStrategy}>
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
                />
              ))}
            </SortableContext>
          </DndContext>

          <button type="button" onClick={() => addItem(catIdx)}
            className="w-full text-[12px] py-2 border border-dashed border-primary/20 rounded-xl text-primary/80 hover:bg-primary/10 hover:border-primary/40 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah {itemLabel}
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
  onUpgradeRequired, catName, activeEmojiPicker, setActiveEmojiPicker,
}: any) {
  const itemSortId = item.id ?? item.name ?? String(itemIdx);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: itemSortId });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isAvailable = item.is_available !== false; // default true
  const tags: string[] = item.tags ?? [];
  const deliveryPlatforms: { name: string; url: string }[] = item.delivery_platforms ?? [];

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-white/10 bg-muted/30 p-3">
      {/* Item header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none text-slate-600 hover:text-slate-300 transition-colors"
            aria-label="Geser item"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] uppercase tracking-wide font-bold text-slate-500">{itemLabel} #{itemIdx + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* is_available toggle */}
          <button
            type="button"
            onClick={() => updateItem(catIdx, itemIdx, "is_available", !isAvailable)}
            className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
              isAvailable
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            }`}
            title={isAvailable ? "Klik untuk tandai Habis" : "Klik untuk tandai Tersedia"}
          >
            {isAvailable ? "✓ Tersedia" : "✗ Habis"}
          </button>
          <button type="button" onClick={() => removeItem(catIdx, itemIdx)} className="text-red-500/60 hover:text-red-400 cursor-pointer p-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[180px_1fr]">
        <FileUpload
          label="Foto" value={item.image_url ?? ""}
          onChange={(val) => updateItem(catIdx, itemIdx, "image_url", val || null)}
          placeholder="https://..." maxWidth={800} maxHeight={600} quality={0.8} previewSize="sm"
        />

        <div className="space-y-3">
          {/* Name + Price */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={MCF_INPUT_LABEL}>Nama</label>
              <input type="text" value={item.name ?? ""} onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)} placeholder={`Nama ${itemLabel}`} className={MCF_INPUT_BASE} />
            </div>
            {hasPrice && (
              <div className="space-y-1.5">
                <label className={MCF_INPUT_LABEL}>Label Harga <span className="font-normal normal-case text-slate-500">(tampilan)</span></label>
                <input
                  type="text"
                  value={item.price_display ?? item.price ?? ""}
                  onChange={(e) => {
                    updateItem(catIdx, itemIdx, "price_display", e.target.value);
                    updateItem(catIdx, itemIdx, "price", e.target.value); // keep legacy field in sync
                  }}
                  placeholder="cth. Rp 25.000, $5.99, Mulai Rp 50rb"
                  className={MCF_INPUT_BASE}
                />
                <div className="relative">
                  <label className={`${MCF_INPUT_LABEL} mt-1`}>Harga <span className="font-normal normal-case text-slate-500">(angka untuk subtotal)</span></label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={item.price_amount ?? ""}
                    onChange={(e) => updateItem(catIdx, itemIdx, "price_amount", e.target.value === "" ? null : Number(e.target.value))}
                    placeholder="cth. 25000 atau 5.99"
                    className={`${MCF_INPUT_BASE} [appearance:textfield]`}
                  />
                  {item.price_amount == null && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 pointer-events-none">opsional</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Badge (catalog only) */}
          {hasBadge && (
            <div>
              <label className={MCF_INPUT_LABEL}>Badge <span className="font-normal normal-case text-slate-500">(isi untuk jadikan item unggulan di tampilan showcase)</span></label>
              <input type="text" value={normStr(item.badge)} onChange={(e) => updateItem(catIdx, itemIdx, "badge", normStr(e.target.value) || null)} placeholder="cth. Best Seller, Baru, Promo, Populer" className={MCF_INPUT_BASE} />
            </div>
          )}

          {/* Tags (menu only) */}
          {sectionKey === "menu" && (
            <div>
              <label className={MCF_INPUT_LABEL}>Tags <span className="font-normal normal-case text-slate-500">(misal: Pedas, Vegetarian, Signature)</span></label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map((tag: string, ti: number) => (
                  <span key={ti} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/15 text-primary border border-primary/20">
                    {tag}
                    <button type="button" onClick={() => {
                      const next = tags.filter((_: string, i: number) => i !== ti);
                      updateItem(catIdx, itemIdx, "tags", next);
                    }} className="hover:opacity-70 cursor-pointer">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ketik tag lalu Enter"
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
            <div>
              <label className={MCF_INPUT_LABEL}>Platform Delivery <span className="font-normal normal-case text-slate-500">(GrabFood, GoFood, dll.)</span></label>
              <div className="space-y-1.5 mb-1.5">
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
                      placeholder="Nama (cth. GrabFood)"
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
                      className="text-red-500/60 hover:text-red-400 cursor-pointer p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => updateItem(catIdx, itemIdx, "delivery_platforms", [...deliveryPlatforms, { name: "", url: "" }])}
                className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary cursor-pointer transition-colors"
              >
                <LinkIcon className="w-3 h-3" /> Tambah Platform
              </button>
            </div>
          )}
        </div>

        {/* Description — full width */}
        <div className="col-span-full space-y-1.5 mt-1">
          <div className="flex items-center justify-between">
            <label className={MCF_INPUT_LABEL}>Deskripsi</label>
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
          <div className="flex items-center gap-1.5 bg-muted/30 border border-white/10 border-b-0 rounded-t-xl px-2 py-1.5 text-[10px]">
            <button type="button" onClick={() => { const cur = item.description ?? ""; updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n• " : "• ")); }} className="px-2 py-1 rounded bg-[#1e293b]/60 hover:bg-[#1e293b]/90 text-slate-300 font-semibold cursor-pointer active:scale-95 transition-all text-[9px] flex items-center gap-1 select-none border border-white/5" title="Tambah List Bulat">
              <span>•</span> List
            </button>
            <button type="button" onClick={() => { const cur = item.description ?? ""; updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n1. " : "1. ")); }} className="px-2 py-1 rounded bg-[#1e293b]/60 hover:bg-[#1e293b]/90 text-slate-300 font-semibold cursor-pointer active:scale-95 transition-all text-[9px] select-none border border-white/5" title="Tambah List Angka">
              1. List
            </button>
            <div className="w-px h-3.5 bg-white/10 mx-0.5 select-none" />

            {/* Emoji picker */}
            <div className="relative">
              <button type="button"
                onClick={() => setActiveEmojiPicker(activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx ? null : { catIdx, itemIdx })}
                className={`px-2 py-1 rounded font-semibold cursor-pointer active:scale-95 transition-all text-[9px] flex items-center gap-1 select-none border ${activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx ? "bg-primary/20 text-primary border-primary/30" : "bg-[#1e293b]/60 hover:bg-[#1e293b]/90 border-white/5 text-slate-300"}`}
              >
                😀 Emoji & Simbol
              </button>
              {activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx && (
                <div className="absolute left-0 bottom-full mb-1.5 z-[100] w-64 rounded-xl border border-white/10 bg-[#1e293b] p-3 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1 select-none">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pilih Emoji & Simbol</span>
                    <button type="button" onClick={() => setActiveEmojiPicker(null)} className="text-slate-500 hover:text-slate-300 text-[10px] font-bold cursor-pointer">Tutup</button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-3 pr-1 text-left custom-scrollbar">
                    {EMOJI_GROUPS.map((group) => (
                      <div key={group.name} className="space-y-1">
                        <div className="text-[9px] font-semibold text-slate-500 select-none">{group.name}</div>
                        <div className="grid grid-cols-7 gap-1">
                          {group.emojis.map((emoji) => (
                            <button key={emoji} type="button"
                              onClick={() => { updateItem(catIdx, itemIdx, "description", (item.description ?? "") + emoji); setActiveEmojiPicker(null); }}
                              className="h-7 w-7 rounded bg-muted/40 hover:bg-white/[0.1] flex items-center justify-center text-sm cursor-pointer transition-colors active:scale-90"
                            >{emoji}</button>
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
            rows={4} value={item.description ?? ""}
            onChange={(e) => updateItem(catIdx, itemIdx, "description", e.target.value)}
            placeholder="Deskripsi singkat, list menu, info porsi, detail spesifikasi, dll..."
            className={`${MCF_INPUT_BASE} resize-y min-h-[80px] rounded-t-none border-t-0`}
          />
        </div>

        {/* ── Variant / Add-on Groups ──────────────────────────────────────── */}
        <VariantGroupEditor
          groups={item.variant_groups ?? []}
          onChange={(groups) => updateItem(catIdx, itemIdx, "variant_groups", groups.length ? groups : null)}
        />
      </div>
    </div>
  );
}

// ─── VariantGroupEditor ─────────────────────────────────────────────────────────

const VGE_INPUT = "w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-colors";

interface VGGroup {
  id: string;
  name: string;
  type: "single" | "multiple";
  required: boolean;
  options: VGOption[];
}
interface VGOption { id: string; name: string; price_delta?: number | null; price_display?: string | null; }

function makeGroup(): VGGroup {
  return { id: nanoid(), name: "", type: "single", required: true, options: [{ id: nanoid(), name: "", price_delta: null, price_display: null }] };
}

function VariantGroupEditor({ groups, onChange }: { groups: VGGroup[]; onChange: (groups: VGGroup[]) => void }) {
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
    <div className="mt-3 border-t border-white/8 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Varian / Add-on</span>
        <button
          type="button"
          onClick={() => { const g = makeGroup(); onChange([...groups, g]); setExpandedGroup(g.id); }}
          className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3" /> Tambah Grup
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-[10px] text-slate-500 italic">Belum ada varian. Contoh: Ukuran, Topping, Level Pedas.</p>
      )}

      <div className="flex flex-col gap-2">
        {groups.map((group) => {
          const isOpen = expandedGroup === group.id;
          return (
            <div key={group.id} className="rounded-xl border border-white/10 bg-white/[0.025] overflow-hidden">
              {/* Group header */}
              <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none"
                onClick={() => setExpandedGroup(isOpen ? null : group.id)}
              >
                <span className="flex-1 text-[11px] font-semibold text-slate-200 truncate">
                  {group.name || <span className="text-slate-500 italic">Grup baru</span>}
                </span>
                <span className="text-[9px] text-slate-500 shrink-0">{group.type === "multiple" ? "multi" : "1 pilihan"}</span>
                {isOpen ? <ChevronUp className="w-3 h-3 text-slate-400 shrink-0" /> : <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeGroup(group.id); }}
                  className="text-red-500/60 hover:text-red-400 cursor-pointer p-0.5 shrink-0"
                  aria-label="Hapus grup"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {isOpen && (
                <div className="px-3 pb-3 flex flex-col gap-2 border-t border-white/8">
                  {/* Group name + type + required */}
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                    placeholder="Nama grup (cth. Ukuran, Topping)"
                    className={`${VGE_INPUT} mt-2`}
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={group.type === "multiple"}
                        onChange={(e) => updateGroup(group.id, { type: e.target.checked ? "multiple" : "single" })}
                        className="w-3 h-3 accent-primary"
                      />
                      Multi-pilih
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={group.required}
                        onChange={(e) => updateGroup(group.id, { required: e.target.checked })}
                        className="w-3 h-3 accent-primary"
                      />
                      Wajib dipilih
                    </label>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Pilihan</span>
                    {group.options.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={opt.name}
                          onChange={(e) => updateOption(group.id, opt.id, { name: e.target.value })}
                          placeholder="Nama opsi (cth. S, M, L)"
                          className={`${VGE_INPUT} flex-1`}
                        />
                        <input
                          type="number"
                          value={opt.price_delta ?? ""}
                          onChange={(e) => {
                            const delta = e.target.value === "" ? null : Number(e.target.value);
                            const display = delta != null && delta !== 0 ? (delta > 0 ? `+${delta.toLocaleString()}` : `${delta.toLocaleString()}`) : null;
                            updateOption(group.id, opt.id, { price_delta: delta, price_display: display });
                          }}
                          placeholder="+harga"
                          className={`${VGE_INPUT} w-20 shrink-0`}
                          title="Delta harga (kosongkan jika tidak ada)"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(group.id, opt.id)}
                          disabled={group.options.length <= 1}
                          className="text-red-500/60 hover:text-red-400 disabled:opacity-30 cursor-pointer p-0.5 shrink-0"
                          aria-label="Hapus opsi"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(group.id)}
                      className="self-start flex items-center gap-1 text-[10px] font-semibold text-primary/70 hover:text-primary mt-0.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Tambah opsi
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
