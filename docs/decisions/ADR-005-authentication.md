# ADR-005: Authentication Strategy — Auth.js / NextAuth.js v5 (Credentials)

## Status
Accepted (implemented)

## Context / problem being solved
This project is a small, production-oriented Next.js portfolio with an administrative section for managing projects. Administrative operations (create/edit/delete projects and related content) must be protected so only the portfolio owner (administrator) can perform them. The system must be simple to implement, easy to reason about, and follow the project's security and server-side boundary principles described in ADR-001 and ADR-004.

## Authentication requirements (from v1 requirements)
- Administrative management operations require server-side authorization.
- Public portfolio content is readable without authentication.
- The initial v1 scope does not require public user accounts or multiple administrator roles; a single administrator identity is sufficient.
- User-controlled input must be validated before mutations (Zod is used in the project).
- Secrets must not be exposed to the client or committed to source control.

## Alternatives considered
1. Auth.js (with the Credentials provider for email/password)
2. Custom authentication/session implementation built in-house
3. External authentication provider (OAuth, OIDC) such as GitHub, Google, or an identity provider

## Tradeoffs (important points for each alternative)

### 1) Auth.js (Credentials)
- Pros:
  - Mature, actively maintained library with Next.js-first ergonomics and adapters
  - Supports Credentials provider allowing email/password flows implemented server-side
  - Integrates with Next.js App Router route handlers and Server Actions
  - Reduces boilerplate compared to building sessions, cookies, and security primitives from scratch
- Cons:
  - Adds a dependency and a small integration surface to the app
  - Credentials authentication requires JWT sessions; it cannot use Auth.js database sessions through `@auth/prisma-adapter`
  - The application remains responsible for its identity record, password verification, and authorization state

### 2) Custom authentication/session implementation
- Pros:
  - Full control over behavior and minimal external dependencies
  - Tailored exactly to the project's constraints and data model
- Cons:
  - High maintenance burden and security risk (sessions, cookie handling, token storage, CSRF, replay and brute-force protections)
  - Reimplements well-solved primitives (password hashing, session lifecycle, secure cookie flags)
  - Slower to implement and higher chance of subtle vulnerabilities

### 3) External authentication provider (OAuth/OIDC)
- Pros:
  - Offloads credential management and MFA to a third party
  - Simple sign-in UX for administrators who already have provider accounts
  - Minimal password handling in the application
- Cons:
  - Admin must have an account with the provider (less local control)
  - Adds an external dependency and configuration (client IDs, secrets, redirect URIs)
  - More complex to set up for a single-admin personal portfolio and does not meet the explicit requirement for credentials-based admin login

## Decision
Adopt Auth.js / NextAuth.js v5 with the Credentials provider for email-and-password administrator authentication. Use Auth.js on the server side only with JWT sessions and a 48-hour (two-day) lifetime. Do not use `@auth/prisma-adapter` for this Credentials-only design.

PostgreSQL/Prisma will store an application-owned `User` record with `email`, `passwordHash`, `isAdmin`, `createdAt`, and `updatedAt`. Passwords will be hashed with Argon2id. Auth.js `Session`, `Account`, and `VerificationToken` models are not required for this Credentials-only JWT design. The initial administrator will be created through a dedicated bootstrap script.

The implementation uses `src/auth.ts`, the App Router handler at `src/app/api/auth/[...nextauth]/route.ts`, and a server-side `requireAdmin()` helper. Future protected mutations must call the helper before changing data.

## Why Auth.js (Credentials) is appropriate for this project
- Aligns with the project's goals to remain small and production-oriented while leveraging established, well-tested libraries for security-critical features.
- Matches the requirement for a credentials-based email/password admin login rather than relying solely on external providers.
- Fits the Next.js App Router and server-only boundary decisions documented in ADR-001 and ADR-004: all auth checks and secret handling remain server-side.
- Reduces the surface of custom security code the team must write and maintain while keeping the implementation straightforward for a single-admin portfolio.

## Authentication vs Authorization (separation of concerns)
- Authentication confirms the identity (who the user is) — Auth.js will handle identity establishment and session lifecycle.
- Authorization determines what that identity is allowed to do — authorization checks remain the responsibility of server-side application code and must be enforced before any administrative mutation (per ADR-004). Role checks (e.g., `isAdmin`) and resource-level checks should be implemented in mutation handlers or Server Actions.

## Implementation constraints

- Configure Auth.js for JWT sessions with a 48-hour lifetime; do not add `@auth/prisma-adapter` or Auth.js session models for this Credentials-only design.
- Add an application-owned `User` record in PostgreSQL with `email`, `passwordHash`, `isAdmin`, `createdAt`, and `updatedAt`; hash passwords with Argon2id.
- Create the initial administrator through a dedicated bootstrap script.
- Keep authentication and authorization separate: before every protected mutation, server-side code must verify the authenticated identity and administrator authorization.

## Consequences
- The application-owned `User` model and migration store administrator credentials and authorization state. Auth.js `Session`, `Account`, and `VerificationToken` models are not used.
- Auth.js / NextAuth.js v5 handles credential login/logout with 48-hour JWT sessions; the application verifies passwords with Argon2id.
- Authorization checks must be added to all administrative mutation endpoints and Server Actions — authentication alone does not provide authorization.
- PostgreSQL and Prisma remain the source of truth for administrator credentials and authorization state, rather than Auth.js session storage.

## Implementation notes
- `scripts/create-admin.ts` creates the initial administrator from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Use `requireAdmin()` from `src/lib/auth/authorization.ts` in every future protected mutation.


## Consistency check against existing documents
- This decision preserves the server-side boundary from ADR-001 and ADR-004: auth and secrets remain server-side.
- It satisfies the v1 requirements: single administrator, credential-based login, server-side authorization for management operations.


*Recorded:* 2026-08-18
*Author:* Architect / team
