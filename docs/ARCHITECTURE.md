# Architecture Overview

Webjoz is a Next.js App Router application that generates business websites through an AI-powered conversational wizard.

## Project Structure

- `app` — routes, layouts, metadata, error boundaries
- `components` — reusable UI, templates, wizard components
- `hooks` — client hooks for SSE streaming, auth, permissions
- `lib` — API client, utilities, content builders
- `templates/` — per-industry template components

## Site Wizard Flow

1. User chats with the wizard providing business name, type, and preferences.
2. Wizard sends data to the API's public preview endpoints.
3. API generates content + design token via AI.
4. Content is streamed back via SSE (section-by-section for progressive rendering).
5. User reviews the preview, can edit or regenerate.
6. On save, content is persisted and a subdomain-based site is created.

## SSE Streaming Pipeline

- `POST /ai/public/generate-preview-stream` triggers full AI generation in one call.
- After generation completes, sections are emitted one by one as SSE events (120ms interval).
- Frontend renders each section incrementally for a "building" effect.
- This is sequential SSE after AI completion, not true LLM streaming.

## Template Library

- Design tokens are cached per (business_type, mood) pair.
- Cache hits skip AI generation for repeated designs.
- Lookup happens in `FindSimilarDesignToken` before calling the AI.

## Multi-tenancy

- Each tenant owns sites, content, and AI usage.
- Rate limits are applied per-IP (public) and per-user (authenticated).
- Usage tracking (`ai_usage` table) records generate/regenerate counts.

## Key Technologies

- **Next.js App Router** — routing, SSR, server components
- **Server-Sent Events** — streaming preview updates
- **Go API** — AI orchestration, auth, persistence
- **PostgreSQL/MySQL** — via the API (dashboard is database-agnostic)
