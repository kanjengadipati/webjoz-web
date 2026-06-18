# Design System

Webjoz uses a compact operational dashboard style: dense, scannable, and quiet, with restrained motion and clear semantic color.

## Typography

- Page headings use bold tracking-tight display text.
- Card and panel headings stay smaller than page headings.
- Body copy uses `text-sm` with relaxed leading for descriptions.
- Monospace is reserved for tokens, IDs, code, and technical metadata.

## Colors

- Primary and secondary colors come from CSS variables in `app/globals.css`.
- Semantic tones live in `lib/ui-tones.ts`: `neutral`, `good`, `warning`, `danger`, and `info`.
- Status mapping lives in `lib/status-types.ts` so badges do not rely on scattered string checks.
- Components must support light and dark themes through Tailwind dark variants and CSS variables.

## Components

- UI primitives live under `components/ui`.
- `components/ui/index.ts` is the public export surface.
- Button, card, badge, input, form, skeleton, dialog, status badge, and metric card primitives should stay small and typed.
- Icons live in `components/icons` and use `currentColor`.

## Forms

- Use `Input`, `Textarea`, `Select`, `Checkbox`, and `FormField` for new forms.
- Inputs expose invalid state with `aria-invalid`.
- Required fields should be visually marked through `FormField`.

## Spacing

- Prefer the app's existing 4px-based Tailwind spacing scale.
- Use `lib/ui-tokens.ts` for shared spacing, focus, disabled, and motion constants when creating reusable components.

## Motion

- New reusable components should use `motion-safe` and `motion-reduce` classes.
- Avoid animation on large layout containers unless it communicates loading or state changes.

## Accessibility

- Icon-only buttons need `aria-label`.
- Decorative SVGs should set `aria-hidden="true"`.
- Active navigation links should set `aria-current="page"`.
- Interactive custom surfaces should be real buttons or links whenever possible.
