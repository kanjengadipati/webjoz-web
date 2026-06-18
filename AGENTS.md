<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Session Summary — 18 June 2026

## Goal
Split monolithic `web/components/templates.tsx` (~3812 lines) into per-component files in `web/components/templates/`, rebrand "Giwangan Studio" → "Webjoz", and redesign Contact sections across all templates.

## Completed (this session)

### Refactoring
- **Split `templates.tsx`** into 13 files: `types.ts`, `shared.tsx`, `editor.tsx`, `helpers.ts`, `kuliner.tsx`, `jasa.tsx`, `produk.tsx`, `dynamic.tsx`, `elegant.tsx`, `natural.tsx`, `colorful.tsx`, `minimalist.tsx`, `index.ts`.
- Deleted old monolithic `web/components/templates.tsx`.
- Fixed pre-existing bug in `dynamic.tsx`: `hStyle` → `heroStyle`, added missing `CartProvider` import.
- Fixed Turbopack IIFE parse error in `site-wizard.tsx` by extracting logic into variables before JSX return.

### Rebranding (Giwangan → Webjoz)
Rebranded across **15 files**: brand text, domain (`app.webjoz.com`, `sites.webjoz.com`), localStorage keys (`webjoz_*`), package name (`webjoz-console`), meta tags, WhatsApp link, feature section heading.

### Contact Section Redesign
- Built **reusable `ContactSection` component** in `web/components/templates/shared.tsx` — two-column layout (info left, form right), configurable via props (`wrapperClass`, `titleClass`, `accentColor`, `textClass`, `phoneBtnClass`, `leadCardClass`, `mapsLinkClass`, etc.).
- Replaced contact blocks in **8 templates**: `bold.tsx`, `produk.tsx`, `jasa.tsx`, `kuliner.tsx`, `elegant.tsx`, `natural.tsx`, `colorful.tsx`, `minimalist.tsx`.
- Skipped `dynamic.tsx` (uses CSS-variable-based styling with `DynamicLeadForm` — incompatible with the shared component).

### Verification
- `tsc --noEmit` passes with zero errors.
- `npm run build` succeeds (static + dynamic routes rendered).
- Git commit `cbb7a15` pushed to `origin/master`.

## Key Decisions
- Each template file owns one component — isolates concerns.
- Shared components (`NavMenu`, `WAFloatingButton`, `LeadForm`, `TestimonialsSection`, `MenuCatalogCard`, `ContactSection`) live in `shared.tsx`; editor wrappers in `editor.tsx`.
- `ContactSection` uses a minimal, flexible prop-based API — templates pass tailwind classes + inline styles for customization.
- `dynamic.tsx` left untouched for the contact section due to its CSS-variable-based approach.

## Critical Context
- **storage key migration**: `tenant-store.ts` still reads old `giwangan_active_tenant_id` to migrate existing data — intentional, keep for backward compat.
- **IIFE in Turbopack**: Next.js 16 Turbopack parser chokes on deeply nested `{() => { ... }()}` patterns; extract logic into variables before JSX return.

## Relevant Files
- `web/components/templates/` — all template components
- `web/components/templates/shared.tsx` — shared components including `ContactSection`
- `web/components/templates/{kuliner,jasa,produk,elegant,natural,colorful,minimalist,bold,dynamic}.tsx` — each template
- `web/components/site-wizard.tsx` — IIFE bug fix
