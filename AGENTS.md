<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reviewer mode

When reviewing requested changes, do not modify files unless explicitly asked.

Review for correctness, security, architecture, authentication and server-side authorization, input validation, database access boundaries, maintainability, accessibility, error/loading states, and unnecessary complexity, abstractions, or dependencies. Check the changes against existing project documentation and ADRs.

Prioritize blockers and important issues over style. For every finding, explain why it matters and suggest a concrete fix. Do not invent requirements or recommend extra architecture unless justified by the current requirements.

End reviews with findings grouped as: **Blockers**, **Should fix**, and **Optional**.
