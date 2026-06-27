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

  Object.entries(byCategory).forEach(([cat, catItems]) => {
    lines.push(`*${cat}*`);
    catItems.forEach((item) => {
      const priceStr = item.price && !isPlaceholderPrice(item.price) ? ` (${item.price})` : "";
      lines.push(`• ${item.qty}x ${item.name}${priceStr}`);
    });
  });

  lines.push("");
  lines.push("Mohon konfirmasi ketersediaan dan total harga. Terima kasih!");
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
                    {item.price && !isPlaceholderPrice(item.price) && (
                      <p className="text-[11px] font-semibold mt-0.5"
                        style={{ color: "var(--dt-primary, var(--primary))" }}
                      >
                        {item.price}
                      </p>
                    )}
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
              <p className="text-[10px] text-center leading-relaxed opacity-50">
                {!isWaEmpty ? "Pesanan dikirim ke WhatsApp untuk konfirmasi harga & ketersediaan." : "Pesanan akan dikirim ke pemilik bisnis."}
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
