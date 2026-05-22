# API Integration Guide

Configure the API base URL with `NEXT_PUBLIC_API_BASE_URL`.

The dashboard is database-agnostic. PostgreSQL/MySQL selection is handled by `pleco-api` through `DB_DRIVER` and `DATABASE_URL`; no dashboard database setting is required.

## Authentication

### Login

```http
POST /auth/login
X-Device-ID: nextjs-dashboard
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Successful response:

```json
{
  "status": "success",
  "message": "Logged in",
  "data": {
    "access_token": "eyJ..."
  }
}
```

### Refresh Token

The dashboard automatically calls `POST /auth/refresh` after a `401` response. The refresh token should be stored by the API as an HttpOnly cookie.

## Error Format

```json
{
  "status": "error",
  "message": "Human-readable error",
  "errors": {
    "field_name": ["Validation message"]
  }
}
```

Rate limit responses should use HTTP `429`; the dashboard surfaces them as retry-later errors.
