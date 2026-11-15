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

function collectBlobUrlsWithPaths(node: any, path: string[] = [], out: Map<string, string[]> = new Map()): Map<string, string[]> {
  if (typeof node === "string") {
    if (node.startsWith("blob:")) {
      out.set(node, [...path]);
    }
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((n, i) => collectBlobUrlsWithPaths(n, [...path, String(i)], out));
    return out;
  }
  if (node && typeof node === "object") {
    Object.entries(node).forEach(([k, v]) => collectBlobUrlsWithPaths(v, [...path, k], out));
    return out;
  }
  return out;
}

function getValueByPath(obj: any, path: string[]): any {
  return path.reduce((acc, key) => acc?.[key], obj);
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
  return Array.from(collectBlobUrlsWithPaths(content).keys());
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
 * Kalau ada yang gagal, fallback ke originalContent (gambar AI asli) jika ada.
 * Return content yang sudah di-process (gagal di-strip/jadi original).
 */
export async function materializeContentMedia(content: any, originalContent?: any): Promise<MaterializeResult> {
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

  // Build fallback map from originalContent for any blob that failed/wasn't uploaded
  const fallbackMap = new Map<string, string>();
  if (originalContent && failed > 0) {
    const blobPaths = collectBlobUrlsWithPaths(content);
    blobPaths.forEach((path, blobUrl) => {
      if (!urlMap.has(blobUrl)) { // failed or not uploaded
        const originalVal = getValueByPath(originalContent, path);
        if (typeof originalVal === "string" && originalVal && !originalVal.startsWith("blob:")) {
          fallbackMap.set(blobUrl, originalVal);
        }
      }
    });
  }

  const newContent = replaceStrings(content, (v) => {
    if (v.startsWith("blob:")) {
      if (urlMap.has(v)) return urlMap.get(v)!;
      if (fallbackMap.has(v)) return fallbackMap.get(v)!;
      return ""; // strip if no fallback
    }
    return v;
  });

  return { content: newContent, uploaded, failed, error: failed > 0 ? firstError || "Beberapa gambar gagal di-upload" : undefined };
}