"use client";
/* eslint-disable react-hooks/refs */

import React, { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { CustomSelect } from "webjoz-ui";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/client";
import {
  ArrowRight,
  Axe,
  Bot,
  Box,
  Briefcase,
  Building2,
  Bus,
  Calendar,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Code2,
  Coffee,
  CookingPot,
  Cpu,
  Crown,
  Dumbbell,
  Factory,
  Flame,
  Flower2,
  GalleryHorizontal,
  Gift,
  Globe,
  GraduationCap,
  HandHeart,
  Heart,
  HelpCircle,
  Home,
  Hotel,
  Hourglass,
  Landmark,
  Leaf,
  Loader2,
  Mic,
  Mic2,
  Monitor,
  Music2,
  Package,
  Paintbrush,
  Palette,
  Pencil,
  PencilRuler,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Scale,
  Scissors,
  Search,
  ShoppingBag,
  ShoppingCart,
  Shirt,
  Smartphone,
  Square,
  Snowflake,
  Stethoscope,
  Store,
  Tablet,
  Tag,
  Tractor,
  Truck,
  User,
  UtensilsCrossed,
  Video,
  Waves,
  Wheat,
  HardHat,
  Wrench,
  X,
  Zap,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { SparkleIcon, SparkleGenAI } from "@/components/sparkle-icon";
import { AudioWaveform } from "./audio-waveform";
import { MicOnboardingHint } from "./mic-onboarding-hint";
import { AudioProcessingCard } from "./audio-processing-card";
import { useToast } from "@/components/toast-provider";
import { buildFullContent } from "@/lib/build-full-content";
import { SiteWizardProps, PreviewData } from "./types";
import { PENDING_KEY, BUSINESS_TYPES, SUB_TYPES, MOOD_OPTIONS, INITIAL_MESSAGE } from "./constants";
import {
  groupsForEntity,
  industriesForEntity,
  buildSubTypeChips,
  toggleUserEntity,
  nextEntityFromArchetype,
} from "./entity";
import { useTaxonomy, useTaxonomyV2 } from "@/hooks/use-taxonomy";
import { selectTemplate, formatText, generateSubdomain, generateSlug, getTemplatePool, getDynamicDescriptionPlaceholder, generateDescriptionFromBusinessName } from "./helpers";
import { sanitizeClassificationPair } from "./taxonomy";
import { enrichGeneratePayloadV2 } from "./taxonomy-v2";
import {
  loadWizardSnapshot,
  saveWizardSnapshot,
  clearWizardSnapshot,
  snapshotHasProgress,
  toResumePreview,
  WizardResumeSnapshot,
  savePendingUpgradeDraft,
} from "./wizard-persistence";
import { encodeSiteId } from "@/lib/sqids";
import { WizardUpgradeModal } from "./wizard-upgrade-modal";
import { useWizardChat } from "./use-wizard-chat";
import { useWizardPreview } from "./use-wizard-preview";
import { useWizardDevice } from "./use-wizard-device";
import { useWizardGenerate } from "./use-wizard-generate";
import { useThemeDraft } from "./use-theme-draft";
import { stripHeavyOverrides, isEmptyOverrides } from "@/lib/theme-overrides";
import { PreviewCanvas } from "./preview-canvas";
import { MobileActionBar } from "./mobile-action-bar";
import { BusinessDetailsSheet } from "./business-details-sheet";
import { LoadingModal } from "./loading-modal";
import { WizardErrorModal } from "./error-modal";
import { WizardSuccessToast } from "./success-toast";
import { useI18n } from "@/lib/i18n/context";

export { type SiteWizardProps };
import { SUB_TYPE_ICONS, BIDANG_ICONS } from "./icons-map";
import { InferenceConfirmWidget, InferenceConfirmCard } from "./inference-confirm-widgets";
import { PreparingWebsiteLoader } from "./preparing-loader";
import { WizardStepProgressBar } from "./chat/wizard-step-progress";
import { WizardResumeBanner } from "./chat/wizard-resume-banner";
import { WizardChatFooter } from "./chat/wizard-chat-footer";
import { WizardChatInput } from "./chat/wizard-chat-input";
import { BrandLogoWidget } from "./chat/brand-logo-widget";
import { applyBrandPalette } from "@/lib/apply-brand-palette";
import { uploadImageFile, uploadFontFile } from "@/components/file-upload";
import { clearCustomFontStorage, loadCustomFontStorage } from "@/lib/wizard-font-storage";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { ThemePanel, ThemeSheet } from "./theme-panel";
import { Palette as PaletteIcon } from "lucide-react";

// Skor kualitas minimal (dari SSE done event) sebelum hasil AI ditampilkan.
// Di bawah ini dan konten masih dari AI murni (bukan mock fallback) → auto-retry.
const QUALITY_GATE_THRESHOLD = 70;
const MAX_QUALITY_RETRIES = 1;

export function SiteWizard({
  mode,
  token,
  activeTenantId,
  createTenant,
  resolveBusinessTenant,
  onNeedAuth,
  initialBusinessType,
  initialBusinessSubType,
  initialDesignToken,
}: SiteWizardProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const { t, locale, isIndonesian } = useI18n();

  const chat = useWizardChat({ businessType: initialBusinessType, businessSubType: initialBusinessSubType });
  const preview = useWizardPreview();
  const device = useWizardDevice();

  const baseThemeToken =
    preview.previewHistory[preview.historyIndex]?.design_token ??
    preview.previewData?.design_token ??
    null;

  const themeDraft = useThemeDraft({
    previewData: preview.previewData,
    setPreviewData: preview.setPreviewData,
    baseToken: baseThemeToken,
    enabled: preview.previewState !== "loading" && !!preview.previewData,
    resetKey: `${preview.regenCount}:${preview.historyIndex}`,
  });

  const wizardLang = chat.siteLanguage || (locale === "en" ? "en" : "id");
  const uiLang = locale === "en" ? "en" : "id";
  // Hanya pilihan eksplisit pengguna yang menyaring picker; entitas turunan AI tidak.
  const pickerEntity = chat.entitySource === "user" ? chat.entity : null;
  const { businessTypes: dynamicBusinessTypes, subTypes: dynamicSubTypes } = useTaxonomy(wizardLang);
  // v2 taxonomy — industries grouped by Bidang, used for sub-type chips
  const { data: taxonomyV2, getIndustryLabel } = useTaxonomyV2(wizardLang);

  const [customSubTypeOpen, setCustomSubTypeOpen] = React.useState(false);
  const [customSubTextInput, setCustomSubTextInput] = React.useState("");

  // Mobile transition delay ref to avoid jarring instant screen cuts
  const mobileTransitionTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const pendingMobileScreenRef = React.useRef<"preview" | "loading" | null>(null);

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

  // Theme panel state
  const [leftPane, setLeftPane] = useState<"chat" | "theme">("chat");
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);

  // One-time onboarding hint for "Coba rekomendasi lain" button
  const [showRekomendasiHint, setShowRekomendasiHint] = useState(false);

  // Full page preview modal
  const [fullPagePreviewOpen, setFullPagePreviewOpen] = useState(false);

  useEffect(() => {
    if (!fullPagePreviewOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullPagePreviewOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullPagePreviewOpen]);

  useEffect(() => {
    if (!fullPagePreviewOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullPagePreviewOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullPagePreviewOpen]);

  // Inline editing state for chat bubbles (both AI responses and user inputs)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingMessageId && editTextareaRef.current) {
      editTextareaRef.current.focus();
      const len = editTextareaRef.current.value.length;
      editTextareaRef.current.setSelectionRange(len, len);
    }
  }, [editingMessageId]);

  const handleStartEdit = (id: string, currentText: string) => {
    setEditingMessageId(id);
    setEditingText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    chat.editMessage(id, editingText.trim());
    setEditingMessageId(null);
    setEditingText("");
  };

  // One-time edu tooltips for "Lengkapi Data" and "Edit & Publikasikan" buttons
  const [showLengkapiHint, setShowLengkapiHint] = useState(false);
  const [showEditPublishHint, setShowEditPublishHint] = useState(false);
  const actionHintsShownRef = React.useRef(false);

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

  const handleResetChat = () => {
    if (preview.previewState === "loading") {
      generate.handleCancelGenerationError();
    }
    chat.resetChat();
    preview.resetPreview();
    themeDraft.hardReset();
    clearWizardSnapshot();
    clearCustomFontStorage();
    setResumeDraft(null);
    if (device.isMobile) {
      device.setMobileScreen("chat");
    }
  };

  React.useEffect(() => {
    // Jika wizard dibuka dari contoh template (ada prefill businessType / designToken),
    // abaikan draft resume yang mungkin masih tersimpan di localStorage — state
    // prefill baru dari URL params harus menjadi starting point yang bersih.
    const hasPrefill = Boolean(initialBusinessType) || Boolean(initialDesignToken);
    if (hasPrefill) {
      clearWizardSnapshot();
      return;
    }
    const snap = loadWizardSnapshot();
    if (snap && snapshotHasProgress(snap)) {
      setResumeDraft(snap);
    } else if (snap) {
      clearWizardSnapshot();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Ref to the preview container so confetti canvas can size itself correctly
  const previewContainerRef = React.useRef<HTMLDivElement | null>(null);

  const generate = useWizardGenerate({
    onDesignToken: (token) => {
      const withBrand = chat.brandLogoPalette
        ? applyBrandPalette(token, chat.brandLogoPalette, chat.brandLogoThemeMode ?? undefined)
        : token;
      const mergedToken = themeDraft.mergeApplied(withBrand);
      preview.setStreamedDesignToken(mergedToken);
      preview.streamedTokenRef.current = mergedToken;
      if (token.template_id) {
        preview.setStreamedTemplateId(token.template_id);
      }
    },
    onSection: (section, data, sectionSource) => {
      let sectionData = data;
      if (section === "header" && chat.brandLogoUrl) {
        sectionData = { ...data, logo_url: chat.brandLogoUrl };
      }
      preview.streamedSectionsRef.current = { ...preview.streamedSectionsRef.current, [section]: sectionData };
      preview.setStreamedSections((prev) => ({ ...prev, [section]: sectionData }));
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
      let finalToken = preview.streamedTokenRef.current ?? {};
      if (chat.brandLogoPalette) {
        finalToken = applyBrandPalette(finalToken, chat.brandLogoPalette, chat.brandLogoThemeMode ?? undefined);
      }
      finalToken = themeDraft.mergeApplied(finalToken);

      const basePreview: PreviewData & { logo_url?: string | null } = {
        content: Object.keys(finalContent).length > 0 ? finalContent : {},
        design_token: finalToken,
        template_id: templateId,
        logo_url: chat.brandLogoUrl,
      };

      const enrichedContent = buildFullContent(
        basePreview,
        chat.businessNameRef.current,
        chat.businessSubTypeRef.current || chat.businessTypeRef.current,
        chat.descriptionRef.current,
        chat.whatsappRef.current || ""
      );

      if (chat.brandLogoUrl) {
        if (enrichedContent.header) enrichedContent.header.logo_url = chat.brandLogoUrl;
        if (enrichedContent.seo) enrichedContent.seo.favicon_url = chat.brandLogoUrl;
      }

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
      try {
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
            logo_url: chat.brandLogoUrl || undefined,
            brandPalette: chat.brandLogoPalette || undefined,
            brandLogoThemeMode: chat.brandLogoThemeMode || undefined,
          })
        );
      } catch (storageErr) {
        console.warn("[wizard] storage quota exceeded saving PENDING_KEY on done", storageErr);
      }
      if (device.isMobileRef.current) {
        device.setPreviewDevice("mobile");
        if (mobileTransitionTimerRef.current) {
          pendingMobileScreenRef.current = "preview";
        } else {
          if (generate.didGenerateRef.current) {
            device.setMobileScreen("preview");
          }
        }
        return;
      }
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
        device.setPreviewDevice("mobile");
      }
      device.setMobilePreviewOpen(true);
    },
    onError: (message) => {
      if (mobileTransitionTimerRef.current) {
        clearTimeout(mobileTransitionTimerRef.current);
        mobileTransitionTimerRef.current = null;
      }
      pendingMobileScreenRef.current = null;
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
    return () => {
      cancelStreamRef.current();
      if (mobileTransitionTimerRef.current) {
        clearTimeout(mobileTransitionTimerRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll STT live transcript to the right/latest spoken words
  const transcriptScrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollLeft = transcriptScrollRef.current.scrollWidth;
    }
  }, [chat.interimTranscript]);

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
              "Selamat! Website Anda siap. Gunakan tombol Edit untuk kustomisasi konten, lalu klik Publish untuk mempublikasikan website Anda."
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

  // Smart back: selalu navigasi ke target eksplisit, JANGAN router.back().
  // router.back() melempar user ke entri history sebelumnya yang sering berupa
  // halaman stale/redirect (mis. /login via window.location.replace) → blank page.
  // `mode` membedakan jalur dashboard (/dashboard/sites/new) vs public (/create).
  const handleBack = () => {
    if (mode === "dashboard") {
      router.push("/dashboard/sites");
      return;
    }
    // mode public (/create) — kembali ke landing page.
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
    overrides: {
      businessSubType?: string;
      whatsapp?: string;
      serviceArea?: string;
      description?: string;
      mood?: string;
      language?: string;
      logoUrl?: string;
      brandPalette?: Record<string, string>;
      brandLogoThemeMode?: "light" | "dark";
    } = {}
  ) => {
    const nextBusinessSubType = overrides.businessSubType ?? chat.businessSubTypeRef.current;
    // Guard taksonomi: hanya pasangan {type, subType} kanonis yang boleh
    // mencapai payload generate — pair stale/tidak-valid jatuh ke type-only.
    const safePair = sanitizeClassificationPair(bType, nextBusinessSubType);
    const ent = chat.entityRef.current || chat.entity;
    let safeBusinessType = safePair.businessType;
    if (!safeBusinessType) {
      safeBusinessType = ent === "individual" ? "Portofolio" : "Layanan & Reservasi";
    }
    const safeBusinessSubType = safePair.businessSubType;
    const nextWhatsapp = overrides.whatsapp ?? chat.whatsappRef.current;
    const nextServiceArea = overrides.serviceArea ?? chat.serviceAreaRef.current;
    const nextDescription = overrides.description ?? chat.descriptionRef.current;
    const nextMood = overrides.mood ?? chat.moodRef.current;
    const nextLanguage = overrides.language ?? chat.siteLanguageRef.current ?? chat.siteLanguage ?? "id";
    const nextLogoUrl = overrides.logoUrl ?? chat.brandLogoUrl ?? undefined;
    const nextBrandPalette = overrides.brandPalette ?? chat.brandLogoPalette ?? undefined;

    preview.setStreamedSections({});
    preview.setSectionSources({});
    // Pertahankan palet brand di wireframe selama generate bila user memilih logo brand
    if (!nextBrandPalette) {
      preview.setStreamedDesignToken(null);
      preview.streamedTokenRef.current = null;
    }
    preview.setArrivedSections([]);
    preview.setStreamedTemplateId("");
    preview.streamedSectionsRef.current = {};
    if (!nextBrandPalette) {
      preview.streamedTokenRef.current = null;
    }
    preview.streamDoneRef.current = false;
    preview.setPreviewState("loading");
    setLeftPane("chat");
    preview.setLoadingStep(0);
    generate.didGenerateRef.current = true;

    if (device.isMobileRef.current) {
      if (mobileTransitionTimerRef.current) {
        clearTimeout(mobileTransitionTimerRef.current);
      }
      pendingMobileScreenRef.current = "loading";
      mobileTransitionTimerRef.current = setTimeout(() => {
        const target = pendingMobileScreenRef.current || "loading";
        device.setMobileScreen(target);
        pendingMobileScreenRef.current = null;
        mobileTransitionTimerRef.current = null;
      }, 1800);
    } else {
      device.setMobileScreen("loading");
    }

    chat.syncChatRefs({
      businessName: bName,
      businessType: safeBusinessType,
      businessSubType: safeBusinessSubType,
      whatsapp: nextWhatsapp,
      serviceArea: nextServiceArea,
      mood: nextMood,
    });
    if (nextDescription) chat.descriptionRef.current = nextDescription;

    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify({
        businessName: bName, businessType: safeBusinessType, businessSubType: safeBusinessSubType,
        description: nextDescription || "",
        whatsapp: nextWhatsapp || "", service_area: nextServiceArea || "", mood: nextMood || "",
        language: nextLanguage,
        ...(nextLogoUrl ? { logo_url: nextLogoUrl } : {}),
        ...(nextBrandPalette ? { brandPalette: nextBrandPalette, brandLogoThemeMode: overrides.brandLogoThemeMode ?? chat.brandLogoThemeMode } : {}),
      }));
    } catch (storageErr) {
      console.warn("[wizard] storage quota exceeded saving pending draft", storageErr);
    }

    // Biarkan backend AI men-generate token desain lengkap (tipografi, radius, layout, mood).
    // Palet warna brand akan digabungkan di klien lewat onDesignToken dan final merge.
    const initialToken = initialDesignTokenRef.current ?? undefined;

    await generate.startStream({
      business_name: bName, business_type: safeBusinessType, business_sub_type: safeBusinessSubType || undefined,
      whatsapp: nextWhatsapp || "", service_area: nextServiceArea || "",
      description: nextDescription || undefined, mood: nextMood || undefined,
      language: nextLanguage,
      design_token: initialToken,
      logo_url: nextLogoUrl || undefined,
      story: nextDescription || undefined,
      tagline: undefined,
      proof: undefined,
      // v2 fields: prefer direct chat state (archetype/industryId from classify v2),
      // fall back to derivation from v1 type/subType for old FE compatibility.
      ...(() => {
        const arch = chat.archetypeRef.current ||
          (!safePair.businessType ? (ent === "individual" ? "portfolio_individual" : "booking_service") : undefined);
        const iid = chat.industryIdRef.current;
        const custom = chat.industryCustom || (!iid && safeBusinessSubType ? safeBusinessSubType : undefined);
        const base = (arch || iid)
          ? { archetype: arch || undefined, industry_id: iid || undefined, industry_custom: custom }
          : enrichGeneratePayloadV2({ business_type: safeBusinessType, business_sub_type: safeBusinessSubType });
        const explicitEntity = chat.entitySourceRef.current === "user" ? ent : undefined;
        return { ...base, entity: explicitEntity || undefined };
      })(),
    });
  };

  const handleGenerate = async (
    bName = chat.businessName,
    bType = chat.businessType,
    overrides: { businessSubType?: string; whatsapp?: string; serviceArea?: string; description?: string; mood?: string; language?: string; logoUrl?: string; brandPalette?: Record<string, string> } = {}
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

  const handleSelectCustomIndustry = (text: string) => {
    const clean = text.replace(/<[^>]*>?/gm, "").trim().slice(0, 80); // sama dengan batas server
    if (!clean) return;
    const fallbackArch = chat.entity === "individual" ? "portfolio_individual" : "booking_service";
    const fallbackType = chat.entity === "individual" ? "Portofolio" : "Layanan & Reservasi";
    chat.setIndustryId("");
    chat.industryIdRef.current = "";
    chat.setIndustryCustom(clean);
    chat.setBusinessSubType(clean);   // label tampil di bubble dan jalur v1 yang tersisa
    if (!chat.businessType) {
      chat.setBusinessType(fallbackType);
      chat.businessTypeRef.current = fallbackType;
    }
    if (!chat.archetypeRef.current) {
      chat.setArchetype(fallbackArch);
      chat.archetypeRef.current = fallbackArch;
      chat.setEntityState((prev) => nextEntityFromArchetype(prev, fallbackArch));
    }
    // lanjut ke pemilihan bahasa seperti handleSelectSubType
    chat.setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: clean },
    ]);
    chat.continueToLanguage();
  };

  const handleSelectMood = (mood: string) => {
    chat.handleSelectMood(mood, () => {
      // onGenerate is deferred — called via handleStartGeneration after brand-logo step
    });
  };

  const handleStartGeneration = () => {
    preview.setRegenCount(0);
    preview.setHasUnsavedEdits(false);
    generate.didGenerateRef.current = true;
    initialDesignTokenRef.current = null;
    chat.handleStartGeneration((name, type, overrides) => {
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
      isSavingRef.current = false;
      const contentToSave = preview.previewData?.content || preview.streamedSections;
      const tokenToSave = preview.previewData?.design_token || preview.streamedDesignToken;
      const templateIdToSave = preview.previewData?.template_id || preview.streamedTemplateId || (preview.streamedDesignToken as any)?.template_id || selectTemplate(chat.businessSubType || chat.businessType);

      try {
        localStorage.setItem(PENDING_KEY, JSON.stringify({
          businessName: chat.businessName,
          businessType: chat.businessType,
          businessSubType: chat.businessSubType,
          description: chat.description,
          whatsapp: chat.whatsapp || "",
          service_area: chat.serviceArea || "",
          mood: chat.mood || "",
          language: chat.siteLanguageRef.current ?? chat.siteLanguage ?? "id",
          templateId: templateIdToSave,
          previewContent: contentToSave,
          previewDesignToken: tokenToSave,
          logo_url: chat.brandLogoUrl || undefined,
          brandPalette: chat.brandLogoPalette || undefined,
          brandLogoThemeMode: chat.brandLogoThemeMode || undefined,
          savedAt: Date.now(),
        }));
        localStorage.setItem("webjoz_login_redirect", "/create?action=save");
      } catch { /* storage quota */ }

      if (onNeedAuth) {
        onNeedAuth();
      } else {
        router.push(`/login?redirect=${encodeURIComponent("/create?action=save")}`);
      }
      return;
    }

    try {
      let tenantId: number | string | null = activeTenantId;
      if (mode === "public" && resolveBusinessTenant) {
        tenantId = await resolveBusinessTenant(chat.businessName);
      } else if (!tenantId && mode === "public" && createTenant) {
        const slug = generateSlug(chat.businessName);
        const created = await createTenant(chat.businessName, slug);
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
        let logoForSave = chat.brandLogoUrl;
        if (logoForSave?.startsWith("data:")) {
          try {
            const blob = await (await fetch(logoForSave)).blob();
            logoForSave = await uploadImageFile(
              new File([blob], "brand-logo", { type: blob.type || "image/png" }),
              { maxWidth: 512, maxHeight: 512 }
            );
          } catch (uploadErr) {
            console.error("[wizard] failed to upload logo to storage before save", uploadErr);
            logoForSave = null;
          }
        }

        // Unggah font kustom jika masih berupa data URL sebelum disimpan ke database
        let finalDesignToken = preview.previewData.design_token;
        if (finalDesignToken?.typography) {
          let headingUrl = finalDesignToken.typography.heading_font_url;
          let bodyUrl = finalDesignToken.typography.body_font_url;
          let changed = false;

          if (headingUrl?.startsWith("data:")) {
            try {
              const blob = await (await fetch(headingUrl)).blob();
              const ext = headingUrl.includes("font/woff2") ? "woff2" : headingUrl.includes("font/ttf") ? "ttf" : "woff2";
              headingUrl = await uploadFontFile(new File([blob], `heading-font.${ext}`, { type: blob.type }));
              changed = true;
            } catch (fontErr) {
              console.error("[wizard] failed to upload heading font to storage before save", fontErr);
              headingUrl = "";
              changed = true;
              pushToast("Gagal mengunggah font heading. Font kustom dikembalikan ke bawaan template.", "info");
            }
          }

          if (bodyUrl?.startsWith("data:")) {
            try {
              const blob = await (await fetch(bodyUrl)).blob();
              const ext = bodyUrl.includes("font/woff2") ? "woff2" : bodyUrl.includes("font/ttf") ? "ttf" : "woff2";
              bodyUrl = await uploadFontFile(new File([blob], `body-font.${ext}`, { type: blob.type }));
              changed = true;
            } catch (fontErr) {
              console.error("[wizard] failed to upload body font to storage before save", fontErr);
              bodyUrl = "";
              changed = true;
              pushToast("Gagal mengunggah font body. Font kustom dikembalikan ke bawaan template.", "info");
            }
          }

          if (changed) {
            finalDesignToken = {
              ...finalDesignToken,
              typography: {
                ...finalDesignToken.typography,
                heading_font_url: headingUrl,
                body_font_url: bodyUrl,
              },
            };
          }
        }

        const enrichedContent = buildFullContent(
          { content: preview.previewData.content, design_token: finalDesignToken, logo_url: logoForSave },
          chat.businessName, chat.businessSubType || chat.businessType, chat.description, chat.whatsapp
        );
        if (logoForSave && !logoForSave.startsWith("data:")) {
          if (enrichedContent.header) enrichedContent.header.logo_url = logoForSave;
          if (enrichedContent.seo) enrichedContent.seo.favicon_url = logoForSave;
        }
        await request(
          `/sites/${siteId}/content`,
          {
            method: "PUT",
            headers: { "X-Tenant-ID": tenantId.toString() },
            body: JSON.stringify({
              content: enrichedContent,
              design_token: finalDesignToken,
            }),
          },
          token
        );
      }

      localStorage.removeItem(PENDING_KEY);
      clearWizardSnapshot();
      clearCustomFontStorage();
      router.push(`/dashboard/sites/${encodeSiteId(siteId)}`);
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

    if (preview.previewData) {
      preview.setPreviewData((prev) => {
        if (!prev) return prev;
        const nextContent = { ...(prev.content || {}) };
        const nextContact = { ...(nextContent.contact || {}) };
        if (whatsapp) nextContact.phone = whatsapp;
        if (serviceArea) nextContact.address = serviceArea;
        nextContent.contact = nextContact;
        return { ...prev, content: nextContent };
      });
      preview.setHasUnsavedEdits(true);
    }
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
          inferenceResult: chat.inferenceResult,
          typeWasInferred: chat.typeWasInferred,
          // v2
          archetype: chat.archetype || undefined,
          industryId: chat.industryId || undefined,
          industryCustom: chat.industryCustom || undefined,
          entity: chat.entity || undefined,
          entitySource: chat.entitySource || undefined,
          manualPicker: chat.manualPicker,
          selectedBidang: chat.selectedBidang,
          suggestedIndustryId: chat.suggestedIndustryId || undefined,
          // Brand logo & palette
          brandLogoUrl: chat.brandLogoUrl || undefined,
          brandLogoPalette: chat.brandLogoPalette || undefined,
          brandLogoThemeMode: chat.brandLogoThemeMode || undefined,
        },
        preview: preview.previewData ? toResumePreview(preview.previewData) : undefined,
        theme: !isEmptyOverrides(themeDraft.applied)
          ? { applied: stripHeavyOverrides(themeDraft.applied) }
          : undefined,
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
    chat.inferenceResult,
    chat.typeWasInferred,
    chat.archetype,
    chat.industryId,
    chat.industryCustom,
    chat.entity,
    chat.manualPicker,
    chat.selectedBidang,
    chat.suggestedIndustryId,
    chat.brandLogoUrl,
    chat.brandLogoPalette,
    chat.brandLogoThemeMode,
    preview.previewData,
    resumeSnapshotProgress,
    themeDraft.applied,
  ]);

  const handleResume = () => {
    if (!resumeDraft) return;
    chat.hydrate(resumeDraft.chat);
    const restoredApplied = { ...(resumeDraft.theme?.applied ?? {}) };
    // Pulihkan font data URL jika tersimpan di isolated storage
    const savedCustomFonts = loadCustomFontStorage();
    if (savedCustomFonts.heading || savedCustomFonts.body) {
      restoredApplied.typography = {
        ...(restoredApplied.typography || {}),
      };
      if (savedCustomFonts.heading) {
        restoredApplied.typography.heading_font = savedCustomFonts.heading.name;
        restoredApplied.typography.heading_font_url = savedCustomFonts.heading.dataUrl;
      }
      if (savedCustomFonts.body) {
        restoredApplied.typography.body_font = savedCustomFonts.body.name;
        restoredApplied.typography.body_font_url = savedCustomFonts.body.dataUrl;
      }
    }
    themeDraft.rehydrate(restoredApplied);
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
      const restoredPair = sanitizeClassificationPair(
        resumeDraft.chat.businessType,
        resumeDraft.chat.businessSubType
      );
      const pool = getTemplatePool(restoredPair.businessType || restoredPair.businessSubType, mood);
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
          logoUrl: resumeDraft.chat.brandLogoUrl || undefined,
          brandPalette: resumeDraft.chat.brandLogoPalette || undefined,
          brandLogoThemeMode: resumeDraft.chat.brandLogoThemeMode || undefined,
        }
      );
    } else {
      // Tahap pra-preview (mis. brand-logo): pulihkan palet brand ke wireframe
      if (resumeDraft.chat.brandLogoPalette) {
        preview.setStreamedDesignToken({
          palette: resumeDraft.chat.brandLogoPalette,
          theme_mode: resumeDraft.chat.brandLogoThemeMode || "light",
        });
      }
    }
    setResumeDraft(null);
  };

  const handleStartFresh = () => {
    clearWizardSnapshot();
    clearCustomFontStorage();
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

  // One-time edu tooltips untuk action buttons + rekomendasi hint
  // — muncul sekali saat result pertama kali tampil
  React.useEffect(() => {
    if (preview.previewState !== "result") return;
    if (actionHintsShownRef.current) return;
    actionHintsShownRef.current = true;
    try {
      if (!localStorage.getItem("wiz_action_hints_seen")) {
        // Tunggu sampai success toast selesai (~6 detik) baru tampilkan hint
        setTimeout(() => {
          setShowLengkapiHint(true);
          setShowEditPublishHint(true);
          setTimeout(() => {
            setShowLengkapiHint(false);
            setShowEditPublishHint(false);
            try { localStorage.setItem("wiz_action_hints_seen", "1"); } catch { /* noop */ }
          }, 10000);
        }, 6500);
      }
    } catch { /* localStorage unavailable */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview.previewState]);

  // Rekomendasi hint — effect terpisah supaya tidak bergantung timing templatePool.
  // Di mobile, tunggu sampai user benar-benar di layar preview (mobileScreen === "preview")
  // agar popup tidak muncul saat layar chat masih aktif.
  React.useEffect(() => {
    if (preview.previewState !== "result") return;
    if (preview.templatePool.length <= 1) return;
    if (device.isMobile && device.mobileScreen !== "preview") return;
    try {
      if (!localStorage.getItem("wiz_rekomendasi_hint_seen")) {
        const hintTimer = setTimeout(() => {
          setShowRekomendasiHint(true);
          setTimeout(() => {
            setShowRekomendasiHint(false);
            try { localStorage.setItem("wiz_rekomendasi_hint_seen", "1"); } catch { /* noop */ }
          }, 6000);
        }, 1200);
        return () => clearTimeout(hintTimer);
      }
    } catch { /* localStorage unavailable */ }
  }, [preview.previewState, preview.templatePool.length, device.isMobile, device.mobileScreen]);

  return (
    <div
      className="dark fixed inset-0 md:relative flex w-screen overflow-hidden bg-[#0d0f14] md:h-screen text-foreground"
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
        {leftPane === "theme" && preview.previewState === "result" ? (
          <ThemePanel
            mood={chat.moodRef.current || chat.mood || "clean-modern"}
            theme={themeDraft}
            baseToken={baseThemeToken}
            onClose={() => setLeftPane("chat")}
          />
        ) : (
          <>
            <div className="px-5 pt-4 pb-0 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 1px 0 rgba(255,255,255,0.025)" }}>
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Left: Back button + Avatar + Title & Subtitle */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleBack}
                aria-label="Kembali"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white transition-all hover:border-white/30 hover:bg-white/15 active:scale-95 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>

              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-xs">
                  <SparkleGenAI className="w-[22px] h-[22px]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#111318]" />
              </div>

              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm leading-tight truncate">Joz-AI</span>
                  <span className="text-[9px] font-bold tracking-wider text-white/90 bg-white/10 border border-white/20 px-1.5 py-0.5 rounded-md leading-none">
                    BETA
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 leading-tight truncate">
                  Webjoz Assistant
                </span>
              </div>
            </div>

            {/* Right: Mobile preview link + Help */}
            <div className="flex items-center gap-2 shrink-0">
              {device.isMobile && preview.previewState === "result" && (
                <button
                  type="button"
                  onClick={() => device.setMobileScreen("preview")}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-200 text-[10px] font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Preview &rarr;
                </button>
              )}

              {/* Help Button */}
              <Link
                href="/help"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white hover:text-white hover:bg-white/15 hover:border-white/30 transition-all cursor-pointer shadow-xs active:scale-95"
                title={t("landing.navHelp", "Pusat Bantuan")}
                aria-label="Pusat Bantuan"
              >
                <HelpCircle className="h-[18px] w-[18px] text-white stroke-[2.2]" />
              </Link>
            </div>
          </div>

          {/* Step Progress Bar — 4 Unified Logical Steps */}
          <WizardStepProgressBar chatStage={chat.chatStage} />
        </div>

        <WizardResumeBanner
          resumeDraft={resumeDraft}
          resumeSavedText={resumeSavedText}
          handleResume={handleResume}
          handleStartFresh={handleStartFresh}
          t={t}
        />

        <div className={`flex-1 overflow-y-auto px-4 py-5 space-y-4 ${device.isMobile ? (device.mobileScreen === "preview" ? "pb-28" : "pb-6") : "md:pb-8"}`}>
          {chat.messages.map((m) => {
            if (m.widget === "name-confirm") {
              const isLocked = !chat.awaitingNameConfirm;
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => !isLocked && chat.handleConfirmName(true)}
                      disabled={isLocked}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 transition-all hover:bg-slate-100 active:scale-95 disabled:opacity-40 cursor-pointer shadow-xs"
                    >
                      <span>✓ {t("dashboard.wizard.nameConfirmYes", "Ya")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => !isLocked && chat.handleConfirmName(false)}
                      disabled={isLocked}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 border border-white/10 transition-all hover:border-white/20 hover:text-white hover:bg-white/5 active:scale-95 disabled:opacity-40 cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <span>✎ {t("dashboard.wizard.nameConfirmChange", "Ganti")}</span>
                    </button>
                  </div>
                </div>
              );
            }

            if (m.widget === "inference-confirm-card") {
              return (
                <InferenceConfirmCard
                  key={m.id}
                  chat={chat}
                  taxonomyV2={taxonomyV2}
                  wizardLang={wizardLang}
                  uiLang={uiLang}
                  onChangeCategory={() => {
                    chat.setMessages((prev) => prev.filter((msg) => msg.id !== m.id));
                    chat.showManualPicker();
                  }}
                  t={t}
                />
              );
            }
            if (m.widget === "inference-confirm") {
              // Lock setelah user memilih bahasa
              const isLocked = !!chat.siteLanguage;
              const inferredType = chat.businessType;
              const inferredSubType = chat.businessSubType;

              // v2: when industry_id is known, build a single-chip list with the
              // catalog label so the user sees the resolved industry name.
              const v2IndustryId = chat.industryId;
              let availableSubTypes = inferredType ? (dynamicSubTypes[inferredType] ?? []) : [];
              let v2IndustryChip: { value: string; label: string; emoji?: string } | null = null;
              if (v2IndustryId && taxonomyV2) {
                const entry = taxonomyV2.groups
                  .flatMap((g) => g.industries)
                  .find((i) => i.id === v2IndustryId);
                if (entry) {
                  const lbl = uiLang === "en" ? (entry.label_en || entry.label) : (entry.label_id || entry.label);
                  v2IndustryChip = { value: v2IndustryId, label: lbl, emoji: entry.emoji };
                  // Supplement with catalog industries for same archetype/group so user can switch
                  const sameGroup = taxonomyV2.groups.find((g) =>
                    g.industries.some((i) => i.id === v2IndustryId)
                  );
                  if (sameGroup) {
                    availableSubTypes = sameGroup.industries.map((i) => ({
                      value: i.id,
                      label: uiLang === "en" ? (i.label_en || i.label) : (i.label_id || i.label),
                      emoji: i.emoji ?? "🏷️",
                    }));
                  }
                }
              }

              // Category label for breadcrumb
              const inferredCategoryLabel = v2IndustryChip
                ? (taxonomyV2?.groups.find((g) => g.industries.some((i) => i.id === v2IndustryId))?.label)
                : dynamicBusinessTypes.find((bt) => bt.value === inferredType)?.label;

              // Reorder: chip terpilih tampil pertama
              const selectedChipValue = v2IndustryId || inferredSubType;
              const orderedSubTypes = selectedChipValue
                ? [
                    ...availableSubTypes.filter((s) => s.value === selectedChipValue),
                    ...availableSubTypes.filter((s) => s.value !== selectedChipValue),
                  ]
                : availableSubTypes;

              return (
                <InferenceConfirmWidget
                  key={m.id}
                  isLocked={isLocked}
                  orderedSubTypes={orderedSubTypes}
                  selectedSubType={chat.industryId || inferredSubType}
                  categoryLabel={inferredCategoryLabel}
                  onConfirmWithSubType={(selectedValue) => {
                    // v2: if selected value looks like an industry_id (contains "."),
                    // update industryId state; otherwise treat as v1 sub_type.
                    if (selectedValue.includes(".")) {
                      chat.setIndustryId(selectedValue);
                      chat.industryIdRef.current = selectedValue;
                    } else {
                      chat.setBusinessSubType(selectedValue);
                    }
                    // Route through the canonical doInjectLanguage stored in the ref.
                    const doInject = chat.inferenceAutoConfirmRef.current;
                    chat.inferenceAutoConfirmRef.current = null;
                    if (doInject) {
                      doInject(selectedValue.includes(".") ? "" : selectedValue);
                    } else {
                      if (!selectedValue.includes(".")) chat.setBusinessSubType(selectedValue);
                    }
                  }}
                  onUnlockChips={() => {
                    chat.inferenceAutoConfirmRef.current = null;
                  }}
                  onChangeCategory={() => handleConfirmInference(false)}
                  t={t}
                />
              );
            }

            if (m.widget === "subtype-chips") {
              const isLocked = chat.chatStage === "language" || chat.chatStage === "mood" || chat.chatStage === "done";
  const selectedBidang = chat.selectedBidang;
  const setSelectedBidang = chat.setSelectedBidang;

  // Gunakan archetypeRef (sinkron) bukan chat.archetype (async state) agar
  // widget yang dirender di siklus yang sama dengan setArchetype tetap mendapat nilai terbaru.
  const currentArchetype = chat.archetypeRef.current || chat.archetype;
  const hintId = chat.industryIdRef.current || chat.industryId || chat.suggestedIndustryId;

  // Hitung kandidat industri dari archetype (sebelum memutuskan perlu step Bidang atau tidak)
  const archetypeIndustries = (currentArchetype && taxonomyV2)
    ? taxonomyV2.groups.flatMap((g) => g.industries).filter((i) => i.archetype === currentArchetype)
    : [];
  const v1SubTypes = chat.businessType ? (dynamicSubTypes[chat.businessType] ?? []) : [];
  const totalCandidates = taxonomyV2
    ? archetypeIndustries.length || v1SubTypes.length
    : v1SubTypes.length;

  // Threshold: ≥8 kandidat pakai step Bidang; <8 langsung tampilkan chip.
  // Bila belum ada archetype (belum pilih kategori), selalu tampilkan step Bidang agar tidak kosong.
  const BIDANG_THRESHOLD = 8;
  const needsBidangStep = !!taxonomyV2 && (chat.manualPicker || !currentArchetype || totalCandidates >= BIDANG_THRESHOLD);

  // Bila archetype diketahui dan belum ada selectedBidang, pre-select Bidang yang
  // mengandung industri saran AI (industryId) atau grup yang punya industri archetype terbanyak.
  // (plain function — tidak boleh pakai useMemo di dalam map/render expression)
  const getEffectiveSelectedBidang = (): string | null => {
    if (selectedBidang === "") return null;          // pengguna minta grid penuh
    if (selectedBidang) return selectedBidang;
    if (!needsBidangStep || !taxonomyV2) return null;
    // Pre-select hanya bila ada sinyal jelas: industryId atau suggestedIndustryId dari AI
    if (hintId) {
      const suggestedGroup = taxonomyV2.groups.find((g) =>
        g.industries.some((i) => i.id === hintId)
      );
      if (suggestedGroup) return suggestedGroup.id;
    }
    // Tanpa industryId: tidak ada sinyal cukup — tampilkan step Bidang penuh
    return null;
  };
  const effectiveSelectedBidang = getEffectiveSelectedBidang();

  const showBidangStep = needsBidangStep && !effectiveSelectedBidang && !isLocked;
  const filteredGroups = taxonomyV2
    ? groupsForEntity(taxonomyV2.groups, pickerEntity)
    : [];

  const bidangChips = filteredGroups.map((g) => ({
    value: g.id,
    label: uiLang === "en" ? (g.label_en || g.label) : (g.label_id || g.label),
    emoji: g.emoji ?? "🏷️",
  }));
              // v2: susun subTypes berdasarkan selectedBidang (grup terpilih) atau archetype.
              // Bila showBidangStep=true, tidak ada chip spesialisasi yang boleh tampil.
              let subTypes: Array<{ value: string; label: string; emoji?: string; kind?: "v1" | "v2"; archetype?: string }> = [];
              let isFallbackCategory = false;
              if (!showBidangStep) {
                if (taxonomyV2) {
                  const chipResult = buildSubTypeChips({
                    groups: taxonomyV2.groups,
                    bidangId: effectiveSelectedBidang,
                    entity: pickerEntity,
                    archetypeIndustries: !needsBidangStep && currentArchetype ? archetypeIndustries : undefined,
                    hintId,
                    lang: uiLang,
                  });
                  subTypes = chipResult.items;
                  isFallbackCategory = chipResult.fallback;
                }
                if (subTypes.length === 0) {
                  subTypes = chat.businessType ? (dynamicSubTypes[chat.businessType] ?? []) : [];
                }
              }
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                  {chat.typeWasInferred && (
                    <button
                      type="button"
                      onClick={() => {
                        chat.setTypeWasInferred(false);
                        chat.setBusinessType("");
                        chat.setBusinessSubType("");
                        chat.setSelectedBidang(null);
                        chat.setMessages((prev) => prev.filter((msg) => msg.id !== m.id));
                        chat.showManualPicker();
                      }}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline mb-2 inline-block transition-colors"
                    >
                      {t("dashboard.wizard.notThisType", "Bukan ini? Pilih kategori lain")}
                    </button>
                  )}

  {showBidangStep && (
    <>
      <div className="grid grid-cols-2 gap-1.5 mb-2.5">
        <button
          type="button"
          onClick={() => {
            chat.setEntityState((prev) => toggleUserEntity(prev, "individual"));
            chat.setSelectedBidang(null);
          }}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            pickerEntity === "individual"
              ? "bg-white text-slate-950 border-white shadow-sm font-semibold"
              : "border-slate-600/60 bg-white/[0.06] text-slate-200 hover:border-slate-400/60 hover:text-white hover:bg-white/[0.10]"
          }`}
        >
          <User className={`w-3.5 h-3.5 shrink-0 ${pickerEntity === "individual" ? "text-slate-950" : "text-slate-400"}`} />
          <span>{t("dashboard.wizard.entityIndividual", "Perorangan")}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            chat.setEntityState((prev) => toggleUserEntity(prev, "organization"));
            chat.setSelectedBidang(null);
          }}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            pickerEntity === "organization"
              ? "bg-white text-slate-950 border-white shadow-sm font-semibold"
              : "border-slate-600/60 bg-white/[0.06] text-slate-200 hover:border-slate-400/60 hover:text-white hover:bg-white/[0.10]"
          }`}
        >
          <Building2 className={`w-3.5 h-3.5 shrink-0 ${pickerEntity === "organization" ? "text-slate-950" : "text-slate-400"}`} />
          <span>{t("dashboard.wizard.entityOrganization", "Bisnis / Organisasi")}</span>
        </button>
      </div>

      <p className="text-[10px] font-semibold text-slate-400 mb-2 px-0.5">{t("dashboard.wizard.selectSector", "Pilih bidang usaha:")}</p>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
      {bidangChips.map((bg) => {
        const BidangIcon = BIDANG_ICONS[bg.value] ?? Tag;
        return (
          <button
            key={bg.value}
            type="button"
            onClick={() => setSelectedBidang(bg.value)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border border-slate-600/60 bg-white/[0.06] text-slate-200 hover:border-slate-400/60 hover:text-white hover:bg-white/[0.10] transition-all cursor-pointer"
          >
            <BidangIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="text-left leading-tight">{bg.label}</span>
          </button>
        );
      })}
    </div>
    </>
  )}

  {effectiveSelectedBidang && !isLocked && needsBidangStep && (() => {
    const bg = bidangChips.find((b) => b.value === effectiveSelectedBidang);
    return (
      <div className="flex items-center gap-2 mb-2 animate-in fade-in duration-200">
        {bg && (
          <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
            {(() => { const I = BIDANG_ICONS[bg.value] ?? Tag; return <I className="w-3 h-3 text-slate-400" />; })()}
            {bg.label}
          </span>
        )}
        <button
          type="button"
          onClick={() => setSelectedBidang("")}
          className="text-[10px] text-slate-500 hover:text-slate-300 underline"
        >
          {t("dashboard.wizard.changeBidang", "Bidang lain →")}
        </button>
      </div>
    );
  })()}

  <div className="flex flex-wrap gap-1.5">
                    {subTypes
                      .filter((st) => {
                        if (isLocked) return false;
                        // subTypes sudah kosong bila showBidangStep=true — filter ini hanya
                        // untuk kasus terpilih (selectedBidang) vs tampil semua (<threshold/v1)
                        return true;
                      })
                      .map((st) => {
                      const isSubSelected = chat.industryId === st.value || chat.businessSubType === st.value;
                      const SubIcon = SUB_TYPE_ICONS[st.value] ?? Tag;
                      const isV2Id = st.kind === "v2" || st.value.includes(".");
                      const labelText = st.label || (isV2Id
                        ? getIndustryLabel(st.value)
                        : t(`dashboard.wizard.subtypes.${st.value}`, st.label));
                      return (
                        <button
                          key={st.value}
                          type="button"
                          title={labelText}
                          onClick={() => {
                            if (isLocked) return;
                            if (isV2Id) {
                              // v2 chip: update industryId + set archetype from taxonomy
                              chat.setIndustryId(st.value);
                              chat.industryIdRef.current = st.value;
                              if (taxonomyV2) {
                                const entry = taxonomyV2.groups.flatMap(g => g.industries).find(i => i.id === st.value);
                                if (entry) {
                                  chat.setArchetype(entry.archetype);
                                  chat.archetypeRef.current = entry.archetype;
                                  chat.setEntityState((prev) => nextEntityFromArchetype(prev, entry.archetype));
                                }
                              }
                              handleSelectSubType(labelText);
                            } else {
                              // v1 chip
                              chat.setIndustryId("");
                              chat.industryIdRef.current = "";
                              handleSelectSubType(st.value);
                            }
                          }}
                          disabled={isLocked}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer active:scale-95 max-w-full ${isSubSelected ? "text-white border-primary/60 bg-primary/20" : "text-slate-300 border-white/[0.08] bg-white/[0.04] hover:border-white/20 hover:text-white hover:bg-white/[0.08]"}`}
                        >
                          <SubIcon className={`w-3 h-3 shrink-0 ${isSubSelected ? "text-primary" : "text-slate-400"}`} />
                          <span className="text-left">{labelText}</span>
                          {isSubSelected && <span className="text-primary text-[10px] shrink-0">✓</span>}
                        </button>
                      );
                    })}

                    {!isLocked && (!customSubTypeOpen ? (
                      <button
                        type="button"
                        onClick={() => setCustomSubTypeOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-dashed border-white/20 text-slate-400 hover:border-white/40 hover:text-white transition-all cursor-pointer"
                      >
                        <span>+ {t("dashboard.wizard.otherSubType", "Lainnya")}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          maxLength={60}
                          value={customSubTextInput}
                          onChange={(e) => setCustomSubTextInput(e.target.value)}
                          placeholder={t("dashboard.wizard.otherSubTypePlaceholder", "Tulis sub-kategori spesifik...")}
                          className="px-2.5 py-1 text-xs bg-black/40 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const clean = customSubTextInput.replace(/<[^>]*>?/gm, "").trim().slice(0, 60);
                              if (clean) {
                                handleSelectCustomIndustry(clean);
                                setCustomSubTypeOpen(false);
                                setCustomSubTextInput("");
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          aria-label="Submit"
                          onClick={() => {
                            const clean = customSubTextInput.replace(/<[^>]*>?/gm, "").trim().slice(0, 80);
                            if (clean) {
                              handleSelectCustomIndustry(clean);
                              setCustomSubTypeOpen(false);
                              setCustomSubTextInput("");
                            }
                          }}
                          className="h-7 w-7 flex items-center justify-center bg-white text-slate-950 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer shrink-0 shadow-sm"
                        >
                          <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {isFallbackCategory && !isLocked && (
                    <p className="text-[11px] text-amber-400/80 italic mt-1.5 px-0.5">
                      {uiLang === "en"
                        ? "No individual options yet for this sector; showing all available options."
                        : "Belum ada versi perorangan untuk bidang ini; kami tampilkan semua pilihan."}
                    </p>
                  )}
                </div>
              );
            }

            if (m.widget === "language-chips") {
              const isLocked = chat.chatStage !== "language";
              // Ketika sudah dipilih (locked), sembunyikan widget — user bubble sudah cukup sebagai konfirmasi.
              if (isLocked && chat.siteLanguage) return null;
              const langs = [
                { value: "id" as const, label: "Indonesia", flag: "🇮🇩" },
                { value: "en" as const, label: "English", flag: "🇬🇧" },
              ];
              const visibleLangs = langs;

              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-2">
                  <div className="flex gap-2">
                    {visibleLangs.map((lang) => {
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
              // Ketika sudah dipilih (locked), sembunyikan widget — user bubble sudah cukup sebagai konfirmasi.
              if (isLocked && chat.mood) return null;
              const visibleMoods = MOOD_OPTIONS;
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {visibleMoods.map((mo) => {
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
                        "clean-modern":  { icon: <SparkleIcon  className="w-4 h-4" />, bg: "bg-blue-500/15",    text: "text-blue-400",    glow: "shadow-blue-500/20" },
                        "warm-earthy":   { icon: <Leaf      className="w-4 h-4" />, bg: "bg-emerald-600/15", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
                        "bold-vibrant":  { icon: <Palette   className="w-4 h-4" />, bg: "bg-orange-500/15",  text: "text-orange-400",  glow: "shadow-orange-500/20" },
                        "dark-premium":  { icon: <Crown     className="w-4 h-4" />, bg: "bg-yellow-500/15",  text: "text-yellow-400",  glow: "shadow-yellow-500/20" },
                        "bold-dark":     { icon: <Zap       className="w-4 h-4" />, bg: "bg-red-500/15",     text: "text-red-400",     glow: "shadow-red-500/20" },
                        "retro":         { icon: <Hourglass className="w-4 h-4" />, bg: "bg-amber-600/15",   text: "text-amber-400",   glow: "shadow-amber-600/20" },
                        "futuristic":    { icon: <Bot       className="w-4 h-4" />, bg: "bg-cyan-500/15",    text: "text-cyan-400",    glow: "shadow-cyan-500/20" },
                      };
                      const cfg = moodIconMap[mo.value] ?? { icon: <SparkleIcon className="w-4 h-4" />, bg: "bg-white/10", text: "text-slate-300", glow: "" };

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
                          {/* Icon kiri dengan badge centang tepat di atas icon */}
                          <div className="relative shrink-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow ${cfg.bg} ${cfg.text} ${cfg.glow} transition-transform duration-200 ${isSelected ? "scale-105" : "group-hover:scale-105"}`}>
                              {cfg.icon}
                            </div>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-[#16191E]">
                                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Nama kanan */}
                          <span className="text-[12px] sm:text-[13px] font-semibold text-white leading-snug flex-1 min-w-0">
                            {translatedMoodLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {!isLocked && (
                    <p className="text-[10px] text-slate-500 px-0.5">{t("dashboard.wizard.chooseMoodHint", "Pilih karakter visual yang cocok untuk brand Anda")}</p>
                  )}
                </div>
              );
            }

            if (m.widget === "brand-logo") {
              const isLocked = chat.chatStage !== "brand-logo";
              return (
                <BrandLogoWidget
                  key={m.id}
                  isLocked={isLocked}
                  logoUrl={chat.brandLogoUrl}
                  palette={chat.brandLogoPalette as any}
                  mood={chat.moodRef.current || chat.mood}
                  onLogoSelected={(url, extracted, _fileName, themeMode) => {
                    const paletteMap: Record<string, string> = {
                      primary: extracted.primary,
                      accent: extracted.accent,
                      background: extracted.background,
                      surface: extracted.surface,
                      text: extracted.text,
                    };
                    chat.setBrandLogo(url, paletteMap, themeMode);
                    preview.setStreamedDesignToken((prev: any) => ({
                      ...(prev || {}),
                      palette: { ...(prev?.palette || {}), ...paletteMap },
                      theme_mode: themeMode,
                    }));
                  }}
                  onLogoRemoved={() => {
                    chat.clearBrandLogo();
                  }}
                  onSubmit={handleStartGeneration}
                />
              );
            }

            if (m.widget === "type-chips") {
              const isLocked = chat.chatStage === "language" || chat.chatStage === "mood" || chat.chatStage === "done";
              // Gunakan ref untuk nilai sinkron
              const tcArchetype = chat.archetypeRef.current || chat.archetype;
              const tcIndustryId = chat.industryIdRef.current || chat.industryId;
              // Hitung kandidat untuk threshold
              const tcArchIndustries = (tcArchetype && taxonomyV2)
                ? taxonomyV2.groups.flatMap((g) => g.industries).filter((i) => i.archetype === tcArchetype)
                : [];
              const tcV1SubTypes = chat.businessType ? (dynamicSubTypes[chat.businessType] ?? []) : [];
              const tcTotal = taxonomyV2 ? (tcArchIndustries.length || tcV1SubTypes.length) : tcV1SubTypes.length;
              const tcNeedsBidang = !!taxonomyV2 && tcTotal >= 8;
              // selectedBidang dari state (diset saat user klik chip Bidang di widget ini)
              const tcSelectedBidang = chat.selectedBidang;
              // Pre-select Bidang dari industryId saran AI
              const tcEffectiveBidang = (() => {
                if (tcSelectedBidang === "") return null;
                if (tcSelectedBidang) return tcSelectedBidang;
                if (!tcNeedsBidang || !taxonomyV2) return null;
                if (tcArchetype && tcIndustryId) {
                  const g = taxonomyV2.groups.find((g) => g.industries.some((i) => i.id === tcIndustryId));
                  if (g) return g.id;
                }
                return null;
              })();
              const tcShowBidang = tcNeedsBidang && !tcEffectiveBidang && !isLocked;
              const tcFilteredGroups = taxonomyV2
                ? groupsForEntity(taxonomyV2.groups, pickerEntity)
                : [];
              const tcBidangChips = tcFilteredGroups.map((g) => ({
                value: g.id,
                label: uiLang === "en" ? (g.label_en || g.label) : (g.label_id || g.label),
                emoji: g.emoji ?? "🏷️",
              }));
              // Susun subTypes — kosong bila tcShowBidang
              let subTypes: Array<{ value: string; label: string; emoji?: string; kind?: string }> | null = null;
              if (!tcShowBidang) {
                if (taxonomyV2) {
                  const chipRes = buildSubTypeChips({
                    groups: taxonomyV2.groups,
                    bidangId: tcEffectiveBidang,
                    entity: pickerEntity,
                    archetypeIndustries: !tcNeedsBidang && tcArchetype ? tcArchIndustries : undefined,
                    hintId: tcIndustryId,
                    lang: uiLang,
                  });
                  if (chipRes.items.length > 0) {
                    subTypes = chipRes.items;
                  }
                }
                if (!subTypes) {
                  subTypes = chat.businessType ? (dynamicSubTypes[chat.businessType] ?? null) : null;
                }
              }
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-2.5">
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {(isLocked && chat.businessType
                      ? dynamicBusinessTypes.filter((bt) => bt.value === chat.businessType)
                      : dynamicBusinessTypes
                    ).map((bt) => {
                      const isSelected = chat.businessType === bt.value;
                      const categoryKeyMap: Record<string, { label: string; desc: string }> = {
                        "Kuliner": { label: "kuliner", desc: "kulinerDesc" },
                        "Toko": { label: "tokoUmkm", desc: "tokoUmkmDesc" },
                        "Toko & UMKM": { label: "tokoUmkm", desc: "tokoUmkmDesc" },
                        "Toko Online & Retail": { label: "tokoUmkm", desc: "tokoUmkmDesc" },
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
                        "Toko Online & Retail": <ShoppingBag className="w-3.5 h-3.5" />,
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
                            {categoryIconMap[bt.value] || <SparkleIcon className="w-3.5 h-3.5" />}
                          </span>
                          <span>{translatedLabel}</span>
                          {isSelected && (
                            <span className="text-primary text-xs font-bold shrink-0">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {(subTypes || tcShowBidang) && !isLocked && (
                    <div ref={chat.subTypeRef} className="animate-in fade-in slide-in-from-bottom-1 duration-300">

                      {tcShowBidang && (
                        <>
                          <p className="text-[10px] font-semibold text-slate-400 mb-2 px-0.5">{t("dashboard.wizard.selectSector", "Pilih bidang usaha:")}</p>
                          <div className="grid grid-cols-2 gap-1.5 mb-3">
                            {tcBidangChips.map((bg) => {
                              const BidangIcon = BIDANG_ICONS[bg.value] ?? Tag;
                              return (
                                <button
                                  key={bg.value}
                                  type="button"
                                  onClick={() => chat.setSelectedBidang(bg.value)}
                                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border border-slate-600/60 bg-white/[0.06] text-slate-200 hover:border-slate-400/60 hover:text-white hover:bg-white/[0.10] transition-all cursor-pointer"
                                >
                                  <BidangIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                  <span className="text-left leading-tight">{bg.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                      {tcEffectiveBidang && tcNeedsBidang && (() => {
                        const bg = tcBidangChips.find((b) => b.value === tcEffectiveBidang);
                        return (
                          <div className="flex items-center gap-2 mb-2 animate-in fade-in duration-200">
                            {bg && <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">{(() => { const I = BIDANG_ICONS[bg.value] ?? Tag; return <I className="w-3 h-3 text-slate-400" />; })()}{bg.label}</span>}
                            <button
                              type="button"
                              onClick={() => chat.setSelectedBidang("")}
                              className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                            >
                              {t("dashboard.wizard.changeBidang", "Bidang lain →")}
                            </button>
                          </div>
                        );
                      })()}
                      <div className="flex flex-wrap gap-1.5">
                        {(subTypes ?? []).map((st) => {
                          const isSubSelected = chat.industryId === st.value || chat.businessSubType === st.value;
                          const isV2Id = st.kind === "v2" || st.value.includes(".");
                          const SubIcon = SUB_TYPE_ICONS[st.value] ?? Tag;
                          const labelText = st.label || (isV2Id
                            ? getIndustryLabel(st.value)
                            : t(`dashboard.wizard.subtypes.${st.value}`, st.label));
                          return (
                            <button
                              key={st.value}
                              type="button"
                              title={labelText}
                              onClick={() => {
                                if (isLocked) return;
                                if (isV2Id) {
                                  chat.setIndustryId(st.value);
                                  chat.industryIdRef.current = st.value;
                                  if (taxonomyV2) {
                                    const entry = taxonomyV2.groups.flatMap(g => g.industries).find(i => i.id === st.value);
                                    if (entry) {
                                      chat.setArchetype(entry.archetype);
                                      chat.archetypeRef.current = entry.archetype;
                                      chat.setEntityState((prev) => nextEntityFromArchetype(prev, entry.archetype));
                                    }
                                  }
                                  handleSelectSubType(labelText);
                                } else {
                                  chat.setIndustryId("");
                                  chat.industryIdRef.current = "";
                                  handleSelectSubType(st.value);
                                }
                              }}
                              disabled={isLocked}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer active:scale-95 max-w-full ${isSubSelected ? "text-white border-primary/60 bg-primary/20" : "text-slate-300 border-white/[0.08] bg-white/[0.04] hover:border-white/20 hover:text-white hover:bg-white/[0.08]"}`}
                            >
                              <SubIcon className={`w-3 h-3 shrink-0 ${isSubSelected ? "text-primary" : "text-slate-400"}`} />
                              <span className="text-left">{labelText}</span>
                              {isSubSelected && <span className="text-primary text-[10px] shrink-0">✓</span>}
                            </button>
                          );
                        })}

                        {!isLocked && (!customSubTypeOpen ? (
                          <button
                            type="button"
                            onClick={() => setCustomSubTypeOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-dashed border-white/20 text-slate-400 hover:border-white/40 hover:text-white transition-all cursor-pointer"
                          >
                            <span>+ {t("dashboard.wizard.otherSubType", "Lainnya")}</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              maxLength={60}
                              value={customSubTextInput}
                              onChange={(e) => setCustomSubTextInput(e.target.value)}
                              placeholder={t("dashboard.wizard.otherSubTypePlaceholder", "Tulis sub-kategori spesifik...")}
                              className="px-2.5 py-1 text-xs bg-black/40 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const clean = customSubTextInput.replace(/<[^>]*>?/gm, "").trim().slice(0, 60);
                                  if (clean) {
                                    handleSelectCustomIndustry(clean);
                                    setCustomSubTypeOpen(false);
                                    setCustomSubTextInput("");
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              aria-label="Submit"
                              onClick={() => {
                                const clean = customSubTextInput.replace(/<[^>]*>?/gm, "").trim().slice(0, 60);
                                if (clean) {
                                  handleSelectCustomIndustry(clean);
                                  setCustomSubTypeOpen(false);
                                  setCustomSubTextInput("");
                                }
                              }}
                              className="h-7 w-7 flex items-center justify-center bg-white text-slate-950 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer shrink-0 shadow-sm"
                            >
                              <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {chat.businessSubType && (
                        <button
                          type="button"
                          onClick={() => handleSelectSubType(chat.businessSubType)}
                          className="mt-2.5 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white border transition-all hover:bg-white/5 active:scale-95"
                          style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}
                        >
                          {t("dashboard.wizard.btnContinueType", "Lanjut dengan jenis ini →")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            const messageText =
              m.id === "init" && chat.chatStage === "name" && chat.isInitialTyping && chat.initialWordCount > 0
                ? chat.initialMessageWords.slice(0, chat.initialWordCount).join(" ")
                : m.text;

            // Mood icon mapping — warna solid supaya kontras di atas bubble putih (bg-primary)
            const moodIconMapMsg: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
              "clean-modern": { icon: <SparkleIcon  className="w-3.5 h-3.5" />, bg: "bg-blue-500",    text: "text-white" },
              "warm-earthy":  { icon: <Leaf      className="w-3.5 h-3.5" />, bg: "bg-emerald-600", text: "text-white" },
              "bold-vibrant": { icon: <Palette   className="w-3.5 h-3.5" />, bg: "bg-orange-500",  text: "text-white" },
              "dark-premium": { icon: <Crown     className="w-3.5 h-3.5" />, bg: "bg-yellow-500",  text: "text-white" },
              "bold-dark":    { icon: <Zap       className="w-3.5 h-3.5" />, bg: "bg-red-500",     text: "text-white" },
              "retro":        { icon: <Hourglass className="w-3.5 h-3.5" />, bg: "bg-amber-600",   text: "text-white" },
              "futuristic":   { icon: <Bot       className="w-3.5 h-3.5" />, bg: "bg-cyan-500",    text: "text-white" },
            };
            const moodCfgMsg = m.moodValue ? moodIconMapMsg[m.moodValue] : null;

            const isUser = m.sender === "user";
            // HANYA pesan refine deskripsi yang bisa diedit (bukan nama, bahasa, mood, dsb.)
            const isEditableDesc =
              (isUser && (m.isRefined || m.id === chat.descriptionMessageId || m.id.startsWith("user-desc-"))) ||
              (!isUser && (m.isRefined || m.isAiResponse));
            const isEditing = editingMessageId === m.id && isEditableDesc;

            if (isEditing) {
              return (
                <div key={m.id} className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"} w-full animate-in fade-in duration-200`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 mt-1 text-slate-900 shadow-xs">
                      <SparkleGenAI className="w-[21px] h-[21px]" />
                    </div>
                  )}
                  <div className="w-full max-w-[92%] sm:max-w-[80%] space-y-2">
                    <div className="rounded-2xl p-3 bg-[#16191E] border border-primary/50 shadow-xl space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-0.5">
                        <span className="flex items-center gap-1.5 text-primary font-semibold">
                          <Pencil className="w-3 h-3" />
                          {t("dashboard.wizard.editMessage", "Edit pesan")}
                        </span>
                        <span className="hidden sm:inline text-[10px] text-slate-500">
                          {t("dashboard.wizard.editShortcutHint", "Enter untuk simpan, Esc untuk batal")}
                        </span>
                      </div>
                      <textarea
                        ref={editTextareaRef}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveEdit(m.id);
                          } else if (e.key === "Escape") {
                            handleCancelEdit();
                          }
                        }}
                        rows={Math.min(6, Math.max(2, editingText.split("\n").length))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 leading-relaxed resize-none font-sans"
                        placeholder={t("dashboard.wizard.editPlaceholder", "Ketik perubahan pesan...")}
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t("dashboard.wizard.btnCancel", "Batal")}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(m.id)}
                          disabled={!editingText.trim()}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t("dashboard.wizard.btnSave", "Simpan")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={m.id} className={`group flex gap-2 items-center ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 text-slate-900 self-start shadow-xs">
                    <SparkleGenAI className="w-[21px] h-[21px]" />
                  </div>
                )}

                {/* Tombol Edit untuk user message: HANYA untuk refine desc */}
                {isUser && isEditableDesc && !chat.isInitialTyping && (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(m.id, messageText)}
                    title={t("dashboard.wizard.editMessage", "Edit pesan")}
                    className="opacity-70 sm:opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer shrink-0"
                    aria-label={t("dashboard.wizard.editMessage", "Edit pesan")}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? "bg-white text-slate-900 font-medium rounded-tr-sm shadow-xs"
                      : "rounded-tl-sm text-slate-200"
                  }`}
                  style={!isUser ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" } : {}}
                >
                  {moodCfgMsg ? (
                    <span className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${moodCfgMsg.bg} ${moodCfgMsg.text}`}>
                        {moodCfgMsg.icon}
                      </span>
                      {formatText(messageText.replace(/^\S+\s/, ""), true)}
                    </span>
                  ) : (
                    formatText(messageText, isUser)
                  )}
                  {m.isEdited && (
                    <span className={`text-[10px] ml-1.5 italic font-normal ${isUser ? "text-slate-500" : "text-slate-400"}`}>
                      {t("dashboard.wizard.editedBadge", "(diedit)")}
                    </span>
                  )}
                  {m.id === "init" && chat.isInitialTyping && (
                    <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse rounded-full bg-slate-300" />
                  )}
                  {m.isPreparing && device.mobileScreen === "chat" && (
                    <PreparingWebsiteLoader t={t} />
                  )}
                </div>

                {!isUser && isEditableDesc && !chat.isInitialTyping && m.id !== "typing" && !m.isPreparing && (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(m.id, messageText)}
                    title={t("dashboard.wizard.editMessage", "Edit respon")}
                    className="opacity-70 sm:opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer shrink-0"
                    aria-label={t("dashboard.wizard.editMessage", "Edit respon")}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {chat.isAnalyzingDescription && (
            <div className="flex gap-2.5 justify-start animate-in fade-in duration-200">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 text-slate-900 shadow-xs">
                <SparkleGenAI className="w-[21px] h-[21px]" />
              </div>
              <div
                className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
              </div>
            </div>
          )}

          {chat.isProcessingAudio && (
            <AudioProcessingCard businessName={chat.businessName} />
          )}

          <div ref={chat.chatEndRef} />
        </div>

        {/* Chat Input */}
        <WizardChatInput
          chat={chat}
          isKeyboardOpen={device.isKeyboardOpen}
          transcriptScrollRef={transcriptScrollRef}
          handleSendText={handleSendText}
          locale={locale}
          t={t}
        />

        {/* Chat Footer */}
        <WizardChatFooter
          previewState={preview.previewState}
          chatStage={chat.chatStage}
          isAnalyzingDescription={chat.isAnalyzingDescription}
          isAiTyping={chat.isAiTyping}
          messagesCount={chat.messages.length}
          inputValue={chat.inputValue}
          clock={clock}
          handleResetChat={handleResetChat}
          t={t}
        />
          </>
        )}
      </div>

      {/* ══ RIGHT: Browser Preview ════════════════════════════════════════════ */}
      <div
        className={`flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-background transition-all duration-300 ease-out ${
          fullPagePreviewOpen
            ? "fixed inset-0 z-50 translate-x-0 md:fixed md:inset-0 md:z-50 md:translate-x-0"
            : `absolute inset-0 z-30 md:relative md:inset-auto md:z-0 md:translate-x-0 ${
                device.isMobile
                  ? device.mobileScreen === "preview" || device.mobileScreen === "loading"
                    ? "translate-x-0"
                    : "translate-x-full"
                  : device.mobilePreviewOpen
                  ? "translate-x-0"
                  : "translate-x-full"
              }`
        }`}
      >
        <div className="h-12 flex items-center px-4 gap-3 shrink-0" style={{ background: "#111318", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.06] p-0.5">
            <button
              type="button"
              onClick={() => device.setPreviewDevice("desktop")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-all cursor-pointer ${device.previewDevice === "desktop" ? "bg-white/20 text-white shadow-xs font-semibold" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"}`}
              aria-label="Preview desktop"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => device.setPreviewDevice("tablet")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-all cursor-pointer ${device.previewDevice === "tablet" ? "bg-white/20 text-white shadow-xs font-semibold" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"}`}
              aria-label="Preview tablet"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => device.setPreviewDevice("mobile")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-all cursor-pointer ${device.previewDevice === "mobile" ? "bg-white/20 text-white shadow-xs font-semibold" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"}`}
              aria-label="Preview mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          {preview.templatePool.length > 1 && preview.previewState === "result" && (
            <div className="relative shrink-0">
              {showRekomendasiHint && (
                  <div className="absolute top-full left-0 mt-2 z-50 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-300 w-[240px]">
                    <div className="relative bg-[#1a1d24] border border-white/10 text-slate-200 rounded-2xl p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
                      <button
                        type="button"
                        onClick={() => setShowRekomendasiHint(false)}
                        className="absolute top-2.5 right-2.5 text-slate-500 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                          <RefreshCw className="w-3.5 h-3.5 text-slate-200" />
                        </div>
                        <div className="space-y-1 pr-3">
                          <p className="text-xs font-bold text-slate-100 leading-tight">
                            {t("dashboard.wizard.recommendationHintTitle", "Ada {count} rekomendasi desain!", { count: String(preview.templatePool.length) })}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            {t("dashboard.wizard.recommendationHintDesc", "Klik untuk lihat pilihan tampilan lain.")}
                          </p>
                        </div>
                      </div>
                      <div className="absolute -top-1.5 left-[28px] w-3 h-3 bg-[#1a1d24] border-l border-t border-white/10 transform rotate-45" />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowRekomendasiHint(false);
                    preview.handleSwitchTemplate();
                  }}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-200 border border-white/10 bg-white/[0.06] transition-all hover:bg-white/10 hover:border-white/20 hover:text-white active:scale-95 cursor-pointer"
                >
                  <RefreshCw size={11} />
                  {t("dashboard.wizard.btnTryOtherRecommendation", "Coba rekomendasi lain ({current}/{total})", {
                    current: String(preview.templatePoolIndex + 1),
                    total: String(preview.templatePool.length),
                  })}
                </button>
              </div>
            )}

          <div className="flex-1 min-w-0">
            {preview.previewState === "loading" && (
              <span className="ml-auto text-[10px] font-semibold text-slate-300 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full w-fit block">Draft Preview</span>
            )}
            {preview.previewState === "result" && (
              <span className="ml-auto text-[10px] font-semibold text-slate-200 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full w-fit block">Live Preview</span>
            )}
          </div>

          {/* Theme Customize Button (Desktop left pane toggle) */}
          {FEATURE_FLAGS.THEME_PANEL && preview.previewState === "result" && !device.isMobile && (
            <button
              type="button"
              onClick={() => setLeftPane((prev) => (prev === "theme" ? "chat" : "theme"))}
              title={leftPane === "theme" ? t("dashboard.wizard.theme.backToChat", "Kembali ke Chat") : t("dashboard.wizard.theme.customizeTheme", "Sesuaikan Tema")}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all active:scale-95 cursor-pointer ${
                leftPane === "theme"
                  ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300"
                  : "border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              <PaletteIcon size={11} />
              <span>{t("dashboard.wizard.theme.buttonLabel", "Tema")}</span>
              {themeDraft.hasDraft && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          )}

          {/* Full Page Preview Button */}
          {preview.previewState === "result" && (
            <button
              type="button"
              onClick={() => setFullPagePreviewOpen((prev) => !prev)}
              title={fullPagePreviewOpen ? t("dashboard.wizard.btnExitFullPagePreview", "Tutup Preview Penuh") : t("dashboard.wizard.btnFullPagePreview", "Preview Penuh")}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-200 border border-white/10 bg-white/[0.06] transition-all hover:bg-white/10 hover:border-white/20 hover:text-white active:scale-95 cursor-pointer"
            >
              {fullPagePreviewOpen ? (
                <>
                  <Minimize2 size={11} />
                  <span>{t("dashboard.wizard.btnExitFullPagePreview", "Tutup Preview Penuh")}</span>
                </>
              ) : (
                <>
                  <Maximize2 size={11} />
                  <span>{t("dashboard.wizard.btnFullPagePreview", "Preview Penuh")}</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden relative bg-background" ref={previewContainerRef}>
          <PreviewCanvas chat={chat} preview={preview} device={device} themeDraft={themeDraft} />

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
            <div className="hidden md:flex absolute bottom-6 right-6 z-40 gap-2 items-end">

              {/* Lengkapi Data */}
              <div className="relative">
                {showLengkapiHint && (
                  <div className="absolute bottom-full right-0 mb-3 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300 w-[240px]">
                    <div className="relative bg-[#1a1d24] border border-white/10 text-slate-200 rounded-2xl p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
                      <button
                        type="button"
                        onClick={() => setShowLengkapiHint(false)}
                        className="absolute top-2.5 right-2.5 text-slate-500 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-slate-200" />
                        </div>
                        <div className="space-y-1 pr-3">
                          <p className="text-xs font-bold text-slate-100 leading-tight">
                            {t("dashboard.wizard.completeContactDataTitle", "Lengkapi data kontak")}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            {t("dashboard.wizard.completeContactDataDesc", "Tambah nomor WA supaya tombol kontak di website aktif.")}
                          </p>
                        </div>
                      </div>
                      <div className="absolute -bottom-1.5 right-[28px] w-3 h-3 bg-[#1a1d24] border-r border-b border-white/10 transform rotate-45" />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { setShowLengkapiHint(false); setSheetOpen(true); }}
                  className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold bg-white text-slate-900 shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 hover:brightness-110 active:brightness-95"
                >
                  <Plus className="h-4 w-4" />
                  {t("dashboard.wizard.btnCompleteData", "Lengkapi Data")}
                </button>

                {/* Popover anchored directly above button with left edge aligned */}
                <div className="hidden md:block">
                  <BusinessDetailsSheet
                    isOpen={sheetOpen}
                    onClose={() => setSheetOpen(false)}
                    chat={chat}
                    onSave={handleDetailsSheetSave}
                    variant="popover"
                  />
                </div>
              </div>

              {/* Edit & Publikasikan */}
              <div className="relative">
                {showEditPublishHint && (
                  <div className="absolute bottom-full right-0 mb-3 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300 w-[240px]">
                    <div className="relative bg-[#1a1d24] border border-white/10 text-slate-200 rounded-2xl p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
                      <button
                        type="button"
                        onClick={() => setShowEditPublishHint(false)}
                        className="absolute top-2.5 right-2.5 text-slate-500 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Pencil className="w-3.5 h-3.5 text-slate-200" />
                        </div>
                        <div className="space-y-1 pr-3">
                          <p className="text-xs font-bold text-slate-100 leading-tight">
                            {t("dashboard.wizard.editPublishHintTitle", "Bebas atur & sesuaikan!")}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            {t("dashboard.wizard.editPublishHintDesc", "Bisa full edit, ubah tampilan, atau hapus section di Editor.")}
                          </p>
                        </div>
                      </div>
                      <div className="absolute -bottom-1.5 right-[28px] w-3 h-3 bg-[#1a1d24] border-r border-b border-white/10 transform rotate-45" />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { setShowEditPublishHint(false); handleGoToEditor(); }}
                  className="btn-primary flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold shadow-[0_14px_35px_rgba(0,0,0,0.25)] transition-all hover:scale-105 active:scale-95"
                >
                  <Pencil className="h-4 w-4" />
                  {t("dashboard.wizard.btnEditPublish", "Edit & Publikasikan")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

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
        title={t("dashboard.wizard.tooFastTitle", "Terlalu cepat!")}
        message={t("dashboard.wizard.tooFastMessage", "Kamu sudah generate beberapa kali dalam waktu singkat. Tunggu 30 detik, lalu coba lagi ya.")}
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
        onOpenSheet={() => { setShowLengkapiHint(false); setSheetOpen(true); }}
        onGoToEditor={() => { setShowEditPublishHint(false); handleGoToEditor(); }}
        onOpenTheme={FEATURE_FLAGS.THEME_PANEL ? () => setThemeSheetOpen(true) : undefined}
        showLengkapiHint={showLengkapiHint}
        showEditPublishHint={showEditPublishHint}
      />

      {FEATURE_FLAGS.THEME_PANEL && (
        <ThemeSheet
          open={themeSheetOpen}
          mood={chat.moodRef.current || chat.mood || "clean-modern"}
          theme={themeDraft}
          baseToken={baseThemeToken}
          onClose={() => setThemeSheetOpen(false)}
        />
      )}

      <div className="md:hidden">
        <BusinessDetailsSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          chat={chat}
          onSave={handleDetailsSheetSave}
          variant="sheet"
        />
      </div>

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
