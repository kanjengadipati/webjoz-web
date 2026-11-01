import { test } from "node:test";
import assert from "node:assert/strict";
import { getSectionStatus, isSectionEmpty, addToPlan } from "../lib/section-status.ts";

const dt = (order, hidden = []) => ({ layout: { section_order: order, hidden_sections: hidden } });
const order = ["hero", "about", "benefits", "faq", "cta", "contact"];

test("tampil: ada di section_order dan tidak tersembunyi", () => {
  assert.equal(getSectionStatus("about", dt(order), {}), "visible");
});
test("hidden-user: disembunyikan dan kontennya ada", () => {
  assert.equal(getSectionStatus("faq", dt(order, ["faq"]), { faq: { items: [{ q: "a" }] } }), "hidden-user");
  assert.equal(getSectionStatus("about", dt(order, ["about"]), {}), "hidden-user"); // bukan opsional
});
test("hidden-empty: opsional, tersembunyi, dan kosong", () => {
  assert.equal(getSectionStatus("faq", dt(order, ["faq"]), { faq: { items: [] } }), "hidden-empty");
  assert.equal(getSectionStatus("menu", dt(order, ["menu"]), {}), "hidden-empty");
  assert.equal(getSectionStatus("catalog", dt(order, ["catalog"]), { catalog: { categories: [] } }), "hidden-empty");
  assert.equal(getSectionStatus("blog", dt(order, ["blog"]), { blog: { posts: [] } }), "hidden-empty");
});
test("not-in-plan: tidak di section_order, tidak tersembunyi", () => {
  assert.equal(getSectionStatus("pricing", dt(order), {}), "not-in-plan");
  assert.equal(getSectionStatus("stats", dt(order), {}), "not-in-plan");
});
test("tidak di section_order tapi berisi konten → disisipkan template → tampil", () => {
  assert.equal(getSectionStatus("gallery", dt(order), { gallery: { items: [1] } }), "visible");
  assert.equal(getSectionStatus("gallery", dt(order), { gallery: { items: [] } }), "not-in-plan");
});
test("tanpa section_order: tidak bisa dipastikan → visible", () => {
  assert.equal(getSectionStatus("pricing", { layout: {} }, {}), "visible");
  assert.equal(getSectionStatus("pricing", null, {}), "visible");
});
test("tersembunyi mengalahkan not-in-plan", () => {
  assert.equal(getSectionStatus("pricing", dt(order, ["pricing"]), {}), "hidden-user");
});
test("isSectionEmpty", () => {
  assert.equal(isSectionEmpty({ pricing: { plans: [1] } }, "pricing"), false);
  assert.equal(isSectionEmpty({}, "stats"), true);
  assert.equal(isSectionEmpty({ stats: { items: [1] } }, "stats"), false);
});
test("addToPlan: sebelum cta; fallback contact; fallback akhir; tidak menggandakan; tidak memutasi", () => {
  assert.deepEqual(addToPlan(order, "pricing"), ["hero", "about", "benefits", "faq", "pricing", "cta", "contact"]);
  assert.deepEqual(addToPlan(["hero", "contact"], "pricing"), ["hero", "pricing", "contact"]);
  assert.deepEqual(addToPlan(["hero", "about"], "pricing"), ["hero", "about", "pricing"]);
  assert.deepEqual(addToPlan(order, "faq"), order);
  const copy = order.slice(); addToPlan(order, "x"); assert.deepEqual(order, copy);
});
