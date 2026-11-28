"use client";

import React from "react";

interface ArchetypeThumbnailArtProps {
  id: string;
  className?: string;
}

/**
 * Abstract geometric & organic SVG artwork per archetype.
 * Matches the aesthetic of /public/mood/*.svg: rich dark gradient base,
 * layered Bauhaus/organic shapes, and delicate hairline strokes.
 */
export function ArchetypeThumbnailArt({ id, className = "w-full h-full" }: ArchetypeThumbnailArtProps) {
  return (
    <svg
      viewBox="0 0 256 160"
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
      return <CorporateOrgArt />;
  }
}

/* ── food_venue: warm espresso, terracotta & cream organic curves ─────────── */
function FoodVenueArt() {
  return (
    <>
      <defs>
        <linearGradient id="at-food-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2E1B12" />
          <stop offset="100%" stopColor="#140C08" />
        </linearGradient>
        <linearGradient id="at-food-warm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0B882" />
          <stop offset="100%" stopColor="#B85D38" />
        </linearGradient>
      </defs>
      <rect width="256" height="160" fill="url(#at-food-bg)" />
      <path
        d="M-20 120 C35 68 75 18 145 14 C198 11 235 48 228 96 C220 144 158 168 98 156 C52 146 25 112 -20 120 Z"
        fill="url(#at-food-warm)"
        opacity="0.82"
      />
      <path
        d="M80 165 C105 98 162 56 226 62 C258 65 275 98 265 138 C252 175 162 175 80 165 Z"
        fill="#7A3620"
        opacity="0.75"
      />
      <circle cx="192" cy="48" r="28" fill="#F6D5B0" opacity="0.22" />
      <path
        d="M18 140 C68 92 128 42 238 24"
        fill="none"
        stroke="#F7D89A"
        strokeWidth="1.5"
        opacity="0.55"
      />
    </>
  );
}

/* ── retail_catalog: plum, dusty rose & peach layered planes ──────────────── */
function RetailCatalogArt() {
  return (
    <>
      <defs>
        <linearGradient id="at-retail-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#26162B" />
          <stop offset="100%" stopColor="#120B16" />
        </linearGradient>
        <linearGradient id="at-retail-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5B8A0" />
          <stop offset="100%" stopColor="#D15E7D" />
        </linearGradient>
      </defs>
      <rect width="256" height="160" fill="url(#at-retail-bg)" />
      <rect x="132" y="-12" width="136" height="136" rx="36" fill="#3B234A" opacity="0.85" />
      <path
        d="M-16 145 C24 88 94 56 156 76 C202 91 224 132 192 170 L-16 170 Z"
        fill="url(#at-retail-accent)"
        opacity="0.85"
      />
      <circle cx="186" cy="54" r="34" fill="#A980D4" opacity="0.45" />
      <path d="M16 24 L212 146" stroke="#FADAD0" strokeWidth="1.4" opacity="0.45" />
      <path d="M148 0 V160" stroke="#E8B4C8" strokeWidth="1" opacity="0.2" />
    </>
  );
}

/* ── booking_service: deep emerald & mint geometric flow ──────────────────── */
function BookingServiceArt() {
  return (
    <>
      <defs>
        <linearGradient id="at-book-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#123029" />
          <stop offset="100%" stopColor="#091513" />
        </linearGradient>
        <linearGradient id="at-book-mint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#1E6B52" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="256" height="160" fill="url(#at-book-bg)" />
      <rect x="20" y="18" width="96" height="96" rx="22" fill="#18473B" opacity="0.9" />
      <circle cx="176" cy="94" r="76" fill="url(#at-book-mint)" />
      <circle cx="176" cy="94" r="42" fill="#0C211C" opacity="0.85" />
      <path d="M116 0 V160 M0 82 H256" stroke="#A7F3D0" strokeWidth="1.2" opacity="0.28" />
      <path
        d="M34 142 C82 108 134 52 242 28"
        fill="none"
        stroke="#6EE7B7"
        strokeWidth="1.8"
        opacity="0.6"
      />
    </>
  );
}

/* ── portfolio_individual: editorial coral, apricot & obsidian blobs ──────── */
function PortfolioIndividualArt() {
  return (
    <>
      <defs>
        <linearGradient id="at-port-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7C58E" />
          <stop offset="100%" stopColor="#E45A4F" />
        </linearGradient>
      </defs>
      <rect width="256" height="160" fill="#171419" />
      <path
        d="M-12 22 C42 -8 106 12 126 62 C146 112 96 154 34 148 C-18 142 -28 64 -12 22 Z"
        fill="url(#at-port-blob)"
        opacity="0.88"
      />
      <path
        d="M128 168 C144 106 188 68 242 74 C272 78 276 132 256 168 Z"
        fill="#D94854"
        opacity="0.78"
      />
      <circle cx="198" cy="42" r="24" fill="#F9DFC2" opacity="0.25" />
      <circle
        cx="132"
        cy="78"
        r="58"
        fill="none"
        stroke="#FBE5CC"
        strokeWidth="1.5"
        opacity="0.5"
      />
    </>
  );
}

/* ── professional_firm: obsidian & intersecting champagne gold arcs ───────── */
function ProfessionalFirmArt() {
  return (
    <>
      <defs>
        <linearGradient id="at-firm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF0C9" />
          <stop offset="50%" stopColor="#C99A56" />
          <stop offset="100%" stopColor="#F7D89A" />
        </linearGradient>
      </defs>
      <rect width="256" height="160" fill="#181615" />
      <path d="M0 0 H152 L96 160 H0 Z" fill="#211D19" />
      <path
        d="M16 -8 C108 16 162 66 174 134 C178 152 174 166 168 176"
        fill="none"
        stroke="url(#at-firm-gold)"
        strokeWidth="3.5"
      />
      <path
        d="M256 46 C198 58 158 88 134 128 C124 146 118 158 116 172"
        fill="none"
        stroke="url(#at-firm-gold)"
        strokeWidth="3.5"
      />
      <path d="M172 0 V160" stroke="#D9B77C" strokeWidth="1.2" opacity="0.55" />
      <path d="M0 112 H256" stroke="#D9B77C" strokeWidth="0.8" opacity="0.2" />
    </>
  );
}

/* ── corporate_org: Bauhaus steel-blue & silver geometric grid ────────────── */
function CorporateOrgArt() {
  return (
    <>
      <defs>
        <linearGradient id="at-corp-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DCE4F0" />
          <stop offset="100%" stopColor="#465369" />
        </linearGradient>
      </defs>
      <rect width="256" height="160" fill="#111620" />
      <rect x="0" y="0" width="128" height="80" fill="#182132" />
      <rect x="128" y="0" width="128" height="80" fill="#243147" />
      <rect x="0" y="80" width="128" height="80" fill="url(#at-corp-silver)" opacity="0.85" />
      <rect x="128" y="80" width="64" height="52" fill="#E8EEF7" opacity="0.82" />
      <path d="M128 0 V160 M0 80 H256" stroke="#E2E8F0" strokeWidth="1.6" opacity="0.7" />
    </>
  );
}

/* ── lodging: calm forest sage, olive & warm linen arches ─────────────────── */
function LodgingArt() {
  return (
    <>
      <defs>
        <linearGradient id="at-lodg-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#264237" />
          <stop offset="100%" stopColor="#0E1B18" />
        </linearGradient>
      </defs>
      <rect width="256" height="160" fill="url(#at-lodg-bg)" />
      <path
        d="M52 160 L52 84 C52 38 92 18 128 18 C164 18 204 38 204 84 L204 160 Z"
        fill="#446B5C"
        opacity="0.72"
      />
      <path
        d="M12 164 C38 112 84 82 136 86 C182 90 212 122 198 164 Z"
        fill="#0B1614"
        opacity="0.88"
      />
      <path
        d="M96 8 C72 42 52 74 18 98"
        fill="none"
        stroke="#A3C2B0"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle cx="176" cy="52" r="18" fill="#E6DEC8" opacity="0.22" />
    </>
  );
}

/* ── institution_org: midnight indigo, classical pillars & warm gold ──────── */
function InstitutionOrgArt() {
  return (
    <>
      <defs>
        <linearGradient id="at-inst-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B2340" />
          <stop offset="100%" stopColor="#0D1120" />
        </linearGradient>
      </defs>
      <rect width="256" height="160" fill="url(#at-inst-bg)" />
      <rect x="28" y="34" width="38" height="126" rx="6" fill="#2A3660" opacity="0.85" />
      <rect x="78" y="20" width="44" height="140" rx="6" fill="#37487D" opacity="0.8" />
      <path
        d="M136 160 A88 88 0 0 1 256 76 L256 160 Z"
        fill="#D6B26E"
        opacity="0.32"
      />
      <path
        d="M148 160 A64 64 0 0 1 256 102"
        fill="none"
        stroke="#F2D79B"
        strokeWidth="2"
        opacity="0.65"
      />
      <path d="M100 0 V160" stroke="#9AA9D6" strokeWidth="1" opacity="0.25" />
    </>
  );
}

/* ── destination: twilight teal, horizon dunes & sand curve ───────────────── */
function DestinationArt() {
  return (
    <>
      <defs>
        <linearGradient id="at-dest-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#133344" />
          <stop offset="100%" stopColor="#0A141D" />
        </linearGradient>
        <linearGradient id="at-dest-sand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8C5A0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#266B7E" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="256" height="160" fill="url(#at-dest-bg)" />
      <circle cx="184" cy="48" r="26" fill="#F3D6B3" opacity="0.32" />
      <path
        d="M-16 112 C46 72 108 66 164 94 C208 116 238 98 268 82 L268 168 L-16 168 Z"
        fill="url(#at-dest-sand)"
      />
      <path
        d="M-12 138 C56 108 128 118 192 142 C226 154 248 144 268 134 L268 168 L-12 168 Z"
        fill="#0D222E"
        opacity="0.92"
      />
      <path d="M18 46 H132" stroke="#7AD3E8" strokeWidth="1.2" opacity="0.4" />
    </>
  );
}

/* ── software_product: cobalt midnight & electric cyan concentric orbits ──── */
function SoftwareProductArt() {
  return (
    <>
      <defs>
        <radialGradient id="at-soft-bg" cx="62%" cy="68%" r="65%">
          <stop offset="0%" stopColor="#123E65" />
          <stop offset="100%" stopColor="#0D1624" />
        </radialGradient>
      </defs>
      <rect width="256" height="160" fill="url(#at-soft-bg)" />
      <circle cx="158" cy="112" r="98" fill="none" stroke="#14C9F4" strokeWidth="1.8" opacity="0.78" />
      <circle cx="158" cy="112" r="64" fill="none" stroke="#42D7FF" strokeWidth="1.8" opacity="0.9" />
      <circle cx="158" cy="112" r="30" fill="#1675A8" opacity="0.6" />
      <path
        d="M14 66 C48 26 92 6 148 4 M184 0 V74 M0 134 H88"
        fill="none"
        stroke="#35BFEF"
        strokeWidth="1.6"
        opacity="0.8"
      />
      <path d="M184 0 V46 M0 134 H54" stroke="#B4F4FF" strokeWidth="1" opacity="0.75" />
    </>
  );
}
