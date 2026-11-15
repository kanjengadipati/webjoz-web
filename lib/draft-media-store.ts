// FILE: lib/draft-media-store.ts
//
// Menyimpan gambar hasil edit inline (blob URL) ke IndexedDB sebelum user
// diarahkan ke login. Blob URL hidup hanya selama dokumen aktif; kalau
// disimpan mentah ke localStorage akan mati setelah redirect. IndexedDB bisa
// menyimpan Blob asli (tanpa inflasi base64) sehingga gambar tetap selamat
// sampai user kembali ke /create?action=save.
//
// Alur:
// 1. persistDraftMedia(content)  → blob URL diganti sentinel
//    `pending-media:<id>` dan blob-nya disimpan di IndexedDB.
// 2. materializeDraftMedia(content) → sentinel di-upload sekali ke Cloudinary,
//    hasil secure_url di-cache agar retry tidak meng-upload ulang.
// 3. clearAllDraftMedia() → bersihkan setelah situs berhasil disimpan.

/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadImageFile } from "@/components/file-upload";
import { getMediaOriginal } from "@/lib/media-originals";

const DB_NAME = "webjoz_draft_media";
const DB_VERSION = 1;
const STORE = "media";
export const PENDING_MEDIA_PREFIX = "pending-media:";

interface MediaRecord {
  id: string;
  blob?: Blob;
  url?: string;
  /** Nilai asli (gambar AI) sebelum diganti; fallback bila upload gagal. */
  original?: string;
}

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

function makeId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* ignore */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB tidak tersedia."));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Gagal membuka IndexedDB."));
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("Transaksi IndexedDB gagal."));
    tx.onabort = () => reject(tx.error || new Error("Transaksi IndexedDB dibatalkan."));
  });
}

async function putRecord(db: IDBDatabase, record: MediaRecord): Promise<void> {
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(record);
  await txDone(tx);
}

async function getRecord(db: IDBDatabase, id: string): Promise<MediaRecord | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as MediaRecord | undefined);
    req.onerror = () => reject(req.error || new Error("Gagal membaca IndexedDB."));
  });
}

async function deleteRecords(db: IDBDatabase, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  ids.forEach((id) => store.delete(id));
  await txDone(tx);
}

async function getAllKeys(db: IDBDatabase): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAllKeys();
    req.onsuccess = () => resolve((req.result as IDBValidKey[]).map(String));
    req.onerror = () => reject(req.error || new Error("Gagal membaca IndexedDB."));
  });
}

/** Bersihkan semua media draft (mis. setelah simpan sukses atau mulai draft baru). */
export async function clearAllDraftMedia(): Promise<void> {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    await txDone(tx);
    db.close();
  } catch {
    /* IndexedDB tidak tersedia / private mode — abaikan */
  }
}

export interface PersistDraftMediaResult {
  content: any;
  stored: number;
  skipped: number;
}

/**
 * Ganti setiap blob URL di `content` dengan sentinel `pending-media:<id>` dan
 * simpan blob-nya di IndexedDB. Kalau IndexedDB gagal, blob tersebut di-strip
 * (jadi "") supaya draft teks tetap bisa disimpan.
 */
export async function persistDraftMedia(content: any): Promise<PersistDraftMediaResult> {
  if (!content || typeof content !== "object") {
    return { content, stored: 0, skipped: 0 };
  }

  const blobs = new Set<string>();
  walkStrings(content, (v) => {
    if (v.startsWith("blob:")) blobs.add(v);
  });
  if (blobs.size === 0) return { content, stored: 0, skipped: 0 };

  // Tulis dulu, baru buang record lama (di bawah): bila penulisan gagal di
  // tengah, draft sebelumnya tidak ikut hilang.
  let db: IDBDatabase | null = null;
  try {
    db = await openDb();
  } catch {
    db = null;
  }

  const map = new Map<string, string>();
  let stored = 0;
  let skipped = 0;

  const newIds = new Set<string>();

  for (const blobUrl of blobs) {
    const original = getMediaOriginal(blobUrl);
    if (!db) {
      // Tanpa IndexedDB: kembali ke gambar asli, bukan kosong.
      map.set(blobUrl, original);
      skipped++;
      continue;
    }
    try {
      const res = await fetch(blobUrl);
      if (!res.ok) {
        throw new Error(`Fetch blob gagal: ${res.status}`);
      }
      const blob = await res.blob();
      const id = makeId();
      await putRecord(db, { id, blob, original });
      newIds.add(id);
      map.set(blobUrl, `${PENDING_MEDIA_PREFIX}${id}`);
      stored++;
    } catch {
      map.set(blobUrl, original);
      skipped++;
    }
  }

  // Buang record dari draft sebelumnya yang tidak terpakai lagi.
  if (db && newIds.size > 0) {
    try {
      const stale = (await getAllKeys(db)).filter((k) => !newIds.has(k));
      await deleteRecords(db, stale);
    } catch {
      /* best effort */
    }
  }

  db?.close();

  const next = replaceStrings(content, (v) => map.get(v) ?? v);
  return { content: next, stored, skipped };
}

export interface MaterializeDraftMediaResult {
  content: any;
  uploaded: number;
  failed: number;
}

/**
 * Upload sentinel `pending-media:<id>` ke Cloudinary (sekali per id) lalu ganti
 * dengan secure_url. URL hasil upload di-cache di IndexedDB agar percobaan
 * ulang (mis. API save gagal) tidak meng-upload gambar yang sama dua kali.
 * Sentinel yang blob/URL-nya tidak ditemukan akan di-strip menjadi "".
 */
export async function materializeDraftMedia(content: any): Promise<MaterializeDraftMediaResult> {
  if (!content || typeof content !== "object") {
    return { content, uploaded: 0, failed: 0 };
  }

  const ids = new Set<string>();
  walkStrings(content, (v) => {
    if (v.startsWith(PENDING_MEDIA_PREFIX)) ids.add(v.slice(PENDING_MEDIA_PREFIX.length));
  });
  if (ids.size === 0) return { content, uploaded: 0, failed: 0 };

  let db: IDBDatabase | null = null;
  try {
    db = await openDb();
  } catch {
    db = null;
  }

  const map = new Map<string, string>();
  let uploaded = 0;
  let failed = 0;

  for (const id of ids) {
    const sentinel = `${PENDING_MEDIA_PREFIX}${id}`;
    let original = "";
    if (!db) {
      map.set(sentinel, original);
      failed++;
      continue;
    }
    try {
      const record = await getRecord(db, id);
      if (!record) {
        map.set(sentinel, original);
        failed++;
        continue;
      }
      original = record.original ?? "";
      if (record.url) {
        map.set(sentinel, record.url);
        continue;
      }
      if (!record.blob) {
        map.set(sentinel, original);
        failed++;
        continue;
      }
      const blob = record.blob;
      const ext =
        blob.type === "image/png" ? "png" :
        blob.type === "image/webp" ? "webp" :
        blob.type === "image/jpeg" ? "jpg" : "png";
      const file = new File([blob], `draft-image.${ext}`, { type: blob.type || "image/png" });
      const secureUrl = await uploadImageFile(file);
      await putRecord(db, { id, blob, url: secureUrl, original });
      map.set(sentinel, secureUrl);
      uploaded++;
    } catch (err) {
      console.warn("[materializeDraftMedia] Gagal upload sentinel:", id, err);
      map.set(sentinel, original);
      failed++;
    }
  }

  db?.close();

  const next = replaceStrings(content, (v) => map.get(v) ?? v);
  return { content: next, uploaded, failed };
}

/** Hapus sisa sentinel `pending-media:` (fallback kalau materialize gagal). */
export function stripPendingMedia<T = any>(content: T): T {
  if (!content) return content;
  return replaceStrings(content, (v) =>
    v.startsWith(PENDING_MEDIA_PREFIX) || v.startsWith("blob:") ? "" : v
  ) as T;
}
