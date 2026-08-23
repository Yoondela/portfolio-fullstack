import Link from "next/link";
import { requireAdmin } from "@/lib/auth/authorization";
import { getProjects } from "@/lib/projects";

/** Renders the draft-inclusive project list after server-side authorization. */
export default async function ManageProjectsPage() {
  await requireAdmin();
  const projects = await getProjects();

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link
          href="/manage/projects/new"
          className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-4 text-zinc-600">No projects yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="rounded border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <h2 className="font-medium">{project.name}</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {project.published ? "Published" : "Draft"} · Order {project.displayOrder}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
