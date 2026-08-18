"use client";

import React from "react";
import { PreviewData } from "./types";
import { getTemplateComponent, getTemplatePool } from "./helpers";
import { buildFullContent } from "@/lib/build-full-content";
import { DevicePreviewFrame } from "./device-frame";
import { Wireframe } from "./wireframe";
import { useWizardChat } from "./use-wizard-chat";
import { useWizardPreview } from "./use-wizard-preview";
import { useWizardDevice } from "./use-wizard-device";

interface PreviewCanvasProps {
  chat: ReturnType<typeof useWizardChat>;
  preview: ReturnType<typeof useWizardPreview>;
  device: ReturnType<typeof useWizardDevice>;
}

export function PreviewCanvas({ chat, preview, device }: PreviewCanvasProps) {
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

  if (!hasLiveData && !hasPreviewData) {
    return (
      <Wireframe
        businessName={chat.businessName}
        businessType={chat.businessType}
        businessSubType={chat.businessSubType}
        description={chat.description}
        chatStage={chat.chatStage}
        designToken={streamedDesignToken ?? null}
      />
    );
  }
  const candidatePool = getTemplatePool(chat.businessType, chat.mood);
  const fallbackTemplateId = candidatePool[0] || "TEMPLATE_JASA02";
  const liveContent = isStreamingLive ? streamedSections : (previewData?.content || {});
  const liveToken = isStreamingLive ? (streamedDesignToken ?? {}) : (previewData?.design_token || {});
  const liveTemplateId = isStreamingLive
    ? (streamedTemplateId || (streamedDesignToken as any)?.template_id || fallbackTemplateId)
    : (previewData?.template_id || fallbackTemplateId);
  const TemplateComponent = liveTemplateId ? getTemplateComponent(liveTemplateId) : null;
  const displayData: PreviewData = { content: liveContent, design_token: liveToken, template_id: liveTemplateId };

  const templatePreview = TemplateComponent ? (
    // eslint-disable-next-line react-hooks/static-components
    <TemplateComponent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content={buildFullContent(displayData, chat.businessName, chat.businessSubType || chat.businessType, chat.description, chat.whatsapp) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      design_token={liveToken as any}
      language={(chat.siteLanguage || "id") as any}
      isEditorMode={false}
      arrivedSections={isStreamingLive ? arrivedSections : undefined}
      onSubmitLead={async () => { }}
    />
  ) : (
    <Wireframe
      businessName={chat.businessName}
      businessType={chat.businessType}
      businessSubType={chat.businessSubType}
      description={chat.description}
      chatStage={chat.chatStage}
      designToken={streamedDesignToken ?? null}
    />
  );

  return (
    <div className="h-full flex flex-col overflow-hidden relative bg-[#0d0f14]">
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSwitchingTemplate ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"}`} style={{
        filter: `blur(${previewBlurPx}px)`,
        transition: "filter 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s, transform 0.3s",
      }}>
        {device.previewDevice === "mobile" ? (
          <div className="flex-1 min-h-0 overflow-auto bg-[#0d0f14] p-4" key={`mobile-${regenCount}-${historyIndex}`}>
            <div className="relative mx-auto my-3 h-[720px] w-[360px] max-w-full flex-shrink-0 rounded-[38px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800">
              <div className="absolute left-1/2 top-3 z-50 h-3.5 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
              <div className="relative z-10 h-full w-full overflow-hidden rounded-[28px] bg-white">
                <DevicePreviewFrame device="mobile" iframeRef={previewIframeRef}>{templatePreview}</DevicePreviewFrame>
              </div>
              <div className="absolute bottom-2 left-1/2 z-50 h-1 w-24 -translate-x-1/2 rounded-full bg-slate-700" />
            </div>
          </div>
        ) : device.previewDevice === "tablet" ? (
          <div className="flex-1 min-h-0 overflow-auto bg-[#0d0f14] p-4" key={`tablet-${regenCount}-${historyIndex}`}>
            <div className="relative mx-auto my-3 h-[820px] w-[540px] max-w-full flex-shrink-0 rounded-[20px] border-8 border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800">
              <div className="relative z-10 h-full w-full overflow-hidden rounded-[12px] bg-white">
                <DevicePreviewFrame device="tablet" iframeRef={previewIframeRef}>{templatePreview}</DevicePreviewFrame>
              </div>
            </div>
          </div>
        ) : (
          <div ref={previewScrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#0d0f14] pb-8" key={`desktop-${regenCount}-${historyIndex}`}>
            <DevicePreviewFrame device="desktop" iframeRef={previewIframeRef}>{templatePreview}</DevicePreviewFrame>
          </div>
        )}
      </div>
      {isSwitchingTemplate && (
        <div className="absolute inset-0 z-30 overflow-hidden bg-[#0d0f14]/70 backdrop-blur-[2px]">
          <Wireframe
            businessName={chat.businessName}
            businessType={chat.businessType}
            businessSubType={chat.businessSubType}
            description={chat.description}
            chatStage="done"
          />
        </div>
      )}
    </div>
  );
}
