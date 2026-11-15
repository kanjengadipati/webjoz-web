// FILE: lib/deferred-image.ts
//
// Satu pintu untuk gambar "tunda upload" di wizard: validasi, kompres lokal,
// buat blob URL, catat nilai asli. Melempar Error berpesan ramah pengguna.

import { compressImage, validateImageFile } from "@/components/file-upload";
import { registerMediaOriginal, releaseMediaBlob } from "@/lib/media-originals";

export async function createDeferredImageUrl(
  file: File,
  maxSize: number,
  quality: number,
  previous?: unknown
): Promise<string> {
  const invalid = validateImageFile(file);
  if (invalid) throw new Error(invalid);

  const processed = await compressImage(file, maxSize, maxSize, quality);
  // compressImage mengembalikan file asli bila decode gagal (mis. HEIC di
  // browser non-Safari). Blob seperti itu tidak bisa ditampilkan.
  const type = (processed as Blob).type || "";
  if (/hei[cf]/i.test(type) || (processed === file && /\.hei[cf]$/i.test(file.name))) {
    throw new Error("Format HEIC belum didukung. Pakai JPG atau PNG.");
  }

  const url = URL.createObjectURL(processed as Blob);
  registerMediaOriginal(url, previous);
  releaseMediaBlob(previous);
  return url;
}
