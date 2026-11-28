import { test } from "node:test";
import assert from "node:assert/strict";
import {
  viewFor,
  orderByEligibility,
  eligibilityBadges,
  indexRows,
} from "../lib/variant-eligibility.ts";

const payload = (variants, resolved = true) => ({ section: "hero", resolved, tags_known: true, variants });
const row = (variant, status, extra = {}) => ({ variant, status, content_ready: true, ...extra });

const rows = indexRows(
  payload([
    row("tech-saas", "discouraged"),
    row("cinematic-immersive", "fit"),
    row("centered", "neutral"),
    row("collage-mosaic", "fit", { min_images: 3 }),
  ]),
);

test("indexRows: bisnis tak terselesaikan -> null (picker tak berubah)", () => {
  assert.equal(indexRows(payload([row("a", "fit")], false)), null);
  assert.equal(indexRows(null), null);
});

test("viewFor: varian tak dikenal netral", () => {
  assert.deepEqual(viewFor(rows, "unknown"), { status: "neutral", needsImages: 0, manualOnly: false });
  assert.equal(viewFor(null, "centered").status, "neutral");
});

test("viewFor: butuh foto hanya bila jumlah foto diketahui dan kurang", () => {
  assert.equal(viewFor(rows, "collage-mosaic", 1).needsImages, 3);
  assert.equal(viewFor(rows, "collage-mosaic", 3).needsImages, 0);
  assert.equal(viewFor(rows, "collage-mosaic", undefined).needsImages, 0);
  assert.equal(viewFor(rows, "collage-mosaic", -1).needsImages, 0);
});

test("viewFor: varian yang sedang dipakai tidak pernah 'kurang cocok'", () => {
  assert.equal(viewFor(rows, "tech-saas", 0, "tech-saas").status, "neutral");
  assert.equal(viewFor(rows, "tech-saas", 0, "centered").status, "discouraged");
});

test("orderByEligibility: cocok dulu, kurang cocok terakhir, sisanya urutan asli, tidak ada yang hilang", () => {
  const opts = ["tech-saas", "centered", "x", "cinematic-immersive", "collage-mosaic"].map((value) => ({ value }));
  const out = orderByEligibility(opts, rows).map((o) => o.value);
  assert.deepEqual(out, ["cinematic-immersive", "collage-mosaic", "centered", "x", "tech-saas"]);
  assert.equal(out.length, opts.length);
});

test("orderByEligibility: tanpa data -> urutan asli", () => {
  const opts = ["b", "a"].map((value) => ({ value }));
  assert.deepEqual(orderByEligibility(opts, null), opts);
});

test("badge: cocok, kurang cocok, butuh foto; grup tidak disentuh", () => {
  assert.deepEqual(eligibilityBadges({ status: "fit", needsImages: 0, manualOnly: false }, "id"), ["Cocok"]);
  assert.deepEqual(eligibilityBadges({ status: "fit", needsImages: 0, manualOnly: false }, "en"), ["Suited"]);
  assert.deepEqual(eligibilityBadges({ status: "discouraged", needsImages: 3, manualOnly: false }, "id"), ["Kurang cocok", "Butuh 3 foto"]);
  assert.deepEqual(eligibilityBadges({ status: "neutral", needsImages: 2, manualOnly: false }, "en"), ["Needs 2 photos"]);
  assert.deepEqual(eligibilityBadges({ status: "neutral", needsImages: 0, manualOnly: false }, "id"), []);
});
