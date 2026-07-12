"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { useToast } from "@/components/toast-provider";
import { SiteSubNav } from "@/components/site-sub-nav";
import { SeoForm, generateFieldText, type SeoFormProps } from "@/components/seo-form";
import { AiPromptModal } from "@/components/menu-catalog-form";
import Link from "next/link";
import { Loader2, ChevronLeft, Save, Check, SearchIcon, Zap } from "lucide-react";
import { AI_SUGGESTIONS } from "../editor-utils";
import { useRouter } from "next/navigation";

export default function SeoManagerPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const { pushToast } = useToast();
  const router = useRouter();
  const isPremium = activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";

  const siteId = Number(id);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };

  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [savedAt, setSavedAt]       = useState<Date | null>(null);
  const [seoData, setSeoData]           = useState<any>({});
  const [subdomain, setSubdomain]       = useState<string>("");
  const [gscVerification, setGscVerification] = useState<string>("");
  const [aiLoadingField, setAiLoadingField] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen]   = useState(false);

  // Prompt modal state (same pattern as editor)
  const [promptModal, setPromptModal] = useState<{
    fieldKey: string;
    label: string;
    prompt: string;
    resolve: (val: string | null) => void;
  } | null>(null);

  const fullContentRef = useRef<any>(null);
  const seoRef         = useRef<any>({});
  const autosaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchContent = useCallback(async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      const res = await request<any>(`/sites/${siteId}/content`, { headers: tenantHeaders }, token);
      const content = res.data?.content ?? {};
      fullContentRef.current = content;
      setSeoData(content.seo ?? {});
      seoRef.current = content.seo ?? {};
      // GSC verification from tracking_codes
      const trackingCodes = (res.data as any)?.tracking_codes ?? {};
      setGscVerification(trackingCodes.gsc_verification ?? "");
      // Fetch site details for subdomain (for SERP preview)
      try {
        const siteRes = await request<any>(`/sites/${siteId}`, { headers: tenantHeaders }, token);
        const sd = siteRes.data?.subdomain ?? "";
        if (sd && !sd.startsWith("draft-")) setSubdomain(`${sd}.webjoz.com`);
      } catch { /* non-critical */ }
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat data SEO", "error");
    } finally {
      setLoading(false);
    }
  }, [token, activeTenantId, siteId]);

  useEffect(() => { fetchContent(); }, [fetchContent]);
  useEffect(() => { seoRef.current = seoData; }, [seoData]);

  // ── save ───────────────────────────────────────────────────────────────────
  const saveContent = useCallback(async (data: any) => {
    if (!token || !activeTenantId || !fullContentRef.current) return;
    try {
      setSaving(true);
      const updated = { ...fullContentRef.current, seo: data };
      await request(`/sites/${siteId}/content`, {
        method: "PUT",
        headers: tenantHeaders,
        body: JSON.stringify({ content: updated }),
      }, token);
      fullContentRef.current = updated;
      setSavedAt(new Date());
    } catch (err: any) {
      pushToast(err.message || "Gagal menyimpan SEO", "error");
    } finally {
      setSaving(false);
    }
  }, [token, activeTenantId, siteId]);

  const scheduleAutosave = useCallback((data: any) => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => { void saveContent(data); }, 2000);
  }, [saveContent]);

  const [fieldUndoStacks, setFieldUndoStacks] = useState<Record<string, string[]>>({});
  const lastFieldUndoPushRef = useRef<Record<string, { val: string; time: number }>>({});

  const pushFieldUndo = useCallback((section: string, key: string, currentVal: string) => {
    const fieldPath = `${section}.${key}`;
    const now = Date.now();
    const last = lastFieldUndoPushRef.current[fieldPath];

    if (!last || now - last.time > 1500) {
      setFieldUndoStacks(prev => {
        const stack = prev[fieldPath] || [];
        if (stack[0] === currentVal) return prev;
        return {
          ...prev,
          [fieldPath]: [currentVal, ...stack].slice(0, 3)
        };
      });
      lastFieldUndoPushRef.current[fieldPath] = { val: currentVal, time: now };
    }
  }, []);

  const undoField = useCallback((section: string, key: string) => {
    const fieldPath = `${section}.${key}`;
    const stack = fieldUndoStacks[fieldPath];
    if (!stack || stack.length === 0) return;

    const [prevVal, ...rest] = stack;
    setSeoData((prev: any) => {
      const next = { ...prev, [key]: prevVal };
      scheduleAutosave(next);
      return next;
    });
    setFieldUndoStacks(prev => ({
      ...prev,
      [fieldPath]: rest
    }));
  }, [fieldUndoStacks, scheduleAutosave]);

  const updateField = useCallback((section: string, key: string, val: any) => {
    setSeoData((prev: any) => {
      const currentVal = prev[key] || "";
      if (typeof val === "string" && val !== currentVal) {
        pushFieldUndo(section, key, currentVal);
      }
      const next = { ...prev, [key]: val };
      scheduleAutosave(next);
      return next;
    });
  }, [pushFieldUndo, scheduleAutosave]);

  // ── GSC save ───────────────────────────────────────────────────────────────
  const handleGscSave = useCallback(async (code: string) => {
    if (!token || !activeTenantId) return;
    // Fetch current tracking_codes first to avoid wiping GA4 / Meta Pixel
    let existingCodes: Record<string, string> = {};
    try {
      const res = await request<any>(`/sites/${siteId}/content`, { headers: tenantHeaders }, token);
      existingCodes = (res.data as any)?.tracking_codes ?? {};
    } catch { /* fall back to empty */ }
    await request(`/sites/${siteId}/tracking-codes`, {
      method: "PATCH",
      headers: tenantHeaders,
      body: JSON.stringify({ tracking_codes: { ...existingCodes, gsc_verification: code } }),
    }, token);
    setGscVerification(code);
    pushToast("Kode GSC berhasil disimpan", "success");
  }, [token, activeTenantId, siteId, pushToast]);

  // ── AI text handler (mirrors editor handleAiText) ──────────────────────────
  const handleAiText = useCallback(async (fieldKey: string, prompt: string, label: string) => {
    if (!token || !activeTenantId) return;

    const customPrompt = await new Promise<string | null>((resolve) => {
      setPromptModal({ fieldKey, label, prompt, resolve });
    });
    if (customPrompt === null) return;

    const loadKey = `seo.${fieldKey}`;
    setAiLoadingField(loadKey);
    try {
      const fullPrompt = customPrompt.trim()
        ? `${prompt} dengan instruksi khusus tambahan: "${customPrompt}"`
        : prompt;
      const result = await generateFieldText(
        String(token), activeTenantId, siteId, "seo", fieldKey,
        fullContentRef.current, fullPrompt,
      );
      if (result) {
        updateField("seo", fieldKey, result);
      }
    } catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") {
        setUpgradeOpen(true);
      } else {
        pushToast(err.message || "AI gagal menghasilkan teks", "error");
      }
    } finally {
      setAiLoadingField(null);
    }
  }, [token, activeTenantId, siteId, updateField, pushToast]);

  // ── loading state ──────────────────────────────────────────────────────────
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

      {/* Page header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/sites/${siteId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Web
          </Link>
          <SearchIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">SEO</h2>
        </div>

        {/* Save status + button */}
        <div className="flex items-center gap-2">
          {saving ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
            </span>
          ) : savedAt ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-500">
              <Check className="w-3.5 h-3.5" /> Tersimpan
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); void saveContent(seoRef.current); }}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Simpan
          </button>
        </div>
      </div>

      {/* SEO Form */}
      <SeoForm
        seo={seoData}
        updateField={updateField}
        isPremium={isPremium}
        onUpgradeRequired={() => setUpgradeOpen(true)}
        aiLoadingField={aiLoadingField}
        onAiText={handleAiText}
        subdomain={subdomain || undefined}
        gscVerification={gscVerification}
        onGscSave={handleGscSave}
        fieldUndoStacks={fieldUndoStacks}
        undoField={undoField}
      />

      {/* AI prompt modal — same style as editor */}
      {promptModal && (
        <AiPromptModal
          label={promptModal.label}
          suggestions={AI_SUGGESTIONS["seo"] ?? []}
          onConfirm={(instructions) => { promptModal.resolve(instructions); setPromptModal(null); }}
          onCancel={() => { promptModal.resolve(null); setPromptModal(null); }}
        />
      )}

      {/* Upgrade modal */}
      {upgradeOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setUpgradeOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111318] shadow-2xl p-6 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
            </div>
            <p className="text-[14px] font-semibold text-slate-100">Fitur AI — Plan Pro</p>
            <p className="text-[12px] text-slate-400">Generate konten SEO dengan AI tersedia tanpa batas di paket Pro.</p>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setUpgradeOpen(false)}
                className="flex-1 h-10 rounded-xl border border-white/10 text-slate-400 text-[13px] hover:bg-white/[0.04] transition-colors"
              >Nanti</button>
              <Link href="/dashboard/upgrade"
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
              ><Zap className="w-4 h-4" /> Upgrade ke Pro</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
