import { useState, useRef, useCallback } from "react";
import { request } from "@/lib/api/client";
import { stripRegeneratedMarkers, cloneData, summarizeDiff } from "../editor-utils";

type PushToast = (title: string, tone?: "success" | "error" | "info", options?: any) => void;

export interface PendingDiff {
  section: string;
  before: any;
  after: any;
  previousDesignToken: any;
  nextDesignToken: any;
  rows: Array<{ label: string; before: string; after: string }>;
}

export interface UndoEntry {
  section: string;
  previousContent: any;
  previousDesignToken: any;
}

export interface EditorAiState {
  aiLoading: boolean;
  pendingDiff: PendingDiff | null;
  undoStack: UndoEntry[];
  aiInstructions: string;
  recentInstructions: string[];
  aiDesignPromptOpen: boolean;
  aiDesignInstructions: string;
  aiPromptModal: { section: string; resolve: (value: string | null) => void } | null;
  aiPromptInput: string;
}

export interface EditorAiActions {
  setAiInstructions: React.Dispatch<React.SetStateAction<string>>;
  setAiDesignPromptOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAiDesignInstructions: React.Dispatch<React.SetStateAction<string>>;
  setAiPromptModal: React.Dispatch<React.SetStateAction<{ section: string; resolve: (v: string | null) => void } | null>>;
  setAiPromptInput: React.Dispatch<React.SetStateAction<string>>;
  setPendingDiff: React.Dispatch<React.SetStateAction<PendingDiff | null>>;
  /** Regenerate a single section with optional custom instructions */
  handleAiRegenerateForSection: (section: string, customInstructions?: string) => Promise<void>;
  /** Regenerate the entire design token */
  handleAiRegenerateDesign: () => Promise<void>;
  /** Accept the pending diff and apply it to content/designToken */
  applyRegeneratedSection: () => void;
  /** Reject the pending diff */
  restorePendingDiff: () => void;
  /** Undo the last accepted AI regen */
  undoLastRegen: () => void;
}

export function useEditorAi(
  token: string | null,
  activeTenantId: number | string | null | undefined,
  siteId: number | null,
  contentRef: React.MutableRefObject<any>,
  designTokenRef: React.MutableRefObject<any>,
  setContent: React.Dispatch<React.SetStateAction<any>>,
  setDesignToken: React.Dispatch<React.SetStateAction<any>>,
  setLatestAiDesignToken: React.Dispatch<React.SetStateAction<any>>,
  setDesignTokenScore: React.Dispatch<React.SetStateAction<number>>,
  setSiteDetails: React.Dispatch<React.SetStateAction<any>>,
  selectSection: (section: string, scrollToPreview?: boolean) => void,
  pushToast: PushToast,
): EditorAiState & EditorAiActions {
  const [aiLoading, setAiLoading] = useState(false);
  const [pendingDiff, setPendingDiff] = useState<PendingDiff | null>(null);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);

  const [aiInstructions, setAiInstructions] = useState("");
  const [recentInstructions, setRecentInstructions] = useState<string[]>([]);
  const [aiDesignPromptOpen, setAiDesignPromptOpen] = useState(false);
  const [aiDesignInstructions, setAiDesignInstructions] = useState("");

  const [aiPromptModal, setAiPromptModal] = useState<{
    section: string;
    resolve: (value: string | null) => void;
  } | null>(null);
  const [aiPromptInput, setAiPromptInput] = useState("");

  // ── helpers ─────────────────────────────────────────────────────────────────
  const rememberInstruction = (instruction: string) => {
    const clean = instruction.trim();
    if (!clean) return;
    setRecentInstructions((current) =>
      [clean, ...current.filter((item) => item !== clean)].slice(0, 5)
    );
  };

  // ── regenerate section ───────────────────────────────────────────────────────
  const handleAiRegenerateForSection = useCallback(async (
    section: string,
    customInstructions?: string,
  ) => {
    const currentContent = contentRef.current;
    if (!token || !activeTenantId || !siteId || !currentContent) return;

    let instructions = customInstructions || aiInstructions;
    if (!instructions.trim()) {
      const input = await new Promise<string | null>((resolve) => {
        setAiPromptInput("");
        setAiPromptModal({ section, resolve });
      });
      if (!input || !input.trim()) return;
      instructions = input;
    }

    try {
      setAiLoading(true);
      const currentVariant = designTokenRef.current?.layout?.section_variants?.[section];
      const res = await request<any>("/ai/regenerate-section", {
        method: "POST",
        body: JSON.stringify({
          site_id: siteId,
          section,
          instructions,
          tenant_id: activeTenantId,
          section_variant: currentVariant || "",
        }),
      }, token);

      if (res.status === "success" && res.data) {
        const sectionData = stripRegeneratedMarkers(
          res.data.section !== undefined ? res.data.section : res.data
        );
        const newDesignToken = res.data.design_token;
        const diffRows = summarizeDiff(currentContent[section], sectionData);

        if (diffRows.length === 0) {
          pushToast("AI belum menghasilkan perubahan nyata.", "info", {
            message:
              "Coba instruksi yang lebih spesifik, misalnya: ubah jadi headline emosional, maksimal 8 kata, dan hilangkan teks input mentah.",
          });
          return;
        }

        rememberInstruction(instructions);
        setPendingDiff({
          section,
          before: cloneData(currentContent[section]),
          after: sectionData,
          previousDesignToken: cloneData(designTokenRef.current),
          nextDesignToken: newDesignToken || null,
          rows: diffRows,
        });
        pushToast(`AI selesai menulis ${section}. Cek diff sebelum dipakai.`, "success");
        setAiInstructions("");
      } else {
        throw new Error(res.message || "AI gagal memproses.");
      }
    } catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") {
        throw err;
      }
      pushToast(err.message || "AI gagal meregenerasi bagian ini.", "error");
    } finally {
      setAiLoading(false);
    }
  }, [token, activeTenantId, siteId, aiInstructions, contentRef, designTokenRef, pushToast]);

  // ── regenerate design ────────────────────────────────────────────────────────
  const handleAiRegenerateDesign = useCallback(async () => {
    if (!token || !activeTenantId || !siteId) return;
    if (!aiDesignInstructions.trim()) return;

    try {
      setAiLoading(true);
      const res = await request<any>("/ai/regenerate-design", {
        method: "POST",
        body: JSON.stringify({
          site_id: siteId,
          instructions: aiDesignInstructions,
          tenant_id: activeTenantId,
        }),
      }, token);

      if (res.status === "success" && res.data?.design_token) {
        const newDesignToken = res.data.design_token;
        const diffRows = summarizeDiff(designTokenRef.current || {}, newDesignToken);

        if (diffRows.length === 0) {
          pushToast("AI belum menghasilkan perubahan gaya yang nyata.", "info");
          return;
        }

        setPendingDiff({
          section: "design",
          before: cloneData(designTokenRef.current),
          after: newDesignToken,
          previousDesignToken: cloneData(designTokenRef.current),
          nextDesignToken: newDesignToken,
          rows: diffRows,
        });

        // Preview the token immediately
        setDesignToken(newDesignToken);
        setLatestAiDesignToken(newDesignToken);
        if (res.data.design_token_score != null) {
          setDesignTokenScore(res.data.design_token_score);
        }

        pushToast(
          "AI selesai mendesain ulang gaya situs. Cek hasil visual sebelum disimpan.",
          "success",
        );
        setAiDesignInstructions("");
        setAiDesignPromptOpen(false);
      } else {
        throw new Error(res.message || "AI gagal memproses desain.");
      }
    } catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") {
        throw err;
      }
      pushToast(err.message || "AI gagal meregenerasi gaya website.", "error");
    } finally {
      setAiLoading(false);
    }
  }, [
    token, activeTenantId, siteId, aiDesignInstructions,
    designTokenRef, setDesignToken, setLatestAiDesignToken, setDesignTokenScore, pushToast,
  ]);

  // ── apply / restore pending diff ─────────────────────────────────────────────
  const applyRegeneratedSection = useCallback(() => {
    if (!pendingDiff) return;

    setUndoStack((current) =>
      [
        {
          section: pendingDiff.section,
          previousContent: cloneData(contentRef.current),
          previousDesignToken: cloneData(designTokenRef.current),
        },
        ...current,
      ].slice(0, 3)
    );

    if (pendingDiff.section !== "design") {
      setContent((prev: any) => ({
        ...prev,
        [pendingDiff.section]: pendingDiff.after,
      }));
    } else {
      setSiteDetails((prev: any) => ({ ...prev, template_id: "TEMPLATE_DYNAMIC" }));
    }

    if (pendingDiff.nextDesignToken) {
      setDesignToken(pendingDiff.nextDesignToken);
      setLatestAiDesignToken(pendingDiff.nextDesignToken);
    }

    setPendingDiff(null);
    pushToast(
      `Hasil AI untuk ${pendingDiff.section === "design" ? "gaya situs" : pendingDiff.section} dipakai.`,
      "success",
    );
  }, [
    pendingDiff, contentRef, designTokenRef,
    setContent, setDesignToken, setLatestAiDesignToken, setSiteDetails, pushToast,
  ]);

  const restorePendingDiff = useCallback(() => {
    if (!pendingDiff) return;
    if (pendingDiff.previousDesignToken) {
      setDesignToken(pendingDiff.previousDesignToken);
    }
    setPendingDiff(null);
    pushToast("Hasil AI dibatalkan.", "info");
  }, [pendingDiff, setDesignToken, pushToast]);

  // ── undo last regen ──────────────────────────────────────────────────────────
  const undoLastRegen = useCallback(() => {
    const latest = undoStack[0];
    if (!latest) return;
    setContent(latest.previousContent);
    setDesignToken(latest.previousDesignToken);
    setUndoStack((current) => current.slice(1));
    selectSection(latest.section, true);
    pushToast(`Perubahan AI pada ${latest.section} dikembalikan.`, "success");
  }, [undoStack, setContent, setDesignToken, selectSection, pushToast]);

  return {
    // state
    aiLoading,
    pendingDiff,
    undoStack,
    aiInstructions,
    recentInstructions,
    aiDesignPromptOpen,
    aiDesignInstructions,
    aiPromptModal,
    aiPromptInput,
    // actions
    setAiInstructions,
    setAiDesignPromptOpen,
    setAiDesignInstructions,
    setAiPromptModal,
    setAiPromptInput,
    setPendingDiff,
    handleAiRegenerateForSection,
    handleAiRegenerateDesign,
    applyRegeneratedSection,
    restorePendingDiff,
    undoLastRegen,
  };
}
