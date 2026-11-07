import { test } from "node:test";
import assert from "node:assert/strict";
import {
  entityFromArchetype, nextEntityFromArchetype, toggleUserEntity,
  groupsForEntity, industriesForEntity, buildSubTypeChips,
} from "../components/site-wizard/entity.ts";

const groups = [
  { id: "tech", industries: [
    { id: "tech.cloud", archetype: "professional_firm", rank: 2 },
    { id: "creator.developer", archetype: "portfolio_individual", rank: 1 },
    { id: "tech.saas", archetype: "software_product", rank: 3 } ] },
  { id: "food", industries: [{ id: "food.cafe", archetype: "food_venue", rank: 1 }] },
  { id: "creative", industries: [{ id: "creator.photographer", archetype: "portfolio_individual", rank: 1 }] },
];

test("entityFromArchetype", () => {
  assert.equal(entityFromArchetype("portfolio_individual"), "individual");
  assert.equal(entityFromArchetype("professional_firm"), "organization");
  assert.equal(entityFromArchetype("food_venue"), null);
  assert.equal(entityFromArchetype(undefined), null);
});

test("entitas turunan ikut berubah saat industri/archetype berganti (bug basi)", () => {
  let s = { value: null, source: null };
  s = nextEntityFromArchetype(s, "professional_firm");
  assert.deepEqual(s, { value: "organization", source: "inferred" });
  s = nextEntityFromArchetype(s, "portfolio_individual");
  assert.deepEqual(s, { value: "individual", source: "inferred" });
});

test("pilihan eksplisit pengguna tidak ditimpa", () => {
  let s = toggleUserEntity({ value: null, source: null }, "individual");
  s = nextEntityFromArchetype(s, "professional_firm");
  assert.deepEqual(s, { value: "individual", source: "user" });
  s = toggleUserEntity(s, "individual");
  assert.deepEqual(s, { value: null, source: null });
});

test("archetype tak dikenal tidak mengubah state", () => {
  const s = { value: "organization", source: "inferred" };
  assert.equal(nextEntityFromArchetype(s, "food_venue"), s);
});

test("groupsForEntity diturunkan dari katalog", () => {
  assert.deepEqual(groupsForEntity(groups, "individual").map((g) => g.id), ["tech", "creative"]);
  assert.deepEqual(groupsForEntity(groups, "organization").map((g) => g.id), ["tech", "food"]);
  assert.equal(groupsForEntity(groups, null).length, 3);
});

test("industriesForEntity: saring + urut rank", () => {
  assert.deepEqual(industriesForEntity(groups[0], "individual").items.map((i) => i.id), ["creator.developer"]);
  assert.deepEqual(industriesForEntity(groups[0], "organization").items.map((i) => i.id), ["tech.cloud", "tech.saas"]);
});

test("industriesForEntity: kosong => fallback daftar penuh + penanda", () => {
  const r = industriesForEntity(groups[1], "individual");
  assert.equal(r.fallback, true);
  assert.deepEqual(r.items.map((i) => i.id), ["food.cafe"]);
});

test("buildSubTypeChips: bidangId with entity", () => {
  const r = buildSubTypeChips({
    groups,
    bidangId: "tech",
    entity: "individual",
    lang: "id",
  });
  assert.equal(r.fallback, false);
  assert.equal(r.items.length, 1);
  assert.equal(r.items[0].value, "creator.developer");
});

test("buildSubTypeChips: bidangId with fallback and hintId", () => {
  const r = buildSubTypeChips({
    groups,
    bidangId: "food",
    entity: "individual",
    hintId: "food.cafe",
    lang: "en",
  });
  assert.equal(r.fallback, true);
  assert.equal(r.items[0].value, "food.cafe");
});

