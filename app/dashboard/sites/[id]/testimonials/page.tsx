"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import {
  Loader2, Check, X, Copy, Star, RefreshCw,
  MessageSquareQuote, Download, Plus,
} from "lucide-react";
import { SiteSubNav } from "@/components/site-sub-nav";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Submission {
  id: number;
  customer_name: string;
  customer_role: string;
  quote: string;
  rating: number;
  status: string;
  submitted_at: string;
}

interface GoogleReview {
  author_name: string;
  author_photo: string;
  rating: number;
  text: string;
  time: number;
  relative_time: string;
}

interface GoogleCache {
  reviews: GoogleReview[];
  cached_at: string;
  place_id: string;
  place_name: string;
  rating: number;
  total_ratings: number;
}

// ─── Star row helper ──────────────────────────────────────────────────────────
function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
      ))}
    </div>
  );
}

// ─── Google logo SVG ─────────────────────────────────────────────────────────
function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestimonialModerationPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId } = useActiveTenant();
  const { pushToast } = useToast();

  const siteId = Number(id);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };
  const shareLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/testimoni/${siteId}`;

  // ── Pending submissions ──────────────────────────────────────────────────
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    if (!token || !activeTenantId) return;
    try {
      const res = await request<Submission[]>(`/sites/${siteId}/testimonial-submissions?status=pending`, { headers: tenantHeaders }, token);
      setSubmissions(res.data || []);
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat testimoni", "error");
    } finally {
      setLoadingSubs(false);
    }
  }, [token, activeTenantId, siteId]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleApprove = async (subId: number) => {
    try {
      await request(`/sites/${siteId}/testimonial-submissions/${subId}/approve`, { method: "POST", headers: tenantHeaders }, token);
      pushToast("Testimoni disetujui", "success");
      fetchSubmissions();
    } catch (err: any) { pushToast(err.message || "Gagal menyetujui", "error"); }
  };

  const handleReject = async (subId: number) => {
    try {
      await request(`/sites/${siteId}/testimonial-submissions/${subId}/reject`, { method: "POST", headers: tenantHeaders }, token);
      pushToast("Testimoni ditolak", "success");
      fetchSubmissions();
    } catch (err: any) { pushToast(err.message || "Gagal menolak", "error"); }
  };

  // ── Google Reviews (Opsi B) ───────────────────────────────────────────────
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [googlePlaceId, setGooglePlaceId] = useState("");
  const [googleCache, setGoogleCache] = useState<GoogleCache | null>(null);
  const [fetchingGoogle, setFetchingGoogle] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [importedIndices, setImportedIndices] = useState<Set<number>>(new Set());

  // Load saved API key + Place ID + cached reviews from tracking_codes
  useEffect(() => {
    if (!token || !activeTenantId) return;
    (async () => {
      try {
        const res = await request<any>(`/sites/${siteId}/content`, { headers: tenantHeaders }, token);
        const tc = (res.data as any)?.tracking_codes ?? {};
        if (tc.google_places_api_key) setGoogleApiKey(tc.google_places_api_key);
        if (tc.google_place_id) setGooglePlaceId(tc.google_place_id);
        if (tc.google_reviews_cache) setGoogleCache(tc.google_reviews_cache);
      } catch { /* non-critical */ }
    })();
  }, [siteId, token, activeTenantId]);

  const handleFetchGoogle = async (force = false) => {
    if (!googleApiKey.trim() || !googlePlaceId.trim()) {
      pushToast("Masukkan API Key dan Place ID terlebih dahulu", "error");
      return;
    }
    setFetchingGoogle(true);
    try {
      const res = await request<GoogleCache>(`/sites/${siteId}/google-reviews/fetch`, {
        method: "POST",
        headers: tenantHeaders,
        body: JSON.stringify({ api_key: googleApiKey.trim(), place_id: googlePlaceId.trim(), force }),
      }, token);
      setGoogleCache(res.data || null);
      pushToast(`${res.data?.reviews?.length ?? 0} review berhasil dimuat`, "success");
    } catch (err: any) {
      pushToast(err.message || "Gagal mengambil review Google", "error");
    } finally {
      setFetchingGoogle(false);
    }
  };

  const handleImportGoogle = async (review: GoogleReview, idx: number) => {
    setImportingId(idx);
    try {
      await request(`/sites/${siteId}/testimonials/import-google`, {
        method: "POST",
        headers: tenantHeaders,
        body: JSON.stringify({
          name: review.author_name,
          role: "Google Review",
          quote: review.text,
          rating: review.rating,
          avatar_url: review.author_photo,
          source: "google",
        }),
      }, token);
      setImportedIndices(prev => new Set([...prev, idx]));
      pushToast("Review berhasil ditambahkan ke testimoni website", "success");
    } catch (err: any) {
      pushToast(err.message || "Gagal mengimport review", "error");
    } finally {
      setImportingId(null);
    }
  };

  // ── Manual Import (Opsi C) ────────────────────────────────────────────────
  const [manualOpen, setManualOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualRole, setManualRole] = useState("");
  const [manualQuote, setManualQuote] = useState("");
  const [manualRating, setManualRating] = useState(5);
  const [manualSaving, setManualSaving] = useState(false);

  const handleManualImport = async () => {
    if (!manualName.trim() || !manualQuote.trim()) {
      pushToast("Nama dan ulasan wajib diisi", "error");
      return;
    }
    setManualSaving(true);
    try {
      await request(`/sites/${siteId}/testimonials/import-google`, {
        method: "POST",
        headers: tenantHeaders,
        body: JSON.stringify({
          name: manualName.trim(),
          role: manualRole.trim() || "Pelanggan",
          quote: manualQuote.trim(),
          rating: manualRating,
          source: "manual",
        }),
      }, token);
      pushToast("Testimoni berhasil ditambahkan ke website", "success");
      setManualName(""); setManualRole(""); setManualQuote(""); setManualRating(5);
      setManualOpen(false);
    } catch (err: any) {
      pushToast(err.message || "Gagal menyimpan testimoni", "error");
    } finally {
      setManualSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    pushToast("Link disalin", "success");
  };

  if (loadingSubs && !submissions.length) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <SiteSubNav siteId={siteId} />

      {/* Share link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">Bagikan Link Testimoni</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Input readOnly value={shareLink} className="flex-1" />
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="w-4 h-4" /> Salin
          </Button>
        </CardContent>
      </Card>

      {/* Pending submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-primary" />
            Menunggu Persetujuan ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {submissions.map(sub => (
            <div key={sub.id} className="border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm">{sub.customer_name}</span>
                  {sub.customer_role && <span className="text-xs text-muted-foreground ml-2">{sub.customer_role}</span>}
                </div>
                {sub.rating > 0 && <StarRow rating={sub.rating} />}
              </div>
              <p className="text-sm text-muted-foreground italic">"{sub.quote}"</p>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={() => handleApprove(sub.id)}>
                  <Check className="w-4 h-4" /> Setujui
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleReject(sub.id)}>
                  <X className="w-4 h-4" /> Tolak
                </Button>
              </div>
            </div>
          ))}
          {submissions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Belum ada testimoni baru. Bagikan link di atas ke pelanggan Anda.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Opsi B: Google Reviews — Advanced ── */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {/* Collapsible header with advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 border-b border-white/10 hover:bg-white/[0.03] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <GoogleLogo />
            <div className="text-left">
              <p className="text-[13px] font-bold text-slate-100">Import dari Google Reviews</p>
              <p className="text-[11px] text-slate-500">Fitur lanjutan — butuh Google Cloud API Key</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {googleCache && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <StarRow rating={Math.round(googleCache.rating)} />
                <span className="font-semibold text-slate-300">{googleCache.rating.toFixed(1)}</span>
              </div>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-2 py-0.5 rounded">
              {showAdvanced ? "Sembunyikan" : "Tampilkan"}
            </span>
          </div>
        </button>

        {showAdvanced && (
        <div className="p-4 space-y-4">

          {/* 5-review limit notice */}
          <div className="rounded-lg bg-amber-500/8 border border-amber-500/20 px-3 py-2.5 text-[11px] text-amber-300/80 space-y-1">
            <p className="font-semibold text-amber-300">ℹ️ Batasan Google Places API</p>
            <p>API ini mengembalikan <strong>maksimal 5 review</strong> yang dipilih algoritma Google — bukan yang terbaru atau rating tertinggi, dan tidak bisa dikustomisasi. Import tidak otomatis update; harus fetch ulang dan import manual jika ada review baru.</p>
          </div>

          {/* Credentials */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Google Places API Key</label>
              <input
                type="password"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                Place ID
                <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" rel="noopener noreferrer" className="text-primary font-normal normal-case hover:underline text-[10px]">
                  Cari Place ID →
                </a>
              </label>
              <input
                type="text"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                placeholder="ChIJ..."
                className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
              />
            </div>
          </div>

          {/* How-to hint */}
          <div className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2 text-[11px] text-slate-500 space-y-1">
            <p><span className="text-slate-300 font-semibold">Setup API Key:</span> Google Cloud Console → APIs &amp; Services → aktifkan <em>Places API (New)</em> → buat API Key</p>
            <p><span className="text-slate-300 font-semibold">Cari Place ID:</span> Buka Google Maps → cari bisnis Anda → salin Place ID dari link atau pakai tool di atas</p>
          </div>

          <Button
            onClick={() => handleFetchGoogle(!!googleCache)}
            disabled={fetchingGoogle || !googleApiKey.trim() || !googlePlaceId.trim()}
            className="w-full"
          >
            {fetchingGoogle
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengambil review...</>
              : googleCache
                ? <><RefreshCw className="w-4 h-4" /> Refresh Review</>
                : <><Download className="w-4 h-4" /> Ambil Review dari Google</>
            }
          </Button>

          {/* Cached info */}
          {googleCache?.cached_at && (
            <p className="text-[10px] text-slate-600 text-center">
              Cache: {new Date(googleCache.cached_at).toLocaleString("id-ID")} — {googleCache.place_name}
            </p>
          )}

          {/* Reviews list */}
          {googleCache?.reviews && googleCache.reviews.length > 0 && (
            <div className="space-y-3">
              {googleCache.reviews.map((review, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.025] p-3 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {review.author_photo ? (
                        <img src={review.author_photo} alt={review.author_name} className="w-8 h-8 rounded-full shrink-0 object-cover border border-white/10" />
                      ) : (
                        <div className="w-8 h-8 rounded-full shrink-0 bg-primary/20 flex items-center justify-center text-[12px] font-bold text-primary">
                          {review.author_name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-slate-200 truncate">{review.author_name}</p>
                        <div className="flex items-center gap-1.5">
                          <StarRow rating={review.rating} />
                          {review.relative_time && <span className="text-[10px] text-slate-500">{review.relative_time}</span>}
                        </div>
                      </div>
                    </div>
                    {importedIndices.has(idx) ? (
                      <span className="shrink-0 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Ditambahkan
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleImportGoogle(review, idx)}
                        disabled={importingId === idx}
                        className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-[11px] font-semibold hover:bg-primary/25 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {importingId === idx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        Import
                      </button>
                    )}
                  </div>
                  <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-3">{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {googleCache?.reviews?.length === 0 && (
            <p className="text-[12px] text-slate-500 text-center py-2">
              Tidak ada review dengan teks dari Place ID ini.
            </p>
          )}
        </div>
        )}
      </div>

      {/* ── Opsi C: Manual Import ── */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <p className="text-[13px] font-bold text-slate-100">Tambah Testimoni Manual</p>
            <p className="text-[11px] text-slate-500">Salin ulasan dari Google atau platform lain</p>
          </div>
          <button
            type="button"
            onClick={() => setManualOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 text-[12px] font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah
          </button>
        </div>

        {manualOpen && (
          <div className="p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nama Reviewer <span className="text-red-400">*</span></label>
                <input type="text" value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="cth. Budi Santoso" className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role / Label</label>
                <input type="text" value={manualRole} onChange={(e) => setManualRole(e.target.value)} placeholder="cth. Pelanggan, Google Review" className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600" />
              </div>
            </div>

            {/* Star rating picker */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => setManualRating(n)} className="cursor-pointer p-0.5">
                    <Star className={`w-6 h-6 transition-colors ${n <= manualRating ? "fill-amber-400 text-amber-400" : "text-slate-600 hover:text-amber-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Teks Ulasan <span className="text-red-400">*</span></label>
              <textarea rows={3} value={manualQuote} onChange={(e) => setManualQuote(e.target.value)} placeholder="Salin teks ulasan dari Google Maps atau ketik langsung..." className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600 resize-y" />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleManualImport} disabled={manualSaving || !manualName.trim() || !manualQuote.trim()} className="flex-1">
                {manualSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan ke Website"}
              </Button>
              <Button variant="outline" onClick={() => setManualOpen(false)}>Batal</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
