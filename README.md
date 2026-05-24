# Pleco Console

The official companion dashboard for the [Pleco](https://github.com/kanjengadipati/go-auth-app) auth foundation.

- Setup guide: [INSTALLATION.md](./INSTALLATION.md)
- Common issues: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Features

- Admin login against the Pleco Go API
- Passwordless OTP login via WhatsApp or email when enabled in the API
- HttpOnly refresh-cookie session handling with access-token refresh
- Authenticated profile view
- Failed auth audit log feed
- AI-powered audit investigation trigger
- Saved investigation history viewer
- AI-powered error optimization suggestions in toast notifications


## Environment

Create a local env file:

```bash
cp .env.example .env
```

Then set:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT_MS=30000
NEXT_PUBLIC_API_DEBUG=false
NEXT_PUBLIC_ENABLE_HEALTH_CHECK=true
NEXT_PUBLIC_SOCIAL_ACTIVE_PROVIDERS=google,facebook
NEXT_PUBLIC_SOCIAL_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_SOCIAL_FACEBOOK_CLIENT_ID=
```

If you run the dashboard without the Pleco API, set `NEXT_PUBLIC_ENABLE_HEALTH_CHECK=false` so the landing page does not probe `GET /health` (restart the dev server after changing env vars).

The API must include the dashboard origin in `CORS_ALLOWED_ORIGINS` so browser requests can send credentials. The dashboard stores the short-lived access token for API calls, while the backend owns the `pleco_refresh_token` and `pleco_device_id` HttpOnly cookies.

Pleco Console does not connect to the database directly. Configure `DB_DRIVER` and `DATABASE_URL` in `pleco-api`; the dashboard only needs `NEXT_PUBLIC_API_BASE_URL` pointed at the running API, whether that API uses PostgreSQL or MySQL.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Releases

Tagged releases publish a standalone production bundle through GitHub Actions. The archive includes the traced Next.js server, static assets, and the docs needed to run the dashboard without reinstalling dependencies on the target host.

## Security Considerations

The refresh token and device id are not readable by JavaScript. They are issued by the Go API as HttpOnly cookies and sent with credentialed requests. The client refreshes short-lived access tokens through `/auth/refresh`.

For non-local deployments, serve the dashboard and API over HTTPS. The refresh cookie is marked `Secure` and `SameSite=None`.
