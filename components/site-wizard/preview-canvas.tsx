"use client";

import React from "react";
import { PreviewData } from "./types";
import { selectTemplate, getTemplateComponent } from "./helpers";
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
  const hasLiveData = Object.keys(preview.streamedSections).length > 0;
  const hasPreviewData = !!preview.previewData;

  if (!hasLiveData && !hasPreviewData) {
    return (
      <Wireframe
        businessName={chat.businessName}
        businessType={chat.businessType}
        businessSubType={chat.businessSubType}
        description={chat.description}
        chatStage={chat.chatStage}
      />
    );
  }

  const isStreamingLive = hasLiveData && (!preview.streamedTemplateId || !hasPreviewData);
  const liveContent = isStreamingLive ? preview.streamedSections : preview.previewData!.content;
  const liveToken = isStreamingLive ? (preview.streamedDesignToken ?? {}) : preview.previewData!.design_token;
  const liveTemplateId = (isStreamingLive ? preview.streamedTemplateId : preview.previewData!.template_id)
    || selectTemplate(chat.businessSubType || chat.businessType);
  const TemplateComponent = getTemplateComponent(liveTemplateId);
  const displayData: PreviewData = { content: liveContent, design_token: liveToken, template_id: liveTemplateId };

  const templatePreview = (
    <TemplateComponent
      content={buildFullContent(displayData, chat.businessName, chat.businessType, chat.description, chat.whatsapp) as any}
      design_token={liveToken as any}
      isEditorMode={false}
      arrivedSections={isStreamingLive ? preview.arrivedSections : undefined}
    />
  );

  return (
    <div className="h-full flex flex-col overflow-hidden relative bg-[#0d0f14]">
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${preview.isSwitchingTemplate ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"}`}>
        {device.previewDevice === "mobile" ? (
          <div className="flex-1 min-h-0 overflow-auto bg-[#0d0f14] p-4" key={`mobile-${preview.regenCount}-${preview.historyIndex}`}>
            <div className="relative mx-auto my-3 h-[720px] w-[360px] max-w-full flex-shrink-0 rounded-[38px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800">
              <div className="absolute left-1/2 top-3 z-50 h-3.5 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
              <div className="relative z-10 h-full w-full overflow-hidden rounded-[28px] bg-white">
                <DevicePreviewFrame device="mobile" iframeRef={preview.previewIframeRef}>{templatePreview}</DevicePreviewFrame>
              </div>
              <div className="absolute bottom-2 left-1/2 z-50 h-1 w-24 -translate-x-1/2 rounded-full bg-slate-700" />
            </div>
          </div>
        ) : device.previewDevice === "tablet" ? (
          <div className="flex-1 min-h-0 overflow-auto bg-[#0d0f14] p-4" key={`tablet-${preview.regenCount}-${preview.historyIndex}`}>
            <div className="relative mx-auto my-3 h-[820px] w-[540px] max-w-full flex-shrink-0 rounded-[20px] border-8 border-slate-900 bg-slate-950 shadow-2xl ring-4 ring-slate-800">
              <div className="relative z-10 h-full w-full overflow-hidden rounded-[12px] bg-white">
                <DevicePreviewFrame device="tablet" iframeRef={preview.previewIframeRef}>{templatePreview}</DevicePreviewFrame>
              </div>
            </div>
          </div>
        ) : (
          <div ref={preview.previewScrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#0d0f14] pb-8" key={`desktop-${preview.regenCount}-${preview.historyIndex}`}>
            <DevicePreviewFrame device="desktop" iframeRef={preview.previewIframeRef}>{templatePreview}</DevicePreviewFrame>
          </div>
        )}
      </div>
      {preview.isSwitchingTemplate && (
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
