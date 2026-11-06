import { test } from "node:test";
import assert from "node:assert/strict";
import { routeInference, preInferredFromClassify } from "../components/site-wizard/inference-v2.ts";

// routeInference cases
test("high + industry_id (no needs_choice) => confirm", () => {
  const route = routeInference({ needs_choice: false, industry_id: "service.pet_care" });
  assert.equal(route, "confirm");
});

test("high without industry_id => pick", () => {
  const route = routeInference({ needs_choice: false });
  assert.equal(route, "pick");
});

test("medium + suggested_industry_id => suggest", () => {
  const route = routeInference({ needs_choice: true, suggested_industry_id: "food.cafe" });
  assert.equal(route, "suggest");
});

test("needs_choice true without suggestion => pick", () => {
  const route = routeInference({ needs_choice: true });
  assert.equal(route, "pick");
});

test("null => pick", () => {
  assert.equal(routeInference(null), "pick");
});

test("undefined => pick", () => {
  assert.equal(routeInference(undefined), "pick");
});

// preInferredFromClassify: field mapping
test("preInferredFromClassify maps industry_id to industryId", () => {
  const pre = preInferredFromClassify(
    { type: "Layanan & Reservasi", subType: "" },
    { archetype: "booking_service", industry_id: "service.pet_care", confidence: "high" },
  );
  assert.equal(pre.industryId, "service.pet_care");
  assert.equal(pre.archetype, "booking_service");
  assert.equal(pre.confidence, "high");
  assert.equal(pre.type, "Layanan & Reservasi");
});

test("preInferredFromClassify with low confidence stays low", () => {
  const pre = preInferredFromClassify(
    { type: "Toko", subType: "Elektronik" },
    { archetype: "retail_catalog", industry_id: "shop.electronics", confidence: "low" },
  );
  assert.equal(pre.confidence, "low");
});

test("preInferredFromClassify with null v2 fields", () => {
  const pre = preInferredFromClassify({ type: "Toko", subType: "" }, null);
  assert.equal(pre.type, "Toko");
  assert.equal(pre.industryId, undefined);
  assert.equal(pre.archetype, undefined);
});

// Putaran 7: additional routeInference cases
test("needs_choice true with industry_id => pick", () => {
  const route = routeInference({ needs_choice: true, industry_id: "food.cafe" });
  assert.equal(route, "pick");
});

test("needs_choice true with empty industry_id + suggested => suggest", () => {
  const route = routeInference({ needs_choice: true, industry_id: "", suggested_industry_id: "shop.general" });
  assert.equal(route, "suggest");
});

test("needs_choice false with industry_id => confirm", () => {
  const route = routeInference({ needs_choice: false, industry_id: "food.cafe" });
  assert.equal(route, "confirm");
});
