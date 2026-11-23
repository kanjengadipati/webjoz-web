"use client";

import React from "react";
import { PreviewData } from "./types";
import { getTemplateComponent, getTemplatePool, resolveBusinessName } from "./helpers";
import { buildFullContent } from "@/lib/build-full-content";
import { DevicePreviewFrame } from "./device-frame";
import { Wireframe } from "./wireframe";
import { useWizardChat } from "./use-wizard-chat";
import { useWizardPreview } from "./use-wizard-preview";
import { useWizardDevice } from "./use-wizard-device";
import { useI18n } from "@/lib/i18n/context";
import type { useThemeDraft } from "./use-theme-draft";
import { EditorChromeProvider } from "@/components/sections/editor-chrome-context";
import { WizardRegenProvider } from "@/components/sections/wizard-regen-context";

interface PreviewCanvasProps {
  chat: ReturnType<typeof useWizardChat>;
  preview: ReturnType<typeof useWizardPreview>;
  device: ReturnType<typeof useWizardDevice>;
  themeDraft?: ReturnType<typeof useThemeDraft>;
  fullPage?: boolean;
  onGoToEditor?: () => void;
  onRegenRequest?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export function PreviewCanvas({ chat, preview, device, themeDraft, fullPage, onRegenRequest, onEditingStateChange }: PreviewCanvasProps) {
  const { locale } = useI18n();

  const handleInlineRegen = React.useCallback(() => {
    onRegenRequest?.();
  }, [onRegenRequest]);

  const {
    previewState,
    previewData,
    streamedSections,
    streamedDesignToken,
    streamedTemplateId,
    arrivedSections,
    regenCount,
    historyIndex,
    isSwitchingTemplate,
    previewBlurPx,
    previewScrollRef,
    previewIframeRef,
    streamDone
  } = preview;

  const hasLiveData = Object.keys(streamedSections).length > 0;
  const isStreamingLive = previewState === "loading" && !streamDone;
  // While streaming, only treat previewData as usable AFTER live sections arrive.
  // Before that, old previewData from a prior generation must not be shown —
  // it would produce a flash of the previous result at the start of the new stream.
  const hasPreviewData = isStreamingLive ? hasLiveData : !!previewData;

  const siteLang: "id" | "en" = (chat.siteLanguage || (locale === "en" ? "en" : "id")) as "id" | "en";
  const previewBusinessName = resolveBusinessName(
    chat.businessName,
    previewData?.content
  );

  if (!hasLiveData && !hasPreviewData) {
    return (
      <Wireframe
        businessName={chat.businessName}
        businessType={chat.businessType}
        businessSubType={chat.businessSubType}
        description={chat.description}
        chatStage={chat.chatStage}
        designToken={streamedDesignToken ?? null}
        language={siteLang}
        logoUrl={chat.brandLogoUrl}
      />
    );
  }
  const candidatePool = getTemplatePool(chat.businessType, chat.mood);
  const fallbackTemplateId = candidatePool[0] || "TEMPLATE_JASA02";
  const liveContent = isStreamingLive ? streamedSections : (previewData?.content || {});
  const liveToken = isStreamingLive
    ? (streamedDesignToken ?? {})
    : (themeDraft?.previewToken ?? previewData?.design_token ?? {});
  const liveTemplateId = isStreamingLive
    ? (streamedTemplateId || (streamedDesignToken as any)?.template_id || fallbackTemplateId)
    : (previewData?.template_id || fallbackTemplateId);
  const TemplateComponent = liveTemplateId ? getTemplateComponent(liveTemplateId) : null;
  const displayData: PreviewData & { logo_url?: string | null } = {
    content: liveContent,
    design_token: liveToken,
    template_id: liveTemplateId,
    logo_url: chat.brandLogoUrl,
  };

  const templatePreview = TemplateComponent ? (
    <EditorChromeProvider value={false}>
    <WizardRegenProvider value={{ onRegen: handleInlineRegen }}>
    {/* eslint-disable-next-line react-hooks/static-components */}
    <TemplateComponent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content={buildFullContent(displayData, previewBusinessName, chat.businessSubType || chat.businessType, chat.description, chat.whatsapp) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      design_token={liveToken as any}
      language={(chat.siteLanguage || "id") as any}
      viewMode="wizard"
      isEditorMode={previewState === "result"}
      editorChrome={false}
      onUpdateField={previewState === "result" ? preview.updateField : undefined}
      onRegenSection={previewState === "result" ? handleInlineRegen : undefined}
      onEditingStateChange={onEditingStateChange}
      arrivedSections={isStreamingLive ? arrivedSections : undefined}
      onSubmitLead={async () => { }}
    />
    </WizardRegenProvider>
    </EditorChromeProvider>
  ) : (
    <Wireframe
      businessName={chat.businessName}
      businessType={chat.businessType}
      businessSubType={chat.businessSubType}
      description={chat.description}
      chatStage={chat.chatStage}
      designToken={streamedDesignToken ?? null}
      language={siteLang}
      logoUrl={chat.brandLogoUrl}
    />
  );

  return (
    <div className="h-full flex flex-col overflow-hidden relative bg-background">
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSwitchingTemplate ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"}`} style={{
        filter: `blur(${previewBlurPx}px)`,
        transition: "filter 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s, transform 0.3s",
      }}>
        {fullPage ? (
          /* Full-page mode: render content directly, no device frame */
          <div ref={previewScrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-background" key={`fullpage-${regenCount}-${historyIndex}`}>
            <DevicePreviewFrame device="desktop" iframeRef={previewIframeRef} typography={liveToken?.typography}>
              {templatePreview}
            </DevicePreviewFrame>
          </div>
        ) : device.previewDevice === "mobile" ? (
          device.isMobile ? (
            /* Di perangkat mobile fisik: tampilkan preview full-frame tanpa border tiruan agar responsif terhadap keyboard */
            <div className="flex-1 min-h-0 w-full h-full overflow-hidden bg-background" key={`mobile-${regenCount}-${historyIndex}`}>
              <DevicePreviewFrame device="mobile" iframeRef={previewIframeRef} typography={liveToken?.typography}>
                {templatePreview}
              </DevicePreviewFrame>
            </div>
          ) : (
            /* Di perangkat desktop: tampilkan frame mockup smartphone yang realistis */
            <div className="flex-1 min-h-0 overflow-auto bg-background p-4 flex items-center justify-center" key={`mobile-${regenCount}-${historyIndex}`}>
              <div className="relative mx-auto my-auto h-[840px] w-[412px] max-w-full flex-shrink-0 rounded-[44px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800">
                <div className="absolute left-1/2 top-3 z-50 h-4 w-28 -translate-x-1/2 rounded-full bg-slate-900" />
                <div className="relative z-10 h-full w-full overflow-hidden rounded-[34px] bg-white">
                  <DevicePreviewFrame device="mobile" iframeRef={previewIframeRef} typography={liveToken?.typography}>
                    {templatePreview}
                  </DevicePreviewFrame>
                </div>
                <div className="absolute bottom-2 left-1/2 z-50 h-1.5 w-28 -translate-x-1/2 rounded-full bg-slate-700" />
              </div>
            </div>
          )
        ) : device.previewDevice === "tablet" ? (
          device.isMobile ? (
            <div className="flex-1 min-h-0 w-full h-full overflow-hidden bg-background" key={`tablet-${regenCount}-${historyIndex}`}>
              <DevicePreviewFrame device="tablet" iframeRef={previewIframeRef} typography={liveToken?.typography}>
                {templatePreview}
              </DevicePreviewFrame>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-auto bg-background p-4 flex items-center justify-center" key={`tablet-${regenCount}-${historyIndex}`}>
              <div className="relative mx-auto my-auto h-[880px] w-[640px] max-w-full flex-shrink-0 rounded-[24px] border-8 border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800">
                <div className="relative z-10 h-full w-full overflow-hidden rounded-[16px] bg-white">
                  <DevicePreviewFrame device="tablet" iframeRef={previewIframeRef} typography={liveToken?.typography}>
                    {templatePreview}
                  </DevicePreviewFrame>
                </div>
              </div>
            </div>
          )
        ) : (
          <div ref={previewScrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-background pb-8" key={`desktop-${regenCount}-${historyIndex}`}>
            <DevicePreviewFrame device="desktop" iframeRef={previewIframeRef} typography={liveToken?.typography}>
              {templatePreview}
            </DevicePreviewFrame>
          </div>
        )}
      </div>
      {isSwitchingTemplate && (
        <div className="absolute inset-0 z-30 overflow-hidden bg-background/70 backdrop-blur-[2px]">
          <Wireframe
            businessName={chat.businessName}
            businessType={chat.businessType}
            businessSubType={chat.businessSubType}
            description={chat.description}
            chatStage="done"
            language={siteLang}
            logoUrl={chat.brandLogoUrl}
          />
        </div>
      )}
    </div>
  );
}
