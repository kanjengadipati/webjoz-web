import { test } from "node:test";
import assert from "node:assert/strict";
import { reorderCategories, reorderItems, ensureCatId } from "../lib/catalog-reorder.ts";

const gen = () => [
  { name: "Kopi", items: [{ name: "Latte" }, { name: "Espresso" }, { name: "Mocha" }] },
  { name: "Makanan", items: [{ name: "Roti" }] },
];

test("konten generator tanpa id: kategori bisa diurut (bug: dulu no-op)", () => {
  const ids = gen().map((c, i) => ensureCatId(c, i).id);
  assert.deepEqual(ids, ["cat-0", "cat-1"]);
  const r = reorderCategories(gen(), "cat-0", "cat-1");
  assert.deepEqual(r.next.map((c) => c.name), ["Makanan", "Kopi"]);
  assert.deepEqual([r.oldIdx, r.newIdx], [0, 1]);
});
test("id yang tersimpan unik dan stabil setelah urut ulang", () => {
  const r1 = reorderCategories(gen(), "cat-0", "cat-1");
  assert.deepEqual(r1.next.map((c) => c.id), ["cat-1", "cat-0"]);
  const r2 = reorderCategories(r1.next, "cat-1", "cat-0");
  assert.deepEqual(r2.next.map((c) => c.name), ["Kopi", "Makanan"]);
});
test("item tanpa id diurut; urutan lain & kategori lain tak berubah", () => {
  const next = reorderItems(gen(), 0, "item-2", "item-0");
  assert.deepEqual(next[0].items.map((i) => i.name), ["Mocha", "Latte", "Espresso"]);
  assert.deepEqual(next[0].items.map((i) => i.sort_order), [0, 1, 2]);
  assert.deepEqual(next[1].items.map((i) => i.name), ["Roti"]);
});
test("campuran id tersimpan & tanpa id", () => {
  const cats = gen();
  cats[0].items[1] = { id: "abc", name: "Espresso" };
  const next = reorderItems(cats, 0, "abc", "item-0");
  assert.deepEqual(next[0].items.map((i) => i.name), ["Espresso", "Latte", "Mocha"]);
});
test("id tak dikenal / sama / kategori tak ada = null (tanpa perubahan)", () => {
  assert.equal(reorderCategories(gen(), "x", "cat-1"), null);
  assert.equal(reorderCategories(gen(), "cat-0", "cat-0"), null);
  assert.equal(reorderItems(gen(), 5, "item-0", "item-1"), null);
  assert.equal(reorderItems(gen(), 0, "item-0", "nope"), null);
});
