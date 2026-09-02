# Webjoz Console

AI-powered website builder for Indonesian UMKM. Build professional business websites through a conversational wizard that generates complete sites via AI.

| Mode | Description |
|---|---|
| **Public** (`/create`) | Anyone can start the AI wizard; authentication required to save/publish |
| **Dashboard** (`/dashboard`) | Multi-tenant workspace with full site management, RBAC, and AI usage tracking |

---

## Quick Links

| Page | Purpose |
|---|---|
| `/` | Landing page — bilingual (id / en) |
| `/create` | Public AI wizard |
| `/login` | Multi-method auth (WhatsApp, Email OTP, Password) |
| `/dashboard` | Overview with stats and activity |
| `/dashboard/sites` | Site management grid |
| `/dashboard/sites/[id]` | Site editor |
| `/dashboard/domains` | Custom domain management |
| `/dashboard/leads` | Customer leads |
| `/dashboard/analytics` | Site analytics |
| `/dashboard/settings` | Workspace settings |
| `/preview/[id]` | Public site preview by ID |
| `/terms` / `/privacy-policy` / `/refund-policy` | Legal pages |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Streaming:** Server-Sent Events for AI preview
- **State:** localStorage-based auth + tenant stores
- **Styling:** Tailwind CSS v4
- **API:** Go backend with JWT auth, multi-tenant RBAC
- **Payments:** Midtrans Snap + PayPal (config in `lib/config.ts`)
- **AI:** Primary Groq → fallback Gemini → fallback OpenRouter → mock content
- **Database:** PostgreSQL via GORM

---

## Getting Started

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` to point at the Webjoz API.

---

## Documentation

This repo now includes the following docs:

- **`FEATURES.md`** — comprehensive feature inventory (public pages, dashboard, site editor, AI wizard, API modules)
- **`docs/API.md`** — Go API endpoint reference (all modules, methods, paths, auth status)
- **`docs/DATA_MODEL.md`** — entity-relationship overview (key DB tables, indexes, GORM patterns)
- **`web/AGENTS.md`** — architecture overview (26 API modules, template system, build commands)

All docs are generated from code audit (June 2026) and kept in sync with the repository.

---

## License

MIT License — see root `LICENSE` for details.