"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { Sparkles, Star, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function PublicTestimoniPage() {
  const { siteId } = useParams();
  const { pushToast } = useToast();

  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loadingBrand, setLoadingBrand] = useState(true);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Fetch site identity for branding
  useEffect(() => {
    if (!siteId) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/sites?site_id=${siteId}`);
        const json = await res.json();
        const content = json?.data?.content;
        setBrandName(content?.header?.brand_name || "");
        setLogoUrl(content?.header?.logo_url || "");
      } catch { /* non-critical — gracefully falls back to generic title */ }
      finally { setLoadingBrand(false); }
    })();
  }, [siteId]);

  const handleSubmit = async () => {
    if (!name.trim() || !quote.trim()) return;
    setSubmitting(true);
    try {
      await request(`/public/sites/${siteId}/testimonials`, {
        method: "POST",
        body: JSON.stringify({
          customer_name: name,
          customer_role: role,
          quote,
          rating,
          website: "", // honeypot — must stay empty
        }),
      });
      setDone(true);
    } catch (err: any) {
      pushToast(err.message || "Gagal mengirim testimoni", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12 space-y-3">
            <Sparkles className="w-12 h-12 text-primary mx-auto" />
            {brandName && (
              <p className="text-sm font-semibold text-primary">{brandName}</p>
            )}
            <h1 className="text-2xl font-bold">Terima Kasih!</h1>
            <p className="text-muted-foreground">Testimoni Anda akan ditinjau sebelum ditayangkan.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <Card className="max-w-md w-full">
        <CardHeader className="pb-3">
          {/* Business identity */}
          {loadingBrand ? (
            <div className="flex justify-center py-2">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 mb-2">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={brandName}
                  className="h-10 w-auto object-contain max-w-[140px]"
                />
              )}
              {brandName && (
                <p className="text-sm font-bold text-foreground">{brandName}</p>
              )}
            </div>
          )}
          <CardTitle className="text-lg font-bold text-center">
            Bagikan Pengalaman Anda
          </CardTitle>
          {brandName && (
            <p className="text-xs text-center text-muted-foreground mt-1">
              dengan {brandName}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nama Anda"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            placeholder="Pekerjaan (opsional)"
            value={role}
            onChange={e => setRole(e.target.value)}
          />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`p-1 transition-colors ${n <= rating ? "text-amber-400" : "text-muted-foreground/30"}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <textarea
            placeholder="Tulis testimoni Anda..."
            value={quote}
            onChange={e => setQuote(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-primary bg-background resize-none"
          />

          {/* Honeypot — visually hidden, must stay empty */}
          <input
            type="text"
            name="website"
            value=""
            onChange={() => {}}
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            style={{ display: "none" }}
          />

          <Button
            onClick={handleSubmit}
            disabled={submitting || !name.trim() || !quote.trim()}
            className="w-full"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Mengirim...</>
            ) : (
              "Kirim Testimoni"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
