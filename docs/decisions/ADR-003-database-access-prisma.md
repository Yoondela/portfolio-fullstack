# ADR-003: Database Access — Prisma

## Status
Accepted

## Context
The codebase uses TypeScript and requires a type-safe, productive data-access layer with schema/migration tooling and good DX for model-driven development.

## Decision
Use Prisma as the application's database access layer. Generate types from the Prisma schema and access the database from server-side code only.

## Alternatives Considered
- Raw pg (node-postgres) with manual queries
- TypeORM, Objection.js, or other ORMs

## Tradeoffs
Gains: first-class TypeScript types, clear schema-driven workflow, and a migration system. Costs: additional build/runtime dependency and need to follow Prisma deployment best practices (client instantiation, binary generation).

## Consequences
Prisma Client must be used only in server code (server components, route handlers, Server Actions). Follow Next.js recommended singleton pattern for the Prisma client to avoid connection exhaustion in development and serverless environments. Define migration and deployment workflows; decide connection pooling provider for production. (Missing: concrete migration runner and deployment steps — to be documented when deployment target is chosen.)
