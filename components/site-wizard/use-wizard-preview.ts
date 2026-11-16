"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { previewSetByPath } from "@/lib/preview-set-by-path";
import { LOADING_STEPS_PERCENT, SECTION_STEP_MAP, TEMPLATE_NAMES } from "./constants";
import { getTemplatePool } from "./helpers";
import type { PreviewData, PreviewState } from "./types";
import type { StreamSection, LayoutAlternative } from "@/hooks/use-generate-stream";
import { TEMPLATE_DEFAULT_DESIGN_TOKENS } from "@/lib/template-defaults";

export function useWizardPreview() {
  const [previewState, setPreviewState] = useState<PreviewState>("wireframe");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [streamedSections, setStreamedSections] = useState<Record<string, any>>({});
  const [sectionSources, setSectionSources] = useState<Record<string, string>>({});
  const [streamedDesignToken, setStreamedDesignToken] = useState<Record<string, any> | null>(null);
  const [streamedTemplateId, setStreamedTemplateId] = useState<string>("");
  const [arrivedSections, setArrivedSections] = useState<StreamSection[]>([]);
  const [templatePool, setTemplatePool] = useState<string[]>([]);
  const [templatePoolIndex, setTemplatePoolIndex] = useState(0);
  // Alternatif layout dari server (opsi 2..N, TEMPLATE_DYNAMIC, konten dipakai ulang).
  // Opsi 1 (indeks 0) adalah layout hasil generate, disimpan di layoutBaseRef.
  const [layoutAlternatives, setLayoutAlternativesState] = useState<LayoutAlternative[]>([]);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const layoutBaseRef = useRef<{ hero_style?: string; section_variants: Record<string, any> } | null>(null);
  const [regenCount, setRegenCount] = useState(0);
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);
  const [previewHistory, setPreviewHistory] = useState<PreviewData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isSwitchingTemplate, setIsSwitchingTemplate] = useState(false);
  const [resultClear, setResultClear] = useState(false);
  const [stepElapsed, setStepElapsed] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [smoothProgress, setSmoothProgress] = useState(0);

  const streamedSectionsRef = useRef<Record<string, any>>({});
  const streamedTokenRef = useRef<Record<string, any> | null>(null);
  const historyIndexRef = useRef(historyIndex);
  const loadingStepRef = useRef(0);
  const streamDoneRef = useRef(false);
  const [streamDone, setStreamDone] = useState(false);
  const desiredStepRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const prevStepRef = useRef(0);
  const pendingResultRef = useRef(false);
  const stepStartTimesRef = useRef<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => { historyIndexRef.current = historyIndex; }, [historyIndex]);
  useEffect(() => { loadingStepRef.current = loadingStep; }, [loadingStep]);

  const currentName = TEMPLATE_NAMES[previewData?.template_id ?? ""] || "Desain ini";

  // Scroll helpers
  const scrollPreviewPct = useCallback((pct: number) => {
    const iframe = previewIframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (doc?.body) {
        const sh = Math.max(doc.documentElement?.scrollHeight ?? 0, doc.body.scrollHeight ?? 0);
        const ch = doc.documentElement?.clientHeight ?? doc.body.clientHeight ?? 0;
        if (sh > ch) {
          const target = Math.max(0, (sh - ch) * Math.min(pct / 100, 1));
          doc.documentElement?.scrollTo({ top: target, left: 0, behavior: "smooth" });
          doc.body?.scrollTo({ top: target, left: 0, behavior: "smooth" });
        }
      }
    }
    const el = previewScrollRef.current;
    if (el && el.scrollHeight > el.clientHeight) {
      const target = Math.max(0, (el.scrollHeight - el.clientHeight) * Math.min(pct / 100, 1));
      el.scrollTo({ top: target, left: 0, behavior: "smooth" });
    }
  }, []);

  const scrollPreviewToTop = useCallback(() => {
    requestAnimationFrame(() => {
      const iframe = previewIframeRef.current;
      if (iframe) {
        const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
        if (doc?.body) {
          doc.documentElement?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          doc.body?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }
      const el = previewScrollRef.current;
      if (el) el.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  }, []);

  // Auto-scroll preview in sync with loading step
  useEffect(() => {
    if (previewState === "loading" && loadingStep > prevStepRef.current) {
      prevStepRef.current = loadingStep;
      const pct = loadingStep === 4 ? 95 : (LOADING_STEPS_PERCENT[loadingStep] ?? 15);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollPreviewPct(pct);
        });
      });
    }
  }, [loadingStep, previewState, scrollPreviewPct]);

  // Scroll to top on device/template change
  useEffect(() => {
    scrollPreviewToTop();
  }, [previewData?.template_id, streamedTemplateId, regenCount, historyIndex, scrollPreviewToTop]);

  // Transition to result only when BOTH conditions are true in React's eyes:
  // - streamDone is true (meaning onDone event has arrived and previewData is committed)
  // - smoothProgress has reached 100% (the progress bar visually hits 100%)
  useEffect(() => {
    if (previewState === "loading" && streamDone && !pendingResultRef.current) {
      if (Math.round(smoothProgress) >= 100) {
        pendingResultRef.current = true;
        setTimeout(() => setPreviewState("result"), 450);
      }
    }
  }, [smoothProgress, previewState, streamDone]);

  // Smoothly interpolate progress bar and percentage value
  useEffect(() => {
    if (previewState !== "loading") {
      setSmoothProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setSmoothProgress((prev) => {
        const isDone = streamDoneRef.current;
        const target = isDone ? 100 : (LOADING_STEPS_PERCENT[loadingStep] ?? 15);
        if (prev >= target) {
          if (!isDone && prev < 95 && loadingStep >= 4) {
            // When waiting for a slow stream response, slowly creep up without hitting 100%
            return Math.min(95, prev + 0.04);
          }
          return isDone ? 100 : prev;
        }
        const diff = target - prev;
        // Faster jump to 100% once done, natural easing during in-progress generation
        const step = isDone
          ? Math.max(1.5, diff * 0.25)
          : Math.min(0.8, Math.max(0.15, diff * 0.04));
        const next = prev + step;
        return next >= target ? target : next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [previewState, loadingStep]);

  // Handle loading steps, pacing, and safety timeout
  useEffect(() => {
    if (previewState !== "loading") return;

    setLoadingStep(0);
    setStepElapsed([0, 0, 0, 0, 0, 0, 0]);
    streamDoneRef.current = false;
    setStreamDone(false);
    desiredStepRef.current = 0;
    lastStepTimeRef.current = Date.now();
    pendingResultRef.current = false;
    stepStartTimesRef.current = [Date.now(), 0, 0, 0, 0, 0, 0];
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (pendingResultRef.current) return;

      const now = Date.now();

      const currentStep = loadingStepRef.current;

      // 2. Update ticking timer for the active step — only once per second (floor check)
      const activeStart = stepStartTimesRef.current[currentStep];
      if (activeStart > 0) {
        const elapsed = Math.round((now - activeStart) / 1000);
        setStepElapsed((prev) => {
          if (prev[currentStep] === elapsed) return prev; // skip if unchanged
          const next = [...prev];
          next[currentStep] = elapsed;
          return next;
        });
      }

      // 3. Advance loading step if needed (transition to result handled by useEffect)
      if (currentStep >= 6) return;

      const targetStep = streamDoneRef.current ? 6 : desiredStepRef.current;
      if (currentStep >= targetStep) return;

      // Pacing: minimum 1.2s per step when stream is in flight
      if (!streamDoneRef.current && now - lastStepTimeRef.current < 1200) return;

      // Freeze elapsed for the step we're leaving, then advance
      const frozenElapsed = Math.round((now - stepStartTimesRef.current[currentStep]) / 1000);
      stepStartTimesRef.current[currentStep + 1] = now;
      lastStepTimeRef.current = now;

      setStepElapsed((prev) => {
        const next = [...prev];
        next[currentStep] = frozenElapsed;
        return next;
      });

      const nextStep = currentStep + 1;
      loadingStepRef.current = nextStep;
      setLoadingStep(nextStep);
    }, 250);

    return () => clearInterval(interval);
  }, [previewState]);

  // Result blur
  useEffect(() => {
    if (previewState === "result") {
      setResultClear(false);
      scrollPreviewToTop();
      const t = setTimeout(() => setResultClear(true), 600);
      return () => clearTimeout(t);
    } else {
      setResultClear(true);
    }
  }, [previewState, scrollPreviewToTop]);

  const previewBlurPx = useMemo(() => {
    if (previewState === "result" && resultClear) return 0;
    if (previewState === "result") return 2;
    const pct = smoothProgress;
    const blur = Math.round(8 * (1 - pct / 100) * 10) / 10;
    return Math.max(blur, 1.5);
  }, [previewState, smoothProgress, resultClear]);

  const setLayoutAlternatives = useCallback((alts: LayoutAlternative[], baseLayout?: Record<string, any> | null) => {
    const sv = baseLayout?.section_variants;
    if (!alts.length || !sv || typeof sv !== "object") {
      setLayoutAlternativesState([]);
      layoutBaseRef.current = null;
      setLayoutIndex(0);
      return;
    }
    layoutBaseRef.current = { hero_style: baseLayout?.hero_style, section_variants: { ...sv } };
    setLayoutAlternativesState(alts);
    setLayoutIndex(0);
  }, []);

  // Alternatif layout hanya berlaku di TEMPLATE_DYNAMIC; selain itu tombol memakai pool template lama.
  const usingLayoutAlternatives =
    layoutAlternatives.length > 0 && layoutBaseRef.current !== null && previewData?.template_id === "TEMPLATE_DYNAMIC";
  const layoutOptionCount = usingLayoutAlternatives ? layoutAlternatives.length + 1 : templatePool.length;
  const layoutOptionIndex = usingLayoutAlternatives ? layoutIndex : templatePoolIndex;

  const handleSwitchTemplate = useCallback(() => {
    const base = layoutBaseRef.current;
    if (layoutAlternatives.length > 0 && base && previewData?.template_id === "TEMPLATE_DYNAMIC") {
      setIsSwitchingTemplate(true);
      const nextIndex = (layoutIndex + 1) % (layoutAlternatives.length + 1);
      const alt = nextIndex === 0 ? null : layoutAlternatives[nextIndex - 1];
      setLayoutIndex(nextIndex);
      setPreviewData(prev => {
        const layout = prev?.design_token?.layout;
        if (!prev || !layout) return prev;
        const manual: Record<string, boolean> = (layout as any).section_variants_manual ?? {};
        const nextSv: Record<string, any> = { ...(layout.section_variants as any) };
        // Kembali ke layout asli lalu timpa dengan opsi terpilih; pilihan manual user tidak disentuh.
        for (const [k, v] of Object.entries(base.section_variants)) {
          if (!manual[k]) nextSv[k] = v;
        }
        if (alt) {
          for (const [k, v] of Object.entries(alt.section_variants)) {
            if (!manual[k]) nextSv[k] = v;
          }
        }
        const hero = alt?.hero_style ?? base.hero_style ?? (layout as any).hero_style;
        if (hero) nextSv.hero = hero;
        return {
          ...prev,
          design_token: {
            ...prev.design_token,
            layout: { ...layout, ...(hero ? { hero_style: hero } : {}), section_variants: nextSv },
          },
        };
      });
      setTimeout(() => setIsSwitchingTemplate(false), 450);
      return;
    }
    if (templatePool.length <= 1) return;
    setIsSwitchingTemplate(true);
    const nextIndex = (templatePoolIndex + 1) % templatePool.length;
    const nextTemplateId = templatePool[nextIndex];
    setTemplatePoolIndex(nextIndex);
    setPreviewData(prev => {
      if (!prev) return prev;
      const targetDefault = TEMPLATE_DEFAULT_DESIGN_TOKENS[nextTemplateId];
      const nextHeroStyle = targetDefault?.layout?.hero_style;
      const nextLayout = prev.design_token?.layout ? {
        ...prev.design_token.layout,
        ...(nextHeroStyle ? {
          hero_style: nextHeroStyle,
          section_variants: {
            ...(prev.design_token.layout.section_variants as any),
            hero: nextHeroStyle,
          },
        } : {}),
      } : prev.design_token?.layout;

      return {
        ...prev,
        template_id: nextTemplateId,
        design_token: prev.design_token ? {
          ...prev.design_token,
          ...(targetDefault?.palette ? { palette: { ...prev.design_token.palette, ...targetDefault.palette } } : {}),
          ...(targetDefault?.theme_mode ? { theme_mode: targetDefault.theme_mode } : {}),
          ...(nextLayout ? { layout: nextLayout } : {}),
        } : prev.design_token,
      };
    });
    setTimeout(() => {
      setIsSwitchingTemplate(false);
    }, 450);
  }, [templatePool, templatePoolIndex, layoutAlternatives, layoutIndex, previewData?.template_id]);

  // Inline edit write path: tulis nilai ke previewData.content[section].
  // Mendukung dotted path + index array (mis. "items.0.quote") dan replace
  // array utuh (dipakai hapus item). Hanya aktif saat previewData ada.
  const updateField = useCallback((section: string, key: string, val: any) => {
    setPreviewData((prev) => {
      if (!prev) return prev;
      const segs = key.includes(".") ? key.split(".") : [key];
      const root = previewSetByPath(prev.content?.[section] ?? {}, segs, val);
      return { ...prev, content: { ...(prev.content ?? {}), [section]: root } };
    });
    // Di luar updater: updater harus murni (StrictMode memanggilnya dua kali).
    setHasUnsavedEdits(true);
  }, []);

  const advanceLoadingStepFromSection = (section: string) => {
    const mappedStep = SECTION_STEP_MAP[section];
    if (mappedStep !== undefined) {
      desiredStepRef.current = Math.max(desiredStepRef.current, mappedStep);
    }
  };

  const resetPreview = useCallback(() => {
    setPreviewState("wireframe");
    setPreviewData(null);
    setStreamedSections({});
    setSectionSources({});
    setStreamedDesignToken(null);
    setStreamedTemplateId("");
    setArrivedSections([]);
    setTemplatePool([]);
    setTemplatePoolIndex(0);
    setLayoutAlternativesState([]);
    setLayoutIndex(0);
    layoutBaseRef.current = null;
    setRegenCount(0);
    setHasUnsavedEdits(false);
    setPreviewHistory([]);
    setHistoryIndex(-1);
    setLoadingStep(0);
    setStreamDone(false);
    setSmoothProgress(0);
    setIsSwitchingTemplate(false);
    streamedSectionsRef.current = {};
    streamedTokenRef.current = null;
    historyIndexRef.current = -1;
    loadingStepRef.current = 0;
    streamDoneRef.current = false;
    pendingResultRef.current = false;
    desiredStepRef.current = 0;
    prevStepRef.current = 0;
  }, []);

  return {
    previewState,
    setPreviewState,
    previewData,
    setPreviewData,
    updateField,
    streamedSections,
    setStreamedSections,
    sectionSources,
    setSectionSources,
    streamedDesignToken,
    setStreamedDesignToken,
    streamedTemplateId,
    setStreamedTemplateId,
    arrivedSections,
    setArrivedSections,
    templatePool,
    setTemplatePool,
    templatePoolIndex,
    setTemplatePoolIndex,
    setLayoutAlternatives,
    layoutOptionCount,
    layoutOptionIndex,
    regenCount,
    setRegenCount,
    hasUnsavedEdits,
    setHasUnsavedEdits,
    previewHistory,
    setPreviewHistory,
    historyIndex,
    setHistoryIndex,
    loadingStep,
    setLoadingStep,
    stepElapsed,
    smoothProgress,
    setSmoothProgress,
    isSwitchingTemplate,
    setIsSwitchingTemplate,
    resultClear,
    previewBlurPx,
    currentName,
    streamedSectionsRef,
    streamedTokenRef,
    historyIndexRef,
    loadingStepRef,
    streamDone,
    setStreamDone,
    streamDoneRef,
    previewScrollRef,
    previewIframeRef,
    scrollPreviewPct,
    scrollPreviewToTop,
    handleSwitchTemplate,
    advanceLoadingStepFromSection,
    resetPreview,
  };
}
