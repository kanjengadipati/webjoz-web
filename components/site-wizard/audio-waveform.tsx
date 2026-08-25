"use client";

import React from "react";

interface AudioWaveformProps {
  isRecording: boolean;
  isConnecting?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
}

export function AudioWaveform({ isRecording, isConnecting, isSpeaking = true, audioLevel }: AudioWaveformProps) {
  // 24 animated bars with varying heights and staggered animation delays
  const bars = [
    { height: "h-2", delay: "0ms" },
    { height: "h-4", delay: "100ms" },
    { height: "h-6", delay: "200ms" },
    { height: "h-3", delay: "150ms" },
    { height: "h-7", delay: "250ms" },
    { height: "h-5", delay: "50ms" },
    { height: "h-8", delay: "300ms" },
    { height: "h-4", delay: "180ms" },
    { height: "h-7", delay: "220ms" },
    { height: "h-9", delay: "350ms" },
    { height: "h-5", delay: "120ms" },
    { height: "h-8", delay: "280ms" },
    { height: "h-6", delay: "80ms" },
    { height: "h-9", delay: "320ms" },
    { height: "h-5", delay: "140ms" },
    { height: "h-7", delay: "260ms" },
    { height: "h-4", delay: "190ms" },
    { height: "h-8", delay: "310ms" },
    { height: "h-5", delay: "90ms" },
    { height: "h-6", delay: "230ms" },
    { height: "h-3", delay: "160ms" },
    { height: "h-5", delay: "110ms" },
    { height: "h-4", delay: "210ms" },
    { height: "h-2", delay: "40ms" },
  ];

  return (
    <div className="flex items-center justify-center gap-[2.5px] h-9 px-2 overflow-hidden">
      {bars.map((bar, index) => {
        let barClass = "bg-emerald-400/20 opacity-30 h-1.5";
        let animDuration = "0ms";
        let transform: string | undefined = "scaleY(0.4)";

        if (isConnecting) {
          barClass = "bg-amber-400/60 animate-pulse h-2";
          animDuration = "1200ms";
          transform = undefined;
        } else if (isRecording) {
          if (isSpeaking) {
            // User is actively speaking: vibrant jumping bars with glow
            barClass = `bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)] animate-pulse ${bar.height}`;
            animDuration = `${400 + (index % 5) * 120}ms`;
            transform = undefined;
          } else {
            // User is silent/pausing: calm, settled low bars with subtle resting glow
            barClass = "bg-emerald-500/35 h-1.5 transition-all duration-300";
            animDuration = "0ms";
            transform = "scaleY(0.6)";
          }
        }

        return (
          <span
            key={index}
            className={`w-[3px] rounded-full transition-all duration-200 ${barClass}`}
            style={{
              animationDuration: animDuration,
              animationDelay: bar.delay,
              transform: transform,
            }}
          />
        );
      })}
    </div>
  );
}
