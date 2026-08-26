"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { INITIAL_MESSAGE, NAME_ACK_VARIANTS, NAME_CONFIRM_VARIANTS, DESCRIPTION_PROMPT, DESCRIPTION_SKIP_KEYWORD, DESCRIPTION_INFERENCE_HIGH, DESCRIPTION_INFERENCE_MEDIUM, DESCRIPTION_INFERENCE_NONE, MOOD_OPTIONS } from "./constants";

const INITIAL_MESSAGE_WORDS = INITIAL_MESSAGE.split(" ");
import { capitalizeWords, pickVariant, isLikelyGibberish, suggestTypeFromName, inferTypeFromDescription, extractLocationFromDescription } from "./helpers";
import type { Message, ChatStage, InferenceResult } from "./types";
import type { WizardResumeChat } from "./wizard-persistence";
import { useI18n } from "@/lib/i18n/context";
import { refineTranscript, classifyBusiness, processBusinessDescription } from "@/lib/api/ai";
import { markMicHintAsSeen } from "./mic-onboarding-hint";

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
  const [isMicConnecting, setIsMicConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sttLang, setSttLang] = useState<"id-ID" | "en-US">("id-ID");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);
  const fallbackTimerRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recordedTranscriptRef = useRef<string>("");
  const sttInferredResultRef = useRef<{ type?: string; subType?: string } | null>(null);
  const isManualStopRef = useRef(false);

  const cleanupAudioStream = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
    setIsSpeaking(false);
    setAudioLevel(0);
  };

  const toggleSttLang = () => {
    setSttLang((prev) => {
      const next = prev === "id-ID" ? "en-US" : "id-ID";
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = next;
        } catch {}
      }
      return next;
    });
  };

  const startRecording = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t("dashboard.wizard.voiceNotAvailable", "Browser Anda tidak mendukung fitur Voice/STT."));
      return;
    }

    markMicHintAsSeen();
    isManualStopRef.current = false;
    recordedTranscriptRef.current = "";
    setInterimTranscript("");
    setRecordingDuration(0);
    cleanupAudioStream();

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    // Try starting Web Audio API analyser to measure real-time mic volume
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.4;
            source.connect(analyser);
            analyserRef.current = analyser;

            const checkVolume = () => {
              if (!analyserRef.current) return;
              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              const speaking = avg > 12;
              setIsSpeaking(speaking);
              setAudioLevel(Math.min(1, avg / 60));
              animFrameRef.current = requestAnimationFrame(checkVolume);
            };
            animFrameRef.current = requestAnimationFrame(checkVolume);
          }
        })
        .catch((err) => {
          console.log("AudioContext fallback to speech recognition events", err);
        });
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sttLang;
    recognition.interimResults = true;
    recognition.continuous = true;

    // Triggered when audio stream is established and server is ready to listen
    const handleAudioReady = () => {
      setIsRecording(true);  // permission granted & audio stream aktif — baru tampilkan UI recording
      setIsMicConnecting(false);
      if (!recordingTimerRef.current) {
        recordingTimerRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      }
    };

    const handleSpeechDetected = () => {
      setIsSpeaking(true);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        if (!analyserRef.current) {
          setIsSpeaking(false);
        }
      }, 1000);
    };

    recognition.onaudiostart = () => {
      handleAudioReady();
    };
    recognition.onsoundstart = () => {
      handleAudioReady();
      handleSpeechDetected();
    };
    recognition.onspeechstart = () => {
      handleAudioReady();
      handleSpeechDetected();
    };
    recognition.onsoundend = () => {
      if (!analyserRef.current) {
        setIsSpeaking(false);
      }
    };
    recognition.onspeechend = () => {
      if (!analyserRef.current) {
        setIsSpeaking(false);
      }
    };

    // Fallback: if browser doesn't fire onaudiostart within 1000ms, start ticking anyway
    fallbackTimerRef.current = setTimeout(() => {
      handleAudioReady();
    }, 1000);

    recognition.onresult = (event: any) => {
      handleAudioReady();
      handleSpeechDetected();
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript.trim()) {
        recordedTranscriptRef.current = transcript.trim();
        setInterimTranscript(transcript.trim());
      }
    };

    recognition.onend = () => {
      cleanupAudioStream();
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setIsMicConnecting(false);
      setIsRecording(false);
      recognitionRef.current = null;

      // Auto-submit if browser ended recording and speech was captured
      if (!isManualStopRef.current && recordedTranscriptRef.current.trim()) {
        stopRecording();
      }
    };

    recognition.onerror = (event: any) => {
      cleanupAudioStream();
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setIsMicConnecting(false);
      setIsRecording(false);
      recognitionRef.current = null;

      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        alert(t("dashboard.wizard.micPermissionDenied", "Izin mikrofon diperlukan untuk merekam suara. Silakan aktifkan izin mikrofon pada browser Anda."));
      }
    };

    recognitionRef.current = recognition;
    setIsMicConnecting(true);  // hanya tampilkan "menyiapkan mic..." sampai permission granted
    try {
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition already active or failed to start", e);
      setIsMicConnecting(false);
    }
  };

  const stopRecording = async () => {
    isManualStopRef.current = true;
    setIsMicConnecting(false);
    cleanupAudioStream();
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);

    const rawTranscript = (recordedTranscriptRef.current || interimTranscript).trim();
    if (!rawTranscript) {
      alert(t("dashboard.wizard.sttNoVoiceDetected", "Tidak ada suara yang terdeteksi. Silakan coba lagi atau ketik deskripsi Anda secara langsung."));
      setTimeout(() => inputRef.current?.focus(), 80);
      return;
    }

    setInterimTranscript("");
    recordedTranscriptRef.current = "";

    // AI Refine Processing State
    setIsProcessingAudio(true);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 800));

    let refinedText = rawTranscript;
    let inferredResult: { type?: string; subType?: string } | null = null;
    const voiceLang = sttLang === "en-US" ? "en" : "id";
    try {
      const [res] = await Promise.all([
        refineTranscript(rawTranscript, businessNameRef.current, voiceLang),
        minDelay,
      ]);
      if (res && res.data) {
        if (res.data.refined_text) {
          refinedText = res.data.refined_text;
        }
        if (res.data.type && res.data.sub_type) {
          inferredResult = {
            type: res.data.type,
            subType: res.data.sub_type,
          };
        }
      }
    } catch (err) {
      console.warn("Refine transcript failed, using raw transcript", err);
      await minDelay;
    } finally {
      setIsProcessingAudio(false);
    }

    // Directly submit the spoken description into chat & classification flow
    processDescriptionSubmission(refinedText || rawTranscript, inferredResult);
  };

  const cancelRecording = () => {
    isManualStopRef.current = true;
    cleanupAudioStream();
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    recordedTranscriptRef.current = "";
    setInterimTranscript("");
    setIsRecording(false);
    setRecordingDuration(0);
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
      typeMessage(t("dashboard.wizard.selectMoodPrompt", "Website Anda nanti mau tampil seperti apa?"), () => {
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
      { id: Date.now().toString(), sender: "user", text: displayText, moodValue: selectedMood },
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
    // Use businessType/businessSubType (already set by processDescriptionSubmission)
    // rather than inferenceResult which may be stale due to React closure
    const confirmedType = businessType || inferenceResult?.type || "";
    const confirmedSubType = businessSubType || inferenceResult?.subType || "";

    if (confirmed && confirmedType && confirmedSubType) {
      setBusinessType(confirmedType);
      setBusinessSubType(confirmedSubType);
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
      setBusinessType("");
      setBusinessSubType("");
      setTypeWasInferred(false);
      setInferenceResult({ confidence: "low" } as InferenceResult);
      setTimeout(() => {
        typeMessage(t("dashboard.wizard.descriptionInferenceNone", DESCRIPTION_INFERENCE_NONE), () => {
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
          typeMessage(pickVariant(nameConfirmVariants), () => {
            setMessages((prev) => [
              ...prev,
              { id: `widget-name-confirm-${Date.now()}`, sender: "ai", text: "", widget: "name-confirm" as const },
            ]);
          });
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
      processDescriptionSubmission(val);
    }
  };

  const handleSelectStarter = (sampleName: string) => {
    if (isInitialTyping) return;
    const capitalized = capitalizeWords(sampleName.trim());
    setInputValue("");
    setBusinessName(capitalized);
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: sampleName }]);
    const hint = suggestTypeFromName(capitalized);
    setSuggestedHint(hint);

    setTimeout(() => {
      typeMessage(`${pickVariant(nameAckVariants)} ${t("dashboard.wizard.descriptionPrompt", DESCRIPTION_PROMPT)}`, () => {
        setChatStage("description");
      });
    }, 400);
  };

  const processDescriptionSubmission = async (
    rawVal: string,
    preInferred?: { type?: string; subType?: string } | null
  ) => {
    const val = rawVal.trim();
    const isSkip = !val || val.toLowerCase() === DESCRIPTION_SKIP_KEYWORD || val.toLowerCase() === t("dashboard.wizard.descriptionSkipKeyword", "lewat");
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

    let result: InferenceResult = { confidence: "low" };

    if (preInferred?.type && preInferred?.subType) {
      result = {
        type: preInferred.type,
        subType: preInferred.subType,
        confidence: "high",
      };
    } else {
      // 1. Primary: Call AI Classifier Server (understands context & semantics)
      try {
        const aiRes = await processBusinessDescription(val, businessNameRef.current, locale);
        if (aiRes && aiRes.data) {
          if (aiRes.data.refined_text && aiRes.data.refined_text.trim()) {
            const refined = aiRes.data.refined_text.trim();
            const isMeta = /(?:requesting a json|the user is|the business name is|the raw input is|```json)/i.test(refined);
            if (!isMeta) {
              setDescription(refined);
              descriptionRef.current = refined;
              // Also attempt to detect location from refined text if not already found
              if (!serviceArea) {
                const detected = extractLocationFromDescription(refined);
                if (detected) setServiceArea(detected);
              }
            }
          }
          if (aiRes.data.type && aiRes.data.type.trim() && aiRes.data.sub_type && aiRes.data.sub_type.trim()) {
            result = {
              type: aiRes.data.type.trim(),
              subType: aiRes.data.sub_type.trim(),
              confidence: "high",
            };
          }
        }
      } catch (err) {
        console.warn("Primary AI classification failed, falling back to local dictionary", err);
      }

      // 2. Fallback: If AI didn't return both type & subType (offline / timeout / token exhausted)
      if (!result.type || !result.subType) {
        const localResult = inferTypeFromDescription(val);
        if (localResult.type) {
          result = localResult;
        }
      }
    }

    setInferenceResult(result);

    // Only prompt direct inference confirmation if confidence is HIGH and both type & subType are strongly identified
    if (result.confidence === "high" && result.type && result.type.trim() && result.subType && result.subType.trim()) {
      setBusinessType(result.type.trim());
      setBusinessSubType(result.subType.trim());
      setTypeWasInferred(true);
      setAwaitingInferenceConfirm(true);
      const confirmMsg = t("dashboard.wizard.descriptionInferenceHigh", undefined, { subType: result.subType ?? result.type ?? "" });
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

    // When confidence is low or medium (no exact subtype match): show native category selection directly
    setBusinessType("");
    setBusinessSubType("");
    setTypeWasInferred(false);
    setInferenceResult({ confidence: "low" } as InferenceResult);
    setChatStage("type");
    setTimeout(() => {
      typeMessage(t("dashboard.wizard.descriptionInferenceNone", DESCRIPTION_INFERENCE_NONE), () => {
        setMessages((prev) => [
          ...prev,
          { id: `widget-type-chips-${Date.now()}`, sender: "ai", text: "", widget: "type-chips" as const },
        ]);
      });
    }, 300);
  };

  const handleConfirmSttReview = (confirmed: boolean, transcriptText: string) => {
    // Dismiss the stt-review-confirm widget
    setMessages((prev) => prev.filter((m) => m.widget !== "stt-review-confirm"));

    if (confirmed) {
      processDescriptionSubmission(transcriptText, sttInferredResultRef.current);
    } else {
      setInputValue(transcriptText);
      setChatStage("description");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    }
  };

  const handleConfirmName = (confirmed: boolean) => {
    setAwaitingNameConfirm(false);
    setMessages((prev) => prev.filter((m) => m.widget !== "name-confirm"));

    if (confirmed) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: t("dashboard.wizard.nameConfirmYes", "Ya") },
      ]);
      setTimeout(() => {
        typeMessage(`${pickVariant(nameAckVariants)} ${t("dashboard.wizard.descriptionPrompt", DESCRIPTION_PROMPT)}`, () => {
          setChatStage("description");
        });
      }, 400);
    } else {
      setBusinessName("");
      businessNameRef.current = "";
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: t("dashboard.wizard.nameConfirmChange", "Ganti") },
      ]);
      setTimeout(() => {
        typeMessage(t("dashboard.wizard.nameChangePrompt", "Baik, silakan ketik nama bisnis yang ingin Anda gunakan:"), () => {
          setTimeout(() => inputRef.current?.focus(), 80);
        });
      }, 400);
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
    isMicConnecting,
    isSpeaking,
    audioLevel,
    recordingDuration,
    sttLang,
    setSttLang,
    toggleSttLang,
    interimTranscript,
    isProcessingAudio,
    startRecording,
    stopRecording,
    cancelRecording,
    handleConfirmSttReview,
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
    handleSelectStarter,
    handleSelectType,
    handleSelectSubType,
    handleSelectLanguage,
    handleSelectMood,
    handleConfirmInference,
    handleConfirmName,
    typeMessage,
    // Utilities
    syncChatRefs,
    hydrate,
  };
}
