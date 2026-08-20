"use client";

import { useState, useEffect, useRef } from "react";

export type MobileScreen = "chat" | "loading" | "preview";

/**
 * Returns true when a soft keyboard is open (via visualViewport shrinkage).
 * Only meaningful on mobile; always false on desktop.
 */
function detectKeyboardOpen(): boolean {
  if (typeof window === "undefined" || !window.visualViewport) return false;
  // Keyboard is considered open when the visual viewport height is
  // meaningfully smaller than the layout viewport height.
  return window.visualViewport.height < window.innerHeight * 0.8;
}

export function useWizardDevice() {
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>("chat");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setPreviewDevice("mobile");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setAppHeight = () => {
      const vvHeight = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--webjoz-app-height", `${vvHeight}px`);
      // Track keyboard state (iOS: visualViewport shrinks when keyboard opens)
      const keyboardOpen = detectKeyboardOpen();
      setIsKeyboardOpen(keyboardOpen);
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("scroll", setAppHeight);

    const mq = window.matchMedia("(max-width: 767px)");
    isMobileRef.current = mq.matches;
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches;
      setIsMobile(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("scroll", setAppHeight);
      document.documentElement.style.removeProperty("--webjoz-app-height");
    };
  }, []);

  return {
    isMobile,
    isMobileRef,
    mobileScreen,
    setMobileScreen,
    mobilePreviewOpen,
    setMobilePreviewOpen,
    previewDevice,
    setPreviewDevice,
    isKeyboardOpen,
  };
}
