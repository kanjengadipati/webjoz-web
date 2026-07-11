"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/toast-provider";
import { Loader2, Check, X, Copy, Star, ExternalLink } from "lucide-react";
import { SiteSubNav } from "@/components/site-sub-nav";

interface Submission {
  id: number;
  customer_name: string;
  customer_role: string;
  quote: string;
  rating: number;
  status: string;
  submitted_at: string;
}

export default function TestimonialModerationPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId } = useActiveTenant();
  const { pushToast } = useToast();

  const siteId = Number(id);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const shareLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/testimoni/${siteId}`;

  const fetchData = async (status = "") => {
    if (!token || !activeTenantId) return;
    try {
      const q = status ? `?status=${status}` : "";
      const res = await request<Submission[]>(`/sites/${siteId}/testimonial-submissions${q}`, { headers: tenantHeaders }, token);
      setSubmissions(res.data || []);
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat testimoni", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData("pending"); }, [siteId]);

  const handleApprove = async (subId: number) => {
    try {
      await request(`/sites/${siteId}/testimonial-submissions/${subId}/approve`, { method: "POST", headers: tenantHeaders }, token);
      pushToast("Testimoni disetujui", "success");
      fetchData("pending");
    } catch (err: any) {
      pushToast(err.message || "Gagal menyetujui", "error");
    }
  };

  const handleReject = async (subId: number) => {
    try {
      await request(`/sites/${siteId}/testimonial-submissions/${subId}/reject`, { method: "POST", headers: tenantHeaders }, token);
      pushToast("Testimoni ditolak", "success");
      fetchData("pending");
    } catch (err: any) {
      pushToast(err.message || "Gagal menolak", "error");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    pushToast("Link disalin", "success");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <SiteSubNav siteId={siteId} />
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

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">
            Menunggu Persetujuan ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {submissions.map(sub => (
            <div key={sub.id} className="border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm">{sub.customer_name}</span>
                  {sub.customer_role && (
                    <span className="text-xs text-muted-foreground ml-2">{sub.customer_role}</span>
                  )}
                </div>
                {sub.rating > 0 && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: sub.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                )}
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
            <div className="text-sm text-muted-foreground text-center py-6">
              Belum ada testimoni baru. Bagikan link di atas ke pelanggan Anda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
