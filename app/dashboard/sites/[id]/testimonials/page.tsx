"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { Loader2, Check, X, Copy, Star, MessageSquareQuote, Plus } from "lucide-react";
import { SiteSubNav } from "@/components/site-sub-nav";
import { useI18n } from "@/lib/i18n/context";

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestimonialModerationPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId } = useActiveTenant();
  const { pushToast } = useToast();
  const { t } = useI18n();

  const siteId = Number(id);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };
  const shareLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/testimoni/${siteId}`;

  // ── Pending submissions (Opsi A) ─────────────────────────────────────────
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    if (!token || !activeTenantId) return;
    try {
      const res = await request<Submission[]>(`/sites/${siteId}/testimonial-submissions?status=pending`, { headers: tenantHeaders }, token);
      setSubmissions(res.data || []);
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sitesTestimonials.loadFailed"), "error");
    } finally {
      setLoadingSubs(false);
    }
  }, [token, activeTenantId, siteId]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleApprove = async (subId: number) => {
    try {
      await request(`/sites/${siteId}/testimonial-submissions/${subId}/approve`, { method: "POST", headers: tenantHeaders }, token);
      pushToast(t("dashboard.sitesTestimonials.approved"), "success");
      fetchSubmissions();
    } catch (err: any) { pushToast(err.message || t("dashboard.sitesTestimonials.approveFailed"), "error"); }
  };

  const handleReject = async (subId: number) => {
    try {
      await request(`/sites/${siteId}/testimonial-submissions/${subId}/reject`, { method: "POST", headers: tenantHeaders }, token);
      pushToast(t("dashboard.sitesTestimonials.rejected"), "success");
      fetchSubmissions();
    } catch (err: any) { pushToast(err.message || t("dashboard.sitesTestimonials.rejectFailed"), "error"); }
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
      pushToast(t("dashboard.sitesTestimonials.validationRequired"), "error");
      return;
    }
    setManualSaving(true);
    try {
      await request(`/sites/${siteId}/testimonials/manual-add`, {
        method: "POST",
        headers: tenantHeaders,
        body: JSON.stringify({
          name: manualName.trim(),
          role: manualRole.trim() || "Pelanggan",
          quote: manualQuote.trim(),
          rating: manualRating,
        }),
      }, token);
      pushToast(t("dashboard.sitesTestimonials.added"), "success");
      setManualName(""); setManualRole(""); setManualQuote(""); setManualRating(5);
      setManualOpen(false);
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sitesTestimonials.addFailed"), "error");
    } finally {
      setManualSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    pushToast(t("dashboard.sitesTestimonials.linkCopied"), "success");
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

      {/* Share link (Opsi A) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">{t("dashboard.sitesTestimonials.shareTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Input readOnly value={shareLink} className="flex-1" />
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="w-4 h-4" /> {t("dashboard.sitesTestimonials.copy")}
          </Button>
        </CardContent>
      </Card>

      {/* Pending submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-primary" />
            {t("dashboard.sitesTestimonials.pendingTitle", undefined, { count: String(submissions.length) })}
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
                  <Check className="w-4 h-4" /> {t("dashboard.sitesTestimonials.approve")}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleReject(sub.id)}>
                  <X className="w-4 h-4" /> {t("dashboard.sitesTestimonials.reject")}
                </Button>
              </div>
            </div>
          ))}
          {submissions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t("dashboard.sitesTestimonials.emptyDesc")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Opsi C: Manual Import */}
      <div className="rounded-2xl border border-border bg-muted/30 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <p className="text-[13px] font-bold text-slate-100">{t("dashboard.sitesTestimonials.manualTitle")}</p>
            <p className="text-[11px] text-slate-500">{t("dashboard.sitesTestimonials.manualDesc")}</p>
          </div>
          <button
            type="button"
            onClick={() => setManualOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 text-[12px] font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesTestimonials.add")}
          </button>
        </div>

        {manualOpen && (
          <div className="p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("dashboard.sitesTestimonials.labelName")} <span className="text-red-400">*</span></label>
                <input type="text" value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="cth. Budi Santoso" className="w-full px-2.5 py-1.5 border border-border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("dashboard.sitesTestimonials.labelRole")}</label>
                <input type="text" value={manualRole} onChange={(e) => setManualRole(e.target.value)} placeholder="cth. Pelanggan Setia" className="w-full px-2.5 py-1.5 border border-border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("dashboard.sitesTestimonials.labelRating")}</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => setManualRating(n)} className="cursor-pointer p-0.5">
                    <Star className={`w-6 h-6 transition-colors ${n <= manualRating ? "fill-amber-400 text-amber-400" : "text-slate-600 hover:text-amber-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("dashboard.sitesTestimonials.labelQuote")} <span className="text-red-400">*</span></label>
              <textarea rows={3} value={manualQuote} onChange={(e) => setManualQuote(e.target.value)} placeholder="Tulis atau salin teks ulasan..." className="w-full px-2.5 py-1.5 border border-border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600 resize-y" />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleManualImport} disabled={manualSaving || !manualName.trim() || !manualQuote.trim()} className="flex-1">
                {manualSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("dashboard.sitesTestimonials.saving")}</> : t("dashboard.sitesTestimonials.saveToSite")}
              </Button>
              <Button variant="outline" onClick={() => setManualOpen(false)}>{t("dashboard.sitesTestimonials.cancel")}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
