"use client";

/**
 * Cart — shared shopping cart for menu (kuliner) and catalog (retail) sections.
 *
 * Usage:
 *   Wrap your template root with <CartProvider waPhone="628xxx">.
 *   Use useCart() anywhere inside to access cart state and actions.
 *   Renders a popover at the top-right corner when the cart button is clicked.
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageSquare, ArrowLeft, CheckCircle } from "lucide-react";

import type { ItemVariantGroup } from "@/components/templates/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectedVariant {
  group_id: string;
  group_name: string;
  option_id: string;
  option_name: string;
  price_delta?: number;
  price_display?: string;
}

export interface CartItem {
  id: string;         // unique: `${categoryName}__${itemName}` or `${itemId}__${variantKey}`
  name: string;
  /** Legacy display string kept for backward compat with templates that pass price directly */
  price: string | null;
  /** Numeric amount (e.g. 15.99, 25000) for subtotal calculation. null = custom/nego price */
  price_amount?: number | null;
  /** Formatted display label (e.g. "$15.99", "Rp 25.000") */
  price_display?: string | null;
  category: string;
  qty: number;
  selected_variants?: SelectedVariant[];
}

interface CartContextValue {
  items: CartItem[];
  totalQty: number;
  add: (item: Omit<CartItem, "qty">) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  previewMode: boolean;
  primaryColor: string;
  primaryFg: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface CartProviderProps {
  children: React.ReactNode;
  waPhone: string;
  brandName?: string;
  previewMode?: boolean;
  /** Resolved primary color (hex/rgb), used directly in CartPopover buttons to avoid CSS-var scope issues */
  primaryColor?: string;
  /** Foreground color on primaryColor background (defaults to #fff) */
  primaryFg?: string;
  onSubmitLead?: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>;
}

export function CartProvider({ children, waPhone, brandName, previewMode, primaryColor, primaryFg, onSubmitLead }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  const add = useCallback((item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const increment = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  }, []);

  const decrement = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (!target || target.qty <= 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const resolvedPrimary = primaryColor ?? "#4F46E5";
  const resolvedPrimaryFg = primaryFg ?? "#ffffff";

  return (
    <CartContext.Provider value={{ items, totalQty, add, increment, decrement, remove, clear, open, setOpen, previewMode: !!previewMode, primaryColor: resolvedPrimary, primaryFg: resolvedPrimaryFg }}>
      {children}
      <CartPopover waPhone={waPhone} brandName={brandName} onSubmitLead={onSubmitLead} />
    </CartContext.Provider>
  );
}

// ─── Floating Cart Button ─────────────────────────────────────────────────────

export function CartFab({ colorStyle }: { colorStyle?: React.CSSProperties }) {
  const { totalQty, setOpen } = useCart();
  if (totalQty === 0) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-label={`Lihat keranjang (${totalQty} item)`}
      className="fixed top-20 right-4 z-[200] flex items-center justify-center w-11 h-11 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        background: "var(--dt-primary, var(--primary))",
        color: "var(--dt-primary-foreground, #fff)",
        ...colorStyle,
      }}
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full text-[10px] font-bold leading-none shadow-md"
        style={{
          background: "var(--dt-accent, #ef4444)",
          color: "#fff",
        }}
      >
        {totalQty > 99 ? "99+" : totalQty}
      </span>
    </button>
  );
}

// Helper: hides "Hubungi kami" placeholder prices from item cards.
export function isPlaceholderPrice(price?: string | null): boolean {
  if (!price) return true;
  const lower = price.toLowerCase().trim();
  return lower === "hubungi kami" || lower === "hubungi" || lower === "-" || lower === "";
}

interface AddToCartButtonProps {
  itemId: string;
  itemName: string;
  itemPrice: string | null | undefined;
  itemPriceAmount?: number | null;
  itemPriceDisplay?: string | null;
  itemDescription?: string | null;
  category: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "light" | "dark" | "dynamic";
  /** When true the button is shown as disabled (item out of stock) */
  disabled?: boolean;
  /** Optional variant groups for customization */
  variant_groups?: ItemVariantGroup[] | null;
}

// ─── Add-to-Cart Button ────────────────────────────────────────────────────────

export function AddToCartButton({
  itemId, itemName, itemPrice, itemPriceAmount, itemPriceDisplay, itemDescription, category,
  className, style, variant = "dynamic", disabled = false, variant_groups,
}: AddToCartButtonProps) {
  const { items, add, increment, decrement } = useCart();
  const [selectorOpen, setSelectorOpen] = useState(false);

  const hasVariants = Boolean(variant_groups && variant_groups.length > 0);

  // If item has variants, count all matching items in cart regardless of variant
  const totalItemQty = items
    .filter((i) => i.id === itemId || i.id.startsWith(`${itemId}__`))
    .reduce((s, i) => s + i.qty, 0);

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={`${className ?? ""} opacity-50 cursor-not-allowed`}
        style={style}
        aria-label={`${itemName} tidak tersedia`}
        title="Item tidak tersedia"
      >
        <span>Habis</span>
      </button>
    );
  }

  // If item has variants, button opens the Variant Selector Modal
  if (hasVariants) {
    return (
      <>
        <button
          type="button"
          onClick={() => setSelectorOpen(true)}
          className={className ?? ""}
          style={style}
          aria-label={`Pilih opsi untuk ${itemName}`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{totalItemQty > 0 ? `Pilih Opsi (${totalItemQty})` : "Pilih Opsi"}</span>
        </button>
        {selectorOpen && (
          <VariantSelectorModal
            itemId={itemId}
            itemName={itemName}
            itemPrice={itemPrice}
            itemPriceAmount={itemPriceAmount}
            itemPriceDisplay={itemPriceDisplay}
            itemDescription={itemDescription}
            category={category}
            variant_groups={variant_groups!}
            onClose={() => setSelectorOpen(false)}
          />
        )}
      </>
    );
  }

  // Standard non-variant button behavior
  const existing = items.find((i) => i.id === itemId);
  const qty = existing?.qty ?? 0;

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add({
          id: itemId,
          name: itemName,
          price: itemPrice ?? null,
          price_amount: itemPriceAmount ?? null,
          price_display: itemPriceDisplay ?? null,
          category,
        })}
        className={className ?? ""}
        style={style}
        aria-label={`Tambah ${itemName} ke keranjang`}
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Jumlah ${itemName}`}>
      <button
        type="button"
        onClick={() => decrement(itemId)}
        className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all hover:opacity-80 active:scale-90 focus:outline-none"
        style={style}
        aria-label="Kurangi"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-bold tabular-nums"
        style={{ color: style?.color ?? "inherit" }}>
        {qty}
      </span>
      <button
        type="button"
        onClick={() => increment(itemId)}
        className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all hover:opacity-80 active:scale-90 focus:outline-none"
        style={style}
        aria-label="Tambah"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Variant Selector Modal ───────────────────────────────────────────────────

interface VariantSelectorModalProps {
  itemId: string;
  itemName: string;
  itemPrice: string | null | undefined;
  itemPriceAmount?: number | null;
  itemPriceDisplay?: string | null;
  itemDescription?: string | null;
  category: string;
  variant_groups: ItemVariantGroup[];
  onClose: () => void;
}

export function VariantSelectorModal({
  itemId, itemName, itemPrice, itemPriceAmount, itemPriceDisplay, itemDescription, category,
  variant_groups, onClose,
}: VariantSelectorModalProps) {
  const { add, primaryColor, primaryFg } = useCart();

  // Initialize selected options map: groupId -> optionId[]
  const [selectedMap, setSelectedMap] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    for (const grp of variant_groups) {
      if (grp.type === "single" && grp.options.length > 0 && grp.required !== false) {
        init[grp.id] = [grp.options[0].id];
      } else {
        init[grp.id] = [];
      }
    }
    return init;
  });

  const handleSelectOption = (group: ItemVariantGroup, optionId: string) => {
    setSelectedMap((prev) => {
      if (group.type === "single") {
        return { ...prev, [group.id]: [optionId] };
      }
      const current = prev[group.id] || [];
      const exists = current.includes(optionId);
      const next = exists ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...prev, [group.id]: next };
    });
  };

  // Compute live price delta and selected list
  let totalDelta = 0;
  const selectedVariants: SelectedVariant[] = [];
  const optionKeys: string[] = [];

  for (const grp of variant_groups) {
    const chosenIds = selectedMap[grp.id] || [];
    for (const optId of chosenIds) {
      const opt = grp.options.find((o) => o.id === optId);
      if (opt) {
        if (typeof opt.price_delta === "number") totalDelta += opt.price_delta;
        selectedVariants.push({
          group_id: grp.id,
          group_name: grp.name,
          option_id: opt.id,
          option_name: opt.name,
          price_delta: opt.price_delta,
          price_display: opt.price_display,
        });
        optionKeys.push(opt.id);
      }
    }
  }

  // Validate required groups
  const isValid = variant_groups.every((grp) => {
    if (grp.type === "single" && grp.required !== false) {
      return (selectedMap[grp.id] || []).length > 0;
    }
    return true;
  });

  const hasNumericBase = typeof itemPriceAmount === "number" && itemPriceAmount > 0;
  const computedTotalAmount = hasNumericBase ? itemPriceAmount! + totalDelta : null;

  const handleAddToCart = () => {
    if (!isValid) return;
    optionKeys.sort();
    const variantSignature = optionKeys.length > 0 ? optionKeys.join("_") : "default";
    const cartItemId = `${itemId}__${variantSignature}`;

    // Format display label
    let formattedPriceDisplay = itemPriceDisplay || itemPrice || null;
    if (computedTotalAmount !== null && itemPriceDisplay) {
      formattedPriceDisplay = itemPriceDisplay.replace(/[\d.,]+/, () => computedTotalAmount.toLocaleString());
    }

    add({
      id: cartItemId,
      name: itemName,
      price: itemPrice ?? null,
      price_amount: computedTotalAmount,
      price_display: formattedPriceDisplay,
      category,
      selected_variants: selectedVariants,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={`Pilih varian ${itemName}`}
    >
      <div
        className="w-full max-w-md max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        style={{
          background: "var(--dt-bg, #fff)",
          color: "var(--dt-text, #1e293b)",
          border: "1px solid color-mix(in srgb, var(--dt-text, #1e293b) 12%, transparent)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3 border-b" style={{ borderColor: "color-mix(in srgb, var(--dt-text, #1e293b) 10%, transparent)" }}>
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">{category}</span>
            <h3 className="text-base font-bold truncate leading-tight mt-0.5">{itemName}</h3>
            {itemPriceDisplay || itemPrice ? (
              <span className="text-xs font-semibold block mt-1" style={{ color: "var(--dt-primary, #4F46E5)" }}>
                {itemPriceDisplay || itemPrice}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:opacity-70 cursor-pointer transition-opacity"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body — Variant Groups */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {variant_groups.map((grp) => {
            const chosen = selectedMap[grp.id] || [];
            return (
              <div key={grp.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{grp.name}</span>
                  <span className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "color-mix(in srgb, var(--dt-primary, #4F46E5) 10%, transparent)",
                      color: "var(--dt-primary, #4F46E5)",
                    }}
                  >
                    {grp.type === "single" ? (grp.required !== false ? "Pilih 1 (Wajib)" : "Pilih 1 (Opsional)") : "Boleh Pilih Banyak"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {grp.options.map((opt) => {
                    const isSelected = chosen.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(grp, opt.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer text-left ${
                          isSelected
                            ? "border-primary ring-1 ring-primary"
                            : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                        }`}
                        style={{
                          background: isSelected
                            ? "color-mix(in srgb, var(--dt-primary, #4F46E5) 12%, transparent)"
                            : "color-mix(in srgb, var(--dt-text, #1e293b) 3%, transparent)",
                          color: isSelected ? "var(--dt-primary, #4F46E5)" : "inherit",
                        }}
                      >
                        <span className="truncate mr-1">{opt.name}</span>
                        {opt.price_display || (typeof opt.price_delta === "number" && opt.price_delta > 0) ? (
                          <span className="text-[10px] font-bold opacity-80 shrink-0">
                            {opt.price_display || `+${opt.price_delta!.toLocaleString()}`}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex items-center justify-between gap-3 shrink-0" style={{ borderColor: "color-mix(in srgb, var(--dt-text, #1e293b) 10%, transparent)" }}>
          <div>
            <span className="text-[10px] opacity-60 block">Total Item</span>
            <span className="text-sm font-bold" style={{ color: "var(--dt-primary, #4F46E5)" }}>
              {computedTotalAmount !== null
                ? (itemPriceDisplay ? itemPriceDisplay.replace(/[\d.,]+/, () => computedTotalAmount.toLocaleString()) : computedTotalAmount.toLocaleString())
                : (itemPriceDisplay || itemPrice || "-")}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isValid}
            className="flex-1 max-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: primaryColor,
              color: primaryFg,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Subtotal Helper ──────────────────────────────────────────────────────────

export interface SubtotalResult {
  /** Numeric sum of all items with a defined price_amount */
  total: number;
  /** True when at least one item has no price_amount (custom / nego pricing) */
  hasCustomPricing: boolean;
}

/**
 * Computes the subtotal from cart items.
 * Items without price_amount are counted as custom-pricing and excluded from total.
 */
export function computeSubtotal(items: CartItem[]): SubtotalResult {
  let total = 0;
  let hasCustomPricing = false;
  for (const item of items) {
    if (typeof item.price_amount === "number" && item.price_amount > 0) {
      total += item.price_amount * item.qty;
    } else {
      hasCustomPricing = true;
    }
  }
  return { total, hasCustomPricing };
}

// ─── Cart Popover ─────────────────────────────────────────────────────────────

function buildWAMessage(items: CartItem[], brandName?: string): string {
  const lines: string[] = [];
  lines.push(`Halo${brandName ? " *" + brandName + "*" : ""}! Saya ingin memesan:`);
  lines.push("");

  const byCategory: Record<string, CartItem[]> = {};
  items.forEach((item) => {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });

  const { total, hasCustomPricing } = computeSubtotal(items);

  Object.entries(byCategory).forEach(([cat, catItems]) => {
    lines.push(`*${cat}*`);
    catItems.forEach((item) => {
      // Prefer price_display, fall back to legacy price string
      const displayLabel = item.price_display || item.price;
      const isReal = displayLabel && !isPlaceholderPrice(displayLabel);

      let lineTotal = "";
      if (typeof item.price_amount === "number" && item.price_amount > 0 && item.qty > 1) {
        // Show per-item line total when qty > 1
        const itemTotal = item.price_amount * item.qty;
        lineTotal = ` = ${isReal ? displayLabel!.replace(/[\d.,]+/, (n) => itemTotal.toLocaleString()) : itemTotal.toLocaleString()}`;
      }

      const variantStr = item.selected_variants && item.selected_variants.length > 0
        ? ` (${item.selected_variants.map((v) => `${v.group_name}: ${v.option_name}`).join(", ")})`
        : "";

      const priceStr = isReal ? ` [${displayLabel}${lineTotal}]` : "";
      lines.push(`• ${item.qty}x ${item.name}${variantStr}${priceStr}`);
    });
  });

  lines.push("");

  if (total > 0) {
    lines.push(`*Subtotal: ${total.toLocaleString()}*${hasCustomPricing ? " + harga item lainnya" : ""}`);
  }

  if (hasCustomPricing && total === 0) {
    lines.push("Mohon konfirmasi harga & ketersediaan. Terima kasih!");
  } else if (hasCustomPricing) {
    lines.push("Mohon konfirmasi harga item yang belum tercantum. Terima kasih!");
  } else {
    lines.push("Mohon konfirmasi ketersediaan. Terima kasih!");
  }

  return lines.join("\n");
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return "62" + digits;
}

function CartPopover({ waPhone, brandName, onSubmitLead }: { waPhone: string; brandName?: string; onSubmitLead?: (data: { name: string; email: string; phone: string; message: string }) => Promise<void> }) {
  const { items, open, setOpen, increment, decrement, remove, clear, totalQty, primaryColor, primaryFg } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const [leadLoading, setLeadLoading] = useState(false);

  // Checkout form states
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowForm(false);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerNotes("");
      setIsSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [open, setOpen]);

  const isWaEmpty = !waPhone || waPhone.trim() === "" || waPhone.trim() === "0" || waPhone.trim() === "62";

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (items.length === 0) return;

    if (isWaEmpty) {
      if (!showForm) {
        setShowForm(true);
        return;
      }

      if (!customerName.trim() || !customerPhone.trim()) {
        return;
      }

      setLeadLoading(true);
      try {
        const cartMessage = buildWAMessage(items, brandName);
        const fullMessage = `${cartMessage}\n\n*Catatan/Alamat Tambahan:*\n${customerNotes.trim() || "-"}`;

        if (onSubmitLead) {
          await onSubmitLead({
            name: customerName,
            email: "",
            phone: customerPhone,
            message: fullMessage,
          });
        } else {
          // Simulate submission for preview modes (e.g. site wizard preview)
          await new Promise((resolve) => setTimeout(resolve, 800));
        }

        setIsSuccess(true);
        clear();
      } catch (err) {
        console.error("Failed to submit order lead:", err);
      } finally {
        setLeadLoading(false);
      }
      return;
    }

    const phone = normalizePhone(waPhone);
    const message = buildWAMessage(items, brandName);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="fixed top-20 right-4 z-[400] w-80 max-h-[70vh] flex flex-col shadow-2xl transition-all duration-300"
      role="dialog"
      aria-modal
      aria-label="Keranjang Pesanan"
      style={{
        background: "var(--dt-bg, #fff)",
        color: "var(--dt-text, #1e293b)",
        borderRadius: "var(--dt-radius, 0.75rem)",
        border: "1px solid color-mix(in srgb, var(--dt-text, #1e293b) 10%, transparent)",
        maxWidth: "calc(100vw - 2rem)",
      }}
    >
      {isSuccess ? (
        /* Success Screen */
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "color-mix(in srgb, var(--dt-primary, var(--primary, #4F46E5)) 15%, transparent)",
              color: "var(--dt-primary, var(--primary, #4F46E5))",
            }}
          >
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base">Pesanan Dikirim!</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Terima kasih, pesanan Anda telah tersimpan. Pemilik bisnis akan menghubungi Anda segera.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full py-2.5 text-sm font-bold rounded-lg cursor-pointer transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: primaryColor,
              color: primaryFg,
            }}
          >
            Tutup
          </button>
        </div>
      ) : showForm ? (
        /* Order / Lead Form Screen */
        <form onSubmit={handleCheckout} className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ borderBottom: "1px solid color-mix(in srgb, var(--dt-text, #1e293b) 8%, transparent)" }}
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
              aria-label="Kembali ke keranjang"
              style={{ color: "var(--dt-text, #1e293b)" }}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-sm">Form Pemesanan</span>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Ringkasan Pesanan */}
            <div className="p-2.5 rounded-lg text-xs space-y-1.5"
              style={{
                background: "color-mix(in srgb, var(--dt-primary, var(--primary, #4F46E5)) 8%, transparent)",
                border: "1px solid color-mix(in srgb, var(--dt-primary, var(--primary, #4F46E5)) 15%, transparent)"
              }}
            >
              <span className="font-bold block opacity-80" style={{ color: "var(--dt-primary, var(--primary, #4F46E5))" }}>
                Ringkasan Pesanan ({totalQty} item):
              </span>
              <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center opacity-90">
                    <span className="truncate max-w-[180px]">• {item.name}</span>
                    <span className="font-semibold">{item.qty}x</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1 opacity-75">Nama Lengkap *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all focus:ring-1 focus:ring-offset-0"
                style={{
                  background: "color-mix(in srgb, var(--dt-bg, #fff) 97%, var(--dt-text, #1e293b) 3%)",
                  borderColor: "color-mix(in srgb, var(--dt-text, #1e293b) 15%, transparent)",
                  color: "var(--dt-text, #1e293b)",
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1 opacity-75">Nomor WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="Contoh: 08123456789"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all focus:ring-1 focus:ring-offset-0"
                style={{
                  background: "color-mix(in srgb, var(--dt-bg, #fff) 97%, var(--dt-text, #1e293b) 3%)",
                  borderColor: "color-mix(in srgb, var(--dt-text, #1e293b) 15%, transparent)",
                  color: "var(--dt-text, #1e293b)",
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide mb-1 opacity-75">Alamat / Catatan Tambahan</label>
              <textarea
                placeholder="Tulis alamat pengiriman atau catatan khusus di sini..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none transition-all focus:ring-1 focus:ring-offset-0"
                style={{
                  background: "color-mix(in srgb, var(--dt-bg, #fff) 97%, var(--dt-text, #1e293b) 3%)",
                  borderColor: "color-mix(in srgb, var(--dt-text, #1e293b) 15%, transparent)",
                  color: "var(--dt-text, #1e293b)",
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 shrink-0"
            style={{ borderTop: "1px solid color-mix(in srgb, var(--dt-text, #1e293b) 8%, transparent)" }}
          >
            <button
              type="submit"
              disabled={leadLoading}
              className="w-full min-h-10 py-2.5 font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
              style={{
                background: primaryColor,
                color: primaryFg,
                borderRadius: "0.75rem",
                border: "none",
              }}
            >
              {leadLoading ? (
                <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
              <span>{leadLoading ? "Mengirim..." : "Kirim Pesanan"}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Regular Cart Items Screen */
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ borderBottom: "1px solid color-mix(in srgb, var(--dt-text, #1e293b) 8%, transparent)" }}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" style={{ color: "var(--dt-primary, var(--primary))" }} />
              <span className="font-semibold text-sm">Keranjang</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: "color-mix(in srgb, var(--dt-primary, var(--primary)) 15%, transparent)",
                  color: "var(--dt-primary, var(--primary))",
                }}
              >
                {totalQty}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-[10px] font-medium cursor-pointer transition-colors hover:opacity-70"
                  style={{ color: "var(--dt-text, #1e293b)" }}
                >
                  Hapus semua
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-full cursor-pointer transition-colors hover:opacity-70"
                aria-label="Tutup keranjang"
                style={{ color: "var(--dt-text, #1e293b)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <ShoppingCart className="w-8 h-8 opacity-20" />
                <p className="text-xs opacity-50">Keranjang masih kosong</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                    <p className="text-[11px] opacity-50 mt-0.5">{item.category}</p>
                    {item.selected_variants && item.selected_variants.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.selected_variants.map((v, vi) => (
                          <span
                            key={vi}
                            className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{
                              background: "color-mix(in srgb, var(--dt-primary, var(--primary)) 10%, transparent)",
                              color: "var(--dt-primary, var(--primary))",
                            }}
                          >
                            {v.group_name}: {v.option_name}
                          </span>
                        ))}
                      </div>
                    )}
                    {(() => {
                      const displayLabel = item.price_display || item.price;
                      return displayLabel && !isPlaceholderPrice(displayLabel) ? (
                        <p className="text-[11px] font-semibold mt-0.5"
                          style={{ color: "var(--dt-primary, var(--primary))" }}
                        >
                          {displayLabel}
                        </p>
                      ) : null;
                    })()}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => decrement(item.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all hover:opacity-70"
                      style={{
                        background: "color-mix(in srgb, var(--dt-primary, var(--primary)) 12%, transparent)",
                        color: "var(--dt-primary, var(--primary))",
                      }}
                      aria-label="Kurangi"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-4 text-center text-xs font-bold tabular-nums">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => increment(item.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all hover:opacity-70"
                      style={{
                        background: "color-mix(in srgb, var(--dt-primary, var(--primary)) 12%, transparent)",
                        color: "var(--dt-primary, var(--primary))",
                      }}
                      aria-label="Tambah"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="p-1 cursor-pointer transition-colors hover:opacity-50"
                    style={{ color: "var(--dt-text, #1e293b)" }}
                    aria-label={`Hapus ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-4 py-3 shrink-0 space-y-2"
              style={{ borderTop: "1px solid color-mix(in srgb, var(--dt-text, #1e293b) 8%, transparent)" }}
            >
              {/* Subtotal row */}
              {(() => {
                const { total, hasCustomPricing } = computeSubtotal(items);
                if (total > 0) return (
                  <div className="flex items-baseline justify-between text-xs font-bold">
                    <span className="opacity-70">Subtotal</span>
                    <span style={{ color: "var(--dt-primary, var(--primary))" }}>
                      {total.toLocaleString()}
                      {hasCustomPricing && <span className="font-normal opacity-60 ml-1 text-[10px]">+item lainnya</span>}
                    </span>
                  </div>
                );
                return null;
              })()}
              <p className="text-[10px] text-center leading-relaxed opacity-50">
                {!isWaEmpty ? "Pesanan dikirim ke WhatsApp untuk konfirmasi ketersediaan." : "Pesanan akan dikirim ke pemilik bisnis."}
              </p>
              <button
                type="button"
                onClick={() => handleCheckout()}
                disabled={leadLoading}
                className="w-full min-h-10 py-2.5 font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: !isWaEmpty ? "linear-gradient(135deg, #25D366, #128C7E)" : primaryColor,
                  color: !isWaEmpty ? "#fff" : primaryFg,
                  borderRadius: "0.75rem",
                  border: "none",
                }}
              >
                {leadLoading ? (
                  <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                <span className="text-sm">{leadLoading ? "Mengirim..." : !isWaEmpty ? "Pesan via WhatsApp" : "Kirim Pesanan"}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
