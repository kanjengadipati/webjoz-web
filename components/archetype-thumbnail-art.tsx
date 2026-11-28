"use client";

import React from "react";
import { archetypeGroup } from "@/lib/showcase-archetypes";

interface ArchetypeThumbnailArtProps {
  id: string;
  className?: string;
}

/**
 * Monochrome light editorial SVG background decoration for mini-site preview cards.
 * Supports both group keys ("kuliner_toko", etc.) and individual archetype IDs.
 */
export function ArchetypeThumbnailArt({ id, className = "w-full h-full" }: ArchetypeThumbnailArtProps) {
  const groupKey =
    id === "kuliner_toko" ||
    id === "jasa_reservasi" ||
    id === "kreatif_pro" ||
    id === "bisnis_institusi"
      ? id
      : archetypeGroup(id).key;

  return (
    <svg
      viewBox="0 0 200 140"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {renderGroupArt(groupKey)}
    </svg>
  );
}

function renderGroupArt(groupKey: string): React.ReactNode {
  switch (groupKey) {
    case "kuliner_toko":
      return <KulinerTokoArt />;
    case "jasa_reservasi":
      return <JasaReservasiArt />;
    case "kreatif_pro":
      return <KreatifProArt />;
    case "bisnis_institusi":
    default:
      return <BisnisInstitusiArt />;
  }
}

/* ── Kuliner & Toko: soft monochrome plate & organic botanical shadows ───── */
function KulinerTokoArt() {
  return (
    <>
      <defs>
        <radialGradient id="m-kt-plate" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4d8e0" />
          <stop offset="75%" stopColor="#b8bec9" />
          <stop offset="100%" stopColor="#9aa1ae" />
        </radialGradient>
      </defs>
      {/* Subtle architectural arc top-right */}
      <circle cx="170" cy="18" r="56" fill="#e5e8ee" opacity="0.8" />
      {/* Botanical leaf silhouette */}
      <path
        d="M178 44 C194 34 206 52 194 74 C186 88 172 86 168 70 C164 56 168 50 178 44 Z"
        fill="#cfd4de"
        opacity="0.7"
      />
      {/* Plate outer & inner rings bottom-right */}
      <circle cx="152" cy="126" r="46" fill="url(#m-kt-plate)" opacity="0.92" />
      <circle cx="152" cy="126" r="36" fill="#eceff4" opacity="0.6" />
      <circle cx="152" cy="126" r="24" fill="#9ea5b3" opacity="0.55" />
      <path
        d="M136 122 C144 112 162 114 166 124 C169 133 154 139 144 135 C136 132 132 127 136 122 Z"
        fill="#6e7582"
        opacity="0.55"
      />
    </>
  );
}

/* ── Jasa & Reservasi: calm monochrome lounge arch & sculptural chair form ─ */
function JasaReservasiArt() {
  return (
    <>
      <defs>
        <linearGradient id="m-jr-chair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9ced8" />
          <stop offset="100%" stopColor="#8d94a2" />
        </linearGradient>
      </defs>
      {/* Soft wall arch */}
      <path
        d="M118 140 L118 76 C118 46 142 26 168 26 C194 26 210 46 210 76 L210 140 Z"
        fill="#e3e6ed"
        opacity="0.75"
      />
      {/* Sculptural lounge silhouette */}
      <rect x="136" y="78" width="52" height="44" rx="18" fill="url(#m-jr-chair)" opacity="0.9" />
      <rect x="128" y="102" width="68" height="24" rx="10" fill="#aeb5c2" opacity="0.9" />
      <line x1="142" y1="126" x2="140" y2="140" stroke="#7d8492" strokeWidth="3" strokeLinecap="round" />
      <line x1="182" y1="126" x2="184" y2="140" stroke="#7d8492" strokeWidth="3" strokeLinecap="round" />
      {/* Minimal side table */}
      <line x1="112" y1="112" x2="128" y2="112" stroke="#8c93a1" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="120" y1="112" x2="120" y2="140" stroke="#8c93a1" strokeWidth="2" />
    </>
  );
}

/* ── Kreatif & Pro: 3D monochrome sculptural ribbons & geometric spheres ─── */
function KreatifProArt() {
  return (
    <>
      <defs>
        <linearGradient id="m-kp-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dfe3eb" />
          <stop offset="50%" stopColor="#8d94a3" />
          <stop offset="100%" stopColor="#525866" />
        </linearGradient>
      </defs>
      {/* Soft diagonal light plane */}
      <polygon points="104,0 200,0 200,118 146,118" fill="#e4e7ee" opacity="0.7" />
      {/* Interlocking 3D-feel monochrome rings */}
      <ellipse
        cx="166"
        cy="88"
        rx="28"
        ry="15"
        transform="rotate(-24 166 88)"
        fill="none"
        stroke="url(#m-kp-ring)"
        strokeWidth="12"
        opacity="0.88"
      />
      <ellipse
        cx="144"
        cy="118"
        rx="30"
        ry="16"
        transform="rotate(18 144 118)"
        fill="none"
        stroke="url(#m-kp-ring)"
        strokeWidth="12"
        opacity="0.92"
      />
    </>
  );
}

/* ── Bisnis & Institusi: sleek monochrome glass tower perspective ────────── */
function BisnisInstitusiArt() {
  return (
    <>
      <defs>
        <linearGradient id="m-bi-tower" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b9c0cd" />
          <stop offset="100%" stopColor="#656d7c" />
        </linearGradient>
      </defs>
      {/* Diagonal sky beam */}
      <polygon points="118,0 200,0 200,140 84,140" fill="#e4e7ee" opacity="0.65" />
      {/* Main architectural tower */}
      <polygon points="146,38 192,20 192,140 146,140" fill="url(#m-bi-tower)" opacity="0.9" />
      <polygon points="118,68 146,54 146,140 118,140" fill="#aeb5c3" opacity="0.85" />
      {/* Crisp facade grid lines */}
      <line x1="146" y1="38" x2="146" y2="140" stroke="#f5f7fa" strokeWidth="1" opacity="0.7" />
      <line x1="168" y1="29" x2="168" y2="140" stroke="#f5f7fa" strokeWidth="0.8" opacity="0.45" />
      {[56, 74, 92, 110, 128].map((y) => (
        <line
          key={y}
          x1="146"
          y1={y}
          x2="192"
          y2={y - 14}
          stroke="#f5f7fa"
          strokeWidth="0.8"
          opacity="0.45"
        />
      ))}
    </>
  );
}
