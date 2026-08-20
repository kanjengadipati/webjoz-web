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
      const vv = window.visualViewport;
      const height = vv?.height || window.innerHeight;
      const offsetTop = vv?.offsetTop || 0;

      document.documentElement.style.setProperty("--webjoz-app-height", `${height}px`);
      document.documentElement.style.setProperty("--webjoz-app-top", `${offsetTop}px`);

      const keyboardOpen = typeof window !== "undefined" && vv ? vv.height < window.innerHeight * 0.85 : false;
      setIsKeyboardOpen(keyboardOpen);

      // Snap window scroll back to (0, 0) immediately to prevent layout viewport offset
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
      if (document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
    };

    const handleWindowScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
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
      window.removeEventListener("scroll", handleWindowScroll);
      window.visualViewport?.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("scroll", setAppHeight);
      document.documentElement.style.removeProperty("--webjoz-app-height");
      document.documentElement.style.removeProperty("--webjoz-app-top");
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
