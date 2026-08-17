# Testing Setup

## Vitest Configuration

This project uses **Vitest** for testing the database access layer. Tests run against the real PostgreSQL database through Prisma.

### Files Created

1. **vitest.config.ts** — Vitest configuration
   - Loads `.env` before running tests
   - Sets up `@/*` path alias to `src/*`
   - Aliases `server-only` module to a test stub to avoid Next.js runtime enforcement
   - Runs tests sequentially to avoid database connection pool issues

2. **__mocks__/server-only.ts** — Test stub
   - Harmless mock that allows `server-only` imports to work outside Next.js
   - `src/lib/projects.ts` imports `server-only` unchanged

3. **src/lib/__tests__/projects.test.ts** — Integration tests
   - 13 tests covering all CRUD operations
   - Tests run against real PostgreSQL database
   - Automatic cleanup after each test
   - Validates:
     - Creating projects with default state
     - Retrieving projects by ID
     - Updating project fields
     - Publishing/unpublishing projects
     - Deleting projects
     - `getPublishedProjects()` filtering and ordering
     - Zod validation

### Running Tests

```bash
# Run tests in watch mode
yarn test

# Run tests once and exit
yarn test:run
```

### Test Characteristics

- **Database**: Real PostgreSQL connection via `process.env.DATABASE_URL`
- **Isolation**: Each test creates its own test data and cleans up after completion
- **Speed**: ~30 seconds for full suite (includes database round-trips)
- **Type Safety**: Full TypeScript support with no `any`
- **No Mocking**: Actual Prisma operations against real database

### Requirements

- `.env` must have `DATABASE_URL` set
- Database schema must be initialized via `prisma migrate deploy`
- PostgreSQL must be running and accessible

### No Production Code Changes

- `src/lib/projects.ts` is unchanged
- `src/lib/project-validation.ts` is unchanged
- Vitest configuration handles the `server-only` module resolution
