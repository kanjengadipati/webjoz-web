"use client";

/**
 * Cart — shared shopping cart for menu (kuliner) and catalog (retail) sections.
 *
 * Usage:
 *   Wrap your template root with <CartProvider waPhone="628xxx">.
 *   Use useCart() anywhere inside to access cart state and actions.
 *   Render <CartDrawer /> once at the bottom of the template.
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageSquare, ChevronUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;         // unique: `${categoryName}__${itemName}`
  name: string;
  price: string | null;
  category: string;
  qty: number;
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
  setOpen: (v: boolean) => void;
  previewMode: boolean;
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
  previewMode?: boolean; // when true, FAB uses absolute positioning inside container
}

export function CartProvider({ children, waPhone, brandName, previewMode }: CartProviderProps) {
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
    setOpen(true);
  }, []);

  const increment = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  }, []);

  const decrement = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider value={{ items, totalQty, add, increment, decrement, remove, clear, open, setOpen, previewMode: !!previewMode }}>
      {children}
      <CartDrawer waPhone={waPhone} brandName={brandName} />
    </CartContext.Provider>
  );
}

// ─── Floating Cart Button ─────────────────────────────────────────────────────

export function CartFab({ colorStyle }: { colorStyle?: React.CSSProperties }) {
  const { totalQty, setOpen, previewMode } = useCart();
  // Never show FAB in preview/editor mode — cart is for public visitors only
  if (totalQty === 0 || previewMode) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Lihat keranjang (${totalQty} item)`}
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl font-bold text-sm cursor-pointer transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        background: "var(--dt-primary, #7c3aed)",
        color: "var(--dt-primary-foreground, #fff)",
        ...colorStyle,
      }}
    >
      <ShoppingCart className="w-4 h-4" />
      <span>{totalQty} item</span>
    </button>
  );
}

// Helper: hides "Hubungi kami" placeholder prices from item cards.
// The price is shown in the cart and WA message only when it's a real value.
export function isPlaceholderPrice(price?: string | null): boolean {
  if (!price) return true;
  const lower = price.toLowerCase().trim();
  return lower === "hubungi kami" || lower === "hubungi" || lower === "-" || lower === "";
}

interface AddToCartButtonProps {
  itemId: string;
  itemName: string;
  itemPrice: string | null | undefined;
  category: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "light" | "dark" | "dynamic";
}

// ─── Add-to-Cart Button ────────────────────────────────────────────────────────

export function AddToCartButton({
  itemId, itemName, itemPrice, category,
  className, style, variant = "dynamic"
}: AddToCartButtonProps) {
  const { items, add, increment, decrement } = useCart();
  const existing = items.find((i) => i.id === itemId);
  const qty = existing?.qty ?? 0;

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add({ id: itemId, name: itemName, price: itemPrice ?? null, category })}
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

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function buildWAMessage(items: CartItem[], brandName?: string): string {
  const lines: string[] = [];
  lines.push(`Halo${brandName ? " *" + brandName + "*" : ""}! Saya ingin memesan:`);
  lines.push("");

  // Group by category
  const byCategory: Record<string, CartItem[]> = {};
  items.forEach((item) => {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });

  Object.entries(byCategory).forEach(([cat, catItems]) => {
    lines.push(`*${cat}*`);
    catItems.forEach((item) => {
      const priceStr = item.price && !isPlaceholderPrice(item.price) ? ` (${item.price})` : "";
      lines.push(`• ${item.qty}x ${item.name}${priceStr}`);
    });
  });

  lines.push("");
  lines.push("Mohon konfirmasi ketersediaan dan total harga. Terima kasih! 🙏");
  return lines.join("\n");
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return "62" + digits;
}

function CartDrawer({ waPhone, brandName }: { waPhone: string; brandName?: string }) {
  const { items, open, setOpen, increment, decrement, remove, clear, totalQty, previewMode } = useCart();

  if (!open || previewMode) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    const phone = normalizePhone(waPhone);
    const message = buildWAMessage(items, brandName);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[400] bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal
        aria-label="Keranjang Pesanan"
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-slate-900 text-base">Keranjang</h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{totalQty} item</span>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="text-[11px] text-red-400 hover:text-red-600 font-medium cursor-pointer transition-colors"
              >
                Hapus semua
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p className="text-sm">Keranjang masih kosong</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight truncate">{item.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                  {item.price && !isPlaceholderPrice(item.price) && (
                    <p className="text-xs font-bold text-slate-600 mt-0.5">{item.price}</p>
                  )}
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => decrement(item.id)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                    aria-label="Kurangi"
                  >
                    <Minus className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold tabular-nums text-slate-800">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => increment(item.id)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                    aria-label="Tambah"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="p-1 text-slate-300 hover:text-red-400 cursor-pointer transition-colors shrink-0"
                  aria-label={`Hapus ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer: checkout */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-100 space-y-3">
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Pesanan akan dikirim ke WhatsApp pemilik bisnis untuk konfirmasi harga &amp; ketersediaan.
            </p>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full min-h-12 py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 shadow-lg shadow-green-500/20"
              style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
            >
              <MessageSquare className="w-4 h-4" />
              Pesan via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
