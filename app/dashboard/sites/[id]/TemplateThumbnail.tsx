import React from "react";

export interface TemplateThumbnailProps {
  previewType: "brand" | "service" | "catalog" | "dynamic";
  accent: string;
  active?: boolean;
  compact?: boolean;
  palette?: {
    primary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
  };
}

export default function TemplateThumbnail({
  previewType,
  accent,
  active,
  compact,
  palette,
}: TemplateThumbnailProps) {
  const primaryColor = palette?.primary || accent || "#7C3AED";
  const accentColor = palette?.accent || accent || "#BA7517";
  const bgColor = palette?.background || (previewType === "brand" ? "#FAF7F2" : previewType === "catalog" ? "#0b0f19" : "#F3F4F6");
  const surfaceColor = palette?.surface || "#FFFFFF";
  const textColor = palette?.text || (previewType === "catalog" ? "#FFFFFF" : "#1E293B");

  return (
    <div 
      className={`relative ${compact ? "h-10" : "h-16"} w-full overflow-hidden rounded-md border ${active ? "border-white/70" : "border-white/10"}`}
      style={{ backgroundColor: bgColor }}
    >
      {previewType === "service" && (
        <>
          <div className="absolute left-2 top-2 h-1.5 w-10 rounded-full transition-colors" style={{ backgroundColor: primaryColor }} />
          <div className="absolute left-2 top-5 h-2 w-20 rounded-full transition-colors" style={{ backgroundColor: textColor, opacity: 0.8 }} />
          <div className="absolute left-2 top-8 h-1.5 w-16 rounded-full transition-colors" style={{ backgroundColor: textColor, opacity: 0.4 }} />
          <div className="absolute bottom-2 left-2 h-3 w-12 rounded-sm transition-colors" style={{ backgroundColor: accentColor }} />
          <div className="absolute bottom-2 right-2 grid w-12 grid-cols-2 gap-1">
            <div className="h-3 rounded-sm transition-colors" style={{ backgroundColor: surfaceColor, border: `1px solid ${textColor}15` }} />
            <div className="h-3 rounded-sm transition-colors" style={{ backgroundColor: surfaceColor, border: `1px solid ${textColor}15` }} />
          </div>
        </>
      )}
      {previewType === "catalog" && (
        <>
          <div className="absolute -left-4 top-0 h-full w-16 rotate-6 transition-colors" style={{ backgroundColor: primaryColor }} />
          <div className="absolute right-2 top-3 h-2 w-16 rounded-full transition-colors" style={{ backgroundColor: textColor }} />
          <div className="absolute right-2 top-7 h-1.5 w-12 rounded-full transition-colors" style={{ backgroundColor: textColor, opacity: 0.4 }} />
          <div className="absolute bottom-2 right-2 grid w-16 grid-cols-3 gap-1">
            <div className="h-4 rounded-sm transition-colors" style={{ backgroundColor: surfaceColor, opacity: 0.8 }} />
            <div className="h-4 rounded-sm transition-colors" style={{ backgroundColor: surfaceColor, opacity: 0.8 }} />
            <div className="h-4 rounded-sm transition-colors" style={{ backgroundColor: surfaceColor, opacity: 0.8 }} />
          </div>
        </>
      )}
      {previewType === "brand" && (
        <>
          <div className="absolute inset-x-2 top-2 h-2 rounded-full transition-colors" style={{ backgroundColor: surfaceColor }} />
          <div className="absolute left-2 top-6 h-2 w-16 rounded-full transition-colors" style={{ backgroundColor: primaryColor }} />
          <div className="absolute left-2 top-10 h-1.5 w-20 rounded-full transition-colors" style={{ backgroundColor: textColor, opacity: 0.4 }} />
          <div className="absolute bottom-2 left-2 right-2 grid grid-cols-2 gap-1">
            <div className="h-4 rounded-sm transition-colors" style={{ backgroundColor: surfaceColor }} />
            <div className="h-4 rounded-sm transition-colors" style={{ backgroundColor: surfaceColor }} />
          </div>
        </>
      )}
      {previewType === "dynamic" && (
        <>
          <div className="absolute top-0 left-0 right-0 h-3 border-b transition-colors" style={{ backgroundColor: surfaceColor, borderColor: `${primaryColor}20` }}>
            <div className="absolute left-1.5 top-1 h-1 w-6 rounded-full transition-colors" style={{ backgroundColor: primaryColor }} />
            <div className="absolute right-1.5 top-1 h-1.5 w-1.5 rounded-full transition-colors" style={{ backgroundColor: accentColor }} />
          </div>
          <div className="absolute left-2 top-4.5 h-1 w-14 rounded-full transition-colors" style={{ backgroundColor: textColor, opacity: 0.3 }} />
          <div className="absolute left-2 top-6.5 h-1 w-10 rounded-full transition-colors" style={{ backgroundColor: textColor, opacity: 0.15 }} />
          <div className="absolute left-2 bottom-1.5 h-2 w-7 rounded-sm transition-colors" style={{ backgroundColor: primaryColor }} />
          <div className="absolute bottom-1.5 right-1.5 flex gap-0.5">
            <div className="h-1.5 w-1.5 rounded-full transition-colors" style={{ backgroundColor: primaryColor }} />
            <div className="h-1.5 w-1.5 rounded-full transition-colors" style={{ backgroundColor: accentColor }} />
            <div className="h-1.5 w-1.5 rounded-full transition-colors" style={{ backgroundColor: textColor }} />
          </div>
          <div className="absolute bottom-1 left-2 text-[5px] font-black uppercase tracking-wider" style={{ color: textColor, opacity: 0.4 }}>AI</div>
        </>
      )}
    </div>
  );
}
