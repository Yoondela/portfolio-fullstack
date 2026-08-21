# Auth Implementation Research

Scope: current Auth.js documentation checked for this Next.js 16.3.1 App Router project on 2026-08-20. This document records findings; it does not change the accepted credentials-based direction in ADR-005.

## Official documentation findings

### Package and App Router integration

- The Next.js package is `next-auth`; Auth.js currently documents installing `next-auth@beta`. `@auth/core` is not installed directly by applications. `@auth/prisma-adapter` is a separate adapter package, not the Next.js integration package. [Installation](https://authjs.dev/getting-started/installation)
- Auth.js recommends a root `auth.ts` that calls `NextAuth()` and exports `handlers`, `auth`, `signIn`, and `signOut`. The file may be named or located differently, but that is the documented convention. In this repository, `src/auth.ts` is an equivalent project-local placement because `@/*` resolves to `src/*`. [Installation](https://authjs.dev/getting-started/installation)
- The App Router handler is `app/api/auth/[...nextauth]/route.ts` (therefore `src/app/api/auth/[...nextauth]/route.ts` in this repository) and contains:

  ```ts
  import { handlers } from "@/auth"

  export const { GET, POST } = handlers
  ```

  This is a Next.js Route Handler. [Installation](https://authjs.dev/getting-started/installation)

### Credentials and session strategy

- `Credentials` passes submitted fields to `authorize`; `authorize` must validate them server-side and return a user or `null`. Auth.js does not persist credential data or implement password hashing, reset, or abuse controls. [Credentials guide](https://authjs.dev/getting-started/authentication/credentials)
- The current Credentials provider reference states that users authenticated through it are not persisted by Auth.js and that it **can only be used when JWT sessions are enabled**. Consequently, a native Credentials-only implementation cannot use Auth.js database sessions, including through `PrismaAdapter`. [Credentials provider reference](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/credentials.ts)
- JWT is the default session strategy unless a database adapter is configured. It is stored in an encrypted, `HttpOnly` cookie. Database sessions store an opaque session identifier in an `HttpOnly` cookie and require a database read for session access. JWTs cannot be centrally invalidated before expiry without maintaining a server-side blocklist; database sessions support server-side modification, global sign-out, and concurrent-session limits. [Session strategies](https://authjs.dev/concepts/session-strategies)

### Prisma models

The Prisma adapter’s documented canonical schema includes `User`, `Account`, `Session`, and `VerificationToken`, because it supports several authentication flows. [Prisma adapter](https://authjs.dev/getting-started/adapters/prisma)

| Situation | Required Auth.js models |
| --- | --- |
| Credentials-only with JWT (the supported strategy) | None for Auth.js. The application still needs its own `User`/`Admin` record for email, password hash, and authorization data. No `Session` model or Prisma adapter is used. |
| Database sessions with a compatible non-Credentials provider | `User` and `Session` for the adapter’s user/session operations. This is not a supported Credentials-provider configuration. |
| OAuth provider | `Account` in addition to the relevant user/session models, to link provider accounts. |
| Email/magic-link provider | `VerificationToken` in addition to the relevant user/session models. |

### Server-side access and protection

- In Server Components, Server Actions, and server-side authorization helpers, use `const session = await auth()`. It replaces older `getServerSession` usage in this integration. [Get session](https://authjs.dev/getting-started/session-management/get-session)
- A Route Handler may use `auth` as a wrapper; the wrapped request exposes `req.auth`. A handler may also call `await auth()` through a shared server helper. Return `401`/`403` for APIs and redirect unauthenticated UI requests from server code as appropriate. [Protecting resources](https://authjs.dev/getting-started/session-management/protecting)
- Next.js 16 calls the optional request gate `proxy.ts`, replacing `middleware.ts`. Auth.js documents `export { auth as proxy } from "@/auth"` and an `authorized` callback. It is useful for early redirects/session-expiry updates, but must not be the only authorization control: verify the session and administrator authorization beside the protected data access or mutation. [Protecting resources](https://authjs.dev/getting-started/session-management/protecting)

## Incorrect or unsupported claims removed from the previous research

- Database-backed sessions via `PrismaAdapter` are not an available alternative while retaining the native Credentials provider; the previous document treated them as compatible and recommended them.
- `Account` and `VerificationToken` are not required for this Credentials-only JWT application. Listing all four canonical adapter models as mandatory was inaccurate.
- The documented handler path is `[...nextauth]`, not `[...auth]`.
- `src/lib/auth.ts` is not the documented convention; a root-level `auth.ts` is. For this repository, `src/auth.ts` is a deliberate equivalent placement, not an official requirement.
- `requireAdmin()` is an application helper, not an Auth.js API. It must not claim that `isAdmin` is automatically returned by Auth.js; the application must obtain or expose that authorization fact deliberately.
- The earlier document’s unconditional `session` configuration (`maxAge` and `updateAge`), cookie overrides, `argon2` preference, and version-compatibility assertions were not retained because they were not needed to answer this integration decision or were not verified here.

## Project recommendation / decision

Use the supported Credentials + JWT combination. This is not a recommendation based merely on fewer tables: it is the session strategy required by the Credentials provider. PostgreSQL and Prisma remain necessary for the administrator’s credential record and server-side authorization data, but the Auth.js Prisma adapter would not create usable database sessions for this login mechanism.

For a single administrator, JWT sessions avoid an additional session-table read and are secure when `AUTH_SECRET` has high entropy, session contents are minimal, and expiry is deliberately bounded. The material tradeoff is revocation: signing out deletes the cookie but cannot invalidate a copied JWT before it expires without a server-side denylist. If immediate global revocation, concurrent-session controls, or centrally managed session state becomes a requirement, do not add `PrismaAdapter` to this Credentials flow; revisit the authentication mechanism (for example, a compatible OAuth, email, or passkey flow) or record a separate custom-session design decision.

Server-side authorization remains mandatory. Base authorization on a trusted server-side lookup of the administrator record for protected mutations, rather than treating client-visible session data as the sole authority. `requireAdmin()` calls `auth()`, verifies an authenticated identity, and loads the administrator record; every protected mutation must use it. The `/manage` layout and optional `proxy.ts` can improve UI routing, but do not replace mutation-level checks.

## Implemented direction

- **Package:** `next-auth` v5 with `next-auth/providers/credentials`; `@auth/prisma-adapter` is not used.
- **File structure:** `src/auth.ts` exports Auth.js configuration; `src/app/api/auth/[...nextauth]/route.ts` re-exports `GET` and `POST`; `src/lib/auth/authorization.ts` provides `requireAdmin()` for server-side mutation checks.
- **Session strategy:** JWT with a 48-hour lifetime.
- **Prisma:** the application-owned `User` model stores the unique email, Argon2id password hash, and current `isAdmin` authorization state. No Auth.js `Session`, `Account`, or `VerificationToken` model is used.
- **Bootstrap:** `scripts/create-admin.ts` creates the initial administrator from environment variables.
- **Authorization:** every protected mutation must call `requireAdmin()`, which verifies both the authenticated identity and current database-backed administrator status.
