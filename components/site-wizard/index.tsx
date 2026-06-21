"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/client";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  MapPin,
  MessageCircle,
  Monitor,
  Phone,
  Pencil,
  Plus,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { useGenerateStream, type StreamSection } from "@/hooks/use-generate-stream";
import { buildFullContent } from "@/lib/build-full-content";
import { SiteWizardProps, Message, PreviewData, ChatStage, PreviewState, PreviewDevice } from "./types";
import { PENDING_KEY, INITIAL_MESSAGE, BUSINESS_TYPES, SUB_TYPES, LOADING_CHECKLIST } from "./constants";
import { selectTemplate, getTemplateComponent, formatText, capitalizeWords, normalizeWhatsapp, generateSubdomain, generateSlug, calculateProgress, getStageNumber } from "./helpers";
import { DevicePreviewFrame } from "./device-frame";
import { Wireframe } from "./wireframe";
import { ConfirmCard } from "./confirm-card";
import { LoadingCard } from "./loading-card";
import { LoadingModal } from "./loading-modal";

const INITIAL_MESSAGE_WORDS = INITIAL_MESSAGE.split(" ");

export { type SiteWizardProps };

export function SiteWizard({
  mode,
  token,
  activeTenantId,
  createTenant,
  onNeedAuth,
}: SiteWizardProps) {
  const router = useRouter();
  const { pushToast } = useToast();

  const [chatStage, setChatStage] = useState<ChatStage>("name");
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", sender: "ai", text: INITIAL_MESSAGE },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [initialWordCount, setInitialWordCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const subTypeRef = useRef<HTMLDivElement>(null);
  const isInitialTyping = chatStage === "name" && initialWordCount < INITIAL_MESSAGE_WORDS.length;

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessSubType, setBusinessSubType] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [confirmEditingField, setConfirmEditingField] = useState<string | null>(null);
  const [confirmDraftName, setConfirmDraftName] = useState("");
  const [confirmDraftWA, setConfirmDraftWA] = useState("");
  const [confirmDraftServiceArea, setConfirmDraftServiceArea] = useState("");

  const [previewState, setPreviewState] = useState<PreviewState>("wireframe");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [streamedSections, setStreamedSections] = useState<Record<string, any>>({});
  const [streamedDesignToken, setStreamedDesignToken] = useState<Record<string, any> | null>(null);
  const [streamedTemplateId, setStreamedTemplateId] = useState<string>("");
  const [arrivedSections, setArrivedSections] = useState<StreamSection[]>([]);
  const [regenCount, setRegenCount] = useState(0);
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);
  const [previewHistory, setPreviewHistory] = useState<PreviewData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileScreen, setMobileScreen] = useState<"chat" | "loading" | "preview">("chat");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [waDraft, setWaDraft] = useState("");
  const [areaDraft, setAreaDraft] = useState("");

  const streamedSectionsRef = useRef<Record<string, any>>({});
  const isMobileRef = useRef(false);
  const streamedTokenRef = useRef<Record<string, any> | null>(null);
  const historyIndexRef = useRef(historyIndex);
  const hasPromptedDetailsRef = useRef(false);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { historyIndexRef.current = historyIndex; }, [historyIndex]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setPreviewDevice("mobile");
    }
  }, []);

  useEffect(() => {
    if (previewDevice === "desktop") {
      previewScrollRef.current?.scrollTo({ top: 0, left: 0 });
    }
  }, [previewDevice, previewData?.template_id, streamedTemplateId, regenCount, historyIndex]);

  const typeMessage = (fullText: string, onComplete: () => void) => {
    let idx = 0;
    const typingId = 'typing';
    setIsAiTyping(true);
    const interval = setInterval(() => {
      idx++;
      const partial = fullText.slice(0, idx);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== typingId);
        return [...filtered, { id: typingId, sender: "ai", text: partial }];
      });
      if (idx >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== typingId);
          return [...filtered, { id: Date.now().toString(), sender: "ai", text: fullText }];
        });
        setIsAiTyping(false);
        onComplete();
      }
    }, 30);
  };

  const { startStream, cancelStream } = useGenerateStream({
    onDesignToken: (token) => {
      setStreamedDesignToken(token);
      streamedTokenRef.current = token;
    },
    onSection: (section, data) => {
      streamedSectionsRef.current = { ...streamedSectionsRef.current, [section]: data };
      setStreamedSections((prev) => ({ ...prev, [section]: data }));
      setArrivedSections((prev) => prev.includes(section) ? prev : [...prev, section]);
    },
    onDone: (templateId, _qualityScore) => {
      setStreamedTemplateId(templateId);
      const finalContent = streamedSectionsRef.current;
      const finalToken = streamedTokenRef.current ?? {};
      const mergedPreview: PreviewData = {
        content: Object.keys(finalContent).length > 0 ? finalContent : {},
        design_token: finalToken,
        template_id: templateId,
      };
      setPreviewHistory((prev) => {
        const base = prev.slice(0, historyIndexRef.current + 1);
        const next = [...base, mergedPreview].slice(-5);
        setHistoryIndex(next.length - 1);
        return next;
      });
      setPreviewData(mergedPreview);
      setPreviewState("result");
      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          businessName, businessType, businessSubType, description,
          whatsapp: whatsapp || "",
          service_area: serviceArea || "",
          templateId: mergedPreview.template_id,
          previewContent: mergedPreview.content,
          previewDesignToken: mergedPreview.design_token,
        })
      );
      if (isMobileRef.current) {
        setPreviewDevice("mobile");
        setMobileScreen("preview");
        return;
      }
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
        setPreviewDevice("mobile");
      }
      setMobilePreviewOpen(true);
      if (!hasPromptedDetailsRef.current) {
        hasPromptedDetailsRef.current = true;
        typeMessage(
          "Preview awal sudah siap. Supaya website lebih siap dipublish, lengkapi jangkauan bisnis dan nomor WhatsApp: jangkauan membantu AI menulis konten yang lebih relevan untuk area pelanggan, sedangkan WhatsApp membuat tombol kontak langsung bisa dipakai.\n\nJangkauan bisnis Anda? (atau Enter untuk lewati)",
          () => {
            setChatStage("service_area");
            window.setTimeout(() => inputRef.current?.focus(), 0);
          }
        );
      }
    },
    onError: (message) => {
      pushToast(message || "Terjadi kesalahan saat membuat preview.", "error");
      setPreviewState("wireframe");
    },
  });

  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, chatStage, previewState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setInitialWordCount((count) => {
        if (count >= INITIAL_MESSAGE_WORDS.length) {
          clearInterval(interval);
          return count;
        }
        return count + 1;
      });
    }, 130);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isInitialTyping && !isAiTyping && (chatStage === "name" || chatStage === "whatsapp" || chatStage === "service_area")) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isInitialTyping, isAiTyping, chatStage]);

  useEffect(() => {
    if (previewState === "loading") {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => prev < 5 ? prev + 1 : prev);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [previewState]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    isMobileRef.current = mq.matches;
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches;
      setIsMobile(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    return () => { cancelStream(); };
  }, [cancelStream]);

  const handleBack = () => {
    if (window.history.length > 1) { router.back(); return; }
    router.push("/");
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInitialTyping) return;
    if (!inputValue.trim() && chatStage !== "whatsapp" && chatStage !== "service_area") return;
    const val = inputValue.trim();
    setInputValue("");

    if (chatStage === "name") {
      const capitalized = capitalizeWords(val);
      setBusinessName(capitalized);
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: val }]);
      setTimeout(() => {
        typeMessage("Nama yang profesional dan mudah dipercaya. 👍 Sekarang, pilih jenis bisnis Anda:", () => {
          setMessages((prev) => [
            ...prev,
            { id: `widget-type-chips-${Date.now()}`, sender: "ai", text: "", widget: "type-chips" },
          ]);
          setChatStage("type");
        });
      }, 500);
    } else if (chatStage === "whatsapp") {
      const digits = val.replace(/\D/g, "");
      let normalizedWhatsapp = "";
      if (digits) {
        normalizedWhatsapp = normalizeWhatsapp(val);
        setWhatsapp(normalizedWhatsapp);
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: val }]);
      } else {
        setWhatsapp("");
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: "Lewati" }]);
      }
      if (previewState === "result") setHasUnsavedEdits(true);
      setTimeout(() => {
        setConfirmDraftName(businessName);
        setConfirmDraftWA(normalizedWhatsapp);
        setConfirmDraftServiceArea(serviceArea);
        setConfirmEditingField(null);
        typeMessage(previewState === "result"
          ? "Sip. Cek data tambahan ini, lalu terapkan agar preview diperbarui."
          : "Hampir selesai! Cek dulu data website-nya sebelum dibuat.", () => {
          setChatStage("confirm");
        });
      }, 400);
    } else if (chatStage === "service_area") {
      if (val.trim()) {
        setServiceArea(val.trim());
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: val }]);
      } else {
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: "Lewati" }]);
      }
      if (previewState === "result") setHasUnsavedEdits(true);
      setTimeout(() => {
        setConfirmDraftServiceArea(val.trim() || serviceArea);
        const serviceAreaReply = val.trim()
          ? `Oke, jangkauan bisnisnya ${val.trim()}. Saya pakai info ini supaya website terasa lebih relevan untuk calon pelanggan di area tersebut.\n\nNomor WhatsApp untuk tombol kontak? (atau Enter untuk lewati)`
          : "Oke, jangkauan bisnis bisa dilengkapi nanti di editor. Nomor WhatsApp tetap berguna agar tombol kontak di website langsung mengarah ke chat pelanggan.\n\nNomor WhatsApp untuk tombol kontak? (atau Enter untuk lewati)";
        typeMessage(serviceAreaReply, () => {
          setInputValue("");
          setChatStage("whatsapp");
          window.setTimeout(() => inputRef.current?.focus(), 0);
        });
      }, 400);
    }
  };

  const handleSelectType = (type: string) => {
    setBusinessType(type);
    setBusinessSubType("");
    setDescription("");
    setInputValue("");
    setTimeout(() => {
      subTypeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
  };

  const handleSelectSubType = (subType: string) => {
    setBusinessSubType(subType);
    setDescription("");
    setInputValue("");
    setChatStage("done");
    setConfirmDraftName(businessName);
    setConfirmDraftWA(whatsapp);
    setConfirmDraftServiceArea(serviceArea);
    setConfirmEditingField(null);
    setRegenCount(0);
    setHasUnsavedEdits(false);
    hasPromptedDetailsRef.current = false;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: subType },
    ]);
    void handleGenerate(businessName, businessType, { businessSubType: subType });
    if (isMobileRef.current) setMobileScreen("loading");
  };

  const handleGenerate = async (
    bName = businessName,
    bType = businessType,
    overrides: { businessSubType?: string; whatsapp?: string; serviceArea?: string } = {}
  ) => {
    const nextBusinessSubType = overrides.businessSubType ?? businessSubType;
    const nextWhatsapp = overrides.whatsapp ?? whatsapp;
    const nextServiceArea = overrides.serviceArea ?? serviceArea;

    setStreamedSections({});
    setStreamedDesignToken(null);
    setArrivedSections([]);
    setStreamedTemplateId("");
    streamedSectionsRef.current = {};
    streamedTokenRef.current = null;
    setPreviewState("loading");
    setLoadingStep(0);

    localStorage.setItem(PENDING_KEY, JSON.stringify({
      businessName: bName, businessType: bType, businessSubType: nextBusinessSubType,
      whatsapp: nextWhatsapp || "", service_area: nextServiceArea || "",
    }));

    await startStream({
      business_name: bName, business_type: bType, business_sub_type: nextBusinessSubType || undefined,
      whatsapp: nextWhatsapp || "", service_area: nextServiceArea || "",
    });
  };

  const handleGoToEditor = async () => {
    if (!token) {
      localStorage.setItem(PENDING_KEY, JSON.stringify({
        businessName, businessType, businessSubType, description, whatsapp,
        service_area: serviceArea || "",
        templateId: previewData?.template_id, previewContent: previewData?.content,
        previewDesignToken: previewData?.design_token,
      }));
      if (onNeedAuth) { onNeedAuth(); }
      else { router.push("/login?redirect=/create?action=save"); }
      return;
    }

    try {
      let tenantId = activeTenantId;
      if (!tenantId && mode === "public" && createTenant) {
        const slug = generateSlug(businessName);
        const created = await createTenant(businessName + " Workspace", slug);
        if (created?.id) tenantId = created.id;
        else throw new Error("Gagal membuat workspace.");
      }
      if (!tenantId) throw new Error("Workspace tidak ditemukan.");

      const subdomain = generateSubdomain(businessName);

      const createRes = await request<any>(
        "/sites",
        {
          method: "POST",
          headers: { "X-Tenant-ID": tenantId.toString() },
          body: JSON.stringify({
            name: businessName,
            template_id: previewData?.template_id || selectTemplate(businessSubType || businessType),
            subdomain,
          }),
        },
        token
      );
      if (createRes.status !== "success") throw new Error(createRes.message);
      const siteId = createRes.data.id;

      if (previewData) {
        const enrichedContent = buildFullContent(
          { content: previewData.content },
          businessName, businessSubType || businessType, description, whatsapp
        );
        await request(
          `/sites/${siteId}/content`,
          {
            method: "PUT",
            headers: { "X-Tenant-ID": tenantId.toString() },
            body: JSON.stringify({
              content: enrichedContent,
              design_token: previewData.design_token,
            }),
          },
          token
        );
      }

      localStorage.removeItem(PENDING_KEY);
      router.push(`/dashboard/sites/${siteId}`);
    } catch (err: any) {
      console.error(err);
      pushToast(err.message || "Terjadi kesalahan. Silakan coba lagi.", "error");
    }
  };

  // Derived values
  const shouldPromptDetails = previewState === "result" && (!serviceArea || !whatsapp);

  // History nav
  const TEMPLATE_NAMES: Record<string, string> = {
    "TEMPLATE_KULINER01": "Vista Prime 🍜",
    "TEMPLATE_JASA02": "Elevate One 💼",
    "TEMPLATE_PRODUK03": "Forge Flow 🛍️",
    "TEMPLATE_ELEGANT": "Noir Prestige 👑",
    "TEMPLATE_NATURAL": "Bumi Lestari 🌿",
    "TEMPLATE_COLORFUL": "Pop Riot 🎨",
    "TEMPLATE_MINIMALIST": "White Space ⚡",
    "TEMPLATE_DYNAMIC": "AI Design ✨",
  };
  const currentName = TEMPLATE_NAMES[previewData?.template_id ?? ""] || "Desain ini";

  // Template preview content
  let resultPreviewContent: React.ReactNode = null;
  if (previewState === "result") {
    const hasLiveData = Object.keys(streamedSections).length > 0;
    const hasPreviewData = !!previewData;
    if (hasLiveData || hasPreviewData) {
      const isStreamingLive = hasLiveData && (!streamedTemplateId || !hasPreviewData);
      const liveContent = isStreamingLive ? streamedSections : previewData!.content;
      const liveToken = isStreamingLive ? (streamedDesignToken ?? {}) : previewData!.design_token;
      const liveTemplateId = (isStreamingLive ? streamedTemplateId : previewData!.template_id) || selectTemplate(businessSubType || businessType);
      const TemplateComponent = getTemplateComponent(liveTemplateId);
      const displayData: PreviewData = { content: liveContent, design_token: liveToken, template_id: liveTemplateId };
      const templatePreview = (
        <TemplateComponent
          content={buildFullContent(displayData, businessName, businessType, description, whatsapp) as any}
          design_token={liveToken as any}
          isEditorMode={false}
          arrivedSections={isStreamingLive ? arrivedSections : undefined}
        />
      );
      resultPreviewContent = (
        <div className="h-full flex flex-col overflow-hidden">
          {previewDevice === "mobile" ? (
            <div className="flex-1 min-h-0 overflow-auto bg-[#0d0f14] p-4" key={`mobile-${liveTemplateId}-${regenCount}-${historyIndex}`}>
              <div className="relative mx-auto my-3 h-[720px] w-[360px] max-w-full flex-shrink-0 rounded-[38px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800">
                <div className="absolute left-1/2 top-3 z-50 h-3.5 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
                <div className="relative z-10 h-full w-full overflow-hidden rounded-[28px] bg-white">
                  <DevicePreviewFrame device="mobile">{templatePreview}</DevicePreviewFrame>
                </div>
                <div className="absolute bottom-2 left-1/2 z-50 h-1 w-24 -translate-x-1/2 rounded-full bg-slate-700" />
              </div>
            </div>
          ) : (
            <div ref={previewScrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#0d0f14] pb-8" key={`desktop-${liveTemplateId}-${regenCount}-${historyIndex}`}>
              <DevicePreviewFrame device="desktop">{templatePreview}</DevicePreviewFrame>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="relative flex w-screen h-[100dvh] overflow-hidden bg-[#0d0f14] md:h-screen">

      {/* ══ LEFT SIDEBAR: Chat Panel ══════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 z-20 flex h-full w-full shrink-0 flex-col overflow-hidden border-r bg-[#111318] shadow-xl transition-transform duration-300 ease-out md:relative md:inset-auto md:z-10 md:w-[380px] md:translate-x-0 ${
          isMobile
            ? mobileScreen === "chat" ? "translate-x-0" : "-translate-x-full"
            : mobilePreviewOpen ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="px-5 pt-4 pb-5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 1px 0 rgba(255,255,255,0.025)" }}>
          <div className="flex items-start gap-3 mb-4">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Kembali"
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-[18px] h-[18px] text-white" />
                  </div>
                  <span className="font-bold text-white text-[17px] leading-tight">Webjoz AI Assistant</span>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">BETA</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Langkah {getStageNumber(chatStage)} dari 5</span>
            <span className="text-[11px] font-bold text-[#7c3aed]">{calculateProgress(chatStage)}%</span>
          </div>
          <div className="h-[5px] bg-white/5 rounded-full overflow-hidden w-full">
            <div
              className="h-full bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] transition-all duration-700 rounded-full"
              style={{ width: `${calculateProgress(chatStage)}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 pb-28 md:pb-8 space-y-4">
          {messages.map((m) => {
            if (m.widget === "type-chips") {
              const isLocked = chatStage !== "type";
              const subTypes = businessType ? SUB_TYPES[businessType] : null;
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {BUSINESS_TYPES.map((t) => {
                      const isSelected = businessType === t.value;
                      return (
                        <button
                          key={t.value}
                          onClick={() => !isLocked && handleSelectType(t.value)}
                          disabled={isLocked}
                          className={`flex flex-col items-start gap-1 p-3 border rounded-xl text-left transition-all ${isSelected ? "border-[#7c3aed]/70" : isLocked ? "opacity-30 cursor-default" : "hover:border-[#7c3aed]/50 active:scale-[0.97] cursor-pointer"}`}
                          style={isSelected ? { background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.5)" } : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
                        >
                          <span className="text-lg">{t.emoji}</span>
                          <span className={`text-xs font-bold ${isSelected ? "text-[#a78bfa]" : "text-slate-200"}`}>{t.label}</span>
                          <span className="text-[10px] text-slate-500">{t.desc}</span>
                          {isSelected && !businessSubType && <span className="text-[9px] font-bold text-[#7c3aed] mt-0.5">✓ Dipilih — pilih jenis di bawah</span>}
                          {isSelected && businessSubType && <span className="text-[9px] font-bold text-emerald-400 mt-0.5">✓ {businessSubType}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {subTypes && !isLocked && (
                    <div ref={subTypeRef} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                      <p className="text-[10px] font-semibold text-slate-500 mb-2 px-0.5">Lebih spesifik:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {subTypes.map((st) => {
                          const isSubSelected = businessSubType === st.value;
                          return (
                            <button
                              key={st.value}
                              type="button"
                              onClick={() => !isLocked && handleSelectSubType(st.value)}
                              disabled={isLocked}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-95 ${isSubSelected ? "text-white border-emerald-500/60" : "text-slate-300 border-white/10 hover:border-violet-400/50 hover:text-white"}`}
                              style={isSubSelected ? { background: "rgba(16,185,129,0.2)" } : { background: "rgba(255,255,255,0.05)" }}
                            >
                              <span>{st.emoji}</span>
                              <span>{st.label}</span>
                              {isSubSelected && <span className="text-emerald-400 text-[10px]">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const messageText = m.id === "init" && chatStage === "name"
              ? INITIAL_MESSAGE_WORDS.slice(0, initialWordCount).join(" ")
              : m.text;

            return (
              <div key={m.id} className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                {m.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.sender === "user" ? "bg-[#7c3aed] text-white rounded-tr-sm" : "rounded-tl-sm text-slate-200"}`}
                  style={m.sender !== "user" ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" } : {}}
                >
                  {formatText(messageText, m.sender === "user")}
                  {m.id === "init" && isInitialTyping && (
                    <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse rounded-full bg-slate-300" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Confirm step */}
          {chatStage === "confirm" && (
            <ConfirmCard
              businessName={businessName}
              businessType={businessType}
              businessSubType={businessSubType}
              whatsapp={whatsapp}
              serviceArea={serviceArea}
              draftName={confirmDraftName}
              draftWA={confirmDraftWA}
              draftServiceArea={confirmDraftServiceArea}
              editingField={confirmEditingField}
              previewState={previewState}
              hasUnsavedEdits={hasUnsavedEdits}
              isLoading={previewState === "loading"}
              onSetDraftName={setConfirmDraftName}
              onSetDraftWA={setConfirmDraftWA}
              onSetDraftServiceArea={setConfirmDraftServiceArea}
              onSetEditingField={setConfirmEditingField}
              onSetBusinessType={setBusinessType}
              onSetBusinessSubType={setBusinessSubType}
              onSetBusinessName={setBusinessName}
              onSetWhatsapp={setWhatsapp}
              onSetServiceArea={setServiceArea}
              onSetHasUnsavedEdits={setHasUnsavedEdits}
              onSetDescription={setDescription}
              onGenerate={() => {
                const nextRegen = previewState === "result" ? regenCount + 1 : 0;
                setRegenCount(nextRegen);
                setHasUnsavedEdits(false);
                handleGenerate(businessName, businessType);
              }}
            />
          )}

          {/* Loading card (in chat) */}
          {previewState === "loading" && (
            <LoadingCard loadingStep={loadingStep} businessType={businessType} />
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        {chatStage !== "type" && chatStage !== "done" && chatStage !== "confirm" && (
          <div className="shrink-0 px-4 pb-12 pt-2 md:py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <form onSubmit={handleSendText} className="flex items-center rounded-2xl px-4 py-1 gap-2 transition-all" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <input
                ref={inputRef}
                type={chatStage === "whatsapp" ? "tel" : "text"}
                inputMode={chatStage === "whatsapp" ? "tel" : undefined}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={chatStage === "whatsapp" ? "cth. 08123456789 — atau Enter untuk lewati" : chatStage === "service_area" ? "cth. Jogja, Sleman-Bantul, Jabodetabek, seluruh Indonesia, online" : "Ketik nama bisnis Anda..."}
                autoFocus
                disabled={isInitialTyping || isAiTyping}
                className="flex-1 bg-transparent border-none py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isInitialTyping || isAiTyping || (chatStage === "name" && !inputValue.trim())}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#7c3aed] text-white transition-all disabled:opacity-30 hover:bg-[#6d28d9] shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        <div className="px-5 py-3 shrink-0 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Draft tersimpan otomatis
          </span>
          <span className="text-[11px] text-slate-500">
            {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
          </span>
        </div>
      </div>

      {/* ══ RIGHT: Browser Preview ════════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 z-30 flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#0d0f14] transition-transform duration-300 ease-out md:relative md:inset-auto md:z-0 md:translate-x-0 ${
          isMobile
            ? mobileScreen === "preview" ? "translate-x-0" : "translate-x-full"
            : mobilePreviewOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-12 flex items-center px-4 gap-3 shrink-0" style={{ background: "#111318", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            type="button"
            onClick={() => setMobilePreviewOpen(false)}
            aria-label="Kembali ke chat"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all active:scale-95 md:hidden"
          >
            <MessageCircle className="h-4 w-4" />
          </button>

          <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${previewDevice === "desktop" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="Preview desktop"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${previewDevice === "mobile" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="Preview mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-4 h-4 rounded-sm bg-emerald-500 shrink-0 flex items-center justify-center">
              <span className="text-[7px] text-white font-bold">W</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg px-3 py-1 flex-1 max-w-xs" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-500 ${businessName ? "bg-emerald-400" : "bg-slate-600"}`} />
              <span className="text-xs text-slate-400 truncate font-medium transition-all duration-300">
                {businessName ? `${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.webjoz.com` : "preview.webjoz.com"}
              </span>
              {previewState === "loading" && (
                <span className="ml-auto text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full shrink-0">Draft Preview</span>
              )}
              {previewState === "result" && (
                <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">Live Preview</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-white">
          {previewState === "wireframe" && (
            <Wireframe
              businessName={businessName}
              businessType={businessType}
              businessSubType={businessSubType}
              description={description}
              chatStage={chatStage}
            />
          )}

          {previewState === "loading" && (
            <div className="h-full relative flex flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden filter blur-[12px] opacity-20 select-none pointer-events-none" style={{ background: "#0d0f14" }}>
                <div className="h-full w-full" style={{ background: "linear-gradient(135deg, #1a1040 0%, #0d0f14 50%, #0a1628 100%)" }}>
                  <div className="absolute top-12 left-1/4 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)" }} />
                  <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)" }} />
                </div>
              </div>
              <LoadingModal loadingStep={loadingStep} businessType={businessType} />
            </div>
          )}

          {resultPreviewContent}

          {/* Desktop: single Edit & Publish button */}
          {previewState === "result" && (
            <button
              type="button"
              onClick={handleGoToEditor}
              className="hidden md:flex absolute bottom-6 right-6 z-40 items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_35px_rgba(91,33,182,0.35)] transition-all hover:scale-105 active:scale-95 hover:brightness-110 active:brightness-95"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              <Pencil className="h-4 w-4" />
              Edit & Publikasikan
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

        </div>
      </div>

      {/* ══ MOBILE LOADING SCREEN ══════════════════════════════════════════ */}
      {isMobile && mobileScreen === "loading" && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0d0f14]" style={{marginTop: "20px"}}>
          <div className="w-10 h-10 rounded-full border-[3px] border-[#1e293b] border-t-[#7c3aed] animate-spin mb-5" />
          <p className="text-sm font-semibold text-[#a78bfa] mb-6 text-center">AI sedang membuat website kamu...</p>
          <div className="flex flex-col gap-2.5 w-48">
            {LOADING_CHECKLIST.map((item, i) => {
              const isDone = i < loadingStep;
              const isCurrent = i === loadingStep;
              return (
                <div key={item.label} className={`flex items-center gap-2 text-xs ${isDone ? "text-emerald-400" : isCurrent ? "text-[#a78bfa]" : "text-slate-600"}`}>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#7c3aed] border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                  )}
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ MOBILE PREVIEW: action bar + sheet overlay ════════════════════ */}
      {isMobile && mobileScreen === "preview" && previewState === "result" && (
        <>
          {/* Bottom action bar */}
          <div className="absolute bottom-0 left-0 right-0 z-50 flex gap-2 px-4 pb-6 pt-3" style={{ background: "linear-gradient(transparent, #0d0f14 30%)" }}>
            <button
              type="button"
              onClick={() => { setWaDraft(whatsapp || ""); setAreaDraft(serviceArea || ""); setSheetOpen(true); }}
              className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-5 text-xs font-extrabold text-slate-200 transition-all active:scale-95 backdrop-blur-sm"
            >
              <Plus className="h-3.5 w-3.5 text-slate-400" />
              Lengkapi Data
            </button>
            <button
              type="button"
              onClick={handleGoToEditor}
              className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full px-5 text-xs font-extrabold text-white shadow-[0_14px_30px_rgba(91,33,182,0.32)] transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit & Publikasikan
            </button>
          </div>

          {/* Sheet overlay */}
          {sheetOpen && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60" onClick={() => setSheetOpen(false)}>
              <div className="rounded-t-2xl bg-[#111318] px-5 pb-8 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()} style={{boxShadow: "0 -8px 30px rgba(0,0,0,0.5)"}}>
                <div className="w-8 h-1 rounded-full bg-slate-700 mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-100 mb-1">Lengkapi data bisnis</p>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Dua data ini langsung dipakai AI untuk isi tombol kontak dan bikin copy yang lebih relevan.</p>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ${waDraft ? "bg-emerald-900/20 text-emerald-400 border-emerald-700/30" : "bg-amber-900/20 text-amber-400 border-amber-700/30"}`}>
                    <Phone className="w-3 h-3" />
                    {waDraft ? "WA tersimpan" : "WA belum diisi"}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ${areaDraft ? "bg-emerald-900/20 text-emerald-400 border-emerald-700/30" : "bg-amber-900/20 text-amber-400 border-amber-700/30"}`}>
                    <MapPin className="w-3 h-3" />
                    {areaDraft ? areaDraft : "Area belum diisi"}
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      value={waDraft}
                      onChange={(e) => setWaDraft(e.target.value)}
                      placeholder="cth. 081234567890"
                      className="w-full bg-[#1e293b] border border-slate-700/50 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500"
                    />
                    <p className="text-[10px] text-slate-600 mt-1">Langsung jadi tombol chat di hero & footer</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Jangkauan bisnis</label>
                    <input
                      type="text"
                      value={areaDraft}
                      onChange={(e) => setAreaDraft(e.target.value)}
                      placeholder="cth. Jogja, Jabodetabek, seluruh Indonesia"
                      className="w-full bg-[#1e293b] border border-slate-700/50 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500"
                    />
                    <p className="text-[10px] text-slate-600 mt-1">AI pakai ini untuk nulis copy yang lebih relevan</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    className="h-9 px-4 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 transition-all active:scale-95"
                  >
                    Nanti saja
                  </button>
                  <button
                    type="button"
                    disabled={waDraft === (whatsapp || "") && areaDraft === (serviceArea || "")}
                    onClick={() => {
                      setWhatsapp(waDraft ? normalizeWhatsapp(waDraft) : whatsapp);
                      setServiceArea(areaDraft || serviceArea);
                      setSheetOpen(false);
                      setHasUnsavedEdits(true);
                      setRegenCount((c) => c + 1);
                      setPreviewState("loading");
                      setMobileScreen("loading");
                      hasPromptedDetailsRef.current = false;
                      void handleGenerate(businessName, businessType, {
                        whatsapp: waDraft ? normalizeWhatsapp(waDraft) : whatsapp,
                        serviceArea: areaDraft || serviceArea,
                      });
                    }}
                    className="flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Re-generate
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
