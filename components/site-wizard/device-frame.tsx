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
  const syncedNodesRef = useRef<WeakSet<HTMLElement>>(new WeakSet());
  const observerRef = useRef<MutationObserver | null>(null);

  // Sync external ref with internal ref
  useEffect(() => {
    if (externalRef) externalRef.current = iframeRef.current;
  });

  const syncParentStyles = (doc: Document) => {
    const parentStyles = document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>('link[rel="stylesheet"], style');
    parentStyles.forEach((node) => {
      if (syncedNodesRef.current.has(node)) return;
      syncedNodesRef.current.add(node);

      const clone = node.cloneNode(true) as HTMLElement;
      doc.head.appendChild(clone);
    });
  };

  const syncFrameDocument = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.head) return;

    doc.head.innerHTML = "";

    // Clear synced nodes tracking for this load of the document
    syncedNodesRef.current = new WeakSet();

    const viewport = doc.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1";
    doc.head.appendChild(viewport);

    const baseStyle = doc.createElement("style");
    baseStyle.textContent = "html,body{margin:0;padding:0;width:100%;min-height:100%} html{overflow-y:auto;height:100%} body{overflow:visible;background:#0d0f14}";
    doc.head.appendChild(baseStyle);

    // Initial sync of all parent stylesheets
    syncParentStyles(doc);

    if (doc.body) setMountNode(doc.body);

    // Set up MutationObserver to watch for new style tags in parent document.head
    observerRef.current?.disconnect();
    const observer = new MutationObserver(() => {
      const currentDoc = iframeRef.current?.contentDocument;
      if (currentDoc?.head) {
        syncParentStyles(currentDoc);
      }
    });
    observer.observe(document.head, { childList: true, subtree: false });
    observerRef.current = observer;
  };

  useEffect(() => {
    syncFrameDocument();
    return () => {
      observerRef.current?.disconnect();
    };
  }, [device]);

  return (
    <iframe
      key={device}
      ref={iframeRef}
      title={device === "desktop" ? "Preview desktop" : "Preview mobile"}
      onLoad={syncFrameDocument}
      srcDoc="<!doctype html><html><head></head><body style='background:#0d0f14'></body></html>"
      className={device === "desktop" ? "block h-full w-full border-0 bg-transparent" : "h-full w-full bg-transparent"}
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
}

