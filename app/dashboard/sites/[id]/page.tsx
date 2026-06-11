"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Save, Loader2, Sparkles,
  HelpCircle, Plus,
  Monitor, Smartphone, User, Layout, Award, Globe, Mail, BookOpen, ChevronLeft, ChevronDown, Check
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import FileUpload from "@/components/file-upload";
import { getTemplate, TEMPLATE_REGISTRY } from "@/lib/template-registry";

const stripRegeneratedMarkers = (value: any): any => {
  if (typeof value === "string") {
    return value.replace(/\s*\(Regenerated\)/gi, "").replace(/\s{2,}/g, " ").trim();
  }
  if (Array.isArray(value)) {
    return value.map(stripRegeneratedMarkers);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, stripRegeneratedMarkers(item)])
    );
  }
  return value;
};

const EDITOR_SECTION_KEYS = ["header", "hero", "about", "benefits", "faq", "cta", "contact", "footer", "seo"];

function TemplateThumbnail({
  previewType,
  accent,
  active,
  compact,
}: {
  previewType: "brand" | "service" | "catalog" | "dynamic";
  accent: string;
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`relative ${compact ? "h-10" : "h-16"} w-full overflow-hidden rounded-md border ${active ? "border-white/70" : "border-white/10"} bg-slate-950`}>
      {previewType === "service" && (
        <>
          <div className="absolute inset-0 bg-slate-100" />
          <div className="absolute left-2 top-2 h-1.5 w-10 rounded-full" style={{ backgroundColor: accent }} />
          <div className="absolute left-2 top-5 h-2 w-20 rounded-full bg-slate-900" />
          <div className="absolute left-2 top-8 h-1.5 w-16 rounded-full bg-slate-400" />
          <div className="absolute bottom-2 left-2 h-3 w-12 rounded-sm" style={{ backgroundColor: accent }} />
          <div className="absolute bottom-2 right-2 grid w-12 grid-cols-2 gap-1">
            <div className="h-3 rounded-sm bg-slate-200" />
            <div className="h-3 rounded-sm bg-slate-200" />
          </div>
        </>
      )}
      {previewType === "catalog" && (
        <>
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute -left-4 top-0 h-full w-16 rotate-6" style={{ backgroundColor: accent }} />
          <div className="absolute right-2 top-3 h-2 w-16 rounded-full bg-white" />
          <div className="absolute right-2 top-7 h-1.5 w-12 rounded-full bg-slate-400" />
          <div className="absolute bottom-2 right-2 grid w-16 grid-cols-3 gap-1">
            <div className="h-4 rounded-sm bg-slate-800" />
            <div className="h-4 rounded-sm bg-slate-800" />
            <div className="h-4 rounded-sm bg-slate-800" />
          </div>
        </>
      )}
      {previewType === "brand" && (
        <>
          <div className="absolute inset-0 bg-[#FAF7F2]" />
          <div className="absolute inset-x-2 top-2 h-2 rounded-full bg-white" />
          <div className="absolute left-2 top-6 h-2 w-16 rounded-full" style={{ backgroundColor: accent }} />
          <div className="absolute left-2 top-10 h-1.5 w-20 rounded-full bg-amber-900/30" />
          <div className="absolute bottom-2 left-2 right-2 grid grid-cols-2 gap-1">
            <div className="h-4 rounded-sm bg-white" />
            <div className="h-4 rounded-sm bg-white" />
          </div>
        </>
      )}
      {previewType === "dynamic" && (
        <>
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}33, #7C3AED33, #0891B233)` }} />
          <div className="absolute inset-x-2 top-2 h-1.5 rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, #7C3AED)` }} />
          <div className="absolute left-2 top-5 h-2 w-14 rounded-full bg-white/30" />
          <div className="absolute left-2 top-8 h-1.5 w-10 rounded-full bg-white/20" />
          <div className="absolute bottom-2 right-2 flex gap-1">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <div className="h-3 w-3 rounded-full bg-cyan-500" />
          </div>
          <div className="absolute bottom-2 left-2 text-[6px] font-bold text-white/60 uppercase tracking-wider">AI</div>
        </>
      )}
    </div>
  );
}

export default function SiteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId } = useActiveTenant();

  const siteId = params.id ? Number(params.id) : null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templateSaving, setTemplateSaving] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("header");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const activeTabRef = useRef(activeTab);
  const shouldScrollToActiveRef = useRef(false);
  const templatePickerRef = useRef<HTMLDivElement | null>(null);

  // Site details & content
  const [siteDetails, setSiteDetails] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [designToken, setDesignToken] = useState<any>(null);

  // AI instructions state
  const [aiInstructions, setAiInstructions] = useState("");

  const fetchData = async () => {
    if (!token || !activeTenantId || !siteId) return;
    try {
      setLoading(true);
      // Fetch site details
      const siteRes = await request<any>(`/sites/${siteId}`, {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setSiteDetails(siteRes.data);

      // Fetch site content
      const contentRes = await request<any>(`/sites/${siteId}/content`, {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      
      // Fallback empty content scaffold if empty
      const data = stripRegeneratedMarkers(contentRes.data?.content || {});
      const fallback = {
        header: { brand_name: "", nav_cta_text: "", logo_url: "", icon: "" },
        hero: { headline: "", subheadline: "", cta_text: "", cta_url: "", image_url: "" },
        about: { title: "", body: "", image_url: "", icon: "" },
        benefits: { title: "", items: [] },
        faq: { title: "", items: [] },
        cta: { headline: "", button_text: "", button_url: "" },
        contact: { title: "", address: "", phone: "", email: "", show_lead_form: true },
        footer: { brand_name: "", tagline: "", copyright_text: "" },
        seo: { title: "", description: "", favicon_url: "", og_image_url: "" }
      };

      setContent({
        ...fallback,
        ...data,
        header: { ...fallback.header, ...data.header },
        hero: { ...fallback.hero, ...data.hero },
        about: { ...fallback.about, ...data.about },
        benefits: { ...fallback.benefits, ...data.benefits },
        faq: { ...fallback.faq, ...data.faq },
        cta: { ...fallback.cta, ...data.cta },
        contact: { ...fallback.contact, ...data.contact },
        footer: { ...fallback.footer, ...data.footer },
        seo: { ...fallback.seo, ...data.seo }
      });

      // Load design token if available
      if (contentRes.data?.design_token) {
        setDesignToken(contentRes.data.design_token);
      }

    } catch (err: any) {
      pushToast(err.message || "Gagal memuat situs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenantId && siteId) {
      fetchData();
    }
  }, [activeTenantId, siteId]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (!templatePickerOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!templatePickerRef.current?.contains(event.target as Node)) {
        setTemplatePickerOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [templatePickerOpen]);

  const selectSection = (section: string, scrollToPreview = true) => {
    shouldScrollToActiveRef.current = scrollToPreview;
    activeTabRef.current = section;
    setActiveTab(section);
  };

  // Scroll preview to active section
  useEffect(() => {
    if (!shouldScrollToActiveRef.current) return;
    shouldScrollToActiveRef.current = false;
    if (!activeTab) return;
    
    // Find the section element inside the preview
    const sectionEl = document.getElementById(`section-preview-${activeTab}`);
    const containerEl = document.getElementById("preview-scroll-container");
    
    if (sectionEl && containerEl) {
      requestAnimationFrame(() => {
        sectionEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [activeTab]);

  // Keep the sidebar section in sync while the user scrolls the preview.
  useEffect(() => {
    const containerEl = document.getElementById("preview-scroll-container");
    if (!containerEl) return;

    let frame = 0;
    const syncActiveSection = () => {
      frame = 0;
      const containerRect = containerEl.getBoundingClientRect();
      let nextSection = activeTabRef.current;
      let bestTop = Number.NEGATIVE_INFINITY;

      for (const section of EDITOR_SECTION_KEYS) {
        const sectionEl = document.getElementById(`section-preview-${section}`);
        if (!sectionEl) continue;
        const top = sectionEl.getBoundingClientRect().top - containerRect.top;
        if (top <= 140 && top > bestTop) {
          bestTop = top;
          nextSection = section;
        }
      }

      if (bestTop === Number.NEGATIVE_INFINITY) {
        let nearestDistance = Number.POSITIVE_INFINITY;
        for (const section of EDITOR_SECTION_KEYS) {
          const sectionEl = document.getElementById(`section-preview-${section}`);
          if (!sectionEl) continue;
          const distance = Math.abs(sectionEl.getBoundingClientRect().top - containerRect.top);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nextSection = section;
          }
        }
      }

      if (nextSection !== activeTabRef.current) {
        shouldScrollToActiveRef.current = false;
        activeTabRef.current = nextSection;
        setActiveTab(nextSection);
      }
    };

    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(syncActiveSection);
    };

    containerEl.addEventListener("scroll", handleScroll, { passive: true });
    syncActiveSection();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      containerEl.removeEventListener("scroll", handleScroll);
    };
  }, [content, device]);

  const handleSaveContent = async () => {
    if (!token || !activeTenantId || !siteId || !content) return;
    try {
      setSaving(true);
      await request(`/sites/${siteId}/content`, {
        method: "PUT",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ content, design_token: designToken ?? undefined })
      }, token);
      pushToast("Konten berhasil disimpan!", "success");
    } catch (err: any) {
      pushToast(err.message || "Gagal menyimpan konten", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    if (!token || !activeTenantId || !siteId || !siteDetails || templateId === siteDetails.template_id) return;

    const previousTemplateId = siteDetails.template_id;
    setTemplatePickerOpen(false);
    setTemplateSaving(true);
    setSiteDetails({ ...siteDetails, template_id: templateId });

    try {
      const res = await request<any>(`/sites/${siteId}`, {
        method: "PATCH",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          name: siteDetails.name,
          template_id: templateId,
          subdomain: siteDetails.subdomain,
        }),
      }, token);

      if (res.data) {
        setSiteDetails(res.data);
      }
      pushToast("Gaya tampilan berhasil diganti.", "success");
    } catch (err: any) {
      setSiteDetails({ ...siteDetails, template_id: previousTemplateId });
      pushToast(err.message || "Gagal mengganti gaya tampilan", "error");
    } finally {
      setTemplateSaving(false);
    }
  };

  const handleAiRegenerateForSection = async (section: string, customInstructions?: string) => {
    if (!token || !activeTenantId || !siteId || !content) return;
    
    let instructions = customInstructions || aiInstructions;
    if (!instructions.trim()) {
      const input = window.prompt(`Masukkan instruksi AI untuk regenerasi bagian "${section}" (cth: "buat kalimat lebih persuasif"):`);
      if (!input || !input.trim()) return;
      instructions = input;
    }

    try {
      setAiLoading(true);
      const res = await request<any>("/ai/regenerate-section", {
        method: "POST",
        body: JSON.stringify({
          site_id: siteId,
          section: section,
          instructions: instructions,
          tenant_id: activeTenantId,
        }),
      }, token);

      if (res.status === "success" && res.data) {
        setContent({
          ...content,
          [section]: stripRegeneratedMarkers(res.data)
        });
        pushToast(`Bagian ${section} berhasil diperbarui oleh AI!`, "success");
        setAiInstructions("");
      } else {
        throw new Error(res.message || "AI gagal memproses.");
      }
    } catch (err: any) {
      pushToast(err.message || "AI gagal meregenerasi bagian ini.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiRegenerateSection = () => handleAiRegenerateForSection(activeTab);

  // Helper updates for form fields
  const updateField = (section: string, key: string, val: any) => {
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [key]: val
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Memuat editor...</p>
      </div>
    );
  }

  if (!siteDetails || !content) {
    return (
      <Card className="max-w-md mx-auto p-6 text-center border-dashed">
        <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4 opacity-70" />
        <h2 className="text-lg font-bold mb-2">Situs Tidak Ditemukan</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Kami tidak dapat menemukan situs yang Anda cari pada workspace saat ini.
        </p>
        <Button onClick={() => router.push("/dashboard/sites")} className="rounded-xl">
          Kembali
        </Button>
      </Card>
    );
  }

  // Section definitions for sidebar
  const SECTIONS = [
    { key: "header", label: "Header", icon: Layout, num: 1 },
    { key: "hero", label: "Hero", icon: Layout, num: 2 },
    { key: "about", label: "Tentang", icon: User, num: 3 },
    { key: "benefits", label: "Keunggulan", icon: Award, num: 4 },
    { key: "faq", label: "FAQ", icon: HelpCircle, num: 5 },
    { key: "cta", label: "CTA", icon: Sparkles, num: 6 },
    { key: "contact", label: "Kontak", icon: Mail, num: 7 },
    { key: "footer", label: "Footer", icon: BookOpen, num: 8 },
    { key: "seo", label: "SEO", icon: Globe, num: 9 },
  ];
  const currentTemplate = getTemplate(siteDetails.template_id) ?? getTemplate("TEMPLATE_JASA02")!;
  const TemplateComponent = currentTemplate.component;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -mx-4 -mb-6 overflow-hidden bg-[#05070b] text-slate-100">
      {/* ── Main editor split ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ════ LEFT SIDEBAR ════ */}
        <div className="w-[260px] flex-shrink-0 border-r border-white/10 flex flex-col overflow-hidden bg-[#05070b]">

          {/* Site identity */}
          <div className="flex h-11 flex-shrink-0 items-center gap-2 border-b border-white/10 px-3">
            <button
              onClick={() => router.push("/dashboard/sites")}
              className="rounded-md p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-200"
              aria-label="Kembali ke daftar situs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[13px] font-bold tracking-tight text-slate-100">{siteDetails.name}</h1>
              <p className="truncate text-[10px] text-slate-500">{siteDetails.subdomain}.webjoz.com</p>
            </div>
          </div>

          {/* Visual style selector */}
          <div ref={templatePickerRef} className="flex-shrink-0 border-b border-white/10 p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Gaya Situs</p>
              {templateSaving && <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-300" />}
            </div>
            <button
              type="button"
              onClick={() => setTemplatePickerOpen((open) => !open)}
              disabled={templateSaving}
              className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-left transition hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-60"
              aria-haspopup="listbox"
              aria-expanded={templatePickerOpen}
            >
              <div className="w-12 flex-shrink-0">
                <TemplateThumbnail previewType={currentTemplate.previewType} accent={currentTemplate.accent} active compact />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold text-slate-100">{currentTemplate.name}</p>
                <p className="truncate text-[10px] text-slate-500">{currentTemplate.category}</p>
              </div>
              <ChevronDown className={`h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${templatePickerOpen ? "rotate-180" : ""}`} />
            </button>

            {templatePickerOpen && (
              <div className="mt-2 space-y-2" role="listbox" aria-label="Pilihan gaya website">
                {TEMPLATE_REGISTRY.map((template) => {
                  const active = template.id === siteDetails.template_id;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => void handleTemplateChange(template.id)}
                      disabled={templateSaving}
                      className={`group w-full rounded-xl border p-2 text-left transition ${
                        active
                          ? "border-violet-400 bg-violet-500/15"
                          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
                      }`}
                      role="option"
                      aria-selected={active}
                    >
                      <TemplateThumbnail previewType={template.previewType} accent={template.accent} active={active} />
                      <div className="mt-2 flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-bold text-slate-100">{template.name}</p>
                          <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500">{template.description}</p>
                        </div>
                        {active && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-violet-300" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar header */}
          <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <span className="text-[13px] font-medium text-slate-200">Sections</span>
          </div>

          {/* Section list */}
          <div className="max-h-[46%] flex-shrink-0 overflow-y-auto p-2 space-y-0.5">
            {SECTIONS.map(({ key, label, icon: Icon, num }) => (
              <button
                key={key}
                onClick={() => selectSection(key, true)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                  activeTab === key
                    ? "bg-white text-slate-900 font-semibold border border-slate-200 shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${activeTab === key ? "text-slate-900" : "text-slate-400"}`} />
                  <span className="text-[13px]">{label}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  activeTab === key ? "bg-slate-100 text-slate-800" : "bg-white/5 text-slate-400"
                }`}>{num}</span>
              </button>
            ))}
          </div>

          {/* ── Field Panel (scrollable) ── */}
          <div
            className="border-t border-white/10 flex flex-col overflow-hidden [&_input]:!border-white/10 [&_textarea]:!border-white/10 [&_select]:!border-white/10 [&_input]:!bg-[#05070b] [&_textarea]:!bg-[#05070b] [&_select]:!bg-[#05070b] [&_input]:!text-slate-100 [&_textarea]:!text-slate-100 [&_select]:!text-slate-100 [&_input::placeholder]:!text-slate-700 [&_textarea::placeholder]:!text-slate-700"
            style={{ minHeight: 0 }}
          >
            <div className="px-3.5 py-2 border-b border-white/10 flex-shrink-0">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">
                Edit — {SECTIONS.find(s => s.key === activeTab)?.label ?? activeTab}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">

              {/* HEADER FORM */}
              {activeTab === "header" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Nama Brand</label>
                    <input type="text" value={content.header?.brand_name || ""} onChange={(e) => updateField("header", "brand_name", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Teks Tombol Nav</label>
                    <input type="text" value={content.header?.nav_cta_text || ""} onChange={(e) => updateField("header", "nav_cta_text", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Logo URL</label>
                    <FileUpload label="" value={content.header?.logo_url || ""} onChange={(val) => updateField("header", "logo_url", val)} placeholder="https://..." maxWidth={400} maxHeight={400} quality={0.85} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Favicon</label>
                    <FileUpload label="" value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Nama Ikon</label>
                    <input type="text" value={content.header?.icon || ""} onChange={(e) => updateField("header", "icon", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" placeholder="cth. Utensils" />
                  </div>
                </div>
              )}

              {/* HERO FORM */}
              {activeTab === "hero" && (
                <div className="space-y-3">
                  <FileUpload label="Gambar Hero" value={content.hero.image_url || ""} onChange={(val) => updateField("hero", "image_url", val)} placeholder="https://..." maxWidth={1600} maxHeight={1200} quality={0.8} />
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Headline</label>
                    <input type="text" value={content.hero.headline} onChange={(e) => updateField("hero", "headline", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Subheadline</label>
                    <textarea rows={2} value={content.hero.subheadline} onChange={(e) => updateField("hero", "subheadline", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Teks Tombol CTA</label>
                    <input type="text" value={content.hero.cta_text} onChange={(e) => updateField("hero", "cta_text", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Link Tombol CTA</label>
                    <input type="text" value={content.hero.cta_url} onChange={(e) => updateField("hero", "cta_url", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                </div>
              )}

              {/* ABOUT FORM */}
              {activeTab === "about" && (
                <div className="space-y-3">
                  <FileUpload label="Gambar Tentang" value={content.about.image_url || ""} onChange={(val) => updateField("about", "image_url", val)} placeholder="https://..." maxWidth={1000} maxHeight={1000} quality={0.8} />
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Judul</label>
                    <input type="text" value={content.about.title} onChange={(e) => updateField("about", "title", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Deskripsi</label>
                    <textarea rows={3} value={content.about.body} onChange={(e) => updateField("about", "body", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none" />
                  </div>
                </div>
              )}

              {/* BENEFITS FORM */}
              {activeTab === "benefits" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Judul Section</label>
                    <input type="text" value={content.benefits.title} onChange={(e) => updateField("benefits", "title", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  {content.benefits.items?.map((item: any, idx: number) => (
                    <div key={idx} className="border border-white/10 p-2.5 rounded-lg space-y-2 bg-white/[0.03]">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">#{idx + 1}</span>
                        <button onClick={() => { const n = content.benefits.items.filter((_: any, i: number) => i !== idx); updateField("benefits", "items", n); }} className="text-red-400 text-[11px]">Hapus</button>
                      </div>
                      <input type="text" value={item.title} onChange={(e) => { const n = [...content.benefits.items]; n[idx].title = e.target.value; updateField("benefits", "items", n); }} placeholder="Judul" className="w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400" />
                      <textarea rows={2} value={item.description} onChange={(e) => { const n = [...content.benefits.items]; n[idx].description = e.target.value; updateField("benefits", "items", n); }} placeholder="Deskripsi" className="w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400 resize-none" />
                    </div>
                  ))}
                  <button onClick={() => { const n = [...(content.benefits.items || []), { title: "", description: "" }]; updateField("benefits", "items", n); }} className="w-full text-[12px] py-1.5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
              )}

              {/* FAQ FORM */}
              {activeTab === "faq" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Judul Section</label>
                    <input type="text" value={content.faq.title} onChange={(e) => updateField("faq", "title", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  {content.faq.items?.map((item: any, idx: number) => (
                    <div key={idx} className="border border-white/10 p-2.5 rounded-lg space-y-2 bg-white/[0.03]">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">FAQ #{idx + 1}</span>
                        <button onClick={() => { const n = content.faq.items.filter((_: any, i: number) => i !== idx); updateField("faq", "items", n); }} className="text-red-400 text-[11px]">Hapus</button>
                      </div>
                      <input type="text" value={item.question} onChange={(e) => { const n = [...content.faq.items]; n[idx].question = e.target.value; updateField("faq", "items", n); }} placeholder="Pertanyaan" className="w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400" />
                      <textarea rows={2} value={item.answer} onChange={(e) => { const n = [...content.faq.items]; n[idx].answer = e.target.value; updateField("faq", "items", n); }} placeholder="Jawaban" className="w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400 resize-none" />
                    </div>
                  ))}
                  <button onClick={() => { const n = [...(content.faq.items || []), { question: "", answer: "" }]; updateField("faq", "items", n); }} className="w-full text-[12px] py-1.5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Tambah FAQ
                  </button>
                </div>
              )}

              {/* CTA FORM */}
              {activeTab === "cta" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Headline CTA</label>
                    <input type="text" value={content.cta.headline} onChange={(e) => updateField("cta", "headline", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Teks Tombol</label>
                    <input type="text" value={content.cta.button_text} onChange={(e) => updateField("cta", "button_text", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Link Tombol</label>
                    <input type="text" value={content.cta.button_url} onChange={(e) => updateField("cta", "button_url", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                </div>
              )}

              {/* CONTACT FORM */}
              {activeTab === "contact" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Judul</label>
                    <input type="text" value={content.contact.title} onChange={(e) => updateField("contact", "title", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Alamat</label>
                    <input type="text" value={content.contact.address} onChange={(e) => updateField("contact", "address", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Nomor WhatsApp</label>
                    <input type="text" value={content.contact.phone} onChange={(e) => updateField("contact", "phone", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Email</label>
                    <input type="email" value={content.contact.email} onChange={(e) => updateField("contact", "email", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                    <span className="text-[12px] font-medium text-slate-200">Formulir Kontak</span>
                    <input type="checkbox" checked={content.contact.show_lead_form !== false} onChange={(e) => updateField("contact", "show_lead_form", e.target.checked)} className="w-4 h-4 accent-violet-600 cursor-pointer" />
                  </div>
                </div>
              )}

              {/* FOOTER FORM */}
              {activeTab === "footer" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Nama Brand</label>
                    <input type="text" value={content.footer?.brand_name || ""} onChange={(e) => updateField("footer", "brand_name", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Tagline</label>
                    <input type="text" value={content.footer?.tagline || ""} onChange={(e) => updateField("footer", "tagline", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Copyright</label>
                    <input type="text" value={content.footer?.copyright_text || ""} onChange={(e) => updateField("footer", "copyright_text", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                </div>
              )}

              {/* SEO FORM */}
              {activeTab === "seo" && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2.5 text-[12px] leading-relaxed text-cyan-100">
                    <p className="font-semibold text-cyan-50">SEO tidak tampil sebagai section di halaman publik.</p>
                    <p className="mt-1 text-cyan-100/80">
                      Data ini dipakai mesin pencari dan preview saat link dibagikan, seperti judul Google, deskripsi, favicon, dan gambar share.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Meta Title</label>
                    <input type="text" value={content.seo?.title || ""} onChange={(e) => updateField("seo", "title", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Meta Description</label>
                    <textarea rows={3} value={content.seo?.description || ""} onChange={(e) => updateField("seo", "description", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none" />
                  </div>
                  <FileUpload label="Favicon" value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
                  <FileUpload label="OG Image" value={content.seo?.og_image_url || ""} onChange={(val) => updateField("seo", "og_image_url", val)} placeholder="https://..." maxWidth={1200} maxHeight={630} quality={0.85} />
                </div>
              )}

            </div>

            {/* ── AI Prompt bar inside field panel ── */}
            <div className="border-t border-white/10 px-3.5 py-2.5 flex-shrink-0 bg-[#05070b] space-y-2">
              <input
                type="text"
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAiRegenerateSection(); }}
                placeholder="Instruksi AI untuk section ini..."
                className="w-full px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[12px] outline-none focus:border-violet-400 placeholder:text-slate-700"
              />
              <button
                onClick={handleAiRegenerateSection}
                disabled={aiLoading}
                className="w-full h-9 px-3 flex items-center justify-center gap-1.5 rounded-md bg-violet-50 text-violet-700 text-[12px] font-medium hover:bg-violet-100 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {aiLoading ? (
                  <Loader2 className="w-3.5 h-3.5 flex-shrink-0 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span className="truncate">{aiLoading ? "Memproses..." : "Regenerate dengan AI"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ════ RIGHT CANVAS ════ */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden min-w-0">

          {/* Canvas topbar */}
          <div className="flex h-9 flex-shrink-0 items-center gap-2 border-b border-white/10 bg-[#05070b] px-2.5">
            {/* Device switcher */}
            <button
              onClick={() => setDevice("desktop")}
              className={`flex h-6 w-7 items-center justify-center rounded-md border text-[12px] transition-colors ${
                device === "desktop" ? "bg-white text-slate-950 border-slate-200" : "border-white/10 hover:bg-white/5 text-slate-500"
              }`}
              aria-label="Preview desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`flex h-6 w-7 items-center justify-center rounded-md border text-[12px] transition-colors ${
                device === "mobile" ? "bg-white text-slate-950 border-slate-200" : "border-white/10 hover:bg-white/5 text-slate-500"
              }`}
              aria-label="Preview mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>

            {/* AI badge */}
            <span className="ml-1 flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-200">
              <Sparkles className="h-3 w-3" />
              AI aktif
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Save button */}
            <button
              onClick={handleSaveContent}
              disabled={saving}
              className="flex h-6 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-white transition-colors"
              style={{ background: "#1D9E75" }}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan Perubahan
            </button>
          </div>

          {/* Canvas body */}
          <div id="preview-scroll-container" className="flex-1 min-h-0 overflow-y-auto bg-slate-100 flex items-start justify-center p-2">
            <div
              className={`bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 w-full ${
                device === "mobile" ? "max-w-[375px]" : "max-w-[1228px]"
              }`}
            >
              <TemplateComponent
                content={content}
                design_token={designToken ?? null}
                isEditorMode={true}
                activeSection={activeTab}
                onSelectSection={(section: string) => selectSection(section, false)}
                onRegenSection={handleAiRegenerateForSection}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
