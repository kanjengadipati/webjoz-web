# Pleco Console

The official companion dashboard for the [Pleco](https://github.com/kanjengadipati/go-auth-app) auth foundation.

- Setup guide: [INSTALLATION.md](./INSTALLATION.md)
- Common issues: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Features

- Admin login against the Pleco Go API
- HttpOnly refresh-cookie session handling with access-token refresh
- Authenticated profile view
- Failed auth audit log feed
- AI-powered audit investigation trigger
- Saved investigation history viewer


## Environment

Create a local env file:

```bash
cp .env.example .env.local
```

Then set:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

The API must include the dashboard origin in `CORS_ALLOWED_ORIGINS` so browser requests can send credentials. The dashboard stores the short-lived access token for API calls, while the backend owns the `pleco_refresh_token` HttpOnly cookie for refresh rotation.

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Releases

Tagged releases publish a standalone production bundle through GitHub Actions. The archive includes the traced Next.js server, static assets, and the docs needed to run the dashboard without reinstalling dependencies on the target host.

## Security Considerations

The refresh token is not readable by JavaScript. It is issued by the Go API as the `pleco_refresh_token` HttpOnly cookie and sent with credentialed requests. The client refreshes short-lived access tokens through `/auth/refresh`.

For non-local deployments, serve the dashboard and API over HTTPS. The refresh cookie is marked `Secure` and `SameSite=None`.
