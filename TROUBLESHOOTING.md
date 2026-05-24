# Troubleshooting

This page covers the issues most likely to block a Pleco Console setup.

## The login request fails with a CORS error

Symptoms:

- Browser console shows a CORS error
- The request never completes in the network tab

Checks:

- Confirm `NEXT_PUBLIC_API_BASE_URL` points to the correct Pleco API origin
- Confirm the API allows the dashboard origin in `CORS_ALLOWED_ORIGINS`
- Make sure the origin includes the correct scheme, host, and port

Example:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Login succeeds but I get redirected back to `/login`

Symptoms:

- Credentials are accepted
- Protected routes immediately bounce back to the login page

Checks:

- Verify the API is setting the `pleco_refresh_token` and `pleco_device_id` cookies
- For local development, confirm the API is configured to allow credentialed requests from the dashboard origin
- For non-local environments, make sure both apps are served over HTTPS

Why this happens:

The dashboard can refresh access tokens only if the backend-managed refresh cookie is present.

## The app keeps calling the wrong API host

Symptoms:

- Requests go to `localhost:8080` when you expected another environment
- The API docs button opens the wrong URL

Checks:

- Confirm `NEXT_PUBLIC_API_BASE_URL` is set in `.env.local`
- Restart the dev server after changing environment variables

Why this happens:

This app defaults to `http://localhost:8080` when `NEXT_PUBLIC_API_BASE_URL` is not set.

## I switched the API between PostgreSQL and MySQL

Checks:

- Restart the Pleco API after changing `DB_DRIVER` or `DATABASE_URL`
- Run API migrations and seed data for the selected database
- Keep `NEXT_PUBLIC_API_BASE_URL` pointed at the API host, not the database host
- Restart the dashboard only if `NEXT_PUBLIC_API_BASE_URL` changed

Why this happens:

Pleco Console is database-agnostic. It only talks to the API, so most database-driver issues need to be fixed in `pleco-api`.

## Social login buttons are missing

Checks:

- Set `NEXT_PUBLIC_SOCIAL_ACTIVE_PROVIDERS`
- Add the matching provider client IDs
- Restart the dev server after editing `.env.local`

Example:

```env
NEXT_PUBLIC_SOCIAL_ACTIVE_PROVIDERS=google,facebook
NEXT_PUBLIC_SOCIAL_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_SOCIAL_FACEBOOK_CLIENT_ID=your-facebook-client-id
```

## `npm run build` fails in CI or on a server

Checks:

- Use Node.js 20.9 or newer
- Run `npm ci` instead of `npm install` in clean CI environments
- Confirm the lockfile is committed and matches `package.json`

## The standalone release bundle starts, but static assets are missing

Checks:

- Use the generated GitHub release tarball directly, rather than rebuilding the archive by hand
- If you package the standalone output yourself, copy both `public/` and `.next/static/` into the standalone folder before starting `server.js`

## Authentication works locally but fails after deployment

Checks:

- Confirm the deployed dashboard origin is listed in the API CORS settings
- Confirm the API is serving cookies with settings appropriate for your deployment
- Confirm the dashboard and API are both using HTTPS in production

## I changed environment variables and nothing changed

Checks:

- Stop and restart the Next.js process
- Rebuild before re-running the standalone server
- Verify you edited `.env.local` in the project root

## Still stuck?

When reporting an issue, include:

- Dashboard version or Git tag
- Node.js version
- `NEXT_PUBLIC_API_BASE_URL` value, with secrets removed
- Exact browser error message
- Whether the problem happens in local dev, standalone release, or deployed production
