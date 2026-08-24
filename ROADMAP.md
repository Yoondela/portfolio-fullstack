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
- 3.3 Server Actions ✅
  - Use Server Actions for project-management mutations.
  - This follows ADR-004; no new ADR is needed.
- 3.4 Project management flow ✅
  - ✅ Protect `/manage` server-side and list projects.
  - ✅ Create draft projects.
  - ✅ Edit project details.
  - ✅ Delete projects.
  - ✅ Publish/unpublish projects.
- 3.5 Public portfolio rendering ✅
  - ✅ Render published projects.
  - ✅ Render project features.
  - ✅ Add and edit project features in project forms.
  - ✅ Add URL-based screenshots to existing features and render them publicly.
  - ✅ Remove project features and screenshots.
- 3.6 Asset storage and uploads — **curent**
  - ✅ Provision a public Supabase Storage bucket for portfolio screenshots.
  - Persist generated screenshot storage paths in PostgreSQL.
  - Issue signed upload URLs only after server-side administrator authorization.
  - Upload one JPEG, PNG, or WebP image at a time directly from the browser.
  - Enforce a 5 MB upload limit and create screenshot records only after upload succeeds.
  - Delete Storage objects before deleting their screenshot, feature, or project database records.
  - Add validation, failure handling, and tests for the upload lifecycle.

## 4. UI / Frontend

- 4.1 Shared public layout
  - Establish site navigation, footer, typography, spacing, and responsive page container.
  - Apply the understated warm retro visual direction.
  - Add navigation for `/`, `/engineering`, and `/contact`.
- 4.2 Public portfolio presentation
  - Refine the homepage project list into a polished portfolio experience.
  - Present technologies, links, features, and screenshots accessibly.
  - Add responsive layouts for project content and images.
  - Add project detail pages only if the route is added to the requirements first.
- 4.3 Engineering and contact pages
  - Implement the static `/engineering` notebook page.
  - Implement the static `/contact` page.
  - Keep the contact form deferred, as required.
- 4.4 Admin management interface
  - Improve the `/manage` and project-management pages’ information hierarchy.
  - Make create, edit, publish, and delete flows clear and usable.
  - Improve feature and screenshot form interactions.
  - Ensure responsive and accessible admin UI.
- 4.5 UI quality pass
  - Verify keyboard navigation, focus states, semantic structure, contrast, and empty states.
  - Verify layouts across small and large viewports.
  - Remove placeholder styling and maintain visual consistency.

## 5. Testing / Hardening

- Unit and integration tests
- Validation, error handling, and security review

## 6. Deployment

- Production PostgreSQL and environment variables
- Deployment, migrations, and production verification
