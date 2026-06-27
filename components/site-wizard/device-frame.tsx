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
    baseStyle.textContent = "html,body{margin:0;padding:0;width:100%;min-height:100%} html{overflow-y:auto;height:100%} body{overflow:visible;background:#0d0f14}";
    doc.head.appendChild(baseStyle);

    document
      .querySelectorAll<HTMLLinkElement | HTMLStyleElement>('link[rel="stylesheet"], style')
      .forEach((node) => {
        doc.head.appendChild(node.cloneNode(true));
      });

    if (doc.body) setMountNode(doc.body);
  };

  useEffect(() => {
    syncFrameDocument();
  }, [device]);

  return (
    <iframe
      key={device}
      ref={iframeRef}
      title={device === "desktop" ? "Preview desktop" : "Preview mobile"}
      onLoad={syncFrameDocument}
      srcDoc="<!doctype html><html><head></head><body style='background:#0d0f14'></body></html>"
      className={device === "desktop" ? "block h-full w-full border-0 bg-white" : "h-full w-full bg-white"}
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
}
