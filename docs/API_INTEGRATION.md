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

### Passwordless OTP

The login page can request and verify OTP codes through the Pleco API. The backend owns provider selection, cooldowns, OTP hashing, trusted-device persistence, and the refresh cookie.

Request:

```http
POST /auth/request-otp
Content-Type: application/json
```

```json
{
  "channel": "whatsapp",
  "target": "+628123456789"
}
```

Verify:

```http
POST /auth/verify-otp
X-Device-ID: nextjs-dashboard
Content-Type: application/json
```

```json
{
  "channel": "whatsapp",
  "target": "+628123456789",
  "otp": "123456",
  "device_name": "Chrome macOS",
  "trusted_device": true
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
