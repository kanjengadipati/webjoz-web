# Webjoz Console

AI-powered website generator. Build professional business websites through a conversational wizard — no coding required.

## Overview

Webjoz lets you create a complete business website by answering a few questions in a chat interface. The AI generates copy, selects a visual design, and produces a live preview you can edit and publish.

The platform has two modes:
- **Public** (`/create`) — anyone can start the AI wizard; authentication is required to save/publish
- **Dashboard** (`/dashboard`) — multi-tenant workspace with full site management

## Business Flow

```
Landing → AI Wizard → Login → Dashboard → Editor → Publish → Custom Domain
```

### 1. AI Wizard (`/create` or `/dashboard/sites/new`)
A chat-based dual-panel wizard (`components/site-wizard/`) guides users through:
1. **Business name** — user types the business name
2. **Business type** — pick from Kuliner, Jasa, Toko & UMKM, Company + sub-type
3. **AI generation** — SSE stream from `POST /ai/public/generate-preview-stream` sends design token + sections progressively; live preview renders in real-time
4. **Details** — optional service area + WhatsApp number
5. **Review** — confirm step with inline editing before saving

### 2. Authentication Gate
When saving, unauthenticated users are redirected to `/login` with wizard data persisted in localStorage. After login, the site is created automatically.

### 3. Dashboard (`/dashboard/sites`)
Grid of site cards with iframe previews. Each card shows status (Live/Draft), subdomain, and last modified date. Actions: Edit, Publish, Unpublish, Duplicate, Rename, Delete.

### 4. Site Editor (`/dashboard/sites/[id]`)
Full-screen split-panel workspace:
- **Content tab** — per-section form fields with AI regeneration and diff review
- **Design tab** — template picker (8 presets) + AI design regeneration
- **Live preview** — desktop/mobile toggle, scroll-sync
- **Autosave** — 2-second debounced save; manual save also available
- **Publish** — sets status to published with subdomain selection

### 5. Domains (`/dashboard/domains`)
Connect custom domains to published sites. DNS verification via CNAME check.

### 6. Public Site
Published sites render via `/s/[subdomain]`, `/site/[subdomain]`, or `/site-by-domain/[host]` using the appropriate template component with lead capture and pageview tracking.

## Key Pages

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/create` | Public AI wizard |
| `/login` | Multi-method auth (WhatsApp, Email OTP, Password) |
| `/dashboard` | Overview with stats and activity |
| `/dashboard/sites` | Site management grid |
| `/dashboard/sites/new` | Dashboard AI wizard |
| `/dashboard/sites/[id]` | Site editor |
| `/dashboard/domains` | Custom domain management |
| `/dashboard/leads` | Customer leads |
| `/dashboard/analytics` | Site analytics |
| `/dashboard/settings` | Workspace settings |
| `/preview/[id]` | Public site preview by ID |

## Tech Stack

- **Framework:** Next.js App Router
- **Streaming:** Server-Sent Events for AI preview
- **State:** localStorage-based auth + tenant stores
- **Styling:** Tailwind CSS
- **API:** Go backend with JWT auth, multi-tenant RBAC

## Getting Started

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` to point at the Webjoz API.
