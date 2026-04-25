# Go API Starterkit Dashboard

This is a simple Next.js demo dashboard for the `go-api-starterkit` backend.

## Features

- Admin login against the Go API
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

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Security Considerations

**Note**: This dashboard uses `localStorage` for JWT token persistence to keep the demonstration simple and stateless without a complex proxy server. In a production environment, this is a known trade-off that exposes the application to XSS attacks. For production use, it is highly recommended to migrate the authentication flow to use `httpOnly` cookies.
