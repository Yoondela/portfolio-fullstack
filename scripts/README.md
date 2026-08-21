# Integration Tests

## create-admin.ts

Creates the initial administrator record for Credentials authentication. It will fail if the email already exists.

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=your-password yarn tsx scripts/create-admin.ts
```

`DATABASE_URL` must be configured in `.env`.

## test-project-crud.ts

Temporary integration test for the Project CRUD data-access layer.

### Running the test

```bash
npx tsx scripts/test-project-crud.ts
```

### What it tests

- ✅ Creating a project
- ✅ Retrieving a project by ID
- ✅ Updating project fields
- ✅ Unpublished projects are excluded from `getPublishedProjects()`
- ✅ Publishing a project
- ✅ Published projects are included in `getPublishedProjects()`
- ✅ Deleting a project
- ✅ Verifying deletion

### Requirements

- `DATABASE_URL` must be set in `.env`
- Database schema must be initialized via `prisma migrate deploy`

### Notes

- This is a temporary integration test, not a permanent testing solution
- The test creates and cleans up a test project in the database
- All tests must pass for the script to exit successfully
- Database connection is properly closed after tests complete
