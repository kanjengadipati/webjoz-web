"use client";

import React, { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/client";
import {
  ArrowRight,
  ChevronLeft,
  MessageCircle,
  Monitor,
  Pencil,
  Plus,
  RefreshCw,
  Smartphone,
  Tablet,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { buildFullContent } from "@/lib/build-full-content";
import { SiteWizardProps, PreviewData } from "./types";
import { PENDING_KEY, BUSINESS_TYPES, SUB_TYPES, INITIAL_MESSAGE } from "./constants";
import { selectTemplate, formatText, generateSubdomain, generateSlug, getTemplatePool } from "./helpers";
import { useWizardChat } from "./use-wizard-chat";
import { useWizardPreview } from "./use-wizard-preview";
import { useWizardDevice } from "./use-wizard-device";
import { useWizardGenerate } from "./use-wizard-generate";
import { PreviewCanvas } from "./preview-canvas";
import { MobileActionBar } from "./mobile-action-bar";
import { BusinessDetailsSheet } from "./business-details-sheet";
import { LoadingModal } from "./loading-modal";
import { WizardErrorModal } from "./error-modal";
import { WizardSuccessToast } from "./success-toast";

export { type SiteWizardProps };

export function SiteWizard({
  mode,
  token,
  activeTenantId,
  createTenant,
  onNeedAuth,
  initialBusinessType,
  initialBusinessSubType,
}: SiteWizardProps) {
  const router = useRouter();
  const { pushToast } = useToast();

  const chat = useWizardChat({ businessType: initialBusinessType, businessSubType: initialBusinessSubType });
  const preview = useWizardPreview();
  const device = useWizardDevice();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  // Ref to the preview container so confetti canvas can size itself correctly
  const previewContainerRef = React.useRef<HTMLDivElement | null>(null);

  const generate = useWizardGenerate({
    onDesignToken: (token) => {
      preview.setStreamedDesignToken(token);
      preview.streamedTokenRef.current = token;
    },
    onSection: (section, data) => {
      preview.streamedSectionsRef.current = { ...preview.streamedSectionsRef.current, [section]: data };
      preview.setStreamedSections((prev) => ({ ...prev, [section]: data }));
      preview.setArrivedSections((prev) => prev.includes(section) ? prev : [...prev, section]);
      preview.advanceLoadingStepFromSection(section);
    },
    onDone: (templateId, _qualityScore, _qualityIssues) => {
      preview.setStreamedTemplateId(templateId);

      const mood = (preview.streamedTokenRef.current as any)?.mood ?? "";
      let pool = getTemplatePool(chat.businessType, mood);

      // Reorder template pool so the generated template is at index 0.
      // This ensures the template selection starts at 1/N instead of a higher index (like 2/4).
      if (templateId) {
        const activeIndex = pool.indexOf(templateId);
        if (activeIndex > 0) {
          pool = [templateId, ...pool.slice(0, activeIndex), ...pool.slice(activeIndex + 1)];
        } else if (activeIndex === -1) {
          pool = [templateId, ...pool];
        }
      }
      preview.setTemplatePool(pool);
      preview.setTemplatePoolIndex(0);

      const finalContent = preview.streamedSectionsRef.current;
      const finalToken = preview.streamedTokenRef.current ?? {};
      const mergedPreview: PreviewData = {
        content: Object.keys(finalContent).length > 0 ? finalContent : {},
        design_token: finalToken,
        template_id: templateId,
      };
      preview.setPreviewHistory((prev) => {
        const base = prev.slice(0, preview.historyIndexRef.current + 1);
        const next = [...base, mergedPreview].slice(-5);
        preview.setHistoryIndex(next.length - 1);
        return next;
      });
      preview.setPreviewData(mergedPreview);
      preview.streamDoneRef.current = true;
      if (preview.loadingStepRef.current >= 5) {
        setTimeout(() => preview.setPreviewState("result"), 600);
      }
      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          businessName: chat.businessNameRef.current,
          businessType: chat.businessTypeRef.current,
          businessSubType: chat.businessSubTypeRef.current,
          description: chat.descriptionRef.current,
          whatsapp: chat.whatsappRef.current || "",
          service_area: chat.serviceAreaRef.current || "",
          templateId: mergedPreview.template_id,
          previewContent: mergedPreview.content,
          previewDesignToken: mergedPreview.design_token,
        })
      );
      if (device.isMobileRef.current) {
        device.setPreviewDevice("mobile");
        if (generate.didGenerateRef.current) {
          device.setMobileScreen("preview");
        }
        return;
      }
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
        device.setPreviewDevice("mobile");
      }
      device.setMobilePreviewOpen(true);
    },
    onError: (message) => {
      const lower = (message || "").toLowerCase();
      if (lower.includes("too many") || lower.includes("429") || lower.includes("rate limit")) {
        generate.setTooManyRequests(true);
      } else {
        generate.setGenerationError(message || "Terjadi kesalahan saat membuat preview.");
      }
      preview.setPreviewState("wireframe");
      device.setMobileScreen("chat");
    },
  });

  // Cleanup on unmount — use cancelStream (stable via useCallback) not the
  // whole `generate` object which changes every render and would cancel the
  // stream mid-flight on every re-render.
  const cancelStreamRef = React.useRef(generate.cancelStream);
  cancelStreamRef.current = generate.cancelStream;
  React.useEffect(() => {
    return () => { cancelStreamRef.current(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset success modal whenever a new generation begins
  React.useEffect(() => {
    if (preview.previewState === "loading") {
      setSuccessModalOpen(false);
    }
  }, [preview.previewState]);

  // Show success modal only after blur has fully cleared and scroll is done
  React.useEffect(() => {
    if (preview.resultClear && preview.previewState === "result") {
      // Small extra delay so the user has a moment to see the preview before the modal pops
      const t = setTimeout(() => setSuccessModalOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [preview.resultClear, preview.previewState]);

  const writtenCharCount = useMemo(() => {
    return JSON.stringify(preview.streamedSections).length;
  }, [preview.streamedSections]);

  const sectionSnippet = useMemo(() => {
    const s = preview.streamedSections;
    const hero = s.hero as Record<string, any> | undefined;
    if (hero?.headline) return hero.headline as string;
    if (hero?.subheadline) return hero.subheadline as string;
    const about = s.about as Record<string, any> | undefined;
    if (about?.title) return about.title as string;
    const cta = s.cta as Record<string, any> | undefined;
    if (cta?.headline) return cta.headline as string;
    return "";
  }, [preview.streamedSections]);

  const handleBack = () => {
    if (window.history.length > 1) { router.back(); return; }
    router.push("/");
  };

  const handleCancelGenerationError = () => {
    generate.handleCancelGenerationError();
    preview.setPreviewState("wireframe");
    device.setMobileScreen("chat");
  };

  const handleRetryGeneration = () => {
    device.setMobileScreen("loading");
    generate.handleRetryGeneration(handleGenerate);
  };

  const handleGenerate = async (
    bName = chat.businessName,
    bType = chat.businessType,
    overrides: { businessSubType?: string; whatsapp?: string; serviceArea?: string; description?: string } = {}
  ) => {
    const nextBusinessSubType = overrides.businessSubType ?? chat.businessSubType;
    const nextWhatsapp = overrides.whatsapp ?? chat.whatsapp;
    const nextServiceArea = overrides.serviceArea ?? chat.serviceArea;
    const nextDescription = overrides.description ?? chat.descriptionRef.current;

    preview.setStreamedSections({});
    preview.setStreamedDesignToken(null);
    preview.setArrivedSections([]);
    preview.setStreamedTemplateId("");
    preview.streamedSectionsRef.current = {};
    preview.streamedTokenRef.current = null;
    preview.setPreviewState("loading");
    preview.setLoadingStep(0);
    generate.didGenerateRef.current = true;
    device.setMobileScreen("loading");

    chat.syncChatRefs({
      businessName: bName,
      businessType: bType,
      businessSubType: nextBusinessSubType,
      whatsapp: nextWhatsapp,
      serviceArea: nextServiceArea,
    });
    if (nextDescription) chat.descriptionRef.current = nextDescription;

    localStorage.setItem(PENDING_KEY, JSON.stringify({
      businessName: bName, businessType: bType, businessSubType: nextBusinessSubType,
      description: nextDescription || "",
      whatsapp: nextWhatsapp || "", service_area: nextServiceArea || "",
    }));

    await generate.startStream({
      business_name: bName, business_type: bType, business_sub_type: nextBusinessSubType || undefined,
      whatsapp: nextWhatsapp || "", service_area: nextServiceArea || "",
      description: nextDescription || undefined,
    });
  };

  // Wire up chat handlers with handleGenerate
  const onChatGenerate = (name: string, type: string, overrides: any) => {
    void handleGenerate(name, type, overrides);
  };

  const handleSendText = (e: React.FormEvent) => chat.handleSendText(e, onChatGenerate);
  const handleSelectSubType = (subType: string) => {
    chat.handleSelectSubType(subType, (name, type, overrides) => {
      preview.setRegenCount(0);
      preview.setHasUnsavedEdits(false);
      generate.didGenerateRef.current = true;
      void handleGenerate(name, type, overrides);
    });
  };
  const handleConfirmInference = (confirmed: boolean) => {
    chat.handleConfirmInference(confirmed, (name, type, overrides) => {
      preview.setRegenCount(0);
      preview.setHasUnsavedEdits(false);
      generate.didGenerateRef.current = true;
      void handleGenerate(name, type, overrides);
    });
  };

  const handleGoToEditor = async () => {
    if (!token) {
      localStorage.setItem(PENDING_KEY, JSON.stringify({
        businessName: chat.businessName, businessType: chat.businessType,
        businessSubType: chat.businessSubType, description: chat.description, whatsapp: chat.whatsapp,
        service_area: chat.serviceArea || "",
        templateId: preview.previewData?.template_id, previewContent: preview.previewData?.content,
        previewDesignToken: preview.previewData?.design_token,
      }));
      if (onNeedAuth) { onNeedAuth(); }
      else { router.push("/login?redirect=/create?action=save"); }
      return;
    }

    try {
      let tenantId = activeTenantId;
      if (!tenantId && mode === "public" && createTenant) {
        const slug = generateSlug(chat.businessName);
        const created = await createTenant(chat.businessName + " Workspace", slug);
        if (created?.id) tenantId = created.id;
        else throw new Error("Gagal membuat workspace.");
      }
      if (!tenantId) throw new Error("Workspace tidak ditemukan.");

      const subdomain = generateSubdomain(chat.businessName);

      const createRes = await request<any>(
        "/sites",
        {
          method: "POST",
          headers: { "X-Tenant-ID": tenantId.toString() },
          body: JSON.stringify({
            name: chat.businessName,
            template_id: preview.previewData?.template_id || selectTemplate(chat.businessSubType || chat.businessType),
            subdomain,
          }),
        },
        token
      );
      if (createRes.status !== "success") throw new Error(createRes.message);
      const siteId = createRes.data.id;

      if (preview.previewData) {
        const enrichedContent = buildFullContent(
          { content: preview.previewData.content, design_token: preview.previewData.design_token },
          chat.businessName, chat.businessSubType || chat.businessType, chat.description, chat.whatsapp
        );
        await request(
          `/sites/${siteId}/content`,
          {
            method: "PUT",
            headers: { "X-Tenant-ID": tenantId.toString() },
            body: JSON.stringify({
              content: enrichedContent,
              design_token: preview.previewData.design_token,
            }),
          },
          token
        );
      }

      localStorage.removeItem(PENDING_KEY);
      router.push(`/dashboard/sites/${siteId}`);
    } catch (err: any) {
      console.error(err);
      pushToast(err.message || "Terjadi kesalahan. Silakan coba lagi.", "error");
    }
  };

  const handleDetailsSheetRegenerate = (whatsapp: string, serviceArea: string) => {
    chat.setWhatsapp(whatsapp);
    chat.setServiceArea(serviceArea);
    setSheetOpen(false);
    preview.setHasUnsavedEdits(true);
    preview.setRegenCount((c: number) => c + 1);
    preview.setPreviewState("loading");
    device.setMobileScreen("loading");
    void handleGenerate(chat.businessName, chat.businessType, {
      whatsapp,
      serviceArea,
    });
  };

  return (
    <div
      className="relative flex w-screen overflow-hidden bg-[#0d0f14] md:h-screen"
      style={{ height: "var(--webjoz-app-height, 100dvh)" }}
    >
      {/* ══ LEFT SIDEBAR: Chat Panel ══════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 z-20 flex h-full w-full shrink-0 flex-col overflow-hidden border-r bg-[#111318] shadow-xl transition-transform duration-300 ease-out md:relative md:inset-auto md:z-10 md:w-[380px] md:translate-x-0 ${
          device.isMobile
            ? device.mobileScreen === "chat" ? "translate-x-0" : "-translate-x-full"
            : device.mobilePreviewOpen ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="px-5 pt-4 pb-0 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 1px 0 rgba(255,255,255,0.025)" }}>
          <div className="flex items-start gap-3 mb-4">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Kembali"
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-white active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-[18px] h-[18px] text-primary-foreground" />
                  </div>
                  <span className="font-bold text-white text-[17px] leading-tight">Webjoz AI Assistant</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {device.isMobile && preview.previewState === "result" && (
                    <button
                      type="button"
                      onClick={() => device.setMobileScreen("preview")}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold transition-all active:scale-95 animate-pulse"
                    >
                      Preview &rarr;
                    </button>
                  )}
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">BETA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 pb-28 md:pb-8 space-y-4">
          {chat.messages.map((m) => {
            if (m.widget === "inference-confirm") {
              const isLocked = !chat.awaitingInferenceConfirm;
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => !isLocked && handleConfirmInference(true)}
                      disabled={isLocked}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground transition-all hover:brightness-110 active:scale-95 disabled:opacity-40"
                    >
                      Ya, lanjut
                    </button>
                    <button
                      type="button"
                      onClick={() => !isLocked && handleConfirmInference(false)}
                      disabled={isLocked}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-medium text-slate-300 border border-white/10 transition-all hover:border-white/30 active:scale-95 disabled:opacity-40"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      Bukan
                    </button>
                  </div>
                </div>
              );
            }

            if (m.widget === "subtype-chips") {
              const isLocked = chat.chatStage !== "type";
              const subTypes = chat.businessType ? SUB_TYPES[chat.businessType] : [];
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                  {chat.typeWasInferred && (
                    <button
                      type="button"
                      onClick={() => {
                        chat.setTypeWasInferred(false);
                        chat.setBusinessType("");
                        chat.setBusinessSubType("");
                        chat.setMessages((prev) => prev.filter((msg) => msg.id !== m.id));
                        chat.setMessages((prev) => [
                          ...prev,
                          { id: `widget-type-chips-${Date.now()}`, sender: "ai", text: "", widget: "type-chips" as const },
                        ]);
                        chat.setChatStage("type");
                      }}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline mb-2 inline-block transition-colors"
                    >
                      Bukan ini? Pilih jenis bisnis lain
                    </button>
                  )}
                  <p className="text-[10px] font-semibold text-slate-500 mb-2 px-0.5">Lebih spesifik:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {subTypes.map((st) => {
                      const isSubSelected = chat.businessSubType === st.value;
                      return (
                        <button
                          key={st.value}
                          type="button"
                          onClick={() => !isLocked && handleSelectSubType(st.value)}
                          disabled={isLocked}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-95 ${isSubSelected ? "text-white border-emerald-500/60" : "text-slate-300 border-white/10 hover:border-primary/50 hover:text-white"}`}
                          style={isSubSelected ? { background: "rgba(16,185,129,0.2)" } : { background: "rgba(255,255,255,0.05)" }}
                        >
                          <span>{st.emoji}</span>
                          <span>{st.label}</span>
                          {isSubSelected && <span className="text-emerald-400 text-[10px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (m.widget === "type-chips") {
              const isLocked = chat.chatStage !== "type";
              const subTypes = chat.businessType ? SUB_TYPES[chat.businessType] : null;
              return (
                <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {BUSINESS_TYPES.map((t) => {
                      const isSelected = chat.businessType === t.value;
                      return (
                        <button
                          key={t.value}
                          onClick={() => !isLocked && chat.handleSelectType(t.value)}
                          disabled={isLocked}
                          className={`flex flex-col items-start gap-1 p-3 border rounded-xl text-left transition-all ${isSelected ? "border-primary/70 bg-primary/15" : isLocked ? "opacity-30 cursor-default" : "hover:border-primary/50 active:scale-[0.97] cursor-pointer bg-white/[0.04] border-white/[0.07]"}`}
                        >
                          <span className="text-lg">{t.emoji}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isSelected ? "text-primary" : "text-slate-200"}`}>{t.label}</span>
                            {chat.suggestedHint?.type === t.value && (
                              <span className="text-[10px] font-semibold text-amber-300 bg-amber-800/20 px-2 py-0.5 rounded-full">✨ Disarankan</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{t.desc}</span>
                          {isSelected && !chat.businessSubType && <span className="text-[9px] font-bold text-primary mt-0.5">✓ Dipilih — pilih jenis di bawah</span>}
                          {isSelected && chat.businessSubType && <span className="text-[9px] font-bold text-emerald-400 mt-0.5">✓ {chat.businessSubType}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {subTypes && !isLocked && (
                    <div ref={chat.subTypeRef} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                      <p className="text-[10px] font-semibold text-slate-500 mb-2 px-0.5">Lebih spesifik:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {subTypes.map((st) => {
                          const isSubSelected = chat.businessSubType === st.value;
                          return (
                            <button
                              key={st.value}
                              type="button"
                              onClick={() => !isLocked && handleSelectSubType(st.value)}
                              disabled={isLocked}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-95 ${isSubSelected ? "text-white border-emerald-500/60" : "text-slate-300 border-white/10 hover:border-primary/50 hover:text-white"}`}
                              style={isSubSelected ? { background: "rgba(16,185,129,0.2)" } : { background: "rgba(255,255,255,0.05)" }}
                            >
                              <span>{st.emoji}</span>
                              <span>{st.label}</span>
                              {chat.suggestedHint?.subType === st.value && (
                                <span className="text-[10px] text-amber-300">✨</span>
                              )}
                              {isSubSelected && <span className="text-emerald-400 text-[10px]">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const messageText = m.id === "init" && chat.chatStage === "name"
              ? INITIAL_MESSAGE_WORDS.slice(0, chat.initialWordCount).join(" ")
              : m.text;

            return (
              <div key={m.id} className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                {m.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-[14px] h-[14px] text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.sender === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "rounded-tl-sm text-slate-200"}`}
                  style={m.sender !== "user" ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" } : {}}
                >
                  {formatText(messageText, m.sender === "user")}
                  {m.id === "init" && chat.isInitialTyping && (
                    <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse rounded-full bg-slate-300" />
                  )}
                </div>
              </div>
            );
          })}

          <div ref={chat.chatEndRef} />
        </div>

        {/* Chat Input */}
        {chat.chatStage !== "type" && chat.chatStage !== "done" && (
          <div className="shrink-0 px-4 pb-12 pt-2 md:py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <form onSubmit={handleSendText} className="flex items-center rounded-2xl px-4 py-1 gap-2 transition-all" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <input
                ref={chat.inputRef}
                type="text"
                value={chat.inputValue}
                onChange={(e) => chat.setInputValue(e.target.value)}
                placeholder={
                  chat.awaitingNameConfirm ? "Ketik 'ya' untuk lanjut, atau nama yang benar..." :
                    chat.chatStage === "description" ? "Contoh: Jual kopi spesial di Jogja, melayani pesanan partai besar" :
                    "Ketik nama bisnis Anda..."
                }
                autoFocus
                disabled={chat.isInitialTyping || chat.isAiTyping}
                className="flex-1 bg-transparent border-none py-2.5 text-base md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={chat.isInitialTyping || chat.isAiTyping || (chat.chatStage === "name" && !chat.inputValue.trim())}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all disabled:opacity-30 hover:bg-primary/90 shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        <div className="px-5 py-3 shrink-0 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full shrink-0 transition-all duration-500 ${preview.previewState === "loading" ? "bg-primary animate-pulse" : "bg-emerald-400"}`}
            />
            <span className="transition-all duration-300">
              {preview.previewState === "wireframe" && (chat.chatStage === "name" || chat.chatStage === "type") && "Menunggu input..."}
              {preview.previewState === "loading" && "AI sedang generate..."}
              {preview.previewState === "result" && "Preview siap ✓"}
              {preview.previewState === "wireframe" && chat.chatStage === "done" && "Menyiapkan AI..."}
            </span>
          </span>
          <span className="text-[11px] text-slate-500">
            {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
          </span>
        </div>
      </div>

      {/* ══ RIGHT: Browser Preview ════════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 z-30 flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#0d0f14] transition-transform duration-300 ease-out md:relative md:inset-auto md:z-0 md:translate-x-0 ${
          device.isMobile
            ? device.mobileScreen === "preview" || device.mobileScreen === "loading" ? "translate-x-0" : "translate-x-full"
            : device.mobilePreviewOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-12 flex items-center px-4 gap-3 shrink-0" style={{ background: "#111318", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            type="button"
            onClick={() => device.setMobileScreen("chat")}
            aria-label="Kembali ke chat"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all active:scale-95 md:hidden"
          >
            <MessageCircle className="h-4 w-4" />
          </button>

          <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
            <button
              type="button"
              onClick={() => device.setPreviewDevice("desktop")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device.previewDevice === "desktop" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="Preview desktop"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => device.setPreviewDevice("tablet")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device.previewDevice === "tablet" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="Preview tablet"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => device.setPreviewDevice("mobile")}
              className={`flex h-6 w-8 items-center justify-center rounded-md text-[12px] transition-colors ${device.previewDevice === "mobile" ? "bg-white/15 text-white" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="Preview mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          {preview.templatePool.length > 1 && preview.previewState === "result" && (
            <button
              type="button"
              onClick={preview.handleSwitchTemplate}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-300 border border-white/10 bg-white/[0.04] transition-all hover:border-primary/40 hover:text-white active:scale-95"
            >
              <RefreshCw size={11} />
              Coba rekomendasi lain ({preview.templatePoolIndex + 1}/{preview.templatePool.length})
            </button>
          )}

          <div className="flex-1 min-w-0">
            {preview.previewState === "loading" && (
              <span className="ml-auto text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full w-fit block">Draft Preview</span>
            )}
            {preview.previewState === "result" && (
              <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full w-fit block">Live Preview</span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-[#0d0f14]" ref={previewContainerRef}>
          <PreviewCanvas chat={chat} preview={preview} device={device} />

          {preview.previewState === "loading" && !device.isMobile && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
              <LoadingModal loadingStep={preview.loadingStep} businessType={chat.businessType} businessName={chat.businessName} charCount={writtenCharCount} sectionSnippet={sectionSnippet} />
            </div>
          )}

          {preview.previewState === "loading" && device.isMobile && (
            <div className="absolute inset-0 z-40 bg-black/10">
              <LoadingModal loadingStep={preview.loadingStep} businessType={chat.businessType} businessName={chat.businessName} center />
            </div>
          )}

          {preview.previewState === "result" && (
            <div className="hidden md:flex absolute bottom-6 right-6 z-40 gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold bg-white text-slate-900 shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 hover:brightness-110 active:brightness-95"
              >
                <Plus className="h-4 w-4" />
                Lengkapi Data
              </button>
              <button
                type="button"
                onClick={handleGoToEditor}
                className="btn-primary flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold shadow-[0_14px_35px_rgba(0,0,0,0.25)] transition-all hover:scale-105 active:scale-95"
              >
                <Pencil className="h-4 w-4" />
                Edit &amp; Publikasikan
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <WizardSuccessToast
            open={successModalOpen}
            onDismiss={() => setSuccessModalOpen(false)}
            onGoToEditor={() => { setSuccessModalOpen(false); handleGoToEditor(); }}
            containerRef={previewContainerRef}
            // MobileActionBar is ~88px tall on mobile; on desktop the bar is absent
            bottomOffset={device.isMobile ? 88 : 0}
          />
        </div>
      </div>

      <WizardErrorModal
        open={generate.tooManyRequests}
        title="Terlalu cepat!"
        message="Kamu sudah generate beberapa kali dalam waktu singkat. Tunggu 30 detik, lalu coba lagi ya."
        variant="warning"
        onCancel={handleCancelGenerationError}
        onRetry={handleRetryGeneration}
      />

      <WizardErrorModal
        open={!!generate.generationError}
        title="Generate belum berhasil"
        message={generate.generationError || "Terjadi kesalahan saat membuat preview."}
        onCancel={handleCancelGenerationError}
        onRetry={handleRetryGeneration}
      />

      <MobileActionBar
        preview={preview}
        device={device}
        onOpenSheet={() => setSheetOpen(true)}
        onGoToEditor={handleGoToEditor}
      />

      <BusinessDetailsSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        chat={chat}
        onRegenerate={handleDetailsSheetRegenerate}
      />
    </div>
  );
}

const INITIAL_MESSAGE_WORDS = INITIAL_MESSAGE.split(" ");
