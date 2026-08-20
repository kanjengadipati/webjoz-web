"use client";

import React from "react";

interface AudioWaveformProps {
  isRecording: boolean;
}

export function AudioWaveform({ isRecording }: AudioWaveformProps) {
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
      {bars.map((bar, index) => (
        <span
          key={index}
          className={`w-[3px] rounded-full bg-emerald-400/90 transition-all duration-300 ${
            isRecording ? "animate-pulse" : "opacity-30"
          } ${bar.height}`}
          style={{
            animationDuration: isRecording ? `${600 + (index % 5) * 150}ms` : "0ms",
            animationDelay: bar.delay,
            transform: isRecording ? undefined : "scaleY(0.4)",
          }}
        />
      ))}
    </div>
  );
}
