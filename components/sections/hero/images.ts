// Model gambar hero — SATU sumber kebenaran untuk varian multi-gambar & sidebar.
// Kontrak:
//   - `images` = daftar kanonik; `image_url` = gambar pertama yang terisi.
//   - `image_credits[i]` sejajar dengan `images[i]` (indeks MENTAH). null = tanpa kredit (unggahan sendiri).
//   - `image_credit` (lama, tunggal) = kredit gambar pertama; dipertahankan untuk kompatibilitas.
//   - `image_captions[i]` dan `image_hidden[i]` juga sejajar dengan `images[i]`. SEMUA array sejajar ini
//     hanya boleh diubah lewat helper di file ini (hapus/tambah/ganti), supaya tidak bergeser.
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
  image_captions?: ReadonlyArray<string | null | undefined> | null;
  image_hidden?: ReadonlyArray<boolean | null | undefined> | null;
}

export interface HeroSlide {
  src: string;
  /** Indeks di array `hero.images` MENTAH (termasuk slot kosong). Pakai ini untuk fieldKey/penulisan. */
  index: number;
  credit: HeroImageCredit | null;
  caption: string;
  hidden: boolean;
}

export interface HeroImagesPatch {
  images: string[];
  image_credits: Array<HeroImageCredit | null>;
  image_captions: string[];
  image_hidden: boolean[];
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

interface RawLists {
  urls: string[];
  credits: Array<HeroImageCredit | null>;
  captions: string[];
  hidden: boolean[];
}

/** Salinan mentah semua array sejajar (panjang sama). Tanpa `images` → dari image_url/image_credit. */
function rawLists(h: HeroImagesInput): RawLists {
  if (hasImages(h)) {
    const urls = (h.images ?? []).map((s) => clean(s as string | null | undefined));
    // Data lama (belum ada image_credits): kredit tunggal hanya menempel pada slide yang fotonya sama dengan image_url.
    const legacy = !Array.isArray(h.image_credits);
    const primary = photoKey(h.image_url ?? "");
    const credits = urls.map((u, i) =>
      legacy ? (primary && u && photoKey(u) === primary ? credit(h.image_credit) : null) : credit(h.image_credits?.[i]),
    );
    const captions = urls.map((_, i) => clean(h.image_captions?.[i]));
    const hidden = urls.map((_, i) => Boolean(h.image_hidden?.[i]));
    return { urls, credits, captions, hidden };
  }
  const one = clean(h.image_url);
  return one
    ? { urls: [one], credits: [credit(h.image_credit)], captions: [clean(h.image_captions?.[0])], hidden: [Boolean(h.image_hidden?.[0])] }
    : { urls: [], credits: [], captions: [], hidden: [] };
}

function toPatch(r: RawLists): HeroImagesPatch {
  const first = Math.max(0, r.urls.findIndex(Boolean));
  const has = r.urls.some(Boolean);
  return {
    images: r.urls,
    image_credits: r.credits,
    image_captions: r.captions,
    image_hidden: r.hidden,
    image_url: has ? r.urls[first] : "",
    image_credit: has ? r.credits[first] ?? null : null,
  };
}

/**
 * Slide yang tampil. Slot kosong dibuang TAPI `index` tetap menunjuk posisi mentah.
 * Slide yang disembunyikan (`image_hidden`) dibuang juga, kecuali `includeHidden` (mode editor).
 */
export function getHeroSlides(h: HeroImagesInput, opts: { includeHidden?: boolean } = {}): HeroSlide[] {
  const r = rawLists(h);
  return r.urls
    .map((src, index) => ({ src, index, credit: r.credits[index] ?? null, caption: r.captions[index] ?? "", hidden: r.hidden[index] ?? false }))
    .filter((s) => s.src && (opts.includeHidden || !s.hidden));
}

/**
 * Ganti/isi slot `index`. Kredit lama DIHAPUS kecuali `newCredit` diberikan (mis. dari pencarian Unsplash).
 * Caption ikut dikosongkan bila fotonya berganti (caption lama tidak berlaku untuk foto baru).
 */
export function setHeroSlide(h: HeroImagesInput, index: number, url: string, newCredit: HeroImageCredit | null = null): HeroImagesPatch {
  const r = rawLists(h);
  while (r.urls.length <= index) {
    r.urls.push("");
    r.credits.push(null);
    r.captions.push("");
    r.hidden.push(false);
  }
  const next = clean(url);
  if (photoKey(r.urls[index]) !== photoKey(next)) r.captions[index] = "";
  r.urls[index] = next;
  r.credits[index] = next ? credit(newCredit) : null;
  if (!next) r.hidden[index] = false;
  return toPatch(r);
}

export function removeHeroSlide(h: HeroImagesInput, index: number): HeroImagesPatch {
  const r = rawLists(h);
  const keep = (_: unknown, i: number) => i !== index;
  return toPatch({
    urls: r.urls.filter(keep),
    credits: r.credits.filter(keep),
    captions: r.captions.filter(keep),
    hidden: r.hidden.filter(keep),
  });
}

export function addHeroSlide(h: HeroImagesInput, url = "", newCredit: HeroImageCredit | null = null): HeroImagesPatch {
  const r = rawLists(h);
  r.urls.push(clean(url));
  r.credits.push(clean(url) ? credit(newCredit) : null);
  r.captions.push("");
  r.hidden.push(false);
  return toPatch(r);
}

/**
 * Pindahkan slot `from` ke posisi `to` (indeks mentah, mis. dari drag di sidebar).
 * SEMUA array sejajar ikut pindah; `image_url`/`image_credit` mengikuti gambar pertama yang baru.
 */
export function moveHeroSlide(h: HeroImagesInput, from: number, to: number): HeroImagesPatch {
  const r = rawLists(h);
  const n = r.urls.length;
  if (from === to || from < 0 || to < 0 || from >= n || to >= n) return toPatch(r);
  const move = <T,>(arr: T[]) => {
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
  };
  move(r.urls);
  move(r.credits);
  move(r.captions);
  move(r.hidden);
  return toPatch(r);
}

/** Ubah caption slot `index` (indeks mentah). */
export function setHeroCaption(h: HeroImagesInput, index: number, text: string): HeroImagesPatch {
  const r = rawLists(h);
  while (r.urls.length <= index) {
    r.urls.push("");
    r.credits.push(null);
    r.captions.push("");
    r.hidden.push(false);
  }
  r.captions[index] = text;
  return toPatch(r);
}

/** Sembunyikan/tampilkan slot `index` (indeks mentah). Slot kosong tidak bisa disembunyikan. */
export function toggleHeroSlideHidden(h: HeroImagesInput, index: number): HeroImagesPatch {
  const r = rawLists(h);
  if (r.urls[index]) r.hidden[index] = !r.hidden[index];
  return toPatch(r);
}

/**
 * Sidebar "Gambar Hero" (image_url). Jika `images` ada → gambar pertama ikut berganti (semua varian ikut berubah).
 * Kredit & caption lama dihapus (kredit kecuali `newCredit` diberikan): unggahan sendiri tidak boleh mewarisi
 * "Foto oleh ... di Unsplash". Kembalian berisi semua array sejajar bila `images` ada.
 */
export function setPrimaryHeroImage(
  h: HeroImagesInput,
  url: string,
  newCredit: HeroImageCredit | null = null,
): Partial<HeroImagesPatch> & { image_url: string; image_credit: HeroImageCredit | null } {
  const c = clean(url) ? credit(newCredit) : null;
  if (!hasImages(h)) return { image_url: clean(url), image_credit: c };
  const firstIdx = Math.max(0, rawLists(h).urls.findIndex(Boolean));
  const p = setHeroSlide(h, firstIdx, url, newCredit);
  return { image_url: clean(url), image_credit: c, images: p.images, image_credits: p.image_credits, image_captions: p.image_captions, image_hidden: p.image_hidden };
}

/** Jumlah gambar UNIK yang terisi (untuk MinImages; duplikat tidak dihitung). */
export function countDistinctHeroImages(h: HeroImagesInput): number {
  return new Set(getHeroSlides(h).map((s) => s.src)).size;
}

/** Foto dari Unsplash (host images.unsplash.com / *.unsplash.com). */
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
  update("hero", "image_captions", p.image_captions);
  update("hero", "image_hidden", p.image_hidden);
  update("hero", "image_url", p.image_url);
  update("hero", "image_credit", p.image_credit);
}
