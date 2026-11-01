import { test } from "node:test";
import assert from "node:assert/strict";
import { moveSection, dropPosition } from "../lib/section-order.ts";

const order = ["hero", "about", "benefits", "faq", "cta"];

test("pindah ke bawah: sumber mengambil indeks target", () => {
  assert.deepEqual(moveSection(order, "hero", "faq"), ["about", "benefits", "faq", "hero", "cta"]);
});
test("pindah ke atas", () => {
  assert.deepEqual(moveSection(order, "cta", "about"), ["hero", "cta", "about", "benefits", "faq"]);
});
test("bergeser satu langkah (tombol ▲/▼)", () => {
  assert.deepEqual(moveSection(order, "about", "hero"), ["about", "hero", "benefits", "faq", "cta"]);
  assert.deepEqual(moveSection(order, "about", "benefits"), ["hero", "benefits", "about", "faq", "cta"]);
});
test("tidak berubah / tak dikenal = null; input tidak dimutasi", () => {
  const copy = order.slice();
  assert.equal(moveSection(order, "hero", "hero"), null);
  assert.equal(moveSection(order, "hero", "nope"), null);
  assert.equal(moveSection(order, "nope", "hero"), null);
  moveSection(order, "hero", "cta");
  assert.deepEqual(order, copy);
});
test("dropPosition", () => {
  assert.equal(dropPosition(order, "cta", "about"), "before");
  assert.equal(dropPosition(order, "hero", "faq"), "after");
  assert.equal(dropPosition(order, "hero", "hero"), null);
  assert.equal(dropPosition(order, "hero", "nope"), null);
});