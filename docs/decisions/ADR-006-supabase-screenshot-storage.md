# ADR-006: Supabase Storage for Portfolio Screenshots

## Status

Accepted (implementation pending)

## Context

Portfolio screenshots need persistent binary-file storage. PostgreSQL remains the source of truth for the application domain, but it is not suitable for image objects. The application needs a small upload flow that lets the authenticated administrator add screenshots without exposing elevated storage credentials to the browser.

The existing screenshot model stores a URL. It must instead retain a provider-independent object path so the application can construct public URLs and reliably remove the corresponding Storage object later.

## Decision

Use Supabase Storage only for portfolio screenshot files. Do not introduce Supabase Auth or Supabase Postgres.

- Create one public `portfolio-screenshots` bucket.
- Configure the bucket to accept only JPEG, PNG, and WebP files up to 5 MB.
- Store a generated `storagePath` in PostgreSQL for each `Screenshot`; do not store a Supabase public URL.
- Keep the Supabase URL, secret key, and bucket name in the existing `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `SUPABASE_STORAGE_BUCKET` environment configuration. The secret key remains server-only.
- A Server Action must call `requireAdmin()`, validate the requested image metadata, verify the target feature, generate the storage path, and create the signed upload URL.
- The browser uploads one selected image directly to Supabase using that short-lived signed upload URL.
- A separate authorized Server Action creates the screenshot record only after the browser reports a successful upload.
- Public rendering derives the public URL from the bucket and stored path.

Object paths should be generated under the project and feature that own them, for example:

```text
projects/{projectId}/features/{featureId}/{uuid}.webp
```

## Deletion lifecycle

For explicit screenshot, feature, and project deletion, collect the affected screenshot paths and remove their Storage objects first. Delete the relevant PostgreSQL record only after Storage cleanup succeeds.

This ordering prioritizes removal of a publicly reachable asset: a Storage failure leaves the database record intact and visible to the administrator, so the deletion can be retried without leaving an inaccessible or orphaned file. The cost is that a successful Storage deletion followed by a database failure can temporarily leave a screenshot record whose image no longer exists. The deletion operation must report that failure clearly so the administrator can retry the database deletion; distributed atomic transactions are not available across PostgreSQL and Supabase Storage.

An upload that succeeds but is not finalized must use an authorized cleanup action to remove its generated object. Broader scheduled orphan cleanup is deferred from the initial scope.

## Alternatives considered

### Store image data in PostgreSQL

This avoids a second service but increases database size, backup cost, and application transfer load. It is not appropriate for the portfolio's binary media.

### Store externally hosted URLs only

This is the current interim approach. It does not provide controlled upload, reliable deletion, or provider-independent asset ownership.

### Use a private bucket and signed download URLs

Private assets would protect draft screenshots, but published portfolio images would require expiring URLs or an application proxy. That additional delivery complexity is not justified for intended-public portfolio media.

### Upload through the Next.js server

This would keep the browser away from the storage API but sends image bytes through the application server and complicates request-size limits. Direct signed uploads keep the server responsible for authorization while transferring bytes directly to Storage.

## Consequences

- Screenshot uploads require a small client component for file selection and upload state; database access and privileged Storage operations remain server-side.
- The Prisma schema and migration must replace `Screenshot.url` with `Screenshot.storagePath`. Existing data must be assessed before migration; externally hosted URLs cannot be blindly treated as Storage paths.
- Project and feature cascade deletes alone are no longer sufficient. Application-level deletion operations must retrieve child storage paths before deleting database records.
- A public bucket means anyone with an object URL can retrieve the image. Draft screenshots must therefore contain no confidential information.
- Tests should mock the Storage client and cover authorization, validation, upload finalization, cleanup failures, and deletion ordering.

## References

- [Supabase Storage buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Supabase signed upload URLs](https://supabase.com/docs/reference/javascript/file-buckets-createsigneduploadurl)
- [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)

*Recorded:* 2026-08-24
*Author:* Architect / team
