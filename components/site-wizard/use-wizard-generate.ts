"use client";

import { useState, useRef, useCallback } from "react";
import { useGenerateStream, StreamSection, FieldIssue } from "@/hooks/use-generate-stream";
import { PENDING_KEY } from "./constants";

export interface GenerateCallbacks {
  onDesignToken: (token: Record<string, any>) => void;
  onSection: (section: StreamSection, data: Record<string, any>) => void;
  onDone: (templateId: string, qualityScore: number, qualityIssues?: FieldIssue[]) => void;
  onError: (message: string) => void;
}

export function useWizardGenerate(callbacks: GenerateCallbacks) {
  const [tooManyRequests, setTooManyRequests] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const didGenerateRef = useRef(false);
  const hasPromptedDetailsRef = useRef(false);

  const { startStream, cancelStream } = useGenerateStream({
    onDesignToken: callbacks.onDesignToken,
    onSection: callbacks.onSection,
    onDone: callbacks.onDone,
    onError: callbacks.onError,
  });


  const handleCancelGenerationError = useCallback(() => {
    cancelStream();
    setTooManyRequests(false);
    setGenerationError(null);
  }, [cancelStream]);

  const handleRetryGeneration = useCallback((onGenerate: () => void) => {
    setTooManyRequests(false);
    setGenerationError(null);
    didGenerateRef.current = true;
    onGenerate();
  }, []);

  return {
    startStream,
    cancelStream,
    tooManyRequests,
    setTooManyRequests,
    generationError,
    setGenerationError,
    didGenerateRef,
    hasPromptedDetailsRef,
    handleCancelGenerationError,
    handleRetryGeneration,
  };
}
