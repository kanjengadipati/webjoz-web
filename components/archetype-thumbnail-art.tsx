"use client";

import React from "react";

interface ArchetypeThumbnailArtProps {
  id: string;
  className?: string;
}

/** Artistic minimalist SVG illustration per archetype — dark background, monochrome palette. */
export function ArchetypeThumbnailArt({ id, className = "w-full h-full" }: ArchetypeThumbnailArtProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {renderArt(id)}
    </svg>
  );
}

function renderArt(id: string): React.ReactNode {
  switch (id) {
    case "food_venue":
      return <FoodVenueArt />;
    case "retail_catalog":
      return <RetailCatalogArt />;
    case "booking_service":
      return <BookingServiceArt />;
    case "portfolio_individual":
      return <PortfolioIndividualArt />;
    case "professional_firm":
      return <ProfessionalFirmArt />;
    case "corporate_org":
      return <CorporateOrgArt />;
    case "lodging":
      return <LodgingArt />;
    case "institution_org":
      return <InstitutionOrgArt />;
    case "destination":
      return <DestinationArt />;
    case "software_product":
      return <SoftwareProductArt />;
    default:
      return <DefaultArt />;
  }
}

/* ── Shared background ──────────────────────────────────────────────────── */
const BG = () => (
  <rect width="200" height="150" fill="#0b0d12" />
);

/* ── food_venue — bowl + steam + coffee cup ─────────────────────────────── */
function FoodVenueArt() {
  return (
    <>
      <BG />
      {/* Subtle radial glow */}
      <radialGradient id="fg-glow" cx="50%" cy="55%" r="40%">
        <stop offset="0%" stopColor="#c8a46e" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#c8a46e" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="90" rx="68" ry="40" fill="url(#fg-glow)" />

      {/* Bowl base */}
      <path d="M62 95 Q100 128 138 95" stroke="#d4b483" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="62" y1="95" x2="138" y2="95" stroke="#d4b483" strokeWidth="2" strokeLinecap="round" />
      {/* Bowl rim highlight */}
      <path d="M62 95 Q100 100 138 95" stroke="#ffffff" strokeWidth="0.6" fill="none" opacity="0.4" />

      {/* Steam lines */}
      <path d="M82 88 Q79 78 83 68 Q87 58 84 48" stroke="#d4b483" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M100 85 Q97 75 101 65 Q105 55 102 45" stroke="#d4b483" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M118 88 Q115 78 119 68 Q123 58 120 48" stroke="#d4b483" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* Small coffee cup — right */}
      <rect x="148" y="98" width="22" height="16" rx="3" stroke="#8c6e45" strokeWidth="1.5" fill="none" />
      <path d="M170 104 Q176 104 176 110 Q176 116 170 116" stroke="#8c6e45" strokeWidth="1.5" fill="none" />
      <line x1="148" y1="114" x2="170" y2="114" stroke="#8c6e45" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

      {/* Chopsticks — left */}
      <line x1="30" y1="45" x2="52" y2="90" stroke="#8c6e45" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="45" x2="58" y2="88" stroke="#8c6e45" strokeWidth="1.5" strokeLinecap="round" />

      {/* Decorative dots — spice scatter */}
      {[75, 100, 125].map((x, i) => (
        <circle key={i} cx={x} cy={105 + i * 4} r="1.5" fill="#d4b483" opacity="0.4" />
      ))}
    </>
  );
}

/* ── retail_catalog — shopping bag + floating price tag ─────────────────── */
function RetailCatalogArt() {
  return (
    <>
      <BG />
      <radialGradient id="rc-glow" cx="50%" cy="50%" r="45%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="80" rx="65" ry="42" fill="url(#rc-glow)" />

      {/* Shopping bag body */}
      <path d="M68 72 L72 118 L128 118 L132 72 Z" stroke="#c4b5fd" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      {/* Bag top */}
      <line x1="68" y1="72" x2="132" y2="72" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" />
      {/* Handles */}
      <path d="M82 72 Q82 56 100 56 Q118 56 118 72" stroke="#c4b5fd" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Bag clasp dot */}
      <circle cx="100" cy="94" r="4" stroke="#c4b5fd" strokeWidth="1.8" fill="none" />

      {/* Price tag — floating top right */}
      <rect x="130" y="38" width="34" height="22" rx="4" stroke="#7c3aed" strokeWidth="1.5" fill="#1a1230" />
      <circle cx="137" cy="44" r="2.5" stroke="#7c3aed" strokeWidth="1.2" fill="none" />
      <line x1="143" y1="43" x2="158" y2="43" stroke="#c4b5fd" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="143" y1="49" x2="155" y2="49" stroke="#c4b5fd" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      {/* Tag string */}
      <line x1="130" y1="49" x2="119" y2="68" stroke="#7c3aed" strokeWidth="1" strokeDasharray="2 2" strokeLinecap="round" />

      {/* Stars / sparkle */}
      <text x="32" y="58" fontSize="14" fill="#c4b5fd" opacity="0.5">✦</text>
      <text x="156" y="110" fontSize="10" fill="#c4b5fd" opacity="0.3">✦</text>
    </>
  );
}

/* ── booking_service — calendar + clock + checkmark ─────────────────────── */
function BookingServiceArt() {
  return (
    <>
      <BG />
      <radialGradient id="bs-glow" cx="45%" cy="55%" r="40%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="90" cy="88" rx="62" ry="38" fill="url(#bs-glow)" />

      {/* Calendar */}
      <rect x="40" y="52" width="80" height="72" rx="6" stroke="#6ee7b7" strokeWidth="2" fill="none" />
      {/* Calendar header band */}
      <rect x="40" y="52" width="80" height="18" rx="6" fill="#0d2b22" stroke="#6ee7b7" strokeWidth="2" />
      {/* Calendar date pegs */}
      <line x1="62" y1="47" x2="62" y2="57" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="98" y1="47" x2="98" y2="57" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" />
      {/* Calendar grid lines */}
      {[80, 94, 108].map((y) => (
        <line key={y} x1="48" y1={y} x2="112" y2={y} stroke="#6ee7b7" strokeWidth="0.6" opacity="0.3" />
      ))}
      {[64, 80, 96].map((x) => (
        <line key={x} x1={x} y1="70" x2={x} y2="124" stroke="#6ee7b7" strokeWidth="0.6" opacity="0.3" />
      ))}
      {/* Checkmark on calendar */}
      <path d="M75 95 L84 106 L102 84" stroke="#34d399" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Clock — top right */}
      <circle cx="148" cy="62" r="22" stroke="#6ee7b7" strokeWidth="1.8" fill="#0a1a14" />
      {/* Clock hands */}
      <line x1="148" y1="62" x2="148" y2="47" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
      <line x1="148" y1="62" x2="158" y2="68" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="148" cy="62" r="2" fill="#6ee7b7" />
      {/* Clock ticks */}
      {[0, 90, 180, 270].map((deg, i) => {
        const r = deg * Math.PI / 180;
        return <line key={i} x1={148 + 18 * Math.sin(r)} y1={62 - 18 * Math.cos(r)} x2={148 + 20 * Math.sin(r)} y2={62 - 20 * Math.cos(r)} stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" />;
      })}
    </>
  );
}

/* ── portfolio_individual — camera lens + brush diagonal ────────────────── */
function PortfolioIndividualArt() {
  return (
    <>
      <BG />
      <radialGradient id="pi-glow" cx="50%" cy="50%" r="45%">
        <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="75" rx="70" ry="48" fill="url(#pi-glow)" />

      {/* Outer lens ring */}
      <circle cx="90" cy="78" r="40" stroke="#f9a8d4" strokeWidth="2" fill="none" />
      {/* Inner lens rings */}
      <circle cx="90" cy="78" r="28" stroke="#f9a8d4" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="90" cy="78" r="16" stroke="#f9a8d4" strokeWidth="1.2" fill="none" opacity="0.4" />
      <circle cx="90" cy="78" r="6" fill="#f9a8d4" opacity="0.5" />
      {/* Lens reflection glint */}
      <circle cx="80" cy="68" r="4" fill="white" opacity="0.12" />

      {/* Brush stroke diagonal */}
      <path
        d="M118 30 Q148 50 158 90 Q162 108 148 118"
        stroke="#f472b6"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M148 118 Q142 122 136 116"
        stroke="#f472b6"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Palette dots */}
      {[
        { x: 32, y: 42, c: "#f9a8d4" },
        { x: 44, y: 52, c: "#c084fc" },
        { x: 36, y: 64, c: "#818cf8" },
      ].map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="4" fill={d.c} opacity="0.55" />
      ))}
    </>
  );
}

/* ── professional_firm — briefcase + diagonal line pattern ──────────────── */
function ProfessionalFirmArt() {
  return (
    <>
      <BG />
      <radialGradient id="pf-glow" cx="50%" cy="55%" r="42%">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="88" rx="66" ry="40" fill="url(#pf-glow)" />

      {/* Briefcase body */}
      <rect x="50" y="70" width="100" height="66" rx="7" stroke="#fcd34d" strokeWidth="2.5" fill="none" />
      {/* Briefcase handle */}
      <path d="M74 70 L74 60 Q74 54 82 54 L118 54 Q126 54 126 60 L126 70" stroke="#fcd34d" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Centre divide */}
      <line x1="50" y1="97" x2="150" y2="97" stroke="#fcd34d" strokeWidth="1.5" opacity="0.4" />
      {/* Latch */}
      <rect x="90" y="90" width="20" height="12" rx="4" stroke="#fcd34d" strokeWidth="1.5" fill="none" />
      <circle cx="100" cy="96" r="2.5" fill="#fcd34d" opacity="0.6" />

      {/* Background diagonal lines pattern */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={16 + i * 28} y1="20" x2={i * 28 - 10} y2="150" stroke="#fcd34d" strokeWidth="0.5" opacity="0.08" />
      ))}

      {/* Top tie/pen icon */}
      <line x1="100" y1="34" x2="100" y2="52" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <polygon points="96,54 100,48 104,54" fill="#fcd34d" opacity="0.3" />
    </>
  );
}

/* ── corporate_org — building silhouette + horizontal bars ──────────────── */
function CorporateOrgArt() {
  return (
    <>
      <BG />
      <radialGradient id="co-glow" cx="50%" cy="60%" r="45%">
        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="95" rx="68" ry="38" fill="url(#co-glow)" />

      {/* Building main */}
      <rect x="60" y="52" width="80" height="84" rx="2" stroke="#93c5fd" strokeWidth="2" fill="none" />
      {/* Building windows grid */}
      {[65, 80, 95, 110].map((y) =>
        [66, 82, 98, 114, 130].map((x, j) => (
          <rect key={`${y}-${j}`} x={x} y={y} width="8" height="8" rx="1.5" fill="#93c5fd" opacity={y === 110 && j < 2 ? 0.6 : 0.2} />
        ))
      )}
      {/* Antenna */}
      <line x1="100" y1="52" x2="100" y2="34" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="100" cy="32" r="2.5" fill="#93c5fd" opacity="0.5" />

      {/* Side buildings */}
      <rect x="30" y="80" width="28" height="56" rx="2" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.4" />
      <rect x="142" y="88" width="28" height="48" rx="2" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.4" />

      {/* Ground line */}
      <line x1="20" y1="136" x2="180" y2="136" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </>
  );
}

/* ── lodging — arched window + bed silhouette + key ─────────────────────── */
function LodgingArt() {
  return (
    <>
      <BG />
      <radialGradient id="lo-glow" cx="50%" cy="52%" r="42%">
        <stop offset="0%" stopColor="#86efac" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#86efac" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="80" rx="65" ry="42" fill="url(#lo-glow)" />

      {/* Arched window */}
      <path d="M68 118 L68 72 Q68 48 100 48 Q132 48 132 72 L132 118 Z" stroke="#86efac" strokeWidth="2" fill="none" />
      {/* Window cross */}
      <line x1="100" y1="48" x2="100" y2="118" stroke="#86efac" strokeWidth="1" opacity="0.4" />
      <line x1="68" y1="85" x2="132" y2="85" stroke="#86efac" strokeWidth="1" opacity="0.4" />
      {/* Stars outside window */}
      <circle cx="52" cy="38" r="1.5" fill="#86efac" opacity="0.5" />
      <circle cx="150" cy="34" r="2" fill="#86efac" opacity="0.4" />
      <circle cx="40" cy="62" r="1" fill="#86efac" opacity="0.3" />

      {/* Bed silhouette */}
      <rect x="38" y="102" width="124" height="22" rx="4" stroke="#4ade80" strokeWidth="2" fill="none" />
      {/* Pillow */}
      <rect x="50" y="96" width="28" height="12" rx="4" stroke="#4ade80" strokeWidth="1.5" fill="none" opacity="0.7" />
      <rect x="122" y="96" width="28" height="12" rx="4" stroke="#4ade80" strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* Headboard */}
      <rect x="38" y="92" width="12" height="32" rx="3" stroke="#4ade80" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Key — top right */}
      <circle cx="158" cy="50" r="10" stroke="#86efac" strokeWidth="1.8" fill="none" />
      <line x1="165" y1="56" x2="180" y2="72" stroke="#86efac" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="175" y1="68" x2="175" y2="74" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="178" y1="71" x2="178" y2="76" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
    </>
  );
}

/* ── institution_org — columns + open book + graduation cap ─────────────── */
function InstitutionOrgArt() {
  return (
    <>
      <BG />
      <radialGradient id="io-glow" cx="50%" cy="58%" r="44%">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="92" rx="68" ry="38" fill="url(#io-glow)" />

      {/* Columns */}
      {[42, 66, 90, 114, 138].map((x, i) => (
        <rect key={i} x={x} y="62" width="8" height="68" rx="2" stroke="#fde68a" strokeWidth="1.5" fill="none" opacity={i === 2 ? 0.9 : 0.4} />
      ))}
      {/* Pediment */}
      <line x1="34" y1="62" x2="166" y2="62" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 62 L100 36 L166 62" stroke="#fde68a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Steps */}
      <rect x="30" y="130" width="140" height="8" rx="1" stroke="#fde68a" strokeWidth="1" fill="none" opacity="0.3" />
      <rect x="22" y="138" width="156" height="6" rx="1" stroke="#fde68a" strokeWidth="1" fill="none" opacity="0.2" />

      {/* Open book — floating */}
      <path d="M56 90 Q100 84 144 90" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M56 90 Q56 108 100 108 Q144 108 144 90" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.5" />
      <line x1="100" y1="84" x2="100" y2="108" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />

      {/* Graduation cap */}
      <polygon points="100,30 118,38 100,46 82,38" fill="none" stroke="#fde68a" strokeWidth="1.5" />
      <line x1="118" y1="38" x2="118" y2="50" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" />
    </>
  );
}

/* ── destination — mountain ridgeline + compass needle ──────────────────── */
function DestinationArt() {
  return (
    <>
      <BG />
      <linearGradient id="da-sky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#0b0d12" />
      </linearGradient>
      <rect width="200" height="150" fill="url(#da-sky)" />

      {/* Stars */}
      {[
        [25, 20], [60, 15], [110, 10], [155, 22], [180, 12],
        [40, 38], [85, 30], [140, 35], [170, 42],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="white" opacity={0.3 + (i % 3) * 0.15} />
      ))}

      {/* Far mountain */}
      <path d="M0 110 L40 60 L80 110" stroke="#334155" strokeWidth="1.5" fill="#111827" opacity="0.8" />
      {/* Mid mountains */}
      <path d="M60 115 L105 50 L150 115" stroke="#475569" strokeWidth="1.5" fill="#1e293b" />
      {/* Near foreground */}
      <path d="M120 120 L165 70 L200 120" stroke="#475569" strokeWidth="1.5" fill="#1e293b" />
      {/* Snow cap */}
      <path d="M97 65 L105 50 L113 65" stroke="white" strokeWidth="0" fill="white" opacity="0.25" />
      {/* Ground */}
      <rect x="0" y="118" width="200" height="32" fill="#0d1117" />

      {/* Compass circle */}
      <circle cx="162" cy="40" r="20" stroke="#94a3b8" strokeWidth="1.5" fill="#0a0f1a" />
      {/* Compass N needle */}
      <polygon points="162,24 158,40 162,36 166,40" fill="white" opacity="0.8" />
      {/* Compass S needle */}
      <polygon points="162,56 158,40 162,44 166,40" fill="#475569" opacity="0.6" />
      {/* Compass ticks */}
      {[0, 90, 180, 270].map((deg, i) => {
        const r = deg * Math.PI / 180;
        return <line key={i} x1={162 + 17 * Math.sin(r)} y1={40 - 17 * Math.cos(r)} x2={162 + 19 * Math.sin(r)} y2={40 - 19 * Math.cos(r)} stroke="#94a3b8" strokeWidth="1.5" />;
      })}
      <circle cx="162" cy="40" r="2" fill="#94a3b8" />
    </>
  );
}

/* ── software_product — terminal brackets + circuit nodes ───────────────── */
function SoftwareProductArt() {
  return (
    <>
      <BG />
      <radialGradient id="sp-glow" cx="50%" cy="50%" r="45%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="75" rx="68" ry="48" fill="url(#sp-glow)" />

      {/* Monitor outline */}
      <rect x="30" y="38" width="140" height="88" rx="6" stroke="#38bdf8" strokeWidth="2" fill="none" />
      <line x1="30" y1="108" x2="170" y2="108" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
      {/* Stand */}
      <line x1="100" y1="126" x2="100" y2="138" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="82" y1="138" x2="118" y2="138" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* Terminal code: </ > */}
      <text x="52" y="85" fontSize="28" fontWeight="700" fill="#38bdf8" opacity="0.85" fontFamily="monospace">&lt;/&gt;</text>

      {/* Circuit nodes */}
      <circle cx="44" cy="50" r="3" fill="#38bdf8" opacity="0.5" />
      <circle cx="156" cy="50" r="3" fill="#38bdf8" opacity="0.5" />
      <circle cx="44" cy="98" r="3" fill="#38bdf8" opacity="0.4" />
      <circle cx="156" cy="98" r="3" fill="#38bdf8" opacity="0.4" />

      {/* Circuit traces */}
      <line x1="44" y1="50" x2="44" y2="62" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
      <line x1="44" y1="62" x2="58" y2="62" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
      <line x1="156" y1="50" x2="156" y2="62" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
      <line x1="156" y1="62" x2="142" y2="62" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />

      {/* Scanline overlay */}
      {[46, 54, 62, 70, 78, 86, 94, 102].map((y) => (
        <line key={y} x1="32" y1={y} x2="168" y2={y} stroke="#38bdf8" strokeWidth="0.3" opacity="0.06" />
      ))}
    </>
  );
}

/* ── Default fallback ───────────────────────────────────────────────────── */
function DefaultArt() {
  return (
    <>
      <BG />
      <circle cx="100" cy="75" r="40" stroke="#94a3b8" strokeWidth="2" fill="none" />
      <line x1="100" y1="35" x2="100" y2="115" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
      <line x1="60" y1="75" x2="140" y2="75" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
    </>
  );
}
