# Installation Guide

This guide covers the two supported ways to run `pleco-console`:

- Local development with `next dev`
- Production-style execution from the standalone release bundle

## Prerequisites

- Node.js 20.9 or newer
- npm 10 or newer
- A running Pleco API instance

The dashboard talks directly to the Pleco API, so you need the API base URL before starting.
The database is configured only in `pleco-api`; this dashboard works the same whether the API is running PostgreSQL or MySQL.

## 1. Clone and install

```bash
git clone https://github.com/kanjengadipati/gokitdash.git
cd gokitdash
npm ci
```

## 2. Configure environment

Create a local environment file:

```bash
cp .env.example .env.local
```

Set the API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Optional social login configuration:

```env
NEXT_PUBLIC_SOCIAL_ACTIVE_PROVIDERS=google,facebook
NEXT_PUBLIC_SOCIAL_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_SOCIAL_FACEBOOK_CLIENT_ID=your-facebook-client-id
```

## 3. Allow the dashboard origin in the API

Browser auth requests use credentials, so the Pleco API must allow the dashboard origin.

For local development, make sure the API includes:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

If you use a different dashboard port or hostname, add that exact origin instead.

If you are testing the new Pleco API database selector, set `DB_DRIVER=postgres` or `DB_DRIVER=mysql` in the API project and keep the dashboard pointed at the same API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 4. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## 5. Build for production

```bash
npm run build
```

This project uses Next.js standalone output, which creates a deployable server bundle in `.next/standalone`.

To run the standalone build locally:

```bash
cp -R public .next/standalone/
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/
PORT=3000 HOSTNAME=0.0.0.0 node .next/standalone/server.js
```

## 6. Run from a GitHub release bundle

Tagged releases publish a file named like:

```text
pleco-console-v0.1.0-standalone.tar.gz
```

After downloading:

```bash
tar -xzf pleco-console-v0.1.0-standalone.tar.gz
cd pleco-console-v0.1.0
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com PORT=3000 HOSTNAME=0.0.0.0 node server.js
```

The release bundle already includes the traced production dependencies, `public/`, and `.next/static/`.

## 7. Verify the setup

- Visit `/login`
- Sign in with a valid Pleco account
- Confirm authenticated pages load without repeated redirects
- Open the browser devtools network tab and verify requests are going to the expected API base URL

## Notes

- The dashboard stores the access token client-side for API requests.
- The refresh token stays in the backend-managed `pleco_refresh_token` HttpOnly cookie.
- For non-local deployments, serve both the API and dashboard over HTTPS so secure cookies can work correctly.
