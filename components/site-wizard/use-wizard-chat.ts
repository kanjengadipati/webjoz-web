"use client";

import { useState, useEffect, useRef } from "react";
import { INITIAL_MESSAGE, NAME_ACK_VARIANTS, NAME_CONFIRM_VARIANTS, DESCRIPTION_PROMPT, DESCRIPTION_SKIP_KEYWORD, DESCRIPTION_INFERENCE_HIGH, DESCRIPTION_INFERENCE_MEDIUM, DESCRIPTION_INFERENCE_NONE } from "./constants";

const INITIAL_MESSAGE_WORDS = INITIAL_MESSAGE.split(" ");
import { capitalizeWords, pickVariant, isLikelyGibberish, suggestTypeFromName, inferTypeFromDescription, extractLocationFromDescription } from "./helpers";
import type { Message, ChatStage, InferenceResult } from "./types";

export function useWizardChat() {
  const [chatStage, setChatStage] = useState<ChatStage>("name");
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", sender: "ai", text: INITIAL_MESSAGE },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [initialWordCount, setInitialWordCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const subTypeRef = useRef<HTMLDivElement>(null);
  const isInitialTyping = chatStage === "name" && initialWordCount < INITIAL_MESSAGE_WORDS.length;

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessSubType, setBusinessSubType] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [serviceArea, setServiceArea] = useState("");

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [awaitingNameConfirm, setAwaitingNameConfirm] = useState(false);
  const [suggestedHint, setSuggestedHint] = useState<{ type?: string; subType?: string } | null>(null);
  const [inferenceResult, setInferenceResult] = useState<InferenceResult | null>(null);
  const [awaitingInferenceConfirm, setAwaitingInferenceConfirm] = useState(false);
  const [typeWasInferred, setTypeWasInferred] = useState(false);

  const hasAskedNameConfirmRef = useRef(false);

  // Refs for stale closure protection (synced by callers via syncChatRefs)
  const businessNameRef = useRef(businessName);
  const businessTypeRef = useRef(businessType);
  const businessSubTypeRef = useRef(businessSubType);
  const descriptionRef = useRef(description);
  const whatsappRef = useRef(whatsapp);
  const serviceAreaRef = useRef(serviceArea);

  useEffect(() => { businessNameRef.current = businessName; }, [businessName]);
  useEffect(() => { businessTypeRef.current = businessType; }, [businessType]);
  useEffect(() => { businessSubTypeRef.current = businessSubType; }, [businessSubType]);
  useEffect(() => { descriptionRef.current = description; }, [description]);
  useEffect(() => { whatsappRef.current = whatsapp; }, [whatsapp]);
  useEffect(() => { serviceAreaRef.current = serviceArea; }, [serviceArea]);

  // Chat auto-scroll
  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, chatStage]);

  // Initial typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setInitialWordCount((count) => {
        if (count >= INITIAL_MESSAGE_WORDS.length) {
          clearInterval(interval);
          return count;
        }
        return count + 1;
      });
    }, 130);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (!isInitialTyping && !isAiTyping && (chatStage === "name" || chatStage === "description")) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isInitialTyping, isAiTyping, chatStage]);

  const typeMessage = (fullText: string, onComplete: () => void) => {
    let idx = 0;
    const typingId = 'typing';
    setIsAiTyping(true);
    const interval = setInterval(() => {
      idx++;
      const partial = fullText.slice(0, idx);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== typingId);
        return [...filtered, { id: typingId, sender: "ai", text: partial }];
      });
      if (idx >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== typingId);
          return [...filtered, { id: Date.now().toString(), sender: "ai", text: fullText }];
        });
        setIsAiTyping(false);
        onComplete();
      }
    }, 30);
  };

  const handleSelectType = (type: string) => {
    setBusinessType(type);
    setBusinessSubType("");
    setTypeWasInferred(false);
    setInputValue("");
    setTimeout(() => {
      subTypeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
  };

  const handleSelectSubType = (
    subType: string,
    onGenerate: (name: string, type: string, overrides: any) => void
  ) => {
    setBusinessSubType(subType);
    setInputValue("");

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: subType },
      { id: `ai-${Date.now()}`, sender: "ai", text: "Baik, AI sedang menyiapkan website Anda..." },
    ]);

    setChatStage("done");

    onGenerate(businessName, businessType, { businessSubType: subType });
  };

  const handleConfirmInference = (
    confirmed: boolean,
    onGenerate: (name: string, type: string, overrides: any) => void
  ) => {
    setAwaitingInferenceConfirm(false);
    if (confirmed && inferenceResult?.type && inferenceResult?.subType) {
      setBusinessType(inferenceResult.type);
      setBusinessSubType(inferenceResult.subType);
      const subType = inferenceResult.subType;
      setMessages((prev) => [
        ...prev,
        { id: `ai-done-${Date.now()}`, sender: "ai", text: "Baik, AI sedang menyiapkan website Anda..." },
      ]);
      setChatStage("done");
      onGenerate(businessName, inferenceResult.type, { businessSubType: subType, description: description });
    } else {
      const inferredType = inferenceResult?.type || "";
      if (inferredType) setBusinessType(inferredType);
      setInferenceResult({ confidence: "low" } as InferenceResult);
      setTimeout(() => {
        typeMessage("Baik, silakan pilih yang lebih tepat:", () => {
          setMessages((prev) => [
            ...prev,
            { id: `widget-type-chips-${Date.now()}`, sender: "ai", text: "", widget: "type-chips" as const },
          ]);
          setChatStage("type");
        });
      }, 300);
    }
  };

  const handleSendText = (
    e: React.FormEvent,
    onGenerate: (name: string, type: string, overrides: any) => void
  ) => {
    e.preventDefault();
    if (isInitialTyping) return;
    if (!inputValue.trim() && chatStage !== "description") return;
    const val = inputValue.trim();
    setInputValue("");

    if (chatStage === "name") {
      const capitalized = capitalizeWords(val);

      if (awaitingNameConfirm) {
        const lower = val.toLowerCase();
        const isConfirm = ["ya", "y", "yes", "oke", "ok"].includes(lower);
        if (!isConfirm) setBusinessName(capitalized);
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: val }]);
        setAwaitingNameConfirm(false);
        setTimeout(() => {
          typeMessage(pickVariant(NAME_ACK_VARIANTS), () => {
            setMessages((prev) => [
              ...prev,
              { id: `ai-desc-${Date.now()}`, sender: "ai", text: DESCRIPTION_PROMPT },
            ]);
            setChatStage("description");
          });
        }, 500);
        return;
      }

      setBusinessName(capitalized);
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: val }]);

      const flagged = isLikelyGibberish(val);
      const hint = suggestTypeFromName(capitalized);
      setSuggestedHint(hint);

      if (flagged && !hasAskedNameConfirmRef.current) {
        hasAskedNameConfirmRef.current = true;
        setAwaitingNameConfirm(true);
        setTimeout(() => {
          typeMessage(pickVariant(NAME_CONFIRM_VARIANTS), () => {});
        }, 500);
        return;
      }

      setTimeout(() => {
        typeMessage(pickVariant(NAME_ACK_VARIANTS), () => {
          setMessages((prev) => [
            ...prev,
            { id: `ai-desc-${Date.now()}`, sender: "ai", text: DESCRIPTION_PROMPT },
          ]);
          setChatStage("description");
        });
      }, 500);
    }

    if (chatStage === "description") {
      const isSkip = !val.trim() || val.toLowerCase().trim() === DESCRIPTION_SKIP_KEYWORD;
      if (isSkip) {
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: "Lanjut" }]);
        setInferenceResult({ confidence: "low" } as InferenceResult);
        setTimeout(() => {
          typeMessage(DESCRIPTION_INFERENCE_NONE, () => {
            setMessages((prev) => [
              ...prev,
              { id: `widget-type-chips-${Date.now()}`, sender: "ai", text: "", widget: "type-chips" as const },
            ]);
            setChatStage("type");
          });
        }, 500);
        return;
      }

      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: val }]);

      setDescription(val);

      // Extract location from description and pre-fill service area if not yet set
      if (!serviceArea) {
        const detected = extractLocationFromDescription(val);
        if (detected) setServiceArea(detected);
      }

      const result = inferTypeFromDescription(val);
      setInferenceResult(result);

      if (result.confidence === "high" && result.type && result.subType) {
        setAwaitingInferenceConfirm(true);
        const confirmMsg = DESCRIPTION_INFERENCE_HIGH.replace("%s", result.type!).replace("%s", result.subType!);
        setTimeout(() => {
          typeMessage(confirmMsg, () => {
            setMessages((prev) => [
              ...prev,
              { id: `widget-inference-confirm-${Date.now()}`, sender: "ai", text: "", widget: "inference-confirm" as const },
            ]);
          });
        }, 500);
        return;
      }

      if (result.confidence === "medium" && result.type) {
        setBusinessType(result.type);
        setTypeWasInferred(true);
        setTimeout(() => {
          const medMsg = DESCRIPTION_INFERENCE_MEDIUM.replace("%s", result.type!);
          typeMessage(medMsg, () => {
            setMessages((prev) => [
              ...prev,
              { id: `widget-subtype-chips-${Date.now()}`, sender: "ai", text: "", widget: "subtype-chips" as const },
            ]);
            setChatStage("type");
          });
        }, 500);
        return;
      }

      setInferenceResult({ confidence: "low" } as InferenceResult);
      setTimeout(() => {
        typeMessage(DESCRIPTION_INFERENCE_NONE, () => {
          setMessages((prev) => [
            ...prev,
            { id: `widget-type-chips-${Date.now()}`, sender: "ai", text: "", widget: "type-chips" as const },
          ]);
          setChatStage("type");
        });
      }, 500);
    }
  };

  const syncChatRefs = (overrides: {
    businessName?: string;
    businessType?: string;
    businessSubType?: string;
    description?: string;
    whatsapp?: string;
    serviceArea?: string;
  }) => {
    if (overrides.businessName !== undefined) businessNameRef.current = overrides.businessName;
    if (overrides.businessType !== undefined) businessTypeRef.current = overrides.businessType;
    if (overrides.businessSubType !== undefined) businessSubTypeRef.current = overrides.businessSubType;
    if (overrides.description !== undefined) descriptionRef.current = overrides.description;
    if (overrides.whatsapp !== undefined) whatsappRef.current = overrides.whatsapp;
    if (overrides.serviceArea !== undefined) serviceAreaRef.current = overrides.serviceArea;
  };

  return {
    // State
    chatStage,
    setChatStage,
    messages,
    setMessages,
    inputValue,
    setInputValue,
    initialWordCount,
    businessName,
    setBusinessName,
    businessType,
    setBusinessType,
    businessSubType,
    setBusinessSubType,
    description,
    setDescription,
    whatsapp,
    setWhatsapp,
    serviceArea,
    setServiceArea,
    isAiTyping,
    isInitialTyping,
    awaitingNameConfirm,
    suggestedHint,
    inferenceResult,
    awaitingInferenceConfirm,
    typeWasInferred,
    setTypeWasInferred,
    // Refs
    inputRef,
    chatEndRef,
    subTypeRef,
    businessNameRef,
    businessTypeRef,
    businessSubTypeRef,
    descriptionRef,
    whatsappRef,
    serviceAreaRef,
    // Handlers
    handleSendText,
    handleSelectType,
    handleSelectSubType,
    handleConfirmInference,
    typeMessage,
    // Utilities
    syncChatRefs,
  };
}
