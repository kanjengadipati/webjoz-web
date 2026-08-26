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

# Project Overview

**Webjoz** — AI-powered website builder for Indonesian UMKM. Users interact with a conversational wizard that generates complete business websites via AI.

| Layer | Tech | Version |
|---|---|---|
| **API** | Go + Gin | 1.25 |
| **Frontend** | Next.js (App Router) | 16.2.4 |
| **Database** | PostgreSQL | via GORM |
| **ORM** | GORM | 1.30 |
| **UI** | Tailwind CSS | v4 |
| **Auth** | JWT (HS256) + Refresh Token | |

## Monorepo Structure

```
giwangan-web-gen/
├── api/          → git@github.com:kanjengadipati/webjoz-api.git
├── web/          → git@github.com:kanjengadipati/webjoz-web.git
├── scratch/      → temp files, not versioned
└── *.md          → engineering specs & reviews
```

**Note:** Parent directory is NOT a git repo. `api/` and `web/` have independent git repos.

## API Module Structure (26 modules)

Each module follows: `handler.go` → `service.go` → `repository.go` → `model.go` → `dto.go` → `routes.go` → `module.go`

```
api/internal/modules/
├── aisite/       → AI site generation
├── analytics/    → Usage analytics
├── auth/         → Login, register, OTP
├── blog/         → Blog posts
├── domain/       → Custom domain management
├── lead/         → Lead capture
├── payment/      → Midtrans + PayPal
├── plan/         → Subscription plans
├── site/         → Website CRUD, publish
├── tenant/       → Multi-tenant workspaces
├── testimoni/    → Testimonials
└── ... (26 total)
```

## Build Commands

### API (`api/`)
```bash
make test              # Run Go test suite
make fmt               # Format Go code
make check             # Format + test
make migrate-up        # Apply migrations
make seed              # Seed database
go run ./cmd/api       # Start API server
```

### Frontend (`web/`)
```bash
npm run dev            # Start dev server (Turbopack)
npm run build          # Production build
npm run lint           # ESLint
npm run test:e2e       # Playwright E2E tests
```

## Key Patterns

### Auth Flow
1. Login → JWT access token (15min) + refresh token (HttpOnly cookie)
2. Frontend auto-refreshes on 401 via `lib/api/client.ts`
3. Refresh token rotates on each use (family-based detection)

### RBAC
- Roles: `superadmin`, `admin`, `user`
- Tenant roles: `owner`, `admin`, `editor`, `viewer`
- Permissions checked via `middleware.CheckTenantPermission()`

### AI Generation Flow
1. Wizard collects business info
2. API calls primary provider (Groq)
3. On failure → fallback Gemini → fallback OpenRouter → mock content
4. Response includes prompt versioning for debugging

### Error Response Format
```json
{
  "status": "error",
  "message": "Human readable message",
  "code": "ERR_ERROR_CODE",
  "errors": [...]
}
```

## Coding Conventions

### Go (API)
- Imports: `pleco-api/internal/...`
- Env vars: `SNAKE_CASE` via `config.GetEnv()`
- JSON: `camelCase`
- Tests: `go test -race -count=1 ./...`

### TypeScript (Web)
- Path alias: `@/*` → `./*`
- Components: Functional + hooks, `"use client"` for client
- Styling: Tailwind utility classes, dark theme default
- Files: `kebab-case.tsx`, `PascalCase` for components
- State: React hooks + localStorage

## Testing

### API
- Unit: `testify` + `go-sqlmock`
- Integration: Newman (Postman collections)
- Run: `make test` or `make postman-all`

### Frontend
- E2E: Playwright (4 projects: chromium, mobile, unauthed, admin)
- Locale: `id-ID`, timezone: `Asia/Jakarta`
- Run: `npm run test:e2e`

## Important Files Reference

| File | Purpose |
|---|---|
| `api/internal/config/app.go` | All env vars, AI config, fallback chain |
| `api/internal/ai/service.go` | AI provider orchestration |
| `api/internal/ai/gemini_provider.go` | Gemini API implementation |
| `api/internal/middleware/auth_middleware.go` | JWT validation |
| `api/internal/httpx/response.go` | Response helpers |
| `web/lib/api/client.ts` | Frontend API client with auto-refresh |
| `web/lib/config.ts` | Frontend configuration |
| `web/components/templates/` | All website templates |
| `web/components/site-wizard/` | AI wizard UI |

# Deployment Architecture

| Component | Platform | Tier | Cost |
|---|---|---|---|
| **Frontend (web/)** | Vercel | Hobby | $0 |
| **API (api/)** | Oracle Cloud (OCI) | Always Free | $0 |
| **Database** | PostgreSQL on OCI | Always Free | $0 |
| **AI (Primary)** | Groq | Free | $0 |
| **AI (Fallback 1)** | Gemini 3.5 Flash | Free Tier | $0 |
| **AI (Fallback 2)** | OpenRouter | Free | $0 |
| **Email** | Brevo (SMTP) | Free | $0 |
| **Domain** | ResellerClub | Paid | ~$10/yr |

## Environment Variables

### Production API (OCI)
```
AI_PROVIDER=openai
AI_MODEL=openai/gpt-oss-120b
AI_BASE_URL=https://api.groq.com/openai/v1
AI_API_KEY=gsk_xxx

AI_FALLBACK_PROVIDER=gemini
AI_FALLBACK_MODEL=gemini-3.5-flash
AI_FALLBACK_API_KEY=xxx

AI_FALLBACK_2_PROVIDER=openai
AI_FALLBACK_2_BASE_URL=https://openrouter.ai/api/v1
AI_FALLBACK_2_MODEL=openai/gpt-oss-20b:free
AI_FALLBACK_2_API_KEY=sk-or-xxx
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://api.webjoz.com
```

## Notes
- OCI Always Free tier: 4 OCPUs, 24GB RAM, 200GB storage
- Vercel Hobby: 100GB bandwidth, serverless functions
- All AI providers use free tiers — no billing required
- If AI usage exceeds free limits, implement mock content fallback (already in code)

<!-- BEGIN:git-safety-rules -->
# Git Safety Rules

These rules MUST be followed on every git operation, without exception:

1. **Never `git init` on a folder that already has a remote repository.** Always run `git fetch origin` first to check for existing history before any operation.
2. **Never `git push --force` or `git push -f` without explicit confirmation from the user** in that specific conversation turn. Force push can destroy remote git history.
3. **If a folder has no `.git` directory but has a remote URL**, do `git init`, then `git fetch origin`, then `git reset --soft origin/<branch>` to inherit the existing history — never create a standalone initial commit that squashes all files.
4. **Before any commit or push**, always run `git status` and `git diff --stat` to confirm only the intended files are included.
5. **If in doubt about git operations with destructive potential**, stop and ask the user first.
<!-- END:git-safety-rules -->

# Session Summary — 4 July 2026

## Goal
Implement remaining high-ROI improvements from `webjoz-engine-improvements.md` — prompt versioning, section caching, per-section quality badges.

## Completed

### 1.3 Prompt versioning in API
- Added `content_prompt_version` (`v2.3.0`) and `design_token_prompt_version` (`v1.5.0`) to:
  - `GeneratePreview` JSON response (`handler.go:417-418`)
  - `GeneratePreviewStream` SSE `done` event (`handler.go:647-649`)
  - `streamEvent` struct (`handler.go:436-437`)

### 2.3 Gemini responseSchema (confirmed already done)
- Gemini provider already passes `responseSchema` in `generationConfig` — no change needed.

### 3.4 Section-level cache wiring
- `GenerateSiteContent` in `service.go` now:
  1. Checks cache for cacheable sections (benefits, faq, testimonials) after AI generation — if a cached version exists, it overwrites the AI-generated one
  2. Re-caches the version in use after each generation
- Cache key uses `generic_section:<section>:<fnv32hash>` with 24h TTL
- Cache store is already plumbed through `module.go`/`router.go`

### 7.1/7.2 Per-section quality badges
- Added `getSectionQualityIssues(content, section)` and `getSectionScore(content, section)` to `editor-utils.ts`
- Modified editor sidebar (`page.tsx:22214`) to show a colored dot next to each section number:
  - Green (`>=85%`), Amber (`>=65%`), Red (`<65%`)
  - Hidden for header/footer/seo (non-content sections)
  - Hidden when score is 100% (no issues)
- `collectQualityIssues` field list exported for reuse

## Not implemented (blocked)
- **7.3 Mood preview tiles** — No mood picker exists in the wizard; mood is AI-inferred. Skipped per user decision.

## Verification
- `go build ./...` passes (api/)
- `npx tsc --noEmit` passes (web/)
<!-- END:git-safety-rules -->
