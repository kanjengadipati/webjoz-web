/* eslint-disable react-hooks/refs */
"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/client";
import {
  ArrowRight,
  Bot,
  Building2,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Cpu,
  Crown,
  Leaf,
  Loader2,
  Mic,
  MessageCircle,
  Monitor,
  Palette,
  Pencil,
  Plus,
  RefreshCw,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Square,
  Tablet,
  Tag,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { SparkleIcon, SparkleGenAI } from "@/components/sparkle-icon";
import { AudioWaveform } from "./audio-waveform";
import { MicOnboardingHint } from "./mic-onboarding-hint";
import { AudioProcessingCard } from "./audio-processing-card";
import { useToast } from "@/components/toast-provider";
import { buildFullContent } from "@/lib/build-full-content";
import { SiteWizardProps, PreviewData } from "./types";
import { PENDING_KEY, BUSINESS_TYPES, SUB_TYPES, MOOD_OPTIONS, INITIAL_MESSAGE } from "./constants";
import { selectTemplate, formatText, generateSubdomain, generateSlug, getTemplatePool } from "./helpers";
import {
  loadWizardSnapshot,
  saveWizardSnapshot,
  clearWizardSnapshot,
  snapshotHasProgress,
  toResumePreview,
  WizardResumeSnapshot,
  savePendingUpgradeDraft,
} from "./wizard-persistence";
import { WizardUpgradeModal } from "./wizard-upgrade-modal";
import { useWizardChat } from "./use-wizard-chat";
import { useWizardPreview } from "./use-wizard-preview";
import { useWizardDevice } from "./use-wizard-device";
import { useWizardGenerate } from "./use-wizard-generate";
import { PreviewCanvas } from "./preview-canvas";
import { MobileActionBar } from "./mobile-action-bar";
import { BusinessDetailsSheet } from "./business-details-sheet";
import { LoadingModal } from "./loading-modal";
import { WizardErrorModal } from "./error-modal";
import { WizardSuccessToast } from "./success-toast";
import { useI18n } from "@/lib/i18n/context";

export { type SiteWizardProps };

// Skor kualitas minimal (dari SSE done event) sebelum hasil AI ditampilkan.
// Di bawah ini dan konten masih dari AI murni (bukan mock fallback) → auto-retry.
const QUALITY_GATE_THRESHOLD = 70;
const MAX_QUALITY_RETRIES = 1;

export function SiteWizard({
  mode,
  token,
  activeTenantId,
  createTenant,
  onNeedAuth,
  initialBusinessType,
  initialBusinessSubType,
  initialDesignToken,
}: SiteWizardProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const { t, isIndonesian } = useI18n();

  const chat = useWizardChat({ businessType: initialBusinessType, businessSubType: initialBusinessSubType });
  const preview = useWizardPreview();
  const device = useWizardDevice();

  // Design token dari galeri landing page — disimpan di ref agar tetap dipakai
  // pada semua generasi (dan tersedia di runGenerate yang closure-bound).
  const initialDesignTokenRef = React.useRef<Record<string, any> | null>(initialDesignToken ?? null);

  // Seed preview dengan design token pilihan pada mount, supaya wireframe
  // langsung menampilkan warna/brand yang dipilih sebelum generasi pertama.
  React.useEffect(() => {
    if (initialDesignToken) {
      preview.setStreamedDesignToken(initialDesignToken);
      preview.streamedTokenRef.current = initialDesignToken;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Client-only clock to avoid hydration mismatch with new Date()
  const [clock, setClock] = useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const isSavingRef = React.useRef(false);
  // Hitung auto-retry karena kualitas rendah (per generasi pengguna).
  const qualityRetryCountRef = React.useRef(0);
  // Resume/state persistence: offer to restore an in-progress session on mount.
  // Read localStorage in an effect (not a useState initializer) so SSR and the
  // first client render agree — otherwise the resume banner causes a hydration mismatch.
  const [resumeDraft, setResumeDraft] = useState<WizardResumeSnapshot | null>(null);
  React.useEffect(() => {
    const snap = loadWizardSnapshot();
    if (snap && snapshotHasProgress(snap)) {
      setResumeDraft(snap);
    } else if (snap) {
      clearWizardSnapshot();
    }
  }, []);
  // Ref to the preview container so confetti canvas can size itself correctly
  const previewContainerRef = React.useRef<HTMLDivElement | null>(null);

  const generate = useWizardGenerate({
    onDesignToken: (token) => {
      preview.setStreamedDesignToken(token);
      preview.streamedTokenRef.current = token;
      if (token.template_id) {
        preview.setStreamedTemplateId(token.template_id);
      }
    },
    onSection: (section, data, sectionSource) => {
      preview.streamedSectionsRef.current = { ...preview.streamedSectionsRef.current, [section]: data };
      preview.setStreamedSections((prev) => ({ ...prev, [section]: data }));
      if (sectionSource) {
        preview.setSectionSources((prev) => ({ ...prev, [section]: String(sectionSource) }));
      }
      preview.setArrivedSections((prev) => prev.includes(section) ? prev : [...prev, section]);
      preview.advanceLoadingStepFromSection(section);
    },
    onDone: (templateId, qualityScore, generationSource, _qualityIssues) => {
      // Quality gate (lapisan terakhir): backend sudah meng-gate per-grup dan
      // menandai konten sebagai mock_fallback saat ada grup yang jatuh ke mock.
      // Kalau konten masih AI murni tapi skornya rendah, auto-retry sekali —
      // tanpa ini, hasil jelek (mis. score 44) tetap ditampilkan.
      // Gunakan refs (bukan state) untuk menjaga closure protection yang konsisten
      // dengan seluruh file ini (L243: refs dipakai untuk mencegah stale closure).
      if (
        generationSource !== 2 &&
        qualityScore < QUALITY_GATE_THRESHOLD &&
        qualityRetryCountRef.current < MAX_QUALITY_RETRIES
      ) {
        qualityRetryCountRef.current += 1;
        console.info(`[quality_gate] client auto-retry #${qualityRetryCountRef.current} score=${qualityScore}`);
        void runGenerate(
          chat.businessNameRef.current,
          chat.businessTypeRef.current,
          { mood: chat.moodRef.current, businessSubType: chat.businessSubTypeRef.current }
        );
        return;
      }
      const mood = (preview.streamedTokenRef.current as any)?.mood ?? "";
      const pool = getTemplatePool(chat.businessType, mood);
      preview.setTemplatePool(pool);
      preview.setTemplatePoolIndex(0);

      const finalContent = preview.streamedSectionsRef.current;
      const finalToken = preview.streamedTokenRef.current ?? {};

      const basePreview: PreviewData = {
        content: Object.keys(finalContent).length > 0 ? finalContent : {},
        design_token: finalToken,
        template_id: templateId,
      };

      const enrichedContent = buildFullContent(
        basePreview,
        chat.businessNameRef.current,
        chat.businessSubTypeRef.current || chat.businessTypeRef.current,
        chat.descriptionRef.current,
        chat.whatsappRef.current || ""
      );

      const mergedPreview: PreviewData = {
        content: enrichedContent,
        design_token: finalToken,
        template_id: templateId,
      };

      preview.setPreviewHistory((prev) => {
        const base = prev.slice(0, preview.historyIndexRef.current + 1);
        const next = [...base, mergedPreview].slice(-5);
        preview.setHistoryIndex(next.length - 1);
        return next;
      });
      preview.setPreviewData(mergedPreview);

      // streamDoneRef is still set for the fast-path pacing check in the interval.
      preview.streamDoneRef.current = true;
      preview.setStreamDone(true);
      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          businessName: chat.businessNameRef.current,
          businessType: chat.businessTypeRef.current,
          businessSubType: chat.businessSubTypeRef.current,
          description: chat.descriptionRef.current,
          whatsapp: chat.whatsappRef.current || "",
          service_area: chat.serviceAreaRef.current || "",
          templateId: mergedPreview.template_id,
          previewContent: mergedPreview.content,
          previewDesignToken: mergedPreview.design_token,
        })
      );
      if (device.isMobileRef.current) {
        device.setPreviewDevice("mobile");
        if (generate.didGenerateRef.current) {
          device.setMobileScreen("preview");
        }
        return;
      }
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
        device.setPreviewDevice("mobile");
      }
      device.setMobilePreviewOpen(true);
    },
    onError: (message) => {
      const lower = (message || "").toLowerCase();
      if (lower.includes("too many") || lower.includes("429") || lower.includes("rate limit")) {
        generate.setTooManyRequests(true);
      } else {
        generate.setGenerationError(message || "Terjadi kesalahan saat membuat preview.");
      }
      preview.setPreviewState("wireframe");
      device.setMobileScreen("chat");
    },
  });

  // Cleanup on unmount — use cancelStream (stable via useCallback) not the
  // whole `generate` object which changes every render and would cancel the
  // stream mid-flight on every re-render.
  const cancelStreamRef = React.useRef(generate.cancelStream);
  cancelStreamRef.current = generate.cancelStream;
  React.useEffect(() => {
    return () => { cancelStreamRef.current(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset success modal whenever a new generation begins
  React.useEffect(() => {
    if (preview.previewState === "loading") {
      setSuccessModalOpen(false);
    }
  }, [preview.previewState]);

  // Show success notification & modal only after blur has fully cleared and scroll is done
  React.useEffect(() => {
    if (preview.resultClear && preview.previewState === "result") {
      chat.setMessages((prev) => {
        const hasDoneMsg = prev.some((m) => m.id.startsWith("ai-done-"));
        if (hasDoneMsg) return prev;
        return [
          ...prev,
          {
            id: `ai-done-${Date.now()}`,
            sender: "ai",
            text: t(
              "dashboard.wizard.websiteReady",
              "🎉 Website Anda telah selesai dibuat! Silakan lihat pratinjau website Anda di samping atau klik tombol di bawah untuk lanjut."
            ),
          },
        ];
      });

      // Small extra delay so the user has a moment to see the preview before the modal pops
      const timeoutId = setTimeout(() => setSuccessModalOpen(true), 400);
      return () => clearTimeout(timeoutId);
    }
  }, [preview.resultClear, preview.previewState]);

  const writtenCharCount = useMemo(() => {
    return JSON.stringify(preview.streamedSections).length;
  }, [preview.streamedSections]);

  const sectionSnippet = useMemo(() => {
    const s = preview.streamedSections;
    const hero = s.hero as Record<string, any> | undefined;
    if (hero?.headline) return hero.headline as string;
    if (hero?.subheadline) return hero.subheadline as string;
    const about = s.about as Record<string, any> | undefined;
    if (about?.title) return about.title as string;
    const cta = s.cta as Record<string, any> | undefined;
    if (cta?.headline) return cta.headline as string;
    return "";
  }, [preview.streamedSections]);

  const handleBack = () => {
    if (window.history.length > 1) { router.back(); return; }
    router.push("/");
  };

  const handleCancelGenerationError = () => {
    generate.handleCancelGenerationError();
    preview.setPreviewState("wireframe");
    device.setMobileScreen("chat");
  };

  const handleRetryGeneration = () => {
    device.setMobileScreen("loading");
    generate.handleRetryGeneration(handleGenerate);
  };

  // runGenerate menjalankan stream tanpa mereset qualityRetryCountRef — dipakai
  // oleh auto-retry kualitas. Setiap parameter default sekarang membaca dari ref
  // (chat.xxxRef.current) sebagai pengaman closure protection yang konsisten seluruh
  // file ini (L243), bukan dari state plain agar tidak terjebak nilai lama saat
  // onDone auto-retry menjalankan fungsi dengan argumen ref.
  const runGenerate = async (
    bName = chat.businessNameRef.current,
    bType = chat.businessTypeRef.current,
    overrides: { businessSubType?: string; whatsapp?: string; serviceArea?: string; description?: string; mood?: string; language?: string } = {}
  ) => {
    const nextBusinessSubType = overrides.businessSubType ?? chat.businessSubTypeRef.current;
    const nextWhatsapp = overrides.whatsapp ?? chat.whatsappRef.current;
    const nextServiceArea = overrides.serviceArea ?? chat.serviceAreaRef.current;
    const nextDescription = overrides.description ?? chat.descriptionRef.current;
    const nextMood = overrides.mood ?? chat.moodRef.current;
    const nextLanguage = overrides.language ?? chat.siteLanguageRef.current ?? chat.siteLanguage ?? "id";

    preview.setStreamedSections({});
    preview.setSectionSources({});
    preview.setStreamedDesignToken(null);
    preview.setArrivedSections([]);
    preview.setStreamedTemplateId("");
    preview.streamedSectionsRef.current = {};
    preview.streamedTokenRef.current = null;
    preview.streamDoneRef.current = false;
    preview.setPreviewState("loading");
    preview.setLoadingStep(0);
    generate.didGenerateRef.current = true;
    device.setMobileScreen("loading");

    chat.syncChatRefs({
      businessName: bName,
      businessType: bType,
      businessSubType: nextBusinessSubType,
      whatsapp: nextWhatsapp,
      serviceArea: nextServiceArea,
      mood: nextMood,
    });
    if (nextDescription) chat.descriptionRef.current = nextDescription;

    localStorage.setItem(PENDING_KEY, JSON.stringify({
      businessName: bName, businessType: bType, businessSubType: nextBusinessSubType,
      description: nextDescription || "",
      whatsapp: nextWhatsapp || "", service_area: nextServiceArea || "", mood: nextMood || "",
      language: nextLanguage,
    }));

    await generate.startStream({
      business_name: bName, business_type: bType, business_sub_type: nextBusinessSubType || undefined,
      whatsapp: nextWhatsapp || "", service_area: nextServiceArea || "",
      description: nextDescription || undefined, mood: nextMood || undefined,
      language: nextLanguage,
      design_token: initialDesignTokenRef.current ?? undefined,
      story: nextDescription || undefined,
      tagline: undefined,
      proof: undefined,
    });
  };

  const handleGenerate = async (
    bName = chat.businessName,
    bType = chat.businessType,
    overrides: { businessSubType?: string; whatsapp?: string; serviceArea?: string; description?: string; mood?: string; language?: string } = {}
  ) => {
    qualityRetryCountRef.current = 0;
    await runGenerate(bName, bType, overrides);
  };

  // Wire up chat handlers with handleGenerate
  const onChatGenerate = (name: string, type: string, overrides: any) => {
    void handleGenerate(name, type, overrides);
  };

  const handleSendText = (e: React.FormEvent) => chat.handleSendText(e, onChatGenerate);
  const handleSelectSubType = (subType: string) => {
    chat.handleSelectSubType(subType, (name, type, overrides) => {
      preview.setRegenCount(0);
      preview.setHasUnsavedEdits(false);
      generate.didGenerateRef.current = true;
    });
  };
  const handleSelectMood = (mood: string) => {
    chat.handleSelectMood(mood, (name, type, overrides) => {
      preview.setRegenCount(0);
      preview.setHasUnsavedEdits(false);
      generate.didGenerateRef.current = true;
      // Clear any preset design token from the gallery — the user explicitly
      // chose a mood in the wizard, so the AI should generate a fresh token
      // based on the selected mood without being constrained by a gallery preset.
      initialDesignTokenRef.current = null;
      void handleGenerate(name, type, overrides);
    });
  };
  const handleConfirmInference = (confirmed: boolean) => {
    chat.handleConfirmInference(confirmed, (name, type, overrides) => {
      preview.setRegenCount(0);
      preview.setHasUnsavedEdits(false);
      generate.didGenerateRef.current = true;
    });
  };

  const handleGoToEditor = async () => {
    if (isSavingRef.current) return; // prevent double-click / race condition
    isSavingRef.current = true;

    if (!token) {
      localStorage.setItem(PENDING_KEY, JSON.stringify({
        businessName: chat.businessName, businessType: chat.businessType,
        businessSubType: chat.businessSubType, description: chat.description, whatsapp: chat.whatsapp,
        service_area: chat.serviceArea || "", mood: chat.mood || "",
        templateId: preview.previewData?.template_id, previewContent: preview.previewData?.content,
        previewDesignToken: preview.previewData?.design_token,
      }));
      if (onNeedAuth) { onNeedAuth(); }
      else { router.push("/login?redirect=/create?action=save"); }
      return;
    }

    try {
      let tenantId = activeTenantId;
      if (!tenantId && mode === "public" && createTenant) {
        const slug = generateSlug(chat.businessName);
        const created = await createTenant(chat.businessName + " Workspace", slug);
        if (created?.id) tenantId = created.id;
        else throw new Error("Gagal membuat workspace.");
      }
      if (!tenantId) throw new Error("Workspace tidak ditemukan.");

      const subdomain = generateSubdomain(chat.businessName);

      const createRes = await request<any>(
        "/sites",
        {
          method: "POST",
          headers: { "X-Tenant-ID": tenantId.toString() },
          body: JSON.stringify({
            name: chat.businessName,
            template_id: preview.previewData?.template_id || selectTemplate(chat.businessSubType || chat.businessType),
            subdomain,
            language: chat.siteLanguageRef.current ?? chat.siteLanguage ?? "id",
          }),
        },
        token
      );
      if (createRes.status !== "success") throw new Error(createRes.message);
      const siteId = createRes.data.id;

      if (preview.previewData) {
        const enrichedContent = buildFullContent(
          { content: preview.previewData.content, design_token: preview.previewData.design_token },
          chat.businessName, chat.businessSubType || chat.businessType, chat.description, chat.whatsapp
        );
        await request(
          `/sites/${siteId}/content`,
          {
            method: "PUT",
            headers: { "X-Tenant-ID": tenantId.toString() },
            body: JSON.stringify({
              content: enrichedContent,
              design_token: preview.previewData.design_token,
            }),
          },
          token
        );
      }

      localStorage.removeItem(PENDING_KEY);
      clearWizardSnapshot();
      router.push(`/dashboard/sites/${siteId}`);
    } catch (err: any) {
      if (err.statusCode === 403 && err.code === "ERR_SITE_LIMIT") {
        // Save pending upgrade draft snapshot to localStorage so it's 100% recoverable
        savePendingUpgradeDraft({
          businessName: chat.businessName,
          businessType: chat.businessType,
          businessSubType: chat.businessSubType,
          description: chat.description,
          whatsapp: chat.whatsapp,
          serviceArea: chat.serviceArea,
          mood: chat.mood,
          templateId: preview.previewData?.template_id || "TEMPLATE_DYNAMIC",
          previewContent: preview.previewData?.content,
          previewDesignToken: preview.previewData?.design_token,
          savedAt: Date.now(),
        });
        isSavingRef.current = false;
        setShowUpgradeModal(true);
        return;
      }
      isSavingRef.current = false; // allow retry on generic error
      pushToast(err.message || "Terjadi kesalahan. Silakan coba lagi.", "error");
    }
  };


  const handleDetailsSheetSave = (whatsapp: string, serviceArea: string) => {
    chat.setWhatsapp(whatsapp);
    chat.setServiceArea(serviceArea);
    setSheetOpen(false);
    preview.setHasUnsavedEdits(true);
    preview.setRegenCount((c: number) => c + 1);
    preview.setPreviewState("loading");
    device.setMobileScreen("loading");
    void handleGenerate(chat.businessName, chat.businessType, {
      whatsapp,
      serviceArea,
    });
  };

  // ── Resume/state persistence ─────────────────────────────────────────────
  const resumeSnapshotProgress =
    chat.messages.length > 1 ||
    Boolean(chat.businessName) ||
    Boolean(preview.previewData);

  // Debounced autosave of the wizard session so a refresh/disconnect keeps progress.
  React.useEffect(() => {
    if (!resumeSnapshotProgress) return;
    const timeoutId = setTimeout(() => {
      const snapshot: WizardResumeSnapshot = {
        version: 1,
        savedAt: Date.now(),
        businessName: chat.businessName,
        chat: {
          chatStage: chat.chatStage,
          messages: chat.messages.filter((m) => m.id !== "typing"),
          businessName: chat.businessName,
          businessType: chat.businessType,
          businessSubType: chat.businessSubType,
          description: chat.description,
          whatsapp: chat.whatsapp,
          serviceArea: chat.serviceArea,
          mood: chat.mood,
          siteLanguage: chat.siteLanguageRef.current ?? chat.siteLanguage ?? null,
          awaitingNameConfirm: chat.awaitingNameConfirm,
          awaitingInferenceConfirm: chat.awaitingInferenceConfirm,
          inferenceResult: chat.inferenceResult,
          suggestedHint: chat.suggestedHint,
          typeWasInferred: chat.typeWasInferred,
        },
        preview: preview.previewData ? toResumePreview(preview.previewData) : undefined,
      };
      saveWizardSnapshot(snapshot);
    }, 600);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chat.chatStage,
    chat.messages,
    chat.businessName,
    chat.businessType,
    chat.businessSubType,
    chat.description,
    chat.whatsapp,
    chat.serviceArea,
    chat.mood,
    chat.siteLanguage,
    chat.awaitingNameConfirm,
    chat.awaitingInferenceConfirm,
    chat.inferenceResult,
    chat.suggestedHint,
    chat.typeWasInferred,
    preview.previewData,
    resumeSnapshotProgress,
  ]);

  const handleResume = () => {
    if (!resumeDraft) return;
    chat.hydrate(resumeDraft.chat);
    if (resumeDraft.preview) {
      const restoredPreview: PreviewData = {
        content: resumeDraft.preview.content,
        design_token: resumeDraft.preview.designToken ?? {},
        template_id: resumeDraft.preview.templateId,
      };
      preview.setPreviewData(restoredPreview);
      preview.setPreviewHistory([restoredPreview]);
      preview.setHistoryIndex(0);
      preview.setStreamedSections(resumeDraft.preview.content);
      preview.streamedSectionsRef.current = resumeDraft.preview.content;
      preview.setStreamedDesignToken(resumeDraft.preview.designToken ?? null);
      preview.streamedTokenRef.current = resumeDraft.preview.designToken ?? null;
      preview.setStreamedTemplateId(resumeDraft.preview.templateId ?? "");
      preview.setPreviewState("result");
      preview.streamDoneRef.current = true;
      preview.setStreamDone(true);
      const mood = resumeDraft.chat.mood;
      const pool = getTemplatePool(resumeDraft.chat.businessType || resumeDraft.chat.businessSubType, mood);
      preview.setTemplatePool(pool);
      preview.setTemplatePoolIndex(0);
      device.setMobilePreviewOpen(true);
      if (device.isMobileRef.current) {
        device.setMobileScreen("preview");
      }
    } else if (resumeDraft.chat.chatStage === "done") {
      // Generation was interrupted — restart it
      runGenerate(
        resumeDraft.chat.businessName,
        resumeDraft.chat.businessType,
        {
          businessSubType: resumeDraft.chat.businessSubType,
          mood: resumeDraft.chat.mood,
          language: resumeDraft.chat.siteLanguage ?? "id",
        }
      );
    }
    setResumeDraft(null);
  };

  const handleStartFresh = () => {
    clearWizardSnapshot();
    setResumeDraft(null);
  };

  const [resumeSavedText, setResumeSavedText] = useState("");

  React.useEffect(() => {
    if (!resumeDraft) return;
    setResumeSavedText(formatSavedTime(resumeDraft.savedAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeDraft]);

  const formatSavedTime = (savedAt: number) => {
    const mins = Math.floor((Date.now() - savedAt) / 60000);
    if (mins < 1) return t("dashboard.wizard.timeJustNow", "baru saja");
    if (mins < 60) return t("dashboard.wizard.timeMinutesAgo", "{count} menit lalu", { count: String(mins) });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t("dashboard.wizard.timeHoursAgo", "{count} jam lalu", { count: String(hours) });
    const days = Math.floor(hours / 24);
    return t("dashboard.wizard.timeDaysAgo", "{count} hari lalu", { count: String(days) });
  };

  return (
    <div
      className="fixed inset-0 md:relative flex w-screen overflow-hidden bg-background md:h-screen"
      style={{ height: "var(--webjoz-app-height, 100dvh)", top: "var(--webjoz-app-top, 0px)" }}
    >
      {/* ══ LEFT SIDEBAR: Chat Panel ══════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 z-20 flex h-full w-full shrink-0 flex-col overflow-hidden border-r bg-[#111318] shadow-xl transition-transform duration-300 ease-out md:relative md:inset-auto md:z-10 md:w-[410px] lg:w-[430px] md:translate-x-0 ${device.isMobile
            ? device.mobileScreen === "chat" ? "translate-x-0" : "-translate-x-full"
            : device.mobilePreviewOpen ? "-translate-x-full" : "translate-x-0"
          }`}
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="px-5 pt-4 pb-0 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 1px 0 rgba(255,255,255,0.025)" }}>
          <div className="flex items-start gap-3 mb-4">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Kembali"
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-slate-300 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-white active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 text-primary-foreground">
                    <SparkleGenAI className="w-[27px] h-[27px]" />
                  </div>
                  <span className="font-bold text-white text-[17px] leading-tight">Webjoz AI Assistant</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {device.isMobile && preview.previewState === "result" && (
                    <button
                      type="button"
                      onClick={() => device.setMobileScreen("preview")}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold transition-all active:scale-95 animate-pulse"
                    >
                      Preview &rarr;
                    </button>
                  )}
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">BETA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step Progress Bar — 4 Unified Logical Steps */}
          {chat.chatStage !== "done" && (() => {
            const stepMap: Record<string, number> = {
              name: 1,
              description: 2,
              type: 2,
              language: 3,
              mood: 4,
            };
            const totalSteps = 4;
            const stepNum = stepMap[chat.chatStage] || 1;
            const progressPct = Math.round((stepNum / totalSteps) * 100);
            return (
              <div className="flex items-center gap-3 pb-3">
                <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 tabular-nums shrink-0">
                  {String(stepNum).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
                </span>
              </div>
            );
          })()}
        </div>

        {resumeDraft && (
          <div className="relative mx-3 sm:mx-4 mt-2.5 sm:mt-3 shrink-0 rounded-2xl border border-white/[0.08] bg-[#16191E]/95 p-3 sm:p-3.5 shadow-xl backdrop-blur-md animate-in fade-in group">
            <button
              type="button"
              onClick={handleResume}
              className="w-full flex items-center justify-between gap-3 text-left cursor-pointer pr-6"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 text-primary transition-transform group-hover:scale-105">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 leading-tight">
                    {t("dashboard.wizard.resumeLastSession", "Sesi terakhir")} · <span className="text-slate-500">{resumeSavedText}</span>
                  </p>
                  <p className="text-xs sm:text-[13px] font-bold text-white truncate leading-tight mt-0.5">
                    {resumeDraft.businessName || t("dashboard.wizard.untitledDraft", "Draft Tanpa Nama")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                <span>{t("dashboard.wizard.resumeContinue", "Lanjutkan")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
            <button
              type="button"
              onClick={handleStartFresh}
              title={t("dashboard.wizard.resumeStartFresh", "Mulai baru")}
              className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="text-xs font-bold leading-none">✕</span>
            </button>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto px-4 py-5 space-y-4 ${device.isMobile ? (device.mobileScreen === "preview" ? "pb-28" : "pb-6") : "md:pb-8"}`}>
          {chat.messages.map((m) => {
            if (m.widget === "inference-confirm") {
              const isLocked = !chat.awaitingInferenceConfirm;
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => !isLocked && handleConfirmInference(true)}
                      disabled={isLocked}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground transition-all hover:brightness-110 active:scale-95 disabled:opacity-40"
                    >
                      Ya, lanjut
                    </button>
                    <button
                      type="button"
                      onClick={() => !isLocked && handleConfirmInference(false)}
                      disabled={isLocked}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-medium text-slate-300 border border-border transition-all hover:border-border active:scale-95 disabled:opacity-40"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      Bukan
                    </button>
                  </div>
                </div>
              );
            }

            if (m.widget === "subtype-chips") {
              const isLocked = chat.chatStage === "language" || chat.chatStage === "mood" || chat.chatStage === "done";
              const subTypes = chat.businessType ? SUB_TYPES[chat.businessType] : [];
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                  {chat.typeWasInferred && (
                    <button
                      type="button"
                      onClick={() => {
                        chat.setTypeWasInferred(false);
                        chat.setBusinessType("");
                        chat.setBusinessSubType("");
                        chat.setMessages((prev) => prev.filter((msg) => msg.id !== m.id));
                        chat.setMessages((prev) => [
                          ...prev,
                          { id: `widget-type-chips-${Date.now()}`, sender: "ai", text: "", widget: "type-chips" as const },
                        ]);
                        chat.setChatStage("type");
                      }}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline mb-2 inline-block transition-colors"
                    >
                      {t("dashboard.wizard.notThisType", "Bukan ini? Pilih jenis bisnis lain")}
                    </button>
                  )}
                  <p className="text-[10px] font-semibold text-slate-500 mb-2 px-0.5">{t("dashboard.wizard.moreSpecific", "Lebih spesifik:")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {subTypes.map((st) => {
                      const isSubSelected = chat.businessSubType === st.value;
                      return (
                        <button
                          key={st.value}
                          type="button"
                          onClick={() => !isLocked && handleSelectSubType(st.value)}
                          disabled={isLocked}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-95 ${isSubSelected ? "text-white border-primary/60 bg-primary/20" : "text-slate-300 border-white/[0.08] bg-white/[0.04] hover:border-white/20 hover:text-white hover:bg-white/[0.08]"}`}
                        >
                          <Tag className={`w-3 h-3 ${isSubSelected ? "text-primary" : "text-slate-400"}`} />
                          <span>{t(`dashboard.wizard.subtypes.${st.value}`, st.label)}</span>
                          {isSubSelected && <span className="text-primary text-[10px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (m.widget === "language-chips") {
              const isLocked = chat.chatStage !== "language";
              const langs = [
                { value: "id" as const, label: "Indonesia", flag: "🇮🇩" },
                { value: "en" as const, label: "English", flag: "🇬🇧" },
              ];
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-2">
                  <div className="flex gap-2">
                    {langs.map((lang) => {
                      const isSelected = chat.siteLanguage === lang.value;
                      return (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => !isLocked && chat.handleSelectLanguage(lang.value)}
                          disabled={isLocked}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isSelected ? "text-white border-primary/60" : isLocked ? "text-slate-600 border-border/50 cursor-not-allowed" : "text-slate-300 border-border hover:border-primary/50 hover:text-white cursor-pointer active:scale-95"}`}
                          style={{ background: isSelected ? "rgba(99,102,241,0.2)" : isLocked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)" }}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.label}</span>
                          {isSelected && <span className="text-primary text-[10px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (m.widget === "mood-chips") {
              const isLocked = chat.chatStage !== "mood";
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MOOD_OPTIONS.map((mo) => {
                      const isSelected = chat.mood === mo.value;
                      const moodKeyMap: Record<string, string> = {
                        "clean-modern": "modernClean",
                        "warm-earthy": "warmVintage",
                        "bold-vibrant": "playfulFun",
                        "dark-premium": "elegantLuxury",
                        "bold-dark": "boldEnergetic",
                        "retro": "retro",
                        "futuristic": "futuristic",
                      };
                      const moodKey = moodKeyMap[mo.value];
                      const translatedMoodLabel = moodKey ? t(`dashboard.wizard.moods.${moodKey}`, mo.label) : mo.label;

                      const moodIconMap: Record<string, { icon: React.ReactNode; bg: string; text: string; glow: string }> = {
                        "clean-modern":  { icon: <Monitor className="w-4 h-4" />, bg: "bg-blue-500/15",   text: "text-blue-400",   glow: "shadow-blue-500/20" },
                        "warm-earthy":   { icon: <Leaf    className="w-4 h-4" />, bg: "bg-green-600/15",  text: "text-green-400",  glow: "shadow-green-500/20" },
                        "bold-vibrant":  { icon: <Palette className="w-4 h-4" />, bg: "bg-orange-500/15", text: "text-orange-400", glow: "shadow-orange-500/20" },
                        "dark-premium":  { icon: <Crown   className="w-4 h-4" />, bg: "bg-yellow-500/15", text: "text-yellow-400", glow: "shadow-yellow-500/20" },
                        "bold-dark":     { icon: <Zap     className="w-4 h-4" />, bg: "bg-red-500/15",    text: "text-red-400",    glow: "shadow-red-500/20" },
                        "retro":         { icon: <Clock   className="w-4 h-4" />, bg: "bg-amber-600/15",  text: "text-amber-400",  glow: "shadow-amber-600/20" },
                        "futuristic":    { icon: <Bot     className="w-4 h-4" />, bg: "bg-cyan-500/15",   text: "text-cyan-400",   glow: "shadow-cyan-500/20" },
                      };
                      const cfg = moodIconMap[mo.value] ?? { icon: <Sparkles className="w-4 h-4" />, bg: "bg-white/10", text: "text-slate-300", glow: "" };

                      return (
                        <button
                          key={mo.value}
                          type="button"
                          onClick={() => !isLocked && handleSelectMood(mo.value)}
                          disabled={isLocked}
                          className={`group relative flex items-center gap-2.5 rounded-xl border px-3 py-2.5 sm:px-3.5 sm:py-3 text-left transition-all duration-200 focus:outline-none ${
                            isSelected
                              ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md shadow-primary/15"
                              : isLocked
                              ? "border-border/50 bg-muted/30 opacity-45 cursor-not-allowed"
                              : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 cursor-pointer active:scale-[0.98]"
                          }`}
                          style={isSelected ? {} : { backdropFilter: "blur(4px)" }}
                        >
                          {/* Icon kiri */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow ${cfg.bg} ${cfg.text} ${cfg.glow} transition-transform duration-200 ${isSelected ? "scale-105" : "group-hover:scale-105"}`}>
                            {cfg.icon}
                          </div>

                          {/* Nama kanan */}
                          <span className="text-[12px] sm:text-[13px] font-semibold text-white leading-snug flex-1">
                            {translatedMoodLabel}
                          </span>

                          {/* Checkmark kanan saat terpilih */}
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/40">
                              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-500 px-0.5">{t("dashboard.wizard.chooseMoodHint", "Pilih karakter visual yang cocok untuk brand Anda")}</p>
                </div>
              );
            }

            if (m.widget === "type-chips") {
              const isLocked = chat.chatStage === "language" || chat.chatStage === "mood" || chat.chatStage === "done";
              const subTypes = chat.businessType ? SUB_TYPES[chat.businessType] : null;
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-2.5">
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {BUSINESS_TYPES.map((bt) => {
                      const isSelected = chat.businessType === bt.value;
                      const categoryKeyMap: Record<string, { label: string; desc: string }> = {
                        "Kuliner": { label: "kuliner", desc: "kulinerDesc" },
                        "Toko": { label: "tokoUmkm", desc: "tokoUmkmDesc" },
                        "Toko & UMKM": { label: "tokoUmkm", desc: "tokoUmkmDesc" },
                        "Layanan & Reservasi": { label: "jasaBooking", desc: "jasaBookingDesc" },
                        "Jasa & Booking": { label: "jasaBooking", desc: "jasaBookingDesc" },
                        "Kreatif & Profesional": { label: "portofolioKreator", desc: "portofolioKreatorDesc" },
                        "Portofolio & Kreator": { label: "portofolioKreator", desc: "portofolioKreatorDesc" },
                        "Company Profile": { label: "company", desc: "companyDesc" },
                        "Company": { label: "company", desc: "companyDesc" },
                      };
                      const keys = categoryKeyMap[bt.value];
                      const translatedLabel = keys ? t(`dashboard.wizard.categories.${keys.label}`, bt.label) : bt.label;

                      const categoryIconMap: Record<string, React.ReactNode> = {
                        "Kuliner": <UtensilsCrossed className="w-3.5 h-3.5" />,
                        "Toko": <ShoppingBag className="w-3.5 h-3.5" />,
                        "Toko & UMKM": <ShoppingBag className="w-3.5 h-3.5" />,
                        "Layanan & Reservasi": <Calendar className="w-3.5 h-3.5" />,
                        "Jasa & Booking": <Calendar className="w-3.5 h-3.5" />,
                        "Kreatif & Profesional": <Palette className="w-3.5 h-3.5" />,
                        "Portofolio & Kreator": <Palette className="w-3.5 h-3.5" />,
                        "Company Profile": <Building2 className="w-3.5 h-3.5" />,
                        "Company": <Building2 className="w-3.5 h-3.5" />,
                      };

                      return (
                        <button
                          key={bt.value}
                          type="button"
                          onClick={() => !isLocked && chat.handleSelectType(bt.value)}
                          disabled={isLocked}
                          className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? "border-primary bg-primary/20 text-white shadow-xs shadow-primary/20 ring-1 ring-primary/40"
                              : isLocked
                              ? "opacity-35 cursor-default border-white/[0.06] bg-white/[0.02] text-slate-400"
                              : "border-white/[0.08] bg-[#16191E]/90 text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                          }`}
                        >
                          <span className={`transition-colors shrink-0 ${isSelected ? "text-primary" : "text-slate-400 group-hover:text-white"}`}>
                            {categoryIconMap[bt.value] || <Sparkles className="w-3.5 h-3.5" />}
                          </span>
                          <span>{translatedLabel}</span>
                          {chat.suggestedHint?.type === bt.value && !isSelected && (
                            <span className="text-[9px] font-bold text-amber-300 bg-amber-800/30 px-1.5 py-0.5 rounded-full">✨ Disarankan</span>
                          )}
                          {isSelected && (
                            <span className="text-primary text-xs font-bold shrink-0">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {subTypes && !isLocked && (
                    <div ref={chat.subTypeRef} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                      <p className="text-[10px] font-semibold text-slate-500 mb-2 px-0.5">{t("dashboard.wizard.moreSpecific", "Lebih spesifik:")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {subTypes.map((st) => {
                          const isSubSelected = chat.businessSubType === st.value;
                          return (
                            <button
                              key={st.value}
                              type="button"
                              onClick={() => !isLocked && handleSelectSubType(st.value)}
                              disabled={isLocked}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-95 ${isSubSelected ? "text-white border-primary/60 bg-primary/20" : "text-slate-300 border-white/[0.08] bg-white/[0.04] hover:border-white/20 hover:text-white hover:bg-white/[0.08]"}`}
                            >
                              <Tag className={`w-3 h-3 ${isSubSelected ? "text-primary" : "text-slate-400"}`} />
                              <span>{t(`dashboard.wizard.subtypes.${st.value}`, st.label)}</span>
                              {chat.suggestedHint?.subType === st.value && (
                                <span className="text-[10px] text-amber-300">✨</span>
                              )}
                              {isSubSelected && <span className="text-primary text-[10px]">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                      {chat.businessSubType && (
                        <button
                          type="button"
                          onClick={() => handleSelectSubType(chat.businessSubType)}
                          className="mt-2.5 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white border transition-all hover:bg-emerald-500/10 active:scale-95"
                          style={{ background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.5)" }}
                        >
                          {t("dashboard.wizard.btnContinueType", "Lanjut dengan jenis ini →")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            if (m.widget === "stt-review-confirm") {
              const transcript = m.sttTranscript || "";
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 text-primary-foreground">
                      <SparkleGenAI className="w-[21px] h-[21px]" />
                    </div>
                    <div className="max-w-[90%] space-y-2.5">
                      <div className="rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed space-y-3 bg-[#131f1a] border border-emerald-500/30 text-slate-200 shadow-xl">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                          <Mic className="w-4 h-4" />
                          <span>{t("dashboard.wizard.sttReviewTitle", "Berikut yang saya dengar dari Anda:")}</span>
                        </div>

                        <div className="rounded-xl bg-black/30 border border-emerald-500/20 p-3 text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed italic">
                          &ldquo;{transcript}&rdquo;
                        </div>

                        <p className="text-xs text-slate-300">
                          {t("dashboard.wizard.sttReviewPrompt", "Apakah sudah sesuai? Anda bisa edit sebelum saya lanjutkan.")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => chat.handleConfirmSttReview(false, transcript)}
                          className="flex-1 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all active:scale-95 text-center cursor-pointer"
                        >
                          {t("dashboard.wizard.sttBtnEdit", "Edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => chat.handleConfirmSttReview(true, transcript)}
                          className="flex-1 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all active:scale-95 text-center cursor-pointer"
                        >
                          {t("dashboard.wizard.sttBtnConfirm", "Ya, lanjutkan")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (m.widget === "text-review-confirm") {
              const transcript = m.sttTranscript || "";
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 text-primary-foreground">
                      <SparkleGenAI className="w-[21px] h-[21px]" />
                    </div>
                    <div className="max-w-[90%] space-y-2.5">
                      <div className="rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed space-y-3 bg-[#131f1a] border border-emerald-500/30 text-slate-200 shadow-xl">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                          <Sparkles className="w-4 h-4" />
                          <span>{t("dashboard.wizard.textReviewTitle", "Saya poles deskripsi Anda:")}</span>
                        </div>

                        <div className="rounded-xl bg-black/30 border border-emerald-500/20 p-3 text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed italic">
                          &ldquo;{transcript}&rdquo;
                        </div>

                        <p className="text-xs text-slate-300">
                          {t("dashboard.wizard.textReviewPrompt", "Apakah sudah sesuai? Anda bisa edit sebelum saya lanjutkan.")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => chat.handleConfirmSttReview(false, transcript)}
                          className="flex-1 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all active:scale-95 text-center cursor-pointer"
                        >
                          {t("dashboard.wizard.sttBtnEdit", "Edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => chat.handleConfirmSttReview(true, transcript)}
                          className="flex-1 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all active:scale-95 text-center cursor-pointer"
                        >
                          {t("dashboard.wizard.sttBtnConfirm", "Ya, lanjutkan")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            const messageText = m.id === "init" && chat.chatStage === "name"
              ? chat.initialMessageWords.slice(0, chat.initialWordCount).join(" ")
              : m.text;

            return (
              <div key={m.id} className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                {m.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 text-primary-foreground">
                    <SparkleGenAI className="w-[21px] h-[21px]" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.sender === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "rounded-tl-sm text-slate-200"}`}
                  style={m.sender !== "user" ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" } : {}}
                >
                  {formatText(messageText, m.sender === "user")}
                  {m.id === "init" && chat.isInitialTyping && (
                    <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse rounded-full bg-slate-300" />
                  )}
                </div>
              </div>
            );
          })}

          {chat.isProcessingAudio && (
            <AudioProcessingCard businessName={chat.businessName} />
          )}

          {chat.isProcessingDescription && (
            <AudioProcessingCard businessName={chat.businessName} variant="text" />
          )}

          <div ref={chat.chatEndRef} />
        </div>

        {/* Chat Input */}
        {chat.chatStage !== "type" && chat.chatStage !== "language" && chat.chatStage !== "mood" && chat.chatStage !== "done" && (
          <div
            className={`shrink-0 px-4 pt-2 md:py-3 relative transition-all duration-150 ${device.isKeyboardOpen ? "pb-2" : "pb-6"}`}
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            {chat.isRecording ? (
              <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-[#141e19] border border-emerald-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between gap-3">
                  {/* Status & Timer */}
                  <div className="flex items-center gap-2 shrink-0">
                    {chat.isMicConnecting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                        <span className="text-xs font-semibold text-amber-300">
                          {t("dashboard.wizard.sttConnecting", "Menyiapkan mic...")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-emerald-300 hidden sm:inline">
                          {t("dashboard.wizard.sttListening", "Mendengarkan...")}
                        </span>
                        <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                          {Math.floor(chat.recordingDuration / 60).toString().padStart(2, "0")}:{(chat.recordingDuration % 60).toString().padStart(2, "0")}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Waveform Visualizer */}
                  <div className="flex-1 flex justify-center min-w-0">
                    <AudioWaveform isRecording={chat.isRecording} isConnecting={chat.isMicConnecting} />
                  </div>

                  {/* Round Stop Button */}
                  <button
                    type="button"
                    onClick={chat.stopRecording}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                    title={t("dashboard.wizard.sttBtnDone", "Selesai")}
                  >
                    <Square className="w-3.5 h-3.5 fill-slate-900" />
                  </button>
                </div>

                {/* Bottom Action Row: Guide text + Selesai & Batal */}
                <div className="flex items-center justify-between pt-1 border-t border-emerald-500/10">
                  <span className="text-[11px] text-slate-400 truncate pr-2">
                    {t("dashboard.wizard.sttPromptGuide", "Ceritakan bisnis Anda...")}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={chat.cancelRecording}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors cursor-pointer"
                    >
                      {t("dashboard.wizard.sttBtnCancel", "Batal")}
                    </button>
                    <button
                      type="button"
                      onClick={chat.stopRecording}
                      className="text-[11px] font-bold text-slate-900 bg-white hover:bg-slate-100 px-3 py-1 rounded-lg shadow transition-all active:scale-95 cursor-pointer"
                    >
                      {t("dashboard.wizard.sttBtnDone", "Selesai")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendText} className="flex items-center rounded-2xl px-4 py-1 gap-2 transition-all" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <input
                  ref={chat.inputRef}
                  type="text"
                  onFocus={() => {
                    setTimeout(() => {
                      window.scrollTo(0, 0);
                      chat.chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 120);
                  }}
                  value={chat.inputValue}
                  onChange={(e) => chat.setInputValue(e.target.value)}
                  placeholder={
                    chat.isRecording ? t("dashboard.wizard.sttListening", "Mendengarkan...") :
                      chat.awaitingNameConfirm ? t("dashboard.wizard.nameConfirmPlaceholder", "Ketik 'ya' untuk lanjut, atau nama yang benar...") :
                        chat.chatStage === "description" ? t("dashboard.wizard.descPlaceholder", "Contoh: Jual kopi spesial di Jogja, melayani pesanan partai besar") :
                          t("dashboard.wizard.inputPlaceholderName", "Masukkan nama bisnis Anda...")
                  }
                  autoFocus
                  disabled={chat.isInitialTyping || chat.isAiTyping || chat.isProcessingAudio || chat.isProcessingDescription}
                  className="flex-1 bg-transparent border-none py-2.5 text-base md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none disabled:opacity-50"
                />
                {chat.chatStage === "description" && (
                  <div className="relative shrink-0 flex items-center">
                    <MicOnboardingHint visible={!chat.isRecording && !chat.isProcessingAudio} />
                    <button
                      type="button"
                      onClick={chat.startRecording}
                      disabled={chat.isInitialTyping || chat.isAiTyping || chat.isProcessingAudio || chat.isProcessingDescription}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.06] border border-border text-slate-400 hover:text-white hover:bg-white/[0.12] transition-all disabled:opacity-30 shrink-0 active:scale-95 animate-mic-pulse cursor-pointer"
                      title={t("dashboard.wizard.sttStartRecording", "Bicara dengan mic")}
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={chat.isInitialTyping || chat.isAiTyping || chat.isProcessingAudio || chat.isProcessingDescription || (chat.chatStage === "name" && !chat.inputValue.trim())}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all disabled:opacity-30 hover:bg-primary/90 shrink-0 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}

        <div className="px-5 py-3 shrink-0 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full shrink-0 transition-all duration-500 ${preview.previewState === "loading" ? "bg-primary animate-pulse" : "bg-emerald-400"}`}
            />
            <span className="transition-all duration-300">
              {preview.previewState === "wireframe" && (chat.chatStage === "name" || chat.chatStage === "type" || chat.chatStage === "mood") && t("dashboard.wizard.statusWaitingInput", "Menunggu input...")}
              {preview.previewState === "loading" && t("dashboard.wizard.statusAiGenerating", "AI sedang generate...")}
              {preview.previewState === "result" && t("dashboard.wizard.statusPreviewReady", "Preview siap ✓")}
              {preview.previewState === "wireframe" && chat.chatStage === "done" && t("dashboard.wizard.statusPreparingAi", "Menyiapkan AI...")}
            </span>
          </span>
          <span className="text-[11px] text-slate-500" suppressHydrationWarning>
            {clock.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
          </span>
        </div>
      </div>

      {/* ══ RIGHT: Browser Preview ════════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 z-30 flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-background transition-transform duration-300 ease-out md:relative md:inset-auto md:z-0 md:translate-x-0 ${device.isMobile
            ? device.mobileScreen === "preview" || device.mobileScreen === "loading" ? "translate-x-0" : "translate-x-full"
            : device.mobilePreviewOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="h-12 flex items-center px-4 gap-3 shrink-0" style={{ background: "#111318", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            type="button"
            onClick={() => device.setMobileScreen("chat")}
            aria-label={t("dashboard.wizard.backToChat", "Kembali ke chat")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-slate-300 transition-all active:scale-95 md:hidden"
          >
            <MessageCircle className="h-4 w-4" />
          </button>

          <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5">
            <button
              type="button"
              onClick={() => device.setPreviewDevice("desktop")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device.previewDevice === "desktop" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="Preview desktop"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => device.setPreviewDevice("tablet")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device.previewDevice === "tablet" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="Preview tablet"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => device.setPreviewDevice("mobile")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device.previewDevice === "mobile" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="Preview mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          {preview.templatePool.length > 1 && preview.previewState === "result" && (
            <button
              type="button"
              onClick={preview.handleSwitchTemplate}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-300 border border-border bg-muted/50 transition-all hover:border-primary/40 hover:text-white active:scale-95"
            >
              <RefreshCw size={11} />
              Coba rekomendasi lain ({preview.templatePoolIndex + 1}/{preview.templatePool.length})
            </button>
          )}

          <div className="flex-1 min-w-0">
            {preview.previewState === "loading" && (
              <span className="ml-auto text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full w-fit block">Draft Preview</span>
            )}
            {preview.previewState === "result" && (
              <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full w-fit block">Live Preview</span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-background" ref={previewContainerRef}>
          <PreviewCanvas chat={chat} preview={preview} device={device} />

          {preview.previewState === "loading" && !device.isMobile && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
              <LoadingModal loadingStep={preview.loadingStep} progressPercent={preview.smoothProgress} businessType={chat.businessType} businessName={chat.businessName} charCount={writtenCharCount} sectionSnippet={sectionSnippet} stepElapsed={preview.stepElapsed} streamDone={preview.streamDone} />
            </div>
          )}

          {preview.previewState === "loading" && device.isMobile && (
            <div className="absolute inset-0 z-40 bg-black/10">
              <LoadingModal loadingStep={preview.loadingStep} progressPercent={preview.smoothProgress} businessType={chat.businessType} businessName={chat.businessName} center stepElapsed={preview.stepElapsed} streamDone={preview.streamDone} />
            </div>
          )}

          {preview.previewState === "result" && (
            <div className="hidden md:flex absolute bottom-6 right-6 z-40 gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold bg-white text-slate-900 shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 hover:brightness-110 active:brightness-95"
              >
                <Plus className="h-4 w-4" />
                Lengkapi Data
              </button>
              <button
                type="button"
                onClick={handleGoToEditor}
                className="btn-primary flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold shadow-[0_14px_35px_rgba(0,0,0,0.25)] transition-all hover:scale-105 active:scale-95"
              >
                <Pencil className="h-4 w-4" />
                Edit &amp; Publikasikan
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <WizardSuccessToast
            open={successModalOpen}
            onDismiss={() => setSuccessModalOpen(false)}
            onGoToEditor={() => { setSuccessModalOpen(false); handleGoToEditor(); }}
            containerRef={previewContainerRef}
            // MobileActionBar is ~88px tall on mobile; on desktop the bar is absent
            bottomOffset={device.isMobile ? 88 : 0}
          />
        </div>
      </div>

      <WizardErrorModal
        open={generate.tooManyRequests}
        title="Terlalu cepat!"
        message="Kamu sudah generate beberapa kali dalam waktu singkat. Tunggu 30 detik, lalu coba lagi ya."
        variant="warning"
        onCancel={handleCancelGenerationError}
        onRetry={handleRetryGeneration}
      />

      <WizardErrorModal
        open={!!generate.generationError}
        title={t("dashboard.wizard.generationFailed", "Generate belum berhasil")}
        message={generate.generationError || t("dashboard.wizard.generationErrorMessage", "Terjadi kesalahan saat membuat preview.")}
        onCancel={handleCancelGenerationError}
        onRetry={handleRetryGeneration}
      />

      <MobileActionBar
        preview={preview}
        device={device}
        onOpenSheet={() => setSheetOpen(true)}
        onGoToEditor={handleGoToEditor}
      />

      <BusinessDetailsSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        chat={chat}
        onSave={handleDetailsSheetSave}
      />

      <WizardUpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        businessName={chat.businessName}
        onUpgradeSuccess={handleGoToEditor}
      />
    </div>
  );
}

const INITIAL_MESSAGE_WORDS = INITIAL_MESSAGE.split(" ");
