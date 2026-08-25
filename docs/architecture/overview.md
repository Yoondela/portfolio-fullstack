# Portfolio Architecture Overview

## 1. Architectural goal

The application should remain a small, understandable, production-oriented full-stack application.

The architecture should demonstrate real engineering concepts without introducing complexity that the requirements do not justify.

## 2. High-level architecture

```text
Browser
   │
   ▼
Next.js
   │
   ├── Public pages
   ├── Admin pages
   ├── Server Components
   ├── Client Components
   ├── Authentication
   └── Validation
          │
          ▼
   Application/server logic
          │
          ▼
        Prisma
          │
          ▼
      PostgreSQL
```

## 3. Application architecture

The project uses a single Next.js application.

A separate backend service is not required for v1.

### Alternative

A separate frontend and Express backend could provide a clearer API boundary.

### Tradeoff

A separate backend would introduce another application, deployment, API boundary, authentication boundary, and additional infrastructure.

That complexity is not justified by the current requirements.

## 4. Rendering architecture

Server Components are the default.

Client Components are used when browser-side behavior is required, including:

* interactive state
* event handlers
* browser APIs
* client-only libraries

Database access, authentication checks, authorization, secrets, and server-only logic remain on the server.

## 5. Data architecture

PostgreSQL is the persistent relational database.

Prisma is the application's database access layer.

The initial domain model is:

```text
Project
   │
   └── Feature
          │
          └── Screenshot
```

### Project

Represents a portfolio project.

### Feature

Represents a meaningful capability of a project.

### Screenshot

Represents visual evidence of a feature.

Projects and their children support explicit display ordering.

Projects also have a published/unpublished state.

## 6. Data access boundary

The intended flow is:

```text
UI
 ↓
Server-side application logic
 ↓
Prisma
 ↓
PostgreSQL
```

Presentation components should not become the application's general database-access layer.

The architecture should not introduce a repository/service abstraction until complexity demonstrates a need for one.

## 7. Authentication and authorization

Authentication determines the identity of a user.

Authorization determines whether that user is allowed to perform an operation.

Public portfolio content is accessible without authentication.

Administrative mutations require server-side authorization.

Hiding administrative UI is not considered sufficient authorization.

## 8. Validation

External and user-controlled input is treated as untrusted.

Zod provides runtime validation at application boundaries.

Validation occurs before database mutations.

## 9. Client state

No global state-management library is required for v1.

Local React state should be used where client-side state is actually needed.

Server-rendered data should remain server-managed where practical.

## 10. API architecture

A separate Express API is not required.

Project-management mutations use Server Actions because they serve administrative forms within this App Router application and have no external API consumers. Each action authorizes with `requireAdmin()`, validates FormData with Zod, performs the Prisma-backed mutation, and revalidates the affected views. Route Handlers remain appropriate if a future requirement needs a reusable HTTP API.

## 11. Image architecture

Supabase Storage is the selected provider for screenshot files. PostgreSQL persists generated screenshot object paths rather than provider URLs. A temporary nullable legacy URL is retained only for screenshots created before the Storage migration, so they remain renderable until migrated or removed.

The upcoming signed-upload action will use a Supabase secret key only after server-side administrator authorization. Browsers will upload files directly to Storage; they will never receive the secret key. Bucket configuration and application validation limit uploads to JPEG, PNG, and WebP files up to 5 MB. See ADR-006 for the full storage and deletion lifecycle decision.

## 12. Deployment architecture

Deployment infrastructure is intentionally deferred until the application requirements and runtime characteristics are clearer.
