"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TEMPLATE_REGISTRY, type DesignToken } from "@/lib/template-registry";
import { TEMPLATE_DEFAULT_DESIGN_TOKENS } from "@/lib/template-defaults";
import { SHOWCASE_ITEMS, findShowcaseSample, TEMPLATE_PREFILL_MAP } from "@/lib/landing-showcase-data";
import { fetchDesignTokenLibrary } from "@/lib/design-token-library";
import { buildCssVars } from "@/components/templates/helpers";
import { SparkleIcon } from "@/components/sparkle-icon";

type ShowcaseItem = (typeof SHOWCASE_ITEMS)[number];
type HeroItem = { sample: ShowcaseItem; token: DesignToken };

const STEP_GREET = 1;
const STEP_NAME = 2;
const STEP_ASK_TYPE = 3;
const STEP_PICK_TYPE = 4;
const STEP_ASK_MOOD = 5;
const STEP_PICK_MOOD = 6;
const STEP_GENERATING = 7;
const STEP_PREVIEW = 8;
const STEP_SUCCESS = 9;

const SEQUENCE = [
  { step: 0, delay: 0 },
  { step: STEP_GREET, delay: 700 },       // AI greets
  { step: STEP_NAME, delay: 1800 },       // User types business name
  { step: STEP_ASK_TYPE, delay: 3000 },   // AI asks type
  { step: STEP_PICK_TYPE, delay: 4100 },  // User picks business type
  { step: STEP_ASK_MOOD, delay: 5300 },   // AI asks mood
  { step: STEP_PICK_MOOD, delay: 6500 },  // User picks mood
  { step: STEP_GENERATING, delay: 7800 }, // Generating...
  { step: STEP_PREVIEW, delay: 9200 },    // Preview appears with 3D depth
  { step: STEP_SUCCESS, delay: 10700 },   // Success banner
];
const CYCLE_MS = 14500;

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

/* ── Best hero template (highest AI aesthetic score) ───────────────────── */
function getDefaultToken(templateId: string): DesignToken {
  return TEMPLATE_DEFAULT_DESIGN_TOKENS[templateId] ?? TEMPLATE_DEFAULT_DESIGN_TOKENS.TEMPLATE_DYNAMIC!;
}

function domainSlug(businessName: string): string {
  const words = (businessName || "").toLowerCase().split(/\s+/).filter(Boolean);
  return (words.slice(0, 2).join("").replace(/[^a-z0-9]/g, "") || "mywebsite").slice(0, 20);
}

const FALLBACK_HERO: HeroItem = {
  sample: SHOWCASE_ITEMS[0],
  token: getDefaultToken(SHOWCASE_ITEMS[0].templateId),
};

function useBestHero(): HeroItem {
  const [hero, setHero] = useState<HeroItem>(FALLBACK_HERO);
  useEffect(() => {
    let cancelled = false;
    fetchDesignTokenLibrary(100).then((tokens) => {
      if (cancelled || tokens.length === 0) return;
      const sorted = [...tokens].sort(
        (a, b) =>
          (b.aesthetic_score ?? -1) - (a.aesthetic_score ?? -1) ||
          (b.score ?? 0) - (a.score ?? 0)
      );
      const best = sorted[0];
      if (!best) return;
      setHero({ sample: findShowcaseSample(best.business_type, best.id), token: best.design_token });
    });
    return () => { cancelled = true; };
  }, []);
  return hero;
}

/* ── RealPreviewPanel: renders an actual website template, scaled to fit ── */
function RealPreviewPanel({
  TemplateComponent,
  content,
  designToken,
  flowStep = 0,
  baseWidth = 1280,
}: {
  TemplateComponent: React.ComponentType<any>;
  content: any;
  designToken: any;
  flowStep?: number;
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
  const hasReachedPreview = flowStep >= STEP_PREVIEW;
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    if (!hasReachedPreview || scrollMax <= 0) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasReachedPreview, scrollMax, scale]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        opacity: flowStep >= STEP_PREVIEW ? 1 : 0,
        transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
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
        style={{ background: "radial-gradient(ellipse at center, transparent 65%, rgba(12,12,14,0.45) 100%)" }}
      />
    </div>
  );
}

/* ── LiveAdaptiveSkeleton: token-themed wireframe that evolves with the chat ── */
function LiveAdaptiveSkeleton({
  sample,
  token,
  flowStep,
  baseWidth = 1280,
  visible,
}: {
  sample: ShowcaseItem;
  token: DesignToken;
  flowStep: number;
  baseWidth?: number;
  visible: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.22);

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

  const cssVars = useMemo(() => buildCssVars(token), [token]);
  const prefill = TEMPLATE_PREFILL_MAP[sample.templateId];
  const subtype = prefill?.businessSubType || prefill?.businessType || sample.businessType;
  const showName  = flowStep >= STEP_NAME;
  const showType  = flowStep >= STEP_PICK_TYPE;
  const showMood  = flowStep >= STEP_PICK_MOOD;
  const highlight = flowStep >= STEP_GENERATING;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div
        style={{
          ...cssVars,
          width: baseWidth,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          background: "var(--dt-bg)",
          color: "var(--dt-text)",
          fontFamily: "var(--dt-body-font)",
          pointerEvents: "none",
          userSelect: "none",
          minHeight: 3400,
        }}
      >
        {/* Ambient glow blob using token primary */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 480, height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in srgb,var(--dt-primary) 18%,transparent) 0%, transparent 70%)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }} />

        <div style={{ padding: "40px 48px", display: "flex", flexDirection: "column", gap: 36, position: "relative", zIndex: 1 }}>

          {/* ── Navbar ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 28, borderBottom: "1px solid color-mix(in srgb,var(--dt-text) 8%,transparent)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Logo icon */}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--dt-primary)", opacity: 0.9, flexShrink: 0 }} />
              {showName ? (
                <div style={{
                  fontSize: 15, fontWeight: 800, color: "var(--dt-text)",
                  fontFamily: "var(--dt-heading-font)", letterSpacing: "-0.3px"
                }}>{sample.businessName}</div>
              ) : (
                <div style={{ height: 18, width: 120, borderRadius: 6, background: "color-mix(in srgb,var(--dt-text) 12%,transparent)",
                  animation: "pulse 2s infinite" }} />
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {showType ? (
                ["Beranda", "Produk", "Galeri", "Kontak"].map((l) => (
                  <span key={l} style={{ fontSize: 12, color: "var(--dt-text-muted)", fontWeight: 600 }}>{l}</span>
                ))
              ) : (
                [80, 60, 50, 60].map((w, i) => (
                  <div key={i} style={{ height: 12, width: w, borderRadius: 4, background: "color-mix(in srgb,var(--dt-text) 8%,transparent)",
                    animation: "pulse 2s infinite" }} />
                ))
              )}
              <div style={{
                height: 34, padding: "0 18px", borderRadius: 8,
                background: highlight ? "var(--dt-primary)" : "color-mix(in srgb,var(--dt-primary) 18%,transparent)",
                border: "1px solid color-mix(in srgb,var(--dt-primary) 40%,transparent)",
                display: "flex", alignItems: "center",
                fontSize: 11, fontWeight: 700,
                color: highlight ? "var(--dt-primary-foreground)" : "var(--dt-primary)",
                transition: "all 0.5s",
              }}>{showType ? "Hubungi Kami" : ""}</div>
            </div>
          </div>

          {/* ── Hero section ── */}
          <div style={{
            borderRadius: 24,
            border: highlight
              ? "1px solid color-mix(in srgb,var(--dt-primary) 40%,transparent)"
              : "1px solid color-mix(in srgb,var(--dt-text) 8%,transparent)",
            background: "color-mix(in srgb,var(--dt-text) 4%,transparent)",
            padding: "52px 48px",
            position: "relative",
            overflow: "hidden",
            boxShadow: highlight ? "0 0 40px color-mix(in srgb,var(--dt-primary) 10%,transparent)" : "none",
            transition: "border-color 0.6s, box-shadow 0.6s",
          }}>
            {/* right image placeholder */}
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: "38%",
              background: "color-mix(in srgb,var(--dt-text) 5%,transparent)",
            }} />

            <div style={{ maxWidth: "55%", display: "flex", flexDirection: "column", gap: 20, position: "relative", zIndex: 1 }}>
              {/* Category badge */}
              {showType ? (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 99,
                  background: "color-mix(in srgb,var(--dt-primary) 14%,transparent)",
                  border: "1px solid color-mix(in srgb,var(--dt-primary) 28%,transparent)",
                  color: "var(--dt-primary)",
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2,
                  width: "fit-content"
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--dt-primary)" }} />
                  {subtype}
                </div>
              ) : (
                <div style={{ height: 22, width: 100, borderRadius: 99, background: "color-mix(in srgb,var(--dt-text) 10%,transparent)",
                  animation: "pulse 2s infinite" }} />
              )}

              {/* Headline */}
              {showName ? (
                <div style={{
                  fontSize: 38, fontWeight: 900, lineHeight: 1.12,
                  color: "var(--dt-text)", fontFamily: "var(--dt-heading-font)",
                  letterSpacing: "-0.5px"
                }}>{sample.businessName}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ height: 40, width: "85%", borderRadius: 10, background: "color-mix(in srgb,var(--dt-text) 12%,transparent)",
                    animation: "pulse 2s infinite" }} />
                  <div style={{ height: 40, width: "60%", borderRadius: 10, background: "color-mix(in srgb,var(--dt-text) 8%,transparent)",
                    animation: "pulse 2s infinite" }} />
                </div>
              )}

              {/* Description */}
              {showMood ? (
                <div style={{ fontSize: 13, color: "var(--dt-text-muted)", lineHeight: 1.65, maxWidth: 420 }}>
                  {sample.description || "Bisnis Anda hadir dengan tampilan profesional, desain menarik, dan informasi lengkap untuk pelanggan."}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ height: 13, width: "90%", borderRadius: 4, background: "color-mix(in srgb,var(--dt-text) 7%,transparent)",
                    animation: "pulse 2s infinite" }} />
                  <div style={{ height: 13, width: "70%", borderRadius: 4, background: "color-mix(in srgb,var(--dt-text) 5%,transparent)",
                    animation: "pulse 2s infinite" }} />
                </div>
              )}

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
                <div style={{
                  height: 44, padding: "0 24px", borderRadius: 10,
                  background: highlight ? "var(--dt-primary)" : "color-mix(in srgb,var(--dt-primary) 20%,transparent)",
                  border: `1px solid color-mix(in srgb,var(--dt-primary) ${highlight ? 100 : 30}%,transparent)`,
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, fontWeight: 700,
                  color: highlight ? "var(--dt-primary-foreground)" : "var(--dt-primary)",
                  transition: "all 0.5s",
                }}>
                  {highlight ? "Hubungi via WhatsApp →" : ""}
                </div>
                <div style={{
                  height: 44, padding: "0 20px", borderRadius: 10,
                  background: "color-mix(in srgb,var(--dt-text) 5%,transparent)",
                  border: "1px solid color-mix(in srgb,var(--dt-text) 8%,transparent)",
                  display: "flex", alignItems: "center",
                  fontSize: 12, fontWeight: 600,
                  color: "var(--dt-text-muted)",
                }}>{showType ? "Lihat Produk" : ""}</div>
              </div>
            </div>
          </div>

          {/* ── Stats / Trust highlights ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                borderRadius: 14,
                border: "1px solid color-mix(in srgb,var(--dt-text) 6%,transparent)",
                background: "color-mix(in srgb,var(--dt-text) 2.5%,transparent)",
                padding: "16px 20px",
                display: "flex", flexDirection: "column", gap: 6,
              }}>
                <div style={{ height: 18, width: "55%", borderRadius: 4, background: "color-mix(in srgb,var(--dt-primary) 35%,transparent)", animation: "pulse 2s infinite" }} />
                <div style={{ height: 11, width: "75%", borderRadius: 3, background: "color-mix(in srgb,var(--dt-text) 8%,transparent)", animation: "pulse 2s infinite" }} />
              </div>
            ))}
          </div>

          {/* ── Feature cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                borderRadius: 16,
                border: "1px solid color-mix(in srgb,var(--dt-text) 8%,transparent)",
                background: "color-mix(in srgb,var(--dt-text) 3%,transparent)",
                padding: 24, display: "flex", flexDirection: "column", gap: 14,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10,
                  background: `color-mix(in srgb,var(--dt-primary) ${18 - i * 4}%,transparent)`,
                  border: "1px solid color-mix(in srgb,var(--dt-primary) 22%,transparent)",
                }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ height: 14, width: showType ? "75%" : "70%",
                    borderRadius: 4, background: showType
                      ? "color-mix(in srgb,var(--dt-text) 16%,transparent)"
                      : "color-mix(in srgb,var(--dt-text) 10%,transparent)",
                    animation: "pulse 2s infinite"
                  }} />
                  <div style={{ height: 11, width: "90%", borderRadius: 4,
                    background: "color-mix(in srgb,var(--dt-text) 6%,transparent)",
                    animation: "pulse 2s infinite"
                  }} />
                  <div style={{ height: 11, width: "65%", borderRadius: 4,
                    background: "color-mix(in srgb,var(--dt-text) 4%,transparent)",
                    animation: "pulse 2s infinite"
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Product/catalog grid ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ height: 18, width: showType ? 200 : 160,
                borderRadius: 6, fontWeight: 800,
                background: showType
                  ? "color-mix(in srgb,var(--dt-text) 16%,transparent)"
                  : "color-mix(in srgb,var(--dt-text) 8%,transparent)",
                animation: "pulse 2s infinite",
              }} />
              <div style={{ height: 12, width: 80, borderRadius: 4,
                background: "color-mix(in srgb,var(--dt-text) 6%,transparent)",
                animation: "pulse 2s infinite"
              }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{
                  borderRadius: 14,
                  border: "1px solid color-mix(in srgb,var(--dt-text) 7%,transparent)",
                  background: "color-mix(in srgb,var(--dt-text) 3%,transparent)",
                  padding: 14,
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  <div style={{
                    height: 110, borderRadius: 10,
                    background: `color-mix(in srgb,var(--dt-primary) ${10 - i * 1.5}%,color-mix(in srgb,var(--dt-text) 6%,transparent))`,
                    animation: "pulse 2s infinite",
                  }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ height: 12, width: "75%", borderRadius: 4,
                      background: "color-mix(in srgb,var(--dt-text) 10%,transparent)",
                      animation: "pulse 2s infinite" }} />
                    <div style={{ height: 10, width: "50%", borderRadius: 4,
                      background: "color-mix(in srgb,var(--dt-primary) 22%,transparent)",
                      animation: "pulse 2s infinite" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Visual Gallery / Showcase ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ height: 18, width: 170, borderRadius: 6,
              background: "color-mix(in srgb,var(--dt-text) 12%,transparent)",
              animation: "pulse 2s infinite",
            }} />
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 16 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  height: 150,
                  borderRadius: 16,
                  border: "1px solid color-mix(in srgb,var(--dt-text) 6%,transparent)",
                  background: `color-mix(in srgb,var(--dt-primary) ${8 + i * 2}%,color-mix(in srgb,var(--dt-text) 4%,transparent))`,
                  animation: "pulse 2s infinite",
                }} />
              ))}
            </div>
          </div>

          {/* ── Testimonial section ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ height: 20, width: 220, borderRadius: 6,
              background: "color-mix(in srgb,var(--dt-text) 10%,transparent)",
              animation: "pulse 2s infinite",
            }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  borderRadius: 14,
                  border: "1px solid color-mix(in srgb,var(--dt-text) 7%,transparent)",
                  background: "color-mix(in srgb,var(--dt-text) 3%,transparent)",
                  padding: 20,
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  {/* Stars */}
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0,1,2,3,4].map((s) => (
                      <div key={s} style={{ width: 12, height: 12, borderRadius: 2,
                        background: `color-mix(in srgb,var(--dt-primary) ${70 - s * 5}%,transparent)`,
                      }} />
                    ))}
                  </div>
                  {/* Review text lines */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ height: 11, width: "95%", borderRadius: 3,
                      background: "color-mix(in srgb,var(--dt-text) 8%,transparent)",
                      animation: "pulse 2s infinite" }} />
                    <div style={{ height: 11, width: "80%", borderRadius: 3,
                      background: "color-mix(in srgb,var(--dt-text) 6%,transparent)",
                      animation: "pulse 2s infinite" }} />
                    <div style={{ height: 11, width: "60%", borderRadius: 3,
                      background: "color-mix(in srgb,var(--dt-text) 5%,transparent)",
                      animation: "pulse 2s infinite" }} />
                  </div>
                  {/* Avatar row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 4 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%",
                      background: `color-mix(in srgb,var(--dt-primary) ${14 - i * 3}%,color-mix(in srgb,var(--dt-text) 10%,transparent))`,
                    }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ height: 10, width: 70, borderRadius: 3,
                        background: "color-mix(in srgb,var(--dt-text) 12%,transparent)",
                        animation: "pulse 2s infinite" }} />
                      <div style={{ height: 8, width: 50, borderRadius: 3,
                        background: "color-mix(in srgb,var(--dt-text) 6%,transparent)",
                        animation: "pulse 2s infinite" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Contact & Location Card ── */}
          <div style={{
            borderRadius: 20,
            border: "1px solid color-mix(in srgb,var(--dt-text) 8%,transparent)",
            background: "color-mix(in srgb,var(--dt-text) 3%,transparent)",
            padding: "32px 40px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 28,
            alignItems: "center",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ height: 20, width: 180, borderRadius: 5, background: "color-mix(in srgb,var(--dt-text) 14%,transparent)", animation: "pulse 2s infinite" }} />
              <div style={{ height: 12, width: 240, borderRadius: 4, background: "color-mix(in srgb,var(--dt-text) 7%,transparent)", animation: "pulse 2s infinite" }} />
              <div style={{ height: 12, width: 200, borderRadius: 4, background: "color-mix(in srgb,var(--dt-text) 6%,transparent)", animation: "pulse 2s infinite" }} />
            </div>
            <div style={{
              height: 120,
              borderRadius: 14,
              background: "color-mix(in srgb,var(--dt-text) 6%,transparent)",
              border: "1px solid color-mix(in srgb,var(--dt-text) 8%,transparent)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ height: 12, width: 120, borderRadius: 4, background: "color-mix(in srgb,var(--dt-text) 12%,transparent)" }} />
            </div>
          </div>

          {/* ── CTA Banner ── */}
          <div style={{
            borderRadius: 20,
            background: `linear-gradient(135deg, color-mix(in srgb,var(--dt-primary) 14%,transparent), color-mix(in srgb,var(--dt-primary) 6%,transparent))`,
            border: "1px solid color-mix(in srgb,var(--dt-primary) 22%,transparent)",
            padding: "36px 48px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ height: 22, width: 280, borderRadius: 6,
                background: "color-mix(in srgb,var(--dt-text) 16%,transparent)",
                animation: "pulse 2s infinite" }} />
              <div style={{ height: 14, width: 200, borderRadius: 4,
                background: "color-mix(in srgb,var(--dt-text) 8%,transparent)",
                animation: "pulse 2s infinite" }} />
            </div>
            <div style={{
              height: 44, padding: "0 28px", borderRadius: 10, flexShrink: 0,
              background: highlight ? "var(--dt-primary)" : "color-mix(in srgb,var(--dt-primary) 22%,transparent)",
              border: "1px solid color-mix(in srgb,var(--dt-primary) 35%,transparent)",
              display: "flex", alignItems: "center",
              fontSize: 12, fontWeight: 700,
              color: highlight ? "var(--dt-primary-foreground)" : "var(--dt-primary)",
              transition: "all 0.5s",
            }}>{showType ? "Mulai Sekarang" : ""}</div>
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: 32, borderTop: "1px solid color-mix(in srgb,var(--dt-text) 8%,transparent)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--dt-primary)", opacity: 0.8 }} />
              <div style={{ height: 12, width: 90, borderRadius: 4, background: "color-mix(in srgb,var(--dt-text) 10%,transparent)" }} />
            </div>
            <div style={{ height: 10, width: 160, borderRadius: 3, background: "color-mix(in srgb,var(--dt-text) 6%,transparent)" }} />
          </div>
        </div>
      </div>
      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(12,12,14,0.6) 100%)" }}
      />
    </div>
  );
}

/* ── MobileChatCard: Native mobile chat card matching screenshot design ── */
function MobileChatCard({ sample }: HeroItem) {
  const { t, translations } = useI18n();
  const flowStep = useFlowStep();
  const showcaseItem = sample;

  const visible = (minStep: number) =>
    flowStep >= minStep ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none";

  const MOOD_OPTIONS = [
    {
      id: "modern",
      name: "Modern & Clean",
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&auto=format&fit=crop&q=75",
    },
    {
      id: "minimal",
      name: "Minimal",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=75",
    },
    {
      id: "natural",
      name: "Natural",
      img: "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?w=300&auto=format&fit=crop&q=75",
    },
    {
      id: "elegant",
      name: "Elegant",
      img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=300&auto=format&fit=crop&q=75",
    },
  ];

  return (
    <div className="w-full max-w-[420px] mx-auto rounded-[2rem] border border-white/10 bg-[#0e0f14]/95 p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {/* ── Card Header ── */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white shadow-sm">
            <SparkleIcon className="size-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-tight">AI Chat</div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>
        <SparkleIcon className="size-4 text-white/40" />
      </div>

      {/* ── Chat Messages ── */}
      <div className="space-y-3">
        {/* Msg 1: Bot Greeting */}
        <div className={`flex items-start gap-2.5 transition-all duration-400 ${visible(STEP_GREET)}`}>
          <div className="size-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <SparkleIcon className="size-3.5 text-white" />
          </div>
          <div className="rounded-2xl rounded-tl-xs bg-white/[0.06] border border-white/5 px-3.5 py-2.5 text-xs text-white/90 shadow-sm leading-relaxed">
            {t("landing.mockupGreeting")}
            {flowStep === STEP_GREET && (
              <span className="ml-1.5 inline-block w-1 h-3 bg-white animate-pulse rounded-xs" />
            )}
          </div>
        </div>

        {/* Msg 2: User Business Name */}
        <div className={`flex justify-end transition-all duration-400 ${visible(STEP_NAME)}`}>
          <div className="rounded-2xl rounded-br-xs bg-white text-black font-semibold px-4 py-2 text-xs shadow-md">
            {showcaseItem.businessName}
          </div>
        </div>

        {/* Msg 3: Bot Ask Type */}
        <div className={`flex items-start gap-2.5 transition-all duration-400 ${visible(STEP_ASK_TYPE)}`}>
          <div className="size-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <SparkleIcon className="size-3.5 text-white" />
          </div>
          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="rounded-2xl rounded-tl-xs bg-white/[0.06] border border-white/5 px-3.5 py-2.5 text-xs text-white/90 shadow-sm">
              {t("landing.mockupPickType")}
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5">
              <div className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                flowStep >= STEP_PICK_TYPE
                  ? "bg-white text-black shadow-md scale-[1.02]"
                  : "bg-white/5 border border-white/10 text-white/80"
              }`}>
                <span>☕</span>
                <span>{translations.landing.mockupChips[0] || "Food & Beverage"}</span>
              </div>
              <div className="rounded-full px-3.5 py-1.5 text-[11px] font-medium bg-white/5 border border-white/10 text-white/60 flex items-center gap-1.5">
                <span>🛠</span>
                <span>{translations.landing.mockupChips[1] || "Services"}</span>
              </div>
              <div className="rounded-full px-3.5 py-1.5 text-[11px] font-medium bg-white/5 border border-white/10 text-white/60 flex items-center gap-1.5">
                <span>🛍</span>
                <span>{translations.landing.mockupChips[2] || "Products"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Msg 4: Bot Ask Mood */}
        <div className={`flex items-start gap-2.5 transition-all duration-400 ${visible(STEP_ASK_MOOD)}`}>
          <div className="size-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <SparkleIcon className="size-3.5 text-white" />
          </div>
          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="rounded-2xl rounded-tl-xs bg-white/[0.06] border border-white/5 px-3.5 py-2.5 text-xs text-white/90 shadow-sm">
              {t("landing.mockupPickMood")}
            </div>

            {/* 4 Mood Cards Grid */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {MOOD_OPTIONS.map((mood, idx) => {
                const isSelected = idx === 0 && flowStep >= STEP_PICK_MOOD;
                return (
                  <div
                    key={mood.id}
                    className={`relative rounded-xl overflow-hidden border transition-all duration-300 flex flex-col justify-end aspect-[3/4] p-1.5 ${
                      isSelected
                        ? "border-white ring-2 ring-white/20 shadow-lg"
                        : "border-white/10 opacity-70"
                    }`}
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 100%), url(${mood.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                    <span className="text-[9px] font-bold text-white text-center leading-tight">
                      {mood.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className="mt-4 pt-2 flex items-center justify-between rounded-full bg-white/[0.04] border border-white/10 p-1.5 pl-4">
        <span className="text-xs text-white/40 font-normal">
          {translations.landing.typeMessage || "Type your message..."}
        </span>
        <div className="size-8 rounded-full bg-white text-black flex items-center justify-center shadow-md cursor-pointer hover:bg-slate-200 transition">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="translate-x-0.5">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
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

  const { sample, token } = useBestHero();
  const showcaseItem = sample;
  const TemplateComponent = TEMPLATE_REGISTRY.find((t) => t.id === showcaseItem.templateId)?.component;

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
    flowStep >= STEP_PREVIEW ? `translateZ(${z}px)` : "translateZ(0px)";

  const generating = flowStep === STEP_GENERATING;

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
              <div className={`flex gap-2 items-end transition-all duration-500 ${visible(STEP_GREET)}`}>
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg text-primary-foreground">
                  <SparkleIcon className="w-[18px] h-[18px]" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-card/70 border border-border/50 px-3.5 py-2.5 text-xs text-foreground max-w-[80%] shadow-md backdrop-blur-sm">
                  {t("landing.mockupGreeting")}
                  {flowStep === STEP_GREET && <span className="ml-1 inline-block w-1 h-3 bg-primary animate-pulse rounded-sm" />}
                </div>
              </div>

              <div className={`flex justify-end transition-all duration-500 ${visible(STEP_NAME)}`}>
                <div className="rounded-2xl rounded-br-sm px-3.5 py-2.5 text-xs max-w-[75%] shadow-md font-medium"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#ffffff",
                    boxShadow: "0 4px 16px rgba(99,102,241,0.35)"
                  }}
                >
                  {showcaseItem.businessName}
                </div>
              </div>

              {/* AI asks type */}
              <div className={`flex gap-2 items-end transition-all duration-500 ${visible(STEP_ASK_TYPE)}`}>
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg text-primary-foreground">
                  <SparkleIcon className="w-[18px] h-[18px]" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-card/70 border border-border/50 px-3.5 py-2.5 text-xs text-foreground max-w-[80%] shadow-md backdrop-blur-sm">
                  {t("landing.mockupPickType")}
                </div>
              </div>

              {/* Category chips */}
              <div className={`flex flex-wrap gap-1.5 ml-9 transition-all duration-500 ${visible(STEP_ASK_TYPE)}`}>
                {translations.landing.mockupChips.map((chip, i) => {
                  const sel = i === 0 && flowStep >= STEP_PICK_TYPE;
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

              {/* AI asks mood */}
              <div className={`flex gap-2 items-end transition-all duration-500 ${visible(STEP_ASK_MOOD)}`}>
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg text-primary-foreground">
                  <SparkleIcon className="w-[18px] h-[18px]" />
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-card/70 border border-border/50 px-3.5 py-2.5 text-xs text-foreground max-w-[80%] shadow-md backdrop-blur-sm">
                  {t("landing.mockupPickMood")}
                </div>
              </div>

              {/* Mood chips */}
              <div className={`flex flex-wrap gap-1.5 ml-9 transition-all duration-500 ${visible(STEP_ASK_MOOD)}`}>
                {translations.landing.mockupMoodChips.map((chip, i) => {
                  const sel = i === 0 && flowStep >= STEP_PICK_MOOD;
                  return (
                    <div key={chip} className={`rounded-full px-3 py-1 text-[10px] font-semibold border transition-all duration-400 ${
                      sel
                        ? "scale-105"
                        : "bg-card/60 border-border/40 text-muted-foreground"
                    }`}
                      style={sel ? {
                        background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                        borderColor: "rgba(139,92,246,0.5)",
                        color: "#ffffff",
                        boxShadow: "0 4px 14px rgba(139,92,246,0.3)"
                      } : {}}
                    >{chip}</div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className={`ml-9 transition-all duration-500 ${visible(STEP_PICK_MOOD)}`}>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden w-36 shadow-inner">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: generating ? "85%" : flowStep >= STEP_PREVIEW ? "100%" : "30%",
                      background: "linear-gradient(90deg, var(--primary), color-mix(in srgb,var(--primary) 60%,white))",
                      boxShadow: "0 0 8px color-mix(in srgb,var(--primary) 50%,transparent)",
                      transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground font-medium">
                  {generating ? t("landing.mockupGenerating") : flowStep >= STEP_PREVIEW ? t("landing.mockupReady") : t("landing.mockupStep")}
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
              {/* Skeleton — visible during AI chat (steps 0-7) */}
              <LiveAdaptiveSkeleton
                sample={showcaseItem}
                token={token}
                flowStep={flowStep}
                visible={flowStep < STEP_PREVIEW}
              />

              {/* Real website preview — crossfades in at step 8 */}
              {TemplateComponent && (
                <RealPreviewPanel
                  TemplateComponent={TemplateComponent}
                  content={showcaseItem.content}
                  designToken={token}
                  flowStep={flowStep}
                />
              )}

              {/* Scan line on generating */}
              {generating && (
                <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent"
                    style={{ animation: "scan 1.2s linear infinite" }}
                  />
                </div>
              )}

              {/* Generating loading card (mirrors the wizard's LoadingCard) */}
              {generating && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <div className="rounded-xl border border-white/15 bg-black/75 px-4 py-3 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <SparkleIcon className="h-3.5 w-3.5 animate-pulse text-primary" />
                      <span className="text-[11px] font-semibold text-white">⚡ AI sedang generate...</span>
                    </div>
                    <div className="mt-2.5 space-y-1.5">
                      {[100, 78, 56].map((w, i) => (
                        <div
                          key={i}
                          className="h-1 animate-pulse rounded-full bg-white/20"
                          style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Live Preview pill badge before full publish */}
              <div
                className="absolute top-3 right-3 z-30 transition-all duration-500"
                style={{
                  opacity: flowStep < STEP_PREVIEW ? 1 : 0,
                  pointerEvents: "none",
                }}
              >
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/15 rounded-full px-2.5 py-1 text-[9px] font-mono text-white/80 shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Interactive Preview
                </div>
              </div>

              {/* Domain pill — floats above real preview */}
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 z-30 transition-all duration-500"
                style={{
                  opacity: flowStep >= STEP_PREVIEW ? 1 : 0,
                  transform: flowStep >= STEP_PREVIEW ? `translateX(-50%) ${tz(30)}` : "translateX(-50%) translateY(-4px)",
                  transition: "opacity 0.5s, transform 0.6s cubic-bezier(0.34,1.3,0.64,1)",
                }}
              >
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/15 rounded-full px-3 py-1 text-[10px] font-mono text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {domainSlug(showcaseItem.businessName)}.webjoz.com
                </div>
              </div>

              {/* ── Success bar ────────────────────────────────── */}
              <div
                className="absolute bottom-3 left-3 right-3 h-9 rounded-xl flex items-center px-3.5 z-30"
                style={{
                  transform: flowStep >= STEP_SUCCESS ? tz(22) : "translateZ(0px) translateY(4px)",
                  opacity: flowStep >= STEP_SUCCESS ? 1 : 0,
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

      {/* scan keyframes */}
      <style>{`
        @keyframes scan {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
      `}</style>
      </div>

      {/* ── Mobile: sleek native chat card (desktop uses 3D browser mockup above) ───── */}
      <div className="md:hidden w-full flex justify-center">
        <MobileChatCard sample={sample} token={token} />
      </div>
    </>
  );
}
