
# Project Instructions

## Stack

Next.js 16, React 19, TypeScript, App Router, PostgreSQL, Prisma, Zod, SCSS, ESLint, Prettier, Yarn.

## Core principles

* Keep the application small and production-oriented.
* Do not invent requirements or add features without justification.
* Prefer simple, explicit solutions over abstractions and design patterns.
* Do not add dependencies without a clear reason.
* Do not use `any`.
* Do not use hacks to bypass type safety or runtime errors.
* Keep changes focused and avoid unrelated modifications.

## Next.js

* Use the App Router.
* Prefer Server Components by default.
* Use Client Components only when client-side interactivity or browser APIs require them.
* Keep secrets, database access, and server-only logic on the server.
* Follow the installed Next.js version; consult `node_modules/next/dist/docs/` when uncertain.

## Data

* PostgreSQL is the source of persistent application data.
* Use Prisma for database access.
* Do not access the database from presentation components.
* Validate external/user input with Zod before mutations.
* Consider relationships, constraints, nullability, indexes, migrations, and transaction boundaries.

## Security

* Authentication identifies the user; authorization determines what they can do.
* Public portfolio content is readable without authentication.
* Management operations require server-side authorization.
* Never expose secrets or trust client-side authorization.
* Treat external/user input as untrusted.

## UI

* Prefer small, cohesive components.
* Use semantic HTML and accessible forms/interactions.
* Handle relevant loading, empty, error, and unauthorized states.

## Engineering decisions

For significant architectural decisions, consider:

1. What problem are we solving?
2. What alternatives exist?
3. What are the important tradeoffs?
4. Why is this approach appropriate for this project?

Document meaningful architectural decisions in `docs/decisions/`.

When requirements or architecture are unclear, stop and surface the uncertainty rather than silently inventing a solution.
