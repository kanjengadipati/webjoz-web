"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { PreviewDevice } from "./types";

export function DevicePreviewFrame({
  device,
  children,
  iframeRef: externalRef,
}: {
  device: PreviewDevice;
  children: React.ReactNode;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  // Sync external ref with internal ref
  useEffect(() => {
    if (externalRef) externalRef.current = iframeRef.current;
  });

  const syncFrameDocument = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.head) return;

    doc.head.innerHTML = "";
    const viewport = doc.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1";
    doc.head.appendChild(viewport);

    const baseStyle = doc.createElement("style");
    baseStyle.textContent = "html,body{margin:0;padding:0;width:100%;min-height:100%} html{overflow-y:auto;height:100%} body{overflow:visible}";
    doc.head.appendChild(baseStyle);

    // Copy all parent stylesheets (fonts, Tailwind utilities, etc.)
    document
      .querySelectorAll<HTMLLinkElement | HTMLStyleElement>('link[rel="stylesheet"], style')
      .forEach((node) => {
        doc.head.appendChild(node.cloneNode(true));
      });

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

    if (doc.body) setMountNode(doc.body);
  };

  useEffect(() => {
    syncFrameDocument();
  }, [device]);

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
        const element = doc.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
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
      className={device === "desktop" ? "block h-full w-full border-0 bg-white" : "h-full w-full bg-white"}
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
}
