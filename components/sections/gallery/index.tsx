// gallery/index.tsx — passthrough to classic.tsx.
//
// Previously this file had a variant dispatcher that read
// design_token.layout.section_variants.gallery, but the map only ever had
// one entry (grid: GalleryClassic), making it a no-op. The dispatcher was
// removed and the variant selection was inline in classic.tsx via
// content.gallery.layout. Now classic.tsx reads section_variants.gallery
// (the unified mechanism used by all other sections), with content.gallery.layout
// as a backward-compatible fallback. This file remains a simple re-export.
export { default } from "./classic";
