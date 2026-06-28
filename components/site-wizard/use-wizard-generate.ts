"use client";

import { useState, useRef, useCallback } from "react";
import { useGenerateStream } from "@/hooks/use-generate-stream";
import { PENDING_KEY } from "./constants";

export interface GenerateCallbacks {
  onDesignToken: (token: Record<string, any>) => void;
  onSection: (section: string, data: Record<string, any>) => void;
  onDone: (templateId: string, qualityScore: number) => void;
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

  // Also update refs when callbacks change
  const onDesignTokenRef = useRef(callbacks.onDesignToken);
  const onSectionRef = useRef(callbacks.onSection);
  const onDoneRef = useRef(callbacks.onDone);
  const onErrorRef = useRef(callbacks.onError);
  onDesignTokenRef.current = callbacks.onDesignToken;
  onSectionRef.current = callbacks.onSection;
  onDoneRef.current = callbacks.onDone;
  onErrorRef.current = callbacks.onError;

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
