# Contributing to Pleco Console

Thanks for helping improve Pleco Console.

## Development Setup

1. Clone the repository.
2. Copy `.env.example` to `.env.local` and adjust the API URL.
3. Run `npm install`.
4. Start the app with `npm run dev`.

## Code Style

- Use strict TypeScript and existing local component patterns.
- Keep UI changes accessible and responsive.
- Prefer small focused components when a page grows large.
- Run `npm run lint` and `npm run build` before opening a pull request.

## Commit Messages

Use conventional commit-style messages:

- `feat(auth): add social login`
- `fix(api): handle rate limit responses`
- `docs(readme): clarify setup`

## Pull Requests

Include a short summary, testing notes, and screenshots for visual changes. Update docs when behavior, configuration, or public setup steps change.
