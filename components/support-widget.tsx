"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/site-config";

declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
  }
}

export function SupportWidget() {
  const pathname = usePathname();
  const [hasCrisp, setHasCrisp] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isEnglish = pathname?.startsWith("/en");

  const defaultMsg = isEnglish
    ? "Hello Webjoz Support, I need assistance with creating my website."
    : "Halo CS Webjoz, saya butuh bantuan terkait pembuatan website di Webjoz.";

  const waUrl = getWhatsAppUrl(defaultMsg);

  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!websiteId || typeof window === "undefined") return;

    setHasCrisp(true);
    if (window.$crisp) return;

    window.CRISP_WEBSITE_ID = websiteId;
    window.$crisp = [];

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // Show a gentle greeting bubble once after 5s if user hasn't interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setIsTooltipOpen(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasInteracted]);

  // Don't render floating WA button if Crisp is configured & loaded to avoid widget collision
  if (hasCrisp && process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
    return null;
  }

  // Hide on public site previews if in iframe or subpath
  if (pathname?.startsWith("/s/") || pathname?.startsWith("/site-by-domain")) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 print:hidden select-none">
      {/* Tooltip greeting popup */}
      {isTooltipOpen && (
        <div className="relative flex items-center gap-2 rounded-2xl bg-card/95 backdrop-blur-md border border-emerald-500/30 px-3.5 py-2.5 shadow-xl shadow-black/30 text-xs text-foreground animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[220px]">
          <div className="flex-1">
            <span className="font-semibold text-emerald-400 block mb-0.5">
              {isEnglish ? "Need help?" : "Butuh bantuan?"}
            </span>
            <span className="text-muted-foreground text-[11px] leading-tight block">
              {isEnglish ? "Chat directly with our team on WhatsApp." : "Konsultasi & tanya CS Webjoz via WhatsApp."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsTooltipOpen(false);
              setHasInteracted(true);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-card border-r border-b border-emerald-500/30 rotate-45" />
        </div>
      )}

      {/* WhatsApp Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setHasInteracted(true)}
        className="group relative flex items-center justify-center size-13 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-600/35 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Chat WhatsApp Support"
      >
        {/* Pulse ripple ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none opacity-75 duration-1000" />

        {/* WhatsApp Icon SVG */}
        <svg
          className="size-7 fill-white transition-transform group-hover:rotate-6"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        {/* Online status indicator badge */}
        <span className="absolute top-0 right-0 size-3 rounded-full bg-emerald-300 border-2 border-background" />
      </a>
    </div>
  );
}
