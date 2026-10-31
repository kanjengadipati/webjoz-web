// Model gambar hero — SATU sumber kebenaran untuk varian multi-gambar & sidebar.
// Kontrak:
//   - `images` = daftar kanonik; `image_url` = gambar pertama yang terisi.
//   - `image_credits[i]` sejajar dengan `images[i]` (indeks MENTAH). null = tanpa kredit (unggahan sendiri).
//   - `image_credit` (lama, tunggal) = kredit gambar pertama; dipertahankan untuk kompatibilitas.
// Tanpa import runtime/alias supaya bisa dites langsung dengan `node --test`.

export interface HeroImageCredit {
  name: string;
  url: string;
}

export interface HeroImagesInput {
  image_url?: string | null;
  image_credit?: HeroImageCredit | null;
  images?: ReadonlyArray<string | null | undefined> | null;
  image_credits?: ReadonlyArray<HeroImageCredit | null | undefined> | null;
}

export interface HeroSlide {
  src: string;
  /** Indeks di array `hero.images` MENTAH (termasuk slot kosong). Pakai ini untuk fieldKey/penulisan. */
  index: number;
  credit: HeroImageCredit | null;
}

export interface HeroImagesPatch {
  images: string[];
  image_credits: Array<HeroImageCredit | null>;
  image_url: string;
  image_credit: HeroImageCredit | null;
}

const clean = (v: string | null | undefined) => (typeof v === "string" ? v.trim() : "");
/** Foto yang sama walau parameter resize beda ("…?w=1200" vs "…?w=800"). */
const photoKey = (u: string) => clean(u).split("?")[0];
const credit = (c: HeroImageCredit | null | undefined): HeroImageCredit | null => (c && c.name ? c : null);

function hasImages(h: HeroImagesInput): boolean {
  return Array.isArray(h.images) && (h.images as ReadonlyArray<unknown>).some((s) => clean(s as string | null | undefined));
}

/** Salinan mentah (images, credits) dengan panjang sama. Tanpa `images` → dari image_url/image_credit. */
function rawLists(h: HeroImagesInput): { urls: string[]; credits: Array<HeroImageCredit | null> } {
  if (hasImages(h)) {
    const urls = (h.images ?? []).map((s) => clean(s as string | null | undefined));
    // Data lama (belum ada image_credits): kredit tunggal hanya menempel pada slide yang fotonya sama dengan image_url.
    const legacy = !Array.isArray(h.image_credits);
    const primary = photoKey(h.image_url ?? "");
    const credits = urls.map((u, i) =>
      legacy ? (primary && u && photoKey(u) === primary ? credit(h.image_credit) : null) : credit((h.image_credits as ReadonlyArray<HeroImageCredit | null | undefined> | null)?.[i]),
    );
    return { urls, credits };
  }
  const one = clean(h.image_url);
  return one ? { urls: [one], credits: [credit(h.image_credit)] } : { urls: [], credits: [] };
}

function toPatch(urls: string[], credits: Array<HeroImageCredit | null>): HeroImagesPatch {
  const first = Math.max(0, urls.findIndex(Boolean));
  const has = urls.some(Boolean);
  return {
    images: urls,
    image_credits: credits,
    image_url: has ? urls[first] : "",
    image_credit: has ? credits[first] ?? null : null,
  };
}

/** Slide yang tampil. Slot kosong dibuang TAPI `index` tetap menunjuk posisi mentah. */
export function getHeroSlides(h: HeroImagesInput): HeroSlide[] {
  const { urls, credits } = rawLists(h);
  return urls.map((src, index) => ({ src, index, credit: credits[index] ?? null })).filter((s) => s.src);
}

/** Ganti/isi slot `index`. Kredit lama DIHAPUS kecuali `newCredit` diberikan (mis. dari pencarian Unsplash). */
export function setHeroSlide(h: HeroImagesInput, index: number, url: string, newCredit: HeroImageCredit | null = null): HeroImagesPatch {
  const { urls, credits } = rawLists(h);
  while (urls.length <= index) {
    urls.push("");
    credits.push(null);
  }
  urls[index] = clean(url);
  credits[index] = clean(url) ? credit(newCredit) : null;
  return toPatch(urls, credits);
}

export function removeHeroSlide(h: HeroImagesInput, index: number): HeroImagesPatch {
  const { urls, credits } = rawLists(h);
  return toPatch(
    urls.filter((_, i) => i !== index),
    credits.filter((_, i) => i !== index),
  );
}

export function addHeroSlide(h: HeroImagesInput, url = "", newCredit: HeroImageCredit | null = null): HeroImagesPatch {
  const { urls, credits } = rawLists(h);
  urls.push(clean(url));
  credits.push(clean(url) ? credit(newCredit) : null);
  return toPatch(urls, credits);
}

/**
 * Sidebar "Gambar Hero" (image_url). Jika `images` ada → gambar pertama ikut berganti (semua varian ikut berubah).
 * Kredit lama dihapus kecuali `newCredit` diberikan (unggahan sendiri tidak boleh mewarisi "Foto oleh ... di Unsplash").
 */
export function setPrimaryHeroImage(
  h: HeroImagesInput,
  url: string,
  newCredit: HeroImageCredit | null = null,
): { image_url: string; image_credit: HeroImageCredit | null; images?: string[]; image_credits?: Array<HeroImageCredit | null> } {
  const c = clean(url) ? credit(newCredit) : null;
  if (!hasImages(h)) return { image_url: clean(url), image_credit: c };
  const { urls, credits } = rawLists(h);
  const firstIdx = Math.max(0, urls.findIndex(Boolean));
  urls[firstIdx] = clean(url);
  credits[firstIdx] = c;
  return { image_url: clean(url), image_credit: c, images: urls, image_credits: credits };
}

/** Jumlah gambar UNIK yang terisi (untuk MinImages; duplikat tidak dihitung). */
export function countDistinctHeroImages(h: HeroImagesInput): number {
  return new Set(getHeroSlides(h).map((s) => s.src)).size;
}

/** Foto dari Unsplash (host images.unsplash.com / *.unsplash.com). Dipakai untuk fallback "Foto dari Unsplash" saat nama fotografer tidak diketahui. */
export function isUnsplashUrl(url: string | null | undefined): boolean {
  try {
    const host = new URL(clean(url)).hostname;
    return host === "unsplash.com" || host.endsWith(".unsplash.com");
  } catch {
    return false;
  }
}

/** Jumlah foto Unsplash yang TIDAK punya nama fotografer (butuh fallback atribusi umum). */
export function countUncreditedUnsplash(slides: ReadonlyArray<{ src: string; credit: HeroImageCredit | null }>): number {
  return slides.filter((s) => !s.credit?.name && isUnsplashUrl(s.src)).length;
}

/** Kredit unik (per nama+url) dari slide yang ditampilkan — untuk baris kredit gabungan (kolase). */
export function distinctHeroCredits(slides: ReadonlyArray<{ credit: HeroImageCredit | null }>): HeroImageCredit[] {
  const seen = new Set<string>();
  const out: HeroImageCredit[] = [];
  for (const s of slides) {
    const c = s.credit;
    if (!c) continue;
    const k = `${c.name}|${c.url}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(c);
    }
  }
  return out;
}

type Update = (section: string, key: string, value: unknown) => void;

/** Dipakai InlineImage per slide: `onUpdateField={(_, __, v) => commitHeroSlide(onUpdateField, h, slide.index, v)}` */
export function commitHeroSlide(update: Update | undefined, h: HeroImagesInput, index: number, url: string, newCredit: HeroImageCredit | null = null) {
  if (!update) return;
  writeHeroPatch(update, setHeroSlide(h, index, url, newCredit));
}

export function writeHeroPatch(update: Update, p: HeroImagesPatch) {
  update("hero", "images", p.images);
  update("hero", "image_credits", p.image_credits);
  update("hero", "image_url", p.image_url);
  update("hero", "image_credit", p.image_credit);
}