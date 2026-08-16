# ADR-004: Server / Client Boundary

## Status
Accepted

## Context
Security, secrets, and database integrity require a clear boundary between server-only logic (auth, DB access, secrets) and client-side UI code. Administrative mutations must be authorized server-side.

## Decision
Enforce a server-side boundary: keep database access, authentication checks, authorization, secrets, and validation on the server. Use Server Components for server-rendered UI; Client Components only for interactive behavior. Use Zod at boundaries for runtime validation. Use Server Actions or Next.js Route Handlers for mutations as appropriate.

## Alternatives Considered
- Allow some direct client-driven data access (not permitted)
- Move more logic into the client with tokens (increases risk)

## Tradeoffs
Gains: stronger security, simpler reasoning about privileges, and no secrets in bundles. Costs: more server-side code and the need for explicit mutation endpoints or server action design decisions.

## Consequences
All administrative operations must perform server-side authorization checks before mutations. Presentation components must not perform direct DB access. Decide per-endpoint whether to implement mutations as Server Actions or Route Handlers; document the chosen approach where mutations are implemented.
