"use client";

import { useState, useRef, useEffect, useMemo, useDeferredValue, useCallback } from "react";
import type { PreviewData } from "./types";
import {
  type ThemeOverrides,
  mergeThemeOverrides,
  isEmptyOverrides,
  overridesEqual,
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

  // Throttle draft evaluation using useDeferredValue to keep 60fps during rapid slider/color input
  const deferredDraft = useDeferredValue(draft);

  // Clear draft when resetKey changes (new generation or history navigation)
  const prevResetKeyRef = useRef(resetKey);
  useEffect(() => {
    if (prevResetKeyRef.current !== resetKey) {
      prevResetKeyRef.current = resetKey;
      setDraftState({});
      // TODO (Fase 2): perlakuan applied setelah generate ulang / navigasi riwayat
    }
  }, [resetKey]);

  // Combined token for preview rendering
  const previewToken = useMemo(() => {
    if (!enabled || !baseToken) {
      return baseToken ?? previewData?.design_token ?? null;
    }
    return mergeThemeOverrides(baseToken, applied, deferredDraft);
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
    setApplied(nextApplied);

    setPreviewData((prev) => {
      if (!prev) return prev;
      const nextToken = mergeThemeOverrides(baseToken ?? prev.design_token, nextApplied);
      return {
        ...prev,
        design_token: nextToken,
      };
    });

    setDraftState({});
  }, [enabled, draft, applied, baseToken, setPreviewData]);

  const applyNow = useCallback((patch: ThemeOverrides, _label?: string) => {
    if (!enabled || isEmptyOverrides(patch)) return;

    setUndoStack((prev) => [...prev.slice(-4), applied]);

    const nextApplied = mergeOverrides(applied, patch);
    setApplied(nextApplied);

    setPreviewData((prev) => {
      if (!prev) return prev;
      const nextToken = mergeThemeOverrides(baseToken ?? prev.design_token, nextApplied);
      return {
        ...prev,
        design_token: nextToken,
      };
    });

    setDraftState({});
  }, [enabled, applied, baseToken, setPreviewData]);

  const canUndo = undoStack.length > 0;

  const undo = useCallback(() => {
    if (!enabled || undoStack.length === 0) return;

    const prevSnapshot = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setApplied(prevSnapshot);
    setDraftState({});

    setPreviewData((prev) => {
      if (!prev) return prev;
      const nextToken = mergeThemeOverrides(baseToken ?? prev.design_token, prevSnapshot);
      return {
        ...prev,
        design_token: nextToken,
      };
    });
  }, [enabled, undoStack, baseToken, setPreviewData]);

  const resetAll = useCallback(() => {
    if (!enabled) return;

    setDraftState({});
    setApplied({});
    setUndoStack([]);

    setPreviewData((prev) => {
      if (!prev || !baseToken) return prev;
      return {
        ...prev,
        design_token: { ...baseToken },
      };
    });
  }, [enabled, baseToken, setPreviewData]);

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
  };
}

