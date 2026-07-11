"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { Sparkles, Star } from "lucide-react";

export default function PublicTestimoniPage() {
  const { siteId } = useParams();
  const { pushToast } = useToast();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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
        <CardHeader>
          <CardTitle className="text-lg font-bold text-center">Bagikan Pengalaman Anda</CardTitle>
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
          <Button onClick={handleSubmit} disabled={submitting || !name.trim() || !quote.trim()} className="w-full">
            {submitting ? "Mengirim..." : "Kirim Testimoni"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
