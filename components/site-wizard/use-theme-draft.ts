"use client";

import { useState, useRef, useEffect, useMemo, useDeferredValue, useCallback } from "react";
import type { PreviewData } from "./types";
import {
  type ThemeOverrides,
  mergeThemeOverrides,
  isEmptyOverrides,
  overridesEqual,
  ensureReadableText,
  stripHeavyOverrides,
  buildMoodOverrides,
  extractCustomFont,
} from "@/lib/theme-overrides";

export interface UseThemeDraftArgs {
  previewData: PreviewData | null;
  setPreviewData: React.Dispatch<React.SetStateAction<PreviewData | null>>;
  baseToken: Record<string, any> | null;
  enabled: boolean;
  resetKey: string | number;
  onMoodChange?: (mood: string) => void;
}

export interface UseThemeDraftReturn {
  previewToken: Record<string, any> | null;
  hasDraft: boolean;
  draft: ThemeOverrides;
  applied: ThemeOverrides;
  customFontBackup: ThemeOverrides | null;

  setDraft: (patch: ThemeOverrides) => void;
  clearDraft: () => void;
  commitDraft: () => void;
  applyNow: (patch: ThemeOverrides, label?: string) => void;
  applyMood: (
    newMood: string,
    presets: { palettes: { override: ThemeOverrides }[]; fonts: { override: ThemeOverrides }[] },
    brandPalette?: Record<string, string> | null
  ) => void;

  canUndo: boolean;
  undo: () => void;
  resetAll: () => void;

  appliedRef: React.MutableRefObject<ThemeOverrides>;
  mergeApplied: (token: Record<string, any>) => Record<string, any>;
  rehydrate: (applied: ThemeOverrides) => void;
  hardReset: () => void;
}

function mergeOverrides(base: ThemeOverrides, patch: ThemeOverrides): ThemeOverrides {
  const result: ThemeOverrides = {
    ...base,
    palette: {
      ...(base.palette || {}),
      ...(patch.palette || {}),
    },
    typography: {
      ...(base.typography || {}),
      ...(patch.typography || {}),
    },
  };
  if (patch.theme_mode !== undefined) {
    result.theme_mode = patch.theme_mode;
  }
  if (patch.mood !== undefined) {
    result.mood = patch.mood;
  }
  return result;
}

export function useThemeDraft({
  previewData,
  setPreviewData,
  baseToken,
  enabled,
  resetKey,
  onMoodChange,
}: UseThemeDraftArgs): UseThemeDraftReturn {
  const [draft, setDraftState] = useState<ThemeOverrides>({});
  const [applied, setApplied] = useState<ThemeOverrides>({});
  const [undoStack, setUndoStack] = useState<ThemeOverrides[]>([]);
  const [customFontBackup, setCustomFontBackup] = useState<ThemeOverrides | null>(null);

  // Single source of truth ref for closures (e.g. onDesignToken & onDone in useWizardGenerate)
  const appliedRef = useRef<ThemeOverrides>(applied);
  appliedRef.current = applied;

  // Stable merge helper reading appliedRef.current directly
  const mergeApplied = useCallback((token: Record<string, any>): Record<string, any> => {
    if (!token || typeof token !== "object") return token;
    const merged = mergeThemeOverrides(token, appliedRef.current);
    return ensureReadableText(merged);
  }, []);

  // Throttle draft evaluation using useDeferredValue to keep 60fps during rapid slider/color input
  const deferredDraft = useDeferredValue(draft);

  // Clear draft when resetKey changes (new generation or history navigation)
  // Retain applied and re-merge with baseToken if history entry changed
  const prevResetKeyRef = useRef(resetKey);
  useEffect(() => {
    if (prevResetKeyRef.current !== resetKey) {
      prevResetKeyRef.current = resetKey;
      setDraftState({});
      // Synchronize previewData with baseToken + applied when history entry changes
      if (enabled && baseToken && !isEmptyOverrides(appliedRef.current)) {
        setPreviewData((prev) => {
          if (!prev) return prev;
          const nextToken = mergeApplied(baseToken);
          return {
            ...prev,
            design_token: nextToken,
          };
        });
      }
    }
  }, [resetKey, enabled, baseToken, mergeApplied, setPreviewData]);

  // Combined token for preview rendering
  const previewToken = useMemo(() => {
    if (!enabled || !baseToken) {
      return baseToken ?? previewData?.design_token ?? null;
    }
    const merged = mergeThemeOverrides(baseToken, applied, deferredDraft);
    return ensureReadableText(merged);
  }, [enabled, baseToken, previewData?.design_token, applied, deferredDraft]);

  const hasDraft = useMemo(() => {
    return !isEmptyOverrides(draft) && !overridesEqual(draft, applied);
  }, [draft, applied]);

  const setDraft = useCallback((patch: ThemeOverrides) => {
    if (!enabled) return;
    setDraftState((prev) => mergeOverrides(prev, patch));
  }, [enabled]);

  const clearDraft = useCallback(() => {
    if (!enabled) return;
    setDraftState({});
  }, [enabled]);

  const commitDraft = useCallback(() => {
    if (!enabled || isEmptyOverrides(draft)) return;

    // Push snapshot to undo stack (max 5 snapshots)
    setUndoStack((prev) => [...prev.slice(-4), applied]);

    // Backup custom fonts that are about to be overwritten.
    const prevCustom = extractCustomFont(applied.typography);
    if (prevCustom) setCustomFontBackup(prevCustom);

    const nextApplied = mergeOverrides(applied, draft);
    appliedRef.current = nextApplied;
    setApplied(nextApplied);

    setPreviewData((prev) => {
      if (!prev) return prev;
      const nextToken = mergeThemeOverrides(baseToken ?? prev.design_token, nextApplied);
      return {
        ...prev,
        design_token: ensureReadableText(nextToken),
      };
    });

    setDraftState({});
  }, [enabled, draft, applied, baseToken, setPreviewData]);

  const applyNow = useCallback((patch: ThemeOverrides, _label?: string) => {
    if (!enabled || isEmptyOverrides(patch)) return;

    setUndoStack((prev) => [...prev.slice(-4), applied]);

    // Backup custom fonts that are about to be overwritten.
    const prevCustom = extractCustomFont(applied.typography);
    if (prevCustom) setCustomFontBackup(prevCustom);

    const nextApplied = mergeOverrides(applied, patch);
    appliedRef.current = nextApplied;
    setApplied(nextApplied);

    setPreviewData((prev) => {
      if (!prev) return prev;
      const nextToken = mergeThemeOverrides(baseToken ?? prev.design_token, nextApplied);
      return {
        ...prev,
        design_token: ensureReadableText(nextToken),
      };
    });

    setDraftState({});
  }, [enabled, applied, baseToken, setPreviewData]);

  const applyMood = useCallback(
    (
      newMood: string,
      presets: { palettes: { override: ThemeOverrides }[]; fonts: { override: ThemeOverrides }[] },
      brandPalette?: Record<string, string> | null
    ) => {
      if (!enabled) return;

      setUndoStack((prev) => [...prev.slice(-4), applied]);

      const prevCustom = extractCustomFont(applied.typography);
      if (prevCustom) setCustomFontBackup(prevCustom);

      const nextApplied = buildMoodOverrides({
        currentApplied: applied,
        presets,
        newMood,
        brandPalette,
      });

      appliedRef.current = nextApplied;
      setApplied(nextApplied);

      setPreviewData((prev) => {
        if (!prev) return prev;
        const nextToken = mergeThemeOverrides(baseToken ?? prev.design_token, nextApplied);
        return {
          ...prev,
          design_token: ensureReadableText({
            ...nextToken,
            mood: newMood,
          }),
        };
      });

      setDraftState({});
      onMoodChange?.(newMood);
    },
    [enabled, applied, baseToken, setPreviewData, onMoodChange]
  );

  const canUndo = undoStack.length > 0;

  const undo = useCallback(() => {
    if (!enabled || undoStack.length === 0) return;

    const prevSnapshot = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    appliedRef.current = prevSnapshot;
    setApplied(prevSnapshot);
    setDraftState({});

    const restoredMood = prevSnapshot.mood || baseToken?.mood || "clean-modern";
    onMoodChange?.(restoredMood);

    setPreviewData((prev) => {
      if (!prev) return prev;
      const nextToken = mergeThemeOverrides(baseToken ?? prev.design_token, prevSnapshot);
      return {
        ...prev,
        design_token: ensureReadableText({
          ...nextToken,
          mood: restoredMood,
        }),
      };
    });
  }, [enabled, undoStack, baseToken, setPreviewData, onMoodChange]);

  const resetAll = useCallback(() => {
    if (!enabled) return;

    const baseMood = baseToken?.mood || "clean-modern";
    appliedRef.current = {};
    setDraftState({});
    setApplied({});
    setUndoStack([]);
    setCustomFontBackup(null);
    onMoodChange?.(baseMood);

    setPreviewData((prev) => {
      if (!prev || !baseToken) return prev;
      return {
        ...prev,
        design_token: { ...baseToken, mood: baseMood },
      };
    });
  }, [enabled, baseToken, setPreviewData, onMoodChange]);

  const rehydrate = useCallback((savedApplied: ThemeOverrides) => {
    if (!savedApplied || typeof savedApplied !== "object") return;
    const sanitized = stripHeavyOverrides(savedApplied);
    appliedRef.current = sanitized;
    setApplied(sanitized);
    setDraftState({});
    setUndoStack([]);
  }, []);

  const hardReset = useCallback(() => {
    appliedRef.current = {};
    setDraftState({});
    setApplied({});
    setUndoStack([]);
    setCustomFontBackup(null);
  }, []);

  // Dev helper: expose to window in development for testing before UI panel (Phase 3)
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      (window as any).__themeDraft = {
        previewToken,
        hasDraft,
        draft,
        applied,
        customFontBackup,
        setDraft,
        clearDraft,
        commitDraft,
        applyNow,
        applyMood,
        canUndo,
        undo,
        resetAll,
        appliedRef,
        mergeApplied,
        rehydrate,
        hardReset,
      };
    }
  }, [
    previewToken,
    hasDraft,
    draft,
    applied,
    setDraft,
    clearDraft,
    commitDraft,
    applyNow,
    applyMood,
    canUndo,
    undo,
    resetAll,
    mergeApplied,
    rehydrate,
    hardReset,
  ]);

  return {
    previewToken,
    hasDraft,
    draft,
    applied,
    customFontBackup,
    setDraft,
    clearDraft,
    commitDraft,
    applyNow,
    applyMood,
    canUndo,
    undo,
    resetAll,
    appliedRef,
    mergeApplied,
    rehydrate,
    hardReset,
  };
}
