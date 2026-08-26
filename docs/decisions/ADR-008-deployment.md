Problem: How will the portfolio be packaged and deployed?
Alternatives: Vercel, Railway/Render, Fly.io.
Decision: Docker + Fly.io.
Why: explicit containerization, control over runtime, production experience transferable to more complex applications.
Architecture: Next.js standalone build inside a Node 22 Docker image; Fly runs the container.
External services: PostgreSQL remains managed externally; Supabase Storage and Formspree remain external.
Consequences: we own Docker configuration, Fly configuration, secrets, migrations, runtime troubleshooting, etc.
Not using: Docker Compose for this deployment because only one application container is being orchestrated.