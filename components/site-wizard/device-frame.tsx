"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { smoothScrollToSection } from "@/components/templates/shared";
import { loadGoogleFont } from "@/components/templates/helpers";
import type { PreviewDevice } from "./types";

const SYNC_MARK = "data-wz-sync";

export function DevicePreviewFrame({
  device,
  children,
  iframeRef: externalRef,
  typography,
}: {
  device: PreviewDevice;
  children: React.ReactNode;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  typography?: {
    heading_font?: string;
    body_font?: string;
    heading_font_url?: string;
    body_font_url?: string;
  };
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  // Mirror of mountNode readable from timers/callbacks without stale closures.
  const mountRef = useRef<HTMLElement | null>(null);
  const applyMountNode = (node: HTMLElement | null) => {
    mountRef.current = node;
    setMountNode(node);
  };

  // Sync external ref with internal ref
  useEffect(() => {
    if (externalRef) externalRef.current = iframeRef.current;
  });

  const copyParentStyles = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.head) return;

    document
      .querySelectorAll<HTMLLinkElement | HTMLStyleElement>('link[rel="stylesheet"], style')
      .forEach((node) => {
        if (node.tagName === "LINK") {
          const linkNode = node as HTMLLinkElement;
          const absoluteHref = linkNode.href;
          if (!absoluteHref) return;
          const existing = doc.head.querySelector(`link[href="${absoluteHref}"]`);
          if (!existing) {
            const link = doc.createElement("link");
            link.rel = "stylesheet";
            link.href = absoluteHref;
            doc.head.appendChild(link);
          }
        } else if (node.tagName === "STYLE") {
          const content = node.textContent || "";
          if (!content) return;
          // Avoid duplicate styles
          const styles = doc.head.querySelectorAll("style");
          let exists = false;
          for (let i = 0; i < styles.length; i++) {
            if (styles[i].textContent === content) {
              exists = true;
              break;
            }
          }
          if (!exists) {
            const style = doc.createElement("style");
            style.textContent = content;
            doc.head.appendChild(style);
          }
        }
      });

    // Synchronize adoptedStyleSheets (used by Tailwind v4 runtime / Turbopack)
    try {
      if (document.adoptedStyleSheets && doc.adoptedStyleSheets) {
        doc.adoptedStyleSheets = [...document.adoptedStyleSheets];
      }
    } catch {
      // Cross-document adoptedStyleSheets may be restricted in some browsers
    }
  };

  const syncFrameDocument = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.head) return;

    doc.head.innerHTML = "";

    // Set base href to parent origin so all relative chunks/assets resolve correctly
    if (typeof window !== "undefined") {
      const base = doc.createElement("base");
      base.href = `${window.location.origin}/`;
      doc.head.appendChild(base);
    }

    const viewport = doc.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1";
    doc.head.appendChild(viewport);

    const baseStyle = doc.createElement("style");
    baseStyle.textContent = `
      html,body{margin:0;padding:0;width:100%;min-height:100%}
      html{overflow-y:auto;height:100%;scroll-behavior:smooth}
      body{overflow:visible}
      [id^="section-"], section[id], div[id^="section-preview-"] { scroll-margin-top: 80px; }
      input[type="file"].hidden, .hidden { display: none !important; }
      svg:not([class*="size-"]):not([class*="w-"]) { max-width: 100%; }
      body.inline-editing-active { padding-bottom: 50vh !important; scroll-behavior: smooth; }
    `;
    doc.head.appendChild(baseStyle);

    // Copy all parent stylesheets (fonts, Tailwind utilities, dynamic chunks)
    copyParentStyles();

    // Override dark-mode CSS variables so the template palette renders correctly.
    // The wizard page uses `.dark` on <html> which injects dark --background, --foreground etc.
    // We reset these to light-mode values here so template colors aren't polluted.
    const lightOverride = doc.createElement("style");
    lightOverride.textContent = `
      html, body, :root {
        color-scheme: light !important;
        --background: oklch(0.976 0.007 255) !important;
        --foreground: oklch(0.18 0.025 255) !important;
        --card: oklch(0.995 0.002 255 / 0.92) !important;
        --card-foreground: oklch(0.18 0.025 255) !important;
        --primary: oklch(0.15 0 0) !important;
        --primary-foreground: oklch(0.98 0 0) !important;
        --secondary: oklch(0.925 0 0) !important;
        --secondary-foreground: oklch(0.2 0 0) !important;
        --muted: oklch(0.94 0 0) !important;
        --muted-foreground: oklch(0.43 0 0) !important;
        --accent: oklch(0.91 0 0) !important;
        --accent-foreground: oklch(0.19 0 0) !important;
        --border: oklch(0.855 0 0) !important;
        --input: oklch(0.845 0 0) !important;
      }
    `;
    doc.head.appendChild(lightOverride);

    // Marker lives on <html>, so it disappears whenever the iframe document is
    // replaced (srcDoc load). ensureSynced() uses it to detect a stale document.
    doc.documentElement.setAttribute(SYNC_MARK, "1");
    if (doc.body) applyMountNode(doc.body);

    // Initial font injection into iframe head
    if (typography) {
      loadGoogleFont(
        typography.heading_font,
        typography.body_font,
        typography.heading_font_url,
        typography.body_font_url,
        doc
      );
    }
  };

  // Watch for dynamic stylesheet additions in parent window (Next.js dynamic chunks loaded during scroll)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      copyParentStyles();
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // The iframe document can be replaced after our first sync (srcDoc load in
  // Safari/Firefox, fast remounts). If that happens without an onLoad we would
  // keep portaling into a detached body and the preview stays blank. Re-check
  // against the live document instead of trusting the stored mount node.
  const ensureSynced = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body || !doc.head) return;
    if (!doc.documentElement.hasAttribute(SYNC_MARK)) {
      syncFrameDocument();
    } else if (mountRef.current !== doc.body) {
      applyMountNode(doc.body);
    }
  };

  useEffect(() => {
    syncFrameDocument();
    let tries = 0;
    const id = window.setInterval(() => {
      ensureSynced();
      if (++tries >= 40) window.clearInterval(id); // ~4s safety net after mount
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  // Reactive font injection whenever typography overrides change
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.head || !typography) return;
    loadGoogleFont(
      typography.heading_font,
      typography.body_font,
      typography.heading_font_url,
      typography.body_font_url,
      doc
    );
  }, [
    typography?.heading_font,
    typography?.body_font,
    typography?.heading_font_url,
    typography?.body_font_url,
  ]);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc || !mountNode) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      // Always prevent default to stop the iframe from navigating away
      e.preventDefault();

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#")) {
        // Hash link → smooth-scroll to element inside the iframe document
        const id = href.slice(1);
        smoothScrollToSection(id, doc);
      } else {
        // External link (WA, https://, tel:, mailto:) → open in a new tab
        // so the preview iframe never navigates away.
        window.open(href, "_blank", "noopener,noreferrer");
      }
    };

    doc.addEventListener("click", handleAnchorClick);
    return () => {
      doc.removeEventListener("click", handleAnchorClick);
    };
  }, [mountNode]);

  return (
    <iframe
      key={device}
      ref={iframeRef}
      title={device === "desktop" ? "Preview desktop" : device === "tablet" ? "Preview tablet" : "Preview mobile"}
      onLoad={syncFrameDocument}
      srcDoc="<!doctype html><html><head></head><body style='background:#0d0f14'></body></html>"
      className="block h-full w-full border-0 bg-white"
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
}
