import test from "node:test";
import assert from "node:assert/strict";
import {
  ARCHETYPE_ORDER,
  archetypeChipWindow,
  archetypeToCategoryIndex,
  inferArchetypeFromText,
} from "../lib/showcase-archetypes.ts";

test("chip window always contains the selected archetype", () => {
  for (const id of ARCHETYPE_ORDER) {
    const w = archetypeChipWindow(id, 4);
    assert.equal(w.length, 4);
    assert.ok(w.includes(id), `${id} missing from ${w}`);
  }
});

test("unknown archetype falls back to the first window", () => {
  assert.deepEqual(archetypeChipWindow("nope", 3), ARCHETYPE_ORDER.slice(0, 3));
});

test("every archetype maps onto one of the 3 skeleton layouts", () => {
  for (const id of ARCHETYPE_ORDER) assert.ok([0, 1, 2].includes(archetypeToCategoryIndex(id)));
  assert.equal(archetypeToCategoryIndex("food_venue"), 0);
  assert.equal(archetypeToCategoryIndex("retail_catalog"), 2);
  assert.equal(archetypeToCategoryIndex("lodging"), 1);
});

test("keyword inference covers the new archetypes", () => {
  assert.equal(inferArchetypeFromText("Kopi Jozz Jogja"), "food_venue");
  assert.equal(inferArchetypeFromText("Online Fashion Shop"), "retail_catalog");
  assert.equal(inferArchetypeFromText("Villa Merapi homestay"), "lodging");
  assert.equal(inferArchetypeFromText("Wisata Pantai Parangtritis"), "destination");
  assert.equal(inferArchetypeFromText("Yayasan Pendidikan Nusantara"), "institution_org");
  assert.equal(inferArchetypeFromText("Heriyadi software engineer portfolio"), "software_product");
  assert.equal(inferArchetypeFromText("CV Jaya Bangun Persada konstruksi"), "corporate_org");
  assert.equal(inferArchetypeFromText("Klinik Gigi Smile"), "booking_service");
});
