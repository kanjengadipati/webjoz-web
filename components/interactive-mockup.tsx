"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { TEMPLATE_DEFAULT_DESIGN_TOKENS } from "@/lib/template-defaults";
import { SHOWCASE_ITEMS } from "@/lib/landing-showcase-data";
import { SparkleIcon } from "@/components/sparkle-icon";

const SEQUENCE = [
  { step: 0, delay: 0 },
  { step: 1, delay: 800 },    // AI greets
  { step: 2, delay: 2000 },   // User types business name
  { step: 3, delay: 3500 },   // AI asks type
  { step: 4, delay: 5000 },   // User picks "Kuliner"
  { step: 5, delay: 6500 },   // Generating...
  { step: 6, delay: 8000 },   // Preview appears with 3D depth
  { step: 7, delay: 9500 },   // Success banner
];
const CYCLE_MS = 13000;

function useFlowStep() {
  const [flowStep, setFlowStep] = useState(0);
  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      SEQUENCE.forEach(({ step, delay }) => {
        timers.push(setTimeout(() => setFlowStep(step), delay));
      });
    };
    run();
    const loop = setInterval(() => {
      timers.forEach(clearTimeout);
      timers = [];
      setFlowStep(0);
      run();
    }, CYCLE_MS);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);
  return flowStep;
}

/* ── RealPreviewPanel: renders an actual website template, scaled to fit ── */
function RealPreviewPanel({
  TemplateComponent,
  content,
  designToken,
  visible,
  baseWidth = 1280,
}: {
  TemplateComponent: React.ComponentType<any>;
  content: any;
  designToken: any;
  visible: boolean;
  baseWidth?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(0.22);
  const [scale, setScale] = useState(0.22);
  const [scrollMax, setScrollMax] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      setScale(el.offsetWidth / baseWidth);
    });
    obs.observe(el);
    setScale(el.offsetWidth / baseWidth);
    return () => obs.disconnect();
  }, [baseWidth]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  // Measure how far the scaled website can scroll within the visible panel.
  useEffect(() => {
    const panel = containerRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;
    const visHeight = inner.offsetHeight * scaleRef.current;
    setScrollMax(Math.max(0, visHeight - panel.offsetHeight));
  }, [scale]);

  // Auto-scroll the website top-to-bottom so more than just the hero is seen.
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    if (!visible || scrollMax <= 0) {
      inner.style.transform = `scale(${scale})`;
      return;
    }
    let raf: number;
    const duration = 4500;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      inner.style.transform = `translateY(${-scrollMax * eased}px) scale(${scale})`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [visible, scrollMax, scale]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: baseWidth,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <TemplateComponent content={content} design_token={designToken} isEditorMode={false} />
      </div>
      {/* Vignette overlay so edges blend smoothly */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(12,12,14,0.55) 100%)" }}
      />
    </div>
  );
}

/* ── PhoneMockup: mobile-first hero showcase inside a phone frame ───────── */
function PhoneMockup() {
  const { t, translations } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const flowStep = useFlowStep();

  const applyTilt = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const x = clientX - box.left - box.width / 2;
    const y = clientY - box.top - box.height / 2;
    const maxR = 10;
    setRotate({ x: -(y / (box.height / 2)) * maxR, y: (x / (box.width / 2)) * maxR });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => applyTilt(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) applyTilt(touch.clientX, touch.clientY);
  };
  const resetTilt = () => { setIsHovered(false); setRotate({ x: 0, y: 0 }); };

  const visible = (minStep: number) =>
    flowStep >= minStep ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none";

  const generating = flowStep === 5;

  const showcaseItem = SHOWCASE_ITEMS[0];
  const TemplateComponent = TEMPLATE_REGISTRY.find((t) => t.id === showcaseItem.templateId)?.component;
  const token = TEMPLATE_DEFAULT_DESIGN_TOKENS[showcaseItem.templateId]
    ?? TEMPLATE_DEFAULT_DESIGN_TOKENS.TEMPLATE_KULINER01!;

  return (
    <div
      className="relative flex w-full justify-center"
      style={{ perspective: "1100px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetTilt}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={resetTilt}
      onTouchMove={handleTouchMove}
    >
      {/* ── Outer glow halo ─────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[3rem] opacity-0 transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse at center, color-mix(in srgb,var(--primary) 25%,transparent), transparent 70%)",
          opacity: isHovered ? 1 : 0,
          filter: "blur(22px)",
        }}
      />

      {/* ── Phone frame ─────────────────────────────────────────────────── */}
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: "preserve-3d",
          transition: isHovered ? "transform 0.08s linear" : "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="relative w-[282px] sm:w-[310px] rounded-[2.6rem] border border-white/15 bg-[#0b0c10] p-2 shadow-[0_45px_130px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
      >
        {/* inner-top highlight */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-t-[2.6rem] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ── Screen ─────────────────────────────────────────────────────── */}
        <div className="relative aspect-[9/19.2] overflow-hidden rounded-[2.1rem] bg-[#0c0c0e]">
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-2 z-40 h-[22px] w-20 -translate-x-1/2 rounded-full border border-white/10 bg-black" />

          {/* ── Chat screen (steps 0-5) ── */}
          <div
            className={`absolute inset-0 flex flex-col gap-2.5 px-4 pb-4 pt-12 transition-opacity duration-300 ${
              flowStep >= 6 ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <div className={`flex items-end gap-2 transition-all duration-500 ${visible(1)}`}>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <SparkleIcon className="h-[15px] w-[15px]" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border/50 bg-card/70 px-3 py-2 text-[11px] text-foreground shadow-md backdrop-blur-sm">
                {t("landing.mockupGreeting")}
                {flowStep === 1 && <span className="ml-1 inline-block h-2.5 w-1 animate-pulse rounded-sm bg-primary" />}
              </div>
            </div>

            <div className={`flex justify-end transition-all duration-500 ${visible(2)}`}>
              <div
                className="max-w-[80%] rounded-2xl rounded-br-sm px-3 py-2 text-[11px] font-medium shadow-md"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#ffffff",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                }}
              >
                Toko Kopi Nusantara ☕
              </div>
            </div>

            <div className={`flex items-end gap-2 transition-all duration-500 ${visible(3)}`}>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <SparkleIcon className="h-[15px] w-[15px]" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border/50 bg-card/70 px-3 py-2 text-[11px] text-foreground shadow-md backdrop-blur-sm">
                {t("landing.mockupPickType")}
              </div>
            </div>

            <div className={`ml-8 flex flex-wrap gap-1.5 transition-all duration-500 ${visible(3)}`}>
              {translations.landing.mockupChips.map((chip, i) => {
                const sel = i === 0 && flowStep >= 4;
                return (
                  <div
                    key={chip}
                    className={`rounded-full border px-2.5 py-0.5 text-[9px] font-semibold transition-all duration-400 ${
                      sel ? "scale-105" : "bg-card/60 border-border/40 text-muted-foreground"
                    }`}
                    style={sel ? {
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      borderColor: "rgba(99,102,241,0.5)",
                      color: "#ffffff",
                      boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                    } : {}}
                  >
                    {chip}
                  </div>
                );
              })}
            </div>

            <div className={`ml-8 transition-all duration-500 ${visible(4)}`}>
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted/50 shadow-inner">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: generating ? "85%" : flowStep >= 6 ? "100%" : "30%",
                    background: "linear-gradient(90deg, var(--primary), color-mix(in srgb,var(--primary) 60%,white))",
                    boxShadow: "0 0 8px color-mix(in srgb,var(--primary) 50%,transparent)",
                    transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>
              <p className="mt-1 text-[9px] font-medium text-muted-foreground">
                {generating ? t("landing.mockupGenerating") : flowStep >= 6 ? t("landing.mockupReady") : t("landing.mockupStep")}
              </p>
            </div>
          </div>

          {/* ── Site screen (steps 6+) ── */}
          {TemplateComponent && (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                flowStep >= 6 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <RealPreviewPanel
                TemplateComponent={TemplateComponent}
                content={showcaseItem.content}
                designToken={token}
                visible={flowStep >= 6}
                baseWidth={390}
              />

              {/* Domain pill */}
              <div className="absolute left-1/2 top-9 z-30 -translate-x-1/2">
                <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/70 px-2.5 py-1 font-mono text-[8px] text-white/70 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  kopirempah.webjoz.com
                </div>
              </div>

              {/* Success bar */}
              <div
                className="absolute bottom-3 left-2.5 right-2.5 z-30 flex h-8 items-center rounded-xl px-3"
                style={{
                  transform: flowStep >= 7 ? "translateZ(22px)" : "translateZ(0px) translateY(4px)",
                  opacity: flowStep >= 7 ? 1 : 0,
                  transition: "transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.4s",
                  background: "linear-gradient(90deg, color-mix(in srgb,#22c55e 12%,transparent), color-mix(in srgb,#22c55e 5%,transparent))",
                  border: "1px solid color-mix(in srgb,#22c55e 30%,transparent)",
                  boxShadow: "0 4px 20px color-mix(in srgb,#22c55e 12%,transparent)",
                }}
              >
                <span className="flex items-center gap-2 text-[9px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e]" />
                  ✓ Website siap dipublikasikan!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function InteractiveMockup() {
  const { t, translations } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const flowStep = useFlowStep();

  /* ── 3D Tilt (mouse + touch) ─────────────────────────────────────────── */
  const applyTilt = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const x = clientX - box.left - box.width / 2;
    const y = clientY - box.top - box.height / 2;
    const maxR = 8;
    setRotate({ x: -(y / (box.height / 2)) * maxR, y: (x / (box.width / 2)) * maxR });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => applyTilt(e.clientX, e.clientY);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) applyTilt(touch.clientX, touch.clientY);
  };

  const resetTilt = () => { setIsHovered(false); setRotate({ x: 0, y: 0 }); };

  /* ── helpers ──────────────────────────────────────────────────────────── */
  const visible = (minStep: number) =>
    flowStep >= minStep ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none";

  const tz = (z: number) =>
    flowStep >= 6 ? `translateZ(${z}px)` : "translateZ(0px)";

  const generating = flowStep === 5;

  return (
    <>
      {/* ── Desktop: browser mockup (hidden on mobile) ─────────────────── */}
      <div
        className="hidden w-full md:block"
        style={{ perspective: "1100px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={resetTilt}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={resetTilt}
        onTouchMove={handleTouchMove}
      >
      {/* ── Outer glow halo ─────────────────────────────────────────────── */}
      <div className="relative">
        <div
          className="absolute -inset-px rounded-[2.2rem] opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, color-mix(in srgb,var(--primary) 25%,transparent), transparent 70%)",
            opacity: isHovered ? 1 : 0,
            filter: "blur(18px)",
          }}
        />

        {/* ── Card ────────────────────────────────────────────────────────── */}
        <div
          ref={cardRef}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transformStyle: "preserve-3d",
            transition: isHovered ? "transform 0.08s linear" : "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="relative rounded-[2rem] border border-white/10 bg-card/50 p-1.5 shadow-[0_45px_130px_rgba(0,0,0,0.38)] backdrop-blur-xl ring-1 ring-white/5"
        >
          {/* inner-top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[2rem] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* ── Browser chrome ──────────────────────────────────────────── */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 select-none">
            <div className="flex gap-1.5">
              {["bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]"].map((c, i) => (
                <div key={i} className={`h-2.5 w-2.5 rounded-full ${c} opacity-80 shadow-sm`} />
              ))}
            </div>
            <div className="flex-1 rounded-full bg-muted/40 px-4 py-1.5 text-center text-[11px] text-muted-foreground font-mono tracking-tight">
              <span className="opacity-50">https://</span>webjoz.com<span className="opacity-50">/create</span>
            </div>
          </div>

          {/* ── Content grid ──────────────────────────────────────────────── */}
          <div
            className="grid gap-0 grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-[1fr_1.1fr] overflow-hidden rounded-b-[1.8rem]"
            style={{ transformStyle: "preserve-3d" }}
          >

            {/* ── Left: Chat panel ──────────────────────────────────────── */}
            <div className="flex flex-col gap-3 p-4 md:p-5 border-b md:border-b-0 md:border-r border-border/20 bg-background/20 min-h-[260px] md:min-h-[480px]">
              
              {/* AI avatar row */}
              <div className={`flex gap-2 items-end transition-all duration-500 ${visible(1)}`}>
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg text-primary-foreground">
                  <SparkleIcon className="w-[18px] h-[18px]" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-card/70 border border-border/50 px-3.5 py-2.5 text-xs text-foreground max-w-[80%] shadow-md backdrop-blur-sm">
                  {t("landing.mockupGreeting")}
                  {flowStep === 1 && <span className="ml-1 inline-block w-1 h-3 bg-primary animate-pulse rounded-sm" />}
                </div>
              </div>

              <div className={`flex justify-end transition-all duration-500 ${visible(2)}`}>
                <div className="rounded-2xl rounded-br-sm px-3.5 py-2.5 text-xs max-w-[75%] shadow-md font-medium"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#ffffff",
                    boxShadow: "0 4px 16px rgba(99,102,241,0.35)"
                  }}
                >
                  Toko Kopi Nusantara ☕
                </div>
              </div>

              {/* AI asks type */}
              <div className={`flex gap-2 items-end transition-all duration-500 ${visible(3)}`}>
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg text-primary-foreground">
                  <SparkleIcon className="w-[18px] h-[18px]" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-card/70 border border-border/50 px-3.5 py-2.5 text-xs text-foreground max-w-[80%] shadow-md backdrop-blur-sm">
                  {t("landing.mockupPickType")}
                </div>
              </div>

              {/* Category chips */}
              <div className={`flex flex-wrap gap-1.5 ml-9 transition-all duration-500 ${visible(3)}`}>
                {translations.landing.mockupChips.map((chip, i) => {
                  const sel = i === 0 && flowStep >= 4;
                  return (
                    <div key={chip} className={`rounded-full px-3 py-1 text-[10px] font-semibold border transition-all duration-400 ${
                      sel
                        ? "scale-105"
                        : "bg-card/60 border-border/40 text-muted-foreground"
                    }`}
                      style={sel ? {
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        borderColor: "rgba(99,102,241,0.5)",
                        color: "#ffffff",
                        boxShadow: "0 4px 14px rgba(99,102,241,0.3)"
                      } : {}}
                    >{chip}</div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className={`ml-9 transition-all duration-500 ${visible(4)}`}>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden w-36 shadow-inner">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: generating ? "85%" : flowStep >= 6 ? "100%" : "30%",
                      background: "linear-gradient(90deg, var(--primary), color-mix(in srgb,var(--primary) 60%,white))",
                      boxShadow: "0 0 8px color-mix(in srgb,var(--primary) 50%,transparent)",
                      transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground font-medium">
                  {generating ? t("landing.mockupGenerating") : flowStep >= 6 ? t("landing.mockupReady") : t("landing.mockupStep")}
                </p>
              </div>
            </div>

            {/* ── Right: Live 3D Preview panel ──────────────────────────── */}
            <div
              className="relative block overflow-hidden bg-[#0c0c0e] min-h-[360px] sm:min-h-[440px] md:min-h-[480px]"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Scan line on generating */}
              {generating && (
                <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent"
                    style={{ animation: "scan 1.2s linear infinite" }}
                  />
                </div>
              )}

              {/* ── Real template preview (before step 6: blurred skeleton, after: real) ── */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  opacity: flowStep >= 5 ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }}
              >
                {/* Skeleton shimmer shown while generating */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    opacity: flowStep >= 6 ? 0 : 1,
                    transition: "opacity 0.5s ease",
                    background: "linear-gradient(110deg, #111 25%, #1a1a1a 50%, #111 75%)",
                    backgroundSize: "200% 100%",
                    animation: generating ? "shimmer 1.4s linear infinite" : "none",
                  }}
                />

                {/* Real website preview */}
                {(() => {
                  const showcaseItem = SHOWCASE_ITEMS[0]; // Kopi Rempah Nusantara (kuliner)
                  const TemplateComponent = TEMPLATE_REGISTRY.find(
                    (t) => t.id === showcaseItem.templateId
                  )?.component;
                  const token = TEMPLATE_DEFAULT_DESIGN_TOKENS[showcaseItem.templateId]
                    ?? TEMPLATE_DEFAULT_DESIGN_TOKENS.TEMPLATE_KULINER01!;

                  if (!TemplateComponent) return null;

                  return (
                    <RealPreviewPanel
                      TemplateComponent={TemplateComponent}
                      content={showcaseItem.content}
                      designToken={token}
                      visible={flowStep >= 6}
                    />
                  );
                })()}
              </div>

              {/* Overlay gradient — fades out when real preview shows */}
              <div
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-700"
                style={{
                  opacity: flowStep >= 6 ? 0 : 1,
                  background: "linear-gradient(160deg, color-mix(in srgb,var(--primary) 4%,transparent) 0%, #0c0c0e 100%)",
                }}
              />

              {/* Domain pill — floats above real preview */}
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 z-30 transition-all duration-500"
                style={{
                  opacity: flowStep >= 6 ? 1 : 0,
                  transform: flowStep >= 6 ? `translateX(-50%) ${tz(30)}` : "translateX(-50%) translateY(-4px)",
                  transition: "opacity 0.5s, transform 0.6s cubic-bezier(0.34,1.3,0.64,1)",
                }}
              >
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/15 rounded-full px-3 py-1 text-[10px] font-mono text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  kopirempah.webjoz.com
                </div>
              </div>

              {/* ── Success bar ────────────────────────────────── */}
              <div
                className="absolute bottom-3 left-3 right-3 h-9 rounded-xl flex items-center px-3.5 z-30"
                style={{
                  transform: flowStep >= 7 ? tz(22) : "translateZ(0px) translateY(4px)",
                  opacity: flowStep >= 7 ? 1 : 0,
                  transition: "transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.4s",
                  background: "linear-gradient(90deg, color-mix(in srgb,#22c55e 12%,transparent), color-mix(in srgb,#22c55e 5%,transparent))",
                  border: "1px solid color-mix(in srgb,#22c55e 30%,transparent)",
                  boxShadow: "0 4px 20px color-mix(in srgb,#22c55e 12%,transparent)",
                }}
              >
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e] animate-pulse" />
                  ✓ Website siap dipublikasikan!
                </span>
              </div>

            </div>{/* end right panel */}
          </div>
        </div>
      </div>

      {/* scan + shimmer keyframes */}
      <style>{`
        @keyframes scan {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      </div>

      {/* ── Mobile: phone mockup (desktop uses browser mockup above) ───── */}
      <div className="md:hidden">
        <PhoneMockup />
      </div>
    </>
  );
}
