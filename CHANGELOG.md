# Changelog

All notable changes to `pleco-console` will be documented in this file.

## Unreleased

- Sync dashboard auth flows with rotated tokens returned by `/auth/logout-others`.
- Remove stale `superadmin` assumptions from dashboard permission handling.
- Improve AI investigation risk scoring to consider signal volume, recommendation urgency, log volume, and failure-oriented status.
- Add project metadata cleanup and baseline release notes.

## 0.1.0

- Initial dashboard release with login, profile, user management, permissions, sessions, audit logs, and AI investigation views.
