// FILE: lib/media-originals.ts
//
// Registry kecil: blob URL hasil edit inline -> nilai ASLI sebelum diganti
// (biasanya gambar dari AI). Dipakai sebagai fallback tunggal bila blob tidak
// bisa disimpan/diunggah (reload, IndexedDB kosong, upload gagal), supaya
// gambar kembali ke gambar AI, bukan kosong.
//
// Hanya di memori (hidup selama dokumen aktif). Untuk melewati redirect login,
// nilai asli ikut disimpan di record IndexedDB (lihat draft-media-store.ts).

const originals = new Map<string, string>();

/** Catat bahwa `blobUrl` menggantikan `previous`. Rantai blob->blob menyimpan nilai asli paling awal. */
export function registerMediaOriginal(blobUrl: string, previous: unknown): void {
  const prev = typeof previous === "string" ? previous : "";
  const root = prev.startsWith("blob:") ? originals.get(prev) ?? "" : prev;
  originals.set(blobUrl, root);
}

export function getMediaOriginal(blobUrl: string): string {
  return originals.get(blobUrl) ?? "";
}

/** Revoke blob lama yang sudah diganti, lepas catatannya. */
export function releaseMediaBlob(blobUrl: unknown): void {
  if (typeof blobUrl !== "string" || !blobUrl.startsWith("blob:")) return;
  try { URL.revokeObjectURL(blobUrl); } catch { /* ignore */ }
  originals.delete(blobUrl);
}
