// FILE: hooks/use-generate-stream.ts
// Hook ini menangani koneksi SSE ke /ai/public/generate-preview-stream
// dan memanggil callback setiap kali section baru datang.
//
// CARA PAKAI di site-wizard.tsx:
//   import { useGenerateStream } from "@/hooks/use-generate-stream";
//   const { startStream, cancelStream } = useGenerateStream({ onSection, onDesignToken, onDone, onError });

import { useRef, useCallback } from "react";
import { API_BASE_URL } from "@/lib/config";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StreamSection =
  | "hero" | "about" | "benefits" | "testimonials"
  | "faq" | "cta" | "contact" | "header" | "footer"
  | "seo" | "menu" | "catalog";

export interface StreamEvent {
  type: "design_token" | "section" | "done" | "error";
  section?: StreamSection;
  data?: Record<string, any>;
  template_id?: string;
  quality_score?: number;
  error?: string;
}

export interface GenerateStreamRequest {
  business_name: string;
  business_type: string;
  description?: string;
  template_id?: string;
  whatsapp?: string;
  location?: string;
  mood?: string;
  selling_points?: string[];
}

export interface UseGenerateStreamOptions {
  /** Dipanggil saat design token diterima (bisa dipanggil lebih dari sekali) */
  onDesignToken: (token: Record<string, any>) => void;
  /** Dipanggil setiap kali satu section konten diterima */
  onSection: (section: StreamSection, data: Record<string, any>) => void;
  /** Dipanggil saat semua section sudah dikirim */
  onDone: (templateId: string, qualityScore: number) => void;
  /** Dipanggil jika terjadi error */
  onError: (message: string) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGenerateStream(options: UseGenerateStreamOptions) {
  const { onDesignToken, onSection, onDone, onError } = options;

  // Simpan referensi ke reader aktif agar bisa di-cancel
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancelStream = useCallback(() => {
    try {
      readerRef.current?.cancel();
      abortRef.current?.abort();
    } catch {
      // ignore
    }
    readerRef.current = null;
    abortRef.current = null;
  }, []);

  const startStream = useCallback(
    async (req: GenerateStreamRequest) => {
      // Cancel stream sebelumnya jika masih berjalan
      cancelStream();

      const controller = new AbortController();
      abortRef.current = controller;

      let response: Response;
      try {
        response = await fetch(`${API_BASE_URL}/ai/public/generate-preview-stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req),
          signal: controller.signal,
          // Tidak pakai credentials: "include" karena ini public endpoint
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        onError(err?.message || "Gagal menghubungi server.");
        return;
      }

      if (!response.ok || !response.body) {
        // Fallback: coba parse JSON error
        try {
          const json = await response.json();
          onError(json?.message || `HTTP ${response.status}`);
        } catch {
          onError(`HTTP ${response.status}`);
        }
        return;
      }

      // Baca stream per-line
      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE: event dipisahkan oleh "\n\n"
          const parts = buffer.split("\n\n");
          // Bagian terakhir mungkin belum lengkap — simpan di buffer
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            // Format SSE: "data: {...json...}"
            const line = part.trim();
            if (!line.startsWith("data:")) continue;

            const jsonStr = line.slice("data:".length).trim();
            if (!jsonStr) continue;

            let event: StreamEvent;
            try {
              event = JSON.parse(jsonStr);
            } catch {
              continue;
            }

            switch (event.type) {
              case "design_token":
                if (event.data) onDesignToken(event.data);
                break;

              case "section":
                if (event.section && event.data) {
                  onSection(event.section, event.data);
                }
                break;

              case "done":
                onDone(event.template_id ?? "", event.quality_score ?? 0);
                break;

              case "error":
                onError(event.error ?? "Terjadi kesalahan saat generate.");
                break;
            }
          }
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        onError(err?.message || "Koneksi terputus.");
      } finally {
        readerRef.current = null;
      }
    },
    [cancelStream, onDesignToken, onSection, onDone, onError]
  );

  return { startStream, cancelStream };
}
