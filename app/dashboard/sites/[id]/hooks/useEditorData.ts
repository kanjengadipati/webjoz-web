import { useState, useRef, useEffect, useCallback } from "react";
import { request } from "@/lib/api/client";
import { stripRegeneratedMarkers, getAutoHiddenSections } from "../editor-utils";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";
type PushToast = (title: string, tone?: "success" | "error" | "info", options?: any) => void;

export interface EditorDataState {
  loading: boolean;
  saving: boolean;
  autosaveStatus: AutosaveStatus;
  siteDetails: any;
  content: any;
  designToken: any;
  latestAiDesignToken: any;
  designTokenScore: number;
  customTemplates: any[];
  customTemplatesTotal: number;
  loadingTemplates: boolean;
}

export interface EditorDataActions {
  fetchData: () => Promise<void>;
  handleSaveContent: () => Promise<void>;
  setSiteDetails: React.Dispatch<React.SetStateAction<any>>;
  setContent: React.Dispatch<React.SetStateAction<any>>;
  setDesignToken: React.Dispatch<React.SetStateAction<any>>;
  setLatestAiDesignToken: React.Dispatch<React.SetStateAction<any>>;
  setDesignTokenScore: React.Dispatch<React.SetStateAction<number>>;
  setCustomTemplates: React.Dispatch<React.SetStateAction<any[]>>;
  setCustomTemplatesTotal: React.Dispatch<React.SetStateAction<number>>;
  fetchCustomTemplates: (reset?: boolean) => Promise<void>;
  /** Mutable refs so AI/action hooks can read the latest value without stale closures */
  contentRef: React.MutableRefObject<any>;
  designTokenRef: React.MutableRefObject<any>;
  lastSavedRef: React.MutableRefObject<{ content: any; designToken: any; siteDetails: any } | null>;
  initialLoadedRef: React.MutableRefObject<boolean>;
}

export function useEditorData(
  token: string | null,
  activeTenantId: number | string | null | undefined,
  siteId: number | null,
  pushToast: PushToast,
): EditorDataState & EditorDataActions {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle");

  const [siteDetails, setSiteDetails] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [designToken, setDesignToken] = useState<any>(null);
  const [latestAiDesignToken, setLatestAiDesignToken] = useState<any>(null);
  const [designTokenScore, setDesignTokenScore] = useState(0);

  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [customTemplatesTotal, setCustomTemplatesTotal] = useState(0);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const contentRef = useRef<any>(null);
  const designTokenRef = useRef<any>(null);
  const lastSavedRef = useRef<{ content: any; designToken: any; siteDetails: any } | null>(null);
  const initialLoadedRef = useRef(false);
  const autosaveTimerRef = useRef<any>(null);

  // Keep refs in sync
  useEffect(() => { contentRef.current = content; }, [content]);
  useEffect(() => { designTokenRef.current = designToken; }, [designToken]);

  // ── fetch data ──────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!token || !activeTenantId || !siteId) return;
    initialLoadedRef.current = false;
    try {
      setLoading(true);

      const [siteRes, contentRes] = await Promise.all([
        request<any>(`/sites/${siteId}`, {
          headers: { "X-Tenant-ID": activeTenantId.toString() },
        }, token),
        request<any>(`/sites/${siteId}/content`, {
          headers: { "X-Tenant-ID": activeTenantId.toString() },
        }, token),
      ]);

      setSiteDetails(siteRes.data);

      const data = stripRegeneratedMarkers(contentRes.data?.content || {});
      const fetchedDesignToken = contentRes.data?.design_token || null;

      const defaultTileStyle = (() => {
        if (!fetchedDesignToken) return "default";
        const mood = (fetchedDesignToken.mood || "").toLowerCase();
        const bg = fetchedDesignToken.palette?.background || "";
        const isDark = bg.startsWith("#") && parseInt(bg.slice(1), 16) < 0x444444;
        if (isDark || mood.includes("dark") || mood.includes("premium") || mood.includes("bold")) return "dark";
        if (mood.includes("natural") || mood.includes("warm") || mood.includes("earthy") || mood.includes("fresh")) return "light";
        return "default";
      })();

      const siteName: string = siteRes.data?.name || "Bisnis Kami";

      const fallback = {
        header: { brand_name: "", nav_cta_text: "", logo_url: "", icon: "" },
        hero: {
          headline: "", subheadline: "", cta_text: "", cta_url: "", image_url: "",
          matra: "", eyebrow: "", badge_text: "", cta_secondary_text: "", opening_hours: "", launch_label: "",
        },
        about: { title: "", body: "", image_url: "", icon: "" },
        benefits: { title: "", items: [] },
        testimonials: { title: "", items: [] },
        // faq intentionally omitted — optional section
        cta: { headline: "", button_text: "", button_url: "" },
        contact: {
          title: "", address: "", phone: "", email: "",
          show_lead_form: true, show_map: true,
          map_tile_style: defaultTileStyle,
        },
        footer: { brand_name: "", tagline: "", copyright_text: "" },
        seo: { title: "", description: "", favicon_url: "", og_image_url: "" },
      };

      const finalContent = {
        ...fallback,
        ...data,
        header: { ...fallback.header, ...data.header },
        hero: { ...fallback.hero, ...data.hero, matra: data.hero?.matra ?? "" },
        about: {
          ...fallback.about,
          ...data.about,
          body:
            data.about?.body ||
            `${siteName} hadir untuk memberikan layanan terbaik bagi Anda. Kami berkomitmen menghadirkan pengalaman yang memuaskan dan terpercaya bagi setiap pelanggan.`,
        },
        benefits: {
          ...fallback.benefits,
          ...data.benefits,
          items:
            data.benefits?.items?.length > 0
              ? data.benefits.items
              : [
                  { title: "Layanan Terpercaya", description: `${siteName} mengutamakan kepuasan pelanggan dalam setiap langkah pelayanan.`, icon: "shield" },
                  { title: "Pengalaman Teruji", description: "Sudah melayani banyak pelanggan dengan hasil yang konsisten dan memuaskan.", icon: "star" },
                  { title: "Mudah Dihubungi", description: "Tim kami siap membantu Anda kapan saja melalui berbagai saluran komunikasi.", icon: "message-circle" },
                ],
        },
        ...(data.faq ? { faq: { title: "", items: [], ...data.faq } } : {}),
        cta: { ...fallback.cta, ...data.cta },
        contact: { ...fallback.contact, ...data.contact },
        footer: {
          ...fallback.footer,
          ...data.footer,
          tagline: data.footer?.tagline || `Layanan terbaik dari ${siteName} untuk Anda.`,
        },
        seo: { ...fallback.seo, ...data.seo },
        ...(data.testimonials ? { testimonials: data.testimonials } : {}),
        ...(data.menu ? { menu: data.menu } : {}),
        ...(data.catalog ? { catalog: data.catalog } : {}),
        ...(data.gallery ? { gallery: data.gallery } : {}),
      };

      setContent(finalContent);

      let resolvedDesignToken = fetchedDesignToken;
      if (fetchedDesignToken) {
        const existingHidden: string[] = fetchedDesignToken?.layout?.hidden_sections ?? [];
        const autoHide = getAutoHiddenSections(finalContent, existingHidden);
        if (autoHide.length > 0) {
          resolvedDesignToken = {
            ...fetchedDesignToken,
            layout: {
              ...(fetchedDesignToken.layout ?? {}),
              hidden_sections: [...existingHidden, ...autoHide],
            },
          };
        }
        setDesignToken(resolvedDesignToken);
        setLatestAiDesignToken(resolvedDesignToken);
      }

      setDesignTokenScore(contentRes.data?.design_token_score ?? (fetchedDesignToken ? 100 : 0));

      lastSavedRef.current = {
        content: finalContent,
        designToken: resolvedDesignToken,
        siteDetails: siteRes.data,
      };
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat situs", "error");
    } finally {
      setLoading(false);
    }
  }, [token, activeTenantId, siteId, pushToast]);

  // ── fetch custom templates (superadmin only) ────────────────────────────────
  const fetchCustomTemplates = useCallback(async (reset = false) => {
    if (!token || !activeTenantId || !siteId) return;
    const role = (() => {
      try { return JSON.parse(atob(token.split(".")[1]))?.role; } catch { }
    })();
    if (role !== "superadmin") return;

    try {
      setLoadingTemplates(true);
      const currentOffset = reset ? 0 : customTemplates.length;
      const res = await request<any>(
        `/ai/templates?limit=10&offset=${currentOffset}`,
        { headers: { "X-Tenant-ID": activeTenantId.toString() } },
        token,
      );
      if (res.status === "success" && res.data) {
        const items = res.data.items || [];
        setCustomTemplates((prev) => (reset ? items : [...prev, ...items]));
        setCustomTemplatesTotal(res.data.total || 0);
      }
    } catch (err) {
      console.warn("Failed to fetch template library:", err);
    } finally {
      setLoadingTemplates(false);
    }
  }, [token, activeTenantId, siteId, customTemplates.length]);

  // ── autosave ────────────────────────────────────────────────────────────────
  const performAutosave = useCallback(async (
    currentContent: any,
    currentDesignToken: any,
    currentSiteDetails: any,
  ) => {
    if (!token || !activeTenantId || !siteId || !currentContent || !currentSiteDetails) return;
    try {
      setAutosaveStatus("saving");
      const [patchRes] = await Promise.all([
        request<any>(`/sites/${siteId}`, {
          method: "PATCH",
          headers: { "X-Tenant-ID": activeTenantId.toString() },
          body: JSON.stringify({
            name: currentSiteDetails.name,
            template_id: currentSiteDetails.template_id,
            subdomain: currentSiteDetails.subdomain,
          }),
        }, token),
        request(`/sites/${siteId}/content`, {
          method: "PUT",
          headers: { "X-Tenant-ID": activeTenantId.toString() },
          body: JSON.stringify({ content: currentContent, design_token: currentDesignToken ?? undefined }),
        }, token),
      ]);

      const updatedSiteDetails = patchRes.data || currentSiteDetails;
      if (patchRes.data) setSiteDetails(patchRes.data);

      lastSavedRef.current = {
        content: currentContent,
        designToken: currentDesignToken,
        siteDetails: updatedSiteDetails,
      };
      setAutosaveStatus("saved");
    } catch (err: any) {
      console.error("Autosave error:", err);
      setAutosaveStatus("error");
    }
  }, [token, activeTenantId, siteId]);

  // Debounced autosave trigger
  useEffect(() => {
    if (loading || !content || !siteDetails) return;
    if (!initialLoadedRef.current) {
      initialLoadedRef.current = true;
      return;
    }

    const currentStr = JSON.stringify({ content, designToken, siteDetails });
    const lastSavedStr = JSON.stringify(lastSavedRef.current);
    if (currentStr === lastSavedStr) return;

    setAutosaveStatus("idle");
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      void performAutosave(content, designToken, siteDetails);
    }, 2000);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [content, designToken, siteDetails, loading, performAutosave]);

  // ── manual save ─────────────────────────────────────────────────────────────
  const handleSaveContent = useCallback(async () => {
    if (!token || !activeTenantId || !siteId || !content || !siteDetails) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    try {
      setSaving(true);
      setAutosaveStatus("saving");
      const [patchRes] = await Promise.all([
        request<any>(`/sites/${siteId}`, {
          method: "PATCH",
          headers: { "X-Tenant-ID": activeTenantId.toString() },
          body: JSON.stringify({
            name: siteDetails.name,
            template_id: siteDetails.template_id,
            subdomain: siteDetails.subdomain,
          }),
        }, token),
        request(`/sites/${siteId}/content`, {
          method: "PUT",
          headers: { "X-Tenant-ID": activeTenantId.toString() },
          body: JSON.stringify({ content, design_token: designToken ?? undefined }),
        }, token),
      ]);
      const updatedSiteDetails = patchRes.data || siteDetails;
      if (patchRes.data) setSiteDetails(patchRes.data);
      lastSavedRef.current = { content, designToken, siteDetails: updatedSiteDetails };
      setAutosaveStatus("saved");
      pushToast("Perubahan berhasil disimpan!", "success");
    } catch (err: any) {
      setAutosaveStatus("error");
      pushToast(err.message || "Gagal menyimpan perubahan", "error");
    } finally {
      setSaving(false);
    }
  }, [token, activeTenantId, siteId, content, designToken, siteDetails, pushToast]);

  return {
    // state
    loading,
    saving,
    autosaveStatus,
    siteDetails,
    content,
    designToken,
    latestAiDesignToken,
    designTokenScore,
    customTemplates,
    customTemplatesTotal,
    loadingTemplates,
    // actions / setters
    fetchData,
    handleSaveContent,
    setSiteDetails,
    setContent,
    setDesignToken,
    setLatestAiDesignToken,
    setDesignTokenScore,
    setCustomTemplates,
    setCustomTemplatesTotal,
    fetchCustomTemplates,
    // refs
    contentRef,
    designTokenRef,
    lastSavedRef,
    initialLoadedRef,
  };
}
