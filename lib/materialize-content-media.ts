// FILE: lib/materialize-content-media.ts
//
// Defer-to-save untuk gambar konten: selama editing preview memakai blob URL
// lokal (tanpa upload). Saat situs dibuat, panggil materializeContentMedia()
// untuk mengunggah tiap blob URL (unik) sekali ke Cloudinary dan menggantinya
// dengan secure_url. Hasilnya: Cloudinary hanya menerima gambar yang benar-
// benar masuk ke situs yang disimpan — tidak ada sampah dari user yang
// gonta-ganti gambar.
//
// sanitizeContentMedia() adalah pasangan-nya untuk persistensi draft: blob URL
// tidak valid setelah reload, jadi strip menjadi "" saat menulis snapshot /
// PENDING_KEY (teks & desain tetap selamat).

/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadImageFile } from "@/components/file-upload";

function walkStrings(node: any, cb: (v: string) => void): void {
  if (typeof node === "string") {
    cb(node);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((n) => walkStrings(n, cb));
    return;
  }
  if (node && typeof node === "object") {
    Object.values(node).forEach((v) => walkStrings(v, cb));
  }
}

function replaceStrings(node: any, fn: (v: string) => string): any {
  if (typeof node === "string") return fn(node);
  if (Array.isArray(node)) return node.map((n) => replaceStrings(n, fn));
  if (node && typeof node === "object") {
    const out: any = {};
    for (const k of Object.keys(node)) out[k] = replaceStrings(node[k], fn);
    return out;
  }
  return node;
}

/** Kumpulkan semua blob URL unik di dalam content. */
export function collectBlobUrls(content: any): string[] {
  const set = new Set<string>();
  walkStrings(content, (v) => {
    if (v.startsWith("blob:")) set.add(v);
  });
  return Array.from(set);
}

/** Hapus blob URL (ganti "") supaya draft tidak menyimpan URL yang mati. */
export function sanitizeContentMedia<T = any>(content: T): T {
  if (!content) return content;
  return replaceStrings(content, (v) => (v.startsWith("blob:") ? "" : v)) as T;
}

export interface MaterializeResult {
  content: any;
  uploaded: number;
  failed: number;
  error?: string;
}

/**
 * Upload tiap blob URL unik sekali, ganti dengan secure_url.
 * Kalau ada yang gagal, content dikembalikan apa adanya + error (caller
 * sebaiknya menahan save).
 */
export async function materializeContentMedia(content: any): Promise<MaterializeResult> {
  if (!content || typeof content !== "object") {
    return { content, uploaded: 0, failed: 0 };
  }

  const blobs = collectBlobUrls(content);
  if (blobs.length === 0) {
    return { content, uploaded: 0, failed: 0 };
  }

  const urlMap = new Map<string, string>();
  let uploaded = 0;
  let failed = 0;
  let firstError: string | undefined;

  // Upload paralel dengan batas ringan (max 3 concurrent).
  const concurrency = 3;
  const runOne = async (blobUrl: string) => {
    try {
      const res = await fetch(blobUrl);
      if (!res.ok) {
        throw new Error(`Fetch blob gagal: ${res.status}`);
      }
      const blob = await res.blob();
      const ext =
        blob.type === "image/png" ? "png" :
        blob.type === "image/webp" ? "webp" :
        blob.type === "image/jpeg" ? "jpg" : "png";
      const file = new File([blob], `content-image.${ext}`, { type: blob.type || "image/png" });
      const secureUrl = await uploadImageFile(file);
      urlMap.set(blobUrl, secureUrl);
      uploaded++;
    } catch (err: any) {
      failed++;
      console.warn("[materializeContentMedia] Gagal upload blob:", blobUrl, err?.message || err);
      // Jangan hentikan save — strip blob ini nanti di replaceStrings.
      if (!firstError) firstError = err?.message || "Gagal mengunggah gambar.";
    }
  };

  const queue = [...blobs];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const next = queue.shift();
      if (next) await runOne(next);
    }
  });
  await Promise.all(workers);

  if (failed > 0) {
    return { content, uploaded, failed, error: firstError || "Gagal mengunggah gambar." };
  }

  const newContent = replaceStrings(content, (v) => {
    if (v.startsWith("blob:")) return urlMap.get(v) ?? v;
    return v;
  });

  return { content: newContent, uploaded, failed: 0 };
}