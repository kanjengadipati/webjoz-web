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
} from "@/lib/theme-overrides";

export interface UseThemeDraftArgs {
  previewData: PreviewData | null;
  setPreviewData: React.Dispatch<React.SetStateAction<PreviewData | null>>;
  baseToken: Record<string, any> | null;
  enabled: boolean;
  resetKey: string | number;
}

export interface UseThemeDraftReturn {
  previewToken: Record<string, any> | null;
  hasDraft: boolean;
  draft: ThemeOverrides;
  applied: ThemeOverrides;

  setDraft: (patch: ThemeOverrides) => void;
  clearDraft: () => void;
  commitDraft: () => void;
  applyNow: (patch: ThemeOverrides, label?: string) => void;

  canUndo: boolean;
  undo: () => void;
  resetAll: () => void;

  appliedRef: React.MutableRefObject<ThemeOverrides>;
  mergeApplied: (token: Record<string, any>) => Record<string, any>;
  rehydrate: (applied: ThemeOverrides) => void;
  hardReset: () => void;
  lastCustomTypography: ThemeOverrides["typography"] | null;
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
  return result;
}

export function useThemeDraft({
  previewData,
  setPreviewData,
  baseToken,
  enabled,
  resetKey,
}: UseThemeDraftArgs): UseThemeDraftReturn {
  const [draft, setDraftState] = useState<ThemeOverrides>({});
  const [applied, setApplied] = useState<ThemeOverrides>({});
  const [undoStack, setUndoStack] = useState<ThemeOverrides[]>([]);
  const [lastCustomTypography, setLastCustomTypography] = useState<ThemeOverrides["typography"] | null>(null);

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

    const nextApplied = mergeOverrides(applied, draft);
    appliedRef.current = nextApplied;
    setApplied(nextApplied);
    const typo = nextApplied.typography;
    if (typo && (typo.heading_font_url || typo.body_font_url)) {
      setLastCustomTypography(typo);
    }

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

    const nextApplied = mergeOverrides(applied, patch);
    appliedRef.current = nextApplied;
    setApplied(nextApplied);
    const typo = nextApplied.typography;
    if (typo && (typo.heading_font_url || typo.body_font_url)) {
      setLastCustomTypography(typo);
    }

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

  const canUndo = undoStack.length > 0;

  const undo = useCallback(() => {
    if (!enabled || undoStack.length === 0) return;

    const prevSnapshot = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    appliedRef.current = prevSnapshot;
    setApplied(prevSnapshot);
    setDraftState({});

    setPreviewData((prev) => {
      if (!prev) return prev;
      const nextToken = mergeThemeOverrides(baseToken ?? prev.design_token, prevSnapshot);
      return {
        ...prev,
        design_token: ensureReadableText(nextToken),
      };
    });
  }, [enabled, undoStack, baseToken, setPreviewData]);

  const resetAll = useCallback(() => {
    if (!enabled) return;

    appliedRef.current = {};
    setDraftState({});
    setApplied({});
    setUndoStack([]);
    setLastCustomTypography(null);

    setPreviewData((prev) => {
      if (!prev || !baseToken) return prev;
      return {
        ...prev,
        design_token: { ...baseToken },
      };
    });
  }, [enabled, baseToken, setPreviewData]);

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
    setLastCustomTypography(null);
  }, []);

  // Dev helper: expose to window in development for testing before UI panel (Phase 3)
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      (window as any).__themeDraft = {
        previewToken,
        hasDraft,
        draft,
        applied,
        setDraft,
        clearDraft,
        commitDraft,
        applyNow,
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
    setDraft,
    clearDraft,
    commitDraft,
    applyNow,
    canUndo,
    undo,
    resetAll,
    appliedRef,
    mergeApplied,
    rehydrate,
    hardReset,
    lastCustomTypography,
  };
}
