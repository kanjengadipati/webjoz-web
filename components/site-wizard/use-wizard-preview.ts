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

  const streamedSectionsRef = useRef<Record<string, any>>({});
  const streamedTokenRef = useRef<Record<string, any> | null>(null);
  const historyIndexRef = useRef(historyIndex);
  const loadingStepRef = useRef(0);
  const streamDoneRef = useRef(false);
  const desiredStepRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const prevStepRef = useRef(0);
  const pendingResultRef = useRef(false);
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

  // Instant transition to result when stream is done and loading step reaches 5
  useEffect(() => {
    if (previewState === "loading" && loadingStep >= 5 && streamDoneRef.current && !pendingResultRef.current) {
      pendingResultRef.current = true;
      setTimeout(() => setPreviewState("result"), 600);
    }
  }, [loadingStep, previewState]);

  // Handle loading steps, pacing, and safety timeout
  useEffect(() => {
    if (previewState !== "loading") return;

    setLoadingStep(0);
    streamDoneRef.current = false;
    desiredStepRef.current = 0;
    lastStepTimeRef.current = Date.now();
    pendingResultRef.current = false;
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (pendingResultRef.current) return;

      const now = Date.now();

      // 1. Safety timeout: force transition to result after 3 minutes to prevent infinite loading
      if (now - startTime > 180000) {
        pendingResultRef.current = true;
        setTimeout(() => setPreviewState("result"), 600);
        return;
      }

      setLoadingStep((prev) => {
        // 2. If stream is done and loading step is at least 5, transition to result
        if (prev >= 5 && streamDoneRef.current) {
          pendingResultRef.current = true;
          setTimeout(() => setPreviewState("result"), 600);
          return prev;
        }

        const targetStep = streamDoneRef.current ? 5 : desiredStepRef.current;
        if (prev >= targetStep) return prev;

        // Pacing: minimum 1.5s per step
        if (now - lastStepTimeRef.current < 1500) return prev;
        lastStepTimeRef.current = now;
        return prev + 1;
      });
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
    const pct = LOADING_STEPS_PERCENT[loadingStep] ?? 15;
    const blur = Math.round(8 * (1 - pct / 100) * 10) / 10;
    return Math.max(blur, 1.5);
  }, [previewState, loadingStep, resultClear]);

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
    isSwitchingTemplate,
    setIsSwitchingTemplate,
    resultClear,
    previewBlurPx,
    currentName,
    streamedSectionsRef,
    streamedTokenRef,
    historyIndexRef,
    loadingStepRef,
    streamDoneRef,
    previewScrollRef,
    previewIframeRef,
    scrollPreviewPct,
    scrollPreviewToTop,
    handleSwitchTemplate,
    advanceLoadingStepFromSection,
  };
}
