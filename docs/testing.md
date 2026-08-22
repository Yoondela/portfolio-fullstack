# Testing Setup

## Vitest Configuration

This project uses **Vitest** for two distinct test categories:

- **Prisma/data-access integration tests** use the real PostgreSQL database through Prisma. They must not mock database access.
- **Focused unit/boundary tests** may mock external boundaries when testing server-side decisions in isolation.

### Files Created

1. **vitest.config.ts** — Vitest configuration
   - Loads `.env` before running tests
   - Sets up `@/*` path alias to `src/*`
   - Aliases `server-only` module to a test stub to avoid Next.js runtime enforcement

2. **__mocks__/server-only.ts** — Test stub
   - Harmless mock that allows `server-only` imports to work outside Next.js
   - `src/lib/projects.ts` imports `server-only` unchanged

3. **src/lib/__tests__/projects.test.ts** — Integration tests
   - 13 tests covering all CRUD operations
   - Tests run against real PostgreSQL database
   - No mocking: actual Prisma operations exercise the data-access layer
   - Automatic cleanup after each test
   - Validates:
     - Creating projects with default state
     - Retrieving projects by ID
     - Updating project fields
     - Publishing/unpublishing projects
     - Deleting projects
     - `getPublishedProjects()` filtering and ordering
     - Zod validation

4. **`src/lib/auth/__tests__/` and `src/app/manage/projects/__tests__/`** — Unit tests
   - May mock authentication, data access, and Next.js framework boundaries
   - Cover credential/authorization and Server Action boundaries without database I/O

### Running Tests

```bash
# Run tests in watch mode
yarn test

# Run tests once and exit
yarn test:run
```

### Test Characteristics

#### Prisma/data-access integration tests

- **Database**: Real PostgreSQL connection via `process.env.DATABASE_URL`
- **No mocking**: Actual Prisma operations exercise the data-access layer
- **Isolation**: Each test creates its own test data and cleans up after completion

#### Focused unit/boundary tests

- **Mocks allowed**: Authentication, data access, and Next.js framework boundaries may be mocked to exercise Server Actions and similar boundaries directly
- **Type safety**: Full TypeScript support with no `any`

### Requirements

- Prisma/data-access integration tests require `.env` to have `DATABASE_URL` set, the schema to be initialized via `prisma migrate deploy`, and PostgreSQL to be running and accessible

### No Production Code Changes

- `src/lib/projects.ts` is unchanged
- `src/lib/project-validation.ts` is unchanged
- Vitest configuration handles the `server-only` module resolution
