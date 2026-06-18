# API Integration Guide

Configure the API base URL with `NEXT_PUBLIC_API_BASE_URL`.

The dashboard is database-agnostic. PostgreSQL/MySQL selection is handled by the API through `DB_DRIVER` and `DATABASE_URL`; no dashboard database setting is required.

## Authentication

### Login

```http
POST /auth/login
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

### Passwordless Login

The login page first checks that the email or WhatsApp number belongs to an existing user without sending anything. On the second step, the backend decides whether to send a magic link for a trusted device or an OTP for normal verification. The UI does not expose trusted-device state.

Check identity:

```http
POST /auth/passwordless/check
Content-Type: application/json
```

```json
{
  "channel": "whatsapp",
  "target": "+628123456789"
}
```

Start passwordless delivery:

```http
POST /auth/passwordless/start
Content-Type: application/json
```

```json
{
  "channel": "whatsapp",
  "target": "+628123456789"
}
```

If the response data has `next_step=otp`, verify the code:

```http
POST /auth/verify-otp
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

If a magic link is sent, the link opens `/login?magic_token=...`; the dashboard verifies it through `POST /auth/magic-link/verify`. Magic links are single-use, DB-backed tokens and reused links are rejected.

Passwordless OTP never creates a new account. Unknown email addresses or WhatsApp numbers should show the API error message and stop the flow.

The dashboard does not create a device id in JavaScript. The API owns device identity through the `pleco_device_id` HttpOnly cookie, and also sets the `pleco_refresh_token` HttpOnly cookie for refresh rotation.

### Refresh Token

The dashboard automatically calls `POST /auth/refresh` after a `401` response. The refresh token should be stored by the API as the `pleco_refresh_token` HttpOnly cookie.

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
