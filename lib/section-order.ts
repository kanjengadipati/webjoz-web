// Urut ulang section badan situs — logika murni (tanpa React) agar bisa dites dengan `node --test`.
// Dipakai oleh drag di preview, drag di daftar sidebar, dan tombol ▲/▼.

/**
 * Pindahkan `source` ke posisi `target` di dalam `order` (urutan section badan yang TAMPIL di editor,
 * sudah tanpa section yang disembunyikan admin). Mengembalikan null bila tidak ada perubahan.
 */
export function moveSection(order: string[], source: string, target: string): string[] | null {
  if (source === target) return null;
  const from = order.indexOf(source);
  const to = order.indexOf(target);
  if (from < 0 || to < 0) return null;
  const next = order.slice();
  next.splice(from, 1);
  next.splice(to, 0, source);
  return next;
}

/** Arah garis sisipan: "before" bila sumber berasal dari bawah target, "after" bila dari atas. */
export function dropPosition(order: string[], source: string, target: string): "before" | "after" | null {
  const from = order.indexOf(source);
  const to = order.indexOf(target);
  if (from < 0 || to < 0 || from === to) return null;
  return from > to ? "before" : "after";
}