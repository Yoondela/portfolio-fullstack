# Engineer Portfolio Roadmap

## 1. Project / Architecture Foundation ✅

- Requirements
- Architecture decisions
- Server/client boundary
- Git/AI workflow

## 2. Database Foundation ✅

- PostgreSQL and Prisma 7
- Relational schema, UUIDs, cascade deletes, and migrations
- Prisma Client and database access layer
- Project CRUD and CRUD tests

## 3. Application Layer

- 3.1 Database milestone cleanup ✅
- 3.2 Authentication / authorization ✅
- 3.3 Server Actions — **current**
  - Use Server Actions for project-management mutations.
  - This follows ADR-004; no new ADR is needed.
- 3.4 Project management flow
  - Create, edit, delete, publish/unpublish
- 3.5 Public portfolio rendering
  - Projects, features, screenshots

## 4. UI / Frontend

- Portfolio layout and project pages
- Admin UI, responsive design, and UX polish

## 5. Testing / Hardening

- Unit and integration tests
- Validation, error handling, and security review

## 6. Deployment

- Production PostgreSQL and environment variables
- Deployment, migrations, and production verification
