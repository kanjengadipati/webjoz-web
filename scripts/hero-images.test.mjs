import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getHeroSlides, setHeroSlide, removeHeroSlide, addHeroSlide,
  setPrimaryHeroImage, countDistinctHeroImages, distinctHeroCredits, commitHeroSlide, isUnsplashUrl, countUncreditedUnsplash,
} from "../components/sections/hero/images.ts";

const A = { name: "Ann", url: "https://unsplash.com/@ann" };
const B = { name: "Bob", url: "https://unsplash.com/@bob" };

test("slot kosong dibuang tapi index mentah dipertahankan", () => {
  const s = getHeroSlides({ images: ["A", "", "C"] });
  assert.deepEqual(s.map((x) => [x.src, x.index]), [["A", 0], ["C", 2]]);
});
test("edit slide ke-2 yang tampil menulis ke index mentah yang benar", () => {
  const h = { image_url: "A", images: ["A", "", "C"] };
  const p = setHeroSlide(h, getHeroSlides(h)[1].index, "C2");
  assert.deepEqual(p.images, ["A", "", "C2"]);
});
test("edit slide 0 ikut mengubah images[0] dan image_url (bug carousel-split/filmstrip)", () => {
  const p = setHeroSlide({ image_url: "HERO", images: ["S1", "S2", "S3"] }, 0, "NEW");
  assert.deepEqual([p.images, p.image_url], [["NEW", "S2", "S3"], "NEW"]);
});
test("tanpa images: slide dari image_url+image_credit; edit membuat images", () => {
  assert.deepEqual(getHeroSlides({ image_url: "X", image_credit: A }), [{ src: "X", index: 0, credit: A }]);
  const p = setHeroSlide({ image_url: "X", image_credit: A }, 1, "Y");
  assert.deepEqual([p.images, p.image_credits, p.image_credit], [["X", "Y"], [A, null], A]);
});
test("kredit sejajar dengan images dan ikut bergeser saat hapus", () => {
  const h = { images: ["a", "b", "c"], image_credits: [A, null, B] };
  const p = removeHeroSlide(h, 0);
  assert.deepEqual([p.images, p.image_credits, p.image_url, p.image_credit], [["b", "c"], [null, B], "b", null]);
});
test("unggahan sendiri menghapus kredit lama; kredit baru dari Unsplash disimpan", () => {
  const h = { image_url: "a", image_credit: A, images: ["a", "b"], image_credits: [A, B] };
  assert.deepEqual(setHeroSlide(h, 0, "own.jpg").image_credits, [null, B]);
  assert.equal(setHeroSlide(h, 0, "own.jpg").image_credit, null);
  assert.deepEqual(setHeroSlide(h, 1, "n", A).image_credits, [A, A]);
});
test("tambah slot kosong tidak punya kredit; url kosong menghapus kredit", () => {
  const p = addHeroSlide({ images: ["a"], image_credits: [A] }, "");
  assert.deepEqual([p.images, p.image_credits], [["a", ""], [A, null]]);
  assert.deepEqual(setHeroSlide({ images: ["a"], image_credits: [A] }, 0, "").image_credits, [null]);
});
test("sidebar Gambar Hero menyinkronkan images[0] & membuang kredit lama", () => {
  const r = setPrimaryHeroImage({ image_url: "H", image_credit: A, images: ["S1", "S2"], image_credits: [A, B] }, "N");
  assert.deepEqual(r, { image_url: "N", image_credit: null, images: ["N", "S2"], image_credits: [null, B] });
  assert.deepEqual(setPrimaryHeroImage({ image_url: "H", image_credit: A }, "N"), { image_url: "N", image_credit: null });
  assert.deepEqual(setPrimaryHeroImage({ image_url: "H" }, "N", B), { image_url: "N", image_credit: B });
});
test("duplikat tidak dihitung untuk MinImages", () => {
  assert.equal(countDistinctHeroImages({ images: ["a", "a", "a"] }), 1);
  assert.equal(countDistinctHeroImages({ images: ["a", "", "b"] }), 2);
});
test("kredit unik untuk baris gabungan", () => {
  assert.deepEqual(distinctHeroCredits([{ credit: A }, { credit: null }, { credit: A }, { credit: B }]), [A, B]);
});
test("commitHeroSlide menulis 4 field; undefined update aman", () => {
  const calls = [];
  commitHeroSlide((s, k, v) => calls.push([s, k]), { image_url: "a" }, 0, "z");
  assert.deepEqual(calls, [["hero", "images"], ["hero", "image_credits"], ["hero", "image_url"], ["hero", "image_credit"]]);
  commitHeroSlide(undefined, {}, 0, "z");
});
test("input null/undefined aman", () => {
  assert.deepEqual(getHeroSlides({ images: null, image_url: null }), []);
  assert.equal(setHeroSlide({}, 0, "A").image_url, "A");
});
test("data lama tanpa image_credits: kredit hanya untuk slide yang fotonya sama dengan image_url", () => {
  const h = { image_url: "P?w=1200", image_credit: A, images: ["S1?w=1200", "P?w=800", "S3"] };
  assert.deepEqual(getHeroSlides(h).map((s) => s.credit), [null, A, null]);
  const noMatch = { image_url: "H", image_credit: A, images: ["S1", "S2"] };
  assert.deepEqual(getHeroSlides(noMatch).map((s) => s.credit), [null, null]);
});
test("deteksi Unsplash dari host; unggahan sendiri & URL rusak bukan Unsplash", () => {
  assert.equal(isUnsplashUrl("https://images.unsplash.com/photo-1?w=800"), true);
  assert.equal(isUnsplashUrl("https://unsplash.com/photos/x"), true);
  assert.equal(isUnsplashUrl("https://evil-unsplash.com/x"), false);
  assert.equal(isUnsplashUrl("https://cdn.example.com/own.jpg"), false);
  assert.equal(isUnsplashUrl("not a url"), false);
  assert.equal(isUnsplashUrl(null), false);
});
test("hitung foto Unsplash tanpa nama fotografer", () => {
  const slides = [
    { src: "https://images.unsplash.com/a", credit: null },
    { src: "https://images.unsplash.com/b", credit: A },
    { src: "https://cdn.example.com/own.jpg", credit: null },
  ];
  assert.equal(countUncreditedUnsplash(slides), 1);
});