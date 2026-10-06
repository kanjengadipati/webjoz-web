"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
   Overview hero — inverted plate with an abstract geometric silhouette.

   The plate is deliberately anti-themed relative to the dashboard canvas:
   dark mode renders a black plate with a white silhouette, light mode a white
   plate with a black silhouette. Both come from the --hero-* tokens in
   globals.css, which are intentionally NOT part of .theme-blue, so the hero
   stays monochrome in both accents.

   Everything inside the plate must use hero tokens (hero-ink / hero-ink-muted /
   hero-line / hero-veil) instead of the normal theme tokens, otherwise the
   copy would follow the page theme and drop out of contrast.
   ────────────────────────────────────────────────────────────────────────── */

const HATCH_LINES = Array.from({ length: 10 }, (_, i) => 700 + i * 28);

function HeroSilhouette() {
  /* SVG ids must be unique per instance, and React's useId output contains
     colons, which are not valid inside a url(#...) fragment. */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const glowId = `hero-glow-${uid}`;
  const fadeId = `hero-fade-${uid}`;
  const fadeMaskId = `hero-fade-mask-${uid}`;
  const waveId = `hero-wave-${uid}`;
  const dotsId = `hero-dots-${uid}`;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 size-full select-none"
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--hero-ink)" stopOpacity="0.2" />
          <stop offset="52%" stopColor="var(--hero-ink)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="var(--hero-ink)" stopOpacity="0" />
        </radialGradient>
        {/* Mask keeps the silhouette off the copy on the left and lets it bleed
            out past the right edge instead of stopping at a hard border. */}
        <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0.45">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="30%" stopColor="#3d3d3d" />
          <stop offset="60%" stopColor="#e6e6e6" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={waveId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--hero-ink)" stopOpacity="0" />
          <stop offset="42%" stopColor="var(--hero-ink)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--hero-ink)" stopOpacity="0.75" />
        </linearGradient>
        <pattern id={dotsId} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.6" fill="var(--hero-ink)" fillOpacity="0.3" />
        </pattern>
        <mask id={fadeMaskId}>
          <rect width="1200" height="420" fill={`url(#${fadeId})`} />
        </mask>
      </defs>

      <g mask={`url(#${fadeMaskId})`}>
        <ellipse cx="960" cy="205" rx="440" ry="340" fill={`url(#${glowId})`} />

        <rect x="520" y="0" width="680" height="420" fill={`url(#${dotsId})`} opacity="0.5" />

        <g stroke="var(--hero-ink)" strokeOpacity="0.1" strokeWidth="1.25">
          {HATCH_LINES.map((x) => (
            <path key={x} d={`M${x} 0 L${x - 62} 104`} />
          ))}
        </g>

        <g fill="none" stroke={`url(#${waveId})`} strokeWidth="1.25">
          <path d="M540 268 C700 188 860 348 1060 228" />
          <path d="M540 312 C700 232 860 392 1060 272" />
          <path d="M540 356 C700 276 860 436 1060 316" />
        </g>

        <circle cx="940" cy="205" r="200" fill="none" stroke="var(--hero-ink)" strokeOpacity="0.15" strokeWidth="1" />
        <circle cx="940" cy="205" r="148" fill="none" stroke="var(--hero-ink)" strokeOpacity="0.12" strokeWidth="1" />
        <circle cx="940" cy="205" r="96" fill="none" stroke="var(--hero-ink)" strokeOpacity="0.1" strokeWidth="1" />
        <circle cx="940" cy="205" r="42" fill="var(--hero-ink)" fillOpacity="0.12" />

        {/* Boldest shape: a half-disc anchored past the right edge. */}
        <path d="M1200 54 A150 150 0 0 0 1200 354 Z" fill="var(--hero-ink)" fillOpacity="0.1" />

        <rect x="806" y="330" width="22" height="22" rx="7" fill="var(--hero-ink)" fillOpacity="0.2" />
        <rect x="1128" y="30" width="24" height="24" rx="8" fill="var(--hero-ink)" fillOpacity="0.16" transform="rotate(45 1140 42)" />
        <circle cx="1128" cy="352" r="9" fill="var(--hero-ink)" fillOpacity="0.24" />
      </g>
    </svg>
  );
}

export function OverviewHero({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={cn(
        "relative isolate min-w-0 overflow-hidden rounded-3xl border border-hero-line bg-hero-surface",
        "shadow-[0_18px_50px_-30px_var(--hero-shadow)]",
        className,
      )}
    >
      <HeroSilhouette />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hero-line to-transparent"
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function HeroIconBadge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl bg-hero-ink text-hero-surface",
        "shadow-[0_10px_26px_-14px_var(--hero-shadow)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HeroTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h2 className={cn("font-extrabold tracking-tight text-hero-ink", className)}>{children}</h2>;
}

export function HeroDescription({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("leading-relaxed text-hero-ink-muted", className)}>{children}</p>;
}

export function HeroStatusPill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-hero-line bg-hero-veil",
        "px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-hero-ink",
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-hero-ink" />
      {children}
    </span>
  );
}

/** Primary CTA — the plate colour flipped back, so it always reads as the
 *  highest-contrast control sitting on the hero. */
export function HeroSolidButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-hero-ink px-4 py-2.5",
        "text-xs font-bold text-hero-surface whitespace-nowrap cursor-pointer",
        "shadow-[0_10px_24px_-14px_var(--hero-shadow)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:w-auto",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Secondary CTA — translucent ink over the plate. */
export function HeroGhostButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-hero-line bg-hero-veil px-3.5 py-2.5",
        "text-xs font-bold text-hero-ink cursor-pointer transition-all duration-200",
        "hover:-translate-y-0.5 hover:bg-hero-veil-strong hover:shadow-md active:translate-y-0 sm:w-auto",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function HeroButtonGlyph({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md bg-hero-veil-strong text-hero-ink font-extrabold",
        className,
      )}
    >
      {children}
    </span>
  );
}
