"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { INITIAL_MESSAGE, NAME_ACK_VARIANTS, NAME_CONFIRM_VARIANTS, DESCRIPTION_PROMPT, DESCRIPTION_SKIP_KEYWORD, DESCRIPTION_INFERENCE_HIGH, DESCRIPTION_INFERENCE_MEDIUM, DESCRIPTION_INFERENCE_NONE, MOOD_OPTIONS } from "./constants";

const INITIAL_MESSAGE_WORDS = INITIAL_MESSAGE.split(" ");
import { capitalizeWords, pickVariant, isLikelyGibberish, suggestTypeFromName, inferTypeFromDescription, extractLocationFromDescription } from "./helpers";
import type { Message, ChatStage, InferenceResult } from "./types";
import type { WizardResumeChat } from "./wizard-persistence";
import { useI18n } from "@/lib/i18n/context";

export function useWizardChat(prefill?: { businessType?: string; businessSubType?: string }) {
  const { t, locale } = useI18n();
  const initialMessageText = t("dashboard.wizard.initialMessage", INITIAL_MESSAGE);
  const initialMessageWords = useMemo(() => initialMessageText.split(" "), [initialMessageText]);
  const nameAckVariants = (t("dashboard.wizard.nameAckVariants") as unknown as string[]) || NAME_ACK_VARIANTS;
  const nameConfirmVariants = (t("dashboard.wizard.nameConfirmVariants") as unknown as string[]) || NAME_CONFIRM_VARIANTS;

  const [chatStage, setChatStage] = useState<ChatStage>("name");
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", sender: "ai", text: initialMessageText },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [initialWordCount, setInitialWordCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const subTypeRef = useRef<HTMLDivElement>(null);
  const isInitialTyping = chatStage === "name" && initialWordCount < initialMessageWords.length;

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState(prefill?.businessType ?? "");
  const [businessSubType, setBusinessSubType] = useState(prefill?.businessSubType ?? "");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [mood, setMood] = useState("");
  const [siteLanguage, setSiteLanguage] = useState<"id" | "en" | null>(null);

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [awaitingNameConfirm, setAwaitingNameConfirm] = useState(false);
  const [suggestedHint, setSuggestedHint] = useState<{ type?: string; subType?: string } | null>(null);
  const [inferenceResult, setInferenceResult] = useState<InferenceResult | null>(null);
  const [awaitingInferenceConfirm, setAwaitingInferenceConfirm] = useState(false);
  const [typeWasInferred, setTypeWasInferred] = useState(false);
  // ID pesan bubble user yang berisi nama bisnis — dipakai untuk tombol "Ubah nama"
  const [nameMessageId, setNameMessageId] = useState<string>("");

  // ── Voice Input (STT) ──
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t("dashboard.wizard.voiceNotAvailable", "Browser Anda tidak mendukung fitur Voice/STT."));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = locale === "id" ? "id-ID" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInputValue(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setIsRecording(true);
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const hasAskedNameConfirmRef = useRef(false);

  // Refs for stale closure protection (synced by callers via syncChatRefs)
  const businessNameRef = useRef(businessName);
  const businessTypeRef = useRef(businessType);
  const businessSubTypeRef = useRef(businessSubType);
  const descriptionRef = useRef(description);
  const whatsappRef = useRef(whatsapp);
  const serviceAreaRef = useRef(serviceArea);
  const moodRef = useRef(mood);
  const siteLanguageRef = useRef<"id" | "en" | null>(null);
  const activeTypingCancellerRef = useRef<(() => void) | null>(null);

  useEffect(() => { businessNameRef.current = businessName; }, [businessName]);
  useEffect(() => { moodRef.current = mood; }, [mood]);

  // Cancel any active typing animation on unmount
  useEffect(() => {
    return () => {
      if (activeTypingCancellerRef.current) {
        activeTypingCancellerRef.current();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  useEffect(() => { businessTypeRef.current = businessType; }, [businessType]);
  useEffect(() => { businessSubTypeRef.current = businessSubType; }, [businessSubType]);
  useEffect(() => { descriptionRef.current = description; }, [description]);
  useEffect(() => { whatsappRef.current = whatsapp; }, [whatsapp]);
  useEffect(() => { serviceAreaRef.current = serviceArea; }, [serviceArea]);
  useEffect(() => { siteLanguageRef.current = siteLanguage; }, [siteLanguage]);

  // Chat auto-scroll
  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, chatStage]);

  // Sync init message if locale changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === "init" ? { ...msg, text: initialMessageText } : msg))
    );
    setInitialWordCount(0);
  }, [initialMessageText]);

  // Initial typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setInitialWordCount((count) => {
        if (count >= initialMessageWords.length) {
          clearInterval(interval);
          return count;
        }
        return count + 1;
      });
    }, 130);
    return () => clearInterval(interval);
  }, [initialMessageWords.length]);

  // Auto-focus input
  useEffect(() => {
    if (!isInitialTyping && !isAiTyping && (chatStage === "name" || chatStage === "description")) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isInitialTyping, isAiTyping, chatStage]);

  const typeMessage = (fullText: string, onComplete: () => void): (() => void) => {
    if (activeTypingCancellerRef.current) {
      activeTypingCancellerRef.current();
    }

    let idx = 0;
    let cancelled = false;
    const typingId = 'typing';
    setIsAiTyping(true);

    const interval = setInterval(() => {
      if (cancelled) {
        clearInterval(interval);
        return;
      }
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
        activeTypingCancellerRef.current = null;
        onComplete();
      }
    }, 30);

    const cancel = () => {
      cancelled = true;
      clearInterval(interval);
      if (activeTypingCancellerRef.current === cancel) {
        activeTypingCancellerRef.current = null;
      }
    };

    activeTypingCancellerRef.current = cancel;
    return cancel;
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
    _onGenerate: (name: string, type: string, overrides: any) => void
  ) => {
    setBusinessSubType(subType);
    setInputValue("");

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: t(`dashboard.wizard.subtypes.${subType}`, subType) },
    ]);

    setChatStage("language");
    setTimeout(() => {
      typeMessage(t("dashboard.wizard.selectLanguagePrompt", "Dalam bahasa apa website ini dibuat?"), () => {
        setMessages((prev) => [
          ...prev,
          { id: `widget-language-chips-${Date.now()}`, sender: "ai", text: "", widget: "language-chips" as const },
        ]);
      });
    }, 500);
  };

  const handleSelectLanguage = (
    lang: "id" | "en"
  ) => {
    setSiteLanguage(lang);
    setInputValue("");
    siteLanguageRef.current = lang;

    const displayText = lang === "en" ? "🇬🇧 English" : "🇮🇩 Indonesia";
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: displayText },
    ]);

    setChatStage("mood");
    setTimeout(() => {
      typeMessage(t("dashboard.wizard.selectMoodPrompt", "Pilih suasana (mood) yang cocok untuk website Anda:"), () => {
        setMessages((prev) => [
          ...prev,
          { id: `widget-mood-chips-${Date.now()}`, sender: "ai", text: "", widget: "mood-chips" as const },
        ]);
      });
    }, 500);
  };

  const handleSelectMood = (
    selectedMood: string,
    onGenerate: (name: string, type: string, overrides: any) => void
  ) => {
    setMood(selectedMood);
    setInputValue("");

    const moodItem = MOOD_OPTIONS.find((m) => m.value === selectedMood);
    const moodKeyMap: Record<string, string> = {
      "clean-modern": "modernClean",
      "warm-earthy": "warmVintage",
      "bold-vibrant": "playfulFun",
      "dark-premium": "elegantLuxury",
      "bold-dark": "boldEnergetic",
      "retro": "retro",
      "futuristic": "futuristic",
    };
    const moodKey = moodItem ? moodKeyMap[moodItem.value] : undefined;
    const translatedMoodLabel = moodKey ? t(`dashboard.wizard.moods.${moodKey}`, moodItem?.label ?? selectedMood) : (moodItem?.label ?? selectedMood);
    const displayText = moodItem ? `${moodItem.emoji} ${translatedMoodLabel}` : selectedMood;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: displayText },
      { id: `ai-${Date.now()}`, sender: "ai", text: t("dashboard.wizard.preparingWebsite", "Baik, AI sedang menyiapkan website Anda...") },
    ]);

    setChatStage("done");

    onGenerate(businessName, businessType, { businessSubType, mood: selectedMood, language: siteLanguageRef.current || siteLanguage || "id" });
  };

  const handleConfirmInference = (
    confirmed: boolean,
    onGenerate: (name: string, type: string, overrides: any) => void
  ) => {
    setAwaitingInferenceConfirm(false);
    if (confirmed && inferenceResult?.type && inferenceResult?.subType) {
      setBusinessType(inferenceResult.type);
      setBusinessSubType(inferenceResult.subType);
      setMessages((prev) => [
        ...prev,
        { id: `ai-lang-${Date.now()}`, sender: "ai", text: t("dashboard.wizard.selectLanguagePrompt", "Dalam bahasa apa website ini dibuat?") },
      ]);
      setChatStage("language");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: `widget-language-chips-${Date.now()}`, sender: "ai", text: "", widget: "language-chips" as const },
        ]);
      }, 500);
    } else {
      const inferredType = inferenceResult?.type || "";
      if (inferredType) setBusinessType(inferredType);
      setInferenceResult({ confidence: "low" } as InferenceResult);
      setTimeout(() => {
        typeMessage(t("dashboard.wizard.chooseMoreAppropriate", "Baik, silakan pilih yang lebih tepat:"), () => {
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
          typeMessage(`${pickVariant(nameAckVariants)} ${t("dashboard.wizard.descriptionPrompt", DESCRIPTION_PROMPT)}`, () => {
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
          typeMessage(pickVariant(nameConfirmVariants), () => { });
        }, 500);
        return;
      }

      setTimeout(() => {
        if (prefill?.businessType && prefill?.businessSubType) {
          // Prefill dari galeri dibawa — tapi jangan di-skip: tampilkan chip
          // jenis bisnis yang sudah terpilih supaya user bisa mengoreksinya
          // sebelum lanjut ke bahasa/generate.
          typeMessage(`${pickVariant(nameAckVariants)} ${t("dashboard.wizard.prefillTypePrompt", "Saya sudah memperkirakan jenis bisnis Anda di bawah. Lanjutkan jika sesuai, atau ubah dulu:")}`, () => {
            setMessages((prev) => [
              ...prev,
              { id: `widget-type-chips-${Date.now()}`, sender: "ai", text: "", widget: "type-chips" as const },
            ]);
            setChatStage("type");
          });
        } else {
          typeMessage(`${pickVariant(nameAckVariants)} ${t("dashboard.wizard.descriptionPrompt", DESCRIPTION_PROMPT)}`, () => {
            setChatStage("description");
          });
        }
      }, 500);
    }

    if (chatStage === "description") {
      const isSkip = !val.trim() || val.toLowerCase().trim() === DESCRIPTION_SKIP_KEYWORD || val.toLowerCase().trim() === t("dashboard.wizard.descriptionSkipKeyword", "lewat");
      if (isSkip) {
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: t("dashboard.wizard.btnNext", "Lanjut") }]);
        setInferenceResult({ confidence: "low" } as InferenceResult);
        setTimeout(() => {
          typeMessage(t("dashboard.wizard.descriptionInferenceNone", DESCRIPTION_INFERENCE_NONE), () => {
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
        const confirmMsg = t("dashboard.wizard.descriptionInferenceHigh", undefined, { type: result.type ?? "", subType: result.subType ?? "" });
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
          const medMsg = t("dashboard.wizard.descriptionInferenceMedium", undefined, { type: result.type ?? "" });
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
        typeMessage(t("dashboard.wizard.descriptionInferenceNone", DESCRIPTION_INFERENCE_NONE), () => {
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
    mood?: string;
  }) => {
    if (overrides.businessName !== undefined) businessNameRef.current = overrides.businessName;
    if (overrides.businessType !== undefined) businessTypeRef.current = overrides.businessType;
    if (overrides.businessSubType !== undefined) businessSubTypeRef.current = overrides.businessSubType;
    if (overrides.description !== undefined) descriptionRef.current = overrides.description;
    if (overrides.whatsapp !== undefined) whatsappRef.current = overrides.whatsapp;
    if (overrides.serviceArea !== undefined) serviceAreaRef.current = overrides.serviceArea;
    if (overrides.mood !== undefined) moodRef.current = overrides.mood;
  };

  const hydrate = (snap: WizardResumeChat) => {
    setChatStage(snap.chatStage);
    setMessages(
      Array.isArray(snap.messages) && snap.messages.length > 0
        ? snap.messages
        : [{ id: "init", sender: "ai", text: initialMessageText }]
    );
    setInitialWordCount(initialMessageWords.length);
    setBusinessName(snap.businessName ?? "");
    setBusinessType(snap.businessType ?? "");
    setBusinessSubType(snap.businessSubType ?? "");
    setDescription(snap.description ?? "");
    setWhatsapp(snap.whatsapp ?? "");
    setServiceArea(snap.serviceArea ?? "");
    setMood(snap.mood ?? "");
    setSiteLanguage(snap.siteLanguage ?? null);
    setAwaitingNameConfirm(!!snap.awaitingNameConfirm);
    setAwaitingInferenceConfirm(!!snap.awaitingInferenceConfirm);
    setInferenceResult(snap.inferenceResult ?? null);
    setSuggestedHint(snap.suggestedHint ?? null);
    setTypeWasInferred(!!snap.typeWasInferred);

    if (snap.chatStage !== "name") hasAskedNameConfirmRef.current = true;
    businessNameRef.current = snap.businessName ?? "";
    businessTypeRef.current = snap.businessType ?? "";
    businessSubTypeRef.current = snap.businessSubType ?? "";
    descriptionRef.current = snap.description ?? "";
    whatsappRef.current = snap.whatsapp ?? "";
    serviceAreaRef.current = snap.serviceArea ?? "";
    moodRef.current = snap.mood ?? "";
    siteLanguageRef.current = snap.siteLanguage ?? null;
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
    initialMessageText,
    initialMessageWords,
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
    mood,
    setMood,
    siteLanguage,
    setSiteLanguage,
    isAiTyping,
    isInitialTyping,
    awaitingNameConfirm,
    suggestedHint,
    inferenceResult,
    awaitingInferenceConfirm,
    typeWasInferred,
    setTypeWasInferred,
    // Voice Input
    isRecording,
    startRecording,
    stopRecording,
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
    moodRef,
    siteLanguageRef,
    // Handlers
    handleSendText,
    handleSelectType,
    handleSelectSubType,
    handleSelectLanguage,
    handleSelectMood,
    handleConfirmInference,
    typeMessage,
    // Utilities
    syncChatRefs,
    hydrate,
  };
}
