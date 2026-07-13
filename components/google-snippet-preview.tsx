"use client";

import React from "react";

export interface BusinessPreview {
  name: string;
  subdomain: string;
  title: string;
  description: string;
  rating: string;
  reviewCount: string;
  priceRange: string;
  status: string;
}

interface GoogleSnippetPreviewProps {
  variant: "plain" | "rich";
  business: BusinessPreview;
}

export function GoogleSnippetPreview({ variant, business }: GoogleSnippetPreviewProps) {
  const faviconLetter = business.name.charAt(0).toUpperCase() || "W";

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-left" style={{ fontFamily: "arial, sans-serif" }}>
      {/* Breadcrumb URL ala Google */}
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-inner shrink-0 select-none">
          {faviconLetter}
        </div>
        <div className="text-xs text-slate-700 leading-tight">
          <div className="font-semibold text-slate-800 text-[12px]">{business.name}</div>
          <div className="text-[10px] text-slate-500 hover:underline cursor-pointer">
            https://{business.subdomain}.webjoz.com
          </div>
        </div>
      </div>

      {/* Title ala link Google (biru, underline on hover) */}
      <h3 className="text-base text-[#1a0dab] leading-snug font-medium mb-1 hover:underline cursor-pointer">
        {business.title}
      </h3>

      {/* Rich snippet row — CUMA muncul di variant "rich" */}
      {variant === "rich" && (
        <div className="flex items-center gap-1.5 text-xs mb-1 animate-pulse-once">
          <div className="flex text-[#fbbc04] tracking-tight">
            {"★★★★".split("").map((s, i) => (
              <span key={i} className="text-xs">★</span>
            ))}
            <span className="text-slate-300 text-xs">★</span>
          </div>
          <span className="text-[#4d5156] text-[11px]">
            <strong>{business.rating}</strong> · ({business.reviewCount} ulasan)
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-[12px] text-[#4d5156] leading-relaxed mb-1 line-clamp-2 break-words">
        {business.description}
      </p>

      {/* Price and status row — CUMA muncul di variant "rich" */}
      {variant === "rich" && (
        <div className="flex items-center gap-2 text-[11px] text-[#4d5156] animate-pulse-once font-normal mt-1">
          <span>💰 {business.priceRange}</span>
          <span className="text-slate-300 select-none">•</span>
          <span className="text-[#188038] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#188038] inline-block animate-pulse"></span>
            {business.status}
          </span>
        </div>
      )}
    </div>
  );
}
