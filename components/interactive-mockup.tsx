"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";

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

export function InteractiveMockup() {
  const { t, translations } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [flowStep, setFlowStep] = useState(0);

  /* ── 3D Tilt ──────────────────────────────────────────────────────────── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const maxR = 10;
    setRotate({ x: -(y / (box.height / 2)) * maxR, y: (x / (box.width / 2)) * maxR });
  };

  /* ── Flow sequence ────────────────────────────────────────────────────── */
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

  /* ── helpers ──────────────────────────────────────────────────────────── */
  const visible = (minStep: number) =>
    flowStep >= minStep ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none";

  const tz = (z: number) =>
    flowStep >= 6 ? `translateZ(${z}px)` : "translateZ(0px)";

  const generating = flowStep === 5;

  return (
    <div
      className="w-full"
      style={{ perspective: "1100px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setRotate({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
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
            className="grid min-h-[320px] gap-0 md:grid-cols-[1fr_1.1fr] overflow-hidden rounded-b-[1.8rem]"
            style={{ transformStyle: "preserve-3d" }}
          >

            {/* ── Left: Chat panel ──────────────────────────────────────── */}
            <div className="flex flex-col gap-3 p-5 border-r border-border/20 bg-background/20">
              
              {/* AI avatar row */}
              <div className={`flex gap-2 items-end transition-all duration-500 ${visible(1)}`}>
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-sm shrink-0 shadow-lg"
                  style={{ background: "linear-gradient(135deg, color-mix(in srgb,var(--primary) 60%,transparent), color-mix(in srgb,var(--primary) 20%,transparent))", border: "1px solid color-mix(in srgb,var(--primary) 30%,transparent)" }}
                >✨</div>
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
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-sm shrink-0 shadow-lg"
                  style={{ background: "linear-gradient(135deg, color-mix(in srgb,var(--primary) 60%,transparent), color-mix(in srgb,var(--primary) 20%,transparent))", border: "1px solid color-mix(in srgb,var(--primary) 30%,transparent)" }}
                >✨</div>
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
              className="relative hidden md:block overflow-hidden"
              style={{
                background: "linear-gradient(160deg, color-mix(in srgb,var(--primary) 4%,transparent) 0%, transparent 50%, color-mix(in srgb,var(--primary) 2%,transparent) 100%)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Ambient grid overlay */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
              />

              {/* Scan line on generating */}
              {generating && (
                <div className="absolute inset-x-0 top-0 z-10 pointer-events-none">
                  <div className="h-px w-full animate-[scan_1.2s_linear_infinite] bg-gradient-to-r from-transparent via-primary/70 to-transparent"
                    style={{ animation: "scan 1.2s linear infinite" }}
                  />
                </div>
              )}

              {/* Floating particle dots */}
              {[
                { top: "12%", left: "15%", size: 4, opacity: 0.4 },
                { top: "28%", right: "12%", size: 3, opacity: 0.3 },
                { top: "55%", left: "22%", size: 5, opacity: 0.25 },
                { top: "70%", right: "18%", size: 3, opacity: 0.35 },
              ].map((p, i) => (
                <div key={i}
                  className={`absolute rounded-full transition-all duration-700 ${flowStep >= 6 ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                  style={{
                    width: p.size, height: p.size,
                    top: p.top, left: p.left, right: (p as any).right,
                    background: "var(--primary)",
                    opacity: flowStep >= 6 ? p.opacity : 0,
                    boxShadow: `0 0 ${p.size * 3}px color-mix(in srgb,var(--primary) 60%,transparent)`,
                    transitionDelay: `${i * 150}ms`,
                  }}
                />
              ))}

              {/* ── Navbar layer ─────────────────────────────── */}
              <div
                className={`absolute left-3 top-3 right-3 h-7 rounded-xl border transition-all duration-600 ${flowStep >= 5 ? "opacity-100" : "opacity-0"}`}
                style={{
                  transform: tz(20),
                  transition: "transform 0.6s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.5s",
                  background: flowStep >= 6
                    ? "linear-gradient(90deg, color-mix(in srgb,var(--primary) 12%,transparent), color-mix(in srgb,var(--primary) 5%,transparent))"
                    : "color-mix(in srgb,var(--foreground) 4%,transparent)",
                  borderColor: flowStep >= 6 ? "color-mix(in srgb,var(--primary) 25%,transparent)" : "color-mix(in srgb,var(--border) 40%,transparent)",
                  boxShadow: flowStep >= 6 ? "0 4px 20px color-mix(in srgb,var(--primary) 10%,transparent)" : "none",
                }}
              >
                {/* nav dots */}
                {flowStep >= 6 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-1 rounded-full opacity-30" style={{ background: "var(--primary)" }} />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Hero title line ───────────────────────────── */}
              <div
                className={`absolute left-3 right-3 rounded-full transition-all duration-600 ${flowStep >= 5 ? "opacity-100" : "opacity-0"}`}
                style={{
                  top: "42px", height: "10px",
                  transform: tz(32),
                  transition: "transform 0.6s cubic-bezier(0.34, 1.3, 0.64, 1) 80ms, opacity 0.5s 80ms",
                  background: flowStep >= 6
                    ? "linear-gradient(90deg, color-mix(in srgb,var(--foreground) 30%,transparent), color-mix(in srgb,var(--foreground) 10%,transparent))"
                    : "color-mix(in srgb,var(--foreground) 10%,transparent)",
                  boxShadow: flowStep >= 6 ? "0 2px 12px rgba(0,0,0,0.15)" : "none",
                }}
              />

              {/* subtitle lines */}
              {[56, 70].map((top, i) => (
                <div key={top}
                  className={`absolute left-3 rounded-full transition-all duration-600 ${flowStep >= 5 ? "opacity-100" : "opacity-0"}`}
                  style={{
                    top, right: i === 0 ? "20px" : "40px", height: "7px",
                    transform: tz(18 - i * 4),
                    transition: `transform 0.6s cubic-bezier(0.34, 1.3, 0.64, 1) ${120 + i * 80}ms, opacity 0.5s ${120 + i * 80}ms`,
                    background: `color-mix(in srgb,var(--foreground) ${flowStep >= 6 ? 14 : 7}%,transparent)`,
                  }}
                />
              ))}

              {/* ── CTA Button ───────────────────────────────── */}
              <div
                className={`absolute left-3 rounded-xl transition-all duration-600 ${flowStep >= 6 ? "opacity-100" : "opacity-0"}`}
                style={{
                  top: "84px", width: "56px", height: "18px",
                  transform: tz(28),
                  transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 200ms, opacity 0.4s 200ms",
                  background: "linear-gradient(135deg, var(--primary), color-mix(in srgb,var(--primary) 70%,white))",
                  boxShadow: "0 4px 18px color-mix(in srgb,var(--primary) 35%,transparent)",
                }}
              />

              {/* ── Image hero placeholder ───────────────────── */}
              <div
                className={`absolute right-3 rounded-xl border transition-all duration-600 ${flowStep >= 5 ? "opacity-100" : "opacity-0"}`}
                style={{
                  top: "38px", left: "55%", bottom: "90px",
                  transform: tz(10),
                  transition: "transform 0.7s cubic-bezier(0.34, 1.3, 0.64, 1) 60ms, opacity 0.5s 60ms",
                  background: flowStep >= 6
                    ? "linear-gradient(145deg, color-mix(in srgb,var(--primary) 8%,transparent), color-mix(in srgb,var(--primary) 3%,transparent))"
                    : "color-mix(in srgb,var(--foreground) 4%,transparent)",
                  borderColor: flowStep >= 6 ? "color-mix(in srgb,var(--primary) 20%,transparent)" : "color-mix(in srgb,var(--border) 20%,transparent)",
                  boxShadow: flowStep >= 6 ? "0 12px 40px rgba(0,0,0,0.2), 0 0 0 1px color-mix(in srgb,var(--primary) 10%,transparent)" : "none",
                }}
              >
                {/* image pattern */}
                {flowStep >= 6 && (
                  <div className="absolute inset-3 rounded-lg opacity-20"
                    style={{ background: "repeating-linear-gradient(45deg, var(--primary) 0, var(--primary) 1px, transparent 0, transparent 50%)", backgroundSize: "6px 6px" }}
                  />
                )}
              </div>

              {/* ── Feature cards ────────────────────────────── */}
              <div
                className={`absolute left-3 right-3 grid grid-cols-2 gap-2 transition-all duration-600 ${flowStep >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
                style={{ bottom: "50px" }}
              >
                {[
                  { z: 40, delay: 0, accent: true },
                  { z: 16, delay: 100, accent: false },
                ].map(({ z, delay, accent }, i) => (
                  <div
                    key={i}
                    className="h-[52px] rounded-xl border transition-all duration-600"
                    style={{
                      transform: tz(z),
                      transition: `transform 0.65s cubic-bezier(0.34, 1.4, 0.64, 1) ${delay}ms, background 0.5s, border-color 0.5s, box-shadow 0.5s`,
                      background: flowStep >= 6
                        ? accent
                          ? "linear-gradient(135deg, color-mix(in srgb,var(--primary) 18%,transparent), color-mix(in srgb,var(--primary) 8%,transparent))"
                          : "color-mix(in srgb,var(--foreground) 5%,transparent)"
                        : "color-mix(in srgb,var(--foreground) 3%,transparent)",
                      borderColor: flowStep >= 6
                        ? accent ? "color-mix(in srgb,var(--primary) 35%,transparent)" : "color-mix(in srgb,var(--border) 30%,transparent)"
                        : "color-mix(in srgb,var(--border) 15%,transparent)",
                      boxShadow: flowStep >= 6 && accent
                        ? "0 12px 36px color-mix(in srgb,var(--primary) 18%,transparent), 0 2px 8px rgba(0,0,0,0.15)"
                        : flowStep >= 6 ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
                    }}
                  >
                    {/* card inner lines */}
                    {flowStep >= 6 && (
                      <div className="p-2.5 flex flex-col gap-1.5">
                        <div className="h-1.5 rounded-full w-3/4 opacity-30" style={{ background: accent ? "var(--primary)" : "var(--foreground)" }} />
                        <div className="h-1 rounded-full w-1/2 opacity-20" style={{ background: accent ? "var(--primary)" : "var(--foreground)" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ── Success bar ────────────────────────────────── */}
              <div
                className={`absolute bottom-3 left-3 right-3 h-9 rounded-xl flex items-center px-3.5 transition-all duration-600`}
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

      {/* scan keyframe */}
      <style>{`
        @keyframes scan {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
