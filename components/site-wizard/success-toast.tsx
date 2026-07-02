"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { ArrowRight, Pencil, X } from "lucide-react";

// ─── Confetti ──────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  size: number;
  color: string;
  shape: "rect" | "circle";
  opacity: number;
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#38bdf8",
  "#fb923c",
  "#e879f9",
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function useConfetti(
  active: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const spawnParticles = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { width } = container.getBoundingClientRect();
    const count = 110;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: randomBetween(width * 0.1, width * 0.9),
        y: randomBetween(-20, -5),
        vx: randomBetween(-3, 3),
        vy: randomBetween(3, 9),
        angle: randomBetween(0, Math.PI * 2),
        spin: randomBetween(-0.15, 0.15),
        size: randomBetween(7, 13),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.random() > 0.5 ? "rect" : "circle",
        opacity: 1,
      });
    }
    particlesRef.current = particles;
  }, [containerRef]);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of particlesRef.current) {
        if (p.opacity <= 0) continue;
        alive = true;

        p.vy += 0.18;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        if (p.y > height * 0.8) {
          p.opacity = Math.max(0, p.opacity - 0.025);
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size / 2, p.size / 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (alive) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const syncSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  }, [containerRef]);

  useEffect(() => {
    if (!active) return;

    syncSize();
    spawnParticles();
    startAnimation();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, syncSize, spawnParticles, startAnimation]);

  return canvasRef;
}

// ─── Toast ─────────────────────────────────────────────────────────────────

const AUTO_DISMISS_MS = 9000;

interface SuccessToastProps {
  open: boolean;
  onDismiss: () => void;
  onGoToEditor: () => void;
  /** ref of the preview container so confetti + toast are positioned inside it */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Extra bottom offset so the toast doesn't overlap a fixed action bar
   * (e.g. MobileActionBar on mobile = ~88px, desktop = 0)
   */
  bottomOffset?: number;
}

export function WizardSuccessToast({
  open,
  onDismiss,
  onGoToEditor,
  containerRef,
  bottomOffset = 0,
}: SuccessToastProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const dismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    cancelAnimationFrame(progressRafRef.current);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      onDismiss();
    }, 350);
  }, [exiting, onDismiss]);

  const startProgress = useCallback(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100);
      setProgress(pct);
      if (pct > 0) {
        progressRafRef.current = requestAnimationFrame(tick);
      }
    };
    progressRafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (open) {
      setProgress(100);
      setExiting(false);
      setVisible(true);
      startProgress();
      dismissTimerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    } else {
      setVisible(false);
      cancelAnimationFrame(progressRafRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    }
    return () => {
      cancelAnimationFrame(progressRafRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const canvasRef = useConfetti(open, containerRef);

  if (!visible && !open) return null;

  // Toast width: full-width with horizontal padding on small screens, fixed 300px on md+
  const toastBottom = 24 + bottomOffset; // px from bottom of the container

  return (
    <>
      {/* Confetti canvas — covers the whole preview container, pointer-events none */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[90]"
        aria-hidden
      />

      {/* Toast — horizontally centered on mobile, anchored right on desktop */}
      <div
        role="status"
        aria-live="polite"
        className="absolute left-4 right-4 z-[100] md:left-auto md:right-6 md:w-[300px]"
        style={{
          bottom: toastBottom,
          animation: exiting
            ? "toastSlideOut 0.35s cubic-bezier(0.4,0,1,1) forwards"
            : "toastSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards",
        }}
      >
        <style>{`
          @keyframes toastSlideIn {
            from { opacity: 0; transform: translateY(24px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0)    scale(1); }
          }
          @keyframes toastSlideOut {
            from { opacity: 1; transform: translateY(0)    scale(1); }
            to   { opacity: 0; transform: translateY(16px) scale(0.95); }
          }
        `}</style>

        <div
          className="relative overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          style={{
            background:
              "linear-gradient(145deg, rgba(17,20,30,0.97) 0%, rgba(10,12,18,0.97) 100%)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          {/* Auto-dismiss progress bar */}
          <div
            className="absolute top-0 left-0 h-[3px] rounded-full"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #34d399 100%)",
              transition: "none",
            }}
          />

          <div className="px-4 pt-5 pb-4">
            {/* Header row */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-lg select-none">
                🎉
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight">
                  Website Anda Telah Siap!
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  Konten, warna, atau tata letak bisa diubah kapan saja di
                  halaman Editor.
                </p>
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={dismiss}
                className="mt-0.5 shrink-0 rounded-lg p-1 text-slate-500 transition hover:bg-white/[0.07] hover:text-slate-300 active:scale-95"
                aria-label="Tutup notifikasi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => {
                dismiss();
                onGoToEditor();
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit &amp; Publikasikan
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
