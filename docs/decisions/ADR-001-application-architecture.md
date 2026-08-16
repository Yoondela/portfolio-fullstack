# ADR-001: Application Architecture

## Status
Accepted

## Context
The project must be a small, production-oriented portfolio that demonstrates engineering concepts (Next.js, TypeScript, authentication, validation, CRUD) without unnecessary infrastructure. The team prefers minimal operational surface for v1.

## Decision
Use a single Next.js application (App Router) as the entire application stack. Server Components are the default; Client Components used only where browser interactivity is required. No separate backend service for v1.

## Alternatives Considered
- Separate frontend + backend (Express or similar)
- Microservices or a multi-repo architecture

## Tradeoffs
Gains: simpler development and deployment, fewer infra and auth boundaries, direct access to Next.js server features. Gives up: stronger process isolation, independent scaling and deployment of a backend, and a clean network API boundary.

## Consequences
Database access, secrets, authentication, and authorization must remain server-side. Use Server Components for server-rendered pages and Client Components only for interactivity. Revisit separation only if future requirements justify an independent backend.
