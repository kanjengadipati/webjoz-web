// Urut ulang kategori/item katalog-menu — logika murni (tanpa React).
// Konten hasil generator TIDAK punya `id`; id deterministik dibuat saat render (`cat-${idx}` / `item-${idx}`).
// Indeks drag HARUS dicari pada data yang sudah diberi id yang sama.

type Item = Record<string, any>;
type Category = Record<string, any> & { items?: Item[] };

export function ensureItemId(item: Item, idx: number): Item {
  if (item.id) return { ...item, sort_order: item.sort_order ?? idx };
  return { ...item, id: `item-${idx}`, sort_order: item.sort_order ?? idx };
}

export function ensureCatId(cat: Category, idx: number): Category {
  const items = (cat.items ?? []).map((it, i) => ensureItemId(it, i));
  if (cat.id) return { ...cat, sort_order: cat.sort_order ?? idx, items };
  return { ...cat, id: `cat-${idx}`, sort_order: cat.sort_order ?? idx, items };
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  const [m] = next.splice(from, 1);
  next.splice(to, 0, m);
  return next;
}

export function reorderCategories(
  categories: Category[],
  activeId: string,
  overId: string,
): { next: Category[]; oldIdx: number; newIdx: number } | null {
  if (activeId === overId) return null;
  const enriched = categories.map(ensureCatId);
  const oldIdx = enriched.findIndex((c) => c.id === activeId);
  const newIdx = enriched.findIndex((c) => c.id === overId);
  if (oldIdx < 0 || newIdx < 0) return null;
  return {
    next: arrayMove(enriched, oldIdx, newIdx).map((c, i) => ({ ...c, sort_order: i })),
    oldIdx,
    newIdx,
  };
}

export function reorderItems(
  categories: Category[],
  catIdx: number,
  activeId: string,
  overId: string,
): Category[] | null {
  if (activeId === overId || !categories[catIdx]) return null;
  const items = ensureCatId(categories[catIdx], catIdx).items ?? [];
  const oldIdx = items.findIndex((i) => i.id === activeId);
  const newIdx = items.findIndex((i) => i.id === overId);
  if (oldIdx < 0 || newIdx < 0) return null;
  const reordered = arrayMove(items, oldIdx, newIdx).map((it, i) => ({ ...it, sort_order: i }));
  const next = categories.slice();
  next[catIdx] = { ...categories[catIdx], items: reordered };
  return next;
}
