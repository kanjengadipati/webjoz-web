// archetype-meta.test.mjs — proves the frontend reads archetype metadata from
// the API payload instead of hardcoding it. A brand-new archetype must be fully
// usable after setArchetypeMeta() without any TS edit.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  setArchetypeMeta,
  archetypeMeta,
  archetypeToLegacyType,
  archetypeForLegacyType,
  entityOfArchetype,
  isIndividualArchetype,
  fallbackArchetypeForEntity,
} from "../components/site-wizard/archetype-meta.ts";

test("fallback covers the existing 10 archetypes (pre-fetch render)", () => {
  assert.equal(archetypeToLegacyType("food_venue"), "Kuliner");
  assert.equal(archetypeToLegacyType("software_product"), "Company Profile");
  // Canonical reverse mapping mirrors taxonomy.ArchetypeForLegacyType.
  assert.equal(archetypeForLegacyType("Company Profile"), "corporate_org");
  assert.equal(archetypeForLegacyType("Lodging"), "lodging");
  assert.equal(entityOfArchetype("portfolio_individual"), "individual");
  assert.equal(entityOfArchetype("professional_firm"), "organization");
  assert.equal(entityOfArchetype("food_venue"), null);
  assert.equal(fallbackArchetypeForEntity("individual"), "portfolio_individual");
  assert.equal(fallbackArchetypeForEntity(null), "booking_service");
});

test("API metadata drives every lookup, including a brand-new archetype", () => {
  setArchetypeMeta([
    { id: "food_venue", legacy_type: "Kuliner", context_type: "Kuliner", entity: "" },
    {
      id: "brand_new_arch",
      legacy_type: "Company Profile",
      context_type: "Brand New Context",
      entity: "individual",
    },
  ]);

  assert.deepEqual(archetypeMeta("brand_new_arch"), {
    legacyType: "Company Profile",
    contextType: "Brand New Context",
    entity: "individual",
  });
  assert.equal(archetypeToLegacyType("brand_new_arch"), "Company Profile");
  assert.equal(archetypeForLegacyType("Brand New Context"), "brand_new_arch");
  assert.equal(entityOfArchetype("brand_new_arch"), "individual");
  assert.equal(isIndividualArchetype("brand_new_arch"), true);
  // Existing entry still resolves from the payload.
  assert.equal(archetypeToLegacyType("food_venue"), "Kuliner");
});

test("legacy_type is many-to-one; context wins on reverse lookup", () => {
  setArchetypeMeta([
    { id: "corporate_org", legacy_type: "Company Profile", context_type: "Company Profile", entity: "organization" },
    { id: "new_org", legacy_type: "Company Profile", context_type: "New Org", entity: "organization" },
  ]);
  assert.equal(archetypeForLegacyType("Company Profile"), "corporate_org");
  assert.equal(archetypeForLegacyType("New Org"), "new_org");
});

test("null/empty payload restores the fallback", () => {
  setArchetypeMeta([]);
  assert.equal(archetypeMeta("brand_new_arch").legacyType, "");
  assert.equal(archetypeToLegacyType("portfolio_individual"), "Portofolio");
});
