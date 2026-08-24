<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project progression

Use `ROADMAP.md` to determine the current milestone and what work comes next.

Do not implement later milestones prematurely.

When asked what to work on next, inspect the roadmap and current implementation before proposing work.

Keep roadmap uptodate with '**curent**' to show where we are and checkmark completted tasks with ✅

## Implementation summary

After making code changes, end with a numbered list of affected files.

For each file, include:
1. path
2. status: Created / Edited / Deleted
3. short description of the change

Example:

1. `src/auth.ts` — Created — Added Auth.js configuration.
2. `src/lib/auth/authorization.ts` — Edited — Added admin authorization check.
3. `docs/testing.md` — Edited — Clarified testing rules.
4. `docs/button.tsx` — Deleted — Not used.

### Next.js Server Actions

- Files containing `"use server"` may only export async functions.
- Do not export objects, constants, synchronous functions, or other runtime values from `"use server"` modules.
- Move shared constants/helpers to separate modules when they need to be exported.

### Git Discipline

- Avoid working on main branch.
- If on main and must make significant changes, create or switch to a relevant branch
- Only a small task like align button and/or rename a function can be made on main branch

# Reviewer mode

When reviewing requested changes, do not modify files unless explicitly asked.

Review for correctness, security, architecture, authentication and server-side authorization, input validation, database access boundaries, maintainability, accessibility, error/loading states, and unnecessary complexity, abstractions, or dependencies. Check the changes against existing project documentation and ADRs.

Prioritize blockers and important issues over style. For every finding, explain why it matters and suggest a concrete fix. Do not invent requirements or recommend extra architecture unless justified by the current requirements.

End reviews with findings grouped as: **Blockers**, **Should fix**, and **Optional**.

Structure **Should fix** with Issue: and Do:

## UI / Styling

- Use Tailwind CSS for styling.
- Keep the interface minimal and functional.
- Visual direction: understated 1980s retro lifestyle aesthetic — think late-night malls, restaurants, lounges, hotel interiors, record-store photography, and soft analog editorial design.
- Aim for a dreamy, warm, slightly nostalgic atmosphere rather than a techy, cyberpunk, arcade, or synthwave look.
- References for mood include the relaxed visual atmosphere associated with Drifty Dreams, 53 Thieves, and Cannons — especially the late-night, intimate, polished feel rather than copying any specific artwork.
- Prefer restrained typography, generous spacing, soft contrast, subtle borders/shadows, muted surfaces, and occasional retro accents.
- Avoid excessive gradients, neon grids, glowing effects, pixel fonts, futuristic HUD styling, or stereotypical “80s tech” visuals.
- Functionality and readability come before decoration.
- During application-layer work, keep styling basic enough that the later UI/Frontend milestone can refine it without major rewrites.

Ideas in `docs/NEXT_VERSION_IDEAS.md` are future considerations, not current requirements. Do not implement them as part of current version.