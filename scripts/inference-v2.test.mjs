import { test } from "node:test";
import assert from "node:assert/strict";
import { applyV2Inference, preInferredFromClassify, toConfidence } from "../components/site-wizard/inference-v2.ts";

const v1Medium = { type: "Layanan & Reservasi", subType: "", confidence: "medium" };

test("high + archetype + industry_id => resolved industry (skip sub-type picker)", () => {
  const r = applyV2Inference(v1Medium, { archetype: "booking_service", industryId: "service.pet_care", confidence: "high" });
  assert.equal(r.confidence, "high");
  assert.equal(r.industryId, "service.pet_care");
  assert.equal(r.type, "Layanan & Reservasi");
  assert.equal(r.subType, "");
});

test("medium keeps the v1 result (sub-type picker)", () => {
  const r = applyV2Inference(v1Medium, { archetype: "booking_service", industryId: "service.pet_care", confidence: "medium" });
  assert.deepEqual(r, v1Medium);
});

test("no industry_id keeps the v1 result", () => {
  const r = applyV2Inference(v1Medium, { archetype: "booking_service", confidence: "high" });
  assert.deepEqual(r, v1Medium);
});

test("v1 validation failed but v2 high => type derived from archetype", () => {
  const r = applyV2Inference({ confidence: "low" }, { archetype: "lodging", industryId: "stay.villa", confidence: "high" });
  assert.equal(r.type, "Company Profile");
  assert.equal(r.confidence, "high");
});

test("undefined v2 is a no-op", () => {
  assert.deepEqual(applyV2Inference(v1Medium, undefined), v1Medium);
  assert.deepEqual(applyV2Inference(v1Medium, null), v1Medium);
});

// Regression: skip/Next used to hand only {type, subType} to the next step, so a
// high-confidence industry_id from the API was dropped (typed description kept it).
test("skip path and typed path give the same result for the same API response", () => {
  const api = { archetype: "booking_service", industry_id: "service.pet_care", confidence: "high" };
  const pre = preInferredFromClassify({ type: "Layanan & Reservasi", subType: "" }, api);
  const viaSkip = applyV2Inference({ type: pre.type, subType: pre.subType, confidence: "medium" }, pre);
  const viaTyped = applyV2Inference(
    { type: "Layanan & Reservasi", subType: "", confidence: "medium" },
    { archetype: api.archetype, industryId: api.industry_id, confidence: api.confidence },
  );
  assert.deepEqual(viaSkip, viaTyped);
  assert.equal(viaSkip.industryId, "service.pet_care");
});

test("toConfidence normalises unknown values to low", () => {
  assert.equal(toConfidence("high"), "high");
  assert.equal(toConfidence("medium"), "medium");
  assert.equal(toConfidence(undefined), "low");
  assert.equal(toConfidence("weird"), "low");
});

// Real API response (skip/Next path, "Meong Salon"): confidence high + industry_id,
// sub_type empty because service.pet_care has no v1 sub-type. Must resolve to the
// industry (single confirmed chip), not fall back to the type-only chip list.
test("real response: high + service.pet_care with empty v1 sub_type resolves the industry", () => {
  const api = {
    refined_text: "Professional grooming services to keep your cats and dogs looking and feeling their best.",
    type: "Layanan & Reservasi", sub_type: "", confidence: "high",
    archetype: "booking_service", industry_id: "service.pet_care", group: "agri", alternatives: ["shop.pet"],
  };
  const pre = preInferredFromClassify({ type: api.type, subType: api.sub_type }, api);
  assert.equal(pre.confidence, "high");
  // Option A in processDescriptionSubmission: v1 result is "medium" because subType is empty
  const result = applyV2Inference({ type: pre.type, subType: pre.subType, confidence: pre.subType ? "high" : "medium" }, pre);
  assert.equal(result.confidence, "high");
  assert.equal(result.industryId, "service.pet_care");
});
