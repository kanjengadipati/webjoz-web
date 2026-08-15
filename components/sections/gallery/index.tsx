// gallery/index.tsx — passthrough to classic.tsx.
//
// Previously this file had a variant dispatcher that read
// design_token.layout.section_variants.gallery, but the map only ever had
// one entry (grid: GalleryClassic), making it a no-op. The actual
// grid / masonry / carousel routing lives inside classic.tsx via
// content.gallery.layout, so this file is now a simple re-export.
export { default } from "./classic";
