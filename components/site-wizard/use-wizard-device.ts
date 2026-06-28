"use client";

import { useState, useEffect, useRef } from "react";

export type MobileScreen = "chat" | "loading" | "preview";

export function useWizardDevice() {
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>("chat");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setPreviewDevice("mobile");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setAppHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--webjoz-app-height", `${height}px`);
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("resize", setAppHeight);

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
  };
}
