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
| `/template-gallery` | Browsable website template gallery |
| `/blog` | Blog & tips articles |
| `/changelog` | Product changelog |
| `/login` | Multi-method auth (WhatsApp, Email OTP, Password) |
| `/contact` | Contact page |
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

Live documentation lives in this repo:

- **`docs/ARCHITECTURE.md`** — project structure (routes, layouts, components, state)
- **`docs/API_INTEGRATION.md`** — frontend ↔ Go API integration guide
- **`docs/DESIGN_SYSTEM.md`** — design tokens, theming, and styling conventions
- **`docs/QA-Manual-Testing.md`** — manual QA checklist for critical business flows
- **`AGENTS.md`** — agent coding rules & feature work checklist

The API itself is documented in the sibling repo under `api/` (see `api/AGENTS.md`).

---

## License

This project does not ship a public license. Contact the repository owner for usage and distribution rights.