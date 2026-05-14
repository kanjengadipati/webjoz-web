# Architecture Overview

Pleco Console is a Next.js App Router dashboard for operating the Pleco authentication API.

## Project Structure

- `app` contains routes, layouts, metadata, and route-level error boundaries.
- `components` contains reusable UI and shell components.
- `hooks` contains client hooks for permissions and auth-aware state.
- `lib` contains API, configuration, storage, types, and utilities.
- `public` contains static image assets.

## Data Flow

1. The user signs in through `/auth/login`.
2. The API returns a short-lived access token.
3. The dashboard stores the access token in localStorage for client API calls.
4. Refresh tokens are handled by the API through HttpOnly cookies.
5. Authenticated API calls include `Authorization: Bearer <token>`.
6. On a `401`, the API client attempts `/auth/refresh` once, stores the new access token, and retries the original request.
7. If refresh fails, the session is cleared and the user is redirected to login.

## Security Notes

- Access tokens must stay short-lived because localStorage is readable by JavaScript.
- Refresh tokens must stay in HttpOnly cookies controlled by the API.
- Production deployments must configure `NEXT_PUBLIC_API_BASE_URL`.
- Backend CORS must allow the dashboard origin and credentials.
- Production traffic should use HTTPS.

## Error Handling

The API client throws `ApiError` with an HTTP status code and optional details. Route-level error boundaries provide recovery UI for unexpected render failures.
