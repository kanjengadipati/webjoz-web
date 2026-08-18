"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LOADING_STEPS_PERCENT, SECTION_STEP_MAP, TEMPLATE_NAMES } from "./constants";
import { getTemplatePool } from "./helpers";
import type { PreviewData, PreviewState } from "./types";
import type { StreamSection } from "@/hooks/use-generate-stream";

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
  const [regenCount, setRegenCount] = useState(0);
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);
  const [previewHistory, setPreviewHistory] = useState<PreviewData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isSwitchingTemplate, setIsSwitchingTemplate] = useState(false);
  const [resultClear, setResultClear] = useState(false);
  const [stepElapsed, setStepElapsed] = useState<number[]>([0, 0, 0, 0, 0, 0]);
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
  const stepStartTimesRef = useRef<number[]>([0, 0, 0, 0, 0, 0]);
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
  // - smoothProgress has reached 100% (the progress bar visually hits the end)
  // - streamDone is true (meaning previewData has already been committed by React)
  // This ensures the user always sees the progress bar fill up completely and naturally
  // before transitioning to the final preview layout.
  useEffect(() => {
    if (previewState === "loading" && Math.round(smoothProgress) >= 100 && streamDone && !pendingResultRef.current) {
      pendingResultRef.current = true;
      setTimeout(() => setPreviewState("result"), 600);
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
        const target = LOADING_STEPS_PERCENT[loadingStep] ?? 15;
        if (prev >= target) {
          return target;
        }
        const diff = target - prev;
        // Natural easing step: increment proportional to the remaining distance
        const step = Math.min(0.8, Math.max(0.15, diff * 0.04));
        const next = prev + step;
        return next >= target ? target : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [previewState, loadingStep]);

  // Handle loading steps, pacing, and safety timeout
  useEffect(() => {
    if (previewState !== "loading") return;

    setLoadingStep(0);
    setStepElapsed([0, 0, 0, 0, 0, 0]);
    streamDoneRef.current = false;
    setStreamDone(false);
    desiredStepRef.current = 0;
    lastStepTimeRef.current = Date.now();
    pendingResultRef.current = false;
    stepStartTimesRef.current = [Date.now(), 0, 0, 0, 0, 0];
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (pendingResultRef.current) return;

      const now = Date.now();

      // 1. Safety timeout
      if (now - startTime > 180000) {
        pendingResultRef.current = true;
        setTimeout(() => setPreviewState("result"), 600);
        return;
      }

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
      if (currentStep >= 5) return;

      const targetStep = streamDoneRef.current ? 5 : desiredStepRef.current;
      if (currentStep >= targetStep) return;

      // Pacing: minimum 1.5s per step
      if (now - lastStepTimeRef.current < 1500) return;

      // Freeze elapsed for the step we're leaving, then advance
      const frozenElapsed = Math.round((now - stepStartTimesRef.current[currentStep]) / 1000);
      stepStartTimesRef.current[currentStep + 1] = now;
      lastStepTimeRef.current = now;

      setStepElapsed((prev) => {
        const next = [...prev];
        next[currentStep] = frozenElapsed;
        return next;
      });

      setLoadingStep(currentStep + 1);
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

  const handleSwitchTemplate = useCallback(() => {
    if (templatePool.length <= 1) return;
    setIsSwitchingTemplate(true);
    const nextIndex = (templatePoolIndex + 1) % templatePool.length;
    const nextTemplateId = templatePool[nextIndex];
    setTemplatePoolIndex(nextIndex);
    setPreviewData(prev => prev ? { ...prev, template_id: nextTemplateId } : prev);
    setTimeout(() => {
      setIsSwitchingTemplate(false);
    }, 450);
  }, [templatePool, templatePoolIndex]);

  const advanceLoadingStepFromSection = (section: string) => {
    const mappedStep = SECTION_STEP_MAP[section];
    if (mappedStep !== undefined) {
      desiredStepRef.current = Math.max(desiredStepRef.current, mappedStep);
    }
  };

  return {
    previewState,
    setPreviewState,
    previewData,
    setPreviewData,
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
  };
}
